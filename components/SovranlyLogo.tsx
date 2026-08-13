import React from 'react';
import Image from 'next/image';

interface SovranlyLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'hero';
  glow?: boolean;
}

export function SovranlyLogo({ className = '', size = 'md', glow = true }: SovranlyLogoProps) {
  const sizeClasses = {
    sm: 'w-8 h-10',
    md: 'w-12 h-15',
    lg: 'w-24 h-30',
    xl: 'w-40 h-50',
    hero: 'w-full h-full max-w-[380px] max-h-[480px]'
  }[size];

  return (
    <div className={`relative flex items-center justify-center select-none ${sizeClasses} ${className}`}>
      {glow && (
        <div className="absolute inset-0 bg-cyan-500/20 rounded-full blur-3xl animate-pulse pointer-events-none" />
      )}
      <div className="relative z-10 w-full h-full flex items-center justify-center transition-transform duration-300 hover:scale-105">
        <Image
          src="/sovranly-logo-v2.png"
          alt="Sovranly IP Emblem Logo"
          width={400}
          height={520}
          priority
          className="w-full h-full object-contain drop-shadow-[0_0_25px_rgba(34,211,238,0.5)]"
          referrerPolicy="no-referrer"
        />
      </div>
    </div>
  );
}
