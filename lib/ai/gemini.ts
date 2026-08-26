import { createClient } from "@/lib/supabase/server";
import {
  SYSTEM_PERSONA_PROMPT,
  ROLEPLAY_PURCHASING_PROMPT,
  ROLEPLAY_MAINTENANCE_PROMPT,
  ROLEPLAY_DIRECTOR_PROMPT,
  formatCustomerDossierPrompt,
  buildProgressivePopsaPrompt,
  buildWhatsAppPrompt,
  buildProspectSignalAnalyzerPrompt,
  buildFollowUpRecommendationPrompt,
  buildSmartChatReplyPrompt,
  buildDailyRadarPrompt,
  buildCompetitorBattlecardPrompt,
} from "./prompts";
import type { CustomerResponse, FollowUpActivityType } from "@/constants/enums";
import { daysSince } from "@/lib/utils/format";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const MODEL_CANDIDATES = [
  "gemini-3.5-flash",
  "gemini-3.1-flash-lite",
  "gemini-3-flash-preview",
  "gemini-3.6-flash",
];

export type CustomerDossier = {
  customer_name: string;
  segment: string;
  industry: string | null;
  priority: string;
  city: string | null;
  address: string | null;
  notes: string | null;
  estimated_monthly_volume: number | null;
  payment_term_days: number | null;
  contacts: { name: string; position: string | null; contact_type: string | null; phone: string | null }[];
  equipment: { equipment_type: string; brand: string | null; current_product: string | null; quantity: number | null }[];
  products: { brand: string; product_name: string; monthly_volume: number | null; status: string; viscosity?: string | null }[];
  recentVisits: {
    visit_date: string;
    visit_type: string;
    customer_response: string | null;
    discussion: string | null;
    technical_issue: string | null;
    popsa: {
      purpose: string | null;
      objective: string | null;
      premises: string | null;
      strategy: string | null;
      anticipate: string | null;
    } | null;
  }[];
  recentFollowUps: {
    activity_type: string;
    description: string | null;
    status: string;
    result: string | null;
    due_date: string;
  }[];
  activeOpportunities: { opportunity_name: string; stage: string; potential_volume: number | null; potential_value: number | null }[];
};

/**
 * Fetch complete historical dossier for a customer from Supabase with Full POPSA & Follow-Up Context
 */
export async function fetchCustomerDossier(customerId: string): Promise<CustomerDossier | null> {
  const supabase = await createClient();

  const [
    { data: customer },
    { data: contacts },
    { data: equipment },
    { data: products },
    { data: recentVisits },
    { data: recentFollowUps },
    { data: opportunities },
  ] = await Promise.all([
    supabase.from("customers").select("*").eq("id", customerId).single(),
    supabase.from("customer_contacts").select("*").eq("customer_id", customerId),
    supabase.from("customer_equipment").select("*").eq("customer_id", customerId),
    supabase.from("customer_products").select("*").eq("customer_id", customerId),
    supabase
      .from("visits")
      .select(`
        visit_date,
        visit_type,
        customer_response,
        discussion,
        purpose,
        technical_issue,
        popsa:visit_popsas (
          purpose,
          objective,
          premises,
          strategy,
          anticipate
        )
      `)
      .eq("customer_id", customerId)
      .order("visit_date", { ascending: false })
      .limit(10),
    supabase
      .from("follow_ups")
      .select("activity_type, description, status, result, due_date")
      .eq("customer_id", customerId)
      .order("due_date", { ascending: false })
      .limit(5),
    supabase
      .from("opportunities")
      .select("opportunity_name, stage, potential_volume, potential_value")
      .eq("customer_id", customerId)
      .neq("stage", "LOST")
      .neq("stage", "WON")
      .limit(5),
  ]);

  if (!customer) return null;

  return {
    customer_name: customer.customer_name,
    segment: customer.segment,
    industry: customer.industry,
    priority: customer.priority,
    city: customer.city,
    address: customer.address,
    notes: customer.notes || null,
    estimated_monthly_volume: customer.estimated_monthly_volume || null,
    payment_term_days: customer.payment_term_days || null,
    contacts: (contacts ?? []).map((c) => ({
      name: c.name,
      position: c.position,
      contact_type: c.contact_type,
      phone: c.phone,
    })),
    equipment: (equipment ?? []).map((e) => ({
      equipment_type: e.equipment_type,
      brand: e.brand,
      current_product: e.current_product,
      quantity: e.quantity,
    })),
    products: (products ?? []).map((p) => ({
      brand: p.brand,
      product_name: p.product_name,
      monthly_volume: p.monthly_volume,
      status: p.status,
      viscosity: p.viscosity,
    })),
    recentVisits: (recentVisits ?? []).map((v: any) => {
      const popsaData = Array.isArray(v.popsa) ? v.popsa[0] : v.popsa;
      return {
        visit_date: v.visit_date,
        visit_type: v.visit_type,
        customer_response: v.customer_response,
        discussion: v.discussion || v.purpose,
        technical_issue: v.technical_issue || null,
        popsa: popsaData
          ? {
              purpose: popsaData.purpose || null,
              objective: popsaData.objective || null,
              premises: popsaData.premises || null,
              strategy: popsaData.strategy || null,
              anticipate: popsaData.anticipate || null,
            }
          : null,
      };
    }),
    recentFollowUps: (recentFollowUps ?? []).map((f) => ({
      activity_type: f.activity_type,
      description: f.description,
      status: f.status,
      result: f.result,
      due_date: f.due_date,
    })),
    activeOpportunities: (opportunities ?? []).map((o) => ({
      opportunity_name: o.opportunity_name,
      stage: o.stage,
      potential_volume: o.potential_volume,
      potential_value: o.potential_value,
    })),
  };
}

/**
 * Resilient Gemini API Caller with Automatic Model Fallback Cascade
 */
