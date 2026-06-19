import './globals.css';
import { Metadata, Viewport } from 'next';
import { FirebaseProvider } from '@/components/auth/FirebaseProvider';
import { LanguageProvider } from '@/components/LanguageProvider';
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'Sovranly IP',
  description: 'Sovereign IP Management System',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    title: 'Sovranly IP',
    statusBarStyle: 'black-translucent',
  },
  icons: {
    icon: '/sovranly-logo-v2.png',
    apple: '/sovranly-logo-v2.png',
  },
  other: {
    'google-adsense-account': 'ca-pub-1932505075277502',
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
    <html lang="en" className="dark">
      <head>
        <meta name="google-adsense-account" content="ca-pub-1932505075277502" />
        <Script
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1932505075277502"
          crossOrigin="anonymous"
          strategy="afterInteractive"
          id="google-adsense"
        />
      </head>
      <body className="antialiased bg-zinc-950 text-zinc-100 min-h-screen">
        <LanguageProvider>
          <FirebaseProvider>
            {children}
          </FirebaseProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
