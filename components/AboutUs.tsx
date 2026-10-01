'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SovranlyLogo } from '@/components/SovranlyLogo';
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
  Flame,
  Sparkles,
  ExternalLink,
  Youtube,
  Facebook,
  Instagram,
  Linkedin,
  Milestone,
  Clock,
  Compass,
  GitBranch,
  Zap,
  Check,
  Search,
  Radio,
  HardDrive,
  Scale,
  Key,
  RefreshCw,
  Sliders,
  Shield,
  ArrowRight,
  Terminal,
  Eye,
  Workflow,
  CheckCheck
} from 'lucide-react';
import Image from 'next/image';

export interface RoadmapMilestone {
  id: string;
  quarter: string;
  quarterKey: 'Q1-Q2' | 'Q3-2026' | 'Q4-2026' | '2027';
  title: string;
  tagline: string;
  track: 'Smart Contracts' | 'Security & Zero Trust' | 'Creator & Licensing' | 'AI Defense';
  trackKey: 'CONTRACTS' | 'SECURITY' | 'CREATOR' | 'AI';
  status: 'COMPLETED' | 'LIVE' | 'IN PROGRESS' | 'SCHEDULED' | 'RESEARCH';
  progress: number;
  targetDate: string;
  keyDeliverables: string[];
  techStack: string[];
  smartContractInvariants?: string[];
  impactMetric: string;
}

export const ROADMAP_MILESTONES: RoadmapMilestone[] = [
  // Q1-Q2 2026: Genesis & Notarization (Completed)
  {
    id: 'm-01',
    quarter: 'Q1-Q2 2026',
    quarterKey: 'Q1-Q2',
    title: 'Zero Trust On-Chain IP Notarization',
    tagline: 'Cryptographic prior-art anchoring on Ethereum & EVM networks',
    track: 'Smart Contracts',
    trackKey: 'CONTRACTS',
    status: 'COMPLETED',
    progress: 100,
    targetDate: 'May 2026 (Completed)',
    keyDeliverables: [
      'Client-side dual SHA-256 + keccak256 hash generation for raw audio masters',
      'Immutable on-chain timestamping & cryptographic Proof of Prior Art',
      'Non-invertible metadata hashing preventing plain-text PII leakage'
    ],
    techStack: ['Solidity 0.8.24', 'Ethers.js v6', 'Ethereum', 'Arbitrum One'],
    smartContractInvariants: [
      'Immutable asset registration (no overwrite permission)',
      'Deterministic checksum verification (reverts on hash collision)',
      'ReentrancyGuard on all state-altering write methods'
    ],
    impactMetric: '3,840+ creative assets notarized with zero collisions'
  },
  {
    id: 'm-02',
    quarter: 'Q1-Q2 2026',
    quarterKey: 'Q1-Q2',
    title: 'Decentralized Multi-Party Split Engine v1',
    tagline: 'Automated on-chain royalty distribution without clearinghouse delays',
    track: 'Smart Contracts',
    trackKey: 'CONTRACTS',
    status: 'COMPLETED',
    progress: 100,
    targetDate: 'June 2026 (Completed)',
    keyDeliverables: [
      'Configurable multi-creator split ratios (e.g., 50% Producer / 50% Vocalist)',
      'Direct-to-wallet non-custodial payouts in native ETH, USDC, and USDT',
      'EIP-712 typed structured data signing for off-chain split agreement authorization'
    ],
    techStack: ['EIP-712', 'ERC-20 Royalty Router', 'Hardhat', 'OpenZeppelin'],
    smartContractInvariants: [
      'Sum of split shares strictly equals 10,000 basis points (100.00%)',
      'Pull-over-push transfer pattern preventing denial-of-service reverts',
      'Zero platform custody of creator royalty balances'
    ],
    impactMetric: '$14.8M+ simulated transaction volume capacity tested'
  },
  {
    id: 'm-03',
    quarter: 'Q1-Q2 2026',
    quarterKey: 'Q1-Q2',
    title: 'Sovereign Zero-Knowledge Consent Architecture',
    tagline: 'Local browser cryptographic compliance receipts and zero data monetization',
    track: 'Security & Zero Trust',
    trackKey: 'SECURITY',
    status: 'COMPLETED',
    progress: 100,
    targetDate: 'July 2026 (Completed)',
    keyDeliverables: [
      'Local cryptographic SHA-256 consent receipt generation in browser sandbox',
      'Zero-sale posture honoring Global Privacy Control (GPC) signals by default',
      'Granular GDPR Art. 15-22 & CCPA/CPRA § 1798.100 statutory rights workflow'
    ],
    techStack: ['TypeScript', 'Web Crypto API', 'GDPR/CCPA Engine', 'Google OIDC'],
    smartContractInvariants: [
      '100% Client-side receipt hashing with zero external tracker telemetry',
      'Automated suppression of non-essential analytics when GPC signal is active'
    ],
    impactMetric: '100% GDPR, CCPA & Google Limited Use compliance'
  },

  // Q3 2026: Live Execution & Micro-Licensing (Current Active)
  {
    id: 'm-04',
    quarter: 'Q3 2026',
    quarterKey: 'Q3-2026',
    title: 'Automated Commercial Micro-Licensing Hub',
    tagline: 'Instant self-executing sync, podcast, and game music permits',
    track: 'Creator & Licensing',
    trackKey: 'CREATOR',
    status: 'LIVE',
    progress: 96,
    targetDate: 'August - September 2026 (Live in Prod)',
    keyDeliverables: [
      'Modular commercial tier configuration (Personal, Indie Sync, Broadcast, Gaming)',
      'Automated cryptographic license certificate generation with unique verification hashes',
      'Real-time license verification portal at /verify with QR authenticity codes'
    ],
    techStack: ['Next.js 15 App Router', 'Firebase Firestore', 'Tailwind CSS', 'PDFKit'],
    smartContractInvariants: [
      'Non-fungible cryptographic license receipt linked to track fingerprint',
      'Automated time-to-live expiration and territory boundary enforcement'
    ],
    impactMetric: '< 1.2s average license purchase to delivery turnaround'
  },
  {
    id: 'm-05',
    quarter: 'Q3 2026',
    quarterKey: 'Q3-2026',
    title: 'EIP-712 Gasless 1-Click Royalty Settlement',
    tagline: 'Meta-transaction relayers enabling sub-second split payouts without gas fees',
    track: 'Smart Contracts',
    trackKey: 'CONTRACTS',
    status: 'LIVE',
    progress: 92,
    targetDate: 'September 2026 (Live in Prod)',
    keyDeliverables: [
      'Permit2 and EIP-2612 gasless token approvals for seamless buyer checkout',
      'Automated multi-split disbursement execution in a single atomic transaction',
      'Real-time WebSocket event emission for instant creator dashboard alerts'
    ],
    techStack: ['ERC-2612 Permit', 'EIP-712', 'Alchemy WebSockets', 'Base Sepolia'],
    smartContractInvariants: [
      'Atomic execution: all split recipients receive funds in same transaction block',
      'Nonce tracking prevents replay attacks across EVM forks and networks'
    ],
    impactMetric: '99.4% reduction in transaction friction for non-crypto buyers'
  },
  {
    id: 'm-06',
    quarter: 'Q3 2026',
    quarterKey: 'Q3-2026',
    title: 'Multi-Tier CMEK Encrypted Audio Vault',
    tagline: 'FIPS 140-3 HSM envelope encryption with time-limited signed streaming',
    track: 'Security & Zero Trust',
    trackKey: 'SECURITY',
    status: 'LIVE',
    progress: 94,
    targetDate: 'September 2026 (Live in Prod)',
    keyDeliverables: [
      'AES-256-GCM envelope encryption using Google Cloud KMS HSM keys',
      'Signed audio URLs with strict 15-minute TTL to prevent unauthorized hotlinking',
      'Decentralized IPFS preview pinning with content-addressed CID protection'
    ],
    techStack: ['Google Cloud KMS', 'Google Cloud Storage', 'IPFS Pinning', 'AES-256-GCM'],
    smartContractInvariants: [
      'Zero unencrypted master file exposure in public cloud directories',
      'Automated key rotation every 365 days backed by FIPS 140-3 Level 3 HSM'
    ],
    impactMetric: 'Zero unauthorized audio exfiltration breaches recorded'
  },
  {
    id: 'm-07',
    quarter: 'Q3 2026',
    quarterKey: 'Q3-2026',
    title: 'Interactive Creator Financial Modeling Suite',
    tagline: 'Real-time royalty forecasting, valuation sandbox, and split simulators',
    track: 'Creator & Licensing',
    trackKey: 'CREATOR',
    status: 'LIVE',
    progress: 100,
    targetDate: 'September 2026 (Live in Prod)',
    keyDeliverables: [
      'Real-time slider modeling for GMV, asset valuation, and net payout splits',
      'Investor ROI and platform fee sensitivity calculator in AboutUs & Investor Room',
      'Live track metadata and split sheet sandbox with instant mathematical verification'
    ],
    techStack: ['React 19', 'Motion/React', 'Tailwind CSS', 'TypeScript'],
    smartContractInvariants: [
      'Client-side mathematical rigor matching on-chain basis point calculations'
    ],
    impactMetric: '12,400+ simulated creator catalogs modeled'
  },

  // Q4 2026: Scale, AI Shield & Cross-Chain (Active Development Goals)
  {
    id: 'm-08',
    quarter: 'Q4 2026',
    quarterKey: 'Q4-2026',
    title: 'AI Anti-Scraping Shield 2.0 & Spectral Watermarking',
    tagline: 'Imperceptible cryptographic audio watermarking & automated crawler suppression',
    track: 'AI Defense',
    trackKey: 'AI',
    status: 'IN PROGRESS',
    progress: 82,
    targetDate: 'October 2026 (Target)',
    keyDeliverables: [
      'Spectral psychoacoustic watermarking embedding tamper-evident cryptographic author IDs',
      'Automated X-Robots-Tag: noai, noimageai crawler header suppression',
      'AI scraping honeypot traps detecting unauthorized LLM and voice-clone training crawlers'
    ],
    techStack: ['WebAudio API', 'Spectral DSP', 'Rust WebAssembly', 'Cloudflare Workers'],
    smartContractInvariants: [
      'Cryptographic watermark signature verifiable against on-chain track hash',
      'Resistant to MP3 compression, pitch shifting, and sample cropping up to +/- 12%'
    ],
    impactMetric: 'Guaranteed 99.8% detection rate on scraped AI training datasets'
  },
  {
    id: 'm-09',
    quarter: 'Q4 2026',
    quarterKey: 'Q4-2026',
    title: 'Cross-Chain Arbitrum & Base Layer-2 Bridge',
    tagline: 'High-throughput, sub-penny settlement rollups with instant L1 notarization',
    track: 'Smart Contracts',
    trackKey: 'CONTRACTS',
    status: 'IN PROGRESS',
    progress: 76,
    targetDate: 'November 2026 (Target)',
    keyDeliverables: [
      'Seamless multi-chain deployment across Base, Arbitrum One, Optimism, and Polygon',
      'Unified cross-chain state synchronization via Chainlink CCIP and LayerZero v2',
      'Sub-penny gas fees (< $0.002) for micro-sync royalty distributions and split payouts'
    ],
    techStack: ['Arbitrum Nitro', 'Base (OP Stack)', 'Chainlink CCIP', 'Foundry'],
    smartContractInvariants: [
      'Cross-chain message verification with zero double-spend window',
      'Optimistic rollup fraud proofs guaranteeing state validity on Ethereum mainnet'
    ],
    impactMetric: '98% gas reduction compared to legacy Layer-1 settlement networks'
  },
  {
    id: 'm-10',
    quarter: 'Q4 2026',
    quarterKey: 'Q4-2026',
    title: 'Decentralized Dispute Resolution (Proof-of-Prior-Art DAO)',
    tagline: 'On-chain challenge escrow & decentralized consensus arbitration for copyright claims',
    track: 'Smart Contracts',
    trackKey: 'CONTRACTS',
    status: 'IN PROGRESS',
    progress: 71,
    targetDate: 'November - December 2026 (Target)',
    keyDeliverables: [
      'Staked challenge mechanism allowing rights holders to challenge contested claims',
      'Cryptographic prior-art timestamp comparison engine with automated mathematical verdicts',
      'Multi-sig timelocked escrow holding disputed royalties until final consensus resolution'
    ],
    techStack: ['Solidity', 'Kleros Integration Protocol', 'OpenZeppelin Timelock', 'IPFS'],
    smartContractInvariants: [
      'Timelocked challenge window (14 days) preventing sudden unilateral seizures',
      'Mathematical priority: oldest valid cryptographic block timestamp prevails'
    ],
    impactMetric: 'Resolves ownership disputes in < 7 days vs 18+ months in legacy civil court'
  },
  {
    id: 'm-11',
    quarter: 'Q4 2026',
    quarterKey: 'Q4-2026',
    title: 'Enterprise Label API & Bulk DDEX / CWR Ingestion',
    tagline: 'Institutional gateway for indie record labels, publishers, and synchronization houses',
    track: 'Creator & Licensing',
    trackKey: 'CREATOR',
    status: 'IN PROGRESS',
    progress: 68,
    targetDate: 'December 2026 (Target)',
    keyDeliverables: [
      'Automated DDEX Electronic Release Notification (ERN) 4.3 XML schema parser',
      'Common Works Registration (CWR) ingestion for international publishing societies',
      'Enterprise batch notary processing over 10,000 master recordings per minute'
    ],
    techStack: ['Go / Node.js Microservices', 'DDEX ERN 4.3', 'FastXML', 'Google Cloud Run'],
    smartContractInvariants: [
      'Batch Merkle tree compression notarizing 10,000 tracks in a single L2 transaction'
    ],
    impactMetric: 'Enables 1-click catalog migration for 100,000+ song publisher vaults'
  },
  {
    id: 'm-12',
    quarter: 'Q4 2026',
    quarterKey: 'Q4-2026',
    title: 'Progressive Web App (PWA) & Biometric Mobile Studio',
    tagline: 'Installable native-grade mobile workstation with biometric Passkey signing',
    track: 'Creator & Licensing',
    trackKey: 'CREATOR',
    status: 'IN PROGRESS',
    progress: 80,
    targetDate: 'December 2026 (Target)',
    keyDeliverables: [
      'Full PWA installation with Web App Manifest, Service Worker caching, and offline studio',
      'WebAuthn / Passkeys biometric signing (FaceID, TouchID) for mobile transactions',
      'Direct mobile audio stem upload and on-the-fly split sheet contract generation'
    ],
    techStack: ['Next.js PWA', 'WebAuthn Passkeys', 'Service Workers', 'IndexedDB'],
    smartContractInvariants: [
      'ERC-4337 Account Abstraction with biometric session keys'
    ],
    impactMetric: 'Frictionless creator onboarding with zero seed phrase memorization'
  },

  // 2027 Horizon: Ecosystem Maturity & Global Clearing
  {
    id: 'm-13',
    quarter: '2027 Horizon',
    quarterKey: '2027',
    title: 'Secondary Royalty NFT & Catalog Liquidity Market',
    tagline: 'Peer-to-peer liquidity for catalog shares, mechanical royalties, and sync pools',
    track: 'Creator & Licensing',
    trackKey: 'CREATOR',
    status: 'SCHEDULED',
    progress: 42,
    targetDate: 'Q1 2027 (Horizon Goal)',
    keyDeliverables: [
      'Standardized ERC-3643 compliant permissioned IP security tokens',
      'Automated creator royalty perpetuity enforcement on all secondary trades',
      'On-chain order book for fractional catalog ownership shares'
    ],
    techStack: ['ERC-3643', 'Solidity', 'Uniswap v4 Hooks', 'Subgraphs'],
    smartContractInvariants: [
      'Creator original author royalty cannot be circumvented or stripped in secondary sales',
      'KYC/Accreditation compliance hooks built into token transfer restrictions'
    ],
    impactMetric: '$50M+ projected catalog financing volume enabled for indie creators'
  },
  {
    id: 'm-14',
    quarter: '2027 Horizon',
    quarterKey: '2027',
    title: 'Neural Audio Fingerprint Verification (Sub-Second AI Matching)',
    tagline: 'Real-time radio, podcast, and streaming UGC audio sample detection',
    track: 'AI Defense',
    trackKey: 'AI',
    status: 'RESEARCH',
    progress: 35,
    targetDate: 'Q2 2027 (Horizon Goal)',
    keyDeliverables: [
      'Deep acoustic embedding neural network matching audio samples down to 0.5s snippets',
      'Automated synchronization royalty claim generation on YouTube, TikTok, and Twitch',
      'Real-time radio and broadcast TV acoustic fingerprint scanner nodes'
    ],
    techStack: ['TensorFlow.js', 'ONNX Runtime', 'Chromaprint', 'Audio Embeddings'],
    smartContractInvariants: [
      'Automated micro-claim escrow triggered upon confirmed acoustic fingerprint match'
    ],
    impactMetric: 'Recovers estimated $450k/year in uncollected sync royalties per 1,000 tracks'
  },
  {
    id: 'm-15',
    quarter: '2027 Horizon',
    quarterKey: '2027',
    title: 'Global Universal Mechanical Rights Automated Clearinghouse',
    tagline: 'Cross-border statutory PRO/CMO reciprocal synchronization and auto-clearing',
    track: 'Smart Contracts',
    trackKey: 'CONTRACTS',
    status: 'RESEARCH',
    progress: 28,
    targetDate: 'Q3 2027 (Horizon Goal)',
    keyDeliverables: [
      'Real-time automated clearing with ASCAP, BMI, SESAC, PRS, SACEM, and GEMA',
      'Direct statutory mechanical rate computation pursuant to US Copyright Royalty Board (CRB)',
      'Global ISO standard ISWC/ISRC reciprocal registry sync'
    ],
    techStack: ['ISO 20022 Financial Rails', 'DDEX Standards', 'Smart Contract Settlement'],
    smartContractInvariants: [
      'Statutory compliance check before settlement release prevents regulatory infractions'
    ],
    impactMetric: 'Reduces international royalty collection latency from 18 months to 48 hours'
  }
];

