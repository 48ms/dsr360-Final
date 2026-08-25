"use server";

import { createClient } from "@/lib/supabase/server";
import type { CustomerResponse, FollowUpActivityType } from "@/constants/enums";
import { daysSince } from "@/lib/utils/format";

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
};

export async function parseUnstructuredVisitNotes(rawText: string): Promise<ParsedVisitNote> {
  const text = rawText.trim();
  const lower = text.toLowerCase();

  // 1. Detect Response
  let response: CustomerResponse = "INTERESTED";
  if (lower.includes("tolak") || lower.includes("tidak tertarik") || lower.includes("gamau") || lower.includes("ga mau")) {
    response = "NOT_INTERESTED";
  } else if (lower.includes("pikir") || lower.includes("pertimbangkan") || lower.includes("bandingkan") || lower.includes("lihat nanti")) {
    response = "CONSIDERING";
  } else if (lower.includes("netral") || lower.includes("biasa") || lower.includes("silaturahmi")) {
    response = "NEUTRAL";
  }

  // 2. Detect Competitor
  let competitor: string | null = null;
  if (lower.includes("pertamina") || lower.includes("meditran") || lower.includes("turalik")) competitor = "Pertamina";
  else if (lower.includes("mobil") || lower.includes("delvac") || lower.includes("dte")) competitor = "Mobil";
  else if (lower.includes("total") || lower.includes("rubia")) competitor = "TotalEnergies";
  else if (lower.includes("castrol")) competitor = "Castrol";

  // 3. Detect Objection
  let objection: string | null = null;
  if (lower.includes("harga") || lower.includes("mahal") || lower.includes("budget") || lower.includes("diskon")) {
    objection = "Harga / Selisih Biaya Pembelian Awal";
  } else if (lower.includes("kontrak") || lower.includes("terikat")) {
    objection = "Masih Terikat Kontrak Supplier Eksisting";
  } else if (lower.includes("garansi") || lower.includes("oem")) {
    objection = "Kekhawatiran Garansi Mesin / OEM Approval";
  }

  // 4. Detect Opportunity & Product
  let oppFound = true;
  if (response === "NOT_INTERESTED") oppFound = false;

  let productSuggestion: string | null = "Shell Rimula R4 X (15W-40)";
  if (lower.includes("hydraulic") || lower.includes("hidrolik") || lower.includes("tellus")) {
    productSuggestion = "Shell Tellus S2 V 46";
  } else if (lower.includes("gear") || lower.includes("gardan") || lower.includes("omala") || lower.includes("spirax")) {
    productSuggestion = "Shell Omala S2 G 220";
  } else if (lower.includes("grease") || lower.includes("gemuk") || lower.includes("gadus")) {
    productSuggestion = "Shell Gadus S2 V220";
  }

  // 5. Detect Next Action
  let nextActionType: FollowUpActivityType = "SEND_QUOTATION";
  let nextActionDesc = "Kirimkan penawaran harga resmi & data sheet teknis.";
  let dueDays = 1;

  if (lower.includes("sample") || lower.includes("sampel") || lower.includes("uji")) {
    nextActionType = "SEND_SAMPLE";
    nextActionDesc = "Kirimkan sampel produk pelumas Shell untuk uji lab.";
    dueDays = 2;
  } else if (lower.includes("trial") || lower.includes("tes mesin")) {
    nextActionType = "TRIAL_FOLLOWUP";
    nextActionDesc = "Follow-up persiapan trial uji oli pada unit mesin customer.";
    dueDays = 3;
  } else if (lower.includes("wa") || lower.includes("whatsapp") || lower.includes("chat")) {
    nextActionType = "WHATSAPP";
    nextActionDesc = "Follow-up respon PIC via WhatsApp.";
    dueDays = 1;
  } else if (lower.includes("telpon") || lower.includes("telepon") || lower.includes("call")) {
    nextActionType = "CALL";
    nextActionDesc = "Hubungi PIC per telepon untuk konfirmasi penawaran.";
    dueDays = 1;
  } else if (lower.includes("visit") || lower.includes("kunjung") || lower.includes("ketemu")) {
    nextActionType = "VISIT";
    nextActionDesc = "Jadwalkan kunjungan lanjutan ke lokasi customer.";
    dueDays = 7;
  }

  // If OpenAI / Gemini API key exists in environment in future, we can call it here.
  // The current deterministic parser works 100% offline & fast in sub-50ms!
  return {
    customer_response: response,
    objection,
    opportunity_found: oppFound,
    product_name_suggestion: productSuggestion,
    potential_volume_suggestion: 5,
    next_action_type: nextActionType,
    next_action_description: nextActionDesc,
    next_action_due_days: dueDays,
    competitor_name: competitor,
  };
}

export type PreVisitBrief = {
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
};

export async function getPreVisitAIBrief(customerId: string): Promise<PreVisitBrief | null> {
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
      .select("visit_date, discussion, purpose, customer_response")
      .eq("customer_id", customerId)
      .order("visit_date", { ascending: false })
      .limit(1),
    supabase
      .from("opportunities")
      .select("opportunity_name, stage, potential_value")
      .eq("customer_id", customerId)
      .neq("stage", "LOST")
      .neq("stage", "WON")
      .limit(1),
  ]);

  if (!customer) return null;

  const primaryContact = (contacts ?? []).find((c) => c.is_primary) || (contacts ?? [])[0] || null;
  const lastVisit = (recentVisits ?? [])[0];
  const activeOpp = (opportunities ?? [])[0];

  const currentOil = (products ?? []).find((p) => p.status === "CURRENT");
  const oilText = currentOil
    ? `${currentOil.brand} ${currentOil.product_name} (${currentOil.viscosity || "Std"})`
    : "Pelumas Kompetitor Eksisting";

  const equipText = (equipment ?? []).length
    ? (equipment ?? []).map((e) => `${e.equipment_type} ${e.brand || ""}`).join(", ")
    : "Unit operasional standar industri";

  let strategyRecommendation = "Tawarkan evaluasi Total Cost of Ownership (TCO) & perpanjangan drain interval.";
  if (customer.priority === "A") {
    strategyRecommendation = "Prioritas Akun A: Tawarkan program oil analysis (LubeAnalyst) gratis dan trial 1 armada.";
  } else if (activeOpp?.stage === "TRIAL") {
    strategyRecommendation = "Tahap Trial: Tinjau hasil uji performa oli pada mesin dan siapkan draf komersial quotation.";
  }

  return {
    customer_name: customer.customer_name,
    segment: customer.segment,
    priority: customer.priority,
    city: customer.city,
    days_since_last_visit: lastVisit ? daysSince(lastVisit.visit_date) : 999,
    last_visit_summary: lastVisit?.discussion || lastVisit?.purpose || "Belum ada riwayat kunjungan.",
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
    recommended_approach: strategyRecommendation,
  };
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
        "Shell Tellus S2 V memiliki indeks viskositas tinggi dan stabilitas termal unggul yang mencegah pembentukan deposit pernis (varnish) pada katup presisi hidrolik.",
      key_proof_point: "Efisiensi transmisi hidrolik meningkat hingga 3-5% dan memperpanjang umur pompa.",
    },
  ];
}
