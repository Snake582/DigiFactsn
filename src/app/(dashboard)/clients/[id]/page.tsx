"use client";

import Link from "next/link";
import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Users } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Button, buttonClasses } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { EmptyState } from "@/components/ui/empty-state";
import { ClientForm } from "@/features/clients/components/client-form";
import { useClients } from "@/features/clients/hooks/use-clients";
import { InvoiceList } from "@/features/invoices/components/invoice-list";
import { useInvoices } from "@/features/invoices/hooks/use-invoices";

export default function ClientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { clients, ready, service } = useClients();
  const { invoices } = useInvoices();
  const [confirm, setConfirm] = useState(false);
  const [saved, setSaved] = useState(false);

  if (!ready) return null;
  const client = clients.find((c) => c.id === id);

  if (!client) {
    return (
      <EmptyState icon={Users} title="Client introuvable" description="Ce client a peut-être été supprimé."
        action={<Link href="/clients" className={buttonClasses()}>Retour aux clients</Link>} />
    );
  }

  const hasInvoices = invoices.some((i) => i.clientId === id);

  return (
    <>
      <PageHeader
        title={client.name}
        description={client.company}
        actions={
          <>
            <Link href={`/factures/nouvelle?client=${id}`} className={buttonClasses({ variant: "secondary" })}><Plus size={16} /> Nouvelle facture</Link>
            <Button variant="outline" onClick={() => setConfirm(true)}><Trash2 size={16} /> Supprimer</Button>
          </>
        }
      />
      <div className="space-y-6">
        <Card className="max-w-3xl">
          <CardTitle>Informations</CardTitle>
          <ClientForm client={client} cancelHref="/clients" onSubmit={(values) => { service.update(id, values); setSaved(true); }} />
          {saved && <p role="status" className="mt-3 text-sm font-medium text-emerald-600">Modifications enregistrées.</p>}
        </Card>
        {hasInvoices && (
          <div>
            <h2 className="mb-3 text-base font-semibold text-slate-900">Factures de ce client</h2>
            <InvoiceList limitClientId={id} />
          </div>
        )}
      </div>
      <ConfirmDialog open={confirm} title="Supprimer ce client ?"
        description={`« ${client.name} » sera supprimé. Ses factures seront conservées mais n'afficheront plus son nom.`}
        onCancel={() => setConfirm(false)}
        onConfirm={() => { service.remove(id); router.push("/clients"); }} />
    </>
  );
}
