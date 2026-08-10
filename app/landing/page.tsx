'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ExternalLink, Mail, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import SlideStack from '@/components/SlideStack';

export default function LandingPage() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="min-h-screen bg-black text-zinc-100 p-8">
      <header className="flex justify-between items-center mb-16">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-zinc-950 border border-cyan-500/30 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-950/20">
            <ShieldCheck className="w-5 h-5 text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.4)]" />
          </div>
          <span className="font-bold tracking-tighter text-white text-xl uppercase">SOVRANLY IP</span>
        </div>
        <div className="space-x-4">
          <Link href="/faq" className="text-zinc-400 hover:text-white transition-colors">FAQ</Link>
          <Link href="/wiki" className="text-zinc-400 hover:text-white transition-colors">Wiki</Link>
          <Button asChild variant="outline" className="border-zinc-700 bg-transparent text-white hover:bg-zinc-800">
            <Link href="/">Launch App</Link>
          </Button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto space-y-16">
        <section className="text-center space-y-6">
          {/* Futuristic CSS-based Emblem/Shield (Zero-Trust Replacement for Hero Image) */}
          <div className="relative w-72 h-72 md:w-80 md:h-80 mx-auto mb-6 flex items-center justify-center select-none">
            {/* Ambient glows */}
            <div className="absolute inset-0 bg-cyan-500/10 rounded-full blur-[100px] animate-pulse [animation-duration:4s] pointer-events-none" />
            <div className="absolute inset-4 bg-violet-500/5 rounded-full blur-[80px] animate-pulse [animation-duration:6s] pointer-events-none" />
            
            {/* Outer cybernetic ring */}
            <div className="absolute inset-0 rounded-full border border-cyan-500/25 bg-black/40 backdrop-blur-md flex items-center justify-center animate-spin-slow [animation-duration:25s]">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-cyan-400 rounded-full shadow-[0_0_10px_#22d3ee]" />
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-violet-500 rounded-full shadow-[0_0_10px_#a78bfa]" />
            </div>
            
            {/* Core Shield Emblem */}
            <div className="relative w-36 h-36 md:w-44 md:h-44 rounded-3xl bg-zinc-950/90 border-2 border-cyan-500/40 flex flex-col items-center justify-center shadow-[0_0_50px_rgba(6,182,212,0.15)] overflow-hidden group p-3">
              {/* Circuit board line accents */}
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />
              <div className="absolute inset-y-0 left-0 w-px bg-gradient-to-b from-transparent via-cyan-400 to-transparent" />
              
              {/* Core Sovranly Logo Image */}
              <div className="relative z-10 w-full h-full flex items-center justify-center p-2">
                <Image
                  src="/sovranly_hero_emblem.jpg"
                  alt="Sovranly IP Emblem"
                  width={140}
                  height={140}
                  className="w-full h-full object-cover rounded-2xl drop-shadow-[0_0_15px_rgba(34,211,238,0.5)] transform group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                  priority
                />
              </div>
            </div>
          </div>
          <h2 className="text-5xl font-extrabold tracking-tighter text-white">Sovereign Asset Management</h2>
          <p className="text-xl text-zinc-400">Secure, blockchain-based IP management for visionary creators.</p>
        </section>

        <section className="py-12">
          <div className="text-center mb-10">
            <h3 className="text-sm font-mono text-cyan-500 uppercase tracking-widest mb-2">Platform Capabilities</h3>
            <p className="text-zinc-500 text-sm">Click to cycle through features</p>
          </div>
          <SlideStack />
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="bg-zinc-900 border border-zinc-800">
            <CardHeader><CardTitle className="text-white">Need Help?</CardTitle></CardHeader>
            <CardContent className="space-y-4"> 
              <p className="text-zinc-400">Explore our knowledge base to learn more about our platform.</p>
              <Button asChild variant="secondary" className="w-full">
                <a href="/wiki" target="_blank" rel="noopener noreferrer">Visit Help Wiki <ExternalLink className="ml-2 w-4 h-4"/></a>
              </Button>
            </CardContent>
          </Card>
          
          <Card className="bg-zinc-900 border border-zinc-800">
            <CardHeader><CardTitle className="text-white">Community</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <p className="text-zinc-400">Check out our frequently asked questions.</p>
              <Button asChild variant="secondary" className="w-full">
                <a href="/faq" target="_blank" rel="noopener noreferrer">Read FAQ <ExternalLink className="ml-2 w-4 h-4"/></a>
              </Button>
            </CardContent>
          </Card>
        </section>

        <section className="bg-zinc-900 rounded-xl p-8 border border-zinc-800">
          <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2"><Mail className="text-cyan-500"/> Contact Support</h3>
          {!submitted ? (
            <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-zinc-400">Name</Label>
                  <Input className="bg-zinc-950 border-zinc-700 text-white" required />
                </div>
                <div className="space-y-2">
                  <Label className="text-zinc-400">Email</Label>
                  <Input type="email" className="bg-zinc-950 border-zinc-700 text-white" required />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-zinc-400">Message</Label>
                <Textarea className="bg-zinc-950 border-zinc-700 text-white" rows={4} required />
              </div>
              <Button type="submit" className="bg-cyan-600 hover:bg-cyan-700 text-white">Send Message</Button>
            </form>
          ) : (
            <div className="text-center p-8 bg-zinc-950 rounded-lg">
              <p className="text-white text-lg font-semibold">Thank you for contacting us.</p>
              <p className="text-zinc-400">We will get back to you shortly at contact@sovranlyip.com</p>
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-24 border-t border-zinc-900 py-16 text-center space-y-6">
        <div className="flex flex-col items-center gap-4">
          <Link 
            href="https://www.tiktok.com/@sovranlyip?lang=en" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-6 py-3 bg-zinc-900 border border-zinc-800 rounded-full text-sm text-zinc-400 hover:text-white hover:border-zinc-700 transition-all shadow-lg"
          >
            <ExternalLink className="w-4 h-4 text-cyan-500" />
            Watch our Founder on TikTok
          </Link>
        </div>
        <div className="flex justify-center items-center gap-4 text-zinc-500 text-xs">
          <Link href="/terms" className="hover:text-cyan-400 transition-colors">Terms of Service</Link>
          <span>•</span>
          <Link href="/privacy" className="hover:text-cyan-400 transition-colors">Privacy Policy</Link>
        </div>
        <p className="text-zinc-600 text-xs">© 2026 Sovranly IP. All sovereign rights reserved.</p>
      </footer>
    </div>
  );
}
