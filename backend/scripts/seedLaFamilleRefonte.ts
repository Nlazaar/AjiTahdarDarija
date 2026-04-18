/**
 * Refonte du module "La Famille" (DARIJA@3, slug=la-famille).
 * 3 thèmes × 7 exos mixtes = 21 exos.
 *
 * Usage: npx tsx scripts/seedLaFamilleRefonte.ts
 */
import { PrismaClient, ExerciseType } from '@prisma/client';

const prisma = new PrismaClient();

const COLORS = { colorA: '#ef6c7f', colorB: '#e91e63', shadowColor: '#c2185b' };

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
  // ─────────────────────────── LEÇON 1 — La famille proche ───────────────────────────
  {
    order: 1,
    slug: 'la-famille-lecon-1',
    title: 'La famille proche',
    subtitle: 'Père, mère, frères et sœurs',
    exos: [
      {
        type: ExerciseType.MULTIPLE_CHOICE,
        prompt: '« بابا » (baba) signifie :',
        data: {
          options: [
            { id: 'a', text: 'Mère' },
            { id: 'b', text: 'Père' },
            { id: 'c', text: 'Grand-père' },
            { id: 'd', text: 'Oncle' },
          ],
        },
        answer: { id: 'b' },
        points: 10,
      },
      {
        type: ExerciseType.LISTENING,
        prompt: 'Quel mot entends-tu ?',
        data: {
          text: 'ماما',
          lang: 'ar-MA',
          audio: 'ماما',
          options: [
            { id: 'a', text: 'بابا', transliteration: 'baba (père)' },
            { id: 'b', text: 'ماما', transliteration: 'mama (mère)' },
            { id: 'c', text: 'خويا', transliteration: 'khouya (mon frère)' },
            { id: 'd', text: 'أختي', transliteration: 'ukhti (ma sœur)' },
          ],
        },
        answer: { id: 'b' },
        points: 10,
      },
      {
        type: ExerciseType.MULTIPLE_CHOICE,
        prompt: '« أختي » (ukhti) signifie :',
        data: {
          options: [
            { id: 'a', text: 'Mon frère' },
            { id: 'b', text: 'Ma cousine' },
            { id: 'c', text: 'Ma sœur' },
            { id: 'd', text: 'Ma mère' },
          ],
        },
        answer: { id: 'c' },
        points: 10,
      },
      {
        type: ExerciseType.ARABIC_KEYBOARD,
        prompt: 'Écris « mon frère » en arabe',
        data: {
          target: 'خويا',
          targetTransliteration: 'khouya',
          translation: 'mon frère',
          hint: 'Famille proche',
          audio: 'خويا',
        },
        answer: { text: 'خويا' },
        points: 15,
      },
      {
        type: ExerciseType.DRAWING,
        prompt: 'Trace « بابا »',
        data: { target: 'بابا', hint: 'baba — père', threshold: 0.45 },
        answer: { value: 'بابا' },
        points: 15,
      },
      {
        type: ExerciseType.FILL_BLANK,
        prompt: 'Complète : عندي جوج ___ وأخت واحدة (J\'ai deux frères et une sœur)',
        data: {
          sentence: 'عندي جوج ___ وأخت واحدة',
          options: ['خاوة', 'بنات', 'أولاد', 'عمام'],
        },
        answer: { text: 'خاوة', translation: 'frères', transliteration: 'khawa' },
        points: 10,
      },
      {
        type: ExerciseType.MULTIPLE_CHOICE,
        prompt: '« جدتي » (jaddati) signifie :',
        data: {
          options: [
            { id: 'a', text: 'Ma grand-mère' },
            { id: 'b', text: 'Ma tante' },
            { id: 'c', text: 'Ma cousine' },
            { id: 'd', text: 'Ma belle-mère' },
          ],
        },
        answer: { id: 'a' },
        points: 15,
      },
    ],
  },

  // ─────────────────────────── LEÇON 2 — La famille élargie ───────────────────────────
  {
    order: 2,
    slug: 'la-famille-lecon-2',
    title: 'La famille élargie',
    subtitle: 'Oncles, tantes et cousins',
    exos: [
      {
        type: ExerciseType.MULTIPLE_CHOICE,
        prompt: '« عمي » (ammi) signifie :',
        data: {
          options: [
            { id: 'a', text: 'Mon grand-père paternel' },
            { id: 'b', text: 'Mon oncle paternel (frère du père)' },
            { id: 'c', text: 'Mon oncle maternel (frère de la mère)' },
            { id: 'd', text: 'Mon beau-père' },
          ],
        },
        answer: { id: 'b' },
        points: 10,
      },
      {
        type: ExerciseType.LISTENING,
        prompt: 'Quel mot entends-tu ?',
        data: {
          text: 'خالي',
          lang: 'ar-MA',
          audio: 'خالي',
          options: [
            { id: 'a', text: 'عمي', transliteration: 'ammi (oncle paternel)' },
            { id: 'b', text: 'خالي', transliteration: 'khali (oncle maternel)' },
            { id: 'c', text: 'جدي', transliteration: 'jaddi (grand-père)' },
            { id: 'd', text: 'عمتي', transliteration: 'ammti (tante paternelle)' },
          ],
        },
        answer: { id: 'b' },
        points: 10,
      },
      {
        type: ExerciseType.MULTIPLE_CHOICE,
        prompt: '« خالي » (khali) signifie :',
        data: {
          options: [
            { id: 'a', text: 'Mon oncle paternel' },
            { id: 'b', text: 'Mon oncle maternel (frère de la mère)' },
            { id: 'c', text: 'Mon cousin' },
            { id: 'd', text: 'Mon beau-frère' },
          ],
        },
        answer: { id: 'b' },
        points: 10,
      },
      {
        type: ExerciseType.ARABIC_KEYBOARD,
        prompt: 'Écris « mon oncle paternel » en arabe',
        data: {
          target: 'عمي',
          targetTransliteration: 'ammi',
          translation: 'mon oncle paternel',
          hint: 'Frère du père',
          audio: 'عمي',
        },
        answer: { text: 'عمي' },
        points: 15,
      },
      {
        type: ExerciseType.DRAWING,
        prompt: 'Trace « خالي »',
        data: { target: 'خالي', hint: 'khali — oncle maternel', threshold: 0.45 },
        answer: { value: 'خالي' },
        points: 15,
      },
      {
        type: ExerciseType.FILL_BLANK,
        prompt: 'Complète : ___ عمي سميتو كريم (Le fils de mon oncle s\'appelle Karim)',
        data: {
          sentence: '___ عمي سميتو كريم',
          options: ['ولد', 'بنت', 'خو', 'أخت'],
        },
        answer: { text: 'ولد', translation: 'fils', transliteration: 'weld' },
        points: 10,
      },
      {
        type: ExerciseType.MULTIPLE_CHOICE,
        prompt: 'Comment dit-on « Mon cousin s\'appelle Karim » en darija ?',
        data: {
          options: [
            { id: 'a', text: 'Smit weld ammi Karim' },
            { id: 'b', text: 'Weld ammi smitu Karim', transliteration: 'ولد عمي سميتو كريم' },
            { id: 'c', text: 'Karim weld ammi' },
            { id: 'd', text: 'Ammi Karim weldu' },
          ],
        },
        answer: { id: 'b' },
        points: 15,
      },
    ],
  },

  // ─────────────────────────── LEÇON 3 — Parler de sa famille ───────────────────────────
  {
    order: 3,
    slug: 'la-famille-lecon-3',
    title: 'Parler de sa famille',
    subtitle: 'Taille, enfants, situation',
    exos: [
      {
        type: ExerciseType.MULTIPLE_CHOICE,
        prompt: '« عائلتي كبيرة » signifie :',
        data: {
          options: [
            { id: 'a', text: 'Ma famille est petite' },
            { id: 'b', text: 'Ma famille est grande (nombreuse)' },
            { id: 'c', text: 'Ma famille est riche' },
            { id: 'd', text: 'Ma famille est proche' },
          ],
        },
        answer: { id: 'b' },
        points: 10,
      },
      {
        type: ExerciseType.LISTENING,
        prompt: 'Quelle phrase entends-tu ?',
        data: {
          text: 'واش عندك أولاد',
          lang: 'ar-MA',
          audio: 'واش عندك أولاد',
          options: [
            { id: 'a', text: 'واش عندك أولاد', transliteration: 'wach andk wlad' },
            { id: 'b', text: 'واش عندك إخوة', transliteration: 'wach andk ikhwa' },
            { id: 'c', text: 'واش أنت متزوج', transliteration: 'wach nta mtzawwaj' },
            { id: 'd', text: 'واش عندك عائلة', transliteration: 'wach andk 3a\'ila' },
          ],
        },
        answer: { id: 'a' },
        points: 10,
      },
      {
        type: ExerciseType.MULTIPLE_CHOICE,
        prompt: '« واش عندك أولاد؟ » signifie :',
        data: {
          options: [
            { id: 'a', text: 'Tu as des parents ?' },
            { id: 'b', text: 'Tu as des enfants ?' },
            { id: 'c', text: 'Tu es marié(e) ?' },
            { id: 'd', text: 'Tu vis avec ta famille ?' },
          ],
        },
        answer: { id: 'b' },
        points: 10,
      },
      {
        type: ExerciseType.ARABIC_KEYBOARD,
        prompt: 'Écris « Je suis marié » en arabe',
        data: {
          target: 'أنا متزوج',
          targetTransliteration: 'ana mtzawwaj',
          translation: 'Je suis marié',
          hint: 'Situation familiale',
          audio: 'أنا متزوج',
        },
        answer: { text: 'أنا متزوج' },
        points: 15,
      },
      {
        type: ExerciseType.DRAWING,
        prompt: 'Trace « أولاد »',
        data: { target: 'أولاد', hint: 'wlad — enfants', threshold: 0.35 },
        answer: { value: 'أولاد' },
        points: 15,
      },
      {
        type: ExerciseType.FILL_BLANK,
        prompt: 'Complète : عندي تلاتة ديال ___ (J\'ai trois enfants)',
        data: {
          sentence: 'عندي تلاتة ديال ___',
          options: ['الأولاد', 'الخاوة', 'البنات', 'العمام'],
        },
        answer: { text: 'الأولاد', translation: 'les enfants', transliteration: 'l-wlad' },
        points: 10,
      },
      {
        type: ExerciseType.MULTIPLE_CHOICE,
        prompt: 'Comment dit-on « Je suis marié et j\'ai trois enfants » en darija ?',
        data: {
          options: [
            { id: 'a', text: 'Ana mtzawwaj w-andi juj dyal l-wlad' },
            { id: 'b', text: 'Ana mtzawwaj w-andi tlata dyal l-wlad', transliteration: 'أنا متزوج وعندي تلاتة ديال الأولاد' },
            { id: 'c', text: 'Ana weḥdi w-andi tlata dyal l-wlad' },
            { id: 'd', text: 'Mtzawwaj ana w-andi rbʿa dyal l-wlad' },
          ],
        },
        answer: { id: 'b' },
        points: 15,
      },
    ],
  },
];

async function main() {
  console.log('👨‍👩‍👧 Refonte « La Famille » (DARIJA@3)\n');

  const mod = await prisma.module.findUnique({ where: { slug: 'la-famille' } });
  if (!mod) {
    console.error('❌ Module la-famille introuvable.');
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
      title: 'La Famille',
      subtitle: 'Liens et relations',
      description: 'Parler de ta famille, des relations proches et élargies en darija.',
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
