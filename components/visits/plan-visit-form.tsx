"use client";

import { useState, useTransition } from "react";
import { planVisit, generateAIPopsa } from "@/actions/visits";
import { VISIT_TYPES, type VisitType } from "@/constants/enums";
import { Sparkles, ArrowLeft, Loader2, Check, Edit3, ShieldAlert } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils/cn";
import { getTodayWIB } from "@/lib/utils/format";

type CustomerOption = {
  id: string;
  customer_name: string;
  customer_code: string;
  city: string | null;
  segment: string;
  priority: string;
};

export function PlanVisitForm({
  customers,
  defaultCustomerId,
}: {
  customers: CustomerOption[];
  defaultCustomerId?: string;
}) {
  const [isPending, startTransition] = useTransition();
  const [isGeneratingAIPopsa, setIsGeneratingAIPopsa] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const todayStr = getTodayWIB();

  // Form State
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>(
    defaultCustomerId || (customers[0]?.id ?? "")
  );
  const [visitDate, setVisitDate] = useState<string>(todayStr);
  const [visitType, setVisitType] = useState<VisitType>("ROUTINE");
  const [purpose, setPurpose] = useState<string>("");
  const [objective, setObjective] = useState<string>("");

  // POPSA State
  const [popsaPurpose, setPopsaPurpose] = useState<string>("");
  const [popsaObjective, setPopsaObjective] = useState<string>("");
  const [popsaPremises, setPopsaPremises] = useState<string>("");
  const [popsaStrategy, setPopsaStrategy] = useState<string>("");
  const [popsaAnticipate, setPopsaAnticipate] = useState<string>("");
  const [isEditingPopsa, setIsEditingPopsa] = useState<boolean>(false);
  const [hasPopsaGenerated, setHasPopsaGenerated] = useState<boolean>(false);

  // AI POPSA Generator Trigger
  async function handleGeneratePOPSA() {
    if (!selectedCustomerId) {
      setErrorMsg("Pilih customer terlebih dahulu");
      return;
    }
    setErrorMsg(null);
    setIsGeneratingAIPopsa(true);
    try {
      const generated = await generateAIPopsa(selectedCustomerId, visitType, purpose, visitDate);
      setPopsaPurpose(generated.purpose);
      setPopsaObjective(generated.objective);
      setPopsaPremises(generated.premises);
      setPopsaStrategy(generated.strategy);
      setPopsaAnticipate(generated.anticipate);
      setHasPopsaGenerated(true);
      if (!objective) {
        setObjective(generated.objective);
      }
    } catch (err: unknown) {
      console.error(err);
      setErrorMsg("Gagal generate POPSA. Coba lagi.");
    } finally {
      setIsGeneratingAIPopsa(false);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedCustomerId) {
      setErrorMsg("Customer wajib dipilih");
      return;
    }

    setErrorMsg(null);
    startTransition(async () => {
      const res = await planVisit({
        customer_id: selectedCustomerId,
        visit_date: visitDate,
        visit_type: visitType,
        purpose: purpose || undefined,
        objective: objective || undefined,
        popsa_purpose: popsaPurpose || undefined,
        popsa_objective: popsaObjective || undefined,
        popsa_premises: popsaPremises || undefined,
        popsa_strategy: popsaStrategy || undefined,
        popsa_anticipate: popsaAnticipate || undefined,
      });

      if (res?.error) {
        setErrorMsg(res.error);
      }
    });
  }

  const selectedCustomer = customers.find((c) => c.id === selectedCustomerId);

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          href="/visits"
          className="rounded-xl border border-neutral-200 bg-white p-2 text-neutral-600 hover:bg-neutral-50 transition"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-lg font-bold text-neutral-900">Rencanakan Kunjungan</h1>
          <p className="text-xs text-neutral-500">Susun agenda dan POPSA sebelum ke lapangan</p>
        </div>
      </div>

      {errorMsg && (
        <div className="flex items-center gap-2 rounded-xl bg-red-50 p-3 text-xs text-red-700 border border-red-200">
          <ShieldAlert className="h-4 w-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* 1. Pilih Customer */}
      <div className="rounded-2xl border border-neutral-200 bg-white p-4 sm:p-5 shadow-xs space-y-3">
        <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-600">
          1. Pilih Customer Target *
        </label>
        <select
          value={selectedCustomerId}
          onChange={(e) => {
            setSelectedCustomerId(e.target.value);
            setHasPopsaGenerated(false);
          }}
          className="w-full rounded-xl border border-neutral-200 bg-white px-3.5 py-2.5 text-xs text-neutral-900 shadow-xs focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none"
        >
          <option value="">-- Pilih Customer --</option>
          {customers.map((c) => (
            <option key={c.id} value={c.id}>
              {c.customer_name} ({c.city ?? "Tanpa Kota"} &bull; {c.segment} &bull; Priority {c.priority})
            </option>
          ))}
        </select>

        {selectedCustomer && (
          <div className="rounded-xl bg-neutral-50 p-3 text-xs text-neutral-600 flex justify-between items-center border border-neutral-100">
            <div>
              <p className="font-semibold text-neutral-900">{selectedCustomer.customer_name}</p>
              <p className="text-neutral-500 text-[11px]">
                {selectedCustomer.customer_code} &bull; {selectedCustomer.segment} &bull; {selectedCustomer.city}
              </p>
            </div>
            <span className="rounded-full bg-amber-100 px-2.5 py-0.5 font-bold text-amber-800 text-[10px]">
              Priority {selectedCustomer.priority}
            </span>
          </div>
        )}
      </div>

      {/* 2. Tipe & Jadwal Visit */}
      <div className="rounded-2xl border border-neutral-200 bg-white p-4 sm:p-5 shadow-xs space-y-4">
        <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-600">
          2. Tipe & Jadwal Kunjungan *
        </label>

        {/* Purpose Chips */}
        <div>
          <span className="text-[11px] text-neutral-500 block mb-1.5 font-medium">Tipe / Kategori Visit:</span>
          <div className="flex flex-wrap gap-1.5">
            {VISIT_TYPES.map((t) => (
              <button
                type="button"
                key={t}
                onClick={() => setVisitType(t)}
                className={cn(
                  "rounded-lg px-2.5 py-1.5 text-xs font-medium transition cursor-pointer",
                  visitType === t
                    ? "bg-amber-500 text-white font-semibold shadow-xs"
                    : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                )}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Date Input */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <div>
            <label className="block text-[11px] font-medium text-neutral-600 mb-1">
              Tanggal Kunjungan
            </label>
            <div className="relative">
              <input
                type="date"
                value={visitDate}
                onChange={(e) => setVisitDate(e.target.value)}
                className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs text-neutral-900 shadow-xs focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-neutral-600 mb-1">
              Tujuan Singkat
            </label>
            <input
              type="text"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              placeholder="Contoh: Follow up trial oli Rimula R4 X"
              className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs text-neutral-900 shadow-xs focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none"
            />
          </div>
        </div>
      </div>

      {/* 3. POPSA Framework Section */}
      <div className="rounded-2xl border border-neutral-200 bg-white p-4 sm:p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-800">
              3. POPSA Strategy (Pre-Call Plan)
            </label>
            <p className="text-[11px] text-neutral-500">
              Purpose, Objective, Premises, Strategy, Anticipate
            </p>
          </div>

          <button
            type="button"
            onClick={handleGeneratePOPSA}
            disabled={isGeneratingAIPopsa || !selectedCustomerId}
            className="inline-flex items-center gap-1.5 rounded-xl bg-linear-to-r from-amber-500 to-amber-600 px-3 py-1.5 text-xs font-semibold text-white shadow-xs hover:from-amber-600 hover:to-amber-700 transition disabled:opacity-50"
          >
            {isGeneratingAIPopsa ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <span>Generating...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-3.5 w-3.5" />
                <span>{hasPopsaGenerated ? "Regenerate AI" : "Generate POPSA"}</span>
              </>
            )}
          </button>
        </div>

        {hasPopsaGenerated ? (
          <div className="space-y-3 rounded-xl bg-amber-50/40 p-4 border border-amber-200/70">
            <div className="flex justify-between items-center pb-2 border-b border-amber-200/50">
              <span className="text-xs font-bold text-amber-900 flex items-center gap-1">
                🎯 Draft Strategi POPSA
              </span>
              <button
                type="button"
                onClick={() => setIsEditingPopsa(!isEditingPopsa)}
                className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-800 hover:text-amber-950 underline cursor-pointer"
              >
                <Edit3 className="h-3 w-3" />
                {isEditingPopsa ? "Tutup Editor" : "Edit Teks POPSA"}
              </button>
            </div>

            {isEditingPopsa ? (
              <div className="space-y-3 text-xs pt-1">
                <div>
                  <label className="font-semibold text-neutral-700 block mb-0.5">Purpose (Tujuan Utama):</label>
                  <textarea
                    rows={2}
                    value={popsaPurpose}
                    onChange={(e) => setPopsaPurpose(e.target.value)}
                    className="w-full rounded-lg border border-neutral-300 bg-white p-2 text-xs"
                  />
                </div>
                <div>
                  <label className="font-semibold text-neutral-700 block mb-0.5">Objective (Target Hasil):</label>
                  <textarea
                    rows={2}
                    value={popsaObjective}
                    onChange={(e) => setPopsaObjective(e.target.value)}
                    className="w-full rounded-lg border border-neutral-300 bg-white p-2 text-xs"
                  />
                </div>
                <div>
                  <label className="font-semibold text-neutral-700 block mb-0.5">Premises (Kondisi Customer & Oli Saat Ini):</label>
                  <textarea
                    rows={2}
                    value={popsaPremises}
                    onChange={(e) => setPopsaPremises(e.target.value)}
                    className="w-full rounded-lg border border-neutral-300 bg-white p-2 text-xs"
                  />
                </div>
                <div>
                  <label className="font-semibold text-neutral-700 block mb-0.5">Strategy (Pendekatan Penjualan):</label>
                  <textarea
                    rows={2}
                    value={popsaStrategy}
                    onChange={(e) => setPopsaStrategy(e.target.value)}
                    className="w-full rounded-lg border border-neutral-300 bg-white p-2 text-xs"
                  />
                </div>
                <div>
                  <label className="font-semibold text-neutral-700 block mb-0.5">Anticipate (Antisipasi Keberatan Customer):</label>
                  <textarea
                    rows={2}
                    value={popsaAnticipate}
                    onChange={(e) => setPopsaAnticipate(e.target.value)}
                    className="w-full rounded-lg border border-neutral-300 bg-white p-2 text-xs"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-2.5 text-xs text-neutral-700 pt-1">
                <div>
                  <span className="font-bold text-amber-950 block text-[11px] uppercase">Purpose:</span>
                  <p className="text-neutral-800">{popsaPurpose || "-"}</p>
                </div>
                <div>
                  <span className="font-bold text-amber-950 block text-[11px] uppercase">Objective:</span>
                  <p className="text-neutral-800">{popsaObjective || "-"}</p>
                </div>
                <div>
                  <span className="font-bold text-amber-950 block text-[11px] uppercase">Premises:</span>
                  <p className="text-neutral-800">{popsaPremises || "-"}</p>
                </div>
                <div>
                  <span className="font-bold text-amber-950 block text-[11px] uppercase">Strategy:</span>
                  <p className="text-neutral-800">{popsaStrategy || "-"}</p>
                </div>
                <div>
                  <span className="font-bold text-amber-950 block text-[11px] uppercase">Anticipate:</span>
                  <p className="text-neutral-800">{popsaAnticipate || "-"}</p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-neutral-200 p-4 text-center">
            <p className="text-xs text-neutral-500">
              Klik tombol <strong className="text-neutral-700">Generate POPSA</strong> di atas untuk membuat rekomendasi strategi pre-call planning berdasarkan data mesin & oli customer secara otomatis.
            </p>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <Link
          href="/visits"
          className="rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-xs font-medium text-neutral-600 hover:bg-neutral-50 transition"
        >
          Batal
        </Link>
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center gap-1.5 rounded-xl bg-neutral-900 px-6 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-neutral-800 transition disabled:opacity-50"
        >
          {isPending ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              <span>Menyimpan Rencana...</span>
            </>
          ) : (
            <>
              <Check className="h-3.5 w-3.5" />
              <span>Simpan Rencana Visit</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
