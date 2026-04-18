/**
 * Refonte du module "Les Transports" (DARIJA@21, slug=les-transports).
 * 3 thèmes × 7 exos mixtes = 21 exos.
 *
 * Usage: npx tsx scripts/seedLesTransportsRefonte.ts
 */
import { PrismaClient, ExerciseType } from '@prisma/client';

const prisma = new PrismaClient();

const COLORS = { colorA: '#81d4fa', colorB: '#03a9f4', shadowColor: '#0277bd' };

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
  // ─────────────────────────── LEÇON 1 — Moyens de transport ───────────────────────────
  {
    order: 1,
    slug: 'les-transports-lecon-1',
    title: 'Les moyens de transport',
    subtitle: 'Bus, train, taxi',
    exos: [
      {
        type: ExerciseType.MULTIPLE_CHOICE,
        prompt: '« الطوبيس » (toubis) est :',
        data: {
          options: [
            { id: 'a', text: 'Le taxi' },
            { id: 'b', text: 'Le bus' },
            { id: 'c', text: 'Le train' },
            { id: 'd', text: 'Le tramway' },
          ],
        },
        answer: { id: 'b' },
        points: 10,
      },
      {
        type: ExerciseType.LISTENING,
        prompt: 'Quel transport entends-tu ?',
        data: {
          text: 'القطر',
          lang: 'ar-MA',
          audio: 'القطر',
          options: [
            { id: 'a', text: 'الطوبيس', transliteration: 'toubis (bus)' },
            { id: 'b', text: 'القطر', transliteration: 'qtar (train)' },
            { id: 'c', text: 'الطاكسي', transliteration: 'taksi' },
            { id: 'd', text: 'الطيارة', transliteration: 'tiyara (avion)' },
          ],
        },
        answer: { id: 'b' },
        points: 10,
      },
      {
        type: ExerciseType.MULTIPLE_CHOICE,
        prompt: '« الطاكسي الكبير » (grand taxi) est différent du « بيتي طاكسي » car :',
        data: {
          options: [
            { id: 'a', text: 'Il est plus cher' },
            { id: 'b', text: 'Il fait des trajets interurbains avec des passagers partagés' },
            { id: 'c', text: 'Il est réservé aux touristes' },
            { id: 'd', text: 'Il circule uniquement la nuit' },
          ],
        },
        answer: { id: 'b' },
        points: 10,
      },
      {
        type: ExerciseType.ARABIC_KEYBOARD,
        prompt: 'Écris « le train » en arabe',
        data: {
          target: 'القطر',
          targetTransliteration: 'l-qtar',
          translation: 'le train',
          hint: 'Moyen de transport ferroviaire',
          audio: 'القطر',
        },
        answer: { text: 'القطر' },
        points: 15,
      },
      {
        type: ExerciseType.DRAWING,
        prompt: 'Trace « الطوبيس »',
        data: { target: 'الطوبيس', hint: 'toubis — le bus', threshold: 0.3 },
        answer: { value: 'الطوبيس' },
        points: 15,
      },
      {
        type: ExerciseType.FILL_BLANK,
        prompt: 'Complète : فوقاش كيمشي ___ لمراكش؟ (À quelle heure part le train pour Marrakech ?)',
        data: {
          sentence: 'فوقاش كيمشي ___ لمراكش؟',
          options: ['القطر', 'الطوبيس', 'الطاكسي', 'الطيارة'],
        },
        answer: { text: 'القطر', translation: 'le train', transliteration: 'l-qtar' },
        points: 10,
      },
      {
        type: ExerciseType.MULTIPLE_CHOICE,
        prompt: 'Comment dit-on « À quelle heure part le prochain train pour Marrakech ? » en darija ?',
        data: {
          options: [
            { id: 'a', text: 'Fuqach kimchi l-taksiye l-Marrakech?' },
            { id: 'b', text: 'Fuqach kimchi l-qtar l-jay l-Marrakech?', transliteration: 'فوقاش كيمشي القطر الجاي لمراكش؟' },
            { id: 'c', text: 'Fayn l-qtar l-Marrakech?' },
            { id: 'd', text: 'Wach kayn qtar l-Marrakech?' },
          ],
        },
        answer: { id: 'b' },
        points: 15,
      },
    ],
  },

  // ─────────────────────────── LEÇON 2 — À la gare routière ───────────────────────────
  {
    order: 2,
    slug: 'les-transports-lecon-2',
    title: 'À la gare routière',
    subtitle: 'Acheter un billet, choisir sa place',
    exos: [
      {
        type: ExerciseType.MULTIPLE_CHOICE,
        prompt: '« بغيت تيكي واحد لـ أكادير » signifie :',
        data: {
          options: [
            { id: 'a', text: 'Le prochain bus pour Agadir est à quelle heure ?' },
            { id: 'b', text: 'Je veux un billet pour Agadir' },
            { id: 'c', text: 'Il y a des places pour Agadir ?' },
            { id: 'd', text: 'Combien coûte Agadir ?' },
          ],
        },
        answer: { id: 'b' },
        points: 10,
      },
      {
        type: ExerciseType.LISTENING,
        prompt: 'Quelle demande entends-tu ?',
        data: {
          text: 'ذهاب وإياب',
          lang: 'ar-MA',
          audio: 'ذهاب وإياب',
          options: [
            { id: 'a', text: 'ذهاب فقط', transliteration: 'dhahab faqat (aller simple)' },
            { id: 'b', text: 'ذهاب وإياب', transliteration: 'dhahab w-iyab (aller-retour)' },
            { id: 'c', text: 'درجة أولى', transliteration: 'daraja oula (1re classe)' },
            { id: 'd', text: 'بلاصة ديالي', transliteration: 'blasa dyali (ma place)' },
          ],
        },
        answer: { id: 'b' },
        points: 10,
      },
      {
        type: ExerciseType.MULTIPLE_CHOICE,
        prompt: '« ذهاب وإياب » signifie :',
        data: {
          options: [
            { id: 'a', text: 'Aller simple' },
            { id: 'b', text: 'Aller-retour' },
            { id: 'c', text: 'Première classe' },
            { id: 'd', text: 'Place réservée' },
          ],
        },
        answer: { id: 'b' },
        points: 10,
      },
      {
        type: ExerciseType.ARABIC_KEYBOARD,
        prompt: 'Écris « un billet » en arabe',
        data: {
          target: 'تيكي',
          targetTransliteration: 'tiki',
          translation: 'un billet',
          hint: 'Ce qu\'on achète au guichet',
          audio: 'تيكي',
        },
        answer: { text: 'تيكي' },
        points: 15,
      },
      {
        type: ExerciseType.DRAWING,
        prompt: 'Trace « ذهاب »',
        data: { target: 'ذهاب', hint: 'dhahab — aller', threshold: 0.35 },
        answer: { value: 'ذهاب' },
        points: 15,
      },
      {
        type: ExerciseType.FILL_BLANK,
        prompt: 'Complète : بغيت تيكي ذهاب ___ لفاس (Je veux un aller-retour pour Fès)',
        data: {
          sentence: 'بغيت تيكي ذهاب ___ لفاس',
          options: ['وإياب', 'فقط', 'واحد', 'فريق'],
        },
        answer: { text: 'وإياب', translation: 'et retour', transliteration: 'w-iyab' },
        points: 10,
      },
      {
        type: ExerciseType.MULTIPLE_CHOICE,
        prompt: '« شحال التيكي لـ طنجة؟ » signifie :',
        data: {
          options: [
            { id: 'a', text: 'Combien coûte le billet pour Tanger ?' },
            { id: 'b', text: 'À quelle heure le bus de Tanger ?' },
            { id: 'c', text: 'Où va le bus de Tanger ?' },
            { id: 'd', text: 'Combien de temps pour Tanger ?' },
          ],
        },
        answer: { id: 'a' },
        points: 15,
      },
    ],
  },

  // ─────────────────────────── LEÇON 3 — Dans le taxi ───────────────────────────
  {
    order: 3,
    slug: 'les-transports-lecon-3',
    title: 'Dans le taxi',
    subtitle: 'Indiquer une destination',
    exos: [
      {
        type: ExerciseType.MULTIPLE_CHOICE,
        prompt: '« وديني لـ… » (waddini l…) signifie :',
        data: {
          options: [
            { id: 'a', text: 'Je cherche…' },
            { id: 'b', text: 'Emmène-moi à…' },
            { id: 'c', text: 'Je paie pour…' },
            { id: 'd', text: 'C\'est loin de…' },
          ],
        },
        answer: { id: 'b' },
        points: 10,
      },
      {
        type: ExerciseType.LISTENING,
        prompt: 'Quelle instruction entends-tu ?',
        data: {
          text: 'وقف هنا',
          lang: 'ar-MA',
          audio: 'وقف هنا',
          options: [
            { id: 'a', text: 'وقف هنا', transliteration: 'wqef hna (arrête-toi ici)' },
            { id: 'b', text: 'كمّل سير', transliteration: 'kemmel sir (continue)' },
            { id: 'c', text: 'دور لليمين', transliteration: 'dor l-lemin (tourne à droite)' },
            { id: 'd', text: 'رجع للور', transliteration: 'rjaa l-lor (recule)' },
          ],
        },
        answer: { id: 'a' },
        points: 10,
      },
      {
        type: ExerciseType.MULTIPLE_CHOICE,
        prompt: '« شغل الكونتور عفاك » signifie :',
        data: {
          options: [
            { id: 'a', text: 'Allume la clim s\'il te plaît' },
            { id: 'b', text: 'Mets le compteur s\'il te plaît' },
            { id: 'c', text: 'Baisse la radio s\'il te plaît' },
            { id: 'd', text: 'Ouvre le coffre s\'il te plaît' },
          ],
          hint: 'Demande courante à un chauffeur de taxi',
        },
        answer: { id: 'b' },
        points: 10,
      },
      {
        type: ExerciseType.ARABIC_KEYBOARD,
        prompt: 'Écris « arrête-toi ici » en arabe',
        data: {
          target: 'وقف هنا',
          targetTransliteration: 'wqef hna',
          translation: 'arrête-toi ici',
          hint: 'Instruction au chauffeur',
          audio: 'وقف هنا',
        },
        answer: { text: 'وقف هنا' },
        points: 15,
      },
      {
        type: ExerciseType.DRAWING,
        prompt: 'Trace « الكونتور »',
        data: { target: 'الكونتور', hint: 'l-kuntur — le compteur', threshold: 0.3 },
        answer: { value: 'الكونتور' },
        points: 15,
      },
      {
        type: ExerciseType.FILL_BLANK,
        prompt: 'Complète : ___ لـ المحطة، عفاك (Emmène-moi à la gare s\'il te plaît)',
        data: {
          sentence: '___ لـ المحطة، عفاك',
          options: ['وديني', 'عطيني', 'بغيتي', 'شريت'],
        },
        answer: { text: 'وديني', translation: 'emmène-moi', transliteration: 'waddini' },
        points: 10,
      },
      {
        type: ExerciseType.MULTIPLE_CHOICE,
        prompt: 'Comment dit-on « C\'est combien jusqu\'à l\'aéroport ? » en darija ?',
        data: {
          options: [
            { id: 'a', text: 'Fin l-mataar?' },
            { id: 'b', text: 'Shhal ghadi l-mataar?', transliteration: 'شحال غادي للمطار؟' },
            { id: 'c', text: 'Fuqach l-mataar?' },
            { id: 'd', text: 'Wach b3id l-mataar?' },
          ],
        },
        answer: { id: 'b' },
        points: 15,
      },
    ],
  },
];

async function main() {
  console.log('🚌 Refonte « Les Transports » (DARIJA@21)\n');

  const mod = await prisma.module.findUnique({ where: { slug: 'les-transports' } });
  if (!mod) {
    console.error('❌ Module les-transports introuvable.');
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
      title: 'Les Transports',
      subtitle: 'Voyager au Maroc',
      description: 'Train, bus, grand taxi : comment voyager partout au Maroc en darija.',
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
