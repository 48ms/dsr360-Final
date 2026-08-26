import { createClient } from "@/lib/supabase/server";
import { SYSTEM_PERSONA_PROMPT, formatCustomerDossierPrompt } from "./prompts";
import type { CustomerResponse, FollowUpActivityType } from "@/constants/enums";
import { daysSince } from "@/lib/utils/format";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const MODEL_NAME = "gemini-3.6-flash";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent`;

export type CustomerDossier = {
  customer_name: string;
  segment: string;
  industry: string | null;
  priority: string;
  city: string | null;
  address: string | null;
  contacts: { name: string; position: string | null; contact_type: string | null; phone: string | null }[];
  equipment: { equipment_type: string; brand: string | null; current_product: string | null; quantity: number | null }[];
  products: { brand: string; product_name: string; monthly_volume: number | null; status: string }[];
  recentVisits: { visit_date: string; visit_type: string; customer_response: string | null; discussion: string | null; technical_issue: string | null }[];
  activeOpportunities: { opportunity_name: string; stage: string; potential_volume: number | null; potential_value: number | null }[];
};

/**
 * Fetch complete historical dossier for a customer from Supabase
 */
export async function fetchCustomerDossier(customerId: string): Promise<CustomerDossier | null> {
  const supabase = await createClient();

  const [
    { data: customer },
    { data: contacts },
    { data: equipment },
    { data: products },
    { data: recentVisits },
    { data: opportunities },
  ] = await Promise.all([
    supabase.from("customers").select("*").eq("id", customerId).single(),
    supabase.from("customer_contacts").select("*").eq("customer_id", customerId),
    supabase.from("customer_equipment").select("*").eq("customer_id", customerId),
    supabase.from("customer_products").select("*").eq("customer_id", customerId),
    supabase
      .from("visits")
      .select("visit_date, visit_type, customer_response, discussion, purpose")
      .eq("customer_id", customerId)
      .order("visit_date", { ascending: false })
      .limit(10),
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
    })),
    recentVisits: (recentVisits ?? []).map((v) => ({
      visit_date: v.visit_date,
      visit_type: v.visit_type,
      customer_response: v.customer_response,
      discussion: v.discussion || v.purpose,
      technical_issue: null,
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
 * Direct REST helper to call Gemini API
 */
async function callGemini(
  systemInstruction: string,
  userPrompt: string,
  temperature = 0.7
): Promise<string> {
  if (!GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY_NOT_CONFIGURED");
  }

  const response = await fetch(`${API_URL}?key=${GEMINI_API_KEY}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      system_instruction: {
        parts: [{ text: systemInstruction }],
      },
      contents: [
        {
          role: "user",
          parts: [{ text: userPrompt }],
        },
      ],
      generationConfig: {
        temperature,
        maxOutputTokens: 1500,
      },
    }),
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(`Gemini API Error: ${JSON.stringify(errData)}`);
  }

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    throw new Error("Empty response from Gemini API");
  }

  return text;
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

  // Base fallback structure
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

export type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

/**
 * Interactive sparring chat with Bang Radit (Gemini 3.6 Flash)
 */
export async function sparWithCustomerAI(
  customerId: string,
  userMessage: string,
  chatHistory: ChatMessage[] = []
): Promise<string> {
  const dossier = await fetchCustomerDossier(customerId);
  const dossierText = dossier ? formatCustomerDossierPrompt(dossier) : "Data customer tidak ditemukan.";

  const historyContext = chatHistory
    .map((m) => `${m.role === "user" ? "DSR" : "Bang Radit (AI)"}: ${m.content}`)
    .join("\n\n");

  const fullPrompt = `
${dossierText}

RIWAYAT DISKUSI SPARRING SEBELUMNYA:
${historyContext ? historyContext : "- Belum ada diskusi sebelumnya."}

PERTANYAAN / SITUASI DARI DSR LAPANGAN:
"${userMessage}"

Instruksi: Jawab sebagai Bang Radit (Senior B2B Lubrication Sales Strategist PT Harapan Utama Motor). Berikan jawaban yang santai, bersahabat, terstruktur, berbasis data riil customer di atas, dan sertakan contoh kalimat skrip konkret yang bisa langsung diucapkan DSR ke customer!
`;

  try {
    return await callGemini(SYSTEM_PERSONA_PROMPT, fullPrompt, 0.7);
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
          customerContext = `Konteks Customer: ${dossier.customer_name} (Industri: ${dossier.segment}, Mesin: ${dossier.equipment.map((e) => e.equipment_type).join(", ")})`;
        }
      }

      const prompt = `
Ekstrak cerita catatan hasil kunjungan DSR berikut menjadi JSON terstruktur untuk database CRM DSR360 (Distributor Shell Lubricants).
HANYA kembalikan JSON valid tanpa markdown backticks:

${customerContext}

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
