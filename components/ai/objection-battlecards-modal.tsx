"use client";

import { useState } from "react";
import { type ObjectionBattlecard } from "@/actions/ai";
import { ShieldCheck, X, ChevronDown, ChevronUp, Zap } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export function ObjectionBattlecardsModal({
  isOpen,
  onClose,
  battlecards,
}: {
  isOpen: boolean;
  onClose: () => void;
  battlecards: ObjectionBattlecard[];
}) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <div className="w-full max-w-xl rounded-2xl bg-white p-5 sm:p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className="rounded-xl bg-amber-100 p-2 text-amber-700">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-neutral-900">Shell Objection Battlecards</h2>
              <p className="text-xs text-neutral-500">Panduan taktis menghadapi penolakan umum customer</p>
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

        {/* Battlecard list */}
        <div className="space-y-3">
          {battlecards.map((card, idx) => {
            const isExpanded = expandedIndex === idx;
            return (
              <div
                key={idx}
                className={cn(
                  "rounded-2xl border transition overflow-hidden",
                  isExpanded ? "border-amber-400 bg-amber-50/20 shadow-xs" : "border-neutral-200 bg-white"
                )}
              >
                <button
                  type="button"
                  onClick={() => setExpandedIndex(isExpanded ? null : idx)}
                  className="w-full flex items-center justify-between p-3.5 text-left cursor-pointer"
                >
                  <div className="flex items-center gap-2 min-w-0 pr-2">
                    <span className="rounded-lg bg-neutral-900 text-amber-400 px-2 py-0.5 text-[10px] font-extrabold shrink-0">
                      #{idx + 1}
                    </span>
                    <span className="text-xs font-bold text-neutral-900 truncate">
                      {card.objection}
                    </span>
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="h-4 w-4 text-neutral-500 shrink-0" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-neutral-400 shrink-0" />
                  )}
                </button>

                {isExpanded && (
                  <div className="p-4 pt-0 space-y-3 text-xs border-t border-neutral-100">
                    <div className="rounded-xl bg-red-50 p-2.5 text-red-900 border border-red-100">
                      <span className="text-[10px] font-bold uppercase text-red-700 block">Klaim / Alasan Customer:</span>
                      <p className="mt-0.5 text-[11px]">&ldquo;{card.competitor_claim}&rdquo;</p>
                    </div>

                    <div className="rounded-xl bg-emerald-50 p-2.5 text-emerald-950 border border-emerald-100 space-y-1">
                      <span className="text-[10px] font-bold uppercase text-emerald-800 flex items-center gap-1">
                        <Zap className="h-3 w-3 text-emerald-600 fill-current" />
                        Argumen Pembalik Shell (Counter):
                      </span>
                      <p className="text-[11px] leading-relaxed">{card.shell_counter_argument}</p>
                    </div>

                    <div className="rounded-xl bg-neutral-100 p-2.5 text-neutral-800">
                      <span className="text-[10px] font-bold uppercase text-neutral-500 block">Kunci Bukti (Proof Point):</span>
                      <p className="mt-0.5 text-[11px] font-semibold">{card.key_proof_point}</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="pt-2">
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-xl bg-neutral-900 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-neutral-800 transition"
          >
            Tutup Panduan
          </button>
        </div>
      </div>
    </div>
  );
}
