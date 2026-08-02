'use client';

import { Shield, Menu, ShieldCheck, LogIn, LogOut, User as UserIcon, Sun, Moon } from 'lucide-react';
import WalletConnect from './WalletConnect';
import Image from 'next/image';
import { useAuth } from '@/components/auth/FirebaseProvider';
import { useTheme } from '@/components/ThemeProvider';
import { useState } from 'react';

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
  const { user, signInWithGoogle, logout, isSandboxMode } = useAuth();
  const { theme, toggleTheme, isLightMode } = useTheme();
  const [signingIn, setSigningIn] = useState(false);

  const handleGoogleAuth = async () => {
    setSigningIn(true);
    try {
      await signInWithGoogle();
    } catch (e) {
      console.error('Google sign in error:', e);
    } finally {
      setSigningIn(false);
    }
  };

  return (
    <header className="h-20 border-b border-zinc-900 px-4 md:px-6 flex items-center justify-between bg-zinc-950/50 backdrop-blur-md relative z-30">
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
          <Image
            src="/sovranly-logo-v2.png"
            alt="Sovranly IP Logo"
            width={32}
            height={32}
            className="w-7 h-7 object-contain relative z-10 drop-shadow-[0_0_8px_rgba(34,211,238,0.6)]"
            referrerPolicy="no-referrer"
            priority
          />
        </div>
        <span className="font-bold tracking-widest text-white text-xs uppercase font-mono hidden md:inline-block">
          Sovranly IP
        </span>
      </div>

      {/* Right: Theme Toggle + Google Sign In + Security Status + Wallet Connect */}
      <div className="flex items-center gap-3 z-40">
        <div className="px-3 py-1.5 bg-emerald-950/30 border border-emerald-500/15 text-emerald-400 text-[9px] uppercase tracking-widest rounded-full items-center gap-2 hidden xl:flex">
          <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
          {walletAddress || user ? 'Zero Trust Authed' : 'Network Secure'}
        </div>

        {/* Theme Toggle Button (Obsidian Dark vs Sovereign Light Mode) */}
        <button
          onClick={toggleTheme}
          title={isLightMode ? "Switch to Obsidian Dark Mode" : "Switch to Sovereign Light Mode (High Contrast)"}
          className="p-2 rounded-xl border border-zinc-800 bg-zinc-900/80 text-zinc-300 hover:text-white hover:border-cyan-500/40 transition-all flex items-center gap-1.5 cursor-pointer"
          aria-label="Toggle color theme"
        >
          {isLightMode ? (
            <Moon className="w-4 h-4 text-violet-400" />
          ) : (
            <Sun className="w-4 h-4 text-amber-400" />
          )}
          <span className="hidden xl:inline text-[10px] font-mono uppercase tracking-wider">
            {isLightMode ? 'Light' : 'Obsidian'}
          </span>
        </button>

        {/* Google Authentication Status / Button */}
        {user ? (
          <div className="flex items-center gap-2 bg-zinc-900/80 border border-zinc-800 px-3 py-1.5 rounded-xl text-xs text-zinc-200 shadow-inner">
            <div className="w-6 h-6 rounded-full bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 font-bold overflow-hidden flex-shrink-0">
              {user.photoURL ? (
                <Image src={user.photoURL} alt={user.displayName || 'User'} width={24} height={24} className="rounded-full" referrerPolicy="no-referrer" />
              ) : (
                <UserIcon className="w-3.5 h-3.5 text-cyan-400" />
              )}
            </div>
            <div className="hidden lg:block text-left max-w-[120px] truncate">
              <p className="font-medium text-[11px] text-white truncate">{user.displayName || user.email || 'Verified User'}</p>
              <p className="text-[9px] text-cyan-400 font-mono">{isSandboxMode ? 'Sandbox Mode' : 'Google Verified'}</p>
            </div>
            <button
              onClick={() => logout()}
              title="Sign Out"
              className="ml-1 p-1 rounded-lg text-zinc-400 hover:text-red-400 hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <button
            onClick={handleGoogleAuth}
            disabled={signingIn}
            className="flex items-center gap-2 px-3.5 py-2 bg-gradient-to-r from-cyan-600/80 to-blue-600/80 hover:from-cyan-500 hover:to-blue-500 text-white font-medium text-xs rounded-xl border border-cyan-500/30 shadow-lg shadow-cyan-950/30 transition-all cursor-pointer disabled:opacity-50"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
            <span className="hidden sm:inline font-mono">Sign in with Google</span>
            <span className="sm:hidden font-mono">Sign In</span>
          </button>
        )}

        <WalletConnect onConnect={setWalletAddress} />
      </div>
    </header>
  );
}

