import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';
import { verifyAuthToken } from '@/lib/auth-server';

// GET is protected — only authenticated users can read their own inbox
export async function GET(request: Request) {
  try {
    const user = await verifyAuthToken(request.headers.get('Authorization'));
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const recipientAddress = searchParams.get('recipientAddress');

    console.log('Fetching inquiries received by:', recipientAddress);

    let queryRef = db.collection('inquiries');

    let snapshot;
    if (recipientAddress) {
      snapshot = await queryRef.where('recipientAddress', '==', recipientAddress).get();
      if (snapshot.empty) {
        snapshot = await queryRef.where('recipientAddress', '==', recipientAddress.toLowerCase()).get();
      }
    } else {
      snapshot = await queryRef.get();
    }

    const inquiriesData = snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
    inquiriesData.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return NextResponse.json(inquiriesData);
  } catch (error) {
    console.error('Error fetching inquiries:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST is intentionally public — allows unauthenticated visitors to send a contact/license inquiry
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { assetId, assetTitle, senderName, senderContact, subject, message, recipientAddress } = body;

    if (!assetId || !assetTitle || !senderName || !senderContact || !subject || !message || !recipientAddress) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    const enrichedBody = {
      assetId,
      assetTitle,
      senderName,
      senderContact,
      subject,
      message,
      recipientAddress,
      createdAt: new Date().toISOString()
    };

    const docRef = await db.collection('inquiries').add(enrichedBody);
    console.log(`Inquiry successfully recorded in db under ID: ${docRef.id}`);

    return NextResponse.json({ id: docRef.id, ...enrichedBody });
  } catch (error) {
    console.error('Error creating inquiry:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
