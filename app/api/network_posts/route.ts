import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';
import { verifyAuthToken } from '@/lib/auth-server';

export async function GET(request: Request) {
  try {
    const user = await verifyAuthToken(request.headers.get('Authorization'));
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const snapshot = await db.collection('network_posts')
                             .orderBy('createdAt', 'desc')
                             .limit(50)
                             .get();
    
    const posts = snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
    return NextResponse.json(posts);
  } catch (error) {
    console.error('Error fetching network posts:', error);
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
    const { content, authorName, authorAddress, postType } = body;

    if (!content || !authorName) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    const newPost = {
      content,
      authorName,
      authorAddress: authorAddress || 'Unknown',
      postType: postType || 'general',
      likes: 0,
      createdAt: new Date().toISOString()
    };

    const docRef = await db.collection('network_posts').add(newPost);
    return NextResponse.json({ id: docRef.id, ...newPost });
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
