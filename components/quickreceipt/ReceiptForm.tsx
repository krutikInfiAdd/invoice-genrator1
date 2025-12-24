import React, { useState, useRef, useEffect } from 'react';
import { ReceiptData, ReceiptItem } from '../../types';
import { Sparkles, Loader2, Plus, Trash2, User, Phone, MapPin, Calendar, Hash, Tag, Building2, FileText, Layers, Lock, Image as ImageIcon, ChevronDown } from 'lucide-react';

interface ReceiptFormProps {
  data: ReceiptData;
  onChange: (data: ReceiptData) => void;
  availableServices: string[];
  onAddService: (service: string) => void;
}

const ReceiptForm: React.FC<ReceiptFormProps> = ({ data, onChange, availableServices, onAddService }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeDropdownIndex, setActiveDropdownIndex] = useState<number | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // --- Styles ---
  const sectionTitleClass = "text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2";
  const labelClass = "flex items-center gap-1.5 text-[11px] font-bold text-gray-500 uppercase tracking-wide mb-1.5";
  const inputClass = "w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all placeholder:text-gray-400 font-medium";
  const cardClass = "bg-white p-4 rounded-2xl border border-gray-100 shadow-[0_2px_8px_-4px_rgba(0,0,0,0.05)]";

  // --- General Field Handlers ---
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    onChange({ ...data, [name]: value });
  };

  // --- Item List Handlers ---

  const updateItems = (newItems: ReceiptItem[]) => {
      const newTotal = newItems.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
      onChange({
          ...data,
          items: newItems,
          totalAmount: newTotal
      });
  };

  const handleItemChange = (index: number, field: keyof ReceiptItem, value: string | number) => {
      const newItems = [...data.items];
      newItems[index] = {
          ...newItems[index],
          [field]: value
      };
      updateItems(newItems);
  };

  const handleAddItem = () => {
      const newItem: ReceiptItem = {
          id: Date.now().toString(),
          serviceNo: '',
          description: '',
          amount: 0
      };
      updateItems([...data.items, newItem]);
  };

  const handleRemoveItem = (index: number) => {
      const newItems = data.items.filter((_, i) => i !== index);
      updateItems(newItems);
  };

  // --- Autocomplete Logic ---

  const handleServiceSelect = (index: number, serviceName: string) => {
      handleItemChange(index, 'description', serviceName);
      setActiveDropdownIndex(null);
  };

  const handleServiceBlur = (index: number) => {
    const service = data.items[index].description;
    if (service && service.trim() !== "") {
        onAddService(service.trim());
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdownIndex(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

//   const handleAiGenerate = async () => {
//     setIsGenerating(true);
//     try {
//       const note = await generateReceiptNote(data);
//       onChange({ ...data, note });
//     } catch (err) {
//       console.error(err);
//       alert("Failed to generate note. Please check your connection or API key.");
//     } finally {
//       setIsGenerating(false);
//     }
//   };

  return (
    <div className="h-full overflow-y-auto bg-gray-50/50 p-1 pr-2 sm:pr-1 scrollbar-thin scrollbar-thumb-gray-200">
      <div className="space-y-6 pb-20">
        
        {/* Header */}
        <div className="flex items-center justify-between px-1">
            <h2 className="text-lg font-bold text-gray-900 tracking-tight">Receipt Details</h2>
            <div className="text-[10px] font-bold bg-blue-50 text-blue-600 px-2 py-1 rounded-full uppercase tracking-wide border border-blue-100">
                Edit Mode
            </div>
        </div>
        
        {/* Company Identity (Locked) */}
        <div className="relative overflow-hidden bg-gray-100/80 rounded-2xl border border-gray-200 p-4">
            <div className="absolute -right-3 -top-3 text-gray-200">
                <Lock className="w-16 h-16 opacity-20 transform rotate-12" />
            </div>
            <div className="relative z-10 flex items-start gap-4">
                 <div className="w-12 h-12 bg-white rounded-xl border border-gray-200 flex items-center justify-center flex-shrink-0 shadow-sm">
                    {data.logo ? (
                        <img src={data.logo} alt="Logo" className="w-8 h-8 object-contain" />
                    ) : (
                        <Building2 className="w-6 h-6 text-gray-300" />
                    )}
                 </div>
                 <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Bill From</p>
                    <h3 className="text-sm font-bold text-gray-700 truncate">{data.companyName}</h3>
                    <p className="text-xs text-gray-500 truncate mt-0.5">{data.address}</p>
                 </div>
            </div>
        </div>

        {/* Customer Info */}
        <div className={cardClass}>
            <div className={sectionTitleClass}>
                <User className="w-3.5 h-3.5 text-blue-500" /> Customer Information
            </div>
            <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                        <label className={labelClass}>Customer Name</label>
                        <input
                            type="text"
                            name="customerName"
                            value={data.customerName}
                            onChange={handleChange}
                            className={inputClass}
                            placeholder="e.g. John Doe"
                        />
                    </div>
                    <div>
                        <label className={labelClass}>Mobile Number</label>
                        <input
                            type="tel"
                            name="mobileNo"
                            value={data.mobileNo}
                            onChange={handleChange}
                            className={inputClass}
                            placeholder="+123..."
                        />
                    </div>
                </div>
                <div>
                    <label className={labelClass}>
                        <MapPin className="w-3 h-3" /> Billing Address
                    </label>
                    <textarea
                        name="address"
                        rows={2}
                        value={data.address}
                        onChange={handleChange}
                        className={`${inputClass} resize-none`}
                        placeholder="Full billing address..."
                    />
                </div>
            </div>
        </div>

        {/* Items Section */}
        <div className={cardClass}>
            <div className="flex justify-between items-center mb-4">
                 <div className={sectionTitleClass.replace('mb-3', 'mb-0')}>
                    <Layers className="w-3.5 h-3.5 text-blue-500" /> Items & Services
                 </div>
                 <button 
                    onClick={handleAddItem}
                    className="flex items-center gap-1.5 text-[11px] font-bold text-white bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded-lg transition-all shadow-sm shadow-blue-500/20 active:scale-95"
                >
                    <Plus className="w-3.5 h-3.5" /> Add New
                </button>
            </div>
            
            <div className="space-y-3" ref={dropdownRef}>
                {data.items.map((item, index) => {
                     const filteredServices = availableServices.filter(s => 
                        s.toLowerCase().includes((item.description || "").toLowerCase())
                      );

                    return (
                        <div key={item.id} className="p-3 bg-gray-50/50 rounded-xl border border-gray-200 group hover:border-blue-300 transition-colors relative">
                            {/* Header Row: S.No and Delete */}
                            <div className="flex justify-between items-center mb-2">
                                <div className="flex items-center gap-2 w-1/3">
                                   <span className="text-[10px] font-bold text-gray-400">S.No</span>
                                   <input 
                                        type="text"
                                        value={item.serviceNo}
                                        onChange={(e) => handleItemChange(index, 'serviceNo', e.target.value)}
                                        className="w-full bg-transparent border-b border-gray-300 focus:border-blue-500 text-xs font-mono font-medium outline-none py-0.5"
                                        placeholder="#"
                                   />
                                </div>
                                {data.items.length > 1 && (
                                    <button 
                                        onClick={() => handleRemoveItem(index)}
                                        className="text-gray-300 hover:text-red-500 transition-colors p-1"
                                        title="Remove Item"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                )}
                            </div>
                            
                            {/* Main Inputs */}
                            <div className="space-y-2.5">
                                <div className="relative">
                                    <input 
                                        type="text"
                                        value={item.description}
                                        onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                                        onFocus={() => setActiveDropdownIndex(index)}
                                        onBlur={() => handleServiceBlur(index)}
                                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 outline-none font-medium placeholder:text-gray-400"
                                        placeholder="Service description..."
                                    />
                                    {activeDropdownIndex === index && filteredServices.length > 0 && (
                                        <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-gray-100 rounded-xl shadow-xl z-50 max-h-40 overflow-y-auto py-1">
                                            {filteredServices.map((s, i) => (
                                                <button
                                                    key={i}
                                                    className="w-full text-left px-4 py-2 text-xs font-medium text-gray-600 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                                                    onMouseDown={() => handleServiceSelect(index, s)}
                                                >
                                                    {s}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="flex-1"></div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] font-bold text-gray-400 uppercase">Amount</span>
                                        <div className="relative w-28">
                                            <span className="absolute left-2.5 top-1.5 text-gray-400 text-xs font-bold">
                                                {data.currency === 'INR' ? '₹' : data.currency}
                                            </span>
                                            <input 
                                                type="number"
                                                value={item.amount}
                                                onChange={(e) => handleItemChange(index, 'amount', parseFloat(e.target.value) || 0)}
                                                className="w-full pl-8 pr-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm font-mono font-bold text-right focus:border-blue-500 outline-none"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="mt-5 pt-4 border-t border-gray-100 flex justify-between items-center">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">Total Amount</span>
                <span className="text-xl font-mono font-bold text-blue-600">
                   {data.currency === 'INR' ? '₹' : data.currency} {data.totalAmount.toFixed(2)}
                </span>
            </div>
        </div>

        {/* Meta Info */}
        <div className={cardClass}>
             <div className={sectionTitleClass}>
                <Hash className="w-3.5 h-3.5 text-blue-500" /> Invoice Details
             </div>
             <div className="grid grid-cols-2 gap-3">
                 <div>
                    <label className={labelClass}>Invoice #</label>
                    <input
                        type="text"
                        name="invoiceNo"
                        value={data.invoiceNo}
                        onChange={handleChange}
                        className={`${inputClass} font-mono text-xs tracking-wide`}
                    />
                </div>
                <div>
                    <label className={labelClass}>Date</label>
                    <input
                        type="datetime-local"
                        name="date"
                        value={data.date}
                        step="1"
                        onChange={handleChange}
                        className={`${inputClass} text-xs`}
                    />
                </div>
             </div>
             <div className="mt-3">
                <label className={labelClass}>Status</label>
                <div className="relative">
                    <select
                        name="status"
                        value={data.status || 'Success'}
                        onChange={handleChange}
                        className={`w-full appearance-none px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500/10 ${data.status === 'Failed' ? 'text-red-500' : data.status === 'Pending' ? 'text-orange-500' : 'text-green-600'}`}
                    >
                        <option value="Success">Success</option>
                        <option value="Pending">Pending</option>
                        <option value="Failed">Failed</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
            </div>
        </div>

        {/* Footer Note */}
        <div className={cardClass}>
           <div className="flex justify-between items-end mb-2">
             <label className={labelClass.replace('mb-1.5', 'mb-0')}>
                <FileText className="w-3.5 h-3.5 text-purple-500" /> Note / Footer
             </label>
           </div>
           <textarea
            name="note"
            rows={3}
            value={data.note}
            onChange={handleChange}
            className={`${inputClass} resize-none text-xs leading-relaxed`}
            placeholder="e.g. Thank you for your business..."
           />
        </div>

      </div>
    </div>
  );
};

export default ReceiptForm;