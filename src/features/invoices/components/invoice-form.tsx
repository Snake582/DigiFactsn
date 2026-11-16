"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { Button, buttonClasses } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { Input, Textarea } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { useClients } from "@/features/clients/hooks/use-clients";
import { useProducts } from "@/features/products/hooks/use-products";
import { useCompany } from "@/features/settings/hooks/use-company";
import { addDays, todayISO } from "@/lib/utils/format-date";
import { formatCurrency } from "@/lib/utils/format-currency";
import { generateId } from "@/lib/utils/generate-id";
import { zodErrors } from "@/lib/utils/zod-errors";
import type { FieldErrors } from "@/types/common.types";
import type { Invoice, InvoiceInput, InvoiceItem, InvoiceStatus } from "@/types/invoice.types";
import { computeTotals } from "../services/invoice-calculator.service";
import { invoiceSchema } from "../validations/invoice.schema";
import { EDITABLE_STATUSES, STATUS_LABELS } from "./invoice-status";
import { InvoiceItems } from "./invoice-items";

interface InvoiceFormProps {
  invoice?: Invoice;
  defaultClientId?: string;
  onSubmit: (values: Omit<InvoiceInput, "number">) => void;
  cancelHref: string;
}

function InvoiceFormInner({ invoice, defaultClientId, onSubmit, cancelHref }: InvoiceFormProps) {
  const { clients } = useClients();
  const { products } = useProducts();
  const { company } = useCompany();

  const today = todayISO();
  const [clientId, setClientId] = useState(invoice?.clientId ?? defaultClientId ?? "");
  const [issueDate, setIssueDate] = useState(invoice?.issueDate ?? today);
  const [dueDate, setDueDate] = useState(invoice?.dueDate ?? addDays(today, company.paymentTermDays));
  const [items, setItems] = useState<InvoiceItem[]>(
    invoice?.items ?? [{ id: generateId(), description: "", quantity: 1, unitPrice: 0 }],
  );
  const [taxRate, setTaxRate] = useState(invoice?.taxRate ?? company.defaultTaxRate);
  const [discount, setDiscount] = useState(invoice?.discount ?? 0);
  const [status, setStatus] = useState<InvoiceStatus>(invoice?.status ?? "en_attente");
  const [notes, setNotes] = useState(invoice?.notes ?? "");
  const [errors, setErrors] = useState<FieldErrors>({});

  const totals = computeTotals(items, taxRate, discount);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const result = invoiceSchema.safeParse({ clientId, issueDate, dueDate, items, taxRate, discount, status, notes });
    if (!result.success) return setErrors(zodErrors(result.error));
    onSubmit(result.data);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      <Card>
        <CardTitle>Informations</CardTitle>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2">
            <Select label="Client *" value={clientId} error={errors.clientId} onChange={(e) => setClientId(e.target.value)}>
              <option value="">Sélectionner un client…</option>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>{c.name}{c.company ? ` - ${c.company}` : ""}</option>
              ))}
            </Select>
            {clients.length === 0 && (
              <p className="mt-1.5 text-xs text-slate-500">
                Aucun client. <Link href="/clients/nouveau" className="font-medium text-brand-600 hover:underline">Ajouter un client</Link>
              </p>
            )}
          </div>
          <Input label="Date d'émission" type="date" value={issueDate} error={errors.issueDate} onChange={(e) => setIssueDate(e.target.value)} />
          <Input label="Échéance" type="date" value={dueDate} error={errors.dueDate} onChange={(e) => setDueDate(e.target.value)} />
        </div>
      </Card>

      <Card>
        <CardTitle>Lignes de la facture</CardTitle>
        <InvoiceItems items={items} products={products} currency={company.currency} errors={errors} onChange={setItems} />
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="space-y-4">
          <CardTitle>Options</CardTitle>
          <div className="grid gap-4 sm:grid-cols-3">
            <Input label="TVA (%)" type="number" min="0" max="100" step="any" value={taxRate} error={errors.taxRate} onChange={(e) => setTaxRate(Number(e.target.value))} />
            <Input label="Remise (%)" type="number" min="0" max="100" step="any" value={discount} error={errors.discount} onChange={(e) => setDiscount(Number(e.target.value))} />
            <Select label="Statut" value={status} onChange={(e) => setStatus(e.target.value as InvoiceStatus)}>
              {EDITABLE_STATUSES.map((s) => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
            </Select>
          </div>
          <Textarea label="Notes (visibles sur la facture)" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Coordonnées de paiement, conditions…" />
        </Card>

        <Card>
          <CardTitle>Récapitulatif</CardTitle>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between"><dt className="text-slate-500">Sous-total</dt><dd>{formatCurrency(totals.subtotal, company.currency)}</dd></div>
            {discount > 0 && <div className="flex justify-between"><dt className="text-slate-500">Remise ({discount} %)</dt><dd>- {formatCurrency(totals.discountAmount, company.currency)}</dd></div>}
            <div className="flex justify-between"><dt className="text-slate-500">TVA ({taxRate} %)</dt><dd>{formatCurrency(totals.taxAmount, company.currency)}</dd></div>
            <div className="flex justify-between border-t border-slate-200 pt-3 text-lg font-bold text-slate-900"><dt>Total TTC</dt><dd className="text-brand-600">{formatCurrency(totals.total, company.currency)}</dd></div>
          </dl>
        </Card>
      </div>

      <div className="flex flex-wrap justify-end gap-2">
        <Link href={cancelHref} className={buttonClasses({ variant: "outline" })}>Annuler</Link>
        <Button type="submit">{invoice ? "Enregistrer les modifications" : "Créer la facture"}</Button>
      </div>
    </form>
  );
}

/** Attend la lecture des paramètres de l'entreprise (TVA, délai de paiement) avant d'afficher le formulaire. */
export function InvoiceForm(props: InvoiceFormProps) {
  const { ready } = useCompany();
  if (!ready) return null;
  return <InvoiceFormInner {...props} />;
}
