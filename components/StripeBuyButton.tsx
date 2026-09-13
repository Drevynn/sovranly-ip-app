'use client';

import React from 'react';
import PayLinkButton from '@/components/PayLinkButton';

interface StripeBuyButtonProps {
  buyButtonId?: string;
  publishableKey?: string;
  payUrl?: string;
  label?: string;
}

/**
 * Universal Pay Link Button wrapper.
 * Replaces legacy proprietary Stripe buy buttons with a universal pay link feature.
 */
export default function StripeBuyButton({ payUrl, label = 'Proceed to Pay Link' }: StripeBuyButtonProps) {
  return (
    <div className="w-full flex justify-center items-center">
      <PayLinkButton 
        payUrl={payUrl || '#'} 
        label={label} 
      />
    </div>
  );
}

