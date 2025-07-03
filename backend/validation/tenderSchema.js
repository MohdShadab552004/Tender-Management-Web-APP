import { z } from "zod";

export const tenderSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(5),
  deadline: z.coerce.date(), 
  budget: z.coerce.number().min(1),
});
