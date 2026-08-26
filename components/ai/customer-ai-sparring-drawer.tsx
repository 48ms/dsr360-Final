"use client";

import { useState, useRef, useEffect, useTransition } from "react";
import { sparWithAI, type ChatMessage, type SparringMode } from "@/actions/ai";
import {
  Sparkles,
  Send,
  X,
  Bot,
  User,
  Loader2,
  Lightbulb,
  MessageSquareQuote,
  Flame,
  RotateCcw,
  GraduationCap,
  Briefcase,
  Wrench,
  Building,
} from "lucide-react";
import { useToast } from "@/components/ui/toast-context";
import { cn } from "@/lib/utils/cn";

interface CustomerAISparringDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  customerId: string;
  customerName: string;
}

type PersonaModeConfig = {
  id: SparringMode;
  name: string;
  title: string;
  avatarIcon: React.ElementType;
  badge: string;
  badgeBg: string;
  initialMessage: (customerName: string) => string;
  pills: { label: string; prompt: string; icon: React.ElementType }[];
};

const PERSONA_CONFIGS: Record<SparringMode, PersonaModeConfig> = {
  mentor: {
    id: "mentor",
    name: "Bang Radit",
    title: "Senior Sales Strategist & Field Mentor",
    avatarIcon: GraduationCap,
    badge: "Senior Mentor",
    badgeBg: "bg-amber-500/20 text-amber-300 border-amber-500/40",
    initialMessage: (customerName) =>
      `Halo bro! Gua Bang Radit, AI Sales Mentor lo di Nyales24/7 (oleh Bima Maulana Saputra). Gua udah pelajari profil lengkap dan data riwayat **${customerName}**.\n\nMau kita brainstorming strategi apa buat kunjungan atau follow-up berikutnya? Pilih topik di atas atau langsung tanyakan situasi lapangan lo! 🚀`,
    pills: [
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
        label: "🛢️ Rekomendasi Trial 1 Unit",
        prompt: "Berdasarkan mesin dan oli eksisting mereka, produk Shell apa yang paling cocok gue tawarkan buat trial 1-2 unit dulu?",
        icon: Flame,
      },
      {
        label: "📦 Peluang Cross-Sell",
        prompt: "Selain oli mesin utama, ada celah buat masuk oli hidrolik Tellus atau grease Gadus gak di akun ini?",
        icon: Lightbulb,
      },
    ],
  },
  roleplay_purchasing: {
    id: "roleplay_purchasing",
    name: "Pak Budi (Purchasing)",
    title: "Simulasi Manajer Pengadaan / Purchasing",
    avatarIcon: Briefcase,
    badge: "Roleplay: Purchasing",
    badgeBg: "bg-blue-500/20 text-blue-300 border-blue-500/40",
    initialMessage: () =>
      `"Selamat siang Mas DSR. Saya Budi dari bagian Purchasing. Tolong langsung to-the-point saja ya, hari ini kami padat. Kenapa saya harus beli Shell dari PT HUM kalau Pertamina dan supplier lama kami harganya jauh lebih murah 15-20% dan kasih tempo 60 hari?"`,
    pills: [
      {
        label: "💸 Jawaban Selisih Harga 20%",
        prompt: "Pak Budi, selisih harga 20% di awal itu wajar karena Shell Rimula punya drain interval 15.000 km, jadi dalam 1 tahun Bapak justru hemat 4x biaya ganti oli dan filter.",
        icon: MessageSquareQuote,
      },
      {
        label: "🤝 Negosiasi TOP & Volume",
        prompt: "Terkait TOP 60 hari, jika perusahaan Bapak berkomitmen untuk kontrak suplai 10 drum per bulan, kami bisa ajukan fasilitas kredit khusus ke manajemen kami.",
        icon: Lightbulb,
      },
      {
        label: "🧪 Tawarkan Uji Lab Gratis",
        prompt: "Izin Pak Budi, boleh kami ambil sampel 1 unit untuk uji lab Shell LubeAnalyst gratis? Biar ada data riil sebelum bicara kontrak.",
        icon: Flame,
      },
    ],
  },
  roleplay_maintenance: {
    id: "roleplay_maintenance",
    name: "Pak Joko (Kepala Mekanik)",
    title: "Simulasi Kepala Bengkel / Maintenance Head",
    avatarIcon: Wrench,
    badge: "Roleplay: Mekanik",
    badgeBg: "bg-orange-500/20 text-orange-300 border-orange-500/40",
    initialMessage: () =>
      `"Siang Mas. Maaf tangan saya masih belepotan oli di bengkel. Sales oli biasanya cuma pinter janji di brosur. Di unit truk/mesin pabrik kita, masalahnya oli cepat hitam di km 8.000 dan mesin cepat panas kalau nanjak. Shell bisa jamin apa emangnya?"`,
    pills: [
      {
        label: "🔧 Solusi Mesin Panas & Kerak",
        prompt: "Pak Joko, Shell Rimula R4 X pakai aditif Dynamic Protection Plus yang mencegah pembentukan deposit kerak di piston sehingga mesin tetap dingin di tanjakan terjal.",
        icon: MessageSquareQuote,
      },
      {
        label: "🔍 Cek Fisik Bersama",
        prompt: "Boleh saya ikut cek ke kolong unit sekarang Pak? Kita cabut dipstick bareng untuk cek konsistensi oli yang sedang jalan.",
        icon: Lightbulb,
      },
      {
        label: "📊 Gratis LubeVideoCheck",
        prompt: "Kami dari PT HUM punya alat endoskopi LubeVideoCheck gratis, bisa kita intip ruang bakar tanpa bongkar mesin Pak.",
        icon: Flame,
      },
    ],
  },
  roleplay_owner: {
    id: "roleplay_owner",
    name: "Pak Hendra (Direktur Ops)",
    title: "Simulasi Direktur Operasional / Owner",
    avatarIcon: Building,
    badge: "Roleplay: Direktur",
    badgeBg: "bg-purple-500/20 text-purple-300 border-purple-500/40",
    initialMessage: () =>
      `"Halo rekan DSR PT HUM. Saya Hendra. Armada truk kami membawa muatan bernilai miliaran setiap hari. Yang saya butuhkan adalah zero-downtime dan jaminan suplai resmi tanpa pernah ada armada mogok di jalan. Apa proposal kalkulasi efisiensi yang Anda bawa?"`,
    pills: [
      {
        label: "📈 Kalkulasi ROI & TCO",
        prompt: "Pak Hendra, dengan beralih ke Shell Rimula dan Tellus, downtime armada dapat ditekan hingga 30%, menghemat potensi kerugian operasional puluhan juta per unit.",
        icon: MessageSquareQuote,
      },
      {
        label: "📜 Garansi Pasokan Resmi Shell",
        prompt: "PT HUM adalah distributor resmi resmi Shell dengan gudang berkapasitas ribuan drum dan sertifikat CoA resmi dari Shell Global.",
        icon: Lightbulb,
      },
      {
        label: "🏆 Sertifikasi OEM Dunia",
        prompt: "Semua produk Shell mengantongi approval resmi dari Mercedes, Komatsu, Volvo, dan Scania sehingga garansi aset Bapak terjaga 100%.",
        icon: Flame,
      },
    ],
  },
};

