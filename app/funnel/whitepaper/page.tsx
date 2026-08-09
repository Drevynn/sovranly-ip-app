'use client';

export const dynamic = 'force-dynamic';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  FileText, 
  Download, 
  ArrowRight, 
  ShieldCheck, 
  Cpu, 
  Lock, 
  CheckCircle2,
  ChevronRight
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function WhitepaperFunnelPage() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setIsSubmitting(true);
    // Simulate API call for funnel lead capture
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      // In a real app, this would trigger a download or email delivery
      const link = document.createElement('a');
      link.href = '#'; // Would be actual PDF URL
      link.download = 'Sovranly-IP-Whitepaper-2026.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans selection:bg-cyan-900 relative overflow-hidden">
      {/* Background FX */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(6,182,212,0.15)_0%,transparent_70%)] pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none" />

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between p-6 max-w-7xl mx-auto border-b border-zinc-900/50">
        <Link href="/" className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-cyan-400" />
          Sovranly IP
        </Link>
        <Link href="/funnel" className="text-xs font-mono text-zinc-500 hover:text-cyan-400 transition-colors flex items-center gap-1">
          Return to Hub <ChevronRight className="w-3 h-3" />
        </Link>
      </nav>

      <main className="relative z-10 max-w-7xl mx-auto px-6 py-12 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Column: Copy & Form */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/40 border border-cyan-800/30 text-cyan-400 text-[10px] font-mono uppercase tracking-widest">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                Executive Whitepaper 2026
              </div>
              <h1 className="text-4xl lg:text-5xl font-black tracking-tight text-white leading-[1.1]">
                Revolutionizing Intellectual Property Through Blockchain.
              </h1>
              <p className="text-lg text-zinc-400 leading-relaxed max-w-lg">
                Discover how decentralized ledger technology and Zero Trust Architecture are solving the $340B IP licensing crisis. Secure your creative sovereignty today.
              </p>
            </div>

            {/* Feature Highlights */}
            <ul className="space-y-3 font-mono text-xs text-zinc-300">
              <li className="flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                Immutable ownership & smart contract royalties
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                Market opportunity in the $1-2T creator economy
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                Strategic milestones & technological architecture
              </li>
            </ul>

            {/* Lead Capture Form */}
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 backdrop-blur-sm max-w-md">
              {isSuccess ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center space-y-4 py-4"
                >
                  <div className="w-12 h-12 bg-emerald-950/50 border border-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold mb-1">Download Initiated!</h3>
                    <p className="text-xs text-zinc-400 font-mono">Your whitepaper is downloading. A copy has also been sent to {email}.</p>
                  </div>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="email" className="block text-[10px] font-mono text-zinc-500 uppercase tracking-wider mb-2 font-bold">
                      Enter Email to Access Executive Summary
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="executive@firm.com"
                      required
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all font-mono"
                    />
                  </div>
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl py-6 font-bold text-sm tracking-wide shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                        Processing...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        Download Whitepaper <Download className="w-4 h-4" />
                      </span>
                    )}
                  </Button>
                  <p className="text-[9px] text-zinc-600 text-center font-mono uppercase tracking-widest mt-4">
                    Zero Trust. Secure Transfer.
                  </p>
                </form>
              )}
            </div>
          </motion.div>

          {/* Right Column: 3D Cover Art */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative perspective-[1000px] flex items-center justify-center lg:justify-end"
          >
            {/* Ambient Glow */}
            <div className="absolute w-64 h-64 bg-cyan-500/20 rounded-full blur-[100px] pointer-events-none" />
            
            {/* Book/Document Cover */}
            <div className="relative w-[320px] h-[450px] sm:w-[400px] sm:h-[560px] [transform-style:preserve-3d] -rotate-y-12 rotate-x-6 hover:rotate-y-0 hover:rotate-x-0 transition-transform duration-700 ease-out group cursor-pointer shadow-2xl">
              
              {/* Spine */}
              <div className="absolute left-0 top-0 w-6 sm:w-8 h-full bg-zinc-950 border-l border-y border-zinc-800 origin-left -rotate-y-90 flex items-center justify-center overflow-hidden [transform:translateZ(-1px)]">
                <div className="text-zinc-600 font-mono text-[8px] uppercase tracking-widest -rotate-90 whitespace-nowrap">
                  Sovranly IP • Executive Summary • 2026
                </div>
              </div>

              {/* Pages edge */}
              <div className="absolute right-0 top-0 w-4 sm:w-6 h-full bg-zinc-200 origin-right rotate-y-90 translate-x-[1px]" />
              <div className="absolute left-0 bottom-0 w-full h-4 sm:h-6 bg-zinc-300 origin-bottom -rotate-x-90 translate-y-[1px]" />
              <div className="absolute left-0 top-0 w-full h-4 sm:h-6 bg-zinc-300 origin-top rotate-x-90 -translate-y-[1px]" />

              {/* Front Cover */}
              <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 to-zinc-950 border border-zinc-800 rounded-r-md overflow-hidden flex flex-col p-8 sm:p-10 shadow-[inset_4px_0_15px_rgba(0,0,0,0.5)] [transform:translateZ(1px)]">
                
                {/* Tech Pattern overlay */}
                <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9IiNmZmYiLz48L3N2Zz4=')] [mask-image:linear-gradient(to_bottom,white,transparent)]" />
                
                {/* Header */}
                <div className="relative z-10 flex justify-between items-start mb-auto">
                  <div className="w-10 h-10 bg-cyan-500/10 rounded-lg flex items-center justify-center border border-cyan-500/20">
                    <ShieldCheck className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div className="text-[8px] font-mono text-zinc-500 uppercase tracking-widest text-right">
                    Zero Trust Architecture <br/>
                    Confidential
                  </div>
                </div>

                {/* Title */}
                <div className="relative z-10 space-y-4 my-auto">
                  <div className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest font-bold">
                    Whitepaper / 01
                  </div>
                  <h2 className="text-3xl sm:text-4xl font-black text-white leading-[1.1] tracking-tight drop-shadow-xl">
                    Sovranly IP: <br />
                    <span className="text-zinc-400 font-medium text-xl sm:text-2xl tracking-normal mt-2 block drop-shadow-none">
                      Revolutionizing Intellectual Property Management through Blockchain Technology
                    </span>
                  </h2>
                </div>

                {/* Footer of cover */}
                <div className="relative z-10 mt-auto pt-8 border-t border-zinc-800 flex justify-between items-end">
                  <div>
                    <p className="text-[10px] text-cyan-500 font-mono uppercase tracking-wider mb-1 font-bold">Executive Summary</p>
                    <p className="text-[10px] uppercase font-mono text-zinc-400 tracking-widest">Market Opportunity & Architecture</p>
                  </div>
                  <div className="w-12 h-12 rounded-full border border-zinc-700 flex items-center justify-center bg-zinc-950/80 backdrop-blur-sm group-hover:scale-110 transition-transform shadow-xl">
                    <FileText className="w-5 h-5 text-cyan-500" />
                  </div>
                </div>

              </div>
            </div>
            
          </motion.div>
        </div>
      </main>
    </div>
  );
}
