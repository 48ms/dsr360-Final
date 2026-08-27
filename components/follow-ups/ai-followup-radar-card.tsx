"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  getDailyFollowUpRadarAction,
  runHermesNightlyDispatcherAction,
  type DailyRadarItem,
} from "@/actions/ai";
import { WhatsAppActionModal } from "@/components/whatsapp/whatsapp-action-modal";
import { useToast } from "@/components/ui/toast-context";
import {
  Sparkles,
  Loader2,
  AlertTriangle,
  Flame,
  MessageCircle,
  Calendar,
  ChevronRight,
  TrendingUp,
  RefreshCw,
  Clock,
  Target,
  Bot,
  Moon,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

export function AIFollowUpRadarCard() {
  const { success, error } = useToast();
  const [radarItems, setRadarItems] = useState<DailyRadarItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isHermesRunning, setIsHermesRunning] = useState(false);

  // WhatsApp Action Modal State
  const [selectedItemForWA, setSelectedItemForWA] = useState<DailyRadarItem | null>(null);

  async function loadRadar() {
    setIsLoading(true);
    try {
      const items = await getDailyFollowUpRadarAction();
      setRadarItems(items);
    } catch (err) {
      console.error("Failed to load AI daily radar:", err);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleRunHermes() {
    setIsHermesRunning(true);
    try {
      const result = await runHermesNightlyDispatcherAction();
      if (result.success) {
        success(result.summaryMessage || "Audit forensik Hermes berhasil dijalankan!");
        await loadRadar();
      } else {
        error("Gagal menjalankan audit Hermes.");
      }
    } catch (err) {
      console.error("Hermes run error:", err);
      error("Terjadi kendala saat menjalankan Hermes Dispatcher.");
    } finally {
      setIsHermesRunning(false);
    }
  }

  useEffect(() => {
    loadRadar();
  }, []);

  return (
    <div className="rounded-3xl border border-amber-300/80 bg-gradient-to-br from-amber-500/10 via-amber-50/40 to-white p-4 sm:p-5 shadow-xs space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-amber-500 text-white shadow-2xs">
            <Bot className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-sm font-extrabold text-neutral-900 flex flex-wrap items-center gap-2">
              <span>AI Follow-Up Radar &amp; Cockpit</span>
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold text-amber-900 border border-amber-500/30">
                <Sparkles className="h-2.5 w-2.5 text-amber-600" /> 13 Pilar Grounded
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-bold text-emerald-800 border border-emerald-500/30">
                <Clock className="h-2.5 w-2.5 text-emerald-600" /> Cron Aktif (00:00 WIB)
              </span>
            </h2>
            <p className="text-[11px] text-neutral-500">
              Analisis siklus repeat order, deal tertunda, &amp; prioritas akun otomatis setiap malam.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleRunHermes}
            disabled={isHermesRunning || isLoading}
            title="Jalankan Audit Forensik Hermes Sekarang"
            className="inline-flex items-center gap-1.5 min-h-[42px] rounded-xl border border-amber-300 bg-amber-500/10 px-3 py-2 text-xs font-bold text-amber-950 hover:bg-amber-500/20 active:scale-95 transition cursor-pointer shadow-2xs disabled:opacity-50"
          >
            {isHermesRunning ? (
              <Loader2 className="h-4 w-4 animate-spin text-amber-700" />
            ) : (
              <Moon className="h-4 w-4 text-amber-700" />
            )}
            <span className="hidden sm:inline">
              {isHermesRunning ? "Menganalisis..." : "Audit Forensik Hermes"}
            </span>
          </button>

          <button
            type="button"
            onClick={loadRadar}
            disabled={isLoading || isHermesRunning}
            title="Refresh Radar AI"
            className="min-h-[42px] min-w-[42px] flex items-center justify-center rounded-xl border border-neutral-200 bg-white p-2.5 text-neutral-600 hover:bg-neutral-100 active:scale-95 transition cursor-pointer shadow-2xs disabled:opacity-50"
          >
            <RefreshCw className={cn("h-4 w-4", isLoading ? "animate-spin text-amber-600" : "")} />
          </button>
        </div>
      </div>

      {/* Loading Skeleton */}
      {isLoading ? (
        <div className="flex items-center justify-center p-6 text-xs text-neutral-500 gap-2 bg-white/70 rounded-2xl border border-neutral-100">
          <Loader2 className="h-4 w-4 animate-spin text-amber-600" />
          <span>Memindai portofolio akun &amp; data historis CRM...</span>
        </div>
      ) : radarItems.length === 0 ? (
        <div className="rounded-2xl bg-white p-4 text-center text-xs text-neutral-500 border border-neutral-100">
          <p className="font-semibold text-neutral-700">Semua akun terkawal rapi hari ini!</p>
          <p className="text-[11px] text-neutral-400 mt-0.5">Tidak ada customer atau deal yang terbengkalai.</p>
        </div>
      ) : (
        /* Radar Items List */
        <div className="space-y-3">
          {radarItems.map((item, idx) => {
            const isCritical = item.priority === "CRITICAL";
            const isAction = item.priority === "ACTION_NEEDED";

            return (
              <div
                key={idx}
                className={cn(
                  "rounded-2xl p-4 transition space-y-2.5 border shadow-2xs",
                  isCritical
                    ? "bg-white border-red-200/90 ring-1 ring-red-300/40"
                    : isAction
                    ? "bg-white border-amber-200/90 ring-1 ring-amber-300/40"
                    : "bg-white border-neutral-200"
                )}
              >
                {/* Item Top Row */}
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Link
                        href={`/customers/${item.customer_id}`}
                        className="text-xs sm:text-sm font-bold text-neutral-900 hover:text-amber-600 transition"
                      >
                        {item.customer_name}
                      </Link>
                      <span
                        className={cn(
                          "rounded-md px-2 py-0.5 text-[9px] font-extrabold uppercase",
                          isCritical
                            ? "bg-red-100 text-red-800 border border-red-200"
                            : isAction
                            ? "bg-amber-100 text-amber-900 border border-amber-200"
                            : "bg-blue-100 text-blue-800 border border-blue-200"
                        )}
                      >
                        {item.priority === "CRITICAL"
                          ? "🔴 Wajib Hari Ini"
                          : item.priority === "ACTION_NEEDED"
                          ? "🟡 Perlu Disapa"
                          : "🟢 Peluang"}
                      </span>
                    </div>

                    {item.opportunity_name && (
                      <p className="text-[11px] text-neutral-500 mt-0.5">
                        Deal: <strong>{item.opportunity_name}</strong>
                        {item.target_product ? ` · ${item.target_product}` : ""}
                      </p>
                    )}
                  </div>

                  {item.deal_value && (
                    <div className="text-right shrink-0">
                      <span className="text-[10px] text-neutral-400 block font-normal">Potensi</span>
                      <span className="text-xs font-extrabold text-emerald-700">{item.deal_value}</span>
                    </div>
                  )}
                </div>

                {/* AI Diagnosis */}
                <div className="rounded-xl bg-neutral-50 p-2.5 text-xs text-neutral-800 border border-neutral-100 space-y-1">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-amber-800">
                    <Target className="h-3 w-3 text-amber-600" />
                    <span>Diagnosa AI:</span>
                  </div>
                  <p className="text-[11px] text-neutral-700 leading-relaxed font-medium">
                    {item.ai_diagnosis}
                  </p>
                </div>

                {/* Recommended Action & 1-Click Buttons */}
                <div className="flex items-center justify-between gap-2 pt-1 border-t border-neutral-100 flex-wrap">
                  <span className="text-[11px] text-neutral-600 italic">
                    👉 {item.recommended_action}
                  </span>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => setSelectedItemForWA(item)}
                      className="inline-flex items-center gap-1.5 min-h-[40px] rounded-xl bg-emerald-600 px-3.5 py-2 text-xs font-bold text-white shadow-2xs hover:bg-emerald-700 active:scale-95 transition cursor-pointer"
                    >
                      <MessageCircle className="h-4 w-4" />
                      <span>Kirim WA AI</span>
                      <Sparkles className="h-3 w-3 text-amber-200" />
                    </button>

                    <Link
                      href={`/visits/new?customerId=${item.customer_id}`}
                      className="inline-flex items-center gap-1.5 min-h-[40px] rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs font-bold text-neutral-700 hover:bg-neutral-50 active:scale-95 transition shadow-2xs"
                    >
                      <Calendar className="h-4 w-4 text-neutral-500" />
                      <span>Rencana Visit</span>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* WhatsApp Modal for Selected Radar Item */}
      {selectedItemForWA && (
        <WhatsAppActionModal
          isOpen={Boolean(selectedItemForWA)}
          onClose={() => setSelectedItemForWA(null)}
          customerName={selectedItemForWA.customer_name}
          customerId={selectedItemForWA.customer_id}
          defaultPhone={selectedItemForWA.contact_phone}
          contacts={
            selectedItemForWA.contact_phone
              ? [
                  {
                    name: selectedItemForWA.pic_name || "PIC",
                    phone: selectedItemForWA.contact_phone,
                    role: "PIC",
                  },
                ]
              : []
          }
          opportunityContext={{
            opportunityName: selectedItemForWA.opportunity_name,
            targetProduct: selectedItemForWA.target_product,
            potentialValue: selectedItemForWA.deal_value,
            customerNeed: selectedItemForWA.ai_diagnosis,
          }}
        />
      )}
    </div>
  );
}
