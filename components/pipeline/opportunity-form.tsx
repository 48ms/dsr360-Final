"use client";

import { useState, useTransition } from "react";
import { createOpportunity } from "@/actions/opportunities";
import { OPPORTUNITY_STAGES, type OpportunityStage } from "@/constants/enums";
import { ArrowLeft, Check, Loader2, ShieldAlert } from "lucide-react";
import Link from "next/link";
import {
  OpportunityProductItemsEditor,
} from "@/components/pipeline/opportunity-product-items-editor";
import {
  serializeOpportunityItems,
  type OpportunityProductItem,
} from "@/lib/utils/opportunity-items";

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
  packaging?: string | null;
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
  const [stage, setStage] = useState<OpportunityStage>("PROSPECT");
  const [productItems, setProductItems] = useState<OpportunityProductItem[]>([
    {
      id: "item-1",
      productId: "",
      qty: "1",
      unit: "DRUM",
      unitPrice: 0,
      subtotal: 0,
    },
  ]);
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
      const { serializedNotes, totalVolumeLiters, totalValue, primaryProductId } =
        serializeOpportunityItems(customerNeed, productItems);

      const res = await createOpportunity({
        customer_id: customerId,
        opportunity_name: opportunityName.trim(),
        product_id: primaryProductId,
        stage,
        potential_volume: totalVolumeLiters > 0 ? totalVolumeLiters : null,
        potential_value: totalValue > 0 ? totalValue : null,
        probability,
        expected_close_date: expectedCloseDate || undefined,
        competitor_id: competitorId || null,
        customer_need: serializedNotes.trim() || undefined,
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
          <p className="text-xs text-neutral-500">Buat deal baru & tawarkan paket pelumas Shell.</p>
        </div>
      </div>

      {errorMsg && (
        <div className="flex items-center gap-2 rounded-xl bg-red-50 p-3 text-xs text-red-700 border border-red-200">
          <ShieldAlert className="h-4 w-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Customer & Deal Name */}
      <div className="rounded-2xl border border-neutral-200 bg-white p-4 sm:p-5 shadow-xs space-y-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-600 mb-1">
            Customer *
          </label>
          <select
            value={customerId}
            onChange={(e) => setCustomerId(e.target.value)}
            className="w-full rounded-xl border border-neutral-200 bg-white px-3.5 py-2.5 text-xs text-neutral-900 shadow-xs focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none"
          >
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
            required
            value={opportunityName}
            onChange={(e) => setOpportunityName(e.target.value)}
            placeholder="Contoh: Pengadaan Oli Pabrik Tekstil 10 Drum"
            className="w-full rounded-xl border border-neutral-200 bg-white px-3.5 py-2.5 text-xs text-neutral-900 shadow-xs focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none"
          />
        </div>
      </div>

      {/* Multi-Product Line Items Editor */}
      <div className="rounded-2xl border border-neutral-200 bg-white p-4 sm:p-5 shadow-xs">
        <OpportunityProductItemsEditor
          items={productItems}
          onChange={setProductItems}
          masterProducts={masterProducts}
        />
      </div>

      {/* Stage, Close Date & Competitor */}
      <div className="rounded-2xl border border-neutral-200 bg-white p-4 sm:p-5 shadow-xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-600 mb-1">
              Target Tanggal Closing
            </label>
            <input
              type="date"
              value={expectedCloseDate}
              onChange={(e) => setExpectedCloseDate(e.target.value)}
              className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs text-neutral-900"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 border-t border-neutral-100">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-600 mb-1">
              Peluang Close (%): <span className="text-amber-700 font-bold">{probability}%</span>
            </label>
            <input
              type="range"
              min="10"
              max="100"
              step="5"
              value={probability}
              onChange={(e) => setProbability(parseInt(e.target.value, 10))}
              className="w-full accent-amber-500 mt-2"
            />
          </div>

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
        </div>
      </div>

      {/* Customer Need & Next Action */}
      <div className="rounded-2xl border border-neutral-200 bg-white p-4 sm:p-5 shadow-xs space-y-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-600 mb-1">
            Kebutuhan / Alasan Pelanggan
          </label>
          <textarea
            rows={2}
            value={customerNeed}
            onChange={(e) => setCustomerNeed(e.target.value)}
            placeholder="Contoh: Kebutuhan oli hidrolik untuk 5 mesin injection baru..."
            className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs text-neutral-900"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-600 mb-1">
            Rencana Tindak Lanjut (Next Action)
          </label>
          <input
            type="text"
            value={nextAction}
            onChange={(e) => setNextAction(e.target.value)}
            placeholder="Contoh: Kirim penawaran harga resmi (SPH) via WhatsApp"
            className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs text-neutral-900"
          />
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 pt-2">
        <Link
          href="/pipeline"
          className="rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 transition"
        >
          Batal
        </Link>
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-amber-600 transition disabled:opacity-50"
        >
          {isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Menyimpan Deal...</span>
            </>
          ) : (
            <>
              <Check className="h-4 w-4" />
              <span>Simpan Peluang</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
