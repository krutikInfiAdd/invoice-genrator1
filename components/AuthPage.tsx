
import React, { useState } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Textarea } from './ui/Textarea';
import { FileInput } from './ui/FileInput';

interface AuthPageProps {
  onSuccess: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onSuccess }) => {
  const [view, setView] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Additional fields for Registration
  const [companyName, setCompanyName] = useState('');
  const [companyAddress, setCompanyAddress] = useState('');
  const [gstin, setGstin] = useState('');
  const [logo, setLogo] = useState<string | null>(null);

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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
        // Note: This requires Firestore Rules to allow writes to /users/{uid}
        await setDoc(doc(db, 'users', user.uid), {
          companyName,
          companyAddress,
          gstin: gstin || null,
          logo: logo || null,
          email: email,
          defaultNotes: "Thank you for your business!",
          defaultTerms: "Payment is due within 30 days. Late payments are subject to a fee.",
          createdAt: new Date().toISOString()
        });

      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      onSuccess();
    } catch (err: any) {
      console.error("Auth Error Details:", err);
      
      if (err.code === 'auth/email-already-in-use') {
        setError('This email is already in use.');
      } else if (err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
         setError('Invalid email or password.');
      } else if (err.code === 'auth/operation-not-allowed') {
        setError('Login Failed: Email/Password authentication is not enabled in the Firebase Console.');
      } else if (err.code === 'auth/configuration-not-found') {
        setError('Setup Required: Please go to the Firebase Console -> Authentication -> Sign-in method and enable the "Email/Password" provider.');
      } else if (
        err.code === 'auth/project-not-found' || 
        err.code === 'auth/invalid-api-key'
      ) {
        setError('System Error: Firebase configuration is likely mismatched or invalid (check import maps).');
      } else if (err.code === 'permission-denied' || err.message?.includes('Missing or insufficient permissions')) {
        setError('Database Permission Error: Go to Firebase Console > Firestore Database > Rules. Change rules to: allow read, write: if request.auth != null;');
      } else if (err.code === 'auth/network-request-failed') {
        setError('Network Error: Please check your internet connection.');
      } else {
        setError(err.message || 'An error occurred during authentication.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden mt-8">
      <div className="p-8">
        <h2 className="text-2xl font-bold text-center mb-6">
          {view === 'login' ? 'Welcome Back' : 'Create Account'}
        </h2>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4 text-sm border border-red-100">
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
  );
};
