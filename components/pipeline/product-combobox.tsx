"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { Search, X, Check } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export type MasterProductOption = {
  id: string;
  brand: string;
  product_name: string;
  category?: string | null;
  viscosity?: string | null;
  packaging?: string | null;
  packaging_size?: number | null;
};

export type ParsedProductInfo = {
  rawName: string;
  cleanName: string;
  sku: string | null;
  packaging: string | null;
  priceFormatted: string | null;
};

export function parseProductDetails(brand: string, rawProductName: string): ParsedProductInfo {
  if (!rawProductName) {
    return { rawName: "", cleanName: "", sku: null, packaging: null, priceFormatted: null };
  }

  let text = rawProductName.trim();

  // Extract SKU [12345]
  let sku: string | null = null;
  const skuMatch = text.match(/\[([^\]]+)\]/);
  if (skuMatch) {
    sku = skuMatch[1].trim();
    text = text.replace(skuMatch[0], "").trim();
  }

  // Extract Price - Rp 10.000.000
  let priceFormatted: string | null = null;
  const priceMatch = text.match(/-\s*(Rp[\s\d\.]+)/i);
  if (priceMatch) {
    priceFormatted = priceMatch[1].trim();
    text = text.replace(priceMatch[0], "").trim();
  }

  // Extract Packaging (DRUM) / (PAIL)
  let packaging: string | null = null;
  const packMatch = text.match(/\((DRUM|PAIL|BULK|GALON|BOTOL|PCS|LITER|BIJI)\)/i);
  if (packMatch) {
    packaging = packMatch[1].toUpperCase().trim();
    text = text.replace(packMatch[0], "").trim();
  }

  // Clean double brand
  const bUpper = (brand || "Shell").toUpperCase().trim();
  let cleanName = text.trim();
  if (cleanName.toUpperCase().startsWith(bUpper + " " + bUpper)) {
    cleanName = cleanName.substring(bUpper.length).trim();
  } else if (!cleanName.toUpperCase().startsWith(bUpper)) {
    cleanName = `${brand} ${cleanName}`;
  }

  return {
    rawName: rawProductName,
    cleanName,
    sku,
    packaging: packaging || "DRUM",
    priceFormatted,
  };
}

export function cleanProductName(brand: string, productName: string): string {
  const parsed = parseProductDetails(brand, productName);
  return `${parsed.cleanName}${parsed.sku ? ` [${parsed.sku}]` : ""} (${parsed.packaging})${parsed.priceFormatted ? ` - ${parsed.priceFormatted}` : ""}`;
}