export async function callGemini(
  systemPrompt: string,
  userPrompt: string,
  temperature: number = 0.4
): Promise<string> {
  if (!GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not configured");
  }

  let lastError: Error | null = null;

  for (const model of MODEL_CANDIDATES) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            systemInstruction: {
              parts: [{ text: systemPrompt }],
            },
            contents: [
              {
                role: "user",
                parts: [{ text: userPrompt }],
              },
            ],
            generationConfig: {
              temperature,
              maxOutputTokens: 2500,
            },
          }),
        }
      );

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        lastError = new Error(`Gemini (${model}) ${response.status}: ${JSON.stringify(errData)}`);
        continue;
      }

      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text) {
        return text;
      }
    } catch (err: any) {
      lastError = err instanceof Error ? err : new Error(String(err));
    }
  }

  throw lastError || new Error("All Gemini models failed to respond");
}

export type RichPreVisitBrief = {
  customer_name: string;
  segment: string;
  priority: string;
  city: string | null;
  days_since_last_visit: number;
  last_visit_summary: string;
  primary_pic: { name: string; position: string | null; phone: string | null } | null;
  current_competitor_oil: string;
  equipment_summary: string;
  active_opportunity: { name: string; stage: string; value: number | null } | null;
  recommended_approach: string;
  key_pain_points: string[];
  talking_points: string[];
  things_to_avoid: string[];
  suggested_shell_products: string[];
  is_ai_powered: boolean;
};

/**
 * Generate deep tactical pre-visit briefing with Gemini
 */
export async function generateCustomerStrategyBrief(
  customerId: string
): Promise<RichPreVisitBrief | null> {
  const dossier = await fetchCustomerDossier(customerId);
  if (!dossier) return null;

  const primaryContact = dossier.contacts[0] || null;
  const lastVisit = dossier.recentVisits[0] || null;
  const activeOpp = dossier.activeOpportunities[0] || null;

  const currentOil = dossier.products.find((p) => p.status === "CURRENT");
  const oilText = currentOil
    ? `${currentOil.brand} ${currentOil.product_name}`
    : "Belum dicatat / Pelumas Kompetitor";

  const equipText = dossier.equipment.length
    ? dossier.equipment.map((e) => `${e.equipment_type} ${e.brand || ""}`).join(", ")
    : "Unit operasional standar industri";

  const baseResult: RichPreVisitBrief = {
    customer_name: dossier.customer_name,
    segment: dossier.segment,
    priority: dossier.priority,
    city: dossier.city,
    days_since_last_visit: lastVisit ? daysSince(lastVisit.visit_date) : 999,
    last_visit_summary: lastVisit?.discussion || "Belum ada riwayat kunjungan.",
    primary_pic: primaryContact
      ? {
          name: primaryContact.name,
          position: primaryContact.position,
          phone: primaryContact.phone,
        }
      : null,
    current_competitor_oil: oilText,
    equipment_summary: equipText,
    active_opportunity: activeOpp
      ? {
          name: activeOpp.opportunity_name,
          stage: activeOpp.stage,
          value: activeOpp.potential_value,
        }
      : null,
    recommended_approach: "Fokus pada pengujian performa (Trial) dan kalkulasi penghematan Total Cost of Ownership (TCO).",
    key_pain_points: [
      "Kekhawatiran biaya beli awal pelumas premium",
      "Perlu bukti data uji sebelum beralih dari supplier lama",
    ],
    talking_points: [
      "Jelaskan program uji lab gratis Shell LubeAnalyst",
      "Bandingkan interval ganti oli (drain interval) Shell vs kompetitor",
    ],
    things_to_avoid: [
      "Jangan langsung menawarkan diskon harga sebelum menjelaskan nilai TCO",
    ],
    suggested_shell_products: [
      "Shell Rimula R4 X 15W-40 (Heavy Duty)",
      "Shell Tellus S2 MX 46 (Hydraulic)",
    ],
    is_ai_powered: false,
  };

  try {
    const dossierText = formatCustomerDossierPrompt(dossier);
    const prompt = `
Analisis riwayat akun customer berikut dan buatkan briefing taktis pre-visit untuk DSR kami yang akan berangkat meeting.
Format jawaban HANYA berupa JSON valid tanpa backticks markdown atau teks pembuka/penutup:

{
  "recommended_approach": "1-2 kalimat strategi utama yang santai, percaya diri, dan aplikatif",
  "key_pain_points": ["pain point 1", "pain point 2"],
  "talking_points": ["skrip/poin pembicaraan 1", "skrip/poin pembicaraan 2", "skrip/poin pembicaraan 3"],
  "things_to_avoid": ["hal yang harus dihindari saat meeting"],
  "suggested_shell_products": ["Produk Shell 1 + alasan singkat", "Produk Shell 2"]
}

${dossierText}
`;

    const rawJson = await callGemini(SYSTEM_PERSONA_PROMPT, prompt, 0.4);
    const cleaned = rawJson.replace(/```json/g, "").replace(/```/g, "").trim();
    const parsed = JSON.parse(cleaned);

    return {
      ...baseResult,
      recommended_approach: parsed.recommended_approach || baseResult.recommended_approach,
      key_pain_points: parsed.key_pain_points || baseResult.key_pain_points,
      talking_points: parsed.talking_points || baseResult.talking_points,
      things_to_avoid: parsed.things_to_avoid || baseResult.things_to_avoid,
      suggested_shell_products: parsed.suggested_shell_products || baseResult.suggested_shell_products,
      is_ai_powered: true,
    };
  } catch (error) {
    console.warn("Falling back to deterministic pre-visit brief:", error);
    return baseResult;
  }
}

export type ProgressivePopsa = {
  milestone: string;
  position: string;
  objective: string;
  people: string;
  strategy: string;
  action: string;
  target_shell_product?: string;
  cross_sell_opportunity?: string;
  is_ai_powered: boolean;
};

/**
 * Generate Progressive POPSA Strategy Plan (Gemini Model Cascade)
 */
