'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ShieldCheck, ArrowLeft, ArrowRight, Sparkles, Youtube, Facebook, Instagram, Linkedin } from 'lucide-react';
import AboutUs from '@/components/AboutUs';
import NewsletterSignup from '@/components/NewsletterSignup';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-black text-zinc-100 font-sans selection:bg-cyan-500/20 selection:text-cyan-300">
      {/* Ambient background glows */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-[600px] h-[600px] bg-violet-500/5 rounded-full blur-[140px] pointer-events-none" />

      {/* Main Navigation Header */}
      <nav className="border-b border-zinc-900 bg-zinc-950/55 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-zinc-950 border border-cyan-500/30 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-950/20">
              <ShieldCheck className="w-4.5 h-4.5 text-cyan-400 drop-shadow-[0_0_6px_rgba(34,211,238,0.4)]" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold tracking-tight text-white leading-tight uppercase text-sm">SOVRANLY IP</span>
              <span className="text-[10px] uppercase font-mono text-cyan-400 tracking-wider">Corporate & Investor About</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button asChild variant="outline" className="border-zinc-855 text-zinc-300 hover:text-white hover:bg-zinc-900 rounded-full text-xs">
              <Link href="/" className="flex items-center gap-1.5">
                <ArrowLeft className="w-3.5 h-3.5" /> Return Home
              </Link>
            </Button>
            <Button asChild className="bg-gradient-to-r from-cyan-500 to-violet-500 hover:brightness-110 text-white rounded-full text-xs font-semibold px-4">
              <Link href="/dashboard" className="flex items-center gap-1.5">
                Go to Dashboard <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Main content wrapping the beautiful AboutUs.tsx component */}
      <main className="max-w-7xl mx-auto px-6 py-12 md:py-16 relative z-10">
        <AboutUs />
      </main>

      {/* Footer Element matching landing/home pages */}
      <footer className="border-t border-white/5 py-16 bg-zinc-950/40 relative z-10 flex flex-col items-center justify-center gap-8 text-center mt-12">
        {/* Newsletter Signup Form */}
        <div className="w-full max-w-7xl px-6">
          <NewsletterSignup />
        </div>

        <div className="flex flex-col items-center gap-4">
          <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest font-black">Follow our Founder</div>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link 
              href="https://www.tiktok.com/@sovranlyip?lang=en" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900 border border-zinc-850 hover:border-cyan-500/30 rounded-xl text-xs text-zinc-400 hover:text-white transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              TikTok
            </Link>
            <Link 
              href="https://www.linkedin.com/in/ip-sovereignty" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900 border border-zinc-850 hover:border-[#0077b5]/30 rounded-xl text-xs text-zinc-400 hover:text-white transition-all"
            >
              <Linkedin className="w-3.5 h-3.5 text-[#0077b5]" />
              LinkedIn
            </Link>
            <Link 
              href="https://www.youtube.com/@SOVRANLYIP" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900 border border-zinc-850 hover:border-[#ff0000]/30 rounded-xl text-xs text-zinc-400 hover:text-white transition-all"
            >
              <Youtube className="w-3.5 h-3.5 text-[#ff0000]" />
              YouTube
            </Link>
            <Link 
              href="https://www.facebook.com/Sovranlyip" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900 border border-zinc-850 hover:border-[#1877f2]/30 rounded-xl text-xs text-zinc-400 hover:text-white transition-all"
            >
              <Facebook className="w-3.5 h-3.5 text-[#1877f2]" />
              Facebook
            </Link>
            <Link 
              href="https://www.instagram.com/sovranlyip" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900 border border-zinc-850 hover:border-[#e1306c]/30 rounded-xl text-xs text-zinc-400 hover:text-white transition-all"
            >
              <Instagram className="w-3.5 h-3.5 text-[#e1306c]" />
              Instagram
            </Link>
          </div>
        </div>
        
        <div className="flex items-center gap-4 text-zinc-500 text-xs">
          <Link href="/about" className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors">About Us</Link>
          <span>•</span>
          <Link href="/terms" className="hover:text-cyan-400 transition-colors">Terms of Service</Link>
          <span>•</span>
          <Link href="/privacy" className="hover:text-cyan-400 transition-colors">Privacy Policy</Link>
        </div>
        <p className="text-zinc-600 text-xs">© 2026 Sovranly IP. Sovereign intellectual property systems. Zero Trust Secured.</p>
      </footer>
    </div>
  );
}
