'use client';
import { Button } from '@/components/ui/button';
import { ArrowRight, ShieldCheck, Zap, Lock } from 'lucide-react';
import Link from 'next/link';

export default function LandingPage() {
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
        <Button size="lg" className="px-8 rounded-full">
          Launch Marketplace <ArrowRight className="ml-2 h-4 w-4" />
        </Button>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
          {[
            { icon: ShieldCheck, title: "Zero Trust Security", desc: "Authenticated and authorized access to all intellectual property." },
            { icon: Zap, title: "Automated Royalties", desc: "Smart contract-driven payments meant for immediate compensation." },
            { icon: Lock, title: "Immutable Ownership", desc: "Blockchain-based registry providing definitive proof of creation." },
          ].map((feature, i) => (
            <div key={i} className="p-8 bg-zinc-900 rounded-3xl border border-zinc-800 text-left">
              <feature.icon className="h-10 w-10 text-emerald-400 mb-4" />
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-zinc-500">{feature.desc}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
