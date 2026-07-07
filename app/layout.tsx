import './globals.css';
import { Metadata, Viewport } from 'next';
import { FirebaseProvider } from '@/components/auth/FirebaseProvider';
import { LanguageProvider } from '@/components/LanguageProvider';
import { NotificationProvider } from '@/components/NotificationProvider';
import CookieComplianceBanner from '@/components/CookieComplianceBanner';

export const metadata: Metadata = {
  title: 'Sovranly IP | Sovereign Intellectual Property & Automated Royalty Distribution',
  description: 'Sovereign control center for creators to manage intellectual property assets, configure secure license agreements, and automate real-time royalty distribution with Zero-Trust security.',
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
    <html lang="en" className="dark">
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

