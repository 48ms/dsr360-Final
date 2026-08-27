"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export type SphApprovalItem = {
  opportunityId: string;
  opportunityName: string;
  sphNumber: string;
  customerId: string;
  customerName: string;
  customerCity: string | null;
  dsrName: string;
  dsrArea: string | null;
  potentialValue: number;
  potentialVolume: number;
  discountReason: string;
  status: "PENDING_APPROVAL" | "APPROVED" | "REJECTED";
  submittedAt: string;
};

/**
 * Fetches all SPH quotations awaiting Manager discount approval
 */
export async function getPendingSphApprovals(): Promise<SphApprovalItem[]> {
  const supabase = await createClient();

  const [
    { data: opportunities },
    { data: profiles },
  ] = await Promise.all([
    supabase
      .from("opportunities")
      .select(
        `
        id,
        opportunity_name,
        stage,
        potential_value,
        potential_volume,
        customer_need,
        objection,
        created_by,
        created_at,
        updated_at,
        customer:customers (id, customer_name, city)
      `
      )
      .in("stage", ["QUOTATION", "NEGOTIATION", "PROSPECT"])
      .ilike("customer_need", "%PENDING_APPROVAL%")
      .order("updated_at", { ascending: false }),
    supabase.from("profiles").select("id, full_name, sales_area"),
  ]);

  const oppList = opportunities ?? [];
  const profList = profiles ?? [];

  return oppList.map((opp) => {
    const owner = profList.find((p) => p.id === opp.created_by);
    const needText = opp.customer_need || "";

    // Extract SPH Number & Reason from customer_need string
    const sphMatch = needText.match(/No\.\s*([\w\/\-]+)/i);
    const sphNumber = sphMatch ? sphMatch[1] : "SPH-DRAFT";

    const reasonMatch = needText.match(/Alasan:\s*(.+)/i);
    const discountReason = reasonMatch ? reasonMatch[1] : opp.objection || "Pengajuan harga khusus di bawah Floor Price standar.";

    return {
      opportunityId: opp.id,
      opportunityName: opp.opportunity_name,
      sphNumber,
      customerId: opp.customer?.id || "",
      customerName: opp.customer?.customer_name || "Unknown Customer",
      customerCity: opp.customer?.city || null,
      dsrName: owner?.full_name || "DSR Sales",
      dsrArea: owner?.sales_area || null,
      potentialValue: Number(opp.potential_value) || 0,
      potentialVolume: Number(opp.potential_volume) || 0,
      discountReason,
      status: "PENDING_APPROVAL",
      submittedAt: opp.updated_at || opp.created_at,
    };
  });
}

/**
 * Manager approves the discounted SPH quotation
 */
export async function approveSphDiscountAction(
  opportunityId: string,
  managerNotes?: string
): Promise<{ success: boolean; message: string }> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, message: "Sesi telah berakhir." };
  }

  // Verify Manager role
  const { data: callerProfile } = await supabase
    .from("profiles")
    .select("role, full_name")
    .eq("id", user.id)
    .single();

  const isManager =
    callerProfile?.role === "MANAGER" ||
    callerProfile?.role === "SPV" ||
    callerProfile?.role === "ADMIN";

  if (!isManager) {
    return { success: false, message: "Hanya Manager atau SPV yang berhak menyetujui SPH." };
  }

  const { data: opp } = await supabase
    .from("opportunities")
    .select("id, customer_id, opportunity_name, customer_need")
    .eq("id", opportunityId)
    .single();

  if (!opp) {
    return { success: false, message: "Opportunity SPH tidak ditemukan." };
  }

  const timestamp = new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Jakarta",
  }).format(new Date());

  const updatedNeed = (opp.customer_need || "").replace("PENDING_APPROVAL", "APPROVED") +
    ` | Disetujui oleh ${callerProfile.full_name} (${timestamp})${managerNotes ? ` - Catatan: ${managerNotes}` : ""}`;

  await supabase
    .from("opportunities")
    .update({
      customer_need: updatedNeed,
      updated_at: new Date().toISOString(),
    })
    .eq("id", opportunityId);

  revalidatePath("/dashboard");
  revalidatePath("/pipeline");
  revalidatePath("/customers");

  return {
    success: true,
    message: `SPH untuk ${opp.opportunity_name} BERHASIL DISETUJUI oleh ${callerProfile.full_name}!`,
  };
}

/**
 * Manager rejects / requests revision for the discounted SPH
 */
export async function rejectSphDiscountAction(
  opportunityId: string,
  rejectionReason: string
): Promise<{ success: boolean; message: string }> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, message: "Sesi telah berakhir." };
  }

  const { data: callerProfile } = await supabase
    .from("profiles")
    .select("role, full_name")
    .eq("id", user.id)
    .single();

  const isManager =
    callerProfile?.role === "MANAGER" ||
    callerProfile?.role === "SPV" ||
    callerProfile?.role === "ADMIN";

  if (!isManager) {
    return { success: false, message: "Hanya Manager atau SPV yang berhak menolak SPH." };
  }

  const { data: opp } = await supabase
    .from("opportunities")
    .select("id, customer_id, opportunity_name, customer_need")
    .eq("id", opportunityId)
    .single();

  if (!opp) {
    return { success: false, message: "Opportunity SPH tidak ditemukan." };
  }

  const timestamp = new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Jakarta",
  }).format(new Date());

  const updatedNeed = (opp.customer_need || "").replace("PENDING_APPROVAL", "REJECTED_NEEDS_REVISION") +
    ` | DITOLAK REVISI oleh ${callerProfile.full_name} (${timestamp}) - Alasan: ${rejectionReason}`;

  await supabase
    .from("opportunities")
    .update({
      customer_need: updatedNeed,
      objection: `Perlu revisi harga: ${rejectionReason}`,
      updated_at: new Date().toISOString(),
    })
    .eq("id", opportunityId);

  revalidatePath("/dashboard");
  revalidatePath("/pipeline");
  revalidatePath("/customers");

  return {
    success: true,
    message: `SPH untuk ${opp.opportunity_name} DITOLAK untuk revisi DSR.`,
  };
}
