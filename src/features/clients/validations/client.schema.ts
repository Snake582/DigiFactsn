import { z } from "zod";

export const clientSchema = z.object({
  name: z.string().trim().min(2, "Le nom est obligatoire"),
  company: z.string().trim(),
  email: z.string().trim().email("Adresse email invalide").or(z.literal("")),
  phone: z.string().trim(),
  address: z.string().trim(),
  city: z.string().trim(),
  notes: z.string().trim(),
});
