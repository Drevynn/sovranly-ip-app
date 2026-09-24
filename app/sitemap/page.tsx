import { Metadata } from 'next';
import SitemapContent from '@/components/SitemapContent';

export const metadata: Metadata = {
  title: 'Sitemap & Architecture Directory',
  description:
    'Explore the complete index of Sovranly IP routes, public zero-trust verification tools, creator licensing protocols, and machine-readable sitemap feeds.',
  keywords: [
    'Sovranly IP sitemap',
    'architecture directory',
    'zero trust verification routes',
    'creator licensing index',
    'blockchain IP notarization',
    'public registry index',
    'XML sitemap feed',
  ],
  alternates: {
    canonical: 'https://www.sovranlyip.com/sitemap',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://www.sovranlyip.com/sitemap',
    title: 'Sitemap & Architecture Directory | Sovranly IP',
    description:
      'Explore the complete index of Sovranly IP routes, public zero-trust verification tools, creator licensing protocols, and machine-readable sitemap feeds.',
    siteName: 'Sovranly IP',
    images: [
      {
        url: '/sovranly-logo-v2.png',
        width: 1024,
        height: 1024,
        alt: 'Sovranly IP Sitemap & Architecture Directory',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sitemap & Architecture Directory | Sovranly IP',
    description:
      'Explore the complete index of Sovranly IP routes, public zero-trust verification tools, creator licensing protocols, and machine-readable sitemap feeds.',
    images: ['/sovranly-logo-v2.png'],
  },
};

export default function SitemapPage() {
  return <SitemapContent />;
}
