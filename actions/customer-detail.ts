"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import {
  contactSchema,
  equipmentSchema,
  customerProductSchema,
  type ContactInput,
  type EquipmentInput,
  type CustomerProductInput,
} from "@/lib/validations/customer-detail";

export async function addContact(customerId: string, input: ContactInput) {
  const parsed = contactSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Input tidak valid" };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("customer_contacts")
    .insert({ ...parsed.data, customer_id: customerId, email: parsed.data.email || null });

  if (error) {
    console.error("addContact error:", error.message);
    return { error: "Gagal menyimpan PIC. Coba lagi." };
  }

  revalidatePath(`/customers/${customerId}`);
  return { success: true };
}

export async function addEquipment(customerId: string, input: EquipmentInput) {
  const parsed = equipmentSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Input tidak valid" };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("customer_equipment")
    .insert({ ...parsed.data, customer_id: customerId });

  if (error) {
    console.error("addEquipment error:", error.message);
    return { error: "Gagal menyimpan equipment. Coba lagi." };
  }

  revalidatePath(`/customers/${customerId}`);
  return { success: true };
}

export async function addCustomerProduct(customerId: string, input: CustomerProductInput) {
  const parsed = customerProductSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Input tidak valid" };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("customer_products")
    .insert({ ...parsed.data, customer_id: customerId });

  if (error) {
    console.error("addCustomerProduct error:", error.message);
    return { error: "Gagal menyimpan produk. Coba lagi." };
  }

  revalidatePath(`/customers/${customerId}`);
  return { success: true };
}
