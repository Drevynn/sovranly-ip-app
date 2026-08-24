import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    if (!id) return NextResponse.json({ error: 'Asset ID required' }, { status: 400 });

    const assetSnap = await db.collection('assets').doc(id).get();

    if (!assetSnap.exists) return NextResponse.json({ error: 'Asset not found' }, { status: 404 });
    const assetData = assetSnap.data();

    return NextResponse.json({ 
        asset: assetData,
        verified: true,
        issuedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Verification Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
