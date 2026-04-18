import { PrismaClient } from '@prisma/client';
const p = new PrismaClient();
(async () => {
  const m = await p.module.findUnique({ where: { slug: 'msa-module-salutations' } });
  console.log({ colorA: m?.colorA, colorB: m?.colorB, shadowColor: m?.shadowColor, title: m?.title, subtitle: m?.subtitle });
  await p.$disconnect();
})();
