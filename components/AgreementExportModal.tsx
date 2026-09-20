'use client';

import React, { useState } from 'react';
import { useAuth } from '@/components/auth/FirebaseProvider';
import { getAuthHeaders } from '@/lib/auth-client';
import { 
  Mail, 
  CheckCircle2, 
  AlertTriangle, 
  Loader2, 
  Send, 
  ShieldCheck, 
  X, 
  Lock, 
  FileText, 
  Copy, 
  Check, 
  ArrowRight,
  Database,
  ExternalLink,
  Shield
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Agreement } from './LicensingAgreementBuilder';

interface AgreementExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  agreement: Agreement | null;
  onExportSuccess?: (vaultRecord: any) => void;
  onOpenVault?: () => void;
}

export default function AgreementExportModal({
  isOpen,
  onClose,
  agreement,
  onExportSuccess,
  onOpenVault,
}: AgreementExportModalProps) {
  const { user, accessToken, isSandboxMode } = useAuth();

  const [licensorEmail, setLicensorEmail] = useState('');
  const [licensorName, setLicensorName] = useState('');
  const [sendCreatorCopy, setSendCreatorCopy] = useState(true);
  const [notes, setNotes] = useState('');
  
  const [showConfirmStep, setShowConfirmStep] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [copiedVaultId, setCopiedVaultId] = useState(false);
  const [exportResult, setExportResult] = useState<{
    success: boolean;
    vaultId?: string;
    message: string;
    vaultRecord?: any;
  } | null>(null);

  if (!isOpen || !agreement) return null;

  const handleInitiateExport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!licensorEmail || !licensorEmail.includes('@')) {
      alert('Please provide a valid participant or licensor email address.');
      return;
    }
    setShowConfirmStep(true);
  };

  const handleConfirmExportAndVault = async () => {
    setIsExporting(true);
    setExportResult(null);

    try {
      const authHeaders = await getAuthHeaders(user, isSandboxMode);
      const res = await fetch('/api/agreements/export', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders,
        },
        body: JSON.stringify({
          agreementId: agreement.id || `agr-${Date.now()}`,
          assetId: agreement.assetId,
          assetTitle: agreement.assetTitle,
          licensorEmail: licensorEmail.trim(),
          licensorName: licensorName.trim() || 'Licensed Participant',
          creatorEmail: user?.email || agreement.creatorEmail || 'create@sovranlyip.com',
          creatorWallet: agreement.creatorWallet || user?.uid,
          sendCreatorCopy,
          royaltyRate: agreement.royaltyRate,
          basePrice: agreement.basePrice,
          duration: agreement.duration,
          permittedUsages: agreement.permittedUsages,
          territory: agreement.territory || 'Worldwide (WW)',
          exclusivity: agreement.exclusivity || 'Non-Exclusive',
          contractAddress: agreement.contractAddress,
          deployTxHash: agreement.deployTxHash,
          notes: notes.trim(),
          gmailAccessToken: accessToken,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to export agreement and seal into vault');
      }

      const result = {
        success: true,
        vaultId: data.vaultId || data.vaultRecord?.vaultId,
        message: data.message || `Covenant exported to ${licensorEmail} and permanently archived in Sovranly IP Vault.`,
        vaultRecord: data.vaultRecord,
      };

      setExportResult(result);
      setShowConfirmStep(false);
      if (onExportSuccess && data.vaultRecord) {
        onExportSuccess(data.vaultRecord);
      }
    } catch (err: any) {
      console.error('Agreement export error:', err);
      setExportResult({
        success: false,
        message: err.message || 'Error occurred while exporting agreement',
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleCopyVaultId = (idToCopy: string) => {
    navigator.clipboard.writeText(idToCopy);
    setCopiedVaultId(true);
    setTimeout(() => setCopiedVaultId(false), 2000);
  };

  const resetAndClose = () => {
    setShowConfirmStep(false);
    setExportResult(null);
    setLicensorEmail('');
    setLicensorName('');
    setNotes('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-xl bg-[#0e0e12] border border-zinc-800 rounded-3xl shadow-2xl p-6 sm:p-8 text-zinc-100 overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Accent Glow */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-amber-500 to-violet-600" />

        {/* Modal Header */}
        <div className="flex items-start justify-between pb-4 border-b border-zinc-800/80 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
                Export Agreement to Licensor Email
              </h3>
              <p className="text-xs text-zinc-400 font-mono flex items-center gap-1.5 mt-0.5">
                <Lock className="w-3 h-3 text-amber-400" />
                Dual-Layer Sovereign Vault Backup Enabled
              </p>
            </div>
          </div>
          <button
            onClick={resetAndClose}
            className="text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-zinc-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body Container with Scroll */}
        <div className="overflow-y-auto space-y-5 pr-1 flex-1">
          
          {/* Result Banner */}
          {exportResult && (
            <div className={`p-5 rounded-2xl border ${
              exportResult.success
                ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
                : 'bg-red-950/40 border-red-500/40 text-red-200'
            }`}>
              <div className="flex items-start gap-3">
                {exportResult.success ? (
                  <ShieldCheck className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-6 h-6 text-red-400 shrink-0 mt-0.5" />
                )}
                <div className="space-y-2 text-xs">
                  <div className="font-bold text-sm text-white">
                    {exportResult.success ? 'Export Dispatched & Vault Sealed' : 'Export Failed'}
                  </div>
                  <p className="leading-relaxed opacity-90">{exportResult.message}</p>
                  
                  {exportResult.vaultId && (
                    <div className="mt-3 p-3 bg-zinc-950/90 rounded-xl border border-emerald-500/30 flex items-center justify-between gap-3">
                      <div>
                        <span className="text-[10px] uppercase font-mono text-zinc-400 block">Sovereign Vault Archive Reference</span>
                        <span className="font-mono text-xs font-bold text-amber-300">{exportResult.vaultId}</span>
                      </div>
                      <button
                        onClick={() => handleCopyVaultId(exportResult.vaultId!)}
                        className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-[11px] font-mono flex items-center gap-1 transition"
                      >
                        {copiedVaultId ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        {copiedVaultId ? 'Copied' : 'Copy'}
                      </button>
                    </div>
                  )}

                  {exportResult.success && onOpenVault && (
                    <div className="pt-2 flex gap-2">
                      <Button
                        onClick={() => {
                          resetAndClose();
                          onOpenVault();
                        }}
                        className="bg-amber-600 hover:bg-amber-500 text-white font-mono text-xs font-bold h-8 flex items-center gap-1.5"
                      >
                        <Database className="w-3.5 h-3.5" /> Open App Vault
                      </Button>
                      <Button
                        onClick={resetAndClose}
                        variant="outline"
                        className="border-zinc-700 text-zinc-300 text-xs h-8"
                      >
                        Close
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Form / Confirmation Steps */}
          {!exportResult?.success && (
            <>
              {/* App Vault Guarantee Explainer */}
              <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/30 text-amber-200 text-xs space-y-1.5">
                <div className="flex items-center gap-2 font-bold text-amber-300">
                  <Shield className="w-4 h-4 text-amber-400" />
                  Sovranly IP Vault Protection Guarantee
                </div>
                <p className="text-[11px] text-amber-200/80 leading-relaxed">
                  When you export, Sovranly IP transmits the official covenant to the recipient&apos;s inbox and <strong>simultaneously archives an immutable backup inside the app&apos;s Sovereign Vault</strong>. If emails ever get lost, misfiled, or deleted, your original contract terms, cryptographic seal, and proof of dispatch remain permanently preserved in the app.
                </p>
              </div>

              {/* Covenant Summary Card */}
              <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-2.5">
                <div className="flex items-center justify-between text-xs pb-2 border-b border-zinc-850">
                  <span className="text-zinc-400 font-mono uppercase text-[10px]">Covenant Subject</span>
                  <span className="font-bold text-white text-xs">{agreement.assetTitle}</span>
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                  <div className="bg-zinc-900/80 p-2 rounded-lg border border-zinc-800">
                    <span className="text-zinc-500 text-[10px] block">Royalty Split</span>
                    <span className="text-emerald-400 font-bold">{agreement.royaltyRate}% Creator Share</span>
                  </div>
                  <div className="bg-zinc-900/80 p-2 rounded-lg border border-zinc-800">
                    <span className="text-zinc-500 text-[10px] block">Base Fee & Term</span>
                    <span className="text-cyan-400 font-bold">{agreement.basePrice} ETH • {agreement.duration}</span>
                  </div>
                  <div className="bg-zinc-900/80 p-2 rounded-lg border border-zinc-800 col-span-2">
                    <span className="text-zinc-500 text-[10px] block">Permitted Usages</span>
                    <span className="text-zinc-300 truncate block">{agreement.permittedUsages.join(', ')}</span>
                  </div>
                </div>
              </div>

              {!showConfirmStep ? (
                /* STEP 1: Enter Recipient Details */
                <form onSubmit={handleInitiateExport} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="licensor-email" className="text-xs font-mono text-zinc-300 font-bold flex items-center justify-between">
                      <span>Participant / Licensor Email *</span>
                      <span className="text-[10px] text-zinc-500 font-normal">Direct Inbox Recipient</span>
                    </Label>
                    <Input
                      id="licensor-email"
                      type="email"
                      required
                      placeholder="e.g. licensing@participant.com"
                      value={licensorEmail}
                      onChange={(e) => setLicensorEmail(e.target.value)}
                      className="bg-zinc-900 border-zinc-700 text-white placeholder:text-zinc-600 focus:border-amber-500 font-mono text-xs h-10"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="licensor-name" className="text-xs font-mono text-zinc-300 font-bold flex items-center justify-between">
                      <span>Participant Name or Organization</span>
                      <span className="text-[10px] text-zinc-500 font-normal">Optional</span>
                    </Label>
                    <Input
                      id="licensor-name"
                      type="text"
                      placeholder="e.g. Warner Chappell / Universal Sync Desk"
                      value={licensorName}
                      onChange={(e) => setLicensorName(e.target.value)}
                      className="bg-zinc-900 border-zinc-700 text-white placeholder:text-zinc-600 focus:border-amber-500 text-xs h-10"
                    />
                  </div>

                  {/* Dual In-Box CC Checkbox */}
                  <div className="p-3 bg-zinc-900/60 rounded-xl border border-zinc-800 flex items-start gap-3">
                    <input
                      id="send-creator-copy"
                      type="checkbox"
                      checked={sendCreatorCopy}
                      onChange={(e) => setSendCreatorCopy(e.target.checked)}
                      className="mt-0.5 rounded bg-zinc-800 border-zinc-700 text-amber-500 focus:ring-amber-500 h-4 w-4"
                    />
                    <label htmlFor="send-creator-copy" className="text-xs text-zinc-300 cursor-pointer select-none">
                      <strong className="text-white block font-medium">Send Dual Archive Copy to Creative Inbox</strong>
                      <span className="text-[11px] text-zinc-400 block mt-0.5">
                        Dispatches a matching copy to <code>{user?.email || 'create@sovranlyip.com'}</code> for instant email record-keeping.
                      </span>
                    </label>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="notes" className="text-xs font-mono text-zinc-300 font-bold flex items-center justify-between">
                      <span>Cover Note / Transaction Memo</span>
                      <span className="text-[10px] text-zinc-500 font-normal">Appears in official dispatch</span>
                    </Label>
                    <textarea
                      id="notes"
                      rows={2}
                      placeholder="e.g. Enclosed is the executed sovereign covenant for broadcast synchronization."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-xl p-2.5 text-white placeholder:text-zinc-600 focus:border-amber-500 text-xs focus:outline-none resize-none"
                    />
                  </div>

                  <div className="pt-2 flex gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={resetAndClose}
                      className="flex-1 bg-zinc-900 border-zinc-800 text-zinc-300 hover:text-white text-xs h-11"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1 bg-gradient-to-r from-amber-600 via-amber-500 to-cyan-600 hover:brightness-110 text-white font-bold font-mono text-xs h-11 flex items-center justify-center gap-2 shadow-lg shadow-amber-950/40"
                    >
                      <Send className="w-4 h-4" /> Review &amp; Export
                    </Button>
                  </div>
                </form>
              ) : (
                /* STEP 2: Explicit Confirmation Before Vault Seal & Dispatch */
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-zinc-950 border border-amber-500/40 space-y-3">
                    <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
                      <AlertTriangle className="w-4 h-4" /> Confirm Covenant Export &amp; Vault Archival
                    </div>
                    
                    <div className="space-y-2 text-xs text-zinc-300 font-mono">
                      <div className="flex justify-between border-b border-zinc-900 pb-1.5">
                        <span className="text-zinc-500">Recipient Licensor:</span>
                        <span className="text-white font-bold">{licensorEmail}</span>
                      </div>
                      <div className="flex justify-between border-b border-zinc-900 pb-1.5">
                        <span className="text-zinc-500">Participant Name:</span>
                        <span className="text-white">{licensorName || 'Licensed Participant'}</span>
                      </div>
                      <div className="flex justify-between border-b border-zinc-900 pb-1.5">
                        <span className="text-zinc-500">Dual Creative Copy:</span>
                        <span className={sendCreatorCopy ? 'text-emerald-400' : 'text-zinc-500'}>
                          {sendCreatorCopy ? user?.email || 'create@sovranlyip.com' : 'Disabled'}
                        </span>
                      </div>
                      <div className="flex justify-between border-b border-zinc-900 pb-1.5">
                        <span className="text-zinc-500">App Backup Status:</span>
                        <span className="text-emerald-400 font-bold">Will Seal in Sovereign Vault</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 flex gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      disabled={isExporting}
                      onClick={() => setShowConfirmStep(false)}
                      className="flex-1 bg-zinc-900 border-zinc-800 text-zinc-300 text-xs h-11"
                    >
                      Back
                    </Button>
                    <Button
                      type="button"
                      disabled={isExporting}
                      onClick={handleConfirmExportAndVault}
                      className="flex-1 bg-gradient-to-r from-emerald-600 to-cyan-600 hover:brightness-110 text-white font-bold font-mono text-xs h-11 flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/40"
                    >
                      {isExporting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" /> Archiving &amp; Transmitting...
                        </>
                      ) : (
                        <>
                          <Lock className="w-4 h-4" /> Send &amp; Seal in Vault
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}

        </div>
      </div>
    </div>
  );
}
