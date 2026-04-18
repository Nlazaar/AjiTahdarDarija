import { NextRequest, NextResponse } from 'next/server';
import * as fs from 'fs';
import * as path from 'path';

function getAzureConfig() {
  try {
    const f = path.join(process.cwd(), '.ai-config.json');
    if (fs.existsSync(f)) {
      const c = JSON.parse(fs.readFileSync(f, 'utf-8'));
      return {
        key:    c.AZURE_SPEECH_KEY    ?? process.env.AZURE_SPEECH_KEY    ?? '',
        region: c.AZURE_SPEECH_REGION ?? process.env.AZURE_SPEECH_REGION ?? 'francecentral',
        voice:  c.AZURE_SPEECH_VOICE  ?? process.env.AZURE_SPEECH_VOICE  ?? 'ar-MA-JamalNeural',
      };
    }
  } catch {}
  return {
    key:    process.env.AZURE_SPEECH_KEY    ?? '',
    region: process.env.AZURE_SPEECH_REGION ?? 'francecentral',
    voice:  process.env.AZURE_SPEECH_VOICE  ?? 'ar-MA-JamalNeural',
  };
}

// Choisit la voix selon le track (MSA = ar-SA-HamedNeural, Darija = ar-MA-JamalNeural)
function resolveVoice(configVoice: string, track: string | null): string {
  if (track === 'MSA') return 'ar-SA-HamedNeural';
  if (track === 'DARIJA') return 'ar-MA-JamalNeural';
  return configVoice || 'ar-MA-JamalNeural';
}

export async function GET(req: NextRequest) {
  const text  = req.nextUrl.searchParams.get('text')?.trim();
  const track = req.nextUrl.searchParams.get('track'); // 'MSA' | 'DARIJA' | null
  if (!text) return NextResponse.json({ error: 'text manquant' }, { status: 400 });

  const { key, region, voice: configVoice } = getAzureConfig();
  const voice = resolveVoice(configVoice, track);

  if (!key) {
    return NextResponse.json({ error: 'AZURE_SPEECH_KEY non configuré' }, { status: 503 });
  }

  const safe = text.replace(/[<>&'"]/g, '');
  const lang = track === 'MSA' ? 'ar-SA' : 'ar-MA';
  const ssml = `<speak version='1.0' xml:lang='${lang}'>
    <voice name='${voice}'><prosody rate='-15%'>${safe}</prosody></voice>
  </speak>`;

  const url = `https://${region}.tts.speech.microsoft.com/cognitiveservices/v1`;

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Ocp-Apim-Subscription-Key': key,
      'Content-Type': 'application/ssml+xml',
      'X-Microsoft-OutputFormat': 'audio-16khz-128kbitrate-mono-mp3',
      'User-Agent': 'AjiTahdar',
    },
    body: ssml,
  });

  if (!res.ok) {
    const err = await res.text();
    return NextResponse.json({ error: `Azure TTS: ${res.status} ${err}` }, { status: 502 });
  }

  const buffer = await res.arrayBuffer();
  return new NextResponse(buffer, {
    headers: {
      'Content-Type': 'audio/mpeg',
      'Cache-Control': 'public, max-age=86400',
    },
  });
}
