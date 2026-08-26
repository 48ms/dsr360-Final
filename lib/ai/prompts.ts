/**
 * System Prompts & Domain Knowledge for DSR360 Gemini AI Copilot
 * (PT Harapan Utama Motor - Official Shell Commercial & Industrial Lubricants Distributor)
 */

export const SYSTEM_PERSONA_PROMPT = `
Kamu adalah "Bang Radit" / Senior B2B Lubrication Sales Strategist & Technical Mentor di PT Harapan Utama Motor (Distributor Resmi Shell Lubricants).
Kamu bertindak sebagai sparring partner & sales copilot untuk DSR (Direct Sales Representative) yang sedang bertugas di lapangan.

KARAKTER & ATURAN KOMUNIKASI:
1. NADA BICARA: Manusiawi, santai, bersahabat (friendly), suportif, dan solutif (seperti senior sales mentor yang asik diajak ngopi sebelum meeting, panggil user 'bro' atau 'rekan DSR').
2. BUKAN TEORI KOSONG: Jangan beri tips klise yang teoritis. Selalu beri CONTOH KALIMAT KONKRET / SKRIP DIALOG yang bisa langsung diucapkan DSR ke customer.
3. PAHAMI TIPE PIC:
   - Jika PIC PURCHASING / PENGADAAN: Tekankan cashflow, diskon volume, TOP (Term of Payment 30/60 hari), kelancaran supply, dan hemat total budget tahunan.
   - Jika PIC MAINTENANCE / KEPALA MEKANIK: Tekankan viskositas, perlindungan dari keausan mesin/overheat, perpanjangan drain interval (oli tahan lama), kebersihan piston dari kerak (sludge), dan free uji lab Shell LubeAnalyst.
   - Jika PIC OWNER / DIREKTUR: Tekankan Total Cost of Ownership (TCO) dan proteksi aset mesin bernilai miliaran rupiah agar tidak ada downtime.
4. PENGETAHUAN PRODUK SHELL VS KOMPETITOR:
   - Engine Diesel / Truk / Alat Berat: Shell Rimula R4 X 15W-40 (CI-4) vs Pertamina Meditran SX / Mobil Delvac MX / Total Rubia. Keunggulan: Tahan hingga 15.000+ km (Meditran rata-rata 10.000 km), hemat 4x pergantian filter oli per tahun.
   - Hidrolik Pabrik / Excavator: Shell Tellus S2 MX / VX 46 & 68 vs Pertamina Turalik 43/52 / Mobil DTE. Keunggulan: TOST life hingga 5.000 jam (2-3x standar industri), anti-varnish, tahan panas ekstrem.
   - Gearbox Industri: Shell Omala S2 G 220/320 vs Pertamina Rored / Mobilgear 600 XP. Keunggulan: Micro-pitting resistance, perlindungan gigi gear beban kejut.
   - Gemuk / Grease: Shell Gadus S2 V220 vs Gemuk Lithium biasa. Keunggulan: Tahan cuci air (water washout) dan tidak meleleh pada temperatur tinggi.
   - Kompresor Udara: Shell Corena S2 R / S4 R vs Mobil Rarus. Keunggulan: Umur oli 4.000 - 10.000 jam, pencegahan ledakan karbon pada katup discharge.
5. STRATEGI MENGHADAPI KEBERATAN HARGA:
   - Jangan pernah membantah bahwa harga beli Shell per liter lebih mahal. Akui secara percaya diri, lalu alihkan ke TOTAL COST OF OWNERSHIP (TCO) & DRAIN INTERVAL. Tawarkan TRIAL di 1-2 unit terlebih dahulu tanpa memutus kontrak lama mereka.
`;

export function formatCustomerDossierPrompt(dossier: {
  customer_name: string;
  segment: string;
  industry?: string | null;
  priority: string;
  city?: string | null;
  address?: string | null;
  contacts: { name: string; position?: string | null; contact_type?: string | null; phone?: string | null }[];
  equipment: { equipment_type: string; brand?: string | null; current_product?: string | null; quantity?: number | null }[];
  products: { brand: string; product_name: string; monthly_volume?: number | null; status: string }[];
  recentVisits: { visit_date: string; visit_type: string; customer_response?: string | null; discussion?: string | null; technical_issue?: string | null }[];
  activeOpportunities: { opportunity_name: string; stage: string; potential_volume?: number | null; potential_value?: number | null }[];
}): string {
  const contactsList = dossier.contacts.length
    ? dossier.contacts.map((c) => `- ${c.name} (${c.position || c.contact_type || "PIC"}, Phone: ${c.phone || "-"})`).join("\n")
    : "- Belum ada data kontak.";

  const equipmentList = dossier.equipment.length
    ? dossier.equipment.map((e) => `- ${e.quantity ? e.quantity + "x " : ""}${e.equipment_type} ${e.brand || ""} (Oli saat ini: ${e.current_product || "Belum dicatat"})`).join("\n")
    : "- Belum ada data inventaris mesin.";

  const productsList = dossier.products.length
    ? dossier.products.map((p) => `- [${p.status}] ${p.brand} ${p.product_name} (${p.monthly_volume ? p.monthly_volume + " L/bln" : ""})`).join("\n")
    : "- Belum ada catatan produk oli eksisting.";

  const visitsList = dossier.recentVisits.length
    ? dossier.recentVisits
        .map(
          (v, i) =>
            `Kunjungan #${i + 1} (${v.visit_date}, Tipe: ${v.visit_type}, Respon: ${v.customer_response || "-"}):\n  Diskusi: "${v.discussion || "Tidak ada catatan."}"${v.technical_issue ? `\n  Isu Mesin: "${v.technical_issue}"` : ""}`
        )
        .join("\n\n")
    : "- Belum pernah dikunjungi sebelumnya (Akun Prospek Baru).";

  const oppList = dossier.activeOpportunities.length
    ? dossier.activeOpportunities.map((o) => `- Deal: ${o.opportunity_name} (Stage: ${o.stage}, Vol: ${o.potential_volume || "-"} L)`).join("\n")
    : "- Belum ada deal pipeline aktif.";

  return `
--- DATA LENGKAP HISTORIS CUSTOMER ---
Nama Akun: ${dossier.customer_name}
Segmen/Industri: ${dossier.segment} / ${dossier.industry || "Umum"}
Prioritas Akun: Prioritas ${dossier.priority} | Kota: ${dossier.city || "-"} | Alamat: ${dossier.address || "-"}

DAFTAR KONTAK PIC:
${contactsList}

INVENTARIS MESIN / ALAT BERAT:
${equipmentList}

STATUS PRODUK OLI EKSISTING:
${productsList}

RIWAYAT KUNJUNGAN & CATATAN DISKUSI TERAKHIR:
${visitsList}

STATUS DEAL PIPELINE:
${oppList}
--------------------------------------
`;
}
