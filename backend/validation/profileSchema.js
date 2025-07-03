import { z } from "zod";

export const updateProfileSchema = z.object({
  email: z.string().email(),
  company: z.object({
    name: z.string().min(2),
    industry: z.string().min(2),
    description: z.string().min(5),
    logo_url: z.string().url().optional(),
  }),
});
