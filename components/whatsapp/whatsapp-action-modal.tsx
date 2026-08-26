"use client";

import { useState } from "react";
import {
  WHATSAPP_TEMPLATES,
  generateWhatsAppUrl,
  sanitizeIndonesianPhone,
  type WhatsAppContact,
  type WhatsAppTemplateContext,
  type WhatsAppTemplateType,
} from "@/lib/utils/whatsapp";
import { useToast } from "@/components/ui/toast-context";
import {
  MessageSquare,
  Copy,
  ExternalLink,
  X,
  User,
  Phone,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

export type WhatsAppActionModalProps = {
  isOpen: boolean;
  onClose: () => void;
  customerName: string;
  defaultPhone?: string | null;
  contacts?: WhatsAppContact[];
  defaultTemplate?: WhatsAppTemplateType;
  context?: Partial<WhatsAppTemplateContext>;
};

export function WhatsAppActionModal({
  isOpen,
  onClose,
  customerName,
  defaultPhone,
  contacts = [],
  defaultTemplate = "POST_VISIT_SUMMARY",
  context = {},
}: WhatsAppActionModalProps) {
  const { success, error } = useToast();

  const initialPhone = contacts[0]?.phone || defaultPhone || "";
  const initialName = contacts[0]?.name || "";

  // Selected Contact State
  const [selectedContactPhone, setSelectedContactPhone] = useState<string>(initialPhone);
  const [selectedContactName, setSelectedContactName] = useState<string>(initialName);
  const [customPhone, setCustomPhone] = useState<string>("");

  // Selected Template & Message Content
  const [selectedTemplateId, setSelectedTemplateId] =
    useState<WhatsAppTemplateType>(defaultTemplate);
  const [customEditedText, setCustomEditedText] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Derived default message text from template & context
  const tpl =
    WHATSAPP_TEMPLATES.find((t) => t.id === selectedTemplateId) ||
    WHATSAPP_TEMPLATES[0];

  const ctx: WhatsAppTemplateContext = {
    customerName,
    picName: selectedContactName || context.picName || "",
    salesName: context.salesName || "",
    visitDate: context.visitDate,
    visitDiscussion: context.visitDiscussion,
    opportunityProduct: context.opportunityProduct,
    nextAction: context.nextAction,
  };

  const messageText =
    customEditedText !== null ? customEditedText : tpl.generateText(ctx);

  if (!isOpen) return null;

  const effectivePhone =
    selectedContactPhone === "CUSTOM" ? customPhone : selectedContactPhone;

  function handleSelectContact(phone: string, name: string) {
    setSelectedContactPhone(phone);
    setSelectedContactName(name);
    setCustomEditedText(null);
  }

  function handleCopy() {
    if (!messageText) return;
    navigator.clipboard.writeText(messageText);
    setCopied(true);
    success("Teks pesan WhatsApp berhasil disalin ke clipboard!");
    setTimeout(() => setCopied(false), 2000);
  }

  function handleOpenWhatsApp() {
    if (!effectivePhone) {
      error("Mohon pilih kontak atau masukkan nomor WhatsApp tujuan.");
      return;
    }

    const clean = sanitizeIndonesianPhone(effectivePhone);
    if (clean.length < 8) {
      error("Nomor telepon tidak valid (minimal 8 digit).");
      return;
    }

    const url = generateWhatsAppUrl(effectivePhone, messageText);
    window.open(url, "_blank", "noopener,noreferrer");
    success("Membuka aplikasi WhatsApp...");
    onClose();
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="wa-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in-up"
    >
      <div className="relative w-full max-w-lg rounded-2xl bg-white shadow-2xl border border-neutral-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-100 bg-neutral-900 text-white">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500 text-white shadow-xs">
              <MessageSquare className="h-4 w-4" />
            </div>
            <div>
              <h2 id="wa-modal-title" className="text-sm font-bold tracking-tight">
                Kirim Pesan WhatsApp
              </h2>
              <p className="text-[11px] text-neutral-400 font-medium truncate max-w-[240px] sm:max-w-xs">
                {customerName}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 transition cursor-pointer"
            aria-label="Tutup modal"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
          {/* 1. Pilih PIC Kontak Tujuan */}
          <div className="space-y-1.5">
            <label className="font-bold text-neutral-800 uppercase tracking-wider text-[11px] flex items-center gap-1">
              <User className="h-3.5 w-3.5 text-neutral-500" />
              <span>Kontak PIC Penerima:</span>
            </label>

            {contacts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {contacts.map((c) => {
                  const isSelected = selectedContactPhone === c.phone;
                  return (
                    <button
                      key={c.phone}
                      type="button"
                      onClick={() => handleSelectContact(c.phone, c.name)}
                      className={cn(
                        "flex items-start justify-between p-2.5 rounded-xl border text-left transition cursor-pointer",
                        isSelected
                          ? "border-emerald-500 bg-emerald-50/60 ring-2 ring-emerald-500/20"
                          : "border-neutral-200 bg-neutral-50/70 hover:bg-neutral-100"
                      )}
                    >
                      <div className="min-w-0 pr-1">
                        <p className="font-bold text-neutral-900 truncate">
                          {c.name}
                        </p>
                        <p className="text-[10px] text-neutral-500 flex items-center gap-1 mt-0.5">
                          <Phone className="h-2.5 w-2.5" />
                          {c.phone}
                          {c.role ? ` • ${c.role}` : ""}
                        </p>
                      </div>
                      {isSelected && (
                        <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                      )}
                    </button>
                  );
                })}

                <button
                  type="button"
                  onClick={() => handleSelectContact("CUSTOM", "")}
                  className={cn(
                    "flex items-center justify-between p-2.5 rounded-xl border text-left transition cursor-pointer",
                    selectedContactPhone === "CUSTOM"
                      ? "border-emerald-500 bg-emerald-50/60 ring-2 ring-emerald-500/20"
                      : "border-neutral-200 bg-neutral-50/70 hover:bg-neutral-100"
                  )}
                >
                  <span className="font-semibold text-neutral-700">
                    + Nomor Lainnya
                  </span>
                  {selectedContactPhone === "CUSTOM" && (
                    <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                  )}
                </button>
              </div>
            ) : (
              <div>
                <input
                  type="tel"
                  placeholder="Contoh: 08123456789"
                  value={effectivePhone}
                  onChange={(e) => setSelectedContactPhone(e.target.value)}
                  className="w-full rounded-xl border border-neutral-300 bg-white p-2.5 text-xs text-neutral-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            )}

            {selectedContactPhone === "CUSTOM" && (
              <div className="pt-1">
                <input
                  type="tel"
                  placeholder="Ketik nomor WhatsApp tujuan (08...)"
                  value={customPhone}
                  onChange={(e) => setCustomPhone(e.target.value)}
                  className="w-full rounded-xl border border-emerald-400 bg-white p-2.5 text-xs text-neutral-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  autoFocus
                />
              </div>
            )}
          </div>

          {/* 2. Pilih Template Pesan */}
          <div className="space-y-1.5">
            <label className="font-bold text-neutral-800 uppercase tracking-wider text-[11px] block">
              Pilih Format Template:
            </label>
            <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              {WHATSAPP_TEMPLATES.map((t) => {
                const isSelected = selectedTemplateId === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => {
                      setSelectedTemplateId(t.id);
                      setCustomEditedText(null);
                    }}
                    className={cn(
                      "px-3 py-1.5 rounded-xl font-bold whitespace-nowrap text-[11px] transition cursor-pointer border",
                      isSelected
                        ? "bg-neutral-900 text-white border-neutral-900 shadow-xs"
                        : "bg-white text-neutral-600 border-neutral-200 hover:bg-neutral-50"
                    )}
                  >
                    {t.title}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Live Message Textarea */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="font-bold text-neutral-800 uppercase tracking-wider text-[11px]">
                Pratinjau Pesan (Bisa Diedit):
              </label>
              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-neutral-600 hover:text-neutral-900 transition cursor-pointer"
              >
                {copied ? (
                  <Check className="h-3 w-3 text-emerald-600" />
                ) : (
                  <Copy className="h-3 w-3" />
                )}
                <span>{copied ? "Tersalin!" : "Salin Teks"}</span>
              </button>
            </div>

            <textarea
              rows={8}
              value={messageText}
              onChange={(e) => setCustomEditedText(e.target.value)}
              className="w-full rounded-xl border border-neutral-300 bg-neutral-50/50 p-3 text-xs leading-relaxed text-neutral-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
            />
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 border-t border-neutral-100 bg-neutral-50 flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-neutral-200 text-xs font-semibold text-neutral-700 hover:bg-neutral-100 transition cursor-pointer"
          >
            Batal
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-neutral-300 bg-white text-xs font-bold text-neutral-800 shadow-xs hover:bg-neutral-50 active:scale-95 transition cursor-pointer"
            >
              <Copy className="h-3.5 w-3.5 text-neutral-500" />
              <span>Salin</span>
            </button>

            <button
              type="button"
              onClick={handleOpenWhatsApp}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 text-xs font-bold text-white shadow-md hover:bg-emerald-700 active:scale-95 transition cursor-pointer"
            >
              <MessageSquare className="h-3.5 w-3.5 fill-current" />
              <span>Buka WhatsApp</span>
              <ExternalLink className="h-3 w-3 opacity-70" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
