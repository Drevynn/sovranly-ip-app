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
  const [videoError, setVideoError] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [retryIndex, setRetryIndex] = useState(0);

  // Video is only used if explicitly provided via videoSrc or useVideo is enabled
  const candidateVideo = videoSrc || (useVideo ? '/sovranly-hero-loop.mp4' : null);

  const fallbackList = [
    '/sovranly-shield-hero.jpg',
    '/sovranly-shield-v3.png',
    '/sovranly-hero-crest.jpg',
    '/sovranly-shield-v3.jpg',
    '/sovranly-shield-icon.jpg',
    '/sovranly-shield-transparent.png',
    '/sovranly-logo-transparent.png',
    '/sovranly-shield-v3.webp'
  ];

  const currentSrc = fallbackList[retryIndex] || fallbackList[0];

  const handleImageError = () => {
    if (retryIndex < fallbackList.length - 1) {
      setRetryIndex(prev => prev + 1);
    } else {
      setImgError(true);
    }
  };

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
      {/* Ambient glowing aura that seamlessly diffuses into the dark canvas */}
      <div 
        className={`absolute inset-0 rounded-full transition-all duration-700 pointer-events-none ${
          glow 
            ? 'bg-gradient-to-tr from-cyan-500/20 via-violet-500/15 to-sky-400/15 blur-3xl opacity-70 group-hover/logo:opacity-100 group-hover/logo:scale-120' 
            : 'opacity-0 group-hover/logo:opacity-80 bg-gradient-to-tr from-cyan-500/25 via-violet-500/20 to-sky-400/20 blur-2xl group-hover/logo:scale-110'
        }`} 
      />

      <div className="relative z-10 w-full h-full flex items-center justify-center transition-all duration-500 transform group-hover/logo:scale-105">
        {candidateVideo && !videoError ? (
          <div className="relative w-full h-full flex items-center justify-center overflow-hidden rounded-full mix-blend-screen [mask-image:radial-gradient(circle_at_center,black_60%,transparent_100%)] [-webkit-mask-image:radial-gradient(circle_at_center,black_60%,transparent_100%)]">
            <video
              src={candidateVideo}
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              onError={() => setVideoError(true)}
              className="w-full h-full object-contain transition-all duration-500 drop-shadow-[0_0_30px_rgba(34,211,238,0.5)] group-hover/logo:drop-shadow-[0_0_55px_rgba(34,211,238,0.9)]"
            />
          </div>
        ) : !imgError ? (
          <div className="relative w-full h-full flex items-center justify-center overflow-visible mix-blend-screen [mask-image:radial-gradient(circle_at_center,black_50%,transparent_92%)] [-webkit-mask-image:radial-gradient(circle_at_center,black_50%,transparent_92%)]">
            <Image
              src={currentSrc}
              alt="Sovranly IP Zero Trust Shield Crest"
              width={600}
              height={600}
              priority
              unoptimized={true}
              onError={handleImageError}
              className="w-full h-full object-contain transition-all duration-700 drop-shadow-[0_0_30px_rgba(34,211,238,0.45)] group-hover/logo:drop-shadow-[0_0_55px_rgba(34,211,238,0.85)] select-none pointer-events-none"
              referrerPolicy="no-referrer"
            />
          </div>
        ) : (
          /* High-Fidelity Zero-Trust Vector Shield Fallback that blends seamlessly into the dark background */
          <div className="w-full h-full flex items-center justify-center relative mix-blend-screen">
            <svg viewBox="0 0 100 100" className="w-full h-full max-w-[85%] max-h-[85%] transition-all duration-500 drop-shadow-[0_0_25px_rgba(6,182,212,0.55)] group-hover/logo:drop-shadow-[0_0_45px_rgba(6,182,212,0.9)]" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#06b6d4" />
                  <stop offset="50%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
                <linearGradient id="coreGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.85" />
                  <stop offset="100%" stopColor="#000000" stopOpacity="0.95" />
                </linearGradient>
              </defs>
              <path d="M50 5 L85 20 V50 C85 75 50 95 50 95 C50 95 15 75 15 50 V20 L50 5 Z" stroke="url(#shieldGrad)" strokeWidth="3.5" fill="url(#coreGrad)" />
              <path d="M50 15 L77 27 V50 C77 69 50 85 50 85 C50 85 23 69 23 50 V27 L50 15 Z" stroke="#06b6d4" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" fill="none" />
              <circle cx="50" cy="45" r="12" fill="#050810" stroke="#22d3ee" strokeWidth="2" />
              <path d="M46 45 V40 C46 37.8 47.8 36 50 36 C52.2 36 54 37.8 54 40 V45" stroke="#22d3ee" strokeWidth="2" strokeLinecap="round" />
              <rect x="44" y="44" width="12" height="10" rx="2" fill="#22d3ee" />
              <circle cx="50" cy="49" r="1.5" fill="#050810" />
              <path d="M35 70 L50 78 L65 70" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        )}
      </div>
    </motion.div>
  );
}


