'use client';

import { Gauge, BarChart3, User, Users, FileText, LogOut, ShieldAlert, Scale, Sliders, Mail, X, Presentation, Rocket, Shield, Building2, Brain, ShieldCheck, Database, Globe } from 'lucide-react';
import Image from 'next/image';
import { useAuth } from './auth/FirebaseProvider';
import { SovranlyLogo } from '@/components/SovranlyLogo';
import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';
import { PublicPagesHamburgerMenu } from '@/components/PublicPagesHamburgerMenu';

export default function Sidebar({ 
  activePage, 
  setActivePage, 
  walletStatus,
  isOpen,
  onClose
}: { 
  activePage: number, 
  setActivePage: (id: number) => void, 
  walletStatus: string,
  isOpen: boolean,
  onClose: () => void 
}) {
  const { user, logout } = useAuth();
  const [showPublicDirectory, setShowPublicDirectory] = useState(false);

  return (
    <>
      <PublicPagesHamburgerMenu isOpen={showPublicDirectory} onClose={() => setShowPublicDirectory(false)} />
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop/Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[99]"
          />

          {/* Sidebar Drawer container */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 left-0 bottom-0 w-80 bg-zinc-950 border-r border-zinc-900 flex flex-col h-screen z-[100] shadow-2xl"
          >
            <div className="p-8 border-b border-zinc-900 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <SovranlyLogo size="sm" />
                  <span className="font-bold tracking-tighter text-white text-xl uppercase">SOVRANLY IP</span>
                </div>
                <p className="text-emerald-400 text-[9px] uppercase tracking-widest mt-1 font-mono">Sovereign IP Authority</p>
              </div>
              <button 
                onClick={onClose}
                className="p-2 -mr-2 rounded-xl text-zinc-500 hover:text-white hover:bg-zinc-900 transition-all focus:outline-none cursor-pointer"
                aria-label="Close menu"
              >
                <X className="w-4 h-4 text-cyan-400" />
              </button>
            </div>

            <div className="flex-1 px-4 py-5 space-y-6 overflow-y-auto custom-scrollbar">
              {/* Public Pages & Pricing Quick Access Box */}
              <div className="bg-gradient-to-r from-cyan-950/40 via-zinc-900/60 to-emerald-950/40 border border-cyan-500/30 rounded-2xl p-3.5 shadow-lg">
                <button
                  onClick={() => setShowPublicDirectory(true)}
                  className="w-full flex items-center justify-between px-3 py-2.5 bg-cyan-950/60 hover:bg-cyan-900/80 border border-cyan-500/40 rounded-xl text-cyan-300 font-mono text-xs font-bold transition-all shadow-sm cursor-pointer group"
                >
                  <span className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-cyan-400 animate-pulse group-hover:rotate-45 transition-transform" />
                    Public Pages &amp; Pricing
                  </span>
                  <span className="text-[10px] bg-cyan-500/20 px-2 py-0.5 rounded text-cyan-200">Index</span>
                </button>
                <p className="text-[10px] text-zinc-400 font-mono mt-2 px-1 leading-relaxed">
                  Instant access to public pricing, Wiki, FAQ, legal terms, and compliance disclosures.
                </p>
              </div>

              {/* Main Hub */}
              <div className="space-y-1">
                <button 
                  onClick={() => { setActivePage(0); onClose(); }}
                  className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${activePage === 0 ? 'bg-zinc-900 border border-zinc-800 text-white shadow-lg' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/40'}`}
                >
                  <Gauge className="w-4 h-4 text-cyan-400 shrink-0" /> Command Center
                </button>
              </div>

              {/* Category 1: Core Creator Workflow */}
              <div className="space-y-1">
                <div className="px-4 pb-1 text-[10px] font-mono font-bold tracking-wider text-zinc-500 uppercase flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                  Core Creator Workflow
                </div>
                <button 
                  onClick={() => { setActivePage(2); onClose(); }}
                  className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${activePage === 2 ? 'bg-zinc-900 border border-zinc-800 text-white shadow-lg' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/40'}`}
                >
                  <span className="flex items-center gap-3">
                    <FileText className="w-4 h-4 text-emerald-400 shrink-0" />
                    1. IP Asset Registry
                  </span>
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-800/40">Stamp</span>
                </button>
                <button 
                  onClick={() => { setActivePage(4); onClose(); }}
                  className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${activePage === 4 ? 'bg-zinc-900 border border-zinc-800 text-white shadow-lg' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/40'}`}
                >
                  <span className="flex items-center gap-3">
                    <Scale className="w-4 h-4 text-cyan-400 shrink-0" />
                    2. Licensing Compacts
                  </span>
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-cyan-950/60 text-cyan-400 border border-cyan-800/40">Terms</span>
                </button>
                <button 
                  onClick={() => { setActivePage(5); onClose(); }}
                  className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${activePage === 5 ? 'bg-zinc-900 border border-zinc-800 text-white shadow-lg' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/40'}`}
                >
                  <span className="flex items-center gap-3">
                    <Sliders className="w-4 h-4 text-teal-400 shrink-0" />
                    3. Royalty Sandbox
                  </span>
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-teal-950/60 text-teal-400 border border-teal-800/40">85/15</span>
                </button>
              </div>

              {/* Category 2: Protection & Distribution */}
              <div className="space-y-1">
                <div className="px-4 pb-1 text-[10px] font-mono font-bold tracking-wider text-zinc-500 uppercase flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-violet-400"></span>
                  Protection &amp; Tokenization
                </div>
                <button 
                  onClick={() => { setActivePage(11); onClose(); }}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${activePage === 11 ? 'bg-zinc-900 border border-zinc-800 text-white shadow-lg' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/40'}`}
                >
                  <Brain className="w-4 h-4 text-violet-400 shrink-0" /> AI Training Vault
                </button>
                <button 
                  onClick={() => { setActivePage(12); onClose(); }}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${activePage === 12 ? 'bg-zinc-900 border border-zinc-800 text-white shadow-lg' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/40'}`}
                >
                  <Database className="w-4 h-4 text-cyan-400 shrink-0" /> Sovereign Tokenizer
                </button>
                <button 
                  onClick={() => { setActivePage(3); onClose(); }}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${activePage === 3 ? 'bg-zinc-900 border border-zinc-800 text-white shadow-lg' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/40'}`}
                >
                  <BarChart3 className="w-4 h-4 text-amber-400 shrink-0" /> Economics &amp; Analytics
                </button>
              </div>

              {/* Category 3: Workspace & Collaboration */}
              <div className="space-y-1">
                <div className="px-4 pb-1 text-[10px] font-mono font-bold tracking-wider text-zinc-500 uppercase flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  Workspace &amp; Outreach
                </div>
                <button 
                  onClick={() => { setActivePage(6); onClose(); }}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${activePage === 6 ? 'bg-zinc-900 border border-zinc-800 text-white shadow-lg' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/40'}`}
                >
                  <Mail className="w-4 h-4 text-purple-400 shrink-0" /> Creator Inbox
                </button>
                <button 
                  onClick={() => { setActivePage(13); onClose(); }}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${activePage === 13 ? 'bg-zinc-900 border border-zinc-800 text-white shadow-lg' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/40'}`}
                >
                  <Users className="w-4 h-4 text-indigo-400 shrink-0" /> Creator Network
                </button>
                <button 
                  onClick={() => { setActivePage(7); onClose(); }}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${activePage === 7 ? 'bg-zinc-900 border border-zinc-800 text-white shadow-lg' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/40'}`}
                >
                  <Presentation className="w-4 h-4 text-orange-400 shrink-0" /> Google Slides Gateway
                </button>
                <button 
                  onClick={() => { setActivePage(8); onClose(); }}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${activePage === 8 ? 'bg-zinc-900 border border-zinc-800 text-white shadow-lg' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/40'}`}
                >
                  <Rocket className="w-4 h-4 text-rose-400 shrink-0" /> Launch Planner
                </button>
              </div>

              {/* Category 4: Account & Authority */}
              <div className="space-y-1">
                <div className="px-4 pb-1 text-[10px] font-mono font-bold tracking-wider text-zinc-500 uppercase flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-zinc-400"></span>
                  Account &amp; Platform
                </div>
                <button 
                  onClick={() => { setActivePage(1); onClose(); }}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${activePage === 1 ? 'bg-zinc-900 border border-zinc-800 text-white shadow-lg' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/40'}`}
                >
                  <User className="w-4 h-4 text-zinc-300 shrink-0" /> Creator Profile
                </button>
                <button 
                  onClick={() => { setActivePage(9); onClose(); }}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${activePage === 9 ? 'bg-zinc-900 border border-zinc-800 text-white shadow-lg' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/40'}`}
                >
                  <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" /> Tech Stack Ledger
                </button>
                <button 
                  onClick={() => { setActivePage(10); onClose(); }}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${activePage === 10 ? 'bg-zinc-900 border border-zinc-800 text-white shadow-lg' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/40'}`}
                >
                  <Building2 className="w-4 h-4 text-amber-400 shrink-0" /> About Platform
                </button>
              </div>
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
                    onClick={() => { logout(); onClose(); }}
                    className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-zinc-950 hover:bg-red-950/20 hover:text-red-400 hover:border-red-500/20 text-zinc-400 text-xs font-bold border border-zinc-800/80 rounded-xl transition-all cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" /> Terminate Session
                  </button>
                </div>
              )}

              <div className="bg-zinc-905 rounded-2xl p-4 border border-zinc-850/60 flex flex-col gap-1">
                <p className="text-[10px] uppercase tracking-widest text-zinc-500 mb-1 font-black flex items-center gap-1.5 font-mono">
                  <ShieldAlert className="w-3 h-3 text-cyan-400" /> Wallet Identity
                </p>
                <p className="text-xs font-mono text-cyan-400 truncate">{walletStatus === 'Disconnected' ? 'Disconnected' : walletStatus}</p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
    </>
  );
}
