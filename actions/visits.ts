"use server";

import { createClient } from "@/lib/supabase/server";
import {
  planVisitSchema,
  startVisitSchema,
  visitLogSchema,
  quickVisitSchema,
  type PlanVisitInput,
  type StartVisitInput,
  type VisitLogInput,
  type QuickVisitInput,
} from "@/lib/validations/visit";
import { redirect } from "next/navigation";
import { randomUUID } from "crypto";
import type { VisitStatus, VisitType } from "@/constants/enums";

export async function getMasterProducts() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("id, brand, product_name, category, viscosity, packaging, packaging_size")
    .eq("is_active", true)
    .order("product_name", { ascending: true });

  if (error) {
    console.error("getMasterProducts error:", error.message);
    return [];
  }
  return data ?? [];
}

export async function getCompetitors() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("competitors")
    .select("id, brand, product_name, category")
    .eq("is_active", true)
    .order("brand", { ascending: true });

  if (error) {
    console.error("getCompetitors error:", error.message);
    return [];
  }
  return data ?? [];
}

export type VisitFilters = {
  date?: string;
  status?: VisitStatus;
  customerId?: string;
};

export async function listVisits(filters: VisitFilters = {}) {
  const supabase = await createClient();

  let query = supabase
    .from("visits")
    .select(
      `
      id,
      visit_date,
      visit_type,
      visit_status,
      purpose,
      discussion,
      customer_response,
      opportunity_found,
      potential_volume,
      start_time,
      end_time,
      duration_minutes,
      created_at,
      customer:customers (
        id,
        customer_name,
        customer_code,
        city,
        priority,
        segment
      ),
      popsa:visit_popsas (
        id,
        purpose,
        objective,
        premises,
        strategy,
        anticipate
      )
    `
    )
    .order("visit_date", { ascending: false })
    .order("created_at", { ascending: false });

  if (filters.date) {
    query = query.eq("visit_date", filters.date);
  }
  if (filters.status) {
    query = query.eq("visit_status", filters.status);
  }
  if (filters.customerId) {
    query = query.eq("customer_id", filters.customerId);
  }

  const { data, error } = await query;

  if (error) {
    console.error("listVisits error:", error.message);
    return [];
  }

  return data ?? [];
}

export async function getVisitDetail(id: string) {
  const supabase = await createClient();

  const { data: visit, error } = await supabase
    .from("visits")
    .select(
      `
      *,
      customer:customers (
        id,
        customer_name,
        customer_code,
        segment,
        priority,
        status,
        city,
        address,
        potential_monthly_volume
      ),
      popsa:visit_popsas (*),
      photos:visit_photos (*),
      competitor:competitors (*)
    `
    )
    .eq("id", id)
    .single();

  if (error || !visit) {
    console.error("getVisitDetail error:", error?.message);
    return null;
  }

  // Also fetch customer contacts, equipment & active products for technical and communication context
  const [
    { data: contacts },
    { data: equipment },
    { data: customerProducts },
    { data: opportunities },
    { data: followUps },
  ] = await Promise.all([
    supabase
      .from("customer_contacts")
      .select("*")
      .eq("customer_id", visit.customer_id)
      .order("is_primary", { ascending: false }),
    supabase.from("customer_equipment").select("*").eq("customer_id", visit.customer_id),
    supabase.from("customer_products").select("*").eq("customer_id", visit.customer_id),
    supabase.from("opportunities").select("*").eq("visit_id", id),
    supabase.from("follow_ups").select("*").eq("visit_id", id),
  ]);

  return {
    visit,
    customer: visit.customer,
    contacts: contacts ?? [],
    popsa: Array.isArray(visit.popsa) ? visit.popsa[0] : visit.popsa,
    photos: visit.photos ?? [],
    equipment: equipment ?? [],
    customerProducts: customerProducts ?? [],
    opportunities: opportunities ?? [],
    followUps: followUps ?? [],
  };
}

