'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building2, 
  TrendingUp, 
  Users, 
  ShieldCheck, 
  Coins, 
  Briefcase, 
  ArrowUpRight, 
  Globe2, 
  Cpu, 
  FileCheck, 
  Lock, 
  Mail, 
  Send, 
  Layers, 
  CheckCircle2, 
  DollarSign, 
  Calculator, 
  ChevronRight,
  ShieldAlert,
  Download,
  Music,
  BookOpen,
  Code2,
  Activity,
  Flame
} from 'lucide-react';
import Image from 'next/image';

interface TeamMember {
  name: string;
  role: string;
  bio: string;
  signature: string;
}

const TEAM_MEMBERS: TeamMember[] = [
  {
    name: 'Eleanor Vance',
    role: 'Chief Executive Officer / Founder',
    bio: 'Former IP Law practice partner and blockchain venture architect. 12+ years optimizing cross-border digital licensing protocols.',
    signature: '0xe1ca...44bd'
  },
  {
    name: 'Dr. Aaron Chen',
    role: 'Chief Technology Officer',
    bio: 'PhD in Cryptography. Specialist in zero-knowledge identity protocols and high-throughput on-chain ledger virtualization.',
    signature: '0xac92...11ff'
  },
  {
    name: 'Sarah Moreau',
    role: 'Chief Product Officer',
    bio: 'Product builder from top-tier Creator Platforms. Dedicated to delivering high-fidelity interfaces without structural complexity.',
    signature: '0x94fd...a023'
  }
];

interface PlatformMetric {
  label: string;
  value: string;
  change: string;
  icon: React.ReactNode;
}

