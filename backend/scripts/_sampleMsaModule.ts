import { PrismaClient } from '@prisma/client';
const p = new PrismaClient();
(async () => {
  const slug = process.argv[2] || 'msa-module-salutations';
  const m = await p.module.findUnique({
    where: { slug },
    include: {
      lessons: {
        orderBy: { order: 'asc' },
        include: { exercises: true },
      },
    },
  });
  if (!m) { console.log('not found'); return; }
  console.log(`=== ${m.title} (${m.slug}) ===`);
  for (const l of m.lessons) {
    console.log(`\n[Leçon ${l.order}] ${l.title} — ${l.exercises.length} exos`);
    const byType: Record<string, number> = {};
    for (const e of l.exercises) byType[e.type] = (byType[e.type] || 0) + 1;
    console.log('  types:', byType);
    for (const e of l.exercises.slice(0, 3)) {
      const q = (e.prompt || '').slice(0, 80);
      console.log(`  • [${e.type}] ${q}`);
    }
  }
  await p.$disconnect();
})();
