"use client";

import { useState, useEffect, useTransition } from "react";
import Link from "next/link";
import { startVisit } from "@/actions/visits";
import { PriorityBadge } from "@/components/customers/status-badge";
import { Play, FileText, MapPin, Clock, ArrowLeft, Loader2, Sparkles, ShieldAlert } from "lucide-react";
import { formatDate } from "@/lib/utils/format";
import type { Priority, VisitStatus, VisitType } from "@/constants/enums";

export type StartVisitData = {
  id: string;
  visit_date: string;
  visit_type: VisitType;
  visit_status: VisitStatus;
  purpose: string | null;
  start_time: string | null;
  customer: {
    id: string;
    customer_name: string;
    customer_code: string;
    segment: string;
    priority: Priority;
    city: string | null;
    address: string | null;
  } | null;
  popsa?: {
    purpose: string | null;
    objective: string | null;
    premises: string | null;
    strategy: string | null;
    anticipate: string | null;
  } | null;
};

export function StartVisitClient({ visitData }: { visitData: StartVisitData }) {
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<VisitStatus>(visitData.visit_status);
  const [startTime, setStartTime] = useState<string | null>(visitData.start_time);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [coords, setCoords] = useState<{ latitude: number; longitude: number } | null>(null);
  const [geoStatus, setGeoStatus] = useState<string>(() =>
    typeof navigator !== "undefined" && !("geolocation" in navigator)
      ? "⚠️ Device tidak mendukung GPS"
      : "Mencari sinyal GPS..."
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Fetch Geolocation on mount
  useEffect(() => {
    if (typeof navigator !== "undefined" && "geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setCoords({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          });
          setGeoStatus("📍 Lokasi GPS berhasil dikunci");
        },
        (err) => {
          console.warn("GPS error:", err.message);
          setGeoStatus("⚠️ GPS tidak aktif / izin ditolak");
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    }
  }, []);

  // Live Timer if in progress
  useEffect(() => {
    if (status === "IN_PROGRESS" && startTime) {
      const startMs = new Date(startTime).getTime();
      const interval = setInterval(() => {
        const nowMs = Date.now();
        const diffSec = Math.max(0, Math.floor((nowMs - startMs) / 1000));
        setElapsedSeconds(diffSec);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [status, startTime]);

  function formatStopwatch(totalSeconds: number) {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${String(hrs).padStart(2, "0")}:${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  }

  function handleStartVisit() {
    setErrorMsg(null);
    startTransition(async () => {
      const nowIso = new Date().toISOString();
      const res = await startVisit({
        visit_id: visitData.id,
        latitude: coords?.latitude ?? null,
        longitude: coords?.longitude ?? null,
        start_time: nowIso,
      });

      if (res?.error) {
        setErrorMsg(res.error);
      } else {
        setStatus("IN_PROGRESS");
        setStartTime(nowIso);
      }
    });
  }

  const isStarted = status === "IN_PROGRESS";

  return (
    <div className="max-w-xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Back button & Header */}
      <div className="flex items-center gap-3">
        <Link
          href="/visits"
          className="rounded-xl border border-neutral-200 bg-white p-2 text-neutral-600 hover:bg-neutral-50 transition"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-lg font-bold text-neutral-900">
            {isStarted ? "Kunjungan Berlangsung" : "Persiapan Kunjungan"}
          </h1>
          <p className="text-xs text-neutral-500">{formatDate(visitData.visit_date)} &bull; {visitData.visit_type}</p>
        </div>
      </div>

      {errorMsg && (
        <div className="flex items-center gap-2 rounded-xl bg-red-50 p-3 text-xs text-red-700 border border-red-200">
          <ShieldAlert className="h-4 w-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Customer Target Card */}
      <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-xs space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400">Target Akun</span>
            <h2 className="text-base font-bold text-neutral-900">{visitData.customer?.customer_name}</h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              {visitData.customer?.customer_code} &bull; {visitData.customer?.segment}
            </p>
          </div>
          {visitData.customer?.priority && (
            <PriorityBadge priority={visitData.customer.priority} />
          )}
        </div>

        {visitData.customer?.address && (
          <div className="flex items-start gap-1.5 text-xs text-neutral-600 pt-2 border-t border-neutral-100">
            <MapPin className="h-3.5 w-3.5 text-neutral-400 shrink-0 mt-0.5" />
            <span>{visitData.customer.address}, {visitData.customer.city}</span>
          </div>
        )}
      </div>

      {/* Live Timer Card (When started) */}
      {isStarted && (
        <div className="rounded-2xl bg-linear-to-br from-amber-500 to-amber-600 p-6 text-white text-center shadow-md space-y-2">
          <span className="text-xs uppercase tracking-widest font-semibold text-amber-100">
            Durasi Kunjungan Lapangan
          </span>
          <div className="text-4xl font-extrabold font-mono tracking-tight py-1">
            {formatStopwatch(elapsedSeconds)}
          </div>
          <div className="flex items-center justify-center gap-2 text-xs text-amber-100">
            <Clock className="h-3.5 w-3.5" />
            <span>Mulai: {startTime ? new Date(startTime).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) : "-"} WIB</span>
            <span>&bull;</span>
            <span>{geoStatus}</span>
          </div>
        </div>
      )}

      {/* POPSA & Briefing Target Box */}
      <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-neutral-100">
          <Sparkles className="h-4 w-4 text-amber-500" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-800">Briefing & Strategi POPSA</h3>
        </div>

        <div className="space-y-3 text-xs">
          <div>
            <span className="font-semibold text-neutral-500 text-[11px] block">TARGET OBJECTIVE:</span>
            <p className="font-medium text-neutral-900 mt-0.5">
              {visitData.popsa?.objective || visitData.purpose || "Memperkenalkan solusi pelumas Shell dan evaluasi kebutuhan teknis unit."}
            </p>
          </div>

          {visitData.popsa?.strategy && (
            <div>
              <span className="font-semibold text-neutral-500 text-[11px] block">STRATEGI PENJUALAN:</span>
              <p className="text-neutral-700 mt-0.5">{visitData.popsa.strategy}</p>
            </div>
          )}

          {visitData.popsa?.anticipate && (
            <div>
              <span className="font-semibold text-neutral-500 text-[11px] block">ANTISIPASI KEBERATAN:</span>
              <p className="text-neutral-700 mt-0.5">{visitData.popsa.anticipate}</p>
            </div>
          )}
        </div>
      </div>

      {/* GPS Status Bar (When not started) */}
      {!isStarted && (
        <div className="rounded-xl bg-neutral-100 p-3 text-center text-xs text-neutral-600 flex items-center justify-center gap-2">
          <MapPin className="h-3.5 w-3.5 text-neutral-500" />
          <span>{geoStatus}</span>
        </div>
      )}

      {/* Main CTA */}
      <div className="pt-2">
        {!isStarted ? (
          <button
            type="button"
            onClick={handleStartVisit}
            disabled={isPending}
            className="w-full flex items-center justify-center gap-2 rounded-2xl bg-amber-500 py-4 text-sm font-bold text-white shadow-lg hover:bg-amber-600 transition disabled:opacity-50 cursor-pointer"
          >
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Mencatat Waktu & Lokasi...</span>
              </>
            ) : (
              <>
                <Play className="h-4 w-4 fill-current" />
                <span>🚀 MULAI KUNJUNGAN SEKARANG</span>
              </>
            )}
          </button>
        ) : (
          <Link
            href={`/visits/${visitData.id}/log`}
            className="w-full flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 py-4 text-sm font-bold text-white shadow-lg hover:bg-emerald-700 transition"
          >
            <FileText className="h-4 w-4" />
            <span>📝 ISI LOG HASIL VISIT & NEXT ACTION</span>
          </Link>
        )}
      </div>
    </div>
  );
}
