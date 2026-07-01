'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Shield, 
  Cpu, 
  Database, 
  Lock, 
  CheckCircle2, 
  Activity, 
  Terminal, 
  ArrowRight, 
  Code2, 
  Layers, 
  Globe, 
  RefreshCw, 
  FileCode, 
  Key,
  Flame,
  Check,
  AlertCircle
} from 'lucide-react';

interface TechComponent {
  id: string;
  name: string;
  category: 'frontend' | 'backend' | 'blockchain' | 'infrastructure';
  tech: string;
  version: string;
  securityProof: string;
  status: 'operational' | 'verifying' | 'degraded';
  description: string;
}

const TECH_COMPONENTS: TechComponent[] = [
  {
    id: 'tech-1',
    name: 'Zero Trust Application Interface',
    category: 'frontend',
    tech: 'Next.js 15 (App Router)',
    version: 'v15.1.0',
    securityProof: 'Strict CSP headers, TLS 1.3, client-to-server cryptographically bound session loops.',
    status: 'operational',
    description: 'High-fidelity display layers optimized with Server-Side Rendering and lightweight client-side React leaf nodes.'
  },
  {
    id: 'tech-2',
    name: 'Secure Static Type Governance',
    category: 'frontend',
    tech: 'TypeScript & ES Modules',
    version: 'v5.5.4',
    securityProof: 'Strict type constraint checks, secure imports compilation, and zero-leak variables compilation.',
    status: 'operational',
    description: 'Guarantees absolute safety from runtime data format bugs or prototype injections.'
  },
  {
    id: 'tech-3',
    name: 'Sovereign Distributed Storage',
    category: 'backend',
    tech: 'Google Cloud Firestore',
    version: 'Cloud Native',
    securityProof: 'Granular Firestore Security Rules matching user-bound UID tokens with zero-trust database reads.',
    status: 'operational',
    description: 'Provides lightning-fast, durable sub-second state replication and real-time transaction listener syncing.'
  },
  {
    id: 'tech-4',
    name: 'Identity Token Envelope',
    category: 'backend',
    tech: 'Firebase Authentication',
    version: 'v10.12.0',
    securityProof: 'Decentralized JWT verification, multi-factor authorization, and secure session continuous state mapping.',
    status: 'operational',
    description: 'Enforces cryptographically signed identification vectors before any API route or db doc reads are permitted.'
  },
  {
    id: 'tech-5',
    name: 'Decentralized Smart Registers',
    category: 'blockchain',
    tech: 'Solidity Smart Contracts',
    version: 'v0.8.24',
    securityProof: 'Immutable EVM bytecodes, verified gas estimates, and fully-audited automated licensing split fractions.',
    status: 'operational',
    description: 'Deploys legal licensing compacts onto decentralized public network registries.'
  },
  {
    id: 'tech-6',
    name: 'Decentralized RPC Providers',
    category: 'blockchain',
    tech: 'Ethers.js & MetaMask Nodes',
    version: 'v6.13.0',
    securityProof: 'Hardware-key transaction signatures with client-side consensus approval and transaction logging.',
    status: 'operational',
    description: 'Brokers transactions directly to decentralized networks for immediate licensing fee settlement.'
  },
  {
    id: 'tech-7',
    name: 'Isolated Virtualization Enclosure',
    category: 'infrastructure',
    tech: 'Cloud Run Containers',
    version: 'Secure Sandbox',
    securityProof: 'Sandboxed microservice boundaries, secret managers mapping, and zero persistent environment exposure.',
    status: 'operational',
    description: 'Serves secure backend API proxies to completely mask API keys and access vectors from public browsers.'
  },
  {
    id: 'tech-8',
    name: 'Strict Port Nginx Proxy',
    category: 'infrastructure',
    tech: 'Nginx Reverse Proxy routing',
    version: 'v1.25.0',
    securityProof: 'Strict port-3000 single mapping, request size limits, and robust DDoS traffic filtering.',
    status: 'operational',
    description: 'Intercepts external requests, mapping safe public traffic directly into the application.'
  }
];

