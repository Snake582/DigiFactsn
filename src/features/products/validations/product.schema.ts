import { z } from "zod";

export const productSchema = z.object({
  name: z.string().trim().min(2, "Le nom est obligatoire"),
  description: z.string().trim(),
  price: z.number().min(0, "Le prix doit être un nombre positif"),
  unit: z.string().trim().min(1, "L'unité est obligatoire"),
  type: z.enum(["produit", "service"]),
});
