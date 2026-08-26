"use client";

import { useState, useRef, useEffect, useTransition } from "react";
import { sparWithAI, type ChatMessage } from "@/actions/ai";
import {
  Sparkles,
  Send,
  X,
  Bot,
  User,
  Loader2,
  Lightbulb,
  MessageSquareQuote,
  ShieldAlert,
  Flame,
  RotateCcw,
} from "lucide-react";
import { useToast } from "@/components/ui/toast-context";

interface CustomerAISparringDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  customerId: string;
  customerName: string;
}

const QUICK_PROMPT_PILLS = [
  {
    label: "🎯 Taktik Buka Obrolan",
    prompt: "Gimana cara paling asik dan santai buat buka obrolan saat baru sampai di lokasi customer ini besok?",
    icon: Lightbulb,
  },
  {
    label: "💰 Lawan Keberatan Harga",
    prompt: "Kalau PIC bilang harga oli Shell lebih mahal dibanding Pertamina/oli lama mereka, gimana cara jawabnya yang elegan tanpa perang diskon?",
    icon: MessageSquareQuote,
  },
  {
    label: "🛢️ Rekomendasi Produk & Trial",
    prompt: "Berdasarkan mesin dan oli eksisting mereka, produk Shell apa yang paling cocok gue tawarkan buat trial 1-2 unit dulu?",
    icon: Flame,
  },
  {
    label: "⚠️ Jebakan yang Harus Dihindari",
    prompt: "Ada hal krusial atau isu di kunjungan-kunjungan sebelumnya yang HARUS gue hindari pas ngobrol?",
    icon: ShieldAlert,
  },
];

export function CustomerAISparringDrawer({
  isOpen,
  onClose,
  customerId,
  customerName,
}: CustomerAISparringDrawerProps) {
  const { error } = useToast();
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      role: "assistant",
      content: `Halo bro! Gua Bang Radit, AI Sales Mentor lo di PT Harapan Utama Motor. Gua udah baca seluruh data historis, kontak PIC, dan riwayat kunjungan **${customerName}**.\n\nMau kita brainstorming strategi apa buat kunjungan atau follow-up berikutnya? Pilih topik di atas atau langsung ketik situasi lo di lapangan! 🚀`,
    },
  ]);
  const [inputPrompt, setInputPrompt] = useState("");
  const [isPending, startTransition] = useTransition();
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  // Scroll to bottom
  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isPending, isOpen]);

  if (!isOpen) return null;

  function handleSendMessage(textToSend?: string) {
    const query = (textToSend || inputPrompt).trim();
    if (!query || isPending) return;

    const newMessages: ChatMessage[] = [...messages, { role: "user", content: query }];
    setMessages(newMessages);
    setInputPrompt("");

    startTransition(async () => {
      try {
        const response = await sparWithAI(customerId, query, newMessages);
        setMessages((prev) => [...prev, { role: "assistant", content: response }]);
      } catch (err) {
        console.error("AI Sparring Error:", err);
        error("Gagal terhubung ke AI. Coba tanyakan kembali.");
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "Maaf bro, respon AI terputus. Boleh diulang pertanyaannya?",
          },
        ]);
      }
    });
  }

  function handleResetChat() {
    setMessages([
      {
        role: "assistant",
        content: `Sip, riwayat obrolan di-reset! Ada taktik lain yang mau kita diskusikan buat **${customerName}**?`,
      },
    ]);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3 sm:p-4 backdrop-blur-xs animate-fade-in-up">
      <div className="relative flex flex-col h-[90vh] max-h-[750px] w-full max-w-2xl rounded-2xl bg-white shadow-2xl border border-neutral-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-neutral-900 text-white border-b border-neutral-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-tr from-amber-500 to-amber-400 text-neutral-950 font-bold shadow-xs">
              <Sparkles className="h-5 w-5 fill-current" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold tracking-tight">AI Sales Sparring & Strategist</h2>
                <span className="rounded-full bg-amber-400/20 px-2 py-0.5 text-[10px] font-bold text-amber-300">
                  Gemini 3.6 Flash
                </span>
              </div>
              <p className="text-[11px] text-neutral-400 font-medium truncate max-w-[240px] sm:max-w-md">
                Brainstorming strategi khusus: <strong className="text-neutral-200">{customerName}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handleResetChat}
              title="Reset Diskusi"
              className="rounded-lg p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 transition cursor-pointer"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 transition cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Quick Prompt Pills Bar */}
        <div className="px-4 py-2.5 bg-neutral-50 border-b border-neutral-100 flex gap-2 overflow-x-auto no-scrollbar shrink-0">
          {QUICK_PROMPT_PILLS.map((pill, i) => {
            const Icon = pill.icon;
            return (
              <button
                key={i}
                type="button"
                onClick={() => handleSendMessage(pill.prompt)}
                disabled={isPending}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-neutral-200 text-[11px] font-semibold text-neutral-700 shadow-2xs hover:bg-amber-50 hover:border-amber-300 hover:text-amber-900 transition whitespace-nowrap active:scale-95 disabled:opacity-50 cursor-pointer"
              >
                <Icon className="h-3.5 w-3.5 text-amber-600 shrink-0" />
                <span>{pill.label}</span>
              </button>
            );
          })}
        </div>

        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-neutral-50/40">
          {messages.map((m, idx) => {
            const isAI = m.role === "assistant";
            return (
              <div
                key={idx}
                className={`flex items-start gap-2.5 ${isAI ? "justify-start" : "justify-end"}`}
              >
                {isAI && (
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-neutral-900 text-amber-400 text-xs font-bold shadow-2xs mt-0.5">
                    <Bot className="h-4 w-4" />
                  </div>
                )}

                <div
                  className={`rounded-2xl px-4 py-3 text-xs leading-relaxed max-w-[85%] sm:max-w-[78%] shadow-2xs ${
                    isAI
                      ? "bg-white text-neutral-800 border border-neutral-200/80 prose prose-xs"
                      : "bg-neutral-900 text-white font-medium ml-auto"
                  }`}
                >
                  <div className="whitespace-pre-wrap">{m.content}</div>
                </div>

                {!isAI && (
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-amber-500 text-white text-xs font-bold shadow-2xs mt-0.5">
                    <User className="h-4 w-4" />
                  </div>
                )}
              </div>
            );
          })}

          {isPending && (
            <div className="flex items-start gap-2.5">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-neutral-900 text-amber-400 text-xs font-bold shadow-2xs mt-0.5">
                <Bot className="h-4 w-4" />
              </div>
              <div className="rounded-2xl bg-white px-4 py-3 text-xs text-neutral-500 border border-neutral-200/80 shadow-2xs flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin text-amber-500" />
                <span>Bang Radit sedang menganalisa data customer...</span>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 bg-white border-t border-neutral-200 shrink-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              placeholder="Ketik pertanyaan atau situasi lo ke Bang Radit..."
              disabled={isPending}
              className="flex-1 rounded-xl border border-neutral-300 bg-neutral-50 px-4 py-2.5 text-xs text-neutral-900 placeholder:text-neutral-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            />
            <button
              type="submit"
              disabled={!inputPrompt.trim() || isPending}
              className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-neutral-900 px-4 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-neutral-800 active:scale-95 transition disabled:opacity-40 cursor-pointer"
            >
              <Send className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Kirim</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
