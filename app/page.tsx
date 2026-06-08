'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  ArrowRight, 
  ShieldCheck, 
  Zap, 
  Lock, 
  ExternalLink, 
  Mail, 
  BookOpen, 
  MessageSquare,
  Sparkles
} from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-100 font-sans selection:bg-cyan-500/20 selection:text-cyan-300">
      {/* Glow Effects */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-[600px] h-[600px] bg-violet-500/5 rounded-full blur-[140px] pointer-events-none" />

      {/* Navigation Header */}
      <header className="relative border-b border-white/10 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center justify-between p-6 max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-tr from-cyan-500 to-violet-500 rounded-xl flex items-center justify-center text-white font-bold text-base shadow-lg shadow-cyan-950/50">S</div>
            <Link href="/" className="font-bold tracking-tighter text-white text-xl uppercase">SOVRANLY IP</Link>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/dashboard" className="text-sm text-zinc-400 hover:text-white transition-colors">Command Center</Link>
            <Link href="/marketplace" className="text-sm text-zinc-400 hover:text-white transition-colors">Marketplace</Link>
            <Link href="/onboarding" className="text-sm text-zinc-400 hover:text-white transition-colors">AI Onboarding</Link>
            <Link href="/wiki" className="text-sm text-zinc-400 hover:text-white transition-colors">Wiki / Help</Link>
          </nav>
          <div className="flex items-center gap-4">
            <Button asChild variant="outline" className="border-zinc-800 bg-transparent text-white hover:bg-zinc-900 transition-all rounded-full hidden sm:inline-flex">
              <Link href="/marketplace">Marketplace</Link>
            </Button>
            <Button asChild className="bg-gradient-to-r from-cyan-500 to-violet-500 hover:brightness-110 text-white font-medium shadow-lg shadow-cyan-950/40 rounded-full">
              <Link href="/dashboard">Launch Console</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative max-w-7xl mx-auto px-6 py-16 md:py-28 space-y-32">
        <section className="text-center space-y-8 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-zinc-900 border border-zinc-800 rounded-full text-xs text-zinc-400 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Zero Trust Blockchain Sovereign IP Authority</span>
          </div>
          <h2 className="text-5xl md:text-7xl font-extrabold tracking-tighter text-white leading-none">
            Secure Intellectual Property <br />
            <span className="bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent">Powering the Creator Economy</span>
          </h2>
          <p className="text-lg md:text-xl text-zinc-400 max-w-3xl mx-auto leading-relaxed">
            Sovranly IP brings robust, Zero Trust Architecture to intellectual property. Register, license, and seamlessly commercialize your assets with automated smart contracts and immutable proof of ownership.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-6">
            <Button asChild size="lg" className="w-full sm:w-auto px-8 py-6 rounded-full bg-gradient-to-r from-cyan-500 to-violet-500 text-white font-bold text-base hover:brightness-110 shadow-lg shadow-cyan-950/50 transition">
              <Link href="/dashboard">Deploy IP Asset <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="w-full sm:w-auto px-8 py-6 rounded-full border-zinc-800 bg-zinc-950 text-white hover:bg-zinc-900 font-bold text-base transition">
              <Link href="/marketplace">Explore Marketplace</Link>
            </Button>
          </div>
        </section>

        {/* Feature Highlights Grid */}
        <section className="space-y-12">
          <div className="text-center space-y-4">
            <h3 className="text-3xl font-extrabold tracking-tight text-white">Trust Nothing. Authenticate Everything.</h3>
            <p className="text-zinc-400 max-w-lg mx-auto">We secure the creator economy through robust technological structures.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                icon: ShieldCheck, 
                title: "Zero Trust Governance", 
                desc: "Continuously validated, cryptographically secure permissions system protecting access and viewing rights for sensitive media and data." 
              },
              { 
                icon: Zap, 
                title: "Automated Royalty Splits", 
                desc: "Self-executing smart contract layers dispatch direct peer-to-peer micro-licensing fees and royalty fractions instantly on-chain." 
              },
              { 
                icon: Lock, 
                title: "Immutable Digital Fingerprint", 
                desc: "Permanent timestamp registry storing high-fidelity cryptographic hashes of media files, offering ironclad courtroom proof of authorship." 
              },
            ].map((feature, i) => (
              <div key={i} className="group p-8 bg-zinc-900/40 border border-zinc-800/60 rounded-3xl text-left hover:border-zinc-700/80 transition-all duration-300 shadow-xl shadow-zinc-950/20 backdrop-blur-sm">
                <div className="inline-flex p-3 bg-zinc-950 border border-zinc-800 rounded-2xl mb-6 group-hover:scale-105 transition-all">
                  <feature.icon className="h-6 h-6 text-cyan-400 group-hover:text-cyan-300" />
                </div>
                <h4 className="text-xl font-bold text-white mb-3">{feature.title}</h4>
                <p className="text-zinc-500 leading-relaxed text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Secondary Hubs (AI Onboarding & Support / FAQ) */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="bg-zinc-900/30 border border-zinc-800/60 backdrop-blur-sm rounded-3xl p-8 flex flex-col justify-between">
            <div>
              <div className="inline-flex p-3 bg-cyan-950/30 border border-cyan-800/30 rounded-2xl mb-6">
                <MessageSquare className="h-6 w-6 text-cyan-400" />
              </div>
              <h4 className="text-2xl font-bold text-white mb-2">Smart AI Onboarding</h4>
              <p className="text-sm text-zinc-400 leading-relaxed max-w-sm mb-6">
                Have questions about registering your copyright, smart-licensing, or setting up your wallet? Our continuous AI companion is ready to guide you.
              </p>
            </div>
            <Button asChild variant="secondary" className="w-full bg-zinc-800 hover:bg-zinc-700 text-zinc-100 rounded-xl py-5">
              <Link href="/onboarding">Launch AI Chat Help <ExternalLink className="ml-2 w-4 h-4"/></Link>
            </Button>
          </Card>
          
          <Card className="bg-zinc-900/30 border border-zinc-800/60 backdrop-blur-sm rounded-3xl p-8 flex flex-col justify-between">
            <div>
              <div className="inline-flex p-3 bg-violet-950/30 border border-violet-800/30 rounded-2xl mb-6">
                <BookOpen className="h-6 w-6 text-violet-400" />
              </div>
              <h4 className="text-2xl font-bold text-white mb-2">Wiki & FAQ Center</h4>
              <p className="text-sm text-zinc-400 leading-relaxed max-w-sm mb-6">
                Dive deep into documentation, regulatory compliance checklists, and technical blueprints describing how Sovranly IP works.
              </p>
            </div>
            <Button asChild variant="secondary" className="w-full bg-zinc-800 hover:bg-zinc-700 text-zinc-100 rounded-xl py-5">
              <Link href="/wiki">Browse Sovranly Wiki <ExternalLink className="ml-2 w-4 h-4"/></Link>
            </Button>
          </Card>
        </section>

        {/* Contact/Support Form Section */}
        <section className="relative bg-zinc-900/30 rounded-3xl p-8 md:p-12 border border-zinc-800/60 backdrop-blur-sm">
          <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-violet-500/5 rounded-full blur-[100px] pointer-events-none" />
          
          <div className="max-w-2xl mx-auto space-y-8">
            <div className="text-center space-y-3">
              <h3 className="text-3xl font-extrabold text-white tracking-tight flex justify-center items-center gap-3">
                <Mail className="text-cyan-400 w-8 h-8"/> Contact Developer Support
              </h3>
              <p className="text-zinc-400 max-w-md mx-auto">Ready to customize or have questions? Get in touch with our team directly.</p>
            </div>

            {!submitted ? (
              <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">Name</Label>
                    <Input className="bg-zinc-950/60 border-zinc-800 text-white rounded-xl py-5 px-4 focus-visible:ring-cyan-500" required placeholder="e.g., Jane Doe" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">Email Address</Label>
                    <Input type="email" className="bg-zinc-950/60 border-zinc-800 text-white rounded-xl py-5 px-4 focus-visible:ring-cyan-500" required placeholder="create@sovranlyip.com" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">Inquiry Details</Label>
                  <Textarea className="bg-zinc-950/60 border-zinc-800 text-white rounded-xl p-4 focus-visible:ring-cyan-500" rows={5} required placeholder="Describe what you want to achieve or any questions you have about the architecture..." />
                </div>
                <Button type="submit" className="w-full py-6 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold transition-all shadow-md shadow-cyan-950/20">
                  Send Support Message
                </Button>
              </form>
            ) : (
              <div className="text-center py-12 px-6 bg-zinc-950/80 rounded-2xl border border-emerald-500/20 shadow-xl">
                <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center text-xl mx-auto mb-4">✓</div>
                <p className="text-white text-lg font-bold mb-2">Message Dispatched Securely</p>
                <p className="text-zinc-400 text-sm">We have received your request and will follow up with you at <span className="font-semibold text-zinc-300">create@sovranlyip.com</span> shortly.</p>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 bg-zinc-950/40 relative z-10 text-center text-zinc-600 text-xs">
        <p>© 2026 Sovranly IP. Sovereign Management and Zero Trust Blockchain Protection. All work protected on-chain.</p>
      </footer>
    </div>
  );
}