export function CustomerAISparringDrawer({
  isOpen,
  onClose,
  customerId,
  customerName,
}: CustomerAISparringDrawerProps) {
  const { error } = useToast();
  const [activeMode, setActiveMode] = useState<SparringMode>("mentor");

  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      role: "assistant",
      content: PERSONA_CONFIGS.mentor.initialMessage(customerName),
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

  const currentPersona = PERSONA_CONFIGS[activeMode];

  function handleSwitchMode(mode: SparringMode) {
    if (mode === activeMode) return;
    setActiveMode(mode);
    setMessages([
      {
        role: "assistant",
        content: PERSONA_CONFIGS[mode].initialMessage(customerName),
      },
    ]);
  }

  function handleSendMessage(textToSend?: string) {
    const query = (textToSend || inputPrompt).trim();
    if (!query || isPending) return;

    const newMessages: ChatMessage[] = [...messages, { role: "user", content: query }];
    setMessages(newMessages);
    setInputPrompt("");

    startTransition(async () => {
      try {
        const response = await sparWithAI(customerId, query, newMessages, activeMode);
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
        content: currentPersona.initialMessage(customerName),
      },
    ]);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3 sm:p-4 backdrop-blur-xs animate-fade-in-up">
      <div className="relative flex flex-col h-[92vh] max-h-[780px] w-full max-w-2xl rounded-2xl bg-white shadow-2xl border border-neutral-200 overflow-hidden">
        {/* Top Header */}
        <div className="flex items-center justify-between px-5 py-3 bg-neutral-900 text-white border-b border-neutral-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-tr from-amber-500 to-amber-400 text-neutral-950 font-bold shadow-xs">
              <Sparkles className="h-5 w-5 fill-current" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold tracking-tight">AI Sparring & Roleplay Arena</h2>
                <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-bold border", currentPersona.badgeBg)}>
                  {currentPersona.badge}
                </span>
              </div>
              <p className="text-[11px] text-neutral-400 font-medium truncate max-w-[240px] sm:max-w-md">
                Target Akun: <strong className="text-neutral-200">{customerName}</strong>
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

        {/* Persona Mode Switcher Tabs */}
        <div className="px-4 py-2 bg-neutral-900/95 border-b border-neutral-800 flex gap-1.5 overflow-x-auto no-scrollbar shrink-0">
          {(Object.keys(PERSONA_CONFIGS) as SparringMode[]).map((modeKey) => {
            const config = PERSONA_CONFIGS[modeKey];
            const isSelected = activeMode === modeKey;
            const Icon = config.avatarIcon;
            return (
              <button
                key={modeKey}
                type="button"
                onClick={() => handleSwitchMode(modeKey)}
                className={cn(
                  "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer border",
                  isSelected
                    ? "bg-white text-neutral-900 border-white shadow-xs font-bold"
                    : "bg-neutral-800/80 text-neutral-300 border-neutral-700 hover:bg-neutral-700"
                )}
              >
                <Icon className={cn("h-3.5 w-3.5", isSelected ? "text-amber-600" : "text-neutral-400")} />
                <span>{config.name}</span>
              </button>
            );
          })}
        </div>

        {/* Quick Prompt / Dialogue Scenario Pills Bar */}
        <div className="px-4 py-2.5 bg-neutral-50 border-b border-neutral-100 flex gap-2 overflow-x-auto no-scrollbar shrink-0">
          {currentPersona.pills.map((pill, i) => {
            const Icon = pill.icon;
            return (
              <button
                key={i}
                type="button"
                onClick={() => handleSendMessage(pill.prompt)}
                disabled={isPending}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-neutral-200 text-[11px] font-semibold text-neutral-800 shadow-2xs hover:bg-amber-50 hover:border-amber-300 hover:text-amber-950 transition whitespace-nowrap active:scale-95 disabled:opacity-50 cursor-pointer" /* impeccable-disable-line gray-on-color */
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
                <span>
                  {activeMode === "mentor"
                    ? "Bang Radit sedang menyusun taktik..."
                    : `${currentPersona.name} sedang merespons argumentasimu...`}
                </span>
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
              placeholder={
                activeMode === "mentor"
                  ? "Ketik pertanyaan atau situasi lapangan ke Bang Radit..."
                  : `Latih argumenmu melawan ${currentPersona.name}...`
              }
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
