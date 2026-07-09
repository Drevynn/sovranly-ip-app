'use client';

import React, { useEffect, useRef } from 'react';

interface StripeBuyButtonProps {
  buyButtonId: string;
  publishableKey: string;
}

export default function StripeBuyButton({ buyButtonId, publishableKey }: StripeBuyButtonProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Inject the script if not already present
    const scriptId = 'stripe-buy-button-script';
    let script = document.getElementById(scriptId) as HTMLScriptElement;
    
    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://js.stripe.com/v3/buy-button.js';
      script.async = true;
      document.body.appendChild(script);
    }

    if (containerRef.current) {
      containerRef.current.innerHTML = `
        <stripe-buy-button
          buy-button-id="${buyButtonId}"
          publishable-key="${publishableKey}"
          style="width: 100%; display: block;"
        ></stripe-buy-button>
      `;
    }
  }, [buyButtonId, publishableKey]);

  return (
    <div 
      ref={containerRef} 
      className="w-full flex justify-center items-center overflow-hidden rounded-2xl min-h-[50px]" 
      id={`stripe-btn-${buyButtonId}`} 
    />
  );
}
