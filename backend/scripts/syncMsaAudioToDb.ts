#!/usr/bin/env ts-node
/**
 * Sync des MP3 MSA existants (backend/audio/tmp/audio_<nomPdf>/*.mp3)
 *   1. Copie vers backend/public/audio/msa/<nomPdf>/<filename>.mp3
 *   2. Met à jour Lesson.content.steps[].audioAssets[].voix_m/voix_f
 *      et Exercise.data.audioAssets[].voix_m/voix_f avec l'URL publique
 *
 * Idempotent: skip les fichiers déjà copiés, met à jour les URLs en place.
 * Scope strict au namespace msa-pdf-* — ne touche pas l'existant.
 *
 * Usage:
 *   npx ts-node scripts/syncMsaAudioToDb.ts --dry-run
 *   npx ts-node scripts/syncMsaAudioToDb.ts --lesson=coursarabe_niveau1_lecon02
 *   npx ts-node scripts/syncMsaAudioToDb.ts
 */

import { PrismaClient, Prisma } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

const SRC_DIR = path.join(__dirname, '..', 'audio', 'tmp');
const DST_DIR = path.join(__dirname, '..', 'public', 'audio', 'msa');
const URL_PREFIX = '/audio/msa';
const LESSON_SLUG_PREFIX = 'msa-pdf-';

function parseArgs(argv: string[]) {
  const dryRun = argv.includes('--dry-run');
  const lessonArg = argv.find((a) => a.startsWith('--lesson='));
  return { dryRun, lessonFilter: lessonArg?.split('=')[1] };
}

// Liste les sous-dossiers "audio_<nomPdf>" et retourne Map<nomPdf, srcPath>
function discoverAudioFolders(): Map<string, string> {
  const map = new Map<string, string>();
  if (!fs.existsSync(SRC_DIR)) return map;
  for (const entry of fs.readdirSync(SRC_DIR)) {
    if (!entry.startsWith('audio_')) continue;
    const full = path.join(SRC_DIR, entry);
    if (!fs.statSync(full).isDirectory()) continue;
    const nomPdf = entry.replace(/^audio_/, '');
    map.set(nomPdf, full);
  }
  return map;
}

// Copie les MP3 d'un dossier source vers public/audio/msa/<nomPdf>/
// Retourne Map<filename, publicUrl>
function copyFolder(nomPdf: string, srcPath: string, dryRun: boolean): Map<string, string> {
  const urlMap = new Map<string, string>();
  const dstPath = path.join(DST_DIR, nomPdf);
  if (!dryRun) fs.mkdirSync(dstPath, { recursive: true });

  let copied = 0;
  let skipped = 0;
  for (const file of fs.readdirSync(srcPath)) {
    if (!file.toLowerCase().endsWith('.mp3')) continue;
    const src = path.join(srcPath, file);
    const dst = path.join(dstPath, file);
    const url = `${URL_PREFIX}/${nomPdf}/${file}`;
    urlMap.set(file, url);
    if (dryRun) {
      copied++;
      continue;
    }
    if (fs.existsSync(dst) && fs.statSync(dst).size === fs.statSync(src).size) {
      skipped++;
    } else {
      fs.copyFileSync(src, dst);
      copied++;
    }
  }
  console.log(`  ✓ ${nomPdf}: ${copied} copiés, ${skipped} déjà présents`);
  return urlMap;
}

// Réécrit voix_m/voix_f d'un array audioAssets avec les URLs.
// Retourne [updatedArray, hasChanged].
function rewriteAudioAssets(
  assets: any,
  urlMap: Map<string, string>,
): [any[], boolean] {
  if (!Array.isArray(assets)) return [[], false];
  let changed = false;
  const out = assets.map((a) => {
    if (!a || typeof a !== 'object') return a;
    const copy = { ...a };
    for (const k of ['voix_m', 'voix_f'] as const) {
      const v = copy[k];
      if (typeof v !== 'string' || !v) continue;
      if (v.startsWith('/') || v.startsWith('http')) continue; // déjà une URL
      const mapped = urlMap.get(v);
      if (mapped && mapped !== v) {
        copy[k] = mapped;
        changed = true;
      }
    }
    return copy;
  });
  return [out, changed];
}

async function syncLesson(nomPdf: string, urlMap: Map<string, string>, dryRun: boolean) {
  const slug = `${LESSON_SLUG_PREFIX}${nomPdf}`.toLowerCase();
  const lesson = await prisma.lesson.findUnique({
    where: { slug },
    include: { exercises: true },
  });
  if (!lesson) {
    console.log(`  ⚠️  Aucune leçon en DB pour ${nomPdf} (slug=${slug})`);
    return;
  }

  // Lesson.content.steps[].audioAssets[]
  const content: any = lesson.content ?? {};
  let contentChanged = false;
  if (Array.isArray(content.steps)) {
    content.steps = content.steps.map((step: any) => {
      const [newAssets, changed] = rewriteAudioAssets(step?.audioAssets ?? [], urlMap);
      if (changed) contentChanged = true;
      return { ...step, audioAssets: newAssets };
    });
  }
  if (contentChanged && !dryRun) {
    await prisma.lesson.update({
      where: { id: lesson.id },
      data: { content: content as Prisma.InputJsonValue },
    });
  }

  // Exercises: data.audioAssets[]
  let exoUpdated = 0;
  for (const ex of lesson.exercises) {
    const data: any = ex.data ?? {};
    const [newAssets, changed] = rewriteAudioAssets(data.audioAssets ?? [], urlMap);
    if (!changed) continue;
    if (!dryRun) {
      await prisma.exercise.update({
        where: { id: ex.id },
        data: { data: { ...data, audioAssets: newAssets } as Prisma.InputJsonValue },
      });
    }
    exoUpdated++;
  }

  console.log(
    `    → DB: ${contentChanged ? 'content MAJ' : 'content inchangé'}, ${exoUpdated} exercice(s) MAJ${dryRun ? ' (dry-run)' : ''}`,
  );
}

async function main() {
  const { dryRun, lessonFilter } = parseArgs(process.argv.slice(2));
  console.log(`\n🎵 Sync audio MSA ${dryRun ? '(DRY-RUN)' : ''}`);
  if (lessonFilter) console.log(`   Filtre: ${lessonFilter}`);

  const folders = discoverAudioFolders();
  if (folders.size === 0) {
    console.log(`   Aucun dossier audio dans ${SRC_DIR}`);
    return;
  }
  console.log(`   ${folders.size} dossier(s) audio détecté(s)\n`);

  let processed = 0;
  for (const [nomPdf, srcPath] of folders.entries()) {
    if (lessonFilter && nomPdf !== lessonFilter) continue;
    const urlMap = copyFolder(nomPdf, srcPath, dryRun);
    await syncLesson(nomPdf, urlMap, dryRun);
    processed++;
  }

  console.log(`\n✅ Terminé. ${processed} leçon(s) traitée(s).`);
  if (dryRun) console.log('   (aucune écriture en base ni copie — mode dry-run)');
}

main()
  .catch((err) => {
    console.error('\n❌ Erreur:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
