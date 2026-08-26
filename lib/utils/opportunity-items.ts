export type OpportunityProductItem = {
  id: string;
  productId: string;
  qty: string;
  unit: "DRUM" | "PAIL" | "LITER";
  unitPrice: number;
  subtotal: number;
};

export const ITEMS_DELIMITER = "\n\n<!-- DSR360_ITEMS_JSON:";
export const ITEMS_DELIMITER_END = "-->";

export function parseOpportunityItems(
  rawNeedOrNotes: string | null | undefined,
  fallbackProductId: string | null | undefined,
  fallbackVolumeLiters: number | null | undefined,
  fallbackValue: number | null | undefined,
  masterProducts: Array<{ id: string; product_name: string }> = []
): { items: OpportunityProductItem[]; cleanNotes: string } {
  const text = rawNeedOrNotes || "";
  let cleanNotes = text;
  let items: OpportunityProductItem[] = [];

  const startIndex = text.indexOf(ITEMS_DELIMITER);
  if (startIndex !== -1) {
    const endIndex = text.indexOf(ITEMS_DELIMITER_END, startIndex);
    if (endIndex !== -1) {
      const jsonStr = text.substring(startIndex + ITEMS_DELIMITER.length, endIndex).trim();
      cleanNotes = text.substring(0, startIndex).trim();
      try {
        const parsed = JSON.parse(jsonStr);
        if (Array.isArray(parsed) && parsed.length > 0) {
          items = parsed.map((item, idx) => ({
            id: item.id || `item-${idx}-${Date.now()}`,
            productId: item.productId || "",
            qty: String(item.qty || "1"),
            unit: item.unit || "DRUM",
            unitPrice: item.unitPrice || 0,
            subtotal: item.subtotal || 0,
          }));
        }
      } catch (err) {
        console.error("Failed to parse items JSON:", err);
      }
    }
  }

  // If no items were parsed from delimiter, construct from fallback product_id
  if (items.length === 0 && fallbackProductId) {
    const fallbackVol = fallbackVolumeLiters || 0;
    const isDrum = fallbackVol > 0 && fallbackVol % 209 === 0;
    const isPail = fallbackVol > 0 && !isDrum && fallbackVol % 20 === 0;
    const unit: "DRUM" | "PAIL" | "LITER" = isDrum ? "DRUM" : isPail ? "PAIL" : "DRUM";

    const qty =
      fallbackVol > 0
        ? isDrum
          ? String(Math.round(fallbackVol / 209))
          : isPail
          ? String(Math.round(fallbackVol / 20))
          : String(fallbackVol)
        : "1";

    const prod = masterProducts.find((p) => p.id === fallbackProductId);
    let unitPrice = 0;
    if (prod) {
      const match = prod.product_name.match(/Rp\s*([\d\.]+)/i);
      if (match && match[1]) {
        unitPrice = parseInt(match[1].replace(/\./g, ""), 10) || 0;
      }
    }

    const subtotal = fallbackValue || (parseFloat(qty) * unitPrice) || 0;

    items.push({
      id: `item-initial-${Date.now()}`,
      productId: fallbackProductId,
      qty,
      unit,
      unitPrice,
      subtotal,
    });
  }

  // Ensure at least 1 empty item if completely empty
  if (items.length === 0) {
    items.push({
      id: `item-new-${Date.now()}`,
      productId: "",
      qty: "1",
      unit: "DRUM",
      unitPrice: 0,
      subtotal: 0,
    });
  }

  return { items, cleanNotes };
}

export function serializeOpportunityItems(
  cleanNotes: string,
  items: OpportunityProductItem[]
): {
  serializedNotes: string;
  totalVolumeLiters: number;
  totalValue: number;
  primaryProductId: string | null;
} {
  const validItems = items.filter((it) => !!it.productId);

  let totalVolumeLiters = 0;
  let totalValue = 0;

  validItems.forEach((item) => {
    const qtyNum = parseFloat(item.qty) || 0;
    if (item.unit === "DRUM") {
      totalVolumeLiters += qtyNum * 209;
    } else if (item.unit === "PAIL") {
      totalVolumeLiters += qtyNum * 20;
    } else {
      totalVolumeLiters += qtyNum;
    }

    totalValue += item.subtotal || (qtyNum * (item.unitPrice || 0));
  });

  let serializedNotes = cleanNotes.trim();
  if (validItems.length > 0) {
    serializedNotes = `${serializedNotes}${ITEMS_DELIMITER}${JSON.stringify(validItems)}${ITEMS_DELIMITER_END}`;
  }

  const primaryProductId = validItems[0]?.productId || null;

  return {
    serializedNotes,
    totalVolumeLiters: Math.round(totalVolumeLiters),
    totalValue: Math.round(totalValue),
    primaryProductId,
  };
}
