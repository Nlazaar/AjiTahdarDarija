import { PrismaClient } from '@prisma/client';
const p = new PrismaClient();
(async () => {
  const m = await p.module.findUnique({ where: { id: 'cmn462f420018bax9ckvo8bdm' }, include: { _count: { select: { lessons: true } } } });
  console.log('Module:', m);
  // Tous les modules Darija avec "salutation" dans le nom ou slug
  const all = await p.module.findMany({ where: { OR: [{ slug: { contains: 'salutation' } }, { title: { contains: 'alutation' } }] }, select: { id: true, slug: true, title: true, track: true, canonicalOrder: true } });
  console.log('\nTous les modules "salutation*" :');
  for (const x of all) console.log(`  ${x.track}@${x.canonicalOrder}  ${x.slug}  —  "${x.title}"  (id=${x.id})`);
  await p.$disconnect();
})();
