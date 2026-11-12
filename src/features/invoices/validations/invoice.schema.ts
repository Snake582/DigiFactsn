import { z } from "zod";

export const invoiceItemSchema = z.object({
  id: z.string(),
  productId: z.string().optional(),
  description: z.string().trim().min(1, "Description requise"),
  quantity: z.number().gt(0, "Quantité > 0"),
  unitPrice: z.number().min(0, "Prix invalide"),
});

export const invoiceSchema = z
  .object({
    clientId: z.string().min(1, "Sélectionnez un client"),
    issueDate: z.string().min(1, "Date requise"),
    dueDate: z.string().min(1, "Échéance requise"),
    items: z.array(invoiceItemSchema).min(1, "Ajoutez au moins une ligne"),
    taxRate: z.number().min(0, "Entre 0 et 100").max(100, "Entre 0 et 100"),
    discount: z.number().min(0, "Entre 0 et 100").max(100, "Entre 0 et 100"),
    status: z.enum(["brouillon", "en_attente", "payee", "annulee"]),
    notes: z.string().trim(),
  })
  .refine((v) => v.dueDate >= v.issueDate, {
    message: "L'échéance doit suivre la date d'émission",
    path: ["dueDate"],
  });
