"use client";

import { useState } from "react";
import Link from "next/link";
import { logout } from "@/actions/auth";
import { formatCurrency } from "@/lib/utils/format";
import type { DashboardData } from "@/actions/dashboard";
import type { ManagerCommandCenterData } from "@/actions/manager";
import { RadialPacingGaugeCard } from "@/components/dashboard/radial-pacing-gauge-card";
import { ManagerCommandCenter } from "@/components/dashboard/manager-command-center";
import { ProductTechnicalSheetModal, type MasterProductItem } from "@/components/products/product-technical-sheet-modal";
import {
  Calendar,
  ChevronRight,
  Clock,
  Flame,
  LogOut,
  Target,
  Sparkles,
  Bot,
  BookOpen,
  ShieldCheck,
  LayoutDashboard,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

export function DashboardClient({
  data,
  products = [],
  managerData,
}: {
  data: DashboardData;
  products?: MasterProductItem[];
  managerData?: ManagerCommandCenterData;
}) {
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);
  const [activeRoleView, setActiveRoleView] = useState<"MANAGER" | "DSR">(
    managerData?.isManager ? "MANAGER" : "DSR"
  );

  const todayFormatted = new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Jakarta",
  }).format(new Date());

  const roleLabel = data.profile?.role ?? "DSR";
  const isManagerRole = managerData?.isManager;

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto space-y-5 pb-24">
      {/* 1. Header: Greeting & Role */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-black text-neutral-900 tracking-tight">
              Hi, {data.profile?.full_name ?? "Sales Rep"}
            </h1>
            <span
              className={cn(
                "rounded-full px-2.5 py-0.5 text-[9px] font-black uppercase border tracking-wide",
                isManagerRole
                  ? "bg-purple-100 text-purple-950 border-purple-300"
                  : "bg-amber-100 text-amber-950 border-amber-300/80"
              )}
            >
              {roleLabel}
            </span>
          </div>
          <p className="text-xs text-neutral-500 mt-0.5 capitalize font-medium">
            {todayFormatted} &bull; {roleLabel} {data.profile?.sales_area ? `(${data.profile.sales_area})` : ""}
          </p>
        </div>

        <form action={logout}>
          <button
            type="submit"
            aria-label="Keluar dari akun"
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-2xl border border-[#EAE4D9] bg-white p-2.5 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50 active:scale-95 transition cursor-pointer focus-visible:ring-2 focus-visible:ring-amber-500 outline-none shadow-2xs"
            title="Keluar / Logout"
          >
            <LogOut className="h-4 w-4" aria-hidden="true" />
          </button>
        </form>
      </div>

      {/* 2. ROLE VIEW TOGGLE FOR MANAGERS / SPV */}
      {isManagerRole && (
        <div className="flex items-center justify-between p-2 rounded-2xl bg-neutral-900 border border-neutral-800 text-white flex-wrap gap-2 shadow-sm">
          <div className="flex items-center gap-2 pl-2">
            <ShieldCheck className="h-4 w-4 text-amber-400" />
            <span className="text-xs font-extrabold">Mode Tampilan Sistem:</span>
          </div>
          <div className="flex items-center gap-1 bg-neutral-950 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setActiveRoleView("MANAGER")}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition active:scale-95",
                activeRoleView === "MANAGER"
                  ? "bg-gradient-to-r from-amber-600 to-amber-500 text-white shadow-xs"
                  : "text-neutral-400 hover:text-white"
              )}
            >
              <Users className="h-3.5 w-3.5" />
              <span>Command Center Tim</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveRoleView("DSR")}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition active:scale-95",
                activeRoleView === "DSR"
                  ? "bg-gradient-to-r from-amber-600 to-amber-500 text-white shadow-xs"
                  : "text-neutral-400 hover:text-white"
              )}
            >
              <LayoutDashboard className="h-3.5 w-3.5" />
              <span>DSR Field View</span>
            </button>
          </div>
        </div>
      )}

      {/* 3. CONDITIONAL CONTENT RENDERER */}
      {isManagerRole && activeRoleView === "MANAGER" && managerData ? (
        /* MANAGER COMMAND CENTER VIEW */
        <ManagerCommandCenter data={managerData} />
      ) : (
        /* DSR INDIVIDUAL FIELD DASHBOARD */
        <div className="space-y-5">
          {/* BANG RADIT MORNING BRIEFING CARD */}
          <div className="rounded-3xl border border-amber-300/90 bg-gradient-to-br from-amber-500/10 via-[#FFFDF9] to-white p-4 sm:p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 text-white shadow-xs">
                  <Bot className="h-4.5 w-4.5" />
                </div>
                <div>
                  <h2 className="text-xs sm:text-sm font-extrabold text-neutral-900 flex items-center gap-1.5">
                    <span>{data.morningBriefing?.greeting || "Briefing Taktis Pagi Ini"}</span>
                    <span className="inline-flex items-center gap-0.5 rounded-full bg-amber-500/20 px-2 py-0.5 text-[9px] font-bold text-amber-950 border border-amber-500/30">
                      <Sparkles className="h-2.5 w-2.5 text-amber-700" /> 13 Pilar Grounded
                    </span>
                  </h2>
                </div>
              </div>
            </div>

            <div className="space-y-1.5 text-xs text-neutral-800">
              <p className="font-semibold text-neutral-900 leading-relaxed">
                {data.morningBriefing?.focusText}
              </p>
              <div className="rounded-2xl bg-white/95 p-3 border border-amber-200/80 text-[11px] text-neutral-800 font-medium leading-relaxed italic shadow-2xs">
                <strong>Taktik Bang Radit:</strong> {data.morningBriefing?.tacticalTip}
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-amber-200/60 text-xs flex-wrap gap-2">
              <div className="flex items-center gap-2.5">
                <Link
                  href="/visits/plan"
                  className="text-[11px] font-extrabold text-amber-950 hover:text-amber-800 flex items-center gap-1 min-h-[36px] py-1 bg-amber-500/15 px-3 rounded-xl border border-amber-300 shadow-2xs"
                >
                  <span>Hermes Rute Cerdas</span>
                  <ChevronRight className="h-3.5 w-3.5 text-amber-700" />
                </Link>
                <Link
                  href="/follow-ups"
                  className="text-[11px] font-bold text-amber-950 hover:text-amber-800 flex items-center gap-1 min-h-[36px] py-1 px-2 rounded-lg hover:bg-amber-100/50 transition"
                >
                  <span>AI Radar</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </Link>
                <Link
                  href="/pipeline"
                  className="text-[11px] font-bold text-neutral-600 hover:text-neutral-900 flex items-center gap-1 min-h-[36px] py-1 px-2 rounded-lg hover:bg-neutral-100 transition"
                >
                  <span>Pipeline</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              </div>
              <button
                type="button"
                onClick={() => setIsCatalogOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-xl bg-amber-500/20 min-h-[38px] px-3.5 py-1.5 text-[11px] font-bold text-amber-950 border border-amber-500/40 hover:bg-amber-500/30 active:scale-95 transition cursor-pointer shadow-2xs"
              >
                <BookOpen className="h-3.5 w-3.5 text-amber-700" />
                <span>Contekan Spek Shell</span>
              </button>
            </div>
          </div>

          {/* TODAY COUNTERS */}
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 block mb-2">
              Aktivitas Hari Ini
            </span>
            <div className="grid grid-cols-3 gap-2.5">
              <Link
                href="/visits"
                className="rounded-2xl border border-[#EAE4D9] bg-white p-3.5 shadow-2xs hover:border-amber-300 transition text-center group focus-visible:ring-2 focus-visible:ring-amber-500 outline-none"
              >
                <div className="text-2xl font-black text-neutral-900 group-hover:text-amber-600 transition tabular-nums">
                  {data.todayVisitsCount}
                </div>
                <div className="text-[11px] font-medium text-neutral-500 mt-0.5 flex items-center justify-center gap-1">
                  <Calendar className="h-3 w-3 text-neutral-400" aria-hidden="true" />
                  <span>Visits</span>
                </div>
              </Link>

              <Link
                href="/follow-ups"
                className="rounded-2xl border border-[#EAE4D9] bg-white p-3.5 shadow-2xs hover:border-amber-300 transition text-center group focus-visible:ring-2 focus-visible:ring-amber-500 outline-none"
              >
                <div className="text-2xl font-black text-neutral-900 group-hover:text-amber-600 transition tabular-nums">
                  {data.todayFollowUpsCount}
                </div>
                <div className="text-[11px] font-medium text-neutral-500 mt-0.5 flex items-center justify-center gap-1">
                  <Clock className="h-3 w-3 text-neutral-400" aria-hidden="true" />
                  <span>Tasks</span>
                </div>
              </Link>

              <Link
                href="/follow-ups"
                className="rounded-2xl border border-[#EAE4D9] bg-white p-3.5 shadow-2xs hover:border-amber-300 transition text-center group focus-visible:ring-2 focus-visible:ring-amber-500 outline-none"
              >
                <div
                  className={cn(
                    "text-2xl font-black tabular-nums transition",
                    data.overdueCount > 0
                      ? "text-red-600 group-hover:text-red-700"
                      : "text-neutral-900 group-hover:text-amber-600"
                  )}
                >
                  {data.overdueCount}
                </div>
                <div className="text-[11px] font-medium text-neutral-500 mt-0.5 flex items-center justify-center gap-1">
                  <Flame
                    className={cn(
                      "h-3 w-3",
                      data.overdueCount > 0 ? "text-red-500" : "text-neutral-400"
                    )}
                    aria-hidden="true"
                  />
                  <span>Overdue</span>
                </div>
              </Link>
            </div>
          </div>

          {/* RADIAL PACING GAUGE CARD */}
          <RadialPacingGaugeCard
            wonVolumeLiter={data.monthlyWonVolume}
            targetVolumeLiter={data.monthlyVolumeTarget}
            wonValueIdr={data.monthlyWonValue}
            targetValueIdr={data.monthlyValueTarget}
            pipelineVolumeLiter={data.pipelineVolumeLiter}
            annualWonVolume={data.annualWonVolume}
            annualVolumeTarget={data.annualVolumeTarget}
          />

          {/* PRIORITY ALERTS */}
          {data.priorityAlerts.length > 0 && (
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 block mb-2">
                Prioritas Tindakan Cepat ({data.priorityAlerts.length})
              </span>
              <div className="flex flex-col gap-2">
                {data.priorityAlerts.map((alert) => (
                  <Link
                    key={alert.id}
                    href={alert.href}
                    className="flex items-center justify-between rounded-2xl border border-[#EAE4D9] bg-white p-3.5 shadow-2xs hover:border-amber-300 transition group focus-visible:ring-2 focus-visible:ring-amber-500 outline-none"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-neutral-900 truncate">
                            {alert.title}
                          </span>
                          <span
                            className={cn(
                              "rounded-md px-1.5 py-0.5 text-[9px] font-extrabold border shrink-0",
                              alert.badgeColor
                            )}
                          >
                            {alert.badge}
                          </span>
                        </div>
                        <p className="text-[11px] text-neutral-500 truncate mt-0.5">
                          {alert.subtitle}
                        </p>
                      </div>
                    </div>
                    <ChevronRight
                      className="h-4 w-4 text-neutral-400 group-hover:text-amber-600 transition shrink-0 ml-2"
                      aria-hidden="true"
                    />
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* PIPELINE SUMMARY */}
          <div className="rounded-3xl border border-[#EAE4D9] bg-white p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-amber-700" aria-hidden="true" />
                <span className="text-xs font-extrabold uppercase tracking-wider text-neutral-900">
                  Total Open Pipeline
                </span>
              </div>
              <Link
                href="/pipeline"
                className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1 focus-visible:ring-2 focus-visible:ring-amber-500 rounded outline-none"
              >
                <span>Detail</span>
                <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            </div>

            <div>
              <div className="text-2xl sm:text-3xl font-black text-neutral-900 font-mono">
                {formatCurrency(data.pipelineTotalValue)}
              </div>
              <p className="text-xs text-neutral-500 mt-0.5">
                Estimasi nilai seluruh deal aktif di pipeline
              </p>
            </div>

            {data.pipelineStageBreakdown.length > 0 && (
              <div className="pt-2 border-t border-neutral-100">
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                  {data.pipelineStageBreakdown.map((s) => (
                    <div
                      key={s.stage}
                      className="shrink-0 rounded-xl bg-neutral-50 border border-neutral-200/80 px-2.5 py-1.5 text-center"
                    >
                      <div className="text-[10px] font-bold text-neutral-400 uppercase">
                        {s.stage}
                      </div>
                      <div className="font-extrabold text-neutral-800 text-xs mt-0.5 font-mono">
                        {s.count} deal
                      </div>
                      <div className="text-[10px] text-neutral-500 font-mono">
                        {formatCurrency(s.value)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* PRODUCT CATALOG MODAL */}
      <ProductTechnicalSheetModal
        isOpen={isCatalogOpen}
        onClose={() => setIsCatalogOpen(false)}
        products={products}
      />
    </div>
  );
}
