export interface Company {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  taxId: string; // NINEA / RC / n° fiscal
  currency: string;
  defaultTaxRate: number;
  invoicePrefix: string;
  receiptPrefix: string;
  paymentTermDays: number;
  footerNote: string;
}
