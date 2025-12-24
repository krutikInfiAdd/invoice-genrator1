
import React from 'react';
import type { useInvoice } from '../hooks/useInvoice';
import { Input } from './ui/Input';
import { Textarea } from './ui/Textarea';
import { Button } from './ui/Button';
import { PlusIcon } from './icons/PlusIcon';
import { TrashIcon } from './icons/TrashIcon';
import { FileInput } from './ui/FileInput';
import { CurrencySelect } from './ui/CurrencySelect';

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
          <label className="block text-sm font-semibold text-gray-700 mb-1">Invoice Number</label>
          <Input value={details.invoiceNumber} onChange={(e) => updateDetail('invoiceNumber', e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Invoice Date</label>
          <Input type="date" value={details.issueDate} onChange={(e) => updateDetail('issueDate', e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Due Date</label>
          <Input type="date" value={details.dueDate} onChange={(e) => updateDetail('dueDate', e.target.value)} />
        </div>
      </div>
      
      {/* Bill From / To */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h3 className="font-bold text-lg text-indigo-700 border-b-2 border-indigo-100 pb-2 uppercase tracking-wide">Your Business Details</h3>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Company Logo</label>
            {details.logo ? (
              <div className="flex items-center gap-4 p-2 bg-gray-50 border rounded-md">
                <img src={details.logo} alt="Logo" className="h-12 w-auto object-contain" />
                <Button variant="outline" size="sm" onClick={removeLogo} className="text-red-500 border-red-200">Remove</Button>
              </div>
            ) : (
              <FileInput accept="image/*" onChange={(file) => file && updateLogo(file)} />
            )}
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Business Name</label>
            <Input placeholder="e.g. Goyani Computer & CCTV" value={details.billFrom.name} onChange={(e) => updateContact('billFrom', 'name', e.target.value)} isInvalid={!!errors['billFrom.name']} />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Phone Number</label>
              <Input placeholder="9408443332" value={details.billFrom.phone || ''} onChange={(e) => updateContact('billFrom', 'phone', e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address</label>
              <Input placeholder="email@example.com" value={details.billFrom.email} onChange={(e) => updateContact('billFrom', 'email', e.target.value)} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Business Address</label>
            <Textarea placeholder="Full Address..." value={details.billFrom.address} onChange={(e) => updateContact('billFrom', 'address', e.target.value)} rows={2} />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">GSTIN</label>
              <Input placeholder="24DPHP..." value={details.billFrom.gstin || ''} onChange={(e) => updateContact('billFrom', 'gstin', e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">State</label>
              <Input placeholder="24-Gujarat" value={details.billFrom.state || ''} onChange={(e) => updateContact('billFrom', 'state', e.target.value)} />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-bold text-lg text-indigo-700 border-b-2 border-indigo-100 pb-2 uppercase tracking-wide">Bill To (Client)</h3>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Client Name</label>
            <Input placeholder="Harsh Jivani" value={details.billTo.name} onChange={(e) => updateContact('billTo', 'name', e.target.value)} isInvalid={!!errors['billTo.name']} />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Client Phone</label>
            <Input placeholder="63526 95620" value={details.billTo.phone || ''} onChange={(e) => updateContact('billTo', 'phone', e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Client Address</label>
            <Textarea placeholder="Client's full address..." value={details.billTo.address} onChange={(e) => updateContact('billTo', 'address', e.target.value)} rows={2} />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Client GSTIN</label>
            <Input placeholder="GST Number (Optional)" value={details.billTo.gstin || ''} onChange={(e) => updateContact('billTo', 'gstin', e.target.value)} />
          </div>
        </div>
      </div>
      
      {/* Items Table */}
      <div>
        <h3 className="font-bold text-lg mb-4 text-gray-900 border-b pb-2">Line Items</h3>
        <div className="hidden md:grid grid-cols-12 gap-2 mb-2 px-1 text-xs font-bold text-gray-500 uppercase">
            <div className="col-span-3">Item Description</div>
            <div className="col-span-2">HSN/SAC</div>
            <div className="col-span-1">Qty</div>
            <div className="col-span-1">Unit</div>
            <div className="col-span-2">Price/Unit</div>
            <div className="col-span-2">Disc %</div>
            <div className="col-span-1"></div>
        </div>
        <div className="space-y-3">
          {details.items.map((item, index) => (
            <div key={item.id} className="grid grid-cols-1 md:grid-cols-12 gap-2 items-start bg-white md:bg-transparent p-3 md:p-0 border md:border-0 rounded-lg shadow-sm md:shadow-none">
              <div className="col-span-3">
                <label className="md:hidden block text-xs font-bold text-gray-500 mb-1">Description</label>
                <Input placeholder="Item Name" value={item.description} onChange={(e) => updateItem(item.id, 'description', e.target.value)} />
              </div>
              <div className="col-span-2">
                <label className="md:hidden block text-xs font-bold text-gray-500 mb-1">HSN</label>
                <Input placeholder="HSN Code" value={item.hsn || ''} onChange={(e) => updateItem(item.id, 'hsn', e.target.value)} />
              </div>
              <div className="col-span-1">
                <label className="md:hidden block text-xs font-bold text-gray-500 mb-1">Qty</label>
                <Input type="number" placeholder="1" value={item.quantity} onChange={(e) => updateItem(item.id, 'quantity', Number(e.target.value))} />
              </div>
              <div className="col-span-1">
                <label className="md:hidden block text-xs font-bold text-gray-500 mb-1">Unit</label>
                <Input placeholder="Qty" value={item.unit} onChange={(e) => updateItem(item.id, 'unit', e.target.value)} />
              </div>
              <div className="col-span-2">
                <label className="md:hidden block text-xs font-bold text-gray-500 mb-1">Price</label>
                <Input type="number" placeholder="0.00" value={item.price} onChange={(e) => updateItem(item.id, 'price', Number(e.target.value))} />
              </div>
              <div className="col-span-2">
                <label className="md:hidden block text-xs font-bold text-gray-500 mb-1">Disc %</label>
                <Input type="number" placeholder="0" value={item.discountRate} onChange={(e) => updateItem(item.id, 'discountRate', Number(e.target.value))} />
              </div>
              <div className="col-span-1 flex items-end h-full">
                <Button variant="ghost" size="icon" onClick={() => removeItem(item.id)} className="text-red-500 hover:bg-red-50">
                  <TrashIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
        <Button variant="outline" onClick={addItem} className="mt-4 border-indigo-200 text-indigo-700 hover:bg-indigo-50">
          <PlusIcon className="h-4 w-4 mr-2" /> Add Item
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Terms & Conditions</label>
            <Textarea value={details.terms} onChange={(e) => updateDetail('terms', e.target.value)} rows={3} />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Global Discount %</label>
            <Input type="number" placeholder="0" value={details.discount} onChange={(e) => updateDetail('discount', Number(e.target.value))} />
          </div>
        </div>
        <div className="space-y-4 bg-gray-50 p-6 rounded-lg border">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Currency</label>
            <CurrencySelect value={details.currency} onChange={(val) => updateDetail('currency', val)} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Tax Type</label>
              <select 
                className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                value={details.taxType} 
                onChange={(e) => updateDetail('taxType', e.target.value as any)}
              >
                <option value="none">No Tax</option>
                <option value="cgst_sgst">CGST + SGST (Intra-state)</option>
                <option value="igst">IGST (Inter-state)</option>
                <option value="standard">Standard Tax</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Tax Rate %</label>
              <Input 
                type="number" 
                placeholder="0" 
                disabled={details.taxType === 'none'}
                value={details.taxRate} 
                onChange={(e) => updateDetail('taxRate', Number(e.target.value))} 
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Amount Already Received</label>
            <Input type="number" placeholder="0.00" value={details.amountPaid} onChange={(e) => updateDetail('amountPaid', Number(e.target.value))} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceForm;
