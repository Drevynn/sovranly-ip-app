import { NextResponse } from 'next/server';
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

export async function POST(req: Request) {
  try {
    const { message, history } = await req.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // Format chat history correctly for @google/genai SDK
    // The SDK expects contents to be: { role: "user" | "model", parts: [{ text: "..." }] }[]
    const contents: any[] = [];

    if (history && Array.isArray(history)) {
      history.forEach((turn: any) => {
        contents.push({
          role: turn.role === 'model' || turn.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: turn.text || turn.content || '' }]
        });
      });
    }

    // Append current message
    contents.push({
      role: 'user',
      parts: [{ text: message }]
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: contents,
      config: {
        systemInstruction: `You are the sovereign AI Legal and Technical Agent for "Sovranly IP". Your core mission is to empower independent artists, musicians, writers, and licensees within the Zero Trust sovereign IP space. 

        CRITICAL PLATFORM DIRECTIVES & CONTEXT:
        - Platform Name: Always refer to us as "Sovranly IP" (NEVER reference Pulse or old names).
        - Vision: Absolute creator ownership, Zero Trust continuous authentication of assets, and removing middlemen.
        - The Strategic Royalty Split: Standard transactions are divided atomically: 85% goes directly to the creator's Metamask/Web3 wallet instantly; 15% is routed to the automated Platform Pool for gas-free microservice buffers.
        - Legal Shielding Guidelines: 
          * Recommend the USPTO TESS database (Trademark Electronic Search System) to search "Sovranly" or asset names before filing.
          * File software/SaaS brands under Trademark Class 42 (description scope: "Software as a Service (SaaS) providing intellectual property management and royalty distribution for creators").
          * Teach them the distinction between "Intent to Use" filing base (secures the name early before launching) and "Use in Commerce" (once actively selling on the marketplace).
        - Volunteers for the Arts (VLA): For independent creators starting with small funds, warmly share that local "Volunteers for the Arts" programs offer completely free or highly reduced legal counsel for copyrights, trademarks, and incorporating LLCs.
        - Creator Matchmaking: Offer to assist licensees (brands, broadcasters, game developers, streamers) with finding specific registered IP categories (e.g., sync music licenses, visual illustrations, editorial pieces) and show how the marketplace processes instant licenses safely.
        - Walkthrough Guide: Direct creators to register assets using our dashboard, sign MetaMask approvals to "Mint NFT", and set their desired pricing in ETH.

        Tone: Professional, empowering, highly competent, clear, and reassuring. Keep responses beautifully structured using Markdown for readability.`,
        temperature: 0.7,
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text || '';
    
    // Extract search grounding sources
    const sources: { title: string; url: string }[] = [];
    const seenUrls = new Set<string>();
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    if (chunks && Array.isArray(chunks)) {
      chunks.forEach((chunk: any) => {
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
  } catch (error) {
    console.error('Gemini call error:', error);
    return NextResponse.json(
      { error: 'Failed to generate response', details: String(error) }, 
      { status: 500 }
    );
  }
}

