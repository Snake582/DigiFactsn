import Link from "next/link";
import { DigiFactLogo } from "@/components/brand/digifact-logo";
import { buttonClasses } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-5 p-6 text-center">
      <DigiFactLogo />
      <h1 className="text-3xl font-bold text-slate-900">Page introuvable</h1>
      <p className="max-w-sm text-slate-500">Cette page n'existe pas ou a été déplacée. Revenez à votre tableau de bord.</p>
      <Link href="/dashboard" className={buttonClasses({ size: "lg" })}>Ouvrir le tableau de bord</Link>
    </main>
  );
}
