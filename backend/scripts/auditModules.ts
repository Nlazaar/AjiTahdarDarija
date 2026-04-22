import { PrismaClient } from '@prisma/client';
const p = new PrismaClient();
(async () => {
  const mods = await p.module.findMany({
    orderBy: [{ track: 'asc' }, { canonicalOrder: 'asc' }],
    select: {
      track: true,
      canonicalOrder: true,
      level: true,
      slug: true,
      cityName: true,
      title: true,
      subtitle: true,
      isPublished: true,
      _count: { select: { lessons: true } },
    },
  });
  console.log(JSON.stringify(mods, null, 2));
  await p.$disconnect();
})();
