'use client';

import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import Overview from '@/components/Overview';
import Profile from '@/components/Profile';
import AssetManager from '@/components/AssetManager';
import Analytics from '@/components/Analytics';
import { useAuth } from '@/components/auth/FirebaseProvider';
import { SignIn } from '@/components/auth/SignIn';
import Image from 'next/image';
import Link from 'next/link';

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const [activePage, setActivePage] = useState(0); // Default to Command Center
  const [currentAccount, setCurrentAccount] = useState<string | null>(null);

  const walletStatus = currentAccount 
    ? `${currentAccount.slice(0, 6)}...${currentAccount.slice(-4)}` 
    : 'Disconnected';

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center space-y-4">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-4 border-cyan-500/10 rounded-full" />
          <div className="absolute inset-0 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin" />
        </div>
        <p className="text-zinc-650 font-mono text-[9px] uppercase tracking-[0.25em] animate-pulse">Establishing Identity Link...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-black text-zinc-100 flex flex-col font-sans selection:bg-cyan-500/20 selection:text-cyan-300 relative overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-1/3 right-1/4 w-[600px] h-[600px] bg-violet-500/5 rounded-full blur-[140px] pointer-events-none" />

        {/* Minimal Header */}
        <header className="border-b border-white/5 py-6 bg-transparent relative z-10">
          <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Image src="/sovranly-logo-v2.png" alt="Sovranly IP Logo" width={32} height={32} className="rounded-xl" referrerPolicy="no-referrer" />
              <span className="font-bold tracking-tighter text-white uppercase text-lg">SOVRANLY IP</span>
            </div>
            <Link href="/" className="text-xs text-zinc-500 hover:text-white transition-colors uppercase tracking-wider font-extrabold flex items-center gap-2">
              ← Return Home
            </Link>
          </div>
        </header>

        {/* Secure Sign In Portal */}
        <div className="flex-1 flex items-center justify-center py-12 relative z-10">
          <SignIn />
        </div>

        {/* Footer */}
        <footer className="border-t border-white/5 py-8 text-center text-zinc-700 text-[9px] font-mono">
          SECURED GATEWAY • SESSION VALIDATION CONTINUOUS
        </footer>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#050505] text-[#e0e0e0] font-sans">
      <Sidebar 
        activePage={activePage} 
        setActivePage={setActivePage} 
        walletStatus={walletStatus} 
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          pageTitle={
            activePage === 0 ? "Command Center" :
            activePage === 1 ? "User Profile" :
            activePage === 2 ? "SECURE IP ASSET REGISTRY" : 
            "ADVANCED BLOCKCHAIN ANALYTICS"
          } 
          setWalletAddress={setCurrentAccount} 
          walletAddress={currentAccount} 
        />

        <main className="flex-1 overflow-auto p-8 bg-[#09090b]">
          {activePage === 0 && <Overview />}
          {activePage === 1 && <Profile />}
          {activePage === 2 && <AssetManager walletAddress={currentAccount} />}
          {activePage === 3 && <Analytics />}
        </main>
      </div>
    </div>
  );
}
