
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
  return (
    <div className="space-y-8">
      {/* Invoice Meta */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label htmlFor="invoiceNumber" className="block text-sm font-medium text-gray-700">Invoice Number</label>
          <Input id="invoiceNumber" value={details.invoiceNumber} onChange={(e) => updateDetail('invoiceNumber', e.target.value)} isInvalid={!!errors.invoiceNumber} />
          {errors.invoiceNumber && <p className="text-xs text-red-600 mt-1">{errors.invoiceNumber}</p>}
        </div>
        <div>
          <label htmlFor="issueDate" className="block text-sm font-medium text-gray-700">Issue Date</label>
          <Input id="issueDate" type="date" value={details.issueDate} onChange={(e) => updateDetail('issueDate', e.target.value)} isInvalid={!!errors.issueDate} />
          {errors.issueDate && <p className="text-xs text-red-600 mt-1">{errors.issueDate}</p>}
        </div>
        <div>
          <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">Due Date</label>
          <Input id="dueDate" type="date" value={details.dueDate} onChange={(e) => updateDetail('dueDate', e.target.value)} isInvalid={!!errors.dueDate} />
          {errors.dueDate && <p className="text-xs text-red-600 mt-1">{errors.dueDate}</p>}
        </div>
      </div>
      
      {/* Bill From / To */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Bill From</h3>
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
            <Textarea placeholder="Address" value={details.billFrom.address} onChange={(e) => updateContact('billFrom', 'address', e.target.value)} rows={3} isInvalid={!!errors['billFrom.address']} />
            {errors['billFrom.address'] && <p className="text-xs text-red-600 mt-1">{errors['billFrom.address']}</p>}
          </div>
           <div>
            <Input 
              placeholder="GSTIN (Optional)" 
              value={details.billFrom.gstin || ''} 
              onChange={(e) => updateContact('billFrom', 'gstin', e.target.value)} 
            />
          </div>
        </div>
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Bill To</h3>
          <div>
            <Input placeholder="Client Name" value={details.billTo.name} onChange={(e) => updateContact('billTo', 'name', e.target.value)} isInvalid={!!errors['billTo.name']} />
            {errors['billTo.name'] && <p className="text-xs text-red-600 mt-1">{errors['billTo.name']}</p>}
          </div>
          <div>
            <Input placeholder="Client Email (Optional)" type="email" value={details.billTo.email} onChange={(e) => updateContact('billTo', 'email', e.target.value)} isInvalid={!!errors['billTo.email']} />
            {errors['billTo.email'] && <p className="text-xs text-red-600 mt-1">{errors['billTo.email']}</p>}
          </div>
          <div>
            <Textarea placeholder="Client Address" value={details.billTo.address} onChange={(e) => updateContact('billTo', 'address', e.target.value)} rows={3} isInvalid={!!errors['billTo.address']} />
            {errors['billTo.address'] && <p className="text-xs text-red-600 mt-1">{errors['billTo.address']}</p>}
          </div>
           <div>
            <Input 
              placeholder="Client GSTIN (Optional)" 
              value={details.billTo.gstin || ''} 
              onChange={(e) => updateContact('billTo', 'gstin', e.target.value)} 
            />
          </div>
        </div>
      </div>
      
      {/* Items Table */}
      <div>
        <h3 className="font-semibold text-lg mb-2">Items</h3>
        <div className="space-y-2">
          {details.items.map((item, index) => (
            <div key={item.id} className="grid grid-cols-12 gap-2 items-end">
              <div className="col-span-12 sm:col-span-4">
                {index === 0 && <label className="text-xs text-gray-500">Description</label>}
                <Input placeholder="Item description" value={item.description} onChange={(e) => updateItem(item.id, 'description', e.target.value)} isInvalid={!!errors[`items.${index}.description`]} />
                {errors[`items.${index}.description`] && <p className="text-xs text-red-600 mt-1">{errors[`items.${index}.description`]}</p>}
              </div>
              <div className="col-span-4 sm:col-span-2">
                 {index === 0 && <label className="text-xs text-gray-500">HSN/SAC</label>}
                 <Input placeholder="HSN" value={item.hsn || ''} onChange={(e) => updateItem(item.id, 'hsn', e.target.value)} />
              </div>
              <div className="col-span-3 sm:col-span-2">
                {index === 0 && <label className="text-xs text-gray-500">Qty</label>}
                <Input type="number" placeholder="Qty" value={item.quantity} onChange={(e) => updateItem(item.id, 'quantity', Number(e.target.value))} isInvalid={!!errors[`items.${index}.quantity`]} />
                {errors[`items.${index}.quantity`] && <p className="text-xs text-red-600 mt-1">{errors[`items.${index}.quantity`]}</p>}
              </div>
              <div className="col-span-4 sm:col-span-3">
                {index === 0 && <label className="text-xs text-gray-500">Price</label>}
                <Input type="number" placeholder="Price" value={item.price} onChange={(e) => updateItem(item.id, 'price', Number(e.target.value))} isInvalid={!!errors[`items.${index}.price`]} />
                {errors[`items.${index}.price`] && <p className="text-xs text-red-600 mt-1">{errors[`items.${index}.price`]}</p>}
              </div>
              <div className="col-span-1 sm:col-span-1 flex items-end h-full">
                <Button variant="ghost" size="icon" onClick={() => removeItem(item.id)} className="text-red-500 hover:text-red-700 hover:bg-red-50 w-full h-10" aria-label="Remove item">
                  <TrashIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
        <Button variant="outline" onClick={addItem} className="mt-4">
          <PlusIcon className="h-4 w-4 mr-2" /> Add Item
        </Button>
      </div>

      {/* Notes, Terms, Discount & Tax */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700">Notes</label>
            <Textarea id="notes" value={details.notes} onChange={(e) => updateDetail('notes', e.target.value)} rows={3} />
          </div>
          <div>
            <label htmlFor="terms" className="block text-sm font-medium text-gray-700">Terms & Conditions</label>
            <Textarea id="terms" value={details.terms} onChange={(e) => updateDetail('terms', e.target.value)} rows={3} />
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <label htmlFor="currency" className="block text-sm font-medium text-gray-700">Currency</label>
            <CurrencySelect id="currency" value={details.currency} onChange={(e) => updateDetail('currency', e.target.value)} />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
             <div className={details.taxType === 'none' ? 'col-span-2' : ''}>
              <label htmlFor="taxType" className="block text-sm font-medium text-gray-700">Tax Mode</label>
              <select
                id="taxType"
                className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={details.taxType || 'standard'}
                onChange={(e) => updateDetail('taxType', e.target.value as TaxType)}
              >
                <option value="standard">Standard Tax</option>
                <option value="cgst_sgst">GST (Intra-state: CGST+SGST)</option>
                <option value="igst">IGST (Inter-state)</option>
                <option value="none">None (No Tax)</option>
              </select>
            </div>
            {details.taxType !== 'none' && (
              <div>
                <label htmlFor="taxRate" className="block text-sm font-medium text-gray-700">
                   {details.taxType === 'cgst_sgst' ? 'Total Tax Rate (%)' : 'Tax Rate (%)'}
                </label>
                <Input id="taxRate" type="number" value={details.taxRate} onChange={(e) => updateDetail('taxRate', Number(e.target.value))} isInvalid={!!errors.taxRate} />
                {errors.taxRate && <p className="text-xs text-red-600 mt-1">{errors.taxRate}</p>}
              </div>
            )}
          </div>

          <div>
            <label htmlFor="discount" className="block text-sm font-medium text-gray-700">Discount (%)</label>
            <Input id="discount" type="number" value={details.discount} onChange={(e) => updateDetail('discount', Number(e.target.value))} isInvalid={!!errors.discount} />
            {errors.discount && <p className="text-xs text-red-600 mt-1">{errors.discount}</p>}
          </div>
          <div>
            <label htmlFor="amountPaid" className="block text-sm font-medium text-gray-700">Amount Paid</label>
            <Input id="amountPaid" type="number" value={details.amountPaid} onChange={(e) => updateDetail('amountPaid', Number(e.target.value))} isInvalid={!!errors.amountPaid} />
            {errors.amountPaid && <p className="text-xs text-red-600 mt-1">{errors.amountPaid}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceForm;
