import React, { useState, useEffect } from 'react';
import { ReceiptData, DEFAULT_RECEIPT, CompanyProfile, DEFAULT_COMPANY } from '../../types';
import ReceiptForm from './../../components/quickreceipt/ReceiptForm';
import ReceiptPreview from './../../components/quickreceipt/ReceiptPreview';
import HistoryModal from './../../components/quickreceipt/HistoryModal';
import SettingsModal from './../../components/quickreceipt/SettingsModal';
import { Printer, RefreshCw, Save, History, Check, Settings, Eye, EyeOff, ArrowLeft, Command } from 'lucide-react';
import { AdBanner } from '../AdBanner';

const STORAGE_KEYS = {
    PROFILE: 'quickreceipt_profile',
    HISTORY: 'quickreceipt_history',
    SERVICES: 'quickreceipt_services'
};

const QuickReceiptApp: React.FC = () => {
    // --- State Initialization with LocalStorage ---

    const [companyProfile, setCompanyProfile] = useState<CompanyProfile>(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEYS.PROFILE);
            return saved ? JSON.parse(saved) : DEFAULT_COMPANY;
        } catch (e) {
            console.error("Failed to load profile", e);
            return DEFAULT_COMPANY;
        }
    });

    const [servicesMasterList, setServicesMasterList] = useState<string[]>(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEYS.SERVICES);
            return saved ? JSON.parse(saved) : [
                "Consulting Fees", "Web Development", "Product Sale", "Graphic Design", "Maintenance Service"
            ];
        } catch (e) {
            return ["Consulting Fees", "Web Development", "Product Sale"];
        }
    });

    const [history, setHistory] = useState<ReceiptData[]>(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEYS.HISTORY);
            return saved ? JSON.parse(saved) : [];
        } catch (e) {
            return [];
        }
    });

    // Initialize Receipt Data based on the loaded profile (or defaults)
    const [receiptData, setReceiptData] = useState<ReceiptData>(() => {
        return {
            ...DEFAULT_RECEIPT,
            companyName: companyProfile.companyName,
            mobileNo: companyProfile.mobileNo,
            address: companyProfile.address,
            logo: companyProfile.logo,
            currency: companyProfile.currency,
            note: companyProfile.defaultNote,
            invoiceNo: `${companyProfile.invoicePrefix}-${Math.floor(Math.random() * 10000)}`
        };
    });

    // UI State
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [showSaveConfirm, setShowSaveConfirm] = useState(false);
    const [isPreviewMode, setIsPreviewMode] = useState(false);

    // --- Persistence Effects ---

    useEffect(() => {
        localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(companyProfile));
    }, [companyProfile]);

    useEffect(() => {
        localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history));
    }, [history]);

    useEffect(() => {
        localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(servicesMasterList));
    }, [servicesMasterList]);

    // --- Profile Logic ---

    const handleUpdateProfile = (newProfile: CompanyProfile) => {
        setCompanyProfile(newProfile);
        // Auto-update current form if it hasn't been heavily modified (simplistic check) or just update company fields
        setReceiptData(prev => ({
            ...prev,
            companyName: newProfile.companyName,
            mobileNo: newProfile.mobileNo,
            address: newProfile.address,
            logo: newProfile.logo,
            currency: newProfile.currency,
            note: prev.note === DEFAULT_COMPANY.defaultNote ? newProfile.defaultNote : prev.note // Only update note if it was default
        }));
    };

    // --- Service Logic ---

    const handleAddService = (newService: string) => {
        if (!servicesMasterList.some(s => s.toLowerCase() === newService.toLowerCase())) {
            const updatedList = [...servicesMasterList, newService];
            setServicesMasterList(updatedList);
        }
    };

    // --- Receipt Logic ---

    const handleSave = () => {
        const newEntry: ReceiptData = {
            ...receiptData,
            id: Date.now().toString(),
        };
        setHistory([newEntry, ...history]);
        setShowSaveConfirm(true);
        setTimeout(() => setShowSaveConfirm(false), 2000);
    };

    const handleLoadHistoryItem = (item: ReceiptData) => {
        setReceiptData(item);
        setIsHistoryOpen(false);
    };

    const handleDeleteHistoryItem = (id: string) => {
        if (confirm("Delete this receipt from history?")) {
            setHistory(history.filter(h => h.id !== id));
        }
    };

    const handlePrint = () => {
        window.print();
    };

    const handleReset = () => {
        if (confirm("Reset form to Company Defaults?")) {
            setReceiptData({
                ...DEFAULT_RECEIPT,
                companyName: companyProfile.companyName,
                mobileNo: companyProfile.mobileNo,
                address: companyProfile.address,
                logo: companyProfile.logo,
                currency: companyProfile.currency,
                note: companyProfile.defaultNote,
                invoiceNo: `${companyProfile.invoicePrefix}-${Math.floor(Math.random() * 10000)}`,
                items: [
                    { id: Date.now().toString(), serviceNo: '', description: servicesMasterList[0] || '', amount: 0 }
                ],
                totalAmount: 0,
                date: new Date().toISOString().slice(0, 19),
            });
        }
    }

    // Header Button Styles
    const iconBtnClass = "p-2.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100/80 rounded-xl transition-all active:scale-95";
    const labelBtnClass = "flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl transition-all active:scale-95";

    return (
        <div className="min-h-screen flex flex-col bg-gray-50 print:bg-white">

            {/* Modern Glass Navbar */}


            {/* Main Content */}
            {/* <main
                className={`bg-white flex-1 w-full mx-auto flex flex-col relative print:block
                ${isPreviewMode ? 'p-4 md:p-8' : 'max-w-7xl p-3 md:p-6 gap-6'}`}
            > */}
                <div className="w-full">

                     <div className="my-6 print:hidden">
                                    <AdBanner />
                                  </div>


                    <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md">

                        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 border-b pb-4 gap-4  print:hidden">
                            {/* Left: Brand */}
                            <div className="flex items-center gap-3">
                                {isPreviewMode ? (
                                    <button
                                        onClick={() => setIsPreviewMode(false)}
                                        className="flex items-center gap-2 text-gray-200 hover:text-white font-bold bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-xl transition-all"
                                    >
                                        <ArrowLeft className="w-4 h-4" />
                                        <span className="text-sm">Back to Editor</span>
                                    </button>
                                ) : (
                                    <div className="flex items-center gap-3 group cursor-default">
                                        {/* <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
                                    <Command className="w-5 h-5" />
                                </div> */}
                                        <div>
                                            <h1 className="text-lg font-bold text-gray-900 tracking-tight leading-none">QuickReceipt</h1>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Right: Actions */}
                            <div className="flex items-center gap-2 md:gap-3">
                                {!isPreviewMode && (
                                    <>
                                        {/* Secondary Actions */}
                                        <div className="flex items-center gap-1 bg-gray-100/50 p-1 rounded-2xl border border-gray-200/50">
                                            <button onClick={() => setIsSettingsOpen(true)} className={iconBtnClass} title="Settings">
                                                <Settings className="w-5 h-5" />
                                            </button>
                                            <button onClick={() => setIsHistoryOpen(true)} className={iconBtnClass} title="History">
                                                <History className="w-5 h-5" />
                                            </button>
                                            <button onClick={handleReset} className={iconBtnClass} title="Reset Form">
                                                <RefreshCw className="w-5 h-5" />
                                            </button>
                                        </div>

                                        <div className="w-px h-6 bg-gray-200 mx-1 hidden sm:block"></div>

                                        {/* Primary Actions */}
                                        <button
                                            onClick={handleSave}
                                            className={`${labelBtnClass} border border-gray-200 ${showSaveConfirm ? 'bg-green-50 text-green-700 border-green-200' : 'bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-300'} shadow-sm`}
                                        >
                                            {showSaveConfirm ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                                            <span className="hidden sm:inline">{showSaveConfirm ? 'Saved' : 'Save'}</span>
                                        </button>
                                    </>
                                )}

                                <button
                                    onClick={() => setIsPreviewMode(!isPreviewMode)}
                                    className={`${labelBtnClass} ${isPreviewMode ? 'bg-gray-900 text-white shadow-lg' : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900'}`}
                                    title={isPreviewMode ? "Exit Preview" : "Print Preview"}
                                >
                                    {isPreviewMode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    <span className="hidden sm:inline">{isPreviewMode ? 'Close' : 'Preview'}</span>
                                </button>

                                <button
                                    onClick={handlePrint}
                                    className={`${labelBtnClass} bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20 hover:shadow-blue-600/30 transform hover:-translate-y-0.5`}
                                >
                                    <Printer className="w-4 h-4" />
                                    <span className="hidden sm:inline">Print</span>
                                </button>
                            </div>
                            {/* </nav> */}
                        </div>


                        {/* Editor (Hidden in Preview Mode and Print Mode) */}
                        <section className={`w-full lg:w-[380px] xl:w-[420px] flex-shrink-0 print:hidden order-2 lg:order-1 transition-all duration-300 ${isPreviewMode ? 'hidden' : 'block'}`}>
                            <ReceiptForm
                                data={receiptData}
                                onChange={setReceiptData}
                                availableServices={servicesMasterList}
                                onAddService={handleAddService}
                            />
                        </section>

                        {/* Preview Area */}
                        <section className="flex flex-col items-center w-full flex-1 min-w-0 print:w-full print:block">

                            {/* Mobile Header for Preview */}
                            <div className={`w-full flex justify-between items-center mb-3 lg:hidden print:hidden px-1 ${isPreviewMode ? 'hidden' : 'block'}`}>
                                <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                                    <Eye className="w-3 h-3" /> Live Preview
                                </h2>
                            </div>

                            {/* Scrollable Container for Preview */}
                            <div
                                id="receipt-preview-container"
                                 className="
                                            w-full
                                            flex
                                             justify-center
                                            items-start
                                            overflow-x-auto
                                            overflow-y-auto
                                            py-6
                                            h-[calc(100vh-220px)]
                                            print:h-auto
                                            print:overflow-visible
                                            "
                                style={{
                                    scrollbarWidth: 'thin',
                                    scrollbarColor: '#d1d5db transparent',
                                }}
                            >
                                <div className="transition-all duration-300">
                                    <ReceiptPreview data={receiptData} />
                                </div>
                            </div>
                        </section>
                    </div>
                </div >

            {/* Modals - Wrapped with print:hidden */}
            < div className="print:hidden" >
                <HistoryModal
                    isOpen={isHistoryOpen}
                    onClose={() => setIsHistoryOpen(false)}
                    history={history}
                    onSelect={handleLoadHistoryItem}
                    onDelete={handleDeleteHistoryItem}
                />

                <SettingsModal
                    isOpen={isSettingsOpen}
                    onClose={() => setIsSettingsOpen(false)}
                    profile={companyProfile}
                    onUpdateProfile={handleUpdateProfile}
                    services={servicesMasterList}
                    onUpdateServices={setServicesMasterList}
                />
            </div >
        </div >
    );
};

export default QuickReceiptApp;