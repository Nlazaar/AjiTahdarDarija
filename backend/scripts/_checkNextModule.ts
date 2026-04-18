import { PrismaClient } from '@prisma/client';
const p = new PrismaClient();
(async () => {
  const mods = await p.module.findMany({
    where: { track: 'DARIJA', canonicalOrder: { in: [2, 3, 4, 5] } },
    orderBy: { canonicalOrder: 'asc' },
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
  for (const m of mods) {
    console.log(`\n━━━ DARIJA@${m.canonicalOrder} ${m.slug} — "${m.title}" (id=${m.id}) ━━━`);
    console.log(`  published=${m.isPublished}  subtitle="${m.subtitle ?? ''}"`);
    console.log(`  description: ${m.description ?? '(aucune)'}`);
    console.log(`  ${m.lessons.length} leçons :`);
    for (const l of m.lessons) {
      console.log(`    [${l.order}] ${l.slug.padEnd(40)} "${l.title}"  exos=${l._count.exercises} progress=${l._count.userProgress} pub=${l.isPublished}`);
    }
  }
  await p.$disconnect();
})();
