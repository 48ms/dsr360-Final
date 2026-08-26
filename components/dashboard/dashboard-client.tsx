"use client";

import { useState } from "react";
import Link from "next/link";
import { logout } from "@/actions/auth";
import { formatCurrency } from "@/lib/utils/format";
import type { DashboardData } from "@/actions/dashboard";
import { RadialPacingGaugeCard } from "@/components/dashboard/radial-pacing-gauge-card";
import { ProductTechnicalSheetModal, type MasterProductItem } from "@/components/products/product-technical-sheet-modal";
import {
  Calendar,
  ChevronRight,
  Clock,
  Flame,
  LogOut,
  Target,
  Zap,
  Sparkles,
  Bot,
  BookOpen,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

export function DashboardClient({
  data,
  products = [],
}: {
  data: DashboardData;
  products?: MasterProductItem[];
}) {
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);

  const todayFormatted = new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Jakarta",
  }).format(new Date());

  return (
    <div className="p-4 sm:p-6 max-w-3xl mx-auto space-y-5 pb-24">
      {/* 1. Header: Greeting & Role */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-black text-neutral-900 tracking-tight">
              Hi, {data.profile?.full_name ?? "Sales Rep"}
            </h1>
            <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[9px] font-black text-amber-950 uppercase border border-amber-300/80">
              Executive
            </span>
          </div>
          <p className="text-xs text-neutral-500 mt-0.5 capitalize font-medium">
            {todayFormatted} &bull; {data.profile?.role ?? "DSR"} {data.profile?.sales_area ? `(${data.profile.sales_area})` : ""}
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

      {/* 2. BANG RADIT MORNING BRIEFING CARD */}
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

      {/* 3. TODAY COUNTERS */}
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
              <span>Follow-Up</span>
            </div>
          </Link>

          <Link
            href="/follow-ups"
            className={cn(
              "rounded-2xl border p-3.5 shadow-2xs transition text-center group focus-visible:ring-2 focus-visible:ring-amber-500 outline-none",
              data.overdueCount > 0
                ? "border-red-300 bg-red-50/40 hover:border-red-400"
                : "border-[#EAE4D9] bg-white hover:border-amber-300"
            )}
          >
            <div
              className={cn(
                "text-2xl font-black transition tabular-nums",
                data.overdueCount > 0 ? "text-red-700 font-black" : "text-neutral-900"
              )}
            >
              {data.overdueCount}
            </div>
            <div
              className={cn(
                "text-[11px] font-medium mt-0.5 flex items-center justify-center gap-1",
                data.overdueCount > 0 ? "text-red-600 font-bold" : "text-neutral-500"
              )}
            >
              <Flame className="h-3 w-3 text-red-500" aria-hidden="true" />
              <span>Overdue</span>
            </div>
          </Link>
        </div>
      </div>

      {/* 4. 🎯 CINEMATIC INDUSTRIAL RADIAL PACING GAUGE (OVERDRIVE) */}
      <RadialPacingGaugeCard
        wonVolumeLiter={data.monthlyWonVolume || 0}
        targetVolumeLiter={data.monthlyVolumeTarget || 8360}
        wonValueIdr={data.monthlyWonValue || 0}
        targetValueIdr={data.monthlyValueTarget || 350000000}
        pipelineVolumeLiter={data.pipelineTotalValue ? Math.round(data.pipelineTotalValue / 50000) : 0}
      />

      {/* 5. 🔥 PRIORITY TODAY ("What Should I Do Today?") */}
      <div className="rounded-3xl border border-[#EAE4D9] bg-white p-4 sm:p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-[#EAE4D9]/60">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-amber-500/15 text-amber-600">
              <Flame className="h-3.5 w-3.5" />
            </div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
              Priority Today
            </h2>
          </div>
          <span className="text-[10px] font-bold text-neutral-400 uppercase">
            Aksi Utama DSR
          </span>
        </div>

        {data.priorityAlerts.length === 0 ? (
          <div className="py-4 text-center text-xs text-neutral-400">
            Semua task dan kunjungan prioritas aman terkendali.
          </div>
        ) : (
          <div className="divide-y divide-[#EAE4D9]/60">
            {data.priorityAlerts.map((alert) => (
              <Link
                key={alert.id}
                href={alert.href}
                className="flex items-center justify-between py-2.5 hover:bg-neutral-50 rounded-xl px-2 -mx-2 transition group"
              >
                <div className="min-w-0 pr-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-neutral-900 group-hover:text-amber-600 transition truncate">
                      {alert.title}
                    </span>
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.2 text-[9px] font-extrabold border shrink-0",
                        alert.badgeColor
                      )}
                    >
                      {alert.badge}
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-500 mt-0.5 truncate">
                    {alert.subtitle}
                  </p>
                </div>
                <ChevronRight className="h-4 w-4 text-neutral-400 group-hover:text-neutral-900 transition shrink-0" />
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* 6. PIPELINE SUMMARY */}
      <div className="rounded-3xl bg-gradient-to-b from-[#0F172A] to-[#0B0F19] p-5 text-white shadow-md space-y-4 border border-neutral-800">
        <div className="flex items-center justify-between">
          <span className="text-xs uppercase tracking-wider text-neutral-400 font-semibold flex items-center gap-1.5">
            <Target className="h-4 w-4 text-amber-400" />
            Sales Pipeline
          </span>
          <Link
            href="/pipeline"
            className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1"
          >
            Lihat Funnel
            <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div>
          <div className="text-3xl font-black text-white tracking-tight">
            {formatCurrency(data.pipelineTotalValue)}
          </div>
          <p className="text-xs text-neutral-400 mt-0.5">Total potensi nilai deal yang sedang berjalan</p>
        </div>

        {/* Stage Subtotals Grid */}
        {data.pipelineStageBreakdown.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-neutral-800">
            {data.pipelineStageBreakdown.map((item) => (
              <div key={item.stage} className="rounded-2xl bg-neutral-950/70 p-2.5 border border-neutral-800">
                <span className="text-[10px] font-bold text-neutral-400 uppercase block">
                  {item.stage} ({item.count})
                </span>
                <span className="text-xs font-bold text-amber-300 mt-0.5 block truncate">
                  {formatCurrency(item.value)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 7. MONTHLY PERFORMANCE KPI */}
      <div className="rounded-3xl border border-[#EAE4D9] bg-white p-4 sm:p-5 shadow-xs space-y-3">
        <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 block">
          Pencapaian Bulan Ini
        </span>
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="rounded-xl bg-neutral-50 p-3 border border-neutral-100">
            <span className="text-neutral-500 text-[11px] block">Kunjungan Selesai:</span>
            <span className="text-base font-extrabold text-neutral-900 mt-0.5 block">
              {data.monthlyVisitsCompleted} Visit
            </span>
          </div>
          <div className="rounded-xl bg-neutral-50 p-3 border border-neutral-100">
            <span className="text-neutral-500 text-[11px] block">Deal Won (Closing):</span>
            <span className="text-base font-extrabold text-emerald-700 mt-0.5 block">
              {data.monthlyDealsWon} Deal Closed
            </span>
          </div>
        </div>
      </div>

      {/* 8. PROMINENT CTA: QUICK VISIT */}
      <div className="pt-2">
        <Link
          href="/visits/quick"
          className="w-full min-h-[50px] flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 py-3.5 text-sm font-bold text-white shadow-lg hover:from-amber-600 hover:to-amber-700 active:scale-[0.98] transition-all duration-150 cursor-pointer"
        >
          <Zap className="h-4 w-4 fill-current" />
          <span>⚡ + QUICK VISIT LAPANGAN (1 MENIT)</span>
        </Link>
      </div>

      {/* 9. Technical Sheet Modal */}
      <ProductTechnicalSheetModal
        isOpen={isCatalogOpen}
        onClose={() => setIsCatalogOpen(false)}
        products={products}
      />
    </div>
  );
}
