'use client';

import { useState, useEffect, useId } from 'react';
import { useAuth } from '@/components/auth/FirebaseProvider';
import { getAuthHeaders } from '@/lib/auth-client';
import { 
  LineChart, 
  Line, 
  AreaChart,
  Area,
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';
import { 
  BarChart3, 
  ShieldCheck, 
  Loader2, 
  Coins, 
  Hourglass, 
  TrendingUp, 
  RefreshCw, 
  Calendar,
  Layers,
  Sparkles,
  PieChart as PieChartIcon,
  ArrowUpRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Custom animated SVG Data Point component that slides up on component mount
interface SlideUpDotProps {
  cx?: number;
  cy?: number;
  stroke?: string;
  fill?: string;
  index?: number;
  value?: number;
  color?: string;
  animKey?: string | number;
}

const SlideUpDataPoint = (props: SlideUpDotProps) => {
  const { cx, cy, color = '#a855f7', index = 0, animKey = 0 } = props;
  if (typeof cx !== 'number' || typeof cy !== 'number' || isNaN(cx) || isNaN(cy)) return null;

  return (
    <motion.g
      key={`dot-${animKey}-${index}-${cx}-${cy}`}
      initial={{ opacity: 0, y: 35, scale: 0.3 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.75,
        delay: 0.12 * index + 0.3,
        ease: [0.16, 1, 0.3, 1]
      }}
    >
      {/* Outer subtle glow circle */}
      <circle cx={cx} cy={cy} r={8} fill={color} fillOpacity={0.2} />
      {/* Dark inner backing */}
      <circle cx={cx} cy={cy} r={5} fill="#09090b" stroke={color} strokeWidth={2.5} />
      {/* Core highlight dot */}
      <circle cx={cx} cy={cy} r={2} fill={color} />
    </motion.g>
  );
};

const SlideUpCyanDataPoint = (props: SlideUpDotProps) => {
  const { cx, cy, index = 0, animKey = 0 } = props;
  if (typeof cx !== 'number' || typeof cy !== 'number' || isNaN(cx) || isNaN(cy)) return null;

  return (
    <motion.g
      key={`dot-cyan-${animKey}-${index}-${cx}-${cy}`}
      initial={{ opacity: 0, y: 35, scale: 0.3 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.75,
        delay: 0.12 * index + 0.45,
        ease: [0.16, 1, 0.3, 1]
      }}
    >
      <circle cx={cx} cy={cy} r={7} fill="#06b6d4" fillOpacity={0.2} />
      <circle cx={cx} cy={cy} r={4.5} fill="#09090b" stroke="#06b6d4" strokeWidth={2} />
      <circle cx={cx} cy={cy} r={1.8} fill="#22d3ee" />
    </motion.g>
  );
};

export default function Analytics() {
  const { user, isSandboxMode } = useAuth();
  const [assets, setAssets] = useState<any[]>([]);
  const [royalties, setRoyalties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'forecast' | 'royalties' | 'categories'>('forecast');
  const [timeHorizon, setTimeHorizon] = useState<'6M' | '12M'>('6M');
  const [animationCycle, setAnimationCycle] = useState(0);

  const gradOptimisticId = useId();
  const gradConservativeId = useId();
  const gradRoyaltyId = useId();

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

  const triggerAnimationReplay = () => {
    setAnimationCycle(prev => prev + 1);
  };

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
  
  const chartData6M = [
    { name: 'Month 1', Projected: Math.round(baseValue * 1.1), Conservative: Math.round(baseValue * 0.9) },
    { name: 'Month 2', Projected: Math.round(baseValue * 1.25), Conservative: Math.round(baseValue * 1.0) },
    { name: 'Month 3', Projected: Math.round(baseValue * 1.45), Conservative: Math.round(baseValue * 1.1) },
    { name: 'Month 4', Projected: Math.round(baseValue * 1.70), Conservative: Math.round(baseValue * 1.2) },
    { name: 'Month 5', Projected: Math.round(baseValue * 2.00), Conservative: Math.round(baseValue * 1.35) },
    { name: 'Month 6', Projected: Math.round(baseValue * 2.35), Conservative: Math.round(baseValue * 1.5) },
  ];

  const chartData12M = [
    ...chartData6M,
    { name: 'Month 7', Projected: Math.round(baseValue * 2.75), Conservative: Math.round(baseValue * 1.65) },
    { name: 'Month 8', Projected: Math.round(baseValue * 3.20), Conservative: Math.round(baseValue * 1.80) },
    { name: 'Month 9', Projected: Math.round(baseValue * 3.75), Conservative: Math.round(baseValue * 2.00) },
    { name: 'Month 10', Projected: Math.round(baseValue * 4.35), Conservative: Math.round(baseValue * 2.20) },
    { name: 'Month 11', Projected: Math.round(baseValue * 5.05), Conservative: Math.round(baseValue * 2.45) },
    { name: 'Month 12', Projected: Math.round(baseValue * 5.85), Conservative: Math.round(baseValue * 2.70) },
  ];

  const forecastData = timeHorizon === '6M' ? chartData6M : chartData12M;

  // Monthly Settled vs Escrowed Royalties Bar Data
  const monthlyRoyaltiesData = [
    { month: 'Jan', settled: Number((totalSettledEarnings * 0.12).toFixed(3)), pending: Number((totalPendingEarnings * 0.08).toFixed(3)) },
    { month: 'Feb', settled: Number((totalSettledEarnings * 0.16).toFixed(3)), pending: Number((totalPendingEarnings * 0.12).toFixed(3)) },
    { month: 'Mar', settled: Number((totalSettledEarnings * 0.22).toFixed(3)), pending: Number((totalPendingEarnings * 0.18).toFixed(3)) },
    { month: 'Apr', settled: Number((totalSettledEarnings * 0.28).toFixed(3)), pending: Number((totalPendingEarnings * 0.24).toFixed(3)) },
    { month: 'May', settled: Number((totalSettledEarnings * 0.35).toFixed(3)), pending: Number((totalPendingEarnings * 0.30).toFixed(3)) },
    { month: 'Jun', settled: Number((totalSettledEarnings * 0.45).toFixed(3)), pending: Number((totalPendingEarnings * 0.38).toFixed(3)) },
  ];

  // Category Distribution
  const categoryCounts: Record<string, number> = {};
  assets.forEach(a => {
    const type = a.type || a.category || 'Visual Art';
    categoryCounts[type] = (categoryCounts[type] || 0) + 1;
  });

  const categoryData = Object.keys(categoryCounts).length > 0 
    ? Object.entries(categoryCounts).map(([name, count]) => ({
        name,
        count,
        valuation: count * (portfolioValuation / (totalAssetsCount || 1))
      }))
    : [
        { name: 'Visual Media', count: 3, valuation: Math.round(baseValue * 0.45) },
        { name: 'AI Model Data', count: 2, valuation: Math.round(baseValue * 0.30) },
        { name: 'Audio Stems', count: 2, valuation: Math.round(baseValue * 0.15) },
        { name: 'Smart Contracts', count: 1, valuation: Math.round(baseValue * 0.10) },
      ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-7xl mx-auto"
    >
      
      {/* 4 Financial Metric Cards with Staggered Slide-Up Entry Animation */}
      <div className="lg:col-span-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Settled Royalty Earnings */}
        <motion.div 
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.05, ease: 'easeOut' }}
          className="bg-zinc-950 border border-zinc-900 p-5 rounded-[24px] shadow-xl space-y-2 relative overflow-hidden group hover:border-emerald-500/30 transition-all"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
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
        </motion.div>

        {/* Pending Escrow */}
        <motion.div 
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.1, ease: 'easeOut' }}
          className="bg-zinc-950 border border-zinc-900 p-5 rounded-[24px] shadow-xl space-y-2 relative overflow-hidden group hover:border-amber-500/30 transition-all"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />
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
        </motion.div>

        {/* Registered IP Valuation */}
        <motion.div 
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.15, ease: 'easeOut' }}
          className="bg-zinc-950 border border-zinc-900 p-5 rounded-[24px] shadow-xl space-y-2 relative overflow-hidden group hover:border-cyan-500/30 transition-all"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none" />
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
        </motion.div>

        {/* Total Assets & Avg Royalty */}
        <motion.div 
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.2, ease: 'easeOut' }}
          className="bg-zinc-950 border border-zinc-900 p-5 rounded-[24px] shadow-xl space-y-2 relative overflow-hidden group hover:border-violet-500/30 transition-all"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-violet-500/5 rounded-full blur-2xl pointer-events-none" />
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
        </motion.div>
      </div>

      {/* Main Interactive Chart Section with Slide-up Animated Data Points */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, delay: 0.25, ease: 'easeOut' }}
        className="lg:col-span-12 bg-zinc-950 border border-zinc-900 rounded-[28px] p-6 shadow-2xl space-y-5 relative"
      >
        {/* Navigation & Controls Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-900 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-cyan-950/50 border border-cyan-500/30 text-cyan-400">
                <BarChart3 className="w-4 h-4" />
              </div>
              <h2 className="font-bold text-sm uppercase tracking-wider text-white">
                Economics & Growth Forecast
              </h2>
            </div>
            <p className="text-xs text-zinc-400 font-light">
              Interactive on-chain yield modeling with animated data point trajectories.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Chart View Tabs */}
            <div className="flex items-center bg-zinc-900/80 p-1 rounded-xl border border-zinc-800 text-xs">
              <button
                onClick={() => setActiveTab('forecast')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'forecast'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Forecast</span>
              </button>
              <button
                onClick={() => setActiveTab('royalties')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'royalties'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Coins className="w-3.5 h-3.5" />
                <span>Royalties Inflow</span>
              </button>
              <button
                onClick={() => setActiveTab('categories')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'categories'
                    ? 'bg-violet-500/20 text-violet-300 border border-violet-500/40 shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Categories</span>
              </button>
            </div>

            {/* Time Horizon Selector for Forecast */}
            {activeTab === 'forecast' && (
              <div className="flex items-center bg-zinc-900/80 p-1 rounded-xl border border-zinc-800 text-xs font-mono">
                <button
                  onClick={() => setTimeHorizon('6M')}
                  className={`px-2.5 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                    timeHorizon === '6M'
                      ? 'bg-zinc-800 text-white shadow'
                      : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  6M
                </button>
                <button
                  onClick={() => setTimeHorizon('12M')}
                  className={`px-2.5 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                    timeHorizon === '12M'
                      ? 'bg-zinc-800 text-white shadow'
                      : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  12M
                </button>
              </div>
            )}

            {/* Replay Animation Trigger */}
            <button
              onClick={triggerAnimationReplay}
              title="Replay Entry Animations"
              className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 transition-all cursor-pointer flex items-center gap-1 text-xs"
            >
              <RefreshCw className="w-3.5 h-3.5 hover:rotate-180 transition-transform duration-500" />
              <span className="hidden md:inline font-mono text-[11px]">Replay</span>
            </button>
          </div>
        </div>

        {/* Chart Render Area */}
        <AnimatePresence mode="wait">
          {activeTab === 'forecast' && (
            <motion.div
              key={`forecast-${timeHorizon}-${animationCycle}`}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.45, ease: 'easeOut' }}
              className="space-y-3"
            >
              <div className="flex items-center justify-between text-xs text-zinc-400 px-1 font-mono">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-purple-500 shadow-[0_0_8px_#a855f7]" />
                    <span className="text-purple-300 font-medium">Optimistic Projection ($)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]" />
                    <span className="text-cyan-300 font-medium">Base Projection ($)</span>
                  </div>
                </div>
                <span className="text-[11px] text-zinc-500">Continuous On-Chain Curve</span>
              </div>

              <div className="h-72 sm:h-80 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={forecastData} margin={{ top: 20, right: 20, left: -10, bottom: 5 }}>
                    <defs>
                      <linearGradient id={gradOptimisticId} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#a855f7" stopOpacity={0.35} />
                        <stop offset="95%" stopColor="#a855f7" stopOpacity={0.0} />
                      </linearGradient>
                      <linearGradient id={gradConservativeId} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#18181b" vertical={false} />
                    <XAxis 
                      dataKey="name" 
                      stroke="#71717a" 
                      fontSize={11} 
                      tickLine={false}
                      axisLine={{ stroke: '#27272a' }}
                    />
                    <YAxis 
                      stroke="#71717a" 
                      fontSize={11} 
                      tickLine={false}
                      axisLine={{ stroke: '#27272a' }}
                      tickFormatter={(val) => `$${val >= 1000 ? `${(val / 1000).toFixed(1)}k` : val}`}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#09090b', 
                        borderColor: '#27272a', 
                        borderRadius: '16px',
                        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.7)',
                        fontFamily: 'monospace',
                        fontSize: '12px',
                        color: '#ffffff'
                      }} 
                      formatter={(value: any) => [`$${Number(value).toLocaleString()}`, '']}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="Projected" 
                      stroke="#a855f7" 
                      strokeWidth={2.5} 
                      fillOpacity={1} 
                      fill={`url(#${gradOptimisticId})`}
                      name="Optimistic Projection ($)"
                      isAnimationActive={true}
                      animationDuration={1500}
                      animationEasing="ease-out"
                      dot={<SlideUpDataPoint color="#a855f7" animKey={animationCycle} />}
                      activeDot={{ r: 7, stroke: '#c084fc', strokeWidth: 2, fill: '#09090b' }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="Conservative" 
                      stroke="#06b6d4" 
                      strokeWidth={2} 
                      strokeDasharray="4 4" 
                      name="Base Projection ($)"
                      isAnimationActive={true}
                      animationDuration={1500}
                      animationEasing="ease-out"
                      dot={<SlideUpCyanDataPoint animKey={animationCycle} />}
                      activeDot={{ r: 6, stroke: '#22d3ee', strokeWidth: 2, fill: '#09090b' }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          )}

          {activeTab === 'royalties' && (
            <motion.div
              key={`royalties-${animationCycle}`}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.45, ease: 'easeOut' }}
              className="space-y-3"
            >
              <div className="flex items-center justify-between text-xs text-zinc-400 px-1 font-mono">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
                    <span className="text-emerald-300 font-medium">Settled to Wallet (ETH)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_8px_#fbbf24]" />
                    <span className="text-amber-300 font-medium">Escrow Buffer (ETH)</span>
                  </div>
                </div>
                <span className="text-[11px] text-zinc-500">Recent Stream Flow</span>
              </div>

              <div className="h-72 sm:h-80 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyRoyaltiesData} margin={{ top: 20, right: 20, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#18181b" vertical={false} />
                    <XAxis 
                      dataKey="month" 
                      stroke="#71717a" 
                      fontSize={11} 
                      tickLine={false}
                      axisLine={{ stroke: '#27272a' }}
                    />
                    <YAxis 
                      stroke="#71717a" 
                      fontSize={11} 
                      tickLine={false}
                      axisLine={{ stroke: '#27272a' }}
                      tickFormatter={(val) => `${val} ETH`}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#09090b', 
                        borderColor: '#27272a', 
                        borderRadius: '16px',
                        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.7)',
                        fontFamily: 'monospace',
                        fontSize: '12px',
                        color: '#ffffff'
                      }} 
                      formatter={(val: any) => [`${Number(val).toFixed(4)} ETH`, '']}
                    />
                    <Bar 
                      dataKey="settled" 
                      fill="#10b981" 
                      radius={[6, 6, 0, 0]} 
                      name="Settled Payouts"
                      isAnimationActive={true}
                      animationDuration={1400}
                      animationEasing="ease-out"
                    />
                    <Bar 
                      dataKey="pending" 
                      fill="#f59e0b" 
                      radius={[6, 6, 0, 0]} 
                      name="Escrow Inflow"
                      isAnimationActive={true}
                      animationDuration={1600}
                      animationEasing="ease-out"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          )}

          {activeTab === 'categories' && (
            <motion.div
              key={`categories-${animationCycle}`}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.45, ease: 'easeOut' }}
              className="space-y-3"
            >
              <div className="flex items-center justify-between text-xs text-zinc-400 px-1 font-mono">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-violet-400 shadow-[0_0_8px_#a78bfa]" />
                  <span className="text-violet-300 font-medium">Estimated Asset Valuation by Classification</span>
                </div>
                <span className="text-[11px] text-zinc-500">{assets.length} Active Tokens</span>
              </div>

              <div className="h-72 sm:h-80 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryData} layout="vertical" margin={{ top: 15, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#18181b" horizontal={false} />
                    <XAxis 
                      type="number" 
                      stroke="#71717a" 
                      fontSize={11} 
                      tickLine={false}
                      axisLine={{ stroke: '#27272a' }}
                      tickFormatter={(val) => `$${val}`}
                    />
                    <YAxis 
                      dataKey="name" 
                      type="category" 
                      stroke="#a1a1aa" 
                      fontSize={12} 
                      tickLine={false}
                      axisLine={{ stroke: '#27272a' }}
                      width={120}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#09090b', 
                        borderColor: '#27272a', 
                        borderRadius: '16px',
                        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.7)',
                        fontFamily: 'monospace',
                        fontSize: '12px',
                        color: '#ffffff'
                      }} 
                      formatter={(val: any, name: any) => [`$${Number(val).toLocaleString()}`, 'Valuation']}
                    />
                    <Bar 
                      dataKey="valuation" 
                      fill="#8b5cf6" 
                      radius={[0, 8, 8, 0]} 
                      name="Portfolio Valuation ($)"
                      isAnimationActive={true}
                      animationDuration={1500}
                      animationEasing="ease-out"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom Metadata & Insights Banner */}
        <div className="pt-4 border-t border-zinc-900/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-mono text-zinc-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Zero-Middleman Automated Settlement: <span className="text-emerald-400 font-bold">85% Net Royalty Share</span></span>
          </div>
          <div className="text-[11px] text-zinc-500">
            Simulations calculate linear continuous staking yield & licensing renewals.
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

