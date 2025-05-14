
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from './config';

export const uploadUserAvatar = async (userId: string, file: File): Promise<string> => {
  if (!userId || !file) {
    throw new Error('User ID and file are required for avatar upload.');
  }
  // Create a unique path for the avatar, e.g., users/{userId}/avatar.{extension}
  // Overwrite if exists by using the same name. Or add timestamp for versioning if needed.
  const fileExtension = file.name.split('.').pop();
  const avatarRef = ref(storage, `users/${userId}/avatar/avatar.${fileExtension}`);
  
  await uploadBytes(avatarRef, file);
  const downloadURL = await getDownloadURL(avatarRef);
  return downloadURL;
};

export const deleteUserAvatar = async (userId: string, fileName: string = 'avatar.png') => {
  // This might need adjustment if you store files with their original extension
  // For simplicity, assuming a fixed name or that full path is known
  const avatarPath = `users/${userId}/avatar/${fileName}`; 
  const avatarRef = ref(storage, avatarPath);
  try {
    await deleteObject(avatarRef);
  } catch (error: any) {
    // It's okay if the file doesn't exist (e.g., user never uploaded one)
    if (error.code === 'storage/object-not-found') {
      console.log("Avatar not found, no need to delete.");
    } else {
      console.error("Error deleting avatar:", error);
      throw error;
    }
  }
};
