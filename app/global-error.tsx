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
    <html lang="en">
      <body className="bg-black text-white flex flex-col items-center justify-center min-h-screen p-6 font-sans">
        <div className="max-w-md w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-8 text-center space-y-4">
          <h2 className="text-2xl font-bold text-red-400">Critical Application Fault</h2>
          <p className="text-sm text-zinc-400 leading-relaxed">
            A system-level error occurred during root execution.
          </p>
          <div className="bg-zinc-950 p-3 rounded-lg text-xs font-mono text-zinc-500 break-all text-left">
            {error.message || 'Unknown Exception'}
          </div>
          <button
            onClick={() => reset()}
            className="w-full py-3 px-4 bg-white text-black font-semibold rounded-xl hover:bg-zinc-200 transition-colors"
          >
            Reset System State
          </button>
        </div>
      </body>
    </html>
  );
}
