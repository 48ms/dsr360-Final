"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { Search, X, Package, Sparkles } from "lucide-react";
import {
  SHELL_PRICING_DATABASE,
  type ShellPricingItem,
} from "@/lib/constants/shell-pricing-database";
import { formatCurrency } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";

export function ProductSearchCombobox({
  value,
  onSelectProduct,
  onCustomProductName,
}: {
  value: string;
  onSelectProduct: (product: ShellPricingItem) => void;
  onCustomProductName: (name: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState(value);
  const [prevValue, setPrevValue] = useState(value);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync internal query if external value changes (React official state-from-prop pattern)
  if (value !== prevValue) {
    setPrevValue(value);
    setQuery(value);
  }

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter products based on query
  const filteredProducts = useMemo(() => {
    const q = query.trim().toUpperCase();
    if (!q) return SHELL_PRICING_DATABASE.slice(0, 30);

    const tokens = q.split(/\s+/).filter(Boolean);
    return SHELL_PRICING_DATABASE.filter((p) => {
      const target = `${p.name} ${p.category} ${p.unit} ${p.sku}`.toUpperCase();
      return tokens.every((token) => target.includes(token));
    }).slice(0, 40);
  }, [query]);

  const exactMatch = SHELL_PRICING_DATABASE.find(
    (p) => p.name.toUpperCase() === query.trim().toUpperCase()
  );

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="relative flex items-center">
        <Search className="absolute left-3 h-3.5 w-3.5 text-neutral-400 pointer-events-none" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onFocus={() => setIsOpen(true)}
          onChange={(e) => {
            const nextVal = e.target.value;
            setQuery(nextVal);
            onCustomProductName(nextVal);
            setIsOpen(true);
          }}
          placeholder="Ketik nama produk (misal: Rimula R4X, Tellus 68, Gadus)..."
          className="w-full min-h-[42px] rounded-xl border border-neutral-300 bg-white pl-9 pr-8 py-2 text-xs font-bold text-neutral-900 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
        />
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              onCustomProductName("");
              inputRef.current?.focus();
            }}
            className="absolute right-2.5 p-1 text-neutral-400 hover:text-neutral-700 cursor-pointer"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* Autocomplete Dropdown Popover */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full z-50 mt-1 max-h-72 overflow-y-auto rounded-2xl border border-neutral-200 bg-white p-1.5 shadow-xl">
          {/* Custom Product Option if query does not exact match */}
          {query.trim() && !exactMatch && (
            <button
              type="button"
              onClick={() => {
                onCustomProductName(query.trim());
                setIsOpen(false);
              }}
              className="w-full flex items-center justify-between gap-2 p-2.5 rounded-xl text-left bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 transition cursor-pointer mb-1"
            >
              <div className="flex items-center gap-2">
                <Sparkles className="h-3.5 w-3.5 text-amber-600 shrink-0" />
                <span className="text-xs font-bold truncate">
                  Gunakan Produk Manual: &quot;{query.trim()}&quot;
                </span>
              </div>
              <span className="text-[10px] bg-amber-200/80 px-2 py-0.5 rounded-md font-extrabold shrink-0">
                Custom SKU
              </span>
            </button>
          )}

          {filteredProducts.length === 0 ? (
            <div className="p-3 text-center text-xs text-neutral-500">
              Tidak ada produk yang cocok di katalog PT HUM. Anda bisa memakai nama manual di atas.
            </div>
          ) : (
            <div className="space-y-0.5">
              <div className="px-2 py-1 text-[10px] font-extrabold uppercase tracking-wider text-neutral-400">
                Katalog Resmi PT HUM ({filteredProducts.length} produk)
              </div>
              {filteredProducts.map((p, idx) => {
                const isSelected = p.name === value;

                return (
                  <button
                    key={`${p.name}-${p.unit}-${idx}`}
                    type="button"
                    onClick={() => {
                      setQuery(p.name);
                      onSelectProduct(p);
                      setIsOpen(false);
                    }}
                    className={cn(
                      "w-full flex items-center justify-between gap-2 p-2 rounded-xl text-left transition cursor-pointer text-xs",
                      isSelected
                        ? "bg-amber-500/15 text-amber-950 font-bold border border-amber-300"
                        : "hover:bg-neutral-100 text-neutral-800"
                    )}
                  >
                    <div className="flex items-start gap-2 min-w-0">
                      <Package className="h-3.5 w-3.5 text-neutral-400 mt-0.5 shrink-0" />
                      <div className="min-w-0">
                        <div className="font-extrabold text-neutral-900 truncate">
                          {p.name}
                        </div>
                        <div className="text-[10px] text-neutral-500 font-medium">
                          {p.category} &bull; Kemasan: <span className="font-bold text-neutral-700">{p.unit}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="font-mono font-extrabold text-xs text-neutral-900">
                        {formatCurrency(p.msp)}
                      </div>
                      <div className="text-[9px] text-neutral-400 uppercase font-semibold">
                        MSP Dasar
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
