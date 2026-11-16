"use client";

import Link from "next/link";
import { useState, type ChangeEvent, type FormEvent } from "react";
import type { Client, ClientInput } from "@/types/client.types";
import type { FieldErrors } from "@/types/common.types";
import { Button, buttonClasses } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { zodErrors } from "@/lib/utils/zod-errors";
import { clientSchema } from "../validations/client.schema";

interface ClientFormProps {
  client?: Client;
  onSubmit: (values: ClientInput) => void;
  cancelHref: string;
}

export function ClientForm({ client, onSubmit, cancelHref }: ClientFormProps) {
  const [values, setValues] = useState<ClientInput>({
    name: client?.name ?? "",
    company: client?.company ?? "",
    email: client?.email ?? "",
    phone: client?.phone ?? "",
    address: client?.address ?? "",
    city: client?.city ?? "",
    notes: client?.notes ?? "",
  });
  const [errors, setErrors] = useState<FieldErrors>({});

  const bind = (key: keyof ClientInput) => ({
    value: values[key],
    error: errors[key],
    onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setValues((s) => ({ ...s, [key]: e.target.value })),
  });

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const result = clientSchema.safeParse(values);
    if (!result.success) return setErrors(zodErrors(result.error));
    onSubmit(result.data);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <Input label="Nom du contact *" placeholder="Aminata Diop" {...bind("name")} />
        <Input label="Entreprise" placeholder="Teranga Services" {...bind("company")} />
        <Input label="Email" type="email" placeholder="contact@exemple.sn" {...bind("email")} />
        <Input label="Téléphone" placeholder="+221 77 000 00 00" {...bind("phone")} />
        <Input label="Adresse" {...bind("address")} />
        <Input label="Ville" {...bind("city")} />
      </div>
      <Textarea label="Notes" placeholder="Informations utiles sur ce client" {...bind("notes")} />
      <div className="flex flex-wrap justify-end gap-2 pt-2">
        <Link href={cancelHref} className={buttonClasses({ variant: "outline" })}>Annuler</Link>
        <Button type="submit">Enregistrer le client</Button>
      </div>
    </form>
  );
}
