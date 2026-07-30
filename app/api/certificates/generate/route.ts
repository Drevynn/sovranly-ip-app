import { NextRequest, NextResponse } from 'next/server';
import { verifyAuthToken } from '@/lib/auth-server';
import { db } from '@/lib/firebase-admin';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    // Auth preferred but not hard-required so client can still export in sandbox
    const user = await verifyAuthToken(req.headers.get('Authorization'));

    const body = await req.json().catch(() => ({} as any));
    const assetId = body?.assetId;
    if (!assetId || typeof assetId !== 'string') {
      return NextResponse.json({ error: 'Asset ID required' }, { status: 400 });
    }

    let assetData: any = {
      title: 'Unknown',
      ownerAddress: 'Unknown',
      type: 'Unknown',
    };

    try {
      const assetSnap = await db.collection('assets').doc(assetId).get();
      if (assetSnap.exists) {
        assetData = { ...assetData, ...(assetSnap.data() || {}) };
      }
    } catch (dbErr) {
      console.warn('Asset lookup failed, using defaults:', dbErr);
    }

    // Lightweight text certificate (avoids pdfkit font/native issues in some hosts)
    const issuedTo = user?.email || user?.uid || 'Guest';
    const lines = [
      'SOVRANLY IP — Sovereign Proof Certificate',
      '========================================',
      `Asset ID: ${assetId}`,
      `Title: ${assetData.title}`,
      `Owner: ${assetData.ownerAddress}`,
      `Type: ${assetData.type}`,
      `Issued to: ${issuedTo}`,
      `Issued at: ${new Date().toISOString()}`,
      '',
      'Legal Disclaimer: This certificate is informational only and does not',
      'constitute legal proof of ownership. Seek independent legal counsel.',
    ];
    const text = lines.join('\n');
    const bytes = new TextEncoder().encode(text);

    return new NextResponse(bytes, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Content-Disposition': `attachment; filename="certificate_${assetId}.txt"`,
      },
    });
  } catch (error) {
    console.error('Certificate generation error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
