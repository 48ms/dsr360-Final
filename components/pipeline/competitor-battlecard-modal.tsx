"use client";

import { useState, useEffect } from "react";
import {
  getCompetitorBattlecardAction,
  type CompetitorBattlecardResult,
} from "@/actions/ai";
import {
  ShieldAlert,
  Swords,
  Sparkles,
  Loader2,
  X,
  Copy,
  Check,
  CheckCircle2,
  AlertOctagon,
  Volume2,
} from "lucide-react";
import { useToast } from "@/components/ui/toast-context";

export function CompetitorBattlecardModal({
  isOpen,
  onClose,
  competitorBrand,
  competitorProduct,
  shellProduct = "Shell Tellus / Rimula",
}: {
  isOpen: boolean;
  onClose: () => void;
  competitorBrand: string;
  competitorProduct?: string | null;
  shellProduct?: string;
}) {
  const { success, error } = useToast();
  const [battlecard, setBattlecard] = useState<CompetitorBattlecardResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!isOpen || !competitorBrand) return;

    let mounted = true;
    setIsLoading(true);

    getCompetitorBattlecardAction(competitorBrand, competitorProduct, shellProduct)
      .then((data) => {
        if (mounted) setBattlecard(data);
      })
      .catch((err) => {
        console.error("Failed to load battlecard:", err);
      })
      .finally(() => {
        if (mounted) setIsLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [isOpen, competitorBrand, competitorProduct, shellProduct]);

  if (!isOpen) return null;

  async function handleCopyPitch() {
    if (!battlecard?.soundbite_pitch) return;
    try {
      await navigator.clipboard.writeText(battlecard.soundbite_pitch);
      setCopied(true);
      success("Skrip bicara 15 detik berhasil disalin!");
      setTimeout(() => setCopied(false), 2500);
    } catch {
      error("Gagal menyalin skrip.");
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in-up"
    >
      <div className="relative w-full max-w-lg rounded-3xl bg-white shadow-2xl border border-neutral-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-100 bg-neutral-900 text-white">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500 text-white shadow-xs">
              <Swords className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold tracking-tight flex items-center gap-2">
                <span>Battlecard: Geser {competitorBrand}</span>
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold text-amber-300 border border-amber-500/40">
                  <Sparkles className="h-2.5 w-2.5" /> Shell TCO
                </span>
              </h2>
              <p className="text-[11px] text-neutral-400 font-medium">
                Target: {shellProduct}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 transition cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12 text-neutral-500 gap-2">
              <Loader2 className="h-6 w-6 animate-spin text-amber-600" />
              <p className="font-semibold text-xs">Menyusun argumen komparasi Shell vs {competitorBrand}...</p>
            </div>
          ) : battlecard ? (
            <div className="space-y-4">
              {/* Soundbite Pitch (15-Second Hook) */}
              <div className="rounded-2xl border-2 border-amber-400 bg-amber-50/60 p-4 space-y-2 shadow-2xs">
                <div className="flex items-center justify-between text-amber-950 font-bold text-[11px] uppercase tracking-wider">
                  <div className="flex items-center gap-1.5">
                    <Volume2 className="h-3.5 w-3.5 text-amber-600" />
                    <span>Skrip Bicara 15 Detik (Soundbite DSR):</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyPitch}
                    className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-900 bg-amber-200/80 px-2 py-0.5 rounded-md hover:bg-amber-300 transition cursor-pointer"
                  >
                    {copied ? <Check className="h-3 w-3 text-emerald-700" /> : <Copy className="h-3 w-3" />}
                    <span>{copied ? "Tersalin" : "Salin Skrip"}</span>
                  </button>
                </div>
                <p className="text-neutral-900 text-xs font-semibold leading-relaxed italic bg-white/90 p-3 rounded-xl border border-amber-200">
                  &ldquo;{battlecard.soundbite_pitch}&rdquo;
                </p>
              </div>

              {/* Shell Superiorities */}
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50/40 p-4 space-y-2.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-950 flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                  <span>3 Keunggulan Pembeda Shell yang Menghemat Biaya:</span>
                </span>
                <ul className="space-y-2">
                  {battlecard.shell_superiorities.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-neutral-800 text-[11px] font-medium leading-relaxed">
                      <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white text-[10px] font-bold mt-0.5">
                        ✓
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Competitor Weaknesses */}
              <div className="rounded-2xl border border-red-200 bg-red-50/40 p-4 space-y-2.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-red-950 flex items-center gap-1.5">
                  <AlertOctagon className="h-3.5 w-3.5 text-red-600" />
                  <span>3 Titik Lemah {competitorBrand} di Operasional:</span>
                </span>
                <ul className="space-y-2">
                  {battlecard.competitor_weaknesses.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-neutral-800 text-[11px] font-medium leading-relaxed">
                      <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-red-600 text-white text-[10px] font-bold mt-0.5">
                        !
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : null}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end p-4 border-t border-neutral-100 bg-neutral-50/80">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-neutral-900 px-5 py-2 text-xs font-bold text-white shadow-xs hover:bg-neutral-800 transition cursor-pointer"
          >
            Tutup Battlecard
          </button>
        </div>
      </div>
    </div>
  );
}
