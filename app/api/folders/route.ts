import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';
import { verifyAuthToken } from '@/lib/auth-server';

export interface FolderItem {
  id: string;
  name: string;
  description?: string;
  color: string;
  icon: string;
  userId?: string;
  createdAt: string;
}

const DEFAULT_FOLDERS: FolderItem[] = [
  {
    id: 'folder-master-recordings',
    name: 'Master Recordings',
    description: 'Finished audio masters, lossless WAV stems, and vocal tracks',
    color: 'emerald',
    icon: 'music',
    createdAt: '2026-01-15T00:00:00.000Z'
  },
  {
    id: 'folder-software-packages',
    name: 'Software Packages',
    description: 'Production smart contracts, component suites, and developer libraries',
    color: 'cyan',
    icon: 'code',
    createdAt: '2026-01-16T00:00:00.000Z'
  },
  {
    id: 'folder-3d-virtual-worlds',
    name: '3D & Virtual Worlds',
    description: 'Procedural 3D models, glTF renders, and spatial metaverse assets',
    color: 'violet',
    icon: 'image',
    createdAt: '2026-01-18T00:00:00.000Z'
  },
  {
    id: 'folder-sync-pitches',
    name: 'Sync Pitches',
    description: 'Curated creative assets prepared for commercial media licensing & film sync',
    color: 'amber',
    icon: 'sparkles',
    createdAt: '2026-02-01T00:00:00.000Z'
  }
];

export async function GET(request: Request) {
  try {
    const user = await verifyAuthToken(request.headers.get('Authorization'));
    if (!user) {
      return NextResponse.json(DEFAULT_FOLDERS);
    }

    const snapshot = await db
      .collection('folders')
      .where('userId', '==', user.uid)
      .get();

    if (snapshot.empty) {
      return NextResponse.json(DEFAULT_FOLDERS);
    }

    const folders: FolderItem[] = snapshot.docs.map((doc: any) => ({
      id: doc.id,
      ...doc.data()
    } as FolderItem));

    // Merge default folders if not already present
    const existingNames = new Set(folders.map(f => f.name.toLowerCase()));
    for (const def of DEFAULT_FOLDERS) {
      if (!existingNames.has(def.name.toLowerCase())) {
        folders.unshift(def);
      }
    }

    return NextResponse.json(folders);
  } catch (error) {
    console.error('Error fetching folders:', error);
    return NextResponse.json(DEFAULT_FOLDERS);
  }
}

export async function POST(request: Request) {
  try {
    const user = await verifyAuthToken(request.headers.get('Authorization'));
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    if (!body.name || !body.name.trim()) {
      return NextResponse.json({ error: 'Folder name is required' }, { status: 400 });
    }

    const newFolder: Omit<FolderItem, 'id'> = {
      name: body.name.trim(),
      description: body.description?.trim() || '',
      color: body.color || 'cyan',
      icon: body.icon || 'folder',
      userId: user.uid,
      createdAt: new Date().toISOString()
    };

    const docRef = await db.collection('folders').add(newFolder);
    return NextResponse.json({ id: docRef.id, ...newFolder });
  } catch (error) {
    console.error('Error creating folder:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const user = await verifyAuthToken(request.headers.get('Authorization'));
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id, ...updates } = await request.json();
    if (!id) {
      return NextResponse.json({ error: 'Folder ID is required' }, { status: 400 });
    }

    const folderRef = db.collection('folders').doc(id);
    const doc = await folderRef.get();
    if (!doc.exists) {
      // Default folder mock edit
      return NextResponse.json({ success: true, id, ...updates });
    }

    // Verify ownership before updating
    const existing = doc.data();
    if (existing?.userId && existing.userId !== user.uid) {
      return NextResponse.json({ error: 'Forbidden: You do not own this folder' }, { status: 403 });
    }

    await folderRef.update(updates);
    return NextResponse.json({ success: true, id, ...updates });
  } catch (error) {
    console.error('Error updating folder:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const user = await verifyAuthToken(request.headers.get('Authorization'));
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Folder ID required' }, { status: 400 });
    }

    const folderRef = db.collection('folders').doc(id);
    const doc = await folderRef.get();
    if (doc.exists) {
      // Verify ownership before deleting
      const existing = doc.data();
      if (existing?.userId && existing.userId !== user.uid) {
        return NextResponse.json({ error: 'Forbidden: You do not own this folder' }, { status: 403 });
      }
      await folderRef.delete();
    }

    return NextResponse.json({ success: true, message: 'Folder removed successfully' });
  } catch (error) {
    console.error('Error deleting folder:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
