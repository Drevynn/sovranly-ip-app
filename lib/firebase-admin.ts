import { 
  collection, 
  getDocs, 
  addDoc, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp
} from 'firebase/firestore';
import { getDb } from './firebase';

class DocumentSnapshotCompat {
  constructor(private _snap: any) {}
  get exists() {
    return this._snap.exists();
  }
  get id() {
    return this._snap.id;
  }
  data() {
    return this._snap.data();
  }
}

class QuerySnapshotCompat {
  constructor(private _snap: any) {}
  get empty() {
    return this._snap.empty;
  }
  get docs() {
    return this._snap.docs.map((d: any) => new DocumentSnapshotCompat(d));
  }
}

class DocCompat {
  constructor(private _collectionName: string, private _docId: string) {}

  async get() {
    const d = doc(getDb(), this._collectionName, this._docId);
    const snap = await getDoc(d);
    return new DocumentSnapshotCompat(snap);
  }

  async set(data: any) {
    const d = doc(getDb(), this._collectionName, this._docId);
    const processedData = this._processData(data);
    await setDoc(d, processedData);
    return { success: true };
  }

  async update(data: any) {
    const d = doc(getDb(), this._collectionName, this._docId);
    const processedData = this._processData(data);
    await updateDoc(d, processedData);
    return { success: true };
  }

  async delete() {
    const d = doc(getDb(), this._collectionName, this._docId);
    await deleteDoc(d);
    return { success: true };
  }

  private _processData(data: any): any {
    if (data === null || data === undefined) return data;
    if (data instanceof Date) return Timestamp.fromDate(data);
    if (Array.isArray(data)) return data.map(item => this._processData(item));
    if (typeof data === 'object') {
      // Avoid raw Firestore Timestamps or other class objects being treated as simple objects
      if (typeof data.toDate === 'function') {
        return data; // Keep as-is if it's already a Firestore Timestamp
      }
      const copy: any = {};
      for (const key of Object.keys(data)) {
        copy[key] = this._processData(data[key]);
      }
      return copy;
    }
    return data;
  }
}

class QueryCompat {
  private _constraints: any[] = [];

  constructor(private _collectionName: string) {}

  where(field: string, op: any, value: any) {
    this._constraints.push(where(field, op, value));
    return this;
  }

  orderBy(field: string, direction?: 'asc' | 'desc') {
    this._constraints.push(orderBy(field, direction || 'asc'));
    return this;
  }

  limit(count: number) {
    this._constraints.push(limit(count));
    return this;
  }

  async get() {
    const c = collection(getDb(), this._collectionName);
    const q = query(c, ...this._constraints);
    const snap = await getDocs(q);
    return new QuerySnapshotCompat(snap);
  }
}

class CollectionCompat {
  constructor(private _collectionName: string) {}

  async get() {
    const c = collection(getDb(), this._collectionName);
    const snap = await getDocs(c);
    return new QuerySnapshotCompat(snap);
  }

  async add(data: any) {
    const c = collection(getDb(), this._collectionName);
    const processedData = this._processData(data);
    const ref = await addDoc(c, processedData);
    return { id: ref.id };
  }

  doc(docId: string) {
    return new DocCompat(this._collectionName, docId);
  }

  where(field: string, op: any, value: any) {
    const q = new QueryCompat(this._collectionName);
    return q.where(field, op, value);
  }

  orderBy(field: string, direction?: 'asc' | 'desc') {
    const q = new QueryCompat(this._collectionName);
    return q.orderBy(field, direction);
  }

  limit(count: number) {
    const q = new QueryCompat(this._collectionName);
    return q.limit(count);
  }

  private _processData(data: any): any {
    if (data === null || data === undefined) return data;
    if (data instanceof Date) return Timestamp.fromDate(data);
    if (Array.isArray(data)) return data.map(item => this._processData(item));
    if (typeof data === 'object') {
      if (typeof data.toDate === 'function') {
        return data;
      }
      const copy: any = {};
      for (const key of Object.keys(data)) {
        copy[key] = this._processData(data[key]);
      }
      return copy;
    }
    return data;
  }
}

export const db = {
  collection(name: string) {
    return new CollectionCompat(name);
  }
};

