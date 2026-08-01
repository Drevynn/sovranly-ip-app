import './globals.css';
import { Metadata, Viewport } from 'next';
import { FirebaseProvider } from '@/components/auth/FirebaseProvider';
import { LanguageProvider } from '@/components/LanguageProvider';
import { NotificationProvider } from '@/components/NotificationProvider';
import CookieComplianceBanner from '@/components/CookieComplianceBanner';

export const metadata: Metadata = {
  metadataBase: new URL('https://www.sovranlyip.com'),
  title: {
    default: 'Sovranly IP | Sovereign Intellectual Property & Automated Royalty Distribution',
    template: '%s | Sovranly IP',
  },
  description:
    'Sovereign control center for creators to manage intellectual property assets, configure secure license agreements, and automate real-time royalty distribution with Zero Trust security.',
  keywords: [
    'Sovranly IP',
    'intellectual property management',
    'blockchain IP licensing',
    'Zero Trust architecture',
    'creator rights',
    'royalty distribution',
    'automated licensing',
    'digital asset tokenization',
    'on-chain copyright notarization',
    'AI licensing protection',
  ],
  authors: [{ name: 'Sovranly IP Developer Network', url: 'https://www.sovranlyip.com' }],
  creator: 'Sovranly IP',
  publisher: 'Sovranly IP',
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
    url: 'https://www.sovranlyip.com',
    title: 'Sovranly IP | Sovereign Intellectual Property & Automated Royalty Distribution',
    description:
      'Sovereign control center for creators to manage intellectual property assets, configure secure license agreements, and automate real-time royalty distribution with Zero Trust security.',
    siteName: 'Sovranly IP',
    images: [
      {
        url: '/sovranly-logo-v2.png',
        width: 1024,
        height: 1024,
        alt: 'Sovranly IP - Sovereign Intellectual Property & Zero Trust Architecture',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sovranly IP | Sovereign Intellectual Property & Automated Royalty Distribution',
    description:
      'Sovereign control center for creators to manage intellectual property assets, configure secure license agreements, and automate real-time royalty distribution with Zero Trust security.',
    images: ['/sovranly-logo-v2.png'],
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

export const viewport: Viewport = {
  themeColor: '#09090b',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="antialiased bg-zinc-950 text-zinc-100 min-h-screen font-sans">
        <LanguageProvider>
          <FirebaseProvider>
            {children}
            <CookieComplianceBanner />
          </FirebaseProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}

