'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useLanguage, SUPPORTED_LANGUAGES, LanguageCode } from './LanguageProvider';
import { Globe, ChevronDown, Check } from 'lucide-react';

export default function LanguageSelector() {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const activeLanguage = SUPPORTED_LANGUAGES.find(lang => lang.code === language) || SUPPORTED_LANGUAGES[0];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div id="language-selector-root" ref={containerRef} className="relative z-50">
      {/* Trigger Button */}
      <button
        id="lang-select-trigger"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3.5 py-2.5 bg-zinc-900/80 hover:bg-zinc-800/80 border border-zinc-800 hover:border-zinc-700 text-zinc-100 text-xs font-semibold rounded-full transition-all focus:outline-none"
      >
        <Globe className="w-3.5 h-3.5 text-cyan-400" />
        <span className="font-mono uppercase tracking-wider">{activeLanguage.flag} {activeLanguage.code}</span>
        <ChevronDown className={`w-3 h-3 text-zinc-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          id="lang-select-dropdown"
          className="absolute right-0 mt-2.5 w-44 bg-zinc-950 border border-zinc-800/80 rounded-2xl shadow-xl shadow-black/80 p-1.5 space-y-1 animate-in fade-in slide-in-from-top-1 duration-100"
        >
          <div className="px-2.5 pt-2 pb-1 text-[9px] uppercase tracking-[0.2em] text-zinc-500 font-bold">
            Select Language
          </div>
          {SUPPORTED_LANGUAGES.map((lang) => (
            <button
              id={`lang-opt-${lang.code}`}
              key={lang.code}
              onClick={() => {
                setLanguage(lang.code);
                setIsOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                language === lang.code
                  ? 'bg-zinc-900 border border-zinc-805 text-cyan-400'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-900/50 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="text-sm select-none">{lang.flag}</span>
                <span>{lang.name}</span>
              </div>
              {language === lang.code && (
                <Check className="w-3.5 h-3.5 text-cyan-400" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
