/**
 * Duplique la structure DARIJA → MSA :
 *
 *   48 modules DARIJA  →  48 modules MSA (canonicalOrder +1, villes arabes assignées)
 *                       + 2 modules placeholder "Thème en cours 1/2"
 *   71 lessons DARIJA  →  71 lessons MSA (languageId ar-SA, slug préfixé)
 *   ~1248 vocab ar-MA  →  ~1248 vocab ar-SA (tag 'msa-dup-source:<id>' pour re-run)
 *   1373 Exercise      →  1373 Exercise (vocabularyId + lessonId remappés)
 *   304 LessonExercise →  304 LessonExercise (config vocabIds remappés)
 *
 * IMPORTANT : le texte arabe reste en Darija (copié verbatim). La traduction
 * MSA est un 2e passage (Phase 5). Les métadonnées villes (cityKey, nameAr,
 * countryAr) sont remplacées inline.
 *
 * Idempotent : tout le contenu MSA "dupliqué" (hors msa-alphabet) est purgé
 * avant recréation. Le module alphabet MSA et les vocabs non tagués ne sont
 * jamais touchés.
 *
 * Usage: npx tsx scripts/seedMsaDuplication.ts
 */
import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

// ─── Villes arabes (copie de web/data/arab-cities.ts) ────────────────────
// order = position dans le parcours 1..51. La ville d'order 1 (Fès) est déjà
// prise par le module alphabet (canonicalOrder MSA = 0). Les 48 duplicatas
// prennent order 2..49. Les 2 placeholders prennent 50 et 51.

type ArabCity = {
  key: string; order: number; nameFr: string; nameAr: string;
  transliteration: string; country: string; countryAr: string;
};