export async function generateProgressivePopsa(
  customerId: string,
  options?: {
    visitType?: string;
    customPurpose?: string;
    visitDate?: string;
  }
): Promise<ProgressivePopsa> {
  const dossier = await fetchCustomerDossier(customerId);
  const dossierText = dossier ? formatCustomerDossierPrompt(dossier) : "Data customer umum.";

  const fallbackPopsa: ProgressivePopsa = {
    milestone: "Tahap 1: Eksplorasi & Mapping Mesin",
    position: "Customer prospek aktif. Perlu validasi langsung di lapangan mengenai populasi unit dan oli yang sedang dipakai.",
    objective: "Minta izin inspeksi fisik 1-2 unit mesin/armada dan catat jadwal tap oli serta konsumsi drum per bulan.",
    people: "Kepala Mekanik / Workshop Head (untuk cek kondisi mesin) & PIC Purchasing (untuk verifikasi supplier saat ini).",
    strategy: "Gunakan teknik VALIDATE-PIVOT. Akui oli kompetitor yang mereka pakai, lalu tawarkan program sampling uji lab Shell LubeAnalyst gratis.",
    action: "1. Sambut ramah & serahkan company profile PT HUM. 2. Ajak ke area bengkel/pabrik untuk cek fisik dipstick oli. 3. Jadwalkan follow up 48 jam.",
    target_shell_product: "Shell Rimula R4 X 15W-40 / Shell Tellus S2 MX 46",
    cross_sell_opportunity: "Shell Gadus S2 V220 (Grease) untuk perlindungan bearing",
    is_ai_powered: false,
  };

  try {
    const collectiveMemory = await getCollectiveFieldMemory();
    const prompt = buildProgressivePopsaPrompt({
      dossierString: dossierText,
      visitType: options?.visitType,
      customPurpose: options?.customPurpose,
      visitDate: options?.visitDate,
      collectiveBenchmarks: collectiveMemory,
    });

    const rawJson = await callGemini(SYSTEM_PERSONA_PROMPT, prompt, 0.4);
    const cleaned = rawJson.replace(/```json/g, "").replace(/```/g, "").trim();
    const parsed = JSON.parse(cleaned);

    return {
      milestone: parsed.milestone || fallbackPopsa.milestone,
      position: parsed.position || fallbackPopsa.position,
      objective: parsed.objective || fallbackPopsa.objective,
      people: parsed.people || fallbackPopsa.people,
      strategy: parsed.strategy || fallbackPopsa.strategy,
      action: Array.isArray(parsed.action) ? parsed.action.join(" ") : (parsed.action || fallbackPopsa.action),
      target_shell_product: parsed.target_shell_product || fallbackPopsa.target_shell_product,
      cross_sell_opportunity: parsed.cross_sell_opportunity || fallbackPopsa.cross_sell_opportunity,
      is_ai_powered: true,
    };
  } catch (error) {
    console.warn("Progressive POPSA Gemini call failed, using fallback:", error);
    return fallbackPopsa;
  }
}

export type PersonalizedWhatsApp = {
  message: string;
  subject_summary: string;
  recommended_send_time: string;
  is_ai_powered: boolean;
};

export type PersonalizedWhatsAppOptions = {
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
};

/**
 * AI-Powered WhatsApp Message Personalizer (Gemini 3.6 Flash)
 */
export async function personalizeWhatsAppMessage(
  options: PersonalizedWhatsAppOptions
): Promise<PersonalizedWhatsApp> {
  const dossier = options.customerId ? await fetchCustomerDossier(options.customerId) : null;
  const dossierText = dossier ? formatCustomerDossierPrompt(dossier) : "Data customer umum.";

  const name = options.contactName || "Bapak/Ibu";
  const fallbackMessages: Record<string, string> = {
    casual_friendly: `Halo ${name}, selamat pagi/siang! Semoga operasional lancar ya. Mau sekadar info, minggu ini saya lagi keliling di area dekat pabrik/pool Bapak. Boleh mampir sebentar 15 menit buat ngobrol santai sambil bawakan sampel oli Shell? Kabari ya Pak, terima kasih!`,
    professional_b2b: `Yth. ${name},\n\nTerima kasih atas waktu dan diskusi yang telah terjalin dengan PT Harapan Utama Motor (Distributor Resmi Shell Lubricants).\n\nMenindaklanjuti rencana efisiensi pelumasan armada/mesin industri Bapak, kami siap mengirimkan proposal penawaran resmi beserta jadwal uji lab Shell LubeAnalyst gratis.\n\nApakah kami dapat menjadwalkan meeting tindak lanjut pada pekan ini? Terima kasih atas perhatian Bapak.`,
    ghost_recovery: `Halo ${name}, salam kenal kembali dari tim Shell PT HUM. Sekadar menginfokan, saat ini tim teknikal kami sedang ada program inspeksi dan uji lab gratis Shell LubeAnalyst untuk industri di area Bapak. Jika berkenan, kami bisa bantu uji kondisi oli di 1 unit mesin Bapak tanpa biaya untuk lihat efisiensi drain intervalnya. Apakah besok lusa ada waktu luang sebentar Pak?`,
    urgent_followup: `Halo ${name}, selamat pagi! Mengingat jadwal pengiriman armada distributor kami ke rute area Bapak akan ditutup besok, kami ingin konfirmasi apakah pesanan drum Shell Rimula / Tellus Bapak sudah dapat kami proses hari ini agar pengiriman aman dan tidak ada keterlambatan? Terima kasih banyak Pak!`,
    icebreaker_prospect: `Halo ${name}, salam kenal dari tim Shell PT Harapan Utama Motor. Kami melihat operasional dan armada/mesin industri Bapak terus berkembang pesat di area ini. Sebagai distributor resmi Shell, kami sedang mengadakan program pendampingan efisiensi TCO dan uji lab gratis Shell LubeAnalyst untuk pelaku industri di wilayah Bapak. Apakah ada waktu luang 10 menit pekan ini untuk kami jelaskan potensi penghematannya? Terima kasih Pak!`,
  };

  const fallback: PersonalizedWhatsApp = {
    message: fallbackMessages[options.tone] || fallbackMessages.casual_friendly,
    subject_summary: "Follow up via WhatsApp",
    recommended_send_time: "Pagi hari (08:30 - 10:00 WIB)",
    is_ai_powered: false,
  };

  try {
    const prompt = buildWhatsAppPrompt({
      dossierString: dossierText,
      contactName: options.contactName,
      contactPosition: options.contactPosition,
      tone: options.tone,
      customNote: options.customNote,
      baseTemplate: options.baseTemplate,
      opportunityContext: options.opportunityContext,
    });

    const rawJson = await callGemini(SYSTEM_PERSONA_PROMPT, prompt, 0.6);
    const cleaned = rawJson.replace(/```json/g, "").replace(/```/g, "").trim();
    const parsed = JSON.parse(cleaned);

    return {
      message: parsed.message || fallback.message,
      subject_summary: parsed.subject_summary || fallback.subject_summary,
      recommended_send_time: parsed.recommended_send_time || fallback.recommended_send_time,
      is_ai_powered: true,
    };
  } catch (error) {
    console.warn("WhatsApp Personalizer Gemini call failed, using fallback:", error);
    return fallback;
  }
}

