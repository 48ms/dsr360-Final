"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { FollowUpCard } from "@/components/follow-ups/follow-up-card";
import type { FollowUpItem } from "@/actions/follow-ups";
import { createFollowUp } from "@/actions/follow-ups";
import {
  FOLLOW_UP_ACTIVITY_TYPES,
  FOLLOW_UP_PRIORITIES,
  type FollowUpActivityType,
  type FollowUpPriority,
} from "@/constants/enums";
import {
  ListTodo,
  Loader2,
  Plus,
  ShieldAlert,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { getTodayWIB } from "@/lib/utils/format";

type TriageTab = "OVERDUE" | "TODAY" | "UPCOMING" | "COMPLETED" | "ALL";

type CustomerOption = {
  id: string;
  customer_name: string;
  city: string | null;
};

export function FollowUpListClient({
  initialFollowUps,
  customers,
}: {
  initialFollowUps: FollowUpItem[];
  customers: CustomerOption[];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [activeTab, setActiveTab] = useState<TriageTab>("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  // Create Task Form State
  const [showAddModal, setShowAddModal] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);
  const [newCustId, setNewCustId] = useState<string>(customers[0]?.id ?? "");
  const [newType, setNewType] = useState<FollowUpActivityType>("WHATSAPP");
  const [newDesc, setNewDesc] = useState<string>("");
  const [newDate, setNewDate] = useState<string>(getTodayWIB());
  const [newPriority, setNewPriority] = useState<FollowUpPriority>("HIGH");

  const todayStr = getTodayWIB();

  // Counts
  const overdueCount = initialFollowUps.filter(
    (f) => f.status === "PENDING" && f.due_date < todayStr
  ).length;
  const todayCount = initialFollowUps.filter(
    (f) => f.status === "PENDING" && f.due_date === todayStr
  ).length;

  const filteredTasks = initialFollowUps.filter((task) => {
    // Search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const cust = task.customer?.customer_name.toLowerCase() ?? "";
      const desc = task.description?.toLowerCase() ?? "";
      if (!cust.includes(q) && !desc.includes(q)) return false;
    }

    // Triage Tab
    if (activeTab === "OVERDUE") {
      return task.status === "PENDING" && task.due_date < todayStr;
    }
    if (activeTab === "TODAY") {
      return task.status === "PENDING" && task.due_date === todayStr;
    }
    if (activeTab === "UPCOMING") {
      return task.status === "PENDING" && task.due_date > todayStr;
    }
    if (activeTab === "COMPLETED") {
      return task.status === "COMPLETED";
    }
    return true;
  });

  function handleCreateTask(e: React.FormEvent) {
    e.preventDefault();
    if (!newCustId) {
      setAddError("Pilih customer terlebih dahulu.");
      return;
    }
    if (!newDesc.trim()) {
      setAddError("Deskripsi rencana follow-up wajib diisi.");
      return;
    }

    setAddError(null);
    startTransition(async () => {
      const res = await createFollowUp({
        customer_id: newCustId,
        activity_type: newType,
        description: newDesc.trim(),
        due_date: newDate,
        priority: newPriority,
      });

      if (res?.error) {
        setAddError(res.error);
      } else {
        setShowAddModal(false);
        setNewDesc("");
        router.refresh();
      }
    });
  }

  return (
    <div className="p-4 sm:p-6 max-w-3xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-neutral-900 tracking-tight">Tugas Follow-Up</h1>
          <p className="text-xs text-neutral-500 mt-0.5">Triage dan selesaikan komitmen lapangan</p>
        </div>

        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-1.5 rounded-xl bg-neutral-900 px-3.5 py-2 text-xs font-bold text-white shadow-xs hover:bg-neutral-800 transition cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>Tambah Task</span>
        </button>
      </div>

      {/* Triage Tabs */}
      <div className="flex gap-1.5 rounded-xl bg-neutral-100 p-1 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab("OVERDUE")}
          className={cn(
            "flex-1 min-w-[90px] rounded-lg py-2 text-xs font-medium transition text-center whitespace-nowrap",
            activeTab === "OVERDUE"
              ? "bg-white text-red-700 shadow-xs font-bold"
              : "text-neutral-500 hover:text-neutral-900"
          )}
        >
          Overdue {overdueCount > 0 && <span className="ml-1 rounded-full bg-red-100 px-1.5 py-0.2 text-[10px] text-red-800 font-bold">{overdueCount}</span>}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("TODAY")}
          className={cn(
            "flex-1 min-w-[90px] rounded-lg py-2 text-xs font-medium transition text-center whitespace-nowrap",
            activeTab === "TODAY"
              ? "bg-white text-amber-700 shadow-xs font-bold"
              : "text-neutral-500 hover:text-neutral-900"
          )}
        >
          Hari Ini {todayCount > 0 && <span className="ml-1 rounded-full bg-amber-100 px-1.5 py-0.2 text-[10px] text-amber-800 font-bold">{todayCount}</span>}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("UPCOMING")}
          className={cn(
            "flex-1 min-w-[90px] rounded-lg py-2 text-xs font-medium transition text-center whitespace-nowrap",
            activeTab === "UPCOMING"
              ? "bg-white text-blue-700 shadow-xs font-bold"
              : "text-neutral-500 hover:text-neutral-900"
          )}
        >
          Mendatang
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("COMPLETED")}
          className={cn(
            "flex-1 min-w-[90px] rounded-lg py-2 text-xs font-medium transition text-center whitespace-nowrap",
            activeTab === "COMPLETED"
              ? "bg-white text-emerald-700 shadow-xs font-bold"
              : "text-neutral-500 hover:text-neutral-900"
          )}
        >
          Selesai
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("ALL")}
          className={cn(
            "flex-1 min-w-[70px] rounded-lg py-2 text-xs font-medium transition text-center whitespace-nowrap",
            activeTab === "ALL"
              ? "bg-white text-neutral-900 shadow-xs font-bold"
              : "text-neutral-500 hover:text-neutral-900"
          )}
        >
          Semua
        </button>
      </div>

      {/* Search Input */}
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Cari customer atau deskripsi tugas..."
          className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-xs text-neutral-900 shadow-xs focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none"
        />
      </div>

      {/* Task Feed */}
      {filteredTasks.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-neutral-200 bg-white p-8 text-center">
          <ListTodo className="mx-auto h-10 w-10 text-neutral-300 mb-3" />
          <h3 className="text-sm font-semibold text-neutral-800">
            {activeTab === "OVERDUE"
              ? "Hebat! Tidak ada tugas follow-up yang terlambat."
              : activeTab === "TODAY"
              ? "Tidak ada jadwal tugas untuk hari ini."
              : "Tidak ada data follow-up"}
          </h3>
          <p className="mt-1 text-xs text-neutral-500 max-w-sm mx-auto">
            {activeTab === "OVERDUE"
              ? "Pertahankan ritme kerja agar tidak ada deal customer yang terlewat."
              : "Tambahkan komitmen tugas baru atau log follow-up dari kunjungan."}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredTasks.map((task) => (
            <FollowUpCard
              key={task.id}
              item={task}
              onCompleted={() => router.refresh()}
            />
          ))}
        </div>
      )}

      {/* Modal Add Task */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-white p-5 sm:p-6 shadow-xl space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-base font-bold text-neutral-900">Tambah Tugas Follow-Up</h2>
                <p className="text-xs text-neutral-500">Catat komitmen aksi untuk customer</p>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                aria-label="Tutup modal"
                className="rounded-lg p-1 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600 focus-visible:ring-2 focus-visible:ring-amber-500 outline-none"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            {addError && (
              <div className="flex items-center gap-2 rounded-xl bg-red-50 p-3 text-xs text-red-700 border border-red-200">
                <ShieldAlert className="h-4 w-4 shrink-0" />
                <span>{addError}</span>
              </div>
            )}

            <form onSubmit={handleCreateTask} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Pilih Customer *
                </label>
                <select
                  value={newCustId}
                  onChange={(e) => setNewCustId(e.target.value)}
                  className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs font-semibold text-neutral-900 shadow-xs"
                >
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.customer_name} ({c.city ?? "Tanpa Kota"})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Aktivitas *
                  </label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as FollowUpActivityType)}
                    className="w-full rounded-xl border border-neutral-200 bg-white px-2.5 py-2 text-xs font-semibold text-neutral-900"
                  >
                    {FOLLOW_UP_ACTIVITY_TYPES.map((a) => (
                      <option key={a} value={a}>
                        {a}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Prioritas *
                  </label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as FollowUpPriority)}
                    className="w-full rounded-xl border border-neutral-200 bg-white px-2.5 py-2 text-xs font-semibold text-neutral-900"
                  >
                    {FOLLOW_UP_PRIORITIES.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Target Tanggal *
                  </label>
                  <input
                    type="date"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full rounded-xl border border-neutral-200 bg-white px-2 py-2 text-xs font-semibold text-neutral-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Deskripsi Tindak Lanjut *
                </label>
                <textarea
                  rows={3}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Contoh: Kirim penawaran harga Rimula R4 X 10 drum dan follow-up via WA..."
                  className="w-full rounded-xl border border-neutral-200 bg-white p-3 text-xs text-neutral-900 shadow-xs focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="rounded-xl border border-neutral-200 px-4 py-2 text-xs font-medium text-neutral-600 hover:bg-neutral-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-neutral-900 px-5 py-2 text-xs font-bold text-white shadow-xs hover:bg-neutral-800 transition disabled:opacity-50"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      <span>Menyimpan...</span>
                    </>
                  ) : (
                    <>
                      <Plus className="h-3.5 w-3.5" />
                      <span>Simpan Task</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