export async function planVisit(input: PlanVisitInput) {
  const parsed = planVisitSchema.safeParse(input);
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
    customer_id,
    visit_date,
    visit_type,
    purpose,
    objective,
    popsa_purpose,
    popsa_objective,
    popsa_premises,
    popsa_strategy,
    popsa_anticipate,
  } = parsed.data;

  const newVisitId = randomUUID();

  // 1. Insert Visit
  const { error: visitError } = await supabase.from("visits").insert({
    id: newVisitId,
    customer_id,
    user_id: user.id,
    visit_date,
    visit_type,
    purpose: purpose || popsa_purpose || null,
    visit_status: "PLANNED",
    opportunity_found: false,
  });

  if (visitError) {
    console.error("planVisit error:", visitError.message);
    return { error: "Gagal membuat rencana visit. Coba lagi." };
  }

  // 2. Insert POPSA if provided
  if (
    popsa_purpose ||
    popsa_objective ||
    objective ||
    popsa_premises ||
    popsa_strategy ||
    popsa_anticipate
  ) {
    const newPopsaId = randomUUID();
    const { error: popsaError } = await supabase.from("visit_popsas").insert({
      id: newPopsaId,
      visit_id: newVisitId,
      purpose: popsa_purpose || purpose || null,
      objective: popsa_objective || objective || null,
      premises: popsa_premises || null,
      strategy: popsa_strategy || null,
      anticipate: popsa_anticipate || null,
    });

    if (popsaError) {
      console.error("popsa insert error:", popsaError.message);
      // Non-fatal, visit is already created
    }
  }

  redirect(`/visits/${newVisitId}`);
}

