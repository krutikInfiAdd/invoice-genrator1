import React, { useRef, useState, useEffect } from 'react';
import { CompanyProfile } from '../../types';
import { X, List, Building2, Trash2, Save, Database, Download, Upload, Phone, MapPin, Coins, Hash, FileText, Globe, ImagePlus, ChevronRight } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: CompanyProfile;
  onUpdateProfile: (p: CompanyProfile) => void;
  services: string[];
  onUpdateServices: (s: string[]) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ 
  isOpen, 
  onClose, 
  profile, 
  onUpdateProfile,
  services,
  onUpdateServices
}) => {
  const [activeTab, setActiveTab] = useState<'company' | 'services' | 'data'>('company');
  
  // Local state to hold changes before saving
  const [localProfile, setLocalProfile] = useState<CompanyProfile>(profile);
  const [localServices, setLocalServices] = useState<string[]>(services);
  
  const logoInputRef = useRef<HTMLInputElement>(null);
  const importInputRef = useRef<HTMLInputElement>(null);

  // Sync state when modal opens
  useEffect(() => {
    if (isOpen) {
        setLocalProfile(profile);
        setLocalServices(services);
    }
  }, [isOpen, profile, services]);

  if (!isOpen) return null;

  // --- Company Handlers (Updates Local State) ---

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setLocalProfile({ ...localProfile, [e.target.name]: e.target.value });
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
            setLocalProfile({ ...localProfile, logo: reader.result as string });
        };
        reader.readAsDataURL(file);
    }
  };

  const handleRemoveLogo = () => {
      setLocalProfile({ ...localProfile, logo: "" });
  };

  // --- Services Handlers (Updates Local State) ---

  const handleRemoveService = (index: number) => {
      const newServices = [...localServices];
      newServices.splice(index, 1);
      setLocalServices(newServices);
  };

  // --- Data Management Handlers ---

  const handleExportData = () => {
      const data = {
          profile: localProfile,
          services: localServices,
          history: JSON.parse(localStorage.getItem('quickreceipt_history') || '[]')
      };
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `quickreceipt_backup_${new Date().toISOString().slice(0,10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
  };

  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
          try {
              const data = JSON.parse(event.target?.result as string);
              if (data.profile && data.services && data.history) {
                  // Direct update to LocalStorage to ensure persistence
                  localStorage.setItem('quickreceipt_profile', JSON.stringify(data.profile));
                  localStorage.setItem('quickreceipt_services', JSON.stringify(data.services));
                  localStorage.setItem('quickreceipt_history', JSON.stringify(data.history));
                  alert("Data restored successfully! The page will reload.");
                  window.location.reload();
              } else {
                  alert("Invalid backup file.");
              }
          } catch (err) {
              alert("Error parsing backup file.");
          }
      };
      reader.readAsText(file);
  };

  // --- Save Handler ---

  const handleSaveChanges = () => {
      onUpdateProfile(localProfile);
      onUpdateServices(localServices);
      onClose();
  }

  // Modern Input Style
  const inputContainerClass = "group relative";
  const labelClass = "block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 ml-1";
  const inputClass = "w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400 font-medium";
  const sectionTitleClass = "text-sm font-bold text-gray-900 flex items-center gap-2 pb-2 mb-4 border-b border-gray-100";

  return (
    <div className="fixed inset-0 bg-gray-900/40 z-[100] flex items-center justify-center transition-all duration-300 no-print sm:p-6 backdrop-blur-sm">
      <div className="bg-white w-full h-full sm:h-auto sm:max-h-[90vh] sm:max-w-3xl sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 ring-1 ring-gray-900/5">
        
        {/* Modern Header */}
        <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-white flex-shrink-0">
          <div>
              <h2 className="text-xl font-bold text-gray-900 tracking-tight">Settings</h2>
              <p className="text-xs text-gray-500 font-medium mt-0.5">Manage company details & preferences</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modern Tabs */}
        <div className="px-6 pt-4 pb-0 bg-white">
            <div className="flex p-1.5 bg-gray-100/80 rounded-xl border border-gray-200/50">
                {[
                    { id: 'company', label: 'Company Profile', icon: Building2 },
                    { id: 'services', label: 'Services List', icon: List },
                    { id: 'data', label: 'Data & Backup', icon: Database },
                ].map((tab) => (
                    <button 
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`flex-1 py-2 text-sm font-semibold rounded-lg flex items-center justify-center gap-2 transition-all duration-200 ${
                            activeTab === tab.id 
                            ? 'bg-white text-blue-600 shadow-sm ring-1 ring-black/5' 
                            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'
                        }`}
                    >
                        <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'stroke-[2.5px]' : ''}`} /> 
                        <span className="hidden sm:inline">{tab.label}</span>
                    </button>
                ))}
            </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 bg-white scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
            
            {activeTab === 'company' && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    
                    {/* Identity Section */}
                    <div>
                        <h3 className={sectionTitleClass}><Globe className="w-4 h-4 text-blue-500" /> Brand Identity</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Logo Uploader */}
                            <div className="md:col-span-1 flex flex-col items-center justify-center">
                                <div className="relative group cursor-pointer w-32 h-32 mb-3" onClick={() => logoInputRef.current?.click()}>
                                    <div className={`w-full h-full rounded-2xl border-2 border-dashed flex items-center justify-center overflow-hidden transition-all ${localProfile.logo ? 'border-blue-200 bg-white' : 'border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50'}`}>
                                        {localProfile.logo ? (
                                            <img src={localProfile.logo} alt="Logo" className="w-full h-full object-contain p-2" />
                                        ) : (
                                            <div className="text-center text-gray-400">
                                                <ImagePlus className="w-8 h-8 mx-auto mb-1" />
                                                <span className="text-[10px] font-bold uppercase">Upload</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="absolute inset-0 bg-black/40 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-medium text-xs">
                                        Change Logo
                                    </div>
                                </div>
                                {localProfile.logo && (
                                    <button onClick={handleRemoveLogo} className="text-xs text-red-500 hover:text-red-600 font-medium hover:underline">
                                        Remove Logo
                                    </button>
                                )}
                                <input type="file" ref={logoInputRef} onChange={handleLogoUpload} className="hidden" accept="image/*"/>
                            </div>

                            {/* Main Details */}
                            <div className="md:col-span-2 space-y-4">
                                <div className={inputContainerClass}>
                                    <label className={labelClass}>Company Name</label>
                                    <input name="companyName" value={localProfile.companyName} onChange={handleProfileChange} className={inputClass} placeholder="e.g. Acme Corp" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className={inputContainerClass}>
                                        <label className={labelClass}>Invoice Prefix</label>
                                        <div className="relative">
                                            <Hash className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                                            <input name="invoicePrefix" value={localProfile.invoicePrefix} onChange={handleProfileChange} className={`${inputClass} pl-9`} placeholder="INV" />
                                        </div>
                                    </div>
                                    <div className={inputContainerClass}>
                                        <label className={labelClass}>Currency</label>
                                        <div className="relative">
                                            <Coins className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                                            <input name="currency" value={localProfile.currency} onChange={handleProfileChange} className={`${inputClass} pl-9`} placeholder="USD" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Section */}
                    <div>
                         <h3 className={sectionTitleClass}><Phone className="w-4 h-4 text-blue-500" /> Contact Details</h3>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className={inputContainerClass}>
                                <label className={labelClass}>Mobile Number</label>
                                <input name="mobileNo" value={localProfile.mobileNo} onChange={handleProfileChange} className={inputClass} placeholder="+1 234 567 890" />
                            </div>
                            <div className={`${inputContainerClass} md:col-span-2`}>
                                <label className={labelClass}>Address</label>
                                <textarea name="address" value={localProfile.address} onChange={handleProfileChange} className={inputClass} rows={2} placeholder="Office address..." />
                            </div>
                         </div>
                    </div>

                    {/* Footer Section */}
                    <div>
                         <h3 className={sectionTitleClass}><FileText className="w-4 h-4 text-blue-500" /> Default Footer Note</h3>
                         <div className={inputContainerClass}>
                             <textarea name="defaultNote" value={localProfile.defaultNote} onChange={handleProfileChange} className={inputClass} rows={2} placeholder="Thank you for your business..." />
                             <p className="text-[10px] text-gray-400 mt-1 ml-1">This note will appear on all new receipts automatically.</p>
                         </div>
                    </div>
                </div>
            )}

            {activeTab === 'services' && (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 flex gap-3 items-start">
                        <List className="w-5 h-5 text-blue-600 mt-0.5" />
                        <div>
                            <h4 className="text-sm font-bold text-blue-900">Manage Services</h4>
                            <p className="text-xs text-blue-700 mt-0.5">These services will appear in the autocomplete dropdown when creating a receipt.</p>
                        </div>
                    </div>
                    
                    <div className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
                        <div className="max-h-[400px] overflow-y-auto divide-y divide-gray-100">
                            {localServices.length === 0 && (
                                <div className="p-8 text-center text-gray-400">
                                    <List className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                    <p className="text-sm">No saved services found.</p>
                                </div>
                            )}
                            {localServices.map((s, i) => (
                                <div key={i} className="group p-3 pl-4 flex justify-between items-center hover:bg-white transition-colors">
                                    <span className="text-sm font-medium text-gray-700">{s}</span>
                                    <button 
                                        onClick={() => handleRemoveService(i)} 
                                        className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                                        title="Remove Service"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                    <p className="text-xs text-center text-gray-400">Services are automatically added here when you create new ones in the editor.</p>
                </div>
            )}

             {activeTab === 'data' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Export Card */}
                        <div 
                            onClick={handleExportData}
                            className="group relative p-6 bg-white border border-gray-200 hover:border-blue-400 rounded-2xl shadow-sm hover:shadow-md transition-all cursor-pointer overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <Download className="w-24 h-24 text-blue-600 -mr-8 -mt-8 transform rotate-12" />
                            </div>
                            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 mb-4 group-hover:scale-110 transition-transform">
                                <Download className="w-5 h-5" />
                            </div>
                            <h3 className="font-bold text-gray-900 mb-1">Backup Data</h3>
                            <p className="text-xs text-gray-500 leading-relaxed mb-4">
                                Download a JSON file containing all your settings, history, and services.
                            </p>
                            <span className="inline-flex items-center text-xs font-bold text-blue-600 group-hover:translate-x-1 transition-transform">
                                Download Backup <ChevronRight className="w-3 h-3 ml-1" />
                            </span>
                        </div>

                         {/* Import Card */}
                         <div 
                            onClick={() => importInputRef.current?.click()}
                            className="group relative p-6 bg-white border border-gray-200 hover:border-orange-400 rounded-2xl shadow-sm hover:shadow-md transition-all cursor-pointer overflow-hidden"
                        >
                             <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <Upload className="w-24 h-24 text-orange-600 -mr-8 -mt-8 transform rotate-12" />
                            </div>
                            <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-orange-600 mb-4 group-hover:scale-110 transition-transform">
                                <Upload className="w-5 h-5" />
                            </div>
                            <h3 className="font-bold text-gray-900 mb-1">Restore Data</h3>
                            <p className="text-xs text-gray-500 leading-relaxed mb-4">
                                Upload a previously saved JSON file to restore your app data.
                            </p>
                            <span className="inline-flex items-center text-xs font-bold text-orange-600 group-hover:translate-x-1 transition-transform">
                                Select File <ChevronRight className="w-3 h-3 ml-1" />
                            </span>
                            <input 
                                type="file" 
                                ref={importInputRef} 
                                onChange={handleImportData} 
                                className="hidden" 
                                accept=".json"
                            />
                        </div>
                    </div>
                    
                    <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-100">
                        <h4 className="text-xs font-bold text-yellow-800 uppercase mb-1">Important Note</h4>
                        <p className="text-xs text-yellow-700">Restoring data will overwrite your current settings and history immediately. The page will reload after a successful restore.</p>
                    </div>
                </div>
            )}
        </div>

        {/* Floating Footer */}
        <div className="p-4 sm:px-6 sm:py-4 border-t border-gray-100 bg-white/80 backdrop-blur-md flex justify-end gap-3 flex-shrink-0 z-10">
            <button 
                onClick={onClose}
                className="px-5 py-2.5 text-sm font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors"
            >
                Cancel
            </button>
            <button 
                onClick={handleSaveChanges}
                className="px-6 py-2.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-lg shadow-blue-600/20 hover:shadow-blue-600/30 flex items-center gap-2 transition-all transform active:scale-95"
            >
                <Save className="w-4 h-4" />
                Save Changes
            </button>
        </div>

      </div>
    </div>
  );
};

export default SettingsModal;