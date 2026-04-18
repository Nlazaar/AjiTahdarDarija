/**
 * Refonte du module "Les Couleurs" (DARIJA@5, slug=les-couleurs).
 * 3 thèmes × 7 exos mixtes = 21 exos.
 *
 * Usage: npx tsx scripts/seedLesCouleursRefonte.ts
 */
import { PrismaClient, ExerciseType } from '@prisma/client';

const prisma = new PrismaClient();

const COLORS = { colorA: '#ffb74d', colorB: '#ff9800', shadowColor: '#ef6c00' };

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
  // ─────────────────────────── LEÇON 1 — Couleurs principales ───────────────────────────
  {
    order: 1,
    slug: 'les-couleurs-lecon-1',
    title: 'Les couleurs principales',
    subtitle: 'Rouge, vert, bleu',
    exos: [
      {
        type: ExerciseType.MULTIPLE_CHOICE,
        prompt: '« حمر » (hmar) signifie :',
        data: {
          options: [
            { id: 'a', text: 'Bleu' },
            { id: 'b', text: 'Rouge' },
            { id: 'c', text: 'Vert' },
            { id: 'd', text: 'Jaune' },
          ],
        },
        answer: { id: 'b' },
        points: 10,
      },
      {
        type: ExerciseType.LISTENING,
        prompt: 'Quelle couleur entends-tu ?',
        data: {
          text: 'خضر',
          lang: 'ar-MA',
          audio: 'خضر',
          options: [
            { id: 'a', text: 'حمر', transliteration: 'hmar (rouge)' },
            { id: 'b', text: 'خضر', transliteration: 'khdar (vert)' },
            { id: 'c', text: 'زرق', transliteration: 'zraq (bleu)' },
            { id: 'd', text: 'صفر', transliteration: 'sfar (jaune)' },
          ],
        },
        answer: { id: 'b' },
        points: 10,
      },
      {
        type: ExerciseType.MULTIPLE_CHOICE,
        prompt: '« خضر » (khdar) signifie :',
        data: {
          options: [
            { id: 'a', text: 'Bleu' },
            { id: 'b', text: 'Rouge' },
            { id: 'c', text: 'Vert' },
            { id: 'd', text: 'Blanc' },
          ],
        },
        answer: { id: 'c' },
        points: 10,
      },
      {
        type: ExerciseType.ARABIC_KEYBOARD,
        prompt: 'Écris « bleu » en arabe',
        data: {
          target: 'زرق',
          targetTransliteration: 'zraq',
          translation: 'bleu',
          hint: 'Couleur du ciel',
          audio: 'زرق',
        },
        answer: { text: 'زرق' },
        points: 15,
      },
      {
        type: ExerciseType.DRAWING,
        prompt: 'Trace « حمر »',
        data: { target: 'حمر', hint: 'hmar — rouge', threshold: 0.45 },
        answer: { value: 'حمر' },
        points: 15,
      },
      {
        type: ExerciseType.MULTIPLE_CHOICE,
        prompt: 'Les couleurs du drapeau marocain en darija :',
        data: {
          options: [
            { id: 'a', text: 'زرق و أبيض (bleu et blanc)' },
            { id: 'b', text: 'حمر و خضر (rouge et vert)' },
            { id: 'c', text: 'صفر و حمر (jaune et rouge)' },
            { id: 'd', text: 'كحل و أبيض (noir et blanc)' },
          ],
        },
        answer: { id: 'b' },
        points: 10,
      },
      {
        type: ExerciseType.MULTIPLE_CHOICE,
        prompt: 'Comment dit-on « Le ciel est bleu » en darija ?',
        data: {
          options: [
            { id: 'a', text: 'Sma khdar' },
            { id: 'b', text: 'Sma hamra' },
            { id: 'c', text: 'Sma zarqa', transliteration: 'السما زرقة' },
            { id: 'd', text: 'Sma bida' },
          ],
        },
        answer: { id: 'c' },
        points: 15,
      },
    ],
  },

  // ─────────────────────────── LEÇON 2 — Blanc, noir, jaune, orange ───────────────────────────
  {
    order: 2,
    slug: 'les-couleurs-lecon-2',
    title: 'Blanc, noir, jaune, orange',
    subtitle: 'Élargir la palette',
    exos: [
      {
        type: ExerciseType.MULTIPLE_CHOICE,
        prompt: '« كحل » (kḥal) signifie :',
        data: {
          options: [
            { id: 'a', text: 'Blanc' },
            { id: 'b', text: 'Gris' },
            { id: 'c', text: 'Noir' },
            { id: 'd', text: 'Marron' },
          ],
        },
        answer: { id: 'c' },
        points: 10,
      },
      {
        type: ExerciseType.LISTENING,
        prompt: 'Quelle couleur entends-tu ?',
        data: {
          text: 'أبيض',
          lang: 'ar-MA',
          audio: 'أبيض',
          options: [
            { id: 'a', text: 'كحل', transliteration: 'kḥal (noir)' },
            { id: 'b', text: 'أبيض', transliteration: 'abyad (blanc)' },
            { id: 'c', text: 'صفر', transliteration: 'sfar (jaune)' },
            { id: 'd', text: 'برتقالي', transliteration: 'bortqali (orange)' },
          ],
        },
        answer: { id: 'b' },
        points: 10,
      },
      {
        type: ExerciseType.MULTIPLE_CHOICE,
        prompt: 'Comment dit-on « orange » (couleur) en darija ?',
        data: {
          options: [
            { id: 'a', text: 'صفر (sfar)' },
            { id: 'b', text: 'ليموني (limuni)' },
            { id: 'c', text: 'برتقالي (bortqali)' },
            { id: 'd', text: 'وردي (wardi)' },
          ],
        },
        answer: { id: 'c' },
        points: 10,
      },
      {
        type: ExerciseType.ARABIC_KEYBOARD,
        prompt: 'Écris « jaune » en arabe',
        data: {
          target: 'صفر',
          targetTransliteration: 'sfar',
          translation: 'jaune',
          hint: 'Couleur du soleil',
          audio: 'صفر',
        },
        answer: { text: 'صفر' },
        points: 15,
      },
      {
        type: ExerciseType.DRAWING,
        prompt: 'Trace « كحل »',
        data: { target: 'كحل', hint: 'kḥal — noir', threshold: 0.45 },
        answer: { value: 'كحل' },
        points: 15,
      },
      {
        type: ExerciseType.FILL_BLANK,
        prompt: 'Complète : السما ___ (Le ciel est bleu)',
        data: {
          sentence: 'السما ___',
          options: ['زرقة', 'حمرا', 'بيضا', 'كحلة'],
        },
        answer: { text: 'زرقة', translation: 'bleue', transliteration: 'zarqa' },
        points: 10,
      },
      {
        type: ExerciseType.MULTIPLE_CHOICE,
        prompt: '« أبيض » (abyad) signifie :',
        data: {
          options: [
            { id: 'a', text: 'Noir' },
            { id: 'b', text: 'Blanc' },
            { id: 'c', text: 'Gris' },
            { id: 'd', text: 'Rose' },
          ],
        },
        answer: { id: 'b' },
        points: 15,
      },
    ],
  },

  // ─────────────────────────── LEÇON 3 — Décrire les objets ───────────────────────────
  {
    order: 3,
    slug: 'les-couleurs-lecon-3',
    title: 'Décrire les objets',
    subtitle: 'Accord de couleur & achats',
    exos: [
      {
        type: ExerciseType.MULTIPLE_CHOICE,
        prompt: '« الكتاب الأحمر » signifie :',
        data: {
          options: [
            { id: 'a', text: 'Le grand livre' },
            { id: 'b', text: 'Le livre rouge' },
            { id: 'c', text: 'Le vieux livre' },
            { id: 'd', text: 'Le beau livre' },
          ],
        },
        answer: { id: 'b' },
        points: 10,
      },
      {
        type: ExerciseType.LISTENING,
        prompt: 'Quelle phrase entends-tu ?',
        data: {
          text: 'بغيت الشكارة الكحلة',
          lang: 'ar-MA',
          audio: 'بغيت الشكارة الكحلة',
          options: [
            { id: 'a', text: 'بغيت الشكارة الكحلة', transliteration: 'bghit chkara kahla (sac noir)' },
            { id: 'b', text: 'بغيت الشكارة الحمرة', transliteration: 'bghit chkara hamra (sac rouge)' },
            { id: 'c', text: 'بغيت الشكارة البيضا', transliteration: 'bghit chkara bida (sac blanc)' },
            { id: 'd', text: 'بغيت الشكارة الزرقة', transliteration: 'bghit chkara zarqa (sac bleu)' },
          ],
        },
        answer: { id: 'a' },
        points: 10,
      },
      {
        type: ExerciseType.MULTIPLE_CHOICE,
        prompt: 'Comment dit-on « Je veux le sac noir » en darija ?',
        data: {
          options: [
            { id: 'a', text: 'Bghit chkara l-hamra' },
            { id: 'b', text: 'Bghit chkara l-bida' },
            { id: 'c', text: 'Bghit chkara l-kahla', transliteration: 'بغيت الشكارة الكحلة' },
            { id: 'd', text: 'Bghit chkara l-khadra' },
          ],
        },
        answer: { id: 'c' },
        points: 10,
      },
      {
        type: ExerciseType.ARABIC_KEYBOARD,
        prompt: 'Écris « la voiture rouge » en arabe',
        data: {
          target: 'الطوموبيل الحمرا',
          targetTransliteration: 'tomobil hamra',
          translation: 'la voiture rouge',
          hint: 'Accord féminin',
          audio: 'الطوموبيل الحمرا',
        },
        answer: { text: 'الطوموبيل الحمرا' },
        points: 15,
      },
      {
        type: ExerciseType.DRAWING,
        prompt: 'Trace « الحمرا »',
        data: { target: 'الحمرا', hint: 'hamra — rouge (fém.)', threshold: 0.35 },
        answer: { value: 'الحمرا' },
        points: 15,
      },
      {
        type: ExerciseType.FILL_BLANK,
        prompt: 'Complète : الدار ___ (La maison est blanche)',
        data: {
          sentence: 'الدار ___',
          options: ['البيضا', 'الأبيض', 'بيض', 'أبيض'],
        },
        answer: { text: 'البيضا', translation: 'la blanche (fém.)', transliteration: 'l-bida' },
        points: 10,
      },
      {
        type: ExerciseType.MULTIPLE_CHOICE,
        prompt: 'Pour un objet féminin rouge, on dit :',
        data: {
          options: [
            { id: 'a', text: 'أحمر (ahmar)' },
            { id: 'b', text: 'حمرا (hamra)' },
            { id: 'c', text: 'حمر (hmar)' },
            { id: 'd', text: 'لحمر (l-hmar)' },
          ],
          hint: 'Accord féminin de la couleur',
        },
        answer: { id: 'b' },
        points: 15,
      },
    ],
  },
];

async function main() {
  console.log('🎨 Refonte « Les Couleurs » (DARIJA@5)\n');

  const mod = await prisma.module.findUnique({ where: { slug: 'les-couleurs' } });
  if (!mod) {
    console.error('❌ Module les-couleurs introuvable.');
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
      title: 'Les Couleurs',
      subtitle: 'Arc-en-ciel en Darija',
      description: 'Apprends les couleurs et comment décrire les objets qui t\'entourent.',
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
