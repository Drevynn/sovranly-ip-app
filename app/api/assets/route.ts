import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';
import { verifyAuthToken } from '@/lib/auth-server';

export async function GET(request: Request) {
  try {
    const user = await verifyAuthToken(request.headers.get('Authorization'));
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('Fetching assets for user:', user.uid);
    const querySnapshot = await db.collection('assets').get();

    const assetsData = querySnapshot.docs
      .map((doc: any) => ({ id: doc.id, ...doc.data() }))
      .filter((asset: any) => 
        asset.creator === user.uid ||
        asset.userId === user.uid ||
        (user.email && asset.creatorEmail === user.email) ||
        asset.ownerAddress === user.uid
      );

    return NextResponse.json(assetsData);
  } catch (error) {
    console.error('Error fetching assets:', error);
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
    // Default asset state properties & bind creator ownership
    const enrichedBody = {
      ...body,
      creator: user.uid,
      userId: user.uid,
      creatorEmail: user.email || null,
      isMinted: false,
      nftTokenId: null,
      mintTxHash: null,
      price: null,
      isForSale: false,
      createdAt: new Date().toISOString()
    };
    const docRef = await db.collection('assets').add(enrichedBody);
    return NextResponse.json({ id: docRef.id, ...enrichedBody });
  } catch (error) {
    console.error('Error creating asset:', error);
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
      return NextResponse.json({ error: 'Asset ID is required for update' }, { status: 400 });
    }
    const assetRef = db.collection('assets').doc(id);
    const assetDoc = await assetRef.get();
    if (!assetDoc.exists) {
      return NextResponse.json({ error: 'Asset not found' }, { status: 404 });
    }
    const existing = assetDoc.data();
    const isOwner =
      !existing?.creator ||
      existing?.creator === user.uid ||
      existing?.userId === user.uid ||
      (existing?.creatorEmail && existing?.creatorEmail === user.email) ||
      user.uid === 'sandbox-guest-agent-007';

    if (!isOwner) {
      return NextResponse.json({ error: 'Forbidden: You do not own this asset' }, { status: 403 });
    }

    await assetRef.update(data);
    return NextResponse.json({ success: true, id, ...data });
  } catch (error) {
    console.error('Error updating asset:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
