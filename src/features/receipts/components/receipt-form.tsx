"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { Button, buttonClasses } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { useClients } from "@/features/clients/hooks/use-clients";
import { useInvoices } from "@/features/invoices/hooks/use-invoices";
import { invoiceTotal } from "@/features/invoices/services/invoice-calculator.service";
import { useCompany } from "@/features/settings/hooks/use-company";
import { formatCurrency } from "@/lib/utils/format-currency";
import { todayISO } from "@/lib/utils/format-date";
import type { FieldErrors } from "@/types/common.types";
import type { PaymentMethod, ReceiptInput } from "@/types/receipt.types";
import { useReceipts } from "../hooks/use-receipts";
import { PAYMENT_METHODS, paidAmount } from "../services/receipt.service";

interface ReceiptFormProps {
  defaultInvoiceId?: string;
  onSubmit: (values: Omit<ReceiptInput, "number">) => void;
  cancelHref: string;
}

function ReceiptFormInner({ defaultInvoiceId, onSubmit, cancelHref }: ReceiptFormProps) {
  const { clients } = useClients();
  const { invoices } = useInvoices();
  const { receipts } = useReceipts();
  const { company } = useCompany();

  const remaining = (invoiceId: string) => {
    const invoice = invoices.find((i) => i.id === invoiceId);
    return invoice ? Math.max(0, invoiceTotal(invoice) - paidAmount(invoiceId, receipts)) : 0;
  };

  const initialInvoice = invoices.find((i) => i.id === defaultInvoiceId);
  const [invoiceId, setInvoiceId] = useState(initialInvoice?.id ?? "");
  const [clientId, setClientId] = useState(initialInvoice?.clientId ?? "");
  const [date, setDate] = useState(todayISO());
  const [amount, setAmount] = useState(initialInvoice ? String(remaining(initialInvoice.id)) : "");
  const [method, setMethod] = useState<PaymentMethod>("especes");
  const [reference, setReference] = useState("");
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});

  const payable = invoices.filter(
    (i) => (i.status === "en_attente" || i.id === invoiceId) && (!clientId || i.clientId === clientId) && (remaining(i.id) > 0 || i.id === invoiceId),
  );

  function pickInvoice(id: string) {
    setInvoiceId(id);
    const invoice = invoices.find((i) => i.id === id);
    if (invoice) {
      setClientId(invoice.clientId);
      setAmount(String(remaining(id)));
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const errs: FieldErrors = {};
    const value = Number(amount);
    if (!clientId) errs.clientId = "Sélectionnez un client";
    if (!amount.trim() || Number.isNaN(value) || value <= 0) errs.amount = "Saisissez un montant supérieur à 0";
    if (!date) errs.date = "Date requise";
    setErrors(errs);
    if (Object.keys(errs).length) return;
    onSubmit({ clientId, invoiceId, date, amount: value, method, reference: reference.trim(), notes: notes.trim() });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <Select label="Client *" value={clientId} error={errors.clientId} onChange={(e) => { setClientId(e.target.value); setInvoiceId(""); }}>
          <option value="">Sélectionner un client…</option>
          {clients.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </Select>
        <Select label="Facture concernée" value={invoiceId} onChange={(e) => pickInvoice(e.target.value)} hint="Optionnel. Une facture entièrement payée passe en « Payée ».">
          <option value="">Aucune facture</option>
          {payable.map((i) => <option key={i.id} value={i.id}>{i.number} - reste {formatCurrency(remaining(i.id), company.currency)}</option>)}
        </Select>
        <Input label={`Montant reçu (${company.currency}) *`} type="number" min="0" step="any" value={amount} error={errors.amount} onChange={(e) => setAmount(e.target.value)} />
        <Input label="Date du paiement" type="date" value={date} error={errors.date} onChange={(e) => setDate(e.target.value)} />
        <Select label="Mode de paiement" value={method} onChange={(e) => setMethod(e.target.value as PaymentMethod)}>
          {Object.entries(PAYMENT_METHODS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
        </Select>
        <Input label="Référence" value={reference} onChange={(e) => setReference(e.target.value)} placeholder="N° de transaction, de chèque…" />
      </div>
      <Textarea label="Notes" value={notes} onChange={(e) => setNotes(e.target.value)} />
      <div className="flex flex-wrap justify-end gap-2 pt-2">
        <Link href={cancelHref} className={buttonClasses({ variant: "outline" })}>Annuler</Link>
        <Button type="submit">Générer le reçu</Button>
      </div>
    </form>
  );
}

/** Attend la lecture des données (factures, paiements) avant d'initialiser le formulaire. */
export function ReceiptForm(props: ReceiptFormProps) {
  const { ready: a } = useInvoices();
  const { ready: b } = useClients();
  const { ready: c } = useReceipts();
  const { ready: d } = useCompany();
  if (!(a && b && c && d)) return null;
  return <ReceiptFormInner {...props} />;
}
