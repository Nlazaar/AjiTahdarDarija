import { PrismaClient } from '@prisma/client';
const p = new PrismaClient();
(async () => {
  const ids = ['cmn5ku66p0051ir2r4753ni6e', 'cmn462f420018bax9ckvo8bdm'];
  for (const id of ids) {
    const m = await p.module.findUnique({
      where: { id },
      include: {
        lessons: {
          select: {
            id: true, slug: true, title: true, order: true, isPublished: true,
            _count: { select: { exercises: true, userProgress: true } },
          },
          orderBy: { order: 'asc' },
        },
      },
    });
    console.log(`\n━━━ ${m?.slug} (id=${id}) ━━━`);
    console.log(`  track=${m?.track} canonicalOrder=${m?.canonicalOrder} isPublished=${m?.isPublished}`);
    console.log(`  ${m?.lessons.length ?? 0} leçons :`);
    for (const l of m?.lessons ?? []) {
      console.log(`    [${l.order}] ${l.slug.padEnd(35)} "${l.title}"  exos=${l._count.exercises} progress=${l._count.userProgress}`);
    }
  }

  // Combien d'utilisateurs ont eu une progression sur chaque module ?
  for (const id of ids) {
    const lessonIds = await p.lesson.findMany({ where: { moduleId: id }, select: { id: true } });
    const progCount = await p.userProgress.count({ where: { lessonId: { in: lessonIds.map(l => l.id) } } });
    console.log(`\nModule ${id} → ${progCount} entries dans UserProgress`);
  }

  await p.$disconnect();
})();
