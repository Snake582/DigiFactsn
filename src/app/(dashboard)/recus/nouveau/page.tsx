"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/layout/page-header";
import { Card } from "@/components/ui/card";
import { ReceiptForm } from "@/features/receipts/components/receipt-form";
import { receiptService } from "@/features/receipts/services/receipt.service";

export default function NewReceiptPage({ searchParams }: { searchParams: Promise<{ facture?: string }> }) {
  const { facture } = use(searchParams);
  const router = useRouter();
  return (
    <>
      <PageHeader title="Nouveau reçu" description="Enregistrez un paiement et générez le reçu correspondant." />
      <Card className="max-w-3xl">
        <ReceiptForm
          defaultInvoiceId={facture}
          cancelHref="/recus"
          onSubmit={(values) => {
            const created = receiptService.createWithNumber(values);
            router.push(`/recus/${created.id}`);
          }}
        />
      </Card>
    </>
  );
}
