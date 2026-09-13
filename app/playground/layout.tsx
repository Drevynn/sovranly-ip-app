import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Interactive API Playground | Sovranly IP Developer Network',
  description: 'Test authenticated POST and GET requests to Sovranly IP endpoints with real-time JSON response formatting, latency measurement, and live zero-trust perimeter testing.',
  openGraph: {
    title: 'Interactive API Playground | Sovranly IP',
    description: 'Execute live requests against Sovranly IP catalog, royalty settlement, instant sync clearance, and cryptographic verification routes.',
    url: 'https://www.sovranlyip.com/playground',
    siteName: 'Sovranly IP',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sovranly IP Interactive API Playground',
    description: 'Real-time REST API test runner with live JSON response formatting and zero-trust authentication.',
  }
};

export default function PlaygroundLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
