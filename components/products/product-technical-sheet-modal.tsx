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
  Award,
  AlertTriangle,
  Send,
  Loader2,
  Flame,
  Info,
  CheckCircle2,
  FileSpreadsheet,
  ExternalLink,
  Globe,
  Filter,
} from "lucide-react";
import { useToast } from "@/components/ui/toast-context";
import { parseProductDetails } from "@/components/pipeline/product-combobox";
import { cn } from "@/lib/utils/cn";
import { lookupProductTDS, type ShellFamilyTDS } from "@/lib/constants/shell-technical-knowledge";
import { getDeepProductTDSAnalysisAction, type ProductTDSAnalysisResult } from "@/actions/ai";

export type MasterProductItem = {
  id: string;
  brand: string;
  product_name: string;
  category: string | null;
  viscosity: string | null;
  packaging?: string | null;
  packaging_size?: number | null;
};

type ActiveSubTab = "tds" | "approvals" | "msds" | "ai_expert";

type CategoryFilter =
  | "ALL"
  | "TELLUS"
  | "OMALA"
  | "RIMULA"
  | "GADUS"
  | "SPIRAX"
  | "CORENA"
  | "TURBO"
  | "ARGINA_MYSELLA"
  | "MORLINA"
  | "DIALA"
  | "TONNA"
  | "REFRIGERATION"
  | "HEAT_TRANSFER"
  | "CASSIDA"
  | "AEROSHELL"
  | "COOLANT"
  | "HELIX_ADVANCE";

