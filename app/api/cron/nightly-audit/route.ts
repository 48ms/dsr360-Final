import { NextRequest, NextResponse } from "next/server";
import { runAutonomousNightlyDispatcher } from "@/lib/ai/hermes";
import { createClient } from "@/lib/supabase/server";
import { getTodayWIB } from "@/lib/utils/format";
import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import type { FollowUpActivityType } from "@/constants/enums";

export const dynamic = "force-dynamic";
export const maxDuration = 60; // Allow up to 60s for full account portfolio scan

export async function GET(request: NextRequest) {
  const startMs = Date.now();

  try {
    // 1. Verify Authorization Header if CRON_SECRET is configured
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      // If deployed on Vercel, Vercel Cron automatically sends Authorization: Bearer <CRON_SECRET>
      return NextResponse.json(
        { error: "Unauthorized: Invalid or missing CRON_SECRET token." },
        { status: 401 }
      );
    }

    // 2. Execute Hermes 3 Autonomous Nightly Engine
    const auditResult = await runAutonomousNightlyDispatcher();
    const supabase = await createClient();
    const todayWIB = getTodayWIB();

    let newTasksCreated = 0;
    let existingTasksUpdated = 0;
    const actionLog: Array<{
      customerId: string;
      customerName: string;
      category: string;
      actionTaken: "NEW_TASK_INSERTED" | "EXISTING_TASK_UPDATED";
    }> = [];

    // Fetch fallback profile ID for automated task ownership
    const { data: defaultProfile } = await supabase
      .from("profiles")
      .select("id")
      .limit(1)
      .maybeSingle();
    const fallbackUserId = defaultProfile?.id;

    // 3. Smart Deduplication & Materialize Findings to follow_ups table
    for (const finding of auditResult.criticalFindings) {
      if (!finding.customerId) continue;

      // Check if customer already has an active PENDING follow-up
      const { data: existingTask } = await supabase
        .from("follow_ups")
        .select("id, description, priority")
        .eq("customer_id", finding.customerId)
        .eq("status", "PENDING")
        .limit(1)
        .maybeSingle();

      if (existingTask) {
        // Update existing task with updated Hermes diagnosis and guarantee HIGH priority
        const updatedDesc = `[Hermes Nightly Update ${todayWIB}] ${finding.diagnosis}\n➔ Rekomendasi: ${finding.actionPlan} (${finding.suggestedPillar})`;

        await supabase
          .from("follow_ups")
          .update({
            priority: "HIGH",
            description: updatedDesc,
            updated_at: new Date().toISOString(),
          })
          .eq("id", existingTask.id);

        existingTasksUpdated++;
        actionLog.push({
          customerId: finding.customerId,
          customerName: finding.customerName,
          category: finding.category,
          actionTaken: "EXISTING_TASK_UPDATED",
        });
      } else {
        // Resolve customer owner / creator for user_id
        const { data: custData } = await supabase
          .from("customers")
          .select("owner_id, created_by")
          .eq("id", finding.customerId)
          .maybeSingle();

        const assignedUserId = custData?.owner_id || custData?.created_by || fallbackUserId;
        if (!assignedUserId) continue;

        // Determine recommended activity type
        let activityType: FollowUpActivityType = "VISIT";
        if (finding.category === "STUCK_DEAL") {
          activityType = "WHATSAPP";
        } else if (finding.category === "REPEAT_ORDER") {
          activityType = "CALL";
        }

        const newTaskId = randomUUID();
        const initialDesc = `[Hermes Auto-Radar] ${finding.diagnosis}\n➔ Rekomendasi: ${finding.actionPlan} (${finding.suggestedPillar})`;

        const { error: insertErr } = await supabase.from("follow_ups").insert({
          id: newTaskId,
          customer_id: finding.customerId,
          user_id: assignedUserId,
          activity_type: activityType,
          description: initialDesc,
          due_date: todayWIB,
          priority: "HIGH",
          status: "PENDING",
        });

        if (!insertErr) {
          newTasksCreated++;
          actionLog.push({
            customerId: finding.customerId,
            customerName: finding.customerName,
            category: finding.category,
            actionTaken: "NEW_TASK_INSERTED",
          });
        }
      }
    }

    // Revalidate CRM paths so morning sales dashboard is fresh
    revalidatePath("/follow-ups");
    revalidatePath("/dashboard");
    revalidatePath("/customers");

    const executionDurationMs = Date.now() - startMs;

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      executionDurationMs,
      engineUsed: auditResult.engineUsed,
      summaryMessage: auditResult.summaryMessage,
      metrics: {
        accountsScanned: auditResult.auditedCustomersCount,
        criticalFindingsCount: auditResult.criticalFindings.length,
        newTasksCreated,
        existingTasksUpdated,
      },
      actionLog,
    });
  } catch (error: unknown) {
    console.error("[Cron Nightly Audit Error]:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Internal server error during nightly audit execution.",
        executionDurationMs: Date.now() - startMs,
      },
      { status: 500 }
    );
  }
}
