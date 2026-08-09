'use client';

export const dynamic = 'force-dynamic';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, LayoutDashboard } from 'lucide-react';

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-black text-zinc-100 p-8 max-w-7xl mx-auto space-y-8">
      <header className="flex items-center justify-between border-b border-zinc-800 pb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <LayoutDashboard className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Sovranly IP Engine Dashboard</h1>
            <p className="text-xs text-zinc-400">Zero Trust Asset Tokenization & Royalty Manager</p>
          </div>
        </div>
        <Button asChild variant="outline" size="sm">
          <Link href="/"><ArrowLeft className="w-4 h-4 mr-2" /> Back to Home</Link>
        </Button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl border border-zinc-800 bg-zinc-950/80 space-y-3">
          <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">Registered Assets</h3>
          <p className="text-3xl font-bold text-cyan-400">14 IP Compacts</p>
          <p className="text-xs text-zinc-500">SHA-256 On-Chain Verified</p>
        </div>
        <div className="p-6 rounded-2xl border border-zinc-800 bg-zinc-950/80 space-y-3">
          <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">Total Revenue</h3>
          <p className="text-3xl font-bold text-violet-400">85% Split Active</p>
          <p className="text-xs text-zinc-500">Instant Peer-to-Peer Distribution</p>
        </div>
        <div className="p-6 rounded-2xl border border-zinc-800 bg-zinc-950/80 space-y-3">
          <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">Workspace Sync</h3>
          <p className="text-3xl font-bold text-emerald-400">Google Slides</p>
          <p className="text-xs text-zinc-500">Auto-generated Pitch Decks</p>
        </div>
      </div>
    </div>
  );
}
