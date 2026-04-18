/**
 * Refonte du module "La Nourriture" (DARIJA@10, slug=la-nourriture).
 * 4 thèmes × 7 exos mixtes = 28 exos.
 *
 * Usage: npx tsx scripts/seedLaNourritureRefonte.ts
 */
import { PrismaClient, ExerciseType } from '@prisma/client';

const prisma = new PrismaClient();

const COLORS = { colorA: '#ff8a65', colorB: '#ff5722', shadowColor: '#d84315' };

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
  // ─────────────────────────── LEÇON 1 — Fruits et légumes ───────────────────────────
  {
    order: 1,
    slug: 'la-nourriture-lecon-1',
    title: 'Les fruits et légumes',
    subtitle: 'Au marché du quartier',
    exos: [
      {
        type: ExerciseType.MULTIPLE_CHOICE,
        prompt: '« التفاح » (teffah) signifie :',
        data: {
          options: [
            { id: 'a', text: 'La banane' },
            { id: 'b', text: 'La pomme' },
            { id: 'c', text: 'L\'orange' },
            { id: 'd', text: 'La poire' },
          ],
        },
        answer: { id: 'b' },
        points: 10,
      },
      {
        type: ExerciseType.LISTENING,
        prompt: 'Quel fruit entends-tu ?',
        data: {
          text: 'الموز',
          lang: 'ar-MA',
          audio: 'الموز',
          options: [
            { id: 'a', text: 'التفاح', transliteration: 'teffah (pomme)' },
            { id: 'b', text: 'الموز', transliteration: 'mouz (banane)' },
            { id: 'c', text: 'البرتقال', transliteration: 'bortqal (orange)' },
            { id: 'd', text: 'العنب', transliteration: 'aynab (raisin)' },
          ],
        },
        answer: { id: 'b' },
        points: 10,
      },
      {
        type: ExerciseType.MULTIPLE_CHOICE,
        prompt: '« الطماطم » (tomatim) signifie :',
        data: {
          options: [
            { id: 'a', text: 'Les carottes' },
            { id: 'b', text: 'Les oignons' },
            { id: 'c', text: 'Les tomates' },
            { id: 'd', text: 'Les pommes de terre' },
          ],
        },
        answer: { id: 'c' },
        points: 10,
      },
      {
        type: ExerciseType.ARABIC_KEYBOARD,
        prompt: 'Écris « la banane » en arabe',
        data: {
          target: 'الموز',
          targetTransliteration: 'l-mouz',
          translation: 'la banane',
          hint: 'Fruit jaune',
          audio: 'الموز',
        },
        answer: { text: 'الموز' },
        points: 15,
      },
      {
        type: ExerciseType.DRAWING,
        prompt: 'Trace « التفاح »',
        data: { target: 'التفاح', hint: 'teffah — la pomme', threshold: 0.3 },
        answer: { value: 'التفاح' },
        points: 15,
      },
      {
        type: ExerciseType.FILL_BLANK,
        prompt: 'Complète : واحد ___ ديال الموز، عفاك (Un kilo de bananes, s\'il vous plaît)',
        data: {
          sentence: 'واحد ___ ديال الموز، عفاك',
          options: ['كيلو', 'درهم', 'كاس', 'طبق'],
        },
        answer: { text: 'كيلو', translation: 'kilo', transliteration: 'kilo' },
        points: 10,
      },
      {
        type: ExerciseType.MULTIPLE_CHOICE,
        prompt: 'Comment dit-on « Un kilo de bananes, s\'il vous plaît » en darija ?',
        data: {
          options: [
            { id: 'a', text: 'Wahed kilo dyal l-tefah, afak' },
            { id: 'b', text: 'Juj kilo dyal l-muz' },
            { id: 'c', text: 'Wahed kilo dyal l-muz, afak', transliteration: 'واحد كيلو ديال الموز عفاك' },
            { id: 'd', text: 'Bghit l-muz' },
          ],
        },
        answer: { id: 'c' },
        points: 15,
      },
    ],
  },

  // ─────────────────────────── LEÇON 2 — Plats marocains ───────────────────────────
  {
    order: 2,
    slug: 'la-nourriture-lecon-2',
    title: 'Les plats marocains',
    subtitle: 'Tajine, couscous, pastilla',
    exos: [
      {
        type: ExerciseType.MULTIPLE_CHOICE,
        prompt: '« الطاجين » (tajine) est :',
        data: {
          options: [
            { id: 'a', text: 'Un dessert marocain' },
            { id: 'b', text: 'Un plat mijoté dans un récipient conique' },
            { id: 'c', text: 'Un type de pain' },
            { id: 'd', text: 'Une boisson' },
          ],
        },
        answer: { id: 'b' },
        points: 10,
      },
      {
        type: ExerciseType.LISTENING,
        prompt: 'Quel plat entends-tu ?',
        data: {
          text: 'الكسكس',
          lang: 'ar-MA',
          audio: 'الكسكس',
          options: [
            { id: 'a', text: 'الطاجين', transliteration: 'tajine' },
            { id: 'b', text: 'الكسكس', transliteration: 'kuskus (couscous)' },
            { id: 'c', text: 'البسطيلة', transliteration: 'bastilla' },
            { id: 'd', text: 'الحريرة', transliteration: 'harira' },
          ],
        },
        answer: { id: 'b' },
        points: 10,
      },
      {
        type: ExerciseType.MULTIPLE_CHOICE,
        prompt: '« الكسكس » (couscous) est traditionnellement mangé :',
        data: {
          options: [
            { id: 'a', text: 'Le lundi' },
            { id: 'b', text: 'Le vendredi (jour sacré)' },
            { id: 'c', text: 'Le dimanche' },
            { id: 'd', text: 'Chaque jour' },
          ],
        },
        answer: { id: 'b' },
        points: 10,
      },
      {
        type: ExerciseType.ARABIC_KEYBOARD,
        prompt: 'Écris « le tajine » en arabe',
        data: {
          target: 'الطاجين',
          targetTransliteration: 'tajine',
          translation: 'le tajine',
          hint: 'Plat emblématique du Maroc',
          audio: 'الطاجين',
        },
        answer: { text: 'الطاجين' },
        points: 15,
      },
      {
        type: ExerciseType.DRAWING,
        prompt: 'Trace « الكسكس »',
        data: { target: 'الكسكس', hint: 'kuskus — couscous', threshold: 0.3 },
        answer: { value: 'الكسكس' },
        points: 15,
      },
      {
        type: ExerciseType.MULTIPLE_CHOICE,
        prompt: '« البسطيلة » (pastilla) est :',
        data: {
          options: [
            { id: 'a', text: 'Un plat sucré-salé (feuilleté au pigeon/poulet et amandes)' },
            { id: 'b', text: 'Un plat de légumes' },
            { id: 'c', text: 'Un dessert glacé' },
            { id: 'd', text: 'Une sauce épicée' },
          ],
        },
        answer: { id: 'a' },
        points: 10,
      },
      {
        type: ExerciseType.MULTIPLE_CHOICE,
        prompt: 'Comment dit-on « Je veux un tajine de poulet » en darija ?',
        data: {
          options: [
            { id: 'a', text: 'Bghit kuskus dyal djaj' },
            { id: 'b', text: 'Bghit tajine dyal l-hhut' },
            { id: 'c', text: 'Bghit tajine dyal djaj', transliteration: 'بغيت طاجين الدجاج' },
            { id: 'd', text: 'Bghit bastilla dyal djaj' },
          ],
        },
        answer: { id: 'c' },
        points: 15,
      },
    ],
  },

  // ─────────────────────────── LEÇON 3 — Café / restaurant ───────────────────────────
  {
    order: 3,
    slug: 'la-nourriture-lecon-3',
    title: 'Au café / restaurant',
    subtitle: 'Commander et payer',
    exos: [
      {
        type: ExerciseType.MULTIPLE_CHOICE,
        prompt: '« أتاي » (atay) est :',
        data: {
          options: [
            { id: 'a', text: 'Le café marocain' },
            { id: 'b', text: 'Le thé à la menthe marocain' },
            { id: 'c', text: 'Le jus d\'orange' },
            { id: 'd', text: 'L\'eau minérale' },
          ],
        },
        answer: { id: 'b' },
        points: 10,
      },
      {
        type: ExerciseType.LISTENING,
        prompt: 'Quelle boisson entends-tu ?',
        data: {
          text: 'قهوة',
          lang: 'ar-MA',
          audio: 'قهوة',
          options: [
            { id: 'a', text: 'أتاي', transliteration: 'atay (thé)' },
            { id: 'b', text: 'قهوة', transliteration: 'qahwa (café)' },
            { id: 'c', text: 'الما', transliteration: 'ma (eau)' },
            { id: 'd', text: 'الحليب', transliteration: 'hlib (lait)' },
          ],
        },
        answer: { id: 'b' },
        points: 10,
      },
      {
        type: ExerciseType.MULTIPLE_CHOICE,
        prompt: '« الحساب عفاك » signifie :',
        data: {
          options: [
            { id: 'a', text: 'Le menu s\'il vous plaît' },
            { id: 'b', text: 'C\'est bon ?' },
            { id: 'c', text: 'L\'addition s\'il vous plaît' },
            { id: 'd', text: 'À quelle heure ouvrez-vous ?' },
          ],
        },
        answer: { id: 'c' },
        points: 10,
      },
      {
        type: ExerciseType.ARABIC_KEYBOARD,
        prompt: 'Écris « l\'addition s\'il vous plaît » en arabe',
        data: {
          target: 'الحساب عفاك',
          targetTransliteration: 'l-hsab afak',
          translation: 'l\'addition s\'il vous plaît',
          hint: 'Pour payer au café',
          audio: 'الحساب عفاك',
        },
        answer: { text: 'الحساب عفاك' },
        points: 15,
      },
      {
        type: ExerciseType.DRAWING,
        prompt: 'Trace « أتاي »',
        data: { target: 'أتاي', hint: 'atay — thé à la menthe', threshold: 0.4 },
        answer: { value: 'أتاي' },
        points: 15,
      },
      {
        type: ExerciseType.FILL_BLANK,
        prompt: 'Complète : قهوة ___ الحليب (Un café au lait)',
        data: {
          sentence: 'قهوة ___ الحليب',
          options: ['بـ', 'من', 'في', 'على'],
        },
        answer: { text: 'بـ', translation: 'avec', transliteration: 'b' },
        points: 10,
      },
      {
        type: ExerciseType.MULTIPLE_CHOICE,
        prompt: '« واش كلشي مزيان؟ » demandé par le serveur signifie :',
        data: {
          options: [
            { id: 'a', text: 'Vous voulez payer ?' },
            { id: 'b', text: 'Tout va bien ? / Vous avez apprécié ?' },
            { id: 'c', text: 'C\'est trop cher ?' },
            { id: 'd', text: 'Vous voulez autre chose ?' },
          ],
        },
        answer: { id: 'b' },
        points: 15,
      },
    ],
  },

  // ─────────────────────────── LEÇON 4 — Recettes marocaines ───────────────────────────
  {
    order: 4,
    slug: 'la-nourriture-lecon-4',
    title: 'Les recettes marocaines',
    subtitle: 'Harira, msemmen & cie',
    exos: [
      {
        type: ExerciseType.MULTIPLE_CHOICE,
        prompt: '« الحريرة » (harira) est :',
        data: {
          options: [
            { id: 'a', text: 'Un dessert marocain à la semoule' },
            { id: 'b', text: 'Une soupe marocaine (tomate, lentilles, pois chiches)' },
            { id: 'c', text: 'Un plat de riz' },
            { id: 'd', text: 'Un jus de fruit' },
          ],
        },
        answer: { id: 'b' },
        points: 10,
      },
      {
        type: ExerciseType.LISTENING,
        prompt: 'Quelle spécialité entends-tu ?',
        data: {
          text: 'المسمن',
          lang: 'ar-MA',
          audio: 'المسمن',
          options: [
            { id: 'a', text: 'الحريرة', transliteration: 'harira (soupe)' },
            { id: 'b', text: 'المسمن', transliteration: 'msemmen (pain feuilleté)' },
            { id: 'c', text: 'البغرير', transliteration: 'baghrir (crêpes)' },
            { id: 'd', text: 'الشباكية', transliteration: 'chebakiya (pâtisserie)' },
          ],
        },
        answer: { id: 'b' },
        points: 10,
      },
      {
        type: ExerciseType.MULTIPLE_CHOICE,
        prompt: '« المسمن » (msemmen) est :',
        data: {
          options: [
            { id: 'a', text: 'Un pain feuilleté carré marocain' },
            { id: 'b', text: 'Un tajine de viande' },
            { id: 'c', text: 'Une pâtisserie au miel' },
            { id: 'd', text: 'Un plat de lentilles' },
          ],
        },
        answer: { id: 'a' },
        points: 10,
      },
      {
        type: ExerciseType.ARABIC_KEYBOARD,
        prompt: 'Écris « la harira » en arabe',
        data: {
          target: 'الحريرة',
          targetTransliteration: 'l-harira',
          translation: 'la harira (soupe)',
          hint: 'Soupe traditionnelle du ramadan',
          audio: 'الحريرة',
        },
        answer: { text: 'الحريرة' },
        points: 15,
      },
      {
        type: ExerciseType.DRAWING,
        prompt: 'Trace « المسمن »',
        data: { target: 'المسمن', hint: 'msemmen — pain feuilleté', threshold: 0.3 },
        answer: { value: 'المسمن' },
        points: 15,
      },
      {
        type: ExerciseType.MULTIPLE_CHOICE,
        prompt: '« الشباكية » (chebakiya) est une pâtisserie :',
        data: {
          options: [
            { id: 'a', text: 'Salée à la viande' },
            { id: 'b', text: 'Frite, enrobée de miel et de sésame' },
            { id: 'c', text: 'Glacée à la vanille' },
            { id: 'd', text: 'Au chocolat' },
          ],
          hint: 'Très populaire pendant le ramadan',
        },
        answer: { id: 'b' },
        points: 10,
      },
      {
        type: ExerciseType.MULTIPLE_CHOICE,
        prompt: '« البغرير » (baghrir) est :',
        data: {
          options: [
            { id: 'a', text: 'Une soupe épicée' },
            { id: 'b', text: 'Un plat de poisson' },
            { id: 'c', text: 'Des crêpes à mille trous' },
            { id: 'd', text: 'Un thé glacé' },
          ],
        },
        answer: { id: 'c' },
        points: 15,
      },
    ],
  },
];

async function main() {
  console.log('🍲 Refonte « La Nourriture » (DARIJA@10)\n');

  const mod = await prisma.module.findUnique({ where: { slug: 'la-nourriture' } });
  if (!mod) {
    console.error('❌ Module la-nourriture introuvable.');
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
      title: 'La Nourriture',
      subtitle: 'Manger et boire en darija',
      description: 'Les aliments, les plats marocains typiques et comment commander au café ou restaurant.',
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
