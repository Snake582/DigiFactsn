"use client";

import Link from "next/link";
import { useState } from "react";
import { Package, Pencil, Plus, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { buttonClasses } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { EmptyState } from "@/components/ui/empty-state";
import { Select } from "@/components/ui/select";
import { Table, THead, Th, Tr, Td } from "@/components/ui/table";
import { SearchInput } from "@/features/clients/components/client-search";
import { useCompany } from "@/features/settings/hooks/use-company";
import { formatCurrency } from "@/lib/utils/format-currency";
import type { Product } from "@/types/product.types";
import { useProducts } from "../hooks/use-products";

export function ProductList() {
  const { products, ready, service } = useProducts();
  const { company } = useCompany();
  const [query, setQuery] = useState("");
  const [type, setType] = useState("");
  const [toDelete, setToDelete] = useState<Product | null>(null);

  if (!ready) return null;

  if (products.length === 0) {
    return (
      <EmptyState
        icon={Package}
        title="Votre catalogue est vide"
        description="Ajoutez vos produits et services avec leurs prix pour les insérer en un clic dans vos factures."
        action={<Link href="/produits/nouveau" className={buttonClasses()}><Plus size={16} /> Ajouter un produit</Link>}
      />
    );
  }

  const q = query.trim().toLowerCase();
  const filtered = products.filter(
    (p) => (!type || p.type === type) && (!q || p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)),
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row">
        <SearchInput value={query} onChange={setQuery} placeholder="Rechercher un produit…" />
        <div className="sm:w-44">
          <Select aria-label="Filtrer par type" value={type} onChange={(e) => setType(e.target.value)}>
            <option value="">Tous les types</option>
            <option value="produit">Produits</option>
            <option value="service">Services</option>
          </Select>
        </div>
      </div>
      <ul className="space-y-3 md:hidden">
        {filtered.map((p) => (
          <li key={p.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <Link href={`/produits/${p.id}`} className="font-semibold text-slate-900">{p.name}</Link>
                {p.description && <p className="line-clamp-2 text-sm text-slate-500">{p.description}</p>}
              </div>
              <Badge tone={p.type === "service" ? "blue" : "orange"}>{p.type === "service" ? "Service" : "Produit"}</Badge>
            </div>
            <div className="mt-3 flex items-end justify-between gap-3">
              <p className="text-base font-bold text-slate-900">{formatCurrency(p.price, company.currency)} <span className="text-xs font-normal text-slate-500">/ {p.unit}</span></p>
              <div className="flex gap-1">
                <Link href={`/produits/${p.id}`} aria-label={`Modifier ${p.name}`} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"><Pencil size={18} /></Link>
                <button onClick={() => setToDelete(p)} aria-label={`Supprimer ${p.name}`} className="rounded-lg p-2 text-slate-500 hover:bg-red-50 hover:text-red-600"><Trash2 size={18} /></button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <div className="hidden md:block">
      <Table>
        <THead>
          <tr>
            <Th>Nom</Th><Th>Type</Th><Th className="text-right">Prix</Th><Th>Unité</Th><Th className="w-24" />
          </tr>
        </THead>
        <tbody>
          {filtered.map((p) => (
            <Tr key={p.id}>
              <Td>
                <Link href={`/produits/${p.id}`} className="font-medium text-slate-900 hover:text-brand-600">{p.name}</Link>
                {p.description && <p className="max-w-xs truncate text-xs text-slate-500">{p.description}</p>}
              </Td>
              <Td><Badge tone={p.type === "service" ? "blue" : "orange"}>{p.type === "service" ? "Service" : "Produit"}</Badge></Td>
              <Td className="text-right font-medium">{formatCurrency(p.price, company.currency)}</Td>
              <Td>{p.unit}</Td>
              <Td>
                <div className="flex justify-end gap-1">
                  <Link href={`/produits/${p.id}`} aria-label={`Modifier ${p.name}`} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"><Pencil size={16} /></Link>
                  <button onClick={() => setToDelete(p)} aria-label={`Supprimer ${p.name}`} className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600"><Trash2 size={16} /></button>
                </div>
              </Td>
            </Tr>
          ))}
        </tbody>
      </Table>
      </div>
      {filtered.length === 0 && <p className="py-6 text-center text-sm text-slate-500">Aucun résultat.</p>}
      <ConfirmDialog
        open={!!toDelete}
        title="Supprimer ce produit ?"
        description={`« ${toDelete?.name} » sera retiré du catalogue. Les factures existantes ne changent pas.`}
        onCancel={() => setToDelete(null)}
        onConfirm={() => { if (toDelete) service.remove(toDelete.id); setToDelete(null); }}
      />
    </div>
  );
}
