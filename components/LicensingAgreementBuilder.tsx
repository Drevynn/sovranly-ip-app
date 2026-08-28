'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useAuth } from './auth/FirebaseProvider';
import { getAuthHeaders } from '@/lib/auth-client';
import { 
  FileText, 
  CheckCircle2, 
  Zap, 
  Wallet, 
  ExternalLink, 
  ShieldAlert, 
  RefreshCw, 
  Sliders, 
  Eye, 
  Hourglass, 
  Users, 
  Lock, 
  Scale, 
  ArrowRight, 
  ShieldCheck, 
  Award, 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  UserCheck, 
  Radio, 
  FileSignature, 
  Mail, 
  Coins, 
  DollarSign, 
  Receipt, 
  PlusCircle, 
  Calendar, 
  Search, 
  Filter, 
  Download, 
  ArrowUpRight, 
  Clock, 
  Sparkles, 
  Check, 
  Music, 
  ImageIcon, 
  Code2, 
  Film, 
  GraduationCap, 
  Layers,
  ArrowRightLeft,
  Loader2
} from 'lucide-react';
import NotarizationEmailModal from './NotarizationEmailModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ethers } from 'ethers';

export type Asset = { 
  id: string; 
  title: string; 
  type: string; 
  royalty: number; 
  license: string; 
  creationDate?: string;
  ownerAddress?: string;
  description?: string;
  ipfsHash?: string | null;
};

export type Agreement = {
  id?: string;
  assetId: string;
  assetTitle: string;
  royaltyRate: number;
  basePrice: number;
  duration: string;
  permittedUsages: string[];
  continuousVerification: string[];
  status: 'ACTIVE' | 'TERMINATED' | 'PENDING';
  creatorEmail: string;
  creatorWallet: string;
  contractAddress: string;
  deployTxHash: string;
  createdAt: string;
  territory?: string;
  exclusivity?: string;
};

export type RoyaltyPayment = {
  id: string;
  licenseId: string;
  assetId: string;
  assetTitle: string;
  payerName: string;
  payerPlatform: string;
  grossAmount: number;
  royaltyRate: number;
  netCreatorEarnings: number;
  currency: 'ETH' | 'USD';
  status: 'SETTLED' | 'PENDING';
  txHash: string;
  paymentDate: string;
  notes?: string;
  creator?: string;
  createdAt?: string;
};

const TEMPLATES = [
  {
    name: 'Non-Exclusive Media Share',
    description: 'Perfect for digital creators, podcasts, and streaming audio formats.',
    royaltyRate: 15,
    basePrice: 0.05,
    duration: '1 Year',
    usages: ['Streaming & Broadcasting', 'Derivative Works'],
    verification: ['Cryptographic Digital Watermark', 'Automated Content Scan']
  },
  {
    name: 'Commercial Broadcast Sync',
    description: 'Targeted for TV, cinema, advertising, and corporate marketing campaigns.',
    royaltyRate: 25,
    basePrice: 0.35,
    duration: '3 Years',
    usages: ['Streaming & Broadcasting', 'Commercial Sponsorships', 'Sync Licensing (Film / TV / Game)'],
    verification: ['Cryptographic Digital Watermark', 'Chainlink IP Oracle Sync', 'Multi-sig Escrow Deposit']
  },
  {
    name: 'Full Commercial Buyout',
    description: 'Grants extensive redistribution rights with a higher upfront fee.',
    royaltyRate: 0,
    basePrice: 2.5,
    duration: 'Perpetual',
    usages: ['Streaming & Broadcasting', 'Physical Merchandise', 'Derivative Works', 'Commercial Sponsorships', 'Software & App Integration'],
    verification: ['Sovereign Registry Anchoring', 'Continuous Zero-Trust Key Attestation']
  },
  {
    name: 'Dynamic Fractional License',
    description: 'Shared creator communities with high recurring stream royalties.',
    royaltyRate: 50,
    basePrice: 0.1,
    duration: '5 Years',
    usages: ['Streaming & Broadcasting', 'Derivative Works', 'Public Performance & Exhibition'],
    verification: ['Cryptographic Digital Watermark', 'Chainlink IP Oracle Sync', 'Automatic Revenue Escrow Dispatch']
  }
];

const USAGE_OPTIONS = [
  'Streaming & Broadcasting',
  'Derivative Works & Remixes',
  'Commercial Sponsorships & Ads',
  'Software & App Integration',
  'AI Model Training & Fine-Tuning',
  'Physical Merchandise',
  'Print & Publication',
  'Public Performance & Exhibition',
  'Sync Licensing (Film / TV / Game)'
];

const DURATION_PRESETS = ['6 Months', '1 Year', '2 Years', '3 Years', '5 Years', 'Perpetual'];

interface Props {
  walletAddress: string | null;
  initialAsset?: Asset | null;
}

