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
import { getDb, getFirebaseAuth } from '@/lib/firebase';
import { collection, query, orderBy, limit, onSnapshot, Timestamp } from 'firebase/firestore';

// Enum and interface for Firestore security error tracing as per guidelines
enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const auth = getFirebaseAuth();
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Real-Time Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

interface Transaction {
  id: string;
  hash: string;
  type: string;
  assetTitle: string;
  amount: string;
  fromAddress?: string;
  toAddress?: string;
  timestamp: string;
}

export default function ActivityLog() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [errorText, setErrorText] = useState<string | null>(null);

  useEffect(() => {
    let unsubscribe = () => {};

    try {
      const db = getDb();
      const transactionsCollection = collection(db, 'transactions');
      const q = query(transactionsCollection, orderBy('timestamp', 'desc'), limit(10));

      unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const list: Transaction[] = snapshot.docs.map((doc) => {
            const data = doc.data();
            let formattedDate = '';
            
            if (data.timestamp instanceof Timestamp) {
              formattedDate = data.timestamp.toDate().toISOString();
            } else if (data.timestamp && typeof data.timestamp.toDate === 'function') {
              formattedDate = data.timestamp.toDate().toISOString();
            } else if (data.timestamp) {
              formattedDate = String(data.timestamp);
            } else {
              formattedDate = new Date().toISOString();
            }

            return {
              id: doc.id,
              hash: data.hash || '0x...',
              type: data.type || 'On-Chain Tx',
              assetTitle: data.assetTitle || 'Sovereign Asset',
              amount: data.amount || '0.00 ETH',
              fromAddress: data.fromAddress,
              toAddress: data.toAddress,
              timestamp: formattedDate,
            };
          });
          setTransactions(list);
          setLoading(false);
          setErrorText(null);
        },
        (error) => {
          console.warn('ActivityLog onSnapshot warning:', error);
          setErrorText(null);
          // Fallback to fetch via REST API
          fetch('/api/transactions')
            .then((res) => (res.ok ? res.json() : []))
            .then((data) => {
              if (Array.isArray(data) && data.length > 0) {
                setTransactions(data);
              }
            })
            .catch((err) => {
              console.warn('API fallback for transactions failed:', err);
            })
            .finally(() => {
              setLoading(false);
            });
        }
      );
    } catch (err) {
      console.error('Firestore init error:', err);
      setTimeout(() => {
        setErrorText('Could not establish secure database subscription.');
        setLoading(false);
      }, 0);
    }

    return () => unsubscribe();
  }, []);

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
    <Card className="bg-zinc-950/60 border border-zinc-900 shadow-2xl rounded-3xl overflow-hidden backdrop-blur-md">
      <div className="p-6 md:p-8 border-b border-zinc-900 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500"></span>
            </span>
            <h3 className="text-lg font-bold text-white tracking-tight uppercase">Real-Time Transactions Feed</h3>
          </div>
          <p className="text-xs text-zinc-500">Live ledger stream listening continuously under Zero Trust Architecture</p>
        </div>
      </div>

      {errorText && (
        <div className="mx-6 md:mx-8 mt-4 p-4 bg-red-950/20 border border-red-500/20 text-red-400 text-xs rounded-xl">
          ⚠️ {errorText}
        </div>
      )}

      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-950/80 border-b border-zinc-900">
                <th className="py-4.5 px-5 pl-6 md:pl-8 text-xs font-semibold uppercase tracking-wider text-zinc-400">Status &amp; Type</th>
                <th className="py-4.5 px-5 text-xs font-semibold uppercase tracking-wider text-zinc-400">Asset Context</th>
                <th className="py-4.5 px-5 text-xs font-semibold uppercase tracking-wider text-zinc-400">Tx Hash</th>
                <th className="py-4.5 px-5 text-xs font-semibold uppercase tracking-wider text-zinc-400">Ledger Value</th>
                <th className="py-4.5 px-5 pr-6 md:pr-8 text-xs font-semibold uppercase tracking-wider text-zinc-400 text-right">Age</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-900/60">
              <AnimatePresence mode="popLayout">
                {loading ? (
                  Array.from({ length: 5 }).map((_, idx) => (
                    <tr key={`skeleton-${idx}`} className="animate-pulse">
                      <td className="p-5 pl-6 md:pl-8 font-sans">
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
                    <td colSpan={5} className="p-12 text-center text-sm text-zinc-400">
                      <ShieldAlert className="w-8 h-8 text-zinc-500 mx-auto mb-3" />
                      No recent asset transactions found in the sovereign ledger.
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
                      className="hover:bg-zinc-900/40 transition group font-sans"
                    >
                      <td className="py-4.5 px-5 pl-6 md:pl-8 align-middle">
                        {getTypeBadge(tx.type)}
                      </td>

                      <td className="py-4.5 px-5 align-middle">
                        <div className="font-medium text-white group-hover:text-cyan-400 transition text-sm">
                          {tx.assetTitle}
                        </div>
                      </td>

                      <td className="py-4.5 px-5 align-middle font-mono text-xs text-zinc-400">
                        <div className="flex items-center gap-2">
                          <span>{tx.hash ? `${tx.hash.slice(0, 6)}...${tx.hash.slice(-4)}` : '0x...'}</span>
                          <button
                            onClick={() => copyToClipboard(tx.hash, tx.id)}
                            className="p-1 text-zinc-400 hover:text-zinc-200 rounded transition"
                            title="Copy transaction hash"
                          >
                            {copiedId === tx.id ? (
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                          {tx.hash && tx.hash !== '0x...' && (
                            <a 
                              href={`https://etherscan.io/tx/${tx.hash}`}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1 text-zinc-400 hover:text-cyan-400 rounded transition opacity-0 group-hover:opacity-100"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          )}
                        </div>
                      </td>

                      <td className="py-4.5 px-5 align-middle font-mono text-sm text-zinc-300">
                        {tx.amount === '0.00 ETH' ? (
                          <span className="text-xs text-zinc-400">Gas Only</span>
                        ) : (
                          <span className="text-zinc-100 font-semibold">{tx.amount}</span>
                        )}
                      </td>

                      <td className="py-4.5 px-5 pr-6 md:pr-8 text-right align-middle text-xs font-mono text-zinc-400">
                        <div className="flex items-center justify-end gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-zinc-500" />
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
  );
}
