"use server";

import { createClient } from "@/lib/supabase/server";
import { getTodayWIB, getStartOfMonthWIB } from "@/lib/utils/format";
import { getPendingSphApprovals, type SphApprovalItem } from "@/actions/sph-approval";

export type RepPerformance = {
  id: string;
  fullName: string;
  salesArea: string | null;
  role: string;
  monthlyTargetLiter: number;
  monthlyWonLiter: number;
  monthlyWonValue: number;
  pipelineValue: number;
  pipelineVolumeLiter: number;
  activeOpportunitiesCount: number;
  completedVisitsCount: number;
  overdueTasksCount: number;
  totalCustomersCount: number;
};

export type ManagerTeamDeal = {
  id: string;
  customerId: string;
  opportunityName: string;
  stage: string;
  potentialValue: number;
  potentialVolume: number;
  customerName: string;
  customerCity: string | null;
  ownerName: string;
  ownerArea: string | null;
  updatedAt: string;
};

export type ManagerCommandCenterData = {
  isManager: boolean;
  userRole: string;
  totalTeamWonVolume: number;
  totalTeamWonValue: number;
  totalTeamTargetVolume: number;
  totalTeamPipelineValue: number;
  totalTeamPipelineVolume: number;
  totalActiveDeals: number;
  totalCompletedVisits: number;
  totalOverdueTasks: number;
  reps: RepPerformance[];
  recentTeamDeals: ManagerTeamDeal[];
  pendingSphApprovals: SphApprovalItem[];
  territorySummary: Array<{
    area: string;
    repsCount: number;
    customersCount: number;
    wonVolume: number;
    pipelineValue: number;
  }>;
};

