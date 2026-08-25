"use server";

import { createClient } from "@/lib/supabase/server";
import {
  opportunitySchema,
  updateStageSchema,
  type OpportunityInput,
  type UpdateStageInput,
} from "@/lib/validations/opportunity";
import { redirect } from "next/navigation";
import { randomUUID } from "crypto";
import type { OpportunityStage } from "@/constants/enums";

export async function listOpportunities(filters?: {
  stage?: OpportunityStage;
  customerId?: string;
  search?: string;
}) {
  const supabase = await createClient();

  let query = supabase
    .from("opportunities")
    .select(
      `
      id,
      opportunity_name,
      stage,
      status,
      potential_volume,
      potential_value,
      probability,
      expected_close_date,
      next_action,
      next_action_date,
      created_at,
      customer:customers (
        id,
        customer_name,
        customer_code,
        city,
        segment,
        priority
      ),
      product:products (
        id,
        brand,
        product_name,
        viscosity
      ),
      competitor:competitors (
        id,
        brand,
        product_name
      )
    `
    )
    .order("created_at", { ascending: false });

  if (filters?.stage) {
    query = query.eq("stage", filters.stage);
  }
  if (filters?.customerId) {
    query = query.eq("customer_id", filters.customerId);
  }

  const { data, error } = await query;

  if (error) {
    console.error("listOpportunities error:", error.message);
    return { opportunities: [], totalValue: 0, stageStats: {} };
  }

  const opps = data ?? [];

  // Filter search client-side/memory
  const filtered = filters?.search
    ? opps.filter((o) =>
        o.opportunity_name.toLowerCase().includes(filters.search!.toLowerCase()) ||
        o.customer?.customer_name?.toLowerCase().includes(filters.search!.toLowerCase()) ||
        o.product?.product_name?.toLowerCase().includes(filters.search!.toLowerCase())
      )
    : opps;

  // Calculate stage stats & total value
  let totalValue = 0;
  const stageStats: Record<string, { count: number; value: number }> = {};

  for (const item of opps) {
    const val = item.potential_value ?? 0;
    if (item.stage !== "LOST") {
      totalValue += val;
    }

    if (!stageStats[item.stage]) {
      stageStats[item.stage] = { count: 0, value: 0 };
    }
    stageStats[item.stage].count += 1;
    stageStats[item.stage].value += val;
  }

  return {
    opportunities: filtered,
    totalValue,
    stageStats,
  };
}

export async function getOpportunityDetail(id: string) {
  const supabase = await createClient();

  const { data: opp, error } = await supabase
    .from("opportunities")
    .select(
      `
      *,
      customer:customers (
        *,
        contacts:customer_contacts (*)
      ),
      product:products (*),
      competitor:competitors (*),
      visit:visits (*)
    `
    )
    .eq("id", id)
    .single();

  if (error || !opp) {
    console.error("getOpportunityDetail error:", error?.message);
    return null;
  }

  const { data: followUps } = await supabase
    .from("follow_ups")
    .select("*")
    .eq("opportunity_id", id)
    .order("due_date", { ascending: true });

  return {
    opportunity: opp,
    customer: opp.customer,
    product: opp.product,
    competitor: opp.competitor,
    visit: opp.visit,
    followUps: followUps ?? [],
  };
}

export async function createOpportunity(input: OpportunityInput) {
  const parsed = opportunitySchema.safeParse(input);
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
  const stage = parsed.data.stage;
  const status = stage === "WON" ? "WON" : stage === "LOST" ? "LOST" : "OPEN";

  const { error } = await supabase.from("opportunities").insert({
    ...parsed.data,
    id: newId,
    status,
    created_by: user.id,
  });

  if (error) {
    console.error("createOpportunity error:", error.message);
    return { error: "Gagal membuat opportunity. Coba lagi." };
  }

  redirect(`/pipeline`);
}

export async function updateOpportunityStage(input: UpdateStageInput) {
  const parsed = updateStageSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Input tidak valid" };
  }

  const supabase = await createClient();
  const { opportunity_id, stage, notes } = parsed.data;
  const status = stage === "WON" ? "WON" : stage === "LOST" ? "LOST" : "OPEN";

  const { error } = await supabase
    .from("opportunities")
    .update({
      stage,
      status,
      objection: notes ? notes : undefined,
      updated_at: new Date().toISOString(),
    })
    .eq("id", opportunity_id);

  if (error) {
    console.error("updateOpportunityStage error:", error.message);
    return { error: "Gagal update stage opportunity." };
  }

  return { success: true };
}
