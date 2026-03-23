const fs = require('fs').promises;
const path = require('path');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function loadJSON(name) {
  const p = path.join(__dirname, '..', 'data', name);
  try {
    const raw = await fs.readFile(p, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    if (err.code === 'ENOENT') return [];
    throw err;
  }
}

async function loadDataFlexible(name) {
  // Try JSON file first, otherwise try a .ts module with the same base name
  const jsonPath = path.join(__dirname, '..', 'data', name);
  try {
    const raw = await fs.readFile(jsonPath, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    if (err.code !== 'ENOENT') throw err;
    // try .ts
    const tsPath = jsonPath.replace(/\.json$/, '.ts');
    try {
      await fs.access(tsPath);
      // Register ts-node so we can require TS files
      try {
        require('ts-node').register({ transpileOnly: true });
      } catch (e) {
        // fallback to ts-node/register
        try { require('ts-node/register'); } catch (e2) { /* ignore */ }
      }
      const mod = require(tsPath);
      const exported = mod && (mod.default || mod);
      // If the module export is already an array, return it
      if (Array.isArray(exported)) return exported;
      // If it's an object with named exports, collect any array-valued exports
      if (exported && typeof exported === 'object') {
        const arrays = Object.values(exported).filter(v => Array.isArray(v));
        if (arrays.length === 1) return arrays[0];
        if (arrays.length > 1) return arrays.flat();
      }
      return [];
    } catch (e) {
      return [];
    }
  }
}

async function findOrCreateLanguage(code = 'ar-MA', name = 'Darija (ar-MA)') {
  let lang = await prisma.language.findUnique({ where: { code } });
  if (!lang) {
    lang = await prisma.language.create({ data: { code, name } });
  }
  return lang;
}

async function findOrCreateModule(item) {
  // item: { title, description, slug, level }
  const slug = item.slug || item.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  let mod = await prisma.module.findUnique({ where: { slug } }).catch(() => null);
  if (!mod) {
    mod = await prisma.module.create({ data: { title: item.title || slug, description: item.description || null, slug, level: item.level || 1 } });
  }
  return mod;
}

async function upsertVocabulary(v, language) {
  // v: { word, transliteration, translation, pos, examples, tags }
  const existing = await prisma.vocabulary.findFirst({ where: { word: v.word, languageId: language.id } });
  if (existing) {
    // update minimal fields if missing
    await prisma.vocabulary.update({ where: { id: existing.id }, data: { transliteration: existing.transliteration || v.transliteration || null, translation: existing.translation || v.translation || null, partOfSpeech: existing.partOfSpeech || v.pos || null } }).catch(() => null);
    return existing;
  }

  const created = await prisma.vocabulary.create({ data: {
    word: v.word,
    transliteration: v.transliteration || null,
    translation: v.translation ? (typeof v.translation === 'string' ? { default: v.translation } : v.translation) : null,
    partOfSpeech: v.pos || null,
    examples: v.examples || null,
    tags: v.tags || [],
    languageId: language.id,
  } });
  return created;
}

async function upsertLesson(item, module, language) {
  // item: { title, content, slug }
  const title = item.title || item.slug || `lesson-${Date.now()}`;
  const existing = await prisma.lesson.findFirst({ where: { title, moduleId: module?.id || null } });
  if (existing) return existing;

  const created = await prisma.lesson.create({ data: {
    title,
    subtitle: item.subtitle || null,
    description: item.description || null,
    content: item.content || null,
    order: item.order || 0,
    level: item.level || 1,
    moduleId: module?.id || null,
    languageId: language.id,
    isPublished: item.isPublished || false,
  } });
  return created;
}

async function upsertExercise(ex, lesson, vocabulary) {
  // ex: { type, prompt, data, answer, points }
  // Check duplicate by lesson + prompt + type
  const existing = await prisma.exercise.findFirst({ where: { lessonId: lesson.id, type: ex.type, prompt: ex.prompt || null } });
  if (existing) return existing;

  const created = await prisma.exercise.create({ data: {
    type: ex.type,
    prompt: ex.prompt || null,
    data: ex.data || null,
    answer: ex.answer || null,
    points: ex.points || 10,
    lessonId: lesson.id,
    vocabularyId: vocabulary?.id || null,
  } });
  return created;
}

async function importAll() {
  console.log('Loading JSON input files from /backend/data/...');
  const vocabularies = await loadDataFlexible('vocabulary.json');
  const expressions = await loadDataFlexible('expressions.json');
  const grammars = await loadDataFlexible('grammar.json');
  const dialogues = await loadDataFlexible('dialogues.json');
  const categories = await loadDataFlexible('categories.json');

  // If no single vocabulary file, also try loading all .ts files in /data as vocab sources
  if ((!vocabularies || vocabularies.length === 0)) {
    try {
      const files = await fs.readdir(path.join(__dirname, '..', 'data'));
      const tsFiles = files.filter(f => f.endsWith('.ts'));
      let combined = [];
      for (const f of tsFiles) {
        try {
          const p = path.join(__dirname, '..', 'data', f);
          // ensure ts-node registered
          try { require('ts-node').register({ transpileOnly: true }); } catch (e) { try { require('ts-node/register'); } catch (e2) { /* ignore */ } }
          const mod = require(p);
          const exported = mod && (mod.default || mod);
          if (Array.isArray(exported)) combined = combined.concat(exported);
          else if (exported && typeof exported === 'object') {
            const arrays = Object.values(exported).filter(v => Array.isArray(v));
            if (arrays.length === 1) combined = combined.concat(arrays[0]);
            else if (arrays.length > 1) combined = combined.concat(arrays.flat());
          }
        } catch (e) {
          // ignore individual file errors
        }
      }
      if (combined.length > 0) {
        console.log(`Loaded ${combined.length} entries from .ts data files`);
        vocabularies.push(...combined);
      }
    } catch (e) {
      // ignore
    }
  }

  // ensure default language exists
  const defaultLang = await findOrCreateLanguage('ar-MA', 'Darija (ar-MA)');

  const moduleMap = new Map();

  // Import categories as modules
  for (const c of categories) {
    const mod = await findOrCreateModule(c);
    moduleMap.set(c.slug || c.title, mod);
  }

  // Normalize and import vocabulary (support several source field names)
  let vocabCount = 0;
  const normalizedVocabs = (vocabularies || []).map(v => ({
    ...v,
    word: v.word || v.darija || v.text || v.term,
    transliteration: v.transliteration || v.latin || v.transliteration,
    translation: v.translation || v.fr || v.translation || null,
    pos: v.pos || v.partOfSpeech || null,
    tags: v.tags || (v.category ? [v.category] : []),
  }));

  for (const v of normalizedVocabs) {
    const lang = v.languageCode ? await findOrCreateLanguage(v.languageCode, v.languageName || v.languageCode) : defaultLang;
    if (!v.word) continue; // skip malformed entries
    await upsertVocabulary(v, lang);
    vocabCount++;
  }

  // helper to find vocabulary by word
  async function findVocabByWord(word, lang = defaultLang) {
    return prisma.vocabulary.findFirst({ where: { word, languageId: lang.id } });
  }

  let lessonCount = 0;
  let exerciseCount = 0;

  // Import grammar, expressions, dialogues as lessons + exercises
  const sources = [ ...grammars, ...expressions, ...dialogues ];
  for (const item of sources) {
    const moduleKey = item.categorySlug || item.category || null;
    const module = moduleKey ? moduleMap.get(moduleKey) : null;
    const lesson = await upsertLesson(item, module, defaultLang);
    lessonCount++;

    // create exercises if present
    if (Array.isArray(item.exercises)) {
      for (const ex of item.exercises) {
        let vocab = null;
        if (ex.vocabularyWord) vocab = await findVocabByWord(ex.vocabularyWord, defaultLang);
        await upsertExercise(ex, lesson, vocab);
        exerciseCount++;
      }
    }
  }

  console.log(`Import complete. Vocabulary: ${vocabCount}, Lessons: ${lessonCount}, Exercises: ${exerciseCount}`);
}

importAll()
  .catch(err => {
    console.error('Import failed:', err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
