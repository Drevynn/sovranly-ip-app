'use client';

import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import Overview from '@/components/Overview';
import Profile from '@/components/Profile';
import AssetManager from '@/components/AssetManager';
import Analytics from '@/components/Analytics';

export default function DashboardPage() {
  const [activePage, setActivePage] = useState(0); // Default to Command Center
  const [currentAccount, setCurrentAccount] = useState<string | null>(null);

  const walletStatus = currentAccount 
    ? `${currentAccount.slice(0, 6)}...${currentAccount.slice(-4)}` 
    : 'Disconnected';

  return (
    <div className="flex h-screen bg-[#050505] text-[#e0e0e0] font-sans">
      <Sidebar 
        activePage={activePage} 
        setActivePage={setActivePage} 
        walletStatus={walletStatus} 
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          pageTitle={
            activePage === 0 ? "Command Center" :
            activePage === 1 ? "User Profile" :
            activePage === 2 ? "SECURE IP ASSET REGISTRY" : 
            "ADVANCED BLOCKCHAIN ANALYTICS"
          } 
          setWalletAddress={setCurrentAccount} 
          walletAddress={currentAccount} 
        />

        <main className="flex-1 overflow-auto p-8 bg-[#09090b]">
          {activePage === 0 && <Overview />}
          {activePage === 1 && <Profile />}
          {activePage === 2 && <AssetManager walletAddress={currentAccount} />}
          {activePage === 3 && <Analytics />}
        </main>
      </div>
    </div>
  );
}
