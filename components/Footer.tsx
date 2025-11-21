
import React from 'react';
import type { ViewState } from '../components/Header';

interface FooterProps {
  onNavigate: (view: ViewState) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t mt-12 py-8">
      <div className="container mx-auto px-4 text-center">
        <div className="flex flex-wrap justify-center gap-6 mb-4 text-sm font-medium text-gray-600">
          <button 
            onClick={() => onNavigate('generator')} 
            className="hover:text-indigo-600 transition-colors"
          >
            Invoice Generator
          </button>
          <button 
            onClick={() => onNavigate('quotation')} 
            className="hover:text-indigo-600 transition-colors"
          >
            Quotation Generator
          </button>
           <button 
            onClick={() => onNavigate('blog')} 
            className="hover:text-indigo-600 transition-colors"
          >
            Blog
          </button>
          <button 
            onClick={() => onNavigate('about')} 
            className="hover:text-indigo-600 transition-colors"
          >
            About Us
          </button>
          <button 
            onClick={() => onNavigate('contact')} 
            className="hover:text-indigo-600 transition-colors"
          >
            Contact Us
          </button>
          <button 
            onClick={() => onNavigate('terms')} 
            className="hover:text-indigo-600 transition-colors"
          >
            Terms & Conditions
          </button>
          <button 
            onClick={() => onNavigate('privacy')} 
            className="hover:text-indigo-600 transition-colors"
          >
            Privacy Policy
          </button>
        </div>
        <p className="text-gray-500 text-sm">
          &copy; {currentYear} Free Invoice Generator. All rights reserved.
        </p>
      </div>
    </footer>
  );
};
