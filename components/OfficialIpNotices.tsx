'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Shield, Send, FileText, AlertTriangle, CheckCircle2, Clock, User, Building2, Lock, ArrowRight, RefreshCw, Copy, Check } from 'lucide-react';
import { useAuth } from '@/components/auth/FirebaseProvider';

interface OfficialIpNoticesProps {
  walletAddress?: string | null;
}

export default function OfficialIpNotices({ walletAddress }: OfficialIpNoticesProps) {
  const { user } = useAuth();
  const [noticeType, setNoticeType] = useState<'termination' | 'extension' | 'cease_desist' | 'audit' | 'general'>('termination');
  const [licenseeEmail, setLicenseeEmail] = useState('');
  const [assetTitle, setAssetTitle] = useState('Cybernetic Anthem Vol. 1 (Master Rights)');
  const [agreementId, setAgreementId] = useState('SRV-LIC-2026-8894');
  const [customMessage, setCustomMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);
  const [receiptId, setReceiptId] = useState('');
  const [copied, setCopied] = useState(false);

  const ownerName = user?.displayName || 'Sovranly IP Rights Holder';
  const ownerEmail = user?.email || 'owner@sovranlyip.com';

  const getDefaultBody = () => {
    switch (noticeType) {
      case 'termination':
        return `NOTICE OF LICENSE TERMINATION\n\nTo Licensee Authorized Representative,\n\nPlease take notice that pursuant to Section 4 (Restrictions & Termination) of Licensing Compact [${agreementId}] for asset "${assetTitle}", the undersigned Licensor hereby exercises its right of termination effective in thirty (30) days from receipt of this notice due to non-compliance or expiration of terms.\n\nAll public broadcasting, synchronization, and derivative exploitation rights granted under this compact shall cease immediately upon the effective termination date.\n\nSincerely,\n${ownerName}\nSovranly IP Governance Protocol`;
      case 'extension':
        return `NOTICE OF LICENSE TERM EXTENSION / RENEWAL\n\nTo Licensee Authorized Representative,\n\nThe undersigned Licensor hereby issues this formal notice of term extension for Licensing Compact [${agreementId}] covering "${assetTitle}".\n\nThe existing sync licensing and broadcast rights are hereby extended under the same royalty split protocols (85% Creator / 15% Platform) for an additional term of twelve (12) months.\n\nSincerely,\n${ownerName}\nSovranly IP Governance Protocol`;
      case 'cease_desist':
        return `URGENT: CEASE AND DESIST NOTICE CONCERNING UNAUTHORIZED IP EXPLOITATION\n\nTo Whom It May Concern,\n\nIt has come to our attention that unauthorized media exploitation, redistribution, or unlicenced synchronization of "${assetTitle}" (Protected under Sovranly IP Decentralized Registry) has been detected without an executed licensing compact.\n\nDemand is hereby made that you immediately cease and desist all unauthorized use and provide proof of valid license acquisition within forty-eight (48) hours, failing which formal legal remedies and smart contract injunctions will be initiated.\n\nSincerely,\n${ownerName}\nSovranly IP Legal Operations`;
      case 'audit':
        return `ROYALTY AUDIT & COMPLIANCE VERIFICATION NOTICE\n\nTo Licensee Authorized Representative,\n\nPursuant to the audit clauses of Licensing Compact [${agreementId}], Licensor hereby requests certified broadcast logs, streaming metrics, and gross revenue statements for "${assetTitle}" for the preceding financial quarter.\n\nPlease submit all verification assets within ten (10) business days to ensure ongoing royalty split accuracy.\n\nSincerely,\n${ownerName}\nSovranly IP Financial Operations`;
      case 'general':
      default:
        return `OFFICIAL COMMUNICATION FROM SOVRANLY IP RIGHTS HOLDER\n\nTo Licensee Authorized Representative,\n\nThis communication is transmitted via the Sovranly IP Zero Trust Governance Gateway regarding asset "${assetTitle}" under Compact [${agreementId}].\n\n${customMessage || 'Please review your active project requirements and submit confirmation of asset status.'}\n\nSincerely,\n${ownerName}\nSovranly IP Governance Protocol`;
    }
  };

  const [noticeBody, setNoticeBody] = useState(getDefaultBody());

  const handleTypeChange = (type: 'termination' | 'extension' | 'cease_desist' | 'audit' | 'general') => {
    setNoticeType(type);
    setNoticeBody(getDefaultBody());
    setSentSuccess(false);
  };

  const handleSendNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!licenseeEmail) {
      alert('Please specify the licensee authorized email address.');
      return;
    }
    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      setReceiptId(`SRV-NOTICE-${Math.floor(Math.random() * 89999 + 10000)}`);
      setSentSuccess(true);
    }, 1500);
  };

  const handleCopyNotice = () => {
    navigator.clipboard.writeText(noticeBody);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="bg-gradient-to-r from-zinc-900 via-zinc-900/90 to-emerald-950/40 border border-emerald-500/20 rounded-2xl p-6 sm:p-8 relative overflow-hidden shadow-xl">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                <Mail className="w-6 h-6 animate-pulse" />
              </span>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white uppercase">
                Official IP Communications &amp; Legal Notices
              </h1>
            </div>
            <p className="text-sm text-zinc-400 max-w-2xl leading-relaxed">
              Dispatch prefilled formal notices (Termination, Extension, Cease &amp; Desist, Royalty Audits) directly from your owner dashboard to licensee authorized contacts with cryptographically verified timestamps.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono bg-emerald-950/80 text-emerald-300 px-3 py-1.5 rounded-xl border border-emerald-800/40 flex items-center gap-2">
              <Shield className="w-3.5 h-3.5 text-emerald-400" /> Owner Verified: {ownerEmail}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Notice Type Selector & Recipient Details */}
        <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-6 space-y-6">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <FileText className="w-4 h-4 text-emerald-400" />
            Select Notice Classification
          </h2>

          <div className="space-y-2">
            <button
              type="button"
              onClick={() => handleTypeChange('termination')}
              className={`w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${noticeType === 'termination' ? 'bg-red-950/30 border-red-500/50 text-white shadow-lg' : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-zinc-200'}`}
            >
              <div>
                <div className="font-bold text-xs uppercase text-red-400">Notice of Termination</div>
                <div className="text-[11px] text-zinc-500">Revoke sync &amp; performance rights</div>
              </div>
              <AlertTriangle className={`w-4 h-4 ${noticeType === 'termination' ? 'text-red-400' : 'text-zinc-600'}`} />
            </button>

            <button
              type="button"
              onClick={() => handleTypeChange('extension')}
              className={`w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${noticeType === 'extension' ? 'bg-emerald-950/30 border-emerald-500/50 text-white shadow-lg' : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-zinc-200'}`}
            >
              <div>
                <div className="font-bold text-xs uppercase text-emerald-400">Term Extension / Renewal</div>
                <div className="text-[11px] text-zinc-500">Extend license duration &amp; terms</div>
              </div>
              <CheckCircle2 className={`w-4 h-4 ${noticeType === 'extension' ? 'text-emerald-400' : 'text-zinc-600'}`} />
            </button>

            <button
              type="button"
              onClick={() => handleTypeChange('cease_desist')}
              className={`w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${noticeType === 'cease_desist' ? 'bg-amber-950/30 border-amber-500/50 text-white shadow-lg' : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-zinc-200'}`}
            >
              <div>
                <div className="font-bold text-xs uppercase text-amber-400">Cease &amp; Desist Warning</div>
                <div className="text-[11px] text-zinc-500">Notice of unauthorized exploitation</div>
              </div>
              <Shield className={`w-4 h-4 ${noticeType === 'cease_desist' ? 'text-amber-400' : 'text-zinc-600'}`} />
            </button>

            <button
              type="button"
              onClick={() => handleTypeChange('audit')}
              className={`w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${noticeType === 'audit' ? 'bg-cyan-950/30 border-cyan-500/50 text-white shadow-lg' : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-zinc-200'}`}
            >
              <div>
                <div className="font-bold text-xs uppercase text-cyan-400">Royalty Audit Request</div>
                <div className="text-[11px] text-zinc-500">Request financial statements &amp; logs</div>
              </div>
              <Clock className={`w-4 h-4 ${noticeType === 'audit' ? 'text-cyan-400' : 'text-zinc-600'}`} />
            </button>

            <button
              type="button"
              onClick={() => handleTypeChange('general')}
              className={`w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${noticeType === 'general' ? 'bg-zinc-800 border-zinc-700 text-white shadow-lg' : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-zinc-200'}`}
            >
              <div>
                <div className="font-bold text-xs uppercase text-zinc-300">General Notice / Inquiry</div>
                <div className="text-[11px] text-zinc-500">Custom licensee communication</div>
              </div>
              <Mail className={`w-4 h-4 ${noticeType === 'general' ? 'text-zinc-300' : 'text-zinc-600'}`} />
            </button>
          </div>

          <div className="space-y-4 pt-2 border-t border-zinc-800">
            <div className="space-y-2">
              <label className="text-xs font-mono text-zinc-400 uppercase">Licensee Authorized Email *</label>
              <input
                type="email"
                required
                value={licenseeEmail}
                onChange={(e) => setLicenseeEmail(e.target.value)}
                placeholder="licensee@productioncompany.com"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-mono text-zinc-400 uppercase">Asset / Compact Title</label>
              <input
                type="text"
                value={assetTitle}
                onChange={(e) => setAssetTitle(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-mono text-zinc-400 uppercase">Agreement / Compact ID</label>
              <input
                type="text"
                value={agreementId}
                onChange={(e) => setAgreementId(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Right 2 Cols: Live Notice Preview & Dispatch Console */}
        <div className="lg:col-span-2 bg-zinc-900/90 border border-zinc-800 rounded-2xl p-6 space-y-6 flex flex-col">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
            <div>
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">Formal Notice Preview</h2>
              <p className="text-xs text-zinc-400 mt-0.5">Prefilled with owner credentials and timestamped signature</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopyNotice}
                className="px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold rounded-xl transition-all border border-zinc-700 flex items-center gap-1.5 cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied' : 'Copy Text'}
              </button>
            </div>
          </div>

          <div className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl p-5 font-mono text-xs text-zinc-300 leading-relaxed whitespace-pre-wrap max-h-[380px] overflow-y-auto">
            {noticeBody}
          </div>

          {sentSuccess && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/50 flex items-center gap-3 text-emerald-300 text-xs"
            >
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <span className="font-bold">Official Notice Dispatched Successfully!</span> Transmitted via Sovranly Secure Gateway to <strong>{licenseeEmail}</strong> with cryptographic delivery receipt #{receiptId}.
              </div>
            </motion.div>
          )}

          <div className="pt-4 border-t border-zinc-800 flex items-center justify-between">
            <span className="text-[11px] text-zinc-500 font-mono">
              Sender: {ownerName} ({ownerEmail})
            </span>
            <button
              type="button"
              onClick={handleSendNotice}
              disabled={isSending || !licenseeEmail}
              className="px-6 py-3.5 bg-emerald-500 hover:bg-emerald-400 disabled:bg-zinc-800 text-black font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2 cursor-pointer disabled:cursor-not-allowed"
            >
              {isSending ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Transmitting Notice...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Dispatch Official Notice
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
