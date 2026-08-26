"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { formatCurrency, formatNumber } from "@/lib/utils/format";
import type { ManagerCommandCenterData, RepPerformance } from "@/actions/manager";
import { ReassignAccountModal } from "@/components/customers/reassign-account-modal";
import {
  approveSphDiscountAction,
  rejectSphDiscountAction,
  type SphApprovalItem,
} from "@/actions/sph-approval";
import {
  Users,
  Trophy,
  TrendingUp,
  AlertTriangle,
  MapPin,
  Briefcase,
  ChevronRight,
  ShieldCheck,
  Award,
  Filter,
  BarChart3,
  Calendar,
  CheckCircle2,
  UserCheck,
  FileCheck,
  FileX,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

export function ManagerCommandCenter({
  data,
}: {
  data: ManagerCommandCenterData;
}) {
  const [selectedArea, setSelectedArea] = useState<string>("ALL");
  const [approvalsList, setApprovalsList] = useState<SphApprovalItem[]>(
    data.pendingSphApprovals || []
  );
  const [reassignTarget, setReassignTarget] = useState<{
    customerId: string;
    customerName: string;
    ownerName?: string;
  } | null>(null);

  const [processingSphId, setProcessingSphId] = useState<string | null>(null);
  const [approvalFeedback, setApprovalFeedback] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const filteredReps =
    selectedArea === "ALL"
      ? data.reps
      : data.reps.filter((r) => r.salesArea === selectedArea);

  const filteredDeals =
    selectedArea === "ALL"
      ? data.recentTeamDeals
      : data.recentTeamDeals.filter((d) => d.ownerArea === selectedArea);

  const teamWonPacingPct =
    data.totalTeamTargetVolume > 0
      ? Math.min(
          100,
          Math.round((data.totalTeamWonVolume / data.totalTeamTargetVolume) * 100)
        )
      : 0;

  const totalWonDrums = (data.totalTeamWonVolume / 209).toFixed(1);
  const totalTargetDrums = (data.totalTeamTargetVolume / 209).toFixed(1);
  const totalPipelineDrums = (data.totalTeamPipelineVolume / 209).toFixed(1);

  function handleApproveSph(oppId: string) {
    setProcessingSphId(oppId);
    setApprovalFeedback(null);
    startTransition(async () => {
      const res = await approveSphDiscountAction(oppId);
      if (res.success) {
        setApprovalFeedback(res.message);
        setApprovalsList((prev) => prev.filter((a) => a.opportunityId !== oppId));
      }
      setProcessingSphId(null);
    });
  }

  function handleRejectSph(oppId: string) {
    const reason = window.prompt("Masukkan alasan penolakan / catatan revisi untuk DSR:") || "Harga di bawah batas toleransi profit margin distributor.";
    setProcessingSphId(oppId);
    setApprovalFeedback(null);
    startTransition(async () => {
      const res = await rejectSphDiscountAction(oppId, reason);
      if (res.success) {
        setApprovalFeedback(res.message);
        setApprovalsList((prev) => prev.filter((a) => a.opportunityId !== oppId));
      }
      setProcessingSphId(null);
    });
  }

  return (
    <div className="space-y-6">
      {/* 1. COMMAND CENTER BANNER */}
      <div className="rounded-3xl bg-neutral-950 text-white p-5 sm:p-6 border border-neutral-800 shadow-xl space-y-4">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/20 px-3 py-0.5 text-xs font-bold text-amber-300 border border-amber-500/40">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Executive Command Center</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
              Macro Territory &amp; Team Pipeline Overview
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 font-medium leading-relaxed max-w-xl">
              Monitoring performa kuota, leaderboard tim sales, approval diskon SPH, dan pipeline deal seluruh DSR secara real-time.
            </p>
          </div>

          {/* Area Filter Selector */}
          <div className="flex items-center gap-2 bg-neutral-900 border border-neutral-800 p-1.5 rounded-2xl">
            <Filter className="h-4 w-4 text-neutral-400 ml-2" />
            <select
              value={selectedArea}
              onChange={(e) => setSelectedArea(e.target.value)}
              className="bg-transparent text-xs font-bold text-neutral-200 outline-none pr-2 cursor-pointer"
            >
              <option value="ALL" className="bg-neutral-900 text-white">
                Semua Wilayah ({data.reps.length} DSR)
              </option>
              {data.territorySummary.map((t) => (
                <option key={t.area} value={t.area} className="bg-neutral-900 text-white">
                  Area {t.area} ({t.repsCount} DSR)
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Macro KPI Cards Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
          {/* KPI 1: Realisasi Volume Tim */}
          <div className="rounded-2xl bg-neutral-900/90 border border-neutral-800 p-3.5 space-y-1.5">
            <div className="flex items-center justify-between text-neutral-400 text-xs">
              <span className="font-semibold">Realisasi Closing</span>
              <Trophy className="h-4 w-4 text-amber-400" />
            </div>
            <div className="text-lg sm:text-xl font-black font-mono text-amber-400">
              {formatNumber(data.totalTeamWonVolume)}{" "}
              <span className="text-xs text-neutral-400 font-sans">L</span>
            </div>
            <div className="text-[11px] text-neutral-400 font-mono">
              ≈ {totalWonDrums} Drum ({teamWonPacingPct}% kuota)
            </div>
          </div>

          {/* KPI 2: Total Pipeline Nilai */}
          <div className="rounded-2xl bg-neutral-900/90 border border-neutral-800 p-3.5 space-y-1.5">
            <div className="flex items-center justify-between text-neutral-400 text-xs">
              <span className="font-semibold">Open Pipeline Tim</span>
              <TrendingUp className="h-4 w-4 text-emerald-400" />
            </div>
            <div className="text-lg sm:text-xl font-black font-mono text-white">
              {formatCurrency(data.totalTeamPipelineValue)}
            </div>
            <div className="text-[11px] text-emerald-400 font-mono">
              {data.totalActiveDeals} Deal Aktif ({totalPipelineDrums} Drum)
            </div>
          </div>

          {/* KPI 3: Total Kunjungan Tim */}
          <div className="rounded-2xl bg-neutral-900/90 border border-neutral-800 p-3.5 space-y-1.5">
            <div className="flex items-center justify-between text-neutral-400 text-xs">
              <span className="font-semibold">Kunjungan Bulan Ini</span>
              <CheckCircle2 className="h-4 w-4 text-blue-400" />
            </div>
            <div className="text-lg sm:text-xl font-black font-mono text-white">
              {data.totalCompletedVisits}{" "}
              <span className="text-xs text-neutral-400 font-sans">Visits</span>
            </div>
            <div className="text-[11px] text-blue-400 font-medium">
              Selesai &amp; Terverifikasi GPS
            </div>
          </div>

          {/* KPI 4: Overdue Follow-ups */}
          <div className="rounded-2xl bg-neutral-900/90 border border-neutral-800 p-3.5 space-y-1.5">
            <div className="flex items-center justify-between text-neutral-400 text-xs">
              <span className="font-semibold">Tugas Overdue Tim</span>
              <AlertTriangle className="h-4 w-4 text-red-400" />
            </div>
            <div className="text-lg sm:text-xl font-black font-mono text-red-400">
              {data.totalOverdueTasks}{" "}
              <span className="text-xs text-neutral-400 font-sans">Tugas</span>
            </div>
            <div className="text-[11px] text-red-300 font-medium">
              Butuh Pembinaan / Follow-up
            </div>
          </div>
        </div>

        {/* Team Progress Pacing Bar */}
        <div className="space-y-1 pt-1">
          <div className="flex items-center justify-between text-xs text-neutral-400 font-medium">
            <span>Progress Target Volume Tim Bulan Ini</span>
            <span className="font-mono font-bold text-amber-400">
              {formatNumber(data.totalTeamWonVolume)} / {formatNumber(data.totalTeamTargetVolume)} L ({teamWonPacingPct}%)
            </span>
          </div>
          <div className="h-2 w-full rounded-full bg-neutral-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full transition-all duration-500"
              style={{ width: `${teamWonPacingPct}%` }}
            />
          </div>
        </div>
      </div>

      {/* 2. PENDING SPH DISCOUNT APPROVALS SECTION */}
      {approvalsList.length > 0 && (
        <div className="rounded-3xl border-2 border-amber-400 bg-amber-50/50 p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500 text-white font-black">
                <AlertTriangle className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-sm font-black text-amber-950 tracking-tight flex items-center gap-1.5">
                  <span>Permohonan Persetujuan Diskon SPH ({approvalsList.length})</span>
                  <span className="rounded-full bg-amber-200 px-2 py-0.2 text-[10px] font-bold text-amber-900">
                    Perlu Keputusan Manager
                  </span>
                </h3>
                <p className="text-[11px] text-amber-800 font-medium">
                  Pengajuan harga khusus di bawah Floor Price standard oleh DSR
                </p>
              </div>
            </div>
          </div>

          {approvalFeedback && (
            <div className="rounded-xl bg-emerald-100 text-emerald-800 p-2.5 text-xs font-bold flex items-center gap-1.5 border border-emerald-300">
              <CheckCircle2 className="h-4 w-4 text-emerald-700 shrink-0" />
              <span>{approvalFeedback}</span>
            </div>
          )}

          <div className="space-y-2.5">
            {approvalsList.map((app) => (
              <div
                key={app.opportunityId}
                className="rounded-2xl bg-white p-4 border border-amber-200 shadow-2xs space-y-3"
              >
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-xs text-neutral-900">
                        {app.customerName}
                      </span>
                      <span className="font-mono text-[10px] font-bold bg-neutral-100 px-1.5 py-0.5 rounded text-neutral-700">
                        {app.sphNumber}
                      </span>
                    </div>
                    <div className="text-[11px] text-neutral-500 font-medium mt-0.5">
                      DSR: <strong className="text-neutral-800">{app.dsrName}</strong> ({app.dsrArea || "General"})
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xs font-black font-mono text-neutral-900">
                      {formatCurrency(app.potentialValue)}
                    </div>
                    <div className="text-[10px] text-amber-700 font-bold font-mono">
                      Volume: {app.potentialVolume} L ({(app.potentialVolume / 209).toFixed(1)} Drum)
                    </div>
                  </div>
                </div>

                <div className="rounded-xl bg-amber-50/80 p-2.5 border border-amber-200/60 text-xs text-amber-950 font-medium">
                  <strong>Catatan Alasan DSR:</strong> {app.discountReason}
                </div>

                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => handleRejectSph(app.opportunityId)}
                    disabled={isPending && processingSphId === app.opportunityId}
                    className="flex items-center gap-1.5 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 px-3.5 py-1.5 text-xs font-bold transition active:scale-95 cursor-pointer disabled:opacity-50"
                  >
                    <FileX className="h-3.5 w-3.5" />
                    <span>Tolak / Minta Revisi</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleApproveSph(app.opportunityId)}
                    disabled={isPending && processingSphId === app.opportunityId}
                    className="flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-1.5 text-xs font-bold transition active:scale-95 shadow-2xs cursor-pointer disabled:opacity-50"
                  >
                    <FileCheck className="h-3.5 w-3.5" />
                    <span>{isPending && processingSphId === app.opportunityId ? "Memproses..." : "Setujui Harga (Approve)"}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. SALES REPS PERFORMANCE LEADERBOARD */}
      <div className="rounded-3xl border border-[#EAE4D9] bg-white p-5 sm:p-6 shadow-2xs space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-amber-100 text-amber-900 font-black">
              <Award className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-neutral-900 tracking-tight">
                Sales Reps Performance &amp; Quota Pacing
              </h3>
              <p className="text-xs text-neutral-500 font-medium">
                Pencapaian kuota individu, volume won, pipeline, dan kunjungan lapangan
              </p>
            </div>
          </div>
          <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-bold text-neutral-700">
            {filteredReps.length} Sales Rep
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-neutral-200 text-neutral-400 uppercase tracking-wider font-extrabold">
                <th className="pb-3 pr-4">Nama DSR</th>
                <th className="pb-3 px-3">Area</th>
                <th className="pb-3 px-3 text-right">Target (L)</th>
                <th className="pb-3 px-3 text-right">Won (L)</th>
                <th className="pb-3 px-3 text-center">Pacing</th>
                <th className="pb-3 px-3 text-right">Pipeline (Rp)</th>
                <th className="pb-3 px-3 text-center">Visits</th>
                <th className="pb-3 pl-3 text-center">Overdue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 font-medium text-neutral-800">
              {filteredReps.map((rep) => {
                const pacingPct =
                  rep.monthlyTargetLiter > 0
                    ? Math.min(
                        100,
                        Math.round((rep.monthlyWonLiter / rep.monthlyTargetLiter) * 100)
                      )
                    : 0;

                return (
                  <tr key={rep.id} className="hover:bg-neutral-50/80 transition">
                    <td className="py-3.5 pr-4 font-bold text-neutral-900 flex items-center gap-2">
                      <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-neutral-900 text-white font-bold text-[11px]">
                        {rep.fullName.charAt(0)}
                      </div>
                      <div>
                        <div className="leading-tight">{rep.fullName}</div>
                        <div className="text-[10px] text-neutral-400 font-normal">{rep.role} &bull; {rep.salesArea || "Umum"}</div>
                      </div>
                    </td>

                    <td className="py-3.5 px-3">
                      <span className="inline-flex items-center rounded-md bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-900 border border-amber-200">
                        {rep.salesArea}
                      </span>
                    </td>

                    <td className="py-3.5 px-3 text-right font-mono font-semibold">
                      {formatNumber(rep.monthlyTargetLiter)}
                    </td>

                    <td className="py-3.5 px-3 text-right font-mono font-bold text-amber-600">
                      {formatNumber(rep.monthlyWonLiter)}{" "}
                      <span className="text-[10px] text-neutral-400 font-normal">
                        ({(rep.monthlyWonLiter / 209).toFixed(1)} D)
                      </span>
                    </td>

                    <td className="py-3.5 px-3 text-center">
                      <span
                        className={cn(
                          "inline-block px-2 py-0.5 rounded-full text-[10px] font-bold font-mono",
                          pacingPct >= 50
                            ? "bg-emerald-100 text-emerald-800"
                            : pacingPct > 0
                            ? "bg-amber-100 text-amber-800"
                            : "bg-neutral-100 text-neutral-600"
                        )}
                      >
                        {pacingPct}%
                      </span>
                    </td>

                    <td className="py-3.5 px-3 text-right font-mono font-bold text-neutral-900">
                      {formatCurrency(rep.pipelineValue)}
                    </td>

                    <td className="py-3.5 px-3 text-center font-mono font-semibold">
                      {rep.completedVisitsCount}
                    </td>

                    <td className="py-3.5 pl-3 text-center">
                      {rep.overdueTasksCount > 0 ? (
                        <span className="inline-flex items-center rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-bold text-red-700">
                          {rep.overdueTasksCount} task
                        </span>
                      ) : (
                        <span className="text-emerald-600 text-[11px] font-bold">✓ Aman</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. RECENT TEAM DEALS LIVE STREAM */}
      <div className="rounded-3xl border border-[#EAE4D9] bg-white p-5 sm:p-6 shadow-2xs space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-neutral-100 text-neutral-900 font-black">
              <Briefcase className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-neutral-900 tracking-tight">
                Live Deals &amp; Opportunities Stream
              </h3>
              <p className="text-xs text-neutral-500 font-medium">
                Peluang transaksi aktif yang sedang dinegosiasikan oleh tim DSR
              </p>
            </div>
          </div>
          <Link
            href="/pipeline"
            className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1"
          >
            Lihat Semua Pipeline <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="space-y-2.5">
          {filteredDeals.length === 0 ? (
            <div className="text-center py-6 text-xs text-neutral-400 font-medium">
              Belum ada opportunity yang tercatat di wilayah ini.
            </div>
          ) : (
            filteredDeals.map((deal) => {
              const stageColors: Record<string, string> = {
                LEAD: "bg-neutral-100 text-neutral-700 border-neutral-200",
                QUOTATION: "bg-blue-50 text-blue-800 border-blue-200",
                TRIAL: "bg-purple-50 text-purple-800 border-purple-200",
                NEGOTIATION: "bg-amber-50 text-amber-800 border-amber-200",
                WON: "bg-emerald-50 text-emerald-800 border-emerald-200",
              };

              return (
                <div
                  key={deal.id}
                  className="flex items-center justify-between p-3.5 rounded-2xl border border-neutral-100 bg-neutral-50/50 hover:bg-neutral-50 transition gap-3"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-xs text-neutral-900 truncate">
                        {deal.opportunityName}
                      </span>
                      <span
                        className={cn(
                          "rounded-md px-1.5 py-0.5 text-[9px] font-extrabold border uppercase",
                          stageColors[deal.stage] || "bg-neutral-100 text-neutral-700"
                        )}
                      >
                        {deal.stage}
                      </span>
                    </div>
                    <div className="text-[11px] text-neutral-500 font-medium flex items-center gap-2">
                      <span>{deal.customerName}</span>
                      {deal.customerCity && <span>&bull; {deal.customerCity}</span>}
                    </div>
                  </div>

                  <div className="text-right shrink-0 flex items-center gap-3">
                    <div>
                      <div className="text-xs font-black font-mono text-neutral-900">
                        {formatCurrency(deal.potentialValue)}
                      </div>
                      <div className="text-[10px] text-neutral-400 font-medium">
                        PIC: <span className="font-semibold text-neutral-700">{deal.ownerName}</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        setReassignTarget({
                          customerId: (deal as any).customer?.id || (deal as any).customerId || deal.id,
                          customerName: deal.customerName,
                          ownerName: deal.ownerName,
                        })
                      }
                      title="Realokasikan customer ini ke DSR lain"
                      className="p-1.5 rounded-xl bg-white hover:bg-amber-100/80 border border-neutral-200 text-neutral-600 hover:text-amber-800 transition active:scale-95 cursor-pointer shadow-2xs"
                    >
                      <UserCheck className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {reassignTarget && (
        <ReassignAccountModal
          isOpen={true}
          onClose={() => setReassignTarget(null)}
          customerId={reassignTarget.customerId}
          customerName={reassignTarget.customerName}
          currentOwnerName={reassignTarget.ownerName}
        />
      )}
    </div>
  );
}
