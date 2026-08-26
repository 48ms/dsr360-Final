"use server";

import {
  generateCustomerStrategyBrief,
  sparWithCustomerAI,
  parseUnstructuredVisitNotes as parseWithGemini,
  type RichPreVisitBrief,
  type ParsedVisitNote,
  type ChatMessage,
} from "@/lib/ai/gemini";

export type { RichPreVisitBrief, ParsedVisitNote, ChatMessage };

// Legacy alias for PreVisitBrief
export type PreVisitBrief = RichPreVisitBrief;

/**
 * Server action to get deep tactical pre-visit briefing for a customer
 */
export async function getPreVisitAIBrief(customerId: string): Promise<RichPreVisitBrief | null> {
  return generateCustomerStrategyBrief(customerId);
}

/**
 * Server action to spar / brainstorm tactically with Bang Radit (Gemini 3.6 Flash)
 */
export async function sparWithAI(
  customerId: string,
  userMessage: string,
  chatHistory: ChatMessage[] = []
): Promise<string> {
  return sparWithCustomerAI(customerId, userMessage, chatHistory);
}

/**
 * Server action to parse freeform voice notes / text into structured visit log
 */
export async function parseUnstructuredVisitNotes(
  rawText: string,
  customerId?: string
): Promise<ParsedVisitNote> {
  return parseWithGemini(rawText, customerId);
}

export type ObjectionBattlecard = {
  objection: string;
  competitor_claim: string;
  shell_counter_argument: string;
  key_proof_point: string;
};

export async function getObjectionBattlecards(): Promise<ObjectionBattlecard[]> {
  return [
    {
      objection: "Harga Shell Lebih Mahal 15-20% Dibanding Kompetitor",
      competitor_claim: "Pertamina Meditran / Mobil Delvac harga per liter lebih murah di awal.",
      shell_counter_argument:
        "Fokus pada Total Cost of Ownership (TCO). Shell Rimula R4 X mampu memperpanjang drain interval dari 10.000 km menjadi 15.000+ km, mengurangi frekuensi pergantian filter, dan memotong downtime armada.",
      key_proof_point: "Hemat biaya perawatan hingga 22% per tahun walau harga beli per liter lebih tinggi.",
    },
    {
      objection: "Customer Masih Terikat Kontrak Supplier Lama",
      competitor_claim: "Kontrak pengadaan baru berakhir 6 bulan lagi.",
      shell_counter_argument:
        "Tawarkan pengujian (Trial) pada 1 atau 2 unit mesin baru terlebih dahulu tanpa membatalkan kontrak eksisting, sehingga saat tender/kontrak baru dibuka, customer sudah memegang data lab keunggulan Shell.",
      key_proof_point: "Zero risk trial — data pengujian lab independen menjadi acuan keputusan manajemen.",
    },
    {
      objection: "Khawatir Menghanguskan Garansi Mesin / OEM",
      competitor_claim: "Pabrikan mesin merekomendasikan oli bawaan pabrik.",
      shell_counter_argument:
        "Shell memiliki sertifikasi OEM Approval resmi dari pabrikan kelas dunia (Mercedes-Benz, Komatsu, Caterpillar, Volvo, Scania, Cummins, MAN).",
      key_proof_point: "Surat persetujuan OEM resmi Shell melindungi garansi unit 100%.",
    },
    {
      objection: "Oli Hidrolik Cepat Panas & Mengalami Kerak",
      competitor_claim: "Kondisi suhu pabrik/site memang ekstrem.",
      shell_counter_argument:
        "Shell Tellus S2 MX/VX memiliki indeks viskositas tinggi dan stabilitas termal unggul yang mencegah pembentukan deposit pernis (varnish) pada katup presisi hidrolik.",
      key_proof_point: "Efisiensi transmisi hidrolik meningkat hingga 3-5% dan memperpanjang umur pompa.",
    },
    {
      objection: "Gearbox Sering Panas & Mengalami Aus Gigi",
      competitor_claim: "Beban kerja mesin pabrik memang 24 jam nonstop.",
      shell_counter_argument:
        "Shell Omala S2 G 220 memberikan perlindungan micro-pitting kelas atas yang menjaga kontak permukaan gigi gir tetap halus walau terkena beban kejut (shock load).",
      key_proof_point: "Menurunkan temperatur operasi gearbox hingga 5-8°C.",
    },
  ];
}

