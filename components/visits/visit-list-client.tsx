"use client";

import { useState } from "react";
import Link from "next/link";
import { VisitCard, type VisitCardItem } from "@/components/visits/visit-card";
import { Plus, Zap, Calendar } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { getTodayWIB } from "@/lib/utils/format";

type TabFilter = "TODAY" | "PLANNED" | "COMPLETED" | "ALL";

export function VisitListClient({ initialVisits }: { initialVisits: VisitCardItem[] }) {
  const [activeTab, setActiveTab] = useState<TabFilter>("TODAY");
  const [searchQuery, setSearchQuery] = useState("");

  const todayStr = getTodayWIB();

  const filteredVisits = initialVisits.filter((v) => {
    // Search match
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const name = v.customer?.customer_name?.toLowerCase() ?? "";
      const city = v.customer?.city?.toLowerCase() ?? "";
      const purpose = v.purpose?.toLowerCase() ?? "";
      if (!name.includes(q) && !city.includes(q) && !purpose.includes(q)) {
        return false;
      }
    }

    // Tab filter
    if (activeTab === "TODAY") {
      return v.visit_date === todayStr || v.visit_status === "IN_PROGRESS";
    }
    if (activeTab === "PLANNED") {
      return v.visit_status === "PLANNED";
    }
    if (activeTab === "COMPLETED") {
      return v.visit_status === "COMPLETED";
    }
    return true;
  });

  const todayCount = initialVisits.filter(
    (v) => v.visit_date === todayStr || v.visit_status === "IN_PROGRESS"
  ).length;
  const plannedCount = initialVisits.filter((v) => v.visit_status === "PLANNED").length;

  return (
    <div className="p-4 sm:p-6 max-w-3xl mx-auto">
      {/* Top Header & CTAs */}
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-neutral-900 tracking-tight">Kunjungan Sales</h1>
          <p className="text-xs text-neutral-500 mt-0.5">Rencana POPSA & eksekusi log lapangan</p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/visits/quick"
            className="inline-flex items-center gap-1.5 rounded-xl bg-amber-500 px-3 py-2 text-xs font-semibold text-white shadow-xs hover:bg-amber-600 transition"
          >
            <Zap className="h-4 w-4 fill-current" />
            <span>Quick Visit</span>
          </Link>
          <Link
            href="/visits/new"
            className="inline-flex items-center gap-1.5 rounded-xl bg-neutral-900 px-3 py-2 text-xs font-semibold text-white shadow-xs hover:bg-neutral-800 transition"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Rencanakan Visit</span>
            <span className="sm:hidden">Plan</span>
          </Link>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative mb-4">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Cari nama customer, kota, atau tujuan..."
          className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-xs text-neutral-900 shadow-xs focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition"
        />
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-1.5 rounded-xl bg-neutral-100 p-1 mb-5">
        <button
          type="button"
          onClick={() => setActiveTab("TODAY")}
          className={cn(
            "flex-1 rounded-lg py-2 text-xs font-medium transition text-center",
            activeTab === "TODAY"
              ? "bg-white text-neutral-900 shadow-xs font-semibold"
              : "text-neutral-500 hover:text-neutral-900"
          )}
        >
          Hari Ini {todayCount > 0 && <span className="ml-1 rounded-full bg-amber-100 px-1.5 py-0.2 text-[10px] text-amber-800 font-bold">{todayCount}</span>}
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("PLANNED")}
          className={cn(
            "flex-1 rounded-lg py-2 text-xs font-medium transition text-center",
            activeTab === "PLANNED"
              ? "bg-white text-neutral-900 shadow-xs font-semibold"
              : "text-neutral-500 hover:text-neutral-900"
          )}
        >
          Terjadwal {plannedCount > 0 && <span className="ml-1 rounded-full bg-blue-100 px-1.5 py-0.2 text-[10px] text-blue-800 font-bold">{plannedCount}</span>}
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("COMPLETED")}
          className={cn(
            "flex-1 rounded-lg py-2 text-xs font-medium transition text-center",
            activeTab === "COMPLETED"
              ? "bg-white text-neutral-900 shadow-xs font-semibold"
              : "text-neutral-500 hover:text-neutral-900"
          )}
        >
          Selesai
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("ALL")}
          className={cn(
            "flex-1 rounded-lg py-2 text-xs font-medium transition text-center",
            activeTab === "ALL"
              ? "bg-white text-neutral-900 shadow-xs font-semibold"
              : "text-neutral-500 hover:text-neutral-900"
          )}
        >
          Semua
        </button>
      </div>

      {/* List Feed */}
      {filteredVisits.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-neutral-200 bg-white p-8 text-center">
          <Calendar className="mx-auto h-10 w-10 text-neutral-300 mb-3" />
          <h3 className="text-sm font-semibold text-neutral-800">
            {activeTab === "TODAY"
              ? "Tidak ada jadwal visit untuk hari ini"
              : "Tidak ada data visit"}
          </h3>
          <p className="mt-1 text-xs text-neutral-500 max-w-sm mx-auto">
            {activeTab === "TODAY"
              ? "Gunakan 'Rencanakan Visit' untuk menyusun agenda POPSA atau klik 'Quick Visit' jika langsung di lokasi customer."
              : "Mulai rencanakan kunjungan atau lakukan log langsung dari lapangan."}
          </p>
          <div className="mt-5 flex justify-center gap-3">
            <Link
              href="/visits/new"
              className="inline-flex items-center gap-1.5 rounded-xl bg-neutral-900 px-4 py-2 text-xs font-medium text-white shadow-xs hover:bg-neutral-800 transition"
            >
              <Plus className="h-3.5 w-3.5" />
              Buat Rencana Visit
            </Link>
            <Link
              href="/visits/quick"
              className="inline-flex items-center gap-1.5 rounded-xl bg-amber-500 px-4 py-2 text-xs font-medium text-white shadow-xs hover:bg-amber-600 transition"
            >
              <Zap className="h-3.5 w-3.5 fill-current" />
              Quick Visit
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredVisits.map((visit) => (
            <VisitCard key={visit.id} visit={visit} />
          ))}
        </div>
      )}
    </div>
  );
}
