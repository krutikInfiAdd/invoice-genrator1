
import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from '../lib/firebase';
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
        
        // Clean up previous listener if it exists
        if (unsubscribeSnapshot) {
          unsubscribeSnapshot();
          unsubscribeSnapshot = null;
        }

        if (currentUser) {
          try {
            const docRef = doc(db, 'users', currentUser.uid);
            
            // Subscribe to real-time updates
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
                console.error("Error fetching user profile:", error);
                if (error.code === 'permission-denied') {
                  console.error("CRITICAL ERROR: Firestore permissions denied. Please go to Firebase Console -> Firestore Database -> Rules and allow read/write access for authenticated users.");
                }
                setUserProfile(null);
                setLoading(false);
              }
            );
          } catch (error) {
            console.error("Error setting up profile listener:", error);
            setLoading(false);
          }
        } else {
          setUserProfile(null);
          setLoading(false);
        }
      },
      (error) => {
        console.error("Firebase Auth Initialization Error:", error);
        setUser(null);
        setUserProfile(null);
        setLoading(false);
      }
    );

    return () => {
      unsubscribeAuth();
      if (unsubscribeSnapshot) {
        unsubscribeSnapshot();
      }
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, userProfile, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
