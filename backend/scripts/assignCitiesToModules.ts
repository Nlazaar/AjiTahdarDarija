import { PrismaClient } from '@prisma/client'

/**
 * Route Nord → Sud → Désert — ordre parcours, aligné sur web/data/morocco-cities.ts.
 * Les N premiers modules DARIJA (triés par canonicalOrder asc) reçoivent les N
 * premières villes. Les villes suivantes restent "à venir" sur la carte.
 */
const ROUTE = [
  'tanger','asilah','larache','ksar-el-kebir','ouazzane','chefchaouen','tetouan',
  'al-hoceima','nador','saidia','berkane','oujda','figuig',
  'taza','fes','sefrou','meknes','moulay-idriss','ifrane','azrou','khenifra',
  'beni-mellal','khouribga','settat',
  'kenitra','sale','rabat','mohammedia','casablanca',
  'el-jadida','oualidia','safi','essaouira',
  'marrakech',
  'agadir','taroudant','tiznit','sidi-ifni',
  'ouarzazate','ait-benhaddou','zagora','mhamid','erfoud','merzouga','rissani',
  'guelmim','tan-tan','tarfaya','laayoune','boujdour','dakhla',
]

async function main() {
  const prisma = new PrismaClient()
  const mods = await prisma.module.findMany({
    where: { track: 'DARIJA' },
    orderBy: { canonicalOrder: 'asc' },
    select: { id: true, slug: true, canonicalOrder: true, cityInfo: true },
  })

  if (mods.length > ROUTE.length) {
    console.warn(`⚠  ${mods.length} modules > ${ROUTE.length} villes prévues. Étends la route dans morocco-cities.ts.`)
  }

  let updated = 0
  for (let i = 0; i < mods.length; i++) {
    const m = mods[i]
    const cityKey = ROUTE[i]
    if (!cityKey) break
    const existing = (m.cityInfo ?? {}) as Record<string, unknown>
    if (existing.cityKey === cityKey) continue
    await prisma.module.update({
      where: { id: m.id },
      data: { cityInfo: { ...existing, cityKey } },
    })
    console.log(`  cO:${String(m.canonicalOrder).padStart(3)}  ${m.slug.padEnd(32)} → ${cityKey}`)
    updated++
  }

  console.log(`\n✓ ${updated} modules mis à jour / ${mods.length} total`)
  await prisma.$disconnect()
}

main().catch(e => { console.error(e); process.exit(1) })
