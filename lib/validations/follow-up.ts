import { z } from "zod";
import {
  FOLLOW_UP_ACTIVITY_TYPES,
  FOLLOW_UP_PRIORITIES,
} from "@/constants/enums";

export const followUpSchema = z.object({
  customer_id: z.string().uuid("Customer wajib dipilih"),
  opportunity_id: z.string().uuid().nullable().optional(),
  visit_id: z.string().uuid().nullable().optional(),
  activity_type: z.enum(FOLLOW_UP_ACTIVITY_TYPES, { message: "Tipe aktivitas wajib dipilih" }),
  description: z.string().min(1, "Deskripsi follow-up wajib diisi"),
  due_date: z.string().min(1, "Tanggal deadline wajib diisi"),
  priority: z.enum(FOLLOW_UP_PRIORITIES).default("MEDIUM"),
});

export type FollowUpInput = z.infer<typeof followUpSchema>;

export const completeFollowUpSchema = z.object({
  follow_up_id: z.string().uuid(),
  result: z.string().min(1, "Hasil follow-up wajib dicatat"),
  
  // Chained Next Action (Optional)
  has_chain: z.boolean().default(false),
  chain_activity_type: z.enum(FOLLOW_UP_ACTIVITY_TYPES).optional(),
  chain_description: z.string().optional(),
  chain_due_date: z.string().optional(),
  chain_priority: z.enum(FOLLOW_UP_PRIORITIES).optional(),
});

export type CompleteFollowUpInput = z.infer<typeof completeFollowUpSchema>;
