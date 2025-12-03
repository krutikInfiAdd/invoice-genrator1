
import React from 'react';
import type { useInvoice } from '../hooks/useInvoice';
import { Input } from './ui/Input';
import { Textarea } from './ui/Textarea';
import { Button } from './ui/Button';
import { PlusIcon } from './icons/PlusIcon';
import { TrashIcon } from './icons/TrashIcon';
import { FileInput } from './ui/FileInput';
import { CurrencySelect } from './ui/CurrencySelect';
import { TaxType } from '../types';

type InvoiceFormProps = ReturnType<typeof useInvoice>;

const InvoiceForm: React.FC<InvoiceFormProps> = ({
  details,
  errors,
  updateDetail,
  updateContact,
  addItem,
  updateItem,
  removeItem,
  updateLogo,
  removeLogo
}) => {
  // Localization helpers
  const isUSD = details.currency === 'USD';
  const taxIdLabel = isUSD ? 'EIN / Tax ID (Optional)' : 'GSTIN (Optional)';
  const taxIdPlaceholder = isUSD ? 'e.g., 12-3456789' : 'e.g., 22AAAAA0000A1Z5';
  const addressPlaceholder = isUSD ? 'Address, City, State, Zip Code' : 'Address, City, State, Pincode';
  const taxLabel = isUSD ? 'Sales Tax' : 'Standard Tax';

  return (
    <div className="space-y-8">
      {/* Invoice Meta */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label htmlFor="invoiceNumber" className="block text-sm font-medium text-gray-700 mb-1">Invoice Number</label>
          <Input id="invoiceNumber" value={details.invoiceNumber} onChange={(e) => updateDetail('invoiceNumber', e.target.value)} isInvalid={!!errors.invoiceNumber} />
          {errors.invoiceNumber && <p className="text-xs text-red-600 mt-1">{errors.invoiceNumber}</p>}
        </div>
        <div>
          <label htmlFor="issueDate" className="block text-sm font-medium text-gray-700 mb-1">Issue Date</label>
          <Input id="issueDate" type="date" value={details.issueDate} onChange={(e) => updateDetail('issueDate', e.target.value)} isInvalid={!!errors.issueDate} />
          {errors.issueDate && <p className="text-xs text-red-600 mt-1">{errors.issueDate}</p>}
        </div>
        <div>
          <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
          <Input id="dueDate" type="date" value={details.dueDate} onChange={(e) => updateDetail('dueDate', e.target.value)} isInvalid={!!errors.dueDate} />
          {errors.dueDate && <p className="text-xs text-red-600 mt-1">{errors.dueDate}</p>}
        </div>
      </div>
      
      {/* Bill From / To */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h3 className="font-semibold text-lg text-gray-900 border-b pb-2">Bill From</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Company Logo</label>
            {details.logo ? (
              <div className="flex items-center gap-4">
                <img src={details.logo} alt="Company Logo" className="h-12 w-auto max-w-24 object-contain rounded-md border bg-white p-1" />
                <Button variant="outline" size="sm" onClick={removeLogo}>Remove</Button>
              </div>
            ) : (
              <FileInput 
                accept="image/*"
                onChange={(file) => {
                  if (file) {
                    updateLogo(file);
                  }
                }} 
              />
            )}
          </div>
          <div>
            <Input placeholder="Company Name" value={details.billFrom.name} onChange={(e) => updateContact('billFrom', 'name', e.target.value)} isInvalid={!!errors['billFrom.name']} />
            {errors['billFrom.name'] && <p className="text-xs text-red-600 mt-1">{errors['billFrom.name']}</p>}
          </div>
          <div>
            <Input placeholder="Email Address" type="email" value={details.billFrom.email} onChange={(e) => updateContact('billFrom', 'email', e.target.value)} isInvalid={!!errors['billFrom.email']} />
            {errors['billFrom.email'] && <p className="text-xs text-red-600 mt-1">{errors['billFrom.email']}</p>}
          </div>
          <div>
            <Textarea placeholder={addressPlaceholder} value={details.billFrom.address} onChange={(e) => updateContact('billFrom', 'address', e.target.value)} rows={3} isInvalid={!!errors['billFrom.address']} />
            {errors['billFrom.address'] && <p className="text-xs text-red-600 mt-1">{errors['billFrom.address']}</p>}
          </div>
           <div>
            <Input 
              placeholder={taxIdLabel} 
              value={details.billFrom.gstin || ''} 
              onChange={(e) => updateContact('billFrom', 'gstin', e.target.value)} 
            />
          </div>
        </div>
        <div className="space-y-4">
          <h3 className="font-semibold text-lg text-gray-900 border-b pb-2">Bill To</h3>
          <div>
            <Input placeholder="Client Name" value={details.billTo.name} onChange={(e) => updateContact('billTo', 'name', e.target.value)} isInvalid={!!errors['billTo.name']} />
            {errors['billTo.name'] && <p className="text-xs text-red-600 mt-1">{errors['billTo.name']}</p>}
          </div>
          <div>
            <Input placeholder="Client Email (Optional)" type="email" value={details.billTo.email} onChange={(e) => updateContact('billTo', 'email', e.target.value)} isInvalid={!!errors['billTo.email']} />
            {errors['billTo.email'] && <p className="text-xs text-red-600 mt-1">{errors['billTo.email']}</p>}
          </div>
          <div>
            <Textarea placeholder={addressPlaceholder} value={details.billTo.address} onChange={(e) => updateContact('billTo', 'address', e.target.value)} rows={3} isInvalid={!!errors['billTo.address']} />
            {errors['billTo.address'] && <p className="text-xs text-red-600 mt-1">{errors['billTo.address']}</p>}
          </div>
           <div>
            <Input 
              placeholder={`Client ${taxIdLabel}`} 
              value={details.billTo.gstin || ''} 
              onChange={(e) => updateContact('billTo', 'gstin', e.target.value)} 
            />
          </div>
        </div>
      </div>
      
      {/* Items Table */}
      <div>
        <h3 className="font-semibold text-lg mb-4 text-gray-900">Items</h3>
        <div className="space-y-6 md:space-y-2">
          {details.items.map((item, index) => (
            <div key={item.id} className="grid grid-cols-12 gap-x-3 gap-y-3 items-end pb-6 md:pb-0 border-b border-gray-100 md:border-0 last:border-0 md:last:border-0">
              
              {/* Description */}
              <div className="order-1 md:order-none col-span-10 md:col-span-4">
                <label className="block text-xs font-medium text-gray-500 mb-1 md:hidden">Description</label>
                {index === 0 && <label className="hidden md:block text-xs font-medium text-gray-500 mb-1">Description</label>}
                
                <Input placeholder="Item description" value={item.description} onChange={(e) => updateItem(item.id, 'description', e.target.value)} isInvalid={!!errors[`items.${index}.description`]} />
                {errors[`items.${index}.description`] && <p className="text-xs text-red-600 mt-1">{errors[`items.${index}.description`]}</p>}
              </div>

              {/* HSN */}
              <div className="order-3 md:order-none col-span-3 md:col-span-2">
                 <label className="block text-xs font-medium text-gray-500 mb-1 md:hidden">{isUSD ? 'Item Code' : 'HSN'}</label>
                 {index === 0 && <label className="hidden md:block text-xs font-medium text-gray-500 mb-1">{isUSD ? 'Code/SKU' : 'HSN/SAC'}</label>}
                 
                 <Input placeholder={isUSD ? 'SKU' : 'HSN'} value={item.hsn || ''} onChange={(e) => updateItem(item.id, 'hsn', e.target.value)} />
              </div>

              {/* Qty */}
              <div className="order-4 md:order-none col-span-3 md:col-span-2">
                <label className="block text-xs font-medium text-gray-500 mb-1 md:hidden">Qty</label>
                {index === 0 && <label className="hidden md:block text-xs font-medium text-gray-500 mb-1">Qty</label>}
                
                <Input type="number" placeholder="0" value={item.quantity} onChange={(e) => updateItem(item.id, 'quantity', Number(e.target.value))} isInvalid={!!errors[`items.${index}.quantity`]} />
              </div>

              {/* Price */}
              <div className="order-5 md:order-none col-span-6 md:col-span-3">
                <label className="block text-xs font-medium text-gray-500 mb-1 md:hidden">Price</label>
                {index === 0 && <label className="hidden md:block text-xs font-medium text-gray-500 mb-1">Price</label>}
                
                <Input type="number" placeholder="0.00" value={item.price} onChange={(e) => updateItem(item.id, 'price', Number(e.target.value))} isInvalid={!!errors[`items.${index}.price`]} />
              </div>

              {/* Trash */}
              <div className="order-2 md:order-none col-span-2 md:col-span-1 flex items-end justify-center md:justify-start pb-1 md:pb-0 h-full">
                <Button variant="ghost" size="icon" onClick={() => removeItem(item.id)} className="text-red-500 hover:text-red-700 hover:bg-red-50 w-full md:w-auto h-9 md:h-10" aria-label="Remove item">
                  <TrashIcon className="h-5 w-5" />
                </Button>
              </div>

              {/* Error Messages */}
              {(errors[`items.${index}.quantity`] || errors[`items.${index}.price`]) && (
                <div className="order-6 col-span-12 md:hidden mt-1">
                   {errors[`items.${index}.quantity`] && <p className="text-xs text-red-600">Qty: {errors[`items.${index}.quantity`]}</p>}
                   {errors[`items.${index}.price`] && <p className="text-xs text-red-600">Price: {errors[`items.${index}.price`]}</p>}
                </div>
              )}
            </div>
          ))}
        </div>
        <Button variant="outline" onClick={addItem} className="mt-4 w-full md:w-auto">
          <PlusIcon className="h-4 w-4 mr-2" /> Add Item
        </Button>
      </div>

      {/* Notes, Terms, Discount & Tax */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-gray-100">
        <div className="space-y-4">
          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <Textarea id="notes" value={details.notes} onChange={(e) => updateDetail('notes', e.target.value)} rows={3} placeholder="Additional notes for the client..." />
          </div>
          <div>
            <label htmlFor="terms" className="block text-sm font-medium text-gray-700 mb-1">Terms & Conditions</label>
            <Textarea id="terms" value={details.terms} onChange={(e) => updateDetail('terms', e.target.value)} rows={3} placeholder="Payment terms, warranty, etc..." />
          </div>
        </div>
        <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
          <div>
            <label htmlFor="currency" className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
            <CurrencySelect 
              id="currency" 
              value={details.currency} 
              onChange={(value) => updateDetail('currency', value)} 
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
             <div className={details.taxType === 'none' ? 'col-span-2' : ''}>
              <label htmlFor="taxType" className="block text-sm font-medium text-gray-700 mb-1">Tax Mode</label>
              <select
                id="taxType"
                className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-base md:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={details.taxType || 'standard'}
                onChange={(e) => updateDetail('taxType', e.target.value as TaxType)}
              >
                <option value="standard">{taxLabel}</option>
                <option value="cgst_sgst">GST (Intra-state)</option>
                <option value="igst">IGST (Inter-state)</option>
                <option value="none">None (No Tax)</option>
              </select>
            </div>
            {details.taxType !== 'none' && (
              <div>
                <label htmlFor="taxRate" className="block text-sm font-medium text-gray-700 mb-1">
                   {details.taxType === 'cgst_sgst' ? 'Total Rate (%)' : 'Rate (%)'}
                </label>
                <Input id="taxRate" type="number" value={details.taxRate} onChange={(e) => updateDetail('taxRate', Number(e.target.value))} isInvalid={!!errors.taxRate} />
                {errors.taxRate && <p className="text-xs text-red-600 mt-1">{errors.taxRate}</p>}
              </div>
            )}
          </div>

          <div>
            <label htmlFor="discount" className="block text-sm font-medium text-gray-700 mb-1">Discount (%)</label>
            <Input id="discount" type="number" value={details.discount} onChange={(e) => updateDetail('discount', Number(e.target.value))} isInvalid={!!errors.discount} />
            {errors.discount && <p className="text-xs text-red-600 mt-1">{errors.discount}</p>}
          </div>
          <div>
            <label htmlFor="amountPaid" className="block text-sm font-medium text-gray-700 mb-1">Amount Paid</label>
            <Input id="amountPaid" type="number" value={details.amountPaid} onChange={(e) => updateDetail('amountPaid', Number(e.target.value))} isInvalid={!!errors.amountPaid} />
            {errors.amountPaid && <p className="text-xs text-red-600 mt-1">{errors.amountPaid}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceForm;
