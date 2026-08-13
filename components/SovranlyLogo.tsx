import React from 'react';
import Image from 'next/image';

interface SovranlyLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'hero';
  glow?: boolean;
  variant?: 'isolated' | 'v3' | 'v2';
}

export function SovranlyLogo({ className = '', size = 'md', glow = true, variant = 'isolated' }: SovranlyLogoProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-24 h-24',
    xl: 'w-40 h-40',
    hero: 'w-full h-full max-w-[360px] max-h-[360px] sm:max-w-[440px] sm:max-h-[440px]'
  }[size];

  const imageSrc = variant === 'isolated'
    ? '/sovranly-shield-hero.jpg'
    : variant === 'v3'
    ? '/sovranly-shield-v3.jpg'
    : '/sovranly-logo-v2.png';

  return (
    <div className={`relative flex items-center justify-center select-none ${sizeClasses} ${className}`}>
      {glow && (
        <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/25 via-violet-500/20 to-sky-400/20 rounded-3xl blur-2xl animate-pulse pointer-events-none" />
      )}
      <div className="relative z-10 w-full h-full flex items-center justify-center transition-transform duration-500 hover:scale-105">
        <Image
          src={imageSrc}
          alt="Sovranly IP Zero Trust Shield Crest"
          width={500}
          height={500}
          priority
          className="w-full h-full object-contain rounded-2xl drop-shadow-[0_0_35px_rgba(34,211,238,0.55)] border border-cyan-500/20 shadow-2xl shadow-cyan-950/60"
          referrerPolicy="no-referrer"
        />
      </div>
    </div>
  );
}

