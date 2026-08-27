"use client";

import { useState } from "react";
import Link from "next/link";
import { Sparkles, Plus, MessageSquare, Bot, Users, Trash2 } from "lucide-react";
import { PreVisitBriefModal } from "@/components/ai/pre-visit-brief-modal";
import { CustomerAISparringDrawer } from "@/components/ai/customer-ai-sparring-drawer";
import { WhatsAppActionModal } from "@/components/whatsapp/whatsapp-action-modal";
import { ReassignAccountModal } from "@/components/customers/reassign-account-modal";
import { DeleteCustomerModal } from "@/components/customers/delete-customer-modal";
import type { WhatsAppContact } from "@/lib/utils/whatsapp";

export function CustomerHeaderActions({
  customerId,
  customerName,
  defaultPhone,
  contacts = [],
  isManager = false,
  currentOwnerName,
  currentOwnerId,
}: {
  customerId: string;
  customerName?: string;
  defaultPhone?: string | null;
  contacts?: { id?: string; name: string; phone: string | null; position?: string | null; contact_type?: string | null }[];
  isManager?: boolean;
  currentOwnerName?: string;
  currentOwnerId?: string;
}) {
  const [showBriefModal, setShowBriefModal] = useState(false);
  const [showSparringDrawer, setShowSparringDrawer] = useState(false);
  const [showWaModal, setShowWaModal] = useState(false);
  const [showReassignModal, setShowReassignModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [assignedOwnerName, setAssignedOwnerName] = useState<string | undefined>(currentOwnerName);

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
        {/* Manager Reassign Action Banner if user has manager role */}
        {isManager && (
          <div className="flex items-center justify-between p-3 rounded-2xl bg-neutral-900 border border-neutral-800 text-white shadow-xs">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-amber-500/20 text-amber-300">
                <Users className="h-4 w-4" />
              </div>
              <div className="text-xs">
                <span className="text-neutral-400 font-medium">DSR Ditugaskan: </span>
                <strong className="text-amber-300 font-bold">{assignedOwnerName || "Belum Ditugaskan"}</strong>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowReassignModal(true)}
              className="flex items-center gap-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 active:scale-95 text-white px-3 py-1.5 text-xs font-bold transition cursor-pointer shadow-2xs"
            >
              <span>Realokasi Akun</span>
            </button>
          </div>
        )}

        {/* Row 1: WhatsApp & AI Actions */}
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

        {/* AI Sparring Direct Action Banner */}
        <button
          type="button"
          onClick={() => setShowSparringDrawer(true)}
          className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-950 text-xs font-bold hover:bg-amber-100 active:scale-[0.99] transition cursor-pointer shadow-2xs"
        >
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-amber-500 text-white font-bold shrink-0">
              <Bot className="h-3.5 w-3.5" />
            </div>
            <span className="truncate">Diskusi Taktis dengan Bang Radit (AI Copilot)</span>
          </div>
          <span className="text-[10px] bg-amber-200/80 px-2 py-0.5 rounded-md text-amber-900 shrink-0">
            Sparring 💬
          </span>
        </button>

        {/* Row 2: Visit Planning Actions, SPH Generator, & Delete Customer */}
        <div className="grid grid-cols-12 gap-2">
          <Link
            href={`/visits/new?customerId=${customerId}`}
            className="col-span-5 flex items-center justify-center gap-1.5 rounded-xl bg-amber-500 px-3 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-amber-600 active:scale-95 transition"
          >
            <Plus className="h-4 w-4" />
            <span>Rencanakan Visit</span>
          </Link>
          <Link
            href={`/calculator?customerId=${customerId}`}
            className="col-span-5 flex items-center justify-center gap-1.5 rounded-xl bg-neutral-900 px-3 py-2.5 text-xs font-bold text-amber-400 shadow-xs hover:bg-neutral-800 active:scale-95 transition border border-neutral-800"
          >
            <span>📄 Buat SPH &amp; Fee</span>
          </Link>
          <button
            type="button"
            onClick={() => setShowDeleteModal(true)}
            title="Hapus Akun Customer Ini"
            className="col-span-2 flex items-center justify-center rounded-xl border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 active:scale-95 transition cursor-pointer"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <PreVisitBriefModal
        isOpen={showBriefModal}
        customerId={customerId}
        onClose={() => setShowBriefModal(false)}
        onOpenSparring={() => setShowSparringDrawer(true)}
      />

      <CustomerAISparringDrawer
        isOpen={showSparringDrawer}
        customerId={customerId}
        customerName={customerName || "Customer"}
        onClose={() => setShowSparringDrawer(false)}
      />

      <WhatsAppActionModal
        isOpen={showWaModal}
        onClose={() => setShowWaModal(false)}
        customerName={customerName || "Customer"}
        customerId={customerId}
        defaultPhone={defaultPhone}
        contacts={formattedContacts}
        defaultTemplate="INTRODUCTION"
      />

      <ReassignAccountModal
        isOpen={showReassignModal}
        onClose={() => setShowReassignModal(false)}
        customerId={customerId}
        customerName={customerName || "Customer"}
        currentOwnerId={currentOwnerId}
        currentOwnerName={assignedOwnerName}
        onSuccess={(newOwner) => setAssignedOwnerName(newOwner)}
      />

      <DeleteCustomerModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        customerId={customerId}
        customerName={customerName}
      />
    </>
  );
}
