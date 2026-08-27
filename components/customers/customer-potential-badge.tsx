"use client";

import { useState } from "react";
import { formatVolume, formatCurrency } from "@/lib/utils/format";
import { updateCustomerPotentialVolumeAction } from "@/actions/customers";
import { useToast } from "@/components/ui/toast-context";
import { Edit2, Fuel, Loader2, Sparkles, X, Check, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export function CustomerPotentialBadge({
  customerId,
  customerName,
  initialVolume,
  initialPriority = "C",
}: {
  customerId: string;
  customerName?: string;
  initialVolume?: number | null;
  initialPriority?: string;
}) {
  const { success, error } = useToast();
  const [volume, setVolume] = useState<number | null | undefined>(initialVolume);
  const [priority, setPriority] = useState<string>(initialPriority);
  const [showModal, setShowModal] = useState(false);

  // Modal Form State
  const [mode, setMode] = useState<"DRUM" | "LITER">("DRUM");
  const [drumInput, setDrumInput] = useState<string>(
    initialVolume ? String(Math.round((initialVolume / 209) * 10) / 10) : "5"
  );
  const [literInput, setLiterInput] = useState<string>(
    initialVolume ? String(initialVolume) : "1045"
  );
  const [selectedPriority, setSelectedPriority] = useState<"A" | "B" | "C">(
    (initialPriority as "A" | "B" | "C") || "B"
  );
  const [isSaving, setIsSaving] = useState(false);

  // Sync inputs
  function handleDrumChange(val: string) {
    setDrumInput(val);
    const num = parseFloat(val);
    if (!isNaN(num) && num >= 0) {
      const calculatedLiters = Math.round(num * 209);
      setLiterInput(String(calculatedLiters));

      // Auto suggest priority based on volume
      if (num >= 10) setSelectedPriority("A");
      else if (num >= 3) setSelectedPriority("B");
      else setSelectedPriority("C");
    }
  }

  function handleLiterChange(val: string) {
    setLiterInput(val);
    const num = parseFloat(val);
    if (!isNaN(num) && num >= 0) {
      const calculatedDrums = Math.round((num / 209) * 10) / 10;
      setDrumInput(String(calculatedDrums));

      if (num >= 2090) setSelectedPriority("A");
      else if (num >= 600) setSelectedPriority("B");
      else setSelectedPriority("C");
    }
  }

  async function handleSave() {
    const finalLiters = parseFloat(literInput);
    if (isNaN(finalLiters) || finalLiters < 0) {
      error("Masukkan angka volume yang valid.");
      return;
    }

    setIsSaving(true);
    try {
      const res = await updateCustomerPotentialVolumeAction({
        customerId,
        potentialMonthlyVolume: finalLiters,
        priority: selectedPriority,
      });

      if (res.success) {
        setVolume(finalLiters);
        setPriority(selectedPriority);
        success(res.message);
        setShowModal(false);
      } else {
        error(res.message);
      }
    } catch {
      error("Gagal memperbarui potensi.");
    } finally {
      setIsSaving(false);
    }
  }

  const estimatedDrums = volume ? Math.round((volume / 209) * 10) / 10 : 0;
  const estimatedRevenue = volume ? volume * 48000 : 0; // ~Rp 48k/Liter average

  return (
    <>
      <div className="mt-3 rounded-2xl bg-linear-to-r from-amber-500/10 via-amber-50/50 to-white border border-amber-300/80 p-3 flex items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500 text-white font-bold shrink-0 shadow-2xs">
            <Fuel className="h-4 w-4" />
          </div>
          <div>
            <span className="text-[10px] font-extrabold uppercase text-neutral-500 block">
              Total Potensi Konsumsi Pabrik:
            </span>
            <p className="text-xs font-black text-neutral-900 flex items-center gap-1.5">
              {volume ? (
                <>
                  <span className="text-amber-900">{formatVolume(volume)} / bulan</span>
                  <span className="text-neutral-500 font-semibold font-mono text-[11px]">
                    (~{estimatedDrums} Drum)
                  </span>
                </>
              ) : (
                <span className="text-amber-800 font-bold italic">Belum diisi (Klik untuk input)</span>
              )}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-amber-300 bg-white hover:bg-amber-50 active:scale-95 text-xs font-bold text-amber-950 transition cursor-pointer shadow-2xs shrink-0"
        >
          <Edit2 className="h-3.5 w-3.5 text-amber-600" />
          <span>{volume ? "Ubah" : "Isi Potensi"}</span>
        </button>
      </div>

      {/* Edit Potential Volume Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div
            className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl border border-neutral-200 space-y-4 animate-in zoom-in-95 duration-200"
            role="dialog"
            aria-modal="true"
          >
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-500 text-white font-bold">
                  <Fuel className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-neutral-900">
                    Input Potensi Konsumsi Pelumas
                  </h3>
                  <p className="text-xs text-neutral-500 truncate max-w-[240px]">
                    {customerName || "Akun Customer"}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                disabled={isSaving}
                className="rounded-xl p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Explanation Note */}
            <div className="rounded-2xl bg-amber-500/10 border border-amber-300/70 p-3 text-xs text-amber-950 space-y-1">
              <p className="font-bold flex items-center gap-1">
                <Sparkles className="h-3.5 w-3.5 text-amber-600" />
                <span>Total Kebutuhan Seluruh Mesin Pabrik:</span>
              </p>
              <p className="text-[11px] text-neutral-700 leading-relaxed">
                Estimasi total konsumsi oli (hidrolik, gear, kompresor, genset) per bulan, termasuk yang saat ini masih dibeli dari kompetitor.
              </p>
            </div>

            {/* Drum vs Liter Dual Input */}
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                {/* Drum input */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-neutral-700">Jumlah Drum (209L)</label>
                  <div className="relative">
                    <input
                      type="number"
                      step="any"
                      min="0"
                      value={drumInput}
                      onChange={(e) => handleDrumChange(e.target.value)}
                      placeholder="e.g. 5"
                      className="w-full min-h-[44px] rounded-xl border border-neutral-300 bg-white px-3 py-2 text-sm font-bold text-neutral-900 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/30 outline-none"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-neutral-400 pointer-events-none">
                      Drum
                    </span>
                  </div>
                </div>

                {/* Liter input */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-neutral-700">Total Liter</label>
                  <div className="relative">
                    <input
                      type="number"
                      step="any"
                      min="0"
                      value={literInput}
                      onChange={(e) => handleLiterChange(e.target.value)}
                      placeholder="e.g. 1045"
                      className="w-full min-h-[44px] rounded-xl border border-neutral-300 bg-white px-3 py-2 text-sm font-bold text-neutral-900 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/30 outline-none"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-neutral-400 pointer-events-none">
                      Liter
                    </span>
                  </div>
                </div>
              </div>

              {/* Priority Tier Alignment */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-neutral-700">Klasifikasi Tier Akun:</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedPriority("A")}
                    className={cn(
                      "flex flex-col items-center justify-center p-2 rounded-xl border text-xs font-bold transition cursor-pointer",
                      selectedPriority === "A"
                        ? "bg-red-500 text-white border-red-600 shadow-xs"
                        : "bg-neutral-50 text-neutral-700 border-neutral-200 hover:bg-neutral-100"
                    )}
                  >
                    <span>Priority A</span>
                    <span className="text-[10px] font-normal opacity-80">&gt;= 10 Drum/bln</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedPriority("B")}
                    className={cn(
                      "flex flex-col items-center justify-center p-2 rounded-xl border text-xs font-bold transition cursor-pointer",
                      selectedPriority === "B"
                        ? "bg-amber-500 text-white border-amber-600 shadow-xs"
                        : "bg-neutral-50 text-neutral-700 border-neutral-200 hover:bg-neutral-100"
                    )}
                  >
                    <span>Priority B</span>
                    <span className="text-[10px] font-normal opacity-80">3 - 9 Drum/bln</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedPriority("C")}
                    className={cn(
                      "flex flex-col items-center justify-center p-2 rounded-xl border text-xs font-bold transition cursor-pointer",
                      selectedPriority === "C"
                        ? "bg-neutral-800 text-white border-neutral-900 shadow-xs"
                        : "bg-neutral-50 text-neutral-700 border-neutral-200 hover:bg-neutral-100"
                    )}
                  >
                    <span>Priority C</span>
                    <span className="text-[10px] font-normal opacity-80">&lt; 3 Drum/bln</span>
                  </button>
                </div>
              </div>

              {/* Live Revenue Estimation Pill */}
              {parseFloat(literInput) > 0 && (
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-neutral-100 border border-neutral-200 text-xs">
                  <span className="text-neutral-600 font-medium">Estimasi Nilai Dompet Pabrik:</span>
                  <strong className="text-emerald-700 font-bold font-mono">
                    ~{formatCurrency(parseFloat(literInput) * 48000)} / bln
                  </strong>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                disabled={isSaving}
                className="min-h-[44px] px-4 rounded-xl border border-neutral-300 bg-white text-xs font-bold text-neutral-700 hover:bg-neutral-50 active:scale-95 transition cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={isSaving}
                className="min-h-[44px] px-5 rounded-xl bg-amber-500 text-xs font-bold text-white hover:bg-amber-600 active:scale-95 transition flex items-center gap-1.5 cursor-pointer shadow-xs disabled:opacity-50"
              >
                {isSaving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Check className="h-4 w-4" />
                )}
                <span>{isSaving ? "Menyimpan..." : "Simpan Potensi"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
