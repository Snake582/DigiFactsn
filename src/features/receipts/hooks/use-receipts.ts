"use client";

import { useLocalStorage } from "@/hooks/use-local-storage";
import { STORAGE_KEYS } from "@/lib/storage/storage-keys";
import type { Receipt } from "@/types/receipt.types";
import { receiptService } from "../services/receipt.service";

export function useReceipts() {
  const [receipts, , ready] = useLocalStorage<Receipt[]>(STORAGE_KEYS.receipts, []);
  return { receipts, ready, service: receiptService };
}
