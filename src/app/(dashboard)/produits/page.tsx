import Link from "next/link";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { buttonClasses } from "@/components/ui/button";
import { ProductList } from "@/features/products/components/product-list";

export default function ProductsPage() {
  return (
    <>
      <PageHeader
        title="Produits & Services"
        description="Votre catalogue avec les prix, prêt à insérer dans vos factures."
        actions={<Link href="/produits/nouveau" className={buttonClasses()}><Plus size={16} /> Nouveau produit</Link>}
      />
      <ProductList />
    </>
  );
}
