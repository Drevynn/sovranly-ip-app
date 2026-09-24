import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Application Sitemap & Directory | Sovranly IP',
  description: 'Explore the complete directory of Sovranly IP pages, creator tools, IP verification registry, legal policies, documentation, and machine-readable feeds.',
  openGraph: {
    title: 'Application Sitemap & Directory | Sovranly IP',
    description: 'Complete architecture index of all public nodes, creator tools, IP verification registry, legal policies, and machine feeds on Sovranly IP.',
    url: 'https://www.sovranlyip.com/sitemap',
    siteName: 'Sovranly IP',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Application Sitemap & Directory | Sovranly IP',
    description: 'Complete architecture index of all public nodes, creator tools, and IP verification registry on Sovranly IP.',
  },
};

export default function SitemapLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
