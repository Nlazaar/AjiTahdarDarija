/**
 * Refonte complète du module alphabet-darija :
 *   - 28 leçons (une par lettre arabe)
 *   - 5 exercices par leçon : LISTENING, MCQ reconnaissance, ARABIC_KEYBOARD, DRAWING, MCQ mot-exemple
 *   - Total : 140 exercices
 *
 * Supprime les leçons actuelles avant de recréer.
 *
 * Usage: npx tsx scripts/seedAlphabetRefonte.ts
 */
import { PrismaClient, ExerciseType } from '@prisma/client';

const prisma = new PrismaClient();

type Letter = {
  arabic: string;
  latin: string;       // romanisation courante
  nameAr: string;      // nom arabe de la lettre
  nameFr: string;      // nom francisé
  fr: string;          // courte description du son
  example: string;     // mot exemple en arabe
  exampleFr: string;   // traduction française du mot
};

const LETTERS: Letter[] = [
  { arabic: 'ا', latin: 'a',  nameAr: 'ألف',  nameFr: 'Alif',  fr: "voyelle longue 'a'",            example: 'أسد',    exampleFr: 'lion' },
  { arabic: 'ب', latin: 'b',  nameAr: 'باء',  nameFr: 'Ba',    fr: "comme 'b' dans bateau",         example: 'باب',    exampleFr: 'porte' },
  { arabic: 'ت', latin: 't',  nameAr: 'تاء',  nameFr: 'Ta',    fr: "comme 't' dans table",          example: 'تفاحة',  exampleFr: 'pomme' },
  { arabic: 'ث', latin: 'th', nameAr: 'ثاء',  nameFr: 'Tha',   fr: "'th' anglais de 'think'",       example: 'ثعلب',   exampleFr: 'renard' },
  { arabic: 'ج', latin: 'j',  nameAr: 'جيم',  nameFr: 'Jim',   fr: "comme 'j' dans jardin",         example: 'جمل',    exampleFr: 'chameau' },
  { arabic: 'ح', latin: 'h',  nameAr: 'حاء',  nameFr: 'Ha',    fr: "h aspiré profond",              example: 'حوت',    exampleFr: 'baleine' },
  { arabic: 'خ', latin: 'kh', nameAr: 'خاء',  nameFr: 'Kha',   fr: "comme le 'ch' allemand",        example: 'خبز',    exampleFr: 'pain' },
  { arabic: 'د', latin: 'd',  nameAr: 'دال',  nameFr: 'Dal',   fr: "comme 'd' dans dire",           example: 'دار',    exampleFr: 'maison' },
  { arabic: 'ذ', latin: 'dh', nameAr: 'ذال',  nameFr: 'Dhal',  fr: "'th' anglais de 'the'",         example: 'ذئب',    exampleFr: 'loup' },
  { arabic: 'ر', latin: 'r',  nameAr: 'راء',  nameFr: 'Ra',    fr: "r roulé",                       example: 'رجل',    exampleFr: 'homme' },
  { arabic: 'ز', latin: 'z',  nameAr: 'زاي',  nameFr: 'Zay',   fr: "comme 'z' dans zéro",           example: 'زيت',    exampleFr: 'huile' },
  { arabic: 'س', latin: 's',  nameAr: 'سين',  nameFr: 'Sin',   fr: "comme 's' dans soleil",         example: 'سماء',   exampleFr: 'ciel' },
  { arabic: 'ش', latin: 'sh', nameAr: 'شين',  nameFr: 'Shin',  fr: "comme 'ch' dans chat",          example: 'شمس',    exampleFr: 'soleil' },
  { arabic: 'ص', latin: 'S',  nameAr: 'صاد',  nameFr: 'Sad',   fr: "s emphatique, profond",         example: 'صديق',   exampleFr: 'ami' },
  { arabic: 'ض', latin: 'D',  nameAr: 'ضاد',  nameFr: 'Dad',   fr: "d emphatique, profond",         example: 'ضوء',    exampleFr: 'lumière' },
  { arabic: 'ط', latin: 'T',  nameAr: 'طاء',  nameFr: 'Ta_',   fr: "t emphatique",                  example: 'طفل',    exampleFr: 'enfant' },
  { arabic: 'ظ', latin: 'Z',  nameAr: 'ظاء',  nameFr: 'Za_',   fr: "z emphatique",                  example: 'ظل',     exampleFr: 'ombre' },
  { arabic: 'ع', latin: '3',  nameAr: 'عين',  nameFr: 'Ayn',   fr: "son guttural profond",          example: 'عين',    exampleFr: 'œil' },
  { arabic: 'غ', latin: 'gh', nameAr: 'غين',  nameFr: 'Ghayn', fr: "r grasseyé",                    example: 'غزال',   exampleFr: 'gazelle' },
  { arabic: 'ف', latin: 'f',  nameAr: 'فاء',  nameFr: 'Fa',    fr: "comme 'f' dans fleur",          example: 'فم',     exampleFr: 'bouche' },
  { arabic: 'ق', latin: 'q',  nameAr: 'قاف',  nameFr: 'Qaf',   fr: "k profond guttural",            example: 'قلب',    exampleFr: 'cœur' },
  { arabic: 'ك', latin: 'k',  nameAr: 'كاف',  nameFr: 'Kaf',   fr: "comme 'k' dans café",           example: 'كلب',    exampleFr: 'chien' },
  { arabic: 'ل', latin: 'l',  nameAr: 'لام',  nameFr: 'Lam',   fr: "comme 'l' dans lune",           example: 'ليل',    exampleFr: 'nuit' },
  { arabic: 'م', latin: 'm',  nameAr: 'ميم',  nameFr: 'Mim',   fr: "comme 'm' dans maison",         example: 'ماء',    exampleFr: 'eau' },
  { arabic: 'ن', latin: 'n',  nameAr: 'نون',  nameFr: 'Noun',  fr: "comme 'n' dans nuit",           example: 'نور',    exampleFr: 'lumière' },
  { arabic: 'ه', latin: 'h',  nameAr: 'هاء',  nameFr: 'Ha_',   fr: "h léger aspiré",                example: 'هدية',   exampleFr: 'cadeau' },
  { arabic: 'و', latin: 'w',  nameAr: 'واو',  nameFr: 'Waw',   fr: "w ou voyelle longue 'ou'",      example: 'وردة',   exampleFr: 'rose' },
  { arabic: 'ي', latin: 'y',  nameAr: 'ياء',  nameFr: 'Ya',    fr: "y ou voyelle longue 'i'",       example: 'يوم',    exampleFr: 'jour' },
];

