'use client';

import React, { useState, useEffect, useCallback, use } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Store, 
  ShoppingBag, 
  CreditCard, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  ShieldCheck, 
  Layers
} from 'lucide-react';
import { SovranlyLogo } from '@/components/SovranlyLogo';

/**
 * ==============================================================================
 * STOREFRONT IDENTIFIER DESIGN NOTE:
 * ==============================================================================
 * NOTE FOR DEVELOPERS:
 * In this sample integration, the Stripe Connected Account ID (e.g. acct_1234567890)
 * is passed directly in the URL route: `/storefront/[accountId]`.
 * 
 * In a production architecture, you should NEVER expose raw Stripe account IDs in
 * customer-facing URLs. Instead, configure a human-friendly creator handle or slug
 * in your database (e.g., `/storefront/creator-handle` or `creator.sovranlyip.com`)
 * and securely resolve the associated `stripeAccountId` on your backend server.
 * ==============================================================================
 */

interface StorefrontProduct {
  id: string;
  name: string;
  description: string | null;
  unitAmount: number;
  currency: string;
  priceId: string | null;
}

export default function StorefrontPage({ 
  params 
}: { 
  params: Promise<{ accountId: string }> 
}) {
  const resolvedParams = use(params);
  const accountId = resolvedParams.accountId;

  const [products, setProducts] = useState<StorefrontProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(() => Boolean(accountId));
  const [buyingProductId, setBuyingProductId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [checkoutSuccess, setCheckoutSuccess] = useState<boolean>(false);

  useEffect(() => {
    try {
      const searchParams = new URLSearchParams(window.location.search);
      if (searchParams.get('success') === 'true') {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setCheckoutSuccess(true);
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    let ignore = false;

    async function fetchStorefrontData() {
      try {
        const res = await fetch(`/api/stripe/products?accountId=${encodeURIComponent(accountId)}`);
        const data = await res.json();
        if (!ignore) {
          if (!res.ok) {
            setErrorMessage(data.message || 'Failed to load storefront products');
          } else {
            setProducts(data.products || []);
          }
          setLoading(false);
        }
      } catch (err: unknown) {
        if (!ignore) {
          setErrorMessage((err as Error).message);
          setLoading(false);
        }
      }
    }

    if (accountId) {
      fetchStorefrontData();
    }

    return () => {
      ignore = true;
    };
  }, [accountId]);

  const loadProducts = async () => {
    if (!accountId) return;
    setLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch(`/api/stripe/products?accountId=${encodeURIComponent(accountId)}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to load storefront products');
      }

      setProducts(data.products || []);
    } catch (err: unknown) {
      const error = err as Error;
      console.error('Storefront error:', error);
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Buy Product:
   * Initiates a Direct Charge Checkout Session with an application fee.
   * The payment funds go directly to the connected account, while the platform
   * keeps an application fee (e.g., $1.50).
   */
  const handleBuy = async (product: StorefrontProduct) => {
    setBuyingProductId(product.id);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accountId,
          productId: product.id,
          productName: product.name,
          productDescription: product.description,
          priceInCents: product.unitAmount,
          applicationFeeAmount: 150, // $1.50 application fee for platform
          quantity: 1,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to initialize checkout session');
      }

      // Redirect customer to Stripe Hosted Checkout
      if (data.url) {
        window.location.assign(data.url);
      }
    } catch (err: unknown) {
      const error = err as Error;
      setErrorMessage(error.message);
      setBuyingProductId(null);
    }
  };

  return (
    <div className="min-h-screen bg-black text-zinc-100 font-sans selection:bg-cyan-500/30">
      {/* Header */}
      <header className="border-b border-zinc-900 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 md:px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link 
              href="/connect" 
              className="p-2 -ml-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors"
              title="Return to Connect Hub"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-2.5">
              <SovranlyLogo size="sm" />
              <div>
                <h1 className="text-base font-bold tracking-tight text-white flex items-center gap-2">
                  Creator Sovereign Storefront
                </h1>
                <p className="text-xs text-zinc-400 font-mono">
                  Seller Account: <code className="text-cyan-400">{accountId}</code>
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-flex text-[10px] font-mono px-2.5 py-1 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-800/60 items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Zero Trust Direct Charge
            </span>
            <Link
              href="/connect"
              className="px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 text-xs font-mono transition-colors"
            >
              Merchant Hub
            </Link>
          </div>
        </div>
      </header>

      {/* Developer Architectural Callout */}
      <div className="bg-zinc-950 border-b border-zinc-900 px-4 py-2.5">
        <div className="max-w-6xl mx-auto flex items-center gap-2 text-[11px] font-mono text-zinc-400">
          <span className="text-amber-400 font-bold">Architecture Notice:</span>
          <span>
            Using raw Connected Account ID in URL for sample demo. Production apps should use creator slugs (e.g., /storefront/creator-name).
          </span>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 md:px-6 py-10 space-y-8">
        {/* Checkout Success Banner */}
        {checkoutSuccess && (
          <div className="p-5 rounded-3xl bg-emerald-950/50 border border-emerald-800/80 text-emerald-200 shadow-xl flex items-start gap-4">
            <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
            <div className="space-y-1 text-xs font-mono">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-emerald-300">Payment Successful!</h3>
                <button
                  onClick={() => setCheckoutSuccess(false)}
                  className="text-[10px] text-emerald-400 hover:underline"
                >
                  Dismiss
                </button>
              </div>
              <p className="text-zinc-300">
                Your direct payment was received by the connected account (<code className="text-emerald-300">{accountId}</code>).
                The platform retained the application fee.
              </p>
            </div>
          </div>
        )}

        {/* Error Notice */}
        {errorMessage && (
          <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-800/60 text-rose-200 flex items-start gap-3 shadow-lg">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div className="text-xs font-mono space-y-1">
              <p className="font-bold text-rose-300">Storefront Notice:</p>
              <p className="text-zinc-300">{errorMessage}</p>
            </div>
          </div>
        )}

        {/* Storefront Hero */}
        <div className="bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 border border-zinc-900 rounded-3xl p-8 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Store className="w-5 h-5 text-cyan-400" />
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">Direct Merchant Storefront</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-white">Verified Creator IP Catalog</h2>
            <p className="text-sm text-zinc-400 max-w-xl">
              Purchase digital intellectual property licenses and recordings directly from creator <code className="text-zinc-300">{accountId}</code>. Payments processed securely via Stripe Direct Charges.
            </p>
          </div>

          <div className="p-4 bg-black/60 rounded-2xl border border-zinc-800 space-y-1.5 text-xs font-mono">
            <div className="text-zinc-500 text-[10px] uppercase">Monetization Model</div>
            <div className="text-zinc-200 flex items-center gap-1.5 font-bold">
              <CreditCard className="w-3.5 h-3.5 text-emerald-400" /> Direct Charge + App Fee ($1.50)
            </div>
            <div className="text-zinc-500 text-[10px]">Seller of Record: Connected Account</div>
          </div>
        </div>

        {/* Products Grid */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-emerald-400" />
              Available Products &amp; Licenses ({products.length})
            </h3>
            <button
              onClick={loadProducts}
              disabled={loading}
              className="text-xs font-mono text-zinc-400 hover:text-white flex items-center gap-1.5 transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Refresh
            </button>
          </div>

          {loading ? (
            <div className="py-20 text-center space-y-3">
              <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin mx-auto" />
              <p className="text-xs font-mono text-zinc-500">Retrieving products with Stripe-Account header...</p>
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="bg-zinc-950 border border-zinc-900 rounded-3xl p-6 shadow-xl flex flex-col justify-between space-y-5 hover:border-zinc-800 transition-all"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="p-2 rounded-xl bg-cyan-950/60 border border-cyan-800/40 text-cyan-400">
                        <Layers className="w-5 h-5" />
                      </div>
                      <span className="text-base font-mono font-bold text-emerald-400">
                        ${(product.unitAmount / 100).toFixed(2)} {product.currency.toUpperCase()}
                      </span>
                    </div>

                    <div>
                      <h4 className="text-base font-bold text-white">{product.name}</h4>
                      <p className="text-xs text-zinc-400 mt-1 leading-relaxed line-clamp-3">
                        {product.description || 'Verified commercial copyright license issued via Sovranly IP smart contract registry.'}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3 pt-4 border-t border-zinc-900">
                    <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500">
                      <span>Product ID: {product.id.slice(0, 14)}...</span>
                      <span>Instant Access</span>
                    </div>

                    <button
                      onClick={() => handleBuy(product)}
                      disabled={buyingProductId === product.id}
                      className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-mono font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-950 disabled:opacity-50 cursor-pointer"
                    >
                      {buyingProductId === product.id ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" /> Preparing Checkout...
                        </>
                      ) : (
                        <>
                          <CreditCard className="w-4 h-4" /> Buy Now (Direct Charge)
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 border border-dashed border-zinc-800 rounded-3xl text-center space-y-4">
              <ShoppingBag className="w-12 h-12 text-zinc-600 mx-auto" />
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-white">No Products Published Yet</h4>
                <p className="text-xs text-zinc-400 font-mono max-w-md mx-auto">
                  This connected account has not yet published any products. Visit the Connect Hub to create sample products on this account.
                </p>
              </div>
              <Link
                href="/connect"
                className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/60 rounded-xl text-xs font-mono font-bold text-white transition-colors"
              >
                Go to Connect Hub
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
