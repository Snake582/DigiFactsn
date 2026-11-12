import type { Invoice, InvoiceInput, InvoiceStatus } from "@/types/invoice.types";
import { createRepository } from "@/lib/storage/storage";
import { STORAGE_KEYS } from "@/lib/storage/storage-keys";
import { nextDocumentNumber } from "@/lib/utils/generate-id";
import { settingsService } from "@/features/settings/services/settings.service";

const repo = createRepository<Invoice>(STORAGE_KEYS.invoices);

export const invoiceService = {
  ...repo,
  createWithNumber(data: Omit<InvoiceInput, "number">) {
    const { invoicePrefix } = settingsService.get();
    const year = Number(data.issueDate.slice(0, 4)) || new Date().getFullYear();
    const number = nextDocumentNumber(invoicePrefix, repo.list().map((i) => i.number), year);
    return repo.create({ ...data, number });
  },
  setStatus(id: string, status: InvoiceStatus) {
    repo.update(id, { status });
  },
};
