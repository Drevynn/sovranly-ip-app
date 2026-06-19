'use client';

import { Shield } from 'lucide-react';
import WalletConnect from './WalletConnect';
import LanguageSelector from './LanguageSelector';

export default function Header({ pageTitle, setWalletAddress, walletAddress }: { pageTitle: string, setWalletAddress: (addr: string) => void, walletAddress: string | null }) {
  return (
    <header className="h-20 border-b border-zinc-900 px-8 flex items-center justify-between bg-zinc-950/50 backdrop-blur-md">
      <div>
        <h1 className="text-sm font-bold text-white tracking-widest uppercase">{pageTitle}</h1>
      </div>
      <div className="flex items-center gap-4">
        <LanguageSelector />
        <div className="px-5 py-2.5 bg-emerald-950/30 border border-emerald-500/20 text-emerald-400 text-[10px] uppercase tracking-widest rounded-full flex items-center gap-2 hidden sm:flex">
          <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
          {walletAddress ? 'Zero Trust Authenticated' : 'Network Live: Secure'}
        </div>
        <WalletConnect onConnect={setWalletAddress} />
      </div>
    </header>
  );
}
