import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';
import { verifyAuthToken } from '@/lib/auth-server';

export async function GET(request: Request) {
  try {
    const user = await verifyAuthToken(request.headers.get('Authorization'));
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('Fetching agreements for uid:', user.uid);
    const snapshot = await db
      .collection('agreements')
      .where('uid', '==', user.uid)
      .get();
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
      uid: user.uid,
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

    // Verify ownership before updating
    const agreementRef = db.collection('agreements').doc(id);
    const agreementSnap = await agreementRef.get();
    if (!agreementSnap.exists) {
      return NextResponse.json({ error: 'Agreement not found' }, { status: 404 });
    }
    if (agreementSnap.data()?.uid !== user.uid) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await agreementRef.update(data);
    return NextResponse.json({ success: true, id, ...data });
  } catch (error) {
    console.error('Error updating agreement:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
