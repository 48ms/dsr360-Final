"use server";

import { createClient } from "@/lib/supabase/server";
import { daysSince, getTodayWIB, getStartOfMonthWIB } from "@/lib/utils/format";
import { getRepQuotaTarget } from "@/lib/constants/quotas";

export type PriorityAlert = {
  id: string;
  type: "OVERDUE" | "DORMANT" | "TRIAL_CLOSING" | "PRIORITY_A";
  title: string;
  subtitle: string;
  badge: string;
  badgeColor: string;
  href: string;
};

export type DashboardData = {
  profile: {
    full_name: string;
    role: string;
    sales_area: string | null;
  } | null;
  todayVisitsCount: number;
  todayFollowUpsCount: number;
  overdueCount: number;
  priorityAlerts: PriorityAlert[];
  pipelineTotalValue: number;
  pipelineVolumeLiter: number;
  pipelineStageBreakdown: Array<{ stage: string; value: number; count: number }>;
  monthlyVisitsCompleted: number;
  monthlyDealsWon: number;
  monthlyWonVolume: number;
  monthlyWonValue: number;
  monthlyVolumeTarget: number;
  monthlyValueTarget: number;
  annualWonVolume: number;
  annualVolumeTarget: number;
  morningBriefing: {
    greeting: string;
    focusText: string;
    tacticalTip: string;
  };
};