export async function getManagerCommandCenterData(): Promise<ManagerCommandCenterData> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      isManager: false,
      userRole: "DSR",
      totalTeamWonVolume: 0,
      totalTeamWonValue: 0,
      totalTeamTargetVolume: 0,
      totalTeamPipelineValue: 0,
      totalTeamPipelineVolume: 0,
      totalActiveDeals: 0,
      totalCompletedVisits: 0,
      totalOverdueTasks: 0,
      reps: [],
      recentTeamDeals: [],
      pendingSphApprovals: [],
      territorySummary: [],
    };
  }

  const startOfMonth = getStartOfMonthWIB();
  const todayStr = getTodayWIB();

  // Fetch current user's profile
  const { data: myProfile } = await supabase
    .from("profiles")
    .select("id, full_name, role, sales_area")
    .eq("id", user.id)
    .single();

  const isManagerRole =
    myProfile?.role === "MANAGER" ||
    myProfile?.role === "SPV" ||
    myProfile?.role === "ADMIN";

  // Fetch all profiles, customers, opportunities, visits, and follow-ups
  const [
    { data: allProfiles },
    { data: allCustomers },
    { data: allOpportunities },
    { data: allVisits },
    { data: allFollowUps },
  ] = await Promise.all([
    supabase
      .from("profiles")
      .select("id, full_name, role, sales_area, is_active, annual_quota_liter, monthly_quota_liter")
      .order("full_name"),
    supabase
      .from("customers")
      .select("id, customer_name, city, priority, status, owner_id, potential_monthly_volume"),
    supabase
      .from("opportunities")
      .select(
        `
        id,
        opportunity_name,
        stage,
        potential_value,
        potential_volume,
        created_by,
        created_at,
        updated_at,
        customer:customers (id, customer_name, city)
      `
      )
      .neq("stage", "LOST")
      .order("updated_at", { ascending: false }),
    supabase
      .from("visits")
      .select("id, user_id, visit_status, visit_date")
      .eq("visit_status", "COMPLETED")
      .gte("visit_date", startOfMonth),
    supabase
      .from("follow_ups")
      .select("id, user_id, status, due_date")
      .eq("status", "PENDING"),
  ]);

  const profilesList = allProfiles ?? [];
  const customersList = allCustomers ?? [];
  const opportunitiesList = allOpportunities ?? [];
  const visitsList = allVisits ?? [];
  const followUpsList = allFollowUps ?? [];

  // Filter only DSR reps (and SPVs) for leaderboard
  const salesReps = profilesList.filter(
    (p) => p.role === "DSR" || p.role === "SPV"
  );

  let teamTotalWonVol = 0;
  let teamTotalWonVal = 0;
  let teamTotalPipeVal = 0;
  let teamTotalPipeVol = 0;
  let teamTotalTargetVol = 0;

  const repsData: RepPerformance[] = salesReps.map((rep) => {
    const repCustomers = customersList.filter((c) => c.owner_id === rep.id);
    const repOpps = opportunitiesList.filter((o) => o.created_by === rep.id);
    const repVisits = visitsList.filter((v) => v.user_id === rep.id);
    const repFollowUps = followUpsList.filter((f) => f.user_id === rep.id);

    const wonDeals = repOpps.filter((o) => o.stage === "WON");
    const openDeals = repOpps.filter((o) => o.stage !== "WON" && o.stage !== "LOST");

    const wonLiter = wonDeals.reduce((sum, o) => sum + (Number(o.potential_volume) || 0), 0);
    const wonValue = wonDeals.reduce((sum, o) => sum + (Number(o.potential_value) || 0), 0);
    const pipeValue = openDeals.reduce((sum, o) => sum + (Number(o.potential_value) || 0), 0);
    const pipeVolume = openDeals.reduce((sum, o) => sum + (Number(o.potential_volume) || 0), 0);

    const overdueTasks = repFollowUps.filter((f) => f.due_date < todayStr).length;

    // Individual Monthly Target from database profiles
    const repWithQuota = rep as {
      annual_quota_liter?: number | null;
      monthly_quota_liter?: number | null;
    };
    const annualTarget = Number(repWithQuota.annual_quota_liter) || 50000;
    const targetLiter = Number(repWithQuota.monthly_quota_liter) || Math.round(annualTarget / 12);

    teamTotalWonVol += wonLiter;
    teamTotalWonVal += wonValue;
    teamTotalPipeVal += pipeValue;
    teamTotalPipeVol += pipeVolume;
    teamTotalTargetVol += targetLiter;

    return {
      id: rep.id,
      fullName: rep.full_name || "Sales Rep",
      salesArea: rep.sales_area || "General",
      role: rep.role,
      monthlyTargetLiter: targetLiter,
      monthlyWonLiter: wonLiter,
      monthlyWonValue: wonValue,
      pipelineValue: pipeValue,
      pipelineVolumeLiter: pipeVolume,
      activeOpportunitiesCount: openDeals.length,
      completedVisitsCount: repVisits.length,
      overdueTasksCount: overdueTasks,
      totalCustomersCount: repCustomers.length,
    };
  });

  // Recent team deals
  const recentDeals: ManagerTeamDeal[] = opportunitiesList.slice(0, 15).map((opp) => {
    const owner = profilesList.find((p) => p.id === opp.created_by);
    return {
      id: opp.id,
      customerId: opp.customer?.id || "",
      opportunityName: opp.opportunity_name,
      stage: opp.stage,
      potentialValue: Number(opp.potential_value) || 0,
      potentialVolume: Number(opp.potential_volume) || 0,
      customerName: opp.customer?.customer_name || "Unknown Customer",
      customerCity: opp.customer?.city || null,
      ownerName: owner?.full_name || "Unassigned",
      ownerArea: owner?.sales_area || null,
      updatedAt: opp.updated_at || opp.created_at,
    };
  });

  // Territory Aggregation
  const areaMap: Record<string, { reps: Set<string>; custCount: number; wonVol: number; pipeVal: number }> = {};
  for (const rep of repsData) {
    const area = rep.salesArea || "Lainnya";
    if (!areaMap[area]) {
      areaMap[area] = { reps: new Set(), custCount: 0, wonVol: 0, pipeVal: 0 };
    }
    areaMap[area].reps.add(rep.id);
    areaMap[area].custCount += rep.totalCustomersCount;
    areaMap[area].wonVol += rep.monthlyWonLiter;
    areaMap[area].pipeVal += rep.pipelineValue;
  }

  const territorySummary = Object.entries(areaMap).map(([area, data]) => ({
    area,
    repsCount: data.reps.size,
    customersCount: data.custCount,
    wonVolume: data.wonVol,
    pipelineValue: data.pipeVal,
  }));

  const totalOverdue = followUpsList.filter((f) => f.due_date < todayStr).length;

  const pendingSphApprovals = isManagerRole ? await getPendingSphApprovals() : [];

  return {
    isManager: isManagerRole,
    userRole: myProfile?.role || "DSR",
    totalTeamWonVolume: teamTotalWonVol,
    totalTeamWonValue: teamTotalWonVal,
    totalTeamTargetVolume: teamTotalTargetVol || 4521,
    totalTeamPipelineValue: teamTotalPipeVal,
    totalTeamPipelineVolume: teamTotalPipeVol,
    totalActiveDeals: opportunitiesList.filter((o) => o.stage !== "WON" && o.stage !== "LOST").length,
    totalCompletedVisits: visitsList.length,
    totalOverdueTasks: totalOverdue,
    reps: repsData,
    recentTeamDeals: recentDeals,
    pendingSphApprovals,
    territorySummary,
  };
}
