
import React, { useState } from 'react';
import { CalculationMode } from '../../types';
import { DEFAULT_GST_RATES } from './constants';
import { Calculator, Plus, Minus, Hash } from 'lucide-react';

interface GSTFormProps {
  onCalculate: (amount: number, rate: number, mode: CalculationMode) => void;
}

const GSTForm: React.FC<GSTFormProps> = ({ onCalculate }) => {
  const [amount, setAmount] = useState<string>('');
  const [rate, setRate] = useState<number>(18);
  const [customRate, setCustomRate] = useState<string>('');
  const [mode, setMode] = useState<CalculationMode>('EXCLUSIVE');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalRate = customRate ? parseFloat(customRate) : rate;
    const finalAmount = parseFloat(amount);
    if (!isNaN(finalAmount) && !isNaN(finalRate)) {
      onCalculate(finalAmount, finalRate, mode);
    }
  };

  return (
    <div className="bg-white p-8 rounded-3xl shadow-sm border border-indigo-50 h-full">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2.5 bg-indigo-50 rounded-xl text-indigo-600">
          <Calculator size={24} />
        </div>
        <h2 className="text-xl font-bold text-indigo-900">Calculator</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-indigo-400 mb-2">Transaction Amount (₹)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            className="w-full px-5 py-4 rounded-2xl bg-white border border-indigo-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-xl font-bold text-indigo-600 placeholder:text-indigo-200"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-indigo-400 mb-2">Calculation Logic</label>
          <div className="grid grid-cols-2 gap-2 p-1.5 bg-indigo-50/30 rounded-2xl border border-indigo-50">
            <button
              type="button"
              onClick={() => setMode('EXCLUSIVE')}
              className={`flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${
                mode === 'EXCLUSIVE' ? 'bg-white text-indigo-600 shadow-sm border border-indigo-50' : 'text-indigo-300 hover:text-indigo-500'
              }`}
            >
              <Plus size={16} /> Add GST
            </button>
            <button
              type="button"
              onClick={() => setMode('INCLUSIVE')}
              className={`flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${
                mode === 'INCLUSIVE' ? 'bg-white text-indigo-600 shadow-sm border border-indigo-50' : 'text-indigo-300 hover:text-indigo-500'
              }`}
            >
              <Minus size={16} /> Remove GST
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-indigo-400 mb-2">Tax Rate (%)</label>
          <div className="grid grid-cols-4 gap-2 mb-3">
            {DEFAULT_GST_RATES.map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => {
                  setRate(r);
                  setCustomRate('');
                }}
                className={`py-3 rounded-xl text-sm font-bold border transition-all ${
                  rate === r && !customRate
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-100'
                    : 'bg-white text-indigo-400 border-indigo-100 hover:border-indigo-300'
                }`}
              >
                {r}%
              </button>
            ))}
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Hash size={14} className="text-indigo-300" />
            </div>
            <input
              type="number"
              value={customRate}
              onChange={(e) => {
                setCustomRate(e.target.value);
                setRate(0);
              }}
              placeholder="Custom Tax Percentage"
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-indigo-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-sm font-medium text-indigo-500 placeholder:text-indigo-200"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold shadow-xl shadow-indigo-100 transition-all transform active:scale-[0.98] mt-4"
        >
          Generate Statement
        </button>
      </form>
    </div>
  );
};

export default GSTForm;
