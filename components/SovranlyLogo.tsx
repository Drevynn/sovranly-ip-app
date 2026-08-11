import React from 'react';

interface SovranlyLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'hero';
  glow?: boolean;
}

export function SovranlyLogo({ className = '', size = 'md', glow = true }: SovranlyLogoProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-20 h-20',
    xl: 'w-32 h-32',
    hero: 'w-full h-full'
  }[size];

  return (
    <div className={`relative flex items-center justify-center select-none ${sizeClasses} ${className}`}>
      {glow && (
        <div className="absolute inset-0 bg-cyan-500/20 rounded-full blur-xl animate-pulse pointer-events-none" />
      )}
      <svg
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full relative z-10 drop-shadow-[0_0_15px_rgba(34,211,238,0.6)]"
      >
        <defs>
          <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0891b2" />
            <stop offset="50%" stopColor="#0e7490" />
            <stop offset="100%" stopColor="#0284c7" />
          </linearGradient>
          <linearGradient id="crownGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#22d3ee" />
            <stop offset="100%" stopColor="#38bdf8" />
          </linearGradient>
          <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Crown on top of shield */}
        <g filter="url(#neonGlow)">
          <path
            d="M65 55L78 35L100 48L122 35L135 55H65Z"
            fill="url(#crownGrad)"
            stroke="#67e8f9"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          {/* Crown jewels / glowing dots */}
          <circle cx="65" cy="55" r="4" fill="#a5f3fc" />
          <circle cx="78" cy="35" r="4" fill="#a5f3fc" />
          <circle cx="100" cy="48" r="5" fill="#a5f3fc" />
          <circle cx="122" cy="35" r="4" fill="#a5f3fc" />
          <circle cx="135" cy="55" r="4" fill="#a5f3fc" />
        </g>

        {/* Shield body */}
        <path
          d="M100 20C135 20 165 30 165 55C165 110 135 150 100 175C65 150 35 110 35 55C35 30 65 20 100 20Z"
          fill="url(#shieldGrad)"
          stroke="#22d3ee"
          strokeWidth="4"
          className="drop-shadow-lg"
        />

        {/* Inner circuit paths */}
        <path
          d="M60 70H80V100H65"
          stroke="#67e8f9"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.8"
        />
        <circle cx="60" cy="70" r="3" fill="#22d3ee" />
        <circle cx="65" cy="100" r="3" fill="#22d3ee" />

        <path
          d="M140 70H120V100H135"
          stroke="#67e8f9"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.8"
        />
        <circle cx="140" cy="70" r="3" fill="#22d3ee" />
        <circle cx="135" cy="100" r="3" fill="#22d3ee" />

        {/* Inner shield border accent */}
        <path
          d="M100 32C127 32 151 40 152 58C152 102 124 137 100 159C76 137 48 102 48 58C49 40 73 32 100 32Z"
          stroke="#93c5fd"
          strokeWidth="1.5"
          strokeDasharray="4 2"
          fill="none"
          opacity="0.5"
        />

        {/* Encircled 'C' Copyright symbol in center */}
        <circle cx="100" cy="95" r="26" fill="#030712" stroke="#22d3ee" strokeWidth="3" />
        <path
          d="M112 85C109 81 103 79 97 81C91 83 87 89 87 95C87 101 91 107 97 109C103 111 109 109 112 105"
          stroke="#67e8f9"
          strokeWidth="5"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
    </div>
  );
}
