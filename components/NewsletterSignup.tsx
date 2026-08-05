'use client';

import React, { useState } from 'react';
import { Mail, CheckCircle2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-zinc-950/90 border border-zinc-800 rounded-2xl shadow-xl">
      <div className="text-center space-y-2 mb-4">
        <div className="inline-flex p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
          <Mail className="w-5 h-5" />
        </div>
        <h4 className="text-base font-bold text-white">Sovranly IP Intelligence Brief</h4>
        <p className="text-xs text-zinc-400">Receive updates on Zero Trust IP protection and smart licensing compacts.</p>
      </div>

      {submitted ? (
        <div className="p-3 bg-cyan-950/40 border border-cyan-500/30 rounded-xl text-center text-cyan-300 text-xs flex items-center justify-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-cyan-400" />
          <span>Subscription confirmed! Thank you.</span>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="text-xs"
          />
          <Button type="submit" size="sm" className="bg-cyan-500 hover:bg-cyan-400 text-black font-bold whitespace-nowrap">
            Subscribe
          </Button>
        </form>
      )}
    </div>
  );
}
