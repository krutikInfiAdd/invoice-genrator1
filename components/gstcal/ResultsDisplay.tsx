
import React from 'react';
import { GSTCalculation } from '../../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { COLOR_PALETTE } from './constants';
import { ReceiptText, Share2, RotateCcw, Download, Info } from 'lucide-react';
import { jsPDF } from 'jspdf';

interface ResultsDisplayProps {
  calculation: GSTCalculation;
  onReset: () => void;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ calculation, onReset }) => {
  const chartData = [
    { name: 'Base', value: calculation.baseAmount },
    { name: 'CGST', value: calculation.cgst },
    { name: 'SGST', value: calculation.sgst },
  ];

  const COLORS = [COLOR_PALETTE.primary, COLOR_PALETTE.secondary, COLOR_PALETTE.accent];

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(val);

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    const primaryColor = [99, 102, 241]; // Indigo-600 RGB
    
    // Header
    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.rect(0, 0, 210, 40, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('TaxCalculator Pro', 20, 20);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('OFFICIAL GST STATEMENT', 20, 30);
    doc.text(new Date(calculation.timestamp).toLocaleString(), 140, 30);

    // Summary Section
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('SUMMARY', 20, 60);
    
    doc.setDrawColor(224, 231, 255);
    doc.line(20, 65, 190, 65);

    doc.setTextColor(100, 116, 139); // Slate-500
    doc.setFont('helvetica', 'normal');
    doc.text('Transaction Type:', 20, 75);
    doc.text('GST Rate:', 20, 85);
    
    doc.setTextColor(30, 41, 59); // Slate-800
    doc.setFont('helvetica', 'bold');
    doc.text(calculation.mode === 'EXCLUSIVE' ? 'GST Exclusive (Added)' : 'GST Inclusive (Included)', 70, 75);
    doc.text(`${calculation.gstRate}%`, 70, 85);

    // Totals Table
    let yPos = 110;
    const tableHeaders = ['Description', 'Amount'];
    const tableData = [
      ['Base Amount', formatCurrency(calculation.baseAmount)],
      [`CGST (${calculation.gstRate / 2}%)`, formatCurrency(calculation.cgst)],
      [`SGST (${calculation.gstRate / 2}%)`, formatCurrency(calculation.sgst)],
      ['Total GST', formatCurrency(calculation.gstAmount)],
    ];

    // Table Header
    doc.setFillColor(248, 250, 252);
    doc.rect(20, yPos - 5, 170, 10, 'F');
    doc.setTextColor(99, 102, 241);
    doc.setFontSize(10);
    doc.text(tableHeaders[0], 25, yPos + 2);
    doc.text(tableHeaders[1], 150, yPos + 2);

    yPos += 15;
    doc.setTextColor(71, 85, 105);
    doc.setFont('helvetica', 'normal');
    
    tableData.forEach((row) => {
      doc.text(row[0], 25, yPos);
      doc.text(row[1], 150, yPos);
      yPos += 10;
    });

    // Grand Total
    yPos += 5;
    doc.setFillColor(99, 102, 241);
    doc.rect(20, yPos, 170, 15, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('TOTAL PAYABLE', 25, yPos + 10);
    doc.text(formatCurrency(calculation.totalAmount), 140, yPos + 10);

    // Footer
    doc.setTextColor(148, 163, 184);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'italic');
    doc.text('Generated via TaxCalculator Pro by INFIADD. This is a computer-generated document and does not require a signature.', 105, 280, { align: 'center' });

    doc.save(`TaxCalculator_Statement_${calculation.id}.pdf`);
  };

  const handleShare = async () => {
    const text = `GST Statement: Total ${formatCurrency(calculation.totalAmount)} (${calculation.gstRate}% GST). Generated via TaxCalculator Pro.`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'GST Tax Statement',
          text: text,
          url: window.location.href,
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      navigator.clipboard.writeText(text);
      alert('Summary copied to clipboard!');
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl shadow-indigo-100/30 border border-indigo-50 overflow-hidden flex flex-col h-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header Info */}
      <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 px-8 py-6 text-white">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-2">
            <div className="bg-white/20 p-1.5 rounded-lg backdrop-blur-sm">
              <ReceiptText size={18} />
            </div>
            <h2 className="text-lg font-bold tracking-tight">Tax Statement</h2>
          </div>
          <button 
            onClick={onReset}
            className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/60 hover:text-white"
          >
            <RotateCcw size={18} />
          </button>
        </div>
        <p className="text-indigo-100/70 text-[10px] uppercase font-bold tracking-widest mb-1">Total Payable</p>
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-extrabold tracking-tight">{formatCurrency(calculation.totalAmount)}</span>
          <span className="text-indigo-200 text-sm font-semibold">{calculation.gstRate}% GST</span>
        </div>
      </div>

      <div className="p-8 space-y-8 flex-grow">
        {/* Chart and Quick Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-5 h-[200px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={75}
                  paddingAngle={8}
                  dataKey="value"
                  stroke="none"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-[10px] font-bold text-indigo-300 uppercase tracking-tighter">Tax</span>
              <span className="text-lg font-bold text-indigo-600">{((calculation.gstAmount / calculation.totalAmount) * 100).toFixed(1)}%</span>
            </div>
          </div>

          <div className="md:col-span-7 space-y-3">
            <div className="flex justify-between items-center p-3 rounded-xl bg-indigo-50/30 border border-indigo-50">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#6366f1]" />
                <span className="text-sm font-medium text-indigo-400">Base Amount</span>
              </div>
              <span className="text-sm font-bold text-indigo-600">{formatCurrency(calculation.baseAmount)}</span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-xl bg-indigo-50/30 border border-indigo-50">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#8b5cf6]" />
                <span className="text-sm font-medium text-indigo-400">CGST ({calculation.gstRate/2}%)</span>
              </div>
              <span className="text-sm font-bold text-indigo-600">{formatCurrency(calculation.cgst)}</span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-xl bg-indigo-50/30 border border-indigo-50">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#ec4899]" />
                <span className="text-sm font-medium text-indigo-400">SGST ({calculation.gstRate/2}%)</span>
              </div>
              <span className="text-sm font-bold text-indigo-600">{formatCurrency(calculation.sgst)}</span>
            </div>
          </div>
        </div>

        {/* Detailed Breakdown Table */}
        <div className="border-t border-indigo-50 pt-6">
          <h3 className="text-xs font-bold text-indigo-300 uppercase tracking-widest mb-4">Itemized Breakdown</h3>
          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span className="text-indigo-400">Net Amount (Pre-tax)</span>
              <span className="font-semibold text-indigo-600">{formatCurrency(calculation.baseAmount)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-indigo-400">Total GST Liability</span>
              <span className="font-semibold text-emerald-500">+{formatCurrency(calculation.gstAmount)}</span>
            </div>
            <div className="bg-indigo-50/50 p-4 rounded-2xl border border-indigo-100/50 flex items-center gap-3">
              <div className="p-2 bg-white rounded-lg shadow-sm">
                <Info size={16} className="text-indigo-600" />
              </div>
              <p className="text-[11px] leading-relaxed text-indigo-700/80 font-medium">
                This calculation follows standard GST norms for {calculation.mode === 'EXCLUSIVE' ? 'exclusive' : 'inclusive'} pricing. 
                Ensure input tax credits are verified with your auditor.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="px-8 py-6 bg-indigo-50/30 border-t border-indigo-50 flex gap-3">
        <button 
          onClick={handleDownloadPDF}
          className="flex-grow flex items-center justify-center gap-2 py-3 px-4 bg-white border border-indigo-100 rounded-xl text-xs font-bold text-indigo-400 hover:bg-white hover:text-indigo-600 transition-all shadow-sm active:scale-95"
        >
          <Download size={14} /> Download PDF
        </button>
        <button 
          onClick={handleShare}
          className="flex-grow flex items-center justify-center gap-2 py-3 px-4 bg-white border border-indigo-100 rounded-xl text-xs font-bold text-indigo-400 hover:bg-white hover:text-indigo-600 transition-all shadow-sm active:scale-95"
        >
          <Share2 size={14} /> Share Quote
        </button>
      </div>
    </div>
  );
};

export default ResultsDisplay;