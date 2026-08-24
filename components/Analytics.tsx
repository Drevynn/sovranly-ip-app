'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth/FirebaseProvider';
import { getAuthHeaders } from '@/lib/auth-client';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { BarChart3, ShieldCheck, Loader2, Coins, Hourglass, TrendingUp, Receipt, ArrowUpRight } from 'lucide-react';

export default function Analytics() {
  const { user, isSandboxMode } = useAuth();
  const [assets, setAssets] = useState<any[]>([]);
  const [royalties, setRoyalties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const fetchAnalyticsData = async () => {
      try {
        const headers = await getAuthHeaders(user, isSandboxMode);
        
        // Fetch Assets & Royalties in parallel
        const [assetsRes, royaltiesRes] = await Promise.all([
          fetch('/api/assets', { headers: { ...headers } }),
          fetch('/api/royalties', { headers: { ...headers } })
        ]);

        if (assetsRes.ok) {
          const assetsData = await assetsRes.json();
          if (active && Array.isArray(assetsData)) setAssets(assetsData);
        }

        if (royaltiesRes.ok) {
          const royaltiesData = await royaltiesRes.json();
          if (active && Array.isArray(royaltiesData)) setRoyalties(royaltiesData);
        }

      } catch (e) {
        console.error('Error loading analytics data:', e);
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchAnalyticsData();
    return () => { active = false; };
  }, [user, isSandboxMode]);

  const totalAssetsCount = assets.length;
  const portfolioValuation = assets.reduce((sum, a) => sum + (a.price || 0), 0);
  
  // Calculate Settled Total & Pending Amounts
  const totalSettledEarnings = royalties
    .filter(r => r.status === 'SETTLED')
    .reduce((sum, r) => sum + (r.netCreatorEarnings || 0), 0);

  const totalPendingEarnings = royalties
    .filter(r => r.status === 'PENDING')
    .reduce((sum, r) => sum + (r.netCreatorEarnings || 0), 0);

  const avgRoyaltyPct = totalAssetsCount > 0 
    ? (assets.reduce((sum, a) => sum + (a.royalty || 0), 0) / totalAssetsCount).toFixed(1)
    : '0';

  // Dynamic projection curve based on real asset portfolio value + royalty stream
  const baseValue = portfolioValuation > 0 ? portfolioValuation : (totalSettledEarnings * 2500 || 500);
  const chartData = [
    { name: 'Month 1', Projected: Math.round(baseValue * 1.1), Conservative: Math.round(baseValue * 0.9) },
    { name: 'Month 2', Projected: Math.round(baseValue * 1.25), Conservative: Math.round(baseValue * 1.0) },
    { name: 'Month 3', Projected: Math.round(baseValue * 1.45), Conservative: Math.round(baseValue * 1.1) },
    { name: 'Month 4', Projected: Math.round(baseValue * 1.70), Conservative: Math.round(baseValue * 1.2) },
    { name: 'Month 5', Projected: Math.round(baseValue * 2.00), Conservative: Math.round(baseValue * 1.35) },
    { name: 'Month 6', Projected: Math.round(baseValue * 2.35), Conservative: Math.round(baseValue * 1.5) },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-7xl mx-auto">
      
      {/* 4 Financial Metric Cards */}
      <div className="lg:col-span-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Settled Royalty Earnings */}
        <div className="bg-zinc-950 border border-zinc-900 p-5 rounded-[24px] shadow-xl space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
            <span className="uppercase font-bold tracking-wider">Total Royalty Earnings</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-950/50 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Coins className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            {loading ? <Loader2 className="w-5 h-5 animate-spin text-emerald-400" /> : null}
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono tracking-tight">
                {totalSettledEarnings.toFixed(4)} ETH
              </p>
              <p className="text-xs text-zinc-500 font-mono mt-0.5">
                ≈ ${(totalSettledEarnings * 2500).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD
              </p>
            </div>
          </div>
        </div>

        {/* Pending Escrow */}
        <div className="bg-zinc-950 border border-zinc-900 p-5 rounded-[24px] shadow-xl space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
            <span className="uppercase font-bold tracking-wider">Pending Escrow</span>
            <div className="w-8 h-8 rounded-xl bg-amber-950/50 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Hourglass className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            {loading ? <Loader2 className="w-5 h-5 animate-spin text-amber-400" /> : null}
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-mono tracking-tight">
                {totalPendingEarnings.toFixed(4)} ETH
              </p>
              <p className="text-xs text-zinc-500 font-mono mt-0.5">
                ≈ ${(totalPendingEarnings * 2500).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD
              </p>
            </div>
          </div>
        </div>

        {/* Registered IP Valuation */}
        <div className="bg-zinc-950 border border-zinc-900 p-5 rounded-[24px] shadow-xl space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
            <span className="uppercase font-bold tracking-wider">Registered IP Valuation</span>
            <div className="w-8 h-8 rounded-xl bg-cyan-950/50 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <BarChart3 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            {loading ? <Loader2 className="w-5 h-5 animate-spin text-cyan-400" /> : null}
            <p className="text-2xl sm:text-3xl font-extrabold text-white font-mono tracking-tight">
              ${portfolioValuation.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
        </div>

        {/* Total Assets & Avg Royalty */}
        <div className="bg-zinc-950 border border-zinc-900 p-5 rounded-[24px] shadow-xl space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
            <span className="uppercase font-bold tracking-wider">Avg Royalty Rate</span>
            <div className="w-8 h-8 rounded-xl bg-violet-950/50 border border-violet-500/30 flex items-center justify-center text-violet-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            {loading ? <Loader2 className="w-5 h-5 animate-spin text-violet-400" /> : null}
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold text-violet-400 font-mono tracking-tight">{avgRoyaltyPct}%</p>
              <p className="text-xs text-zinc-500 font-mono mt-0.5">Across {totalAssetsCount} IP Assets</p>
            </div>
          </div>
        </div>
      </div>

      {/* Projection Chart Section */}
      <div className="lg:col-span-12 bg-zinc-950 border border-zinc-900 rounded-[28px] p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-900 pb-4">
          <h2 className="font-bold text-sm uppercase tracking-wider text-zinc-300 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-cyan-400" />
            Revenue & Royalty Growth Forecast
          </h2>
          <span className="text-[10px] text-zinc-500 font-mono">6-Month On-Chain Simulation</span>
        </div>

        {totalAssetsCount === 0 && !loading ? (
          <div className="p-12 text-center border border-dashed border-zinc-800 rounded-2xl bg-zinc-900/30 space-y-2">
            <ShieldCheck className="w-8 h-8 text-cyan-400/60 mx-auto" />
            <p className="text-sm font-medium text-zinc-300">No registered IP assets found for revenue forecasting</p>
            <p className="text-xs text-zinc-500 max-w-md mx-auto">
              Register your actual creative assets in the IP Asset Manager to compute real revenue projections and royalty distribution analytics.
            </p>
          </div>
        ) : (
          <div className="h-64 pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#18181b" />
                <XAxis dataKey="name" stroke="#71717a" fontSize={11} />
                <YAxis stroke="#71717a" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', borderRadius: '12px' }} />
                <Line type="monotone" dataKey="Projected" stroke="#a855f7" strokeWidth={2} name="Optimistic Projection ($)" />
                <Line type="monotone" dataKey="Conservative" stroke="#67e8f9" strokeWidth={2} strokeDasharray="5 5" name="Base Projection ($)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}
