'use client';

import { useEffect, useRef, useState } from 'react';

interface GoogleAdProps {
  slot: string;
  format?: 'auto' | 'fluid' | 'rectangle';
  className?: string;
  style?: React.CSSProperties;
}

export default function GoogleAd({ slot, format = 'auto', className = '', style }: GoogleAdProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isReady, setIsReady] = useState(false);
  const [isAdInitialized, setIsAdInitialized] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const container = containerRef.current;
    if (!container) return;

    let isCleanedUp = false;

    const checkSizeAndActivate = () => {
      if (isCleanedUp) return;
      const width = container.clientWidth || container.offsetWidth;
      const parentWidth = container.parentElement ? (container.parentElement.clientWidth || container.parentElement.offsetWidth) : 0;

      // Ensure stable positive rendering bounds before qualifying as ready
      if (width > 50 && parentWidth > 50) {
        setIsReady(true);
      }
    };

    // Check size immediately
    checkSizeAndActivate();

    if (typeof window.ResizeObserver !== 'undefined') {
      const observer = new ResizeObserver(() => {
        checkSizeAndActivate();
      });
      observer.observe(container);
      return () => {
        isCleanedUp = true;
        observer.disconnect();
      };
    } else {
      const interval = setInterval(checkSizeAndActivate, 300);
      return () => {
        isCleanedUp = true;
        clearInterval(interval);
      };
    }
  }, []);

  // Silent catcher for background AdSense exceptions
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const origOnError = window.onerror;
    window.onerror = function (message, source, lineno, colno, error) {
      const msgStr = typeof message === 'string' ? message : '';
      if (msgStr.includes('adsbygoogle') || msgStr.includes('TagError') || msgStr.includes('availableWidth')) {
        console.warn('Silenced background AdSense frame event:', msgStr);
        return true; // prevent default browser crash alert/bubbles
      }
      if (origOnError) {
        return origOnError.apply(this, arguments as any);
      }
      return false;
    };
    
    return () => {
      window.onerror = origOnError;
    };
  }, []);

  // Wait for the container size to be set, allow layout engine to render before pushing AdSense frames
  useEffect(() => {
    if (!isReady || isAdInitialized) return;

    let isCleanedUp = false;

    const timer = setTimeout(() => {
      if (isCleanedUp) return;
      try {
        const insElement = containerRef.current?.querySelector('ins');
        if (insElement) {
          const width = insElement.clientWidth || insElement.offsetWidth || 0;
          const styleDisp = window.getComputedStyle(insElement).display;
          if (width === 0 || styleDisp === 'none') {
            console.warn('AdSense ins tag is hidden or width=0 (blocked by ad-blocker or inactive tab). Skipping push() to avoid TagError.');
            return;
          }
        }

        const windowWithAds = window as any;
        windowWithAds.adsbygoogle = windowWithAds.adsbygoogle || [];
        windowWithAds.adsbygoogle.push({});
        setIsAdInitialized(true);
      } catch (err) {
        console.warn('AdSense push failed or blocked by client:', err);
      }
    }, 150);

    return () => {
      isCleanedUp = true;
      clearTimeout(timer);
    };
  }, [isReady, isAdInitialized]);

  return (
    <div 
      ref={containerRef}
      className={`w-full overflow-hidden rounded-2xl bg-zinc-950 border border-zinc-900 p-3 text-center flex flex-col justify-center items-center relative min-h-[140px] ${className}`}
    >
      {/* Premium dark-mode placeholder background beneath the active ad */}
      <div className="absolute inset-0 bg-gradient-to-br from-zinc-950 to-zinc-900/40 opacity-70 pointer-events-none" />
      
      <div className="relative z-10 w-full">
        {/* Tiny subtle classification marker */}
        <span className="text-[9px] uppercase font-mono tracking-widest text-zinc-650 block mb-2 font-semibold">
          Sponsor Framework Allocation
        </span>
        
        {/* Active Ins container for Google AdSense - only rendered as 'adsbygoogle' when sizing is ready and active */}
        {isReady ? (
          <ins
            className="adsbygoogle block"
            style={style || { display: 'block', minHeight: '90px' }}
            data-ad-client="ca-pub-1932505075277502"
            data-ad-slot={slot}
            data-ad-format={format}
            data-full-width-responsive="true"
            data-ad-initialized={isAdInitialized ? "true" : "false"}
          />
        ) : (
          <div className="h-[90px] flex items-center justify-center text-[9px] font-mono text-zinc-700 uppercase tracking-widest animate-pulse">
            Awaiting Frame Calibration...
          </div>
        )}
      </div>
    </div>
  );
}