export default function AboutUs() {
  const [activePulseTab, setActivePulseTab] = useState<'musician' | 'writer' | 'developer'>('developer');
  // Investor Form States
  const [investorName, setInvestorName] = useState('');
  const [investorEmail, setInvestorEmail] = useState('');
  const [firmName, setFirmName] = useState('');
  const [investmentTier, setInvestmentTier] = useState('$50k - $250k');
  const [isAccredited, setIsAccredited] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isFormLoading, setIsFormLoading] = useState(false);

  // Investment Projection Interactive Model States
  const [targetCreators, setTargetCreators] = useState(15000);
  const [avgAssetVal, setAvgAssetVal] = useState(2500);
  const [platformFeePercent, setPlatformFeePercent] = useState(1.5);

  // Computed Projections
  const projectedGMV = targetCreators * avgAssetVal;
  const projectedPlatformRevenue = (projectedGMV * (platformFeePercent / 100));

  // Handle investor inquiry submit
  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!investorName || !investorEmail) return;

    setIsFormLoading(true);
    setTimeout(() => {
      setFormSubmitted(true);
      setIsFormLoading(false);
    }, 1200);
  };

  const metrics: PlatformMetric[] = [
    {
      label: 'On-Chain IP Assets Locked',
      value: '3,842',
      change: '+24% this Mo.',
      icon: <Layers className="w-5 h-5 text-emerald-400" />
    },
    {
      label: 'Sovereign Transaction GMV',
      value: '$14.8M',
      change: '+18.3% MoM',
      icon: <DollarSign className="w-5 h-5 text-cyan-400" />
    },
    {
      label: 'Active Verified Creators',
      value: '12,403',
      change: '98.4% uptime link',
      icon: <Users className="w-5 h-5 text-violet-400" />
    },
    {
      label: 'Zero Trust Safety Audit Score',
      value: '100%',
      change: 'Zero leaks detected',
      icon: <ShieldCheck className="w-5 h-5 text-teal-400" />
    }
  ];

  return (
    <div className="space-y-12 max-w-6xl mx-auto pb-16 font-sans text-left">
      
      {/* 1. Visionary Hero Header */}
      <div className="border-b border-zinc-900 pb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-cyan-500/5 via-transparent to-transparent pointer-events-none" />
        
        <div className="max-w-3xl space-y-4">
          <span className="text-[10px] uppercase font-mono tracking-widest text-cyan-400 font-black flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5" /> Corporate Vision & Investor Portal
          </span>
          <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight uppercase leading-none">
            Sovereign Intellectual Property Governance
          </h1>
          <p className="text-sm text-zinc-400 leading-relaxed max-w-2xl">
            <strong>Sovranly IP</strong> builds highly-secure, Zero Trust Architecture designed to automate digital asset registration, compliance workflows, and on-chain royalty settlements. We empower creators to manage their IP without middlemen while offering institutional investors a highly yield-generative infrastructure platform.
          </p>
        </div>
      </div>

      {/* 2. Key Traction Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, idx) => (
          <div key={idx} className="bg-zinc-950 border border-zinc-900 p-6 rounded-3xl flex flex-col justify-between space-y-4 relative overflow-hidden shadow-xl">
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-zinc-900 to-transparent" />
            <div className="flex justify-between items-start">
              <span className="text-xs font-mono text-zinc-500 uppercase">{metric.label}</span>
              <div className="bg-zinc-900/50 p-2.5 rounded-2xl border border-zinc-850">
                {metric.icon}
              </div>
            </div>
            <div>
              <span className="text-2xl font-black font-mono text-white block">{metric.value}</span>
              <span className="text-[10px] font-mono text-emerald-400 font-bold mt-1 block">{metric.change}</span>
            </div>
          </div>
        ))}
      </div>

      {/* 3. Core Architectural Vision / Three Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#09090b] border border-zinc-900 p-6 rounded-3xl space-y-4 shadow-md">
          <div className="p-3 bg-cyan-950/40 text-cyan-400 border border-cyan-500/10 rounded-2xl w-fit">
            <Cpu className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-white uppercase tracking-tight">Zero-Trust Protocol</h3>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Every access query, database fetch, and asset presentation undergoes strict runtime authorization. Your intellectual property details are continuously cryptographically bound, guarding against breach vectors.
          </p>
        </div>

        <div className="bg-[#09090b] border border-zinc-900 p-6 rounded-3xl space-y-4 shadow-md">
          <div className="p-3 bg-violet-950/40 text-violet-400 border border-violet-500/10 rounded-2xl w-fit">
            <Coins className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-white uppercase tracking-tight">Immutable Fee Settlement</h3>
          <p className="text-xs text-zinc-400 leading-relaxed">
            By shifting licensing treaties into blockchain smart contracts, transaction splits occur instantly at the protocol level. We completely replace costly administrative delay periods with immediate cash flow.
          </p>
        </div>

        <div className="bg-[#09090b] border border-zinc-900 p-6 rounded-3xl space-y-4 shadow-md">
          <div className="p-3 bg-emerald-950/40 text-emerald-400 border border-emerald-500/10 rounded-2xl w-fit">
            <Globe2 className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-white uppercase tracking-tight">Global Interoperability</h3>
          <p className="text-xs text-zinc-400 leading-relaxed">
            A standardized, cross-chain metadata schema allows registered IP assets to be traded, cataloged, and integrated into international marketplaces and decentralized exchanges without compatibility issues.
          </p>
        </div>
      </div>

      {/* 3.5 Sovereign Creative Pulses: Tailored Tracks */}
      <div className="bg-zinc-950 border border-zinc-900 rounded-3xl p-6 md:p-8 space-y-6 relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-cyan-500/5 via-transparent to-transparent pointer-events-none" />
        
        <div className="border-b border-zinc-900 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] uppercase font-mono tracking-widest text-emerald-400 font-black flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 animate-pulse text-emerald-400" /> Defining Our Creative Pulses
            </span>
            <h2 className="text-lg font-black text-white uppercase tracking-tight mt-1">Sovereign Domain Pipelines</h2>
            <p className="text-xs text-zinc-500 mt-0.5">Tailored Zero-Trust integration paths engineered specifically for each media and technical domain.</p>
          </div>
          
          {/* Tabs Selector */}
          <div className="flex bg-zinc-900/60 p-1 rounded-2xl border border-zinc-850 self-start md:self-auto">
            {(['developer', 'musician', 'writer'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActivePulseTab(tab)}
                className={`px-4 py-2 text-[10px] font-mono font-bold uppercase rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                  activePulseTab === tab
                    ? 'bg-zinc-950 border border-zinc-800 text-cyan-400 shadow-lg'
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                {tab === 'developer' && <Code2 className="w-3.5 h-3.5 text-cyan-400" />}
                {tab === 'musician' && <Music className="w-3.5 h-3.5 text-violet-400" />}
                {tab === 'writer' && <BookOpen className="w-3.5 h-3.5 text-amber-400" />}
                {tab === 'developer' ? 'Developer Pulse' : tab === 'musician' ? 'Musician Pulse' : 'Writers & Filmmakers'}
                {activePulseTab === tab && (
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Contents with Framer Motion Transition */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activePulseTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
          >
            {activePulseTab === 'developer' && (
              <>
                <div className="lg:col-span-7 space-y-4">
                  <div className="space-y-1.5">
                    <span className="bg-cyan-950/40 text-cyan-400 border border-cyan-500/15 text-[9px] font-mono font-black uppercase px-2 py-0.5 rounded w-fit block">
                      Software Developers track
                    </span>
                    <h3 className="text-sm font-black text-white uppercase tracking-tight">The Software Developer&apos;s Pulse (Engine Vault)</h3>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      Developers are the architects of the digital age, yet traditional license agreements are complex and easily breached by AI crawler bots. The <strong>Developer Pulse</strong> integrates cryptographic Git signatures and software packaging standards with smart contract distribution layers.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div className="bg-zinc-900/40 border border-zinc-900 p-4 rounded-2xl space-y-2">
                      <h4 className="text-[10px] font-mono font-black text-white uppercase flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" /> Git Repo Anchoring
                      </h4>
                      <p className="text-[11px] text-zinc-400 leading-normal">
                        Cryptographically anchor specific git commit hashes directly into on-chain ERC-721 token metadata to prove priority of work and ownership.
                      </p>
                    </div>

                    <div className="bg-zinc-900/40 border border-zinc-900 p-4 rounded-2xl space-y-2">
                      <h4 className="text-[10px] font-mono font-black text-white uppercase flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" /> Crawler Opt-Out Stamps
                      </h4>
                      <p className="text-[11px] text-zinc-400 leading-normal">
                        Bind custom machine-readable compliance manifests (e.g. Spawning/ai-licensing.jsonld) to reject or monetize model training scraper bots automatically.
                      </p>
                    </div>

                    <div className="bg-zinc-900/40 border border-zinc-900 p-4 rounded-2xl space-y-2">
                      <h4 className="text-[10px] font-mono font-black text-white uppercase flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" /> Web3 API Tokens
                      </h4>
                      <p className="text-[11px] text-zinc-400 leading-normal">
                        Issue secure, on-chain token gated credentials and API keys with automated rate limiting and micro-royalty pay-per-call.
                      </p>
                    </div>

                    <div className="bg-zinc-900/40 border border-zinc-900 p-4 rounded-2xl space-y-2">
                      <h4 className="text-[10px] font-mono font-black text-white uppercase flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" /> Micro-Royalty Routing
                      </h4>
                      <p className="text-[11px] text-zinc-400 leading-normal">
                        Route continuous fractions of license fees or package dependencies instantly to multi-sig developer wallets at the protocol tier.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-5 bg-[#040406] border border-zinc-900 rounded-2xl p-4 space-y-3.5">
                  <div className="flex justify-between items-center border-b border-zinc-900 pb-2">
                    <span className="text-[9px] font-mono text-zinc-500 uppercase">Interactive Config Sample</span>
                    <span className="text-[8px] bg-cyan-950 text-cyan-400 px-1.5 py-0.5 rounded font-mono font-bold uppercase">SOVRAN-LICENSE.json</span>
                  </div>

                  <pre className="text-[9px] font-mono text-zinc-400 overflow-x-auto bg-black p-3 rounded-lg border border-zinc-900">
{`{
  "name": "@sovranly/zero-trust-sdk",
  "version": "1.0.4",
  "licenseType": "SOVRANLY-IP-NON-EXCLUSIVE",
  "anchors": {
    "gitCommit": "8f3ba9ee8aef8...",
    "contract": "0xfe3b...88aa"
  },
  "compliance": {
    "crawlerTrainingOptIn": false,
    "minBidPerEpochUSD": 12.50
  }
}`}
                  </pre>

                  <div className="text-[10px] text-zinc-500 font-sans leading-normal bg-zinc-900/20 p-2 rounded-lg">
                    This file is included directly in developer software packages. Scrapers, compilers, and APIs read this envelope to settle licensing requirements instantly.
                  </div>
                </div>
              </>
            )}

            {activePulseTab === 'musician' && (
              <>
                <div className="lg:col-span-7 space-y-4">
                  <div className="space-y-1.5">
                    <span className="bg-violet-950/40 text-violet-400 border border-violet-500/15 text-[9px] font-mono font-black uppercase px-2 py-0.5 rounded w-fit block">
                      Musicians & Composers Track
                    </span>
                    <h3 className="text-sm font-black text-white uppercase tracking-tight">The Musician&apos;s Pulse (Acoustic Registry)</h3>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      Musicians struggle under microscopic streaming royalties and high publishing intermediary commissions. The <strong>Musician Pulse</strong> settles synchronization, digital performance, and stems licensing rights instantly at the protocol level.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div className="bg-zinc-900/40 border border-zinc-900 p-4 rounded-2xl space-y-2">
                      <h4 className="text-[10px] font-mono font-black text-white uppercase flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-violet-400" /> Acoustic Fingerprinting
                      </h4>
                      <p className="text-[11px] text-zinc-400 leading-normal">
                        Create and log immutable audio wave structures directly into global registries to track and identify unlicensed sampling.
                      </p>
                    </div>

                    <div className="bg-zinc-900/40 border border-zinc-900 p-4 rounded-2xl space-y-2">
                      <h4 className="text-[10px] font-mono font-black text-white uppercase flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-violet-400" /> Split Sheets
                      </h4>
                      <p className="text-[11px] text-zinc-400 leading-normal">
                        Share on-chain percentages directly with co-writers, composers, producers, and lyricists, completely avoiding collection lag.
                      </p>
                    </div>

                    <div className="bg-zinc-900/40 border border-zinc-900 p-4 rounded-2xl space-y-2">
                      <h4 className="text-[10px] font-mono font-black text-white uppercase flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-violet-400" /> Synchronization Rights
                      </h4>
                      <p className="text-[11px] text-zinc-400 leading-normal">
                        Automate synchronization licenses for YouTube, commercial ads, film scores, and indie game integrations instantly.
                      </p>
                    </div>

                    <div className="bg-zinc-900/40 border border-zinc-900 p-4 rounded-2xl space-y-2">
                      <h4 className="text-[10px] font-mono font-black text-white uppercase flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-violet-400" /> Decentralized Streaming Core
                      </h4>
                      <p className="text-[11px] text-zinc-400 leading-normal">
                        Route listener payouts instantly on-chain per track playtime, receiving royalties within seconds rather than quarters.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-5 bg-[#040406] border border-zinc-900 rounded-2xl p-4 space-y-3.5">
                  <div className="flex justify-between items-center border-b border-zinc-900 pb-2">
                    <span className="text-[9px] font-mono text-zinc-500 uppercase">Acoustic Splitting Schema</span>
                    <span className="text-[8px] bg-violet-950 text-violet-400 px-1.5 py-0.5 rounded font-mono font-bold uppercase">SONG-SPLITS.json</span>
                  </div>

                  <pre className="text-[9px] font-mono text-zinc-400 overflow-x-auto bg-black p-3 rounded-lg border border-zinc-900">
{`{
  "trackTitle": "Ethereal Echoes",
  "isrc": "US-S1R-26-00042",
  "splits": [
    { "role": "Composer", "address": "0x5a1b...", "share": 0.45 },
    { "role": "Producer", "address": "0x2e3d...", "share": 0.35 },
    { "role": "Vocalist", "address": "0x8f1e...", "share": 0.20 }
  ]
}`}
                  </pre>

                  <div className="text-[10px] text-zinc-500 font-sans leading-normal bg-zinc-900/20 p-2 rounded-lg">
                    This cryptographic split sheet routes royalty streaming payments automatically whenever the digital file is played or purchased.
                  </div>
                </div>
              </>
            )}

            {activePulseTab === 'writer' && (
              <>
                <div className="lg:col-span-7 space-y-4">
                  <div className="space-y-1.5">
                    <span className="bg-amber-950/40 text-amber-400 border border-amber-500/15 text-[9px] font-mono font-black uppercase px-2 py-0.5 rounded w-fit block">
                      Writers, Screenwriters & Filmmakers Track
                    </span>
                    <h3 className="text-sm font-black text-white uppercase tracking-tight">The Writer &amp; Filmmaker Pulse (Editorial &amp; Cinematic Ledger)</h3>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      Writers, screenwriters, and independent filmmakers suffer under multi-year distribution contracts and heavily diluted paper-bound royalty splits. The <strong>Writer &amp; Filmmaker Pulse</strong> establishes direct editorial-to-reader channels, film syndication licensing, and simplifies copyright/script stamp management.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div className="bg-zinc-900/40 border border-zinc-900 p-4 rounded-2xl space-y-2">
                      <h4 className="text-[10px] font-mono font-black text-white uppercase flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400" /> Serial Release Gates
                      </h4>
                      <p className="text-[11px] text-zinc-400 leading-normal">
                        Gate specific chapters, articles, or newsletters using verifiable on-chain digital keys or token subscriptions.
                      </p>
                    </div>

                    <div className="bg-zinc-900/40 border border-zinc-900 p-4 rounded-2xl space-y-2">
                      <h4 className="text-[10px] font-mono font-black text-white uppercase flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400" /> Translation Syndication
                      </h4>
                      <p className="text-[11px] text-zinc-400 leading-normal">
                        License publication translations or regional adaptations instantly, retaining ownership of the original intellectual property.
                      </p>
                    </div>

                    <div className="bg-zinc-900/40 border border-zinc-900 p-4 rounded-2xl space-y-2">
                      <h4 className="text-[10px] font-mono font-black text-white uppercase flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400" /> Verifiable Priority Stamps
                      </h4>
                      <p className="text-[11px] text-zinc-400 leading-normal">
                        Securely record encrypted hashes of your drafts before public release to establish a transparent priority timeline.
                      </p>
                    </div>

                    <div className="bg-zinc-900/40 border border-zinc-900 p-4 rounded-2xl space-y-2">
                      <h4 className="text-[10px] font-mono font-black text-white uppercase flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400" /> Subscriptions & Micro-payouts
                      </h4>
                      <p className="text-[11px] text-zinc-400 leading-normal">
                        Empower micro-donations and pay-per-read splits directly from user wallets to your sovereign key.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-5 bg-[#040406] border border-zinc-900 rounded-2xl p-4 space-y-3.5">
                  <div className="flex justify-between items-center border-b border-zinc-900 pb-2">
                    <span className="text-[9px] font-mono text-zinc-500 uppercase">Editorial Copyright Metadata</span>
                    <span className="text-[8px] bg-amber-950 text-amber-400 px-1.5 py-0.5 rounded font-mono font-bold uppercase">BOOK-LICENSING.json</span>
                  </div>

                  <pre className="text-[9px] font-mono text-zinc-400 overflow-x-auto bg-black p-3 rounded-lg border border-zinc-900">
{`{
  "workTitle": "Sovereignty of Mind",
  "isbnRegistered": false,
  "rights": {
    "ebookAllowed": true,
    "printAllowed": false,
    "regionalAdaptationAllowed": true
  },
  "verifiablePriorityHash": "e3b0c44298f..."
}`}
                  </pre>

                  <div className="text-[10px] text-zinc-500 font-sans leading-normal bg-zinc-900/20 p-2 rounded-lg">
                    Encrypted draft fingerprinting establishes a verifiable audit trail proving when your text was initially secured in the registry.
                  </div>
                </div>
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* 4. Interactive Investor Room (Pitch & Calculations) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Interactive Modeling Suite */}
        <div className="lg:col-span-7 bg-zinc-950 border border-zinc-900 rounded-3xl p-6 relative overflow-hidden flex flex-col justify-between shadow-xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-cyan-500/5 via-transparent to-transparent pointer-events-none" />
          
          <div className="space-y-1.5 pb-4 border-b border-zinc-900">
            <span className="text-[10px] uppercase font-mono tracking-widest text-cyan-400 font-black flex items-center gap-1.5">
              <Calculator className="w-3.5 h-3.5" /> Interactive Yield Modeler
            </span>
            <h2 className="text-base font-black text-white uppercase tracking-tight">Platform Growth Forecast Tool</h2>
            <p className="text-xs text-zinc-500">Calculate platform-wide transaction volume and subsequent revenue splits as user density expands.</p>
          </div>

          <div className="space-y-5 my-6">
            {/* Target Creators Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-zinc-400">Target Platform Creators</span>
                <span className="text-white font-bold">{targetCreators.toLocaleString()}</span>
              </div>
              <input 
                type="range" 
                min="1000" 
                max="50000" 
                step="500" 
                value={targetCreators}
                onChange={(e) => setTargetCreators(Number(e.target.value))}
                className="w-full accent-cyan-500 cursor-pointer h-1.5 bg-zinc-800 rounded-lg appearance-none"
              />
              <div className="flex justify-between text-[9px] text-zinc-650 font-mono">
                <span>1,000 creators</span>
                <span>50,000 creators</span>
              </div>
            </div>

            {/* Avg Asset Value Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-zinc-400">Average IP Asset Valuation</span>
                <span className="text-emerald-400 font-bold">${avgAssetVal.toLocaleString()}</span>
              </div>
              <input 
                type="range" 
                min="500" 
                max="10000" 
                step="100" 
                value={avgAssetVal}
                onChange={(e) => setAvgAssetVal(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer h-1.5 bg-zinc-800 rounded-lg appearance-none"
              />
              <div className="flex justify-between text-[9px] text-zinc-650 font-mono">
                <span>$500</span>
                <span>$10,000</span>
              </div>
            </div>

            {/* Fee percentage selection */}
            <div className="space-y-2">
              <span className="text-xs font-mono text-zinc-400 block">Sovereign Protocol Transaction Fee</span>
              <div className="grid grid-cols-3 gap-2">
                {[1.0, 1.5, 2.5].map((fee) => (
                  <button
                    key={fee}
                    onClick={() => setPlatformFeePercent(fee)}
                    className={`py-2 text-[10px] font-mono font-bold rounded-xl border transition-all cursor-pointer ${
                      platformFeePercent === fee 
                        ? 'bg-cyan-950/40 border-cyan-500/50 text-cyan-400'
                        : 'bg-zinc-900 border-zinc-850 text-zinc-500 hover:text-white'
                    }`}
                  >
                    {fee}% Split
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Results Summary Box */}
          <div className="bg-[#040406] border border-zinc-900 rounded-2xl p-4 grid grid-cols-2 gap-4 mt-2">
            <div>
              <span className="block text-[8px] font-mono uppercase text-zinc-500">Gross IP Marketplace Volume (GMV)</span>
              <span className="block text-xl font-black text-white font-mono mt-0.5">${projectedGMV.toLocaleString()}</span>
            </div>
            <div>
              <span className="block text-[8px] font-mono uppercase text-zinc-500">Projected Protocol Revenue Yield</span>
              <span className="block text-xl font-black text-emerald-400 font-mono mt-0.5">${projectedPlatformRevenue.toLocaleString()}</span>
            </div>
          </div>

        </div>

        {/* Investor Private Room / Secure Form */}
        <div className="lg:col-span-5 bg-zinc-950 border border-zinc-900 rounded-3xl p-6 flex flex-col justify-between shadow-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 to-violet-500" />
          
          <div className="space-y-4">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-mono tracking-widest text-violet-400 font-black flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5" /> Accredited Access Gate
              </span>
              <h3 className="text-sm font-bold text-white uppercase tracking-tight">Confidential Investor Room</h3>
              <p className="text-[11px] text-zinc-400 leading-normal">
                Registered institutional partners gain access to quarterly financials, cap-table distributions, and private audited token placement memos.
              </p>
            </div>

            <AnimatePresence mode="wait">
              {!formSubmitted ? (
                <motion.form 
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleInquirySubmit} 
                  className="space-y-3.5 mt-2"
                >
                  <div className="space-y-1">
                    <label className="text-[9px] font-mono uppercase text-zinc-500 font-bold block">Investor Name</label>
                    <input 
                      type="text" 
                      required
                      value={investorName}
                      onChange={(e) => setInvestorName(e.target.value)}
                      placeholder="Jane Doe"
                      className="w-full bg-zinc-900 border border-zinc-850 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-mono uppercase text-zinc-500 font-bold block">Work Email</label>
                    <input 
                      type="email" 
                      required
                      value={investorEmail}
                      onChange={(e) => setInvestorEmail(e.target.value)}
                      placeholder="jane@ventures.com"
                      className="w-full bg-zinc-900 border border-zinc-850 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-mono uppercase text-zinc-500 font-bold block">Venture Firm / Entity</label>
                    <input 
                      type="text" 
                      value={firmName}
                      onChange={(e) => setFirmName(e.target.value)}
                      placeholder="Sovereign Fund Partners"
                      className="w-full bg-zinc-900 border border-zinc-850 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  {/* Accredit Checkbox */}
                  <label className="flex items-start gap-2.5 bg-zinc-900/40 p-2.5 rounded-xl border border-zinc-900 cursor-pointer select-none">
                    <input 
                      type="checkbox"
                      checked={isAccredited}
                      onChange={(e) => setIsAccredited(e.target.checked)}
                      className="mt-0.5 rounded border-zinc-800 text-cyan-500 focus:ring-0 focus:ring-offset-0 bg-zinc-900"
                    />
                    <div className="space-y-0.5">
                      <span className="block text-[10px] font-mono uppercase font-black text-zinc-300">Accredited Investor Verified</span>
                      <span className="block text-[9px] text-zinc-500 font-sans leading-normal">I declare we meet SEC Rule 501 accreditation criteria.</span>
                    </div>
                  </label>

                  <button
                    type="submit"
                    disabled={isFormLoading || !isAccredited}
                    className="w-full bg-gradient-to-r from-cyan-600 to-violet-600 hover:from-cyan-500 hover:to-violet-500 disabled:opacity-40 text-white font-mono font-bold text-xs uppercase tracking-wider py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer mt-1"
                  >
                    {isFormLoading ? 'Verifying Link...' : 'Request Sovereign Pitch Room Access'}
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </motion.form>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-[#040406] border border-emerald-900/30 p-5 rounded-2xl space-y-4 text-center"
                >
                  <div className="p-3 bg-emerald-950/40 border border-emerald-500/10 rounded-2xl w-fit mx-auto text-emerald-400">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold uppercase text-white tracking-tight">Accredited Identity Registered</h4>
                    <p className="text-[10px] text-zinc-500 font-mono">
                      Confidential key handshake dispatching to <strong>{investorEmail}</strong>.
                    </p>
                  </div>

                  <div className="pt-3 border-t border-zinc-900 text-left space-y-2">
                    <span className="block text-[9px] font-mono uppercase text-zinc-500">Unlocked Private Placement Files:</span>
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center text-[10px] bg-zinc-900/50 p-2 rounded-lg border border-zinc-850">
                        <span className="font-mono text-zinc-300 truncate">Sovranly_IP_PitchDeck_Q2.pdf</span>
                        <span className="text-emerald-400 font-bold flex items-center gap-1 cursor-pointer hover:underline text-[9px] uppercase font-mono">
                          <Download className="w-3 h-3" /> Get
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-[10px] bg-zinc-900/50 p-2 rounded-lg border border-zinc-850">
                        <span className="font-mono text-zinc-300 truncate">Sovereign_Fin_Model_v4.xls</span>
                        <span className="text-emerald-400 font-bold flex items-center gap-1 cursor-pointer hover:underline text-[9px] uppercase font-mono">
                          <Download className="w-3 h-3" /> Get
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>

      </div>

      {/* 5. Team Leadership Section */}
      <div className="space-y-4">
        <h3 className="text-xs font-mono uppercase font-black tracking-wider text-white">
          Sovereign Governance Counsel
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TEAM_MEMBERS.map((member, idx) => (
            <div key={idx} className="bg-[#09090b] border border-zinc-900 p-5 rounded-2xl flex flex-col justify-between space-y-4 hover:border-zinc-800 transition-all">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <h4 className="text-xs font-black text-white tracking-tight">{member.name}</h4>
                  <span className="bg-zinc-900 text-[9px] font-mono text-zinc-500 px-2 py-0.5 rounded border border-zinc-850">COUNCIL</span>
                </div>
                <p className="text-[11px] font-mono text-cyan-400 uppercase font-black">{member.role}</p>
                <p className="text-[11px] text-zinc-400 leading-relaxed font-sans">{member.bio}</p>
              </div>

              <div className="pt-3 border-t border-zinc-900 flex justify-between items-center text-[9px] font-mono text-zinc-500">
                <span>Verification Cryptokey:</span>
                <span className="text-zinc-300 font-bold bg-zinc-900 px-1.5 py-0.5 rounded border border-zinc-850">{member.signature}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
