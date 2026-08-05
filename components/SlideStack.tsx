'use client';

import React from 'react';
import { Presentation, FileText, CheckCircle, ExternalLink } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function SlideStack() {
  return (
    <div className="w-full space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <Presentation className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Google Workspace Integration</h3>
            <p className="text-xs text-zinc-400">Export verified certificates & pitch decks directly to Google Slides</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-cyan-500/20 bg-zinc-950/80 hover:border-cyan-500/40 transition-all">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-cyan-300 flex items-center gap-2">
              <FileText className="w-4 h-4 text-cyan-400" />
              Ownership Slide Deck
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-xs text-zinc-400">
            <p>Generates a multi-slide presentation containing cryptographic SHA-256 hashes, metadata, and license terms.</p>
            <div className="flex items-center gap-2 text-cyan-400 font-medium">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Ready for Google Slides</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-cyan-500/20 bg-zinc-950/80 hover:border-cyan-500/40 transition-all">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-cyan-300 flex items-center gap-2">
              <Presentation className="w-4 h-4 text-cyan-400" />
              Royalty Proposal Deck
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-xs text-zinc-400">
            <p>Export commercial 85/15 revenue sharing breakdown slides formatted for enterprise client review.</p>
            <div className="flex items-center gap-2 text-cyan-400 font-medium">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Formatted Pitch Format</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-cyan-500/20 bg-zinc-950/80 hover:border-cyan-500/40 transition-all">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-cyan-300 flex items-center gap-2">
              <ExternalLink className="w-4 h-4 text-cyan-400" />
              USPTO Class 42 Audit Deck
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-xs text-zinc-400">
            <p>Complies with TESS database procedures and USPTO Class 42 trademark registration standards.</p>
            <div className="flex items-center gap-2 text-cyan-400 font-medium">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Audit Proof Included</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
