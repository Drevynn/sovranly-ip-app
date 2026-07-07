'use client';

import { Shield, FileText, ArrowLeft, Terminal, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function TermsOfService() {
  const lastUpdated = "June 24, 2026";

  const sections = [
    {
      title: "1. Zero-Trust Architecture & Identity",
      content: "All access to Sovranly IP and its cryptographic ledgers is governed by our strict Zero-Trust Architecture. Users must connect their own self-custodial cryptographic wallets (such as MetaMask or other Web3 providers). Sovranly IP does not hold, manage, or have access to your private keys. You are solely responsible for maintaining the security of your wallet and private keys."
    },
    {
      title: "2. IP Asset Registration & Verification",
      content: "By uploading files (such as music tracks, scripts, artwork, and technical designs) to Sovranly IP, you assert that you are the sole legal owner of the IP or possess explicit, fully authorized rights to distribute and license it. Registered assets are encrypted on-device and published to decentralized IPFS storage. Altering or fabricating proof-of-sovereignty certificates or on-chain mint signatures is strictly prohibited and will result in the immediate revocation of access tokens."
    },
    {
      title: "3. Decentralized Continuous Licensure",
      content: "All licensing agreements generated via our Licensing Agreement Builder are executed directly peer-to-peer or using automated smart contracts. Sovranly IP is a technology facilitator and does not guarantee the legal enforceability of customized agreements in all jurisdictions. Users are encouraged to consult certified intellectual property legal experts before distributing commercially sensitive assets."
    },
    {
      title: "4. Wallet-Based Signatures & Gas Fees",
      content: "On-chain state updates (such as minting sovereign NFT tokens or transferring IP licensing deeds) require cryptographic signature execution. These actions are subject to public blockchain network transaction fees ('gas fees'), which are paid directly to the network. Sovranly IP does not collect, control, or profit from network-level transaction costs."
    },
    {
      title: "5. Intellectual Property Indemnification",
      content: "You agree to indemnify, defend, and hold harmless Sovranly IP, its developers, nodes, and operators from any claims, damages, liabilities, or disputes arising from copyright infringement or ownership conflicts concerning assets you register on our platform."
    },
    {
      title: "6. Continuous Compliance & Service Modifications",
      content: "As a decentralized platform, we reserve the right to upgrade smart contract endpoints, modify storage gateway integrations, or restrict access to corrupted files to safeguard the network's overall integrity. Any changes to service terms will be published directly to this immutable document path."
    }
  ];

  return (
    <div className="min-h-screen bg-black text-zinc-100 font-sans selection:bg-cyan-500/20 selection:text-cyan-300 relative overflow-hidden">
      {/* Visual Accents */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/4 w-[600px] h-[600px] bg-violet-500/5 rounded-full blur-[140px] pointer-events-none" />

      {/* Header */}
      <header className="border-b border-white/10 bg-black/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center justify-between p-6 max-w-5xl mx-auto">
          <Link href="/" className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-mono uppercase tracking-wider">Back to Home</span>
          </Link>
          <div className="flex items-center gap-2 px-3 py-1 bg-cyan-950/40 border border-cyan-800/40 rounded-full text-cyan-400 text-xs font-mono">
            <Terminal className="w-3.5 h-3.5" />
            <span>SECURE TERMINAL</span>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-4xl mx-auto px-6 py-16 md:py-24 space-y-12 relative z-10">
        <div className="space-y-4 text-center">
          <div className="w-16 h-16 bg-cyan-950/40 border border-cyan-500/30 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-cyan-950/50">
            <Shield className="w-8 h-8 text-cyan-400" />
          </div>
          <span className="text-[10px] uppercase font-mono text-cyan-400 tracking-[0.3em] font-black block">Sovranly IP Protocol</span>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter text-white">TERMS OF SERVICE</h1>
          <p className="text-zinc-500 text-xs font-mono">LAST IMMUTABLE UPDATE: {lastUpdated}</p>
        </div>

        {/* Introduction Panel */}
        <div className="p-6 bg-zinc-900/40 border border-zinc-800 rounded-2xl space-y-4">
          <div className="flex items-center gap-2 text-white font-bold">
            <CheckCircle className="w-5 h-5 text-cyan-400" />
            <h3>Agreement to Zero-Trust Terms</h3>
          </div>
          <p className="text-sm text-zinc-400 leading-relaxed">
            Welcome to <span className="text-white font-semibold">Sovranly IP</span>. By connecting your digital signature, mounting secure file buckets, or building continuous licensure deeds on this platform, you agree to comply with and be bound by the following Terms of Service. Please review these protocols thoroughly.
          </p>
          <div className="mt-4 pt-4 border-t border-zinc-800 text-xs text-zinc-500 leading-relaxed">
            <strong className="text-zinc-300 font-mono">Brand Identity Disclaimer:</strong> &quot;Pulse&quot; and &quot;Sovranly IP&quot; are active service marks intended for computer software as a service (SaaS) environments providing intellectual property management and automated royalty distribution. <span className="text-zinc-400 font-semibold">Operated by Creative Sovereignty LLC.</span>
          </div>
        </div>

        {/* Detailed Sections */}
        <div className="space-y-8">
          {sections.map((sec, idx) => (
            <div key={idx} className="space-y-3 border-b border-zinc-900 pb-8 last:border-0 last:pb-0">
              <h2 className="text-lg font-bold text-white flex items-center gap-3">
                <span className="text-cyan-500 text-xs font-mono">[{`0${idx + 1}`}]</span>
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
            Questions regarding our terms of service or consensus rules can be addressed securely to{' '}
            <a href="mailto:create@sovranlyip.com" className="text-cyan-400 hover:underline">
              create@sovranlyip.com
            </a>
          </p>
          <span className="text-[8px] uppercase font-mono text-zinc-700 tracking-[0.2em] font-black block mt-6">
            SOVRANLY IP DEVELOPER PROTOCOLS • VERSION 2.4-SECURE
          </span>
        </div>
      </main>
    </div>
  );
}
