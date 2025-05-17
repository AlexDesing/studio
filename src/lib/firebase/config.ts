
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;
let storage: FirebaseStorage;

if (!getApps().length) {
  try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);
  } catch (error) {
    console.error('Error initializing Firebase from client config', error);
    // Fallback for server-side rendering or environments where client config might not be immediately available
    // This part needs careful handling depending on SSR/SSG strategy with Firebase
    if (typeof window === 'undefined') {
        // Potentially initialize a server-side admin app if needed, or handle differently
        // For now, we'll assume client-side initialization is primary for this app structure
        console.warn("Firebase client SDK initialized on server. This might not be intended for all operations.")
    }
     // If it still fails, rethrow or handle as critical error
    if (!app!) { // Add null assertion if confident app should be defined or handle error
        throw new Error("Firebase app could not be initialized.");
    }
  }
} else {
  app = getApp();
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
}

export { app, auth, db, storage };

// Example Firestore Security Rules (to be placed in Firebase Console -> Firestore -> Rules):
/*
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read and write their own profile data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;

      // Users can read, write, and delete their own tasks
      match /tasks/{taskId} {
        allow read, write, delete: if request.auth != null && request.auth.uid == userId;
      }
      // Users can read, write, and delete their own routines
      match /routines/{routineId} {
        allow read, write, delete: if request.auth != null && request.auth.uid == userId;
      }
      // Users can read, write, and delete their own saved affirmations
      match /savedAffirmations/{affirmationId} {
        allow read, write, delete: if request.auth != null && request.auth.uid == userId;
      }
      // Users can read, write, and delete their own vision board items
      match /visionBoardItems/{itemId} {
        allow read, write, delete: if request.auth != null && request.auth.uid == userId;
      }
      // Users can read and write their own app notifications
      // (e.g., read notifications, mark as read)
      match /userAppNotifications/{notificationId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }
  }
}
*/

// Example Firebase Storage Security Rules (to be placed in Firebase Console -> Storage -> Rules):
/*
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Users can read and write their own avatar in their own folder
    match /users/{userId}/avatar/{fileName} {
      allow read: if request.auth != null; // Or more restrictive: if request.auth.uid == userId;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
*/

