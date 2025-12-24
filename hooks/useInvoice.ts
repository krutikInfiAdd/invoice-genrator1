
import { useState, useMemo } from 'react';
import type { InvoiceDetails, InvoiceItem, TaxType, UserProfile } from '../types';

const getTodayDate = () => new Date().toISOString().split('T')[0];

const getInitialDetails = (type: 'invoice' | 'quotation'): Omit<InvoiceDetails, 'logo'> => ({
  invoiceNumber: type === 'invoice' ? '1' : '1',
  issueDate: getTodayDate(),
  dueDate: getTodayDate(),
  billFrom: {
    name: '',
    email: '',
    address: '',
    phone: '',
    gstin: '',
    state: '',
  },
  billTo: {
    name: '',
    email: '',
    address: '',
    phone: '',
    gstin: '',
  },
  items: [
    { id: crypto.randomUUID(), description: '', hsn: '', quantity: 1, unit: 'Qty', price: 0, discountRate: 0 },
  ],
  notes: '',
  terms: 'Thank you for doing business with us.',
  currency: 'INR',
  taxRate: 0,
  taxType: 'none',
  amountPaid: 0,
  discount: 0,
});

type InvoiceErrors = {
  [key: string]: string;
};

export const useInvoice = (type: 'invoice' | 'quotation' = 'invoice') => {
  const [details, setDetails] = useState<InvoiceDetails>(() => {
    const savedLogo = typeof window !== 'undefined' ? localStorage.getItem('invoiceLogo') : null;
    return {
      ...getInitialDetails(type),
      logo: savedLogo,
    };
  });
  const [errors, setErrors] = useState<InvoiceErrors>({});

  const updateLogo = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      if (typeof window !== 'undefined') {
        localStorage.setItem('invoiceLogo', base64String);
      }
      setDetails(prev => ({ ...prev, logo: base64String }));
    };
    reader.readAsDataURL(file);
  };

  const removeLogo = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('invoiceLogo');
    }
    setDetails(prev => ({ ...prev, logo: null }));
  };

  const updateDetail = <K extends keyof InvoiceDetails>(key: K, value: InvoiceDetails[K]) => {
    setDetails(prev => ({ ...prev, [key]: value }));
  };

  const updateContact = (party: 'billFrom' | 'billTo', field: string, value: string) => {
    setDetails(prev => ({
      ...prev,
      [party]: {
        ...prev[party],
        [field]: value
      }
    }));
  };

  const addItem = () => {
    const newItem: InvoiceItem = {
      id: crypto.randomUUID(),
      description: '',
      hsn: '',
      quantity: 1,
      unit: 'Qty',
      price: 0,
      discountRate: 0,
    };
    setDetails(prev => ({ ...prev, items: [...prev.items, newItem] }));
  };

  const updateItem = (id: string, field: keyof Omit<InvoiceItem, 'id'>, value: string | number) => {
    setDetails(prev => ({
      ...prev,
      items: prev.items.map(item => 
        item.id === id ? { ...item, [field]: value } : item
      )
    }));
  };

  const removeItem = (id: string) => {
    setDetails(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== id)
    }));
  };

  const loadDetails = (newDetails: InvoiceDetails) => {
    setDetails({ ...newDetails });
  };

  const prefillUserProfile = (profile: UserProfile, email: string) => {
    setDetails(prev => ({
      ...prev,
      logo: profile.logo || prev.logo,
      billFrom: {
        ...prev.billFrom,
        name: profile.companyName || prev.billFrom.name,
        address: profile.companyAddress || prev.billFrom.address,
        gstin: profile.gstin || prev.billFrom.gstin,
        phone: profile.phone || prev.billFrom.phone,
        state: profile.state || prev.billFrom.state,
        email: email || prev.billFrom.email
      }
    }));
  };

  const validate = (): boolean => {
    const newErrors: InvoiceErrors = {};
    if (!details.billFrom.name.trim()) newErrors['billFrom.name'] = 'Required';
    if (!details.billTo.name.trim()) newErrors['billTo.name'] = 'Required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculations = useMemo(() => {
    let subtotalBeforeItemDiscounts = 0;
    let totalItemDiscounts = 0;
    let totalQuantity = 0;

    details.items.forEach(item => {
      const lineTotal = item.quantity * item.price;
      const lineDiscount = (lineTotal * (item.discountRate || 0)) / 100;
      subtotalBeforeItemDiscounts += lineTotal;
      totalItemDiscounts += lineDiscount;
      totalQuantity += item.quantity;
    });

    const subtotal = subtotalBeforeItemDiscounts - totalItemDiscounts;
    const globalDiscountAmount = (subtotal * (details.discount || 0)) / 100;
    const finalSubtotal = subtotal - globalDiscountAmount;
    
    let taxAmount = 0;
    if (details.taxType !== 'none') {
      taxAmount = (finalSubtotal * details.taxRate) / 100;
    }
    
    const total = finalSubtotal + taxAmount;
    const balanceDue = total - (details.amountPaid || 0);
    
    return { 
      subtotal: subtotalBeforeItemDiscounts, 
      totalItemDiscounts: totalItemDiscounts + globalDiscountAmount, 
      taxAmount, 
      total, 
      balanceDue,
      totalQuantity
    };
  }, [details.items, details.taxRate, details.discount, details.amountPaid, details.taxType]);
  
  return {
    details,
    updateDetail,
    updateContact,
    addItem,
    updateItem,
    removeItem,
    calculations,
    updateLogo,
    removeLogo,
    errors,
    validate,
    loadDetails,
    prefillUserProfile
  };
};
