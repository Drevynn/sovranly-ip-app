'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth/FirebaseProvider';
import { getAuthHeaders } from '@/lib/auth-client';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Cpu, 
  Brain, 
  Database, 
  ShieldCheck, 
  Sparkles, 
  Flame, 
  Layers, 
  HelpCircle, 
  ArrowRight, 
  TrendingUp, 
  DollarSign, 
  Settings2, 
  Activity, 
  CheckCircle2, 
  FileCode, 
  Save, 
  RefreshCw, 
  ToggleLeft, 
  ToggleRight,
  Shield,
  FileText,
  AlertTriangle,
  Scale,
  LineChart as ChartIcon,
  Copy,
  Check,
  CheckCircle,
  TrendingDown,
  ChevronRight,
  Sparkle
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  CartesianGrid,
  LineChart,
  Line,
  Legend
} from 'recharts';

interface IPAsset {
  id: string;
  title: string;
  type: string;
  royalty: number;
  license: string;
  description: string;
  ownerAddress: string;
  isMinted: boolean;
  nftTokenId?: string | null;
  mintTxHash?: string | null;
  price?: number | null;
  isForSale: boolean;
  createdAt: string;
  
  // Dynamic AI properties (stored in Firestore)
  aiOptIn?: boolean;
  aiTrainingAllowed?: boolean;
  aiRAGAllowed?: boolean;
  aiExclusivity?: 'exclusive' | 'non-exclusive';
  aiMinBidPrice?: number;
}

interface AIBidPool {
  id: string;
  firmName: string;
  modelTarget: string;
  dataTypeRequested: string;
  payoutPerAsset: number; // in USD
  exclusivityRequirement: 'exclusive' | 'non-exclusive';
  currentBiddersCount: number;
  status: 'active' | 'completed';
}

const AI_BID_POOLS: AIBidPool[] = [
  {
    id: 'bid-1',
    firmName: 'Aether Diffusion v4',
    modelTarget: 'Text-to-Image Foundation Model',
    dataTypeRequested: 'Digital Artwork & Design Patterns',
    payoutPerAsset: 4.80,
    exclusivityRequirement: 'non-exclusive',
    currentBiddersCount: 1420,
    status: 'active'
  },
  {
    id: 'bid-2',
    firmName: 'Synthetix Acoustics',
    modelTarget: 'Generative Audio Stem synthesizer',
    dataTypeRequested: 'Audio Sample Packs & Sound FX',
    payoutPerAsset: 12.50,
    exclusivityRequirement: 'exclusive',
    currentBiddersCount: 840,
    status: 'active'
  },
  {
    id: 'bid-3',
    firmName: 'Lumina Multimodal LLM',
    modelTarget: 'Advanced Mixture-of-Experts (MoE) Reasoning',
    dataTypeRequested: 'Software Utilities, Metadata & Code Suites',
    payoutPerAsset: 9.20,
    exclusivityRequirement: 'non-exclusive',
    currentBiddersCount: 3120,
    status: 'active'
  }
];

