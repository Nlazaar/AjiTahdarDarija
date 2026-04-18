/**
 * Refonte du module "Les Chiffres" (DARIJA@4, slug=les-chiffres).
 * 4 thèmes × 7 exos mixtes = 28 exos.
 *
 * Usage: npx tsx scripts/seedLesChiffresRefonte.ts
 */
import { PrismaClient, ExerciseType } from '@prisma/client';

const prisma = new PrismaClient();

const COLORS = { colorA: '#7986cb', colorB: '#5c6bc0', shadowColor: '#3f51b5' };

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
  // ─────────────────────────── LEÇON 1 — 1 à 10 ───────────────────────────
  {
    order: 1,
    slug: 'les-chiffres-lecon-1',
    title: '1 à 10',
    subtitle: 'Les chiffres de base',
    exos: [
      {
        type: ExerciseType.MULTIPLE_CHOICE,
        prompt: 'Comment dit-on « 5 » en darija ?',
        data: {
          options: [
            { id: 'a', text: 'ربعة (rbaa)' },
            { id: 'b', text: 'خمسة (khamsa)' },
            { id: 'c', text: 'ستة (stta)' },
            { id: 'd', text: 'سبعة (sebaa)' },
          ],
        },
        answer: { id: 'b' },
        points: 10,
      },
      {
        type: ExerciseType.LISTENING,
        prompt: 'Quel chiffre entends-tu ?',
        data: {
          text: 'تلاتة',
          lang: 'ar-MA',
          audio: 'تلاتة',
          options: [
            { id: 'a', text: 'جوج', transliteration: 'juj (2)' },
            { id: 'b', text: 'تلاتة', transliteration: 'tlata (3)' },
            { id: 'c', text: 'ربعة', transliteration: 'rbaa (4)' },
            { id: 'd', text: 'خمسة', transliteration: 'khamsa (5)' },
          ],
        },
        answer: { id: 'b' },
        points: 10,
      },
      {
        type: ExerciseType.MULTIPLE_CHOICE,
        prompt: '« تلاتة » (tlata) correspond à :',
        data: {
          options: [
            { id: 'a', text: '2' },
            { id: 'b', text: '3' },
            { id: 'c', text: '4' },
            { id: 'd', text: '6' },
          ],
        },
        answer: { id: 'b' },
        points: 10,
      },
      {
        type: ExerciseType.ARABIC_KEYBOARD,
        prompt: 'Écris « sept » (7) en arabe',
        data: {
          target: 'سبعة',
          targetTransliteration: 'sebaa',
          translation: 'sept',
          hint: 'Le chiffre 7',
          audio: 'سبعة',
        },
        answer: { text: 'سبعة' },
        points: 15,
      },
      {
        type: ExerciseType.DRAWING,
        prompt: 'Trace « خمسة »',
        data: { target: 'خمسة', hint: 'khamsa — cinq (5)', threshold: 0.35 },
        answer: { value: 'خمسة' },
        points: 15,
      },
      {
        type: ExerciseType.REORDER,
        prompt: 'Mets ces chiffres dans l\'ordre croissant',
        data: {
          items: [
            { text: 'خمسة', value: 5 },
            { text: 'واحد', value: 1 },
            { text: 'تمنية', value: 8 },
            { text: 'تلاتة', value: 3 },
            { text: 'عشرة', value: 10 },
          ],
        },
        answer: { order: [1, 3, 5, 8, 10] },
        points: 15,
      },
      {
        type: ExerciseType.MULTIPLE_CHOICE,
        prompt: 'Comment dit-on « 7 » en darija ?',
        data: {
          options: [
            { id: 'a', text: 'Sitta' },
            { id: 'b', text: 'Tmanya' },
            { id: 'c', text: 'Sebaa', transliteration: 'سبعة' },
            { id: 'd', text: 'Tisaa' },
          ],
        },
        answer: { id: 'c' },
        points: 15,
      },
    ],
  },

  // ─────────────────────────── LEÇON 2 — 11 à 20 ───────────────────────────
  {
    order: 2,
    slug: 'les-chiffres-lecon-2',
    title: '11 à 20',
    subtitle: 'Les nombres « -ṭach »',
    exos: [
      {
        type: ExerciseType.MULTIPLE_CHOICE,
        prompt: '« حداش » (hdach) correspond à :',
        data: {
          options: [
            { id: 'a', text: '10' },
            { id: 'b', text: '11' },
            { id: 'c', text: '12' },
            { id: 'd', text: '21' },
          ],
        },
        answer: { id: 'b' },
        points: 10,
      },
      {
        type: ExerciseType.LISTENING,
        prompt: 'Quel nombre entends-tu ?',
        data: {
          text: 'خمسطاش',
          lang: 'ar-MA',
          audio: 'خمسطاش',
          options: [
            { id: 'a', text: 'خمسة', transliteration: 'khamsa (5)' },
            { id: 'b', text: 'خمسطاش', transliteration: 'khomstach (15)' },
            { id: 'c', text: 'خمسين', transliteration: 'khamsine (50)' },
            { id: 'd', text: 'خمسة وعشرين', transliteration: 'khamsa w-achrine (25)' },
          ],
        },
        answer: { id: 'b' },
        points: 10,
      },
      {
        type: ExerciseType.MULTIPLE_CHOICE,
        prompt: 'Comment dit-on « 15 » en darija ?',
        data: {
          options: [
            { id: 'a', text: 'خمسطاش (khomstach)' },
            { id: 'b', text: 'خمسة وعشرين' },
            { id: 'c', text: 'عشرة وخمسة' },
            { id: 'd', text: 'ربعطاش' },
          ],
        },
        answer: { id: 'a' },
        points: 10,
      },
      {
        type: ExerciseType.ARABIC_KEYBOARD,
        prompt: 'Écris « douze » (12) en arabe',
        data: {
          target: 'طناش',
          targetTransliteration: 'tnach',
          translation: 'douze',
          hint: 'Le nombre 12',
          audio: 'طناش',
        },
        answer: { text: 'طناش' },
        points: 15,
      },
      {
        type: ExerciseType.DRAWING,
        prompt: 'Trace « عشرين »',
        data: { target: 'عشرين', hint: 'achrine — vingt (20)', threshold: 0.35 },
        answer: { value: 'عشرين' },
        points: 15,
      },
      {
        type: ExerciseType.REORDER,
        prompt: 'Mets ces nombres dans l\'ordre croissant',
        data: {
          items: [
            { text: 'عشرين', value: 20 },
            { text: 'حداش', value: 11 },
            { text: 'طناش', value: 12 },
            { text: 'خمسطاش', value: 15 },
            { text: 'تمنطاش', value: 18 },
          ],
        },
        answer: { order: [11, 12, 15, 18, 20] },
        points: 15,
      },
      {
        type: ExerciseType.MULTIPLE_CHOICE,
        prompt: '« عشرين » (achrine) correspond à :',
        data: {
          options: [
            { id: 'a', text: '12' },
            { id: 'b', text: '18' },
            { id: 'c', text: '20' },
            { id: 'd', text: '22' },
          ],
        },
        answer: { id: 'c' },
        points: 15,
      },
    ],
  },

  // ─────────────────────────── LEÇON 3 — Les dizaines et plus ───────────────────────────
  {
    order: 3,
    slug: 'les-chiffres-lecon-3',
    title: 'Les dizaines',
    subtitle: 'De 30 à 1000',
    exos: [
      {
        type: ExerciseType.MULTIPLE_CHOICE,
        prompt: '« خمسين » (khamsine) correspond à :',
        data: {
          options: [
            { id: 'a', text: '15' },
            { id: 'b', text: '40' },
            { id: 'c', text: '50' },
            { id: 'd', text: '55' },
          ],
        },
        answer: { id: 'c' },
        points: 10,
      },
      {
        type: ExerciseType.LISTENING,
        prompt: 'Quel nombre entends-tu ?',
        data: {
          text: 'مية',
          lang: 'ar-MA',
          audio: 'مية',
          options: [
            { id: 'a', text: 'مية', transliteration: 'miya (100)' },
            { id: 'b', text: 'ألف', transliteration: 'alf (1000)' },
            { id: 'c', text: 'عشرة', transliteration: 'achra (10)' },
            { id: 'd', text: 'تسعين', transliteration: 'tisaine (90)' },
          ],
        },
        answer: { id: 'a' },
        points: 10,
      },
      {
        type: ExerciseType.MULTIPLE_CHOICE,
        prompt: 'Comment dit-on « 37 » en darija ?',
        data: {
          options: [
            { id: 'a', text: 'Sebaa w-arbaine' },
            { id: 'b', text: 'Sebaa w-tlatine', transliteration: 'سبعة وتلاتين' },
            { id: 'c', text: 'Tlatine w-sebaa' },
            { id: 'd', text: 'Sitta w-tlatine' },
          ],
        },
        answer: { id: 'b' },
        points: 10,
      },
      {
        type: ExerciseType.ARABIC_KEYBOARD,
        prompt: 'Écris « cent » (100) en arabe',
        data: {
          target: 'مية',
          targetTransliteration: 'miya',
          translation: 'cent',
          hint: 'Le nombre 100',
          audio: 'مية',
        },
        answer: { text: 'مية' },
        points: 15,
      },
      {
        type: ExerciseType.DRAWING,
        prompt: 'Trace « ألف »',
        data: { target: 'ألف', hint: 'alf — mille (1000)', threshold: 0.45 },
        answer: { value: 'ألف' },
        points: 15,
      },
      {
        type: ExerciseType.FILL_BLANK,
        prompt: 'Complète : سبعة ___ تلاتين (37)',
        data: {
          sentence: 'سبعة ___ تلاتين',
          options: ['و', 'في', 'من', 'على'],
        },
        answer: { text: 'و', translation: 'et', transliteration: 'w' },
        points: 10,
      },
      {
        type: ExerciseType.MULTIPLE_CHOICE,
        prompt: '« مية » (miya) correspond à :',
        data: {
          options: [
            { id: 'a', text: '10' },
            { id: 'b', text: '100' },
            { id: 'c', text: '1000' },
            { id: 'd', text: '90' },
          ],
        },
        answer: { id: 'b' },
        points: 15,
      },
    ],
  },

  // ─────────────────────────── LEÇON 4 — Les prix au marché ───────────────────────────
  {
    order: 4,
    slug: 'les-chiffres-lecon-4',
    title: 'Les prix au marché',
    subtitle: 'Négocier et demander un prix',
    exos: [
      {
        type: ExerciseType.MULTIPLE_CHOICE,
        prompt: '« بشحال هدا؟ » signifie :',
        data: {
          options: [
            { id: 'a', text: 'C\'est quoi ça ?' },
            { id: 'b', text: 'Combien ça coûte ?' },
            { id: 'c', text: 'Tu veux ça ?' },
            { id: 'd', text: 'C\'est bon ?' },
          ],
        },
        answer: { id: 'b' },
        points: 10,
      },
      {
        type: ExerciseType.LISTENING,
        prompt: 'Quelle phrase entends-tu ?',
        data: {
          text: 'غالي بزاف',
          lang: 'ar-MA',
          audio: 'غالي بزاف',
          options: [
            { id: 'a', text: 'غالي بزاف', transliteration: 'ghali bezaf (trop cher)' },
            { id: 'b', text: 'رخيص بزاف', transliteration: 'rkhis bezaf (très bon marché)' },
            { id: 'c', text: 'نقص شوية', transliteration: 'nqos chwiya (baisse un peu)' },
            { id: 'd', text: 'بشحال هدا', transliteration: 'b-chhal hada (combien ?)' },
          ],
        },
        answer: { id: 'a' },
        points: 10,
      },
      {
        type: ExerciseType.MULTIPLE_CHOICE,
        prompt: '« غالي بزاف » signifie :',
        data: {
          options: [
            { id: 'a', text: 'Très bon marché' },
            { id: 'b', text: 'Trop cher' },
            { id: 'c', text: 'Prix correct' },
            { id: 'd', text: 'Gratuit' },
          ],
        },
        answer: { id: 'b' },
        points: 10,
      },
      {
        type: ExerciseType.ARABIC_KEYBOARD,
        prompt: 'Écris « combien ça coûte ? » en arabe',
        data: {
          target: 'بشحال هدا',
          targetTransliteration: 'b-chhal hada',
          translation: 'combien ça coûte ?',
          hint: 'Question de prix',
          audio: 'بشحال هدا',
        },
        answer: { text: 'بشحال هدا' },
        points: 15,
      },
      {
        type: ExerciseType.DRAWING,
        prompt: 'Trace « درهم »',
        data: { target: 'درهم', hint: 'dirham — unité monétaire', threshold: 0.35 },
        answer: { value: 'درهم' },
        points: 15,
      },
      {
        type: ExerciseType.FILL_BLANK,
        prompt: 'Complète : هدا ___ خمسين درهم (C\'est 50 dirhams)',
        data: {
          sentence: 'هدا ___ خمسين درهم',
          options: ['بـ', 'من', 'في', 'على'],
        },
        answer: { text: 'بـ', translation: 'pour / à (prix)', transliteration: 'b' },
        points: 10,
      },
      {
        type: ExerciseType.MULTIPLE_CHOICE,
        prompt: '« نقص شوية » signifie :',
        data: {
          options: [
            { id: 'a', text: 'Ajoute un peu' },
            { id: 'b', text: 'C\'est exact' },
            { id: 'c', text: 'Baisse un peu le prix' },
            { id: 'd', text: 'Non merci' },
          ],
        },
        answer: { id: 'c' },
        points: 15,
      },
    ],
  },
];

async function main() {
  console.log('🔢 Refonte « Les Chiffres » (DARIJA@4)\n');

  const mod = await prisma.module.findUnique({ where: { slug: 'les-chiffres' } });
  if (!mod) {
    console.error('❌ Module les-chiffres introuvable.');
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
      title: 'Les Chiffres',
      subtitle: 'Compter en Darija',
      description: 'De 1 à 1000 : les nombres en darija marocain et leurs utilisations pratiques.',
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
    console.log(`   ✓ [${t.order}] ${t.title.padEnd(24)} ${t.exos.length} exos`);
  }

  console.log(`\n✅ Terminé : ${THEMES.length} leçons, ${totalExos} exercices.\n`);
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error('❌ Erreur :', e);
  process.exit(1);
});
