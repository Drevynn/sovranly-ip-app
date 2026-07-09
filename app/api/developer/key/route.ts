import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const uid = searchParams.get('uid');

    if (!uid) {
      return NextResponse.json({ error: 'Authentication parameter uid is required' }, { status: 400 });
    }

    const docRef = db.collection('developer_keys').doc(uid);
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
  } catch (error) {
    console.error('Failed to retrieve developer key:', error);
    return NextResponse.json({ error: 'Failed to get key status' }, { status: 500 });
  }
}
