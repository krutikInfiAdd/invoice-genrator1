
export interface InvoiceItem {
  id: string;
  description: string;
  hsn?: string;
  quantity: number;
  unit: string; // Added: e.g., Pcs, Qty, Box
  price: number;
  discountRate: number; // Added: percentage per item
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
    phone?: string; // Added
    gstin?: string;
    state?: string; // Added
  };
  billTo: {
    name: string;
    email: string;
    address: string;
    phone?: string; // Added
    gstin?: string;
  };
  items: InvoiceItem[];
  notes: string;
  terms: string;
  currency: string;
  taxRate: number;
  taxType: TaxType;
  amountPaid: number; // This acts as "Received"
  discount: number; // Global discount
}

export interface UserProfile {
  companyName: string;
  companyAddress: string;
  phone?: string;
  gstin?: string;
  state?: string;
  logo?: string | null;
  defaultNotes?: string;
  defaultTerms?: string;
}
