import * as admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';
import firebaseConfig from '../firebase-applet-config.json';

const app = admin.apps.length 
  ? (admin.apps[0] as any) 
  : admin.initializeApp({
      credential: admin.credential.applicationDefault(),
      projectId: firebaseConfig.projectId,
    });

export const db = getFirestore(app, (firebaseConfig as any).firestoreDatabaseId);
export const auth = admin.auth();
