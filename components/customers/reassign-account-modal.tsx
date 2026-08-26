"use client";

import { useState, useTransition, useEffect } from "react";
import {
  getAvailableRepsForReassignment,
  reassignCustomerAccount,
  type ReassignableRep,
} from "@/actions/reassignment";
import {
  Users,
  UserCheck,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  X,
  Briefcase,
  Clock,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

export function ReassignAccountModal({
  isOpen,
  onClose,
  customerId,
  customerName,
  currentOwnerName,
  currentOwnerId,
  onSuccess,
}: {
  isOpen: boolean;
  onClose: () => void;
  customerId: string;
  customerName: string;
  currentOwnerName?: string;
  currentOwnerId?: string;
  onSuccess?: (newOwnerName: string) => void;
}) {
  const [reps, setReps] = useState<ReassignableRep[]>([]);
  const [selectedRepId, setSelectedRepId] = useState<string>("");
  const [reason, setReason] = useState<string>("");
  const [transferDeals, setTransferDeals] = useState<boolean>(true);
  const [transferFollowUps, setTransferFollowUps] = useState<boolean>(true);
  const [isLoadingReps, setIsLoadingReps] = useState<boolean>(false);
  const [isPending, startTransition] = useTransition();
  const [resultMsg, setResultMsg] = useState<{ success: boolean; text: string } | null>(null);

  useEffect(() => {
    if (isOpen) {
      setIsLoadingReps(true);
      setResultMsg(null);
      getAvailableRepsForReassignment()
        .then((data) => {
          setReps(data);
          // Auto select first rep that is not the current owner
          const otherRep = data.find((r) => r.id !== currentOwnerId) || data[0];
          if (otherRep) setSelectedRepId(otherRep.id);
        })
        .finally(() => setIsLoadingReps(false));
    }
  }, [isOpen, currentOwnerId]);

  if (!isOpen) return null;

  const targetRep = reps.find((r) => r.id === selectedRepId);

  function handleReassign() {
    if (!selectedRepId) return;

    setResultMsg(null);
    startTransition(async () => {
      const res = await reassignCustomerAccount({
        customerId,
        newOwnerId: selectedRepId,
        reason: reason.trim() || undefined,
        transferDeals,
        transferFollowUps,
      });

      if (res.success) {
        setResultMsg({ success: true, text: res.message });
        if (onSuccess && res.newOwnerName) {
          onSuccess(res.newOwnerName);
        }
        setTimeout(() => {
          onClose();
        }, 1400);
      } else {
        setResultMsg({ success: false, text: res.message });
      }
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-lg rounded-3xl bg-white border border-[#EAE4D9] p-5 sm:p-6 shadow-2xl space-y-5">
        {/* Modal Header */}
        <div className="flex items-start justify-between gap-3 border-b border-neutral-100 pb-3.5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-900">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black uppercase text-amber-700 tracking-wider">
                  Manager Authority
                </span>
                <span className="inline-flex items-center rounded-full bg-amber-100 px-2 py-0.2 text-[9px] font-bold text-amber-900">
                  1-Click Reassign
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-neutral-900 tracking-tight">
                Realokasi Pemilik Akun Sales
              </h3>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-neutral-100 text-neutral-400 hover:text-neutral-700 transition"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Customer Transfer Visualizer Card */}
        <div className="rounded-2xl bg-neutral-50 p-4 border border-neutral-200/80 space-y-2.5">
          <div className="text-xs text-neutral-500 font-semibold">Akun yang dialihkan:</div>
          <div className="text-sm font-black text-neutral-900 truncate">
            {customerName}
          </div>

          <div className="flex items-center justify-between gap-2 pt-2 border-t border-neutral-200/60 text-xs">
            <div className="space-y-0.5">
              <span className="text-[10px] text-neutral-400 font-medium uppercase">Owner Saat Ini</span>
              <div className="font-bold text-neutral-800 flex items-center gap-1">
                <span>{currentOwnerName || "Belum Ditugaskan"}</span>
              </div>
            </div>

            <ArrowRight className="h-4 w-4 text-amber-600 shrink-0" />

            <div className="space-y-0.5 text-right">
              <span className="text-[10px] text-amber-700 font-bold uppercase">DSR Penerima Baru</span>
              <div className="font-bold text-amber-950">
                {targetRep?.fullName || "Pilih DSR"}
              </div>
            </div>
          </div>
        </div>

        {/* Select Target Rep */}
        <div className="space-y-2">
          <label className="text-xs font-extrabold text-neutral-900 block">
            Pilih Sales Representative Baru (DSR Target):
          </label>

          {isLoadingReps ? (
            <div className="text-center py-4 text-xs text-neutral-400">
              Memuat data sales rep...
            </div>
          ) : (
            <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
              {reps.map((rep) => {
                const isSelected = rep.id === selectedRepId;
                const isCurrent = rep.id === currentOwnerId;

                return (
                  <button
                    key={rep.id}
                    type="button"
                    onClick={() => setSelectedRepId(rep.id)}
                    className={cn(
                      "w-full flex items-center justify-between p-3 rounded-2xl border text-left transition active:scale-98 cursor-pointer",
                      isSelected
                        ? "bg-amber-50/80 border-amber-500 shadow-2xs ring-1 ring-amber-500"
                        : "bg-white border-neutral-200 hover:border-amber-300"
                    )}
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className={cn(
                          "flex h-8 w-8 items-center justify-center rounded-xl font-bold text-xs",
                          isSelected
                            ? "bg-amber-600 text-white"
                            : "bg-neutral-100 text-neutral-700"
                        )}
                      >
                        {rep.fullName.charAt(0)}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-neutral-900 flex items-center gap-1.5">
                          <span>{rep.fullName}</span>
                          {isCurrent && (
                            <span className="text-[9px] font-bold text-neutral-400 bg-neutral-100 px-1.5 py-0.5 rounded">
                              Saat Ini
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-neutral-500">
                          {rep.role} &bull; Area {rep.salesArea}
                        </div>
                      </div>
                    </div>

                    <div className="text-right text-[10px] text-neutral-500">
                      <span className="font-bold text-neutral-800">{rep.activeAccountsCount}</span> Akun &bull;{" "}
                      <span className="font-bold text-neutral-800">{rep.openDealsCount}</span> Deal
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Options & Cascade Checkboxes */}
        <div className="rounded-2xl border border-neutral-200 bg-neutral-50/70 p-3.5 space-y-2.5">
          <span className="text-[11px] font-extrabold text-neutral-700 uppercase tracking-wider block">
            Otomasi Transisi Data:
          </span>

          <label className="flex items-center gap-2.5 text-xs text-neutral-800 cursor-pointer">
            <input
              type="checkbox"
              checked={transferDeals}
              onChange={(e) => setTransferDeals(e.target.checked)}
              className="h-4 w-4 rounded text-amber-600 focus:ring-amber-500"
            />
            <div className="flex items-center gap-1.5">
              <Briefcase className="h-3.5 w-3.5 text-neutral-500" />
              <span>Alihkan seluruh deal Opportunity aktif ke DSR baru</span>
            </div>
          </label>

          <label className="flex items-center gap-2.5 text-xs text-neutral-800 cursor-pointer">
            <input
              type="checkbox"
              checked={transferFollowUps}
              onChange={(e) => setTransferFollowUps(e.target.checked)}
              className="h-4 w-4 rounded text-amber-600 focus:ring-amber-500"
            />
            <div className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-neutral-500" />
              <span>Alihkan seluruh jadwal Follow-up pending ke DSR baru</span>
            </div>
          </label>
        </div>

        {/* Reason / Notes */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-neutral-700 block">
            Alasan Realokasi (Opsional):
          </label>
          <input
            type="text"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Contoh: Penyelarasan teritori Subang / Tindak lanjut akun dorman"
            className="w-full rounded-xl border border-neutral-300 px-3.5 py-2 text-xs text-neutral-900 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none"
          />
        </div>

        {/* Feedback Message */}
        {resultMsg && (
          <div
            className={cn(
              "rounded-2xl p-3.5 text-xs font-bold flex items-center gap-2",
              resultMsg.success
                ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                : "bg-red-50 text-red-800 border border-red-200"
            )}
          >
            {resultMsg.success ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="h-4 w-4 text-red-600 shrink-0" />
            )}
            <span>{resultMsg.text}</span>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-neutral-100">
          <button
            type="button"
            onClick={onClose}
            className="rounded-2xl border border-neutral-300 px-4 py-2.5 text-xs font-bold text-neutral-700 hover:bg-neutral-50 transition"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleReassign}
            disabled={isPending || !selectedRepId}
            className="flex items-center gap-1.5 rounded-2xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white px-5 py-2.5 text-xs font-bold shadow-sm transition active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            <UserCheck className="h-4 w-4" />
            <span>{isPending ? "Memproses..." : "Konfirmasi Realokasi Akun"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
