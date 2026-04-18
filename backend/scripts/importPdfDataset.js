#!/usr/bin/env node

const fs = require('fs').promises;
const path = require('path');

require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
require('dotenv').config();

const { PrismaClient } = require('@prisma/client');

const DEFAULT_DATASET = path.join(__dirname, '..', 'content', 'sources', 'arabe_niveau2_01.json');
const EXERCISE_TYPES = new Set(['MULTIPLE_CHOICE', 'FILL_BLANK', 'LISTENING', 'TRANSLATION', 'REORDER']);
const PARTS_OF_SPEECH = new Set([
  'NOUN',
  'VERB',
  'ADJECTIVE',
  'ADVERB',
  'PRONOUN',
  'PREPOSITION',
  'CONJUNCTION',
  'INTERJECTION',
]);

function parseArgs(argv) {
  const flags = new Set(argv.filter((arg) => arg.startsWith('--')));
  const datasetArg = argv.find((arg) => !arg.startsWith('--'));

  return {
    datasetPath: datasetArg ? path.resolve(process.cwd(), datasetArg) : DEFAULT_DATASET,
    dryRun: flags.has('--dry-run'),
  };
}

function assertDataset(dataset, datasetPath) {
  if (!dataset || typeof dataset !== 'object') {
    throw new Error(`Dataset invalide: ${datasetPath}`);
  }
  if (!dataset.source?.id) throw new Error('Dataset invalide: source.id est obligatoire');
  if (!dataset.language?.code) throw new Error('Dataset invalide: language.code est obligatoire');
  if (!dataset.module?.slug) throw new Error('Dataset invalide: module.slug est obligatoire');
  if (!Array.isArray(dataset.lessons) || dataset.lessons.length === 0) {
    throw new Error('Dataset invalide: lessons doit contenir au moins une leçon');
  }

  for (const lesson of dataset.lessons) {
    if (!lesson.slug) throw new Error('Chaque leçon doit avoir un slug');
    if (!lesson.title) throw new Error(`La leçon ${lesson.slug} doit avoir un titre`);
    if (!Array.isArray(lesson.vocabulary)) lesson.vocabulary = [];
    if (!Array.isArray(lesson.exercises)) lesson.exercises = [];

    for (const exercise of lesson.exercises) {
      if (!EXERCISE_TYPES.has(exercise.type)) {
        throw new Error(`Type d'exercice invalide pour ${lesson.slug}: ${exercise.type}`);
      }
    }
  }
}

function mergeTags(...tagLists) {
  const tags = new Set();
  for (const list of tagLists) {
    if (!list) continue;
    if (Array.isArray(list)) {
      list.forEach((tag) => tag && tags.add(String(tag)));
    } else {
      tags.add(String(list));
    }
  }
  return Array.from(tags);
}

function normalizeTranslation(value) {
  if (!value) return null;
  if (typeof value === 'string') return { fr: value };
  if (typeof value === 'object') return value;
  return null;
}

function normalizePartOfSpeech(value) {
  if (!value) return null;
  const normalized = String(value).toUpperCase();
  return PARTS_OF_SPEECH.has(normalized) ? normalized : null;
}

function lessonContent(dataset, lesson) {
  const content = lesson.content && typeof lesson.content === 'object' ? lesson.content : {};
  return {
    presentation: 'generic-db',
    ...content,
    source: {
      ...(content.source || {}),
      id: dataset.source.id,
      type: dataset.source.type || 'pdf-dataset',
      title: dataset.source.title || null,
      documentPath: dataset.source.documentPath || null,
      pageCount: dataset.source.pageCount || null,
    },
    generator: {
      schemaVersion: dataset.schemaVersion || 1,
      importedFrom: 'backend/scripts/importPdfDataset.js',
    },
  };
}

function exerciseData(dataset, exercise, index) {
  const data = exercise.data && typeof exercise.data === 'object' ? exercise.data : {};
  return {
    ...data,
    order: index + 1,
    source: {
      ...(data.source || {}),
      id: dataset.source.id,
      type: dataset.source.type || 'pdf-dataset',
      title: dataset.source.title || null,
    },
  };
}

function countDataset(dataset) {
  return dataset.lessons.reduce(
    (acc, lesson) => {
      acc.lessons += 1;
      acc.vocabulary += lesson.vocabulary.length;
      acc.exercises += lesson.exercises.length;
      return acc;
    },
    { lessons: 0, vocabulary: 0, exercises: 0 },
  );
}

async function upsertVocabulary(tx, item, language, dataset, lesson) {
  if (!item.word) return null;

  const existing = await tx.vocabulary.findFirst({
    where: { word: item.word, languageId: language.id },
  });

  const baseTags = [
    `source:${dataset.source.id}`,
    `level:${lesson.level || dataset.module.level || 1}`,
    dataset.language.track ? `track:${dataset.language.track}` : null,
  ].filter(Boolean);

  const data = {
    word: item.word,
    transliteration: item.transliteration || null,
    translation: normalizeTranslation(item.translation),
    partOfSpeech: normalizePartOfSpeech(item.partOfSpeech || item.pos),
    examples: Array.isArray(item.examples) ? item.examples : null,
    tags: mergeTags(existing?.tags, item.tags, baseTags),
    languageId: language.id,
  };

  if (existing) {
    return tx.vocabulary.update({
      where: { id: existing.id },
      data: {
        transliteration: data.transliteration || existing.transliteration,
        translation: data.translation || existing.translation,
        partOfSpeech: data.partOfSpeech || existing.partOfSpeech,
        examples: data.examples || existing.examples,
        tags: data.tags,
      },
    });
  }

  return tx.vocabulary.create({ data });
}

