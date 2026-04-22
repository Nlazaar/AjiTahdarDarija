import { PrismaClient } from '@prisma/client';
const p = new PrismaClient();
(async () => {
  const typs = await p.lessonExercise.groupBy({ by: ['typology'], _count: { _all: true } });
  console.log('Typologies utilisées:', typs);
  // Un exemple par typology
  for (const t of typs) {
    const s = await p.lessonExercise.findFirst({ where: { typology: t.typology } });
    console.log(`\n[${t.typology}]`, JSON.stringify(s?.config, null, 2));
  }
  await p.$disconnect();
})();
