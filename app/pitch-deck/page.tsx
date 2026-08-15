'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  ShieldCheck, 
  ArrowLeft, 
  ArrowRight, 
  Sparkles, 
  Presentation, 
  Lock, 
  Zap, 
  FileText, 
  Database, 
  CheckCircle2, 
  ChevronLeft, 
  ChevronRight, 
  Download, 
  ExternalLink,
  Layers,
  Sliders,
  DollarSign,
  Globe,
  Cpu
} from 'lucide-react';
import { SovranlyLogo } from '@/components/SovranlyLogo';
import { useLanguage } from '@/components/LanguageProvider';
import LanguageSelector from '@/components/LanguageSelector';
import { motion, AnimatePresence } from 'motion/react';

// Pitch Deck Slides Data
const PITCH_SLIDES = [
  {
    id: 1,
    tagline: "EXECUTIVE SUMMARY",
    title: "Sovranly IP: Sovereign Intellectual Property System",
    subtitle: "Empowering Creators with Zero Trust Architecture & Automated Smart Contract Royalties",
    category: "The Vision",
    highlights: [
      "Zero Trust cryptographic ownership registration",
      "Autonomous peer-to-peer sync licensing & micro-royalties",
      "Seamless Google Slides & Workspace integration",
      "Immutable blockchain audit trail on Ethereum & L2 networks"
    ],
    bgGradient: "from-cyan-950/40 via-zinc-950 to-zinc-950",
    accentColor: "text-cyan-400"
  },
  {
    id: 2,
    tagline: "THE PROBLEM",
    title: "The Creative Economy is Broken by Intermediaries",
    subtitle: "Creators lose 30-50% of revenue to legacy brokers, opaque royalty accounting, and unauthorized AI scraping.",
    category: "Market Pain Points",
    highlights: [
      "Delayed royalty disbursements (6 to 18-month accounting cycles)",
      "Rampant unauthorized AI model training on copyrighted master recordings and codebases",
      "Opaque sync licensing negotiations with zero transparency for co-writers and producers",
      "Fragmented proof of authorship lacking cryptographically verifiable timestamping"
    ],
    bgGradient: "from-violet-950/40 via-zinc-950 to-zinc-950",
    accentColor: "text-violet-400"
  },
  {
    id: 3,
    tagline: "THE SOLUTION",
    title: "Zero Trust Architecture & Cryptographic Proof",
    subtitle: "Every asset is permanently anchored on-chain with SHA-256 fingerprints and IPFS decentralized content addressing.",
    category: "Platform Mechanics",
    highlights: [
      "SHA-256 cryptographic fingerprinting of audio stems, codebases, and media assets",
      "Immutable IPFS decentralized storage ensuring zero single points of failure",
      "Continuous Zero Trust authentication for all API access and smart contract triggers",
      "Instantaneous verification portals enabling anyone to validate asset authenticity"
    ],
    bgGradient: "from-blue-950/40 via-zinc-950 to-zinc-950",
    accentColor: "text-blue-400"
  },
  {
    id: 4,
    tagline: "SYNC AGREEMENT TERMS",
    title: "Standardized Sync & Licensing Protocols",
    subtitle: "Pre-vetted legal compacts protecting Licensors and Licensees across global media markets.",
    category: "Legal & Compliance",
    highlights: [
      "Composition & Master Recording dual-rights grant definition",
      "Flexible terms: 1-year, 3-year, 5-year, or 'Life of Copyright' buyouts",
      "Worldwide or territory-restricted media exploitation rights (SVOD, Theatrical, Broadcast)",
      "Explicit prohibitions against hate speech, tobacco, and unauthorized alterations"
    ],
    bgGradient: "from-emerald-950/40 via-zinc-950 to-zinc-950",
    accentColor: "text-emerald-400"
  },
  {
    id: 5,
    tagline: "AUTOMATED SPLIT PROTOCOLS",
    title: "Instant Micro-Royalty Distribution via Smart Contracts",
    subtitle: "Incoming sync fees and performance royalties are split autonomously among co-writers, producers, and rights holders.",
    category: "Financial Infrastructure",
    highlights: [
      "Zero-delay escrow contracts distributing funds instantly upon full agreement execution",
      "Separation of flat sync buyout fees from PRO (ASCAP/BMI/PRS) public performance royalties",
      "Transparent on-chain ledger auditing every transaction with cryptographically verifiable proofs",
      "Customizable fractional ownership percentages configurable per asset"
    ],
    bgGradient: "from-amber-950/40 via-zinc-950 to-zinc-950",
    accentColor: "text-amber-400"
  },
  {
    id: 6,
    tagline: "WORKSPACE INTEGRATION",
    title: "Export & Present Directly via Google Slides",
    subtitle: "Seamlessly compile verified IP certificates and licensing decks into professional Google Presentations.",
    category: "Ecosystem Integration",
    highlights: [
      "One-click slide generation populated with live asset metadata and IPFS CIDs",
      "Direct Google Drive synchronization for instant client pitch deck deployment",
      "Secure OAuth authentication protecting creator workspace data with Zero Trust strictness",
      "Embedded preview canvas allowing real-time inspection before client presentation"
    ],
    bgGradient: "from-cyan-950/40 via-zinc-950 to-zinc-950",
    accentColor: "text-cyan-400"
  },
  {
    id: 7,
    tagline: "MARKET OPPORTUNITY",
    title: "Capturing the $65B+ Creator & IP Licensing Market",
    subtitle: "Positioned at the intersection of digital asset management, blockchain security, and automated media licensing.",
    category: "Growth & Vision",
    highlights: [
      "$65B+ Total Addressable Market across music sync, software licensing, and digital art",
      "Rapid adoption by independent artists, game studios, and advertising agencies",
      "Scalable SaaS subscription tiers paired with smart contract transaction fees",
      "Join the sovereign revolution: Empowering true creative ownership"
    ],
    bgGradient: "from-purple-950/40 via-zinc-950 to-zinc-950",
    accentColor: "text-purple-400"
  }
];

