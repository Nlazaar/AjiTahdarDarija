import { NextRequest, NextResponse } from 'next/server';
import * as fs from 'fs';
import * as path from 'path';

// ── Config dynamique (.ai-config.json prioritaire sur .env) ───────────────────
function getConfig() {
  try {
    const f = path.join(process.cwd(), '.ai-config.json');
    if (fs.existsSync(f)) {
      const c = JSON.parse(fs.readFileSync(f, 'utf-8'));
      return {
        provider:    c.AI_PROVIDER   ?? process.env.AI_PROVIDER   ?? 'groq',
        openaiKey:   c.OPENAI_API_KEY?? process.env.OPENAI_API_KEY?? '',
        openaiModel: c.OPENAI_MODEL  ?? process.env.OPENAI_MODEL  ?? 'gpt-4o-mini',
        groqKey:     c.GROQ_API_KEY  ?? process.env.GROQ_API_KEY  ?? '',
        groqModel:   c.GROQ_MODEL    ?? process.env.GROQ_MODEL    ?? 'llama-3.3-70b-versatile',
      };
    }
  } catch {}
  return {
    provider:    process.env.AI_PROVIDER    ?? 'groq',
    openaiKey:   process.env.OPENAI_API_KEY ?? '',
    openaiModel: process.env.OPENAI_MODEL   ?? 'gpt-4o-mini',
    groqKey:     process.env.GROQ_API_KEY   ?? '',
    groqModel:   process.env.GROQ_MODEL     ?? 'llama-3.3-70b-versatile',
  };
}

// ── Rate limiting ─────────────────────────────────────────────────────────────
const ipRateMap = new Map<string, { count: number; reset: number }>();

function checkRateLimit(req: NextRequest): boolean {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? 'unknown';
  const now = Date.now();
  const entry = ipRateMap.get(ip);
  if (!entry || entry.reset < now) { ipRateMap.set(ip, { count: 1, reset: now + 3600_000 }); return true; }
  if (entry.count >= 30) return false;
  entry.count++;
  return true;
}

// ── System prompts selon le parcours ─────────────────────────────────────────
const SYSTEM_DARIJA = `Tu es Aji, professeur natif de Darija marocaine.

RÈGLE ABSOLUE : Écris le Darija en phonétique française (alphabet latin), jamais en arabe.
Les élèves sont francophones et ne lisent pas l'arabe.

Phonétique marocaine à utiliser :
- "je veux" → bghit
- "maintenant" → daba
- "beaucoup" → bzaf
- "non/pas" → machi
- "oui" → ih / ayeh
- "ça va ?" → labas ?
- "comment ?" → kifach ?
- "où ?" → fin ?
- "quoi ?" → achnou ?
- "pourquoi ?" → 3lach ? (3 = lettre arabe ع)
- "je suis" → ana
- "il y a" → kayn
- "merci" → choukran / barakallaoufik
- "s'il te plaît" → 3afak
- "ami" → sahbi
- "maison" → dar

Format de réponse OBLIGATOIRE (exactement ces 4 lignes) :
🗣️ [phonétique française avec toutes les voyelles ex: bghît nâkoul, smîya, 3âfak]
🔊 [arabe avec tashkeel complet (signes voyelles) ex: بْغِيتْ نَاكُولْ pour une prononciation exacte]
🇫🇷 [traduction française]
💡 [exemple en phonétique française]

IMPORTANT ligne 🔊 : écris TOUTES les voyelles courtes (fatha َ, kasra ِ, damma ُ, sukun ْ) sur chaque lettre.
Sois encourageant, court et pédagogique.`;

const SYSTEM_MSA = `Tu es Aji, professeur d'arabe littéraire moderne (الفصحى / MSA).

Tu enseignes l'arabe standard moderne — compris dans tout le monde arabe.
Les élèves sont francophones débutants.

Format de réponse OBLIGATOIRE (exactement ces 4 lignes) :
🗣️ [translittération latine du mot/phrase MSA ex: marhaban, kayfa haluk, shukran jazilan]
🔊 [arabe avec tashkeel complet (signes voyelles) pour prononciation TTS ex: مَرْحَباً، كَيْفَ حَالُكَ؟]
🇫🇷 [traduction française]
💡 [exemple d'utilisation avec translittération]

IMPORTANT ligne 🔊 : écris TOUTES les voyelles courtes (fatha َ, kasra ِ, damma ُ, sukun ْ) sur chaque lettre.
Explique brièvement la grammaire si utile (genre, pluriel, conjugaison).
Sois encourageant, court et pédagogique.`;