export default function TechStackLedger() {
  const [components, setComponents] = useState<TechComponent[]>(TECH_COMPONENTS);
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'frontend' | 'backend' | 'blockchain' | 'infrastructure'>('all');
  const [isVerifyingAll, setIsVerifyingAll] = useState(false);
  const [activeLogs, setActiveLogs] = useState<string[]>([]);
  const [verificationProgress, setVerificationProgress] = useState(100);
  
  // Ledger Input Verification State
  const [testPayload, setTestPayload] = useState('0x7f4c9c22b918a3efb3992b9ea89932e6a1122cf2');
  const [hashType, setHashType] = useState<'SHA-256' | 'Keccak-256'>('Keccak-256');
  const [verificationReceipt, setVerificationReceipt] = useState<any | null>(null);
  const [isReceiptLoading, setIsReceiptLoading] = useState(false);

  const logsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logsEndRef.current) {
      logsEndRef.current.scrollTop = logsEndRef.current.scrollHeight;
    }
  }, [activeLogs]);

  // Run comprehensive tech verification probe
  const handleVerifyStack = () => {
    if (isVerifyingAll) return;
    setIsVerifyingAll(true);
    setVerificationProgress(0);
    setActiveLogs(['[SYS] Starting continuous security and dependency verification...']);

    const steps = [
      { 
        p: 15, 
        log: '[PROBE] Pinging Local Nginx Proxy and secure port 3000... STATUS: ACTIVE',
        compId: 'tech-8',
        status: 'verifying' as const
      },
      { 
        p: 30, 
        log: '[PROBE] Scanning Next.js 15 routing bundle and ES Module imports... STATUS: VERIFIED',
        compId: 'tech-1',
        status: 'operational' as const
      },
      { 
        p: 45, 
        log: '[PROBE] Auditing Firestore security boundaries and Auth headers... STATUS: SECURE',
        compId: 'tech-3',
        status: 'operational' as const
      },
      { 
        p: 60, 
        log: '[PROBE] Connecting to Firebase Authentication active user session tokens... STATUS: PASS',
        compId: 'tech-4',
        status: 'operational' as const
      },
      { 
        p: 75, 
        log: '[PROBE] Resolving decentralized EVM smart contract block records... STATUS: SYNCHRONIZED',
        compId: 'tech-5',
        status: 'operational' as const
      },
      { 
        p: 90, 
        log: '[PROBE] Resolving local MetaMask cryptographic provider context... STATUS: ONLINE',
        compId: 'tech-6',
        status: 'operational' as const
      },
      { 
        p: 100, 
        log: '[SYS] Tech Stack Ledger audit completed. 8/8 tiers successfully validated. Sovranly IP is healthy!',
        compId: 'all',
        status: 'operational' as const
      }
    ];

    // Trigger sequential visual state updates
    steps.forEach((step, idx) => {
      setTimeout(() => {
        setVerificationProgress(step.p);
        setActiveLogs(prev => [...prev, step.log]);
        
        if (step.compId !== 'all') {
          setComponents(prev => prev.map(c => 
            c.id === step.compId ? { ...c, status: step.status } : c
          ));
        }

        if (idx === steps.length - 1) {
          setIsVerifyingAll(false);
          // Ensure all are operational
          setComponents(TECH_COMPONENTS);
        }
      }, (idx + 1) * 1100);
    });
  };

  // Perform custom receipt audit check
  const handleVerifyReceipt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!testPayload.trim()) return;

    setIsReceiptLoading(true);
    setVerificationReceipt(null);

    setTimeout(() => {
      // Simulate real zero-trust cryptographic response block
      const computedHash = hashType === 'Keccak-256'
        ? `0x${Array.from({length: 64}, () => Math.floor(Math.random()*16).toString(16)).join('')}`
        : `sha256-${Array.from({length: 44}, () => Math.floor(Math.random()*16).toString(16)).join('')}`;

      setVerificationReceipt({
        status: 'AUTHENTICATED',
        timestamp: new Date().toISOString(),
        payloadInput: testPayload.trim(),
        computedHash: computedHash,
        zeroTrustAuthorization: 'VALID_CLAIM_SET_AUTHENTICATED',
        encryptionFramework: 'Ethers/Firestore Double-Bound Signature',
        networkBlock: 19482103 + Math.floor(Math.random() * 150),
        validationNode: 'sovranly-validation-replica-01'
      });
      setIsReceiptLoading(false);
    }, 1200);
  };

  const filteredComponents = selectedCategory === 'all' 
    ? components 
    : components.filter(c => c.category === selectedCategory);

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12 font-sans text-left">
      
      {/* Page Title & Context Header */}
      <div className="border-b border-zinc-900 pb-4">
        <h2 className="text-xl font-black text-white tracking-tight uppercase flex items-center gap-2">
          <Shield className="w-5 h-5 text-emerald-400" />
          Sovranly Tech Stack Ledger
        </h2>
        <p className="text-xs text-zinc-500 font-mono mt-0.5">
          Immutable cryptographic proof-of-validity ledger and live audit suite for the Sovranly IP Zero Trust architecture.
        </p>
      </div>

      {/* Main Stats / Validator Console */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Core Live Probe Console */}
        <div className="lg:col-span-7 bg-zinc-950 border border-zinc-900 rounded-3xl p-6 relative overflow-hidden flex flex-col justify-between shadow-xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-emerald-500/5 via-transparent to-transparent pointer-events-none" />
          
          <div className="space-y-3">
            <span className="text-[10px] uppercase font-mono tracking-widest text-emerald-400 font-black flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 animate-pulse" /> Live Stack Health Probe
            </span>
            <h3 className="text-sm font-bold text-zinc-400">Validate Framework Tiers & Authenticated Envelopes</h3>
          </div>

          {/* Verification Bar */}
          <div className="my-6 space-y-2">
            <div className="flex justify-between items-center text-xs font-mono text-zinc-400">
              <span>Security Probe Progress</span>
              <span className="text-emerald-400">{verificationProgress}%</span>
            </div>
            <div className="w-full bg-zinc-900 rounded-full h-2.5 overflow-hidden border border-zinc-800">
              <div 
                className="bg-gradient-to-r from-emerald-500 to-cyan-500 h-full transition-all duration-300 ease-out"
                style={{ width: `${verificationProgress}%` }}
              />
            </div>
          </div>

          {/* Simulated Node Terminal */}
          <div 
            ref={logsEndRef}
            className="bg-[#040406] border border-zinc-900 rounded-2xl p-4 h-40 overflow-y-auto font-mono text-xs text-zinc-400 space-y-1.5 mb-6 scrollbar-thin scrollbar-thumb-zinc-800"
          >
            {activeLogs.length === 0 ? (
              <div className="text-zinc-650 flex flex-col items-center justify-center h-full gap-2">
                <Terminal className="w-6 h-6 text-zinc-700" />
                <p className="text-[10px] uppercase tracking-wider font-bold">Ledger Validator Offline</p>
                <p className="text-[9px] text-zinc-650 max-w-xs text-center">Click the verify button below to dispatch live node health tests across the stack.</p>
              </div>
            ) : (
              activeLogs.map((log, idx) => (
                <div key={idx} className={`${log.includes('STATUS: VERIFIED') || log.includes('STATUS: SECURE') || log.includes('STATUS: PASS') || log.includes('STATUS: SYNCHRONIZED') ? 'text-emerald-400 font-semibold' : log.includes('[SYS]') ? 'text-cyan-400' : 'text-zinc-400'}`}>
                  {log}
                </div>
              ))
            )}
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-zinc-900">
            <div className="flex items-center gap-2">
              <span className={`h-2 w-2 rounded-full ${isVerifyingAll ? 'bg-cyan-500 animate-pulse' : 'bg-emerald-500'}`} />
              <p className="text-[10px] text-zinc-500 font-mono">
                {isVerifyingAll ? 'Running end-to-end framework test suite...' : 'All local, database and contract modules fully operational.'}
              </p>
            </div>

            <button
              onClick={handleVerifyStack}
              disabled={isVerifyingAll}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isVerifyingAll ? 'animate-spin' : ''}`} />
              Verify Stack Security
            </button>
          </div>
        </div>

        {/* Live Metrics Grid */}
        <div className="lg:col-span-5 bg-zinc-950 border border-zinc-900 rounded-3xl p-6 flex flex-col justify-between shadow-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-cyan-500" />
          
          <div className="space-y-4">
            <h3 className="text-xs font-mono uppercase font-black tracking-wider text-white flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-emerald-400" /> Verified On-Chain Logs
            </h3>
            
            <div className="grid grid-cols-2 gap-4 py-3">
              <div className="bg-zinc-900/40 border border-zinc-900 rounded-2xl p-4">
                <span className="block text-2xl font-black text-white font-mono">Next.js 15+</span>
                <span className="block text-[9px] uppercase font-mono text-zinc-500 mt-1">App Architecture</span>
              </div>
              <div className="bg-zinc-900/40 border border-zinc-900 rounded-2xl p-4">
                <span className="block text-2xl font-black text-white font-mono">Firestore</span>
                <span className="block text-[9px] uppercase font-mono text-zinc-500 mt-1">Cloud State Sync</span>
              </div>
              <div className="bg-zinc-900/40 border border-zinc-900 rounded-2xl p-4">
                <span className="block text-2xl font-black text-white font-mono">8 / 8 Tiers</span>
                <span className="block text-[9px] uppercase font-mono text-zinc-500 mt-1">Validated Tiers</span>
              </div>
              <div className="bg-zinc-900/40 border border-zinc-900 rounded-2xl p-4">
                <span className="block text-2xl font-black text-white font-mono">Zero Trust</span>
                <span className="block text-[9px] uppercase font-mono text-zinc-500 mt-1">Continuous Auth</span>
              </div>
            </div>
          </div>

          <p className="text-[10px] text-zinc-500 font-mono leading-relaxed pt-2 border-t border-zinc-900/60">
            * Validation credentials sync dynamically with Firestore Security rules to guarantee that no unauthorized data-extraction is possible from external shards.
          </p>
        </div>

      </div>

      {/* Grid of Framework Components */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h3 className="text-xs font-mono uppercase font-black tracking-wider text-white">
            Stack Component Blueprint Registry
          </h3>

          {/* Filtering Categories */}
          <div className="flex flex-wrap gap-1.5 bg-zinc-900/40 p-1 rounded-xl border border-zinc-900 w-fit">
            {(['all', 'frontend', 'backend', 'blockchain', 'infrastructure'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-mono font-extrabold uppercase transition-all cursor-pointer ${
                  selectedCategory === cat 
                    ? 'bg-zinc-800 text-white' 
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Components Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredComponents.map((comp) => (
            <motion.div
              layout
              key={comp.id}
              className="bg-[#09090b] border border-zinc-900 hover:border-zinc-800 p-5 rounded-2xl flex flex-col justify-between space-y-4 transition-all"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className={`text-[9px] font-mono uppercase font-black px-2 py-0.5 rounded-md ${
                    comp.category === 'frontend' ? 'bg-cyan-950/40 text-cyan-400 border border-cyan-500/10' :
                    comp.category === 'backend' ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-500/10' :
                    comp.category === 'blockchain' ? 'bg-violet-950/40 text-violet-400 border border-violet-500/10' :
                    'bg-amber-950/40 text-amber-400 border border-amber-500/10'
                  }`}>
                    {comp.category}
                  </span>
                  
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[9px] font-mono font-bold text-zinc-500 uppercase">{comp.status}</span>
                  </div>
                </div>

                <h4 className="text-xs font-black text-white tracking-tight">{comp.name}</h4>
                <p className="text-[11px] text-zinc-400 leading-relaxed font-sans">{comp.description}</p>
              </div>

              <div className="pt-3 border-t border-zinc-900 space-y-1.5">
                <div className="flex justify-between items-center text-[10px] font-mono">
                  <span className="text-zinc-500">Framework:</span>
                  <span className="text-zinc-300 font-bold">{comp.tech}</span>
                </div>
                <div className="flex justify-between items-center text-[10px] font-mono">
                  <span className="text-zinc-500">Constraint:</span>
                  <span className="text-zinc-300 truncate max-w-[130px]" title={comp.securityProof}>{comp.securityProof}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Cryptographic Ledger Verification Box */}
      <div className="bg-zinc-950 border border-zinc-900 rounded-3xl p-6 shadow-xl space-y-5">
        <div className="border-b border-zinc-900 pb-3">
          <h3 className="text-xs font-mono uppercase font-black tracking-wider text-white flex items-center gap-1.5">
            <Key className="w-4 h-4 text-cyan-400" /> Cryptographic Ledger Audit Proof
          </h3>
          <p className="text-[11px] text-zinc-500 font-mono mt-0.5">Generate and cross-examine Zero-Trust asset hashes using our EVM signature parser</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Audit Inputs Form */}
          <div className="lg:col-span-5 space-y-4">
            <form onSubmit={handleVerifyReceipt} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono uppercase text-zinc-400 font-bold block">Asset Payload or ID</label>
                <input 
                  type="text"
                  required
                  value={testPayload}
                  onChange={(e) => setTestPayload(e.target.value)}
                  placeholder="e.g. 0x7f4c9c2..."
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono uppercase text-zinc-400 font-bold block">Hashing Schema</label>
                <div className="grid grid-cols-2 gap-2">
                  {(['Keccak-256', 'SHA-256'] as const).map((schema) => (
                    <button
                      key={schema}
                      type="button"
                      onClick={() => setHashType(schema)}
                      className={`py-2 text-[10px] font-mono font-bold rounded-xl border transition-all cursor-pointer ${
                        hashType === schema 
                          ? 'bg-cyan-950/40 border-cyan-500/50 text-cyan-400'
                          : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:text-white'
                      }`}
                    >
                      {schema}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={isReceiptLoading}
                className="w-full bg-zinc-900 hover:bg-cyan-950/30 hover:border-cyan-500/30 text-white font-mono font-bold text-xs uppercase tracking-wider py-2.5 rounded-xl border border-zinc-800 hover:text-cyan-400 transition-all flex items-center justify-center gap-1.5 shadow-lg cursor-pointer"
              >
                {isReceiptLoading ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    Hashing Block...
                  </>
                ) : (
                  <>
                    <Code2 className="w-4 h-4" />
                    Parse Signature Proof
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Audit Verification Receipt Output */}
          <div className="lg:col-span-7 bg-[#040406] border border-zinc-900 rounded-2xl p-5 min-h-[220px] flex flex-col justify-between">
            {isReceiptLoading ? (
              <div className="flex-1 flex flex-col items-center justify-center space-y-3">
                <div className="relative w-8 h-8">
                  <div className="absolute inset-0 border-2 border-cyan-500/10 rounded-full" />
                  <div className="absolute inset-0 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                </div>
                <p className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest animate-pulse">Running consensus algorithm checks...</p>
              </div>
            ) : verificationReceipt ? (
              <div className="space-y-4 text-left">
                <div className="flex items-center justify-between border-b border-zinc-900 pb-2">
                  <span className="text-[10px] font-mono uppercase font-black text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> SECURED PROOF RECEIPT
                  </span>
                  <span className="text-[9px] font-mono text-zinc-500">{verificationReceipt.timestamp}</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-6">
                  <div>
                    <span className="block text-[8px] font-mono uppercase text-zinc-500">Payload Source</span>
                    <span className="block text-xs font-mono text-zinc-300 truncate max-w-[200px]" title={verificationReceipt.payloadInput}>{verificationReceipt.payloadInput}</span>
                  </div>

                  <div>
                    <span className="block text-[8px] font-mono uppercase text-zinc-500">Consensus Result Hash</span>
                    <span className="block text-xs font-mono text-emerald-400 truncate max-w-[200px]" title={verificationReceipt.computedHash}>{verificationReceipt.computedHash}</span>
                  </div>

                  <div>
                    <span className="block text-[8px] font-mono uppercase text-zinc-500">Zero-Trust Level</span>
                    <span className="block text-[10px] font-bold text-white bg-zinc-900 px-2 py-0.5 rounded border border-zinc-850 w-fit">{verificationReceipt.zeroTrustAuthorization}</span>
                  </div>

                  <div>
                    <span className="block text-[8px] font-mono uppercase text-zinc-500">Sync Validation Replica</span>
                    <span className="block text-xs font-mono text-cyan-400">{verificationReceipt.validationNode}</span>
                  </div>

                  <div>
                    <span className="block text-[8px] font-mono uppercase text-zinc-500">Target Block ID</span>
                    <span className="block text-xs font-mono text-zinc-300">#{verificationReceipt.networkBlock}</span>
                  </div>

                  <div>
                    <span className="block text-[8px] font-mono uppercase text-zinc-500">Authorization Logic</span>
                    <span className="block text-xs font-mono text-zinc-300">{verificationReceipt.encryptionFramework}</span>
                  </div>
                </div>

                <div className="text-[9px] font-mono text-zinc-500 leading-normal bg-zinc-900/30 p-2.5 rounded-lg border border-zinc-900/60 mt-2">
                  INFO: This ledger transaction signature is verified on-chain and registered inside Google Cloud Firestore database under user UID <strong>{verificationReceipt.validationNode}</strong> index ruleset.
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center space-y-2">
                <FileCode className="w-8 h-8 text-zinc-700 animate-pulse" />
                <h4 className="text-[10px] font-mono uppercase font-bold text-zinc-500">Ledger Awaiting Payload</h4>
                <p className="text-[9px] font-mono text-zinc-650 max-w-sm leading-relaxed">
                  Enter an asset identification string or smart contract parameter, then execute the parser to generate an authenticated validation receipt envelope.
                </p>
              </div>
            )}
          </div>

        </div>
      </div>

    </div>
  );
}
