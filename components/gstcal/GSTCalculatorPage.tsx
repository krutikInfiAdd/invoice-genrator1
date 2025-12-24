
import React, { useState, useEffect } from 'react';
  import { GSTCalculation, CalculationMode } from '../../types';
import GSTForm from './GSTForm';
import ResultsDisplay from './ResultsDisplay';
import TaxHistory from './TaxHistory';
import { Receipt, ShieldCheck, Zap } from 'lucide-react';
import { AdBanner } from '../AdBanner';

const GSTCalculatorPage: React.FC = () => {
  const [currentCalc, setCurrentCalc] = useState<GSTCalculation | null>(null);
  const [history, setHistory] = useState<GSTCalculation[]>([]);

  // Load history from local storage
  useEffect(() => {
    const saved = localStorage.getItem('gst_history');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse history");
      }
    }
  }, []);

  const handleCalculate = (amount: number, rate: number, mode: CalculationMode) => {
    let base, gst, total;

    if (mode === 'EXCLUSIVE') {
      base = amount;
      gst = (amount * rate) / 100;
      total = base + gst;
    } else {
      total = amount;
      base = amount / (1 + rate / 100);
      gst = total - base;
    }

    const newCalc: GSTCalculation = {
      id: Date.now().toString(),
      baseAmount: Number(base.toFixed(2)),
      gstRate: rate,
      gstAmount: Number(gst.toFixed(2)),
      totalAmount: Number(total.toFixed(2)),
      cgst: Number((gst / 2).toFixed(2)),
      sgst: Number((gst / 2).toFixed(2)),
      mode,
      timestamp: Date.now(),
    };

    setCurrentCalc(newCalc);
    setHistory(prev => {
      const updated = [newCalc, ...prev].slice(0, 10);
      localStorage.setItem('gst_history', JSON.stringify(updated));
      return updated;
    });
  };

  const handleReset = () => {
    setCurrentCalc(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 print:bg-white">



      <div className="w-full">
        <div className="my-6 print:hidden">
          <AdBanner />
        </div>

        <div className='bg-white p-6 sm:p-8 rounded-lg shadow-md'>

          <header className="bg-white border-slate-200 py-4">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
              <div className="flex items-center gap-3">
                <div className="bg-indigo-600 p-2 rounded-xl text-white shadow-lg shadow-indigo-100">
                  <Receipt size={24} />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-slate-700 leading-tight">
                    TaxCalculator<span className="text-indigo-600">Pro</span>
                  </h1>
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    <Zap size={10} className="text-amber-500" />
                    Professional Grade Calculator
                  </div>
                </div>
              </div>
            </div>
          </header>
          <div className='min-h-screen flex flex-col bg-gray-50 print:bg-white'>
            

              {/* Main Calculation Tools */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start bg-white pb-8">
                <section className="h-full">
                  <GSTForm onCalculate={handleCalculate} />
                </section>

                <section className="h-full ">
                  {currentCalc ? (
                    <ResultsDisplay calculation={currentCalc} onReset={handleReset} />
                  ) : (
                    <div className="bg-white p-12 rounded-3xl shadow-sm border border-indigo-50 flex flex-col items-center justify-center text-center h-full min-h-[500px]">
                      <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center mb-6 animate-pulse">
                        <svg className="w-10 h-10 text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-bold text-indigo-900">Precision Tax Analysis</h3>
                      <p className="text-indigo-300 max-w-[280px] mt-2 text-sm">
                        Enter your values on the left to generate an instant, detailed GST breakdown with visualizations.
                      </p>
                    </div>
                  )}
                </section>
              </div>

              {/* History Section */}
              <section>
                <TaxHistory history={history} onSelect={setCurrentCalc} />
              </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GSTCalculatorPage;
