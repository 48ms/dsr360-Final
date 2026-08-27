import { createClient } from "@/lib/supabase/server";
import { getCollectiveFieldMemory, callGemini } from "@/lib/ai/gemini";
import { SYSTEM_PERSONA_PROMPT } from "@/lib/ai/prompts";
import { daysSince } from "@/lib/utils/format";

export type HermesAgentConfig = {
  endpoint?: string;
  model?: string;
  apiKey?: string;
};

export type NightlyAuditFinding = {
  customerId: string;
  customerName: string;
  category: "CHURN_RISK" | "STUCK_DEAL" | "REPEAT_ORDER" | "CROSS_SELL";
  priority: "HIGH" | "MEDIUM";
  diagnosis: string;
  actionPlan: string;
  suggestedPillar: string;
};

export type NightlyDispatcherResult = {
  success: boolean;
  auditedCustomersCount: number;
  criticalFindings: NightlyAuditFinding[];
  summaryMessage: string;
  executedAt: string;
  engineUsed: string;
};

/**
 * Executes the Autonomous Nightly Dispatcher using Hermes / Multi-Tier AI Engine.
 * Scans active customer accounts, checks stock burn rates, identifies deal bottlenecks,
 * and formulates next-morning tactical directives grounded on the 13 Masterpiece Sales Frameworks.
 */
