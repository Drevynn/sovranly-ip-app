'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { getFirebaseAuth } from '@/lib/firebase';
import { onAuthStateChanged, User, signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithSandbox: () => Promise<void>;
  logout: () => Promise<void>;
  isSandboxMode: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signInWithGoogle: async () => {},
  signInWithSandbox: async () => {},
  logout: async () => {},
  isSandboxMode: false,
});

export function FirebaseProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSandboxMode, setIsSandboxMode] = useState(false);

  useEffect(() => {
    const auth = getFirebaseAuth();
    
    // Check local storage for sandbox user first
    const savedSandboxUser = typeof window !== 'undefined' ? localStorage.getItem('sovranly_sandbox_user') : null;
    if (savedSandboxUser) {
      try {
        const parsed = JSON.parse(savedSandboxUser);
        setTimeout(() => {
          setUser(parsed);
          setIsSandboxMode(true);
          setLoading(false);
        }, 0);
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
      }
      setLoading(false);
    });
    
    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    const auth = getFirebaseAuth();
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    
    try {
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
      setIsSandboxMode(false);
    } catch (e: any) {
      console.error("Popup failed, checking if caught by iframe context limits", e);
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
  };

  const logout = async () => {
    const auth = getFirebaseAuth();
    if (typeof window !== 'undefined') {
      localStorage.removeItem('sovranly_sandbox_user');
    }
    setUser(null);
    setIsSandboxMode(false);
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, signInWithSandbox, logout, isSandboxMode }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