const CATEGORY_FILTERS: Array<{ id: CategoryFilter; label: string; keyword: string }> = [
  { id: "ALL", label: "Semua (443)", keyword: "" },
  { id: "TELLUS", label: "Hydraulic (Tellus)", keyword: "TELLUS" },
  { id: "OMALA", label: "Gear (Omala)", keyword: "OMALA" },
  { id: "RIMULA", label: "Diesel (Rimula)", keyword: "RIMULA" },
  { id: "GADUS", label: "Grease (Gadus)", keyword: "GADUS" },
  { id: "SPIRAX", label: "Transmisi (Spirax)", keyword: "SPIRAX" },
  { id: "CORENA", label: "Kompresor (Corena)", keyword: "CORENA" },
  { id: "TURBO", label: "Turbin (Turbo)", keyword: "TURBO" },
  { id: "ARGINA_MYSELLA", label: "PLTD/Gas (Argina/Mysella)", keyword: "ARGINA,MYSELLA,GADINIA" },
  { id: "MORLINA", label: "Sirkulasi (Morlina)", keyword: "MORLINA" },
  { id: "DIALA", label: "Trafo (Diala/Midel)", keyword: "DIALA,MIDEL" },
  { id: "TONNA", label: "Slideway (Tonna)", keyword: "TONNA" },
  { id: "REFRIGERATION", label: "Pendingin (Refrig)", keyword: "REFRIGERATION" },
  { id: "HEAT_TRANSFER", label: "Thermal (Hot Oil)", keyword: "HEAT" },
  { id: "CASSIDA", label: "Food Grade (Cassida)", keyword: "CASSIDA" },
  { id: "AEROSHELL", label: "Aviation (AeroShell)", keyword: "AEROSHELL" },
  { id: "COOLANT", label: "Coolant & Brake", keyword: "COOLANT,RECO,BRAKE" },
  { id: "HELIX_ADVANCE", label: "Mobil/Motor (Helix/Advance)", keyword: "HELIX,ADVANCE" },
];

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
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<CategoryFilter>("ALL");
  const [selectedProductId, setSelectedProductId] = useState<string>(products[0]?.id || "");
  const [activeTab, setActiveTab] = useState<ActiveSubTab>("tds");
  const [copied, setCopied] = useState(false);

  // AI LubeExpert Interactive State
  const [aiQuestion, setAiQuestion] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiAnalysisResult, setAiAnalysisResult] = useState<ProductTDSAnalysisResult | null>(null);

  const filteredProducts = useMemo(() => {
    let list = products;

    // Filter by category pill if not ALL
    if (activeCategoryFilter !== "ALL") {
      const activePill = CATEGORY_FILTERS.find((c) => c.id === activeCategoryFilter);
      if (activePill && activePill.keyword) {
        const keywords = activePill.keyword.split(",").map((k) => k.trim().toUpperCase());
        list = list.filter((p) => {
          const pName = p.product_name.toUpperCase();
          const pCat = (p.category || "").toUpperCase();
          return keywords.some((kw) => pName.includes(kw) || pCat.includes(kw));
        });
      }
    }

    // Filter by text search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter((p) => {
        return (
          p.product_name.toLowerCase().includes(q) ||
          p.category?.toLowerCase().includes(q) ||
          p.viscosity?.toLowerCase().includes(q)
        );
      });
    }

    return list;
  }, [products, activeCategoryFilter, searchQuery]);

  const selectedProduct = useMemo(() => {
    return (
      filteredProducts.find((p) => p.id === selectedProductId) ||
      products.find((p) => p.id === selectedProductId) ||
      filteredProducts[0] ||
      products[0]
    );
  }, [filteredProducts, products, selectedProductId]);

  const parsed = selectedProduct
    ? parseProductDetails(selectedProduct.brand, selectedProduct.product_name)
    : null;

  // Resolve Organic Shell TDS & MSDS Data
  const tdsData: ShellFamilyTDS | null = useMemo(() => {
    if (!selectedProduct) return null;
    return lookupProductTDS(selectedProduct.product_name, selectedProduct.category, selectedProduct.viscosity);
  }, [selectedProduct]);

  if (!isOpen) return null;

  // Generate authentic technical talking points for copy
  const technicalSummaryText = selectedProduct && tdsData
    ? `*Lembar Data Teknis Resmi Shell (TDS)*
━━━━━━━━━━━━━━━━━━━━
📦 *Produk:* ${parsed ? parsed.cleanName : selectedProduct.product_name}
🏷️ *Keluarga Pelumas:* ${tdsData.familyName}
🔖 *Kategori:* ${selectedProduct.category || tdsData.category}
🧪 *Viskositas / Grade:* ${selectedProduct.viscosity || "-"}
🛢️ *Kemasan Resmi:* ${parsed?.packaging || selectedProduct.packaging || "Drum (209L)"}

🔬 *Teknologi Base Oil:*
${tdsData.baseOilTech}

🛡️ *Persetujuan OEM & Standar:*
${tdsData.oemApprovals.slice(0, 3).map((a) => `• ${a}`).join("\n")}
${tdsData.industryStandards.slice(0, 2).map((s) => `• ${s}`).join("\n")}

💡 *Keunggulan Proteksi Mesin:*
${tdsData.keyHighlights.map((h) => `• *${h.title}:* ${h.desc}`).join("\n")}

🔄 *Substitusi Kompetitor:*
${tdsData.displacementGuidance}

🏢 *Didistribusikan Resmi Oleh:*
PT Harapan Utama Motor (Shell Commercial Lubricants Authorized Distributor)
_Layanan Uji Lab Shell LubeAnalyst Resmi Tersedia._
🌐 *Shell Global EPC:* https://www.epc.shell.com/Home/CountryList?countryId=ID`
    : "";

  async function handleCopyTechnical() {
    if (!technicalSummaryText) return;
    try {
      await navigator.clipboard.writeText(technicalSummaryText);
      setCopied(true);
      success("Spek TDS Shell berhasil disalin!");
      setTimeout(() => setCopied(false), 2500);
    } catch {
      error("Gagal menyalin spek teknis.");
    }
  }

  async function handleAskAiExpert(customQuery?: string) {
    const q = customQuery || aiQuestion;
    if (!q.trim() || !selectedProduct) return;

    setIsAiLoading(true);
    try {
      const pName = parsed ? parsed.cleanName : selectedProduct.product_name;
      const res = await getDeepProductTDSAnalysisAction(pName, q);
      setAiAnalysisResult(res);
    } catch {
      error("Gagal berkonsultasi dengan Shell AI LubeExpert.");
    } finally {
      setIsAiLoading(false);
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/70 backdrop-blur-xs animate-fade-in-up"
    >
      <div className="relative w-full max-w-5xl rounded-3xl bg-white shadow-2xl border border-neutral-200 overflow-hidden flex flex-col max-h-[94vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-800 bg-neutral-950 text-white">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-white shadow-xs">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-sm font-extrabold tracking-tight">
                  Shell Technical &amp; MSDS Knowledge Hub
                </h2>
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/20 px-2.5 py-0.5 text-[10px] font-bold text-amber-300 border border-amber-500/40">
                  <Sparkles className="h-2.5 w-2.5" /> 443 SKUs Organic TDS
                </span>
              </div>
              <p className="text-[11px] text-neutral-400 font-medium">
                Pusat data teknis asli, viskositas, approval OEM, &amp; MSDS resmi PT Harapan Utama Motor
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="https://www.epc.shell.com/Home/CountryList?countryId=ID"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 px-3 py-1.5 text-xs font-bold transition"
            >
              <Globe className="h-3.5 w-3.5" />
              <span>Shell EPC Resmi</span>
              <ExternalLink className="h-3 w-3" />
            </a>

            <button
              onClick={onClose}
              aria-label="Tutup modal contekan spek Shell"
              className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 active:scale-95 transition cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Category Filter Pills & Search Bar */}
        <div className="p-3.5 border-b border-neutral-200 bg-neutral-50/90 space-y-2.5">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari produk (Tellus S2 MX, Rimula R4 X, Omala S2 GX, Gadus, Corena, Argina, 46, 220, 15W-40, SKU 5500...)..."
              className="w-full rounded-2xl border border-neutral-300 bg-white pl-10 pr-4 py-2.5 text-xs font-medium text-neutral-900 shadow-2xs outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
            />
          </div>

          {/* Category Quick Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
            <span className="text-[10px] font-bold uppercase text-neutral-500 flex items-center gap-1 shrink-0 pr-1">
              <Filter className="h-3 w-3" /> Kategori:
            </span>
            {CATEGORY_FILTERS.map((cat) => {
              const isActive = activeCategoryFilter === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategoryFilter(cat.id)}
                  className={cn(
                    "shrink-0 px-2.5 py-1 rounded-xl text-[11px] font-bold transition active:scale-95 cursor-pointer",
                    isActive
                      ? "bg-neutral-900 text-white shadow-xs"
                      : "bg-white text-neutral-700 border border-neutral-200 hover:bg-neutral-100"
                  )}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Body: Split View (List on left, Detail on right) */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-neutral-200">
          {/* Left Column: Product List */}
          <div className="md:col-span-4 p-3 space-y-1.5 max-h-[300px] md:max-h-[520px] overflow-y-auto bg-neutral-50/40">
            <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider px-1 pb-1 flex justify-between">
              <span>Hasil Pencarian ({filteredProducts.length} SKU)</span>
            </div>

            {filteredProducts.length > 0 ? (
              filteredProducts.map((p) => {
                const isSelected = selectedProduct?.id === p.id;
                const pDetails = parseProductDetails(p.brand, p.product_name);

                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => {
                      setSelectedProductId(p.id);
                      setAiAnalysisResult(null);
                    }}
                    className={cn(
                      "w-full text-left p-3 min-h-[50px] rounded-2xl border text-xs transition active:scale-[0.99] cursor-pointer space-y-1",
                      isSelected
                        ? "border-amber-500 bg-amber-500/10 ring-1 ring-amber-400/40 shadow-xs"
                        : "border-neutral-200 bg-white hover:bg-neutral-100/70"
                    )}
                  >
                    <p className="font-bold text-neutral-900 truncate">
                      {pDetails.cleanName}
                    </p>
                    <div className="flex items-center gap-1.5 text-[10px] text-neutral-500 flex-wrap">
                      {pDetails.sku && (
                        <span className="font-mono bg-neutral-200 text-neutral-800 px-1.5 py-0.2 rounded font-semibold">
                          {pDetails.sku}
                        </span>
                      )}
                      <span className="font-medium text-neutral-600">{p.category || "Lubricant"}</span>
                      {p.viscosity && <span className="font-bold text-neutral-700">&bull; {p.viscosity}</span>}
                    </div>
                  </button>
                );
              })
            ) : (
              <div className="py-8 text-center text-xs text-neutral-400">
                Tidak ada SKU yang cocok dengan filter.
              </div>
            )}
          </div>

          {/* Right Column: Selected Product Detail */}
          <div className="md:col-span-8 p-4 sm:p-5 space-y-4 max-h-[520px] overflow-y-auto">
            {selectedProduct && parsed && tdsData ? (
              <div className="space-y-4">
                {/* Header Card */}
                <div className="rounded-3xl bg-gradient-to-br from-amber-500/15 via-amber-50/40 to-white border border-amber-300/80 p-4 sm:p-5 space-y-2 shadow-2xs">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-extrabold uppercase bg-amber-500/20 text-amber-950 px-2.5 py-0.5 rounded-lg border border-amber-500/30">
                        {tdsData.category}
                      </span>
                      {parsed.sku && (
                        <span className="text-[10px] font-mono font-bold bg-neutral-900 text-white px-2.5 py-0.5 rounded-lg">
                          SKU: {parsed.sku}
                        </span>
                      )}
                      {selectedProduct.viscosity && (
                        <span className="text-[10px] font-bold bg-white text-neutral-800 px-2.5 py-0.5 rounded-lg border border-neutral-200">
                          ISO / SAE: {selectedProduct.viscosity}
                        </span>
                      )}
                    </div>

                    <a
                      href={`https://www.epc.shell.com/Home/CountryList?countryId=ID`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 hover:text-amber-950 underline"
                    >
                      <Globe className="h-3 w-3" />
                      <span>Cek Shell EPC PDF</span>
                      <ExternalLink className="h-2.5 w-2.5" />
                    </a>
                  </div>

                  <div>
                    <h3 className="text-base sm:text-lg font-extrabold text-neutral-950 tracking-tight leading-snug">
                      {parsed.cleanName}
                    </h3>
                    <p className="text-xs text-neutral-700 font-medium mt-0.5">
                      {tdsData.tagline}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-amber-200/80 text-xs text-neutral-700 flex-wrap gap-2">
                    <p className="text-[11px] font-medium">
                      Kemasan Resmi: <strong className="text-neutral-900">{parsed.packaging || selectedProduct.packaging || "Drum (209L)"}</strong>
                    </p>
                    <p className="text-[11px] font-medium text-neutral-600">
                      Base Oil: <strong className="text-neutral-900">{tdsData.baseOilTech.split("(")[0]}</strong>
                    </p>
                  </div>
                </div>

                {/* ⚠️ Technical & Safety Legal Disclaimer Banner */}
                <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-amber-500/10 border border-amber-300 text-[11px] text-amber-950">
                  <AlertTriangle className="h-4 w-4 text-amber-700 shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <p className="font-bold text-amber-900">
                      ⚠️ Draft Panduan Lapangan (Bukan Sumber Kebenaran Hukum Mutlak)
                    </p>
                    <p className="text-neutral-700 leading-relaxed text-[11px]">
                      Data ini adalah ringkasan cepat untuk panduan diskusi. Untuk komitmen garansi OEM dan prosedur K3/MSDS resmi, sales wajib merujuk ke dokumen PDF resmi dari{" "}
                      <a
                        href="https://www.epc.shell.com/Home/CountryList?countryId=ID"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-bold text-amber-800 underline hover:text-amber-950"
                      >
                        Shell Electronic Product Catalogue (epc.shell.com)
                      </a>.
                    </p>
                  </div>
                </div>

                {/* Sub-Navigation Tabs */}
                <div className="flex border-b border-neutral-200 bg-neutral-100/70 rounded-2xl p-1 gap-1">
                  <button
                    type="button"
                    onClick={() => setActiveTab("tds")}
                    className={cn(
                      "flex-1 min-h-[38px] py-1.5 px-2 text-xs font-bold rounded-xl transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-1.5",
                      activeTab === "tds"
                        ? "bg-white text-amber-900 shadow-xs border border-amber-300 font-extrabold"
                        : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200/60"
                    )}
                  >
                    <FileSpreadsheet className="h-3.5 w-3.5 text-amber-600" />
                    <span>Parameter TDS</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab("approvals")}
                    className={cn(
                      "flex-1 min-h-[38px] py-1.5 px-2 text-xs font-bold rounded-xl transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-1.5",
                      activeTab === "approvals"
                        ? "bg-white text-amber-900 shadow-xs border border-amber-300 font-extrabold"
                        : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200/60"
                    )}
                  >
                    <Award className="h-3.5 w-3.5 text-amber-600" />
                    <span>OEM &amp; Proteksi</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab("msds")}
                    className={cn(
                      "flex-1 min-h-[38px] py-1.5 px-2 text-xs font-bold rounded-xl transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-1.5",
                      activeTab === "msds"
                        ? "bg-white text-amber-900 shadow-xs border border-amber-300 font-extrabold"
                        : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200/60"
                    )}
                  >
                    <AlertTriangle className="h-3.5 w-3.5 text-amber-600" />
                    <span>MSDS &amp; Safety</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab("ai_expert")}
                    className={cn(
                      "flex-1 min-h-[38px] py-1.5 px-2 text-xs font-bold rounded-xl transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-1.5",
                      activeTab === "ai_expert"
                        ? "bg-white text-purple-900 shadow-xs border border-purple-300 font-extrabold"
                        : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200/60"
                    )}
                  >
                    <Sparkles className="h-3.5 w-3.5 text-purple-600" />
                    <span>Tanya AI</span>
                  </button>
                </div>

                {/* TAB 1: TDS PHYSICAL PARAMETERS */}
                {activeTab === "tds" && (
                  <div className="space-y-3.5">
                    <div className="rounded-2xl border border-neutral-200 bg-white overflow-hidden shadow-2xs">
                      <div className="bg-neutral-900 text-white px-4 py-2.5 flex items-center justify-between">
                        <span className="text-xs font-bold flex items-center gap-1.5">
                          <FileSpreadsheet className="h-4 w-4 text-amber-400" />
                          <span>Karakteristik Fisik Tipikal (Typical Physical Characteristics)</span>
                        </span>
                        <span className="text-[10px] font-mono text-neutral-400">ASTM / ISO Method</span>
                      </div>
                      <div className="divide-y divide-neutral-100 text-xs">
                        {tdsData.typicalPhysicalProps.map((prop, idx) => (
                          <div key={idx} className="flex items-center justify-between px-4 py-2.5 hover:bg-neutral-50/70">
                            <div>
                              <span className="font-semibold text-neutral-900">{prop.property}</span>
                              {prop.method && (
                                <span className="ml-2 text-[10px] font-mono text-neutral-500">
                                  ({prop.method})
                                </span>
                              )}
                            </div>
                            <div className="font-bold text-neutral-900">
                              {prop.value} <span className="text-neutral-500 font-normal">{prop.unit}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-2xl border border-neutral-200 bg-neutral-50/70 p-3.5 space-y-1.5 text-xs text-neutral-800">
                      <span className="font-bold text-neutral-900 flex items-center gap-1.5">
                        <Info className="h-4 w-4 text-amber-600" />
                        <span>Aplikasi Lapangan yang Direkomendasikan:</span>
                      </span>
                      <ul className="list-disc list-inside space-y-1 text-[11px] text-neutral-700 font-medium pl-1">
                        {tdsData.typicalApplications.map((app, i) => (
                          <li key={i}>{app}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {/* TAB 2: OEM APPROVALS & PROTECTION HIGHLIGHTS */}
                {activeTab === "approvals" && (
                  <div className="space-y-3.5">
                    {/* Key Technical Highlights */}
                    <div className="rounded-2xl border border-neutral-200 bg-white p-4 space-y-2.5 shadow-2xs">
                      <span className="text-xs font-bold uppercase tracking-wider text-neutral-900 flex items-center gap-1.5">
                        <ShieldCheck className="h-4 w-4 text-emerald-600" />
                        <span>Keunggulan Formula &amp; Proteksi Mesin:</span>
                      </span>
                      <ul className="space-y-2.5 text-xs text-neutral-700 leading-relaxed font-medium">
                        {tdsData.keyHighlights.map((hl, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold mt-0.5">
                              ✓
                            </span>
                            <span><strong>{hl.title}:</strong> {hl.desc}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* OEM Approvals & Industry Standards */}
                    <div className="rounded-2xl border border-neutral-200 bg-white p-4 space-y-2.5 shadow-2xs">
                      <span className="text-xs font-bold uppercase tracking-wider text-neutral-900 flex items-center gap-1.5">
                        <Award className="h-4 w-4 text-amber-600" />
                        <span>Persetujuan OEM Resmi (Original Equipment Manufacturer):</span>
                      </span>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {tdsData.oemApprovals.map((appr, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-1 rounded-xl bg-neutral-100 px-2.5 py-1 text-[11px] font-bold text-neutral-800 border border-neutral-200"
                          >
                            <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                            <span>{appr}</span>
                          </span>
                        ))}
                      </div>

                      <span className="text-xs font-bold uppercase tracking-wider text-neutral-900 flex items-center gap-1.5 pt-2 border-t border-neutral-100">
                        <Info className="h-4 w-4 text-neutral-500" />
                        <span>Standar Industri Terpenuhi:</span>
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {tdsData.industryStandards.map((std, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-1 rounded-xl bg-amber-500/10 px-2.5 py-1 text-[11px] font-bold text-amber-950 border border-amber-500/30"
                          >
                            <span>{std}</span>
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Competitor Displacement */}
                    <div className="rounded-2xl border border-blue-200 bg-blue-50/50 p-3.5 space-y-1 text-xs text-blue-950">
                      <span className="font-bold flex items-center gap-1">
                        🔄 <strong>Substitusi Langsung dari Kompetitor:</strong>
                      </span>
                      <p className="text-[11px] leading-relaxed font-medium">
                        {tdsData.displacementGuidance}
                      </p>
                    </div>
                  </div>
                )}

                {/* TAB 3: MSDS & SAFETY */}
                {activeTab === "msds" && (
                  <div className="space-y-3.5">
                    <div className="rounded-2xl border border-amber-300 bg-amber-50/50 p-4 space-y-3 shadow-2xs">
                      <div className="flex items-center gap-2">
                        <Flame className="h-5 w-5 text-amber-600" />
                        <h4 className="text-xs font-bold text-amber-950 uppercase tracking-wide">
                          Ringkasan Lembar Keselamatan Bahan (MSDS)
                        </h4>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div className="rounded-xl bg-white p-3 border border-amber-200 space-y-1">
                          <span className="font-bold text-neutral-900 block">🔥 Titik Nyala (Flash Point):</span>
                          <p className="text-[11px] text-neutral-700">{tdsData.msdsSummary.flashPoint}</p>
                        </div>

                        <div className="rounded-xl bg-white p-3 border border-amber-200 space-y-1">
                          <span className="font-bold text-neutral-900 block">🥽 Rekomendasi APD:</span>
                          <p className="text-[11px] text-neutral-700">{tdsData.msdsSummary.recommendedPPE}</p>
                        </div>

                        <div className="rounded-xl bg-white p-3 border border-amber-200 space-y-1">
                          <span className="font-bold text-neutral-900 block">📦 Penyimpanan &amp; Suhu:</span>
                          <p className="text-[11px] text-neutral-700">{tdsData.msdsSummary.storageHandling}</p>
                        </div>

                        <div className="rounded-xl bg-white p-3 border border-amber-200 space-y-1">
                          <span className="font-bold text-neutral-900 block">🧯 Bahaya Kebakaran:</span>
                          <p className="text-[11px] text-neutral-700">{tdsData.msdsSummary.fireHazard}</p>
                        </div>
                      </div>

                      <div className="rounded-xl bg-white p-3 border border-amber-200 space-y-1 text-xs">
                        <span className="font-bold text-neutral-900 block">🩹 Pertolongan Pertama (First Aid):</span>
                        <p className="text-[11px] text-neutral-700">
                          <strong>Kulit:</strong> {tdsData.msdsSummary.firstAidSkin}
                        </p>
                        <p className="text-[11px] text-neutral-700">
                          <strong>Mata:</strong> {tdsData.msdsSummary.firstAidEye}
                        </p>
                      </div>

                      <div className="rounded-xl bg-white p-3 border border-amber-200 space-y-1 text-xs">
                        <span className="font-bold text-neutral-900 block">♻️ Penanganan Tumpahan &amp; Limbah:</span>
                        <p className="text-[11px] text-neutral-700">{tdsData.msdsSummary.spillDisposal}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 4: INTERACTIVE AI LUBEEXPERT */}
                {activeTab === "ai_expert" && (
                  <div className="space-y-3.5">
                    <div className="rounded-2xl border border-purple-200 bg-purple-50/50 p-4 space-y-3 shadow-2xs">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-purple-600 text-white">
                            <Sparkles className="h-4 w-4" />
                          </div>
                          <div>
                            <h4 className="text-xs font-extrabold text-purple-950">
                              Shell AI LubeExpert (Konsultasi Lapangan)
                            </h4>
                            <p className="text-[10px] text-purple-700 font-medium">
                              Tanyakan kompatibilitas mesin spesifik, interval tap oli, atau argumen teknis.
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Question Input */}
                      <div className="space-y-2">
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={aiQuestion}
                            onChange={(e) => setAiQuestion(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" && !isAiLoading) {
                                handleAskAiExpert();
                              }
                            }}
                            placeholder="Misal: Apakah aman dipakai di pompa piston Rexroth 350 bar?"
                            className="flex-1 rounded-xl border border-purple-300 bg-white px-3.5 py-2 text-xs text-neutral-900 outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-200 shadow-2xs"
                          />
                          <button
                            type="button"
                            onClick={() => handleAskAiExpert()}
                            disabled={isAiLoading || !aiQuestion.trim()}
                            className="min-h-[40px] px-3.5 rounded-xl bg-purple-600 text-white text-xs font-bold hover:bg-purple-700 active:scale-95 transition disabled:opacity-50 flex items-center gap-1.5 cursor-pointer shadow-2xs"
                          >
                            {isAiLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                            <span>Tanya</span>
                          </button>
                        </div>

                        {/* Quick Prompt Presets */}
                        <div className="flex items-center gap-1.5 flex-wrap pt-1">
                          <span className="text-[10px] font-bold text-purple-900">Preset Taktis:</span>
                          <button
                            type="button"
                            onClick={() => {
                              const q = `Berapa estimasi interval pergantian oli (drain interval) dan bagaimana cara transisi flushing dari oli lama?`;
                              setAiQuestion(q);
                              handleAskAiExpert(q);
                            }}
                            className="text-[10px] font-semibold bg-white border border-purple-200 text-purple-900 px-2 py-0.5 rounded-lg hover:bg-purple-100 active:scale-95 transition"
                          >
                            ⏱️ Interval Drain &amp; Flushing
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              const q = `Apa keunggulan teknis produk ini jika dibandingkan langsung dengan produk setara dari Pertamina atau Mobil?`;
                              setAiQuestion(q);
                              handleAskAiExpert(q);
                            }}
                            className="text-[10px] font-semibold bg-white border border-purple-200 text-purple-900 px-2 py-0.5 rounded-lg hover:bg-purple-100 active:scale-95 transition"
                          >
                            ⚔️ Head-to-Head vs Kompetitor
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              const q = `Apakah produk ini bersertifikasi OEM dan memenuhi syarat garansi mesin pabrik?`;
                              setAiQuestion(q);
                              handleAskAiExpert(q);
                            }}
                            className="text-[10px] font-semibold bg-white border border-purple-200 text-purple-900 px-2 py-0.5 rounded-lg hover:bg-purple-100 active:scale-95 transition"
                          >
                            📜 Garansi OEM Mesin
                          </button>
                        </div>
                      </div>

                      {/* AI Answer Result Card */}
                      {aiAnalysisResult && (
                        <div className="rounded-2xl bg-white border border-purple-200 p-4 space-y-3 text-xs animate-fade-in-up">
                          <div className="space-y-1.5">
                            <span className="font-extrabold text-neutral-900 flex items-center gap-1.5">
                              <Sparkles className="h-4 w-4 text-purple-600" />
                              <span>Analisis Teknis AI LubeExpert:</span>
                            </span>
                            <p className="text-neutral-700 leading-relaxed whitespace-pre-line font-medium">
                              {aiAnalysisResult.answer}
                            </p>
                          </div>

                          {aiAnalysisResult.oemGuidance && (
                            <div className="rounded-xl bg-amber-50/70 p-2.5 border border-amber-200 text-[11px] text-amber-950 font-medium">
                              🏷️ <strong>Standar OEM:</strong> {aiAnalysisResult.oemGuidance}
                            </div>
                          )}

                          {aiAnalysisResult.tacticalSalesPitch && (
                            <div className="rounded-xl bg-purple-50 p-2.5 border border-purple-200 text-[11px] text-purple-950 font-medium italic">
                              💡 <strong>Soundbite Taktis ke Customer:</strong> &ldquo;{aiAnalysisResult.tacticalSalesPitch}&rdquo;
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Copy Talking Points to WhatsApp */}
                <div className="rounded-2xl border border-amber-200 bg-amber-500/10 p-3.5 flex items-center justify-between gap-2 flex-wrap shadow-2xs">
                  <div className="text-xs text-amber-950">
                    <span className="font-bold block">Salin Format TDS untuk WhatsApp</span>
                    <span className="text-[11px] text-neutral-700 font-medium">
                      Kirimkan rincian spek teknis asli, viskositas, dan approval resmi ke customer.
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyTechnical}
                    className="inline-flex items-center gap-1.5 min-h-[44px] rounded-xl bg-neutral-900 px-4 py-2 text-xs font-bold text-white shadow-2xs hover:bg-neutral-800 active:scale-95 transition cursor-pointer"
                  >
                    {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                    <span>{copied ? "Tersalin Lengkap!" : "Salin TDS ke WA"}</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="py-12 text-center text-xs text-neutral-400">
                Pilih produk di sebelah kiri untuk melihat lembar data teknis Shell asli.
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-neutral-200 bg-neutral-50/90 flex-wrap gap-2">
          <div className="text-[11px] text-neutral-600 font-medium flex items-center gap-2">
            <span>🛡️ Data Teknis Grounded Resmi Shell Global &amp; PT Harapan Utama Motor</span>
            <span className="text-neutral-300">•</span>
            <a
              href="https://www.epc.shell.com/Home/CountryList?countryId=ID"
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-700 hover:text-amber-900 font-bold underline inline-flex items-center gap-1"
            >
              <span>epc.shell.com (Indonesia)</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="min-h-[44px] rounded-xl bg-neutral-900 px-6 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-neutral-800 active:scale-95 transition cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
