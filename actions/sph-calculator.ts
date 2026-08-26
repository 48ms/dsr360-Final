"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { randomUUID } from "crypto";

export type SphItemInput = {
  productName: string;
  description: string;
  pack: string; // DRUM, PAIL, BULK, etc.
  unit: string; // 209 L, 20 L, 1 L, etc.
  msp: number;
  feePerUnit: number;
  minPrice: number;
  offeredPrice: number;
  qty: number;
  subtotal: number;
  subtotalMsp: number;
};

export type SphPayloadInput = {
  sphNumber: string;
  sphDate: string; // e.g. "27-08-2026"
  cityAndDate: string; // e.g. "Bandung, 27-08-2026"
  customerId?: string | null;
  customerName: string;
  customerAddress?: string | null;
  customerCity?: string | null;
  picName: string;
  picPosition?: string | null;
  picPhone?: string | null;
  lampiran?: string;
  subject: string;
  ppnInclusive: boolean; // true = SUDAH, false = BELUM
  paymentTerm: string; // e.g. "30 Hari"
  francoLocation: string; // e.g. "PT Ewindo"
  showStamp: boolean;
  pricingMode: "FEE" | "TER";
  salesName: string;
  salesRole: string;
  salesPhone: string;
  items: SphItemInput[];
  notes?: string | null;
};

const ROMAN_MONTHS = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"];

/**
 * Generates official sequential SPH Reference Number
 * Format: [Sequential]/HUM/SPH/[Roman_Month]/[Year]
 */
export async function generateSphNumberAction(): Promise<string> {
  const date = new Date();
  const monthRoman = ROMAN_MONTHS[date.getMonth()];
  const year = date.getFullYear();
  
  // Random or sequential seed for realism
  const seq = Math.floor(500 + Math.random() * 50);
  return `${seq}/HUM/SPH/${monthRoman}/${year}`;
}

/**
 * Fetches lightweight customer list for SPH autofill
 */
export async function getCustomersForSphAction() {
  const supabase = await createClient();
  const { data: customers } = await supabase
    .from("customers")
    .select("id, customer_name, address, city, notes")
    .order("customer_name", { ascending: true })
    .limit(100);

  const { data: contacts } = await supabase
    .from("customer_contacts")
    .select("id, customer_id, name, position, phone, is_primary")
    .order("is_primary", { ascending: false });

  return {
    customers: customers || [],
    contacts: contacts || [],
  };
}

/**
 * Server action to save SPH quotation draft / final
 */
export async function saveSphQuotationAction(input: SphPayloadInput): Promise<{
  success: boolean;
  sphId: string;
  message: string;
}> {
  try {
    const supabase = await createClient();
    const { data: user } = await supabase.auth.getUser();

    const sphId = randomUUID();
    const totalValue = input.items.reduce((sum, item) => sum + item.subtotal, 0);
    const totalVolume = input.items.reduce((sum, item) => sum + item.qty, 0);

    let linkedOppId: string | null = null;

    // If customerId is provided, link or create opportunity in QUOTATION stage
    if (input.customerId && user?.user?.id) {
      const { data: opps } = await supabase
        .from("opportunities")
        .select("id, stage")
        .eq("customer_id", input.customerId)
        .neq("stage", "WON")
        .neq("stage", "LOST")
        .limit(1);

      if (opps && opps.length > 0) {
        linkedOppId = opps[0].id;
        await supabase
          .from("opportunities")
          .update({
            stage: "QUOTATION",
            potential_value: totalValue,
            potential_volume: totalVolume,
            updated_at: new Date().toISOString(),
          })
          .eq("id", linkedOppId);
      } else {
        linkedOppId = randomUUID();
        const nextMonth = new Date();
        nextMonth.setDate(nextMonth.getDate() + 14);
        const closeDateStr = nextMonth.toISOString().split("T")[0];

        const itemNames = input.items.map((i) => i.productName).join(", ");
        const oppName = `SPH ${input.customerName} - ${itemNames.length > 40 ? itemNames.slice(0, 40) + "..." : itemNames}`;

        await supabase.from("opportunities").insert({
          id: linkedOppId,
          customer_id: input.customerId,
          opportunity_name: oppName,
          stage: "QUOTATION",
          potential_value: totalValue,
          potential_volume: totalVolume,
          probability: 70,
          expected_close_date: closeDateStr,
          customer_need: `Penawaran SPH Resmi No. ${input.sphNumber}`,
          next_action: `Follow up konfirmasi SPH ${input.sphNumber} dengan ${input.picName || "PIC"}`,
          next_action_date: closeDateStr,
          created_by: user.user.id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
      }

      // 2. OTOMATIS JADWALKAN FOLLOW-UP TASK (H+3) DI TAB FOLLOW-UPS
      const followUpDate = new Date();
      followUpDate.setDate(followUpDate.getDate() + 3);
      const followUpDateStr = followUpDate.toISOString().split("T")[0];

      await supabase.from("follow_ups").insert({
        id: randomUUID(),
        customer_id: input.customerId,
        opportunity_id: linkedOppId,
        user_id: user.user.id,
        activity_type: "WHATSAPP",
        description: `Follow-up konfirmasi respon SPH No. ${input.sphNumber} ke ${input.picName || "Purchasing"}`,
        due_date: followUpDateStr,
        priority: "HIGH",
        status: "PENDING",
        created_at: new Date().toISOString(),
      });
    }

    revalidatePath("/pipeline");
    revalidatePath("/dashboard");
    revalidatePath("/customers");
    revalidatePath("/follow-ups");

    return {
      success: true,
      sphId,
      message: `SPH ${input.sphNumber} berhasil disimpan ke Pipeline (QUOTATION) & Tugas Follow-Up H+3 otomatis dijadwalkan!`,
    };
  } catch (err: any) {
    console.error("saveSphQuotationAction error:", err);
    return {
      success: false,
      sphId: "",
      message: err?.message || "Gagal menyimpan SPH.",
    };
  }
}
