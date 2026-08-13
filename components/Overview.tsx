'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import ActivityLog from '@/components/ActivityLog';
import ApiLatencyMonitor from '@/components/ApiLatencyMonitor';
import { useAuth } from '@/components/auth/FirebaseProvider';
import { getAuthHeaders } from '@/lib/auth-client';
import { PlusCircle, ShieldCheck, Loader2 } from 'lucide-react';
import Link from 'next/link';

export type Asset = { 
  id: string; 
  title: string; 
  type: string; 
  royalty: number; 
  price?: number | null;
  isMinted?: boolean;
  isForSale?: boolean;
};

export default function Overview() {
  const { user, isSandboxMode } = useAuth();
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchUserAssets = async () => {
      try {
        const headers = await getAuthHeaders(user, isSandboxMode);
        const res = await fetch('/api/assets', {
          headers: {
            ...headers
          }
        });
        if (res.ok) {
          const data = await res.json();
          if (isMounted) {
            setAssets(Array.isArray(data) ? data : []);
          }
        }
      } catch (err) {
        console.error('Error fetching user assets for overview:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchUserAssets();
    return () => {
      isMounted = false;
    };
  }, [user, isSandboxMode]);

  // Compute actual metrics from user's registered IP assets
  const totalAssetsCount = assets.length;
  const activeLicensesCount = assets.filter(a => a.isMinted || a.isForSale).length;
  const totalEarningsVal = assets.reduce((acc, curr) => acc + (curr.price || 0), 0);
  const pendingRoyaltiesVal = assets.reduce((acc, curr) => acc + ((curr.price || 0) * (curr.royalty || 0) / 100), 0);

  const cards = [
    { 
      title: 'My IP Assets', 
      value: loading ? '...' : String(totalAssetsCount) 
    },
    { 
      title: 'Total Earnings', 
      value: loading ? '...' : `$${totalEarningsVal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 
      color: 'text-emerald-400' 
    },
    { 
      title: 'Active Licenses', 
      value: loading ? '...' : String(activeLicensesCount), 
      color: 'text-cyan-400' 
    },
    { 
      title: 'Pending Royalties', 
      value: loading ? '...' : `$${pendingRoyaltiesVal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` 
    },
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
        <div className="relative z-10 p-8 sm:p-12 flex flex-col items-center justify-center text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-950/40 border border-cyan-500/30 text-cyan-400 text-xs font-mono uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Artist Command Center</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tighter text-white uppercase">Welcome to Sovranly IP</h2>
          <p className="text-zinc-400 max-w-lg text-sm sm:text-base">
            Zero Trust Sovereign IP Management System. Secure, track, and license your actual creative works with blockchain transparency.
          </p>
        </div>
      </div>

      {/* Overview Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, i) => (
          <Card key={i} className="bg-zinc-900/50 border border-white/5 p-2 shadow-lg backdrop-blur-sm hover:border-zinc-800 transition">
            <CardContent className="p-4">
              <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-bold mb-2">{card.title}</p>
              <div className="flex items-center gap-2">
                {loading && <Loader2 className="w-5 h-5 animate-spin text-cyan-400" />}
                <p className={`text-4xl font-light tracking-tighter ${card.color || 'text-white'}`}>{card.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Zero Sample Data Banner when user has 0 assets */}
      {!loading && assets.length === 0 && (
        <div className="p-6 rounded-2xl bg-gradient-to-r from-zinc-900 via-zinc-900/90 to-cyan-950/30 border border-cyan-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-base font-bold text-white flex items-center justify-center sm:justify-start gap-2">
              <ShieldCheck className="w-5 h-5 text-cyan-400" />
              Your Sovereign Registry is Clean & Ready
            </h3>
            <p className="text-xs text-zinc-400 max-w-xl">
              No sample data is populated in registered artist accounts. Upload and register your actual audio, artwork, manuscripts, or software to mint on-chain proof of ownership.
            </p>
          </div>
          <Link
            href="/dashboard"
            className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs uppercase tracking-wider transition flex items-center gap-2 shrink-0 shadow-lg shadow-cyan-500/20"
          >
            <PlusCircle className="w-4 h-4" />
            Register Your IP
          </Link>
        </div>
      )}

      {/* API Latency Monitor Component */}
      <ApiLatencyMonitor />

      {/* Real-time Activity Log Component */}
      <ActivityLog />
    </div>
  );
}


