'use client';

import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Zap, 
  Lock, 
  FileText, 
  DollarSign, 
  Database, 
  Cpu, 
  Eye, 
  CheckCircle2, 
  Sliders, 
  Layers, 
  Key, 
  Share2, 
  Globe, 
  ArrowRight,
  Copy,
  Check,
  Terminal,
  ShieldAlert,
  HelpCircle,
  BookOpen
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import Image from 'next/image';

interface SampleAsset {
  id: string;
  title: string;
  type: string;
  creator: string;
  royalty: number;
  ipfsHash: string;
  tokenId: string;
  status: 'Verified' | 'Minted' | 'Protected';
  description: string;
  date: string;
}

const SAMPLE_ASSETS: SampleAsset[] = [
  {
    id: 'asset-01',
    title: 'Sovereign Symphony Beat #08',
    type: 'Audio Sample Pack (WAV)',
    creator: '0x742d...f44e (@audiosovereign)',
    royalty: 85,
    ipfsHash: 'QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco',
    tokenId: 'NFT-L2-10049',
    status: 'Minted',
    description: 'High-fidelity modular analog synthesizer loops with complete copyright clearance and Zero Trust continuous audio stream encryption.',
    date: '2026-07-28'
  },
  {
    id: 'asset-02',
    title: 'Cybernetic Aegis UI Framework',
    type: 'Software Utility / Codebase',
    creator: '0x8626...1199 (@sovdev)',
    royalty: 90,
    ipfsHash: 'QmZ4tj3b8y4gK5a9p8r2q8yW3mK9j6s3a2m1x4p7q8r9s0',
    tokenId: 'NFT-L2-10052',
    status: 'Verified',
    description: 'Enterprise React & Tailwind assembly with cryptographic wallet connectors and automated royalty distribution hooks.',
    date: '2026-07-30'
  },
  {
    id: 'asset-03',
    title: 'Ethereal Cosmic Horizon Artwork',
    type: 'Digital Artwork (4K Render)',
    creator: '0x3C44...93BC (@visualsovereign)',
    royalty: 80,
    ipfsHash: 'QmP9w8q7e6r5t4y3u2i1o0p9a8s7d6f5g4h3j2k1l0m9n8',
    tokenId: 'NFT-L2-10058',
    status: 'Protected',
    description: 'Procedurally generated 3D visual canvas for immersive gallery exhibitions with strict AI model fine-tuning exclusion rules.',
    date: '2026-08-01'
  }
];

