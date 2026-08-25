"use server";

import { createClient } from "@/lib/supabase/server";
import {
  followUpSchema,
  completeFollowUpSchema,
  type FollowUpInput,
  type CompleteFollowUpInput,
} from "@/lib/validations/follow-up";
import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";

export type FollowUpItem = {
  id: string;
  activity_type: string;
  description: string | null;
  due_date: string;
  priority: "LOW" | "MEDIUM" | "HIGH";
  status: "PENDING" | "COMPLETED" | "CANCELLED";
  completed_at: string | null;
  result: string | null;
  created_at: string;
  customer: {
    id: string;
    customer_name: string;
    customer_code: string;
    city: string | null;
    primary_phone: string | null;
    primary_pic: string | null;
  } | null;
  opportunity: {
    id: string;
    opportunity_name: string;
    stage: string;
  } | null;
};

export async function listFollowUps() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("follow_ups")
    .select(
      `
      id,
      activity_type,
      description,
      due_date,
      priority,
      status,
      completed_at,
      result,
      created_at,
      customer:customers (
        id,
        customer_name,
        customer_code,
        city,
        contacts:customer_contacts (
          name,
          phone,
          is_primary
        )
      ),
      opportunity:opportunities (
        id,
        opportunity_name,
        stage
      )
    `
    )
    .order("due_date", { ascending: true });

  if (error) {
    console.error("listFollowUps error:", error.message);
    return [];
  }

  type RawFollowUp = {
    id: string;
    activity_type: string;
    description: string | null;
    due_date: string;
    priority: "LOW" | "MEDIUM" | "HIGH";
    status: "PENDING" | "COMPLETED" | "CANCELLED";
    completed_at: string | null;
    result: string | null;
    created_at: string;
    customer: {
      id: string;
      customer_name: string;
      customer_code: string;
      city: string | null;
      contacts: Array<{
        name: string;
        phone: string | null;
        is_primary: boolean;
      }> | null;
    } | null;
    opportunity: {
      id: string;
      opportunity_name: string;
      stage: string;
    } | null;
  };

  const items: FollowUpItem[] = ((data ?? []) as unknown as RawFollowUp[]).map((f) => {
    // Pick primary contact or first contact
    const contacts = f.customer?.contacts ?? [];
    const primary = contacts.find((c) => c.is_primary) || contacts[0];

    return {
      id: f.id,
      activity_type: f.activity_type,
      description: f.description,
      due_date: f.due_date,
      priority: f.priority,
      status: f.status,
      completed_at: f.completed_at,
      result: f.result,
      created_at: f.created_at,
      customer: f.customer
        ? {
            id: f.customer.id,
            customer_name: f.customer.customer_name,
            customer_code: f.customer.customer_code,
            city: f.customer.city,
            primary_phone: primary?.phone ?? null,
            primary_pic: primary?.name ?? null,
          }
        : null,
      opportunity: f.opportunity
        ? {
            id: f.opportunity.id,
            opportunity_name: f.opportunity.opportunity_name,
            stage: f.opportunity.stage,
          }
        : null,
    };
  });

  return items;
}

export async function createFollowUp(input: FollowUpInput) {
  const parsed = followUpSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Input tidak valid" };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Sesi login berakhir, silakan login ulang." };
  }

  const newId = randomUUID();
  const { error } = await supabase.from("follow_ups").insert({
    ...parsed.data,
    id: newId,
    user_id: user.id,
    status: "PENDING",
  });

  if (error) {
    console.error("createFollowUp error:", error.message);
    return { error: "Gagal membuat follow-up. Coba lagi." };
  }

  revalidatePath("/follow-ups");
  return { success: true };
}

export async function completeFollowUp(input: CompleteFollowUpInput) {
  const parsed = completeFollowUpSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Input tidak valid" };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Sesi login berakhir, silakan login ulang." };
  }

  const {
    follow_up_id,
    result,
    has_chain,
    chain_activity_type,
    chain_description,
    chain_due_date,
    chain_priority,
  } = parsed.data;

  // 1. Fetch current follow up to get customer_id & opportunity_id
  const { data: currentTask } = await supabase
    .from("follow_ups")
    .select("customer_id, opportunity_id, visit_id")
    .eq("id", follow_up_id)
    .single();

  if (!currentTask) {
    return { error: "Follow-up tidak ditemukan." };
  }

  // 2. Mark completed
  const { error: updateError } = await supabase
    .from("follow_ups")
    .update({
      status: "COMPLETED",
      completed_at: new Date().toISOString(),
      result,
      updated_at: new Date().toISOString(),
    })
    .eq("id", follow_up_id);

  if (updateError) {
    console.error("completeFollowUp error:", updateError.message);
    return { error: "Gagal menyelesaikan follow-up." };
  }

  // 3. Create Chained Next Action if requested
  if (has_chain && chain_description && chain_due_date && chain_activity_type) {
    const nextTaskId = randomUUID();
    const { error: chainError } = await supabase.from("follow_ups").insert({
      id: nextTaskId,
      customer_id: currentTask.customer_id,
      opportunity_id: currentTask.opportunity_id,
      visit_id: currentTask.visit_id,
      user_id: user.id,
      activity_type: chain_activity_type,
      description: chain_description,
      due_date: chain_due_date,
      priority: chain_priority || "MEDIUM",
      status: "PENDING",
    });

    if (chainError) {
      console.error("create chained follow-up error:", chainError.message);
    }
  }

  revalidatePath("/follow-ups");
  revalidatePath("/dashboard");
  return { success: true };
}
