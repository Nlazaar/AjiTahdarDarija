/**
 * Corrige les subtitles des modules MSA qui mentionnent encore "Darija"
 * (hérités de la duplication) en "arabe standard".
 *
 * Remplacements :
 *   "en Darija"   → "en arabe standard"
 *   "en darija"   → "en arabe standard"
 *   "Darija"      → "arabe standard"  (fallback si "en" absent)
 *
 * Idempotent : si le subtitle ne contient plus "Darija", rien ne change.
 *
 * Usage: npx tsx scripts/fixMsaSubtitles.ts
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function fix(text: string): string {
  return text
    .replace(/\ben Darija\b/g, 'en arabe standard')
    .replace(/\ben darija\b/g, 'en arabe standard')
    .replace(/\bDarija\b/g, 'arabe standard')
    .replace(/\bdarija\b/g, 'arabe standard');
}

async function main() {
  console.log('🔧 Fix MSA subtitles/descriptions — "Darija" → "arabe standard"\n');

  // Modules
  const mods = await prisma.module.findMany({
    where: {
      track: 'MSA',
      OR: [
        { subtitle:    { contains: 'arija' } },
        { description: { contains: 'arija' } },
      ],
    },
    select: { id: true, slug: true, subtitle: true, description: true },
  });

  let modsUpdated = 0;
  for (const m of mods) {
    const newSub  = m.subtitle    ? fix(m.subtitle)    : m.subtitle;
    const newDesc = m.description ? fix(m.description) : m.description;
    if (newSub !== m.subtitle || newDesc !== m.description) {
      await prisma.module.update({
        where: { id: m.id },
        data: { subtitle: newSub, description: newDesc },
      });
      modsUpdated++;
      console.log(`  ↻ ${m.slug}`);
      if (newSub !== m.subtitle)   console.log(`      subtitle:    ${m.subtitle} → ${newSub}`);
      if (newDesc !== m.description) console.log(`      description: ${m.description?.slice(0,60)} → ${newDesc?.slice(0,60)}`);
    }
  }
  console.log(`\n   ✓ ${modsUpdated} modules corrigés`);

  // Lessons
  const lessons = await prisma.lesson.findMany({
    where: {
      module: { track: 'MSA' },
      OR: [
        { title:       { contains: 'arija' } },
        { subtitle:    { contains: 'arija' } },
        { description: { contains: 'arija' } },
      ],
    },
    select: { id: true, slug: true, title: true, subtitle: true, description: true },
  });

  let lessonsUpdated = 0;
  for (const l of lessons) {
    const newTitle = l.title       ? fix(l.title)       : l.title;
    const newSub   = l.subtitle    ? fix(l.subtitle)    : l.subtitle;
    const newDesc  = l.description ? fix(l.description) : l.description;
    if (newTitle !== l.title || newSub !== l.subtitle || newDesc !== l.description) {
      await prisma.lesson.update({
        where: { id: l.id },
        data: { title: newTitle, subtitle: newSub, description: newDesc },
      });
      lessonsUpdated++;
      console.log(`  ↻ lesson ${l.slug}`);
    }
  }
  console.log(`   ✓ ${lessonsUpdated} lessons corrigées`);

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error('❌ Erreur :', e);
  prisma.$disconnect().finally(() => process.exit(1));
});
