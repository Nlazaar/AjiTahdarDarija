import { NextRequest, NextResponse } from 'next/server';
import * as fs from 'fs';
import * as path from 'path';

const CONFIG_FILE = path.join(process.cwd(), '.ai-config.json');
const ALLOWED_KEYS = [
  'AI_PROVIDER',
  'OPENAI_API_KEY', 'OPENAI_MODEL',
  'GROQ_API_KEY',   'GROQ_MODEL',
  'AZURE_SPEECH_KEY', 'AZURE_SPEECH_REGION', 'AZURE_SPEECH_VOICE',
] as const;

type ConfigKey = typeof ALLOWED_KEYS[number];
type Config = Partial<Record<ConfigKey, string>>;

function requireAuth(req: NextRequest) {
  return !!req.cookies.get('admin_session')?.value;
}

function readConfig(): Config {
  try {
    if (fs.existsSync(CONFIG_FILE)) return JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf-8'));
  } catch {}
  return {};
}

function writeConfig(c: Config) {
  fs.writeFileSync(CONFIG_FILE, JSON.stringify(c, null, 2));
}

function mask(val: string): string {
  return val.length > 8 ? val.slice(0, 8) + '••••••••••••' : '••••';
}

export async function GET(req: NextRequest) {
  if (!requireAuth(req)) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

  const file = readConfig();
  const merged: Config = {};
  for (const key of ALLOWED_KEYS) {
    merged[key] = file[key] ?? process.env[key] ?? '';
  }

  const masked = { ...merged };
  for (const k of ['OPENAI_API_KEY', 'GROQ_API_KEY', 'AZURE_SPEECH_KEY'] as ConfigKey[]) {
    if (masked[k]) masked[k] = mask(masked[k]!);
  }

  return NextResponse.json({ config: masked });
}

export async function POST(req: NextRequest) {
  if (!requireAuth(req)) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

  const body: Config = await req.json().catch(() => ({}));
  const existing = readConfig();
  const updated: Config = { ...existing };

  for (const key of ALLOWED_KEYS) {
    const val = body[key];
    if (val && !val.includes('••')) {
      updated[key] = val;
      process.env[key] = val;
    }
  }

  writeConfig(updated);
  return NextResponse.json({ ok: true });
}
