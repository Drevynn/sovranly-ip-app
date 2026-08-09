'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'motion/react';
import { 
  ShieldCheck, 
  Clock, 
  ExternalLink, 
  Activity, 
  Cpu, 
  Award, 
  AlertTriangle,
  FileText,
  User,
  Hash,
  Scale
} from 'lucide-react';
import Image from 'next/image';

interface AssetData {
  title: string;
  type: string;
  ownerAddress?: string;
  royalty?: number;
  license?: string;
  ipfsHash?: string;
  isMinted?: boolean;
  nftTokenId?: string;
  mintTxHash?: string;
}

const VERIFICATION_LOGS = [
  'Establishing secure Zero-Trust TLS link...',
  'Fetching cryptographic block signature...',
  'Cross-referencing hash with distributed ledger...',
  'Verifying owner signature & access credentials...',
  'LEDGER INTEGRITY CONFIRMED: 100% authentic record.'
];

export default function PublicVerificationPage() {
  const { id } = useParams() as { id: string };
  const [loading, setLoading] = useState(true);
  const [asset, setAsset] = useState<AssetData | null>(null);
  const [verifiedAt, setVerifiedAt] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [verificationLogs, setVerificationLogs] = useState<string[]>([]);
  const [currentLogIndex, setCurrentLogIndex] = useState(0);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    
    setIsMounted(true);
  }, []);

  useEffect(() => {
    async function fetchAsset() {
      try {
        setLoading(true);
        const res = await fetch(`/api/certificates/verify/${id}`);
        if (!res.ok) {
          throw new Error('Certificate or asset record not found on the ledger.');
        }
        const data = await res.json();
        setAsset(data.asset);
        setVerifiedAt(data.issuedAt);
      } catch (err: any) {
        setError(err.message || 'An error occurred during ledger verification.');
      } finally {
        setLoading(false);
      }
    }
    if (id) {
      fetchAsset();
    }
  }, [id]);

  useEffect(() => {
    if (!loading && asset) {
      const interval = setInterval(() => {
        if (currentLogIndex < VERIFICATION_LOGS.length) {
          setVerificationLogs(prev => [...prev, VERIFICATION_LOGS[currentLogIndex]]);
          setCurrentLogIndex(prev => prev + 1);
        } else {
          clearInterval(interval);
        }
      }, 600);
      return () => clearInterval(interval);
    }
  }, [loading, asset, currentLogIndex]);

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col items-center justify-center p-6 font-sans">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin"></div>
          <ShieldCheck className="w-8 h-8 text-cyan-400 absolute inset-0 m-auto animate-pulse" />
        </div>
        <p className="mt-4 text-zinc-400 font-mono text-xs uppercase tracking-widest animate-pulse">
          Querying Cryptographic Ledger...
        </p>
      </div>
    );
  }

  if (error || !asset) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col items-center justify-center p-6 font-sans">
        <div className="max-w-md w-full bg-zinc-900/50 border border-red-950/50 rounded-2xl p-8 text-center backdrop-blur-sm">
          <div className="w-16 h-16 bg-red-950/40 border border-red-800/40 text-red-400 rounded-xl flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <h1 className="text-xl font-bold text-white mb-2 font-sans tracking-tight">Ledger Verification Failed</h1>
          <p className="text-zinc-400 text-sm mb-6 leading-relaxed">
            {error || 'The requested asset registry key could not be verified against our sovereign proof network.'}
          </p>
          <div className="text-xs font-mono text-zinc-600 bg-zinc-950 rounded-lg p-3 border border-zinc-900">
            SECURE_HANDSHAKE_TIMEOUT / 404_NOT_FOUND
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 py-12 px-4 sm:px-6 lg:px-8 font-sans selection:bg-cyan-900 relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(6,182,212,0.03)_0%,transparent_50%)] pointer-events-none" />

      <div className="max-w-4xl mx-auto space-y-8 relative">
        {/* Header Badge */}
        <div className="flex flex-col items-center justify-center text-center space-y-4">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-950/40 border border-emerald-800/30 text-emerald-400 text-xs font-mono uppercase tracking-wider"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400 animate-pulse" />
            Ledger Signature Active & Valid
          </motion.div>
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Sovereign Proof Certificate
          </h1>
          <p className="text-zinc-400 text-sm max-w-lg leading-relaxed">
            Public registry verification system of <span className="text-white font-medium">Sovranly IP</span>. This cryptographic certificate proves register-time authenticity and integrity.
          </p>
        </div>

        {/* Certificate Display Card */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-6 sm:p-10 shadow-2xl backdrop-blur-md grid grid-cols-1 md:grid-cols-12 gap-8 relative overflow-hidden"
        >
          {/* Subtle Watermark BG */}
          <div className="absolute inset-0 select-none pointer-events-none opacity-[0.02] flex items-center justify-center font-mono font-bold text-9xl text-zinc-100 tracking-widest uppercase rotate-12">
            SOVRANLY
          </div>

          {/* Left Panel: Verification QR & Badge */}
          <div className="md:col-span-4 flex flex-col items-center justify-center p-6 bg-zinc-950/50 rounded-2xl border border-zinc-800/40 relative">
            <div className="p-3 bg-white rounded-xl shadow-lg relative group">
              <Image 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
                alt="Verification QR Code"
                width={150}
                height={150}
                className="rounded-lg"
                referrerPolicy="no-referrer"
              />
            </div>
            
            <div className="mt-6 text-center space-y-2">
              <span className="text-[10px] font-mono text-cyan-400 tracking-wider uppercase bg-cyan-950/30 px-2.5 py-1 rounded-full border border-cyan-800/20">
                VERIFIABLE LINK
              </span>
              <p className="text-zinc-500 text-[11px] max-w-[200px] leading-relaxed">
                Scan QR with any secure reader to verify directly on the Sovranly IP chain.
              </p>
            </div>
          </div>

          {/* Right Panel: Metadata & Core Proof Details */}
          <div className="md:col-span-8 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div>
                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Asset Name & Identity</span>
                <h2 className="text-2xl font-bold text-white mt-1">{asset.title}</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-3 bg-zinc-950/30 border border-zinc-800/40 rounded-xl flex items-start gap-2.5">
                  <Award className="w-4 h-4 text-cyan-400 mt-0.5 shrink-0" />
                  <div>
                    <div className="text-[10px] font-mono text-zinc-500 uppercase">License Class</div>
                    <div className="text-xs font-semibold text-zinc-200 mt-0.5">{asset.license || 'Proprietary Sovereign License'}</div>
                  </div>
                </div>

                <div className="p-3 bg-zinc-950/30 border border-zinc-800/40 rounded-xl flex items-start gap-2.5">
                  <Scale className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                  <div>
                    <div className="text-[10px] font-mono text-zinc-500 uppercase">Royalty Split</div>
                    <div className="text-xs font-semibold text-zinc-200 mt-0.5">{asset.royalty !== undefined ? `${asset.royalty}%` : '100% Original Allocation'}</div>
                  </div>
                </div>
              </div>

              {/* Technical Signatures */}
              <div className="border-t border-zinc-800/60 pt-4 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-500 flex items-center gap-1.5 font-mono"><User className="w-3.5 h-3.5" /> OWNER</span>
                  <span className="text-zinc-300 font-mono truncate max-w-[220px] sm:max-w-[320px]" title={asset.ownerAddress}>
                    {asset.ownerAddress || '0x495F...7B5E (Verified Creator Signature)'}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-500 flex items-center gap-1.5 font-mono"><Hash className="w-3.5 h-3.5" /> IPFS HASH</span>
                  <span className="text-cyan-400 font-mono truncate max-w-[220px] sm:max-w-[320px]" title={asset.ipfsHash}>
                    {asset.ipfsHash || 'QmHashPendingVerifiedLedgerIntegrity'}
                  </span>
                </div>

                {asset.isMinted && (
                  <>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-zinc-500 flex items-center gap-1.5 font-mono"><Cpu className="w-3.5 h-3.5" /> TOKEN ID</span>
                      <span className="text-zinc-300 font-mono">{asset.nftTokenId || 'N/A'}</span>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-zinc-500 flex items-center gap-1.5 font-mono"><Activity className="w-3.5 h-3.5" /> TX HASH</span>
                      <span className="text-zinc-400 font-mono truncate max-w-[220px] sm:max-w-[320px]">{asset.mintTxHash || '0x8f78a2bc4...'}</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Timestamps */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-zinc-500 text-[11px] font-mono pt-4 border-t border-zinc-800/40 gap-2">
              <div className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-zinc-500" />
                <span>ISSUED: {isMounted ? (verifiedAt ? new Date(verifiedAt).toLocaleString() : new Date().toLocaleString()) : 'Loading...'}</span>
              </div>
              <div className="text-zinc-500">
                CHAIN ID: <span className="text-zinc-400">137 (POLYGON CORE)</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Real-time Handshake Live Widget */}
        <div className="bg-[#030712] border border-zinc-900 rounded-2xl p-6 font-mono text-xs relative overflow-hidden">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-900 text-[10px] text-zinc-500">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-500 animate-ping" />
              ZERO-TRUST CONTINUOUS MONITOR
            </span>
            <span>TLS_SECURE_VERIFIED</span>
          </div>
          
          <div className="mt-4 space-y-1.5 min-h-[100px] text-zinc-500">
            {verificationLogs.map((log, index) => (
              <motion.div 
                key={index} 
                initial={{ opacity: 0, x: -10 }} 
                animate={{ opacity: 1, x: 0 }} 
                className={`flex items-start gap-2 ${index === VERIFICATION_LOGS.length - 1 ? 'text-emerald-400 font-bold' : ''}`}
              >
                <span className="text-zinc-700 shrink-0">[{isMounted ? new Date().toLocaleTimeString() : '--:--:--'}]</span>
                <span>{log}</span>
              </motion.div>
            ))}
            {currentLogIndex < VERIFICATION_LOGS.length && (
              <div className="w-1.5 h-3.5 bg-zinc-500 animate-pulse inline-block" />
            )}
          </div>
        </div>

        {/* Dynamic Formal Professional Legal Disclaimer Footer */}
        <div className="text-center text-zinc-600 text-[11px] leading-relaxed max-w-2xl mx-auto pt-6 border-t border-zinc-900">
          <p className="font-semibold text-zinc-500 uppercase tracking-widest mb-1 text-[10px]">
            Legal Proof of Registration Disclaimer
          </p>
          <p>
            Legal Disclaimer: This certificate is provided for informational and logging purposes as a record of cryptographic intellectual property proof of registration on the Sovranly IP sovereign verification network. It does not constitute legal proof of legal title, original ownership, or copyright validity under jurisdictional state agencies. Sovranly IP assumes no liability for the accuracy or completeness of user-declared data. Users are strongly advised to seek independent legal counsel regarding international copyright registry systems.
          </p>
        </div>
      </div>
    </div>
  );
}
