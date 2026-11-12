"use client";

import Link from "next/link";
import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { Download, Receipt as ReceiptIcon, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Button, buttonClasses } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { EmptyState } from "@/components/ui/empty-state";
import { useClients } from "@/features/clients/hooks/use-clients";
import { useInvoices } from "@/features/invoices/hooks/use-invoices";
import { ReceiptPreview } from "@/features/receipts/components/receipt-preview";
import { useReceipts } from "@/features/receipts/hooks/use-receipts";
import { useCompany } from "@/features/settings/hooks/use-company";
import { generateReceiptPdf } from "@/lib/pdf/generate-receipt-pdf";

export default function ReceiptDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { receipts, ready, service } = useReceipts();
  const { clients } = useClients();
  const { invoices } = useInvoices();
  const { company } = useCompany();
  const [confirm, setConfirm] = useState(false);

  if (!ready) return null;
  const receipt = receipts.find((r) => r.id === id);

  if (!receipt) {
    return (
      <EmptyState icon={ReceiptIcon} title="Reçu introuvable" description="Ce reçu a peut-être été supprimé."
        action={<Link href="/recus" className={buttonClasses()}>Retour aux reçus</Link>} />
    );
  }

  const client = clients.find((c) => c.id === receipt.clientId);
  const invoiceNumber = invoices.find((i) => i.id === receipt.invoiceId)?.number;

  return (
    <>
      <PageHeader
        title={receipt.number}
        actions={
          <>
            <Button onClick={() => generateReceiptPdf(receipt, client, company, invoiceNumber)}><Download size={16} /> Télécharger le PDF</Button>
            <Button variant="ghost" aria-label="Supprimer le reçu" onClick={() => setConfirm(true)}><Trash2 size={16} className="text-red-600" /></Button>
          </>
        }
      />
      <div className="mx-auto max-w-3xl">
        <ReceiptPreview receipt={receipt} client={client} company={company} invoiceNumber={invoiceNumber} />
      </div>
      <ConfirmDialog open={confirm} title="Supprimer ce reçu ?" description={`Le reçu ${receipt.number} sera supprimé.`}
        onCancel={() => setConfirm(false)} onConfirm={() => { service.removeAndSync(id); router.push("/recus"); }} />
    </>
  );
}
