'use client';

import React, { useState } from 'react';
import { useAuth } from '@/components/auth/FirebaseProvider';
import { Mail, CheckCircle, AlertTriangle, Loader2, Send, ShieldCheck, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface NotarizationEmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentTitle?: string;
  documentHash?: string;
  txHash?: string;
  defaultClientEmail?: string;
  defaultClientName?: string;
}

export default function NotarizationEmailModal({
  isOpen,
  onClose,
  documentTitle = 'Sovereign Notarized Document',
  documentHash = '0x8f3a...d91e',
  txHash = '0x1234...5678',
  defaultClientEmail = '',
  defaultClientName = '',
}: NotarizationEmailModalProps) {
  const { user, accessToken, signInWithGoogle } = useAuth();

  const [clientEmail, setClientEmail] = useState(defaultClientEmail || user?.email || '');
  const [clientName, setClientName] = useState(defaultClientName || user?.displayName || 'Client');
  const [title, setTitle] = useState(documentTitle);
  
  const [showConfirmStep, setShowConfirmStep] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [sendResult, setSendResult] = useState<{ success: boolean; message: string; messageId?: string } | null>(null);

  if (!isOpen) return null;

  const handleInitiateSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientEmail || !clientEmail.includes('@')) {
      alert('Please enter a valid client email address.');
      return;
    }
    // Present mandatory confirmation step before Gmail mutation
    setShowConfirmStep(true);
  };

  const handleConfirmSend = async () => {
    setIsSending(true);
    setSendResult(null);

    try {
      const res = await fetch('/app/api/notarization/notify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
        body: JSON.stringify({
          recipientEmail: clientEmail,
          clientName: clientName,
          documentTitle: title,
          documentHash,
          txHash,
          certificateId: 'CERT-' + Math.floor(100000 + Math.random() * 900000),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to send notification email');
      }

      setSendResult({
        success: true,
        message: data.mode === 'live_gmail_api'
          ? `Notification successfully sent via Gmail API to ${clientEmail}!`
          : `Simulated notification delivered to ${clientEmail} (Sandbox mode).`,
        messageId: data.messageId,
      });
      setShowConfirmStep(false);
    } catch (err: any) {
      console.error('Email send error:', err);
      setSendResult({
        success: false,
        message: err.message || 'An error occurred while sending the email.',
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-zinc-950 border border-zinc-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative space-y-6">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-zinc-400 hover:text-white p-2 rounded-full bg-zinc-900/80 hover:bg-zinc-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 border-b border-zinc-900 pb-4">
          <div className="p-3 bg-cyan-950/60 border border-cyan-800/50 rounded-2xl text-cyan-400">
            <Mail className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight">Send Notarization Email</h3>
            <p className="text-xs text-zinc-400">Automatic client notification via Gmail API</p>
          </div>
        </div>

        {/* Result Message Banner */}
        {sendResult && (
          <div className={`p-4 rounded-2xl border text-xs font-mono space-y-1 ${
            sendResult.success 
              ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300' 
              : 'bg-rose-950/40 border-rose-500/40 text-rose-300'
          }`}>
            <div className="flex items-center gap-2 font-bold uppercase">
              {sendResult.success ? <CheckCircle className="w-4 h-4 text-emerald-400" /> : <AlertTriangle className="w-4 h-4 text-rose-400" />}
              {sendResult.success ? 'Email Sent Successfully' : 'Delivery Failed'}
            </div>
            <p className="text-[11px] opacity-90 leading-relaxed">{sendResult.message}</p>
            {sendResult.messageId && (
              <span className="text-[10px] text-zinc-500 block">Gmail Message ID: {sendResult.messageId}</span>
            )}
          </div>
        )}

        {/* Google Auth Status Check */}
        {!accessToken && (
          <div className="bg-zinc-900/80 border border-cyan-900/40 rounded-2xl p-4 text-xs space-y-3">
            <div className="flex items-center gap-2 text-cyan-300 font-semibold">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <span>Connect Gmail Account</span>
            </div>
            <p className="text-zinc-400 text-[11px] leading-relaxed">
              To dispatch emails directly from your verified Gmail address, sign in with Google below.
            </p>
            <Button
              type="button"
              onClick={signInWithGoogle}
              className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs font-bold uppercase rounded-xl h-10 flex items-center justify-center gap-2"
            >
              Sign In with Google
            </Button>
          </div>
        )}

        {/* Form View or Confirmation View */}
        {!showConfirmStep ? (
          <form onSubmit={handleInitiateSend} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider block">
                Client Email Address
              </label>
              <Input
                type="email"
                required
                value={clientEmail}
                onChange={(e) => setClientEmail(e.target.value)}
                placeholder="client@example.com"
                className="bg-zinc-900 border-zinc-800 text-white rounded-xl text-xs h-11 focus:border-cyan-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider block">
                Client Full Name
              </label>
              <Input
                type="text"
                required
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="Jane Doe"
                className="bg-zinc-900 border-zinc-800 text-white rounded-xl text-xs h-11 focus:border-cyan-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider block">
                Document Title
              </label>
              <Input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-zinc-900 border-zinc-800 text-white rounded-xl text-xs h-11 focus:border-cyan-500"
              />
            </div>

            <div className="bg-zinc-900/50 border border-zinc-850 p-3 rounded-xl font-mono text-[10px] space-y-1 text-zinc-400">
              <div className="flex justify-between">
                <span>Doc Hash:</span>
                <span className="text-zinc-200 truncate max-w-[200px]">{documentHash}</span>
              </div>
              <div className="flex justify-between">
                <span>Tx Hash:</span>
                <span className="text-cyan-400 truncate max-w-[200px]">{txHash}</span>
              </div>
            </div>

            <div className="pt-2 flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1 bg-zinc-900 border-zinc-800 text-zinc-300 hover:text-white rounded-xl h-11 font-mono text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-gradient-to-r from-cyan-500 to-violet-600 hover:brightness-110 text-white font-mono text-xs font-bold uppercase rounded-xl h-11 flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" /> Prepare Email
              </Button>
            </div>
          </form>
        ) : (
          /* Mandatory User Confirmation Modal Step */
          <div className="space-y-5 bg-zinc-900/60 border border-cyan-800/40 p-5 rounded-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-3 text-cyan-300">
              <AlertTriangle className="w-5 h-5 text-cyan-400 shrink-0" />
              <h4 className="font-bold text-sm text-white">Confirm Email Dispatch</h4>
            </div>

            <div className="space-y-2 text-xs text-zinc-300 leading-relaxed font-sans">
              <p>
                Are you sure you want to send an automatic notarization certificate email to:
              </p>
              <div className="bg-black/60 border border-zinc-800 p-3 rounded-xl font-mono text-cyan-300 font-bold">
                {clientEmail} ({clientName})
              </div>
              <p className="text-[11px] text-zinc-400">
                This will trigger Gmail API to send an official Sovranly IP Certificate email containing the cryptographic proof and transaction signature for <strong>&quot;{title}&quot;</strong>.
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                disabled={isSending}
                onClick={() => setShowConfirmStep(false)}
                className="flex-1 bg-zinc-900 border-zinc-800 text-zinc-300 hover:text-white rounded-xl h-11 font-mono text-xs"
              >
                Back / Edit
              </Button>              <Button
                type="button"
                disabled={isSending}
                onClick={handleConfirmSend}
                className="flex-1 bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs font-bold uppercase rounded-xl h-11 flex items-center justify-center gap-2"
              >
                {isSending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" /> Confirm & Send via Gmail
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
