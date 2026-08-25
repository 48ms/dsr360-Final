import { z } from "zod";
import {
  VISIT_TYPES,
  CUSTOMER_RESPONSES,
  PHOTO_TYPES,
  OPPORTUNITY_STAGES,
  FOLLOW_UP_ACTIVITY_TYPES,
  FOLLOW_UP_PRIORITIES,
} from "@/constants/enums";

export const planVisitSchema = z.object({
  customer_id: z.string().uuid("Customer wajib dipilih"),
  visit_date: z.string().min(1, "Tanggal visit wajib diisi"),
  visit_type: z.enum(VISIT_TYPES, { message: "Tipe visit wajib dipilih" }),
  purpose: z.string().optional(),
  objective: z.string().optional(),

  // POPSA fields
  popsa_purpose: z.string().optional(),
  popsa_objective: z.string().optional(),
  popsa_premises: z.string().optional(),
  popsa_strategy: z.string().optional(),
  popsa_anticipate: z.string().optional(),
});

export type PlanVisitInput = z.infer<typeof planVisitSchema>;

export const startVisitSchema = z.object({
  visit_id: z.string().uuid(),
  latitude: z.number().nullable().optional(),
  longitude: z.number().nullable().optional(),
  start_time: z.string().optional(),
});

export type StartVisitInput = z.infer<typeof startVisitSchema>;

export const visitPhotoSchema = z.object({
  photo_url: z.string().min(1, "URL foto wajib ada"),
  photo_type: z.enum(PHOTO_TYPES),
  caption: z.string().optional(),
});

export const visitLogSchema = z.object({
  visit_id: z.string().uuid(),
  customer_response: z.enum(CUSTOMER_RESPONSES, { message: "Respon customer wajib dipilih" }),
  discussion: z.string().min(1, "Hasil diskusi / catatan visit wajib diisi"),
  customer_condition: z.string().optional(),
  competitor_id: z.string().nullable().optional(),
  technical_issue: z.string().optional(),

  // Opportunity section
  opportunity_found: z.boolean().default(false),
  opportunity_name: z.string().optional(),
  product_id: z.string().nullable().optional(),
  potential_volume: z.number().nonnegative().nullable().optional(),
  potential_value: z.number().nonnegative().nullable().optional(),
  opportunity_stage: z.enum(OPPORTUNITY_STAGES).optional(),

  // Next action (Mandatory gate for active visits)
  has_next_action: z.boolean().default(true),
  next_action_type: z.enum(FOLLOW_UP_ACTIVITY_TYPES, { message: "Tipe follow-up wajib dipilih" }),
  next_action_description: z.string().min(1, "Aktivitas follow-up berikutnya wajib diisi"),
  next_action_due_date: z.string().min(1, "Target tanggal follow-up wajib diisi"),
  next_action_priority: z.enum(FOLLOW_UP_PRIORITIES).default("MEDIUM"),

  // Photos
  photos: z.array(visitPhotoSchema).optional(),

  // Time metrics
  end_time: z.string().optional(),
  duration_minutes: z.number().int().nonnegative().nullable().optional(),
});

export type VisitLogInput = z.infer<typeof visitLogSchema>;

export const quickVisitSchema = z.object({
  customer_id: z.string().uuid("Customer wajib dipilih"),
  visit_type: z.enum(VISIT_TYPES).default("ROUTINE"),
  purpose: z.string().optional(),
  customer_response: z.enum(CUSTOMER_RESPONSES).default("INTERESTED"),
  discussion: z.string().min(1, "Catatan diskusi wajib diisi"),

  // Quick opportunity
  opportunity_found: z.boolean().default(false),
  product_id: z.string().nullable().optional(),
  potential_volume: z.number().nonnegative().nullable().optional(),
  potential_value: z.number().nonnegative().nullable().optional(),

  // Mandatory Next Action
  next_action_type: z.enum(FOLLOW_UP_ACTIVITY_TYPES).default("WHATSAPP"),
  next_action_description: z.string().min(1, "Aksi selanjutnya wajib diisi"),
  next_action_due_date: z.string().min(1, "Tanggal follow-up wajib diisi"),
  next_action_priority: z.enum(FOLLOW_UP_PRIORITIES).default("HIGH"),
});

export type QuickVisitInput = z.infer<typeof quickVisitSchema>;
