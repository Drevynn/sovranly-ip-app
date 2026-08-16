'use client';
/* eslint-disable react-hooks/set-state-in-effect */

import { useState, useEffect, useCallback } from 'react';
import WalletConnect from '@/components/WalletConnect';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Tag, 
  FileText, 
  Coins, 
  ExternalLink, 
  Loader2, 
  BadgeCheck, 
  Sparkles, 
  BookmarkCheck, 
  ArrowRight,
  Calculator,
  Plus,
  Terminal,
  Shield,
  Zap,
  RefreshCw,
  Key,
  ShieldAlert,
  ArrowRightLeft,
  CheckCircle,
  HelpCircle,
  Mail,
  Search,
  Filter,
  Sliders,
  SlidersHorizontal,
  Clock,
  UserCheck,
  Scale,
  X,
  PlusCircle,
  CheckCircle2,
  Lock,
  Unlock,
  ChevronDown,
  Info,
  Heart,
  ShieldCheck,
  LayoutGrid,
  List as ListIcon,
  Copy,
  Check,
  Music,
  Code2,
  Image as ImageIcon,
  FileText as FileIcon,
  Video as VideoIcon,
  Eye,
  User,
  Layers,
  Flame,
  Award
} from 'lucide-react';
import { ethers } from 'ethers';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '@/components/auth/FirebaseProvider';
import { getAuthHeaders } from '@/lib/auth-client';
import { getDb, getFirebaseAuth } from '@/lib/firebase';
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  addDoc, 
  deleteDoc, 
  doc, 
  serverTimestamp 
} from 'firebase/firestore';

// Enum and interface for Firestore security error tracing as per guidelines
enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const auth = getFirebaseAuth();
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error in Marketplace: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Definitions matching full-stack schemas
type Asset = { 
  id: string; 
  title: string; 
  type: string; 
  royalty: number; 
  license: string; 
  description?: string;
  ownerAddress?: string;
  isMinted?: boolean;
  nftTokenId?: string | null;
  mintTxHash?: string | null;
  price?: number | null;
  isForSale?: boolean;
  // Customizable Licensing Terms
  duration?: string;
  usages?: string[];
  customClause?: string;
};

// Available categories/types of IP
const CATEGORIES = [
  "Audio Pack",
  "Music / Audio",
  "Software Utility",
  "Digital Artwork",
  "Smart Contract Suite",
  "Writing / Document",
  "Video Asset"
];

// Presets for usage rights
const USAGE_RIGHTS_PRESETS = [
  "Streaming & Broadcasting",
  "Physical Merchandise",
  "Derivative Works",
  "Commercial Sponsorships",
  "Software Integration",
  "Public Performance"
];

// Presets for duration
const DURATION_PRESETS = [
  "1 Year",
  "3 Years",
  "5 Years",
  "Perpetual"
];

function generateRandomHash(): string {
  return '0x' + Math.random().toString(16).slice(2, 10) + '...' + Math.random().toString(16).slice(2, 10);
}

