'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { 
  BookOpen, 
  Search, 
  ShieldCheck, 
  TrendingUp, 
  Users, 
  Cpu, 
  Scale, 
  Coins, 
  ArrowLeft,
  Flame,
  Milestone,
  CheckCircle,
  Clock,
  ExternalLink,
  ChevronDown,
  Send,
  Bot,
  User,
  HelpCircle,
  RefreshCw,
  Sparkles,
  Calculator,
  Laptop
} from 'lucide-react';
import Link from 'next/link';
import GoogleAd from '@/components/GoogleAd';

type BlueprintSection = {
  id: string;
  category: 'vision' | 'economics' | 'legal' | 'manifesto';
  title: string;
  subtitle: string;
  icon: any;
  content: string[];
  bulletPoints?: { label: string; text: string }[];
  checklist?: string[];
};

export default function WikiPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'vision' | 'economics' | 'legal' | 'manifesto'>('all');
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    'exec-summary': true,
    'royalty-splits': true,
    'legal-protection': true,
    'vla-resources': true
  });

  // Chat agent states
  const [chatHistory, setChatHistory] = useState<{ role: 'user' | 'model'; text: string }[]>([
    { 
      role: 'model', 
      text: 'Greetings, Creator/Licensee. I am the Sovranly AI Sovereign IP Agent, pre-programmed with our on-chain royalty structures (85%/15% splits), USPTO Trademark Class 42 guidelines, TESS database procedures, and Volunteers for the Arts (VLA) pro-bono resources.\n\nType your query, or click any quick-assistance option below to start!' 
    }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Auto scroll chat
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, isChatLoading]);

  const toggleSection = (id: string) => {
    setOpenSections(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSendMessage = async (textToSend?: string) => {
    const prompt = textToSend || chatInput;
    if (!prompt.trim() || isChatLoading) return;

    if (!textToSend) {
      setChatInput('');
    }

    // Add user message
    const updatedHistory = [...chatHistory, { role: 'user' as const, text: prompt }];
    setChatHistory(updatedHistory);
    setIsChatLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: prompt,
          // Extract history without system instructions
          history: chatHistory.map(h => ({ role: h.role, text: h.text }))
        })
      });

      if (!response.ok) throw new Error('Failed to connect to AI server');
      const data = await response.json();
      
      setChatHistory(prev => [
        ...prev, 
        { role: 'model', text: data.text || 'Apologies, I did not receive a legible cryptographically signed response.' }
      ]);
    } catch (err) {
      console.error(err);
      setChatHistory(prev => [
        ...prev, 
        { role: 'model', text: 'Error establishing a network channel with the Sovereign AI node. Check your connection.' }
      ]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const handleQuickQuestion = (question: string) => {
    handleSendMessage(question);
  };

  const formatChatText = (text: string) => {
    return text.split('\n').map((line, idx) => {
      // Remove raw markdown code blocks
      if (line.startsWith('```')) return null;

      // Handle bold formats
      let processed = line;
      const boldRegex = /\*\*(.*?)\*\*/g;
      const parts = [];
      let lastIndex = 0;
      let match;
      while ((match = boldRegex.exec(line)) !== null) {
        if (match.index > lastIndex) {
          parts.push(line.substring(lastIndex, match.index));
        }
        parts.push(<strong key={match.index} className="text-cyan-400 font-bold">{match[1]}</strong>);
        lastIndex = boldRegex.lastIndex;
      }
      if (lastIndex < line.length) {
        parts.push(line.substring(lastIndex));
      }

      // Handle lists
      const isBullet = line.trim().startsWith('*') || line.trim().startsWith('-');
      const cleanLine = isBullet ? line.trim().replace(/^[*|-]\s*/, '') : line;

      return (
        <div key={idx} className={`${isBullet ? 'pl-4 list-disc relative my-1' : 'my-1.5'} leading-relaxed text-xs sm:text-sm`}>
          {isBullet && <span className="absolute left-0 top-2 w-1.5 h-1.5 rounded-full bg-cyan-500/80" />}
          {parts.length > 0 ? parts : cleanLine}
        </div>
      );
    });
  };

  const sections: BlueprintSection[] = [
    {
      id: 'exec-summary',
      category: 'vision',
      title: '1. Executive Summary & Core Vision',
      subtitle: 'The systemic problem with existing creative systems and our path to resolving them.',
      icon: ShieldCheck,
      content: [
        "Sovranly IP is a groundbreaking platform utilizing blockchain technology to revolutionize how artists, musicians, and writers manage and monetize their intellectual property. Current systems within the creative industries are plagued by inefficiencies and inequities, leaving creators struggling to manage their work and receive fair compensation.",
        "These traditional pipelines are opaque, leading to delayed payments, legal disputes over ownership, and a total lack of visibility into how media assets are compiled and consumed. Artists often lose structural control of their intellectual property rights to intermediaries, significantly hindering their ability to earn a fair living. By providing a secure, transparent, and direct marketplace, Sovranly IP addresses these issues head-on.",
        "We eliminate intermediaries, empower creators to take full control of their work, and maintain a stateful peer-to-peer network connecting creators directly to their target audiences."
      ],
      bulletPoints: [
        { label: "Our Mission", text: "To empower artists with a transparent, secure, decentralized ecosystem built on Zero-Trust cryptographic architectures." },
        { label: "The Problem", text: "Delayed accounting cycles, structural copyright leaks, and high administrative fees eating creator profits." },
        { label: "Our Resolution", text: "Blockchain-based registries, self-executing smart contract divisions, and instantaneous micro-service splits." }
      ]
    },
    {
      id: 'blockchain-leverage',
      category: 'vision',
      title: '2. Leveraging Blockchain for Sovereign Defense',
      subtitle: 'Definitive cryptographic proof of ownership, creation, and secure immutability.',
      icon: Cpu,
      content: [
        "When an artist registers their work on Sovranly IP, the registration is recorded directly onto the blockchain ledger, creating an everlasting record.",
        "This secures a permanent verification sequence that resolves copyright conflicts and court actions conclusively. The decentralized nature of blockchain makes the system highly resistant to hacking and centralized coordinate manipulations."
      ],
      bulletPoints: [
        { label: "Proof of Creation", text: "Each database entry embeds a cryptographic timestamp, establishing a legally valid, audited proof of when the work existed." },
        { label: "Data Integrity", text: "Decentralized control means no centralized actor, authority, or rogue label can alter, edit, or censor your intellectual property records." },
        { label: "On-Chain Traceability", text: "All licensing sales, transfer events, and royalty settlements are auditable in real-time, leaving no room for opaque industry audits." }
      ]
    },
    {
      id: 'royalty-splits',
      category: 'economics',
      title: '3. Strategic 85/15 Royalty Split Architecture',
      subtitle: 'Understanding the mechanics behind immediate, decentralized revenue distribution.',
      icon: Coins,
      content: [
        "Instead of keeping artists waiting for 6 or 12 months for licensing royalty audits, Sovranly IP divides revenues atomically on-chain. When a license is purchased on our marketplace, the transaction executes a stateful royalty split instantly.",
        "The automated divisions occur natively in the ledger, protecting the creator's earnings from administrative leaks."
      ],
      bulletPoints: [
        { label: "85% Creator Share", text: "Transferred instantly and directly to the owner's authenticated wallet address. No delayed hold periods, no middleman cuts." },
        { label: "15% Automated Platform Pool", text: "Routed automatically to our platform reserve to manage continuous gas-free microservice buffers, marketplace operations, and developer recruitment." },
        { label: "Zero Administrative Latency", text: "Smart contracts split revenues in milliseconds inside the block confirmation itself. Money goes to work instantly." }
      ]
    },
    {
      id: 'legal-protection',
      category: 'legal',
      title: '4. Brand Protection & Class 42 Specification',
      subtitle: 'Comprehensive trademark guidelines, TESS database searches, and SaaS brand shielding.',
      icon: Scale,
      content: [
        "Your platform brand identity requires absolute defensive trademarking. We advise conducting thorough searches to ensure your name is unique and choosing the right legal class representation.",
        "For modern Web3 creator utilities, filing under Trademark Class 42 (providing SaaS software services) secures robust defense across international boundaries."
      ],
      bulletPoints: [
        { label: "Trademark Search (TESS Tool)", text: "Always perform deep variations, spelling, and phonetic searches inside the USPTO's Trademark Electronic Search System database." },
        { label: "Filing Basis Selection", text: "Use 'Intent to Use' to lock down brand names before releasing publicly, then transition to 'Use in Commerce' once listings go live on the marketplace." },
        { label: "Recommended Class 42 Text", text: "Use: 'Software as a Service (SaaS) providing intellectual property management and royalty distribution for artists, musicians, and writers' as your primary spec." }
      ],
      checklist: [
        "Conduct phonetic and direct trademark search on TESS tool",
        "Adopt explicit Class 42 SaaS descriptive specifications",
        "Differentiate between 'Intent to Use' versus 'Use in Commerce' bases",
        "Sign mutual structural NDAs before sharing code with freelance teams",
        "Establish formal platform Terms of Service to outline license limits"
      ]
    },
    {
      id: 'vla-resources',
      category: 'legal',
      title: '5. Volunteers for the Arts & Pro Bono Counsel',
      subtitle: 'Free legal programs, copyright filings, and bootstrap incorporation resources.',
      icon: BookOpen,
      content: [
        "Filing trademarks and incorporating legal entities like LLCs can be incredibly expensive for independent, developing creators starting on limited funds.",
        "We actively recommend sourcing 'Volunteers for the Arts' programs. These state-sponsored and regional pro-bono networks bridge developing creators with elite legal help for free."
      ],
      bulletPoints: [
        { label: "Pro Bono Support Networks", text: "Most major regions offer Volunteer Lawyers for the Arts (VLA) centers, providing free consultations on copyrights, contracts, and licensing conflict resolution." },
        { label: "Company Incorporation Guidance", text: "VLA mentors help creators select proper corporations or LLC limits to protect personal assets from marketplace liability risks." },
        { label: "Trademark Filings Advice", text: "Get free expert review of your TEAS/TESS trademark filings to prevent costly rejections and typos." }
      ]
    },
    {
      id: 'target-audience',
      category: 'manifesto',
      title: '6. High-Value Creators & Matchmaking Market',
      subtitle: 'Reaching visual artists, independent musicians, and digital publishers globally.',
      icon: Users,
      content: [
        "The creative economy is decentralized and independent. We align our services to match three high-value target client groups seeking direct licensing tools.",
        "By structuring easily purchasable licensing packages, we bridge the gap between creative supply and media agency demand."
      ],
      bulletPoints: [
        { label: "Independent Musicians", text: "Musicians and composers looking to sell sync licensing rights directly to game developers, streams, and film supervisors on transparent parameters." },
        { label: "Digital & Visual Artists", text: "Digital illustrators, photographers, and model creators wanting bulletproof proof-of-creation stamps and immutable secondary royalty agreements." },
        { label: "Writers & Publishers", text: "Self-publishing authors, journalists, and screenwriters licensing translation, e-book, or serial publication rights instantly without publishing intermediaries." }
      ]
    },
    {
      id: 'platform-onboarding',
      category: 'manifesto',
      title: '7. Zero-Trust Access & Troubleshooting Checklist',
      subtitle: 'Critical Web3 ledger steps to register, mint, and license assets.',
      icon: Milestone,
      content: [
        "Operating securely on the blockchain requires adherence to direct, local ledger interactions. Review this vital sequence to maintain zero-trust integrity during your licensing campaigns."
      ],
      checklist: [
        "Verify MetaMask is unlocked and pointed to correct network interface",
        "Register asset specifications via the registry hub to anchor database states",
        "Approve the on-chain MetaMask signature to 'Mint' the cryptographic NFT",
        "List licensing pricing in ETH and configure usage limits freely",
        "Accept automated buyer purchase payments directly into local ledger address"
      ]
    }
  ];

  const filteredSections = sections.filter(sec => {
    const matchesSearch = sec.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          sec.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          sec.content.some(p => p.toLowerCase().includes(searchQuery.toLowerCase()));
    
    if (activeTab === 'all') return matchesSearch;
    return sec.category === activeTab && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#050505] text-[#e0e0e0] font-sans selection:bg-cyan-500/20 selection:text-cyan-300">
      
      {/* Decorative Glow elements */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/4 w-[600px] h-[600px] bg-violet-500/5 rounded-full blur-[150px] pointer-events-none" />

      {/* Header element */}
      <nav className="border-b border-zinc-900 bg-zinc-950/55 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image src="/sovranly-logo-v2.png" alt="Sovranly IP" width={32} height={32} className="rounded-xl border border-white/5" />
            <div className="flex flex-col">
              <span className="font-extrabold tracking-tight text-white leading-tight uppercase">SOVRANLY IP</span>
              <span className="text-[10px] uppercase font-mono text-cyan-400 tracking-wider">Blueprint & Wiki Hub</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button asChild variant="outline" className="border-zinc-850 text-zinc-300 hover:text-white hover:bg-zinc-900 rounded-full text-xs">
              <Link href="/faq">
                Sovereign FAQ
              </Link>
            </Button>
            <Button asChild variant="outline" className="border-zinc-850 text-zinc-300 hover:text-white hover:bg-zinc-900 rounded-full text-xs">
              <Link href="/dashboard" className="flex items-center gap-1.5">
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
              </Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-6 py-12 relative z-10">
        
        {/* Title Block */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-zinc-900 border border-zinc-800 rounded-full text-xs text-zinc-400 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-mono text-[9px] uppercase tracking-wider">Empowered Creator Wiki</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter text-white mb-3">
            Sovereign <span className="text-cyan-400">Blueprint</span> & Support Wiki
          </h1>
          <p className="text-zinc-450 text-sm max-w-3xl leading-relaxed">
            The complete, fully flushed blueprint of <strong>Sovranly IP Hub</strong>. Secure your trademark registrations, calculate automated on-chain splits, review legal counseling strategies, and execute direct support via our integrated AI Agent.
          </p>
        </div>

        {/* Global Stats bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10 bg-zinc-950 p-5 rounded-2xl border border-zinc-900">
          <div>
            <div className="text-[10px] uppercase font-mono text-zinc-500 tracking-wider">Royalty Standard</div>
            <div className="text-xl font-bold text-white font-mono mt-0.5">85% / 15%</div>
            <p className="text-[10px] text-cyan-400 mt-1 font-sans">On-chain split ratio</p>
          </div>
          <div>
            <div className="text-[10px] uppercase font-mono text-zinc-500 tracking-wider">Recommended TM Class</div>
            <div className="text-xl font-bold text-white font-mono mt-0.5">Class 42</div>
            <p className="text-[10px] text-zinc-450 mt-1 font-sans">SaaS IP management</p>
          </div>
          <div>
            <div className="text-[10px] uppercase font-mono text-zinc-500 tracking-wider">Legal Framework</div>
            <div className="text-xl font-bold text-white font-mono mt-0.5">VLA Networks</div>
            <p className="text-[10px] text-emerald-400 mt-1 font-sans">Pro-bono counselors</p>
          </div>
          <div>
            <div className="text-[10px] uppercase font-mono text-zinc-500 tracking-wider">Platform Security</div>
            <div className="text-xl font-bold text-white font-mono mt-0.5">Zero Trust</div>
            <p className="text-[10px] text-violet-400 mt-1 font-sans">Continuous validation</p>
          </div>
        </div>

        {/* Filters and search section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center mb-8 pb-6 border-b border-zinc-900">
          
          {/* Tabs */}
          <div className="flex gap-2 flex-wrap">
            {[
              { id: 'all', label: 'Complete Wiki' },
              { id: 'vision', label: 'Vision & Tech' },
              { id: 'economics', label: 'Royalty Splits' },
              { id: 'legal', label: 'Trademark & Pro Bono' },
              { id: 'manifesto', label: 'Creator Manuals' }
            ].map(tab => (
              <Button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                variant="outline"
                className={`rounded-full px-4 h-9 text-xs transition duration-200 ${
                  activeTab === tab.id 
                    ? 'border-cyan-500 text-cyan-400 bg-cyan-950/20' 
                    : 'border-zinc-850 text-zinc-400 bg-transparent hover:bg-zinc-900 hover:text-white'
                }`}
              >
                {tab.label}
              </Button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <Input 
              type="text" 
              placeholder="Search wiki parameters..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-zinc-950/85 border-zinc-850 text-white rounded-full pl-10 text-xs focus-visible:ring-cyan-500"
            />
          </div>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Main Wiki Accordion Cards */}
          <div className="lg:col-span-2 space-y-6">
            {filteredSections.length === 0 ? (
              <div className="text-center py-16 bg-[#09090b] rounded-2xl border border-zinc-900 border-dashed">
                <HelpCircle className="w-8 h-8 text-cyan-500/30 mx-auto mb-3" />
                <p className="text-zinc-500 text-xs">No matching support wiki guidelines found.</p>
              </div>
            ) : (
              filteredSections.map(sec => {
                const isOpen = openSections[sec.id] ?? false;
                return (
                  <Card key={sec.id} id={sec.id} className="bg-[#09090b] border border-zinc-900 overflow-hidden shadow-xl hover:border-zinc-850 transition duration-200">
                    
                    <button 
                      onClick={() => toggleSection(sec.id)}
                      className="w-full text-left p-6 flex justify-between items-start gap-4 hover:bg-zinc-900/15 transition"
                    >
                      <div className="flex items-start gap-4">
                        <div className="p-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-cyan-400 flex-shrink-0 mt-0.5">
                          <sec.icon className="w-5 h-5 text-cyan-400" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-white tracking-tight">{sec.title}</h3>
                          <p className="text-xs text-zinc-500 mt-1 line-clamp-1">{sec.subtitle}</p>
                        </div>
                      </div>
                      <ChevronDown className={`w-5 h-5 text-zinc-500 transition-transform flex-shrink-0 mt-2 ${isOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {isOpen && (
                      <div className="px-6 pb-6 pt-2 border-t border-zinc-900 space-y-4 text-sm leading-relaxed text-zinc-350">
                        {sec.content.map((paragraph, index) => (
                          <p key={index} className="leading-relaxed text-xs sm:text-sm">{paragraph}</p>
                        ))}

                        {/* Bullet Points */}
                        {sec.bulletPoints && (
                          <div className="mt-6 space-y-4 bg-zinc-950 p-5 rounded-2xl border border-zinc-900/80 font-sans">
                            {sec.bulletPoints.map((bp, bpIdx) => (
                              <div key={bpIdx} className="flex gap-3">
                                <span className="text-cyan-400 font-mono text-[10px] mt-1 uppercase tracking-widest bg-cyan-950/45 border border-cyan-800/15 px-2 py-0.5 rounded-md h-fit font-bold whitespace-nowrap">
                                  {bp.label}
                                </span>
                                <p className="text-zinc-300 text-xs sm:text-sm leading-relaxed">{bp.text}</p>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Checklist Section */}
                        {sec.checklist && (
                          <div className="mt-4 pt-4 border-t border-zinc-900 space-y-2">
                            <h4 className="text-xs uppercase font-mono text-zinc-500 tracking-wider">Sovereign Action Checklist</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                              {sec.checklist.map((item, chIdx) => (
                                <div key={chIdx} className="flex items-center gap-2.5 bg-zinc-950/80 border border-zinc-900/60 p-3 rounded-lg">
                                  <CheckCircle className="w-4 h-4 text-cyan-500 flex-shrink-0" />
                                  <span className="text-zinc-400 text-xs truncate" title={item}>{item}</span>
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
          </div>

          {/* Interactive AI Agent Chat Sidebar Console */}
          <div className="space-y-6">
            
            <Card className="bg-zinc-950 border border-cyan-500/10 shadow-lg shadow-cyan-950/5 relative overflow-hidden flex flex-col h-[580px] rounded-3xl">
              {/* Subtle top edge glow */}
              <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-cyan-500/25 to-transparent" />
              
              <CardHeader className="p-5 border-b border-zinc-900 flex flex-row items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-cyan-950/50 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                    <Bot className="w-4 h-4 animate-bounce" />
                  </div>
                  <div>
                    <CardTitle className="text-sm font-bold text-white tracking-tight flex items-center gap-1.5">
                      Sovereign AI Agent
                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
                    </CardTitle>
                    <CardDescription className="text-[10px] text-zinc-500">Co-pilot for Creators</CardDescription>
                  </div>
                </div>
                <Button 
                  size="icon" 
                  variant="ghost" 
                  onClick={() => setChatHistory([{ role: 'model', text: 'Greetings, Creator/Licensee. How may I assist your launch today?' }])}
                  className="w-7 h-7 text-zinc-500 hover:text-white"
                  title="Clear Chat history"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </Button>
              </CardHeader>

              {/* Chat Bubble Scroll container */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3.5 custom-scrollbar bg-zinc-950/40">
                {chatHistory.map((chat, idx) => (
                  <div 
                    key={idx} 
                    className={`flex items-start gap-2.5 ${chat.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {chat.role === 'model' && (
                      <div className="w-6 h-6 rounded-lg bg-cyan-950/45 border border-cyan-500/10 text-cyan-400 flex items-center justify-center text-[10px] flex-shrink-0 mt-1 font-mono">
                        AI
                      </div>
                    )}
                    <div 
                      className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs sm:text-sm shadow-md leading-relaxed ${
                        chat.role === 'user' 
                          ? 'bg-cyan-600 text-white rounded-tr-none' 
                          : 'bg-[#0a0a0c] text-zinc-350 border border-zinc-900 rounded-tl-none'
                      }`}
                    >
                      {formatChatText(chat.text)}
                    </div>
                  </div>
                ))}

                {isChatLoading && (
                  <div className="flex items-start gap-2.5 justify-start">
                    <div className="w-6 h-6 rounded-lg bg-cyan-950/45 border border-cyan-500/10 text-cyan-400 flex items-center justify-center text-[10px] flex-shrink-0 mt-1 animate-pulse">
                      AI
                    </div>
                    <div className="bg-[#0a0a0c] text-zinc-500 border border-zinc-900 rounded-2xl rounded-tl-none px-4 py-3 text-xs flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 animate-spin text-cyan-400" />
                      Sovereign intellect writing...
                    </div>
                  </div>
                )}
                <div ref={chatBottomRef} />
              </div>

              {/* Quick Prompt recommendations */}
              <div className="px-4 py-2 border-t border-zinc-900 bg-[#060608] space-y-1">
                <p className="text-[9px] uppercase tracking-wider text-zinc-650 font-mono">Quick Inquiries</p>
                <div className="flex gap-1.5 overflow-x-auto pb-1.5 custom-scrollbar-horizontal select-none">
                  {[
                    "Class 42 Description Description",
                    "Trademark Search TESS",
                    "Pro bono Volunteers for Arts",
                    "How royalty splits work"
                  ].map((chip) => (
                    <button 
                      key={chip} 
                      onClick={() => handleQuickQuestion(chip)}
                      className="text-[10px] whitespace-nowrap bg-zinc-900/80 px-2.5 py-1 text-zinc-450 hover:text-white rounded-lg border border-zinc-850 hover:bg-zinc-800 hover:border-cyan-500/20 transition-all font-mono"
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              </div>

              {/* Chat Input form */}
              <div className="p-4 border-t border-zinc-900 bg-zinc-950">
                <form 
                  onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
                  className="flex gap-2"
                >
                  <Input 
                    type="text" 
                    placeholder="Ask legal, split, or guide questions..." 
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    disabled={isChatLoading}
                    className="bg-[#09090b] text-white border-zinc-850 text-xs h-9 focus-visible:ring-cyan-500 rounded-xl"
                  />
                  <Button 
                    type="submit" 
                    disabled={!chatInput.trim() || isChatLoading}
                    className="bg-cyan-600 hover:bg-cyan-700 h-9 w-9 p-0 rounded-xl text-white flex-shrink-0"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </Button>
                </form>
              </div>

            </Card>

            {/* Structured Google Sponsor unit */}
            <GoogleAd slot="8519201080" />

            {/* Micro Royalty Simulator panel */}
            <Card className="bg-zinc-950 border border-zinc-900 p-6 shadow-md rounded-2xl">
              <CardTitle className="text-xs font-bold text-white tracking-widest uppercase mb-4 flex items-center justify-between font-mono">
                <span>Payout Distribution Ledger</span>
                <Calculator className="w-4 h-4 text-cyan-400" />
              </CardTitle>
              <div className="space-y-4">
                <div className="pt-2">
                  <div className="flex mb-2 items-center justify-between text-xs">
                    <div>
                      <span className="text-[9px] uppercase font-mono tracking-wider font-semibold inline-block py-1 px-2 rounded-full text-cyan-400 bg-cyan-950/20 border border-cyan-800/10">
                        Creator Share
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-semibold inline-block text-cyan-300 font-mono">
                        85.0%
                      </span>
                    </div>
                  </div>
                  <div className="overflow-hidden h-2.5 text-xs flex rounded-full bg-zinc-900">
                    <div style={{ width: "85%" }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-cyan-500" />
                    <div style={{ width: "15%" }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-violet-600" />
                  </div>
                </div>

                <div className="border-t border-zinc-900 pt-3 space-y-2 text-xs">
                  <div className="bg-[#09090b] p-2.5 rounded-lg border border-zinc-900 flex justify-between items-center">
                    <span className="text-zinc-500 text-[11px]">Example License Fee:</span>
                    <span className="font-bold text-white font-mono">1.00 ETH</span>
                  </div>
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-zinc-500">Artist Wallet payout:</span>
                    <span className="text-emerald-400 font-bold font-mono">0.85 ETH</span>
                  </div>
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-zinc-500">Gas Minimizer split:</span>
                    <span className="text-zinc-400 font-mono">0.15 ETH</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Strategic Milestones Quick Tracker */}
            <Card className="bg-zinc-950 border border-zinc-900 p-6 shadow-md rounded-2xl">
              <CardTitle className="text-xs font-bold text-white tracking-widest uppercase mb-4 flex items-center justify-between font-mono">
                <span>Launch Phase</span>
                <Milestone className="w-4 h-4 text-cyan-400" />
              </CardTitle>
              <div className="relative pl-6 space-y-4 border-l border-zinc-900">
                
                <div className="relative">
                  <span className="absolute -left-9 top-0.5 bg-cyan-500 text-black rounded-full p-0.5 border-4 border-zinc-950 flex items-center justify-center">
                    <CheckCircle className="w-3 h-3" />
                  </span>
                  <div className="text-xs">
                    <p className="font-bold text-white">Phase 1: Foundation</p>
                    <p className="text-[#999] text-[9px] font-mono">COMPLETED • JUNE 2026</p>
                    <p className="text-zinc-420 text-[11px] mt-1 text-zinc-400">Sovereign brand parameters & core registries anchored.</p>
                  </div>
                </div>

                <div className="relative">
                  <span className="absolute -left-9 top-0.5 bg-cyan-500/10 text-cyan-400 rounded-full p-0.5 border-4 border-zinc-950 flex items-center justify-center">
                    <Clock className="w-3 h-3" />
                  </span>
                  <div className="text-xs">
                    <p className="font-bold text-white">Phase 2: Bootstrap Funding</p>
                    <p className="text-cyan-400 text-[9px] font-mono">ACTIVE DEPLOYMENT</p>
                    <p className="text-zinc-400 text-[11px] mt-1">Locking down Class 42 trademarks, sourcing angel capital, recruiting pro bono VLAs.</p>
                  </div>
                </div>

                <div className="relative">
                  <span className="absolute -left-9 top-0.5 bg-zinc-900 text-zinc-700 rounded-full p-0.5 border-4 border-zinc-950 flex items-center justify-center">
                    <Clock className="w-3 h-3 text-zinc-800" />
                  </span>
                  <div className="text-xs">
                    <p className="font-bold text-zinc-550 text-zinc-600">Phase 3: Scale Rollout</p>
                    <p className="text-zinc-750 text-[9px] font-mono text-zinc-600">UPCOMING</p>
                    <p className="text-zinc-500 text-[11px] mt-1">Multi-format legal contract layers & public releases.</p>
                  </div>
                </div>

              </div>
            </Card>

            {/* Legal Defense Quick Card */}
            <Card className="bg-gradient-to-br from-zinc-950 to-cyan-950/25 border border-zinc-900 p-6 rounded-2xl">
              <h4 className="text-xs font-mono uppercase tracking-wider text-cyan-400 mb-2 flex items-center gap-1.5 font-bold">
                <Scale className="w-3.5 h-3.5" /> Volunteers for the Arts (VLA)
              </h4>
              <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                Need pro bono help? Sourcing local <strong>Volunteers for the Arts (VLA)</strong> chapters provides incredible copyright, trademark Class 42 SaaS registration, and business entity help completely free of legal retainer burden.
              </p>
            </Card>

          </div>

        </div>

      </main>

      {/* Footer Element */}
      <footer className="border-t border-zinc-900/60 py-12 text-center text-zinc-600 text-xs relative z-15 mt-16 bg-zinc-950/50">
        <p>© 2026 Creative Sovereignty LLC • Sovereign Legal Registry & On-Chain Licensing mechanics. Trust Nothing, Authenticate Everything.</p>
      </footer>

    </div>
  );
}
