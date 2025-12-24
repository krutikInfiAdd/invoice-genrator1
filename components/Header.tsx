import React, { useState, useRef, useEffect } from 'react';
import { Button } from './ui/Button';
import { MenuIcon } from './icons/MenuIcon';
import { XIcon } from './icons/XIcon';
import { ChevronDownIcon } from './icons/ChevronDownIcon';
import type { AppView } from '../App';

interface HeaderProps {
  currentView: AppView;
  setView: (view: AppView) => void;
  onDownload?: () => void;
  isGenerating?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ 
  currentView,
  setView,
  onDownload,
  isGenerating
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isBusinessMenuOpen, setIsBusinessMenuOpen] = useState(false);
  const businessMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (businessMenuRef.current && !businessMenuRef.current.contains(event.target as Node)) {
        setIsBusinessMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isToolView = currentView === 'invoice' || currentView === 'quotation' || currentView === 'quickreceipt';

  const navLinkClass = (view: AppView) => 
    `text-sm font-medium transition-colors hover:text-indigo-600 ${currentView === view ? 'text-indigo-600 font-bold' : 'text-gray-500'}`;

  const mobileNavLinkClass = (view: AppView) =>
    `block w-full text-left px-3 py-2 rounded-md text-base font-medium ${currentView === view ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700 hover:bg-gray-50'}`;

  const handleNavClick = (view: AppView) => {
    setView(view);
    setIsMobileMenuOpen(false);
    setIsBusinessMenuOpen(false);
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <button onClick={() => handleNavClick('invoice')} className="flex items-center">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight hover:text-indigo-600 transition-colors">
              Free Invoice Generator
            </h1>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6 items-center">
            <button onClick={() => handleNavClick('invoice')} className={navLinkClass('invoice')}>Invoice</button>
            <button onClick={() => handleNavClick('quotation')} className={navLinkClass('quotation')}>Quotation</button>
            
            <button className="text-sm font-medium text-gray-500 hover:text-indigo-600 flex items-center gap-1">
              More Features <ChevronDownIcon className="w-4 h-4" />
            </button>

            {/* Business Dropdown */}
            <div className="relative" ref={businessMenuRef}>
              <button 
                onClick={() => setIsBusinessMenuOpen(!isBusinessMenuOpen)}
                className={`text-sm font-medium transition-colors hover:text-indigo-600 flex items-center gap-1 ${isBusinessMenuOpen || currentView === 'quickreceipt' ? 'text-indigo-600' : 'text-gray-500'}`}
              >
                Business <ChevronDownIcon className={`w-4 h-4 transition-transform ${isBusinessMenuOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isBusinessMenuOpen && (
                <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-100 py-2 animate-fade-in z-50">
                  <button onClick={() => handleNavClick('gstcalculator')} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 flex items-center gap-2">
                    📊 Online Pricing Calculator
                  </button>
                  <button onClick={() => handleNavClick('quickreceipt')} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 flex items-center gap-2">
                    📄 QuickReceipt Generator
                  </button>
                  <button     onClick={() => {
                    handleNavClick('pdfcropper');
                  }} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 flex items-center gap-2">
                    ✂️ PDF Cropper
                  </button>
                </div>
              )}
            </div>

            <button onClick={() => handleNavClick('blog')} className={navLinkClass('blog')}>Blog</button>
            <button onClick={() => handleNavClick('about')} className={navLinkClass('about')}>About</button>
            
            {/* Action Buttons */}
            {isToolView && onDownload && currentView !== 'quickreceipt' && (
              <div className="flex items-center gap-2 pl-4 border-l border-gray-200">
                <Button onClick={onDownload} disabled={isGenerating} size="sm">
                  {isGenerating ? 'Generating...' : 'Download PDF'}
                </Button>
              </div>
            )}

            <button className="text-sm font-medium text-gray-500 hover:text-indigo-600">Login / Sign Up</button>
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden gap-2">
             {isToolView && onDownload && currentView !== 'quickreceipt' && (
              <Button onClick={onDownload} disabled={isGenerating} size="sm">
                PDF
              </Button>
            )}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-500 hover:text-gray-700 focus:outline-none p-2"
            >
              {isMobileMenuOpen ? <XIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 max-h-[80vh] overflow-y-auto">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <button onClick={() => handleNavClick('invoice')} className={mobileNavLinkClass('invoice')}>Invoice Generator</button>
            <button onClick={() => handleNavClick('quotation')} className={mobileNavLinkClass('quotation')}>Quotation Generator</button>
            <div className="px-3 py-2 text-xs font-black uppercase text-gray-400 tracking-widest mt-2">Business Tools</div>
            <button onClick={() => handleNavClick('quickreceipt')} className={mobileNavLinkClass('quickreceipt')}>QuickReceipt Generator</button>
            <button onClick={() => handleNavClick('blog')} className={mobileNavLinkClass('blog')}>Blog</button>
            <button onClick={() => handleNavClick('about')} className={mobileNavLinkClass('about')}>About Us</button>
            <button onClick={() => handleNavClick('contact')} className={mobileNavLinkClass('contact')}>Contact</button>
            <button onClick={() => handleNavClick('privacy')} className={mobileNavLinkClass('privacy')}>Privacy Policy</button>
          </div>
        </div>
      )}
    </header>
  );
};