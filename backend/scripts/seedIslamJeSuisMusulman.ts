/**
 * Seed Section 1 du Livre Islam : « أَنَا مُسْلِم — Je suis musulman »
 *   - 3 leçons (pp. 1-6 du livre source)
 *   - 4 exercices (SelectionImages, RelierParTrait, SelectionImages, TriDeuxCategories)
 *   - Vocabulaire : ana muslim, uhibbu Llah, etc.
 *
 * Idempotent : ré-exécutable sans dupliquer.
 *   ts-node backend/scripts/seedIslamJeSuisMusulman.ts
 */
import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

const MODULE_SLUG = 'islam-je-suis-musulman';

const MODULE_DATA = {
  title: 'Je suis musulman',
  titleAr: 'أَنَا مُسْلِم',
  subtitle: 'Découvrir Allah et ce qu\'Il a créé',
  description: 'Je suis musulman, j\'aime Allah, je découvre tout ce qu\'Il a créé.',
  level: 1,
  track: 'RELIGION' as const,
  canonicalOrder: 0,
  isPublished: true,
  colorA: '#7c3aed',
  colorB: '#a855f7',
  shadowColor: '#5b21b6',
  cityName: 'Je suis musulman',
  cityNameAr: 'أَنَا مُسْلِم',
  emoji: '☪️',
  photoCaption: 'Je suis musulman',
  cityInfo: {
    emoji: '☪️',
    coverTitle: 'أَنَا مُسْلِم',
    coverSubtitle: 'Je suis musulman',
    coverEmojis: ['🌙', '🏮', '📗', '🕋', '🕌', '📿'],
    description: 'Découvre Allah, ce qu\'Il a créé, et les actions qu\'Il aime.',
  },
};

type V = { word: string; transliteration: string; fr: string };

const VOCAB_LEC1: V[] = [
  { word: 'أَنَا مُسْلِم',  transliteration: 'ana muslim',     fr: 'Je suis musulman' },
  { word: 'أُحِبُّ اللهَ',  transliteration: 'uhibbu Llah',    fr: 'J\'aime Allah' },
  { word: 'اللهُ خَلَقَ',   transliteration: 'Allahu khalaqa', fr: 'Allah a créé' },
  { word: 'الحَيَوَانَات', transliteration: 'al-hayawanat',  fr: 'Les animaux' },
  { word: 'الأَطْفَال',     transliteration: 'al-atfal',       fr: 'Les enfants' },
  { word: 'الآبَاء',        transliteration: 'al-aba\'',       fr: 'Les pères' },
  { word: 'الأُمَّهَات',    transliteration: 'al-ummahat',     fr: 'Les mères' },
];

const VOCAB_LEC2: V[] = [
  { word: 'عَائِلَة',       transliteration: '\'aila',           fr: 'Famille' },
  { word: 'أَصْدِقَاء',     transliteration: 'asdiqa\'',         fr: 'Amis' },
  { word: 'طَعَام لَذِيذ',  transliteration: 'ta\'am ladhidh',   fr: 'Nourriture délicieuse' },
  { word: 'أَخ',            transliteration: 'akh',              fr: 'Frère' },
  { word: 'أُخْت',          transliteration: 'ukht',             fr: 'Sœur' },
  { word: 'أُمّ',           transliteration: 'umm',              fr: 'Maman' },
  { word: 'جَدَّة',         transliteration: 'jadda',            fr: 'Mamie' },
];

const VOCAB_LEC3: V[] = [
  { word: 'يُصَلِّي',          transliteration: 'yusalli',         fr: 'Prier' },
  { word: 'يَقْرَأُ الْقُرْآن', transliteration: 'yaqra\'u Qur\'an', fr: 'Lire le Coran' },
  { word: 'يَدْعُو',           transliteration: 'yad\'u',          fr: 'Faire des invocations' },
  { word: 'يُوَاسِي',          transliteration: 'yuwasi',          fr: 'Consoler' },
  { word: 'يَقْرَأُ كِتَابًا',  transliteration: 'yaqra\'u kitab',  fr: 'Lire un livre' },
];

// ── Helpers (mêmes patterns que seedIslamCinqPiliers.ts) ─────────────────────

