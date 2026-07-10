import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';
import { verifyAuthToken } from '@/lib/auth-server';

export async function GET(request: Request) {
  try {
    const user = await verifyAuthToken(request.headers.get('Authorization'));
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('Fetching assets...');
    let querySnapshot = await db.collection('assets').get();
    
    // Auto-seed if database is currently empty
    if (querySnapshot.empty) {
      console.log('No assets found. Seeding initial marketplace examples...');
      const SEED_ASSETS = [
        {
          title: "Neon Horizon - Synthwave Audio Stems",
          type: "Audio Sample Pack",
          royalty: 85,
          license: "Commercial Digital Sync License (Class 42 Protected)",
          description: "A high-fidelity premium library of 120+ synthetic audio stems, modular analog synthesizer loops, and digitized rhythm kits inspired by retro-wave cyberpunk acoustics. Includes full copyright clearance for independent content creators, podcasters, and video game developers.",
          ownerAddress: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
          isMinted: true,
          nftTokenId: "1001",
          mintTxHash: "0x8fa4c3f2b87d3532fefc292f7e0bc872f2da4ec3",
          price: 0.12,
          isForSale: true,
          createdAt: new Date().toISOString()
        },
        {
          title: "Sovereign UI Component Library - Enterprise License",
          type: "Software Utility",
          royalty: 90,
          license: "Dual-Use Enterprise License Agreement",
          description: "A secure, developer-ready react assembly designed with robust Tailwind CSS, continuous zero-trust validation guards, Web3 hardware wallet connectors, and multi-language selection controls.",
          ownerAddress: "0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199",
          isMinted: true,
          nftTokenId: "1002",
          mintTxHash: "0x4bca3e52fef49b062c199efa454eb8d92ca847242",
          price: 0.25,
          isForSale: true,
          createdAt: new Date().toISOString()
        },
        {
          title: "Ethereal Echoes NFT Audio Art",
          type: "Digital Artwork",
          royalty: 80,
          license: "Non-Exclusive Fine Art Display Rights Agreement",
          description: "Procedurally generated audio-visual canvases exploring three-dimensional cosmic spectrums. Fits high-definition digital galleries, ambient sound architectures, and live stream backdrops.",
          ownerAddress: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
          isMinted: true,
          nftTokenId: "1003",
          mintTxHash: "0x9c4f8bf6a200fa44cbfae8700bc712f2da48dbdf1",
          price: 0.08,
          isForSale: true,
          createdAt: new Date().toISOString()
        },
        {
          title: "Cybernetic Aegis Security Core",
          type: "Smart Contract Suite",
          royalty: 95,
          license: "Open Source Attribution with Commercial Fee Exemption",
          description: "Multi-party decentralized escrow script designed in Solidity to split licensing fees atomically. Complete with formal mathematical verification logs ensuring resistance against re-entrancy and update-gap attacks.",
          ownerAddress: "0x90F8bf6A479f320ced073E545b25137227557122",
          isMinted: true,
          nftTokenId: "1004",
          mintTxHash: "0x2da47f9f3ec0d73e545b25137227557f92ca48dbd",
          price: 0.45,
          isForSale: true,
          createdAt: new Date().toISOString()
        }
      ];

      for (const asset of SEED_ASSETS) {
        await db.collection('assets').add(asset);
      }
      
      // Re-fetch to get doc IDs correctly
      querySnapshot = await db.collection('assets').get();
    }

    const assetsData = querySnapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
    return NextResponse.json(assetsData);
  } catch (error) {
    console.error('Error fetching assets:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await verifyAuthToken(request.headers.get('Authorization'));
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    // Default asset state properties
    const enrichedBody = {
      ...body,
      isMinted: false,
      nftTokenId: null,
      mintTxHash: null,
      price: null,
      isForSale: false,
      createdAt: new Date().toISOString()
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
    await assetRef.update(data);
    return NextResponse.json({ success: true, id, ...data });
  } catch (error) {
    console.error('Error updating asset:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
