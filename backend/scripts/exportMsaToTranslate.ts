/**
 * Exporte les vocabs MSA dupliqués depuis le Darija mais PAS ENCORE traduits
 * (tag `msa-dup-source:*` sans tag `msa-translated`) vers un CSV éditable.
 *
 * L'utilisateur édite les colonnes `msa` et `translit_msa`. Le ré-import se
 * fait via `importMsaTranslations.ts` (à écrire après retour du CSV).
 *
 * Usage: npx tsx scripts/exportMsaToTranslate.ts
 * Sortie: scripts/msa-to-translate.csv
 */
import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

function csvEscape(v: string | null | undefined): string {
  if (v == null) return '';
  const s = String(v);
  // Échappement RFC 4180 : doubler les guillemets, entourer si , ; " ou retour ligne
  if (/[",;\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

async function main() {
  // 1) Récupère les vocabs ar-SA dupliqués non traduits
  const vocabs = await prisma.vocabulary.findMany({
    where: { language: { code: 'ar-SA' } },
    select: {
      id: true,
      word: true,
      transliteration: true,
      translation: true,
      tags: true,
    },
  });

  const toTranslate = vocabs.filter(
    (v) =>
      v.tags.some((t) => t.startsWith('msa-dup-source:')) &&
      !v.tags.includes('msa-translated'),
  );

  console.log(`  ${vocabs.length} vocabs ar-SA au total`);
  console.log(`  ${toTranslate.length} à traduire (dupliqués non tagués msa-translated)\n`);

  // 2) Résolution du "module" de chaque vocab via Exercise → LessonExercise → Lesson → Module
  //    On prend le 1er module trouvé comme contexte thématique.
  const vocabIds = toTranslate.map((v) => v.id);
  const exercises = await prisma.exercise.findMany({
    where: { vocabularyId: { in: vocabIds } },
    select: { vocabularyId: true, lessonId: true },
  });
  const lessonIds = [...new Set(exercises.map((e) => e.lessonId).filter(Boolean))] as string[];
  const lessons = await prisma.lesson.findMany({
    where: { id: { in: lessonIds } },
    select: { id: true, module: { select: { title: true } } },
  });
  const lessonModule = new Map<string, string>();
  for (const l of lessons) {
    if (l.module?.title) lessonModule.set(l.id, l.module.title);
  }
  const vocabModule = new Map<string, string>();
  for (const ex of exercises) {
    if (!ex.lessonId) continue;
    if (vocabModule.has(ex.vocabularyId)) continue;
    const m = lessonModule.get(ex.lessonId);
    if (m) vocabModule.set(ex.vocabularyId, m);
  }

  // 3) Génération CSV
  const header = ['id', 'darija', 'translit_darija', 'fr', 'module', 'msa', 'translit_msa', 'notes'];
  const rows: string[] = [header.join(',')];

  // Tri par module puis par darija pour faciliter la traduction par thème
  toTranslate.sort((a, b) => {
    const ma = vocabModule.get(a.id) ?? 'zzz';
    const mb = vocabModule.get(b.id) ?? 'zzz';
    if (ma !== mb) return ma.localeCompare(mb);
    return a.word.localeCompare(b.word);
  });

  for (const v of toTranslate) {
    const fr = (v.translation as { fr?: string } | null)?.fr ?? '';
    const mod = vocabModule.get(v.id) ?? '';
    rows.push([
      csvEscape(v.id),
      csvEscape(v.word),
      csvEscape(v.transliteration ?? ''),
      csvEscape(fr),
      csvEscape(mod),
      '', // msa à remplir
      '', // translit_msa à remplir
      '', // notes
    ].join(','));
  }

  const outPath = path.resolve(__dirname, 'msa-to-translate.csv');
  fs.writeFileSync(outPath, rows.join('\n') + '\n', 'utf8');
  const sizeKB = (fs.statSync(outPath).size / 1024).toFixed(1);

  console.log(`✅ Écrit : ${outPath}`);
  console.log(`   ${toTranslate.length} lignes, ${sizeKB} KB`);
  console.log('\nColonnes à remplir : msa, translit_msa (notes optionnelles)');
}

main()
  .catch((e) => {
    console.error('❌ Erreur :', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
