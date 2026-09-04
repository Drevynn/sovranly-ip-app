'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
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
  Terminal, 
  Copy, 
  Check, 
  HelpCircle,
  ShoppingBag
} from 'lucide-react';
import { SovranlyLogo } from '@/components/SovranlyLogo';

interface AccountStatus {
  id: string;
  displayName: string;
  contactEmail: string;
  readyToProcessPayments: boolean;
  onboardingComplete: boolean;
  requirementsStatus: string;
  cardPaymentCapability: string;
}

interface ProductItem {
  id: string;
  name: string;
  description: string | null;
  unitAmount: number;
  currency: string;
}

export default function ConnectHubPage() {
  // State for active connected account initialized lazily
  const [accountId, setAccountId] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      return params.get('accountId') || localStorage.getItem('sovranly_stripe_account_id') || '';
    }
    return '';
  });
  const [displayName, setDisplayName] = useState<string>('Sovranly Creator Studio');
  const [contactEmail, setContactEmail] = useState<string>('creator@sovranlyip.com');

  // Status & loading states
  const [loadingCreate, setLoadingCreate] = useState<boolean>(false);
  const [loadingOnboard, setLoadingOnboard] = useState<boolean>(false);
  const [loadingStatus, setLoadingStatus] = useState<boolean>(false);
  const [loadingProduct, setLoadingProduct] = useState<boolean>(false);
  const [loadingSub, setLoadingSub] = useState<boolean>(false);
  const [loadingPortal, setLoadingPortal] = useState<boolean>(false);

  // Data states
  const [accountStatus, setAccountStatus] = useState<AccountStatus | null>(null);
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('subscription_success')) {
        return 'Successfully subscribed to platform membership plan!';
      }
      if (params.get('returned')) {
        return 'Returned from Stripe onboarding flow. Fetching latest verification status...';
      }
    }
    return null;
  });
  const [copiedCli, setCopiedCli] = useState<boolean>(false);

  // Product creation form states
  const [productName, setProductName] = useState<string>('Exclusive Master Recording License');
  const [productDesc, setProductDesc] = useState<string>('Full commercial synchronization license with zero-trust cryptographic certificate.');
  const [productPrice, setProductPrice] = useState<number>(49);

  // Fetch products on connected account using Stripe-Account header endpoint
  const fetchProducts = useCallback(async (id: string) => {
    try {
      const res = await fetch(`/api/stripe/products?accountId=${encodeURIComponent(id)}`);
      const data = await res.json();
      if (res.ok && data.products) {
        setProducts(data.products);
      }
    } catch (err) {
      console.error('Failed to load products:', err);
    }
  }, []);

  // Fetch account status directly from the accounts API
  const fetchAccountStatus = useCallback(async (idToFetch: string) => {
    if (!idToFetch) return;
    setLoadingStatus(true);
    setErrorMessage(null);

    try {
      /**
       * In accordance with Stripe Connect V2 guidelines:
       * Always fetch account status from the Stripe accounts API directly.
       * Do NOT cache or rely solely on database representations.
       */
      const res = await fetch(`/api/stripe/account?accountId=${encodeURIComponent(idToFetch)}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to retrieve account status');
      }

      setAccountStatus(data.account);
      // Also fetch products for this account
      fetchProducts(idToFetch);
    } catch (err: unknown) {
      const errObj = err as Error;
      console.error('Error fetching account status:', errObj);
      setErrorMessage(errObj.message);
    } finally {
      setLoadingStatus(false);
    }
  }, [fetchProducts]);

  // Trigger status fetch when accountId changes
  useEffect(() => {
    let ignore = false;
    if (!accountId || !accountId.startsWith('acct_')) return;

    async function loadAccountData() {
      try {
        const [accRes, prodRes] = await Promise.all([
          fetch(`/api/stripe/account?accountId=${encodeURIComponent(accountId)}`),
          fetch(`/api/stripe/products?accountId=${encodeURIComponent(accountId)}`),
        ]);
        const accData = await accRes.json();
        const prodData = await prodRes.json();

        if (!ignore) {
          if (!accRes.ok) {
            setErrorMessage(accData.message || 'Failed to retrieve account status');
          } else {
            setAccountStatus(accData.account);
          }

          if (prodRes.ok && prodData.products) {
            setProducts(prodData.products);
          }
          setLoadingStatus(false);
        }
      } catch (err: unknown) {
        if (!ignore) {
          setErrorMessage((err as Error).message);
          setLoadingStatus(false);
        }
      }
    }

    loadAccountData();

    return () => {
      ignore = true;
    };
  }, [accountId]);

  // Step 1: Create V2 Connected Account
  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingCreate(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      /**
       * Creates a Connected Account using the V2 API:
       * - display_name
       * - contact_email
       * - dashboard: 'full'
       * - merchant capabilities: card_payments requested
       */
      const res = await fetch('/api/stripe/account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ displayName, contactEmail }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to create connected account');
      }

      const newId = data.account.id;
      setAccountId(newId);
      localStorage.setItem('sovranly_stripe_account_id', newId);
      setSuccessMessage(`Successfully created Stripe V2 Connected Account: ${newId}`);
      fetchAccountStatus(newId);
    } catch (err: unknown) {
      setErrorMessage((err as Error).message);
    } finally {
      setLoadingCreate(false);
    }
  };

  // Step 2: Onboard Connected Account via V2 Account Links
  const handleStartOnboarding = async () => {
    if (!accountId) return;
    setLoadingOnboard(true);
    setErrorMessage(null);

    try {
      /**
       * Uses V2 account links API to create an onboarding session:
       * use_case: { type: 'account_onboarding', account_onboarding: { configurations: ['merchant', 'customer'] } }
       */
      const res = await fetch('/api/stripe/account-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accountId }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to generate onboarding link');
      }

      // Redirect user to Stripe's hosted onboarding flow
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err: unknown) {
      setErrorMessage((err as Error).message);
      setLoadingOnboard(false);
    }
  };

  // Step 3: Create Product on Connected Account
  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accountId) return;
    setLoadingProduct(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/stripe/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accountId,
          name: productName,
          description: productDesc,
          priceInCents: Math.round(productPrice * 100),
          currency: 'usd',
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to create product');
      }

      setSuccessMessage(`Product "${productName}" created on connected account!`);
      fetchProducts(accountId);
    } catch (err: unknown) {
      setErrorMessage((err as Error).message);
    } finally {
      setLoadingProduct(false);
    }
  };

  // Step 4: Charge Subscription to Connected Account (customer_account: accountId)
  const handleSubscribePlatform = async () => {
    if (!accountId) return;
    setLoadingSub(true);
    setErrorMessage(null);

    try {
      /**
       * In V2 accounts, customer_account: "acct_..." is used for subscriptions.
       * Charges a platform subscription fee directly to the connected account.
       */
      const res = await fetch('/api/stripe/subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accountId }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to initiate platform subscription');
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err: unknown) {
      setErrorMessage((err as Error).message);
      setLoadingSub(false);
    }
  };

  // Step 5: Open Customer Billing Portal
  const handleOpenBillingPortal = async () => {
    if (!accountId) return;
    setLoadingPortal(true);
    setErrorMessage(null);

    try {
      /**
       * Creates a Customer Billing Portal session for the V2 connected account:
       * stripeClient.billingPortal.sessions.create({ customer_account: accountId, return_url })
       */
      const res = await fetch('/api/stripe/billing-portal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accountId }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to open billing portal');
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err: unknown) {
      setErrorMessage((err as Error).message);
      setLoadingPortal(false);
    }
  };

  const copyCliCommand = () => {
    navigator.clipboard.writeText(
      `stripe listen --thin-events 'v2.core.account[requirements].updated,v2.core.account[configuration.merchant].capability_status_updated,v2.core.account[configuration.customer].capability_status_updated' --forward-thin-to http://localhost:3000/api/stripe/webhooks/thin`
    );
    setCopiedCli(true);
    setTimeout(() => setCopiedCli(false), 2000);
  };

  return (
    <div className="min-h-screen bg-black text-zinc-100 font-sans selection:bg-cyan-500/30">
      {/* Top Navigation */}
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
                  Stripe Connect &amp; Merchant Hub
                  <span className="text-[10px] font-mono bg-cyan-950 text-cyan-400 border border-cyan-800/60 px-2 py-0.5 rounded-full">
                    V2 Accounts API
                  </span>
                </h1>
                <p className="text-xs text-zinc-400 font-mono">Zero Trust Sovereign Payment Rail Integration</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {accountId && (
              <Link
                href={`/storefront/${accountId}`}
                className="px-3.5 py-2 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border border-emerald-500/40 text-xs font-mono font-bold flex items-center gap-2 transition-all shadow-sm"
              >
                <Store className="w-4 h-4 text-emerald-400" />
                View Customer Storefront
              </Link>
            )}
            <Link
              href="/pricing"
              className="px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 text-xs font-mono transition-colors"
            >
              Platform Pricing
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-8 space-y-8">
        {/* Banner Alert Messages */}
        {errorMessage && (
          <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-800/60 text-rose-200 flex items-start gap-3 shadow-lg">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div className="text-xs font-mono space-y-1">
              <p className="font-bold text-rose-300">Configuration or Action Notice:</p>
              <p className="text-zinc-300 leading-relaxed">{errorMessage}</p>
              {errorMessage.includes('STRIPE_SECRET_KEY') && (
                <div className="mt-2 p-2 bg-black/60 rounded border border-rose-900/40 text-[11px] text-zinc-400">
                  Tip: Provide your Stripe test secret key (<code className="text-rose-300">sk_test_...</code>) in <code className="text-cyan-300">.env.local</code> or platform Settings to enable real Stripe API requests.
                </div>
              )}
            </div>
          </div>
        )}

        {successMessage && (
          <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-800/60 text-emerald-200 flex items-start gap-3 shadow-lg">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <p className="text-xs font-mono text-emerald-300 leading-relaxed">{successMessage}</p>
          </div>
        )}

        {/* Top Grid: Onboarding & Account State */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Create or Switch Connected Account (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-zinc-950 border border-zinc-900 rounded-3xl p-6 shadow-xl space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-cyan-950/80 border border-cyan-800/50 text-cyan-400">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-white uppercase tracking-wider">1. Connected Account</h2>
                    <p className="text-xs text-zinc-400">V2 Core Accounts API</p>
                  </div>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-900 text-zinc-400 border border-zinc-800">
                  Step 1
                </span>
              </div>

              {/* Existing Account Switcher */}
              <div className="space-y-2">
                <label className="text-xs font-mono text-zinc-400 flex items-center justify-between">
                  <span>Current Account ID:</span>
                  {accountId && (
                    <button
                      onClick={() => fetchAccountStatus(accountId)}
                      className="text-[10px] text-cyan-400 hover:underline flex items-center gap-1"
                    >
                      <RefreshCw className={`w-3 h-3 ${loadingStatus ? 'animate-spin' : ''}`} />
                      Refresh API Status
                    </button>
                  )}
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={accountId}
                    onChange={(e) => {
                      setAccountId(e.target.value);
                      localStorage.setItem('sovranly_stripe_account_id', e.target.value);
                    }}
                    placeholder="acct_1..."
                    className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs font-mono text-white placeholder-zinc-600 focus:outline-none focus:border-cyan-500"
                  />
                  <button
                    onClick={() => fetchAccountStatus(accountId)}
                    disabled={!accountId || loadingStatus}
                    className="px-3 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 text-xs font-mono rounded-xl disabled:opacity-50"
                  >
                    Load
                  </button>
                </div>
              </div>

              <div className="relative py-2">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-zinc-900" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-zinc-950 px-2 text-[10px] font-mono text-zinc-500">Or Create New V2 Account</span>
                </div>
              </div>

              {/* Account Creation Form */}
              <form onSubmit={handleCreateAccount} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-zinc-300">Creator / Business Name</label>
                  <input
                    type="text"
                    required
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="e.g. Apex Master Sounds"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-zinc-300">Contact Email</label>
                  <input
                    type="email"
                    required
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="creator@sovranlyip.com"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="p-3 bg-zinc-900/60 rounded-xl border border-zinc-800/80 text-[11px] text-zinc-400 font-mono space-y-1">
                  <div className="text-cyan-400 flex items-center gap-1.5 font-bold">
                    <Check className="w-3 h-3" /> V2 Accounts Configuration:
                  </div>
                  <div>• Country: US (Automatic)</div>
                  <div>• Dashboard: Full access</div>
                  <div>• Capability: Card payments requested</div>
                  <div>• Fees &amp; losses collector: Stripe</div>
                </div>

                <button
                  type="submit"
                  disabled={loadingCreate}
                  className="w-full py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-mono font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-cyan-950 disabled:opacity-50 cursor-pointer"
                >
                  {loadingCreate ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" /> Creating Account...
                    </>
                  ) : (
                    <>
                      <PlusCircle className="w-4 h-4" /> Create Connected Account
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Right Column: Live Status & Stripe Onboarding (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-zinc-950 border border-zinc-900 rounded-3xl p-6 shadow-xl space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-emerald-950/80 border border-emerald-800/50 text-emerald-400">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-white uppercase tracking-wider">2. Onboarding Status &amp; Link</h2>
                    <p className="text-xs text-zinc-400">Direct API Verification</p>
                  </div>
                </div>

                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-900 text-zinc-400 border border-zinc-800">
                  Step 2
                </span>
              </div>

              {/* Status Overview Card */}
              {accountStatus ? (
                <div className="p-5 bg-zinc-900/50 border border-zinc-800/80 rounded-2xl space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-800/80 pb-3">
                    <div>
                      <div className="text-xs font-bold text-white">{accountStatus.displayName || 'Connected Account'}</div>
                      <div className="text-[11px] font-mono text-zinc-400">{accountStatus.id}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold flex items-center gap-1.5 border ${
                        accountStatus.readyToProcessPayments 
                          ? 'bg-emerald-950/80 text-emerald-300 border-emerald-700/60' 
                          : 'bg-amber-950/80 text-amber-300 border-amber-700/60'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${accountStatus.readyToProcessPayments ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                        {accountStatus.readyToProcessPayments ? 'Payments Active' : 'Payments Inactive'}
                      </span>
                    </div>
                  </div>

                  {/* Capabilities & Requirements Breakdown */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-mono">
                    <div className="p-3 bg-black/40 rounded-xl border border-zinc-800/60">
                      <span className="text-[10px] text-zinc-500 block">Card Payments</span>
                      <span className={`font-bold capitalize ${accountStatus.readyToProcessPayments ? 'text-emerald-400' : 'text-amber-400'}`}>
                        {accountStatus.cardPaymentCapability}
                      </span>
                    </div>

                    <div className="p-3 bg-black/40 rounded-xl border border-zinc-800/60">
                      <span className="text-[10px] text-zinc-500 block">Onboarding State</span>
                      <span className={`font-bold ${accountStatus.onboardingComplete ? 'text-emerald-400' : 'text-zinc-300'}`}>
                        {accountStatus.onboardingComplete ? 'Completed' : 'Pending Action'}
                      </span>
                    </div>

                    <div className="p-3 bg-black/40 rounded-xl border border-zinc-800/60">
                      <span className="text-[10px] text-zinc-500 block">Requirements Deadline</span>
                      <span className="text-zinc-300 font-bold capitalize">
                        {accountStatus.requirementsStatus || 'None'}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-8 border border-dashed border-zinc-800 rounded-2xl text-center space-y-2">
                  <HelpCircle className="w-8 h-8 text-zinc-600 mx-auto" />
                  <p className="text-xs font-mono text-zinc-400">
                    No active connected account loaded. Please create one on the left or enter your existing account ID.
                  </p>
                </div>
              )}

              {/* Onboard Action Button */}
              <div className="pt-2">
                <button
                  onClick={handleStartOnboarding}
                  disabled={!accountId || loadingOnboard}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-mono font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-950 disabled:opacity-50 cursor-pointer"
                >
                  {loadingOnboard ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" /> Generating Account Link...
                    </>
                  ) : (
                    <>
                      <ExternalLink className="w-4 h-4" /> Onboard to Collect Payments
                    </>
                  )}
                </button>
                <p className="text-[10px] font-mono text-zinc-500 text-center mt-2">
                  Uses Stripe V2 Account Links with merchant &amp; customer configurations.
                </p>
              </div>

              {/* Subscription to Platform & Billing Portal */}
              <div className="p-4 bg-zinc-900/40 rounded-2xl border border-zinc-800/80 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-cyan-400" />
                    <span className="text-xs font-bold text-white">Platform Subscription &amp; Billing Portal</span>
                  </div>
                  <span className="text-[10px] font-mono text-zinc-400">customer_account: {accountId || 'acct_...'}</span>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  In Stripe V2, connected accounts double as customer accounts. Charge membership subscriptions or launch the hosted customer billing portal directly.
                </p>
                <div className="flex flex-wrap gap-2 pt-1">
                  <button
                    onClick={handleSubscribePlatform}
                    disabled={!accountId || loadingSub}
                    className="px-4 py-2 bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-all disabled:opacity-50 cursor-pointer"
                  >
                    {loadingSub ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <CreditCard className="w-3.5 h-3.5" />}
                    Subscribe to Platform Plan ($29/mo)
                  </button>

                  <button
                    onClick={handleOpenBillingPortal}
                    disabled={!accountId || loadingPortal}
                    className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/60 text-zinc-200 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-all disabled:opacity-50 cursor-pointer"
                  >
                    {loadingPortal ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <ExternalLink className="w-3.5 h-3.5" />}
                    Open Customer Billing Portal
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Middle Section: Create Products & Storefront Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Create Products on Connected Account (5 cols) */}
          <div className="lg:col-span-5 bg-zinc-950 border border-zinc-900 rounded-3xl p-6 shadow-xl space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-violet-950/80 border border-violet-800/50 text-violet-400">
                  <PlusCircle className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-white uppercase tracking-wider">3. Create Product</h2>
                  <p className="text-xs text-zinc-400">Stripe-Account Header</p>
                </div>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-900 text-zinc-400 border border-zinc-800">
                Step 3
              </span>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-300">Product / License Name</label>
                <input
                  type="text"
                  required
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  placeholder="e.g. Master Sync License #402"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-300">Description</label>
                <textarea
                  rows={2}
                  value={productDesc}
                  onChange={(e) => setProductDesc(e.target.value)}
                  placeholder="Asset license specifications..."
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-300">Price (USD)</label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-xs text-zinc-500 font-mono">$</span>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    required
                    value={productPrice}
                    onChange={(e) => setProductPrice(Number(e.target.value))}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-7 pr-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="p-3 bg-zinc-900/60 rounded-xl border border-zinc-800/80 text-[11px] text-zinc-400 font-mono">
                <code>{`stripeClient.products.create({ ... }, { stripeAccount: '${accountId || "acct_..."}' })`}</code>
              </div>

              <button
                type="submit"
                disabled={!accountId || loadingProduct}
                className="w-full py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-mono font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-violet-950 disabled:opacity-50 cursor-pointer"
              >
                {loadingProduct ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" /> Publishing...
                  </>
                ) : (
                  <>
                    <PlusCircle className="w-4 h-4" /> Publish Product to Connected Account
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Storefront Products Catalog (7 cols) */}
          <div className="lg:col-span-7 bg-zinc-950 border border-zinc-900 rounded-3xl p-6 shadow-xl space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-amber-950/80 border border-amber-800/50 text-amber-400">
                  <Store className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-white uppercase tracking-wider">4. Active Connected Catalog</h2>
                  <p className="text-xs text-zinc-400">Products for {accountId || 'Account'}</p>
                </div>
              </div>

              {accountId && (
                <Link
                  href={`/storefront/${accountId}`}
                  className="text-xs font-mono text-cyan-400 hover:underline flex items-center gap-1"
                >
                  Visit Storefront <ExternalLink className="w-3 h-3" />
                </Link>
              )}
            </div>

            {products.length > 0 ? (
              <div className="space-y-3 max-h-[340px] overflow-y-auto pr-1">
                {products.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 bg-zinc-900/50 border border-zinc-800/80 rounded-2xl flex items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="text-xs font-bold text-white">{item.name}</div>
                      {item.description && (
                        <div className="text-[11px] text-zinc-400 line-clamp-1">{item.description}</div>
                      )}
                      <div className="text-[10px] font-mono text-zinc-500">ID: {item.id}</div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-sm font-mono font-bold text-emerald-400">
                        ${(item.unitAmount / 100).toFixed(2)}
                      </div>
                      <Link
                        href={`/storefront/${accountId}`}
                        className="text-[10px] font-mono text-zinc-400 hover:text-white underline mt-1 block"
                      >
                        Buy via Direct Charge
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 border border-dashed border-zinc-800 rounded-2xl text-center space-y-2">
                <ShoppingBag className="w-8 h-8 text-zinc-600 mx-auto" />
                <p className="text-xs font-mono text-zinc-400">
                  No products created on this connected account yet. Use the form on the left to add your first product.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Section: Developer & Webhook Documentation Card */}
        <div className="bg-zinc-950 border border-zinc-900 rounded-3xl p-6 shadow-xl space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-indigo-950/80 border border-indigo-800/50 text-indigo-400">
                <Terminal className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-white uppercase tracking-wider">5. Webhooks &amp; Requirements Listener</h2>
                <p className="text-xs text-zinc-400">Thin Events (V2) &amp; Snapshot Events (Subscriptions)</p>
              </div>
            </div>

            <button
              onClick={copyCliCommand}
              className="px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/60 rounded-xl text-xs font-mono text-zinc-200 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {copiedCli ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedCli ? 'Copied Command!' : 'Copy CLI Command'}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-mono">
            {/* Thin Events */}
            <div className="p-4 bg-zinc-900/40 rounded-2xl border border-zinc-800/80 space-y-2">
              <div className="text-indigo-400 font-bold flex items-center gap-1.5">
                <Layers className="w-4 h-4" /> V2 Thin Events (/api/stripe/webhooks/thin)
              </div>
              <p className="text-zinc-400 text-[11px] leading-relaxed">
                Thin events alert the server to fetch requirement &amp; capability changes on connected accounts.
              </p>
              <div className="p-2 bg-black/60 rounded border border-zinc-800 text-[10px] text-zinc-300 break-all">
                stripe listen --thin-events &apos;v2.core.account[requirements].updated,v2.core.account[configuration.merchant].capability_status_updated&apos; --forward-thin-to http://localhost:3000/api/stripe/webhooks/thin
              </div>
            </div>

            {/* Standard Snapshot Events */}
            <div className="p-4 bg-zinc-900/40 rounded-2xl border border-zinc-800/80 space-y-2">
              <div className="text-cyan-400 font-bold flex items-center gap-1.5">
                <CreditCard className="w-4 h-4" /> Subscription Webhooks (/api/stripe/webhooks/subscription)
              </div>
              <p className="text-zinc-400 text-[11px] leading-relaxed">
                Listens for <code className="text-cyan-300">customer.subscription.*</code> and <code className="text-cyan-300">invoice.*</code> events. Extracts <code className="text-cyan-300">subscription.customer_account</code> for V2 accounts.
              </p>
              <div className="p-2 bg-black/60 rounded border border-zinc-800 text-[10px] text-zinc-300 break-all">
                stripe listen --forward-to http://localhost:3000/api/stripe/webhooks/subscription
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
