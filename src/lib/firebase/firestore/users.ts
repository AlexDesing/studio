
import { db } from '../config';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp, type DocumentData } from 'firebase/firestore';

export interface UserProfileData extends DocumentData {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL?: string | null;
  createdAt: any; // serverTimestamp()
  preferences?: {
    notifications?: {
      taskReminders?: boolean;
      dailyTips?: boolean;
      affirmationReady?: boolean;
      motivationalPhrases?: boolean;
      selfCareReminders?: boolean;
    };
    theme?: 'light' | 'dark' | 'system';
    // Add other preferences as needed
  };
}

// Function to create or update user profile document in Firestore
export const createUserProfileDocument = async (
  uid: string,
  data: Partial<UserProfileData>
) => {
  if (!uid) return;
  const userDocRef = doc(db, `users/${uid}`);
  const userDocSnap = await getDoc(userDocRef);

  if (!userDocSnap.exists()) {
    // Create new user document
    const defaultPreferences = {
      notifications: {
        taskReminders: true,
        dailyTips: true,
        affirmationReady: true,
        motivationalPhrases: true,
        selfCareReminders: true,
      },
      theme: 'light',
    };
    try {
      await setDoc(userDocRef, {
        uid,
        displayName: data.displayName || 'Usuario CasaZen',
        email: data.email,
        photoURL: data.photoURL || null,
        createdAt: serverTimestamp(),
        preferences: data.preferences || defaultPreferences,
        ...data, // Spread any other initial data
      });
    } catch (error) {
      console.error('Error creating user document: ', error);
    }
  } else {
    // Update existing user document (e.g., if displayName or photoURL changed via Google sign-in)
    try {
      await updateDoc(userDocRef, {
        displayName: data.displayName || userDocSnap.data()?.displayName,
        photoURL: data.photoURL || userDocSnap.data()?.photoURL,
        email: data.email || userDocSnap.data()?.email, // ensure email is also updated if changed
        ...data, // merge other data
      });
    } catch (error) {
      console.error('Error updating user document: ', error);
    }
  }
};

// Function to get user profile document
export const getUserProfile = async (uid: string): Promise<UserProfileData | null> => {
  if (!uid) return null;
  const userDocRef = doc(db, `users/${uid}`);
  const userDocSnap = await getDoc(userDocRef);
  if (userDocSnap.exists()) {
    return { uid, ...userDocSnap.data() } as UserProfileData;
  } else {
    console.warn(`User document not found for UID: ${uid}`);
    return null;
  }
};

// Function to update user profile (e.g., from settings page)
export const updateUserProfileDocument = async (
  uid: string,
  data: Partial<UserProfileData> // Allow partial updates
) => {
  if (!uid) return;
  const userDocRef = doc(db, `users/${uid}`);
  try {
    await updateDoc(userDocRef, data);
  } catch (error) {
    console.error('Error updating user profile: ', error);
    throw error;
  }
};

// Function to update user preferences
export const updateUserPreferences = async (
  uid: string,
  preferences: UserProfileData['preferences']
) => {
  if (!uid) return;
  const userDocRef = doc(db, `users/${uid}`);
  try {
    await updateDoc(userDocRef, { preferences });
  } catch (error) {
    console.error('Error updating user preferences: ', error);
    throw error;
  }
};
