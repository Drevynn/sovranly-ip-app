import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';

export async function GET() {
  try {
    const transactionsRef = db.collection('transactions');
    const snapshot = await transactionsRef.orderBy('timestamp', 'desc').limit(5).get();
    
    let txs = snapshot.docs.map((doc: any) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        timestamp: data.timestamp ? data.timestamp.toDate().toISOString() : data.timestamp
      };
    });

    if (txs.length === 0) {
      console.log('No transactions found in Firestore. Seeding initial activity logs...');
      const initialTransactions = [
        {
          hash: '0x4a7e93b1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9',
          type: 'Mint IP Asset',
          assetTitle: 'Abstract Harmony #12',
          amount: '0.00 ETH',
          fromAddress: '0x71C7656EC7ab88b098defB751B7401B5f6d1476B',
          toAddress: '0x0000000000000000000000000000000000000000',
          timestamp: new Date(Date.now() - 5 * 60 * 1000)
        },
        {
          hash: '0x2c9d82f3e4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1',
          type: 'License Assigned',
          assetTitle: 'Cosmic Synthesis Beat',
          amount: '0.15 ETH',
          fromAddress: '0x3F2a51A76b88b098defB751B7401B5f6d1476B',
          toAddress: '0x71C7656EC7ab88b098defB751B7401B5f6d1476B',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000)
        },
        {
          hash: '0x9e3f12a8b9c0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6',
          type: 'Royalty Split',
          assetTitle: 'Neon Horizon Script',
          amount: '0.045 ETH',
          fromAddress: '0x9965503B1a01B6D54f2a3b4c5d6e7f8a9b0c1d2e',
          toAddress: '0x71C7656EC7ab88b098defB751B7401B5f6d1476B',
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000)
        },
        {
          hash: '0x1b6d54f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0',
          type: 'License Purchased',
          assetTitle: 'Quantum Echoes Theme',
          amount: '0.08 ETH',
          fromAddress: '0x55d398326f99059fF775485246999027B3197955',
          toAddress: '0x71C7656EC7ab88b098defB751B7401B5f6d1476B',
          timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
        },
        {
          hash: '0x8f9a2d1c3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b',
          type: 'Mint IP Asset',
          assetTitle: 'Sovereign Code Echo',
          amount: '0.00 ETH',
          fromAddress: '0x71C7656EC7ab88b098defB751B7401B5f6d1476B',
          toAddress: '0x0000000000000000000000000000000000000000',
          timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
        }
      ];

      for (const tx of initialTransactions) {
        await transactionsRef.add(tx);
      }

      // Re-fetch sorted list
      const snapshotNew = await transactionsRef.orderBy('timestamp', 'desc').limit(5).get();
      txs = snapshotNew.docs.map((doc: any) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          timestamp: data.timestamp ? data.timestamp.toDate().toISOString() : data.timestamp
        };
      });
    }

    return NextResponse.json(txs);
  } catch (error) {
    console.error('API Error in GET /api/transactions:', error);
    return NextResponse.json({ error: 'Failed to fetch transactions', details: String(error) }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const transactionsRef = db.collection('transactions');
    const newTx = {
      hash: body.hash || '0x' + Math.random().toString(16).slice(2) + Math.random().toString(16).slice(2),
      type: body.type || 'IP Interaction',
      assetTitle: body.assetTitle || 'Unknown Asset',
      amount: body.amount || '0.00 ETH',
      fromAddress: body.fromAddress || '0x0000000000000000000000000000000000000000',
      toAddress: body.toAddress || '0x0000000000000000000000000000000000000000',
      timestamp: new Date()
    };
    const docRef = await transactionsRef.add(newTx);
    return NextResponse.json({ id: docRef.id, ...newTx, timestamp: newTx.timestamp.toISOString() });
  } catch (error) {
    console.error('Error recording transaction:', error);
    return NextResponse.json({ error: 'Failed to record transaction', details: String(error) }, { status: 500 });
  }
}
