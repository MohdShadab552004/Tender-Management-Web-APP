import { z } from "zod";

export const companySchema = z.object({
  name: z.string().min(2),
  industry: z.string().min(2),
  description: z.string(),
  logo_url: z.string().url().optional(),
});
