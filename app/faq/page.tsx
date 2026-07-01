'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { 
  HelpCircle,
  Search, 
  ChevronDown, 
  Scale, 
  Coins, 
  ArrowLeft,
  CheckCircle,
  Cpu,
  ArrowRight,
  ShieldCheck,
  Briefcase,
  HelpCircle as QuestionsIcon,
  Calculator,
  UserCheck
} from 'lucide-react';
import Link from 'next/link';
import LanguageSelector from '@/components/LanguageSelector';

type FAQItem = {
  id: string;
  category: 'splits' | 'legal' | 'dashboard' | 'security';
  question: string;
  answer: string;
  bullets?: string[];
  checklist?: string[];
};

export default function FAQPage() {
  const categories = [
    { id: 'all', label: 'All Questions', desc: 'Browse entire knowledge catalog', icon: HelpCircle },
    { id: 'splits', label: 'Payments & Splits', desc: 'On-chain splits & transaction fee', icon: Coins },
    { id: 'legal', label: 'Trademark & Legal', desc: 'Class 42 details & VLA pro-bono', icon: Scale },
    { id: 'dashboard', label: 'Onboarding & Dashboard', desc: 'Registry and marketplace guides', icon: UserCheck },
    { id: 'security', label: 'Security & Zero Trust', desc: 'Keys, signatures, and cold wallets', icon: ShieldCheck }
  ] as const;

  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<'all' | 'splits' | 'legal' | 'dashboard' | 'security'>('all');
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({
    'splits-ratio': true,
    'legal-class-42': true
  });

  const [simulatedLoadValue, setSimulatedLoadValue] = useState<string>('1.0');

  const toggleItem = (id: string) => {
    setOpenItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const calculatedOutputs = useMemo(() => {
    const val = parseFloat(simulatedLoadValue);
    if (isNaN(val) || val < 0) {
      return { creator: '0.00', platform: '0.00' };
    }
    return {
      creator: (val * 0.85).toFixed(4),
      platform: (val * 0.15).toFixed(4)
    };
  }, [simulatedLoadValue]);

  const faqs: FAQItem[] = [
    {
      id: 'splits-ratio',
      category: 'splits',
      question: 'How does the 85/15 transaction split operate on-chain?',
      answer: 'Standard licensing transactions are processed atomically inside the transaction block itself. When an agent purchases usage rights for a piece of intellectual property, the decentralized wallet payment triggers an automated split:',
      bullets: [
        '85% is dispatched instantly to the Creator\'s registered Metamask or Web3 hardware wallet address.',
        '15% is deposited into the Sovranly IP Platform Reserve Pool to manage gasless relay systems and automated dashboard indexes.',
        'There is no middleman account holding your revenue; payments are entirely independent and direct.'
      ]
    },
    {
      id: 'splits-accounting-latency',
      category: 'splits',
      question: 'What is the delay or custody period for licensing payouts?',
      answer: 'Our Zero Trust ledger architecture does not have payout custody, monthly schedules, or traditional 6-to-12 month royalty administration cycles. Payout agreements resolve on-chain in seconds as soon as the buyer\'s transaction is committed to the block ledger.',
    },
    {
      id: 'splits-taxes',
      category: 'splits',
      question: 'Does Sovranly IP handle tax withholdings (e.g., 1099 or W-8BEN forms) automatically?',
      answer: 'No, Sovranly IP operates entirely on-chain as a non-custodial pipeline, meaning the platform never touches or holds your earnings in custody to process centralized tax withholdings or file Form 1099s. Independent creators are directly responsible for reporting their decentralized revenue:',
      bullets: [
        'Creator payouts are dispatched peer-to-peer instantly, keeping your compliance records clean and direct.',
        'A full on-chain ledger history of all licensing revenue can be exported from the Command Center for tax accounting.',
        'Pro-bono counsel networks (like local VLA groups) can assist in setting up appropriate corporate buffers (e.g., single-member LLCs) for tax optimization.'
      ]
    },
    {
      id: 'legal-class-42',
      category: 'legal',
      question: 'What is Trademark Class 42 and how do I classify my brand?',
      answer: 'When defending your software services or digital asset brand, choosing the correct international classification is vital. Landmark Web3 utility and database tools typically structure their federal filings under Trademark Class 42, which specifically covers software as a service (SaaS) structures.',
      bullets: [
        'Our recommended filing specification text: "Software as a Service (SaaS) providing peer-to-peer intellectual property registration and automated royalty distribution for artists, composers, and digital authors."',
        'Differentiate between "Intent to Use" filing bases (to lock your name down early) and "Use in Commerce" bases (filed once your marketplace listings are active).'
      ]
    },
    {
      id: 'legal-tess-search',
      category: 'legal',
      question: 'How do I perform a brand lookup using the USPTO TESS tool?',
      answer: 'Before filing trademarks or releasing under the Sovranly name space, you must perform deep phonetic, spelling variation, and direct string searches within the official USPTO TESS (Trademark Electronic Search System) database.',
      checklist: [
        'Perform direct word searches for "Sovranly" under foreign and federal nodes',
        'Verify translation or phonetic equivalents in key copyright zones',
        'Check database registers for any prior Class 42 entries matching active titles'
      ]
    },
    {
      id: 'legal-vla',
      category: 'legal',
      question: 'How can Volunteers for the Arts (VLA) support independent creators?',
      answer: 'Traditional counsel fees can quickly exhaust a bootstrapped creator\'s budget. "Volunteers for the Arts" (VLA) networks exist in most major regional hubs to offer free pro-bono or highly subsidized legal counsel.',
      bullets: [
        'Professional legal consultations regarding standard IP contracts, licensing limits, and structural copyrights.',
        'Assistance setting up LLC or corporate shielding structures to insulate personal assets from licensing liability.',
        'TEAS/TESS trademark filing reviews to eliminate costly errors preceding processing submission.'
      ]
    },
    {
      id: 'legal-custom-licensing',
      category: 'legal',
      question: 'Am I restricted to standard licensing templates, or can I attach bespoke custom legal agreements?',
      answer: 'Our dynamic registration pipeline allows you to bind custom licensing parameters directly to your IP Asset on-chain. When registering, you can specify individual terms, exclusivity intervals, geographic boundaries, and redistribution rules.',
      checklist: [
        'Navigate to Asset Registry and define customized bounding clauses under the licensing notes modal',
        'Compile terms into standard cryptographic hash identifiers for permanent on-chain integrity checks',
        'Bind the resulting metadata hash securely to your license\'s decentralized registration payload'
      ]
    },
    {
      id: 'dashboard-asset-registry',
      category: 'dashboard',
      question: 'How do I register and catalog on-chain assets?',
      answer: 'We maintain a simple, transparent registration guide inside page console parameters. Simply connect your wallet identity, fill in your asset metadata, and authorize the file.',
      checklist: [
        'Unlock your MetaMask browser client and point to active interface coordinates',
        'Navigate to Dashboard > Registry Hub, upload metadata, and anchor the entry states',
        'Approve the cryptographic block signature to register the creation proof timestamp',
        'Assign target licensing prices in ETH and release details instantly to the Marketplace'
      ]
    },
    {
      id: 'dashboard-metamask-tx',
      category: 'dashboard',
      question: 'Why does MetaMask prompt for a signature during registration?',
      answer: 'Sovranly IP operates as a Zero Trust sovereign ledger. To record immutable proof of ownership, your files require cryptographic signing. This local permission registers your authorship permanently on-chain with zero-trust credentials.',
    },
    {
      id: 'dashboard-revert-ip',
      category: 'dashboard',
      question: 'Is it possible to revoke, withdraw, or modify a license once it is listed on the marketplace?',
      answer: 'While recorded proof of authorship is permanently anchored on-chain for record-keeping, you can instantly delist any of your licenses or alter sale prices from the Command Center dashboard at any time.',
      bullets: [
        'Delisted assets remain secured under your authorship identifier but are removed from public purchase flows.',
        'Adjusting prices or updating description scopes can be executed directly using MetaMask signature confirmations.',
        'Prior buyers\' acquired usage licenses are legally protected and remain active in perpetuity under the original covenant terms.'
      ]
    },
    {
      id: 'security-zero-trust',
      category: 'security',
      question: 'What does "Zero Trust Architecture" mean for creators on Sovranly IP?',
      answer: 'Our Zero Trust philosophy mandates continuous authentication at every transaction layer. Direct media files are not stored on vulnerable primary servers. Access remains protected by authorization tokens, on-chain signatures, and immutable registry validation.',
      bullets: [
        'Continuous authentication of download states protecting creator media from unauthorized scraping.',
        'Cryptographic validation of seller credentials during transaction distributions.',
        'Decentralized storage links ensuring complete safety for source IP materials.'
      ]
    },
    {
      id: 'security-hardware-wallets',
      category: 'security',
      question: 'Do you support cold storage hardware wallets like Ledger or Trezor for session authorization?',
      answer: 'Yes, our Zero Trust Authentication architecture is compatible with major cold storage hardware wallets via MetaMask and WalletConnect services. Secure cryptographic signing requests are routed directly to your hardware key to ensure your intellectual properties remain protected by your offline credentials.',
      bullets: [
        'Private keys never touch secondary servers or leave the physical boundary of your offline hardware key.',
        'Every licensing deed or metadata registry update requires a discrete offline physical verification signature.',
        'Protects your creator account credentials from conventional phishing or browser session hijack vulnerabilities.'
      ]
    }
  ];

  const filteredFaqs = faqs.filter(f => {
    const query = searchQuery.toLowerCase();
    const matchesSearch = f.question.toLowerCase().includes(query) || 
                          f.answer.toLowerCase().includes(query) ||
                          (f.bullets && f.bullets.some(b => b.toLowerCase().includes(query)));
    
    if (activeCategory === 'all') return matchesSearch;
    return f.category === activeCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#050505] text-[#e0e0e0] font-sans selection:bg-cyan-500/20 selection:text-cyan-300">
      
      {/* Glow Backplates */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/4 w-[600px] h-[600px] bg-violet-500/5 rounded-full blur-[150px] pointer-events-none" />

      {/* Main Navigation */}
      <nav className="border-b border-zinc-900 bg-zinc-950/55 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image src="/sovranly-logo-v2.png" alt="Sovranly IP" width={32} height={32} className="rounded-xl border border-white/5" referrerPolicy="no-referrer" />
            <div className="flex flex-col">
              <span className="font-extrabold tracking-tight text-white leading-tight uppercase text-sm">SOVRANLY IP</span>
              <span className="text-[10px] uppercase font-mono text-cyan-400 tracking-wider">Sovereign FAQ Portal</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button asChild variant="outline" className="border-zinc-850 text-zinc-300 hover:text-white hover:bg-zinc-900 rounded-full text-xs">
              <Link href="/" className="flex items-center gap-1.5">
                <ArrowLeft className="w-3.5 h-3.5" /> Return Home
              </Link>
            </Button>
            <Button asChild className="bg-gradient-to-r from-cyan-500 to-violet-500 hover:brightness-110 text-white rounded-full text-xs font-semibold px-4">
              <Link href="/dashboard" className="flex items-center gap-1.5">
                Go to Dashboard <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Content container */}
      <main className="max-w-7xl mx-auto px-6 py-12 relative z-10">
        
        {/* Title Heading Block */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-zinc-900 border border-zinc-805 rounded-full text-xs text-zinc-400 mb-3">
            <QuestionsIcon className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-mono text-[9px] uppercase tracking-wider">Sovereign Knowledge Base</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter text-white mb-3">
            Frequently Asked <span className="text-cyan-400">Questions</span>
          </h1>
          <p className="text-zinc-450 text-sm max-w-3xl leading-relaxed">
            Quick, reliable answers about <strong>on-chain royalty payouts</strong>, trademark registrations, continuous validation systems, and utilizing the Sovranly IP dashboards to secure intellectual properties.
          </p>
        </div>

        {/* Interactive 3-Column Layout Area */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* 1. Left Sidebar - Pill-Based Navigation for Filtering Category */}
          <div className="lg:col-span-3 space-y-4 lg:sticky lg:top-24">
            <div className="bg-zinc-950 border border-zinc-900 rounded-3xl p-5 shadow-xl space-y-4">
              <span className="text-[10px] uppercase font-mono tracking-widest text-zinc-500 font-bold block select-none">
                Category Filters
              </span>
              
              {/* Pill navigation container: lists vertically on desktop, scrolls horizontally on mobile */}
              <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0 scrollbar-none">
                {categories.map(cat => {
                  const Icon = cat.icon;
                  const isActive = activeCategory === cat.id;
                  const count = faqs.filter(f => cat.id === 'all' || f.category === cat.id).length;
                  
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setActiveCategory(cat.id as any)}
                      className={`text-left px-4 py-3 rounded-2xl border transition-all duration-200 cursor-pointer flex items-center justify-between gap-3 min-w-[210px] lg:min-w-0 flex-shrink-0 ${
                        isActive
                          ? 'bg-cyan-950/25 border-cyan-500/40 text-cyan-400 shadow-lg shadow-cyan-950/10'
                          : 'bg-transparent border-transparent text-zinc-400 hover:text-white hover:bg-zinc-900/40'
                      }`}
                    >
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className={`p-2 rounded-xl flex-shrink-0 ${isActive ? 'bg-cyan-950 text-cyan-400' : 'bg-zinc-900 text-zinc-500'}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="overflow-hidden">
                          <span className="block text-xs font-bold leading-none truncate">{cat.label}</span>
                          <span className="block text-[9px] text-zinc-500 leading-normal truncate mt-1">{cat.desc}</span>
                        </div>
                      </div>
                      <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-md ${
                        isActive ? 'bg-cyan-500/20 text-cyan-400' : 'bg-zinc-900 text-zinc-500'
                      }`}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 2. Middle Column: FAQ Accordion list & Search Box */}
          <div className="lg:col-span-6 space-y-4">
            
            {/* Search Input Box */}
            <div className="relative mb-5">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <Input 
                type="text" 
                placeholder="Search knowledge parameters..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-zinc-950/85 border-zinc-850 text-white rounded-2xl pl-11 text-xs focus-visible:ring-cyan-500 h-11"
              />
            </div>

            {filteredFaqs.length === 0 ? (
              <div className="text-center py-16 bg-[#09090b] rounded-2xl border border-zinc-900 border-dashed">
                <HelpCircle className="w-8 h-8 text-cyan-500/30 mx-auto mb-3" />
                <p className="text-zinc-500 text-xs">No matching question parameters discovered. Try refinement.</p>
              </div>
            ) : (
              filteredFaqs.map(item => {
                const isOpen = openItems[item.id] ?? false;
                return (
                  <Card key={item.id} className="bg-[#09090b] border border-zinc-900 overflow-hidden shadow-md hover:border-zinc-850 transition duration-200">
                    <button 
                      onClick={() => toggleItem(item.id)}
                      className="w-full text-left p-5 flex justify-between items-center gap-4 hover:bg-zinc-900/10 transition"
                    >
                      <span className="text-base font-bold text-white tracking-tight">{item.question}</span>
                      <ChevronDown className={`w-4 h-4 text-zinc-500 transition-transform flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {isOpen && (
                      <div className="px-5 pb-5 pt-1 border-t border-zinc-900 space-y-4 text-xs sm:text-sm text-zinc-350 leading-relaxed">
                        <p>{item.answer}</p>
                        
                        {item.bullets && (
                          <div className="space-y-2.5 pl-4 border-l border-cyan-500/30 mt-3 font-sans">
                            {item.bullets.map((b, idx) => (
                              <div key={idx} className="flex gap-2 text-xs sm:text-sm text-zinc-300">
                                <span className="text-cyan-400 font-bold font-mono">▸</span>
                                <p>{b}</p>
                              </div>
                            ))}
                          </div>
                        )}

                        {item.checklist && (
                          <div className="mt-3 pt-3 border-t border-zinc-900/60 space-y-2">
                            <span className="text-[10px] uppercase font-mono text-zinc-500 font-bold tracking-wider">Sovereign Action Steps</span>
                            <div className="grid grid-cols-1 gap-2 mt-1">
                              {item.checklist.map((step, idx) => (
                                <div key={idx} className="flex items-center gap-2.5 bg-zinc-950 border border-zinc-900 p-2.5 rounded-lg text-xs text-zinc-400">
                                  <CheckCircle className="w-4 h-4 text-cyan-500 flex-shrink-0" />
                                  <span>{step}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </Card>
                );
              })
            )}

            {/* Support Redirection Box */}
            <Card className="bg-gradient-to-br from-zinc-950 to-cyan-950/20 border border-zinc-900 p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-5 mt-6">
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-1.5 mb-1">
                  <UserCheck className="w-4 h-4 text-cyan-400" /> Have customized or complex legal inquiries?
                </h4>
                <p className="text-zinc-400 text-xs text-left max-w-xl">
                  Engage our dedicated Sovereign AI Copilot Agent equipped with pro-bono VLA resources, USPTO guides, and technical registry steps.
                </p>
              </div>
              <Button asChild className="bg-cyan-600 hover:bg-cyan-700 text-white rounded-full text-xs font-bold leading-none py-4 px-6 flex-shrink-0">
                <Link href="/wiki">
                  Consult AI Agent
                </Link>
              </Button>
            </Card>

          </div>

          {/* 3. Right Column: Interactive Tools Sidebar column */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* Live Interactive Payout Calculator */}
            <Card className="bg-zinc-950 border border-zinc-900 p-6 rounded-2xl shadow-xl">
              <div className="flex items-center gap-2 mb-4 border-b border-zinc-900 pb-3">
                <Calculator className="w-4 h-4 text-cyan-400" />
                <h3 className="text-xs uppercase font-mono tracking-wider font-extrabold text-white">Royalty Payout Simulator</h3>
              </div>
              <p className="text-zinc-500 text-[11px] mb-4 leading-relaxed font-sans">
                Simulate how transaction collections divide instantly. Change the ETH payment size below to observe automated smart contract results.
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] uppercase font-mono text-zinc-400 mb-1.5 font-bold">Simulated Licensing Fee (ETH)</label>
                  <div className="relative">
                    <Input 
                      type="number" 
                      min="0" 
                      step="0.01"
                      value={simulatedLoadValue}
                      onChange={(e) => setSimulatedLoadValue(e.target.value)}
                      className="bg-[#09090b] border-zinc-850 pl-3 pr-10 text-white text-xs font-mono"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 text-xs font-bold font-mono">ETH</span>
                  </div>
                </div>

                <div className="bg-[#09090b] p-4.5 rounded-xl border border-zinc-900 space-y-3.5 p-4">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-zinc-500">Creator Wallet Wallet (85%):</span>
                    <span className="text-emerald-400 font-black font-mono">{calculatedOutputs.creator} ETH</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-zinc-500">Platform Reserve pool (15%):</span>
                    <span className="text-zinc-400 font-mono">{calculatedOutputs.platform} ETH</span>
                  </div>
                </div>
                
                <div className="text-[10px] text-zinc-600 leading-relaxed font-mono space-y-1 bg-zinc-900/10 p-2 text-center rounded-lg border border-zinc-900">
                  <p>✓ ON-CHAIN ENFORCED IMMUTABLY</p>
                  <p>✓ NO MID-ROUTE ACCOUNT LOCKS</p>
                </div>
              </div>
            </Card>

            {/* Trademark Quick Code card */}
            <Card className="bg-zinc-950 border border-zinc-900 p-6 rounded-2xl space-y-3">
              <h4 className="text-xs uppercase font-mono tracking-wider text-cyan-400 flex items-center gap-1.5 font-extrabold">
                <Scale className="w-3.5 h-3.5" /> Class 42 Strategy
              </h4>
              <p className="text-zinc-400 text-xs leading-relaxed font-sans">
                Protect your decentralized intellectual property. Trademark Class 42 shields peer-to-peer software and blockchain database operations seamlessly. Pro-bono attorneys aligned with <strong>Volunteer Lawyers for the Arts (VLA)</strong> help complete this filing step.
              </p>
            </Card>

            {/* Zero Trust Shielding panel */}
            <Card className="bg-zinc-950 border border-zinc-900 p-6 rounded-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-[120px] h-[120px] bg-cyan-705/5 rounded-full blur-2xl pointer-events-none" />
              <h4 className="text-xs uppercase font-mono tracking-wider text-zinc-300 flex items-center gap-1.5 mb-2 font-bold select-none">
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" /> Zero Trust Standards
              </h4>
              <p className="text-zinc-500 text-[11px] leading-relaxed">
                Security is persistent. Continuous validation ensures no account keys or file assets are exposed publicly. All interactions utilize decentralized ledger signatures to assert authority at every step.
              </p>
            </Card>

          </div>

        </div>

      </main>

      {/* Footer Element */}
      <footer className="border-t border-zinc-900/60 py-12 flex flex-col items-center justify-center gap-6 text-center text-zinc-600 text-xs bg-zinc-950/50 mt-16">
        <LanguageSelector />
        <p>© 2026 Creative Sovereignty LLC • Sovereign Legal Registry & On-Chain Licensing mechanics. Trust Nothing, Authenticate Everything.</p>
      </footer>

    </div>
  );
}
