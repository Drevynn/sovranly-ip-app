import { NextRequest, NextResponse } from 'next/server';
import PDFDocument from 'pdfkit';
import { verifyAuthToken } from '@/lib/auth-server';
import { db } from '@/lib/firebase-admin';
import QRCode from 'qrcode';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const user = await verifyAuthToken(req.headers.get('Authorization'));
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const assetId = body?.assetId;
    const theme = body?.theme;
    if (!assetId || typeof assetId !== 'string') {
      return NextResponse.json({ error: 'Asset ID required' }, { status: 400 });
    }

    const assetRef = db.collection('assets').doc(assetId);
    const assetSnap = await assetRef.get();

    if (!assetSnap.exists) {
      return NextResponse.json({ error: 'Asset not found' }, { status: 404 });
    }
    const assetData = assetSnap.data() || {};

    const docPdf = new PDFDocument({ size: 'A4', margin: 50 });
    const chunks: Buffer[] = [];
    docPdf.on('data', (chunk: Buffer) => chunks.push(chunk));

    const isClassic = theme === 'Classic Editorial';
    docPdf.font(isClassic ? 'Times-Roman' : 'Helvetica');

    docPdf.save();
    docPdf.rotate(45, { origin: [300, 400] });
    docPdf.fontSize(100).fillColor('#f0f0f0').text('SOVRANLY', 50, 400, { align: 'center' });
    docPdf.restore();
    docPdf.fillColor('black');

    docPdf.fontSize(25).text('Sovereign IP Proof Certificate', { align: 'center' });
    docPdf.moveDown();
    docPdf.fontSize(12).text(`Asset ID: ${assetId}`, { align: 'center' });
    docPdf.text(`Title: ${assetData.title || 'Unknown'}`, { align: 'center' });
    docPdf.text(`Owner: ${assetData.ownerAddress || 'Unknown'}`, { align: 'center' });
    docPdf.text(`Type: ${assetData.type || 'Unknown'}`, { align: 'center' });
    docPdf.text(`Issued to: ${user.email || user.uid}`, { align: 'center' });
    docPdf.moveDown();

    try {
      const qrCodeUrl = await QRCode.toDataURL(`https://sovranlyip.com/assets/${assetId}`);
      const b64 = qrCodeUrl.split(',')[1];
      if (b64) {
        docPdf.image(Buffer.from(b64, 'base64'), { fit: [100, 100], align: 'center' });
      }
    } catch (qrErr) {
      console.warn('QR generation skipped:', qrErr);
    }
    docPdf.moveDown();

    docPdf.fontSize(8).fillColor('gray');
    const disclaimer =
      'Legal Disclaimer: This certificate is provided for informational purposes as a record of IP registration on the Sovranly IP ledger. It does not constitute legal proof of ownership or intellectual property rights. Sovranly IP assumes no liability for the accuracy or completeness of the registered data. Users should seek independent legal counsel regarding IP protection.';
    docPdf.text(disclaimer, 50, 750, { align: 'center', width: 500 });

    docPdf.end();

    const result: Buffer = await new Promise((resolve, reject) => {
      docPdf.on('end', () => resolve(Buffer.concat(chunks)));
      docPdf.on('error', reject);
    });

    return new NextResponse(result, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="certificate_${assetId}.pdf"`,
      },
    });
  } catch (error) {
    console.error('PDF Generation Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
