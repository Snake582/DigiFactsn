import { Badge, type BadgeTone } from "@/components/ui/badge";
import type { DisplayStatus, Invoice, InvoiceStatus } from "@/types/invoice.types";
import { getDisplayStatus } from "../services/invoice-calculator.service";

export const STATUS_LABELS: Record<DisplayStatus, string> = {
  brouillon: "Brouillon",
  en_attente: "En attente",
  payee: "Payée",
  en_retard: "En retard",
  annulee: "Annulée",
};

const TONES: Record<DisplayStatus, BadgeTone> = {
  brouillon: "gray",
  en_attente: "orange",
  payee: "green",
  en_retard: "red",
  annulee: "gray",
};

export const EDITABLE_STATUSES: InvoiceStatus[] = ["brouillon", "en_attente", "payee", "annulee"];

export function InvoiceStatusBadge({ invoice }: { invoice: Pick<Invoice, "status" | "dueDate"> }) {
  const status = getDisplayStatus(invoice);
  return <Badge tone={TONES[status]}>{STATUS_LABELS[status]}</Badge>;
}
