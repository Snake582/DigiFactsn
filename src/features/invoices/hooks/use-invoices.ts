"use client";

import { useLocalStorage } from "@/hooks/use-local-storage";
import { STORAGE_KEYS } from "@/lib/storage/storage-keys";
import type { Invoice } from "@/types/invoice.types";
import { invoiceService } from "../services/invoice.service";

export function useInvoices() {
  const [invoices, , ready] = useLocalStorage<Invoice[]>(STORAGE_KEYS.invoices, []);
  return { invoices, ready, service: invoiceService };
}
