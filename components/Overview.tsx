'use client';

import { Card, CardContent } from '@/components/ui/card';
import ActivityLog from '@/components/ActivityLog';
import ApiLatencyMonitor from '@/components/ApiLatencyMonitor';
import { Music, Sparkles, ShieldCheck, ArrowRight } from 'lucide-react';

export default function Overview() {
  const cards = [
    { title: 'My IP Assets', value: '47' },
    { title: 'Total Earnings', value: '$128.4k', color: 'text-emerald-400' },
    { title: 'Active Licenses', value: '19', color: 'text-cyan-400' },
    { title: 'Pending Royalties', value: '$4,820' },
  ];

  return (
    <div className="space-y-8 font-sans">
      {/* Hero */}
      <div className="relative rounded-3xl overflow-hidden border border-zinc-800 bg-zinc-900">
        <div className="absolute inset-0 z-0">
          {/* Futuristic tech grid background */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293720_1px,transparent_1px),linear-gradient(to_bottom,#1f293720_1px,transparent_1px)] bg-[size:24px_24px]" />
          <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/10 via-transparent to-violet-500/5" />
          <div className="absolute -top-1/2 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[80px]" />
        </div>
        <div className="relative z-10 p-12 flex flex-col items-center justify-center text-center space-y-4">
          <h2 className="text-4xl font-bold tracking-tighter text-white uppercase">Welcome to Sovranly IP</h2>
          <p className="text-zinc-400 max-w-lg">Zero Trust Sovereign IP Management System for Creators. Secure, track, and license your assets with blockchain transparency.</p>
        </div>
      </div>

      {/* SYNC LICENSING STOREFRONT FEATURE BANNER */}
      <div className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-zinc-950 via-zinc-900 to-violet-950/40 border border-violet-500/30 shadow-2xl overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-violet-500/10 rounded-full blur-[90px] pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-950/70 border border-violet-500/40 text-violet-300 text-xs font-mono uppercase tracking-widest font-bold">
              <Sparkles className="w-3.5 h-3.5 text-violet-400" />
              <span>NEW: Automated Sync Licensing Pipeline</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
              Instant Clearance Sync Storefront for Games, Films &amp; Media
            </h3>
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-light">
              Clear music synchronization rights in seconds instead of weeks. Set upfront pricing tiers (<span className="text-violet-300">Indie</span>, <span className="text-cyan-300">Commercial</span>, <span className="text-emerald-300">Broadcast/AAA</span>), execute on-chain smart contracts, and automatically split royalties among co-writers and producers.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <div className="px-4 py-3 rounded-2xl bg-zinc-950/80 border border-zinc-800 text-center">
              <p className="text-[10px] font-mono text-zinc-500 uppercase">Top Tier Buyout</p>
              <p className="text-lg font-bold text-emerald-400 font-mono">$25,000 USD</p>
            </div>
            <div className="px-4 py-3 rounded-2xl bg-zinc-950/80 border border-zinc-800 text-center">
              <p className="text-[10px] font-mono text-zinc-500 uppercase">Royalty Split</p>
              <p className="text-lg font-bold text-cyan-400 font-mono">100% On-Chain</p>
            </div>
          </div>
        </div>
      </div>

      {/* Overview Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, i) => (
          <Card key={i} className="bg-zinc-900/50 border border-white/5 p-2 shadow-lg backdrop-blur-sm hover:border-zinc-800 transition">
            <CardContent className="p-4">
              <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-bold mb-2">{card.title}</p>
              <p className={`text-4xl font-light tracking-tighter ${card.color || 'text-white'}`}>{card.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* API Latency Monitor Component */}
      <ApiLatencyMonitor />

      {/* Real-time Activity Log Component */}
      <ActivityLog />
    </div>
  );
}

