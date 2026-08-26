/**
 * WhatsApp utilities & template generator for DSR360 (Shell Lubricants - PT Harapan Utama Motor)
 */

export type WhatsAppContact = {
  name: string;
  phone: string;
  role?: string | null;
};

export type WhatsAppTemplateContext = {
  customerName: string;
  picName?: string;
  salesName?: string;
  visitDate?: string;
  visitDiscussion?: string;
  opportunityProduct?: string;
  nextAction?: string;
};

export type WhatsAppTemplateType =
  | "POST_VISIT_SUMMARY"
  | "INTRODUCTION"
  | "APPOINTMENT_CONFIRM"
  | "QUOTATION_FOLLOWUP"
  | "CUSTOM";

export const WHATSAPP_TEMPLATES: {
  id: WhatsAppTemplateType;
  title: string;
  description: string;
  generateText: (ctx: WhatsAppTemplateContext) => string;
}[] = [
  {
    id: "POST_VISIT_SUMMARY",
    title: "📝 Ringkasan Kunjungan",
    description: "Follow-up resmi setelah meeting/kunjungan lapangan",
    generateText: (ctx) => {
      const pic = ctx.picName ? `Bpk/Ibu ${ctx.picName}` : "Bpk/Ibu";
      const sales = ctx.salesName || "Tim Sales PT Harapan Utama Motor";
      const discussion = ctx.visitDiscussion
        ? `\n\n📌 *Poin Diskusi:*\n${ctx.visitDiscussion}`
        : "";
      const dateInfo = ctx.visitDate ? ` pada ${ctx.visitDate}` : " hari ini";

      return `Yth. ${pic},\n${ctx.customerName}\n\nTerima kasih atas waktu dan kesempatan yang diberikan dalam kunjungan kami${dateInfo}.${discussion}\n\nKami dari PT Harapan Utama Motor (Distributor Resmi Shell Lubricants) siap mendukung keandalan operasional mesin & armada Bapak/Ibu dengan solusi pelumas terbaik.\n\nJika ada kebutuhan data teknis (TDS/MSDS) atau penawaran harga, silakan hubungi kami kapan saja.\n\nSalam hangat,\n*${sales}*\nPT Harapan Utama Motor`;
    },
  },
  {
    id: "INTRODUCTION",
    title: "🤝 Salam Perkenalan",
    description: "Perkenalan resmi DSR untuk prospek atau customer baru",
    generateText: (ctx) => {
      const pic = ctx.picName ? `Bpk/Ibu ${ctx.picName}` : "Bpk/Ibu";
      const sales = ctx.salesName || "DSR PT Harapan Utama Motor";

      return `Selamat siang ${pic},\nSemoga selalu dalam keadaan sehat dan lancar dalam menjalankan aktivitas di *${ctx.customerName}*.\n\nPerkenalkan, saya *${sales}* dari *PT Harapan Utama Motor*, distributor resmi pelumas *Shell Lubricants* (Commercial & Industrial).\n\nKami menyediakan produk oli original Shell terlengkap untuk armada transportasi, alat berat, dan mesin industri (Rimula, Tellus, Omala, Gadus, Corena, dll.) dengan jaminan keaslian & dukungan teknis pelumasan.\n\nBolehkah kami menjadwalkan kunjungan singkat untuk silaturahmi sekaligus memperkenalkan solusi efisiensi pelumas Shell untuk ${ctx.customerName}?\n\nTerima kasih atas perhatiannya,\n*${sales}*`;
    },
  },
  {
    id: "APPOINTMENT_CONFIRM",
    title: "📅 Konfirmasi Janji Temu",
    description: "Konfirmasi jadwal sebelum meluncur ke lokasi customer",
    generateText: (ctx) => {
      const pic = ctx.picName ? `Bpk/Ibu ${ctx.picName}` : "Bpk/Ibu";
      const sales = ctx.salesName || "DSR PT Harapan Utama Motor";
      const dateInfo = ctx.visitDate ? `pada ${ctx.visitDate}` : "hari ini";

      return `Selamat pagi/siang ${pic},\n\nIzin mengonfirmasi rencana kunjungan/pertemuan kami dari PT Harapan Utama Motor (Shell Distributor) ke *${ctx.customerName}* yang dijadwalkan ${dateInfo}.\n\nApakah jadwal tersebut masih sesuai dan Bapak/Ibu sudah berada di lokasi?\n\nTerima kasih banyak atas konfirmasinya 🙏\n\nSalam,\n*${sales}*`;
    },
  },
  {
    id: "QUOTATION_FOLLOWUP",
    title: "💰 Follow-up Penawaran",
    description: "Menanyakan update penawaran harga oli Shell",
    generateText: (ctx) => {
      const pic = ctx.picName ? `Bpk/Ibu ${ctx.picName}` : "Bpk/Ibu";
      const sales = ctx.salesName || "DSR PT Harapan Utama Motor";
      const product = ctx.opportunityProduct ? ` produk *${ctx.opportunityProduct}*` : "";

      return `Yth. ${pic},\n${ctx.customerName}\n\nSemoga dalam keadaan sehat selalu.\n\nIzin menindaklanjuti penawaran harga pelumas Shell${product} yang telah kami ajukan sebelumnya.\n\nApakah ada hal teknis atau komersial yang perlu kami diskusikan lebih lanjut dengan tim pengadaan ${ctx.customerName}?\n\nKami siap membantu penyesuaian kebutuhan atau pengiriman sampel produk jika diperlukan.\n\nTerima kasih,\n*${sales}*\nPT Harapan Utama Motor`;
    },
  },
  {
    id: "CUSTOM",
    title: "✏️ Pesan Bebas",
    description: "Format pesan bebas dengan template salam pembuka",
    generateText: (ctx) => {
      const pic = ctx.picName ? `Bpk/Ibu ${ctx.picName}` : "Bpk/Ibu";
      const sales = ctx.salesName || "PT Harapan Utama Motor";

      return `Yth. ${pic} (${ctx.customerName}),\n\n[Tulis pesan Anda di sini]\n\nSalam,\n*${sales}*\nPT Harapan Utama Motor`;
    },
  },
];

/**
 * Sanitize Indonesian phone numbers to universal international format (e.g. 628123456789)
 */
export function sanitizeIndonesianPhone(phone: string): string {
  // Remove non-numeric characters
  let clean = phone.replace(/[^0-9]/g, "");

  // If starts with 08..., replace 0 with 62
  if (clean.startsWith("0")) {
    clean = "62" + clean.slice(1);
  }
  // If starts with +62 or just 8..., ensure it starts with 62
  else if (clean.startsWith("8")) {
    clean = "62" + clean;
  }

  return clean;
}

/**
 * Generate full WhatsApp web / app URL with prefilled encoded text
 */
export function generateWhatsAppUrl(phone: string, message: string): string {
  const sanitized = sanitizeIndonesianPhone(phone);
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${sanitized}?text=${encoded}`;
}
