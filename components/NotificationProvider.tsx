'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Coins, 
  Clock, 
  Tag, 
  X, 
  Bell, 
  Check, 
  CheckCircle2, 
  AlertTriangle,
  Flame,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '@/components/auth/FirebaseProvider';
import { getDb } from '@/lib/firebase';
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  serverTimestamp,
  writeBatch,
  getDocs,
  Timestamp
} from 'firebase/firestore';

export type NotificationType = 'royalty' | 'license_expiry' | 'offer';

export interface NotificationItem {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  description: string;
  read: boolean;
  createdAt: any; // Date, string, or Firestore Timestamp
  details?: string;
}

export interface ToastMessage {
  id: string;
  type: NotificationType;
  title: string;
  description: string;
}

interface NotificationContextType {
  notifications: NotificationItem[];
  unreadCount: number;
  addNotification: (type: NotificationType, title: string, description: string, details?: string) => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
  clearAll: () => Promise<void>;
  triggerSimulationEvent: (type: NotificationType) => Promise<void>;
  toasts: ToastMessage[];
  removeToast: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType>({
  notifications: [],
  unreadCount: 0,
  addNotification: async () => {},
  markAsRead: async () => {},
  markAllAsRead: async () => {},
  deleteNotification: async () => {},
  clearAll: async () => {},
  triggerSimulationEvent: async () => {},
  toasts: [],
  removeToast: () => {},
});

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const { user, isSandboxMode } = useAuth();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Sync notifications: Firestore or LocalStorage fallback
  useEffect(() => {
    if (!isClient) return;

    // Fallback/Sandbox state loader
    const loadLocalNotifications = () => {
      const stored = localStorage.getItem('sovranly_notifications');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setNotifications(parsed);
        } catch (e) {
          console.error("Failed to parse local notifications", e);
        }
      } else {
        // Pre-seed some beautiful default notifications if empty to make the dashboard look populated
        const defaultSeeds: NotificationItem[] = [
          {
            id: 'seed-1',
            userId: user?.uid || 'guest',
            type: 'royalty',
            title: 'Royalty Payment Dispatched',
            description: 'Automated escrow split released 0.085 ETH for the "Celestial Beats" Audio Pack licensing transaction.',
            read: false,
            createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 mins ago
            details: '{"txHash":"0x8f2d...4c1a", "amount":"0.085 ETH"}'
          },
          {
            id: 'seed-2',
            userId: user?.uid || 'guest',
            type: 'license_expiry',
            title: 'License Expiring Soon',
            description: 'The exclusive 1-year commercial distribution license for "Decentralized Canvas" will expire in 14 days.',
            read: false,
            createdAt: new Date(Date.now() - 3 * 3600 * 1000).toISOString(), // 3 hours ago
            details: '{"daysLeft":14, "licenseId":"lic_dc_992"}'
          },
          {
            id: 'seed-3',
            userId: user?.uid || 'guest',
            type: 'offer',
            title: 'New Marketplace Offer Recieved',
            description: 'A sovereign creator submitted an offer of 0.45 ETH to acquire sync usage rights for "Vaporwave Retro".',
            read: true,
            createdAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(), // 1 day ago
            details: '{"offerAmount":"0.45 ETH", "offerer":"0x71C...476B"}'
          }
        ];
        localStorage.setItem('sovranly_notifications', JSON.stringify(defaultSeeds));
        setNotifications(defaultSeeds);
      }
    };

    // If no real user is signed in, or we are in Sandbox Mode, use localStorage
    if (!user || isSandboxMode) {
      loadLocalNotifications();
      return;
    }

