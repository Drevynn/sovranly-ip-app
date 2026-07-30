import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';
import { verifyAuthToken } from '@/lib/auth-server';

export async function GET(request: Request) {
  try {
    const user = await verifyAuthToken(request.headers.get('Authorization'));
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('Fetching agreements...');
    const snapshot = await db.collection('agreements').get();
    const agreementsData = snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
    return NextResponse.json(agreementsData);
  } catch (error) {
    console.error('Error fetching agreements:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await verifyAuthToken(request.headers.get('Authorization'));
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const enrichedBody = {
      ...body,
      ownerUid: user.uid,
      royaltyRate: Math.round(Number(body.royaltyRate || 0)),
      createdAt: new Date().toISOString()
    };
    const docRef = await db.collection('agreements').add(enrichedBody);
    return NextResponse.json({ id: docRef.id, ...enrichedBody });
  } catch (error) {
    console.error('Error creating agreement:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const user = await verifyAuthToken(request.headers.get('Authorization'));
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id, ...data } = await request.json();
    if (!id) {
      return NextResponse.json({ error: 'Agreement ID is required for update' }, { status: 400 });
    }

    const agreementRef = db.collection('agreements').doc(id);
    const existing = await agreementRef.get();
    if (!existing.exists) {
      return NextResponse.json({ error: 'Agreement not found' }, { status: 404 });
    }

    const existingData = existing.data();
    if (existingData?.ownerUid && existingData.ownerUid !== user.uid) {
      return NextResponse.json({ error: 'Forbidden: you do not own this agreement' }, { status: 403 });
    }

    // Never allow client to change ownerUid
    const { ownerUid: _ignored, ...safeData } = data;
    await agreementRef.update(safeData);
    return NextResponse.json({ success: true, id, ...safeData });
  } catch (error) {
    console.error('Error updating agreement:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
