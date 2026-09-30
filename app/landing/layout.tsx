import { Metadata } from 'next';
import { landingMetadata } from '@/app/metadata';

export const metadata: Metadata = {
  ...landingMetadata,
  title: 'Sovranly IP | Decentralized IP Licensing Platform',
  alternates: {
    canonical: '/landing',
  },
};

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
