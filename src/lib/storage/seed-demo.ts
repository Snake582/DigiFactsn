import type { Client } from "@/types/client.types";
import type { Product } from "@/types/product.types";
import type { Invoice, InvoiceStatus } from "@/types/invoice.types";
import type { Receipt } from "@/types/receipt.types";
import { storage } from "./storage";
import { STORAGE_KEYS } from "./storage-keys";
import { generateId, nextDocumentNumber } from "@/lib/utils/generate-id";
import { addDays } from "@/lib/utils/format-date";
import { computeTotals } from "@/features/invoices/services/invoice-calculator.service";
import { settingsService } from "@/features/settings/services/settings.service";

const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000).toLocaleDateString("en-CA");

/** Remplace les données actuelles par un petit jeu d'exemple. */
export function seedDemoData() {
  const now = new Date().toISOString();
  const base = () => ({ id: generateId(), createdAt: now, updatedAt: now });

  const clients: Client[] = [
    { ...base(), name: "Aminata Diop", company: "Teranga Services", email: "aminata@teranga.sn", phone: "+221 77 100 20 30", address: "12 rue de Thiong", city: "Dakar", notes: "" },
    { ...base(), name: "Moussa Ndiaye", company: "Baobab Market", email: "moussa@baobab.sn", phone: "+221 78 200 30 40", address: "Avenue Malick Sy", city: "Thiès", notes: "" },
    { ...base(), name: "Fatou Sow", company: "Sahel Digital", email: "fatou@sahel.sn", phone: "+221 76 300 40 50", address: "Quartier Sor", city: "Saint-Louis", notes: "Paiement par Wave" },
  ];
  const products: Product[] = [
    { ...base(), name: "Site vitrine", description: "Création d'un site de 5 pages", price: 350000, unit: "forfait", type: "service" },
    { ...base(), name: "Maintenance mensuelle", description: "Mises à jour et support", price: 50000, unit: "mois", type: "service" },
    { ...base(), name: "Hébergement annuel", description: "Nom de domaine + hébergement", price: 75000, unit: "an", type: "service" },
    { ...base(), name: "Formation", description: "Journée de formation", price: 120000, unit: "jour", type: "service" },
    { ...base(), name: "Cartes de visite", description: "Lot de 100 cartes", price: 15000, unit: "lot", type: "produit" },
  ];

  const specs: { client: number; items: [number, number][]; ago: number; status: InvoiceStatus }[] = [
    { client: 0, items: [[0, 1], [2, 1]], ago: 150, status: "payee" },
    { client: 1, items: [[1, 3]], ago: 120, status: "payee" },
    { client: 2, items: [[3, 2]], ago: 90, status: "payee" },
    { client: 0, items: [[1, 2], [4, 2]], ago: 60, status: "payee" },
    { client: 1, items: [[3, 1], [4, 3]], ago: 45, status: "en_attente" },
    { client: 2, items: [[0, 1]], ago: 5, status: "en_attente" },
    { client: 0, items: [[1, 1]], ago: 1, status: "brouillon" },
  ];

  const { invoicePrefix, receiptPrefix } = settingsService.get();
  const invoices: Invoice[] = [];
  const receipts: Receipt[] = [];

  for (const spec of specs) {
    const issueDate = daysAgo(spec.ago);
    const items = spec.items.map(([p, quantity]) => ({
      id: generateId(),
      productId: products[p].id,
      description: products[p].name,
      quantity,
      unitPrice: products[p].price,
    }));
    const invoice: Invoice = {
      ...base(),
      number: nextDocumentNumber(invoicePrefix, invoices.map((i) => i.number), Number(issueDate.slice(0, 4))),
      clientId: clients[spec.client].id,
      issueDate,
      dueDate: addDays(issueDate, 30),
      items,
      taxRate: 18,
      discount: 0,
      status: spec.status,
      notes: "",
    };
    invoices.push(invoice);

    if (spec.status === "payee") {
      receipts.push({
        ...base(),
        number: nextDocumentNumber(receiptPrefix, receipts.map((r) => r.number), Number(issueDate.slice(0, 4))),
        clientId: invoice.clientId,
        invoiceId: invoice.id,
        date: addDays(issueDate, 10),
        amount: computeTotals(items, 18, 0).total,
        method: "mobile_money",
        reference: "",
        notes: "",
      });
    }
  }

  storage.set(STORAGE_KEYS.clients, clients);
  storage.set(STORAGE_KEYS.products, products);
  storage.set(STORAGE_KEYS.invoices, invoices);
  storage.set(STORAGE_KEYS.receipts, receipts);
}
