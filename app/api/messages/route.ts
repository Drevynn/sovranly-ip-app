import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const recipientAddress = searchParams.get('recipientAddress');
    
    console.log('Fetching inquiries received by:', recipientAddress);
    
    let queryRef = db.collection('inquiries');
    
    let snapshot;
    if (recipientAddress) {
      // Normalize comparison to handle casing inconsistencies in addresses
      // We'll fetch and then can double-check casing, but let's query directly as well
      snapshot = await queryRef.where('recipientAddress', '==', recipientAddress).get();
      
      // If none found with absolute matching, let's try lowercasing or simple fetch as fallback
      if (snapshot.empty) {
        snapshot = await queryRef.where('recipientAddress', '==', recipientAddress.toLowerCase()).get();
      }
    } else {
      snapshot = await queryRef.get();
    }
    
    const inquiriesData = snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
    // Sort by newest first
    inquiriesData.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    return NextResponse.json(inquiriesData);
  } catch (error) {
    console.error('Error fetching inquiries:', error);
    return NextResponse.json({ error: 'Failed to fetch inquiries', details: String(error) }, { status: 500 });
  }
}

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
    return NextResponse.json({ error: 'Failed to save inquiry', details: String(error) }, { status: 500 });
  }
}
