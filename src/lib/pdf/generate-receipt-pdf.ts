import type { Receipt } from "@/types/receipt.types";
import type { Client } from "@/types/client.types";
import type { Company } from "@/types/company.types";
import { PAYMENT_METHODS } from "@/features/receipts/services/receipt.service";
import { formatDate } from "@/lib/utils/format-date";
import { formatNumber } from "@/lib/utils/format-currency";
import { PDF_BLUE, PDF_DARK, PDF_GRAY, drawCompanyHeader, loadPdf } from "./pdf-common";

export async function generateReceiptPdf(
  receipt: Receipt,
  client: Client | undefined,
  company: Company,
  invoiceNumber?: string,
) {
  const { jsPDF } = await loadPdf();
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const width = doc.internal.pageSize.getWidth();

  const y = drawCompanyHeader(doc, company, "REÇU DE PAIEMENT", receipt.number);

  doc.setFillColor(244, 247, 255).roundedRect(15, y + 4, width - 30, 28, 3, 3, "F");
  doc.setFont("helvetica", "normal").setFontSize(10).setTextColor(...PDF_GRAY).text("Montant reçu", 22, y + 13);
  doc.setFont("helvetica", "bold").setFontSize(22).setTextColor(...PDF_BLUE);
  doc.text(`${formatNumber(receipt.amount)} ${company.currency}`, 22, y + 25);

  const rows: [string, string][] = [
    ["Reçu de", client?.name ?? "Client supprimé"],
    ["Date du paiement", formatDate(receipt.date)],
    ["Mode de paiement", PAYMENT_METHODS[receipt.method]],
    ["Facture liée", invoiceNumber ?? "-"],
    ["Référence", receipt.reference || "-"],
  ];
  rows.forEach(([label, value], i) => {
    const ry = y + 46 + i * 9;
    doc.setFont("helvetica", "normal").setFontSize(10).setTextColor(...PDF_GRAY).text(label, 15, ry);
    doc.setFont("helvetica", "bold").setTextColor(...PDF_DARK).text(value, 70, ry);
  });

  if (receipt.notes) {
    doc.setFont("helvetica", "normal").setFontSize(9).setTextColor(...PDF_GRAY);
    doc.text(doc.splitTextToSize(receipt.notes, width - 30), 15, y + 98);
  }

  doc.setDrawColor(...PDF_GRAY).line(width - 70, 250, width - 15, 250);
  doc.setFont("helvetica", "normal").setFontSize(9).setTextColor(...PDF_GRAY).text("Signature", width - 42, 255, { align: "center" });
  if (company.footerNote) doc.text(company.footerNote, width / 2, 285, { align: "center" });

  doc.save(`${receipt.number}.pdf`);
}