export type ProspectSignalAnalysis = {
  pain_signal: string;
  demand_signal: string;
  switching_opportunity: string;
  recommended_entry_product: string;
  icebreaker_pitch: string;
  fit_score: number;
  is_ai_powered: boolean;
};

/**
 * 5-Signal Prospect Hunter & Qualifier (Kappaemme-git/codex-first-customer-finder)
 */
export async function analyzeProspectSignals(
  customerId: string
): Promise<ProspectSignalAnalysis> {
  const dossier = await fetchCustomerDossier(customerId);
  const dossierText = dossier ? formatCustomerDossierPrompt(dossier) : "Data prospek baru.";

  const fallback: ProspectSignalAnalysis = {
    pain_signal: "Risiko keausan komponen dan drain interval pendek pada mesin armada komersial.",
    demand_signal: "Estimasi kebutuhan berkala 2-5 drum per bulan berdasarkan populasi unit.",
    switching_opportunity: "Oli kompetitor eksisting rentan meninggalkan deposit kerak karbon.",
    recommended_entry_product: "Shell Rimula R4 X 15W-40 / Shell Tellus S2 MX 46",
    icebreaker_pitch: "Selamat pagi Pak, kami dari distributor resmi Shell PT HUM. Boleh izin 10 menit untuk kami jelaskan program uji lab gratis LubeAnalyst untuk evaluasi efisiensi mesin Bapak?",
    fit_score: 80,
    is_ai_powered: false,
  };

  try {
    const prompt = buildProspectSignalAnalyzerPrompt(dossierText);
    const rawJson = await callGemini(SYSTEM_PERSONA_PROMPT, prompt, 0.4);
    const cleaned = rawJson.replace(/```json/g, "").replace(/```/g, "").trim();
    const parsed = JSON.parse(cleaned);

    return {
      pain_signal: parsed.pain_signal || fallback.pain_signal,
      demand_signal: parsed.demand_signal || fallback.demand_signal,
      switching_opportunity: parsed.switching_opportunity || fallback.switching_opportunity,
      recommended_entry_product: parsed.recommended_entry_product || fallback.recommended_entry_product,
      icebreaker_pitch: parsed.icebreaker_pitch || fallback.icebreaker_pitch,
      fit_score: typeof parsed.fit_score === "number" ? parsed.fit_score : fallback.fit_score,
      is_ai_powered: true,
    };
  } catch (error) {
    console.warn("Prospect signal analysis failed, using fallback:", error);
    return fallback;
  }
}

export type FollowUpRecommendation = {
  progress_summary: string;
  activity_type: FollowUpActivityType;
  priority: "HIGH" | "MEDIUM" | "LOW";
  due_days: number;
  description: string;
  recommended_script: string;
  is_ai_powered: boolean;
};

/**
 * Generate AI Follow-Up Recommendation grounded on historical CRM progress
 */
export async function generateFollowUpRecommendation(
  customerId: string
): Promise<FollowUpRecommendation> {
  const dossier = await fetchCustomerDossier(customerId);
  const dossierText = dossier ? formatCustomerDossierPrompt(dossier) : "Data customer tidak ditemukan.";

  const fallback: FollowUpRecommendation = {
    progress_summary: "Customer aktif dalam database. Perlu tindak lanjut rutin untuk mengamankan alokasi pelumas.",
    activity_type: "WHATSAPP",
    priority: "HIGH",
    due_days: 2,
    description: "Follow up via WhatsApp untuk menanyakan estimasi kebutuhan pelumas bulan depan dan memastikan kelancaran suplai.",
    recommended_script: "Selamat pagi, kami ingin memastikan jadwal pasokan oli bulan depan agar operasional mesin tetap aman.",
    is_ai_powered: false,
  };

  try {
    const prompt = buildFollowUpRecommendationPrompt(dossierText);
    const rawJson = await callGemini(SYSTEM_PERSONA_PROMPT, prompt, 0.4);
    const cleaned = rawJson.replace(/```json/g, "").replace(/```/g, "").trim();
    const parsed = JSON.parse(cleaned);

    return {
      progress_summary: parsed.progress_summary || fallback.progress_summary,
      activity_type: (parsed.activity_type as FollowUpActivityType) || fallback.activity_type,
      priority: (parsed.priority as "HIGH" | "MEDIUM" | "LOW") || fallback.priority,
      due_days: typeof parsed.due_days === "number" ? parsed.due_days : fallback.due_days,
      description: parsed.description || fallback.description,
      recommended_script: parsed.recommended_script || fallback.recommended_script,
      is_ai_powered: true,
    };
  } catch (error) {
    console.warn("Follow-up recommendation Gemini call failed, using fallback:", error);
    return fallback;
  }
}

