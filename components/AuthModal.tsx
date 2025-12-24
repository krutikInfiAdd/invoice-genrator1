
import React, { useState } from 'react';
// @ts-ignore
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
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
  const [view, setView] = useState<'login' | 'signup' | 'forgot-password'>(initialView);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [companyName, setCompanyName] = useState('');
  const [companyAddress, setCompanyAddress] = useState('');
  const [gstin, setGstin] = useState('');
  const [logo, setLogo] = useState<string | null>(null);

  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
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

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      await sendPasswordResetEmail(auth, email);
      setMessage('Reset link sent! Please check your email.');
    } catch (err: any) {
      console.error("Reset Error:", err);
      setError(err.code === 'auth/user-not-found' ? 'User not found.' : 'Error sending reset email.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      if (view === 'signup') {
        if (!companyName.trim() || !companyAddress.trim()) {
          throw new Error("Company Name and Address are required.");
        }

        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        await setDoc(doc(db, 'users', user.uid), {
          companyName,
          companyAddress,
          gstin: gstin || null,
          logo: logo || null,
          email: email,
          defaultNotes: "Thank you for your business!",
          defaultTerms: "Payment is due within 30 days.",
          createdAt: new Date().toISOString()
        });

      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      onClose();
    } catch (err: any) {
      console.error("Auth Error:", err);
      const errorCode = err.code;

      if (errorCode === 'auth/email-already-in-use') {
        setError('Email already exists. Please log in.');
      } else if (
        errorCode === 'auth/invalid-credential' || 
        errorCode === 'auth/wrong-password' || 
        errorCode === 'auth/user-not-found'
      ) {
        setError('Incorrect email or password.');
      } else if (errorCode === 'auth/weak-password') {
        setError('Password too weak (min 6 chars).');
      } else if (errorCode === 'permission-denied') {
        setError('Firestore Rules error: Permission denied.');
      } else {
        setError(err.message || 'Authentication failed.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative my-8 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-10 p-1"
        >
          <XIcon className="w-6 h-6" />
        </button>

        <div className="p-8">
          <h2 className="text-2xl font-black text-center mb-6 text-indigo-900 uppercase">
            {view === 'login' ? 'Login' : view === 'signup' ? 'Create Account' : 'Reset Password'}
          </h2>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-sm border border-red-100">
              {error}
            </div>
          )}

          {message && (
            <div className="bg-green-50 text-green-600 p-3 rounded-lg mb-6 text-sm border border-green-100">
              {message}
            </div>
          )}

          {view === 'forgot-password' ? (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Email Address</label>
                <Input 
                  type="email" 
                  required 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                />
              </div>
              <Button type="submit" className="w-full mt-4 py-3 font-bold" disabled={loading}>
                {loading ? 'Sending...' : 'Reset Password'}
              </Button>
              <div className="text-center mt-4">
                <button type="button" onClick={() => setView('login')} className="text-sm font-bold text-indigo-600 hover:underline">
                  Back to Login
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Email</label>
                <Input 
                  type="email" 
                  required 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-sm font-bold text-gray-700">Password</label>
                  {view === 'login' && (
                    <button 
                      type="button" 
                      onClick={() => setView('forgot-password')} 
                      className="text-xs font-bold text-indigo-600 hover:underline"
                    >
                      Forgot Password?
                    </button>
                  )}
                </div>
                <Input 
                  type="password" 
                  required 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  minLength={6}
                />
              </div>

              {view === 'signup' && (
                <>
                  <div className="border-t pt-4 mt-2">
                    <p className="text-xs font-black text-indigo-400 uppercase tracking-widest mb-3">Company Details</p>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Business Name</label>
                    <Input 
                      required 
                      value={companyName} 
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="Your Business Name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Address</label>
                    <Textarea 
                      required 
                      value={companyAddress} 
                      onChange={(e) => setCompanyAddress(e.target.value)}
                      placeholder="Business Address"
                      rows={2}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">GSTIN (Optional)</label>
                    <Input 
                      value={gstin} 
                      onChange={(e) => setGstin(e.target.value)}
                      placeholder="22AAAAA0000A1Z5"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Logo (Optional)</label>
                    <FileInput 
                      accept="image/*"
                      onChange={handleLogoChange}
                    />
                  </div>
                </>
              )}

              <Button type="submit" className="w-full mt-4 py-3 font-bold" disabled={loading}>
                {loading ? 'Wait...' : (view === 'login' ? 'Sign In' : 'Register Now')}
              </Button>
            </form>
          )}

          {view !== 'forgot-password' && (
            <div className="mt-6 text-center text-sm text-gray-600">
              {view === 'login' ? (
                <>
                  New here?{' '}
                  <button onClick={() => setView('signup')} className="text-indigo-600 font-bold hover:underline">
                    Sign up
                  </button>
                </>
              ) : (
                <>
                  Already registered?{' '}
                  <button onClick={() => setView('login')} className="text-indigo-600 font-bold hover:underline">
                    Log in
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
