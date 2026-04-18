/**
 * Refonte du module "Les Achats" (DARIJA@20, slug=les-achats).
 * 3 thèmes × 7 exos mixtes = 21 exos.
 *
 * Usage: npx tsx scripts/seedLesAchatsRefonte.ts
 */
import { PrismaClient, ExerciseType } from '@prisma/client';

const prisma = new PrismaClient();

const COLORS = { colorA: '#ffd54f', colorB: '#ffc107', shadowColor: '#ff8f00' };

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
  // ─────────────────────────── LEÇON 1 — Les vêtements ───────────────────────────
  {
    order: 1,
    slug: 'les-achats-lecon-1',
    title: 'Les vêtements',
    subtitle: 'Djellaba, babouches & cie',
    exos: [
      {
        type: ExerciseType.MULTIPLE_CHOICE,
        prompt: '« الجلابة » (djellaba) est :',
        data: {
          options: [
            { id: 'a', text: 'Un pantalon traditionnel' },
            { id: 'b', text: 'Une robe-manteau traditionnelle à capuche' },
            { id: 'c', text: 'Un type de chaussures' },
            { id: 'd', text: 'Un foulard de tête' },
          ],
        },
        answer: { id: 'b' },
        points: 10,
      },
      {
        type: ExerciseType.LISTENING,
        prompt: 'Quel vêtement entends-tu ?',
        data: {
          text: 'البلغة',
          lang: 'ar-MA',
          audio: 'البلغة',
          options: [
            { id: 'a', text: 'الجلابة', transliteration: 'djellaba' },
            { id: 'b', text: 'البلغة', transliteration: 'belgha (babouches)' },
            { id: 'c', text: 'القفطان', transliteration: 'qaftan' },
            { id: 'd', text: 'الطربوش', transliteration: 'tarbush (chapeau)' },
          ],
        },
        answer: { id: 'b' },
        points: 10,
      },
      {
        type: ExerciseType.MULTIPLE_CHOICE,
        prompt: '« البلغة » (belgha) désigne :',
        data: {
          options: [
            { id: 'a', text: 'Un chapeau traditionnel' },
            { id: 'b', text: 'Des babouches (pantoufles marocaines)' },
            { id: 'c', text: 'Une ceinture brodée' },
            { id: 'd', text: 'Un sac en cuir' },
          ],
        },
        answer: { id: 'b' },
        points: 10,
      },
      {
        type: ExerciseType.ARABIC_KEYBOARD,
        prompt: 'Écris « djellaba » en arabe',
        data: {
          target: 'الجلابة',
          targetTransliteration: 'j-jellaba',
          translation: 'la djellaba',
          hint: 'Robe-manteau à capuche',
          audio: 'الجلابة',
        },
        answer: { text: 'الجلابة' },
        points: 15,
      },
      {
        type: ExerciseType.DRAWING,
        prompt: 'Trace « البلغة »',
        data: { target: 'البلغة', hint: 'belgha — babouches', threshold: 0.3 },
        answer: { value: 'البلغة' },
        points: 15,
      },
      {
        type: ExerciseType.FILL_BLANK,
        prompt: 'Complète : كنقلب على ___ نمرة M (Je cherche une djellaba en taille M)',
        data: {
          sentence: 'كنقلب على ___ نمرة M',
          options: ['جلابة', 'بلغة', 'قفطان', 'طربوش'],
        },
        answer: { text: 'جلابة', translation: 'djellaba', transliteration: 'djellaba' },
        points: 10,
      },
      {
        type: ExerciseType.MULTIPLE_CHOICE,
        prompt: 'Comment dit-on « Je cherche une djellaba en taille M » en darija ?',
        data: {
          options: [
            { id: 'a', text: 'Bghit djellaba nummra M' },
            { id: 'b', text: 'Knqalb ela djellaba nummra M', transliteration: 'كنقلب على جلابة نمرة M' },
            { id: 'c', text: 'Fin djellaba nummra M' },
            { id: 'd', text: 'Djellaba nummra M mojouda' },
          ],
        },
        answer: { id: 'b' },
        points: 15,
      },
    ],
  },

  // ─────────────────────────── LEÇON 2 — Négocier au souk ───────────────────────────
  {
    order: 2,
    slug: 'les-achats-lecon-2',
    title: 'Négocier au souk',
    subtitle: 'Marchander un prix',
    exos: [
      {
        type: ExerciseType.MULTIPLE_CHOICE,
        prompt: '« هاد الثمن غالي بزاف » signifie :',
        data: {
          options: [
            { id: 'a', text: 'Ce prix est très bon marché' },
            { id: 'b', text: 'Ce prix est trop cher' },
            { id: 'c', text: 'Quel est le prix ?' },
            { id: 'd', text: 'Je prends ça' },
          ],
        },
        answer: { id: 'b' },
        points: 10,
      },
      {
        type: ExerciseType.LISTENING,
        prompt: 'Quelle phrase de négociation entends-tu ?',
        data: {
          text: 'آخر ثمن',
          lang: 'ar-MA',
          audio: 'آخر ثمن',
          options: [
            { id: 'a', text: 'آخر ثمن', transliteration: 'akher thaman (dernier prix)' },
            { id: 'b', text: 'غالي بزاف', transliteration: 'ghali bezaf (trop cher)' },
            { id: 'c', text: 'نقص شوية', transliteration: 'nqos chwiya (baisse un peu)' },
            { id: 'd', text: 'بشحال هدا', transliteration: 'b-chhal hada (combien ?)' },
          ],
        },
        answer: { id: 'a' },
        points: 10,
      },
      {
        type: ExerciseType.MULTIPLE_CHOICE,
        prompt: '« أعطيني بـ مية درهم » signifie :',
        data: {
          options: [
            { id: 'a', text: 'Montre-moi pour 100 dirhams' },
            { id: 'b', text: 'Donne-moi ça pour 100 dirhams' },
            { id: 'c', text: 'J\'ai 100 dirhams seulement' },
            { id: 'd', text: 'Le prix est de 100 dirhams' },
          ],
        },
        answer: { id: 'b' },
        points: 10,
      },
      {
        type: ExerciseType.ARABIC_KEYBOARD,
        prompt: 'Écris « trop cher » en arabe',
        data: {
          target: 'غالي بزاف',
          targetTransliteration: 'ghali bezaf',
          translation: 'trop cher',
          hint: 'Protester contre un prix',
          audio: 'غالي بزاف',
        },
        answer: { text: 'غالي بزاف' },
        points: 15,
      },
      {
        type: ExerciseType.DRAWING,
        prompt: 'Trace « آخر ثمن »',
        data: { target: 'آخر ثمن', hint: 'akher thaman — dernier prix', threshold: 0.25 },
        answer: { value: 'آخر ثمن' },
        points: 15,
      },
      {
        type: ExerciseType.MULTIPLE_CHOICE,
        prompt: '« آخر ثمن؟ » (akher thaman?) signifie :',
        data: {
          options: [
            { id: 'a', text: 'C\'est quel prix ?' },
            { id: 'b', text: 'C\'est ton dernier prix ?' },
            { id: 'c', text: 'Tu baisses le prix ?' },
            { id: 'd', text: 'Le prix d\'avant ?' },
          ],
        },
        answer: { id: 'b' },
        points: 10,
      },
      {
        type: ExerciseType.MULTIPLE_CHOICE,
        prompt: 'Comment dit-on « Je t\'en donne 80, c\'est mon dernier prix » en darija ?',
        data: {
          options: [
            { id: 'a', text: 'Natik b-sebaine, hada akher thaman' },
            { id: 'b', text: 'Natik b-tmanin, hada akher thaman andi', transliteration: 'نعطيك بتمانين، هدا آخر ثمن عندي' },
            { id: 'c', text: 'Bghit b-tmanin' },
            { id: 'd', text: 'Tmanin hada ghali' },
          ],
        },
        answer: { id: 'b' },
        points: 15,
      },
    ],
  },

  // ─────────────────────────── LEÇON 3 — En boutique ───────────────────────────
  {
    order: 3,
    slug: 'les-achats-lecon-3',
    title: 'En boutique',
    subtitle: 'Essayer, payer, rendre',
    exos: [
      {
        type: ExerciseType.MULTIPLE_CHOICE,
        prompt: '« واش يمكن نقيس؟ » signifie :',
        data: {
          options: [
            { id: 'a', text: 'Je peux regarder ?' },
            { id: 'b', text: 'Je peux essayer ?' },
            { id: 'c', text: 'Je peux payer ?' },
            { id: 'd', text: 'Je peux partir ?' },
          ],
        },
        answer: { id: 'b' },
        points: 10,
      },
      {
        type: ExerciseType.LISTENING,
        prompt: 'Quelle question entends-tu ?',
        data: {
          text: 'كاين بالكارط',
          lang: 'ar-MA',
          audio: 'كاين بالكارط',
          options: [
            { id: 'a', text: 'كاين بالكارط', transliteration: 'kayn b-karta (par carte ?)' },
            { id: 'b', text: 'كاين بالكاش', transliteration: 'kayn b-cash' },
            { id: 'c', text: 'كاين تخفيض', transliteration: 'kayn takhfid (réduction ?)' },
            { id: 'd', text: 'واش يمكن نبدل', transliteration: 'wach ymkn nbadl (échanger ?)' },
          ],
        },
        answer: { id: 'a' },
        points: 10,
      },
      {
        type: ExerciseType.MULTIPLE_CHOICE,
        prompt: '« كاين تخفيض؟ » signifie :',
        data: {
          options: [
            { id: 'a', text: 'Y a-t-il une promo / réduction ?' },
            { id: 'b', text: 'Puis-je payer plus tard ?' },
            { id: 'c', text: 'Vous avez ma taille ?' },
            { id: 'd', text: 'C\'est neuf ?' },
          ],
        },
        answer: { id: 'a' },
        points: 10,
      },
      {
        type: ExerciseType.ARABIC_KEYBOARD,
        prompt: 'Écris « je peux essayer ? » en arabe',
        data: {
          target: 'واش يمكن نقيس',
          targetTransliteration: 'wach ymkn nqis',
          translation: 'je peux essayer ?',
          hint: 'Demande de cabine d\'essayage',
          audio: 'واش يمكن نقيس',
        },
        answer: { text: 'واش يمكن نقيس' },
        points: 15,
      },
      {
        type: ExerciseType.DRAWING,
        prompt: 'Trace « تخفيض »',
        data: { target: 'تخفيض', hint: 'takhfid — réduction', threshold: 0.3 },
        answer: { value: 'تخفيض' },
        points: 15,
      },
      {
        type: ExerciseType.FILL_BLANK,
        prompt: 'Complète : واش يمكن ___ بالكارط؟ (Je peux payer par carte ?)',
        data: {
          sentence: 'واش يمكن ___ بالكارط؟',
          options: ['نخلص', 'نقيس', 'نبدل', 'نرجع'],
        },
        answer: { text: 'نخلص', translation: 'payer', transliteration: 'nkhalles' },
        points: 10,
      },
      {
        type: ExerciseType.MULTIPLE_CHOICE,
        prompt: 'Comment dit-on « Je prends ça » en darija ?',
        data: {
          options: [
            { id: 'a', text: 'Ana chri hada' },
            { id: 'b', text: 'Ghadi nakhodh hada', transliteration: 'غادي ناخد هدا' },
            { id: 'c', text: 'Mzyan hada' },
            { id: 'd', text: 'Ma bghit hada' },
          ],
        },
        answer: { id: 'b' },
        points: 15,
      },
    ],
  },
];

async function main() {
  console.log('🛍️  Refonte « Les Achats » (DARIJA@20)\n');

  const mod = await prisma.module.findUnique({ where: { slug: 'les-achats' } });
  if (!mod) {
    console.error('❌ Module les-achats introuvable.');
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
      title: 'Les Achats',
      subtitle: 'Au souk et en boutique',
      description: 'Faire du shopping, négocier les prix et parler de vêtements en darija.',
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
