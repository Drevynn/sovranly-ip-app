'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Activity, 
  RefreshCw, 
  Check, 
  Copy, 
  ExternalLink,
  Coins, 
  ShieldAlert, 
  BadgeCheck, 
  Cpu, 
  FileText,
  Clock
} from 'lucide-react';

interface Transaction {
  id: string;
  hash: string;
  type: string;
  assetTitle: string;
  amount: string;
  fromAddress: string;
  toAddress: string;
  timestamp: string;
}

export default function Overview() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const cards = [
    { title: 'My IP Assets', value: '47' },
    { title: 'Total Earnings', value: '$128.4k', color: 'text-emerald-400' },
    { title: 'Active Licenses', value: '19', color: 'text-cyan-400' },
    { title: 'Pending Royalties', value: '$4,820' },
  ];

  useEffect(() => {
    setLoading(true);
    fetch('/api/transactions')
      .then(res => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then(data => {
        setTransactions(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Fetch error for transactions:', err);
        setLoading(false);
      });
  }, [refreshKey]);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'Mint IP Asset':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-cyan-950/40 text-cyan-400 border border-cyan-800/40 rounded-full text-xs font-semibold">
            <Cpu className="w-3.5 h-3.5" /> Mint IP Asset
          </span>
        );
      case 'License Assigned':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-violet-950/40 text-violet-400 border border-violet-800/40 rounded-full text-xs font-semibold">
            <BadgeCheck className="w-3.5 h-3.5" /> License Assigned
          </span>
        );
      case 'Royalty Split':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-950/40 text-emerald-400 border border-emerald-800/40 rounded-full text-xs font-semibold">
            <Coins className="w-3.5 h-3.5" /> Royalty Split
          </span>
        );
      case 'License Purchased':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-950/40 text-amber-400 border border-amber-800/40 rounded-full text-xs font-semibold">
            <FileText className="w-3.5 h-3.5" /> License Purchased
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-zinc-900 border border-zinc-800 text-zinc-400 rounded-full text-xs font-semibold">
            <Activity className="w-3.5 h-3.5" /> On-Chain Tx
          </span>
        );
    }
  };

  // Helper to format time relative to now in a simple manner
  const formatTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMinutes = Math.floor(diffMs / (60 * 1000));
      const diffHours = Math.floor(diffMs / (60 * 60 * 1000));
      const diffDays = Math.floor(diffMs / (24 * 60 * 60 * 1000));

      if (diffMinutes < 1) return 'Just now';
      if (diffMinutes < 60) return `${diffMinutes}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      return `${diffDays}d ago`;
    } catch {
      return 'Recent';
    }
  };

  return (
    <div className="space-y-8">
      {/* Overview Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, i) => (
          <Card key={i} className="bg-zinc-900/50 border border-white/5 p-2 shadow-lg backdrop-blur-sm hover:border-zinc-800 transition">
            <CardContent className="p-4">
              <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-bold mb-2">{card.title}</p>
              <p className={`text-4xl font-light tracking-tighter ${card.color || 'text-white'}`}>{card.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Blockchain Activity Widget */}
      <Card className="bg-zinc-950/60 border border-zinc-900 shadow-2xl rounded-3xl overflow-hidden backdrop-blur-md">
        <div className="p-6 md:p-8 border-b border-zinc-900 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <h3 className="text-lg font-bold text-white tracking-tight uppercase">Recent On-Chain Activity Feed</h3>
            </div>
            <p className="text-xs text-zinc-500">Continuous ledger telemetry verified under Zero Trust Authority</p>
          </div>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setRefreshKey(prev => prev + 1)}
            className="border-zinc-800 bg-zinc-900/40 text-xs text-zinc-300 hover:bg-zinc-900 hover:text-white transition gap-2 rounded-xl py-4"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Refresh Feed
          </Button>
        </div>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-950 border-b border-zinc-900">
                  <th className="p-4 pl-6 md:pl-8 text-xs font-semibold uppercase tracking-wider text-zinc-500">Status & Type</th>
                  <th className="p-4 text-xs font-semibold uppercase tracking-wider text-zinc-500">Asset Context</th>
                  <th className="p-4 text-xs font-semibold uppercase tracking-wider text-zinc-500">Tx Hash</th>
                  <th className="p-4 text-xs font-semibold uppercase tracking-wider text-zinc-500">Ledger Value</th>
                  <th className="p-4 pr-6 md:pr-8 text-xs font-semibold uppercase tracking-wider text-zinc-500 text-right">Age</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-900/50">
                <AnimatePresence mode="popLayout">
                  {loading ? (
                    // Skeletons
                    Array.from({ length: 5 }).map((_, idx) => (
                      <tr key={`skeleton-${idx}`} className="animate-pulse">
                        <td className="p-5 pl-6 md:pl-8">
                          <div className="h-6 w-32 bg-zinc-900 rounded-full" />
                        </td>
                        <td className="p-5">
                          <div className="h-4 w-44 bg-zinc-900 rounded-md mb-1" />
                        </td>
                        <td className="p-5">
                          <div className="h-4 w-28 bg-zinc-900 rounded-md" />
                        </td>
                        <td className="p-5">
                          <div className="h-4 w-16 bg-zinc-900 rounded-md" />
                        </td>
                        <td className="p-5 pr-6 md:pr-8 text-right">
                          <div className="h-4 w-12 bg-zinc-900 rounded-md ml-auto" />
                        </td>
                      </tr>
                    ))
                  ) : transactions.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-12 text-center text-sm text-zinc-500">
                        <ShieldAlert className="w-8 h-8 text-zinc-600 mx-auto mb-3" />
                         No on-chain transactions discovered in ledger registry.
                      </td>
                    </tr>
                  ) : (
                    transactions.map((tx, idx) => (
                      <motion.tr 
                        key={tx.id || idx}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.15, delay: idx * 0.05 }}
                        className="hover:bg-zinc-900/30 transition group"
                      >
                        {/* Type/Badge */}
                        <td className="p-4 pl-6 md:pl-8 align-middle">
                          {getTypeBadge(tx.type)}
                        </td>

                        {/* Asset Title */}
                        <td className="p-4 align-middle">
                          <div className="font-medium text-white group-hover:text-cyan-400 transition text-sm">
                            {tx.assetTitle}
                          </div>
                        </td>

                        {/* Transaction Truncated Hash */}
                        <td className="p-4 align-middle font-mono text-xs text-zinc-500">
                          <div className="flex items-center gap-1.5">
                            <span>{`${tx.hash.slice(0, 6)}...${tx.hash.slice(-4)}`}</span>
                            <button
                              onClick={() => copyToClipboard(tx.hash, tx.id)}
                              className="p-1 text-zinc-600 hover:text-zinc-300 rounded transition"
                              title="Copy transaction hash"
                            >
                              {copiedId === tx.id ? (
                                <Check className="w-3 h-3 text-emerald-400" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                            </button>
                            <a 
                              href={`https://etherscan.io/tx/${tx.hash}`}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1 text-zinc-600 hover:text-cyan-400 rounded transition opacity-0 group-hover:opacity-100"
                            >
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        </td>

                        {/* Amount */}
                        <td className="p-4 align-middle font-mono text-sm text-zinc-300">
                          {tx.amount === '0.00 ETH' ? (
                            <span className="text-xs text-zinc-500">Gas Only</span>
                          ) : (
                            <span className="text-zinc-200 font-semibold">{tx.amount}</span>
                          )}
                        </td>

                        {/* Timestamp relative */}
                        <td className="p-4 pr-6 md:pr-8 text-right align-middle text-xs font-mono text-zinc-500">
                          <div className="flex items-center justify-end gap-1.5">
                            <Clock className="w-3 h-3 text-zinc-600" />
                            <span>{formatTime(tx.timestamp)}</span>
                          </div>
                        </td>
                      </motion.tr>
                    ))
                  )}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
