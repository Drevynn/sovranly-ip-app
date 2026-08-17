'use client';

import { useState } from 'react';
import { 
  ShieldCheck, 
  Cpu, 
  Copy, 
  Check, 
  ExternalLink, 
  Zap, 
  Key, 
  Users, 
  Coins, 
  ArrowUpRight, 
  RefreshCw, 
  Lock, 
  X, 
  Sliders, 
  QrCode, 
  Eye, 
  EyeOff,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  SovranSmartAccountData, 
  SOVRAN_NETWORKS, 
  executeUserOp, 
  addGuardian 
} from '@/lib/sovran-smart-wallet';
import { Button } from '@/components/ui/button';

interface SovranSmartWalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  smartAccount: SovranSmartAccountData | null;
  onUpdateAccount: (updated: SovranSmartAccountData) => void;
  onDisconnect: () => void;
}

export default function SovranSmartWalletModal({
  isOpen,
  onClose,
  smartAccount,
  onUpdateAccount,
  onDisconnect
}: SovranSmartWalletModalProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'royalties' | 'session' | 'guardians' | 'export'>('overview');
  const [copiedAddr, setCopiedAddr] = useState(false);
  const [copiedSigner, setCopiedSigner] = useState(false);
  const [showPrivateKey, setShowPrivateKey] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [newGuardianName, setNewGuardianName] = useState('');
  const [newGuardianAddr, setNewGuardianAddr] = useState('');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  if (!isOpen || !smartAccount) return null;

  const handleCopyAddress = (addr: string, isSigner = false) => {
    navigator.clipboard.writeText(addr);
    if (isSigner) {
      setCopiedSigner(true);
      setTimeout(() => setCopiedSigner(false), 2000);
    } else {
      setCopiedAddr(true);
      setTimeout(() => setCopiedAddr(false), 2000);
    }
  };

  const handleSimulateSplitPayout = async () => {
    setIsSimulating(true);
    setStatusMessage(null);
    try {
      const res = await executeUserOp(
        smartAccount,
        'ROYALTY_SPLIT',
        'Commercial Sync License Royalty Payout ($1,250.00) -> 85% Creator ($1,062.50) / 15% Platform ($187.50)',
        '0.385 ETH'
      );
      onUpdateAccount(res.updatedAccount);
      setStatusMessage('Smart Contract Royalty Split Executed! 85% creator funds routed instantly.');
    } catch {
      setStatusMessage('Simulation failed. Please try again.');
    } finally {
      setIsSimulating(false);
    }
  };

  const handleAddGuardian = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGuardianAddr || !newGuardianName) return;
    const updated = addGuardian(smartAccount, newGuardianAddr, newGuardianName);
    onUpdateAccount(updated);
    setNewGuardianAddr('');
    setNewGuardianName('');
    setStatusMessage(`Guardian "${newGuardianName}" added successfully.`);
  };

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-[#020202]/85 backdrop-blur-md"
      />

      {/* Modal Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="relative w-full max-w-2xl bg-zinc-950 border border-cyan-500/30 rounded-3xl p-6 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col z-10"
      >
        {/* Glow ambient bar */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-cyan-400 via-emerald-400 to-violet-500" />

        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-zinc-900 pb-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-cyan-950/60 border border-cyan-500/30 text-cyan-400">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-black uppercase tracking-wider text-white">
                  Sovran Sovereign Smart Wallet
                </h2>
                <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800">
                  ERC-4337
                </span>
              </div>
              <p className="text-[10px] text-zinc-500 font-mono">
                Account Abstraction • Gasless Paymaster • Automated Royalty Splitter
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl border border-zinc-900 hover:bg-zinc-900 text-zinc-500 hover:text-white transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Status Toast */}
        {statusMessage && (
          <div className="mb-4 bg-emerald-950/40 border border-emerald-500/30 rounded-xl p-3 text-xs font-mono text-emerald-400 flex items-center gap-2">
            <Check className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>{statusMessage}</span>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex border-b border-zinc-900 mb-4 gap-1 p-1 bg-zinc-950 rounded-xl">
          {[
            { id: 'overview', label: 'Vault Overview', icon: Cpu },
            { id: 'royalties', label: '85/15 Split Engine', icon: Coins },
            { id: 'session', label: 'Session Keys', icon: Zap },
            { id: 'guardians', label: 'Guardians', icon: Users },
            { id: 'export', label: 'Backup & Keys', icon: Key },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-2 text-[10px] font-mono uppercase tracking-wider font-bold rounded-lg transition-all cursor-pointer ${
                  active
                    ? 'bg-zinc-900 text-cyan-400 border border-zinc-800 shadow-md'
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Contents */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-4">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-4">
              {/* Account Abstraction Card */}
              <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold uppercase text-zinc-400 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    Smart Contract Address (On-Chain Vault)
                  </span>
                  <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800/40">
                    Deployed &amp; Verified
                  </span>
                </div>

                <div className="flex items-center justify-between bg-zinc-950 p-3 rounded-xl border border-zinc-850 font-mono text-xs text-white">
                  <span className="truncate pr-2">{smartAccount.address}</span>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => handleCopyAddress(smartAccount.address)}
                      className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
                      title="Copy Smart Account Address"
                    >
                      {copiedAddr ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                    <a
                      href={`https://basescan.org/address/${smartAccount.address}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
                      title="View on Basescan Explorer"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>

                {/* Sub-card: Owner Signer */}
                <div className="pt-2 border-t border-zinc-850 flex items-center justify-between text-[10px] font-mono text-zinc-500">
                  <span>Owner Signer Key: {smartAccount.ownerSignerAddress.slice(0, 8)}...{smartAccount.ownerSignerAddress.slice(-6)}</span>
                  <button
                    onClick={() => handleCopyAddress(smartAccount.ownerSignerAddress, true)}
                    className="hover:text-cyan-400 flex items-center gap-1 transition-colors"
                  >
                    {copiedSigner ? 'Copied' : 'Copy Key'}
                  </button>
                </div>
              </div>

              {/* Gasless Paymaster Sponsorship Card */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-cyan-950/30 via-zinc-900/60 to-emerald-950/20 border border-cyan-500/20 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-cyan-400" />
                    <span className="text-xs font-bold text-white uppercase tracking-wider">
                      Zero-Gas Paymaster Active
                    </span>
                  </div>
                  <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30">
                    100% SPONSORED
                  </span>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Sovranly sponsors all network gas fees for IP asset registration, licensing compact creation, and royalty split execution on Base L2. You never have to buy or hold gas tokens to timestamp your work.
                </p>
              </div>

              {/* Balances & Network Details */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl bg-zinc-900/40 border border-zinc-800 space-y-1">
                  <span className="text-[10px] font-mono uppercase text-zinc-500">Network Layer</span>
                  <p className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-400" />
                    Base Mainnet (ERC-4337)
                  </p>
                </div>
                <div className="p-3.5 rounded-xl bg-zinc-900/40 border border-zinc-800 space-y-1">
                  <span className="text-[10px] font-mono uppercase text-zinc-500">Vault Balance</span>
                  <p className="text-xs font-bold text-emerald-400">
                    {smartAccount.balanceEth} ETH (~$1,420.00)
                  </p>
                </div>
              </div>

              {/* Recent UserOperations Ledger */}
              <div className="space-y-2">
                <span className="text-[10px] font-mono uppercase font-bold text-zinc-400">
                  Recent UserOperation Bundle Logs
                </span>
                <div className="space-y-1.5 max-h-40 overflow-y-auto">
                  {smartAccount.recentTransactions.map((tx, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-zinc-900/40 border border-zinc-850 flex items-center justify-between text-xs font-mono">
                      <div className="min-w-0 pr-2">
                        <p className="text-white text-[11px] truncate">{tx.description}</p>
                        <span className="text-[9px] text-zinc-500">{new Date(tx.timestamp).toLocaleTimeString()} • Gas Sponsored</span>
                      </div>
                      <span className="text-[10px] text-cyan-400 font-bold shrink-0">{tx.amount || '0.00 ETH'}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ROYALTIES */}
          {activeTab === 'royalties' && (
            <div className="space-y-4 font-mono">
              <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white uppercase">
                    Smart Contract Royalty Split Router
                  </span>
                  <span className="text-[10px] text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800/40">
                    Rule Enforced On-Chain
                  </span>
                </div>
                <p className="text-xs text-zinc-400 font-sans leading-relaxed">
                  Every commercial licensing fee sent to your Smart Account address is automatically routed by the smart contract in a single transaction:
                </p>

                <div className="space-y-2 pt-2">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-950 border border-zinc-800">
                    <span className="text-xs text-emerald-400 font-bold">Creator Payout Share (You)</span>
                    <span className="text-sm font-black text-emerald-400">85.00%</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-950 border border-zinc-800">
                    <span className="text-xs text-zinc-400">Sovranly Platform &amp; Gas Reserves</span>
                    <span className="text-sm font-bold text-zinc-400">15.00%</span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-900/40 border border-zinc-800 space-y-3">
                <span className="text-xs font-bold text-white uppercase">
                  Simulate On-Chain Split Execution
                </span>
                <p className="text-xs text-zinc-400 font-sans leading-relaxed">
                  Trigger an automated UserOperation split to preview how smart contract logic divides licensing revenue instantly.
                </p>
                <Button
                  onClick={handleSimulateSplitPayout}
                  disabled={isSimulating}
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-black font-bold text-xs uppercase tracking-wider py-3"
                >
                  {isSimulating ? (
                    <span className="flex items-center gap-2">
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Routing On-Chain Split...
                    </span>
                  ) : (
                    'Execute Sample $1,250 License Split'
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* TAB 3: SESSION KEYS */}
          {activeTab === 'session' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-3">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-cyan-400" />
                  <h3 className="text-xs font-bold text-white uppercase">
                    1-Click Frictionless Session Keys
                  </h3>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Session keys allow Sovranly IP to stamp and notarize your creative works without prompting you for a biometric / signature popup every single time you upload an asset.
                </p>

                {smartAccount.sessionKey && (
                  <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-850 space-y-2 font-mono text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-zinc-500 uppercase">Active Session Key</span>
                      <span className="text-[9px] text-emerald-400">Authorized &amp; Valid</span>
                    </div>
                    <p className="text-white text-[11px] truncate">{smartAccount.sessionKey.publicKey}</p>
                    <p className="text-[10px] text-zinc-500">
                      Scope: {smartAccount.sessionKey.purpose}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: GUARDIANS */}
          {activeTab === 'guardians' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-white uppercase flex items-center gap-2">
                    <Users className="w-4 h-4 text-violet-400" />
                    Zero Trust Guardian Social Recovery
                  </h3>
                  <span className="text-[9px] font-mono text-zinc-400">
                    Threshold: 2 Guardians
                  </span>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  If you ever lose access to your primary device, your appointed guardians can approve a recovery UserOperation to transfer control of your Smart Account to a new key.
                </p>

                {/* Guardians List */}
                <div className="space-y-2 pt-2">
                  {smartAccount.guardians.map((g, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-zinc-950 border border-zinc-850 flex items-center justify-between font-mono text-xs">
                      <div>
                        <p className="text-white font-bold text-[11px]">{g.name}</p>
                        <p className="text-zinc-500 text-[10px] truncate max-w-xs">{g.address}</p>
                      </div>
                      <span className="text-[9px] text-emerald-400 font-bold bg-emerald-950 px-2 py-0.5 rounded">
                        Active
                      </span>
                    </div>
                  ))}
                </div>

                {/* Add Guardian Form */}
                <form onSubmit={handleAddGuardian} className="pt-3 border-t border-zinc-850 space-y-2 font-mono">
                  <span className="text-[10px] font-bold uppercase text-zinc-400">Add Trusted Guardian</span>
                  <input
                    type="text"
                    placeholder="Guardian Name (e.g., Co-Producer, Legal Counsel, Backup Email)"
                    value={newGuardianName}
                    onChange={(e) => setNewGuardianName(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-xs text-white placeholder-zinc-700"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Ethereum Address (0x...)"
                    value={newGuardianAddr}
                    onChange={(e) => setNewGuardianAddr(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-xs text-white placeholder-zinc-700"
                    required
                  />
                  <Button type="submit" className="w-full bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs uppercase">
                    Add Guardian to Smart Contract
                  </Button>
                </form>
              </div>
            </div>
          )}

          {/* TAB 5: EXPORT & BACKUP */}
          {activeTab === 'export' && (
            <div className="space-y-4 font-mono">
              <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-3">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-rose-400" />
                  <h3 className="text-xs font-bold text-white uppercase">
                    Export Sovereign Signer Key
                  </h3>
                </div>
                <p className="text-xs text-zinc-400 font-sans leading-relaxed">
                  Your Smart Contract Account is permanently owned by your private signer key. You can export this key to import into MetaMask, Rabby, or hardware devices.
                </p>

                {smartAccount.ownerPrivateKeyEncrypted && (
                  <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-zinc-500 uppercase">Private Key</span>
                      <button
                        onClick={() => setShowPrivateKey(!showPrivateKey)}
                        className="text-[10px] text-cyan-400 flex items-center gap-1 hover:underline"
                      >
                        {showPrivateKey ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                        {showPrivateKey ? 'Hide' : 'Reveal'}
                      </button>
                    </div>
                    <p className="text-xs text-rose-400 font-mono break-all select-all">
                      {showPrivateKey ? smartAccount.ownerPrivateKeyEncrypted : '••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-4 mt-4 border-t border-zinc-900 flex items-center justify-between">
          <Button
            variant="destructive"
            onClick={onDisconnect}
            className="text-[10px] uppercase font-mono bg-red-950/30 hover:bg-red-950/60 text-red-400 border border-red-500/20"
          >
            Disconnect Account
          </Button>
          <Button
            onClick={onClose}
            className="bg-white text-zinc-950 hover:bg-zinc-200 font-bold text-xs uppercase px-6"
          >
            Done
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
