"use client";

import { useState, useMemo } from "react";
import {
  Calculator,
  FileText,
  Sparkles,
  Plus,
  Trash2,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  DollarSign,
  Building2,
  User,
  Phone,
  Printer,
  Share2,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  Search,
  Check,
  Edit2,
} from "lucide-react";
import { useToast } from "@/components/ui/toast-context";
import {
  SHELL_PRICING_DATABASE,
  calculateFloorPrice,
  calculatePphSelisih,
  calculateTERIncentive,
  type ShellPricingItem,
} from "@/lib/constants/shell-pricing-database";
import { ProductSearchCombobox } from "@/components/calculator/product-search-combobox";
import { SphDocumentPreviewModal } from "@/components/calculator/sph-document-preview-modal";
import {
  saveSphQuotationAction,
  type SphItemInput,
  type SphPayloadInput,
} from "@/actions/sph-calculator";
import { formatCurrency, getTodayWIB } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";

type LineItem = {
  id: string;
  selectedProduct: ShellPricingItem | null;
  productName: string;
  description: string;
  pack: string;
  unit: string;
  msp: number;
  feePerUnit: number;
  qty: number;
  offeredPrice: number;
  isCustomMsp?: boolean;
};

export function PriceFeeCalculatorClient({
  customers,
  contacts,
  defaultSphNumber,
  initialCustomerId = null,
}: {
  customers: Array<{ id: string; customer_name: string; address: string | null; city: string | null }>;
  contacts: Array<{ id: string; customer_id: string; name: string; position: string | null; phone: string | null }>;
  defaultSphNumber: string;
  initialCustomerId?: string | null;
}) {
  const { success, error } = useToast();

  // Find initial customer if passed
  const initialCust = initialCustomerId
    ? customers.find((c) => c.id === initialCustomerId)
    : null;
  const initialContacts = initialCustomerId
    ? contacts.filter((con) => con.customer_id === initialCustomerId)
    : [];

  // Mode Selection: "FEE" vs "TER"
  const [pricingMode, setPricingMode] = useState<"FEE" | "TER">("FEE");

  // Customer Context State
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>(initialCustomerId || "");
  const [customerName, setCustomerName] = useState<string>(initialCust?.customer_name || "PT EWINDO");
  const [customerCity, setCustomerCity] = useState<string>(initialCust?.city || "Bandung");
  const [picName, setPicName] = useState<string>(initialContacts[0]?.name || "Bu Violentisca");
  const [picPosition, setPicPosition] = useState<string>(initialContacts[0]?.position || "Purchasing");
  const [picPhone, setPicPhone] = useState<string>(initialContacts[0]?.phone || "081806381897");
  const [paymentTerm, setPaymentTerm] = useState<string>("30 Hari");
  const [francoLocation, setFrancoLocation] = useState<string>(
    initialCust ? `Pabrik ${initialCust.customer_name}` : "PT Ewindo"
  );
  const [sphNumber, setSphNumber] = useState<string>(defaultSphNumber);

  // Line Items State
  const defaultInitialProduct = SHELL_PRICING_DATABASE.find(
    (p) => p.name.includes("OMALA S2 GX 100") || p.name.includes("OMALA S2 GX 150") || p.name.includes("RIMULA R4 X")
  ) || SHELL_PRICING_DATABASE[0];

  const [items, setItems] = useState<LineItem[]>([
    {
      id: "item-1",
      selectedProduct: defaultInitialProduct,
      productName: defaultInitialProduct.name,
      description: defaultInitialProduct.description || "High Performing Industrial Gear Oils",
      pack: defaultInitialProduct.pack || "DRUM",
      unit: defaultInitialProduct.volumeUnit || "209 L",
      msp: defaultInitialProduct.msp,
      feePerUnit: 250000,
      qty: 1,
      offeredPrice: calculateFloorPrice(defaultInitialProduct.msp, 250000),
    },
  ]);

  // SPH Preview Modal
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Handle Customer Selection Autofill
  function handleSelectCustomer(custId: string) {
    setSelectedCustomerId(custId);
    const c = customers.find((cust) => cust.id === custId);
    if (c) {
      setCustomerName(c.customer_name);
      setCustomerCity(c.city || "Bandung");
      setFrancoLocation(`Pabrik ${c.customer_name}`);
      const custContacts = contacts.filter((con) => con.customer_id === custId);
      if (custContacts.length > 0) {
        setPicName(custContacts[0].name);
        setPicPosition(custContacts[0].position || "Purchasing");
        setPicPhone(custContacts[0].phone || "");
      }
    }
  }

  // Add Line Item
  function handleAddLine() {
    const product = defaultInitialProduct;
    setItems((prev) => [
      ...prev,
      {
        id: `item-${Date.now()}`,
        selectedProduct: product,
        productName: product.name,
        description: product.description || "Specialized Industrial Lubricant",
        pack: product.pack || "DRUM",
        unit: product.volumeUnit || "209 L",
        msp: product.msp,
        feePerUnit: pricingMode === "FEE" ? 250000 : 0,
        qty: 1,
        offeredPrice: pricingMode === "FEE" ? calculateFloorPrice(product.msp, 250000) : product.msp,
      },
    ]);
  }

  // Remove Line Item
  function handleRemoveLine(id: string) {
    if (items.length <= 1) {
      error("Minimal harus ada 1 produk dalam kalkulasi.");
      return;
    }
    setItems((prev) => prev.filter((item) => item.id !== id));
  }

  // Update Line Item
  function handleUpdateLine(id: string, updates: Partial<LineItem>) {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const updated = { ...item, ...updates };

          // If product changed via autocomplete
          if (updates.selectedProduct) {
            updated.productName = updates.selectedProduct.name;
            updated.description = updates.selectedProduct.description || "Specialized Industrial Lubricant";
            updated.pack = updates.selectedProduct.pack || "DRUM";
            updated.unit = updates.selectedProduct.volumeUnit || "209 L";
            updated.msp = updates.selectedProduct.msp;
            if (pricingMode === "FEE") {
              updated.offeredPrice = calculateFloorPrice(updates.selectedProduct.msp, updated.feePerUnit);
            } else {
              updated.offeredPrice = updates.selectedProduct.msp;
            }
          }

          // If MSP changed manually, recompute floor price in FEE mode if needed
          if (updates.msp !== undefined && pricingMode === "FEE") {
            const minP = calculateFloorPrice(updates.msp, updated.feePerUnit);
            if (updated.offeredPrice < minP) {
              updated.offeredPrice = minP;
            }
          }

          // If fee changed in Fee mode, update offered price floor
          if (updates.feePerUnit !== undefined && pricingMode === "FEE") {
            const minP = calculateFloorPrice(updated.msp, updates.feePerUnit);
            if (updated.offeredPrice < minP) {
              updated.offeredPrice = minP;
            }
          }

          return updated;
        }
        return item;
      })
    );
  }

  // Global Calculations
  const calcSummary = useMemo(() => {
    let totalMsp = 0;
    let totalHargaJual = 0;
    let totalFee = 0;
    let totalQty = 0;

    const lineCalculations = items.map((item) => {
      const minPrice = pricingMode === "FEE" ? calculateFloorPrice(item.msp, item.feePerUnit) : item.msp;
      const subtotal = item.qty * item.offeredPrice;
      const subtotalMsp = item.qty * item.msp;
      const lineFee = pricingMode === "FEE" ? item.qty * item.feePerUnit : 0;

      totalMsp += subtotalMsp;
      totalHargaJual += subtotal;
      totalFee += lineFee;
      totalQty += item.qty;

      return {
        ...item,
        minPrice,
        subtotal,
        subtotalMsp,
      };
    });

    const pphSelisih = calculatePphSelisih(totalHargaJual, totalMsp);
    const terIncentive = calculateTERIncentive(totalHargaJual, totalMsp);

    const hasApprovalWarning = lineCalculations.some(
      (l) => l.offeredPrice < l.minPrice
    );

    return {
      lineCalculations,
      totalQty,
      totalMsp,
      totalHargaJual,
      totalFee,
      pphSelisih,
      terIncentive,
      hasApprovalWarning,
    };
  }, [items, pricingMode]);

  // Construct SPH Payload for Preview
  const sphPayload: SphPayloadInput = useMemo(() => {
    const today = new Date();
    const formattedDate = `${String(today.getDate()).padStart(2, "0")}-${String(today.getMonth() + 1).padStart(2, "0")}-${today.getFullYear()}`;
    const city = customerCity.trim() || "Bandung";

    return {
      sphNumber,
      sphDate: formattedDate,
      cityAndDate: `${city}, ${formattedDate}`,
      customerId: selectedCustomerId || null,
      customerName: customerName.trim() || "EWINDO PT",
      customerCity: city,
      picName: picName.trim() || "Bu Violentisca",
      picPosition: picPosition.trim() || "Purchasing",
      picPhone: picPhone.trim() || null,
      lampiran: "-",
      subject: "Penawaran Harga Oli Shell",
      ppnInclusive: true,
      paymentTerm,
      francoLocation: francoLocation.trim() || customerName,
      showStamp: true,
      pricingMode,
      salesName: "Bima Maulana Saputra",
      salesRole: "Distributor Sales Representative - Jawa Barat",
      salesPhone: "085315513609",
      items: calcSummary.lineCalculations.map((l) => ({
        productName: l.productName,
        description: l.description,
        pack: l.pack,
        unit: l.unit,
        msp: l.msp,
        feePerUnit: l.feePerUnit,
        minPrice: l.minPrice,
        offeredPrice: l.offeredPrice,
        qty: l.qty,
        subtotal: l.subtotal,
        subtotalMsp: l.subtotalMsp,
      })),
    };
  }, [
    sphNumber,
    selectedCustomerId,
    customerName,
    customerCity,
    picName,
    picPosition,
    picPhone,
    paymentTerm,
    francoLocation,
    pricingMode,
    calcSummary.lineCalculations,
  ]);

  async function handleSaveDeal() {
    setIsSaving(true);
    try {
      const res = await saveSphQuotationAction(sphPayload);
      if (res.success) {
        success(res.message);
      } else {
        error(res.message);
      }
    } catch {
      error("Gagal menyimpan SPH ke database.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="space-y-6 pb-20">
      {/* 1. HEADER SECTION */}
      <div className="rounded-3xl bg-neutral-950 text-white p-5 sm:p-6 border border-neutral-800 shadow-xl space-y-4">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/20 px-3 py-0.5 text-xs font-bold text-amber-300 border border-amber-500/40">
              <Sparkles className="h-3.5 w-3.5" />
              <span>PT Harapan Utama Motor Engine</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">
              Smart Price, Fee &amp; SPH Generator
            </h1>
            <p className="text-xs sm:text-sm text-neutral-400 font-medium leading-relaxed max-w-xl">
              Pencarian cepat 223+ SKU Shell, kalkulasi Floor Price otomatis, simulasi komisi/fee, dan cetak PDF SPH resmi 100% presisi template kantor.
            </p>
          </div>

          {/* SPH Reference Badge */}
          <div className="flex items-center gap-2">
            <div className="rounded-2xl bg-neutral-900 border border-neutral-700 px-3.5 py-2 text-right">
              <span className="text-[10px] font-bold text-neutral-400 uppercase block">No. Ref SPH:</span>
              <span className="text-xs font-mono font-extrabold text-amber-400">{sphNumber}</span>
            </div>
          </div>
        </div>

        {/* 2. MODE SELECTOR (FEE vs TER) */}
        <div className="pt-3 border-t border-neutral-800">
          <label className="text-xs font-bold text-neutral-300 mb-2 block">
            Pilih Skema Kompensasi Transaksi Ini:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => {
                setPricingMode("FEE");
                setItems((prev) =>
                  prev.map((it) => ({
                    ...it,
                    feePerUnit: 250000,
                    offeredPrice: calculateFloorPrice(it.msp, 250000),
                  }))
                );
              }}
              className={cn(
                "p-3 rounded-2xl border text-left transition-all active:scale-[0.98] cursor-pointer flex items-start gap-3",
                pricingMode === "FEE"
                  ? "bg-amber-500/20 border-amber-500 text-white shadow-xs"
                  : "bg-neutral-900/60 border-neutral-800 text-neutral-400 hover:border-neutral-700 hover:text-white"
              )}
            >
              <div
                className={cn(
                  "p-2 rounded-xl mt-0.5",
                  pricingMode === "FEE" ? "bg-amber-500 text-amber-950" : "bg-neutral-800 text-neutral-400" /* impeccable-disable-line gray-on-color */
                )}
              >
                <DollarSign className="h-4 w-4" />
              </div>
              <div>
                <span className="font-extrabold text-xs block text-white">Mode 1: Skema Fee Pihak Ketiga</span>
                <span className={cn("text-[11px] leading-relaxed", pricingMode === "FEE" ? "text-amber-200/90" : "text-neutral-400")}>
                  Target Fee (Maks Rp 500k/drum). Sistem otomatis markup: <code>MSP + (Fee / 52%)</code>.
                </span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => {
                setPricingMode("TER");
                setItems((prev) =>
                  prev.map((it) => ({
                    ...it,
                    feePerUnit: 0,
                    offeredPrice: it.msp,
                  }))
                );
              }}
              className={cn(
                "p-3 rounded-2xl border text-left transition-all active:scale-[0.98] cursor-pointer flex items-start gap-3",
                pricingMode === "TER"
                  ? "bg-emerald-500/20 border-emerald-500 text-white shadow-xs"
                  : "bg-neutral-900/60 border-neutral-800 text-neutral-400 hover:border-neutral-700 hover:text-white"
              )}
            >
              <div
                className={cn(
                  "p-2 rounded-xl mt-0.5",
                  pricingMode === "TER" ? "bg-emerald-500 text-emerald-950" : "bg-neutral-800 text-neutral-400" /* impeccable-disable-line gray-on-color */
                )}
              >
                <TrendingUp className="h-4 w-4" />
              </div>
              <div>
                <span className="font-extrabold text-xs block text-white">Mode 2: Skema Insentif TER DSR</span>
                <span className={cn("text-[11px] leading-relaxed", pricingMode === "TER" ? "text-emerald-200/90" : "text-neutral-400")}>
                  Tabel Golongan 1–7. Insentif dihitung dari persentase margin harga jual di atas MSP (1% s/d 3%).
                </span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* 3. CUSTOMER AUTOFILL CARD */}
      <div className="rounded-3xl border border-neutral-200 bg-white p-5 space-y-3.5 shadow-2xs">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-extrabold uppercase tracking-wider text-neutral-900 flex items-center gap-2">
            <Building2 className="h-4 w-4 text-amber-600" />
            <span>Target Customer &amp; Data SPH:</span>
          </h2>
          <span className="text-[11px] font-semibold text-neutral-500">Pilih dari CRM atau Ketik Bebas</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 text-xs">
          {/* Customer Dropdown Quickfill */}
          <div className="sm:col-span-6 space-y-1">
            <label className="text-[11px] font-bold text-neutral-700">Pilih Customer dari CRM:</label>
            <select
              value={selectedCustomerId}
              onChange={(e) => handleSelectCustomer(e.target.value)}
              className="w-full min-h-[42px] rounded-xl border border-neutral-300 bg-white px-3 py-2 text-xs font-semibold text-neutral-900 outline-none focus:border-amber-500"
            >
              <option value="">-- Ketik Manual / Pilih Akun CRM --</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.customer_name} ({c.city || "Jabar"})
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-6 space-y-1">
            <label className="text-[11px] font-bold text-neutral-700">Nama Perusahaan di SPH (TO):</label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="EWINDO PT"
              className="w-full min-h-[42px] rounded-xl border border-neutral-300 bg-white px-3 py-2 text-xs font-bold text-neutral-900 outline-none focus:border-amber-500"
            />
          </div>

          <div className="sm:col-span-4 space-y-1">
            <label className="text-[11px] font-bold text-neutral-700">Nama PIC (ATTN):</label>
            <input
              type="text"
              value={picName}
              onChange={(e) => setPicName(e.target.value)}
              placeholder="Bu Violentisca"
              className="w-full min-h-[42px] rounded-xl border border-neutral-300 bg-white px-3 py-2 text-xs font-semibold text-neutral-900 outline-none focus:border-amber-500"
            />
          </div>

          <div className="sm:col-span-4 space-y-1">
            <label className="text-[11px] font-bold text-neutral-700">Kota / Tanggal Surat:</label>
            <input
              type="text"
              value={customerCity}
              onChange={(e) => setCustomerCity(e.target.value)}
              placeholder="Bandung"
              className="w-full min-h-[42px] rounded-xl border border-neutral-300 bg-white px-3 py-2 text-xs text-neutral-900 outline-none focus:border-amber-500"
            />
          </div>

          <div className="sm:col-span-4 space-y-1">
            <label className="text-[11px] font-bold text-neutral-700">No WhatsApp PIC:</label>
            <input
              type="tel"
              value={picPhone}
              onChange={(e) => setPicPhone(e.target.value)}
              placeholder="081806381897"
              className="w-full min-h-[42px] rounded-xl border border-neutral-300 bg-white px-3 py-2 text-xs text-neutral-900 outline-none focus:border-amber-500"
            />
          </div>

          <div className="sm:col-span-6 space-y-1">
            <label className="text-[11px] font-bold text-neutral-700">Franco (Tempat Penyerahan):</label>
            <input
              type="text"
              value={francoLocation}
              onChange={(e) => setFrancoLocation(e.target.value)}
              placeholder="PT Ewindo"
              className="w-full min-h-[42px] rounded-xl border border-neutral-300 bg-white px-3 py-2 text-xs text-neutral-900 outline-none focus:border-amber-500"
            />
          </div>

          <div className="sm:col-span-6 space-y-1">
            <label className="text-[11px] font-bold text-neutral-700">Termin Pembayaran (TOP):</label>
            <select
              value={paymentTerm}
              onChange={(e) => setPaymentTerm(e.target.value)}
              className="w-full min-h-[42px] rounded-xl border border-neutral-300 bg-white px-3 py-2 text-xs font-semibold text-neutral-900 outline-none focus:border-amber-500"
            >
              <option value="30 Hari">30 Hari Kalender</option>
              <option value="14 Hari">14 Hari Kalender</option>
              <option value="45 Hari">45 Hari Kalender</option>
              <option value="60 Hari">60 Hari Kalender</option>
              <option value="CBD (Cash Before Delivery)">CBD (Cash Before Delivery)</option>
              <option value="COD (Cash on Delivery)">COD (Cash on Delivery)</option>
            </select>
          </div>
        </div>
      </div>

      {/* 4. PRODUCT LINE ITEMS TABLE */}
      <div className="rounded-3xl border border-[#EAE4D9] bg-white p-5 space-y-4 shadow-2xs">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-neutral-900 flex items-center gap-2">
              <Calculator className="h-4 w-4 text-amber-600" />
              <span>Daftar Produk Shell &amp; Kalkulasi Harga ({items.length})</span>
            </h2>
            <p className="text-[11px] text-neutral-500">
              Ketik nama produk untuk autocomplete atau input produk manual bebas.
            </p>
          </div>

          <button
            type="button"
            onClick={handleAddLine}
            className="inline-flex items-center gap-1 min-h-[38px] rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-3.5 py-1.5 text-xs font-black text-white hover:from-amber-600 hover:to-amber-700 active:scale-95 transition cursor-pointer shadow-2xs"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Tambah Item Produk</span>
          </button>
        </div>

        <div className="space-y-4">
          {calcSummary.lineCalculations.map((item, index) => {
            const isBelowFloor = item.offeredPrice < item.minPrice;

            return (
              <div
                key={item.id}
                className={cn(
                  "rounded-2xl border p-4 sm:p-5 space-y-3.5 transition shadow-xs",
                  isBelowFloor
                    ? "border-red-300 bg-red-50/40"
                    : "border-[#EAE4D9] bg-[#FDFBF7] hover:border-amber-300"
                )}
              >
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-neutral-900 text-white font-extrabold text-xs">
                      {index + 1}
                    </span>
                    <span className="text-xs font-extrabold text-neutral-900">
                      Produk #{index + 1}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemoveLine(item.id)}
                    className="text-neutral-400 hover:text-red-600 transition p-1 cursor-pointer"
                    title="Hapus baris ini"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 text-xs">
                  {/* Product Autocomplete Search Box */}
                  <div className="sm:col-span-5 space-y-1">
                    <label className="text-[11px] font-bold text-neutral-700 flex items-center justify-between">
                      <span>Nama Produk Shell:</span>
                      <span className="text-[10px] text-amber-700 font-semibold">223+ SKU</span>
                    </label>
                    <ProductSearchCombobox
                      value={item.productName}
                      onSelectProduct={(prod) => {
                        handleUpdateLine(item.id, { selectedProduct: prod });
                      }}
                      onCustomProductName={(customName) => {
                        handleUpdateLine(item.id, { productName: customName });
                      }}
                    />
                  </div>

                  {/* Deskripsi Produk */}
                  <div className="sm:col-span-3 space-y-1">
                    <label className="text-[11px] font-bold text-neutral-700">Deskripsi Produk (di SPH):</label>
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) => handleUpdateLine(item.id, { description: e.target.value })}
                      placeholder="High Performing Industrial Gear Oils"
                      className="w-full min-h-[42px] rounded-xl border border-neutral-300 bg-white px-3 py-1.5 text-xs text-neutral-800 outline-none focus:border-amber-500"
                    />
                  </div>

                  {/* Pack */}
                  <div className="sm:col-span-2 space-y-1">
                    <label className="text-[11px] font-bold text-neutral-700">Pack:</label>
                    <select
                      value={item.pack}
                      onChange={(e) => handleUpdateLine(item.id, { pack: e.target.value })}
                      className="w-full min-h-[42px] rounded-xl border border-neutral-300 bg-white px-2.5 py-1.5 text-xs font-bold text-neutral-900 outline-none focus:border-amber-500"
                    >
                      <option value="DRUM">DRUM</option>
                      <option value="PAIL">PAIL</option>
                      <option value="BULK">BULK</option>
                      <option value="GALON">GALON</option>
                      <option value="BOTOL">BOTOL</option>
                      <option value="PCS">PCS</option>
                    </select>
                  </div>

                  {/* Unit */}
                  <div className="sm:col-span-2 space-y-1">
                    <label className="text-[11px] font-bold text-neutral-700">Unit:</label>
                    <input
                      type="text"
                      value={item.unit}
                      onChange={(e) => handleUpdateLine(item.id, { unit: e.target.value })}
                      placeholder="209 L"
                      className="w-full min-h-[42px] rounded-xl border border-neutral-300 bg-white px-2.5 py-1.5 text-xs font-bold text-neutral-900 text-center outline-none focus:border-amber-500"
                    />
                  </div>

                  {/* Harga Dasar MSP */}
                  <div className="sm:col-span-4 space-y-1">
                    <label className="text-[11px] font-bold text-neutral-700 flex items-center justify-between">
                      <span>MSP Dasar PT HUM:</span>
                      <span className="text-[10px] text-neutral-500">Bisa Diedit</span>
                    </label>
                    <input
                      type="number"
                      value={item.msp}
                      onChange={(e) =>
                        handleUpdateLine(item.id, {
                          msp: parseFloat(e.target.value) || 0,
                          isCustomMsp: true,
                        })
                      }
                      className="w-full min-h-[42px] rounded-xl border border-neutral-300 bg-white px-3 py-1.5 text-xs font-mono font-bold text-neutral-900 text-right outline-none focus:border-amber-500"
                    />
                  </div>

                  {/* Mode A: Fee Input with Quick Presets */}
                  {pricingMode === "FEE" ? (
                    <div className="sm:col-span-4 space-y-1">
                      <label className="text-[11px] font-bold text-amber-800 flex items-center justify-between">
                        <span>Target Fee / Unit (Maks 500k):</span>
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="500000"
                        step="10000"
                        value={item.feePerUnit}
                        onChange={(e) =>
                          handleUpdateLine(item.id, {
                            feePerUnit: parseFloat(e.target.value) || 0,
                          })
                        }
                        className="w-full min-h-[42px] rounded-xl border border-amber-300 bg-amber-50/60 px-3 py-1.5 text-xs font-mono font-bold text-amber-950 text-right outline-none focus:border-amber-500"
                      />
                      {/* Quick Fee Presets */}
                      <div className="flex gap-1 pt-1">
                        {[100000, 250000, 500000].map((preset) => (
                          <button
                            key={preset}
                            type="button"
                            onClick={() => handleUpdateLine(item.id, { feePerUnit: preset })}
                            className={cn(
                              "text-[9.5px] px-1.5 py-0.5 rounded-md font-bold transition cursor-pointer",
                              item.feePerUnit === preset
                                ? "bg-amber-500 text-white"
                                : "bg-neutral-200 text-neutral-700 hover:bg-neutral-300"
                            )}
                          >
                            +{preset / 1000}k
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="sm:col-span-4 space-y-1">
                      <label className="text-[11px] font-bold text-emerald-800">
                        Margin Preset (Tabel TER):
                      </label>
                      <div className="grid grid-cols-4 gap-1 min-h-[42px] items-center">
                        {[
                          { label: "Gol 4", rate: 0.01 },
                          { label: "Gol 5", rate: 0.04 },
                          { label: "Gol 6", rate: 0.08 },
                          { label: "Gol 7", rate: 0.12 },
                        ].map((g) => (
                          <button
                            key={g.label}
                            type="button"
                            onClick={() =>
                              handleUpdateLine(item.id, {
                                offeredPrice: Math.round(item.msp * (1 + g.rate)),
                              })
                            }
                            className="text-[10px] py-1.5 px-1 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-900 font-extrabold transition cursor-pointer text-center"
                          >
                            {g.label} (+{g.rate * 100}%)
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Harga Jual MIN (Floor Price) */}
                  <div className="sm:col-span-4 space-y-1">
                    <label className="text-[11px] font-bold text-neutral-700 flex items-center justify-between">
                      <span>Harga Jual MIN. (Floor):</span>
                      {isBelowFloor && (
                        <button
                          type="button"
                          onClick={() => handleUpdateLine(item.id, { offeredPrice: item.minPrice })}
                          className="text-[10px] text-amber-700 font-extrabold hover:underline cursor-pointer"
                        >
                          Set ke Min ➔
                        </button>
                      )}
                    </label>
                    <input
                      type="text"
                      readOnly
                      value={formatCurrency(item.minPrice)}
                      className="w-full min-h-[42px] rounded-xl border border-neutral-200 bg-neutral-100 px-3 py-1.5 text-xs font-mono font-bold text-neutral-800 text-right"
                    />
                  </div>

                  {/* Quantity */}
                  <div className="sm:col-span-3 space-y-1">
                    <label className="text-[11px] font-bold text-neutral-700">Qty (Unit):</label>
                    <input
                      type="number"
                      min="1"
                      value={item.qty}
                      onChange={(e) =>
                        handleUpdateLine(item.id, {
                          qty: Math.max(1, parseInt(e.target.value, 10) || 1),
                        })
                      }
                      className="w-full min-h-[42px] rounded-xl border border-neutral-300 bg-white px-3 py-1.5 text-xs font-bold text-neutral-900 text-center outline-none focus:border-amber-500"
                    />
                  </div>

                  {/* Harga Jual Ditawarkan */}
                  <div className="sm:col-span-9 space-y-1">
                    <label className="text-[11px] font-bold text-neutral-900 flex items-center justify-between">
                      <span>Price/Unit Ditawarkan ke Customer:</span>
                      <span className="text-[10px] font-mono text-neutral-500">
                        Subtotal: {formatCurrency(item.subtotal)}
                      </span>
                    </label>
                    <input
                      type="number"
                      value={item.offeredPrice}
                      onChange={(e) =>
                        handleUpdateLine(item.id, {
                          offeredPrice: parseFloat(e.target.value) || 0,
                        })
                      }
                      className={cn(
                        "w-full min-h-[42px] rounded-xl border px-3.5 py-1.5 text-sm font-mono font-black text-right outline-none transition",
                        isBelowFloor
                          ? "border-red-500 bg-red-100/70 text-red-950 focus:ring-2 focus:ring-red-500/20"
                          : "border-emerald-500 bg-emerald-50/50 text-emerald-950 focus:ring-2 focus:ring-emerald-500/20"
                      )}
                    />
                  </div>
                </div>

                {/* Line Status Bar */}
                <div className="flex items-center justify-between pt-2 border-t border-neutral-200 text-xs flex-wrap gap-2">
                  <div>
                    {isBelowFloor ? (
                      <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-red-700 bg-red-100 px-2.5 py-1 rounded-lg border border-red-300">
                        <AlertTriangle className="h-3.5 w-3.5" />
                        <span>Di bawah Harga Jual MIN (Perlu Approval DSM/GM)</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-lg border border-emerald-300">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        <span>Harga Aman &amp; Valid PT HUM</span>
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-neutral-500 font-semibold">Subtotal Item:</span>
                    <span className="text-sm font-mono font-black text-neutral-900">
                      {formatCurrency(item.subtotal)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. LIVE FINANCIAL & INCENTIVE SUMMARY DASHBOARD */}
      <div className="rounded-3xl border border-amber-300 bg-gradient-to-br from-amber-500/15 via-amber-50/60 to-white p-5 sm:p-6 space-y-4 shadow-sm">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-neutral-900 flex items-center gap-1.5">
              <TrendingUp className="h-4 w-4 text-emerald-700" />
              <span>Ringkasan Finansial &amp; Bagi Hasil Penjualan</span>
            </h3>
            <p className="text-[11px] text-neutral-600">
              Kompensasi yang akan diterima DSR untuk penawaran ini.
            </p>
          </div>

          {pricingMode === "TER" && (
            <div
              className={cn(
                "px-3 py-1 rounded-xl text-xs font-black border flex items-center gap-1.5 shadow-2xs",
                calcSummary.terIncentive.statusColor === "emerald"
                  ? "bg-emerald-600 text-white border-emerald-700"
                  : calcSummary.terIncentive.statusColor === "amber"
                  ? "bg-amber-500 text-white border-amber-600"
                  : "bg-red-600 text-white border-red-700"
              )}
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>{calcSummary.terIncentive.label} ({calcSummary.terIncentive.rateLabel})</span>
            </div>
          )}
        </div>

        {/* 4-Stat Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="rounded-2xl bg-white p-3.5 border border-neutral-200 text-center space-y-1 shadow-2xs">
            <span className="text-[10px] font-bold text-neutral-500 uppercase block">Total Volume</span>
            <p className="text-lg font-black text-neutral-900 font-mono">
              {calcSummary.totalQty} <span className="text-xs font-normal text-neutral-500">Unit</span>
            </p>
            <span className="text-[10px] text-neutral-500 block">Kemasan Penawaran</span>
          </div>

          <div className="rounded-2xl bg-white p-3.5 border border-neutral-200 text-center space-y-1 shadow-2xs">
            <span className="text-[10px] font-bold text-neutral-500 uppercase block">Total SPH (Exc. PPN)</span>
            <p className="text-sm sm:text-base font-black text-neutral-900 font-mono truncate">
              {formatCurrency(calcSummary.totalHargaJual)}
            </p>
            <span className="text-[10px] text-neutral-500 block">Dasar Penawaran</span>
          </div>

          {/* Mode A: Total Fee vs Mode B: Total Insentif */}
          {pricingMode === "FEE" ? (
            <div className="rounded-2xl bg-white p-3.5 border border-amber-300 text-center space-y-1 shadow-2xs">
              <span className="text-[10px] font-bold text-amber-800 uppercase block">Total Fee DSR</span>
              <p className="text-base sm:text-lg font-black text-amber-700 font-mono">
                {formatCurrency(calcSummary.totalFee)}
              </p>
              <span className="text-[10px] text-emerald-800 font-bold block">
                Alokasi Fee Langsung
              </span>
            </div>
          ) : (
            <div className="rounded-2xl bg-white p-3.5 border border-emerald-300 text-center space-y-1 shadow-2xs">
              <span className="text-[10px] font-bold text-emerald-800 uppercase block">Insentif DSR (TER)</span>
              <p className="text-base sm:text-lg font-black text-emerald-700 font-mono">
                {formatCurrency(calcSummary.terIncentive.incentiveAmount)}
              </p>
              <span className="text-[10px] text-emerald-800 font-bold block">
                {calcSummary.terIncentive.rateLabel}
              </span>
            </div>
          )}

          <div className="rounded-2xl bg-white p-3.5 border border-neutral-200 text-center space-y-1 shadow-2xs">
            <span className="text-[10px] font-bold text-neutral-500 uppercase block">Potongan PPh Selisih</span>
            <p className="text-sm sm:text-base font-black text-neutral-700 font-mono truncate">
              {formatCurrency(calcSummary.pphSelisih)}
            </p>
            <span className="text-[10px] text-neutral-500 block">Pajak Resmi (25%)</span>
          </div>
        </div>

        {/* Tactical Guidance Box */}
        <div className="rounded-2xl bg-white/90 p-3.5 border border-amber-200 text-xs text-neutral-800 space-y-1">
          <p className="font-extrabold text-neutral-900 flex items-center gap-1.5">
            <strong>Analisis Margin &amp; Kebijakan PT HUM:</strong>
          </p>
          <p className="text-[11px] text-neutral-700 leading-relaxed font-medium">
            {pricingMode === "FEE"
              ? `Pada Skema Fee, setiap kenaikan fee per unit Rp 250k dihitung dengan pembagi 52% (Floor Markup Rp ${formatCurrency(Math.round(250000 / 0.52))}) untuk menjaga margin laba distributor dan potongan PPh.`
              : calcSummary.terIncentive.description}
          </p>
        </div>

        {/* 6. PRIMARY ACTION BUTTONS */}
        <div className="flex items-center gap-3 pt-3 border-t border-amber-200 flex-wrap">
          <button
            type="button"
            onClick={() => setIsPreviewOpen(true)}
            className="flex-1 min-h-[48px] inline-flex items-center justify-center gap-2 rounded-2xl bg-neutral-950 px-5 py-2.5 text-xs font-extrabold text-white shadow-md hover:bg-neutral-800 active:scale-95 transition cursor-pointer"
          >
            <FileText className="h-4 w-4 text-amber-400" />
            <span>Cetak SPH Resmi (Format Surat A4)</span>
          </button>

          <button
            type="button"
            onClick={handleSaveDeal}
            disabled={isSaving}
            className="min-h-[48px] inline-flex items-center justify-center gap-2 rounded-2xl bg-amber-500 px-5 py-2.5 text-xs font-extrabold text-white hover:bg-amber-600 active:scale-95 transition cursor-pointer shadow-md disabled:opacity-50"
          >
            <Check className="h-4 w-4" />
            <span>{isSaving ? "Menyimpan..." : "Simpan Deal (Auto Pipeline & Follow-Up H+3)"}</span>
          </button>
        </div>
      </div>

      {/* SPH PREVIEW & PRINT MODAL */}
      <SphDocumentPreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        data={sphPayload}
      />
    </div>
  );
}
