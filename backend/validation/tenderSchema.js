import { z } from "zod";

export const tenderSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  deadline: z.coerce.date(), // converts from string to Date
  budget: z.coerce.number().min(1),
});
