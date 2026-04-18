/**
 * Refonte du module "Expressions Idiomatiques" (DARIJA@30, slug=expressions-idiomatiques).
 * 3 thèmes × 7 exos mixtes = 21 exos.
 *
 * Usage: npx tsx scripts/seedExpressionsIdiomatiquesRefonte.ts
 */
import { PrismaClient, ExerciseType } from '@prisma/client';

const prisma = new PrismaClient();

const COLORS = { colorA: '#ba68c8', colorB: '#9c27b0', shadowColor: '#6a1b9a' };

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
  // ─────────────────────────── LEÇON 1 — Inchallah et ses variantes ───────────────────────────
  {
    order: 1,
    slug: 'expressions-idiomatiques-lecon-1',
    title: 'Inchallah et ses variantes',
    subtitle: 'Expressions religieuses du quotidien',
    exos: [
      {
        type: ExerciseType.MULTIPLE_CHOICE,
        prompt: '« مكتوب » (mektoub) signifie :',
        data: {
          options: [
            { id: 'a', text: 'C\'est écrit / c\'est le destin' },
            { id: 'b', text: 'C\'est fini' },
            { id: 'c', text: 'C\'est vrai' },
            { id: 'd', text: 'C\'est bon' },
          ],
        },
        answer: { id: 'a' },
        points: 10,
      },
      {
        type: ExerciseType.LISTENING,
        prompt: 'Quelle formule entends-tu ?',
        data: {
          text: 'إن شاء الله',
          lang: 'ar-MA',
          audio: 'إن شاء الله',
          options: [
            { id: 'a', text: 'إن شاء الله', transliteration: 'inchallah (si Dieu veut)' },
            { id: 'b', text: 'الحمد لله', transliteration: 'l-hamdullah (louange à Dieu)' },
            { id: 'c', text: 'ما شاء الله', transliteration: 'machallah (que Dieu préserve)' },
            { id: 'd', text: 'بسم الله', transliteration: 'bismillah (au nom de Dieu)' },
          ],
        },
        answer: { id: 'a' },
        points: 10,
      },
      {
        type: ExerciseType.MULTIPLE_CHOICE,
        prompt: '« الله يرحمو » (Allah yrahmu) se dit :',
        data: {
          options: [
            { id: 'a', text: 'Lors d\'une naissance' },
            { id: 'b', text: 'Lors d\'un mariage' },
            { id: 'c', text: 'En évoquant quelqu\'un de décédé' },
            { id: 'd', text: 'Lors d\'un voyage' },
          ],
        },
        answer: { id: 'c' },
        points: 10,
      },
      {
        type: ExerciseType.ARABIC_KEYBOARD,
        prompt: 'Écris « inchallah » en arabe',
        data: {
          target: 'إن شاء الله',
          targetTransliteration: 'inchallah',
          translation: 'si Dieu veut',
          hint: 'Formule utilisée pour parler du futur',
          audio: 'إن شاء الله',
        },
        answer: { text: 'إن شاء الله' },
        points: 15,
      },
      {
        type: ExerciseType.DRAWING,
        prompt: 'Trace « مكتوب »',
        data: { target: 'مكتوب', hint: 'mektoub — le destin', threshold: 0.3 },
        answer: { value: 'مكتوب' },
        points: 15,
      },
      {
        type: ExerciseType.FILL_BLANK,
        prompt: 'Complète : غادي نجي غدا ___ (Je viendrai demain, inchallah)',
        data: {
          sentence: 'غادي نجي غدا ___',
          options: ['إن شاء الله', 'الحمد لله', 'مبروك', 'تفضل'],
        },
        answer: { text: 'إن شاء الله', translation: 'si Dieu veut', transliteration: 'inchallah' },
        points: 10,
      },
      {
        type: ExerciseType.MULTIPLE_CHOICE,
        prompt: '« عين الحسود فيها عود » est un proverbe qui signifie :',
        data: {
          options: [
            { id: 'a', text: 'Les yeux sont le miroir de l\'âme' },
            { id: 'b', text: 'La jalousie nuit à celui qui est jaloux' },
            { id: 'c', text: 'Prends soin de tes yeux' },
            { id: 'd', text: 'Le regard suffit à comprendre' },
          ],
        },
        answer: { id: 'b' },
        points: 15,
      },
    ],
  },

  // ─────────────────────────── LEÇON 2 — Vie sociale marocaine ───────────────────────────
  {
    order: 2,
    slug: 'expressions-idiomatiques-lecon-2',
    title: 'La vie sociale marocaine',
    subtitle: 'Politesse et félicitations',
    exos: [
      {
        type: ExerciseType.MULTIPLE_CHOICE,
        prompt: '« تفضل » (tafaddal) signifie :',
        data: {
          options: [
            { id: 'a', text: 'Non merci' },
            { id: 'b', text: 'Je vous en prie / entrez / servez-vous' },
            { id: 'c', text: 'Attends' },
            { id: 'd', text: 'Dépêche-toi' },
          ],
        },
        answer: { id: 'b' },
        points: 10,
      },
      {
        type: ExerciseType.LISTENING,
        prompt: 'Quelle formule entends-tu ?',
        data: {
          text: 'مبروك',
          lang: 'ar-MA',
          audio: 'مبروك',
          options: [
            { id: 'a', text: 'مبروك', transliteration: 'mabrouk (félicitations)' },
            { id: 'b', text: 'تفضل', transliteration: 'tafaddal (je vous en prie)' },
            { id: 'c', text: 'الله يخليك', transliteration: 'Allah ikhlik' },
            { id: 'd', text: 'بسلامة', transliteration: 'bslama (au revoir)' },
          ],
        },
        answer: { id: 'a' },
        points: 10,
      },
      {
        type: ExerciseType.MULTIPLE_CHOICE,
        prompt: '« الله يخليك » (Allah ikhlik) est une expression pour :',
        data: {
          options: [
            { id: 'a', text: 'Maudire quelqu\'un' },
            { id: 'b', text: 'Bénir quelqu\'un qu\'on aime (que Dieu te garde)' },
            { id: 'c', text: 'Dire au revoir' },
            { id: 'd', text: 'Remercier formellement' },
          ],
        },
        answer: { id: 'b' },
        points: 10,
      },
      {
        type: ExerciseType.ARABIC_KEYBOARD,
        prompt: 'Écris « félicitations » en arabe',
        data: {
          target: 'مبروك',
          targetTransliteration: 'mabrouk',
          translation: 'félicitations',
          hint: 'Pour un mariage, une naissance…',
          audio: 'مبروك',
        },
        answer: { text: 'مبروك' },
        points: 15,
      },
      {
        type: ExerciseType.DRAWING,
        prompt: 'Trace « تفضل »',
        data: { target: 'تفضل', hint: 'tafaddal — je vous en prie', threshold: 0.3 },
        answer: { value: 'تفضل' },
        points: 15,
      },
      {
        type: ExerciseType.FILL_BLANK,
        prompt: 'Complète : ___ على الولادة الجديدة! (Félicitations pour la naissance)',
        data: {
          sentence: '___ على الولادة الجديدة!',
          options: ['مبروك', 'تفضل', 'سمحلي', 'بسلامة'],
        },
        answer: { text: 'مبروك', translation: 'félicitations', transliteration: 'mabrouk' },
        points: 10,
      },
      {
        type: ExerciseType.MULTIPLE_CHOICE,
        prompt: '« مبروك » (mabrouk) est utilisé pour :',
        data: {
          options: [
            { id: 'a', text: 'Les condoléances' },
            { id: 'b', text: 'Les félicitations (mariage, naissance, promotion…)' },
            { id: 'c', text: 'Les salutations du matin' },
            { id: 'd', text: 'Demander un service' },
          ],
        },
        answer: { id: 'b' },
        points: 15,
      },
    ],
  },

  // ─────────────────────────── LEÇON 3 — Les proverbes marocains ───────────────────────────
  {
    order: 3,
    slug: 'expressions-idiomatiques-lecon-3',
    title: 'Les proverbes marocains',
    subtitle: 'Sagesse populaire',
    exos: [
      {
        type: ExerciseType.MULTIPLE_CHOICE,
        prompt: '« اللي فات مات » (lli fat mat) signifie :',
        data: {
          options: [
            { id: 'a', text: 'La mort est inévitable' },
            { id: 'b', text: 'Ce qui est passé est passé (tourne la page)' },
            { id: 'c', text: 'Les anciens ont toujours raison' },
            { id: 'd', text: 'Le temps guérit tout' },
          ],
        },
        answer: { id: 'b' },
        points: 10,
      },
      {
        type: ExerciseType.LISTENING,
        prompt: 'Quel proverbe entends-tu ?',
        data: {
          text: 'الصبر مفتاح الفرج',
          lang: 'ar-MA',
          audio: 'الصبر مفتاح الفرج',
          options: [
            { id: 'a', text: 'الصبر مفتاح الفرج', transliteration: 's-sabr moftah l-faraj' },
            { id: 'b', text: 'اللي فات مات', transliteration: 'lli fat mat' },
            { id: 'c', text: 'عين الحسود فيها عود', transliteration: 'ayn l-hasoud fiha oud' },
            { id: 'd', text: 'الوقت من ذهب', transliteration: 'l-waqt mn dahab' },
          ],
        },
        answer: { id: 'a' },
        points: 10,
      },
      {
        type: ExerciseType.MULTIPLE_CHOICE,
        prompt: '« الصبر مفتاح الفرج » signifie :',
        data: {
          options: [
            { id: 'a', text: 'La chance sourit aux audacieux' },
            { id: 'b', text: 'La patience est la clé du bonheur / de la délivrance' },
            { id: 'c', text: 'Le temps c\'est de l\'argent' },
            { id: 'd', text: 'Il faut battre le fer pendant qu\'il est chaud' },
          ],
        },
        answer: { id: 'b' },
        points: 10,
      },
      {
        type: ExerciseType.ARABIC_KEYBOARD,
        prompt: 'Écris « la patience » en arabe',
        data: {
          target: 'الصبر',
          targetTransliteration: 's-sabr',
          translation: 'la patience',
          hint: 'Vertu essentielle dans les proverbes',
          audio: 'الصبر',
        },
        answer: { text: 'الصبر' },
        points: 15,
      },
      {
        type: ExerciseType.DRAWING,
        prompt: 'Trace « مفتاح »',
        data: { target: 'مفتاح', hint: 'moftah — clé', threshold: 0.3 },
        answer: { value: 'مفتاح' },
        points: 15,
      },
      {
        type: ExerciseType.FILL_BLANK,
        prompt: 'Complète : ___ مفتاح الفرج (La patience est la clé du bonheur)',
        data: {
          sentence: '___ مفتاح الفرج',
          options: ['الصبر', 'الوقت', 'العقل', 'المال'],
        },
        answer: { text: 'الصبر', translation: 'la patience', transliteration: 's-sabr' },
        points: 10,
      },
      {
        type: ExerciseType.MULTIPLE_CHOICE,
        prompt: '« خو خو يا قردة » est une expression utilisée pour :',
        data: {
          options: [
            { id: 'a', text: 'Appeler quelqu\'un affectueusement' },
            { id: 'b', text: 'Se moquer de quelqu\'un qui imite les autres sans réfléchir' },
            { id: 'c', text: 'Appeler les enfants pour jouer' },
            { id: 'd', text: 'Se plaindre du bruit' },
          ],
        },
        answer: { id: 'b' },
        points: 15,
      },
    ],
  },
];

async function main() {
  console.log('🗣️  Refonte « Expressions Idiomatiques » (DARIJA@30)\n');

  const mod = await prisma.module.findUnique({ where: { slug: 'expressions-idiomatiques' } });
  if (!mod) {
    console.error('❌ Module expressions-idiomatiques introuvable.');
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
      title: 'Expressions Idiomatiques',
      subtitle: 'Parler comme un Marocain',
      description: 'Les expressions figées, proverbes et formules qui donnent du piquant à ton darija.',
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
    console.log(`   ✓ [${t.order}] ${t.title.padEnd(32)} ${t.exos.length} exos`);
  }

  console.log(`\n✅ Terminé : ${THEMES.length} leçons, ${totalExos} exercices.\n`);
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error('❌ Erreur :', e);
  process.exit(1);
});
