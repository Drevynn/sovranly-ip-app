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
        <Script
          id="CookieDeclaration"
          src="https://consent.cookiebot.com/cfbebce2-7f31-4955-8610-97a311edd2af/cd.js"
          strategy="afterInteractive"
        />
        <Script
          id="Cookiebot"
          src="https://consent.cookiebot.com/uc.js"
          data-cbid="cfbebce2-7f31-4955-8610-97a311edd2af"
          data-blockingmode="auto"
          strategy="afterInteractive"
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

