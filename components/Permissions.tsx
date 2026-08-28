'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  ShieldCheck, 
  Sparkles, 
  Music, 
  Video, 
  Youtube, 
  Radio, 
  Film, 
  CheckCircle2, 
  Copy, 
  Check, 
  ExternalLink, 
  Download, 
  Search, 
  Filter, 
  RefreshCw, 
  Zap, 
  ArrowRight, 
  Coins, 
  Sliders, 
  Scale, 
  FileText, 
  Share2, 
  AlertCircle, 
  Eye, 
  QrCode, 
  X, 
  Shield, 
  Lock, 
  PlusCircle, 
  Play, 
  Flame, 
  Info,
  Tv,
  Podcast,
  Smartphone
} from 'lucide-react';
import { useAuth } from './auth/FirebaseProvider';
import { getAuthHeaders } from '@/lib/auth-client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Image from 'next/image';

export type PermissionScope = 
  | 'YOUTUBE_VIDEO' 
  | 'TIKTOK_REEL_SHORT' 
  | 'LIVESTREAM_AUDIO' 
  | 'PODCAST_EPISODE' 
  | 'STUDENT_INDIE_FILM' 
  | 'CUSTOM';

export type PermissionPricing = 
  | 'FREE_ATTRIBUTION' 
  | 'MICRO_FEE' 
  | 'MICRO_ROYALTY';

export interface PermissionRecord {
  id: string;
  clearanceCode: string;
  assetId: string;
  assetTitle: string;
  assetType?: string;
  grantorId: string;
  grantorName: string;
  grantorWallet?: string;
  grantorEmail?: string;
  granteeName: string;
  granteeSocialHandle: string;
  projectTitle: string;
  projectUrl?: string;
  platform: 'YouTube' | 'TikTok' | 'Instagram' | 'Twitch' | 'Podcast' | 'Independent Film' | 'Multi-Platform';
  scopeType: PermissionScope;
  scopeTitle: string;
  pricingType: PermissionPricing;
  feeAmount: number;
  currency: 'USD' | 'ETH';
  royaltyPercentage: number;
  attributionRequirement: string;
  status: 'ACTIVE_CLEARED' | 'PENDING_REVIEW' | 'REVOKED';
  verificationHash: string;
  issuedAt: string;
  expiresAt?: string;
  notes?: string;
  txHash?: string;
}

interface PermissionsProps {
  initialAsset?: any;
  walletAddress?: string | null;
  onNavigate?: (pageId: number) => void;
}

