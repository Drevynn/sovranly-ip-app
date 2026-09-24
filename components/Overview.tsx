'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import ActivityLog from '@/components/ActivityLog';
import ApiLatencyMonitor from '@/components/ApiLatencyMonitor';
import VoiceCommandCenter from '@/components/VoiceCommandCenter';
import { useAuth } from '@/components/auth/FirebaseProvider';
import { getAuthHeaders } from '@/lib/auth-client';
import { 
  PlusCircle, 
  ShieldCheck, 
  Loader2, 
  FileText, 
  Scale, 
  Sliders, 
  Brain, 
  Database, 
  Mail, 
  Users, 
  Presentation, 
  Rocket, 
  ArrowRight,
  Sparkles,
  Lock,
  Coins,
  Hourglass,
  Zap
} from 'lucide-react';

export type Asset = { 
  id: string; 
  title: string; 
  type: string; 
  royalty: number; 
  price?: number | null;
  isMinted?: boolean;
  isForSale?: boolean;
};

export default function Overview({ onNavigate }: { onNavigate?: (pageId: number) => void }) {
  const { user, isSandboxMode } = useAuth();
  const [assets, setAssets] = useState<Asset[]>([]);
  const [royalties, setRoyalties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchOverviewData = async () => {
      try {
        const headers = await getAuthHeaders(user, isSandboxMode);
        const [assetsRes, royaltiesRes] = await Promise.all([
          fetch('/api/assets', { headers: { ...headers } }),
          fetch('/api/royalties', { headers: { ...headers } })
        ]);

        if (assetsRes.ok) {
          const data = await assetsRes.json();
          if (isMounted) setAssets(Array.isArray(data) ? data : []);
        }

        if (royaltiesRes.ok) {
          const rData = await royaltiesRes.json();
          if (isMounted) setRoyalties(Array.isArray(rData) ? rData : []);
        }

      } catch (err) {
        console.error('Error fetching overview metrics:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchOverviewData();
    return () => {
      isMounted = false;
    };
  }, [user, isSandboxMode]);

  // Compute actual metrics from user's registered IP assets & royalty records
  const totalAssetsCount = assets.length;
  const activeLicensesCount = assets.filter(a => a.isMinted || a.isForSale).length;

  const totalSettledEarningsETH = royalties
    .filter(r => r.status === 'SETTLED')
    .reduce((sum, r) => sum + (r.netCreatorEarnings || 0), 0);

  const totalPendingEarningsETH = royalties
    .filter(r => r.status === 'PENDING')
    .reduce((sum, r) => sum + (r.netCreatorEarnings || 0), 0);

  const totalSettledUSD = totalSettledEarningsETH * 2500;
  const totalPendingUSD = totalPendingEarningsETH * 2500;

  const cards = [
    { 
      title: 'My IP Assets', 
      value: loading ? '...' : String(totalAssetsCount),
      subtext: 'Stamped & notarized'
    },
    { 
      title: 'Total Earnings', 
      value: loading ? '...' : totalSettledEarningsETH > 0 ? `${totalSettledEarningsETH.toFixed(3)} ETH` : '$0.00', 
      color: 'text-emerald-400',
      subtext: totalSettledEarningsETH > 0 ? `≈ $${totalSettledUSD.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD` : 'Settled to creator'
    },
    { 
      title: 'Active Licenses', 
      value: loading ? '...' : String(activeLicensesCount), 
      color: 'text-cyan-400',
      subtext: 'Commercial compacts'
    },
    { 
      title: 'Pending Royalties', 
      value: loading ? '...' : totalPendingEarningsETH > 0 ? `${totalPendingEarningsETH.toFixed(3)} ETH` : '$0.00',
      color: 'text-amber-400',
      subtext: totalPendingEarningsETH > 0 ? `≈ $${totalPendingUSD.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD buffer` : 'In contract buffer'
    },
  ];

  const quickTools = [
    { id: 14, title: 'Permissions Hub', desc: '1-click video & social media sync rights clearance', icon: Zap, color: 'text-amber-400', border: 'hover:border-amber-500/40' },
    { id: 11, title: 'AI Training Vault', desc: 'Crawler opt-out & AI licensing tags', icon: Brain, color: 'text-violet-400', border: 'hover:border-violet-500/40' },
    { id: 12, title: 'Sovereign Tokenizer', desc: 'Tokenize digital media & datasets', icon: Database, color: 'text-cyan-400', border: 'hover:border-cyan-500/40' },
    { id: 6, title: 'Creator Inbox', desc: 'Notarization alerts & client messages', icon: Mail, color: 'text-purple-400', border: 'hover:border-purple-500/40' },
    { id: 13, title: 'Creator Network', desc: 'Find co-creators & verified partners', icon: Users, color: 'text-indigo-400', border: 'hover:border-indigo-500/40' },
    { id: 7, title: 'Google Slides Gateway', desc: 'Auto-export pitch decks to Google Drive', icon: Presentation, color: 'text-orange-400', border: 'hover:border-orange-500/40' },
    { id: 8, title: 'Launch Planner', desc: 'Milestone tracking & release roadmap', icon: Rocket, color: 'text-rose-400', border: 'hover:border-rose-500/40' },
  ];

  return (
    <div className="space-y-10 sm:space-y-12 font-sans max-w-7xl mx-auto">
      {/* Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden border border-zinc-800 bg-zinc-900/90 shadow-2xl transition-all">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293720_1px,transparent_1px),linear-gradient(to_bottom,#1f293720_1px,transparent_1px)] bg-[size:24px_24px]" />
          <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/10 via-transparent to-violet-500/10" />
          <div className="absolute -top-1/2 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[90px]" />
        </div>
        <div className="relative z-10 p-8 sm:p-12 md:p-14 flex flex-col items-center justify-center text-center space-y-4 sm:space-y-5">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 text-xs font-mono uppercase tracking-wider shadow-sm">
            <ShieldCheck className="w-4 h-4" />
            <span>Zero Trust Sovereign Creator Authority</span>
          </div>
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white">
            Creator Command Center
          </h1>
          <p className="text-zinc-400 max-w-2xl text-xs sm:text-sm md:text-base font-normal leading-relaxed">
            Timestamp your creative works, configure smart commercial licensing with anti-AI scraping tags, and receive instant 85% creator royalty payouts with zero middlemen.
          </p>
        </div>
      </div>

      {/* Voice Command Console */}
      <VoiceCommandCenter onNavigate={onNavigate} />

      {/* The 3-Step Creator Flow */}
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
            <h2 className="text-sm sm:text-base font-bold text-white uppercase tracking-wider font-mono">The 3-Step Creation Journey</h2>
          </div>
          <span className="text-xs text-zinc-500 font-mono hidden sm:inline-block">From Idea to On-Chain Monetization</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {/* Step 1 */}
          <div 
            onClick={() => onNavigate && onNavigate(2)}
            className="group relative bg-zinc-900/40 hover:bg-zinc-900/80 border border-zinc-800 hover:border-cyan-500/50 rounded-2xl p-6 sm:p-7 transition-all cursor-pointer space-y-5 flex flex-col justify-between shadow-sm"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-950/50 px-2.5 py-1 rounded-md border border-cyan-500/30">
                  STEP 01
                </span>
                <PlusCircle className="w-5 h-5 text-zinc-500 group-hover:text-cyan-400 transition-colors" />
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                1. Asset Management & Folders
              </h3>
              <p className="text-xs sm:text-sm text-zinc-400 font-normal leading-relaxed">
                Upload files, assign rich metadata &amp; tags, and organize your sovereign portfolio into custom folders.
              </p>
            </div>
            <div className="pt-4 border-t border-zinc-800/80 flex items-center justify-between text-xs font-mono text-cyan-400 font-semibold">
              <span>Launch Asset Manager</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
            </div>
          </div>

          {/* Step 2 */}
          <div 
            onClick={() => onNavigate && onNavigate(4)}
            className="group relative bg-zinc-900/40 hover:bg-zinc-900/80 border border-zinc-800 hover:border-emerald-500/50 rounded-2xl p-6 sm:p-7 transition-all cursor-pointer space-y-5 flex flex-col justify-between shadow-sm"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/50 px-2.5 py-1 rounded-md border border-emerald-500/30">
                  STEP 02
                </span>
                <Scale className="w-5 h-5 text-zinc-500 group-hover:text-emerald-400 transition-colors" />
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-emerald-300 transition-colors">
                2. Define License & Royalties
              </h3>
              <p className="text-xs sm:text-sm text-zinc-400 font-normal leading-relaxed">
                Set duration, permitted usage rights, royalty splits, and associate terms with your registered IP works.
              </p>
            </div>
            <div className="pt-4 border-t border-zinc-800/80 flex items-center justify-between text-xs font-mono text-emerald-400 font-semibold">
              <span>Open Licensing Hub</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
            </div>
          </div>

          {/* Step 3 */}
          <div 
            onClick={() => onNavigate && onNavigate(5)}
            className="group relative bg-zinc-900/40 hover:bg-zinc-900/80 border border-zinc-800 hover:border-violet-500/50 rounded-2xl p-6 sm:p-7 transition-all cursor-pointer space-y-5 flex flex-col justify-between shadow-sm"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-violet-400 bg-violet-950/50 px-2.5 py-1 rounded-md border border-violet-500/30">
                  STEP 03
                </span>
                <Sliders className="w-5 h-5 text-zinc-500 group-hover:text-violet-400 transition-colors" />
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-violet-300 transition-colors">
                3. Sandbox & Simulate Payouts
              </h3>
              <p className="text-xs sm:text-sm text-zinc-400 font-normal leading-relaxed">
                Simulate streaming payouts, AI scraping licensing revenue, and test on-chain automated payouts.
              </p>
            </div>
            <div className="pt-4 border-t border-zinc-800/80 flex items-center justify-between text-xs font-mono text-violet-400 font-semibold">
              <span>Launch Simulator</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
            </div>
          </div>
        </div>
      </div>

      {/* Top 4 Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
        {cards.map((card, i) => (
          <Card key={i} className="bg-zinc-900/40 border-zinc-800 text-white rounded-2xl overflow-hidden hover:border-zinc-700 transition-all shadow-sm">
            <CardContent className="p-6 sm:p-7 flex flex-col justify-between h-full space-y-3">
              <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider font-semibold">{card.title}</span>
              <div className="space-y-1">
                <div className={`text-2xl sm:text-3xl font-extrabold tracking-tight font-mono ${card.color || 'text-white'}`}>
                  {card.value}
                </div>
                <p className="text-xs text-zinc-500 font-normal">{card.subtext}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Tools Grid */}
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-xs sm:text-sm font-mono uppercase tracking-widest text-zinc-400 font-bold">
            Creator Utility Matrix
          </h2>
          <span className="text-xs text-zinc-500 font-mono">Instant Access</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
          {quickTools.map((tool) => {
            const Icon = tool.icon;
            return (
              <div
                key={tool.id}
                onClick={() => onNavigate && onNavigate(tool.id)}
                className={`bg-zinc-900/30 hover:bg-zinc-900/70 border border-zinc-850 ${tool.border} p-5 sm:p-6 rounded-2xl transition-all cursor-pointer group flex items-start gap-4 sm:gap-5 shadow-sm`}
              >
                <div className={`p-3 rounded-xl bg-zinc-900 border border-zinc-800 ${tool.color} shrink-0 group-hover:scale-105 transition-transform`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="space-y-1.5 min-w-0">
                  <h4 className="text-sm font-bold text-zinc-200 group-hover:text-white transition-colors truncate">
                    {tool.title}
                  </h4>
                  <p className="text-xs text-zinc-400 font-normal leading-relaxed line-clamp-2">
                    {tool.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Live System Log & API Latency */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 pt-4">
        <div className="lg:col-span-2">
          <ActivityLog />
        </div>
        <div>
          <ApiLatencyMonitor />
        </div>
      </div>
    </div>
  );
}
