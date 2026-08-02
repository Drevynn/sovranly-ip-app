'use client';

import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import Overview from '@/components/Overview';
import Profile from '@/components/Profile';
import AssetManager from '@/components/AssetManager';
import Analytics from '@/components/Analytics';
import LicensingAgreementBuilder from '@/components/LicensingAgreementBuilder';
import RoyaltySandbox from '@/components/RoyaltySandbox';
import Inbox from '@/components/Inbox';
import GoogleSlidesManager from '@/components/GoogleSlidesManager';
import LaunchPlanner from '@/components/LaunchPlanner';
import TechStackLedger from '@/components/TechStackLedger';
import AboutUs from '@/components/AboutUs';
import AiLicensingCenter from '@/components/AiLicensingCenter';
import DataTokenizationHub from '@/components/DataTokenizationHub';
import CreatorNetwork from '@/components/CreatorNetwork';
import SyncLicensingHub from '@/components/SyncLicensingHub';
import { useAuth } from '@/components/auth/FirebaseProvider';
import { useLanguage } from '@/components/LanguageProvider';
import { SignIn } from '@/components/auth/SignIn';
import LanguageSelector from '@/components/LanguageSelector';
import Image from 'next/image';
import Link from 'next/link';
import { ShieldCheck } from 'lucide-react';

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const { t } = useLanguage();
  const [activePage, setActivePage] = useState(0); // Default to Command Center
  const [currentAccount, setCurrentAccount] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
        <p className="text-zinc-650 font-mono text-[9px] uppercase tracking-[0.25em] animate-pulse">{t('establishingIdentity')}</p>
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
              <div className="w-8 h-8 bg-zinc-950 border border-cyan-500/30 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-950/20 p-1 overflow-hidden">
                <Image
                  src="/sovranly-logo-v2.png"
                  alt="Sovranly IP"
                  width={24}
                  height={24}
                  className="w-full h-full object-contain drop-shadow-[0_0_6px_rgba(34,211,238,0.4)]"
                  referrerPolicy="no-referrer"
                />
              </div>
              <span className="font-bold tracking-tighter text-white uppercase text-lg">{t('brandName')}</span>
            </div>
            <Link href="/" className="text-xs text-zinc-500 hover:text-white transition-colors uppercase tracking-wider font-extrabold flex items-center gap-2">
              {t('returnHome')}
            </Link>
          </div>
        </header>

        {/* Secure Sign In Portal */}
        <div className="flex-1 flex items-center justify-center py-12 relative z-10">
          <SignIn />
        </div>

        {/* Footer */}
        <footer className="border-t border-white/5 py-8 flex flex-col items-center justify-center gap-4 text-center text-zinc-700 text-[9px] font-mono">
          <LanguageSelector />
          <span>{t('sessionContinuous')}</span>
        </footer>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#050505] text-[#e0e0e0] font-sans relative">
      <Sidebar 
        activePage={activePage} 
        setActivePage={setActivePage} 
        walletStatus={walletStatus} 
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className="flex-1 flex flex-col overflow-hidden w-full">
        <Header 
          pageTitle={
            activePage === 0 ? t('commandCenter') :
            activePage === 1 ? t('userProfile') :
            activePage === 2 ? t('ipAssetRegistry') : 
            activePage === 3 ? t('analytics') :
            activePage === 4 ? t('licensingCompacts') :
            activePage === 5 ? t('royaltySandbox') :
            activePage === 6 ? (t('creatorInbox') || 'Creator Inbox') :
            activePage === 7 ? 'Google Slides Gateway' :
            activePage === 8 ? (t('launchPlanner') || 'Launch Planner') :
            activePage === 9 ? (t('techStackLedger') || 'Tech Stack Ledger') :
            activePage === 10 ? 'About Platform' :
            activePage === 11 ? (t('aiLicensing') || 'AI Training Vault') :
            activePage === 12 ? 'Sovereign Tokenizer' :
            activePage === 14 ? 'Sync Licensing Storefront' :
            'Creator Network'
          } 
          setWalletAddress={setCurrentAccount} 
          walletAddress={currentAccount} 
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />

        <main className="flex-1 overflow-auto p-8 bg-[#09090b]">
          {activePage === 0 && <Overview />}
          {activePage === 1 && <Profile />}
          {activePage === 2 && <AssetManager walletAddress={currentAccount} />}
          {activePage === 3 && <Analytics />}
          {activePage === 4 && <LicensingAgreementBuilder walletAddress={currentAccount} />}
          {activePage === 5 && <RoyaltySandbox />}
          {activePage === 6 && <Inbox walletAddress={currentAccount} />}
          {activePage === 7 && <GoogleSlidesManager />}
          {activePage === 8 && <LaunchPlanner />}
          {activePage === 9 && <TechStackLedger />}
          {activePage === 10 && <AboutUs />}
          {activePage === 11 && <AiLicensingCenter />}
          {activePage === 12 && <DataTokenizationHub />}
          {activePage === 13 && <CreatorNetwork />}
          {activePage === 14 && <SyncLicensingHub walletAddress={currentAccount} />}
        </main>
      </div>
    </div>
  );
}