export function ProductCombobox({
  products,
  value,
  onChange,
  placeholder = "Ketik nama oli, tipe, viskositas, atau SKU...",
  className,
}: {
  products: MasterProductOption[];
  value: string;
  onChange: (productId: string) => void;
  placeholder?: string;
  className?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const selectedProduct = useMemo(() => {
    return products.find((p) => p.id === value) || null;
  }, [products, value]);

  const selectedParsed = useMemo(() => {
    if (!selectedProduct) return null;
    return parseProductDetails(selectedProduct.brand, selectedProduct.product_name);
  }, [selectedProduct]);

  // Filtered products based on search term
  const filteredProducts = useMemo(() => {
    if (!searchTerm.trim()) {
      return products.slice(0, 50); // Show top 50 initially for snappy performance
    }
    const query = searchTerm.toLowerCase().trim();
    const words = query.split(/\s+/);

    return products.filter((p) => {
      const target = `${p.brand} ${p.product_name} ${p.category || ""} ${p.viscosity || ""} ${p.packaging || ""}`.toLowerCase();
      return words.every((w) => target.includes(w));
    });
  }, [products, searchTerm]);

  // Handle outside click to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleSelect(prod: MasterProductOption) {
    onChange(prod.id);
    setSearchTerm("");
    setIsOpen(false);
  }

  function handleClear() {
    onChange("");
    setSearchTerm("");
    setIsOpen(true);
    setTimeout(() => inputRef.current?.focus(), 50);
  }

  return (
    <div ref={containerRef} className={cn("relative w-full text-xs", className)}>
      {/* Selected Box or Search Input */}
      {!isOpen && selectedProduct && selectedParsed ? (
        <div
          onClick={() => {
            setIsOpen(true);
            setTimeout(() => inputRef.current?.focus(), 50);
          }}
          className="rounded-2xl border border-amber-300 bg-amber-50/60 p-3 shadow-2xs hover:border-amber-400 hover:bg-amber-50 cursor-pointer transition space-y-1.5"
        >
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-neutral-900 text-xs sm:text-sm">
                  {selectedParsed.cleanName}
                </span>
                <span
                  className={cn(
                    "rounded-md px-2 py-0.5 text-[10px] font-extrabold uppercase",
                    selectedParsed.packaging === "DRUM"
                      ? "bg-amber-200 text-amber-900"
                      : "bg-blue-200 text-blue-900"
                  )}
                >
                  {selectedParsed.packaging} {selectedParsed.packaging === "DRUM" ? "209L" : "20L"}
                </span>
                {selectedParsed.priceFormatted && (
                  <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-[11px] font-extrabold text-emerald-800">
                    {selectedParsed.priceFormatted}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 mt-1 flex-wrap text-[11px] text-neutral-600">
                {selectedParsed.sku && (
                  <span className="bg-neutral-200/80 font-mono font-bold text-neutral-800 px-1.5 py-0.5 rounded text-[10px]">
                    SKU: {selectedParsed.sku}
                  </span>
                )}
                {selectedProduct.category && (
                  <span className="text-neutral-500 font-medium">
                    {selectedProduct.category}
                  </span>
                )}
                {selectedProduct.viscosity && (
                  <span className="text-neutral-500">
                    &bull; Viskositas: <strong>{selectedProduct.viscosity}</strong>
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0 pt-0.5">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleClear();
                }}
                title="Ganti Produk"
                className="rounded-lg bg-white border border-neutral-200 px-2 py-1 text-[11px] font-bold text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900 transition flex items-center gap-1 shadow-2xs"
              >
                <span>Ganti</span>
                <X className="h-3 w-3" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative">
          <div className="flex items-center rounded-2xl border-2 border-amber-400 bg-white px-3.5 py-2.5 shadow-sm focus-within:ring-2 focus-within:ring-amber-200 transition">
            <Search className="h-4 w-4 text-amber-600 shrink-0 mr-2" />
            <input
              ref={inputRef}
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setIsOpen(true);
              }}
              onFocus={() => setIsOpen(true)}
              placeholder={placeholder}
              className="w-full bg-transparent text-xs sm:text-sm text-neutral-900 font-medium outline-none placeholder:text-neutral-400"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                className="rounded-full p-1 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Autocomplete Dropdown List */}
      {isOpen && (
        <div className="absolute left-0 top-full z-50 mt-1.5 w-full rounded-2xl border border-neutral-200 bg-white shadow-2xl overflow-hidden animate-fade-in-up">
          {/* Top Search Filter Header */}
          <div className="flex items-center justify-between bg-neutral-900 text-white px-4 py-2 text-[11px]">
            <span className="font-semibold">
              {searchTerm
                ? `Hasil pencarian (${filteredProducts.length} produk)`
                : `Pilih Cepat (${filteredProducts.length} dari ${products.length} produk Shell)`}
            </span>
            <span className="text-[10px] text-amber-300">Ketik untuk menyaring SKU/Tipe</span>
          </div>

          {/* Product Items List */}
          <div className="max-h-64 overflow-y-auto divide-y divide-neutral-100">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((prod) => {
                const isSelected = prod.id === value;
                const parsed = parseProductDetails(prod.brand, prod.product_name);

                return (
                  <button
                    key={prod.id}
                    type="button"
                    onClick={() => handleSelect(prod)}
                    className={cn(
                      "w-full text-left px-4 py-3 transition flex items-center justify-between gap-3 hover:bg-amber-50/80 cursor-pointer",
                      isSelected ? "bg-amber-100/70 font-semibold" : ""
                    )}
                  >
                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-neutral-900 text-xs sm:text-sm">
                          {parsed.cleanName}
                        </span>
                        <span
                          className={cn(
                            "rounded px-1.5 py-0.5 text-[10px] font-extrabold uppercase",
                            parsed.packaging === "DRUM"
                              ? "bg-amber-100 text-amber-900 border border-amber-300"
                              : "bg-blue-100 text-blue-900 border border-blue-300"
                          )}
                        >
                          {parsed.packaging}
                        </span>
                        {parsed.priceFormatted && (
                          <span className="font-extrabold text-emerald-700 text-xs">
                            {parsed.priceFormatted}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-[11px] text-neutral-500 flex-wrap">
                        {parsed.sku && (
                          <span className="bg-neutral-100 font-mono font-bold text-neutral-700 px-1.5 py-0.5 rounded text-[10px]">
                            SKU: {parsed.sku}
                          </span>
                        )}
                        {prod.category && (
                          <span className="font-medium text-neutral-600">
                            {prod.category}
                          </span>
                        )}
                        {prod.viscosity && (
                          <span>&bull; Visk: {prod.viscosity}</span>
                        )}
                      </div>
                    </div>

                    {isSelected && (
                      <Check className="h-5 w-5 text-emerald-600 shrink-0" />
                    )}
                  </button>
                );
              })
            ) : (
              <div className="p-5 text-center text-xs text-neutral-500 space-y-1">
                <p className="font-semibold text-neutral-800">Produk &ldquo;{searchTerm}&rdquo; tidak ditemukan</p>
                <p className="text-[11px] text-neutral-400">
                  Coba ketik kata kunci lain (misal: <code>Tellus 46</code>, <code>Rimula R4</code>, <code>Omala 220</code>, atau <code>Gadus</code>)
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
