import type { Invoice } from "@/types/invoice.types";
import type { Client } from "@/types/client.types";
import type { Company } from "@/types/company.types";
import { computeTotals } from "@/features/invoices/services/invoice-calculator.service";
import { formatDate } from "@/lib/utils/format-date";
import { formatNumber } from "@/lib/utils/format-currency";
import { PDF_BLUE, PDF_DARK, PDF_GRAY, drawCompanyHeader, lastTableY, loadPdf } from "./pdf-common";

export async function generateInvoicePdf(invoice: Invoice, client: Client | undefined, company: Company) {
  const { jsPDF, autoTable } = await loadPdf();
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const width = doc.internal.pageSize.getWidth();
  const totals = computeTotals(invoice.items, invoice.taxRate, invoice.discount);
  const cur = company.currency;

  let y = drawCompanyHeader(doc, company, "FACTURE", invoice.number);

  // Client + dates
  doc.setFont("helvetica", "bold").setFontSize(9).setTextColor(...PDF_GRAY).text("Facturé à", 15, y);
  doc.setFont("helvetica", "bold").setFontSize(11).setTextColor(...PDF_DARK).text(client?.name ?? "Client supprimé", 15, y + 6);
  doc.setFont("helvetica", "normal").setFontSize(9).setTextColor(...PDF_GRAY);
  [client?.company, client?.address, client?.city, client?.phone, client?.email]
    .filter(Boolean)
    .forEach((line, i) => doc.text(line as string, 15, y + 11 + i * 4.5));

  doc.setFontSize(9).setTextColor(...PDF_GRAY);
  doc.text("Date d'émission", width - 60, y);
  doc.text("Échéance", width - 60, y + 6);
  doc.setTextColor(...PDF_DARK);
  doc.text(formatDate(invoice.issueDate), width - 15, y, { align: "right" });
  doc.text(formatDate(invoice.dueDate), width - 15, y + 6, { align: "right" });

  autoTable(doc, {
    startY: y + 36,
    head: [["Description", "Qté", `Prix unitaire (${cur})`, `Total (${cur})`]],
    body: invoice.items.map((i) => [
      i.description,
      formatNumber(i.quantity),
      formatNumber(i.unitPrice),
      formatNumber(i.quantity * i.unitPrice),
    ]),
    headStyles: { fillColor: PDF_BLUE, textColor: 255, fontStyle: "bold" },
    styles: { fontSize: 9, cellPadding: 3 },
    columnStyles: { 1: { halign: "right" }, 2: { halign: "right" }, 3: { halign: "right" } },
    alternateRowStyles: { fillColor: [244, 247, 255] },
    margin: { left: 15, right: 15 },
  });

  // Totaux
  let ty = lastTableY(doc) + 8;
  const row = (label: string, value: string) => {
    doc.setFont("helvetica", "normal").setFontSize(10).setTextColor(...PDF_GRAY).text(label, width - 85, ty);
    doc.setTextColor(...PDF_DARK).text(value, width - 15, ty, { align: "right" });
    ty += 6;
  };
  row("Sous-total", `${formatNumber(totals.subtotal)} ${cur}`);
  if (invoice.discount > 0) row(`Remise (${invoice.discount} %)`, `- ${formatNumber(totals.discountAmount)} ${cur}`);
  row(`TVA (${invoice.taxRate} %)`, `${formatNumber(totals.taxAmount)} ${cur}`);
  ty += 1;
  doc.setFillColor(...PDF_BLUE).roundedRect(width - 90, ty - 5, 75, 11, 2, 2, "F");
  doc.setFont("helvetica", "bold").setFontSize(11).setTextColor(255, 255, 255);
  doc.text("Total TTC", width - 86, ty + 2);
  doc.text(`${formatNumber(totals.total)} ${cur}`, width - 19, ty + 2, { align: "right" });

  // Notes + pied de page
  if (invoice.notes) {
    doc.setFont("helvetica", "bold").setFontSize(9).setTextColor(...PDF_DARK).text("Notes", 15, ty + 16);
    doc.setFont("helvetica", "normal").setTextColor(...PDF_GRAY).text(doc.splitTextToSize(invoice.notes, width - 30), 15, ty + 21);
  }
  if (company.footerNote) {
    doc.setFont("helvetica", "italic").setFontSize(9).setTextColor(...PDF_GRAY);
    doc.text(company.footerNote, width / 2, 285, { align: "center" });
  }

  doc.save(`${invoice.number}.pdf`);
}
