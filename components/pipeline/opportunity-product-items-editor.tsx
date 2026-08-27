"use client";

import { useMemo } from "react";
import { Plus, Trash2, Calculator } from "lucide-react";
import { formatCurrency, formatVolume } from "@/lib/utils/format";
import {
  ProductCombobox,
  type MasterProductOption,
  parseProductDetails,
} from "@/components/pipeline/product-combobox";
import { type OpportunityProductItem } from "@/lib/utils/opportunity-items";

function extractUnitPrice(prodName: string): number {
  const match = prodName.match(/Rp\s*([\d\.]+)/i);
  if (match && match[1]) {
    const numStr = match[1].replace(/\./g, "");
    return parseInt(numStr, 10) || 0;
  }
  return 0;
}

export function OpportunityProductItemsEditor({
  items,
  onChange,
  masterProducts,
}: {
  items: OpportunityProductItem[];
  onChange: (newItems: OpportunityProductItem[]) => void;
  masterProducts: MasterProductOption[];
}) {
  function handleItemProductChange(itemId: string, newProductId: string) {
    const prod = masterProducts.find((p) => p.id === newProductId);
    const unitPrice = prod ? extractUnitPrice(prod.product_name) : 0;
    const parsed = prod ? parseProductDetails(prod.brand, prod.product_name) : null;

    const defaultUnit: "DRUM" | "PAIL" | "LITER" =
      parsed?.packaging === "PAIL" ? "PAIL" : "DRUM";

    const updated = items.map((it) => {
      if (it.id !== itemId) return it;
      const qtyNum = parseFloat(it.qty) || 1;
      return {
        ...it,
        productId: newProductId,
        unit: defaultUnit,
        unitPrice,
        subtotal: qtyNum * unitPrice,
      };
    });
    onChange(updated);
  }

  function handleItemQtyChange(itemId: string, newQty: string) {
    const qtyNum = parseFloat(newQty) || 0;
    const updated = items.map((it) => {
      if (it.id !== itemId) return it;
      return {
        ...it,
        qty: newQty,
        subtotal: qtyNum * (it.unitPrice || 0),
      };
    });
    onChange(updated);
  }

  function handleItemUnitChange(itemId: string, newUnit: "DRUM" | "PAIL" | "LITER") {
    const updated = items.map((it) => {
      if (it.id !== itemId) return it;
      return {
        ...it,
        unit: newUnit,
      };
    });
    onChange(updated);
  }

  function handleAddItem() {
    const newItem: OpportunityProductItem = {
      id: `item-${items.length + 1}`,
      productId: "",
      qty: "1",
      unit: "DRUM",
      unitPrice: 0,
      subtotal: 0,
    };
    onChange([...items, newItem]);
  }

  function handleRemoveItem(itemId: string) {
    if (items.length <= 1) {
      // Clear instead of removing last item
      onChange([
        {
          id: "item-1",
          productId: "",
          qty: "1",
          unit: "DRUM",
          unitPrice: 0,
          subtotal: 0,
        },
      ]);
      return;
    }
    onChange(items.filter((it) => it.id !== itemId));
  }

  // Calculate totals
  const totals = useMemo(() => {
    let totalVolLiters = 0;
    let totalVal = 0;
    let validCount = 0;

    items.forEach((it) => {
      if (!it.productId) return;
      validCount++;
      const qtyNum = parseFloat(it.qty) || 0;
      if (it.unit === "DRUM") totalVolLiters += qtyNum * 209;
      else if (it.unit === "PAIL") totalVolLiters += qtyNum * 20;
      else totalVolLiters += qtyNum;

      totalVal += it.subtotal || (qtyNum * (it.unitPrice || 0));
    });

    return { totalVolLiters, totalVal, validCount };
  }, [items]);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold uppercase tracking-wider text-neutral-800">
          Daftar Produk Shell Ditawarkan ({items.length})
        </label>
        <span className="text-[11px] text-neutral-500">Bisa tawarkan multi-produk dalam 1 deal</span>
      </div>

      {/* Product Items List */}
      <div className="space-y-3">
        {items.map((item, index) => {
          return (
            <div
              key={item.id}
              className="rounded-2xl border border-neutral-200 bg-neutral-50/70 p-3 sm:p-4 space-y-3 relative shadow-2xs"
            >
              {/* Item Header */}
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-neutral-700 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 text-white text-[10px] font-bold">
                    {index + 1}
                  </span>
                  <span>Produk #{index + 1}</span>
                </span>

                {items.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(item.id)}
                    className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-bold text-red-600 hover:bg-red-100/70 transition cursor-pointer"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>Hapus</span>
                  </button>
                )}
              </div>

              {/* Product Combobox */}
              <div>
                <ProductCombobox
                  products={masterProducts}
                  value={item.productId}
                  onChange={(prodId) => handleItemProductChange(item.id, prodId)}
                  placeholder="Ketik nama oli atau SKU (misal: Tellus 46, Rimula R4, Omala 220, 55004)..."
                />
              </div>

              {/* Qty, Unit, and Subtotal */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 border-t border-neutral-200/60">
                <div>
                  <label className="block text-[11px] font-semibold text-neutral-600 mb-1">
                    Volume & Kemasan:
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="0.1"
                      step="any"
                      value={item.qty}
                      onChange={(e) => handleItemQtyChange(item.id, e.target.value)}
                      placeholder="Qty"
                      className="w-20 sm:w-24 rounded-xl border border-neutral-300 bg-white px-3 py-2 text-xs font-bold text-neutral-900 text-center"
                    />
                    <select
                      value={item.unit}
                      onChange={(e) =>
                        handleItemUnitChange(item.id, e.target.value as "DRUM" | "PAIL" | "LITER")
                      }
                      className="flex-1 rounded-xl border border-neutral-300 bg-white px-2.5 py-2 text-xs font-semibold text-neutral-800 outline-none"
                    >
                      <option value="DRUM">Drum (209L)</option>
                      <option value="PAIL">Pail (20L)</option>
                      <option value="LITER">Liter</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-neutral-600 mb-1">
                    Subtotal Nilai:
                  </label>
                  <div className="flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50/70 px-3 py-2 text-xs">
                    <span className="text-[10px] text-neutral-500 font-medium truncate max-w-[120px]">
                      {item.unitPrice ? `@ ${formatCurrency(item.unitPrice)}` : "Rp 0"}
                    </span>
                    <span className="font-extrabold text-emerald-800 text-xs sm:text-sm">
                      {formatCurrency(item.subtotal)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add More Product Button */}
      <button
        type="button"
        onClick={handleAddItem}
        className="w-full rounded-2xl border-2 border-dashed border-amber-300 bg-amber-50/50 p-3 text-xs font-bold text-amber-900 hover:bg-amber-100 hover:border-amber-400 transition flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
      >
        <Plus className="h-4 w-4 text-amber-600" />
        <span>+ Tambah Produk Shell Lainnya</span>
      </button>

      {/* Summary Total Bar */}
      <div className="rounded-2xl border border-neutral-200 bg-neutral-900 text-white p-4 shadow-sm flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2 text-xs">
          <Calculator className="h-4 w-4 text-amber-400" />
          <span className="font-bold text-neutral-200">
            Total Estimasi Deal ({totals.validCount} Produk):
          </span>
        </div>

        <div className="flex items-center gap-4 text-xs font-bold">
          <div className="text-right">
            <span className="text-[10px] text-neutral-400 block font-normal">Total Volume</span>
            <span className="text-amber-300">{formatVolume(totals.totalVolLiters)}</span>
          </div>
          <div className="text-right border-l border-neutral-700 pl-4">
            <span className="text-[10px] text-neutral-400 block font-normal">Total Nilai Deal</span>
            <span className="text-emerald-400 text-sm font-extrabold">
              {formatCurrency(totals.totalVal)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
