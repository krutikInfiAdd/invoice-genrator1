
import React, { useState } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Textarea } from './ui/Textarea';
import { FileInput } from './ui/FileInput';
import { XIcon } from './icons/XIcon';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialView?: 'login' | 'signup';
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, initialView = 'login' }) => {
  const [view, setView] = useState<'login' | 'signup'>(initialView);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Additional fields for Registration
  const [companyName, setCompanyName] = useState('');
  const [companyAddress, setCompanyAddress] = useState('');
  const [gstin, setGstin] = useState('');
  const [logo, setLogo] = useState<string | null>(null);

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (view === 'signup') {
        if (!companyName.trim() || !companyAddress.trim()) {
          throw new Error("Company Name and Address are required for registration.");
        }

        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Save User Profile to Firestore
        await setDoc(doc(db, 'users', user.uid), {
          companyName,
          companyAddress,
          gstin: gstin || null,
          logo: logo || null,
          email: email, // Store email for easier debugging/admin access if needed
          defaultNotes: "Thank you for your business!",
          defaultTerms: "Payment is due within 30 days. Late payments are subject to a fee.",
          createdAt: new Date().toISOString()
        });

      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      onClose();
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/email-already-in-use') {
        setError('This email is already in use.');
      } else if (err.code === 'auth/configuration-not-found' || err.code === 'auth/project-not-found') {
        setError('Firebase configuration error. The project ID in firebase.ts may be invalid.');
      } else {
        setError(err.message || 'An error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg shadow-xl w-full max-w-md relative my-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 z-10"
        >
          <XIcon className="w-6 h-6" />
        </button>

        <div className="p-8">
          <h2 className="text-2xl font-bold text-center mb-6">
            {view === 'login' ? 'Welcome Back' : 'Create Account'}
          </h2>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Standard Auth Fields */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <Input 
                type="email" 
                required 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <Input 
                type="password" 
                required 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                minLength={6}
              />
            </div>

            {/* Sign Up Specific Fields */}
            {view === 'signup' && (
              <>
                <div className="border-t pt-4 mt-2">
                  <p className="text-sm text-gray-500 mb-3">Company Details (for Invoice Auto-fill)</p>
                </div>

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
                    rows={2}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">GSTIN (Optional)</label>
                  <Input 
                    value={gstin} 
                    onChange={(e) => setGstin(e.target.value)}
                    placeholder="22AAAAA0000A1Z5"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Company Logo (Optional)</label>
                  <FileInput 
                    accept="image/*"
                    onChange={handleLogoChange}
                  />
                </div>
              </>
            )}

            <Button type="submit" className="w-full mt-4" disabled={loading}>
              {loading ? 'Processing...' : (view === 'login' ? 'Log In' : 'Register & Save Details')}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600">
            {view === 'login' ? (
              <>
                Don't have an account?{' '}
                <button onClick={() => setView('signup')} className="text-indigo-600 font-semibold hover:underline">
                  Sign up
                </button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button onClick={() => setView('login')} className="text-indigo-600 font-semibold hover:underline">
                  Log in
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
