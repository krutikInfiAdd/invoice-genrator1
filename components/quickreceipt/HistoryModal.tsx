import React, { useMemo, useState } from 'react';
import { ReceiptData } from '../../types';
import { X, Calendar, Trash2, FileText, TrendingUp, Hash, DollarSign, Clock, Search, ArrowUpRight, Wallet, Receipt } from 'lucide-react';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: ReceiptData[];
  onSelect: (data: ReceiptData) => void;
  onDelete: (id: string) => void;
}

const HistoryModal: React.FC<HistoryModalProps> = ({ 
  isOpen, 
  onClose, 
  history, 
  onSelect, 
  onDelete
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Calculate Analytics
  const stats = useMemo(() => {
    const todayStr = new Date().toISOString().slice(0, 10);
    
    // Filter out failed transactions for revenue calculations
    const successful = history.filter(h => h.status !== 'Failed');
    const todaysItems = successful.filter(h => h.date.startsWith(todayStr));
    
    const totalRevenue = successful.reduce((sum, item) => sum + (Number(item.totalAmount) || 0), 0);
    const todayRevenue = todaysItems.reduce((sum, item) => sum + (Number(item.totalAmount) || 0), 0);
    
    // Get common currency or default to first found
    const currency = history.length > 0 ? history[0].currency : 'INR';

    return {
        todayCount: todaysItems.length,
        todayRevenue,
        totalCount: successful.length,
        totalRevenue,
        currency
    };
  }, [history]);

  // Filter logic
  const filteredHistory = history.filter(item => 
      (item.customerName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.invoiceNo || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900/20 z-[100] flex justify-end transition-opacity no-print backdrop-blur-sm">
      <div className="bg-gray-50 w-full sm:max-w-[480px] h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300 border-l border-white/50">
        
        {/* Header */}
        <div className="p-6 pb-4 bg-white border-b border-gray-100 flex justify-between items-start z-10">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
                <Clock className="w-6 h-6 text-blue-600" /> History
            </h2>
            <p className="text-sm text-gray-500 font-medium mt-1">Track your past transactions</p>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 -mr-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Analytics Dashboard (Smart UI) */}
        <div className="p-6 bg-white border-b border-gray-200/50 space-y-4">
            
            {/* Today's Widget */}
            <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-5 text-white shadow-lg shadow-blue-500/20">
                <div className="absolute top-0 right-0 p-3 opacity-10">
                    <TrendingUp className="w-24 h-24 -mr-6 -mt-6 rotate-12" />
                </div>
                <div className="relative z-10">
                    <div className="flex justify-between items-start mb-4">
                        <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                            <Wallet className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-[10px] font-bold bg-white/20 px-2 py-1 rounded-full backdrop-blur-sm uppercase tracking-wider">Today</span>
                    </div>
                    <p className="text-blue-100 text-xs font-bold uppercase tracking-wide mb-1">Revenue Generated</p>
                    <h3 className="text-3xl font-mono font-bold tracking-tight">
                        {stats.currency === 'INR' ? '₹' : stats.currency} {stats.todayRevenue.toLocaleString()}
                    </h3>
                    <div className="mt-3 flex items-center gap-2 text-blue-100 text-xs font-medium">
                        <span className="bg-white/20 px-1.5 py-0.5 rounded text-white font-bold">{stats.todayCount}</span>
                        <span>bills created today</span>
                    </div>
                </div>
            </div>

            {/* All Time Stats Row */}
            <div className="grid grid-cols-2 gap-3">
                 <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                        <DollarSign className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div className="min-w-0">
                        <p className="text-[10px] font-bold text-gray-400 uppercase">Total Sales</p>
                        <p className="text-sm font-bold text-gray-800 font-mono truncate">
                            {stats.currency === 'INR' ? '₹' : stats.currency}{stats.totalRevenue > 1000 ? (stats.totalRevenue/1000).toFixed(1) + 'k' : stats.totalRevenue}
                        </p>
                    </div>
                 </div>
                 <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                        <Receipt className="w-5 h-5 text-purple-600" />
                    </div>
                    <div className="min-w-0">
                        <p className="text-[10px] font-bold text-gray-400 uppercase">Total Bills</p>
                        <p className="text-sm font-bold text-gray-800 font-mono">
                            {stats.totalCount}
                        </p>
                    </div>
                </div>
            </div>
        </div>

        {/* Search Bar */}
        <div className="px-6 py-4 bg-gray-50/50 backdrop-blur sticky top-0 z-10">
            <div className="relative group">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                <input 
                    type="text" 
                    placeholder="Search by name or invoice #..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all shadow-sm"
                />
            </div>
        </div>

        {/* Scrollable List */}
        <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-3">
          {history.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 opacity-60">
              <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                  <FileText className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">No History Yet</h3>
              <p className="text-sm text-gray-500 max-w-[200px]">Create your first receipt to see analytics here!</p>
            </div>
          ) : filteredHistory.length === 0 ? (
            <div className="text-center py-10 text-gray-500 text-sm">
                No results found for "{searchTerm}"
            </div>
          ) : (
            filteredHistory.map((item) => (
              <div 
                key={item.id} 
                className="group relative bg-white border border-gray-200 rounded-2xl p-4 hover:border-blue-400 hover:shadow-lg transition-all cursor-pointer overflow-hidden active:scale-[0.98]"
                onClick={() => onSelect(item)}
              >
                {/* Status Indicator Bar */}
                <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${
                    item.status === 'Failed' ? 'bg-red-500' : 
                    item.status === 'Pending' ? 'bg-yellow-500' : 'bg-green-500'
                }`} />

                <div className="flex justify-between items-start pl-2">
                    <div className="min-w-0 flex-1 pr-4">
                        <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-bold text-gray-900 truncate text-base">{item.customerName || "Unknown"}</h3>
                            {item.status === 'Failed' && <span className="text-[10px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded-md font-bold uppercase tracking-wide">Failed</span>}
                        </div>
                        <p className="text-xs text-gray-500 font-medium mb-2 flex items-center gap-1">
                            <Hash className="w-3 h-3" /> {item.invoiceNo}
                        </p>
                        <p className="text-xs text-gray-400 flex items-center gap-1.5">
                             <Clock className="w-3 h-3" />
                             {new Date(item.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} 
                             <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                             {new Date(item.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </p>
                    </div>

                    <div className="text-right">
                         <span className={`block text-lg font-mono font-bold tracking-tight ${item.status === 'Failed' ? 'text-gray-400 line-through decoration-red-500' : 'text-gray-900'}`}>
                            {item.currency === 'INR' ? '₹' : item.currency} {Number(item.totalAmount).toLocaleString()}
                        </span>
                        <div className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity flex justify-end gap-2">
                            <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-lg flex items-center gap-1">
                                View <ArrowUpRight className="w-3 h-3" />
                            </span>
                        </div>
                    </div>
                </div>

                {/* Delete Button (Hover Only) */}
                <button 
                    onClick={(e) => {
                        e.stopPropagation();
                        if (item.id) onDelete(item.id);
                    }}
                    className="absolute top-2 right-2 p-2 bg-white/80 hover:bg-red-50 text-gray-300 hover:text-red-500 rounded-xl opacity-0 group-hover:opacity-100 transition-all backdrop-blur-sm shadow-sm"
                    title="Delete Receipt"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>
        
        {/* Footer Hint */}
        {history.length > 0 && (
            <div className="p-3 text-center border-t border-gray-100 bg-gray-50 text-[10px] text-gray-400 font-medium uppercase tracking-wide">
                Showing {filteredHistory.length} of {history.length} records
            </div>
        )}
      </div>
    </div>
  );
};

export default HistoryModal;