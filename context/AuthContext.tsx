import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from '../lib/firebase';
// Added @ts-ignore to fix: Module '"firebase/auth"' has no exported member 'onAuthStateChanged' and 'User'.
// @ts-ignore
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import type { UserProfile } from '../types';

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ user: null, userProfile: null, loading: true });

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribeSnapshot: (() => void) | null = null;

    const unsubscribeAuth = onAuthStateChanged(
      auth, 
      (currentUser) => {
        setUser(currentUser);
        
        if (unsubscribeSnapshot) {
          unsubscribeSnapshot();
          unsubscribeSnapshot = null;
        }

        if (currentUser) {
          try {
            const docRef = doc(db, 'users', currentUser.uid);
            unsubscribeSnapshot = onSnapshot(docRef, 
              (docSnap) => {
                if (docSnap.exists()) {
                  setUserProfile(docSnap.data() as UserProfile);
                } else {
                  setUserProfile(null);
                }
                setLoading(false);
              },
              (error) => {
                console.error("Profile Error:", error);
                setLoading(false);
              }
            );
          } catch (error) {
            console.error("Listener Error:", error);
            setLoading(false);
          }
        } else {
          setUserProfile(null);
          setLoading(false);
        }
      },
      (error) => {
        console.error("Auth Error:", error);
        setLoading(false);
      }
    );

    return () => {
      unsubscribeAuth();
      if (unsubscribeSnapshot) unsubscribeSnapshot();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, userProfile, loading }}>
      {loading ? (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 font-sans">
          <div className="flex flex-col items-center gap-6">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-indigo-100 rounded-full"></div>
              <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
            </div>
            <div className="text-center space-y-1">
              <p className="text-gray-900 font-black uppercase tracking-tighter text-xl">Invoicing Tool</p>
              <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Syncing secure session...</p>
            </div>
          </div>
        </div>
      ) : children}
    </AuthContext.Provider>
  );
};