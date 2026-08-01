import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';
import { verifyAuthToken } from '@/lib/auth-server';

export async function GET(request: Request) {
  try {
    const user = await verifyAuthToken(request.headers.get('Authorization'));
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const transactionsRef = db.collection('transactions');
    const snapshot = await transactionsRef.orderBy('timestamp', 'desc').limit(50).get();
    
    const txs = snapshot.docs
      .map((doc: any) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          timestamp: data.timestamp && typeof data.timestamp.toDate === 'function' 
            ? data.timestamp.toDate().toISOString() 
            : data.timestamp
        };
      })
      .filter((tx: any) => 
        tx.creator === user.uid ||
        tx.userId === user.uid ||
        tx.fromAddress === user.uid ||
        tx.toAddress === user.uid ||
        (user.email && tx.creatorEmail === user.email)
      );

    return NextResponse.json(txs);
  } catch (error) {
    console.error('API Error in GET /api/transactions:', error);
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
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
