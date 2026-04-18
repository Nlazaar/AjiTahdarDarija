import { PrismaClient } from '@prisma/client';
const p = new PrismaClient();
(async () => {
  const mods = await p.module.findMany({
    where: { track: 'DARIJA', isPublished: true },
    orderBy: { canonicalOrder: 'asc' },
    include: {
      lessons: { select: { _count: { select: { exercises: true } } } },
    },
  });
  for (const m of mods) {
    const exoTotal = m.lessons.reduce((s, l) => s + l._count.exercises, 0);
    console.log(`  DARIJA@${String(m.canonicalOrder).padStart(2)}  ${m.slug.padEnd(32)}  ${m.lessons.length} leçons / ${exoTotal} exos`);
  }
  await p.$disconnect();
})();
