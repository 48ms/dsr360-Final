"use client";

import { useState } from "react";
import { MessageSquare } from "lucide-react";
import { WhatsAppActionModal } from "@/components/whatsapp/whatsapp-action-modal";
import type { WhatsAppContact } from "@/lib/utils/whatsapp";

export function VisitWhatsAppShareButton({
  customerName,
  customerId,
  defaultPhone,
  contacts = [],
  visitDate,
  visitDiscussion,
  opportunityProduct,
  nextAction,
}: {
  customerName: string;
  customerId?: string;
  defaultPhone?: string | null;
  contacts?: WhatsAppContact[];
  visitDate?: string;
  visitDiscussion?: string | null;
  opportunityProduct?: string | null;
  nextAction?: string | null;
}) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setShowModal(true)}
        className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 active:scale-95 transition cursor-pointer"
      >
        <MessageSquare className="h-4 w-4 fill-current" />
        <span>💬 Kirim Ringkasan Kunjungan via WhatsApp</span>
      </button>

      <WhatsAppActionModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        customerName={customerName}
        customerId={customerId}
        defaultPhone={defaultPhone}
        contacts={contacts}
        defaultTemplate="POST_VISIT_SUMMARY"
        context={{
          customerName,
          visitDate,
          visitDiscussion: visitDiscussion || undefined,
          opportunityProduct: opportunityProduct || undefined,
          nextAction: nextAction || undefined,
        }}
      />
    </>
  );
}