const COLORS = { colorA: '#2a9d8f', colorB: '#1e7a6d', shadowColor: '#155e54' };

function pickDistractors<T>(correct: T, pool: T[], count: number): T[] {
  return [...pool].filter(x => x !== correct).sort(() => Math.random() - 0.5).slice(0, count);
}

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

function buildLessonExercises(letter: Letter, allLetters: Letter[]): Array<{
  type: ExerciseType;
  prompt: string;
  data: any;
  answer: any;
  points: number;
}> {
  const otherLetters = allLetters.filter(l => l.arabic !== letter.arabic);

  // 1. LISTENING — entendre la lettre, choisir parmi 4
  const listenDistractors = pickDistractors(letter, otherLetters, 3);
  const listenPool = shuffle([letter, ...listenDistractors]);
  const listenOptions = listenPool.map((l, i) => ({
    id: 'abcd'[i],
    text: l.arabic,
  }));
  const listenCorrectId = listenOptions.find(o => o.text === letter.arabic)!.id;

  // 2. MCQ reconnaissance — voir la lettre, choisir son nom
  const recogDistractors = pickDistractors(letter, otherLetters, 3);
  const recogPool = shuffle([letter, ...recogDistractors]);
  const recogOptions = recogPool.map((l, i) => ({
    id: 'abcd'[i],
    text: `${l.nameFr} (${l.arabic})`,
  }));
  const recogCorrectId = recogOptions.find(o => o.text.startsWith(letter.nameFr))!.id;

  // 3. ARABIC_KEYBOARD — entendre, taper
  // 4. DRAWING — tracer
  // 5. MCQ mot-exemple — quel mot commence par cette lettre ?
  const wordDistractors = pickDistractors(letter, otherLetters, 3).map(l => l.example);
  const wordPool = shuffle([letter.example, ...wordDistractors]);
  const wordOptions = wordPool.map((w, i) => ({
    id: 'abcd'[i],
    text: w,
  }));
  const wordCorrectId = wordOptions.find(o => o.text === letter.example)!.id;

  return [
    {
      type: ExerciseType.LISTENING,
      prompt: 'Quelle lettre entends-tu ?',
      data: { text: letter.arabic, lang: 'ar-MA', options: listenOptions, audio: letter.arabic },
      answer: { id: listenCorrectId },
      points: 10,
    },
    {
      type: ExerciseType.MULTIPLE_CHOICE,
      prompt: `Quelle est cette lettre ?  →  ${letter.arabic}`,
      data: { options: recogOptions },
      answer: { id: recogCorrectId },
      points: 10,
    },
    {
      type: ExerciseType.ARABIC_KEYBOARD,
      prompt: 'Écris la lettre que tu entends',
      data: {
        target: letter.arabic,
        targetTransliteration: letter.latin,
        hint: letter.fr,
        audio: letter.arabic,
      },
      answer: { text: letter.arabic },
      points: 15,
    },
    {
      type: ExerciseType.DRAWING,
      prompt: `Trace la lettre  ${letter.arabic}`,
      data: { target: letter.arabic, hint: letter.nameFr, threshold: 0.4 },
      answer: { value: letter.arabic },
      points: 15,
    },
    {
      type: ExerciseType.MULTIPLE_CHOICE,
      prompt: `Quel mot commence par  ${letter.arabic}  (${letter.nameFr}) ?`,
      data: { options: wordOptions, hint: `${letter.example} = ${letter.exampleFr}` },
      answer: { id: wordCorrectId },
      points: 15,
    },
  ];
}

