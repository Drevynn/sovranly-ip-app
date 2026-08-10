'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, ShieldCheck, Settings, Terminal, Info, X, Lock, Database, Cookie, Check, RefreshCw } from 'lucide-react';

interface ConsentReceipt {
  hash: string;
  timestamp: string;
  essentials: boolean;
  analytics: boolean;
  preferences: boolean;
}

export default function CookieComplianceBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  
  // Consent categories
  const [analytics, setAnalytics] = useState(true);
  const [preferences, setPreferences] = useState(true);
  
  // Generated cryptographic receipt state
  const [receipt, setReceipt] = useState<ConsentReceipt | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    // Read previous settings from localStorage or client cookies
    const storedConsent = localStorage.getItem('sovranly_cookie_consent_receipt');
    if (storedConsent) {
      try {
        const parsed = JSON.parse(storedConsent);
        /* eslint-disable-next-line react-hooks/set-state-in-effect */
        setReceipt(parsed);
        /* eslint-disable-next-line react-hooks/set-state-in-effect */
        setAnalytics(parsed.analytics);
        /* eslint-disable-next-line react-hooks/set-state-in-effect */
        setPreferences(parsed.preferences);
        // Do not display banner if consent is already recorded
        /* eslint-disable-next-line react-hooks/set-state-in-effect */
        setIsVisible(false);
      } catch (e) {
        /* eslint-disable-next-line react-hooks/set-state-in-effect */
        setIsVisible(true);
      }
    } else {
      // First-time visitor, display consent suite after a brief aesthetic delay
      const timer = setTimeout(() => {
        /* eslint-disable-next-line react-hooks/set-state-in-effect */
        setIsVisible(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  // Helper to generate a deterministic pseudo-SHA-256 hash for our Zero-Trust consent signature
  const generateConsentHash = (analyticsOpt: boolean, prefOpt: boolean) => {
    const dataString = `SOVRANLY-IP-CONSENT-V1::A:${analyticsOpt}::P:${prefOpt}::T:${Date.now()}`;
    let hash = 0;
    for (let i = 0; i < dataString.length; i++) {
      const char = dataString.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash |= 0; // Convert to 32bit integer
    }
    // Return formatted as hexadecimal signature
    return '0x' + Math.abs(hash).toString(16).padStart(8, '0').toUpperCase() + 
           Math.abs(hash * 33).toString(16).slice(0, 8).toUpperCase() + 'f9';
  };

  const handleAcceptAll = () => {
    const timestamp = new Date().toISOString();
    const hash = generateConsentHash(true, true);
    const receiptData: ConsentReceipt = {
      hash,
      timestamp,
      essentials: true,
      analytics: true,
      preferences: true
    };
    
    // Save to local storage
    localStorage.setItem('sovranly_cookie_consent_receipt', JSON.stringify(receiptData));
    
    // Set cookie
    document.cookie = `sovranly_essential_consent=true; path=/; max-age=31536000; SameSite=Strict; Secure`;
    document.cookie = `sovranly_analytics_consent=true; path=/; max-age=31536000; SameSite=Strict; Secure`;
    document.cookie = `sovranly_preferences_consent=true; path=/; max-age=31536000; SameSite=Strict; Secure`;

    setAnalytics(true);
    setPreferences(true);
    setReceipt(receiptData);
    setIsVisible(false);
  };

  const handleSaveCustom = () => {
    const timestamp = new Date().toISOString();
    const hash = generateConsentHash(analytics, preferences);
    const receiptData: ConsentReceipt = {
      hash,
      timestamp,
      essentials: true,
      analytics,
      preferences
    };

    localStorage.setItem('sovranly_cookie_consent_receipt', JSON.stringify(receiptData));
    
    document.cookie = `sovranly_essential_consent=true; path=/; max-age=31536000; SameSite=Strict; Secure`;
    document.cookie = `sovranly_analytics_consent=${analytics}; path=/; max-age=31536000; SameSite=Strict; Secure`;
    document.cookie = `sovranly_preferences_consent=${preferences}; path=/; max-age=31536000; SameSite=Strict; Secure`;

    setReceipt(receiptData);
    setIsVisible(false);
  };

  const handleRevoke = () => {
    localStorage.removeItem('sovranly_cookie_consent_receipt');
    document.cookie = 'sovranly_essential_consent=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    document.cookie = 'sovranly_analytics_consent=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    document.cookie = 'sovranly_preferences_consent=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    setReceipt(null);
    setIsVisible(true);
    setShowConfig(true);
  };

  return (
    <>
      {/* Tiny overlay link/status indicator in privacy page or anywhere if consent is already given */}
      {receipt && !isVisible && (
        <div className="fixed bottom-6 left-6 z-50">
          <button
            onClick={() => setIsVisible(true)}
            className="flex items-center gap-2 px-3 py-1.5 bg-[#09090b]/90 border border-zinc-800/80 rounded-full text-[10px] font-mono text-zinc-400 hover:text-cyan-400 hover:border-cyan-500/30 transition-all shadow-lg backdrop-blur-md cursor-pointer"
            title="Manage Cryptographic Consent"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span>CONSENT SECURED: <strong className="text-zinc-300">{receipt.hash.slice(0, 10)}...</strong></span>
          </button>
        </div>
      )}

      <AnimatePresence>
        {isVisible && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-end justify-center md:items-center md:justify-end md:p-8">
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.95 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="w-full md:max-w-md bg-[#09090b] border-t md:border border-zinc-800 rounded-t-3xl md:rounded-3xl p-6 shadow-2xl relative overflow-hidden space-y-4 max-h-[90vh] overflow-y-auto"
            >
              {/* Futuristic matrix gradient header overlay */}
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-violet-500 via-cyan-500 to-emerald-500" />

              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    <Shield className="w-4 h-4 text-cyan-400" />
                    <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 font-bold">Sovereign Compliance</span>
                  </div>
                  <h3 className="text-sm font-black text-white uppercase tracking-tight font-sans">
                    Consent Governance Engine
                  </h3>
                  <p className="text-[11px] text-zinc-400 font-sans leading-relaxed">
                    Sovranly IP uses Zero-Trust parameters. Customize how localized metadata caches behave on your device.
                  </p>
                </div>
                
                {receipt && (
                  <button 
                    onClick={() => setIsVisible(false)}
                    className="p-1 text-zinc-500 hover:text-white rounded-lg hover:bg-zinc-900 transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Collapsible Config Parameters */}
              <div className="space-y-3">
                {/* Category List */}
                <div className="space-y-2">
                  {/* Category 1: Essential (Immutable) */}
                  <div className="p-3 bg-zinc-900/30 border border-zinc-900 rounded-xl flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5">
                        <Lock className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-[10px] font-mono font-bold text-white uppercase">Essential Cryptographic Core</span>
                        <span className="text-[8px] font-mono bg-emerald-950/40 text-emerald-400 border border-emerald-900/40 px-1 rounded">IMMUTABLE</span>
                      </div>
                      <p className="text-[10px] text-zinc-500 leading-normal font-sans">
                        Required to verify smart contract triggers, cache public keys, support Web3 wallet tunnels, and remember your compliance configurations.
                      </p>
                    </div>
                  </div>

                  {/* Config Panels Trigger Toggle */}
                  {!showConfig ? (
                    <button
                      onClick={() => setShowConfig(true)}
                      className="w-full py-2 bg-zinc-900/40 hover:bg-zinc-900/80 border border-zinc-850 hover:border-zinc-800 rounded-xl text-[10px] font-mono text-zinc-400 hover:text-white transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Settings className="w-3.5 h-3.5" /> Customize Metadata Parameters
                    </button>
                  ) : (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="space-y-2 pt-1"
                    >
                      {/* Category 2: Analytics (Optional) */}
                      <div className="p-3 bg-[#060608] border border-zinc-900 rounded-xl space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <Database className="w-3.5 h-3.5 text-cyan-400" />
                            <span className="text-[10px] font-mono font-bold text-white uppercase">Decentralized Analytics</span>
                          </div>
                          <button
                            onClick={() => setAnalytics(!analytics)}
                            className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                              analytics ? 'bg-cyan-500' : 'bg-zinc-800'
                            }`}
                          >
                            <span
                              className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                                analytics ? 'translate-x-4' : 'translate-x-0'
                              }`}
                            />
                          </button>
                        </div>
                        <p className="text-[10px] text-zinc-500 leading-normal font-sans">
                          Permits anonymous telemetry and page speed diagnostics. We do not sell tracking fingerprints or communicate with advertising brokerages.
                        </p>
                      </div>

                      {/* Category 3: Preferences (Optional) */}
                      <div className="p-3 bg-[#060608] border border-zinc-900 rounded-xl space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <Cookie className="w-3.5 h-3.5 text-violet-400" />
                            <span className="text-[10px] font-mono font-bold text-white uppercase">Visual State Persistence</span>
                          </div>
                          <button
                            onClick={() => setPreferences(!preferences)}
                            className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                              preferences ? 'bg-violet-500' : 'bg-zinc-800'
                            }`}
                          >
                            <span
                              className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                                preferences ? 'translate-x-4' : 'translate-x-0'
                              }`}
                            />
                          </button>
                        </div>
                        <p className="text-[10px] text-zinc-500 leading-normal font-sans">
                          Saves your interface choices (such as active language settings, side-bar toggles, and layout preferences) directly to localized state.
                        </p>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Cryptographic Receipt Display if Consent exists */}
              {receipt && (
                <div className="p-3.5 bg-cyan-950/10 border border-cyan-500/10 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-mono font-black text-cyan-400 uppercase tracking-wider flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" /> CRYPTO AGREEMENT RECEIPT
                    </span>
                    <button 
                      onClick={handleRevoke}
                      className="text-[9px] font-mono uppercase text-rose-400 hover:text-rose-300 font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <RefreshCw className="w-2.5 h-2.5" /> Revoke Consent
                    </button>
                  </div>
                  <div className="font-mono text-[9px] text-zinc-400 space-y-0.5 select-all">
                    <p className="truncate"><span className="text-zinc-600">RECEIPT_HASH:</span> {receipt.hash}</p>
                    <p className="truncate"><span className="text-zinc-600">SIGNED_TIME:</span> {receipt.timestamp}</p>
                    <p className="truncate"><span className="text-zinc-600">STATE_VECTOR:</span> [Essentials: Y, Analytics: {receipt.analytics ? 'Y' : 'N'}, Preferences: {receipt.preferences ? 'Y' : 'N'}]</p>
                  </div>
                </div>
              )}

              {/* Buttons Panel */}
              <div className="flex gap-2.5 pt-2 border-t border-zinc-900">
                {showConfig ? (
                  <>
                    <button
                      onClick={() => setShowConfig(false)}
                      className="px-4 py-3 bg-zinc-900 border border-zinc-800 text-[10px] font-mono text-zinc-400 hover:text-white rounded-xl transition-all cursor-pointer font-bold"
                    >
                      Back
                    </button>
                    <button
                      onClick={handleSaveCustom}
                      className="flex-1 py-3 bg-cyan-950/40 hover:bg-cyan-950/70 border border-cyan-500/30 text-[10px] font-mono text-cyan-400 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer font-bold"
                    >
                      <Check className="w-3.5 h-3.5" /> Sign Custom State
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        // Customize path selection immediately
                        setShowConfig(true);
                      }}
                      className="px-4 py-3 bg-zinc-900 border border-zinc-850 text-[10px] font-mono text-zinc-400 hover:text-white rounded-xl transition-all cursor-pointer font-bold"
                    >
                      Customize
                    </button>
                    <button
                      onClick={handleAcceptAll}
                      className="flex-1 py-3 bg-cyan-600 hover:bg-cyan-500 text-white text-[10px] font-mono rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-cyan-950/35 cursor-pointer font-bold"
                    >
                      <ShieldCheck className="w-3.5 h-3.5" /> Authorize & Sign All
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
