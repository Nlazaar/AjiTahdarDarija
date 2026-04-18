/**
 * Refonte complète du module Salutations Darija (canonicalOrder=1, track=DARIJA) :
 *   - 12 leçons (une par mot/expression)
 *   - 5 exercices par leçon : LISTENING, MCQ reconnaissance, ARABIC_KEYBOARD, DRAWING, MCQ production
 *   - Total : 60 exercices
 *
 * Supprime les leçons actuelles avant de recréer.
 *
 * Usage: npx tsx scripts/seedSalutationsRefonte.ts
 */
import { PrismaClient, ExerciseType } from '@prisma/client';

const prisma = new PrismaClient();

type Greeting = {
  arabic: string;        // texte arabe
  transliteration: string; // phonétique
  fr: string;            // traduction française principale
  frAlt?: string;        // variante de traduction (pour distraction)
  context: string;       // quand l'utiliser
};

const GREETINGS: Greeting[] = [
  { arabic: 'مرحبا',         transliteration: 'marhaba',        fr: 'Bonjour',              context: 'Salutation générale' },
  { arabic: 'السلام عليكم',  transliteration: 'salam 3likoum',  fr: 'Paix sur vous',        frAlt: 'Salutation formelle', context: 'Salutation respectueuse' },
  { arabic: 'كيداير',        transliteration: 'kidayr',         fr: 'Comment vas-tu ? (m)', context: 'À un homme' },
  { arabic: 'كيدايرة',       transliteration: 'kidayra',        fr: 'Comment vas-tu ? (f)', context: 'À une femme' },
  { arabic: 'لاباس',         transliteration: 'labas',          fr: 'Ça va / Pas de mal',   context: 'Réponse à "comment vas-tu"' },
  { arabic: 'بخير',          transliteration: 'bkhir',          fr: 'Bien / En bonne santé', context: 'Réponse positive' },
  { arabic: 'شكرا',          transliteration: 'chokran',        fr: 'Merci',                context: 'Remerciement' },
  { arabic: 'عفاك',          transliteration: '3afak',          fr: "S'il te plaît",        context: 'Demande polie' },
  { arabic: 'سمحلي',         transliteration: 'smahli',         fr: 'Excuse-moi / Pardon',  context: "Pour s'excuser" },
  { arabic: 'بسلامة',        transliteration: 'bslama',         fr: 'Au revoir',            context: 'Pour partir' },
  { arabic: 'إيه',           transliteration: 'iyeh',           fr: 'Oui',                  context: 'Accord' },
  { arabic: 'لا',            transliteration: 'la',             fr: 'Non',                  context: 'Refus' },
];

const COLORS = { colorA: '#f4a261', colorB: '#e76f51', shadowColor: '#c75b3f' };

function pickDistractors<T>(correct: T, pool: T[], count: number): T[] {
  return [...pool].filter(x => x !== correct).sort(() => Math.random() - 0.5).slice(0, count);
}

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

function buildLessonExercises(g: Greeting, all: Greeting[]) {
  const others = all.filter(x => x.arabic !== g.arabic);

  // 1. LISTENING — entendre, choisir l'arabe
  const listenDistractors = pickDistractors(g, others, 3);
  const listenPool = shuffle([g, ...listenDistractors]);
  const listenOptions = listenPool.map((x, i) => ({
    id: 'abcd'[i],
    text: x.arabic,
    transliteration: x.transliteration,
  }));
  const listenCorrectId = listenOptions.find(o => o.text === g.arabic)!.id;

  // 2. MCQ reconnaissance — voir l'arabe, choisir le sens français
  const recogDistractors = pickDistractors(g, others, 3);
  const recogPool = shuffle([g, ...recogDistractors]);
  const recogOptions = recogPool.map((x, i) => ({
    id: 'abcd'[i],
    text: x.fr,
  }));
  const recogCorrectId = recogOptions.find(o => o.text === g.fr)!.id;

  // 5. MCQ production — voir le français, choisir l'arabe
  const prodDistractors = pickDistractors(g, others, 3);
  const prodPool = shuffle([g, ...prodDistractors]);
  const prodOptions = prodPool.map((x, i) => ({
    id: 'abcd'[i],
    text: x.arabic,
    transliteration: x.transliteration,
  }));
  const prodCorrectId = prodOptions.find(o => o.text === g.arabic)!.id;

  // DRAWING : pour les mots longs, on abaisse le seuil
  const tracedChars = g.arabic.replace(/\s/g, '').length;
  const threshold = tracedChars >= 5 ? 0.25 : tracedChars >= 3 ? 0.35 : 0.45;

  return [
    {
      type: ExerciseType.LISTENING,
      prompt: `Quel mot entends-tu ?`,
      data: { text: g.arabic, lang: 'ar-MA', audio: g.arabic, options: listenOptions },
      answer: { id: listenCorrectId },
      points: 10,
    },
    {
      type: ExerciseType.MULTIPLE_CHOICE,
      prompt: `Que signifie  «  ${g.arabic}  »  (${g.transliteration}) ?`,
      data: { options: recogOptions },
      answer: { id: recogCorrectId },
      points: 10,
    },
    {
      type: ExerciseType.ARABIC_KEYBOARD,
      prompt: `Écris  «  ${g.fr}  »  en arabe`,
      data: {
        target: g.arabic,
        targetTransliteration: g.transliteration,
        translation: g.fr,
        hint: g.context,
        audio: g.arabic,
      },
      answer: { text: g.arabic },
      points: 15,
    },
    {
      type: ExerciseType.DRAWING,
      prompt: `Trace  «  ${g.arabic}  »`,
      data: { target: g.arabic, hint: `${g.transliteration} — ${g.fr}`, threshold },
      answer: { value: g.arabic },
      points: 15,
    },
    {
      type: ExerciseType.MULTIPLE_CHOICE,
      prompt: `Comment dit-on  «  ${g.fr}  »  en darija ?`,
      data: { options: prodOptions, hint: g.context },
      answer: { id: prodCorrectId },
      points: 15,
    },
  ];
}

