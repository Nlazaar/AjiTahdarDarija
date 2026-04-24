/**
 * Éclate le module Larache (Vocabulaire — Couleurs) en 4 leçons thématiques
 * + 2 révisions (MIDDLE, END).
 *
 * Par défaut: DRY-RUN — affiche le plan sans rien modifier.
 * Pour appliquer réellement: `npx tsx scripts/splitLaracheColors.ts --apply`
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const MODULE_SLUG = 'vocab-couleurs';
const APPLY = process.argv.includes('--apply');

// Groupement par transliteration (clé stable côté Vocabulary)
const GROUPS: Array<{
  slug: string;
  title: string;
  translits: string[];
}> = [
  {
    slug: 'vocab-couleurs-primaires',
    title: 'Couleurs primaires',
    translits: ['7mer', 'zrq', 'sifr', 'khodr'],
  },
  {
    slug: 'vocab-couleurs-neutres',
    title: 'Couleurs neutres',
    translits: ['biD', 'k7el', 'rmadi'],
  },
  {
    slug: 'vocab-couleurs-secondaires',
    title: 'Couleurs secondaires',
    translits: ['wardi', 'bni', 'bortoqali'],
  },
  {
    slug: 'vocab-couleurs-precieuses',
    title: 'Couleurs précieuses',
    translits: ['bnafsaji', 'dhahbi', 'fddi'],
  },
];

function log(msg: string) {
  console.log(`${APPLY ? '[APPLY] ' : '[DRY]   '}${msg}`);
}

(async () => {
  const mod = await prisma.module.findUnique({
    where: { slug: MODULE_SLUG },
    include: {
      lessons: {
        include: {
          exercises: { include: { vocabulary: true }, orderBy: { createdAt: 'asc' } },
        },
        orderBy: { order: 'asc' },
      },
      revisions: true,
    },
  });

  if (!mod) { console.error(`Module "${MODULE_SLUG}" introuvable.`); process.exit(1); }
  if (mod.lessons.length !== 1) {
    console.error(`Attendu 1 leçon, trouvé ${mod.lessons.length}. Abort.`);
    process.exit(1);
  }

  const original = mod.lessons[0]!;
  const exs = original.exercises;
  console.log(`\n━━━ Module: ${mod.title} (${mod.slug}) id=${mod.id}`);
  console.log(`  Leçon existante: "${original.title}" (${exs.length} exercices)`);
  console.log(`  Language: ${original.languageId}`);
  console.log(`  Révisions existantes: ${mod.revisions.length}\n`);

  // Indexer les exercices par transliteration
  const byTranslit = new Map<string, typeof exs[number]>();
  for (const e of exs) {
    const t = e.vocabulary?.transliteration;
    if (!t) continue;
    byTranslit.set(t, e);
  }

  // Vérifier que tous les translits cibles existent
  const missing: string[] = [];
  for (const g of GROUPS) {
    for (const t of g.translits) {
      if (!byTranslit.has(t)) missing.push(`${g.title} → ${t}`);
    }
  }
  if (missing.length) {
    console.error('Translits introuvables:');
    missing.forEach((m) => console.error('  -', m));
    process.exit(1);
  }

  // Exos non mappés (restants)
  const mappedTranslits = new Set(GROUPS.flatMap((g) => g.translits));
  const orphans = exs.filter((e) => !e.vocabulary || !mappedTranslits.has(e.vocabulary.transliteration!));
  if (orphans.length) {
    console.warn(`⚠️  ${orphans.length} exercice(s) non mappé(s):`);
    orphans.forEach((e) => console.warn(`  - exId=${e.id} vocab=${e.vocabulary?.transliteration ?? '(nul)'}`));
  }

  // Plan: une leçon par groupe.
  // Leçon 0 (primaires) réutilise l'ID `original` (renommage).
  // Leçons 1..3: nouvelles.
  console.log(`\n─── Plan ───`);
  for (let i = 0; i < GROUPS.length; i++) {
    const g = GROUPS[i]!;
    const exsInGroup = g.translits.map((t) => byTranslit.get(t)!);
    const role = i === 0 ? 'UPDATE (réutilise leçon existante)' : 'CREATE nouvelle leçon';
    console.log(`  [${i}] ${g.title} (${g.slug}) — ${role}, ${exsInGroup.length} exos`);
    exsInGroup.forEach((e) => console.log(`        • ${e.vocabulary!.transliteration}  (${e.id.slice(0, 8)}…)`));
  }
  console.log(`  [R] Révisions: MIDDLE@anchor=2, END@anchor=4`);
  console.log(`  [U] Reset UserProgress du module (lessonIds affectés)`);

  if (!APPLY) {
    console.log(`\n✋ DRY-RUN — relance avec --apply pour exécuter.`);
    await prisma.$disconnect();
    return;
  }

  // ── APPLY ────────────────────────────────────────────────────────────────
  console.log(`\n⚙️  Application…\n`);

  await prisma.$transaction(async (tx) => {
    // 1) Update leçon originale → primaires
    const primaryGroup = GROUPS[0]!;
    await tx.lesson.update({
      where: { id: original.id },
      data: {
        title: primaryGroup.title,
        slug: primaryGroup.slug,
        order: 0,
        content: {}, // reset content (sequence était calibré pour 13 items)
      },
    });
    log(`Leçon [0] ${primaryGroup.title} — id=${original.id} renommée`);

    // 2) Créer les 3 nouvelles leçons
    const createdIds: Record<number, string> = { 0: original.id };
    for (let i = 1; i < GROUPS.length; i++) {
      const g = GROUPS[i]!;
      const created = await tx.lesson.create({
        data: {
          title: g.title,
          slug: g.slug,
          order: i,
          level: original.level,
          moduleId: mod.id,
          languageId: original.languageId,
          isPublished: original.isPublished,
        },
      });
      createdIds[i] = created.id;
      log(`Leçon [${i}] ${g.title} — id=${created.id} créée`);
    }

    // 3) Réaffecter les exercices (sauf primaires qui restent)
    for (let i = 1; i < GROUPS.length; i++) {
      const g = GROUPS[i]!;
      const targetLessonId = createdIds[i]!;
      for (const t of g.translits) {
        const ex = byTranslit.get(t)!;
        await tx.exercise.update({ where: { id: ex.id }, data: { lessonId: targetLessonId } });
      }
      log(`  → ${g.translits.length} exos déplacés vers [${i}]`);
    }

    // 4) Revisions — MIDDLE après leçon 2 (index 1), END après leçon 4 (index 3)
    // anchorAfterOrder est 0-indexed sur l'ordre des leçons (nb de leçons précédentes).
    await tx.moduleRevision.upsert({
      where: { moduleId_position: { moduleId: mod.id, position: 'MIDDLE' } },
      create: {
        moduleId: mod.id,
        position: 'MIDDLE',
        title: 'Pause — Couleurs essentielles',
        anchorAfterOrder: 2,
        content: {},
        isPublished: true,
      },
      update: { anchorAfterOrder: 2, isPublished: true },
    });
    log(`Révision MIDDLE (anchor=2) upsertée`);

    await tx.moduleRevision.upsert({
      where: { moduleId_position: { moduleId: mod.id, position: 'END' } },
      create: {
        moduleId: mod.id,
        position: 'END',
        title: 'Révision finale — Couleurs',
        anchorAfterOrder: 4,
        content: {},
        isPublished: true,
      },
      update: { anchorAfterOrder: 4, isPublished: true },
    });
    log(`Révision END (anchor=4) upsertée`);

    // 5) Reset UserProgress pour les leçons affectées + UserRevisionProgress
    const lessonIds = Object.values(createdIds);
    const delProgress = await tx.userProgress.deleteMany({ where: { lessonId: { in: lessonIds } } });
    log(`UserProgress supprimé: ${delProgress.count} ligne(s)`);

    const revs = await tx.moduleRevision.findMany({ where: { moduleId: mod.id }, select: { id: true } });
    if (revs.length) {
      const delRev = await tx.userRevisionProgress.deleteMany({
        where: { revisionId: { in: revs.map((r) => r.id) } },
      });
      log(`UserRevisionProgress supprimé: ${delRev.count} ligne(s)`);
    }
  });

  console.log(`\n✅ Split terminé.`);
  await prisma.$disconnect();
})().catch(async (err) => {
  console.error(err);
  await prisma.$disconnect();
  process.exit(1);
});
