/**
 * Migration one-off : pour chaque Lesson qui a des vocabs attachés (via
 * Exercise.vocabularyId) mais AUCUN LessonExercise publié, crée un FlashCard
 * authored auto-généré (config.auto = true) contenant tous les vocabIds.
 *
 * Idempotent : si un LessonExercise existe déjà pour la leçon, on ne touche pas.
 * Complémentaire à la logique live dans vocabulary.service.ts (attach/detach).
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🏗️  Backfill des FlashCards auto sur cours sans exos authored\n');

  const lessons = await prisma.lesson.findMany({
    where: { isDeleted: false },
    select: { id: true, slug: true, title: true },
  });

  let created = 0;
  let skippedHasExos = 0;
  let skippedNoVocab = 0;

  for (const lesson of lessons) {
    const exoCount = await prisma.lessonExercise.count({
      where: { lessonId: lesson.id },
    });
    if (exoCount > 0) {
      skippedHasExos++;
      continue;
    }

    const joints = await prisma.exercise.findMany({
      where: { lessonId: lesson.id, vocabularyId: { not: null } },
      select: { vocabularyId: true },
      distinct: ['vocabularyId'],
    });
    const vocabIds = joints
      .map((e) => e.vocabularyId)
      .filter((v): v is string => !!v);

    if (vocabIds.length === 0) {
      skippedNoVocab++;
      continue;
    }

    await prisma.lessonExercise.create({
      data: {
        lessonId: lesson.id,
        order: 0,
        typology: 'FlashCard',
        config: { vocabIds, auto: true },
        isPublished: true,
      },
    });
    console.log(`   ✓ ${lesson.slug ?? lesson.id} (${vocabIds.length} vocabs)`);
    created++;
  }

  console.log('\n📊 Résumé :');
  console.log(`   FlashCard créés : ${created}`);
  console.log(`   Cours déjà équipés : ${skippedHasExos}`);
  console.log(`   Cours sans vocab : ${skippedNoVocab}`);
  console.log(`   Total cours scannés : ${lessons.length}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
