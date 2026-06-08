import { NextResponse } from 'next/server';
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export async function POST(req: Request) {
  const { prompt } = await req.json();
  const response = await ai.models.generateContent({
    model: "gemini-3.5-flash",
    contents: `You are an AI assistant for Sovranly IP. Help users with onboarding and troubleshooting on our marketplace. Be concise and helpful. User question: ${prompt}`,
  });
  return NextResponse.json({ text: response.text });
}
