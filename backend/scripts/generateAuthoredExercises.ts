/**
 * Génère des LessonExercise authored pour les 14 leçons créées par
 * seedDarijaExtension / fixDarijaExtensionVocab.
 *
 * Pattern par leçon (N = nb vocabs, typiquement 8) :
 *   - 1 FlashCard             (tous les vocabs en intro)
 *   - N ChoixLettre           (cible = chaque vocab, 3 distracteurs random)
 *   - min(4, N) EntendreEtChoisir
 *   - 1 TrouverLesPaires      (6 vocabs random)
 *   - 2 VraiFaux
 *
 * Idempotent : purge les LessonExercise existants avant de recréer.
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const MODULE_SLUGS = [
  'vocab-restaurant',
  'vocab-argent',
  'vocab-taxi',
  'vocab-hotel',
  'vocab-fetes',
  'vocab-desert',
  'vocab-telephone',
  'vocab-the',
  'vocab-hammam',
  'vocab-musique',
  'vocab-sport',
  'vocab-mer-peche',
  'vocab-souvenirs',
  'vocab-nombres', // Salé
];

function pickRandom<T>(arr: T[], n: number, exclude?: T): T[] {
  const pool = exclude ? arr.filter((x) => x !== exclude) : arr.slice();
  const out: T[] = [];
  while (out.length < n && pool.length > 0) {
    const i = Math.floor(Math.random() * pool.length);
    out.push(pool.splice(i, 1)[0]);
  }
  return out;
}

async function main() {
  console.log('🎯 Génération des LessonExercise authored\n');

  let totalCreated = 0;

  for (const slug of MODULE_SLUGS) {
    const mod = await prisma.module.findUnique({
      where: { slug },
      include: { lessons: true },
    });
    if (!mod) {
      console.warn(`   ⚠ module ${slug} introuvable`);
      continue;
    }
    for (const lesson of mod.lessons) {
      // Récupérer les vocabs attachés à cette leçon via Exercise join
      const joints = await prisma.exercise.findMany({
        where: { lessonId: lesson.id, vocabularyId: { not: null } },
        include: { vocabulary: true },
      });
      const vocabIds = joints
        .map((e) => e.vocabularyId!)
        .filter(Boolean);

      if (vocabIds.length < 3) {
        console.warn(`   ⚠ ${lesson.slug}: seulement ${vocabIds.length} vocab, skip`);
        continue;
      }

      // Purge puis recrée
      await prisma.lessonExercise.deleteMany({ where: { lessonId: lesson.id } });

      let order = 0;
      const creates: any[] = [];

      // 1) FlashCard intro — tous les vocabs
      creates.push({
        lessonId: lesson.id,
        order: order++,
        typology: 'FlashCard',
        config: { vocabIds },
        isPublished: true,
      });

      // 2) ChoixLettre — 1 par vocab
      for (const target of vocabIds) {
        const distractors = pickRandom(vocabIds, 3, target);
        creates.push({
          lessonId: lesson.id,
          order: order++,
          typology: 'ChoixLettre',
          config: {
            prompt: 'Quelle est la signification de ce mot en français ?',
            targetVocabId: target,
            distractorVocabIds: distractors,
          },
          isPublished: true,
        });
      }

      // 3) EntendreEtChoisir — min(4, N)
      const listeningTargets = pickRandom(vocabIds, Math.min(4, vocabIds.length));
      for (const target of listeningTargets) {
        const distractors = pickRandom(vocabIds, 3, target);
        creates.push({
          lessonId: lesson.id,
          order: order++,
          typology: 'EntendreEtChoisir',
          config: {
            targetVocabId: target,
            distractorVocabIds: distractors,
          },
          isPublished: true,
        });
      }

      // 4) TrouverLesPaires — 6 vocabs
      const pairSample = pickRandom(vocabIds, Math.min(6, vocabIds.length));
      creates.push({
        lessonId: lesson.id,
        order: order++,
        typology: 'TrouverLesPaires',
        config: { vocabIds: pairSample },
        isPublished: true,
      });

      // 5) VraiFaux × 2
      const vfTargets = pickRandom(vocabIds, 2);
      for (const target of vfTargets) {
        // 50% vrai, 50% faux (proposed = autre vocab aléatoire)
        const isTrue = Math.random() < 0.5;
        const proposed = isTrue ? target : (pickRandom(vocabIds, 1, target)[0] ?? target);
        const proposedVocab = joints.find((j) => j.vocabularyId === proposed)?.vocabulary;
        creates.push({
          lessonId: lesson.id,
          order: order++,
          typology: 'VraiFaux',
          config: {
            isTrue,
            targetVocabId: target,
            proposedVocabId: proposed,
            proposedRomanisation: proposedVocab?.transliteration ?? '',
          },
          isPublished: true,
        });
      }

      await prisma.lessonExercise.createMany({ data: creates });
      totalCreated += creates.length;
      console.log(`   ✓ ${lesson.slug?.padEnd(32)} → ${creates.length} exos`);
    }
  }

  console.log(`\n✅ Terminé : ${totalCreated} LessonExercise créés`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
