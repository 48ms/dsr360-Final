"use client";

import { useState, useTransition } from "react";
import { parseUnstructuredVisitNotes, type ParsedVisitNote } from "@/actions/ai";
import { Sparkles, Loader2, Check, X, Wand2 } from "lucide-react";

export function AINoteParserModal({
  isOpen,
  customerId,
  onClose,
  onApply,
}: {
  isOpen: boolean;
  customerId?: string;
  onClose: () => void;
  onApply: (parsed: ParsedVisitNote) => void;
}) {
  const [rawText, setRawText] = useState("");
  const [isPending, startTransition] = useTransition();
  const [parsedResult, setParsedResult] = useState<ParsedVisitNote | null>(null);

  if (!isOpen) return null;

  function handleExtract() {
    if (!rawText.trim()) return;
    startTransition(async () => {
      const result = await parseUnstructuredVisitNotes(rawText, customerId);
      setParsedResult(result);
    });
  }

  function handleApplyResult() {
    if (parsedResult) {
      onApply(parsedResult);
      onClose();
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <div className="w-full max-w-lg rounded-2xl bg-white p-5 sm:p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className="rounded-xl bg-amber-100 p-2 text-amber-600">
              <Wand2 className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-neutral-900">AI Fast Note Extractor</h2>
              <p className="text-xs text-neutral-500">Tulis cerita santai hasil visit, AI yang menyusun lognya</p>
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

        {/* Input Area */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-neutral-700">
            Ceritakan hasil pertemuan / obrolan santai Anda:
          </label>
          <textarea
            rows={4}
            value={rawText}
            onChange={(e) => setRawText(e.target.value)}
            placeholder="Contoh: Ketemu Pak Hendra tadi. Dia tertarik trial 5 drum Rimula buat armada busnya, tapi bilang harga masih tinggi dibanding Pertamina Meditran. Tolong kirim penawaran resmi besok via WA."
            className="w-full rounded-xl border border-neutral-200 bg-neutral-50/60 p-3.5 text-xs text-neutral-900 shadow-xs focus:border-amber-500 focus:bg-white focus:ring-2 focus:ring-amber-200 outline-none"
          />

          <button
            type="button"
            onClick={handleExtract}
            disabled={isPending || !rawText.trim()}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-linear-to-r from-amber-500 to-amber-600 py-2.5 text-xs font-bold text-white shadow-xs hover:from-amber-600 hover:to-amber-700 transition disabled:opacity-50 cursor-pointer"
          >
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Mengekstrak Data Lapangan...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 fill-current" />
                <span>✨ Ekstrak Data Otomatis dengan AI</span>
              </>
            )}
          </button>
        </div>

        {/* Parsed Preview */}
        {parsedResult && (
          <div className="rounded-2xl border border-amber-200 bg-amber-50/40 p-4 space-y-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1.5">
              <Check className="h-3.5 w-3.5 text-emerald-600" /> Hasil Ekstraksi AI
            </span>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="rounded-xl bg-white p-2.5 border border-neutral-200/70">
                <span className="text-[10px] text-neutral-400 font-semibold block">Respon Customer:</span>
                <span className="font-bold text-neutral-800 capitalize mt-0.5 block">
                  {parsedResult.customer_response}
                </span>
              </div>

              <div className="rounded-xl bg-white p-2.5 border border-neutral-200/70">
                <span className="text-[10px] text-neutral-400 font-semibold block">Kompetitor:</span>
                <span className="font-bold text-neutral-800 mt-0.5 block">
                  {parsedResult.competitor_name ?? "Tidak terdeteksi"}
                </span>
              </div>

              <div className="rounded-xl bg-white p-2.5 border border-neutral-200/70 col-span-2">
                <span className="text-[10px] text-neutral-400 font-semibold block">Rekomendasi Produk & Volume:</span>
                <span className="font-bold text-neutral-800 mt-0.5 block">
                  🛢️ {parsedResult.product_name_suggestion} ({parsedResult.potential_volume_suggestion} Drum)
                </span>
              </div>

              <div className="rounded-xl bg-white p-2.5 border border-neutral-200/70 col-span-2">
                <span className="text-[10px] text-neutral-400 font-semibold block">Mandatory Next Action:</span>
                <span className="font-bold text-emerald-700 mt-0.5 block">
                  [{parsedResult.next_action_type}] {parsedResult.next_action_description}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleApplyResult}
              className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl bg-neutral-900 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-neutral-800 transition cursor-pointer"
            >
              <Check className="h-4 w-4" />
              <span>Terapkan ke Form Visit Sekarang</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
