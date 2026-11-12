import type { BaseEntity } from "./common.types";

export type PaymentMethod = "especes" | "virement" | "mobile_money" | "cheque" | "carte";

export interface Receipt extends BaseEntity {
  number: string;
  clientId: string;
  invoiceId: string; // "" si le reçu n'est lié à aucune facture
  date: string; // YYYY-MM-DD
  amount: number;
  method: PaymentMethod;
  reference: string;
  notes: string;
}

export type ReceiptInput = Omit<Receipt, keyof BaseEntity>;
