'use client';

export const dynamic = 'force-dynamic';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ShoppingBag, ShieldCheck } from 'lucide-react';

export default function MarketplacePage() {
  return (
    <div className="min-h-screen bg-black text-zinc-100 p-8 max-w-7xl mx-auto space-y-8">
      <header className="flex items-center justify-between border-b border-zinc-800 pb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Sovranly Sovereign IP Marketplace</h1>
            <p className="text-xs text-zinc-400">Verified IP Licensing & Royalty Acquisition</p>
          </div>
        </div>
        <Button asChild variant="outline" size="sm">
          <Link href="/"><ArrowLeft className="w-4 h-4 mr-2" /> Back to Home</Link>
        </Button>
      </header>

      <div className="p-8 rounded-2xl border border-zinc-800 bg-zinc-950/80 text-center space-y-4">
        <ShieldCheck className="w-12 h-12 text-cyan-400 mx-auto" />
        <h2 className="text-xl font-bold text-white">Verified Smart Licensing Catalog</h2>
        <p className="text-sm text-zinc-400 max-w-xl mx-auto">Browse on-chain registered intellectual property assets, commercial audio tracks, software patents, and visual art licenses.</p>
      </div>
    </div>
  );
}
