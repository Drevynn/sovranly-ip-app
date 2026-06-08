'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

export default function OnboardingChat() {
  const [messages, setMessages] = useState<{role: string, content: string}[]>([]);
  const [input, setInput] = useState('');

  const send = async () => {
    setMessages([...messages, {role: 'user', content: input}]);
    const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: input }),
    });
    const data = await res.json();
    setMessages([...messages, {role: 'user', content: input}, {role: 'ai', content: data.text}]);
    setInput('');
  };

  return (
    <div className="p-6 bg-zinc-900 rounded-3xl border border-zinc-800">
      <h3 className="text-xl font-semibold mb-4">Onboarding & Troubleshooting AI</h3>
      <div className="h-64 overflow-y-auto mb-4 p-4 bg-zinc-950 rounded-lg">
        {messages.map((m, i) => <p key={i} className={m.role === 'user' ? 'text-blue-400' : 'text-emerald-400'}>{m.content}</p>)}
      </div>
      <div className="flex gap-2">
        <input className="flex-1 p-2 bg-zinc-800 rounded" value={input} onChange={(e) => setInput(e.target.value)} />
        <Button onClick={send}>Send</Button>
      </div>
    </div>
  );
}
