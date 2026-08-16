'use client';

import React, { useState, useEffect } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Mail, 
  Send, 
  ShieldCheck, 
  Database, 
  Terminal, 
  AlertCircle, 
  CheckCircle2, 
  Trash2,
  Lock
} from 'lucide-react';

interface Subscriber {
  email: string;
  timestamp: string;
  hash: string;
}

export default function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [showVault, setShowVault] = useState(false);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('sovranly_newsletter_subscribers');
      if (stored) {
        try {
          setSubscribers(JSON.parse(stored));
        } catch (e) {
          console.error("Failed to parse local subscribers", e);
        }
      }
    }
  }, []);

  const validateEmail = (value: string): boolean => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!value) {
      setError('Please enter an email address.');
      return false;
    }
    if (!regex.test(value)) {
      setError('Please enter a valid email address.');
      return false;
    }
    setError('');
    return true;
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmail(email)) return;

    setLoading(true);
    setTerminalLogs([]);

    // Cyberpunk simulation logs
    const logSteps = [
      '[TUNNEL] Opening secure ingestion gateway...',
      '[ENCRYPT] Hashing handle signature using SHA-256...',
      '[VALIDATE] Confirming Zero Trust subscriber integrity...',
      '[REGISTRY] Appending record identifier to local database pool...',
      '[COMPLETE] Connection sealed. Broadcast console activated.'
    ];

    for (let i = 0; i < logSteps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 400));
      setTerminalLogs(prev => [...prev, logSteps[i]]);
    }

    // Save lead
    const timestamp = new Date().toLocaleString();
    const hash = '0x' + Array.from({length: 16}, () => Math.floor(Math.random()*16).toString(16)).join('');
    const newSubscriber: Subscriber = { email, timestamp, hash };
    const updated = [newSubscriber, ...subscribers];
    
    setSubscribers(updated);
    localStorage.setItem('sovranly_newsletter_subscribers', JSON.stringify(updated));
    
    setLoading(false);
    setSubmitted(true);
    setEmail('');
  };

  const clearLeads = () => {
    setSubscribers([]);
    localStorage.removeItem('sovranly_newsletter_subscribers');
  };

  return (
    <div className="w-full max-w-xl mx-auto bg-[#09090b]/90 border border-zinc-900 rounded-2xl p-6 md:p-8 space-y-6 relative overflow-hidden group hover:border-cyan-500/20 transition-all duration-500 shadow-xl shadow-black/40">
      {/* Background neon glow */}
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none group-hover:bg-cyan-500/10 transition-all duration-700" />
      <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-violet-500/5 rounded-full blur-3xl pointer-events-none group-hover:bg-violet-500/10 transition-all duration-700" />

      {/* Header Info */}
      <div className="space-y-2 text-center md:text-left relative z-10">
        <div className="flex items-center justify-center md:justify-start gap-2">
          <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <h3 className="text-xs font-mono font-black text-cyan-400 uppercase tracking-widest">
            Sovereign Dispatch
          </h3>
        </div>
        <p className="text-xs text-zinc-400 font-sans leading-relaxed">
          Subscribe to continuous cryptographic intelligence and platform updates on creator IP rights.
        </p>
      </div>

      {isMounted ? (
        <AnimatePresence mode="wait">
          {!submitted && !loading ? (
            <motion.form 
              key="signup-form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onSubmit={handleSubscribe} 
              className="space-y-3 relative z-10"
            >
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-grow">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (error) setError('');
                    }}
                    placeholder="Enter your cryptographically secured email"
                    className={`bg-zinc-950/80 border-zinc-900 pl-10 pr-4 py-5 text-xs text-white rounded-xl placeholder:text-zinc-600 focus-visible:ring-cyan-500 focus-visible:border-cyan-500/50 transition-all ${
                      error ? 'border-red-500/50 focus-visible:ring-red-500' : ''
                    }`}
                  />
                </div>
                <Button 
                  type="submit" 
                  className="bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-mono font-bold uppercase rounded-xl px-5 py-5 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-cyan-950/25 shrink-0"
                >
                  <Send className="w-3.5 h-3.5" />
                  Secure Subscription
                </Button>
              </div>

              {error && (
                <motion.p 
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-[10px] font-mono text-red-400 flex items-center gap-1.5"
                >
                  <AlertCircle className="w-3 h-3" />
                  {error}
                </motion.p>
              )}
            </motion.form>
          ) : loading ? (
            <motion.div 
              key="securing-loader"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bg-zinc-950/90 border border-zinc-900 rounded-xl p-4 font-mono text-[9px] text-zinc-400 space-y-1.5 relative z-10"
            >
              <div className="flex items-center justify-between border-b border-zinc-900 pb-1.5 mb-2">
                <span className="text-cyan-400 font-bold flex items-center gap-1">
                  <Terminal className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                  INGESTION PIPELINE SECURING
                </span>
                <span className="animate-ping w-1.5 h-1.5 rounded-full bg-cyan-400" />
              </div>
              <div className="space-y-1 min-h-[75px] max-h-[100px] overflow-y-auto">
                {terminalLogs.map((log, idx) => (
                  <div key={idx} className="flex items-start gap-1">
                    <span className="text-cyan-600 font-bold">&gt;</span>
                    <span>{log}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="success-card"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-zinc-950/80 border border-emerald-500/20 p-5 rounded-xl text-center space-y-3 relative z-10 shadow-lg shadow-emerald-950/5"
            >
              <div className="w-10 h-10 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                  Identity Registered on Feed
                </h4>
                <p className="text-[11px] text-zinc-400 leading-normal max-w-sm mx-auto">
                  Your cryptographic email has been securely registered to receive automated platform dispatches.
                </p>
              </div>
              <button
                onClick={() => setSubmitted(false)}
                className="text-[9px] font-mono text-zinc-500 hover:text-cyan-400 underline transition-all bg-transparent border-0 cursor-pointer"
              >
                [Register Another Email]
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      ) : (
        <div className="h-[74px] flex items-center justify-center text-xs font-mono text-zinc-600">Loading pipeline security layer...</div>
      )}

      {/* Captured Leads Vault */}
      <div className="border-t border-zinc-900 pt-4 mt-2">
        <button
          onClick={() => setShowVault(!showVault)}
          className="w-full flex items-center justify-between text-zinc-500 hover:text-zinc-300 text-[10px] font-mono transition-all uppercase tracking-widest bg-zinc-950 border border-zinc-900 px-3.5 py-2 rounded-xl hover:border-zinc-800 cursor-pointer"
        >
          <span className="flex items-center gap-1.5 font-bold">
            <Database className="w-3.5 h-3.5 text-cyan-400" />
            Local Lead Registry ({isMounted ? subscribers.length : 0})
          </span>
          <span className="text-[9px] font-black">{showVault ? '[CLOSE]' : '[INSPECT]'}</span>
        </button>

        <AnimatePresence>
          {showVault && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mt-3"
            >
              <div className="bg-zinc-950/50 border border-zinc-900 rounded-xl p-4 space-y-3 font-mono text-[10px]">
                <div className="flex items-center justify-between border-b border-zinc-900 pb-2">
                  <span className="text-zinc-400 font-bold flex items-center gap-1">
                    <Lock className="w-3 h-3 text-cyan-400" />
                    CAPTURED LEADS IN STORAGE
                  </span>
                  {subscribers.length > 0 && (
                    <button
                      onClick={clearLeads}
                      className="text-red-400 hover:text-red-300 flex items-center gap-1 bg-transparent border-0 cursor-pointer"
                      title="Clear Vault"
                    >
                      <Trash2 className="w-3 h-3" />
                      Clear
                    </button>
                  )}
                </div>

                {subscribers.length === 0 ? (
                  <div className="text-center py-4 text-zinc-600 italic">
                    No leads recorded yet. Submit an email above to watch it captured live.
                  </div>
                ) : (
                  <div className="space-y-2 max-h-[150px] overflow-y-auto pr-1">
                    {subscribers.map((sub, idx) => (
                      <div key={idx} className="bg-[#09090b] border border-zinc-900 p-2.5 rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-1.5 hover:border-zinc-800 transition-all">
                        <div className="space-y-0.5">
                          <div className="text-zinc-200 font-bold text-xs truncate max-w-[200px]">{sub.email}</div>
                          <div className="text-zinc-500 text-[8px]">{sub.timestamp}</div>
                        </div>
                        <div className="text-right">
                          <span className="bg-zinc-900 text-cyan-400 text-[8px] font-bold px-2 py-0.5 rounded border border-zinc-850">
                            {sub.hash}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