const ARAB_CITIES: ArabCity[] = [
  { key: 'fes',         order: 1,  nameFr: 'Fès',         nameAr: 'فاس',              transliteration: 'fās',               country: 'Maroc',             countryAr: 'المغرب' },
  { key: 'rabat',       order: 2,  nameFr: 'Rabat',       nameAr: 'الرباط',           transliteration: 'ar-ribāṭ',          country: 'Maroc',             countryAr: 'المغرب' },
  { key: 'marrakech',   order: 3,  nameFr: 'Marrakech',   nameAr: 'مراكش',            transliteration: 'marrākish',         country: 'Maroc',             countryAr: 'المغرب' },
  { key: 'nouakchott',  order: 4,  nameFr: 'Nouakchott',  nameAr: 'نواكشوط',          transliteration: 'nūākshūṭ',          country: 'Mauritanie',        countryAr: 'موريتانيا' },
  { key: 'chinguetti',  order: 5,  nameFr: 'Chinguetti',  nameAr: 'شنقيط',            transliteration: 'shinqīṭ',           country: 'Mauritanie',        countryAr: 'موريتانيا' },
  { key: 'tlemcen',     order: 6,  nameFr: 'Tlemcen',     nameAr: 'تلمسان',           transliteration: 'tilimsān',          country: 'Algérie',           countryAr: 'الجزائر' },
  { key: 'alger',       order: 7,  nameFr: 'Alger',       nameAr: 'الجزائر',          transliteration: 'al-jazāʾir',        country: 'Algérie',           countryAr: 'الجزائر' },
  { key: 'constantine', order: 8,  nameFr: 'Constantine', nameAr: 'قسنطينة',          transliteration: 'qasanṭīna',         country: 'Algérie',           countryAr: 'الجزائر' },
  { key: 'tunis',       order: 9,  nameFr: 'Tunis',       nameAr: 'تونس',             transliteration: 'tūnis',             country: 'Tunisie',           countryAr: 'تونس' },
  { key: 'kairouan',    order: 10, nameFr: 'Kairouan',    nameAr: 'القيروان',         transliteration: 'al-qayrawān',       country: 'Tunisie',           countryAr: 'تونس' },
  { key: 'tripoli',     order: 11, nameFr: 'Tripoli',     nameAr: 'طرابلس',           transliteration: 'ṭarābulus',         country: 'Libye',             countryAr: 'ليبيا' },
  { key: 'ghadames',    order: 12, nameFr: 'Ghadamès',    nameAr: 'غدامس',            transliteration: 'ghadāmis',          country: 'Libye',             countryAr: 'ليبيا' },
  { key: 'alexandrie',  order: 13, nameFr: 'Alexandrie',  nameAr: 'الإسكندرية',       transliteration: 'al-iskandariyya',   country: 'Égypte',            countryAr: 'مصر' },
  { key: 'lecaire',     order: 14, nameFr: 'Le Caire',    nameAr: 'القاهرة',          transliteration: 'al-qāhira',         country: 'Égypte',            countryAr: 'مصر' },
  { key: 'assouan',     order: 15, nameFr: 'Assouan',     nameAr: 'أسوان',            transliteration: 'aswān',             country: 'Égypte',            countryAr: 'مصر' },
  { key: 'khartoum',    order: 16, nameFr: 'Khartoum',    nameAr: 'الخرطوم',          transliteration: 'al-kharṭūm',        country: 'Soudan',            countryAr: 'السودان' },
  { key: 'omdurman',    order: 17, nameFr: 'Omdurman',    nameAr: 'أم درمان',         transliteration: 'umm durmān',        country: 'Soudan',            countryAr: 'السودان' },
  { key: 'djibouti',    order: 18, nameFr: 'Djibouti',    nameAr: 'جيبوتي',           transliteration: 'jībūtī',            country: 'Djibouti',          countryAr: 'جيبوتي' },
  { key: 'mogadiscio',  order: 19, nameFr: 'Mogadiscio',  nameAr: 'مقديشو',           transliteration: 'maqadīshū',         country: 'Somalie',           countryAr: 'الصومال' },
  { key: 'moroni',      order: 20, nameFr: 'Moroni',      nameAr: 'موروني',           transliteration: 'mūrūnī',            country: 'Comores',           countryAr: 'جزر القمر' },
  { key: 'aden',        order: 21, nameFr: 'Aden',        nameAr: 'عدن',              transliteration: 'ʿadan',             country: 'Yémen',             countryAr: 'اليمن' },
  { key: 'sanaa',       order: 22, nameFr: 'Sanaa',       nameAr: 'صنعاء',            transliteration: 'ṣanʿāʾ',            country: 'Yémen',             countryAr: 'اليمن' },
  { key: 'mascate',     order: 23, nameFr: 'Mascate',     nameAr: 'مسقط',             transliteration: 'masqaṭ',            country: 'Oman',              countryAr: 'عمان' },
  { key: 'nizwa',       order: 24, nameFr: 'Nizwa',       nameAr: 'نزوى',             transliteration: 'nizwā',             country: 'Oman',              countryAr: 'عمان' },
  { key: 'abudhabi',    order: 25, nameFr: 'Abu Dhabi',   nameAr: 'أبو ظبي',          transliteration: 'abū ẓabī',          country: 'Émirats arabes unis', countryAr: 'الإمارات' },
  { key: 'dubai',       order: 26, nameFr: 'Dubaï',       nameAr: 'دبي',              transliteration: 'dubai',             country: 'Émirats arabes unis', countryAr: 'الإمارات' },
  { key: 'chardjah',    order: 27, nameFr: 'Chardjah',    nameAr: 'الشارقة',          transliteration: 'ash-shāriqa',       country: 'Émirats arabes unis', countryAr: 'الإمارات' },
  { key: 'doha',        order: 28, nameFr: 'Doha',        nameAr: 'الدوحة',           transliteration: 'ad-dawḥa',          country: 'Qatar',             countryAr: 'قطر' },
  { key: 'manama',      order: 29, nameFr: 'Manama',      nameAr: 'المنامة',          transliteration: 'al-manāma',         country: 'Bahreïn',           countryAr: 'البحرين' },
  { key: 'koweit',      order: 30, nameFr: 'Koweït City', nameAr: 'مدينة الكويت',     transliteration: 'madīnat al-kuwayt', country: 'Koweït',            countryAr: 'الكويت' },
  { key: 'djeddah',     order: 31, nameFr: 'Djeddah',     nameAr: 'جدة',              transliteration: 'jidda',             country: 'Arabie saoudite',   countryAr: 'السعودية' },
  { key: 'lamecque',    order: 32, nameFr: 'La Mecque',   nameAr: 'مكة المكرمة',      transliteration: 'makka',             country: 'Arabie saoudite',   countryAr: 'السعودية' },
  { key: 'medine',      order: 33, nameFr: 'Médine',      nameAr: 'المدينة المنورة',  transliteration: 'al-madīna',         country: 'Arabie saoudite',   countryAr: 'السعودية' },
  { key: 'riyad',       order: 34, nameFr: 'Riyad',       nameAr: 'الرياض',           transliteration: 'ar-riyāḍ',          country: 'Arabie saoudite',   countryAr: 'السعودية' },
  { key: 'basra',       order: 35, nameFr: 'Basra',       nameAr: 'البصرة',           transliteration: 'al-baṣra',          country: 'Irak',              countryAr: 'العراق' },
  { key: 'kerbala',     order: 36, nameFr: 'Kerbala',     nameAr: 'كربلاء',           transliteration: 'karbalāʾ',          country: 'Irak',              countryAr: 'العراق' },
  { key: 'najaf',       order: 37, nameFr: 'Najaf',       nameAr: 'النجف',            transliteration: 'an-najaf',          country: 'Irak',              countryAr: 'العراق' },
  { key: 'bagdad',      order: 38, nameFr: 'Bagdad',      nameAr: 'بغداد',            transliteration: 'baghdād',           country: 'Irak',              countryAr: 'العراق' },
  { key: 'samarra',     order: 39, nameFr: 'Samarra',     nameAr: 'سامراء',           transliteration: 'sāmarrāʾ',          country: 'Irak',              countryAr: 'العراق' },
  { key: 'damas',       order: 40, nameFr: 'Damas',       nameAr: 'دمشق',             transliteration: 'dimashq',           country: 'Syrie',             countryAr: 'سوريا' },
  { key: 'homs',        order: 41, nameFr: 'Homs',        nameAr: 'حمص',              transliteration: 'ḥimṣ',              country: 'Syrie',             countryAr: 'سوريا' },
  { key: 'palmyre',     order: 42, nameFr: 'Palmyre',     nameAr: 'تدمر',             transliteration: 'tadmur',            country: 'Syrie',             countryAr: 'سوريا' },
  { key: 'alep',        order: 43, nameFr: 'Alep',        nameAr: 'حلب',              transliteration: 'ḥalab',             country: 'Syrie',             countryAr: 'سوريا' },
  { key: 'beyrouth',    order: 44, nameFr: 'Beyrouth',    nameAr: 'بيروت',            transliteration: 'bayrūt',            country: 'Liban',             countryAr: 'لبنان' },
  { key: 'baalbek',     order: 45, nameFr: 'Baalbek',     nameAr: 'بعلبك',            transliteration: 'baʿlabakk',         country: 'Liban',             countryAr: 'لبنان' },
  { key: 'jerusalem',   order: 46, nameFr: 'Jérusalem',   nameAr: 'القدس',            transliteration: 'al-quds',           country: 'Palestine',         countryAr: 'فلسطين' },
  { key: 'bethleem',    order: 47, nameFr: 'Bethléem',    nameAr: 'بيت لحم',          transliteration: 'bayt laḥm',         country: 'Palestine',         countryAr: 'فلسطين' },
  { key: 'hebron',      order: 48, nameFr: 'Hébron',      nameAr: 'الخليل',           transliteration: 'al-khalīl',         country: 'Palestine',         countryAr: 'فلسطين' },
  { key: 'ramallah',    order: 49, nameFr: 'Ramallah',    nameAr: 'رام الله',         transliteration: 'rām allāh',         country: 'Palestine',         countryAr: 'فلسطين' },
  { key: 'amman',       order: 50, nameFr: 'Amman',       nameAr: 'عمّان',            transliteration: 'ʿammān',            country: 'Jordanie',          countryAr: 'الأردن' },
  { key: 'petra',       order: 51, nameFr: 'Pétra',       nameAr: 'البتراء',          transliteration: 'al-batrāʾ',         country: 'Jordanie',          countryAr: 'الأردن' },
];

