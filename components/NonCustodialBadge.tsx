'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ShieldCheck, Lock, ExternalLink, Info, Check, Copy } from 'lucide-react';
import Link from 'next/link';

interface NonCustodialBadgeProps {
  variant?: 'banner' | 'card' | 'compact' | 'footer-inline';
  className?: string;
}

export default function NonCustodialBadge({
  variant = 'card',
  className = '',
}: NonCustodialBadgeProps) {
  const [showInfo, setShowInfo] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyDisclosure = () => {
    const text =
      'Sovranly IP Non-Custodial Architecture: All digital asset tokenization and rights licensing are initiated directly by clients via self-custodial Web3 wallets. The platform holds zero user private keys, maintains zero fiat or cryptocurrency custody, and does not act as an escrow intermediary. Card and fiat processing on Stripe is exclusively for recurring Software-as-a-Service (SaaS) platform access fees. All secondary sales and royalty splits settle directly peer-to-peer on-chain into the client’s designated wallet address.';
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  if (variant === 'compact' || variant === 'footer-inline') {
    return (
      <div className={`inline-flex items-center gap-3 px-3 py-1.5 rounded-full bg-zinc-950/80 border border-emerald-500/30 backdrop-blur-md shadow-lg shadow-emerald-950/20 text-xs font-mono text-zinc-300 ${className}`}>
        <div className="relative w-6 h-6 rounded-full overflow-hidden border border-emerald-400/40 shrink-0">
          <Image
            src="/non_custodial_badge_1790225510253.jpg"
            alt="Non-Custodial Architecture Verified"
            width={24}
            height={24}
            className="object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-semibold text-white tracking-wide">NON-CUSTODIAL SERVICE</span>
          <span className="text-zinc-500 hidden sm:inline">•</span>
          <span className="text-zinc-400 hidden sm:inline">Direct P2P Settlement</span>
        </div>
        <button
          onClick={() => setShowInfo(!showInfo)}
          title="View Non-Custodial Payment Architecture Disclosure"
          className="text-zinc-400 hover:text-cyan-400 transition-colors p-0.5 rounded cursor-pointer"
        >
          <Info className="w-3.5 h-3.5" />
        </button>

        {showInfo && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-zinc-950 border border-emerald-500/40 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl relative">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl overflow-hidden border border-emerald-500/40 shrink-0">
                  <Image
                    src="/non_custodial_badge_1790225510253.jpg"
                    alt="Verified Non-Custodial Architecture"
                    width={40}
                    height={40}
                    className="object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div>
                  <h4 className="text-white font-bold text-base flex items-center gap-2">
                    Verified Non-Custodial Architecture
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  </h4>
                  <p className="text-zinc-400 text-xs">Payment & Digital Rights Compliance Notice</p>
                </div>
              </div>
              <div className="text-xs text-zinc-300 space-y-2.5 font-sans leading-relaxed border-t border-b border-zinc-800 py-3">
                <p>
                  <strong>SaaS Subscription Only:</strong> Sovranly IP utilizes fiat card rails exclusively to bill recurring Software-as-a-Service (SaaS) and platform tool licensing tiers.
                </p>
                <p>
                  <strong>Zero Platform Custody:</strong> All IP tokenization, master rights registration, and commercial licensing deeds are executed directly by clients via self-custodial Web3 wallets (e.g. MetaMask).
                </p>
                <p>
                  <strong>Direct P2P Settlement:</strong> Proceeds from content licenses and digital rights settle 100% directly between the client and buyer on public blockchain networks. The platform never holds or escrows client funds.
                </p>
              </div>
              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={handleCopyDisclosure}
                  className="flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 transition-colors font-mono cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied Compliance Text' : 'Copy Processor Statement'}
                </button>
                <button
                  onClick={() => setShowInfo(false)}
                  className="px-4 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg text-xs font-semibold cursor-pointer transition-all"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Full / Card variant (ideal for footers & compliance sections)
  return (
    <div className={`w-full max-w-3xl mx-auto rounded-2xl bg-gradient-to-b from-zinc-900/90 to-zinc-950/90 border border-zinc-800/80 hover:border-emerald-500/40 p-5 md:p-6 shadow-xl backdrop-blur-md transition-all relative overflow-hidden group ${className}`}>
      {/* Background ambient glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none group-hover:bg-emerald-500/10 transition-all" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-5">
        {/* Sleek Badge Visual */}
        <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border-2 border-emerald-500/40 shadow-xl shadow-emerald-950/40 shrink-0 group-hover:border-emerald-400 transition-all">
          <Image
            src="/non_custodial_badge_1790225510253.jpg"
            alt="Non-Custodial Architecture Verified"
            fill
            className="object-cover"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Badge Description & Underwriter Clarifications */}
        <div className="flex-1 text-center sm:text-left space-y-2">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono uppercase tracking-wider font-bold flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              Verified Architecture
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-[10px] font-mono uppercase tracking-wider font-bold flex items-center gap-1">
              <Lock className="w-3 h-3 text-cyan-400" />
              Zero Platform Custody
            </span>
          </div>

          <h3 className="text-white text-base md:text-lg font-bold tracking-tight">
            Non-Custodial Service & Direct P2P Settlement
          </h3>

          <p className="text-zinc-400 text-xs leading-relaxed">
            Sovranly IP is a software-as-a-service (SaaS) provider. Card payments on this platform strictly bill software tooling subscriptions. All blockchain tokenization and intellectual property licensing are executed client-side via self-custodial Web3 wallets. 100% of licensing proceeds flow directly peer-to-peer into the creator’s wallet with zero intermediary custody.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs font-mono">
            <Link
              href="/terms"
              className="text-cyan-400 hover:text-cyan-300 inline-flex items-center gap-1 transition-colors"
            >
              Terms of Service Section 1 & 4
              <ExternalLink className="w-3 h-3" />
            </Link>
            <span className="text-zinc-700 hidden sm:inline">•</span>
            <button
              onClick={handleCopyDisclosure}
              className="text-zinc-400 hover:text-white inline-flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied Compliance Text' : 'Copy Underwriter Statement'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
