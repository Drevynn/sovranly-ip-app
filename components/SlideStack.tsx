'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Zap, Lock, Sparkles, Server } from 'lucide-react';

const cards = [
  {
    id: 1,
    title: 'Immutable Ledger',
    desc: 'Permanent cryptographic record of ownership for creative IP.',
    icon: ShieldCheck,
    color: 'from-cyan-900/40 to-cyan-950/40',
    borderColor: 'border-cyan-500/30',
    textColor: 'text-cyan-400'
  },
  {
    id: 2,
    title: 'Smart Execution',
    desc: 'Instantly execute contracts without middlemen interference.',
    icon: Zap,
    color: 'from-violet-900/40 to-violet-950/40',
    borderColor: 'border-violet-500/30',
    textColor: 'text-violet-400'
  },
  {
    id: 3,
    title: 'Zero-Trust Security',
    desc: 'Trust nothing. Authenticate everything. Your assets are secure.',
    icon: Lock,
    color: 'from-emerald-900/40 to-emerald-950/40',
    borderColor: 'border-emerald-500/30',
    textColor: 'text-emerald-400'
  },
  {
    id: 4,
    title: 'Decentralized Vaults',
    desc: 'Resilient digital asset storage across multiple global nodes.',
    icon: Server,
    color: 'from-rose-900/40 to-rose-950/40',
    borderColor: 'border-rose-500/30',
    textColor: 'text-rose-400'
  }
];

export default function SlideStack() {
  const [cardsArr, setCardsArr] = useState(cards);

  const moveCard = () => {
    setCardsArr((prev) => {
      const newArr = [...prev];
      const first = newArr.shift();
      if (first) newArr.push(first);
      return newArr;
    });
  };

  return (
    <div className="relative w-full h-[320px] md:h-[400px] flex items-center justify-center cursor-pointer" onClick={moveCard}>
      {cardsArr.map((card, index) => {
        let scale = 1;
        let y = 0;
        let zIndex = cards.length - index;
        let opacity = 1;

        if (index > 2) {
          scale = 0.85;
          y = 40;
          opacity = 0;
        } else {
          scale = 1 - index * 0.05;
          y = index * 20;
          opacity = 1 - index * 0.2;
        }

        return (
          <motion.div
            key={card.id}
            layout
            initial={false}
            animate={{
              scale,
              y,
              zIndex,
              opacity
            }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 20
            }}
            className={`absolute w-[280px] md:w-[360px] p-8 rounded-3xl border bg-gradient-to-br backdrop-blur-md shadow-2xl ${card.color} ${card.borderColor}`}
          >
            <div className={`p-4 rounded-2xl bg-black/50 border border-white/5 inline-flex mb-6 ${card.textColor}`}>
              <card.icon className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">{card.title}</h3>
            <p className="text-zinc-400 text-sm leading-relaxed">{card.desc}</p>
          </motion.div>
        );
      })}
    </div>
  );
}
