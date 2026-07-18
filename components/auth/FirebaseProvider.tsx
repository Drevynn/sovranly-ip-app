'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { getFirebaseAuth } from '@/lib/firebase';
import { onAuthStateChanged, User, signInWithPopup, signInWithRedirect, GoogleAuthProvider, signOut } from 'firebase/auth';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithSandbox: () => Promise<void>;
  logout: () => Promise<void>;
  isSandboxMode: boolean;
  accessToken: string | null;
  setAccessToken: (token: string | null) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signInWithGoogle: async () => {},
  signInWithSandbox: async () => {},
  logout: async () => {},
  isSandboxMode: false,
  accessToken: null,
  setAccessToken: () => {},
});

export function FirebaseProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSandboxMode, setIsSandboxMode] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleRejection = (event: PromiseRejectionEvent) => {
        const reason = event.reason;
        const msg = reason?.message || '';
        const name = reason?.name || '';
        if (
          name === 'AbortError' ||
          msg.includes('IndexedDB') ||
          msg.includes('idb-') ||
          msg.includes('database connection is closing') ||
          msg.includes('transaction was aborted') ||
          msg.includes('Unable to create writable file') ||
          msg.includes('Connection to Indexed Database')
        ) {
          event.preventDefault();
          event.stopImmediatePropagation();
          console.warn('Suppressing benign IndexedDB/AbortError in iframe sandbox:', reason);
        }
      };
      window.addEventListener('unhandledrejection', handleRejection, true);

      const handleError = (event: ErrorEvent) => {
        const msg = event.message || '';
        if (
          msg.includes('Connection to Indexed Database') ||
          msg.includes('Indexed Database') ||
          msg.includes('IndexedDB') ||
          msg.includes('indexeddb') ||
          msg.includes('idb-') ||
          msg.includes('database connection is closing')
        ) {
          event.preventDefault();
          event.stopImmediatePropagation();
          console.warn('Suppressing benign IndexedDB error in iframe sandbox:', msg);
        }
      };
      window.addEventListener('error', handleError, true);
      
      const auth = getFirebaseAuth();
      
      // Check local storage for sandbox user first
      const savedSandboxUser = localStorage.getItem('sovranly_sandbox_user');
      if (savedSandboxUser) {
        try {
          const parsed = JSON.parse(savedSandboxUser);
          setTimeout(() => {
            setUser(parsed);
            setIsSandboxMode(true);
            setAccessToken('sandbox-token-123');
            setLoading(false);
          }, 0);
          window.removeEventListener('unhandledrejection', handleRejection);
          return;
        } catch (e) {
          // clear corrupted data
          localStorage.removeItem('sovranly_sandbox_user');
        }
      }

      const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
        if (firebaseUser) {
          setUser(firebaseUser);
          setIsSandboxMode(false);
        } else {
          setUser(null);
          setAccessToken(null);
        }
        setLoading(false);
      });
      
      return () => {
        unsubscribe();
        window.removeEventListener('unhandledrejection', handleRejection, true);
        window.removeEventListener('error', handleError, true);
      };
    }
  }, []);

  const signInWithGoogle = async () => {
    const auth = getFirebaseAuth();
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    
    // Google Slides and Google Drive scopes requested by the applet
    provider.addScope('https://www.googleapis.com/auth/drive.file');
    provider.addScope('https://www.googleapis.com/auth/presentations');
    provider.addScope('https://www.googleapis.com/auth/spreadsheets');
    
    try {
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      if (isMobile) {
        await signInWithRedirect(auth, provider);
      } else {
        const result = await signInWithPopup(auth, provider);
        const credential = GoogleAuthProvider.credentialFromResult(result);
        if (credential?.accessToken) {
          setAccessToken(credential.accessToken);
        }
        setUser(result.user);
        setIsSandboxMode(false);
      }
    } catch (e: any) {
      console.error("Popup/Redirect failed, checking if caught by iframe context limits", e);
      throw e;
    }
  };

  const signInWithSandbox = async () => {
    const fakeUser = {
      uid: 'sandbox-guest-agent-007',
      displayName: 'Sovereign Sandbox Agent',
      email: 'create@sovranlyip.com',
      photoURL: '/sovranly-logo-v2.png',
      emailVerified: true,
      metadata: {},
      providerData: [],
    } as any;
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('sovranly_sandbox_user', JSON.stringify(fakeUser));
    }
    setUser(fakeUser);
    setIsSandboxMode(true);
    setAccessToken('sandbox-token-123');
  };

  const logout = async () => {
    const auth = getFirebaseAuth();
    if (typeof window !== 'undefined') {
      localStorage.removeItem('sovranly_sandbox_user');
    }
    setUser(null);
    setIsSandboxMode(false);
    setAccessToken(null);
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, signInWithSandbox, logout, isSandboxMode, accessToken, setAccessToken }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
