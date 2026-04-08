#!/usr/bin/env node
/**
 * Script de pré-génération audio via Habibi-TTS
 * ─────────────────────────────────────────────
 * Génère un fichier MP3 pour chaque mot Darija en base de données.
 * Les fichiers sont stockés dans : backend/public/audio/vocab/{slug}.mp3
 *
 * Usage :
 *   node scripts/generate-audio.js
 *   node scripts/generate-audio.js --dry-run       (affiche sans générer)
 *   node scripts/generate-audio.js --force          (re-génère même si existant)
 *
 * Prérequis :
 *   HABIBI_TTS_URL=http://localhost:7860   (ou HF Space URL)
 *   DATABASE_URL=...
 */

require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const fetch = require('node-fetch');
const fs    = require('fs');
const path  = require('path');
const crypto = require('crypto');

const HABIBI_URL   = process.env.HABIBI_TTS_URL?.replace(/\/$/, '');
const HF_KEY       = process.env.HUGGINGFACE_API_KEY;
const HF_MODEL     = process.env.HUGGINGFACE_TTS_MODEL ?? 'espnet/kan-bayashi_ljspeech_vits';
const OUT_DIR      = path.join(__dirname, '..', 'public', 'audio', 'vocab');
const DIALECT      = 'MAR';
const CONCURRENCY  = 3;   // requêtes parallèles max
const DELAY_MS     = 500; // délai entre batches (respecter rate limit HF)

const DRY_RUN = process.argv.includes('--dry-run');
const FORCE   = process.argv.includes('--force');

function slug(text) {
  return crypto.createHash('md5').update(text.trim().toLowerCase()).digest('hex').slice(0, 16);
}

async function callHabibi(text) {
  const res = await fetch(`${HABIBI_URL}/run/predict`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ data: [text, DIALECT] }),
    timeout: 30000,
  });
  if (!res.ok) throw new Error(`Habibi predict: ${res.status}`);
  const json = await res.json();
  const audioData = json?.data?.[0];
  if (!audioData) throw new Error('No audio in response');

  if (typeof audioData === 'string' && audioData.startsWith('data:audio')) {
    return Buffer.from(audioData.split(',')[1], 'base64');
  }
  const fileUrl = audioData?.url ?? audioData?.path ?? audioData?.name ?? '';
  if (!fileUrl) throw new Error('No file URL in response');
  const fullUrl = fileUrl.startsWith('http') ? fileUrl : `${HABIBI_URL}/file=${fileUrl}`;
  const fileRes = await fetch(fullUrl, { timeout: 20000 });
  if (!fileRes.ok) throw new Error(`File fetch: ${fileRes.status}`);
  return Buffer.from(await fileRes.arrayBuffer());
}

async function callHuggingFace(text) {
  const res = await fetch(`https://api-inference.huggingface.co/models/${HF_MODEL}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${HF_KEY}`,
      'Content-Type': 'application/json',
      Accept: 'audio/mpeg',
    },
    body: JSON.stringify({ inputs: text }),
    timeout: 30000,
  });
  if (!res.ok) throw new Error(`HF TTS: ${res.status}`);
  return Buffer.from(await res.arrayBuffer());
}

async function generateOne(word) {
  if (HABIBI_URL) return callHabibi(word);
  if (HF_KEY)     return callHuggingFace(word);
  throw new Error('No TTS provider configured (set HABIBI_TTS_URL or HUGGINGFACE_API_KEY)');
}

async function processWords(words) {
  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

  let generated = 0, skipped = 0, failed = 0;
  const prisma = new PrismaClient();
  const total  = words.length;

  for (let i = 0; i < words.length; i += CONCURRENCY) {
    const batch = words.slice(i, i + CONCURRENCY);
    await Promise.all(batch.map(async (vocab) => {
      const text    = vocab.word;
      const fileSlug = slug(text);
      const outPath  = path.join(OUT_DIR, `${fileSlug}.mp3`);
      const publicUrl = `/audio/vocab/${fileSlug}.mp3`;

      if (!FORCE && fs.existsSync(outPath)) {
        process.stdout.write(`  ⏭  [${++skipped + generated}/${total}] skipped: ${text}\n`);
        return;
      }

      if (DRY_RUN) {
        process.stdout.write(`  🔍 [${i}/${total}] would generate: "${text}" → ${fileSlug}.mp3\n`);
        return;
      }

      try {
        const buffer = await generateOne(text);
        fs.writeFileSync(outPath, buffer);

        // Mettre à jour audioUrl en base
        await prisma.vocabulary.update({
          where: { id: vocab.id },
          data:  { audioUrl: publicUrl },
        });

        generated++;
        process.stdout.write(`  ✅ [${generated + skipped}/${total}] "${text}" → ${fileSlug}.mp3\n`);
      } catch (err) {
        failed++;
        process.stdout.write(`  ❌ [${generated + skipped}/${total}] FAILED "${text}": ${err.message}\n`);
      }
    }));

    if (i + CONCURRENCY < words.length) {
      await new Promise(r => setTimeout(r, DELAY_MS));
    }
  }

  await prisma.$disconnect();
  return { generated, skipped, failed, total };
}

async function main() {
  if (!HABIBI_URL && !HF_KEY) {
    console.error('\n❌ Configure au moins une variable :\n   HABIBI_TTS_URL=http://localhost:7860\n   HUGGINGFACE_API_KEY=hf_...\n');
    process.exit(1);
  }

  console.log(`\n🎙  AjiTahdar Darija — Pré-génération audio (Habibi-TTS)`);
  console.log(`   Provider : ${HABIBI_URL ? `Habibi-TTS → ${HABIBI_URL}` : `HuggingFace → ${HF_MODEL}`}`);
  console.log(`   Dialect  : ${DIALECT} (Moroccan Arabic)`);
  console.log(`   Output   : ${OUT_DIR}`);
  console.log(`   Mode     : ${DRY_RUN ? 'DRY RUN' : FORCE ? 'FORCE (re-generate all)' : 'INCREMENTAL (skip existing)'}\n`);

  const prisma = new PrismaClient();
  let words;
  try {
    words = await prisma.vocabulary.findMany({
      select: { id: true, word: true, transliteration: true, audioUrl: true },
      orderBy: { word: 'asc' },
    });
  } finally {
    await prisma.$disconnect();
  }

  console.log(`   Found ${words.length} vocabulary entries in DB\n`);

  if (words.length === 0) {
    console.log('   ⚠️  No vocabulary found in database. Run the seed scripts first.');
    process.exit(0);
  }

  const { generated, skipped, failed, total } = await processWords(words);

  console.log(`\n${'─'.repeat(50)}`);
  console.log(`  Total    : ${total}`);
  console.log(`  Generated: ${generated}`);
  console.log(`  Skipped  : ${skipped}`);
  console.log(`  Failed   : ${failed}`);
  if (failed > 0) console.log(`\n  ⚠️  ${failed} word(s) failed — re-run to retry`);
  console.log(`${'─'.repeat(50)}\n`);
}

main().catch(err => {
  console.error('Fatal:', err.message);
  process.exit(1);
});
