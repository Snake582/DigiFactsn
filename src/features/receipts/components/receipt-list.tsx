"use client";

import Link from "next/link";
import { useState } from "react";
import { Download, Eye, Plus, Receipt as ReceiptIcon, Trash2 } from "lucide-react";
import { buttonClasses } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { EmptyState } from "@/components/ui/empty-state";
import { Table, THead, Th, Tr, Td } from "@/components/ui/table";
import { SearchInput } from "@/features/clients/components/client-search";
import { useClients } from "@/features/clients/hooks/use-clients";
import { useInvoices } from "@/features/invoices/hooks/use-invoices";
import { useCompany } from "@/features/settings/hooks/use-company";
import { generateReceiptPdf } from "@/lib/pdf/generate-receipt-pdf";
import { formatCurrency } from "@/lib/utils/format-currency";
import { formatDate } from "@/lib/utils/format-date";
import type { Receipt } from "@/types/receipt.types";
import { useReceipts } from "../hooks/use-receipts";
import { PAYMENT_METHODS } from "../services/receipt.service";

export function ReceiptList() {
  const { receipts, ready, service } = useReceipts();
  const { clients } = useClients();
  const { invoices } = useInvoices();
  const { company } = useCompany();
  const [query, setQuery] = useState("");
  const [toDelete, setToDelete] = useState<Receipt | null>(null);

  if (!ready) return null;

  if (receipts.length === 0) {
    return (
      <EmptyState
        icon={ReceiptIcon}
        title="Aucun reçu pour l'instant"
        description="Générez un reçu dès qu'un client vous règle une facture."
        action={<Link href="/recus/nouveau" className={buttonClasses()}><Plus size={16} /> Créer un reçu</Link>}
      />
    );
  }

  const clientOf = (id: string) => clients.find((c) => c.id === id);
  const invoiceNumber = (id: string) => invoices.find((i) => i.id === id)?.number;
  const q = query.trim().toLowerCase();
  const filtered = receipts
    .filter((r) => !q || r.number.toLowerCase().includes(q) || (clientOf(r.clientId)?.name ?? "").toLowerCase().includes(q))
    .sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="space-y-4">
      <SearchInput value={query} onChange={setQuery} placeholder="N° de reçu ou client…" />
      <Table>
        <THead>
          <tr><Th>N°</Th><Th>Client</Th><Th>Facture</Th><Th>Date</Th><Th>Mode</Th><Th className="text-right">Montant</Th><Th className="w-28" /></tr>
        </THead>
        <tbody>
          {filtered.map((r) => (
            <Tr key={r.id}>
              <Td><Link href={`/recus/${r.id}`} className="font-semibold text-slate-900 hover:text-brand-600">{r.number}</Link></Td>
              <Td>{clientOf(r.clientId)?.name ?? "Client supprimé"}</Td>
              <Td>{invoiceNumber(r.invoiceId) ?? "-"}</Td>
              <Td>{formatDate(r.date)}</Td>
              <Td>{PAYMENT_METHODS[r.method].split(" (")[0]}</Td>
              <Td className="text-right font-medium">{formatCurrency(r.amount, company.currency)}</Td>
              <Td>
                <div className="flex justify-end gap-1">
                  <Link href={`/recus/${r.id}`} aria-label={`Voir ${r.number}`} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"><Eye size={16} /></Link>
                  <button onClick={() => generateReceiptPdf(r, clientOf(r.clientId), company, invoiceNumber(r.invoiceId))} aria-label={`Télécharger ${r.number} en PDF`} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-brand-600"><Download size={16} /></button>
                  <button onClick={() => setToDelete(r)} aria-label={`Supprimer ${r.number}`} className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600"><Trash2 size={16} /></button>
                </div>
              </Td>
            </Tr>
          ))}
        </tbody>
      </Table>
      {filtered.length === 0 && <p className="py-6 text-center text-sm text-slate-500">Aucun reçu ne correspond.</p>}
      <ConfirmDialog
        open={!!toDelete}
        title="Supprimer ce reçu ?"
        description={`Le reçu ${toDelete?.number} sera supprimé. Si la facture liée était « Payée », elle repassera « En attente ».`}
        onCancel={() => setToDelete(null)}
        onConfirm={() => { if (toDelete) service.removeAndSync(toDelete.id); setToDelete(null); }}
      />
    </div>
  );
}
