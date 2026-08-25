"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { submitVisitLog } from "@/actions/visits";
import {
  OPPORTUNITY_STAGES,
  FOLLOW_UP_ACTIVITY_TYPES,
  FOLLOW_UP_PRIORITIES,
  PHOTO_TYPES,
  type CustomerResponse,
  type OpportunityStage,
  type FollowUpActivityType,
  type FollowUpPriority,
  type PhotoType,
} from "@/constants/enums";
import {
  ArrowLeft,
  CheckCircle2,
  Flame,
  Loader2,
  ShieldAlert,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { getTodayWIB } from "@/lib/utils/format";

type MasterProduct = {
  id: string;
  brand: string;
  product_name: string;
  category: string | null;
  viscosity: string | null;
  packaging: string | null;
  packaging_size: number | null;
};

type MasterCompetitor = {
  id: string;
  brand: string;
  product_name: string | null;
  category: string | null;
};

type VisitDetailData = {
  id: string;
  customer_id: string;
  start_time: string | null;
  visit_date: string;
  customer: {
    customer_name: string;
    customer_code: string;
    segment: string;
    city: string | null;
  } | null;
};

export function VisitLogForm({
  visit,
  masterProducts,
  competitors,
}: {
  visit: VisitDetailData;
  masterProducts: MasterProduct[];
  competitors: MasterCompetitor[];
}) {
  const [isPending, startTransition] = useTransition();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form State
  const [customerResponse, setCustomerResponse] = useState<CustomerResponse>("INTERESTED");
  const [discussion, setDiscussion] = useState<string>("");
  const [competitorId, setCompetitorId] = useState<string>("");
  const [technicalIssue, setTechnicalIssue] = useState<string>("");

  // Opportunity State
  const [hasOpportunity, setHasOpportunity] = useState<boolean>(false);
  const [opportunityName, setOpportunityName] = useState<string>("");
  const [productId, setProductId] = useState<string>(masterProducts[0]?.id ?? "");
  const [potentialVolume, setPotentialVolume] = useState<string>("");
  const [volumeUnit, setVolumeUnit] = useState<"LITER" | "DRUM" | "PAIL">("DRUM");
  const [potentialValue, setPotentialValue] = useState<string>("");
  const [opportunityStage, setOpportunityStage] = useState<OpportunityStage>("TRIAL");

  // Next Action (Mandatory)
  const hasNextAction = true;
  const [nextActionType, setNextActionType] = useState<FollowUpActivityType>("SEND_QUOTATION");
  const [nextActionDescription, setNextActionDescription] = useState<string>("Kirimkan penawaran harga & data sheet produk.");
  
  const [nextActionDueDate, setNextActionDueDate] = useState<string>(() => {
    const d = new Date(`${getTodayWIB()}T12:00:00Z`);
    d.setUTCDate(d.getUTCDate() + 1);
    return d.toISOString().split("T")[0];
  });
  const [nextActionPriority, setNextActionPriority] = useState<FollowUpPriority>("HIGH");

  // Photos State
  const [photos, setPhotos] = useState<
    Array<{ photo_url: string; photo_type: PhotoType; caption: string }>
  >([]);
  const [photoUrlInput, setPhotoUrlInput] = useState<string>("");
  const [photoTypeInput, setPhotoTypeInput] = useState<PhotoType>("WORKSHOP");
  const [photoCaptionInput, setPhotoCaptionInput] = useState<string>("");

  function handleAddPhoto() {
    if (!photoUrlInput.trim()) return;
    setPhotos((prev) => [
      ...prev,
      {
        photo_url: photoUrlInput.trim(),
        photo_type: photoTypeInput,
        caption: photoCaptionInput.trim(),
      },
    ]);
    setPhotoUrlInput("");
    setPhotoCaptionInput("");
  }

  function handleRemovePhoto(index: number) {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!discussion.trim()) {
      setErrorMsg("Catatan hasil diskusi lapangan wajib diisi.");
      return;
    }

    if (hasNextAction && (!nextActionDescription.trim() || !nextActionDueDate)) {
      setErrorMsg("Aktivitas Next Action dan batas tanggal wajib ditentukan.");
      return;
    }

    setErrorMsg(null);
    startTransition(async () => {
      // Calculate volume in liters if drum/pail
      let calculatedVolumeLiters: number | null = null;
      if (hasOpportunity && potentialVolume) {
        const num = parseFloat(potentialVolume);
        if (!isNaN(num)) {
          if (volumeUnit === "DRUM") calculatedVolumeLiters = num * 209;
          else if (volumeUnit === "PAIL") calculatedVolumeLiters = num * 20;
          else calculatedVolumeLiters = num;
        }
      }

      const res = await submitVisitLog({
        visit_id: visit.id,
        customer_response: customerResponse,
        discussion,
        competitor_id: competitorId || undefined,
        technical_issue: technicalIssue || undefined,

        opportunity_found: hasOpportunity,
        opportunity_name: opportunityName || (hasOpportunity ? `Peluang ${visit.customer?.customer_name}` : undefined),
        product_id: hasOpportunity && productId ? productId : undefined,
        potential_volume: calculatedVolumeLiters,
        potential_value: hasOpportunity && potentialValue ? parseFloat(potentialValue) : undefined,
        opportunity_stage: hasOpportunity ? opportunityStage : undefined,

        has_next_action: hasNextAction,
        next_action_type: nextActionType,
        next_action_description: nextActionDescription,
        next_action_due_date: nextActionDueDate,
        next_action_priority: nextActionPriority,

        photos: photos.length > 0 ? photos : undefined,
        end_time: new Date().toISOString(),
      });

      if (res?.error) {
        setErrorMsg(res.error);
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto p-4 sm:p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          href={`/visits/${visit.id}/start`}
          className="rounded-xl border border-neutral-200 bg-white p-2 text-neutral-600 hover:bg-neutral-50 transition"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-lg font-bold text-neutral-900">Form Log Hasil Kunjungan</h1>
          <p className="text-xs text-neutral-500">
            {visit.customer?.customer_name} &bull; {visit.visit_date}
          </p>
        </div>
      </div>

      {errorMsg && (
        <div className="flex items-center gap-2 rounded-xl bg-red-50 p-3 text-xs text-red-700 border border-red-200">
          <ShieldAlert className="h-4 w-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* 1. Customer Response */}
      <div className="rounded-2xl border border-neutral-200 bg-white p-4 sm:p-5 shadow-xs space-y-3">
        <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-600">
          1. Respon & Minat Customer *
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {(
            [
              { value: "INTERESTED" as const, label: "🟢 Tertarik", bg: "hover:border-emerald-300 active:bg-emerald-50" },
              { value: "CONSIDERING" as const, label: "🟡 Pikir-Pikir", bg: "hover:border-amber-300 active:bg-amber-50" },
              { value: "NEUTRAL" as const, label: "⚪ Netral / Ragu", bg: "hover:border-neutral-400 active:bg-neutral-100" },
              { value: "NOT_INTERESTED" as const, label: "🔴 Belum Minat", bg: "hover:border-red-300 active:bg-red-50" },
            ]
          ).map((item) => (
            <button
              type="button"
              key={item.value}
              onClick={() => setCustomerResponse(item.value)}
              className={cn(
                "rounded-xl border p-2.5 text-xs font-semibold transition text-center cursor-pointer",
                customerResponse === item.value
                  ? "border-amber-500 bg-amber-50 text-amber-900 shadow-xs ring-1 ring-amber-400"
                  : "border-neutral-200 bg-white text-neutral-700",
                item.bg
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Discussion & Technical Notes */}
      <div className="rounded-2xl border border-neutral-200 bg-white p-4 sm:p-5 shadow-xs space-y-3">
        <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-600">
          2. Catatan Pembahasan Lapangan *
        </label>

        <div>
          <label className="block text-[11px] font-medium text-neutral-600 mb-1">
            Ringkasan Diskusi & Komitmen Customer *
          </label>
          <textarea
            rows={4}
            value={discussion}
            onChange={(e) => setDiscussion(e.target.value)}
            placeholder="Contoh: Bertemu Bpk. Hendra (Maintenance Head). Membahas oli genset 500kVA sering panas. Merekomendasikan Shell Rimula R4 X 15W-40. Customer minta sample & penawaran harga..."
            className="w-full rounded-xl border border-neutral-300 bg-white p-3 text-xs text-neutral-900 shadow-xs focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <div>
            <label className="block text-[11px] font-medium text-neutral-600 mb-1">
              Kompetitor yang Digeser (Opsional)
            </label>
            <select
              value={competitorId}
              onChange={(e) => setCompetitorId(e.target.value)}
              className="w-full rounded-xl border border-neutral-300 bg-white px-3 py-2 text-xs text-neutral-900"
            >
              <option value="">-- Tidak ada / Belum Tahu --</option>
              {competitors.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.brand} {c.product_name ? `(${c.product_name})` : ""}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-neutral-600 mb-1">
              Isu Teknikal / Trouble Mesin (Opsional)
            </label>
            <input
              type="text"
              value={technicalIssue}
              onChange={(e) => setTechnicalIssue(e.target.value)}
              placeholder="Misal: Sludge pada filter oli hidrolik"
              className="w-full rounded-xl border border-neutral-300 bg-white px-3 py-2 text-xs text-neutral-900"
            />
          </div>
        </div>
      </div>

      {/* 3. Opportunity Deal Toggle */}
      <div className="rounded-2xl border border-neutral-200 bg-white p-4 sm:p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-800">
              3. Peluang Penjualan (Pipeline Opportunity)
            </label>
            <p className="text-[11px] text-neutral-500">
              Apakah visit ini menghasilkan peluang order / trial baru?
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setHasOpportunity(!hasOpportunity)}
              className={cn(
                "rounded-xl px-3 py-1.5 text-xs font-semibold transition cursor-pointer",
                hasOpportunity
                  ? "bg-amber-500 text-white shadow-xs"
                  : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
              )}
            >
              {hasOpportunity ? "🔥 Ada Peluang" : "○ Belum Ada"}
            </button>
          </div>
        </div>

        {hasOpportunity && (
          <div className="space-y-3 rounded-xl bg-amber-50/40 p-4 border border-amber-200/60 pt-3">
            <div>
              <label className="block text-[11px] font-medium text-neutral-800 mb-1">
                Nama Peluang / Kebutuhan
              </label>
              <input
                type="text"
                value={opportunityName}
                onChange={(e) => setOpportunityName(e.target.value)}
                placeholder={`Misal: Trial Rimula Armada ${visit.customer?.customer_name ?? ""}`}
                className="w-full rounded-xl border border-neutral-300 bg-white px-3 py-2 text-xs text-neutral-900"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-neutral-800 mb-1">
                  Produk Shell yang Berpeluang *
                </label>
                <select
                  value={productId}
                  onChange={(e) => setProductId(e.target.value)}
                  className="w-full rounded-xl border border-neutral-300 bg-white px-3 py-2 text-xs text-neutral-900"
                >
                  <option value="">-- Pilih Produk Shell --</option>
                  {masterProducts.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.brand} {p.product_name} ({p.viscosity ?? p.category ?? "Pelumas"})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-neutral-800 mb-1">
                  Tahap Penjualan (Pipeline Stage)
                </label>
                <select
                  value={opportunityStage}
                  onChange={(e) => setOpportunityStage(e.target.value as OpportunityStage)}
                  className="w-full rounded-xl border border-neutral-300 bg-white px-3 py-2 text-xs text-neutral-900"
                >
                  {OPPORTUNITY_STAGES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-neutral-800 mb-1">
                  Estimasi Kebutuhan Volume
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    step="any"
                    value={potentialVolume}
                    onChange={(e) => setPotentialVolume(e.target.value)}
                    placeholder="Contoh: 5"
                    className="flex-1 rounded-xl border border-neutral-300 bg-white px-3 py-2 text-xs text-neutral-900"
                  />
                  <select
                    value={volumeUnit}
                    onChange={(e) => setVolumeUnit(e.target.value as "LITER" | "DRUM" | "PAIL")}
                    className="rounded-xl border border-neutral-300 bg-white px-3 py-2 text-xs font-semibold text-neutral-800"
                  >
                    <option value="DRUM">Drum (209L)</option>
                    <option value="PAIL">Pail (20L)</option>
                    <option value="LITER">Liter</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-neutral-800 mb-1">
                  Estimasi Nilai Deal (Rp)
                </label>
                <input
                  type="number"
                  value={potentialValue}
                  onChange={(e) => setPotentialValue(e.target.value)}
                  placeholder="Contoh: 45000000"
                  className="w-full rounded-xl border border-neutral-300 bg-white px-3 py-2 text-xs text-neutral-900"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 4. Photo Attachments */}
      <div className="rounded-2xl border border-neutral-200 bg-white p-4 sm:p-5 shadow-xs space-y-3">
        <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-600">
          4. Foto Bukti Lapangan (Storage / Nameplate / Workshop)
        </label>

        {photos.length > 0 && (
          <div className="grid grid-cols-2 gap-2 mb-3">
            {photos.map((p, idx) => (
              <div key={idx} className="relative rounded-xl border border-neutral-200 bg-neutral-50 p-2.5 text-xs flex justify-between items-start">
                <div className="min-w-0 pr-2">
                  <span className="font-bold text-[10px] text-neutral-600 bg-neutral-200 px-1.5 py-0.5 rounded-sm uppercase">
                    {p.photo_type}
                  </span>
                  <p className="text-neutral-800 mt-1 line-clamp-1 text-[11px] font-medium">
                    {p.caption || "Tanpa keterangan"}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemovePhoto(idx)}
                  className="text-red-500 hover:text-red-700 p-1"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="rounded-xl border border-neutral-200 p-3 bg-neutral-50/50 space-y-2">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <div className="sm:col-span-2">
              <input
                type="text"
                value={photoUrlInput}
                onChange={(e) => setPhotoUrlInput(e.target.value)}
                placeholder="Paste URL foto bukti / nameplate..."
                className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-1.5 text-xs"
              />
            </div>
            <select
              value={photoTypeInput}
              onChange={(e) => setPhotoTypeInput(e.target.value as PhotoType)}
              className="rounded-lg border border-neutral-300 bg-white px-2 py-1.5 text-xs"
            >
              {PHOTO_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={photoCaptionInput}
              onChange={(e) => setPhotoCaptionInput(e.target.value)}
              placeholder="Keterangan foto (misal: Nameplate genset Caterpillar)"
              className="flex-1 rounded-lg border border-neutral-300 bg-white px-3 py-1.5 text-xs"
            />
            <button
              type="button"
              onClick={handleAddPhoto}
              disabled={!photoUrlInput.trim()}
              className="rounded-lg bg-neutral-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-neutral-800 disabled:opacity-40"
            >
              + Tambah Foto
            </button>
          </div>
        </div>
      </div>

      {/* 5. 🚨 MANDATORY NEXT ACTION (Gerbang Wajib Follow-Up) */}
      <div className="rounded-2xl border-2 border-amber-400/80 bg-amber-50/30 p-4 sm:p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-amber-200">
          <div className="flex items-center gap-2">
            <Flame className="h-4 w-4 text-amber-600" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-950">
              5. Next Action (Wajib Ditentukan)
            </h3>
          </div>
          <span className="text-[11px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
            Auto-spawns Follow-Up Task
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-[11px] font-semibold text-neutral-800 mb-1">
              Bentuk Aksi *
            </label>
            <select
              value={nextActionType}
              onChange={(e) => setNextActionType(e.target.value as FollowUpActivityType)}
              className="w-full rounded-xl border border-amber-300 bg-white px-3 py-2 text-xs font-semibold text-neutral-900"
            >
              {FOLLOW_UP_ACTIVITY_TYPES.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-neutral-800 mb-1">
              Target Tanggal (Due Date) *
            </label>
            <input
              type="date"
              value={nextActionDueDate}
              onChange={(e) => setNextActionDueDate(e.target.value)}
              className="w-full rounded-xl border border-amber-300 bg-white px-3 py-2 text-xs font-semibold text-neutral-900"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-neutral-800 mb-1">
              Tingkat Urgensi
            </label>
            <select
              value={nextActionPriority}
              onChange={(e) => setNextActionPriority(e.target.value as FollowUpPriority)}
              className="w-full rounded-xl border border-amber-300 bg-white px-3 py-2 text-xs font-semibold text-neutral-900"
            >
              {FOLLOW_UP_PRIORITIES.map((p) => (
                <option key={p} value={p}>
                  {p === "HIGH" ? "🔥 High Priority" : p}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-neutral-800 mb-1">
            Detail Tindakan Lanjutan *
          </label>
          <input
            type="text"
            value={nextActionDescription}
            onChange={(e) => setNextActionDescription(e.target.value)}
            placeholder="Contoh: Kirim penawaran resmi Rimula R4 X 5 drum via WA & Email ke Pak Hendra"
            className="w-full rounded-xl border border-amber-300 bg-white px-3 py-2.5 text-xs text-neutral-900 shadow-xs focus:border-amber-600 focus:ring-2 focus:ring-amber-200 outline-none"
          />
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <Link
          href={`/visits/${visit.id}/start`}
          className="rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-xs font-medium text-neutral-600 hover:bg-neutral-50 transition"
        >
          Kembali
        </Link>
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-xs font-bold text-white shadow-md hover:bg-emerald-700 transition disabled:opacity-50 cursor-pointer"
        >
          {isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Menyimpan Log & Menyusun Follow-Up...</span>
            </>
          ) : (
            <>
              <CheckCircle2 className="h-4 w-4" />
              <span>🏁 SELESAIKAN & SIMPAN VISIT</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
