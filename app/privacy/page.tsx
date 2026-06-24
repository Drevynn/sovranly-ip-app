'use client';

import { Lock, FileText, ArrowLeft, Terminal, ShieldAlert } from 'lucide-react';
import Link from 'next/link';

export default function PrivacyPolicy() {
  const lastUpdated = "June 24, 2026";

  const sections = [
    {
      title: "1. Zero-Knowledge Information Architecture",
      content: "Sovranly IP operates under a strict Zero-Knowledge and Zero-Trust architecture. We do not prompt for, store, or transmit traditional passwords, phone numbers, or private keys. The only identifier needed to leverage the application is a public Web3 wallet address. Any IP assets (such as audio files, scripts, or images) uploaded by users are optionally compressed and decentralized via client-side gateways."
    },
    {
      title: "2. Encrypted Decentralized Media Assets",
      content: "When you attach media assets or documents to the IP Register, the files undergo client-side fragmentation and optional hashing before being pinned to the InterPlanetary File System (IPFS). Because IPFS is a public, decentralized swarm network, users are explicitly cautioned to only upload public, licenseable material, or files they have personally protected with local cryptographic wrappers. Sovranly IP does not maintain centralized database backups of your source media."
    },
    {
      title: "3. Blockchain Ledger Publicity",
      content: "Please note that on-chain operations (such as registering assets, executing licensing agreements, or minting royalty sandboxes) produce immutable public transaction logs on decentralized ledger networks. This includes the date, public key, royalty percentages, and the IPFS CID link. Blockchain data cannot be deleted, altered, or wiped under modern 'Right to be Forgotten' frameworks due to the physical architecture of distributed networks."
    },
    {
      title: "4. Third-Party Analytics & Cookies",
      content: "We minimize traditional client tracking to respect user sovereignty. However, we integrate secure utilities to ensure dynamic compliance. Any browser tracking is governed by your preferences as recorded by Cookiebot and Google Analytics consent variables. Users can adapt or refuse consent options at any time. We do not sell, rent, or trade your analytical fingerprints to ad networks or data Brokers."
    },
    {
      title: "5. Sovereign Communication Tunnels",
      content: "When using our secure contact forms or decentralized inboxes, messages are parsed and routed to verified sovereign handlers. Contact email addresses are solely utilized to resolve support inquiries and are never combined with on-chain wallet histories or transaction portfolios."
    },
    {
      title: "6. Zero-Trust Access Rights (GDPR & CCPA)",
      content: "For data cached by the local web application or Firestore backend, you hold the absolute right to retrieve, export, or permanently wipe your local records. You may perform a self-destruct cycle on your local state by clearing browser storage or disconnecting authorization nodes."
    }
  ];

  return (
    <div className="min-h-screen bg-black text-zinc-100 font-sans selection:bg-cyan-500/20 selection:text-cyan-300 relative overflow-hidden">
      {/* Visual Accents */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-violet-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/3 left-1/4 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[140px] pointer-events-none" />

      {/* Header */}
      <header className="border-b border-white/10 bg-black/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center justify-between p-6 max-w-5xl mx-auto">
          <Link href="/" className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-mono uppercase tracking-wider">Back to Home</span>
          </Link>
          <div className="flex items-center gap-2 px-3 py-1 bg-violet-950/40 border border-violet-800/40 rounded-full text-violet-400 text-xs font-mono">
            <Terminal className="w-3.5 h-3.5" />
            <span>SECURE SHELL</span>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-4xl mx-auto px-6 py-16 md:py-24 space-y-12 relative z-10">
        <div className="space-y-4 text-center">
          <div className="w-16 h-16 bg-violet-950/40 border border-violet-500/30 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-violet-950/50">
            <Lock className="w-8 h-8 text-violet-400" />
          </div>
          <span className="text-[10px] uppercase font-mono text-violet-400 tracking-[0.3em] font-black block">Privacy Preservation</span>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter text-white">PRIVACY POLICY</h1>
          <p className="text-zinc-500 text-xs font-mono">LAST IMMUTABLE UPDATE: {lastUpdated}</p>
        </div>

        {/* Protection Alert Box */}
        <div className="p-6 bg-zinc-900/40 border border-zinc-800 rounded-2xl space-y-4">
          <div className="flex items-center gap-2 text-white font-bold">
            <ShieldAlert className="w-5 h-5 text-violet-400" />
            <h3>Your Cryptographic Sovereign Seal</h3>
          </div>
          <p className="text-sm text-zinc-400 leading-relaxed">
            At <span className="text-white font-semibold">Sovranly IP</span>, we design all features with zero data monetization. No trackers can hook your private key or read your localized metadata. This Privacy Policy documents exactly how we manage secure state transitions and decentralized cache pools.
          </p>
        </div>

        {/* Detailed Sections */}
        <div className="space-y-8">
          {sections.map((sec, idx) => (
            <div key={idx} className="space-y-3 border-b border-zinc-900 pb-8 last:border-0 last:pb-0">
              <h2 className="text-lg font-bold text-white flex items-center gap-3">
                <span className="text-violet-500 text-xs font-mono">[{`0${idx + 1}`}]</span>
                {sec.title}
              </h2>
              <p className="text-sm text-zinc-400 leading-relaxed pl-8">
                {sec.content}
              </p>
            </div>
          ))}
        </div>

        {/* Footer Note */}
        <div className="pt-12 text-center border-t border-zinc-900">
          <p className="text-xs text-zinc-500">
            For continuous security disclosure questions or cryptographic audit updates, email our compliance team at{' '}
            <a href="mailto:create@sovranlyip.com" className="text-violet-400 hover:underline">
              create@sovranlyip.com
            </a>
          </p>
          <span className="text-[8px] uppercase font-mono text-zinc-700 tracking-[0.2em] font-black block mt-6">
            SOVRANLY PRIVACY SYSTEMS • END-TO-END CRYPTO-SHIELD
          </span>
        </div>
      </main>
    </div>
  );
}
