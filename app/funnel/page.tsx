'use client';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, ShieldCheck, Coins, Blocks } from 'lucide-react';
import Link from 'next/link';

export default function LandingPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Graceful initial render loading state for feature cards
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);
  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans">
      <nav className="flex items-center justify-between p-6 max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold tracking-tight">Sovranly IP</h1>
        <div className="space-x-4">
          <Link href="/" className="text-sm text-zinc-400 hover:text-white">Dashboard</Link>
          <Button>Get Started</Button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-16 text-center">
        <h2 className="text-6xl font-extrabold tracking-tighter mb-6 bg-gradient-to-r from-emerald-400 to-sky-400 bg-clip-text text-transparent">
          Secure Intellectual Property <br /> Powering the Creator Economy
        </h2>
        <p className="text-xl text-zinc-400 mb-10 max-w-2xl mx-auto">
          Sovranly IP brings Zero Trust Architecture to the creative industries. Register, manage, and monetize your work with blockchain-native security and automated royalty distribution.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Button size="lg" className="px-8 rounded-full">
            Launch Marketplace <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <Link href="/funnel/whitepaper">
            <Button size="lg" variant="outline" className="px-8 rounded-full border-zinc-800 text-zinc-300 hover:bg-zinc-900 hover:text-white">
              Download 2026 Executive Summary
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                id={`funnel-feature-skeleton-${i}`}
                data-testid="feature-card-skeleton"
                className="p-8 bg-zinc-900 rounded-3xl border border-zinc-800 text-left animate-pulse"
              >
                <div className="w-14 h-14 rounded-2xl border border-zinc-800 bg-zinc-800/70 mb-6" />
                <div className="h-6 w-3/4 bg-zinc-800/80 rounded-lg mb-3" />
                <div className="space-y-2">
                  <div className="h-4 w-full bg-zinc-800/50 rounded-md" />
                  <div className="h-4 w-4/5 bg-zinc-800/50 rounded-md" />
                </div>
              </div>
            ))
          ) : (
            [
              {
                icon: ShieldCheck,
                title: "Zero Trust Security",
                desc: "Authenticated and authorized access to all intellectual property.",
                color: "text-emerald-400",
                bgColor: "bg-emerald-500/10 border-emerald-500/20"
              },
              {
                icon: Coins,
                title: "Automated Royalties",
                desc: "Smart contract-driven payments meant for immediate compensation.",
                color: "text-amber-400",
                bgColor: "bg-amber-500/10 border-amber-500/20"
              },
              {
                icon: Blocks,
                title: "Immutable Ownership",
                desc: "Blockchain-based registry providing definitive proof of creation.",
                color: "text-sky-400",
                bgColor: "bg-sky-500/10 border-sky-500/20"
              },
            ].map((feature, i) => (
              <div
                key={i}
                id={`funnel-feature-card-${i}`}
                className="p-8 bg-zinc-900 rounded-3xl border border-zinc-800 text-left transition-all duration-300 ease-out hover:scale-105 hover:border-zinc-700 hover:shadow-xl hover:shadow-black/50 cursor-pointer group"
              >
                <div className={`w-14 h-14 rounded-2xl border flex items-center justify-center mb-6 ${feature.bgColor} transition-transform duration-300 group-hover:scale-110`}>
                  <feature.icon className={`h-7 w-7 ${feature.color}`} />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-zinc-500">{feature.desc}</p>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
