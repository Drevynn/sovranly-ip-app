import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';
import { verifyAuthToken } from '@/lib/auth-server';

export async function GET(req: Request) {
  try {
    const user = await verifyAuthToken(req.headers.get('Authorization'));
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const uid = searchParams.get('uid');

    if (!uid) {
      return NextResponse.json({ error: 'Authentication parameter uid is required' }, { status: 400 });
    }

    if (user.uid !== uid && user.uid !== 'sandbox-guest-agent-007') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const targetUid = user.uid === 'sandbox-guest-agent-007' ? 'sandbox-guest-agent-007' : uid;

    try {
      const docRef = db.collection('developer_keys').doc(targetUid);
      const docSnap = await docRef.get();

      if (!docSnap.exists) {
        return NextResponse.json({ hasKey: false });
      }

      const data = docSnap.data();
      return NextResponse.json({
        hasKey: true,
        maskedKey: data?.maskedKey || 'sv_api_••••••••',
        rotatedAt: data?.rotatedAt ? (data.rotatedAt.toDate ? data.rotatedAt.toDate().toISOString() : data.rotatedAt) : null,
      });
    } catch (dbErr) {
      console.warn('Firestore fetch key warning:', dbErr);
      return NextResponse.json({ hasKey: false });
    }
  } catch (error) {
    console.error('Failed to retrieve developer key:', error);
    return NextResponse.json({ hasKey: false });
  }
}
