import type { DisplayStatus, Invoice, InvoiceItem, InvoiceTotals } from "@/types/invoice.types";
import { todayISO } from "@/lib/utils/format-date";

const round = (n: number) => Math.round(n * 100) / 100;

export function computeTotals(
  items: Pick<InvoiceItem, "quantity" | "unitPrice">[],
  taxRate: number,
  discount: number,
): InvoiceTotals {
  const subtotal = round(items.reduce((sum, i) => sum + i.quantity * i.unitPrice, 0));
  const discountAmount = round((subtotal * discount) / 100);
  const taxableAmount = round(subtotal - discountAmount);
  const taxAmount = round((taxableAmount * taxRate) / 100);
  return { subtotal, discountAmount, taxableAmount, taxAmount, total: round(taxableAmount + taxAmount) };
}

export function invoiceTotal(invoice: Pick<Invoice, "items" | "taxRate" | "discount">) {
  return computeTotals(invoice.items, invoice.taxRate, invoice.discount).total;
}

/** Une facture « en attente » dont l'échéance est dépassée devient « en retard ». */
export function getDisplayStatus(invoice: Pick<Invoice, "status" | "dueDate">): DisplayStatus {
  if (invoice.status === "en_attente" && invoice.dueDate < todayISO()) return "en_retard";
  return invoice.status;
}
