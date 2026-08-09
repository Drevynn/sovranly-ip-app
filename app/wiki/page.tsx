'use client';

export const dynamic = 'force-dynamic';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, BookOpen, ShieldAlert } from 'lucide-react';

export default function WikiPage() {
  return (
    <div className="min-h-screen bg-black text-zinc-100 p-8 max-w-7xl mx-auto space-y-8">
      <header className="flex items-center justify-between border-b border-zinc-800 pb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Sovranly IP Sovereign Knowledge Wiki</h1>
            <p className="text-xs text-zinc-400">Legal Guidelines, USPTO Class 42 & On-Chain Standards</p>
          </div>
        </div>
        <Button asChild variant="outline" size="sm">
          <Link href="/"><ArrowLeft className="w-4 h-4 mr-2" /> Back to Home</Link>
        </Button>
      </header>

      <div className="p-8 rounded-2xl border border-zinc-800 bg-zinc-950/80 space-y-4">
        <div className="flex items-center gap-3 text-cyan-400">
          <ShieldAlert className="w-6 h-6" />
          <h2 className="text-lg font-bold text-white">Refund & Cancellation Policy (Immutable On-Chain Minting)</h2>
        </div>
        <p className="text-sm text-zinc-300 leading-relaxed">
          Once an IP asset is minted or tokenized on Sovranly IP, its cryptographic SHA-256 hash, timestamp, and ownership record are written permanently to an immutable blockchain ledger. Because blockchain transactions cannot be reversed or erased, all minting and registration fees are 100% non-refundable.
        </p>
      </div>
    </div>
  );
}
