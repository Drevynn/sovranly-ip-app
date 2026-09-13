'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Terminal, 
  BookOpen, 
  ArrowLeft, 
  ExternalLink, 
  ShieldCheck, 
  Code, 
  Layers, 
  Database,
  Sparkles,
  Zap,
  ArrowRight
} from 'lucide-react';
import { SovranlyLogo } from '@/components/SovranlyLogo';
import { PublicNavbarHamburger } from '@/components/PublicNavbarHamburger';
import ApiPlayground from '@/components/ApiPlayground';
import NewsletterSignup from '@/components/NewsletterSignup';

export default function PlaygroundPage() {
  return (
    <div className="min-h-screen bg-black text-zinc-100 font-sans selection:bg-cyan-500/20 selection:text-cyan-300">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 w-[600px] h-[600px] bg-teal-500/5 rounded-full blur-[160px] pointer-events-none" />

      {/* Main Navigation Header */}
      <nav className="border-b border-zinc-900 bg-zinc-950/70 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="hover:opacity-90 transition-opacity">
              <SovranlyLogo />
            </Link>
            <div className="hidden md:flex items-center gap-6 text-xs font-mono">
              <Link href="/docs" className="text-zinc-400 hover:text-white transition-colors flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-cyan-400" /> Docs
              </Link>
              <Link href="/playground" className="text-cyan-400 font-bold transition-colors flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5" /> API Playground
              </Link>
              <Link href="/marketplace" className="text-zinc-400 hover:text-white transition-colors flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-teal-400" /> Marketplace
              </Link>
              <Link href="/pricing" className="text-zinc-400 hover:text-white transition-colors flex items-center gap-1.5">
                Pricing (85/15)
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link 
              href="/dashboard" 
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white text-xs font-bold font-mono transition-all shadow-md shadow-cyan-950/40 cursor-pointer"
            >
              Creator Studio <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <PublicNavbarHamburger />
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-10">
        
        {/* Breadcrumbs & Navigation */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-500">
            <Link href="/" className="hover:text-zinc-300 transition-colors">Home</Link>
            <span>/</span>
            <Link href="/docs" className="hover:text-zinc-300 transition-colors">Documentation</Link>
            <span>/</span>
            <span className="text-cyan-400 font-bold">API Playground</span>
          </div>

          <Link
            href="/docs"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Full Documentation
          </Link>
        </div>

        {/* Interactive API Playground Component */}
        <ApiPlayground />

        {/* Developer Quick Reference Grid */}
        <div className="pt-8 border-t border-zinc-900 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-zinc-950/60 border border-zinc-850 space-y-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-950/60 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wide">Zero Trust Authentication</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Every production API request requires continuous cryptographic validation. Pass <code className="text-cyan-300 font-mono text-[11px]">Authorization: Bearer &lt;TOKEN&gt;</code> in all protected requests.
            </p>
            <Link href="/docs#security-and-c2pa" className="text-xs font-mono text-cyan-400 hover:underline inline-flex items-center gap-1 pt-1">
              Read Security Protocol <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="p-6 rounded-2xl bg-zinc-950/60 border border-zinc-850 space-y-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-950/60 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Database className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wide">85/15 Royalty Standard</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Royalty payments recorded via <code className="text-emerald-300 font-mono text-[11px]">POST /api/royalties</code> automatically execute the 85% creator disbursement with zero-trust escrow clearance.
            </p>
            <Link href="/docs#licensing-splits" className="text-xs font-mono text-emerald-400 hover:underline inline-flex items-center gap-1 pt-1">
              View Royalty Smart Contracts <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="p-6 rounded-2xl bg-zinc-950/60 border border-zinc-850 space-y-3">
            <div className="w-9 h-9 rounded-xl bg-violet-950/60 border border-violet-500/30 flex items-center justify-center text-violet-400">
              <Code className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wide">Client SDKs &amp; Webhooks</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Integrate the Sovranly IP Node.js or Python SDK into your DSP ingestion pipeline, game engine, or web app to automate instant synchronization clearances.
            </p>
            <Link href="/docs#sdk-and-webhooks" className="text-xs font-mono text-violet-400 hover:underline inline-flex items-center gap-1 pt-1">
              Explore SDK Reference <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* Newsletter & Updates */}
        <div className="pt-6">
          <NewsletterSignup />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-900 bg-zinc-950 py-12 mt-16 text-xs text-zinc-500 font-mono">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <SovranlyLogo />
            <span>&copy; 2026 Sovranly IP Developer Network. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-zinc-300">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-zinc-300">Terms of Service</Link>
            <Link href="/docs" className="hover:text-zinc-300">Documentation</Link>
            <Link href="/marketplace" className="hover:text-zinc-300">Marketplace</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
