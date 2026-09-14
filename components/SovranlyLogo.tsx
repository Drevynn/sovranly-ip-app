'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion } from 'motion/react';

interface SovranlyLogoProps {
  id?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'hero';
  glow?: boolean;
  variant?: 'isolated' | 'v3' | 'v2';
  videoSrc?: string;
  useVideo?: boolean;
}

export function SovranlyLogo({ 
  id = 'SovranlyLogo',
  className = '', 
  size = 'md', 
  glow = true, 
  variant = 'isolated',
  videoSrc,
  useVideo = false
}: SovranlyLogoProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-24 h-24',
    xl: 'w-40 h-40',
    hero: 'w-full h-full max-w-[340px] max-h-[340px] sm:max-w-[420px] sm:max-h-[420px]'
  }[size];

  return (
    <motion.div 
      id={id}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileTap={{ scale: 0.96 }}
      transition={{ 
        opacity: { duration: 0.6, ease: 'easeOut' },
        scale: { duration: 0.6, ease: 'easeOut' },
      }}
      className={`group/logo relative flex items-center justify-center select-none transition-all duration-500 active:scale-95 cursor-pointer ${sizeClasses} ${className}`}
    >
      {/* Ambient glowing aura that seamlessly diffuses into the dark site background theme */}
      <div 
        className={`absolute inset-0 rounded-full transition-all duration-700 pointer-events-none ${
          glow 
            ? 'bg-gradient-to-tr from-cyan-500/25 via-violet-500/20 to-sky-400/15 blur-3xl opacity-80 group-hover/logo:opacity-100 group-hover/logo:scale-125' 
            : 'opacity-0 group-hover/logo:opacity-80 bg-gradient-to-tr from-cyan-500/25 via-violet-500/20 to-sky-400/20 blur-2xl group-hover/logo:scale-110'
        }`} 
      />

      <div className="relative z-10 w-full h-full flex items-center justify-center transition-all duration-500 transform group-hover/logo:scale-105">
        {/* Shield and Crown only with 100% transparent background - No square, no black, no white, no checkerboard */}
        <div className="relative w-full h-full flex items-center justify-center">
          <Image
            src="/sovranly-shield-transparent.png"
            alt="Sovranly IP Shield and Crown Logo"
            width={1024}
            height={1310}
            priority
            unoptimized={true}
            className="w-full h-full object-contain filter drop-shadow-[0_0_25px_rgba(0,240,255,0.45)] group-hover/logo:drop-shadow-[0_0_45px_rgba(0,240,255,0.75)] select-none pointer-events-none transition-all duration-500"
            referrerPolicy="no-referrer"
          />
        </div>
      </div>
    </motion.div>
  );
}


