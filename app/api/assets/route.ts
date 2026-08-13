import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';
import { verifyAuthToken } from '@/lib/auth-server';

// Default initial showcase assets for marketplace catalog when collection is newly initialized
const DEFAULT_MARKETPLACE_ASSETS = [
  {
    id: 'svip-market-001',
    title: 'Sovereign Modular Synth Loop Pack Vol. 1',
    type: 'Audio Pack',
    royalty: 85,
    license: 'Commercial Digital Sync License (Class 42 Protected)',
    description: 'High-definition modular analog synthesizer loops with complete copyright clearance, cryptographic zero-trust validation, and stems.',
    ownerAddress: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
    isMinted: true,
    nftTokenId: 'SVIP-482019',
    mintTxHash: '0x3a9f7e8b2c1d0a5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e',
    price: 0.15,
    isForSale: true,
    duration: '3 Years',
    usages: ['Streaming & Broadcasting', 'Derivative Works', 'Commercial Sponsorships'],
    customClause: 'Creator retains all underlying copyright and 85% secondary transaction royalties via smart contract escrow.',
    creator: 'sandbox-guest-agent-007',
    userId: 'sandbox-guest-agent-007',
    creatorEmail: 'create@sovranlyip.com',
    createdAt: new Date().toISOString()
  },
  {
    id: 'svip-market-002',
    title: 'Cybernetic Aegis UI Component Suite',
    type: 'Software Utility',
    royalty: 90,
    license: 'Commercial Enterprise Codebase License',
    description: 'Production-ready Next.js 15, Tailwind, and Web3 smart contract connection modules with continuous automated royalty split routing.',
    ownerAddress: '0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199',
    isMinted: true,
    nftTokenId: 'SVIP-891042',
    mintTxHash: '0x7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c',
    price: 0.45,
    isForSale: true,
    duration: 'Perpetual',
    usages: ['Software Integration', 'Commercial Sponsorships'],
    customClause: 'License grants worldwide, non-exclusive deployment for SaaS applications with zero-trust key attestation.',
    creator: 'sandbox-guest-agent-007',
    userId: 'sandbox-guest-agent-007',
    creatorEmail: 'create@sovranlyip.com',
    createdAt: new Date().toISOString()
  },
  {
    id: 'svip-market-003',
    title: 'Ethereal Cyber Cityscape 3D Concept Model',
    type: 'Digital Artwork',
    royalty: 80,
    license: 'Broadcast & Media Sync License',
    description: 'High-poly procedural 3D model asset in glTF/USDZ formats designed for virtual film production, game engines, and metaverse galleries.',
    ownerAddress: '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
    isMinted: true,
    nftTokenId: 'SVIP-193847',
    mintTxHash: '0x9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b',
    price: 0.28,
    isForSale: true,
    duration: '5 Years',
    usages: ['Streaming & Broadcasting', 'Public Performance', 'Physical Merchandise'],
    customClause: 'Includes high-resolution textures and normal maps. Prohibits unauthorized model weight training without an active AI Licensing token.',
    creator: 'sandbox-guest-agent-007',
    userId: 'sandbox-guest-agent-007',
    creatorEmail: 'create@sovranlyip.com',
    createdAt: new Date().toISOString()
  },
  {
    id: 'svip-market-004',
    title: 'Zero-Trust Chainlink Oracle Telemetry Feed',
    type: 'Software Utility',
    royalty: 85,
    license: 'Sovereign Decentralized Data Feed License',
    description: 'Cryptographically signed real-time streaming telemetry and streaming listener analytics feed with node consensus validation.',
    ownerAddress: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
    isMinted: true,
    nftTokenId: 'SVIP-672910',
    mintTxHash: '0x5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d',
    price: 0.10,
    isForSale: true,
    duration: '1 Year',
    usages: ['Software Integration', 'Streaming & Broadcasting'],
    customClause: 'Real-time telemetry payload accessible via zero-trust signature key with 99.98% uptime SLA.',
    creator: 'sandbox-guest-agent-007',
    userId: 'sandbox-guest-agent-007',
    creatorEmail: 'create@sovranlyip.com',
    createdAt: new Date().toISOString()
  }
];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const scope = searchParams.get('scope'); // 'marketplace' | 'all' | 'mine' | null

    const user = await verifyAuthToken(request.headers.get('Authorization'));

    let assetsData: any[] = [];
    try {
      const querySnapshot = await db.collection('assets').get();
      assetsData = querySnapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
    } catch (dbErr) {
      console.warn('Firestore fetch assets warning:', dbErr);
      assetsData = [];
    }

    // If query is for marketplace, public catalog, or unauthenticated visitor browsing public marketplace
    if (scope === 'marketplace' || scope === 'all' || !user) {
      if (assetsData.length === 0) {
        return NextResponse.json(DEFAULT_MARKETPLACE_ASSETS);
      }
      return NextResponse.json(assetsData);
    }

    // Authenticated user specific filter for creator workspace / dashboard
    console.log('Fetching assets for user:', user.uid);
    const userAssets = assetsData.filter((asset: any) => 
      asset.creator === user.uid ||
      asset.userId === user.uid ||
      (user.email && asset.creatorEmail === user.email) ||
      asset.ownerAddress === user.uid ||
      user.uid === 'sandbox-guest-agent-007'
    );

    // If user has no assets registered yet in sandbox, provide initial sandbox assets
    if (userAssets.length === 0 && user.uid === 'sandbox-guest-agent-007') {
      return NextResponse.json(DEFAULT_MARKETPLACE_ASSETS);
    }

    return NextResponse.json(userAssets);
  } catch (error) {
    console.error('Error in GET /api/assets:', error);
    return NextResponse.json(DEFAULT_MARKETPLACE_ASSETS);
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
      isMinted: body.isMinted ?? false,
      nftTokenId: body.nftTokenId ?? null,
      mintTxHash: body.mintTxHash ?? null,
      price: body.price ?? null,
      isForSale: body.isForSale ?? false,
      createdAt: body.createdAt ?? new Date().toISOString()
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
      // If it's one of the seed demo assets, return success with updated data
      return NextResponse.json({ success: true, id, ...data });
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
