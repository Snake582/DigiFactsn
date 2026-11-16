"use client";

import Link from "next/link";
import { useState } from "react";
import { Download, Eye, FileText, Plus, Trash2 } from "lucide-react";
import { buttonClasses } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { EmptyState } from "@/components/ui/empty-state";
import { Select } from "@/components/ui/select";
import { Table, THead, Th, Tr, Td } from "@/components/ui/table";
import { SearchInput } from "@/features/clients/components/client-search";
import { useClients } from "@/features/clients/hooks/use-clients";
import { useCompany } from "@/features/settings/hooks/use-company";
import { generateInvoicePdf } from "@/lib/pdf/generate-invoice-pdf";
import { formatCurrency } from "@/lib/utils/format-currency";
import { formatDate } from "@/lib/utils/format-date";
import type { Invoice } from "@/types/invoice.types";
import { useInvoices } from "../hooks/use-invoices";
import { getDisplayStatus, invoiceTotal } from "../services/invoice-calculator.service";
import { InvoiceStatusBadge, STATUS_LABELS } from "./invoice-status";

/** Liste + historique : recherche, filtre par statut et par client. */
export function InvoiceList({ limitClientId }: { limitClientId?: string }) {
  const { invoices, ready, service } = useInvoices();
  const { clients } = useClients();
  const { company } = useCompany();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");
  const [clientId, setClientId] = useState(limitClientId ?? "");
  const [toDelete, setToDelete] = useState<Invoice | null>(null);

  if (!ready) return null;

  if (invoices.length === 0) {
    return (
      <EmptyState
        icon={FileText}
        title="Aucune facture pour l'instant"
        description="Créez votre première facture en quelques clics, puis téléchargez-la en PDF."
        action={<Link href="/factures/nouvelle" className={buttonClasses()}><Plus size={16} /> Créer une facture</Link>}
      />
    );
  }

  const clientName = (id: string) => clients.find((c) => c.id === id)?.name ?? "Client supprimé";
  const q = query.trim().toLowerCase();
  const filtered = invoices
    .filter((i) => !clientId || i.clientId === clientId)
    .filter((i) => !status || getDisplayStatus(i) === status)
    .filter((i) => !q || i.number.toLowerCase().includes(q) || clientName(i.clientId).toLowerCase().includes(q))
    .sort((a, b) => b.issueDate.localeCompare(a.issueDate) || b.number.localeCompare(a.number));

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row">
        <SearchInput value={query} onChange={setQuery} placeholder="N° de facture ou client…" />
        <div className="sm:w-48">
          <Select aria-label="Filtrer par statut" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">Tous les statuts</option>
            {Object.entries(STATUS_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </Select>
        </div>
        {!limitClientId && (
          <div className="sm:w-56">
            <Select aria-label="Filtrer par client" value={clientId} onChange={(e) => setClientId(e.target.value)}>
              <option value="">Tous les clients</option>
              {clients.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </Select>
          </div>
        )}
      </div>

      <ul className="space-y-3 md:hidden">
        {filtered.map((invoice) => (
          <li key={invoice.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <Link href={`/factures/${invoice.id}`} className="font-semibold text-slate-900">{invoice.number}</Link>
                <p className="truncate text-sm text-slate-500">{clientName(invoice.clientId)}</p>
              </div>
              <InvoiceStatusBadge invoice={invoice} />
            </div>
            <div className="mt-3 flex items-end justify-between gap-3">
              <div className="text-xs text-slate-500">
                <p>Émise le {formatDate(invoice.issueDate)}</p>
                <p>Échéance le {formatDate(invoice.dueDate)}</p>
              </div>
              <p className="text-base font-bold text-slate-900">{formatCurrency(invoiceTotal(invoice), company.currency)}</p>
            </div>
            <div className="mt-3 flex justify-end gap-1 border-t border-slate-100 pt-2">
              <Link href={`/factures/${invoice.id}`} aria-label={`Voir ${invoice.number}`} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"><Eye size={18} /></Link>
              <button onClick={() => generateInvoicePdf(invoice, clients.find((c) => c.id === invoice.clientId), company)} aria-label={`Télécharger ${invoice.number} en PDF`} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-brand-600"><Download size={18} /></button>
              <button onClick={() => setToDelete(invoice)} aria-label={`Supprimer ${invoice.number}`} className="rounded-lg p-2 text-slate-500 hover:bg-red-50 hover:text-red-600"><Trash2 size={18} /></button>
            </div>
          </li>
        ))}
      </ul>

      <div className="hidden md:block">
      <Table>
        <THead>
          <tr><Th>N°</Th><Th>Client</Th><Th>Émission</Th><Th>Échéance</Th><Th className="text-right">Total</Th><Th>Statut</Th><Th className="w-28" /></tr>
        </THead>
        <tbody>
          {filtered.map((invoice) => (
            <Tr key={invoice.id}>
              <Td><Link href={`/factures/${invoice.id}`} className="font-semibold text-slate-900 hover:text-brand-600">{invoice.number}</Link></Td>
              <Td>{clientName(invoice.clientId)}</Td>
              <Td>{formatDate(invoice.issueDate)}</Td>
              <Td>{formatDate(invoice.dueDate)}</Td>
              <Td className="text-right font-medium">{formatCurrency(invoiceTotal(invoice), company.currency)}</Td>
              <Td><InvoiceStatusBadge invoice={invoice} /></Td>
              <Td>
                <div className="flex justify-end gap-1">
                  <Link href={`/factures/${invoice.id}`} aria-label={`Voir ${invoice.number}`} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"><Eye size={16} /></Link>
                  <button onClick={() => generateInvoicePdf(invoice, clients.find((c) => c.id === invoice.clientId), company)} aria-label={`Télécharger ${invoice.number} en PDF`} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-brand-600"><Download size={16} /></button>
                  <button onClick={() => setToDelete(invoice)} aria-label={`Supprimer ${invoice.number}`} className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600"><Trash2 size={16} /></button>
                </div>
              </Td>
            </Tr>
          ))}
        </tbody>
      </Table>
      </div>
      {filtered.length === 0 && <p className="py-6 text-center text-sm text-slate-500">Aucune facture ne correspond à ces filtres.</p>}

      <ConfirmDialog
        open={!!toDelete}
        title="Supprimer cette facture ?"
        description={`La facture ${toDelete?.number} sera définitivement supprimée de cet appareil.`}
        onCancel={() => setToDelete(null)}
        onConfirm={() => { if (toDelete) service.remove(toDelete.id); setToDelete(null); }}
      />
    </div>
  );
}
