'use client';

import { Gauge, BarChart3, Wallet, User, FileText } from 'lucide-react';
import Image from 'next/image';

export default function Sidebar({ activePage, setActivePage, walletStatus }: { activePage: number, setActivePage: (id: number) => void, walletStatus: string }) {
  return (
    <div className="w-72 bg-zinc-950 border-r border-zinc-900 flex flex-col h-screen">
      <div className="p-8 border-b border-zinc-900">
        <div className="flex items-center gap-3 mb-2">
          <Image src="/sovranly-logo.png" alt="Sovranly" width={40} height={40} referrerPolicy="no-referrer" />
          <span className="font-bold tracking-tighter text-white text-2xl uppercase">SOVRANLY</span>
        </div>
        <p className="text-emerald-400 text-[10px] uppercase tracking-widest mt-1">Sovereign IP Authority</p>
      </div>

      <div className="flex-1 px-5 py-8 space-y-2">
        <button 
          onClick={() => setActivePage(0)}
          className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-sm font-semibold transition-all ${activePage === 0 ? 'bg-zinc-900 border border-zinc-800 text-white shadow-xl shadow-zinc-950/50' : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/30'}`}
        >
          <Gauge className="w-5 h-5 text-cyan-400" /> Command Center
        </button>
        <button 
          onClick={() => setActivePage(1)}
          className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-sm font-semibold transition-all ${activePage === 1 ? 'bg-zinc-900 border border-zinc-800 text-white shadow-xl shadow-zinc-950/50' : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/30'}`}
        >
          <User className="w-5 h-5 text-violet-400" /> User Profile
        </button>
        <button 
          onClick={() => setActivePage(2)}
          className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-sm font-semibold transition-all ${activePage === 2 ? 'bg-zinc-900 border border-zinc-800 text-white shadow-xl shadow-zinc-950/50' : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/30'}`}
        >
          <FileText className="w-5 h-5 text-emerald-400" /> IP Asset Registry
        </button>
        <button 
          onClick={() => setActivePage(3)}
          className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-sm font-semibold transition-all ${activePage === 3 ? 'bg-zinc-900 border border-zinc-800 text-white shadow-xl shadow-zinc-950/50' : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/30'}`}
        >
          <BarChart3 className="w-5 h-5 text-amber-400" /> Analytics
        </button>
      </div>

      <div className="p-6 border-t border-zinc-900">
        <div className="bg-zinc-900 rounded-2xl p-5 border border-zinc-800">
          <p className="text-[10px] uppercase tracking-widest text-zinc-500 mb-2 font-bold">Wallet Identity</p>
          <p className="text-xs font-mono text-cyan-400 truncate">{walletStatus}</p>
        </div>
      </div>
    </div>
  );
}
