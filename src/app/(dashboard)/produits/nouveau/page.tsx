"use client";

import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/layout/page-header";
import { Card } from "@/components/ui/card";
import { ProductForm } from "@/features/products/components/product-form";
import { productService } from "@/features/products/services/product.service";

export default function NewProductPage() {
  const router = useRouter();
  return (
    <>
      <PageHeader title="Nouveau produit ou service" />
      <Card className="max-w-3xl">
        <ProductForm cancelHref="/produits" onSubmit={(values) => { productService.create(values); router.push("/produits"); }} />
      </Card>
    </>
  );
}
