"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import {
  INDONESIA_INDUSTRIAL_HUBS,
  type RouteCandidateCustomer,
  type Coordinates,
} from "@/lib/utils/geo-route";
import { daysSince, getTodayWIB } from "@/lib/utils/format";
import { randomUUID } from "crypto";
import type { VisitStatus, VisitType } from "@/constants/enums";

/**
 * Resolves or estimates coordinates for a customer based on city or industrial estate
 */
function resolveCustomerCoordinates(
  lat: number | null | undefined,
  lng: number | null | undefined,
  city: string | null | undefined,
  customerId: string
): Coordinates {
  if (lat && lng && !isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0) {
    return { latitude: lat, longitude: lng };
  }

  const cLower = (city || "").toLowerCase();
  const matchedHub =
    INDONESIA_INDUSTRIAL_HUBS.find((h) => {
      return (
        cLower.includes(h.id) ||
        h.name.toLowerCase().includes(cLower) ||
        cLower.includes(h.region.toLowerCase())
      );
    }) || INDONESIA_INDUSTRIAL_HUBS[0]; // Default Cikarang

  // Deterministic micro-jitter based on customerId hash (within ~3-5km)
  const hash = customerId
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const jitterLat = ((hash % 100) - 50) * 0.0008;
  const jitterLon = (((hash * 7) % 100) - 50) * 0.0008;

  return {
    latitude: matchedHub.coordinates.latitude + jitterLat,
    longitude: matchedHub.coordinates.longitude + jitterLon,
  };
}

export type TerritoryPlannerData = {
  candidates: RouteCandidateCustomer[];
  monthlyQuotaTargetVolume: number;
  monthlyQuotaTargetValue: number;
  defaultIndustrialHubs: typeof INDONESIA_INDUSTRIAL_HUBS;
};

/**
 * Server action to fetch all candidate accounts for territory route planning
 */
export async function getTerritoryOptimizationDataAction(): Promise<TerritoryPlannerData> {
  const supabase = await createClient();

  const [
    { data: customers },
    { data: visits },
    { data: opportunities },
  ] = await Promise.all([
    supabase
      .from("customers")
      .select(
        `
        id,
        customer_name,
        priority,
        city,
        address,
        latitude,
        longitude,
        potential_monthly_volume,
        status
      `
      )
      .neq("status", "INACTIVE")
      .order("priority", { ascending: true })
      .limit(100),
    supabase
      .from("visits")
      .select("id, customer_id, visit_date, visit_status, purpose")
      .order("visit_date", { ascending: false })
      .limit(200),
    supabase
      .from("opportunities")
      .select(
        "id, customer_id, opportunity_name, stage, potential_value, potential_volume, updated_at"
      )
      .neq("stage", "LOST")
      .neq("stage", "WON"),
  ]);

  const defaultVolumeTarget = 40; // 40 Drum
  const defaultValueTarget = 350_000_000; // Rp 350 Jt

  if (!customers || customers.length === 0) {
    return {
      candidates: [],
      monthlyQuotaTargetVolume: defaultVolumeTarget,
      monthlyQuotaTargetValue: defaultValueTarget,
      defaultIndustrialHubs: INDONESIA_INDUSTRIAL_HUBS,
    };
  }

  const rawVisits = visits || [];
  const rawOpps = opportunities || [];

  const { parseCustomerBranches } = await import("@/lib/utils/branches");

  const candidates: RouteCandidateCustomer[] = [];

  for (const c of customers as any[]) {
    const custVisits = rawVisits.filter((v: any) => v.customer_id === c.id);
    const lastVisit = custVisits[0];
    const days = lastVisit ? daysSince(lastVisit.visit_date) : 999;

    const custOpps = rawOpps.filter((o: any) => o.customer_id === c.id);
    custOpps.sort((a: any, b: any) => (b.potential_value || 0) - (a.potential_value || 0));
    const topOpp = custOpps[0];

    // Formulate POPSA Directive
    let purpose = "Technical Selling & Customer Follow-up";
    let objective = "Kunjungan rutin dan evaluasi kepuasan produk Shell.";
    let talkingPoint = "Tawarkan program uji sampel oli gratis Shell LubeAnalyst.";

    if (topOpp) {
      if (topOpp.stage === "NEGOTIATION") {
        purpose = `Finalisasi Negosiasi: ${topOpp.opportunity_name}`;
        objective = "Kunci kesepakatan volume drum dan termin pembayaran resmi.";
        talkingPoint = "Terapkan aturan Give-Get: Diskon hanya diberikan dengan komitmen kuota.";
      } else if (topOpp.stage === "QUOTATION") {
        purpose = `Follow-Up SPH: ${topOpp.opportunity_name}`;
        objective = "Dapatkan feedback teknis dari Purchasing / Kepala Mekanik.";
        talkingPoint = "Bahas perbandingan TCO 5.000 jam TOST vs oli kompetitor lama.";
      }
    } else if (days >= 28) {
      purpose = "Pencegahan Churn & Win-Back";
      objective = "Cek ketersediaan stock oli di gudang dan dengarkan keluhan mesin.";
      talkingPoint = "Notifikasi pengamanan alokasi buffer stock PT HUM sebelum harga naik.";
    }

    const { branches } = parseCustomerBranches(c.notes, c);

    if (branches.length > 0) {
      for (const b of branches) {
        const branchCoords = resolveCustomerCoordinates(
          b.latitude,
          b.longitude,
          b.city || c.city,
          `${c.id}-${b.id}`
        );

        candidates.push({
          id: c.id,
          name: branches.length > 1 ? `${c.customer_name} (${b.branchName})` : c.customer_name,
          priority: (c.priority as "P1" | "P2" | "P3") || "P2",
          city: b.city || c.city || "Cikarang",
          address: b.address || c.address || "Kawasan Industri",
          coordinates: branchCoords,
          potentialMonthlyVolume: c.potential_monthly_volume || 0,
          openDealCount: custOpps.length,
          highestDealStage: topOpp?.stage || null,
          highestDealValue: topOpp?.potential_value || 0,
          highestDealVolume: topOpp?.potential_volume || c.potential_monthly_volume || 0,
          daysSinceLastVisit: days,
          popsaBrief: {
            purpose: b.isPrimary ? purpose : `${purpose} - Lokasi: ${b.branchName}`,
            objective,
            talkingPoint: b.picName
              ? `Temui ${b.picName}${b.picPhone ? ` (${b.picPhone})` : ""}: ${talkingPoint}`
              : talkingPoint,
          },
        });
      }
    } else {
      const coords = resolveCustomerCoordinates(
        c.latitude,
        c.longitude,
        c.city,
        c.id
      );

      candidates.push({
        id: c.id,
        name: c.customer_name,
        priority: (c.priority as "P1" | "P2" | "P3") || "P2",
        city: c.city || "Cikarang",
        address: c.address || c.city || "Kawasan Industri",
        coordinates: coords,
        potentialMonthlyVolume: c.potential_monthly_volume || 0,
        openDealCount: custOpps.length,
        highestDealStage: topOpp?.stage || null,
        highestDealValue: topOpp?.potential_value || 0,
        highestDealVolume: topOpp?.potential_volume || c.potential_monthly_volume || 0,
        daysSinceLastVisit: days,
        popsaBrief: {
          purpose,
          objective,
          talkingPoint,
        },
      });
    }
  }

  return {
    candidates,
    monthlyQuotaTargetVolume: defaultVolumeTarget,
    monthlyQuotaTargetValue: defaultValueTarget,
    defaultIndustrialHubs: INDONESIA_INDUSTRIAL_HUBS,
  };
}

