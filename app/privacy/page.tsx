'use client';

import { useState, useEffect } from 'react';
import { 
  Lock, 
  FileText, 
  ArrowLeft, 
  Terminal, 
  ShieldAlert, 
  ShieldCheck, 
  RefreshCw, 
  Layers, 
  Check, 
  Database, 
  Globe, 
  Cpu, 
  Eye, 
  UserCheck, 
  Server, 
  AlertCircle, 
  Mail, 
  HelpCircle,
  ExternalLink,
  ChevronRight,
  ChevronDown,
  Sparkles,
  Trash2,
  Key,
  Download,
  Scale,
  HardDrive,
  Shield
} from 'lucide-react';
import Link from 'next/link';
import ThemeToggle from '@/components/ThemeToggle';

interface ConsentReceipt {
  hash: string;
  timestamp: string;
  essentials: boolean;
  analytics: boolean;
  preferences: boolean;
}

export default function PrivacyPolicy() {
  const lastUpdated = "September 4, 2026";
  const effectiveDate = "January 15, 2026";
  const [receipt, setReceipt] = useState<ConsentReceipt | null>(null);
  const [activeTab, setActiveTab] = useState<string>('all');
  const [expandedFaqs, setExpandedFaqs] = useState<Record<string, boolean>>({
    'faq-metadata': true,
    'faq-wallets': true,
    'faq-blockchain-gdpr': true,
    'faq-subprocessors': false,
    'faq-anti-scraping': false,
    'faq-exercise-rights': false,
  });

  const toggleFaq = (id: string) => {
    setExpandedFaqs(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const expandAllFaqs = () => {
    setExpandedFaqs({
      'faq-metadata': true,
      'faq-wallets': true,
      'faq-blockchain-gdpr': true,
      'faq-subprocessors': true,
      'faq-anti-scraping': true,
      'faq-exercise-rights': true,
    });
  };

  const collapseAllFaqs = () => {
    setExpandedFaqs({
      'faq-metadata': false,
      'faq-wallets': false,
      'faq-blockchain-gdpr': false,
      'faq-subprocessors': false,
      'faq-anti-scraping': false,
      'faq-exercise-rights': false,
    });
  };

  useEffect(() => {
    // Read current consent receipt state dynamically
    const updateReceipt = () => {
      if (typeof window === 'undefined') return;
      const stored = localStorage.getItem('sovranly_cookie_consent_receipt');
      if (stored) {
        try {
          setReceipt(JSON.parse(stored));
        } catch {
          setReceipt(null);
        }
      } else {
        setReceipt(null);
      }
    };

    updateReceipt();
    const interval = setInterval(updateReceipt, 1500);
    return () => clearInterval(interval);
  }, []);

  const handlePurgeAndReset = () => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('sovranly_cookie_consent_receipt');
    document.cookie = 'sovranly_essential_consent=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    document.cookie = 'sovranly_analytics_consent=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    document.cookie = 'sovranly_preferences_consent=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    setReceipt(null);
    alert('Sovereign consent receipt and compliance cookies successfully purged. Reloading configuration...');
    window.location.reload();
  };

  const tableOfContents = [
    { id: 'summary', title: 'Executive Summary & Privacy Pillars' },
    { id: 'google-data', title: '1. Google API Services User Data Policy & Limited Use' },
    { id: 'collection', title: '2. Information We Collect (Detailed Taxonomy & Vectors)' },
    { id: 'ccpa-statutory', title: '3. CCPA/CPRA Statutory Notice at Collection & Disclosures' },
    { id: 'usage', title: '4. How We Use and Process Your Data (Comprehensive Purpose Matrix)' },
    { id: 'ai-processing', title: '5. Artificial Intelligence (AI) & Machine Learning Usage' },
    { id: 'legal-basis', title: '6. Legal Bases for Processing & Non-Profiling (GDPR Arts. 6, 9 & 22)' },
    { id: 'subprocessors', title: '7. Third-Party Subprocessors & Service Providers' },
    { id: 'blockchain', title: '8. Blockchain Immutability & Public Ledger Disclosures' },
    { id: 'sharing', title: '9. Information Sharing & Zero Data Monetization' },
    { id: 'storage-architecture', title: '10. Data Storage Topology & Technical Security Measures (TOMs - Art. 32)' },
    { id: 'retention', title: '11. Data Retention, Archival & Deletion Schedules' },
    { id: 'deletion-revocation', title: '12. Data Deletion, Export & Google Access Revocation Guide' },
    { id: 'rights', title: '13. Your Statutory Rights & Recourse (GDPR Arts. 15-22 & CCPA/CPRA)' },
    { id: 'security', title: '14. Zero Trust Cryptographic Security & Breach Protocols (GDPR Arts. 33-34)' },
    { id: 'transfers', title: '15. International Transfers & Cross-Border Safeguards (SCCs & DPF)' },
    { id: 'children', title: '16. Children’s Online Privacy Protections (COPPA & GDPR Art. 8)' },
    { id: 'audit-ledger', title: '17. Storage & Cookie Governance Matrix' },
    { id: 'privacy-faq', title: '18. Data & Privacy Frequently Asked Questions (FAQ)' },
    { id: 'contact', title: '19. Contact Information & Data Protection Officer' },
  ];

  return (
    <div className="min-h-screen bg-black text-zinc-100 font-sans selection:bg-cyan-500/20 selection:text-cyan-300 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 right-1/4 w-[550px] h-[550px] bg-violet-500/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/3 left-1/4 w-[650px] h-[650px] bg-cyan-500/5 rounded-full blur-[160px] pointer-events-none" />

      {/* Top Header Navigation */}
      <header className="border-b border-white/10 bg-black/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center justify-between p-4 md:p-6 max-w-6xl mx-auto">
          <Link href="/" className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-mono uppercase tracking-wider font-semibold">Back to Home</span>
          </Link>
          <div className="flex items-center gap-3">
            <ThemeToggle showLabel={false} />
            <div className="flex items-center gap-2 px-3 py-1 bg-violet-950/40 border border-violet-800/40 rounded-full text-violet-400 text-xs font-mono">
              <Terminal className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">ZERO TRUST PRIVACY PROTOCOL</span>
              <span className="sm:hidden">SECURE</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-12 md:py-20 space-y-16 relative z-10">
        
        {/* Title & Metadata Hero */}
        <div className="space-y-6 text-center max-w-3xl mx-auto">
          <div className="w-16 h-16 bg-violet-950/40 border border-violet-500/30 rounded-2xl flex items-center justify-center mx-auto shadow-xl shadow-violet-950/50">
            <Lock className="w-8 h-8 text-violet-400" />
          </div>
          <div className="space-y-2">
            <span className="text-[11px] uppercase font-mono text-cyan-400 tracking-[0.25em] font-black block">
              Sovereign Intellectual Property Authority
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white uppercase">
              Privacy Policy & Data Usage Disclosures
            </h1>
          </div>
          <p className="text-sm text-zinc-400 leading-relaxed max-w-2xl mx-auto">
            This comprehensive Privacy Policy transparently explains how <span className="text-white font-semibold">Sovranly IP</span> collects, utilizes, safeguards, retains, and disseminates user information across our decentralized intellectual property management suite, smart contract infrastructure, and web applications.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 text-[11px] font-mono text-zinc-500 pt-2">
            <span className="px-3 py-1 bg-zinc-900/80 border border-zinc-800 rounded-lg">EFFECTIVE: {effectiveDate}</span>
            <span className="px-3 py-1 bg-zinc-900/80 border border-zinc-800 rounded-lg">LAST MODIFIED: {lastUpdated}</span>
            <span className="px-3 py-1 bg-emerald-950/40 border border-emerald-800/40 text-emerald-400 rounded-lg font-semibold flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" /> GDPR &amp; CCPA/CPRA COMPLIANT
            </span>
          </div>
        </div>

        {/* Quick Navigation Drawer / Card */}
        <div className="p-6 bg-zinc-900/40 border border-zinc-800/80 rounded-2xl space-y-4 shadow-lg">
          <div className="flex items-center gap-2 text-white font-bold text-sm">
            <Layers className="w-4 h-4 text-cyan-400" />
            <h3>Table of Contents & Quick Navigation</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs font-mono">
            {tableOfContents.map((item, idx) => (
              <a
                key={idx}
                href={`#${item.id}`}
                className="p-2 rounded-lg bg-zinc-950/50 hover:bg-zinc-800/60 border border-zinc-900 hover:border-cyan-500/30 text-zinc-300 hover:text-white transition-all flex items-center justify-between group"
              >
                <span className="truncate">{item.title}</span>
                <ChevronRight className="w-3.5 h-3.5 text-zinc-600 group-hover:text-cyan-400 transition-colors flex-shrink-0 ml-1" />
              </a>
            ))}
          </div>
        </div>

        {/* SECTION: Executive Summary */}
        <section id="summary" className="space-y-6">
          <div className="border-b border-zinc-900 pb-3 flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight flex items-center gap-2.5">
              <span className="text-cyan-400 text-sm font-mono">[00]</span> Executive Summary &amp; Core Privacy Pillars
            </h2>
          </div>
          
          <p className="text-sm text-zinc-300 leading-relaxed">
            At Sovranly IP, our architectural foundation is built on <strong>Zero Trust</strong> and <strong>Cryptographic Data Minimization</strong>. Unlike legacy media distributor platforms that harvest and commercialize personal user data, Sovranly IP is engineered so that creators maintain sovereign ownership and continuous control over their intellectual assets.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 bg-zinc-950/70 border border-zinc-900 rounded-2xl space-y-2">
              <div className="w-8 h-8 rounded-lg bg-cyan-950/40 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-white">No Data Monetization</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                We do not sell, license, rent, or trade your personal data, catalog items, or contact lists to data brokers or AI scraping crawlers.
              </p>
            </div>

            <div className="p-5 bg-zinc-950/70 border border-zinc-900 rounded-2xl space-y-2">
              <div className="w-8 h-8 rounded-lg bg-violet-950/40 border border-violet-500/30 flex items-center justify-center text-violet-400">
                <Lock className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-white">Non-Custodial Security</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                We never prompt for or store private keys or wallet seed phrases. You hold sole cryptographic possession of your Web3 signing credentials.
              </p>
            </div>

            <div className="p-5 bg-zinc-950/70 border border-zinc-900 rounded-2xl space-y-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Database className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-white">Auditable Transparency</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Every consent vector, cookie signature, and on-chain royalty execution is recorded with verifiable, auditable timestamps.
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 1: Google API Services User Data Policy & Limited Use Disclosure */}
        <section id="google-data" className="space-y-6">
          <div className="border-b border-zinc-900 pb-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight flex items-center gap-2.5">
                <span className="text-cyan-400 text-sm font-mono">[01]</span> Google API Services User Data Policy &amp; Limited Use Disclosure
              </h2>
              <p className="text-xs text-zinc-500 font-mono mt-1">
                Mandatory disclosure regarding access, handling, storage, and transfer of Google user data.
              </p>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-cyan-950/40 border border-cyan-500/30 text-cyan-400 rounded-full text-[11px] font-mono whitespace-nowrap self-start sm:self-auto">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>GOOGLE OAUTH COMPLIANCE</span>
            </div>
          </div>

          <div className="space-y-4 text-xs text-zinc-300 leading-relaxed">
            <p>
              Sovranly IP integrates with Google Identity Services and Google OAuth 2.0 (via Firebase Authentication and Google Cloud Platform) to offer secure, passwordless authentication and continuous creator identity verification. We maintain strict compliance with Google&apos;s developer ecosystem policies.
            </p>

            {/* Prominent Limited Use Box */}
            <div className="p-5 bg-zinc-950/80 border-2 border-cyan-500/40 rounded-2xl space-y-3 shadow-xl shadow-cyan-950/20">
              <div className="flex items-center gap-2 text-cyan-300 font-bold text-sm">
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                <h3>Google API Limited Use Requirements Compliance Statement</h3>
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed font-sans">
                <strong>Sovranly IP&apos;s use and transfer of information received from Google APIs to any other app will adhere to the <a href="https://developers.google.com/terms/api-services-user-data-policy" target="_blank" rel="noopener noreferrer" className="text-cyan-400 underline hover:text-cyan-300 font-semibold inline-flex items-center gap-0.5">Google API Services User Data Policy <ExternalLink className="w-3 h-3 inline" /></a>, including the Limited Use requirements.</strong>
              </p>
            </div>

            {/* Specific Google User Data Accessed & Handled */}
            <div className="p-5 bg-zinc-950/60 border border-zinc-900 rounded-2xl space-y-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-cyan-400" />
                <span>Specific Google User Data Accessed, Collected &amp; Processed</span>
              </h3>
              <p className="text-xs text-zinc-400">
                When you choose to sign in to Sovranly IP with your Google Account, we request only the minimal necessary OAuth scopes (<code>openid</code>, <code>profile</code>, and <code>email</code>). Specifically, we access and process:
              </p>
              <ul className="list-disc list-inside text-xs text-zinc-400 space-y-1.5 leading-relaxed pl-1">
                <li><strong className="text-zinc-200">Google Account Primary Email Address:</strong> Used to uniquely identify your creator account, verify rights ownership, prevent duplicate accounts, and send vital transactional notifications (royalty payouts, smart contract deployments, and licensing disputes).</li>
                <li><strong className="text-zinc-200">Basic Profile Information:</strong> Display name, given name, family name, and profile picture avatar URL. Used to personalize your creator profile interface and attribute intellectual property registrations.</li>
                <li><strong className="text-zinc-200">Google User Unique Identifier (sub / UID):</strong> An immutable unique string generated by Google that securely ties your session tokens and database records to your verified identity across logins.</li>
                <li><strong className="text-zinc-200">OAuth Access &amp; Refresh Tokens:</strong> Short-lived cryptographic tokens issued during sign-in, used exclusively to validate active sessions under our Zero Trust security model.</li>
              </ul>
            </div>

            {/* How We Use Google User Data */}
            <div className="p-5 bg-zinc-950/60 border border-zinc-900 rounded-2xl space-y-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Cpu className="w-4 h-4 text-violet-400" />
                <span>Purposes of Google User Data Processing</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-zinc-400">
                <div className="p-3 bg-zinc-900/40 rounded-xl border border-zinc-900 space-y-1">
                  <span className="font-bold text-white block">1. Authentication &amp; Session Verification</span>
                  <p>Authenticating your identity securely without requiring or storing passwords on our servers, preventing credential stuffing attacks.</p>
                </div>
                <div className="p-3 bg-zinc-900/40 rounded-xl border border-zinc-900 space-y-1">
                  <span className="font-bold text-white block">2. Intellectual Property Rights Attribution</span>
                  <p>Associating your verified creator identity with registered track catalogs, digital split sheets, and autonomous licensing contracts.</p>
                </div>
                <div className="p-3 bg-zinc-900/40 rounded-xl border border-zinc-900 space-y-1">
                  <span className="font-bold text-white block">3. Transactional &amp; Royalty Alerts</span>
                  <p>Dispatching automated electronic notices regarding completed royalty payouts, license purchase agreements, or counter-claims.</p>
                </div>
                <div className="p-3 bg-zinc-900/40 rounded-xl border border-zinc-900 space-y-1">
                  <span className="font-bold text-white block">4. Zero Trust Security &amp; Anti-Abuse Defense</span>
                  <p>Detecting bot networks, preventing sybil account generation, and defending our decentralized licensing registry from unauthorized tampering.</p>
                </div>
              </div>
            </div>

            {/* Strict Safeguards & Prohibitions Matrix */}
            <div className="p-5 bg-zinc-950/60 border border-zinc-900 rounded-2xl space-y-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Lock className="w-4 h-4 text-emerald-400" />
                <span>Strict Safeguards &amp; Prohibitions on Google User Data</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-zinc-400">
                <div className="p-3 bg-zinc-900/50 rounded-xl border border-zinc-900 space-y-1">
                  <span className="font-bold text-emerald-400 block">NO AI/ML Model Training</span>
                  <p>We do <strong>NOT</strong> use Google user data to train, retrain, fine-tune, or improve generalized artificial intelligence (AI), machine learning (ML), or large language models (LLMs).</p>
                </div>
                <div className="p-3 bg-zinc-900/50 rounded-xl border border-zinc-900 space-y-1">
                  <span className="font-bold text-emerald-400 block">NO Sale, Lease or Data Brokering</span>
                  <p>We do <strong>NOT</strong> sell, rent, lease, or transfer Google user data to third-party data brokers, marketing intermediaries, or ad platforms under any circumstances.</p>
                </div>
                <div className="p-3 bg-zinc-900/50 rounded-xl border border-zinc-900 space-y-1">
                  <span className="font-bold text-emerald-400 block">NO Targeted Advertising</span>
                  <p>Google user data is <strong>NEVER</strong> used to serve targeted advertisements, retargeting pixels, or behavioral marketing promotions.</p>
                </div>
                <div className="p-3 bg-zinc-900/50 rounded-xl border border-zinc-900 space-y-1">
                  <span className="font-bold text-emerald-400 block">Strict Human Access Restrictions</span>
                  <p>Humans (including Sovranly IP staff) do <strong>NOT</strong> read your Google data unless you give explicit affirmative consent for technical troubleshooting, for security investigations (e.g., malware or fraud), or to comply with applicable statutory law.</p>
                </div>
              </div>
            </div>

            {/* Storage, Retention & Revocation */}
            <div className="p-5 bg-zinc-950/60 border border-zinc-900 rounded-2xl space-y-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Database className="w-4 h-4 text-amber-400" />
                <span>Storage, Retention &amp; How to Revoke Google Access</span>
              </h3>
              <p className="text-xs text-zinc-400">
                Google user data is encrypted in transit using TLS 1.3 and at rest using AES-256 within Google Cloud Firestore. It is retained solely for the duration of your active Sovranly IP account tenure and is purged within 30 calendar days upon account deletion.
              </p>
              <div className="p-3 bg-zinc-900/40 rounded-xl border border-zinc-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="text-xs text-zinc-300">
                  <strong className="text-white block">Revoke Sovranly IP&apos;s Google Account Access at Any Time:</strong>
                  <span>You can instantly disconnect Sovranly IP from your Google Account via Google&apos;s centralized permissions portal.</span>
                </div>
                <a
                  href="https://myaccount.google.com/permissions"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-500/40 text-cyan-300 rounded-lg text-xs font-mono font-semibold transition-all inline-flex items-center gap-1.5 whitespace-nowrap"
                >
                  <span>Google Permissions Portal</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: Information We Collect */}
        <section id="collection" className="space-y-6">
          <div className="border-b border-zinc-900 pb-3">
            <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight flex items-center gap-2.5">
              <span className="text-cyan-400 text-sm font-mono">[02]</span> Information We Collect (Detailed Taxonomy &amp; Vectors)
            </h2>
            <p className="text-xs text-zinc-500 font-mono mt-1">Granular classification of all active, passive, on-chain, and integrated data collection vectors.</p>
          </div>

          <div className="space-y-4">
            <p className="text-sm text-zinc-300 leading-relaxed">
              Depending on how you interact with Sovranly IP (browsing public creative registries, authenticating an account, connecting an on-chain Web3 wallet, uploading audio masters, notarizing intellectual property, or executing automated license agreements), we collect and process the following specific classifications of information:
            </p>

            {/* Category A */}
            <div className="p-5 bg-zinc-950/60 border border-zinc-900 rounded-2xl space-y-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-cyan-400" />
                <span>A. Identity, Authentication &amp; Profile Data</span>
              </h3>
              <ul className="list-disc list-inside text-xs text-zinc-400 space-y-1.5 leading-relaxed pl-1">
                <li><strong className="text-zinc-200">Google OAuth &amp; Firebase Authentication Profile:</strong> Verified primary email address, display name, user avatar picture URL, and immutable Firebase User Identifier (UID) received when signing in via Google.</li>
                <li><strong className="text-zinc-200">Public Cryptographic Wallet Address:</strong> Public Ethereum/EVM hex address (e.g., <code>0x71C...a49B</code>) read through client-side browser wallet providers (MetaMask, Coinbase Wallet, WalletConnect). <em>Sovranly IP never receives, prompts for, or stores private keys or seed phrases.</em></li>
                <li><strong className="text-zinc-200">Creator Profile &amp; Role Designations:</strong> User-customized creator moniker, bio, social media verification links, and platform membership tier (e.g., Founders Beta Creator, Standard Rights Holder, Enterprise Catalog Manager).</li>
              </ul>
            </div>

            {/* Category B */}
            <div className="p-5 bg-zinc-950/60 border border-zinc-900 rounded-2xl space-y-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-violet-400" />
                <span>B. Intellectual Property Catalog, Audio Masters &amp; Creative Assets</span>
              </h3>
              <ul className="list-disc list-inside text-xs text-zinc-400 space-y-1.5 leading-relaxed pl-1">
                <li><strong className="text-zinc-200">Creative Media Files:</strong> Full-resolution audio files (WAV, FLAC, MP3), multitrack audio stems, cover artwork (PNG, JPG, SVG), video trailers, and PDF contracts uploaded by the creator.</li>
                <li><strong className="text-zinc-200">Track &amp; Catalog Metadata:</strong> Song titles, album/EP titles, release dates, genre, tempo (BPM), musical key, explicit content flags, lyrics, liner notes, and territory restrictions.</li>
                <li><strong className="text-zinc-200">Statutory Rights Identifiers:</strong> International Standard Recording Codes (ISRC), International Standard Musical Work Codes (ISWC), Universal Product Codes (UPC), and Performing Rights Organization (PRO) affiliation records (ASCAP, BMI, SESAC, PRS).</li>
                <li><strong className="text-zinc-200">Split Sheet &amp; Publishing Terms:</strong> Co-writer names, contributor email addresses, publisher designations, and mechanical/performance royalty distribution percentages (e.g., 50% Producer / 50% Vocalist).</li>
                <li><strong className="text-zinc-200">Licensing Agreement Terms:</strong> Specified commercial parameters, including exclusivity tiers, synchronization usage scopes, streaming thresholds, territorial boundaries, and licensing durations.</li>
              </ul>
            </div>

            {/* Category C */}
            <div className="p-5 bg-zinc-950/60 border border-zinc-900 rounded-2xl space-y-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Cpu className="w-4 h-4 text-emerald-400" />
                <span>C. Cryptographic Proofs, Hashes &amp; Checksums</span>
              </h3>
              <ul className="list-disc list-inside text-xs text-zinc-400 space-y-1.5 leading-relaxed pl-1">
                <li><strong className="text-zinc-200">Cryptographic Media Checksums:</strong> SHA-256 and keccak256 hash digests generated client-side from your uploaded audio masters and stems. These mathematical fingerprints establish indisputable proof of existence and prior art without exposing unencrypted media on centralized servers.</li>
                <li><strong className="text-zinc-200">InterPlanetary File System (IPFS) CIDs:</strong> Decentralized content-addressed hashes generated when pinning encrypted creative assets for peer-to-peer distribution.</li>
                <li><strong className="text-zinc-200">Merkle Root Trees:</strong> Cryptographic root hashes linking multi-asset catalogs and split distributions into unified, tamper-evident data structures.</li>
              </ul>
            </div>

            {/* Category D */}
            <div className="p-5 bg-zinc-950/60 border border-zinc-900 rounded-2xl space-y-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Globe className="w-4 h-4 text-cyan-400" />
                <span>D. Web3 On-Chain Consensus &amp; Smart Contract Data</span>
              </h3>
              <ul className="list-disc list-inside text-xs text-zinc-400 space-y-1.5 leading-relaxed pl-1">
                <li><strong className="text-zinc-200">Smart Contract Event Logs:</strong> On-chain transaction hashes, block numbers, block timestamps, and event emission parameters across supported public networks (Ethereum, Arbitrum, Optimism, Base, Polygon).</li>
                <li><strong className="text-zinc-200">Autonomous Royalty Settlements:</strong> Payout event logs, recipient wallet addresses, token contract addresses (USDC, USDT, ETH), and split ratios executed by our deployed smart contracts.</li>
                <li><strong className="text-zinc-200">Cryptographic Digital Signatures:</strong> EIP-712 typed structured signatures or EIP-191 personal signatures provided by creators to authorize off-chain state updates and licensing permits.</li>
              </ul>
            </div>

            {/* Category E */}
            <div className="p-5 bg-zinc-950/60 border border-zinc-900 rounded-2xl space-y-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Database className="w-4 h-4 text-emerald-400" />
                <span>E. Payment, Billing &amp; Subscription Financial Data</span>
              </h3>
              <ul className="list-disc list-inside text-xs text-zinc-400 space-y-1.5 leading-relaxed pl-1">
                <li><strong className="text-zinc-200">Fiat Payment Processing:</strong> If you purchase a subscription or license via credit/debit card, all card data is tokenized directly by authorized PCI-DSS Level 1 certified payment processors. Sovranly IP stores only masked customer IDs, payment intent IDs, billing postal codes, invoice history, and subscription expiration timestamps. <em>Sovranly IP never sees or stores complete credit card numbers, expiration months/years, or CVV/CVC security codes.</em></li>
                <li><strong className="text-zinc-200">Tax &amp; Statutory Accounting Records:</strong> VAT/sales tax registration numbers (for EU/UK creators), corporate business names, and transaction invoices retained to satisfy legal reporting duties.</li>
              </ul>
            </div>

            {/* Category F */}
            <div className="p-5 bg-zinc-950/60 border border-zinc-900 rounded-2xl space-y-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Server className="w-4 h-4 text-amber-400" />
                <span>F. Technical, Network &amp; Telemetry Data</span>
              </h3>
              <ul className="list-disc list-inside text-xs text-zinc-400 space-y-1.5 leading-relaxed pl-1">
                <li><strong className="text-zinc-200">Server &amp; Security Logs:</strong> Truncated IP addresses (masked to preserve anonymity while triaging threats), browser user-agent strings, operating system, referrer URLs, request headers, error stack traces, and date/time stamps.</li>
                <li><strong className="text-zinc-200">Google Analytics 4 Telemetry:</strong> Anonymized interaction events (page view sequences, button click interactions, session durations) collected via measurement ID <code>G-ZGGTSS0QFN</code> to evaluate platform performance.</li>
                <li><strong className="text-zinc-200">Zero-Trust Diagnostics:</strong> RPC endpoint latency, gas estimation benchmarks, and Web3 connection reliability metrics used to maintain high-availability platform infrastructure.</li>
              </ul>
            </div>

            {/* Category G */}
            <div className="p-5 bg-zinc-950/60 border border-zinc-900 rounded-2xl space-y-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Mail className="w-4 h-4 text-rose-400" />
                <span>G. Communications &amp; Direct Inquiries</span>
              </h3>
              <ul className="list-disc list-inside text-xs text-zinc-400 space-y-1.5 leading-relaxed pl-1">
                <li><strong className="text-zinc-200">Direct Inquiries &amp; Customer Support:</strong> Inbound messages, bug reports, DMCA copyright notices, or subject access requests submitted to <code>create@sovranlyip.com</code> or via our in-app feedback modules.</li>
                <li><strong className="text-zinc-200">Newsletter &amp; Creator Grant Registrations:</strong> Email addresses submitted specifically to receive technical product announcements, protocol updates, or creator incubator opportunities.</li>
              </ul>
            </div>
          </div>
        </section>

        {/* SECTION 3: CCPA/CPRA Statutory Notice at Collection & Disclosures */}
        <section id="ccpa-statutory" className="space-y-6">
          <div className="border-b border-zinc-900 pb-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight flex items-center gap-2.5">
                <span className="text-cyan-400 text-sm font-mono">[03]</span> California Consumer Privacy Act (CCPA/CPRA) Notice at Collection &amp; Statutory Disclosures
              </h2>
              <p className="text-xs text-zinc-500 font-mono mt-1">Formal disclosures pursuant to Cal. Civ. Code §§ 1798.100, 1798.110, 1798.115, 1798.121 &amp; 11 CCR §§ 7010-7031.</p>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-cyan-950/40 border border-cyan-500/30 text-cyan-400 rounded-full text-[11px] font-mono whitespace-nowrap self-start sm:self-auto">
              <Scale className="w-3.5 h-3.5" />
              <span>CALIFORNIA RESIDENTS DISCLOSURE</span>
            </div>
          </div>

          <p className="text-xs text-zinc-300 leading-relaxed">
            This section provides additional disclosures required under the California Consumer Privacy Act of 2018, as amended by the California Privacy Rights Act of 2020 (collectively, <strong className="text-white">&apos;CCPA/CPRA&apos;</strong>). The disclosures below describe our practices regarding the collection, use, disclosure, and sale/sharing of Personal Information in the preceding 12 months.
          </p>

          {/* CCPA Statutory Categories Matrix */}
          <div className="overflow-x-auto rounded-2xl border border-zinc-900 bg-zinc-950/60 shadow-lg">
            <table className="w-full text-left border-collapse min-w-[760px] text-xs">
              <thead>
                <tr className="bg-zinc-900/60 border-b border-zinc-900 text-zinc-400 font-mono text-[11px] uppercase">
                  <th className="p-4 font-bold">CCPA Statutory Category (§ 1798.140(v)(1))</th>
                  <th className="p-4 font-bold">Collected (Past 12 Mos)</th>
                  <th className="p-4 font-bold">Categories of Sources</th>
                  <th className="p-4 font-bold">Business / Commercial Purpose</th>
                  <th className="p-4 font-bold">Categories of Third Parties Disclosed To</th>
                  <th className="p-4 font-bold">Sold or Shared (§ 1798.140(ad)/(ah))</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-900 text-zinc-400 leading-normal">
                <tr>
                  <td className="p-4 font-mono font-bold text-white">
                    A. Identifiers
                    <span className="block text-[11px] text-zinc-500 font-normal font-sans">Name, email, unique UID, IP address, EVM wallet address.</span>
                  </td>
                  <td className="p-4 font-mono text-emerald-400 font-bold">YES</td>
                  <td className="p-4">Direct from consumer, Google OAuth, Web3 browser wallets.</td>
                  <td className="p-4">User authentication, creator catalog attribution, security defense, transaction notices.</td>
                  <td className="p-4">Cloud infrastructure (Google Cloud/Firebase), authorized payment processor.</td>
                  <td className="p-4 font-mono text-rose-400 font-bold">NONE SOLD / NONE SHARED</td>
                </tr>
                <tr>
                  <td className="p-4 font-mono font-bold text-white">
                    B. Customer Records (Cal. Civ. Code § 1798.80(e))
                    <span className="block text-[11px] text-zinc-500 font-normal font-sans">Name, signature, masked payment tokens (last 4 digits).</span>
                  </td>
                  <td className="p-4 font-mono text-emerald-400 font-bold">YES</td>
                  <td className="p-4">Direct from consumer, payment processor.</td>
                  <td className="p-4">Executing licensing contracts, subscription billing, payout accounting.</td>
                  <td className="p-4">Authorized payment processor, banking gateways.</td>
                  <td className="p-4 font-mono text-rose-400 font-bold">NONE SOLD / NONE SHARED</td>
                </tr>
                <tr>
                  <td className="p-4 font-mono font-bold text-white">
                    C. Protected Classifications
                    <span className="block text-[11px] text-zinc-500 font-normal font-sans">Age (18+ verified threshold only; no race/gender).</span>
                  </td>
                  <td className="p-4 font-mono text-emerald-400 font-bold">YES (Age 18+ only)</td>
                  <td className="p-4">Direct consumer attestation upon registration.</td>
                  <td className="p-4">COPPA and platform terms enforcement; age-verification.</td>
                  <td className="p-4">None.</td>
                  <td className="p-4 font-mono text-rose-400 font-bold">NONE SOLD / NONE SHARED</td>
                </tr>
                <tr>
                  <td className="p-4 font-mono font-bold text-white">
                    D. Commercial Information
                    <span className="block text-[11px] text-zinc-500 font-normal font-sans">Registered works, licensing terms, royalty receipts.</span>
                  </td>
                  <td className="p-4 font-mono text-emerald-400 font-bold">YES</td>
                  <td className="p-4">Direct from consumer, EVM blockchain transactions.</td>
                  <td className="p-4">Publishing rights registries, smart contract splits, commercial licensing.</td>
                  <td className="p-4">Public decentralized EVM blockchains, IPFS nodes.</td>
                  <td className="p-4 font-mono text-rose-400 font-bold">NONE SOLD / NONE SHARED</td>
                </tr>
                <tr>
                  <td className="p-4 font-mono font-bold text-white">
                    E. Biometric Information
                    <span className="block text-[11px] text-zinc-500 font-normal font-sans">Voiceprints, facial geometry, retina scans.</span>
                  </td>
                  <td className="p-4 font-mono text-zinc-500 font-bold">NO</td>
                  <td className="p-4">N/A (None collected).</td>
                  <td className="p-4">N/A</td>
                  <td className="p-4">None.</td>
                  <td className="p-4 font-mono text-rose-400 font-bold">NONE SOLD / NONE SHARED</td>
                </tr>
                <tr>
                  <td className="p-4 font-mono font-bold text-white">
                    F. Internet &amp; Network Activity
                    <span className="block text-[11px] text-zinc-500 font-normal font-sans">Browsing history on app, clicks, telemetry, RPC latency.</span>
                  </td>
                  <td className="p-4 font-mono text-emerald-400 font-bold">YES</td>
                  <td className="p-4">Automated server logs, GA4 (measurement ID G-ZGGTSS0QFN).</td>
                  <td className="p-4">Security threat triage, DDoS defense, debugging, performance analysis.</td>
                  <td className="p-4">Google Cloud Logging, Google Analytics.</td>
                  <td className="p-4 font-mono text-rose-400 font-bold">NONE SOLD / NONE SHARED</td>
                </tr>
                <tr>
                  <td className="p-4 font-mono font-bold text-white">
                    G. Geolocation Data
                    <span className="block text-[11px] text-zinc-500 font-normal font-sans">Coarse country/region location via IP address (no precise GPS).</span>
                  </td>
                  <td className="p-4 font-mono text-emerald-400 font-bold">YES (Coarse only)</td>
                  <td className="p-4">IP address network routing lookup.</td>
                  <td className="p-4">Territorial licensing compliance, VAT/sales tax calculations.</td>
                  <td className="p-4">Authorized payment processor / tax calculation engine.</td>
                  <td className="p-4 font-mono text-rose-400 font-bold">NONE SOLD / NONE SHARED</td>
                </tr>
                <tr>
                  <td className="p-4 font-mono font-bold text-white">
                    H. Audio, Electronic &amp; Visual Info
                    <span className="block text-[11px] text-zinc-500 font-normal font-sans">Audio masters (WAV/FLAC), stems, cover art, contracts.</span>
                  </td>
                  <td className="p-4 font-mono text-emerald-400 font-bold">YES</td>
                  <td className="p-4">Direct creator uploads.</td>
                  <td className="p-4">Checksum anchoring, cloud master storage, preview playback, licensee delivery.</td>
                  <td className="p-4">Google Cloud Storage, IPFS pinning clusters.</td>
                  <td className="p-4 font-mono text-rose-400 font-bold">NONE SOLD / NONE SHARED</td>
                </tr>
                <tr>
                  <td className="p-4 font-mono font-bold text-white">
                    I. Professional / Employment Info
                    <span className="block text-[11px] text-zinc-500 font-normal font-sans">PRO affiliations (ASCAP/BMI), publisher, label.</span>
                  </td>
                  <td className="p-4 font-mono text-emerald-400 font-bold">YES</td>
                  <td className="p-4">Direct creator profile settings.</td>
                  <td className="p-4">Rights management attribution, split sheet contract execution.</td>
                  <td className="p-4">Smart contract signers, public registry.</td>
                  <td className="p-4 font-mono text-rose-400 font-bold">NONE SOLD / NONE SHARED</td>
                </tr>
                <tr>
                  <td className="p-4 font-mono font-bold text-white">
                    J. Non-Public Education Info
                    <span className="block text-[11px] text-zinc-500 font-normal font-sans">Transcripts, student records (FERPA).</span>
                  </td>
                  <td className="p-4 font-mono text-zinc-500 font-bold">NO</td>
                  <td className="p-4">N/A (None collected).</td>
                  <td className="p-4">N/A</td>
                  <td className="p-4">None.</td>
                  <td className="p-4 font-mono text-rose-400 font-bold">NONE SOLD / NONE SHARED</td>
                </tr>
                <tr>
                  <td className="p-4 font-mono font-bold text-white">
                    K. Inferences Drawn from Data
                    <span className="block text-[11px] text-zinc-500 font-normal font-sans">Consumer profiles, purchasing tendencies, behavior.</span>
                  </td>
                  <td className="p-4 font-mono text-zinc-500 font-bold">NO</td>
                  <td className="p-4">N/A (No consumer profiling conducted).</td>
                  <td className="p-4">N/A</td>
                  <td className="p-4">None.</td>
                  <td className="p-4 font-mono text-rose-400 font-bold">NONE SOLD / NONE SHARED</td>
                </tr>
                <tr>
                  <td className="p-4 font-mono font-bold text-white">
                    L. Sensitive Personal Information (SPI)
                    <span className="block text-[11px] text-zinc-500 font-normal font-sans">Account login credentials, statutory tax IDs for payouts.</span>
                  </td>
                  <td className="p-4 font-mono text-emerald-400 font-bold">YES</td>
                  <td className="p-4">Direct from consumer, Google OAuth credentials.</td>
                  <td className="p-4">Authentication security; statutory 1099/W-8BEN tax filings when required by IRC § 6050W.</td>
                  <td className="p-4">Authorized payment processor, IRS / statutory tax authorities.</td>
                  <td className="p-4 font-mono text-rose-400 font-bold">NONE SOLD / NONE SHARED</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* CCPA/CPRA Specific Statutory Provisions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-zinc-400 leading-relaxed">
            <div className="p-5 bg-zinc-950/60 border border-zinc-900 rounded-2xl space-y-2">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                <span>Zero Sale or Sharing of Personal Information</span>
              </h3>
              <p>
                In the preceding 12 months, Sovranly IP has <strong>NOT sold or shared</strong> (for cross-context behavioral advertising) any Personal Information of California consumers as defined by Cal. Civ. Code §§ 1798.140(ad) and 1798.140(ah). We have no actual knowledge of selling or sharing personal information of consumers under 16 years of age.
              </p>
            </div>

            <div className="p-5 bg-zinc-950/60 border border-zinc-900 rounded-2xl space-y-2">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Lock className="w-4 h-4 text-emerald-400" />
                <span>Limitation on Use of Sensitive Personal Information</span>
              </h3>
              <p>
                Under Cal. Civ. Code § 1798.121 and 11 CCR § 7027(m), Sovranly IP collects and processes Sensitive Personal Information (e.g., account credentials and tax identifiers) <strong>exclusively for permissible business purposes</strong>: providing the platform services requested, maintaining cybersecurity, verifying accounts, and complying with statutory fiscal laws. We do not use SPI to infer characteristics or for any secondary commercial purposes. Consequently, the statutory &apos;Right to Limit the Use of Sensitive Personal Information&apos; is not triggered.
              </p>
            </div>

            <div className="p-5 bg-zinc-950/60 border border-zinc-900 rounded-2xl space-y-2">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Globe className="w-4 h-4 text-violet-400" />
                <span>Global Privacy Control (GPC) &amp; Opt-Out Signals</span>
              </h3>
              <p>
                Pursuant to 11 CCR § 7025, Sovranly IP recognizes and honors universal opt-out preference signals, including the <strong>Global Privacy Control (GPC)</strong>. If your browser broadcasts an affirmative GPC signal, our client-side scripts automatically disable non-essential telemetry and analytics cookies across your session without requiring manual configuration.
              </p>
            </div>

            <div className="p-5 bg-zinc-950/60 border border-zinc-900 rounded-2xl space-y-2">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-amber-400" />
                <span>Authorized Agent Representation Protocol</span>
              </h3>
              <p>
                Under 11 CCR § 7026, California consumers may designate an authorized agent to submit requests under the CCPA on their behalf. The agent must provide: (1) written authorization signed by the consumer or a valid power of attorney pursuant to California Probate Code §§ 4000-4465; and (2) verification of the consumer&apos;s own identity directly with Sovranly IP. Requests should be transmitted to <code className="text-white">create@sovranlyip.com</code>.
              </p>
            </div>
          </div>

          <div className="p-4 bg-zinc-900/40 border border-zinc-800 rounded-xl text-xs text-zinc-400 leading-relaxed">
            <strong className="text-white block mb-1">California &apos;Shine the Light&apos; Disclosure (Cal. Civ. Code § 1798.83):</strong>
            California Civil Code Section 1798.83 permits California residents to request annually certain information regarding our disclosure of Personal Information to third parties for their direct marketing purposes. <strong>Sovranly IP never discloses personal information to third parties for direct marketing.</strong> For inquiries, contact <a href="mailto:create@sovranlyip.com" className="text-cyan-400 hover:underline">create@sovranlyip.com</a>.
          </div>
        </section>

        {/* SECTION 4: How We Use and Process Your Data (Comprehensive Purpose Matrix) */}
        <section id="usage" className="space-y-6">
          <div className="border-b border-zinc-900 pb-3">
            <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight flex items-center gap-2.5">
              <span className="text-cyan-400 text-sm font-mono">[04]</span> How We Use and Process Your Data (Comprehensive Purpose Matrix)
            </h2>
            <p className="text-xs text-zinc-500 font-mono mt-1">Granular mapping of data elements to specific operational features, lawful bases, and retention terms.</p>
          </div>

          {/* Master Purpose Table */}
          <div className="overflow-x-auto rounded-2xl border border-zinc-900 bg-zinc-950/60 shadow-lg">
            <table className="w-full text-left border-collapse min-w-[700px] text-xs">
              <thead>
                <tr className="bg-zinc-900/60 border-b border-zinc-900 text-zinc-400 font-mono text-[11px] uppercase">
                  <th className="p-4 font-bold">Data Category</th>
                  <th className="p-4 font-bold">Operational Purpose &amp; Feature</th>
                  <th className="p-4 font-bold">Lawful Basis (GDPR / CCPA)</th>
                  <th className="p-4 font-bold">Third Parties / Processors</th>
                  <th className="p-4 font-bold">Retention Horizon</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-900 text-zinc-400 leading-normal">
                <tr>
                  <td className="p-4 font-mono font-bold text-white">Google OAuth &amp; Profile</td>
                  <td className="p-4">Account authentication, creator profile creation, session verification, sending critical notifications.</td>
                  <td className="p-4 font-mono text-cyan-400">Contractual Necessity (Art. 6(1)(b))</td>
                  <td className="p-4">Google Cloud, Firebase Auth</td>
                  <td className="p-4">Duration of account tenure; purged within 30 days of deletion request.</td>
                </tr>
                <tr>
                  <td className="p-4 font-mono font-bold text-white">Creative Assets &amp; Stems</td>
                  <td className="p-4">Generating media hashes, storing masters/stems, enabling preview playback, and delivering licensed audio to buyers.</td>
                  <td className="p-4 font-mono text-cyan-400">Contractual Necessity (Art. 6(1)(b))</td>
                  <td className="p-4">Google Cloud Storage, IPFS Nodes</td>
                  <td className="p-4">Retained while registered; deleted upon verified asset removal.</td>
                </tr>
                <tr>
                  <td className="p-4 font-mono font-bold text-white">Cryptographic Checksums</td>
                  <td className="p-4">Anchoring tamper-proof proof of existence and prior art to public distributed ledgers.</td>
                  <td className="p-4 font-mono text-emerald-400">Legitimate Interests (Art. 6(1)(f))</td>
                  <td className="p-4">Ethereum, Arbitrum, Base, Polygon</td>
                  <td className="p-4">Indefinite (permanent on-chain cryptographic proof).</td>
                </tr>
                <tr>
                  <td className="p-4 font-mono font-bold text-white">Web3 Public Wallets</td>
                  <td className="p-4">Deploying licensing contracts, receiving direct split payouts, signing authorization permits.</td>
                  <td className="p-4 font-mono text-cyan-400">Contractual Necessity (Art. 6(1)(b))</td>
                  <td className="p-4">Public EVM Blockchains, RPC Nodes</td>
                  <td className="p-4">Stored in profile until removed; on-chain history is permanent.</td>
                </tr>
                <tr>
                  <td className="p-4 font-mono font-bold text-white">Billing &amp; Payment Records</td>
                  <td className="p-4">Processing subscription fees, managing license purchases, issuing invoices, statutory accounting.</td>
                  <td className="p-4 font-mono text-amber-400">Legal Obligation (Art. 6(1)(c)) &amp; Contract</td>
                  <td className="p-4">Authorized Payment Processor</td>
                  <td className="p-4">7 years following transaction date (statutory tax requirement).</td>
                </tr>
                <tr>
                  <td className="p-4 font-mono font-bold text-white">Server &amp; Telemetry Logs</td>
                  <td className="p-4">Defending against DDoS, bot attacks, fraud detection, and evaluating user experience performance.</td>
                  <td className="p-4 font-mono text-emerald-400">Legitimate Interests (Art. 6(1)(f)) &amp; Consent</td>
                  <td className="p-4">Google Cloud Logging, Google Analytics</td>
                  <td className="p-4">90 days rolling window for server logs; 14 months for GA4.</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Narrative Breakdown of Operational Purposes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs leading-relaxed text-zinc-400 pt-2">
            <div className="p-5 bg-zinc-950/60 border border-zinc-900 rounded-2xl space-y-2">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-cyan-400" /> 1. Autonomous Licensing &amp; Proof-of-Existence
              </h3>
              <p>
                We compute cryptographic media checksums (SHA-256 and keccak256) of uploaded creative masters and broadcast them to public consensus ledgers. This generates an immutable timestamp proving you possessed the asset prior to any third-party claim, creating legally defensible evidence of prior art.
              </p>
            </div>

            <div className="p-5 bg-zinc-950/60 border border-zinc-900 rounded-2xl space-y-2">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Cpu className="w-4 h-4 text-violet-400" /> 2. Real-Time Royalty Dispersal
              </h3>
              <p>
                Smart contract logic uses registered wallet addresses and split percentages to route licensing revenues automatically to collaborators in real-time without centralized banking holds or payment delays.
              </p>
            </div>

            <div className="p-5 bg-zinc-950/60 border border-zinc-900 rounded-2xl space-y-2">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Lock className="w-4 h-4 text-emerald-400" /> 3. Continuous Zero Trust Authentication
              </h3>
              <p>
                Every API call and state mutation verifies cryptographic JSON Web Tokens (JWTs) and validates caller ownership before executing. Identity claims are validated against Google OAuth and verified EVM wallet signatures.
              </p>
            </div>

            <div className="p-5 bg-zinc-950/60 border border-zinc-900 rounded-2xl space-y-2">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Server className="w-4 h-4 text-amber-400" /> 4. Platform Reliability, Fraud Defense &amp; Anti-Sybil
              </h3>
              <p>
                Telemetry and access logs are monitored in real-time to detect anomalous traffic, prevent unauthorized automated scraping of creator catalogs, block smart contract reentrancy exploits, and mitigate volumetric DDoS attacks.
              </p>
            </div>

            <div className="p-5 bg-zinc-950/60 border border-zinc-900 rounded-2xl space-y-2">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Database className="w-4 h-4 text-blue-400" /> 5. Account &amp; Billing Administration
              </h3>
              <p>
                Managing platform subscriptions, generating invoices, processing upgrade or renewal cycles, and fulfilling mandatory statutory corporate tax, audit, and accounting requirements.
              </p>
            </div>

            <div className="p-5 bg-zinc-950/60 border border-zinc-900 rounded-2xl space-y-2">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Mail className="w-4 h-4 text-rose-400" /> 6. Customer Care &amp; Operational Alerts
              </h3>
              <p>
                Delivering critical service notifications, security advisories, policy revisions, and responding directly to support tickets, DMCA copyright notices, and licensing disputes.
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 5: Artificial Intelligence (AI) & Machine Learning Usage Policies */}
        <section id="ai-processing" className="space-y-6">
          <div className="border-b border-zinc-900 pb-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight flex items-center gap-2.5">
                <span className="text-cyan-400 text-sm font-mono">[05]</span> Artificial Intelligence (AI) &amp; Machine Learning Usage Policies
              </h2>
              <p className="text-xs text-zinc-500 font-mono mt-1">Strict terms governing AI features, creator ownership, and training prohibitions.</p>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-violet-950/40 border border-violet-500/30 text-violet-400 rounded-full text-[11px] font-mono whitespace-nowrap self-start sm:self-auto">
              <Sparkles className="w-3.5 h-3.5" />
              <span>ZERO AI TRAINING GUARANTEE</span>
            </div>
          </div>

          <div className="space-y-4 text-xs text-zinc-300 leading-relaxed">
            <p>
              Sovranly IP may provide opt-in, creator-directed AI tools (powered by server-side Gemini API endpoints) to assist creators with metadata tagging, license agreement summarization, and rights verification. Our usage of AI adheres to the following non-negotiable principles:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 bg-zinc-950/60 border border-zinc-900 rounded-2xl space-y-2">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" /> 1. No Foundation Model Training
                </h3>
                <p className="text-zinc-400">
                  Your audio masters, stems, lyrics, metadata, Google user data, and personal communications are <strong>NEVER</strong> used to train, retrain, fine-tune, or develop general artificial intelligence models, foundation models, or third-party generative algorithms.
                </p>
              </div>

              <div className="p-5 bg-zinc-950/60 border border-zinc-900 rounded-2xl space-y-2">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Lock className="w-4 h-4 text-cyan-400" /> 2. Ephemeral Processing
                </h3>
                <p className="text-zinc-400">
                  AI analysis requests are executed via secure, stateless server-side API calls. Data sent to the model is processed strictly in-memory to generate the immediate user-facing output and is not cached or retained by AI infrastructure providers.
                </p>
              </div>

              <div className="p-5 bg-zinc-950/60 border border-zinc-900 rounded-2xl space-y-2">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-violet-400" /> 3. 100% Creator Ownership
                </h3>
                <p className="text-zinc-400">
                  You retain exclusive, unencumbered intellectual property ownership over all prompts, uploaded content, and AI-assisted metadata outputs generated through Sovranly IP.
                </p>
              </div>

              <div className="p-5 bg-zinc-950/60 border border-zinc-900 rounded-2xl space-y-2">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-amber-400" /> 4. Anti-Scraping Defenses
                </h3>
                <p className="text-zinc-400">
                  We implement automated rate-limiting, bot verification, and web-crawler defenses to actively prevent unauthorized AI web scrapers from harvesting creator catalogs hosted on Sovranly IP.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 6: Legal Bases for Processing & Non-Profiling */}
        <section id="legal-basis" className="space-y-6">
          <div className="border-b border-zinc-900 pb-3">
            <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight flex items-center gap-2.5">
              <span className="text-cyan-400 text-sm font-mono">[06]</span> Legal Bases for Data Processing &amp; Non-Profiling (GDPR Arts. 6, 9 &amp; 22)
            </h2>
            <p className="text-xs text-zinc-500 font-mono mt-1">Lawful grounds under the EU General Data Protection Regulation (GDPR) and UK GDPR.</p>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-zinc-900 bg-zinc-950/60">
            <table className="w-full text-left border-collapse min-w-[620px] text-xs">
              <thead>
                <tr className="bg-zinc-900/60 border-b border-zinc-900 text-zinc-400 font-mono text-[11px] uppercase">
                  <th className="p-4 font-bold">Legal Ground</th>
                  <th className="p-4 font-bold">Applicable Processing Activities</th>
                  <th className="p-4 font-bold">Scope &amp; User Safeguards</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-900 text-zinc-400 leading-normal">
                <tr>
                  <td className="p-4 font-mono font-bold text-cyan-400">Contractual Necessity (Art. 6(1)(b))</td>
                  <td className="p-4">Executing licensing agreements, distributing royalties, maintaining user account authentication, and recording IP notarizations.</td>
                  <td className="p-4 text-zinc-500">Required to provide the core services requested by the creator.</td>
                </tr>
                <tr>
                  <td className="p-4 font-mono font-bold text-emerald-400">Legitimate Interests (Art. 6(1)(f))</td>
                  <td className="p-4">Enforcing Zero Trust platform security, network threat mitigation, preventing piracy and copyright fraud, and optimizing app performance.</td>
                  <td className="p-4 text-zinc-500">Balanced against your individual privacy rights under a documented Legitimate Interests Assessment (LIA); strict data minimization observed.</td>
                </tr>
                <tr>
                  <td className="p-4 font-mono font-bold text-violet-400">Explicit Consent (Art. 6(1)(a))</td>
                  <td className="p-4">Non-essential analytical cookies (Google Analytics GA4), marketing communications, and personalized preferences.</td>
                  <td className="p-4 text-zinc-500">Freely given, granular, and revocable at any time via the Storage &amp; Cookie Governance Matrix or browser GPC signals.</td>
                </tr>
                <tr>
                  <td className="p-4 font-mono font-bold text-amber-400">Legal Obligation (Art. 6(1)(c))</td>
                  <td className="p-4">Tax and corporate accounting records, response to valid judicial warrants or subpoenas, and DMCA copyright dispute compliance.</td>
                  <td className="p-4 text-zinc-500">Retained strictly for periods mandated by applicable statutory law (e.g., 7-year fiscal statutes).</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-zinc-400 leading-relaxed">
            <div className="p-5 bg-zinc-950/60 border border-zinc-900 rounded-2xl space-y-2">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-amber-400" />
                <span>Special Categories of Personal Data (GDPR Art. 9)</span>
              </h3>
              <p>
                Sovranly IP <strong>does NOT process Special Categories of Personal Data</strong> under GDPR Article 9(1). We do not collect, solicit, or infer personal data revealing racial or ethnic origin, political opinions, religious or philosophical beliefs, trade union membership, genetic data, biometric data for the purpose of uniquely identifying a natural person, data concerning health, or data concerning a natural person&apos;s sex life or sexual orientation. Users are instructed not to submit special category data to the platform.
              </p>
            </div>

            <div className="p-5 bg-zinc-950/60 border border-zinc-900 rounded-2xl space-y-2">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Cpu className="w-4 h-4 text-cyan-400" />
                <span>Automated Decision-Making &amp; Profiling (GDPR Art. 22)</span>
              </h3>
              <p>
                Sovranly IP <strong>does NOT subject users to automated decision-making or profiling</strong> that produces legal effects concerning them or similarly significantly affects them pursuant to GDPR Article 22. All intellectual property registrations, licensing terms, royalty distribution split sheets, and access decisions are explicitly configured, reviewed, and authorized by human creators or counterparties.
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 7: Subprocessors & Third-Party Service Providers */}
        <section id="subprocessors" className="space-y-6">
          <div className="border-b border-zinc-900 pb-3">
            <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight flex items-center gap-2.5">
              <span className="text-cyan-400 text-sm font-mono">[07]</span> Third-Party Subprocessors &amp; Service Providers
            </h2>
            <p className="text-xs text-zinc-500 font-mono mt-1">Verified infrastructure partners contracted to deliver platform capabilities.</p>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-zinc-900 bg-zinc-950/60">
            <table className="w-full text-left border-collapse min-w-[640px] text-xs">
              <thead>
                <tr className="bg-zinc-900/60 border-b border-zinc-900 text-zinc-400 font-mono text-[11px] uppercase">
                  <th className="p-4 font-bold">Subprocessor</th>
                  <th className="p-4 font-bold">Role &amp; Activity</th>
                  <th className="p-4 font-bold">Data Elements Handled</th>
                  <th className="p-4 font-bold">Jurisdiction &amp; Safeguards</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-900 text-zinc-400 leading-normal">
                <tr>
                  <td className="p-4 font-mono font-bold text-white">Google Cloud &amp; Firebase</td>
                  <td className="p-4">Cloud hosting, serverless edge functions, Firestore database, and OAuth authentication.</td>
                  <td className="p-4">Email, User ID, authentication tokens, IP metadata, catalog records.</td>
                  <td className="p-4">United States / Global (ISO 27001, SOC 2, EU Standard Contractual Clauses).</td>
                </tr>
                <tr>
                  <td className="p-4 font-mono font-bold text-white">Google Analytics (G-ZGGTSS0QFN)</td>
                  <td className="p-4">Anonymized site traffic diagnostics and interaction analytics.</td>
                  <td className="p-4">Aggregated page views, browser user-agents, anonymized IP telemetry.</td>
                  <td className="p-4">United States (Opt-out available via cookie settings or browser DNT headers).</td>
                </tr>
                <tr>
                  <td className="p-4 font-mono font-bold text-white">Authorized Payment Gateways</td>
                  <td className="p-4">Fiat payment gateway, subscription management, automated invoicing.</td>
                  <td className="p-4">Billing address, email, card brand/last 4, subscription plan IDs.</td>
                  <td className="p-4">United States / Global (PCI-DSS Level 1 Certified).</td>
                </tr>
                <tr>
                  <td className="p-4 font-mono font-bold text-white">IPFS Gateways &amp; Pinning Nodes</td>
                  <td className="p-4">Decentralized peer-to-peer storage of hashed creative assets.</td>
                  <td className="p-4">Cryptographic file hashes (CIDs), encrypted media chunks.</td>
                  <td className="p-4">Decentralized Global Network (Public Swarm).</td>
                </tr>
                <tr>
                  <td className="p-4 font-mono font-bold text-white">Decentralized EVM Blockchains</td>
                  <td className="p-4">Public consensus ledger for smart contracts and royalty settlements.</td>
                  <td className="p-4">Public wallet addresses, contract bytecode, royalty shares, tx hashes.</td>
                  <td className="p-4">Decentralized Peer-to-Peer Networks (Ethereum, Arbitrum, Optimism, Base, Polygon).</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* SECTION 8: Blockchain Immutability */}
        <section id="blockchain" className="space-y-6">
          <div className="border-b border-zinc-900 pb-3">
            <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight flex items-center gap-2.5">
              <span className="text-cyan-400 text-sm font-mono">[08]</span> Blockchain Immutability &amp; Public Ledger Disclosures
            </h2>
            <p className="text-xs text-zinc-500 font-mono mt-1">Crucial architectural distinction between off-chain and on-chain records.</p>
          </div>

          <div className="p-6 bg-amber-950/20 border border-amber-500/30 rounded-2xl space-y-3">
            <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
              <AlertCircle className="w-5 h-5 text-amber-400" />
              <h3>Notice Regarding Decentralized Ledger Permanence</h3>
            </div>
            <p className="text-xs text-amber-200/80 leading-relaxed">
              When you deploy a smart contract, register an intellectual property claim, or execute a royalty split on a decentralized blockchain network (such as Ethereum, Arbitrum, Polygon, Base, or Optimism), that transaction is permanently written to a publicly auditable distributed ledger.
            </p>
            <ul className="list-disc list-inside text-xs text-amber-200/70 space-y-1.5 leading-relaxed pl-1">
              <li><strong>Inability to Modify or Erase:</strong> Neither Sovranly IP nor any single party possesses the cryptographic authority to edit, overwrite, roll back, or delete data once broadcast to a public blockchain network.</li>
              <li><strong>Public Visibility:</strong> Anyone with a blockchain explorer can observe your public wallet address, transaction amounts, timestamps, and contract parameters.</li>
              <li><strong>Interactions with &apos;Right to be Forgotten&apos;:</strong> Statutory deletion rights under GDPR Article 17 and CCPA apply to off-chain records hosted in our centralized systems, but cannot technically or physically alter decentralized blocks confirmed by thousands of independent network validators.</li>
            </ul>
          </div>
        </section>

        {/* SECTION 9: Information Sharing & Zero Data Monetization */}
        <section id="sharing" className="space-y-6">
          <div className="border-b border-zinc-900 pb-3">
            <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight flex items-center gap-2.5">
              <span className="text-cyan-400 text-sm font-mono">[09]</span> Information Sharing &amp; Zero Data Monetization
            </h2>
          </div>

          <div className="space-y-4 text-xs text-zinc-300 leading-relaxed">
            <p>
              Sovranly IP maintains an unyielding commitment: <strong>We do not sell, rent, monetize, or disclose your personal data or creative work to third parties for commercial exploitation or advertising purposes.</strong>
            </p>
            <p>
              Information is strictly disclosed only in the following bounded circumstances:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-zinc-400">
              <div className="p-4 bg-zinc-950/60 border border-zinc-900 rounded-xl space-y-1.5">
                <h4 className="font-bold text-white">Authorized Subprocessors</h4>
                <p>Shared exclusively with vetted technical vendors (cloud infrastructure, payment processors) strictly to perform operational functions under contractual confidentiality.</p>
              </div>
              <div className="p-4 bg-zinc-950/60 border border-zinc-900 rounded-xl space-y-1.5">
                <h4 className="font-bold text-white">Public Blockchain Networks</h4>
                <p>Broadcast to distributed ledgers when you deliberately initiate an on-chain registration, licensing agreement, or royalty payout.</p>
              </div>
              <div className="p-4 bg-zinc-950/60 border border-zinc-900 rounded-xl space-y-1.5">
                <h4 className="font-bold text-white">Mandatory Legal Compliance</h4>
                <p>Disclosed only when compelled by enforceable court orders, subpoenas, statutory tax authorities, or to defend against imminent intellectual property infringement.</p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 10: Data Storage Topology & Technical Security Measures (TOMs - GDPR Art. 32) */}
        <section id="storage-architecture" className="space-y-6">
          <div className="border-b border-zinc-900 pb-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight flex items-center gap-2.5">
                <span className="text-cyan-400 text-sm font-mono">[10]</span> Data Storage Topology &amp; Technical and Organizational Security Measures (TOMs - GDPR Art. 32)
              </h2>
              <p className="text-xs text-zinc-500 font-mono mt-1">Multi-tier zero-trust infrastructure, cryptographic key management, automated backup cycles, and media sanitization.</p>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-cyan-950/40 border border-cyan-500/30 text-cyan-400 rounded-full text-[11px] font-mono whitespace-nowrap self-start sm:self-auto">
              <HardDrive className="w-3.5 h-3.5" />
              <span>STORAGE &amp; ARCHITECTURE</span>
            </div>
          </div>

          {/* Storage Tiers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-zinc-400 leading-relaxed">
            <div className="p-5 bg-zinc-950/60 border border-zinc-900 rounded-2xl space-y-2.5">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Database className="w-4 h-4 text-cyan-400" />
                  <span>Tier 1: Operational NoSQL State Store (Firestore)</span>
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-950/50 text-cyan-400 border border-cyan-800/40">GCP US-WEST1</span>
              </div>
              <p>
                Structured user records, authentication tokens, creator metadata profiles, and split sheet drafts reside in Google Cloud Firestore with multi-region replication. Every read and write operation is guarded by continuous Zero Trust server-side security rules, least-privilege IAM roles, and AES-256 server-side encryption with automated key rotation.
              </p>
            </div>

            <div className="p-5 bg-zinc-950/60 border border-zinc-900 rounded-2xl space-y-2.5">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Server className="w-4 h-4 text-emerald-400" />
                  <span>Tier 2: Encrypted Binary Object Storage (Cloud Storage)</span>
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950/50 text-emerald-400 border border-emerald-800/40">SIGNED URLS</span>
              </div>
              <p>
                Audio master files (lossless WAV, 24-bit/48kHz or 96kHz), multitrack stems, and high-resolution cover artwork are stored in dedicated Google Cloud Storage buckets. Files are encrypted with customer-managed keys (CMEK) via Google Cloud KMS. Download and stream access is restricted exclusively through cryptographically signed URLs with strict time-to-live thresholds (TTL &le; 15 minutes).
              </p>
            </div>

            <div className="p-5 bg-zinc-950/60 border border-zinc-900 rounded-2xl space-y-2.5">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Globe className="w-4 h-4 text-violet-400" />
                  <span>Tier 3: Distributed Content-Addressed Swarm (IPFS)</span>
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-violet-950/50 text-violet-400 border border-violet-800/40">CONTENT CIDs</span>
              </div>
              <p>
                Immutable metadata manifests, licensing schemas, and public previews are pinned across decentralized IPFS clusters. Assets are addressed by cryptographic content identifiers (CIDs) computed via SHA-256 or keccak256 algorithms, ensuring complete tamper-evidence. Private stems and confidential creator documents are never broadcast unencrypted to the IPFS swarm.
              </p>
            </div>

            <div className="p-5 bg-zinc-950/60 border border-zinc-900 rounded-2xl space-y-2.5">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Layers className="w-4 h-4 text-amber-400" />
                  <span>Tier 4: Public Consensus Ledger (EVM Blockchains)</span>
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-950/50 text-amber-400 border border-amber-800/40">ON-CHAIN</span>
              </div>
              <p>
                Smart contract logic, commercial license tokenization, and irreversible ownership claims are permanently recorded on public EVM networks (Ethereum, Arbitrum, Base, Optimism, Polygon). On-chain data is confined to non-invertible hashes, numeric split ratios, and cryptographic wallet addresses—no plaintext personally identifiable information is stored on-chain.
              </p>
            </div>
          </div>

          {/* Envelope Encryption & Key Management */}
          <div className="p-5 bg-zinc-950/60 border border-zinc-900 rounded-2xl space-y-3 text-xs text-zinc-300 leading-relaxed">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Lock className="w-4 h-4 text-cyan-400" />
              <span>Envelope Encryption &amp; Cryptographic Key Lifecycle (FIPS 140-2 Level 3)</span>
            </h3>
            <p>
              Sovranly IP employs a two-tier envelope encryption architecture. High-entropy Data Encryption Keys (DEKs) encrypt raw data records at rest using <strong>AES-256-GCM</strong> (Galois/Counter Mode), guaranteeing both confidentiality and cryptographic integrity. DEKs are themselves encrypted using Key Encryption Keys (KEKs) maintained within Google Cloud Key Management Service (Cloud KMS) backed by <strong>FIPS 140-2 Level 3 certified Hardware Security Modules (HSMs)</strong>. KEKs are configured with mandatory 365-day automated cryptographic rotation schedules.
            </p>
          </div>

          {/* Backup, Disaster Recovery & Sanitization */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-zinc-400 leading-relaxed">
            <div className="p-5 bg-zinc-950/60 border border-zinc-900 rounded-2xl space-y-2">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-emerald-400" />
                <span>Backup Cycles, PITR &amp; Deletion Propagation</span>
              </h3>
              <ul className="list-disc list-inside space-y-1.5 pl-1">
                <li><strong>Continuous Point-in-Time Recovery (PITR):</strong> Firestore maintains a rolling 7-day PITR retention window enabling instantaneous state reconstruction during infrastructure anomalies.</li>
                <li><strong>Encrypted Cold Snapshots:</strong> Daily differential snapshots are stored in air-gapped, cross-regional storage buckets encrypted with independent KMS keys, retained for a maximum of 30 days before automated cyclic overwriting.</li>
                <li><strong>Tombstoned Deletion Cascades:</strong> When a data subject executes an erasure request, tombstone identifiers ensure that restored rollback backups purge previously deleted records before resuming write traffic.</li>
              </ul>
            </div>

            <div className="p-5 bg-zinc-950/60 border border-zinc-900 rounded-2xl space-y-2">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-rose-400" />
                <span>Media Sanitization &amp; Decommissioning Standards</span>
              </h3>
              <p>
                In compliance with <strong>NIST SP 800-88 Revision 1</strong> (&apos;Guidelines for Media Sanitization&apos;) and <strong>DoD 5220.22-M</strong> standards, underlying storage hardware in Google Cloud facilities undergoes rigorous multi-pass cryptographic erasure prior to re-allocation, and physical magnetic or solid-state media slated for decommissioning is physically shredded or degaussed. Centralized software caches and temporary upload buffers are purged immediately upon session termination.
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 11: Data Retention Schedules */}
        <section id="retention" className="space-y-6">
          <div className="border-b border-zinc-900 pb-3">
            <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight flex items-center gap-2.5">
              <span className="text-cyan-400 text-sm font-mono">[11]</span> Data Retention, Archival &amp; Deletion Schedules
            </h2>
            <p className="text-xs text-zinc-500 font-mono mt-1">Explicit retention windows for each classification of stored information.</p>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-zinc-900 bg-zinc-950/60">
            <table className="w-full text-left border-collapse min-w-[620px] text-xs">
              <thead>
                <tr className="bg-zinc-900/60 border-b border-zinc-900 text-zinc-400 font-mono text-[11px] uppercase">
                  <th className="p-4 font-bold">Data Category</th>
                  <th className="p-4 font-bold">Retention Horizon</th>
                  <th className="p-4 font-bold">Deletion &amp; Archival Protocol</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-900 text-zinc-400 leading-normal">
                <tr>
                  <td className="p-4 font-mono font-bold text-white">Account Profile &amp; Auth Tokens</td>
                  <td className="p-4">Duration of active account tenure.</td>
                  <td className="p-4">Permanently purged within 30 days of receiving a verified account deletion request.</td>
                </tr>
                <tr>
                  <td className="p-4 font-mono font-bold text-white">Fiscal &amp; Subscription Records</td>
                  <td className="p-4">7 years following transaction date.</td>
                  <td className="p-4">Required by statutory corporate tax, audit, and anti-fraud regulations.</td>
                </tr>
                <tr>
                  <td className="p-4 font-mono font-bold text-white">Server Access &amp; Security Logs</td>
                  <td className="p-4">90 days rolling window.</td>
                  <td className="p-4">Automatically overwritten and purged via automated log rotation scripts.</td>
                </tr>
                <tr>
                  <td className="p-4 font-mono font-bold text-white">Customer Support Inquiries</td>
                  <td className="p-4">2 years following ticket resolution.</td>
                  <td className="p-4">Archived to reference past copyright disputes or ownership resolutions.</td>
                </tr>
                <tr>
                  <td className="p-4 font-mono font-bold text-white">On-Chain Blockchain Data</td>
                  <td className="p-4">Indefinite / Permanent.</td>
                  <td className="p-4">Inherent to decentralized cryptographic consensus mechanisms.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* SECTION 12: Data Deletion, Export & Google Access Revocation Guide */}
        <section id="deletion-revocation" className="space-y-6">
          <div className="border-b border-zinc-900 pb-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight flex items-center gap-2.5">
                <span className="text-cyan-400 text-sm font-mono">[12]</span> Data Deletion, Export &amp; Google Access Revocation Guide
              </h2>
              <p className="text-xs text-zinc-500 font-mono mt-1">Direct controls and step-by-step instructions for disconnecting Google OAuth, exporting assets, and erasing off-chain data.</p>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 rounded-full text-[11px] font-mono whitespace-nowrap self-start sm:self-auto">
              <Key className="w-3.5 h-3.5" />
              <span>SELF-SERVE &amp; VERIFIED CONTROLS</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Guide Card 1: Google OAuth Revocation */}
            <div className="p-6 bg-zinc-950/80 border border-zinc-900 hover:border-cyan-500/40 rounded-2xl space-y-4 flex flex-col justify-between transition-all">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-950/60 text-cyan-400 border border-cyan-800/40">
                    OAUTH ACCESS REVOCATION
                  </span>
                  <ExternalLink className="w-4 h-4 text-zinc-500" />
                </div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Key className="w-4 h-4 text-cyan-400" /> Revoke Google Account Access
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  You maintain unilateral control to disconnect Sovranly IP from your Google Account at any second via Google&apos;s security dashboard:
                </p>
                <ol className="list-decimal list-inside text-xs text-zinc-400 space-y-2 pl-1 leading-relaxed">
                  <li>Navigate to <a href="https://myaccount.google.com/connections" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline inline-flex items-center gap-1">Google Third-party apps &amp; services <ExternalLink className="w-3 h-3 inline" /></a>.</li>
                  <li>Scroll to or search for <strong className="text-white">Sovranly IP</strong> in your connected apps list.</li>
                  <li>Click on <strong className="text-white">Sovranly IP</strong> and select <strong className="text-white">&apos;Delete all connections you have with Sovranly IP&apos;</strong> or <strong className="text-white">&apos;Remove Access&apos;</strong>.</li>
                  <li>Confirm the prompt. Google immediately revokes active OAuth refresh tokens.</li>
                </ol>
                <p className="text-[11px] text-zinc-500 bg-zinc-900/50 p-3 rounded-xl border border-zinc-800/80 leading-relaxed">
                  <strong className="text-zinc-300">Zero Trust Invalidation:</strong> Our backend continuously checks token validity. Once Google revokes access, your active session on Sovranly IP is immediately invalidated and no further profile requests can succeed.
                </p>
              </div>

              <div className="pt-2">
                <a
                  href="https://myaccount.google.com/connections"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 hover:border-cyan-500/50 rounded-xl text-xs font-mono text-cyan-400 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" /> Manage Google Permissions
                </a>
              </div>
            </div>

            {/* Guide Card 2: Account Erasure */}
            <div className="p-6 bg-zinc-950/80 border border-zinc-900 hover:border-rose-500/40 rounded-2xl space-y-4 flex flex-col justify-between transition-all">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-950/60 text-rose-400 border border-rose-800/40">
                    GDPR ART. 17 &bull; CCPA ERASURE
                  </span>
                  <Trash2 className="w-4 h-4 text-zinc-500" />
                </div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Trash2 className="w-4 h-4 text-rose-400" /> Permanent Off-Chain Erasure
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Demand the irreversible deletion of your personal data and creative catalog records from all Sovranly IP servers:
                </p>
                <ul className="list-disc list-inside text-xs text-zinc-400 space-y-1.5 pl-1 leading-relaxed">
                  <li><strong className="text-zinc-200">What is Purged:</strong> Your name, Google email, avatar, Firestore profile document, unanchored drafts, payment customer linkages, telemetry records, and audio stem caches.</li>
                  <li><strong className="text-zinc-200">On-Chain Decoupling:</strong> Smart contract splits and cryptographic hashes confirmed on public EVM blockchains cannot be rolled back, but all off-chain pointers to your identity are permanently erased.</li>
                  <li><strong className="text-zinc-200">Execution Window:</strong> Completed within 30 calendar days of cryptographic verification at zero cost.</li>
                </ul>
                <div className="p-3 bg-rose-950/20 border border-rose-900/40 rounded-xl text-[11px] text-rose-300 leading-relaxed font-mono">
                  Email <code className="text-white font-bold">create@sovranlyip.com</code> with subject line <code className="text-rose-400 font-bold">&apos;Account Erasure Request&apos;</code> from your registered email address.
                </div>
              </div>

              <div className="pt-2">
                <a
                  href="mailto:create@sovranlyip.com?subject=Account%20Erasure%20Request"
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-rose-950/30 hover:bg-rose-950/60 border border-rose-800/50 rounded-xl text-xs font-mono text-rose-300 transition-colors"
                >
                  <Mail className="w-3.5 h-3.5" /> Request Full Erasure
                </a>
              </div>
            </div>

            {/* Guide Card 3: Data Portability & Export */}
            <div className="p-6 bg-zinc-950/80 border border-zinc-900 hover:border-violet-500/40 rounded-2xl space-y-4 flex flex-col justify-between transition-all">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-violet-950/60 text-violet-400 border border-violet-800/40">
                    GDPR ART. 20 PORTABILITY
                  </span>
                  <Download className="w-4 h-4 text-zinc-500" />
                </div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Download className="w-4 h-4 text-violet-400" /> Data Portability &amp; Catalog Export
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Export all intellectual property assets, license contracts, and royalty history in open standard formats:
                </p>
                <ul className="list-disc list-inside text-xs text-zinc-400 space-y-1.5 pl-1 leading-relaxed">
                  <li><strong className="text-zinc-200">Delivered Formats:</strong> Structured JSON catalog archive, cryptographic SHA-256 / keccak256 checksum manifest, and CSV royalty logs.</li>
                  <li><strong className="text-zinc-200">Interoperability:</strong> Formatted for seamless migration to external digital rights management tools, accounting suites, or sovereign backup drives.</li>
                  <li><strong className="text-zinc-200">Verification:</strong> Dispatched securely via encrypted download link after challenge verification.</li>
                </ul>
                <div className="p-3 bg-violet-950/20 border border-violet-900/40 rounded-xl text-[11px] text-violet-300 leading-relaxed font-mono">
                  Email <code className="text-white font-bold">create@sovranlyip.com</code> with subject line <code className="text-violet-400 font-bold">&apos;Data Portability Request&apos;</code> to receive your export package.
                </div>
              </div>

              <div className="pt-2">
                <a
                  href="mailto:create@sovranlyip.com?subject=Data%20Portability%20Request"
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-violet-950/30 hover:bg-violet-950/60 border border-violet-800/50 rounded-xl text-xs font-mono text-violet-300 transition-colors"
                >
                  <Mail className="w-3.5 h-3.5" /> Request Catalog Export
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 13: Your Statutory Rights & Recourse (GDPR Arts. 15-22 & CCPA/CPRA) */}
        <section id="rights" className="space-y-6">
          <div className="border-b border-zinc-900 pb-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight flex items-center gap-2.5">
                <span className="text-cyan-400 text-sm font-mono">[13]</span> Your Statutory Rights &amp; Recourse (GDPR Arts. 15-22 &amp; CCPA/CPRA)
              </h2>
              <p className="text-xs text-zinc-500 font-mono mt-1">Granular legal protections, statutory timelines, verification protocols, and supervisory authority recourse.</p>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-cyan-950/40 border border-cyan-500/30 text-cyan-400 rounded-full text-[11px] font-mono whitespace-nowrap self-start sm:self-auto">
              <Scale className="w-3.5 h-3.5" />
              <span>STATUTORY RECOURSE</span>
            </div>
          </div>

          {/* Granular Rights Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs leading-relaxed text-zinc-400">
            <div className="p-5 bg-zinc-950/60 border border-zinc-900 rounded-2xl space-y-2">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Check className="w-4 h-4 text-cyan-400" /> Right of Access (Art. 15)
              </h3>
              <p>Receive confirmation as to whether your personal data is processed, copies of stored records, purposes of processing, categories, and recipients.</p>
            </div>

            <div className="p-5 bg-zinc-950/60 border border-zinc-900 rounded-2xl space-y-2">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" /> Rectification (Art. 16)
              </h3>
              <p>Demand the immediate correction of inaccurate personal records or completion of incomplete profiles without undue delay.</p>
            </div>

            <div className="p-5 bg-zinc-950/60 border border-zinc-900 rounded-2xl space-y-2">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Check className="w-4 h-4 text-rose-400" /> Erasure / Forgotten (Art. 17)
              </h3>
              <p>Demand irreversible erasure of off-chain records where data is no longer necessary or consent has been withdrawn.</p>
            </div>

            <div className="p-5 bg-zinc-950/60 border border-zinc-900 rounded-2xl space-y-2">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Check className="w-4 h-4 text-amber-400" /> Restrict Processing (Art. 18)
              </h3>
              <p>Require suspension of active processing during accuracy verification or while copyright ownership claims are formally arbitrated.</p>
            </div>

            <div className="p-5 bg-zinc-950/60 border border-zinc-900 rounded-2xl space-y-2">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Check className="w-4 h-4 text-violet-400" /> Data Portability (Art. 20)
              </h3>
              <p>Obtain your registered catalog, metadata schemas, and contracts in a structured, commonly used, machine-readable JSON/CSV format.</p>
            </div>

            <div className="p-5 bg-zinc-950/60 border border-zinc-900 rounded-2xl space-y-2">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Check className="w-4 h-4 text-indigo-400" /> Right to Object (Art. 21)
              </h3>
              <p>Object on grounds relating to your particular situation against processing based on legitimate interests, with an absolute right to halt marketing.</p>
            </div>

            <div className="p-5 bg-zinc-950/60 border border-zinc-900 rounded-2xl space-y-2">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Check className="w-4 h-4 text-sky-400" /> Non-Profiling (Art. 22)
              </h3>
              <p>Protection from decisions based solely on automated processing producing legal or significant personal effects.</p>
            </div>

            <div className="p-5 bg-zinc-950/60 border border-zinc-900 rounded-2xl space-y-2">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Check className="w-4 h-4 text-teal-400" /> Non-Discrimination (CCPA)
              </h3>
              <p>Never experience denial of goods, differential rates, or reduced service quality for exercising any California or international privacy rights.</p>
            </div>
          </div>

          {/* Verification Protocol & Timeline */}
          <div className="p-5 bg-zinc-900/40 border border-zinc-800 rounded-2xl space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <span>Identity Verification Protocol &amp; Statutory Resolution Timelines</span>
            </h3>
            <p className="text-xs text-zinc-300 leading-relaxed">
              To prevent unauthorized data exfiltration or fraudulent erasure, all requests must undergo cryptographic or out-of-band identity verification:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-zinc-400 font-mono">
              <div className="p-3 bg-zinc-950/70 border border-zinc-800/80 rounded-xl space-y-1">
                <span className="text-cyan-400 font-bold">1. OAuth Challenge</span>
                <p className="text-[11px] font-sans">Verification dispatched directly to the active Google Account email registered to the creator profile.</p>
              </div>
              <div className="p-3 bg-zinc-950/70 border border-zinc-800/80 rounded-xl space-y-1">
                <span className="text-cyan-400 font-bold">2. EIP-712 Signature</span>
                <p className="text-[11px] font-sans">Cryptographic message signing using the private key corresponding to the public wallet address.</p>
              </div>
              <div className="p-3 bg-zinc-950/70 border border-zinc-800/80 rounded-xl space-y-1">
                <span className="text-cyan-400 font-bold">3. 30-Day Resolution</span>
                <p className="text-[11px] font-sans">Statutory resolution within 30 calendar days at zero cost (extendable by 60 days for complex requests with notice).</p>
              </div>
            </div>
          </div>

          {/* Supervisory Authority Recourse Table */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Scale className="w-4 h-4 text-amber-400" />
              <span>Right to Lodge a Formal Regulatory Complaint (GDPR Art. 77 &amp; CCPA Recourse)</span>
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Pursuant to GDPR Article 77, if you reside in the European Economic Area or United Kingdom and consider our processing of your personal data to infringe statutory privacy regulations, you possess the unalienable right to lodge a formal complaint with a competent Supervisory Authority in your Member State of habitual residence, place of work, or place of the alleged infringement:
            </p>

            <div className="overflow-x-auto rounded-2xl border border-zinc-900 bg-zinc-950/60">
              <table className="w-full text-left border-collapse min-w-[640px] text-xs">
                <thead>
                  <tr className="bg-zinc-900/60 border-b border-zinc-900 text-zinc-400 font-mono text-[11px] uppercase">
                    <th className="p-4 font-bold">Supervisory Authority</th>
                    <th className="p-4 font-bold">Jurisdiction</th>
                    <th className="p-4 font-bold">Statutory Competence</th>
                    <th className="p-4 font-bold">Official Portal &amp; Recourse</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-900 text-zinc-400 leading-normal">
                  <tr>
                    <td className="p-4 font-mono font-bold text-white">Data Protection Commission (DPC)</td>
                    <td className="p-4">Ireland / EU Lead Authority</td>
                    <td className="p-4">General Data Protection Regulation (GDPR) oversight across EU cloud infrastructures.</td>
                    <td className="p-4 font-mono text-cyan-400">
                      <a href="https://www.dataprotection.ie" target="_blank" rel="noopener noreferrer" className="hover:underline flex items-center gap-1">
                        dataprotection.ie <ExternalLink className="w-3 h-3" />
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td className="p-4 font-mono font-bold text-white">Information Commissioner&apos;s Office (ICO)</td>
                    <td className="p-4">United Kingdom</td>
                    <td className="p-4">UK GDPR and Data Protection Act 2018 enforcement.</td>
                    <td className="p-4 font-mono text-cyan-400">
                      <a href="https://ico.org.uk" target="_blank" rel="noopener noreferrer" className="hover:underline flex items-center gap-1">
                        ico.org.uk <ExternalLink className="w-3 h-3" />
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td className="p-4 font-mono font-bold text-white">CNIL (Commission Nationale)</td>
                    <td className="p-4">France</td>
                    <td className="p-4">French Data Protection Act &amp; GDPR compliance enforcement.</td>
                    <td className="p-4 font-mono text-cyan-400">
                      <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" className="hover:underline flex items-center gap-1">
                        cnil.fr <ExternalLink className="w-3 h-3" />
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td className="p-4 font-mono font-bold text-white">BfDI (Federal Commissioner)</td>
                    <td className="p-4">Germany</td>
                    <td className="p-4">Federal Data Protection Act (BDSG) &amp; European GDPR oversight.</td>
                    <td className="p-4 font-mono text-cyan-400">
                      <a href="https://www.bfdi.bund.de" target="_blank" rel="noopener noreferrer" className="hover:underline flex items-center gap-1">
                        bfdi.bund.de <ExternalLink className="w-3 h-3" />
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td className="p-4 font-mono font-bold text-white">California Privacy Protection Agency (CPPA)</td>
                    <td className="p-4">California, United States</td>
                    <td className="p-4">California Consumer Privacy Act (CCPA) and California Privacy Rights Act (CPRA).</td>
                    <td className="p-4 font-mono text-cyan-400">
                      <a href="https://cppa.ca.gov" target="_blank" rel="noopener noreferrer" className="hover:underline flex items-center gap-1">
                        cppa.ca.gov <ExternalLink className="w-3 h-3" />
                      </a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* SECTION 14: Zero Trust Cryptographic Security Architecture & Breach Notification (GDPR Arts. 32-34) */}
        <section id="security" className="space-y-6">
          <div className="border-b border-zinc-900 pb-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight flex items-center gap-2.5">
                <span className="text-cyan-400 text-sm font-mono">[14]</span> Zero Trust Cryptographic Security &amp; Breach Protocols (GDPR Arts. 32-34)
              </h2>
              <p className="text-xs text-zinc-500 font-mono mt-1">Technical mechanisms protecting data integrity and mandatory 72-hour incident response obligations.</p>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-violet-950/40 border border-violet-500/30 text-violet-400 rounded-full text-[11px] font-mono whitespace-nowrap self-start sm:self-auto">
              <Shield className="w-3.5 h-3.5" />
              <span>ZERO TRUST CRYPTOGRAPHY</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-zinc-400 leading-relaxed">
            <div className="p-5 bg-zinc-950/60 border border-zinc-900 rounded-2xl space-y-2">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Lock className="w-4 h-4 text-cyan-400" /> End-to-End Cryptographic Encryption (Art. 32(1)(a))
              </h3>
              <p>All network traffic in transit is encrypted utilizing modern Transport Layer Security (TLS 1.3) with ephemeral Diffie-Hellman key exchanges (ECDHE). Data at rest in Cloud Firestore and Cloud Storage is encrypted with military-grade AES-256-GCM algorithms backed by FIPS 140-2 Level 3 KMS hardware security modules.</p>
            </div>

            <div className="p-5 bg-zinc-950/60 border border-zinc-900 rounded-2xl space-y-2">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-violet-400" /> Continuous Token Authorization (Zero Trust)
              </h3>
              <p>In accordance with Zero Trust principles, no internal network perimeter or service mesh is trusted implicitly. Every incoming API request cryptographically verifies short-lived JSON Web Tokens (JWTs) and validates caller ownership before executing state transformations.</p>
            </div>

            <div className="p-5 bg-zinc-950/60 border border-zinc-900 rounded-2xl space-y-2">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Cpu className="w-4 h-4 text-emerald-400" /> Non-Custodial Architecture &amp; Client-Side Signing
              </h3>
              <p>We do not hold, store, or escrow private keys or seed phrases. Web3 transactions, licensing agreements, and smart contract deployments require explicit client-side signing via external Web3 providers (MetaMask, Coinbase Wallet, WalletConnect), ensuring platform servers cannot sign unauthorized transactions.</p>
            </div>

            <div className="p-5 bg-zinc-950/60 border border-zinc-900 rounded-2xl space-y-2">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Server className="w-4 h-4 text-amber-400" /> Automated Vulnerability Scanning &amp; Static Analysis
              </h3>
              <p>Smart contracts undergo static analysis, formal verification routines, and fuzz testing against reentrancy, integer overflows, and front-running vectors. Containerized cloud run instances are continuously audited via automated vulnerability scanners.</p>
            </div>
          </div>

          {/* Statutory 72-Hour Breach Notification Protocol */}
          <div className="p-6 bg-rose-950/20 border border-rose-900/40 rounded-2xl space-y-3 text-xs leading-relaxed">
            <div className="flex items-center gap-2 text-rose-300 font-bold text-sm">
              <AlertCircle className="w-5 h-5 text-rose-400" />
              <h3>Statutory Personal Data Breach Incident Response (GDPR Arts. 33 &amp; 34)</h3>
            </div>
            <p className="text-rose-200/90">
              In the event of a confirmed security incident resulting in the accidental or unlawful destruction, loss, alteration, unauthorized disclosure of, or access to personal data, Sovranly IP executes the following statutory breach containment and notification protocol:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-zinc-300 pt-1">
              <div className="p-4 bg-zinc-950/80 border border-zinc-900 rounded-xl space-y-1.5">
                <h4 className="font-bold text-white flex items-center gap-1.5 font-mono text-[11px] text-cyan-400">
                  <span>[GDPR ART. 33]</span> SUPERVISORY AUTHORITY NOTIFICATION
                </h4>
                <p className="text-[11px] text-zinc-400">
                  Notification without undue delay, and where feasible, <strong>not later than 72 hours</strong> after becoming aware of the breach to competent lead authorities (e.g., Data Protection Commission), detailing nature of incident, categories and approximate number of data subjects affected, contact details of the DPO, likely consequences, and remediation measures taken.
                </p>
              </div>

              <div className="p-4 bg-zinc-950/80 border border-zinc-900 rounded-xl space-y-1.5">
                <h4 className="font-bold text-white flex items-center gap-1.5 font-mono text-[11px] text-rose-400">
                  <span>[GDPR ART. 34]</span> DIRECT DATA SUBJECT COMMUNICATION
                </h4>
                <p className="text-[11px] text-zinc-400">
                  When a personal data breach is likely to result in a high risk to the rights and freedoms of natural persons, Sovranly IP communicates the incident directly to affected creators via registered email and public platform bulletin <strong>within 48 hours</strong>, detailing clear mitigation steps and security advisory notices.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 15: International Transfers & Cross-Border Safeguards (SCCs & DPF) */}
        <section id="transfers" className="space-y-6">
          <div className="border-b border-zinc-900 pb-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight flex items-center gap-2.5">
                <span className="text-cyan-400 text-sm font-mono">[15]</span> International Transfers &amp; Cross-Border Safeguards (SCCs &amp; DPF)
              </h2>
              <p className="text-xs text-zinc-500 font-mono mt-1">Cross-border transfer mechanisms, European Commission Standard Contractual Clauses, and Data Privacy Framework compliance.</p>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-cyan-950/40 border border-cyan-500/30 text-cyan-400 rounded-full text-[11px] font-mono whitespace-nowrap self-start sm:self-auto">
              <Globe className="w-3.5 h-3.5" />
              <span>CROSS-BORDER TRANSFERS</span>
            </div>
          </div>

          <div className="space-y-4 text-xs text-zinc-300 leading-relaxed">
            <p>
              Sovranly IP is headquartered and operated from primary secure computing facilities in the <strong>United States of America</strong>, supplemented by global edge caching distribution networks. If you access or interact with the platform from the <strong>European Economic Area (EEA)</strong>, the <strong>United Kingdom</strong>, <strong>Switzerland</strong>, or other international jurisdictions with extraterritorial data protection frameworks, your personal information is transferred to and processed within the United States.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-zinc-400">
              <div className="p-4 bg-zinc-950/60 border border-zinc-900 rounded-2xl space-y-2">
                <h3 className="font-bold text-white flex items-center gap-1.5 font-mono text-[11px] text-cyan-400">
                  <span>[EU SCCs]</span> STANDARD CONTRACTUAL CLAUSES
                </h3>
                <p className="text-[11px]">
                  For transfers of personal data originating in the EEA to third countries lacking adequacy decisions under GDPR Article 45, Sovranly IP relies on the European Commission&apos;s Standard Contractual Clauses (Implementing Decision (EU) 2021/914), incorporating Module 1 (Controller-to-Controller) and Module 2 (Controller-to-Processor) data processing agreements with all cloud infrastructure subprocessors.
                </p>
              </div>

              <div className="p-4 bg-zinc-950/60 border border-zinc-900 rounded-2xl space-y-2">
                <h3 className="font-bold text-white flex items-center gap-1.5 font-mono text-[11px] text-violet-400">
                  <span>[DPF COMPLIANCE]</span> DATA PRIVACY FRAMEWORK
                </h3>
                <p className="text-[11px]">
                  Sovranly IP adheres to the principles of the EU-U.S. Data Privacy Framework (EU-U.S. DPF), the UK Extension to the EU-U.S. DPF, and the Swiss-U.S. Data Privacy Framework as set forth by the U.S. Department of Commerce regarding the collection, processing, and retention of personal information from member countries.
                </p>
              </div>

              <div className="p-4 bg-zinc-950/60 border border-zinc-900 rounded-2xl space-y-2">
                <h3 className="font-bold text-white flex items-center gap-1.5 font-mono text-[11px] text-emerald-400">
                  <span>[SCHREMS II / TIAs]</span> SUPPLEMENTARY MEASURES
                </h3>
                <p className="text-[11px]">
                  In accordance with the CJEU <em>Schrems II</em> ruling (Case C-311/18) and EDPB Recommendations 01/2020, Sovranly IP conducts comprehensive Transfer Impact Assessments (TIAs) and enforces strict supplementary technical measures: full cryptographic payload encryption at rest (AES-256-GCM), TLS 1.3 in transit, and customer-managed KMS key ownership preventing unmonitored foreign surveillance access.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 16: Children's Privacy */}
        <section id="children" className="space-y-6">
          <div className="border-b border-zinc-900 pb-3">
            <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight flex items-center gap-2.5">
              <span className="text-cyan-400 text-sm font-mono">[16]</span> Children’s Online Privacy Protections (COPPA &amp; GDPR Art. 8)
            </h2>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Sovranly IP is an enterprise intellectual property and smart contract management platform designed strictly for creators who are at least 18 years of age (or the legal age of majority in their jurisdiction). We do not knowingly solicit, collect, or process personal data from individuals under 18 under the Children’s Online Privacy Protection Act (COPPA, 15 U.S.C. 6501–6506) or GDPR Article 8. If we discover that personal information of a minor has been inadvertently recorded, we will take immediate measures to permanently eradicate such records from our databases. If you believe a minor has registered an account, please notify us immediately at <a href="mailto:create@sovranlyip.com" className="text-cyan-400 hover:underline">create@sovranlyip.com</a>.
          </p>
        </section>

        {/* SECTION 17: Interactive Storage & Cookie Governance Matrix */}
        <section id="audit-ledger" className="space-y-6">
          <div className="border-b border-zinc-900 pb-3 flex items-center justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight flex items-center gap-2.5">
                <span className="text-cyan-400 text-sm font-mono">[17]</span> Storage &amp; Cookie Governance Matrix
              </h2>
              <p className="text-xs text-zinc-500 font-mono mt-1">Live, transparent ledger of localized parameters, cookies, and tokens.</p>
            </div>
          </div>

          <div className="p-6 md:p-8 bg-zinc-950 border border-zinc-900 rounded-3xl space-y-6 relative overflow-hidden shadow-2xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-900 pb-5">
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-mono tracking-widest text-cyan-400 font-black flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5" /> Dynamic Cryptographic Audit
                </span>
                <h3 className="text-base font-black text-white uppercase tracking-tight">Active Client State &amp; Local Verification</h3>
              </div>

              {receipt && (
                <button
                  onClick={handlePurgeAndReset}
                  className="px-3.5 py-2 bg-rose-950/20 hover:bg-rose-950/40 border border-rose-500/30 rounded-xl text-xs font-mono text-rose-400 transition-all flex items-center gap-1.5 self-start md:self-auto cursor-pointer shadow-sm"
                >
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '6s' }} /> Purge Local Signature &amp; Reset
                </button>
              )}
            </div>

            {/* Current Receipt Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-zinc-900/40 border border-zinc-900 rounded-2xl space-y-2">
                <h4 className="text-[11px] font-mono font-black text-zinc-400 uppercase">Your Active Consent Signature</h4>
                {receipt ? (
                  <div className="space-y-1">
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 bg-emerald-950/40 border border-emerald-900/30 px-2.5 py-0.5 rounded-full">
                      <ShieldCheck className="w-3.5 h-3.5" /> SECURED &amp; ACTIVE
                    </span>
                    <p className="font-mono text-[10px] text-zinc-300 truncate pt-1">
                      <span className="text-zinc-500">HASH:</span> {receipt.hash}
                    </p>
                    <p className="font-mono text-[9px] text-zinc-400">
                      <span className="text-zinc-500">TIMESTAMP:</span> {new Date(receipt.timestamp).toLocaleString()}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 bg-amber-950/40 border border-amber-900/30 px-2.5 py-0.5 rounded-full">
                      <ShieldAlert className="w-3.5 h-3.5" /> PENDING EXPLICIT SIGNATURE
                    </span>
                    <p className="text-[11px] text-zinc-500 pt-1 leading-relaxed">
                      No custom consent receipt detected. The platform is currently enforcing high-privacy zero-knowledge defaults.
                    </p>
                  </div>
                )}
              </div>

              <div className="p-4 bg-zinc-900/40 border border-zinc-900 rounded-2xl space-y-2">
                <h4 className="text-[11px] font-mono font-black text-zinc-400 uppercase">Zero-Trust Directive Verification</h4>
                <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                  Unlike traditional third-party cookie banners that transmit user profiles to cloud ad servers, Sovranly IP computes and validates your consent signature locally in your browser sandbox.
                </p>
              </div>
            </div>

            {/* Audit Ledger Table */}
            <div className="overflow-x-auto rounded-2xl border border-zinc-900 bg-zinc-950/60">
              <table className="w-full text-left border-collapse min-w-[620px] text-xs">
                <thead>
                  <tr className="bg-zinc-900/50 border-b border-zinc-900 text-[10px] font-mono uppercase text-zinc-500">
                    <th className="p-4 font-bold">Key / Cookie Name</th>
                    <th className="p-4 font-bold">Storage Type</th>
                    <th className="p-4 font-bold">Category</th>
                    <th className="p-4 font-bold">Retention</th>
                    <th className="p-4 font-bold">Purpose Description</th>
                    <th className="p-4 font-bold">Current Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-900 text-zinc-400 leading-normal">
                  <tr>
                    <td className="p-4 font-mono font-bold text-white text-[11px]">sovranly_theme</td>
                    <td className="p-4 font-mono text-[10px]">LocalStorage</td>
                    <td className="p-4 text-violet-400 font-semibold">User Preference</td>
                    <td className="p-4">Persistent</td>
                    <td className="p-4 text-zinc-400">Stores your preferred UI color scheme (Light Mode vs. Dark Mode) across sessions.</td>
                    <td className="p-4">
                      <span className="text-emerald-400 font-bold flex items-center gap-1"><Check className="w-3 h-3" /> ACTIVE</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="p-4 font-mono font-bold text-white text-[11px]">sovranly_cookie_consent_receipt</td>
                    <td className="p-4 font-mono text-[10px]">LocalStorage</td>
                    <td className="p-4 text-emerald-400 font-semibold">Sovereign Compliance</td>
                    <td className="p-4">Persistent</td>
                    <td className="p-4 text-zinc-400">Records your custom compliance signature, timestamp, and consent vectors to prevent re-prompt overlays.</td>
                    <td className="p-4">
                      {receipt ? (
                        <span className="text-emerald-400 font-bold flex items-center gap-1"><Check className="w-3 h-3" /> ACTIVE</span>
                      ) : (
                        <span className="text-zinc-600 font-mono italic">INACTIVE</span>
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td className="p-4 font-mono font-bold text-white text-[11px]">sovranly_essential_consent</td>
                    <td className="p-4 font-mono text-[10px]">Cookie / Local</td>
                    <td className="p-4 text-emerald-400 font-semibold">Core Essential</td>
                    <td className="p-4">1 Year</td>
                    <td className="p-4 text-zinc-400">Maintains zero-trust session security tokens, wallet connection addresses, and routing destinations.</td>
                    <td className="p-4">
                      <span className="text-emerald-400 font-bold flex items-center gap-1"><Check className="w-3 h-3" /> ALWAYS ON</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="p-4 font-mono font-bold text-white text-[11px]">sovranly_analytics_consent</td>
                    <td className="p-4 font-mono text-[10px]">Cookie / Local</td>
                    <td className="p-4 text-cyan-400 font-semibold">Diagnostics</td>
                    <td className="p-4">1 Year</td>
                    <td className="p-4 text-zinc-400">Permits localized performance diagnostic tests and Google Analytics 4 telemetry to optimize global platform rendering.</td>
                    <td className="p-4 font-mono">
                      {receipt && receipt.analytics ? (
                        <span className="text-cyan-400 font-bold flex items-center gap-1"><Check className="w-3 h-3" /> ENABLED</span>
                      ) : (
                        <span className="text-zinc-600 italic">DISABLED</span>
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td className="p-4 font-mono font-bold text-white text-[11px]">sovranly_preferences_consent</td>
                    <td className="p-4 font-mono text-[10px]">Cookie / Local</td>
                    <td className="p-4 text-violet-400 font-semibold">UI Persistence</td>
                    <td className="p-4">1 Year</td>
                    <td className="p-4 text-zinc-400">Caches sidebar open/closed states, layout density modes, and developer tool selections.</td>
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
        </section>

        {/* SECTION 18: Data & Privacy FAQ */}
        <section id="privacy-faq" className="space-y-6">
          <div className="border-b border-zinc-900 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight flex items-center gap-2.5">
                <span className="text-cyan-400 text-sm font-mono">[18]</span> Data &amp; Privacy Frequently Asked Questions (FAQ)
              </h2>
              <p className="text-xs text-zinc-500 font-mono mt-1">
                Authoritative compliance clarifications regarding IP metadata, wallet addresses, and third-party processors.
              </p>
            </div>
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <button
                onClick={expandAllFaqs}
                className="px-3 py-1.5 bg-zinc-900/80 hover:bg-zinc-800 text-[11px] font-mono text-cyan-400 border border-zinc-800 rounded-lg transition-colors cursor-pointer"
              >
                Expand All
              </button>
              <button
                onClick={collapseAllFaqs}
                className="px-3 py-1.5 bg-zinc-900/80 hover:bg-zinc-800 text-[11px] font-mono text-zinc-400 border border-zinc-800 rounded-lg transition-colors cursor-pointer"
              >
                Collapse All
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {/* FAQ 1: IP Metadata */}
            <div className="border border-zinc-900 bg-zinc-950/70 rounded-2xl overflow-hidden transition-all">
              <button
                onClick={() => toggleFaq('faq-metadata')}
                className="w-full p-5 text-left flex items-start justify-between gap-4 hover:bg-zinc-900/30 transition-colors cursor-pointer"
              >
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-950/60 text-cyan-400 border border-cyan-800/40">
                      IP METADATA &amp; ASSETS
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono text-zinc-500 border border-zinc-800">
                      GDPR ART. 5(1)(c)
                    </span>
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-white">
                    How does Sovranly IP handle, store, and protect my creative works, media files, and catalog metadata?
                  </h3>
                </div>
                <div className="p-1 rounded-lg bg-zinc-900 text-zinc-400 mt-1 flex-shrink-0">
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${expandedFaqs['faq-metadata'] ? 'rotate-180 text-cyan-400' : ''}`} />
                </div>
              </button>

              {expandedFaqs['faq-metadata'] && (
                <div className="px-5 pb-5 pt-2 text-xs text-zinc-300 leading-relaxed space-y-3 border-t border-zinc-900/60">
                  <p>
                    Sovranly IP enforces <strong>Cryptographic Data Minimization</strong> across all catalog operations. When you register or notarize a work (such as an audio track, musical stem, video, cover artwork, or licensing contract), our system treats your raw media with the highest confidentiality:
                  </p>
                  <ul className="list-disc list-inside space-y-1.5 text-zinc-400 pl-1">
                    <li>
                      <strong className="text-zinc-200">Mathematical Hash Generation (SHA-256 / keccak256):</strong> Rather than storing unencrypted source masters on centralized public web servers, we generate deterministic cryptographic digests directly. This cryptographic hash proves existence and prior art timestamping without exposing your underlying creative files.
                    </li>
                    <li>
                      <strong className="text-zinc-200">Decentralized Content Addressing (IPFS):</strong> Assets pinned for public distribution or licensing verification are converted into content identifiers (CIDs) on the InterPlanetary File System (IPFS), shielding creators against single-point-of-failure server disruptions.
                    </li>
                    <li>
                      <strong className="text-zinc-200">Catalog Metadata Security:</strong> Associated track attributes (ISRC, ISWC, songwriter credits, publishing splits, and licensing terms) are maintained in Google Cloud Firestore protected by continuous Zero Trust access rules and encrypted at rest with AES-256.
                    </li>
                    <li>
                      <strong className="text-zinc-200">Anti-Scraping Protection:</strong> Your catalog metadata and audio stems are explicitly protected against automated scraping, indexing by AI model crawlers, or unauthorized bulk extraction.
                    </li>
                  </ul>
                </div>
              )}
            </div>

            {/* FAQ 2: Wallet Addresses */}
            <div className="border border-zinc-900 bg-zinc-950/70 rounded-2xl overflow-hidden transition-all">
              <button
                onClick={() => toggleFaq('faq-wallets')}
                className="w-full p-5 text-left flex items-start justify-between gap-4 hover:bg-zinc-900/30 transition-colors cursor-pointer"
              >
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-violet-950/60 text-violet-400 border border-violet-800/40">
                      WALLET ADDRESSES
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono text-zinc-500 border border-zinc-800">
                      GDPR RECITAL 30 • CCPA § 1798.140
                    </span>
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-white">
                    Are public blockchain wallet addresses treated as personal data, and how are they protected?
                  </h3>
                </div>
                <div className="p-1 rounded-lg bg-zinc-900 text-zinc-400 mt-1 flex-shrink-0">
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${expandedFaqs['faq-wallets'] ? 'rotate-180 text-violet-400' : ''}`} />
                </div>
              </button>

              {expandedFaqs['faq-wallets'] && (
                <div className="px-5 pb-5 pt-2 text-xs text-zinc-300 leading-relaxed space-y-3 border-t border-zinc-900/60">
                  <p>
                    Yes. Under European Union GDPR (Recital 30) and the California Consumer Privacy Act (CCPA/CPRA), public cryptographic wallet addresses (such as Ethereum/EVM addresses <code>0x...</code>) constitute <strong>pseudonymous personal data</strong> and online identifiers because they can theoretically be correlated with off-chain activity or transaction histories.
                  </p>
                  <p>
                    Sovranly IP processes your wallet address under the lawful basis of <strong>Contractual Necessity (Art. 6(1)(b) GDPR)</strong> to execute requested platform operations:
                  </p>
                  <ul className="list-disc list-inside space-y-1.5 text-zinc-400 pl-1">
                    <li>
                      <strong className="text-zinc-200">Non-Custodial Architecture:</strong> Sovranly IP <em>never</em> requests, collects, stores, or transmits your private keys or wallet recovery seed phrases. You hold sole cryptographic authority over your funds and signatures through your personal provider (e.g., MetaMask, Coinbase Wallet, WalletConnect).
                    </li>
                    <li>
                      <strong className="text-zinc-200">Purpose Limitation:</strong> Your wallet address is utilized exclusively to route automated smart contract royalty disbursements, verify asset ownership rights, and confirm cryptographic license signatures.
                    </li>
                    <li>
                      <strong className="text-zinc-200">Decoupling &amp; Isolation:</strong> Internal linkages between your Web3 wallet address and your Google OAuth email identity are protected by signed JSON Web Tokens (JWTs) and can be disconnected or deleted from our off-chain systems upon request.
                    </li>
                  </ul>
                </div>
              )}
            </div>

            {/* FAQ 3: Blockchain Immutability vs GDPR Article 17 */}
            <div className="border border-zinc-900 bg-zinc-950/70 rounded-2xl overflow-hidden transition-all">
              <button
                onClick={() => toggleFaq('faq-blockchain-gdpr')}
                className="w-full p-5 text-left flex items-start justify-between gap-4 hover:bg-zinc-900/30 transition-colors cursor-pointer"
              >
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-950/60 text-amber-400 border border-amber-800/40">
                      BLOCKCHAIN IMMUTABILITY
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono text-zinc-500 border border-zinc-800">
                      GDPR ART. 17 ERASURE
                    </span>
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-white">
                    How does Sovranly reconcile the GDPR &apos;Right to Erasure&apos; with the permanent immutability of blockchains?
                  </h3>
                </div>
                <div className="p-1 rounded-lg bg-zinc-900 text-zinc-400 mt-1 flex-shrink-0">
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${expandedFaqs['faq-blockchain-gdpr'] ? 'rotate-180 text-amber-400' : ''}`} />
                </div>
              </button>

              {expandedFaqs['faq-blockchain-gdpr'] && (
                <div className="px-5 pb-5 pt-2 text-xs text-zinc-300 leading-relaxed space-y-3 border-t border-zinc-900/60">
                  <p>
                    Decentralized blockchain networks (Ethereum, Arbitrum, Base, Optimism, Polygon) are structurally immutable—once a block is confirmed by distributed consensus, no central organization, government, or platform can rewrite, amend, or erase historical blocks.
                  </p>
                  <p>
                    Sovranly IP maintains rigorous compliance with GDPR Article 17 (&apos;Right to be Forgotten&apos;) and CCPA deletion mandates through our <strong>Dual-Layer Boundary Model</strong>:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                    <div className="p-3.5 bg-zinc-900/60 border border-zinc-800/80 rounded-xl space-y-1">
                      <h4 className="font-bold text-emerald-400 font-mono text-[11px] uppercase">Off-Chain Records (Fully Erasable)</h4>
                      <p className="text-zinc-400 text-[11px]">
                        Your name, Google OAuth profile, email address, customer billing pointers, telemetry logs, and catalog associations hosted in our cloud databases are permanently and irreversibly purged within 30 calendar days of receiving a verified deletion request.
                      </p>
                    </div>
                    <div className="p-3.5 bg-zinc-900/60 border border-zinc-800/80 rounded-xl space-y-1">
                      <h4 className="font-bold text-amber-400 font-mono text-[11px] uppercase">On-Chain Ledger (Stateless Hashes)</h4>
                      <p className="text-zinc-400 text-[11px]">
                        Because on-chain transactions cannot be deleted, we prevent personal data leakage by hashing all asset metadata off-chain. Transactions on-chain consist only of pseudonymous contract executions and wallet-to-wallet transfer events, with no plain-text PII recorded.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* FAQ 4: Third-Party Subprocessors */}
            <div className="border border-zinc-900 bg-zinc-950/70 rounded-2xl overflow-hidden transition-all">
              <button
                onClick={() => toggleFaq('faq-subprocessors')}
                className="w-full p-5 text-left flex items-start justify-between gap-4 hover:bg-zinc-900/30 transition-colors cursor-pointer"
              >
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-950/60 text-emerald-400 border border-emerald-800/40">
                      THIRD-PARTY SUBPROCESSORS
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono text-zinc-500 border border-zinc-800">
                      GDPR ART. 28 • CCPA SERVICE PROVIDERS
                    </span>
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-white">
                    Which third-party vendors process my data, and what contractual compliance safeguards are enforced?
                  </h3>
                </div>
                <div className="p-1 rounded-lg bg-zinc-900 text-zinc-400 mt-1 flex-shrink-0">
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${expandedFaqs['faq-subprocessors'] ? 'rotate-180 text-emerald-400' : ''}`} />
                </div>
              </button>

              {expandedFaqs['faq-subprocessors'] && (
                <div className="px-5 pb-5 pt-2 text-xs text-zinc-300 leading-relaxed space-y-3 border-t border-zinc-900/60">
                  <p>
                    Sovranly IP contracts exclusively with enterprise-grade subprocessors that meet or exceed GDPR Article 28 data processing standards and CCPA service provider requirements. Each partner operates under legally binding Data Processing Agreements (DPAs) with strict purpose limitations:
                  </p>
                  <ul className="list-disc list-inside space-y-1.5 text-zinc-400 pl-1">
                    <li>
                      <strong className="text-zinc-200">Google Cloud Platform &amp; Firebase:</strong> Provides secure edge hosting, Firestore databases, and Google OAuth. Certified under ISO/IEC 27001, SOC 2 Type II, and adhering to European Commission Standard Contractual Clauses (SCCs) for cross-border data protection.
                    </li>
                    <li>
                      <strong className="text-zinc-200">Payment Processors:</strong> Processes fiat subscription payments and licensing invoices as certified PCI-DSS Level 1 Service Providers. Sovranly IP never receives, handles, or stores sensitive credit card credentials.
                    </li>
                    <li>
                      <strong className="text-zinc-200">Google Analytics 4 (G-ZGGTSS0QFN):</strong> Collects anonymized platform interaction metrics with IP anonymization enabled. You can disable telemetry at any time via the Sovereign Storage &amp; Cookie Governance Matrix.
                    </li>
                    <li>
                      <strong className="text-zinc-200">Decentralized RPC Nodes &amp; IPFS Pinning Services:</strong> Facilitates blockchain broadcasts and decentralized file accessibility without transmitting user identity profiles.
                    </li>
                  </ul>
                </div>
              )}
            </div>

            {/* FAQ 5: Zero Data Monetization & Anti-Scraping */}
            <div className="border border-zinc-900 bg-zinc-950/70 rounded-2xl overflow-hidden transition-all">
              <button
                onClick={() => toggleFaq('faq-anti-scraping')}
                className="w-full p-5 text-left flex items-start justify-between gap-4 hover:bg-zinc-900/30 transition-colors cursor-pointer"
              >
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-950/60 text-rose-400 border border-rose-800/40">
                      ZERO DATA MONETIZATION
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono text-zinc-500 border border-zinc-800">
                      AI SCRAPING PROHIBITION
                    </span>
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-white">
                    Does Sovranly sell creator data, or allow third-party AI companies to scrape my creative work for model training?
                  </h3>
                </div>
                <div className="p-1 rounded-lg bg-zinc-900 text-zinc-400 mt-1 flex-shrink-0">
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${expandedFaqs['faq-anti-scraping'] ? 'rotate-180 text-rose-400' : ''}`} />
                </div>
              </button>

              {expandedFaqs['faq-anti-scraping'] && (
                <div className="px-5 pb-5 pt-2 text-xs text-zinc-300 leading-relaxed space-y-3 border-t border-zinc-900/60">
                  <p>
                    <strong className="text-white">Strict Non-Monetization Policy:</strong> Sovranly IP does <em>not</em> sell, rent, license, or barter your personal information, catalog listings, audio stems, artwork, or contact data to data brokers, ad-tech aggregators, or third-party AI labs.
                  </p>
                  <p>
                    In accordance with CCPA/CPRA regulations granting California consumers the right to opt out of the sale or sharing of personal information, Sovranly IP maintains a zero-sale posture across the entire platform by default.
                  </p>
                  <p>
                    Furthermore, Sovranly IP implements automated anti-crawling headers (including <code>X-Robots-Tag: noai, noimageai</code>), rate limiting, and cryptographic asset watermarking to actively prevent unauthorized AI web scrapers from ingesting your creative works into foundational training sets.
                  </p>
                </div>
              )}
            </div>

            {/* FAQ 6: Exercising Rights */}
            <div className="border border-zinc-900 bg-zinc-950/70 rounded-2xl overflow-hidden transition-all">
              <button
                onClick={() => toggleFaq('faq-exercise-rights')}
                className="w-full p-5 text-left flex items-start justify-between gap-4 hover:bg-zinc-900/30 transition-colors cursor-pointer"
              >
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-950/60 text-cyan-400 border border-cyan-800/40">
                      EXERCISING YOUR RIGHTS
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono text-zinc-500 border border-zinc-800">
                      30-DAY FULFILLMENT WINDOW
                    </span>
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-white">
                    How can I submit a formal Subject Access Request (SAR), export my catalog, or delete my account?
                  </h3>
                </div>
                <div className="p-1 rounded-lg bg-zinc-900 text-zinc-400 mt-1 flex-shrink-0">
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${expandedFaqs['faq-exercise-rights'] ? 'rotate-180 text-cyan-400' : ''}`} />
                </div>
              </button>

              {expandedFaqs['faq-exercise-rights'] && (
                <div className="px-5 pb-5 pt-2 text-xs text-zinc-300 leading-relaxed space-y-3 border-t border-zinc-900/60">
                  <p>
                    You can exercise any of your statutory GDPR or CCPA/CPRA rights (Access, Correction, Erasure, Data Portability, or Processing Restriction) with no administrative fees:
                  </p>
                  <ol className="list-decimal list-inside space-y-2 text-zinc-400 pl-1">
                    <li>
                      <strong className="text-zinc-200">Email Submission:</strong> Send an email to{' '}
                      <a href="mailto:create@sovranlyip.com" className="text-cyan-400 hover:underline font-mono">
                        create@sovranlyip.com
                      </a>{' '}
                      with the subject line <code className="text-white bg-zinc-900 px-1.5 py-0.5 rounded">Subject Access Request</code> or <code className="text-white bg-zinc-900 px-1.5 py-0.5 rounded">Account Erasure Request</code>.
                    </li>
                    <li>
                      <strong className="text-zinc-200">Identity Verification:</strong> To protect creator catalogs from social engineering attacks, we verify your identity by sending a confirmation challenge to your registered Google OAuth email or requesting a cryptographic signature verification from your linked Web3 wallet.
                    </li>
                    <li>
                      <strong className="text-zinc-200">Fulfillment Horizon:</strong> Verified requests are resolved within <strong>30 calendar days</strong>. In cases of data export requests, we provide a structured, machine-readable JSON archive of your catalog metadata, licensing terms, and account transaction histories.
                    </li>
                  </ol>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* SECTION 19: Contact Information & DPO */}
        <section id="contact" className="space-y-6">
          <div className="border-b border-zinc-900 pb-3">
            <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight flex items-center gap-2.5">
              <span className="text-cyan-400 text-sm font-mono">[19]</span> Contact Information &amp; Data Protection Officer
            </h2>
          </div>

          <div className="p-6 md:p-8 bg-zinc-950/70 border border-zinc-900 rounded-3xl space-y-4">
            <p className="text-sm text-zinc-300 leading-relaxed">
              If you have any questions, concerns, complaints, or requests regarding this Privacy Policy, your personal data, or our Zero Trust security protocols, please reach out directly to our dedicated Data Protection &amp; Compliance Office:
            </p>
            
            <div className="p-5 bg-zinc-900/50 border border-zinc-800 rounded-2xl space-y-2 text-xs font-mono">
              <p className="text-white font-bold text-sm">Sovranly IP — Data Protection &amp; Legal Compliance Office</p>
              <p className="text-zinc-400">Primary Contact: <a href="mailto:create@sovranlyip.com" className="text-cyan-400 hover:underline">create@sovranlyip.com</a></p>
              <p className="text-zinc-400">Platform URL: <a href="https://www.sovranlyip.com" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">https://www.sovranlyip.com</a></p>
              <p className="text-zinc-400">Applicable Jurisdiction: United States of America</p>
              <p className="text-zinc-400">Standard Response Horizon: Within 30 calendar days</p>
            </div>

            <p className="text-xs text-zinc-500 leading-relaxed">
              If you are located in the European Union or United Kingdom and believe your privacy rights have been infringed, you also have the right to lodge a formal complaint with your national Supervisory Authority (e.g., the Information Commissioner&apos;s Office in the UK, CNIL in France, or BfDI in Germany).
            </p>
          </div>
        </section>

        {/* Footer Note */}
        <footer className="pt-8 pb-12 text-center border-t border-zinc-900 space-y-4">
          <div className="flex items-center justify-center gap-4 text-xs font-mono text-zinc-400">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>•</span>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            <span>•</span>
            <Link href="/pricing" className="hover:text-white transition-colors">Pricing &amp; Splits</Link>
            <span>•</span>
            <Link href="/wiki" className="hover:text-white transition-colors">Knowledge Wiki</Link>
            <span>•</span>
            <Link href="/faq" className="hover:text-white transition-colors">FAQ</Link>
            <span>•</span>
            <Link href="/sitemap" className="hover:text-white transition-colors">Sitemap</Link>
          </div>
          <p className="text-xs text-zinc-500">
            &copy; {new Date().getFullYear()} Sovranly IP. Sovereign Intellectual Property &amp; Zero Trust Architecture. All Rights Reserved.
          </p>
          <span className="text-[9px] uppercase font-mono text-zinc-600 tracking-[0.2em] font-black block">
            SOVRANLY PRIVACY PROTOCOL • CONTINUOUS CRYPTOGRAPHIC ZERO TRUST VERIFICATION
          </span>
        </footer>

      </main>
    </div>
  );
}
