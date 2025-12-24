import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useInvoice } from './hooks/useInvoice';
import InvoiceForm from './components/InvoiceForm';
import InvoicePreview from './components/InvoicePreview';
import { PrivacyPolicy } from './components/PrivacyPolicy';
import { TermsConditions } from './components/TermsConditions';
import { ContactPage } from './components/ContactPage';
import { AboutUs } from './components/AboutUs';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { BlogPage } from './components/BlogPage';
import { Button } from './components/ui/Button';
import { EyeIcon } from './components/icons/EyeIcon';
import { EditIcon } from './components/icons/EditIcon';
import { DownloadIcon } from './components/icons/DownloadIcon';
import { ReviewModal } from './components/ReviewModal';
import { QuickReceipt } from './components/QuickReceipt';

export type AppView = 'invoice' | 'quotation' | 'quickreceipt' | 'blog' | 'about' | 'contact' | 'privacy' | 'terms';

const ToolView: React.FC<{ 
  type: 'invoice' | 'quotation', 
  invoiceHook: any,
  onDownload: () => void,
  isGenerating: boolean,
  showPreviewInitially?: boolean
}> = ({ type, invoiceHook, onDownload, isGenerating, showPreviewInitially = false }) => {
  const [showPreview, setShowPreview] = useState(showPreviewInitially);
  const documentTitle = type === 'quotation' ? 'QUOTATION' : 'INVOICE';

  useEffect(() => {
    setShowPreview(showPreviewInitially);
  }, [showPreviewInitially, type]);

  return (
    <div className="w-full animate-fade-in">
      {!showPreview ? (
        <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md border border-gray-100">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 border-b pb-4 gap-4">
            <h2 className="text-xl font-bold text-indigo-900 uppercase">
              {type} Details
            </h2>
            <div className="flex flex-wrap justify-center gap-2">
              <Button onClick={() => setShowPreview(true)}>
                <EyeIcon className="w-4 h-4 mr-2" />
                Preview
              </Button>
            </div>
          </div>
          <InvoiceForm {...invoiceHook} />
        </div>
      ) : (
        <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md border border-gray-100">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 border-b pb-4 gap-4">
            <h2 className="text-xl font-bold text-indigo-900 uppercase">Preview</h2>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowPreview(false)} disabled={isGenerating}>
                <EditIcon className="w-4 h-4 mr-2" />
                Edit
              </Button>
              <Button onClick={onDownload} disabled={isGenerating}>
                <DownloadIcon className="w-4 h-4 mr-2" />
                {isGenerating ? 'Wait...' : 'Download PDF'}
              </Button>
            </div>
          </div>

          <div id="invoice-preview" className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-50 overflow-hidden">
            <InvoicePreview 
              details={invoiceHook.details} 
              calculations={invoiceHook.calculations} 
              title={documentTitle}
            />
          </div>
          
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
            <Button variant="outline" onClick={() => setShowPreview(false)} disabled={isGenerating} className="w-full sm:w-auto">
              <EditIcon className="w-4 h-4 mr-2" />
              Back to Edit
            </Button>
            <Button onClick={onDownload} disabled={isGenerating} className="w-full sm:w-auto">
              <DownloadIcon className="w-4 h-4 mr-2" />
              {isGenerating ? 'Generating PDF...' : 'Download PDF'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>('invoice');
  const [showPreviewOnLoad, setShowPreviewOnLoad] = useState(false);
  
  const invoice = useInvoice('invoice');
  const quotation = useInvoice('quotation');
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  const getActiveHook = () => currentView === 'quotation' ? quotation : invoice;

  const handleDownloadPdf = async () => {
    const activeDoc = getActiveHook();
    if (!activeDoc.validate()) {
      alert("Please fix the highlighted errors first.");
      return;
    }

    setIsGenerating(true);

    const element = document.getElementById('invoice-preview');
    if (!element) {
      alert("Please click 'Preview' before downloading to ensure accuracy.");
      setIsGenerating(false);
      return;
    }
    
    const container = document.createElement('div');
    container.style.position = 'fixed'; container.style.left = '-9999px'; container.style.top = '0';
    container.style.width = '1000px'; container.style.backgroundColor = '#ffffff'; container.style.zIndex = '-100';
    
    const clone = element.cloneNode(true) as HTMLElement;
    clone.style.width = '1000px'; clone.style.height = 'auto'; clone.style.padding = '40px';
    clone.classList.remove('shadow-sm', 'shadow-md', 'shadow-lg', 'border', 'rounded-2xl', 'rounded-xl');
    
    container.appendChild(clone);
    document.body.appendChild(container);

    try {
      const canvas = await html2canvas(container, { scale: 2, useCORS: true, backgroundColor: '#ffffff' });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({ orientation: 'p', unit: 'mm', format: activeDoc.details.currency === 'USD' ? 'letter' : 'a4' });
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const contentWidth = pdfWidth - 20;
      const imgHeight = (canvas.height * contentWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 10, 10, contentWidth, imgHeight);
      pdf.save(`${currentView === 'quotation' ? 'quotation' : 'invoice'}-${activeDoc.details.invoiceNumber || '001'}.pdf`);
      setTimeout(() => setIsReviewModalOpen(true), 1500);
    } catch (error) {
      console.error(error);
    } finally {
      if (document.body.contains(container)) document.body.removeChild(container);
      setIsGenerating(false);
    }
  };

  const handleReviewSubmit = async (rating: number, comment: string) => {
    console.log('Review submitted locally:', { rating, comment });
  };

  const renderView = () => {
    switch (currentView) {
      case 'invoice':
        return <ToolView type="invoice" invoiceHook={invoice} onDownload={handleDownloadPdf} isGenerating={isGenerating} showPreviewInitially={showPreviewOnLoad} />;
      case 'quotation':
        return <ToolView type="quotation" invoiceHook={quotation} onDownload={handleDownloadPdf} isGenerating={isGenerating} showPreviewInitially={showPreviewOnLoad} />;
      case 'quickreceipt':
        return <QuickReceipt />;
      case 'blog':
        return <BlogPage />;
      case 'about':
        return <AboutUs />;
      case 'contact':
        return <ContactPage />;
      case 'privacy':
        return <PrivacyPolicy />;
      case 'terms':
        return <TermsConditions />;
      default:
        return <ToolView type="invoice" invoiceHook={invoice} onDownload={handleDownloadPdf} isGenerating={isGenerating} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 flex flex-col font-sans">
      <Header 
        currentView={currentView}
        setView={(v) => {
          setCurrentView(v);
          setShowPreviewOnLoad(false);
          window.scrollTo(0, 0);
        }}
        onDownload={handleDownloadPdf}
        isGenerating={isGenerating}
      />

      <div className="flex flex-grow justify-center w-full">
        <aside className="hidden 2xl:flex flex-col items-end w-64 p-4 pt-8 shrink-0">
          <div className="ads-box sticky top-24 w-[160px] h-[600px] bg-gray-100 rounded-md border border-dashed border-gray-300 flex items-center justify-center text-gray-400 text-sm">Ad Space</div>
        </aside>

        <main className="container mx-auto p-4 lg:p-8 flex-grow max-w-4xl">
          {renderView()}
        </main>

        <aside className="hidden 2xl:flex flex-col items-start w-64 p-4 pt-8 shrink-0">
          <div className="ads-box sticky top-24 w-[160px] h-[600px] bg-gray-100 rounded-md border border-dashed border-gray-300 flex items-center justify-center text-gray-400 text-sm">Ad Space</div>
        </aside>
      </div>

      <Footer setView={(v) => {
        setCurrentView(v);
        setShowPreviewOnLoad(false);
        window.scrollTo(0, 0);
      }} />
      
      <ReviewModal 
        isOpen={isReviewModalOpen} 
        onClose={() => setIsReviewModalOpen(false)}
        onSubmit={handleReviewSubmit}
      />
    </div>
  );
};

export default App;