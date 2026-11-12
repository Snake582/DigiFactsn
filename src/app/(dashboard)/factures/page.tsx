import Link from "next/link";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { buttonClasses } from "@/components/ui/button";
import { InvoiceList } from "@/features/invoices/components/invoice-list";

export default function InvoicesPage() {
  return (
    <>
      <PageHeader
        title="Factures"
        description="Historique complet : retrouvez, filtrez et téléchargez toutes vos factures."
        actions={<Link href="/factures/nouvelle" className={buttonClasses()}><Plus size={16} /> Nouvelle facture</Link>}
      />
      <InvoiceList />
    </>
  );
}
