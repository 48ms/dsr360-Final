"use client";

import { Printer } from "lucide-react";

export function CustomerPrintButton() {
  function handlePrint() {
    window.print();
  }

  return (
    <button
      type="button"
      onClick={handlePrint}
      className="inline-flex items-center gap-1.5 rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs font-semibold text-neutral-700 shadow-2xs hover:bg-neutral-50 hover:text-neutral-900 transition cursor-pointer"
      title="Cetak atau Simpan PDF Profil Customer"
    >
      <Printer className="h-3.5 w-3.5 text-neutral-500" />
      <span>Cetak / PDF</span>
    </button>
  );
}
