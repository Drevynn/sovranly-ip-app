import { Shield, Loader2, Cpu, Database, KeyRound, Globe } from 'lucide-react';

export default function Loading() {
  return (
    <div id="sovranly-loading-portal" className="h-screen w-screen overflow-hidden bg-[#050505] text-[#e0e0e0] flex font-sans select-none">
      {/* Mock Sidebar (Desktop Only) */}
      <aside id="loading-sidebar-mock" className="hidden lg:flex flex-col w-72 h-full border-r border-zinc-900 bg-zinc-950 p-8 flex-shrink-0 justify-between">
        <div className="space-y-8">
          {/* Brand Logo Skeleton */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center">
              <Shield className="w-5 h-5 text-cyan-500/40 animate-pulse" />
            </div>
            <div className="space-y-2">
              <div className="h-5 w-28 bg-zinc-900/80 rounded-md animate-pulse" />
              <div className="h-2.5 w-24 bg-zinc-900/40 rounded animate-pulse" />
            </div>
          </div>

          {/* Nav Items Skeleton */}
          <nav className="space-y-3">
            {[...Array(6)].map((_, idx) => (
              <div
                key={`sidebar-nav-skeleton-${idx}`}
                className="w-full h-14 bg-zinc-900/30 border border-zinc-900/50 rounded-2xl flex items-center px-4 gap-4"
              >
                <div className="w-5 h-5 rounded bg-zinc-900/80 animate-pulse" />
                <div className="h-3 w-32 bg-zinc-900/60 rounded animate-pulse" />
              </div>
            ))}
          </nav>
        </div>

        {/* Bottom Panel Skeleton */}
        <div className="space-y-4">
          <div className="bg-zinc-900/20 border border-zinc-900 rounded-2xl p-4 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-zinc-900/80 animate-pulse" />
              <div className="flex-1 space-y-2">
                <div className="h-3 w-20 bg-zinc-900/80 rounded animate-pulse" />
                <div className="h-2 w-28 bg-zinc-900/40 rounded animate-pulse" />
              </div>
            </div>
            <div className="h-8 w-full bg-zinc-900/60 rounded-xl animate-pulse" />
          </div>

          <div className="bg-zinc-900/10 border border-zinc-900/60 rounded-2xl p-4 space-y-1">
            <div className="h-2 w-20 bg-zinc-900/40 rounded animate-pulse" />
            <div className="h-3.5 w-full bg-zinc-900/60 rounded animate-pulse" />
          </div>
        </div>
      </aside>

      {/* Main Workspace Frame */}
      <div id="loading-workspace-mock" className="flex-1 h-full flex flex-col overflow-hidden">
        {/* Mock Header */}
        <header className="h-20 px-6 md:px-8 flex items-center justify-between border-b border-zinc-900 bg-zinc-950/50 backdrop-blur-md">
          {/* Breadcrumb / Page Title Skeleton */}
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-6 bg-cyan-500/20 rounded animate-pulse" />
            <div className="h-4 w-32 md:w-48 bg-zinc-900 rounded animate-pulse" />
          </div>

          {/* Right Header Status Skeleton */}
          <div className="flex items-center gap-3 md:gap-4">
            <div className="px-4 py-2 bg-zinc-900/40 border border-zinc-900 text-zinc-500 rounded-full flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-emerald-500/40 rounded-full animate-ping" />
              <div className="h-2.5 w-24 bg-zinc-905 rounded animate-pulse hidden sm:block" />
            </div>
            <div className="h-10 w-28 md:w-36 bg-zinc-900 border border-zinc-805 rounded-xl animate-pulse" />
          </div>
        </header>

        {/* Mock Main View Layout */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 bg-[#09090b]">
          {/* Mobile Welcome Notice / Branding */}
          <div className="lg:hidden flex items-center justify-between bg-zinc-950/40 border border-zinc-900 p-4 rounded-2xl mb-2">
            <div className="flex items-center gap-2.5">
              <Shield className="w-5 h-5 text-cyan-500/50 animate-pulse" />
              <div className="space-y-1">
                <span className="text-xs font-bold tracking-tight text-white uppercase">SOVRANLY IP</span>
                <p className="text-[9px] text-zinc-500 font-mono">ESTABLISHING CRYPTO CONSOLE...</p>
              </div>
            </div>
            <Loader2 className="w-4 h-4 text-cyan-400 animate-spin" />
          </div>

          {/* Bento Grid Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-zinc-900/10 border border-zinc-900 rounded-2xl p-6 h-36 flex flex-col justify-between relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Database className="w-12 h-12 text-cyan-400" />
              </div>
              <div className="space-y-2">
                <div className="h-3 w-28 bg-zinc-900/80 rounded animate-pulse" />
                <div className="h-6 w-16 bg-zinc-900 rounded animate-pulse" />
              </div>
              <div className="h-2 w-full bg-zinc-900/40 rounded animate-pulse" />
            </div>

            <div className="bg-zinc-900/10 border border-zinc-900 rounded-2xl p-6 h-36 flex flex-col justify-between relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Cpu className="w-12 h-12 text-violet-400" />
              </div>
              <div className="space-y-2">
                <div className="h-3 w-32 bg-zinc-900/80 rounded animate-pulse" />
                <div className="h-6 w-24 bg-zinc-900 rounded animate-pulse" />
              </div>
              <div className="h-2 w-11/12 bg-zinc-900/40 rounded animate-pulse" />
            </div>

            <div className="bg-zinc-900/10 border border-zinc-900 rounded-2xl p-6 h-36 flex flex-col justify-between relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <KeyRound className="w-12 h-12 text-emerald-400" />
              </div>
              <div className="space-y-2">
                <div className="h-3 w-24 bg-zinc-900/80 rounded animate-pulse" />
                <div className="h-6 w-20 bg-zinc-900 rounded animate-pulse" />
              </div>
              <div className="h-2 w-4/5 bg-zinc-900/40 rounded animate-pulse" />
            </div>
          </div>

          {/* Detailed Workspace Sections */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Primary Ledger Skeleton */}
            <div className="xl:col-span-2 bg-zinc-900/5 border border-zinc-900 rounded-3xl p-6 md:p-8 h-[450px] flex flex-col justify-between">
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-zinc-900 pb-4">
                  <div className="space-y-1.5">
                    <div className="h-4.5 w-44 bg-zinc-900 rounded animate-pulse" />
                    <div className="h-2.5 w-32 bg-zinc-900/40 rounded animate-pulse" />
                  </div>
                  <div className="h-8 w-24 bg-zinc-900/60 rounded-xl animate-pulse" />
                </div>

                <div className="space-y-4">
                  {[...Array(4)].map((_, idx) => (
                    <div
                      key={`ledger-row-skeleton-${idx}`}
                      className="flex items-center justify-between py-3.5 border-b border-zinc-900/50 last:border-0"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-zinc-900/80 animate-pulse" />
                        <div className="space-y-2">
                          <div className="h-3 w-36 bg-zinc-900 rounded animate-pulse" />
                          <div className="h-2 w-20 bg-zinc-900/40 rounded animate-pulse" />
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="h-3 w-16 bg-zinc-900/60 rounded animate-pulse" />
                        <div className="h-7 w-20 bg-zinc-900/40 rounded-xl animate-pulse" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="h-9 w-full bg-zinc-900/10 border border-zinc-900/60 rounded-2xl flex items-center justify-center">
                <div className="h-2.5 w-32 bg-zinc-900/40 rounded animate-pulse" />
              </div>
            </div>

            {/* Side Cryptographic Security Console Skeleton */}
            <div className="bg-zinc-900/5 border border-zinc-900 rounded-3xl p-6 md:p-8 h-[450px] flex flex-col justify-between">
              <div className="space-y-6">
                <div className="flex items-center gap-2.5 border-b border-zinc-900 pb-4">
                  <div className="w-2.5 h-2.5 rounded-full bg-cyan-500/40 animate-ping" />
                  <div className="h-4 w-36 bg-zinc-900 rounded animate-pulse" />
                </div>

                <div className="space-y-4">
                  {[...Array(3)].map((_, idx) => (
                    <div
                      key={`security-log-${idx}`}
                      className="bg-zinc-900/20 border border-zinc-900/40 p-4 rounded-2xl space-y-2.5"
                    >
                      <div className="flex items-center justify-between">
                        <div className="h-2.5 w-24 bg-zinc-900/80 rounded animate-pulse" />
                        <div className="h-2 w-12 bg-zinc-900/40 rounded animate-pulse" />
                      </div>
                      <div className="h-3 w-full bg-zinc-900/60 rounded animate-pulse" />
                      <div className="h-2 w-2/3 bg-zinc-900/30 rounded animate-pulse" />
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between text-[10px] font-mono text-zinc-600 border-t border-zinc-900 pt-4">
                <span className="flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-zinc-700 animate-spin" style={{ animationDuration: '6s' }} />
                  MAPPING NODES ACTIVE
                </span>
                <span>v1.2.0 SECURE</span>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
