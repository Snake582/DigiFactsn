import type { BaseEntity } from "./common.types";

/** Statuts enregistrés. "en_retard" est calculé à l'affichage (échéance dépassée). */
export type InvoiceStatus = "brouillon" | "en_attente" | "payee" | "annulee";
export type DisplayStatus = InvoiceStatus | "en_retard";

export interface InvoiceItem {
  id: string;
  productId?: string;
  description: string;
  quantity: number;
  unitPrice: number;
}

export interface Invoice extends BaseEntity {
  number: string;
  clientId: string;
  issueDate: string; // YYYY-MM-DD
  dueDate: string; // YYYY-MM-DD
  items: InvoiceItem[];
  taxRate: number; // %
  discount: number; // %
  status: InvoiceStatus;
  notes: string;
}

export type InvoiceInput = Omit<Invoice, keyof BaseEntity>;

export interface InvoiceTotals {
  subtotal: number;
  discountAmount: number;
  taxableAmount: number;
  taxAmount: number;
  total: number;
}