const VOCAB_TAG_PREFIX = 'msa-dup-source:';

// ─── Helpers ─────────────────────────────────────────────────────────────

function cityAtOrder(order: number): ArabCity | null {
  return ARAB_CITIES.find(c => c.order === order) ?? null;
}

/** Remplace le nom de ville darija par le nom arabe dans le titre, sinon préfixe. */
function deriveMsaTitle(darijaTitle: string, darijaCityName: string | null, arab: ArabCity): string {
  if (darijaCityName && darijaTitle.includes(darijaCityName)) {
    return darijaTitle.replace(darijaCityName, arab.nameFr);
  }
  return `${arab.nameFr} — ${darijaTitle}`;
}

/** Remap récursif de tous les vocabIds dans une config JSON. */
function remapConfigVocabIds(config: unknown, vocabMap: Map<string, string>): unknown {
  if (config === null || typeof config !== 'object') return config;
  if (Array.isArray(config)) return config.map(v => remapConfigVocabIds(v, vocabMap));
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(config as Record<string, unknown>)) {
    if ((k === 'targetVocabId' || k === 'vocabularyId' || k === 'vocabId') && typeof v === 'string') {
      out[k] = vocabMap.get(v) ?? v;
    } else if ((k === 'distractorVocabIds' || k === 'vocabIds') && Array.isArray(v)) {
      out[k] = v.map(id => typeof id === 'string' ? (vocabMap.get(id) ?? id) : id);
    } else {
      out[k] = remapConfigVocabIds(v, vocabMap);
    }
  }
  return out;
}

