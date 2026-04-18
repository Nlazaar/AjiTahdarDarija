/**
 * Audit complet : pour chaque module / leçon / exercice, détermine
 *  - le track (DARIJA / MSA / RELIGION)
 *  - la source (msa-pdf-import, arabic-academy, mechanics-demo, seed classique…)
 *  - les textes arabes qui devraient avoir un audio
 *  - si le .mp3 correspondant existe sur disque (/public/audio/vocab/{slug}.mp3)
 *  - si un bouton audio sera rendu sans texte (prompt vide + audioText absent)
 *
 * Usage: npx tsx scripts/_auditAudioCoverage.ts
 */
import { PrismaClient, ModuleTrack } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';

const prisma = new PrismaClient();

const AUDIO_VOCAB = path.join(process.cwd(), 'public', 'audio', 'vocab');
const AUDIO_MSA = path.join(process.cwd(), 'public', 'audio', 'msa');

const slug = (t: string) =>
  crypto.createHash('sha256').update(t.trim().toLowerCase()).digest('hex').slice(0, 16);

const existingVocab = new Set(
  fs.existsSync(AUDIO_VOCAB)
    ? fs.readdirSync(AUDIO_VOCAB).filter((f) => f.endsWith('.mp3')).map((f) => f.replace('.mp3', ''))
    : [],
);
const existingMsa = new Set(
  fs.existsSync(AUDIO_MSA)
    ? fs.readdirSync(AUDIO_MSA).filter((f) => f.endsWith('.mp3')).map((f) => f.replace('.mp3', ''))
    : [],
);

type ExerciseAudit = {
  exerciseId: string;
  lessonTitle: string;
  moduleTitle: string;
  track: string;
  type: string;
  source: string;
  mechanic: string;
  promptEmpty: boolean;
  audioTexts: string[]; // textes qui nécessitent un audio (SpeakerButton)
  missingAudio: string[]; // textes dont le slug n'a pas de fichier
  msaAudioAssets: number; // nb d'audioAssets dans MSA exercices
  msaAudioMissingOnDisk: number; // audioAssets référençant un fichier absent
};

/** Extrait récursivement tous les `audioText` d'un objet content academy. */
function collectAudioTexts(v: any, acc: string[] = []): string[] {
  if (!v) return acc;
  if (typeof v === 'string') return acc;
  if (Array.isArray(v)) {
    v.forEach((x) => collectAudioTexts(x, acc));
    return acc;
  }
  if (typeof v === 'object') {
    if (typeof v.audioText === 'string' && v.audioText.trim()) acc.push(v.audioText.trim());
    for (const [, val] of Object.entries(v)) collectAudioTexts(val, acc);
  }
  return acc;
}

/** Extrait textes AR des exercices génériques (prompt + options + answer). */
function collectGenericAudioTargets(ex: any): string[] {
  const targets: string[] = [];
  const p = ex.prompt ?? '';
  if (/[\u0600-\u06FF]/.test(p)) targets.push(p);
  const d = ex.data ?? {};
  if (typeof d.audio === 'string' && d.audio.trim()) targets.push(d.audio.trim()); // LISTENING
  if (Array.isArray(d.options)) {
    for (const o of d.options) {
      const t = typeof o === 'string' ? o : o?.text;
      if (typeof t === 'string' && /[\u0600-\u06FF]/.test(t)) targets.push(t);
    }
  }
  return targets;
}

