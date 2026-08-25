"use client";

import { useState, useTransition, useEffect } from "react";
import Link from "next/link";
import { quickVisit } from "@/actions/visits";
import {
  FOLLOW_UP_ACTIVITY_TYPES,
  type VisitType,
  type CustomerResponse,
  type FollowUpActivityType,
  type FollowUpPriority,
} from "@/constants/enums";
import {
  ArrowLeft,
  Flame,
  Loader2,
  ShieldAlert,
  Zap,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { getTodayWIB } from "@/lib/utils/format";
import { AINoteParserModal } from "@/components/ai/ai-note-parser-modal";
import { ObjectionBattlecardsModal } from "@/components/ai/objection-battlecards-modal";
import { getObjectionBattlecards, type ObjectionBattlecard, type ParsedVisitNote } from "@/actions/ai";

type CustomerOption = {
  id: string;
  customer_name: string;
  customer_code: string;
  city: string | null;
  segment: string;
  priority: string;
};

type MasterProduct = {
  id: string;
  brand: string;
  product_name: string;
  category: string | null;
  viscosity: string | null;
};

export function QuickVisitForm({
  customers,
  masterProducts,
}: {
  customers: CustomerOption[];
  masterProducts: MasterProduct[];
}) {
  const [isPending, startTransition] = useTransition();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // AI Modal States
  const [showAIModal, setShowAIModal] = useState<boolean>(false);
  const [showBattlecards, setShowBattlecards] = useState<boolean>(false);
  const [battlecards, setBattlecards] = useState<ObjectionBattlecard[]>([]);

  useEffect(() => {
    getObjectionBattlecards().then(setBattlecards);
  }, []);

  // Form State
  const [customerId, setCustomerId] = useState<string>(customers[0]?.id ?? "");
  const visitType: VisitType = "ROUTINE";
  const [customerResponse, setCustomerResponse] = useState<CustomerResponse>("INTERESTED");
  const [discussion, setDiscussion] = useState<string>("");

  // Opportunity State
  const [hasOpportunity, setHasOpportunity] = useState<boolean>(false);
  const [productId, setProductId] = useState<string>(masterProducts[0]?.id ?? "");
  const [potentialVolume, setPotentialVolume] = useState<string>("");

  // Mandatory Next Action
  const [nextActionType, setNextActionType] = useState<FollowUpActivityType>("WHATSAPP");
  const [nextActionDescription, setNextActionDescription] = useState<string>(
    "Follow up hasil pertemuan lapangan"
  );

  const [nextActionDueDate, setNextActionDueDate] = useState<string>(() => {
    const d = new Date(`${getTodayWIB()}T12:00:00Z`);
    d.setUTCDate(d.getUTCDate() + 1);
    return d.toISOString().split("T")[0];
  });
  const nextActionPriority: FollowUpPriority = "HIGH";

  function handleApplyAI(parsed: ParsedVisitNote) {
    setCustomerResponse(parsed.customer_response);
    setDiscussion(
      (prev) => (prev ? prev + "\n\n" : "") + `[Catatan AI] ${parsed.next_action_description}`
    );

    if (parsed.opportunity_found) {
      setHasOpportunity(true);
      if (parsed.potential_volume_suggestion) {
        setPotentialVolume(parsed.potential_volume_suggestion.toString());
      }
    }

    setNextActionType(parsed.next_action_type);
    setNextActionDescription(parsed.next_action_description);

    const due = new Date();
    due.setDate(due.getDate() + (parsed.next_action_due_days || 1));
    setNextActionDueDate(due.toISOString().split("T")[0]);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!customerId) {
      setErrorMsg("Pilih customer terlebih dahulu.");
      return;
    }
    if (!discussion.trim()) {
      setErrorMsg("Catatan hasil diskusi singkat wajib diisi.");
      return;
    }
    if (!nextActionDescription.trim() || !nextActionDueDate) {
      setErrorMsg("Aksi follow-up selanjutnya wajib diisi.");
      return;
    }

    setErrorMsg(null);
    startTransition(async () => {
      const res = await quickVisit({
        customer_id: customerId,
        visit_type: visitType,
        purpose: "Quick Visit Lapangan",
        customer_response: customerResponse,
        discussion,
        opportunity_found: hasOpportunity,
        product_id: hasOpportunity && productId ? productId : undefined,
        potential_volume: (() => {
          if (!hasOpportunity || !potentialVolume) return undefined;
          const parsed = parseFloat(potentialVolume);
          return !isNaN(parsed) ? parsed * 209 : undefined;
        })(),
        next_action_type: nextActionType,
        next_action_description: nextActionDescription,
        next_action_due_date: nextActionDueDate,
        next_action_priority: nextActionPriority,
      });

      if (res?.error) {
        setErrorMsg(res.error);
      }
    });
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="max-w-xl mx-auto p-4 sm:p-6 space-y-5">
        {/* Header with AI Fast Action */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link
              href="/visits"
              className="rounded-xl border border-neutral-200 bg-white p-2 text-neutral-600 hover:bg-neutral-50 transition"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <div>
              <div className="flex items-center gap-1.5">
                <Zap className="h-4 w-4 text-amber-500 fill-current" />
                <h1 className="text-lg font-bold text-neutral-900">Quick Visit (1 Menit)</h1>
              </div>
              <p className="text-xs text-neutral-500">Log instan saat sedang sibuk di lapangan</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setShowBattlecards(true)}
              className="rounded-xl border border-amber-300 bg-amber-50 px-2.5 py-1.5 text-xs font-bold text-amber-900 shadow-2xs hover:bg-amber-100 transition flex items-center gap-1 cursor-pointer"
              title="Shell Objection Battlecards"
            >
              <ShieldCheck className="h-3.5 w-3.5 text-amber-600" />
              <span className="hidden sm:inline">Battlecards</span>
            </button>

            <button
              type="button"
              onClick={() => setShowAIModal(true)}
              className="rounded-xl bg-linear-to-r from-amber-500 to-amber-600 px-3 py-1.5 text-xs font-bold text-white shadow-2xs hover:from-amber-600 hover:to-amber-700 transition flex items-center gap-1 cursor-pointer"
            >
              <Sparkles className="h-3.5 w-3.5 fill-current" />
              <span>AI Fast Note</span>
            </button>
          </div>
        </div>

        {errorMsg && (
          <div className="flex items-center gap-2 rounded-xl bg-red-50 p-3 text-xs text-red-700 border border-red-200">
            <ShieldAlert className="h-4 w-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Customer Picker */}
        <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-xs space-y-2">
          <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-600">
            Customer Target *
          </label>
          <select
            value={customerId}
            onChange={(e) => setCustomerId(e.target.value)}
            className="w-full rounded-xl border border-neutral-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-neutral-900 shadow-xs focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none"
          >
            <option value="">-- Pilih Customer --</option>
            {customers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.customer_name} ({c.city ?? "Tanpa Kota"} &bull; {c.segment})
              </option>
            ))}
          </select>
        </div>

        {/* Response & Type Chips */}
        <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-xs space-y-3">
          <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-600">
            Respon Customer *
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
            {[
              { key: "INTERESTED", label: "🟢 Tertarik" },
              { key: "CONSIDERING", label: "🟡 Pikir-pikir" },
              { key: "NEUTRAL", label: "⚪ Netral" },
              { key: "NOT_INTERESTED", label: "🔴 Menolak" },
            ].map((item) => (
              <button
                type="button"
                key={item.key}
                onClick={() => setCustomerResponse(item.key as CustomerResponse)}
                className={cn(
                  "rounded-lg py-2 px-2 text-xs font-semibold transition border text-center cursor-pointer",
                  customerResponse === item.key
                    ? "border-amber-500 bg-amber-50 text-amber-900 ring-1 ring-amber-400"
                    : "border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50"
                )}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Quick Discussion */}
        <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold uppercase tracking-wider text-neutral-600">
              Hasil Pertemuan Singkat *
            </label>
            <button
              type="button"
              onClick={() => setShowAIModal(true)}
              className="text-[11px] font-semibold text-amber-600 hover:text-amber-700 flex items-center gap-1"
            >
              <Sparkles className="h-3 w-3" />
              Ceritakan ke AI
            </button>
          </div>
          <textarea
            rows={3}
            value={discussion}
            onChange={(e) => setDiscussion(e.target.value)}
            placeholder="Tulis poin penting pertemuan lapangan (misal: PIC minta sample Rimula R4 X dan proposal TCO)..."
            className="w-full rounded-xl border border-neutral-200 bg-white p-3 text-xs text-neutral-900 shadow-xs focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none"
          />
        </div>

        {/* Quick Opportunity Toggle */}
        <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold uppercase tracking-wider text-neutral-800">
              Ada Peluang Order / Trial?
            </label>
            <button
              type="button"
              onClick={() => setHasOpportunity(!hasOpportunity)}
              className={cn(
                "rounded-lg px-2.5 py-1 text-xs font-bold transition cursor-pointer",
                hasOpportunity ? "bg-amber-500 text-white" : "bg-neutral-100 text-neutral-600"
              )}
            >
              {hasOpportunity ? "🔥 Ada" : "○ Tidak"}
            </button>
          </div>

          {hasOpportunity && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              <select
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
                className="rounded-xl border border-neutral-300 bg-white px-3 py-2 text-xs text-neutral-900"
              >
                {masterProducts.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.brand} {p.product_name}
                  </option>
                ))}
              </select>
              <input
                type="number"
                value={potentialVolume}
                onChange={(e) => setPotentialVolume(e.target.value)}
                placeholder="Jumlah Drum (209L)"
                className="rounded-xl border border-neutral-300 bg-white px-3 py-2 text-xs text-neutral-900"
              />
            </div>
          )}
        </div>

        {/* Mandatory Next Action */}
        <div className="rounded-2xl border-2 border-amber-400 bg-amber-50/40 p-4 shadow-xs space-y-3">
          <div className="flex items-center gap-1.5 pb-1 border-b border-amber-200">
            <Flame className="h-4 w-4 text-amber-600" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-950">
              Next Action (Otomatis Masuk Task)
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <select
              value={nextActionType}
              onChange={(e) => setNextActionType(e.target.value as FollowUpActivityType)}
              className="rounded-xl border border-amber-300 bg-white px-3 py-2 text-xs font-semibold text-neutral-900"
            >
              {FOLLOW_UP_ACTIVITY_TYPES.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
            <input
              type="date"
              value={nextActionDueDate}
              onChange={(e) => setNextActionDueDate(e.target.value)}
              className="rounded-xl border border-amber-300 bg-white px-3 py-2 text-xs font-semibold text-neutral-900"
            />
          </div>

          <input
            type="text"
            value={nextActionDescription}
            onChange={(e) => setNextActionDescription(e.target.value)}
            placeholder="Detail aksi lanjutan..."
            className="w-full rounded-xl border border-amber-300 bg-white px-3 py-2 text-xs text-neutral-900"
          />
        </div>

        {/* Big Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isPending}
            className="w-full flex items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-amber-500 to-amber-600 py-3.5 text-sm font-bold text-white shadow-md hover:from-amber-600 hover:to-amber-700 transition disabled:opacity-50 cursor-pointer"
          >
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Menyimpan Quick Visit...</span>
              </>
            ) : (
              <>
                <Zap className="h-4 w-4 fill-current" />
                <span>⚡ SIMPAN QUICK VISIT SEKARANG</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* AI Modals */}
      <AINoteParserModal
        isOpen={showAIModal}
        onClose={() => setShowAIModal(false)}
        onApply={handleApplyAI}
      />

      <ObjectionBattlecardsModal
        isOpen={showBattlecards}
        onClose={() => setShowBattlecards(false)}
        battlecards={battlecards}
      />
    </>
  );
}
