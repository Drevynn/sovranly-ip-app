import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

export const firebaseConfig = {
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "sovranlyip",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:615099408657:web:47ffc3b6771a8ddcececb0",
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyDv9veDFN4GSufNWfWVjC4VJVHXjDTqJ3w",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "sovranlyip.firebaseapp.com",
  firestoreDatabaseId: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_ID || "",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "sovranlyip.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "615099408657",
};

export function getFirebaseApp() {
  const apps = getApps();
  if (apps.length > 0) {
    return apps[0];
  }
  return initializeApp(firebaseConfig);
}

let db: any = null;

export const getDb = () => {
  if (!db) {
    const app = getFirebaseApp();
    const dbId = firebaseConfig.firestoreDatabaseId;
    if (dbId && dbId.trim() !== '') {
      try {
        db = getFirestore(app, dbId);
      } catch {
        db = getFirestore(app);
      }
    } else {
      db = getFirestore(app);
    }
  }
  return db;
};

export const getFirebaseAuth = () => {
  const app = getFirebaseApp();
  return getAuth(app);
};
