import { PrismaClient } from '@prisma/client'

const p = new PrismaClient()

async function main() {
  const langs = await p.language.findMany()
  console.log('LANGUAGES:')
  langs.forEach(l => console.log(`  ${l.code} | ${l.name} | id=${l.id}`))

  const modules = await p.module.findMany({
    select: { slug: true, title: true, level: true, _count: { select: { lessons: true } } },
    orderBy: [{ level: 'asc' }, { createdAt: 'asc' }],
  })
  console.log('\nMODULES:')
  modules.forEach(m => console.log(`  [lvl ${m.level}] ${m.slug.padEnd(35)} (${m._count.lessons} leçons)  →  "${m.title}"`))

  // Lessons per module with order
  console.log('\nLESSONS BY MODULE:')
  for (const m of modules) {
    const lessons = await p.lesson.findMany({
      where: { module: { slug: m.slug } },
      select: { slug: true, title: true, order: true, level: true, language: { select: { code: true } } },
      orderBy: [{ order: 'asc' }],
    })
    if (lessons.length === 0) continue
    console.log(`\n[${m.slug}]`)
    lessons.forEach(l => console.log(`  ${String(l.order).padStart(3)} | lvl ${l.level} | ${l.language.code} | ${l.slug?.padEnd(40)} | ${l.title}`))
  }
}

main().catch(e => { console.error(e); process.exit(1) }).finally(() => p.$disconnect())
