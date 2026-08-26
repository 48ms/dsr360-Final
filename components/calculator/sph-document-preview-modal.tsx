"use client";
// impeccable-disable design-system-color, design-system-font -- official PT HUM corporate SPH document print styles

import { useState } from "react";
import {
  Printer,
  Share2,
  MessageSquare,
  X,
  CheckCircle2,
  FileText,
  Building2,
  Calendar,
  Sparkles,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils/format";
import type { SphPayloadInput } from "@/actions/sph-calculator";
import { cn } from "@/lib/utils/cn";

export function SphDocumentPreviewModal({
  isOpen,
  onClose,
  data,
}: {
  isOpen: boolean;
  onClose: () => void;
  data: SphPayloadInput;
}) {
  const [isCopied, setIsCopied] = useState(false);
  const [isPpnInclusive, setIsPpnInclusive] = useState(data.ppnInclusive ?? true);

  if (!isOpen) return null;

  const subtotalBeforePpn = data.items.reduce((sum, item) => sum + item.subtotal, 0);

  // Build WhatsApp text
  const waItemsText = data.items
    .map(
      (item, idx) =>
        `${idx + 1}. *${item.productName}*\n   • Deskripsi: ${item.description}\n   • Kemasan: ${item.pack} (${item.unit})\n   • Qty: ${item.qty} ${item.pack}\n   • Harga/Unit: ${formatCurrency(item.offeredPrice)} (${isPpnInclusive ? "Inc. PPN" : "Exc. PPN"})\n   • Subtotal: ${formatCurrency(item.subtotal)}`
    )
    .join("\n\n");

  const waMessage = `*SURAT PENAWARAN HARGA PELUMAS SHELL*\nNo. Ref: ${data.sphNumber}\nTanggal: ${data.cityAndDate || data.sphDate}\n\nKepada Yth.\n*${data.customerName}*\nAttn: ${data.picName || "Bapak/Ibu Purchasing"}\n\nDengan hormat,\nTerima kasih atas kesempatan yang diberikan kepada kami (Distributor Resmi Shell Lubricants) untuk dapat menawarkan produk pelumas Shell sesuai kebutuhan perusahaan Bapak/Ibu:\n\n${waItemsText}\n\n*Total Penawaran:* ${formatCurrency(subtotalBeforePpn)}\n\n*Ketentuan Penawaran:*\n❖ Harga diatas ${isPpnInclusive ? "*SUDAH*" : "*BELUM*"} termasuk PPN 11%\n❖ Harga sudah termasuk ongkos kirim area Jabar & Jateng\n❖ Franco: ${data.francoLocation || data.customerCity || "Pabrik Customer"}\n❖ Pembayaran: ${data.paymentTerm || "30 Hari"}\n\nHormat kami,\n*Bima Maulana Saputra*\nCommercial & Industrial Lubricants Sales Specialist\n085315513609`;

  /**
   * Isolated Print Engine reproducing exact PT HUM office paper template
   */
  function handlePrint() {
    const tableRows = data.items
      .map(
        (item, idx) => `
        <tr>
          <td style="text-align: center; font-weight: bold; padding: 4.5px 6px; border: 1px solid #000;">${idx + 1}</td>
          <td style="font-weight: bold; color: #000; padding: 4.5px 8px; border: 1px solid #000;">${item.productName}</td>
          <td style="color: #111; padding: 4.5px 8px; border: 1px solid #000;">${item.description || "-"}</td>
          <td style="text-align: center; font-weight: bold; padding: 4.5px 6px; border: 1px solid #000;">${item.pack || "DRUM"}</td>
          <td style="text-align: center; font-weight: 600; padding: 4.5px 6px; border: 1px solid #000;">${item.unit || "209 L"}</td>
          <td style="text-align: right; font-weight: bold; font-family: monospace; padding: 4.5px 8px; border: 1px solid #000;">${formatCurrency(item.offeredPrice)}</td>
        </tr>
      `
      )
      .join("");

    const printHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>SPH - ${data.sphNumber} - ${data.customerName}</title>
        <style>
          @page {
            size: A4 portrait;
            margin: 5mm 12mm 5mm 12mm;
          }
          * {
            box-sizing: border-box;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          html, body {
            margin: 0;
            padding: 0;
            background: #ffffff;
            color: #000000;
            font-family: Arial, Helvetica, sans-serif; /* impeccable-disable-line overused-font -- official PT HUM corporate SPH document font */
            font-size: 10pt;
            line-height: 1.35;
          }
          .sph-page-wrapper {
            width: 100%;
            max-width: 760px;
            margin: 0 auto;
            min-height: 98vh;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
          }
          .header-img {
            width: 100%;
            height: auto;
            max-height: 85px;
            object-fit: fill;
            display: block;
            margin-bottom: 8px;
          }
          .title-block {
            text-align: center;
            margin-bottom: 10px;
          }
          .title-block h1 {
            font-size: 12.5pt;
            font-weight: 900;
            letter-spacing: 0.5px;
            margin: 0 0 1.5px 0;
            text-decoration: underline;
          }
          .title-block .ref-no {
            font-size: 10.5pt;
            font-weight: bold;
            color: #000;
          }
          .meta-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 8px;
            font-size: 10pt;
          }
          .meta-table td {
            vertical-align: top;
            padding: 1.5px 0;
          }
          .label {
            font-weight: bold;
            color: #000;
            width: 80px;
          }
          .greeting {
            margin-bottom: 8px;
            font-size: 10pt;
            line-height: 1.4;
          }
          .greeting p {
            margin: 0 0 5px 0;
            text-align: justify;
          }
          .product-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 10px;
            font-size: 9.5pt;
          }
          .product-table th {
            background-color: #f2f2f2 !important;
            font-weight: bold;
            text-align: center;
            border: 1px solid #000;
            padding: 4px 6px;
            color: #000;
          }
          .terms-block {
            margin-bottom: 10px;
            font-size: 9.5pt;
            line-height: 1.35;
          }
          .terms-block p {
            margin: 2px 0;
          }
          .closing {
            margin-bottom: 10px;
            font-size: 9.5pt;
            line-height: 1.4;
            text-align: justify;
          }
          .sig-img {
            width: 200px;
            height: auto;
            display: block;
            margin-top: 2px;
            margin-bottom: 6px;
          }
          .footer-img {
            width: 100%;
            height: auto;
            max-height: 80px;
            object-fit: fill;
            display: block;
            margin-top: auto;
          }
        </style>
      </head>
      <body>
        <div class="sph-page-wrapper">
          <div>
            <!-- 1. Header Banner -->
            <img src="/images/sph/official_header_complete.png" class="header-img" alt="PT Harapan Utama Motor" />

            <!-- 2. Document Title -->
            <div class="title-block">
              <h1>SURAT PENAWARAN HARGA</h1>
              <div class="ref-no">No. : ${data.sphNumber}</div>
            </div>

            <!-- 3. Meta Recipient Table -->
            <table class="meta-table">
              <tr>
                <td class="label">TO</td>
                <td style="font-weight: bold; color: #000;">: &nbsp;${data.customerName}</td>
                <td style="text-align: right; font-weight: bold; width: 220px;">${data.cityAndDate || `Bandung, ${data.sphDate}`}</td>
              </tr>
              <tr>
                <td class="label">PIC</td>
                <td style="font-weight: bold;">: &nbsp;${data.picName || "Bapak/Ibu Purchasing"}</td>
                <td></td>
              </tr>
              <tr>
                <td class="label">Lampiran</td>
                <td>: &nbsp;${data.lampiran || "-"}</td>
                <td></td>
              </tr>
            </table>

            <!-- 4. Opening Greeting -->
            <div class="greeting">
              <p><strong>Dengan hormat,</strong></p>
              <p style="text-indent: 24px;">
                Terima kasih atas kesempatan yang diberikan kepada PT Harapan Utama Motor Authorized Distributor Shell Lubricants Jawa Barat &amp; Jawa Tengah untuk dapat menawarkan produk pelumas Shell (Oli/Gemuk/Pendingin) sesuai kebutuhan perusahaan Bapak/Ibu. Bersama surat ini kami sampaikan penawaran harga sebagai berikut:
              </p>
            </div>

            <!-- 5. Product & Price Table -->
            <table class="product-table">
              <thead>
                <tr>
                  <th style="width: 30px;">No</th>
                  <th style="text-align: left; width: 190px;">Nama Produk</th>
                  <th style="text-align: left;">Deskripsi Produk</th>
                  <th style="width: 60px;">Pack</th>
                  <th style="width: 50px;">Unit</th>
                  <th style="text-align: right; width: 110px;">Price/Unit</th>
                </tr>
              </thead>
              <tbody>
                ${tableRows}
              </tbody>
            </table>

            <!-- 6. Conditions Block -->
            <div class="terms-block">
              <p><strong>Adapun Ketentuan Penawaran kami:</strong></p>
              <p style="padding-left: 8px;">❖ Harga diatas <strong>${isPpnInclusive ? "SUDAH" : "BELUM"}</strong> termasuk Pajak Pertambahan Nilai (PPN 11%)</p>
              <p style="padding-left: 8px;">❖ Harga diatas sudah termasuk pengiriman seluruh area Jawa Barat &amp; Jawa Tengah</p>
              <p style="padding-left: 8px;">❖ Harga dapat berubah mengikuti ketersedian barang, harga perkembangan dollar &amp; minyak dunia</p>
              <p style="padding-left: 8px;">❖ <strong>Franco</strong> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: ${data.francoLocation || data.customerName}</p>
              <p style="padding-left: 8px;">❖ <strong>Pembayaran</strong> &nbsp;: ${data.paymentTerm || "30 Hari"}</p>
            </div>

            <!-- 7. Closing -->
            <div class="closing">
              <p>Demikian penawaran ini kami sampaikan. Besar harapan kami agar produk yang kami tawarkan dapat memenuhi kebutuhan perusahaan Bapak/Ibu. Atas perhatian dan kerjasamanya kami ucapkan terima kasih.</p>
            </div>

            <!-- 8. Official Signature Block of Bima Maulana Saputra with PT HUM Stamp -->
            <img src="/images/sph/bima_signature_stamp.png" class="sig-img" alt="Hormat Kami PT. Harapan Utama Motor - Bima Maulana Saputra" />
          </div>

          <!-- 9. Official Footer Banner Full Width -->
          <img src="/images/sph/official_footer_complete.png" class="footer-img" alt="Footer PT Harapan Utama Motor" />
        </div>
      </body>
      </html>
    `;

    const iframe = document.createElement("iframe");
    iframe.style.position = "fixed";
    iframe.style.right = "0";
    iframe.style.bottom = "0";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "0";
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow?.document;
    if (doc) {
      doc.open();
      doc.write(printHtml);
      doc.close();

      setTimeout(() => {
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print();
        setTimeout(() => {
          document.body.removeChild(iframe);
        }, 1000);
      }, 350);
    }
  }

  function handleCopyWhatsApp() {
    navigator.clipboard.writeText(waMessage);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 3000);
  }

  function handleOpenWhatsAppDirect() {
    const phoneClean = (data.picPhone || "").replace(/\D/g, "");
    const targetPhone = phoneClean.startsWith("0")
      ? "62" + phoneClean.substring(1)
      : phoneClean;
    const url = `https://wa.me/${targetPhone}?text=${encodeURIComponent(waMessage)}`;
    window.open(url, "_blank");
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-2 sm:p-4 backdrop-blur-xs overflow-y-auto">
      <div className="w-full max-w-4xl rounded-3xl bg-white shadow-2xl border border-neutral-200 overflow-hidden flex flex-col max-h-[96vh]">
        
        {/* Top Control Action Bar */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-neutral-950 text-white border-b border-neutral-800 shrink-0 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-amber-400" />
            <div>
              <span className="text-xs font-bold block">
                Pratinjau SPH Resmi PT Harapan Utama Motor
              </span>
              <span className="text-[10px] text-neutral-400 font-mono">
                No: {data.sphNumber} &bull; {data.cityAndDate || data.sphDate}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* PPN Toggle */}
            <button
              type="button"
              onClick={() => setIsPpnInclusive(!isPpnInclusive)}
              className={cn(
                "inline-flex items-center gap-1.5 min-h-[36px] rounded-xl px-3 py-1 text-xs font-bold transition cursor-pointer border",
                isPpnInclusive
                  ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/50"
                  : "bg-amber-500/20 text-amber-300 border-amber-500/50"
              )}
            >
              <span>{isPpnInclusive ? "PPN: SUDAH Termasuk" : "PPN: BELUM Termasuk"}</span>
            </button>

            <button
              type="button"
              onClick={handleCopyWhatsApp}
              className="inline-flex items-center gap-1.5 min-h-[36px] rounded-xl bg-neutral-800 px-3 py-1 text-xs font-bold text-neutral-200 hover:text-white hover:bg-neutral-700 active:scale-95 transition cursor-pointer"
            >
              {isCopied ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> : <Share2 className="h-3.5 w-3.5" />}
              <span>{isCopied ? "Tersalin!" : "Salin WA"}</span>
            </button>

            {data.picPhone && (
              <button
                type="button"
                onClick={handleOpenWhatsAppDirect}
                className="inline-flex items-center gap-1.5 min-h-[36px] rounded-xl bg-emerald-600 px-3 py-1 text-xs font-bold text-white hover:bg-emerald-700 active:scale-95 transition cursor-pointer shadow-2xs"
              >
                <MessageSquare className="h-3.5 w-3.5" />
                <span>Kirim WA</span>
              </button>
            )}

            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 min-h-[36px] rounded-xl bg-amber-500 px-4 py-1.5 text-xs font-extrabold text-white hover:bg-amber-600 active:scale-95 transition cursor-pointer shadow-md"
            >
              <Printer className="h-4 w-4" />
              <span>🖨️ Cetak / Simpan PDF (1 Lembar)</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="rounded-xl p-1.5 text-neutral-400 hover:bg-neutral-800 hover:text-white transition cursor-pointer ml-1"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Live Document Preview Viewport */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-neutral-200 text-neutral-900 font-sans">
          <div className="mx-auto max-w-[760px] bg-white p-6 sm:p-9 rounded-2xl shadow-xl border border-neutral-300 min-h-[850px] flex flex-col justify-between">
            <div>
              {/* 1. KOP SURAT ASLI PT HARAPAN UTAMA MOTOR */}
              <div className="w-full mb-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/sph/official_header_complete.png"
                  alt="Kop Surat PT Harapan Utama Motor"
                  className="w-full max-h-[85px] object-fill object-left"
                />
              </div>

              {/* 2. SURAT PENAWARAN HARGA TITLE */}
              <div className="text-center mb-3">
                <h2 className="text-sm font-black tracking-wide underline uppercase text-neutral-950">
                  SURAT PENAWARAN HARGA
                </h2>
                <p className="text-xs font-bold text-neutral-900 mt-0.5">
                  No. : {data.sphNumber}
                </p>
              </div>

              {/* 3. RECIPIENT & METADATA TABLE */}
              <div className="grid grid-cols-2 gap-4 text-xs mb-3 font-medium">
                <div className="space-y-1">
                  <div className="flex">
                    <span className="w-20 font-bold uppercase text-neutral-950">TO</span>
                    <span className="font-extrabold text-neutral-950">: &nbsp;{data.customerName}</span>
                  </div>
                  <div className="flex">
                    <span className="w-20 font-bold uppercase text-neutral-950">PIC</span>
                    <span className="font-bold text-neutral-900">: &nbsp;{data.picName || "Bapak/Ibu Purchasing"}</span>
                  </div>
                  <div className="flex">
                    <span className="w-20 font-bold uppercase text-neutral-950">Lampiran</span>
                    <span className="font-medium text-neutral-800">: &nbsp;{data.lampiran || "-"}</span>
                  </div>
                </div>

                <div className="text-right font-extrabold text-neutral-950 text-xs">
                  {data.cityAndDate || `Bandung, ${data.sphDate}`}
                </div>
              </div>

              {/* 4. OPENING GREETING */}
              <div className="space-y-1.5 text-xs leading-relaxed text-neutral-900 mb-3">
                <p className="font-bold">Dengan hormat,</p>
                <p className="text-justify indent-6">
                  Terima kasih atas kesempatan yang diberikan kepada PT Harapan Utama Motor Authorized Distributor Shell Lubricants Jawa Barat &amp; Jawa Tengah untuk dapat menawarkan produk pelumas Shell (Oli/Gemuk/Pendingin) sesuai kebutuhan perusahaan Bapak/Ibu. Bersama surat ini kami sampaikan penawaran harga sebagai berikut:
                </p>
              </div>

              {/* 5. PRODUCTS & PRICING TABLE (100% Matching Office Columns) */}
              <div className="overflow-x-auto mb-3">
                <table className="w-full border-collapse border border-neutral-950 text-xs">
                  <thead>
                    <tr className="bg-neutral-100 text-neutral-950 font-bold text-center">
                      <th className="border border-neutral-950 px-2 py-1.5 w-8">No</th>
                      <th className="border border-neutral-950 px-2.5 py-1.5 text-left">Nama Produk</th>
                      <th className="border border-neutral-950 px-2.5 py-1.5 text-left">Deskripsi Produk</th>
                      <th className="border border-neutral-950 px-2 py-1.5 w-18">Pack</th>
                      <th className="border border-neutral-950 px-2 py-1.5 w-16">Unit</th>
                      <th className="border border-neutral-950 px-2.5 py-1.5 text-right">Price/Unit</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.items.map((item, idx) => (
                      <tr key={idx} className="hover:bg-neutral-50/70">
                        <td className="border border-neutral-950 px-2 py-1.5 text-center font-bold">
                          {idx + 1}
                        </td>
                        <td className="border border-neutral-950 px-2.5 py-1.5 font-bold text-neutral-950">
                          {item.productName}
                        </td>
                        <td className="border border-neutral-950 px-2.5 py-1.5 text-neutral-800">
                          {item.description || "-"}
                        </td>
                        <td className="border border-neutral-950 px-2 py-1.5 text-center font-bold">
                          {item.pack || "DRUM"}
                        </td>
                        <td className="border border-neutral-950 px-2 py-1.5 text-center font-semibold">
                          {item.unit || "209 L"}
                        </td>
                        <td className="border border-neutral-950 px-2.5 py-1.5 text-right font-mono font-bold text-neutral-950">
                          {formatCurrency(item.offeredPrice)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* 6. CONDITIONS BLOCK */}
              <div className="space-y-1 text-xs text-neutral-900 mb-3">
                <p className="font-bold">Adapun Ketentuan Penawaran kami:</p>
                <div className="space-y-0.5 pl-2">
                  <p>❖ Harga diatas <strong>{isPpnInclusive ? "SUDAH" : "BELUM"}</strong> termasuk Pajak Pertambahan Nilai (PPN 11%)</p>
                  <p>❖ Harga diatas sudah termasuk pengiriman seluruh area Jawa Barat &amp; Jawa Tengah</p>
                  <p>❖ Harga dapat berubah mengikuti ketersedian barang, harga perkembangan dollar &amp; minyak dunia</p>
                  <p>❖ <strong>Franco</strong> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: ${data.francoLocation || data.customerName}</p>
                  <p>❖ <strong>Pembayaran</strong> &nbsp;: ${data.paymentTerm || "30 Hari"}</p>
                </div>
              </div>

              {/* 7. CLOSING PARAGRAPH */}
              <div className="text-xs leading-relaxed text-neutral-900 mb-3">
                <p className="text-justify">
                  Demikian penawaran ini kami sampaikan. Besar harapan kami agar produk yang kami tawarkan dapat memenuhi kebutuhan perusahaan Bapak/Ibu. Atas perhatian dan kerjasamanya kami ucapkan terima kasih.
                </p>
              </div>

              {/* 8. OFFICIAL SIGNATURE BLOCK OF BIMA MAULANA SAPUTRA WITH PT HUM STAMP */}
              <div className="pt-1 mb-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/sph/bima_signature_stamp.png"
                  alt="Hormat Kami PT. Harapan Utama Motor - Bima Maulana Saputra"
                  className="w-52 h-auto object-contain object-left"
                />
              </div>
            </div>

            {/* 9. OFFICIAL FOOTER BANNER */}
            <div className="w-full pt-1 border-t border-neutral-300 mt-auto">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/sph/official_footer_complete.png"
                alt="Footer PT Harapan Utama Motor"
                className="w-full max-h-[80px] object-fill object-bottom"
              />
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
