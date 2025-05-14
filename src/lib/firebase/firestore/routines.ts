
import { db } from '../config';
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import type { Routine } from '@/lib/types';
import type { LucideIcon } from 'lucide-react'; // For icon mapping if needed client-side

const getRoutinesCollectionRef = (userId: string) => {
  return collection(db, `users/${userId}/routines`);
};

// Create a new routine
export const createRoutine = async (userId: string, routineData: Omit<Routine, 'id' | 'createdAt' | 'updatedAt' | 'userId'>): Promise<string> => {
  if (!userId) throw new Error("User ID is required to create a routine.");
  
  const routinesCollectionRef = getRoutinesCollectionRef(userId);
  const newRoutineData = {
    ...routineData,
    userId,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
  const docRef = await addDoc(routinesCollectionRef, newRoutineData);
  return docRef.id;
};

// Update an existing routine
export const updateRoutine = async (userId: string, routineId: string, updates: Partial<Omit<Routine, 'id' | 'userId' | 'createdAt'>>) => {
  if (!userId || !routineId) throw new Error("User ID and Routine ID are required.");
  
  const routineDocRef = doc(db, `users/${userId}/routines/${routineId}`);
  await updateDoc(routineDocRef, {
    ...updates,
    updatedAt: serverTimestamp(),
  });
};

// Delete a routine
export const deleteRoutine = async (userId: string, routineId: string) => {
  if (!userId || !routineId) throw new Error("User ID and Routine ID are required.");
  const routineDocRef = doc(db, `users/${userId}/routines/${routineId}`);
  await deleteDoc(routineDocRef);
};

// Get routines with real-time updates
export const onRoutinesSnapshot = (
  userId: string,
  callback: (routines: Routine[]) => void
): (() => void) => { // Return unsubscribe function
  if (!userId) {
    console.warn("User ID is required for onRoutinesSnapshot.");
    callback([]);
    return () => {};
  }

  const routinesCollectionRef = getRoutinesCollectionRef(userId);
  const q = query(routinesCollectionRef, orderBy('createdAt', 'desc'));

  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const routines: Routine[] = [];
    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      routines.push({
        id: docSnap.id,
        ...data,
        // Ensure iconName is correctly typed if it needs to be mapped to LucideIcon component client-side
      } as Routine);
    });
    callback(routines);
  }, (error) => {
    console.error("Error fetching routines snapshot: ", error);
    callback([]);
  });

  return unsubscribe;
};

// Helper to map icon name to LucideIcon component - use this on the client-side
// Ensure all icons used in MOCK_ROUTINES and created routines are available in lucide-react
// This function is more for client-side display logic rather than Firestore interaction itself.
export const getLucideIconByName = (iconName: keyof typeof import('lucide-react')): LucideIcon | undefined => {
    const icons = import('lucide-react');
    return icons[iconName as any] as LucideIcon; // This is a simplification. Dynamic import might be needed.
};
