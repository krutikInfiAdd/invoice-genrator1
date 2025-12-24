import React from 'react';
import { ReceiptData } from '../../types';
import { Phone, MapPin, Hash, Calendar } from 'lucide-react';

interface ReceiptPreviewProps {
  data: ReceiptData;
}

const ReceiptPreview: React.FC<ReceiptPreviewProps> = ({ data }) => {
  const formattedDate = new Date(data.date).toLocaleString('en-IN', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit', // Added seconds
  });

  // Helper to display currency properly
  const formatAmount = (amount: number, currency: string) => {
     // If currency is explicitly INR, show symbol, otherwise show code
     const prefix = currency === 'INR' ? '₹' : currency + ' ';
     return `${prefix} ${Number(amount).toFixed(2)}`;
  };

  return (
    // Compact Dimensions: 
    // Width: 210mm (Standard A4 width) 
    // Height: auto (Grows with content)
    // Print Overflow: Visible (Prevents clipping)
    <div className="bg-white mx-auto border border-gray-200 print:border-none relative overflow-hidden print:overflow-visible font-sans flex flex-col
      w-[210mm] h-auto p-[15mm] print:p-[15mm] print:w-[210mm] print:h-auto print:shadow-none print:m-0
    ">
      
      {/* Watermark/Status Stamp */}
      <div className={`absolute top-40 right-10 border-4 text-4xl font-black uppercase tracking-widest opacity-10 rotate-[-15deg] pointer-events-none select-none z-0 px-4 py-1 rounded-xl ${data.status === 'Failed' ? 'border-red-500 text-red-500' : 'border-green-600 text-green-600'}`}>
            {data.status || 'SUCCESS'}
      </div>

      {/* Header with Logo */}
      <div className="text-center border-b-2 border-gray-800 print:border-gray-800 pb-4 mb-6 flex flex-col items-center relative z-10">
            {data.logo && (
                <div className="mb-3">
                    <img src={data.logo} alt="Company Logo" className="h-20 object-contain mx-auto" />
                </div>
            )}
            {data.companyName && (
                <h1 className="text-2xl font-bold uppercase tracking-widest text-gray-900">{data.companyName}</h1>
            )}
            <p className="text-gray-500 text-xs mt-1 uppercase tracking-wide">Official Payment Receipt</p>
      </div>

      {/* Meta Info Grid */}
      <div className="flex justify-between items-start mb-6 relative z-10">
            <div>
            {(data.customerName || data.address || data.mobileNo) && (
                <p className="text-[10px] font-bold text-gray-400 print:text-gray-500 uppercase tracking-wider mb-1">Receipt To</p>
            )}
            
            {data.customerName && (
                <h2 className="text-lg font-semibold text-gray-800 mb-1">{data.customerName}</h2>
            )}
            
            {data.address && (
                <div className="flex items-start gap-2 text-gray-600 mb-1">
                    <MapPin className="w-3.5 h-3.5 mt-0.5 text-gray-400 flex-shrink-0" />
                    <p className="whitespace-pre-line text-sm max-w-[300px] leading-tight">{data.address}</p>
                </div>
            )}
            
            {data.mobileNo && (
                <div className="flex items-center gap-2 text-gray-600">
                    <Phone className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                    <p className="text-sm">{data.mobileNo}</p>
                </div>
            )}

            </div>
            <div className="text-right">
            <div className="mb-4">
                <p className="text-[10px] font-bold text-gray-400 print:text-gray-500 uppercase tracking-wider mb-1">Receipt No</p>
                <div className="flex items-center justify-end gap-1.5">
                     <Hash className="w-3.5 h-3.5 text-gray-400" />
                     <p className="font-mono text-gray-800 font-bold text-base">{data.invoiceNo}</p>
                </div>
            </div>
            <div>
                <p className="text-[10px] font-bold text-gray-400 print:text-gray-500 uppercase tracking-wider mb-1">Date & Time</p>
                 <div className="flex items-center justify-end gap-1.5">
                     <Calendar className="w-3.5 h-3.5 text-gray-400" />
                     <p className="text-gray-800 text-sm">{formattedDate}</p>
                </div>
            </div>
            </div>
      </div>

      {/* Payment Details Table */}
      <div className="mb-6 relative z-10">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr>
                        <th className="py-2 text-[10px] font-bold text-gray-500 uppercase tracking-wider border-b-2 border-gray-200 w-[15%]">Service No</th>
                        <th className="py-2 pl-2 text-[10px] font-bold text-gray-500 uppercase tracking-wider border-b-2 border-gray-200">Description</th>
                        <th className="py-2 text-center text-[10px] font-bold text-gray-500 uppercase tracking-wider border-b-2 border-gray-200 w-[15%]">Status</th>
                        <th className="py-2 text-right text-[10px] font-bold text-gray-500 uppercase tracking-wider border-b-2 border-gray-200 w-[20%]">Amount</th>
                    </tr>
                </thead>
                <tbody>
                    {data.items.map((item, index) => (
                        <tr key={item.id || index}>
                            <td className="py-3 text-sm font-mono text-gray-600 border-b border-gray-100 align-top break-all">
                                {item.serviceNo || "-"}
                            </td>
                            <td className="py-3 pl-2 text-sm text-gray-800 font-medium border-b border-gray-100 align-top">
                                {item.description}
                            </td>
                            <td className="py-3 text-center border-b border-gray-100 align-top">
                                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${
                                    data.status === 'Failed' ? 'bg-red-100 text-red-800' : 
                                    data.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 
                                    'bg-green-100 text-green-800 print:bg-transparent print:text-black print:border print:border-black'
                                }`}>
                                    {data.status || 'Success'}
                                </span>
                            </td>
                            <td className="py-3 text-right font-mono text-gray-900 font-bold text-base border-b border-gray-100 align-top">
                                {formatAmount(item.amount, data.currency)}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
      </div>

      {/* Total Section - Only show if more than 1 item */}
      {data.items.length > 1 && (
        <div className="flex justify-end mb-6 relative z-10">
                <div className="w-1/2 print:w-auto border-t-2 border-gray-900 print:border-gray-800 pt-2">
                    <div className="flex justify-between items-center">
                        <span className="text-sm font-bold text-gray-900 uppercase tracking-wide">Total Amount</span>
                        <span className="text-xl font-bold font-mono text-gray-900">{formatAmount(data.totalAmount, data.currency)}</span>
                    </div>
                </div>
        </div>
      )}

      {/* Footer */}
      <div className="relative z-10 mt-2">
         {(data.note) && (
            <div className="border-t border-gray-200 pt-4 text-center">
                <p className="text-gray-500 italic text-sm">{data.note}</p>
            </div>
         )}
        <div className="mt-4 text-center">
            <p className="text-[10px] text-gray-300 print:text-gray-400">Generated by InfiAdd</p>
        </div>
      </div>

    </div>
  );
};

export default ReceiptPreview;