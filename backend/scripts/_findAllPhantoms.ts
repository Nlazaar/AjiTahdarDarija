/**
 * Trouve tous les modules non publiés (potentiels phantoms) dans toutes les tracks.
 * Usage: npx tsx scripts/_findAllPhantoms.ts
 */
import { PrismaClient } from '@prisma/client';
const p = new PrismaClient();
(async () => {
  const unpub = await p.module.findMany({
    where: { isPublished: false },
    orderBy: [{ track: 'asc' }, { canonicalOrder: 'asc' }],
    include: { _count: { select: { lessons: true } } },
  });
  console.log(`\n${unpub.length} modules non publiés :\n`);
  for (const m of unpub) {
    // Y a-t-il un module publié avec même track + canonicalOrder ?
    const twin = await p.module.findFirst({
      where: { track: m.track, canonicalOrder: m.canonicalOrder, isPublished: true, id: { not: m.id } },
      select: { slug: true, id: true },
    });
    const twinStr = twin ? ` ↔ publié: ${twin.slug}` : ' (pas de twin publié)';
    console.log(`  ${m.track}@${m.canonicalOrder}  ${m.slug.padEnd(35)}  ${m._count.lessons} leçons${twinStr}`);
  }
  await p.$disconnect();
})();