export type ScheduleStopInput = {
  customerId: string;
  customerName: string;
  purpose: string;
  objective: string;
  talkingPoint: string;
};

/**
 * Server action to bulk schedule all stops of an optimized territory route into CRM
 */
export async function bulkScheduleOptimizedVisitsAction(input: {
  visitDate: string;
  stops: ScheduleStopInput[];
}): Promise<{ success: boolean; scheduledCount: number; message: string }> {
  try {
    const supabase = await createClient();
    const { data: user } = await supabase.auth.getUser();

    if (!user?.user?.id) {
      return { success: false, scheduledCount: 0, message: "User tidak terautentikasi." };
    }

    const plannedStatus: VisitStatus = "PLANNED";
    const routineType: VisitType = "ROUTINE";

    const records = input.stops.map((stop, index) => ({
      id: randomUUID(),
      user_id: user.user.id,
      customer_id: stop.customerId,
      visit_date: input.visitDate || getTodayWIB(),
      visit_type: routineType,
      visit_status: plannedStatus,
      purpose: stop.purpose,
      discussion: `Rencana Rute Kunjungan #${index + 1} (Hermes Route Optimizer)\nTarget: ${stop.objective}\nTaktik: ${stop.talkingPoint}`,
      customer_response: null,
      opportunity_found: false,
    }));

    const { error } = await supabase.from("visits").insert(records);

    if (error) {
      console.error("bulkScheduleOptimizedVisitsAction error:", error.message);
      return { success: false, scheduledCount: 0, message: `Gagal menjadwalkan: ${error.message}` };
    }

    revalidatePath("/visits");
    revalidatePath("/dashboard");
    revalidatePath("/visits/plan");

    return {
      success: true,
      scheduledCount: records.length,
      message: `Berhasil menjadwalkan ${records.length} kunjungan rute ke CRM!`,
    };
  } catch (err: any) {
    console.error("bulkScheduleOptimizedVisitsAction exception:", err);
    return { success: false, scheduledCount: 0, message: err?.message || "Terjadi kesalahan internal." };
  }
}
