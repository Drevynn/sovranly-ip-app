'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type ThemeMode = 'obsidian' | 'sovereign-light';

interface ThemeContextType {
  theme: ThemeMode;
  toggleTheme: () => void;
  setTheme: (theme: ThemeMode) => void;
  isLightMode: boolean;
  isObsidianMode: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

function applyThemeToDom(targetTheme: ThemeMode) {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  if (targetTheme === 'sovereign-light') {
    root.classList.remove('dark');
    root.classList.add('light');
    root.setAttribute('data-theme', 'sovereign-light');
    root.style.colorScheme = 'light';
  } else {
    root.classList.remove('light');
    root.classList.add('dark');
    root.setAttribute('data-theme', 'obsidian');
    root.style.colorScheme = 'dark';
  }
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeMode>('obsidian');

  useEffect(() => {
    
    const storedTheme = localStorage.getItem('sovranly-theme') as ThemeMode | null;
    if (storedTheme === 'sovereign-light' || storedTheme === 'obsidian') {
      setThemeState(storedTheme);
      applyThemeToDom(storedTheme);
    } else {
      applyThemeToDom('obsidian');
    }
    
  }, []);

  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme);
    applyThemeToDom(newTheme);
    if (typeof window !== 'undefined') {
      localStorage.setItem('sovranly-theme', newTheme);
    }
  };

  const toggleTheme = () => {
    const nextTheme = theme === 'obsidian' ? 'sovereign-light' : 'obsidian';
    setTheme(nextTheme);
  };

  const isLightMode = theme === 'sovereign-light';
  const isObsidianMode = theme === 'obsidian';

  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggleTheme,
        setTheme,
        isLightMode,
        isObsidianMode,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
