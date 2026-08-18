'use client';

import React from 'react';
import { 
  Globe, 
  DollarSign, 
  BookOpen, 
  ShieldCheck, 
  FileText, 
  HelpCircle, 
  Layers, 
  ExternalLink, 
  Sparkles, 
  X, 
  Compass, 
  Cpu,
  BadgeCheck
} from 'lucide-react';
import Link from 'next/link';

interface PublicPagesHamburgerMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PublicPagesHamburgerMenu({ isOpen, onClose }: PublicPagesHamburgerMenuProps) {
  if (!isOpen) return null;

  const publicPages = [
    {
      title: "Transparent Pricing & Tiers",
      path: "/pricing",
      description: "Complete public disclosure of Sovranly IP subscription tiers, creator royalty splits (85/15), and zero-trust verification fees.",
      icon: <DollarSign className="w-5 h-5 text-emerald-400" />,
      tag: "Public Pricing"
    },
    {
      title: "Public IP Marketplace",
      path: "/marketplace",
      description: "Explore verified creator master recordings, digital artwork, and software licenses available for instant sync licensing.",
      icon: <Layers className="w-5 h-5 text-cyan-400" />,
      tag: "Marketplace"
    },
    {
      title: "About Sovranly IP & Mission",
      path: "/about",
      description: "Our vision for empowering creators, eliminating AI scraping, and securing zero-trust blockchain music & art rights.",
      icon: <Globe className="w-5 h-5 text-blue-400" />,
      tag: "Company"
    },
    {
      title: "Knowledge Wiki & Technical Docs",
      path: "/wiki",
      description: "Deep dive into cryptographic notarization, smart contract split protocols, and Zero Trust IP architecture.",
      icon: <BookOpen className="w-5 h-5 text-violet-400" />,
      tag: "Documentation"
    },
    {
      title: "Public FAQ & Disclosures",
      path: "/faq",
      description: "Frequently asked questions regarding PRO royalties, sync fees, ownership guarantees, and platform transparency.",
      icon: <HelpCircle className="w-5 h-5 text-amber-400" />,
      tag: "Support & FAQ"
    },
    {
      title: "Terms of Service & Sync Agreements",
      path: "/terms",
      description: "Legally binding sync license agreement templates, warranties, prohibited uses, and delivery specifications.",
      icon: <FileText className="w-5 h-5 text-rose-400" />,
      tag: "Legal & Compliance"
    },
    {
      title: "Privacy Policy & Zero Trust Standards",
      path: "/privacy",
      description: "Data privacy practices, encrypted vault storage, and GDPR/CCPA compliance commitments.",
      icon: <ShieldCheck className="w-5 h-5 text-teal-400" />,
      tag: "Security"
    },
    {
      title: "Interactive Founder Pitch Deck",
      path: "/pitch-deck",
      description: "Investor presentation detailing market size, creator traction, and automated royalty smart contract architecture.",
      icon: <Sparkles className="w-5 h-5 text-yellow-400" />,
      tag: "Investor Relations"
    },
    {
      title: "Zero Trust IP Whitepaper",
      path: "/funnel/whitepaper",
      description: "Academic and technical whitepaper on decentralized intellectual property verification and anti-AI scraping defense.",
      icon: <Cpu className="w-5 h-5 text-indigo-400" />,
      tag: "Whitepaper"
    }
  ];

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/85 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-3xl bg-zinc-950 border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-6 border-b border-zinc-900 flex items-center justify-between bg-zinc-900/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-950/60 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-inner">
              <Compass className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                Public Pages &amp; Pricing Directory
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-500/30">
                  Fully Disclosed
                </span>
              </h2>
              <p className="text-xs text-zinc-400 font-mono mt-0.5">
                Direct access to all public information, pricing disclosures, legal terms, and documentation.
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
            aria-label="Close directory"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3 custom-scrollbar">
          <div className="bg-gradient-to-r from-cyan-950/30 via-zinc-900/40 to-emerald-950/30 border border-cyan-500/20 p-4 rounded-2xl flex items-start gap-3">
            <BadgeCheck className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
            <div className="text-xs text-zinc-300 leading-relaxed space-y-1">
              <p className="font-semibold text-white">Transparency Guarantee for Visitors &amp; Web Scanners</p>
              <p className="text-zinc-400">
                All pricing tiers, legal terms, split protocols, and creator assets are fully public and accessible below without requiring authentication.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
            {publicPages.map((page, idx) => (
              <Link
                key={idx}
                href={page.path}
                onClick={onClose}
                className="group p-4 bg-zinc-900/40 hover:bg-zinc-900 border border-zinc-800 hover:border-cyan-500/40 rounded-2xl transition-all duration-200 flex flex-col justify-between shadow-sm hover:shadow-md"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="p-2 rounded-xl bg-zinc-950 border border-zinc-800 group-hover:border-cyan-500/30 transition-colors">
                      {page.icon}
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 group-hover:bg-cyan-950/50 group-hover:text-cyan-300 transition-colors">
                      {page.tag}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-white group-hover:text-cyan-400 transition-colors flex items-center justify-between">
                    {page.title}
                    <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-cyan-400" />
                  </h3>
                  <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed">
                    {page.description}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-zinc-800/60 flex items-center justify-between text-[11px] font-mono text-cyan-400">
                  <span className="truncate">{page.path}</span>
                  <span className="font-bold underline group-hover:translate-x-0.5 transition-transform">Visit Page &rarr;</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-zinc-900 bg-zinc-900/60 flex items-center justify-between text-xs text-zinc-500 font-mono">
          <span>Sovranly IP Zero Trust Public Index</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold rounded-xl transition-colors cursor-pointer"
          >
            Close Directory
          </button>
        </div>

      </div>
    </div>
  );
}
