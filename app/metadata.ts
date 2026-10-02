import type { Metadata } from 'next';

/**
 * Safely parse a URL string, returning a fallback URL if the string is invalid.
 */
function resolveSafeUrl(rawUrl: string | undefined, fallback: string): URL {
  if (rawUrl && typeof rawUrl === 'string') {
    const trimmed = rawUrl.trim();
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
      try {
        return new URL(trimmed);
      } catch {
        // invalid URL, proceed to fallback
      }
    }
  }
  return new URL(fallback);
}

const safeSiteUrlObj = resolveSafeUrl(process.env.NEXT_PUBLIC_SITE_URL, 'https://www.sovranlyip.com');
const siteUrl = safeSiteUrlObj.origin;

/**
 * Metadata configuration for Sovranly IP landing page,
 * highly optimized for "decentralized IP licensing", OpenGraph tags, and Twitter cards.
 */
export const landingMetadata: Metadata = {
  metadataBase: safeSiteUrlObj,
  applicationName: 'Sovranly IP',
  title: {
    default: 'Sovranly IP | Decentralized IP Licensing & Sovereign Royalty Automation',
    template: '%s | Sovranly IP',
  },
  description:
    'Decentralized IP licensing platform empowering creators with Zero Trust protection, smart contract agreements, and automated real-time royalty distribution.',
  keywords: [
    'decentralized IP licensing',
    'blockchain IP licensing',
    'decentralized intellectual property',
    'smart contract license agreements',
    'Zero Trust IP security',
    'automated royalty distribution',
    'creator rights protection',
    'on-chain copyright notarization',
    'non-custodial digital licensing',
    'Web3 intellectual property protocol',
    'Sovranly IP',
  ],
  authors: [{ name: 'Sovranly IP Developer Network', url: siteUrl }],
  creator: 'Sovranly IP',
  publisher: 'Sovranly IP',
  category: 'technology',
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    title: 'Sovranly IP | Decentralized IP Licensing & Sovereign Royalty Automation',
    description:
      'Decentralized IP licensing platform empowering creators with Zero Trust protection, smart contract agreements, and automated real-time royalty distribution.',
    siteName: 'Sovranly IP',
    images: [
      {
        url: '/sovranly-logo-v2.png',
        width: 1200,
        height: 630,
        alt: 'Sovranly IP - Decentralized IP Licensing & Sovereign Royalty Distribution',
      },
      {
        url: '/sovranly-shield-hero.jpg',
        width: 1200,
        height: 630,
        alt: 'Sovranly IP Sovereign Zero Trust Ecosystem',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sovranly IP | Decentralized IP Licensing & Sovereign Royalty Automation',
    description:
      'Decentralized IP licensing platform empowering creators with Zero Trust protection, smart contract agreements, and automated real-time royalty distribution.',
    images: ['/sovranly-logo-v2.png'],
    site: '@sovranlyip',
    creator: '@sovranlyip',
  },
  icons: {
    icon: '/sovranly-logo-v2.png',
    shortcut: '/sovranly-logo-v2.png',
    apple: '/sovranly-logo-v2.png',
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || '',
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    title: 'Sovranly IP',
    statusBarStyle: 'black-translucent',
  },
};

/**
 * Re-export under siteMetadata for convenience
 */
export const siteMetadata: Metadata = landingMetadata;

/**
 * Structured Schema.org JSON-LD data for SEO search snippet enhancement
 */
export const landingJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Sovranly IP',
  url: siteUrl,
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'All',
  description:
    'Decentralized IP licensing platform empowering creators with Zero Trust protection, smart contract agreements, and automated real-time royalty distribution.',
  featureList: [
    'Decentralized IP licensing',
    'Smart contract license configuration',
    'Automated real-time royalty distribution',
    'Zero Trust cryptographic asset authentication',
    'Non-custodial smart wallet integration',
    'On-chain copyright notarization',
  ],
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
  creator: {
    '@type': 'Organization',
    name: 'Sovranly IP',
    url: siteUrl,
    logo: `${siteUrl}/sovranly-logo-v2.png`,
    sameAs: ['https://twitter.com/sovranlyip'],
  },
};