async function findVocabulary(tx, word, language, cache) {
  if (!word) return null;
  if (cache.has(word)) return cache.get(word);
  const found = await tx.vocabulary.findFirst({
    where: { word, languageId: language.id },
  });
  if (found) cache.set(word, found);
  return found;
}

async function importDataset(dataset, datasetPath) {
  const prisma = new PrismaClient();
  const stats = countDataset(dataset);

  try {
    await prisma.$transaction(async (tx) => {
      const language = await tx.language.upsert({
        where: { code: dataset.language.code },
        update: { name: dataset.language.name || dataset.language.code },
        create: {
          code: dataset.language.code,
          name: dataset.language.name || dataset.language.code,
        },
      });

      const module = await tx.module.upsert({
        where: { slug: dataset.module.slug },
        update: {
          title: dataset.module.title,
          subtitle: dataset.module.subtitle || null,
          description: dataset.module.description || null,
          level: dataset.module.level || 1,
          colorA: dataset.module.colorA || null,
          colorB: dataset.module.colorB || null,
          shadowColor: dataset.module.shadowColor || null,
          isPublished: Boolean(dataset.module.isPublished),
        },
        create: {
          slug: dataset.module.slug,
          title: dataset.module.title,
          subtitle: dataset.module.subtitle || null,
          description: dataset.module.description || null,
          level: dataset.module.level || 1,
          colorA: dataset.module.colorA || null,
          colorB: dataset.module.colorB || null,
          shadowColor: dataset.module.shadowColor || null,
          isPublished: Boolean(dataset.module.isPublished),
        },
      });

      for (const lesson of dataset.lessons) {
        const dbLesson = await tx.lesson.upsert({
          where: { slug: lesson.slug },
          update: {
            title: lesson.title,
            subtitle: lesson.subtitle || null,
            description: lesson.description || null,
            content: lessonContent(dataset, lesson),
            order: lesson.order || 0,
            duration: lesson.duration || null,
            level: lesson.level || dataset.module.level || 1,
            isPublished: Boolean(lesson.isPublished),
            moduleId: module.id,
            languageId: language.id,
          },
          create: {
            slug: lesson.slug,
            title: lesson.title,
            subtitle: lesson.subtitle || null,
            description: lesson.description || null,
            content: lessonContent(dataset, lesson),
            order: lesson.order || 0,
            duration: lesson.duration || null,
            level: lesson.level || dataset.module.level || 1,
            isPublished: Boolean(lesson.isPublished),
            moduleId: module.id,
            languageId: language.id,
          },
        });

        const vocabularyByWord = new Map();
        for (const item of lesson.vocabulary) {
          const vocab = await upsertVocabulary(tx, item, language, dataset, lesson);
          if (vocab) vocabularyByWord.set(item.word, vocab);
        }

        await tx.exercise.deleteMany({ where: { lessonId: dbLesson.id } });

        for (const [index, exercise] of lesson.exercises.entries()) {
          const vocabulary = await findVocabulary(tx, exercise.vocabularyWord, language, vocabularyByWord);
          await tx.exercise.create({
            data: {
              type: exercise.type,
              prompt: exercise.prompt || null,
              data: exerciseData(dataset, exercise, index),
              answer: exercise.answer || null,
              points: exercise.points || 10,
              lessonId: dbLesson.id,
              vocabularyId: vocabulary?.id || null,
            },
          });
        }
      }
    }, { timeout: 60000 });

    console.log(`Import OK: ${datasetPath}`);
    console.log(`Source: ${dataset.source.id}`);
    console.log(`Leçons: ${stats.lessons}, vocabulaire: ${stats.vocabulary}, exercices: ${stats.exercises}`);
  } finally {
    await prisma.$disconnect();
  }
}

async function main() {
  const { datasetPath, dryRun } = parseArgs(process.argv.slice(2));
  const raw = await fs.readFile(datasetPath, 'utf8');
  const dataset = JSON.parse(raw);

  assertDataset(dataset, datasetPath);

  const stats = countDataset(dataset);
  if (dryRun) {
    console.log(`Dry run OK: ${datasetPath}`);
    console.log(`Source: ${dataset.source.id}`);
    console.log(`Module: ${dataset.module.slug}`);
    console.log(`Leçons: ${stats.lessons}, vocabulaire: ${stats.vocabulary}, exercices: ${stats.exercises}`);
    return;
  }

  await importDataset(dataset, datasetPath);
}

main().catch((err) => {
  console.error('Import PDF dataset failed:', err.message);
  process.exit(1);
});