// ─── Étapes ──────────────────────────────────────────────────────────────

async function nukeExistingMsa() {
  console.log('🧹 Purge du contenu MSA dupliqué précédent (hors msa-alphabet)\n');

  // Modules MSA dupliqués (tous sauf msa-alphabet)
  const modulesToDelete = await prisma.module.findMany({
    where: { track: 'MSA', slug: { not: 'msa-alphabet' } },
    select: { id: true, slug: true },
  });
  if (modulesToDelete.length) {
    // Les leçons + LessonExercise + Exercise tombent en cascade via onDelete
    await prisma.module.deleteMany({ where: { id: { in: modulesToDelete.map(m => m.id) } } });
    console.log(`   - ${modulesToDelete.length} modules MSA purgés (+ lessons/exercises en cascade)`);
  } else {
    console.log('   (aucun module MSA dupliqué existant)');
  }

  // Vocabs ar-SA tagués comme duplicatas
  const taggedVocabs = await prisma.vocabulary.findMany({
    where: {
      language: { code: 'ar-SA' },
      tags: { hasSome: [] }, // filtre sur tous ceux qui ont un tag — on affine par has
    },
    select: { id: true, tags: true },
  });
  const dupVocabIds = taggedVocabs
    .filter(v => v.tags.some(t => t.startsWith(VOCAB_TAG_PREFIX)))
    .map(v => v.id);
  if (dupVocabIds.length) {
    await prisma.vocabulary.deleteMany({ where: { id: { in: dupVocabIds } } });
    console.log(`   - ${dupVocabIds.length} vocabs ar-SA dupliqués purgés`);
  } else {
    console.log('   (aucun vocab ar-SA dupliqué existant)');
  }
}

async function duplicateVocabularies(msaLangId: string): Promise<Map<string, string>> {
  console.log('\n📚 Duplication vocabulaire ar-MA → ar-SA\n');

  const source = await prisma.vocabulary.findMany({
    where: { language: { code: 'ar-MA' } },
    select: {
      id: true, word: true, transliteration: true, translation: true,
      audioUrl: true, imageUrl: true, partOfSpeech: true, examples: true,
      tags: true, isPublished: true,
    },
    orderBy: { createdAt: 'asc' },
  });

  const map = new Map<string, string>();
  let created = 0;
  const BATCH = 100;
  for (let i = 0; i < source.length; i += BATCH) {
    const slice = source.slice(i, i + BATCH);
    const data = slice.map(v => ({
      word:            v.word,
      transliteration: v.transliteration,
      translation:     v.translation as Prisma.InputJsonValue,
      audioUrl:        null, // pas d'audio MSA pour l'instant → navigator TTS
      imageUrl:        v.imageUrl,
      partOfSpeech:    v.partOfSpeech,
      examples:        v.examples as Prisma.InputJsonValue,
      tags:            [...v.tags, `${VOCAB_TAG_PREFIX}${v.id}`],
      isPublished:     v.isPublished,
      languageId:      msaLangId,
    }));
    await prisma.vocabulary.createMany({ data });
    // Retrouver les clones fraîchement créés via leur tag unique
    const sourceIds = slice.map(v => v.id);
    const clones = await prisma.vocabulary.findMany({
      where: {
        languageId: msaLangId,
        tags: { hasSome: sourceIds.map(id => `${VOCAB_TAG_PREFIX}${id}`) },
      },
      select: { id: true, tags: true },
    });
    for (const c of clones) {
      const tag = c.tags.find(t => t.startsWith(VOCAB_TAG_PREFIX));
      if (!tag) continue;
      const sourceId = tag.slice(VOCAB_TAG_PREFIX.length);
      map.set(sourceId, c.id);
    }
    created += slice.length;
    process.stdout.write(`\r   ${created}/${source.length}`);
  }
  console.log(`\n   ✓ ${map.size} vocabs clonés`);
  return map;
}

