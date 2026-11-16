"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { DigiFactLogo } from "@/components/brand/digifact-logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { settingsService } from "@/features/settings/services/settings.service";

/** DigiFact n'a pas de compte : cette page sert d'accueil pour nommer son entreprise. */
export default function LoginPage() {
  const router = useRouter();
  const [name, setName] = useState(() => settingsService.get().name);

  function submit(e: FormEvent) {
    e.preventDefault();
    const company = settingsService.get();
    if (name.trim()) settingsService.save({ ...company, name: name.trim() });
    router.push("/dashboard");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-linear-to-b from-brand-50 to-white p-6">
      <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-xl sm:p-8 ring-1 ring-slate-100">
        <Link href="/" aria-label="Retour à l'accueil"><DigiFactLogo /></Link>
        <h1 className="mt-8 text-2xl font-bold text-slate-900">Bienvenue sur DigiFact</h1>
        <p className="mt-2 text-sm text-slate-500">
          Pas de compte à créer. Vos données restent enregistrées dans ce navigateur.
        </p>
        <form onSubmit={submit} className="mt-6 space-y-4">
          <Input label="Nom de votre entreprise" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ma Société SARL" hint="Vous pourrez le modifier plus tard dans les paramètres." autoFocus />
          <Button type="submit" size="lg" className="w-full">Accéder à mon espace</Button>
        </form>
      </div>
    </main>
  );
}
