/**
 * Refonte du module "Darija Avancé" (DARIJA@31, slug=darija-avance).
 * 3 thèmes × 7 exos mixtes = 21 exos.
 *
 * Usage: npx tsx scripts/seedDarijaAvanceRefonte.ts
 */
import { PrismaClient, ExerciseType } from '@prisma/client';

const prisma = new PrismaClient();

const COLORS = { colorA: '#4fc3f7', colorB: '#0288d1', shadowColor: '#01579b' };

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
  // ─────────────────────────── LEÇON 1 — Les verbes au présent ───────────────────────────
  {
    order: 1,
    slug: 'darija-avance-lecon-1',
    title: 'Les verbes au présent',
    subtitle: 'Le préfixe ka- (كـ)',
    exos: [
      {
        type: ExerciseType.MULTIPLE_CHOICE,
        prompt: 'En darija, le présent continu se forme avec :',
        data: {
          options: [
            { id: 'a', text: 'Le verbe seul' },
            { id: 'b', text: 'كـ (ka-) + le verbe' },
            { id: 'c', text: 'Le verbe + نا' },
            { id: 'd', text: 'غادي + le verbe' },
          ],
        },
        answer: { id: 'b' },
        points: 10,
      },
      {
        type: ExerciseType.LISTENING,
        prompt: 'Quel verbe entends-tu ?',
        data: {
          text: 'كنمشي',
          lang: 'ar-MA',
          audio: 'كنمشي',
          options: [
            { id: 'a', text: 'كنمشي', transliteration: 'knmchi (je vais)' },
            { id: 'b', text: 'مشيت', transliteration: 'mchit (je suis allé)' },
            { id: 'c', text: 'غادي نمشي', transliteration: 'ghadi nmchi (j\'irai)' },
            { id: 'd', text: 'نمشي', transliteration: 'nmchi (que j\'aille)' },
          ],
        },
        answer: { id: 'a' },
        points: 10,
      },
      {
        type: ExerciseType.MULTIPLE_CHOICE,
        prompt: '« كنمشي للمدرسة » signifie :',
        data: {
          options: [
            { id: 'a', text: 'J\'irai à l\'école' },
            { id: 'b', text: 'Je vais (en ce moment) à l\'école / j\'y vais habituellement' },
            { id: 'c', text: 'Je suis allé à l\'école' },
            { id: 'd', text: 'Va à l\'école' },
          ],
        },
        answer: { id: 'b' },
        points: 10,
      },
      {
        type: ExerciseType.ARABIC_KEYBOARD,
        prompt: 'Écris « je mange (en ce moment) » en arabe',
        data: {
          target: 'كنكل',
          targetTransliteration: 'knakol',
          translation: 'je mange',
          hint: 'Présent continu : ka- + verbe',
          audio: 'كنكل',
        },
        answer: { text: 'كنكل' },
        points: 15,
      },
      {
        type: ExerciseType.DRAWING,
        prompt: 'Trace « كيكتب »',
        data: { target: 'كيكتب', hint: 'kiktab — il écrit', threshold: 0.3 },
        answer: { value: 'كيكتب' },
        points: 15,
      },
      {
        type: ExerciseType.FILL_BLANK,
        prompt: 'Complète : هو ___ يكل دابا (Il mange en ce moment)',
        data: {
          sentence: 'هو ___ يكل دابا',
          options: ['كـ', 'غادي', 'ما', 'باش'],
        },
        answer: { text: 'كـ', translation: 'préfixe du présent', transliteration: 'ka-' },
        points: 10,
      },
      {
        type: ExerciseType.MULTIPLE_CHOICE,
        prompt: 'Comment dit-on « Il mange en ce moment » en darija ?',
        data: {
          options: [
            { id: 'a', text: 'Huwa kichrab daba' },
            { id: 'b', text: 'Huwa kiakol daba', transliteration: 'هو كياكل دابا' },
            { id: 'c', text: 'Huwa mcha yakol' },
            { id: 'd', text: 'Daba ghadi yakol' },
          ],
        },
        answer: { id: 'b' },
        points: 15,
      },
    ],
  },

  // ─────────────────────────── LEÇON 2 — Le passé en darija ───────────────────────────
  {
    order: 2,
    slug: 'darija-avance-lecon-2',
    title: 'Le passé en darija',
    subtitle: 'Verbes accomplis et négation',
    exos: [
      {
        type: ExerciseType.MULTIPLE_CHOICE,
        prompt: '« مشيت » (mchit) signifie :',
        data: {
          options: [
            { id: 'a', text: 'Je vais' },
            { id: 'b', text: 'Je suis parti / J\'y suis allé' },
            { id: 'c', text: 'Je vais partir' },
            { id: 'd', text: 'Je pars maintenant' },
          ],
        },
        answer: { id: 'b' },
        points: 10,
      },
      {
        type: ExerciseType.LISTENING,
        prompt: 'Quel verbe au passé entends-tu ?',
        data: {
          text: 'كليت',
          lang: 'ar-MA',
          audio: 'كليت',
          options: [
            { id: 'a', text: 'كليت', transliteration: 'klit (j\'ai mangé)' },
            { id: 'b', text: 'كنكل', transliteration: 'knakol (je mange)' },
            { id: 'c', text: 'ما كليتش', transliteration: 'ma klitch (je n\'ai pas mangé)' },
            { id: 'd', text: 'غادي نكل', transliteration: 'ghadi nakol (je mangerai)' },
          ],
        },
        answer: { id: 'a' },
        points: 10,
      },
      {
        type: ExerciseType.MULTIPLE_CHOICE,
        prompt: '« ما كليتش » signifie :',
        data: {
          options: [
            { id: 'a', text: 'J\'ai mangé' },
            { id: 'b', text: 'Je mange' },
            { id: 'c', text: 'Je n\'ai pas mangé' },
            { id: 'd', text: 'Je ne mange pas' },
          ],
        },
        answer: { id: 'c' },
        points: 10,
      },
      {
        type: ExerciseType.ARABIC_KEYBOARD,
        prompt: 'Écris « nous sommes allés » en arabe',
        data: {
          target: 'مشينا',
          targetTransliteration: 'mchina',
          translation: 'nous sommes allés',
          hint: 'Verbe aller au passé, 1re pers. pluriel',
          audio: 'مشينا',
        },
        answer: { text: 'مشينا' },
        points: 15,
      },
      {
        type: ExerciseType.DRAWING,
        prompt: 'Trace « مشيت »',
        data: { target: 'مشيت', hint: 'mchit — je suis allé', threshold: 0.3 },
        answer: { value: 'مشيت' },
        points: 15,
      },
      {
        type: ExerciseType.FILL_BLANK,
        prompt: 'Complète : البارح ___ للسوق (Hier, nous sommes allés au souk)',
        data: {
          sentence: 'البارح ___ للسوق',
          options: ['مشينا', 'كنمشيو', 'غادي نمشيو', 'نمشيو'],
        },
        answer: { text: 'مشينا', translation: 'nous sommes allés', transliteration: 'mchina' },
        points: 10,
      },
      {
        type: ExerciseType.MULTIPLE_CHOICE,
        prompt: 'Comment dit-on « Hier, nous sommes allés au souk » en darija ?',
        data: {
          options: [
            { id: 'a', text: 'L-bareh mchina l-bhar' },
            { id: 'b', text: 'L-bareh mchina l-suq', transliteration: 'البارح مشينا للسوق' },
            { id: 'c', text: 'Daba mchina l-suq' },
            { id: 'd', text: 'Ghadi nemchio l-suq' },
          ],
        },
        answer: { id: 'b' },
        points: 15,
      },
    ],
  },

  // ─────────────────────────── LEÇON 3 — Le futur en darija ───────────────────────────
  {
    order: 3,
    slug: 'darija-avance-lecon-3',
    title: 'Le futur en darija',
    subtitle: 'Le préfixe غادي',
    exos: [
      {
        type: ExerciseType.MULTIPLE_CHOICE,
        prompt: '« غادي نمشي غدا » signifie :',
        data: {
          options: [
            { id: 'a', text: 'Je suis parti hier' },
            { id: 'b', text: 'Je pars maintenant' },
            { id: 'c', text: 'Je vais partir demain' },
            { id: 'd', text: 'J\'irais si je pouvais' },
          ],
        },
        answer: { id: 'c' },
        points: 10,
      },
      {
        type: ExerciseType.LISTENING,
        prompt: 'Quel futur entends-tu ?',
        data: {
          text: 'غادي نمشي',
          lang: 'ar-MA',
          audio: 'غادي نمشي',
          options: [
            { id: 'a', text: 'غادي نمشي', transliteration: 'ghadi nmchi (j\'irai)' },
            { id: 'b', text: 'كنمشي', transliteration: 'knmchi (je vais)' },
            { id: 'c', text: 'مشيت', transliteration: 'mchit (je suis allé)' },
            { id: 'd', text: 'غادية تمشي', transliteration: 'ghadia tmchi (elle ira)' },
          ],
        },
        answer: { id: 'a' },
        points: 10,
      },
      {
        type: ExerciseType.MULTIPLE_CHOICE,
        prompt: 'Pour le futur d\'une femme, on utilise :',
        data: {
          options: [
            { id: 'a', text: 'غادي + verbe' },
            { id: 'b', text: 'غادية + verbe' },
            { id: 'c', text: 'غاديين + verbe' },
            { id: 'd', text: 'كـ + verbe' },
          ],
          hint: 'Accord au féminin singulier',
        },
        answer: { id: 'b' },
        points: 10,
      },
      {
        type: ExerciseType.ARABIC_KEYBOARD,
        prompt: 'Écris « j\'irai » en arabe',
        data: {
          target: 'غادي نمشي',
          targetTransliteration: 'ghadi nmchi',
          translation: 'j\'irai',
          hint: 'Futur : ghadi + verbe',
          audio: 'غادي نمشي',
        },
        answer: { text: 'غادي نمشي' },
        points: 15,
      },
      {
        type: ExerciseType.DRAWING,
        prompt: 'Trace « غادي »',
        data: { target: 'غادي', hint: 'ghadi — marqueur du futur', threshold: 0.35 },
        answer: { value: 'غادي' },
        points: 15,
      },
      {
        type: ExerciseType.FILL_BLANK,
        prompt: 'Complète : هي ___ تقرا فالجامعة (Elle va étudier à l\'université)',
        data: {
          sentence: 'هي ___ تقرا فالجامعة',
          options: ['غادية', 'غادي', 'كـ', 'ما'],
        },
        answer: { text: 'غادية', translation: 'elle va (futur fém.)', transliteration: 'ghadia' },
        points: 10,
      },
      {
        type: ExerciseType.MULTIPLE_CHOICE,
        prompt: 'Comment dit-on « Elle va étudier à l\'université l\'année prochaine » en darija ?',
        data: {
          options: [
            { id: 'a', text: 'Hiya ghadia tqra f-jamia daba' },
            { id: 'b', text: 'Hiya ghadia tqra f-jamia l-am l-jay', transliteration: 'هي غادية تقرا فالجامعة العام الجاي' },
            { id: 'c', text: 'Hiya qrat f-jamia' },
            { id: 'd', text: 'Hiya ktqra f-jamia' },
          ],
        },
        answer: { id: 'b' },
        points: 15,
      },
    ],
  },
];

async function main() {
  console.log('📚 Refonte « Darija Avancé » (DARIJA@31)\n');

  const mod = await prisma.module.findUnique({ where: { slug: 'darija-avance' } });
  if (!mod) {
    console.error('❌ Module darija-avance introuvable.');
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
      title: 'Darija Avancé',
      subtitle: 'Fluidité et nuances',
      description: 'Maîtrise les temps verbaux, les nuances et les registres de langue pour parler comme un natif.',
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
