/**
 * Crée le module "Alphabet arabe" du track MSA (canonicalOrder = 0) et ses
 * 6 leçons groupées par famille phonétique. La ville associée est Fès,
 * berceau de l'université al-Qarawiyyin (859) — la plus ancienne du monde
 * encore en activité.
 *
 * Les exercices sont générés au runtime par le player de leçons à partir
 * de `web/data/letterGroups.ts` (clés `msa-alphabet-1..6`). On ne crée donc
 * que Module + 6 Lesson ici, sans LessonExercise ni Exercise.
 *
 * Idempotent : relancer le script met à jour les entrées existantes.
 *
 * Usage: npx tsx scripts/seedMsaAlphabet.ts
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const MODULE_SLUG = 'msa-alphabet';
const LANG_CODE   = 'ar-SA';

const MODULE_META = {
  slug: MODULE_SLUG,
  title: "Fès — L'alphabet arabe",
  titleAr: 'فاس',
  subtitle: 'Les 28 lettres par familles phonétiques',
  description:
    "Avant tout vocabulaire, apprends à reconnaître, prononcer et tracer chaque lettre. " +
    "Les leçons sont regroupées par familles de sons pour que l'oreille distingue les nuances.",
  level: 1,
  track: 'MSA' as const,
  canonicalOrder: 0,
  colorA: '#2a9d8f',
  colorB: '#1e7a6d',
  shadowColor: '#155e54',
  cityName: 'Fès',
  cityNameAr: 'فاس',
  emoji: '📖',
  photoCaption: "Capitale spirituelle et berceau d'al-Qarawiyyin (859)",
  isPublished: true,
};

const CITY_INFO = {
  cityKey: 'fes',
  emoji: '📖',
  history:
    "Fondée en 789 par Idriss Ier, Fès abrite depuis 859 l'université al-Qarawiyyin, " +
    "la plus ancienne encore en activité selon l'UNESCO. Médina classée au patrimoine mondial.",
  photoUrl: '/uploads/cities/fes.webp',
  typicalWord: { ar: 'حَرْف', fr: 'lettre', latin: 'ḥarf' },
  food: 'Pastilla au pigeon et msemen du matin',
  music: "Musique andalouse et nouba classique",
  toSee: "Al-Qarawiyyin, tanneries Chouara, Bab Boujloud",
  culturalFact: "Capitale spirituelle et intellectuelle historique du Maroc.",
};

type LessonSpec = {
  slug: string;
  order: number;
  title: string;
  subtitle: string;
};

const LESSONS: LessonSpec[] = [
  { slug: 'msa-alphabet-1', order: 1, title: 'Voyelles & hamza',            subtitle: 'ا · و · ي · ء' },
  { slug: 'msa-alphabet-2', order: 2, title: 'Labiales & dentales',         subtitle: 'ب · م · ف · ت · ث · د · ذ' },
  { slug: 'msa-alphabet-3', order: 3, title: 'Sifflantes & chuintantes',    subtitle: 'س · ش · ص · ز' },
  { slug: 'msa-alphabet-4', order: 4, title: 'Emphatiques',                  subtitle: 'ط · ظ · ض' },
  { slug: 'msa-alphabet-5', order: 5, title: 'Gutturales & vélaires',        subtitle: 'ح · ع · خ · غ · ك · ق · ج' },
  { slug: 'msa-alphabet-6', order: 6, title: 'Liquides, nasales & finales',  subtitle: 'ل · ر · ن · ه · ـة' },
];

async function main() {
  console.log('🔤 Seed MSA — module alphabet\n');

  const lang = await prisma.language.findUnique({ where: { code: LANG_CODE } });
  if (!lang) {
    console.error(`❌ Langue ${LANG_CODE} introuvable. Crée-la d'abord.`);
    process.exit(1);
  }

  // ─── Module ─────────────────────────────────────────────────────────────
  const existing = await prisma.module.findUnique({ where: { slug: MODULE_SLUG } });
  const moduleData = { ...MODULE_META, cityInfo: CITY_INFO };

  const mod = existing
    ? await prisma.module.update({ where: { id: existing.id }, data: moduleData })
    : await prisma.module.create({ data: moduleData });
  console.log(`   ${existing ? '↻' : '+'} Module  ${mod.slug}  (id=${mod.id}, track=${mod.track}, order=${mod.canonicalOrder})`);

  // ─── 6 Lessons ──────────────────────────────────────────────────────────
  for (const spec of LESSONS) {
    const existingLesson = await prisma.lesson.findUnique({ where: { slug: spec.slug } });
    const lessonData = {
      moduleId: mod.id,
      languageId: lang.id,
      slug: spec.slug,
      title: spec.title,
      subtitle: spec.subtitle,
      order: spec.order,
      level: 1,
      isPublished: true,
      isDeleted: false,
    };

    if (existingLesson) {
      await prisma.lesson.update({ where: { id: existingLesson.id }, data: lessonData });
      console.log(`   ↻ Lesson  ${spec.slug}  [${spec.order}] ${spec.title}`);
    } else {
      await prisma.lesson.create({ data: lessonData });
      console.log(`   + Lesson  ${spec.slug}  [${spec.order}] ${spec.title}`);
    }
  }

  console.log(`\n✅ Module alphabet MSA + ${LESSONS.length} leçons prêts.`);
  console.log('   (Les exercices sont générés côté front depuis web/data/letterGroups.ts)\n');

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error('❌ Erreur :', e);
  prisma.$disconnect().finally(() => process.exit(1));
});
