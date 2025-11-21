
import React from 'react';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  isInvalid?: boolean;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, isInvalid, ...props }, ref) => {
    const invalidClasses = 'border-red-500 focus:ring-red-500';
    const validClasses = 'border-gray-300 focus:ring-indigo-500';

    return (
      <textarea
        className={`flex min-h-[80px] w-full rounded-md border bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${isInvalid ? invalidClasses : validClasses} ${className || ''}`}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = 'Textarea';