export async function startVisit(input: StartVisitInput) {
  const parsed = startVisitSchema.safeParse(input);
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

  const { visit_id, latitude, longitude, start_time } = parsed.data;

  // 1. Validate existing visit and status transition
  const { data: existingVisit } = await supabase
    .from("visits")
    .select("user_id, visit_status, customer_id")
    .eq("id", visit_id)
    .single();

  if (!existingVisit) {
    return { error: "Data visit tidak ditemukan." };
  }

  if (existingVisit.visit_status !== "PLANNED") {
    return { error: `Visit tidak dapat dimulai karena status saat ini: ${existingVisit.visit_status}` };
  }

  const now = start_time || new Date().toISOString();

  // Auto-pin GPS coordinates to customer profile if empty
  if (latitude && longitude && existingVisit.customer_id) {
    const { data: cust } = await supabase
      .from("customers")
      .select("id, latitude, longitude, notes, customer_name, address, city, province")
      .eq("id", existingVisit.customer_id)
      .single();

    if (cust && (cust.latitude === null || cust.longitude === null)) {
      const { parseCustomerBranches, serializeCustomerBranches } = await import("@/lib/utils/branches");
      const { branches, rawNotes } = parseCustomerBranches(cust.notes, cust);
      if (branches.length > 0 && (branches[0].latitude === null || branches[0].longitude === null)) {
        branches[0].latitude = latitude;
        branches[0].longitude = longitude;
      }
      const updatedNotes = serializeCustomerBranches(branches, rawNotes);

      await supabase
        .from("customers")
        .update({
          latitude,
          longitude,
          notes: updatedNotes,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existingVisit.customer_id);
    }
  }

  const { error } = await supabase
    .from("visits")
    .update({
      visit_status: "IN_PROGRESS",
      start_time: now,
      latitude: latitude ?? null,
      longitude: longitude ?? null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", visit_id)
    .eq("visit_status", "PLANNED");

  if (error) {
    console.error("startVisit error:", error.message);
    return { error: "Gagal memulai visit. Coba lagi." };
  }

  return { success: true, startTime: now };
}

export async function submitVisitLog(input: VisitLogInput) {
  const parsed = visitLogSchema.safeParse(input);
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
    visit_id,
    customer_response,
    discussion,
    customer_condition,
    competitor_id,
    technical_issue,
    opportunity_found,
    opportunity_name,
    product_id,
    potential_volume,
    potential_value,
    opportunity_stage,
    has_next_action,
    next_action_type,
    next_action_description,
    next_action_due_date,
    next_action_priority,
    photos,
    end_time,
    duration_minutes,
  } = parsed.data;

  // 1. Fetch current visit to get customer_id & verify ownership
  const { data: existingVisit } = await supabase
    .from("visits")
    .select("customer_id, start_time, user_id, visit_status")
    .eq("id", visit_id)
    .single();

  if (!existingVisit) {
    return { error: "Data visit tidak ditemukan." };
  }

  // Ownership guard (allow admin/manager override)
  if (existingVisit.user_id !== user.id) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (!profile || (profile.role !== "ADMIN" && profile.role !== "MANAGER")) {
      return { error: "Anda tidak memiliki akses untuk mengisi log visit ini." };
    }
  }

  const nowIso = end_time || new Date().toISOString();
  let calculatedDuration = duration_minutes;
  if (!calculatedDuration && existingVisit.start_time) {
    const diffMs = new Date(nowIso).getTime() - new Date(existingVisit.start_time).getTime();
    calculatedDuration = Math.max(1, Math.round(diffMs / (1000 * 60)));
  }

  // 2. Update Visit Record
  const { error: updateVisitError } = await supabase
    .from("visits")
    .update({
      visit_status: "COMPLETED",
      customer_response,
      discussion,
      customer_condition: customer_condition || null,
      competitor_id: competitor_id || null,
      technical_issue: technical_issue || null,
      opportunity_found,
      potential_volume: potential_volume ?? null,
      end_time: nowIso,
      duration_minutes: calculatedDuration ?? 30,
      updated_at: new Date().toISOString(),
    })
    .eq("id", visit_id);

  if (updateVisitError) {
    console.error("submitVisitLog error:", updateVisitError.message);
    return { error: "Gagal menyimpan log visit. Coba lagi." };
  }

  // 3. Create Opportunity if opportunity_found is true
  if (opportunity_found) {
    const newOppId = randomUUID();
    const { error: oppError } = await supabase.from("opportunities").insert({
      id: newOppId,
      customer_id: existingVisit.customer_id,
      visit_id,
      opportunity_name: opportunity_name || `Peluang Baru dari Visit ${existingVisit.customer_id.slice(0, 6)}`,
      product_id: product_id || null,
      potential_volume: potential_volume ?? null,
      potential_value: potential_value ?? null,
      stage: opportunity_stage || "PROSPECT",
      competitor_id: competitor_id || null,
      next_action: next_action_description || null,
      next_action_date: next_action_due_date || null,
      created_by: user.id,
    });

    if (oppError) {
      console.error("create opportunity from visit error:", oppError.message);
    }
  }

  // 4. Auto-resolve prior pending/overdue follow-ups for this customer
  const todayDateStr = new Date().toISOString().split("T")[0];
  await supabase
    .from("follow_ups")
    .update({
      status: "COMPLETED",
      completed_at: new Date().toISOString(),
      result: "Selesai otomatis melalui Kunjungan Lapangan",
    })
    .eq("customer_id", existingVisit.customer_id)
    .eq("status", "PENDING")
    .lte("due_date", todayDateStr);

  // 5. Create Mandatory Next Action in Follow-Ups if specified
  if (has_next_action && next_action_description && next_action_due_date) {
    const newFollowUpId = randomUUID();
    const { error: followUpError } = await supabase.from("follow_ups").insert({
      id: newFollowUpId,
      customer_id: existingVisit.customer_id,
      visit_id,
      user_id: user.id,
      activity_type: next_action_type,
      description: next_action_description,
      due_date: next_action_due_date,
      priority: next_action_priority,
      status: "PENDING",
    });

    if (followUpError) {
      console.error("create follow_up from visit error:", followUpError.message);
    }
  }

  // 5. Insert Photos if any
  if (photos && photos.length > 0) {
    const photoRecords = photos.map((p) => ({
      id: randomUUID(),
      visit_id,
      photo_url: p.photo_url,
      photo_type: p.photo_type,
      caption: p.caption || null,
    }));

    const { error: photoError } = await supabase.from("visit_photos").insert(photoRecords);
    if (photoError) {
      console.error("insert visit photos error:", photoError.message);
    }
  }

  redirect(`/visits/${visit_id}`);
}

export async function quickVisit(input: QuickVisitInput) {
  const parsed = quickVisitSchema.safeParse(input);
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
    customer_id,
    visit_type,
    purpose,
    customer_response,
    discussion,
    opportunity_found,
    product_id,
    potential_volume,
    potential_value,
    latitude,
    longitude,
    next_action_type,
    next_action_description,
    next_action_due_date,
    next_action_priority,
  } = parsed.data;

  const newVisitId = randomUUID();
  const todayStr = new Date().toISOString().split("T")[0];
  const nowIso = new Date().toISOString();

  // 1. Insert Visit (Directly COMPLETED)
  const { error: visitError } = await supabase.from("visits").insert({
    id: newVisitId,
    customer_id,
    user_id: user.id,
    visit_date: todayStr,
    visit_type,
    purpose: purpose || "Quick Visit Lapangan",
    visit_status: "COMPLETED",
    customer_response,
    discussion,
    opportunity_found,
    potential_volume: potential_volume ?? null,
    latitude: latitude ?? null,
    longitude: longitude ?? null,
    start_time: nowIso,
    end_time: nowIso,
    duration_minutes: 15,
  });

  if (visitError) {
    console.error("quickVisit error:", visitError.message);
    return { error: "Gagal menyimpan Quick Visit. Coba lagi." };
  }

  // Auto-pin GPS coordinates to customer profile if empty
  if (latitude && longitude && customer_id) {
    const { data: cust } = await supabase
      .from("customers")
      .select("id, latitude, longitude, notes, customer_name, address, city, province")
      .eq("id", customer_id)
      .single();

    if (cust && (cust.latitude === null || cust.longitude === null)) {
      const { parseCustomerBranches, serializeCustomerBranches } = await import("@/lib/utils/branches");
      const { branches, rawNotes } = parseCustomerBranches(cust.notes, cust);
      if (branches.length > 0 && (branches[0].latitude === null || branches[0].longitude === null)) {
        branches[0].latitude = latitude;
        branches[0].longitude = longitude;
      }
      const updatedNotes = serializeCustomerBranches(branches, rawNotes);

      await supabase
        .from("customers")
        .update({
          latitude,
          longitude,
          notes: updatedNotes,
          updated_at: new Date().toISOString(),
        })
        .eq("id", customer_id);
    }
  }

  // 2. Insert Opportunity if found
  if (opportunity_found) {
    const newOppId = randomUUID();
    await supabase.from("opportunities").insert({
      id: newOppId,
      customer_id,
      visit_id: newVisitId,
      opportunity_name: `Quick Opp - ${todayStr}`,
      product_id: product_id || null,
      potential_volume: potential_volume ?? null,
      potential_value: potential_value ?? null,
      stage: "PROSPECT",
      created_by: user.id,
    });
  }

  // 3. Auto-resolve prior pending/overdue follow-ups for this customer
  await supabase
    .from("follow_ups")
    .update({
      status: "COMPLETED",
      completed_at: new Date().toISOString(),
      result: "Selesai otomatis melalui Quick Visit Lapangan",
    })
    .eq("customer_id", customer_id)
    .eq("status", "PENDING")
    .lte("due_date", todayStr);

  // 4. Insert Next Follow-up if defined
  if (next_action_description && next_action_due_date) {
    const newFollowUpId = randomUUID();
    await supabase.from("follow_ups").insert({
      id: newFollowUpId,
      customer_id,
      visit_id: newVisitId,
      user_id: user.id,
      activity_type: next_action_type,
      description: next_action_description,
      due_date: next_action_due_date,
      priority: next_action_priority,
      status: "PENDING",
    });
  }

  redirect(`/visits/${newVisitId}`);
}

export async function generateAIPopsa(
  customerId: string,
  visitType: VisitType = "ROUTINE",
  customPurpose?: string,
  visitDate?: string
) {
  const { generateProgressivePopsa } = await import("@/lib/ai/gemini");
  const popsa = await generateProgressivePopsa(customerId, {
    visitType,
    customPurpose,
    visitDate,
  });

  return {
    purpose: customPurpose || popsa.objective,
    objective: popsa.objective,
    premises: `${popsa.milestone} : ${popsa.position}`,
    strategy: `${popsa.strategy}${popsa.target_shell_product ? ` | Target Produk: ${popsa.target_shell_product}` : ""}${popsa.cross_sell_opportunity ? ` | Peluang Cross-Sell: ${popsa.cross_sell_opportunity}` : ""}`,
    anticipate: popsa.action,
  };
}
