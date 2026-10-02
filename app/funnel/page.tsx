'use client';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { 
  ArrowRight, 
  ShieldCheck, 
  Coins, 
  Blocks, 
  CheckCircle2, 
  Circle, 
  ListChecks, 
  ExternalLink,
  Lock,
  Wallet,
  FileCheck2,
  ChevronRight
} from 'lucide-react';
import Link from 'next/link';
import { motion } from 'motion/react';

interface Requirement {
  id: string;
  label: string;
  description: string;
  tag: string;
}

interface FeatureCardData {
  id: string;
  icon: typeof ShieldCheck;
  title: string;
  phase: string;
  desc: string;
  color: string;
  borderColor: string;
  bgColor: string;
  badgeColor: string;
  glowShadow: string;
  requirements: Requirement[];
  actionLabel: string;
  actionHref: string;
}

const FEATURE_CARDS: FeatureCardData[] = [
  {
    id: 'security',
    icon: ShieldCheck,
    phase: 'Phase 01 · Ingestion & Identity',
    title: 'Zero Trust Security',
    desc: 'Continuous multi-factor identity attestation and cryptographic access barriers for digital masters.',
    color: 'text-emerald-400',
    borderColor: 'hover:border-emerald-500/50',
    bgColor: 'bg-emerald-500/10 border-emerald-500/20',
    badgeColor: 'text-emerald-400 border-emerald-500/30 bg-emerald-950/40',
    glowShadow: '0 20px 40px -12px rgba(16, 185, 129, 0.25), 0 0 24px 2px rgba(16, 185, 129, 0.16)',
    actionLabel: 'Verify Identity & Hashes',
    actionHref: '/dashboard?tab=security',
    requirements: [
      {
        id: 'sec-1',
        label: 'Creator Identity Verification',
        description: 'Authenticate through Google OAuth or cryptographic wallet signature with zero data leakage.',
        tag: 'Required',
      },
      {
        id: 'sec-2',
        label: 'Client-Side SHA-256 Hash',
        description: 'Generate immutable cryptographic digest of raw audio stems, videos, or source files locally.',
        tag: 'Pre-flight',
      },
      {
        id: 'sec-3',
        label: 'Zero Trust Access Policies',
        description: 'Define explicit programmatic clearance rules before files can be previewed or licensed.',
        tag: 'Security',
      },
    ],
  },
  {
    id: 'royalties',
    icon: Coins,
    phase: 'Phase 02 · Financial Settlement',
    title: 'Automated Royalties',
    desc: 'Deterministic smart contracts triggering atomic payouts directly to collaborators upon license execution.',
    color: 'text-amber-400',
    borderColor: 'hover:border-amber-500/50',
    bgColor: 'bg-amber-500/10 border-amber-500/20',
    badgeColor: 'text-amber-400 border-amber-500/30 bg-amber-950/40',
    glowShadow: '0 20px 40px -12px rgba(245, 158, 11, 0.25), 0 0 24px 2px rgba(245, 158, 11, 0.16)',
    actionLabel: 'Configure Split Agreement',
    actionHref: '/dashboard?tab=splits',
    requirements: [
      {
        id: 'roy-1',
        label: 'Non-Custodial Payout Address',
        description: 'Bind destination EVM address (Polygon, Arbitrum, Base, Ethereum) for royalty accrual.',
        tag: 'Required',
      },
      {
        id: 'roy-2',
        label: 'Co-Creator Split Allocation',
        description: 'Set immutable revenue division percentages across producers, songwriters, and visual artists.',
        tag: 'Contract',
      },
      {
        id: 'roy-3',
        label: 'Automated Escrow Rules',
        description: 'Establish instant peer-to-peer liquidity release without third-party escrow delay.',
        tag: 'Settlement',
      },
    ],
  },
  {
    id: 'ownership',
    icon: Blocks,
    phase: 'Phase 03 · Public Ledger Notarization',
    title: 'Immutable Ownership',
    desc: 'Decentralized copyright registration establishing permanent, tamper-proof provenance on-chain.',
    color: 'text-sky-400',
    borderColor: 'hover:border-sky-500/50',
    bgColor: 'bg-sky-500/10 border-sky-500/20',
    badgeColor: 'text-sky-400 border-sky-500/30 bg-sky-950/40',
    glowShadow: '0 20px 40px -12px rgba(14, 165, 233, 0.25), 0 0 24px 2px rgba(14, 165, 233, 0.16)',
    actionLabel: 'Mint Ledger Notarization',
    actionHref: '/dashboard?tab=register',
    requirements: [
      {
        id: 'own-1',
        label: 'Proof-of-Creation Timestamp',
        description: 'Mint canonical block timestamp anchoring exact date, time, and original author claim.',
        tag: 'On-Chain',
      },
      {
        id: 'own-2',
        label: 'Shareable Verification Badge',
        description: 'Generate dynamic QR certificate linking directly to verifiable block explorer receipt.',
        tag: 'Public',
      },
      {
        id: 'own-3',
        label: 'Public 1-Click Offer Link',
        description: 'Activate transparent licensing portal allowing clients to buy rights with instant clearance.',
        tag: 'Licensing',
      },
    ],
  },
];

