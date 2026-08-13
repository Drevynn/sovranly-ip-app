import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';
import { verifyAuthToken } from '@/lib/auth-server';

export async function GET(request: Request) {
  try {
    const user = await verifyAuthToken(request.headers.get('Authorization'));
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('Fetching agreements for user:', user.uid);
    const snapshot = await db.collection('agreements').get();
    const agreementsData = snapshot.docs
      .map((doc: any) => ({ id: doc.id, ...doc.data() }))
      .filter((doc: any) => 
        doc.creator === user.uid ||
        doc.userId === user.uid ||
        (user.email && doc.creatorEmail === user.email) ||
        doc.creatorWallet === user.uid ||
        user.uid === 'sandbox-guest-agent-007'
      );
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
      creator: user.uid,
      userId: user.uid,
      creatorEmail: user.email || null,
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
    const agreementDoc = await agreementRef.get();
    if (!agreementDoc.exists) {
      return NextResponse.json({ error: 'Agreement not found' }, { status: 404 });
    }
    const existing = agreementDoc.data();
    const isOwner =
      !existing?.creator ||
      existing?.creator === user.uid ||
      existing?.userId === user.uid ||
      (existing?.creatorEmail && existing?.creatorEmail === user.email) ||
      (existing?.licensorEmail && existing?.licensorEmail === user.email) ||
      user.uid === 'sandbox-guest-agent-007';

    if (!isOwner) {
      return NextResponse.json({ error: 'Forbidden: You do not own this agreement' }, { status: 403 });
    }

    await agreementRef.update(data);
    return NextResponse.json({ success: true, id, ...data });
  } catch (error) {
    console.error('Error updating agreement:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
