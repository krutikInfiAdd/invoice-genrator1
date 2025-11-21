
import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './lib/firebase';
import { useInvoice } from './hooks/useInvoice';
import InvoiceForm from './components/InvoiceForm';
import InvoicePreview from './components/InvoicePreview';
import { PrivacyPolicy } from './components/PrivacyPolicy';
import { TermsConditions } from './components/TermsConditions';
import { ContactPage } from './components/ContactPage';
import { AboutUs } from './components/AboutUs';
import { Footer } from './components/Footer';
import { Header, ViewState } from './components/Header';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AuthPage } from './components/AuthPage';
import { Dashboard } from './components/Dashboard';
import { BlogPage } from './components/BlogPage';
import { ProfilePage } from './components/ProfilePage';
import { Button } from './components/ui/Button';
import { EyeIcon } from './components/icons/EyeIcon';
import { EditIcon } from './components/icons/EditIcon';
import { SaveIcon } from './components/icons/SaveIcon';
import { DownloadIcon } from './components/icons/DownloadIcon';
import type { InvoiceDetails } from './types';

// NOTE: To run this project, you'll need to install jspdf and html2canvas:
// npm install jspdf html2canvas

const AppContent: React.FC = () => {
  const invoice = useInvoice('invoice');
  const quotation = useInvoice('quotation');
  const { user, userProfile } = useAuth();
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [currentView, setCurrentView] = useState<ViewState>('generator');
  const [showPreview, setShowPreview] = useState(false);

  const activeDocument = currentView === 'quotation' ? quotation : invoice;
  const documentTitle = currentView === 'quotation' ? 'QUOTATION' : 'INVOICE';

  // Reset preview mode when changing main views
  useEffect(() => {
    setShowPreview(false);
  }, [currentView]);

  // Auto-fill user details when profile is loaded and user is logged in
  useEffect(() => {
    if (user && userProfile) {
      invoice.prefillUserProfile(userProfile, user.email || '');
      quotation.prefillUserProfile(userProfile, user.email || '');
    }
  }, [user, userProfile]);

  // When loading from dashboard, switch view and populate hook
  const handleLoadDocument = (type: 'invoice' | 'quotation', details: InvoiceDetails) => {
    if (type === 'invoice') {
      invoice.loadDetails(details);
      setCurrentView('generator');
    } else {
      quotation.loadDetails(details);
      setCurrentView('quotation');
    }
    // Automatically show preview when loading a document
    setShowPreview(true);
  };

  const handleSaveToCloud = async () => {
    if (!user) {
      setCurrentView('auth');
      return;
    }
    
    if (!activeDocument.validate()) {
      alert("Please fix errors before saving.");
      // If we are in preview mode and there are errors (unlikely if they got there, but possible), switch back
      if (showPreview) setShowPreview(false);
      return;
    }

    setIsSaving(true);
    try {
      await addDoc(collection(db, 'invoices'), {
        userId: user.uid,
        type: currentView === 'quotation' ? 'quotation' : 'invoice',
        details: activeDocument.details,
        updatedAt: serverTimestamp(),
        createdAt: serverTimestamp()
      });
      
      alert('Document saved to your dashboard!');
    } catch (error) {
      console.error("Error saving document", error);
      alert("Failed to save document.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDownloadPdf = async () => {
    if (!activeDocument.validate()) {
      alert("Please fix the highlighted errors before generating the PDF.");
      setShowPreview(false); // Switch back to form to show errors
      return;
    }

    // Ensure we are in preview mode so the element exists
    if (!showPreview) {
      setShowPreview(true);
      // Wait a tick for render
      setTimeout(handleDownloadPdf, 100);
      return;
    }

    const element = document.getElementById('invoice-preview');
    if (!element) return;

    setIsGenerating(true);
    
    const captureWidth = 1000;
    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.left = '-9999px';
    container.style.top = '0';
    container.style.width = `${captureWidth}px`;
    container.style.backgroundColor = '#ffffff';
    
    const clone = element.cloneNode(true) as HTMLElement;
    clone.style.width = '100%';
    clone.style.height = 'auto';
    clone.style.overflow = 'visible';
    
    clone.classList.remove('shadow-md', 'shadow-lg', 'rounded-lg', 'border', 'border-gray-100');
    clone.style.boxShadow = 'none';
    clone.style.borderRadius = '0';
    clone.style.border = 'none';
    // Reduced padding for PDF export (Medium spacing), specifically less top/bottom
    clone.style.padding = '15px 20px';
    
    container.appendChild(clone);
    document.body.appendChild(container);

    try {
      const canvas = await html2canvas(container, { 
        scale: 2,
        logging: false,
        useCORS: true,
        backgroundColor: '#ffffff',
        windowWidth: captureWidth,
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdfWidth = 210;
      // Reduced margins for PDF
      const marginX = 15;
      const marginY = 10; // Reduced top margin to 'medium' as requested
      const contentWidth = pdfWidth - (2 * marginX);
      const imgHeight = (canvas.height * contentWidth) / canvas.width;

      const pdf = new jsPDF({
        orientation: 'p',
        unit: 'mm',
        format: 'a4'
      });

      pdf.addImage(imgData, 'PNG', marginX, marginY, contentWidth, imgHeight);
      
      const prefix = currentView === 'quotation' ? 'quotation' : 'invoice';
      const number = activeDocument.details.invoiceNumber || '001';
      pdf.save(`${prefix}-${number}.pdf`);

    } catch (error) {
      console.error("Failed to generate PDF:", error);
      alert("An error occurred while generating the PDF. Please try again.");
    } finally {
      if (document.body.contains(container)) {
        document.body.removeChild(container);
      }
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 flex flex-col">
      <Header 
        currentView={currentView} 
        onNavigate={setCurrentView} 
        onDownload={(currentView === 'generator' || currentView === 'quotation') && showPreview ? handleDownloadPdf : undefined}
        onSave={currentView === 'generator' || currentView === 'quotation' ? handleSaveToCloud : undefined}
        onLoginClick={() => setCurrentView('auth')}
        isGenerating={isGenerating}
        isSaving={isSaving}
      />

      <div className="flex flex-grow justify-center w-full">
        {/* Left Ad Placeholder - Only show on very large screens if needed, or hide if focused on clean UI */}
        <aside className="hidden 2xl:flex flex-col items-end w-64 p-4 pt-8 shrink-0">
          <div className="ads-box sticky top-24 w-[160px] h-[600px] bg-gray-100 rounded-md border border-dashed border-gray-300 flex items-center justify-center text-gray-400 text-sm">
            Ad Space
          </div>
        </aside>

        <main className="container mx-auto p-4 lg:p-8 flex-grow max-w-4xl">
          {(currentView === 'generator' || currentView === 'quotation') && (
            <div className="w-full">
              {!showPreview ? (
                // Edit Mode
                <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md">
                  <div className="flex flex-col lg:flex-row justify-between items-center mb-6 border-b pb-4 gap-4">
                    <h2 className="text-xl font-semibold text-center lg:text-left">
                      Edit {currentView === 'quotation' ? 'Quotation' : 'Invoice'} Details
                    </h2>
                    <div className="flex flex-wrap justify-center gap-2">
                      <Button variant="outline" onClick={handleSaveToCloud} disabled={isSaving} title="Save to Cloud">
                        <SaveIcon className="w-4 h-4 sm:mr-2" />
                        <span className="hidden sm:inline">{isSaving ? 'Saving...' : 'Save'}</span>
                      </Button>
                      <Button variant="outline" onClick={handleDownloadPdf} disabled={isGenerating} title="Download PDF">
                        <DownloadIcon className="w-4 h-4 sm:mr-2" />
                        <span className="hidden sm:inline">{isGenerating ? 'Generating...' : 'PDF'}</span>
                      </Button>
                      <Button onClick={() => setShowPreview(true)}>
                        <EyeIcon className="w-4 h-4 mr-2" />
                        Preview
                      </Button>
                    </div>
                  </div>
                  
                  <InvoiceForm {...activeDocument} />
                  
                  <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4 pt-6 border-t">
                    <Button variant="outline" onClick={handleSaveToCloud} disabled={isSaving} className="w-full sm:w-auto">
                      <SaveIcon className="w-4 h-4 mr-2" />
                      {isSaving ? 'Saving...' : 'Save to Cloud'}
                    </Button>
                    <Button variant="outline" onClick={handleDownloadPdf} disabled={isGenerating} className="w-full sm:w-auto">
                      <DownloadIcon className="w-4 h-4 mr-2" />
                      {isGenerating ? 'Generating...' : 'Download PDF'}
                    </Button>
                    <Button onClick={() => setShowPreview(true)} className="w-full sm:w-auto sm:min-w-[200px]">
                      <EyeIcon className="w-4 h-4 mr-2" />
                      Preview {currentView === 'quotation' ? 'Quotation' : 'Invoice'}
                    </Button>
                  </div>
                </div>
              ) : (
                // Preview Mode
                <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md">
                  <div className="flex flex-col sm:flex-row justify-between items-center mb-6 border-b pb-4 gap-4">
                    <h2 className="text-xl font-semibold">Preview</h2>
                    <div className="flex gap-2">
                      <Button variant="outline" onClick={() => setShowPreview(false)}>
                        <EditIcon className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                      <Button onClick={handleDownloadPdf} disabled={isGenerating}>
                        <DownloadIcon className="w-4 h-4 mr-2" />
                        {isGenerating ? 'Generating...' : 'Download PDF'}
                      </Button>
                    </div>
                  </div>

                  <div id="invoice-preview" className="bg-white p-4 sm:p-8 rounded-lg shadow-sm border border-gray-200">
                    <InvoicePreview 
                      details={activeDocument.details} 
                      calculations={activeDocument.calculations} 
                      title={documentTitle}
                    />
                  </div>
                  
                  <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
                    <Button variant="outline" onClick={() => setShowPreview(false)} className="w-full sm:w-auto">
                      <EditIcon className="w-4 h-4 mr-2" />
                      Back to Edit
                    </Button>
                    <Button onClick={handleDownloadPdf} disabled={isGenerating} className="w-full sm:w-auto">
                      <DownloadIcon className="w-4 h-4 mr-2" />
                      {isGenerating ? 'Generating PDF...' : 'Download PDF'}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}

          {currentView === 'dashboard' && <Dashboard onLoad={handleLoadDocument} />}
          {currentView === 'profile' && <ProfilePage />}
          {currentView === 'privacy' && <PrivacyPolicy />}
          {currentView === 'terms' && <TermsConditions />}
          {currentView === 'contact' && <ContactPage />}
          {currentView === 'about' && <AboutUs />}
          {currentView === 'blog' && <BlogPage />}
          {currentView === 'auth' && <AuthPage onSuccess={() => setCurrentView('dashboard')} />}
        </main>

        {/* Right Ad Placeholder */}
        <aside className="hidden 2xl:flex flex-col items-start w-64 p-4 pt-8 shrink-0">
          <div className="ads-box sticky top-24 w-[160px] h-[600px] bg-gray-100 rounded-md border border-dashed border-gray-300 flex items-center justify-center text-gray-400 text-sm">
            Ad Space
          </div>
        </aside>
      </div>

      <Footer onNavigate={setCurrentView} />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