export default function AppOverviewShowcase() {
  const [activeTab, setActiveTab] = useState<'registry' | 'licensing' | 'royalty' | 'security' | 'architecture'>('registry');
  const [selectedAsset, setSelectedAsset] = useState<SampleAsset>(SAMPLE_ASSETS[0]);
  const [copiedHash, setCopiedHash] = useState(false);
  const [simulatedRevenue, setSimulatedRevenue] = useState<number>(2500);
  const [creatorSharePercent, setCreatorSharePercent] = useState<number>(75);
  const [coCreatorSharePercent, setCoCreatorSharePercent] = useState<number>(15);
  const protocolSharePercent = 100 - (creatorSharePercent + coCreatorSharePercent);

  const handleCopy = (text: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedHash(true);
      setTimeout(() => setCopiedHash(false), 2000);
    }
  };

  return (
    <section id="app-overview" className="relative max-w-7xl mx-auto px-6 py-20 space-y-16">
      {/* Section Banner Header */}
      <div className="text-center space-y-4 max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-950/40 border border-cyan-500/30 text-cyan-400 text-xs font-mono uppercase tracking-widest">
          <Eye className="w-3.5 h-3.5" />
          <span>Public App Overview — No Login Required</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
          Explore Sovranly IP <span className="bg-gradient-to-r from-cyan-400 via-sky-400 to-violet-400 bg-clip-text text-transparent">Inside & Out</span>
        </h2>
        <p className="text-zinc-400 text-base sm:text-lg leading-relaxed max-w-3xl mx-auto">
          We believe in complete architectural transparency. Test drive our core intellectual property tools, inspect real-time royalty split calculations, and explore how our Zero Trust security protocols work before connecting a wallet or creating an account.
        </p>
      </div>

      {/* Interactive Feature Exploration Tabs */}
      <div className="bg-zinc-900/60 border border-zinc-800 rounded-3xl p-4 sm:p-8 backdrop-blur-md shadow-2xl shadow-black/60 space-y-8">
        {/* Tab Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-2 border-b border-zinc-800 pb-6">
          {[
            { id: 'registry', label: '01. Sovereign IP Vault', icon: Database },
            { id: 'licensing', label: '02. Smart License Agreements', icon: FileText },
            { id: 'royalty', label: '03. Interactive Royalty Splitter', icon: DollarSign },
            { id: 'security', label: '04. Zero Trust Media Shield', icon: ShieldCheck },
            { id: 'architecture', label: '05. Blockchain & API Specs', icon: Cpu }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold uppercase tracking-wider transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500/20 to-violet-500/20 border border-cyan-500/50 text-white shadow-[0_0_20px_rgba(34,211,238,0.2)]'
                    : 'bg-zinc-950/60 border border-zinc-800/80 text-zinc-400 hover:text-white hover:border-zinc-700'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-zinc-500'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab 1: Sovereign IP Registry & Vault */}
        {activeTab === 'registry' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-5 space-y-4">
              <div className="space-y-2">
                <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest">Interactive Sample Registry</span>
                <h3 className="text-2xl font-bold text-white">How IP Assets Are Secured</h3>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  Every creative work uploaded to Sovranly IP is client-side encrypted, pinned to decentralized IPFS storage, and inscribed with a permanent SHA-256 ownership certificate on our Ethereum Layer-2 ledger.
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <p className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">Select a sample IP asset to inspect metadata:</p>
                {SAMPLE_ASSETS.map((asset) => (
                  <div
                    key={asset.id}
                    onClick={() => setSelectedAsset(asset)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                      selectedAsset.id === asset.id
                        ? 'bg-cyan-950/30 border-cyan-500/60 shadow-lg shadow-cyan-950/30'
                        : 'bg-zinc-950/60 border-zinc-800 hover:border-zinc-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-bold text-white text-sm">{asset.title}</h4>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                        {asset.status}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-zinc-400">
                      <span>{asset.type}</span>
                      <span className="font-mono text-[11px] text-zinc-500">{asset.tokenId}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-7 bg-zinc-950 border border-zinc-800 rounded-2xl p-6 space-y-6">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Sovereign Asset Certificate</span>
                    <h4 className="text-lg font-bold text-white">{selectedAsset.title}</h4>
                  </div>
                </div>
                <span className="text-xs font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-3 py-1 rounded-full">
                  • Cryptographically Verified
                </span>
              </div>

              <p className="text-sm text-zinc-300 leading-relaxed bg-zinc-900/50 p-4 rounded-xl border border-zinc-800/80">
                {selectedAsset.description}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-zinc-900/60 border border-zinc-800 p-4 rounded-xl">
                  <span className="text-[10px] font-mono text-zinc-500 uppercase block mb-1">Creator Public Identifier</span>
                  <span className="text-xs font-mono text-cyan-300 break-all">{selectedAsset.creator}</span>
                </div>
                <div className="bg-zinc-900/60 border border-zinc-800 p-4 rounded-xl">
                  <span className="text-[10px] font-mono text-zinc-500 uppercase block mb-1">Royalty Entitlement</span>
                  <span className="text-xs font-bold text-white">{selectedAsset.royalty}% Direct Creator Payout</span>
                </div>
              </div>

              <div className="bg-zinc-900/60 border border-zinc-800 p-4 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-zinc-500 uppercase">IPFS Decentralized Content Identifier (CID)</span>
                  <button
                    onClick={() => handleCopy(selectedAsset.ipfsHash)}
                    className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-mono"
                  >
                    {copiedHash ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy CID</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="p-2.5 bg-black rounded-lg border border-zinc-800 font-mono text-xs text-zinc-300 break-all">
                  {selectedAsset.ipfsHash}
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-zinc-800 text-xs text-zinc-400">
                <span>Registered on: <strong className="text-zinc-200">{selectedAsset.date}</strong></span>
                <span>Layer-2 Anchor: <strong className="text-cyan-400 font-mono">{selectedAsset.tokenId}</strong></span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Smart License Agreements */}
        {activeTab === 'licensing' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-5 space-y-4">
              <span className="text-xs font-mono text-violet-400 uppercase tracking-widest">No Middlemen Needed</span>
              <h3 className="text-2xl font-bold text-white">Configurable Smart Licenses</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Creators use our visual Licensing Agreement Builder to define exact terms for commercial usage, broadcast rights, and artificial intelligence model fine-tuning. Once signed, agreements execute automatically.
              </p>
              <div className="p-4 bg-violet-950/20 border border-violet-500/30 rounded-2xl space-y-2">
                <h4 className="text-sm font-bold text-violet-300 flex items-center gap-2">
                  <Lock className="w-4 h-4" /> AI Model Protection Clause
                </h4>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Every license generated by Sovranly IP explicitly defines whether AI/ML training is authorized. Unauthorized scraping triggers immediate automated access token revocation.
                </p>
              </div>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                {
                  title: 'Commercial Digital Sync License',
                  badge: 'Class 42 Protected',
                  royalty: '85% to Creator',
                  desc: 'Grants non-exclusive synchronization rights for film, television, video games, and streaming broadcasts.',
                  aiTraining: 'Strictly Prohibited',
                  fee: '0.15 ETH / $350 USD'
                },
                {
                  title: 'Enterprise AI Fine-Tuning License',
                  badge: 'Approved Neural Usage',
                  royalty: '90% to Creator',
                  desc: 'Authorizes ethical artificial intelligence training on audio or visual stems with verified attribution and ongoing royalty dividends.',
                  aiTraining: 'Authorized (With Royalty)',
                  fee: '0.45 ETH / $1,200 USD'
                },
                {
                  title: 'Open Source Attribution License',
                  badge: 'Commercial Exemption',
                  royalty: '100% Free Usage',
                  desc: 'Allows free remixing and distribution for non-commercial educational or open-source software projects.',
                  aiTraining: 'Requires Attribution',
                  fee: '0.00 ETH / Free'
                },
                {
                  title: 'Dual-Use Exclusive Transfer',
                  badge: 'Sovereign Buyout',
                  royalty: '95% to Creator',
                  desc: 'Full perpetual assignment of intellectual property rights, including master recordings and patent designs.',
                  aiTraining: 'Full Owner Discretion',
                  fee: '2.50 ETH / $6,500 USD'
                }
              ].map((lic, idx) => (
                <div key={idx} className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5 flex flex-col justify-between hover:border-violet-500/40 transition-all">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-violet-500/10 border border-violet-500/30 text-violet-300">
                        {lic.badge}
                      </span>
                      <span className="text-xs font-bold text-emerald-400">{lic.royalty}</span>
                    </div>
                    <h4 className="font-bold text-white text-base">{lic.title}</h4>
                    <p className="text-xs text-zinc-400 leading-relaxed">{lic.desc}</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-zinc-800/80 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-zinc-500">AI Model Training:</span>
                      <span className={`font-mono font-semibold ${lic.aiTraining.includes('Prohibited') ? 'text-rose-400' : 'text-cyan-400'}`}>
                        {lic.aiTraining}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-zinc-500">Standard License Fee:</span>
                      <span className="font-bold text-white">{lic.fee}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Interactive Royalty Splitter Sandbox */}
        {activeTab === 'royalty' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5 space-y-4">
              <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest">Interactive Calculator</span>
              <h3 className="text-2xl font-bold text-white">Simulate Automated Royalty Splits</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                When a licensing fee or streaming settlement arrives on Sovranly IP, our smart contracts automatically calculate and disperse payments to every collaborator simultaneously. No delays, no accounting overhead.
              </p>

              <div className="bg-zinc-950 border border-zinc-800 p-5 rounded-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">Simulated Licensing Revenue:</span>
                  <span className="text-lg font-extrabold text-emerald-400 font-mono">${simulatedRevenue.toLocaleString()} USD</span>
                </div>
                <input
                  type="range"
                  min="100"
                  max="25000"
                  step="100"
                  value={simulatedRevenue}
                  onChange={(e) => setSimulatedRevenue(Number(e.target.value))}
                  className="w-full accent-emerald-400 cursor-pointer bg-zinc-800 h-2 rounded-lg"
                />
                <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500">
                  <span>$100</span>
                  <span>$5,000</span>
                  <span>$15,000</span>
                  <span>$25,000</span>
                </div>
              </div>

              <div className="bg-zinc-950 border border-zinc-800 p-5 rounded-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">Primary Creator Royalty Split:</span>
                  <span className="text-sm font-bold text-cyan-400 font-mono">{creatorSharePercent}%</span>
                </div>
                <input
                  type="range"
                  min="40"
                  max="85"
                  step="5"
                  value={creatorSharePercent}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setCreatorSharePercent(val);
                    if (val + coCreatorSharePercent > 90) {
                      setCoCreatorSharePercent(90 - val);
                    }
                  }}
                  className="w-full accent-cyan-400 cursor-pointer bg-zinc-800 h-2 rounded-lg"
                />
              </div>
            </div>

            <div className="lg:col-span-7 bg-zinc-950 border border-zinc-800 rounded-2xl p-6 space-y-6">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-emerald-400" />
                  <span className="font-bold text-white">Real-Time Settlement Breakdown</span>
                </div>
                <span className="text-xs font-mono text-zinc-400">Zero Trust Ledger Execution</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 bg-zinc-900/80 border border-cyan-500/30 rounded-xl space-y-1">
                  <span className="text-xs font-semibold text-cyan-400 block">Primary Creator</span>
                  <div className="text-2xl font-extrabold text-white font-mono">
                    ${((simulatedRevenue * creatorSharePercent) / 100).toFixed(2)}
                  </div>
                  <span className="text-[11px] font-mono text-zinc-500 block">{creatorSharePercent}% Allocation</span>
                </div>

                <div className="p-4 bg-zinc-900/80 border border-violet-500/30 rounded-xl space-y-1">
                  <span className="text-xs font-semibold text-violet-400 block">Co-Producer / Writer</span>
                  <div className="text-2xl font-extrabold text-white font-mono">
                    ${((simulatedRevenue * coCreatorSharePercent) / 100).toFixed(2)}
                  </div>
                  <span className="text-[11px] font-mono text-zinc-500 block">{coCreatorSharePercent}% Allocation</span>
                </div>

                <div className="p-4 bg-zinc-900/80 border border-zinc-700/60 rounded-xl space-y-1">
                  <span className="text-xs font-semibold text-zinc-300 block">Protocol Network Fee</span>
                  <div className="text-2xl font-extrabold text-white font-mono">
                    ${((simulatedRevenue * protocolSharePercent) / 100).toFixed(2)}
                  </div>
                  <span className="text-[11px] font-mono text-zinc-500 block">{protocolSharePercent}% Infrastructure</span>
                </div>
              </div>

              {/* Simulated transaction receipt log */}
              <div className="space-y-2 pt-2">
                <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider block">
                  Simulated Cryptographic Receipt Log:
                </span>
                <div className="p-4 bg-black rounded-xl border border-zinc-800 font-mono text-xs space-y-2 text-zinc-300">
                  <div className="flex items-center justify-between text-emerald-400">
                    <span>✓ ATOMIC ROYALTY DISPERSAL COMPLETE</span>
                    <span>TX: 0x9f8a...c3d1</span>
                  </div>
                  <div className="text-[11px] text-zinc-400">
                    <div>→ Direct transfer to Creator Wallet: <strong>${((simulatedRevenue * creatorSharePercent) / 100).toFixed(2)} USD</strong></div>
                    <div>→ Direct transfer to Co-Producer: <strong>${((simulatedRevenue * coCreatorSharePercent) / 100).toFixed(2)} USD</strong></div>
                    <div>→ Cryptographic Audit Hash: <span className="text-cyan-400">0xe84a92b...84b2c1f</span></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Zero Trust Media Shield */}
        {activeTab === 'security' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 space-y-4">
              <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest">Continuous Authentication</span>
              <h3 className="text-2xl font-bold text-white">Zero Trust Media Protection</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Traditional platforms store files on open URLs that can be easily scraped by automated AI crawlers. Sovranly IP applies continuous Zero Trust cryptographic checks to every audio stem, document, and image.
              </p>
              
              <div className="space-y-3 pt-2">
                {[
                  {
                    title: 'Anti-Scrape AI Bot Defense',
                    desc: 'Automated crawlers without a cryptographically signed licensing token receive 401 Unauthorized responses instantly.'
                  },
                  {
                    title: 'Dynamic Stream Encryption',
                    desc: 'Media playback is streamed through secure time-limited tokens that expire immediately upon playback completion.'
                  },
                  {
                    title: 'On-Device Verification Shards',
                    desc: 'Proof of ownership signatures are validated against immutable blockchain registries before allowing download access.'
                  }
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3 p-3.5 bg-zinc-950 border border-zinc-800 rounded-xl">
                    <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-bold text-white">{item.title}</h4>
                      <p className="text-xs text-zinc-400 mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-6 bg-zinc-950 border border-zinc-800 rounded-2xl p-6 space-y-6">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                <span className="text-xs font-mono text-cyan-400 uppercase">Architecture Flow Diagram</span>
                <span className="text-xs font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
                  Zero Trust Active
                </span>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Globe className="w-5 h-5 text-zinc-400" />
                    <span className="text-sm font-bold text-white">1. External Request / AI Bot Crawler</span>
                  </div>
                  <span className="text-xs font-mono px-2 py-1 bg-rose-950/60 border border-rose-500/40 text-rose-400 rounded">
                    BLOCKED — NO LICENSE TOKEN
                  </span>
                </div>

                <div className="flex justify-center">
                  <div className="w-0.5 h-6 bg-gradient-to-b from-zinc-700 to-cyan-500" />
                </div>

                <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-500/40 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Key className="w-5 h-5 text-cyan-400" />
                    <span className="text-sm font-bold text-white">2. Cryptographic Signature Challenge</span>
                  </div>
                  <span className="text-xs font-mono px-2 py-1 bg-cyan-950 border border-cyan-500/30 text-cyan-400 rounded">
                    SHA-256 VERIFICATION
                  </span>
                </div>

                <div className="flex justify-center">
                  <div className="w-0.5 h-6 bg-gradient-to-b from-cyan-500 to-emerald-500" />
                </div>

                <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/40 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="w-5 h-5 text-emerald-400" />
                    <span className="text-sm font-bold text-white">3. Authorized Licensee Access Granted</span>
                  </div>
                  <span className="text-xs font-mono px-2 py-1 bg-emerald-950 border border-emerald-500/30 text-emerald-400 rounded">
                    SECURE STREAM ENCRYPTED
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 5: Blockchain & API Specs */}
        {activeTab === 'architecture' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-5 space-y-4">
              <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest">Developer & Enterprise Ready</span>
              <h3 className="text-2xl font-bold text-white">Technical Architecture & Specs</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Sovranly IP combines high-throughput Layer-2 Ethereum rollup verification with decentralized IPFS storage and a continuous API developer portal.
              </p>

              <div className="space-y-3 pt-2">
                <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-xl space-y-1">
                  <span className="text-xs font-bold text-white block">Layer-2 Blockchain Settlement</span>
                  <p className="text-xs text-zinc-400">
                    Runs on low-latency EVM-compatible Layer-2 rollup chains, keeping gas fees near zero while inheriting Ethereum mainnet security guarantees.
                  </p>
                </div>
                <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-xl space-y-1">
                  <span className="text-xs font-bold text-white block">Decentralized IPFS Pinning</span>
                  <p className="text-xs text-zinc-400">
                    Files are hashed and distributed across resilient interplanetary storage nodes so your intellectual property can never be taken offline.
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 bg-black border border-zinc-800 rounded-2xl p-6 font-mono text-xs text-zinc-300 space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <span className="text-cyan-400 font-bold flex items-center gap-2">
                  <Terminal className="w-4 h-4" /> SOVRANLY_IP_SPECIFICATION_V2
                </span>
                <span className="text-[11px] text-zinc-500">API VERSION 2026.08</span>
              </div>

              <div className="space-y-2">
                <div className="text-zinc-500">{"// Sovereign IP Verification Endpoint Example"}</div>
                <div className="p-3 bg-zinc-950 rounded-lg border border-zinc-800 text-cyan-300 overflow-x-auto">
                  GET https://api.sovranlyip.com/v1/verify?cid=QmXoyp...W3Wkn
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-zinc-500">{"// Response Payload (JSON Signature Proof)"}</div>
                <pre className="p-3 bg-zinc-950 rounded-lg border border-zinc-800 text-emerald-400 overflow-x-auto text-[11px] leading-normal">
{`{
  "status": "AUTHENTICATED_SOVEREIGN_ASSET",
  "issuer": "Sovranly IP Registry Protocol",
  "tokenId": "NFT-L2-10049",
  "sha256": "8fa4c3f2b87d3532fefc292f7e0bc872f2da4ec3",
  "royaltyDistribution": {
    "creator": "85.00%",
    "protocolFee": "15.00%"
  },
  "zeroTrustVerified": true
}`}
                </pre>
              </div>

              <div className="flex items-center justify-between text-[11px] text-zinc-500 pt-2 border-t border-zinc-800">
                <span>Rate Limits: 2,000 req/min (Standard)</span>
                <span>Uptime SLA: 99.99%</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 4-Step Visual Journey Walkthrough */}
      <div className="space-y-8 pt-6">
        <div className="text-center space-y-2">
          <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest">Simple Creator Workflow</span>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-white">How Sovranly IP Works From Start to Finish</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            {
              step: '01',
              title: 'Upload & Hashing',
              desc: 'Upload audio, video, artwork, or code. The browser generates a unique SHA-256 hash and pins your file to decentralized IPFS storage.',
              color: 'text-cyan-400',
              borderColor: 'border-cyan-500/30'
            },
            {
              step: '02',
              title: 'Define Licensing Rights',
              desc: 'Use the agreement builder to set commercial sync rates, AI model fine-tuning rules, and automated royalty splits.',
              color: 'text-violet-400',
              borderColor: 'border-violet-500/30'
            },
            {
              step: '03',
              title: 'Zero Trust Media Shield',
              desc: 'Your creative media is shielded from unauthorized scraping. Only verified licensees with valid cryptographic tokens can stream or download.',
              color: 'text-sky-400',
              borderColor: 'border-sky-500/30'
            },
            {
              step: '04',
              title: 'Automated Settlement',
              desc: 'When royalties arrive, smart contracts instantly disperse payments to all collaborators with transparent blockchain receipts.',
              color: 'text-emerald-400',
              borderColor: 'border-emerald-500/30'
            }
          ].map((card, idx) => (
            <div key={idx} className={`p-6 bg-zinc-900/40 border ${card.borderColor} rounded-3xl space-y-3 relative overflow-hidden backdrop-blur-sm`}>
              <span className={`text-3xl font-black font-mono ${card.color} opacity-40 block`}>
                {card.step}
              </span>
              <h4 className="text-lg font-bold text-white">{card.title}</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">{card.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Direct Public Directory Cards (No Login Needed) */}
      <div className="space-y-6 pt-6">
        <div className="text-center space-y-2">
          <span className="text-xs font-mono text-violet-400 uppercase tracking-widest">Public App Directory</span>
          <h3 className="text-2xl font-bold text-white">Explore Open Pages Without Logging In</h3>
          <p className="text-sm text-zinc-400 max-w-xl mx-auto">
            You can browse registered IP assets, inspect technical documentation, and review our legal framework anytime.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: 'Public IP Marketplace',
              desc: 'Browse verified creative audio stems, software utilities, and artwork available for commercial sync.',
              href: '/marketplace',
              badge: 'Open Marketplace',
              icon: Globe
            },
            {
              title: 'Knowledge Wiki & Docs',
              desc: 'Read full specifications on Zero Trust security, IPFS pinning, and Ethereum Layer-2 verification.',
              href: '/wiki',
              badge: 'Documentation',
              icon: BookOpen
            },
            {
              title: 'Frequently Asked Questions',
              desc: 'Get immediate answers on IP ownership, copyright enforcement, and royalty payout timelines.',
              href: '/faq',
              badge: 'Help Center',
              icon: HelpCircle
            },
            {
              title: 'AI Licensing Assistant',
              desc: 'Chat with our interactive AI assistant to determine which license agreement fits your project.',
              href: '/onboarding',
              badge: 'AI Guide',
              icon: Zap
            }
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <Link
                key={i}
                href={item.href}
                className="group p-6 bg-zinc-900/50 border border-zinc-800 rounded-2xl hover:border-cyan-500/40 transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-zinc-800 text-zinc-300">
                      {item.badge}
                    </span>
                    <Icon className="w-4 h-4 text-cyan-400 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                  <h4 className="font-bold text-white text-base group-hover:text-cyan-300 transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-zinc-800/80 flex items-center gap-1.5 text-xs text-cyan-400 font-semibold">
                  <span>Explore Now</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
