import type { Client } from "@/types/client.types";
import type { Company } from "@/types/company.types";
import type { Receipt } from "@/types/receipt.types";
import { DigiFactMark } from "@/components/brand/digifact-logo";
import { formatCurrency } from "@/lib/utils/format-currency";
import { formatDate } from "@/lib/utils/format-date";
import { PAYMENT_METHODS } from "../services/receipt.service";

interface Props { receipt: Receipt; client?: Client; company: Company; invoiceNumber?: string }

export function ReceiptPreview({ receipt, client, company, invoiceNumber }: Props) {
  const rows: [string, string][] = [
    ["Reçu de", client?.name ?? "Client supprimé"],
    ["Date du paiement", formatDate(receipt.date)],
    ["Mode de paiement", PAYMENT_METHODS[receipt.method]],
    ["Facture liée", invoiceNumber ?? "-"],
    ["Référence", receipt.reference || "-"],
  ];
  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="h-1.5 bg-brand-600" />
      <div className="space-y-8 p-4 sm:p-10">
        <header className="flex flex-col gap-4 sm:flex-row sm:justify-between">
          <div className="flex gap-3">
            <DigiFactMark size={40} />
            <div className="text-sm text-slate-500">
              <p className="text-lg font-bold text-brand-600">{company.name || "Mon entreprise"}</p>
              {[company.address, company.city, company.phone, company.email].filter(Boolean).map((l) => <p key={l}>{l}</p>)}
            </div>
          </div>
          <div className="sm:text-right">
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">REÇU</h2>
            <p className="mt-1 text-sm text-slate-500">{receipt.number}</p>
          </div>
        </header>
        <div className="rounded-2xl bg-brand-50 p-6">
          <p className="text-sm text-slate-500">Montant reçu</p>
          <p className="text-3xl font-extrabold text-brand-600">{formatCurrency(receipt.amount, company.currency)}</p>
        </div>
        <dl className="grid gap-3 text-sm sm:grid-cols-[180px_1fr]">
          {rows.map(([label, value]) => (
            <div key={label} className="contents"><dt className="text-slate-500">{label}</dt><dd className="font-semibold text-slate-900">{value}</dd></div>
          ))}
        </dl>
        {receipt.notes && <p className="whitespace-pre-line text-sm text-slate-500">{receipt.notes}</p>}
        {company.footerNote && <p className="border-t border-slate-100 pt-4 text-center text-sm italic text-slate-500">{company.footerNote}</p>}
      </div>
    </article>
  );
}