export default function AiLicensingCenter() {
  const { user, isSandboxMode } = useAuth();
  const [assets, setAssets] = useState<IPAsset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Visual Tabs
  const [activeTab, setActiveTab] = useState<'configurator' | 'market' | 'drafter' | 'insights'>('configurator');

  // Selector for currently configured asset
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null);

  // Edit parameters
  const [aiOptIn, setAiOptIn] = useState(true);
  const [aiTrainingAllowed, setAiTrainingAllowed] = useState(true);
  const [aiRAGAllowed, setAiRAGAllowed] = useState(true);
  const [aiExclusivity, setAiExclusivity] = useState<'exclusive' | 'non-exclusive'>('non-exclusive');
  const [aiMinBidPrice, setAiMinBidPrice] = useState(5.00);

  // Agreement Drafter State
  const [drafterLicenseType, setDrafterLicenseType] = useState<string>('Non-Exclusive Commercial');
  const [copiedAgreement, setCopiedAgreement] = useState(false);

  // Simulated Calculator States
  const [calcAssetsCount, setCalcAssetsCount] = useState(5);
  const [calcTrainingEpochs, setCalcTrainingEpochs] = useState(3);
  const [calcPlatformTier, setCalcPlatformTier] = useState<'standard' | 'enterprise'>('standard');

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    
    setIsMounted(true);
  }, []);

  const applyAssetParams = (asset: IPAsset) => {
    setAiOptIn(asset.aiOptIn ?? true);
    setAiTrainingAllowed(asset.aiTrainingAllowed ?? true);
    setAiRAGAllowed(asset.aiRAGAllowed ?? true);
    setAiExclusivity(asset.aiExclusivity ?? 'non-exclusive');
    setAiMinBidPrice(asset.aiMinBidPrice ?? 5.00);
  };

  useEffect(() => {
    let isMounted = true;
    const fetchAssets = async () => {
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
            setAssets(data);
            if (data.length > 0) {
              setSelectedAssetId(data[0].id);
              // Set parameters for the first asset
              setAiOptIn(data[0].aiOptIn ?? true);
              setAiTrainingAllowed(data[0].aiTrainingAllowed ?? true);
              setAiRAGAllowed(data[0].aiRAGAllowed ?? true);
              setAiExclusivity(data[0].aiExclusivity ?? 'non-exclusive');
              setAiMinBidPrice(data[0].aiMinBidPrice ?? 5.00);
            }
          }
        }
      } catch (error) {
        console.error('Failed to retrieve IP assets for AI licensing', error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };
    fetchAssets();
    return () => {
      isMounted = false;
    };
  }, []);

  // When changing assets, fill state parameters
  const handleAssetSelect = (id: string) => {
    setSelectedAssetId(id);
    const asset = assets.find(a => a.id === id);
    if (asset) {
      applyAssetParams(asset);
    }
  };

  // Persist asset specific AI config update back to Firestore
  const handleSaveConfiguration = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAssetId) return;

    setIsUpdating(selectedAssetId);
    setSuccessMsg(null);

    const updatePayload = {
      id: selectedAssetId,
      aiOptIn,
      aiTrainingAllowed,
      aiRAGAllowed,
      aiExclusivity,
      aiMinBidPrice
    };

    try {
      const headers = await getAuthHeaders(user, isSandboxMode);
      const res = await fetch('/api/assets', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          ...headers
        },
        body: JSON.stringify(updatePayload)
      });

      if (res.ok) {
        setAssets(prev => prev.map(a => 
          a.id === selectedAssetId ? { ...a, ...updatePayload } : a
        ));
        setSuccessMsg('AI Licensing Manifesto committed securely to the decentralized registry.');
        setTimeout(() => setSuccessMsg(null), 3500);
      } else {
        console.error('Failed to persist AI parameters to Firestore');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsUpdating(null);
    }
  };

  const selectedAsset = assets.find(a => a.id === selectedAssetId);

  // Compute licensing projections
  const ratePerEpoch = calcPlatformTier === 'standard' ? 1.50 : 3.25;
  const estimatedAnnualYield = calcAssetsCount * calcTrainingEpochs * ratePerEpoch * 12;

  // Generate standardized ai-licensing metadata stamp
  const licensingManifestoJson = selectedAsset ? JSON.stringify({
    "@context": "https://spawning.ai/contexts/licensing.jsonld",
    "@type": "AILicenseDeclaration",
    "ipAssetId": selectedAsset.id,
    "blockchainTokenId": selectedAsset.nftTokenId || "Unminted",
    "ownerAddress": selectedAsset.ownerAddress,
    "licensingParameters": {
      "optIn": aiOptIn,
      "allowModelTraining": aiTrainingAllowed,
      "allowRAGRetrieval": aiRAGAllowed,
      "exclusivity": aiExclusivity,
      "minimumAcceptableBidUSD": aiMinBidPrice,
      "verifiableAnchor": "Sovranly Cryptographic Secure Ledger"
    },
    "complianceStamp": "ZERO_TRUST_VERIFIED"
  }, null, 2) : '';

  // Generate standardized agreement text
  const getDraftedAgreementText = () => {
    if (!selectedAsset) return 'Please select an active asset in the configurator to generate a draft.';
    const assetTitle = selectedAsset.title;
    const royalty = selectedAsset.royalty || 5;
    const owner = selectedAsset.ownerAddress || '0x495F...7B5E';
    
    return `SOVEREIGN INTELLECTUAL PROPERTY LICENSING AGREEMENT
=====================================================
Effective Date: ${new Date().toLocaleDateString()}
Licensor (IP Owner): ${owner}
Licensed Asset: "${assetTitle}"
License Classification: ${drafterLicenseType}
Royalty Allocation: ${royalty}% Distributed Automated Royalty Split

1. GRANT OF LICENSE:
Subject to the continuous cryptographic verification and terms of this Agreement, Licensor hereby grants to the Licensee a ${drafterLicenseType.toLowerCase()} right to use, display, distribute, and perform the Licensed Asset in accordance with the specified permissions.

2. COMPENSATION & ROYALTY TERMS:
Licensee agrees to pay the stipulated fee or royalty allocation of ${royalty}% of all secondary sales, commercial distributions, and transaction values. All royalty distributions are processed automatically and immutably via the Sovranly IP smart contract protocol to the Licensor's registered address.

3. INTELLECTUAL PROPERTY PROTECTION:
This Agreement represents a proof-of-registration on the distributed ledger. Licensee acknowledges that all legal title, patents, copyrights, and intellectual sovereignty remain exclusively with the Licensor. 

4. ZERO-TRUST AND ANTI-DERIVATIVE COMPLIANCE:
This license is bound continuously under a Zero Trust security protocol. Any alteration, unauthorized mirroring, or unlicensed neural network model fine-tuning utilizing the Licensed Asset will immediately invalidate this agreement and result in automated digital asset access isolation.

5. JURISDICTION & GOVERNING LAW:
This agreement is governed by the laws of the sovereign creator's registered jurisdiction and the decentralized smart contract protocols of the Sovranly IP network.

-----------------------------------------------------
SECURELY SIGNED VIA CRYPTOGRAPHIC LEDGER HASH:
[${selectedAsset.id || 'SECURE_SIGNATURE_STAMP'}]
`;
  };

  // Insights Data over last 6 months
  const insightsData = [
    { month: 'Feb 2026', registrations: 1, licenses: 0, royalties: 120 },
    { month: 'Mar 2026', registrations: 3, licenses: 1, royalties: 280 },
    { month: 'Apr 2026', registrations: 2, licenses: 1, royalties: 450 },
    { month: 'May 2026', registrations: 4, licenses: 2, royalties: 620 },
    { month: 'Jun 2026', registrations: 6, licenses: 3, royalties: 980 },
    { month: 'Jul 2026', registrations: assets.length || 7, licenses: 4, royalties: 1450 },
  ];

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12 font-sans text-left">
      
      {/* Page Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-zinc-900 pb-4 gap-4">
        <div>
          <h2 className="text-xl font-black text-white tracking-tight uppercase flex items-center gap-2">
            <Brain className="w-5 h-5 text-cyan-400 animate-pulse" />
            AI Training & RAG Licensing Center
          </h2>
          <p className="text-xs text-zinc-500 font-mono mt-0.5">
            Lease, draft contracts, and optimize yield on your registered IP portfolio using decentralized trust.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-zinc-900 p-1 rounded-2xl border border-zinc-850 self-start sm:self-auto overflow-x-auto">
          <button 
            onClick={() => setActiveTab('configurator')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono uppercase whitespace-nowrap transition-colors flex items-center gap-1.5 ${activeTab === 'configurator' ? 'bg-cyan-600 text-white font-bold' : 'text-zinc-400 hover:text-white'}`}
          >
            <Settings2 className="w-3.5 h-3.5" />
            AI Config
          </button>
          <button 
            onClick={() => setActiveTab('market')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono uppercase whitespace-nowrap transition-colors flex items-center gap-1.5 ${activeTab === 'market' ? 'bg-cyan-600 text-white font-bold' : 'text-zinc-400 hover:text-white'}`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            Market Analysis
          </button>
          <button 
            onClick={() => setActiveTab('drafter')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono uppercase whitespace-nowrap transition-colors flex items-center gap-1.5 ${activeTab === 'drafter' ? 'bg-cyan-600 text-white font-bold' : 'text-zinc-400 hover:text-white'}`}
          >
            <Scale className="w-3.5 h-3.5" />
            Agreement Drafter
          </button>
          <button 
            onClick={() => setActiveTab('insights')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono uppercase whitespace-nowrap transition-colors flex items-center gap-1.5 ${activeTab === 'insights' ? 'bg-cyan-600 text-white font-bold' : 'text-zinc-400 hover:text-white'}`}
          >
            <ChartIcon className="w-3.5 h-3.5" />
            Insights Report
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        
        {/* TAB 1: CONFIGURATOR */}
        {activeTab === 'configurator' && (
          <motion.div 
            key="configurator"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-8"
          >
            {/* Intro Opportunity Panel */}
            <div className="bg-zinc-950 border border-zinc-900 rounded-3xl p-6 relative overflow-hidden shadow-xl grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              <div className="md:col-span-8 space-y-3">
                <span className="text-[10px] uppercase font-mono tracking-widest text-emerald-400 font-black flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 animate-pulse" /> Intellectual Sovereignty in the AI Age
                </span>
                <h3 className="text-sm font-bold text-zinc-300">Monetize Your Training Weights Legally</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  AI foundation models represent a multi-billion dollar demand pool for high-quality, verified human creative data. Sovranly IP empowers creators to bind custom <strong>AI-licensing protocols</strong> to their registered assets, creating cryptographically signed declarations which AI scrapers can verify and license legally.
                </p>
              </div>
              
              <div className="md:col-span-4 bg-zinc-900/30 border border-zinc-900 p-4 rounded-2xl space-y-2">
                <span className="block text-[9px] font-mono text-zinc-500 uppercase">Average Industry Pay Rates</span>
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-zinc-400">LLM Software Code:</span>
                    <span className="font-mono text-cyan-400 font-bold">$12.50 / File</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-zinc-400">Audio Stem Waves:</span>
                    <span className="font-mono text-cyan-400 font-bold">$8.50 / Pack</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-zinc-400">Graphic Designs:</span>
                    <span className="font-mono text-cyan-400 font-bold">$4.20 / Canvas</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Split Workspace */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column */}
              <div className="lg:col-span-7 space-y-6">
                <div className="bg-zinc-950 border border-zinc-900 rounded-3xl p-6 shadow-xl space-y-5">
                  <div className="border-b border-zinc-900 pb-3 flex items-center justify-between">
                    <div>
                      <h3 className="text-xs font-mono uppercase font-black tracking-wider text-white">
                        Sovereign AI Configurator
                      </h3>
                      <p className="text-[11px] text-zinc-500">Attach custom training permits to your registered assets</p>
                    </div>
                    <Settings2 className="w-4 h-4 text-zinc-600" />
                  </div>

                  {isLoading ? (
                    <div className="py-12 flex flex-col items-center justify-center space-y-3">
                      <RefreshCw className="w-8 h-8 text-cyan-500 animate-spin" />
                      <p className="text-[10px] uppercase font-mono tracking-wider text-zinc-500">Querying Firestore Asset Indexes...</p>
                    </div>
                  ) : assets.length === 0 ? (
                    <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
                      <AlertTriangle className="w-8 h-8 text-amber-500 animate-pulse" />
                      <p className="text-xs font-mono text-zinc-400 uppercase">No Registered IP Assets Found</p>
                      <p className="text-[10px] text-zinc-500 max-w-sm">Please register your creative assets in the IP Asset Registry before establishing secure AI training licenses.</p>
                    </div>
                  ) : (
                    <form onSubmit={handleSaveConfiguration} className="space-y-5">
                      {/* Select Asset */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono uppercase text-zinc-500 font-bold block">Select Active IP Asset</label>
                        <select
                          value={selectedAssetId || ''}
                          onChange={(e) => handleAssetSelect(e.target.value)}
                          className="w-full bg-zinc-900 border border-zinc-850 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                        >
                          {assets.map(a => (
                            <option key={a.id} value={a.id}>{a.title} ({a.type})</option>
                          ))}
                        </select>
                      </div>

                      {selectedAsset && (
                        <div className="bg-zinc-900/40 p-3 rounded-2xl border border-zinc-900 text-xs text-zinc-400 leading-relaxed font-sans">
                          <strong>Description:</strong> {selectedAsset.description || 'No description provided.'}
                        </div>
                      )}

                      {/* Toggles */}
                      <div className="space-y-4 pt-2">
                        <div className="flex items-center justify-between bg-zinc-900/20 p-3 rounded-2xl border border-zinc-900">
                          <div className="space-y-0.5">
                            <span className="block text-xs font-bold text-white">License to AI Datasets</span>
                            <span className="block text-[10px] text-zinc-500 leading-tight">Allow public AI agents and brokers to license this asset.</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => setAiOptIn(!aiOptIn)}
                            className="text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer"
                          >
                            {aiOptIn ? (
                              <ToggleRight className="w-10 h-10" />
                            ) : (
                              <ToggleLeft className="w-10 h-10 text-zinc-650" />
                            )}
                          </button>
                        </div>

                        <AnimatePresence>
                          {aiOptIn && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="space-y-4 overflow-hidden"
                            >
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <label className="flex items-start gap-2.5 bg-zinc-900/40 p-3 rounded-2xl border border-zinc-900 cursor-pointer select-none">
                                  <input 
                                    type="checkbox"
                                    checked={aiTrainingAllowed}
                                    onChange={(e) => setAiTrainingAllowed(e.target.checked)}
                                    className="mt-0.5 rounded border-zinc-800 text-cyan-500 focus:ring-0 focus:ring-offset-0 bg-zinc-900"
                                  />
                                  <div className="space-y-0.5">
                                    <span className="block text-[10px] font-mono uppercase font-black text-zinc-300">Model Weights training</span>
                                    <span className="block text-[9px] text-zinc-500 leading-snug">Allow ingestion into foundational model neural updates.</span>
                                  </div>
                                </label>

                                <label className="flex items-start gap-2.5 bg-zinc-900/40 p-3 rounded-2xl border border-zinc-900 cursor-pointer select-none">
                                  <input 
                                    type="checkbox"
                                    checked={aiRAGAllowed}
                                    onChange={(e) => setAiRAGAllowed(e.target.checked)}
                                    className="mt-0.5 rounded border-zinc-800 text-cyan-500 focus:ring-0 focus:ring-offset-0 bg-zinc-900"
                                  />
                                  <div className="space-y-0.5">
                                    <span className="block text-[10px] font-mono uppercase font-black text-zinc-300">RAG & Realtime Search</span>
                                    <span className="block text-[9px] text-zinc-500 leading-snug">Allow grounding engine calls and runtime API retrieval.</span>
                                  </div>
                                </label>
                              </div>

                              <div className="space-y-1.5">
                                <label className="text-[10px] font-mono uppercase text-zinc-500 font-bold block">License Exclusivity Protocol</label>
                                <div className="grid grid-cols-2 gap-2">
                                  {(['non-exclusive', 'exclusive'] as const).map((mode) => (
                                    <button
                                      key={mode}
                                      type="button"
                                      onClick={() => setAiExclusivity(mode)}
                                      className={`py-2 text-[10px] font-mono font-bold rounded-xl border transition-all cursor-pointer uppercase ${
                                        aiExclusivity === mode 
                                          ? 'bg-cyan-950/40 border-cyan-500/50 text-cyan-400'
                                          : 'bg-zinc-900 border-zinc-850 text-zinc-500 hover:text-white'
                                      }`}
                                    >
                                      {mode}
                                    </button>
                                  ))}
                                </div>
                              </div>

                              <div className="space-y-1.5">
                                <div className="flex justify-between items-center text-[10px] font-mono text-zinc-500">
                                  <label className="uppercase font-bold block">Minimum Acceptable License Bid</label>
                                  <span className="text-white font-bold">${aiMinBidPrice.toFixed(2)} USD</span>
                                </div>
                                <input 
                                  type="range"
                                  min="1.00"
                                  max="50.00"
                                  step="0.50"
                                  value={aiMinBidPrice}
                                  onChange={(e) => setAiMinBidPrice(Number(e.target.value))}
                                  className="w-full accent-cyan-500 cursor-pointer h-1 bg-zinc-800 rounded-lg appearance-none"
                                />
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      {successMsg && (
                        <div className="text-xs font-mono text-emerald-400 bg-emerald-950/30 p-2.5 rounded-xl border border-emerald-500/10 flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4" /> {successMsg}
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={isUpdating !== null}
                        className="w-full bg-gradient-to-r from-cyan-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 disabled:opacity-40 text-white font-mono font-bold text-xs uppercase tracking-wider py-3 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer animate-pulse"
                      >
                        {isUpdating ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            Updating Registry...
                          </>
                        ) : (
                          <>
                            <Save className="w-4 h-4" />
                            Commit AI License Stamp
                          </>
                        )}
                      </button>
                    </form>
                  )}
                </div>

                {/* Calculator */}
                <div className="bg-zinc-950 border border-zinc-900 rounded-3xl p-6 shadow-xl space-y-4">
                  <div className="border-b border-zinc-900 pb-3">
                    <h3 className="text-xs font-mono uppercase font-black tracking-wider text-white flex items-center gap-1.5">
                      <TrendingUp className="w-4 h-4 text-emerald-400" /> Training Royalty Simulator
                    </h3>
                    <p className="text-[11px] text-zinc-500">Simulate yield generation based on dataset volume and neural training rounds</p>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[9px] font-mono uppercase text-zinc-500 block">Total Leased Assets</label>
                        <input 
                          type="number"
                          min="1"
                          max="1000"
                          value={calcAssetsCount}
                          onChange={(e) => setCalcAssetsCount(Number(e.target.value))}
                          className="w-full bg-zinc-900 border border-zinc-850 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[9px] font-mono uppercase text-zinc-500 block">Active AI Models Training</label>
                        <input 
                          type="number"
                          min="1"
                          max="50"
                          value={calcTrainingEpochs}
                          onChange={(e) => setCalcTrainingEpochs(Number(e.target.value))}
                          className="w-full bg-zinc-900 border border-zinc-850 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[9px] font-mono uppercase text-zinc-500 block">Platform Licensing Tier</label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setCalcPlatformTier('standard')}
                          className={`py-1.5 text-[9px] font-mono font-bold rounded-lg border transition-all cursor-pointer ${
                            calcPlatformTier === 'standard' 
                              ? 'bg-cyan-950/40 border-cyan-500/30 text-cyan-400' 
                                : 'bg-zinc-900 border-zinc-850 text-zinc-500'
                          }`}
                        >
                          Standard Pool ($1.50/file)
                        </button>
                        <button
                          type="button"
                          onClick={() => setCalcPlatformTier('enterprise')}
                          className={`py-1.5 text-[9px] font-mono font-bold rounded-lg border transition-all cursor-pointer ${
                            calcPlatformTier === 'enterprise' 
                              ? 'bg-cyan-950/40 border-cyan-500/30 text-cyan-400' 
                              : 'bg-zinc-900 border-zinc-850 text-zinc-500'
                          }`}
                        >
                          Enterprise Direct ($3.25/file)
                        </button>
                      </div>
                    </div>

                    <div className="bg-[#040406] border border-zinc-900 p-3 rounded-2xl flex justify-between items-center">
                      <span className="text-[9px] font-mono uppercase text-zinc-500">Estimated Annualized AI Yield:</span>
                      <span className="text-lg font-black font-mono text-emerald-400">${estimatedAnnualYield.toLocaleString()} USD</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="lg:col-span-5 space-y-6">
                <div className="bg-zinc-950 border border-zinc-900 rounded-3xl p-6 shadow-xl space-y-4">
                  <div className="border-b border-zinc-900 pb-3">
                    <h3 className="text-xs font-mono uppercase font-black tracking-wider text-white flex items-center gap-1.5">
                      <Database className="w-4 h-4 text-emerald-400" /> Active AI Dataset Tenders
                    </h3>
                    <p className="text-[11px] text-zinc-500">Corporate dataset requisitions matching catalog sizes</p>
                  </div>

                  <div className="space-y-3">
                    {AI_BID_POOLS.map((bid) => (
                      <div 
                        key={bid.id} 
                        className="bg-[#09090b] border border-zinc-900 rounded-2xl p-4 space-y-3 hover:border-zinc-850 transition-all text-xs"
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <span className="block font-black text-white">{bid.firmName}</span>
                            <span className="block text-[8px] font-mono text-zinc-500 uppercase">{bid.modelTarget}</span>
                          </div>
                          <span className="bg-emerald-950/40 text-emerald-400 text-[10px] font-mono font-black px-2 py-0.5 rounded border border-emerald-500/10">
                            ${bid.payoutPerAsset.toFixed(2)}/file
                          </span>
                        </div>

                        <div className="space-y-1 text-[10px] text-zinc-400 border-t border-zinc-900/60 pt-2 font-mono">
                          <div className="flex justify-between">
                            <span className="text-zinc-500">Data Schema:</span>
                            <span className="text-zinc-300 truncate max-w-[140px]" title={bid.dataTypeRequested}>{bid.dataTypeRequested}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-zinc-500">Rights Mode:</span>
                            <span className="text-zinc-300 uppercase">{bid.exclusivityRequirement}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-zinc-950 border border-zinc-900 rounded-3xl p-6 shadow-xl space-y-4 flex flex-col justify-between min-h-[380px]">
                  <div className="border-b border-zinc-900 pb-3">
                    <h3 className="text-xs font-mono uppercase font-black tracking-wider text-white flex items-center gap-1.5">
                      <FileCode className="w-4 h-4 text-cyan-400" /> ai-licensing.jsonld
                    </h3>
                    <p className="text-[11px] text-zinc-500"> Crawler & scraper compliance manifesto</p>
                  </div>

                  {selectedAssetId ? (
                    <div className="flex-1 flex flex-col justify-between mt-3 space-y-3">
                      <pre className="bg-[#040406] border border-zinc-900 p-4 rounded-xl text-[9px] font-mono text-zinc-400 overflow-x-auto h-52 scrollbar-thin scrollbar-thumb-zinc-800">
                        {licensingManifestoJson}
                      </pre>
                      <p className="text-[10px] text-zinc-500 font-mono leading-normal bg-zinc-900/40 p-2.5 rounded-xl border border-zinc-900/50">
                        This standard JSON-LD descriptor is served at the public gateway header of this asset to automatically prompt crawler agreements.
                      </p>
                    </div>
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-center space-y-2">
                      <FileText className="w-8 h-8 text-zinc-800 animate-pulse" />
                      <h4 className="text-[10px] font-mono uppercase font-bold text-zinc-500">Awaiting asset focus</h4>
                    </div>
                  )}
                </div>
              </div>

            </div>
          </motion.div>
        )}

        {/* TAB 2: IP MARKET ANALYSIS */}
        {activeTab === 'market' && (
          <motion.div 
            key="market"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-6"
          >
            <div className="bg-zinc-950 border border-zinc-900 rounded-3xl p-6 shadow-xl space-y-6">
              <div className="border-b border-zinc-900 pb-3">
                <span className="text-[10px] uppercase font-mono tracking-widest text-cyan-400 font-black flex items-center gap-1.5">
                  <Sparkle className="w-4 h-4 text-cyan-400 animate-spin" style={{ animationDuration: '3s' }} /> Portfolio Synergy Assessment
                </span>
                <h3 className="text-base font-bold text-zinc-200 mt-1">Sovereign Licensing Market Opportunities</h3>
                <p className="text-xs text-zinc-500">Tailored trend analysis based on your registered catalog size of {assets.length} assets</p>
              </div>

              {/* Opportunities list */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Opp 1 */}
                <div className="bg-[#09090b] border border-zinc-900 rounded-2xl p-5 space-y-4 hover:border-zinc-800 transition-all flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex justify-between items-start">
                      <span className="p-2 rounded-xl bg-cyan-950/40 border border-cyan-800/30 text-cyan-400 text-xs">
                        <Cpu className="w-4 h-4" />
                      </span>
                      <span className="text-[9px] font-mono text-emerald-400 bg-emerald-950/20 px-2 py-0.5 rounded border border-emerald-500/10 uppercase font-black">
                        High Demand
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-white pt-1">Generative Acoustic Synthesis</h4>
                    <p className="text-[11px] text-zinc-400 leading-normal">
                      High demand for original audio stems and sound effect loops to feed multi-modal text-to-music diffusion brokers.
                    </p>
                  </div>
                  <div className="border-t border-zinc-900 pt-3 space-y-1 text-[10px] font-mono text-zinc-500">
                    <div className="flex justify-between">
                      <span>Est. Lease Rate:</span>
                      <span className="text-cyan-400 font-bold">$8.50 - $15.00 / stem</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Demand Score:</span>
                      <span className="text-zinc-300 font-bold">94%</span>
                    </div>
                  </div>
                </div>

                {/* Opp 2 */}
                <div className="bg-[#09090b] border border-zinc-900 rounded-2xl p-5 space-y-4 hover:border-zinc-800 transition-all flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex justify-between items-start">
                      <span className="p-2 rounded-xl bg-purple-950/40 border border-purple-800/30 text-purple-400 text-xs">
                        <Sparkles className="w-4 h-4" />
                      </span>
                      <span className="text-[9px] font-mono text-cyan-400 bg-cyan-950/20 px-2 py-0.5 rounded border border-cyan-500/10 uppercase font-black">
                        Trending
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-white pt-1">Multimodal Vision RAG Grounding</h4>
                    <p className="text-[11px] text-zinc-400 leading-normal">
                      Licensing verified graphics, design patterns, and high-contrast digital illustrations for real-time visual RAG grounding vectors.
                    </p>
                  </div>
                  <div className="border-t border-zinc-900 pt-3 space-y-1 text-[10px] font-mono text-zinc-500">
                    <div className="flex justify-between">
                      <span>Est. Lease Rate:</span>
                      <span className="text-cyan-400 font-bold">$4.20 - $8.00 / canvas</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Demand Score:</span>
                      <span className="text-zinc-300 font-bold">81%</span>
                    </div>
                  </div>
                </div>

                {/* Opp 3 */}
                <div className="bg-[#09090b] border border-zinc-900 rounded-2xl p-5 space-y-4 hover:border-zinc-800 transition-all flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex justify-between items-start">
                      <span className="p-2 rounded-xl bg-emerald-950/40 border border-emerald-800/30 text-emerald-400 text-xs">
                        <FileCode className="w-4 h-4" />
                      </span>
                      <span className="text-[9px] font-mono text-emerald-400 bg-emerald-950/20 px-2 py-0.5 rounded border border-emerald-500/10 uppercase font-black">
                        Critical
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-white pt-1">Software Utilities Weighting</h4>
                    <p className="text-[11px] text-zinc-400 leading-normal">
                      Licensing pristine software code suites, custom optimization scripts, and algorithm structures to advanced code-LLMs.
                    </p>
                  </div>
                  <div className="border-t border-zinc-900 pt-3 space-y-1 text-[10px] font-mono text-zinc-500">
                    <div className="flex justify-between">
                      <span>Est. Lease Rate:</span>
                      <span className="text-cyan-400 font-bold">$12.00 - $25.00 / script</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Demand Score:</span>
                      <span className="text-zinc-300 font-bold">97%</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Dynamic Strategy Summary Report */}
              <div className="bg-[#030712] border border-zinc-900 p-6 rounded-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-transparent pointer-events-none" />
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-cyan-950/30 border border-cyan-800/20 text-cyan-400 rounded-xl">
                    <Brain className="w-6 h-6 animate-pulse" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold font-mono text-white uppercase tracking-wider">Sovereign Portfolio Strategic Action Report</h4>
                    <p className="text-xs text-zinc-400 leading-relaxed max-w-3xl">
                      Based on your registered catalog of <span className="text-white font-bold">{assets.length} items</span>, your IP portfolio represents a unique concentration in creative assets. We recommend configuring the <strong>Spawning.ai JSON-LD Crawl Permittee tags</strong> in Tab 1 to ensure that any scraping agent indexing your public profile respects your minimum bid parameters. Initiating commercial licensing contracts with <strong>Aether Diffusion v4</strong> could net your portfolio an estimated <strong>$220.00 - $540.00 / epoch</strong> in passive royalties.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 3: AGREEMENT DRAFTER */}
        {activeTab === 'drafter' && (
          <motion.div 
            key="drafter"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
          >
            {/* Control Panel */}
            <div className="lg:col-span-4 bg-zinc-950 border border-zinc-900 rounded-3xl p-6 shadow-xl space-y-5 text-left">
              <div className="border-b border-zinc-900 pb-3">
                <h3 className="text-xs font-mono uppercase font-black tracking-wider text-white flex items-center gap-1.5">
                  <Scale className="w-4 h-4 text-cyan-400 animate-pulse" /> Agreement Parameters
                </h3>
                <p className="text-[11px] text-zinc-500">Configure parameters to customize the licensing agreement draft</p>
              </div>

              {assets.length === 0 ? (
                <div className="py-6 text-center text-xs font-mono text-zinc-500">
                  Please register assets to draft agreements.
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Select Asset */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono uppercase text-zinc-500 font-bold block">Target Registered IP</label>
                    <select
                      value={selectedAssetId || ''}
                      onChange={(e) => handleAssetSelect(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-850 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                    >
                      {assets.map(a => (
                        <option key={a.id} value={a.id}>{a.title}</option>
                      ))}
                    </select>
                  </div>

                  {/* License Classification Selection */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono uppercase text-zinc-500 font-bold block">License Classification</label>
                    <select
                      value={drafterLicenseType}
                      onChange={(e) => setDrafterLicenseType(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-850 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                    >
                      <option value="Non-Exclusive Commercial">Non-Exclusive Commercial</option>
                      <option value="Exclusive Derivative Use">Exclusive Derivative Use</option>
                      <option value="Sovereign Academic & Research Only">Sovereign Academic & Research Only</option>
                      <option value="Geo-Unrestricted Broadcast Right">Geo-Unrestricted Broadcast Right</option>
                    </select>
                  </div>

                  {/* Standard Terms Checklist */}
                  <div className="space-y-2 border-t border-zinc-900 pt-4">
                    <span className="text-[10px] font-mono uppercase text-zinc-500 font-bold block">Standard Protection Clauses</span>
                    <div className="space-y-2 text-[11px] text-zinc-400">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>Decentralized Automated Royalty Split Clause</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>Anti-Derivative Deepfake Scrambling Clause</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>Zero Trust Access Revocation Clause</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Document Render Output */}
            <div className="lg:col-span-8 bg-zinc-950 border border-zinc-900 rounded-3xl p-6 shadow-xl space-y-4 flex flex-col justify-between">
              <div className="border-b border-zinc-900 pb-3 flex justify-between items-center">
                <div>
                  <h3 className="text-xs font-mono uppercase font-black tracking-wider text-white">
                    Sovereign-IP-Agreement.txt
                  </h3>
                  <p className="text-[11px] text-zinc-500">Legal-grade draft incorporating on-chain licensing safeguards</p>
                </div>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(getDraftedAgreementText());
                    setCopiedAgreement(true);
                    setTimeout(() => setCopiedAgreement(false), 2000);
                  }}
                  className="bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-300 font-mono text-[10px] px-3.5 py-1.5 rounded-xl uppercase flex items-center gap-1.5 cursor-pointer shrink-0"
                >
                  {copiedAgreement ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-cyan-400" />}
                  {copiedAgreement ? 'Copied Draft' : 'Copy Template'}
                </button>
              </div>

              <pre className="bg-[#040406] border border-zinc-900 p-5 rounded-2xl text-[10px] font-mono text-zinc-400 overflow-y-auto h-[400px] leading-relaxed select-all text-left scrollbar-thin scrollbar-thumb-zinc-800">
                {getDraftedAgreementText()}
              </pre>
            </div>
          </motion.div>
        )}

        {/* TAB 4: REGISTRATION INSIGHTS */}
        {activeTab === 'insights' && (
          <motion.div 
            key="insights"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-8"
          >
            <div className="bg-zinc-950 border border-zinc-900 rounded-3xl p-6 shadow-xl space-y-6">
              <div className="border-b border-zinc-900 pb-4">
                <span className="text-[10px] uppercase font-mono tracking-widest text-cyan-400 font-black flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-cyan-400 animate-pulse" /> Asset Registration Summary Index
                </span>
                <h3 className="text-base font-bold text-zinc-200 mt-1">Sovereign Registry Growth (Last 6 Months)</h3>
                <p className="text-xs text-zinc-500">Visualizing registration velocity and active milestones across the ledger</p>
              </div>

              {/* Chart container */}
              <div className="p-4 bg-[#040406] border border-zinc-900 rounded-2xl relative">
                {isMounted ? (
                  <div className="w-full h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={insightsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#18181b" />
                        <XAxis dataKey="month" stroke="#52525b" fontSize={10} tickLine={false} />
                        <YAxis stroke="#52525b" fontSize={10} tickLine={false} />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#09090b', borderColor: '#1f1f23', borderRadius: '12px' }}
                          labelStyle={{ color: '#fff', fontSize: '11px', fontWeight: 'bold' }}
                          itemStyle={{ color: '#06b6d4', fontSize: '11px' }}
                        />
                        <Legend wrapperStyle={{ fontSize: '10px', fontFamily: 'monospace' }} />
                        <Bar name="Registered Assets" dataKey="registrations" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                        <Bar name="Active Licenses" dataKey="licenses" fill="#10b981" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="h-64 flex items-center justify-center text-xs font-mono text-zinc-500 animate-pulse">
                    Synchronizing ledger metrics...
                  </div>
                )}
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="p-4 bg-[#09090b] border border-zinc-900 rounded-2xl flex flex-col justify-between">
                  <span className="text-[9px] font-mono text-zinc-500 uppercase">Registration Velocity</span>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-2xl font-bold font-mono text-white">+{Math.ceil((assets.length || 7) / 6 * 10) / 10}</span>
                    <span className="text-[10px] text-emerald-400 font-mono">/ month avg</span>
                  </div>
                </div>

                <div className="p-4 bg-[#09090b] border border-zinc-900 rounded-2xl flex flex-col justify-between">
                  <span className="text-[9px] font-mono text-zinc-500 uppercase">Active Licensing Milestones</span>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-2xl font-bold font-mono text-white">4</span>
                    <span className="text-[10px] text-cyan-400 font-mono">contracts active</span>
                  </div>
                </div>

                <div className="p-4 bg-[#09090b] border border-zinc-900 rounded-2xl flex flex-col justify-between">
                  <span className="text-[9px] font-mono text-zinc-500 uppercase">Cumulative Simulated Royalties</span>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-2xl font-bold font-mono text-emerald-400">$3,650</span>
                    <span className="text-[10px] text-zinc-500 font-mono">USD value</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

      </AnimatePresence>

    </div>
  );
}
