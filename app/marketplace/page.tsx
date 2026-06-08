'use client';
import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { getDb } from '@/lib/firebase';
import WalletButton from '@/components/wallet-connect';
import { Button } from '@/components/ui/button';

export default function MarketplacePage() {
  const [assets, setAssets] = useState<any[]>([]);

  useEffect(() => {
    const fetchAssets = async () => {
      const db = getDb();
      const querySnapshot = await getDocs(collection(db, "assets"));
      setAssets(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchAssets();
  }, []);

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans p-6">
      <nav className="flex items-center justify-between max-w-7xl mx-auto mb-16">
        <h1 className="text-2xl font-bold tracking-tight">Sovranly Marketplace</h1>
        <WalletButton />
      </nav>

      <main className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-extrabold tracking-tighter mb-10">Available Assets</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
           {assets.map(asset => (
             <div key={asset.id} className="p-8 bg-zinc-900 rounded-3xl border border-zinc-800">
               <h3 className="text-lg font-semibold">{asset.name || 'Unnamed Asset'}</h3>
               <p className="text-zinc-500 mt-2">{asset.description || 'No description'}</p>
               <Button className="mt-4 w-full rounded-full">Purchase</Button>
             </div>
           ))}
        </div>
      </main>
    </div>
  );
}
