'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ethers } from 'ethers';
import { Button } from '@/components/ui/button';
import { 
  Wallet, 
  X, 
  Check, 
  AlertCircle, 
  ShieldCheck, 
  Smartphone, 
  Cpu, 
  RefreshCw, 
  QrCode, 
  ExternalLink,
  ChevronRight,
  Info,
  Zap,
  Sparkles,
  Lock,
  Coins
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import SovranSmartWalletModal from '@/components/SovranSmartWalletModal';
import { 
  SovranSmartAccountData, 
  getStoredSmartAccount, 
  createSovranSmartAccount 
} from '@/lib/sovran-smart-wallet';
import { useAuth } from '@/components/auth/FirebaseProvider';

interface WalletOption {
  id: string;
  name: string;
  icon: string;
  description: string;
  badge?: string;
  isAvailable?: boolean;
}

export default function WalletConnect({ onConnect }: { onConnect: (address: string) => void }) {
  const { user } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [smartAccount, setSmartAccount] = useState<SovranSmartAccountData | null>(null);
  const [isSmartWallet, setIsSmartWallet] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isSmartModalOpen, setIsSmartModalOpen] = useState(false);

  const [detectedExtension] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      const win = window as any;
      if (win.ethereum) {
        const ethVal = win.ethereum;
        if (ethVal.isMetaMask) return 'MetaMask';
        if (ethVal.isCoinbaseWallet) return 'Coinbase Wallet';
        if (ethVal.isTrust) return 'Trust Wallet';
        if (ethVal.isBraveWallet) return 'Brave Wallet';
        return 'Active Provider';
      }
      if (win.coinbaseWalletExtension) return 'Coinbase Wallet';
      if (win.trustWallet) return 'Trust Wallet';
    }
    return null;
  });

  const [isConnecting, setIsConnecting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'connect' | 'docs'>('connect');
  const [step, setStep] = useState<'selection' | 'qr' | 'sandbox_input'>('selection');
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null);
  const [customAddress, setCustomAddress] = useState('');

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    const stored = getStoredSmartAccount();
    if (stored) {
      setSmartAccount(stored);
      setAddress(stored.address);
      setIsSmartWallet(true);
      onConnect(stored.address);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLaunchSovranSmartAccount = () => {
    setIsConnecting(true);
    setErrorMessage(null);
    try {
      let currentAcc = smartAccount;
      if (!currentAcc) {
        currentAcc = createSovranSmartAccount(undefined, user?.email || undefined);
        setSmartAccount(currentAcc);
      }
      setAddress(currentAcc.address);
      setIsSmartWallet(true);
      onConnect(currentAcc.address);
      setIsOpen(false);
      setIsSmartModalOpen(true);
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to initialize Sovran Smart Account');
    } finally {
      setIsConnecting(false);
    }
  };

  const connectDirectExtension = async (targetWallet?: string) => {
    setErrorMessage(null);
    setIsConnecting(true);
    if (typeof window === 'undefined') {
      setIsConnecting(false);
      return;
    }

    let injectedProvider = (window as any).ethereum;

    if (targetWallet === 'Coinbase Wallet' && (window as any).coinbaseWalletExtension) {
      injectedProvider = (window as any).coinbaseWalletExtension;
    } else if (targetWallet === 'Trust Wallet' && (window as any).trustWallet) {
      injectedProvider = (window as any).trustWallet;
    } else if (injectedProvider && injectedProvider.providers) {
      const providers = injectedProvider.providers;
      if (targetWallet === 'Coinbase Wallet') {
        injectedProvider = providers.find((p: any) => p.isCoinbaseWallet) || injectedProvider;
      } else if (targetWallet === 'MetaMask') {
        injectedProvider = providers.find((p: any) => p.isMetaMask) || injectedProvider;
      } else if (targetWallet === 'Trust Wallet') {
        injectedProvider = providers.find((p: any) => p.isTrust) || injectedProvider;
      }
    }

    if (injectedProvider) {
      try {
        const provider = new ethers.BrowserProvider(injectedProvider);
        const accounts = await provider.send("eth_requestAccounts", []);
        const signer = await provider.getSigner();
        const userAddress = await signer.getAddress();
        setAddress(userAddress);
        setIsSmartWallet(false);
        onConnect(userAddress);
        setIsOpen(false);
      } catch (error: any) {
        console.error("Multi-wallet connection failed", error);
        setErrorMessage(error?.message || "Injected extension authentication failed. Enter your address in our Sovereign Sandbox suite or try again.");
      } finally {
        setIsConnecting(false);
      }
    } else {
      setErrorMessage(`No hot extension found active for ${targetWallet || 'selected client'}. Standardize connections using Mobile Tunnel or click the Sovereign Sandbox tab!`);
      setIsConnecting(false);
    }
  };

  const selectWalletOption = async (option: WalletOption) => {
    setSelectedWallet(option.name);
    setErrorMessage(null);

    if (option.id === 'extension') {
      if (detectedExtension) {
        await connectDirectExtension(detectedExtension);
      } else {
        setErrorMessage(`Please install a browser extension or use our Sovereign Sandbox options to test instantly!`);
      }
    } else if (option.id === 'metamask') {
      await connectDirectExtension('MetaMask');
    } else if (option.id === 'coinbase') {
      if (detectedExtension === 'Coinbase Wallet' || (window as any).coinbaseWalletExtension) {
        await connectDirectExtension('Coinbase Wallet');
      } else {
        setStep('qr');
      }
    } else if (option.id === 'trust') {
      if (detectedExtension === 'Trust Wallet' || (window as any).trustWallet) {
        await connectDirectExtension('Trust Wallet');
      } else {
        setStep('qr');
      }
    } else if (option.id === 'walletconnect' || option.id === 'cryptocom') {
      setStep('qr');
    } else if (option.id === 'sandbox') {
      setStep('sandbox_input');
    }
  };

  const handleSimulatedBridgeConnect = () => {
    setIsConnecting(true);
    setTimeout(() => {
      const randomAlphanumeric = Array.from({ length: 40 }, () => 
        '0123456789abcdef'[Math.floor(Math.random() * 16)]
      ).join('');
      const mockAddress = `0x${randomAlphanumeric}`;
      setAddress(mockAddress);
      setIsSmartWallet(false);
      onConnect(mockAddress);
      setIsConnecting(false);
      setIsOpen(false);
    }, 1500);
  };

  const handleAddManualAddress = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanAddr = customAddress.trim();
    if (/^0x[a-fA-F0-9]{40}$/.test(cleanAddr)) {
      setAddress(cleanAddr);
      setIsSmartWallet(false);
      onConnect(cleanAddr);
      setIsOpen(false);
    } else {
      setErrorMessage("Invalid Ethereum hexadecimal address format. Must match ^0x[a-fA-F]{40}$");
    }
  };

  const handleGenerateSandboxRandom = () => {
    const randomHex = Array.from({ length: 40 }, () => 
      '0123456789abcdef'[Math.floor(Math.random() * 16)]
    ).join('');
    const mockAddress = `0x${randomHex}`;
    setAddress(mockAddress);
    setIsSmartWallet(false);
    onConnect(mockAddress);
    setIsOpen(false);
  };

  const handleDisconnect = () => {
    setAddress(null);
    setIsSmartWallet(false);
    onConnect('');
    setIsOpen(false);
    setIsSmartModalOpen(false);
  };

  const walletOptions: WalletOption[] = [
    {
      id: 'extension',
      name: detectedExtension || 'Browser Extension',
      icon: '🌐',
      description: 'Connect directly to your active default browser wallet.',
      badge: detectedExtension ? 'Active & Ready' : undefined,
      isAvailable: !!detectedExtension
    },
    {
      id: 'metamask',
      name: 'MetaMask',
      icon: '🦊',
      description: 'Standard hot-storage Ethereum wallet provider.',
      badge: detectedExtension === 'MetaMask' ? 'Detected' : undefined
    },
    {
      id: 'coinbase',
      name: 'Coinbase Wallet',
      icon: '🔵',
      description: 'Connect via extension or scan with your Coinbase app.',
      badge: detectedExtension === 'Coinbase Wallet' ? 'Detected' : 'Includes App'
    },
    {
      id: 'cryptocom',
      name: 'Crypto.com DeFi',
      icon: '🦁',
      description: 'Bridge effortlessly with Crypto.com decentralized app.',
      badge: 'Cronos Bridge'
    },
    {
      id: 'walletconnect',
      name: 'Universal WalletConnect',
      icon: '⚡',
      description: 'Scan QR with Trust Wallet, Ledger, or 100+ other mobile wallets.',
      badge: 'EIP-1193'
    },
    {
      id: 'sandbox',
      name: 'Sovereign Sandbox Hub',
      icon: '🛠️',
      description: 'Test instantly! No browser extension or web3 setup needed.',
      badge: 'High Trust Dev'
    }
  ];

  return (
    <>
      {/* Primary Wallet Trigger Button */}
      <Button 
        onClick={() => {
          if (address && isSmartWallet) {
            setIsSmartModalOpen(true);
          } else {
            setStep('selection');
            setErrorMessage(null);
            setIsOpen(true);
          }
        }} 
        className={`rounded-full transition-all duration-300 font-mono text-[11px] font-bold tracking-wider relative group cursor-pointer ${
          address 
            ? isSmartWallet
              ? "bg-cyan-950/80 border border-cyan-500/50 text-cyan-300 hover:bg-cyan-900/60 shadow-lg shadow-cyan-950/50 px-4 py-2"
              : "bg-zinc-950 border border-emerald-500/30 text-emerald-400 hover:bg-zinc-900 px-5 py-2.5" 
            : "bg-white text-zinc-950 hover:bg-zinc-100 hover:shadow-[0_0_20px_rgba(255,255,255,0.15)] px-6 py-3"
        }`}
        id="wallet-trigger-button"
      >
        <span className="flex items-center gap-2">
          {address ? (
            <>
              {isSmartWallet ? (
                <>
                  <span className="p-1 rounded-full bg-cyan-500/20 text-cyan-400">
                    <Cpu className="w-3 h-3" />
                  </span>
                  <span>SOVRAN SMART VAULT</span>
                  <span className="text-[9px] text-cyan-400 font-mono opacity-80">
                    ({address.substring(0, 4)}...{address.substring(38)})
                  </span>
                </>
              ) : (
                <>
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
                  {address.substring(0, 6)}...{address.substring(38)}
                </>
              )}
            </>
          ) : (
            <>
              <Wallet className="w-3.5 h-3.5" />
              CONNECT SOVEREIGN KEY
            </>
          )}
        </span>
      </Button>

      {/* Sovran Smart Wallet Detailed Management Modal */}
      <SovranSmartWalletModal
        isOpen={isSmartModalOpen}
        onClose={() => setIsSmartModalOpen(false)}
        smartAccount={smartAccount}
        onUpdateAccount={(updated) => {
          setSmartAccount(updated);
          setAddress(updated.address);
          onConnect(updated.address);
        }}
        onDisconnect={handleDisconnect}
      />

      {/* Multi-Wallet Zero Trust Selection Portal */}
      {mounted && typeof document !== 'undefined' ? createPortal(
        <AnimatePresence>
          {isOpen && (
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
              {/* Dark blur overlay */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsOpen(false)}
                className="absolute inset-0 bg-[#020202]/85 backdrop-blur-sm"
                id="wallet-modal-overlay"
              />

              {/* Portal Window */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                className="relative w-full max-w-xl bg-zinc-950 border border-zinc-900/80 rounded-2xl p-6 shadow-2xl overflow-hidden max-h-[88vh] flex flex-col z-10"
                id="wallet-portal-window"
              >
                {/* Top ambient color bar styling */}
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-cyan-500 via-zinc-800 to-emerald-500" />
                
                {/* Header */}
                <div className="flex items-center justify-between border-b border-zinc-900 pb-4 mb-4">
                  <div>
                    <h3 className="text-sm font-black uppercase tracking-widest text-white flex items-center gap-2">
                      <Cpu className="w-4 h-4 text-cyan-400" />
                      Sovereign Key Gateway
                    </h3>
                    <p className="text-[10px] text-zinc-500 font-mono uppercase mt-0.5 tracking-tight">
                      Zero Trust Decentralized Verification Node
                    </p>
                  </div>
                  <button 
                    onClick={() => setIsOpen(false)}
                    className="p-1 px-1.5 rounded-lg border border-zinc-900 bg-zinc-950 hover:bg-zinc-900 text-zinc-500 hover:text-white transition-all cursor-pointer"
                    id="close-wallet-portal"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Tabs selector */}
                <div className="flex border-b border-zinc-900 mb-4 gap-1 p-1 bg-zinc-950 rounded-lg">
                  <button
                    onClick={() => {
                      setActiveTab('connect');
                      setStep('selection');
                    }}
                    className={`flex-1 text-center py-2 px-3 text-[10px] font-mono uppercase tracking-wider font-bold rounded-md transition-all cursor-pointer ${
                      activeTab === 'connect'
                        ? 'bg-zinc-900 text-cyan-400 border border-zinc-800'
                        : 'text-zinc-500 hover:text-zinc-300'
                    }`}
                  >
                    Wallet Options
                  </button>
                  <button
                    onClick={() => setActiveTab('docs')}
                    className={`flex-1 text-center py-2 px-3 text-[10px] font-mono uppercase tracking-wider font-bold rounded-md transition-all cursor-pointer ${
                      activeTab === 'docs'
                        ? 'bg-zinc-900 text-cyan-400 border border-zinc-800'
                        : 'text-zinc-500 hover:text-zinc-300'
                    }`}
                  >
                    ERC-4337 Architecture
                  </button>
                </div>

                {/* Error Alert Bar */}
                {errorMessage && (
                  <div className="mb-4 bg-red-950/25 border border-red-500/20 rounded-xl p-3 text-[11px] font-mono text-red-400 flex items-start gap-2 animate-shake">
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                    <div>
                      <span className="font-extrabold uppercase">Registry Exception: </span>
                      {errorMessage}
                    </div>
                  </div>
                )}

                {/* Main Dynamic View Panels */}
                <div className="flex-1 overflow-y-auto pr-1 space-y-4">
                  {activeTab === 'connect' && (
                    <>
                      {step === 'selection' && (
                        <>
                          {/* FEATURED: Sovran Sovereign Smart Wallet (ERC-4337) */}
                          <div className="p-4 rounded-2xl bg-gradient-to-br from-cyan-950/40 via-zinc-900/80 to-zinc-950 border border-cyan-500/40 hover:border-cyan-400/80 transition-all shadow-xl shadow-cyan-950/30 group relative">
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex items-center gap-3">
                                <div className="p-2.5 rounded-xl bg-cyan-950 border border-cyan-500/50 text-cyan-400 group-hover:scale-105 transition-transform">
                                  <Sparkles className="w-5 h-5 text-cyan-300 animate-pulse" />
                                </div>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <h4 className="text-xs font-black uppercase text-white tracking-wide">
                                      Sovran Sovereign Smart Wallet
                                    </h4>
                                    <span className="text-[8px] font-mono uppercase px-1.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40">
                                      Recommended (ERC-4337)
                                    </span>
                                  </div>
                                  <p className="text-[10px] text-zinc-400 mt-1 leading-relaxed">
                                    Built directly into Sovranly IP. Zero extensions required. Features **100% sponsored gas**, instant **85/15 royalty splits**, and social guardian recovery.
                                  </p>
                                </div>
                              </div>
                            </div>

                            <div className="mt-3.5 pt-3 border-t border-cyan-500/20 flex items-center justify-between">
                              <div className="flex items-center gap-3 text-[9px] font-mono text-zinc-400">
                                <span className="flex items-center gap-1 text-emerald-400">
                                  <Zap className="w-3 h-3" /> Gasless
                                </span>
                                <span className="flex items-center gap-1 text-cyan-400">
                                  <Coins className="w-3 h-3" /> 85% Splits
                                </span>
                                <span className="flex items-center gap-1 text-violet-400">
                                  <Lock className="w-3 h-3" /> Non-Custodial
                                </span>
                              </div>
                              <Button
                                onClick={handleLaunchSovranSmartAccount}
                                disabled={isConnecting}
                                className="bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs uppercase tracking-wider py-1.5 px-4 rounded-xl shadow-lg shadow-cyan-500/20 cursor-pointer"
                              >
                                {isConnecting ? (
                                  <span className="flex items-center gap-1">
                                    <RefreshCw className="w-3 h-3 animate-spin" /> Minting...
                                  </span>
                                ) : smartAccount ? (
                                  'Open Smart Vault'
                                ) : (
                                  'Create Smart Wallet'
                                )}
                              </Button>
                            </div>
                          </div>

                          {/* Divider */}
                          <div className="flex items-center gap-3 my-2">
                            <div className="h-[1px] flex-1 bg-zinc-900" />
                            <span className="text-[9px] font-mono uppercase text-zinc-600 font-bold">
                              Or Connect External Wallet
                            </span>
                            <div className="h-[1px] flex-1 bg-zinc-900" />
                          </div>

                          {/* Options list */}
                          <div className="grid grid-cols-1 gap-2">
                            {walletOptions.map((opt) => (
                              <button
                                key={opt.id}
                                onClick={() => selectWalletOption(opt)}
                                className="w-full text-left bg-zinc-950 hover:bg-zinc-900 border border-zinc-900 hover:border-zinc-800 rounded-xl p-3 transition-all flex items-center justify-between group relative cursor-pointer"
                              >
                                <div className="flex items-center gap-3">
                                  <span className="text-lg shrink-0 select-none">{opt.icon}</span>
                                  <div>
                                    <div className="flex items-center gap-2">
                                      <span className="text-xs font-bold text-white tracking-wide group-hover:text-cyan-300 transition-colors">
                                        {opt.name}
                                      </span>
                                      {opt.badge && (
                                        <span className={`text-[8px] font-mono uppercase px-1.5 py-0.5 rounded-full ${
                                          opt.id === 'sandbox' 
                                            ? 'bg-cyan-950 text-cyan-400 border border-cyan-500/20' 
                                            : opt.badge.includes('Active') || opt.badge.includes('Detected')
                                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/20'
                                              : 'bg-zinc-900 text-zinc-400'
                                        }`}>
                                          {opt.badge}
                                        </span>
                                      )}
                                    </div>
                                    <p className="text-[10px] text-zinc-500 mt-0.5 leading-relaxed pr-6">
                                      {opt.description}
                                    </p>
                                  </div>
                                </div>
                                <ChevronRight className="w-4 h-4 text-zinc-700 group-hover:text-zinc-400 group-hover:translate-x-0.5 transition-all shrink-0" />
                              </button>
                            ))}
                          </div>

                          {/* Disconnect context if already authenticated */}
                          {address && (
                            <div className="pt-2 border-t border-zinc-900 flex items-center justify-between text-xs text-zinc-500">
                              <span className="font-mono text-[9px] uppercase tracking-wide">
                                Active: {address.substring(0, 8)}...{address.substring(34)}
                              </span>
                              <Button 
                                variant="destructive" 
                                onClick={handleDisconnect}
                                className="text-[9px] uppercase tracking-widest font-mono bg-red-950/30 hover:bg-red-950/60 border border-red-500/10 text-red-500 rounded-lg px-3 py-1.5 h-auto cursor-pointer"
                              >
                                Disassociate
                              </Button>
                            </div>
                          )}
                        </>
                      )}

                      {/* QR / Bridge step */}
                      {step === 'qr' && (
                        <div className="flex flex-col items-center justify-center p-4 text-center max-w-sm mx-auto space-y-5">
                          <div>
                            <p className="text-xs font-bold text-white uppercase tracking-wider">
                              Bridge Connecting via {selectedWallet}
                            </p>
                            <p className="text-[10px] text-zinc-500 uppercase font-mono tracking-wider mt-0.5">
                              Scan utilizing your mobile web3 app
                            </p>
                          </div>

                          <div 
                            onClick={handleSimulatedBridgeConnect}
                            className="relative p-6 rounded-2xl bg-white border border-zinc-800 flex flex-col items-center justify-center cursor-pointer hover:shadow-[0_0_25px_rgba(34,211,238,0.3)] transition-all group"
                          >
                            <QrCode className="w-40 h-40 text-zinc-950 group-hover:scale-105 transition-transform" />
                            <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-zinc-950 text-cyan-400 border border-cyan-800 rounded-xl text-[10px] font-mono tracking-widest uppercase font-black px-2 py-1 shadow-md">
                              CLICK TO LINK
                            </span>
                          </div>

                          <div className="flex gap-2 justify-center w-full">
                            <Button 
                              onClick={() => setStep('selection')} 
                              variant="outline" 
                              className="border-zinc-800 bg-transparent text-white hover:bg-zinc-900 font-mono text-[9px] uppercase tracking-wider flex-1 py-4"
                            >
                              Go Back
                            </Button>
                            <Button 
                              onClick={handleSimulatedBridgeConnect}
                              disabled={isConnecting}
                              className="bg-emerald-500 hover:bg-emerald-600 text-zinc-950 font-mono text-[9px] uppercase tracking-widest font-black flex-1 py-4 shadow-lg shadow-emerald-500/20"
                            >
                              {isConnecting ? 'Linking...' : 'Authorize Bridge'}
                            </Button>
                          </div>
                        </div>
                      )}

                      {/* Sandbox step */}
                      {step === 'sandbox_input' && (
                        <div className="space-y-4">
                          <div className="bg-zinc-950 border border-zinc-900 p-4 rounded-xl space-y-3">
                            <h5 className="text-[11px] font-bold text-zinc-200 uppercase tracking-wide">
                              Zero Trust Fast Mock Key
                            </h5>
                            <Button 
                              onClick={handleGenerateSandboxRandom}
                              className="bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/20 text-[10px] font-mono font-bold uppercase tracking-wider py-3 h-auto w-full flex items-center justify-center gap-1.5"
                            >
                              <RefreshCw className="w-3.5 h-3.5" />
                              Generate Test Identity
                            </Button>
                          </div>

                          <form onSubmit={handleAddManualAddress} className="bg-zinc-950 border border-zinc-900 p-4 rounded-xl space-y-3">
                            <h5 className="text-[11px] font-bold text-zinc-200 uppercase tracking-wide">
                              Manual Compliance Address Input
                            </h5>
                            <input
                              type="text"
                              placeholder="0x..."
                              value={customAddress}
                              onChange={(e) => setCustomAddress(e.target.value)}
                              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-xs text-cyan-400 placeholder-zinc-700 font-mono"
                              required
                            />
                            <div className="flex gap-2">
                              <Button 
                                type="button"
                                onClick={() => setStep('selection')} 
                                variant="outline" 
                                className="border-zinc-800 bg-transparent text-white hover:bg-zinc-900 font-mono text-[9px] uppercase tracking-wider py-2 h-auto"
                              >
                                Go Back
                              </Button>
                              <Button 
                                type="submit"
                                className="bg-white text-zinc-950 hover:bg-zinc-200 font-mono text-[9px] uppercase tracking-widest font-black py-2 h-auto flex-1"
                              >
                                Link Address
                              </Button>
                            </div>
                          </form>
                        </div>
                      )}
                    </>
                  )}

                  {activeTab === 'docs' && (
                    <div className="space-y-3 font-mono text-[10px] text-zinc-300">
                      <div className="p-3.5 bg-zinc-900/30 border border-zinc-800/80 rounded-xl space-y-1.5">
                        <div className="flex items-center gap-1.5 text-cyan-400 font-extrabold uppercase text-[10px]">
                          <Cpu className="w-3.5 h-3.5" />
                          Sovranly Account Abstraction (ERC-4337)
                        </div>
                        <p className="text-[9px] text-zinc-400 leading-relaxed">
                          Sovranly IP uses open-source smart contract accounts (EIP-4337) to eliminate all seed phrase hurdles, sponsor gas fees for creators, and guarantee an unalterable 85% creator royalty distribution via on-chain smart contracts.
                        </p>
                      </div>

                      <div className="p-3 bg-zinc-950 border border-zinc-900 rounded-xl space-y-2">
                        <span className="text-white font-bold uppercase text-[10px]">Architecture Highlights:</span>
                        <ul className="space-y-1 text-zinc-400 text-[9px] list-disc list-inside">
                          <li><strong className="text-cyan-400">Zero License Fees:</strong> Built on open-source public Ethereum standards.</li>
                          <li><strong className="text-emerald-400">Gasless Paymaster:</strong> Platform sponsors IP registration gas fees.</li>
                          <li><strong className="text-teal-400">Automated 85/15 Router:</strong> Built-in split logic executed on payment reception.</li>
                          <li><strong className="text-violet-400">Social Guardians:</strong> 2-of-N multi-sig recovery in case of lost devices.</li>
                        </ul>
                      </div>
                    </div>
                  )}
                </div>

                {/* Portal Footer Stamp */}
                <div className="border-t border-zinc-900 pt-3.5 mt-4 text-center">
                  <span className="text-[8px] font-mono text-zinc-700 tracking-wider uppercase flex items-center justify-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500/70" />
                    Sovranly Zero Trust Cryptographic Proof Enforced
                  </span>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      ) : null}
    </>
  );
}
