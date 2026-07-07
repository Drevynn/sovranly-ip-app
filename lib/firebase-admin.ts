import * as admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';
import firebaseConfig from '../firebase-applet-config.json';

function createLazyProxy<T extends object>(initializer: () => T): T {
  let instance: T | null = null;
  const getInstance = (): T => {
    if (!instance) {
      try {
        instance = initializer();
      } catch (error) {
        console.error("Firebase Admin initialization failed:", error);
        throw new Error(
          "Failed to initialize Firebase Admin. Please verify your Google Application Default Credentials or Firebase setup. Original error: " + 
          (error instanceof Error ? error.message : String(error))
        );
      }
    }
    return instance;
  };

  return new Proxy({} as T, {
    get(target, prop, receiver) {
      const inst = getInstance();
      let value = Reflect.get(inst, prop);
      if (typeof value === 'function') {
        return value.bind(inst);
      }
      return value;
    },
    set(target, prop, value, receiver) {
      const inst = getInstance();
      return Reflect.set(inst, prop, value);
    },
    has(target, prop) {
      const inst = getInstance();
      return Reflect.has(inst, prop);
    },
    ownKeys(target) {
      const inst = getInstance();
      return Reflect.ownKeys(inst);
    },
    getOwnPropertyDescriptor(target, prop) {
      const inst = getInstance();
      return Reflect.getOwnPropertyDescriptor(inst, prop);
    },
    getPrototypeOf(target) {
      const inst = getInstance();
      return Reflect.getPrototypeOf(inst);
    }
  });
}

const getApp = () => {
  if (admin.apps.length > 0) {
    return admin.apps[0] as any;
  }
  return admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    projectId: firebaseConfig.projectId,
  });
};

export const db = createLazyProxy(() => {
  const app = getApp();
  return getFirestore(app, (firebaseConfig as any).firestoreDatabaseId);
});

export const auth = createLazyProxy(() => {
  const app = getApp();
  return admin.auth(app);
});
