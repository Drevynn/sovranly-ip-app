import './globals.css';
import { Viewport } from 'next';
import Script from 'next/script';
import { FirebaseProvider } from '@/components/auth/FirebaseProvider';
import { NotificationProvider } from '@/components/NotificationProvider';
import { ThemeProvider } from '@/components/ThemeProvider';
import CookieComplianceBanner from '@/components/CookieComplianceBanner';
import { landingMetadata, landingJsonLd } from './metadata';

export const metadata = landingMetadata;

export const viewport: Viewport = {
  themeColor: '#09090b',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        {/* Schema.org Structured Data for Decentralized IP Licensing */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(landingJsonLd),
          }}
        />
        {/* Mailchimp Connected Site Script */}
        <script
          id="mcjs"
          dangerouslySetInnerHTML={{
            __html: `!function(c,h,i,m,p){m=c.createElement(h),p=c.getElementsByTagName(h)[0],m.async=1,m.src=i,p.parentNode.insertBefore(m,p)}(document,"script","https://chimpstatic.com/mcjs-connected/js/users/3750e7ebac722f4741572b763/a210f51fac2488c5767bb4104.js");`,
          }}
        />
      </head>
      <body className="antialiased bg-zinc-950 text-zinc-100 min-h-screen font-sans" suppressHydrationWarning>
        {/* Google Analytics Tracking Tag */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-ZGGTSS0QFN"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-ZGGTSS0QFN');
          `}
        </Script>
        <ThemeProvider>
          <FirebaseProvider>
            <NotificationProvider>
              {children}
              <CookieComplianceBanner />
            </NotificationProvider>
          </FirebaseProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
