import { NextRequest, NextResponse } from 'next/server';
import PDFDocument from 'pdfkit';
import { verifyAuthToken } from '@/lib/auth-server';
import { db } from '@/lib/firebase-admin';
import QRCode from 'qrcode';

export async function POST(req: NextRequest) {
  try {
    // Require authentication — certificates contain ownership claims
    const user = await verifyAuthToken(req.headers.get('Authorization'));
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { assetId, theme } = await req.json();
    if (!assetId) return NextResponse.json({ error: 'Asset ID required' }, { status: 400 });

    const assetRef = db.collection('assets').doc(assetId);
    const assetSnap = await assetRef.get();

    if (!assetSnap.exists) return NextResponse.json({ error: 'Asset not found' }, { status: 404 });
    const assetData = assetSnap.data();

    const docPdf = new PDFDocument({ size: 'A4', margin: 50 });
    const chunks: Buffer[] = [];
    docPdf.on('data', (chunk) => chunks.push(chunk));

    // Theme setup
    const isClassic = theme === 'Classic Editorial';
    docPdf.font(isClassic ? 'Times-Roman' : 'Helvetica');

    // Watermark
    docPdf.save();
    docPdf.rotate(45, { origin: [300, 400] });
    docPdf.fontSize(100).fillColor('#f0f0f0').text('SOVRANLY', 50, 400, { align: 'center' });
    docPdf.restore();
    docPdf.fillColor('black');

    docPdf.fontSize(25).text('Sovereign IP Proof Certificate', { align: 'center' });
    docPdf.moveDown();
    docPdf.fontSize(12).text(`Asset ID: ${assetId}`, { align: 'center' });
    docPdf.text(`Title: ${assetData?.title || 'Unknown'}`, { align: 'center' });
    docPdf.text(`Owner: ${assetData?.ownerAddress || 'Unknown'}`, { align: 'center' });
    docPdf.text(`Type: ${assetData?.type || 'Unknown'}`, { align: 'center' });
    docPdf.text(`Issued to: ${user.email || user.uid}`, { align: 'center' });
    docPdf.moveDown();

    // QR Code
    const qrCodeUrl = await QRCode.toDataURL(`https://sovranlyip.com/assets/${assetId}`);
    docPdf.image(Buffer.from(qrCodeUrl.split(',')[1], 'base64'), { fit: [100, 100], align: 'center' });
    docPdf.moveDown();

    // Legal Disclaimer
    docPdf.fontSize(8).fillColor('gray');
    const disclaimer = 'Legal Disclaimer: This certificate is provided for informational purposes as a record of IP registration on the Sovranly IP ledger. It does not constitute legal proof of ownership or intellectual property rights. Sovranly IP assumes no liability for the accuracy or completeness of the registered data. Users should seek independent legal counsel regarding IP protection.';
    docPdf.text(disclaimer, 50, 750, { align: 'center', width: 500 });

    docPdf.end();

    return new Promise<NextResponse>((resolve) => {
      docPdf.on('end', () => {
        const result = Buffer.concat(chunks);
        resolve(new NextResponse(result, {
          headers: {
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename="certificate_${assetId}.pdf"`,
          },
        }));
      });
    });
  } catch (error) {
    console.error('PDF Generation Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
