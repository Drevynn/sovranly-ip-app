import { NextResponse } from 'next/server';
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'sovranly-sync-generator',
    }
  }
});

export async function POST(req: Request) {
  try {
    const { format, audience, tone, focus } = await req.json();

    const prompt = `You are an expert product marketer, technical copywriter, and brand strategist for Sovranly IP, specializing in "Sovran Sync" — the decentralized sync licensing protocol.
    
    Generate high-quality, engaging, and clear content based on these exact parameters:
    - Output Format: ${format || 'Marketing Blog Post / Article'}
    - Target Audience: ${audience || 'Independent Musicians & Film Producers'}
    - Tone: ${tone || 'Innovative, Forward-Thinking, Empowering & Creator-Centric'}
    - Special Focus: ${focus || 'Instant Clearance & Automated Smart Contract Co-Writer Splits'}

    Foundational Facts & Knowledge Base to incorporate:
    1. The Problem: Traditional sync licensing (clearing music and media tracks for games, movies, and ads) is a weeks-long nightmare involving bloated legal overhead, lost emails, and delayed payments.
    2. The Solution: Sovranly's "Sovran Sync" decentralized IP platform transforms sync licensing into an instant process.
    3. How it Works for Creators: Creators easily upload their work, tag their rights, and establish clear pricing tiers immediately.
    4. The Buyer Experience: The catalog acts as an "instant clearance" shop where supervisors, game devs, and brands search, discover, and purchase licenses in just a few clicks.
    5. Under the Hood (Smart Contracts): Smart contracts handle all financial math, automatically split fees between co-writers and collaborators instantly, and issue verifiable digital license certificates.

    Make the content punchy, beautifully structured with Markdown, professional yet bold, capturing the Sovranly IP Zero Trust vision.`;

    const response = await ai.models.generateContent({
      model: process.env.GEMINI_MODEL || "gemini-2.5-flash",
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      config: {
        systemInstruction: "You are Sovranly's master copywriter and brand strategist for Sovran Sync. Write compelling, publication-ready content with absolute precision and visionary flair.",
        temperature: 0.7,
      },
    });

    const content = response.text || 'Error generating content. Please try again.';

    return NextResponse.json({ success: true, content });
  } catch (error: any) {
    console.error('Sovran Sync generation error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to generate content' },
      { status: 500 }
    );
  }
}
