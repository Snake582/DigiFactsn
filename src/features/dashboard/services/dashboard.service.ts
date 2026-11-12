import type { Invoice } from "@/types/invoice.types";
import { getDisplayStatus, invoiceTotal } from "@/features/invoices/services/invoice-calculator.service";

export interface DashboardStats {
  revenue: number;
  paid: number;
  pending: number;
  late: number;
  counts: { total: number; paid: number; pending: number; late: number };
}

export function computeStats(invoices: Invoice[]): DashboardStats {
  const stats: DashboardStats = { revenue: 0, paid: 0, pending: 0, late: 0, counts: { total: 0, paid: 0, pending: 0, late: 0 } };
  for (const invoice of invoices) {
    const status = getDisplayStatus(invoice);
    if (status === "brouillon" || status === "annulee") continue;
    const total = invoiceTotal(invoice);
    stats.revenue += total;
    stats.counts.total += 1;
    if (status === "payee") { stats.paid += total; stats.counts.paid += 1; }
    else if (status === "en_attente") { stats.pending += total; stats.counts.pending += 1; }
    else if (status === "en_retard") { stats.late += total; stats.counts.late += 1; }
  }
  return stats;
}

export function monthlyRevenue(invoices: Invoice[], months = 6) {
  const now = new Date();
  return Array.from({ length: months }, (_, index) => {
    const date = new Date(now.getFullYear(), now.getMonth() - (months - 1 - index), 1);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    const value = invoices
      .filter((i) => i.issueDate.startsWith(key) && i.status !== "brouillon" && i.status !== "annulee")
      .reduce((sum, i) => sum + invoiceTotal(i), 0);
    return { label: date.toLocaleDateString("fr-FR", { month: "short" }).replace(".", ""), value };
  });
}
