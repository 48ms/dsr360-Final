"use client";

import { useState, useTransition } from "react";
import { createOpportunity } from "@/actions/opportunities";
import { OPPORTUNITY_STAGES, type OpportunityStage } from "@/constants/enums";
import { ArrowLeft, Check, Loader2, ShieldAlert } from "lucide-react";
import Link from "next/link";

type CustomerOption = {
  id: string;
  customer_name: string;
  customer_code: string;
  city: string | null;
  segment: string;
};

type MasterProduct = {
  id: string;
  brand: string;
  product_name: string;
  category: string | null;
  viscosity: string | null;
};

type MasterCompetitor = {
  id: string;
  brand: string;
  product_name: string | null;
};

export function OpportunityForm({
  customers,
  masterProducts,
  competitors,
  defaultCustomerId,
}: {
  customers: CustomerOption[];
  masterProducts: MasterProduct[];
  competitors: MasterCompetitor[];
  defaultCustomerId?: string;
}) {
  const [isPending, startTransition] = useTransition();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form State
  const [customerId, setCustomerId] = useState<string>(defaultCustomerId || (customers[0]?.id ?? ""));
  const [opportunityName, setOpportunityName] = useState<string>("");
  const [productId, setProductId] = useState<string>(masterProducts[0]?.id ?? "");
  const [stage, setStage] = useState<OpportunityStage>("PROSPECT");
  const [potentialVolume, setPotentialVolume] = useState<string>("");
  const [volumeUnit, setVolumeUnit] = useState<"LITER" | "DRUM" | "PAIL">("DRUM");
  const [potentialValue, setPotentialValue] = useState<string>("");
  const [probability, setProbability] = useState<number>(30);
  const [expectedCloseDate, setExpectedCloseDate] = useState<string>("");
  const [competitorId, setCompetitorId] = useState<string>("");
  const [customerNeed, setCustomerNeed] = useState<string>("");
  const [nextAction, setNextAction] = useState<string>("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!customerId) {
      setErrorMsg("Customer wajib dipilih.");
      return;
    }
    if (!opportunityName.trim()) {
      setErrorMsg("Nama peluang (opportunity) wajib diisi.");
      return;
    }

    setErrorMsg(null);
    startTransition(async () => {
      let calculatedVolumeLiters: number | null = null;
      if (potentialVolume) {
        const num = parseFloat(potentialVolume);
        if (!isNaN(num)) {
          if (volumeUnit === "DRUM") calculatedVolumeLiters = num * 209;
          else if (volumeUnit === "PAIL") calculatedVolumeLiters = num * 20;
          else calculatedVolumeLiters = num;
        }
      }

      const parsedVal = potentialValue ? parseFloat(potentialValue) : null;

      const res = await createOpportunity({
        customer_id: customerId,
        opportunity_name: opportunityName.trim(),
        product_id: productId || null,
        stage,
        potential_volume: calculatedVolumeLiters,
        potential_value: parsedVal !== null && !isNaN(parsedVal) ? parsedVal : null,
        probability,
        expected_close_date: expectedCloseDate || undefined,
        competitor_id: competitorId || null,
        customer_need: customerNeed || undefined,
        next_action: nextAction || undefined,
      });

      if (res?.error) {
        setErrorMsg(res.error);
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto p-4 sm:p-6 space-y-5">
      <div className="flex items-center gap-3">
        <Link
          href="/pipeline"
          className="rounded-xl border border-neutral-200 bg-white p-2 text-neutral-600 hover:bg-neutral-50 transition"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-lg font-bold text-neutral-900">Tambah Peluang Baru</h1>
          <p className="text-xs text-neutral-500">Catat deal prospek ke dalam sales pipeline</p>
        </div>
      </div>

      {errorMsg && (
        <div className="flex items-center gap-2 rounded-xl bg-red-50 p-3 text-xs text-red-700 border border-red-200">
          <ShieldAlert className="h-4 w-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Customer & Name */}
      <div className="rounded-2xl border border-neutral-200 bg-white p-4 sm:p-5 shadow-xs space-y-3">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-600 mb-1">
            Customer *
          </label>
          <select
            value={customerId}
            onChange={(e) => setCustomerId(e.target.value)}
            className="w-full rounded-xl border border-neutral-200 bg-white px-3.5 py-2.5 text-xs text-neutral-900 shadow-xs focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none"
          >
            <option value="">-- Pilih Customer --</option>
            {customers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.customer_name} ({c.city ?? "Tanpa Kota"} &bull; {c.segment})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-600 mb-1">
            Nama Peluang / Judul Deal *
          </label>
          <input
            type="text"
            value={opportunityName}
            onChange={(e) => setOpportunityName(e.target.value)}
            placeholder="Contoh: Pengadaan Oli Armada Bus 20 Unit"
            className="w-full rounded-xl border border-neutral-200 bg-white px-3.5 py-2.5 text-xs text-neutral-900 shadow-xs focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none"
          />
        </div>
      </div>

      {/* Product & Stage */}
      <div className="rounded-2xl border border-neutral-200 bg-white p-4 sm:p-5 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-600 mb-1">
              Produk Shell Ditawarkan
            </label>
            <select
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs text-neutral-900"
            >
              {masterProducts.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.brand} {p.product_name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-600 mb-1">
              Tahap Penjualan (Stage)
            </label>
            <select
              value={stage}
              onChange={(e) => setStage(e.target.value as OpportunityStage)}
              className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs font-bold text-neutral-900"
            >
              {OPPORTUNITY_STAGES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Volume & Value */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-600 mb-1">
              Estimasi Volume
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                value={potentialVolume}
                onChange={(e) => setPotentialVolume(e.target.value)}
                placeholder="Jumlah"
                className="flex-1 rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs text-neutral-900"
              />
              <select
                value={volumeUnit}
                onChange={(e) => setVolumeUnit(e.target.value as "LITER" | "DRUM" | "PAIL")}
                className="rounded-xl border border-neutral-200 bg-white px-2 py-2 text-xs font-semibold text-neutral-800"
              >
                <option value="DRUM">Drum (209L)</option>
                <option value="PAIL">Pail (20L)</option>
                <option value="LITER">Liter</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-600 mb-1">
              Estimasi Nilai Total (Rp)
            </label>
            <input
              type="number"
              value={potentialValue}
              onChange={(e) => setPotentialValue(e.target.value)}
              placeholder="Contoh: 150000000"
              className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs text-neutral-900"
            />
          </div>
        </div>
      </div>

      {/* Competitor & Close Date */}
      <div className="rounded-2xl border border-neutral-200 bg-white p-4 sm:p-5 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-600 mb-1">
              Kompetitor yang Digeser
            </label>
            <select
              value={competitorId}
              onChange={(e) => setCompetitorId(e.target.value)}
              className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs text-neutral-900"
            >
              <option value="">-- Tanpa Kompetitor --</option>
              {competitors.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.brand} {c.product_name ? `(${c.product_name})` : ""}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-600 mb-1">
              Target Closing (Close Date)
            </label>
            <input
              type="date"
              value={expectedCloseDate}
              onChange={(e) => setExpectedCloseDate(e.target.value)}
              className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs text-neutral-900"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-600 mb-1">
            Catatan Kebutuhan Customer
          </label>
          <textarea
            rows={2}
            value={customerNeed}
            onChange={(e) => setCustomerNeed(e.target.value)}
            placeholder="Contoh: Butuh oli sintetis untuk armada baru dengan interval ganti oli lebih panjang..."
            className="w-full rounded-xl border border-neutral-200 bg-white p-3 text-xs text-neutral-900 shadow-xs focus:border-amber-500 outline-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-600 mb-1">
              Probabilitas Closing (%)
            </label>
            <input
              type="number"
              min={0}
              max={100}
              value={probability}
              onChange={(e) => setProbability(Number(e.target.value) || 0)}
              className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs text-neutral-900"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-600 mb-1">
              Next Action untuk Deal Ini
            </label>
            <input
              type="text"
              value={nextAction}
              onChange={(e) => setNextAction(e.target.value)}
              placeholder="Contoh: Kirim penawaran harga & presentasi TCO"
              className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs text-neutral-900"
            />
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <Link
          href="/pipeline"
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
              <span>Menyimpan Deal...</span>
            </>
          ) : (
            <>
              <Check className="h-3.5 w-3.5" />
              <span>Simpan Opportunity</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
