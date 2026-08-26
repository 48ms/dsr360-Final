"use client";

import { useState, useMemo, useEffect } from "react";
import {
  MapPin,
  Navigation,
  Sparkles,
  Calendar,
  Clock,
  Compass,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Fuel,
  RefreshCw,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useToast } from "@/components/ui/toast-context";
import {
  INDONESIA_INDUSTRIAL_HUBS,
  optimizeTerritoryRoute,
  type Coordinates,
  type RouteCandidateCustomer,
  type TerritoryRouteResult,
} from "@/lib/utils/geo-route";
import { formatCurrency, getTodayWIB } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";
import {
  bulkScheduleOptimizedVisitsAction,
  type TerritoryPlannerData,
} from "@/actions/route-optimizer";

export function SmartRoutePlannerClient({
  initialData,
}: {
  initialData: TerritoryPlannerData;
}) {
  const { success, error } = useToast();

  // Origin Location State
  const [selectedHubId, setSelectedHubId] = useState<string>("cikarang");
  const [currentCoords, setCurrentCoords] = useState<Coordinates>(
    INDONESIA_INDUSTRIAL_HUBS[0].coordinates
  );
  const [originLabel, setOriginLabel] = useState<string>(
    INDONESIA_INDUSTRIAL_HUBS[0].name
  );
  const [isLocatingGPS, setIsLocatingGPS] = useState(false);
  const [gpsDetected, setGpsDetected] = useState(false);

  // Planner Settings State
  const [targetStopsCount, setTargetStopsCount] = useState<number>(3);
  const [visitDate, setVisitDate] = useState<string>(getTodayWIB());
  const [isScheduling, setIsScheduling] = useState(false);
  const [isScheduledDone, setIsScheduledDone] = useState(false);

  // 1-Tap GPS Geolocation
  function handleDetectGPS() {
    if (!navigator.geolocation) {
      error("Browser Anda tidak mendukung deteksi GPS Geolocation.");
      return;
    }

    setIsLocatingGPS(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords: Coordinates = {
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        };
        setCurrentCoords(coords);
        setOriginLabel("Posisi GPS Saya Saat Ini (Live)");
        setGpsDetected(true);
        setIsLocatingGPS(false);
        success("Lokasi GPS Anda berhasil terdeteksi!");
      },
      (err) => {
        console.warn("GPS Geolocation Error:", err);
        setIsLocatingGPS(false);
        error("Tidak dapat mengambil izin GPS. Menggunakan titik kawasan default.");
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  }

  // Handle Industrial Hub Preset change
  function handleHubChange(hubId: string) {
    setSelectedHubId(hubId);
    setGpsDetected(false);
    const hub = INDONESIA_INDUSTRIAL_HUBS.find((h) => h.id === hubId);
    if (hub) {
      setCurrentCoords(hub.coordinates);
      setOriginLabel(hub.name);
    }
  }

  // Real-Time Route Optimization by Hermes
  const optimizedResult: TerritoryRouteResult = useMemo(() => {
    return optimizeTerritoryRoute(
      { label: originLabel, coordinates: currentCoords },
      initialData.candidates,
      targetStopsCount,
      initialData.monthlyQuotaTargetVolume
    );
  }, [
    originLabel,
    currentCoords,
    initialData.candidates,
    targetStopsCount,
    initialData.monthlyQuotaTargetVolume,
  ]);

  // Bulk Schedule Visits into CRM
  async function handleBulkSchedule() {
    if (optimizedResult.steps.length === 0) return;

    setIsScheduling(true);
    try {
      const stopsPayload = optimizedResult.steps.map((s) => ({
        customerId: s.customer.id,
        customerName: s.customer.name,
        purpose: s.customer.popsaBrief.purpose,
        objective: s.customer.popsaBrief.objective,
        talkingPoint: s.customer.popsaBrief.talkingPoint,
      }));

      const res = await bulkScheduleOptimizedVisitsAction({
        visitDate,
        stops: stopsPayload,
      });

      if (res.success) {
        success(res.message);
        setIsScheduledDone(true);
      } else {
        error(res.message);
      }
    } catch {
      error("Gagal menjadwalkan kunjungan ke CRM.");
    } finally {
      setIsScheduling(false);
    }
  }

  return (
    <div className="space-y-6 pb-12">
      {/* 1. HEADER SECTION */}
      <div className="rounded-3xl bg-neutral-950 text-white p-5 sm:p-6 border border-neutral-800 shadow-xl space-y-4">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/20 px-3 py-0.5 text-xs font-bold text-amber-300 border border-amber-500/40">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Hermes Autonomous Pacing</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">
              Territory Route &amp; Quota Optimizer
            </h1>
            <p className="text-xs sm:text-sm text-neutral-400 font-medium leading-relaxed max-w-xl">
              Susun rute kunjungan paling hemat bensin dan waktu dengan prioritas closing deal tertinggi dari titik keberangkatan Anda.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/visits"
              className="inline-flex items-center gap-1 min-h-[44px] rounded-xl border border-neutral-700 bg-neutral-900 px-4 py-2 text-xs font-bold text-neutral-300 hover:text-white hover:bg-neutral-800 active:scale-95 transition"
            >
              <span>Daftar Visit</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        {/* Origin Selector & GPS 1-Tap */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-3 border-t border-neutral-800">
          <div className="sm:col-span-8 space-y-1.5">
            <label className="text-xs font-bold text-neutral-300 flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-amber-400" />
              <span>Titik Keberangkatan (Origin):</span>
            </label>
            <div className="flex gap-2">
              <select
                value={gpsDetected ? "gps" : selectedHubId}
                onChange={(e) => {
                  if (e.target.value !== "gps") {
                    handleHubChange(e.target.value);
                  }
                }}
                className="flex-1 min-h-[44px] rounded-xl border border-neutral-700 bg-neutral-900 px-3 py-2 text-xs font-bold text-white outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/30"
              >
                {gpsDetected && <option value="gps">Posisi GPS Saya Saat Ini (Live)</option>}
                {INDONESIA_INDUSTRIAL_HUBS.map((hub) => (
                  <option key={hub.id} value={hub.id}>
                    {hub.name} ({hub.region})
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={handleDetectGPS}
                disabled={isLocatingGPS}
                title="Ambil titik GPS Anda saat ini"
                className={cn(
                  "min-h-[44px] px-4 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer active:scale-95 shrink-0 shadow-xs",
                  gpsDetected
                    ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                    : "bg-amber-500 hover:bg-amber-600 text-white"
                )}
              >
                {isLocatingGPS ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Compass className="h-4 w-4" />
                )}
                <span className="hidden sm:inline">
                  {gpsDetected ? "GPS Terkunci ✓" : "1-Tap GPS"}
                </span>
              </button>
            </div>
          </div>

          <div className="sm:col-span-4 space-y-1.5">
            <label className="text-xs font-bold text-neutral-300 flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-amber-400" />
              <span>Tanggal Rute Kunjungan:</span>
            </label>
            <input
              type="date"
              value={visitDate}
              onChange={(e) => {
                setVisitDate(e.target.value);
                setIsScheduledDone(false);
              }}
              className="w-full min-h-[44px] rounded-xl border border-neutral-700 bg-neutral-900 px-3 py-2 text-xs font-bold text-white outline-none focus:border-amber-500"
            />
          </div>
        </div>
      </div>

      {/* 2. CONTROLS & QUOTA PACING METERS */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Left Card: Stops Slider & Setting */}
        <div className="md:col-span-5 rounded-3xl border border-[#EAE4D9] bg-white p-5 space-y-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase text-neutral-900 flex items-center gap-1.5">
              <Navigation className="h-4 w-4 text-amber-600" />
              <span>Kapasitas Kunjungan Hari Ini:</span>
            </span>
            <span className="text-xs font-extrabold bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded-lg border border-amber-300 font-mono">
              {targetStopsCount} Pabrik / Hari
            </span>
          </div>

          <div className="space-y-2">
            <input
              type="range"
              min="2"
              max="6"
              step="1"
              value={targetStopsCount}
              onChange={(e) => {
                setTargetStopsCount(parseInt(e.target.value, 10));
                setIsScheduledDone(false);
              }}
              className="w-full accent-amber-500 cursor-pointer h-2 bg-neutral-200 rounded-lg"
            />
            <div className="flex justify-between text-[10px] font-bold text-neutral-600">
              <span>2 Pabrik (Fokus SPH)</span>
              <span>3-4 (Ideal)</span>
              <span>6 (Sapu Bersih)</span>
            </div>
          </div>

          <div className="rounded-2xl bg-amber-500/10 border border-amber-300/70 p-3 text-xs text-amber-950 space-y-1">
            <p className="font-bold flex items-center gap-1">
              <strong>Taktik Hermes:</strong>
            </p>
            <p className="text-[11px] leading-relaxed text-neutral-700">
              Urutan stop disusun otomatis menggunakan prinsip <em>Nearest-Neighbor TSP</em> untuk meminimalkan waktu di jalanan macet dan mengutamakan akun berpeluang closing tercepat.
            </p>
          </div>
        </div>

        {/* Right Card: Route Run-rate Metrics */}
        <div className="md:col-span-7 rounded-3xl border border-amber-300/80 bg-gradient-to-br from-amber-500/15 via-amber-50/40 to-white p-5 space-y-3 shadow-2xs">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-extrabold uppercase text-neutral-900 flex items-center gap-1.5">
              <TrendingUp className="h-4 w-4 text-emerald-600" />
              <span>Estimasi Dampak Kuota Rute Ini:</span>
            </h3>
            <span className="text-[10px] font-bold bg-white text-neutral-700 px-2 py-0.5 rounded-md border border-neutral-200">
              Target: {initialData.monthlyQuotaTargetVolume} Drum / bln
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2.5">
            <div className="rounded-2xl bg-white p-3 border border-amber-200 text-center space-y-0.5 shadow-2xs">
              <span className="text-[10px] font-bold text-neutral-500 uppercase block">Total Jarak</span>
              <p className="text-base font-extrabold text-neutral-900 font-mono">
                {optimizedResult.totalDistanceKm} <span className="text-[10px] text-neutral-500 font-normal">km</span>
              </p>
              <span className="text-[9px] text-neutral-500 block">~{optimizedResult.totalEstimatedDriveMinutes} mnt jalan</span>
            </div>

            <div className="rounded-2xl bg-white p-3 border border-amber-200 text-center space-y-0.5 shadow-2xs">
              <span className="text-[10px] font-bold text-neutral-500 uppercase block">Potensi Volume</span>
              <p className="text-base font-extrabold text-amber-700 font-mono">
                {optimizedResult.totalPotentialVolume} <span className="text-[10px] text-neutral-500 font-normal">Drum</span>
              </p>
              <span className="text-[9px] text-emerald-800 font-bold block">
                +{optimizedResult.runRateContributionPct}% Kuota
              </span>
            </div>

            <div className="rounded-2xl bg-white p-3 border border-amber-200 text-center space-y-0.5 shadow-2xs">
              <span className="text-[10px] font-bold text-neutral-500 uppercase block">Potensi Nilai</span>
              <p className="text-xs sm:text-sm font-extrabold text-neutral-900 font-mono truncate">
                {formatCurrency(optimizedResult.totalPotentialValue)}
              </p>
              <span className="text-[9px] text-neutral-600 block font-medium">Pipeline Deal</span>
            </div>
          </div>

          {/* Quick Actions Bar */}
          <div className="flex items-center gap-2 pt-2 border-t border-amber-200/80 flex-wrap">
            <a
              href={optimizedResult.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 min-h-[44px] inline-flex items-center justify-center gap-2 rounded-xl bg-neutral-900 px-4 py-2.5 text-xs font-bold text-white shadow-2xs hover:bg-neutral-800 active:scale-95 transition cursor-pointer"
            >
              <Navigation className="h-4 w-4 text-amber-400" />
              <span>Buka Rute di Google Maps</span>
              <ExternalLink className="h-3 w-3 text-neutral-400" />
            </a>

            <button
              type="button"
              onClick={handleBulkSchedule}
              disabled={isScheduling || isScheduledDone || optimizedResult.steps.length === 0}
              className={cn(
                "flex-1 min-h-[44px] inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition active:scale-95 cursor-pointer shadow-2xs",
                isScheduledDone
                  ? "bg-emerald-600 text-white cursor-default"
                  : "bg-amber-500 text-white hover:bg-amber-600 disabled:opacity-50"
              )}
            >
              {isScheduling ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : isScheduledDone ? (
                <CheckCircle2 className="h-4 w-4" />
              ) : (
                <Calendar className="h-4 w-4" />
              )}
              <span>{isScheduledDone ? "Sudah Terjadwal di CRM ✓" : "Jadwalkan ke CRM (1-Klik)"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. OPTIMIZED ITINERARY TIMELINE */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-extrabold uppercase tracking-wider text-neutral-900 flex items-center gap-2">
            <Compass className="h-4 w-4 text-amber-600" />
            <span>Itinerary Rute Kunjungan Teroptimasi:</span>
          </h2>
          <span className="text-xs font-bold text-neutral-500">
            {optimizedResult.steps.length} Kunjungan Terjadwal
          </span>
        </div>

        {optimizedResult.steps.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-neutral-300 bg-white p-8 text-center text-xs text-neutral-500 space-y-2">
            <p className="font-bold text-neutral-800">Tidak ada data customer aktif untuk dirutekan.</p>
            <p>Pastikan Anda memiliki data customer aktif di CRM.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {/* Origin Step Banner */}
            <div className="flex items-center gap-3 rounded-2xl bg-neutral-100 border border-neutral-200 p-3 text-xs text-neutral-700">
              <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-neutral-900 text-white text-[11px] font-bold">
                0
              </div>
              <div className="flex-1">
                <span className="text-[10px] font-bold uppercase text-neutral-500 block">Titik Awal (Start):</span>
                <p className="font-extrabold text-neutral-900">{originLabel}</p>
              </div>
              <span className="text-[10px] font-mono font-bold bg-neutral-200 text-neutral-800 px-2 py-0.5 rounded-md">
                0 km
              </span>
            </div>

            {/* Steps */}
            {optimizedResult.steps.map((step, idx) => {
              const c = step.customer;
              return (
                <div
                  key={c.id}
                  className="rounded-3xl border border-neutral-200 bg-white p-4 sm:p-5 space-y-3 shadow-2xs hover:border-amber-400 transition"
                >
                  <div className="flex items-start justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-8 w-8 items-center justify-center rounded-2xl bg-amber-500 text-white font-extrabold text-xs shadow-xs">
                        #{step.stopNumber}
                      </div>
                      <div>
                        <Link
                          href={`/customers/${c.id}`}
                          className="font-extrabold text-sm sm:text-base text-neutral-900 hover:text-amber-600 transition flex items-center gap-1.5"
                        >
                          <span>{c.name}</span>
                          <span
                            className={cn(
                              "text-[10px] font-bold px-2 py-0.5 rounded-md",
                              c.priority === "P1"
                                ? "bg-red-100 text-red-700"
                                : c.priority === "P2"
                                ? "bg-amber-100 text-amber-900"
                                : "bg-neutral-100 text-neutral-700"
                            )}
                          >
                            {c.priority}
                          </span>
                        </Link>
                        <p className="text-[11px] text-neutral-500 font-medium">
                          📍 {c.address} &bull; {c.city}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold bg-neutral-100 text-neutral-800 px-2.5 py-1 rounded-xl border border-neutral-200 font-mono">
                        🚗 +{step.distanceFromPreviousKm} km ({step.estimatedDriveTimeMinutes} mnt)
                      </span>
                    </div>
                  </div>

                  {/* POPSA Tactical Directive Card */}
                  <div
                    className={cn(
                      "rounded-2xl border p-3 text-xs space-y-1.5",
                      c.hasOverdueFollowUp
                        ? "bg-red-50/70 border-red-200/90 text-red-950"
                        : c.highestDealStage === "QUOTATION"
                        ? "bg-amber-50/70 border-amber-200/90 text-amber-950"
                        : "bg-neutral-50/80 border-neutral-200 text-neutral-900"
                    )}
                  >
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <span className="font-bold flex items-center gap-1">
                        🎯 <strong>Misi Utama:</strong> {c.popsaBrief.purpose}
                      </span>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {c.hasOverdueFollowUp && (
                          <span className="text-[10px] font-black bg-red-600 text-white px-2 py-0.5 rounded-md shadow-2xs">
                            🔴 TUGAS OVERDUE
                          </span>
                        )}
                        {c.highestDealStage && (
                          <span className="text-[10px] font-bold bg-white text-neutral-800 px-2 py-0.5 rounded-md border border-neutral-300">
                            Stage: {c.highestDealStage}
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="text-[11px] text-neutral-700 leading-relaxed font-medium">
                      <strong>Target:</strong> {c.popsaBrief.objective}
                    </p>
                    <div className="rounded-xl bg-white/80 p-2 border border-neutral-200 text-[11px] text-neutral-800 italic">
                      💬 <strong>Taktik Lapangan:</strong> {c.popsaBrief.talkingPoint}
                    </div>
                  </div>

                  {/* Footnote & Quick Direct Visit Link */}
                  <div className="flex items-center justify-between pt-2 border-t border-neutral-100 text-xs text-neutral-500 flex-wrap gap-2">
                    <div className="flex items-center gap-3">
                      <span>
                        Potensi: <strong>{c.highestDealVolume || c.potentialMonthlyVolume} Drum/bln</strong>
                      </span>
                      {c.daysSinceLastVisit < 999 && (
                        <span>
                          Kunjungan Terakhir: <strong>{c.daysSinceLastVisit} hari lalu</strong>
                        </span>
                      )}
                    </div>
                    <Link
                      href={`/visits/new?customerId=${c.id}`}
                      className="text-[11px] font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1 min-h-[36px]"
                    >
                      <span>Jadwalkan Khusus</span>
                      <ChevronRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
