const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding demo module and lessons...');

  const language = await prisma.language.upsert({
    where: { code: 'ar-MA' },
    update: {},
    create: { code: 'ar-MA', name: 'Darija (ar-MA)' },
  });

  const module = await prisma.module.upsert({
    where: { slug: 'seed-escale-tanger' },
    update: { title: 'ESCALE À TANGER (seed)' },
    create: {
      title: 'ESCALE À TANGER (seed)',
      description: 'Module seed for local development',
      slug: 'seed-escale-tanger',
      level: 1,
    },
  });

  const lessonsData = [
    { id: 'seed-l1', title: 'Bases (seed)', subtitle: 'Les salutations', order: 1 },
    { id: 'seed-l2', title: 'Politesse (seed)', subtitle: 'Formules', order: 2 },
    { id: 'seed-l3', title: 'Verbes (seed)', subtitle: 'Verbes courants', order: 3 },
  ];

  for (const l of lessonsData) {
    // try to create lesson if not exists
    const exists = await prisma.lesson.findFirst({ where: { title: l.title, moduleId: module.id } });
    if (!exists) {
      await prisma.lesson.create({ data: {
        title: l.title,
        subtitle: l.subtitle,
        description: null,
        content: null,
        order: l.order,
        level: 1,
        moduleId: module.id,
        languageId: language.id,
        isPublished: true,
      }});
    }
  }

  console.log('Seed complete.');
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
