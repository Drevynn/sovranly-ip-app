'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
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
  Sparkles,
  Eye,
  Database,
  FileText,
  Presentation,
  CheckCircle2,
  Share2,
  ListOrdered,
  Layers
} from 'lucide-react';
import Link from 'next/link';
import SlideStack from '@/components/SlideStack';
import NewsletterSignup from '@/components/NewsletterSignup';
import AppOverviewShowcase from '@/components/AppOverviewShowcase';
import ThemeToggle from '@/components/ThemeToggle';
import { motion } from 'motion/react';


export default function HomePage() {
  const [submitted, setSubmitted] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
  }, []);

  const handleAnalyticsEvent = (eventName: string) => {
    try {
      console.log('[Analytics Event]', eventName);
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', eventName, { event_category: 'Landing Page' });
      }
    } catch (e) {
      // ignore
    }
  };

  const scrollToWorkflow = () => {
    handleAnalyticsEvent('landing_how_it_works_clicked');
    const el = document.getElementById('how-it-works');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToContact = () => {
    const el = document.getElementById('contact-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-black text-zinc-100 font-sans selection:bg-cyan-500/20 selection:text-cyan-300 relative overflow-x-hidden">
      {/* Atmospheric Ambient Canvas Gradients & Subtle Mesh */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[850px] bg-[radial-gradient(ellipse_75%_55%_at_50%_15%,rgba(6,182,212,0.12),rgba(139,92,246,0.06)_45%,transparent_80%)] pointer-events-none z-0" />
      <div className="absolute top-0 inset-x-0 h-[850px] bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_70%_55%_at_50%_25%,black_40%,transparent_85%)] pointer-events-none z-0" />
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-[600px] h-[600px] bg-violet-500/5 rounded-full blur-[160px] pointer-events-none" />

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
            <button onClick={scrollToWorkflow} className="text-sm text-zinc-400 hover:text-white transition-colors cursor-pointer">
              How it works
            </button>
            <Link href="/onboarding" className="text-sm text-zinc-400 hover:text-white transition-colors">For creators</Link>
            <Link href="/marketplace" className="text-sm text-zinc-400 hover:text-white transition-colors">Explore listings</Link>
            <Link href="/wiki" className="text-sm text-zinc-400 hover:text-white transition-colors">Wiki / Help</Link>
            <Link href="/faq" className="text-sm text-zinc-400 hover:text-white transition-colors">FAQ</Link>
          </nav>
          <div className="flex items-center gap-3 sm:gap-4">
            <ThemeToggle showLabel={false} />
            <Button asChild variant="outline" className="border-zinc-800 bg-transparent text-white hover:bg-zinc-900 transition-all rounded-full hidden sm:inline-flex">
              <Link href="/marketplace">Explore listings</Link>
            </Button>
            <Button asChild className="bg-gradient-to-r from-cyan-500 to-violet-500 hover:brightness-110 text-white font-medium shadow-lg shadow-cyan-950/40 rounded-full">
              <Link href="/dashboard">Sign in</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative max-w-7xl mx-auto px-6 py-20 md:py-32 space-y-36">
        <section className="relative text-center space-y-10 max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2.5 px-4 py-2 bg-zinc-950/60 backdrop-blur-md border border-zinc-800/80 rounded-full text-xs sm:text-sm text-zinc-400 mb-2 font-mono tracking-wider uppercase">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>CREATOR LICENSING PROTOCOL // v1.2 SECURE</span>
          </div>
          
          {/* Primary H1 Headline */}
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-white leading-tight drop-shadow-sm max-w-4xl mx-auto">
              Turn your creative work into a clear, shareable licensing offer.
            </h1>
          </div>
          
          <p className="text-lg sm:text-xl md:text-2xl text-zinc-400 max-w-3xl mx-auto leading-relaxed font-light">
            Register an asset, define the permissions you want to grant, and send one professional licensing link to the people who want to use your work. Sovranly gives independent creators a secure home for ownership records, licensing terms, and buyer requests.
          </p>

          {/* Microcopy */}
          <div className="space-y-1 text-xs sm:text-sm text-cyan-400/90 font-mono">
            <p>Built for independent producers, musicians, sound designers, and digital creators.</p>
            <p className="text-zinc-500">Start with one asset. Keep ownership. Set the terms.</p>
          </div>
          
          <div className="flex flex-col sm:flex-row flex-wrap justify-center items-center gap-4 pt-6">
            <Button 
              asChild 
              size="lg" 
              className="w-full sm:w-auto px-8 py-7 rounded-full bg-gradient-to-r from-cyan-500 to-violet-500 text-white font-bold text-base hover:brightness-110 shadow-xl shadow-cyan-950/60 transition duration-300"
              onClick={() => handleAnalyticsEvent('landing_primary_cta_clicked')}
            >
              <Link href="/onboarding">Create your first license listing <ArrowRight className="ml-2 h-5 w-5" /></Link>
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              onClick={scrollToWorkflow}
              className="w-full sm:w-auto px-8 py-7 rounded-full border-zinc-800 bg-zinc-950 text-white hover:bg-zinc-900 font-bold text-base transition duration-300 cursor-pointer"
            >
              See how licensing works
            </Button>
          </div>

          {/* Compact Trust / Status Row */}
          <div className="pt-4 flex flex-wrap justify-center items-center gap-3 sm:gap-6 text-xs font-mono text-zinc-400">
            <span className="px-3 py-1.5 rounded-lg bg-zinc-900/80 border border-zinc-800 flex items-center gap-2">
              <span className="text-cyan-400 font-bold">[SECURE]</span> Creator-controlled records
            </span>
            <span className="px-3 py-1.5 rounded-lg bg-zinc-900/80 border border-zinc-800 flex items-center gap-2">
              <span className="text-violet-400 font-bold">[CLEAR TERMS]</span> Buyer-facing permission summaries
            </span>
            <span className="px-3 py-1.5 rounded-lg bg-zinc-900/80 border border-zinc-800 flex items-center gap-2">
              <span className="text-emerald-400 font-bold">[SHAREABLE]</span> One link for every licensing conversation
            </span>
          </div>

          {/* Product Hunt Review Badge */}
          <div className="pt-4 flex justify-center items-center">
            <div className="p-1 rounded-2xl bg-zinc-900/80 border border-cyan-500/20 shadow-lg shadow-cyan-950/40 hover:border-cyan-500/40 transition-all duration-300 hover:scale-105">
              <a
                href="https://www.producthunt.com/products/sovranly-ip/reviews/new?utm_source=badge-product_review&utm_medium=badge&utm_source=badge-sovranly&#0045;ip"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block rounded-xl overflow-hidden"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://api.producthunt.com/widgets/embed-image/v1/product_review.svg?product_id=1282199&theme=dark"
                  alt="Sovranly IP - Zero Trust Sovereign IP Management System for Creators | Product Hunt"
                  style={{ width: '250px', height: '54px' }}
                  width="250"
                  height="54"
                  className="block rounded-xl"
                />
              </a>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS SECTION */}
        <section id="how-it-works" className="space-y-16 pt-12">
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 px-3 py-1 bg-cyan-950/50 border border-cyan-800/30 rounded-full">
              THE CREATOR WORKFLOW
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
              From asset to licensing conversation in three steps.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-zinc-900/40 border border-zinc-800 rounded-3xl p-8 space-y-4 relative group hover:border-cyan-500/50 transition-all">
              <div className="text-xs font-mono text-cyan-400 uppercase tracking-widest">Step 01</div>
              <h3 className="text-2xl font-bold text-white">Add your asset</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Create a record for a beat, track, sample pack, stems, or other creative work. Add the details a prospective licensee needs to understand what they are viewing.
              </p>
            </div>

            <div className="bg-zinc-900/40 border border-zinc-800 rounded-3xl p-8 space-y-4 relative group hover:border-violet-500/50 transition-all">
              <div className="text-xs font-mono text-violet-400 uppercase tracking-widest">Step 02</div>
              <h3 className="text-2xl font-bold text-white">Set clear permissions</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Start with structured licensing terms, including commercial use, attribution, derivative use, exclusivity, and pricing or inquiry options.
              </p>
            </div>

            <div className="bg-zinc-900/40 border border-zinc-800 rounded-3xl p-8 space-y-4 relative group hover:border-emerald-500/50 transition-all">
              <div className="text-xs font-mono text-emerald-400 uppercase tracking-widest">Step 03</div>
              <h3 className="text-2xl font-bold text-white">Share one licensing link</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Send a professional page to a prospect. They can preview the asset, understand the offered use, and submit a licensing request directly to you.
              </p>
            </div>
          </div>

          <div className="p-4 bg-zinc-950/80 border border-zinc-900 rounded-2xl max-w-3xl mx-auto text-center">
            <p className="text-xs text-zinc-500 leading-relaxed font-mono">
              Sovranly records creator-provided asset and permissions information. Creators remain responsible for confirming they own or control the rights they offer.
            </p>
          </div>
        </section>

        {/* PRIMARY PRODUCT BENEFITS SECTION */}
        <section className="space-y-12 pt-8">
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              Everything you need for a cleaner licensing conversation.
            </h2>
            <p className="text-zinc-400 text-base">Designed around the real workflows of independent music and digital creators.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-8 bg-zinc-900/40 border border-zinc-800/60 rounded-3xl space-y-4 hover:border-zinc-700 transition-all">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
                <FileText className="w-5 h-5 text-cyan-400" />
              </div>
              <h3 className="text-xl font-bold text-white">Publish with confidence</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Create a professional, shareable listing for an asset you own or control.
              </p>
            </div>

            <div className="p-8 bg-zinc-900/40 border border-zinc-800/60 rounded-3xl space-y-4 hover:border-zinc-700 transition-all">
              <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/30 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-violet-400" />
              </div>
              <h3 className="text-xl font-bold text-white">Make terms understandable</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Give prospective licensees a plain-language summary of permitted use before they contact you.
              </p>
            </div>

            <div className="p-8 bg-zinc-900/40 border border-zinc-800/60 rounded-3xl space-y-4 hover:border-zinc-700 transition-all">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
                <Database className="w-5 h-5 text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold text-white">Keep the record connected</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Maintain an organized record of the asset, its creator-supplied metadata, licensing options, and buyer inquiries.
              </p>
            </div>

            <div className="p-8 bg-zinc-900/40 border border-zinc-800/60 rounded-3xl space-y-4 hover:border-zinc-700 transition-all">
              <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center">
                <Lock className="w-5 h-5 text-sky-400" />
              </div>
              <h3 className="text-xl font-bold text-white">Protect access by design</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Use Sovranly’s zero-trust security model to control access and safeguard sensitive creative information.
              </p>
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

        {/* SECURITY / DIFFERENTIATION SECTION */}
        <section className="space-y-12 bg-zinc-900/20 border border-zinc-800/60 p-8 sm:p-12 rounded-3xl">
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              Creator-first licensing. Security built underneath.
            </h2>
            <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
              Licensing should feel simple to the people using it. Behind the scenes, Sovranly applies a security-first infrastructure designed to make ownership records, access, and permissions more resilient.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { 
                icon: ShieldCheck, 
                title: "Creator-controlled permission records", 
                desc: "You maintain authority over what terms are displayed and when access is updated." 
              },
              { 
                icon: Lock, 
                title: "Cryptographic asset fingerprinting", 
                desc: "Timestamped cryptographic records can help document an asset’s history." 
              },
              { 
                icon: Zap, 
                title: "Automated licensing infrastructure", 
                desc: "Smart-contract and automation capabilities are being developed to support structured licensing workflows." 
              },
              { 
                icon: Database, 
                title: "Secure asset and metadata storage", 
                desc: "Security features complement—not replace—legal advice, rights clearance, or creator due diligence." 
              },
            ].map((feature, i) => (
              <div key={i} className="p-6 bg-zinc-950/60 border border-zinc-800/80 rounded-2xl text-left space-y-3">
                <div className="inline-flex p-2.5 bg-zinc-900 border border-zinc-800 rounded-xl">
                  <feature.icon className="h-5 w-5 text-cyan-400" />
                </div>
                <h4 className="text-base font-bold text-white">{feature.title}</h4>
                <p className="text-zinc-400 text-xs leading-relaxed">{feature.desc}</p>
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
              <h4 className="text-2xl font-bold text-white mb-2">Wiki &amp; FAQ Center</h4>
              <p className="text-sm text-zinc-400 leading-relaxed max-w-sm mb-6">
                Dive deep into documentation, regulatory compliance checklists, and technical blueprints describing how Sovranly IP works.
              </p>
            </div>
            <Button asChild variant="secondary" className="w-full bg-zinc-800 hover:bg-zinc-700 text-zinc-100 rounded-xl py-5">
              <Link href="/wiki">Browse Sovranly Wiki <ExternalLink className="ml-2 w-4 h-4"/></Link>
            </Button>
          </Card>
        </section>

        {/* EARLY CREATOR ACCESS / DESIGN PARTNER SECTION */}
        <section className="relative bg-gradient-to-r from-cyan-950/30 via-zinc-900/40 to-violet-950/30 rounded-3xl p-8 md:p-14 border border-cyan-500/30 text-center space-y-6 shadow-2xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-500/40 text-cyan-400 text-xs font-mono uppercase tracking-widest">
            <span>EARLY CREATOR ACCESS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
            License one asset with Sovranly.
          </h2>
          <p className="text-zinc-300 max-w-2xl mx-auto text-base leading-relaxed">
            We’re onboarding a focused group of independent producers and creators who want a cleaner way to present assets and permissions to real prospects. Create one listing, share it, and help shape the workflow.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4">
            <Button 
              asChild 
              size="lg" 
              className="px-8 py-6 rounded-full bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-base shadow-lg transition-all"
              onClick={() => handleAnalyticsEvent('landing_early_access_clicked')}
            >
              <Link href="/onboarding">Create your first listing <ArrowRight className="ml-2 w-5 h-5" /></Link>
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              onClick={scrollToContact}
              className="px-8 py-6 rounded-full border-zinc-700 bg-transparent text-white hover:bg-zinc-900 font-bold text-base cursor-pointer"
            >
              Talk to the team
            </Button>
          </div>
        </section>

        {/* Contact/Support Form Section */}
        <section id="contact-section" className="relative bg-zinc-900/30 rounded-3xl p-8 md:p-12 border border-zinc-800/60 backdrop-blur-sm">
          <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-violet-500/5 rounded-full blur-[100px] pointer-events-none" />
          
          <div className="max-w-2xl mx-auto space-y-8">
            <div className="text-center space-y-3">
              <h3 className="text-3xl font-extrabold text-white tracking-tight flex justify-center items-center gap-3">
                <Mail className="text-cyan-400 w-8 h-8"/> Talk to Sovranly
              </h3>
              <p className="text-zinc-400 max-w-md mx-auto">Questions about launching your first listing, licensing workflow, or platform access? Connect with the Sovranly team.</p>
            </div>

            {!submitted ? (
              isMounted ? (
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
                    <Textarea className="bg-zinc-950/60 border-zinc-800 text-white rounded-xl p-4 focus-visible:ring-cyan-500" rows={5} required placeholder="Describe your creative work or any questions about launching your first licensing offer..." />
                  </div>
                  <Button type="submit" className="w-full py-6 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold transition-all shadow-md shadow-cyan-950/20">
                    Send Support Message
                  </Button>
                </form>
              ) : (
                <div className="h-[200px] flex items-center justify-center text-xs font-mono text-zinc-600">Loading secure transmission protocol...</div>
              )
            ) : (
              <div className="text-center py-12 px-6 bg-zinc-950/80 rounded-2xl border border-emerald-500/20 shadow-xl">
                <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center text-xl mx-auto mb-4">✓</div>
                <p className="text-white text-lg font-bold mb-2">Message Dispatched Securely</p>
                <p className="text-zinc-400 text-sm">We have received your request and will follow up with you shortly. <span className="font-semibold text-zinc-300">create@sovranlyip.com</span></p>
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
        
        <div className="flex flex-wrap items-center justify-center gap-4 text-zinc-500 text-xs px-4">
          <Link href="/about" className="hover:text-cyan-400 transition-colors">About Us</Link>
          <span>•</span>
          <Link href="/terms" className="hover:text-cyan-400 transition-colors">Terms of Service</Link>
          <span>•</span>
          <Link href="/privacy" className="hover:text-cyan-400 transition-colors">Privacy Policy</Link>
        </div>
        <p className="text-zinc-600 text-xs">© 2026 Creative Sovereignty LLC. Sovereign Management and Zero Trust Blockchain Protection. All work protected on-chain.</p>
      </footer>
    </div>
  );
}

