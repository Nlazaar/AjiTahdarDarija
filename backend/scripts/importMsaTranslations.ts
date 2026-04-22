/**
 * Importe les traductions MSA saisies manuellement via CSV dans la DB.
 *
 * Source : scripts/msa-translated.csv (colonnes remplies : msa, translit_msa).
 * Cible  : Vocabulary (language ar-SA, tag `msa-dup-source:*`).
 *
 * Logique :
 *   - Match exact par `id` (les IDs viennent de l'export, aucune ambiguïté).
 *   - Met à jour `word` (← msa) et `transliteration` (← translit_msa).
 *   - Ajoute les tags `msa-translated` + `msa-manual` de façon idempotente.
 *   - Saute les lignes où `msa` est vide ou identique au darija (non traduit).
 *
 * Usage:
 *   npx tsx scripts/importMsaTranslations.ts --dry-run   # aperçu sans écrire
 *   npx tsx scripts/importMsaTranslations.ts              # applique pour de vrai
 */
import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

const TRANSLATED_TAG = 'msa-translated';
const MANUAL_TAG = 'msa-manual';

type Row = {
  id: string;
  darija: string;
  translit_darija: string;
  fr: string;
  module: string;
  msa: string;
  translit_msa: string;
  notes: string;
};

/** Parser CSV RFC 4180 (supporte guillemets, doubles guillemets, retours ligne dans les champs). */
function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let inQuotes = false;
  let i = 0;
  while (i < text.length) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') { field += '"'; i += 2; continue; }
        inQuotes = false; i++; continue;
      }
      field += c; i++; continue;
    }
    if (c === '"') { inQuotes = true; i++; continue; }
    if (c === ',') { row.push(field); field = ''; i++; continue; }
    if (c === '\r') { i++; continue; }
    if (c === '\n') { row.push(field); rows.push(row); row = []; field = ''; i++; continue; }
    field += c; i++;
  }
  // Dernière ligne sans \n final
  if (field.length > 0 || row.length > 0) { row.push(field); rows.push(row); }
  return rows;
}

function rowsToObjects(rows: string[][]): Row[] {
  if (rows.length === 0) return [];
  const header = rows[0].map((h) => h.trim());
  const idx = (name: string) => {
    const i = header.indexOf(name);
    if (i < 0) throw new Error(`Colonne manquante dans le CSV : "${name}"`);
    return i;
  };
  const iId = idx('id'), iDar = idx('darija'), iTrDar = idx('translit_darija'),
        iFr = idx('fr'), iMod = idx('module'), iMsa = idx('msa'),
        iTrMsa = idx('translit_msa'), iNotes = idx('notes');
  return rows.slice(1)
    .filter((r) => r.length > 1 && r[iId]?.trim())
    .map<Row>((r) => ({
      id: r[iId].trim(),
      darija: r[iDar] ?? '',
      translit_darija: r[iTrDar] ?? '',
      fr: r[iFr] ?? '',
      module: r[iMod] ?? '',
      msa: (r[iMsa] ?? '').trim(),
      translit_msa: (r[iTrMsa] ?? '').trim(),
      notes: r[iNotes] ?? '',
    }));
}

async function main() {
  const dryRun = process.argv.includes('--dry-run');
  const csvPath = path.resolve(__dirname, 'msa-translated.csv');

  console.log('═══════════════════════════════════════════════════════════════');
  console.log(`  Import traductions MSA ${dryRun ? '(DRY-RUN)' : '(APPLY)'}`);
  console.log('═══════════════════════════════════════════════════════════════\n');

  if (!fs.existsSync(csvPath)) {
    console.error(`❌ Fichier introuvable : ${csvPath}`);
    process.exit(1);
  }

  const raw = fs.readFileSync(csvPath, 'utf8');
  // Supprime un BOM UTF-8 éventuel en tête de fichier
  const text = raw.replace(/^\uFEFF/, '');
  const rows = rowsToObjects(parseCsv(text));
  console.log(`  ${rows.length} lignes avec id dans le CSV\n`);

  // Charge tous les vocabs concernés en une requête
  const ids = rows.map((r) => r.id);
  const vocabs = await prisma.vocabulary.findMany({
    where: { id: { in: ids } },
    select: { id: true, word: true, transliteration: true, tags: true },
  });
  const byId = new Map(vocabs.map((v) => [v.id, v]));
  console.log(`  ${vocabs.length} vocabs correspondants trouvés en DB\n`);

  const missingIds = ids.filter((id) => !byId.has(id));
  if (missingIds.length) {
    console.log(`  ⚠ ${missingIds.length} IDs du CSV absents de la DB (ignorés)`);
  }

  let toUpdate = 0;
  let emptyMsa = 0;
  let unchanged = 0;
  const samples: string[] = [];

  for (const r of rows) {
    const v = byId.get(r.id);
    if (!v) continue;
    if (!r.msa) { emptyMsa++; continue; }

    const sameWord = v.word === r.msa;
    const sameTr = (v.transliteration ?? '') === r.translit_msa;
    const hasTrTag = v.tags.includes(TRANSLATED_TAG);
    const hasManualTag = v.tags.includes(MANUAL_TAG);

    if (sameWord && sameTr && hasTrTag && hasManualTag) { unchanged++; continue; }

    toUpdate++;
    if (samples.length < 5) {
      samples.push(`  ${r.darija}  →  ${r.msa}  (${r.translit_msa})  [${r.fr}]`);
    }

    if (!dryRun) {
      const newTags = [...v.tags];
      if (!hasTrTag) newTags.push(TRANSLATED_TAG);
      if (!hasManualTag) newTags.push(MANUAL_TAG);
      await prisma.vocabulary.update({
        where: { id: v.id },
        data: {
          word: r.msa,
          transliteration: r.translit_msa || null,
          tags: newTags,
        },
      });
    }
  }

  console.log('───────────────────────────────────────────────────────────────');
  console.log(`  À mettre à jour       : ${toUpdate}`);
  console.log(`  Déjà à jour (skip)    : ${unchanged}`);
  console.log(`  Lignes msa vide (skip): ${emptyMsa}`);
  console.log('───────────────────────────────────────────────────────────────\n');

  if (samples.length) {
    console.log('  Échantillon (5 premiers) :');
    samples.forEach((s) => console.log(s));
    console.log('');
  }

  if (dryRun) {
    console.log('  ℹ Aucun changement écrit (mode --dry-run).');
    console.log('    Relance sans --dry-run pour appliquer.');
  } else {
    console.log('  ✅ Import appliqué.');
  }

  console.log('\n═══════════════════════════════════════════════════════════════\n');
}

main()
  .catch((e) => {
    console.error('❌ Erreur :', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
