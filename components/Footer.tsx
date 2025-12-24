import React from 'react';
import type { AppView } from '../App';

interface FooterProps {
  setView: (view: AppView) => void;
}

export const Footer: React.FC<FooterProps> = ({ setView }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t mt-12 py-8">
      <div className="container mx-auto px-4 text-center">
        <div className="flex flex-wrap justify-center gap-6 mb-4 text-sm font-medium text-gray-600">
          <button onClick={() => setView('invoice')} className="hover:text-indigo-600 transition-colors">Invoice Generator</button>
          <button onClick={() => setView('quotation')} className="hover:text-indigo-600 transition-colors">Quotation Generator</button>
          <button onClick={() => setView('blog')} className="hover:text-indigo-600 transition-colors">Blog</button>
          <button onClick={() => setView('about')} className="hover:text-indigo-600 transition-colors">About Us</button>
          <button onClick={() => setView('contact')} className="hover:text-indigo-600 transition-colors">Contact Us</button>
          <button onClick={() => setView('terms')} className="hover:text-indigo-600 transition-colors">Terms & Conditions</button>
          <button onClick={() => setView('privacy')} className="hover:text-indigo-600 transition-colors">Privacy Policy</button>
        </div>
        <p className="text-gray-500 text-sm">
          &copy; {currentYear} Free Invoice Generator. All rights reserved.
        </p>
      </div>
    </footer>
  );
};