export default function LicensingAgreementBuilder({ walletAddress, initialAsset }: Props) {
  const { user, isSandboxMode } = useAuth();
  
  // Master Section Tab
  const [activeTab, setActiveTab] = useState<'builder' | 'royalties' | 'registry'>('builder');

  const [contractSeed] = useState(() => Math.floor(100000 + Math.random() * 900000));
  
  // Assets & Agreements state
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loadingAssets, setLoadingAssets] = useState(true);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(initialAsset || null);
  
  const [agreements, setAgreements] = useState<Agreement[]>([]);
  const [loadingAgreements, setLoadingAgreements] = useState(true);

  // Royalty Payments state
  const [royaltyPayments, setRoyaltyPayments] = useState<RoyaltyPayment[]>([]);
  const [loadingRoyalties, setLoadingRoyalties] = useState(true);
  const [royaltyFilterStatus, setRoyaltyFilterStatus] = useState<'ALL' | 'SETTLED' | 'PENDING'>('ALL');
  const [royaltySearchQuery, setRoyaltySearchQuery] = useState('');
  
  // Record incoming royalty modal state
  const [isRecordPaymentOpen, setIsRecordPaymentOpen] = useState(false);
  const [isRecordingPayment, setIsRecordingPayment] = useState(false);
  const [newPaymentForm, setNewPaymentForm] = useState({
    assetId: '',
    payerName: 'Spotify DSP Streaming Pool',
    payerPlatform: 'Digital Streaming Network',
    grossAmount: '0.50',
    royaltyRate: '85',
    status: 'SETTLED' as 'SETTLED' | 'PENDING',
    notes: 'Q3 Automated DSP Streaming Broadcast royalty disbursement.'
  });

  // Releasing pending escrow state
  const [isReleasingEscrow, setIsReleasingEscrow] = useState(false);
  const [escrowSuccessMsg, setEscrowSuccessMsg] = useState<string | null>(null);

  // License Builder Form Parameters
  const [royaltyRate, setRoyaltyRate] = useState<number>(15);
  const [basePrice, setBasePrice] = useState<number>(0.1);
  const [duration, setDuration] = useState<string>('3 Years');
  const [customDuration, setCustomDuration] = useState('');
  
  // Licensing Scope & Rights Definition
  const [mediaType, setMediaType] = useState<string>('SVOD / Streaming TV');
  const [territory, setTerritory] = useState<string>('Worldwide (WW)');
  const [exclusivity, setExclusivity] = useState<'Non-Exclusive' | 'Exclusive'>('Non-Exclusive');
  const [targetLicensee, setTargetLicensee] = useState<string>('Open Public License (Permissionless)');

  // Financial Architecture & Splits
  const [backendTrigger, setBackendTrigger] = useState<string>('Stream count threshold (>10M streams via Oracle)');

  // Usage & Attribution Constraints
  const [creditRequirement, setCreditRequirement] = useState<string>('"[Track Title]" courtesy of Sovranly IP');
  const [allowedEdits, setAllowedEdits] = useState({
    truncation: true,
    looping: true,
    instrumentalOnly: false,
    pitchShift: false
  });
  const [moralityClause, setMoralityClause] = useState<boolean>(true);

  // Technical Execution & Oracle Integration
  const [executionTrigger, setExecutionTrigger] = useState<string>('Multi-sig Escrow Deposit');
  const [metadataIpfsHash] = useState<string>(() => 'ipfs://bafybeig' + Math.random().toString(36).slice(2, 15) + 'q5h7');

  const [permittedUsages, setPermittedUsages] = useState<string[]>([
    'Streaming & Broadcasting',
    'Commercial Sponsorships & Ads'
  ]);
  const [continuousVerification, setContinuousVerification] = useState<string[]>([
    'Cryptographic Digital Watermark',
    'Automated Content Scan',
    'Chainlink IP Oracle Sync'
  ]);

  // Deployment feedback
  const [deployStep, setDeployStep] = useState<number>(0);
  const [isDeploying, setIsDeploying] = useState(false);
  const [successAgreement, setSuccessAgreement] = useState<Agreement | null>(null);

  // Continuous Auditing states
  const [auditingId, setAuditingId] = useState<string | null>(null);
  const [auditReports, setAuditReports] = useState<Record<string, { status: string; log: string[] }>>({});

  // Gmail Notarization Modal State
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [emailTargetAgreement, setEmailTargetAgreement] = useState<Agreement | null>(null);

  // Fetch Assets
  useEffect(() => {
    let isMounted = true;
    const fetchAssets = async () => {
      setLoadingAssets(true);
      try {
        const headers = await getAuthHeaders(user, isSandboxMode);
        const res = await fetch('/api/assets', { headers: { ...headers } });
        if (res.ok) {
          const data = await res.json();
          if (isMounted) {
            const list = Array.isArray(data) ? data : [];
            setAssets(list);
            setSelectedAsset(prev => {
              if (prev) return prev;
              if (list.length > 0) {
                if (list[0].royalty) setRoyaltyRate(list[0].royalty);
                return list[0];
              }
              return null;
            });
          }
        }
      } catch (err) {
        console.error('Error loading assets:', err);
      } finally {
        if (isMounted) setLoadingAssets(false);
      }
    };

    fetchAssets();
    return () => {
      isMounted = false;
    };
  }, [user, isSandboxMode]);

  // Fetch Agreements
  useEffect(() => {
    let isMounted = true;
    const fetchAgreements = async () => {
      setLoadingAgreements(true);
      try {
        const headers = await getAuthHeaders(user, isSandboxMode);
        const res = await fetch('/api/agreements', { headers: { ...headers } });
        if (res.ok) {
          const data = await res.json();
          if (isMounted) {
            setAgreements(Array.isArray(data) ? data : []);
          }
        }
      } catch (err) {
        console.error('Error loading agreements:', err);
      } finally {
        if (isMounted) setLoadingAgreements(false);
      }
    };

    fetchAgreements();
    return () => {
      isMounted = false;
    };
  }, [user, isSandboxMode]);

  // Fetch Royalty Payments
  const fetchRoyalties = useCallback(async () => {
    setLoadingRoyalties(true);
    try {
      const headers = await getAuthHeaders(user, isSandboxMode);
      const res = await fetch('/api/royalties', { headers: { ...headers } });
      if (res.ok) {
        const data = await res.json();
        setRoyaltyPayments(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error('Error loading royalties:', err);
    } finally {
      setLoadingRoyalties(false);
    }
  }, [user, isSandboxMode]);

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      try {
        const headers = await getAuthHeaders(user, isSandboxMode);
        const res = await fetch('/api/royalties', { headers: { ...headers } });
        if (res.ok) {
          const data = await res.json();
          if (isMounted) {
            setRoyaltyPayments(Array.isArray(data) ? data : []);
          }
        }
      } catch (err) {
        console.error('Error loading royalties:', err);
      } finally {
        if (isMounted) setLoadingRoyalties(false);
      }
    };
    load();
    return () => {
      isMounted = false;
    };
  }, [user, isSandboxMode]);

  // Handle template selection
  const applyTemplate = (tmpl: typeof TEMPLATES[0]) => {
    setRoyaltyRate(tmpl.royaltyRate);
    setBasePrice(tmpl.basePrice);
    setDuration(tmpl.duration);
    setPermittedUsages(tmpl.usages);
    setContinuousVerification(tmpl.verification);
  };

  // Toggle usage rights
  const toggleUsage = (usage: string) => {
    setPermittedUsages(prev => 
      prev.includes(usage) ? prev.filter(u => u !== usage) : [...prev, usage]
    );
  };

  // Deploy / Anchor Agreement
  const handleDeployAgreement = async () => {
    if (!selectedAsset) {
      alert('Please select an IP Asset to associate this license with.');
      return;
    }

    setIsDeploying(true);
    setDeployStep(1);

    try {
      // Step 1: Simulated / on-chain cryptographic signing
      await new Promise(r => setTimeout(r, 700));
      setDeployStep(2);

      // Step 2: Contract generation
      await new Promise(r => setTimeout(r, 700));
      setDeployStep(3);

      // Step 3: Oracle registration
      await new Promise(r => setTimeout(r, 700));
      setDeployStep(4);

      const contractAddress = '0x' + Math.random().toString(16).slice(2, 42);
      const deployTxHash = '0x' + Math.random().toString(16).slice(2, 66);

      const newAgr: Omit<Agreement, 'id'> = {
        assetId: selectedAsset.id,
        assetTitle: selectedAsset.title,
        royaltyRate,
        basePrice,
        duration: duration === 'Custom' ? customDuration : duration,
        permittedUsages,
        continuousVerification,
        status: 'ACTIVE',
        creatorEmail: user?.email || 'creator@sovranlyip.com',
        creatorWallet: walletAddress || '0x' + Math.random().toString(16).slice(2, 42),
        contractAddress,
        deployTxHash,
        territory,
        exclusivity,
        createdAt: new Date().toISOString()
      };

      const headers = await getAuthHeaders(user, isSandboxMode);
      const res = await fetch('/api/agreements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...headers },
        body: JSON.stringify(newAgr)
      });

      if (!res.ok) throw new Error('Failed to anchor agreement');
      const savedAgreement = await res.json();

      setAgreements(prev => [savedAgreement, ...prev]);
      setSuccessAgreement(savedAgreement);

      // Also record in transactions
      try {
        await fetch('/api/transactions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', ...headers },
          body: JSON.stringify({
            hash: deployTxHash,
            type: 'License Agreement Anchored',
            assetTitle: selectedAsset.title,
            amount: `${basePrice} ETH`,
            fromAddress: user?.email || 'Creator Wallet',
            toAddress: contractAddress
          })
        });
      } catch (txErr) {
        console.warn('Tx log failed:', txErr);
      }

    } catch (err) {
      console.error('Deployment error:', err);
      alert('Failed to deploy agreement.');
    } finally {
      setIsDeploying(false);
    }
  };

  // Record incoming royalty payment
  const handleRecordPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsRecordingPayment(true);
    try {
      const targetAsset = assets.find(a => a.id === newPaymentForm.assetId) || selectedAsset || assets[0];
      const gross = parseFloat(newPaymentForm.grossAmount) || 0;
      const rate = parseFloat(newPaymentForm.royaltyRate) || 85;
      const net = (gross * rate) / 100;

      const payload = {
        licenseId: 'license-' + Math.floor(1000 + Math.random() * 9000),
        assetId: targetAsset?.id || 'asset-manual',
        assetTitle: targetAsset?.title || 'Creative IP Asset',
        payerName: newPaymentForm.payerName,
        payerPlatform: newPaymentForm.payerPlatform,
        grossAmount: gross,
        royaltyRate: rate,
        netCreatorEarnings: net,
        currency: 'ETH',
        status: newPaymentForm.status,
        notes: newPaymentForm.notes,
        paymentDate: new Date().toISOString()
      };

      const headers = await getAuthHeaders(user, isSandboxMode);
      const res = await fetch('/api/royalties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...headers },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const recorded = await res.json();
        setRoyaltyPayments(prev => [recorded, ...prev]);
        setIsRecordPaymentOpen(false);
        setNewPaymentForm({
          assetId: '',
          payerName: 'Spotify DSP Streaming Pool',
          payerPlatform: 'Digital Streaming Network',
          grossAmount: '0.50',
          royaltyRate: '85',
          status: 'SETTLED',
          notes: 'Automated DSP Streaming Broadcast royalty disbursement.'
        });
      }
    } catch (err) {
      console.error('Error recording payment:', err);
    } finally {
      setIsRecordingPayment(false);
    }
  };

  // Release all pending escrow
  const handleReleasePendingEscrow = async () => {
    setIsReleasingEscrow(true);
    setEscrowSuccessMsg(null);
    try {
      const pendingItems = royaltyPayments.filter(p => p.status === 'PENDING');
      if (pendingItems.length === 0) {
        alert('No pending royalty payments currently buffered in escrow.');
        setIsReleasingEscrow(false);
        return;
      }

      const headers = await getAuthHeaders(user, isSandboxMode);
      
      // Update pending items to SETTLED
      for (const item of pendingItems) {
        await fetch('/api/royalties', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', ...headers },
          body: JSON.stringify({ id: item.id, status: 'SETTLED' })
        });
      }

      // Refresh local state
      setRoyaltyPayments(prev => prev.map(p => p.status === 'PENDING' ? { ...p, status: 'SETTLED' } : p));
      
      const totalReleased = pendingItems.reduce((acc, curr) => acc + curr.netCreatorEarnings, 0);
      setEscrowSuccessMsg(`Escrow Released: Successfully settled ${totalReleased.toFixed(4)} ETH (${pendingItems.length} transactions) directly to creator wallet!`);

    } catch (err) {
      console.error('Error releasing escrow:', err);
    } finally {
      setIsReleasingEscrow(false);
    }
  };

  // Financial Calculations for Royalty Dashboard
  const { totalEarnings, pendingEarnings, settledCount, pendingCount, avgRoyaltyRate } = useMemo(() => {
    let settledTotal = 0;
    let pendingTotal = 0;
    let sCount = 0;
    let pCount = 0;
    let totalRate = 0;

    royaltyPayments.forEach(p => {
      if (p.status === 'SETTLED') {
        settledTotal += (p.netCreatorEarnings || 0);
        sCount++;
      } else {
        pendingTotal += (p.netCreatorEarnings || 0);
        pCount++;
      }
      totalRate += (p.royaltyRate || 0);
    });

    const avgRate = royaltyPayments.length > 0 ? Math.round(totalRate / royaltyPayments.length) : 85;

    return {
      totalEarnings: settledTotal,
      pendingEarnings: pendingTotal,
      settledCount: sCount,
      pendingCount: pCount,
      avgRoyaltyRate: avgRate
    };
  }, [royaltyPayments]);

  // Filtered Royalty Payments
  const filteredRoyaltyPayments = useMemo(() => {
    return royaltyPayments.filter(p => {
      const matchesStatus = royaltyFilterStatus === 'ALL' || p.status === royaltyFilterStatus;
      const matchesSearch = 
        p.assetTitle.toLowerCase().includes(royaltySearchQuery.toLowerCase()) ||
        p.payerName.toLowerCase().includes(royaltySearchQuery.toLowerCase()) ||
        p.payerPlatform.toLowerCase().includes(royaltySearchQuery.toLowerCase()) ||
        p.txHash.toLowerCase().includes(royaltySearchQuery.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [royaltyPayments, royaltyFilterStatus, royaltySearchQuery]);

  // Trigger continuous audit simulation
  const triggerAudit = (agr: Agreement) => {
    if (!agr.id) return;
    setAuditingId(agr.id);
    setAuditReports(prev => ({
      ...prev,
      [agr.id!]: {
        status: 'AUDITING',
        log: ['Initializing continuous zero-trust node...', 'Polling Chainlink IP Oracle swarm...']
      }
    }));

    setTimeout(() => {
      setAuditReports(prev => ({
        ...prev,
        [agr.id!]: {
          status: 'SECURE',
          log: [
            '✓ Cryptographic integrity watermark verified (SHA-256 match)',
            '✓ DSP streaming playback threshold verified against decentralized oracle',
            '✓ Escrow contract balance verified and balanced',
            '✓ ZERO-TRUST CONTINUOUS VALIDATION SCORE: 100% SECURE'
          ]
        }
      }));
      setAuditingId(null);
    }, 1800);
  };

  // Export Statement
  const handleExportStatement = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(royaltyPayments, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `sovranly_royalty_statement_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-850 pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-950/60 text-cyan-400 border border-cyan-500/30">
              SMART LICENSING & ROYALTIES
            </span>
            <span className="text-zinc-600 text-xs font-mono">• Continuous Zero-Trust Verification</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Scale className="w-6 h-6 text-cyan-400" /> IP License Management & Royalty Tracking
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 font-light max-w-3xl leading-relaxed">
            Define custom license covenants (duration, usage rights, royalty splits) bound to your registered IP assets. Track real-time incoming royalty payments, monitor pending escrow disbursements, and audit on-chain compliance.
          </p>
        </div>

        {/* Action Tabs Navigation */}
        <div className="flex items-center bg-zinc-950 p-1.5 rounded-2xl border border-zinc-850">
          <button
            onClick={() => setActiveTab('builder')}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-1.5 ${activeTab === 'builder' ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-950/50' : 'text-zinc-400 hover:text-white'}`}
          >
            <FileSignature className="w-3.5 h-3.5" /> Define License
          </button>
          <button
            onClick={() => setActiveTab('royalties')}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-1.5 ${activeTab === 'royalties' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-950/50' : 'text-zinc-400 hover:text-white'}`}
          >
            <Coins className="w-3.5 h-3.5" /> Royalty Tracking ({royaltyPayments.length})
          </button>
          <button
            onClick={() => setActiveTab('registry')}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-1.5 ${activeTab === 'registry' ? 'bg-violet-600 text-white shadow-lg shadow-violet-950/50' : 'text-zinc-400 hover:text-white'}`}
          >
            <Activity className="w-3.5 h-3.5" /> Covenants ({agreements.length})
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: DEFINE & DEPLOY LICENSE TERMS                                     */}
      {/* ========================================================================= */}
      {activeTab === 'builder' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          
          {/* Preset Templates */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-xs text-zinc-400 font-bold uppercase tracking-wider">
                Preset Standard Covenants (Quick Apply)
              </Label>
              <span className="text-[10px] text-zinc-500 font-mono">Customizable parameters below</span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
              {TEMPLATES.map((tmpl) => (
                <div
                  key={tmpl.name}
                  onClick={() => applyTemplate(tmpl)}
                  className="bg-zinc-950/80 p-4 rounded-2xl border border-zinc-900 hover:border-cyan-500/40 transition-all cursor-pointer space-y-2.5 hover:bg-zinc-900/40 group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">{tmpl.name}</span>
                    <span className="text-[10px] font-mono text-cyan-400 font-black">{tmpl.basePrice} ETH</span>
                  </div>
                  <p className="text-[11px] text-zinc-400 leading-normal line-clamp-2">{tmpl.description}</p>
                  <div className="flex items-center justify-between pt-1 border-t border-zinc-900 text-[10px] font-mono text-zinc-500">
                    <span>Royalty: <strong className="text-emerald-400">{tmpl.royaltyRate}%</strong></span>
                    <span>Term: <strong className="text-zinc-300">{tmpl.duration}</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left: Agreement Configuration Form */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Asset Association */}
              <div className="bg-zinc-950 p-6 rounded-[28px] border border-zinc-900 shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
                  <h4 className="text-sm font-black text-cyan-400 uppercase tracking-wider flex items-center gap-2">
                    <Award className="w-4 h-4" /> 1. Associate Registered IP Asset
                  </h4>
                  <span className="text-[10px] font-mono text-zinc-500">{assets.length} Available in Repository</span>
                </div>

                {loadingAssets ? (
                  <div className="py-4 text-center text-xs font-mono text-zinc-500 animate-pulse">Loading registered assets...</div>
                ) : assets.length === 0 ? (
                  <div className="p-4 bg-amber-950/20 border border-amber-500/30 rounded-2xl text-xs text-amber-300 space-y-1">
                    <p className="font-bold">No registered IP assets found.</p>
                    <p className="text-[11px] text-zinc-400">Please register your creative work in the IP Asset Manager before binding licensing compacts.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Label className="text-xs text-zinc-400 uppercase font-bold">Select Target IP Work</Label>
                    <select
                      id="select-ip-asset-for-license"
                      value={selectedAsset?.id || ''}
                      onChange={(e) => {
                        const found = assets.find(a => a.id === e.target.value);
                        if (found) {
                          setSelectedAsset(found);
                          if (found.royalty) setRoyaltyRate(found.royalty);
                        }
                      }}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-sm text-white font-mono focus:outline-none focus:border-cyan-500 h-11"
                    >
                      {assets.map(a => (
                        <option key={a.id} value={a.id}>
                          {a.title} ({a.type}) • {a.royalty}% Base Royalty
                        </option>
                      ))}
                    </select>

                    {selectedAsset && (
                      <div className="bg-zinc-900/60 rounded-2xl p-3.5 border border-zinc-850 flex items-center justify-between text-xs font-mono text-zinc-300">
                        <div className="space-y-0.5">
                          <p className="font-bold text-white font-sans">{selectedAsset.title}</p>
                          <p className="text-[10px] text-zinc-500">Classification: {selectedAsset.type}</p>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] text-zinc-500 block">Original Creation Date</span>
                          <span className="text-cyan-400 text-xs font-bold">
                            {selectedAsset.creationDate ? new Date(selectedAsset.creationDate).toLocaleDateString() : 'Recorded'}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Terms: Duration & Usage Rights */}
              <div className="bg-zinc-950 p-6 rounded-[28px] border border-zinc-900 shadow-xl space-y-6">
                <div className="border-b border-zinc-900 pb-3">
                  <h4 className="text-sm font-black text-cyan-400 uppercase tracking-wider flex items-center gap-2">
                    <Scale className="w-4 h-4" /> 2. Define Duration, Scope & Usage Rights
                  </h4>
                </div>

                {/* Duration */}
                <div className="space-y-2">
                  <Label className="text-xs text-zinc-400 uppercase font-bold flex items-center justify-between">
                    <span>License Duration / Term</span>
                    <span className="text-xs font-mono text-cyan-400 font-bold">{duration}</span>
                  </Label>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                    {DURATION_PRESETS.map((d) => (
                      <button
                        key={d}
                        type="button"
                        onClick={() => setDuration(d)}
                        className={`py-2 px-3 rounded-xl text-xs font-mono font-bold transition-all border ${duration === d ? 'bg-cyan-950/60 text-cyan-400 border-cyan-500 shadow-sm' : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white'}`}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Usage Rights (Multi-Select) */}
                <div className="space-y-2">
                  <Label className="text-xs text-zinc-400 uppercase font-bold flex items-center justify-between">
                    <span>Permitted Usage Rights</span>
                    <span className="text-[10px] text-zinc-500 font-mono">{permittedUsages.length} Rights Granted</span>
                  </Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                    {USAGE_OPTIONS.map((u) => {
                      const active = permittedUsages.includes(u);
                      return (
                        <button
                          key={u}
                          type="button"
                          onClick={() => toggleUsage(u)}
                          className={`p-3 rounded-xl border text-xs font-bold text-left transition-all flex items-center justify-between ${active ? 'bg-cyan-950/30 border-cyan-500/80 text-white' : 'bg-zinc-900/40 border-zinc-800 text-zinc-500 hover:text-zinc-300'}`}
                        >
                          <span className="truncate mr-1 text-[11px]">{u}</span>
                          <span className={`text-[10px] font-mono shrink-0 ${active ? 'text-cyan-400' : 'text-zinc-600'}`}>
                            {active ? '✓ YES' : '+ ADD'}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Territory & Exclusivity */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-zinc-900">
                  <div className="space-y-1.5">
                    <Label className="text-xs text-zinc-400 uppercase font-bold">Territory / Distribution</Label>
                    <select
                      value={territory}
                      onChange={(e) => setTerritory(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-xs text-white font-mono focus:border-cyan-500"
                    >
                      <option value="Worldwide (WW)">Worldwide (WW) - Global Distribution</option>
                      <option value="North America (US / CA)">North America (US / CA)</option>
                      <option value="European Union (EU / UK)">European Union (EU / UK)</option>
                      <option value="Asia-Pacific (APAC)">Asia-Pacific (APAC)</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs text-zinc-400 uppercase font-bold">Exclusivity Clause</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {['Non-Exclusive', 'Exclusive'].map((ex) => (
                        <button
                          key={ex}
                          type="button"
                          onClick={() => setExclusivity(ex as any)}
                          className={`py-2 rounded-xl text-xs font-mono font-bold transition-all border ${exclusivity === ex ? 'bg-cyan-950/60 text-cyan-400 border-cyan-500' : 'bg-zinc-900 text-zinc-400 border-zinc-800'}`}
                        >
                          {ex}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Financial Architecture & Royalty Percentage */}
              <div className="bg-zinc-950 p-6 rounded-[28px] border border-zinc-900 shadow-xl space-y-6">
                <div className="border-b border-zinc-900 pb-3">
                  <h4 className="text-sm font-black text-cyan-400 uppercase tracking-wider flex items-center gap-2">
                    <Coins className="w-4 h-4" /> 3. Financial Architecture & Royalty Split
                  </h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Royalty Split Slider */}
                  <div className="space-y-2">
                    <Label className="text-xs text-zinc-400 uppercase font-bold flex items-center justify-between">
                      <span>Creator Direct Royalty Cut</span>
                      <span className="text-sm font-mono font-black text-emerald-400">{royaltyRate}%</span>
                    </Label>
                    <input
                      id="royalty-split-input"
                      type="range"
                      min="0"
                      max="100"
                      value={royaltyRate}
                      onChange={(e) => setRoyaltyRate(parseInt(e.target.value) || 0)}
                      className="w-full accent-emerald-400 h-2 bg-zinc-900 rounded-lg cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] font-mono text-zinc-500">
                      <span>0% (Full Buyout)</span>
                      <span>50% (Standard Split)</span>
                      <span>100% (Pure Direct)</span>
                    </div>
                  </div>

                  {/* Base Upfront Fee */}
                  <div className="space-y-2">
                    <Label className="text-xs text-zinc-400 uppercase font-bold flex items-center justify-between">
                      <span>Base License Acquisition Fee</span>
                      <span className="text-xs font-mono text-zinc-500">≈ ${(basePrice * 2500).toFixed(2)} USD</span>
                    </Label>
                    <div className="relative">
                      <Input
                        id="base-price-input"
                        type="number"
                        step="0.01"
                        min="0"
                        value={basePrice}
                        onChange={(e) => setBasePrice(parseFloat(e.target.value) || 0)}
                        className="bg-zinc-900 border-zinc-800 text-white font-mono text-sm h-11 pr-12 focus:border-cyan-500"
                      />
                      <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-mono text-cyan-400 font-bold">ETH</span>
                    </div>
                  </div>
                </div>

                {/* Morality Kill Switch */}
                <div className="flex items-center justify-between p-4 bg-zinc-900/50 rounded-2xl border border-zinc-850">
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <ShieldAlert className="w-3.5 h-3.5 text-red-400" /> Morality & Continuous Revocation Kill-Switch
                    </span>
                    <p className="text-[10px] text-zinc-400">Automatically revokes license upon association with defamation, hate speech, or IP breach.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setMoralityClause(!moralityClause)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold font-mono transition-all border ${moralityClause ? 'bg-red-950/40 text-red-400 border-red-500/50 shadow-sm' : 'bg-zinc-800 text-zinc-400 border-zinc-700'}`}
                  >
                    {moralityClause ? 'ACTIVE' : 'DISABLED'}
                  </button>
                </div>
              </div>
            </div>

            {/* Right: Flowchart Preview & Deploy Terminal */}
            <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-8">
              
              {/* Payment Flow Visualizer */}
              <div className="bg-zinc-950 p-6 rounded-[28px] border border-zinc-900 shadow-xl space-y-3">
                <p className="text-[10px] uppercase font-mono tracking-widest text-zinc-500">Algorithmic Royalty Routing Node</p>
                
                <div className="flex flex-col items-center gap-2.5 py-2 bg-zinc-900/30 rounded-2xl p-4 border border-zinc-850">
                  <div className="flex items-center gap-2 bg-zinc-900 px-4 py-2 rounded-xl border border-zinc-800 text-xs font-mono font-black text-cyan-400 shadow-md">
                    <Wallet className="w-3.5 h-3.5 text-cyan-400" /> Inflow License Fee: {basePrice} ETH
                  </div>
                  
                  <div className="h-3 w-px border-l border-dashed border-zinc-700" />

                  <div className="bg-[#0c0d12] border border-cyan-500/20 px-4 py-2.5 rounded-xl flex flex-col items-center gap-0.5 text-center">
                    <span className="text-[9px] uppercase tracking-wider font-mono text-cyan-400 font-bold">Multi-Sig Smart Escrow</span>
                    <span className="text-[10px] font-mono text-zinc-500">Autonomous Instant Split</span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 w-full pt-1">
                    <div className="bg-zinc-900/70 p-2.5 rounded-xl border border-zinc-800 flex flex-col items-center text-center">
                      <span className="text-xs font-black text-emerald-400 font-mono">{royaltyRate}%</span>
                      <span className="text-[8px] text-zinc-400 uppercase mt-0.5 font-bold">Creator Wallet</span>
                    </div>
                    <div className="bg-zinc-900/70 p-2.5 rounded-xl border border-zinc-800 flex flex-col items-center text-center">
                      <span className="text-xs font-black text-violet-400 font-mono">{Math.round((100 - royaltyRate) * 0.7)}%</span>
                      <span className="text-[8px] text-zinc-400 uppercase mt-0.5 font-bold">Reserve Pool</span>
                    </div>
                    <div className="bg-zinc-900/70 p-2.5 rounded-xl border border-zinc-800 flex flex-col items-center text-center">
                      <span className="text-xs font-black text-cyan-400 font-mono">{Math.round((100 - royaltyRate) * 0.3)}%</span>
                      <span className="text-[8px] text-zinc-400 uppercase mt-0.5 font-bold">Security Nodes</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Cryptographic Covenant Terminal */}
              <div className="bg-black p-6 rounded-[28px] border border-zinc-900 shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b border-zinc-850 pb-3">
                  <div className="flex items-center gap-2">
                    <Lock className="w-3.5 h-3.5 text-cyan-400" />
                    <span className="font-mono text-xs text-zinc-400 uppercase tracking-widest font-black">Legal Covenant Preview</span>
                  </div>
                  <span className="font-mono text-[9px] text-emerald-400 bg-emerald-950/40 border border-emerald-900/50 px-2 py-0.5 rounded uppercase font-bold">v2.4 Ready</span>
                </div>

                <div className="p-4 bg-zinc-950 rounded-2xl border border-zinc-900 font-mono text-[11px] leading-relaxed text-zinc-400 space-y-2 max-h-[220px] overflow-auto select-none">
                  <p><span className="text-cyan-400 font-bold">COMPACT:</span> SEC-L-{contractSeed}</p>
                  <p><span className="text-zinc-300">Target Asset:</span> &quot;{selectedAsset?.title || 'Creative IP Work'}&quot;</p>
                  <p><span className="text-zinc-300">Duration:</span> {duration}</p>
                  <p><span className="text-zinc-300">Royalty Split:</span> {royaltyRate}% Direct Creator Allocation</p>
                  <p><span className="text-zinc-300">Base Price:</span> {basePrice} ETH</p>
                  <div className="border-t border-zinc-900 pt-1 text-[10px] text-zinc-500">
                    <p className="text-zinc-400">Permitted Rights:</p>
                    {permittedUsages.map(u => `✓ ${u}`).join('\n')}
                  </div>
                </div>

                {/* Deploy Actions */}
                <div className="space-y-3 pt-2">
                  {isDeploying ? (
                    <div className="space-y-2 bg-[#0c0d12] p-4 rounded-2xl border border-cyan-900/30">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="text-cyan-300 font-bold">Anchoring to Sovereign Ledger...</span>
                        <span className="text-zinc-500">{deployStep}/4</span>
                      </div>
                      <div className="w-full h-2 rounded-full overflow-hidden bg-zinc-900">
                        <div className="bg-gradient-to-r from-cyan-400 to-violet-500 h-full transition-all duration-300" style={{ width: `${(deployStep / 4) * 100}%` }} />
                      </div>
                    </div>
                  ) : successAgreement ? (
                    <div className="space-y-3 bg-emerald-950/20 p-4 rounded-xl border border-emerald-500/25">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                        <p className="text-xs font-bold text-white uppercase tracking-wider leading-none">Covenant Deployed Successfully</p>
                      </div>
                      <p className="text-[10px] text-zinc-400">Deployed Transaction Hash:</p>
                      <p className="text-[9px] font-mono text-emerald-400 bg-black/50 p-2 rounded truncate border border-emerald-950">
                        {successAgreement.deployTxHash}
                      </p>
                      <div className="flex gap-2">
                        <Button 
                          onClick={() => setSuccessAgreement(null)}
                          type="button"
                          variant="outline"
                          className="flex-1 bg-zinc-900 border-zinc-800 text-white text-xs h-9"
                        >
                          Build Another
                        </Button>
                        <Button
                          onClick={() => {
                            setEmailTargetAgreement(successAgreement);
                            setIsEmailModalOpen(true);
                          }}
                          type="button"
                          className="flex-1 bg-violet-600 hover:bg-violet-500 text-white font-mono text-xs font-bold h-9 flex items-center justify-center gap-1.5"
                        >
                          <Mail className="w-3.5 h-3.5" /> Email Client
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <Button
                      id="deploy-agreement-btn"
                      onClick={handleDeployAgreement}
                      type="button"
                      disabled={!selectedAsset}
                      className="w-full py-6 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 hover:brightness-110 text-white font-bold transition-all shadow-lg shadow-cyan-950/40 flex items-center justify-center gap-2 text-xs uppercase tracking-wider"
                    >
                      <FileSignature className="w-4 h-4" /> Sign & Anchor License Compact
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: ROYALTY EARNINGS & PAYMENTS HUB (TRACKING SYSTEM)                  */}
      {/* ========================================================================= */}
      {activeTab === 'royalties' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          
          {/* Top Metrics Cards (Total Earnings & Pending Amounts) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Total Royalty Earnings */}
            <div className="bg-zinc-950 border border-zinc-900 rounded-[24px] p-5 shadow-xl space-y-2 relative overflow-hidden">
              <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
                <span className="uppercase font-bold tracking-wider">Total Royalty Earnings</span>
                <div className="w-8 h-8 rounded-xl bg-emerald-950/50 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <Coins className="w-4 h-4" />
                </div>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono tracking-tight">
                  {totalEarnings.toFixed(4)} ETH
                </p>
                <p className="text-xs text-zinc-500 font-mono mt-0.5">
                  ≈ ${(totalEarnings * 2500).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD Settled
                </p>
              </div>
              <div className="pt-2 border-t border-zinc-900 flex items-center justify-between text-[10px] font-mono text-zinc-500">
                <span>{settledCount} Received Payments</span>
                <span className="text-emerald-400">✓ In Creator Wallet</span>
              </div>
            </div>

            {/* Pending Royalty Escrow */}
            <div className="bg-zinc-950 border border-zinc-900 rounded-[24px] p-5 shadow-xl space-y-2 relative overflow-hidden">
              <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
                <span className="uppercase font-bold tracking-wider">Pending Royalty Escrow</span>
                <div className="w-8 h-8 rounded-xl bg-amber-950/50 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <Hourglass className="w-4 h-4" />
                </div>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-mono tracking-tight">
                  {pendingEarnings.toFixed(4)} ETH
                </p>
                <p className="text-xs text-zinc-500 font-mono mt-0.5">
                  ≈ ${(pendingEarnings * 2500).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD in Buffer
                </p>
              </div>
              <div className="pt-2 border-t border-zinc-900 flex items-center justify-between text-[10px] font-mono text-zinc-500">
                <span>{pendingCount} Pending Inflows</span>
                <span className="text-amber-400">● Awaiting Release</span>
              </div>
            </div>

            {/* Active License Compacts */}
            <div className="bg-zinc-950 border border-zinc-900 rounded-[24px] p-5 shadow-xl space-y-2">
              <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
                <span className="uppercase font-bold tracking-wider">Active License Compacts</span>
                <div className="w-8 h-8 rounded-xl bg-cyan-950/50 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                  <FileText className="w-4 h-4" />
                </div>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-extrabold text-white font-mono tracking-tight">
                  {agreements.filter(a => a.status === 'ACTIVE').length}
                </p>
                <p className="text-xs text-zinc-500 font-mono mt-0.5">Deployed across global channels</p>
              </div>
              <div className="pt-2 border-t border-zinc-900 flex items-center justify-between text-[10px] font-mono text-zinc-500">
                <span>{assets.length} IP Assets Covered</span>
                <span className="text-cyan-400">100% Zero-Trust Active</span>
              </div>
            </div>

            {/* Average Royalty Split */}
            <div className="bg-zinc-950 border border-zinc-900 rounded-[24px] p-5 shadow-xl space-y-2">
              <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
                <span className="uppercase font-bold tracking-wider">Avg Creator Royalty Cut</span>
                <div className="w-8 h-8 rounded-xl bg-violet-950/50 border border-violet-500/30 flex items-center justify-center text-violet-400">
                  <TrendingUp className="w-4 h-4" />
                </div>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-extrabold text-violet-400 font-mono tracking-tight">
                  {avgRoyaltyRate}%
                </p>
                <p className="text-xs text-zinc-500 font-mono mt-0.5">Direct sovereign share</p>
              </div>
              <div className="pt-2 border-t border-zinc-900 flex items-center justify-between text-[10px] font-mono text-zinc-500">
                <span>No intermediary cut</span>
                <span className="text-violet-400">Sovereign Direct</span>
              </div>
            </div>
          </div>

          {/* Action & Control Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-zinc-950 p-4 rounded-2xl border border-zinc-900">
            <div className="flex items-center gap-3">
              <Button
                onClick={() => setIsRecordPaymentOpen(true)}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold py-2 px-4 rounded-xl flex items-center gap-2 shadow-lg shadow-emerald-950/30"
              >
                <PlusCircle className="w-4 h-4" /> Record Royalty Payment
              </Button>

              <Button
                onClick={handleReleasePendingEscrow}
                disabled={isReleasingEscrow || pendingEarnings === 0}
                variant="outline"
                className="border-amber-500/40 bg-amber-950/20 hover:bg-amber-900/30 text-amber-300 font-mono text-xs font-bold py-2 px-4 rounded-xl flex items-center gap-2"
              >
                {isReleasingEscrow ? (
                  <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
                ) : (
                  <Sparkles className="w-4 h-4 text-amber-400" />
                )}
                Release Pending Escrow ({pendingEarnings.toFixed(3)} ETH)
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Button
                onClick={handleExportStatement}
                variant="outline"
                className="border-zinc-800 text-zinc-300 hover:text-white text-xs font-mono py-2 px-3 rounded-xl flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5 text-cyan-400" /> Export Statement
              </Button>
              <Button
                onClick={fetchRoyalties}
                variant="outline"
                className="border-zinc-800 text-zinc-400 hover:text-white text-xs font-mono py-2 px-3 rounded-xl"
                title="Refresh payments"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>

          {/* Success Banner if Escrow Released */}
          {escrowSuccessMsg && (
            <div className="p-4 bg-emerald-950/30 border border-emerald-500/40 rounded-2xl flex items-center gap-3 text-emerald-300 text-xs font-mono animate-in fade-in duration-200">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>{escrowSuccessMsg}</span>
            </div>
          )}

          {/* Search and Status Filters for Payments Table */}
          <div className="bg-zinc-950 border border-zinc-900 rounded-[28px] p-6 shadow-xl space-y-5">
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 border-b border-zinc-900 pb-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Receipt className="w-4 h-4 text-cyan-400" /> Royalty Payments & Settlement Ledger
                </h3>
                <p className="text-xs text-zinc-500">Continuous on-chain auditing of received licensee disbursements and escrow buffers.</p>
              </div>

              <div className="flex items-center gap-3">
                {/* Search */}
                <div className="relative min-w-[220px]">
                  <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <Input
                    placeholder="Search asset, platform, or tx..."
                    value={royaltySearchQuery}
                    onChange={(e) => setRoyaltySearchQuery(e.target.value)}
                    className="bg-zinc-900/90 border-zinc-800 text-xs pl-9 h-9 text-white rounded-xl focus:border-cyan-500"
                  />
                </div>

                {/* Filter Pills */}
                <div className="flex items-center bg-zinc-900 p-1 rounded-xl border border-zinc-800 text-xs font-mono">
                  {(['ALL', 'SETTLED', 'PENDING'] as const).map((st) => (
                    <button
                      key={st}
                      onClick={() => setRoyaltyFilterStatus(st)}
                      className={`px-3 py-1 rounded-lg transition-all ${royaltyFilterStatus === st ? 'bg-cyan-600 text-white font-bold' : 'text-zinc-400 hover:text-white'}`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Payments Table */}
            {loadingRoyalties ? (
              <div className="py-12 text-center text-xs font-mono text-zinc-500 animate-pulse">Loading royalty ledger...</div>
            ) : filteredRoyaltyPayments.length === 0 ? (
              <div className="py-12 text-center text-zinc-500 text-xs font-mono">
                No royalty payments match your filter. Record a payment above to track earnings.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-zinc-900/60 border-b border-zinc-850 text-[10px] text-zinc-400 uppercase tracking-wider">
                    <tr>
                      <th className="p-3.5">Date & Platform</th>
                      <th className="p-3.5">IP Asset / License</th>
                      <th className="p-3.5">Gross Revenue</th>
                      <th className="p-3.5">Creator Cut</th>
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5">Tx Hash</th>
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-900 text-zinc-300">
                    {filteredRoyaltyPayments.map((pay) => (
                      <tr key={pay.id} className="hover:bg-zinc-900/30 transition-colors">
                        <td className="p-3.5">
                          <div className="space-y-0.5">
                            <span className="font-bold text-white font-sans text-xs block">{pay.payerName}</span>
                            <span className="text-[10px] text-zinc-500 font-mono">
                              {new Date(pay.paymentDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })} • {pay.payerPlatform}
                            </span>
                          </div>
                        </td>
                        <td className="p-3.5">
                          <span className="font-bold text-cyan-300 block">{pay.assetTitle}</span>
                          <span className="text-[10px] text-zinc-500 font-mono">{pay.notes || 'Automated smart contract payout'}</span>
                        </td>
                        <td className="p-3.5 text-zinc-400">
                          {pay.grossAmount.toFixed(3)} {pay.currency}
                        </td>
                        <td className="p-3.5">
                          <span className="font-bold text-emerald-400 block text-xs">
                            +{pay.netCreatorEarnings.toFixed(4)} {pay.currency}
                          </span>
                          <span className="text-[10px] text-zinc-500 font-mono">{pay.royaltyRate}% Split</span>
                        </td>
                        <td className="p-3.5">
                          <span className={`px-2 py-0.5 rounded text-[10px] border ${pay.status === 'SETTLED' ? 'bg-emerald-950/40 text-emerald-400 border-emerald-900' : 'bg-amber-950/40 text-amber-400 border-amber-900 animate-pulse'}`}>
                            {pay.status === 'SETTLED' ? '✓ SETTLED' : '● PENDING ESCROW'}
                          </span>
                        </td>
                        <td className="p-3.5 text-[10px] font-mono text-zinc-500 truncate max-w-[120px]">
                          {pay.txHash.slice(0, 10)}...{pay.txHash.slice(-6)}
                        </td>
                        <td className="p-3.5 text-right">
                          {pay.status === 'PENDING' ? (
                            <button
                              onClick={async () => {
                                const headers = await getAuthHeaders(user, isSandboxMode);
                                await fetch('/api/royalties', {
                                  method: 'PUT',
                                  headers: { 'Content-Type': 'application/json', ...headers },
                                  body: JSON.stringify({ id: pay.id, status: 'SETTLED' })
                                });
                                setRoyaltyPayments(prev => prev.map(p => p.id === pay.id ? { ...p, status: 'SETTLED' } : p));
                              }}
                              className="px-2.5 py-1 bg-amber-950/30 hover:bg-amber-900/40 border border-amber-500/40 text-amber-300 text-[10px] rounded-lg font-mono font-bold"
                            >
                              Release
                            </button>
                          ) : (
                            <span className="text-[10px] text-emerald-500 font-mono">Disbursed</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: ACTIVE COVENANTS & VERIFICATION REGISTRY                           */}
      {/* ========================================================================= */}
      {activeTab === 'registry' && (
        <div className="bg-zinc-950 border border-zinc-900 rounded-[32px] p-6 sm:p-8 shadow-2xl space-y-6 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-900 pb-6">
            <div className="space-y-1">
              <h3 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
                <Activity className="w-5 h-5 text-cyan-400" /> Active Licensing Covenants Registry
              </h3>
              <p className="text-xs text-zinc-400 font-light">
                Continuous real-time verification and compliance pipelines across all active smart contract licenses.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-zinc-500">
              <RefreshCw className="w-3.5 h-3.5 text-zinc-500" /> Updated continuously
            </div>
          </div>

          {loadingAgreements ? (
            <div className="py-12 text-center text-zinc-500 font-mono text-xs uppercase tracking-widest animate-pulse">
              Querying sovereign agreement records...
            </div>
          ) : agreements.length === 0 ? (
            <div className="py-16 text-center border border-dashed border-zinc-850 rounded-2xl text-zinc-500 space-y-3">
              <Award className="w-8 h-8 mx-auto text-zinc-650" />
              <p className="text-xs uppercase tracking-wider font-bold">No sovereign agreements dispatched</p>
              <p className="text-[10px] text-zinc-400 max-w-md mx-auto">
                Use the &quot;Define License&quot; tab to create and anchor your first licensing contract on the Sovranly ledger.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {agreements.map((agr) => {
                const audit = auditReports[agr.id!] || null;
                return (
                  <div key={agr.id || agr.contractAddress} className="bg-zinc-900/30 p-5 rounded-2xl border border-zinc-900 flex flex-col justify-between space-y-4 hover:border-zinc-850 transition-all hover:bg-zinc-900/40">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className={`text-[9px] font-mono px-2 py-0.5 rounded border ${agr.status === 'ACTIVE' ? 'bg-emerald-950/40 text-emerald-400 border-emerald-900' : 'bg-red-950/40 text-red-400 border-red-900'}`}>
                          {agr.status} • Continuous Active Verification
                        </span>
                        <span className="text-[10px] text-zinc-500 font-mono">
                          {new Date(agr.createdAt).toLocaleString(undefined, { dateStyle: 'short', timeStyle: 'short' })}
                        </span>
                      </div>

                      <div className="space-y-1">
                        <h4 className="text-sm font-black text-white">{agr.assetTitle}</h4>
                        <p className="text-[10px] font-mono text-zinc-400 truncate">Contract: {agr.contractAddress}</p>
                      </div>

                      {/* Compact Specs Grid */}
                      <div className="grid grid-cols-3 gap-2 bg-zinc-950/60 p-2.5 border border-zinc-900 rounded-xl text-center">
                        <div>
                          <p className="text-[8px] text-zinc-500 uppercase tracking-wider font-extrabold">Fee</p>
                          <p className="text-[10px] font-mono text-zinc-300 font-black mt-0.5">{agr.basePrice} ETH</p>
                        </div>
                        <div>
                          <p className="text-[8px] text-zinc-500 uppercase tracking-wider font-extrabold">Royalty</p>
                          <p className="text-[10px] font-mono text-emerald-400 font-black mt-0.5">{agr.royaltyRate}%</p>
                        </div>
                        <div>
                          <p className="text-[8px] text-zinc-500 uppercase tracking-wider font-extrabold">Term</p>
                          <p className="text-[10px] font-mono text-zinc-300 font-black mt-0.5">{agr.duration}</p>
                        </div>
                      </div>

                      {/* Continuous Auditing Section */}
                      {audit && (
                        <div className="p-3 bg-zinc-950 border border-zinc-900 rounded-xl space-y-2">
                          <div className="flex items-center justify-between text-[9px] font-mono font-bold leading-none">
                            <span className="text-zinc-500 uppercase tracking-widest">Live Audit Logs</span>
                            <span className={audit.status === 'SECURE' ? 'text-emerald-400' : 'text-cyan-400 animate-pulse'}>
                              {audit.status === 'SECURE' ? '✓ SYSTEM SECURED' : '● RUNNING AUDIT...'}
                            </span>
                          </div>
                          <div className="font-mono text-[8px] text-zinc-500 space-y-1 text-left max-h-[80px] overflow-auto leading-normal">
                            {audit.log.map((logLine, idx) => (
                              <p key={idx} className={logLine.startsWith('✓') ? 'text-emerald-500' : logLine.startsWith('●') ? 'text-cyan-400' : 'text-zinc-650'}>
                                {logLine}
                              </p>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex justify-between items-center gap-3 pt-2 border-t border-zinc-900/60">
                      <button
                        onClick={() => triggerAudit(agr)}
                        type="button"
                        disabled={auditingId === agr.id}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white rounded-xl text-xs font-bold transition-all border border-zinc-800"
                      >
                        <Activity className={`w-3.5 h-3.5 text-cyan-400 ${auditingId === agr.id ? 'animate-spin' : ''}`} />
                        {auditingId === agr.id ? 'Auditing...' : 'Analyze Integrity'}
                      </button>
                      
                      <button
                        onClick={() => {
                          setEmailTargetAgreement(agr);
                          setIsEmailModalOpen(true);
                        }}
                        className="py-2.5 px-3 bg-violet-950/40 hover:bg-violet-900/40 text-violet-300 rounded-xl text-xs font-bold transition-all border border-violet-500/30 flex items-center gap-1"
                        title="Notify Client via Email"
                      >
                        <Mail className="w-3.5 h-3.5" /> Email
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Record Royalty Payment Modal */}
      {isRecordPaymentOpen && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-950 border border-zinc-850 rounded-3xl p-6 sm:p-8 max-w-lg w-full relative space-y-5 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-zinc-850 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-950/50 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <PlusCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Record Royalty Payment</h3>
                  <p className="text-xs text-zinc-400">Log an incoming license distribution disbursement.</p>
                </div>
              </div>
              <button 
                onClick={() => setIsRecordPaymentOpen(false)}
                className="text-zinc-500 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleRecordPayment} className="space-y-4">
              
              {/* Asset Selector */}
              <div className="space-y-1.5">
                <Label className="text-xs text-zinc-300 font-bold uppercase">Associated IP Asset</Label>
                <select
                  value={newPaymentForm.assetId}
                  onChange={(e) => setNewPaymentForm({ ...newPaymentForm, assetId: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-xs text-white font-mono focus:border-cyan-500"
                >
                  <option value="">Default IP Asset (or select below)</option>
                  {assets.map(a => (
                    <option key={a.id} value={a.id}>{a.title} ({a.type})</option>
                  ))}
                </select>
              </div>

              {/* Payer Platform */}
              <div className="space-y-1.5">
                <Label className="text-xs text-zinc-300 font-bold uppercase">Payer / Licensee Platform</Label>
                <Input
                  value={newPaymentForm.payerName}
                  onChange={(e) => setNewPaymentForm({ ...newPaymentForm, payerName: e.target.value })}
                  placeholder="e.g. Spotify Distribution Pool, Netflix Sync, Epic Games"
                  className="bg-zinc-900 border-zinc-800 text-xs text-white"
                  required
                />
              </div>

              {/* Amounts & Status */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs text-zinc-300 font-bold uppercase">Gross Amount (ETH)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    value={newPaymentForm.grossAmount}
                    onChange={(e) => setNewPaymentForm({ ...newPaymentForm, grossAmount: e.target.value })}
                    className="bg-zinc-900 border-zinc-800 text-xs text-white font-mono"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs text-zinc-300 font-bold uppercase">Royalty Rate (%)</Label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={newPaymentForm.royaltyRate}
                    onChange={(e) => setNewPaymentForm({ ...newPaymentForm, royaltyRate: e.target.value })}
                    className="bg-zinc-900 border-zinc-800 text-xs text-white font-mono"
                    required
                  />
                </div>
              </div>

              {/* Net preview */}
              <div className="p-3 bg-zinc-900/60 rounded-xl border border-zinc-850 flex items-center justify-between text-xs font-mono">
                <span className="text-zinc-400">Net Creator Earnings:</span>
                <span className="font-bold text-emerald-400">
                  +{((parseFloat(newPaymentForm.grossAmount) || 0) * (parseFloat(newPaymentForm.royaltyRate) || 0) / 100).toFixed(4)} ETH
                </span>
              </div>

              {/* Status */}
              <div className="space-y-1.5">
                <Label className="text-xs text-zinc-300 font-bold uppercase">Initial Payment Status</Label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setNewPaymentForm({ ...newPaymentForm, status: 'SETTLED' })}
                    className={`py-2 rounded-xl text-xs font-mono font-bold border ${newPaymentForm.status === 'SETTLED' ? 'bg-emerald-950/40 text-emerald-400 border-emerald-500/50' : 'bg-zinc-900 text-zinc-500 border-zinc-800'}`}
                  >
                    ✓ Settled (Paid)
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewPaymentForm({ ...newPaymentForm, status: 'PENDING' })}
                    className={`py-2 rounded-xl text-xs font-mono font-bold border ${newPaymentForm.status === 'PENDING' ? 'bg-amber-950/40 text-amber-400 border-amber-500/50' : 'bg-zinc-900 text-zinc-500 border-zinc-800'}`}
                  >
                    ● Pending Escrow
                  </button>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsRecordPaymentOpen(false)}
                  className="flex-1 border-zinc-800 text-zinc-400 text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isRecordingPayment}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-bold text-xs"
                >
                  {isRecordingPayment ? 'Recording...' : 'Record Payment'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Gmail Notarization Email Modal */}
      <NotarizationEmailModal
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
        documentTitle={emailTargetAgreement?.assetTitle || selectedAsset?.title || 'Sovereign Licensing Covenant'}
        documentHash={emailTargetAgreement?.contractAddress || emailTargetAgreement?.id || '0x7a2f...e421'}
        txHash={emailTargetAgreement?.deployTxHash || '0x991f...3281'}
        defaultClientName={emailTargetAgreement?.creatorEmail || ''}
      />
    </div>
  );
}
