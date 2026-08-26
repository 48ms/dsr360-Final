"use client";

import { useState, useTransition } from "react";
import { completeFollowUp } from "@/actions/follow-ups";
import {
  FOLLOW_UP_ACTIVITY_TYPES,
  FOLLOW_UP_PRIORITIES,
  type FollowUpActivityType,
  type FollowUpPriority,
} from "@/constants/enums";
import { CheckCircle2, Loader2, ShieldAlert, X } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { getTodayWIB } from "@/lib/utils/format";

export function CompleteTaskModal({
  followUpId,
  customerName,
  taskDescription,
  onClose,
  onSuccess,
}: {
  followUpId: string;
  customerName: string;
  taskDescription: string;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [isPending, startTransition] = useTransition();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [result, setResult] = useState<string>("");
  const [hasChain, setHasChain] = useState<boolean>(false);
  const [chainActivityType, setChainActivityType] = useState<FollowUpActivityType>("WHATSAPP");
  const [chainDescription, setChainDescription] = useState<string>("");
  
  const [chainDueDate, setChainDueDate] = useState<string>(() => {
    const d = new Date(`${getTodayWIB()}T12:00:00Z`);
    d.setUTCDate(d.getUTCDate() + 2);
    return d.toISOString().split("T")[0];
  });
  const [chainPriority, setChainPriority] = useState<FollowUpPriority>("HIGH");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!result.trim()) {
      setErrorMsg("Hasil follow-up wajib dicatat.");
      return;
    }
    if (hasChain && (!chainDescription.trim() || !chainDueDate)) {
      setErrorMsg("Deskripsi dan tanggal follow-up lanjutan wajib diisi.");
      return;
    }

    setErrorMsg(null);
    startTransition(async () => {
      const res = await completeFollowUp({
        follow_up_id: followUpId,
        result: result.trim(),
        has_chain: hasChain,
        chain_activity_type: hasChain ? chainActivityType : undefined,
        chain_description: hasChain ? chainDescription.trim() : undefined,
        chain_due_date: hasChain ? chainDueDate : undefined,
        chain_priority: hasChain ? chainPriority : undefined,
      });

      if (res?.error) {
        setErrorMsg(res.error);
      } else {
        onSuccess();
      }
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
      <div className="w-full max-w-lg rounded-2xl bg-white p-5 sm:p-6 shadow-xl space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 flex items-center gap-1">
              <CheckCircle2 className="h-3.5 w-3.5" /> Selesaikan Task
            </span>
            <h2 className="text-base font-bold text-neutral-900 mt-0.5">{customerName}</h2>
            <p className="text-xs text-neutral-500 line-clamp-1 italic">&ldquo;{taskDescription}&rdquo;</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup modal"
            className="rounded-lg p-1 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600 focus-visible:ring-2 focus-visible:ring-amber-500 outline-none"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        {errorMsg && (
          <div className="flex items-center gap-2 rounded-xl bg-red-50 p-3 text-xs text-red-700 border border-red-200">
            <ShieldAlert className="h-4 w-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Result input */}
          <div>
            <label className="block text-xs font-semibold text-neutral-800 mb-1">
              Catatan Hasil Follow-Up *
            </label>
            <textarea
              rows={3}
              value={result}
              onChange={(e) => setResult(e.target.value)}
              placeholder="Contoh: Sudah telpon Pak Hendra. Penawaran disetujui, minta dikirim 2 pail sample untuk uji lab..."
              className="w-full rounded-xl border border-neutral-200 bg-white p-3 text-xs text-neutral-900 shadow-xs focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none"
            />
          </div>

          {/* Chained action toggle */}
          <div className="rounded-xl border border-neutral-200 p-3.5 bg-neutral-50/70 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-xs font-bold text-neutral-900 block">
                  Buat Follow-Up Berantai?
                </label>
                <p className="text-[11px] text-neutral-500">
                  Langsung jadwalkan aksi selanjutnya agar deal terus berjalan
                </p>
              </div>
              <button
                type="button"
                onClick={() => setHasChain(!hasChain)}
                className={cn(
                  "rounded-lg px-2.5 py-1 text-xs font-bold transition cursor-pointer",
                  hasChain ? "bg-amber-500 text-amber-950" : "bg-neutral-200 text-neutral-800" /* impeccable-disable-line gray-on-color */
                )}
              >
                {hasChain ? "+ Aktif" : "○ Tidak"}
              </button>
            </div>

            {hasChain && (
              <div className="space-y-2.5 pt-2 border-t border-neutral-200">
                <div className="grid grid-cols-3 gap-2">
                  <select
                    value={chainActivityType}
                    onChange={(e) => setChainActivityType(e.target.value as FollowUpActivityType)}
                    className="rounded-lg border border-neutral-300 bg-white px-2 py-1.5 text-xs font-semibold text-neutral-900"
                  >
                    {FOLLOW_UP_ACTIVITY_TYPES.map((a) => (
                      <option key={a} value={a}>
                        {a}
                      </option>
                    ))}
                  </select>
                  <select
                    value={chainPriority}
                    onChange={(e) => setChainPriority(e.target.value as FollowUpPriority)}
                    className="rounded-lg border border-neutral-300 bg-white px-2 py-1.5 text-xs font-semibold text-neutral-900"
                  >
                    {FOLLOW_UP_PRIORITIES.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                  <input
                    type="date"
                    value={chainDueDate}
                    onChange={(e) => setChainDueDate(e.target.value)}
                    className="rounded-lg border border-neutral-300 bg-white px-2 py-1.5 text-xs text-neutral-900 font-semibold"
                  />
                </div>
                <input
                  type="text"
                  value={chainDescription}
                  onChange={(e) => setChainDescription(e.target.value)}
                  placeholder="Aktivitas berikutnya (misal: Kirim sample oli)..."
                  className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-1.5 text-xs text-neutral-900"
                />
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-neutral-200 px-4 py-2 text-xs font-medium text-neutral-600 hover:bg-neutral-50"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-5 py-2 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 transition disabled:opacity-50"
            >
              {isPending ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Menyimpan...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>Selesaikan & Simpan</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
