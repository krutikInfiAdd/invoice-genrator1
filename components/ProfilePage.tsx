
import React, { useState, useEffect } from 'react';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Textarea } from './ui/Textarea';
import { FileInput } from './ui/FileInput';

export const ProfilePage: React.FC = () => {
  const { user, userProfile } = useAuth();
  
  const [companyName, setCompanyName] = useState('');
  const [companyAddress, setCompanyAddress] = useState('');
  const [gstin, setGstin] = useState('');
  const [logo, setLogo] = useState<string | null>(null);
  const [defaultNotes, setDefaultNotes] = useState('');
  const [defaultTerms, setDefaultTerms] = useState('');
  
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Load existing profile data into form
  useEffect(() => {
    if (userProfile) {
      setCompanyName(userProfile.companyName || '');
      setCompanyAddress(userProfile.companyAddress || '');
      setGstin(userProfile.gstin || '');
      setLogo(userProfile.logo || null);
      setDefaultNotes(userProfile.defaultNotes || '');
      setDefaultTerms(userProfile.defaultTerms || '');
    }
  }, [userProfile]);

  const handleLogoChange = (file: File | null) => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogo(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setLogo(null);
    }
  };

  const handleRemoveLogo = () => {
    setLogo(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSaving(true);
    setMessage(null);

    try {
      if (!companyName.trim() || !companyAddress.trim()) {
        throw new Error("Company Name and Address are required.");
      }

      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, {
        companyName,
        companyAddress,
        gstin: gstin || null,
        logo: logo || null,
        defaultNotes,
        defaultTerms,
        updatedAt: new Date().toISOString()
      }, { merge: true });

      setMessage({ text: 'Profile updated successfully!', type: 'success' });
      
      // Clear success message after 3 seconds
      setTimeout(() => setMessage(null), 3000);
    } catch (error: any) {
      console.error("Error saving profile:", error);
      setMessage({ 
        text: error.message || 'Failed to save profile. Please try again.', 
        type: 'error' 
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500">Please log in to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-2 text-gray-900">Company Profile</h1>
      <p className="text-gray-500 mb-8">Manage your business details and defaults for auto-filling invoices.</p>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6 sm:p-8">
          {message && (
            <div className={`p-4 rounded-md mb-6 text-sm font-medium ${
              message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
            }`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Login Email</label>
              <Input 
                type="email" 
                value={user.email || ''} 
                disabled 
                className="bg-gray-50 text-gray-500 cursor-not-allowed"
              />
              <p className="text-xs text-gray-500 mt-1">Your email cannot be changed.</p>
            </div>

            <div className="border-t pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Business Details</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                  <Input 
                    required 
                    value={companyName} 
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Your Business Name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <Textarea 
                    required 
                    value={companyAddress} 
                    onChange={(e) => setCompanyAddress(e.target.value)}
                    placeholder="Business Address"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">GSTIN (Optional)</label>
                  <Input 
                    value={gstin} 
                    onChange={(e) => setGstin(e.target.value)}
                    placeholder="GST Identification Number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Company Logo</label>
                  {logo ? (
                    <div className="flex items-center gap-4 mb-2">
                      <img src={logo} alt="Current Logo" className="h-16 w-auto max-w-32 object-contain border rounded p-1 bg-gray-50" />
                      <Button type="button" variant="outline" size="sm" onClick={handleRemoveLogo}>
                        Remove
                      </Button>
                    </div>
                  ) : null}
                  
                  <FileInput 
                    accept="image/*"
                    onChange={handleLogoChange}
                  />
                  <p className="text-xs text-gray-500 mt-1">Upload a new logo to replace the current one.</p>
                </div>
              </div>
            </div>

            <div className="border-t pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Defaults</h3>
              <p className="text-sm text-gray-500 mb-4">These values will be automatically filled in when you create a new invoice.</p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Default Notes</label>
                  <Textarea 
                    value={defaultNotes} 
                    onChange={(e) => setDefaultNotes(e.target.value)}
                    placeholder="e.g. Thank you for your business!"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Default Terms & Conditions</label>
                  <Textarea 
                    value={defaultTerms} 
                    onChange={(e) => setDefaultTerms(e.target.value)}
                    placeholder="e.g. Payment is due within 30 days."
                    rows={3}
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-end gap-4">
              <Button type="submit" disabled={isSaving} className="min-w-[120px]">
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};