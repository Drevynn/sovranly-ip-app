'use client';

import { Shield, Menu, ShieldCheck } from 'lucide-react';
import WalletConnect from './WalletConnect';
import Image from 'next/image';

export default function Header({ 
  pageTitle, 
  setWalletAddress, 
  walletAddress,
  onToggleSidebar
}: { 
  pageTitle: string, 
  setWalletAddress: (addr: string) => void, 
  walletAddress: string | null,
  onToggleSidebar: () => void
}) {
  return (
    <header className="h-20 border-b border-zinc-900 px-6 flex items-center justify-between bg-zinc-950/50 backdrop-blur-md relative z-30">
      {/* Left: Hamburger menu + Page Title */}
      <div className="flex items-center gap-4 z-40">
        <button 
          onClick={onToggleSidebar}
          className="p-2 -ml-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-900/50 transition-all focus:outline-none cursor-pointer"
          id="sidebar-toggle-btn"
          aria-label="Toggle Navigation"
        >
          <Menu className="w-5 h-5 text-cyan-400" />
        </button>
        <div className="hidden sm:block">
          <h1 className="text-xs font-mono font-medium text-zinc-400 tracking-wider lg:tracking-[0.15em] uppercase">{pageTitle}</h1>
        </div>
      </div>

      {/* Center: Centered Logo and Brand */}
      <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center gap-2.5 z-10 pointer-events-none">
        <div className="relative w-8 h-8 flex-shrink-0 flex items-center justify-center">
          <div className="absolute inset-x-0 inset-y-0 bg-cyan-400/20 rounded-full blur-md animate-pulse" />
          <ShieldCheck className="w-6 h-6 text-cyan-400 relative z-10 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]" />
        </div>
        <span className="font-bold tracking-widest text-white text-xs uppercase font-mono hidden md:inline-block">
          Sovranly IP
        </span>
      </div>

      {/* Right: Security Status + Wallet Connect */}
      <div className="flex items-center gap-4 z-40">
        <div className="px-4 py-2 bg-emerald-950/30 border border-emerald-500/15 text-emerald-400 text-[9px] uppercase tracking-widest rounded-full items-center gap-2 hidden lg:flex">
          <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
          {walletAddress ? 'Zero Trust Authed' : 'Network Live: Secure'}
        </div>
        <WalletConnect onConnect={setWalletAddress} />
      </div>
    </header>
  );
}
