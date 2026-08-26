"use server";

import {
  generateCustomerStrategyBrief,
  sparWithCustomerAI,
  parseUnstructuredVisitNotes as parseWithGemini,
  personalizeWhatsAppMessage as personalizeWithGemini,
  generateProgressivePopsa as generatePopsaWithGemini,
  analyzeProspectSignals as analyzeProspectWithGemini,
  generateFollowUpRecommendation as generateFollowUpWithGemini,
  generateSmartChatReply as generateSmartChatReplyWithGemini,
  generateDailyFollowUpRadar as generateDailyRadarWithGemini,
  generateCompetitorBattlecard as generateBattlecardWithGemini,
  analyzeProductTDSWithGemini,
  type RichPreVisitBrief,
  type ParsedVisitNote,
  type ChatMessage,
  type SparringMode,
  type PersonalizedWhatsApp,
  type ProgressivePopsa,
  type ProspectSignalAnalysis,
  type FollowUpRecommendation,
  type SmartChatReplyResult,
  type DailyRadarItem,
  type CompetitorBattlecardResult,
  type ProductTDSAnalysisResult,
} from "@/lib/ai/gemini";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export type {
  RichPreVisitBrief,
  ParsedVisitNote,
  ChatMessage,
  SparringMode,
  PersonalizedWhatsApp,
  ProgressivePopsa,
  ProspectSignalAnalysis,
  FollowUpRecommendation,
  SmartChatReplyResult,
  DailyRadarItem,
  CompetitorBattlecardResult,
  ProductTDSAnalysisResult,
};

// Legacy alias for PreVisitBrief
export type PreVisitBrief = RichPreVisitBrief;

/**
 * Server action to get deep tactical pre-visit briefing for a customer
 */
export async function getPreVisitAIBrief(customerId: string): Promise<RichPreVisitBrief | null> {
  return generateCustomerStrategyBrief(customerId);
}

/**
 * Server action to spar / brainstorm tactically with Bang Radit / Synthetic Buyer (Gemini 3.6 Flash)
 */
export async function sparWithAI(
  customerId: string,
  userMessage: string,
  chatHistory: ChatMessage[] = [],
  mode: SparringMode = "mentor"
): Promise<string> {
  return sparWithCustomerAI(customerId, userMessage, chatHistory, mode);
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

/**
 * Server action to personalize WhatsApp messages with Gemini 3.6 Flash
 */
export async function personalizeWhatsAppAction(options: {
  customerId?: string;
  contactName?: string;
  contactPosition?: string;
  tone: "casual_friendly" | "professional_b2b" | "ghost_recovery" | "urgent_followup" | "icebreaker_prospect";
  customNote?: string;
  baseTemplate?: string;
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
}): Promise<PersonalizedWhatsApp> {
  return personalizeWithGemini(options);
}

/**
 * Server action to generate progressive POPSA strategy plan
 */
export async function generateProgressivePopsaAction(
  customerId: string,
  options?: {
    visitType?: string;
    customPurpose?: string;
    visitDate?: string;
  }
): Promise<ProgressivePopsa> {
  return generatePopsaWithGemini(customerId, options);
}

/**
 * Server action to analyze 5 signals for a new prospect account
 */
export async function analyzeProspectSignalsAction(customerId: string): Promise<ProspectSignalAnalysis> {
  return analyzeProspectWithGemini(customerId);
}

/**
 * Server action to generate AI follow-up recommendation grounded on CRM history
 */
export async function generateFollowUpRecommendationAction(customerId: string): Promise<FollowUpRecommendation> {
  return generateFollowUpWithGemini(customerId);
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
      key_proof_point: "Zero risk trial: data pengujian lab independen menjadi acuan keputusan manajemen.",
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

/**
 * Server action to generate 3 tactical AI chat replies based on 13 sales pillars & collective memory
 */
export async function generateSmartChatReplyAction(options: {
  incomingChatText: string;
  customerId?: string;
  contactName?: string;
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
}): Promise<SmartChatReplyResult> {
  return generateSmartChatReplyWithGemini(options);
}

/**
 * Server action to get AI Daily Follow-Up Radar across the entire CRM
 */
export async function getDailyFollowUpRadarAction(): Promise<DailyRadarItem[]> {
  return generateDailyRadarWithGemini();
}

/**
 * Server action to get Competitor Displacement Battlecard
 */
export async function getCompetitorBattlecardAction(
  competitorBrand: string,
  competitorProduct?: string | null,
  shellProduct?: string
): Promise<CompetitorBattlecardResult> {
  return generateBattlecardWithGemini(competitorBrand, competitorProduct, shellProduct);
}

/**
 * Server action to automatically log WhatsApp follow-up in CRM
 */
export async function logWhatsAppFollowUpAction(options: {
  customerId: string;
  contactName?: string;
  summary: string;
}): Promise<{ success: boolean }> {
  try {
    const supabase = await createClient();
    const { data: user } = await supabase.auth.getUser();

    if (!user?.user?.id) {
      return { success: false };
    }

    await supabase.from("follow_ups").insert({
      customer_id: options.customerId,
      activity_type: "WHATSAPP",
      status: "COMPLETED",
      description: `Pesan WhatsApp terkirim ke ${options.contactName || "PIC"}: ${options.summary}`,
      due_date: new Date().toISOString().split("T")[0],
      result: "Pesan WhatsApp terkirim melalui AI Copilot DSR360.",
      user_id: user.user.id,
    });

    revalidatePath(`/customers/${options.customerId}`);
    revalidatePath("/follow-ups");
    return { success: true };
  } catch (err) {
    console.error("Failed to log WhatsApp follow-up:", err);
    return { success: false };
  }
}

/**
 * Server action to get deep technical analysis on any Shell product (Gemini LubeExpert)
 */
export async function getDeepProductTDSAnalysisAction(
  productName: string,
  question: string
): Promise<ProductTDSAnalysisResult> {
  return analyzeProductTDSWithGemini(productName, question);
}

/**
 * Server action to run autonomous forensic audit and populate daily radar (Hermes Engine)
 */
export async function runHermesNightlyDispatcherAction() {
  const { runAutonomousNightlyDispatcher } = await import("@/lib/ai/hermes");
  const result = await runAutonomousNightlyDispatcher();
  revalidatePath("/follow-ups");
  revalidatePath("/dashboard");
  return result;
}

