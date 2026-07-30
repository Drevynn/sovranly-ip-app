import { NextRequest, NextResponse } from 'next/server';
import { verifyAuthToken } from '@/lib/auth-server';

function createMimeMessage({
  to,
  subject,
  htmlBody,
}: {
  to: string;
  subject: string;
  htmlBody: string;
}): string {
  const messageParts = [
    `To: ${to}`,
    'Subject: ' + subject,
    'Content-Type: text/html; charset=utf-8',
    'MIME-Version: 1.0',
    '',
    htmlBody,
  ];

  const message = messageParts.join('\r\n');

  // Convert to Base64URL
  return Buffer.from(message)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

export async function POST(req: NextRequest) {
  try {
    // Require a valid Firebase ID token (or sandbox in non-prod)
    const user = await verifyAuthToken(req.headers.get('Authorization'));
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();

    const {
      recipientEmail,
      clientName = 'Valued Client',
      documentTitle = 'Sovereign IP Document',
      documentHash = '0x...',
      txHash = '0x...',
      certificateId = 'CERT-' + Math.floor(Math.random() * 1000000),
      notaryName = 'Certified Sovereign Notary',
      commissionNumber = 'N/A',
      notaryState = 'CA',
      gmailAccessToken, // Optional: caller may supply a short-lived Gmail OAuth token separately
    } = body;

    if (!recipientEmail || !recipientEmail.includes('@')) {
      return NextResponse.json(
        { error: 'A valid recipient email address is required.' },
        { status: 400 }
      );
    }

    const htmlBody = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #09090b; color: #f4f4f5; margin: 0; padding: 24px; }
          .container { max-width: 600px; margin: 0 auto; background-color: #121215; border: 1px solid #27272a; border-radius: 12px; padding: 32px; box-shadow: 0 10px 25px rgba(0,0,0,0.5); }
          .header { text-align: center; border-bottom: 1px solid #27272a; padding-bottom: 20px; margin-bottom: 24px; }
          .title { color: #06b6d4; font-size: 20px; font-weight: 800; letter-spacing: 1px; margin: 0; text-transform: uppercase; }
          .subtitle { color: #a1a1aa; font-size: 12px; margin-top: 4px; text-transform: uppercase; font-family: monospace; }
          .content { line-height: 1.6; font-size: 14px; color: #e4e4e7; }
          .card { background-color: #18181b; border: 1px solid #27272a; border-radius: 8px; padding: 16px; margin: 20px 0; font-family: monospace; font-size: 12px; }
          .field { margin-bottom: 8px; }
          .label { color: #71717a; text-transform: uppercase; font-size: 10px; display: block; }
          .value { color: #22d3ee; word-break: break-all; font-weight: 600; }
          .footer { border-top: 1px solid #27272a; padding-top: 20px; margin-top: 28px; text-align: center; font-size: 11px; color: #71717a; font-family: monospace; }
          .badge { display: inline-block; background-color: #06b6d420; color: #22d3ee; border: 1px solid #0891b240; padding: 4px 10px; border-radius: 9999px; font-size: 10px; font-weight: bold; text-transform: uppercase; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 class="title">SOVRANLY IP</h1>
            <div class="subtitle">Official On-Chain Notarization Certificate</div>
          </div>
          
          <div class="content">
            <p>Dear <strong>${clientName}</strong>,</p>
            <p>Your document has been successfully verified, timestamped, and notarized on the blockchain by your designated commissioned notary.</p>
            
            <div style="text-align: center; margin: 16px 0;">
              <span class="badge">✓ On-Chain Verified & Sealed</span>
            </div>

            <div class="card">
              <div class="field">
                <span class="label">Document Title</span>
                <span class="value" style="color: #ffffff;">${documentTitle}</span>
              </div>
              <div class="field">
                <span class="label">Certificate Reference</span>
                <span class="value">${certificateId}</span>
              </div>
              <div class="field">
                <span class="label">Cryptographic Hash (SHA-256)</span>
                <span class="value">${documentHash}</span>
              </div>
              <div class="field">
                <span class="label">Transaction Hash</span>
                <span class="value">${txHash}</span>
              </div>
              <div class="field">
                <span class="label">Commissioned Notary</span>
                <span class="value" style="color: #a1a1aa;">${notaryName} (${notaryState} Commission #${commissionNumber})</span>
              </div>
              <div class="field">
                <span class="label">Requested by</span>
                <span class="value" style="color: #a1a1aa;">${user.email || user.uid}</span>
              </div>
            </div>

            <p style="font-size: 12px; color: #a1a1aa;">
              You can verify this document at any time on the Sovranly IP Ledger using your document hash or certificate reference ID.
            </p>
          </div>

          <div class="footer">
            SOVRANLY IP — Zero-Trust Blockchain IP & Notary Architecture<br/>
            This email was sent automatically upon completion of your notarization session.
          </div>
        </div>
      </body>
      </html>
    `;

    const rawMessage = createMimeMessage({
      to: recipientEmail,
      subject: `Notarization Certificate: ${documentTitle} - Sovranly IP`,
      htmlBody,
    });

    // Live Gmail send only when an explicit Gmail OAuth token is supplied in the body.
    // Never reuse the Firebase ID token for Gmail API calls (confused-deputy prevention).
    if (!gmailAccessToken || typeof gmailAccessToken !== 'string') {
      return NextResponse.json({
        success: true,
        mode: 'sandbox_simulation',
        message: `[SANDBOX / QUEUED] Notarization notification prepared for ${recipientEmail} by ${user.uid}`,
        details: {
          recipientEmail,
          documentTitle,
          certificateId,
          requestedBy: user.uid,
          sentAt: new Date().toISOString(),
        },
      });
    }

    const gmailRes = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${gmailAccessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ raw: rawMessage }),
    });

    const resData = await gmailRes.json();

    if (!gmailRes.ok) {
      console.error('Gmail API send error:', resData);
      return NextResponse.json(
        {
          error: resData.error?.message || 'Failed to send email via Gmail API',
          code: gmailRes.status,
        },
        { status: gmailRes.status }
      );
    }

    return NextResponse.json({
      success: true,
      mode: 'live_gmail_api',
      messageId: resData.id,
      threadId: resData.threadId,
      recipientEmail,
      requestedBy: user.uid,
      sentAt: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Notarization email API route error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
