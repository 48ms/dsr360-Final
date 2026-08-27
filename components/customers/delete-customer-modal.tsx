"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteCustomer } from "@/actions/customers";
import { useToast } from "@/components/ui/toast-context";
import { AlertTriangle, Loader2, Trash2, X } from "lucide-react";

export function DeleteCustomerModal({
  isOpen,
  onClose,
  customerId,
  customerName,
}: {
  isOpen: boolean;
  onClose: () => void;
  customerId: string;
  customerName?: string;
}) {
  const router = useRouter();
  const { success, error } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);

  if (!isOpen) return null;

  async function handleDelete() {
    setIsDeleting(true);
    try {
      const res = await deleteCustomer(customerId);
      if (res?.error) {
        error(res.error);
        setIsDeleting(false);
      } else {
        success(`Customer ${customerName || ""} berhasil dihapus.`);
        onClose();
        router.push("/customers");
        router.refresh();
      }
    } catch {
      error("Gagal menghapus customer. Silakan coba lagi.");
      setIsDeleting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl border border-neutral-200 space-y-4 animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-red-100 text-red-600">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-neutral-900">Hapus Akun Customer?</h3>
              <p className="text-xs text-neutral-500">Tindakan ini bersifat permanen</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="rounded-xl p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="rounded-2xl bg-red-50/70 border border-red-200/80 p-3.5 text-xs text-red-950 leading-relaxed">
          <p>
            Apakah Anda yakin ingin menghapus <strong>{customerName || "Customer ini"}</strong> dari database CRM?
          </p>
          <p className="mt-1 text-[11px] text-red-700 font-medium">
            Seluruh data riwayat kunjungan, kontak PIC, peluang deal, dan daftar aset mesin terkait customer ini akan ikut dibersihkan.
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2.5 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="min-h-[44px] px-4 rounded-xl border border-neutral-300 bg-white text-xs font-bold text-neutral-700 hover:bg-neutral-50 active:scale-95 transition cursor-pointer"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className="min-h-[44px] px-4 rounded-xl bg-red-600 text-xs font-bold text-white hover:bg-red-700 active:scale-95 transition flex items-center gap-1.5 cursor-pointer shadow-xs disabled:opacity-50"
          >
            {isDeleting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
            <span>{isDeleting ? "Menghapus..." : "Ya, Hapus Customer"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
