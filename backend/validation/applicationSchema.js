import { z } from "zod";

export const applicationSchema = z.object({
  tender_id: z.coerce.number(),
  company_id: z.coerce.number(),
  name: z.string().min(2),
  email: z.string().email(),
  bid_amount: z.coerce.number().min(0),
  proposal: z.string().min(10),
});