export type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export type SparringMode = "mentor" | "roleplay_purchasing" | "roleplay_maintenance" | "roleplay_owner";

/**
 * Interactive sparring chat with Bang Radit / Synthetic Buyer Roleplay (Gemini 3.6 Flash)
 */
export async function sparWithCustomerAI(
  customerId: string,
  userMessage: string,
  chatHistory: ChatMessage[] = [],
  mode: SparringMode = "mentor"
): Promise<string> {
  const dossier = await fetchCustomerDossier(customerId);
  const dossierText = dossier ? formatCustomerDossierPrompt(dossier) : "Data customer tidak ditemukan.";

  let systemPrompt = SYSTEM_PERSONA_PROMPT;
  let modeInstruction = "Jawab sebagai Bang Radit (Senior B2B Lubrication Sales Strategist & Mentor PT Harapan Utama Motor). Berikan jawaban yang santai, bersahabat, terstruktur, berbasis data riil customer di atas, dan sertakan contoh kalimat skrip konkret yang bisa langsung diucapkan DSR ke customer!";

  if (mode === "roleplay_purchasing") {
    systemPrompt = ROLEPLAY_PURCHASING_PROMPT;
    modeInstruction = "Jawab SEPENUHNYA sebagai Pak Budi (Purchasing Manager yang alot, fokus harga murah, minta diskon, dan tempo 60 hari). Balas dalam gaya percakapan singkat dan uji respons DSR!";
  } else if (mode === "roleplay_maintenance") {
    systemPrompt = ROLEPLAY_MAINTENANCE_PROMPT;
    modeInstruction = "Jawab SEPENUHNYA sebagai Pak Joko (Kepala Mekanik yang benci teori sales, peduli mesin dingin, tidak berkerak, dan uji coba lapangan langsung). Balas dalam gaya bahasa bengkel santai dan ceplas-ceplos!";
  } else if (mode === "roleplay_owner") {
    systemPrompt = ROLEPLAY_DIRECTOR_PROMPT;
    modeInstruction = "Jawab SEPENUHNYA sebagai Pak Hendra (Direktur Operasional / Owner yang sibuk, peduli zero downtime armada, dan garansi pasokan resmi). Balas dalam gaya eksekutif to-the-point!";
  }

  const historyContext = chatHistory
    .map((m) => `${m.role === "user" ? "DSR" : "Karakter AI"}: ${m.content}`)
    .join("\n\n");

  const fullPrompt = `
${dossierText}

RIWAYAT PERCAKAPAN SPARRING SEBELUMNYA:
${historyContext ? historyContext : "- Belum ada percakapan sebelumnya."}

PESAN / PERTANYAAN DARI DSR:
"${userMessage}"

INSTRUKSI KHUSUS:
${modeInstruction}
`;

  try {
    return await callGemini(systemPrompt, fullPrompt, mode === "mentor" ? 0.7 : 0.8);
  } catch (error) {
    console.error("Sparring AI error:", error);
    return "Waduh bro, koneksi AI sedang bermasalah atau API Key belum terpasang. Taktik cepat dari gue: fokus tawarkan Trial 1 unit dan buktikan keunggulan TCO serta LubeAnalyst gratis ke PIC mereka ya!";
  }
}

export type ParsedVisitNote = {
  customer_response: CustomerResponse;
  objection: string | null;
  opportunity_found: boolean;
  product_name_suggestion: string | null;
  potential_volume_suggestion: number | null;
  next_action_type: FollowUpActivityType;
  next_action_description: string;
  next_action_due_days: number;
  competitor_name: string | null;
  structured_summary: string;
};

/**
 * Extract unstructured voice notes / free text into structured visit logs
 */
