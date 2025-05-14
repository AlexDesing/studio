
import { db } from '../config';
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import type { SavedAffirmation } from '@/lib/types';

const getSavedAffirmationsCollectionRef = (userId: string) => {
  return collection(db, `users/${userId}/savedAffirmations`);
};

// Create a new saved affirmation
export const createSavedAffirmation = async (userId: string, affirmationData: Omit<SavedAffirmation, 'id' | 'createdAt' | 'userId'>): Promise<string> => {
  if (!userId) throw new Error("User ID is required to save an affirmation.");
  
  const collectionRef = getSavedAffirmationsCollectionRef(userId);
  const newAffirmationData = {
    ...affirmationData,
    userId,
    isFavorite: affirmationData.isFavorite || false,
    createdAt: serverTimestamp(),
  };
  const docRef = await addDoc(collectionRef, newAffirmationData);
  return docRef.id;
};

// Update an existing saved affirmation (e.g., toggle favorite)
export const updateSavedAffirmation = async (userId: string, affirmationId: string, updates: Partial<Omit<SavedAffirmation, 'id' | 'userId' | 'createdAt'>>) => {
  if (!userId || !affirmationId) throw new Error("User ID and Affirmation ID are required.");
  
  const docRef = doc(db, `users/${userId}/savedAffirmations/${affirmationId}`);
  await updateDoc(docRef, updates);
};

// Delete a saved affirmation
export const deleteSavedAffirmation = async (userId: string, affirmationId: string) => {
  if (!userId || !affirmationId) throw new Error("User ID and Affirmation ID are required.");
  const docRef = doc(db, `users/${userId}/savedAffirmations/${affirmationId}`);
  await deleteDoc(docRef);
};

// Get saved affirmations with real-time updates
export const onSavedAffirmationsSnapshot = (
  userId: string,
  callback: (affirmations: SavedAffirmation[]) => void
): (() => void) => {
  if (!userId) {
    callback([]);
    return () => {};
  }

  const collectionRef = getSavedAffirmationsCollectionRef(userId);
  const q = query(collectionRef, orderBy('createdAt', 'desc'));

  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const affirmations: SavedAffirmation[] = [];
    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      affirmations.push({
        id: docSnap.id,
        ...data,
        createdAt: data.createdAt as Timestamp // Ensure correct typing
      } as SavedAffirmation);
    });
    callback(affirmations);
  }, (error) => {
    console.error("Error fetching saved affirmations snapshot: ", error);
    callback([]);
  });

  return unsubscribe;
};
