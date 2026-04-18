/**
 * Supprime les modules phantoms (non publiés, doublons de modules réels).
 * Usage: npx tsx scripts/_cleanupPhantomModules.ts
 */
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const PHANTOM_SLUGS = [
  'module-alphabet',
  'module-nourriture',
  'module-corps',
  'module-jours-mois',
  'module-marche',
  'module-transports',
  'module-metiers',
];

(async () => {
  for (const slug of PHANTOM_SLUGS) {
    const m = await prisma.module.findUnique({
      where: { slug },
      include: { _count: { select: { lessons: true } } },
    });
    if (!m) {
      console.log(`⚠️  ${slug} — déjà absent`);
      continue;
    }
    if (m.isPublished) {
      console.log(`🚫 ${slug} — PUBLIÉ, on ne touche pas (id=${m.id})`);
      continue;
    }
    const lessons = await prisma.lesson.findMany({ where: { moduleId: m.id }, select: { id: true } });
    let exoCount = 0;
    for (const l of lessons) {
      const c = await prisma.exercise.deleteMany({ where: { lessonId: l.id } });
      exoCount += c.count;
    }
    await prisma.lesson.deleteMany({ where: { moduleId: m.id } });
    await prisma.module.delete({ where: { id: m.id } });
    console.log(`✓ ${slug} supprimé — ${lessons.length} leçons, ${exoCount} exos`);
  }
  await prisma.$disconnect();
})();
