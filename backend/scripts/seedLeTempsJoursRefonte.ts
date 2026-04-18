/**
 * Refonte du module "Le Temps et les Jours" (DARIJA@17, slug=le-temps-les-jours).
 * 3 thèmes × 7 exos mixtes = 21 exos.
 *
 * Usage: npx tsx scripts/seedLeTempsJoursRefonte.ts
 */
import { PrismaClient, ExerciseType } from '@prisma/client';

const prisma = new PrismaClient();

const COLORS = { colorA: '#9575cd', colorB: '#673ab7', shadowColor: '#512da8' };

type Theme = {
  order: number;
  slug: string;
  title: string;
  subtitle: string;
  exos: Array<{
    type: ExerciseType;
    prompt: string;
    data: any;
    answer: any;
    points: number;
  }>;
};

const THEMES: Theme[] = [
  // ─────────────────────────── LEÇON 1 — Les jours de la semaine ───────────────────────────
  {
    order: 1,
    slug: 'le-temps-les-jours-lecon-1',
    title: 'Les jours de la semaine',
    subtitle: 'Du dimanche au samedi',
    exos: [
      {
        type: ExerciseType.MULTIPLE_CHOICE,
        prompt: 'Le premier jour de la semaine en arabe/darija est :',
        data: {
          options: [
            { id: 'a', text: 'الاثنين (lundi)' },
            { id: 'b', text: 'الأحد (dimanche)' },
            { id: 'c', text: 'السبت (samedi)' },
            { id: 'd', text: 'الجمعة (vendredi)' },
          ],
        },
        answer: { id: 'b' },
        points: 10,
      },
      {
        type: ExerciseType.LISTENING,
        prompt: 'Quel jour entends-tu ?',
        data: {
          text: 'الجمعة',
          lang: 'ar-MA',
          audio: 'الجمعة',
          options: [
            { id: 'a', text: 'الاثنين', transliteration: 'l-tnin (lundi)' },
            { id: 'b', text: 'الخميس', transliteration: 'l-khmis (jeudi)' },
            { id: 'c', text: 'الجمعة', transliteration: 'j-jemaa (vendredi)' },
            { id: 'd', text: 'السبت', transliteration: 's-sebt (samedi)' },
          ],
        },
        answer: { id: 'c' },
        points: 10,
      },
      {
        type: ExerciseType.MULTIPLE_CHOICE,
        prompt: '« الجمعة » (jemaa) est le jour :',
        data: {
          options: [
            { id: 'a', text: 'Du marché hebdomadaire seulement' },
            { id: 'b', text: 'Sacré de la prière du vendredi' },
            { id: 'c', text: 'De repos officiel' },
            { id: 'd', text: 'Des fêtes' },
          ],
        },
        answer: { id: 'b' },
        points: 10,
      },
      {
        type: ExerciseType.ARABIC_KEYBOARD,
        prompt: 'Écris « lundi » en arabe',
        data: {
          target: 'الاثنين',
          targetTransliteration: 'l-tnin',
          translation: 'lundi',
          hint: 'Deuxième jour de la semaine',
          audio: 'الاثنين',
        },
        answer: { text: 'الاثنين' },
        points: 15,
      },
      {
        type: ExerciseType.DRAWING,
        prompt: 'Trace « الجمعة »',
        data: { target: 'الجمعة', hint: 'jemaa — vendredi', threshold: 0.3 },
        answer: { value: 'الجمعة' },
        points: 15,
      },
      {
        type: ExerciseType.REORDER,
        prompt: 'Mets les jours dans l\'ordre (du dimanche au samedi)',
        data: {
          items: [
            { text: 'الجمعة' },
            { text: 'الثلاثاء' },
            { text: 'الأربعاء' },
            { text: 'الأحد' },
            { text: 'الخميس' },
            { text: 'الاثنين' },
            { text: 'السبت' },
          ],
        },
        answer: { order: ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'] },
        points: 15,
      },
      {
        type: ExerciseType.MULTIPLE_CHOICE,
        prompt: '« السبت » (sebt) signifie :',
        data: {
          options: [
            { id: 'a', text: 'Dimanche' },
            { id: 'b', text: 'Samedi' },
            { id: 'c', text: 'Vendredi' },
            { id: 'd', text: 'Jeudi' },
          ],
        },
        answer: { id: 'b' },
        points: 15,
      },
    ],
  },

  // ─────────────────────────── LEÇON 2 — Quelle heure est-il ? ───────────────────────────
  {
    order: 2,
    slug: 'le-temps-les-jours-lecon-2',
    title: 'Quelle heure est-il ?',
    subtitle: 'Lire l\'heure en darija',
    exos: [
      {
        type: ExerciseType.MULTIPLE_CHOICE,
        prompt: '« شحال من الساعة؟ » (chhal mn s-saa) signifie :',
        data: {
          options: [
            { id: 'a', text: 'Depuis combien d\'heures ?' },
            { id: 'b', text: 'Quelle heure est-il ?' },
            { id: 'c', text: 'À quelle heure on part ?' },
            { id: 'd', text: 'Tu as une montre ?' },
          ],
        },
        answer: { id: 'b' },
        points: 10,
      },
      {
        type: ExerciseType.LISTENING,
        prompt: 'Quelle heure entends-tu ?',
        data: {
          text: 'الساعة تلاتة ونص',
          lang: 'ar-MA',
          audio: 'الساعة تلاتة ونص',
          options: [
            { id: 'a', text: 'الساعة تلاتة', transliteration: '3h00' },
            { id: 'b', text: 'الساعة تلاتة ونص', transliteration: '3h30' },
            { id: 'c', text: 'الساعة تلاتة وربع', transliteration: '3h15' },
            { id: 'd', text: 'الساعة ربعة ونص', transliteration: '4h30' },
          ],
        },
        answer: { id: 'b' },
        points: 10,
      },
      {
        type: ExerciseType.MULTIPLE_CHOICE,
        prompt: 'Comment dit-on « Il est trois heures et demie » en darija ?',
        data: {
          options: [
            { id: 'a', text: 'Ssaa tlata' },
            { id: 'b', text: 'Ssaa tlata w-noss', transliteration: 'الساعة تلاتة ونص' },
            { id: 'c', text: 'Ssaa arbaa w-noss' },
            { id: 'd', text: 'Noss saa tlata' },
          ],
        },
        answer: { id: 'b' },
        points: 10,
      },
      {
        type: ExerciseType.ARABIC_KEYBOARD,
        prompt: 'Écris « l\'heure » en arabe',
        data: {
          target: 'الساعة',
          targetTransliteration: 's-saa',
          translation: 'l\'heure / la montre',
          hint: 'Mot-clé pour dire l\'heure',
          audio: 'الساعة',
        },
        answer: { text: 'الساعة' },
        points: 15,
      },
      {
        type: ExerciseType.DRAWING,
        prompt: 'Trace « نص »',
        data: { target: 'نص', hint: 'noss — et demie', threshold: 0.45 },
        answer: { value: 'نص' },
        points: 15,
      },
      {
        type: ExerciseType.FILL_BLANK,
        prompt: 'Complète : الساعة خمسة ___ (Il est 5h15)',
        data: {
          sentence: 'الساعة خمسة ___',
          options: ['وربع', 'ونص', 'إلا ربع', 'ونص وربع'],
        },
        answer: { text: 'وربع', translation: 'et quart', transliteration: 'w-rbaa' },
        points: 10,
      },
      {
        type: ExerciseType.MULTIPLE_CHOICE,
        prompt: '« الساعة خمسة وربع » signifie :',
        data: {
          options: [
            { id: 'a', text: '5h15' },
            { id: 'b', text: '5h30' },
            { id: 'c', text: '5h45' },
            { id: 'd', text: '4h45' },
          ],
        },
        answer: { id: 'a' },
        points: 15,
      },
    ],
  },

  // ─────────────────────────── LEÇON 3 — Les mois de l'année ───────────────────────────
  {
    order: 3,
    slug: 'le-temps-les-jours-lecon-3',
    title: 'Les mois de l\'année',
    subtitle: 'Calendriers solaire & hégirien',
    exos: [
      {
        type: ExerciseType.MULTIPLE_CHOICE,
        prompt: 'En darija marocain, on utilise souvent les noms de mois :',
        data: {
          options: [
            { id: 'a', text: 'Uniquement en arabe classique' },
            { id: 'b', text: 'La version francisée (yanayir, febrayer…) ET les noms berbères' },
            { id: 'c', text: 'Uniquement en français' },
            { id: 'd', text: 'Uniquement en berbère' },
          ],
        },
        answer: { id: 'b' },
        points: 10,
      },
      {
        type: ExerciseType.LISTENING,
        prompt: 'Quel mois entends-tu ?',
        data: {
          text: 'رمضان',
          lang: 'ar-MA',
          audio: 'رمضان',
          options: [
            { id: 'a', text: 'يناير', transliteration: 'yanayer (janvier)' },
            { id: 'b', text: 'رمضان', transliteration: 'ramadan' },
            { id: 'c', text: 'شعبان', transliteration: 'shaaban' },
            { id: 'd', text: 'شوال', transliteration: 'shawwal' },
          ],
        },
        answer: { id: 'b' },
        points: 10,
      },
      {
        type: ExerciseType.MULTIPLE_CHOICE,
        prompt: '« رمضان » est :',
        data: {
          options: [
            { id: 'a', text: 'Un mois du calendrier solaire' },
            { id: 'b', text: 'Le mois du jeûne dans le calendrier hégirien (lunaire)' },
            { id: 'c', text: 'Le premier mois de l\'année grégorienne' },
            { id: 'd', text: 'Un jour de fête seulement' },
          ],
        },
        answer: { id: 'b' },
        points: 10,
      },
      {
        type: ExerciseType.ARABIC_KEYBOARD,
        prompt: 'Écris « janvier » en arabe (version francisée darija)',
        data: {
          target: 'يناير',
          targetTransliteration: 'yanayer',
          translation: 'janvier',
          hint: 'Premier mois de l\'année',
          audio: 'يناير',
        },
        answer: { text: 'يناير' },
        points: 15,
      },
      {
        type: ExerciseType.DRAWING,
        prompt: 'Trace « رمضان »',
        data: { target: 'رمضان', hint: 'ramadan — mois du jeûne', threshold: 0.3 },
        answer: { value: 'رمضان' },
        points: 15,
      },
      {
        type: ExerciseType.FILL_BLANK,
        prompt: 'Complète : الشهر الأول هو ___ (Le premier mois est janvier)',
        data: {
          sentence: 'الشهر الأول هو ___',
          options: ['يناير', 'فبراير', 'مارس', 'أبريل'],
        },
        answer: { text: 'يناير', translation: 'janvier', transliteration: 'yanayer' },
        points: 10,
      },
      {
        type: ExerciseType.MULTIPLE_CHOICE,
        prompt: '« شهر » (chhr) signifie :',
        data: {
          options: [
            { id: 'a', text: 'Jour' },
            { id: 'b', text: 'Semaine' },
            { id: 'c', text: 'Mois' },
            { id: 'd', text: 'Année' },
          ],
        },
        answer: { id: 'c' },
        points: 15,
      },
    ],
  },
];

async function main() {
  console.log('📅 Refonte « Le Temps et les Jours » (DARIJA@17)\n');

  const mod = await prisma.module.findUnique({ where: { slug: 'le-temps-les-jours' } });
  if (!mod) {
    console.error('❌ Module le-temps-les-jours introuvable.');
    process.exit(1);
  }
  console.log(`Module : ${mod.slug}  (id=${mod.id})`);

  const lang = await prisma.language.findUnique({ where: { code: 'ar-MA' } });
  if (!lang) {
    console.error('❌ Langue ar-MA introuvable.');
    process.exit(1);
  }

  const existingLessons = await prisma.lesson.findMany({
    where: { moduleId: mod.id },
    select: { id: true },
  });
  console.log(`\n🗑️  Suppression de ${existingLessons.length} leçons existantes…`);
  for (const l of existingLessons) {
    await prisma.exercise.deleteMany({ where: { lessonId: l.id } });
  }
  await prisma.lesson.deleteMany({ where: { moduleId: mod.id } });
  console.log('   ✓ Leçons + exercices supprimés');

  await prisma.module.update({
    where: { id: mod.id },
    data: {
      title: 'Le Temps et les Jours',
      subtitle: 'Heures, jours et mois',
      description: 'Dis l\'heure, les jours de la semaine et les mois de l\'année en darija.',
      ...COLORS,
    },
  });

  console.log(`\n📖 Création de ${THEMES.length} leçons × 7 exos…\n`);
  let totalExos = 0;

  for (const t of THEMES) {
    const lesson = await prisma.lesson.create({
      data: {
        moduleId: mod.id,
        languageId: lang.id,
        slug: t.slug,
        title: t.title,
        subtitle: t.subtitle,
        order: t.order,
        isPublished: true,
      },
    });
    for (const exo of t.exos) {
      await prisma.exercise.create({
        data: {
          lessonId: lesson.id,
          type: exo.type,
          prompt: exo.prompt,
          data: exo.data,
          answer: exo.answer,
          points: exo.points,
        },
      });
      totalExos++;
    }
    console.log(`   ✓ [${t.order}] ${t.title.padEnd(28)} ${t.exos.length} exos`);
  }

  console.log(`\n✅ Terminé : ${THEMES.length} leçons, ${totalExos} exercices.\n`);
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error('❌ Erreur :', e);
  process.exit(1);
});