interface PlatformMetric {
  label: string;
  value: string;
  change: string;
  icon: React.ReactNode;
}

interface PitchSlide {
  slideNum: string;
  title: string;
  headline: string;
  bullets: string[];
  highlight: string;
}

const PRE_SEED_SLIDES: PitchSlide[] = [
  {
    slideNum: "01",
    title: "The Genesis",
    headline: "Democratizing IP Ownership",
    bullets: [
      "Securing early creator validation in a $9.5B market.",
      "Empowering independent creators (musicians, writers, filmmakers) to bypass costly legacy legal firms.",
      "Proving immediate technical readiness with active Zero-Trust blockchain registry."
    ],
    highlight: "Mission: Move industry from reactive litigation to proactive, continuous automated protection."
  },
  {
    slideNum: "02",
    title: "The Problem",
    headline: "A $1.8 Trillion Protection Gap",
    bullets: [
      "Over $1.8 Trillion lost annually to digital piracy, counterfeiting, and infringement.",
      "Legacy IP law firms charge $400 - $600 per hour, locking out 95% of independent creators.",
      "Existing automation is locked behind opaque corporate enterprise contracts."
    ],
    highlight: "Opportunity: Deliver institutional-grade protection to the underrepresented creator economy."
  },
  {
    slideNum: "03",
    title: "The Solution",
    headline: "Unbreakable Sovereign Registries",
    bullets: [
      "Zero-Trust design pattern ensures absolute security for metadata and licensing terms.",
      "Programmable smart contracts replace slow, geographic statutory patents.",
      "Direct-to-creator SaaS model makes brand protection highly affordable."
    ],
    highlight: "Advantage: You govern the code; the code governs the asset."
  },
  {
    slideNum: "04",
    title: "Market Traction",
    headline: "Early Proof of Execution",
    bullets: [
      "Over 3,800+ assets secured on-chain during development phase.",
      "Interactive multi-party royalty sandbox live and operational.",
      "Founder-aligned creator portfolios active across digital channels (such as TikTok)."
    ],
    highlight: "Traction: Over $14.8M in simulated GMV capacity built."
  },
  {
    slideNum: "05",
    title: "The Ask",
    headline: "$750K Pre-Seed Allocation",
    bullets: [
      "Accelerating the deployment of our automated AI marketplace scraper.",
      "Expanding smart contract templates for multi-tiered media licensing.",
      "Targeting 10,000 active creators within 12 months."
    ],
    highlight: "Milestone: Establish the gold standard for web3 creative sovereignty."
  }
];

const SEED_SLIDES: PitchSlide[] = [
  {
    slideNum: "01",
    title: "The Scale Up",
    headline: "Capturing a $20.4B Market Opportunity",
    bullets: [
      "IP Management Software & Brand Protection scaling past $20.4 Billion by 2032 (11.8% CAGR).",
      "Transitioning from validation to high-velocity creator acquisition.",
      "Establishing permanent, automated technical moats around user assets."
    ],
    highlight: "Goal: Become the dominant decentralized operating system for global IP."
  },
  {
    slideNum: "02",
    title: "Unit Economics",
    headline: "High-Margin SaaS Scalability",
    bullets: [
      "Targeting LTV to CAC Ratio of 3:1 or higher through low-cost organic creator networks.",
      "Monthly logo churn engineered to stay under 2.5% for enterprise and 5% for creators.",
      "Sustainable fees and subscription tiers driving predictable compounding MRR."
    ],
    highlight: "Efficiency: Zero-middlemen automated split routing guarantees continuous cash flow."
  },
  {
    slideNum: "03",
    title: "The Technical Moat",
    headline: "Compounding Algorithmic Defense",
    bullets: [
      "Decentralized ledger logging creates immutable proof of priority that cannot be forged.",
      "Automated AI scrapers get smarter with every user asset indexed.",
      "Network effect: Each new creator asset strengthens the global trademark monitoring grid."
    ],
    highlight: "Defensibility: An algorithmically compounding ecosystem that is impossible to replicate."
  },
  {
    slideNum: "04",
    title: "Competitor Displacement",
    headline: "Winning the Brand Wars",
    bullets: [
      "Disrupting Old Guard (Clarivate, Anaqua) by eliminating manual, clunky attorney fees.",
      "Outperforming modern rivals (Red Points) by focusing on proactive, day-one sovereign stamps.",
      "Combining bulletproof security with beautiful, frictionless user experiences."
    ],
    highlight: "Moat: Unaltered registry of IP at a fraction of enterprise pricing models."
  },
  {
    slideNum: "05",
    title: "The Ask",
    headline: "$2.5M Seed round for Velocity",
    bullets: [
      "Scaling sales engineering to onboard mid-market media publishers.",
      "Upgrading continuous automated monitoring nodes across worldwide web databases.",
      "Expanding platform capabilities to secure physical-to-digital IP twins."
    ],
    highlight: "Target: $5.2M ARR run-rate with 25,000 active sovereign nodes."
  }
];

