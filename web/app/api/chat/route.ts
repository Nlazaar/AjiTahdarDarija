import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: 'ANTHROPIC_API_KEY manquante. Ajoute-la dans web/.env.local' },
      { status: 503 },
    );
  }

  try {
    const { messages, systemPrompt } = await req.json();

    const response = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 400,
      system: systemPrompt,
      messages,
    });

    const text =
      response.content[0].type === 'text' ? response.content[0].text : '';

    return NextResponse.json({ text });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message ?? 'Erreur inconnue' },
      { status: 500 },
    );
  }
}
