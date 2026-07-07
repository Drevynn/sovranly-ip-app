'use client';

import { Card, CardContent } from '@/components/ui/card';
import ActivityLog from '@/components/ActivityLog';
import ApiLatencyMonitor from '@/components/ApiLatencyMonitor';

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

