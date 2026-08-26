"use server";

import { createClient } from "@/lib/supabase/server";
import { customerSchema, type CustomerInput } from "@/lib/validations/customer";
import { redirect } from "next/navigation";
import { randomUUID } from "crypto";
import type { Priority, CustomerStatus, Segment } from "@/constants/enums";

export async function checkDuplicateCustomers(name: string) {
  if (name.trim().length < 3) return [];

  const supabase = await createClient();
  const { data, error } = await supabase.rpc("find_similar_customers", {
    p_name: name,
  });

  if (error) {
    // Jangan blokir user cuma karena duplicate check gagal - fail-open,
    // bukan fail-closed. Ini fitur bantu, bukan validasi wajib.
    console.error("checkDuplicateCustomers error:", error.message);
    return [];
  }

  return data ?? [];
}

export async function createCustomer(input: CustomerInput) {
  const parsed = customerSchema.safeParse(input);
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

  const { customer_code, ...rest } = parsed.data;
  const newId = randomUUID();

  // Sengaja TIDAK chain .select() setelah insert. Alasan: PostgREST menambahkan
  // RETURNING pada statement yang sama, dan RLS SELECT policy customers_select
  // (lewat can_access_customer -> subquery EXISTS ke tabel customers itu sendiri)
  // punya masalah self-referential visibility terhadap row yang baru saja di-insert
  // DALAM statement yang sama -- insert selalu gagal walau datanya valid.
  // Solusi: generate ID sendiri di sini, insert tanpa minta representasi balik
  // (Prefer: return=minimal), lalu redirect pakai ID yang sudah kita ketahui.
  const { error } = await supabase.from("customers").insert({
    ...rest,
    ...(customer_code ? { customer_code } : {}),
    id: newId,
    owner_id: user.id,
    created_by: user.id,
  });

  if (error) {
    if (error.code === "23505") {
      return { error: "Kode customer sudah dipakai, coba kode lain." };
    }
    console.error("createCustomer error:", error.message);
    return { error: "Gagal menyimpan customer. Coba lagi." };
  }

  redirect(`/customers/${newId}`);
}

export type CustomerListFilters = {
  search?: string;
  priority?: Priority;
  status?: CustomerStatus;
  segment?: Segment;
};

export async function listCustomers(filters: CustomerListFilters = {}) {
  const supabase = await createClient();

  let query = supabase
    .from("customers")
    .select("id, customer_code, customer_name, segment, city, status, priority, potential_monthly_volume")
    .order("priority", { ascending: true })
    .order("customer_name", { ascending: true });

  if (filters.search) {
    const escaped = filters.search.replace(/[%_\\]/g, "\\$&");
    query = query.ilike("customer_name", `%${escaped}%`);
  }
  if (filters.priority) {
    query = query.eq("priority", filters.priority);
  }
  if (filters.status) {
    query = query.eq("status", filters.status);
  }
  if (filters.segment) {
    query = query.eq("segment", filters.segment);
  }

  const { data, error } = await query;

  if (error) {
    console.error("listCustomers error:", error.message);
    return [];
  }

  return data;
}

export async function getCustomerDetail(id: string) {
  const supabase = await createClient();

  const { data: customer, error } = await supabase
    .from("customers")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !customer) return null;

  const [{ data: contacts }, { data: equipment }, { data: products }, { data: recentVisits }] =
    await Promise.all([
      supabase
        .from("customer_contacts")
        .select("*")
        .eq("customer_id", id)
        .order("is_primary", { ascending: false }),
      supabase.from("customer_equipment").select("*").eq("customer_id", id),
      supabase.from("customer_products").select("*").eq("customer_id", id),
      supabase
        .from("visits")
        .select("id, visit_date, visit_type, purpose, visit_status")
        .eq("customer_id", id)
        .order("visit_date", { ascending: false })
        .limit(5),
    ]);

  return {
    customer,
    contacts: contacts ?? [],
    equipment: equipment ?? [],
    products: products ?? [],
    recentVisits: recentVisits ?? [],
  };
}

