"use client";

import Link from "next/link";
import { AlertTriangle, CheckCircle2, Clock, TrendingUp } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardTitle } from "@/components/ui/card";
import { useClients } from "@/features/clients/hooks/use-clients";
import { QuickActions } from "@/features/dashboard/components/quick-actions";
import { RecentInvoices } from "@/features/dashboard/components/recent-invoices";
import { RevenueChart } from "@/features/dashboard/components/revenue-chart";
import { StatsCard } from "@/features/dashboard/components/stats-card";
import { computeStats, monthlyRevenue } from "@/features/dashboard/services/dashboard.service";
import { useInvoices } from "@/features/invoices/hooks/use-invoices";
import { useCompany } from "@/features/settings/hooks/use-company";
import { buttonClasses } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils/format-currency";

export default function DashboardPage() {
  const { invoices, ready } = useInvoices();
  const { clients } = useClients();
  const { company } = useCompany();

  if (!ready) return null;

  const stats = computeStats(invoices);
  const money = (n: number) => formatCurrency(n, company.currency);
  const plural = (n: number) => `${n} facture${n > 1 ? "s" : ""}`;

  return (
    <>
      <PageHeader
        title="Tableau de bord"
        description={company.name ? `Vue d'ensemble de l'activité de ${company.name}` : "Vue d'ensemble de votre activité"}
        actions={!company.name && <Link href="/parametres" className={buttonClasses({ variant: "outline" })}>Renseigner mon entreprise</Link>}
      />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatsCard label="Chiffre d'affaires" value={money(stats.revenue)} hint={plural(stats.counts.total)} icon={TrendingUp} tone="blue" />
        <StatsCard label="Factures payées" value={money(stats.paid)} hint={plural(stats.counts.paid)} icon={CheckCircle2} tone="green" />
        <StatsCard label="En attente" value={money(stats.pending)} hint={plural(stats.counts.pending)} icon={Clock} tone="orange" />
        <StatsCard label="En retard" value={money(stats.late)} hint={plural(stats.counts.late)} icon={AlertTriangle} tone="red" />
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardTitle>Évolution des revenus</CardTitle>
          <RevenueChart data={monthlyRevenue(invoices)} currency={company.currency} />
        </Card>
        <QuickActions />
      </div>
      <div className="mt-6">
        <RecentInvoices invoices={invoices} clients={clients} currency={company.currency} />
      </div>
    </>
  );
}
