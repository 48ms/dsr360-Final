"use client";

import { useState } from "react";
import Link from "next/link";
import { Sparkles, Zap, Plus } from "lucide-react";
import { PreVisitBriefModal } from "@/components/ai/pre-visit-brief-modal";

export function CustomerHeaderActions({ customerId }: { customerId: string }) {
  const [showBriefModal, setShowBriefModal] = useState(false);

  return (
    <>
      <div className="mt-4 space-y-2">
        <button
          type="button"
          onClick={() => setShowBriefModal(true)}
          className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-linear-to-r from-neutral-900 to-neutral-800 py-2.5 text-xs font-bold text-amber-400 border border-neutral-700 shadow-xs hover:from-black hover:to-neutral-900 transition cursor-pointer"
        >
          <Sparkles className="h-3.5 w-3.5 fill-current" />
          <span>✨ AI Pre-Visit Briefing (&ldquo;What Should I Know?&rdquo;)</span>
        </button>

        <div className="grid grid-cols-2 gap-2">
          <Link
            href={`/visits/new?customerId=${customerId}`}
            className="flex items-center justify-center gap-1.5 rounded-xl bg-amber-500 px-4 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-amber-600 transition"
          >
            <Plus className="h-4 w-4" />
            <span>Rencanakan Visit</span>
          </Link>
          <Link
            href={`/visits/quick`}
            className="flex items-center justify-center gap-1.5 rounded-xl bg-neutral-900 px-4 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-neutral-800 transition"
          >
            <Zap className="h-3.5 w-3.5 fill-current text-amber-400" />
            <span>⚡ Quick Visit</span>
          </Link>
        </div>
      </div>

      <PreVisitBriefModal
        isOpen={showBriefModal}
        customerId={customerId}
        onClose={() => setShowBriefModal(false)}
      />
    </>
  );
}
