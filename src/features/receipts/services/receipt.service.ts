import type { Receipt, ReceiptInput, PaymentMethod } from "@/types/receipt.types";
import { createRepository } from "@/lib/storage/storage";
import { STORAGE_KEYS } from "@/lib/storage/storage-keys";
import { nextDocumentNumber } from "@/lib/utils/generate-id";
import { settingsService } from "@/features/settings/services/settings.service";
import { invoiceService } from "@/features/invoices/services/invoice.service";
import { invoiceTotal } from "@/features/invoices/services/invoice-calculator.service";

const repo = createRepository<Receipt>(STORAGE_KEYS.receipts);

export const PAYMENT_METHODS: Record<PaymentMethod, string> = {
  especes: "Espèces",
  virement: "Virement bancaire",
  mobile_money: "Mobile Money (Wave, Orange Money…)",
  cheque: "Chèque",
  carte: "Carte bancaire",
};

export function paidAmount(invoiceId: string, receipts: Receipt[]) {
  return receipts.filter((r) => r.invoiceId === invoiceId).reduce((sum, r) => sum + r.amount, 0);
}

/** Met à jour le statut de la facture selon les paiements reçus. */
function syncInvoice(invoiceId: string) {
  if (!invoiceId) return;
  const invoice = invoiceService.get(invoiceId);
  if (!invoice || invoice.status === "annulee") return;
  const paid = paidAmount(invoiceId, repo.list());
  if (paid >= invoiceTotal(invoice) && invoice.status !== "payee") invoiceService.setStatus(invoiceId, "payee");
  else if (paid < invoiceTotal(invoice) && invoice.status === "payee") invoiceService.setStatus(invoiceId, "en_attente");
}

export const receiptService = {
  ...repo,
  createWithNumber(data: Omit<ReceiptInput, "number">) {
    const { receiptPrefix } = settingsService.get();
    const year = Number(data.date.slice(0, 4)) || new Date().getFullYear();
    const number = nextDocumentNumber(receiptPrefix, repo.list().map((r) => r.number), year);
    const receipt = repo.create({ ...data, number });
    syncInvoice(receipt.invoiceId);
    return receipt;
  },
  removeAndSync(id: string) {
    const receipt = repo.get(id);
    repo.remove(id);
    if (receipt) syncInvoice(receipt.invoiceId);
  },
};
