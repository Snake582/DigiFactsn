"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import type { Product, ProductInput, ProductType } from "@/types/product.types";
import type { FieldErrors } from "@/types/common.types";
import { Button, buttonClasses } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { zodErrors } from "@/lib/utils/zod-errors";
import { productSchema } from "../validations/product.schema";

interface ProductFormProps {
  product?: Product;
  onSubmit: (values: ProductInput) => void;
  cancelHref: string;
}

export function ProductForm({ product, onSubmit, cancelHref }: ProductFormProps) {
  const [name, setName] = useState(product?.name ?? "");
  const [description, setDescription] = useState(product?.description ?? "");
  const [price, setPrice] = useState(product ? String(product.price) : "");
  const [unit, setUnit] = useState(product?.unit ?? "unité");
  const [type, setType] = useState<ProductType>(product?.type ?? "service");
  const [errors, setErrors] = useState<FieldErrors>({});

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const result = productSchema.safeParse({
      name,
      description,
      price: price.trim() === "" ? NaN : Number(price),
      unit,
      type,
    });
    if (!result.success) {
      const errs = zodErrors(result.error);
      if (Number.isNaN(Number(price)) || price.trim() === "") errs.price = "Saisissez un prix valide";
      return setErrors(errs);
    }
    onSubmit(result.data);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <Input label="Nom *" value={name} error={errors.name} onChange={(e) => setName(e.target.value)} placeholder="Site vitrine" />
        <Select label="Type" value={type} onChange={(e) => setType(e.target.value as ProductType)}>
          <option value="service">Service</option>
          <option value="produit">Produit</option>
        </Select>
        <Input label="Prix unitaire *" type="number" min="0" step="any" value={price} error={errors.price} onChange={(e) => setPrice(e.target.value)} placeholder="50000" />
        <Input label="Unité *" value={unit} error={errors.unit} onChange={(e) => setUnit(e.target.value)} hint="Ex. : unité, heure, jour, mois, forfait" />
      </div>
      <Textarea label="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
      <div className="flex flex-wrap justify-end gap-2 pt-2">
        <Link href={cancelHref} className={buttonClasses({ variant: "outline" })}>Annuler</Link>
        <Button type="submit">Enregistrer</Button>
      </div>
    </form>
  );
}
