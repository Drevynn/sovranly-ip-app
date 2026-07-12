import { initializeApp, getApps } from 'firebase/app';
import { initializeFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Safely attempt to load firebase-applet-config.json on the server side
// to prevent build-time folder scanning issues with Webpack.
let firebaseConfigFromJson: any = {};
if (typeof window === 'undefined') {
  try {
    const fs = require('fs');
    const path = require('path');
    const configPath = path.join(process.cwd(), 'firebase-applet-config.json');
    if (fs.existsSync(configPath)) {
      firebaseConfigFromJson = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    }
  } catch (e) {
    // Gracefully handle any issues loading the config file
    console.warn('Failed to load local firebase-applet-config.json at runtime:', e);
  }
}

export const firebaseConfig = {
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || firebaseConfigFromJson.projectId || "sovranlyip",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || firebaseConfigFromJson.appId || "1:615099408657:web:47ffc3b6771a8ddcececb0",
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || firebaseConfigFromJson.apiKey || "AIzaSyDv9veDFN4GSufNWfWVjC4VJVHXjDTqJ3w",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || firebaseConfigFromJson.authDomain || "sovranlyip.firebaseapp.com",
  firestoreDatabaseId: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_ID || firebaseConfigFromJson.firestoreDatabaseId || "",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || firebaseConfigFromJson.storageBucket || "sovranlyip.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || firebaseConfigFromJson.messagingSenderId || "615099408657",
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
  const app = getFirebaseApp();
  if (!db) {
    db = initializeFirestore(app, {
      experimentalForceLongPolling: true,
    }, firebaseConfig.firestoreDatabaseId);
  }
  return db;
};

export const getFirebaseAuth = () => {
  const app = getFirebaseApp();
  return getAuth(app);
};
