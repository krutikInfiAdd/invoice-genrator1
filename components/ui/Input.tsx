
import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  isInvalid?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, isInvalid, ...props }, ref) => {
    const invalidClasses = 'border-red-500 focus:ring-red-500';
    const validClasses = 'border-gray-300 focus:ring-indigo-500';
    
    // text-base on mobile prevents iOS zoom, md:text-sm reverts to standard desktop size
    const baseClasses = `flex h-10 w-full rounded-md border bg-white px-3 py-2 text-base md:text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50`;

    if (type === 'date') {
      return (
        <div className="relative">
          <input
            type="date"
            className={`${baseClasses} ${isInvalid ? invalidClasses : validClasses} pr-10 ${className || ''}`}
            ref={ref}
            {...props}
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
          </div>
        </div>
      );
    }

    return (
      <input
        type={type}
        className={`${baseClasses} ${isInvalid ? invalidClasses : validClasses} ${className || ''}`}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';
