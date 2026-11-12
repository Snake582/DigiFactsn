"use client";

import { useLocalStorage } from "@/hooks/use-local-storage";
import { STORAGE_KEYS } from "@/lib/storage/storage-keys";
import type { Client } from "@/types/client.types";
import { clientService } from "../services/client.service";

export function useClients() {
  const [clients, , ready] = useLocalStorage<Client[]>(STORAGE_KEYS.clients, []);
  return { clients, ready, service: clientService };
}
