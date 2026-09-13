'use client';

import React from 'react';
import { ExternalLink, CreditCard, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PayLinkButtonProps {
  payUrl?: string;
  label?: string;
  price?: string | number;
  className?: string;
  variant?: 'primary' | 'secondary' | 'outline';
  icon?: React.ReactNode;
  target?: string;
}

export default function PayLinkButton({
  payUrl = '#',
  label = 'Pay with Link',
  price,
  className = '',
  variant = 'primary',
  icon,
  target = '_blank'
}: PayLinkButtonProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'secondary':
        return 'bg-zinc-900 hover:bg-zinc-800 text-zinc-100 border border-zinc-800';
      case 'outline':
        return 'bg-transparent hover:bg-zinc-900 text-zinc-200 border border-zinc-700';
      case 'primary':
      default:
        return 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black font-bold shadow-lg shadow-emerald-950/30';
    }
  };

  return (
    <Button
      asChild
      className={`w-full py-6 rounded-2xl transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 text-sm ${getVariantStyles()} ${className}`}
    >
      <a 
        href={payUrl} 
        target={target} 
        rel="noopener noreferrer"
        aria-label={label}
      >
        {icon || <CreditCard className="w-4 h-4 shrink-0" />}
        <span>{label}</span>
        {price && (
          <span className="ml-1 px-2 py-0.5 rounded-full text-xs font-mono bg-black/20 text-current">
            {typeof price === 'number' ? `$${price}` : price}
          </span>
        )}
        <ExternalLink className="w-3.5 h-3.5 opacity-70 ml-1" />
      </a>
    </Button>
  );
}
