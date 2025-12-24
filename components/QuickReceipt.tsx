import React, { useState, useRef } from 'react';
import { Input } from './ui/Input';
import { Textarea } from './ui/Textarea';
import { Button } from './ui/Button';
import { PlusIcon } from './icons/PlusIcon';
import { TrashIcon } from './icons/TrashIcon';
import { EyeIcon } from './icons/EyeIcon';
import { DownloadIcon } from './icons/DownloadIcon';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface ReceiptItem {
  id: string;
  description: string;
  amount: number;
}

// Sub-component for the Receipt Content to ensure consistency between UI and PDF
const ReceiptContent = React.forwardRef<HTMLDivElement, {
  businessName: string;
  customerName: string;
  customerMobile: string;
  items: ReceiptItem[];
  invoiceNo: string;
  date: string;
  time: string;
  total: number;
  isForPdf?: boolean;
}>(({ 
  businessName, customerName, customerMobile, 
  items, invoiceNo, date, time, total, isForPdf 
}, ref) => (
  <div 
    id={isForPdf ? "receipt-pdf-capture" : "receipt-preview-content"}
    ref={ref}
    className={`bg-white ${isForPdf ? 'p-8' : 'p-4 sm:p-6'} w-full max-w-[800px] mx-auto ${!isForPdf ? 'rounded-lg shadow-2xl border border-gray-100' : ''} font-sans text-black relative`}
    style={isForPdf ? { width: '800px', maxWidth: '800px', minHeight: '100px', height: 'auto', overflow: 'visible' } : {}}
  >
    {/* Header Section */}
    <div className="flex justify-between items-start mb-2">
      <div className="flex-1">
        <h1 className="text-2xl font-black tracking-tight leading-none text-black mb-1">{businessName || 'BUSINESS NAME'}</h1>
        <div className="flex gap-4 text-[9px] font-black text-gray-400 uppercase tracking-tighter">
          <span>Receipt No: <span className="text-black">#{invoiceNo}</span></span>
          <span>Date: <span className="text-black">{date}</span></span>
          <span>Time: <span className="text-black">{time}</span></span>
        </div>
      </div>
    </div>

    {/* Professional Separator */}
    <div className="h-1 bg-black w-full mb-4"></div>

    {/* Client Information Section */}
    <div className="mb-4 grid grid-cols-2 gap-4">
      <div>
        <h4 className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">RECEIPT TO</h4>
        <div className="space-y-0.5">
          <h2 className="text-lg font-black text-indigo-900 leading-none">{customerName || 'CLIENT NAME'}</h2>
          {customerMobile && (
            <p className="text-xs font-black flex items-center gap-2">
              <span className="text-pink-600">📞</span> {customerMobile}
            </p>
          )}
        </div>
      </div>
    </div>

    {/* Dynamic Table Section */}
    <div className="mb-4">
      <div className="grid grid-cols-12 border-b-2 border-black py-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
        <div className="col-span-1 text-center">#</div>
        <div className="col-span-8 px-2">PARTICULARS / DESCRIPTION</div>
        <div className="col-span-3 text-right pr-2">AMOUNT (₹)</div>
      </div>
      <div className="divide-y divide-gray-100">
        {items.map((item, i) => (
          <div key={item.id} className="grid grid-cols-12 py-2 text-sm items-center hover:bg-gray-50/50 transition-colors">
            <div className="col-span-1 text-center font-bold text-gray-300">{i + 1}</div>
            <div className="col-span-8 px-2 font-black uppercase text-gray-800 tracking-tight leading-tight break-words">
              {item.description || 'Service/Product'}
            </div>
            <div className="col-span-3 text-right pr-2 font-black text-base">
              {Number(item.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </div>
          </div>
        ))}
      </div>
      {/* Table Footer Line */}
      <div className="h-1 bg-black w-full mt-1"></div>
    </div>

    {/* Totals Section */}
    <div className="flex justify-end mb-6">
      <div className="w-full max-w-[280px] bg-gray-50 p-4 rounded-xl border border-gray-100">
        <div className="flex justify-between items-center mb-2 pb-2 border-b border-dashed border-gray-300">
          <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Total Amount</span>
          <span className="text-2xl font-black text-black">₹{total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
        </div>
        <div className="text-center">
          <span className="text-[8px] font-black text-green-600 uppercase tracking-widest bg-green-50 px-2 py-0.5 rounded-full">Payment Received in Full</span>
        </div>
      </div>
    </div>
  </div>
));

export const QuickReceipt: React.FC = () => {
  const [showPreview, setShowPreview] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [businessName, setBusinessName] = useState('ACME CORP LTD.');
  const [customerName, setCustomerName] = useState('JOHN DOE');
  const [customerMobile, setCustomerMobile] = useState('+1 (555) 012-3456');
  const [items, setItems] = useState<ReceiptItem[]>([{ id: '1', description: 'Professional Services', amount: 1500 }]);
  const [invoiceNo, setInvoiceNo] = useState('INV-0210');
  const [date, setDate] = useState(new Date().toLocaleDateString());
  const [time, setTime] = useState(new Date().toLocaleTimeString());

  const addItem = () => setItems([...items, { id: crypto.randomUUID(), description: '', amount: 0 }]);
  const updateItem = (id: string, field: keyof ReceiptItem, value: any) => 
    setItems(items.map(it => it.id === id ? { ...it, [field]: value } : it));
  const removeItem = (id: string) => setItems(items.filter(it => it.id !== id));

  const total = items.reduce((sum, it) => sum + (Number(it.amount) || 0), 0);

  const handleDownload = async () => {
    setIsGenerating(true);
    const element = document.getElementById('receipt-pdf-capture');
    
    if (!element) {
      alert("Error: Rendering element missing. Please refresh.");
      setIsGenerating(false);
      return;
    }

    try {
      // Create canvas with precise dimensions of the element
      const canvas = await html2canvas(element, { 
        scale: 2.5, 
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
        width: 800,
        height: element.scrollHeight,
        onclone: (clonedDoc) => {
          const el = clonedDoc.getElementById('receipt-pdf-capture');
          if (el) {
            el.style.visibility = 'visible';
            el.style.display = 'block';
            el.style.position = 'relative';
            el.style.left = '0';
            el.style.top = '0';
            el.style.margin = '0';
            el.style.padding = '40px';
          }
        }
      });
      
      const imgData = canvas.toDataURL('image/png', 1.0);
      
      // Standard A4 Format
      const pdf = new jsPDF({ 
        orientation: 'p', 
        unit: 'mm', 
        format: 'a4'
      });
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      const imgWidth = pdfWidth - 20; // 10mm margin each side
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight, undefined, 'FAST');
      pdf.save(`receipt-${invoiceNo || 'quick'}.pdf`);
    } catch (e) {
      console.error("PDF Export Error:", e);
      alert("Export failed. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const commonProps = {
    businessName, customerName, customerMobile, 
    items, invoiceNo, date, time, total
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Rendering zone for PDF */}
      <div style={{ position: 'absolute', left: '-9999px', top: '0', pointerEvents: 'none', height: 'auto', overflow: 'visible' }}>
        <ReceiptContent {...commonProps} isForPdf={true} />
      </div>

      <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-lg font-bold text-gray-900">QuickReceipt</h2>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={() => setShowPreview(!showPreview)}>
            <EyeIcon className="w-4 h-4 mr-2" /> {showPreview ? 'Edit Details' : 'Preview'}
          </Button>
          <Button size="sm" onClick={handleDownload} disabled={isGenerating}>
            <DownloadIcon className="w-4 h-4 mr-2" /> {isGenerating ? 'Exporting...' : 'Download PDF'}
          </Button>
        </div>
      </div>

      {!showPreview ? (
        <div className="space-y-6 bg-gray-50/50 p-6 rounded-2xl border border-gray-100 animate-fade-in">
          <section className="bg-white p-4 rounded-xl shadow-sm border space-y-4">
            <h3 className="text-sm font-bold text-indigo-700 uppercase tracking-wider">Business Info</h3>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Business Name</label>
              <Input placeholder="Business Name" value={businessName} onChange={(e) => setBusinessName(e.target.value.toUpperCase())} />
            </div>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <section className="bg-white p-4 rounded-xl shadow-sm border space-y-4">
              <h3 className="text-sm font-bold text-indigo-700 uppercase tracking-wider">Client Details</h3>
              <Input value={customerName} onChange={(e) => setCustomerName(e.target.value.toUpperCase())} placeholder="Client Name" />
              <Input value={customerMobile} onChange={(e) => setCustomerMobile(e.target.value)} placeholder="Mobile No." />
            </section>
            
            <section className="bg-white p-4 rounded-xl shadow-sm border space-y-4">
              <h3 className="text-sm font-bold text-indigo-700 uppercase tracking-wider">Receipt Metadata</h3>
              <div className="grid grid-cols-2 gap-2">
                <Input value={invoiceNo} onChange={(e) => setInvoiceNo(e.target.value)} placeholder="Receipt #" />
                <Input value={date} onChange={(e) => setDate(e.target.value)} placeholder="Date" />
              </div>
              <Input value={time} onChange={(e) => setTime(e.target.value)} placeholder="Time" />
            </section>
          </div>

          <section className="bg-white p-4 rounded-xl shadow-sm border space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold text-indigo-700 uppercase tracking-wider">Line Items</h3>
              <Button size="sm" onClick={addItem} variant="outline" className="h-7 text-[10px]"><PlusIcon className="w-3 h-3 mr-1" /> Add Item</Button>
            </div>
            <div className="space-y-3">
              {items.map((item) => (
                <div key={item.id} className="flex gap-2 items-center border p-2 rounded-lg bg-gray-50/50">
                  <Input className="flex-grow" placeholder="Service Description" value={item.description} onChange={(e) => updateItem(item.id, 'description', e.target.value)} />
                  <div className="flex items-center gap-1 w-32">
                    <span className="text-gray-400 font-bold">₹</span>
                    <Input type="number" className="text-right font-black" value={item.amount} onChange={(e) => updateItem(item.id, 'amount', Number(e.target.value))} />
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => removeItem(item.id)} className="h-8 w-8 text-red-400 shrink-0"><TrashIcon className="w-4 h-4" /></Button>
                </div>
              ))}
            </div>
            <div className="flex justify-end pt-4">
                <div className="text-right">
                    <span className="text-xs font-black text-gray-400 uppercase mr-4">Grand Total</span>
                    <span className="text-2xl font-black text-indigo-600">₹{total.toFixed(2)}</span>
                </div>
            </div>
          </section>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-6 animate-fade-in pb-12">
          <div className="bg-indigo-50 border border-indigo-100 px-4 py-2 rounded-full text-indigo-600 text-[10px] font-bold shadow-sm">
             📄 Professional PDF Preview
          </div>
          
          <ReceiptContent {...commonProps} />
          
          <div className="flex gap-4">
            <Button variant="outline" onClick={() => setShowPreview(false)}>← Return to Editor</Button>
            <Button onClick={handleDownload} disabled={isGenerating}>
              <DownloadIcon className="w-4 h-4 mr-2" /> {isGenerating ? 'Generating...' : 'Download PDF'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};