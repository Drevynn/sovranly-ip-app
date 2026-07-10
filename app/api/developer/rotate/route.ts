import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';
import { verifyAuthToken } from '@/lib/auth-server';
import * as crypto from 'crypto';

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get('Authorization');
    const user = await verifyAuthToken(authHeader);

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const { uid, email } = body;

    // Prevent IDOR by ensuring user only rotates their own API keys
    if (uid && uid !== user.uid) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const uidToUse = user.uid;
    const emailToUse = email || user.email || 'create@sovranlyip.com';

    // Generate a fresh cryptographically secure developer API key
    // Pattern: sv_api_ + 32-character random hex
    const randomHex = crypto.randomBytes(16).toString('hex');
    const fullKey = `sv_api_${randomHex}`;
    
    // Mask the key for subsequent read safety
    const maskedKey = `sv_api_${randomHex.substring(0, 4)}...${randomHex.substring(randomHex.length - 4)}`;

    const docRef = db.collection('developer_keys').doc(uidToUse);
    const now = new Date();

    await docRef.set({
      uid: uidToUse,
      email: emailToUse,
      maskedKey,
      hashedKey: crypto.createHash('sha256').update(fullKey).digest('hex'),
      createdAt: now,
      rotatedAt: now,
    });

    return NextResponse.json({
      success: true,
      key: fullKey,
      maskedKey,
      rotatedAt: now.toISOString(),
    });
  } catch (error) {
    console.error('API key generation error:', error);
    return NextResponse.json({ error: 'Failed to generate developer key' }, { status: 500 });
  }
}
