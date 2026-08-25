import { z } from "zod";
import { OPPORTUNITY_STAGES } from "@/constants/enums";

export const opportunitySchema = z.object({
  customer_id: z.string().uuid("Customer wajib dipilih"),
  opportunity_name: z.string().min(1, "Nama opportunity wajib diisi"),
  product_id: z.string().uuid("Produk Shell wajib dipilih").nullable().optional(),
  stage: z.enum(OPPORTUNITY_STAGES).default("PROSPECT"),
  potential_volume: z.number().nonnegative().nullable().optional(),
  potential_value: z.number().nonnegative().nullable().optional(),
  probability: z.number().min(0).max(100).default(20),
  expected_close_date: z.string().optional(),
  competitor_id: z.string().uuid().nullable().optional(),
  customer_need: z.string().optional(),
  objection: z.string().optional(),
  next_action: z.string().optional(),
  next_action_date: z.string().optional(),
});

export type OpportunityInput = z.infer<typeof opportunitySchema>;

export const updateStageSchema = z.object({
  opportunity_id: z.string().uuid(),
  stage: z.enum(OPPORTUNITY_STAGES),
  notes: z.string().optional(),
});

export type UpdateStageInput = z.infer<typeof updateStageSchema>;
