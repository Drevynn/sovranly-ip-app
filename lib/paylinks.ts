/**
 * Sovranly IP - Universal Pay Link Management
 * Zero Trust sovereign creator payment links and storefront products.
 */

export interface PayLinkProduct {
  id: string;
  name: string;
  description: string;
  price: number; // in dollars
  unitAmount: number; // in cents
  currency: string;
  payUrl: string; // Direct checkout or pay link URL
  category: 'master' | 'sync' | 'subscription' | 'nft' | 'merch';
  active: boolean;
  createdAt: string;
  accountId?: string;
}

export const DEFAULT_PAY_LINKS: PayLinkProduct[] = [
  {
    id: 'paylink_master_01',
    name: 'Exclusive Master Recording Sync License',
    description: 'Full commercial synchronization license for streaming, broadcast, and digital media with on-chain cryptographic certificate.',
    price: 49,
    unitAmount: 4900,
    currency: 'usd',
    payUrl: 'https://pay.sovranlyip.com/master-license-01',
    category: 'master',
    active: true,
    createdAt: '2026-09-01T00:00:00.000Z'
  },
  {
    id: 'paylink_sync_02',
    name: 'Global Advertising & Film Rights Package',
    description: 'Worldwide theatrical, OTT, and commercial broadcast rights with automated 85/15 smart contract royalty splitting.',
    price: 199,
    unitAmount: 19900,
    currency: 'usd',
    payUrl: 'https://pay.sovranlyip.com/advertising-sync-02',
    category: 'sync',
    active: true,
    createdAt: '2026-09-02T00:00:00.000Z'
  },
  {
    id: 'paylink_sub_03',
    name: 'Sovereign Creator VIP Membership Retainer',
    description: 'Monthly unlimited access to new catalogue stems, raw unmastered multitracks, and priority direct sync clearance.',
    price: 29,
    unitAmount: 2900,
    currency: 'usd',
    payUrl: 'https://pay.sovranlyip.com/vip-creator-retainer-03',
    category: 'subscription',
    active: true,
    createdAt: '2026-09-03T00:00:00.000Z'
  }
];

export const STORAGE_KEY_PAY_LINKS = 'sovranly_creator_pay_links';
export const STORAGE_KEY_CREATOR_ACCOUNT = 'sovranly_creator_account_id';

export function getStoredPayLinks(): PayLinkProduct[] {
  if (typeof window === 'undefined') return DEFAULT_PAY_LINKS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PAY_LINKS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_PAY_LINKS, JSON.stringify(DEFAULT_PAY_LINKS));
      return DEFAULT_PAY_LINKS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_PAY_LINKS;
  } catch {
    return DEFAULT_PAY_LINKS;
  }
}

export function savePayLinks(links: PayLinkProduct[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_PAY_LINKS, JSON.stringify(links));
  } catch (err) {
    console.error('Failed to save pay links to localStorage', err);
  }
}
