import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';

// Default permissions for public verification fallback
const DEFAULT_VERIFY_PERMISSIONS: Record<string, any> = {
  'PRM-4821-9304': {
    clearanceCode: 'PRM-4821-9304',
    assetTitle: 'Sovereign Modular Synth Loop Pack Vol. 1',
    assetType: 'Music / Audio',
    grantorName: 'Duane & Sovranly Labs',
    grantorWallet: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
    granteeName: 'Alex Rivera',
    granteeSocialHandle: '@alex_vlogs (YouTube: AlexRiveraMedia)',
    projectTitle: 'Tokyo Neon Cyberpunk City Walk - 4K Cinematic',
    projectUrl: 'https://youtube.com/watch?v=sample-video-01',
    platform: 'YouTube',
    scopeTitle: 'YouTube Long-Form Video (Background Sync)',
    pricingType: 'FREE_ATTRIBUTION',
    status: 'ACTIVE_CLEARED',
    verificationHash: '0x8f4d92a10e83b4c7d91e0a2b4c6e8f0a2b4c6e8f0a2b4c6e8f0a2b4c6e8f0a2b',
    issuedAt: '2026-08-20T14:20:00.000Z',
    notes: 'Cleared for monetized YouTube travel vlog. Artist attribution confirmed in video description box.'
  },
  'PRM-7193-2051': {
    clearanceCode: 'PRM-7193-2051',
    assetTitle: 'Sovereign Modular Synth Loop Pack Vol. 1',
    assetType: 'Music / Audio',
    grantorName: 'Duane & Sovranly Labs',
    grantorWallet: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
    granteeName: 'Elena Rostova',
    granteeSocialHandle: '@elenatech_tok (TikTok)',
    projectTitle: 'AI Workstation Setup 2026 - Behind the Scenes',
    projectUrl: 'https://tiktok.com/@elenatech_tok/video/sample',
    platform: 'TikTok',
    scopeTitle: 'TikTok & Short-form Social Clip (Up to 60s)',
    pricingType: 'FREE_ATTRIBUTION',
    status: 'ACTIVE_CLEARED',
    verificationHash: '0x3c2b1a0f9e8d7c6b5a4f3e2d1c0b9a8f7e6d5c4b3a2f1e0d9c8b7a6f5e4d3c2b',
    issuedAt: '2026-08-22T10:15:00.000Z',
    notes: 'Short-form clip sync authorization. Creator tagged track in TikTok sound credit.'
  },
  'PRM-9302-8812': {
    clearanceCode: 'PRM-9302-8812',
    assetTitle: 'Ethereal Cyber Cityscape 3D Concept Model',
    assetType: 'Artwork / Visual Art',
    grantorName: 'Duane & Sovranly Labs',
    grantorWallet: '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
    granteeName: 'Marcus Vance',
    granteeSocialHandle: '@vancestreams (Twitch)',
    projectTitle: 'Late Night Game Dev & Chill Synth Stream',
    projectUrl: 'https://twitch.tv/vancestreams',
    platform: 'Twitch',
    scopeTitle: 'Livestream Stream-Safe Background Audio',
    pricingType: 'MICRO_FEE',
    status: 'ACTIVE_CLEARED',
    verificationHash: '0x7e6d5c4b3a2f1e0d9c8b7a6f5e4d3c2b1a0f9e8d7c6b5a4f3e2d1c0b9a8f7e6d',
    issuedAt: '2026-08-25T18:45:00.000Z',
    notes: 'Stream-safe micro-license. $5 nominal micro-fee settled to creator wallet.'
  }
};

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    if (!id) return NextResponse.json({ error: 'Asset or Permission ID required' }, { status: 400 });

    // 1. Check if ID corresponds to a Permission clearance
    if (id.startsWith('PRM-') || id.startsWith('prm-') || DEFAULT_VERIFY_PERMISSIONS[id]) {
      let permData = DEFAULT_VERIFY_PERMISSIONS[id];
      try {
        const permSnap = await db.collection('permissions').doc(id).get();
        if (permSnap.exists) {
          permData = permSnap.data();
        }
      } catch (err) {
        console.warn('DB check for permission notice:', err);
      }

      if (permData) {
        return NextResponse.json({
          verified: true,
          isPermission: true,
          permission: permData,
          asset: {
            title: permData.assetTitle,
            type: permData.assetType || 'Music / Audio',
            ownerAddress: permData.grantorWallet || permData.grantorName,
            license: `Micro-Permission (${permData.platform} Rights Cleared)`,
            royalty: permData.royaltyPercentage || 0,
            isMinted: true,
            grantee: permData.granteeName,
            projectTitle: permData.projectTitle,
            platform: permData.platform,
            clearanceCode: permData.clearanceCode,
            status: permData.status,
            verificationHash: permData.verificationHash,
          },
          issuedAt: permData.issuedAt || new Date().toISOString()
        });
      }
    }

    // 2. Otherwise check standard Asset collection
    const assetSnap = await db.collection('assets').doc(id).get();

    if (!assetSnap.exists) {
      // Check if permission doc exists without PRM prefix
      try {
        const permSnap = await db.collection('permissions').doc(id).get();
        if (permSnap.exists) {
          const p = permSnap.data();
          return NextResponse.json({
            verified: true,
            isPermission: true,
            permission: p,
            asset: {
              title: p.assetTitle,
              type: p.assetType || 'Music / Audio',
              ownerAddress: p.grantorWallet || p.grantorName,
              license: `Micro-Permission (${p.platform})`,
              royalty: p.royaltyPercentage || 0,
              isMinted: true,
            },
            issuedAt: p.issuedAt || new Date().toISOString()
          });
        }
      } catch (err) {
        // Continue
      }
      return NextResponse.json({ error: 'Asset or Permission record not found' }, { status: 404 });
    }

    const assetData = assetSnap.data();

    return NextResponse.json({ 
      asset: assetData,
      isPermission: false,
      verified: true,
      issuedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Verification Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