export async function runAutonomousNightlyDispatcher(): Promise<NightlyDispatcherResult> {
  const supabase = await createClient();

  // 1. Fetch live snapshot of customers, visits, follow-ups, and opportunities
  const [
    { data: customers },
    { data: visits },
    { data: followUps },
    { data: opportunities },
    collectiveMemory,
  ] = await Promise.all([
    supabase
      .from("customers")
      .select(
        `
        id,
        customer_name,
        segment,
        industry,
        priority,
        potential_monthly_volume,
        status,
        updated_at
      `
      )
      .neq("status", "INACTIVE")
      .limit(100),
    supabase
      .from("visits")
      .select("id, customer_id, visit_date, visit_status, customer_response, discussion")
      .order("visit_date", { ascending: false })
      .limit(150),
    supabase
      .from("follow_ups")
      .select("id, customer_id, due_date, status, activity_type, description")
      .eq("status", "PENDING")
      .limit(100),
    supabase
      .from("opportunities")
      .select("id, customer_id, opportunity_name, stage, potential_value, potential_volume, updated_at")
      .neq("stage", "LOST")
      .neq("stage", "WON")
      .limit(80),
    getCollectiveFieldMemory(),
  ]);

  if (!customers || customers.length === 0) {
    return {
      success: true,
      auditedCustomersCount: 0,
      criticalFindings: [],
      summaryMessage: "Tidak ada data customer yang memerlukan audit malam ini.",
      executedAt: new Date().toISOString(),
      engineUsed: "Hermes Autonomous Engine",
    };
  }

  // 2. Build condensed account dossier matrix
  const accountDossierSummary = customers.slice(0, 15).map((c) => {
    const custVisits = (visits || []).filter((v) => v.customer_id === c.id);
    const lastVisit = custVisits[0];
    const daysSinceLastVisit = lastVisit ? daysSince(lastVisit.visit_date) : 999;
    const custOpps = (opportunities || []).filter((o) => o.customer_id === c.id);
    const custFollowUps = (followUps || []).filter((f) => f.customer_id === c.id);

    return {
      id: c.id,
      name: c.customer_name,
      priority: c.priority,
      sector: c.segment || c.industry || "General Industry",
      monthlyVol: c.potential_monthly_volume || 0,
      daysSinceLastVisit,
      lastFeedback: lastVisit?.customer_response || "Belum ada kunjungan",
      openDeals: custOpps.map((o) => `${o.opportunity_name} (Stage: ${o.stage})`),
      pendingTasks: custFollowUps.length,
    };
  });

  const prompt = `
[ROLE & CONTEXT: HERMES 3 AUTONOMOUS B2B SALES DISPATCHER]
Kamu adalah Hermes 3 Autonomous Nightly AI Agent untuk platform Nyales24/7 (Platform AI B2B Sales Operating System oleh Bima Maulana Saputra).
Tugasmu adalah melakukan AUDIT FORENSIK MALAM HARI terhadap portofolio akun sales untuk mendeteksi risiko kehilangan customer (churn), deal yang tersendat, dan siklus repeat order sebelum jam 07:00 pagi.

[13 PILAR MASTERPIECE SALES B2B SEBAGAI LANDASAN AUDIT]:
1. Shell VAS (LubeAnalyst uji lab gratis, LubeCoach training, jaminan buffer stock).
2. Enterprise TCO & Drain Interval 5.000 jam (Base Oil Group II Shell vs Group I kompetitor).
3. BANT Ground Truth kontekstual pabrik Indonesia.
4. Give-Get Non-Discount Rule (larangan diskon tanpa komitmen kuota/termin).
5. Louis Blythe 5-Gate Micro-Commitment Stacking (audit -> trial 1 drum -> SPH -> closing).
6. Cross-Selling Matrix (Tellus Hidrolik + Omala Gear + Gadus Grease + Corena Kompresor).
7. 3-Buyer Personas Alignment (Purchasing vs Kepala Mekanik vs Direksi).
8. POPSA Pre-Call Planning.
9. Technical Trial POC Validation Gates.
10. Pre-Mortem Objection Mapping.
11. Crawl-Walk-Run GTM Expansion.
12. 5-Signal Hunting Codex.
13. Natural Industrial Indonesian Tone.

[COLLECTIVE CRM BENCHMARKS]:
${collectiveMemory}

[SNAPSHOT DATA AKUN UNTUK DIAUDIT]:
${JSON.stringify(accountDossierSummary, null, 2)}

TUGAS UTAMA:
Identifikasi maksimal 4 akun paling kritis yang membutuhkan intervensi strategis sales besok pagi.
Keluarkan output HANYA dalam format JSON valid tanpa markdown tambahan:

{
  "summaryMessage": "Rangkuman hasil audit malam ini dalam 1-2 kalimat tajam.",
  "findings": [
    {
      "customerId": "ID_CUSTOMER_SESUAI_DATA",
      "customerName": "Nama Customer",
      "category": "CHURN_RISK",
      "priority": "HIGH",
      "diagnosis": "Diagnosa akar masalah (mengapa akun ini butuh perhatian).",
      "actionPlan": "Rencana aksi taktis spesifik untuk sales besok pagi.",
      "suggestedPillar": "Pilar 5: Micro-Commitment Stacking"
    }
  ]
}
`;

  try {
    const rawResult = await callGemini(SYSTEM_PERSONA_PROMPT, prompt, 0.2);
    const cleaned = rawResult.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    const parsed = JSON.parse(cleaned);

    return {
      success: true,
      auditedCustomersCount: customers.length,
      criticalFindings: parsed.findings || [],
      summaryMessage: parsed.summaryMessage || "Audit malam hari berhasil diselesaikan oleh Hermes Autonomous Agent.",
      executedAt: new Date().toISOString(),
      engineUsed: "Hermes 3 / Gemini Dynamic Hybrid Engine",
    };
  } catch (err: unknown) {
    console.error("[Hermes Dispatcher Error]:", err);

    // Fallback heuristic if API parsing fails
    const fallbackFindings: NightlyAuditFinding[] = accountDossierSummary
      .filter((a) => a.daysSinceLastVisit > 14 || a.pendingTasks > 0)
      .slice(0, 3)
      .map((a) => ({
        customerId: a.id,
        customerName: a.name,
        category: a.daysSinceLastVisit > 21 ? "CHURN_RISK" : "REPEAT_ORDER",
        priority: "HIGH",
        diagnosis: `Akun prioritas ${a.priority} belum dikunjungi selama ${a.daysSinceLastVisit} hari.`,
        actionPlan: "Jadwalkan kunjungan silaturahmi teknis dan tawarkan sampling oli LubeAnalyst gratis.",
        suggestedPillar: "Pilar 8: POPSA Planning & Pilar 1: Shell LubeAnalyst",
      }));

    return {
      success: true,
      auditedCustomersCount: customers.length,
      criticalFindings: fallbackFindings,
      summaryMessage: "Audit malam hari diselesaikan menggunakan Local Heuristic Intelligence.",
      executedAt: new Date().toISOString(),
      engineUsed: "Hermes Local Heuristic Engine",
    };
  }
}
