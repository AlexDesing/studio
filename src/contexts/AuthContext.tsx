
'use client';

import type React from 'react';
import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, type User as FirebaseUser } from 'firebase/auth';
import { auth, db } from '@/lib/firebase/config';
import { doc, getDoc, type DocumentData } from 'firebase/firestore';
import { Loader2 } from 'lucide-react';
import { createUserProfileDocument, type UserProfileData } from '@/lib/firebase/firestore/users'; // Import createUserProfileDocument

// Define a consistent UserProfile type, aligning with UserProfileData
interface UserProfile extends UserProfileData {
  // Ensure all fields from UserProfileData are here or optional
  // For example, if preferences can sometimes be undefined before creation:
  preferences: NonNullable<UserProfileData['preferences']>; // Make preferences non-nullable here
  photoURL: string | null; // Ensure photoURL is string | null
}

interface AuthContextType {
  currentUser: UserProfile | null;
  loading: boolean;
  isManuallyCheckingAuth: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const defaultUserPreferences: NonNullable<UserProfileData['preferences']> = {
  notifications: {
    taskReminders: true,
    dailyTips: true,
    affirmationReady: true,
    motivationalPhrases: true,
    selfCareReminders: true,
  },
  theme: 'light',
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isManuallyCheckingAuth, setIsManuallyCheckingAuth] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user: FirebaseUser | null) => {
      if (user) {
        const userDocRef = doc(db, 'users', user.uid);
        let userDocSnap = await getDoc(userDocRef);

        if (!userDocSnap.exists()) {
          console.warn(`User document not found for UID: ${user.uid}. Attempting to create it.`);
          try {
            await createUserProfileDocument(user.uid, {
              email: user.email,
              displayName: user.displayName || 'Usuario MovaZen', // Default display name
              photoURL: user.photoURL || null, 
            });
            userDocSnap = await getDoc(userDocRef); 

            if (userDocSnap.exists()) {
              const data = userDocSnap.data();
              setCurrentUser({ 
                uid: user.uid, 
                ...data, 
                photoURL: data.photoURL || null, 
                preferences: data.preferences || defaultUserPreferences 
              } as UserProfile);
            } else {
              console.error(`Failed to create or find user document for UID: ${user.uid} after attempt. Using basic FirebaseUser info with default preferences.`);
              setCurrentUser({
                uid: user.uid,
                email: user.email,
                displayName: user.displayName || 'Usuario MovaZen',
                photoURL: user.photoURL || null, 
                createdAt: new Date(), 
                preferences: defaultUserPreferences,
              } as UserProfile);
            }
          } catch (creationError) {
            console.error(`Error creating user document for UID: ${user.uid}:`, creationError);
            setCurrentUser({
              uid: user.uid,
              email: user.email,
              displayName: user.displayName || 'Usuario MovaZen',
              photoURL: user.photoURL || null, 
              createdAt: new Date(), 
              preferences: defaultUserPreferences,
            } as UserProfile);
          }
        } else {
          const data = userDocSnap.data();
          setCurrentUser({ 
            uid: user.uid, 
            ...data, 
            photoURL: data.photoURL || null, 
            preferences: data.preferences || defaultUserPreferences 
          } as UserProfile);
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
