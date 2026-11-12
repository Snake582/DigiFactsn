import type { Client } from "@/types/client.types";
import { createRepository } from "@/lib/storage/storage";
import { STORAGE_KEYS } from "@/lib/storage/storage-keys";

export const clientService = createRepository<Client>(STORAGE_KEYS.clients);

export function filterClients(clients: Client[], query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return clients;
  return clients.filter((c) =>
    [c.name, c.company, c.email, c.phone, c.city].some((value) => value.toLowerCase().includes(q)),
  );
}
