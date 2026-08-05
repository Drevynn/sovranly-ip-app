'use client';

import React from 'react';
import { ShieldCheck, Lock, Database, FileText } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function AppOverviewShowcase() {
  const features = [
    {
      icon: ShieldCheck,
      title: "Zero Trust Architecture",
      desc: "Every API request, smart contract call, and metadata access is continuously verified and authenticated."
    },
    {
      icon: Lock,
      title: "Immutable On-Chain Minting",
      desc: "Cryptographic SHA-256 asset hashes are stored permanently on decentralized ledgers."
    },
    {
      icon: Database,
      title: "Automated Royalty Compacts",
      desc: "Instant 85/15 creator and platform revenue distribution executed upon license purchases."
    },
    {
      icon: FileText,
      title: "USPTO Class 42 Compliance",
      desc: "Built-in guidance for TESS database procedures and Volunteer Lawyers for the Arts (VLA) resources."
    }
  ];

  return (
    <div className="w-full space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-2xl font-bold text-white">Sovranly IP Capabilities</h3>
        <p className="text-xs text-zinc-400 max-w-xl mx-auto">Engineered for creators, developers, and enterprise IP managers demanding uncompromised security.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {features.map((feat, idx) => {
          const Icon = feat.icon;
          return (
            <Card key={idx} className="border-zinc-800 bg-zinc-950/80 hover:border-cyan-500/40 transition-all group">
              <CardHeader className="p-5 pb-2">
                <div className="p-2.5 w-fit rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 group-hover:scale-110 transition-transform">
                  <Icon className="w-5 h-5" />
                </div>
                <CardTitle className="text-sm font-bold text-white mt-3">{feat.title}</CardTitle>
              </CardHeader>
              <CardContent className="p-5 pt-0 text-xs text-zinc-400 leading-relaxed">
                {feat.desc}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
