"use client";

import { useState, useEffect } from "react";
import { getPreVisitAIBrief, type RichPreVisitBrief } from "@/actions/ai";
import {
  Sparkles,
  X,
  Wrench,
  Shield,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  MessageSquare,
  Flame,
  ArrowRight,
} from "lucide-react";

export function PreVisitBriefModal({
  isOpen,
  customerId,
  onClose,
  onOpenSparring,
}: {
  isOpen: boolean;
  customerId: string;
  onClose: () => void;
  onOpenSparring?: () => void;
}) {
  const [brief, setBrief] = useState<RichPreVisitBrief | null>(null);
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3 sm:p-4 backdrop-blur-xs animate-fade-in-up">
      <div className="w-full max-w-xl rounded-2xl bg-white p-5 sm:p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto border border-neutral-200">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500 text-white shadow-xs">
              <Sparkles className="h-5 w-5 fill-current" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-neutral-900">Pre-Visit Tactical Briefing</h2>
                {brief?.is_ai_powered && (
                  <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 border border-emerald-200">
                    ✨ Gemini 3.6
                  </span>
                )}
              </div>
              <p className="text-xs text-neutral-500">Konteks historis & strategi jitu sebelum bertemu customer</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup modal"
            className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-100 focus-visible:ring-2 focus-visible:ring-amber-500 outline-none cursor-pointer"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        {loading ? (
          <div className="py-16 text-center text-xs text-neutral-500 space-y-3">
            <Loader2 className="mx-auto h-7 w-7 animate-spin text-amber-500" />
            <p className="font-semibold text-neutral-700">Bang Radit sedang menganalisa seluruh histori akun...</p>
            <p className="text-[11px] text-neutral-400">Menghubungkan inventaris mesin, komplain masa lalu & target produk Shell</p>
          </div>
        ) : !brief ? (
          <div className="py-8 text-center text-xs text-neutral-500">
            Tidak ada data yang cukup untuk membuat briefing.
          </div>
        ) : (
          <div className="space-y-3.5 text-xs">
            {/* Strategy Card */}
            <div className="rounded-2xl bg-linear-to-br from-amber-500 to-amber-600 p-4 text-white shadow-sm space-y-1">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-100 flex items-center gap-1">
                <Flame className="h-3.5 w-3.5" /> Rekomendasi Taktis Bang Radit
              </span>
              <p className="text-xs font-bold leading-relaxed">{brief.recommended_approach}</p>
            </div>

            {/* Talking Points & Dialog Script */}
            {brief.talking_points && brief.talking_points.length > 0 && (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-3.5 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-900 flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                  Poin Dialog & Skrip Masuk (Siap Diucapkan):
                </span>
                <ul className="space-y-1.5">
                  {brief.talking_points.map((tp, idx) => (
                    <li key={idx} className="text-[11px] text-emerald-950 flex items-start gap-1.5">
                      <span className="text-emerald-600 font-bold shrink-0">&bull;</span>
                      <span className="leading-relaxed">{tp}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Things to Avoid */}
            {brief.things_to_avoid && brief.things_to_avoid.length > 0 && (
              <div className="rounded-xl border border-red-200 bg-red-50/40 p-3 space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-red-800 flex items-center gap-1.5">
                  <AlertTriangle className="h-3.5 w-3.5 text-red-600" />
                  Hal yang Harus Dihindari Saat Meeting:
                </span>
                <ul className="space-y-1">
                  {brief.things_to_avoid.map((ta, idx) => (
                    <li key={idx} className="text-[11px] text-red-950 flex items-start gap-1.5">
                      <span className="text-red-600 font-bold shrink-0">&times;</span>
                      <span>{ta}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Suggested Shell Products */}
            {brief.suggested_shell_products && brief.suggested_shell_products.length > 0 && (
              <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-3 space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-600 block">
                  🛢️ Target Produk Shell yang Disarankan:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {brief.suggested_shell_products.map((prod, idx) => (
                    <span
                      key={idx}
                      className="rounded-lg bg-white border border-neutral-200 px-2.5 py-1 text-[11px] font-bold text-neutral-800 shadow-2xs"
                    >
                      {prod}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Account & Technical Snapshot */}
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
              <div className="rounded-xl border border-neutral-200 p-2.5 space-y-1">
                <span className="text-[10px] font-bold uppercase text-neutral-400 flex items-center gap-1">
                  <Shield className="h-3 w-3 text-red-500" /> Oli Kompetitor
                </span>
                <p className="font-bold text-neutral-900 text-[11px] truncate">
                  {brief.current_competitor_oil}
                </p>
              </div>

              <div className="rounded-xl border border-neutral-200 p-2.5 space-y-1">
                <span className="text-[10px] font-bold uppercase text-neutral-400 flex items-center gap-1">
                  <Wrench className="h-3 w-3 text-blue-500" /> Mesin / Populasi
                </span>
                <p className="font-bold text-neutral-900 text-[11px] truncate">
                  {brief.equipment_summary}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center gap-2">
              {onOpenSparring && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenSparring();
                  }}
                  className="w-full sm:flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-amber-500 py-2.5 text-xs font-bold text-neutral-950 shadow-xs hover:bg-amber-400 transition cursor-pointer"
                >
                  <MessageSquare className="h-4 w-4" />
                  <span>Ajak Bang Radit Brainstorming</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              )}
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto rounded-xl bg-neutral-900 px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-neutral-800 transition cursor-pointer"
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