export async function getDashboardData(): Promise<DashboardData> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      profile: null,
      todayVisitsCount: 0,
      todayFollowUpsCount: 0,
      overdueCount: 0,
      priorityAlerts: [],
      pipelineTotalValue: 0,
      pipelineVolumeLiter: 0,
      pipelineStageBreakdown: [],
      monthlyVisitsCompleted: 0,
      monthlyDealsWon: 0,
      monthlyWonVolume: 0,
      monthlyWonValue: 0,
      monthlyVolumeTarget: 4521, // Target Bulan Agustus: 4.521 Liter (~21.6 Drum)
      monthlyValueTarget: 226050000, // Target Nominal Bulan Ini: ~Rp 226 Juta
      annualWonVolume: 0,
      annualVolumeTarget: 50000, // Target 1 Tahun: 50.000 Liter (~239.2 Drum)
      morningBriefing: {
        greeting: "Semangat Pagi, Sales Champion!",
        focusText: "Pantau pipeline dan jadwal visit kamu hari ini.",
        tacticalTip: "Terapkan 13 Pilar Sales Masterpiece di setiap interaksi customer.",
      },
    };
  }

  const todayStr = getTodayWIB();
  const startOfMonth = getStartOfMonthWIB();

  // Parallel fetches for speed
  const [
    { data: profile },
    { data: todayVisits },
    { data: followUps },
    { data: opportunities },
    { data: customers },
    { data: monthlyVisits },
  ] = await Promise.all([
    supabase.from("profiles").select("full_name, role, sales_area").eq("id", user.id).single(),
    supabase
      .from("visits")
      .select("id, visit_status")
      .or(`visit_date.eq.${todayStr},visit_status.eq.IN_PROGRESS`),
    supabase
      .from("follow_ups")
      .select(
        `
        id,
        activity_type,
        description,
        due_date,
        priority,
        status,
        customer:customers (id, customer_name, city, priority)
      `
      )
      .eq("status", "PENDING")
      .order("due_date", { ascending: true }),
    supabase
      .from("opportunities")
      .select(
        `
        id,
        opportunity_name,
        stage,
        status,
        potential_value,
        potential_volume,
        updated_at,
        customer:customers (id, customer_name, priority)
      `
      )
      .neq("stage", "LOST")
      .limit(300),
    supabase
      .from("customers")
      .select(
        `
        id,
        customer_name,
        customer_code,
        city,
        status,
        priority,
        potential_monthly_volume,
        visits:visits (visit_date)
      `
      )
      .eq("priority", "A")
      .limit(30),
    supabase
      .from("visits")
      .select("id")
      .eq("visit_status", "COMPLETED")
      .gte("visit_date", startOfMonth),
  ]);

  // 1. Counters
  const todayVisitsCount = todayVisits?.length ?? 0;
  const pendingFollowUps = followUps ?? [];
  const todayFollowUpsCount = pendingFollowUps.filter((f) => f.due_date === todayStr).length;
  const overdueFollowUps = pendingFollowUps.filter((f) => f.due_date < todayStr);
  const overdueCount = overdueFollowUps.length;

  // 2. Priority Alerts ("What Should I Do Today?")
  const priorityAlerts: PriorityAlert[] = [];

  // Overdue follow-up alerts
  for (const f of overdueFollowUps.slice(0, 3)) {
    const overdueDays = Math.max(1, daysSince(f.due_date));
    priorityAlerts.push({
      id: f.id,
      type: "OVERDUE",
      title: f.customer?.customer_name ?? "Customer",
      subtitle: `${f.description || f.activity_type} · ${overdueDays} hari overdue`,
      badge: `🔴 ${overdueDays}d OVERDUE`,
      badgeColor: "bg-red-100 text-red-800 border-red-200",
      href: `/follow-ups`,
    });
  }

  // Priority A customers not visited in > 14 days
  for (const c of customers ?? []) {
    if (c.priority === "A") {
      const sortedVisits = (c.visits ?? []).sort((a, b) =>
        b.visit_date.localeCompare(a.visit_date)
      );
      const lastVisit = sortedVisits[0]?.visit_date;
      const days = lastVisit ? daysSince(lastVisit) : 999;

      if (days >= 14) {
        priorityAlerts.push({
          id: c.id,
          type: "PRIORITY_A",
          title: c.customer_name,
          subtitle: `Priority A · ${lastVisit ? `${days} hari belum dikunjungi` : "Belum pernah dikunjungi"}`,
          badge: "🔥 PRIORITY A",
          badgeColor: "bg-amber-100 text-amber-800 border-amber-200",
          href: `/customers/${c.id}`,
        });
      }
    }
  }

  // High-value deals in Trial or Quotation stage
  for (const opp of opportunities ?? []) {
    if (
      (opp.stage === "TRIAL" || opp.stage === "QUOTATION") &&
      (opp.potential_value ?? 0) >= 50_000_000
    ) {
      if (priorityAlerts.length < 6) {
        priorityAlerts.push({
          id: opp.id,
          type: "TRIAL_CLOSING",
          title: opp.customer?.customer_name ?? "Deal Besar",
          subtitle: `${opp.opportunity_name} · Stage ${opp.stage}`,
          badge: opp.stage === "TRIAL" ? "🟢 TRIAL" : "⚡ QUOTATION",
          badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-200",
          href: `/pipeline`,
        });
      }
    }
  }

  // 3. Pipeline Value & Volume Calculation
  let pipelineTotalValue = 0;
  let pipelineVolumeLiter = 0;
  const stageMap: Record<string, { value: number; count: number }> = {
    PROSPECT: { value: 0, count: 0 },
    QUALIFIED: { value: 0, count: 0 },
    PRESENTATION: { value: 0, count: 0 },
    TRIAL: { value: 0, count: 0 },
    QUOTATION: { value: 0, count: 0 },
    NEGOTIATION: { value: 0, count: 0 },
  };

  let monthlyDealsWon = 0;
  let monthlyWonVolume = 0;
  let monthlyWonValue = 0;
  let annualWonVolume = 0;
  const currentYearStr = String(new Date().getFullYear());

  for (const opp of opportunities ?? []) {
    const val = opp.potential_value ?? 0;
    const vol = opp.potential_volume ?? 0;

    if (opp.stage !== "LOST" && opp.stage !== "WON") {
      pipelineTotalValue += val;
      pipelineVolumeLiter += vol;
      if (stageMap[opp.stage]) {
        stageMap[opp.stage].value += val;
        stageMap[opp.stage].count += 1;
      }
    }
    if (opp.stage === "WON") {
      // Annual calculation
      if (!opp.updated_at || opp.updated_at.startsWith(currentYearStr)) {
        annualWonVolume += vol;
      }
      // Monthly calculation
      if (!opp.updated_at || opp.updated_at >= startOfMonth) {
        monthlyDealsWon += 1;
        monthlyWonVolume += vol;
        monthlyWonValue += val;
      }
    }
  }

  const pipelineStageBreakdown = Object.entries(stageMap)
    .filter(([, data]) => data.count > 0 || data.value > 0)
    .map(([stage, data]) => ({
      stage,
      value: data.value,
      count: data.count,
    }));

  const firstName = profile?.full_name?.split(" ")[0] || "Sales Rep";
  const greeting = `Semangat pagi, ${firstName}!`;
  let focusText = "";
  let tacticalTip = "";

  if (overdueCount > 0) {
    focusText = `Ada ${overdueCount} tugas follow-up tertunda yang perlu diamankan hari ini agar deal tidak lepas ke kompetitor.`;
    tacticalTip = "Buka menu Follow-Up dan gunakan fitur 'Bales Chat Customer' untuk menyapa PIC dengan penawaran solutif.";
  } else if (todayVisitsCount > 0) {
    focusText = `Kamu memiliki ${todayVisitsCount} agenda kunjungan lapangan terjadwal hari ini. Pastikan strategi POPSA sudah kamu review.`;
    tacticalTip = "Saat di pabrik, tawarkan program audit LubeCheck dan uji lab LubeAnalyst gratis sebagai pintu masuk bernilai tambah.";
  } else {
    focusText = `Pipeline aktif saat ini bernilai Rp ${Math.round(pipelineTotalValue).toLocaleString("id-ID")}. Momen bagus untuk prospecting akun prioritas baru.`;
    tacticalTip = "Kunci komitmen mikro bertahap (sample test / penawaran resmi) untuk mempercepat pergerakan deal ke tahap Won.";
  }

    const repTarget = getRepQuotaTarget(user.id, profile?.full_name);

    return {
      profile: profile
        ? {
            full_name: profile.full_name,
            role: profile.role,
            sales_area: profile.sales_area,
          }
        : null,
      todayVisitsCount,
      todayFollowUpsCount,
      overdueCount,
      priorityAlerts,
      pipelineTotalValue,
      pipelineVolumeLiter,
      pipelineStageBreakdown,
      monthlyVisitsCompleted: monthlyVisits?.length ?? 0,
      monthlyDealsWon,
      monthlyWonVolume,
      monthlyWonValue,
      monthlyVolumeTarget: repTarget.monthlyVolumeLiter,
      monthlyValueTarget: repTarget.monthlyValueIdr,
      annualWonVolume,
      annualVolumeTarget: repTarget.annualVolumeLiter,
      morningBriefing: {
        greeting,
        focusText,
        tacticalTip,
      },
    };
  }
