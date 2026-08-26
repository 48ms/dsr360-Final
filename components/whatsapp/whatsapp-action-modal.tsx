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
import {
  personalizeWhatsAppAction,
  generateSmartChatReplyAction,
  logWhatsAppFollowUpAction,
  type SmartChatReplyResult,
} from "@/actions/ai";
import { useToast } from "@/components/ui/toast-context";
import {
  MessageSquare,
  Copy,
  ExternalLink,
  X,
  User,
  Phone,
  Check,
  Sparkles,
  Loader2,
  Clock,
  Send,
  Coffee,
  Briefcase,
  Ghost,
  Zap,
  Target,
  Bot,
  MessageCircle,
  HelpCircle,
  ShieldCheck,
  Handshake,
  CornerDownRight,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

export type WhatsAppActionModalProps = {
  isOpen: boolean;
  onClose: () => void;
  customerName: string;
  customerId?: string;
  defaultPhone?: string | null;
  contacts?: WhatsAppContact[];
  defaultTemplate?: WhatsAppTemplateType;
  context?: Partial<WhatsAppTemplateContext>;
  opportunityContext?: {
    opportunityName?: string;
    stage?: string;
    targetProduct?: string;
    competitorBrand?: string;
    competitorProduct?: string;
    customerNeed?: string;
    objection?: string;
    potentialVolume?: string | number | null;
    potentialValue?: string | number | null;
  };
};

type AITone = "casual_friendly" | "professional_b2b" | "ghost_recovery" | "urgent_followup" | "icebreaker_prospect";
type ModalTab = "DRAFT" | "REPLY_COPILOT";

const AI_TONE_OPTIONS: { id: AITone; label: string; icon: React.ElementType; desc: string }[] = [
  { id: "casual_friendly", label: "Santai & Akrab", icon: Coffee, desc: "Bahasa hangat & akrab (cocok untuk Kepala Mekanik / follow-up rutin)" },
  { id: "professional_b2b", label: "Formal B2B", icon: Briefcase, desc: "Sopan & terstruktur (cocok untuk Purchasing & Direksi)" },
  { id: "icebreaker_prospect", label: "Icebreaker Prospek", icon: Target, desc: "Pancingan cerdas 5-sinyal untuk akun prospek baru" },
  { id: "ghost_recovery", label: "Re-engage Ghosting", icon: Ghost, desc: "Bangkitkan PIC yang lama tidak membalas / read doang" },
  { id: "urgent_followup", label: "Urgent Follow-Up", icon: Zap, desc: "Batas promo / jadwal pengiriman armada distributor" },
];

const QUICK_OBJECTION_CHIPS = [
  { label: "🏷️ Harga Shell Lebih Mahal vs Pertamina/Mobil", prompt: "Harga Shell kenapa lebih mahal dari Pertamina/Mobil? Bos minta diskon kalau mau deal." },
  { label: "📦 Stok di Gudang Masih Cukup", prompt: "Stok oli kami masih ada mas, nanti aja kalau sudah menipis baru dikabari." },
  { label: "⏱️ Minta Tempo / TOP 60-90 Hari", prompt: "Bisa dapat tempo pembayaran 60 atau 90 hari gak kalau kami ambil banyak?" },
  { label: "🚪 Belum Bisa Dikunjungi / Minta Kirim WA Saja", prompt: "Lagi sibuk mas belum bisa terima tamu visit pabrik, kirimkan saja brosur dan penawarannya via WA." },
  { label: "🧪 Minta Free Uji Lab / Sertifikat Halal", prompt: "Bisa minta sample gratis dan surat sertifikat resmi serta free uji lab LubeAnalyst untuk mesin kami?" },
];

export function WhatsAppActionModal({
  isOpen,
  onClose,
  customerName,
  customerId,
  defaultPhone,
  contacts = [],
  defaultTemplate = "POST_VISIT_SUMMARY",
  context = {},
  opportunityContext,
}: WhatsAppActionModalProps) {
  const { success, error } = useToast();

  const initialPhone = contacts[0]?.phone || defaultPhone || "";
  const initialName = contacts[0]?.name || "";

  // Selected Tab State
  const [activeTab, setActiveTab] = useState<ModalTab>("DRAFT");

  // Selected Contact State
  const [selectedContactPhone, setSelectedContactPhone] = useState<string>(initialPhone);
  const [selectedContactName, setSelectedContactName] = useState<string>(initialName);
  const [customPhone, setCustomPhone] = useState<string>("");

  // Selected Template & Message Content
  const [selectedTemplateId, setSelectedTemplateId] =
    useState<WhatsAppTemplateType>(defaultTemplate);
  const [customEditedText, setCustomEditedText] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // AI Personalization State
  const [isAIPowered, setIsAIPowered] = useState(false);
  const [selectedTone, setSelectedTone] = useState<AITone>("casual_friendly");
  const [customNote, setCustomNote] = useState("");
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [recommendedTime, setRecommendedTime] = useState<string | null>(null);

  // Copilot Chat Reply State
  const [incomingChatInput, setIncomingChatInput] = useState("");
  const [isGeneratingReply, setIsGeneratingReply] = useState(false);
  const [chatReplyResult, setChatReplyResult] = useState<SmartChatReplyResult | null>(null);

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
    opportunityProduct: context.opportunityProduct || opportunityContext?.targetProduct,
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

  async function handleGenerateAI(tone: AITone = selectedTone) {
    setIsGeneratingAI(true);
    try {
      const res = await personalizeWhatsAppAction({
        customerId: customerId || "",
        contactName: selectedContactName || context.picName || undefined,
        tone,
        customNote: customNote || undefined,
        baseTemplate: messageText || undefined,
        opportunityContext,
      });

      setCustomEditedText(res.message);
      setRecommendedTime(res.recommended_send_time);
      setIsAIPowered(true);
      success("✨ Pesan berhasil dipersonalisasi dengan Gemini 3.6 Flash!");
    } catch (err) {
      console.error(err);
      error("Gagal mempersonalisasi pesan via AI. Menggunakan template standar.");
    } finally {
      setIsGeneratingAI(false);
    }
  }

  async function handleGenerateChatReply(textToProcess: string = incomingChatInput) {
    if (!textToProcess.trim()) {
      error("Masukkan atau paste pesan dari customer terlebih dahulu.");
      return;
    }

    setIsGeneratingReply(true);
    try {
      const res = await generateSmartChatReplyAction({
        incomingChatText: textToProcess,
        customerId,
        contactName: selectedContactName || context.picName,
        opportunityContext,
      });

      setChatReplyResult(res);
      success("🤖 3 Opsi balasan cerdas berhasil diracik!");
    } catch (err) {
      console.error(err);
      error("Gagal meracik balasan AI. Coba lagi.");
    } finally {
      setIsGeneratingReply(false);
    }
  }

  function handleApplyReplyOption(replyText: string) {
    setCustomEditedText(replyText);
    setIsAIPowered(true);
    setActiveTab("DRAFT");
    success("✅ Balasan AI diterapkan ke pesan WhatsApp!");
  }

  async function handleCopy() {
    if (!messageText) return;
    try {
      await navigator.clipboard.writeText(messageText);
      setCopied(true);
      success("Pesan WhatsApp berhasil disalin!");
      setTimeout(() => setCopied(false), 2500);
    } catch {
      error("Gagal menyalin pesan.");
    }
  }

  async function handleOpenWhatsApp() {
    if (!effectivePhone) {
      error("Nomor WhatsApp belum dipilih / tidak valid.");
      return;
    }
    const clean = sanitizeIndonesianPhone(effectivePhone);
    if (!clean) {
      error("Format nomor telepon tidak valid.");
      return;
    }

    // Auto log follow-up in background if customerId is present
    if (customerId) {
      logWhatsAppFollowUpAction({
        customerId,
        contactName: selectedContactName || context.picName,
        summary: messageText.substring(0, 140) + "...",
      }).catch(console.error);
    }

    const url = generateWhatsAppUrl(clean, messageText);
    window.open(url, "_blank", "noopener,noreferrer");
    onClose();
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="wa-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in-up"
    >
      <div className="relative w-full max-w-xl rounded-3xl bg-white shadow-2xl border border-neutral-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-100 bg-neutral-900 text-white">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500 text-white shadow-xs">
              <MessageSquare className="h-4 w-4" />
            </div>
            <div>
              <h2 id="wa-modal-title" className="text-sm font-bold tracking-tight flex items-center gap-2">
                <span>WhatsApp AI Copilot</span>
                {isAIPowered && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold text-amber-300 border border-amber-500/40">
                    <Sparkles className="h-2.5 w-2.5" /> AI Grounded
                  </span>
                )}
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

        {/* Tab Switcher (Buat Draf vs Bales Chat Customer) */}
        <div className="flex border-b border-neutral-200 bg-neutral-100/70 p-1.5 gap-1.5 text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveTab("DRAFT")}
            className={cn(
              "flex-1 py-2 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer",
              activeTab === "DRAFT"
                ? "bg-white text-neutral-900 shadow-xs"
                : "text-neutral-600 hover:bg-white/60"
            )}
          >
            <MessageCircle className="h-3.5 w-3.5 text-emerald-600" />
            <span>📝 Buat Draf Pesan</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("REPLY_COPILOT")}
            className={cn(
              "flex-1 py-2 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer",
              activeTab === "REPLY_COPILOT"
                ? "bg-white text-amber-950 shadow-xs"
                : "text-neutral-600 hover:bg-white/60"
            )}
          >
            <Bot className="h-3.5 w-3.5 text-amber-600 animate-pulse" />
            <span>🤖 Bales Chat Customer</span>
            <span className="bg-amber-100 text-amber-800 text-[9px] px-1.5 py-0.2 rounded-full">Baru</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
          {/* Deal & Competitor Context Banner */}
          {opportunityContext && (
            <div className="rounded-2xl border border-amber-200 bg-amber-50/80 p-3.5 space-y-1.5 shadow-2xs">
              <div className="flex items-center justify-between text-amber-950 font-bold text-[11px]">
                <span className="flex items-center gap-1.5">
                  <Target className="h-3.5 w-3.5 text-amber-600" />
                  Konteks Deal: {opportunityContext.opportunityName || "Deal Pelumas"}
                </span>
                <span className="bg-amber-200/80 text-amber-900 px-2 py-0.5 rounded-md text-[10px] uppercase">
                  {opportunityContext.stage || "PIPELINE"}
                </span>
              </div>
              <p className="text-[11px] text-neutral-800 font-medium">
                🎯 Target: <strong>{opportunityContext.targetProduct || "Pelumas Shell"}</strong>
                {opportunityContext.competitorBrand ? ` · Geser: ${opportunityContext.competitorBrand}` : ""}
              </p>
              {opportunityContext.objection && (
                <p className="text-[11px] text-red-800 bg-red-50/60 p-1.5 rounded-lg border border-red-200/60">
                  ⚠️ <strong>Catatan Objection:</strong> {opportunityContext.objection}
                </p>
              )}
            </div>
          )}

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
                      <div>
                        <p className="font-bold text-neutral-900 text-xs">{c.name}</p>
                        <p className="text-[11px] text-neutral-500 font-mono">{c.phone}</p>
                        {c.role && (
                          <span className="inline-block mt-0.5 text-[10px] bg-neutral-200/70 text-neutral-700 px-1.5 py-0.5 rounded font-medium">
                            {c.role}
                          </span>
                        )}
                      </div>
                      {isSelected && <Check className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <input
                  type="tel"
                  value={effectivePhone}
                  onChange={(e) => {
                    setSelectedContactPhone("CUSTOM");
                    setCustomPhone(e.target.value);
                  }}
                  placeholder="0812xxxxxxx"
                  className="flex-1 rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs text-neutral-900"
                />
              </div>
            )}
          </div>

          {/* ========================================================================= */}
          {/* TAB 1: BUAT DRAF PESAN BARU (TONE SELECTOR + AI)                          */}
          {/* ========================================================================= */}
          {activeTab === "DRAFT" && (
            <div className="space-y-4">
              {/* Persona / Tone Selector */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-neutral-800 uppercase tracking-wider text-[11px] flex items-center gap-1">
                    <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                    <span>Gaya Bahasa / Tone AI (13 Pilar Sales):</span>
                  </label>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                  {AI_TONE_OPTIONS.map((t) => {
                    const isSelected = selectedTone === t.id;
                    const IconComp = t.icon;
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setSelectedTone(t.id)}
                        className={cn(
                          "flex items-center gap-1.5 p-2 rounded-xl border text-left transition cursor-pointer",
                          isSelected
                            ? "border-amber-500 bg-amber-50/80 ring-2 ring-amber-400/30 text-amber-950 font-bold"
                            : "border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50"
                        )}
                      >
                        <IconComp className={cn("h-3.5 w-3.5 shrink-0", isSelected ? "text-amber-600" : "text-neutral-400")} />
                        <span className="truncate text-[11px]">{t.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Action Button: Generate AI */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={isGeneratingAI}
                  onClick={() => handleGenerateAI(selectedTone)}
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-4 py-2.5 text-xs font-bold text-white shadow-xs hover:from-amber-600 hover:to-amber-700 transition cursor-pointer disabled:opacity-50"
                >
                  {isGeneratingAI ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Meracik Pesan dengan Gemini 3.6 Flash...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 text-amber-200 animate-pulse" />
                      <span>Personalisasi Pesan via Gemini 3.6 Flash</span>
                    </>
                  )}
                </button>
              </div>

              {recommendedTime && (
                <div className="flex items-center gap-2 rounded-xl bg-amber-50 p-2.5 text-[11px] text-amber-900 border border-amber-200">
                  <Clock className="h-3.5 w-3.5 text-amber-600 shrink-0" />
                  <span><strong>Waktu Rekomendasi Kirim:</strong> {recommendedTime}</span>
                </div>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 2: COPILOT BALES CHAT CUSTOMER (OBJECTION DECODER)                    */}
          {/* ========================================================================= */}
          {activeTab === "REPLY_COPILOT" && (
            <div className="space-y-4 bg-amber-50/40 p-4 rounded-2xl border border-amber-200">
              <div className="space-y-1">
                <label className="font-bold text-amber-950 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                  <Bot className="h-4 w-4 text-amber-600" />
                  <span>Paste Chat / Keberatan dari Customer:</span>
                </label>
                <p className="text-[11px] text-neutral-600">
                  Salin chat customer yang sulit dijawab (soal harga, stok, tempo, atau kompetitor).
                </p>
              </div>

              <textarea
                rows={3}
                value={incomingChatInput}
                onChange={(e) => setIncomingChatInput(e.target.value)}
                placeholder="Contoh: 'Harga Shell Tellus lebih mahal 8% dari Pertamina Turalik, bos minta diskon kalau mau deal...'"
                className="w-full rounded-xl border border-neutral-300 bg-white p-3 text-xs text-neutral-900 outline-none focus:ring-2 focus:ring-amber-300"
              />

              {/* Quick Objection Chips */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider block">
                  ⚡ Atau Pilih Keberatan Cepat di Lapangan:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {QUICK_OBJECTION_CHIPS.map((chip, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setIncomingChatInput(chip.prompt);
                        handleGenerateChatReply(chip.prompt);
                      }}
                      className="rounded-lg bg-white border border-neutral-200 px-2.5 py-1 text-[11px] font-semibold text-neutral-800 hover:bg-amber-100 hover:border-amber-300 hover:text-amber-950 transition cursor-pointer text-left shadow-2xs" /* impeccable-disable-line gray-on-color */
                    >
                      {chip.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Generate Button */}
              <button
                type="button"
                disabled={isGeneratingReply}
                onClick={() => handleGenerateChatReply()}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-neutral-900 px-4 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-neutral-800 transition cursor-pointer disabled:opacity-50"
              >
                {isGeneratingReply ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin text-amber-400" />
                    <span>Membedah Chat & Meracik Strategi 13 Pilar...</span>
                  </>
                ) : (
                  <>
                    <Bot className="h-4 w-4 text-amber-300" />
                    <span>✨ Racik 3 Pilihan Balasan Taktis</span>
                  </>
                )}
              </button>

              {/* Generated Reply Options */}
              {chatReplyResult && (
                <div className="space-y-3 pt-2 border-t border-amber-200/80 animate-fade-in-up">
                  {/* Analysis Box */}
                  <div className="rounded-xl bg-white p-3 border border-amber-300 text-xs space-y-1">
                    <p className="font-bold text-amber-950 flex items-center gap-1.5 text-[11px]">
                      <Target className="h-3.5 w-3.5 text-amber-600" />
                      <span>Diagnosa Motif: {chatReplyResult.objection_decoded}</span>
                    </p>
                    <p className="text-[11px] text-emerald-800 font-semibold bg-emerald-50 p-1.5 rounded-lg border border-emerald-200">
                      🎯 <strong>Target Komitmen yang Harus Dikunci:</strong> {chatReplyResult.micro_commitment_target}
                    </p>
                  </div>

                  {/* 3 Clickable Reply Cards */}
                  <div className="space-y-2">
                    {/* Option 1: TCO & Technical */}
                    <div className="rounded-xl bg-white p-3 border border-neutral-200 hover:border-amber-400 transition space-y-1.5 shadow-2xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-neutral-900 text-xs flex items-center gap-1">
                          <ShieldCheck className="h-3.5 w-3.5 text-blue-600" />
                          {chatReplyResult.replies.tco_technical.title}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleApplyReplyOption(chatReplyResult.replies.tco_technical.text)}
                          className="bg-emerald-600 text-white font-bold text-[10px] px-2.5 py-1 rounded-lg hover:bg-emerald-700 transition cursor-pointer shadow-2xs"
                        >
                          Pilih &amp; Pakai &rarr;
                        </button>
                      </div>
                      <p className="text-neutral-700 text-[11px] leading-relaxed italic">
                        &ldquo;{chatReplyResult.replies.tco_technical.text}&rdquo;
                      </p>
                    </div>

                    {/* Option 2: Commercial & Give-Get */}
                    <div className="rounded-xl bg-white p-3 border border-neutral-200 hover:border-amber-400 transition space-y-1.5 shadow-2xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-neutral-900 text-xs flex items-center gap-1">
                          <Handshake className="h-3.5 w-3.5 text-amber-600" />
                          {chatReplyResult.replies.commercial_winwin.title}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleApplyReplyOption(chatReplyResult.replies.commercial_winwin.text)}
                          className="bg-emerald-600 text-white font-bold text-[10px] px-2.5 py-1 rounded-lg hover:bg-emerald-700 transition cursor-pointer shadow-2xs"
                        >
                          Pilih &amp; Pakai &rarr;
                        </button>
                      </div>
                      <p className="text-neutral-700 text-[11px] leading-relaxed italic">
                        &ldquo;{chatReplyResult.replies.commercial_winwin.text}&rdquo;
                      </p>
                    </div>

                    {/* Option 3: Casual Direct */}
                    <div className="rounded-xl bg-white p-3 border border-neutral-200 hover:border-amber-400 transition space-y-1.5 shadow-2xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-neutral-900 text-xs flex items-center gap-1">
                          <Coffee className="h-3.5 w-3.5 text-emerald-600" />
                          {chatReplyResult.replies.casual_direct.title}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleApplyReplyOption(chatReplyResult.replies.casual_direct.text)}
                          className="bg-emerald-600 text-white font-bold text-[10px] px-2.5 py-1 rounded-lg hover:bg-emerald-700 transition cursor-pointer shadow-2xs"
                        >
                          Pilih &amp; Pakai &rarr;
                        </button>
                      </div>
                      <p className="text-neutral-700 text-[11px] leading-relaxed italic">
                        &ldquo;{chatReplyResult.replies.casual_direct.text}&rdquo;
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Text Editor (Message Preview) */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="font-bold text-neutral-800 uppercase tracking-wider text-[11px] flex items-center gap-1">
                <Send className="h-3.5 w-3.5 text-neutral-500" />
                <span>Pratinjau &amp; Edit Pesan Terakhir:</span>
              </label>
              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center gap-1 text-[11px] font-bold text-neutral-600 hover:text-neutral-900 cursor-pointer"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copied ? "Tersalin" : "Salin Teks"}</span>
              </button>
            </div>

            <textarea
              rows={6}
              value={messageText}
              onChange={(e) => setCustomEditedText(e.target.value)}
              className="w-full rounded-2xl border border-neutral-300 bg-neutral-50/50 p-3.5 text-xs text-neutral-900 font-sans leading-relaxed focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition shadow-2xs"
            />
          </div>
        </div>

        {/* Modal Action Footer */}
        <div className="flex items-center justify-between p-4 border-t border-neutral-100 bg-neutral-50/80">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-neutral-200 bg-white px-4 py-2 text-xs font-semibold text-neutral-700 hover:bg-neutral-100 transition cursor-pointer"
          >
            Tutup
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 rounded-xl border border-neutral-200 bg-white px-4 py-2 text-xs font-bold text-neutral-700 hover:bg-neutral-100 transition cursor-pointer shadow-2xs"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
              <span>Salin</span>
            </button>

            <button
              type="button"
              onClick={handleOpenWhatsApp}
              className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-5 py-2 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 transition cursor-pointer"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              <span>Buka WhatsApp</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
