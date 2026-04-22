import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

// ── Données du module ────────────────────────────────────────────────────────
const MODULE_SLUG = 'islam-cinq-piliers';

const MODULE_DATA = {
  title: 'Les 5 Piliers de l\'Islam',
  titleAr: 'قَوَاعِدُ الْإِسْلَام',
  subtitle: 'Les fondements de la foi',
  description: 'Découvrez les 5 fondements de la foi islamique',
  level: 1,
  track: 'RELIGION' as const,
  canonicalOrder: 0,
  isPublished: true,
  colorA: '#7c3aed',
  colorB: '#059669',
  shadowColor: '#5b21b6',
  cityName: 'Les 5 Piliers',
  cityNameAr: 'قَوَاعِدُ الْإِسْلَام',
  emoji: '☪️',
  photoCaption: 'Les fondements de l\'Islam',
  cityInfo: {
    emoji: '☪️',
    subtitle: 'Les fondements de l\'Islam',
    description: 'Tous les musulmans, à travers le monde, partagent ces 5 piliers — actes de foi et de pratique transmis depuis le Prophète Muhammad ﷺ.',
    hadith: {
      ar: 'بُنِيَ الْإِسْلَامُ عَلَى خَمْسٍ : شَهَادَةِ أَنْ لَا إِلَٰهَ إِلَّا اللهُ وَأَنَّ مُحَمَّدًا رَسُولُ اللهِ، وَإِقَامِ الصَّلَاةِ، وَإِيتَاءِ الزَّكَاةِ، وَالْحَجِّ، وَصَوْمِ رَمَضَانَ',
      fr: 'L\'Islam est bâti sur cinq : témoigner qu\'il n\'y a de dieu qu\'Allah et que Muhammad est Son messager, accomplir la prière, s\'acquitter de la zakah, accomplir le pèlerinage, et jeûner Ramadan',
      source: 'رَوَاهُ الْبُخَارِيّ وَمُسْلِم — Rapporté par al-Bukhārī et Muslim',
    },
  },
};

// ── Vocabulaire commun (réutilisé entre leçons) ──────────────────────────────
type V = { word: string; transliteration: string; fr: string };

const PILIERS: V[] = [
  { word: 'الشَّهَادَتَانِ', transliteration: 'Ash-shahadatayn', fr: 'L\'attestation de foi' },
  { word: 'الصَّلَاةُ',      transliteration: 'As-salah',        fr: 'La prière' },
  { word: 'الزَّكَاةُ',      transliteration: 'Az-zakah',        fr: 'L\'aumône légale' },
  { word: 'صَوْمُ رَمَضَانَ', transliteration: 'Sawm Ramadan',    fr: 'Le jeûne du Ramadan' },
  { word: 'الْحَجُّ',         transliteration: 'Al-hajj',          fr: 'Le pèlerinage' },
];

const FREQUENCES: V[] = [
  { word: 'خَمْسَ مَرَّاتٍ فِي الْيَوْم', transliteration: '5 fois par jour',     fr: 'La prière' },
  { word: 'مَرَّةً فِي السَّنَة',          transliteration: 'Une fois par an',      fr: 'L\'aumône légale' },
  { word: 'شَهْرُ رَمَضَان',              transliteration: 'Le mois de Ramadan',   fr: 'Le jeûne du Ramadan' },
  { word: 'مَرَّةً فِي الْحَيَاة',         transliteration: 'Une fois dans la vie', fr: 'Le pèlerinage' },
];

const PRIERES: V[] = [
  { word: 'الصُّبْح',   transliteration: 'SoubH',   fr: 'La prière du matin (aube)' },
  { word: 'الظُّهْر',   transliteration: 'Dhouhr',  fr: 'La prière de midi' },
  { word: 'الْعَصْر',   transliteration: '\'asr',    fr: 'La prière de l\'après-midi' },
  { word: 'الْمَغْرِب', transliteration: 'maghrib', fr: 'La prière du coucher du soleil' },
  { word: 'الْعِشَاء',  transliteration: '\'ichâ',   fr: 'La prière de la nuit' },
];

const FORMULES: V[] = [
  { word: 'اللهُ أَكْبَر',                transliteration: 'Allahu akbar',             fr: 'Allah est le Plus Grand (takbir)' },
  { word: 'سُبْحَانَ رَبِّيَ الْعَظِيم',   transliteration: 'Subhana rabbi al-3adhim',   fr: 'Gloire à mon Seigneur le Très Grand (rukū\')' },
  { word: 'سُبْحَانَ رَبِّيَ الْأَعْلَى',  transliteration: 'Subhana rabbi al-a3la',     fr: 'Gloire à mon Seigneur le Très Haut (sujūd)' },
  { word: 'السَّلَامُ عَلَيْكُم',          transliteration: 'As-salamu 3alaykum',        fr: 'La paix sur vous (taslīm)' },
];

// ── Helpers ──────────────────────────────────────────────────────────────────
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
}): Promise<string> {
  const existing = await prisma.lesson.findUnique({ where: { slug: opts.slug } });
  if (existing) {
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
    },
  });
  return created.id;
}

