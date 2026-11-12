"use client";

import Link from "next/link";
import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { Download, FileText, Pencil, Receipt as ReceiptIcon, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Button, buttonClasses } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { EmptyState } from "@/components/ui/empty-state";
import { Select } from "@/components/ui/select";
import { useClients } from "@/features/clients/hooks/use-clients";
import { InvoiceForm } from "@/features/invoices/components/invoice-form";
import { InvoicePreview } from "@/features/invoices/components/invoice-preview";
import { EDITABLE_STATUSES, STATUS_LABELS } from "@/features/invoices/components/invoice-status";
import { useInvoices } from "@/features/invoices/hooks/use-invoices";
import { useCompany } from "@/features/settings/hooks/use-company";
import { generateInvoicePdf } from "@/lib/pdf/generate-invoice-pdf";
import type { InvoiceStatus } from "@/types/invoice.types";

export default function InvoiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { invoices, ready, service } = useInvoices();
  const { clients } = useClients();
  const { company } = useCompany();
  const [editing, setEditing] = useState(false);
  const [confirm, setConfirm] = useState(false);

  if (!ready) return null;
  const invoice = invoices.find((i) => i.id === id);

  if (!invoice) {
    return (
      <EmptyState icon={FileText} title="Facture introuvable" description="Cette facture a peut-être été supprimée."
        action={<Link href="/factures" className={buttonClasses()}>Retour aux factures</Link>} />
    );
  }

  const client = clients.find((c) => c.id === invoice.clientId);

  if (editing) {
    return (
      <>
        <PageHeader title={`Modifier ${invoice.number}`} />
        <InvoiceForm
          invoice={invoice}
          cancelHref={`/factures/${id}`}
          onSubmit={(values) => { service.update(id, values); setEditing(false); }}
        />
      </>
    );
  }

  const canPay = invoice.status === "en_attente" || invoice.status === "brouillon";

  return (
    <>
      <PageHeader
        title={invoice.number}
        actions={
          <>
            <div className="w-40">
              <Select aria-label="Statut de la facture" value={invoice.status} onChange={(e) => service.setStatus(id, e.target.value as InvoiceStatus)}>
                {EDITABLE_STATUSES.map((s) => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
              </Select>
            </div>
            {canPay && <Link href={`/recus/nouveau?facture=${id}`} className={buttonClasses({ variant: "secondary" })}><ReceiptIcon size={16} /> Enregistrer un paiement</Link>}
            <Button variant="outline" onClick={() => setEditing(true)}><Pencil size={16} /> Modifier</Button>
            <Button onClick={() => generateInvoicePdf(invoice, client, company)}><Download size={16} /> Télécharger le PDF</Button>
            <Button variant="ghost" aria-label="Supprimer la facture" onClick={() => setConfirm(true)}><Trash2 size={16} className="text-red-600" /></Button>
          </>
        }
      />
      <div className="mx-auto max-w-3xl">
        <InvoicePreview invoice={invoice} client={client} company={company} />
      </div>
      <ConfirmDialog open={confirm} title="Supprimer cette facture ?" description={`La facture ${invoice.number} sera définitivement supprimée.`}
        onCancel={() => setConfirm(false)} onConfirm={() => { service.remove(id); router.push("/factures"); }} />
    </>
  );
}
