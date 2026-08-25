import { z } from "zod";
import { SEGMENTS, CUSTOMER_STATUSES, PRIORITIES } from "@/constants/enums";

export const customerSchema = z.object({
  customer_name: z.string().min(1, "Nama customer wajib diisi"),
  customer_code: z.string().optional(), // kosong = auto-generate CUST-0001 dst
  segment: z.enum(SEGMENTS, { message: "Segment wajib dipilih" }),
  industry: z.string().optional(),

  address: z.string().optional(),
  city: z.string().optional(),
  province: z.string().optional(),
  latitude: z.number().nullable().optional(),
  longitude: z.number().nullable().optional(),

  priority: z.enum(PRIORITIES),
  status: z.enum(CUSTOMER_STATUSES),
  estimated_monthly_volume: z.number().nonnegative().nullable().optional(),
  potential_monthly_volume: z.number().nonnegative().nullable().optional(),
  payment_term_days: z.number().int().nonnegative().nullable().optional(),
  notes: z.string().optional(),
});

export type CustomerInput = z.infer<typeof customerSchema>;
