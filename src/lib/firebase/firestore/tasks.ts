
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
  Timestamp,
  serverTimestamp,
  writeBatch
} from 'firebase/firestore';
import type { Task, TaskStatus } from '@/lib/types';

const getTasksCollectionRef = (userId: string) => {
  return collection(db, `users/${userId}/tasks`);
};

// Create a new task
export const createTask = async (userId: string, taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'userId'>): Promise<string> => {
  if (!userId) throw new Error("User ID is required to create a task.");
  
  const tasksCollectionRef = getTasksCollectionRef(userId);
  const newTaskData = {
    ...taskData,
    date: taskData.date instanceof Date ? Timestamp.fromDate(taskData.date) : taskData.date, // Ensure date is Firestore Timestamp
    userId, // Store userId for potential denormalization or easier rule writing, though path implies it.
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
  const docRef = await addDoc(tasksCollectionRef, newTaskData);
  return docRef.id;
};

// Update an existing task
export const updateTask = async (userId: string, taskId: string, updates: Partial<Omit<Task, 'id' | 'userId' | 'createdAt'>>) => {
  if (!userId || !taskId) throw new Error("User ID and Task ID are required.");
  
  const taskDocRef = doc(db, `users/${userId}/tasks/${taskId}`);
  const updateData = {
    ...updates,
    updatedAt: serverTimestamp(),
  };
  if (updates.date && updates.date instanceof Date) {
    updateData.date = Timestamp.fromDate(updates.date);
  }
  await updateDoc(taskDocRef, updateData);
};

// Delete a task
export const deleteTask = async (userId: string, taskId: string) => {
  if (!userId || !taskId) throw new Error("User ID and Task ID are required.");
  const taskDocRef = doc(db, `users/${userId}/tasks/${taskId}`);
  await deleteDoc(taskDocRef);
};

// Get tasks for a specific date with real-time updates
export const onTasksSnapshot = (
  userId: string,
  targetDate: Date,
  callback: (tasks: Task[]) => void
) => {
  if (!userId) {
    console.warn("User ID is required for onTasksSnapshot. Returning empty list.");
    callback([]);
    // Return an empty unsubscribe function or handle appropriately
    return () => {};
  }

  const tasksCollectionRef = getTasksCollectionRef(userId);
  
  // Create Firestore Timestamps for start and end of the target day
  const startOfDay = new Date(targetDate);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(targetDate);
  endOfDay.setHours(23, 59, 59, 999);

  const q = query(
    tasksCollectionRef,
    where('date', '>=', Timestamp.fromDate(startOfDay)),
    where('date', '<=', Timestamp.fromDate(endOfDay)),
    orderBy('date', 'asc'), // or orderBy('time', 'asc') if time is consistently present
    orderBy('createdAt', 'asc') // secondary sort by creation time
  );

  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const tasks: Task[] = [];
    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      tasks.push({
        id: docSnap.id,
        ...data,
        date: (data.date as Timestamp).toDate(), // Convert Firestore Timestamp back to JS Date
      } as Task);
    });
    callback(tasks);
  }, (error) => {
    console.error("Error fetching tasks snapshot: ", error);
    // Potentially call callback with an error or empty array
    callback([]);
  });

  return unsubscribe; // Return the unsubscribe function
};


// Batch delete tasks (example, could be used for "clear completed")
export const deleteMultipleTasks = async (userId: string, taskIds: string[]) => {
  if (!userId || taskIds.length === 0) return;
  const batch = writeBatch(db);
  taskIds.forEach(taskId => {
    const taskDocRef = doc(db, `users/${userId}/tasks/${taskId}`);
    batch.delete(taskDocRef);
  });
  await batch.commit();
};
