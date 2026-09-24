'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Mic, 
  MicOff, 
  Sparkles, 
  CornerDownLeft, 
  Terminal, 
  CheckCircle2, 
  AlertCircle, 
  HelpCircle, 
  Radio,
  X
} from 'lucide-react';
import { useTheme } from '@/components/ThemeProvider';

interface VoiceCommandCenterProps {
  onNavigate?: (pageId: number) => void;
  className?: string;
  compact?: boolean;
}

interface CommandMatch {
  action: string;
  description: string;
  execute: () => void;
}

export default function VoiceCommandCenter({ onNavigate, className = '', compact = false }: VoiceCommandCenterProps) {
  const { theme, toggleTheme, setTheme } = useTheme();
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [statusMessage, setStatusMessage] = useState<string>(() => {
    if (typeof window === 'undefined') return 'Ready for voice command';
    const hasSpeech = Boolean((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition);
    return hasSpeech ? 'Ready for voice command' : 'Voice recognition not supported in this browser. Type commands below.';
  });
  const [lastExecuted, setLastExecuted] = useState<{ action: string; time: string } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState<boolean>(() => {
    if (typeof window === 'undefined') return true;
    return Boolean((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition);
  });
  const [showCheatsheet, setShowCheatsheet] = useState<boolean>(false);
  const [textInput, setTextInput] = useState<string>('');

  const recognitionRef = useRef<any>(null);
  const executionTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const processVoiceCommand = useCallback((rawText: string) => {
    const text = rawText.toLowerCase().trim();
    if (!text) return;

    // Navigation Mapping
    const commands: { [key: string]: CommandMatch } = {
      commandCenter: {
        action: 'Command Center',
        description: 'Navigate to Command Center overview',
        execute: () => onNavigate?.(0),
      },
      profile: {
        action: 'User Profile',
        description: 'Navigate to Profile & Identity',
        execute: () => onNavigate?.(1),
      },
      assetManager: {
        action: 'Asset Management',
        description: 'Open Folders & Media Assets',
        execute: () => onNavigate?.(2),
      },
      analytics: {
        action: 'Economics & Analytics',
        description: 'View Revenue, Royalties & Stats',
        execute: () => onNavigate?.(3),
      },
      licensing: {
        action: 'Licensing Compacts',
        description: 'Open Agreement Builder',
        execute: () => onNavigate?.(4),
      },
      royaltySandbox: {
        action: 'Royalty Sandbox',
        description: 'Simulate on-chain payout splits',
        execute: () => onNavigate?.(5),
      },
      inbox: {
        action: 'Creator Inbox',
        description: 'Check Messages & Notarization Alerts',
        execute: () => onNavigate?.(6),
      },
      googleSlides: {
        action: 'Google Slides Gateway',
        description: 'Manage Pitch Decks & Presentations',
        execute: () => onNavigate?.(7),
      },
      launchPlanner: {
        action: 'Launch Planner',
        description: 'Track Milestones & Roadmap',
        execute: () => onNavigate?.(8),
      },
      techStack: {
        action: 'Tech Stack Ledger',
        description: 'View Smart Contracts & Zero Trust Architecture',
        execute: () => onNavigate?.(9),
      },
      about: {
        action: 'About Platform',
        description: 'View Platform Manifesto & Details',
        execute: () => onNavigate?.(10),
      },
      aiVault: {
        action: 'AI Training Vault',
        description: 'Configure anti-scraping tags & AI licensing',
        execute: () => onNavigate?.(11),
      },
      tokenizer: {
        action: 'Sovereign Tokenizer',
        description: 'Tokenize digital media & datasets',
        execute: () => onNavigate?.(12),
      },
      creatorNetwork: {
        action: 'Creator Network',
        description: 'Discover verified co-creators & partners',
        execute: () => onNavigate?.(13),
      },
      permissions: {
        action: 'Permissions Hub',
        description: 'Instant video & sync rights clearance',
        execute: () => onNavigate?.(14),
      },
      diagnostics: {
        action: 'System Diagnostics',
        description: 'Cloudflare Handshake & Tunnel Diagnostics',
        execute: () => onNavigate?.(15),
      },
      legalNotices: {
        action: 'Official IP Notices',
        description: 'Review Legal Communications & Filings',
        execute: () => onNavigate?.(16),
      },
      lightTheme: {
        action: 'Switch to Light Theme',
        description: 'Toggle light visual theme',
        execute: () => setTheme('light'),
      },
      darkTheme: {
        action: 'Switch to Dark Theme',
        description: 'Toggle dark cybernetic theme',
        execute: () => setTheme('dark'),
      },
      toggleTheme: {
        action: 'Toggle Theme',
        description: 'Flip between light and dark modes',
        execute: () => toggleTheme(),
      },
      help: {
        action: 'Help & Cheatsheet',
        description: 'Display available voice commands',
        execute: () => setShowCheatsheet(true),
      },
    };

    let matched: CommandMatch | null = null;

    if (text.includes('asset') || text.includes('folder') || text.includes('upload') || text.includes('media') || text.includes('file')) {
      matched = commands.assetManager;
    } else if (text.includes('sandbox') || text.includes('simulate') || text.includes('payout') || text.includes('calculator') || text.includes('split')) {
      matched = commands.royaltySandbox;
    } else if (text.includes('license') || text.includes('licensing') || text.includes('compact') || text.includes('agreement') || text.includes('contract')) {
      matched = commands.licensing;
    } else if (text.includes('analytic') || text.includes('stat') || text.includes('revenue') || text.includes('earning') || text.includes('metric') || text.includes('chart')) {
      matched = commands.analytics;
    } else if (text.includes('permission') || text.includes('sync') || text.includes('clearance') || text.includes('video right')) {
      matched = commands.permissions;
    } else if (text.includes('ai') || text.includes('vault') || text.includes('crawler') || text.includes('scraping') || text.includes('training')) {
      matched = commands.aiVault;
    } else if (text.includes('token') || text.includes('tokenize') || text.includes('mint')) {
      matched = commands.tokenizer;
    } else if (text.includes('network') || text.includes('collaborat') || text.includes('partner') || text.includes('community')) {
      matched = commands.creatorNetwork;
    } else if (text.includes('inbox') || text.includes('message') || text.includes('mail') || text.includes('alert')) {
      matched = commands.inbox;
    } else if (text.includes('slide') || text.includes('deck') || text.includes('presentation')) {
      matched = commands.googleSlides;
    } else if (text.includes('launch') || text.includes('roadmap') || text.includes('plan') || text.includes('milestone')) {
      matched = commands.launchPlanner;
    } else if (text.includes('tech stack') || text.includes('ledger') || text.includes('architecture')) {
      matched = commands.techStack;
    } else if (text.includes('profile') || text.includes('account') || text.includes('setting')) {
      matched = commands.profile;
    } else if (text.includes('diagnostic') || text.includes('cloudflare') || text.includes('tunnel') || text.includes('health')) {
      matched = commands.diagnostics;
    } else if (text.includes('notice') || text.includes('legal') || text.includes('trademark')) {
      matched = commands.legalNotices;
    } else if (text.includes('about') || text.includes('manifesto')) {
      matched = commands.about;
    } else if (text.includes('home') || text.includes('command center') || text.includes('overview') || text.includes('dashboard')) {
      matched = commands.commandCenter;
    } else if (text.includes('light') || text.includes('day')) {
      matched = commands.lightTheme;
    } else if (text.includes('dark') || text.includes('night')) {
      matched = commands.darkTheme;
    } else if (text.includes('theme')) {
      matched = commands.toggleTheme;
    } else if (text.includes('help') || text.includes('command') || text.includes('what can i say')) {
      matched = commands.help;
    }

    if (matched) {
      const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setLastExecuted({ action: matched.action, time: now });
      setStatusMessage(`Executing: ${matched.action}`);

      if (executionTimeoutRef.current) clearTimeout(executionTimeoutRef.current);
      executionTimeoutRef.current = setTimeout(() => {
        matched?.execute();
        setStatusMessage(`Active in ${matched?.action}`);
      }, 500);
    } else {
      setStatusMessage(`Command not recognized: "${rawText}". Try "Open Asset Manager" or "Simulate Payouts"`);
    }
  }, [onNavigate, setTheme, toggleTheme]);

  const toggleMicrophone = useCallback(() => {
    if (!isSupported) {
      setErrorMessage('Speech Recognition is not supported by your browser. Please use the text input below.');
      return;
    }

    if (isListening) {
      try {
        recognitionRef.current?.stop();
      } catch (e) {
        // ignore
      }
      setIsListening(false);
      setStatusMessage('Microphone deactivated');
    } else {
      setErrorMessage(null);
      setTranscript('');
      setInterimTranscript('');
      try {
        recognitionRef.current?.start();
      } catch (e: any) {
        try {
          recognitionRef.current?.abort();
          setTimeout(() => recognitionRef.current?.start(), 100);
        } catch (innerError) {
          console.error('Mic start error:', innerError);
        }
      }
    }
  }, [isListening, isSupported]);

  // Initialize Web Speech API
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        setErrorMessage(null);
        setStatusMessage('Listening... Speak your command now');
      };

      recognition.onresult = (event: any) => {
        let currentInterim = '';
        let currentFinal = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const item = event.results[i];
          if (item.isFinal) {
            currentFinal += item[0].transcript;
          } else {
            currentInterim += item[0].transcript;
          }
        }

        if (currentInterim) {
          setInterimTranscript(currentInterim);
        }

        if (currentFinal) {
          const cleanText = currentFinal.trim();
          setTranscript(cleanText);
          setInterimTranscript('');
          processVoiceCommand(cleanText);
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition event:', event.error);
        setIsListening(false);
        setInterimTranscript('');

        if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
          setErrorMessage('Microphone access blocked. Please allow microphone permissions in browser.');
          setStatusMessage('Microphone blocked');
        } else if (event.error === 'no-speech') {
          setStatusMessage('No speech detected. Click the mic to try again.');
        } else if (event.error === 'network') {
          setErrorMessage('Network error during speech recognition.');
          setStatusMessage('Network connection issue');
        } else {
          setStatusMessage(`Recognition paused (${event.error})`);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    } catch (err) {
      console.error('Failed to initialize speech recognition:', err);
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {
          // ignore
        }
      }
      if (executionTimeoutRef.current) {
        clearTimeout(executionTimeoutRef.current);
      }
    };
  }, [processVoiceCommand]);

  // Keyboard shortcut: Press 'v' to toggle mic when not typing in an input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeTag = document.activeElement?.tagName.toLowerCase();
      if (activeTag === 'input' || activeTag === 'textarea' || activeTag === 'select') {
        return;
      }
      if (e.key === 'v' || e.key === 'V') {
        e.preventDefault();
        toggleMicrophone();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleMicrophone]);

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!textInput.trim()) return;
    setTranscript(textInput);
    processVoiceCommand(textInput);
    setTextInput('');
  };

  return (
    <div className={`w-full relative ${className}`}>
      {/* Main Command Console Card */}
      <div className="bg-zinc-950/90 border border-zinc-800 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-2xl relative overflow-hidden backdrop-blur-xl">
        {/* Glow ambient accent */}
        <div className="absolute top-0 right-0 w-80 h-32 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 space-y-4">
          {/* Header Row: Title + Mic Status Badge + Cheatsheet Toggle */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-900/80 pb-3.5">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-cyan-950/50 border border-cyan-500/30 text-cyan-400">
                <Terminal className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider font-mono text-white">
                    Voice Command Center
                  </h3>
                  <span className="px-2 py-0.5 text-[9px] font-mono font-bold rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300">
                    BETA
                  </span>
                </div>
                <p className="text-[10px] text-zinc-400 font-sans">
                  Hands-free creator workflow navigation &amp; utility controls
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowCheatsheet(!showCheatsheet)}
                className="px-2.5 py-1 text-[10px] font-mono text-zinc-400 hover:text-cyan-300 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer"
                title="View Voice Commands"
              >
                <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
                <span className="hidden sm:inline">Commands</span>
              </button>

              <div className={`px-2.5 py-1 rounded-lg border text-[10px] font-mono flex items-center gap-1.5 ${
                isListening 
                  ? 'bg-emerald-950/50 border-emerald-500/50 text-emerald-300 animate-pulse' 
                  : 'bg-zinc-900 border-zinc-800 text-zinc-400'
              }`}>
                <Radio className={`w-3 h-3 ${isListening ? 'text-emerald-400 animate-spin' : 'text-zinc-500'}`} />
                <span>{isListening ? 'LISTENING LIVE' : 'MIC STANDBY'}</span>
              </div>
            </div>
          </div>

          {/* Interactive Voice Bar Row: Microphone Toggle Button + Live Waves / Transcript */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            {/* Microphone Toggle Button */}
            <div className="md:col-span-3 lg:col-span-2 flex justify-center md:justify-start">
              <button
                type="button"
                onClick={toggleMicrophone}
                className={`relative group w-full md:w-auto px-5 py-3.5 rounded-2xl font-mono text-xs font-bold transition-all flex items-center justify-center gap-3 cursor-pointer shadow-lg select-none ${
                  isListening
                    ? 'bg-gradient-to-r from-red-600 via-rose-500 to-red-600 text-white shadow-red-950/50 ring-4 ring-red-500/30'
                    : 'bg-cyan-500 hover:bg-cyan-400 text-black shadow-cyan-950/40 hover:shadow-cyan-500/20 active:scale-95'
                }`}
                aria-label={isListening ? 'Stop Listening' : 'Activate Microphone Voice Control'}
                title={isListening ? 'Click to stop listening' : 'Click to speak or press V'}
              >
                {/* Audio pulse ring when active */}
                {isListening && (
                  <span className="absolute -inset-1 rounded-2xl bg-red-500/40 animate-ping pointer-events-none" />
                )}

                <div className="relative flex items-center justify-center">
                  {isListening ? (
                    <Mic className="w-5 h-5 animate-bounce text-white" />
                  ) : (
                    <Mic className="w-5 h-5 group-hover:scale-110 transition-transform text-black" />
                  )}
                </div>

                <div className="text-left flex flex-col">
                  <span className="leading-tight uppercase tracking-wider text-[11px]">
                    {isListening ? 'Stop Mic' : 'Speak'}
                  </span>
                  <span className="text-[8px] opacity-75 font-normal">
                    {isListening ? 'Recording' : 'Press "V" key'}
                  </span>
                </div>
              </button>
            </div>

            {/* Live Audio Feedback & Transcript Box */}
            <div className="md:col-span-9 lg:col-span-10">
              <div className="bg-[#09090b] border border-zinc-900 rounded-xl p-3 sm:p-4 flex flex-col justify-between min-h-[72px] space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-[11px] font-mono">
                    <span className="text-zinc-500 uppercase tracking-widest text-[9px]">Status:</span>
                    <span className={`font-semibold ${isListening ? 'text-emerald-400 animate-pulse' : 'text-zinc-300'}`}>
                      {statusMessage}
                    </span>
                  </div>

                  {/* Equalizer animation when listening */}
                  {isListening && (
                    <div className="flex items-end gap-1 h-4">
                      <span className="w-1 bg-cyan-400 rounded-full animate-[pulse_0.6s_ease-in-out_infinite]" style={{ height: '60%' }} />
                      <span className="w-1 bg-emerald-400 rounded-full animate-[pulse_0.4s_ease-in-out_infinite]" style={{ height: '100%' }} />
                      <span className="w-1 bg-cyan-300 rounded-full animate-[pulse_0.7s_ease-in-out_infinite]" style={{ height: '80%' }} />
                      <span className="w-1 bg-emerald-300 rounded-full animate-[pulse_0.5s_ease-in-out_infinite]" style={{ height: '40%' }} />
                      <span className="w-1 bg-cyan-500 rounded-full animate-[pulse_0.8s_ease-in-out_infinite]" style={{ height: '90%' }} />
                    </div>
                  )}
                </div>

                {/* Display words as user speaks */}
                <div className="text-xs font-mono min-h-[22px] flex items-center">
                  {interimTranscript ? (
                    <span className="text-cyan-300 italic flex items-center gap-1.5 animate-pulse">
                      <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                      &quot;{interimTranscript}...&quot;
                    </span>
                  ) : transcript ? (
                    <span className="text-white font-medium flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      &quot;{transcript}&quot;
                    </span>
                  ) : (
                    <span className="text-zinc-500 text-[11px] italic">
                      {isListening 
                        ? 'Say "Open Asset Manager", "Simulate Payouts", or "Switch to Light Mode"...' 
                        : 'Click the Speak button or type a command below'}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Voice Prompt Suggestions */}
          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500">
              <span className="uppercase tracking-wider">Quick Command Chips (Click or Speak):</span>
              {lastExecuted && (
                <span className="text-emerald-400 font-bold">
                  Last: {lastExecuted.action} ({lastExecuted.time})
                </span>
              )}
            </div>

            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {[
                { label: 'Open Asset Manager', cmd: 'open asset manager', icon: '📁' },
                { label: 'Simulate Royalties', cmd: 'open royalty sandbox', icon: '⚡' },
                { label: 'View Analytics', cmd: 'show analytics', icon: '📊' },
                { label: 'Licensing Builder', cmd: 'open licensing compacts', icon: '⚖️' },
                { label: 'AI Training Vault', cmd: 'open ai vault', icon: '🧠' },
                { label: 'Permissions Hub', cmd: 'open permissions hub', icon: '🔒' },
                { label: 'Switch Theme', cmd: 'toggle theme', icon: '🌓' },
              ].map((chip) => (
                <button
                  key={chip.label}
                  type="button"
                  onClick={() => {
                    setTranscript(chip.cmd);
                    processVoiceCommand(chip.cmd);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-zinc-900/80 hover:bg-zinc-850 border border-zinc-800 hover:border-cyan-500/40 text-[10px] font-mono text-zinc-300 hover:text-cyan-300 transition-all flex items-center gap-1.5 cursor-pointer shadow-sm group"
                >
                  <span className="text-[10px] group-hover:scale-110 transition-transform">{chip.icon}</span>
                  <span>&quot;{chip.label}&quot;</span>
                </button>
              ))}
            </div>
          </div>

          {/* Text Command Fallback Bar */}
          <form onSubmit={handleTextSubmit} className="pt-2 border-t border-zinc-900/80">
            <div className="relative flex items-center">
              <span className="absolute left-3 text-cyan-400 font-mono text-xs font-bold pointer-events-none">
                &gt;
              </span>
              <input
                type="text"
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder="Or type a command (e.g. 'open inbox', 'switch to dark mode', 'help')..."
                className="w-full bg-[#09090b] border border-zinc-850 hover:border-zinc-700 focus:border-cyan-500/80 rounded-xl pl-8 pr-24 py-2.5 text-xs font-mono text-white placeholder-zinc-500 focus:outline-none transition-all shadow-inner"
              />
              <button
                type="submit"
                disabled={!textInput.trim()}
                className="absolute right-1.5 px-3 py-1.5 bg-cyan-950/60 hover:bg-cyan-900/60 disabled:opacity-30 disabled:cursor-not-allowed border border-cyan-500/30 text-cyan-300 text-[10px] font-mono font-bold rounded-lg flex items-center gap-1 transition-all cursor-pointer"
              >
                <span>Execute</span>
                <CornerDownLeft className="w-3 h-3" />
              </button>
            </div>
          </form>

          {/* Error Banner */}
          {errorMessage && (
            <div className="p-3 bg-red-950/40 border border-red-500/30 rounded-xl flex items-center justify-between text-xs text-red-300 font-mono">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{errorMessage}</span>
              </div>
              <button
                type="button"
                onClick={() => setErrorMessage(null)}
                className="p-1 hover:text-white transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Cheatsheet Modal */}
      {showCheatsheet && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-zinc-950 border border-zinc-800 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-5 relative max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
              <div className="flex items-center gap-2">
                <Terminal className="w-5 h-5 text-cyan-400" />
                <h3 className="text-base font-bold font-mono text-white">
                  Voice Command Dictionary
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowCheatsheet(false)}
                className="p-1 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-900 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-zinc-400 leading-relaxed font-sans">
              Speak naturally into your microphone using any of the voice phrases below. The Command Center parser automatically matches keywords and executes the navigation or system control immediately.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
              {[
                { category: 'Portfolio & Media', phrases: ['"Open Asset Manager"', '"Upload files"', '"Go to folders"'], target: 'Step 1: Asset Management' },
                { category: 'Licensing & Compacts', phrases: ['"Open Licensing"', '"Build license agreement"', '"Commercial compacts"'], target: 'Step 2: Licensing Hub' },
                { category: 'Royalty Simulator', phrases: ['"Simulate payouts"', '"Royalty sandbox"', '"Test 85% splits"'], target: 'Step 3: Royalty Sandbox' },
                { category: 'Economics & Revenue', phrases: ['"View analytics"', '"Show earnings"', '"Revenue metrics"'], target: 'Economics & Analytics' },
                { category: 'Rights & Permissions', phrases: ['"Open Permissions Hub"', '"Sync rights"', '"Video rights clearance"'], target: 'Permissions Clearance' },
                { category: 'AI Protection', phrases: ['"Open AI Training Vault"', '"Anti-scraping tags"', '"Crawler opt-out"'], target: 'AI Training Vault' },
                { category: 'Tokenization', phrases: ['"Open Tokenizer"', '"Tokenize media"', '"Tokenize dataset"'], target: 'Sovereign Tokenizer' },
                { category: 'Community & Inbox', phrases: ['"Open Inbox"', '"Check messages"', '"Creator Network"'], target: 'Inbox / Network' },
                { category: 'Presentations & Roadmap', phrases: ['"Open Google Slides"', '"Launch Planner"', '"Roadmap"'], target: 'Slides & Roadmap' },
                { category: 'Display & Themes', phrases: ['"Switch to Light Mode"', '"Switch to Dark Mode"', '"Toggle Theme"'], target: 'Theme System' },
              ].map((item, idx) => (
                <div key={idx} className="bg-zinc-900/60 border border-zinc-800/80 p-3.5 rounded-xl space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] font-bold text-cyan-400">
                    <span>{item.category}</span>
                    <span className="text-[9px] text-zinc-500">→ {item.target}</span>
                  </div>
                  <div className="space-y-0.5 text-zinc-300 text-[10px]">
                    {item.phrases.map((phrase, pIdx) => (
                      <div key={pIdx} className="text-zinc-400">
                        • <span className="text-white font-semibold">{phrase}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-zinc-900 flex justify-end">
              <button
                type="button"
                onClick={() => setShowCheatsheet(false)}
                className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-black font-mono text-xs font-bold rounded-xl transition-all cursor-pointer"
              >
                Close Dictionary
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
