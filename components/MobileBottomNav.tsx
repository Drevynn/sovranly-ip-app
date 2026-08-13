'use client';

import React from 'react';
import { Gauge, FileText, BarChart3, Scale, Menu } from 'lucide-react';
import { useLanguage } from './LanguageProvider';
import { motion } from 'motion/react';

interface MobileBottomNavProps {
  activePage: number;
  setActivePage: (id: number) => void;
  onOpenMenu: () => void;
}

export default function MobileBottomNav({
  activePage,
  setActivePage,
  onOpenMenu,
}: MobileBottomNavProps) {
  const { t, language } = useLanguage();

  // Primary navigation tabs
  const navItems = [
    {
      id: 0,
      label: language === 'es' ? 'Comando' : language === 'ja' ? '司令部' : language === 'fr' ? 'Commandement' : 'Overview',
      shortLabel: 'Overview',
      icon: Gauge,
      color: 'text-cyan-400',
    },
    {
      id: 2,
      label: language === 'es' ? 'Registro' : language === 'ja' ? 'レジストリ' : language === 'fr' ? 'Registre' : 'Registry',
      shortLabel: 'Registry',
      icon: FileText,
      color: 'text-emerald-400',
    },
    {
      id: 3,
      label: language === 'es' ? 'Analítica' : language === 'ja' ? '分析' : language === 'fr' ? 'Analytique' : 'Analytics',
      shortLabel: 'Analytics',
      icon: BarChart3,
      color: 'text-amber-400',
    },
    {
      id: 4,
      label: language === 'es' ? 'Pactos' : language === 'ja' ? 'ライセンス' : language === 'fr' ? 'Contrats' : 'Compacts',
      shortLabel: 'Compacts',
      icon: Scale,
      color: 'text-violet-400',
    },
  ];

  const primaryIds = navItems.map((item) => item.id);
  const isMoreActive = !primaryIds.includes(activePage);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-zinc-950/95 backdrop-blur-2xl border-t border-zinc-800/80 shadow-[0_-10px_30px_rgba(0,0,0,0.95)] px-2 py-2">
      <nav className="flex items-center justify-around max-w-lg mx-auto relative">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              className={`relative flex flex-col items-center justify-center py-2 px-3 min-w-[64px] min-h-[52px] rounded-2xl transition-all cursor-pointer ${
                isActive
                  ? 'text-white font-bold'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
              aria-label={`Navigate to ${item.shortLabel}`}
            >
              {/* Active Tab Neon Pill Background */}
              {isActive && (
                <motion.div
                  layoutId="activeTabBackground"
                  className="absolute inset-0 bg-cyan-500/10 border border-cyan-500/30 rounded-2xl shadow-[0_0_15px_rgba(34,211,238,0.2)]"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}

              {/* Active Top Highlight Bar */}
              {isActive && (
                <motion.div
                  layoutId="activeTabGlowBar"
                  className="absolute -top-2 w-8 h-1 bg-cyan-400 rounded-full shadow-[0_0_10px_#22d3ee]"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}

              <Icon
                className={`w-5 h-5 mb-1 relative z-10 transition-transform ${
                  isActive ? `${item.color} scale-110` : 'text-zinc-500'
                }`}
              />
              <span
                className={`text-[10px] font-mono uppercase tracking-wider relative z-10 leading-none ${
                  isActive ? 'text-white font-bold' : 'text-zinc-500'
                }`}
              >
                {item.shortLabel}
              </span>
            </button>
          );
        })}

        {/* More / All Modules Tab */}
        <button
          onClick={onOpenMenu}
          className={`relative flex flex-col items-center justify-center py-2 px-3 min-w-[64px] min-h-[52px] rounded-2xl transition-all cursor-pointer ${
            isMoreActive
              ? 'text-white font-bold'
              : 'text-zinc-500 hover:text-zinc-300'
          }`}
          aria-label="Open Full Menu"
        >
          {isMoreActive && (
            <motion.div
              layoutId="activeTabBackground"
              className="absolute inset-0 bg-purple-500/10 border border-purple-500/30 rounded-2xl shadow-[0_0_15px_rgba(168,85,247,0.2)]"
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            />
          )}

          {isMoreActive && (
            <motion.div
              layoutId="activeTabGlowBar"
              className="absolute -top-2 w-8 h-1 bg-purple-400 rounded-full shadow-[0_0_10px_#c084fc]"
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            />
          )}

          <div className="relative mb-1 relative z-10">
            <Menu
              className={`w-5 h-5 transition-transform ${
                isMoreActive ? 'text-purple-400 scale-110' : 'text-zinc-500'
              }`}
            />
            {isMoreActive && (
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-purple-400 rounded-full animate-ping" />
            )}
          </div>
          <span
            className={`text-[10px] font-mono uppercase tracking-wider relative z-10 leading-none ${
              isMoreActive ? 'text-white font-bold' : 'text-zinc-500'
            }`}
          >
            More
          </span>
        </button>
      </nav>
    </div>
  );
}
