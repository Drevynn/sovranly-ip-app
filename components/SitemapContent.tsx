'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  ArrowLeft, 
  ArrowRight, 
  Search, 
  FileCode, 
  Copy, 
  Check, 
  FolderTree, 
  Terminal,
  Compass
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PublicNavbarHamburger } from '@/components/PublicNavbarHamburger';
import NonCustodialBadge from '@/components/NonCustodialBadge';

interface SitemapEntry {
  title: string;
  path: string;
  category: 'core' | 'marketplace' | 'docs' | 'legal' | 'feeds';
  description: string;
  priority: string;
  changeFreq: string;
  badge: string;
  isExternal?: boolean;
}

const SITEMAP_ENTRIES: SitemapEntry[] = [
  // Core Platform
  {
    title: 'Home & Zero-Trust Engine',
    path: '/',
    category: 'core',
    description: 'The primary entry point to Sovranly IP. Features live zero-trust notarization demo, IP asset workflows, real-time splits showcase, and Google OAuth transparency disclosure.',
    priority: '1.0',
    changeFreq: 'Daily',
    badge: 'Public - No Login Required'
  },
  {
    title: 'About Sovranly IP',
    path: '/about',
    category: 'core',
    description: 'Corporate mission, background on Creative Sovereignty LLC, leadership, Class 42 trademark alignment, and non-custodial architecture.',
    priority: '0.8',
    changeFreq: 'Weekly',
    badge: 'Public Information'
  },
  {
    title: 'Pricing & Sovereign Plans',
    path: '/pricing',
    category: 'core',
    description: 'Transparent creator, studio, and enterprise tiers for on-chain notarization, automated royalty splits, and multi-signature vaults.',
    priority: '0.8',
    changeFreq: 'Weekly',
    badge: 'Public Information'
  },
  {
    title: 'Launch Landing Page',
    path: '/landing',
    category: 'core',
    description: 'Dedicated overview highlighting key features for independent artists, producers, and developers seeking cryptographic IP sovereignty.',
    priority: '0.8',
    changeFreq: 'Daily',
    badge: 'Public Information'
  },
  {
    title: 'Creator Onboarding',
    path: '/onboarding',
    category: 'core',
    description: 'Guided step-by-step onboarding for creators to configure their profile, cryptographic public key, and IP licensing preferences.',
    priority: '0.6',
    changeFreq: 'Weekly',
    badge: 'Interactive Flow'
  },
  {
    title: 'Creator Dashboard',
    path: '/dashboard',
    category: 'core',
    description: 'Sovereign management console for registered creators to register assets, notarize files, configure Google Workspace integrations, and view analytics.',
    priority: '0.7',
    changeFreq: 'Daily',
    badge: 'Authenticated Portal'
  },

  // Marketplace & Verification
  {
    title: 'IP Rights Marketplace',
    path: '/marketplace',
    category: 'marketplace',
    description: 'Decentralized public directory to discover, preview, and license authenticated intellectual property assets with instant on-chain splits.',
    priority: '0.9',
    changeFreq: 'Daily',
    badge: 'Public Marketplace'
  },
  {
    title: 'Public IP Verification Registry',
    path: '/verify',
    category: 'marketplace',
    description: 'Public zero-trust hash validator. Any party can input an asset SHA-256 fingerprint or certificate ID to independently audit ownership on-chain without logging in.',
    priority: '0.9',
    changeFreq: 'Daily',
    badge: 'Public - No Login Required'
  },

  // Documentation & Education
  {
    title: 'Knowledge Base & Technical Wiki',
    path: '/wiki',
    category: 'docs',
    description: 'Comprehensive guides covering zero-trust cryptography, SHA-256 notarization, ERC-721/1155 license binding, and smart contract protocol specifications.',
    priority: '0.8',
    changeFreq: 'Weekly',
    badge: 'Developer Docs'
  },
  {
    title: 'Frequently Asked Questions (FAQ)',
    path: '/faq',
    category: 'docs',
    description: 'Detailed answers on royalty calculations, non-custodial wallet security, Trademark Class 42 compliance, and Google OAuth integrations.',
    priority: '0.8',
    changeFreq: 'Weekly',
    badge: 'Public Support'
  },
  {
    title: 'Investor & Partner Pitch Deck',
    path: '/pitch-deck',
    category: 'docs',
    description: 'Interactive presentation deck covering market opportunity, technology architecture, creator monetization models, and roadmap.',
    priority: '0.7',
    changeFreq: 'Monthly',
    badge: 'Interactive Presentation'
  },
  {
    title: 'Sovereignty Whitepaper',
    path: '/funnel/whitepaper',
    category: 'docs',
    description: 'Technical whitepaper detailing decentralized ownership proofs, non-custodial payment routing, and zero-trust asset verification algorithms.',
    priority: '0.7',
    changeFreq: 'Monthly',
    badge: 'Technical Paper'
  },
  {
    title: 'Creator Discovery Funnel',
    path: '/funnel',
    category: 'docs',
    description: 'Interactive educational funnel illustrating how legacy copyright systems fail and how Sovranly IP secures digital rights.',
    priority: '0.7',
    changeFreq: 'Weekly',
    badge: 'Interactive Guide'
  },

  // Legal & Trust
  {
    title: 'Privacy Policy & Google Disclosures',
    path: '/privacy',
    category: 'legal',
    description: 'Complete GDPR, CCPA, and Google API Services User Data Policy disclosures, explaining exact usage of requested OAuth scopes and Limited Use commitments.',
    priority: '0.6',
    changeFreq: 'Monthly',
    badge: 'Compliance & Audit'
  },
  {
    title: 'Terms of Service',
    path: '/terms',
    category: 'legal',
    description: 'Full legal terms for utilizing the Sovranly IP non-custodial software suite, blockchain registration engine, and license enforcement tools.',
    priority: '0.6',
    changeFreq: 'Monthly',
    badge: 'Legal Contract'
  },
  {
    title: 'Google OAuth & User Data Transparency',
    path: '/#data-transparency',
    category: 'legal',
    description: 'Direct disclosure on the homepage describing all Google scopes (Drive, Slides, Gmail) and confirming that data is never sold or used for AI training.',
    priority: '0.8',
    changeFreq: 'Daily',
    badge: 'OAuth Reviewer Section'
  },

  // Machine-Readable Feeds
  {
    title: 'XML Sitemap Feed',
    path: '/sitemap.xml',
    category: 'feeds',
    description: 'Standard XML sitemap formatted according to Sitemaps.org protocols for automated indexing by Googlebot, Bingbot, and search engines.',
    priority: '1.0',
    changeFreq: 'Daily',
    badge: 'XML Engine Feed'
  },
  {
    title: 'Robots.txt Directives',
    path: '/robots.txt',
    category: 'feeds',
    description: 'Crawler directives instructing web robots on public paths, crawl rules, and official XML sitemap location.',
    priority: '0.5',
    changeFreq: 'Monthly',
    badge: 'Crawler Protocol'
  }
];

