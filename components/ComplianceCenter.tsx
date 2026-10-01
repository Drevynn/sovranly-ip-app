'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth/FirebaseProvider';
import { getAuthHeaders } from '@/lib/auth-client';
import {
  ShieldCheck,
  Download,
  Database,
  Lock,
  Clock,
  Trash2,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Copy,
  Check,
  RefreshCw,
  ExternalLink,
  Info,
  Calendar,
  Key,
  Archive,
  Layers,
  Sparkles,
  Server,
  FileCheck2,
  EyeOff,
  UserCheck,
  Mail,
  Scale
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { motion, AnimatePresence } from 'motion/react';

// Data Retention Categories & Policies
const RETENTION_POLICIES = [
  {
    id: 'assets',
    category: 'Creative Works & Stems',
    purpose: 'Copyright notarization & decentralized registry',
    storageLayer: 'Decentralized IPFS + On-Chain Hashes',
    encryption: 'AES-256-GCM + Client Sharding',
    retentionPeriod: 'Creator Controlled (Perpetual or until deleted)',
    retentionDays: 3650,
    purgeMethod: 'User Triggered Off-Chain Purge',
    legalBasis: 'GDPR Art. 6(1)(b) Contract Performance',
    badgeColor: 'text-cyan-400 bg-cyan-950/40 border-cyan-800/50',
    progress: 95,
  },
  {
    id: 'agreements',
    category: 'Licensing Compacts & Agreements',
    purpose: 'Enforceable legal license execution & smart contracts',
    storageLayer: 'Firestore Encrypted Vault + EVM Escrow',
    encryption: 'Zero Trust Field-Level Encryption',
    retentionPeriod: 'Duration of License Term + 7 Years',
    retentionDays: 2555,
    purgeMethod: 'Automated Post-Statutory Financial Purge',
    legalBasis: 'GDPR Art. 6(1)(c) Legal Obligation (Tax & Commercial Code)',
    badgeColor: 'text-emerald-400 bg-emerald-950/40 border-emerald-800/50',
    progress: 80,
  },
  {
    id: 'royalties',
    category: 'Royalty & Payment Settlements',
    purpose: 'Distribution ledger & creator earnings auditing',
    storageLayer: 'Immutable On-Chain Escrow + Firestore Mirror',
    encryption: 'SHA-256 Hashes + On-Chain Proofs',
    retentionPeriod: '7 Years Statutory Financial Record',
    retentionDays: 2555,
    purgeMethod: 'Anonymized Permanent Hash Retention',
    legalBasis: 'GDPR Art. 6(1)(c) Statutory Tax Compliance (IRS / DAC7)',
    badgeColor: 'text-amber-400 bg-amber-950/40 border-amber-800/50',
    progress: 70,
  },
  {
    id: 'telemetry',
    category: 'Ephemeral Telemetry & Logs',
    purpose: 'DDoS mitigation, latency diagnostics & authentication security',
    storageLayer: 'Memory Cache / Cloudflare Edge Stream',
    encryption: 'TLS 1.3 Strict In-Transit',
    retentionPeriod: '30 Days Rolling Window (Auto-Purged)',
    retentionDays: 30,
    purgeMethod: 'Automated Rolling 30-Day Cron Purge',
    legalBasis: 'GDPR Art. 6(1)(f) Legitimate Interest (Network Security)',
    badgeColor: 'text-violet-400 bg-violet-950/40 border-violet-800/50',
    progress: 25,
  },
  {
    id: 'identity',
    category: 'Creator Credentials & Auth State',
    purpose: 'Secure Zero Trust session authentication & passkey validation',
    storageLayer: 'Firebase Auth Identity Provider (Encrypted)',
    encryption: 'bcrypt / Ed25519 Cryptographic Signatures',
    retentionPeriod: 'Active Session Duration (Immediate on Logout/Erasure)',
    retentionDays: 90,
    purgeMethod: 'Immediate Session Termination / GDPR Art. 17',
    legalBasis: 'GDPR Art. 6(1)(a) Explicit Consent',
    badgeColor: 'text-teal-400 bg-teal-950/40 border-teal-800/50',
    progress: 50,
  },
];

export default function ComplianceCenter() {
  const { user, isSandboxMode } = useAuth();
  const [activeTab, setActiveTab] = useState<'retention' | 'export' | 'preferences' | 'erasure' | 'dpo'>('retention');

  // Export State
  const [isExporting, setIsExporting] = useState(false);
  const [exportData, setExportData] = useState<any | null>(null);
  const [exportError, setExportError] = useState<string | null>(null);
  const [copiedExport, setCopiedExport] = useState(false);

  // Preferences State
  const [preferences, setPreferences] = useState({
    doNotSellOrShare: true,
    aiTrainingOptIn: false,
    retentionWindowDays: 30,
    marketingConsent: false,
    telemetryAllowed: false,
    oracleTelemetrySync: true,
    thirdPartySync: false,
  });
  const [loadingPrefs, setLoadingPrefs] = useState(true);
  const [savingPrefs, setSavingPrefs] = useState(false);
  const [prefSaveSuccess, setPrefSaveSuccess] = useState(false);

  // Erasure State
  const [erasureInput, setErasureInput] = useState('');
  const [erasureReason, setErasureReason] = useState('');
  const [isProcessingErasure, setIsProcessingErasure] = useState(false);
  const [erasureReceipt, setErasureReceipt] = useState<any | null>(null);
  const [erasureError, setErasureError] = useState<string | null>(null);

  // Load Preferences on Mount
  useEffect(() => {
    let isMounted = true;
    const loadPreferences = async () => {
      try {
        const headers = await getAuthHeaders(user, isSandboxMode);
        const res = await fetch('/api/compliance/preferences', { headers: { ...headers } });
        if (res.ok) {
          const data = await res.json();
          if (isMounted) {
            setPreferences(prev => ({ ...prev, ...data }));
          }
        }
      } catch (err) {
        console.warn('Could not load compliance preferences:', err);
      } finally {
        if (isMounted) setLoadingPrefs(false);
      }
    };
    loadPreferences();
    return () => {
      isMounted = false;
    };
  }, [user, isSandboxMode]);

  // Handle Export Generation
  const handleGenerateExport = async () => {
    setIsExporting(true);
    setExportError(null);
    try {
      const headers = await getAuthHeaders(user, isSandboxMode);
      const res = await fetch('/api/compliance/export', { headers: { ...headers } });
      if (!res.ok) throw new Error(`HTTP ${res.status}: Failed to generate compliance export`);
      const data = await res.json();
      setExportData(data);
    } catch (err: any) {
      console.error('Export error:', err);
      setExportError(err.message || 'Failed to generate data archive. Please verify your connection.');
    } finally {
      setIsExporting(false);
    }
  };

  // Handle Download JSON File
  const handleDownloadJson = () => {
    if (!exportData) return;
    const jsonStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportData, null, 2));
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute('href', jsonStr);
    const dateStr = new Date().toISOString().slice(0, 10);
    dlAnchor.setAttribute('download', `sovranly_ip_gdpr_export_${dateStr}.json`);
    document.body.appendChild(dlAnchor);
    dlAnchor.click();
    dlAnchor.remove();
  };

  // Handle Copy Export JSON
  const handleCopyJson = () => {
    if (!exportData) return;
    navigator.clipboard.writeText(JSON.stringify(exportData, null, 2));
    setCopiedExport(true);
    setTimeout(() => setCopiedExport(false), 2500);
  };

  // Handle Preferences Save
  const handleSavePreferences = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingPrefs(true);
    setPrefSaveSuccess(false);
    try {
      const headers = await getAuthHeaders(user, isSandboxMode);
      const res = await fetch('/api/compliance/preferences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...headers },
        body: JSON.stringify(preferences),
      });
      if (!res.ok) throw new Error('Failed to save compliance preferences');
      setPrefSaveSuccess(true);
      setTimeout(() => setPrefSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Error saving compliance preferences:', err);
      alert('Could not update preferences. Please try again.');
    } finally {
      setSavingPrefs(false);
    }
  };

  // Handle Right to Erasure Execution
  const handleExecuteErasure = async (e: React.FormEvent) => {
    e.preventDefault();
    if (erasureInput !== 'CONFIRM_ERASURE_SOVRANLY') {
      alert('Please type CONFIRM_ERASURE_SOVRANLY in exact uppercase to verify your intent.');
      return;
    }
    if (!confirm('FINAL WARNING: This will permanently delete all off-chain profile data, preferences, and personal linkages from Sovranly IP. Continue?')) {
      return;
    }

    setIsProcessingErasure(true);
    setErasureError(null);
    try {
      const headers = await getAuthHeaders(user, isSandboxMode);
      const res = await fetch('/api/compliance/erasure', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...headers },
        body: JSON.stringify({
          confirmation: erasureInput,
          reason: erasureReason,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to process erasure request');
      setErasureReceipt(data);
      setErasureInput('');
    } catch (err: any) {
      console.error('Erasure error:', err);
      setErasureError(err.message || 'Erasure request failed.');
    } finally {
      setIsProcessingErasure(false);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-20">
      
      {/* Sovereign Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-850 pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-950/60 text-cyan-400 border border-cyan-500/30">
              LEGAL &amp; DATA SOVEREIGNTY
            </span>
            <span className="text-zinc-600 text-xs font-mono">• Zero Trust Architecture</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <Scale className="w-7 h-7 text-cyan-400" /> Compliance Center
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 font-light max-w-3xl leading-relaxed">
            Audit platform data retention status, exercise GDPR &amp; CCPA statutory rights, and export your complete creator ledger under sovereign non-custodial protection.
          </p>
        </div>

        {/* Global Compliance Badges */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="bg-zinc-950 border border-emerald-900/50 rounded-xl px-3 py-1.5 flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-[11px] font-mono font-bold text-emerald-300">GDPR Compliant</span>
          </div>
          <div className="bg-zinc-950 border border-cyan-900/50 rounded-xl px-3 py-1.5 flex items-center gap-2">
            <Lock className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-[11px] font-mono font-bold text-cyan-300">CCPA / CPRA Enforced</span>
          </div>
          <div className="bg-zinc-950 border border-violet-900/50 rounded-xl px-3 py-1.5 flex items-center gap-2">
            <Database className="w-3.5 h-3.5 text-violet-400" />
            <span className="text-[11px] font-mono font-bold text-violet-300">Zero Data Harvesting</span>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-zinc-900 pb-3">
        <button
          onClick={() => setActiveTab('retention')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
            activeTab === 'retention'
              ? 'bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 shadow-lg shadow-cyan-950/20'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-900/60'
          }`}
        >
          <Clock className="w-4 h-4" /> Data Retention Status
        </button>

        <button
          onClick={() => setActiveTab('export')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
            activeTab === 'export'
              ? 'bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 shadow-lg shadow-cyan-950/20'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-900/60'
          }`}
        >
          <Download className="w-4 h-4" /> GDPR / CCPA Data Export
        </button>

        <button
          onClick={() => setActiveTab('preferences')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
            activeTab === 'preferences'
              ? 'bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 shadow-lg shadow-cyan-950/20'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-900/60'
          }`}
        >
          <Sliders className="w-4 h-4" /> Processing &amp; Consent Matrix
        </button>

        <button
          onClick={() => setActiveTab('erasure')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
            activeTab === 'erasure'
              ? 'bg-red-950/60 border border-red-500/40 text-red-300 shadow-lg shadow-red-950/20'
              : 'text-zinc-400 hover:text-red-400 hover:bg-zinc-900/60'
          }`}
        >
          <Trash2 className="w-4 h-4" /> Right to Erasure (Art. 17)
        </button>

        <button
          onClick={() => setActiveTab('dpo')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
            activeTab === 'dpo'
              ? 'bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 shadow-lg shadow-cyan-950/20'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-900/60'
          }`}
        >
          <UserCheck className="w-4 h-4" /> DPO &amp; Legal Attestation
        </button>
      </div>

      {/* Tab 1: Data Retention Status & Lifecycle Visualizer */}
      {activeTab === 'retention' && (
        <div className="space-y-6">
          
          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-5 space-y-2">
              <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block">Data Sovereignty Score</span>
              <div className="text-2xl font-bold font-mono text-emerald-400 flex items-center gap-2">
                100% <span className="text-xs font-normal text-emerald-500">Autonomous</span>
              </div>
              <p className="text-[11px] text-zinc-400">Zero custody of private keys or unencrypted master stems.</p>
            </div>

            <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-5 space-y-2">
              <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block">Rolling Log Window</span>
              <div className="text-2xl font-bold font-mono text-cyan-400 flex items-center gap-2">
                30 Days <span className="text-xs font-normal text-cyan-500">Auto-Purge</span>
              </div>
              <p className="text-[11px] text-zinc-400">Ephemeral server access logs auto-expire every 720 hours.</p>
            </div>

            <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-5 space-y-2">
              <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block">Statutory Audit Escrow</span>
              <div className="text-2xl font-bold font-mono text-amber-400 flex items-center gap-2">
                7 Years <span className="text-xs font-normal text-amber-500">Tax Compliant</span>
              </div>
              <p className="text-[11px] text-zinc-400">Enforces IRS / EU DAC7 royalty record standards.</p>
            </div>

            <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-5 space-y-2">
              <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block">Third-Party Data Brokers</span>
              <div className="text-2xl font-bold font-mono text-violet-400 flex items-center gap-2">
                0 Sold <span className="text-xs font-normal text-violet-500">Strictly Zero</span>
              </div>
              <p className="text-[11px] text-zinc-400">Sovranly IP never sells, rents, or monetizes creator PII.</p>
            </div>
          </div>

          {/* Retention Schedule Table */}
          <div className="bg-zinc-950 border border-zinc-900 rounded-[28px] p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-900 pb-4">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Database className="w-5 h-5 text-cyan-400" /> Platform Data Retention Matrix
                </h3>
                <p className="text-xs text-zinc-400">Cryptographic audit of active data classifications, storage tiers, and purge schedules.</p>
              </div>
              <span className="text-[11px] font-mono px-3 py-1 rounded-full bg-cyan-950/60 text-cyan-300 border border-cyan-800/40">
                Policy Active: v2026.3
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-zinc-300 border-collapse">
                <thead>
                  <tr className="border-b border-zinc-850 font-mono text-zinc-500 text-[10px] uppercase tracking-wider">
                    <th className="py-3 px-4">Data Classification</th>
                    <th className="py-3 px-4">Storage Infrastructure</th>
                    <th className="py-3 px-4">Encryption Standard</th>
                    <th className="py-3 px-4">Retention Lifecycle</th>
                    <th className="py-3 px-4">Purge Mechanism</th>
                    <th className="py-3 px-4">Legal Basis</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-900/80">
                  {RETENTION_POLICIES.map((policy) => (
                    <tr key={policy.id} className="hover:bg-zinc-900/30 transition-colors">
                      <td className="py-4 px-4 font-semibold text-white">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-mono border ${policy.badgeColor}`}>
                            {policy.category}
                          </span>
                        </div>
                        <span className="text-[10px] text-zinc-500 block mt-1">{policy.purpose}</span>
                      </td>
                      <td className="py-4 px-4 font-mono text-zinc-400 text-[11px]">
                        {policy.storageLayer}
                      </td>
                      <td className="py-4 px-4">
                        <span className="inline-flex items-center gap-1 font-mono text-emerald-400 bg-emerald-950/30 px-2 py-0.5 rounded border border-emerald-800/30 text-[10px]">
                          <Lock className="w-3 h-3" /> {policy.encryption}
                        </span>
                      </td>
                      <td className="py-4 px-4 font-mono text-cyan-300 text-[11px]">
                        {policy.retentionPeriod}
                      </td>
                      <td className="py-4 px-4 text-zinc-400 text-[11px]">
                        {policy.purgeMethod}
                      </td>
                      <td className="py-4 px-4 font-mono text-[10px] text-zinc-500">
                        {policy.legalBasis}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Architecture Explanatory Notice */}
            <div className="p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800 text-xs text-zinc-400 space-y-2">
              <div className="flex items-center gap-2 text-cyan-400 font-mono font-bold text-xs uppercase">
                <Info className="w-4 h-4" /> Non-Custodial Architecture Transparency
              </div>
              <p className="leading-relaxed">
                Sovranly IP maintains zero secondary commercial databases. All creative IP metadata is notarized via client-side SHA-256 cryptographic proofs. In compliance with European Union GDPR (Regulation 2016/679) and California Consumer Privacy Act (CCPA/CPRA), creators retain unilateral control over off-chain identity records and metadata retention policies.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: GDPR / CCPA Data Export Engine */}
      {activeTab === 'export' && (
        <div className="space-y-6">
          <div className="bg-zinc-950 border border-zinc-900 rounded-[28px] p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-900 pb-4">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Download className="w-5 h-5 text-cyan-400" /> Right to Data Portability (GDPR Art. 20 / CCPA § 1798.130)
                </h3>
                <p className="text-xs text-zinc-400">
                  Generate and download an unencumbered, machine-readable JSON archive containing all personal data, creative assets, licensing compacts, and royalty settlements.
                </p>
              </div>

              <Button
                onClick={handleGenerateExport}
                disabled={isExporting}
                className="bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs font-mono px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-cyan-500/20 cursor-pointer"
              >
                {isExporting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin mr-2" /> Compiling Vault...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 mr-2" /> Generate Complete Archive
                  </>
                )}
              </Button>
            </div>

            {/* Export Error State */}
            {exportError && (
              <div className="p-4 rounded-xl bg-red-950/40 border border-red-500/30 text-red-300 text-xs flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 shrink-0 text-red-400" />
                <span>{exportError}</span>
              </div>
            )}

            {/* Initial State Banner */}
            {!exportData && !isExporting && !exportError && (
              <div className="border border-dashed border-zinc-800 rounded-2xl p-10 text-center space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mx-auto">
                  <Archive className="w-6 h-6" />
                </div>
                <div className="space-y-1 max-w-md mx-auto">
                  <h4 className="text-sm font-bold text-white">Portable Creator Archive Ready to Compile</h4>
                  <p className="text-xs text-zinc-400">
                    Click the button above to aggregate all your records across IP Assets, Smart Compacts, Royalty Escrows, and Transaction Logs.
                  </p>
                </div>
              </div>
            )}

            {/* Live Generated Archive State */}
            {exportData && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Export Summary Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3.5 bg-zinc-900/60 border border-zinc-800 rounded-xl font-mono">
                    <span className="text-[10px] text-zinc-500 uppercase block">Registered Works</span>
                    <span className="text-lg font-bold text-white">{exportData.registeredAssets?.length || 0} Assets</span>
                  </div>
                  <div className="p-3.5 bg-zinc-900/60 border border-zinc-800 rounded-xl font-mono">
                    <span className="text-[10px] text-zinc-500 uppercase block">Licensing Compacts</span>
                    <span className="text-lg font-bold text-cyan-400">{exportData.licensingCompacts?.length || 0} Compacts</span>
                  </div>
                  <div className="p-3.5 bg-zinc-900/60 border border-zinc-800 rounded-xl font-mono">
                    <span className="text-[10px] text-zinc-500 uppercase block">Royalty Settlements</span>
                    <span className="text-lg font-bold text-emerald-400">{exportData.royaltyDistributions?.length || 0} Payments</span>
                  </div>
                  <div className="p-3.5 bg-zinc-900/60 border border-zinc-800 rounded-xl font-mono">
                    <span className="text-[10px] text-zinc-500 uppercase block">Ledger Records</span>
                    <span className="text-lg font-bold text-amber-400">{exportData.auditLedgerTransactions?.length || 0} Txs</span>
                  </div>
                </div>

                {/* Cryptographic Proof Verification Box */}
                <div className="p-4 rounded-2xl bg-cyan-950/20 border border-cyan-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono text-xs">
                  <div className="space-y-1">
                    <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider block">
                      SHA-256 Tamper-Proof Cryptographic Seal
                    </span>
                    <span className="text-zinc-300 break-all select-all font-mono text-[11px]">
                      {exportData.exportMetadata?.cryptographicProofSha256 || '0x...'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={handleCopyJson}
                      variant="outline"
                      className="border-zinc-700 bg-zinc-900 hover:bg-zinc-800 text-xs font-mono text-zinc-200 cursor-pointer"
                    >
                      {copiedExport ? <Check className="w-3.5 h-3.5 text-emerald-400 mr-1.5" /> : <Copy className="w-3.5 h-3.5 mr-1.5" />}
                      {copiedExport ? 'Copied' : 'Copy JSON'}
                    </Button>
                    <Button
                      onClick={handleDownloadJson}
                      className="bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs font-mono cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5 mr-1.5" /> Download .JSON
                    </Button>
                  </div>
                </div>

                {/* Interactive JSON Viewer */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-zinc-400">
                    <span className="font-mono text-[11px] uppercase tracking-wider text-zinc-500">
                      Raw Portable Archive Preview (JSON Format)
                    </span>
                    <span className="text-[10px] text-zinc-500 font-mono">
                      Export ID: {exportData.exportMetadata?.exportId}
                    </span>
                  </div>
                  <pre className="p-4 rounded-2xl bg-black border border-zinc-850 text-emerald-400 font-mono text-[11px] max-h-96 overflow-y-auto custom-scrollbar select-all">
                    {JSON.stringify(exportData, null, 2)}
                  </pre>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      )}

      {/* Tab 3: Processing & Consent Matrix */}
      {activeTab === 'preferences' && (
        <div className="space-y-6">
          <form onSubmit={handleSavePreferences} className="bg-zinc-950 border border-zinc-900 rounded-[28px] p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-900 pb-4">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-cyan-400" /> Consent &amp; Processing Restriction Hub
                </h3>
                <p className="text-xs text-zinc-400">
                  Granularly configure how your data is processed, indexed, and synchronized across external DSP oracles and AI engines.
                </p>
              </div>

              <Button
                type="submit"
                disabled={savingPrefs}
                className="bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs font-mono px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-cyan-500/20 cursor-pointer"
              >
                {savingPrefs ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin mr-2" /> Saving Rules...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 mr-2" /> Save Privacy Rules
                  </>
                )}
              </Button>
            </div>

            {prefSaveSuccess && (
              <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Your compliance preferences have been cryptographically updated in your sovereign vault.</span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Rule 1: Do Not Sell / Share (Enforced) */}
              <div className="p-5 rounded-2xl bg-zinc-900/40 border border-emerald-900/50 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span className="text-sm font-bold text-white">Do Not Sell or Share Personal Data</span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800/40 font-bold">
                    ENFORCED
                  </span>
                </div>
                <p className="text-xs text-zinc-400">
                  Under CCPA § 1798.120 and GDPR, Sovranly IP is architected to never sell, rent, or trade your creative works or personal metadata to third-party data brokers.
                </p>
              </div>

              {/* Rule 2: AI Model Weights Training Consent */}
              <div className="p-5 rounded-2xl bg-zinc-900/40 border border-zinc-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-cyan-400" />
                    <span className="text-sm font-bold text-white">AI Training Vault Ingestion</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={preferences.aiTrainingOptIn}
                      onChange={(e) => setPreferences({ ...preferences, aiTrainingOptIn: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-cyan-500"></div>
                  </label>
                </div>
                <p className="text-xs text-zinc-400">
                  When toggled OFF (recommended default), your audio stems, artworks, and codebases are cryptographically shielded against unauthorized AI scraping and training.
                </p>
              </div>

              {/* Rule 3: DSP & Streaming Oracle Telemetry Sync */}
              <div className="p-5 rounded-2xl bg-zinc-900/40 border border-zinc-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Server className="w-4 h-4 text-amber-400" />
                    <span className="text-sm font-bold text-white">Streaming Oracle Telemetry Sync</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={preferences.oracleTelemetrySync}
                      onChange={(e) => setPreferences({ ...preferences, oracleTelemetrySync: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-cyan-500"></div>
                  </label>
                </div>
                <p className="text-xs text-zinc-400">
                  Enables verifiable telemetry consensus with Spotify/DSP oracles for calculating real-time micro-royalties without storing raw listener identities.
                </p>
              </div>

              {/* Rule 4: Ephemeral Log Retention Window */}
              <div className="p-5 rounded-2xl bg-zinc-900/40 border border-zinc-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-violet-400" />
                    <span className="text-sm font-bold text-white">Telemetry Retention Window</span>
                  </div>
                  <select
                    value={preferences.retentionWindowDays}
                    onChange={(e) => setPreferences({ ...preferences, retentionWindowDays: Number(e.target.value) })}
                    className="bg-black border border-zinc-700 text-xs font-mono text-cyan-300 rounded-lg px-2.5 py-1 focus:outline-none focus:border-cyan-500"
                  >
                    <option value={7}>7 Days (Aggressive Purge)</option>
                    <option value={30}>30 Days (Standard Window)</option>
                    <option value={90}>90 Days (Extended Audit)</option>
                  </select>
                </div>
                <p className="text-xs text-zinc-400">
                  Controls how long session telemetry and diagnostic traces are cached before being permanently purged from active memory buffers.
                </p>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Tab 4: Right to Erasure (Art. 17 GDPR) */}
      {activeTab === 'erasure' && (
        <div className="space-y-6">
          <div className="bg-zinc-950 border border-red-950/50 rounded-[28px] p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="border-b border-zinc-900 pb-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2 text-red-400">
                <Trash2 className="w-5 h-5 text-red-400" /> Right to Erasure / &quot;Right to be Forgotten&quot; (GDPR Art. 17 / CCPA § 1798.105)
              </h3>
              <p className="text-xs text-zinc-400">
                Permanently purge all off-chain personal identification data, profile mappings, preferences, and session tokens from the Sovranly IP ecosystem.
              </p>
            </div>

            {/* Educational Notice: Off-chain vs. On-Chain Ledger */}
            <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-3">
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" /> Technical &amp; Legal Blockchain Transparency Notice
              </h4>
              <p className="text-xs text-zinc-300 leading-relaxed">
                By cryptographic definition, distributed consensus blockchains (such as Base, Ethereum, and Arbitrum) are immutable and write-once ledgers. 
                When you execute your GDPR Right to Erasure on Sovranly IP:
              </p>
              <ul className="text-xs text-zinc-400 space-y-1.5 list-disc pl-5">
                <li><strong className="text-white">All off-chain personal data is permanently deleted:</strong> Email, names, avatar URLs, contact preferences, and server credentials are wiped.</li>
                <li><strong className="text-white">Identity linkage is irreversibly severed:</strong> Registered assets are unlinked from your creator profile and assigned to dead-address null routing (<code className="text-cyan-400 text-[11px]">0x000...dEaD</code>).</li>
                <li><strong className="text-white">A tamper-proof erasure receipt is minted:</strong> A cryptographic SHA-256 seal is generated confirming compliance with GDPR regulatory obligations.</li>
              </ul>
            </div>

            {erasureError && (
              <div className="p-4 rounded-xl bg-red-950/40 border border-red-500/30 text-red-300 text-xs flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 shrink-0 text-red-400" />
                <span>{erasureError}</span>
              </div>
            )}

            {erasureReceipt && (
              <div className="p-5 rounded-2xl bg-emerald-950/30 border border-emerald-500/40 space-y-3">
                <div className="flex items-center gap-2 text-emerald-400 font-mono font-bold text-xs uppercase">
                  <CheckCircle2 className="w-4 h-4" /> Erasure Executed Successfully
                </div>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  {erasureReceipt.message}
                </p>
                <div className="p-3 bg-black rounded-xl border border-zinc-800 font-mono text-[11px] text-zinc-400 space-y-1">
                  <div>Receipt ID: <span className="text-emerald-400">{erasureReceipt.receiptId}</span></div>
                  <div>Executed At: <span className="text-white">{erasureReceipt.executedAt}</span></div>
                  <div className="break-all">Cryptographic Seal: <span className="text-cyan-400">{erasureReceipt.cryptographicSeal}</span></div>
                </div>
              </div>
            )}

            {/* Erasure Execution Form */}
            {!erasureReceipt && (
              <form onSubmit={handleExecuteErasure} className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-xs font-mono text-zinc-300 uppercase">
                    Reason for Deletion / Feedback (Optional)
                  </Label>
                  <Input
                    value={erasureReason}
                    onChange={(e) => setErasureReason(e.target.value)}
                    placeholder="e.g. Closing independent creator label / migrating to self-hosted node"
                    className="bg-black border-zinc-800 text-xs text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-mono text-red-400 uppercase">
                    Type <code className="bg-red-950/80 px-1.5 py-0.5 rounded text-white font-bold">CONFIRM_ERASURE_SOVRANLY</code> to authorize
                  </Label>
                  <Input
                    value={erasureInput}
                    onChange={(e) => setErasureInput(e.target.value)}
                    placeholder="CONFIRM_ERASURE_SOVRANLY"
                    className="bg-black border-red-900/60 text-xs font-mono text-red-400 focus:border-red-500"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isProcessingErasure || erasureInput !== 'CONFIRM_ERASURE_SOVRANLY'}
                  className="w-full bg-red-600 hover:bg-red-500 disabled:opacity-40 text-white font-bold text-xs font-mono py-3 rounded-xl transition-all cursor-pointer shadow-lg shadow-red-600/20"
                >
                  {isProcessingErasure ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin mr-2" /> Executing Permanent Data Purge...
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4 mr-2" /> Authorize Permanent GDPR Erasure
                    </>
                  )}
                </Button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Tab 5: DPO & Legal Attestation */}
      {activeTab === 'dpo' && (
        <div className="space-y-6">
          <div className="bg-zinc-950 border border-zinc-900 rounded-[28px] p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="border-b border-zinc-900 pb-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-cyan-400" /> Data Protection Officer (DPO) &amp; Compliance Attestation
              </h3>
              <p className="text-xs text-zinc-400">
                Official regulatory point of contact for European Union and United States consumer privacy matters.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* DPO Contact Card */}
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 space-y-4 font-mono text-xs">
                <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider block">
                  Designated Data Protection Office
                </span>
                <div className="space-y-2 text-zinc-300">
                  <div><strong>Platform Entity:</strong> Sovranly IP Network Operations</div>
                  <div><strong>Legal Jurisdiction:</strong> United States &amp; International Copyright Treaties (Berne Convention)</div>
                  <div><strong>Regulatory Contact:</strong> <a href="mailto:create@sovranlyip.com" className="text-cyan-400 hover:underline">create@sovranlyip.com</a></div>
                  <div><strong>Supervisory Frameworks:</strong> GDPR EU 2016/679, CCPA/CPRA, WIPO IP Protocol</div>
                </div>

                <div className="pt-2">
                  <a
                    href="mailto:create@sovranlyip.com?subject=GDPR%20Data%20Subject%20Request%20-%20Sovranly%20IP"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 text-xs font-bold hover:bg-cyan-900/80 transition-all"
                  >
                    <Mail className="w-3.5 h-3.5" /> Submit Formal Regulatory Notice
                  </a>
                </div>
              </div>

              {/* Official Attestation Statement */}
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 space-y-3 text-xs text-zinc-400 leading-relaxed">
                <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-wider block">
                  Sovereign Architecture Attestation
                </span>
                <p>
                  Sovranly IP hereby certifies that its production infrastructure adheres strictly to privacy-by-design standards. 
                  Zero tracking pixels, third-party analytics telemetry brokers, or unauthorized AI training aggregators are permitted across the network.
                </p>
                <div className="p-3 bg-black rounded-xl border border-zinc-850 font-mono text-[10px] text-zinc-500">
                  Continuous Compliance Certificate ID: <span className="text-cyan-400">CERT-SOVRANLY-GDPR-CCPA-2026</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
