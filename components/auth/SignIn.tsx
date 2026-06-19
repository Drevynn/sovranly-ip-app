'use client';

import { useAuth } from './FirebaseProvider';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ShieldCheck, Sparkles } from 'lucide-react';
import Image from 'next/image';

export function SignIn() {
  const { signInWithGoogle, signInWithSandbox } = useAuth();
  const [error, setError] = useState('');
  const [authenticating, setAuthenticating] = useState(false);

  const handleGoogleSignIn = async () => {
    setError('');
    setAuthenticating(true);
    try {
      await signInWithGoogle();
    } catch (e: any) {
      console.error('Sign-in error:', e);
      // Construct a very helpful message about iframe cookie limits
      setError(
        e.message || 'Authentication sequence failed. Check browser security filters.'
      );
    } finally {
      setAuthenticating(false);
    }
  };

  const handleSandboxSignIn = async () => {
    setError('');
    setAuthenticating(true);
    try {
      await signInWithSandbox();
    } catch (e: any) {
      setError(e.message || 'Sandbox mode activation failed.');
    } finally {
      setAuthenticating(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[70vh] px-4">
      <Card className="w-full max-w-md bg-zinc-950 border border-zinc-900 rounded-3xl p-4 md:p-6 shadow-2xl shadow-cyan-950/20 relative overflow-hidden">
        <div className="absolute -top-12 -left-12 w-48 h-48 bg-cyan-500/5 rounded-full blur-[60px] pointer-events-none" />
        <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-violet-500/5 rounded-full blur-[60px] pointer-events-none" />
        
        <CardHeader className="text-center space-y-6 pb-2">
          <div className="mx-auto relative w-28 h-28">
            <Image 
              src="/sovranly-logo-v2.png" 
              alt="Sovranly Crest" 
              fill 
              className="object-contain"
              priority
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-zinc-900 border border-zinc-800 rounded-full text-[10px] text-cyan-400 uppercase tracking-widest mx-auto">
              <ShieldCheck className="w-3 h-3 text-cyan-400" />
              <span>Identity Layer Verified</span>
            </div>
            <CardTitle className="text-3xl font-extrabold tracking-tighter text-white uppercase sm:text-4xl">
              SECURE LOG IN
            </CardTitle>
            <CardDescription className="text-zinc-500 text-sm max-w-[280px] mx-auto leading-relaxed">
              Verify your digital sovereignty and enter the Sovranly IP Command Center.
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-6 pt-4">
          <div className="bg-zinc-900/50 rounded-2xl p-4 border border-zinc-900 space-y-3">
            <div className="flex items-start gap-3">
              <Sparkles className="w-4 h-4 text-violet-400 mt-1 shrink-0" />
              <div className="text-left text-xs text-zinc-400 leading-relaxed">
                <span className="text-zinc-200 font-bold">Zero Trust Standard:</span> All assets, smart contracts, and wallet linkages are cryptographically authenticated via verified OAuth nodes.
              </div>
            </div>
          </div>

          {error && (
            <div className="p-4 bg-red-950/10 border border-red-900/50 text-red-400 text-xs rounded-xl text-left space-y-2 select-none">
              <p className="font-bold flex items-center gap-1.5">⚠️ Iframe/Sandbox Environment Notice</p>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                Standard Google OAuth utilizes browser popups. Inside cross-origin iframes (like the AI Studio Preview), browser cookie filters may block the popup.
              </p>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                To fix: Click the <strong className="text-white">“Open app in new tab”</strong> button at the top-right corner to log in with your Google account, or use the instant <strong className="text-emerald-400">“Sovereign Sandbox Pass”</strong> option below.
              </p>
            </div>
          )}

          <Button 
            className="w-full py-6 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-500 text-white font-bold text-sm tracking-wide hover:brightness-110 active:scale-[0.98] shadow-lg shadow-cyan-950/40 transition-all flex items-center justify-center gap-3 relative overflow-hidden"
            onClick={handleGoogleSignIn}
            disabled={authenticating}
          >
            {authenticating ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>CONNECTING AUTHENTICATOR...</span>
              </span>
            ) : (
              <>
                <svg className="w-5 h-5 mr-1 text-white" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22c-.22-.63-.35-1.3-.35-2.09c0-.79.13-1.46.35-2.09L5.84 14.09z" strokeWidth="0" />
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Sign In with Google
              </>
            )}
          </Button>

          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-zinc-900" />
            <span className="flex-shrink mx-4 text-[10px] text-zinc-600 font-mono tracking-widest uppercase">Or</span>
            <div className="flex-grow border-t border-zinc-900" />
          </div>

          <Button 
            className="w-full py-5 rounded-xl border border-zinc-800 bg-zinc-950/40 hover:bg-zinc-900/50 text-zinc-350 font-bold text-xs tracking-wide hover:text-white hover:border-emerald-900/50 transition-all flex items-center justify-center gap-2 relative"
            onClick={handleSandboxSignIn}
            disabled={authenticating}
            type="button"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Bypass with Sovereign Sandbox Pass
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
