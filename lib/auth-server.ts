import * as admin from 'firebase-admin';

// Initialize firebase-admin if not already initialized
let firebaseConfigFromJson: any = {};
try {
  // Config is expected in environment variables
} catch (e) {
  // Ignore
}

const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || firebaseConfigFromJson.projectId;

if (!admin.apps.length && projectId) {
  try {
    admin.initializeApp({
      projectId: projectId,
    });
  } catch (err) {
    console.error('Failed to initialize firebase-admin SDK:', err);
  }
}

export interface AuthenticatedUser {
  uid: string;
  email?: string;
  name?: string;
  emailVerified?: boolean;
}

/**
 * Sandbox token is ONLY accepted outside production.
 * Never trust it in live environments.
 */
function isSandboxAllowed(): boolean {
  const env = process.env.NODE_ENV || process.env.VERCEL_ENV || '';
  return env !== 'production';
}

export async function verifyAuthToken(authHeader: string | null): Promise<AuthenticatedUser | null> {
  if (!authHeader) return null;

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0].toLowerCase() !== 'bearer') {
    return null;
  }

  const token = parts[1];
  if (!token) return null;

  // Sandbox token — development / preview only
  if (token === 'sandbox-token-123') {
    if (!isSandboxAllowed()) {
      console.warn('Sandbox token rejected in production');
      return null;
    }
    return {
      uid: 'sandbox-guest-agent-007',
      email: 'create@sovranlyip.com',
      name: 'Sovereign Sandbox Agent',
      emailVerified: true,
    };
  }

  // Strict Firebase ID token verification only — no unsigned JWT fallback
  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    return {
      uid: decodedToken.uid,
      email: decodedToken.email,
      name: decodedToken.name,
      emailVerified: decodedToken.email_verified,
    };
  } catch (error) {
    console.error('Failed to verify Firebase ID Token:', error);
    return null;
  }
}
