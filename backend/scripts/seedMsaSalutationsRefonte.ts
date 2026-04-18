/**
 * Refonte du module "MSA — Salutations" (MSA@1, slug=msa-module-salutations).
 * Passe de 2 leçons × 15 exos (3 types répétés) à 3 thèmes × 7 exos (6 types mixtes) = 21 exos.
 * Par thème : 2 MCQ + 1 LISTENING + 1 ARABIC_KEYBOARD + 1 DRAWING + 1 FILL_BLANK + 1 MCQ production.
 *
 * Usage: npx tsx scripts/seedMsaSalutationsRefonte.ts
 */
import { PrismaClient, ExerciseType } from '@prisma/client';

const prisma = new PrismaClient();

const COLORS = { colorA: '#1e88e5', colorB: '#0d47a1', shadowColor: '#0a3880' };

type Theme = {
  order: number;
  slug: string;
  title: string;
  subtitle: string;
  exos: Array<{
    type: ExerciseType;
    prompt: string;
    data: any;
    answer: any;
    points: number;
  }>;
};

const THEMES: Theme[] = [
  // ─────────────────────────── LEÇON 1 — Bonjour & Bienvenue ───────────────────────────
  {
    order: 1,
    slug: 'msa-salutations-lecon-1',
    title: 'Bonjour & Bienvenue',
    subtitle: 'Les salutations de base',
    exos: [
      {
        type: ExerciseType.MULTIPLE_CHOICE,
        prompt: '« السَّلَامُ عَلَيْكُمْ » (as-salāmu ʿalaykum) signifie :',
        data: {
          options: [
            { id: 'a', text: 'Au revoir' },
            { id: 'b', text: 'Que la paix soit sur vous' },
            { id: 'c', text: 'Merci beaucoup' },
            { id: 'd', text: 'Excusez-moi' },
          ],
        },
        answer: { id: 'b' },
        points: 10,
      },
      {
        type: ExerciseType.LISTENING,
        prompt: 'Quelle salutation entends-tu ?',
        data: {
          text: 'مَرْحَباً',
          lang: 'ar',
          audio: 'مَرْحَباً',
          options: [
            { id: 'a', text: 'مَرْحَباً', transliteration: 'marḥaban (bonjour)' },
            { id: 'b', text: 'شُكْراً', transliteration: 'shukran (merci)' },
            { id: 'c', text: 'عَفْواً', transliteration: 'ʿafwan (pardon)' },
            { id: 'd', text: 'وَدَاعاً', transliteration: 'wadāʿan (adieu)' },
          ],
        },
        answer: { id: 'a' },
        points: 10,
      },
      {
        type: ExerciseType.MULTIPLE_CHOICE,
        prompt: 'Comment répond-on à « السَّلَامُ عَلَيْكُمْ » ?',
        data: {
          options: [
            { id: 'a', text: 'مَرْحَباً' },
            { id: 'b', text: 'وَعَلَيْكُمُ السَّلَامُ', transliteration: 'wa ʿalaykumu s-salām' },
            { id: 'c', text: 'شُكْراً' },
            { id: 'd', text: 'أَهْلاً وَسَهْلاً' },
          ],
        },
        answer: { id: 'b' },
        points: 10,
      },
      {
        type: ExerciseType.ARABIC_KEYBOARD,
        prompt: 'Écris « Bienvenue » en arabe',
        data: {
          target: 'أَهْلاً وَسَهْلاً',
          targetTransliteration: 'ahlan wa sahlan',
          translation: 'Bienvenue',
          hint: 'Formule d\'accueil chaleureuse',
          audio: 'أَهْلاً وَسَهْلاً',
        },
        answer: { text: 'أَهْلاً وَسَهْلاً' },
        points: 15,
      },
      {
        type: ExerciseType.DRAWING,
        prompt: 'Trace « مَرْحَباً »',
        data: { target: 'مَرْحَباً', hint: 'marḥaban — bonjour', threshold: 0.3 },
        answer: { value: 'مَرْحَباً' },
        points: 15,
      },
      {
        type: ExerciseType.FILL_BLANK,
        prompt: 'Complète : ___ وَسَهْلاً (Bienvenue)',
        data: {
          sentence: '___ وَسَهْلاً',
          options: ['أَهْلاً', 'شُكْراً', 'مَرْحَباً', 'عَفْواً'],
        },
        answer: { text: 'أَهْلاً', translation: 'ahlan', transliteration: 'ahlan' },
        points: 10,
      },
      {
        type: ExerciseType.MULTIPLE_CHOICE,
        prompt: 'Quelle salutation utilise-t-on le matin ?',
        data: {
          options: [
            { id: 'a', text: 'مَسَاءُ الخَيْرِ (masāʾu l-khayr)' },
            { id: 'b', text: 'تُصْبِحُ عَلَى خَيْرٍ (tuṣbiḥu ʿalā khayr)' },
            { id: 'c', text: 'صَبَاحُ الخَيْرِ (ṣabāḥu l-khayr)' },
            { id: 'd', text: 'لَيْلَةً سَعِيدَةً (laylatan saʿīdah)' },
          ],
          hint: 'ṣabāḥ = matin',
        },
        answer: { id: 'c' },
        points: 15,
      },
    ],
  },

  // ─────────────────────────── LEÇON 2 — Se présenter ───────────────────────────
  {
    order: 2,
    slug: 'msa-salutations-lecon-2',
    title: 'Se présenter',
    subtitle: 'Nom, origine, comment ça va',
    exos: [
      {
        type: ExerciseType.MULTIPLE_CHOICE,
        prompt: '« مَا اسْمُكَ؟ » (mā ismuka) signifie :',
        data: {
          options: [
            { id: 'a', text: 'Comment tu t\'appelles ?' },
            { id: 'b', text: 'Où habites-tu ?' },
            { id: 'c', text: 'Quel âge as-tu ?' },
            { id: 'd', text: 'Que fais-tu ?' },
          ],
        },
        answer: { id: 'a' },
        points: 10,
      },
      {
        type: ExerciseType.LISTENING,
        prompt: 'Quelle phrase entends-tu ?',
        data: {
          text: 'اِسْمِي أَحْمَدُ',
          lang: 'ar',
          audio: 'اِسْمِي أَحْمَدُ',
          options: [
            { id: 'a', text: 'اِسْمِي أَحْمَدُ', transliteration: 'ismī Aḥmad (je m\'appelle Ahmed)' },
            { id: 'b', text: 'أَنَا مِنْ مِصْرَ', transliteration: 'anā min Miṣr (je viens d\'Égypte)' },
            { id: 'c', text: 'كَيْفَ حَالُكَ', transliteration: 'kayfa ḥāluka (comment vas-tu)' },
            { id: 'd', text: 'أَنَا بِخَيْرٍ', transliteration: 'anā bi-khayr (je vais bien)' },
          ],
        },
        answer: { id: 'a' },
        points: 10,
      },
      {
        type: ExerciseType.MULTIPLE_CHOICE,
        prompt: '« كَيْفَ حَالُكَ؟ » signifie :',
        data: {
          options: [
            { id: 'a', text: 'Où habites-tu ?' },
            { id: 'b', text: 'Comment vas-tu ?' },
            { id: 'c', text: 'Qui es-tu ?' },
            { id: 'd', text: 'Quand pars-tu ?' },
          ],
        },
        answer: { id: 'b' },
        points: 10,
      },
      {
        type: ExerciseType.ARABIC_KEYBOARD,
        prompt: 'Écris « Je vais bien » en arabe',
        data: {
          target: 'أَنَا بِخَيْرٍ',
          targetTransliteration: 'anā bi-khayr',
          translation: 'Je vais bien',
          hint: 'Réponse standard à « كيف حالك؟ »',
          audio: 'أَنَا بِخَيْرٍ',
        },
        answer: { text: 'أَنَا بِخَيْرٍ' },
        points: 15,
      },
      {
        type: ExerciseType.DRAWING,
        prompt: 'Trace « اِسْمِي »',
        data: { target: 'اِسْمِي', hint: 'ismī — mon nom', threshold: 0.35 },
        answer: { value: 'اِسْمِي' },
        points: 15,
      },
      {
        type: ExerciseType.FILL_BLANK,
        prompt: 'Complète : أَنَا ___ المَغْرِبِ (Je viens du Maroc)',
        data: {
          sentence: 'أَنَا ___ المَغْرِبِ',
          options: ['مِنْ', 'فِي', 'إِلَى', 'عَلَى'],
        },
        answer: { text: 'مِنْ', translation: 'de / depuis', transliteration: 'min' },
        points: 10,
      },
      {
        type: ExerciseType.MULTIPLE_CHOICE,
        prompt: 'Pour dire « Enchanté(e) », on dit :',
        data: {
          options: [
            { id: 'a', text: 'تَشَرَّفْنَا (tasharrafnā)' },
            { id: 'b', text: 'وَدَاعاً (wadāʿan)' },
            { id: 'c', text: 'عُذْراً (ʿudhran)' },
            { id: 'd', text: 'نَعَمْ (naʿam)' },
          ],
          hint: 'Littéralement « nous avons eu l\'honneur »',
        },
        answer: { id: 'a' },
        points: 15,
      },
    ],
  },

  // ─────────────────────────── LEÇON 3 — Politesse & Au revoir ───────────────────────────
  {
    order: 3,
    slug: 'msa-salutations-lecon-3',
    title: 'Politesse & Au revoir',
    subtitle: 'Merci, pardon, à bientôt',
    exos: [
      {
        type: ExerciseType.MULTIPLE_CHOICE,
        prompt: '« شُكْراً جَزِيلاً » (shukran jazīlan) signifie :',
        data: {
          options: [
            { id: 'a', text: 'S\'il te plaît' },
            { id: 'b', text: 'Merci beaucoup' },
            { id: 'c', text: 'De rien' },
            { id: 'd', text: 'Excuse-moi' },
          ],
        },
        answer: { id: 'b' },
        points: 10,
      },
      {
        type: ExerciseType.LISTENING,
        prompt: 'Quelle formule entends-tu ?',
        data: {
          text: 'مَعَ السَّلَامَةِ',
          lang: 'ar',
          audio: 'مَعَ السَّلَامَةِ',
          options: [
            { id: 'a', text: 'إِلَى اللِّقَاءِ', transliteration: 'ilā l-liqāʾ (à bientôt)' },
            { id: 'b', text: 'مَعَ السَّلَامَةِ', transliteration: 'maʿa s-salāmah (au revoir)' },
            { id: 'c', text: 'تُصْبِحُ عَلَى خَيْرٍ', transliteration: 'tuṣbiḥu ʿalā khayr (bonne nuit)' },
            { id: 'd', text: 'أَهْلاً بِكَ', transliteration: 'ahlan bika (bienvenue)' },
          ],
        },
        answer: { id: 'b' },
        points: 10,
      },
      {
        type: ExerciseType.MULTIPLE_CHOICE,
        prompt: 'Pour répondre à « شُكْراً », on dit :',
        data: {
          options: [
            { id: 'a', text: 'مِنْ فَضْلِكَ (min faḍlika)' },
            { id: 'b', text: 'عَفْواً (ʿafwan)' },
            { id: 'c', text: 'مَرْحَباً (marḥaban)' },
            { id: 'd', text: 'صَبَاحُ النُّورِ (ṣabāḥu n-nūr)' },
          ],
          hint: 'Littéralement « pardon / de rien »',
        },
        answer: { id: 'b' },
        points: 10,
      },
      {
        type: ExerciseType.ARABIC_KEYBOARD,
        prompt: 'Écris « s\'il te plaît » en arabe',
        data: {
          target: 'مِنْ فَضْلِكَ',
          targetTransliteration: 'min faḍlika',
          translation: 'S\'il te plaît',
          hint: 'Formule de politesse pour demander',
          audio: 'مِنْ فَضْلِكَ',
        },
        answer: { text: 'مِنْ فَضْلِكَ' },
        points: 15,
      },
      {
        type: ExerciseType.DRAWING,
        prompt: 'Trace « شُكْراً »',
        data: { target: 'شُكْراً', hint: 'shukran — merci', threshold: 0.35 },
        answer: { value: 'شُكْراً' },
        points: 15,
      },
      {
        type: ExerciseType.FILL_BLANK,
        prompt: 'Complète : ___ اللِّقَاءِ (À bientôt)',
        data: {
          sentence: '___ اللِّقَاءِ',
          options: ['إِلَى', 'مَعَ', 'فِي', 'عَنْ'],
        },
        answer: { text: 'إِلَى', translation: 'vers / à', transliteration: 'ilā' },
        points: 10,
      },
      {
        type: ExerciseType.MULTIPLE_CHOICE,
        prompt: 'Pour souhaiter « bonne nuit », on dit :',
        data: {
          options: [
            { id: 'a', text: 'صَبَاحُ الخَيْرِ (ṣabāḥu l-khayr)' },
            { id: 'b', text: 'تُصْبِحُ عَلَى خَيْرٍ (tuṣbiḥu ʿalā khayr)' },
            { id: 'c', text: 'مَرْحَباً (marḥaban)' },
            { id: 'd', text: 'أَهْلاً (ahlan)' },
          ],
          hint: 'Littéralement « puisses-tu te réveiller en bien »',
        },
        answer: { id: 'b' },
        points: 15,
      },
    ],
  },
];

