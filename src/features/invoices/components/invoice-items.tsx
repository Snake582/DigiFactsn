"use client";

import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fieldBase } from "@/components/ui/input";
import { cn } from "@/lib/utils/cn";
import { formatCurrency } from "@/lib/utils/format-currency";
import { generateId } from "@/lib/utils/generate-id";
import type { FieldErrors } from "@/types/common.types";
import type { InvoiceItem } from "@/types/invoice.types";
import type { Product } from "@/types/product.types";

interface InvoiceItemsProps {
  items: InvoiceItem[];
  products: Product[];
  currency: string;
  errors: FieldErrors;
  onChange: (items: InvoiceItem[]) => void;
}

export function InvoiceItems({ items, products, currency, errors, onChange }: InvoiceItemsProps) {
  const update = (id: string, patch: Partial<InvoiceItem>) =>
    onChange(items.map((i) => (i.id === id ? { ...i, ...patch } : i)));
  const blank = (): InvoiceItem => ({ id: generateId(), description: "", quantity: 1, unitPrice: 0 });

  function addProduct(productId: string) {
    const p = products.find((x) => x.id === productId);
    if (!p) return;
    onChange([...items, { id: generateId(), productId: p.id, description: p.name, quantity: 1, unitPrice: p.price }]);
  }

  return (
    <div className="space-y-3">
      <div className="hidden gap-2 px-1 text-xs font-semibold text-slate-500 sm:grid sm:grid-cols-[1fr_90px_130px_120px_32px]">
        <span>Description</span><span>Qté</span><span>Prix unitaire</span><span className="text-right">Total</span><span />
      </div>

      {items.map((item, index) => (
        <div key={item.id} className="grid gap-2 rounded-xl border border-slate-200 p-3 sm:grid-cols-[1fr_90px_130px_120px_32px] sm:items-start sm:border-0 sm:p-0">
          <div>
            <input
              aria-label="Description"
              className={cn(fieldBase, errors[`items.${index}.description`] ? "border-red-400" : "border-slate-300")}
              value={item.description}
              placeholder="Description de la ligne"
              onChange={(e) => update(item.id, { description: e.target.value })}
            />
            {errors[`items.${index}.description`] && <p className="mt-1 text-xs text-red-600">{errors[`items.${index}.description`]}</p>}
          </div>
          <input aria-label="Quantité" type="number" min="0" step="any" className={cn(fieldBase, "border-slate-300")} value={item.quantity} onChange={(e) => update(item.id, { quantity: Number(e.target.value) })} />
          <input aria-label="Prix unitaire" type="number" min="0" step="any" className={cn(fieldBase, "border-slate-300")} value={item.unitPrice} onChange={(e) => update(item.id, { unitPrice: Number(e.target.value) })} />
          <p className="py-2.5 text-sm font-semibold text-slate-900 sm:text-right">{formatCurrency(item.quantity * item.unitPrice, currency)}</p>
          <button type="button" onClick={() => onChange(items.filter((i) => i.id !== item.id))} aria-label="Supprimer la ligne" className="flex h-10 items-center justify-center rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-600">
            <Trash2 size={16} />
          </button>
        </div>
      ))}

      {errors.items && <p className="text-xs text-red-600">{errors.items}</p>}

      <div className="flex flex-wrap items-center gap-2 pt-1">
        <Button variant="secondary" size="sm" onClick={() => onChange([...items, blank()])}>
          <Plus size={14} /> Ajouter une ligne
        </Button>
        {products.length > 0 && (
          <select
            aria-label="Ajouter depuis le catalogue"
            value=""
            onChange={(e) => addProduct(e.target.value)}
            className="h-8 rounded-lg border border-slate-300 bg-white px-2 text-sm text-slate-700"
          >
            <option value="">Ajouter depuis le catalogue…</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>{p.name} - {formatCurrency(p.price, currency)}</option>
            ))}
          </select>
        )}
      </div>
    </div>
  );
}
