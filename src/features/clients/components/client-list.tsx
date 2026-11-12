"use client";

import Link from "next/link";
import { useState } from "react";
import { Plus, Users } from "lucide-react";
import { buttonClasses } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { EmptyState } from "@/components/ui/empty-state";
import type { Client } from "@/types/client.types";
import { useClients } from "../hooks/use-clients";
import { filterClients } from "../services/client.service";
import { ClientCard } from "./client-card";
import { ClientSearch } from "./client-search";

export function ClientList() {
  const { clients, ready, service } = useClients();
  const [query, setQuery] = useState("");
  const [toDelete, setToDelete] = useState<Client | null>(null);

  if (!ready) return null;

  if (clients.length === 0) {
    return (
      <EmptyState
        icon={Users}
        title="Aucun client pour l'instant"
        description="Ajoutez votre premier client pour pouvoir lui créer des factures."
        action={<Link href="/clients/nouveau" className={buttonClasses()}><Plus size={16} /> Ajouter un client</Link>}
      />
    );
  }

  const filtered = filterClients(clients, query);

  return (
    <div className="space-y-4">
      <ClientSearch value={query} onChange={setQuery} placeholder="Rechercher un client…" />
      {filtered.length === 0 ? (
        <p className="py-10 text-center text-sm text-slate-500">Aucun client ne correspond à « {query} ».</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((client) => (
            <ClientCard key={client.id} client={client} onDelete={() => setToDelete(client)} />
          ))}
        </div>
      )}
      <ConfirmDialog
        open={!!toDelete}
        title="Supprimer ce client ?"
        description={`« ${toDelete?.name} » sera supprimé. Ses factures existantes seront conservées mais n'afficheront plus son nom.`}
        onCancel={() => setToDelete(null)}
        onConfirm={() => {
          if (toDelete) service.remove(toDelete.id);
          setToDelete(null);
        }}
      />
    </div>
  );
}
