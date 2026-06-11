'use client';

import { Gauge, BarChart3, User, FileText, LogOut, ShieldAlert } from 'lucide-react';
import Image from 'next/image';
import { useAuth } from './auth/FirebaseProvider';

export default function Sidebar({ activePage, setActivePage, walletStatus }: { activePage: number, setActivePage: (id: number) => void, walletStatus: string }) {
  const { user, logout } = useAuth();

  return (
    <div className="w-72 bg-zinc-950 border-r border-zinc-900 flex flex-col h-screen">
      <div className="p-8 border-b border-zinc-900">
        <div className="flex items-center gap-3 mb-2">
          <Image src="/sovranly-logo-v2.png" alt="Sovranly" width={40} height={40} referrerPolicy="no-referrer" />
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

      <div className="p-6 border-t border-zinc-900 space-y-4">
        {user && (
          <div className="bg-zinc-900/40 rounded-2xl p-4 border border-zinc-800/80 space-y-3">
            <div className="flex items-center gap-3">
              {user.photoURL ? (
                <div className="relative w-8 h-8 rounded-full overflow-hidden border border-zinc-700">
                  <Image 
                    src={user.photoURL} 
                    alt={user.displayName || 'User'} 
                    fill 
                    className="object-cover" 
                    referrerPolicy="no-referrer"
                  />
                </div>
              ) : (
                <div className="w-8 h-8 rounded-full bg-cyan-950/50 border border-cyan-800/50 text-cyan-400 flex items-center justify-center text-xs font-bold">
                  {user.displayName ? user.displayName.slice(0, 2).toUpperCase() : 'US'}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-white truncate leading-none mb-1">
                  {user.displayName || 'Authorized Agent'}
                </p>
                <p className="text-[10px] text-zinc-500 truncate">
                  {user.email || 'authenticated'}
                </p>
              </div>
            </div>
            
            <button 
              onClick={() => logout()}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-zinc-950 hover:bg-red-950/20 hover:text-red-400 hover:border-red-500/20 text-zinc-400 text-xs font-bold border border-zinc-800/80 rounded-xl transition-all"
            >
              <LogOut className="w-3.5 h-3.5" /> Terminate Session
            </button>
          </div>
        )}

        <div className="bg-zinc-905 rounded-2xl p-4 border border-zinc-850/60">
          <p className="text-[10px] uppercase tracking-widest text-zinc-500 mb-2 font-black flex items-center gap-1.5">
            <ShieldAlert className="w-3 h-3 text-cyan-400" /> Wallet Identity
          </p>
          <p className="text-xs font-mono text-cyan-400 truncate">{walletStatus}</p>
        </div>
      </div>
    </div>
  );
}
