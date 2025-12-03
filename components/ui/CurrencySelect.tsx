
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { currencies } from '../../lib/currencies';

interface CurrencySelectProps {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
  isInvalid?: boolean;
}

export const CurrencySelect: React.FC<CurrencySelectProps> = ({ 
  id, 
  value, 
  onChange, 
  className, 
  isInvalid 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      // Small timeout to allow render
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    } else {
      setSearchTerm(''); // Reset search when closed
    }
  }, [isOpen]);

  const filteredCurrencies = useMemo(() => {
    const lowerTerm = searchTerm.toLowerCase();
    return currencies.filter(
      (c) => 
        c.name.toLowerCase().includes(lowerTerm) || 
        c.code.toLowerCase().includes(lowerTerm)
    );
  }, [searchTerm]);

  const selectedCurrency = currencies.find(c => c.code === value);

  const invalidClasses = 'border-red-500 ring-red-500';
  const validClasses = 'border-gray-300 focus:ring-indigo-500';
  const baseClasses = `flex h-10 w-full items-center justify-between rounded-md border bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer`;

  return (
    <div className="relative" ref={containerRef}>
      {/* Trigger Button */}
      <div
        id={id}
        className={`${baseClasses} ${isInvalid ? invalidClasses : validClasses} ${className || ''}`}
        onClick={() => setIsOpen(!isOpen)}
        tabIndex={0}
        role="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className="truncate">
          {selectedCurrency ? `${selectedCurrency.name} (${selectedCurrency.code})` : 'Select Currency'}
        </span>
        <svg 
          className={`h-4 w-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <path d="m6 9 6 6 6-6"/>
        </svg>
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-50 mt-1 w-full rounded-md border border-gray-200 bg-white shadow-lg">
          {/* Search Input */}
          <div className="p-2 border-b border-gray-100">
            <input
              ref={searchInputRef}
              type="text"
              className="w-full rounded-sm border border-gray-300 px-2 py-1.5 text-base md:text-sm focus:border-indigo-500 focus:outline-none"
              placeholder="Search (e.g. India, USD)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onClick={(e) => e.stopPropagation()} // Prevent closing when clicking input
            />
          </div>

          {/* Options List */}
          <div className="max-h-60 overflow-auto py-1">
            {filteredCurrencies.length > 0 ? (
              filteredCurrencies.map((currency) => (
                <div
                  key={currency.code}
                  className={`relative cursor-pointer select-none py-2 pl-3 pr-9 text-sm hover:bg-indigo-50 hover:text-indigo-900 ${
                    value === currency.code ? 'bg-indigo-50 text-indigo-900 font-medium' : 'text-gray-900'
                  }`}
                  onClick={() => {
                    onChange(currency.code);
                    setIsOpen(false);
                  }}
                >
                  <div className="flex items-center">
                    <span className="truncate">
                      {currency.name} ({currency.code})
                    </span>
                  </div>
                  
                  {value === currency.code && (
                    <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-indigo-600">
                      <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    </span>
                  )}
                </div>
              ))
            ) : (
              <div className="py-2 px-3 text-sm text-gray-500 text-center">
                No currency found.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
