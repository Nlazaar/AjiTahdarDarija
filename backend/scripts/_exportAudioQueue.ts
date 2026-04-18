/**
 * Exporte la queue des audios à générer via Habibi-TTS.
 * Deux sources :
 *   1. MSA-PDF audioAssets avec voix_f/voix_m filename-only (pas d'URL absolue)
 *      → 6729 items. texte = audioAssets[].texte_ar. cible = public/audio/msa/{nomPdf}/{filename}
 *   2. Academy/seed exercices qui utilisent audioText mais où le slug vocab n'existe pas
 *      → ~500 items. texte = audioText. cible = public/audio/vocab/{slug}.mp3
 *
 * Usage: npx tsx scripts/_exportAudioQueue.ts
 * Output: backend/scripts/_tts-queue.json
 */
import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';

const prisma = new PrismaClient();

const slug = (t: string) =>
  crypto.createHash('sha256').update(t.trim().toLowerCase()).digest('hex').slice(0, 16);

const VOCAB_DIR = path.join(process.cwd(), 'public', 'audio', 'vocab');
const existingVocab = new Set(
  fs.existsSync(VOCAB_DIR) ? fs.readdirSync(VOCAB_DIR).filter((f) => f.endsWith('.mp3')).map((f) => f.replace('.mp3', '')) : [],
);

type QueueItem = {
  text: string;
  target: 'vocab' | 'msa';
  outPath: string; // public URL (pour référence DB)
  exerciseId?: string;
  source: string;
};

function collectAudioTexts(v: any, acc: string[] = []): string[] {
  if (!v || typeof v !== 'object') return acc;
  if (Array.isArray(v)) {
    v.forEach((x) => collectAudioTexts(x, acc));
    return acc;
  }
  if (typeof v.audioText === 'string' && v.audioText.trim()) acc.push(v.audioText.trim());
  for (const val of Object.values(v)) collectAudioTexts(val, acc);
  return acc;
}

async function main() {
  const queue: QueueItem[] = [];
  const seenVocab = new Set<string>();

  // Source 1 : MSA PDF — audioAssets dont voix_f est un filename seul
  const msaExos = await prisma.exercise.findMany({
    where: { data: { path: ['source'], equals: 'msa-pdf-import' } },
    select: { id: true, data: true, lesson: { select: { slug: true } } },
  });
  for (const ex of msaExos) {
    const d = ex.data as any;
    const nomPdf = (ex.lesson?.slug ?? '').replace(/^msa-pdf-/, '');
    const assets = Array.isArray(d?.audioAssets) ? d.audioAssets : [];
    for (const a of assets) {
      const f = a?.voix_f || a?.voix_m || '';
      if (!f || f.startsWith('/') || f.startsWith('http')) continue;
      const text = (a?.texte_ar ?? '').trim();
      if (!text) continue;
      queue.push({
        text,
        target: 'msa',
        outPath: `/audio/msa/${nomPdf}/${f}`,
        exerciseId: ex.id,
        source: 'msa-pdf-import',
      });
    }
  }

  // Source 2 : Academy (arabic-academy) — audioText manquant sur disque
  const academyExos = await prisma.exercise.findMany({
    where: { data: { path: ['source'], equals: 'arabic-academy' } },
    select: { id: true, data: true },
  });
  for (const ex of academyExos) {
    const texts = collectAudioTexts((ex.data as any)?.content);
    for (const text of texts) {
      const s = slug(text);
      if (existingVocab.has(s)) continue;
      if (seenVocab.has(s)) continue;
      seenVocab.add(s);
      queue.push({ text, target: 'vocab', outPath: `/audio/vocab/${s}.mp3`, exerciseId: ex.id, source: 'arabic-academy' });
    }
  }

  // Source 3 : Seed/autres exos — filtre en JS sur data.source (le filtre Prisma JSON NOT+path est peu fiable)
  const allExos = await prisma.exercise.findMany({
    select: { id: true, prompt: true, data: true, type: true },
  });
  for (const ex of allExos) {
    const src = (ex.data as any)?.source;
    if (src === 'msa-pdf-import' || src === 'arabic-academy') continue; // déjà traités

    const candidates: string[] = [];
    if (ex.prompt && /[\u0600-\u06FF]/.test(ex.prompt)) candidates.push(ex.prompt);
    const opts = (ex.data as any)?.options ?? [];
    for (const o of opts) {
      const t = typeof o === 'string' ? o : o?.text;
      if (typeof t === 'string' && /[\u0600-\u06FF]/.test(t)) candidates.push(t);
    }
    // Cible audio explicite dans data (ex: alphabet — letter.arabic)
    const audioField = (ex.data as any)?.audio;
    if (typeof audioField === 'string' && /[\u0600-\u06FF]/.test(audioField)) candidates.push(audioField);
    const targetField = (ex.data as any)?.target;
    if (typeof targetField === 'string' && /[\u0600-\u06FF]/.test(targetField)) candidates.push(targetField);

    for (const text of candidates) {
      const s = slug(text);
      if (existingVocab.has(s) || seenVocab.has(s)) continue;
      seenVocab.add(s);
      queue.push({ text, target: 'vocab', outPath: `/audio/vocab/${s}.mp3`, exerciseId: ex.id, source: 'seed' });
    }
  }

  // ─── Résumé ─────────────────────────────────────
  const byTarget = new Map<string, number>();
  const bySource = new Map<string, number>();
  for (const q of queue) {
    byTarget.set(q.target, (byTarget.get(q.target) ?? 0) + 1);
    bySource.set(q.source, (bySource.get(q.source) ?? 0) + 1);
  }
  console.log(`\n🎤 TTS queue — ${queue.length} audio à générer`);
  console.log('\nPar cible :');
  for (const [k, v] of byTarget) console.log(`  /${k}  ${v.toString().padStart(5)}`);
  console.log('\nPar source :');
  for (const [k, v] of bySource) console.log(`  ${k.padEnd(30)}  ${v.toString().padStart(5)}`);

  // Déduplication par text → un texte unique = une génération
  const uniqueTexts = new Map<string, QueueItem>();
  for (const q of queue) {
    if (!uniqueTexts.has(q.text)) uniqueTexts.set(q.text, q);
  }
  console.log(`\nTextes uniques à synthétiser : ${uniqueTexts.size} (dédupliqué)`);

  const outFile = path.join(process.cwd(), 'scripts', '_tts-queue.json');
  fs.writeFileSync(outFile, JSON.stringify(queue, null, 2));
  console.log(`\n→ Exporté : ${outFile}`);

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
