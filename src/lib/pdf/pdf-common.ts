import type { jsPDF } from "jspdf";
import type { Company } from "@/types/company.types";

export const PDF_BLUE: [number, number, number] = [21, 83, 245];
export const PDF_DARK: [number, number, number] = [15, 23, 42];
export const PDF_GRAY: [number, number, number] = [100, 116, 139];

export async function loadPdf() {
  const [{ jsPDF }, { default: autoTable }] = await Promise.all([import("jspdf"), import("jspdf-autotable")]);
  return { jsPDF, autoTable };
}

export function lastTableY(doc: jsPDF) {
  return (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY;
}

/** Bandeau bleu + bloc entreprise. Retourne la position Y suivante. */
export function drawCompanyHeader(doc: jsPDF, company: Company, title: string, number: string) {
  const width = doc.internal.pageSize.getWidth();
  doc.setFillColor(...PDF_BLUE);
  doc.rect(0, 0, width, 6, "F");

  doc.setFont("helvetica", "bold").setFontSize(18).setTextColor(...PDF_BLUE);
  doc.text(company.name || "Mon entreprise", 15, 22);

  doc.setFont("helvetica", "normal").setFontSize(9).setTextColor(...PDF_GRAY);
  const lines = [
    company.address,
    company.city,
    company.phone && `Tél : ${company.phone}`,
    company.email,
    company.taxId && `N° fiscal : ${company.taxId}`,
  ].filter(Boolean) as string[];
  lines.forEach((line, i) => doc.text(line, 15, 29 + i * 4.5));

  doc.setFont("helvetica", "bold").setFontSize(22).setTextColor(...PDF_DARK);
  doc.text(title, width - 15, 22, { align: "right" });
  doc.setFont("helvetica", "normal").setFontSize(10).setTextColor(...PDF_GRAY);
  doc.text(number, width - 15, 29, { align: "right" });

  return 29 + Math.max(lines.length, 1) * 4.5 + 8;
}
