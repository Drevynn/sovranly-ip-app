import React, { useEffect, useRef, useState } from 'react';

interface AudioWaveformProps {
  accentColor: 'cyan' | 'violet';
  isPlaying: boolean;
}

const BAR_COUNT = 40;

export const AudioWaveform: React.FC<AudioWaveformProps> = ({ accentColor, isPlaying }) => {
  const fillColor = accentColor === 'cyan' ? '#00f0ff' : '#a855f7';
  const [bars, setBars] = useState<number[]>(() =>
    Array.from({ length: BAR_COUNT }, () => Math.random() * 0.6 + 0.2)
  );
  const animRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isPlaying) {
      animRef.current = setInterval(() => {
        setBars(prev =>
          prev.map((h, _i) => {
            const drift = (Math.random() - 0.5) * 0.3;
            const next = h + drift;
            return Math.max(0.1, Math.min(1, next));
          })
        );
      }, 80);
    } else {
      if (animRef.current) clearInterval(animRef.current);
      setBars(Array.from({ length: BAR_COUNT }, () => Math.random() * 0.25 + 0.1));
    }
    return () => {
      if (animRef.current) clearInterval(animRef.current);
    };
  }, [isPlaying]);

  return (
    <div className="flex items-center justify-center gap-[3px] h-12 w-full">
      {bars.map((height, i) => (
        <div
          key={i}
          className="waveform-bar transition-all duration-75"
          style={{
            height: `${height * 100}%`,
            background: fillColor,
            opacity: isPlaying ? 0.7 + height * 0.3 : 0.3,
            boxShadow: isPlaying ? `0 0 4px ${fillColor}` : 'none',
          }}
        />
      ))}
    </div>
  );
};
