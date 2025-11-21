
import React, { useState } from 'react';
import { Button } from './ui/Button';
import { MenuIcon } from './icons/MenuIcon';
import { XIcon } from './icons/XIcon';
import { useAuth } from '../context/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from '../lib/firebase';

export type ViewState = 'generator' | 'quotation' | 'privacy' | 'about' | 'dashboard' | 'auth' | 'blog' | 'terms' | 'contact' | 'profile';

interface HeaderProps {
  currentView: ViewState;
  onNavigate: (view: ViewState) => void;
  onDownload?: () => void;
  onSave?: () => void;
  onLoginClick: () => void;
  isGenerating?: boolean;
  isSaving?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ 
  currentView, 
  onNavigate, 
  onDownload,
  onSave,
  onLoginClick, 
  isGenerating,
  isSaving
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user } = useAuth();

  const handleNav = (view: ViewState) => {
    onNavigate(view);
    setIsMobileMenuOpen(false);
  };

  const handleLogout = async () => {
    await signOut(auth);
    setIsMobileMenuOpen(false);
    onNavigate('generator');
  };

  const isToolView = currentView === 'generator' || currentView === 'quotation';

  return (
    <header className="bg-white shadow-sm sticky top-0 z-40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div 
            className="flex items-center cursor-pointer" 
            onClick={() => handleNav('generator')}
          >
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight hover:text-indigo-600 transition-colors">
              Free Invoice Generator
            </h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6 items-center">
            <button 
              onClick={() => handleNav('generator')}
              className={`text-sm font-medium transition-colors hover:text-indigo-600 ${currentView === 'generator' ? 'text-indigo-600' : 'text-gray-500'}`}
            >
              Invoice
            </button>
            <button 
              onClick={() => handleNav('quotation')}
              className={`text-sm font-medium transition-colors hover:text-indigo-600 ${currentView === 'quotation' ? 'text-indigo-600' : 'text-gray-500'}`}
            >
              Quotation
            </button>
            
            {user && (
              <>
                <button 
                  onClick={() => handleNav('dashboard')}
                  className={`text-sm font-medium transition-colors hover:text-indigo-600 ${currentView === 'dashboard' ? 'text-indigo-600' : 'text-gray-500'}`}
                >
                  Dashboard
                </button>
                 <button 
                  onClick={() => handleNav('profile')}
                  className={`text-sm font-medium transition-colors hover:text-indigo-600 ${currentView === 'profile' ? 'text-indigo-600' : 'text-gray-500'}`}
                >
                  Profile
                </button>
              </>
            )}

            <button 
              onClick={() => handleNav('blog')}
              className={`text-sm font-medium transition-colors hover:text-indigo-600 ${currentView === 'blog' ? 'text-indigo-600' : 'text-gray-500'}`}
            >
              Blog
            </button>

            <button 
              onClick={() => handleNav('about')}
              className={`text-sm font-medium transition-colors hover:text-indigo-600 ${currentView === 'about' ? 'text-indigo-600' : 'text-gray-500'}`}
            >
              About
            </button>
            
            {/* Action Buttons */}
            {isToolView && (
              <div className="flex items-center gap-2 pl-4 border-l border-gray-200">
                {user && onSave && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={onSave} 
                    disabled={isSaving}
                  >
                    {isSaving ? 'Saving...' : 'Save'}
                  </Button>
                )}
                {onDownload && (
                  <Button onClick={onDownload} disabled={isGenerating} size="sm">
                    {isGenerating ? 'Generating...' : 'Download PDF'}
                  </Button>
                )}
              </div>
            )}

            {/* Auth Buttons */}
            <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
              {user ? (
                <div className="flex items-center gap-3">
                  <button onClick={() => handleNav('profile')} className="text-xs text-gray-500 hover:text-indigo-600 transition-colors hidden lg:block">
                    {user.email}
                  </button>
                  <Button variant="ghost" size="sm" onClick={handleLogout}>Logout</Button>
                </div>
              ) : (
                <Button variant="ghost" size="sm" onClick={onLoginClick}>Login / Sign Up</Button>
              )}
            </div>
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden gap-2">
             {isToolView && onDownload && (
              <Button onClick={onDownload} disabled={isGenerating} size="sm">
                PDF
              </Button>
            )}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-500 hover:text-gray-700 focus:outline-none p-2"
            >
              {isMobileMenuOpen ? (
                <XIcon className="h-6 w-6" />
              ) : (
                <MenuIcon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <button
              onClick={() => handleNav('generator')}
              className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium ${currentView === 'generator' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700 hover:bg-gray-50'}`}
            >
              Invoice Generator
            </button>
            <button
              onClick={() => handleNav('quotation')}
              className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium ${currentView === 'quotation' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700 hover:bg-gray-50'}`}
            >
              Quotation Generator
            </button>
            
            {user && (
              <>
                <button
                  onClick={() => handleNav('dashboard')}
                  className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium ${currentView === 'dashboard' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700 hover:bg-gray-50'}`}
                >
                  History Dashboard
                </button>
                 <button
                  onClick={() => handleNav('profile')}
                  className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium ${currentView === 'profile' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700 hover:bg-gray-50'}`}
                >
                  Company Profile
                </button>
              </>
            )}

             <button
              onClick={() => handleNav('blog')}
              className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium ${currentView === 'blog' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700 hover:bg-gray-50'}`}
            >
              Blog
            </button>

            {user && isToolView && onSave && (
               <button
                onClick={() => { onSave(); setIsMobileMenuOpen(false); }}
                className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50`}
              >
                Save Current {currentView}
              </button>
            )}

            <button
              onClick={() => handleNav('about')}
              className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium ${currentView === 'about' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700 hover:bg-gray-50'}`}
            >
              About Us
            </button>
            
            <button
              onClick={() => handleNav('contact')}
              className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium ${currentView === 'contact' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700 hover:bg-gray-50'}`}
            >
              Contact Us
            </button>

            <button
              onClick={() => handleNav('privacy')}
              className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium ${currentView === 'privacy' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700 hover:bg-gray-50'}`}
            >
              Privacy Policy
            </button>

            <div className="border-t border-gray-200 mt-2 pt-2">
               {user ? (
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50"
                >
                  Logout ({user.email})
                </button>
              ) : (
                <button
                  onClick={() => { onLoginClick(); setIsMobileMenuOpen(false); }}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-indigo-600 hover:bg-indigo-50"
                >
                  Login / Sign Up
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