export default function LandingPage() {
  const [loading, setLoading] = useState(true);
  const [checkedRequirements, setCheckedRequirements] = useState<Record<string, boolean>>({
    'sec-1': true,
    'roy-1': true,
    'own-1': false,
  });

  useEffect(() => {
    // Graceful initial render loading state for feature cards
    const timer = setTimeout(() => {
      setLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  const toggleRequirement = (reqId: string) => {
    setCheckedRequirements((prev) => ({
      ...prev,
      [reqId]: !prev[reqId],
    }));
  };

  const totalReqs = FEATURE_CARDS.reduce((acc, card) => acc + card.requirements.length, 0);
  const completedReqs = Object.values(checkedRequirements).filter(Boolean).length;
  const progressPercent = Math.round((completedReqs / totalReqs) * 100);

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans selection:bg-cyan-500/20 selection:text-cyan-300">
      {/* Top Navigation */}
      <nav className="flex items-center justify-between p-6 max-w-7xl mx-auto border-b border-zinc-900/60">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-cyan-400 font-mono font-bold group-hover:border-cyan-500/40 transition-colors">
            S
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white group-hover:text-cyan-300 transition-colors">Sovranly IP</h1>
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/" className="text-sm text-zinc-400 hover:text-white transition-colors">Home</Link>
          <Link href="/dashboard" className="text-sm text-zinc-400 hover:text-white transition-colors">Dashboard</Link>
          <Link href="/dashboard">
            <Button size="sm" className="rounded-full bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs px-4">
              Launch Console
            </Button>
          </Link>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-16 text-center">
        {/* Hero Section */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900/80 border border-zinc-800 text-zinc-400 text-xs font-mono mb-6">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Launch Phase Readiness Matrix</span>
        </div>

        <h2 className="text-5xl sm:text-6xl font-extrabold tracking-tighter mb-6 bg-gradient-to-r from-emerald-400 via-cyan-400 to-sky-400 bg-clip-text text-transparent">
          Secure Intellectual Property <br className="hidden sm:inline" /> Powering the Creator Economy
        </h2>
        <p className="text-lg sm:text-xl text-zinc-400 mb-10 max-w-3xl mx-auto leading-relaxed">
          Sovranly IP brings Zero Trust Architecture to the creative industries. Register, manage, and monetize your work with blockchain-native security and automated royalty distribution.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link href="/dashboard">
            <Button size="lg" className="px-8 rounded-full bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-black font-bold shadow-lg shadow-cyan-950/40">
              Launch Console <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link href="/funnel/whitepaper">
            <Button size="lg" variant="outline" className="px-8 rounded-full border-zinc-800 text-zinc-300 hover:bg-zinc-900 hover:text-white">
              Download 2026 Executive Summary
            </Button>
          </Link>
        </div>

        {/* Global Launch Readiness Progress Tracker */}
        <div className="mt-14 max-w-2xl mx-auto bg-zinc-900/50 border border-zinc-800/80 rounded-2xl p-5 text-left backdrop-blur-sm">
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-2">
              <ListChecks className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-mono uppercase tracking-wider text-zinc-300 font-bold">
                Pre-Flight Launch Readiness Checklist
              </span>
            </div>
            <span className="text-xs font-mono font-bold text-cyan-400">
              {completedReqs} of {totalReqs} Requirements Checked ({progressPercent}%)
            </span>
          </div>
          <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
            <div 
              className="bg-gradient-to-r from-cyan-500 to-emerald-400 h-full rounded-full transition-all duration-500 ease-out" 
              style={{ width: `${progressPercent}%` }} 
            />
          </div>
          <p className="text-[11px] text-zinc-400 mt-2 font-mono">
            Click any requirement below to track your asset readiness before deploying your on-chain license agreement.
          </p>
        </div>

        {/* Feature Cards Header with Primary 'Launch Console' CTA */}
        <div className="mt-16 flex flex-col sm:flex-row sm:items-center justify-between gap-6 text-left border-b border-zinc-800/80 pb-6">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-cyan-950/60 border border-cyan-800/40 text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider">
              <span>CORE ARCHITECTURE</span>
              <span>·</span>
              <span>3 EXECUTION PHASES</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Launch Phase Feature Cards
            </h3>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-xl leading-relaxed">
              Explore the three foundational security and monetization pillars. Complete the checklist items and jump straight into the production environment.
            </p>
          </div>

          <Link href="/dashboard" className="flex-shrink-0">
            <Button 
              size="lg" 
              className="rounded-full bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-sm px-7 py-6 shadow-xl shadow-cyan-950/60 flex items-center gap-2.5 group cursor-pointer"
            >
              Launch Console
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>

        {/* Feature Cards with Launch Phase Checklists */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-10 text-left">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                id={`funnel-feature-skeleton-${i}`}
                data-testid="feature-card-skeleton"
                className="p-8 bg-zinc-900/60 rounded-3xl border border-zinc-800 animate-pulse space-y-6"
              >
                <div className="w-14 h-14 rounded-2xl border border-zinc-800 bg-zinc-800/70" />
                <div className="h-6 w-3/4 bg-zinc-800/80 rounded-lg" />
                <div className="h-14 w-full bg-zinc-800/40 rounded-lg" />
                <div className="pt-4 border-t border-zinc-800/60 space-y-3">
                  <div className="h-4 w-1/2 bg-zinc-800/60 rounded" />
                  <div className="h-16 w-full bg-zinc-800/30 rounded-xl" />
                  <div className="h-16 w-full bg-zinc-800/30 rounded-xl" />
                  <div className="h-16 w-full bg-zinc-800/30 rounded-xl" />
                </div>
              </div>
            ))
          ) : (
            FEATURE_CARDS.map((feature, i) => {
              const cardReqs = feature.requirements;
              const cardDone = cardReqs.filter((r) => checkedRequirements[r.id]).length;
              const isAllDone = cardDone === cardReqs.length;

              return (
                <motion.div
                  key={feature.id}
                  id={`funnel-feature-card-${i}`}
                  initial={{ y: 0 }}
                  whileHover={{ 
                    y: -6, 
                    boxShadow: feature.glowShadow,
                    transition: { duration: 0.25, ease: 'easeOut' }
                  }}
                  className={`relative p-7 sm:p-8 bg-zinc-900/60 rounded-3xl border border-zinc-800/90 flex flex-col justify-between transition-colors duration-300 ${feature.borderColor} group overflow-hidden`}
                >
                  {/* Subtle hover specular glow highlight */}
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-white/[0.04] to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  <div>
                    {/* Top Row: Icon & Phase Tag */}
                    <div className="flex items-center justify-between mb-5">
                      <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center ${feature.bgColor} transition-transform duration-300 group-hover:scale-105`}>
                        <feature.icon className={`h-6 w-6 ${feature.color}`} />
                      </div>
                      <span className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-full border ${feature.badgeColor}`}>
                        {feature.phase}
                      </span>
                    </div>

                    {/* Card Title & Desc */}
                    <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                      {feature.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed mb-6">
                      {feature.desc}
                    </p>

                    {/* Launch Phase Checklist Section */}
                    <div className="pt-5 border-t border-zinc-800/80 space-y-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[11px] font-mono tracking-wider uppercase text-zinc-300 font-bold flex items-center gap-1.5">
                          <ListChecks className="w-3.5 h-3.5 text-cyan-400" />
                          Launch Requirements
                        </span>
                        <span className={`text-[11px] font-mono font-semibold ${isAllDone ? 'text-emerald-400' : 'text-zinc-500'}`}>
                          {cardDone}/{cardReqs.length} Done
                        </span>
                      </div>

                      <div className="space-y-2">
                        {cardReqs.map((req) => {
                          const isChecked = !!checkedRequirements[req.id];
                          return (
                            <button
                              key={req.id}
                              type="button"
                              onClick={() => toggleRequirement(req.id)}
                              className={`w-full text-left p-3 rounded-xl border transition-all flex items-start gap-3 cursor-pointer ${
                                isChecked
                                  ? 'bg-zinc-950/80 border-cyan-900/40 text-zinc-200'
                                  : 'bg-zinc-950/40 border-zinc-800/60 text-zinc-400 hover:border-zinc-700 hover:bg-zinc-950/60'
                              }`}
                            >
                              <div className="mt-0.5 flex-shrink-0">
                                {isChecked ? (
                                  <CheckCircle2 className="w-4 h-4 text-cyan-400 transition-transform scale-110" />
                                ) : (
                                  <Circle className="w-4 h-4 text-zinc-600 group-hover:text-zinc-400" />
                                )}
                              </div>
                              <div className="space-y-0.5 flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-2">
                                  <span className={`text-xs font-semibold leading-tight ${isChecked ? 'text-white font-bold' : 'text-zinc-300'}`}>
                                    {req.label}
                                  </span>
                                  <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 flex-shrink-0">
                                    {req.tag}
                                  </span>
                                </div>
                                <p className="text-[11px] text-zinc-400 leading-normal line-clamp-2">
                                  {req.description}
                                </p>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Card Action CTA */}
                  <div className="mt-6 pt-4 border-t border-zinc-800/80 flex items-center justify-between">
                    <span className="text-[11px] font-mono text-zinc-500">
                      Step {i + 1} of 3
                    </span>
                    <Link href={feature.actionHref}>
                      <span className="text-xs font-bold text-cyan-400 hover:text-cyan-300 inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                        {feature.actionLabel} <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </Link>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>

        {/* Footer Navigation & Transparency note */}
        <div className="mt-20 pt-8 border-t border-zinc-900 text-center text-xs text-zinc-500 font-mono space-y-2">
          <p>
            Sovranly IP Protocol · Zero Trust Architecture for Intellectual Property · Verified Deployment on www.sovranlyip.com
          </p>
          <div className="flex items-center justify-center gap-4 text-zinc-400">
            <Link href="/" className="hover:text-white transition-colors">Marketing Home</Link>
            <span>•</span>
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <span>•</span>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            <span>•</span>
            <Link href="/funnel/whitepaper" className="hover:text-white transition-colors">Whitepaper</Link>
          </div>
        </div>
      </main>
    </div>
  );
}

