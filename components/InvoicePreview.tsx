
import React from 'react';
import type { InvoiceDetails } from '../types';
import { numberToWords } from '../lib/utils';

interface InvoicePreviewProps {
  details: InvoiceDetails;
  calculations: {
    subtotal: number;
    totalItemDiscounts: number;
    taxAmount: number;
    total: number;
    balanceDue: number;
    totalQuantity: number;
  };
  title?: string;
}

const formatCurrency = (amount: number, currency: string) => {
  const locale = currency === 'INR' ? 'en-IN' : 'en-US';
  return new Intl.NumberFormat(locale, { 
    style: 'currency', 
    currency: currency,
    minimumFractionDigits: 2
  }).format(amount);
};

const formatDate = (dateString: string) => {
  if (!dateString) return '';
  const [y, m, d] = dateString.split('-');
  return `${d}-${m}-${y}`;
};

const InvoicePreview: React.FC<InvoicePreviewProps> = ({ details, calculations, title = 'Tax Invoice' }) => {
  const { subtotal, totalItemDiscounts, taxAmount, total, balanceDue, totalQuantity } = calculations;
  const { currency, taxType, taxRate } = details;

  const renderTaxLines = () => {
    if (taxType === 'none' || taxAmount === 0) return null;

    if (taxType === 'cgst_sgst') {
      const halfTax = taxAmount / 2;
      const halfRate = taxRate / 2;
      return (
        <>
          <div className="p-3 flex justify-between border-b border-gray-50">
            <span className="text-gray-500 font-bold uppercase text-[9px] tracking-wider text-left">CGST ({halfRate}%)</span>
            <span className="font-black text-black">{formatCurrency(halfTax, currency)}</span>
          </div>
          <div className="p-3 flex justify-between border-b border-gray-50">
            <span className="text-gray-500 font-bold uppercase text-[9px] tracking-wider text-left">SGST ({halfRate}%)</span>
            <span className="font-black text-black">{formatCurrency(halfTax, currency)}</span>
          </div>
        </>
      );
    }

    const taxLabel = taxType === 'igst' ? 'IGST' : 'Tax';
    return (
      <div className="p-3 flex justify-between border-b border-gray-50">
        <span className="text-gray-500 font-bold uppercase text-[9px] tracking-wider text-left">{taxLabel} ({taxRate}%)</span>
        <span className="font-black text-black">{formatCurrency(taxAmount, currency)}</span>
      </div>
    );
  };

  return (
    <div className="bg-white text-[11px] leading-tight text-black p-2 print:p-0 font-sans">
      {/* 1. Header Section */}
      <div className="border-b border-indigo-50 pb-4 mb-4">
        <div className="flex justify-between items-start">
          <div className="space-y-1 text-black">
            <h1 className="text-2xl font-black uppercase tracking-tighter leading-none mb-2">
              {details.billFrom.name || 'Your Business Name'}
            </h1>
            <p className="whitespace-pre-wrap max-w-sm font-bold text-gray-800">{details.billFrom.address}</p>
            <div className="flex flex-col gap-0.5 mt-2">
              {details.billFrom.phone && <p className="font-bold">Phone no.: <span className="text-black">{details.billFrom.phone}</span></p>}
              {details.billFrom.email && <p className="font-bold text-black">Email: {details.billFrom.email}</p>}
              {details.billFrom.gstin && <p className="font-black text-indigo-600">GSTIN: {details.billFrom.gstin}</p>}
              {details.billFrom.state && <p className="font-bold text-black">State: {details.billFrom.state}</p>}
            </div>
          </div>
          {details.logo && (
            <div className="bg-white p-2 rounded-xl border border-gray-50 shadow-sm">
              <img src={details.logo} alt="Logo" className="h-20 w-auto object-contain" />
            </div>
          )}
        </div>
      </div>

      {/* 2. Professional Banner */}
      <div className="text-center py-2 mb-6">
        <div className="relative flex items-center justify-center">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="w-full border-t border-indigo-50"></div>
            </div>
            <div className="relative">
                <span className="bg-white px-10 text-indigo-600 text-lg font-black uppercase tracking-[0.2em]">{title}</span>
            </div>
        </div>
      </div>

      {/* 3. Bill To & Invoice Details Card */}
      <div className="flex justify-between mb-8 px-2">
        <div className="w-1/2">
          <h3 className="text-indigo-400 font-black uppercase text-[9px] tracking-widest mb-2">Bill To</h3>
          <div className="pl-2 border-l-4 border-indigo-500">
            <p className="font-black text-base uppercase text-black mb-1">{details.billTo.name}</p>
            <p className="whitespace-pre-wrap text-black font-bold leading-relaxed">{details.billTo.address}</p>
            {details.billTo.phone && (
              <p className="mt-2 font-black text-black">
                Contact No.: <span>{details.billTo.phone}</span>
              </p>
            )}
            {details.billTo.gstin && (
              <p className="mt-1 font-black text-indigo-600">
                GSTIN: <span>{details.billTo.gstin}</span>
              </p>
            )}
          </div>
        </div>
        <div className="w-[210px] bg-indigo-50/30 p-4 rounded-2xl border border-indigo-100 shadow-sm">
          <h3 className="text-indigo-400 font-black uppercase text-[9px] tracking-widest mb-2 text-right">Reference</h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center border-b border-indigo-100 pb-1">
                <span className="text-gray-600 font-bold uppercase text-[9px]">Invoice No.</span> 
                <span className="font-black text-black text-sm">#{details.invoiceNumber}</span>
            </div>
            <div className="flex justify-between items-center">
                <span className="text-gray-600 font-bold uppercase text-[9px]">Date</span> 
                <span className="font-black text-black">{formatDate(details.issueDate)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Items Table */}
      <div className="border border-gray-100 rounded-2xl overflow-hidden shadow-md mb-8 bg-white">
        <table className="w-full text-left border-collapse table-fixed">
          <thead>
            <tr className="bg-indigo-600 text-white">
              <th className="p-3 border-r border-indigo-500 text-center w-[45px] font-black uppercase text-[9px]">#</th>
              <th className="p-3 border-r border-indigo-500 text-left w-auto font-black uppercase text-[9px]">Item Name</th>
              <th className="p-3 border-r border-indigo-500 text-center w-[110px] font-black uppercase text-[9px]">HSN/ SAC</th>
              <th className="p-3 border-r border-indigo-500 text-center w-[90px] font-black uppercase text-[9px]">Quantity</th>
              <th className="p-3 border-r border-indigo-500 text-center w-[80px] font-black uppercase text-[9px]">Unit</th>
              <th className="p-3 border-r border-indigo-500 text-right w-[100px] font-black uppercase text-[9px]">Price / Unit</th>
              <th className="p-3 border-r border-indigo-500 text-right w-[100px] font-black uppercase text-[9px]">Discount</th>
              <th className="p-3 text-right w-[120px] font-black uppercase text-[9px]">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {details.items.map((item, idx) => {
                const lineTotal = (item.quantity || 0) * (item.price || 0);
                const lineDiscount = (lineTotal * (item.discountRate || 0)) / 100;
                return (
                  <tr key={item.id} className="hover:bg-indigo-50/10 transition-colors">
                    <td className="p-3 border-r border-gray-50 text-center text-black font-bold">{idx + 1}</td>
                    <td className="p-3 border-r border-gray-50 font-black text-black overflow-hidden truncate">{item.description}</td>
                    <td className="p-3 border-r border-gray-50 text-center text-black font-black uppercase tracking-tighter">{item.hsn}</td>
                    <td className="p-3 border-r border-gray-50 text-center text-black font-black text-sm">{item.quantity}</td>
                    <td className="p-3 border-r border-gray-50 text-center text-black font-black uppercase">{item.unit}</td>
                    <td className="p-3 border-r border-gray-50 text-right text-black font-black">{formatCurrency(item.price, currency).replace('₹', '')}</td>
                    <td className="p-3 border-r border-gray-50 text-right text-black">
                        <div className="font-black text-sm">₹{lineDiscount.toFixed(2)}</div>
                        <div className="text-[9px] text-gray-500 font-bold italic">({item.discountRate}%)</div>
                    </td>
                    <td className="p-3 text-right font-black text-black text-sm">{formatCurrency(lineTotal - lineDiscount, currency).replace('₹', '')}</td>
                  </tr>
                )
            })}
          </tbody>
          <tfoot>
            <tr className="bg-gray-50/50 font-black text-black border-t border-gray-100">
              <td colSpan={3} className="p-4 text-right text-indigo-400 font-black uppercase text-[10px] tracking-widest text-left">Summary</td>
              <td className="p-4 border-x border-gray-100 text-center text-black font-black text-base">{totalQuantity}</td>
              <td className="p-4 border-r border-gray-100" colSpan={2}></td>
              <td className="p-4 border-r border-gray-100 text-right font-black text-indigo-700">₹{totalItemDiscounts.toFixed(2)}</td>
              <td className="p-4 text-right font-black text-black text-base">{formatCurrency(total, currency)}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* 5. Bottom Section */}
      <div className="flex justify-between items-start mt-8">
        {/* Left: Words and Terms */}
        <div className="w-1/2 space-y-8">
          <div className="bg-indigo-50/30 p-5 rounded-2xl border-l-4 border-indigo-500 border-r border-t border-b border-indigo-100 shadow-sm">
            <h4 className="font-black mb-1 text-indigo-900 uppercase text-[9px] tracking-widest">Amount In Words</h4>
            <p className="font-black text-black italic text-[12px] leading-relaxed">{numberToWords(total)}</p>
          </div>
          <div>
            <h4 className="font-black mb-1 text-indigo-300 uppercase text-[9px] tracking-widest">Terms And Conditions</h4>
            <p className="text-gray-700 whitespace-pre-wrap text-[10px] font-bold leading-relaxed italic border-t border-gray-50 pt-3">{details.terms}</p>
          </div>
        </div>

        {/* Right: Modern Totals Card */}
        <div className="w-[260px] bg-white border border-gray-100 shadow-xl rounded-3xl overflow-hidden">
           <div className="p-3 flex justify-between border-b border-gray-50">
             <span className="text-gray-500 font-bold uppercase text-[9px] tracking-wider text-left">Sub Total</span>
             <span className="font-black text-black">{formatCurrency(subtotal, currency)}</span>
           </div>
           <div className="p-3 flex justify-between border-b border-gray-50">
             <span className="text-gray-500 font-bold uppercase text-[9px] tracking-wider text-left">Discount</span>
             <span className="font-black text-red-500">- ₹{totalItemDiscounts.toFixed(2)}</span>
           </div>
           
           {renderTaxLines()}

           <div className="p-5 flex justify-between bg-indigo-600 text-white items-center">
             <span className="font-black uppercase tracking-widest text-[11px]">Total Amount</span>
             <span className="font-black text-xl">{formatCurrency(total, currency)}</span>
           </div>
           <div className="p-3 flex justify-between border-b border-gray-50 bg-gray-50/30">
             <span className="text-gray-500 font-bold uppercase text-[9px] tracking-wider text-left">Received</span>
             <span className="font-black text-green-600">{formatCurrency(details.amountPaid, currency)}</span>
           </div>
           <div className="p-3 flex justify-between border-b border-gray-50">
             <span className="text-gray-500 font-bold uppercase text-[9px] tracking-wider text-left">Balance Due</span>
             <span className="font-black text-black text-base underline underline-offset-4 decoration-indigo-400 decoration-2">{formatCurrency(balanceDue, currency)}</span>
           </div>
           <div className="p-4 flex justify-center text-indigo-900 bg-indigo-50/50 font-black italic">
             <span className="uppercase text-[9px] mr-2 opacity-60">Total Savings:</span>
             <span className="text-base text-indigo-700">₹{totalItemDiscounts.toFixed(2)}</span>
           </div>
        </div>
      </div>

      {/* 6. Signature Section */}
      <div className="mt-20 flex flex-col items-end px-4">
        <div className="text-center">
          <p className="font-black text-gray-900 mb-16 text-xs uppercase tracking-tight opacity-80">For: {details.billFrom.name || 'Your Business Name'}</p>
          <div className="border-t border-indigo-200 w-[240px] pt-3">
            <p className="font-black text-black uppercase text-[10px] tracking-widest">Authorized Signatory</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoicePreview;
