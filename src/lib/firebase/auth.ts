
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  sendPasswordResetEmail,
  updateProfile as updateFirebaseProfile,
  type User as FirebaseUser,
} from 'firebase/auth';
import { auth, db } from './config';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';

const googleProvider = new GoogleAuthProvider();

export const signUpWithEmail = async (email: string, password: string, displayName: string) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;
  
  // Update Firebase Auth profile
  await updateFirebaseProfile(user, { displayName });

  // Create user document in Firestore
  const userDocRef = doc(db, 'users', user.uid);
  await setDoc(userDocRef, {
    uid: user.uid,
    displayName: displayName,
    email: user.email,
    photoURL: user.photoURL || null, // Default or placeholder photo
    createdAt: serverTimestamp(),
    preferences: { // Default preferences
        notifications: {
            taskReminders: true,
            dailyTips: true,
            affirmationReady: true,
            motivationalPhrases: true,
            selfCareReminders: true,
        },
        theme: 'light', // 'light', 'dark', 'system'
    }
  });
  return user;
};

export const signInWithEmail = async (email: string, password: string) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
};

export const signInWithGoogle = async () => {
  const result = await signInWithPopup(auth, googleProvider);
  const user = result.user;

  // Check if user exists in Firestore, if not, create them
  const userDocRef = doc(db, 'users', user.uid);
  const userDocSnap = await getDoc(userDocRef);

  if (!userDocSnap.exists()) {
    await setDoc(userDocRef, {
      uid: user.uid,
      displayName: user.displayName,
      email: user.email,
      photoURL: user.photoURL,
      createdAt: serverTimestamp(),
      preferences: { // Default preferences
        notifications: {
            taskReminders: true,
            dailyTips: true,
            affirmationReady: true,
            motivationalPhrases: true,
            selfCareReminders: true,
        },
        theme: 'light',
      }
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

export const updateUserProfile = async (user: FirebaseUser, profileData: { displayName?: string; photoURL?: string }) => {
  if (!user) throw new Error("User not authenticated");

  // Update Firebase Auth profile
  if (profileData.displayName || profileData.photoURL) {
    await updateFirebaseProfile(user, profileData);
  }

  // Update Firestore user document
  const userDocRef = doc(db, 'users', user.uid);
  const updateData: { displayName?: string; photoURL?: string } = {};
  if (profileData.displayName) updateData.displayName = profileData.displayName;
  if (profileData.photoURL) updateData.photoURL = profileData.photoURL;
  
  if (Object.keys(updateData).length > 0) {
    await setDoc(userDocRef, updateData, { merge: true });
  }
};
