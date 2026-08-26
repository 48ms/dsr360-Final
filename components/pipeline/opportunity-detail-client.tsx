"use client";

import { useState, useTransition, useMemo } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { formatCurrency, formatVolume, formatDate } from "@/lib/utils/format";
import {
  updateOpportunityStage,
  updateOpportunity,
  deleteOpportunity,
  type getOpportunityDetail,
} from "@/actions/opportunities";
import { OPPORTUNITY_STAGES, type OpportunityStage } from "@/constants/enums";
import { PriorityBadge } from "@/components/customers/status-badge";
import { WhatsAppActionModal } from "@/components/whatsapp/whatsapp-action-modal";
import { CompetitorBattlecardModal } from "@/components/pipeline/competitor-battlecard-modal";
import {
  ProductCombobox,
  cleanProductName,
  parseProductDetails,
} from "@/components/pipeline/product-combobox";
import {
  OpportunityProductItemsEditor,
} from "@/components/pipeline/opportunity-product-items-editor";
import {
  parseOpportunityItems,
  serializeOpportunityItems,
  type OpportunityProductItem,
} from "@/lib/utils/opportunity-items";
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
  Pencil,
  Trash2,
  X,
  Save,
  Sparkles,
  Target,
  Package,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

export type OpportunityDetailData = NonNullable<Awaited<ReturnType<typeof getOpportunityDetail>>>;

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

