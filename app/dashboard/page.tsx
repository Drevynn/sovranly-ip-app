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
import Permissions from '@/components/Permissions';
import MobileBottomNav from '@/components/MobileBottomNav';
import { useAuth } from '@/components/auth/FirebaseProvider';
import { SignIn } from '@/components/auth/SignIn';
import { SovranlyLogo } from '@/components/SovranlyLogo';
import Link from 'next/link';
import { ShieldCheck } from 'lucide-react';

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const [activePage, setActivePage] = useState(0); // Default to Command Center
  const [currentAccount, setCurrentAccount] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedAssetForLicensing, setSelectedAssetForLicensing] = useState<any>(null);

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
        <p className="text-zinc-650 font-mono text-[9px] uppercase tracking-[0.25em] animate-pulse">Establishing Sovereign Identity Session...</p>
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
              <SovranlyLogo size="sm" />
              <span className="font-bold tracking-tighter text-white uppercase text-lg">SOVRANLY IP</span>
            </div>
            <Link href="/" className="text-xs text-zinc-500 hover:text-white transition-colors uppercase tracking-wider font-extrabold flex items-center gap-2">
              Return to Website
            </Link>
          </div>
        </header>

        {/* Secure Sign In Portal */}
        <div className="flex-1 flex items-center justify-center py-12 relative z-10">
          <SignIn />
        </div>

        {/* Footer */}
        <footer className="border-t border-white/5 py-8 flex flex-col items-center justify-center gap-4 text-center text-zinc-700 text-[9px] font-mono">
          <span>Sovranly Continuous Verification Environment</span>
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
            activePage === 0 ? 'Command Center' :
            activePage === 1 ? 'User Profile' :
            activePage === 2 ? 'IP Asset Registry' : 
            activePage === 3 ? 'Economics & Analytics' :
            activePage === 4 ? 'Licensing Compacts' :
            activePage === 5 ? 'Royalty Sandbox' :
            activePage === 6 ? 'Creator Inbox' :
            activePage === 7 ? 'Google Slides Gateway' :
            activePage === 8 ? 'Launch Planner' :
            activePage === 9 ? 'Tech Stack Ledger' :
            activePage === 10 ? 'About Platform' :
            activePage === 11 ? 'AI Training Vault' :
            activePage === 12 ? 'Sovereign Tokenizer' :
            activePage === 13 ? 'Creator Network' :
            activePage === 14 ? 'Permissions Hub (Instant Video Rights)' :
            'Permissions Hub'
          } 
          setWalletAddress={setCurrentAccount} 
          walletAddress={currentAccount} 
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />

        <main className="flex-1 overflow-auto p-4 sm:p-6 md:p-8 pb-28 md:pb-8 bg-[#09090b]">
          {activePage === 0 && <Overview onNavigate={setActivePage} />}
          {activePage === 1 && <Profile />}
          {activePage === 2 && (
            <AssetManager 
              walletAddress={currentAccount} 
              onNavigateToLicensing={(asset) => {
                setSelectedAssetForLicensing(asset);
                setActivePage(4);
              }}
              onNavigateToPermissions={(asset) => {
                setSelectedAssetForLicensing(asset);
                setActivePage(14);
              }}
            />
          )}
          {activePage === 3 && <Analytics />}
          {activePage === 4 && (
            <LicensingAgreementBuilder 
              walletAddress={currentAccount} 
              initialAsset={selectedAssetForLicensing} 
            />
          )}
          {activePage === 5 && <RoyaltySandbox />}
          {activePage === 6 && <Inbox walletAddress={currentAccount} />}
          {activePage === 7 && <GoogleSlidesManager />}
          {activePage === 8 && <LaunchPlanner />}
          {activePage === 9 && <TechStackLedger />}
          {activePage === 10 && <AboutUs />}
          {activePage === 11 && <AiLicensingCenter />}
          {activePage === 12 && <DataTokenizationHub />}
          {activePage === 13 && <CreatorNetwork />}
          {activePage === 14 && (
            <Permissions 
              initialAsset={selectedAssetForLicensing}
              walletAddress={currentAccount}
              onNavigate={setActivePage}
            />
          )}
        </main>

        <MobileBottomNav 
          activePage={activePage} 
          setActivePage={setActivePage} 
          onOpenMenu={() => setSidebarOpen(true)} 
        />
      </div>
    </div>
  );
}
