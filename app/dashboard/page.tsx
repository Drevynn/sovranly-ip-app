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
import CloudflareHandshakeDiagnostics from '@/components/CloudflareHandshakeDiagnostics';
import OfficialIpNotices from '@/components/OfficialIpNotices';
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
import NonCustodialBadge from '@/components/NonCustodialBadge';

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
        <header className="border-b border-white/5 py-6 bg-zinc-950/80 backdrop-blur-md relative z-10">
          <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 group">
              <SovranlyLogo size="sm" />
              <span className="font-bold tracking-tighter text-white uppercase text-lg group-hover:text-cyan-400 transition-colors">SOVRANLY IP</span>
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/marketplace" className="text-xs text-zinc-400 hover:text-white transition-colors hidden sm:inline-block">
                Explore Marketplace
              </Link>
              <Link href="/" className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors uppercase tracking-wider font-extrabold flex items-center gap-2">
                Public Homepage →
              </Link>
            </div>
          </div>
        </header>

        {/* Public Notice Banner for Google Reviewers & Guests */}
        <div className="relative z-10 max-w-2xl mx-auto px-4 pt-6">
          <div className="p-4 rounded-2xl bg-zinc-900/60 border border-cyan-500/20 text-xs text-zinc-300 space-y-2 backdrop-blur-md">
            <div className="flex items-center gap-2 text-cyan-400 font-mono font-bold uppercase tracking-wider text-[11px]">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span>Public Platform Notice</span>
            </div>
            <p className="leading-relaxed">
              You are viewing the authenticated Creator Portal. The entire Sovranly IP public platform—including digital asset listings, license term generator, licensing tutorials, documentation, and policies—is freely accessible <strong className="text-white">without requiring a login</strong>.
            </p>
            <div className="flex flex-wrap gap-2 pt-1 font-mono text-[10px]">
              <Link href="/" className="px-2.5 py-1 rounded-md bg-cyan-950/40 text-cyan-400 border border-cyan-800/40 hover:bg-cyan-900/50 transition-colors">
                Public Homepage
              </Link>
              <Link href="/marketplace" className="px-2.5 py-1 rounded-md bg-zinc-800 text-zinc-300 hover:bg-zinc-700 transition-colors">
                Explore Listings
              </Link>
              <Link href="/privacy" className="px-2.5 py-1 rounded-md bg-zinc-800 text-zinc-300 hover:bg-zinc-700 transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="px-2.5 py-1 rounded-md bg-zinc-800 text-zinc-300 hover:bg-zinc-700 transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>

        {/* Secure Sign In Portal */}
        <div className="flex-1 flex items-center justify-center py-10 relative z-10">
          <SignIn />
        </div>

        {/* Footer */}
        <footer className="border-t border-white/5 py-8 flex flex-col items-center justify-center gap-4 text-center text-zinc-600 text-xs">
          <div className="flex flex-wrap items-center justify-center gap-4 text-zinc-500 text-xs px-4">
            <Link href="/" className="hover:text-cyan-400 transition-colors">Public Homepage</Link>
            <span>•</span>
            <Link href="/marketplace" className="hover:text-cyan-400 transition-colors">Marketplace</Link>
            <span>•</span>
            <Link href="/terms" className="hover:text-cyan-400 transition-colors">Terms of Service</Link>
            <span>•</span>
            <Link href="/privacy" className="hover:text-cyan-400 transition-colors">Privacy Policy</Link>
          </div>
          <NonCustodialBadge variant="compact" />
          <span className="font-mono text-[10px]">Sovranly IP Continuous Verification Environment</span>
        </footer>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-zinc-950 text-zinc-100 font-sans relative transition-colors">
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
            activePage === 2 ? 'Asset Management (Folders & Metadata)' : 
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
            activePage === 15 ? 'Cloudflare Handshake & Tunnel Diagnostics' :
            activePage === 16 ? 'Official IP Communications & Legal Notices' :
            'Permissions Hub'
          } 
          setWalletAddress={setCurrentAccount} 
          walletAddress={currentAccount} 
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />

        <main className="flex-1 overflow-auto p-6 sm:p-8 lg:p-10 pb-32 md:pb-12 bg-zinc-950 transition-colors">
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
          {activePage === 15 && <CloudflareHandshakeDiagnostics />}
          {activePage === 16 && <OfficialIpNotices walletAddress={currentAccount} />}

          {/* Persistent Non-Custodial Architecture Footer */}
          <footer className="mt-16 pt-8 border-t border-zinc-900 flex flex-col items-center justify-center gap-3 text-center">
            <NonCustodialBadge variant="compact" />
            <div className="flex flex-wrap items-center justify-center gap-2 text-[10px] text-zinc-600 font-mono">
              <span>ZERO CUSTODY PROTOCOL</span>
              <span>•</span>
              <span>NON-INTERMEDIARY ROYALTY SPLITS</span>
              <span>•</span>
              <Link href="/terms" className="text-zinc-500 hover:text-cyan-400 underline transition-colors">
                COMPLIANCE & TERMS
              </Link>
            </div>
          </footer>
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
