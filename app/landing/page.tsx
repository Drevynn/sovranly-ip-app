'use client';
import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ExternalLink, Mail, ShieldCheck } from 'lucide-react';
import { SovranlyLogo } from '@/components/SovranlyLogo';
import Link from 'next/link';
import SlideStack from '@/components/SlideStack';
import { motion } from 'motion/react';
import { PublicNavbarHamburger } from '@/components/PublicNavbarHamburger';

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
        <div className="flex items-center gap-3">
          <Link href="/faq" className="text-zinc-400 hover:text-white transition-colors text-sm hidden sm:inline">FAQ</Link>
          <Link href="/wiki" className="text-zinc-400 hover:text-white transition-colors text-sm hidden sm:inline">Wiki</Link>
          <Button asChild variant="outline" className="border-zinc-700 bg-transparent text-white hover:bg-zinc-800 text-xs">
            <Link href="/">Launch App</Link>
          </Button>
          <PublicNavbarHamburger />
        </div>
      </header>

      <main className="max-w-4xl mx-auto space-y-16">
        <section className="text-center space-y-6">
          {/* Futuristic CSS-based Emblem/Shield with smooth infinite looping motion */}
          <div className="relative group w-80 h-80 md:w-96 md:h-96 mx-auto mb-6 flex items-center justify-center select-none">
            {/* Ambient glows */}
            <motion.div 
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.15, 0.28, 0.15],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="absolute inset-0 bg-cyan-500 rounded-full blur-[90px] pointer-events-none z-0" 
            />
            <motion.div 
              animate={{
                scale: [1.05, 0.95, 1.05],
                opacity: [0.1, 0.22, 0.1],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="absolute inset-4 bg-violet-600 rounded-full blur-[75px] pointer-events-none z-0" 
            />
            
            {/* Outer cybernetic ring */}
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-0 rounded-full border border-cyan-500/25 pointer-events-none flex items-center justify-center z-0"
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-cyan-400 rounded-full shadow-[0_0_12px_#22d3ee]" />
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-violet-500 rounded-full shadow-[0_0_12px_#a78bfa]" />
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-cyan-300 rounded-full shadow-[0_0_8px_#67e8f9]" />
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-violet-400 rounded-full shadow-[0_0_8px_#c084fc]" />
            </motion.div>

            {/* Concentric subtle radar pulse ring */}
            <motion.div
              animate={{
                scale: [0.88, 1.02, 0.88],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 3.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="absolute inset-6 rounded-full border border-cyan-500/15 pointer-events-none z-0"
            />
            
            {/* Core Shield Emblem with perpetual float & glow loop */}
            <motion.div 
              animate={{
                y: [-5, 6, -5],
              }}
              transition={{
                duration: 4.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="relative z-10 w-48 h-48 md:w-56 md:h-56 flex items-center justify-center transform transition-transform duration-500 hover:scale-105"
            >
              <SovranlyLogo size="hero" glow={false} />
            </motion.div>
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