    // Real Firebase user sync
    try {
      const db = getDb();
      const notificationsCol = collection(db, 'notifications');
      const q = query(
        notificationsCol, 
        where('userId', '==', user.uid), 
        orderBy('createdAt', 'desc')
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const list: NotificationItem[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          let createdAtVal = data.createdAt;
          if (createdAtVal instanceof Timestamp) {
            createdAtVal = createdAtVal.toDate().toISOString();
          } else if (createdAtVal && typeof createdAtVal.toDate === 'function') {
            createdAtVal = createdAtVal.toDate().toISOString();
          } else if (!createdAtVal) {
            createdAtVal = new Date().toISOString();
          }

          list.push({
            id: docSnap.id,
            userId: data.userId,
            type: data.type,
            title: data.title,
            description: data.description,
            read: data.read ?? false,
            createdAt: createdAtVal,
            details: data.details
          });
        });

        // Trigger toast only for notifications added AFTER the snapshot listener was established
        // Let's compare with our existing state to see if there is any brand new unread notification
        setNotifications(prev => {
          if (prev.length > 0 && list.length > prev.length) {
            // Find items in 'list' that are NOT in 'prev'
            const prevIds = new Set(prev.map(p => p.id));
            const newItems = list.filter(item => !prevIds.has(item.id) && !item.read);
            
            // Push toasts for them
            newItems.forEach(item => {
              triggerToast(item.type, item.title, item.description);
            });
          }
          return list;
        });
      }, (error) => {
        console.warn("Firestore notification snapshot failed. Using localStorage fallback.", error);
        loadLocalNotifications();
      });

      return () => unsubscribe();
    } catch (err) {
      console.warn("Notification Firestore connection error. Falling back to local state.", err);
      loadLocalNotifications();
    }
  }, [user, isSandboxMode, isClient]);

  // Helper to trigger a toast message
  const triggerToast = (type: NotificationType, title: string, description: string) => {
    const id = 'toast-' + Math.random().toString(36).slice(2, 9);
    setToasts(prev => [...prev, { id, type, title, description }]);
    
    // Auto remove toast after 5 seconds
    setTimeout(() => {
      removeToast(id);
    }, 5000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Add a new notification
  const addNotification = async (type: NotificationType, title: string, description: string, details?: string) => {
    const targetUserId = user?.uid || 'guest';
    const cleanDetails = details || "";

    // Sync to state and localStorage if in sandbox or offline
    const triggerLocalSave = (newNotification: NotificationItem) => {
      setNotifications(prev => {
        const updated = [newNotification, ...prev];
        localStorage.setItem('sovranly_notifications', JSON.stringify(updated));
        return updated;
      });
      triggerToast(type, title, description);
    };

    if (!user || isSandboxMode) {
      const mockId = 'local-' + Math.random().toString(36).slice(2, 9);
      const newNotification: NotificationItem = {
        id: mockId,
        userId: targetUserId,
        type,
        title,
        description,
        read: false,
        createdAt: new Date().toISOString(),
        details: cleanDetails
      };
      triggerLocalSave(newNotification);
      return;
    }

    // Try Firestore
    try {
      const db = getDb();
      const notificationsCol = collection(db, 'notifications');
      await addDoc(notificationsCol, {
        userId: targetUserId,
        type,
        title,
        description,
        read: false,
        createdAt: serverTimestamp(),
        details: cleanDetails
      });
      // Firestore subscription automatically triggers toast and list updates!
    } catch (err) {
      console.warn("Failed to write notification to Firestore, falling back locally", err);
      const mockId = 'local-' + Math.random().toString(36).slice(2, 9);
      const newNotification: NotificationItem = {
        id: mockId,
        userId: targetUserId,
        type,
        title,
        description,
        read: false,
        createdAt: new Date().toISOString(),
        details: cleanDetails
      };
      triggerLocalSave(newNotification);
    }
  };

  // Mark as read
  const markAsRead = async (id: string) => {
    if (!user || isSandboxMode || id.startsWith('local-') || id.startsWith('seed-')) {
      // Local state modification
      setNotifications(prev => {
        const updated = prev.map(n => n.id === id ? { ...n, read: true } : n);
        localStorage.setItem('sovranly_notifications', JSON.stringify(updated));
        return updated;
      });
      return;
    }

    try {
      const db = getDb();
      const docRef = doc(db, 'notifications', id);
      await updateDoc(docRef, { read: true });
    } catch (err) {
      console.warn("Failed to update notification read state in Firestore, applying locally", err);
      setNotifications(prev => {
        const updated = prev.map(n => n.id === id ? { ...n, read: true } : n);
        localStorage.setItem('sovranly_notifications', JSON.stringify(updated));
        return updated;
      });
    }
  };

  // Mark all as read
  const markAllAsRead = async () => {
    const unreadNotifications = notifications.filter(n => !n.read);
    if (unreadNotifications.length === 0) return;

    if (!user || isSandboxMode) {
      setNotifications(prev => {
        const updated = prev.map(n => ({ ...n, read: true }));
        localStorage.setItem('sovranly_notifications', JSON.stringify(updated));
        return updated;
      });
      return;
    }

    try {
      const db = getDb();
      // Perform batch update for speed
      const batch = writeBatch(db);
      unreadNotifications.forEach(n => {
        // Skip seeds/locals if any managed to persist
        if (!n.id.startsWith('local-') && !n.id.startsWith('seed-')) {
          const docRef = doc(db, 'notifications', n.id);
          batch.update(docRef, { read: true });
        }
      });
      await batch.commit();
    } catch (err) {
      console.warn("Failed to batch update notifications in Firestore, applying locally", err);
      setNotifications(prev => {
        const updated = prev.map(n => ({ ...n, read: true }));
        localStorage.setItem('sovranly_notifications', JSON.stringify(updated));
        return updated;
      });
    }
  };

  // Delete notification
  const deleteNotification = async (id: string) => {
    if (!user || isSandboxMode || id.startsWith('local-') || id.startsWith('seed-')) {
      setNotifications(prev => {
        const updated = prev.filter(n => n.id !== id);
        localStorage.setItem('sovranly_notifications', JSON.stringify(updated));
        return updated;
      });
      return;
    }

    try {
      const db = getDb();
      const docRef = doc(db, 'notifications', id);
      await deleteDoc(docRef);
    } catch (err) {
      console.warn("Failed to delete notification in Firestore, applying locally", err);
      setNotifications(prev => {
        const updated = prev.filter(n => n.id !== id);
        localStorage.setItem('sovranly_notifications', JSON.stringify(updated));
        return updated;
      });
    }
  };

  // Clear all notifications
  const clearAll = async () => {
    if (notifications.length === 0) return;

    if (!user || isSandboxMode) {
      setNotifications([]);
      localStorage.setItem('sovranly_notifications', JSON.stringify([]));
      return;
    }

    try {
      const db = getDb();
      const batch = writeBatch(db);
      notifications.forEach(n => {
        if (!n.id.startsWith('local-') && !n.id.startsWith('seed-')) {
          const docRef = doc(db, 'notifications', n.id);
          batch.delete(docRef);
        }
      });
      await batch.commit();
      setNotifications([]);
      localStorage.setItem('sovranly_notifications', JSON.stringify([]));
    } catch (err) {
      console.warn("Failed to batch delete notifications in Firestore, applying locally", err);
      setNotifications([]);
      localStorage.setItem('sovranly_notifications', JSON.stringify([]));
    }
  };

  // Trigger one of our 3 core notification event simulations
  const triggerSimulationEvent = async (type: NotificationType) => {
    const randId = Math.floor(100 + Math.random() * 900);
    const mockTxHash = '0x' + Math.random().toString(16).slice(2, 10) + '...' + Math.random().toString(16).slice(2, 10);

    if (type === 'royalty') {
      const randEth = (0.05 + Math.random() * 0.3).toFixed(3);
      await addNotification(
        'royalty',
        'Royalty Earnings Claimed',
        `Sovereign split ledger verified payment of ${randEth} ETH from automatic marketplace streaming licenses.`,
        JSON.stringify({ amount: `${randEth} ETH`, txHash: mockTxHash })
      );
    } else if (type === 'license_expiry') {
      const days = [3, 7, 14][Math.floor(Math.random() * 3)];
      const assets = ["Aether Synthesizer", "Vaporwave Retro", "Cybernetic Horizon", "Neon Nexus"];
      const assetName = assets[Math.floor(Math.random() * assets.length)];
      await addNotification(
        'license_expiry',
        'License Nearing Expiry Warning',
        `Standard commercial distribution agreement for "${assetName}" is scheduled to expire in exactly ${days} days.`,
        JSON.stringify({ daysLeft: days, assetTitle: assetName })
      );
    } else if (type === 'offer') {
      const randOffer = (0.2 + Math.random() * 0.8).toFixed(2);
      const assets = ["Retro Synth Wave", "Pixel Cyberpunk NFT", "Aether Drum Loop", "Solana Smart Contract Core"];
      const assetName = assets[Math.floor(Math.random() * assets.length)];
      await addNotification(
        'offer',
        'New Marketplace Offer Received',
        `A decentralized buyer offered ${randOffer} ETH for sync licensing rights on your IP Asset: "${assetName}".`,
        JSON.stringify({ offerAmount: `${randOffer} ETH`, assetTitle: assetName, offerer: '0x' + Math.random().toString(16).slice(2, 10).toUpperCase() })
      );
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  // Render Lucide Icon matching Toast Type
  const getToastIcon = (type: NotificationType) => {
    switch (type) {
      case 'royalty':
        return <Coins className="w-5 h-5 text-emerald-400" />;
      case 'license_expiry':
        return <AlertTriangle className="w-5 h-5 text-amber-400" />;
      case 'offer':
        return <Tag className="w-5 h-5 text-purple-400" />;
    }
  };

  // Border theme based on Toast Type
  const getToastBorderTheme = (type: NotificationType) => {
    switch (type) {
      case 'royalty':
        return 'border-emerald-500/25 shadow-emerald-950/20';
      case 'license_expiry':
        return 'border-amber-500/25 shadow-amber-950/20';
      case 'offer':
        return 'border-purple-500/25 shadow-purple-950/20';
    }
  };

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      addNotification,
      markAsRead,
      markAllAsRead,
      deleteNotification,
      clearAll,
      triggerSimulationEvent,
      toasts,
      removeToast
    }}>
      {children}

      {/* Floating Animated Toast Container */}
      <div className="fixed top-6 right-6 z-50 flex flex-col gap-3 pointer-events-none w-80 sm:w-[400px]">
        <AnimatePresence mode="popLayout">
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              layout
              initial={{ opacity: 0, x: 80, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 80, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 350, damping: 25 }}
              className={`pointer-events-auto bg-[#0a0a0d]/95 border backdrop-blur-md rounded-2xl shadow-2xl p-4 flex gap-3 text-left relative overflow-hidden group ${getToastBorderTheme(toast.type)}`}
              id={`toast-msg-${toast.id}`}
            >
              {/* Type Left Indicator Glow */}
              <div className={`absolute left-0 top-0 bottom-0 w-1 ${
                toast.type === 'royalty' ? 'bg-emerald-500' :
                toast.type === 'license_expiry' ? 'bg-amber-500' : 'bg-purple-500'
              }`} />

              <div className="flex-shrink-0 pt-0.5">
                {getToastIcon(toast.type)}
              </div>

              <div className="flex-grow space-y-1 pr-4">
                <h4 className="text-xs font-bold text-white uppercase tracking-tight font-sans">
                  {toast.title}
                </h4>
                <p className="text-[11px] text-zinc-400 font-sans leading-relaxed">
                  {toast.description}
                </p>
              </div>

              <button
                onClick={() => removeToast(toast.id)}
                className="absolute top-3 right-3 text-zinc-500 hover:text-white transition cursor-pointer"
                title="Dismiss alert"
              >
                <X className="w-3.5 h-3.5" />
              </button>

              {/* Toast Auto-progress bar */}
              <div className="absolute bottom-0 left-1 right-1 h-0.5 bg-zinc-900 overflow-hidden rounded-full">
                <motion.div 
                  initial={{ width: "100%" }}
                  animate={{ width: "0%" }}
                  transition={{ duration: 5, ease: "linear" }}
                  className={`h-full ${
                    toast.type === 'royalty' ? 'bg-emerald-500' :
                    toast.type === 'license_expiry' ? 'bg-amber-500' : 'bg-purple-500'
                  }`}
                />
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </NotificationContext.Provider>
  );
}

export const useNotification = () => useContext(NotificationContext);
