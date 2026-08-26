"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils/format";
import {
  Compass,
  Flame,
  CheckCircle2,
  TrendingUp,
  AlertCircle,
  Calendar,
  Sparkles,
  ChevronRight,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

export interface RadialPacingGaugeProps {
  wonVolumeLiter: number;
  targetVolumeLiter: number;
  wonValueIdr: number;
  targetValueIdr: number;
  pipelineVolumeLiter: number;
  annualWonVolume?: number;
  annualVolumeTarget?: number;
}

/**
 * Calculates active working days (Mon-Fri) in the current month in Asia/Jakarta timezone
 */
function getWorkingDaysAnalysis() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth(); // 0-indexed
  const todayDate = now.getDate();

  const totalDaysInMonth = new Date(year, month + 1, 0).getDate();

  let totalWorkingDays = 0;
  let elapsedWorkingDays = 0;
  let remainingWorkingDays = 0;

  for (let day = 1; day <= totalDaysInMonth; day++) {
    const current = new Date(year, month, day);
    const dayOfWeek = current.getDay(); // 0 is Sun, 6 is Sat
    const isWorkday = dayOfWeek !== 0 && dayOfWeek !== 6;

    if (isWorkday) {
      totalWorkingDays++;
      if (day <= todayDate) {
        elapsedWorkingDays++;
      } else {
        remainingWorkingDays++;
      }
    }
  }

  // If today is a weekend or last day of month, ensure remaining >= 1 to avoid division by 0
  const safeRemainingWorkdays = Math.max(1, remainingWorkingDays);

  return {
    totalWorkingDays,
    elapsedWorkingDays,
    remainingWorkingDays: safeRemainingWorkdays,
    dayOfMonth: todayDate,
    totalDaysInMonth,
  };
}

