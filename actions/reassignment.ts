"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export type ReassignableRep = {
  id: string;
  fullName: string;
  salesArea: string | null;
  role: string;
  activeAccountsCount: number;
  openDealsCount: number;
};

export type ReassignInput = {
  customerId: string;
  newOwnerId: string;
  reason?: string;
  transferDeals?: boolean;
  transferFollowUps?: boolean;
};

export type ReassignResult = {
  success: boolean;
  message: string;
  updatedCustomerName?: string;
  newOwnerName?: string;
  transferredDealsCount?: number;
  transferredTasksCount?: number;
};

/**
 * Fetches all available active sales reps for reassignment with their current workload
 */
export async function getAvailableRepsForReassignment(): Promise<ReassignableRep[]> {
  const supabase = await createClient();

  const [
    { data: profiles },
    { data: customers },
    { data: opportunities },
  ] = await Promise.all([
    supabase
      .from("profiles")
      .select("id, full_name, role, sales_area, is_active")
      .eq("is_active", true)
      .in("role", ["DSR", "SPV", "MANAGER"])
      .order("full_name"),
    supabase.from("customers").select("id, owner_id"),
    supabase.from("opportunities").select("id, created_by, stage").neq("stage", "LOST").neq("stage", "WON"),
  ]);

  const profilesList = profiles ?? [];
  const custList = customers ?? [];
  const oppList = opportunities ?? [];

  return profilesList.map((p) => {
    const accCount = custList.filter((c) => c.owner_id === p.id).length;
    const dealCount = oppList.filter((o) => o.created_by === p.id).length;

    return {
      id: p.id,
      fullName: p.full_name,
      salesArea: p.sales_area || "General",
      role: p.role,
      activeAccountsCount: accCount,
      openDealsCount: dealCount,
    };
  });
}

/**
 * Reassigns a customer account to a new sales representative
 * Handles automated cascading to active opportunities and pending follow-ups
 */
export async function reassignCustomerAccount(
  input: ReassignInput
): Promise<ReassignResult> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, message: "Sesi telah berakhir. Silakan login kembali." };
  }

  // 1. Verify caller has Manager / SPV / Admin privileges
  const { data: callerProfile } = await supabase
    .from("profiles")
    .select("role, full_name")
    .eq("id", user.id)
    .single();

  const isAuthorized =
    callerProfile?.role === "MANAGER" ||
    callerProfile?.role === "SPV" ||
    callerProfile?.role === "ADMIN";

  if (!isAuthorized) {
    return {
      success: false,
      message: "Akses ditolak. Hanya Manager atau SPV yang berwenang merealokasi akun.",
    };
  }

  // 2. Fetch customer and new owner details
  const [{ data: customer }, { data: targetRep }] = await Promise.all([
    supabase
      .from("customers")
      .select("id, customer_name, owner_id, notes")
      .eq("id", input.customerId)
      .single(),
    supabase
      .from("profiles")
      .select("id, full_name, sales_area")
      .eq("id", input.newOwnerId)
      .single(),
  ]);

  if (!customer) {
    return { success: false, message: "Customer tidak ditemukan." };
  }

  if (!targetRep) {
    return { success: false, message: "Sales Rep tujuan tidak valid." };
  }

  const timestampStr = new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Jakarta",
  }).format(new Date());

  const auditNote = `\n[Realokasi ${timestampStr}]: Dialihkan ke ${targetRep.full_name} (${targetRep.sales_area || "General"}) oleh ${callerProfile.full_name}${input.reason ? ` - Alasan: ${input.reason}` : ""}`;
  const updatedNotes = (customer.notes || "") + auditNote;

  // 3. Update customer owner in database
  const { error: updateCustError } = await supabase
    .from("customers")
    .update({
      owner_id: input.newOwnerId,
      notes: updatedNotes,
      updated_at: new Date().toISOString(),
    })
    .eq("id", input.customerId);

  if (updateCustError) {
    return { success: false, message: `Gagal memperbarui owner: ${updateCustError.message}` };
  }

  let transferredDealsCount = 0;
  let transferredTasksCount = 0;

  // 4. Cascade active opportunities if requested
  if (input.transferDeals !== false) {
    const { data: dealsToTransfer } = await supabase
      .from("opportunities")
      .select("id")
      .eq("customer_id", input.customerId)
      .neq("stage", "WON")
      .neq("stage", "LOST");

    if (dealsToTransfer && dealsToTransfer.length > 0) {
      transferredDealsCount = dealsToTransfer.length;
      await supabase
        .from("opportunities")
        .update({
          created_by: input.newOwnerId,
          updated_at: new Date().toISOString(),
        })
        .eq("customer_id", input.customerId)
        .neq("stage", "WON")
        .neq("stage", "LOST");
    }
  }

  // 5. Cascade pending follow-ups if requested
  if (input.transferFollowUps !== false) {
    const { data: tasksToTransfer } = await supabase
      .from("follow_ups")
      .select("id")
      .eq("customer_id", input.customerId)
      .eq("status", "PENDING");

    if (tasksToTransfer && tasksToTransfer.length > 0) {
      transferredTasksCount = tasksToTransfer.length;
      await supabase
        .from("follow_ups")
        .update({
          user_id: input.newOwnerId,
          updated_at: new Date().toISOString(),
        })
        .eq("customer_id", input.customerId)
        .eq("status", "PENDING");
    }
  }

  // 6. Revalidate routes
  revalidatePath("/customers");
  revalidatePath(`/customers/${input.customerId}`);
  revalidatePath("/dashboard");
  revalidatePath("/pipeline");
  revalidatePath("/follow-ups");

  return {
    success: true,
    message: `Akun "${customer.customer_name}" berhasil direalokasi ke ${targetRep.full_name}.`,
    updatedCustomerName: customer.customer_name,
    newOwnerName: targetRep.full_name,
    transferredDealsCount,
    transferredTasksCount,
  };
}
