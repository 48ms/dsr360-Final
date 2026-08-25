"use client";

import { useState, useEffect } from "react";
import { getPreVisitAIBrief, type PreVisitBrief } from "@/actions/ai";
import { Sparkles, X, Wrench, Shield, Loader2 } from "lucide-react";

export function PreVisitBriefModal({
  isOpen,
  customerId,
  onClose,
}: {
  isOpen: boolean;
  customerId: string;
  onClose: () => void;
}) {
  const [brief, setBrief] = useState<PreVisitBrief | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;
    if (isOpen && customerId) {
      getPreVisitAIBrief(customerId)
        .then((res) => {
          if (!ignore) {
            setBrief(res);
            setLoading(false);
          }
        })
        .catch(() => {
          if (!ignore) {
            setLoading(false);
          }
        });
    }
    return () => {
      ignore = true;
    };
  }, [isOpen, customerId]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <div className="w-full max-w-lg rounded-2xl bg-white p-5 sm:p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className="rounded-xl bg-amber-100 p-2 text-amber-600">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-neutral-900">Pre-Visit AI Briefing</h2>
              <p className="text-xs text-neutral-500">Konteks kunci & strategi sebelum bertemu customer</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup modal"
            className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-100 focus-visible:ring-2 focus-visible:ring-amber-500 outline-none"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        {loading ? (
          <div className="py-12 text-center text-xs text-neutral-500 space-y-2">
            <Loader2 className="mx-auto h-6 w-6 animate-spin text-amber-500" />
            <p>Menganalisis data historis akun...</p>
          </div>
        ) : !brief ? (
          <div className="py-8 text-center text-xs text-neutral-500">
            Tidak ada data yang cukup untuk membuat briefing.
          </div>
        ) : (
          <div className="space-y-3 text-xs">
            {/* Strategy Card */}
            <div className="rounded-2xl bg-linear-to-br from-amber-500 to-amber-600 p-4 text-white shadow-sm space-y-1">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-100 block">
                🎯 Rekomendasi Taktis AI
              </span>
              <p className="text-xs font-bold leading-relaxed">{brief.recommended_approach}</p>
            </div>

            {/* Account snapshot */}
            <div className="rounded-xl bg-neutral-50 p-3 border border-neutral-100 space-y-2">
              <div className="flex items-center justify-between border-b border-neutral-200/60 pb-1.5">
                <span className="font-bold text-neutral-900 text-sm">{brief.customer_name}</span>
                <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800">
                  Prioritas {brief.priority} &bull; {brief.segment}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] text-neutral-600">
                <div>
                  <span className="text-neutral-400 block">Kunjungan Terakhir:</span>
                  <span className="font-semibold text-neutral-800">
                    {brief.days_since_last_visit > 100
                      ? "Belum pernah"
                      : `${brief.days_since_last_visit} hari yang lalu`}
                  </span>
                </div>
                <div>
                  <span className="text-neutral-400 block">PIC Utama:</span>
                  <span className="font-semibold text-neutral-800">
                    {brief.primary_pic ? `${brief.primary_pic.name} (${brief.primary_pic.position || "PIC"})` : "-"}
                  </span>
                </div>
              </div>
            </div>

            {/* Technical Snapshot */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="rounded-xl border border-neutral-200 p-3 space-y-1">
                <span className="text-[10px] font-bold uppercase text-neutral-400 flex items-center gap-1">
                  <Shield className="h-3 w-3 text-red-500" /> Oli Kompetitor
                </span>
                <p className="font-bold text-neutral-900 text-[11px] truncate">
                  {brief.current_competitor_oil}
                </p>
              </div>

              <div className="rounded-xl border border-neutral-200 p-3 space-y-1">
                <span className="text-[10px] font-bold uppercase text-neutral-400 flex items-center gap-1">
                  <Wrench className="h-3 w-3 text-blue-500" /> Mesin / Populasi
                </span>
                <p className="font-bold text-neutral-900 text-[11px] truncate">
                  {brief.equipment_summary}
                </p>
              </div>
            </div>

            {/* Last Visit Summary */}
            <div className="rounded-xl border border-neutral-200 p-3 space-y-1">
              <span className="text-[10px] font-bold uppercase text-neutral-400 block">
                Catatan Terakhir Kunjungan:
              </span>
              <p className="text-neutral-700 italic text-[11px] leading-relaxed">
                &ldquo;{brief.last_visit_summary}&rdquo;
              </p>
            </div>

            {/* Close Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={onClose}
                className="w-full rounded-xl bg-neutral-900 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-neutral-800 transition"
              >
                Siap Eksekusi Visit
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
