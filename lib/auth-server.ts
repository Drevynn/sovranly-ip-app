import { firebaseConfig } from './firebase';

export interface AuthenticatedUser {
  uid: string;
  email?: string;
}

export async function verifyAuthToken(authHeader: string | null): Promise<AuthenticatedUser | null> {
  if (!authHeader) {
    return null;
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2) {
    return null;
  }

  const [scheme, token] = parts;
  if (scheme !== 'Bearer' || !token) {
    return null;
  }

  // Handle sandbox user token
  if (token === 'sandbox-token-123') {
    return {
      uid: 'sandbox-guest-agent-007',
      email: 'create@sovranlyip.com',
    };
  }

  try {
    const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY || firebaseConfig.apiKey;
    if (!apiKey) {
      console.error('Firebase API Key is missing from configuration');
      return null;
    }

    const res = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken: token }),
      }
    );

    if (!res.ok) {
      // Log failure locally for server admins, do not expose to clients
      console.error('Firebase token verification failed on Google Identity Toolkit API');
      return null;
    }

    const data = await res.json();
    const firebaseUser = data.users?.[0];
    if (!firebaseUser) {
      return null;
    }

    return {
      uid: firebaseUser.localId,
      email: firebaseUser.email,
    };
  } catch (error) {
    console.error('Error verifying auth token in server-side helper:', error);
    return null;
  }
}
