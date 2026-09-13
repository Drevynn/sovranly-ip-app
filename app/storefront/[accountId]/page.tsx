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
  Layers,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { SovranlyLogo } from '@/components/SovranlyLogo';
import { PayLinkProduct, DEFAULT_PAY_LINKS, getStoredPayLinks } from '@/lib/paylinks';

export default function StorefrontPage({ 
  params 
}: { 
  params: Promise<{ accountId: string }> 
}) {
  const resolvedParams = use(params);
  const accountId = resolvedParams.accountId;

  const [products, setProducts] = useState<PayLinkProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
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
        const res = await fetch(`/api/paylinks?accountId=${encodeURIComponent(accountId)}`);
        const data = await res.json();

        if (!ignore) {
          if (res.ok && data.products && data.products.length > 0) {
            setProducts(data.products);
          } else {
            const stored = getStoredPayLinks();
            setProducts(stored);
          }
          setLoading(false);
        }
      } catch {
        if (!ignore) {
          const stored = getStoredPayLinks();
          setProducts(stored);
          setLoading(false);
        }
      }
    }

    fetchStorefrontData();

    return () => {
      ignore = true;
    };
  }, [accountId]);

  const loadProducts = async () => {
    setLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch(`/api/paylinks?accountId=${encodeURIComponent(accountId)}`);
      const data = await res.json();

      if (res.ok && data.products && data.products.length > 0) {
        setProducts(data.products);
      } else {
        const stored = getStoredPayLinks();
        setProducts(stored);
      }
    } catch {
      const stored = getStoredPayLinks();
      setProducts(stored);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Buy Product:
   * Redirects customer directly to the creator's configured Pay Link.
   */
  const handleBuy = (product: PayLinkProduct) => {
    setBuyingProductId(product.id);
    setErrorMessage(null);

    try {
      if (product.payUrl) {
        window.open(product.payUrl, '_blank', 'noopener,noreferrer');
      } else {
        throw new Error('No Pay Link URL configured for this item.');
      }
    } catch (err: unknown) {
      const error = err as Error;
      setErrorMessage(error.message);
    } finally {
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
              title="Return to Pay Link Hub"
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
              Direct Sovereign Pay Links
            </span>
            <Link
              href="/connect"
              className="px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 text-xs font-mono transition-colors"
            >
              Manage Links
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 md:px-6 py-10 space-y-8">
        {/* Checkout Success Banner */}
        {checkoutSuccess && (
          <div className="p-5 rounded-3xl bg-emerald-950/50 border border-emerald-800/80 text-emerald-200 shadow-xl flex items-start gap-4">
            <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
            <div className="space-y-1 text-xs font-mono">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-emerald-300">Payment Order Synchronized!</h3>
                <button
                  onClick={() => setCheckoutSuccess(false)}
                  className="text-[10px] text-emerald-400 hover:underline cursor-pointer"
                >
                  Dismiss
                </button>
              </div>
              <p className="text-zinc-300">
                Your direct payment was routed to the creator (<code className="text-emerald-300">{accountId}</code>).
                The sovereign license certificate has been registered.
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
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">Direct Creator Storefront</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-white">Verified Creator IP Catalogue</h2>
            <p className="text-sm text-zinc-400 max-w-xl">
              Purchase digital intellectual property licenses, synchronization rights, and recordings directly from creator <code className="text-zinc-300">{accountId}</code>. Seamlessly fulfilled via direct Pay Links.
            </p>
          </div>

          <div className="p-4 bg-black/60 rounded-2xl border border-zinc-800 space-y-1.5 text-xs font-mono">
            <div className="text-zinc-500 text-[10px] uppercase font-bold">Monetization Architecture</div>
            <div className="text-zinc-200 flex items-center gap-1.5 font-bold">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" /> Direct Creator Pay Link Rail
            </div>
            <div className="text-zinc-500 text-[10px]">Settlement: 85% Creator / 15% Platform</div>
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
              className="text-xs font-mono text-zinc-400 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Refresh
            </button>
          </div>

          {loading ? (
            <div className="py-20 text-center space-y-3">
              <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin mx-auto" />
              <p className="text-xs font-mono text-zinc-500">Retrieving active Pay Link items...</p>
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
                        ${product.price ? product.price.toFixed(2) : ((product.unitAmount || 0) / 100).toFixed(2)} USD
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
                      <span>ID: {product.id.slice(0, 14)}...</span>
                      <span className="text-emerald-400">Instant Access</span>
                    </div>

                    <button
                      onClick={() => handleBuy(product)}
                      disabled={buyingProductId === product.id}
                      className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black font-mono font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-950 disabled:opacity-50 cursor-pointer"
                    >
                      <CreditCard className="w-4 h-4" /> 
                      <span>Acquire with Pay Link</span>
                      <ExternalLink className="w-3.5 h-3.5 opacity-70" />
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
                  This creator has not yet published any Pay Links. Visit the Pay Link Hub to register and manage products.
                </p>
              </div>
              <Link
                href="/connect"
                className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/60 rounded-xl text-xs font-mono font-bold text-white transition-colors"
              >
                Go to Pay Link Hub
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
