import Link from "next/link";
import {
  ArrowRight, BarChart3, Briefcase, Calculator, Check, FileDown, Package, Rocket, ShieldCheck, MonitorSmartphone, Users, Zap,
} from "lucide-react";
import { DigiFactLogo } from "@/components/brand/digifact-logo";
import { LandingMobileNav } from "@/components/layout/landing-mobile-nav";
import { HeroMockup } from "@/components/brand/hero-mockup";
import { buttonClasses } from "@/components/ui/button";

const navLinks = [
  ["Accueil", "#accueil"],
  ["Fonctionnalités", "#fonctionnalites"],
  ["Avantages", "#avantages"],
  ["FAQ", "#faq"],
  ["Contact", "#contact"],
];

const checks = ["Sans inscription", "100 % gratuit", "Stockage local", "Génération PDF"];

const features = [
  { icon: Zap, title: "Création rapide", text: "Générez vos factures en quelques clics." },
  { icon: Calculator, title: "Calcul automatique", text: "TVA, totaux et remises calculés pour vous." },
  { icon: FileDown, title: "Export PDF", text: "Téléchargez vos factures et reçus au format PDF." },
  { icon: ShieldCheck, title: "Sécurité garantie", text: "Vos données restent sur votre appareil." },
  { icon: MonitorSmartphone, title: "Compatible partout", text: "Ordinateur, tablette et mobile." },
];

const benefits = [
  { icon: BarChart3, title: "Suivez votre activité", text: "Visualisez vos revenus et l'état de vos factures en un coup d'œil.", tone: "bg-brand-100 text-brand-600" },
  { icon: Users, title: "Gérez vos clients", text: "Gardez une base clients organisée et facilement accessible.", tone: "bg-violet-100 text-violet-600" },
  { icon: Package, title: "Organisez vos produits", text: "Ajoutez vos produits et services avec leurs prix.", tone: "bg-emerald-100 text-emerald-600" },
  { icon: Briefcase, title: "Développez votre business", text: "Concentrez-vous sur l'essentiel, DigiFact s'occupe du reste.", tone: "bg-orange-100 text-orange-600" },
];

const faqs = [
  ["Où sont enregistrées mes données ?", "Dans le stockage local de votre navigateur. Rien n'est envoyé sur un serveur : vos clients, factures et reçus restent sur votre appareil."],
  ["Dois-je créer un compte ?", "Non. Ouvrez DigiFact, renseignez les informations de votre entreprise et créez votre première facture."],
  ["Comment ne pas perdre mes données ?", "Dans Paramètres, téléchargez une sauvegarde au format JSON. Vous pouvez la restaurer à tout moment, sur ce navigateur ou un autre."],
  ["Puis-je utiliser une autre devise que le FCFA ?", "Oui. La devise, la TVA par défaut et les préfixes de numérotation se règlent dans les paramètres."],
  ["Comment obtenir le PDF d'une facture ?", "Ouvrez la facture puis cliquez sur « Télécharger le PDF ». Le fichier est généré directement sur votre appareil."],
];

