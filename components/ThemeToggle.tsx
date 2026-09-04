'use client';

import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from './ThemeProvider';

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
}

export default function ThemeToggle({ className = '', showLabel = false }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  // Use light theme as baseline during SSR/hydration to guarantee 100% HTML parity
  const isLight = mounted ? theme === 'light' : true;

  return (
    <button
      onClick={toggleTheme}
      id="theme-toggle-btn"
      type="button"
      suppressHydrationWarning
      aria-label={`Switch to ${isLight ? 'dark' : 'light'} mode`}
      title={`Currently in ${isLight ? 'Light' : 'Dark'} mode. Click to toggle ${isLight ? 'Dark' : 'Light'} mode.`}
      className={`relative inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl border text-xs font-mono font-medium transition-all duration-200 cursor-pointer select-none focus:outline-none focus:ring-2 focus:ring-cyan-500/40 ${
        isLight
          ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300 shadow-sm'
          : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border-zinc-700/80 shadow-inner'
      } ${className}`}
    >
      <div className="relative flex items-center justify-center w-4 h-4">
        {isLight ? (
          <Sun className="w-4 h-4 text-amber-500" />
        ) : (
          <Moon className="w-4 h-4 text-cyan-400" />
        )}
      </div>
      {showLabel && (
        <span className="text-[11px] font-semibold tracking-wide">
          {isLight ? 'Light Mode' : 'Dark Mode'}
        </span>
      )}
    </button>
  );
}
