
import React, { useState, useRef } from 'react';

export interface FileInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'type'> {
  isInvalid?: boolean;
  onChange: (file: File | null) => void;
}

export const FileInput = React.forwardRef<HTMLInputElement, FileInputProps>(
  ({ className, isInvalid, onChange, accept, ...props }, ref) => {
    const [fileName, setFileName] = useState<string>('No file chosen');
    const internalRef = useRef<HTMLInputElement>(null);

    const triggerClick = () => {
      internalRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        setFileName(file.name);
        onChange(file);
      } else {
        setFileName('No file chosen');
        onChange(null);
      }
      // Reset the input value to allow re-selecting the same file
      event.target.value = '';
    };

    const invalidClasses = 'border-red-500 focus-within:ring-red-500';
    const validClasses = 'border-gray-300 focus-within:ring-indigo-500';

    return (
      <div
        onClick={triggerClick}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') triggerClick(); }}
        tabIndex={0}
        role="button"
        aria-controls="file-upload"
        className={`flex h-10 w-full items-center rounded-md border bg-white text-sm transition-shadow focus:outline-none focus-within:ring-2 focus-within:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer overflow-hidden ${isInvalid ? invalidClasses : validClasses} ${className || ''}`}
      >
        <span className="inline-flex h-full shrink-0 items-center whitespace-nowrap rounded-l-md bg-indigo-50 px-4 py-2 font-semibold text-indigo-700 hover:bg-indigo-100">
          Choose File
        </span>
        <span className="truncate px-3 text-gray-500">
          {fileName}
        </span>
        <input
          id="file-upload"
          type="file"
          ref={internalRef}
          className="sr-only"
          onChange={handleFileChange}
          accept={accept}
          {...props}
        />
      </div>
    );
  }
);
FileInput.displayName = 'FileInput';
