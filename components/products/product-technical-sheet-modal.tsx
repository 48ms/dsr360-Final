"use client";

import { useState, useMemo } from "react";
import {
  Search,
  BookOpen,
  X,
  Copy,
  Check,
  ShieldCheck,
  Sparkles,
  Layers,
  Award,
  ExternalLink,
} from "lucide-react";
import { useToast } from "@/components/ui/toast-context";
import { cleanProductName, parseProductDetails } from "@/components/pipeline/product-combobox";
import { formatCurrency } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";

export type MasterProductItem = {
  id: string;
  brand: string;
  product_name: string;
  category: string | null;
  viscosity: string | null;
  packaging?: string | null;
  packaging_size?: number | null;
};

export function ProductTechnicalSheetModal({
  isOpen,
  onClose,
  products = [],
}: {
  isOpen: boolean;
  onClose: () => void;
  products: MasterProductItem[];
}) {
  const { success, error } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProductId, setSelectedProductId] = useState<string>(products[0]?.id || "");
  const [copied, setCopied] = useState(false);

  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return products.slice(0, 50);
    const q = searchQuery.toLowerCase();
    return products.filter((p) => {
      return (
        p.product_name.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q) ||
        p.viscosity?.toLowerCase().includes(q)
      );
    });
  }, [products, searchQuery]);

  const selectedProduct = useMemo(() => {
    return products.find((p) => p.id === selectedProductId) || products[0];
  }, [products, selectedProductId]);

  if (!isOpen) return null;

  const parsed = selectedProduct
    ? parseProductDetails(selectedProduct.brand, selectedProduct.product_name)
    : null;

  // Generate technical talking points for copy
  const technicalSummaryText = selectedProduct
    ? `*Informasi Teknis Pelumas Shell*
Produk: ${parsed ? parsed.cleanName : selectedProduct.product_name}
Kategori: ${selectedProduct.category || "Industrial Lubricants"}
Viskositas: ${selectedProduct.viscosity || "-"}
Kemasan Resmi: ${parsed?.packaging || selectedProduct.packaging || "Drum (209L)"}
Keunggulan Utama: Perlindungan anti-aus maksimal, ketahanan oksidasi tinggi, efisiensi konsumsi energi mesin pabrik, didukung uji lab Shell LubeAnalyst resmi PT Harapan Utama Motor.`
    : "";

  async function handleCopyTechnical() {
    if (!technicalSummaryText) return;
    try {
      await navigator.clipboard.writeText(technicalSummaryText);
      setCopied(true);
      success("Spek teknis berhasil disalin!");
      setTimeout(() => setCopied(false), 2500);
    } catch {
      error("Gagal menyalin spek teknis.");
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in-up"
    >
      <div className="relative w-full max-w-2xl rounded-3xl bg-white shadow-2xl border border-neutral-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-100 bg-neutral-900 text-white">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500 text-white shadow-xs">
              <BookOpen className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold tracking-tight flex items-center gap-2">
                <span>Shell Technical Selling Hub</span>
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold text-amber-300 border border-amber-500/40">
                  <Sparkles className="h-2.5 w-2.5" /> 443 SKUs
                </span>
              </h2>
              <p className="text-[11px] text-neutral-400 font-medium">
                Pusat contekan teknis, viskositas &amp; selling points pelumas Shell resmi PT HUM
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 transition cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-4 border-b border-neutral-100 bg-neutral-50/50">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari produk (Tellus, Rimula, Omala, Gadus, Corena, 46, 220, 15W-40)..."
              className="w-full rounded-2xl border border-neutral-200 bg-white pl-10 pr-4 py-2.5 text-xs text-neutral-900 shadow-2xs outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
            />
          </div>
        </div>

        {/* Body: Split View (List on left, Detail on right) */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-neutral-100">
          {/* Left Column: Product List */}
          <div className="md:col-span-5 p-3 space-y-1.5 max-h-[380px] md:max-h-[460px] overflow-y-auto">
            {filteredProducts.map((p) => {
              const isSelected = selectedProduct?.id === p.id;
              const pDetails = parseProductDetails(p.brand, p.product_name);

              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setSelectedProductId(p.id)}
                  className={cn(
                    "w-full text-left p-2.5 rounded-xl border text-xs transition cursor-pointer space-y-0.5",
                    isSelected
                      ? "border-amber-500 bg-amber-50/80 ring-1 ring-amber-400/30"
                      : "border-neutral-100 bg-white hover:bg-neutral-50"
                  )}
                >
                  <p className="font-bold text-neutral-900 truncate">
                    {pDetails.cleanName}
                  </p>
                  <div className="flex items-center gap-1.5 text-[10px] text-neutral-500 flex-wrap">
                    {pDetails.sku && (
                      <span className="font-mono bg-neutral-200/70 text-neutral-700 px-1 py-0.2 rounded">
                        {pDetails.sku}
                      </span>
                    )}
                    <span>{p.category || "Lubricant"}</span>
                    {p.viscosity && <span>&bull; {p.viscosity}</span>}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right Column: Selected Product Detail */}
          <div className="md:col-span-7 p-4 sm:p-5 space-y-4 max-h-[460px] overflow-y-auto">
            {selectedProduct && parsed ? (
              <div className="space-y-4">
                {/* Header Card */}
                <div className="rounded-2xl bg-amber-500/10 border border-amber-300/80 p-4 space-y-1.5">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-extrabold uppercase bg-amber-200 text-amber-900 px-2 py-0.5 rounded-md">
                      {selectedProduct.category || "Industrial"}
                    </span>
                    {parsed.sku && (
                      <span className="text-[10px] font-mono font-bold bg-neutral-900 text-white px-2 py-0.5 rounded-md">
                        SKU: {parsed.sku}
                      </span>
                    )}
                  </div>
                  <h3 className="text-base font-extrabold text-neutral-900 tracking-tight">
                    {parsed.cleanName}
                  </h3>
                  <p className="text-xs text-neutral-600 font-medium">
                    Kemasan Resmi: <strong>{parsed.packaging || selectedProduct.packaging || "Drum (209L)"}</strong>
                  </p>
                </div>

                {/* Key Technical Highlights */}
                <div className="rounded-2xl border border-neutral-200 bg-white p-4 space-y-2.5 shadow-2xs">
                  <span className="text-xs font-bold uppercase tracking-wider text-neutral-900 flex items-center gap-1.5">
                    <ShieldCheck className="h-4 w-4 text-emerald-600" />
                    <span>Keunggulan Formula &amp; Proteksi Mesin:</span>
                  </span>
                  <ul className="space-y-2 text-xs text-neutral-700 leading-relaxed font-medium">
                    <li className="flex items-start gap-2">
                      <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold mt-0.5">
                        ✓
                      </span>
                      <span><strong>Ketahanan Oksidasi Unggul:</strong> Memperpanjang interval tap oli hingga 2x lipat dan mencegah deposit kerak lumpur (sludge).</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold mt-0.5">
                        ✓
                      </span>
                      <span><strong>Perlindungan Anti-Wear:</strong> Menjaga presisi katup dan komponen pompa dari keausan ekstrim saat beban berat.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold mt-0.5">
                        ✓
                      </span>
                      <span><strong>Layanan Uji Lab Shell LubeAnalyst:</strong> Dilengkapi fasilitas uji sampel oli bekas gratis dari PT Harapan Utama Motor.</span>
                    </li>
                  </ul>
                </div>

                {/* Copy Talking Points to WhatsApp */}
                <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-3.5 flex items-center justify-between gap-2 flex-wrap">
                  <div className="text-xs text-amber-950">
                    <span className="font-bold block">Salin Spek untuk Chat WA</span>
                    <span className="text-[11px] text-neutral-600">
                      Kirimkan rangkuman teknis ini langsung ke customer.
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyTechnical}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-neutral-900 px-3.5 py-2 text-xs font-bold text-white shadow-2xs hover:bg-neutral-800 transition cursor-pointer"
                  >
                    {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                    <span>{copied ? "Tersalin!" : "Salin ke WA"}</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="py-12 text-center text-xs text-neutral-400">
                Pilih produk di sebelah kiri untuk melihat rincian teknis.
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end p-4 border-t border-neutral-100 bg-neutral-50/80">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-neutral-900 px-5 py-2 text-xs font-bold text-white shadow-xs hover:bg-neutral-800 transition cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
