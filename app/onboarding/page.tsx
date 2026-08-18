'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  ArrowRight, 
  ArrowLeft,
  Compass, 
  Coins, 
  Scale, 
  ChevronRight, 
  Code2, 
  Music, 
  BookOpen, 
  Film, 
  Terminal,
  Play,
  Lock,
  Volume1,
  Activity,
  ShieldCheck,
  Brain,
  Briefcase,
  Phone,
  TrendingUp,
  Calendar,
  Workflow,
  Users,
  MessageSquare,
  Cpu
} from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/components/auth/FirebaseProvider';
import { getAuthHeaders } from '@/lib/auth-client';
import { motion, AnimatePresence } from 'motion/react';

type Message = {
  role: 'user' | 'model';
  content: string;
  id: string;
  timestamp: string;
  sources?: { title: string; url: string }[];
};

type TourStep = {
  title: string;
  subtitle: string;
  icon: any;
  color: string;
  promptHint: string;
  description: string;
  visualLabel: string;
};

export default function OnboardingVoiceAgent() {
  const { user, isSandboxMode } = useAuth();
  // Speech Recognition support pre-check
  const [speechSupported] = useState(() => {
    if (typeof window !== 'undefined') {
      return !!((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition);
    }
    return false;
  });

  // State Declarations
  const [activeTab, setActiveTab] = useState<'voice' | 'subagents' | 'console'>('voice');
  const [selectedSubagent, setSelectedSubagent] = useState<'adrienne' | 'sage' | 'aria' | 'maya' | 'jordan' | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [activeWorkflowIndex, setActiveWorkflowIndex] = useState<number | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'model',
      content: "Well hello there, child. Welcome to Sovranly IP. I am Adrienne, your Chief Sovereign IP Coordinator, and I am here to guide your creative soul. I've been engineered to guide you through our Zero-Trust intellectual property registry, walk you through our automated royalty splitting pipelines, or design your tailored asset trademark strategy. I orchestrate a team of five specialized subagents—including our Sage CFO subagent, Comms Leads, and Opportunity Scouts—to run this entire ecosystem for you. Shall we begin a guided platform tour, or would you like to ask me or one of my subagents a question?",
      id: 'welcome-msg',
      timestamp: '08:00 AM'
    }
  ]);
  const [textInput, setTextInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [isVoiceMuted, setIsVoiceMuted] = useState(false);
  const [activeVoice, setActiveVoice] = useState<'adrienne' | 'oracle' | 'guide'>('adrienne');

  // Speech Recognition States
  const [isListening, setIsListening] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState('');
  const [recognitionError, setRecognitionError] = useState<string | null>(null);

  // Speech Synthesis States
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Guided Tour States
  const [tourStep, setTourStep] = useState<number>(0); 
  const [isTourActive, setIsTourActive] = useState(false);

  // Discovery Client Profile States
  const [clientProfile, setClientProfile] = useState<{
    creatorType: 'musician' | 'writer' | 'developer' | 'filmmaker' | 'artist' | 'youtuber' | null;
    hasCollaborators: 'yes' | 'no' | null;
    primaryGoal: 'timestamp' | 'licensing' | 'splits' | 'ai_defense' | null;
    budgetTier: 'independent' | 'funded' | null;
  }>({
    creatorType: null,
    hasCollaborators: null,
    primaryGoal: null,
    budgetTier: null,
  });

  const [showRecommendation, setShowRecommendation] = useState(false);

  // Ref Counters to generate Pure, Sequential IDs and Timestamps
  const msgIdCounter = useRef(1);
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const activeUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const tourSteps: TourStep[] = [
    {
      title: "Gateway Portal",
      subtitle: "The Sovereign IP Paradigm",
      icon: Compass,
      color: "from-cyan-500 to-blue-500",
      promptHint: "Please explain the core vision of Sovranly IP and why Zero Trust matters for independent creators.",
      description: "Welcome to the creator-first frontier. Sovranly IP removes costly middlemen, placing full cryptographic ownership and control directly into your hands.",
      visualLabel: "SECURE LAYER 0"
    },
    {
      title: "On-Chain Registry",
      subtitle: "Proof of Creation",
      icon: Lock,
      color: "from-blue-500 to-indigo-500",
      promptHint: "How do I timestamp my work, get a SHA-256 certificate, and prove I created it first?",
      description: "Anchor your digital works (YouTube videos, beats, artwork, code) into immutable blockchain registries to establish permanent, tamper-proof proof of creation.",
      visualLabel: "REGISTRY LEDGER"
    },
    {
      title: "Atomic Splits",
      subtitle: "Immediate Micropayments",
      icon: Coins,
      color: "from-emerald-500 to-cyan-500",
      promptHint: "Explain the standard 85/15 royalty splits and direct creator payouts.",
      description: "Zero payment delays. When your work is licensed, 85% is routed directly to your wallet/payout instantly, while 15% maintains network infrastructure.",
      visualLabel: "PAYMENT ROUTER"
    },
    {
      title: "Smart Licensing & AI Defense",
      subtitle: "Custom Terms & Anti-Scraping",
      icon: Scale,
      color: "from-amber-500 to-orange-500",
      promptHint: "How do I set commercial licensing terms and prevent AI bots from training on my work without permission?",
      description: "Define your own commercial usage rules, set licensing fees, and attach machine-readable bot exclusion tags to block unapproved AI training scrapers.",
      visualLabel: "SMART LICENSING"
    },
    {
      title: "Specialized Sovereign Tracks",
      subtitle: "Tailored Media Pipelines",
      icon: Sparkles,
      color: "from-violet-500 to-fuchsia-500",
      promptHint: "What are the custom tracking paths for developers, musicians, YouTubers, and visual artists?",
      description: "Specific lanes built for each craft: Video & Stems Registry for Musicians & YouTubers, Git Commit Anchoring for Developers, and Screenplay/Art Ledgers.",
      visualLabel: "MEDIA INTERFACE"
    }
  ];

  // Voice Custom Styling Selector
  const getVoiceName = () => {
    switch (activeVoice) {
      case 'adrienne': return "Adrienne (Wisdom, Soulful)";
      case 'oracle': return "Technical Oracle";
      case 'guide': return "Creative Guide";
    }
  };

  // Convert Gemini Text response to sound via Web Speech Synthesis
  const speakText = (text: string) => {
    if (!synthRef.current || isVoiceMuted) return;

    // Cancel current speaking
    synthRef.current.cancel();

    // Clean text from Markdown tags (asterisks, hashtags, links) to sound fluent
    const cleanText = text
      .replace(/[\*\#\_]/g, '') 
      .replace(/\[(.*?)\]\(.*?\)/g, '$1') 
      .replace(/\-\s+/g, '') 
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanText);
    
    const voices = synthRef.current.getVoices();
    let selectedVoice = null;

    if (activeVoice === 'adrienne') {
      selectedVoice = voices.find(v => v.lang.startsWith('en') && (v.name.toLowerCase().includes('neural') || v.name.toLowerCase().includes('natural') || v.name.toLowerCase().includes('samantha') || v.name.toLowerCase().includes('google us english') || v.name.toLowerCase().includes('zira'))) ||
                      voices.find(v => v.lang.startsWith('en-US')) ||
                      voices[0];
      utterance.pitch = 0.92; // Warm, soulful, mature conversational tone
      utterance.rate = 0.94;  // Smooth, natural phrasing with expressive cadence
    } else if (activeVoice === 'oracle') {
      selectedVoice = voices.find(v => v.lang.startsWith('en-GB') && v.name.toLowerCase().includes('male')) ||
                      voices.find(v => v.lang.startsWith('en-GB')) ||
                      voices.find(v => v.lang.startsWith('en-US') && v.name.toLowerCase().includes('male')) ||
                      voices[0];
      utterance.pitch = 0.9;
      utterance.rate = 1.02;
    } else {
      selectedVoice = voices.find(v => v.lang.startsWith('en-US') && v.name.toLowerCase().includes('natural')) ||
                      voices.find(v => v.lang.startsWith('en-US') && v.name.toLowerCase().includes('zira')) ||
                      voices.find(v => v.lang.startsWith('en-US')) ||
                      voices[0];
      utterance.pitch = 1.1;
      utterance.rate = 1.0;
    }

    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    utterance.onstart = () => {
      setIsSpeaking(true);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
    };

    utterance.onerror = (e) => {
      console.error("Speech Synthesis Error:", e);
      setIsSpeaking(false);
    };

    activeUtteranceRef.current = utterance;
    synthRef.current.speak(utterance);
  };

  // Automatically detect key features discussed in conversation
  const detectProfileFields = (text: string) => {
    const lowercase = text.toLowerCase();
    
    if (lowercase.includes('music') || lowercase.includes('musician') || lowercase.includes('song') || lowercase.includes('producer') || lowercase.includes('beat')) {
      updateProfile('creatorType', 'musician');
    } else if (lowercase.includes('youtube') || lowercase.includes('youtuber') || lowercase.includes('video') || lowercase.includes('vlog') || lowercase.includes('streamer') || lowercase.includes('tiktok')) {
      updateProfile('creatorType', 'youtuber');
    } else if (lowercase.includes('developer') || lowercase.includes('software') || lowercase.includes('git') || lowercase.includes('code') || lowercase.includes('algorithm')) {
      updateProfile('creatorType', 'developer');
    } else if (lowercase.includes('writer') || lowercase.includes('author') || lowercase.includes('book') || lowercase.includes('poetry') || lowercase.includes('novel')) {
      updateProfile('creatorType', 'writer');
    } else if (lowercase.includes('film') || lowercase.includes('screenplay') || lowercase.includes('movie') || lowercase.includes('screenwriter') || lowercase.includes('filmmaker')) {
      updateProfile('creatorType', 'filmmaker');
    } else if (lowercase.includes('art') || lowercase.includes('artist') || lowercase.includes('paint') || lowercase.includes('sculpt') || lowercase.includes('design') || lowercase.includes('illustrat')) {
      updateProfile('creatorType', 'artist');
    }

    if (lowercase.includes('collaborate') || lowercase.includes('partner') || lowercase.includes('split') || lowercase.includes('co-writer') || lowercase.includes('team')) {
      updateProfile('hasCollaborators', 'yes');
    }

    if (lowercase.includes('timestamp') || lowercase.includes('proof') || lowercase.includes('copyright') || lowercase.includes('protect')) {
      updateProfile('primaryGoal', 'timestamp');
    } else if (lowercase.includes('license') || lowercase.includes('sell') || lowercase.includes('commercial')) {
      updateProfile('primaryGoal', 'licensing');
    } else if (lowercase.includes('ai') || lowercase.includes('scraper') || lowercase.includes('bot') || lowercase.includes('scrape')) {
      updateProfile('primaryGoal', 'ai_defense');
    }

    if (lowercase.includes('small budget') || lowercase.includes('free') || lowercase.includes('starter') || lowercase.includes('first time') || lowercase.includes('independent')) {
      updateProfile('budgetTier', 'independent');
    } else if (lowercase.includes('funded') || lowercase.includes('venture') || lowercase.includes('enterprise') || lowercase.includes('company')) {
      updateProfile('budgetTier', 'funded');
    }
  };

  // Update client discovery parameters
  const updateProfile = (key: keyof typeof clientProfile, value: any) => {
    setClientProfile(prev => {
      const updated = { ...prev, [key]: value };
      if (updated.creatorType) {
        setShowRecommendation(true);
      }
      return updated;
    });
  };

  // Main Message Handler
  const handleUserMessage = async (text: string, forceTargetSubagent?: 'adrienne' | 'sage' | 'aria' | 'maya' | 'jordan' | null) => {
    if (!text.trim()) return;

    const subagent = forceTargetSubagent !== undefined ? forceTargetSubagent : selectedSubagent;
    let processedText = text;
    let displayContent = text;
    
    if (subagent && subagent !== 'adrienne') {
      const names = { 
        sage: 'Sage (CFO)', 
        aria: 'Aria (Comms & Support)', 
        maya: 'Maya (Opportunity Scout)', 
        jordan: 'Jordan (Personal Exec Assistant)' 
      };
      processedText = `[Querying Subagent: ${names[subagent]}] ${text}`;
      displayContent = `[To ${names[subagent]}]: ${text}`;
    }

    msgIdCounter.current += 1;
    const currentId = `msg_${msgIdCounter.current}`;
    
    const userMsg: Message = {
      role: 'user',
      content: displayContent,
      id: currentId,
      timestamp: 'Just now'
    };
    
    // We update state purely by appending the message
    setMessages(prev => [...prev, userMsg]);
    setIsThinking(true);

    detectProfileFields(text);

    try {
      // Fetch latest messages for history snapshot
      const headers = await getAuthHeaders(user, isSandboxMode);
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          ...headers
        },
        body: JSON.stringify({
          message: processedText,
          history: messages.map(m => ({ role: m.role, content: m.content }))
        })
      });

      const data = await res.json();
      if (data.text) {
        msgIdCounter.current += 1;
        const responseId = `msg_${msgIdCounter.current}`;

        const botMsg: Message = {
          role: 'model',
          content: data.text,
          id: responseId,
          timestamp: 'Just now',
          sources: data.sources
        };
        setMessages(prev => [...prev, botMsg]);
        setIsThinking(false);
        
        speakText(data.text);
      } else {
        throw new Error(data.error || "Failed payload");
      }
    } catch (err) {
      console.error("API Call error:", err);
      setIsThinking(false);
      
      msgIdCounter.current += 1;
      const responseId = `msg_${msgIdCounter.current}`;

      const errorMsg: Message = {
        role: 'model',
        content: "My connection to the sovereign security layer was temporarily interrupted. Please send your message again, or type your query below.",
        id: responseId,
        timestamp: 'Just now'
      };
      setMessages(prev => [...prev, errorMsg]);
    }
  };

  // Create a continuous, stable ref pointer to handleUserMessage for use in event handlers
  const handleUserMessageRef = useRef<any>(null);
  useEffect(() => {
    handleUserMessageRef.current = handleUserMessage;
  });

  // Setup Speech Web APIs
  useEffect(() => {
    if (typeof window !== 'undefined') {
      synthRef.current = window.speechSynthesis;
      
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const rec = new SpeechRecognition();
        rec.continuous = false;
        rec.interimResults = true;
        rec.lang = 'en-US';

        rec.onstart = () => {
          setIsListening(true);
          setRecognitionError(null);
        };

        rec.onresult = (event: any) => {
          let interim = '';
          let final = '';
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              final += event.results[i][0].transcript;
            } else {
              interim += event.results[i][0].transcript;
            }
          }
          setInterimTranscript(interim || final);
          if (final && handleUserMessageRef.current) {
            handleUserMessageRef.current(final.trim());
            setInterimTranscript('');
          }
        };

        rec.onerror = (event: any) => {
          console.error("Speech Recognition Error:", event.error);
          if (event.error !== 'no-speech') {
            setRecognitionError(event.error);
          }
          setIsListening(false);
        };

        rec.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = rec;
      }
    }

    return () => {
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  // Scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, interimTranscript, isThinking]);

  // Toggle Listening State
  const toggleListening = () => {
    if (!speechSupported) return;

    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      if (synthRef.current) {
        synthRef.current.cancel();
        setIsSpeaking(false);
      }
      try {
        recognitionRef.current?.start();
      } catch (err) {
        console.error("Start recognition error:", err);
      }
    }
  };

  // Trigger Tour Step Explicitly
  const triggerTourStep = async (stepIndex: number) => {
    if (stepIndex < 0 || stepIndex >= tourSteps.length) return;
    
    setTourStep(stepIndex);
    setIsTourActive(true);
    
    const step = tourSteps[stepIndex];
    const commandText = `[Tour Step ${stepIndex + 1}: ${step.title}] ${step.promptHint}`;
    
    setIsThinking(true);
    
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }

    try {
      const headers = await getAuthHeaders(user, isSandboxMode);
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          ...headers
        },
        body: JSON.stringify({
          message: commandText,
          history: messages.map(m => ({ role: m.role, content: m.content }))
        })
      });

      const data = await res.json();
      if (data.text) {
        msgIdCounter.current += 1;
        const responseId = `msg_${msgIdCounter.current}`;

        const tourAIResponse: Message = {
          role: 'model',
          content: data.text,
          id: responseId,
          timestamp: 'Just now',
          sources: data.sources
        };
        setMessages(prev => [...prev, tourAIResponse]);
        setIsThinking(false);
        speakText(data.text);
      }
    } catch (err) {
      console.error(err);
      setIsThinking(false);
    }
  };

  // Advance Tour Step
  const advanceTour = () => {
    const nextStep = tourStep + 1;
    if (nextStep < tourSteps.length) {
      triggerTourStep(nextStep);
    } else {
      setTourStep(5);
      const completionText = "Excellent. You have now completed our guided Zero-Trust media tour! Based on your profile, we have compiled a customized Sovereign Strategy. Review the active recommendation below, or click launch to deploy your on-chain nodes!";
      speakText(completionText);
      
      msgIdCounter.current += 1;
      const responseId = `msg_${msgIdCounter.current}`;

      setMessages(prev => [...prev, {
        role: 'model',
        content: completionText,
        id: responseId,
        timestamp: 'Just now'
      }]);
    }
  };

  // Reset Tour
  const resetTour = () => {
    setTourStep(0);
    setIsTourActive(false);
    speakText("Guided tour has been reset. How can I assist you with your sovereign assets today?");
  };

  // Run Sovereign Council workflow orchestrations
  const runWorkflowSync = (index: number) => {
    if (isSimulating) return;
    setIsSimulating(true);
    setActiveWorkflowIndex(index);
    
    msgIdCounter.current += 1;
    const startId = `sim_${msgIdCounter.current}`;
    
    setMessages(prev => [...prev, {
      role: 'user',
      content: `[Orchestrator Trigger]: ${index === 0 ? "Run Weekly Financial & Royalty Split Sync" : index === 1 ? "Scan Licensing Leads & Draft Outreach Email" : "Set Up Personal Creator Assistant Schedule"}`,
      id: startId,
      timestamp: 'Just now'
    }]);

    if (index === 0) {
      setTimeout(() => {
        msgIdCounter.current += 1;
        setMessages(prev => [...prev, {
          role: 'model',
          content: "Adrienne (Sovereign Orator): \"Sage, sweetheart, let's run that weekly sync. Make sure our creator's QuickBooks ledger is squared away and the 85/15 splits are balanced in the vault.\"",
          id: `sim_${msgIdCounter.current}`,
          timestamp: 'Just now'
        }]);
        speakText("Sage, sweetheart, let's run that weekly sync. Make sure our creator's QuickBooks ledger is squared away and the 85/15 splits are balanced in the vault.");
      }, 1500);

      setTimeout(() => {
        msgIdCounter.current += 1;
        setMessages(prev => [...prev, {
          role: 'model',
          content: "🤖 [Sage - CFO Subagent]: \"Ledger reconciliation initiated. Connecting to QuickBooks secure API endpoint... Weekly royalties successfully indexed. Split calculation validated at protocol-level: 85% routed directly to Creator MetaMask ($14,250 USD equivalent), 15% routed to automated platform gas pool ($2,514 USD). All asset-backed liability ledgers are fully aligned.\"",
          id: `sim_${msgIdCounter.current}`,
          timestamp: 'Just now'
        }]);
      }, 5000);

      setTimeout(() => {
        msgIdCounter.current += 1;
        const finalWise = "Well done, Sage. There is nothing like keeping the books clean and the money flowing directly where it belongs—to the hands that crafted the work.";
        setMessages(prev => [...prev, {
          role: 'model',
          content: `Adrienne: "${finalWise}"`,
          id: `sim_${msgIdCounter.current}`,
          timestamp: 'Just now'
        }]);
        speakText(finalWise);
        setIsSimulating(false);
        setActiveWorkflowIndex(null);
      }, 10000);

    } else if (index === 1) {
      setTimeout(() => {
        msgIdCounter.current += 1;
        setMessages(prev => [...prev, {
          role: 'model',
          content: "Adrienne (Sovereign Orator): \"Maya, find me those market opportunities for our creator. Jordan, get ready to structure the slide draft, and Aria, prepare to open the lines of communication.\"",
          id: `sim_${msgIdCounter.current}`,
          timestamp: 'Just now'
        }]);
        speakText("Maya, find me those market opportunities for our creator. Jordan, get ready to structure the slide draft, and Aria, prepare to open the lines of communication.");
      }, 1500);

      setTimeout(() => {
        msgIdCounter.current += 1;
        setMessages(prev => [...prev, {
          role: 'model',
          content: "🤖 [Maya - Opportunity Scout]: \"Active scans completed across creator licensing queries and media catalogs. Identified 4 high-demand synchronization opportunities for your media assets. Estimated placement fit: 88%. Passing asset package to Jordan for deck formatting.\"",
          id: `sim_${msgIdCounter.current}`,
          timestamp: 'Just now'
        }]);
      }, 4500);

      setTimeout(() => {
        msgIdCounter.current += 1;
        setMessages(prev => [...prev, {
          role: 'model',
          content: "🤖 [Jordan - Personal Exec Assistant]: \"Outbound presentation structure synchronized. Drafted a clean 5-slide visual pitch highlighting your SHA-256 copyright certificate and instant 85% creator royalty terms. Handing off to Aria for distribution queue.\"",
          id: `sim_${msgIdCounter.current}`,
          timestamp: 'Just now'
        }]);
      }, 7500);

      setTimeout(() => {
        msgIdCounter.current += 1;
        setMessages(prev => [...prev, {
          role: 'model',
          content: "🤖 [Aria - Comms Agent]: \"Automated email distribution queue prepared. Pitch deck and licensing agreements staged for 12 prospective partners. Real-time creator inbox is active and monitoring replies.\"",
          id: `sim_${msgIdCounter.current}`,
          timestamp: 'Just now'
        }]);
      }, 11000);

      setTimeout(() => {
        msgIdCounter.current += 1;
        const finalWise = "That is a beautiful circle of action, team. Creator, your opportunities are queued and your work is protected on the ledger. All you have to do is keep creating.";
        setMessages(prev => [...prev, {
          role: 'model',
          content: `Adrienne: "${finalWise}"`,
          id: `sim_${msgIdCounter.current}`,
          timestamp: 'Just now'
        }]);
        speakText(finalWise);
        setIsSimulating(false);
        setActiveWorkflowIndex(null);
      }, 15000);

    } else {
      setTimeout(() => {
        msgIdCounter.current += 1;
        setMessages(prev => [...prev, {
          role: 'model',
          content: "Adrienne (Sovereign Orator): \"Jordan, sweetheart, let's get our creator's weekly schedule in order. Aria, confirm our creator support lines and verification alerts are ready.\"",
          id: `sim_${msgIdCounter.current}`,
          timestamp: 'Just now'
        }]);
        speakText("Jordan, sweetheart, let's get our creator's weekly schedule in order. Aria, confirm our creator support lines and verification alerts are ready.");
      }, 1500);

      setTimeout(() => {
        msgIdCounter.current += 1;
        setMessages(prev => [...prev, {
          role: 'model',
          content: "🤖 [Jordan - Personal Exec Assistant]: \"Workspace scheduler locked. Key priorities organized: 1. Generate SHA-256 digital certificate for your latest media upload. 2. Configure 85/15 smart contract payout rules. 3. Export Google Slides licensing proposal.\"",
          id: `sim_${msgIdCounter.current}`,
          timestamp: 'Just now'
        }]);
      }, 5000);

      setTimeout(() => {
        msgIdCounter.current += 1;
        setMessages(prev => [...prev, {
          role: 'model',
          content: "🤖 [Aria - Comms Agent]: \"Verification alerts initialized. Direct notification channel established. Ready to ping your inbox the second your work is verified or licensed by a buyer.\"",
          id: `sim_${msgIdCounter.current}`,
          timestamp: 'Just now'
        }]);
      }, 9000);

      setTimeout(() => {
        msgIdCounter.current += 1;
        const finalWise = "You see that, sweetheart? You don't have to worry about complicated technical steps. We've got your back every step of the way. Take a deep breath and let your creativity flow.";
        setMessages(prev => [...prev, {
          role: 'model',
          content: `Adrienne: "${finalWise}"`,
          id: `sim_${msgIdCounter.current}`,
          timestamp: 'Just now'
        }]);
        speakText(finalWise);
        setIsSimulating(false);
        setActiveWorkflowIndex(null);
      }, 13500);
    }
  };

  // Keyboard Submission Form
  const handleKeyboardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!textInput.trim()) return;
    const inputToSubmit = textInput;
    setTextInput('');
    handleUserMessage(inputToSubmit);
  };

  // Compile Recommendation String
  const getRecommendation = () => {
    const { creatorType, hasCollaborators, primaryGoal, budgetTier } = clientProfile;
    
    let protocol = "Sovranly Creator Protocol v1.4";
    let setup = "Single-Creator On-Chain Registry Signature";
    let splitCode = "Direct Payout (100% routed directly to creator's wallet)";
    let legalPath = "SHA-256 Cryptographic Timestamp & Proof of Creation";
    let extraNotes = "Optimized for instant proof of authorship and direct ownership control.";

    if (creatorType === 'developer') {
      protocol = "Sovranly Codebase Vault Node";
      setup = "Git Commit Hash Anchoring & Scraper Opt-Out Stamps";
      extraNotes = "Machine-readable compliance manifest attached to repository files to reject uncredited AI scraper bots.";
    } else if (creatorType === 'musician') {
      protocol = "Acoustic Ledger Registry";
      setup = "Audio waveform fingerprinting & Split-Sheet Router";
      extraNotes = "Perfect for beats, stems, and songs. Payouts divided automatically upon licensing.";
    } else if (creatorType === 'youtuber') {
      protocol = "Video & Digital Media Ledger";
      setup = "Video stem timestamping & Anti-Theft Certificate";
      extraNotes = "Permanently proves you published and owned the video first, shielding against false copyright strikes.";
    } else if (creatorType === 'filmmaker') {
      protocol = "Sovereign Cinematic Ledger";
      setup = "Verifiable Screenplay Draft Timeline & Production Split Sheet";
      extraNotes = "Chronological timestamping across draft versions and collaborative production credits.";
    } else if (creatorType === 'writer') {
      protocol = "Editorial Copyright Stamp";
      setup = "Manuscript Hash Certificate & Adaptation Rights Agreement";
      extraNotes = "Protects written drafts, articles, and book chapters from plagiarism.";
    }

    if (hasCollaborators === 'yes' || creatorType === 'musician' || creatorType === 'filmmaker') {
      splitCode = "Automated Split-Sheet Protocol (85% directly to creator wallet, 15% network pool)";
    }

    if (primaryGoal === 'licensing') {
      legalPath = "Smart Commercial Licensing Compact (Instant 85% creator payout)";
    } else if (primaryGoal === 'ai_defense') {
      legalPath = "Anti-AI Crawler Opt-Out Header & Proof of Authorship Stamp";
    } else if (primaryGoal === 'splits') {
      legalPath = "Automated Multi-Creator Royalty Split-Sheet Protocol";
    }

    if (budgetTier === 'independent') {
      extraNotes += " Free tier enabled with zero upfront legal retainers.";
    }

    return { protocol, setup, splitCode, legalPath, extraNotes };
  };

  const recData = getRecommendation();

  return (
    <div className="min-h-screen bg-black text-zinc-100 font-sans selection:bg-cyan-500/20 selection:text-cyan-300">
      {/* Background Ambience */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-violet-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[140px] pointer-events-none" />

      {/* Navigation Header */}
      <header className="relative border-b border-zinc-900 bg-black/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center justify-between p-6 max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-zinc-950 border border-cyan-500/30 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-950/20">
              <ShieldCheck className="w-4.5 h-4.5 text-cyan-400 drop-shadow-[0_0_6px_rgba(34,211,238,0.4)]" />
            </div>
            <Link href="/" className="font-extrabold tracking-tight text-white text-lg uppercase">SOVRANLY IP</Link>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5 bg-cyan-950/40 text-cyan-400 border border-cyan-500/20 text-[10px] font-mono font-black uppercase px-2.5 py-1 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> LIVE VOICE LAYER
            </span>
            <Button asChild variant="outline" className="border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-900 rounded-full h-9 text-xs">
              <Link href="/dashboard">Back to CommandCenter</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Grid View */}
      <main className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative z-10">
        
        {/* LEFT COLUMN: ACTIVE INTERACTIVE TOUR MAP & DISCOVERY (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* 1. TOUR MAP & PROGRESS TRACKER */}
          <Card className="bg-zinc-950 border border-zinc-900 p-6 rounded-3xl shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-cyan-500/5 via-transparent to-transparent pointer-events-none" />
            
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-mono text-cyan-400 tracking-widest uppercase">TOUR PATHWAY</span>
                  <h3 className="text-sm font-black text-white uppercase mt-0.5">Sovereign Guided Tour</h3>
                </div>
                {isTourActive && (
                  <button 
                    onClick={resetTour}
                    className="text-[9px] font-mono text-rose-400 border border-rose-500/20 bg-rose-950/20 px-2 py-1 rounded hover:bg-rose-950/40 cursor-pointer"
                  >
                    RESET TOUR
                  </button>
                )}
              </div>

              {/* Steps Timeline visualizer */}
              <div className="space-y-3 pt-2">
                {tourSteps.map((step, i) => {
                  const Icon = step.icon;
                  const isActive = isTourActive && tourStep === i;
                  const isCompleted = isTourActive && tourStep > i;
                  
                  return (
                    <div 
                      key={i} 
                      onClick={() => triggerTourStep(i)}
                      className={`group p-3 rounded-2xl border transition-all duration-300 cursor-pointer flex items-center justify-between gap-3 ${
                        isActive 
                          ? 'bg-zinc-900/80 border-cyan-500/30 shadow-lg' 
                          : isCompleted 
                            ? 'bg-zinc-950 border-zinc-900 opacity-60 hover:opacity-100'
                            : 'bg-zinc-950/50 border-transparent hover:border-zinc-900'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2.5 rounded-xl border transition-all ${
                          isActive 
                            ? 'bg-cyan-950 border-cyan-500/30 text-cyan-400' 
                            : isCompleted
                              ? 'bg-zinc-900 border-zinc-800 text-emerald-400'
                              : 'bg-zinc-900/60 border-transparent text-zinc-600'
                        }`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="text-left">
                          <span className="block text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">
                            {step.title}
                          </span>
                          <span className="block text-[9px] text-zinc-500 mt-0.5 font-mono">
                            {step.subtitle}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {isActive && (
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                          </span>
                        )}
                        {isCompleted && (
                          <span className="text-emerald-400 font-mono text-[9px]">✓ SEALED</span>
                        )}
                        {!isActive && !isCompleted && (
                          <ChevronRight className="w-3.5 h-3.5 text-zinc-700 group-hover:text-zinc-500 transition-all" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {!isTourActive ? (
                <Button 
                  onClick={() => triggerTourStep(0)}
                  className="w-full bg-gradient-to-r from-cyan-500 to-violet-500 hover:brightness-110 text-white font-black text-xs uppercase py-5 rounded-2xl mt-4"
                >
                  <Play className="w-3.5 h-3.5 mr-2" /> Start Audio Tour Walkthrough
                </Button>
              ) : (
                <div className="flex gap-2 pt-2">
                  <Button 
                    variant="outline" 
                    onClick={() => triggerTourStep(Math.max(0, tourStep - 1))}
                    disabled={tourStep === 0}
                    className="flex-1 border-zinc-800 text-zinc-400 hover:text-white rounded-xl text-xs h-10"
                  >
                    <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Previous
                  </Button>
                  <Button 
                    onClick={advanceTour}
                    className="flex-1 bg-cyan-900 hover:bg-cyan-800 text-white rounded-xl text-xs h-10 font-bold"
                  >
                    {tourStep === tourSteps.length - 1 ? 'Finish Tour' : 'Next Step'} <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </Button>
                </div>
              )}
            </div>
          </Card>

          {/* 2. DYNAMIC CLIENT DISCOVERY REGISTER */}
          <Card className="bg-zinc-950 border border-zinc-900 p-6 rounded-3xl shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-28 h-28 bg-gradient-to-bl from-violet-500/5 via-transparent to-transparent pointer-events-none" />
            
            <div className="space-y-4 text-left">
              <div>
                <span className="text-[10px] font-mono text-violet-400 tracking-widest uppercase">DISCOVERY PANEL</span>
                <h3 className="text-sm font-black text-white uppercase mt-0.5">Sovereign Client Profile</h3>
                <p className="text-[11px] text-zinc-500 mt-0.5">Dynamic registration fields update live as you speak with the AI.</p>
              </div>

              {/* Dynamic Interactive Selectors */}
              <div className="space-y-3.5 pt-2">
                
                {/* 1. Craft Type */}
                <div className="space-y-1.5">
                  <span className="text-[9px] font-mono text-zinc-500 uppercase block">Creative Craft / Industry</span>
                  <div className="grid grid-cols-6 gap-1">
                    {[
                      { id: 'musician', label: 'Music', icon: Music, color: 'text-violet-400' },
                      { id: 'youtuber', label: 'YouTube', icon: Sparkles, color: 'text-red-400' },
                      { id: 'writer', label: 'Writing', icon: BookOpen, color: 'text-amber-400' },
                      { id: 'filmmaker', label: 'Film', icon: Film, color: 'text-rose-400' },
                      { id: 'developer', label: 'Code', icon: Code2, color: 'text-cyan-400' },
                      { id: 'artist', label: 'Art', icon: Sparkles, color: 'text-emerald-400' }
                    ].map(item => {
                      const Icon = item.icon;
                      const active = clientProfile.creatorType === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => updateProfile('creatorType', item.id as any)}
                          title={item.label}
                          className={`p-2 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                            active 
                              ? 'bg-zinc-900 border-zinc-700 text-white shadow-md shadow-black/40 scale-105' 
                              : 'bg-zinc-950 border-transparent text-zinc-500 hover:text-zinc-300'
                          }`}
                        >
                          <Icon className={`w-4 h-4 ${item.color}`} />
                          <span className="text-[8px] font-bold tracking-tight scale-90">{item.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Co-creators / Splits */}
                <div className="flex items-center justify-between bg-zinc-900/30 p-2.5 rounded-2xl border border-zinc-900/60">
                  <div>
                    <span className="block text-[10px] font-bold text-white leading-none">Collaborative Royalty Splits</span>
                    <span className="block text-[8px] text-zinc-500 font-mono mt-1">Multi-author percentage routings</span>
                  </div>
                  <div className="flex bg-zinc-950 p-0.5 rounded-lg border border-zinc-850">
                    {['yes', 'no'].map(val => (
                      <button
                        key={val}
                        onClick={() => updateProfile('hasCollaborators', val as any)}
                        className={`px-2 py-1 text-[8px] font-mono font-bold uppercase rounded-md transition-all cursor-pointer ${
                          clientProfile.hasCollaborators === val 
                            ? 'bg-zinc-900 text-cyan-400 border border-zinc-800' 
                            : 'text-zinc-500 hover:text-zinc-300'
                        }`}
                      >
                        {val}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. Primary Goal */}
                <div className="flex items-center justify-between bg-zinc-900/30 p-2.5 rounded-2xl border border-zinc-900/60">
                  <div>
                    <span className="block text-[10px] font-bold text-white leading-none">Primary Protection Goal</span>
                    <span className="block text-[8px] text-zinc-500 font-mono mt-1">Timestamp, Licensing, or AI Opt-Out</span>
                  </div>
                  <div className="flex bg-zinc-950 p-0.5 rounded-lg border border-zinc-850">
                    {[
                      { id: 'timestamp', label: 'Proof' },
                      { id: 'licensing', label: 'License' },
                      { id: 'ai_defense', label: 'AI Shield' }
                    ].map(goal => (
                      <button
                        key={goal.id}
                        onClick={() => updateProfile('primaryGoal', goal.id as any)}
                        className={`px-2 py-1 text-[8px] font-mono font-bold uppercase rounded-md transition-all cursor-pointer ${
                          clientProfile.primaryGoal === goal.id 
                            ? 'bg-zinc-900 text-cyan-400 border border-zinc-800' 
                            : 'text-zinc-500 hover:text-zinc-300'
                        }`}
                      >
                        {goal.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 4. Creator Tier */}
                <div className="flex items-center justify-between bg-zinc-900/30 p-2.5 rounded-2xl border border-zinc-900/60">
                  <div>
                    <span className="block text-[10px] font-bold text-white leading-none">Creator Setup Tier</span>
                    <span className="block text-[8px] text-zinc-500 font-mono mt-1">Free starter or commercial studio</span>
                  </div>
                  <div className="flex bg-zinc-950 p-0.5 rounded-lg border border-zinc-850">
                    {[
                      { id: 'independent', label: 'Starter' },
                      { id: 'funded', label: 'Pro Studio' }
                    ].map(tier => (
                      <button
                        key={tier.id}
                        onClick={() => updateProfile('budgetTier', tier.id as any)}
                        className={`px-2 py-1 text-[8px] font-mono font-bold uppercase rounded-md transition-all cursor-pointer ${
                          clientProfile.budgetTier === tier.id 
                            ? 'bg-zinc-900 text-cyan-400 border border-zinc-800' 
                            : 'text-zinc-500 hover:text-zinc-300'
                        }`}
                      >
                        {tier.label}
                      </button>
                    ))}
                  </div>
                </div>

              </div>

              {/* Discovery Summary Recommendation */}
              <AnimatePresence>
                {showRecommendation && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="pt-3 border-t border-zinc-900/80 space-y-2.5"
                  >
                    <div className="bg-cyan-950/20 border border-cyan-500/20 rounded-2xl p-3 space-y-1.5">
                      <span className="text-[8px] font-mono font-bold text-cyan-400 uppercase tracking-wider block">Recommended Strategy</span>
                      <span className="block text-xs font-black text-white uppercase">{recData.protocol}</span>
                      <p className="text-[10px] text-zinc-400 leading-normal">{recData.extraNotes}</p>
                      
                      <div className="pt-1.5 text-[9px] text-zinc-500 font-mono space-y-1">
                        <div><strong className="text-zinc-400">Node:</strong> {recData.setup}</div>
                        <div><strong className="text-zinc-400">Splits:</strong> {recData.splitCode}</div>
                        <div><strong className="text-zinc-400">Legal:</strong> {recData.legalPath}</div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>
          </Card>

        </div>

        {/* RIGHT COLUMN: VOICE VISUALIZER CORE & AUDIO CONSOLE (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Main Voice Agent Interface Card */}
          <Card className="bg-zinc-950 border border-zinc-900 rounded-3xl p-6 md:p-8 shadow-xl relative overflow-hidden flex flex-col min-h-[680px]">
            {/* Ambient Background glows */}
            <div className="absolute -top-40 -left-40 w-96 h-96 bg-cyan-500/5 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-violet-500/5 rounded-full blur-[100px] pointer-events-none" />

            {/* Portal Header */}
            <div className="border-b border-zinc-900 pb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative flex h-3 w-3">
                  <span className={`absolute inline-flex h-full w-full rounded-full opacity-75 ${
                    isSpeaking ? 'animate-ping bg-cyan-400' : isListening ? 'animate-ping bg-emerald-400' : 'bg-zinc-700'
                  }`} />
                  <span className={`relative inline-flex rounded-full h-3 w-3 ${
                    isSpeaking ? 'bg-cyan-500' : isListening ? 'bg-emerald-500' : 'bg-zinc-600'
                  }`} />
                </div>
                <div>
                  <h2 className="text-sm font-black text-white uppercase tracking-tight">SOVRANLY IP • VOICE GATEWAY</h2>
                  <span className="text-[9px] font-mono text-zinc-500 block uppercase">
                    {isSpeaking ? 'Agent speaking out loud' : isListening ? 'Microphone active, listening...' : 'Idle, waiting for query'}
                  </span>
                </div>
              </div>

              {/* Mode Tabs (Immersive Wave vs Multi-Agent Council vs Raw Technical Console log) */}
              <div className="flex bg-zinc-900/60 p-0.5 rounded-xl border border-zinc-850 flex-wrap gap-1">
                <button
                  onClick={() => setActiveTab('voice')}
                  className={`px-3 py-1.5 text-[9px] font-mono font-bold uppercase rounded-lg transition-all cursor-pointer ${
                    activeTab === 'voice' 
                      ? 'bg-zinc-950 text-cyan-400 border border-zinc-800 shadow' 
                      : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  Voice Core
                </button>
                <button
                  onClick={() => setActiveTab('subagents')}
                  className={`px-3 py-1.5 text-[9px] font-mono font-bold uppercase rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                    activeTab === 'subagents' 
                      ? 'bg-zinc-950 text-cyan-400 border border-zinc-800 shadow' 
                      : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  <Brain className="w-3 h-3 text-cyan-400" /> Sovereign Council (5 Subs)
                </button>
                <button
                  onClick={() => setActiveTab('console')}
                  className={`px-3 py-1.5 text-[9px] font-mono font-bold uppercase rounded-lg transition-all cursor-pointer ${
                    activeTab === 'console' 
                      ? 'bg-zinc-950 text-cyan-400 border border-zinc-800 shadow' 
                      : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  <Terminal className="w-3 h-3 inline mr-1" /> Tech Console
                </button>
              </div>
            </div>

            {/* MAIN CONTENT PORTAL CONTAINER */}
            <div className="flex-1 py-8 flex flex-col justify-between">
              
              {activeTab === 'voice' ? (
                /* 1. VISUALIZER & VOICE WAVE INTERFACE */
                <div className="flex-1 flex flex-col items-center justify-center space-y-8">
                  
                  {/* Glowing Pulse Visualizer Orb */}
                  <div className="relative w-56 h-56 md:w-64 md:h-64 flex items-center justify-center select-none">
                    <motion.div 
                      animate={{
                        scale: isSpeaking ? [1, 1.25, 1] : isListening ? [1, 1.15, 1] : [1, 1.05, 1],
                        opacity: isSpeaking ? 0.25 : isListening ? 0.2 : 0.08
                      }}
                      transition={{ duration: isSpeaking ? 1.5 : isListening ? 0.8 : 4, repeat: Infinity }}
                      className={`absolute inset-0 rounded-full blur-3xl ${
                        isSpeaking ? 'bg-cyan-500' : isListening ? 'bg-emerald-500' : 'bg-violet-500'
                      }`}
                    />

                    <motion.div 
                      animate={{ rotate: 360 }}
                      transition={{ duration: isThinking ? 3 : 25, repeat: Infinity, ease: "linear" }}
                      className={`absolute inset-2 border border-dashed rounded-full pointer-events-none ${
                        isSpeaking 
                          ? 'border-cyan-500/40' 
                          : isListening 
                            ? 'border-emerald-500/40' 
                            : 'border-zinc-800'
                      }`}
                    />

                    <AnimatePresence>
                      {(isSpeaking || isListening) && (
                        <motion.div 
                          initial={{ scale: 0.8, opacity: 0.5 }}
                          animate={{ scale: 1.4, opacity: 0 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 1.6, repeat: Infinity, ease: "easeOut" }}
                          className={`absolute inset-4 border rounded-full ${
                            isSpeaking ? 'border-cyan-400/30' : 'border-emerald-400/30'
                          }`}
                        />
                      )}
                    </AnimatePresence>

                    {/* Core Orb Block */}
                    <button
                      onClick={toggleListening}
                      className={`w-36 h-36 md:w-40 md:h-40 rounded-full flex flex-col items-center justify-center relative z-10 border transition-all duration-300 outline-none select-none cursor-pointer ${
                        isSpeaking 
                          ? 'bg-cyan-950/30 border-cyan-500 text-cyan-400 shadow-[0_0_40px_rgba(6,182,212,0.25)]' 
                          : isListening 
                            ? 'bg-emerald-950/30 border-emerald-500 text-emerald-400 shadow-[0_0_40px_rgba(16,185,129,0.25)]'
                            : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-white hover:shadow-lg hover:shadow-cyan-950/20'
                      }`}
                    >
                      {isThinking ? (
                        <div className="space-y-2 flex flex-col items-center">
                          <Activity className="w-8 h-8 text-violet-400 animate-spin" />
                          <span className="text-[9px] font-mono uppercase tracking-widest text-violet-400">THINKING</span>
                        </div>
                      ) : isSpeaking ? (
                        <div className="space-y-2 flex flex-col items-center">
                          <Volume1 className="w-8 h-8 text-cyan-400 animate-pulse" />
                          <span className="text-[9px] font-mono uppercase tracking-widest text-cyan-400">SPEAKING</span>
                        </div>
                      ) : isListening ? (
                        <div className="space-y-2 flex flex-col items-center">
                          <Mic className="w-8 h-8 text-emerald-400 animate-bounce" />
                          <span className="text-[9px] font-mono uppercase tracking-widest text-emerald-400">LISTENING</span>
                        </div>
                      ) : (
                        <div className="space-y-2 flex flex-col items-center">
                          <MicOff className="w-8 h-8 text-zinc-500" />
                          <span className="text-[9px] font-mono uppercase tracking-widest text-zinc-500">TAP TO SPEAK</span>
                        </div>
                      )}
                    </button>
                  </div>

                  {/* Active Mic Info Label */}
                  <div className="max-w-md text-center space-y-2.5">
                    {recognitionError && (
                      <span className="inline-flex items-center gap-1 bg-rose-950/40 text-rose-400 border border-rose-500/30 text-[9px] font-mono px-3 py-1 rounded-full">
                        Speech error: {recognitionError}. Attempting textual recovery.
                      </span>
                    )}
                    {!speechSupported && (
                      <span className="inline-flex items-center gap-1 bg-zinc-900 text-zinc-500 border border-zinc-800 text-[9px] font-mono px-3 py-1 rounded-full select-none">
                        Speech recognition is disabled in standard iframe mode. Use keyboard console.
                      </span>
                    )}
                    
                    <AnimatePresence mode="wait">
                      {interimTranscript ? (
                        <motion.p 
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-sm font-medium text-emerald-400 font-mono italic px-4"
                        >
                          &ldquo;{interimTranscript}&rdquo;
                        </motion.p>
                      ) : (
                        <motion.p 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="text-xs text-zinc-500 max-w-sm mx-auto leading-relaxed"
                        >
                          {isListening 
                            ? "I am listening. Talk naturally about your craft, split royalties, or ask me about our Zero-Trust architecture." 
                            : "Click the central Core to unmute your microphone and talk to the Sovereign Guide, or click the guided tour links on the left."}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Quick-Prompt Recommendation chips */}
                  <div className="flex flex-wrap justify-center gap-2 max-w-lg pt-4">
                    {[
                      { text: "Give me a feature tour 🚀", hint: "Give me a complete feature tour." },
                      { text: "How do I timestamp my first video or track? 🔒", hint: "Explain how I can timestamp my first YouTube video or song to prove I created it first." },
                      { text: "How do split sheets work? 💸", hint: "Explain how automated split sheets route creator royalties directly." },
                      { text: "How do I stop AI bots from scraping my art? 🛡️", hint: "How do I attach an AI scraping opt-out tag to my work?" }
                    ].map((chip, i) => (
                      <button
                        key={i}
                        onClick={() => handleUserMessage(chip.hint)}
                        className="px-3.5 py-2 rounded-xl bg-zinc-900 border border-zinc-850 hover:border-zinc-750 text-xs text-zinc-300 hover:text-white hover:bg-zinc-850/80 transition duration-200 cursor-pointer"
                      >
                        {chip.text}
                      </button>
                    ))}
                  </div>

                </div>
              ) : activeTab === 'subagents' ? (
                /* 1.5 MULTI-AGENT SOVEREIGN COUNCIL PANEL */
                <div className="flex-1 flex flex-col space-y-6 text-left">
                  {/* Council Overview Card */}
                  <div className="bg-zinc-900/40 border border-zinc-900/80 p-5 rounded-2xl space-y-3 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-3 text-cyan-500/10">
                      <Cpu className="w-16 h-16" />
                    </div>
                    <span className="text-[10px] font-mono text-cyan-400 tracking-widest uppercase block">SOVEREIGN EXECUTIVE CIRCLE</span>
                    <h3 className="text-md font-black text-white uppercase">The Orchestration Council</h3>
                    <p className="text-xs text-zinc-400 max-w-xl leading-relaxed">
                      Meet your 5 specialized AI subagents, coordinated by <span className="text-white font-bold">Adrienne</span>. Together, they execute Zero-Trust operations, keep financial ledgers in continuous alignment, manage communications, and scout licensing markets for you.
                    </p>
                  </div>

                  {/* 5-Subagent Interactive Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                    {[
                      {
                        id: 'adrienne',
                        name: 'Adrienne',
                        title: 'Sovereign Orator',
                        role: 'General Coordinator',
                        status: isSpeaking ? 'Speaking...' : isSimulating ? 'Coordinating...' : 'Listening...',
                        statusColor: isSpeaking ? 'bg-cyan-500 animate-pulse' : isSimulating ? 'bg-violet-500 animate-spin' : 'bg-emerald-500',
                        icon: Users,
                        accent: 'border-cyan-500/30 text-cyan-400',
                        desc: 'Wise coordinator & onboarding orator.'
                      },
                      {
                        id: 'sage',
                        name: 'Sage (CFO)',
                        title: 'CFO Subagent',
                        role: 'Finance & Splits',
                        status: isSimulating && activeWorkflowIndex === 0 ? 'Syncing...' : 'QuickBooks Synced',
                        statusColor: isSimulating && activeWorkflowIndex === 0 ? 'bg-amber-500 animate-ping' : 'bg-emerald-500',
                        icon: Coins,
                        accent: 'border-amber-500/30 text-amber-400',
                        desc: 'Manages money, QuickBooks, & splits.'
                      },
                      {
                        id: 'aria',
                        name: 'Aria',
                        title: 'Comms & Help',
                        role: 'Outbound & Tickets',
                        status: isSimulating && activeWorkflowIndex === 1 ? 'Dispatching...' : 'Queues Active',
                        statusColor: isSimulating && activeWorkflowIndex === 1 ? 'bg-rose-500 animate-ping' : 'bg-emerald-500',
                        icon: Phone,
                        accent: 'border-rose-500/30 text-rose-400',
                        desc: 'Directs phones, email pipelines, and support.'
                      },
                      {
                        id: 'maya',
                        name: 'Maya',
                        title: 'Opportunity Scout',
                        role: 'Business Dev',
                        status: isSimulating && activeWorkflowIndex === 1 ? 'Scanning...' : 'Scans Complete',
                        statusColor: isSimulating && activeWorkflowIndex === 1 ? 'bg-purple-500 animate-pulse' : 'bg-emerald-500',
                        icon: TrendingUp,
                        accent: 'border-purple-500/30 text-purple-400',
                        desc: 'Scouts licenses, brand gaps, and Class 42.'
                      },
                      {
                        id: 'jordan',
                        name: 'Jordan',
                        title: 'Personal Assistant',
                        role: 'Task Orchestration',
                        status: isSimulating && activeWorkflowIndex === 2 ? 'Tracking...' : 'Priority Synced',
                        statusColor: isSimulating && activeWorkflowIndex === 2 ? 'bg-blue-500 animate-pulse' : 'bg-emerald-500',
                        icon: Calendar,
                        accent: 'border-blue-500/30 text-blue-400',
                        desc: 'Handles scheduler, slides, and workspaces.'
                      }
                    ].map(sub => {
                      const Icon = sub.icon;
                      const isSelected = selectedSubagent === sub.id;
                      return (
                        <div
                          key={sub.id}
                          onClick={() => {
                            if (isSimulating) return;
                            setSelectedSubagent(selectedSubagent === sub.id ? null : sub.id as any);
                          }}
                          className={`p-4 rounded-2xl border transition-all duration-300 cursor-pointer flex flex-col justify-between text-left relative overflow-hidden ${
                            isSelected 
                              ? 'bg-zinc-900 border-cyan-500/40 shadow-lg shadow-cyan-950/20 scale-102' 
                              : 'bg-zinc-950/50 border-zinc-900/80 hover:border-zinc-800'
                          }`}
                        >
                          <div className="space-y-2">
                            <div className="flex justify-between items-start">
                              <div className={`p-2 rounded-xl bg-zinc-900 border ${sub.accent}`}>
                                <Icon className="w-4 h-4" />
                              </div>
                              <span className="flex items-center gap-1.5 text-[8px] font-mono text-zinc-500">
                                <span className={`w-1.5 h-1.5 rounded-full ${sub.statusColor}`} />
                                {sub.status}
                              </span>
                            </div>
                            <div>
                              <h4 className="text-xs font-black text-white">{sub.name}</h4>
                              <span className="text-[9px] font-mono text-zinc-500 block">{sub.role}</span>
                            </div>
                            <p className="text-[10px] text-zinc-500 leading-normal">{sub.desc}</p>
                          </div>

                          <div className="pt-3 border-t border-zinc-900/85 mt-3 flex justify-between items-center">
                            <span className="text-[8px] font-mono text-zinc-500">
                              {isSelected ? "ACTIVE QUERY TARGET" : "TAP TO ROUTE QUERY"}
                            </span>
                            {isSelected && (
                              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Preset Multi-Agent Choreography Simulation Buttons */}
                  <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-5 space-y-4">
                    <div>
                      <span className="text-[8px] font-mono text-violet-400 tracking-wider uppercase block">COUNCIL ORCHESTRATOR PLAYGROUND</span>
                      <h4 className="text-xs font-bold text-white uppercase mt-0.5">Preset Agency Workflows</h4>
                      <p className="text-[11px] text-zinc-500 leading-relaxed">
                        Trigger multi-agent orchestration flows out loud. Watch Sage, Aria, Maya, Jordan, and Adrienne solve complex tasks live.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {[
                        {
                          title: "CFO Split & QuickBooks Sync",
                          desc: "Sage reconciles weekly ledger and 85/15 splits, with Adrienne's sign-off.",
                          icon: Coins,
                          color: "hover:border-amber-500/30"
                        },
                        {
                          title: "Scout Licensing & Queue Outreach",
                          desc: "Maya finds trademark Class 42 gaps, Jordan drafts pitches, and Aria queues outreach emails.",
                          icon: Sparkles,
                          color: "hover:border-purple-500/30"
                        },
                        {
                          title: "Coordinate Executive Assistants",
                          desc: "Jordan locks calendar dates, Aria schedules Volunteers for the Arts consult, and Adrienne encourages.",
                          icon: Workflow,
                          color: "hover:border-blue-500/30"
                        }
                      ].map((preset, i) => {
                        const Icon = preset.icon;
                        const active = activeWorkflowIndex === i;
                        return (
                          <button
                            key={i}
                            disabled={isSimulating}
                            onClick={() => runWorkflowSync(i)}
                            className={`p-4 rounded-xl border bg-zinc-950 text-left transition-all relative ${preset.color} ${
                              active 
                                ? 'border-cyan-500 bg-zinc-900/40 text-white shadow-md shadow-cyan-950/20' 
                                : isSimulating 
                                  ? 'opacity-40 border-zinc-950' 
                                  : 'border-zinc-900 hover:bg-zinc-900/20 hover:border-zinc-850'
                            } cursor-pointer`}
                          >
                            <div className="flex justify-between items-start">
                              <div className="p-1.5 rounded-lg bg-zinc-900 text-zinc-400">
                                <Icon className="w-4 h-4 text-cyan-400" />
                              </div>
                              {active && (
                                <span className="text-[8px] font-mono text-cyan-400 uppercase tracking-widest animate-pulse">Running...</span>
                              )}
                            </div>
                            <h5 className="text-xs font-bold text-white mt-3">{preset.title}</h5>
                            <p className="text-[10px] text-zinc-500 leading-normal mt-1">{preset.desc}</p>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Active Selection Information banner */}
                  <div className="bg-zinc-900/20 border border-zinc-900 rounded-xl p-3 text-xs text-zinc-500 flex items-center justify-between">
                    <div>
                      {selectedSubagent ? (
                        <span>
                          Active target is <strong className="text-white">
                            {selectedSubagent === 'sage' ? 'Sage (CFO Subagent)' : 
                             selectedSubagent === 'aria' ? 'Aria (Comms & Support)' : 
                             selectedSubagent === 'maya' ? 'Maya (Opportunity Scout)' : 
                             selectedSubagent === 'jordan' ? 'Jordan (Personal Assistant)' : 'Adrienne'}
                          </strong>. Any message you type in the input bar below will query this subagent directly.
                        </span>
                      ) : (
                        <span>No specific subagent selected. Queries are coordinated broadly by <strong className="text-white">Adrienne</strong>. Click any card to target.</span>
                      )}
                    </div>
                    {selectedSubagent && (
                      <button 
                        onClick={() => setSelectedSubagent(null)} 
                        className="text-[9px] font-mono text-cyan-400 hover:text-white uppercase cursor-pointer animate-pulse"
                      >
                        Clear Target
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                /* 2. CLASSIC / TECHNICAL CHAT CONSOLE LOGS */
                <div className="flex-1 bg-black/60 rounded-2xl border border-zinc-900 p-4 font-mono text-xs overflow-y-auto max-h-[460px] space-y-4 scrollbar-none">
                  {messages.map((m, i) => (
                    <div 
                      key={m.id || i}
                      className={`flex flex-col space-y-1 ${m.role === 'user' ? 'items-end' : 'items-start'}`}
                    >
                      <div className="flex items-center gap-2 text-[9px] text-zinc-500">
                        <span>{m.role === 'user' ? 'CREATOR_NODE' : 'SOVEREIGN_AGENT'}</span>
                        <span>•</span>
                        <span>{m.timestamp}</span>
                      </div>
                      <div className={`p-3 rounded-2xl max-w-lg whitespace-pre-line leading-relaxed ${
                        m.role === 'user' 
                          ? 'bg-zinc-900 text-zinc-200 border border-zinc-850' 
                          : 'bg-cyan-950/20 text-cyan-300 border border-cyan-950/50'
                      }`}>
                        {m.content}

                        {m.sources && m.sources.length > 0 && (
                          <div className="mt-3.5 pt-3.5 border-t border-cyan-500/10 space-y-2">
                            <div className="text-[10px] font-bold uppercase tracking-wider text-cyan-400/80 flex items-center gap-1.5 font-sans">
                              <Sparkles className="w-3 h-3 animate-pulse" /> Verified Search Citations
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {m.sources.map((src, sIdx) => (
                                <a
                                  key={sIdx}
                                  href={src.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-zinc-950/60 border border-cyan-500/20 hover:border-cyan-400/50 rounded-lg text-[10px] text-zinc-300 hover:text-cyan-300 transition-all font-sans cursor-pointer shadow-sm hover:shadow-cyan-950/20"
                                >
                                  <Compass className="w-3 h-3 text-cyan-400 flex-shrink-0" />
                                  <span className="max-w-[140px] truncate">{src.title}</span>
                                </a>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  {isThinking && (
                    <div className="flex items-center gap-2 text-[10px] text-zinc-500 font-mono animate-pulse">
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-violet-500"></span>
                      </span>
                      <span>STREAMING SECURE RESPONSE METADATA...</span>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>
              )}

              {/* CONTROLS BAR: MICROPHONE, SYNTHESIS MUTING, & KEYBOARD FALLBACK INPUT */}
              <div className="border-t border-zinc-900 pt-6 space-y-4">
                
                {/* Micro-controls */}
                <div className="flex items-center justify-between flex-wrap gap-4">
                  {/* Select active agent voice persona */}
                  <div className="flex items-center gap-2 bg-zinc-900/60 p-1 rounded-xl border border-zinc-850">
                    <span className="text-[9px] font-mono text-zinc-500 uppercase px-2 select-none">Agent Persona</span>
                    {(['adrienne', 'oracle', 'guide'] as const).map((voice) => (
                      <button
                        key={voice}
                        type="button"
                        onClick={() => {
                          setActiveVoice(voice);
                          if (synthRef.current) synthRef.current.cancel();
                          setIsSpeaking(false);
                        }}
                        className={`px-2.5 py-1 text-[8px] font-mono font-bold uppercase rounded-md transition-all cursor-pointer ${
                          activeVoice === voice 
                            ? 'bg-zinc-950 text-cyan-400 border border-zinc-800' 
                            : 'text-zinc-500 hover:text-zinc-300'
                        }`}
                      >
                        {voice === 'adrienne' ? 'Adrienne (Coordinator)' : voice}
                      </button>
                    ))}
                  </div>

                  {/* Audio Muting Controls & Telemetry status */}
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        const newMute = !isVoiceMuted;
                        setIsVoiceMuted(newMute);
                        if (newMute && synthRef.current) {
                          synthRef.current.cancel();
                          setIsSpeaking(false);
                        }
                      }}
                      className={`p-2 rounded-xl border transition-all cursor-pointer ${
                        isVoiceMuted 
                          ? 'bg-rose-950/20 border-rose-500/20 text-rose-400 hover:bg-rose-950/40' 
                          : 'bg-zinc-900 border-zinc-850 text-zinc-400 hover:text-white'
                      }`}
                      title={isVoiceMuted ? "Unmute Voice" : "Mute Voice"}
                    >
                      {isVoiceMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </button>
                    
                    <span className="text-[9px] font-mono text-zinc-500 uppercase select-none">
                      Active: <strong className="text-zinc-300">{getVoiceName()}</strong>
                    </span>
                  </div>
                </div>

                {/* Keyboard Input fallback form */}
                <form onSubmit={handleKeyboardSubmit} className="flex gap-2">
                  <input
                    type="text"
                    placeholder={
                      selectedSubagent === 'sage' ? "Query Sage (CFO) about QuickBooks splits, assets, or royalty ledgers..." :
                      selectedSubagent === 'aria' ? "Ask Aria (Comms) to trace direct lines, email queues, or ticket statuses..." :
                      selectedSubagent === 'maya' ? "Ask Maya (Opportunity Scout) about active licensing scans or brand gaps..." :
                      selectedSubagent === 'jordan' ? "Ask Jordan (Personal Exec Assistant) to structure schedules or slide draft..." :
                      "Ask Adrienne or your active subagent a custom query..."
                    }
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    className="flex-1 bg-zinc-950 border border-zinc-850 rounded-2xl px-4 py-3.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/30 transition-all h-12"
                  />
                  <Button 
                    type="submit" 
                    className="bg-zinc-900 hover:bg-zinc-850 text-white rounded-2xl px-6 font-bold text-xs uppercase h-12 border border-zinc-800"
                  >
                    Send
                  </Button>
                </form>

              </div>

            </div>
          </Card>
          
        </div>

      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-900 py-12 mt-12 bg-zinc-950/40 relative z-10 flex flex-col items-center justify-center gap-6 text-center text-zinc-600 text-xs">
        <div className="flex items-center gap-4 text-zinc-500">
          <Link href="/about" className="hover:text-cyan-400 transition-colors">About Us</Link>
          <span>•</span>
          <Link href="/terms" className="hover:text-cyan-400 transition-colors">Terms of Service</Link>
          <span>•</span>
          <Link href="/privacy" className="hover:text-cyan-400 transition-colors">Privacy Policy</Link>
        </div>
        <p>© 2026 Sovranly IP. Sovereign intellectual property systems. Zero Trust Secured.</p>
      </footer>

    </div>
  );
}