async function main() {
  console.log('🕌 Refonte « MSA — Salutations » (MSA@1)\n');

  const mod = await prisma.module.findUnique({ where: { slug: 'msa-module-salutations' } });
  if (!mod) {
    console.error('❌ Module msa-module-salutations introuvable.');
    process.exit(1);
  }
  console.log(`Module : ${mod.slug}  (id=${mod.id})`);

  const lang = await prisma.language.findUnique({ where: { code: 'ar-SA' } })
    ?? await prisma.language.findUnique({ where: { code: 'ar-MA' } });
  if (!lang) {
    console.error('❌ Aucune langue arabe trouvée (ar-SA / ar-MA).');
    process.exit(1);
  }
  console.log(`Langue : ${lang.code}`);

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
      title: 'MSA — Salutations',
      subtitle: 'Bonjour, merci, au revoir',
      description: 'Apprends les formules de politesse en arabe standard : salutations, présentations, remerciements.',
      ...COLORS,
    },
  });

  console.log(`\n📖 Création de ${THEMES.length} leçons × 7 exos…\n`);
  let totalExos = 0;

  for (const t of THEMES) {
    const lesson = await prisma.lesson.create({
      data: {
        moduleId: mod.id,
        languageId: lang.id,
        slug: t.slug,
        title: t.title,
        subtitle: t.subtitle,
        order: t.order,
        isPublished: true,
      },
    });
    for (const exo of t.exos) {
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
    console.log(`   ✓ [${t.order}] ${t.title.padEnd(28)} ${t.exos.length} exos`);
  }

  console.log(`\n✅ Terminé : ${THEMES.length} leçons, ${totalExos} exercices.\n`);
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error('❌ Erreur :', e);
  process.exit(1);
});
