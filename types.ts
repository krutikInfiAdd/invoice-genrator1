
export interface InvoiceItem {
  id: string;
  description: string;
  hsn?: string; // Harmonized System Nomenclature code
  quantity: number;
  price: number;
}

export type TaxType = 'standard' | 'cgst_sgst' | 'igst' | 'none';

export interface InvoiceDetails {
  logo: string | null;
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  billFrom: {
    name: string;
    email: string;
    address: string;
    gstin?: string; // GST Identification Number
  };
  billTo: {
    name: string;
    email: string;
    address: string;
    gstin?: string; // GST Identification Number
  };
  items: InvoiceItem[];
  notes: string;
  terms: string;
  currency: string;
  taxRate: number;
  taxType: TaxType; // Defines how tax is calculated/displayed
  amountPaid: number;
  discount: number;
}

export interface UserProfile {
  companyName: string;
  companyAddress: string;
  gstin?: string;
  logo?: string | null;
  defaultNotes?: string;
  defaultTerms?: string;
}