/**
 * Server action to update customer coordinates and address
 */
export async function updateCustomerLocationAction(input: {
  customerId: string;
  latitude: number | null;
  longitude: number | null;
  address?: string;
  city?: string;
}): Promise<{ success: boolean; message: string }> {
  try {
    const supabase = await createClient();

    const updatePayload: {
      latitude?: number | null;
      longitude?: number | null;
      address?: string;
      city?: string;
      updated_at?: string;
    } = {
      latitude: input.latitude,
      longitude: input.longitude,
      updated_at: new Date().toISOString(),
    };

    if (input.address !== undefined) updatePayload.address = input.address;
    if (input.city !== undefined) updatePayload.city = input.city;

    const { error } = await supabase
      .from("customers")
      .update(updatePayload)
      .eq("id", input.customerId);

    if (error) {
      console.error("updateCustomerLocationAction error:", error.message);
      return { success: false, message: `Gagal memperbarui lokasi: ${error.message}` };
    }

    const { revalidatePath } = await import("next/cache");
    revalidatePath(`/customers/${input.customerId}`);
    revalidatePath("/customers");
    revalidatePath("/visits/plan");
    revalidatePath("/dashboard");

    return { success: true, message: "Titik lokasi maps customer berhasil diperbarui!" };
  } catch (err: any) {
    console.error("updateCustomerLocationAction exception:", err);
    return { success: false, message: err?.message || "Terjadi kesalahan internal." };
  }
}

/**
 * Server action to save/update customer branches (plants)
 */
export async function saveCustomerBranchesAction(input: {
  customerId: string;
  branches: import("@/lib/utils/branches").CustomerBranch[];
}): Promise<{ success: boolean; message: string }> {
  try {
    const { serializeCustomerBranches } = await import("@/lib/utils/branches");
    const supabase = await createClient();

    // 1. Fetch current customer record
    const { data: customer, error: fetchErr } = await supabase
      .from("customers")
      .select("notes, address, city, latitude, longitude")
      .eq("id", input.customerId)
      .single();

    if (fetchErr || !customer) {
      return { success: false, message: "Customer tidak ditemukan." };
    }

    // 2. Format updated notes with serialized branches
    const serializedNotes = serializeCustomerBranches(input.branches, customer.notes);

    // 3. If primary branch exists, sync its coordinates to customer root
    const primaryBranch = input.branches.find((b) => b.isPrimary) || input.branches[0];

    const updatePayload: {
      notes: string;
      latitude?: number | null;
      longitude?: number | null;
      address?: string;
      city?: string;
      updated_at?: string;
    } = {
      notes: serializedNotes,
      updated_at: new Date().toISOString(),
    };

    if (primaryBranch) {
      if (primaryBranch.latitude !== undefined) updatePayload.latitude = primaryBranch.latitude;
      if (primaryBranch.longitude !== undefined) updatePayload.longitude = primaryBranch.longitude;
      if (primaryBranch.address) updatePayload.address = primaryBranch.address;
      if (primaryBranch.city) updatePayload.city = primaryBranch.city;
    }

    const { error: updateErr } = await supabase
      .from("customers")
      .update(updatePayload)
      .eq("id", input.customerId);

    if (updateErr) {
      console.error("saveCustomerBranchesAction update error:", updateErr.message);
      return { success: false, message: `Gagal menyimpan cabang: ${updateErr.message}` };
    }

    const { revalidatePath } = await import("next/cache");
    revalidatePath(`/customers/${input.customerId}`);
    revalidatePath("/customers");
    revalidatePath("/visits/plan");
    revalidatePath("/dashboard");

    return { success: true, message: "Daftar cabang & pabrik berhasil diperbarui!" };
  } catch (err: any) {
    console.error("saveCustomerBranchesAction exception:", err);
    return { success: false, message: err?.message || "Terjadi kesalahan internal." };
  }
}


