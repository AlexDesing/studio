
import { db } from '../config';
import {
  collection,
  doc,
  query,
  orderBy,
  onSnapshot,
  updateDoc,
  serverTimestamp,
  Timestamp,
  // Consider addDoc if you plan to create notifications from client,
  // but typically they are created by backend/triggers
} from 'firebase/firestore';
import type { UserAppNotification } from '@/lib/types';

const getUserAppNotificationsCollectionRef = (userId: string) => {
  return collection(db, `users/${userId}/userAppNotifications`);
};

// Get user's app notifications with real-time updates
export const onUserAppNotificationsSnapshot = (
  userId: string,
  callback: (notifications: UserAppNotification[]) => void
): (() => void) => {
  if (!userId) {
    callback([]);
    return () => {};
  }

  const collectionRef = getUserAppNotificationsCollectionRef(userId);
  // Order by creation date, newest first. Limit if needed (e.g., .limit(20))
  const q = query(collectionRef, orderBy('createdAt', 'desc'));

  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const notifications: UserAppNotification[] = [];
    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      notifications.push({
        id: docSnap.id,
        userId: data.userId,
        title: data.title,
        message: data.message,
        category: data.category,
        icon: data.icon,
        linkTo: data.linkTo,
        read: data.read,
        createdAt: data.createdAt as Timestamp,
      } as UserAppNotification);
    });
    callback(notifications);
  }, (error) => {
    console.error("Error fetching user app notifications snapshot: ", error);
    callback([]);
  });

  return unsubscribe;
};

// Mark a specific notification as read
export const markUserNotificationAsRead = async (userId: string, notificationId: string): Promise<void> => {
  if (!userId || !notificationId) {
    throw new Error("User ID and Notification ID are required.");
  }
  const notificationDocRef = doc(db, `users/${userId}/userAppNotifications/${notificationId}`);
  try {
    await updateDoc(notificationDocRef, {
      read: true,
      // Optionally, you could add an 'readAt': serverTimestamp() field
    });
  } catch (error) {
    console.error("Error marking notification as read: ", error);
    throw error;
  }
};

// Example: How you might add a notification (typically from backend/Cloud Function)
// This function is NOT intended for direct client-side use for all notification types.
/*
import { addDoc } from 'firebase/firestore';
export const createAppNotification = async (userId: string, notificationData: Omit<UserAppNotification, 'id' | 'createdAt' | 'userId' | 'read'>): Promise<string> => {
  if (!userId) throw new Error("User ID is required.");
  const collectionRef = getUserAppNotificationsCollectionRef(userId);
  const newNotification = {
    ...notificationData,
    userId,
    read: false,
    createdAt: serverTimestamp(),
  };
  const docRef = await addDoc(collectionRef, newNotification);
  return docRef.id;
};
*/

// Note: Deleting notifications would follow a similar pattern using deleteDoc.
// Batch deleting or "clear all read" would use writeBatch.