async function setExercises(
  lessonId: string,
  steps: Array<{ typology: string; config: Prisma.InputJsonValue }>
) {
  // Idempotence : on efface puis recrée la séquence authored
  await prisma.lessonExercise.deleteMany({ where: { lessonId } });
  for (let i = 0; i < steps.length; i++) {
    const s = steps[i];
    await prisma.lessonExercise.create({
      data: {
        lessonId,
        order: i,
        typology: s.typology,
        config: s.config,
      },
    });
  }
}

// Crée les Exercise legacy (liaisons lesson ↔ vocab) lues par GET /lessons/:id/vocabulary
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
  // Langue : ar-SA (arabe classique/MSA — coranique)
  const lang = await prisma.language.findFirst({ where: { code: 'ar-SA' } });
  if (!lang) throw new Error('Langue \'ar-SA\' introuvable');

  // 1. Upsert du module
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

  // 2. Vocabulaire (toutes les leçons)
  const idsPiliers   = await Promise.all(PILIERS.map((v)   => upsertVocab(lang.id, v, ['islam', 'pilier'])));
  const idsFreq      = await Promise.all(FREQUENCES.map((v) => upsertVocab(lang.id, v, ['islam', 'frequence'])));
  const idsPrieres   = await Promise.all(PRIERES.map((v)    => upsertVocab(lang.id, v, ['islam', 'priere'])));
  const idsFormules  = await Promise.all(FORMULES.map((v)   => upsertVocab(lang.id, v, ['islam', 'formule'])));
  console.log(`✓ Vocab : ${idsPiliers.length + idsFreq.length + idsPrieres.length + idsFormules.length} entrées`);

  // 3. Leçon 1 — Les 5 piliers (présentation + étoile)
  const lesson1Id = await upsertLesson({
    moduleId: mod.id,
    languageId: lang.id,
    slug: 'islam-cinq-piliers-presentation',
    title: 'Les 5 piliers de l\'Islam',
    subtitle: 'قَوَاعِدُ الْإِسْلَام',
    description: 'Découvre et place les 5 piliers sur l\'étoile',
    order: 0,
  });
  await setExercises(lesson1Id, [
    { typology: 'FlashCard', config: { vocabIds: [idsPiliers[0]] } },
    { typology: 'FlashCard', config: { vocabIds: [idsPiliers[1]] } },
    { typology: 'FlashCard', config: { vocabIds: [idsPiliers[2]] } },
    { typology: 'FlashCard', config: { vocabIds: [idsPiliers[3]] } },
    { typology: 'FlashCard', config: { vocabIds: [idsPiliers[4]] } },
    {
      typology: 'PlacerDansEtoile',
      config: {
        prompt: 'Place chaque pilier sur l\'étoile',
        zones: [
          { id: 'z1', position: 'top',        numero: 1, answer: PILIERS[0].word, fr: PILIERS[0].fr },
          { id: 'z2', position: 'right-top',  numero: 2, answer: PILIERS[1].word, fr: PILIERS[1].fr },
          { id: 'z3', position: 'right-bot',  numero: 3, answer: PILIERS[2].word, fr: PILIERS[2].fr },
          { id: 'z4', position: 'left-bot',   numero: 4, answer: PILIERS[3].word, fr: PILIERS[3].fr },
          { id: 'z5', position: 'left-top',   numero: 5, answer: PILIERS[4].word, fr: PILIERS[4].fr },
        ],
        words: PILIERS.map((p) => p.word),
      },
    },
    {
      typology: 'ChoixLettre',
      config: {
        prompt: 'Quel pilier signifie « La prière » ?',
        targetVocabId: idsPiliers[1],
        distractorVocabIds: [idsPiliers[0], idsPiliers[3]],
      },
    },
    {
      typology: 'TrouverLesPaires',
      config: { vocabIds: idsPiliers },
    },
    {
      typology: 'VraiFaux',
      config: {
        prompt: 'L\'association est-elle correcte ?',
        targetVocabId: idsPiliers[1],
        proposedVocabId: idsPiliers[4], // الصَّلَاةُ ↔ Le pèlerinage → faux
      },
    },
  ]);
  await linkVocab(lesson1Id, idsPiliers);
  console.log(`✓ Leçon 1 : 9 exercices + ${idsPiliers.length} items`);

  // 4. Leçon 2 — Quand ? La fréquence
  const lesson2Id = await upsertLesson({
    moduleId: mod.id,
    languageId: lang.id,
    slug: 'islam-cinq-piliers-frequences',
    title: 'Quand ? La fréquence des piliers',
    subtitle: 'مَتَى ؟',
    description: 'Relier chaque pilier à sa fréquence',
    order: 1,
  });
  await setExercises(lesson2Id, [
    { typology: 'FlashCard', config: { vocabIds: [idsFreq[0]] } },
    { typology: 'FlashCard', config: { vocabIds: [idsFreq[1]] } },
    { typology: 'FlashCard', config: { vocabIds: [idsFreq[2]] } },
    { typology: 'FlashCard', config: { vocabIds: [idsFreq[3]] } },
    {
      typology: 'AssocierLettres',
      config: {
        prompt: 'Relie chaque fréquence au bon pilier',
        vocabIds: idsFreq,
      },
    },
    {
      typology: 'ChoixLettre',
      config: {
        prompt: 'Quelle fréquence correspond à « La prière » ?',
        targetVocabId: idsFreq[0],
        distractorVocabIds: [idsFreq[1], idsFreq[3]],
      },
    },
  ]);
  await linkVocab(lesson2Id, [...idsFreq, ...idsPiliers]);
  console.log(`✓ Leçon 2 : 6 exercices + ${idsFreq.length + idsPiliers.length} items`);

  // 5. Leçon 3 — Les 5 prières (avec ordre)
  const lesson3Id = await upsertLesson({
    moduleId: mod.id,
    languageId: lang.id,
    slug: 'islam-cinq-piliers-prieres',
    title: 'Les 5 prières obligatoires',
    subtitle: 'الصَّلَوَاتُ الْمَفْرُوضَة',
    description: 'Découvre et ordonne les 5 prières du jour',
    order: 2,
  });
  await setExercises(lesson3Id, [
    { typology: 'FlashCard', config: { vocabIds: [idsPrieres[0]] } },
    { typology: 'FlashCard', config: { vocabIds: [idsPrieres[1]] } },
    { typology: 'FlashCard', config: { vocabIds: [idsPrieres[2]] } },
    { typology: 'FlashCard', config: { vocabIds: [idsPrieres[3]] } },
    { typology: 'FlashCard', config: { vocabIds: [idsPrieres[4]] } },
    {
      typology: 'NumeroterOrdre',
      config: {
        prompt: 'Remets les 5 prières dans l\'ordre du jour',
        items: [
          { id: 'asr',     ar: PRIERES[2].word, latin: PRIERES[2].transliteration, fr: 'Après-midi',         correctPos: 3 },
          { id: 'soubh',   ar: PRIERES[0].word, latin: PRIERES[0].transliteration, fr: 'Aube (matin)',       correctPos: 1 },
          { id: 'icha',    ar: PRIERES[4].word, latin: PRIERES[4].transliteration, fr: 'Nuit',               correctPos: 5 },
          { id: 'maghrib', ar: PRIERES[3].word, latin: PRIERES[3].transliteration, fr: 'Coucher du soleil',  correctPos: 4 },
          { id: 'dhouhr',  ar: PRIERES[1].word, latin: PRIERES[1].transliteration, fr: 'Midi',               correctPos: 2 },
        ],
      },
    },
    {
      typology: 'TrouverLesPaires',
      config: { vocabIds: idsPrieres },
    },
    {
      typology: 'ChoixLettre',
      config: {
        prompt: 'Quelle prière a lieu au coucher du soleil ?',
        targetVocabId: idsPrieres[3],
        distractorVocabIds: [idsPrieres[0], idsPrieres[1]],
      },
    },
  ]);
  await linkVocab(lesson3Id, idsPrieres);
  console.log(`✓ Leçon 3 : 8 exercices + ${idsPrieres.length} items`);

  // 6. Leçon 4 — Les formules de la prière
  const lesson4Id = await upsertLesson({
    moduleId: mod.id,
    languageId: lang.id,
    slug: 'islam-cinq-piliers-formules',
    title: 'Ce qu\'on dit pendant la prière',
    subtitle: 'مَاذَا نَقُول ؟',
    description: 'Les formules essentielles : takbir, rukū\', sujūd, taslīm',
    order: 3,
  });
  await setExercises(lesson4Id, [
    { typology: 'FlashCard', config: { vocabIds: [idsFormules[0]] } },
    { typology: 'FlashCard', config: { vocabIds: [idsFormules[1]] } },
    { typology: 'FlashCard', config: { vocabIds: [idsFormules[2]] } },
    { typology: 'FlashCard', config: { vocabIds: [idsFormules[3]] } },
    {
      typology: 'AssocierLettres',
      config: {
        prompt: 'Relie chaque formule à son moment',
        vocabIds: idsFormules,
      },
    },
    {
      typology: 'VraiFaux',
      config: {
        prompt: 'L\'association est-elle correcte ?',
        targetVocabId: idsFormules[1],
        proposedVocabId: idsFormules[1], // vrai
      },
    },
    {
      typology: 'DicterRomanisation',
      config: {
        prompt: 'Écoute et choisis la romanisation correcte',
        targetVocabId: idsFormules[0],
        distractorVocabIds: [idsFormules[1], idsFormules[2], idsFormules[3]],
      },
    },
  ]);
  await linkVocab(lesson4Id, idsFormules);
  console.log(`✓ Leçon 4 : 7 exercices + ${idsFormules.length} items`);

  console.log(`\n— Seed Islam terminé : module + 4 leçons + 30 exercices`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
