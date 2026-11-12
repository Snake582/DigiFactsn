"use client";

import Link from "next/link";
import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { Package, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Button, buttonClasses } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { EmptyState } from "@/components/ui/empty-state";
import { ProductForm } from "@/features/products/components/product-form";
import { useProducts } from "@/features/products/hooks/use-products";

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { products, ready, service } = useProducts();
  const [confirm, setConfirm] = useState(false);

  if (!ready) return null;
  const product = products.find((p) => p.id === id);

  if (!product) {
    return (
      <EmptyState icon={Package} title="Produit introuvable" description="Ce produit a peut-être été supprimé."
        action={<Link href="/produits" className={buttonClasses()}>Retour au catalogue</Link>} />
    );
  }

  return (
    <>
      <PageHeader title={product.name} actions={<Button variant="outline" onClick={() => setConfirm(true)}><Trash2 size={16} /> Supprimer</Button>} />
      <Card className="max-w-3xl">
        <ProductForm product={product} cancelHref="/produits" onSubmit={(values) => { service.update(id, values); router.push("/produits"); }} />
      </Card>
      <ConfirmDialog open={confirm} title="Supprimer ce produit ?" description={`« ${product.name} » sera retiré du catalogue.`}
        onCancel={() => setConfirm(false)} onConfirm={() => { service.remove(id); router.push("/produits"); }} />
    </>
  );
}
