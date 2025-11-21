
import { useState, useMemo } from 'react';
import type { InvoiceDetails, InvoiceItem, TaxType, UserProfile } from '../types';

const getTodayDate = () => new Date().toISOString().split('T')[0];

const getInitialDetails = (type: 'invoice' | 'quotation'): Omit<InvoiceDetails, 'logo'> => ({
  invoiceNumber: type === 'invoice' ? 'INV-001' : 'QTN-001',
  issueDate: getTodayDate(),
  dueDate: getTodayDate(),
  billFrom: {
    name: '',
    email: '',
    address: '',
    gstin: '',
  },
  billTo: {
    name: '',
    email: '',
    address: '',
    gstin: '',
  },
  items: [
    { id: crypto.randomUUID(), description: '', hsn: '', quantity: 1, price: 0 },
  ],
  notes: '',
  terms: '',
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
      price: 0,
    };
    setDetails(prev => {
      const newItems = [...prev.items, newItem];
      
      // Auto-select 'none' if no HSNs exist across all items
      const hasAnyHSN = newItems.some(item => item.hsn && item.hsn.trim() !== '');
      let newTaxType = prev.taxType;
      if (!hasAnyHSN) {
        newTaxType = 'none';
      }

      return { ...prev, items: newItems, taxType: newTaxType };
    });
  };

  const updateItem = (id: string, field: keyof Omit<InvoiceItem, 'id'>, value: string | number) => {
    setDetails(prev => {
      const newItems = prev.items.map(item => 
        item.id === id ? { ...item, [field]: value } : item
      );

      let newTaxType = prev.taxType;

      // Auto-switch tax logic: check HSN availability when HSN field is updated
      if (field === 'hsn') {
        const hasAnyHSN = newItems.some(item => item.hsn && item.hsn.trim() !== '');
        
        if (!hasAnyHSN) {
          // If no items have HSN, auto-select 'none'
          newTaxType = 'none';
        } else if (prev.taxType === 'none') {
          // If HSN is added and tax was none, auto-select 'standard'
          newTaxType = 'standard';
        }
      }

      return {
        ...prev,
        items: newItems,
        taxType: newTaxType
      };
    });
  };

  const removeItem = (id: string) => {
    setDetails(prev => {
      const newItems = prev.items.filter(item => item.id !== id);
      
      let newTaxType = prev.taxType;
      // If we are removing an item and currently have tax enabled, check if we still have HSNs
      // Only enforce 'none' if we run out of HSNs.
      const hasAnyHSN = newItems.some(item => item.hsn && item.hsn.trim() !== '');
      if (!hasAnyHSN) {
        newTaxType = 'none';
      }

      return {
        ...prev,
        items: newItems,
        taxType: newTaxType
      };
    });
  };

  const loadDetails = (newDetails: InvoiceDetails) => {
    const defaults = getInitialDetails(type);
    setDetails({
      ...defaults,
      ...newDetails,
      billFrom: { ...defaults.billFrom, ...newDetails.billFrom },
      billTo: { ...defaults.billTo, ...newDetails.billTo },
      items: newDetails.items || defaults.items,
      logo: newDetails.logo || null
    });
  };

  const prefillUserProfile = (profile: UserProfile, email: string) => {
    setDetails(prev => ({
      ...prev,
      logo: profile.logo || prev.logo,
      notes: profile.defaultNotes ?? prev.notes,
      terms: profile.defaultTerms ?? prev.terms,
      billFrom: {
        ...prev.billFrom,
        name: profile.companyName || prev.billFrom.name,
        address: profile.companyAddress || prev.billFrom.address,
        gstin: profile.gstin || prev.billFrom.gstin,
        email: email || prev.billFrom.email
      }
    }));
  };

  const validate = (): boolean => {
    const newErrors: InvoiceErrors = {};
    const emailRegex = /\S+@\S+\.\S+/;

    if (!details.invoiceNumber.trim()) newErrors.invoiceNumber = 'Number is required.';
    if (!details.issueDate) newErrors.issueDate = 'Issue date is required.';
    if (!details.dueDate) newErrors.dueDate = 'Due date is required.';

    if (!details.billFrom.name.trim()) newErrors['billFrom.name'] = 'Company name is required.';
    if (!details.billFrom.email.trim()) {
      newErrors['billFrom.email'] = 'Email is required.';
    } else if (!emailRegex.test(details.billFrom.email)) {
      newErrors['billFrom.email'] = 'Invalid email format.';
    }
    if (!details.billFrom.address.trim()) newErrors['billFrom.address'] = 'Address is required.';

    if (!details.billTo.name.trim()) newErrors['billTo.name'] = 'Client name is required.';
    // Validation for Bill To Email is now optional
    if (details.billTo.email.trim() && !emailRegex.test(details.billTo.email)) {
      newErrors['billTo.email'] = 'Invalid email format.';
    }
    if (!details.billTo.address.trim()) newErrors['billTo.address'] = 'Client address is required.';
    
    details.items.forEach((item, index) => {
      if (!item.description.trim()) {
        newErrors[`items.${index}.description`] = 'Description is required.';
      }
      if (item.quantity <= 0) {
        newErrors[`items.${index}.quantity`] = 'Must be > 0.';
      }
      if (item.price < 0) {
        newErrors[`items.${index}.price`] = 'Cannot be negative.';
      }
    });

    if (details.taxRate < 0) {
      newErrors.taxRate = 'Cannot be negative.';
    }
    
    if (details.discount < 0) {
      newErrors.discount = 'Cannot be negative.';
    } else if (details.discount > 100) {
      newErrors.discount = 'Cannot exceed 100%.';
    }

    if (details.amountPaid < 0) {
      newErrors.amountPaid = 'Cannot be negative.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculations = useMemo(() => {
    const subtotal = details.items.reduce((acc, item) => acc + item.quantity * item.price, 0);
    const discountAmount = (subtotal * (details.discount || 0)) / 100;
    const subtotalAfterDiscount = subtotal - discountAmount;
    
    // If tax type is none, tax is 0 regardless of rate
    let taxAmount = 0;
    if (details.taxType !== 'none') {
      taxAmount = (subtotalAfterDiscount * details.taxRate) / 100;
    }
    
    const total = subtotalAfterDiscount + taxAmount;
    const balanceDue = total - (details.amountPaid || 0);
    return { subtotal, discountAmount, taxAmount, total, balanceDue };
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