export default function HomePage() {
  return (
    <div className="bg-linear-to-b from-brand-50 via-white to-white">
      <header className="sticky top-0 z-40 border-b border-brand-100/60 bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-2 px-4 sm:h-20 sm:gap-4 sm:px-6">
          <Link href="/" aria-label="DigiFact, accueil"><DigiFactLogo showTagline /></Link>
          <nav className="hidden items-center gap-1 lg:flex" aria-label="Sections de la page">
            {navLinks.map(([label, href], i) => (
              <a key={href} href={href} className={i === 0 ? "rounded-full bg-brand-600 px-5 py-2 text-sm font-semibold text-white" : "rounded-full px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-brand-50"}>{label}</a>
            ))}
          </nav>
          <div className="flex items-center gap-1 sm:gap-2">
            <Link href="/login" className={buttonClasses({ size: "md", className: "rounded-full" })}>
              <span className="hidden sm:inline">Commencer gratuitement</span><span className="sm:hidden">Commencer</span> <ArrowRight size={16} />
            </Link>
            <LandingMobileNav links={navLinks} />
          </div>
        </div>
      </header>

      <main>
        <section id="accueil" className="mx-auto grid max-w-7xl items-center gap-12 px-4 pb-16 pt-8 sm:gap-14 sm:px-6 lg:grid-cols-2 lg:pt-16">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full bg-brand-100 px-4 py-2 text-sm font-semibold text-brand-700">
              <Zap size={16} /> Solution 100 % frontend
            </p>
            <h1 className="mt-5 text-5xl font-extrabold tracking-tight text-brand-900 sm:mt-6 sm:text-6xl">
              Digi<span className="text-brand-600">Fact</span>
            </h1>
            <p className="mt-2 text-2xl font-bold tracking-tight text-brand-900 sm:text-4xl">Votre facturation, simplifiée.</p>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-slate-600 sm:mt-6 sm:text-lg">
              Créez, gérez et suivez vos factures en toute simplicité avec une solution moderne, rapide et professionnelle.
            </p>
            <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2">
              {checks.map((c) => (
                <li key={c} className="flex items-center gap-2 text-sm font-medium text-slate-700">
                  <span className="flex size-5 items-center justify-center rounded-full bg-brand-600 text-white"><Check size={12} strokeWidth={3} /></span>{c}
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/login" className={buttonClasses({ size: "lg", className: "w-full sm:w-auto" })}><Rocket size={18} /> Commencer maintenant <ArrowRight size={16} /></Link>
            </div>
          </div>
          <HeroMockup />
        </section>

        <section id="fonctionnalites" className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid divide-y divide-slate-200 rounded-3xl bg-brand-50/70 p-4 sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-5 lg:divide-x">
            {features.map(({ icon: Icon, title, text }) => (
              <div key={title} className="flex flex-col items-center px-4 py-5 text-center">
                <Icon size={30} className="text-brand-600" />
                <h2 className="mt-3 text-base font-bold text-slate-900">{title}</h2>
                <p className="mt-1 text-sm text-slate-500">{text}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="avantages" className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20">
          <div className="text-center">
            <p className="text-sm font-bold text-brand-600">Pourquoi choisir DigiFact ?</p>
            <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-brand-900 sm:text-4xl">Une solution complète pour votre activité</h2>
            <p className="mt-3 text-slate-600">DigiFact vous accompagne au quotidien dans la gestion de votre facturation.</p>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {benefits.map(({ icon: Icon, title, text, tone }) => (
              <div key={title} className="flex min-w-0 gap-4 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
                <div className={`flex size-14 shrink-0 items-center justify-center rounded-full ${tone}`}><Icon size={26} /></div>
                <div>
                  <h3 className="font-bold text-slate-900">{title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-slate-500">{text}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="faq" className="mx-auto max-w-3xl px-4 pb-14 sm:px-6 sm:pb-20">
          <h2 className="text-center text-3xl font-extrabold tracking-tight text-brand-900">Questions fréquentes</h2>
          <div className="mt-8 space-y-3">
            {faqs.map(([q, a]) => (
              <details key={q} className="group rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
                <summary className="cursor-pointer list-none font-semibold text-slate-900 marker:hidden">{q}</summary>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">{a}</p>
              </details>
            ))}
          </div>
        </section>

        <section id="contact" className="bg-brand-900 px-4 py-14 text-center text-white sm:px-6 sm:py-16">
          <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">Prêt à facturer plus simplement ?</h2>
          <p className="mx-auto mt-3 max-w-md text-slate-300">Aucune inscription, aucun serveur : ouvrez DigiFact et créez votre première facture.</p>
          <Link href="/login" className={buttonClasses({ size: "lg", className: "mt-8 hover:bg-white hover:text-brand-500" })}>Commencer gratuitement</Link>
          <p className="mt-8 break-words text-sm text-slate-400">Une question ? Écrivez-nous : <a href="mailto:digifactsn@gmail.com" className="underline">digifactsn@gmail.com</a></p>
        </section>
      </main>
    </div>
  );
}
