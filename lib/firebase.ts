import { initializeApp, getApps } from 'firebase/app';
import { initializeFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import firebaseConfig from '../firebase-applet-config.json';

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
    }, (firebaseConfig as any).firestoreDatabaseId);
  }
  return db;
};

export const getFirebaseAuth = () => {
  const app = getFirebaseApp();
  return getAuth(app);
};
