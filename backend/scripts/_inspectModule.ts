/**
 * Affiche tout le contenu d'un module (leçons + exos).
 * Usage: npx tsx scripts/_inspectModule.ts <slug>
 */
import { PrismaClient } from '@prisma/client';
const p = new PrismaClient();
(async () => {
  const slug = process.argv[2];
  if (!slug) { console.error('Usage: _inspectModule.ts <slug>'); process.exit(1); }
  const m = await p.module.findUnique({
    where: { slug },
    include: {
      lessons: {
        include: { exercises: { orderBy: { createdAt: 'asc' } } },
        orderBy: { order: 'asc' },
      },
    },
  });
  if (!m) { console.error('Module introuvable'); process.exit(1); }
  console.log(`\n━━━ ${m.slug} — "${m.title}" (${m.track}@${m.canonicalOrder}) ━━━`);
  console.log(`  "${m.subtitle}"  —  ${m.description}`);
  for (const l of m.lessons) {
    console.log(`\n  [${l.order}] ${l.slug} — "${l.title}" (${l.exercises.length} exos)`);
    for (const e of l.exercises) {
      const data: any = e.data;
      const ans: any = e.answer;
      console.log(`     • ${e.type}  "${e.prompt}"`);
      console.log(`       data=${JSON.stringify(data).slice(0, 180)}`);
      console.log(`       ans=${JSON.stringify(ans).slice(0, 100)}`);
    }
  }
  await p.$disconnect();
})();
