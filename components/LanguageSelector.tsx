'use client';

import React from 'react';
import { useLanguage } from './LanguageProvider';
import { Globe } from 'lucide-react';

type LanguageCode = 'en' | 'es' | 'fr' | 'de' | 'ja' | 'zh';

const languages: Array<{ code: LanguageCode; label: string }> = [
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Español' },
  { code: 'fr', label: 'Français' },
  { code: 'de', label: 'Deutsch' },
  { code: 'ja', label: '日本語' },
  { code: 'zh', label: '中文' },
];

export default function LanguageSelector() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="relative inline-flex items-center gap-2 px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-full text-xs text-zinc-300">
      <Globe className="w-3.5 h-3.5 text-cyan-400" />
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value as LanguageCode)}
        className="bg-transparent border-none text-zinc-300 focus:outline-none focus:ring-0 text-xs font-medium cursor-pointer pr-1"
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code} className="bg-zinc-900 text-zinc-100">
            {lang.label}
          </option>
        ))}
      </select>
    </div>
  );
}
