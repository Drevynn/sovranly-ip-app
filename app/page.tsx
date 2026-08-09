'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
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
  Sparkles,
  Eye,
  Database,
  FileText,
  Presentation,
  CheckCircle2,
  Music
} from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/components/LanguageProvider';
import LanguageSelector from '@/components/LanguageSelector';
import SlideStack from '@/components/SlideStack';
import NewsletterSignup from '@/components/NewsletterSignup';
import AppOverviewShowcase from '@/components/AppOverviewShowcase';

export default function HomePage() {
  const [submitted, setSubmitted] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div className="min-h-screen bg-black text-zinc-100 font-sans selection:bg-cyan-500/20 selection:text-cyan-300">
      {/* Glow Effects */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-[600px] h-[600px] bg-violet-500/5 rounded-full blur-[140px] pointer-events-none" />

      {/* Navigation Header */}
      <header className="relative border-b border-white/10 bg-black/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center justify-between p-6 max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-zinc-950 border border-cyan-500/30 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-950/20">
              <ShieldCheck className="w-5 h-5 text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.4)]" />
            </div>
            <Link href="/" className="font-bold tracking-tighter text-white text-xl uppercase">Sovranly IP</Link>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="#app-purpose" className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors font-semibold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" /> App Purpose &amp; OAuth
            </Link>
            <Link href="#app-overview" className="text-sm text-zinc-300 hover:text-white transition-colors font-semibold flex items-center gap-1.5">
              <Eye className="w-4 h-4" /> App Overview
            </Link>
            <Link href="/dashboard" className="text-sm text-zinc-400 hover:text-white transition-colors">{t('commandCenter')}</Link>
            <Link href="/pricing" className="text-sm text-zinc-400 hover:text-white transition-colors">Pricing Plan</Link>
            <Link href="/marketplace" className="text-sm text-zinc-400 hover:text-white transition-colors">{t('marketplace')}</Link>
            <Link href="/onboarding" className="text-sm text-zinc-400 hover:text-white transition-colors">{t('chatHelp')}</Link>
            <Link href="/wiki" className="text-sm text-zinc-400 hover:text-white transition-colors">{t('wiki')}</Link>
            <Link href="/faq" className="text-sm text-zinc-400 hover:text-white transition-colors">{t('faq')}</Link>
          </nav>
          <div className="flex items-center gap-4">
            <Button asChild variant="outline" className="border-zinc-800 bg-transparent text-white hover:bg-zinc-900 transition-all rounded-full hidden sm:inline-flex">
              <Link href="/marketplace">{t('marketplace')}</Link>
            </Button>
            <Button asChild className="bg-gradient-to-r from-cyan-500 to-violet-500 hover:brightness-110 text-white font-medium shadow-lg shadow-cyan-950/40 rounded-full">
              <Link href="/dashboard">{t('launchConsole')}</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative max-w-7xl mx-auto px-6 py-12 md:py-20 space-y-32">
        <section className="text-center space-y-8 max-w-5xl mx-auto">
          {/* Sovereign IP Crowned Cyber Shield Emblem Hero Display */}
          <div className="relative w-72 h-72 sm:w-96 sm:h-96 md:w-[420px] md:h-[420px] mx-auto mb-8 flex items-center justify-center select-none">
            {/* Ambient glows */}
            <div className="absolute inset-0 bg-cyan-500/30 rounded-full blur-[100px] animate-pulse [animation-duration:4s] pointer-events-none" />
            <div className="absolute inset-6 bg-violet-500/25 rounded-full blur-[80px] animate-pulse [animation-duration:6s] pointer-events-none" />
            
            {/* Outer cybernetic ring */}
            <div className="absolute inset-0 rounded-full border border-cyan-500/40 bg-black/40 backdrop-blur-md flex items-center justify-center animate-spin-slow">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3.5 h-3.5 bg-cyan-400 rounded-full shadow-[0_0_15px_#22d3ee]" />
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3.5 h-3.5 bg-violet-500 rounded-full shadow-[0_0_15px_#a78bfa]" />
            </div>
            
            {/* Inner cybernetic ring */}
            <div className="absolute inset-8 rounded-full border border-dashed border-violet-500/50 flex items-center justify-center animate-spin-reverse">
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-emerald-400 rounded-full shadow-[0_0_12px_#34d399]" />
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-sky-400 rounded-full shadow-[0_0_12px_#38bdf8]" />
            </div>
            
            {/* Crowned Shield Emblem Image */}
            <div className="relative w-56 h-56 sm:w-72 sm:h-72 md:w-80 md:h-80 rounded-full bg-black border-2 border-cyan-500/50 flex items-center justify-center shadow-[0_0_70px_rgba(6,182,212,0.45)] overflow-hidden group transition-all duration-500 hover:border-cyan-400 hover:shadow-[0_0_90px_rgba(6,182,212,0.65)] hover:scale-105">
              <Image 
                src="/sovranly_hero_emblem.jpg" 
                alt="Sovranly IP - Sovereign Crowned Cyber Shield Emblem" 
                fill
                priority
                className="object-cover transform group-hover:scale-105 transition-transform duration-700" 
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
          
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-900/90 border border-cyan-500/30 rounded-full text-xs text-zinc-300 shadow-md shadow-cyan-950/30">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span className="font-mono tracking-wider uppercase text-[10px] sm:text-xs text-cyan-300 font-medium">{t('zeroTrustTag')}</span>
          </div>
          
          {/* Primary H1 Application Title Matching OAuth Consent Screen */}
          <div className="space-y-3">
            <h1 className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tight text-white leading-none drop-shadow-md">
              Sovranly IP
            </h1>
            <p className="text-xl sm:text-3xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-cyan-400 via-sky-300 to-violet-400 bg-clip-text text-transparent">
              {t('heroMainTitleSub')}
            </p>
          </div>
          
          <p className="text-base sm:text-xl md:text-2xl text-zinc-300 max-w-4xl mx-auto leading-relaxed font-light">
            {t('heroDescription')}
          </p>

          <p className="text-sm sm:text-base text-zinc-400 max-w-3xl mx-auto leading-relaxed font-normal">
            Register intellectual property assets with cryptographic SHA-256 proof of ownership, configure automated commercial licensing compacts, distribute peer-to-peer royalties, and export verified ownership certificates directly into <strong className="text-white font-semibold">Google Workspace Slides presentations</strong>.
          </p>
          
          <div className="flex flex-col sm:flex-row flex-wrap justify-center items-center gap-3.5 pt-4">
            <Button asChild size="lg" className="w-full sm:w-auto px-8 py-6 rounded-full bg-gradient-to-r from-cyan-500 to-violet-600 text-white font-bold text-base hover:brightness-110 shadow-xl shadow-cyan-950/50 transition duration-300">
              <Link href="/dashboard">{t('deployIpBtn')} <ArrowRight className="ml-2 h-5 w-5" /></Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="w-full sm:w-auto px-8 py-6 rounded-full border-cyan-500/40 bg-zinc-950/80 text-cyan-300 hover:bg-cyan-950/40 font-bold text-base transition duration-300 shadow-md">
              <Link href="/marketplace" className="flex items-center gap-2">
                <span>{t('exploreMarketplaceBtn')}</span>
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="w-full sm:w-auto px-8 py-6 rounded-full border-zinc-800 bg-zinc-950/80 text-zinc-300 hover:bg-zinc-900 font-medium text-base transition duration-300">
              <Link href="#app-purpose" className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                <span>Capabilities</span>
              </Link>
            </Button>
          </div>
        </section>

        {/* Dedicated Application Purpose Section */}
        <section id="app-purpose" className="relative max-w-7xl mx-auto px-4 sm:px-6">
          <div className="bg-gradient-to-b from-zinc-900/90 to-zinc-950/90 border border-zinc-800 rounded-3xl p-6 sm:p-10 md:p-12 shadow-2xl backdrop-blur-md space-y-10">
            {/* Header / Title */}
            <div className="space-y-4 border-b border-zinc-800/80 pb-8 text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/50 border border-cyan-500/40 text-cyan-400 text-xs font-mono uppercase tracking-widest">
                <ShieldCheck className="w-4 h-4" />
                <span>Sovereign Rights &amp; Platform Architecture</span>
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white">
                The Sovereign Authority for <span className="text-cyan-400">Creator Intellectual Property</span>
              </h2>
              <p className="text-base sm:text-lg text-zinc-300 leading-relaxed max-w-4xl font-light">
                <strong className="text-white font-semibold">Sovranly IP</strong> is a decentralized, Zero Trust intellectual property management and licensing platform built for creators, musicians, software developers, visual artists, and legal rights holders. Our application provides tools to register creative assets, generate cryptographic proof of ownership, configure automated commercial licensing compacts, and distribute peer-to-peer royalties transparently.
              </p>
            </div>

            {/* 4 Core Purpose Pillars */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
              <div className="p-6 bg-zinc-950/60 border border-zinc-800 rounded-2xl space-y-3 hover:border-cyan-500/40 transition-all">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
                  <Database className="w-5 h-5 text-cyan-400" />
                </div>
                <h3 className="text-lg font-bold text-white">01. Intellectual Property Protection</h3>
                <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                  Creators upload their digital works (audio stems, codebases, artwork) to generate SHA-256 cryptographic fingerprints and decentralized IPFS certificates, establishing indisputable proof of authorship and ownership.
                </p>
              </div>

              <div className="p-6 bg-zinc-950/60 border border-zinc-800 rounded-2xl space-y-3 hover:border-violet-500/40 transition-all">
                <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/30 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-violet-400" />
                </div>
                <h3 className="text-lg font-bold text-white">02. Smart Licensing &amp; AI Defense</h3>
                <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                  Design commercial sync agreements, set explicit AI model training consent or opt-out rules, and automate multi-party royalty distributions without traditional intermediaries or accounting delays.
                </p>
              </div>

              <div className="p-6 bg-zinc-950/60 border border-zinc-800 rounded-2xl space-y-3 hover:border-emerald-500/40 transition-all">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
                  <Presentation className="w-5 h-5 text-emerald-400" />
                </div>
                <h3 className="text-lg font-bold text-white">03. Google Workspace Slides Integration</h3>
                <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                  Sovranly IP integrates with Google Workspace (<code className="text-emerald-300">auth/presentations</code>, <code className="text-emerald-300">auth/spreadsheets</code>, <code className="text-emerald-300">auth/drive.file</code>) to enable creators and legal teams to export verified IP ownership certificates, licensing compacts, and royalty reports directly into <strong className="text-white">Google Slides presentations</strong> for client proposals and pitch decks.
                </p>
              </div>

              <div className="p-6 bg-zinc-950/60 border border-zinc-800 rounded-2xl space-y-3 hover:border-cyan-400/40 transition-all">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
                  <Music className="w-5 h-5 text-cyan-400" />
                </div>
                <h3 className="text-lg font-bold text-white">04. Instant Sync Licensing Storefront</h3>
                <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                  Video game developers, filmmakers, and creators can search the music &amp; media catalog, filter by mood/genre/tier, and purchase instant sync rights with automated on-chain royalty splits among co-writers and producers.
                </p>
              </div>
            </div>

            {/* Zero Trust Security & Data Privacy Transparency Note */}
            <div className="p-6 bg-black/60 border border-zinc-800/80 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-left">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-mono text-emerald-400 font-bold uppercase">Zero Trust Data Privacy &amp; Workspace Integration</span>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Sovranly IP only accesses Google Workspace presentation scopes when explicitly authorized by the user. We never read emails, personal files, or unrelated drive contents. All data remains cryptographically protected under our Zero Trust Architecture.
                </p>
              </div>
              <Button asChild size="sm" variant="outline" className="border-zinc-700 bg-zinc-900 text-white hover:bg-zinc-800 font-mono text-xs shrink-0">
                <Link href="/wiki">View Security Specs</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Public App Overview & Interactive Inspection Section (No Login Required) */}
        <AppOverviewShowcase />

        {/* Animated Slide Stack Features */}
        <section className="py-16 flex flex-col items-center">
          <div className="text-center mb-8">
            <h3 className="text-sm font-mono text-cyan-500 uppercase tracking-widest mb-2">Platform Capabilities</h3>
            <p className="text-zinc-500 text-sm">Click the stack to cycle through features</p>
          </div>
          <SlideStack />
        </section>

        {/* Feature Highlights Grid */}
        <section className="space-y-12">
          <div className="text-center space-y-4">
            <h3 className="text-3xl font-extrabold tracking-tight text-white">{t('trustNoone')}</h3>
            <p className="text-zinc-400 max-w-lg mx-auto">{t('featureSubtitle')}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                icon: ShieldCheck, 
                title: t('feat1Title'), 
                desc: t('feat1Desc') 
              },
              { 
                icon: Zap, 
                title: t('feat2Title'), 
                desc: t('feat2Desc') 
              },
              { 
                icon: Lock, 
                 title: t('feat3Title'), 
                desc: t('feat3Desc') 
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
              <h4 className="text-2xl font-bold text-white mb-2">{t('aiHubTitle')}</h4>
              <p className="text-sm text-zinc-400 leading-relaxed max-w-sm mb-6">
                {t('aiHubDesc')}
              </p>
            </div>
            <Button asChild variant="secondary" className="w-full bg-zinc-800 hover:bg-zinc-700 text-zinc-100 rounded-xl py-5">
              <Link href="/onboarding">{t('aiHubBtn')} <ExternalLink className="ml-2 w-4 h-4"/></Link>
            </Button>
          </Card>
          
          <Card className="bg-zinc-900/30 border border-zinc-800/60 backdrop-blur-sm rounded-3xl p-8 flex flex-col justify-between">
            <div>
              <div className="inline-flex p-3 bg-violet-950/30 border border-violet-800/30 rounded-2xl mb-6">
                <BookOpen className="h-6 w-6 text-violet-400" />
              </div>
              <h4 className="text-2xl font-bold text-white mb-2">{t('wikiHubTitle')}</h4>
              <p className="text-sm text-zinc-400 leading-relaxed max-w-sm mb-6">
                {t('wikiHubDesc')}
              </p>
            </div>
            <Button asChild variant="secondary" className="w-full bg-zinc-800 hover:bg-zinc-700 text-zinc-100 rounded-xl py-5">
              <Link href="/wiki">{t('wikiHubBtn')} <ExternalLink className="ml-2 w-4 h-4"/></Link>
            </Button>
          </Card>
        </section>

        {/* Contact/Support Form Section */}
        <section className="relative bg-zinc-900/30 rounded-3xl p-8 md:p-12 border border-zinc-800/60 backdrop-blur-sm">
          <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-violet-500/5 rounded-full blur-[100px] pointer-events-none" />
          
          <div className="max-w-2xl mx-auto space-y-8">
            <div className="text-center space-y-3">
              <h3 className="text-3xl font-extrabold text-white tracking-tight flex justify-center items-center gap-3">
                <Mail className="text-cyan-400 w-8 h-8"/> {t('contactSupportTitle')}
              </h3>
              <p className="text-zinc-400 max-w-md mx-auto">{t('contactSupportDesc')}</p>
            </div>

            {!submitted ? (
              isMounted ? (
                <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">{t('formName')}</Label>
                      <Input className="bg-zinc-950/60 border-zinc-800 text-white rounded-xl py-5 px-4 focus-visible:ring-cyan-500" required placeholder={t('formNamePlaceholder')} />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">{t('formEmail')}</Label>
                      <Input type="email" className="bg-zinc-950/60 border-zinc-800 text-white rounded-xl py-5 px-4 focus-visible:ring-cyan-500" required placeholder={t('formEmailPlaceholder')} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">{t('formDetails')}</Label>
                    <Textarea className="bg-zinc-950/60 border-zinc-800 text-white rounded-xl p-4 focus-visible:ring-cyan-500" rows={5} required placeholder={t('formDetailsPlaceholder')} />
                  </div>
                  <Button type="submit" className="w-full py-6 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold transition-all shadow-md shadow-cyan-950/20">
                    {t('submitBtn')}
                  </Button>
                </form>
              ) : (
                <div className="h-[200px] flex items-center justify-center text-xs font-mono text-zinc-600">Loading secure transmission protocol...</div>
              )
            ) : (
              <div className="text-center py-12 px-6 bg-zinc-950/80 rounded-2xl border border-emerald-500/20 shadow-xl">
                <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center text-xl mx-auto mb-4">✓</div>
                <p className="text-white text-lg font-bold mb-2">{t('dispatchedTitle')}</p>
                <p className="text-zinc-400 text-sm">{t('dispatchedDesc')} <span className="font-semibold text-zinc-300">create@sovranlyip.com</span></p>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-16 bg-zinc-950/40 relative z-10 flex flex-col items-center justify-center gap-8 text-center">
        {/* Newsletter Signup Form */}
        <div className="w-full max-w-7xl px-6">
          <NewsletterSignup />
        </div>

        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-6">
            <Link 
              href="https://www.tiktok.com/@sovranlyip?lang=en" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-full text-xs text-zinc-400 hover:text-white hover:border-zinc-700 transition-all"
            >
              <Sparkles className="w-4 h-4 text-cyan-400" />
              Follow our Founder on TikTok
            </Link>
          </div>
        </div>
        
        <LanguageSelector />
        <div className="flex items-center gap-4 text-zinc-500 text-xs">
          <Link href="/about" className="hover:text-cyan-400 transition-colors">About Us</Link>
          <span>•</span>
          <Link href="/terms" className="hover:text-cyan-400 transition-colors">Terms of Service</Link>
          <span>•</span>
          <Link href="/privacy" className="hover:text-cyan-400 transition-colors">Privacy Policy</Link>
        </div>
        <p className="text-zinc-600 text-xs">{t('copyright')}</p>
      </footer>
    </div>
  );
}