export function RadialPacingGaugeCard({
  wonVolumeLiter = 0,
  targetVolumeLiter = 4521, // Target Bulan Agustus Bima: 4.521 L (~21.6 Drum)
  wonValueIdr = 0,
  targetValueIdr = 226050000,
  pipelineVolumeLiter = 0,
  annualWonVolume = 0,
  annualVolumeTarget = 50000, // Target 1 Tahun Bima: 50.000 L (~239.2 Drum)
}: RadialPacingGaugeProps) {
  const [animatedProgress, setAnimatedProgress] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Conversion: 1 Drum = 209 Liters
  const wonDrums = Math.round((wonVolumeLiter / 209) * 10) / 10;
  const targetDrums = Math.max(1, Math.round((targetVolumeLiter / 209) * 10) / 10);
  const pipelineDrums = Math.round((pipelineVolumeLiter / 209) * 10) / 10;
  const remainingDrums = Math.max(0, Math.round((targetDrums - wonDrums) * 10) / 10);

  const pct = Math.min(100, Math.round((wonVolumeLiter / (targetVolumeLiter || 1)) * 100));
  const annualPct = Math.min(100, Math.round(((annualWonVolume || wonVolumeLiter) / (annualVolumeTarget || 50000)) * 1000) / 10);

  const workdays = useMemo(() => getWorkingDaysAnalysis(), []);

  // Expected progress based on calendar working days passed
  const expectedPacingPct = Math.round(
    (workdays.elapsedWorkingDays / workdays.totalWorkingDays) * 100
  );

  // Required closing rate per remaining working day to hit 100% quota
  const requiredDrumsPerDay =
    remainingDrums > 0
      ? Math.round((remainingDrums / workdays.remainingWorkingDays) * 10) / 10
      : 0;

  // Status classification
  const pacingStatus = useMemo(() => {
    if (pct >= 100) {
      return {
        label: "TARGET KUOTA TERCAPAI",
        color: "text-emerald-400",
        bg: "bg-emerald-500/20 border-emerald-500/40",
        badge: "SURPLUS",
        desc: `Target kuota berhasil dilampaui! Surplus: +${Math.round((wonDrums - targetDrums) * 10) / 10} Drum.`,
      };
    }
    if (pct >= expectedPacingPct) {
      return {
        label: "ON-TRACK PACING",
        color: "text-emerald-400",
        bg: "bg-emerald-500/10 border-emerald-500/30",
        badge: "ON PACE",
        desc: `Kecepatan penjualan di atas target kalender (${pct}% vs ${expectedPacingPct}%). Pertahankan!`,
      };
    }
    if (expectedPacingPct - pct <= 20) {
      return {
        label: "PERLU KEJAR PACING",
        color: "text-amber-400",
        bg: "bg-amber-500/10 border-amber-500/30",
        badge: "KEJAR TARGET",
        desc: `Butuh closing minimal ${requiredDrumsPerDay} Drum/hari di sisa ${workdays.remainingWorkingDays} hari kerja.`,
      };
    }
    return {
      label: "DEFISIT KUOTA BULANAN",
      color: "text-red-400",
      bg: "bg-red-500/10 border-red-500/30",
      badge: "SEGERA CLOSING",
      desc: `Defisit ${remainingDrums} Drum. Maksimalkan closing dari pipeline in-flight (${pipelineDrums} Drum).`,
    };
  }, [pct, expectedPacingPct, wonDrums, targetDrums, remainingDrums, requiredDrumsPerDay, workdays.remainingWorkingDays, pipelineDrums]);

  // Smooth entrance transition for the radial meter
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedProgress(pct);
    }, 150);
    return () => clearTimeout(timer);
  }, [pct]);

  // SVG Gauge calculations
  // Semi-circular arc: radius = 70, circumference for 240 deg arc = (240 / 360) * 2 * PI * 70 = 293.2
  const radius = 70;
  const strokeWidth = 12;
  const arcLength = 293.2; // 240 degree gauge
  const strokeDashoffset = arcLength - (arcLength * animatedProgress) / 100;

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative overflow-hidden rounded-3xl border border-neutral-800 bg-gradient-to-b from-neutral-900 via-[#0B0F19] to-neutral-950 p-5 sm:p-6 text-white shadow-lg space-y-5 transition-all duration-300"
    >
      {/* Background Subtle Ambient Glow */}
      <div
        className={cn(
          "absolute -right-16 -top-16 h-48 w-48 rounded-full blur-3xl transition-opacity duration-700 pointer-events-none",
          pct >= 100
            ? "bg-emerald-500/10"
            : pct >= expectedPacingPct
            ? "bg-amber-500/10"
            : "bg-amber-500/5"
        )}
      />

      {/* Header Bar */}
      <div className="flex items-center justify-between gap-2 flex-wrap relative z-10">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/25 shadow-2xs">
            <TrendingUp className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-200 flex items-center gap-1.5">
              <span>Telemetry Pacing Kuota Bulanan</span>
              <span className="text-[10px] text-amber-400/90 font-mono">DSR360</span>
            </h2>
          </div>
        </div>

        <div
          className={cn(
            "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black border font-mono tracking-tight",
            pacingStatus.bg,
            pacingStatus.color
          )}
        >
          <span>{pacingStatus.badge}</span>
        </div>
      </div>

      {/* Main Interactive Telemetry Meter Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-center relative z-10">
        {/* Left: SVG Radial Hydro Arc Gauge */}
        <div className="sm:col-span-5 flex flex-col items-center justify-center relative">
          <div className="relative w-44 h-40 flex items-center justify-center">
            <svg className="w-44 h-44 -rotate-210 transform overflow-visible" viewBox="0 0 160 160">
              <defs>
                <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#F59E0B" />
                  <stop offset="70%" stopColor="#FFD100" />
                  <stop offset="100%" stopColor="#10B981" />
                </linearGradient>
                <linearGradient id="trackGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#1E293B" />
                  <stop offset="100%" stopColor="#0F172A" />
                </linearGradient>
              </defs>

              {/* Gauge Background Track */}
              <circle
                cx="80"
                cy="80"
                r={radius}
                fill="transparent"
                stroke="url(#trackGradient)"
                strokeWidth={strokeWidth}
                strokeDasharray={`${arcLength} 400`}
                strokeLinecap="round"
              />

              {/* Expected Calendar Pace Reference Tick */}
              <circle
                cx="80"
                cy="80"
                r={radius}
                fill="transparent"
                stroke="#64748B"
                strokeWidth={strokeWidth + 2}
                strokeDasharray={`2 ${arcLength}`}
                strokeDashoffset={arcLength - (arcLength * expectedPacingPct) / 100}
                strokeLinecap="butt"
                opacity={0.7}
              />

              {/* Animated Progress Arc */}
              <circle
                cx="80"
                cy="80"
                r={radius}
                fill="transparent"
                stroke="url(#gaugeGradient)"
                strokeWidth={strokeWidth}
                strokeDasharray={`${arcLength} 400`}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
                style={{
                  filter: isHovered ? "drop-shadow(0 0 8px rgba(245, 158, 11, 0.6))" : "none",
                }}
              />
            </svg>

            {/* Gauge Center Dial */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center mt-2">
              <span className="text-3xl font-black tracking-tight text-white font-mono">
                {pct}%
              </span>
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                {wonDrums} / {targetDrums} Drum
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 text-[10px] text-neutral-400 pt-1">
            <span className="flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
              Actual ({pct}%)
            </span>
            <span className="flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-slate-500" />
              Target Kalender ({expectedPacingPct}%)
            </span>
          </div>
        </div>

        {/* Right: Hydro Trajectory Analysis & Run-Rate */}
        <div className="sm:col-span-7 space-y-3">
          <div className="rounded-2xl bg-neutral-900/90 border border-neutral-800 p-3.5 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-extrabold text-neutral-300 flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-amber-400" />
                <span>Analisis Sisa Waktu Kerja:</span>
              </span>
              <span className="text-[11px] font-mono font-bold text-neutral-400">
                Hari ke-{workdays.elapsedWorkingDays} dari {workdays.totalWorkingDays}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1 border-t border-neutral-800/80">
              <div className="bg-neutral-950/60 p-2 rounded-xl border border-neutral-800">
                <span className="text-[10px] font-bold text-neutral-500 block uppercase">
                  Sisa Hari Kerja
                </span>
                <span className="text-sm font-black text-white font-mono">
                  {workdays.remainingWorkingDays} Hari Aktif
                </span>
              </div>

              <div className="bg-neutral-950/60 p-2 rounded-xl border border-neutral-800">
                <span className="text-[10px] font-bold text-neutral-500 block uppercase">
                  Pacing Harian
                </span>
                <span
                  className={cn(
                    "text-sm font-black font-mono",
                    pct >= 100
                      ? "text-emerald-400"
                      : requiredDrumsPerDay > 3
                      ? "text-red-400"
                      : "text-amber-400"
                  )}
                >
                  {pct >= 100 ? "Tuntas ✓" : `${requiredDrumsPerDay} Drum/Hari`}
                </span>
              </div>
            </div>
          </div>

          {/* Tactical Directive Box */}
          <div className={cn("rounded-2xl p-3 border text-xs space-y-1.5 leading-relaxed", pacingStatus.bg)}>
            <div className="flex items-center justify-between gap-1">
              <span className={cn("font-extrabold flex items-center gap-1 text-[11px]", pacingStatus.color)}>
                <Zap className="h-3.5 w-3.5" />
                <span>{pacingStatus.label}</span>
              </span>
              <span className="text-[10px] font-mono font-bold text-neutral-300">
                {wonVolumeLiter.toLocaleString("id-ID")} / {targetVolumeLiter.toLocaleString("id-ID")} L ({wonDrums}/{targetDrums} Drum)
              </span>
            </div>
            <p className="text-[11px] text-neutral-300 font-medium">{pacingStatus.desc}</p>
            
            {/* Annual Quota Progress Sub-Bar */}
            <div className="pt-1.5 border-t border-white/10 space-y-1">
              <div className="flex items-center justify-between text-[10px] text-neutral-400 font-mono">
                <span>Target Tahunan (1 Tahun): <strong>50.000 L</strong> ({Math.round(50000/209*10)/10} Drum)</span>
                <span className="text-amber-300 font-bold">{annualPct}%</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-neutral-950/80 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-amber-500 to-emerald-400 transition-all duration-700"
                  style={{ width: `${Math.max(2, annualPct)}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer 1-Tap Acceleration to Hermes Rute */}
      <div className="pt-2 border-t border-neutral-800/80 flex items-center justify-between flex-wrap gap-2 relative z-10 text-xs">
        <div className="flex items-center gap-2 text-[11px] text-neutral-400">
          <span>Nilai Closing: <strong className="text-white">{formatCurrency(wonValueIdr)}</strong></span>
          <span>&bull;</span>
          <span>In-Flight: <strong className="text-amber-300">{pipelineDrums} Drum</strong></span>
        </div>

        <Link
          href="/visits/plan"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 text-amber-950 text-xs font-black hover:bg-amber-400 active:scale-95 transition cursor-pointer shadow-xs"
        >
          <Compass className="h-3.5 w-3.5" />
          <span>Kejar Target via Hermes Rute</span>
          <ChevronRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}
