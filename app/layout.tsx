import './globals.css';
import { Metadata, Viewport } from 'next';
import { FirebaseProvider } from '@/components/auth/FirebaseProvider';
import { LanguageProvider } from '@/components/LanguageProvider';
import { NotificationProvider } from '@/components/NotificationProvider';
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'Sovranly IP | Sovereign Intellectual Property & Automated Royalty Distribution',
  description: 'Sovereign control center for creators to manage intellectual property assets, configure secure license agreements, and automate real-time royalty distribution with Zero-Trust security.',
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
        <Script
          id="cookie-consent-ignore"
          data-cookieconsent="ignore"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag() {
                  dataLayer.push(arguments);
              }
              gtag("consent", "default", {
                  ad_personalization: "denied",
                  ad_storage: "denied",
                  ad_user_data: "denied",
                  analytics_storage: "denied",
                  functionality_storage: "denied",
                  personalization_storage: "denied",
                  security_storage: "granted",
                  wait_for_update: 500,
              });
              gtag("set", "ads_data_redaction", true);
              gtag("set", "url_passthrough", false);
            `,
          }}
        />
        {/* Cookiebot script temporarily disabled due to domain authorization error. 
            Please add sovranlyip.com to the domain group in the Cookiebot Manager to authorize the domain, 
            then uncomment this script. */}
        {/* <Script
          id="cookiebot-loader"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                var host = window.location.hostname;
                // Only load Cookiebot on the authorized production domain to prevent ugly "Domain not authorized" errors in development or preview/sandbox environments.
                if (host.includes('sovranlyip.com')) {
                  var s = document.createElement('script');
                  s.id = 'Cookiebot';
                  s.src = 'https://consent.cookiebot.com/uc.js';
                  s.setAttribute('data-cbid', 'cfbebce2-7f31-4955-8610-97a311edd2af');
                  s.setAttribute('data-blockingmode', 'auto');
                  s.type = 'text/javascript';
                  s.async = true;
                  document.head.appendChild(s);
                }
              })();
            `,
          }}
        /> */}
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

