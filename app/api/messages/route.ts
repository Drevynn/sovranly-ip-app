import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';
import { verifyAuthToken } from '@/lib/auth-server';

// In-memory rate limiter: max 5 POST requests per IP per 60 seconds
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 60 * 1000;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return true;
  }
  if (entry.count >= RATE_LIMIT) return false;
  entry.count++;
  return true;
}

export async function GET(request: Request) {
  try {
    const user = await verifyAuthToken(request.headers.get('Authorization'));
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const recipientAddress = searchParams.get('recipientAddress');

    console.log('Fetching inquiries received by:', recipientAddress);

    let snapshot;
    if (recipientAddress) {
      snapshot = await db
        .collection('inquiries')
        .where('recipientAddress', '==', recipientAddress)
        .get();

      if (snapshot.empty) {
        snapshot = await db
          .collection('inquiries')
          .where('recipientAddress', '==', recipientAddress.toLowerCase())
          .get();
      }
    } else {
      // Scope to authenticated user's uid so users can't read all inquiries
      snapshot = await db
        .collection('inquiries')
        .where('uid', '==', user.uid)
        .get();
    }

    const inquiriesData = snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
    inquiriesData.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return NextResponse.json(inquiriesData);
  } catch (error) {
    console.error('Error fetching inquiries:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    // Rate limit by IP to prevent Firestore spam
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      request.headers.get('x-real-ip') ||
      'unknown';

    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Too many requests. Please wait before sending another inquiry.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { assetId, assetTitle, senderName, senderContact, subject, message, recipientAddress } = body;

    if (!assetId || !assetTitle || !senderName || !senderContact || !subject || !message || !recipientAddress) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    // Basic length guards to prevent oversized payloads
    if (message.length > 2000 || subject.length > 200 || senderName.length > 100) {
      return NextResponse.json({ error: 'Input exceeds maximum allowed length' }, { status: 400 });
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
