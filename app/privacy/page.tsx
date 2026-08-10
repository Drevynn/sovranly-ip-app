'use client';

import { useState, useEffect } from 'react';
import { Lock, FileText, ArrowLeft, Terminal, ShieldAlert, ShieldCheck, RefreshCw, Layers, Check } from 'lucide-react';
import Link from 'next/link';

interface ConsentReceipt {
  hash: string;
  timestamp: string;
  essentials: boolean;
  analytics: boolean;
  preferences: boolean;
}

export default function PrivacyPolicy() {
  const lastUpdated = "July 7, 2026";
  const [receipt, setReceipt] = useState<ConsentReceipt | null>(null);

  useEffect(() => {
    // Read current consent receipt state dynamically
    const updateReceipt = () => {
      const stored = localStorage.getItem('sovranly_cookie_consent_receipt');
      if (stored) {
        try {
          setReceipt(JSON.parse(stored));
        } catch (e) {
          setReceipt(null);
        }
      } else {
        setReceipt(null);
      }
    };

    updateReceipt();
    // Periodically poll or capture local updates if needed
    const interval = setInterval(updateReceipt, 1000);
    return () => clearInterval(interval);
  }, []);

  const handlePurgeAndReset = () => {
    localStorage.removeItem('sovranly_cookie_consent_receipt');
    document.cookie = 'sovranly_essential_consent=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    document.cookie = 'sovranly_analytics_consent=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    document.cookie = 'sovranly_preferences_consent=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    setReceipt(null);
    alert('Sovereign consent receipt and compliance cookies successfully purged. Reloading page...');
    window.location.reload();
  };

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
      title: "4. Sovereign Local Storage & Privacy Controls",
      content: "We minimize traditional client tracking to respect user sovereignty. Any localized metadata caches, interface configurations, or anonymous diagnostic tokens are governed directly by your preferences as chosen and signed via our Sovereign Consent Manager. Users hold total, cryptographically-verifiable control over their storage profile and can revoke consent or purge local state parameters at any time."
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

        {/* Dynamic Sovereign Cookie Compliance Audit */}
        <div id="cookie-declaration-container" className="p-6 md:p-8 bg-zinc-950 border border-zinc-900 rounded-3xl space-y-6 relative overflow-hidden shadow-xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-cyan-500/5 via-transparent to-transparent pointer-events-none" />
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-900 pb-5">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-mono tracking-widest text-cyan-400 font-black flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5" /> Storage Governance Matrix
              </span>
              <h2 className="text-lg font-black text-white uppercase tracking-tight">Sovereign Storage & Cookie Audit</h2>
              <p className="text-xs text-zinc-500 font-sans">Transparent, self-contained documentation of localized parameters and system trackers.</p>
            </div>

            {receipt && (
              <button
                onClick={handlePurgeAndReset}
                className="px-3 py-1.5 bg-rose-950/20 hover:bg-rose-950/40 border border-rose-500/20 rounded-xl text-[10px] font-mono text-rose-400 transition-all flex items-center gap-1.5 self-start md:self-auto cursor-pointer"
              >
                <RefreshCw className="w-3 h-3 animate-spin" style={{ animationDuration: '6s' }} /> Purge Local Signature
              </button>
            )}
          </div>

          {/* Current Receipt Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-zinc-900/30 border border-zinc-900 rounded-2xl space-y-2">
              <h4 className="text-[10px] font-mono font-black text-zinc-400 uppercase">Your Active Authorization Signature</h4>
              {receipt ? (
                <div className="space-y-1">
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 bg-emerald-950/40 border border-emerald-900/30 px-2 py-0.5 rounded-full">
                    <ShieldCheck className="w-3.5 h-3.5" /> SECURED & ACTIVE
                  </span>
                  <p className="font-mono text-[10px] text-zinc-300 truncate pt-1">
                    <span className="text-zinc-500">HASH:</span> {receipt.hash}
                  </p>
                  <p className="font-mono text-[9px] text-zinc-400">
                    <span className="text-zinc-500">SIGNED_ON:</span> {new Date(receipt.timestamp).toLocaleString()}
                  </p>
                </div>
              ) : (
                <div className="space-y-1">
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 bg-amber-950/40 border border-amber-900/30 px-2 py-0.5 rounded-full">
                    <ShieldAlert className="w-3.5 h-3.5" /> PENDING EXPLICIT SIGNATURE
                  </span>
                  <p className="text-[10px] text-zinc-500 pt-1 leading-relaxed">
                    No persistent preference stamp was detected. Currently utilizing standard high-privacy zero-knowledge defaults.
                  </p>
                </div>
              )}
            </div>

            <div className="p-4 bg-zinc-900/30 border border-zinc-900 rounded-2xl space-y-1.5">
              <h4 className="text-[10px] font-mono font-black text-zinc-400 uppercase">Zero-Trust Directives</h4>
              <p className="text-[11px] text-zinc-400 leading-relaxed font-sans">
                Our self-governed compliance engine establishes a persistent firewall. Unlike traditional Cookiebot overlays, we store absolutely no user activity profiles, IP coordinates, or tracking logs on secondary cloud infrastructure.
              </p>
            </div>
          </div>

          {/* Audit Ledger Table */}
          <div className="overflow-x-auto rounded-2xl border border-zinc-900 bg-zinc-950/60">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="bg-zinc-900/50 border-b border-zinc-900 text-[10px] font-mono uppercase text-zinc-500">
                  <th className="p-4 font-bold">Variable Name</th>
                  <th className="p-4 font-bold">Storage Type</th>
                  <th className="p-4 font-bold">Category</th>
                  <th className="p-4 font-bold">Duration</th>
                  <th className="p-4 font-bold">Purpose Description</th>
                  <th className="p-4 font-bold">Active Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-900 text-[11px] leading-normal text-zinc-400">
                <tr>
                  <td className="p-4 font-mono font-black text-white text-[10px]">sovranly_cookie_consent_receipt</td>
                  <td className="p-4 font-mono text-[10px]">LocalStorage</td>
                  <td className="p-4">Sovereign Compliance</td>
                  <td className="p-4">Persistent</td>
                  <td className="p-4 text-zinc-500">Records your custom compliance signature, timestamp, and consent vectors to prevent re-prompt overlays.</td>
                  <td className="p-4">
                    {receipt ? (
                      <span className="text-emerald-400 font-bold flex items-center gap-1"><Check className="w-3 h-3" /> ACTIVE</span>
                    ) : (
                      <span className="text-zinc-600 font-mono italic">INACTIVE</span>
                    )}
                  </td>
                </tr>
                <tr>
                  <td className="p-4 font-mono font-black text-white text-[10px]">sovranly_essential_consent</td>
                  <td className="p-4 font-mono text-[10px]">Http-Only Cookie</td>
                  <td className="p-4 text-emerald-400 font-bold">Core Essential</td>
                  <td className="p-4">1 Year</td>
                  <td className="p-4 text-zinc-500">Memorizes basic multi-lingual routing targets, system security tokens, and dynamic wallet connect keys.</td>
                  <td className="p-4">
                    <span className="text-emerald-400 font-bold flex items-center gap-1"><Check className="w-3 h-3" /> ALWAYS ON</span>
                  </td>
                </tr>
                <tr>
                  <td className="p-4 font-mono font-black text-white text-[10px]">sovranly_analytics_consent</td>
                  <td className="p-4 font-mono text-[10px]">Http-Only Cookie</td>
                  <td className="p-4 text-cyan-400">Diagnostics</td>
                  <td className="p-4">1 Year</td>
                  <td className="p-4 text-zinc-500">Permits localized performance caching and diagnostic latency tests to optimize global platform rendering.</td>
                  <td className="p-4 font-mono">
                    {receipt && receipt.analytics ? (
                      <span className="text-cyan-400 font-bold flex items-center gap-1"><Check className="w-3 h-3" /> ENABLED</span>
                    ) : (
                      <span className="text-zinc-600 italic">DISABLED</span>
                    )}
                  </td>
                </tr>
                <tr>
                  <td className="p-4 font-mono font-black text-white text-[10px]">sovranly_preferences_consent</td>
                  <td className="p-4 font-mono text-[10px]">Http-Only Cookie</td>
                  <td className="p-4 text-violet-400">UI Persistence</td>
                  <td className="p-4">1 Year</td>
                  <td className="p-4 text-zinc-500">Caches layout configuration states, active side-bar modes, and general developer control selections.</td>
                  <td className="p-4 font-mono">
                    {receipt && receipt.preferences ? (
                      <span className="text-violet-400 font-bold flex items-center gap-1"><Check className="w-3 h-3" /> ENABLED</span>
                    ) : (
                      <span className="text-zinc-600 italic">DISABLED</span>
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
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
