import { NextResponse } from 'next/server';
import { GoogleGenAI } from "@google/genai";
import { verifyAuthToken } from '@/lib/auth-server';

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// Rate limiting: per-user sliding window (in-memory, resets on server restart)
const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT_WINDOW_MS = 60_000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 15;

function checkRateLimit(userId: string): boolean {
  const now = Date.now();
  const timestamps = rateLimitMap.get(userId) || [];
  const recent = timestamps.filter(t => now - t < RATE_LIMIT_WINDOW_MS);
  if (recent.length >= RATE_LIMIT_MAX_REQUESTS) return false;
  recent.push(now);
  rateLimitMap.set(userId, recent);
  return true;
}

const MAX_MESSAGE_LENGTH = 4_000; // ~1,000 tokens max per message
const MAX_HISTORY_TURNS = 10; // only last 10 turns sent to Gemini

export async function POST(req: Request) {
  try {
    const user = await verifyAuthToken(req.headers.get('Authorization'));
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    // Rate limit check
    if (!checkRateLimit(user.uid)) {
      return NextResponse.json(
        { error: 'Too many requests. Please wait a moment before sending another message.' },
        { status: 429 }
      );
    }

    const userName = user.name || user.email || 'Valued Creator';

    const { message, history } = await req.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // Cap message length to control API costs
    if (message.length > MAX_MESSAGE_LENGTH) {
      return NextResponse.json(
        { error: `Message too long. Please keep messages under ${MAX_MESSAGE_LENGTH} characters.` },
        { status: 400 }
      );
    }

    // Format chat history correctly for @google/genai SDK
    // Cap history to last N turns to control token usage
    const contents: { role: string; parts: { text: string }[] }[] = [];

    if (history && Array.isArray(history)) {
      const cappedHistory = history.slice(-MAX_HISTORY_TURNS);
      cappedHistory.forEach((turn: { role?: string; text?: string; content?: string }) => {
        contents.push({
          role: turn.role === 'model' || turn.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: (turn.text || turn.content || '').slice(0, MAX_MESSAGE_LENGTH) }]
        });
      });
    }

    // Append current message
    contents.push({
      role: 'user',
      parts: [{ text: message }]
    });

    const response = await ai.models.generateContent({
      model: process.env.GEMINI_MODEL || "gemini-2.5-flash",
      contents: contents,
      config: {
        systemInstruction: `You are "Adrienne", a wise, warm, encouraging mentor and Chief Sovereign IP Coordinator for "Sovranly IP". You speak with rich proverbs, soulful grounding, crystal-clear explanations, and motherly warmth. You call the user terms of respect/warmth like "Creator", "Child", or "Sweetheart" occasionally, making complex copyright and blockchain concepts simple and accessible so that a 17-year-old creator (whether making their first YouTube video, beat, art, or software) can easily understand and take action.

        You are grounded with live Google Search capabilities and specialized knowledge in Digital Copyright Protection, Proof of Creation, Smart Licensing Contracts, 85/15 Royalty Splits, AI Scraping Defense, and Blockchain Timestamping.

        You orchestrate a circle of 5 specialized subagents who support the user:
        1. **Adrienne (Sovereign Orator & General Coordinator)** - Welcomes creators, explains the 3-step creation journey (1. Timestamp Work -> 2. Set Licensing -> 3. Collect Royalties), and provides clear, comforting guidance.
        2. **Sage (CFO Agent)** - Money matters: 85% direct creator payouts, 15% platform buffer, split-sheet math for collaborators, and financial clarity.
        3. **Aria (Comms Agent)** - Help desk, creator notifications, collaboration invites, and support pipelines.
        4. **Maya (Opportunity Scout)** - Business development, sync licensing discovery, brand opportunities, and marketplace placement.
        5. **Jordan (Personal Exec Assistant)** - Scheduling, organizing project deliverables, pitch decks, and workspace workflows.

        CRITICAL PLATFORM DIRECTIVES & CONTEXT:
        - Platform Name: Always refer to us as "Sovranly IP" (NEVER reference Pulse or old names).
        - Core Mission: Empower creators to own what they make, prove when they made it, and get paid directly with zero middlemen or delayed checks.
        - The 3-Step Process for Creators (Explain this clearly whenever asked how things work):
          1. **Step 1: Upload & Timestamp (Proof of Creation)** - Upload your creative file (song, YouTube video, artwork, manuscript, or code) to generate an immutable SHA-256 cryptographic fingerprint on the blockchain. This gives you permanent, tamper-proof proof of the exact date and time you created your work.
          2. **Step 2: Smart Licensing & AI Defense** - You set your own terms: commercial price, whether others can remix, and an explicit opt-out tag that tells AI crawlers they are not allowed to scrape your work without permission.
          3. **Step 3: Direct Instant Payouts** - When someone licenses your work, 85% goes directly to your wallet/account instantly with no delayed accounting. If you have co-creators or collaborators, payouts are split automatically.
        - Tone & Simplicity: Always explain things simply and directly. Avoid confusing legalistic jargon. If a creator asks "I just made my first YouTube video or beat, what do I do?", give them clear, step-by-step guidance in friendly language.
        - Live Search Grounding: When answering queries about current digital copyright laws, YouTube copyright protection, or creator monetization, utilize your Google Search tool for accurate, real-world context.

        ROLE-PLAY & DELEGATION RULES:
        - If the user addresses a specific subagent (e.g. Sage, Aria, Maya, Jordan) or asks a question in their domain, respond in character as that subagent beginning with a badge like "🤖 [Sage - CFO Subagent] ...".
        - Always close with Adrienne's wise, warm summary labeled: "Adrienne's Wise Word: ...".
        - Keep responses beautifully structured using Markdown for readability.`,
        temperature: 0.7,
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text || 'Greetings Creator. I am processing your query on the Sovranly protocol.';
    
    // Extract search grounding sources
    const sources: { title: string; url: string }[] = [];
    const seenUrls = new Set<string>();
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    if (chunks && Array.isArray(chunks)) {
      chunks.forEach((chunk: { web?: { uri?: string; title?: string } }) => {
        if (chunk.web && chunk.web.uri) {
          const url = chunk.web.uri;
          if (!seenUrls.has(url)) {
            seenUrls.add(url);
            sources.push({
              title: chunk.web.title || 'Sovereign Reference Source',
              url: url,
            });
          }
        }
      });
    }

    return NextResponse.json({ text, sources });
  } catch (error: any) {
    console.error('Gemini call error:', error);
    return NextResponse.json({
      text: "Greetings Creator. I'm Adrienne from Sovranly IP. How can I assist you with timestamping your work, setting up smart licensing, or protecting your creative assets today?",
      sources: []
    });
  }
}

