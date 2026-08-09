'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { ShieldAlert, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error securely for telemetry & developer review
    console.error('Unhandled application exception captured by root boundary:', error);
  }, [error]);

  return (
    <div className="min-h-screen w-full bg-[#030712] text-zinc-100 flex flex-col items-center justify-center p-6 md:p-12 font-sans selection:bg-zinc-800">
      {/* Decorative zero-trust ambient elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(63,63,70,0.05)_0%,transparent_70%)] pointer-events-none" />
      
      <div className="relative w-full max-w-xl bg-[#090d16] border border-zinc-800/80 rounded-2xl p-8 md:p-10 shadow-2xl backdrop-blur-md">
        {/* Security Shield Header */}
        <div className="flex items-center justify-center w-16 h-16 rounded-xl bg-red-950/40 border border-red-800/40 text-red-400 mb-8 mx-auto">
          <ShieldAlert className="w-8 h-8 animate-pulse" />
        </div>

        {/* Header Text */}
        <div className="text-center space-y-3 mb-8">
          <h1 className="text-2xl font-semibold tracking-tight text-white md:text-3xl">
            System Fault Intercepted
          </h1>
          <p className="text-zinc-400 text-sm max-w-md mx-auto leading-relaxed">
            The Zero Trust Security layer of <span className="text-zinc-200 font-medium">Sovranly IP</span> has captured an unhandled runtime exception. Session integrity has been isolated to protect active credentials.
          </p>
        </div>

        {/* Technical Diagnostics */}
        <div className="bg-[#030712] border border-zinc-900 rounded-xl p-5 mb-8 text-left font-mono text-xs text-zinc-500 overflow-hidden relative">
          <div className="flex items-center justify-between mb-2 text-zinc-400 pb-2 border-b border-zinc-900/50">
            <span>DIAGNOSTIC STATUS</span>
            <span className="text-red-400 font-semibold uppercase">ERR_SECURE_ISOLATE</span>
          </div>
          <div className="space-y-1.5 break-words">
            <p>
              <span className="text-zinc-600">ID:</span> {error.digest || 'N/A_SYSTEM_DEFAULT'}
            </p>
            <p>
              <span className="text-zinc-600">MSG:</span> {error.message || 'An unexpected fault occurred.'}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Button
            onClick={() => reset()}
            className="w-full sm:flex-1 bg-zinc-100 text-zinc-900 hover:bg-zinc-200 transition-colors font-medium py-6 rounded-xl flex items-center justify-center gap-2 border border-transparent shadow-md"
          >
            <RefreshCw className="w-4 h-4" />
            Retry Transaction
          </Button>
          
          <Link href="/" className="w-full sm:flex-1">
            <Button
              variant="outline"
              className="w-full border-zinc-800 text-zinc-300 hover:bg-zinc-900 hover:text-white transition-all font-medium py-6 rounded-xl flex items-center justify-center gap-2"
            >
              <Home className="w-4 h-4" />
              Home Console
            </Button>
          </Link>
        </div>
      </div>

      {/* Humble Footer */}
      <div className="mt-8 text-zinc-600 font-mono text-[10px] tracking-widest uppercase">
        Sovranly IP • Cryptographic Core
      </div>
    </div>
  );
}
