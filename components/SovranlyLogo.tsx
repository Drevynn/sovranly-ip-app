import React from 'react';

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
    hero: 'w-full h-full max-w-[360px] max-h-[460px]'
  }[size];

  return (
    <div className={`relative flex items-center justify-center select-none ${sizeClasses} ${className}`}>
      {glow && (
        <div className="absolute inset-0 bg-cyan-500/15 rounded-full blur-2xl animate-pulse pointer-events-none" />
      )}
      <svg
        viewBox="0 0 400 520"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full relative z-10 drop-shadow-[0_0_20px_rgba(34,211,238,0.45)] transition-transform duration-300 hover:scale-105"
      >
        <defs>
          {/* Metallic Purple to Cyan Gradients */}
          <linearGradient id="crownGradLeft" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="40%" stopColor="#1e1b4b" />
            <stop offset="100%" stopColor="#581c87" />
          </linearGradient>

          <linearGradient id="crownGradRight" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#06b6d4" />
            <stop offset="40%" stopColor="#2e1065" />
            <stop offset="100%" stopColor="#3b0764" />
          </linearGradient>

          <linearGradient id="outerShieldLeft" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#67e8f9" />
            <stop offset="20%" stopColor="#3b0764" />
            <stop offset="70%" stopColor="#1e1b4b" />
            <stop offset="100%" stopColor="#0891b2" />
          </linearGradient>

          <linearGradient id="outerShieldRight" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#0284c7" />
            <stop offset="25%" stopColor="#2e1065" />
            <stop offset="75%" stopColor="#0f172a" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>

          <linearGradient id="cyanNeon" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#a5f3fc" />
            <stop offset="50%" stopColor="#22d3ee" />
            <stop offset="100%" stopColor="#0284c7" />
          </linearGradient>

          <linearGradient id="metalSilver" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f1f5f9" />
            <stop offset="30%" stopColor="#94a3b8" />
            <stop offset="70%" stopColor="#475569" />
            <stop offset="100%" stopColor="#cbd5e1" />
          </linearGradient>

          <linearGradient id="innerShieldBg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#090d16" />
            <stop offset="50%" stopColor="#030712" />
            <stop offset="100%" stopColor="#0c1322" />
          </linearGradient>

          <filter id="cyanGlowFilter" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* ================= CROWN STRUCTURE ================= */}
        <g id="Crown">
          {/* Crown Base Arch */}
          <path
            d="M 110 135 C 150 120, 250 120, 290 135 C 285 115, 115 115, 110 135 Z"
            fill="url(#cyanNeon)"
            stroke="#67e8f9"
            strokeWidth="2"
          />

          {/* Crown Left Wing / Body */}
          <path
            d="M 110 125 L 80 60 L 140 85 L 200 25 L 200 120 C 170 118, 130 120, 110 125 Z"
            fill="url(#crownGradLeft)"
            stroke="#22d3ee"
            strokeWidth="3"
            strokeLinejoin="round"
          />

          {/* Crown Right Wing / Body */}
          <path
            d="M 290 125 L 320 60 L 260 85 L 200 25 L 200 120 C 230 118, 270 120, 290 125 Z"
            fill="url(#crownGradRight)"
            stroke="#06b6d4"
            strokeWidth="3"
            strokeLinejoin="round"
          />

          {/* Crown Internal Circuit Details */}
          <path d="M 140 85 L 155 105 H 175" stroke="#38bdf8" strokeWidth="2" fill="none" opacity="0.8" />
          <path d="M 260 85 L 245 105 H 225" stroke="#38bdf8" strokeWidth="2" fill="none" opacity="0.8" />
          <circle cx="175" cy="105" r="3" fill="#67e8f9" />
          <circle cx="225" cy="105" r="3" fill="#67e8f9" />

          {/* Crown Center Diamond Gem */}
          <polygon points="200,55 212,70 200,85 188,70" fill="url(#cyanNeon)" stroke="#f0fdf4" strokeWidth="1.5" filter="url(#cyanGlowFilter)" />

          {/* 5 Crown Tip Sphere Gems */}
          <circle cx="80" cy="60" r="10" fill="url(#cyanNeon)" stroke="#e0f2fe" strokeWidth="2" filter="url(#cyanGlowFilter)" />
          <circle cx="140" cy="85" r="9" fill="url(#cyanNeon)" stroke="#e0f2fe" strokeWidth="2" filter="url(#cyanGlowFilter)" />
          <circle cx="200" cy="25" r="13" fill="url(#cyanNeon)" stroke="#ffffff" strokeWidth="2.5" filter="url(#cyanGlowFilter)" />
          <circle cx="260" cy="85" r="9" fill="url(#cyanNeon)" stroke="#e0f2fe" strokeWidth="2" filter="url(#cyanGlowFilter)" />
          <circle cx="320" cy="60" r="10" fill="url(#cyanNeon)" stroke="#e0f2fe" strokeWidth="2" filter="url(#cyanGlowFilter)" />
        </g>

        {/* ================= OUTER SHIELD ================= */}
        <g id="OuterShield">
          {/* Left Half Outer Shield */}
          <path
            d="M 200 130 C 140 130, 45 140, 40 170 C 35 280, 80 410, 200 495 Z"
            fill="url(#outerShieldLeft)"
            stroke="#22d3ee"
            strokeWidth="4"
            strokeLinejoin="round"
          />

          {/* Right Half Outer Shield */}
          <path
            d="M 200 130 C 260 130, 355 140, 360 170 C 365 280, 320 410, 200 495 Z"
            fill="url(#outerShieldRight)"
            stroke="#0891b2"
            strokeWidth="4"
            strokeLinejoin="round"
          />

          {/* Outer Shield Inner Bevel Outline */}
          <path
            d="M 200 142 C 148 142, 60 152, 55 178 C 50 275, 92 395, 200 478 C 308 395, 350 275, 345 178 C 340 152, 252 142, 200 142 Z"
            fill="none"
            stroke="url(#cyanNeon)"
            strokeWidth="2.5"
            opacity="0.9"
          />

          {/* Center Vertical Crease Highlight */}
          <line x1="200" y1="130" x2="200" y2="495" stroke="#a5f3fc" strokeWidth="2.5" opacity="0.8" />
        </g>

        {/* ================= CIRCUIT BOARD PATHWAYS ================= */}
        <g id="CircuitTraces" opacity="0.85">
          {/* Left Side Circuit Traces */}
          <path d="M 70 210 H 120 L 140 230 V 270 L 110 290 H 80" stroke="#22d3ee" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="70" cy="210" r="4" fill="#67e8f9" />
          <circle cx="80" cy="290" r="4" fill="#67e8f9" />

          <path d="M 85 330 H 130 L 150 350 V 380 L 170 400" stroke="#22d3ee" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="85" cy="330" r="4" fill="#67e8f9" />
          <circle cx="170" cy="400" r="4" fill="#67e8f9" />

          <path d="M 65 250 H 95 L 115 270" stroke="#38bdf8" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="65" cy="250" r="3.5" fill="#38bdf8" />

          {/* Right Side Circuit Traces */}
          <path d="M 330 210 H 280 L 260 230 V 270 L 290 290 H 320" stroke="#22d3ee" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="330" cy="210" r="4" fill="#67e8f9" />
          <circle cx="320" cy="290" r="4" fill="#67e8f9" />

          <path d="M 315 330 H 270 L 250 350 V 380 L 230 400" stroke="#22d3ee" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="315" cy="330" r="4" fill="#67e8f9" />
          <circle cx="230" cy="400" r="4" fill="#67e8f9" />

          <path d="M 335 250 H 305 L 285 270" stroke="#38bdf8" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="335" cy="250" r="3.5" fill="#38bdf8" />
        </g>

        {/* ================= INNER SHIELD ================= */}
        <g id="InnerShield">
          {/* Inner Shield Body */}
          <path
            d="M 200 200 C 160 200, 115 210, 110 230 C 105 300, 135 380, 200 440 C 265 380, 295 300, 290 230 C 285 210, 240 200, 200 200 Z"
            fill="url(#innerShieldBg)"
            stroke="url(#metalSilver)"
            strokeWidth="5"
            strokeLinejoin="round"
          />

          {/* Inner Shield Accent Bevel */}
          <path
            d="M 200 210 C 168 210, 128 218, 124 235 C 120 295, 145 365, 200 420 C 255 365, 280 295, 276 235 C 272 218, 232 210, 200 210 Z"
            fill="none"
            stroke="#22d3ee"
            strokeWidth="2"
            opacity="0.8"
          />
        </g>

        {/* ================= CENTER ENCIRCLED COPYRIGHT 'C' ================= */}
        <g id="CopyrightSymbol">
          {/* Outer Metallic Ring Arc */}
          <path
            d="M 235 275 A 50 50 0 1 0 235 345"
            fill="none"
            stroke="url(#metalSilver)"
            strokeWidth="9"
            strokeLinecap="round"
          />

          {/* Inner Metallic Ring Arc */}
          <path
            d="M 225 285 A 38 38 0 1 0 225 335"
            fill="none"
            stroke="url(#metalSilver)"
            strokeWidth="7"
            strokeLinecap="round"
          />

          {/* Cyan Glow Lines inside C */}
          <path
            d="M 230 280 A 44 44 0 1 0 230 340"
            fill="none"
            stroke="#22d3ee"
            strokeWidth="2.5"
            opacity="0.9"
          />

          {/* Horizontal Circuit Line inside Copyright C */}
          <path d="M 200 310 H 265" stroke="#38bdf8" strokeWidth="3" strokeLinecap="round" />
          <circle cx="265" cy="310" r="4.5" fill="#a5f3fc" />
          <circle cx="200" cy="310" r="3" fill="#22d3ee" />
        </g>
      </svg>
    </div>
  );
}