const CATEGORIES = [
  { id: 'all', label: 'All Pages', count: SITEMAP_ENTRIES.length },
  { id: 'core', label: 'Core Platform', count: SITEMAP_ENTRIES.filter(e => e.category === 'core').length },
  { id: 'marketplace', label: 'Marketplace & Registry', count: SITEMAP_ENTRIES.filter(e => e.category === 'marketplace').length },
  { id: 'docs', label: 'Docs & Whitepaper', count: SITEMAP_ENTRIES.filter(e => e.category === 'docs').length },
  { id: 'legal', label: 'Legal & Trust', count: SITEMAP_ENTRIES.filter(e => e.category === 'legal').length },
  { id: 'feeds', label: 'Machine Feeds', count: SITEMAP_ENTRIES.filter(e => e.category === 'feeds').length }
] as const;

export default function SitemapContent() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<'all' | 'core' | 'marketplace' | 'docs' | 'legal' | 'feeds'>('all');
  const [copiedPath, setCopiedPath] = useState<string | null>(null);

  const baseUrl = 'https://www.sovranlyip.com';

  const filteredEntries = useMemo(() => {
    return SITEMAP_ENTRIES.filter(entry => {
      const matchesCategory = activeCategory === 'all' || entry.category === activeCategory;
      const matchesQuery = 
        entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.path.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.badge.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesQuery;
    });
  }, [activeCategory, searchQuery]);

  const handleCopyLink = (path: string) => {
    const fullUrl = path.startsWith('http') ? path : `${baseUrl}${path}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedPath(path);
    setTimeout(() => {
      setCopiedPath(null);
    }, 2000);
  };

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    'name': 'Sovranly IP Sitemap & Architecture Directory',
    'description': 'Complete index of all public nodes, creator tools, IP verification engines, documentation, legal compliance disclosures, and machine-readable feeds on Sovranly IP.',
    'url': `${baseUrl}/sitemap`,
    'isPartOf': {
      '@type': 'WebSite',
      'name': 'Sovranly IP',
      'url': baseUrl
    },
    'breadcrumb': {
      '@type': 'BreadcrumbList',
      'itemListElement': [
        {
          '@type': 'ListItem',
          'position': 1,
          'name': 'Home',
          'item': baseUrl
        },
        {
          '@type': 'ListItem',
          'position': 2,
          'name': 'Sitemap',
          'item': `${baseUrl}/sitemap`
        }
      ]
    }
  };

  return (
    <div className="min-h-screen bg-black text-zinc-100 font-sans selection:bg-cyan-500/20 selection:text-cyan-300 relative overflow-hidden flex flex-col justify-between">
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Ambient background glows */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 w-[600px] h-[600px] bg-violet-500/5 rounded-full blur-[160px] pointer-events-none" />

      {/* Main Navigation Header */}
      <nav className="border-b border-zinc-900 bg-zinc-950/70 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-8 h-8 bg-zinc-950 border border-cyan-500/30 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-950/20 group-hover:border-cyan-400 transition-colors">
                <ShieldCheck className="w-4.5 h-4.5 text-cyan-400 drop-shadow-[0_0_6px_rgba(34,211,238,0.4)]" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold tracking-tight text-white leading-tight uppercase text-sm">SOVRANLY IP</span>
                <span className="text-[10px] uppercase font-mono text-cyan-400 tracking-wider">Architecture & Sitemap</span>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <Button asChild variant="outline" className="border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-900 rounded-full text-xs hidden sm:flex">
              <Link href="/" className="flex items-center gap-1.5">
                <ArrowLeft className="w-3.5 h-3.5" /> Return Home
              </Link>
            </Button>
            <Button asChild className="bg-gradient-to-r from-cyan-500 to-violet-500 hover:brightness-110 text-white rounded-full text-xs font-semibold px-4">
              <Link href="/dashboard" className="flex items-center gap-1.5">
                Creator Dashboard <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </Button>
            <PublicNavbarHamburger />
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-6 py-12 md:py-16 relative z-10 w-full flex-1">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs font-mono text-zinc-500 mb-8">
          <Link href="/" className="hover:text-cyan-400 transition-colors">SOVRANLY</Link>
          <span>/</span>
          <span className="text-zinc-300">SITEMAP</span>
        </div>

        {/* Hero Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-zinc-800/80 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono mb-4">
              <FolderTree className="w-3.5 h-3.5" />
              <span>PUBLIC DIRECTORY & ROUTE INDEX</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white mb-3">
              Application Sitemap
            </h1>
            <p className="text-zinc-400 max-w-2xl text-sm md:text-base leading-relaxed">
              Explore the entire architecture of Sovranly IP. Every public node, verification ledger, legal disclosure, documentation page, and machine-readable index is indexed below.
            </p>
          </div>

          {/* Quick XML Actions */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 bg-zinc-900/60 p-3 rounded-2xl border border-zinc-800/80 backdrop-blur-sm">
            <Button asChild variant="outline" size="sm" className="border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/10 hover:text-white rounded-xl text-xs gap-1.5">
              <Link href="/sitemap.xml" target="_blank" rel="noopener noreferrer">
                <FileCode className="w-3.5 h-3.5 text-cyan-400" />
                Raw XML Sitemap
              </Link>
            </Button>
            <Button asChild variant="ghost" size="sm" className="text-zinc-400 hover:text-white rounded-xl text-xs gap-1.5">
              <Link href="/robots.txt" target="_blank" rel="noopener noreferrer">
                <Terminal className="w-3.5 h-3.5 text-zinc-400" />
                Robots.txt
              </Link>
            </Button>
          </div>
        </div>

        {/* Platform Status & Protocol Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="bg-zinc-900/40 border border-zinc-800/60 rounded-2xl p-4 flex flex-col justify-between">
            <span className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider">Total Indexed Nodes</span>
            <div className="text-2xl font-bold text-white mt-1 flex items-baseline gap-2">
              {SITEMAP_ENTRIES.length}
              <span className="text-xs font-normal text-emerald-400 font-mono">Routes</span>
            </div>
          </div>
          <div className="bg-zinc-900/40 border border-zinc-800/60 rounded-2xl p-4 flex flex-col justify-between">
            <span className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider">Machine Feeds</span>
            <div className="text-2xl font-bold text-cyan-400 mt-1 flex items-baseline gap-2">
              XML & Robots
              <span className="text-xs font-normal text-cyan-400/80 font-mono">Synced</span>
            </div>
          </div>
          <div className="bg-zinc-900/40 border border-zinc-800/60 rounded-2xl p-4 flex flex-col justify-between">
            <span className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider">Public Access</span>
            <div className="text-2xl font-bold text-emerald-400 mt-1 flex items-baseline gap-2">
              100% Free
              <span className="text-xs font-normal text-zinc-400 font-mono">No Gate</span>
            </div>
          </div>
          <div className="bg-zinc-900/40 border border-zinc-800/60 rounded-2xl p-4 flex flex-col justify-between">
            <span className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider">Architecture</span>
            <div className="text-2xl font-bold text-violet-400 mt-1 flex items-baseline gap-2">
              Zero Trust
              <span className="text-xs font-normal text-zinc-400 font-mono">SHA-256</span>
            </div>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="space-y-4 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
              <Input
                type="text"
                placeholder="Search sitemap by title, path, protocol, or tag..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 bg-zinc-900/60 border-zinc-800 text-white placeholder:text-zinc-500 rounded-xl focus:border-cyan-500 text-sm"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-500 hover:text-white font-mono"
                >
                  CLEAR
                </button>
              )}
            </div>

            {/* Category Filter Buttons */}
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                    activeCategory === cat.id
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                      : 'bg-zinc-900/60 text-zinc-400 border border-zinc-800 hover:text-white hover:bg-zinc-800'
                  }`}
                >
                  <span>{cat.label}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    activeCategory === cat.id ? 'bg-cyan-500/30 text-cyan-200' : 'bg-zinc-800 text-zinc-500'
                  }`}>
                    {cat.count}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Sitemap Entries Grid */}
        {filteredEntries.length === 0 ? (
          <div className="bg-zinc-900/30 border border-zinc-800/80 rounded-3xl p-12 text-center">
            <Compass className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white mb-1">No Routes Found</h3>
            <p className="text-zinc-500 text-sm mb-4">No pages match your current search query &quot;{searchQuery}&quot;.</p>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => { setSearchQuery(''); setActiveCategory('all'); }}
              className="border-zinc-700 text-zinc-300 hover:text-white"
            >
              Reset Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredEntries.map((entry) => {
              const fullUrl = `${baseUrl}${entry.path}`;
              const isCopied = copiedPath === entry.path;

              return (
                <div 
                  key={entry.path}
                  className="bg-zinc-900/40 hover:bg-zinc-900/70 border border-zinc-800/80 hover:border-zinc-700 rounded-2xl p-5 flex flex-col justify-between transition-all group relative overflow-hidden backdrop-blur-sm"
                >
                  {/* Subtle top indicator bar */}
                  <div className={`absolute top-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity ${
                    entry.category === 'core' ? 'bg-cyan-500' :
                    entry.category === 'marketplace' ? 'bg-violet-500' :
                    entry.category === 'docs' ? 'bg-amber-500' :
                    entry.category === 'legal' ? 'bg-emerald-500' : 'bg-blue-500'
                  }`} />

                  <div>
                    {/* Header: Badge & Category */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-zinc-800/90 border border-zinc-700/60 text-zinc-300 font-medium">
                        {entry.badge}
                      </span>
                      <div className="flex items-center gap-1.5 text-[10px] font-mono text-zinc-500">
                        <span>P: {entry.priority}</span>
                        <span>•</span>
                        <span>{entry.changeFreq}</span>
                      </div>
                    </div>

                    {/* Title */}
                    <h2 className="text-base font-bold text-white group-hover:text-cyan-400 transition-colors mb-1.5 flex items-center gap-2">
                      <Link href={entry.path}>
                        {entry.title}
                      </Link>
                    </h2>

                    {/* Path / URL */}
                    <div className="flex items-center gap-2 text-xs font-mono text-cyan-400/90 mb-3 bg-zinc-950/60 px-2.5 py-1 rounded-lg border border-zinc-800/60 w-fit max-w-full truncate">
                      <span className="truncate">{entry.path}</span>
                    </div>

                    {/* Description */}
                    <p className="text-zinc-400 text-xs leading-relaxed mb-4">
                      {entry.description}
                    </p>
                  </div>

                  {/* Actions footer */}
                  <div className="flex items-center justify-between gap-2 pt-3 border-t border-zinc-800/60 mt-auto">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopyLink(entry.path)}
                      className="text-zinc-400 hover:text-white hover:bg-zinc-800/60 h-8 px-2.5 text-xs font-mono gap-1 rounded-lg"
                      title="Copy full URL to clipboard"
                    >
                      {isCopied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy URL</span>
                        </>
                      )}
                    </Button>

                    <Button asChild size="sm" variant="outline" className="h-8 px-3 rounded-lg border-zinc-800 hover:border-cyan-500/40 text-zinc-200 hover:text-white text-xs gap-1">
                      <Link href={entry.path}>
                        Visit <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Informational Callout for Search Engines & OAuth Reviewers */}
        <div className="mt-12 bg-zinc-900/30 border border-zinc-800/80 rounded-3xl p-6 md:p-8 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Public Index & Zero-Trust Notice</h3>
              <p className="text-xs font-mono text-zinc-400">Auditable URL Structure // Machine-Readable Protocols</p>
            </div>
          </div>
          <p className="text-zinc-300 text-xs md:text-sm leading-relaxed">
            All public pages on Sovranly IP are freely accessible to users, search crawlers, and verification reviewers without authentication or credential barriers. Dynamic asset verification routes at <code className="text-cyan-400 bg-zinc-950 px-1 py-0.5 rounded border border-zinc-800">/verify/[id]</code> allow instant zero-trust hash audits. The standard XML index is dynamically maintained at <Link href="/sitemap.xml" className="text-cyan-400 underline underline-offset-2 hover:text-cyan-300">/sitemap.xml</Link> and declared in <Link href="/robots.txt" className="text-cyan-400 underline underline-offset-2 hover:text-cyan-300">/robots.txt</Link>.
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-900 py-12 bg-zinc-950/60 relative z-10 flex flex-col items-center justify-center gap-6 text-center mt-12">
        <div className="w-full max-w-7xl px-6">
          <NonCustodialBadge variant="compact" />
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 text-zinc-500 text-xs px-4">
          <Link href="/" className="hover:text-cyan-400 transition-colors">Home</Link>
          <span>•</span>
          <Link href="/about" className="hover:text-cyan-400 transition-colors">About</Link>
          <span>•</span>
          <Link href="/marketplace" className="hover:text-cyan-400 transition-colors">Marketplace</Link>
          <span>•</span>
          <Link href="/verify" className="hover:text-cyan-400 transition-colors">Public Verify</Link>
          <span>•</span>
          <Link href="/pricing" className="hover:text-cyan-400 transition-colors">Pricing</Link>
          <span>•</span>
          <Link href="/terms" className="hover:text-cyan-400 transition-colors">Terms</Link>
          <span>•</span>
          <Link href="/privacy" className="hover:text-cyan-400 transition-colors">Privacy</Link>
          <span>•</span>
          <Link href="/sitemap" className="text-cyan-400 font-bold">HTML Sitemap</Link>
          <span>•</span>
          <Link href="/sitemap.xml" className="hover:text-cyan-400 transition-colors">XML Sitemap</Link>
        </div>

        <p className="text-zinc-600 text-xs px-4">
          © 2026 Creative Sovereignty LLC. Sovranly IP™ Sovereign Management and Zero Trust Blockchain Protection.
        </p>
      </footer>
    </div>
  );
}