async function main() {
  const modules = await prisma.module.findMany({
    orderBy: [{ track: 'asc' }, { canonicalOrder: 'asc' }],
    include: {
      lessons: {
        orderBy: { order: 'asc' },
        include: {
          exercises: { orderBy: { createdAt: 'asc' } },
        },
      },
    },
  });

  const audit: ExerciseAudit[] = [];

  for (const mod of modules) {
    for (const lesson of mod.lessons) {
      for (const ex of lesson.exercises) {
        const d: any = ex.data ?? {};
        const source = d.source ?? '';
        const mechanic = (d.mechanic ?? d.mecanique ?? '').toLowerCase();

        let audioTexts: string[] = [];
        let msaAudioAssets = 0;
        let msaAudioMissingOnDisk = 0;

        if (source === 'arabic-academy') {
          audioTexts = collectAudioTexts(d.content);
        } else if (source === 'msa-pdf-import') {
          const assets = Array.isArray(d.audioAssets) ? d.audioAssets : [];
          msaAudioAssets = assets.length;
          for (const a of assets) {
            const url = a?.voix_f || a?.voix_m;
            if (typeof url === 'string' && url.startsWith('/audio/msa/')) {
              const slugMsa = url.replace('/audio/msa/', '').replace('.mp3', '');
              if (!existingMsa.has(slugMsa)) msaAudioMissingOnDisk++;
            }
          }
          // éléments avec texte AR mais AUCUN audioAsset associé
          const elements = Array.isArray(d.elements) ? d.elements : [];
          for (const el of elements) {
            if (typeof el?.ar === 'string' && el.ar.trim()) {
              const hasAsset = assets.some((a: any) => {
                const id = (a?.id ?? '').replace(/^audio_/, '');
                return id === el.id;
              });
              if (!hasAsset) audioTexts.push(el.ar.trim()); // fallback: essayer slug vocab
            }
          }
        } else {
          audioTexts = collectGenericAudioTargets(ex);
        }

        const missingAudio = audioTexts.filter((t) => !existingVocab.has(slug(t)));

        const promptEmpty = !ex.prompt || !ex.prompt.trim();

        audit.push({
          exerciseId: ex.id,
          lessonTitle: lesson.title,
          moduleTitle: mod.title,
          track: mod.track,
          type: ex.type,
          source: source || '(seed)',
          mechanic,
          promptEmpty,
          audioTexts,
          missingAudio,
          msaAudioAssets,
          msaAudioMissingOnDisk,
        });
      }
    }
  }

  // ─── Agrégats ────────────────────────────────────────
  const byModule = new Map<string, { total: number; withMissing: number; iconNoText: number; audioTotal: number; audioMissing: number }>();
  for (const a of audit) {
    const key = `${a.track} · ${a.moduleTitle}`;
    const row = byModule.get(key) ?? { total: 0, withMissing: 0, iconNoText: 0, audioTotal: 0, audioMissing: 0 };
    row.total++;
    row.audioTotal += a.audioTexts.length + a.msaAudioAssets;
    row.audioMissing += a.missingAudio.length + a.msaAudioMissingOnDisk;
    if (a.missingAudio.length > 0 || a.msaAudioMissingOnDisk > 0) row.withMissing++;
    if (a.promptEmpty && a.audioTexts.length === 0 && a.msaAudioAssets === 0 && a.type !== 'MULTIPLE_CHOICE') row.iconNoText++;
    byModule.set(key, row);
  }

  console.log('\n═══════════════════════════════════════════════════════════════════════');
  console.log('AUDIT AUDIO — état par module');
  console.log('═══════════════════════════════════════════════════════════════════════');
  console.log(
    `\nFichiers sur disque:  /audio/vocab  ${existingVocab.size.toString().padStart(4)} mp3`
    + `   |   /audio/msa  ${existingMsa.size.toString().padStart(4)} mp3\n`,
  );

  // Header
  console.log('track   │ module'.padEnd(56) + '│ exos │ audio  │ manqu.│ ko');
  console.log('─'.repeat(90));
  for (const [key, row] of byModule.entries()) {
    const [track, ...rest] = key.split(' · ');
    const title = rest.join(' · ');
    const pct = row.audioTotal > 0 ? Math.round((1 - row.audioMissing / row.audioTotal) * 100) : 100;
    const status = row.audioMissing === 0 ? '✅' : pct >= 80 ? '🟡' : '🔴';
    console.log(
      `${track.padEnd(7)} │ ${title.slice(0, 45).padEnd(45)} │ ${String(row.total).padStart(4)} │ ${String(row.audioTotal).padStart(5)}  │ ${String(row.audioMissing).padStart(5)} │ ${status} ${pct}%`,
    );
  }

  // ─── Agrégats par type ────────────────────────────────
  const byType = new Map<string, { total: number; withAudio: number; audioMissing: number }>();
  for (const a of audit) {
    const key = `${a.type}${a.source !== '(seed)' ? ' · ' + a.source : ''}${a.mechanic ? ' · ' + a.mechanic : ''}`;
    const row = byType.get(key) ?? { total: 0, withAudio: 0, audioMissing: 0 };
    row.total++;
    if (a.audioTexts.length > 0 || a.msaAudioAssets > 0) row.withAudio++;
    row.audioMissing += a.missingAudio.length + a.msaAudioMissingOnDisk;
    byType.set(key, row);
  }

  console.log('\n═══════════════════════════════════════════════════════════════════════');
  console.log('AUDIT par type / mécanique');
  console.log('═══════════════════════════════════════════════════════════════════════\n');
  const sortedTypes = [...byType.entries()].sort((a, b) => b[1].total - a[1].total);
  for (const [key, row] of sortedTypes) {
    console.log(`  ${key.padEnd(60)} ${String(row.total).padStart(4)} exos  · audio: ${row.withAudio}  · mp3 manquants: ${row.audioMissing}`);
  }

  // ─── Top 10 exos avec plus d'audio manquant ───────────
  console.log('\n═══════════════════════════════════════════════════════════════════════');
  console.log('TOP 10 exos avec mp3 manquants');
  console.log('═══════════════════════════════════════════════════════════════════════\n');
  const problematic = audit
    .filter((a) => a.missingAudio.length > 0 || a.msaAudioMissingOnDisk > 0)
    .sort((a, b) => b.missingAudio.length + b.msaAudioMissingOnDisk - (a.missingAudio.length + a.msaAudioMissingOnDisk))
    .slice(0, 10);
  for (const a of problematic) {
    console.log(
      `  [${a.track}] ${a.moduleTitle} / ${a.lessonTitle}\n` +
        `     ${a.type}${a.mechanic ? ' · ' + a.mechanic : ''}  · manquants: ${a.missingAudio.length + a.msaAudioMissingOnDisk}  (id=${a.exerciseId.slice(0, 8)}…)`,
    );
    if (a.missingAudio.length > 0) {
      console.log('       ex: ' + a.missingAudio.slice(0, 3).map((t) => `"${t.slice(0, 40)}"`).join(', '));
    }
  }

  // ─── Exos "icône audio mais pas de texte" ─────────────
  console.log('\n═══════════════════════════════════════════════════════════════════════');
  console.log('EXOS suspects (prompt vide + pas d\'audio défini) — par module');
  console.log('═══════════════════════════════════════════════════════════════════════\n');
  const ghosts = audit.filter((a) => a.promptEmpty && a.audioTexts.length === 0 && a.msaAudioAssets === 0);
  const ghostsByModule = new Map<string, number>();
  for (const g of ghosts) {
    const k = `[${g.track}] ${g.moduleTitle}`;
    ghostsByModule.set(k, (ghostsByModule.get(k) ?? 0) + 1);
  }
  for (const [k, v] of ghostsByModule.entries()) console.log(`  ${k.padEnd(55)} ${v}`);

  // Export JSON pour investigation fine
  fs.writeFileSync(
    path.join(process.cwd(), 'scripts', '_audit-output.json'),
    JSON.stringify({ summary: { byModule: Object.fromEntries(byModule), byType: Object.fromEntries(byType) }, problematic, ghosts: ghosts.slice(0, 50) }, null, 2),
  );
  console.log('\n→ Détails exportés: backend/scripts/_audit-output.json');

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
