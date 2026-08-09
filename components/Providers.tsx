'use client';

import React from 'react';
import { FirebaseProvider } from '@/components/auth/FirebaseProvider';
import { ThemeProvider } from '@/components/ThemeProvider';
import { NotificationProvider } from '@/components/NotificationProvider';
import { LanguageProvider } from '@/components/LanguageProvider';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <FirebaseProvider>
      <ThemeProvider>
        <NotificationProvider>
          <LanguageProvider>
            {children}
          </LanguageProvider>
        </NotificationProvider>
      </ThemeProvider>
    </FirebaseProvider>
  );
}
