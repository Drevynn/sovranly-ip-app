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
  Timestamp,
} from 'firebase/firestore';
import { getDb } from './firebase';

class DocumentSnapshotCompat {
  private _snap: any;
  constructor(snap: any) {
    this._snap = snap;
  }
  get exists(): boolean {
    const ex = this._snap?.exists;
    return typeof ex === 'function' ? Boolean(ex.call(this._snap)) : Boolean(ex);
  }
  get id(): string {
    return this._snap?.id ?? '';
  }
  data(): any {
    try {
      return this._snap?.data?.() ?? undefined;
    } catch {
      return undefined;
    }
  }
}

class QuerySnapshotCompat {
  private _snap: any;
  constructor(snap: any) {
    this._snap = snap;
  }
  get empty(): boolean {
    return Boolean(this._snap?.empty);
  }
  get docs(): DocumentSnapshotCompat[] {
    const list = this._snap?.docs;
    if (!Array.isArray(list)) return [];
    return list.map((d: any) => new DocumentSnapshotCompat(d));
  }
}

class DocCompat {
  private _collectionName: string;
  private _docId: string;
  constructor(collectionName: string, docId: string) {
    this._collectionName = collectionName;
    this._docId = docId;
  }

  async get() {
    const d = doc(getDb(), this._collectionName, this._docId);
    const snap = await getDoc(d);
    return new DocumentSnapshotCompat(snap);
  }

  async set(data: any) {
    const d = doc(getDb(), this._collectionName, this._docId);
    await setDoc(d, this._processData(data));
    return { success: true };
  }

  async update(data: any) {
    const d = doc(getDb(), this._collectionName, this._docId);
    await updateDoc(d, this._processData(data));
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
    if (Array.isArray(data)) return data.map((item) => this._processData(item));
    if (typeof data === 'object') {
      if (typeof data.toDate === 'function') return data;
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
  private _collectionName: string;
  constructor(collectionName: string) {
    this._collectionName = collectionName;
  }

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
  private _collectionName: string;
  constructor(collectionName: string) {
    this._collectionName = collectionName;
  }

  async get() {
    const c = collection(getDb(), this._collectionName);
    const snap = await getDocs(c);
    return new QuerySnapshotCompat(snap);
  }

  async add(data: any) {
    const c = collection(getDb(), this._collectionName);
    const ref = await addDoc(c, this._processData(data));
    return { id: ref.id };
  }

  doc(docId: string) {
    return new DocCompat(this._collectionName, docId);
  }

  where(field: string, op: any, value: any) {
    return new QueryCompat(this._collectionName).where(field, op, value);
  }

  orderBy(field: string, direction?: 'asc' | 'desc') {
    return new QueryCompat(this._collectionName).orderBy(field, direction);
  }

  limit(count: number) {
    return new QueryCompat(this._collectionName).limit(count);
  }

  private _processData(data: any): any {
    if (data === null || data === undefined) return data;
    if (data instanceof Date) return Timestamp.fromDate(data);
    if (Array.isArray(data)) return data.map((item) => this._processData(item));
    if (typeof data === 'object') {
      if (typeof data.toDate === 'function') return data;
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
  },
};