export default function PitchDeckPage() {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const { t } = useLanguage();

  const currentSlide = PITCH_SLIDES[currentSlideIndex];

  const handleNext = () => {
    if (currentSlideIndex < PITCH_SLIDES.length - 1) {
      setCurrentSlideIndex(prev => prev + 1);
    } else {
      setCurrentSlideIndex(0); // loop back
    }
  };

  const handlePrev = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(prev => prev - 1);
    } else {
      setCurrentSlideIndex(PITCH_SLIDES.length - 1); // wrap around
    }
  };

  return (
    <div className="min-h-screen bg-black text-zinc-100 font-sans selection:bg-cyan-500/20 selection:text-cyan-300">
      {/* Background Ambient Glows */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-[600px] h-[600px] bg-violet-500/5 rounded-full blur-[140px] pointer-events-none" />

      {/* Navigation Header */}
      <nav className="border-b border-zinc-900 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-zinc-950 border border-cyan-500/30 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-950/20">
              <ShieldCheck className="w-5 h-5 text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.4)]" />
            </div>
            <div className="flex flex-col">
              <Link href="/" className="font-bold tracking-tight text-white uppercase text-base hover:text-cyan-400 transition-colors">Sovranly IP</Link>
              <span className="text-[10px] uppercase font-mono text-cyan-400 tracking-widest">Investor Pitch Deck</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Button asChild variant="outline" className="border-zinc-800 bg-transparent text-zinc-300 hover:text-white hover:bg-zinc-900 rounded-full text-xs">
              <Link href="/" className="flex items-center gap-1.5">
                <ArrowLeft className="w-3.5 h-3.5" /> Return Home
              </Link>
            </Button>
            <Button asChild className="bg-gradient-to-r from-cyan-500 to-violet-500 hover:brightness-110 text-white rounded-full text-xs font-semibold px-5">
              <Link href="/dashboard" className="flex items-center gap-1.5">
                Launch Console <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Pitch Deck Viewer Container */}
      <main className="max-w-6xl mx-auto px-6 py-12 md:py-16 space-y-10 relative z-10">
        
        {/* Title Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-zinc-900 border border-cyan-500/30 text-cyan-400 text-xs font-mono uppercase tracking-widest shadow-lg shadow-cyan-950/20">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Interactive Series A &amp; Creator Pitch Deck</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white uppercase">
            The <span className="text-cyan-400">Sovranly IP</span> Deck
          </h1>
          <p className="text-zinc-400 text-base sm:text-lg font-light leading-relaxed">
            Explore our comprehensive vision for sovereign intellectual property management, zero trust security, and automated smart contract royalty distributions.
          </p>
        </div>

        {/* Interactive Slide Viewer Canvas */}
        <div className="relative">
          <Card className="bg-zinc-950 border border-zinc-800/80 rounded-3xl overflow-hidden shadow-2xl shadow-cyan-950/20 backdrop-blur-md">
            
            {/* Slide Header Toolbar */}
            <div className="border-b border-zinc-900 px-6 py-4 flex items-center justify-between bg-zinc-900/40">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]" />
                <span className="text-xs font-mono uppercase tracking-widest text-zinc-400">
                  Slide {currentSlide.id} of {PITCH_SLIDES.length} — <span className="text-white font-bold">{currentSlide.category}</span>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  asChild
                  variant="outline" 
                  size="sm" 
                  className="h-8 text-xs font-mono bg-zinc-900 border-zinc-800 text-cyan-400 hover:bg-zinc-800"
                >
                  <Link href="/dashboard" className="flex items-center gap-1.5">
                    <ExternalLink className="w-3.5 h-3.5" /> Sync to Google Slides
                  </Link>
                </Button>
              </div>
            </div>

            {/* Slide Content Box with AnimatePresence */}
            <div className="p-8 sm:p-14 md:p-16 min-h-[460px] flex flex-col justify-between bg-gradient-to-br from-zinc-950 via-zinc-950 to-zinc-900">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSlide.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="space-y-8"
                >
                  {/* Tagline */}
                  <div className="space-y-2">
                    <p className={`text-xs font-mono font-extrabold uppercase tracking-widest ${currentSlide.accentColor}`}>
                      {currentSlide.tagline}
                    </p>
                    <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
                      {currentSlide.title}
                    </h2>
                    <p className="text-base sm:text-xl text-zinc-300 font-light max-w-3xl leading-relaxed pt-2">
                      {currentSlide.subtitle}
                    </p>
                  </div>

                  {/* Highlights Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                    {currentSlide.highlights.map((highlight, idx) => (
                      <div key={idx} className="p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800/80 flex items-start gap-3 shadow-inner">
                        <div className="p-1 rounded-full bg-cyan-500/10 text-cyan-400 shrink-0 mt-0.5">
                          <CheckCircle2 className="w-4 h-4" />
                        </div>
                        <span className="text-xs sm:text-sm text-zinc-300 font-medium leading-relaxed">
                          {highlight}
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Slide Footer Navigation Controls inside Card */}
              <div className="border-t border-zinc-900 pt-8 mt-12 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-1.5">
                  {PITCH_SLIDES.map((slide, idx) => (
                    <button
                      key={slide.id}
                      onClick={() => setCurrentSlideIndex(idx)}
                      className={`h-2 rounded-full transition-all cursor-pointer ${
                        currentSlideIndex === idx ? 'w-8 bg-cyan-400 shadow-[0_0_8px_#22d3ee]' : 'w-2 bg-zinc-800 hover:bg-zinc-600'
                      }`}
                      aria-label={`Go to slide ${slide.id}`}
                    />
                  ))}
                </div>

                <div className="flex items-center gap-3">
                  <Button
                    onClick={handlePrev}
                    variant="outline"
                    className="border-zinc-800 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl px-4 py-2 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" /> Previous Slide
                  </Button>
                  <Button
                    onClick={handleNext}
                    className="bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold rounded-xl px-6 py-2 text-xs flex items-center gap-1.5 cursor-pointer shadow-lg shadow-cyan-500/20"
                  >
                    Next Slide <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>

            </div>

          </Card>
        </div>

        {/* Quick Thumbnail Navigation Grid */}
        <section className="space-y-6 pt-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-mono text-zinc-400 uppercase tracking-widest">
              Slide Index Overview ({PITCH_SLIDES.length} Modules)
            </h3>
            <span className="text-xs font-mono text-cyan-400 font-bold">
              Click any slide to jump directly
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {PITCH_SLIDES.map((slide, idx) => (
              <button
                key={slide.id}
                onClick={() => setCurrentSlideIndex(idx)}
                className={`p-4 rounded-2xl border text-left transition-all duration-300 cursor-pointer flex flex-col justify-between space-y-3 ${
                  currentSlideIndex === idx 
                    ? 'bg-zinc-900 border-cyan-500/60 shadow-lg shadow-cyan-950/30' 
                    : 'bg-zinc-950/60 border-zinc-900 hover:bg-zinc-900/40 hover:border-zinc-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-zinc-950 border border-zinc-800 text-zinc-400">
                    SLIDE 0{slide.id}
                  </span>
                  {currentSlideIndex === idx && (
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_6px_#22d3ee]" />
                  )}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white uppercase line-clamp-1 mb-1">{slide.title}</h4>
                  <p className="text-[10px] text-zinc-500 line-clamp-2">{slide.subtitle}</p>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Call to Action Banner */}
        <section className="bg-gradient-to-r from-cyan-950/40 via-zinc-900/80 to-violet-950/40 border border-cyan-500/30 rounded-3xl p-8 md:p-12 text-center space-y-6 shadow-2xl">
          <div className="w-12 h-12 bg-cyan-500/10 border border-cyan-500/30 rounded-2xl flex items-center justify-center mx-auto text-cyan-400 shadow-lg">
            <Sparkles className="w-6 h-6" />
          </div>
          <div className="space-y-2 max-w-2xl mx-auto">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight uppercase">
              Ready to Secure Your Intellectual Property?
            </h3>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Join creators worldwide using Sovranly IP to register assets, configure secure licensing compacts, and export decks directly to Google Slides.
            </p>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-4 pt-2">
            <Button asChild size="lg" className="rounded-full bg-gradient-to-r from-cyan-500 to-violet-500 text-white font-bold text-xs uppercase px-8 py-6 shadow-lg shadow-cyan-950/50 hover:brightness-110">
              <Link href="/dashboard">Launch Sovereign Console <ArrowRight className="ml-2 w-4 h-4" /></Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-full border-zinc-800 bg-zinc-950 text-white hover:bg-zinc-900 font-bold text-xs uppercase px-8 py-6">
              <Link href="/marketplace">Explore Marketplace</Link>
            </Button>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 bg-zinc-950/60 relative z-10 flex flex-col items-center justify-center gap-6 text-center mt-20">
        <LanguageSelector />
        <div className="flex flex-wrap items-center justify-center gap-4 text-zinc-500 text-xs px-4">
          <Link href="/pitch-deck" className="text-cyan-400 font-medium transition-colors">Pitch Deck</Link>
          <span>•</span>
          <Link href="/about" className="hover:text-cyan-400 transition-colors">About Us</Link>
          <span>•</span>
          <Link href="/terms" className="hover:text-cyan-400 transition-colors">Terms of Service</Link>
          <span>•</span>
          <Link href="/privacy" className="hover:text-cyan-400 transition-colors">Privacy Policy</Link>
        </div>
        <p className="text-zinc-600 text-xs">{t('copyright') || '© 2026 Sovranly IP. Sovereign intellectual property systems. Zero Trust Secured.'}</p>
      </footer>
    </div>
  );
}
