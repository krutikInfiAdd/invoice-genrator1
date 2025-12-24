import React, { useState } from 'react';
// @ts-ignore
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
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
  const [view, setView] = useState<'login' | 'signup' | 'forgot-password'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [companyName, setCompanyName] = useState('');
  const [companyAddress, setCompanyAddress] = useState('');
  const [gstin, setGstin] = useState('');
  const [logo, setLogo] = useState<string | null>(null);

  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogoChange = (file: File | null) => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setLogo(reader.result as string);
      reader.readAsDataURL(file);
    } else setLogo(null);
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setMessage(''); setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage('Reset link sent to your email.');
    } catch (err: any) {
      setError('Failed to send reset email.');
    } finally { setLoading(false); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setMessage(''); setLoading(true);

    try {
      if (view === 'signup') {
        if (!companyName.trim() || !companyAddress.trim()) throw new Error("Business name and address are required.");
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await setDoc(doc(db, 'users', userCredential.user.uid), {
          companyName, companyAddress, gstin: gstin || null, logo: logo || null, email: email,
          defaultNotes: "Thank you for your business!", defaultTerms: "Payment due within 30 days.",
          createdAt: new Date().toISOString()
        });
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Authentication failed.');
    } finally { setLoading(false); }
  };

  if (view === 'forgot-password') {
    return (
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden mt-8 border border-gray-100 animate-fade-in">
        <div className="p-8 text-center">
          <h2 className="text-2xl font-black text-indigo-900 uppercase tracking-tight mb-6">Reset Password</h2>
          {error && <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6 text-sm">{error}</div>}
          {message && <div className="bg-green-50 text-green-700 p-4 rounded-lg mb-6 text-sm">{message}</div>}
          <form onSubmit={handleResetPassword} className="space-y-4 text-left">
            <Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email address" />
            <Button type="submit" className="w-full font-black py-3" disabled={loading}>{loading ? 'Sending...' : 'Send Reset Link'}</Button>
          </form>
          <button onClick={() => setView('login')} className="mt-6 text-indigo-600 font-bold text-sm">← Back to Sign In</button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden mt-8 border border-gray-100 animate-fade-in">
      <div className="p-8">
        <h2 className="text-2xl font-black text-center mb-6 text-indigo-900 uppercase tracking-tight">
          {view === 'login' ? 'Sign In' : 'Create Account'}
        </h2>
        {error && <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6 text-sm">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
          <Input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" minLength={6} />
          {view === 'signup' && (
            <>
              <div className="border-t pt-4 mt-2"><p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-3">Company Setup</p></div>
              <Input required value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="Company Name" />
              <Textarea required value={companyAddress} onChange={(e) => setCompanyAddress(e.target.value)} placeholder="Address" rows={2} />
              <Input value={gstin} onChange={(e) => setGstin(e.target.value)} placeholder="GSTIN (Optional)" />
              <FileInput accept="image/*" onChange={handleLogoChange} />
            </>
          )}
          <Button type="submit" className="w-full py-3 font-black" disabled={loading}>{loading ? 'Wait...' : (view === 'login' ? 'Login' : 'Join Now')}</Button>
        </form>
        <div className="mt-8 text-center text-sm font-bold text-gray-500">
          {view === 'login' ? (
            <>New here? <button onClick={() => setView('signup')} className="text-indigo-600">Create Account</button></>
          ) : (
            <>Registered? <button onClick={() => setView('login')} className="text-indigo-600">Log in</button></>
          )}
        </div>
      </div>
    </div>
  );
};