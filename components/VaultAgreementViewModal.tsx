'use client';

import React, { useState } from 'react';
import { 
  Lock, 
  ShieldCheck, 
  Download, 
  Copy, 
  Check, 
  X, 
  Mail, 
  Calendar, 
  FileText, 
  Scale, 
  ExternalLink,
  Award,
  Clock,
  Shield
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface VaultRecord {
  id?: string;
  vaultId: string;
  agreementId: string;
  assetId?: string;
  assetTitle: string;
  assetType?: string;
  licensorEmail: string;
  licensorName?: string;
  creatorEmail: string;
  royaltyRate: number;
  basePrice: number;
  duration: string;
  permittedUsages: string[];
  territory?: string;
  exclusivity?: string;
  contractAddress: string;
  deployTxHash: string;
  ipfsHash?: string;
  covenantHash: string;
  notes?: string;
  exportedAt: string;
  vaultStatus?: string;
  deliveryStatus?: string;
  deliveryMethod?: string;
  backupHeldByApp?: boolean;
}

interface VaultAgreementViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  record: VaultRecord | null;
  onReExport?: (record: VaultRecord) => void;
}

export default function VaultAgreementViewModal({
  isOpen,
  onClose,
  record,
  onReExport,
}: VaultAgreementViewModalProps) {
  const [copiedHash, setCopiedHash] = useState(false);
  const [copiedId, setCopiedId] = useState(false);

  if (!isOpen || !record) return null;

  const handleCopy = (text: string, type: 'hash' | 'id') => {
    navigator.clipboard.writeText(text);
    if (type === 'hash') {
      setCopiedHash(true);
      setTimeout(() => setCopiedHash(false), 2000);
    } else {
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    }
  };

  const handleDownloadBackup = () => {
    const backupData = {
      archiveHeader: 'SOVRANLY IP — IMMUTABLE SOVEREIGN VAULT COVENANT BACKUP',
      vaultId: record.vaultId,
      covenantHash: record.covenantHash,
      exportDate: record.exportedAt,
      licensorParticipant: {
        email: record.licensorEmail,
        name: record.licensorName,
      },
      creatorOwner: {
        email: record.creatorEmail,
      },
      agreementTerms: {
        assetTitle: record.assetTitle,
        assetType: record.assetType,
        royaltyRate: `${record.royaltyRate}% Creator Share`,
        basePrice: `${record.basePrice} ETH`,
        duration: record.duration,
        permittedUsages: record.permittedUsages,
        territory: record.territory,
        exclusivity: record.exclusivity,
      },
      onChainProofs: {
        smartContractAddress: record.contractAddress,
        deployTxHash: record.deployTxHash,
        ipfsCid: record.ipfsHash,
      },
      vaultPreservationNotice: 'This record was archived into the Sovranly IP internal vault upon email export to ensure perpetual retrieval in case of inbox data loss.',
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backupData, null, 2));
    const a = document.createElement('a');
    a.setAttribute('href', dataStr);
    a.setAttribute('download', `sovranly_vault_backup_${record.vaultId}.json`);
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl bg-[#0e0e12] border border-zinc-800 rounded-3xl shadow-2xl p-6 sm:p-8 text-zinc-100 overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-emerald-500 to-cyan-500" />

        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-zinc-800/80 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-extrabold text-white">
                  Sovereign App Vault Backup
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-950/60 text-emerald-400 border border-emerald-500/30">
                  IMMUTABLE PRESERVATION
                </span>
              </div>
              <p className="text-xs text-zinc-400 font-mono mt-0.5">
                Reference ID: <strong className="text-amber-300">{record.vaultId}</strong>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-zinc-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="overflow-y-auto space-y-5 pr-1 flex-1 text-xs">
          
          {/* Status Bar */}
          <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span className="font-mono font-bold text-zinc-200">Preserved in Sovranly App Storage</span>
            </div>
            <div className="flex items-center gap-2 text-[11px] font-mono text-zinc-400">
              <Clock className="w-3.5 h-3.5" />
              Exported: {new Date(record.exportedAt).toLocaleString()}
            </div>
          </div>

          {/* Participant Delivery Information */}
          <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-2.5">
            <div className="text-[11px] font-bold font-mono text-cyan-400 uppercase tracking-wider flex items-center gap-2">
              <Mail className="w-3.5 h-3.5" /> Email Delivery Dispatch Record
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono">
              <div className="bg-zinc-900/70 p-2.5 rounded-xl border border-zinc-850">
                <span className="text-zinc-500 text-[10px] block uppercase">Participant / Licensor Email</span>
                <span className="text-white font-bold block truncate">{record.licensorEmail}</span>
                {record.licensorName && (
                  <span className="text-zinc-400 text-[10px] block mt-0.5">{record.licensorName}</span>
                )}
              </div>
              <div className="bg-zinc-900/70 p-2.5 rounded-xl border border-zinc-850">
                <span className="text-zinc-500 text-[10px] block uppercase">Creative Sender / Licensor</span>
                <span className="text-emerald-400 font-bold block truncate">{record.creatorEmail}</span>
                <span className="text-zinc-400 text-[10px] block mt-0.5">Dual Inbox Archival Enabled</span>
              </div>
            </div>

            {record.notes && (
              <div className="mt-2 p-2.5 rounded-xl bg-zinc-900/50 border border-zinc-850 text-zinc-300 italic">
                <span className="text-zinc-500 not-italic font-mono text-[10px] block uppercase">Cover Memo:</span>
                &ldquo;{record.notes}&rdquo;
              </div>
            )}
          </div>

          {/* Covenant Legal Terms */}
          <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-3">
            <div className="text-[11px] font-bold font-mono text-amber-400 uppercase tracking-wider flex items-center gap-2">
              <Scale className="w-3.5 h-3.5" /> Sealed Covenant Terms
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 font-mono text-[11px]">
              <div className="bg-zinc-900/80 p-2.5 rounded-xl border border-zinc-850 col-span-2 sm:col-span-3">
                <span className="text-zinc-500 text-[10px] block uppercase">Asset Title &amp; Category</span>
                <span className="text-white font-bold text-sm block">{record.assetTitle}</span>
                <span className="text-cyan-400 text-[10px] block">{record.assetType || 'IP Asset'}</span>
              </div>
              <div className="bg-zinc-900/80 p-2.5 rounded-xl border border-zinc-850">
                <span className="text-zinc-500 text-[10px] block uppercase">Royalty Split</span>
                <span className="text-emerald-400 font-bold block">{record.royaltyRate}% Creator</span>
              </div>
              <div className="bg-zinc-900/80 p-2.5 rounded-xl border border-zinc-850">
                <span className="text-zinc-500 text-[10px] block uppercase">Base Fee</span>
                <span className="text-white font-bold block">{record.basePrice} ETH</span>
              </div>
              <div className="bg-zinc-900/80 p-2.5 rounded-xl border border-zinc-850">
                <span className="text-zinc-500 text-[10px] block uppercase">Duration</span>
                <span className="text-zinc-200 font-bold block">{record.duration}</span>
              </div>
              <div className="bg-zinc-900/80 p-2.5 rounded-xl border border-zinc-850 col-span-2 sm:col-span-3">
                <span className="text-zinc-500 text-[10px] block uppercase">Permitted Usages</span>
                <span className="text-zinc-300 block">{record.permittedUsages.join(', ')}</span>
              </div>
              <div className="bg-zinc-900/80 p-2.5 rounded-xl border border-zinc-850">
                <span className="text-zinc-500 text-[10px] block uppercase">Territory</span>
                <span className="text-zinc-300 block">{record.territory || 'Worldwide'}</span>
              </div>
              <div className="bg-zinc-900/80 p-2.5 rounded-xl border border-zinc-850 col-span-2">
                <span className="text-zinc-500 text-[10px] block uppercase">Exclusivity</span>
                <span className="text-zinc-300 block">{record.exclusivity || 'Non-Exclusive'}</span>
              </div>
            </div>
          </div>

          {/* Cryptographic Proof Details */}
          <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-2.5">
            <div className="text-[11px] font-bold font-mono text-emerald-400 uppercase tracking-wider flex items-center justify-between">
              <span>Cryptographic Proof &amp; On-Chain References</span>
              <button
                onClick={() => handleCopy(record.covenantHash, 'hash')}
                className="text-[10px] font-mono text-zinc-400 hover:text-white flex items-center gap-1"
              >
                {copiedHash ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                {copiedHash ? 'Hash Copied' : 'Copy Hash'}
              </button>
            </div>

            <div className="space-y-1.5 font-mono text-[11px]">
              <div className="p-2 bg-zinc-900/80 rounded-lg border border-zinc-850">
                <span className="text-zinc-500 text-[10px] block">SHA-256 Covenant Hash:</span>
                <span className="text-emerald-400 break-all text-[10px]">{record.covenantHash}</span>
              </div>
              <div className="p-2 bg-zinc-900/80 rounded-lg border border-zinc-850">
                <span className="text-zinc-500 text-[10px] block">Smart Contract Address:</span>
                <span className="text-cyan-400 break-all text-[10px]">{record.contractAddress}</span>
              </div>
              <div className="p-2 bg-zinc-900/80 rounded-lg border border-zinc-850">
                <span className="text-zinc-500 text-[10px] block">Deployment Tx Hash:</span>
                <span className="text-zinc-300 break-all text-[10px]">{record.deployTxHash}</span>
              </div>
            </div>
          </div>

          {/* Guarantee banner */}
          <div className="p-3.5 rounded-xl bg-cyan-950/20 border border-cyan-500/30 text-cyan-200 text-[11px] flex items-start gap-2.5 leading-relaxed">
            <Shield className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <strong>Protected by Sovereign Vault Redundancy:</strong> This covenant is preserved independently of external email providers. Even if emails are deleted or accounts closed, this record serves as legitimate, timestamped proof of the agreement.
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-zinc-800/80 mt-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex gap-2">
            <Button
              onClick={handleDownloadBackup}
              variant="outline"
              className="bg-zinc-900 hover:bg-zinc-800 border-zinc-750 text-white font-mono text-xs h-9 flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5 text-amber-400" /> Download Vault JSON
            </Button>
            {onReExport && (
              <Button
                onClick={() => {
                  onClose();
                  onReExport(record);
                }}
                className="bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs h-9 flex items-center gap-1.5"
              >
                <Mail className="w-3.5 h-3.5" /> Re-Send to Email
              </Button>
            )}
          </div>

          <Button
            onClick={onClose}
            variant="ghost"
            className="text-zinc-400 hover:text-white text-xs h-9"
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
