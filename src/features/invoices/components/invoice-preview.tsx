import type { Client } from "@/types/client.types";
import type { Company } from "@/types/company.types";
import type { Invoice } from "@/types/invoice.types";
import { DigiFactMark } from "@/components/brand/digifact-logo";
import { formatCurrency } from "@/lib/utils/format-currency";
import { formatDate } from "@/lib/utils/format-date";
import { computeTotals } from "../services/invoice-calculator.service";
import { InvoiceStatusBadge } from "./invoice-status";

export function InvoicePreview({ invoice, client, company }: { invoice: Invoice; client?: Client; company: Company }) {
  const totals = computeTotals(invoice.items, invoice.taxRate, invoice.discount);
  const money = (n: number) => formatCurrency(n, company.currency);

  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="h-1.5 bg-brand-600" />
      <div className="space-y-8 p-4 sm:p-10">
        <header className="flex flex-col gap-6 sm:flex-row sm:justify-between">
          <div className="flex gap-3">
            <DigiFactMark size={40} />
            <div className="text-sm text-slate-500">
              <p className="text-lg font-bold text-brand-600">{company.name || "Mon entreprise"}</p>
              {company.address && <p>{company.address}</p>}
              {company.city && <p>{company.city}</p>}
              {company.phone && <p>{company.phone}</p>}
              {company.email && <p>{company.email}</p>}
              {company.taxId && <p>N° fiscal : {company.taxId}</p>}
            </div>
          </div>
          <div className="sm:text-right">
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">FACTURE</h2>
            <p className="mt-1 text-sm text-slate-500">{invoice.number}</p>
            <div className="mt-2"><InvoiceStatusBadge invoice={invoice} /></div>
          </div>
        </header>

        <section className="grid gap-6 sm:grid-cols-2">
          <div className="text-sm">
            <p className="mb-1 text-xs font-semibold text-slate-500">Facturé à</p>
            <p className="font-semibold text-slate-900">{client?.name ?? "Client supprimé"}</p>
            {[client?.company, client?.address, client?.city, client?.phone, client?.email].filter(Boolean).map((l) => (
              <p key={l} className="text-slate-500">{l}</p>
            ))}
          </div>
          <dl className="space-y-1 text-sm sm:text-right">
            <div><dt className="inline text-slate-500">Date d'émission : </dt><dd className="inline font-medium">{formatDate(invoice.issueDate)}</dd></div>
            <div><dt className="inline text-slate-500">Échéance : </dt><dd className="inline font-medium">{formatDate(invoice.dueDate)}</dd></div>
          </dl>
        </section>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[480px] text-sm">
            <thead>
              <tr className="bg-brand-600 text-left text-white">
                <th className="rounded-l-lg px-3 py-2.5 font-semibold">Description</th>
                <th className="px-3 py-2.5 text-right font-semibold">Qté</th>
                <th className="px-3 py-2.5 text-right font-semibold">Prix unitaire</th>
                <th className="rounded-r-lg px-3 py-2.5 text-right font-semibold">Total</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((i) => (
                <tr key={i.id} className="border-b border-slate-100">
                  <td className="px-3 py-3">{i.description}</td>
                  <td className="px-3 py-3 text-right">{i.quantity}</td>
                  <td className="px-3 py-3 text-right">{money(i.unitPrice)}</td>
                  <td className="px-3 py-3 text-right font-medium">{money(i.quantity * i.unitPrice)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="ml-auto w-full max-w-xs space-y-2 text-sm">
          <div className="flex justify-between"><span className="text-slate-500">Sous-total</span><span>{money(totals.subtotal)}</span></div>
          {invoice.discount > 0 && <div className="flex justify-between"><span className="text-slate-500">Remise ({invoice.discount} %)</span><span>- {money(totals.discountAmount)}</span></div>}
          <div className="flex justify-between"><span className="text-slate-500">TVA ({invoice.taxRate} %)</span><span>{money(totals.taxAmount)}</span></div>
          <div className="flex justify-between rounded-xl bg-brand-600 px-4 py-3 text-base font-bold text-white"><span>Total TTC</span><span>{money(totals.total)}</span></div>
        </div>

        {invoice.notes && (
          <div className="text-sm">
            <p className="mb-1 font-semibold text-slate-900">Notes</p>
            <p className="whitespace-pre-line text-slate-500">{invoice.notes}</p>
          </div>
        )}
        {company.footerNote && <p className="border-t border-slate-100 pt-4 text-center text-sm italic text-slate-500">{company.footerNote}</p>}
      </div>
    </article>
  );
}
