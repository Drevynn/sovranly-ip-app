'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  BookOpen, 
  Code, 
  Terminal, 
  ShieldCheck, 
  Layers, 
  Cpu, 
  Scale, 
  Key, 
  Check, 
  Copy, 
  Search, 
  ExternalLink, 
  ChevronRight, 
  Sparkles, 
  Database, 
  Lock, 
  Play, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  FileText, 
  Zap, 
  Globe,
  Sliders,
  DollarSign,
  HelpCircle,
  Hash,
  Download,
  Activity,
  CreditCard
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { PublicNavbarHamburger } from '@/components/PublicNavbarHamburger';
import NewsletterSignup from '@/components/NewsletterSignup';
import { SovranlyLogo } from '@/components/SovranlyLogo';
import ApiPlayground from '@/components/ApiPlayground';

type CategoryId = 'all' | 'overview' | 'quickstart' | 'contracts' | 'api' | 'security' | 'legal' | 'sdk';

interface DocSection {
  id: string;
  category: CategoryId;
  title: string;
  badge: string;
  description: string;
  content: React.ReactNode;
  tags: string[];
}

export default function DocumentationPage() {
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCodeId(id);
    setTimeout(() => setCopiedCodeId(null), 2000);
  };

  const categories: { id: CategoryId; label: string; icon: React.ReactNode; count: number }[] = [
    { id: 'all', label: 'All Topics', icon: <Layers className="w-4 h-4 text-cyan-400" />, count: 7 },
    { id: 'overview', label: 'Architecture', icon: <Cpu className="w-4 h-4 text-blue-400" />, count: 1 },
    { id: 'quickstart', label: 'Quickstart', icon: <Zap className="w-4 h-4 text-amber-400" />, count: 1 },
    { id: 'contracts', label: 'Smart Contracts', icon: <Database className="w-4 h-4 text-emerald-400" />, count: 1 },
    { id: 'api', label: 'REST API', icon: <Terminal className="w-4 h-4 text-teal-400" />, count: 1 },
    { id: 'security', label: 'Zero Trust & C2PA', icon: <ShieldCheck className="w-4 h-4 text-cyan-400" />, count: 1 },
    { id: 'legal', label: 'Licensing & Splits', icon: <Scale className="w-4 h-4 text-rose-400" />, count: 1 },
    { id: 'sdk', label: 'SDK & Webhooks', icon: <Code className="w-4 h-4 text-violet-400" />, count: 1 },
  ];

  const docSections: DocSection[] = useMemo(() => [
    {
      id: 'architecture-overview',
      category: 'overview',
      title: '1. Architectural Philosophy & Zero Trust Creed',
      badge: 'Core Architecture',
      description: 'Understand how Sovranly IP eliminates legacy collection bureaucracy through cryptographic verification and trustless execution.',
      tags: ['zero trust', 'architecture', 'blockchain', 'c2pa', 'provenance'],
      content: (
        <div className="space-y-6 text-zinc-300 text-sm leading-relaxed">
          <p>
            Traditional intellectual property distribution relies on blind trust: creators upload master recordings, digital artwork, or codebases to centralized distributors who hold revenues for 60 to 90 days, levy opaque administrative cuts, and offer zero resistance against AI scrapers harvesting data without consent.
          </p>
          <div className="p-5 rounded-2xl bg-zinc-900/60 border border-cyan-500/20 space-y-3">
            <h4 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-cyan-400" /> The Sovranly Zero Trust Axiom
            </h4>
            <blockquote className="text-white text-base font-semibold italic border-l-2 border-cyan-400 pl-4">
              &ldquo;Never trust an intermediary statement; continuously verify content provenance, licensing agreements, and payment splits at the cryptographic boundary.&rdquo;
            </blockquote>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-800 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-cyan-950/60 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Hash className="w-4 h-4" />
              </div>
              <h5 className="font-bold text-white text-xs uppercase tracking-wide">1. SHA-256 Fingerprints</h5>
              <p className="text-zinc-400 text-xs">
                Every uploaded master file is hashed client-side and recorded on-chain, securing indisputable mathematical proof of existence.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-800 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-950/60 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <DollarSign className="w-4 h-4" />
              </div>
              <h5 className="font-bold text-white text-xs uppercase tracking-wide">2. 85 / 15 Split Standard</h5>
              <p className="text-zinc-400 text-xs">
                Smart contracts automatically disperse 85% directly to creator wallets and 15% to protocol sustainability instantly upon settlement.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-800 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-purple-950/60 border border-purple-500/30 flex items-center justify-center text-purple-400">
                <Lock className="w-4 h-4" />
              </div>
              <h5 className="font-bold text-white text-xs uppercase tracking-wide">3. Anti-AI Poisoning</h5>
              <p className="text-zinc-400 text-xs">
                Watermarked headers and C2PA provenance signatures defend assets from unauthorized large-scale AI model training datasets.
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'creator-quickstart',
      category: 'quickstart',
      title: '2. Quickstart Guide: Protecting Your First Asset',
      badge: '5-Minute Workflow',
      description: 'Step-by-step walkthrough to upload an original piece of IP, generate cryptographic verification, and initiate instant sync sales.',
      tags: ['quickstart', 'onboarding', 'tutorial', 'verification', 'paylinks'],
      content: (
        <div className="space-y-6 text-zinc-300 text-sm leading-relaxed">
          <div className="space-y-4">
            <div className="flex items-start gap-4 p-4 rounded-xl bg-zinc-900/50 border border-zinc-800">
              <span className="w-7 h-7 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                01
              </span>
              <div className="space-y-1">
                <h5 className="font-bold text-white text-sm">Authenticate via Google or Sovereign Smart Wallet</h5>
                <p className="text-xs text-zinc-400">
                  Click <strong>Connect</strong> in the upper navigation. You can sign in using zero-friction Google Identity, or pair an EVM Web3 wallet (MetaMask, Coinbase Wallet, WalletConnect).
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-xl bg-zinc-900/50 border border-zinc-800">
              <span className="w-7 h-7 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                02
              </span>
              <div className="space-y-1">
                <h5 className="font-bold text-white text-sm">Upload Master Recording or Artwork</h5>
                <p className="text-xs text-zinc-400">
                  Navigate to <strong>Asset Manager</strong>. Drag and drop your uncompressed WAV master, FLAC audio, or high-res visual design. The browser generates a unique SHA-256 fingerprint without exposing private master files.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-xl bg-zinc-900/50 border border-zinc-800">
              <span className="w-7 h-7 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                03
              </span>
              <div className="space-y-1">
                <h5 className="font-bold text-white text-sm">Build Your Sync License Compact</h5>
                <p className="text-xs text-zinc-400">
                  Open the <strong>Licensing Agreement Builder</strong>. Choose Commercial Sync, Non-Exclusive Podcast Sync, or Full Master Buyout. Specify term duration and enforce the anti-AI training clause.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-xl bg-zinc-900/50 border border-zinc-800">
              <span className="w-7 h-7 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                04
              </span>
              <div className="space-y-1">
                <h5 className="font-bold text-white text-sm">Activate Instant PayLinks &amp; Public Verification</h5>
                <p className="text-xs text-zinc-400">
                  Share your public verification link (<code className="text-cyan-300 font-mono text-[11px]">/verify/[assetId]</code>) and send direct PayLinks directly to music supervisors, game developers, or video editors for one-click settlement.
                </p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'smart-contracts-protocol',
      category: 'contracts',
      title: '3. Smart Contract Protocol Specifications',
      badge: 'Solidity Contracts',
      description: 'Technical breakdown of on-chain bytecode governing IP registration, automated 85/15 payment splits, and timelocked security.',
      tags: ['smart contracts', 'solidity', 'erc-721', 'payment splitter', 'guardian'],
      content: (
        <div className="space-y-6 text-zinc-300 text-sm leading-relaxed">
          <p>
            Sovranly IP deploys audited, modular Solidity contracts configured to run on EVM chains. The platform separates registry storage, payment distribution, and security controls into distinct contracts:
          </p>

          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-emerald-400 text-xs">SovranlyIPAsset.sol</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800/40">ERC-721 Core</span>
                </div>
                <span className="text-[10px] text-zinc-500 font-mono">contracts/SovranlyIPAsset.sol</span>
              </div>
              <p className="text-xs text-zinc-400">
                Implements verifiable non-fungible IP asset registration. Stores token URI, immutable content hash, author address, and sync licensing permission states.
              </p>
              <div className="bg-zinc-950 p-3 rounded-lg border border-zinc-850 font-mono text-xs text-zinc-300 overflow-x-auto">
                <pre>{`function registerAsset(
    string memory uri,
    bytes32 contentHash,
    uint256 syncRateUsd,
    bool aiRestricted
) external returns (uint256 tokenId);`}</pre>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-teal-400 text-xs">SovranlyPaymentSplitter.sol</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-teal-950 text-teal-400 border border-teal-800/40">Trustless Splits</span>
                </div>
                <span className="text-[10px] text-zinc-500 font-mono">contracts/SovranlyPaymentSplitter.sol</span>
              </div>
              <p className="text-xs text-zinc-400">
                Guarantees autonomous, reentrancy-safe split disbursement. When funds arrive from fiat rails (via payment gateway webhooks) or direct crypto settlement, 85% is assigned to the creator beneficiary address and 15% to protocol operations.
              </p>
              <div className="bg-zinc-950 p-3 rounded-lg border border-zinc-850 font-mono text-xs text-zinc-300 overflow-x-auto">
                <pre>{`uint256 public constant CREATOR_SHARE_BPS = 8500; // 85.00%
uint256 public constant PROTOCOL_SHARE_BPS = 1500; // 15.00%

function splitPayment(uint256 assetId) external payable nonReentrant;`}</pre>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-amber-400 text-xs">SovranlyGuardian.sol &amp; Timelock</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950 text-amber-400 border border-amber-800/40">Security Authority</span>
                </div>
                <span className="text-[10px] text-zinc-500 font-mono">contracts/SovranlyGuardian.sol</span>
              </div>
              <p className="text-xs text-zinc-400">
                Maintains multi-sig emergency safeguards, timelocked parameter upgrades (48-hour delay), and automatic circuit breakers for anomalous payout bursts.
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'rest-api-reference',
      category: 'api',
      title: '4. REST API & Endpoint Reference',
      badge: 'HTTP / JSON APIs',
      description: 'Complete documentation of server endpoints for programmatic catalog integration, notarization, and verification.',
      tags: ['api', 'rest', 'endpoints', 'json', 'certificates', 'paylinks'],
      content: (
        <div className="space-y-6 text-zinc-300 text-sm leading-relaxed">
          <p>
            Sovranly IP exposes high-performance Next.js API endpoints protected by continuous authentication tokens. All endpoints respond with standard JSON envelopes.
          </p>

          <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-3">
            <h5 className="font-bold text-white text-xs uppercase tracking-wider font-mono flex items-center gap-2">
              <Key className="w-4 h-4 text-cyan-400" /> Standard Request Headers
            </h5>
            <div className="bg-zinc-950 p-3 rounded-lg border border-zinc-850 font-mono text-xs text-zinc-300">
              <div className="text-zinc-400">Authorization: Bearer &lt;FIREBASE_OR_SESSION_JWT&gt;</div>
              <div className="text-zinc-400">Content-Type: application/json</div>
              <div className="text-zinc-400">X-Sovranly-Origin: client-applet-prod</div>
            </div>
            <p className="text-[11px] text-zinc-500">
              Rate limits are enforced at 2,000 requests per minute per creator API key. You can test your rate limits in the live simulator below.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'security-zero-trust',
      category: 'security',
      title: '5. Zero Trust Security & Anti-AI Scraping Defense',
      badge: 'C2PA & Watermarking',
      description: 'Detailed explanation of cryptographic provenance tags, defensive steganography, and public ledger verification.',
      tags: ['security', 'c2pa', 'anti-ai', 'steganography', 'zero trust'],
      content: (
        <div className="space-y-6 text-zinc-300 text-sm leading-relaxed">
          <p>
            AI training crawlers frequently vacuum creative works without compensating authors or honoring moral rights. Sovranly IP applies multi-layer defensive defenses:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-800 space-y-2">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                <h5 className="font-bold text-white text-xs uppercase">C2PA Manifest Ingestion</h5>
              </div>
              <p className="text-xs text-zinc-400">
                Embeds Coalition for Content Provenance and Authenticity (C2PA) cryptographic assertions directly inside MP3, WAV, and JPEG metadata. Any tampering immediately invalidates the manifest seal.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-800 space-y-2">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-violet-400" />
                <h5 className="font-bold text-white text-xs uppercase">Steganographic Watermarking</h5>
              </div>
              <p className="text-xs text-zinc-400">
                Inaudible frequency phase shifts and high-frequency pixel modulation encode creator IDs directly into the audio waveform or image canvas, surviving compression and re-encoding.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-2">
            <h5 className="font-bold text-white text-xs uppercase font-mono">Public Verification Endpoint</h5>
            <p className="text-xs text-zinc-400">
              Anyone can audit an asset’s genuine provenance without logging in by visiting:
            </p>
            <div className="bg-zinc-950 p-2.5 rounded-lg border border-zinc-850 font-mono text-xs text-cyan-300 flex items-center justify-between">
              <span>https://www.sovranlyip.com/verify/[assetId]</span>
              <Link href="/verify/sov-asset-101" className="text-xs text-zinc-400 hover:text-white flex items-center gap-1 font-sans">
                Sample Verify <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'legal-licensing-splits',
      category: 'legal',
      title: '6. Legal Compacts & Royalty Split Framework',
      badge: 'Legal & PRO Compliance',
      description: 'Understanding synchronization rights, writer vs. publisher shares, and legally binding digital covenants.',
      tags: ['legal', 'pro', 'royalties', 'splits', 'sync', 'compacts'],
      content: (
        <div className="space-y-6 text-zinc-300 text-sm leading-relaxed">
          <p>
            Sovranly IP was designed by creators, for creators, with total respect for global copyright law and Performing Rights Organizations (ASCAP, BMI, SESAC, PRS):
          </p>

          <div className="space-y-3">
            <div className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-800 flex items-start gap-3">
              <Scale className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h5 className="font-bold text-white text-xs uppercase">100% Creator Writer&apos;s Share Retention</h5>
                <p className="text-xs text-zinc-400">
                  Sovranly IP never takes your underlying writer&apos;s publishing copyright. When your music streams on broadcast television or radio, performance royalties flow 100% to your designated PRO account.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-800 flex items-start gap-3">
              <DollarSign className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h5 className="font-bold text-white text-xs uppercase">85 / 15 Upfront Sync Fee Division</h5>
                <p className="text-xs text-zinc-400">
                  When a licensee purchases a synchronization license via direct PayLink or crypto checkout, 85% goes directly to the creator without escrow delays. The remaining 15% covers merchant processing, hosting, and blockchain notarization.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-800 flex items-start gap-3">
              <FileText className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h5 className="font-bold text-white text-xs uppercase">Automated PDF Verification Certificates</h5>
                <p className="text-xs text-zinc-400">
                  Every license transaction generates an official, legally enforceable Certificate of Notarization containing asset fingerprint, licensee entity, territorial scope, and exact transaction timestamps.
                </p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'sdk-integration-webhooks',
      category: 'sdk',
      title: '7. SDKs, Code Samples & Webhook Integrations',
      badge: 'Developer Tooling',
      description: 'Quickly integrate Sovranly verification into external apps, DAW plugins, Discord bots, and storefronts.',
      tags: ['sdk', 'typescript', 'python', 'curl', 'webhooks'],
      content: (
        <div className="space-y-6 text-zinc-300 text-sm leading-relaxed">
          <p>
            Integrate Sovranly IP verification into your Next.js application, mobile app, or headless commerce storefront using simple HTTP or our TypeScript patterns:
          </p>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-white">TypeScript / Next.js Client Example</span>
              <button 
                onClick={() => copyToClipboard(`// Import Sovranly Verification helper
export async function verifyAssetFingerprint(assetId: string) {
  const res = await fetch(\`https://www.sovranlyip.com/api/assets?id=\${assetId}\`, {
    headers: { 'Accept': 'application/json' }
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.error);
  return data.asset;
}`, 'ts-sample')}
                className="flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 font-mono"
              >
                {copiedCodeId === 'ts-sample' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedCodeId === 'ts-sample' ? 'Copied' : 'Copy Code'}
              </button>
            </div>
            <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 font-mono text-xs text-zinc-300 overflow-x-auto">
              <pre>{`// Import Sovranly Verification helper
export async function verifyAssetFingerprint(assetId: string) {
  const res = await fetch(\`https://www.sovranlyip.com/api/assets?id=\${assetId}\`, {
    headers: { 'Accept': 'application/json' }
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.error);
  return data.asset;
}`}</pre>
            </div>
          </div>
        </div>
      )
    }
  ], [copiedCodeId]);

  const filteredSections = useMemo(() => {
    return docSections.filter(section => {
      const matchesCategory = selectedCategory === 'all' || section.category === selectedCategory;
      const matchesSearch = searchQuery.trim() === '' || 
        section.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        section.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        section.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery, docSections]);

  return (
    <div className="min-h-screen bg-black text-zinc-100 font-sans selection:bg-cyan-500/20 selection:text-cyan-300">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 w-[600px] h-[600px] bg-violet-500/5 rounded-full blur-[160px] pointer-events-none" />

      {/* Main Navigation Header */}
      <nav className="border-b border-zinc-900 bg-zinc-950/60 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-3 group">
              <SovranlyLogo size="sm" />
              <div className="flex flex-col">
                <span className="font-extrabold tracking-tight text-white leading-tight uppercase text-sm group-hover:text-cyan-300 transition-colors">
                  SOVRANLY IP
                </span>
                <span className="text-[10px] uppercase font-mono text-cyan-400 tracking-wider">
                  Developer Documentation
                </span>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <Button asChild variant="outline" className="border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-900 rounded-full text-xs hidden sm:flex">
              <Link href="/" className="flex items-center gap-1.5">
                <ArrowLeft className="w-3.5 h-3.5" /> Return Home
              </Link>
            </Button>
            <Button asChild variant="outline" className="border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-900 rounded-full text-xs hidden md:flex">
              <Link href="/wiki" className="flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-violet-400" /> Knowledge Wiki
              </Link>
            </Button>
            <Button asChild className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:brightness-110 text-white rounded-full text-xs font-semibold px-4 shadow-lg shadow-cyan-950/40">
              <Link href="/dashboard" className="flex items-center gap-1.5">
                Dashboard <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </Button>
            <PublicNavbarHamburger />
          </div>
        </div>
      </nav>

      {/* Documentation Hero Banner */}
      <header className="border-b border-zinc-900 bg-gradient-to-b from-zinc-950/80 to-black relative z-10 py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-6 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 text-xs font-mono uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            <span>Official Technical Documentation</span>
          </div>

          <div className="space-y-3 max-w-3xl">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
              Sovranly IP Protocol &amp; Developer Guides
            </h1>
            <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
              Complete architectural specifications, Solidity smart contracts, REST API endpoints, 
              and Zero Trust cryptographic verification guidelines for creators and engineers.
            </p>
          </div>

          {/* Quick Search Bar */}
          <div className="max-w-xl relative pt-2">
            <div className="relative flex items-center">
              <Search className="w-4 h-4 text-zinc-400 absolute left-4 pointer-events-none" />
              <Input
                type="text"
                placeholder="Search topics, smart contracts, API endpoints, or C2PA..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-11 pr-10 py-6 bg-zinc-900/80 border-zinc-800 text-white rounded-2xl placeholder:text-zinc-500 text-sm focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 shadow-inner"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 text-xs font-mono text-zinc-400 hover:text-white"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Documentation Body */}
      <main className="max-w-7xl mx-auto px-6 py-10 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Sidebar Category Filter & Topic Navigation */}
          <aside className="lg:col-span-3 space-y-4 lg:sticky lg:top-28">
            <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-900 space-y-3">
              <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 font-bold px-2">
                Documentation Categories
              </div>
              <div className="space-y-1">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                      selectedCategory === cat.id
                        ? 'bg-zinc-900 border border-cyan-500/30 text-white font-semibold shadow-sm'
                        : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/40'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      {cat.icon}
                      <span>{cat.label}</span>
                    </div>
                    {cat.count > 0 && (
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-900 text-zinc-500">
                        {cat.count}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Links Card */}
            <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-900 space-y-3">
              <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 font-bold px-2">
                Related Resources
              </div>
              <div className="space-y-1 text-xs">
                <Link 
                  href="/funnel/whitepaper" 
                  className="flex items-center justify-between p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-900/40"
                >
                  <span className="flex items-center gap-2">
                    <Cpu className="w-3.5 h-3.5 text-indigo-400" /> Technical Whitepaper
                  </span>
                  <ExternalLink className="w-3 h-3 text-zinc-600" />
                </Link>
                <Link 
                  href="/pricing" 
                  className="flex items-center justify-between p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-900/40"
                >
                  <span className="flex items-center gap-2">
                    <DollarSign className="w-3.5 h-3.5 text-emerald-400" /> Public Pricing (85/15)
                  </span>
                  <ExternalLink className="w-3 h-3 text-zinc-600" />
                </Link>
                <Link 
                  href="/terms" 
                  className="flex items-center justify-between p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-900/40"
                >
                  <span className="flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5 text-rose-400" /> Terms &amp; Sync Licenses
                  </span>
                  <ExternalLink className="w-3 h-3 text-zinc-600" />
                </Link>
                <Link 
                  href="/pitch-deck" 
                  className="flex items-center justify-between p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-900/40"
                >
                  <span className="flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-yellow-400" /> Investor Pitch Deck
                  </span>
                  <ExternalLink className="w-3 h-3 text-zinc-600" />
                </Link>
              </div>
            </div>
          </aside>

          {/* Right Main Content Area */}
          <div className="lg:col-span-9 space-y-12">

            {/* Live Interactive API Simulator / Sandbox */}
            <div id="interactive-api-runner">
              <ApiPlayground />
            </div>

            {/* Filtered Documentation Sections */}
            <div className="space-y-10">
              {filteredSections.length === 0 ? (
                <div className="p-12 text-center bg-zinc-950 rounded-2xl border border-zinc-900 space-y-3">
                  <HelpCircle className="w-8 h-8 text-zinc-600 mx-auto" />
                  <p className="text-white font-bold text-base">No documentation sections match &ldquo;{searchQuery}&rdquo;</p>
                  <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                    Try searching for broader keywords like &quot;hash&quot;, &quot;smart contracts&quot;, &quot;sync&quot;, or reset your category filter.
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => { setSelectedCategory('all'); setSearchQuery(''); }}
                    className="mt-2 text-xs border-zinc-800"
                  >
                    Reset Filter
                  </Button>
                </div>
              ) : (
                filteredSections.map((section) => (
                  <article 
                    key={section.id} 
                    id={section.id}
                    className="p-6 md:p-8 rounded-3xl bg-zinc-950 border border-zinc-900 space-y-6 scroll-mt-28"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-900 pb-5">
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-400">
                          {section.badge}
                        </span>
                        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-1">
                          {section.title}
                        </h2>
                      </div>
                      
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {section.tags.map((tag, tIdx) => (
                          <span key={tIdx} className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-900 text-zinc-400 border border-zinc-800">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    <p className="text-zinc-400 text-sm italic">
                      {section.description}
                    </p>

                    <div className="pt-2">
                      {section.content}
                    </div>
                  </article>
                ))
              )}
            </div>

            {/* Need Additional Support / Direct Founder Contact Card */}
            <div className="p-8 rounded-3xl bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 border border-zinc-800 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-cyan-400" />
                    Need Custom Enterprise SDK or Dedicated Integration?
                  </h3>
                  <p className="text-xs text-zinc-400 max-w-xl leading-relaxed">
                    Our engineering team assists record labels, indie game studios, and catalog aggregators with custom batch notarization pipelines and continuous webhook streaming.
                  </p>
                </div>
                <Button asChild className="bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs rounded-xl px-6 py-5 shrink-0 shadow-lg shadow-cyan-950/50">
                  <Link href="mailto:create@sovranlyip.com">
                    Contact Engineering
                  </Link>
                </Button>
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* Footer Element matching landing and wiki pages */}
      <footer className="border-t border-white/5 py-16 bg-zinc-950/40 relative z-10 flex flex-col items-center justify-center gap-8 text-center mt-12">
        <div className="w-full max-w-7xl px-6">
          <NewsletterSignup />
        </div>

        <div className="flex flex-col items-center gap-4">
          <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest font-black">
            Sovranly IP Sovereign Authority
          </div>
          <p className="text-xs text-zinc-500 max-w-md">
            Zero Trust Intellectual Property Architecture • Cryptographic Asset Provenance • Instant 85/15 Settlement
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-zinc-400 pt-2">
            <Link href="/" className="hover:text-white">Home</Link>
            <Link href="/about" className="hover:text-white">About</Link>
            <Link href="/wiki" className="hover:text-white">Knowledge Wiki</Link>
            <Link href="/pricing" className="hover:text-white">Pricing</Link>
            <Link href="/terms" className="hover:text-white">Terms of Service</Link>
            <Link href="/privacy" className="hover:text-white">Privacy Policy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
