/**
 * Peuple les révisions MIDDLE et END du module Larache (Vocabulaire — Couleurs)
 * avec des exercices gamifiés (VoixVisuel + TrouverIntrus) basés sur les 13 vocab.
 *
 * DRY-RUN par défaut ; `--apply` pour écrire.
 *   npx tsx scripts/populateLaracheRevisions.ts
 *   npx tsx scripts/populateLaracheRevisions.ts --apply
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const APPLY = process.argv.includes('--apply');
const MODULE_SLUG = 'vocab-couleurs';

// translit → hex (palette de swatches affichée à l'écran)
const COLOR_HEX: Record<string, string> = {
  bayed: '#ffffff',
  k7el: '#000000',
  '7mer': '#dc2626',
  khdar: '#16a34a',
  zrq: '#2563eb',
  sfere: '#eab308',
  wardi: '#ec4899',
  rmadi: '#6b7280',
  bni: '#78350f',
  bortoqali: '#ea580c',
  bnafsaji: '#7c3aed',
  dhahbi: '#d4a84b',
  fddi: '#9ca3af',
};

type VocabRow = {
  id: string;
  word: string;
  transliteration: string | null;
  translation: any;
  audioUrl: string | null;
};

type VisualAsset =
  | { kind: 'color'; value: string }
  | { kind: 'text'; value: string; lang?: 'ar' | 'fr' | 'darija' };

type Item = {
  id: string;
  audio: { url?: string; fallbackText: string };
  visual: VisualAsset;
  label?: string;
};

function toItem(v: VocabRow): Item {
  const t = v.transliteration!;
  const hex = COLOR_HEX[t];
  if (!hex) throw new Error(`Hex manquant pour translit="${t}"`);
  return {
    id: t,
    audio: { url: v.audioUrl ?? undefined, fallbackText: v.word },
    visual: { kind: 'color', value: hex },
    label: typeof v.translation === 'object' && v.translation?.fr ? v.translation.fr : t,
  };
}

function log(msg: string) {
  console.log(`${APPLY ? '[APPLY] ' : '[DRY]   '}${msg}`);
}

(async () => {
  const mod = await prisma.module.findUnique({
    where: { slug: MODULE_SLUG },
    include: {
      revisions: true,
      lessons: {
        include: {
          exercises: { include: { vocabulary: true } },
        },
      },
    },
  });
  if (!mod) { console.error(`Module "${MODULE_SLUG}" introuvable.`); process.exit(1); }

  // Collecte unique des vocab du module
  const seen = new Set<string>();
  const vocabs: VocabRow[] = [];
  for (const l of mod.lessons) {
    for (const e of l.exercises) {
      const v = e.vocabulary;
      if (!v || !v.transliteration || seen.has(v.id)) continue;
      seen.add(v.id);
      vocabs.push({
        id: v.id,
        word: v.word,
        transliteration: v.transliteration,
        translation: v.translation,
        audioUrl: v.audioUrl,
      });
    }
  }
  console.log(`\n━━━ ${mod.title} — ${vocabs.length} vocab collecté(s)`);
  for (const v of vocabs) console.log(`  • ${v.transliteration}  "${v.word}"  audio=${v.audioUrl ? 'oui' : 'non'}`);

  // Sanity check: toutes les clés attendues présentes
  const translitSet = new Set(vocabs.map((v) => v.transliteration!));
  const expected = Object.keys(COLOR_HEX);
  const missing = expected.filter((t) => !translitSet.has(t));
  if (missing.length) {
    console.error('\nVocab manquants (présent dans COLOR_HEX mais pas en base):', missing);
    process.exit(1);
  }

  // Items
  const allItems = vocabs.map(toItem);
  const byTranslit = new Map(allItems.map((i) => [i.id, i]));
  const pick = (keys: string[]): Item[] => keys.map((k) => {
    const it = byTranslit.get(k);
    if (!it) throw new Error(`Item manquant: ${k}`);
    return it;
  });

  // ── MIDDLE — 3 exos variés (primaires / neutres / intrus) ──
  const middleContent = {
    kind: 'exercises' as const,
    setting: 'Médina de Larache',
    theme: 'Couleurs essentielles',
    exercises: [
      {
        typology: 'VoixVisuel',
        config: {
          mode: 'ligne',
          prompt: 'Les 4 couleurs primaires — relie chaque voix à la bonne pastille.',
          items: pick(['7mer', 'zrq', 'sfere', 'khdar']),
        },
      },
      {
        typology: 'VoixVisuel',
        config: {
          mode: 'drag',
          prompt: 'Les 3 couleurs neutres — glisse (ou clique) chaque voix sur sa pastille.',
          items: pick(['bayed', 'k7el', 'rmadi']),
        },
      },
      {
        typology: 'TrouverIntrus',
        config: {
          prompt: "3 couleurs sont prononcées — clique sur l'intruse.",
          items: pick(['7mer', 'zrq', 'khdar', 'sfere']),
          playedIds: ['7mer', 'zrq', 'khdar'],
        },
      },
    ],
  };

  // ── END — 4 exos couvrant les 13 couleurs, sans doublon ──
  const endContent = {
    kind: 'exercises' as const,
    setting: 'Médina de Larache',
    theme: 'Révision finale — 13 couleurs',
    exercises: [
      {
        typology: 'VoixVisuel',
        config: {
          mode: 'ligne',
          prompt: 'Les 6 couleurs secondaires & précieuses — relie chaque voix.',
          items: pick(['wardi', 'bni', 'bortoqali', 'bnafsaji', 'dhahbi', 'fddi']),
        },
      },
      {
        typology: 'VoixVisuel',
        config: {
          mode: 'drag',
          prompt: 'Les 7 couleurs essentielles — glisse (ou clique) chaque voix.',
          items: pick(['7mer', 'zrq', 'sfere', 'khdar', 'bayed', 'k7el', 'rmadi']),
        },
      },
      {
        typology: 'TrouverIntrus',
        config: {
          prompt: "Trouve l'intruse parmi 4 couleurs précieuses.",
          items: pick(['wardi', 'bnafsaji', 'dhahbi', 'fddi']),
          playedIds: ['wardi', 'bnafsaji', 'dhahbi'],
        },
      },
      {
        typology: 'TrouverIntrus',
        config: {
          prompt: "Défi final : trouve l'intruse parmi 5.",
          items: pick(['7mer', 'bni', 'bortoqali', 'wardi', 'khdar']),
          playedIds: ['7mer', 'bni', 'bortoqali', 'wardi'],
        },
      },
    ],
  };

  const middleRev = mod.revisions.find((r) => r.position === 'MIDDLE');
  const endRev = mod.revisions.find((r) => r.position === 'END');
  if (!middleRev || !endRev) {
    console.error('Révisions MIDDLE/END introuvables — lancer d\'abord splitLaracheColors --apply.');
    process.exit(1);
  }

  console.log(`\n─── Plan ───`);
  console.log(`  MIDDLE revId=${middleRev.id}`);
  console.log(`     ${middleContent.exercises.length} exos (VoixVisuel ligne/drag + TrouverIntrus)`);
  console.log(`  END    revId=${endRev.id}`);
  console.log(`     ${endContent.exercises.length} exos (VoixVisuel ligne/drag + 2× TrouverIntrus)`);

  if (!APPLY) {
    console.log(`\n✋ DRY-RUN — relance avec --apply pour écrire.`);
    await prisma.$disconnect();
    return;
  }

  await prisma.$transaction(async (tx) => {
    await tx.moduleRevision.update({
      where: { id: middleRev.id },
      data: { content: middleContent, isPublished: true },
    });
    log(`MIDDLE content mis à jour`);
    await tx.moduleRevision.update({
      where: { id: endRev.id },
      data: { content: endContent, isPublished: true },
    });
    log(`END content mis à jour`);

    // Reset les progressions existantes sur ces révisions (évite d'afficher "déjà fait" avec un vieux format)
    const del = await tx.userRevisionProgress.deleteMany({
      where: { revisionId: { in: [middleRev.id, endRev.id] } },
    });
    log(`UserRevisionProgress purgé: ${del.count} ligne(s)`);
  });

  console.log(`\n✅ Révisions peuplées.`);
  await prisma.$disconnect();
})().catch(async (err) => {
  console.error(err);
  await prisma.$disconnect();
  process.exit(1);
});