async function upsertVocab(languageId: string, v: V, tags: string[] = []): Promise<string> {
  const existing = await prisma.vocabulary.findFirst({
    where: { languageId, word: v.word },
  });
  if (existing) {
    const merged = Array.from(new Set([...(existing.tags ?? []), ...tags]));
    const updated = await prisma.vocabulary.update({
      where: { id: existing.id },
      data: {
        transliteration: v.transliteration,
        translation: { fr: v.fr } as Prisma.InputJsonValue,
        tags: merged,
        isPublished: true,
      },
    });
    return updated.id;
  }
  const created = await prisma.vocabulary.create({
    data: {
      languageId,
      word: v.word,
      transliteration: v.transliteration,
      translation: { fr: v.fr } as Prisma.InputJsonValue,
      tags,
      isPublished: true,
    },
  });
  return created.id;
}

async function upsertLesson(opts: {
  moduleId: string;
  languageId: string;
  slug: string;
  title: string;
  subtitle?: string;
  description?: string;
  order: number;
  introText?: { ar?: string; fr?: string };
}): Promise<string> {
  const baseContent: Prisma.InputJsonValue = opts.introText ? ({ introText: opts.introText } as any) : ({} as any);
  const existing = await prisma.lesson.findUnique({ where: { slug: opts.slug } });
  if (existing) {
    // Préserver content existant (sequence/itemIds/vocabOrder…) en mergeant introText
    const prev = (existing.content as any) ?? {};
    const merged: Prisma.InputJsonValue = { ...prev, ...(opts.introText ? { introText: opts.introText } : {}) };
    const updated = await prisma.lesson.update({
      where: { id: existing.id },
      data: {
        title: opts.title,
        subtitle: opts.subtitle,
        description: opts.description,
        order: opts.order,
        moduleId: opts.moduleId,
        languageId: opts.languageId,
        isPublished: true,
        content: merged,
      },
    });
    return updated.id;
  }
  const created = await prisma.lesson.create({
    data: {
      slug: opts.slug,
      title: opts.title,
      subtitle: opts.subtitle,
      description: opts.description,
      order: opts.order,
      moduleId: opts.moduleId,
      languageId: opts.languageId,
      level: 1,
      isPublished: true,
      content: baseContent,
    },
  });
  return created.id;
}

async function setExercises(
  lessonId: string,
  steps: Array<{ typology: string; config: Prisma.InputJsonValue }>,
) {
  await prisma.lessonExercise.deleteMany({ where: { lessonId } });
  for (let i = 0; i < steps.length; i++) {
    const s = steps[i];
    await prisma.lessonExercise.create({
      data: {
        lessonId,
        order: i,
        typology: s.typology,
        config: s.config,
        isPublished: true,
      },
    });
  }
}

