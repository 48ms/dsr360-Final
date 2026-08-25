import { z } from "zod";
import {
  CONTACT_TYPES,
  INFLUENCE_LEVELS,
  DECISION_POWERS,
  PRODUCT_STATUSES,
} from "@/constants/enums";

export const contactSchema = z.object({
  name: z.string().min(1, "Nama PIC wajib diisi"),
  position: z.string().optional(),
  department: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email("Format email tidak valid").optional().or(z.literal("")),
  contact_type: z.enum(CONTACT_TYPES),
  influence_level: z.enum(INFLUENCE_LEVELS),
  decision_power: z.enum(DECISION_POWERS),
  is_primary: z.boolean(),
  notes: z.string().optional(),
});
export type ContactInput = z.infer<typeof contactSchema>;

export const equipmentSchema = z.object({
  equipment_type: z.string().min(1, "Tipe equipment wajib diisi"),
  brand: z.string().optional(),
  model: z.string().optional(),
  quantity: z.number().int().positive().nullable().optional(),
  application: z.string().optional(),
  operating_condition: z.string().optional(),
  current_brand: z.string().optional(),
  current_product: z.string().optional(),
  current_viscosity: z.string().optional(),
  oil_capacity: z.number().positive().nullable().optional(),
  drain_interval: z.string().optional(),
  notes: z.string().optional(),
});
export type EquipmentInput = z.infer<typeof equipmentSchema>;

export const customerProductSchema = z.object({
  product_name: z.string().min(1, "Nama produk wajib diisi"),
  brand: z.string().min(1, "Brand wajib diisi"),
  category: z.string().optional(),
  viscosity: z.string().optional(),
  usage_application: z.string().optional(),
  monthly_volume: z.number().nonnegative().nullable().optional(),
  status: z.enum(PRODUCT_STATUSES),
  notes: z.string().optional(),
});
export type CustomerProductInput = z.infer<typeof customerProductSchema>;
