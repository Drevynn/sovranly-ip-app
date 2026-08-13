'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth/FirebaseProvider';
import { getAuthHeaders } from '@/lib/auth-client';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { BarChart3, ShieldCheck, Loader2 } from 'lucide-react';

export default function Analytics() {
  const { user, isSandboxMode } = useAuth();
  const [assets, setAssets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const fetchAnalyticsAssets = async () => {
      try {
        const headers = await getAuthHeaders(user, isSandboxMode);
        const res = await fetch('/api/assets', {
          headers: { ...headers }
        });
        if (res.ok) {
          const data = await res.json();
          if (active && Array.isArray(data)) {
            setAssets(data);
          }
        }
      } catch (e) {
        console.error('Error loading analytics assets:', e);
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchAnalyticsAssets();
    return () => { active = false; };
  }, [user, isSandboxMode]);

  const totalAssetsCount = assets.length;
  const portfolioValuation = assets.reduce((sum, a) => sum + (a.price || 0), 0);
  const avgRoyaltyPct = totalAssetsCount > 0 
    ? (assets.reduce((sum, a) => sum + (a.royalty || 0), 0) / totalAssetsCount).toFixed(1)
    : '0';

  // Dynamic projection curve based on real asset portfolio value
  const baseValue = portfolioValuation > 0 ? portfolioValuation : 0;
  const chartData = [
    { name: 'Month 1', Projected: Math.round(baseValue * 1.1), Conservative: Math.round(baseValue * 0.9) },
    { name: 'Month 2', Projected: Math.round(baseValue * 1.25), Conservative: Math.round(baseValue * 1.0) },
    { name: 'Month 3', Projected: Math.round(baseValue * 1.45), Conservative: Math.round(baseValue * 1.1) },
    { name: 'Month 4', Projected: Math.round(baseValue * 1.70), Conservative: Math.round(baseValue * 1.2) },
    { name: 'Month 5', Projected: Math.round(baseValue * 2.00), Conservative: Math.round(baseValue * 1.35) },
    { name: 'Month 6', Projected: Math.round(baseValue * 2.35), Conservative: Math.round(baseValue * 1.5) },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-zinc-900/50 border border-white/5 p-5 rounded-2xl">
          <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-bold mb-2">Registered IP Valuation</p>
          <div className="flex items-center gap-2">
            {loading ? <Loader2 className="w-5 h-5 animate-spin text-cyan-400" /> : null}
            <p className="text-3xl font-light tracking-tighter text-white">
              ${portfolioValuation.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
        </div>

        <div className="bg-zinc-900/50 border border-white/5 p-5 rounded-2xl">
          <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-bold mb-2">Avg On-Chain Royalty Rate</p>
          <div className="flex items-center gap-2">
            {loading ? <Loader2 className="w-5 h-5 animate-spin text-cyan-400" /> : null}
            <p className="text-3xl font-light tracking-tighter text-cyan-400">{avgRoyaltyPct}%</p>
          </div>
        </div>

        <div className="bg-zinc-900/50 border border-white/5 p-5 rounded-2xl">
          <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-bold mb-2">Portfolio IP Assets</p>
          <div className="flex items-center gap-2">
            {loading ? <Loader2 className="w-5 h-5 animate-spin text-cyan-400" /> : null}
            <p className="text-3xl font-light tracking-tighter text-violet-400">{totalAssetsCount}</p>
          </div>
        </div>
      </div>

      <div className="lg:col-span-12 bg-zinc-900/50 border border-white/5 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-semibold text-sm uppercase tracking-wider text-zinc-300 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-cyan-400" />
            Revenue & Royalty Growth Forecast
          </h2>
          <span className="text-[10px] text-zinc-500 font-mono">6-Month On-Chain Simulation</span>
        </div>

        {totalAssetsCount === 0 && !loading ? (
          <div className="p-12 text-center border border-dashed border-zinc-800 rounded-xl bg-zinc-950/40 space-y-2">
            <ShieldCheck className="w-8 h-8 text-cyan-400/60 mx-auto" />
            <p className="text-sm font-medium text-zinc-300">No registered IP assets found for revenue forecasting</p>
            <p className="text-xs text-zinc-500 max-w-md mx-auto">
              Register your actual creative assets in the Registry or Asset Manager to compute real revenue projections and royalty distribution analytics.
            </p>
          </div>
        ) : (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
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

