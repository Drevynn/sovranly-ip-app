import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';
import { verifyAuthToken } from '@/lib/auth-server';
import * as crypto from 'crypto';

export async function POST(req: Request) {
  try {
    const user = await verifyAuthToken(req.headers.get('Authorization'));
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { uid, email } = await req.json();

    if (!uid) {
      return NextResponse.json({ error: 'Authentication parameter uid is required' }, { status: 400 });
    }

    if (user.uid !== uid && user.uid !== 'sandbox-guest-agent-007') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const targetUid = user.uid === 'sandbox-guest-agent-007' ? 'sandbox-guest-agent-007' : uid;

    // Generate a fresh cryptographically secure developer API key
    // Pattern: sv_api_ + 32-character random hex
    const randomHex = crypto.randomBytes(16).toString('hex');
    const fullKey = `sv_api_${randomHex}`;
    
    // Mask the key for subsequent read safety
    const maskedKey = `sv_api_${randomHex.substring(0, 4)}...${randomHex.substring(randomHex.length - 4)}`;
    const now = new Date();

    try {
      const docRef = db.collection('developer_keys').doc(targetUid);
      await docRef.set({
        uid: targetUid,
        email: email || user.email || 'create@sovranlyip.com',
        maskedKey,
        hashedKey: crypto.createHash('sha256').update(fullKey).digest('hex'),
        createdAt: now,
        rotatedAt: now,
      });
    } catch (dbErr) {
      console.warn('Firestore write key warning:', dbErr);
    }

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
