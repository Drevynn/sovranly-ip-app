import * as admin from 'firebase-admin';

// Initialize firebase-admin if not already initialized
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
    // Ignore
  }
}

export function ensureAdminApp(): boolean {
  if (admin.apps.length > 0) return true;
  const projectId = 
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 
    process.env.FIREBASE_PROJECT_ID || 
    firebaseConfigFromJson.projectId || 
    'sovranlyip';
  
  try {
    admin.initializeApp({
      projectId: projectId,
    });
    return true;
  } catch (err) {
    console.error('Failed to initialize firebase-admin SDK:', err);
    return false;
  }
}

// Initial attempt at module load
ensureAdminApp();

export interface AuthenticatedUser {
  uid: string;
  email?: string;
  name?: string;
  emailVerified?: boolean;
}

function isSandboxAllowed(): boolean {
  // Sandbox mode is ONLY available in development, never in production.
  // Removed the ENABLE_SANDBOX_AUTH and NEXT_PUBLIC_ALLOW_SANDBOX env var overrides
  // that previously allowed bypassing this check in production.
  return process.env.NODE_ENV !== 'production';
}

export async function verifyAuthToken(authHeader: string | null): Promise<AuthenticatedUser | null> {
  if (!authHeader) return null;
  
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0].toLowerCase() !== 'bearer') {
    return null;
  }
  
  const token = parts[1];
  if (!token) return null;

  // Seamless support for sandbox token in development/preview environments (gated in production)
  if (token === 'sandbox-token-123' && isSandboxAllowed()) {
    return {
      uid: 'sandbox-guest-agent-007',
      email: 'create@sovranlyip.com',
      name: 'Sovereign Sandbox Agent',
      emailVerified: true,
    };
  }

  const isInitialized = ensureAdminApp();
  if (isInitialized) {
    try {
      const decodedToken = await admin.auth().verifyIdToken(token);
      return {
        uid: decodedToken.uid,
        email: decodedToken.email,
        name: decodedToken.name,
        emailVerified: decodedToken.email_verified,
      };
    } catch (error) {
      console.warn('Firebase token verification failed:', error);
    }
  }
  
  // No unsigned JWT fallback — all tokens must be verified by Firebase Admin.
  // The previous unsigned JWT decoder was a security vulnerability.
  
  return null;
}