async function linkVocab(lessonId: string, vocabIds: string[]) {
  const uniq = Array.from(new Set(vocabIds.filter(Boolean)));
  for (const vocabularyId of uniq) {
    const existing = await prisma.exercise.findFirst({
      where: { lessonId, vocabularyId },
      select: { id: true },
    });
    if (existing) continue;
    await prisma.exercise.create({
      data: {
        type: 'MULTIPLE_CHOICE',
        lessonId,
        vocabularyId,
        data: {} as Prisma.InputJsonValue,
        answer: {} as Prisma.InputJsonValue,
      },
    });
  }
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  // Langue : ar-SA (arabe coranique avec chakle)
  const lang = await prisma.language.findFirst({ where: { code: 'ar-SA' } });
  if (!lang) throw new Error('Langue \'ar-SA\' introuvable. Lance d\'abord le seed principal.');

  // 1. Module
  let mod = await prisma.module.findUnique({ where: { slug: MODULE_SLUG } });
  if (mod) {
    mod = await prisma.module.update({
      where: { id: mod.id },
      data: {
        ...MODULE_DATA,
        cityInfo: MODULE_DATA.cityInfo as Prisma.InputJsonValue,
      },
    });
    console.log(`↻ Module mis à jour : ${mod.title}`);
  } else {
    mod = await prisma.module.create({
      data: {
        slug: MODULE_SLUG,
        ...MODULE_DATA,
        cityInfo: MODULE_DATA.cityInfo as Prisma.InputJsonValue,
      },
    });
    console.log(`✓ Module créé : ${mod.title}`);
  }

  // 2. Vocabulaire (par leçon, tags pour traçabilité)
  const idsLec1 = await Promise.all(VOCAB_LEC1.map(v => upsertVocab(lang.id, v, ['islam', 'sec1', 'lec1'])));
  const idsLec2 = await Promise.all(VOCAB_LEC2.map(v => upsertVocab(lang.id, v, ['islam', 'sec1', 'lec2'])));
  const idsLec3 = await Promise.all(VOCAB_LEC3.map(v => upsertVocab(lang.id, v, ['islam', 'sec1', 'lec3'])));
  console.log(`✓ Vocab : ${idsLec1.length + idsLec2.length + idsLec3.length} entrées`);

  // 3. Leçon 1 — Je suis musulman & J'aime Allah
  const lesson1Id = await upsertLesson({
    moduleId: mod.id,
    languageId: lang.id,
    slug: 'islam-je-suis-musulman-1',
    title: 'Je suis musulman',
    subtitle: 'أَنَا مُسْلِم',
    description: 'Je découvre Allah et ce qu\'Il a créé',
    order: 0,
    introText: {
      ar: 'أَنَا مُسْلِمٌ. أُحِبُّ اللهَ. اللهُ خَلَقَ كُلَّ شَيْءٍ: الحَيَوَانَات، الأَطْفَال، الآبَاء، الأُمَّهَات',
      fr: 'Je suis musulman. J\'aime Allah. Allah a tout créé autour de nous : les animaux, les enfants, les papas, les mamans...',
    },
  });
  await setExercises(lesson1Id, [
    {
      typology: 'SelectionImages',
      config: {
        question: 'أَرْسُمُ شَكْلَ الْقَلْبِ حَوْلَ مَا خَلَقَ اللهُ',
        questionFr: 'Sélectionne ce qu\'Allah a créé',
        items: [
          { emoji: '🌸', label: 'Fille',  isCorrect: true },
          { emoji: '☀️', label: 'Soleil', isCorrect: true },
          { emoji: '🌳', label: 'Arbre',  isCorrect: true },
          { emoji: '🐓', label: 'Coq',    isCorrect: true },
          { emoji: '👦', label: 'Garçon', isCorrect: true },
        ],
        minSelection: 5,
      } as Prisma.InputJsonValue,
    },
    {
      typology: 'RelierParTrait',
      config: {
        question: 'أربط كُلَّ حَيَوَانٍ بِالْمَكَانِ الَّذِي خَلَقَهُ اللهُ لَهُ لِيَعِيشَ فِيهِ',
        questionFr: 'Relie chaque animal à l\'endroit qu\'Allah lui a créé pour y vivre',
        pairesGauche: [
          { id: 'L1', emoji: '🐠', label: 'Poisson' },
          { id: 'L2', emoji: '🐳', label: 'Baleine' },
          { id: 'L3', emoji: '🦆', label: 'Canard'  },
          { id: 'L4', emoji: '🐔', label: 'Poule'   },
          { id: 'L5', emoji: '🐙', label: 'Poulpe'  },
          { id: 'L6', emoji: '🐬', label: 'Dauphin' },
          { id: 'L7', emoji: '🐑', label: 'Mouton'  },
        ],
        pairesDroite: [
          { id: 'R1', emoji: '🌊', label: 'La mer' },
          { id: 'R2', emoji: '🚜', label: 'La ferme' },
        ],
        correct: { L1: 'R1', L2: 'R1', L3: 'R2', L4: 'R2', L5: 'R1', L6: 'R1', L7: 'R2' },
      } as Prisma.InputJsonValue,
    },
  ]);
  await linkVocab(lesson1Id, idsLec1);
  console.log(`✓ Leçon 1 : 2 exercices + ${idsLec1.length} items`);

  // 4. Leçon 2 — Allah m'aime
  const lesson2Id = await upsertLesson({
    moduleId: mod.id,
    languageId: lang.id,
    slug: 'islam-je-suis-musulman-2',
    title: 'Allah m\'aime',
    subtitle: 'اللهُ يُحِبُّنِي',
    description: 'Allah m\'a donné plein de bonnes choses que j\'aime',
    order: 1,
    introText: {
      ar: 'اللهُ يُحِبُّنِي. اللهُ خَلَقَنِي وَ أَعْطَانِي أَشْيَاءَ كَثِيرَةً أُحِبُّهَا: عَائِلَةً تُحِبُّنِي، أَصْدِقَاءَ طَيِّبِينَ، طَعَامًا لَذِيذًا',
      fr: 'Allah m\'aime. Allah m\'a donné plein de bonnes choses que j\'aime bien : une famille qui m\'aime bien, des copains bienveillants, une bonne nourriture...',
    },
  });
  await setExercises(lesson2Id, [
    {
      typology: 'SelectionImages',
      config: {
        question: 'أَرْسُمُ دَائِرَةً حَوْلَ مَا أُحِبُّ مِمَّا خَلَقَهُ اللهُ لِي',
        questionFr: 'J\'entoure ce que j\'aime dans ce qu\'Allah m\'a donné',
        items: [
          { emoji: '👭', label: 'Ma sœur'         },
          { emoji: '👩', label: 'Maman'           },
          { emoji: '👵', label: 'Ma mamie'        },
          { emoji: '🦜', label: 'Les perroquets'  },
          { emoji: '🍌', label: 'Les bananes'     },
          { emoji: '👫', label: 'Mon frère'       },
          { emoji: '🐈', label: 'Les chats'       },
          { emoji: '🍎', label: 'Les pommes'      },
          { emoji: '🐸', label: 'Les grenouilles' },
          { emoji: '🫐', label: 'Les dattes'      },
          { emoji: '🥕', label: 'Les carottes'    },
          { emoji: '🐜', label: 'Les fourmis'     },
        ],
        freeSelection: true,
      } as Prisma.InputJsonValue,
    },
  ]);
  await linkVocab(lesson2Id, idsLec2);
  console.log(`✓ Leçon 2 : 1 exercice + ${idsLec2.length} items`);

  // 5. Leçon 3 — Les actions qu'Allah aime
  const lesson3Id = await upsertLesson({
    moduleId: mod.id,
    languageId: lang.id,
    slug: 'islam-je-suis-musulman-3',
    title: 'Les actions qu\'Allah aime',
    subtitle: 'الأَعْمَال الَّتِي يُحِبُّهَا اللهُ',
    description: 'Je trie les actions qu\'Allah aime et celles qu\'Il n\'aime pas',
    order: 2,
  });
  await setExercises(lesson3Id, [
    {
      typology: 'TriDeuxCategories',
      config: {
        question: 'أَضَعُ فِي دَائِرَةِ الأَعْمَالَ الَّتِي يُحِبُّ اللهُ أَنْ أَقُومَ بِهَا',
        questionFr: 'J\'entoure les actions qu\'Allah aime que je fasse',
        categorieA: { label: '✓ Allah aime',     color: '#58cc02' },
        categorieB: { label: '✗ Allah n\'aime pas', color: '#ff4b4b' },
        items: [
          { emoji: '😠', label: 'Crier',             correct: 'B' },
          { emoji: '🙏', label: 'Prier',             correct: 'A' },
          { emoji: '👵', label: 'Jouer avec mamie',  correct: 'A' },
          { emoji: '🤗', label: 'Consoler',          correct: 'A' },
          { emoji: '😈', label: 'Se moquer',         correct: 'B' },
          { emoji: '📖', label: 'Lire un livre',     correct: 'A' },
          { emoji: '📕', label: 'Lire le Coran',     correct: 'A' },
          { emoji: '😤', label: 'Embêter',           correct: 'B' },
          { emoji: '🤲', label: 'Faire des douas',   correct: 'A' },
        ],
      } as Prisma.InputJsonValue,
    },
  ]);
  await linkVocab(lesson3Id, idsLec3);
  console.log(`✓ Leçon 3 : 1 exercice + ${idsLec3.length} items`);

  console.log('\n🎉 Section 1 « Je suis musulman » seedée avec succès !');
  console.log(`   → Module : ${MODULE_SLUG}`);
  console.log(`   → 3 leçons, 4 exercices (1 SelectionImages min, 1 SelectionImages libre, 1 RelierParTrait, 1 TriDeuxCategories)`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
