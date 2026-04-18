import { PrismaClient } from '@prisma/client';
const p = new PrismaClient();
(async () => {
  const mods = await p.module.findMany({
    where: { track: 'MSA' },
    orderBy: { canonicalOrder: 'asc' },
    include: {
      lessons: { select: { _count: { select: { exercises: true } } } },
    },
  });
  for (const m of mods) {
    const exoTotal = m.lessons.reduce((s, l) => s + l._count.exercises, 0);
    console.log(`  MSA@${String(m.canonicalOrder).padStart(2)}  ${m.slug.padEnd(34)}  ${m.lessons.length} leçons / ${exoTotal} exos  [pub=${m.isPublished}]`);
  }
  await p.$disconnect();
})();
