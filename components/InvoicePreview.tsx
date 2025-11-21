
import React from 'react';
import type { InvoiceDetails } from '../types';

interface InvoicePreviewProps {
  details: InvoiceDetails;
  calculations: {
    subtotal: number;
    discountAmount: number;
    taxAmount: number;
    total: number;
    balanceDue: number;
  };
  title?: string;
}

const formatCurrency = (amount: number, currency: string) => {
  // Use 'en-IN' for Indian Rupee to display ₹ symbol and correct grouping (Lakh/Crore)
  // Use 'en-US' as default for others to maintain standard formatting
  const locale = currency === 'INR' ? 'en-IN' : 'en-US';
  
  return new Intl.NumberFormat(locale, { 
    style: 'currency', 
    currency: currency 
  }).format(amount);
};

const InvoicePreview: React.FC<InvoicePreviewProps> = ({ details, calculations, title = 'INVOICE' }) => {
  const { subtotal, discountAmount, taxAmount, total, balanceDue } = calculations;
  const { currency, taxType } = details;

  // Check if any item has HSN to conditionally render the column
  const hasHSN = details.items.some(item => item.hsn && item.hsn.trim() !== '');

  return (
    <div className="font-sans text-sm text-gray-800">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start mb-8">
        <div className="w-full sm:w-auto mb-4 sm:mb-0">
          {details.logo && (
            <img src={details.logo} alt="Company Logo" className="h-16 w-auto max-w-48 object-contain mb-4" />
          )}
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 uppercase">{title}</h1>
          <p className="text-gray-500">#{details.invoiceNumber}</p>
        </div>
        <div className="text-left sm:text-right w-full sm:w-auto">
          <h2 className="text-lg font-semibold text-gray-800">{details.billFrom.name}</h2>
          <p className="text-gray-600">{details.billFrom.address.split('\n').map((line, i) => <span key={i}>{line}<br/></span>)}</p>
          <p className="text-gray-600">{details.billFrom.email}</p>
          {details.billFrom.gstin && (
            <p className="text-gray-600 font-medium mt-1">GSTIN: {details.billFrom.gstin}</p>
          )}
        </div>
      </div>

      {/* Bill To & Dates */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-8">
        <div className="mb-4 sm:mb-0">
          <h3 className="text-xs font-semibold uppercase text-gray-500 mb-1">Bill To</h3>
          <p className="font-bold">{details.billTo.name}</p>
          <p>{details.billTo.address.split('\n').map((line, i) => <span key={i}>{line}<br/></span>)}</p>
          {details.billTo.email && <p>{details.billTo.email}</p>}
          {details.billTo.gstin && (
            <p className="font-medium mt-1">GSTIN: {details.billTo.gstin}</p>
          )}
        </div>
        <div className="text-left sm:text-right">
          <div className="mb-2">
            <p className="text-xs font-semibold uppercase text-gray-500">Issue Date</p>
            <p>{details.issueDate}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase text-gray-500">Due Date</p>
            <p>{details.dueDate}</p>
          </div>
        </div>
      </div>

      {/* Items Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left mb-8 min-w-[400px]">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 sm:p-3 font-semibold text-gray-700">Description</th>
              {hasHSN && <th className="p-2 sm:p-3 font-semibold text-gray-700 text-center">HSN/SAC</th>}
              <th className="p-2 sm:p-3 font-semibold text-gray-700 text-center">Qty</th>
              <th className="p-2 sm:p-3 font-semibold text-gray-700 text-right">Unit Price</th>
              <th className="p-2 sm:p-3 font-semibold text-gray-700 text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {details.items.map(item => (
              <tr key={item.id} className="border-b border-gray-100 last:border-b-0">
                <td className="p-2 sm:p-3 font-medium text-gray-900">{item.description}</td>
                {hasHSN && <td className="p-2 sm:p-3 text-center text-gray-700">{item.hsn}</td>}
                <td className="p-2 sm:p-3 text-center text-gray-700">{item.quantity}</td>
                <td className="p-2 sm:p-3 text-right text-gray-700">{formatCurrency(item.price, currency)}</td>
                <td className="p-2 sm:p-3 text-right font-medium text-gray-900">{formatCurrency(item.quantity * item.price, currency)}</td>
              </tr>
            ))}
            {details.items.length === 0 && (
               <tr>
                  <td colSpan={hasHSN ? 5 : 4} className="p-10 text-center text-gray-400">
                      Add items to see them here.
                  </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>


      {/* Totals */}
      <div className="flex justify-end mb-8">
        <div className="w-full max-w-xs space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">Subtotal:</span>
            <span className="font-medium">{formatCurrency(subtotal, currency)}</span>
          </div>
          {discountAmount > 0 && (
            <div className="flex justify-between">
              <span className="text-gray-600">Discount ({details.discount}%):</span>
              <span className="font-medium text-green-600">-{formatCurrency(discountAmount, currency)}</span>
            </div>
          )}
          
          {/* Tax Display Logic */}
          {details.taxType !== 'none' && details.taxRate > 0 && (
            <>
              {taxType === 'cgst_sgst' ? (
                <>
                  <div className="flex justify-between">
                    <span className="text-gray-600">CGST ({details.taxRate / 2}%):</span>
                    <span className="font-medium">{formatCurrency(taxAmount / 2, currency)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">SGST ({details.taxRate / 2}%):</span>
                    <span className="font-medium">{formatCurrency(taxAmount / 2, currency)}</span>
                  </div>
                </>
              ) : taxType === 'igst' ? (
                <div className="flex justify-between">
                  <span className="text-gray-600">IGST ({details.taxRate}%):</span>
                  <span className="font-medium">{formatCurrency(taxAmount, currency)}</span>
                </div>
              ) : (
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax ({details.taxRate}%):</span>
                  <span className="font-medium">{formatCurrency(taxAmount, currency)}</span>
                </div>
              )}
            </>
          )}

          <div className="flex justify-between border-t pt-2 mt-2">
            <span className="font-bold">Total:</span>
            <span className="font-bold">{formatCurrency(total, currency)}</span>
          </div>
          {details.amountPaid > 0 && (
            <div className="flex justify-between">
              <span className="text-gray-600">Amount Paid:</span>
              <span className="font-medium">-{formatCurrency(details.amountPaid, currency)}</span>
            </div>
          )}
          <div className="flex justify-between bg-gray-100 p-3 rounded-md mt-2">
            <span className="font-bold text-lg">Balance Due:</span>
            <span className="font-bold text-lg">{formatCurrency(balanceDue, currency)}</span>
          </div>
        </div>
      </div>

      {/* Notes & Terms */}
      {(details.notes || details.terms) && (
        <div className="border-t pt-4">
          {details.notes && (
            <div className="mb-4">
              <h3 className="text-xs font-semibold uppercase text-gray-500 mb-1">Notes</h3>
              <p className="text-gray-600 text-xs whitespace-pre-wrap">{details.notes}</p>
            </div>
          )}
          {details.terms && (
            <div>
              <h3 className="text-xs font-semibold uppercase text-gray-500 mb-1">Terms & Conditions</h3>
              <p className="text-gray-600 text-xs whitespace-pre-wrap">{details.terms}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default InvoicePreview;