async function duplicateModules(): Promise<Map<string, string>> {
  console.log('\n🏛  Duplication modules DARIJA → MSA\n');

  const source = await prisma.module.findMany({
    where: { track: 'DARIJA' },
    orderBy: { canonicalOrder: 'asc' },
  });

  const map = new Map<string, string>();
  for (const m of source) {
    const msaOrder = m.canonicalOrder + 1; // alphabet est à 0
    const arab = cityAtOrder(msaOrder + 1); // ARAB_CITIES 1-indexed, decalé de +1
    if (!arab) {
      console.warn(`   ⚠  Pas de ville arabe pour canonicalOrder MSA=${msaOrder}, skip.`);
      continue;
    }
    const msaSlug = `msa-${m.slug}`.slice(0, 191);
    const msaTitle = deriveMsaTitle(m.title, m.cityName, arab);
    const oldCity = (m.cityInfo ?? {}) as Record<string, unknown>;
    const newCityInfo = {
      ...oldCity,
      cityKey: arab.key,
      photoUrl: `/uploads/cities/${arab.key}.webp`,
    };

    const created = await prisma.module.create({
      data: {
        title: msaTitle,
        titleAr: arab.nameAr,
        subtitle: m.subtitle,
        description: m.description,
        level: m.level,
        slug: msaSlug,
        track: 'MSA',
        canonicalOrder: msaOrder,
        colorA: m.colorA,
        colorB: m.colorB,
        shadowColor: m.shadowColor,
        cityName: arab.nameFr,
        cityNameAr: arab.nameAr,
        emoji: m.emoji,
        photoCaption: m.photoCaption,
        cityInfo: newCityInfo as Prisma.InputJsonValue,
        isPublished: m.isPublished,
      },
    });
    map.set(m.id, created.id);
  }
  console.log(`   ✓ ${map.size} modules MSA créés`);
  return map;
}

async function createPlaceholderModules() {
  console.log('\n🏁 Création modules placeholder (Thème en cours 1/2)\n');

  const placeholders = [
    { order: 49, slug: 'msa-theme-1', title: 'Thème en cours 1', arab: cityAtOrder(50)! },
    { order: 50, slug: 'msa-theme-2', title: 'Thème en cours 2', arab: cityAtOrder(51)! },
  ];

  for (const p of placeholders) {
    await prisma.module.create({
      data: {
        title: `${p.arab.nameFr} — ${p.title}`,
        titleAr: p.arab.nameAr,
        subtitle: 'À venir',
        description: 'Ce thème sera ajouté prochainement.',
        level: 1,
        slug: p.slug,
        track: 'MSA',
        canonicalOrder: p.order,
        colorA: '#6c757d',
        colorB: '#495057',
        shadowColor: '#343a40',
        cityName: p.arab.nameFr,
        cityNameAr: p.arab.nameAr,
        emoji: '🚧',
        photoCaption: `${p.arab.country}`,
        cityInfo: {
          cityKey: p.arab.key,
          emoji: '🚧',
          photoUrl: `/uploads/cities/${p.arab.key}.webp`,
        } as Prisma.InputJsonValue,
        isPublished: false, // placeholder non publié
      },
    });
    console.log(`   + ${p.slug}  [${p.order}] ${p.arab.nameFr}`);
  }
}

async function duplicateLessons(moduleIdMap: Map<string, string>, msaLangId: string): Promise<Map<string, string>> {
  console.log('\n📖 Duplication lessons\n');

  const source = await prisma.lesson.findMany({
    where: { module: { track: 'DARIJA' } },
    orderBy: [{ moduleId: 'asc' }, { order: 'asc' }],
  });

  const map = new Map<string, string>();
  for (const l of source) {
    const newModuleId = l.moduleId ? moduleIdMap.get(l.moduleId) : null;
    if (!newModuleId) continue;
    const msaSlug = l.slug ? `msa-${l.slug}`.slice(0, 191) : null;

    const created = await prisma.lesson.create({
      data: {
        title: l.title,
        slug: msaSlug,
        subtitle: l.subtitle,
        description: l.description,
        content: l.content as Prisma.InputJsonValue,
        order: l.order,
        duration: l.duration,
        level: l.level,
        videoUrl: l.videoUrl,
        videoPoster: l.videoPoster,
        isPublished: l.isPublished,
        isDeleted: l.isDeleted,
        moduleId: newModuleId,
        languageId: msaLangId,
      },
    });
    map.set(l.id, created.id);
  }
  console.log(`   ✓ ${map.size} lessons MSA créées`);
  return map;
}

