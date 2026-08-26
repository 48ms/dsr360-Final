"use client";

import { useState } from "react";
import Link from "next/link";
import { Sparkles, Zap, Plus, MessageSquare } from "lucide-react";
import { PreVisitBriefModal } from "@/components/ai/pre-visit-brief-modal";
import { WhatsAppActionModal } from "@/components/whatsapp/whatsapp-action-modal";
import type { WhatsAppContact } from "@/lib/utils/whatsapp";

export function CustomerHeaderActions({
  customerId,
  customerName,
  defaultPhone,
  contacts = [],
}: {
  customerId: string;
  customerName?: string;
  defaultPhone?: string | null;
  contacts?: { id?: string; name: string; phone: string | null; position?: string | null; contact_type?: string | null }[];
}) {
  const [showBriefModal, setShowBriefModal] = useState(false);
  const [showWaModal, setShowWaModal] = useState(false);

  const formattedContacts: WhatsAppContact[] = contacts
    .filter((c) => Boolean(c.phone))
    .map((c) => ({
      name: c.name,
      phone: c.phone as string,
      role: c.position || c.contact_type,
    }));

  return (
    <>
      <div className="mt-4 space-y-2 no-print">
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setShowWaModal(true)}
            className="flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 active:scale-95 transition cursor-pointer"
          >
            <MessageSquare className="h-3.5 w-3.5 fill-current" />
            <span>💬 Chat WhatsApp</span>
          </button>

          <button
            type="button"
            onClick={() => setShowBriefModal(true)}
            className="flex items-center justify-center gap-1.5 rounded-xl bg-linear-to-r from-neutral-900 to-neutral-800 px-3.5 py-2.5 text-xs font-bold text-amber-400 border border-neutral-700 shadow-xs hover:from-black hover:to-neutral-900 active:scale-95 transition cursor-pointer"
          >
            <Sparkles className="h-3.5 w-3.5 fill-current" />
            <span>✨ AI Briefing</span>
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Link
            href={`/visits/new?customerId=${customerId}`}
            className="flex items-center justify-center gap-1.5 rounded-xl bg-amber-500 px-4 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-amber-600 active:scale-95 transition"
          >
            <Plus className="h-4 w-4" />
            <span>Rencanakan Visit</span>
          </Link>
          <Link
            href={`/visits/quick`}
            className="flex items-center justify-center gap-1.5 rounded-xl bg-neutral-900 px-4 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-neutral-800 active:scale-95 transition"
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

      <WhatsAppActionModal
        isOpen={showWaModal}
        onClose={() => setShowWaModal(false)}
        customerName={customerName || "Customer"}
        defaultPhone={defaultPhone}
        contacts={formattedContacts}
        defaultTemplate="INTRODUCTION"
      />
    </>
  );
}
