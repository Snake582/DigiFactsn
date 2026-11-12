import Link from "next/link";
import { Card, CardTitle } from "@/components/ui/card";
import { InvoiceStatusBadge } from "@/features/invoices/components/invoice-status";
import { invoiceTotal } from "@/features/invoices/services/invoice-calculator.service";
import { formatCurrency } from "@/lib/utils/format-currency";
import { formatDate } from "@/lib/utils/format-date";
import type { Client } from "@/types/client.types";
import type { Invoice } from "@/types/invoice.types";

export function RecentInvoices({ invoices, clients, currency }: { invoices: Invoice[]; clients: Client[]; currency: string }) {
  const recent = [...invoices].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 5);
  return (
    <Card>
      <CardTitle action={<Link href="/factures" className="text-sm font-medium text-brand-600 hover:underline">Voir tout</Link>}>
        Dernières factures
      </CardTitle>
      {recent.length === 0 ? (
        <p className="py-6 text-center text-sm text-slate-500">Aucune facture pour le moment.</p>
      ) : (
        <ul className="divide-y divide-slate-100">
          {recent.map((i) => (
            <li key={i.id}>
              <Link href={`/factures/${i.id}`} className="flex items-center justify-between gap-3 py-3 hover:opacity-80">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-900">{i.number}</p>
                  <p className="truncate text-xs text-slate-500">{clients.find((c) => c.id === i.clientId)?.name ?? "Client supprimé"} · {formatDate(i.issueDate)}</p>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-1">
                  <span className="text-sm font-medium">{formatCurrency(invoiceTotal(i), currency)}</span>
                  <InvoiceStatusBadge invoice={i} />
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
