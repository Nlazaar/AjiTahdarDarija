/**
 * Refonte du module "Se Présenter" (DARIJA@2, slug=se-presenter).
 * Conserve la structure 4 thèmes mais enrichit chaque leçon à 7 exercices mixtes :
 *   2 MCQ  +  1 LISTENING  +  1 ARABIC_KEYBOARD  +  1 DRAWING  +  1 FILL_BLANK  +  1 MCQ production
 * Total : 28 exos.
 *
 * Usage: npx tsx scripts/seedSePresenterRefonte.ts
 */
import { PrismaClient, ExerciseType } from '@prisma/client';

const prisma = new PrismaClient();

const COLORS = { colorA: '#4db6ac', colorB: '#26a69a', shadowColor: '#00897b' };

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
  // ─────────────────────────── LEÇON 1 — Mon prénom ───────────────────────────
  {
    order: 1,
    slug: 'se-presenter-lecon-1',
    title: 'Mon prénom',
    subtitle: 'Comment tu t\'appelles ?',
    exos: [
      {
        type: ExerciseType.MULTIPLE_CHOICE,
        prompt: '« شنو سميتك؟ » (chnou smitk) signifie :',
        data: {
          options: [
            { id: 'a', text: 'Quel âge as-tu ?' },
            { id: 'b', text: 'Comment tu t\'appelles ?' },
            { id: 'c', text: 'D\'où viens-tu ?' },
            { id: 'd', text: 'Où habites-tu ?' },
          ],
        },
        answer: { id: 'b' },
        points: 10,
      },
      {
        type: ExerciseType.LISTENING,
        prompt: 'Quelle phrase entends-tu ?',
        data: {
          text: 'شنو سميتك',
          lang: 'ar-MA',
          audio: 'شنو سميتك',
          options: [
            { id: 'a', text: 'شحال عندك', transliteration: 'chhal andk' },
            { id: 'b', text: 'شنو سميتك', transliteration: 'chnou smitk' },
            { id: 'c', text: 'منين نتا', transliteration: 'mnin nta' },
            { id: 'd', text: 'أشنو كتخدم', transliteration: 'achnou katkhdem' },
          ],
        },
        answer: { id: 'b' },
        points: 10,
      },
      {
        type: ExerciseType.MULTIPLE_CHOICE,
        prompt: 'Comment dit-on « Je m\'appelle Youssef » en darija ?',
        data: {
          options: [
            { id: 'a', text: 'Ismi Youssef' },
            { id: 'b', text: 'Ana smiti Youssef', transliteration: 'أنا سميتي يوسف' },
            { id: 'c', text: 'Youssef huwa ana' },
            { id: 'd', text: 'Andi Youssef' },
          ],
        },
        answer: { id: 'b' },
        points: 10,
      },
      {
        type: ExerciseType.ARABIC_KEYBOARD,
        prompt: 'Écris « Mon prénom est… » en arabe',
        data: {
          target: 'أنا سميتي',
          targetTransliteration: 'ana smiti',
          translation: 'Mon prénom est…',
          hint: 'Formule pour se présenter',
          audio: 'أنا سميتي',
        },
        answer: { text: 'أنا سميتي' },
        points: 15,
      },
      {
        type: ExerciseType.DRAWING,
        prompt: 'Trace « سميتي »',
        data: { target: 'سميتي', hint: 'smiti — mon prénom', threshold: 0.35 },
        answer: { value: 'سميتي' },
        points: 15,
      },
      {
        type: ExerciseType.FILL_BLANK,
        prompt: 'Complète : ___ سميتي يوسف (Mon prénom est Youssef)',
        data: {
          sentence: '___ سميتي يوسف',
          options: ['أنا', 'هو', 'نتا', 'هي'],
        },
        answer: { text: 'أنا', translation: 'moi / je', transliteration: 'ana' },
        points: 10,
      },
      {
        type: ExerciseType.MULTIPLE_CHOICE,
        prompt: 'Pour dire « enchanté(e) », on dit :',
        data: {
          options: [
            { id: 'a', text: 'مرحبا (marhba)' },
            { id: 'b', text: 'متشرفين (motcharfin)' },
            { id: 'c', text: 'شكرا (choukran)' },
            { id: 'd', text: 'عفاك (afak)' },
          ],
          hint: 'Se dit après avoir fait connaissance',
        },
        answer: { id: 'b' },
        points: 15,
      },
    ],
  },

  // ─────────────────────────── LEÇON 2 — Ma nationalité ───────────────────────────
  {
    order: 2,
    slug: 'se-presenter-lecon-2',
    title: 'Ma nationalité',
    subtitle: 'D\'où viens-tu ?',
    exos: [
      {
        type: ExerciseType.MULTIPLE_CHOICE,
        prompt: '« منين نتا؟ » (mnin nta) signifie :',
        data: {
          options: [
            { id: 'a', text: 'Qui es-tu ?' },
            { id: 'b', text: 'D\'où es-tu ?' },
            { id: 'c', text: 'Comment vas-tu ?' },
            { id: 'd', text: 'Où vas-tu ?' },
          ],
        },
        answer: { id: 'b' },
        points: 10,
      },
      {
        type: ExerciseType.LISTENING,
        prompt: 'Quelle phrase entends-tu ?',
        data: {
          text: 'منين نتا',
          lang: 'ar-MA',
          audio: 'منين نتا',
          options: [
            { id: 'a', text: 'منين نتا', transliteration: 'mnin nta' },
            { id: 'b', text: 'فين نتا', transliteration: 'fin nta' },
            { id: 'c', text: 'شكون نتا', transliteration: 'chkoun nta' },
            { id: 'd', text: 'كيف نتا', transliteration: 'kif nta' },
          ],
        },
        answer: { id: 'a' },
        points: 10,
      },
      {
        type: ExerciseType.MULTIPLE_CHOICE,
        prompt: 'Comment dit-on « Je suis marocain » en darija ?',
        data: {
          options: [
            { id: 'a', text: 'Ana min Maghrib' },
            { id: 'b', text: 'Ana maghribi', transliteration: 'أنا مغربي' },
            { id: 'c', text: 'Ana morocco' },
            { id: 'd', text: 'Maghribi ana' },
          ],
        },
        answer: { id: 'b' },
        points: 10,
      },
      {
        type: ExerciseType.ARABIC_KEYBOARD,
        prompt: 'Écris « Je suis marocain » en arabe',
        data: {
          target: 'أنا مغربي',
          targetTransliteration: 'ana maghribi',
          translation: 'Je suis marocain',
          hint: 'Nationalité',
          audio: 'أنا مغربي',
        },
        answer: { text: 'أنا مغربي' },
        points: 15,
      },
      {
        type: ExerciseType.DRAWING,
        prompt: 'Trace « مغربي »',
        data: { target: 'مغربي', hint: 'maghribi — marocain', threshold: 0.35 },
        answer: { value: 'مغربي' },
        points: 15,
      },
      {
        type: ExerciseType.FILL_BLANK,
        prompt: 'Complète : أنا ___ من المغرب (Je suis venant du Maroc)',
        data: {
          sentence: 'أنا ___ من المغرب',
          options: ['جاي', 'مشيت', 'كاين', 'راجع'],
        },
        answer: { text: 'جاي', translation: 'venant', transliteration: 'jay' },
        points: 10,
      },
      {
        type: ExerciseType.MULTIPLE_CHOICE,
        prompt: 'Comment dit-on « France » en darija ?',
        data: {
          options: [
            { id: 'a', text: 'فرانسا (Fransa)' },
            { id: 'b', text: 'فرنسيس (Frensis)' },
            { id: 'c', text: 'فرنسا (Farnsa)' },
            { id: 'd', text: 'باريس (Paris)' },
          ],
        },
        answer: { id: 'a' },
        points: 15,
      },
    ],
  },

  // ─────────────────────────── LEÇON 3 — Mon âge ───────────────────────────
  {
    order: 3,
    slug: 'se-presenter-lecon-3',
    title: 'Mon âge',
    subtitle: 'Quel âge as-tu ?',
    exos: [
      {
        type: ExerciseType.MULTIPLE_CHOICE,
        prompt: '« شحال عندك من العام؟ » (chhal andk mn l-am) signifie :',
        data: {
          options: [
            { id: 'a', text: 'En quelle année es-tu né ?' },
            { id: 'b', text: 'Quel âge as-tu ?' },
            { id: 'c', text: 'Depuis combien de temps es-tu là ?' },
            { id: 'd', text: 'Quelle heure est-il ?' },
          ],
        },
        answer: { id: 'b' },
        points: 10,
      },
      {
        type: ExerciseType.LISTENING,
        prompt: 'Quel mot entends-tu ?',
        data: {
          text: 'عام',
          lang: 'ar-MA',
          audio: 'عام',
          options: [
            { id: 'a', text: 'يوم', transliteration: 'youm (jour)' },
            { id: 'b', text: 'شهر', transliteration: 'chhr (mois)' },
            { id: 'c', text: 'عام', transliteration: 'am (an)' },
            { id: 'd', text: 'سيمانا', transliteration: 'simana (semaine)' },
          ],
        },
        answer: { id: 'c' },
        points: 10,
      },
      {
        type: ExerciseType.MULTIPLE_CHOICE,
        prompt: 'Comment dit-on « J\'ai 25 ans » en darija ?',
        data: {
          options: [
            { id: 'a', text: 'Ana achrine am' },
            { id: 'b', text: 'Andi khamsin am' },
            { id: 'c', text: 'Andi khamsa w-achrine am', transliteration: 'عندي خمسة وعشرين عام' },
            { id: 'd', text: 'Khamsa w-achrine sana' },
          ],
        },
        answer: { id: 'c' },
        points: 10,
      },
      {
        type: ExerciseType.ARABIC_KEYBOARD,
        prompt: 'Écris « J\'ai… ans » (structure) en arabe',
        data: {
          target: 'عندي',
          targetTransliteration: 'andi',
          translation: 'J\'ai (litt. chez moi)',
          hint: 'Mot-clé pour dire son âge',
          audio: 'عندي',
        },
        answer: { text: 'عندي' },
        points: 15,
      },
      {
        type: ExerciseType.DRAWING,
        prompt: 'Trace « عام »',
        data: { target: 'عام', hint: 'am — an / année', threshold: 0.45 },
        answer: { value: 'عام' },
        points: 15,
      },
      {
        type: ExerciseType.FILL_BLANK,
        prompt: 'Complète : عندي عشرين ___ (J\'ai vingt ans)',
        data: {
          sentence: 'عندي عشرين ___',
          options: ['عام', 'يوم', 'شهر', 'سيمانا'],
        },
        answer: { text: 'عام', translation: 'an / année', transliteration: 'am' },
        points: 10,
      },
      {
        type: ExerciseType.MULTIPLE_CHOICE,
        prompt: 'عام (am) signifie :',
        data: {
          options: [
            { id: 'a', text: 'Mois' },
            { id: 'b', text: 'Semaine' },
            { id: 'c', text: 'An / Année' },
            { id: 'd', text: 'Jour' },
          ],
        },
        answer: { id: 'c' },
        points: 15,
      },
    ],
  },

  // ─────────────────────────── LEÇON 4 — Mon métier ───────────────────────────
  {
    order: 4,
    slug: 'se-presenter-lecon-4',
    title: 'Mon métier',
    subtitle: 'Que fais-tu dans la vie ?',
    exos: [
      {
        type: ExerciseType.MULTIPLE_CHOICE,
        prompt: '« أشنو كتخدم؟ » (achnou katkhdem) signifie :',
        data: {
          options: [
            { id: 'a', text: 'Où travailles-tu ?' },
            { id: 'b', text: 'Qu\'est-ce que tu fais comme travail ?' },
            { id: 'c', text: 'Tu travailles combien d\'heures ?' },
            { id: 'd', text: 'Aimes-tu ton travail ?' },
          ],
        },
        answer: { id: 'b' },
        points: 10,
      },
      {
        type: ExerciseType.LISTENING,
        prompt: 'Quel métier entends-tu ?',
        data: {
          text: 'طبيب',
          lang: 'ar-MA',
          audio: 'طبيب',
          options: [
            { id: 'a', text: 'طالب', transliteration: 'talib (étudiant)' },
            { id: 'b', text: 'طبيب', transliteration: 'tbib (médecin)' },
            { id: 'c', text: 'معلم', transliteration: 'm3allim (artisan)' },
            { id: 'd', text: 'مدرس', transliteration: 'mudarris (professeur)' },
          ],
        },
        answer: { id: 'b' },
        points: 10,
      },
      {
        type: ExerciseType.MULTIPLE_CHOICE,
        prompt: '« أنا طبيب » signifie :',
        data: {
          options: [
            { id: 'a', text: 'Je suis professeur' },
            { id: 'b', text: 'Je suis ingénieur' },
            { id: 'c', text: 'Je suis médecin' },
            { id: 'd', text: 'Je suis étudiant' },
          ],
        },
        answer: { id: 'c' },
        points: 10,
      },
      {
        type: ExerciseType.ARABIC_KEYBOARD,
        prompt: 'Écris « Je suis étudiant » en arabe',
        data: {
          target: 'أنا طالب',
          targetTransliteration: 'ana talib',
          translation: 'Je suis étudiant',
          hint: 'Formule pour dire son statut',
          audio: 'أنا طالب',
        },
        answer: { text: 'أنا طالب' },
        points: 15,
      },
      {
        type: ExerciseType.DRAWING,
        prompt: 'Trace « طبيب »',
        data: { target: 'طبيب', hint: 'tbib — médecin', threshold: 0.35 },
        answer: { value: 'طبيب' },
        points: 15,
      },
      {
        type: ExerciseType.FILL_BLANK,
        prompt: 'Complète : كنخدم ___ الدار البيضا (Je travaille à Casablanca)',
        data: {
          sentence: 'كنخدم ___ الدار البيضا',
          options: ['فـ', 'من', 'مع', 'على'],
        },
        answer: { text: 'فـ', translation: 'à / dans', transliteration: 'f' },
        points: 10,
      },
      {
        type: ExerciseType.MULTIPLE_CHOICE,
        prompt: '« كنخدم فـ… » (knkhdem f…) signifie :',
        data: {
          options: [
            { id: 'a', text: 'Je cherche un travail à...' },
            { id: 'b', text: 'Je travaille à / dans...' },
            { id: 'c', text: 'J\'ai arrêté de travailler à...' },
            { id: 'd', text: 'Je veux travailler à...' },
          ],
        },
        answer: { id: 'b' },
        points: 15,
      },
    ],
  },
];

async function main() {
  console.log('🧑‍🎓 Refonte « Se Présenter » (DARIJA@2)\n');

  const mod = await prisma.module.findUnique({ where: { slug: 'se-presenter' } });
  if (!mod) {
    console.error('❌ Module se-presenter introuvable.');
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
      title: 'Se Présenter',
      subtitle: 'Parler de soi',
      description: 'Apprends à te présenter : ton prénom, ta nationalité, ton âge et ton métier.',
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
    console.log(`   ✓ [${t.order}] ${t.title.padEnd(20)} ${t.exos.length} exos`);
  }

  console.log(`\n✅ Terminé : ${THEMES.length} leçons, ${totalExos} exercices.\n`);
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error('❌ Erreur :', e);
  process.exit(1);
});