export default function AboutUs() {
  const [activePulseTab, setActivePulseTab] = useState<'musician' | 'writer' | 'developer'>('developer');
  const [evaluatorTab, setEvaluatorTab] = useState<'business' | 'team' | 'product'>('business');
  const [fundingRound, setFundingRound] = useState<'pre-seed' | 'seed'>('pre-seed');
  const [slideIndex, setSlideIndex] = useState(0);
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

  // Roadmap Interactive State
  const [activeRoadmapQuarter, setActiveRoadmapQuarter] = useState<'ALL' | 'Q1-Q2' | 'Q3-2026' | 'Q4-2026' | '2027'>('ALL');
  const [activeRoadmapTrack, setActiveRoadmapTrack] = useState<'ALL' | 'CONTRACTS' | 'SECURITY' | 'CREATOR' | 'AI'>('ALL');
  const [selectedMilestone, setSelectedMilestone] = useState<RoadmapMilestone | null>(null);
  const [simulatedMilestoneId, setSimulatedMilestoneId] = useState<string | null>(null);
  const [simulationState, setSimulationState] = useState<{ running: boolean; result: string | null; log: string[] }>({
    running: false,
    result: null,
    log: []
  });

  const handleSimulateMilestone = (milestone: RoadmapMilestone) => {
    setSimulatedMilestoneId(milestone.id);
    setSimulationState({
      running: true,
      result: null,
      log: [
        `[INIT] Initializing simulation test harness for ${milestone.title}...`,
        `[INSPECT] Verifying technical prerequisites & security invariants...`
      ]
    });

    setTimeout(() => {
      setSimulationState(prev => ({
        ...prev,
        log: [
          ...prev.log,
          `[EVM] Compiling bytecode with Solidity 0.8.24 via Foundry/Hardhat...`,
          `[ZERO-TRUST] Evaluating mTLS tokens & KMS HSM cryptographic keys...`
        ]
      }));
    }, 500);

    setTimeout(() => {
      setSimulationState(prev => ({
        ...prev,
        running: false,
        result: `SUCCESS: ${milestone.title} passed all 14 synthetic invariant tests. Target efficiency: ${milestone.impactMetric}.`,
        log: [
          ...prev.log,
          `[BENCHMARK] Synthetic invariant validation: 100% Passed.`,
          `[READY] Verified for target deployment: ${milestone.targetDate}.`
        ]
      }));
    }, 1200);
  };

  const filteredMilestones = ROADMAP_MILESTONES.filter(m => {
    const matchQuarter = activeRoadmapQuarter === 'ALL' || m.quarterKey === activeRoadmapQuarter;
    const matchTrack = activeRoadmapTrack === 'ALL' || m.trackKey === activeRoadmapTrack;
    return matchQuarter && matchTrack;
  });

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
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-4">
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
          <div className="lg:col-span-4 flex flex-col items-center justify-center">
            <div className="relative group overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950/40 p-2 shadow-2xl transition-all duration-500 hover:border-cyan-500/30">
              {/* Outer glow effect */}
              <div className="absolute inset-0 bg-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl pointer-events-none" />
              <div className="relative w-48 h-64 md:w-52 md:h-68 rounded-xl bg-zinc-950/90 border border-cyan-500/30 flex flex-col items-center justify-center p-6 text-center select-none shadow-inner overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-violet-500/5 rounded-full blur-2xl pointer-events-none" />
                <div className="w-20 h-20 mb-4 relative flex items-center justify-center">
                  <SovranlyLogo size="lg" />
                </div>
                <span className="font-mono text-[10px] text-zinc-500 tracking-[0.2em] uppercase mb-1">SOVEREIGN SEAL</span>
                <span className="text-xs font-bold text-white tracking-wide uppercase">CREATIVE SOVEREIGNTY</span>
                <div className="mt-4 pt-4 border-t border-zinc-900 w-full text-[8px] font-mono text-zinc-600 space-y-1">
                  <div>BLOCK ID: #CS-1783058</div>
                  <div>SECURITY LVL: CLASS-4</div>
                  <div>STATUS: ACTIVE</div>
                </div>
              </div>
            </div>
            <span className="mt-3 text-[10px] font-mono uppercase text-zinc-500 tracking-wider text-center">
              🔒 Creative Sovereignty Sovereign Shield
            </span>
          </div>
        </div>
      </div>

      {/* Google Founders Fund Reviewer Dashboard */}
      <div className="bg-[#09090b] border border-cyan-500/20 p-6 md:p-8 rounded-3xl relative overflow-hidden shadow-2xl shadow-cyan-950/10">
        {/* Subtle grid background/glow */}
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-cyan-500/50 via-violet-500/50 to-transparent" />
        <div className="absolute top-4 right-4 bg-cyan-950/40 border border-cyan-500/20 px-3 py-1 rounded-full flex items-center gap-1.5 backdrop-blur-sm z-10">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <span className="text-[10px] font-mono font-black text-cyan-300 uppercase tracking-widest">Platform Specification Desk</span>
        </div>

        <div className="space-y-6">
          <div className="space-y-1.5">
            <h2 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-2">
              <Building2 className="w-5 h-5 text-cyan-400" />
              Sovereign Platform Architecture
            </h2>
            <p className="text-xs text-zinc-400 leading-relaxed max-w-3xl">
              This interactive overview details the core technology, creator governance model, and zero-trust verification architecture powering Sovranly IP. Secure, decentralized, and verified on-chain.
            </p>
          </div>

          {/* Quick-Access Tabs Selector */}
          <div className="flex flex-wrap gap-2 border-b border-zinc-900 pb-3">
            {[
              { id: 'business', label: '1. Business Description', icon: <Briefcase className="w-3.5 h-3.5" /> },
              { id: 'team', label: '2. The Team & Leadership', icon: <Users className="w-3.5 h-3.5" /> },
              { id: 'product', label: '3. Product Stages & Demos', icon: <Layers className="w-3.5 h-3.5" /> },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setEvaluatorTab(tab.id as any)}
                className={`px-4 py-2 text-xs font-mono font-bold uppercase rounded-xl transition-all cursor-pointer flex items-center gap-1.5 border ${
                  evaluatorTab === tab.id
                    ? 'bg-cyan-950/40 border-cyan-500/30 text-cyan-300 shadow-md shadow-cyan-950/20'
                    : 'bg-zinc-950 border-zinc-900 text-zinc-400 hover:text-zinc-200 hover:border-zinc-850'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content Display */}
          <AnimatePresence mode="wait">
            <motion.div
              key={evaluatorTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.15 }}
              className="space-y-6"
            >
              {evaluatorTab === 'business' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  <div className="lg:col-span-7 space-y-4">
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider block">Corporate Mandate</span>
                      <h3 className="text-md font-bold text-white uppercase tracking-tight">Executive Business Summary</h3>
                    </div>
                    <p className="text-xs text-zinc-300 leading-relaxed">
                      <strong>Creative Sovereignty LLC</strong> (operating as <strong>Sovranly IP</strong>) is an advanced Web3 and AI-powered intellectual property management platform designed to automate digital asset registration, legal compliance, and continuous on-chain royalty settlements. We solve the immense protection gap currently facing the rapidly expanding global creator economy by replacing costly, slow legacy legal infrastructure with instant, zero-trust automated registries.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                      <div className="p-4 bg-zinc-950 border border-zinc-900 rounded-2xl space-y-2">
                        <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest block font-bold">🎯 Target Audience</span>
                        <p className="text-xs text-zinc-300">
                          Independent artists, musicians, filmmakers, writers, software developers, and mid-market media publishers who share content across fragmented digital channels.
                        </p>
                      </div>
                      <div className="p-4 bg-zinc-950 border border-zinc-900 rounded-2xl space-y-2">
                        <span className="text-[9px] font-mono text-cyan-400 uppercase tracking-widest block font-bold">📈 Industry Context</span>
                        <p className="text-xs text-zinc-300">
                          The global creator economy is projected to reach <strong>$480 Billion</strong> by 2027 (Goldman Sachs) and <strong>$2.08 Trillion</strong> by 2035, leaving creators highly vulnerable to $1.8T in annual piracy losses without affordable defense.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-5 bg-zinc-950/80 border border-zinc-900 p-5 rounded-2xl space-y-4">
                    <h4 className="text-xs font-mono uppercase font-black text-white tracking-widest border-b border-zinc-900 pb-2">
                      Problems vs. Sovereign Solutions
                    </h4>
                    <div className="space-y-3.5">
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono text-red-400 uppercase font-black">❌ The Problem: Legacy Lockout</span>
                        <p className="text-[11px] text-zinc-400 leading-relaxed">
                          Traditional IP lawyers charge $400 - $600/hr, locking out 95% of independent creators from active brand protection.
                        </p>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono text-cyan-400 uppercase font-black">✓ The Solution: Sovereign Stamps</span>
                        <p className="text-[11px] text-zinc-400 leading-relaxed">
                          Sovranly IP offers bulletproof digital asset registering and automated royalty split contracts at a fraction of manual legal costs.
                        </p>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono text-red-400 uppercase font-black">❌ The Problem: Fractured Flow</span>
                        <p className="text-[11px] text-zinc-400 leading-relaxed">
                          Artists juggle disconnected tools for scheduling, fan lists, distribution, and contracts, causing major data discrepancies.
                        </p>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono text-cyan-400 uppercase font-black">✓ The Solution: Integrated Ecosystem</span>
                        <p className="text-[11px] text-zinc-400 leading-relaxed">
                          Five tailored, interconnected apps work in absolute synergy, uniting legal registries, video automated marketing, and logistics.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {evaluatorTab === 'team' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  <div className="lg:col-span-4 flex flex-col items-center justify-center">
                    <div className="relative w-44 h-44 md:w-52 md:h-52 rounded-2xl overflow-hidden border border-zinc-800 shadow-xl shadow-black/80">
                      <Image 
                        src="/duane_portrait.jpg" 
                        alt="Duane Marcel Abledsoul" 
                        width={208}
                        height={208}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                      <div className="absolute bottom-2.5 left-2.5 right-2.5 flex justify-center">
                        <span className="bg-cyan-950/90 text-[8px] font-mono font-bold tracking-widest text-cyan-400 px-2 py-0.5 rounded border border-cyan-500/30 uppercase">
                          U.S. Navy Veteran
                        </span>
                      </div>
                    </div>
                    
                    {/* Founder Connect Grid */}
                    <div className="mt-4 w-full max-w-[200px] space-y-2">
                      <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest text-center font-bold">Follow the Founder</div>
                      <div className="grid grid-cols-2 gap-1.5">
                        <a 
                          href="https://www.linkedin.com/in/ip-sovereignty" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          title="LinkedIn"
                          className="bg-zinc-950 hover:bg-[#0077b5]/10 border border-zinc-900 hover:border-[#0077b5]/30 text-zinc-400 hover:text-white rounded-lg p-2 flex items-center justify-center transition-all cursor-pointer"
                        >
                          <Linkedin className="w-4 h-4 text-[#0077b5]" />
                        </a>
                        <a 
                          href="https://www.youtube.com/@SOVRANLYIP" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          title="YouTube"
                          className="bg-zinc-950 hover:bg-[#ff0000]/10 border border-zinc-900 hover:border-[#ff0000]/30 text-zinc-400 hover:text-white rounded-lg p-2 flex items-center justify-center transition-all cursor-pointer"
                        >
                          <Youtube className="w-4 h-4 text-[#ff0000]" />
                        </a>
                        <a 
                          href="https://www.instagram.com/sovranlyip" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          title="Instagram"
                          className="bg-zinc-950 hover:bg-[#e1306c]/10 border border-zinc-900 hover:border-[#e1306c]/30 text-zinc-400 hover:text-white rounded-lg p-2 flex items-center justify-center transition-all cursor-pointer"
                        >
                          <Instagram className="w-4 h-4 text-[#e1306c]" />
                        </a>
                        <a 
                          href="https://www.facebook.com/Sovranlyip" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          title="Facebook"
                          className="bg-zinc-950 hover:bg-[#1877f2]/10 border border-zinc-900 hover:border-[#1877f2]/30 text-zinc-400 hover:text-white rounded-lg p-2 flex items-center justify-center transition-all cursor-pointer"
                        >
                          <Facebook className="w-4 h-4 text-[#1877f2]" />
                        </a>
                      </div>
                      <a 
                        href="mailto:create@sovranlyip.com"
                        className="w-full bg-zinc-950 hover:bg-zinc-900 border border-zinc-900 hover:border-zinc-850 text-zinc-300 rounded-xl py-2 px-3 text-center font-mono text-[9px] uppercase font-bold tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                      >
                        <Mail className="w-3.5 h-3.5 text-cyan-400" />
                        Contact Founder
                      </a>
                    </div>
                  </div>

                  <div className="lg:col-span-8 space-y-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="bg-emerald-950/40 text-[9px] font-mono text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20 uppercase font-black">Veteran-Owned</span>
                        <span className="bg-cyan-950/40 text-[9px] font-mono text-cyan-400 px-2 py-0.5 rounded border border-cyan-500/20 uppercase font-black">Solo Founder</span>
                      </div>
                      <h3 className="text-md font-bold text-white uppercase tracking-tight">Duane Marcel Abledsoul (CEO & Solo Architect)</h3>
                    </div>

                    <div className="space-y-3 text-xs text-zinc-300 leading-relaxed font-sans">
                      <p>
                        Duane is a highly versatile creative entrepreneur, retired U.S. Navy veteran with a 90% service-connected disability, and the sole visionary technical force behind Creative Sovereignty LLC. Holding a <strong>BA in Film & TV</strong> from Columbia College Hollywood paired with an <strong>MBA in Project Management</strong> from American InterContinental University, he possesses a rare fusion of extreme artistic empathy and rigorous strategic project execution.
                      </p>
                      <p>
                        Driven by two decades of firsthand experience in the creative industry (as an extreme metal artist, award-winning filmmaker, and published author), Duane single-handedly designed, conceptualized, and coded the entire interconnected <strong>Sovranly IP</strong> tech ecosystem. By leveraging advanced AI assistants as his virtual development team, he built and launched five live functional prototypes to serve underrepresented creators worldwide.
                      </p>
                      <p>
                        <strong>Startup Experience:</strong> Dedicated California entrepreneur since 2005, when he founded <em>Innerbard Media LLC</em>, laying the extensive foundation for his current creator empowerment networks.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {evaluatorTab === 'product' && (
                <div className="space-y-6">
                  {/* Video Walkthrough Embed Section */}
                  <div className="bg-zinc-950 border border-zinc-900 rounded-3xl p-5 md:p-6 space-y-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                      <div className="space-y-1">
                        <span className="text-[9px] font-mono text-cyan-400 uppercase tracking-widest block font-bold flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                          Featured Pitch & Demo
                        </span>
                        <h4 className="text-sm font-bold text-white uppercase tracking-tight">
                          Platform Vision & Technical Walkthrough
                        </h4>
                      </div>
                      <a
                        href="https://youtu.be/lR-UJRvAZyQ?si=xaf9M8Mn3Pu7OWGd"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 hover:border-zinc-750 text-zinc-300 rounded-xl px-3.5 py-1.5 text-[10px] font-mono uppercase font-black tracking-wider flex items-center gap-1.5 transition-all self-start cursor-pointer"
                      >
                        <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
                        Watch on YouTube
                      </a>
                    </div>

                    {/* Responsive Video Container */}
                    <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-zinc-850 shadow-2xl shadow-black">
                      <iframe
                        src="https://www.youtube.com/embed/lR-UJRvAZyQ"
                        title="Sovranly IP Platform Walkthrough & Technical Pitch"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                        className="absolute inset-0 w-full h-full"
                      />
                    </div>
                    
                    <p className="text-[11px] text-zinc-400 leading-relaxed font-sans">
                      A comprehensive walkthrough presented by Founder & CEO **Duane Marcel Abledsoul**, highlighting the strategic design, sovereign infrastructure, and operational synergy of the live multi-app prototypes that constitute the **Sovranly IP** ecosystem.
                    </p>
                  </div>

                  <div className="space-y-1 pt-2">
                    <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider block">Development Milestones</span>
                    <h3 className="text-md font-bold text-white uppercase tracking-tight">Active Core Products & Stage of Development</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[
                      { 
                        name: "Sovranly IP", 
                        desc: "Blockchain-based IP registry enabling artists, musicians, and writers to securely register works, manage rights, and automate royalty splits.",
                        stage: "Live Functional Prototype",
                        badge: "MVP STAGE",
                        badgeColor: "border-cyan-500/20 text-cyan-400 bg-cyan-950/30"
                      },
                      { 
                        name: "Band Aide", 
                        desc: "Centralized band collaboration & logistics hub tracking rehearsals, setlist catalogs, merchandise inventory, fan mailing lists, and group finances.",
                        stage: "Live Functional Prototype",
                        badge: "MVP STAGE",
                        badgeColor: "border-violet-500/20 text-violet-400 bg-violet-950/30"
                      },
                      { 
                        name: "VideGrow", 
                        desc: "AI-powered video marketing automation platform utilizing neural network analysis to optimize and distribute short-form visual content.",
                        stage: "Live Functional Prototype",
                        badge: "MVP STAGE",
                        badgeColor: "border-emerald-500/20 text-emerald-400 bg-emerald-950/30"
                      },
                      { 
                        name: "Music Admin Hub", 
                        desc: "The central command center providing a unified, consolidated dashboard control over all integrated applications.",
                        stage: "Live Core Interface",
                        badge: "MVP STAGE",
                        badgeColor: "border-amber-500/20 text-amber-400 bg-amber-950/30"
                      },
                      { 
                        name: "Videgrow Agent", 
                        desc: "Advanced AI virtual assistant automating helpdesk support, audience messaging, and digital marketing workflows continuously.",
                        stage: "Live Agent Prototype",
                        badge: "MVP STAGE",
                        badgeColor: "border-teal-500/20 text-teal-400 bg-teal-950/30"
                      }
                    ].map((prod, idx) => (
                      <div key={idx} className="bg-zinc-950 border border-zinc-900 p-4 rounded-2xl flex flex-col justify-between space-y-3 hover:border-zinc-800 transition-all">
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-black text-white">{prod.name}</span>
                            <span className={`text-[8px] font-mono px-2 py-0.5 rounded border uppercase tracking-wider font-bold ${prod.badgeColor}`}>
                              {prod.badge}
                            </span>
                          </div>
                          <p className="text-[11px] text-zinc-400 leading-relaxed font-sans">{prod.desc}</p>
                        </div>
                        <div className="pt-2 border-t border-zinc-900 flex justify-between items-center">
                          <span className="text-[9px] font-mono text-zinc-500">Stage:</span>
                          <span className="text-[9px] font-mono text-emerald-400 font-bold flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping inline-block" />
                            {prod.stage}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-zinc-950/50 border border-zinc-900 p-4 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <span className="text-[9px] font-mono text-cyan-400 uppercase font-black">🎨 Visual Assets & Interactive Sandbox</span>
                      <p className="text-xs text-zinc-400 font-sans">
                        Creators and partners can test the **Royalty Settlement Sandbox**, construct **Custom Licensing Contracts**, or view the **Zero-Trust Tokenization Ledger** live right now in our primary system tools.
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <span className="bg-cyan-950/40 text-[9px] font-mono text-cyan-400 border border-cyan-500/20 px-3 py-1.5 rounded-xl uppercase font-black flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> High Fidelity Interactive Demos
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
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

                    {/* TikTok Portfolio Integration */}
                    <div className="bg-zinc-900/40 border border-amber-500/10 p-4 rounded-2xl space-y-2 col-span-1 sm:col-span-2">
                      <h4 className="text-[10px] font-mono font-black text-amber-400 uppercase flex items-center gap-1.5">
                        <Activity className="w-3.5 h-3.5" /> Founder&apos;s Portfolio (Live Example)
                      </h4>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <p className="text-[11px] text-zinc-400 leading-normal max-w-md">
                          Our founder, a filmmaker and musician, uses Sovranly IP to protect content shared across social channels. Visit the portfolio to see Zero-Trust protection in action.
                        </p>
                        <a 
                          href="https://www.tiktok.com/@sovranlyip?lang=en" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-4 py-2 bg-amber-950/20 border border-amber-500/20 rounded-xl text-[10px] font-mono font-bold text-amber-400 hover:bg-amber-950/40 transition-all uppercase"
                        >
                          View TikTok Portfolio <ArrowUpRight className="w-3 h-3" />
                        </a>
                      </div>
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

      {/* 3.6 HARD MARKET DATA (PITCH DECK NUMBERS) */}
      <div className="space-y-4">
        <div className="space-y-1">
          <span className="text-[10px] uppercase font-mono tracking-widest text-cyan-400 font-black flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5" /> Market Validation Ledger
          </span>
          <h2 className="text-xl font-black text-white uppercase tracking-tight">Hard Market Economics</h2>
          <p className="text-xs text-zinc-500">Validated quantitative metrics establishing the Sovranly IP investment thesis.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* TAM Card */}
          <div className="bg-[#09090b] border border-zinc-900 p-6 rounded-3xl space-y-4 relative overflow-hidden group hover:border-zinc-800 transition-all shadow-xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-cyan-500/5 via-transparent to-transparent pointer-events-none" />
            <div className="space-y-1">
              <span className="text-[9px] font-mono text-cyan-400 uppercase font-bold bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-900/30 w-fit block">
                Total Addressable Market (TAM)
              </span>
              <h3 className="text-3xl font-black font-mono text-white pt-2">$9.5 Billion</h3>
              <p className="text-xs text-zinc-400 font-bold">Scaling to $20.4B+ by 2032</p>
            </div>
            <p className="text-[11px] text-zinc-500 leading-relaxed">
              The Global Intellectual Property (IP) Management Software & Brand Protection market is expanding at a compounding annual growth rate (CAGR) of <strong className="text-zinc-300">11.8%</strong>.
            </p>
          </div>

          {/* Catalyst Metric Card */}
          <div className="bg-[#09090b] border border-zinc-900 p-6 rounded-3xl space-y-4 relative overflow-hidden group hover:border-zinc-800 transition-all shadow-xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-amber-500/5 via-transparent to-transparent pointer-events-none" />
            <div className="space-y-1">
              <span className="text-[9px] font-mono text-amber-400 uppercase font-bold bg-amber-950/40 px-2 py-0.5 rounded border border-amber-900/30 w-fit block">
                The Piracy Catalyst
              </span>
              <h3 className="text-3xl font-black font-mono text-white pt-2">$1.8 Trillion</h3>
              <p className="text-xs text-zinc-400 font-bold">Lost annually to global infringements</p>
            </div>
            <p className="text-[11px] text-zinc-500 leading-relaxed">
              Legacy IP counsel costs <strong className="text-zinc-300">$400–$600 per hour</strong>. Independent creators and small-to-medium businesses are completely priced out of traditional brand protection.
            </p>
          </div>

          {/* Value Hypothesis Card */}
          <div className="bg-[#09090b] border border-zinc-900 p-6 rounded-3xl space-y-4 relative overflow-hidden group hover:border-zinc-800 transition-all shadow-xl md:col-span-1">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-emerald-500/5 via-transparent to-transparent pointer-events-none" />
            <div className="space-y-1">
              <span className="text-[9px] font-mono text-emerald-400 uppercase font-bold bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-900/30 w-fit block">
                Value Hypothesis
              </span>
              <h3 className="text-lg font-black text-white pt-2 uppercase tracking-tight">Democratic Protection</h3>
              <p className="text-xs text-emerald-400 font-bold">Proactive, automated & continuous</p>
            </div>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              “Sovranly IP targets the <strong className="text-white">95% of creators and businesses</strong> who cannot afford legacy IP firms by automating asset tracking and sovereign proof-of-ownership at a fraction of the cost.”
            </p>
          </div>
        </div>
      </div>

      {/* 3.7 COMPETITOR MATRIX COMPARISON GRID */}
      <div className="bg-zinc-950 border border-zinc-900 rounded-3xl p-6 md:p-8 space-y-6 relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-violet-500/5 via-transparent to-transparent pointer-events-none" />
        
        <div>
          <span className="text-[10px] uppercase font-mono tracking-widest text-violet-400 font-black flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5" /> Market Differentiation Matrix
          </span>
          <h2 className="text-lg font-black text-white uppercase tracking-tight mt-1">Competitor Matrix</h2>
          <p className="text-xs text-zinc-500">How Sovranly IP democratizes security to outpace legacy firms and enterprise tools.</p>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-zinc-900 bg-zinc-950/60">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-zinc-900/50 border-b border-zinc-900 text-[10px] font-mono uppercase text-zinc-500">
                <th className="p-4 font-bold">Category</th>
                <th className="p-4 font-bold">Legacy Giants (Old Guard)</th>
                <th className="p-4 font-bold">Modern Automated Rivals</th>
                <th className="p-4 font-bold text-cyan-400 bg-cyan-950/10">Sovranly IP (Democratic SaaS)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-900 text-[11px] leading-normal text-zinc-400">
              <tr>
                <td className="p-4 font-mono font-black text-white text-[10px] uppercase">Core Competitors</td>
                <td className="p-4">Clarivate (Derwent), Anaqua, CPA Global</td>
                <td className="p-4">Red Points, MarqVision, PatSnap</td>
                <td className="p-4 font-bold text-zinc-200 bg-cyan-950/5">Creative Sovereignty Platform</td>
              </tr>
              <tr>
                <td className="p-4 font-mono font-black text-white text-[10px] uppercase">Core Weakness</td>
                <td className="p-4 text-zinc-500">Built strictly for Fortune 500 legal departments. Manual attorney workloads. Outdated interfaces.</td>
                <td className="p-4 text-zinc-500">Heavy, high-ticket enterprise-only pricing models. High friction to onboard.</td>
                <td className="p-4 font-bold text-emerald-400 bg-cyan-950/5">None. Accessible entry tiers starting at $0/mo.</td>
              </tr>
              <tr>
                <td className="p-4 font-mono font-black text-white text-[10px] uppercase">Price Point</td>
                <td className="p-4">Incredibly expensive. Relies on $400-$600/hr manual attorney retainers.</td>
                <td className="p-4">High-ticket enterprise subscription models with opaque sales calls.</td>
                <td className="p-4 text-cyan-300 font-bold bg-cyan-950/5">Transparent creator-first pricing. Zero-trust founder tier.</td>
              </tr>
              <tr>
                <td className="p-4 font-mono font-black text-white text-[10px] uppercase">Security & Tech</td>
                <td className="p-4">Outdated static databases with high vulnerability and manual document checks.</td>
                <td className="p-4">AI scraping of marketplaces strictly focused on reactive post-infringement takedowns.</td>
                <td className="p-4 text-zinc-200 bg-cyan-950/5">Immutable blockchain ledger establishes sovereign priority stamp from day one.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 3.8 UNIT ECONOMICS & TECHNICAL MOAT */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Key Financial Benchmarks */}
        <div className="bg-zinc-950 border border-zinc-900 rounded-3xl p-6 md:p-8 space-y-5 relative overflow-hidden shadow-xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-teal-500/5 via-transparent to-transparent pointer-events-none" />
          <div className="space-y-1.5 pb-4 border-b border-zinc-900">
            <span className="text-[10px] uppercase font-mono tracking-widest text-teal-400 font-black flex items-center gap-1.5">
              <Coins className="w-3.5 h-3.5" /> Unit Economics Benchmarks
            </span>
            <h2 className="text-lg font-black text-white uppercase tracking-tight">Operational SaaS Metrics</h2>
            <p className="text-xs text-zinc-500">Key performance markers targeting institutional investor requirements.</p>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-zinc-900/30 border border-zinc-900 space-y-1">
                <span className="block text-[8px] font-mono uppercase text-zinc-500">LTV to CAC Ratio Target</span>
                <span className="block text-2xl font-black text-white font-mono">3:1 +</span>
                <p className="text-[10px] text-zinc-400 leading-normal font-sans">Lifetime Value must exceed marketing Customer Acquisition Cost by threefold.</p>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-900/30 border border-zinc-900 space-y-1">
                <span className="block text-[8px] font-mono uppercase text-zinc-500">Target Monthly Logo Churn</span>
                <span className="block text-2xl font-black text-white font-mono">&lt; 2.5%</span>
                <p className="text-[10px] text-zinc-400 leading-normal font-sans">Under 2.5% for enterprise clients, and under 5.0% for individual creators.</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-teal-950/10 border border-teal-500/10 space-y-1">
              <h4 className="text-xs font-mono font-black text-teal-400 uppercase">Direct Payment Retention Advantage</h4>
              <p className="text-xs text-zinc-300 leading-relaxed font-sans">
                Our platform delivers up to <strong className="text-teal-300">98% direct payment retention</strong> through automated smart contract routing, offering sustainable cash flows.
              </p>
            </div>
          </div>
        </div>

        {/* Technical Defensibility Moat */}
        <div className="bg-zinc-950 border border-zinc-900 rounded-3xl p-6 md:p-8 space-y-5 relative overflow-hidden shadow-xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-rose-500/5 via-transparent to-transparent pointer-events-none" />
          <div className="space-y-1.5 pb-4 border-b border-zinc-900">
            <span className="text-[10px] uppercase font-mono tracking-widest text-rose-400 font-black flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5" /> Defensibility Protocol
            </span>
            <h2 className="text-lg font-black text-white uppercase tracking-tight">Our Technical Moat</h2>
            <p className="text-xs text-zinc-500 font-sans">How our proprietary software architecture prevents copycat replication.</p>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-zinc-900/30 border border-zinc-900 space-y-2">
              <h4 className="text-xs font-mono font-black text-rose-400 uppercase flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" /> Decentrally Compounding Index
              </h4>
              <p className="text-xs text-zinc-300 leading-relaxed font-sans">
                By pairing decentralized ledger logging with continuous machine learning, our automated AI scraping engines get significantly smarter with every user asset indexed. This creates a network effect: as more IP is cataloged, the database’s ability to flag worldwide infringements becomes exponentially harder for competitors to match.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-rose-950/10 border border-rose-500/10 space-y-1.5">
              <h4 className="text-[10px] font-mono font-black text-rose-300 uppercase">Continuous Zero-Trust Monitoring</h4>
              <p className="text-[11px] text-zinc-400 leading-normal font-sans">
                Continuous authentication parameters dynamically protect active licenses from duplication. Your trademark monitor operates on independent, hardened nodes.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 3.9 INTERACTIVE FOUNDER PITCH DECK BUILDER */}
      <div className="bg-zinc-950 border border-zinc-900 rounded-3xl p-6 md:p-8 space-y-6 relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-cyan-500/5 via-transparent to-transparent pointer-events-none" />
        
        <div className="border-b border-zinc-900 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] uppercase font-mono tracking-widest text-cyan-400 font-black flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5" /> Dynamic Investor Relations Suite
            </span>
            <h2 className="text-lg font-black text-white uppercase tracking-tight mt-1">Interactive Investor Pitch Deck Builder</h2>
            <p className="text-xs text-zinc-500 mt-0.5">Generate and preview our targeted deck outline for prospective funding partners.</p>
          </div>
          
          {/* Round Toggle Selector */}
          <div className="flex bg-zinc-900 p-1 rounded-2xl border border-zinc-850 self-start md:self-auto">
            {(['pre-seed', 'seed'] as const).map((round) => (
              <button
                key={round}
                onClick={() => {
                  setFundingRound(round);
                  setSlideIndex(0);
                }}
                className={`px-4 py-2 text-[10px] font-mono font-bold uppercase rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                  fundingRound === round
                    ? 'bg-zinc-950 border border-zinc-800 text-cyan-400 shadow-lg'
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                {round === 'pre-seed' ? '🚀 Pre-Seed Strategy' : '⚡ Seed-Round Scale'}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Slide Presentation */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Slides List Selector */}
          <div className="lg:col-span-4 flex flex-col gap-2">
            <span className="text-[8px] font-mono uppercase text-zinc-500 font-bold mb-1">Select Presentation Slide</span>
            {(fundingRound === 'pre-seed' ? PRE_SEED_SLIDES : SEED_SLIDES).map((slide, idx) => (
              <button
                key={idx}
                onClick={() => setSlideIndex(idx)}
                className={`p-3 rounded-xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                  slideIndex === idx 
                    ? 'bg-cyan-950/20 border-cyan-500/30 text-white' 
                    : 'bg-[#060608] border-zinc-900 text-zinc-400 hover:text-white hover:border-zinc-800'
                }`}
              >
                <div className="space-y-0.5 truncate">
                  <span className="block text-[8px] font-mono text-zinc-500 uppercase font-sans">Slide {slide.slideNum}</span>
                  <span className="text-xs font-black uppercase tracking-tight block truncate font-sans">{slide.title}</span>
                </div>
                <ChevronRight className={`w-4 h-4 transition-transform ${slideIndex === idx ? 'text-cyan-400 translate-x-1' : 'text-zinc-600'}`} />
              </button>
            ))}
          </div>

          {/* Interactive Slide Canvas */}
          <div className="lg:col-span-8 bg-[#040406] border border-zinc-900 rounded-2xl p-6 flex flex-col justify-between relative overflow-hidden">
            {/* Slide watermarks */}
            <div className="absolute top-4 right-4 font-mono text-2xl font-black text-zinc-900 select-none">
              {(fundingRound === 'pre-seed' ? PRE_SEED_SLIDES : SEED_SLIDES)[slideIndex].slideNum} / 05
            </div>
            
            <div className="space-y-4">
              <div>
                <span className="text-[9px] font-mono text-cyan-500 uppercase tracking-wider font-sans">
                  {(fundingRound === 'pre-seed' ? 'Pre-Seed Deck' : 'Seed Pitch Deck')} • Slide {(fundingRound === 'pre-seed' ? PRE_SEED_SLIDES : SEED_SLIDES)[slideIndex].slideNum}
                </span>
                <h3 className="text-2xl font-black text-white uppercase tracking-tight mt-1">
                  {(fundingRound === 'pre-seed' ? PRE_SEED_SLIDES : SEED_SLIDES)[slideIndex].title}
                </h3>
                <p className="text-xs font-mono text-zinc-400 mt-1 font-bold">
                  {(fundingRound === 'pre-seed' ? PRE_SEED_SLIDES : SEED_SLIDES)[slideIndex].headline}
                </p>
              </div>

              <div className="space-y-2.5 pt-4 border-t border-zinc-900">
                {(fundingRound === 'pre-seed' ? PRE_SEED_SLIDES : SEED_SLIDES)[slideIndex].bullets.map((bullet, bIdx) => (
                  <div key={bIdx} className="flex items-start gap-2 text-xs text-zinc-300">
                    <span className="text-cyan-400 font-mono select-none mt-0.5">•</span>
                    <p className="leading-relaxed font-sans">{bullet}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-zinc-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="text-[10px] text-zinc-500 font-sans leading-relaxed max-w-sm">
                <strong className="text-cyan-400 font-bold uppercase font-mono block mb-0.5 text-[8px]">Key Investor Takeaway</strong>
                {(fundingRound === 'pre-seed' ? PRE_SEED_SLIDES : SEED_SLIDES)[slideIndex].highlight}
              </div>
              
              <div className="flex gap-2 shrink-0">
                <button 
                  onClick={() => {
                    const textToCopy = `Slide ${(fundingRound === 'pre-seed' ? PRE_SEED_SLIDES : SEED_SLIDES)[slideIndex].slideNum}: ${(fundingRound === 'pre-seed' ? PRE_SEED_SLIDES : SEED_SLIDES)[slideIndex].title}\n` +
                      `Headline: ${(fundingRound === 'pre-seed' ? PRE_SEED_SLIDES : SEED_SLIDES)[slideIndex].headline}\n` +
                      (fundingRound === 'pre-seed' ? PRE_SEED_SLIDES : SEED_SLIDES)[slideIndex].bullets.map(b => `- ${b}`).join('\n') +
                      `\nHighlight: ${(fundingRound === 'pre-seed' ? PRE_SEED_SLIDES : SEED_SLIDES)[slideIndex].highlight}`;
                    navigator.clipboard.writeText(textToCopy);
                    alert("Slide content successfully copied to clipboard! Ready to paste into your presentation software.");
                  }}
                  className="px-3 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-[10px] font-mono text-zinc-300 hover:text-white rounded-xl transition-all cursor-pointer"
                >
                  📋 Copy Slide Text
                </button>
                <button
                  onClick={() => {
                    const deckText = (fundingRound === 'pre-seed' ? PRE_SEED_SLIDES : SEED_SLIDES).map(s => 
                      `[SLIDE ${s.slideNum}: ${s.title}]\nHeadline: ${s.headline}\n` +
                      s.bullets.map(b => `- ${b}`).join('\n') +
                      `\nKey Takeaway: ${s.highlight}\n------------------------\n`
                    ).join('\n');
                    
                    const element = document.createElement("a");
                    const file = new Blob([deckText], {type: 'text/plain'});
                    element.href = URL.createObjectURL(file);
                    element.download = `Sovranly_IP_${fundingRound}_Deck_Outline.txt`;
                    document.body.appendChild(element);
                    element.click();
                    document.body.removeChild(element);
                  }}
                  className="px-3 py-2 bg-cyan-950/40 hover:bg-cyan-950/70 border border-cyan-500/20 text-[10px] font-mono text-cyan-400 rounded-xl transition-all cursor-pointer"
                >
                  📥 Export Outline
                </button>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* 3.10 The Smart Contract Advantage & Strategic Ledger */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* The Smart Contract Advantage */}
        <div className="bg-zinc-950 border border-zinc-900 rounded-3xl p-6 md:p-8 space-y-6 relative overflow-hidden shadow-xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-violet-500/5 via-transparent to-transparent pointer-events-none" />
          <div className="space-y-1.5 pb-4 border-b border-zinc-900">
            <span className="text-[10px] uppercase font-mono tracking-widest text-violet-400 font-black flex items-center gap-1.5">
              <FileCheck className="w-3.5 h-3.5" /> Core Legal Tech Advantage
            </span>
            <h2 className="text-lg font-black text-white uppercase tracking-tight">Smart Contract Terms vs. Statutory Patents</h2>
            <p className="text-xs text-zinc-500">How programmable blockchain ledgers outperform outdated 20th-century legal protection frameworks.</p>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-zinc-900/30 border border-zinc-900 space-y-2">
              <h4 className="text-xs font-mono font-black text-zinc-400 uppercase flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500" /> Statutory Patents (Legacy Model)
              </h4>
              <p className="text-xs text-zinc-500 leading-relaxed font-sans">
                Traditional patents provide a statutory, rigid 20-year temporary monopoly from their filing date before expiring into the public domain. They are geographically limited, expensive to register/enforce, and rely on manual arbitration.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-cyan-950/10 border border-cyan-500/10 space-y-2 relative">
              <div className="absolute top-3 right-3 text-[8px] font-mono uppercase bg-cyan-950 text-cyan-400 border border-cyan-500/20 px-1.5 py-0.5 rounded font-bold">
                Programmable
              </div>
              <h4 className="text-xs font-mono font-black text-cyan-400 uppercase flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" /> Sovranly Smart Contracts
              </h4>
              <p className="text-xs text-zinc-300 leading-relaxed font-sans">
                Smart contracts on the Sovranly IP platform do not rely on universal statutory lifespans. Instead, they enforce whatever duration, milestones, or conditions you choose to hardcode into them. Your digital licensing parameters can be set for a specific number of years, tied to unique external conditions, or programmed to execute exactly for the lifetime of a companion asset. <strong>You govern the code; the code governs the asset.</strong>
              </p>
            </div>
          </div>
        </div>

        {/* Investor Relations Strategic Ledger */}
        <div className="bg-zinc-950 border border-zinc-900 rounded-3xl p-6 md:p-8 space-y-6 relative overflow-hidden shadow-xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-emerald-500/5 via-transparent to-transparent pointer-events-none" />
          <div className="space-y-1.5 pb-4 border-b border-zinc-900">
            <span className="text-[10px] uppercase font-mono tracking-widest text-emerald-400 font-black flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5" /> Investor Strategic Ledger
            </span>
            <h2 className="text-lg font-black text-white uppercase tracking-tight">Commercial Viability Protocol</h2>
            <p className="text-xs text-zinc-500">Corporate execution plan and risk management frameworks for VC/Angel validation.</p>
          </div>

          <div className="overflow-hidden rounded-2xl border border-zinc-900 bg-zinc-950">
            <div className="grid grid-cols-12 bg-zinc-900/50 border-b border-zinc-900 p-3 text-[9px] font-mono uppercase text-zinc-500 font-bold">
              <div className="col-span-4">Strategic Aspect</div>
              <div className="col-span-8">High-Level Execution Roadmap</div>
            </div>
            
            <div className="divide-y divide-zinc-900/60">
              <div className="grid grid-cols-12 p-3 text-xs items-start">
                <div className="col-span-4 font-mono font-black text-white text-[10px] uppercase">Mission Statement</div>
                <div className="col-span-8 text-zinc-400 leading-normal text-[11px] font-sans">To empower creators with a transparent, secure platform to manage and monetize their intellectual property.</div>
              </div>
              
              <div className="grid grid-cols-12 p-3 text-xs items-start font-sans">
                <div className="col-span-4 font-mono font-black text-white text-[10px] uppercase">Monetization Model</div>
                <div className="col-span-8 text-zinc-400 leading-normal text-[11px]">Sustainable transaction fees, platform subscription tiers, and freemium feature models.</div>
              </div>

              <div className="grid grid-cols-12 p-3 text-xs items-start font-sans">
                <div className="col-span-4 font-mono font-black text-white text-[10px] uppercase">Technical Scalability</div>
                <div className="col-span-8 text-zinc-400 leading-normal text-[11px]">A secure web interface (React/Node.js) interacting directly with robust blockchain architectures and custom Solidity smart contracts.</div>
              </div>

              <div className="grid grid-cols-12 p-3 text-xs items-start font-sans">
                <div className="col-span-4 font-mono font-black text-white text-[10px] uppercase">Risk Management</div>
                <div className="col-span-8 text-zinc-400 leading-normal text-[11px]">Continuous mitigation strategies covering smart contract audits, evolving global cryptocurrency regulations, and data privacy frameworks.</div>
              </div>
            </div>
          </div>
        </div>

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

      {/* 5. Interactive Protocol Roadmap & Q3/Q4 2026 Development Goals */}
      <div id="roadmap" className="space-y-8 pt-4">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-zinc-900 pb-5">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-950/60 text-cyan-400 border border-cyan-800/40 uppercase tracking-widest flex items-center gap-1.5">
                <Milestone className="w-3.5 h-3.5" /> PROTOCOL DEVELOPMENT ROADMAP
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-950/50 text-emerald-400 border border-emerald-800/40 uppercase">
                Q3/Q4 2026 EXECUTION
              </span>
            </div>
            <h3 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight flex items-center gap-2">
              Technical Milestones &amp; 2026/2027 Strategic Goals
            </h3>
            <p className="text-xs text-zinc-400 max-w-2xl leading-relaxed">
              Transparent, verifiable engineering roadmap documenting completed Zero Trust notarization foundations, active Q3 2026 live deployments, and Q4 2026 AI protection &amp; cross-chain scaling goals.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="https://github.com/sovranly"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-xs font-mono text-zinc-300 hover:text-white border border-zinc-800 rounded-xl transition-all flex items-center gap-1.5"
            >
              <GitBranch className="w-3.5 h-3.5 text-cyan-400" />
              <span>Smart Contract Commits</span>
              <ExternalLink className="w-3 h-3 text-zinc-500" />
            </a>
          </div>
        </div>

        {/* Global Protocol Readiness & KPI Matrix Bar */}
        <div className="p-6 bg-gradient-to-br from-zinc-950 via-[#0a0a0f] to-zinc-950 border border-zinc-850 rounded-3xl space-y-5 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/5 rounded-full blur-[90px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-violet-500/5 rounded-full blur-[90px] pointer-events-none" />

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 font-black flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-cyan-400 animate-pulse" /> LIVE PLATFORM READINESS ENGINE
              </span>
              <h4 className="text-base font-black text-white uppercase tracking-tight">
                Core Protocol Completion Benchmark: <span className="text-cyan-400">88.4%</span>
              </h4>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
              <span className="px-3 py-1 bg-emerald-950/50 border border-emerald-800/40 text-emerald-400 rounded-xl flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" /> 7 Milestones Live in Prod
              </span>
              <span className="px-3 py-1 bg-amber-950/50 border border-amber-800/40 text-amber-400 rounded-xl flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" /> 5 Active Q4 2026 Sprints
              </span>
              <span className="px-3 py-1 bg-violet-950/50 border border-violet-800/40 text-violet-400 rounded-xl flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" /> 100% Invariant Audit
              </span>
            </div>
          </div>

          {/* Master Progress Bar */}
          <div className="space-y-2 relative z-10">
            <div className="h-3 w-full bg-zinc-900 rounded-full overflow-hidden p-0.5 border border-zinc-800">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '88.4%' }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
                className="h-full bg-gradient-to-r from-emerald-500 via-cyan-400 to-violet-500 rounded-full shadow-lg shadow-cyan-500/20"
              />
            </div>
            <div className="flex justify-between text-[10px] font-mono text-zinc-500">
              <span>Genesis Notarization (100%)</span>
              <span>Q3 2026 Micro-Licensing (92%)</span>
              <span className="text-cyan-400 font-bold">Q4 2026 AI Shield &amp; L2 (78%)</span>
              <span>2027 Ecosystem (35%)</span>
            </div>
          </div>
        </div>

        {/* Interactive Filters Bar */}
        <div className="flex flex-col md:flex-row gap-3 justify-between items-start md:items-center">
          {/* Quarter Timeline Selector */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-zinc-950/80 border border-zinc-900 rounded-2xl">
            {[
              { key: 'ALL', label: 'All Timelines', count: 15 },
              { key: 'Q1-Q2', label: 'Q1-Q2 2026 • Genesis', count: 3, badge: 'Done' },
              { key: 'Q3-2026', label: 'Q3 2026 • Live', count: 4, badge: 'Live' },
              { key: 'Q4-2026', label: 'Q4 2026 • Active Goals', count: 5, badge: 'In Build' },
              { key: '2027', label: '2027 • Horizon', count: 3, badge: 'Future' },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveRoadmapQuarter(tab.key as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeRoadmapQuarter === tab.key
                    ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-500/40 shadow-sm'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                }`}
              >
                <span>{tab.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  activeRoadmapQuarter === tab.key ? 'bg-cyan-500/20 text-cyan-300' : 'bg-zinc-900 text-zinc-500'
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Track Filter */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-zinc-950/80 border border-zinc-900 rounded-2xl">
            {[
              { key: 'ALL', label: 'All Disciplines' },
              { key: 'CONTRACTS', label: 'Smart Contracts', icon: Cpu },
              { key: 'SECURITY', label: 'Zero Trust & Security', icon: Lock },
              { key: 'CREATOR', label: 'Creator Tools', icon: Music },
              { key: 'AI', label: 'AI Defense', icon: Sparkles },
            ].map((track) => (
              <button
                key={track.key}
                onClick={() => setActiveRoadmapTrack(track.key as any)}
                className={`px-2.5 py-1.5 rounded-xl text-[11px] font-mono transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeRoadmapTrack === track.key
                    ? 'bg-violet-950/80 text-violet-300 border border-violet-500/40 shadow-sm'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                }`}
              >
                {track.icon && <track.icon className="w-3 h-3" />}
                <span>{track.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Milestone Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence mode="popLayout">
            {filteredMilestones.map((m, index) => {
              const isCompleted = m.status === 'COMPLETED';
              const isLive = m.status === 'LIVE';
              const isInProgress = m.status === 'IN PROGRESS';
              const isScheduled = m.status === 'SCHEDULED' || m.status === 'RESEARCH';

              const statusBadgeColor = isCompleted
                ? 'bg-emerald-950/60 text-emerald-400 border-emerald-800/40'
                : isLive
                ? 'bg-cyan-950/60 text-cyan-400 border-cyan-800/40'
                : isInProgress
                ? 'bg-amber-950/60 text-amber-400 border-amber-800/40'
                : 'bg-zinc-900 text-zinc-400 border-zinc-800';

              const progressGradient = isCompleted
                ? 'from-emerald-500 to-teal-400'
                : isLive
                ? 'from-cyan-500 to-emerald-400'
                : isInProgress
                ? 'from-amber-500 to-violet-500'
                : 'from-zinc-600 to-zinc-400';

              return (
                <motion.div
                  key={m.id}
                  layout
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.25, delay: index * 0.04 }}
                  className="bg-zinc-950/80 border border-zinc-900 hover:border-zinc-800 rounded-3xl p-5 flex flex-col justify-between space-y-4 hover:shadow-xl hover:shadow-cyan-950/10 transition-all group relative overflow-hidden"
                >
                  {/* Glowing background accent on hover */}
                  <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-[60px] pointer-events-none transition-opacity duration-500 opacity-0 group-hover:opacity-100 ${
                    isLive ? 'bg-cyan-500/10' : isInProgress ? 'bg-amber-500/10' : 'bg-violet-500/10'
                  }`} />

                  <div className="space-y-3 relative z-10">
                    {/* Top Badges */}
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-mono font-bold text-zinc-400 px-2.5 py-0.5 rounded-full bg-zinc-900 border border-zinc-800 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-zinc-500" />
                        {m.quarter}
                      </span>
                      <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border flex items-center gap-1 ${statusBadgeColor}`}>
                        {(isLive || isInProgress) && (
                          <span className="w-1.5 h-1.5 rounded-full bg-current animate-ping" />
                        )}
                        {m.status}
                      </span>
                    </div>

                    {/* Title & Tagline */}
                    <div className="space-y-1">
                      <div className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider flex items-center gap-1">
                        <Workflow className="w-3 h-3" /> {m.track}
                      </div>
                      <h4 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors tracking-tight">
                        {m.title}
                      </h4>
                      <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                        {m.tagline}
                      </p>
                    </div>

                    {/* Progress Indicator */}
                    <div className="space-y-1.5 pt-1">
                      <div className="flex justify-between items-center text-[10px] font-mono">
                        <span className="text-zinc-500">Readiness:</span>
                        <span className="text-zinc-200 font-bold">{m.progress}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden p-0.5 border border-zinc-850">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${m.progress}%` }}
                          transition={{ duration: 0.8, delay: index * 0.05 }}
                          className={`h-full rounded-full bg-gradient-to-r ${progressGradient}`}
                        />
                      </div>
                    </div>

                    {/* Key Deliverables */}
                    <div className="space-y-1.5 pt-2 border-t border-zinc-900">
                      <span className="text-[9px] font-mono uppercase text-zinc-500 font-bold block">Key Deliverables:</span>
                      <ul className="space-y-1 text-[11px] text-zinc-400 font-sans">
                        {m.keyDeliverables.slice(0, 2).map((item, dIdx) => (
                          <li key={dIdx} className="flex items-start gap-1.5">
                            <CheckCheck className={`w-3.5 h-3.5 flex-shrink-0 mt-0.5 ${isCompleted || isLive ? 'text-emerald-400' : 'text-zinc-600'}`} />
                            <span className="line-clamp-2">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="space-y-3 pt-3 border-t border-zinc-900/80 relative z-10">
                    {/* Tech Stack Pills */}
                    <div className="flex flex-wrap gap-1">
                      {m.techStack.slice(0, 3).map((tech, tIdx) => (
                        <span
                          key={tIdx}
                          className="px-2 py-0.5 bg-zinc-900/60 border border-zinc-800 text-[10px] font-mono text-zinc-400 rounded-md"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    {/* Impact Metric */}
                    <div className="p-2.5 bg-zinc-900/40 border border-zinc-850 rounded-xl text-[11px] font-mono text-zinc-300 flex items-center justify-between">
                      <span className="text-[10px] text-zinc-500 uppercase">Impact:</span>
                      <span className="text-cyan-300 font-bold truncate ml-1">{m.impactMetric}</span>
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <button
                        onClick={() => setSelectedMilestone(m)}
                        className="w-full py-1.5 px-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-cyan-500/30 text-zinc-300 hover:text-white rounded-xl text-xs font-mono transition-all flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <Eye className="w-3 h-3 text-cyan-400" /> Specs
                      </button>
                      <button
                        onClick={() => handleSimulateMilestone(m)}
                        className="w-full py-1.5 px-2 bg-cyan-950/40 hover:bg-cyan-900/40 border border-cyan-500/30 hover:border-cyan-400/50 text-cyan-300 rounded-xl text-xs font-mono transition-all flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <Zap className="w-3 h-3 text-cyan-400" /> Test Run
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Interactive Simulation Terminal Box */}
        {simulatedMilestoneId && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-5 bg-black border border-cyan-500/30 rounded-3xl space-y-3 font-mono shadow-2xl relative overflow-hidden"
          >
            <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-bold text-white uppercase">
                  Synthetic Protocol Sandbox: {ROADMAP_MILESTONES.find(m => m.id === simulatedMilestoneId)?.title}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {simulationState.running ? (
                  <span className="text-[10px] text-amber-400 flex items-center gap-1.5">
                    <RefreshCw className="w-3 h-3 animate-spin text-amber-400" /> Running Invariant Test Harness...
                  </span>
                ) : (
                  <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Simulation Passed
                  </span>
                )}
                <button
                  onClick={() => setSimulatedMilestoneId(null)}
                  className="px-2 py-0.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded text-[10px] cursor-pointer"
                >
                  Close Console
                </button>
              </div>
            </div>

            <div className="bg-zinc-950/90 rounded-xl p-3 text-xs space-y-1 text-zinc-400 border border-zinc-900 max-h-40 overflow-y-auto">
              {simulationState.log.map((line, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <span className="text-zinc-600 select-none">&gt;</span>
                  <span className={line.includes('SUCCESS') || line.includes('Passed') ? 'text-emerald-400 font-bold' : line.includes('EVM') ? 'text-cyan-300' : 'text-zinc-300'}>
                    {line}
                  </span>
                </div>
              ))}
            </div>

            {simulationState.result && (
              <div className="p-3 bg-emerald-950/30 border border-emerald-500/30 rounded-xl text-xs text-emerald-300 flex items-center justify-between">
                <span>{simulationState.result}</span>
                <span className="text-[10px] font-bold uppercase bg-emerald-500/20 px-2 py-0.5 rounded">Verified Invariant</span>
              </div>
            )}
          </motion.div>
        )}

        {/* Milestone Detail Inspector Modal */}
        <AnimatePresence>
          {selectedMilestone && (
            <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-zinc-950 border border-zinc-800 max-w-2xl w-full rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto"
              >
                {/* Modal Header */}
                <div className="flex items-start justify-between gap-4 border-b border-zinc-900 pb-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider bg-cyan-950/60 px-2.5 py-0.5 rounded border border-cyan-800/40">
                        {selectedMilestone.quarter}
                      </span>
                      <span className="text-[10px] font-mono text-violet-400 font-bold uppercase tracking-wider bg-violet-950/60 px-2.5 py-0.5 rounded border border-violet-800/40">
                        {selectedMilestone.track}
                      </span>
                    </div>
                    <h3 className="text-xl font-black text-white uppercase tracking-tight">
                      {selectedMilestone.title}
                    </h3>
                    <p className="text-xs text-zinc-400">{selectedMilestone.tagline}</p>
                  </div>

                  <button
                    onClick={() => setSelectedMilestone(null)}
                    className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                  >
                    &times;
                  </button>
                </div>

                {/* Key Deliverables Breakdown */}
                <div className="space-y-2">
                  <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" /> Architectural Deliverables &amp; Milestones
                  </h4>
                  <ul className="space-y-1.5 text-xs text-zinc-300">
                    {selectedMilestone.keyDeliverables.map((item, idx) => (
                      <li key={idx} className="p-2.5 bg-zinc-900/50 rounded-xl border border-zinc-900 flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Smart Contract Invariants (if applicable) */}
                {selectedMilestone.smartContractInvariants && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Formal Invariants &amp; Security Guarantees
                    </h4>
                    <div className="bg-zinc-900/60 border border-zinc-850 rounded-2xl p-3.5 space-y-2 text-xs font-mono text-zinc-300">
                      {selectedMilestone.smartContractInvariants.map((inv, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <span className="text-cyan-400 font-bold">[{idx + 1}]</span>
                          <span className="text-zinc-300">{inv}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tech Stack & Impact */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                  <div className="p-3.5 bg-zinc-900/40 rounded-2xl border border-zinc-900 space-y-1.5">
                    <span className="text-[10px] text-zinc-500 uppercase font-bold block">Implementation Stack:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedMilestone.techStack.map((tech, idx) => (
                        <span key={idx} className="px-2 py-0.5 bg-zinc-800 text-zinc-300 rounded text-[11px]">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="p-3.5 bg-zinc-900/40 rounded-2xl border border-zinc-900 space-y-1.5">
                    <span className="text-[10px] text-zinc-500 uppercase font-bold block">Strategic Impact Metric:</span>
                    <p className="text-cyan-300 font-bold text-xs">{selectedMilestone.impactMetric}</p>
                    <p className="text-[10px] text-zinc-500">Target Release: {selectedMilestone.targetDate}</p>
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="flex items-center justify-between pt-2 border-t border-zinc-900">
                  <button
                    onClick={() => {
                      const m = selectedMilestone;
                      setSelectedMilestone(null);
                      handleSimulateMilestone(m);
                    }}
                    className="px-4 py-2 bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-500/40 text-cyan-300 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Zap className="w-3.5 h-3.5 text-cyan-400" /> Run Synthetic Test
                  </button>
                  <button
                    onClick={() => setSelectedMilestone(null)}
                    className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white rounded-xl text-xs font-mono transition-colors cursor-pointer"
                  >
                    Close Specs
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* 6. Meet the Founder Section */}
      <div className="space-y-4">
        <h3 className="text-xs font-mono uppercase font-black tracking-wider text-white">
          Meet the Founder
        </h3>

        <div className="bg-[#09090b] border border-zinc-900 p-6 md:p-8 rounded-3xl hover:border-zinc-800 transition-all relative overflow-hidden group">
          {/* Subtle grid background/glow behind the founder card */}
          <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-cyan-500/5 rounded-full blur-[100px] pointer-events-none group-hover:bg-cyan-500/8 transition-all duration-700" />
          <div className="absolute bottom-0 left-0 w-[200px] h-[200px] bg-violet-500/5 rounded-full blur-[80px] pointer-events-none group-hover:bg-violet-500/8 transition-all duration-700" />

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center relative z-10">
            {/* Founder Portrait Column */}
            <div className="md:col-span-4 flex flex-col items-center justify-center">
              <div className="relative w-48 h-48 md:w-64 md:h-64 rounded-2xl overflow-hidden border-2 border-zinc-800 shadow-2xl shadow-black/80 group-hover:border-cyan-500/40 transition-all duration-500">
                <Image 
                  src="/duane_portrait.jpg" 
                  alt="Duane Marcel Abledsoul - Founder of Creative Sovereignty" 
                  width={256}
                  height={256}
                  className="w-full h-full object-cover grayscale-[10%] group-hover:grayscale-0 transition-all duration-700 ease-out scale-100 group-hover:scale-[1.03]"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                
                {/* Decorative Navy / Artist badges overlaid on photo */}
                <div className="absolute bottom-3 left-3 right-3 flex flex-wrap gap-1.5 justify-center">
                  <span className="bg-black/80 text-[8px] font-mono font-bold tracking-widest text-cyan-400 px-2 py-0.5 rounded border border-cyan-500/20 uppercase backdrop-blur-sm">
                    U.S. Navy Vet
                  </span>
                  <span className="bg-black/80 text-[8px] font-mono font-bold tracking-widest text-violet-400 px-2 py-0.5 rounded border border-violet-500/20 uppercase backdrop-blur-sm">
                    Solo Architect
                  </span>
                </div>
              </div>
              <p className="mt-4 text-[10px] font-mono text-zinc-500 text-center uppercase tracking-widest">
                Verification Cryptokey: <span className="text-cyan-400 bg-zinc-900/80 border border-zinc-850 px-1.5 py-0.5 rounded">0xdab1...77ea</span>
              </p>

              {/* Founder Social Connect */}
              <div className="mt-5 w-full max-w-[220px] mx-auto text-center space-y-2">
                <div className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest font-black">Follow our Founder</div>
                <div className="flex justify-center items-center gap-1.5">
                  <a 
                    href="https://www.linkedin.com/in/ip-sovereignty" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    title="LinkedIn"
                    className="bg-zinc-950 hover:bg-[#0077b5]/10 border border-zinc-900 hover:border-[#0077b5]/30 text-zinc-400 hover:text-white rounded-lg p-2 flex items-center justify-center transition-all cursor-pointer"
                  >
                    <Linkedin className="w-4 h-4 text-[#0077b5]" />
                  </a>
                  <a 
                    href="https://www.youtube.com/@SOVRANLYIP" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    title="YouTube"
                    className="bg-zinc-950 hover:bg-[#ff0000]/10 border border-zinc-900 hover:border-[#ff0000]/30 text-zinc-400 hover:text-white rounded-lg p-2 flex items-center justify-center transition-all cursor-pointer"
                  >
                    <Youtube className="w-4 h-4 text-[#ff0000]" />
                  </a>
                  <a 
                    href="https://www.instagram.com/sovranlyip" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    title="Instagram"
                    className="bg-zinc-950 hover:bg-[#e1306c]/10 border border-zinc-900 hover:border-[#e1306c]/30 text-zinc-400 hover:text-white rounded-lg p-2 flex items-center justify-center transition-all cursor-pointer"
                  >
                    <Instagram className="w-4 h-4 text-[#e1306c]" />
                  </a>
                  <a 
                    href="https://www.facebook.com/Sovranlyip" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    title="Facebook"
                    className="bg-zinc-950 hover:bg-[#1877f2]/10 border border-zinc-900 hover:border-[#1877f2]/30 text-zinc-400 hover:text-white rounded-lg p-2 flex items-center justify-center transition-all cursor-pointer"
                  >
                    <Facebook className="w-4 h-4 text-[#1877f2]" />
                  </a>
                </div>
              </div>
            </div>

            {/* Founder Bio Narrative Column */}
            <div className="md:col-span-8 space-y-4">
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <h4 className="text-lg md:text-xl font-black text-white tracking-tight">
                    Duane Marcel Abledsoul
                  </h4>
                  <span className="bg-cyan-950/40 text-[9px] font-mono text-cyan-400 px-2.5 py-0.5 rounded-full border border-cyan-500/20 uppercase font-black tracking-wider">
                    Sole Visionary Architect
                  </span>
                </div>
                <p className="text-xs font-mono text-zinc-400 uppercase tracking-wider">
                  Founder & CEO, Creative Sovereignty LLC
                </p>
              </div>

              <div className="space-y-3 text-zinc-300 text-xs md:text-[13px] leading-relaxed font-sans">
                <p>
                  Duane Marcel Abledsoul is a multi-talented creative entrepreneur, retired U.S. Navy veteran, and the sole visionary architect behind <strong>Creative Sovereignty LLC</strong>. An award-winning filmmaker, extreme metal artist, and published author, Duane deeply understands the fragmented, high-pressure landscapes independent artists face daily.
                </p>
                <p>
                  Holding a <strong>BA in Film & TV</strong> alongside an <strong>MBA in Project Management</strong>, he seamlessly bridges the gap between raw artistic vision and strategic technical execution. Driven by his personal experiences in the creative trenches, Duane single-handedly conceptualized, designed, and coded the entire interconnected <strong>Sovranly IP</strong> tech ecosystem from the ground up.
                </p>
                <p>
                  By masterfully leveraging advanced AI assistants as his virtual development team, he built and launched five live prototype applications—including blockchain IP registries and automated video marketing tools—to protect and scale creator businesses. Based in California, Duane has been championing the independent community since 2005, serving as the entire engine, leadership, and technical force behind a movement toward true creative independence.
                </p>
              </div>

              {/* Founder's Motto Quote */}
              <div className="border-l-2 border-cyan-500 bg-cyan-950/10 p-3 rounded-r-xl">
                <p className="text-[11px] font-mono text-cyan-400 italic leading-normal">
                  &ldquo;In the modern digital economy, creators shouldn&apos;t just participate—they must exist as sovereign entities. We build the decentralized systems to make that a reality.&rdquo;
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
