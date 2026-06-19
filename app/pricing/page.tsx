'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  ArrowRight, 
  Check, 
  Sparkles, 
  ShieldCheck, 
  Coins, 
  Globe2, 
  Flame, 
  Cpu, 
  HelpCircle,
  TrendingUp,
  Sliders,
  DollarSign
} from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/components/LanguageProvider';
import LanguageSelector from '@/components/LanguageSelector';
import GoogleAd from '@/components/GoogleAd';

export default function PricingPage() {
  const { t } = useLanguage();
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annual'>('monthly');

  const plans = [
    {
      name: "Starter Studio",
      price: billingPeriod === 'monthly' ? 29 : 24,
      limit: "10 IP asset registers/mo",
      description: "For emerging independent creators and sovereign artists starting their blockchain IP registration journey.",
      features: [
        "10 IP Asset Cryptographic Registrations",
        "Base Shared Sovereign Smart Contracts",
        "Standard Metadata Ledger Pinning",
        "Standard 2.0% Part A Domestic Fee Split",
        "Standard 4.0% Part D Overseas Compliance Tax",
        "Basic On-chain Royalty Analytics Sandbox",
        "MetaMask or WalletConnect Auths"
      ],
      popular: false,
      color: "border-zinc-800 bg-zinc-950/40",
      accent: "text-cyan-400"
    },
    {
      name: "Growth Studio",
      price: billingPeriod === 'monthly' ? 99 : 79,
      limit: "50 IP asset registers/mo",
      description: "For expanding production teams, collaborative collectives, and independent content labels.",
      features: [
        "50 IP Asset Cryptographic Registrations",
        "Semi-Dedicated Multi-Party Smart Contracts",
        "IPFS Distributed Ledger Architecture",
        "Custom Licensing Contract Agreement builder",
        "Standard 2.0% Part A / 4.0% Part D Splits",
        "Advanced Ledger Reporting & Exporting",
        "Continuous Session Identity Verification",
        "Priority Support Team Access"
      ],
      popular: true,
      color: "border-emerald-500/30 bg-zinc-950/60 shadow-2xl shadow-emerald-950/20",
      accent: "text-emerald-400"
    },
    {
      name: "Enterprise Sovereign",
      price: billingPeriod === 'monthly' ? 299 : 239,
      limit: "Unlimited IP registers/mo",
      description: "For media houses, serious studios, enterprise record labels, and sovereign IP content syndicates.",
      features: [
        "Unlimited Cryptographic Registrations",
        "Isolated Dedicated Proxy Ledger Contracts",
        "Legal Compliance API Connection Integrations",
        "Custom Contract Rules Policy Engine",
        "Custom Part A / Part D Commission Splits",
        "Continuous Zero Trust Session Identity Logs",
        "On-Chain Direct Mainnet Proxy Routing",
        "24/7 Dedicated Legal SLA Assistance"
      ],
      popular: false,
      color: "border-violet-950/60 bg-zinc-950/40",
      accent: "text-violet-400"
    }
  ];

  return (
    <div className="min-h-screen bg-black text-zinc-100 font-sans selection:bg-cyan-500/20 selection:text-cyan-300 relative overflow-hidden">
      {/* Dynamic Glow Accents */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[550px] bg-emerald-500/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 w-[650px] h-[650px] bg-violet-500/5 rounded-full blur-[150px] pointer-events-none" />

      {/* Landing Navigation Header */}
      <header className="relative border-b border-white/10 bg-black/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center justify-between p-6 max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <Image src="/sovranly-logo-v2.png" alt="Sovranly IP Logo" width={36} height={36} className="rounded-xl shadow-lg shadow-cyan-950/50" referrerPolicy="no-referrer" />
            <Link href="/" className="font-bold tracking-tighter text-white text-xl uppercase">{t('brandName')}</Link>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/dashboard" className="text-sm text-zinc-400 hover:text-white transition-colors">{t('commandCenter')}</Link>
            <Link href="/pricing" className="text-sm text-white font-bold transition-colors">Pricing</Link>
            <Link href="/marketplace" className="text-sm text-zinc-400 hover:text-white transition-colors">{t('marketplace')}</Link>
            <Link href="/onboarding" className="text-sm text-zinc-400 hover:text-white transition-colors">{t('chatHelp')}</Link>
            <Link href="/wiki" className="text-sm text-zinc-400 hover:text-white transition-colors">{t('wiki')}</Link>
            <Link href="/faq" className="text-sm text-zinc-400 hover:text-white transition-colors">{t('faq')}</Link>
          </nav>
          <div className="flex items-center gap-4">
            <LanguageSelector />
            <Button asChild variant="outline" className="border-zinc-800 bg-transparent text-white hover:bg-zinc-900 transition-all rounded-full hidden sm:inline-flex">
              <Link href="/marketplace">{t('marketplace')}</Link>
            </Button>
            <Button asChild className="bg-gradient-to-r from-cyan-500 to-violet-500 hover:brightness-110 text-white font-medium shadow-lg shadow-cyan-950/40 rounded-full">
              <Link href="/dashboard">{t('launchConsole')}</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Pricing Hero Panel */}
      <main className="relative max-w-7xl mx-auto px-6 py-20 space-y-24 text-center">
        
        {/* Intro Headers */}
        <section className="space-y-6 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-emerald-950/45 border border-emerald-900/40 rounded-full text-xs text-emerald-400 animate-pulse [animation-duration:4s]">
            <Sparkles className="w-4 h-4" />
            <span className="font-mono tracking-widest uppercase text-[10px] font-bold">MONETIZATION DEPLOYMENTS STATE</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tighter leading-tight">
            Predictable Plans.<br />
            <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">Zero Custody Architecture.</span>
          </h1>
          <p className="text-lg text-zinc-400 font-light leading-relaxed">
            Choose a subscription plan baseline to configure your monthly IP asset registration quotas. Enjoy up to <strong className="text-zinc-200">98% direct payment retention</strong> with Creative Sovereignty LLC’s transparent decentralized hybrid contract routing.
          </p>

          {/* Billing Interval Toggle Switch */}
          <div className="flex justify-center items-center gap-3 pt-6">
            <span className={`text-xs font-mono font-bold uppercase transition-colors ${billingPeriod === 'monthly' ? 'text-white' : 'text-zinc-500'}`}>Monthly Billing</span>
            <button 
              onClick={() => setBillingPeriod(billingPeriod === 'monthly' ? 'annual' : 'monthly')}
              className="relative w-14 h-7 bg-zinc-900 border border-zinc-800 rounded-full transition-all focus:outline-none"
            >
              <div 
                className={`absolute top-0.5 w-5 h-5 rounded-full transition-all duration-300 bg-emerald-400 ${
                  billingPeriod === 'annual' ? 'left-8 bg-cyan-400' : 'left-1'
                }`}
              />
            </button>
            <span className={`text-xs font-mono font-bold uppercase transition-colors ${billingPeriod === 'annual' ? 'text-emerald-400' : 'text-zinc-500'}`}>
              Annual Billing <span className="text-[10px] bg-emerald-950/50 border border-emerald-900/40 px-1.5 py-0.5 rounded text-emerald-400 ml-1">Save 20%</span>
            </span>
          </div>
        </section>

        {/* Pricing Plan Cards Deck */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start text-left max-w-6xl mx-auto">
          {plans.map((plan, i) => (
            <Card key={i} className={`border rounded-[32px] overflow-hidden shadow-xl transition-all duration-300 relative ${plan.color} ${plan.popular ? 'border-emerald-500/40 hover:border-emerald-400/60' : 'border-zinc-900 hover:border-zinc-800'}`}>
              
              {plan.popular && (
                <div className="absolute top-0 right-0 bg-gradient-to-l from-emerald-500 to-teal-500 text-black font-mono font-black text-[9px] uppercase tracking-wider px-4 py-1.5 rounded-bl-2xl">
                  Most Popular
                </div>
              )}
              
              <CardHeader className="p-8 border-b border-zinc-900/40">
                <span className={`text-xs font-bold uppercase tracking-wider font-mono ${plan.accent}`}>{plan.name}</span>
                <div className="mt-4 flex items-baseline">
                  <span className="text-5xl font-black text-white font-mono tracking-tighter">${plan.price}</span>
                  <span className="text-zinc-500 font-mono text-sm ml-2">/month</span>
                </div>
                <CardDescription className="text-emerald-400/95 font-mono text-xs font-bold mt-2 flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5" /> Limits: {plan.limit}
                </CardDescription>
                <p className="text-xs text-zinc-400 mt-4 leading-relaxed max-w-xs">{plan.description}</p>
              </CardHeader>

              <CardContent className="p-8 space-y-4">
                <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest font-black">Plan Deployments Include</p>
                <ul className="space-y-3.5">
                  {plan.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-xs leading-tight">
                      <Check className={`w-4 h-4 mt-0.5 flex-shrink-0 ${plan.popular ? 'text-emerald-400' : 'text-zinc-500'}`} />
                      <span className="text-zinc-300">{feat}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter className="p-8 border-t border-zinc-900/30">
                <Button asChild className={`w-full py-6 rounded-2xl font-bold text-sm tracking-tight transition-all duration-300 ${
                  plan.popular 
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-black hover:brightness-110 shadow-lg shadow-emerald-500/10' 
                    : 'bg-zinc-900 hover:bg-zinc-800 text-white'
                }`}>
                  <Link href="/dashboard" className="flex items-center justify-center gap-2">
                    Activate Plan Console <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </section>

        {/* Clear hybrid transaction transparency explain pane */}
        <section className="bg-zinc-950/70 border border-zinc-900 rounded-[32px] p-8 md:p-12 text-left max-w-5xl mx-auto relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-[90px] pointer-events-none" />
          
          <div className="relative z-10 space-y-8">
            <div className="space-y-2">
              <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest font-bold">LEDGER SETTLEMENT TRANSPARENCY</span>
              <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">Standard Part A & Model D Surtaxes</h2>
              <p className="text-zinc-400 text-xs">
                Creative Sovereignty LLC utilizes a dual non-custodial split pattern directly embedded inside the on-chain license registry:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-2">
              <div className="space-y-3 p-5 bg-zinc-900/30 border border-zinc-900 rounded-2xl">
                <div className="inline-flex p-2 bg-emerald-950/50 border border-emerald-990/30 rounded-xl text-emerald-400">
                  <Coins className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-sm text-white flex items-center gap-2">
                  Part A Domestic Fee (2.0%)
                </h4>
                <p className="text-xs text-zinc-500 leading-relaxed">
                  All domestic transactional licensing checkouts process on-chain with a simple flat 2.0% platform split commission. The remaining <strong className="text-zinc-300">98.0% clears directly into your wallet</strong> instantly.
                </p>
              </div>

              <div className="space-y-3 p-5 bg-zinc-900/30 border border-zinc-900 rounded-2xl">
                <div className="inline-flex p-2 bg-violet-950/50 border border-violet-990/30 rounded-xl text-violet-400">
                  <Globe2 className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-sm text-white flex items-center gap-2">
                  Model D Overseas Fee (4.0%)
                </h4>
                <p className="text-xs text-zinc-500 leading-relaxed">
                  Transactions detected as cross-border license agreements trigger an absolute compliance split (2.0% base platform commission + 2.0% local customs surcharge) to verify tax requirements. You receive <strong className="text-zinc-300">96.0% peer-to-peer</strong>.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-center bg-zinc-950 p-6 rounded-2xl border border-zinc-900/80 gap-4">
              <div className="space-y-1">
                <span className="font-bold text-xs text-white block">Want to dynamically simulate your earnings pro-forma?</span>
                <span className="text-zinc-500 text-[10px] block leading-normal">Adjust subscriber configurations, subscription distributions, and international transaction splits inside the Sandbox.</span>
              </div>
              <Button asChild variant="outline" className="border-emerald-800/40 text-emerald-400 bg-emerald-950/20 hover:bg-emerald-950/50 hover:text-white rounded-xl py-5 px-6 shrink-0 transition-all">
                <Link href="/dashboard" className="flex items-center gap-2">
                  <Sliders className="w-4 h-4" /> Open Royalty Sandbox
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Pricing FAQ Collapse Block */}
        <section className="space-y-8 max-w-4xl mx-auto text-left">
          <div className="text-center space-y-2">
            <h3 className="text-2xl font-bold tracking-tight text-white">Pricing & Sandbox FAQs</h3>
            <p className="text-xs text-zinc-500 max-w-md mx-auto">Get answers to the most common queries regarding subscription levels and ledger commissions.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
            {[
              {
                q: "What is the Creative Sovereignty Zero-Custody concept?",
                a: "Unlike Web2 platforms which hold your funds in their corporate bank balances, Sovranly IP’s contracts dispatch your royalty cuts instantly to your peer-to-peer MetaMask or cold-storage addresses upon receipt. We never hold your money."
              },
              {
                q: "Can I swap or cancel plans at any point?",
                a: "Yes. All plans are on standard billing terms. Your allocated monthly IP registration quotas will adjust automatically on the ledger immediately. There are no lock-in terms."
              },
              {
                q: "What happens if I cross my monthly register limit?",
                a: "Upon crossing quota limits, registrations pause pending either an incremental credit buy-in or a simple upgrade. Your deployed smart-licensed assets remain fully active."
              },
              {
                q: "How are Part D overseas fees computed?",
                a: "When a foreign licensee purchases usage permissions, on-chain geographic address metadata is evaluated, automatically triggering the incremental 2.0% compliance surcharge (Part D) to verify that sovereign international legal mandates are validated."
              }
            ].map((item, index) => (
              <div key={index} className="p-6 bg-zinc-900/20 border border-zinc-900 rounded-2xl space-y-2">
                <h4 className="font-bold text-zinc-200 text-xs flex gap-2">
                  <HelpCircle className="w-4 h-4 text-cyan-400 flex-shrink-0" /> {item.q}
                </h4>
                <p className="text-[11px] text-zinc-500 leading-normal pl-6">{item.a}</p>
              </div>
            ))}
          </div>
        </section>

      </main>

      {/* Ad Sponsor Slot */}
      <div className="max-w-7xl mx-auto px-6 mb-12">
        <GoogleAd slot="8519201081" />
      </div>

      {/* Public Page Footer */}
      <footer className="border-t border-white/5 py-12 bg-zinc-950/45 text-center text-zinc-650 text-xs">
        <p>{t('copyright')}</p>
      </footer>
    </div>
  );
}
