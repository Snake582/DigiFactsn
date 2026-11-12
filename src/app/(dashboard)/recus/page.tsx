import Link from "next/link";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { buttonClasses } from "@/components/ui/button";
import { ReceiptList } from "@/features/receipts/components/receipt-list";

export default function ReceiptsPage() {
  return (
    <>
      <PageHeader
        title="Reçus"
        description="Les reçus de paiement générés pour vos clients."
        actions={<Link href="/recus/nouveau" className={buttonClasses()}><Plus size={16} /> Nouveau reçu</Link>}
      />
      <ReceiptList />
    </>
  );
}
