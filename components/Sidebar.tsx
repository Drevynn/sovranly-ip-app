'use client';

import { Gauge, BarChart3, User, FileText, LogOut, ShieldAlert, Scale, Sliders, Mail, X, Presentation, Rocket, Shield, Building2, Brain, ShieldCheck } from 'lucide-react';
import Image from 'next/image';
import { useAuth } from './auth/FirebaseProvider';
import { useLanguage } from './LanguageProvider';
import LanguageSelector from './LanguageSelector';
import { motion, AnimatePresence } from 'motion/react';

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
  const { t, language } = useLanguage();

  const slidesTitle = language === 'es' ? 'Pasarela de Google Slides' : 
                      language === 'ja' ? 'Google Slides ゲートウェイ' : 
                      language === 'fr' ? 'Passerelle Google Slides' : 
                      'Google Slides Gateway';

  return (
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
                  <div className="w-9 h-9 bg-zinc-950 border border-cyan-500/30 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-950/20">
                    <ShieldCheck className="w-5 h-5 text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.4)]" />
                  </div>
                  <span className="font-bold tracking-tighter text-white text-xl uppercase">{t('brandName')}</span>
                </div>
                <p className="text-emerald-400 text-[9px] uppercase tracking-widest mt-1 font-mono">{t('brandSubtitle')}</p>
              </div>
              <button 
                onClick={onClose}
                className="p-2 -mr-2 rounded-xl text-zinc-500 hover:text-white hover:bg-zinc-900 transition-all focus:outline-none cursor-pointer"
                aria-label="Close menu"
              >
                <X className="w-4 h-4 text-cyan-400" />
              </button>
            </div>

            <div className="flex-1 px-5 py-6 space-y-1.5 overflow-y-auto">
              <button 
                onClick={() => { setActivePage(0); onClose(); }}
                className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-sm font-semibold transition-all cursor-pointer ${activePage === 0 ? 'bg-zinc-900 border border-zinc-800 text-white shadow-xl shadow-zinc-950/50' : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/30'}`}
              >
                <Gauge className="w-5 h-5 text-cyan-400" /> {t('commandCenter')}
              </button>
              <button 
                onClick={() => { setActivePage(1); onClose(); }}
                className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-sm font-semibold transition-all cursor-pointer ${activePage === 1 ? 'bg-zinc-900 border border-zinc-800 text-white shadow-xl shadow-zinc-950/50' : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/30'}`}
              >
                <User className="w-5 h-5 text-violet-400" /> {t('userProfile')}
              </button>
              <button 
                onClick={() => { setActivePage(2); onClose(); }}
                className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-sm font-semibold transition-all cursor-pointer ${activePage === 2 ? 'bg-zinc-900 border border-zinc-800 text-white shadow-xl shadow-zinc-950/50' : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/30'}`}
              >
                <FileText className="w-5 h-5 text-emerald-400" /> {t('ipAssetRegistry')}
              </button>
              <button 
                onClick={() => { setActivePage(3); onClose(); }}
                className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-sm font-semibold transition-all cursor-pointer ${activePage === 3 ? 'bg-zinc-900 border border-zinc-800 text-white shadow-xl shadow-zinc-950/50' : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/30'}`}
              >
                <BarChart3 className="w-5 h-5 text-amber-400" /> {t('analytics')}
              </button>
              <button 
                onClick={() => { setActivePage(4); onClose(); }}
                className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-sm font-semibold transition-all cursor-pointer ${activePage === 4 ? 'bg-zinc-900 border border-zinc-800 text-white shadow-xl shadow-zinc-950/50' : 'text-zinc-505 hover:text-zinc-350 hover:bg-zinc-900/30'}`}
              >
                <Scale className="w-5 h-5 text-cyan-400" /> {t('licensingCompacts')}
              </button>
              <button 
                onClick={() => { setActivePage(5); onClose(); }}
                className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-sm font-semibold transition-all cursor-pointer ${activePage === 5 ? 'bg-zinc-900 border border-zinc-800 text-white shadow-xl shadow-zinc-950/50' : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/30'}`}
              >
                <Sliders className="w-5 h-5 text-teal-400" /> {t('royaltySandbox')}
              </button>
              <button 
                onClick={() => { setActivePage(6); onClose(); }}
                className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-sm font-semibold transition-all cursor-pointer ${activePage === 6 ? 'bg-zinc-900 border border-zinc-800 text-white shadow-xl shadow-zinc-950/50' : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/30'}`}
              >
                <Mail className="w-5 h-5 text-purple-400" /> {t('creatorInbox') || 'Creator Inbox'}
              </button>
              <button 
                onClick={() => { setActivePage(7); onClose(); }}
                className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-sm font-semibold transition-all cursor-pointer ${activePage === 7 ? 'bg-zinc-900 border border-zinc-800 text-white shadow-xl shadow-zinc-950/50' : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/30'}`}
              >
                <Presentation className="w-5 h-5 text-cyan-400" /> {slidesTitle}
              </button>
              <button 
                onClick={() => { setActivePage(8); onClose(); }}
                className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-sm font-semibold transition-all cursor-pointer ${activePage === 8 ? 'bg-zinc-900 border border-zinc-800 text-white shadow-xl shadow-zinc-950/50' : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/30'}`}
              >
                <Rocket className="w-5 h-5 text-pink-400" /> {t('launchPlanner') || 'Launch Planner'}
              </button>
              <button 
                onClick={() => { setActivePage(9); onClose(); }}
                className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-sm font-semibold transition-all cursor-pointer ${activePage === 9 ? 'bg-zinc-900 border border-zinc-800 text-white shadow-xl shadow-zinc-950/50' : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/30'}`}
              >
                <Shield className="w-5 h-5 text-emerald-400" /> {t('techStackLedger') || 'Tech Stack Ledger'}
              </button>
              <button 
                onClick={() => { setActivePage(10); onClose(); }}
                className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-sm font-semibold transition-all cursor-pointer ${activePage === 10 ? 'bg-zinc-900 border border-zinc-800 text-white shadow-xl shadow-zinc-950/50' : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/30'}`}
              >
                <Building2 className="w-5 h-5 text-amber-400" /> {t('aboutInvestors') || 'About & Investors'}
              </button>
              <button 
                onClick={() => { setActivePage(11); onClose(); }}
                className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-sm font-semibold transition-all cursor-pointer ${activePage === 11 ? 'bg-zinc-900 border border-zinc-800 text-white shadow-xl shadow-zinc-950/50' : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/30'}`}
              >
                <Brain className="w-5 h-5 text-cyan-400" /> {t('aiLicensing') || 'AI Training Vault'}
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
                    onClick={() => { logout(); onClose(); }}
                    className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-zinc-950 hover:bg-red-950/20 hover:text-red-400 hover:border-red-500/20 text-zinc-400 text-xs font-bold border border-zinc-800/80 rounded-xl transition-all cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" /> {t('terminateSession')}
                  </button>
                </div>
              )}

              <div className="bg-zinc-905 rounded-2xl p-4 border border-zinc-850/60 flex flex-col gap-3">
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-zinc-500 mb-2 font-black flex items-center gap-1.5 font-mono">
                    <ShieldAlert className="w-3 h-3 text-cyan-400" /> {t('walletIdentity')}
                  </p>
                  <p className="text-xs font-mono text-cyan-400 truncate">{walletStatus === 'Disconnected' ? t('disconnected') : walletStatus}</p>
                </div>
                <div className="pt-2 border-t border-zinc-900/60">
                  <LanguageSelector />
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