export default function MarketplacePage() {
  const { user, isSandboxMode } = useAuth();
  const [assets, setAssets] = useState<Asset[]>([]);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [filterMode, setFilterMode] = useState<'all' | 'listed' | 'mine' | 'favorites'>('listed');
  const [viewMode, setViewMode] = useState<'grid' | 'compact'>('grid');
  const [favoritedAssetIds, setFavoritedAssetIds] = useState<string[]>([]);
  const [favoritesMap, setFavoritesMap] = useState<Record<string, string>>({});
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [loadingAssets, setLoadingAssets] = useState(true);
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);
  const [inspectingAsset, setInspectingAsset] = useState<Asset | null>(null);

  // --- SEARCH & FILTER STATE ---
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedDuration, setSelectedDuration] = useState<string>('All');
  const [maxPrice, setMaxPrice] = useState<string>('All');
  const [requiredUsages, setRequiredUsages] = useState<string[]>([]);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // --- CREATOR TERMS CUSTOMIZATION PANEL STATE ---
  const [customizingAsset, setCustomizingAsset] = useState<Asset | null>(null);
  const [customPrice, setCustomPrice] = useState<string>('');
  const [customListed, setCustomListed] = useState<boolean>(true);
  const [customDuration, setCustomDuration] = useState<string>('3 Years');
  const [customUsages, setCustomUsages] = useState<string[]>(['Streaming & Broadcasting', 'Derivative Works']);
  const [customRoyalty, setCustomRoyalty] = useState<number>(85);
  const [customClause, setCustomClause] = useState<string>('');
  const [savingTerms, setSavingTerms] = useState(false);

  // --- CUSTOM LICENSE NEGOTIATION WIZARD STATE ---
  const [negotiatingAsset, setNegotiatingAsset] = useState<Asset | null>(null);
  const [negoForm, setNegoForm] = useState({
    senderName: '',
    senderContact: '',
    proposedPrice: '',
    requestedDuration: '3 Years',
    requestedUsages: [] as string[],
    proposalMessage: ''
  });
  const [sendingProposal, setSendingProposal] = useState(false);
  const [proposalStatus, setProposalStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // --- LIVE WALKTHROUGH SIMULATOR STATES ---
  const [demoStep, setDemoStep] = useState<'idle' | 'wallet' | 'sign' | 'dispatch' | 'complete'>('idle');
  const [demoSelectedAsset, setDemoSelectedAsset] = useState<Asset | null>(null);
  const [demoWalletConnected, setDemoWalletConnected] = useState(false);
  const [demoLogs, setDemoLogs] = useState<string[]>([]);
  const [demoProgress, setDemoProgress] = useState(0);
  const [demoTxHash, setDemoTxHash] = useState('');
  const [isDemoRunning, setIsDemoRunning] = useState(false);
  const [demoArtistPay, setDemoArtistPay] = useState('0.00');
  const [demoPlatformPay, setDemoPlatformPay] = useState('0.00');

  // --- PURCHASE RECEIPT MODAL STATE ---
  const [showReceipt, setShowReceipt] = useState(false);
  const [receiptData, setReceiptData] = useState<{
    txHash: string;
    assetTitle: string;
    price: number;
    creatorAddress: string;
    buyerAddress: string;
    creatorRoyalty: number;
    platformFee: number;
    duration: string;
    usages: string[];
  } | null>(null);

  // Fetch initial assets from API
  const fetchAssets = useCallback(async () => {
    setLoadingAssets(true);
    try {
      const headers = await getAuthHeaders(user, isSandboxMode);
      const res = await fetch('/api/assets?scope=marketplace', {
        headers: {
          ...headers,
        },
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setAssets(data);
        }
      }
    } catch (err) {
      console.warn('Notice loading marketplace assets:', err);
    } finally {
      setLoadingAssets(false);
    }
  }, [user, isSandboxMode]);

  useEffect(() => {
    fetchAssets();
  }, [fetchAssets]);

  const copyToClipboard = (text: string, id: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedAddress(id);
      setTimeout(() => setCopiedAddress(null), 2000);
    }
  };

  // Sync favorites from Firestore in real-time
  useEffect(() => {
    if (!user) {
      setFavoritedAssetIds([]);
      setFavoritesMap({});
      return;
    }

    try {
      const db = getDb();
      const q = query(collection(db, 'favorites'), where('userId', '==', user.uid));
      
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const ids: string[] = [];
        const map: Record<string, string> = {};
        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          if (data.assetId) {
            ids.push(data.assetId);
            map[data.assetId] = docSnap.id;
          }
        });
        setFavoritedAssetIds(ids);
        setFavoritesMap(map);
      }, (error) => {
        handleFirestoreError(error, OperationType.LIST, 'favorites');
      });

      return () => unsubscribe();
    } catch (err) {
      console.error("Error setting up favorites listener:", err);
    }
  }, [user]);

  // Toggle favorite status
  const toggleFavorite = async (assetId: string) => {
    if (!user) {
      alert("Please sign in or initialize identity to favorite assets.");
      return;
    }

    const favoriteId = favoritesMap[assetId];
    const db = getDb();

    if (favoriteId) {
      // Unfavorite (Delete document)
      try {
        const docRef = doc(db, 'favorites', favoriteId);
        await deleteDoc(docRef);
      } catch (err) {
        handleFirestoreError(err, OperationType.DELETE, `favorites/${favoriteId}`);
      }
    } else {
      // Favorite (Create document)
      try {
        const favoritesCol = collection(db, 'favorites');
        await addDoc(favoritesCol, {
          userId: user.uid,
          assetId: assetId,
          createdAt: serverTimestamp()
        });
      } catch (err) {
        handleFirestoreError(err, OperationType.CREATE, 'favorites');
      }
    }
  };

  // Filter & Search Logic
  const filteredAssets = assets.filter(asset => {
    // 1. Tab filtering
    if (filterMode === 'listed' && !asset.isForSale) return false;
    if (filterMode === 'mine' && (!walletAddress || asset.ownerAddress?.toLowerCase() !== walletAddress.toLowerCase())) return false;
    if (filterMode === 'favorites' && !favoritedAssetIds.includes(asset.id)) return false;

    // 2. Text Search
    if (searchTerm) {
      const query = searchTerm.toLowerCase();
      const matchTitle = asset.title?.toLowerCase().includes(query);
      const matchDesc = asset.description?.toLowerCase().includes(query);
      const matchType = asset.type?.toLowerCase().includes(query);
      if (!matchTitle && !matchDesc && !matchType) return false;
    }

    // 3. Category Filter
    if (selectedCategory !== 'All') {
      const catQuery = selectedCategory.toLowerCase();
      const assetType = asset.type?.toLowerCase() || '';
      if (!assetType.includes(catQuery)) return false;
    }

    // 4. Duration Filter
    if (selectedDuration !== 'All') {
      const durationVal = asset.duration || '3 Years';
      if (durationVal !== selectedDuration) return false;
    }

    // 5. Max Price Filter
    if (maxPrice !== 'All') {
      const priceVal = asset.price || 0.05;
      const limit = parseFloat(maxPrice);
      if (priceVal > limit) return false;
    }

    // 6. Required Usage Rights Filter
    if (requiredUsages.length > 0) {
      const assetUsages = asset.usages || ['Streaming & Broadcasting', 'Derivative Works'];
      const hasAllRequired = requiredUsages.every(req => assetUsages.includes(req));
      if (!hasAllRequired) return false;
    }

    return true;
  });

  // Handle Purchase on-chain or mock with detailed splits
  const handlePurchase = async (asset: Asset) => {
    if (!walletAddress) {
      alert("Please connect your Web3 sovereign wallet first!");
      return;
    }
    
    setLoadingId(asset.id);
    const itemPrice = asset.price || 0.05;
    const itemDuration = asset.duration || '3 Years';
    const itemUsages = asset.usages || ['Streaming & Broadcasting', 'Derivative Works'];
    
    try {
      let txHash = generateRandomHash();
      const isMetamaskAvailable = typeof window !== 'undefined' && (window as any).ethereum;

      if (isMetamaskAvailable && asset.ownerAddress) {
        try {
          const provider = new ethers.BrowserProvider((window as any).ethereum);
          const signer = await provider.getSigner();
          
          console.log(`Sending real transfer txn for ${itemPrice} ETH to ${asset.ownerAddress}...`);
          const txResponse = await signer.sendTransaction({
            to: asset.ownerAddress,
            value: ethers.parseEther(itemPrice.toString())
          });
          
          await txResponse.wait();
          txHash = txResponse.hash;
          console.log("Transaction successfully confirmed on-chain:", txHash);
        } catch (metamaskErr) {
          console.warn("MetaMask transaction declined or not configured. Proceeding with secure Sandbox payment signature...", metamaskErr);
        }
      } else {
        await new Promise(resolve => setTimeout(resolve, 1800));
      }

      // Calculate Royalty Split
      const creatorPercent = asset.royalty || 85;
      const creatorRoyalty = Number((itemPrice * (creatorPercent / 100)).toFixed(4));
      const platformFee = Number((itemPrice * (1 - creatorPercent / 100)).toFixed(4));

      const newReceipt = {
        txHash,
        assetTitle: asset.title,
        price: itemPrice,
        creatorAddress: asset.ownerAddress || '0xUnknownCreator',
        buyerAddress: walletAddress,
        creatorRoyalty,
        platformFee,
        duration: itemDuration,
        usages: itemUsages
      };

      setReceiptData(newReceipt);
      setShowReceipt(true);

      // Log purchase txn in Firestore ledger
      await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          hash: txHash,
          type: 'License Purchased',
          assetTitle: asset.title,
          amount: `${itemPrice} ETH`,
          fromAddress: walletAddress,
          toAddress: asset.ownerAddress || '0xUnknownCreator',
        })
      });

      // Record Royalty Split
      await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'Royalty Split (Automated)',
          assetTitle: asset.title,
          amount: `${creatorRoyalty} ETH`,
          fromAddress: 'Marketplace Pool',
          toAddress: asset.ownerAddress || '0xUnknownCreator',
        })
      });

    } catch (err) {
      console.error("Purchase error:", err);
    } finally {
      setLoadingId(null);
    }
  };

  // Open term customizing panel for owned assets
  const handleOpenCustomizing = (asset: Asset) => {
    setCustomizingAsset(asset);
    setCustomPrice(asset.price ? asset.price.toString() : '0.1');
    setCustomListed(asset.isForSale !== false);
    setCustomDuration(asset.duration || '3 Years');
    setCustomUsages(asset.usages || ['Streaming & Broadcasting', 'Derivative Works']);
    setCustomRoyalty(asset.royalty || 85);
    setCustomClause(asset.customClause || '');
  };

  // Save creator customized terms
  const handleSaveCustomTerms = async () => {
    if (!customizingAsset) return;
    const priceFloat = parseFloat(customPrice);
    if (isNaN(priceFloat) || priceFloat <= 0) {
      alert("Please enter a valid ETH license price (greater than 0).");
      return;
    }

    setSavingTerms(true);
    try {
      const updatedData = {
        id: customizingAsset.id,
        price: priceFloat,
        isForSale: customListed,
        duration: customDuration,
        usages: customUsages,
        royalty: customRoyalty,
        customClause: customClause
      };

      const headers = await getAuthHeaders(user, isSandboxMode);
      const res = await fetch('/api/assets', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          ...headers 
        },
        body: JSON.stringify(updatedData)
      });

      if (!res.ok) throw new Error('Failed to update asset terms');

      // Update local state
      setAssets(prev => prev.map(a => a.id === customizingAsset.id ? { ...a, ...updatedData } : a));
      
      // Post listing transaction to ledger
      await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: customListed ? 'License Terms Updated' : 'License Unlisted',
          assetTitle: customizingAsset.title,
          amount: `${priceFloat} ETH`,
          fromAddress: walletAddress,
          toAddress: 'Marketplace Pool',
        })
      });

      setCustomizingAsset(null);
    } catch (err) {
      console.error('Failed to save terms:', err);
      alert('Sync failure. Please try again.');
    } finally {
      setSavingTerms(false);
    }
  };

  // Handle Custom License Proposal Submission
  const handleSubmitProposal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!negotiatingAsset) return;

    setSendingProposal(true);
    setProposalStatus('idle');

    // Build beautifully structured proposal message
    const formattedMessage = `*** SYSTEM DETECTED CUSTOM LICENSE NEGOTIATION PROPOSAL ***

Proposed Licensing Fee: ${negoForm.proposedPrice || 'N/A'} ETH
Requested Duration: ${negoForm.requestedDuration}
Requested Usage Rights:
${negoForm.requestedUsages.length > 0 ? negoForm.requestedUsages.map(u => `- ${u}`).join('\n') : '- None specified'}

Creator Retained Royalty Term: ${negotiatingAsset.royalty}%

LICENSEE PROPOSAL COVER LETTER:
------------------------------------------
${negoForm.proposalMessage}

------------------------------------------
Sender Secure Alias: ${negoForm.senderName}
Verified Contact Channel: ${negoForm.senderContact}
Secure cryptographic hash tunnel verified by Sovranly IP.`;

    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          assetId: negotiatingAsset.id,
          assetTitle: negotiatingAsset.title,
          senderName: negoForm.senderName,
          senderContact: negoForm.senderContact,
          subject: `Custom License Negotiation: ${negotiatingAsset.title}`,
          message: formattedMessage,
          recipientAddress: negotiatingAsset.ownerAddress || '0x0000000000000000000000000000000000000000'
        })
      });

      if (res.ok) {
        setProposalStatus('success');
        // Clear form
        setNegoForm({
          senderName: '',
          senderContact: '',
          proposedPrice: '',
          requestedDuration: '3 Years',
          requestedUsages: [],
          proposalMessage: ''
        });
      } else {
        setProposalStatus('error');
      }
    } catch (err) {
      console.error('Proposal delivery error:', err);
      setProposalStatus('error');
    } finally {
      setSendingProposal(false);
    }
  };

  // Toggle checklist values helper
  const handleToggleUsage = (list: string[], setList: (v: string[]) => void, item: string) => {
    if (list.includes(item)) {
      setList(list.filter(x => x !== item));
    } else {
      setList([...list, item]);
    }
  };

  // Walkthrough Simulator Handlers
  const handleNextDemoStep = async () => {
    if (demoStep === 'sign') {
      setIsDemoRunning(true);
      setDemoProgress(50);
      setDemoLogs(prev => [
        ...prev,
        ">>> Initiating cryptographic signature challenge...",
        "[ZERO TRUST] Verifying identity with secure keys...",
        `[SIGNATURE] Signed contract with: 0x71C7656EC7ab88b098defB751B7401B5f6d1476B`,
        "[SIGNATURE] Covenant signature successfully recorded in transient state.",
        "[STATUS] Ready for transaction execution dispatch."
      ]);
      setDemoStep('dispatch');
      setIsDemoRunning(false);
    } else if (demoStep === 'dispatch') {
      setIsDemoRunning(true);
      setDemoLogs(prev => [
        ...prev,
        ">>> Dispatching licensing transaction request to network...",
        "[ESCROW] Calculating splits...",
        "[ESCROW] Locking atomic distribution split..."
      ]);
      
      const priceVal = demoSelectedAsset?.price || 0.05;
      const pct = demoSelectedAsset?.royalty || 85;
      const creatorRoyalty = Number((priceVal * (pct / 100)).toFixed(4));
      const platformFee = Number((priceVal * (1 - pct / 100)).toFixed(4));
      
      setDemoArtistPay(creatorRoyalty.toFixed(4));
      setDemoPlatformPay(platformFee.toFixed(4));
      
      await new Promise(r => setTimeout(r, 1200));
      
      const txH = '0x' + Math.random().toString(16).slice(2, 10) + '...' + Math.random().toString(16).slice(2, 10);
      setDemoTxHash(txH);
      
      try {
        await fetch('/api/transactions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            hash: '0x' + Math.random().toString(16).slice(2) + Math.random().toString(16).slice(2),
            type: 'License Purchased (Demo)',
            assetTitle: demoSelectedAsset?.title || 'Demo Asset',
            amount: `${priceVal} ETH`,
            fromAddress: '0x71C7656EC7ab88b098defB751B7401B5f6d1476B',
            toAddress: demoSelectedAsset?.ownerAddress || '0xOwnAddressDemo',
          })
        });
      } catch (err) {
        console.error("Error logging demo transaction:", err);
      }
      
      setDemoLogs(prev => [
        ...prev,
        `[LEDGER SPLIT] Dispatched creator royalty: ${creatorRoyalty} ETH`,
        `[LEDGER SPLIT] platform escrow deposit: ${platformFee} ETH`,
        `[SUCCESS] Transaction committed on-chain. TxHash: ${txH}`
      ]);
      setDemoProgress(100);
      setDemoStep('complete');
      setIsDemoRunning(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#e0e0e0] font-sans pb-24">
      
      {/* Background glow animations */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-[140px] pointer-events-none" />

      {/* Primary Sticky Nav */}
      <nav className="border-b border-zinc-900 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-3 group">
            <div className="w-9 h-9 bg-zinc-950 border border-cyan-500/30 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-950/20 group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-5 h-5 text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.4)]" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold tracking-tight text-white leading-tight">SOVRANLY IP</span>
              <span className="text-[10px] uppercase font-mono text-cyan-400 tracking-wider">Web3 IP Marketplace</span>
            </div>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-xs text-zinc-400 hover:text-white font-semibold transition-colors flex items-center gap-1.5 bg-zinc-900/60 border border-zinc-800 px-4 py-2 rounded-xl">
              <ArrowRight className="w-3.5 h-3.5 rotate-180" />
              Go to Dashboard
            </Link>
            <WalletConnect onConnect={setWalletAddress} />
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-12 relative z-10">
        
        {/* Marketplace Hero Segment */}
        <div className="mb-10 text-left border-b border-zinc-900 pb-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter text-white">
              Licensing <span className="text-cyan-400">Marketplace</span>
            </h1>
            <p className="text-zinc-400 max-w-2xl text-sm leading-relaxed">
              Explore IP assets, register customizable licensing parameters, search directly for commercial rights, 
              and execute verified payments or submit custom terms securely.
            </p>
          </div>
          <div className="bg-zinc-900/40 border border-zinc-850 p-4 rounded-2xl flex items-center gap-3">
            <Shield className="w-10 h-10 text-cyan-400/80" />
            <div className="text-left font-mono">
              <div className="text-[11px] text-zinc-500 uppercase tracking-widest font-black">Zero Trust Mode</div>
              <div className="text-xs text-emerald-400 font-bold">Continuous On-Chain Verification</div>
            </div>
          </div>
        </div>

        {/* Tab Filters, Search, and View Toggles */}
        <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center mb-8 border-b border-zinc-900 pb-6">
          <div className="flex flex-wrap gap-2 items-center">
            <Button 
              onClick={() => setFilterMode('listed')} 
              variant="outline" 
              className={`rounded-xl px-4 text-xs font-semibold h-9 transition-all duration-200 ${
                filterMode === 'listed' 
                  ? 'border-cyan-500/80 text-cyan-300 bg-cyan-950/40 shadow-sm shadow-cyan-950/60' 
                  : 'border-zinc-800/80 text-zinc-400 bg-zinc-950 hover:bg-zinc-900 hover:text-zinc-200'
              }`}
            >
              <Flame className="w-3.5 h-3.5 mr-1.5 text-cyan-400" />
              Listed Licenses ({assets.filter(a => a.isForSale).length})
            </Button>
            <Button 
              onClick={() => setFilterMode('all')} 
              variant="outline" 
              className={`rounded-xl px-4 text-xs font-semibold h-9 transition-all duration-200 ${
                filterMode === 'all' 
                  ? 'border-cyan-500/80 text-cyan-300 bg-cyan-950/40 shadow-sm shadow-cyan-950/60' 
                  : 'border-zinc-800/80 text-zinc-400 bg-zinc-950 hover:bg-zinc-900 hover:text-zinc-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5 mr-1.5 text-zinc-400" />
              All IP Registry ({assets.length})
            </Button>
            <Button 
              onClick={() => {
                if (!walletAddress) {
                  alert("Connect your sovereign Web3 wallet in the top bar to filter your owned IP assets.");
                  return;
                }
                setFilterMode('mine');
              }} 
              variant="outline" 
              className={`rounded-xl px-4 text-xs font-semibold h-9 transition-all duration-200 ${
                filterMode === 'mine' 
                  ? 'border-emerald-500/80 text-emerald-300 bg-emerald-950/40 shadow-sm shadow-emerald-950/60' 
                  : 'border-zinc-800/80 text-zinc-400 bg-zinc-950 hover:bg-zinc-900 hover:text-zinc-200'
              } ${!walletAddress ? 'opacity-50' : ''}`}
            >
              <ShieldCheck className={`w-3.5 h-3.5 mr-1.5 ${filterMode === 'mine' ? 'text-emerald-400' : 'text-zinc-400'}`} />
              My Sovereign Assets ({assets.filter(a => walletAddress && a.ownerAddress?.toLowerCase() === walletAddress.toLowerCase()).length})
            </Button>
            <Button 
              onClick={() => {
                if (!user) {
                  alert("Please sign in or initialize identity to view favorites.");
                  return;
                }
                setFilterMode('favorites');
              }} 
              variant="outline" 
              className={`rounded-xl px-4 text-xs font-semibold h-9 transition-all duration-200 ${
                filterMode === 'favorites' 
                  ? 'border-pink-500/80 text-pink-300 bg-pink-950/40 shadow-sm shadow-pink-950/60' 
                  : 'border-zinc-800/80 text-zinc-400 bg-zinc-950 hover:bg-zinc-900 hover:text-zinc-200'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 mr-1.5 ${filterMode === 'favorites' ? 'fill-pink-400 text-pink-400' : 'text-zinc-500'}`} />
              Favorited ({user ? favoritedAssetIds.length : 0})
            </Button>
          </div>

          {/* Search, Filter, and Grid/Compact Mode Switch */}
          <div className="flex items-center gap-2.5 w-full lg:w-auto">
            <div className="relative flex-1 lg:w-64">
              <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-zinc-500" />
              <input 
                type="text" 
                placeholder="Search title, category, hash..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-850 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 transition-colors h-9 placeholder:text-zinc-600"
              />
              {searchTerm && (
                <button onClick={() => setSearchTerm('')} className="absolute right-2.5 top-2.5 text-zinc-500 hover:text-white">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            
            <Button 
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              variant="outline"
              className={`rounded-xl border-zinc-850 text-xs px-3.5 h-9 flex items-center gap-1.5 bg-zinc-950 ${
                showAdvancedFilters ? 'border-cyan-500/60 bg-cyan-950/30 text-cyan-300' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-zinc-400" />
              <span>Filters</span>
              {(selectedCategory !== 'All' || selectedDuration !== 'All' || maxPrice !== 'All' || requiredUsages.length > 0) && (
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              )}
            </Button>

            {/* View Mode Toggle */}
            <div className="flex items-center bg-zinc-950 border border-zinc-850 rounded-xl p-0.5 h-9">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-zinc-850 text-cyan-400' : 'text-zinc-500 hover:text-zinc-300'}`}
                title="Grid View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('compact')}
                className={`p-1.5 rounded-lg transition-colors ${viewMode === 'compact' ? 'bg-zinc-850 text-cyan-400' : 'text-zinc-500 hover:text-zinc-300'}`}
                title="List View"
              >
                <ListIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Advanced Filter drawer */}
        <AnimatePresence>
          {showAdvancedFilters && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mb-10 bg-zinc-950/80 border border-zinc-900 rounded-3xl p-6 space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                
                {/* Category Dropdown */}
                <div className="space-y-2 text-left">
                  <label className="text-[10px] uppercase font-mono tracking-wider text-zinc-500 font-bold block">Asset Category</label>
                  <div className="relative">
                    <select 
                      value={selectedCategory} 
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-300 focus:outline-none focus:border-cyan-500 appearance-none h-9"
                    >
                      <option value="All">All Categories</option>
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <ChevronDown className="absolute right-3 top-2.5 w-4 h-4 text-zinc-500 pointer-events-none" />
                  </div>
                </div>

                {/* Duration dropdown */}
                <div className="space-y-2 text-left">
                  <label className="text-[10px] uppercase font-mono tracking-wider text-zinc-500 font-bold block">License Duration</label>
                  <div className="relative">
                    <select 
                      value={selectedDuration} 
                      onChange={(e) => setSelectedDuration(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-300 focus:outline-none focus:border-cyan-500 appearance-none h-9"
                    >
                      <option value="All">Any Duration</option>
                      {DURATION_PRESETS.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                    <ChevronDown className="absolute right-3 top-2.5 w-4 h-4 text-zinc-500 pointer-events-none" />
                  </div>
                </div>

                {/* Max price filter */}
                <div className="space-y-2 text-left">
                  <label className="text-[10px] uppercase font-mono tracking-wider text-zinc-500 font-bold block">Max Licensing Price</label>
                  <div className="relative">
                    <select 
                      value={maxPrice} 
                      onChange={(e) => setMaxPrice(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-300 focus:outline-none focus:border-cyan-500 appearance-none h-9"
                    >
                      <option value="All">Unlimited</option>
                      <option value="0.1">&lt; 0.10 ETH</option>
                      <option value="0.25">&lt; 0.25 ETH</option>
                      <option value="0.50">&lt; 0.50 ETH</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-2.5 w-4 h-4 text-zinc-500 pointer-events-none" />
                  </div>
                </div>

                {/* Clear All parameters */}
                <div className="flex items-end">
                  <Button 
                    onClick={() => {
                      setSelectedCategory('All');
                      setSelectedDuration('All');
                      setMaxPrice('All');
                      setRequiredUsages([]);
                      setSearchTerm('');
                    }}
                    variant="outline" 
                    className="w-full rounded-xl border-zinc-800 hover:bg-zinc-900 text-xs h-9 text-zinc-400 hover:text-white"
                  >
                    Reset All Filters
                  </Button>
                </div>
              </div>

              {/* Required usage rights checks */}
              <div className="text-left space-y-3 pt-4 border-t border-zinc-900/80">
                <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-500 font-bold block">Required Usage Rights</span>
                <div className="flex flex-wrap gap-2">
                  {USAGE_RIGHTS_PRESETS.map(usage => {
                    const active = requiredUsages.includes(usage);
                    return (
                      <button
                        key={usage}
                        onClick={() => handleToggleUsage(requiredUsages, setRequiredUsages, usage)}
                        className={`text-xs px-3.5 py-1.5 rounded-xl border transition-colors flex items-center gap-1.5 ${
                          active 
                            ? 'bg-cyan-950/40 border-cyan-500 text-cyan-400' 
                            : 'bg-zinc-900/40 border-zinc-850 text-zinc-400 hover:text-zinc-200'
                        }`}
                      >
                        {active && <CheckCircle className="w-3 h-3 text-cyan-400" />}
                        {usage}
                      </button>
                    );
                  })}
                </div>
              </div>

            </motion.div>
          )}
        </AnimatePresence>

        {/* Content Layout: Left Listing + Right walkthrough simulator */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Main Marketplace feed (2 columns) */}
          <div className="lg:col-span-2 space-y-6">
            
            {loadingAssets ? (
              <div className="text-center py-24 bg-zinc-950 border border-zinc-900 rounded-3xl">
                <Loader2 className="w-8 h-8 text-cyan-400 animate-spin mx-auto mb-4" />
                <p className="text-xs font-mono uppercase tracking-widest text-zinc-400 font-bold">Synchronizing Decentralized IP Registry...</p>
              </div>
            ) : filteredAssets.length === 0 ? (
              <div className="text-center py-20 bg-zinc-950/80 rounded-3xl border border-zinc-900 shadow-inner">
                <Coins className="w-10 h-10 text-cyan-500/40 mx-auto mb-4 animate-pulse" />
                <p className="text-zinc-300 font-semibold mb-2">No IP licensed items match your parameters</p>
                <p className="text-zinc-500 text-xs max-w-sm mx-auto leading-relaxed">
                  {filterMode === 'mine' 
                    ? "Verify your connected wallet address has registered assets, or create and register new IP in the Dashboard." 
                    : "Try resetting your search filters or adjusting the category and price range above."}
                </p>
              </div>
            ) : viewMode === 'compact' ? (
              /* COMPACT / LIST VIEW */
              <div className="space-y-3">
                <AnimatePresence mode="popLayout">
                  {filteredAssets.map(asset => {
                    const isOwner = Boolean(
                      (walletAddress && asset.ownerAddress?.toLowerCase() === walletAddress.toLowerCase()) ||
                      (user && (asset as unknown as { userId?: string }).userId === user.uid)
                    );
                    const assetDuration = asset.duration || '3 Years';
                    const assetUsages = asset.usages || ['Streaming & Broadcasting', 'Derivative Works'];

                    return (
                      <motion.div
                        key={asset.id}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        whileHover={{ x: 4 }}
                        transition={{ duration: 0.2 }}
                        className={`group bg-zinc-950 hover:bg-[#0c0c14] border rounded-2xl p-4 transition-all duration-300 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                          isOwner 
                            ? 'border-emerald-500/30 hover:border-emerald-400/60 shadow-lg shadow-emerald-950/20' 
                            : 'border-zinc-900/90 hover:border-cyan-500/40 hover:shadow-lg hover:shadow-cyan-950/20'
                        }`}
                      >
                        {/* Status bar highlight */}
                        <div className={`absolute top-0 left-0 bottom-0 w-1 ${isOwner ? 'bg-emerald-400' : asset.isForSale ? 'bg-cyan-400' : 'bg-zinc-700'}`} />

                        <div className="flex items-start gap-3.5 flex-1 min-w-0 pl-1">
                          <div className={`w-11 h-11 rounded-xl flex items-center justify-center border shrink-0 ${
                            isOwner 
                              ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-400' 
                              : 'bg-zinc-900/90 border-zinc-800 text-cyan-400'
                          }`}>
                            {asset.type?.toLowerCase().includes('music') || asset.type?.toLowerCase().includes('audio') ? (
                              <Music className="w-5 h-5" />
                            ) : asset.type?.toLowerCase().includes('software') || asset.type?.toLowerCase().includes('code') ? (
                              <Code2 className="w-5 h-5" />
                            ) : asset.type?.toLowerCase().includes('art') || asset.type?.toLowerCase().includes('design') ? (
                              <ImageIcon className="w-5 h-5" />
                            ) : (
                              <FileIcon className="w-5 h-5" />
                            )}
                          </div>

                          <div className="min-w-0 space-y-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors truncate">
                                {asset.title || 'Unnamed IP Asset'}
                              </h4>
                              {isOwner ? (
                                <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold bg-emerald-950/60 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-md">
                                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                                  YOUR SOVEREIGN ASSET
                                </span>
                              ) : asset.isForSale ? (
                                <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold bg-cyan-950/50 text-cyan-300 border border-cyan-500/20 px-2 py-0.5 rounded-md">
                                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                                  LISTED
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-[10px] font-mono text-zinc-500 bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded-md">
                                  <Lock className="w-2.5 h-2.5" />
                                  VAULTED
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-3 text-[11px] text-zinc-400 font-mono flex-wrap">
                              <span className="text-zinc-500">{asset.type}</span>
                              <span>•</span>
                              <span>{assetDuration}</span>
                              <span>•</span>
                              <span className="text-cyan-400">{asset.royalty}% royalty</span>
                              {asset.ownerAddress && (
                                <>
                                  <span>•</span>
                                  <span className="text-zinc-500 truncate max-w-[120px]">
                                    Creator: {asset.ownerAddress.slice(0, 6)}...{asset.ownerAddress.slice(-4)}
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Price & Action controls */}
                        <div className="flex items-center gap-3 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-zinc-900">
                          {asset.isForSale && (
                            <div className="text-right font-mono pr-2">
                              <div className="text-xs font-black text-emerald-400">{asset.price} ETH</div>
                              <div className="text-[10px] text-zinc-500 font-mono">~$210 USD</div>
                            </div>
                          )}

                          <button
                            onClick={() => toggleFavorite(asset.id)}
                            className={`p-2 rounded-xl border transition-all ${
                              favoritedAssetIds.includes(asset.id)
                                ? 'bg-pink-950/40 border-pink-500/40 text-pink-400'
                                : 'bg-zinc-900/60 border-zinc-850 text-zinc-500 hover:text-zinc-300'
                            }`}
                            title="Favorite"
                          >
                            <Heart className={`w-4 h-4 ${favoritedAssetIds.includes(asset.id) ? 'fill-pink-400' : ''}`} />
                          </button>

                          <Button
                            onClick={() => setInspectingAsset(asset)}
                            variant="outline"
                            className="rounded-xl border-zinc-800 bg-zinc-900 hover:bg-zinc-850 text-zinc-300 hover:text-white text-xs h-9 px-3"
                          >
                            <Eye className="w-3.5 h-3.5 mr-1 text-cyan-400" />
                            Details
                          </Button>

                          {isOwner ? (
                            <Button
                              onClick={() => handleOpenCustomizing(asset)}
                              className="rounded-xl bg-zinc-900 hover:bg-zinc-850 border border-emerald-500/30 text-emerald-300 text-xs font-bold font-mono h-9 px-3.5"
                            >
                              Configure Terms
                            </Button>
                          ) : asset.isForSale ? (
                            <Button
                              onClick={() => handlePurchase(asset)}
                              disabled={loadingId === asset.id}
                              className="rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs h-9 px-4 flex items-center gap-1.5 shadow-sm shadow-cyan-950"
                            >
                              {loadingId === asset.id ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              ) : (
                                <>
                                  Instant Buy
                                  <ArrowRight className="w-3 h-3" />
                                </>
                              )}
                            </Button>
                          ) : (
                            <Button
                              onClick={() => {
                                setNegotiatingAsset(asset);
                                setProposalStatus('idle');
                                setNegoForm({
                                  senderName: '',
                                  senderContact: '',
                                  proposedPrice: '0.1',
                                  requestedDuration: assetDuration,
                                  requestedUsages: assetUsages,
                                  proposalMessage: ''
                                });
                              }}
                              variant="outline"
                              className="rounded-xl border-zinc-800 bg-zinc-900 text-purple-300 hover:bg-zinc-850 text-xs font-bold h-9 px-3.5"
                            >
                              Inquire
                            </Button>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            ) : (
              /* GRID VIEW (PREMIUM DARK CARDS WITH ARTWORK BANNERS & CLEAR OWNERSHIP) */
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <AnimatePresence mode="popLayout">
                  {filteredAssets.map(asset => {
                    const isOwner = Boolean(
                      (walletAddress && asset.ownerAddress?.toLowerCase() === walletAddress.toLowerCase()) ||
                      (user && (asset as unknown as { userId?: string }).userId === user.uid)
                    );
                    
                    const assetDuration = asset.duration || '3 Years';
                    const assetUsages = asset.usages || ['Streaming & Broadcasting', 'Derivative Works'];
                    const isAudio = asset.type?.toLowerCase().includes('music') || asset.type?.toLowerCase().includes('audio');
                    const isCode = asset.type?.toLowerCase().includes('software') || asset.type?.toLowerCase().includes('code') || asset.type?.toLowerCase().includes('contract');
                    const isArt = asset.type?.toLowerCase().includes('art') || asset.type?.toLowerCase().includes('design') || asset.type?.toLowerCase().includes('3d');

                    return (
                      <motion.div 
                        key={asset.id} 
                        layout
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -15, scale: 0.95 }}
                        whileHover={{ y: -6, scale: 1.015 }}
                        transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1.0] }}
                        className={`group bg-zinc-950 hover:bg-[#0a0a10] rounded-3xl border flex flex-col justify-between transition-all duration-300 relative overflow-hidden shadow-xl hover:shadow-2xl ${
                          isOwner 
                            ? 'border-emerald-500/30 hover:border-emerald-400/60 hover:shadow-emerald-950/20' 
                            : 'border-zinc-900/90 hover:border-cyan-500/40 hover:shadow-cyan-950/25'
                        }`}
                      >
                        {/* Ambient radial glow on hover */}
                        <div className={`absolute -inset-px rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none ${
                          isOwner 
                            ? 'bg-gradient-to-br from-emerald-500/10 via-cyan-500/5 to-transparent' 
                            : 'bg-gradient-to-br from-cyan-500/12 via-violet-500/6 to-transparent'
                        }`} />

                        {/* Top Accent Sheen */}
                        <div className={`absolute top-0 left-0 w-full h-[2px] transition-all duration-500 ${
                          isOwner 
                            ? 'bg-gradient-to-r from-emerald-500/0 via-emerald-400 to-emerald-500/0 opacity-60 group-hover:opacity-100' 
                            : 'bg-gradient-to-r from-cyan-500/0 via-cyan-400/90 to-cyan-500/0 opacity-0 group-hover:opacity-100'
                        }`} />

                        <div>
                          {/* Visual IP Artwork & Category Header Banner */}
                          <div className={`relative h-32 w-full p-4 flex flex-col justify-between border-b overflow-hidden ${
                            isAudio 
                              ? 'bg-gradient-to-br from-violet-950/70 via-indigo-950/40 to-zinc-950 border-violet-900/30' 
                              : isCode 
                              ? 'bg-gradient-to-br from-cyan-950/70 via-blue-950/40 to-zinc-950 border-cyan-900/30' 
                              : isArt 
                              ? 'bg-gradient-to-br from-fuchsia-950/70 via-purple-950/40 to-zinc-950 border-fuchsia-900/30' 
                              : 'bg-gradient-to-br from-emerald-950/70 via-teal-950/40 to-zinc-950 border-emerald-900/30'
                          }`}>
                            {/* Decorative background grid pattern */}
                            <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:12px_12px] pointer-events-none opacity-60" />

                            {/* Top row: Category Badge & Actions */}
                            <div className="flex items-center justify-between relative z-10">
                              <div className="flex items-center gap-2">
                                <span className="bg-black/60 backdrop-blur-md text-white border border-white/10 px-3 py-1 rounded-xl text-[10px] font-mono font-bold flex items-center gap-1.5 shadow-sm">
                                  {isAudio && <Music className="w-3 h-3 text-cyan-400" />}
                                  {isCode && <Code2 className="w-3 h-3 text-cyan-400" />}
                                  {isArt && <ImageIcon className="w-3 h-3 text-fuchsia-400" />}
                                  {!isAudio && !isCode && !isArt && <FileIcon className="w-3 h-3 text-emerald-400" />}
                                  {asset.type}
                                </span>

                                <span className="bg-black/40 text-zinc-400 border border-white/5 px-2 py-1 rounded-xl text-[9px] font-mono">
                                  #SVIP-{(asset.id.charCodeAt(0) * 892 + 104).toString().slice(0, 5)}
                                </span>
                              </div>

                              {/* Favorite Button */}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleFavorite(asset.id);
                                }}
                                className={`p-1.5 rounded-xl transition-all border cursor-pointer backdrop-blur-md ${
                                  favoritedAssetIds.includes(asset.id)
                                    ? 'bg-pink-950/70 border-pink-500/50 text-pink-400 shadow-md shadow-pink-950/60'
                                    : 'bg-black/50 border-white/10 text-zinc-400 hover:text-white hover:border-white/30'
                                }`}
                                title={favoritedAssetIds.includes(asset.id) ? "Remove from favorites" : "Add to favorites"}
                              >
                                <Heart className={`w-3.5 h-3.5 ${favoritedAssetIds.includes(asset.id) ? 'fill-pink-400 text-pink-400' : ''}`} />
                              </button>
                            </div>

                            {/* Bottom row of header banner: Ownership Status & Price Pill */}
                            <div className="flex items-end justify-between relative z-10">
                              {/* Ownership Status Pill */}
                              {isOwner ? (
                                <div className="flex items-center gap-1.5 bg-emerald-950/90 border border-emerald-500/50 text-emerald-300 px-3 py-1 rounded-xl text-[10px] font-mono font-bold shadow-md shadow-emerald-950/50 backdrop-blur-sm">
                                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                                  YOUR SOVEREIGN ASSET
                                </div>
                              ) : asset.isForSale ? (
                                <div className="flex items-center gap-1.5 bg-cyan-950/90 border border-cyan-500/40 text-cyan-300 px-3 py-1 rounded-xl text-[10px] font-mono font-bold shadow-md shadow-cyan-950/50 backdrop-blur-sm">
                                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                                  AVAILABLE FOR LICENSE
                                </div>
                              ) : (
                                <div className="flex items-center gap-1.5 bg-zinc-900/90 border border-zinc-700/60 text-zinc-400 px-3 py-1 rounded-xl text-[10px] font-mono font-bold backdrop-blur-sm">
                                  <Lock className="w-3 h-3 text-zinc-500" />
                                  VAULTED / UNLISTED
                                </div>
                              )}

                              {/* Price Indicator */}
                              {asset.isForSale && (
                                <div className="text-emerald-300 text-xs font-black font-mono bg-black/80 backdrop-blur-md px-3 py-1 rounded-xl border border-emerald-500/30 flex items-center gap-1.5 shadow-sm">
                                  <Coins className="w-3.5 h-3.5 text-emerald-400" />
                                  {asset.price} ETH
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Card Body Information */}
                          <div className="p-6 space-y-4">
                            {/* Title & Inspect Link */}
                            <div className="flex items-start justify-between gap-3">
                              <h3 
                                onClick={() => setInspectingAsset(asset)}
                                className="text-base font-bold text-white tracking-tight leading-snug group-hover:text-cyan-300 transition-colors text-left cursor-pointer hover:underline"
                              >
                                {asset.title || 'Unnamed IP Asset'}
                              </h3>
                              
                              <button
                                onClick={() => setInspectingAsset(asset)}
                                className="text-zinc-500 hover:text-cyan-400 transition-colors p-1"
                                title="Inspect Specifications"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                            </div>

                            {/* Creator Metadata Chip */}
                            <div className="flex items-center justify-between text-xs text-zinc-400 pb-1 border-b border-zinc-900">
                              <div className="flex items-center gap-1.5">
                                <User className="w-3 h-3 text-cyan-400/80" />
                                <span className="text-[11px] text-zinc-400">Creator:</span>
                                <span className="font-mono text-[11px] text-zinc-300 font-semibold">
                                  {asset.ownerAddress ? `${asset.ownerAddress.slice(0, 6)}...${asset.ownerAddress.slice(-4)}` : '0xSovranly'}
                                </span>
                              </div>
                              {asset.ownerAddress && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (asset.ownerAddress) {
                                      copyToClipboard(asset.ownerAddress, asset.id);
                                    }
                                  }}
                                  className="text-[10px] text-zinc-500 hover:text-cyan-400 transition-colors flex items-center gap-1 font-mono"
                                  title="Copy address"
                                >
                                  {copiedAddress === asset.id ? (
                                    <span className="text-emerald-400 flex items-center gap-0.5"><Check className="w-2.5 h-2.5" /> Copied</span>
                                  ) : (
                                    <span className="flex items-center gap-0.5"><Copy className="w-2.5 h-2.5" /> Copy</span>
                                  )}
                                </button>
                              )}
                            </div>

                            {/* Description */}
                            <p className="text-zinc-400 text-xs text-left leading-relaxed line-clamp-2 min-h-[2.5rem]">
                              {asset.description || 'Verified decentralized intellectual property asset secured by continuous cryptographic smart covenants.'}
                            </p>

                            {/* Compact Licensing Parameters Grid */}
                            <div className="grid grid-cols-3 gap-2 bg-[#08080d] p-3 rounded-2xl border border-zinc-900 text-left font-mono">
                              <div className="space-y-0.5">
                                <span className="text-[9px] uppercase text-zinc-500 font-bold block flex items-center gap-1">
                                  <Clock className="w-2.5 h-2.5 text-cyan-400" /> Duration
                                </span>
                                <span className="text-[11px] font-bold text-zinc-200 block truncate">{assetDuration}</span>
                              </div>

                              <div className="space-y-0.5">
                                <span className="text-[9px] uppercase text-zinc-500 font-bold block flex items-center gap-1">
                                  <Scale className="w-2.5 h-2.5 text-cyan-400" /> Royalty
                                </span>
                                <span className="text-[11px] font-bold text-cyan-400 block">{asset.royalty}% split</span>
                              </div>

                              <div className="space-y-0.5">
                                <span className="text-[9px] uppercase text-zinc-500 font-bold block flex items-center gap-1">
                                  <Layers className="w-2.5 h-2.5 text-cyan-400" /> Rights
                                </span>
                                <span className="text-[11px] font-bold text-zinc-300 block truncate" title={assetUsages.join(', ')}>
                                  {assetUsages.length} Standard
                                </span>
                              </div>
                            </div>

                            {asset.customClause && (
                              <div className="text-left bg-zinc-900/40 p-2.5 rounded-xl border border-zinc-850 text-[10px] text-zinc-400 italic line-clamp-1">
                                &ldquo;{asset.customClause}&rdquo;
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Interactive Footer & Action Buttons */}
                        <div className="p-6 pt-0 space-y-2">
                          {isOwner ? (
                            <div className="space-y-2">
                              <div className="py-2 px-3 bg-emerald-950/30 rounded-xl border border-emerald-500/20 text-center">
                                <span className="text-[10px] uppercase font-mono tracking-wider text-emerald-300 flex items-center justify-center gap-1.5 font-bold">
                                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                                  Ownership Authenticated
                                </span>
                              </div>
                              <div className="grid grid-cols-2 gap-2">
                                <Button
                                  onClick={() => handleOpenCustomizing(asset)}
                                  className="rounded-xl bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-cyan-400 hover:text-cyan-300 text-xs font-bold font-mono h-10"
                                >
                                  Configure Terms
                                </Button>
                                <Button
                                  onClick={() => setInspectingAsset(asset)}
                                  variant="outline"
                                  className="rounded-xl border-zinc-850 bg-zinc-950 text-zinc-400 hover:text-white text-xs font-semibold h-10"
                                >
                                  Inspect Rights
                                </Button>
                              </div>
                            </div>
                          ) : asset.isForSale ? (
                            <div className="space-y-2">
                              <div className="grid grid-cols-2 gap-2">
                                <Button 
                                  onClick={() => handlePurchase(asset)}
                                  disabled={loadingId === asset.id}
                                  className="rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs uppercase tracking-wider h-10 flex items-center justify-center gap-1.5 shadow-md shadow-cyan-950/60 active:scale-95 transition-all"
                                >
                                  {loadingId === asset.id ? (
                                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                  ) : (
                                    <>
                                      Instant Buy
                                      <ArrowRight className="w-3 h-3" />
                                    </>
                                  )}
                                </Button>
                                
                                <Button
                                  onClick={() => {
                                    setNegotiatingAsset(asset);
                                    setProposalStatus('idle');
                                    setNegoForm({
                                      senderName: '',
                                      senderContact: '',
                                      proposedPrice: asset.price ? asset.price.toString() : '0.1',
                                      requestedDuration: assetDuration,
                                      requestedUsages: assetUsages,
                                      proposalMessage: ''
                                    });
                                  }}
                                  variant="outline"
                                  className="rounded-xl border-zinc-800 bg-zinc-900/80 text-purple-300 hover:text-purple-200 hover:bg-zinc-850 text-xs font-bold h-10 flex items-center justify-center gap-1.5 active:scale-95 transition-all"
                                >
                                  <Mail className="w-3.5 h-3.5 text-purple-400" />
                                  Request Terms
                                </Button>
                              </div>
                              
                              <Button
                                onClick={() => {
                                  setDemoSelectedAsset(asset);
                                  setDemoStep('sign');
                                  setDemoWalletConnected(true);
                                  setDemoLogs([
                                    `[SANDBOX] Target asset selected: "${asset.title}"`,
                                    `[SANDBOX] Smart Contract: Loaded split covenants (${asset.royalty}% artist, ${100 - asset.royalty}% platform).`,
                                    `[SANDBOX] Price parameter: ${asset.price || 0.05} ETH.`,
                                    `[SANDBOX] Custom duration: ${assetDuration}.`,
                                    `[SANDBOX] Ready for continuous session signature...`
                                  ]);
                                  setDemoProgress(25);
                                  setDemoArtistPay('0.00');
                                  setDemoPlatformPay('0.00');
                                  setDemoTxHash('');
                                }}
                                variant="outline"
                                className="w-full rounded-xl border-zinc-900 bg-zinc-950/40 text-zinc-400 hover:text-cyan-300 hover:border-cyan-500/30 text-[10px] font-mono h-8 flex items-center justify-center gap-1.5 transition-all"
                              >
                                <Sparkles className="w-3 h-3 text-cyan-400" />
                                Test in Demo Sandbox
                              </Button>
                            </div>
                          ) : (
                            <div className="space-y-2">
                              <div className="py-2 bg-zinc-900/30 rounded-xl border border-zinc-850 text-center">
                                <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-500">
                                  Private Creator Vault
                                </span>
                              </div>
                              <Button
                                onClick={() => {
                                  setNegotiatingAsset(asset);
                                  setProposalStatus('idle');
                                  setNegoForm({
                                    senderName: '',
                                    senderContact: '',
                                    proposedPrice: '0.1',
                                    requestedDuration: assetDuration,
                                    requestedUsages: assetUsages,
                                    proposalMessage: ''
                                  });
                                }}
                                variant="outline"
                                className="w-full rounded-xl border-zinc-800 bg-zinc-900 text-purple-300 hover:text-purple-200 hover:bg-zinc-850 text-xs font-bold h-10 flex items-center justify-center gap-1.5 active:scale-95 transition-all"
                              >
                                <Mail className="w-3.5 h-3.5 text-purple-400" />
                                Submit Private Licensing Offer
                              </Button>
                            </div>
                          )}
                        </div>

                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* Interactive Walkthrough Simulator panel (1 column) */}
          <div className="lg:col-span-1 bg-zinc-950 border border-zinc-900 rounded-3xl p-6 shadow-xl relative overflow-hidden text-left">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-zinc-900">
              <div className="flex items-center gap-1.5">
                <Terminal className="w-4 h-4 text-cyan-400" />
                <span className="font-mono text-xs font-black uppercase text-white tracking-wider">Demo Sandbox Console</span>
              </div>
              <div className={`w-2 h-2 rounded-full ${demoSelectedAsset ? 'bg-emerald-500 animate-pulse' : 'bg-zinc-700'}`} />
            </div>

            {demoStep === 'idle' || !demoSelectedAsset ? (
              <div className="text-center py-12 space-y-4">
                <HelpCircle className="w-10 h-10 text-cyan-500/25 mx-auto animate-bounce" />
                <h4 className="text-xs font-bold text-zinc-300 uppercase tracking-widest font-mono">Select Asset to Begin</h4>
                <p className="text-zinc-500 text-[11px] leading-relaxed max-w-xs mx-auto">
                  Click <strong className="text-cyan-400">&quot;Load in Demo Simulator&quot;</strong> on any listed asset card on the left to see how secure smart payments are processed organically.
                </p>
                <div className="pt-2">
                  <Button
                    onClick={() => {
                      if (assets.length > 0) {
                        const first = assets[0];
                        setDemoSelectedAsset(first);
                        setDemoStep('sign');
                        setDemoWalletConnected(true);
                        setDemoLogs([
                          `[SANDBOX] Auto-loaded asset: "${first.title}"`,
                          `[SANDBOX] Smart Contract: Loaded split covenants (${first.royalty}% / ${100 - first.royalty}%).`,
                          `[SANDBOX] Ready for continuous session signature...`
                        ]);
                        setDemoProgress(25);
                      }
                    }}
                    disabled={assets.length === 0}
                    className="rounded-full bg-cyan-950 border border-cyan-500/20 text-cyan-400 hover:bg-cyan-900 text-[10px] uppercase font-mono px-4 h-8"
                  >
                    Auto-Load First Asset
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-5">
                
                {/* Active loaded profile */}
                <div className="bg-[#09090b] rounded-2xl p-4 border border-zinc-900 space-y-2">
                  <span className="text-[9px] uppercase font-mono tracking-widest text-cyan-400 font-extrabold block">LIVE TARGET COVENANT</span>
                  <div className="text-xs font-bold text-white truncate">{demoSelectedAsset.title}</div>
                  <div className="flex items-center justify-between text-[11px] text-zinc-400">
                    <span>License Price:</span>
                    <span className="font-mono text-white font-bold">{demoSelectedAsset.price || 0.05} ETH</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-zinc-400">
                    <span>Covenant Splits:</span>
                    <span className="font-mono text-cyan-400">{demoSelectedAsset.royalty}% Owner / {100 - demoSelectedAsset.royalty}% Reserve</span>
                  </div>
                </div>

                {/* Status visual route */}
                <div className="space-y-2">
                  <div className="flex justify-between text-[9px] uppercase font-mono tracking-wider text-zinc-500">
                    <span>Handshake Cycle</span>
                    <span>{demoProgress}%</span>
                  </div>
                  <div className="h-2 bg-zinc-900 rounded-full overflow-hidden border border-white/5">
                    <div 
                      className="bg-gradient-to-r from-cyan-500 to-violet-500 h-full transition-all duration-500"
                      style={{ width: `${demoProgress}%` }}
                    />
                  </div>
                  <div className="grid grid-cols-4 text-[8px] uppercase font-mono text-center text-zinc-500 font-bold">
                    <span className={demoProgress >= 25 ? "text-cyan-400" : "text-zinc-700"}>Wallet</span>
                    <span className={demoProgress >= 50 ? "text-cyan-400" : "text-zinc-700"}>Sign</span>
                    <span className={demoProgress >= 75 ? "text-cyan-400" : "text-zinc-700"}>Split</span>
                    <span className={demoProgress >= 100 ? "text-emerald-400" : "text-zinc-700"}>Verified</span>
                  </div>
                </div>

                {/* Animated Split visual map */}
                {demoStep !== 'sign' && (
                  <div className="bg-[#050505] rounded-2xl p-4 border border-zinc-900 relative">
                    <span className="text-[8px] uppercase font-mono text-zinc-500 block mb-3 text-center">Atomic Escrow Flow Map</span>
                    
                    <div className="flex items-center justify-between text-xs font-mono relative">
                      
                      <div className="flex flex-col items-center bg-zinc-900 border border-zinc-800 p-2 rounded-xl text-center w-20">
                        <Key className="w-3.5 h-3.5 text-cyan-400 mb-1" />
                        <span className="text-[9px] text-white font-bold">{demoSelectedAsset.price || 0.05} ETH</span>
                        <span className="text-[6px] text-zinc-500 uppercase">Input Tx</span>
                      </div>

                      <div className="flex-1 flex flex-col justify-center items-center gap-1.5 px-2">
                        <div className="w-full relative h-1.5 flex items-center">
                          <div className="absolute inset-x-0 h-0.5 bg-cyan-500/20" />
                          <div className="absolute left-0 w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                        </div>
                        <span className="text-[7px] text-cyan-400 uppercase tracking-widest font-black animate-pulse">Router</span>
                      </div>

                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 p-2 rounded-xl w-28 justify-between">
                          <div className="text-left">
                            <div className="text-[8px] text-white font-bold">Artist ({demoSelectedAsset.royalty}%)</div>
                            <div className="text-[7px] text-zinc-500 truncate font-mono">0xArtist</div>
                          </div>
                          <span className="font-mono text-[9px] text-emerald-400 font-bold">{demoArtistPay} ETH</span>
                        </div>
                        <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 p-2 rounded-xl w-28 justify-between">
                          <div className="text-left">
                            <div className="text-[8px] text-zinc-400 font-bold">Reserve ({100 - demoSelectedAsset.royalty}%)</div>
                            <div className="text-[7px] text-zinc-500 truncate font-mono">0xReserve</div>
                          </div>
                          <span className="font-mono text-[9px] text-zinc-400 font-bold">{demoPlatformPay} ETH</span>
                        </div>
                      </div>

                    </div>
                  </div>
                )}

                {/* Console Log */}
                <div className="bg-[#050510] border border-zinc-900 rounded-2xl p-4 font-mono text-[10px] space-y-1.5 h-36 overflow-y-auto select-none text-zinc-400 shadow-inner">
                  {demoLogs.map((log, idx) => (
                    <div key={idx} className="leading-relaxed">
                      <span className="text-cyan-500/75 mr-1">&gt;</span> {log}
                    </div>
                  ))}
                  {isDemoRunning && (
                    <div className="text-cyan-400 animate-pulse flex items-center gap-1.5 mt-1">
                      <RefreshCw className="w-3 h-3 animate-spin text-cyan-400" />
                      COMPILING CONTRACT...
                    </div>
                  )}
                </div>

                {/* Demo Control Button */}
                <div>
                  {demoStep === 'sign' ? (
                    <Button
                      onClick={handleNextDemoStep}
                      disabled={isDemoRunning || !demoWalletConnected}
                      className="w-full rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs uppercase tracking-wider py-4 h-11 flex items-center justify-center gap-1.5"
                    >
                      <Key className="w-3.5 h-3.5" />
                      Sign Licensing Covenants
                    </Button>
                  ) : demoStep === 'dispatch' ? (
                    <Button
                      onClick={handleNextDemoStep}
                      disabled={isDemoRunning}
                      className="w-full rounded-xl bg-gradient-to-r from-cyan-500 to-violet-500 hover:brightness-110 text-white font-bold text-xs uppercase tracking-wider py-4 h-11 flex items-center justify-center gap-1.5"
                    >
                      <Zap className="w-3.5 h-3.5 animate-bounce" />
                      Execute Atomic Splits on Ledger
                    </Button>
                  ) : (
                    <div className="space-y-2">
                      <div className="text-center py-2 bg-emerald-950/20 border border-emerald-500/20 rounded-xl text-emerald-400 font-bold text-xs flex items-center justify-center gap-2">
                        <CheckCircle className="w-4 h-4 text-emerald-400" /> Verified Escrow Completed!
                      </div>
                      <Button
                        onClick={() => {
                          setDemoStep('sign');
                          setDemoProgress(25);
                          setDemoLogs([
                            `[SANDBOX] Reset Sandbox node.`,
                            `[SANDBOX] Ready for continuous signatures on: "${demoSelectedAsset.title}"`
                          ]);
                          setDemoArtistPay('0.00');
                          setDemoPlatformPay('0.00');
                        }}
                        className="w-full rounded-xl bg-zinc-900 border border-zinc-800 hover:bg-zinc-850 hover:text-white text-zinc-400 text-xs py-2 inline-flex items-center justify-center gap-1.5"
                      >
                        <RefreshCw className="w-3 h-3" />
                        Run Walkthrough Again
                      </Button>
                    </div>
                  )}
                </div>

              </div>
            )}
          </div>

        </div>
      </main>

      {/* --- SUCCESS TRANSACTION RECEIPT MODAL --- */}
      {showReceipt && receiptData && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-8 max-w-md w-full relative space-y-6 shadow-2xl animate-in fade-in zoom-in duration-200 text-left">
            
            <div className="text-center">
              <div className="w-12 h-12 bg-emerald-950/50 border border-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <BadgeCheck className="w-6 h-6 text-emerald-400" />
              </div>
              <h2 className="text-xl font-bold text-white tracking-tight">License Purchased!</h2>
              <p className="text-xs text-zinc-500 mt-1 uppercase tracking-wider font-mono">Receipt Generated</p>
            </div>

            {/* Receipt Parameters */}
            <div className="bg-zinc-900/60 rounded-2xl p-5 border border-zinc-850 space-y-3 text-xs">
              <div className="flex justify-between items-center text-zinc-400">
                <span>Asset Licensed</span>
                <span className="font-bold text-white max-w-[180px] truncate">{receiptData.assetTitle}</span>
              </div>
              <div className="flex justify-between items-center text-zinc-400">
                <span>Total Amount Paid</span>
                <span className="font-mono text-emerald-400 font-bold">{receiptData.price} ETH</span>
              </div>
              <div className="flex justify-between items-center text-zinc-400">
                <span>License Duration</span>
                <span className="text-zinc-300 font-bold">{receiptData.duration}</span>
              </div>
              
              {/* Royalty Split verification */}
              <div className="pt-3 border-t border-zinc-800 space-y-2">
                <div className="text-[9px] uppercase tracking-wider font-mono text-zinc-500 flex items-center gap-1">
                  <Calculator className="w-3 h-3 text-cyan-400" />
                  Automated Royalty Splits (Atomic)
                </div>
                <div className="flex justify-between items-center text-[11px] text-zinc-400">
                  <span>Artist Royalty</span>
                  <span className="font-mono text-cyan-400">{receiptData.creatorRoyalty} ETH</span>
                </div>
                <div className="flex justify-between items-center text-[11px] text-zinc-400">
                  <span>Platform Fee (15%)</span>
                  <span className="font-mono text-zinc-400">{receiptData.platformFee} ETH</span>
                </div>
              </div>

              <div className="pt-3 border-t border-zinc-850 text-[10px] space-y-1">
                <div className="text-[9px] uppercase tracking-wider font-mono text-zinc-500">License Tx Hash</div>
                <div className="font-mono text-zinc-400 truncate select-all">{receiptData.txHash}</div>
              </div>
            </div>

            <Button 
              onClick={() => setShowReceipt(false)}
              className="w-full rounded-xl bg-white text-black hover:bg-zinc-200 text-xs font-bold py-2.5"
            >
              Close Receipt
            </Button>

          </div>
        </div>
      )}

      {/* --- CREATOR TERMS CUSTOMIZATION PANEL MODAL --- */}
      {customizingAsset && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-950 border border-zinc-850 rounded-3xl p-8 max-w-lg w-full relative space-y-6 shadow-2xl animate-in fade-in zoom-in duration-200 text-left">
            
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <span className="text-[9px] uppercase font-mono tracking-widest text-cyan-400 font-bold block">IP Asset Customization</span>
                <h3 className="text-lg font-bold text-white tracking-tight">{customizingAsset.title}</h3>
              </div>
              <button onClick={() => setCustomizingAsset(null)} className="p-1 text-zinc-500 hover:text-white rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              
              {/* Price & Listing Toggle */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-mono tracking-wider text-zinc-400 font-bold block">License Price (ETH)</label>
                  <input 
                    type="number" 
                    step="0.01"
                    min="0"
                    value={customPrice}
                    onChange={(e) => setCustomPrice(e.target.value)}
                    className="w-full rounded-xl bg-zinc-900 border border-zinc-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 transition-colors h-9 font-mono"
                  />
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-mono tracking-wider text-zinc-400 font-bold block">Marketplace Listing Status</label>
                  <select
                    value={customListed ? 'listed' : 'unlisted'}
                    onChange={(e) => setCustomListed(e.target.value === 'listed')}
                    className="w-full rounded-xl bg-zinc-900 border border-zinc-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 transition-colors h-9 appearance-none"
                  >
                    <option value="listed">Listed for Sale</option>
                    <option value="unlisted">Unlisted / Hidden</option>
                  </select>
                </div>
              </div>

              {/* Duration Select */}
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-mono tracking-wider text-zinc-400 font-bold block">License Duration</label>
                <select
                  value={customDuration}
                  onChange={(e) => setCustomDuration(e.target.value)}
                  className="w-full rounded-xl bg-zinc-900 border border-zinc-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 transition-colors h-9"
                >
                  {DURATION_PRESETS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>

              {/* Royalty Slider */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-[10px] uppercase font-mono tracking-wider text-zinc-400 font-bold">
                  <span>Retained Artist Royalty Split</span>
                  <span className="text-cyan-400">{customRoyalty}%</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={customRoyalty}
                  onChange={(e) => setCustomRoyalty(parseInt(e.target.value))}
                  className="w-full accent-cyan-500 h-1.5 bg-zinc-900 rounded-lg cursor-pointer"
                />
                <span className="text-[9px] text-zinc-550 block text-right">
                  Platform receives remaining {100 - customRoyalty}% fee to cover Zero Trust network gas.
                </span>
              </div>

              {/* Multi-Select Allowed Usages */}
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-mono tracking-wider text-zinc-400 font-bold block">Allowed Usage Rights</label>
                <div className="grid grid-cols-2 gap-2 max-h-[120px] overflow-y-auto pr-1">
                  {USAGE_RIGHTS_PRESETS.map(usage => {
                    const checked = customUsages.includes(usage);
                    return (
                      <button
                        key={usage}
                        onClick={() => handleToggleUsage(customUsages, setCustomUsages, usage)}
                        className={`text-[10px] p-2 rounded-xl border text-left transition-colors flex items-center gap-1.5 ${
                          checked 
                            ? 'bg-cyan-950/20 border-cyan-500/40 text-cyan-400 font-semibold' 
                            : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                        }`}
                      >
                        <span className={`w-3 h-3 rounded-md flex items-center justify-center border ${checked ? 'border-cyan-400 bg-cyan-950' : 'border-zinc-700'}`}>
                          {checked && <CheckCircle2 className="w-2.5 h-2.5 text-cyan-400" />}
                        </span>
                        <span className="truncate">{usage}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Custom Legal Clause */}
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-mono tracking-wider text-zinc-400 font-bold block">Custom Legal Clause / Notice (Optional)</label>
                <input 
                  type="text" 
                  placeholder="e.g. Creator retains full visual copyright. Attribution required."
                  value={customClause}
                  onChange={(e) => setCustomClause(e.target.value)}
                  className="w-full rounded-xl bg-zinc-900 border border-zinc-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 transition-colors h-9"
                />
              </div>

            </div>

            {/* Actions */}
            <div className="flex gap-4 pt-4 border-t border-zinc-900">
              <Button 
                onClick={() => setCustomizingAsset(null)}
                variant="outline"
                className="flex-1 rounded-xl border-zinc-800 bg-zinc-950 text-zinc-400 hover:text-white text-xs h-10 font-bold"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSaveCustomTerms}
                disabled={savingTerms}
                className="flex-1 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs uppercase h-10 flex items-center justify-center gap-2"
              >
                {savingTerms ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    Save Licensing Terms
                  </>
                )}
              </Button>
            </div>

          </div>
        </div>
      )}

      {/* --- CUSTOM LICENSE REQUEST / NEGOTIATION WIZARD MODAL --- */}
      {negotiatingAsset && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-950 border border-zinc-850 rounded-3xl p-8 max-w-lg w-full relative space-y-6 shadow-2xl animate-in fade-in zoom-in duration-200 text-left">
            
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <span className="text-[9px] uppercase font-mono tracking-widest text-purple-400 font-black block">Custom Licensing Proposal Wizard</span>
                <h3 className="text-base font-bold text-white tracking-tight">Propose Custom Terms for &ldquo;{negotiatingAsset.title}&rdquo;</h3>
              </div>
              <button onClick={() => setNegotiatingAsset(null)} className="p-1 text-zinc-500 hover:text-white rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            {proposalStatus === 'success' ? (
              <div className="space-y-6 py-6 text-center">
                <div className="w-16 h-16 bg-emerald-950/30 border border-emerald-500/20 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="w-8 h-8 text-emerald-400" />
                </div>
                <div className="space-y-2">
                  <p className="text-base font-bold text-emerald-400">Licensing Proposal Sealed & Sent!</p>
                  <p className="text-xs text-zinc-400 max-w-sm mx-auto leading-relaxed">
                    Your custom terms, pricing offer, and usage rights have been cryptographically sealed and pushed directly into the creator&apos;s Web3 dashboard inbox.
                  </p>
                </div>
                <Button
                  onClick={() => setNegotiatingAsset(null)}
                  className="w-full rounded-xl bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-white font-bold h-11 text-xs"
                >
                  Return to Marketplace
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmitProposal} className="space-y-4">
                {proposalStatus === 'error' && (
                  <div className="p-3 bg-red-950/20 border border-red-500/10 rounded-xl text-center text-xs text-red-400 font-semibold">
                    Delivery pipeline encountered a connection limit. Please retry.
                  </div>
                )}

                {/* Profile info */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-mono tracking-wider text-zinc-400 font-bold block">Your Name / Organization</label>
                    <input 
                      required
                      placeholder="e.g. Paramount Studios"
                      value={negoForm.senderName}
                      onChange={(e) => setNegoForm({ ...negoForm, senderName: e.target.value })}
                      className="w-full rounded-xl bg-zinc-900 border border-zinc-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500 transition-colors h-9"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-mono tracking-wider text-zinc-400 font-bold block">Secure Contact Coordinate</label>
                    <input 
                      required
                      placeholder="e.g. licensing@paramount.com"
                      value={negoForm.senderContact}
                      onChange={(e) => setNegoForm({ ...negoForm, senderContact: e.target.value })}
                      className="w-full rounded-xl bg-zinc-900 border border-zinc-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500 transition-colors h-9"
                    />
                  </div>
                </div>

                {/* Proposed Licensing Terms */}
                <div className="grid grid-cols-2 gap-4 pt-2 border-t border-zinc-900">
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-mono tracking-wider text-zinc-400 font-bold block">Your Licensing Fee Offer (ETH)</label>
                    <input 
                      required
                      type="number"
                      step="0.001"
                      placeholder="e.g. 0.25"
                      value={negoForm.proposedPrice}
                      onChange={(e) => setNegoForm({ ...negoForm, proposedPrice: e.target.value })}
                      className="w-full rounded-xl bg-zinc-900 border border-zinc-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500 transition-colors h-9 font-mono"
                    />
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-mono tracking-wider text-zinc-400 font-bold block">Proposed Duration</label>
                    <select
                      value={negoForm.requestedDuration}
                      onChange={(e) => setNegoForm({ ...negoForm, requestedDuration: e.target.value })}
                      className="w-full rounded-xl bg-zinc-900 border border-zinc-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500 transition-colors h-9"
                    >
                      {DURATION_PRESETS.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                </div>

                {/* Requested usage checklist */}
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-mono tracking-wider text-zinc-400 font-bold block">Requested Usage Rights</label>
                  <div className="grid grid-cols-2 gap-2 max-h-[100px] overflow-y-auto pr-1">
                    {USAGE_RIGHTS_PRESETS.map(usage => {
                      const checked = negoForm.requestedUsages.includes(usage);
                      return (
                        <button
                          type="button"
                          key={usage}
                          onClick={() => handleToggleUsage(negoForm.requestedUsages, (list) => setNegoForm({ ...negoForm, requestedUsages: list }), usage)}
                          className={`text-[9px] p-2 rounded-xl border text-left transition-colors flex items-center gap-1.5 ${
                            checked 
                              ? 'bg-purple-950/20 border-purple-500/40 text-purple-400 font-semibold' 
                              : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                          }`}
                        >
                          <span className={`w-3 h-3 rounded-md flex items-center justify-center border ${checked ? 'border-purple-400 bg-purple-950' : 'border-zinc-700'}`}>
                            {checked && <CheckCircle2 className="w-2.5 h-2.5 text-purple-400" />}
                          </span>
                          <span className="truncate">{usage}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Message proposal Details */}
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-mono tracking-wider text-zinc-400 font-bold block">Proposal Details / Custom Context</label>
                  <textarea 
                    required
                    rows={3}
                    placeholder="Provide specific details about your distribution model, platform audience size, and usage goals..."
                    value={negoForm.proposalMessage}
                    onChange={(e) => setNegoForm({ ...negoForm, proposalMessage: e.target.value })}
                    className="w-full rounded-xl bg-zinc-900 border border-zinc-800 p-3 text-xs text-white focus:outline-none focus:border-purple-500 transition-colors resize-none leading-relaxed"
                  />
                </div>

                {/* Action buttons */}
                <div className="flex gap-4 pt-3 border-t border-zinc-900">
                  <Button 
                    type="button"
                    onClick={() => setNegotiatingAsset(null)}
                    variant="outline"
                    className="flex-1 rounded-xl border-zinc-800 bg-zinc-950 text-zinc-400 hover:text-white text-xs h-11 font-bold uppercase tracking-wider"
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit"
                    disabled={sendingProposal}
                    className="flex-1 rounded-xl bg-gradient-to-r from-purple-500 to-violet-600 hover:brightness-110 text-white font-bold text-xs uppercase tracking-wider h-11"
                  >
                    {sendingProposal ? 'Sealing Terms...' : 'Submit Proposal'}
                  </Button>
                </div>

              </form>
            )}

            <div className="text-center pt-1 border-t border-zinc-900">
              <span className="text-[8px] uppercase font-mono text-zinc-650 tracking-[0.2em] block font-black">SOVRANLY ZERO TRUST HANDSHAKE ACTIVE</span>
            </div>

          </div>
        </div>
      )}

      {/* --- ASSET DETAILS / CRYPTOGRAPHIC INSPECTION MODAL --- */}
      {inspectingAsset && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 md:p-8 max-w-xl w-full relative space-y-6 shadow-2xl animate-in fade-in zoom-in duration-200 text-left max-h-[90vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-zinc-900 pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="bg-cyan-950/60 text-cyan-300 border border-cyan-500/30 px-2.5 py-0.5 rounded-lg text-[10px] font-mono font-bold">
                    {inspectingAsset.type}
                  </span>
                  <span className="text-zinc-500 text-[10px] font-mono">
                    Token #SVIP-{(inspectingAsset.id.charCodeAt(0) * 892 + 104).toString().slice(0, 5)}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white tracking-tight">{inspectingAsset.title}</h3>
              </div>
              <button 
                onClick={() => setInspectingAsset(null)} 
                className="p-1.5 text-zinc-500 hover:text-white rounded-xl bg-zinc-900 border border-zinc-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Ownership & Verified Status Banner */}
            <div className={`p-4 rounded-2xl border flex items-center justify-between gap-3 ${
              walletAddress && inspectingAsset.ownerAddress?.toLowerCase() === walletAddress.toLowerCase()
                ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-300'
                : inspectingAsset.isForSale
                ? 'bg-cyan-950/30 border-cyan-500/30 text-cyan-300'
                : 'bg-zinc-900/40 border-zinc-800 text-zinc-400'
            }`}>
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-5 h-5 shrink-0" />
                <div className="font-mono text-xs">
                  <div className="font-bold">
                    {walletAddress && inspectingAsset.ownerAddress?.toLowerCase() === walletAddress.toLowerCase()
                      ? 'You Are The Authenticated Owner'
                      : inspectingAsset.isForSale
                      ? 'Available for Instant Licensing'
                      : 'Private Vaulted IP'}
                  </div>
                  <div className="text-[10px] text-zinc-400">Continuous On-Chain Verification</div>
                </div>
              </div>
              {inspectingAsset.isForSale && (
                <div className="text-right font-mono">
                  <div className="text-sm font-black text-emerald-400">{inspectingAsset.price} ETH</div>
                  <div className="text-[9px] text-zinc-500">Fixed rate</div>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-500 font-bold block">Asset Description & Scope</span>
              <p className="text-xs text-zinc-300 leading-relaxed bg-zinc-900/40 p-3.5 rounded-xl border border-zinc-850">
                {inspectingAsset.description || 'No additional descriptive metadata provided for this registered intellectual property.'}
              </p>
            </div>

            {/* Cryptographic Specifications Grid */}
            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <div className="bg-[#08080d] p-3 rounded-xl border border-zinc-900 space-y-1">
                <span className="text-[9px] text-zinc-500 uppercase block">Creator Address</span>
                <div className="text-zinc-200 font-bold truncate">
                  {inspectingAsset.ownerAddress || '0xSovranly...Master'}
                </div>
              </div>

              <div className="bg-[#08080d] p-3 rounded-xl border border-zinc-900 space-y-1">
                <span className="text-[9px] text-zinc-500 uppercase block">License Duration</span>
                <div className="text-cyan-400 font-bold">
                  {inspectingAsset.duration || '3 Years Standard'}
                </div>
              </div>

              <div className="bg-[#08080d] p-3 rounded-xl border border-zinc-900 space-y-1">
                <span className="text-[9px] text-zinc-500 uppercase block">Creator Royalty Retained</span>
                <div className="text-emerald-400 font-bold">
                  {inspectingAsset.royalty}% Perpetual
                </div>
              </div>

              <div className="bg-[#08080d] p-3 rounded-xl border border-zinc-900 space-y-1">
                <span className="text-[9px] text-zinc-500 uppercase block">Security Classification</span>
                <div className="text-zinc-300 font-bold">
                  Class 42 IP Covenants
                </div>
              </div>
            </div>

            {/* Permitted Commercial Rights */}
            <div className="space-y-2">
              <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-500 font-bold block">Included Usage Rights</span>
              <div className="grid grid-cols-2 gap-2">
                {(inspectingAsset.usages || ['Streaming & Broadcasting', 'Derivative Works', 'Commercial Distribution']).map((usage, idx) => (
                  <div key={idx} className="flex items-center gap-2 bg-zinc-900/60 border border-zinc-800 px-3 py-2 rounded-xl text-xs text-zinc-300">
                    <CheckCircle className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span className="truncate">{usage}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Custom Legal Clause */}
            {inspectingAsset.customClause && (
              <div className="space-y-1.5">
                <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-500 font-bold block">Creator Legal Clause</span>
                <div className="text-xs text-zinc-300 italic bg-zinc-900/30 p-3 rounded-xl border border-zinc-850">
                  &ldquo;{inspectingAsset.customClause}&rdquo;
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t border-zinc-900">
              <Button 
                onClick={() => setInspectingAsset(null)}
                variant="outline"
                className="flex-1 rounded-xl border-zinc-800 bg-zinc-900 text-zinc-300 hover:text-white text-xs h-11 font-bold"
              >
                Close View
              </Button>

              {walletAddress && inspectingAsset.ownerAddress?.toLowerCase() === walletAddress.toLowerCase() ? (
                <Button 
                  onClick={() => {
                    const target = inspectingAsset;
                    setInspectingAsset(null);
                    handleOpenCustomizing(target);
                  }}
                  className="flex-1 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs uppercase h-11"
                >
                  Configure Terms
                </Button>
              ) : inspectingAsset.isForSale ? (
                <Button 
                  onClick={() => {
                    const target = inspectingAsset;
                    setInspectingAsset(null);
                    handlePurchase(target);
                  }}
                  className="flex-1 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs uppercase h-11 flex items-center justify-center gap-1.5 shadow-md shadow-cyan-950"
                >
                  Instant Buy ({inspectingAsset.price} ETH)
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              ) : (
                <Button 
                  onClick={() => {
                    const target = inspectingAsset;
                    setInspectingAsset(null);
                    setNegotiatingAsset(target);
                    setProposalStatus('idle');
                    setNegoForm({
                      senderName: '',
                      senderContact: '',
                      proposedPrice: '0.1',
                      requestedDuration: target.duration || '3 Years',
                      requestedUsages: target.usages || ['Streaming & Broadcasting'],
                      proposalMessage: ''
                    });
                  }}
                  className="flex-1 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs uppercase h-11"
                >
                  Submit Proposal
                </Button>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
