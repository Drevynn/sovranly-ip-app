import { NextResponse } from 'next/server';
import { getDb } from '@/lib/firebase';
import { collection, getDocs, addDoc } from 'firebase/firestore';                

const db = getDb();

export async function GET() {
  try {
    console.log('Fetching assets...');
    const querySnapshot = await getDocs(collection(db, 'assets'));
    const assetsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return NextResponse.json(assetsData);
  } catch (error) {
    console.error('Error fetching assets:', error);
    return NextResponse.json({ error: 'Failed to fetch assets', details: String(error) }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const docRef = await addDoc(collection(db, 'assets'), body);
    return NextResponse.json({ id: docRef.id, ...body });
  } catch (error) {
    console.error('Error creating asset:', error);
    return NextResponse.json({ error: 'Failed to create asset', details: String(error) }, { status: 500 });
  }
}
