/**
 * Refonte du module "Le Travail" (DARIJA@23, slug=les-metiers-et-travail).
 * 3 thèmes × 7 exos mixtes = 21 exos.
 *
 * Usage: npx tsx scripts/seedLesMetiersRefonte.ts
 */
import { PrismaClient, ExerciseType } from '@prisma/client';

const prisma = new PrismaClient();

const COLORS = { colorA: '#a1887f', colorB: '#795548', shadowColor: '#4e342e' };

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
  // ─────────────────────────── LEÇON 1 — Métiers courants ───────────────────────────
  {
    order: 1,
    slug: 'les-metiers-et-travail-lecon-1',
    title: 'Les métiers courants',
    subtitle: 'Artisans et professions',
    exos: [
      {
        type: ExerciseType.MULTIPLE_CHOICE,
        prompt: '« المعلم » (l-maallem) désigne :',
        data: {
          options: [
            { id: 'a', text: 'Le médecin' },
            { id: 'b', text: 'L\'artisan maître (charpentier, maçon…)' },
            { id: 'c', text: 'Le directeur' },
            { id: 'd', text: 'Le commerçant' },
          ],
        },
        answer: { id: 'b' },
        points: 10,
      },
      {
        type: ExerciseType.LISTENING,
        prompt: 'Quel métier entends-tu ?',
        data: {
          text: 'الخياط',
          lang: 'ar-MA',
          audio: 'الخياط',
          options: [
            { id: 'a', text: 'الخياط', transliteration: 'l-khayyat (tailleur)' },
            { id: 'b', text: 'الحداد', transliteration: 'l-heddad (forgeron)' },
            { id: 'c', text: 'النجار', transliteration: 'n-najjar (menuisier)' },
            { id: 'd', text: 'الحلاق', transliteration: 'l-hellaq (coiffeur)' },
          ],
        },
        answer: { id: 'a' },
        points: 10,
      },
      {
        type: ExerciseType.MULTIPLE_CHOICE,
        prompt: '« الخياط » (l-khayyat) est :',
        data: {
          options: [
            { id: 'a', text: 'Le cordonnier' },
            { id: 'b', text: 'Le tailleur / couturier' },
            { id: 'c', text: 'Le forgeron' },
            { id: 'd', text: 'Le potier' },
          ],
        },
        answer: { id: 'b' },
        points: 10,
      },
      {
        type: ExerciseType.ARABIC_KEYBOARD,
        prompt: 'Écris « ingénieur » en arabe',
        data: {
          target: 'مهندس',
          targetTransliteration: 'muhandis',
          translation: 'ingénieur',
          hint: 'Profession technique',
          audio: 'مهندس',
        },
        answer: { text: 'مهندس' },
        points: 15,
      },
      {
        type: ExerciseType.DRAWING,
        prompt: 'Trace « المعلم »',
        data: { target: 'المعلم', hint: 'l-maallem — le maître artisan', threshold: 0.3 },
        answer: { value: 'المعلم' },
        points: 15,
      },
      {
        type: ExerciseType.FILL_BLANK,
        prompt: 'Complète : بابا هو ___ (Mon père est médecin)',
        data: {
          sentence: 'بابا هو ___',
          options: ['طبيب', 'خياط', 'نجار', 'معلم'],
        },
        answer: { text: 'طبيب', translation: 'médecin', transliteration: 'tbib' },
        points: 10,
      },
      {
        type: ExerciseType.MULTIPLE_CHOICE,
        prompt: 'Comment dit-on « Mon père est ingénieur » en darija ?',
        data: {
          options: [
            { id: 'a', text: 'Baba huwa tabib' },
            { id: 'b', text: 'Baba huwa muhandis', transliteration: 'بابا هو مهندس' },
            { id: 'c', text: 'Baba mudarris' },
            { id: 'd', text: 'Baba huwa khayyat' },
          ],
        },
        answer: { id: 'b' },
        points: 15,
      },
    ],
  },

  // ─────────────────────────── LEÇON 2 — Au bureau ───────────────────────────
  {
    order: 2,
    slug: 'les-metiers-et-travail-lecon-2',
    title: 'Au bureau',
    subtitle: 'Réunions, horaires, collègues',
    exos: [
      {
        type: ExerciseType.MULTIPLE_CHOICE,
        prompt: '« الاجتماع » (l-ijtima) désigne :',
        data: {
          options: [
            { id: 'a', text: 'La pause café' },
            { id: 'b', text: 'La réunion' },
            { id: 'c', text: 'Le bureau' },
            { id: 'd', text: 'Le contrat' },
          ],
        },
        answer: { id: 'b' },
        points: 10,
      },
      {
        type: ExerciseType.LISTENING,
        prompt: 'Quel mot entends-tu ?',
        data: {
          text: 'الشغل',
          lang: 'ar-MA',
          audio: 'الشغل',
          options: [
            { id: 'a', text: 'الشغل', transliteration: 'ch-chghol (le travail)' },
            { id: 'b', text: 'المكتب', transliteration: 'l-maktab (le bureau)' },
            { id: 'c', text: 'الاجتماع', transliteration: 'l-ijtima (la réunion)' },
            { id: 'd', text: 'المدير', transliteration: 'l-mdir (le directeur)' },
          ],
        },
        answer: { id: 'a' },
        points: 10,
      },
      {
        type: ExerciseType.MULTIPLE_CHOICE,
        prompt: '« المدير » (l-mdir) signifie :',
        data: {
          options: [
            { id: 'a', text: 'Le collègue' },
            { id: 'b', text: 'Le directeur / chef' },
            { id: 'c', text: 'Le stagiaire' },
            { id: 'd', text: 'Le client' },
          ],
        },
        answer: { id: 'b' },
        points: 10,
      },
      {
        type: ExerciseType.ARABIC_KEYBOARD,
        prompt: 'Écris « le bureau » en arabe',
        data: {
          target: 'المكتب',
          targetTransliteration: 'l-maktab',
          translation: 'le bureau',
          hint: 'Lieu de travail',
          audio: 'المكتب',
        },
        answer: { text: 'المكتب' },
        points: 15,
      },
      {
        type: ExerciseType.DRAWING,
        prompt: 'Trace « اجتماع »',
        data: { target: 'اجتماع', hint: 'ijtima — réunion', threshold: 0.25 },
        answer: { value: 'اجتماع' },
        points: 15,
      },
      {
        type: ExerciseType.FILL_BLANK,
        prompt: 'Complète : عندي ___ الساعة عشرة (J\'ai une réunion à 10h)',
        data: {
          sentence: 'عندي ___ الساعة عشرة',
          options: ['اجتماع', 'شغل', 'مكتب', 'ملف'],
        },
        answer: { text: 'اجتماع', translation: 'une réunion', transliteration: 'ijtima' },
        points: 10,
      },
      {
        type: ExerciseType.MULTIPLE_CHOICE,
        prompt: 'Comment dit-on « J\'ai une réunion à 10h » en darija ?',
        data: {
          options: [
            { id: 'a', text: 'Andi ijtima ssaa achara', transliteration: 'عندي اجتماع الساعة عشرة' },
            { id: 'b', text: 'Andi ijtima ssaa tisa' },
            { id: 'c', text: 'Andi chi haja ssaa achara' },
            { id: 'd', text: 'Baghi nemchi l-maktab' },
          ],
        },
        answer: { id: 'a' },
        points: 15,
      },
    ],
  },

  // ─────────────────────────── LEÇON 3 — Parler de sa carrière ───────────────────────────
  {
    order: 3,
    slug: 'les-metiers-et-travail-lecon-3',
    title: 'Parler de sa carrière',
    subtitle: 'Études et expérience',
    exos: [
      {
        type: ExerciseType.MULTIPLE_CHOICE,
        prompt: '« قريت فـ الجامعة » signifie :',
        data: {
          options: [
            { id: 'a', text: 'Je travaille à l\'université' },
            { id: 'b', text: 'J\'ai étudié à l\'université' },
            { id: 'c', text: 'J\'habite près de l\'université' },
            { id: 'd', text: 'Je connais l\'université' },
          ],
        },
        answer: { id: 'b' },
        points: 10,
      },
      {
        type: ExerciseType.LISTENING,
        prompt: 'Quel mot entends-tu ?',
        data: {
          text: 'التجربة',
          lang: 'ar-MA',
          audio: 'التجربة',
          options: [
            { id: 'a', text: 'التجربة', transliteration: 't-tajriba (expérience)' },
            { id: 'b', text: 'الدراسة', transliteration: 'd-dirasa (les études)' },
            { id: 'c', text: 'الشهادة', transliteration: 'ch-chahada (diplôme)' },
            { id: 'd', text: 'الجامعة', transliteration: 'l-jamia (université)' },
          ],
        },
        answer: { id: 'a' },
        points: 10,
      },
      {
        type: ExerciseType.MULTIPLE_CHOICE,
        prompt: '« عندي تجربة فـ… » (andi tajriba f…) signifie :',
        data: {
          options: [
            { id: 'a', text: 'J\'ai un diplôme en…' },
            { id: 'b', text: 'J\'ai de l\'expérience en…' },
            { id: 'c', text: 'Je cherche un travail en…' },
            { id: 'd', text: 'J\'ai étudié…' },
          ],
        },
        answer: { id: 'b' },
        points: 10,
      },
      {
        type: ExerciseType.ARABIC_KEYBOARD,
        prompt: 'Écris « l\'expérience » en arabe',
        data: {
          target: 'التجربة',
          targetTransliteration: 't-tajriba',
          translation: 'l\'expérience',
          hint: 'Ce qu\'on a acquis au travail',
          audio: 'التجربة',
        },
        answer: { text: 'التجربة' },
        points: 15,
      },
      {
        type: ExerciseType.DRAWING,
        prompt: 'Trace « الشهادة »',
        data: { target: 'الشهادة', hint: 'ch-chahada — le diplôme', threshold: 0.3 },
        answer: { value: 'الشهادة' },
        points: 15,
      },
      {
        type: ExerciseType.FILL_BLANK,
        prompt: 'Complète : كنقلب على ___ جديد (Je cherche un nouveau travail)',
        data: {
          sentence: 'كنقلب على ___ جديد',
          options: ['خدمة', 'مكتب', 'طبيب', 'مدير'],
        },
        answer: { text: 'خدمة', translation: 'un travail', transliteration: 'khedma' },
        points: 10,
      },
      {
        type: ExerciseType.MULTIPLE_CHOICE,
        prompt: 'Comment dit-on « J\'ai 5 ans d\'expérience » en darija ?',
        data: {
          options: [
            { id: 'a', text: 'Khdmt 5 snin' },
            { id: 'b', text: 'Andi khamsa dyal snin tajriba', transliteration: 'عندي خمسة ديال السنين تجربة' },
            { id: 'c', text: 'Knqalb ela 5 snin' },
            { id: 'd', text: 'Khamsa snin andi' },
          ],
        },
        answer: { id: 'b' },
        points: 15,
      },
    ],
  },
];

async function main() {
  console.log('💼 Refonte « Le Travail » (DARIJA@23)\n');

  const mod = await prisma.module.findUnique({ where: { slug: 'les-metiers-et-travail' } });
  if (!mod) {
    console.error('❌ Module les-metiers-et-travail introuvable.');
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
      title: 'Le Travail',
      subtitle: 'Métiers et vie professionnelle',
      description: 'Parler de son travail, ses études et la vie professionnelle au Maroc.',
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
