"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { formatCurrency, formatDate } from "@/lib/utils/format";
import { updateOpportunityStage } from "@/actions/opportunities";
import { OPPORTUNITY_STAGES, type OpportunityStage } from "@/constants/enums";
import {
  MapPin,
  Calendar,
  TrendingUp,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

export type OpportunityItem = {
  id: string;
  opportunity_name: string;
  stage: OpportunityStage;
  status: string | null;
  potential_volume: number | null;
  potential_value: number | null;
  probability: number | null;
  expected_close_date: string | null;
  next_action: string | null;
  next_action_date: string | null;
  customer: {
    id: string;
    customer_name: string;
    customer_code: string;
    city: string | null;
    segment: string;
    priority: string;
  } | null;
  product: {
    id: string;
    brand: string;
    product_name: string;
    viscosity: string | null;
  } | null;
  competitor: {
    id: string;
    brand: string;
    product_name: string | null;
  } | null;
};

const STAGE_COLORS: Record<OpportunityStage, string> = {
  PROSPECT: "bg-blue-100 text-blue-800 border-blue-200",
  QUALIFIED: "bg-indigo-100 text-indigo-800 border-indigo-200",
  PRESENTATION: "bg-purple-100 text-purple-800 border-purple-200",
  TRIAL: "bg-amber-100 text-amber-800 border-amber-200",
  QUOTATION: "bg-orange-100 text-orange-800 border-orange-200",
  NEGOTIATION: "bg-yellow-100 text-yellow-800 border-yellow-200",
  WON: "bg-emerald-100 text-emerald-800 border-emerald-200 font-bold",
  LOST: "bg-red-100 text-red-800 border-red-200",
};

export function OpportunityCard({
  opp,
  onStageChanged,
}: {
  opp: OpportunityItem;
  onStageChanged?: () => void;
}) {
  const [isPending, startTransition] = useTransition();
  const [currentStage, setCurrentStage] = useState<OpportunityStage>(opp.stage);

  function handleStageChange(newStage: OpportunityStage) {
    setCurrentStage(newStage);
    startTransition(async () => {
      await updateOpportunityStage({
        opportunity_id: opp.id,
        stage: newStage,
      });
      if (onStageChanged) onStageChanged();
    });
  }

  const isWon = currentStage === "WON";
  const isLost = currentStage === "LOST";

  return (
    <div
      className={cn(
        "rounded-2xl border bg-white p-4 shadow-xs transition space-y-3",
        isWon ? "border-emerald-300 bg-emerald-50/20" : isLost ? "border-red-200 opacity-75" : "border-neutral-200"
      )}
    >
      {/* Top Header & Stage Dropdown */}
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <Link
            href={`/customers/${opp.customer?.id}`}
            className="text-xs font-semibold text-neutral-500 hover:text-amber-600 line-clamp-1"
          >
            {opp.customer?.customer_name ?? "Customer"}
          </Link>
          <Link
            href={`/pipeline/${opp.id}`}
            className="text-sm font-bold text-neutral-900 hover:text-amber-600 line-clamp-1 mt-0.5 block"
          >
            {opp.opportunity_name}
          </Link>
        </div>

        {/* Quick Stage Selector */}
        <div className="relative shrink-0">
          <select
            value={currentStage}
            aria-label="Ubah tahapan deal"
            onChange={(e) => handleStageChange(e.target.value as OpportunityStage)}
            disabled={isPending}
            className={cn(
              "rounded-xl border px-2.5 py-1 text-[11px] font-bold shadow-2xs outline-none cursor-pointer focus-visible:ring-2 focus-visible:ring-amber-500",
              STAGE_COLORS[currentStage]
            )}
          >
            {OPPORTUNITY_STAGES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          {isPending && (
            <Loader2 className="absolute right-1 top-2 h-3 w-3 animate-spin text-neutral-500" aria-hidden="true" />
          )}
        </div>
      </div>

      {/* Product & Volume Highlight */}
      <div className="rounded-xl bg-neutral-50 p-3 text-xs space-y-1.5 border border-neutral-100">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-neutral-800">
            🛢️ {opp.product ? `${opp.product.brand} ${opp.product.product_name}` : "Pelumas Shell"}
          </span>
          {opp.potential_volume && (
            <span className="font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md text-[10px]">
              {opp.potential_volume} Liter
            </span>
          )}
        </div>

        <div className="flex items-center justify-between pt-1 border-t border-neutral-200/60">
          <span className="text-neutral-500 text-[11px]">Estimasi Nilai Deal:</span>
          <span className="text-xs font-extrabold text-emerald-700">
            {opp.potential_value ? formatCurrency(opp.potential_value) : "Belum diisi"}
          </span>
        </div>
      </div>

      {/* Metadata Row */}
      <div className="flex items-center justify-between text-xs text-neutral-500 pt-1">
        <div className="flex items-center gap-1.5">
          {opp.customer?.city && (
            <span className="flex items-center gap-0.5">
              <MapPin className="h-3 w-3 text-neutral-400" />
              {opp.customer.city}
            </span>
          )}
          {opp.competitor && (
            <span className="text-[10px] text-neutral-400 bg-neutral-100 px-1.5 py-0.5 rounded-sm">
              vs {opp.competitor.brand}
            </span>
          )}
        </div>

        {opp.expected_close_date && (
          <span className="flex items-center gap-1 text-[11px] text-neutral-600">
            <Calendar className="h-3 w-3 text-neutral-400" />
            Close: {formatDate(opp.expected_close_date)}
          </span>
        )}
      </div>

      {/* Next Action Tag */}
      {opp.next_action && (
        <div className="rounded-lg bg-amber-50/60 p-2 text-xs border border-amber-100 text-amber-900 flex items-start gap-1.5">
          <TrendingUp className="h-3.5 w-3.5 text-amber-600 shrink-0 mt-0.5" />
          <span className="line-clamp-1">
            <strong>Next Action:</strong> {opp.next_action}
            {opp.next_action_date ? ` (${formatDate(opp.next_action_date)})` : ""}
          </span>
        </div>
      )}
    </div>
  );
}
