"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/layout/page-header";
import { InvoiceForm } from "@/features/invoices/components/invoice-form";
import { invoiceService } from "@/features/invoices/services/invoice.service";

export default function NewInvoicePage({ searchParams }: { searchParams: Promise<{ client?: string }> }) {
  const { client } = use(searchParams);
  const router = useRouter();
  return (
    <>
      <PageHeader title="Nouvelle facture" description="Le numéro est attribué automatiquement." />
      <InvoiceForm
        defaultClientId={client}
        cancelHref="/factures"
        onSubmit={(values) => {
          const created = invoiceService.createWithNumber(values);
          router.push(`/factures/${created.id}`);
        }}
      />
    </>
  );
}