const SYSTEM_BOTH = `Tu es Aji, professeur bilingue Darija + Arabe Littéraire (MSA).

Tu enseignes en parallèle le dialecte marocain et l'arabe standard moderne.
Quand l'élève pose une question, donne la réponse en DARIJA d'abord, puis la version MSA.

Format de réponse OBLIGATOIRE :
🗣️ [Darija phonétique française] / [MSA translittération]
🔊 [arabe dialectal avec tashkeel] / [arabe MSA avec tashkeel]
🇫🇷 [traduction française]
💡 [exemple Darija] / [exemple MSA]

IMPORTANT : toujours écrire les deux versions côte à côte, séparées par /
Sois encourageant, court et pédagogique.`;

function getSystemPrompt(track?: string) {
  if (track === 'MSA')  return SYSTEM_MSA;
  if (track === 'BOTH') return SYSTEM_BOTH;
  return SYSTEM_DARIJA;
}

// ── Appel OpenAI ──────────────────────────────────────────────────────────────
async function callOpenAI(messages: any[], key: string, model: string, system: string): Promise<string> {
  const { default: OpenAI } = await import('openai');
  const client = new OpenAI({ apiKey: key });
  const res = await client.chat.completions.create({
    model,
    max_tokens: 400,
    messages: [{ role: 'system', content: system }, ...messages],
  });
  return res.choices[0]?.message?.content ?? '';
}

// ── Appel Groq ────────────────────────────────────────────────────────────────
async function callGroq(messages: any[], key: string, model: string, system: string): Promise<string> {
  const { default: Groq } = await import('groq-sdk');
  const client = new Groq({ apiKey: key });
  const res = await client.chat.completions.create({
    model,
    max_tokens: 400,
    messages: [{ role: 'system', content: system }, ...messages],
  });
  return res.choices[0]?.message?.content ?? '';
}

// ── POST /api/chat ────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  if (!checkRateLimit(req)) {
    return NextResponse.json({ error: 'Limite atteinte (30 msg/h). Réessaie plus tard.' }, { status: 429 });
  }

  const body = await req.json().catch(() => ({}));
  const messages: any[] = (body.messages ?? []).slice(-10);
  const track: string   = body.track ?? 'DARIJA'; // 'DARIJA' | 'MSA' | 'BOTH'

  if (!messages.length) return NextResponse.json({ error: 'Messages vides' }, { status: 400 });

  // Injection prompt basique
  for (const m of messages) {
    if (typeof m.content === 'string' && /ignore.*instructions|system.?prompt|jailbreak/i.test(m.content)) {
      return NextResponse.json({ text: "Concentrons-nous sur l'arabe ! Que veux-tu apprendre ?" });
    }
  }

  const cfg    = getConfig();
  const system = getSystemPrompt(track);

  // Ordre : openai → groq
  const providers: Array<() => Promise<string>> = [];
  if (cfg.provider === 'openai' && cfg.openaiKey) providers.push(() => callOpenAI(messages, cfg.openaiKey, cfg.openaiModel, system));
  if (cfg.groqKey) providers.push(() => callGroq(messages, cfg.groqKey, cfg.groqModel, system));
  if (cfg.provider !== 'openai' && cfg.openaiKey) providers.push(() => callOpenAI(messages, cfg.openaiKey, cfg.openaiModel, system));

  if (!providers.length) {
    return NextResponse.json({ error: 'Aucune clé API configurée. Va dans /admin pour en ajouter une.' }, { status: 503 });
  }

  for (const call of providers) {
    try {
      const text = await call();
      const providerName = call.toString().includes('OpenAI') || call.toString().includes('openai') ? 'openai' : 'groq';
      return NextResponse.json({ text, provider: providerName });
    } catch { continue; }
  }

  return NextResponse.json({ error: 'Tous les providers ont échoué.' }, { status: 500 });
}

// ── GET /api/chat — statut pour l'admin ──────────────────────────────────────
export async function GET() {
  const cfg = getConfig();
  return NextResponse.json({
    provider: cfg.provider,
    openai:   { configured: !!cfg.openaiKey, model: cfg.openaiModel },
    groq:     { configured: !!cfg.groqKey,   model: cfg.groqModel   },
  });
}