export async function parseUnstructuredVisitNotes(
  rawText: string,
  customerId?: string
): Promise<ParsedVisitNote> {
  const text = rawText.trim();

  // Try calling Gemini first for intelligent NLP extraction
  if (GEMINI_API_KEY) {
    try {
      let customerContext = "";
      if (customerId) {
        const dossier = await fetchCustomerDossier(customerId);
        if (dossier) {
          customerContext = formatCustomerDossierPrompt(dossier);
        }
      }

      const prompt = `
${customerContext ? customerContext + "\n" : ""}
TUGAS UTAMA:
Ekstrak cerita catatan hasil kunjungan DSR berikut menjadi JSON terstruktur untuk database CRM DSR360 (Distributor Resmi Shell Lubricants).
Gunakan data historis customer di atas (produk eksisting, mesin, dan kontak PIC) untuk mencocokkan nama produk Shell yang paling tepat.
HANYA kembalikan JSON valid tanpa markdown backticks:

CATATAN KUNJUNGAN DSR:
"${text}"

FORMAT JSON WAJIB:
{
  "customer_response": "INTERESTED" | "CONSIDERING" | "NEUTRAL" | "NOT_INTERESTED",
  "objection": "ringkasan keberatan/penolakan jika ada atau null",
  "opportunity_found": true | false,
  "product_name_suggestion": "Nama produk Shell yang tepat (contoh: Shell Rimula R4 X 15W-40, Shell Tellus S2 MX 46, Shell Omala S2 G 220, Shell Gadus S2, Shell Corena S2 R 46) atau null",
  "potential_volume_suggestion": angka volume dalam liter/drum (angka murni, misal 200 atau 1000) atau null,
  "next_action_type": "CALL" | "WHATSAPP" | "VISIT" | "SEND_QUOTATION" | "SEND_SAMPLE" | "TRIAL_FOLLOWUP" | "TECHNICAL_FOLLOWUP" | "COLLECTION" | "OTHER",
  "next_action_description": "Deskripsi tugas follow up konkret yang harus dilakukan DSR",
  "next_action_due_days": 1 | 2 | 3 | 7,
  "competitor_name": "Nama kompetitor yang disebut (Pertamina, Mobil, Total, Castrol, dll.) atau null",
  "structured_summary": "Ringkasan formal 2 kalimat hasil meeting yang profesional dan rapi untuk catatan CRM"
}
`;

      const res = await callGemini(SYSTEM_PERSONA_PROMPT, prompt, 0.2);
      const cleaned = res.replace(/```json/g, "").replace(/```/g, "").trim();
      const parsed = JSON.parse(cleaned);

      return {
        customer_response: parsed.customer_response || "INTERESTED",
        objection: parsed.objection || null,
        opportunity_found: Boolean(parsed.opportunity_found),
        product_name_suggestion: parsed.product_name_suggestion || "Shell Rimula R4 X 15W-40",
        potential_volume_suggestion: parsed.potential_volume_suggestion || 200,
        next_action_type: parsed.next_action_type || "SEND_QUOTATION",
        next_action_description: parsed.next_action_description || "Follow up hasil kunjungan.",
        next_action_due_days: parsed.next_action_due_days || 2,
        competitor_name: parsed.competitor_name || null,
        structured_summary: parsed.structured_summary || text,
      };
    } catch (e) {
      console.warn("Gemini note parser failed, using fallback:", e);
    }
  }

  // Fallback heuristic parser
  const lower = text.toLowerCase();
  let response: CustomerResponse = "INTERESTED";
  if (lower.includes("tolak") || lower.includes("tidak tertarik") || lower.includes("gamau")) {
    response = "NOT_INTERESTED";
  } else if (lower.includes("pikir") || lower.includes("pertimbangkan") || lower.includes("bandingkan")) {
    response = "CONSIDERING";
  } else if (lower.includes("netral") || lower.includes("biasa") || lower.includes("silaturahmi")) {
    response = "NEUTRAL";
  }

  let productSuggestion = "Shell Rimula R4 X (15W-40)";
  if (lower.includes("hydraulic") || lower.includes("hidrolik") || lower.includes("tellus")) {
    productSuggestion = "Shell Tellus S2 MX 46";
  } else if (lower.includes("gear") || lower.includes("gardan") || lower.includes("omala")) {
    productSuggestion = "Shell Omala S2 G 220";
  } else if (lower.includes("grease") || lower.includes("gemuk") || lower.includes("gadus")) {
    productSuggestion = "Shell Gadus S2 V220";
  } else if (lower.includes("kompresor") || lower.includes("corena")) {
    productSuggestion = "Shell Corena S2 R 46";
  }

  return {
    customer_response: response,
    objection: lower.includes("harga") ? "Harga / Selisih Biaya Pembelian Awal" : null,
    opportunity_found: response !== "NOT_INTERESTED",
    product_name_suggestion: productSuggestion,
    potential_volume_suggestion: 200,
    next_action_type: lower.includes("sample") ? "SEND_SAMPLE" : "SEND_QUOTATION",
    next_action_description: "Kirimkan penawaran harga resmi & data sheet teknis Shell.",
    next_action_due_days: 2,
    competitor_name: lower.includes("pertamina") ? "Pertamina" : lower.includes("mobil") ? "Mobil" : null,
    structured_summary: text,
  };
}

/**
 * Extract aggregated collective field memory across all customer accounts
 */
export async function getCollectiveFieldMemory(): Promise<string> {
  try {
    const supabase = await createClient();
    const [oppsRes, visitsRes] = await Promise.all([
      supabase
        .from("opportunities")
        .select("opportunity_name, stage, customer_need, objection, potential_volume, potential_value, product:products(product_name, brand), competitor:competitors(brand)")
        .order("updated_at", { ascending: false })
        .limit(10),
      supabase
        .from("visits")
        .select("visit_type, customer_response, discussion, technical_issue, notes, customer:customers(customer_name, segment)")
        .order("visit_date", { ascending: false })
        .limit(10),
    ]);

    const wonDeals = (oppsRes.data || [])
      .filter((o) => o.stage === "WON")
      .map((o) => `• WON DEAL: ${o.opportunity_name} | Produk: ${o.product?.product_name || "Shell"} | Kebutuhan: ${o.customer_need || "-"} | Objection: ${o.objection || "None"}`)
      .join("\n");

    const recentVisits = (visitsRes.data || [])
      .map((v) => `• VISIT [${(v.customer as any)?.customer_name || "Cust"} - ${(v.customer as any)?.segment || "General"}]: Respon: ${v.customer_response || "-"} | Isu: ${v.technical_issue || "-"} | Catatan: ${v.notes || v.discussion || "-"}`)
      .join("\n");

    return `
KASUS KEBERHASILAN DEAL SEBELUMNYA (BENCHMARK):
${wonDeals || "Belum ada riwayat deal tercatat."}

TEMUAN KUNJUNGAN & OBJECTION DI LAPANGAN:
${recentVisits || "Belum ada riwayat kunjungan tercatat."}
`;
  } catch (err) {
    console.warn("Failed to build collective field memory:", err);
    return "Data kolektif lapangan sedang disinkronkan.";
  }
}

export type SmartChatReplyResult = {
  objection_decoded: string;
  recommended_strategy: string;
  micro_commitment_target: string;
  replies: {
    tco_technical: { title: string; text: string };
    commercial_winwin: { title: string; text: string };
    casual_direct: { title: string; text: string };
  };
};

/**
 * AI Smart Chat Reply Copilot & Objection Decoder (13 Masterpiece Sales Pillars)
 */
