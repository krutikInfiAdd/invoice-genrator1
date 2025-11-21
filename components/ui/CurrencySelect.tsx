import React from 'react';
import { currencies } from '../../lib/currencies';

interface CurrencySelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  isInvalid?: boolean;
}

export const CurrencySelect = React.forwardRef<HTMLSelectElement, CurrencySelectProps>(
  ({ className, isInvalid, ...props }, ref) => {
    const invalidClasses = 'border-red-500 focus:ring-red-500';
    const validClasses = 'border-gray-300 focus:ring-indigo-500';

    return (
      <select
        className={`flex h-10 w-full rounded-md border bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${isInvalid ? invalidClasses : validClasses} ${className || ''}`}
        ref={ref}
        {...props}
      >
        {currencies.map((currency) => (
          <option key={currency.code} value={currency.code}>
            {currency.name} ({currency.code})
          </option>
        ))}
      </select>
    );
  }
);
CurrencySelect.displayName = 'CurrencySelect';
