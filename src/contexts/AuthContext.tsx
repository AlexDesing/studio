
'use client';

import type React from 'react';
import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, type User as FirebaseUser } from 'firebase/auth';
import { auth, db } from '@/lib/firebase/config';
import { doc, getDoc, DocumentData } from 'firebase/firestore';
import { Loader2 } from 'lucide-react';

interface UserProfile extends DocumentData {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL?: string | null;
  // Add other profile fields as needed
  notificationPreferences?: any; // Define more specific type later
}

interface AuthContextType {
  currentUser: UserProfile | null;
  loading: boolean;
  isManuallyCheckingAuth: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isManuallyCheckingAuth, setIsManuallyCheckingAuth] = useState(true);


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user: FirebaseUser | null) => {
      if (user) {
        const userDocRef = doc(db, 'users', user.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          setCurrentUser({ uid: user.uid, ...userDocSnap.data() } as UserProfile);
        } else {
          // This case might happen if user doc creation failed or if user was created directly in Firebase console
          // For now, just set basic info from FirebaseUser, ideally user doc should always exist
           setCurrentUser({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
          });
          console.warn(`User document not found for UID: ${user.uid}. Using basic FirebaseUser info.`);
        }
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
      setIsManuallyCheckingAuth(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading || isManuallyCheckingAuth) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ currentUser, loading, isManuallyCheckingAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