export function OpportunityDetailClient({
  data,
  masterProducts = [],
  competitors = [],
  customers = [],
}: {
  data: OpportunityDetailData;
  masterProducts?: Array<{
    id: string;
    brand: string;
    product_name: string;
    category?: string | null;
    viscosity?: string | null;
    packaging?: string | null;
  }>;
  competitors?: Array<{ id: string; brand: string; product_name?: string | null }>;
  customers?: Array<{
    id: string;
    customer_name: string;
    customer_code?: string;
    city?: string | null;
    segment?: string;
  }>;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { opportunity, customer, product, competitor, visit, followUps } = data;

  const [currentStage, setCurrentStage] = useState<OpportunityStage>(opportunity.stage);
  const [isPending, startTransition] = useTransition();
  const [notes] = useState<string>(opportunity.objection ?? "");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // WhatsApp Action Modal State
  const [isWhatsAppOpen, setIsWhatsAppOpen] = useState<boolean>(false);

  // Competitor Battlecard Modal State
  const [isBattlecardOpen, setIsBattlecardOpen] = useState<boolean>(false);

  // Parse Initial Multi-Product Items from Opportunity
  const initialParsed = useMemo(() => {
    return parseOpportunityItems(
      opportunity.customer_need,
      opportunity.product_id,
      opportunity.potential_volume,
      opportunity.potential_value,
      masterProducts
    );
  }, [opportunity, masterProducts]);

  // Edit Modal State
  const [isEditOpen, setIsEditOpen] = useState<boolean>(searchParams.get("edit") === "true");
  const [editOpportunityName, setEditOpportunityName] = useState<string>(opportunity.opportunity_name);
  const [editCustomerId, setEditCustomerId] = useState<string>(opportunity.customer_id);
  const [editStage, setEditStage] = useState<OpportunityStage>(opportunity.stage);
  const [editProductItems, setEditProductItems] = useState<OpportunityProductItem[]>(initialParsed.items);
  const [editProbability, setEditProbability] = useState<number>(opportunity.probability ?? 30);
  const [editExpectedCloseDate, setEditExpectedCloseDate] = useState<string>(
    opportunity.expected_close_date ? opportunity.expected_close_date.split("T")[0] : ""
  );
  const [editCompetitorId, setEditCompetitorId] = useState<string>(opportunity.competitor_id ?? "");
  const [editCustomerNeed, setEditCustomerNeed] = useState<string>(initialParsed.cleanNotes);
  const [editObjection, setEditObjection] = useState<string>(opportunity.objection ?? "");
  const [editNextAction, setEditNextAction] = useState<string>(opportunity.next_action ?? "");
  const [editNextActionDate, setEditNextActionDate] = useState<string>(
    opportunity.next_action_date ? opportunity.next_action_date.split("T")[0] : ""
  );

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

  function handleSaveEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!editCustomerId) {
      setErrorMsg("Customer wajib dipilih.");
      return;
    }
    if (!editOpportunityName.trim()) {
      setErrorMsg("Nama peluang wajib diisi.");
      return;
    }

    setErrorMsg(null);
    startTransition(async () => {
      const { serializedNotes, totalVolumeLiters, totalValue, primaryProductId } =
        serializeOpportunityItems(editCustomerNeed, editProductItems);

      const res = await updateOpportunity(opportunity.id, {
        customer_id: editCustomerId,
        opportunity_name: editOpportunityName.trim(),
        product_id: primaryProductId,
        stage: editStage,
        potential_volume: totalVolumeLiters > 0 ? totalVolumeLiters : null,
        potential_value: totalValue > 0 ? totalValue : null,
        probability: editProbability,
        expected_close_date: editExpectedCloseDate || undefined,
        competitor_id: editCompetitorId ? editCompetitorId : null,
        customer_need: serializedNotes.trim() || undefined,
        objection: editObjection.trim() || undefined,
        next_action: editNextAction.trim() || undefined,
        next_action_date: editNextActionDate || undefined,
      });

      if (res?.error) {
        setErrorMsg(res.error);
      } else {
        setIsEditOpen(false);
        setCurrentStage(editStage);
        setSuccessMsg("Perubahan opportunity berhasil disimpan!");
        router.refresh();
        setTimeout(() => setSuccessMsg(null), 3500);
      }
    });
  }

  function handleDeleteOpportunity() {
    const ok = window.confirm(
      "Apakah Anda yakin ingin menghapus opportunity deal ini? Tindakan ini tidak dapat dibatalkan."
    );
    if (!ok) return;

    setErrorMsg(null);
    startTransition(async () => {
      const res = await deleteOpportunity(opportunity.id);
      if (res?.error) {
        setErrorMsg(res.error);
      } else {
        router.push("/pipeline");
      }
    });
  }

  const isWon = currentStage === "WON";
  const isLost = currentStage === "LOST";

  const primaryContact = customer?.contacts?.find((c) => c.is_primary) || customer?.contacts?.[0];

  // List of active products offered in this deal
  const displayedItems = initialParsed.items.filter((it) => !!it.productId);

  const productNamesSummary = displayedItems.length > 0
    ? displayedItems
        .map((it) => {
          const prod = masterProducts.find((p) => p.id === it.productId);
          return prod ? `${cleanProductName(prod.brand, prod.product_name)} (${it.qty} ${it.unit})` : "";
        })
        .filter(Boolean)
        .join(", ")
    : product
    ? cleanProductName(product.brand, product.product_name)
    : "Pelumas Shell";

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6 space-y-5">
      {/* Top Header */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link
            href="/pipeline"
            className="rounded-xl border border-neutral-200 bg-white p-2 text-neutral-600 hover:bg-neutral-50 transition shadow-2xs"
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

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsEditOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-amber-300 bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-900 shadow-2xs hover:bg-amber-100 transition cursor-pointer"
          >
            <Pencil className="h-3.5 w-3.5" />
            <span>Edit Deal</span>
          </button>

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

      {/* 🎉 CELEBRATORY DEAL WON MILESTONE CARD (IMPECCABLE DELIGHT) */}
      {isWon && (
        <div className="rounded-3xl border border-emerald-300 bg-gradient-to-br from-emerald-500/15 via-emerald-50/60 to-white p-5 shadow-xs space-y-3 animate-fade-in-up">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500 text-white text-xl shadow-xs">
                🏆
              </div>
              <div>
                <h2 className="text-sm font-black text-emerald-950 flex items-center gap-1.5">
                  <span>DEAL WON BERHASIL DITUTUP!</span>
                  <span className="rounded-full bg-emerald-200/80 px-2 py-0.2 text-[10px] font-black text-emerald-900 border border-emerald-400">
                    +{(opportunity.potential_volume || 0).toLocaleString("id-ID")} L
                  </span>
                </h2>
                <p className="text-xs text-emerald-800 font-medium">
                  Selamat, Bro! Volume deal ini otomatis dihitung ke target kuota bulanan lo di Dashboard.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-emerald-200/80 text-xs">
            <div className="bg-white/90 p-2.5 rounded-xl border border-emerald-200">
              <span className="text-[10px] font-bold text-neutral-500 block uppercase">Status Pelanggan</span>
              <span className="font-extrabold text-emerald-800 flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                <span>Otomatis Upgrade ke ACTIVE</span>
              </span>
            </div>
            <div className="bg-white/90 p-2.5 rounded-xl border border-emerald-200">
              <span className="text-[10px] font-bold text-neutral-500 block uppercase">Tugas Follow-Up</span>
              <span className="font-extrabold text-emerald-800 flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                <span>Semua Task Auto-Resolved</span>
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Value & Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-3xl border border-[#EAE4D9] bg-white p-4 shadow-xs">
          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
            Nilai Estimasi
          </span>
          <span className="text-sm font-black text-emerald-700 mt-1 block">
            {opportunity.potential_value ? formatCurrency(opportunity.potential_value) : "Rp -"}
          </span>
        </div>

        <div className="rounded-3xl border border-[#EAE4D9] bg-white p-4 shadow-xs">
          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
            Potensi Volume
          </span>
          <span className="text-sm font-black text-neutral-900 mt-1 block">
            {opportunity.potential_volume ? formatVolume(opportunity.potential_volume) : "-"}
          </span>
        </div>

        <div className="rounded-3xl border border-[#EAE4D9] bg-white p-4 shadow-xs">
          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
            Peluang Close
          </span>
          <span className="text-sm font-black text-amber-700 mt-1 block">
            {opportunity.probability ?? 30}%
          </span>
        </div>

        <div className="rounded-3xl border border-[#EAE4D9] bg-white p-4 shadow-xs">
          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
            Target Closing
          </span>
          <span className="text-xs font-black text-neutral-800 mt-1.5 block">
            {opportunity.expected_close_date ? formatDate(opportunity.expected_close_date) : "Belum ditentukan"}
          </span>
        </div>
      </div>

      {/* Customer Info Card */}
      {customer && (
        <div className="rounded-3xl border border-[#EAE4D9] bg-white p-4 sm:p-5 shadow-xs space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                Customer Terkait
              </span>
              <Link
                href={`/customers/${customer.id}`}
                className="text-base font-black text-neutral-900 hover:text-amber-600 transition block mt-0.5"
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
                  <button
                    type="button"
                    onClick={() => setIsWhatsAppOpen(true)}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white shadow-2xs hover:bg-emerald-700 transition cursor-pointer"
                  >
                    <MessageCircle className="h-3.5 w-3.5" />
                    <span>WhatsApp</span>
                    <Sparkles className="h-3 w-3 text-amber-300 animate-pulse" />
                  </button>

                  <a
                    href={`tel:${primaryContact.phone}`}
                    className="inline-flex items-center gap-1 rounded-xl bg-blue-600 px-3 py-1.5 text-xs font-bold text-white shadow-2xs hover:bg-blue-700 transition"
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
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-neutral-700 block">
            Analisis Produk &amp; Kompetitor
          </span>
          <button
            type="button"
            onClick={() => setIsWhatsAppOpen(true)}
            className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 transition cursor-pointer"
          >
            <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
            <span>Draf WA AI</span>
          </button>
        </div>

        {/* Multi-Product Items Display */}
        <div className="space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 block">
            🛢️ Daftar Produk Shell Ditawarkan ({displayedItems.length > 0 ? displayedItems.length : 1} SKU)
          </span>

          {displayedItems.length > 0 ? (
            <div className="space-y-2">
              {displayedItems.map((it, idx) => {
                const prod = masterProducts.find((p) => p.id === it.productId) || (idx === 0 ? product : null);
                const parsed = prod ? parseProductDetails(prod.brand, prod.product_name) : null;

                return (
                  <div
                    key={it.id || idx}
                    className="rounded-xl bg-amber-50/60 p-3 border border-amber-200/70 flex items-center justify-between gap-3 flex-wrap"
                  >
                    <div className="min-w-0 flex-1 space-y-0.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-neutral-900 text-xs sm:text-sm">
                          {parsed ? parsed.cleanName : prod?.product_name || "Pelumas Shell"}
                        </span>
                        <span className="rounded-md bg-amber-200 text-amber-900 px-1.5 py-0.5 text-[10px] font-extrabold uppercase">
                          {it.qty} {it.unit}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-neutral-500 flex-wrap">
                        {parsed?.sku && (
                          <span className="bg-neutral-200/80 font-mono font-bold text-neutral-800 px-1 py-0.2 rounded text-[10px]">
                            SKU: {parsed.sku}
                          </span>
                        )}
                        {prod?.category && <span>{prod.category}</span>}
                        {prod?.viscosity && <span>&bull; Visk: {prod.viscosity}</span>}
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-xs font-extrabold text-emerald-800 block">
                        {it.subtotal ? formatCurrency(it.subtotal) : "-"}
                      </span>
                      {it.unitPrice > 0 && (
                        <span className="text-[10px] text-neutral-400 block">
                          @{formatCurrency(it.unitPrice)}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="rounded-xl bg-amber-50/50 p-3.5 border border-amber-200/70 space-y-1">
              <p className="font-bold text-neutral-900 text-sm">
                {product ? cleanProductName(product.brand, product.product_name) : "Pelumas Shell"}
              </p>
              <p className="text-neutral-600 text-[11px]">
                {product?.viscosity ? `Viskositas: ${product.viscosity}` : ""}
                {product?.category ? ` · Kategori: ${product.category}` : ""}
              </p>
            </div>
          )}
        </div>

        {/* Competitor Card */}
        <div className="rounded-xl bg-neutral-50 p-3.5 border border-neutral-200 space-y-2 text-xs">
          <div className="flex items-center justify-between flex-wrap gap-1">
            <span className="text-[10px] font-bold uppercase text-neutral-500 block">
              ⚔️ Kompetitor yang Digeser
            </span>
            {competitor && (
              <button
                type="button"
                onClick={() => setIsBattlecardOpen(true)}
                className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-900 bg-amber-100/90 px-2.5 py-1 rounded-lg hover:bg-amber-200 border border-amber-300 transition cursor-pointer shadow-2xs"
              >
                <span>⚔️ Senjata Lawan {competitor.brand}</span>
              </button>
            )}
          </div>
          <p className="font-bold text-neutral-900 text-sm">
            {competitor ? `${competitor.brand} ${competitor.product_name ?? ""}` : "Tidak ada kompetitor / Prospek baru"}
          </p>
          <p className="text-neutral-500 text-[11px]">Existing supplier oli customer</p>
        </div>

        {initialParsed.cleanNotes && (
          <div className="rounded-xl bg-neutral-50 p-3 text-xs border border-neutral-100">
            <span className="font-bold text-neutral-700 text-[11px] block">Kebutuhan &amp; Alasan Customer:</span>
            <p className="text-neutral-800 mt-0.5 leading-relaxed">{initialParsed.cleanNotes}</p>
          </div>
        )}

        {opportunity.objection && (
          <div className="rounded-xl bg-red-50/60 p-3 text-xs border border-red-100">
            <span className="font-bold text-red-800 text-[11px] block">Objection / Hambatan Closing:</span>
            <p className="text-neutral-800 mt-0.5 leading-relaxed">{opportunity.objection}</p>
          </div>
        )}

        {/* Suggestion banner to follow-up based on competitor */}
        <div className="rounded-xl bg-emerald-50/60 border border-emerald-200 p-3 flex items-center justify-between gap-2 flex-wrap">
          <div className="text-xs text-emerald-950">
            <span className="font-bold block">💡 Rekomendasi AI Follow-Up WhatsApp</span>
            <span className="text-[11px] text-emerald-800">
              Gunakan paket penawaran produk Shell di atas &amp; atasi objection secara taktis.
            </span>
          </div>
          <button
            type="button"
            onClick={() => setIsWhatsAppOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white shadow-2xs hover:bg-emerald-700 transition cursor-pointer"
          >
            <Sparkles className="h-3.5 w-3.5 text-amber-300" />
            <span>Generate Pesan WA AI</span>
          </button>
        </div>
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

      {/* ========================================================================= */}
      {/* WHATSAPP ACTION MODAL WITH MULTI-PRODUCT & COMPETITOR GROUNDING           */}
      {/* ========================================================================= */}
      {customer && (
        <WhatsAppActionModal
          isOpen={isWhatsAppOpen}
          onClose={() => setIsWhatsAppOpen(false)}
          customerName={customer.customer_name}
          customerId={customer.id}
          defaultPhone={primaryContact?.phone}
          contacts={(customer.contacts || [])
            .filter((c) => !!c.phone)
            .map((c) => ({
              name: c.name,
              phone: c.phone!,
              role: c.position || c.contact_type,
            }))}
          defaultTemplate="QUOTATION_FOLLOWUP"
          opportunityContext={{
            opportunityName: opportunity.opportunity_name,
            stage: currentStage,
            targetProduct: productNamesSummary,
            competitorBrand: competitor?.brand,
            competitorProduct: competitor?.product_name || undefined,
            customerNeed: initialParsed.cleanNotes || undefined,
            objection: opportunity.objection || undefined,
            potentialVolume: opportunity.potential_volume ? `${opportunity.potential_volume} L` : undefined,
            potentialValue: opportunity.potential_value ? formatCurrency(opportunity.potential_value) : undefined,
          }}
        />
      )}

      {/* Competitor Battlecard Modal */}
      {competitor && (
        <CompetitorBattlecardModal
          isOpen={isBattlecardOpen}
          onClose={() => setIsBattlecardOpen(false)}
          competitorBrand={competitor.brand}
          competitorProduct={competitor.product_name}
          shellProduct={productNamesSummary || "Shell Tellus / Rimula"}
        />
      )}

      {/* ========================================================================= */}
      {/* EDIT OPPORTUNITY MODAL WITH MULTI-PRODUCT SUPPORT                         */}
      {/* ========================================================================= */}
      {isEditOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/60 p-4 backdrop-blur-xs overflow-y-auto">
          <div className="w-full max-w-xl rounded-3xl bg-white p-5 sm:p-6 shadow-2xl border border-neutral-200 my-8 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <div className="flex items-center gap-2">
                <div className="rounded-xl bg-amber-100 p-2 text-amber-900">
                  <Pencil className="h-4 w-4" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-neutral-900">Edit Peluang Penjualan</h2>
                  <p className="text-[11px] text-neutral-500">Perbarui rincian deal, daftar produk, dan target closing.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsEditOpen(false)}
                className="rounded-xl p-1.5 text-neutral-400 hover:bg-neutral-100 transition cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              {/* Customer & Name */}
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-600 mb-1">
                    Customer *
                  </label>
                  <select
                    value={editCustomerId}
                    onChange={(e) => setEditCustomerId(e.target.value)}
                    className="w-full rounded-xl border border-neutral-200 bg-white px-3.5 py-2.5 text-xs text-neutral-900 outline-none focus:ring-2 focus:ring-amber-200"
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
                    value={editOpportunityName}
                    onChange={(e) => setEditOpportunityName(e.target.value)}
                    placeholder="Contoh: Pengadaan Shell Tellus Pabrik Tekstil"
                    className="w-full rounded-xl border border-neutral-200 bg-white px-3.5 py-2.5 text-xs text-neutral-900 outline-none focus:ring-2 focus:ring-amber-200"
                  />
                </div>
              </div>

              {/* Multi-Product Line Items Editor */}
              <OpportunityProductItemsEditor
                items={editProductItems}
                onChange={setEditProductItems}
                masterProducts={masterProducts}
              />

              {/* Stage & Expected Close Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-600 mb-1">
                    Tahap Penjualan (Stage)
                  </label>
                  <select
                    value={editStage}
                    onChange={(e) => setEditStage(e.target.value as OpportunityStage)}
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
                    value={editExpectedCloseDate}
                    onChange={(e) => setEditExpectedCloseDate(e.target.value)}
                    className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs text-neutral-900"
                  />
                </div>
              </div>

              {/* Probability & Competitor */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-600 mb-1">
                    Peluang Close (%): <span className="text-amber-700 font-bold">{editProbability}%</span>
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    step="5"
                    value={editProbability}
                    onChange={(e) => setEditProbability(parseInt(e.target.value, 10))}
                    className="w-full accent-amber-500 mt-2"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-600 mb-1">
                    Kompetitor yang Digeser
                  </label>
                  <select
                    value={editCompetitorId}
                    onChange={(e) => setEditCompetitorId(e.target.value)}
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

              {/* Customer Need & Objection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-600 mb-1">
                    Kebutuhan &amp; Alasan Customer
                  </label>
                  <textarea
                    rows={2}
                    value={editCustomerNeed}
                    onChange={(e) => setEditCustomerNeed(e.target.value)}
                    placeholder="Contoh: Oli mesin panas & butuh drain panjang"
                    className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs text-neutral-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-600 mb-1">
                    Objection / Hambatan
                  </label>
                  <textarea
                    rows={2}
                    value={editObjection}
                    onChange={(e) => setEditObjection(e.target.value)}
                    placeholder="Contoh: Harga kompetitor lebih murah 5%"
                    className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs text-neutral-900"
                  />
                </div>
              </div>

              {/* Next Action Commitment */}
              <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-3 space-y-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-amber-900 mb-1">
                      Komitmen Next Action
                    </label>
                    <input
                      type="text"
                      value={editNextAction}
                      onChange={(e) => setEditNextAction(e.target.value)}
                      placeholder="Contoh: Kirim SPH Terbaru untuk bulan depan"
                      className="w-full rounded-xl border border-amber-200 bg-white px-3 py-2 text-xs text-neutral-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-amber-900 mb-1">
                      Target Tanggal Action
                    </label>
                    <input
                      type="date"
                      value={editNextActionDate}
                      onChange={(e) => setEditNextActionDate(e.target.value)}
                      className="w-full rounded-xl border border-amber-200 bg-white px-3 py-2 text-xs text-neutral-900"
                    />
                  </div>
                </div>
              </div>

              {/* Modal Action Buttons */}
              <div className="flex items-center justify-between pt-3 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={handleDeleteOpportunity}
                  disabled={isPending}
                  className="inline-flex items-center gap-1 rounded-xl px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 transition cursor-pointer"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>Hapus Deal</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsEditOpen(false)}
                    disabled={isPending}
                    className="rounded-xl border border-neutral-200 bg-white px-4 py-2 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 transition cursor-pointer"
                  >
                    Batal
                  </button>

                  <button
                    type="submit"
                    disabled={isPending}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-amber-500 px-5 py-2 text-xs font-bold text-white shadow-xs hover:bg-amber-600 transition cursor-pointer disabled:opacity-50"
                  >
                    {isPending ? (
                      <>
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        <span>Menyimpan...</span>
                      </>
                    ) : (
                      <>
                        <Save className="h-3.5 w-3.5" />
                        <span>Simpan Perubahan</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
