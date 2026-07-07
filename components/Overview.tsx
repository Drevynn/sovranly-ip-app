'use client';

import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
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
          <Image 
            src="/sovranly-logo-v2.png" 
            alt="Hero" 
            fill 
            className="object-cover opacity-20" 
            style={{ width: 'auto', height: 'auto' }}
            referrerPolicy="no-referrer"
          />
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

