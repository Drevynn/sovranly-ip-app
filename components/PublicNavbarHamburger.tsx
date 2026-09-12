'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, Home, Info, HelpCircle, FileText, Shield, DollarSign, BookOpen, Compass, FileCode } from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';

export function PublicNavbarHamburger() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const publicLinks = [
    { name: 'Home', href: '/', icon: <Home className="w-4 h-4 text-cyan-400" /> },
    { name: 'Documentation', href: '/docs', icon: <FileCode className="w-4 h-4 text-cyan-400" /> },
    { name: 'Knowledge Wiki', href: '/wiki', icon: <BookOpen className="w-4 h-4 text-violet-400" /> },
    { name: 'Pricing', href: '/pricing', icon: <DollarSign className="w-4 h-4 text-emerald-400" /> },
    { name: 'About', href: '/about', icon: <Info className="w-4 h-4 text-blue-400" /> },
    { name: 'FAQ', href: '/faq', icon: <HelpCircle className="w-4 h-4 text-amber-400" /> },
    { name: 'Terms of Service', href: '/terms', icon: <FileText className="w-4 h-4 text-rose-400" /> },
    { name: 'Privacy Policy', href: '/privacy', icon: <Shield className="w-4 h-4 text-teal-400" /> },
  ];

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:border-cyan-500/40 transition-all flex items-center justify-center cursor-pointer shadow-md"
        aria-label="Toggle public navigation menu"
        id="public-hamburger-btn"
      >
        {isOpen ? <X className="w-5 h-5 text-cyan-400" /> : <Menu className="w-5 h-5 text-cyan-400" />}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-64 bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden z-50 py-2 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="px-4 py-2 border-b border-zinc-900 flex items-center gap-2">
            <Compass className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">Public Navigation</span>
          </div>
          <div className="py-1">
            {publicLinks.map((link, idx) => (
              <Link
                key={idx}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-xs font-medium text-zinc-300 hover:text-white hover:bg-zinc-900/80 transition-colors"
              >
                <div className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800">
                  {link.icon}
                </div>
                <span>{link.name}</span>
              </Link>
            ))}
          </div>
          <div className="px-4 py-2 border-t border-zinc-900 flex items-center justify-between">
            <span className="text-xs text-zinc-400 font-mono">Theme</span>
            <ThemeToggle showLabel={true} />
          </div>
          <div className="px-4 py-2.5 border-t border-zinc-900 bg-zinc-900/40">
            <Link
              href="/dashboard"
              onClick={() => setIsOpen(false)}
              className="w-full text-center block py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-cyan-950/40"
            >
              Launch Dashboard &rarr;
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
