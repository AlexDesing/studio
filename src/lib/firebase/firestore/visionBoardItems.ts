
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
import type { VisionBoardItem } from '@/lib/types';

const getVisionBoardItemsCollectionRef = (userId: string) => {
  return collection(db, `users/${userId}/visionBoardItems`);
};

// Create a new vision board item
export const createVisionBoardItem = async (userId: string, itemData: Omit<VisionBoardItem, 'id' | 'createdAt' | 'userId'>): Promise<string> => {
  if (!userId) throw new Error("User ID is required to create a vision board item.");
  
  const collectionRef = getVisionBoardItemsCollectionRef(userId);
  const newItemData = {
    ...itemData,
    userId,
    createdAt: serverTimestamp(),
  };
  const docRef = await addDoc(collectionRef, newItemData);
  return docRef.id;
};

// Update an existing vision board item
export const updateVisionBoardItem = async (userId: string, itemId: string, updates: Partial<Omit<VisionBoardItem, 'id' | 'userId' | 'createdAt'>>) => {
  if (!userId || !itemId) throw new Error("User ID and Item ID are required.");
  
  const docRef = doc(db, `users/${userId}/visionBoardItems/${itemId}`);
  await updateDoc(docRef, {
    ...updates,
    // No updatedAt for vision board items unless specifically needed
  });
};

// Delete a vision board item
export const deleteVisionBoardItem = async (userId: string, itemId: string) => {
  if (!userId || !itemId) throw new Error("User ID and Item ID are required.");
  const docRef = doc(db, `users/${userId}/visionBoardItems/${itemId}`);
  await deleteDoc(docRef);
};

// Get vision board items with real-time updates
export const onVisionBoardItemsSnapshot = (
  userId: string,
  callback: (items: VisionBoardItem[]) => void
): (() => void) => {
  if (!userId) {
    callback([]);
    return () => {};
  }

  const collectionRef = getVisionBoardItemsCollectionRef(userId);
  const q = query(collectionRef, orderBy('createdAt', 'desc')); // Or by a 'order' field if manual ordering is needed

  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const items: VisionBoardItem[] = [];
    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      items.push({
        id: docSnap.id,
        ...data,
        createdAt: data.createdAt as Timestamp // Ensure correct typing
      } as VisionBoardItem);
    });
    callback(items);
  }, (error) => {
    console.error("Error fetching vision board items snapshot: ", error);
    callback([]);
  });

  return unsubscribe;
};
