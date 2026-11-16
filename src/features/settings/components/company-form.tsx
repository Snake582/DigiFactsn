"use client";

import { useState, type FormEvent } from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { Input, Textarea } from "@/components/ui/input";
import type { Company } from "@/types/company.types";
import { useCompany } from "../hooks/use-company";

function CompanyFormInner({ initial, onSave }: { initial: Company; onSave: (c: Company) => void }) {
  const [v, setV] = useState<Company>(initial);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const text = (key: keyof Company) => ({
    value: String(v[key]),
    onChange: (e: { target: { value: string } }) => { setSaved(false); setV((s) => ({ ...s, [key]: e.target.value })); },
  });
  const num = (key: keyof Company) => ({
    value: Number(v[key]),
    type: "number" as const,
    min: 0,
    step: "any",
    onChange: (e: { target: { value: string } }) => { setSaved(false); setV((s) => ({ ...s, [key]: Number(e.target.value) })); },
  });

  function submit(e: FormEvent) {
    e.preventDefault();
    if (!v.name.trim()) return setError("Le nom de l'entreprise est obligatoire pour vos documents.");
    setError("");
    onSave({ ...v, name: v.name.trim(), currency: v.currency.trim() || "FCFA" });
    setSaved(true);
  }

  return (
    <form onSubmit={submit} className="space-y-6" noValidate>
      <Card>
        <CardTitle>Informations de l'entreprise</CardTitle>
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="Nom de l'entreprise *" error={error} {...text("name")} />
          <Input label="N° fiscal (NINEA, RC…)" {...text("taxId")} />
          <Input label="Email" type="email" {...text("email")} />
          <Input label="Téléphone" {...text("phone")} />
          <Input label="Adresse" {...text("address")} />
          <Input label="Ville" {...text("city")} />
        </div>
      </Card>
      <Card>
        <CardTitle>Facturation</CardTitle>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Input label="Devise" hint="Ex. : FCFA, EUR, USD" {...text("currency")} />
          <Input label="TVA par défaut (%)" {...num("defaultTaxRate")} />
          <Input label="Délai de paiement (jours)" {...num("paymentTermDays")} />
          <Input label="Préfixe des factures" {...text("invoicePrefix")} />
          <Input label="Préfixe des reçus" {...text("receiptPrefix")} />
        </div>
        <div className="mt-4">
          <Textarea label="Message en bas des documents" {...text("footerNote")} />
        </div>
      </Card>
      <div className="flex flex-wrap items-center justify-end gap-3">
        {saved && <span className="flex items-center gap-1 text-sm font-medium text-emerald-600"><Check size={16} /> Paramètres enregistrés</span>}
        <Button type="submit">Enregistrer</Button>
      </div>
    </form>
  );
}

export function CompanyForm() {
  const { company, ready, save } = useCompany();
  if (!ready) return null;
  return <CompanyFormInner initial={company} onSave={save} />;
}
