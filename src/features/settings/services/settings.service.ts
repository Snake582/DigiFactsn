import type { Company } from "@/types/company.types";
import { storage } from "@/lib/storage/storage";
import { STORAGE_KEYS } from "@/lib/storage/storage-keys";

export const DEFAULT_COMPANY: Company = {
  name: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  taxId: "",
  currency: "FCFA",
  defaultTaxRate: 18,
  invoicePrefix: "FAC",
  receiptPrefix: "REC",
  paymentTermDays: 30,
  footerNote: "Merci pour votre confiance !",
};

export const settingsService = {
  get(): Company {
    return { ...DEFAULT_COMPANY, ...storage.get<Partial<Company>>(STORAGE_KEYS.company, {}) };
  },
  save(company: Company) {
    storage.set(STORAGE_KEYS.company, company);
  },
};
