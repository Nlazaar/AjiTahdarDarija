import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const NOMBRES = [
  { darija: "صِفْر",          latin: "sifr",     fr: "zéro" },
  { darija: "وَاحَد",         latin: "wa7ed",    fr: "un" },
  { darija: "جُوج",           latin: "jouj",     fr: "deux" },
  { darija: "تْلَاتَة",       latin: "tlata",    fr: "trois" },
  { darija: "رْبْعَة",        latin: "rb3a",     fr: "quatre" },
  { darija: "خْمْسَة",        latin: "khmsa",    fr: "cinq" },
  { darija: "سِتَّة",         latin: "setta",    fr: "six" },
  { darija: "سْبْعَة",        latin: "sb3a",     fr: "sept" },
  { darija: "تْمَانْيَة",     latin: "tmnya",    fr: "huit" },
  { darija: "تْسْعُود",       latin: "ts3oud",   fr: "neuf" },
  { darija: "عْشْرَة",        latin: "3achra",   fr: "dix" },
  { darija: "حْدَاش",         latin: "7dach",    fr: "onze" },
  { darija: "تْنَاش",         latin: "tnach",    fr: "douze" },
  { darija: "تْلْطَاش",       latin: "tltach",   fr: "treize" },
  { darija: "رْبْعْتَاش",     latin: "rb3tach",  fr: "quatorze" },
  { darija: "خْمْسْتَاش",     latin: "khmstach", fr: "quinze" },
  { darija: "سْتَاش",         latin: "stach",    fr: "seize" },
  { darija: "سْبْعْتَاش",     latin: "sb3tach",  fr: "dix-sept" },
  { darija: "تْمَانْتَاش",    latin: "tmntach",  fr: "dix-huit" },
  { darija: "تْسْعْتَاش",     latin: "ts3tach",  fr: "dix-neuf" },
  { darija: "عْشْرِين",       latin: "3chrin",   fr: "vingt" },
]

async function main() {
  const mod = await prisma.module.findFirst({ where: { slug: 'tanger-salutations' } })
  if (!mod) throw new Error("Module 'tanger-salutations' introuvable")

  const lang = await prisma.language.findFirst({ where: { code: 'ar-MA' } })
  if (!lang) throw new Error("Langue 'ar-MA' introuvable")

  const lessonSlug = 'tanger-salutations-nombres-0-20'
  let lesson = await prisma.lesson.findUnique({ where: { slug: lessonSlug } })

  const maxOrder = await prisma.lesson.aggregate({
    where: { moduleId: mod.id },
    _max: { order: true },
  })

  if (lesson) {
    lesson = await prisma.lesson.update({
      where: { id: lesson.id },
      data: { title: 'Les nombres 0-20', isPublished: true },
    })
    console.log(`↻ Leçon existante mise à jour : ${lesson.title} (${lesson.id})`)
  } else {
    lesson = await prisma.lesson.create({
      data: {
        title: 'Les nombres 0-20',
        slug: lessonSlug,
        subtitle: 'Compter de zéro à vingt',
        description: '21 nombres essentiels en Darija',
        order: (maxOrder._max.order ?? 0) + 1,
        level: 1,
        moduleId: mod.id,
        languageId: lang.id,
        isPublished: true,
      },
    })
    console.log(`✓ Leçon créée : ${lesson.title} (${lesson.id})`)
  }

  let vocabCreated = 0
  let vocabUpdated = 0
  let linksCreated = 0

  for (const n of NOMBRES) {
    const existing = await prisma.vocabulary.findFirst({
      where: { languageId: lang.id, word: n.darija },
    })

    const vocab = existing
      ? await prisma.vocabulary.update({
          where: { id: existing.id },
          data: {
            transliteration: n.latin,
            translation: { fr: n.fr } as any,
            tags: Array.from(new Set([...(existing.tags ?? []), 'nombre', 'tanger'])),
          },
        })
      : await prisma.vocabulary.create({
          data: {
            word: n.darija,
            transliteration: n.latin,
            translation: { fr: n.fr } as any,
            tags: ['nombre', 'tanger'],
            languageId: lang.id,
          },
        })
    if (existing) vocabUpdated++
    else vocabCreated++

    const link = await prisma.exercise.findFirst({
      where: { lessonId: lesson.id, vocabularyId: vocab.id },
      select: { id: true },
    })
    if (!link) {
      await prisma.exercise.create({
        data: {
          type: 'MULTIPLE_CHOICE',
          lessonId: lesson.id,
          vocabularyId: vocab.id,
          data: {} as any,
          answer: {} as any,
        },
      })
      linksCreated++
    }
  }

  console.log(`\n  Vocab créés : ${vocabCreated}`)
  console.log(`  Vocab mis à jour : ${vocabUpdated}`)
  console.log(`  Liaisons créées : ${linksCreated}`)
  console.log(`\n✅ Leçon "Les nombres 0-20" prête dans "${mod.title}"`)
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(async () => { await prisma.$disconnect() })
