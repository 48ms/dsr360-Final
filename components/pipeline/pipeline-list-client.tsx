"use client";

import { useState } from "react";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils/format";
import { OpportunityCard, type OpportunityItem } from "@/components/pipeline/opportunity-card";
import { OPPORTUNITY_STAGES } from "@/constants/enums";
import { Plus, Target, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { useRouter } from "next/navigation";

export function PipelineListClient({
  initialOpportunities,
  totalValue,
  stageStats,
}: {
  initialOpportunities: OpportunityItem[];
  totalValue: number;
  stageStats: Record<string, { count: number; value: number }>;
}) {
  const router = useRouter();
  const [selectedStage, setSelectedStage] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filteredOpportunities = initialOpportunities.filter((opp) => {
    // Search match
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const oppName = opp.opportunity_name.toLowerCase();
      const custName = opp.customer?.customer_name.toLowerCase() ?? "";
      const prodName = opp.product?.product_name.toLowerCase() ?? "";
      if (!oppName.includes(q) && !custName.includes(q) && !prodName.includes(q)) {
        return false;
      }
    }

    // Stage filter
    if (selectedStage !== "ALL") {
      return opp.stage === selectedStage;
    }
    return true;
  });

  const wonValue = stageStats["WON"]?.value ?? 0;
  const activeDealsCount = initialOpportunities.filter((o) => o.stage !== "LOST" && o.stage !== "WON").length;

  return (
    <div className="p-4 sm:p-6 max-w-3xl mx-auto space-y-5">
      {/* Top Header & Summary Card */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-neutral-900 tracking-tight">Sales Pipeline</h1>
          <p className="text-xs text-neutral-500 mt-0.5">Tracking deal pelumas dari prospek hingga closing</p>
        </div>

        <Link
          href="/pipeline/new"
          className="inline-flex items-center gap-1.5 rounded-xl bg-neutral-900 px-3.5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-neutral-800 transition"
        >
          <Plus className="h-4 w-4" />
          <span>Tambah Deal</span>
        </Link>
      </div>

      {/* Hero Pipeline Value Bar */}
      <div className="rounded-2xl bg-linear-to-br from-neutral-900 to-neutral-800 p-5 text-white shadow-md space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs uppercase tracking-wider text-neutral-400 font-semibold flex items-center gap-1.5">
            <TrendingUp className="h-4 w-4 text-amber-400" />
            Total Potensi Pipeline
          </span>
          <span className="rounded-full bg-neutral-700/80 px-2.5 py-0.5 text-[11px] font-bold text-amber-300 border border-neutral-600">
            {activeDealsCount} Deal Aktif
          </span>
        </div>

        <div className="text-3xl font-black text-white tracking-tight">
          {formatCurrency(totalValue)}
        </div>

        <div className="flex items-center justify-between text-xs text-neutral-400 pt-2 border-t border-neutral-700">
          <span>Won Closed: <strong className="text-emerald-400 font-bold">{formatCurrency(wonValue)}</strong></span>
          <span>{initialOpportunities.length} Total Rekam Deal</span>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Cari nama deal, customer, atau produk Shell..."
          className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-xs text-neutral-900 shadow-xs focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none"
        />
      </div>

      {/* Stage Selector Pills (Horizontal scrollable) */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        <button
          type="button"
          onClick={() => setSelectedStage("ALL")}
          className={cn(
            "rounded-xl px-3 py-2 text-xs font-semibold shrink-0 transition cursor-pointer border",
            selectedStage === "ALL"
              ? "bg-neutral-900 text-white border-neutral-900 shadow-xs"
              : "bg-white text-neutral-600 border-neutral-200 hover:bg-neutral-50"
          )}
        >
          Semua ({initialOpportunities.length})
        </button>

        {OPPORTUNITY_STAGES.map((s) => {
          const count = stageStats[s]?.count ?? 0;
          return (
            <button
              type="button"
              key={s}
              onClick={() => setSelectedStage(s)}
              className={cn(
                "rounded-xl px-3 py-2 text-xs font-semibold shrink-0 transition cursor-pointer border flex items-center gap-1.5",
                selectedStage === s
                  ? "bg-amber-500 text-white border-amber-500 shadow-xs"
                  : "bg-white text-neutral-600 border-neutral-200 hover:bg-neutral-50"
              )}
            >
              <span>{s}</span>
              <span className="rounded-full bg-black/10 px-1.5 py-0.2 text-[10px] font-bold">
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Opportunity Cards List */}
      {filteredOpportunities.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-neutral-200 bg-white p-8 text-center">
          <Target className="mx-auto h-10 w-10 text-neutral-300 mb-3" />
          <h3 className="text-sm font-semibold text-neutral-800">
            {selectedStage !== "ALL"
              ? `Belum ada deal di tahap ${selectedStage}`
              : "Belum ada pipeline opportunity"}
          </h3>
          <p className="mt-1 text-xs text-neutral-500 max-w-sm mx-auto">
            Catat peluang penjualan baru dari hasil kunjungan sales atau buat manual di sini.
          </p>
          <div className="mt-5">
            <Link
              href="/pipeline/new"
              className="inline-flex items-center gap-1.5 rounded-xl bg-neutral-900 px-4 py-2 text-xs font-medium text-white shadow-xs hover:bg-neutral-800 transition"
            >
              <Plus className="h-3.5 w-3.5" />
              Buat Opportunity Baru
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredOpportunities.map((opp) => (
            <OpportunityCard
              key={opp.id}
              opp={opp}
              onStageChanged={() => router.refresh()}
            />
          ))}
        </div>
      )}
    </div>
  );
}
