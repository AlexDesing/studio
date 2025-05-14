
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  sendPasswordResetEmail,
  updateProfile as updateFirebaseProfile, // Renamed to avoid conflict if you also named yours updateProfile
  type User as FirebaseUser,
} from 'firebase/auth';
import { auth, db } from './config';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import type { UserProfileData } from './firestore/users'; // Import UserProfileData

const googleProvider = new GoogleAuthProvider();

export const signUpWithEmail = async (email: string, password: string, displayName: string) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;
  
  // Update Firebase Auth profile
  await updateFirebaseProfile(user, { displayName, photoURL: user.photoURL || null }); // Ensure photoURL is at least null

  // Create user document in Firestore - this is handled by createUserProfileDocument in AuthContext or directly
  // For robustness, ensure it's called if not handled elsewhere, or rely on AuthContext's logic
  const userDocRef = doc(db, 'users', user.uid);
   const defaultPreferences: NonNullable<UserProfileData['preferences']> = {
    notifications: {
      taskReminders: true,
      dailyTips: true,
      affirmationReady: true,
      motivationalPhrases: true,
      selfCareReminders: true,
    },
    theme: 'light',
  };
  await setDoc(userDocRef, {
    uid: user.uid,
    displayName: displayName,
    email: user.email,
    photoURL: user.photoURL || null,
    createdAt: serverTimestamp(),
    preferences: defaultPreferences
  }, { merge: true }); // Use merge to be safe if doc somehow exists
  return user;
};

export const signInWithEmail = async (email: string, password: string) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
};

export const signInWithGoogle = async () => {
  const result = await signInWithPopup(auth, googleProvider);
  const user = result.user;

  const userDocRef = doc(db, 'users', user.uid);
  const userDocSnap = await getDoc(userDocRef);

  if (!userDocSnap.exists()) {
    const defaultPreferences: NonNullable<UserProfileData['preferences']> = {
      notifications: {
        taskReminders: true,
        dailyTips: true,
        affirmationReady: true,
        motivationalPhrases: true,
        selfCareReminders: true,
      },
      theme: 'light',
    };
    await setDoc(userDocRef, {
      uid: user.uid,
      displayName: user.displayName,
      email: user.email,
      photoURL: user.photoURL || null,
      createdAt: serverTimestamp(),
      preferences: defaultPreferences
    });
  }
  return user;
};

export const logout = async () => {
  await signOut(auth);
};

export const resetPassword = async (email: string) => {
  await sendPasswordResetEmail(auth, email);
};

// This function now ONLY updates the Firebase Auth user profile.
// Firestore document updates are handled by updateUserProfileDocument from users.ts.
export const updateUserProfile = async (user: FirebaseUser, profileData: { displayName?: string; photoURL?: string | null }) => {
  if (!user) throw new Error("User not authenticated");

  // Construct an update object that only includes defined values, or null for photoURL
  const authUpdateData: { displayName?: string; photoURL?: string | null} = {};
  if (profileData.displayName !== undefined) {
    authUpdateData.displayName = profileData.displayName;
  }
  if (profileData.photoURL !== undefined) { // Can be null to remove photo
    authUpdateData.photoURL = profileData.photoURL;
  }
  
  if (Object.keys(authUpdateData).length > 0) {
    await updateFirebaseProfile(user, authUpdateData);
  }
};
