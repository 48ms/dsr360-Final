"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { formatCurrency, formatVolume, formatDate } from "@/lib/utils/format";
import { updateOpportunityStage } from "@/actions/opportunities";
import { type OpportunityStage, type Priority } from "@/constants/enums";
import { PriorityBadge } from "@/components/customers/status-badge";
import {
  ArrowLeft,
  CheckCircle2,
  Flame,
  Loader2,
  MapPin,
  MessageCircle,
  Phone,
  ShieldAlert,
  TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

export type OpportunityDetailData = {
  opportunity: {
    id: string;
    opportunity_name: string;
    stage: OpportunityStage;
    status: string;
    potential_volume: number | null;
    potential_value: number | null;
    probability: number | null;
    expected_close_date: string | null;
    customer_need: string | null;
    objection: string | null;
    next_action: string | null;
    next_action_date: string | null;
    created_at: string;
    updated_at: string;
  };
  customer: {
    id: string;
    customer_name: string;
    customer_code: string;
    segment: string;
    priority: Priority;
    city: string | null;
    address: string | null;
    contacts?: Array<{
      id: string;
      name: string;
      position: string | null;
      phone: string | null;
      is_primary: boolean;
    }> | null;
  } | null;
  product: {
    id: string;
    brand: string;
    product_name: string;
    category: string | null;
    viscosity: string | null;
  } | null;
  competitor: {
    id: string;
    brand: string;
    product_name: string | null;
  } | null;
  visit: {
    id: string;
    visit_date: string;
    visit_type: string;
    purpose: string | null;
  } | null;
  followUps: Array<{
    id: string;
    activity_type: string;
    description: string;
    due_date: string;
    priority: string;
    status: string;
    completed_at: string | null;
    result: string | null;
  }>;
};

const STAGE_ORDER: OpportunityStage[] = [
  "PROSPECT",
  "QUALIFIED",
  "PRESENTATION",
  "TRIAL",
  "QUOTATION",
  "NEGOTIATION",
  "WON",
  "LOST",
];

const STAGE_LABELS: Record<OpportunityStage, string> = {
  PROSPECT: "1. Prospek Awal",
  QUALIFIED: "2. Kualifikasi",
  PRESENTATION: "3. Presentasi TCO",
  TRIAL: "4. Uji Coba (Trial)",
  QUOTATION: "5. Penawaran Harga",
  NEGOTIATION: "6. Negosiasi",
  WON: "🏆 Deal Won",
  LOST: "❌ Deal Lost",
};

export function OpportunityDetailClient({ data }: { data: OpportunityDetailData }) {
  const { opportunity, customer, product, competitor, visit, followUps } = data;
  const [currentStage, setCurrentStage] = useState<OpportunityStage>(opportunity.stage);
  const [isPending, startTransition] = useTransition();
  const [notes] = useState<string>(opportunity.objection ?? "");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  function handleStageChange(newStage: OpportunityStage) {
    setErrorMsg(null);
    setSuccessMsg(null);
    setCurrentStage(newStage);

    startTransition(async () => {
      const res = await updateOpportunityStage({
        opportunity_id: opportunity.id,
        stage: newStage,
        notes: notes || undefined,
      });

      if (res?.error) {
        setErrorMsg(res.error);
        setCurrentStage(opportunity.stage);
      } else {
        setSuccessMsg(`Tahapan deal berhasil diubah ke ${newStage}`);
        setTimeout(() => setSuccessMsg(null), 3000);
      }
    });
  }

  const isWon = currentStage === "WON";
  const isLost = currentStage === "LOST";

  const primaryContact = customer?.contacts?.find((c) => c.is_primary) || customer?.contacts?.[0];
  const cleanPhone = (primaryContact?.phone || "").replace(/[^0-9]/g, "");
  const waUrl = cleanPhone
    ? `https://wa.me/${cleanPhone.startsWith("0") ? "62" + cleanPhone.slice(1) : cleanPhone}`
    : null;

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6 space-y-5">
      {/* Top Header */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link
            href="/pipeline"
            className="rounded-xl border border-neutral-200 bg-white p-2 text-neutral-600 hover:bg-neutral-50 transition"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-lg font-bold text-neutral-900 line-clamp-1">
                {opportunity.opportunity_name}
              </h1>
            </div>
            <p className="text-xs text-neutral-500">
              Dibuat: {formatDate(opportunity.created_at)} &bull; Update: {formatDate(opportunity.updated_at)}
            </p>
          </div>
        </div>

        <span
          className={cn(
            "rounded-xl px-3 py-1 text-xs font-bold shrink-0 border",
            isWon
              ? "bg-emerald-100 text-emerald-800 border-emerald-300"
              : isLost
              ? "bg-red-100 text-red-800 border-red-300"
              : "bg-amber-100 text-amber-900 border-amber-300"
          )}
        >
          {currentStage}
        </span>
      </div>

      {errorMsg && (
        <div className="flex items-center gap-2 rounded-xl bg-red-50 p-3 text-xs text-red-700 border border-red-200">
          <ShieldAlert className="h-4 w-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="flex items-center gap-2 rounded-xl bg-emerald-50 p-3 text-xs text-emerald-800 border border-emerald-200">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Stage Progression Stepper */}
      <div className="rounded-2xl border border-neutral-200 bg-white p-4 sm:p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-neutral-700">
            Tahapan Sales Pipeline
          </span>
          {isPending && (
            <span className="text-xs font-medium text-amber-600 flex items-center gap-1">
              <Loader2 className="h-3 w-3 animate-spin" /> Menyimpan status...
            </span>
          )}
        </div>

        {/* Quick select buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
          {STAGE_ORDER.map((stg) => {
            const isActive = currentStage === stg;
            const isWinner = stg === "WON";
            const isLoser = stg === "LOST";

            return (
              <button
                type="button"
                key={stg}
                disabled={isPending}
                onClick={() => handleStageChange(stg)}
                className={cn(
                  "rounded-xl px-2.5 py-2 text-xs font-semibold transition text-left cursor-pointer border",
                  isActive
                    ? isWinner
                      ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                      : isLoser
                      ? "bg-red-600 text-white border-red-600 shadow-xs"
                      : "bg-neutral-900 text-white border-neutral-900 shadow-xs"
                    : isWinner
                    ? "bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100"
                    : isLoser
                    ? "bg-red-50 text-red-800 border-red-200 hover:bg-red-100"
                    : "bg-neutral-50 text-neutral-700 border-neutral-200 hover:bg-neutral-100"
                )}
              >
                <div className="text-[11px] truncate">{STAGE_LABELS[stg]}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Value & Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-2xl border border-neutral-200 bg-white p-3.5 shadow-xs">
          <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider block">
            Nilai Estimasi
          </span>
          <span className="text-sm font-extrabold text-emerald-700 mt-1 block">
            {opportunity.potential_value ? formatCurrency(opportunity.potential_value) : "Rp -"}
          </span>
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-white p-3.5 shadow-xs">
          <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider block">
            Potensi Volume
          </span>
          <span className="text-sm font-extrabold text-neutral-900 mt-1 block">
            {opportunity.potential_volume ? formatVolume(opportunity.potential_volume) : "-"}
          </span>
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-white p-3.5 shadow-xs">
          <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider block">
            Peluang Close
          </span>
          <span className="text-sm font-extrabold text-amber-700 mt-1 block">
            {opportunity.probability ?? 30}%
          </span>
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-white p-3.5 shadow-xs">
          <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider block">
            Target Closing
          </span>
          <span className="text-xs font-bold text-neutral-800 mt-1.5 block">
            {opportunity.expected_close_date ? formatDate(opportunity.expected_close_date) : "Belum ditentukan"}
          </span>
        </div>
      </div>

      {/* Customer Info Card */}
      {customer && (
        <div className="rounded-2xl border border-neutral-200 bg-white p-4 sm:p-5 shadow-xs space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                Customer Terkait
              </span>
              <Link
                href={`/customers/${customer.id}`}
                className="text-base font-bold text-neutral-900 hover:text-amber-600 transition block mt-0.5"
              >
                {customer.customer_name}
              </Link>
              <p className="text-xs text-neutral-500 mt-0.5">
                {customer.customer_code} &bull; {customer.segment} &bull; {customer.city ?? "Tanpa Kota"}
              </p>
            </div>
            <PriorityBadge priority={customer.priority} />
          </div>

          {customer.address && (
            <div className="flex items-center gap-1.5 text-xs text-neutral-600 pt-2 border-t border-neutral-100">
              <MapPin className="h-3.5 w-3.5 text-neutral-400 shrink-0" />
              <span>{customer.address}, {customer.city}</span>
            </div>
          )}

          {primaryContact && (
            <div className="flex items-center justify-between pt-2 border-t border-neutral-100 flex-wrap gap-2">
              <div className="text-xs">
                <span className="font-semibold text-neutral-800">
                  👤 PIC: {primaryContact.name}
                  {primaryContact.position ? ` (${primaryContact.position})` : ""}
                </span>
                {primaryContact.phone && (
                  <span className="text-neutral-500 block text-[11px] mt-0.5">
                    {primaryContact.phone}
                  </span>
                )}
              </div>

              {primaryContact.phone && (
                <div className="flex items-center gap-1.5">
                  {waUrl && (
                    <a
                      href={waUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white shadow-2xs hover:bg-emerald-700 transition"
                    >
                      <MessageCircle className="h-3.5 w-3.5" />
                      <span>WhatsApp</span>
                    </a>
                  )}
                  <a
                    href={`tel:${primaryContact.phone}`}
                    className="inline-flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-bold text-white shadow-2xs hover:bg-blue-700 transition"
                  >
                    <Phone className="h-3.5 w-3.5" />
                    <span>Call</span>
                  </a>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Product & Competitor Displacement */}
      <div className="rounded-2xl border border-neutral-200 bg-white p-4 sm:p-5 shadow-xs space-y-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-neutral-700 block">
          Analisis Produk & Kompetitor
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="rounded-xl bg-amber-50/50 p-3.5 border border-amber-200/70 space-y-1">
            <span className="text-[10px] font-bold uppercase text-amber-800 block">
              🛢️ Target Produk Shell
            </span>
            <p className="font-bold text-neutral-900 text-sm">
              {product ? `${product.brand} ${product.product_name}` : "Pelumas Shell"}
            </p>
            <p className="text-neutral-600 text-[11px]">
              {product?.viscosity ? `Viskositas: ${product.viscosity}` : ""}
              {product?.category ? ` · Kategori: ${product.category}` : ""}
            </p>
          </div>

          <div className="rounded-xl bg-neutral-50 p-3.5 border border-neutral-200 space-y-1">
            <span className="text-[10px] font-bold uppercase text-neutral-500 block">
              ⚔️ Kompetitor yang Digeser
            </span>
            <p className="font-bold text-neutral-900 text-sm">
              {competitor ? `${competitor.brand} ${competitor.product_name ?? ""}` : "Tidak ada kompetitor / Prospek baru"}
            </p>
            <p className="text-neutral-500 text-[11px]">Existing supplier oli customer</p>
          </div>
        </div>

        {opportunity.customer_need && (
          <div className="rounded-xl bg-neutral-50 p-3 text-xs border border-neutral-100">
            <span className="font-bold text-neutral-700 text-[11px] block">Kebutuhan & Alasan Customer:</span>
            <p className="text-neutral-800 mt-0.5 leading-relaxed">{opportunity.customer_need}</p>
          </div>
        )}

        {opportunity.objection && (
          <div className="rounded-xl bg-red-50/60 p-3 text-xs border border-red-100">
            <span className="font-bold text-red-800 text-[11px] block">Objection / Hambatan Closing:</span>
            <p className="text-neutral-800 mt-0.5 leading-relaxed">{opportunity.objection}</p>
          </div>
        )}
      </div>

      {/* Next Action Commitment */}
      {opportunity.next_action && (
        <div className="rounded-2xl border-2 border-amber-400 bg-amber-50/40 p-4 sm:p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between pb-2 border-b border-amber-200 text-amber-950 font-bold text-xs uppercase tracking-wider">
            <div className="flex items-center gap-1.5">
              <TrendingUp className="h-4 w-4 text-amber-600" />
              <span>Komitmen Next Action</span>
            </div>
            {opportunity.next_action_date && (
              <span className="text-[11px] font-semibold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                Target: {formatDate(opportunity.next_action_date)}
              </span>
            )}
          </div>
          <p className="text-xs text-neutral-800 font-medium leading-relaxed">
            {opportunity.next_action}
          </p>
        </div>
      )}

      {/* Linked Follow-Ups */}
      {followUps.length > 0 && (
        <div className="rounded-2xl border border-neutral-200 bg-white p-4 sm:p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-900">
              <Flame className="h-4 w-4 text-amber-500" />
              <span>Daftar Tugas Follow-Up ({followUps.length})</span>
            </div>
            <Link
              href="/follow-ups"
              className="text-xs font-semibold text-amber-600 hover:text-amber-700"
            >
              Lihat Semua
            </Link>
          </div>

          <div className="space-y-2.5">
            {followUps.map((task) => (
              <div
                key={task.id}
                className="rounded-xl border border-neutral-200 bg-neutral-50/50 p-3 text-xs space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-neutral-900">{task.activity_type}</span>
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-[10px] font-bold",
                      task.status === "COMPLETED"
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-amber-100 text-amber-800"
                    )}
                  >
                    {task.status} &bull; Due {formatDate(task.due_date)}
                  </span>
                </div>
                <p className="text-neutral-700">{task.description}</p>
                {task.result && (
                  <p className="text-[11px] text-emerald-800 italic mt-1 bg-emerald-50 p-1.5 rounded-md">
                    Hasil: &ldquo;{task.result}&rdquo;
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Originating Visit */}
      {visit && (
        <div className="rounded-2xl border border-neutral-200 bg-white p-4 sm:p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-600">
              Kunjungan Lapangan Asal
            </span>
            <Link
              href={`/visits/${visit.id}`}
              className="text-xs font-semibold text-amber-600 hover:text-amber-700"
            >
              Buka Visit &rarr;
            </Link>
          </div>
          <p className="text-xs text-neutral-800">
            Visit pada <strong>{formatDate(visit.visit_date)}</strong> ({visit.visit_type})
            {visit.purpose ? ` &bull; ${visit.purpose}` : ""}
          </p>
        </div>
      )}
    </div>
  );
}
