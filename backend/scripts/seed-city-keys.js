// Assigne un cityKey à chaque module DARIJA sans cityKey, en suivant leur
// canonicalOrder et l'ordre des villes dans web/data/morocco-cities.ts.
// Les modules déjà munis d'un cityKey sont laissés tels quels.
//
// Usage : node backend/scripts/seed-city-keys.js [--dry]

const { PrismaClient } = require('@prisma/client');

// Liste statique des 51 villes, ordre identique à web/data/morocco-cities.ts.
// Si tu modifies la liste côté web, re-synchronise ici.
const CITY_KEYS_IN_ORDER = [
  'tanger', 'asilah', 'larache', 'ksar-el-kebir', 'ouazzane', 'chefchaouen', 'tetouan',
  'al-hoceima', 'nador', 'saidia', 'berkane', 'oujda', 'figuig',
  'taza', 'fes', 'sefrou', 'meknes', 'moulay-idriss', 'ifrane', 'azrou', 'khenifra',
  'beni-mellal', 'khouribga', 'settat',
  'kenitra', 'sale', 'rabat', 'mohammedia', 'casablanca',
  'el-jadida', 'oualidia', 'safi', 'essaouira',
  'marrakech',
  'agadir', 'taroudant', 'tiznit', 'sidi-ifni',
  'ouarzazate', 'ait-benhaddou', 'zagora', 'mhamid', 'erfoud', 'merzouga', 'rissani',
  'guelmim', 'tan-tan', 'tarfaya', 'laayoune', 'boujdour', 'dakhla',
];

// Overrides explicites slug → cityKey (les modules déjà nommés d'après une ville)
const SLUG_OVERRIDES = {
  'tanger-salutations': 'tanger',
  'asilah-les-nombres': 'asilah',
};

(async () => {
  const dry = process.argv.includes('--dry');
  const prisma = new PrismaClient();
  try {
    const modules = await prisma.module.findMany({
      where: { track: 'DARIJA' },
      orderBy: { canonicalOrder: 'asc' },
      select: { id: true, slug: true, canonicalOrder: true, cityInfo: true },
    });

    let cursor = 0; // index dans CITY_KEYS_IN_ORDER pour les modules sans override
    const usedKeys = new Set();
    const plan = [];

    // 1ʳᵉ passe : appliquer les overrides et marquer les clés déjà prises
    for (const m of modules) {
      const existingKey = m.cityInfo?.cityKey;
      if (existingKey) { usedKeys.add(existingKey); continue; }
      const override = SLUG_OVERRIDES[m.slug];
      if (override) usedKeys.add(override);
    }

    for (const m of modules) {
      const existingKey = m.cityInfo?.cityKey;
      if (existingKey) {
        plan.push({ slug: m.slug, order: m.canonicalOrder, cityKey: existingKey, action: 'keep' });
        continue;
      }
      let targetKey = SLUG_OVERRIDES[m.slug];
      if (!targetKey) {
        // Avance le curseur jusqu'à trouver une clé libre
        while (cursor < CITY_KEYS_IN_ORDER.length && usedKeys.has(CITY_KEYS_IN_ORDER[cursor])) cursor++;
        if (cursor >= CITY_KEYS_IN_ORDER.length) {
          plan.push({ slug: m.slug, order: m.canonicalOrder, cityKey: null, action: 'skip-no-city' });
          continue;
        }
        targetKey = CITY_KEYS_IN_ORDER[cursor];
        cursor++;
      }
      usedKeys.add(targetKey);
      plan.push({ slug: m.slug, order: m.canonicalOrder, cityKey: targetKey, action: 'assign', id: m.id, prevCityInfo: m.cityInfo });
    }

    console.log('📍 Plan d\'assignation :');
    for (const p of plan) {
      const marker = p.action === 'keep' ? '·' : p.action === 'assign' ? '✚' : '✗';
      console.log(`  ${marker} [#${String(p.order).padStart(3)}] ${p.slug.padEnd(30)} → ${p.cityKey ?? '(rien)'}  (${p.action})`);
    }

    if (dry) {
      console.log('\n(dry-run, aucune écriture)');
      return;
    }

    let updated = 0;
    for (const p of plan) {
      if (p.action !== 'assign') continue;
      const nextCityInfo = { ...(p.prevCityInfo ?? {}), cityKey: p.cityKey };
      await prisma.module.update({
        where: { id: p.id },
        data: { cityInfo: nextCityInfo },
      });
      updated++;
    }
    console.log(`\n✅ ${updated} module(s) mis à jour.`);
  } finally {
    await prisma.$disconnect();
  }
})().catch(e => { console.error(e); process.exit(1); });
