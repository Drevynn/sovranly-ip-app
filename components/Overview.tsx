'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import ActivityLog from '@/components/ActivityLog';
import ApiLatencyMonitor from '@/components/ApiLatencyMonitor';
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
  Coins
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
      value: loading ? '...' : String(totalAssetsCount),
      subtext: 'Stamped & notarized'
    },
    { 
      title: 'Total Earnings', 
      value: loading ? '...' : `$${totalEarningsVal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 
      color: 'text-emerald-400',
      subtext: '85% direct creator share'
    },
    { 
      title: 'Active Licenses', 
      value: loading ? '...' : String(activeLicensesCount), 
      color: 'text-cyan-400',
      subtext: 'Commercial compacts'
    },
    { 
      title: 'Pending Royalties', 
      value: loading ? '...' : `$${pendingRoyaltiesVal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      subtext: 'In contract buffer'
    },
  ];

  const quickTools = [
    { id: 11, title: 'AI Training Vault', desc: 'Crawler opt-out & AI licensing tags', icon: Brain, color: 'text-violet-400', border: 'hover:border-violet-500/40' },
    { id: 12, title: 'Sovereign Tokenizer', desc: 'Tokenize digital media & datasets', icon: Database, color: 'text-cyan-400', border: 'hover:border-cyan-500/40' },
    { id: 6, title: 'Creator Inbox', desc: 'Notarization alerts & client messages', icon: Mail, color: 'text-purple-400', border: 'hover:border-purple-500/40' },
    { id: 13, title: 'Creator Network', desc: 'Find co-creators & verified partners', icon: Users, color: 'text-indigo-400', border: 'hover:border-indigo-500/40' },
    { id: 7, title: 'Google Slides Gateway', desc: 'Auto-export pitch decks to Google Drive', icon: Presentation, color: 'text-orange-400', border: 'hover:border-orange-500/40' },
    { id: 8, title: 'Launch Planner', desc: 'Milestone tracking & release roadmap', icon: Rocket, color: 'text-rose-400', border: 'hover:border-rose-500/40' },
  ];

  return (
    <div className="space-y-8 font-sans max-w-7xl mx-auto">
      {/* Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden border border-zinc-800 bg-zinc-900/90 shadow-2xl">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293720_1px,transparent_1px),linear-gradient(to_bottom,#1f293720_1px,transparent_1px)] bg-[size:24px_24px]" />
          <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/10 via-transparent to-violet-500/10" />
          <div className="absolute -top-1/2 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[90px]" />
        </div>
        <div className="relative z-10 p-6 sm:p-10 flex flex-col items-center justify-center text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 text-xs font-mono uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Zero Trust Sovereign Creator Authority</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
            Creator Command Center
          </h1>
          <p className="text-zinc-400 max-w-2xl text-xs sm:text-sm font-light">
            Timestamp your creative works, configure smart commercial licensing with anti-AI scraping tags, and receive instant 85% creator royalty payouts with zero middlemen.
          </p>
        </div>
      </div>

      {/* The 3-Step Creator Flow (Crystal-clear & Uncrowded) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">The 3-Step Creation Journey</h2>
          </div>
          <span className="text-[11px] font-mono text-zinc-500">Everything in 3 simple steps</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Step 1 */}
          <div className="p-5 rounded-2xl bg-zinc-900/60 border border-emerald-500/20 hover:border-emerald-500/50 transition-all group flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-md bg-emerald-950/80 text-emerald-400 border border-emerald-800/50 text-[10px] font-mono font-bold">
                  STEP 01
                </span>
                <Lock className="w-4 h-4 text-emerald-400" />
              </div>
              <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors">
                1. Upload &amp; Timestamp
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Upload your video, beat, artwork, screenplay, or code to mint a permanent SHA-256 blockchain certificate establishing proof of creation.
              </p>
            </div>
            <button
              onClick={() => onNavigate?.(2)}
              className="w-full py-2.5 px-4 rounded-xl bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-black font-bold text-xs flex items-center justify-center gap-2 border border-emerald-500/30 transition-all cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              Timestamp Work <ArrowRight className="w-3 h-3 ml-auto" />
            </button>
          </div>

          {/* Step 2 */}
          <div className="p-5 rounded-2xl bg-zinc-900/60 border border-cyan-500/20 hover:border-cyan-500/50 transition-all group flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-md bg-cyan-950/80 text-cyan-400 border border-cyan-800/50 text-[10px] font-mono font-bold">
                  STEP 02
                </span>
                <Scale className="w-4 h-4 text-cyan-400" />
              </div>
              <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                2. Licensing &amp; AI Shield
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Set commercial pricing, define remix permissions, and attach an anti-scraping tag to prevent AI crawlers from scraping your work.
              </p>
            </div>
            <button
              onClick={() => onNavigate?.(4)}
              className="w-full py-2.5 px-4 rounded-xl bg-cyan-500/10 hover:bg-cyan-500 text-cyan-400 hover:text-black font-bold text-xs flex items-center justify-center gap-2 border border-cyan-500/30 transition-all cursor-pointer"
            >
              <Scale className="w-3.5 h-3.5" />
              Configure Compact <ArrowRight className="w-3 h-3 ml-auto" />
            </button>
          </div>

          {/* Step 3 */}
          <div className="p-5 rounded-2xl bg-zinc-900/60 border border-teal-500/20 hover:border-teal-500/50 transition-all group flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-md bg-teal-950/80 text-teal-400 border border-teal-800/50 text-[10px] font-mono font-bold">
                  STEP 03
                </span>
                <Coins className="w-4 h-4 text-teal-400" />
              </div>
              <h3 className="text-base font-bold text-white group-hover:text-teal-300 transition-colors">
                3. Royalties &amp; Splits
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Enjoy instant 85% creator payouts directly to your wallet/account. Automatically split earnings with collaborators and producers.
              </p>
            </div>
            <button
              onClick={() => onNavigate?.(5)}
              className="w-full py-2.5 px-4 rounded-xl bg-teal-500/10 hover:bg-teal-500 text-teal-400 hover:text-black font-bold text-xs flex items-center justify-center gap-2 border border-teal-500/30 transition-all cursor-pointer"
            >
              <Sliders className="w-3.5 h-3.5" />
              Split Sheets &amp; Math <ArrowRight className="w-3 h-3 ml-auto" />
            </button>
          </div>
        </div>
      </div>

      {/* Real-time Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card, i) => (
          <Card key={i} className="bg-zinc-900/50 border border-zinc-800/80 p-1 shadow-lg backdrop-blur-sm hover:border-zinc-700 transition">
            <CardContent className="p-4 space-y-1">
              <p className="text-[10px] uppercase tracking-[0.15em] text-zinc-500 font-mono font-bold">{card.title}</p>
              <div className="flex items-center gap-2">
                {loading && <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />}
                <p className={`text-3xl font-light tracking-tight ${card.color || 'text-white'}`}>{card.value}</p>
              </div>
              <p className="text-[10px] text-zinc-500 font-mono">{card.subtext}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Access Tools Directory (All features preserved, cleanly organized) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-violet-400" />
            <h2 className="text-xs font-bold text-white uppercase tracking-wider font-mono">Creator Tool Suite</h2>
          </div>
          <span className="text-[11px] font-mono text-zinc-500">6 Additional Modules</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {quickTools.map((tool) => {
            const Icon = tool.icon;
            return (
              <button
                key={tool.id}
                onClick={() => onNavigate?.(tool.id)}
                className={`p-4 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 ${tool.border} transition-all text-left flex items-start gap-3.5 group cursor-pointer`}
              >
                <div className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 shrink-0 group-hover:scale-105 transition-transform">
                  <Icon className={`w-4 h-4 ${tool.color}`} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">
                      {tool.title}
                    </span>
                    <ArrowRight className="w-3 h-3 text-zinc-600 group-hover:text-white transition-colors" />
                  </div>
                  <p className="text-[11px] text-zinc-500 truncate mt-0.5">
                    {tool.desc}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* System Latency & Activity Logs */}
      <div className="space-y-6 pt-2">
        <ApiLatencyMonitor />
        <ActivityLog />
      </div>
    </div>
  );
}


