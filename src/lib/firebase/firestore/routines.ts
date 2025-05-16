
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
  const newRoutineData: any = { // Use 'any' temporarily for easier object construction
    ...routineData,
    userId,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  if (routineData.startDate instanceof Date) {
    newRoutineData.startDate = Timestamp.fromDate(routineData.startDate);
  } else if (routineData.startDate === undefined || routineData.startDate === null) {
    delete newRoutineData.startDate; // Don't store undefined or null for dates
  }

  if (routineData.startTime === undefined || routineData.startTime === null || routineData.startTime === '') {
    delete newRoutineData.startTime;
  }

  const docRef = await addDoc(routinesCollectionRef, newRoutineData);
  return docRef.id;
};

// Update an existing routine
export const updateRoutine = async (userId: string, routineId: string, updates: Partial<Omit<Routine, 'id' | 'userId' | 'createdAt'>>) => {
  if (!userId || !routineId) throw new Error("User ID and Routine ID are required.");
  
  const routineDocRef = doc(db, `users/${userId}/routines/${routineId}`);
  const updateData: any = { // Use 'any' temporarily
    ...updates,
    updatedAt: serverTimestamp(),
  };

  if (updates.startDate instanceof Date) {
    updateData.startDate = Timestamp.fromDate(updates.startDate);
  } else if (updates.startDate === undefined || updates.startDate === null) {
    // If explicitly setting to null/undefined, Firestore can remove the field with a special value
    // For simplicity, let's assume we just don't update it if it's undefined, or handle null explicitly if needed
    if (updates.hasOwnProperty('startDate') && (updates.startDate === null || updates.startDate === undefined)) {
         updateData.startDate = null; // Or firebase.firestore.FieldValue.delete() to remove
    } else if (!updates.hasOwnProperty('startDate')) {
        delete updateData.startDate;
    }
  }
  
  if (updates.hasOwnProperty('startTime')) {
      if (updates.startTime === null || updates.startTime === undefined || updates.startTime === '') {
          updateData.startTime = null; // Or FieldValue.delete()
      }
  } else {
    delete updateData.startTime;
  }


  await updateDoc(routineDocRef, updateData);
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
      const routine: Routine = {
        id: docSnap.id,
        title: data.title,
        description: data.description,
        iconName: data.iconName,
        steps: data.steps,
        category: data.category,
        createdAt: data.createdAt as Timestamp,
        updatedAt: data.updatedAt as Timestamp,
        userId: data.userId,
      };
      if (data.startDate instanceof Timestamp) {
        routine.startDate = data.startDate.toDate();
      }
      if (data.startTime) {
        routine.startTime = data.startTime;
      }
      routines.push(routine);
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
    // @ts-ignore
    return icons[iconName as any] as LucideIcon; // This is a simplification. Dynamic import might be needed.
};