async function main() {
  console.log('🔤 Refonte alphabet-darija\n');

  const mod = await prisma.module.findFirst({ where: { slug: 'alphabet-darija' } });
  if (!mod) {
    console.error('❌ Module alphabet-darija introuvable. Lance seedCurriculum.js d\'abord.');
    process.exit(1);
  }
  console.log(`Module trouvé : ${mod.id}`);

  const lang = await prisma.language.findUnique({ where: { code: 'ar-MA' } });
  if (!lang) {
    console.error('❌ Langue ar-MA introuvable.');
    process.exit(1);
  }

  // Supprimer les leçons (cascade sur exercises grâce à Prisma si configuré, sinon manuel)
  const existingLessons = await prisma.lesson.findMany({
    where: { moduleId: mod.id },
    select: { id: true, title: true },
  });
  console.log(`\n🗑️  Suppression de ${existingLessons.length} leçons existantes...`);

  for (const l of existingLessons) {
    await prisma.exercise.deleteMany({ where: { lessonId: l.id } });
  }
  await prisma.lesson.deleteMany({ where: { moduleId: mod.id } });
  console.log('   ✓ Leçons + exercices supprimés');

  // Mise à jour meta du module
  await prisma.module.update({
    where: { id: mod.id },
    data: {
      title: "L'Alphabet Arabe",
      subtitle: 'Les 28 lettres',
      description: 'Apprends chaque lettre par l\'écoute, la reconnaissance, le tracé et l\'écriture.',
      ...COLORS,
    },
  });

  // Créer 28 leçons × 5 exos
  console.log(`\n📖 Création de ${LETTERS.length} leçons × 5 exos...\n`);
  let totalExos = 0;

  for (let i = 0; i < LETTERS.length; i++) {
    const letter = LETTERS[i];
    const order = i + 1;
    const lessonSlug = `alphabet-darija-lecon-${order}`;

    const lesson = await prisma.lesson.create({
      data: {
        moduleId: mod.id,
        languageId: lang.id,
        slug: lessonSlug,
        title: `Lettre ${letter.nameFr}  ${letter.arabic}`,
        subtitle: letter.fr,
        order,
        isPublished: true,
      },
    });

    const exos = buildLessonExercises(letter, LETTERS);
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

    console.log(`   ✓ [${order.toString().padStart(2)}] ${letter.arabic}  ${letter.nameFr.padEnd(8)}  —  5 exos`);
  }

  console.log(`\n✅ Terminé : ${LETTERS.length} leçons, ${totalExos} exercices.`);

  // Export des textes à générer (pour Habibi-TTS)
  const textsToGenerate = new Set<string>();
  for (const letter of LETTERS) {
    textsToGenerate.add(letter.arabic);       // lettre seule
    textsToGenerate.add(letter.example);       // mot-exemple
  }
  console.log(`\n🎤 ${textsToGenerate.size} textes arabes à ajouter à la queue TTS.`);
  console.log('   → Relance scripts/_exportAudioQueue.ts pour rafraîchir _tts-queue.json\n');

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error('❌ Erreur :', e);
  process.exit(1);
});