export default function Permissions({ initialAsset, walletAddress, onNavigate }: PermissionsProps) {
  const { user, isSandboxMode } = useAuth();
  
  // Navigation tabs within Permissions Hub
  const [activeTab, setActiveTab] = useState<'generate' | 'ledger' | 'comparison'>('generate');

  // Asset list for selecting which work to grant permission on
  const [assets, setAssets] = useState<any[]>([]);
  const [selectedAssetId, setSelectedAssetId] = useState<string>(initialAsset?.id || '');
  const [loadingAssets, setLoadingAssets] = useState(false);

  // Permissions list from API
  const [permissions, setPermissions] = useState<PermissionRecord[]>([]);
  const [loadingPermissions, setLoadingPermissions] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPlatform, setFilterPlatform] = useState<string>('ALL');

  // Generator form fields
  const [targetPlatform, setTargetPlatform] = useState<'YouTube' | 'TikTok' | 'Instagram' | 'Twitch' | 'Podcast' | 'Independent Film' | 'Multi-Platform'>('YouTube');
  const [scopePreset, setScopePreset] = useState<PermissionScope>('YOUTUBE_VIDEO');
  const [granteeName, setGranteeName] = useState('');
  const [granteeHandle, setGranteeHandle] = useState('');
  const [projectTitle, setProjectTitle] = useState('');
  const [projectUrl, setProjectUrl] = useState('');
  const [pricingType, setPricingType] = useState<PermissionPricing>('FREE_ATTRIBUTION');
  const [microFeeAmount, setMicroFeeAmount] = useState<number>(0);
  const [customAttribution, setCustomAttribution] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Modal for Viewing / Copying Clearance
  const [activeModalPermission, setActiveModalPermission] = useState<PermissionRecord | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [copiedAttribution, setCopiedAttribution] = useState(false);
  const [createdSuccessPermission, setCreatedSuccessPermission] = useState<PermissionRecord | null>(null);

  // Fetch available IP assets and permissions ledger on mount
  useEffect(() => {
    let isMounted = true;
    const loadInitialData = async () => {
      try {
        const headers = await getAuthHeaders(user, isSandboxMode);
        const [assetsRes, permsRes] = await Promise.all([
          fetch('/api/assets', { headers }),
          fetch('/api/permissions', { headers })
        ]);
        if (assetsRes.ok && isMounted) {
          const data = await assetsRes.json();
          const list = Array.isArray(data) ? data : [];
          setAssets(list);
          setSelectedAssetId(prev => {
            if (prev) return prev;
            if (initialAsset?.id) return initialAsset.id;
            const audio = list.find((a: any) => a.type?.toLowerCase().includes('audio') || a.type?.toLowerCase().includes('music'));
            return audio ? audio.id : (list[0]?.id || '');
          });
        }
        if (permsRes.ok && isMounted) {
          const pData = await permsRes.json();
          setPermissions(Array.isArray(pData) ? pData : []);
        }
      } catch (err) {
        console.error('Error loading permissions initial data:', err);
      } finally {
        if (isMounted) {
          setLoadingAssets(false);
          setLoadingPermissions(false);
        }
      }
    };

    loadInitialData();
    return () => {
      isMounted = false;
    };
  }, [user, isSandboxMode, initialAsset]);

  // Refresh permissions ledger after issuing
  const refreshPermissions = useCallback(async () => {
    try {
      const headers = await getAuthHeaders(user, isSandboxMode);
      const res = await fetch('/api/permissions', { headers });
      if (res.ok) {
        const data = await res.json();
        setPermissions(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error('Error refreshing permissions ledger:', err);
    }
  }, [user, isSandboxMode]);

  // Currently selected asset object
  const activeAsset = useMemo(() => {
    return assets.find(a => a.id === selectedAssetId) || (initialAsset && initialAsset.id === selectedAssetId ? initialAsset : null) || assets[0] || null;
  }, [assets, selectedAssetId, initialAsset]);

  // Presets mapping
  const PRESETS: {
    id: PermissionScope;
    title: string;
    icon: React.ElementType;
    platform: 'YouTube' | 'TikTok' | 'Instagram' | 'Twitch' | 'Podcast' | 'Independent Film' | 'Multi-Platform';
    desc: string;
    defaultPricing: PermissionPricing;
    defaultFee: number;
  }[] = [
    {
      id: 'YOUTUBE_VIDEO',
      title: 'YouTube Long-Form Video',
      icon: Youtube,
      platform: 'YouTube',
      desc: 'Single YouTube video background music / sync clearance. Monetized or non-monetized with description attribution.',
      defaultPricing: 'FREE_ATTRIBUTION',
      defaultFee: 0
    },
    {
      id: 'TIKTOK_REEL_SHORT',
      title: 'TikTok, Reels & Shorts',
      icon: Smartphone,
      platform: 'TikTok',
      desc: 'Short-form social media video clip up to 60s. Non-exclusive, non-commercial or creator vlog sync.',
      defaultPricing: 'FREE_ATTRIBUTION',
      defaultFee: 0
    },
    {
      id: 'LIVESTREAM_AUDIO',
      title: 'Twitch / Stream-Safe Play',
      icon: Tv,
      platform: 'Twitch',
      desc: 'Livestream background music playback. VOD muted-audio defense & streamer clearance.',
      defaultPricing: 'MICRO_FEE',
      defaultFee: 5
    },
    {
      id: 'PODCAST_EPISODE',
      title: 'Podcast Episode Intro/Outro',
      icon: Podcast,
      platform: 'Podcast',
      desc: 'Single podcast episode intro bumper, outro theme, or thematic audio bed.',
      defaultPricing: 'MICRO_FEE',
      defaultFee: 10
    },
    {
      id: 'STUDENT_INDIE_FILM',
      title: 'Indie Short Film / Festival',
      icon: Film,
      platform: 'Independent Film',
      desc: 'Non-theatrical indie student short film or film festival screening synchronization.',
      defaultPricing: 'MICRO_FEE',
      defaultFee: 15
    }
  ];

  // Selecting a preset
  const handleSelectPreset = (preset: typeof PRESETS[0]) => {
    setScopePreset(preset.id);
    setTargetPlatform(preset.platform);
    setPricingType(preset.defaultPricing);
    setMicroFeeAmount(preset.defaultFee);
  };

  // Dynamically constructed attribution tag preview
  const liveAttributionTag = useMemo(() => {
    if (customAttribution) return customAttribution;
    const trackName = activeAsset?.title || 'Selected Track';
    const artist = activeAsset?.ownerAddress 
      ? `${activeAsset.ownerAddress.slice(0, 6)}...${activeAsset.ownerAddress.slice(-4)}` 
      : (user?.displayName || 'Sovranly Creator');
    const dummyCode = 'PRM-XXXX-XXXX';
    return `🎵 Music in video: "${trackName}" by ${artist}\nCleared via Sovranly IP Instant Permission #${dummyCode}\nZero-Trust Public Proof: https://www.sovranlyip.com/verify/${dummyCode}`;
  }, [customAttribution, activeAsset, user]);

  // Submit Handler: Create new permission
  const handleIssuePermission = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeAsset) {
      alert('Please select an asset to grant permissions for.');
      return;
    }
    if (!granteeName.trim()) {
      alert('Please provide the creator or channel name.');
      return;
    }

    setIsSubmitting(true);
    try {
      const headers = await getAuthHeaders(user, isSandboxMode);
      const selectedPresetObj = PRESETS.find(p => p.id === scopePreset);
      
      const payload = {
        assetId: activeAsset.id,
        assetTitle: activeAsset.title,
        assetType: activeAsset.type || 'Music / Audio',
        grantorId: user?.uid || 'sandbox-guest-agent-007',
        grantorName: user?.displayName || 'Duane & Sovranly Labs',
        grantorWallet: walletAddress || activeAsset.ownerAddress || '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
        grantorEmail: user?.email || 'create@sovranlyip.com',
        granteeName: granteeName.trim(),
        granteeSocialHandle: granteeHandle.trim() || `@${granteeName.toLowerCase().replace(/\s+/g, '')}`,
        projectTitle: projectTitle.trim() || `${targetPlatform} Creator Video`,
        projectUrl: projectUrl.trim() || '',
        platform: targetPlatform,
        scopeType: scopePreset,
        scopeTitle: selectedPresetObj?.title || 'Video Sync Permission',
        pricingType: pricingType,
        feeAmount: pricingType === 'MICRO_FEE' ? Number(microFeeAmount || 0) : 0,
        currency: 'USD',
        royaltyPercentage: pricingType === 'MICRO_ROYALTY' ? 5 : 0,
        notes: `Instant micro-permission generated for ${targetPlatform} content clearance.`
      };

      const res = await fetch('/api/permissions', {
        method: 'POST',
        headers: {
          ...headers,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        throw new Error('Failed to issue permission');
      }

      const newPerm = await res.json();
      setCreatedSuccessPermission(newPerm);
      setActiveModalPermission(newPerm);
      
      // Refresh permissions list
      await refreshPermissions();

      // Reset form fields
      setGranteeName('');
      setGranteeHandle('');
      setProjectTitle('');
      setProjectUrl('');
    } catch (err) {
      console.error('Error issuing permission:', err);
      alert('Encountered an issue issuing permission. Please retry.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Copy attribution snippet to clipboard
  const handleCopyAttribution = (perm: PermissionRecord) => {
    const snippet = perm.attributionRequirement || 
      `🎵 Music in video: "${perm.assetTitle}" by ${perm.grantorName}\nCleared via Sovranly IP Instant Permission #${perm.clearanceCode}\nContinuous Zero-Trust Verification: https://www.sovranlyip.com/verify/${perm.clearanceCode}`;
    navigator.clipboard.writeText(snippet);
    setCopiedAttribution(true);
    setTimeout(() => setCopiedAttribution(false), 2500);
  };

  // Copy clearance code
  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  // Filtered permissions list
  const filteredPermissions = useMemo(() => {
    return permissions.filter(p => {
      const matchSearch = 
        p.assetTitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.granteeName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.projectTitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.clearanceCode?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchPlatform = filterPlatform === 'ALL' || p.platform === filterPlatform;
      return matchSearch && matchPlatform;
    });
  }, [permissions, searchQuery, filterPlatform]);

  return (
    <div className="space-y-8 font-sans max-w-7xl mx-auto pb-12">
      {/* Top Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden border border-cyan-500/20 bg-gradient-to-b from-zinc-900/90 via-zinc-950/90 to-black p-6 sm:p-8 shadow-2xl">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(6,182,212,0.12)_0%,transparent_65%)] pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 text-xs font-mono uppercase tracking-wider">
              <Zap className="w-3.5 h-3.5 text-cyan-400" />
              <span>Micro-Permissions Clearance Protocol</span>
              <span className="w-1 h-1 rounded-full bg-cyan-400"></span>
              <span className="text-zinc-400">Lightweight Alternative to Licensing</span>
            </div>
            
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white flex items-center gap-3">
              Permissions Hub
              <span className="text-xs sm:text-sm font-mono font-normal px-2.5 py-1 rounded-lg bg-emerald-950/60 border border-emerald-800/40 text-emerald-300">
                1-Click Clear
              </span>
            </h1>

            <p className="text-xs sm:text-sm text-zinc-300 font-light leading-relaxed">
              Designed specifically for video creators, streamers, and podcasters who just want to use a song in a YouTube video, TikTok, or livestream. No 20-page legal contracts, no complex negotiations — instant cryptographic clearance proof with automatic YouTube Content ID protection.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 shrink-0">
            <button
              onClick={() => setActiveTab('generate')}
              className="px-4 py-2.5 bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-black text-xs font-mono font-extrabold rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-cyan-950/50 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" /> Issue Instant Permission
            </button>
            <button
              onClick={() => setActiveTab('comparison')}
              className="px-4 py-2 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-zinc-300 text-xs font-mono rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Scale className="w-3.5 h-3.5 text-cyan-400" /> Permissions vs. Licensing
            </button>
          </div>
        </div>

        {/* 4 Quick Stat Indicators */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-6 pt-6 border-t border-zinc-800/60">
          <div className="p-3 bg-zinc-950/40 border border-zinc-800/40 rounded-xl space-y-1">
            <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">Active Permissions</span>
            <div className="text-xl font-bold font-mono text-white">{permissions.length} Cleared</div>
            <p className="text-[10px] text-zinc-400">Continuous ledger records</p>
          </div>

          <div className="p-3 bg-zinc-950/40 border border-zinc-800/40 rounded-xl space-y-1">
            <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">Target Reach</span>
            <div className="text-xl font-bold font-mono text-cyan-400">YouTube &amp; TikTok</div>
            <p className="text-[10px] text-zinc-400">Content ID Whitelisted</p>
          </div>

          <div className="p-3 bg-zinc-950/40 border border-zinc-800/40 rounded-xl space-y-1">
            <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">Clearance Speed</span>
            <div className="text-xl font-bold font-mono text-emerald-400">&lt; 3 Seconds</div>
            <p className="text-[10px] text-zinc-400">Instant SHA-256 stamp</p>
          </div>

          <div className="p-3 bg-zinc-950/40 border border-zinc-800/40 rounded-xl space-y-1">
            <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">Attribution Rate</span>
            <div className="text-xl font-bold font-mono text-violet-400">100% Free / Micro</div>
            <p className="text-[10px] text-zinc-400">Zero legal overhead</p>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-zinc-850 pb-2">
        <button
          onClick={() => setActiveTab('generate')}
          className={`px-4 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'generate'
              ? 'bg-cyan-950/70 border border-cyan-500/40 text-cyan-300 shadow-md'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-900/50'
          }`}
        >
          <Zap className="w-3.5 h-3.5 text-cyan-400" />
          1. Quick Clearance Generator
        </button>

        <button
          onClick={() => setActiveTab('ledger')}
          className={`px-4 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'ledger'
              ? 'bg-cyan-950/70 border border-cyan-500/40 text-cyan-300 shadow-md'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-900/50'
          }`}
        >
          <FileText className="w-3.5 h-3.5 text-emerald-400" />
          2. Permissions Ledger ({permissions.length})
        </button>

        <button
          onClick={() => setActiveTab('comparison')}
          className={`px-4 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'comparison'
              ? 'bg-cyan-950/70 border border-cyan-500/40 text-cyan-300 shadow-md'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-900/50'
          }`}
        >
          <Scale className="w-3.5 h-3.5 text-amber-400" />
          3. Permissions vs. Full Licensing
        </button>
      </div>

      {/* ==================================================================== */}
      {/* TAB 1: QUICK CLEARANCE GENERATOR */}
      {/* ==================================================================== */}
      {activeTab === 'generate' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Form: Step-by-Step Generator */}
          <div className="lg:col-span-7 space-y-6">
            <Card className="bg-zinc-950/70 border-zinc-800 text-white rounded-2xl shadow-xl">
              <CardHeader className="pb-4 border-b border-zinc-900">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg font-bold flex items-center gap-2 text-white">
                      <Music className="w-5 h-5 text-cyan-400" />
                      Issue Video Sync Permission
                    </CardTitle>
                    <CardDescription className="text-zinc-400 text-xs mt-1">
                      Grant micro-clearance for your audio track or creative work to a YouTube video, TikTok reel, or stream.
                    </CardDescription>
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2 py-1 rounded bg-cyan-950/50 text-cyan-400 border border-cyan-500/20">
                    ZERO TRUST
                  </span>
                </div>
              </CardHeader>

              <CardContent className="p-6 space-y-6">
                <form onSubmit={handleIssuePermission} className="space-y-6">
                  {/* Step 1: Select Creative IP Work */}
                  <div className="space-y-2.5">
                    <Label className="text-xs font-mono uppercase tracking-wider text-zinc-400 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                        Step 1: Select Audio / Song to Clear
                      </span>
                      {activeAsset && (
                        <span className="text-[10px] text-cyan-400 font-mono lowercase">
                          id: {activeAsset.id}
                        </span>
                      )}
                    </Label>

                    {assets.length === 0 && !loadingAssets ? (
                      <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 text-xs text-zinc-400 flex items-center justify-between">
                        <span>No registered IP assets found yet.</span>
                        {onNavigate && (
                          <button 
                            type="button" 
                            onClick={() => onNavigate(2)} 
                            className="text-cyan-400 hover:underline font-mono text-xs"
                          >
                            Register Asset in Registry &rarr;
                          </button>
                        )}
                      </div>
                    ) : (
                      <select
                        value={selectedAssetId}
                        onChange={(e) => setSelectedAssetId(e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-zinc-200 focus:outline-none focus:border-cyan-500 font-mono"
                      >
                        {assets.map((asset) => (
                          <option key={asset.id} value={asset.id}>
                            {asset.title} ({asset.type || 'IP Asset'})
                          </option>
                        ))}
                      </select>
                    )}

                    {activeAsset && (
                      <div className="p-3 bg-zinc-900/40 border border-zinc-850 rounded-xl flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="p-2 rounded-lg bg-cyan-950/60 border border-cyan-800/40 text-cyan-400 shrink-0">
                            <Music className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-white truncate">{activeAsset.title}</p>
                            <p className="text-[10px] text-zinc-500 font-mono truncate">{activeAsset.type || 'Music / Audio'} • Registered On-Chain</p>
                          </div>
                        </div>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-800/40 shrink-0">
                          Ready for Sync
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Step 2: Choose Platform Preset */}
                  <div className="space-y-2.5">
                    <Label className="text-xs font-mono uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                      Step 2: Choose Content Platform Preset
                    </Label>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {PRESETS.map((preset) => {
                        const Icon = preset.icon;
                        const isSelected = scopePreset === preset.id;
                        return (
                          <div
                            key={preset.id}
                            onClick={() => handleSelectPreset(preset)}
                            className={`p-3 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                              isSelected
                                ? 'bg-cyan-950/40 border-cyan-500/60 text-white shadow-lg'
                                : 'bg-zinc-900/40 border-zinc-850 hover:bg-zinc-900 text-zinc-400 hover:text-zinc-200'
                            }`}
                          >
                            <div className={`p-2 rounded-lg ${isSelected ? 'bg-cyan-900/60 text-cyan-300' : 'bg-zinc-900 text-zinc-500'} shrink-0`}>
                              <Icon className="w-4 h-4" />
                            </div>
                            <div className="space-y-0.5 min-w-0">
                              <p className="text-xs font-bold leading-snug">{preset.title}</p>
                              <p className="text-[10px] text-zinc-400 font-light leading-relaxed line-clamp-2">{preset.desc}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Step 3: Permitted Creator & Video Information */}
                  <div className="space-y-3 pt-2 border-t border-zinc-900">
                    <Label className="text-xs font-mono uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                      Step 3: Permitted Video &amp; Creator Details
                    </Label>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <Label className="text-[11px] text-zinc-400 font-mono">Creator / Channel Name *</Label>
                        <Input
                          placeholder="e.g. Alex Rivera or Jordan Media"
                          value={granteeName}
                          onChange={(e) => setGranteeName(e.target.value)}
                          className="bg-zinc-900 border-zinc-800 text-xs text-white"
                          required
                        />
                      </div>

                      <div className="space-y-1">
                        <Label className="text-[11px] text-zinc-400 font-mono">Social Handle / Channel URL</Label>
                        <Input
                          placeholder="e.g. @alex_creates or youtube.com/@channel"
                          value={granteeHandle}
                          onChange={(e) => setGranteeHandle(e.target.value)}
                          className="bg-zinc-900 border-zinc-800 text-xs text-white font-mono"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <Label className="text-[11px] text-zinc-400 font-mono">Video / Episode Title</Label>
                        <Input
                          placeholder="e.g. Summer Travel Vlog - Tokyo Lights"
                          value={projectTitle}
                          onChange={(e) => setProjectTitle(e.target.value)}
                          className="bg-zinc-900 border-zinc-800 text-xs text-white"
                        />
                      </div>

                      <div className="space-y-1">
                        <Label className="text-[11px] text-zinc-400 font-mono">Video URL (Optional / Post-Publish)</Label>
                        <Input
                          placeholder="https://youtube.com/watch?v=..."
                          value={projectUrl}
                          onChange={(e) => setProjectUrl(e.target.value)}
                          className="bg-zinc-900 border-zinc-800 text-xs text-white font-mono"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Step 4: Clearance Pricing Model */}
                  <div className="space-y-2.5 pt-2 border-t border-zinc-900">
                    <Label className="text-xs font-mono uppercase tracking-wider text-zinc-400 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                        Step 4: Clearance Terms
                      </span>
                      <span className="text-[10px] text-zinc-400">Lightweight Micro-Clearance</span>
                    </Label>

                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => { setPricingType('FREE_ATTRIBUTION'); setMicroFeeAmount(0); }}
                        className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                          pricingType === 'FREE_ATTRIBUTION'
                            ? 'bg-emerald-950/40 border-emerald-500 text-emerald-300 font-bold'
                            : 'bg-zinc-900/40 border-zinc-800 text-zinc-400 hover:text-white'
                        }`}
                      >
                        <div className="text-xs font-bold">100% Free</div>
                        <div className="text-[9px] text-zinc-400 font-mono mt-0.5">Attribution Only</div>
                      </button>

                      <button
                        type="button"
                        onClick={() => { setPricingType('MICRO_FEE'); setMicroFeeAmount(5); }}
                        className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                          pricingType === 'MICRO_FEE'
                            ? 'bg-cyan-950/40 border-cyan-500 text-cyan-300 font-bold'
                            : 'bg-zinc-900/40 border-zinc-800 text-zinc-400 hover:text-white'
                        }`}
                      >
                        <div className="text-xs font-bold">Micro-Fee</div>
                        <div className="text-[9px] text-zinc-400 font-mono mt-0.5">$5 - $25 Flat</div>
                      </button>

                      <button
                        type="button"
                        onClick={() => { setPricingType('MICRO_ROYALTY'); setMicroFeeAmount(0); }}
                        className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                          pricingType === 'MICRO_ROYALTY'
                            ? 'bg-violet-950/40 border-violet-500 text-violet-300 font-bold'
                            : 'bg-zinc-900/40 border-zinc-800 text-zinc-400 hover:text-white'
                        }`}
                      >
                        <div className="text-xs font-bold">5% RevShare</div>
                        <div className="text-[9px] text-zinc-400 font-mono mt-0.5">On Monetized Views</div>
                      </button>
                    </div>

                    {pricingType === 'MICRO_FEE' && (
                      <div className="flex items-center gap-3 p-3 bg-zinc-900/60 border border-zinc-800 rounded-xl">
                        <Coins className="w-4 h-4 text-cyan-400 shrink-0" />
                        <span className="text-xs text-zinc-300 font-mono">Nominal Micro-Clearance Fee (USD):</span>
                        <div className="flex items-center gap-1.5 ml-auto">
                          <span className="text-zinc-500 font-mono text-xs">$</span>
                          <Input
                            type="number"
                            min="1"
                            max="100"
                            value={microFeeAmount}
                            onChange={(e) => setMicroFeeAmount(Number(e.target.value))}
                            className="w-20 bg-zinc-950 border-zinc-800 text-white text-xs font-mono h-8"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={isSubmitting || !activeAsset}
                    className="w-full py-6 bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-black font-extrabold text-sm rounded-xl transition-all shadow-xl shadow-cyan-950/60 cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        Generating Zero-Trust Cryptographic Proof...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Zap className="w-4 h-4" />
                        Issue Instant Permission &amp; Generate Attribution Code
                      </span>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Right Live Preview: What the Creator Gets */}
          <div className="lg:col-span-5 space-y-6">
            {/* Live Card Preview */}
            <Card className="bg-zinc-950/80 border-cyan-500/30 text-white rounded-2xl shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

              <CardHeader className="pb-3 border-b border-zinc-900">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-bold">
                      Live Clearance Slip Preview
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-zinc-500">
                    SOVRANLY IP
                  </span>
                </div>
              </CardHeader>

              <CardContent className="p-5 space-y-4">
                <div className="p-4 bg-zinc-900/60 border border-zinc-800 rounded-xl space-y-3">
                  <div>
                    <span className="text-[9px] font-mono text-zinc-500 uppercase">Music Work</span>
                    <h4 className="text-base font-bold text-white mt-0.5 truncate">
                      {activeAsset?.title || 'Modular Synth Loop Pack Vol. 1'}
                    </h4>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-2 border-t border-zinc-800/60">
                    <div>
                      <span className="text-[9px] text-zinc-500 uppercase block">Platform</span>
                      <span className="text-cyan-300 font-bold">{targetPlatform}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-zinc-500 uppercase block">Creator</span>
                      <span className="text-zinc-200 truncate block">{granteeName || 'Alex Rivera'}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-zinc-800/60 flex items-center justify-between text-xs font-mono">
                    <span className="text-[9px] text-zinc-500 uppercase">Scope</span>
                    <span className="text-emerald-400 font-medium">1 Video Sync (Cleared)</span>
                  </div>
                </div>

                {/* 1-Click Copy Attribution Snippet Box */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400">
                    <span className="flex items-center gap-1.5">
                      <Youtube className="w-3.5 h-3.5 text-red-400" />
                      YouTube / Social Video Description Box Tag
                    </span>
                    <span className="text-[10px] text-zinc-500">Paste in video description</span>
                  </div>

                  <div className="relative bg-black/70 border border-zinc-800 rounded-xl p-3 text-[11px] font-mono text-zinc-300 leading-relaxed group">
                    <pre className="whitespace-pre-wrap select-all">{liveAttributionTag}</pre>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(liveAttributionTag);
                        setCopiedAttribution(true);
                        setTimeout(() => setCopiedAttribution(false), 2000);
                      }}
                      className="absolute top-2 right-2 px-2 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white rounded text-[10px] font-mono flex items-center gap-1 transition-all cursor-pointer"
                    >
                      {copiedAttribution ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      {copiedAttribution ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                </div>

                {/* Protection Benefit Checklist */}
                <div className="p-3 bg-zinc-900/30 border border-zinc-850 rounded-xl space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-emerald-400 text-[11px]">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                    <span>Algorithmic YouTube Content ID safe</span>
                  </div>
                  <div className="flex items-center gap-2 text-emerald-400 text-[11px]">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                    <span>Permanent tamper-proof SHA-256 verification hash</span>
                  </div>
                  <div className="flex items-center gap-2 text-emerald-400 text-[11px]">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                    <span>Public verification URL for platform reviewers</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Education Card */}
            <div className="p-4 bg-zinc-950/50 border border-zinc-850 rounded-2xl space-y-2 text-xs text-zinc-400">
              <div className="flex items-center gap-2 text-zinc-200 font-bold font-mono text-xs">
                <Info className="w-4 h-4 text-cyan-400" />
                Why use Permissions instead of Licensing?
              </div>
              <p className="text-[11px] leading-relaxed text-zinc-400 font-light">
                Traditional commercial licensing agreements require contract law riders, indemnity clauses, and heavy legal fees. Permissions solves the everyday creator use case: granting fast, legitimate, verifiable rights for single videos with clear credit.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* TAB 2: PERMISSIONS LEDGER (ISSUED & ACQUIRED) */}
      {/* ==================================================================== */}
      {activeTab === 'ledger' && (
        <div className="space-y-6">
          {/* Controls & Search */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <Input
                placeholder="Search by track, creator, or PRM code..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-zinc-900 border-zinc-800 text-xs text-white"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
              {['ALL', 'YouTube', 'TikTok', 'Twitch', 'Podcast', 'Independent Film'].map((plat) => (
                <button
                  key={plat}
                  onClick={() => setFilterPlatform(plat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all shrink-0 cursor-pointer ${
                    filterPlatform === plat
                      ? 'bg-cyan-950 border border-cyan-500 text-cyan-300 font-bold'
                      : 'bg-zinc-900/60 border border-zinc-800 text-zinc-400 hover:text-white'
                  }`}
                >
                  {plat}
                </button>
              ))}
            </div>
          </div>

          {/* Ledger Cards Grid */}
          {loadingPermissions ? (
            <div className="p-12 text-center text-zinc-500 font-mono text-xs flex items-center justify-center gap-2">
              <RefreshCw className="w-4 h-4 animate-spin text-cyan-400" />
              Fetching continuous permissions ledger...
            </div>
          ) : filteredPermissions.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-zinc-950/50 border border-zinc-850 space-y-3">
              <p className="text-zinc-400 text-sm">No permissions found matching query.</p>
              <button
                onClick={() => setActiveTab('generate')}
                className="px-4 py-2 bg-cyan-950 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300 text-xs font-mono rounded-xl cursor-pointer"
              >
                Issue First Micro-Permission &rarr;
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredPermissions.map((perm) => (
                <Card key={perm.id} className="bg-zinc-950/80 border-zinc-800 hover:border-cyan-500/40 transition-all rounded-2xl shadow-lg flex flex-col justify-between group">
                  <CardHeader className="pb-3 border-b border-zinc-900/80">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/30">
                        {perm.clearanceCode}
                      </span>
                      <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-800/40 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                        ACTIVE CLEARED
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-white mt-2 truncate" title={perm.assetTitle}>
                      {perm.assetTitle}
                    </h3>
                    <p className="text-[10px] text-zinc-400 font-mono truncate">
                      Artist: {perm.grantorName || 'Sovereign Creator'}
                    </p>
                  </CardHeader>

                  <CardContent className="p-4 space-y-3 text-xs">
                    <div className="space-y-1.5 p-3 rounded-xl bg-zinc-900/40 border border-zinc-850">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-zinc-500 font-mono">CREATOR:</span>
                        <span className="text-zinc-200 font-medium truncate max-w-[160px]">{perm.granteeName}</span>
                      </div>
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-zinc-500 font-mono">PLATFORM:</span>
                        <span className="text-cyan-300 font-mono">{perm.platform}</span>
                      </div>
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-zinc-500 font-mono">PROJECT:</span>
                        <span className="text-zinc-300 truncate max-w-[160px]">{perm.projectTitle}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500 pt-1">
                      <span>ISSUED: {new Date(perm.issuedAt).toLocaleDateString()}</span>
                      <span className="text-emerald-400">
                        {perm.pricingType === 'FREE_ATTRIBUTION' ? 'Free w/ Attribution' : `$${perm.feeAmount} Fee`}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-zinc-900">
                      <button
                        onClick={() => handleCopyAttribution(perm)}
                        className="w-full py-2 px-2.5 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 hover:border-cyan-500/30 text-zinc-300 hover:text-white rounded-xl text-[10px] font-mono flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                        title="Copy YouTube Video Description Attribution Tag"
                      >
                        <Copy className="w-3 h-3 text-cyan-400" />
                        Copy Video Tag
                      </button>

                      <button
                        onClick={() => setActiveModalPermission(perm)}
                        className="w-full py-2 px-2.5 bg-cyan-950/60 hover:bg-cyan-900/80 border border-cyan-500/40 text-cyan-300 rounded-xl text-[10px] font-mono font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                      >
                        <Eye className="w-3 h-3" />
                        View Proof
                      </button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ==================================================================== */}
      {/* TAB 3: PERMISSIONS VS. FULL LICENSING COMPACTS */}
      {/* ==================================================================== */}
      {activeTab === 'comparison' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-zinc-950/80 border border-zinc-800 space-y-6">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Scale className="w-5 h-5 text-cyan-400" />
                Permissions vs. Full Commercial Licensing
              </h2>
              <p className="text-xs text-zinc-400 mt-1 max-w-2xl font-light leading-relaxed">
                Sovranly IP supports both lightweight micro-clearances and full enterprise licensing. Choose the protocol that fits your content and distribution scale.
              </p>
            </div>

            {/* Comparison Matrix Table */}
            <div className="overflow-x-auto rounded-xl border border-zinc-850">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-zinc-900 text-zinc-400 uppercase text-[10px] tracking-wider border-b border-zinc-800">
                  <tr>
                    <th className="p-4">Feature Metric</th>
                    <th className="p-4 text-cyan-400 bg-cyan-950/20">Permissions (Lightweight)</th>
                    <th className="p-4 text-violet-400 bg-violet-950/20">Licensing Compacts (Full)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-850 text-zinc-300">
                  <tr>
                    <td className="p-4 font-bold text-white">Target Audience</td>
                    <td className="p-4 bg-cyan-950/10 text-cyan-200">
                      YouTubers, TikTok creators, streamers, podcasters, indie creators
                    </td>
                    <td className="p-4 bg-violet-950/10 text-violet-200">
                      Film studios, ad agencies, game developers, enterprise software
                    </td>
                  </tr>
                  <tr>
                    <td className="p-4 font-bold text-white">Clearance Scope</td>
                    <td className="p-4 bg-cyan-950/10 text-cyan-200">
                      Single video sync, short clip (60s), or livestream background
                    </td>
                    <td className="p-4 bg-violet-950/10 text-violet-200">
                      Broadcast, global theatrical sync, merchandising, derivative code
                    </td>
                  </tr>
                  <tr>
                    <td className="p-4 font-bold text-white">Paperwork &amp; Time</td>
                    <td className="p-4 bg-cyan-950/10 text-emerald-400 font-bold">
                      Instant 1-click clearance (&lt; 3 seconds)
                    </td>
                    <td className="p-4 bg-violet-950/10">
                      Multi-clause contract covenant, multi-sig counter-signing
                    </td>
                  </tr>
                  <tr>
                    <td className="p-4 font-bold text-white">Cost &amp; Fees</td>
                    <td className="p-4 bg-cyan-950/10 text-emerald-400">
                      100% Free with Attribution, or $5 micro-tip
                    </td>
                    <td className="p-4 bg-violet-950/10">
                      Commercial base fee ($500 - $10,000+) + 85% creator splits
                    </td>
                  </tr>
                  <tr>
                    <td className="p-4 font-bold text-white">Proof of Rights</td>
                    <td className="p-4 bg-cyan-950/10 text-cyan-300">
                      Video description snippet tag &amp; Zero-Trust verification URL
                    </td>
                    <td className="p-4 bg-violet-950/10 text-violet-300">
                      Smart contract NFT license token &amp; formal legal notary slip
                    </td>
                  </tr>
                  <tr>
                    <td className="p-4 font-bold text-white">Copyright Strike Defense</td>
                    <td className="p-4 bg-cyan-950/10 text-cyan-300">
                      Direct link for YouTube dispute box &amp; Content ID whitelisting
                    </td>
                    <td className="p-4 bg-violet-950/10 text-violet-300">
                      Binding arbitration rights, escrow enforcement &amp; chain oracle
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Call to action */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-cyan-950/40 to-emerald-950/40 border border-cyan-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="text-sm font-bold text-white">Need formal enterprise sync for TV or movies?</h4>
                <p className="text-xs text-zinc-400 mt-0.5">Use our full Licensing Compacts with custom legal riders and automated 85/15 splits.</p>
              </div>
              {onNavigate && (
                <button
                  onClick={() => onNavigate(4)}
                  className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-cyan-300 border border-cyan-500/40 rounded-xl text-xs font-mono font-bold shrink-0 transition-all cursor-pointer"
                >
                  Open Full Licensing Hub &rarr;
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* CLEARANCE DETAILS & CERTIFICATE MODAL */}
      {/* ==================================================================== */}
      {activeModalPermission && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-950 border border-cyan-500/40 rounded-2xl max-w-xl w-full p-6 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setActiveModalPermission(null)}
              className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-900 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Modal Header */}
            <div className="space-y-1 pr-8">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-[10px] font-mono font-bold">
                  {activeModalPermission.clearanceCode}
                </span>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
                  AUTHENTIC &amp; ACTIVE
                </span>
              </div>
              <h3 className="text-lg font-bold text-white">Instant Rights Clearance Slip</h3>
              <p className="text-xs text-zinc-400 font-light">
                Continuous Zero-Trust attestation for video &amp; social media usage.
              </p>
            </div>

            {/* Clearance Summary Box */}
            <div className="p-4 bg-zinc-900/60 border border-zinc-800 rounded-xl space-y-2.5 text-xs font-mono">
              <div className="flex items-center justify-between">
                <span className="text-zinc-500">MUSIC WORK:</span>
                <span className="text-white font-bold">{activeModalPermission.assetTitle}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-500">RIGHTS HOLDER:</span>
                <span className="text-cyan-300">{activeModalPermission.grantorName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-500">PERMITTED CREATOR:</span>
                <span className="text-zinc-200">{activeModalPermission.granteeName} ({activeModalPermission.granteeSocialHandle})</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-500">PROJECT / VIDEO:</span>
                <span className="text-emerald-400">{activeModalPermission.projectTitle}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-500">PLATFORM:</span>
                <span className="text-white">{activeModalPermission.platform}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-500">SCOPE:</span>
                <span className="text-zinc-300">{activeModalPermission.scopeTitle}</span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-zinc-800/60">
                <span className="text-zinc-500">HASH:</span>
                <span className="text-cyan-400 truncate max-w-[200px]" title={activeModalPermission.verificationHash}>
                  {activeModalPermission.verificationHash}
                </span>
              </div>
            </div>

            {/* Video Description Snippet */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
                <span>Copy for YouTube Description:</span>
                {copiedAttribution && <span className="text-emerald-400 text-[10px]">Copied to clipboard!</span>}
              </div>
              <div className="p-3 rounded-xl bg-black border border-zinc-800 text-[11px] font-mono text-zinc-300 whitespace-pre-wrap select-all">
                {activeModalPermission.attributionRequirement}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => handleCopyAttribution(activeModalPermission)}
                className="py-2.5 px-3 bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300 font-mono text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" />
                Copy Attribution
              </button>

              <a
                href={`/verify/${activeModalPermission.clearanceCode}`}
                target="_blank"
                rel="noreferrer"
                className="py-2.5 px-3 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-white font-mono text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all"
              >
                <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
                Open Public Proof
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
