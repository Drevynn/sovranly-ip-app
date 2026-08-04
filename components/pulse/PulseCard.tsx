import React, { useState } from 'react';
import { VerificationBadge } from './VerificationBadge';
import { AudioWaveform } from './AudioWaveform';
import { ScriptSnippet } from './ScriptSnippet';
import { StoryboardFrame } from './StoryboardFrame';

export type ProjectType = 'music' | 'film';
export type PulseMediaType = 'audio' | 'script' | 'storyboard';

export interface PulseCardData {
  id: string;
  projectType: ProjectType;
  projectName: string;
  artistHandle: string;
  status: string;
  pulseTitle: string;
  pulseMediaType: PulseMediaType;
  certifyTimestamp: string;
  shaHash: string;
  threadCount: number;
  syncCount: number;
  script?: string;
  storyboardScene?: string;
  storyboardLabel?: string;
  description: string;
}

interface PulseCardProps {
  data: PulseCardData;
}

const STATUS_COLORS: Record<string, string> = {
  'Scripting Phase': '#f59e0b',
  'Scoring': '#00f0ff',
  'In Production': '#a855f7',
  'Post-Production': '#f97316',
  'Mixing': '#22c55e',
  'Mastering': '#3b82f6',
  'Locked': '#10b981',
};

export const PulseCard: React.FC<PulseCardProps> = ({ data }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [synced, setSynced] = useState(false);
  const [syncCount, setSyncCount] = useState(data.syncCount);
  const [threadOpen, setThreadOpen] = useState(false);
  const [threadInput, setThreadInput] = useState('');
  const [threads, setThreads] = useState<string[]>([]);

  const accentColor: 'cyan' | 'violet' = data.projectType === 'music' ? 'cyan' : 'violet';
  const fillColor = accentColor === 'cyan' ? '#00f0ff' : '#a855f7';
  const statusColor = STATUS_COLORS[data.status] || '#94a3b8';

  const handleSync = () => {
    setSynced(s => {
      setSyncCount(c => s ? c - 1 : c + 1);
      return !s;
    });
  };

  const handleThreadSubmit = () => {
    if (threadInput.trim()) {
      setThreads(t => [...t, threadInput.trim()]);
      setThreadInput('');
    }
  };

  const threadLabel = data.projectType === 'music' ? 'Beat-Back' : 'Frame-Back';
  const threadIcon = data.projectType === 'music' ? '🎵' : '🎬';
  const projectTag = data.projectType === 'music' ? 'Bandaide' : 'AI Filmz';

  return (
    <div
      className="relative rounded-3xl overflow-hidden transition-all duration-500 hover:scale-[1.01] group"
      style={{
        background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
        border: `1px solid ${fillColor}40`,
        boxShadow: `0 0 30px ${fillColor}20, 0 8px 32px rgba(0,0,0,0.5), inset 0 0 30px ${fillColor}05`,
        backdropFilter: 'blur(20px)',
      }}
    >
      {/* Ambient corner glow */}
      <div
        className="absolute -top-20 -right-20 w-48 h-48 rounded-full pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${fillColor}15 0%, transparent 70%)`,
        }}
      />
      <div
        className="absolute -bottom-16 -left-16 w-40 h-40 rounded-full pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${fillColor}08 0%, transparent 70%)`,
        }}
      />

      {/* ── Header ── */}
      <div className="relative px-6 pt-6 pb-4 flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          {/* Project type dot */}
          <div className="mt-1 flex-shrink-0 relative">
            <div
              className="w-2.5 h-2.5 rounded-full animate-pulse-slow"
              style={{
                background: fillColor,
                boxShadow: `0 0 8px 3px ${fillColor}80`,
              }}
            />
          </div>

          <div className="flex-1 min-w-0">
            {/* Project label + name */}
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className="text-xs font-semibold uppercase tracking-widest px-2.5 py-0.5 rounded-lg font-grotesk"
                style={{
                  background: `${fillColor}15`,
                  color: fillColor,
                  border: `1px solid ${fillColor}30`,
                }}
              >
                {projectTag}
              </span>
              <span className="text-zinc-500 text-xs font-mono">·</span>
              <span className="text-zinc-300 text-sm font-medium font-grotesk truncate">{data.projectName}</span>
            </div>

            {/* Pulse title */}
            <h2
              className="mt-1.5 text-lg font-bold leading-snug font-grotesk"
              style={{ color: '#f8fafc' }}
            >
              {data.pulseTitle}
            </h2>

            {/* Artist handle */}
            <div className="mt-1 flex items-center gap-2">
              <div
                className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
                style={{ background: `${fillColor}20`, color: fillColor }}
              >
                {data.artistHandle.charAt(1).toUpperCase()}
              </div>
              <span className="text-zinc-400 text-sm font-mono">{data.artistHandle}</span>
            </div>
          </div>
        </div>

        {/* Verification badge */}
        <div className="flex-shrink-0">
          <VerificationBadge hash={data.shaHash} accentColor={accentColor} />
        </div>
      </div>

      {/* ── Status bar ── */}
      <div className="px-6 pb-4 flex items-center gap-3">
        <div
          className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold font-grotesk"
          style={{
            background: `${statusColor}15`,
            border: `1px solid ${statusColor}30`,
            color: statusColor,
          }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: statusColor, boxShadow: `0 0 4px ${statusColor}` }}
          />
          {data.status}
        </div>
        <span className="text-zinc-600 text-xs font-mono">·</span>
        <span className="text-zinc-500 text-xs font-mono">
          Certified {data.certifyTimestamp}
        </span>
      </div>

      {/* ── Description ── */}
      <div className="px-6 pb-4">
        <p className="text-zinc-400 text-sm leading-relaxed">{data.description}</p>
      </div>

      {/* ── Live Pulse Section ── */}
      <div className="px-6 pb-5">
        <div
          className="rounded-2xl overflow-hidden"
          style={{
            background: 'rgba(0,0,0,0.25)',
            border: `1px solid ${fillColor}20`,
          }}
        >
          {/* Live Pulse header */}
          <div
            className="flex items-center justify-between px-4 py-2.5"
            style={{ borderBottom: `1px solid ${fillColor}15` }}
          >
            <div className="flex items-center gap-2">
              <div
                className="w-1.5 h-1.5 rounded-full animate-pulse"
                style={{ background: fillColor, boxShadow: `0 0 5px ${fillColor}` }}
              />
              <span
                className="text-xs font-bold uppercase tracking-widest font-grotesk"
                style={{ color: fillColor }}
              >
                Live Pulse
              </span>
            </div>
            <span className="text-zinc-600 text-xs font-mono">
              {data.pulseMediaType === 'audio'
                ? '0:30 preview'
                : data.pulseMediaType === 'script'
                ? 'script excerpt'
                : 'storyboard'}
            </span>
          </div>

          {/* Media content */}
          <div className="p-4">
            {data.pulseMediaType === 'audio' && (
              <div>
                <AudioWaveform accentColor={accentColor} isPlaying={isPlaying} />
                <div className="flex items-center justify-between mt-3">
                  <button
                    onClick={() => setIsPlaying(p => !p)}
                    className="flex items-center gap-2 px-4 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 active:scale-95 font-grotesk"
                    style={{
                      background: isPlaying ? `${fillColor}25` : `${fillColor}15`,
                      color: fillColor,
                      border: `1px solid ${fillColor}${isPlaying ? '50' : '30'}`,
                      boxShadow: isPlaying ? `0 0 12px ${fillColor}30` : 'none',
                    }}
                  >
                    {isPlaying ? (
                      <>
                        <svg className="w-3 h-3" fill={fillColor} viewBox="0 0 24 24">
                          <rect x="6" y="4" width="4" height="16" rx="1"/>
                          <rect x="14" y="4" width="4" height="16" rx="1"/>
                        </svg>
                        Pause
                      </>
                    ) : (
                      <>
                        <svg className="w-3 h-3" fill={fillColor} viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z"/>
                        </svg>
                        Play Preview
                      </>
                    )}
                  </button>
                  <span className="text-zinc-600 text-xs font-mono">
                    {isPlaying ? '0:12 / 0:30' : '0:00 / 0:30'}
                  </span>
                </div>
              </div>
            )}

            {data.pulseMediaType === 'script' && data.script && (
              <ScriptSnippet script={data.script} accentColor={accentColor} />
            )}

            {data.pulseMediaType === 'storyboard' && data.storyboardScene && (
              <StoryboardFrame
                accentColor={accentColor}
                frameLabel={data.storyboardLabel || 'FRAME 01'}
                scene={data.storyboardScene}
              />
            )}
          </div>
        </div>
      </div>

      {/* ── Action Buttons ── */}
      <div className="px-6 pb-4 flex items-center gap-3 flex-wrap">
        {/* Sync-to-Collab */}
        <button
          onClick={handleSync}
          className="flex items-center gap-2 px-4 py-2 rounded-2xl text-sm font-semibold transition-all duration-200 active:scale-95 font-grotesk"
          style={{
            background: synced
              ? `linear-gradient(135deg, ${fillColor}30, ${fillColor}15)`
              : 'rgba(255,255,255,0.05)',
            color: synced ? fillColor : '#94a3b8',
            border: `1px solid ${synced ? fillColor + '50' : 'rgba(255,255,255,0.08)'}`,
            boxShadow: synced ? `0 0 16px ${fillColor}25` : 'none',
          }}
        >
          <svg
            className="w-4 h-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M8 3H5a2 2 0 0 0-2 2v3" />
            <path d="M21 8V5a2 2 0 0 0-2-2h-3" />
            <path d="M3 16v3a2 2 0 0 0 2 2h3" />
            <path d="M16 21h3a2 2 0 0 0 2-2v-3" />
            <path d="M12 8v8" />
            <path d="M8 12h8" />
          </svg>
          Sync-to-Collab
          <span
            className="text-xs px-1.5 py-0.5 rounded-lg font-mono"
            style={{
              background: 'rgba(0,0,0,0.3)',
              color: synced ? fillColor : '#64748b',
            }}
          >
            {syncCount}
          </span>
        </button>

        {/* Thread / Beat-Back / Frame-Back */}
        <button
          onClick={() => setThreadOpen(t => !t)}
          className="flex items-center gap-2 px-4 py-2 rounded-2xl text-sm font-semibold transition-all duration-200 active:scale-95 font-grotesk"
          style={{
            background: threadOpen
              ? `linear-gradient(135deg, ${fillColor}20, ${fillColor}08)`
              : 'rgba(255,255,255,0.05)',
            color: threadOpen ? fillColor : '#94a3b8',
            border: `1px solid ${threadOpen ? fillColor + '40' : 'rgba(255,255,255,0.08)'}`,
          }}
        >
          <span>{threadIcon}</span>
          {threadLabel}
          <span
            className="text-xs px-1.5 py-0.5 rounded-lg font-mono"
            style={{ background: 'rgba(0,0,0,0.3)', color: '#64748b' }}
          >
            {data.threadCount + threads.length}
          </span>
        </button>

        {/* More options */}
        <button
          className="ml-auto flex items-center justify-center w-9 h-9 rounded-2xl transition-all duration-200 active:scale-95"
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            color: '#64748b',
          }}
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <circle cx="5" cy="12" r="2"/>
            <circle cx="12" cy="12" r="2"/>
            <circle cx="19" cy="12" r="2"/>
          </svg>
        </button>
      </div>

      {/* ── Thread Panel ── */}
      {threadOpen && (
        <div
          className="mx-6 mb-6 rounded-2xl overflow-hidden"
          style={{
            background: 'rgba(0,0,0,0.2)',
            border: `1px solid ${fillColor}15`,
          }}
        >
          <div
            className="px-4 py-2.5 flex items-center gap-2"
            style={{ borderBottom: `1px solid ${fillColor}10` }}
          >
            <span className="text-xs font-bold uppercase tracking-wider font-grotesk text-zinc-500">
              {threadLabel} Thread
            </span>
          </div>

          {/* Existing threads */}
          <div className="px-4 py-3 space-y-2 max-h-40 overflow-y-auto scrollbar-thin">
            {threads.length === 0 && (
              <p className="text-zinc-600 text-xs font-mono">
                No responses yet. Be the first to drop a {threadLabel}.
              </p>
            )}
            {threads.map((t, i) => (
              <div key={i} className="flex gap-2 items-start">
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold mt-0.5 flex-shrink-0"
                  style={{ background: `${fillColor}20`, color: fillColor }}
                >
                  Y
                </div>
                <p className="text-zinc-300 text-sm leading-relaxed">{t}</p>
              </div>
            ))}
          </div>

          {/* Input */}
          <div
            className="flex items-center gap-2 px-3 py-3"
            style={{ borderTop: `1px solid ${fillColor}10` }}
          >
            <input
              type="text"
              value={threadInput}
              onChange={e => setThreadInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleThreadSubmit()}
              placeholder={`Drop a ${threadLabel}...`}
              className="flex-1 bg-transparent text-sm text-zinc-300 placeholder-zinc-600 outline-none font-grotesk"
            />
            <button
              onClick={handleThreadSubmit}
              disabled={!threadInput.trim()}
              className="flex items-center justify-center w-8 h-8 rounded-xl transition-all duration-200 active:scale-95 disabled:opacity-30"
              style={{
                background: `${fillColor}20`,
                color: fillColor,
                border: `1px solid ${fillColor}30`,
              }}
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path d="M22 2L11 13" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M22 2L15 22l-4-9-9-4 19-7z" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