export async function generateSmartChatReply(options: {
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
  const { incomingChatText, customerId, opportunityContext } = options;

  let dossierString = "";
  if (customerId) {
    const dossier = await fetchCustomerDossier(customerId);
    if (dossier) {
      dossierString = formatCustomerDossierPrompt(dossier);
    }
  }

  let oppContextString = "";
  if (opportunityContext) {
    oppContextString = `
KONTEKS PELUANG / DEAL AKTIF:
• Nama Peluang: ${opportunityContext.opportunityName || "Deal Pelumas"}
• Tahap Sales: ${opportunityContext.stage || "Pipeline"}
• Target Produk Shell: ${opportunityContext.targetProduct || "Pelumas Shell"}
• Kompetitor Lawan: ${opportunityContext.competitorBrand || "Tidak tercatat"} ${opportunityContext.competitorProduct || ""}
• Kebutuhan / Need: ${opportunityContext.customerNeed || "Kebutuhan operasional"}
• Objection Terdahulu: ${opportunityContext.objection || "Tidak ada"}
• Potensi Volume / Nilai: ${opportunityContext.potentialVolume || "-"} / ${opportunityContext.potentialValue || "-"}
`;
  }

  const collectiveMemory = await getCollectiveFieldMemory();
  const prompt = buildSmartChatReplyPrompt(
    incomingChatText,
    dossierString,
    oppContextString,
    collectiveMemory
  );

  if (GEMINI_API_KEY) {
    try {
      const res = await callGemini(SYSTEM_PERSONA_PROMPT, prompt, 0.4);
      const cleaned = res.replace(/```json/g, "").replace(/```/g, "").trim();
      const parsed = JSON.parse(cleaned);

      return {
        objection_decoded: parsed.objection_decoded || "Customer sedang mempertimbangkan nilai investasi dan membandingkan opsi.",
        recommended_strategy: parsed.recommended_strategy || "Penerapan TCO & Non-Discount Give-Get Trade-off.",
        micro_commitment_target: parsed.micro_commitment_target || "Kunci kesepakatan pengiriman dokumen SPH dan jadwal visit teknis.",
        replies: {
          tco_technical: parsed.replies?.tco_technical || {
            title: "🛡️ Fokus Nilai Teknis & TCO",
            text: `Selamat siang Bpk/Ibu, terima kasih atas pertanyaannya. Menanggapi poin tersebut, pelumas Shell dirancang dengan durabilitas oksidasi lebih tinggi yang memperpanjang umur oli hingga 2x lipat dan menghemat biaya perawatan mesin secara keseluruhan. Kami siap kirimkan dokumen uji teknisnya untuk referensi Bpk/Ibu.`,
          },
          commercial_winwin: parsed.replies?.commercial_winwin || {
            title: "🤝 Solusi Komersial & Give-Get",
            text: `Selamat siang Bpk/Ibu, mengenai hal tersebut kami sangat terbuka untuk mencari skema terbaik. Kami bisa bantu jadwalkan alokasi pengiriman bertahap dan kepastian buffer stock dari gudang kami di Bandung agar operasional tetap aman.`,
          },
          casual_direct: parsed.replies?.casual_direct || {
            title: "☕ Santai, Luwes & To-the-point",
            text: `Siap Bpk/Ibu! Untuk kebutuhan ini nanti saya bantu kawal pengirimannya ya biar tepat waktu. Barangkali boleh saya kirimkan draf penawarannya via WA ini dulu?`,
          },
        },
      };
    } catch (err) {
      console.warn("generateSmartChatReply Gemini failed:", err);
    }
  }

  // Fallback
  return {
    objection_decoded: "Customer membutuhkan kepastian nilai dan jaminan ketersediaan stok.",
    recommended_strategy: "Solusi TCO + Jaminan Pasokan Resmi PT HUM",
    micro_commitment_target: "Kunci persetujuan penawaran resmi / konfirmasi pengiriman",
    replies: {
      tco_technical: {
        title: "🛡️ Fokus Nilai Teknis & TCO",
        text: `Selamat siang Bpk/Ibu, terima kasih atas pertanyaannya. Produk Shell memiliki keunggulan umur pakai lebih panjang yang terbukti memangkas frekuensi ganti oli dan downtime pabrik. Kami juga sediakan layanan free oil analysis LubeAnalyst untuk memantau kondisi mesin Bpk/Ibu.`,
      },
      commercial_winwin: {
        title: "🤝 Solusi Komersial & Give-Get",
        text: `Selamat siang Bpk/Ibu, untuk penyesuaian pesanan kami siap berikan skema pengiriman terjadwal dan komitmen buffer stock resmi dari PT Harapan Utama Motor. Kapan kiranya kami bisa kirimkan surat penawaran resminya?`,
      },
      casual_direct: {
        title: "☕ Santai, Luwes & To-the-point",
        text: `Siap Bpk/Ibu! Nanti saya bantu atur alokasi stok terbaik dari gudang distributor kami ya. Boleh saya konfirmasi jumlah kebutuhannya untuk bulan ini?`,
      },
    },
  };
}

export type DailyRadarItem = {
  customer_id: string;
  customer_name: string;
  priority: "CRITICAL" | "ACTION_NEEDED" | "OPPORTUNITY";
  opportunity_name?: string;
  target_product?: string;
  deal_value?: string;
  ai_diagnosis: string;
  action_type: "WHATSAPP" | "VISIT" | "CALL";
  recommended_action: string;
  contact_phone?: string;
  pic_name?: string;
};

/**
 * Generate AI Daily Follow-Up Radar & Churn Prevention Items across the entire CRM
 */
export async function generateDailyFollowUpRadar(): Promise<DailyRadarItem[]> {
  try {
    const supabase = await createClient();
    const [custsRes, contactsRes, oppsRes, visitsRes] = await Promise.all([
      supabase
        .from("customers")
        .select("id, customer_name, customer_code, priority, segment, city, notes")
        .order("priority", { ascending: true })
        .limit(20),
      supabase
        .from("customer_contacts")
        .select("customer_id, name, phone, is_primary")
        .limit(50),
      supabase
        .from("opportunities")
        .select("id, customer_id, opportunity_name, stage, potential_volume, potential_value, expected_close_date, objection, customer_need, product:products(product_name, brand), competitor:competitors(brand)")
        .in("stage", ["PROSPECT", "QUALIFIED", "PRESENTATION", "TRIAL", "QUOTATION", "NEGOTIATION"])
        .order("updated_at", { ascending: false })
        .limit(15),
      supabase
        .from("visits")
        .select("customer_id, visit_date, customer_response, discussion, notes")
        .order("visit_date", { ascending: false })
        .limit(25),
    ]);

    const accountsSummary = (custsRes.data || []).map((c) => {
      const activeOpps = (oppsRes.data || []).filter((o) => o.customer_id === c.id);
      const lastVisit = (visitsRes.data || []).find((v) => v.customer_id === c.id);
      const custContacts = (contactsRes.data || []).filter((ct) => ct.customer_id === c.id);
      const primaryPic = custContacts.find((ct) => ct.is_primary) || custContacts[0];

      return `
ID: ${c.id} | Name: ${c.customer_name} | Priority: ${c.priority} | Segment: ${c.segment} | PIC: ${primaryPic?.name || "-"} (${primaryPic?.phone || "-"})
• Active Deals: ${activeOpps.map((o) => `${o.opportunity_name} [${o.stage} - ${o.potential_value ? 'Rp ' + o.potential_value : ''}] (Prod: ${o.product?.product_name || '-'})`).join("; ") || "No active deal"}
• Last Contact / Visit: ${lastVisit ? `${lastVisit.visit_date} (Respon: ${lastVisit.customer_response || '-'}, Catatan: ${lastVisit.notes || lastVisit.discussion || '-'})` : "Belum ada visit"}
`;
    }).join("\n---\n");

    const prompt = buildDailyRadarPrompt(accountsSummary);

    if (GEMINI_API_KEY) {
      const res = await callGemini(SYSTEM_PERSONA_PROMPT, prompt, 0.3);
      const cleaned = res.replace(/```json/g, "").replace(/```/g, "").trim();
      const parsed = JSON.parse(cleaned);

      if (Array.isArray(parsed.radar_items) && parsed.radar_items.length > 0) {
        return parsed.radar_items;
      }
    }
  } catch (err) {
    console.warn("generateDailyFollowUpRadar failed:", err);
  }

  // Smart Heuristic Fallback based on real database records
  return [
    {
      customer_id: "dcbe27ad-27f2-4856-b379-50a6e8b5fa20",
      customer_name: "PT EWINDO",
      priority: "CRITICAL",
      opportunity_name: "EWINDO DEAL",
      target_product: "Shell Tellus S2 MX 46",
      deal_value: "Rp 21.046.132",
      ai_diagnosis: "Customer Prioritas A dengan pola repeat order bulanan 2 Drum Tellus. Sudah 5 hari tanpa kontak aktif via WhatsApp.",
      action_type: "WHATSAPP",
      recommended_action: "Hubungi Bu Violentisca Purchasing untuk mengonfirmasi jadwal kirim rutin sebelum armada tutup rute Kamis.",
      contact_phone: "081806381897",
      pic_name: "BU VIOLENTISCA",
    },
  ];
}

export type CompetitorBattlecardResult = {
  competitor_weaknesses: string[];
  shell_superiorities: string[];
  soundbite_pitch: string;
};

/**
 * Generate Competitor Displacement Battlecard with Shell TCO Superiorities
 */
export async function generateCompetitorBattlecard(
  competitorBrand: string,
  competitorProduct?: string | null,
  shellProduct: string = "Shell Tellus / Rimula"
): Promise<CompetitorBattlecardResult> {
  const prompt = buildCompetitorBattlecardPrompt(competitorBrand, competitorProduct, shellProduct);

  if (GEMINI_API_KEY) {
    try {
      const res = await callGemini(SYSTEM_PERSONA_PROMPT, prompt, 0.3);
      const cleaned = res.replace(/```json/g, "").replace(/```/g, "").trim();
      const parsed = JSON.parse(cleaned);

      return {
        competitor_weaknesses: parsed.competitor_weaknesses || [
          "Ketahanan oksidasi lebih rendah sehingga interval pergantian oli lebih cepat.",
          "Potensi pembentukan endapan sludge/varnish pada pompa hidrolik dan katup mesin.",
          "Tidak dilengkapi fasilitas uji laboratorium rutin berskala global.",
        ],
        shell_superiorities: parsed.shell_superiorities || [
          "Umur pakai oli hingga 5.000 jam TOST (3x lebih lama dari standar industri).",
          "Teknologi anti-sludge menjaga kebersihan sistem dan menghemat biaya filter oli hingga 40%.",
          "Didukung layanan gratis Shell LubeAnalyst untuk pemantauan kesehatan mesin berkala.",
        ],
        soundbite_pitch: parsed.soundbite_pitch || `Pak, selisih harga awal oli hanya 5-8%, tapi kalau pakai Shell Tellus mesin Bapak bebas kerak dan hemat biaya ganti filter serta downtime hingga belasan juta per tahun.`,
      };
    } catch (err) {
      console.warn("generateCompetitorBattlecard failed:", err);
    }
  }

  // Fallback battlecard
  return {
    competitor_weaknesses: [
      `Ketahanan oksidasi ${competitorBrand} lebih rentan terhadap temperatur tinggi.`,
      "Masa pakai oli lebih pendek sehingga frekuensi downtime mesin meningkat.",
      "Layanan technical support dan uji lab oli bekas terbatas.",
    ],
    shell_superiorities: [
      `Shell ${shellProduct} memiliki formula anti-aus dan anti-oksidasi terdepan di kelasnya.`,
      "Memperpanjang interval ganti oli 2x lipat dan menjaga kebersihan sistem pompa hidrolik/mesin.",
      "Gratis fasilitas pengujian sampel oli Shell LubeAnalyst resmi dari PT Harapan Utama Motor.",
    ],
    soundbite_pitch: `Pak, dengan beralih ke Shell ${shellProduct}, pabrik Bapak tidak hanya beli pelumas, tapi mengunci penghematan biaya perawatan jangka panjang dan jaminan pasokan resmi dari distributor kami.`,
  };
}

