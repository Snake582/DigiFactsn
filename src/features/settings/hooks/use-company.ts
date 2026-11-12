"use client";

import { useLocalStorage } from "@/hooks/use-local-storage";
import { STORAGE_KEYS } from "@/lib/storage/storage-keys";
import type { Company } from "@/types/company.types";
import { DEFAULT_COMPANY, settingsService } from "../services/settings.service";

export function useCompany() {
  const [stored, , ready] = useLocalStorage<Partial<Company>>(STORAGE_KEYS.company, {});
  const company: Company = { ...DEFAULT_COMPANY, ...stored };
  return { company, ready, save: settingsService.save };
}
