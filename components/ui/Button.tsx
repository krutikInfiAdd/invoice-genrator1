
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

const baseStyles = "inline-flex items-center justify-center rounded-md font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:pointer-events-none";

const variantStyles = {
  primary: 'bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500',
  outline: 'border border-gray-300 bg-transparent hover:bg-gray-100 text-gray-700 focus:ring-indigo-500',
  ghost: 'hover:bg-gray-100 text-gray-700 focus:ring-indigo-500',
};

const sizeStyles = {
  default: 'px-4 py-2 text-sm',
  sm: 'px-3 py-1.5 text-xs',
  lg: 'px-6 py-3 text-base',
  icon: 'h-10 w-10',
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'default', ...props }, ref) => {
    return (
      <button
        className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className || ''}`}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';
