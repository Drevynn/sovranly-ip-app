'use client';

import React from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased bg-[#030712] text-zinc-100 min-h-screen font-sans flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-md bg-[#090d16] border border-zinc-800 rounded-2xl p-6 shadow-2xl text-center space-y-4">
          <h1 className="text-xl font-bold text-white">System Error</h1>
          <p className="text-sm text-zinc-400">{error?.message || 'An unexpected error occurred.'}</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => reset()}
              className="px-4 py-2 bg-zinc-100 text-zinc-900 rounded-lg text-xs font-medium cursor-pointer"
            >
              Retry
            </button>
            <button
              onClick={() => { window.location.href = '/'; }}
              className="px-4 py-2 border border-zinc-700 text-zinc-300 rounded-lg text-xs font-medium cursor-pointer"
            >
              Home
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
