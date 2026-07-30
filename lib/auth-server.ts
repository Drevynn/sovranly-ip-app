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
 * Sandbox token policy:
 * - Allowed unless ALLOW_SANDBOX_AUTH is explicitly "false"
 * - Production live deploys should set ALLOW_SANDBOX_AUTH=false
 * - Preview / AI Studio / local keep working by default
 */
function isSandboxAllowed(): boolean {
  if (process.env.ALLOW_SANDBOX_AUTH === 'false') return false;
  if (process.env.ALLOW_SANDBOX_AUTH === 'true') return true;
  if (process.env.VERCEL_ENV === 'preview' || process.env.VERCEL_ENV === 'development') return true;
  if (process.env.NODE_ENV !== 'production') return true;
  // Default allow so iframe/preview builds (often NODE_ENV=production) still function.
  // Set ALLOW_SANDBOX_AUTH=false on the real production host.
  return true;
}

/**
 * Unsigned JWT decode is ONLY used when Admin verification fails and we are
 * clearly in a non-live environment (no service account / preview sandbox).
 */
function isPreviewFallbackAllowed(): boolean {
  if (process.env.ALLOW_UNSIGNED_JWT_FALLBACK === 'false') return false;
  if (process.env.ALLOW_UNSIGNED_JWT_FALLBACK === 'true') return true;
  if (process.env.VERCEL_ENV === 'preview' || process.env.VERCEL_ENV === 'development') return true;
  if (process.env.NODE_ENV !== 'production') return true;
  return false;
}

export async function verifyAuthToken(authHeader: string | null): Promise<AuthenticatedUser | null> {
  if (!authHeader) return null;

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0].toLowerCase() !== 'bearer') {
    return null;
  }

  const token = parts[1];
  if (!token) return null;

  // Sandbox token
  if (token === 'sandbox-token-123') {
    if (!isSandboxAllowed()) {
      console.warn('Sandbox token rejected (ALLOW_SANDBOX_AUTH=false)');
      return null;
    }
    return {
      uid: 'sandbox-guest-agent-007',
      email: 'create@sovranlyip.com',
      name: 'Sovereign Sandbox Agent',
      emailVerified: true,
    };
  }

  // Prefer real Firebase ID token verification
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

    // Gated fallback for isolated preview containers without Admin credentials
    if (isPreviewFallbackAllowed()) {
      try {
        const payloadBase64 = token.split('.')[1];
        if (payloadBase64) {
          const payloadJson = Buffer.from(payloadBase64, 'base64').toString('utf8');
          const decoded = JSON.parse(payloadJson);
          if (decoded && decoded.uid) {
            console.warn('Preview fallback: decoded JWT payload for uid:', decoded.uid);
            return {
              uid: decoded.uid,
              email: decoded.email,
              name: decoded.name || decoded.displayName,
              emailVerified: decoded.email_verified ?? true,
            };
          }
        }
      } catch (e) {
        console.error('Preview JWT decode failed:', e);
      }
    }

    return null;
  }
}
