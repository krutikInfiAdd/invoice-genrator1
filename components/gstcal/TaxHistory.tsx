
import React from 'react';
import { GSTCalculation } from '../../types';
import { History, Clock, ArrowUpRight, ReceiptText } from 'lucide-react';

interface TaxHistoryProps {
  history: GSTCalculation[];
  onSelect: (calc: GSTCalculation) => void;
}

const TaxHistory: React.FC<TaxHistoryProps> = ({ history, onSelect }) => {
  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);

  return (
    <div className="bg-white p-8 rounded-3xl shadow-sm border border-indigo-50">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-600 rounded-xl text-white shadow-lg shadow-indigo-100">
            <History size={20} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-indigo-900">Archive</h2>
            <p className="text-xs text-indigo-300 font-medium">Your last 10 calculations</p>
          </div>
        </div>
        <span className="text-[10px] font-bold text-indigo-400 bg-indigo-50 px-3 py-1.5 rounded-full uppercase tracking-wider border border-indigo-100">
          {history.length} Entries
        </span>
      </div>

      {history.length === 0 ? (
        <div className="text-center py-16 bg-indigo-50/20 rounded-2xl border-2 border-dashed border-indigo-50">
          <Clock className="mx-auto text-indigo-200 mb-3" size={40} />
          <p className="text-indigo-300 text-sm font-medium">History is currently empty.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {history.map((item) => (
            <button
              key={item.id}
              onClick={() => onSelect(item)}
              className="group relative flex flex-col p-5 rounded-2xl border border-indigo-50 hover:border-indigo-500/30 hover:bg-indigo-50/50 transition-all text-left bg-indigo-50/10"
            >
              <div className="flex justify-between items-start mb-4">
                <div className={`text-[9px] font-extrabold px-2 py-1 rounded-md uppercase tracking-tighter ${
                  item.mode === 'EXCLUSIVE' ? 'bg-indigo-100 text-indigo-700' : 'bg-emerald-100 text-emerald-700'
                }`}>
                  GST {item.mode === 'EXCLUSIVE' ? 'Added' : 'Included'}
                </div>
                <span className="text-[10px] font-bold text-indigo-300">
                  {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-indigo-300 group-hover:text-indigo-600 transition-colors">
                  <ReceiptText size={18} />
                </div>
                <div>
                  <div className="text-sm text-indigo-300 font-medium mb-0.5">Total Value</div>
                  <div className="text-lg font-bold text-indigo-900 tracking-tight">{formatCurrency(item.totalAmount)}</div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-indigo-50 flex justify-between items-center">
                <span className="text-[11px] font-bold text-indigo-400">Tax Slab: {item.gstRate}%</span>
                <div className="w-6 h-6 rounded-full bg-indigo-100/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all transform translate-x-1 group-hover:translate-x-0">
                  <ArrowUpRight size={14} className="text-indigo-600" />
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default TaxHistory;