async function main() {
  console.log('👋 Refonte Salutations Darija\n');

  const mod = await prisma.module.findUnique({
    where: { slug: 'salutations-darija' },
  });
  if (!mod) {
    console.error('❌ Module salutations-darija introuvable.');
    process.exit(1);
  }
  console.log(`Module : ${mod.slug}  (id=${mod.id})`);

  // Purge du module phantom (doublon vide, non publié)
  const phantom = await prisma.module.findUnique({ where: { slug: 'module-salutations' } });
  if (phantom) {
    console.log(`\n🗑️  Suppression du module phantom ${phantom.slug} (id=${phantom.id})…`);
    const phantomLessons = await prisma.lesson.findMany({ where: { moduleId: phantom.id }, select: { id: true } });
    for (const l of phantomLessons) {
      await prisma.exercise.deleteMany({ where: { lessonId: l.id } });
    }
    await prisma.lesson.deleteMany({ where: { moduleId: phantom.id } });
    await prisma.module.delete({ where: { id: phantom.id } });
    console.log('   ✓ Module phantom supprimé');
  }

  const lang = await prisma.language.findUnique({ where: { code: 'ar-MA' } });
  if (!lang) {
    console.error('❌ Langue ar-MA introuvable.');
    process.exit(1);
  }

  const existingLessons = await prisma.lesson.findMany({
    where: { moduleId: mod.id },
    select: { id: true },
  });
  console.log(`\n🗑️  Suppression de ${existingLessons.length} leçons existantes…`);
  for (const l of existingLessons) {
    await prisma.exercise.deleteMany({ where: { lessonId: l.id } });
  }
  await prisma.lesson.deleteMany({ where: { moduleId: mod.id } });
  console.log('   ✓ Leçons + exercices supprimés');

  await prisma.module.update({
    where: { id: mod.id },
    data: {
      title: 'Les Salutations',
      subtitle: 'Bonjour, merci, au revoir',
      description: 'Apprends les 12 expressions essentielles pour saluer, remercier et prendre congé en darija.',
      ...COLORS,
    },
  });

  console.log(`\n📖 Création de ${GREETINGS.length} leçons × 5 exos…\n`);
  let totalExos = 0;

  for (let i = 0; i < GREETINGS.length; i++) {
    const g = GREETINGS[i];
    const order = i + 1;
    const lesson = await prisma.lesson.create({
      data: {
        moduleId: mod.id,
        languageId: lang.id,
        slug: `salutations-darija-lecon-${order}`,
        title: `${g.arabic}  —  ${g.fr}`,
        subtitle: g.transliteration,
        order,
        isPublished: true,
      },
    });

    const exos = buildLessonExercises(g, GREETINGS);
    for (const exo of exos) {
      await prisma.exercise.create({
        data: {
          lessonId: lesson.id,
          type: exo.type,
          prompt: exo.prompt,
          data: exo.data,
          answer: exo.answer,
          points: exo.points,
        },
      });
      totalExos++;
    }

    console.log(`   ✓ [${order.toString().padStart(2)}] ${g.arabic.padEnd(18)} ${g.fr.padEnd(30)} 5 exos`);
  }

  console.log(`\n✅ Terminé : ${GREETINGS.length} leçons, ${totalExos} exercices.`);
  console.log(`\n🎤 ${GREETINGS.length} textes arabes uniques à avoir en audio (relance _exportAudioQueue.ts).\n`);

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error('❌ Erreur :', e);
  process.exit(1);
});
