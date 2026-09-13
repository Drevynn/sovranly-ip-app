'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import QRCode from 'qrcode';
import { 
  ArrowLeft, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink, 
  Store, 
  CreditCard, 
  PlusCircle, 
  RefreshCw, 
  ShieldCheck, 
  DollarSign, 
  Layers, 
  Copy, 
  Check, 
  QrCode,
  Trash2,
  Share2,
  Code2,
  Sparkles,
  Link as LinkIcon,
  X
} from 'lucide-react';
import { SovranlyLogo } from '@/components/SovranlyLogo';
import { 
  PayLinkProduct, 
  DEFAULT_PAY_LINKS, 
  getStoredPayLinks, 
  savePayLinks,
  STORAGE_KEY_CREATOR_ACCOUNT 
} from '@/lib/paylinks';

export default function ConnectHubPage() {
  // State for active creator identifier
  const [accountId, setAccountId] = useState<string>('sovranly-creator');
  const [displayName, setDisplayName] = useState<string>('Sovranly Creator Studio');
  
  // Pay links data
  const [payLinks, setPayLinks] = useState<PayLinkProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  
  // Notification messages
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedStorefront, setCopiedStorefront] = useState<boolean>(false);

  // New Pay Link Form state
  const [formName, setFormName] = useState<string>('');
  const [formDesc, setFormDesc] = useState<string>('');
  const [formPrice, setFormPrice] = useState<string>('49.00');
  const [formUrl, setFormUrl] = useState<string>('');
  const [formCategory, setFormCategory] = useState<PayLinkProduct['category']>('master');

  // QR Code modal state
  const [activeQrModal, setActiveQrModal] = useState<{ name: string; url: string; price: number; qrDataUrl: string } | null>(null);
  
  // Embed code modal state
  const [activeEmbedModal, setActiveEmbedModal] = useState<{ name: string; url: string; code: string } | null>(null);

  // Initialize on client mount
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const params = new URLSearchParams(window.location.search);
        const acc = params.get('accountId') || localStorage.getItem(STORAGE_KEY_CREATOR_ACCOUNT) || 'sovranly-creator';
        setAccountId(acc);

        // Load existing pay links from storage
        const stored = getStoredPayLinks();
        setPayLinks(stored);
        setLoading(false);

        if (params.get('subscription_success')) {
          setSuccessMessage('Membership tier checkout completed successfully.');
        }
      } catch {
        setPayLinks(DEFAULT_PAY_LINKS);
        setLoading(false);
      }
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // Save creator handle change
  const handleAccountChange = (val: string) => {
    const sanitized = val.toLowerCase().replace(/[^a-z0-9_-]/g, '');
    setAccountId(sanitized);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY_CREATOR_ACCOUNT, sanitized);
    }
  };

  // Add new Pay Link
  const handleCreatePayLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!formName.trim()) {
      setErrorMessage('Please enter a product or license title.');
      return;
    }

    const priceNum = parseFloat(formPrice);
    if (isNaN(priceNum) || priceNum <= 0) {
      setErrorMessage('Please enter a valid numeric price greater than 0.');
      return;
    }

    if (!formUrl.trim()) {
      setErrorMessage('Please enter your destination Pay Link URL.');
      return;
    }

    const formattedUrl = formUrl.trim().startsWith('http') ? formUrl.trim() : `https://${formUrl.trim()}`;

    setSubmitting(true);

    try {
      const newLink: PayLinkProduct = {
        id: `paylink_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        name: formName.trim(),
        description: formDesc.trim() || 'Direct sovereign digital license and settlement link.',
        price: priceNum,
        unitAmount: Math.round(priceNum * 100),
        currency: 'usd',
        payUrl: formattedUrl,
        category: formCategory,
        active: true,
        createdAt: new Date().toISOString(),
        accountId: accountId
      };

      // Call API route
      await fetch('/api/paylinks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newLink)
      }).catch(() => {
        // In-memory fallback
      });

      const updated = [newLink, ...payLinks];
      setPayLinks(updated);
      savePayLinks(updated);

      // Reset form
      setFormName('');
      setFormDesc('');
      setFormPrice('49.00');
      setFormUrl('');
      setSuccessMessage(`Pay Link "${newLink.name}" created and synced to your storefront!`);
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err: unknown) {
      setErrorMessage((err as Error).message || 'Failed to create pay link.');
    } finally {
      setSubmitting(false);
    }
  };

  // Delete Pay Link
  const handleDeletePayLink = (id: string) => {
    const updated = payLinks.filter(p => p.id !== id);
    setPayLinks(updated);
    savePayLinks(updated);
    setSuccessMessage('Pay Link removed from your active catalogue.');
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  // Copy Pay Link URL
  const handleCopy = (id: string, url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Copy Storefront URL
  const handleCopyStorefront = () => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://sovranlyip.com';
    const storeUrl = `${origin}/storefront/${encodeURIComponent(accountId || 'sovranly-creator')}`;
    navigator.clipboard.writeText(storeUrl);
    setCopiedStorefront(true);
    setTimeout(() => setCopiedStorefront(false), 2000);
  };

  // Generate QR Code for Pay Link
  const handleOpenQr = async (item: PayLinkProduct) => {
    try {
      const qrDataUrl = await QRCode.toDataURL(item.payUrl, {
        width: 320,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#ffffff'
        }
      });
      setActiveQrModal({
        name: item.name,
        url: item.payUrl,
        price: item.price,
        qrDataUrl
      });
    } catch (err) {
      console.error('Failed to generate QR code', err);
      setErrorMessage('Failed to generate QR code for this link.');
    }
  };

  // Open Embed Code modal
  const handleOpenEmbed = (item: PayLinkProduct) => {
    const code = `<a href="${item.payUrl}" target="_blank" rel="noopener noreferrer" style="display:inline-block;padding:12px 24px;background:#10b981;color:#000;border-radius:12px;font-weight:bold;text-decoration:none;font-family:sans-serif;">Pay $${item.price.toFixed(2)} with Link</a>`;
    setActiveEmbedModal({
      name: item.name,
      url: item.payUrl,
      code
    });
  };

  const getCategoryBadge = (cat: PayLinkProduct['category']) => {
    switch (cat) {
      case 'master':
        return <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800/60">Master License</span>;
      case 'sync':
        return <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800/60">Sync Rights</span>;
      case 'subscription':
        return <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-violet-950 text-violet-400 border border-violet-800/60">Retainer</span>;
      case 'nft':
        return <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-950 text-amber-400 border border-amber-800/60">NFT Certificate</span>;
      default:
        return <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300">Merchandise</span>;
    }
  };

  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://sovranlyip.com';
  const storefrontUrl = `${origin}/storefront/${encodeURIComponent(accountId || 'sovranly-creator')}`;

  return (
    <div className="min-h-screen bg-black text-zinc-100 font-sans selection:bg-cyan-500/30">
      {/* Top Navigation Bar */}
      <header className="border-b border-zinc-900 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link 
              href="/" 
              className="p-2 -ml-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors"
              title="Return to Main Dashboard"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-2.5">
              <SovranlyLogo size="sm" />
              <div>
                <h1 className="text-base font-bold tracking-tight text-white flex items-center gap-2">
                  Creator Pay Links &amp; Storefront Hub
                  <span className="text-[10px] font-mono bg-emerald-950 text-emerald-400 border border-emerald-800/60 px-2 py-0.5 rounded-full">
                    Universal Pay Rail
                  </span>
                </h1>
                <p className="text-xs text-zinc-400 font-mono">Zero Trust Sovereign Payment Rail • Any Pay Link Provider</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={process.env.NEXT_PUBLIC_STRIPE_CUSTOMER_PORTAL_URL || 'https://billing.stripe.com/p/login/9B66oHdl8cplfpq1BV2Ji00'}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 text-xs font-mono font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Open Stripe Customer Billing Portal"
            >
              <CreditCard className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">Billing Portal</span>
              <ExternalLink className="w-3 h-3 text-zinc-500" />
            </a>
            <Link
              href={`/storefront/${encodeURIComponent(accountId || 'sovranly-creator')}`}
              className="px-3.5 py-2 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border border-emerald-500/40 text-xs font-mono font-bold flex items-center gap-2 transition-all shadow-sm cursor-pointer"
            >
              <Store className="w-4 h-4 text-emerald-400" />
              View Customer Storefront
            </Link>
            <Link
              href="/pricing"
              className="px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 text-xs font-mono transition-colors"
            >
              Platform Pricing
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-8 space-y-8">
        {/* Banner Alert Messages */}
        {errorMessage && (
          <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-800/60 text-rose-200 flex items-start gap-3 shadow-lg animate-in fade-in duration-200">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div className="text-xs font-mono space-y-1">
              <p className="font-bold text-rose-300">Notice:</p>
              <p className="text-zinc-300 leading-relaxed">{errorMessage}</p>
            </div>
          </div>
        )}

        {successMessage && (
          <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-800/60 text-emerald-200 flex items-start gap-3 shadow-lg animate-in fade-in duration-200">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <p className="text-xs font-mono text-emerald-300 leading-relaxed">{successMessage}</p>
          </div>
        )}

        {/* Hero Banner & Metrics Overview */}
        <section className="p-6 md:p-8 rounded-3xl bg-zinc-950 border border-zinc-800/80 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-cyan-500/5 rounded-full blur-[90px] pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-4 gap-6 items-center">
            <div className="lg:col-span-2 space-y-3">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-[11px] font-mono text-cyan-400">
                <Sparkles className="w-3.5 h-3.5" />
                Zero Vendor Lock-in Payment Architecture
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
                Universal Creator Pay Links
              </h2>
              <p className="text-xs text-zinc-400 leading-relaxed max-w-xl">
                Create and share direct payment links from any provider you prefer — whether it is your custom checkout, PayPal, LemonSqueezy, CashApp, or direct merchant gateway. Seamlessly synchronize with your public storefront.
              </p>
            </div>

            {/* Metric Blocks */}
            <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 space-y-1">
                <p className="text-[10px] font-mono text-zinc-500 uppercase font-bold">Active Pay Links</p>
                <p className="text-2xl font-black text-white">{payLinks.length}</p>
                <p className="text-[10px] text-emerald-400 font-mono">● Live on Storefront</p>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 space-y-1">
                <p className="text-[10px] font-mono text-zinc-500 uppercase font-bold">Creator Revenue</p>
                <p className="text-2xl font-black text-emerald-400">85%</p>
                <p className="text-[10px] text-zinc-400 font-mono">15% platform split</p>
              </div>

              <div className="col-span-2 sm:col-span-1 p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 space-y-1">
                <p className="text-[10px] font-mono text-zinc-500 uppercase font-bold">Settlement Model</p>
                <p className="text-sm font-bold text-cyan-400 truncate">Direct Pay Link</p>
                <p className="text-[10px] text-zinc-400 font-mono">Non-custodial rail</p>
              </div>
            </div>
          </div>
        </section>

        {/* Creator Handle & Public Storefront Link Bar */}
        <section className="p-4 md:p-6 rounded-2xl bg-zinc-950/80 border border-zinc-900 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <p className="text-xs font-mono font-bold text-zinc-300 flex items-center gap-2">
              <Store className="w-4 h-4 text-cyan-400" />
              Creator Storefront Handle &amp; URL
            </p>
            <p className="text-[11px] text-zinc-500 font-mono">
              Your public storefront automatically surfaces all active Pay Links defined below.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
            <div className="flex items-center rounded-xl bg-zinc-900 border border-zinc-800 px-3 py-1.5 text-xs font-mono text-zinc-300">
              <span className="text-zinc-500 mr-1">/storefront/</span>
              <input
                type="text"
                value={accountId}
                onChange={(e) => handleAccountChange(e.target.value)}
                className="bg-transparent text-white font-bold focus:outline-none w-36"
                placeholder="creator-slug"
              />
            </div>

            <button
              onClick={handleCopyStorefront}
              className="px-3 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Copy Storefront URL"
            >
              {copiedStorefront ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedStorefront ? 'Copied' : 'Copy URL'}
            </button>

            <Link
              href={`/storefront/${encodeURIComponent(accountId || 'sovranly-creator')}`}
              target="_blank"
              className="px-3.5 py-2 rounded-xl bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-800/60 text-cyan-300 text-xs font-mono font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Open Storefront
            </Link>
          </div>
        </section>

        {/* Main Grid: Create Pay Link & Active Links List */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Create New Pay Link (4 cols) */}
          <section className="lg:col-span-5 p-6 rounded-3xl bg-zinc-950 border border-zinc-900 space-y-6 h-fit sticky top-28">
            <div className="space-y-1.5">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-emerald-400" />
                Register New Pay Link
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Add any direct checkout URL, payment link, or invoice rail.
              </p>
            </div>

            <form onSubmit={handleCreatePayLink} className="space-y-4">
              {/* Product Title */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider">
                  Product / License Title <span className="text-emerald-400">*</span>
                </label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Master Sync License Pack"
                  className="w-full px-4 py-3 rounded-xl bg-zinc-900/80 border border-zinc-800 text-white placeholder-zinc-600 text-xs focus:outline-none focus:border-cyan-500/60 transition-colors"
                  required
                />
              </div>

              {/* Price & Category */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider">
                    Price (USD) <span className="text-emerald-400">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-3 text-xs text-zinc-500 font-mono">$</span>
                    <input
                      type="number"
                      step="0.01"
                      min="0.50"
                      value={formPrice}
                      onChange={(e) => setFormPrice(e.target.value)}
                      placeholder="49.00"
                      className="w-full pl-8 pr-3 py-3 rounded-xl bg-zinc-900/80 border border-zinc-800 text-white placeholder-zinc-600 text-xs font-mono focus:outline-none focus:border-cyan-500/60 transition-colors"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider">
                    Category
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as PayLinkProduct['category'])}
                    className="w-full px-3 py-3 rounded-xl bg-zinc-900/80 border border-zinc-800 text-white text-xs focus:outline-none focus:border-cyan-500/60 transition-colors"
                  >
                    <option value="master">Master License</option>
                    <option value="sync">Sync Rights</option>
                    <option value="subscription">Retainer</option>
                    <option value="nft">NFT Certificate</option>
                    <option value="merch">Merchandise</option>
                  </select>
                </div>
              </div>

              {/* Pay Link URL */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider flex items-center justify-between">
                  <span>Destination Pay Link URL <span className="text-emerald-400">*</span></span>
                  <span className="text-[10px] text-zinc-500">Any valid checkout link</span>
                </label>
                <div className="relative">
                  <LinkIcon className="absolute left-3.5 top-3.5 w-3.5 h-3.5 text-zinc-500" />
                  <input
                    type="url"
                    value={formUrl}
                    onChange={(e) => setFormUrl(e.target.value)}
                    placeholder="https://pay.example.com/checkout..."
                    className="w-full pl-9 pr-3 py-3 rounded-xl bg-zinc-900/80 border border-zinc-800 text-white placeholder-zinc-600 text-xs font-mono focus:outline-none focus:border-cyan-500/60 transition-colors"
                    required
                  />
                </div>
                <p className="text-[10px] text-zinc-500 font-mono">
                  Enter your payment provider URL (e.g., custom checkout, PayPal, LemonSqueezy, PayLink, etc.)
                </p>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider">
                  Product Description
                </label>
                <textarea
                  rows={3}
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  placeholder="Describe rights included, deliverables, audio bitrates, and license scope..."
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-900/80 border border-zinc-800 text-white placeholder-zinc-600 text-xs focus:outline-none focus:border-cyan-500/60 transition-colors resize-none"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black font-bold text-xs tracking-tight shadow-lg shadow-emerald-950/40 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Publishing Pay Link...
                  </>
                ) : (
                  <>
                    <PlusCircle className="w-4 h-4" />
                    Publish to Storefront &amp; Pay Rail
                  </>
                )}
              </button>
            </form>

            {/* Customer Billing Portal Card */}
            <div className="p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800/80 space-y-3 mt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-emerald-950/80 text-emerald-400 border border-emerald-800/50">
                    <CreditCard className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Stripe Customer Billing Portal</h4>
                    <p className="text-[10px] text-zinc-400 font-mono">Config: bpc_1UE0CpFU8wO4GPzPZS2EnWyL</p>
                  </div>
                </div>
                <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800/50">
                  Active
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                Manage your Sovranly platform subscription, update credit cards, download tax receipts, or modify billing details directly in Stripe.
              </p>
              <a
                href={process.env.NEXT_PUBLIC_STRIPE_CUSTOMER_PORTAL_URL || 'https://billing.stripe.com/p/login/9B66oHdl8cplfpq1BV2Ji00'}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-3 rounded-xl bg-zinc-850 hover:bg-zinc-800 text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors border border-zinc-700 cursor-pointer"
              >
                <span>Launch Stripe Billing Portal</span>
                <ExternalLink className="w-3.5 h-3.5 text-zinc-400" />
              </a>
            </div>
          </section>

          {/* Right Column: Active Pay Links Catalogue (7 cols) */}
          <section className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-cyan-400" />
                  Configured Pay Links Directory
                </h3>
                <p className="text-xs text-zinc-400">
                  Manage direct checkout links, test redirects, and generate QR codes for customers.
                </p>
              </div>

              <div className="text-xs font-mono text-zinc-500">
                {payLinks.length} Item{payLinks.length === 1 ? '' : 's'}
              </div>
            </div>

            {loading ? (
              <div className="p-12 rounded-3xl bg-zinc-950 border border-zinc-900 text-center space-y-3">
                <RefreshCw className="w-6 h-6 animate-spin text-cyan-400 mx-auto" />
                <p className="text-xs font-mono text-zinc-400">Loading Pay Links directory...</p>
              </div>
            ) : payLinks.length === 0 ? (
              <div className="p-12 rounded-3xl bg-zinc-950 border border-zinc-900 text-center space-y-4">
                <CreditCard className="w-10 h-10 text-zinc-600 mx-auto" />
                <div className="space-y-1">
                  <p className="text-sm font-bold text-zinc-300">No Pay Links Registered Yet</p>
                  <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                    Use the form on the left to add your first direct pay link for your IP licenses or products.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {payLinks.map((item) => (
                  <div
                    key={item.id}
                    className="p-5 rounded-2xl bg-zinc-950 border border-zinc-900 hover:border-zinc-800 transition-all space-y-4 shadow-md"
                  >
                    {/* Item Header */}
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1.5 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          {getCategoryBadge(item.category)}
                          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-900/40 px-2 py-0.5 rounded-full">
                            ● Active
                          </span>
                        </div>
                        <h4 className="text-base font-bold text-white">{item.name}</h4>
                        <p className="text-xs text-zinc-400 leading-relaxed">{item.description}</p>
                      </div>

                      {/* Price Badge */}
                      <div className="text-right shrink-0">
                        <span className="text-xl font-black text-white font-mono">
                          ${item.price.toFixed(2)}
                        </span>
                        <span className="text-[10px] text-zinc-500 block font-mono">USD</span>
                      </div>
                    </div>

                    {/* Pay Link URL Box */}
                    <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/80 flex items-center justify-between gap-2 text-xs font-mono">
                      <div className="flex items-center gap-2 text-zinc-400 truncate flex-1">
                        <LinkIcon className="w-3.5 h-3.5 shrink-0 text-cyan-400" />
                        <span className="truncate text-zinc-300">{item.payUrl}</span>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() => handleCopy(item.id, item.payUrl)}
                          className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors cursor-pointer"
                          title="Copy Direct Pay Link"
                        >
                          {copiedId === item.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>

                        <a
                          href={item.payUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg bg-emerald-950/60 hover:bg-emerald-900 text-emerald-300 border border-emerald-800/40 transition-colors cursor-pointer"
                          title="Open & Test Pay Link"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>

                    {/* Action Buttons Toolbar */}
                    <div className="flex items-center justify-between pt-1 border-t border-zinc-900 text-xs">
                      <div className="flex items-center gap-2">
                        {/* QR Code Trigger */}
                        <button
                          onClick={() => handleOpenQr(item)}
                          className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white font-mono text-[11px] flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <QrCode className="w-3.5 h-3.5 text-cyan-400" />
                          QR Code
                        </button>

                        {/* Embed Button */}
                        <button
                          onClick={() => handleOpenEmbed(item)}
                          className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white font-mono text-[11px] flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Code2 className="w-3.5 h-3.5 text-violet-400" />
                          Embed Button
                        </button>
                      </div>

                      {/* Delete Trigger */}
                      <button
                        onClick={() => handleDeletePayLink(item.id)}
                        className="p-1.5 rounded-lg text-zinc-500 hover:text-rose-400 hover:bg-rose-950/30 transition-colors cursor-pointer"
                        title="Delete Pay Link"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>

      {/* QR Code Modal */}
      {activeQrModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-zinc-950 border border-zinc-800 rounded-3xl p-6 space-y-5 shadow-2xl relative">
            <button
              onClick={() => setActiveQrModal(null)}
              className="absolute top-4 right-4 p-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="text-center space-y-1">
              <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider font-bold">Instant Mobile Payment</span>
              <h4 className="text-lg font-bold text-white">{activeQrModal.name}</h4>
              <p className="text-xs font-mono text-zinc-400">${activeQrModal.price.toFixed(2)} USD</p>
            </div>

            {/* Rendered QR Image */}
            <div className="p-4 bg-white rounded-2xl flex items-center justify-center shadow-inner">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={activeQrModal.qrDataUrl}
                alt={`QR code for ${activeQrModal.name}`}
                className="w-56 h-56 object-contain"
              />
            </div>

            <div className="space-y-2 text-center">
              <p className="text-[11px] text-zinc-400">
                Scan with any smartphone camera to open the direct payment link instantly.
              </p>
              <div className="pt-2">
                <a
                  href={activeQrModal.qrDataUrl}
                  download={`paylink-${activeQrModal.name.toLowerCase().replace(/\s+/g, '-')}.png`}
                  className="inline-flex items-center justify-center w-full py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 text-xs font-mono font-bold transition-colors cursor-pointer"
                >
                  Download QR Image
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Embed Code Modal */}
      {activeEmbedModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-zinc-950 border border-zinc-800 rounded-3xl p-6 space-y-4 shadow-2xl relative">
            <button
              onClick={() => setActiveEmbedModal(null)}
              className="absolute top-4 right-4 p-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-1">
              <h4 className="text-base font-bold text-white">Embed Pay Link Button</h4>
              <p className="text-xs text-zinc-400">
                Paste this HTML snippet into your personal website, portfolio, or Notion page:
              </p>
            </div>

            <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 font-mono text-[11px] text-emerald-300 break-all select-all">
              {activeEmbedModal.code}
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(activeEmbedModal.code);
                  setActiveEmbedModal(null);
                  setSuccessMessage('Embed HTML copied to clipboard!');
                  setTimeout(() => setSuccessMessage(null), 3000);
                }}
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" />
                Copy HTML Snippet
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
