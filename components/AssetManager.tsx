'use client';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tag, FileText, BadgeCheck } from 'lucide-react';

type Asset = { id: number, title: string, type: string, royalty: number, license: string };

export default function AssetManager({ walletAddress }: { walletAddress: string | null }) {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [newAsset, setNewAsset] = useState<Omit<Asset, 'id'>>({ title: '', type: '', royalty: 85, license: 'Standard' });

  useEffect(() => {
    fetch('/api/assets')
      .then(res => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then(data => setAssets(data))
      .catch(err => console.error('Fetch error:', err));
  }, []);

  const addAsset = async () => {
    if(newAsset.title && newAsset.type && walletAddress) {
      const response = await fetch('/api/assets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newAsset, ownerAddress: walletAddress })
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setAssets([...assets, data]);
      setNewAsset({ title: '', type: '', royalty: 85, license: 'Standard' });
    }
  }

  return (
    <div className="space-y-8">
      <Card className="bg-zinc-950 border border-zinc-800 shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl text-white">Register IP Asset</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-zinc-400">Title</Label>
              <Input id="title" value={newAsset.title} onChange={(e) => setNewAsset({...newAsset, title: e.target.value})} className="bg-zinc-900 border-zinc-700 text-white" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type" className="text-zinc-400">Asset Type</Label>
              <Input id="type" value={newAsset.type} onChange={(e) => setNewAsset({...newAsset, type: e.target.value})} className="bg-zinc-900 border-zinc-700 text-white" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="royalty" className="text-zinc-400">Royalty %</Label>
              <Input id="royalty" type="number" value={newAsset.royalty} onChange={(e) => setNewAsset({...newAsset, royalty: parseInt(e.target.value)})} className="bg-zinc-900 border-zinc-700 text-white" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="license" className="text-zinc-400">License Term</Label>
              <Input id="license" value={newAsset.license} onChange={(e) => setNewAsset({...newAsset, license: e.target.value})} className="bg-zinc-900 border-zinc-700 text-white" />
            </div>
          </div>
          <Button onClick={addAsset} disabled={!walletAddress} className="mt-8 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold">
            {walletAddress ? 'Register Asset' : 'Connect Wallet to Register'}
          </Button>
        </CardContent>
      </Card>
      
      <div>
        <h2 className="text-2xl text-white font-bold mb-6">Your Registered IP</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {assets.map((a, i) => (
            <Card key={i} className="bg-zinc-950 border border-zinc-800 shadow-md hover:border-cyan-500/50 transition-colors">
              <CardContent className="p-6">
                <div className="text-white text-xl font-bold mb-4">{a.title}</div>
                <div className="text-4xl font-mono text-cyan-400 font-bold mb-6">{a.royalty}%<span className="text-lg text-zinc-500"> Royalty</span></div>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-zinc-400 bg-zinc-900 px-3 py-2 rounded-md">
                    <Tag className="w-4 h-4 text-cyan-500" />
                    <span>{a.type}</span>
                  </div>
                  <div className="flex items-center gap-2 text-zinc-400 bg-zinc-900 px-3 py-2 rounded-md">
                    <FileText className="w-4 h-4 text-emerald-500" />
                    <span>{a.license}</span>
                  </div>
                </div>
                <Button className="w-full mt-4 bg-zinc-800 hover:bg-zinc-700 text-white font-semibold">
                    Mint NFT
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
