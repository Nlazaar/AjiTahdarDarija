/**
 * Refonte du module "Le Corps et la Santé" (DARIJA@12, slug=le-corps-la-sante).
 * 3 thèmes × 7 exos mixtes = 21 exos.
 *
 * Usage: npx tsx scripts/seedLeCorpsSanteRefonte.ts
 */
import { PrismaClient, ExerciseType } from '@prisma/client';

const prisma = new PrismaClient();

const COLORS = { colorA: '#ff8a80', colorB: '#f44336', shadowColor: '#c62828' };

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
  // ─────────────────────────── LEÇON 1 — Parties du corps ───────────────────────────
  {
    order: 1,
    slug: 'le-corps-la-sante-lecon-1',
    title: 'Les parties du corps',
    subtitle: 'Tête, bras, ventre…',
    exos: [
      {
        type: ExerciseType.MULTIPLE_CHOICE,
        prompt: '« الراس » (ras) signifie :',
        data: {
          options: [
            { id: 'a', text: 'Le bras' },
            { id: 'b', text: 'La tête' },
            { id: 'c', text: 'Le cœur' },
            { id: 'd', text: 'L\'estomac' },
          ],
        },
        answer: { id: 'b' },
        points: 10,
      },
      {
        type: ExerciseType.LISTENING,
        prompt: 'Quelle partie du corps entends-tu ?',
        data: {
          text: 'اليد',
          lang: 'ar-MA',
          audio: 'اليد',
          options: [
            { id: 'a', text: 'الراس', transliteration: 'ras (tête)' },
            { id: 'b', text: 'اليد', transliteration: 'yedd (main)' },
            { id: 'c', text: 'الرجل', transliteration: 'rjel (pied)' },
            { id: 'd', text: 'العين', transliteration: 'ayn (œil)' },
          ],
        },
        answer: { id: 'b' },
        points: 10,
      },
      {
        type: ExerciseType.MULTIPLE_CHOICE,
        prompt: '« كرشي » (karchi) signifie :',
        data: {
          options: [
            { id: 'a', text: 'Ma tête' },
            { id: 'b', text: 'Mon ventre' },
            { id: 'c', text: 'Mon dos' },
            { id: 'd', text: 'Ma jambe' },
          ],
        },
        answer: { id: 'b' },
        points: 10,
      },
      {
        type: ExerciseType.ARABIC_KEYBOARD,
        prompt: 'Écris « la main » en arabe',
        data: {
          target: 'اليد',
          targetTransliteration: 'l-yedd',
          translation: 'la main',
          hint: 'Partie du corps',
          audio: 'اليد',
        },
        answer: { text: 'اليد' },
        points: 15,
      },
      {
        type: ExerciseType.DRAWING,
        prompt: 'Trace « الراس »',
        data: { target: 'الراس', hint: 'ras — la tête', threshold: 0.35 },
        answer: { value: 'الراس' },
        points: 15,
      },
      {
        type: ExerciseType.FILL_BLANK,
        prompt: 'Complète : ___ كيدير بيا (J\'ai mal à la tête)',
        data: {
          sentence: '___ كيدير بيا',
          options: ['راسي', 'يدي', 'رجلي', 'كرشي'],
        },
        answer: { text: 'راسي', translation: 'ma tête', transliteration: 'rasi' },
        points: 10,
      },
      {
        type: ExerciseType.MULTIPLE_CHOICE,
        prompt: 'Comment dit-on « J\'ai mal à la tête » en darija ?',
        data: {
          options: [
            { id: 'a', text: 'Batnti kiddir biya' },
            { id: 'b', text: 'Rasi kiddir biya', transliteration: 'راسي كيدير بيا' },
            { id: 'c', text: 'Rejli kiddir biya' },
            { id: 'd', text: 'Karchi kiddir biya' },
          ],
        },
        answer: { id: 'b' },
        points: 15,
      },
    ],
  },

  // ─────────────────────────── LEÇON 2 — Chez le médecin ───────────────────────────
  {
    order: 2,
    slug: 'le-corps-la-sante-lecon-2',
    title: 'Chez le médecin',
    subtitle: 'Décrire une douleur',
    exos: [
      {
        type: ExerciseType.MULTIPLE_CHOICE,
        prompt: '« عندي سخانة » (andi skhana) signifie :',
        data: {
          options: [
            { id: 'a', text: 'J\'ai froid' },
            { id: 'b', text: 'J\'ai de la fièvre' },
            { id: 'c', text: 'J\'ai une allergie' },
            { id: 'd', text: 'Je suis fatigué' },
          ],
        },
        answer: { id: 'b' },
        points: 10,
      },
      {
        type: ExerciseType.LISTENING,
        prompt: 'Quel symptôme entends-tu ?',
        data: {
          text: 'كنكح',
          lang: 'ar-MA',
          audio: 'كنكح',
          options: [
            { id: 'a', text: 'كنكح', transliteration: 'knkah (je tousse)' },
            { id: 'b', text: 'عندي سخانة', transliteration: 'andi skhana (fièvre)' },
            { id: 'c', text: 'عندي الزكام', transliteration: 'andi zkam (rhume)' },
            { id: 'd', text: 'عيان', transliteration: 'ayan (fatigué)' },
          ],
        },
        answer: { id: 'a' },
        points: 10,
      },
      {
        type: ExerciseType.MULTIPLE_CHOICE,
        prompt: '« منداك أشحال؟ » demande le médecin. Cela signifie :',
        data: {
          options: [
            { id: 'a', text: 'Tu as quel âge ?' },
            { id: 'b', text: 'Depuis combien de temps ?' },
            { id: 'c', text: 'Tu as déjà eu ça ?' },
            { id: 'd', text: 'Tu prends des médicaments ?' },
          ],
        },
        answer: { id: 'b' },
        points: 10,
      },
      {
        type: ExerciseType.ARABIC_KEYBOARD,
        prompt: 'Écris « j\'ai de la fièvre » en arabe',
        data: {
          target: 'عندي سخانة',
          targetTransliteration: 'andi skhana',
          translation: 'j\'ai de la fièvre',
          hint: 'Symptôme courant',
          audio: 'عندي سخانة',
        },
        answer: { text: 'عندي سخانة' },
        points: 15,
      },
      {
        type: ExerciseType.DRAWING,
        prompt: 'Trace « عيان »',
        data: { target: 'عيان', hint: 'ayan — malade / fatigué', threshold: 0.45 },
        answer: { value: 'عيان' },
        points: 15,
      },
      {
        type: ExerciseType.FILL_BLANK,
        prompt: 'Complète : أنا كنكح من ___ (Je tousse depuis deux jours)',
        data: {
          sentence: 'أنا كنكح من ___',
          options: ['يومين', 'يوم', 'سيمانا', 'شهر'],
        },
        answer: { text: 'يومين', translation: 'deux jours', transliteration: 'yumein' },
        points: 10,
      },
      {
        type: ExerciseType.MULTIPLE_CHOICE,
        prompt: 'Comment dit-on « Je tousse depuis deux jours » en darija ?',
        data: {
          options: [
            { id: 'a', text: 'Ana knkah men yum' },
            { id: 'b', text: 'Ana knkah men yumein', transliteration: 'أنا كنكح من يومين' },
            { id: 'c', text: 'Andi shta men yumein' },
            { id: 'd', text: 'Andi skhana men yumein' },
          ],
        },
        answer: { id: 'b' },
        points: 15,
      },
    ],
  },

  // ─────────────────────────── LEÇON 3 — Pharmacie et remèdes ───────────────────────────
  {
    order: 3,
    slug: 'le-corps-la-sante-lecon-3',
    title: 'Pharmacie et remèdes',
    subtitle: 'Acheter des médicaments',
    exos: [
      {
        type: ExerciseType.MULTIPLE_CHOICE,
        prompt: '« الصيدلية » (saydaliya) signifie :',
        data: {
          options: [
            { id: 'a', text: 'L\'hôpital' },
            { id: 'b', text: 'La pharmacie' },
            { id: 'c', text: 'Le cabinet médical' },
            { id: 'd', text: 'Le dentiste' },
          ],
        },
        answer: { id: 'b' },
        points: 10,
      },
      {
        type: ExerciseType.LISTENING,
        prompt: 'Quel mot entends-tu ?',
        data: {
          text: 'الدوا',
          lang: 'ar-MA',
          audio: 'الدوا',
          options: [
            { id: 'a', text: 'الدوا', transliteration: 'dwa (médicament)' },
            { id: 'b', text: 'الطبيب', transliteration: 'tbib (médecin)' },
            { id: 'c', text: 'الصيدلية', transliteration: 'saydaliya (pharmacie)' },
            { id: 'd', text: 'المستشفى', transliteration: 'mostachfa (hôpital)' },
          ],
        },
        answer: { id: 'a' },
        points: 10,
      },
      {
        type: ExerciseType.MULTIPLE_CHOICE,
        prompt: '« بغيت دوا لـ… » signifie :',
        data: {
          options: [
            { id: 'a', text: 'Je cherche un médecin pour…' },
            { id: 'b', text: 'Je veux un médicament pour…' },
            { id: 'c', text: 'Je paye le médicament pour…' },
            { id: 'd', text: 'Je retourne à la pharmacie pour…' },
          ],
        },
        answer: { id: 'b' },
        points: 10,
      },
      {
        type: ExerciseType.ARABIC_KEYBOARD,
        prompt: 'Écris « la pharmacie » en arabe',
        data: {
          target: 'الصيدلية',
          targetTransliteration: 'saydaliya',
          translation: 'la pharmacie',
          hint: 'Lieu où on achète les médicaments',
          audio: 'الصيدلية',
        },
        answer: { text: 'الصيدلية' },
        points: 15,
      },
      {
        type: ExerciseType.DRAWING,
        prompt: 'Trace « الدوا »',
        data: { target: 'الدوا', hint: 'dwa — le médicament', threshold: 0.4 },
        answer: { value: 'الدوا' },
        points: 15,
      },
      {
        type: ExerciseType.FILL_BLANK,
        prompt: 'Complète : بغيت ___ للصداع (Je veux un médicament pour le mal de tête)',
        data: {
          sentence: 'بغيت ___ للصداع',
          options: ['دوا', 'ما', 'أتاي', 'قهوة'],
        },
        answer: { text: 'دوا', translation: 'médicament', transliteration: 'dwa' },
        points: 10,
      },
      {
        type: ExerciseType.MULTIPLE_CHOICE,
        prompt: 'Comment dit-on « Je voudrais un médicament pour la toux » en darija ?',
        data: {
          options: [
            { id: 'a', text: 'Bghit dwa l-skhana' },
            { id: 'b', text: 'Bghit dwa l-kohha', transliteration: 'بغيت دوا للكحة' },
            { id: 'c', text: 'Bghit tabib l-kohha' },
            { id: 'd', text: 'Bghit mostachfa l-kohha' },
          ],
        },
        answer: { id: 'b' },
        points: 15,
      },
    ],
  },
];

async function main() {
  console.log('💊 Refonte « Le Corps et la Santé » (DARIJA@12)\n');

  const mod = await prisma.module.findUnique({ where: { slug: 'le-corps-la-sante' } });
  if (!mod) {
    console.error('❌ Module le-corps-la-sante introuvable.');
    process.exit(1);
  }
  console.log(`Module : ${mod.slug}  (id=${mod.id})`);

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
      title: 'Le Corps et la Santé',
      subtitle: 'Chez le médecin',
      description: 'Parler de son corps, exprimer une douleur et consulter un médecin en darija.',
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
