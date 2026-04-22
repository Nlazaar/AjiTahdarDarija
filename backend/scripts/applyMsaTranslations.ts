/**
 * Applique le dictionnaire Darija→MSA (scripts/msaTranslations.ts) aux vocabs
 * ar-SA dupliqués (tag `msa-dup-source:…`).
 *
 * Logique d'application :
 *   - Match EXACT sur vocabulary.word (pas de trim ni normalisation unicode).
 *   - Si `requireFr` est défini, on exige que translation.fr (lowercased)
 *     contienne ce token → désambiguïsation pour les mots polysémiques.
 *   - On met à jour word + transliteration ; on tague le vocab avec
 *     `msa-translated` pour audit.
 *   - Les vocabs déjà tagués `msa-translated` sont re-appliqués sans double-tag.
 *
 * Idempotent : relancer le script re-met en place les bonnes valeurs si un
 * vocab a été édité manuellement entretemps. Le rapport final liste les
 * vocabs encore en Darija (à corriger via admin).
 *
 * Usage: npx tsx scripts/applyMsaTranslations.ts
 */
import { PrismaClient } from '@prisma/client';
import { MSA_TRANSLATIONS } from './msaTranslations';

const prisma = new PrismaClient();

const TRANSLATED_TAG = 'msa-translated';

async function main() {
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('  Application dictionnaire Darija → MSA');
  console.log('═══════════════════════════════════════════════════════════════\n');
  console.log(`  ${MSA_TRANSLATIONS.length} entrées dans le dictionnaire\n`);

  // Index par word pour fetch ciblé
  const wordsToFetch = [...new Set(MSA_TRANSLATIONS.map(t => t.darija))];

  const vocabs = await prisma.vocabulary.findMany({
    where: {
      language: { code: 'ar-SA' },
      word: { in: wordsToFetch },
    },
    select: { id: true, word: true, transliteration: true, translation: true, tags: true },
  });

  // Ne cibler que les vocabs clonés depuis DARIJA
  const dupVocabs = vocabs.filter(v => v.tags.some(t => t.startsWith('msa-dup-source:')));
  console.log(`  ${dupVocabs.length} vocabs ar-SA dupliqués candidats\n`);

  let updated = 0;
  let skippedFrMismatch = 0;
  const byCategoryCount: Record<string, number> = {};

  for (const v of dupVocabs) {
    const candidates = MSA_TRANSLATIONS.filter(t => t.darija === v.word);
    if (candidates.length === 0) continue;

    const fr = (v.translation as { fr?: string } | null)?.fr?.toLowerCase() ?? '';

    // Si plusieurs candidats (cas polysémique), on cherche celui dont requireFr matche
    let chosen: (typeof candidates)[number] | null = null;
    for (const c of candidates) {
      if (!c.requireFr) {
        chosen = c; // fallback si pas de gating
        break;
      }
      if (fr.includes(c.requireFr.toLowerCase())) {
        chosen = c;
        break;
      }
    }
    if (!chosen) {
      skippedFrMismatch++;
      continue;
    }

    // Rien à faire si déjà en MSA (idempotence)
    if (v.word === chosen.msa && v.transliteration === chosen.translit) {
      // Toujours ajouter le tag si manquant
      if (!v.tags.includes(TRANSLATED_TAG)) {
        await prisma.vocabulary.update({
          where: { id: v.id },
          data: { tags: [...v.tags, TRANSLATED_TAG] },
        });
      }
      continue;
    }

    const newTags = v.tags.includes(TRANSLATED_TAG) ? v.tags : [...v.tags, TRANSLATED_TAG];
    await prisma.vocabulary.update({
      where: { id: v.id },
      data: { word: chosen.msa, transliteration: chosen.translit, tags: newTags },
    });
    updated++;
    byCategoryCount[chosen.darija] = (byCategoryCount[chosen.darija] ?? 0) + 1;
  }

  console.log(`  ✓ ${updated} vocabs traduits Darija → MSA`);
  if (skippedFrMismatch) {
    console.log(`  ⚠ ${skippedFrMismatch} vocabs ignorés (translation FR ne matche aucune variante)`);
  }

  // ─── Rapport de couverture ─────────────────────────────────────────────
  console.log('\n───────────────────────────────────────────────────────────────');
  console.log('  Rapport de couverture');
  console.log('───────────────────────────────────────────────────────────────\n');

  const allDup = await prisma.vocabulary.findMany({
    where: { language: { code: 'ar-SA' } },
    select: { id: true, tags: true },
  });
  const dupTotal     = allDup.filter(v => v.tags.some(t => t.startsWith('msa-dup-source:'))).length;
  const dupTranslated = allDup.filter(v => v.tags.includes(TRANSLATED_TAG)).length;
  const pct = dupTotal ? ((dupTranslated / dupTotal) * 100).toFixed(1) : '0';

  console.log(`  Vocabs dupliqués MSA      : ${dupTotal}`);
  console.log(`  Traduits automatiquement  : ${dupTranslated} (${pct}%)`);
  console.log(`  À corriger manuellement   : ${dupTotal - dupTranslated}\n`);

  // Top 15 des mots les plus fréquents non traduits → priorité admin
  const untranslated = await prisma.vocabulary.findMany({
    where: {
      language: { code: 'ar-SA' },
      NOT: { tags: { has: TRANSLATED_TAG } },
    },
    select: { word: true, tags: true },
  });
  const untranslatedDup = untranslated.filter(v => v.tags.some(t => t.startsWith('msa-dup-source:')));
  const freq: Record<string, number> = {};
  for (const v of untranslatedDup) freq[v.word] = (freq[v.word] ?? 0) + 1;
  const top = Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, 15);

  if (top.length) {
    console.log('  Top 15 mots non traduits (priorité admin) :');
    top.forEach(([w, n]) => console.log(`    ${n.toString().padStart(3)}×  ${w}`));
  }

  console.log('\n═══════════════════════════════════════════════════════════════');
  console.log('  Fin — les vocabs traduits portent le tag "msa-translated"');
  console.log('═══════════════════════════════════════════════════════════════\n');

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error('❌ Erreur :', e);
  prisma.$disconnect().finally(() => process.exit(1));
});