async function duplicateExercises(lessonIdMap: Map<string, string>, vocabIdMap: Map<string, string>) {
  console.log('\n🎯 Duplication Exercise legacy (MULTIPLE_CHOICE, LISTENING, etc.)\n');

  const source = await prisma.exercise.findMany({
    where: { lesson: { module: { track: 'DARIJA' } } },
    orderBy: { createdAt: 'asc' },
  });

  let created = 0;
  const BATCH = 200;
  for (let i = 0; i < source.length; i += BATCH) {
    const slice = source.slice(i, i + BATCH);
    const data = slice
      .map(e => {
        const newLessonId = e.lessonId ? lessonIdMap.get(e.lessonId) : null;
        if (!newLessonId) return null;
        const newVocabId = e.vocabularyId ? vocabIdMap.get(e.vocabularyId) ?? null : null;
        return {
          type:         e.type,
          prompt:       e.prompt,
          data:         e.data as Prisma.InputJsonValue,
          answer:       e.answer as Prisma.InputJsonValue,
          points:       e.points,
          lessonId:     newLessonId,
          vocabularyId: newVocabId,
        };
      })
      .filter((x): x is NonNullable<typeof x> => x !== null);
    if (data.length) {
      await prisma.exercise.createMany({ data });
      created += data.length;
    }
    process.stdout.write(`\r   ${created}/${source.length}`);
  }
  console.log(`\n   ✓ ${created} Exercise clonés`);
}

async function duplicateLessonExercises(lessonIdMap: Map<string, string>, vocabIdMap: Map<string, string>) {
  console.log('\n🧩 Duplication LessonExercise (authored, typologies)\n');

  const source = await prisma.lessonExercise.findMany({
    where: { lesson: { module: { track: 'DARIJA' } } },
    orderBy: [{ lessonId: 'asc' }, { order: 'asc' }],
  });

  let created = 0;
  const BATCH = 100;
  for (let i = 0; i < source.length; i += BATCH) {
    const slice = source.slice(i, i + BATCH);
    const data = slice
      .map(le => {
        const newLessonId = lessonIdMap.get(le.lessonId);
        if (!newLessonId) return null;
        const remappedConfig = remapConfigVocabIds(le.config, vocabIdMap);
        return {
          lessonId:    newLessonId,
          order:       le.order,
          typology:    le.typology,
          config:      remappedConfig as Prisma.InputJsonValue,
          isPublished: le.isPublished,
        };
      })
      .filter((x): x is NonNullable<typeof x> => x !== null);
    if (data.length) {
      await prisma.lessonExercise.createMany({ data });
      created += data.length;
    }
    process.stdout.write(`\r   ${created}/${source.length}`);
  }
  console.log(`\n   ✓ ${created} LessonExercise clonés`);
}

// ─── Main ────────────────────────────────────────────────────────────────

async function main() {
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('  Duplication DARIJA → MSA (Phase 4 / option C)');
  console.log('═══════════════════════════════════════════════════════════════');

  const msaLang = await prisma.language.findUnique({ where: { code: 'ar-SA' } });
  if (!msaLang) {
    console.error("❌ Langue ar-SA introuvable. Crée-la d'abord.");
    process.exit(1);
  }

  await nukeExistingMsa();
  const vocabIdMap  = await duplicateVocabularies(msaLang.id);
  const moduleIdMap = await duplicateModules();
  const lessonIdMap = await duplicateLessons(moduleIdMap, msaLang.id);
  await duplicateExercises(lessonIdMap, vocabIdMap);
  await duplicateLessonExercises(lessonIdMap, vocabIdMap);
  await createPlaceholderModules();

  console.log('\n═══════════════════════════════════════════════════════════════');
  console.log('  ✅ Duplication terminée');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('  Texte arabe = Darija verbatim. Traduction MSA = Phase 5.');
  console.log('');

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error('❌ Erreur :', e);
  prisma.$disconnect().finally(() => process.exit(1));
});
