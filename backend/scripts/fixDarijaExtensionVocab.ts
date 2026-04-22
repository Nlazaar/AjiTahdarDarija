/**
 * Corrige l'extension DARIJA : remplace les Exercise "libres" (prompt/data/answer)
 * créés par seedDarijaExtension.ts par le bon pattern = Vocabulary + Exercise de
 * jointure {lessonId, vocabularyId, type=LISTENING}.
 *
 * Pourquoi : l'admin et le runtime listent les "Items" d'une leçon via
 * Exercise.vocabularyId non-null. Un Exercise sans vocabularyId est invisible.
 *
 * Usage : npx tsx scripts/fixDarijaExtensionVocab.ts
 */
import { PrismaClient, ExerciseType } from '@prisma/client';

const prisma = new PrismaClient();

type Vocab = { word: string; translit: string; fr: string; tag: string };

// ── Vocab thématique par leçon (slug de leçon → liste de mots) ──────────────
const VOCAB_BY_LESSON: Record<string, Vocab[]> = {
  // 34 — Agadir — Restaurant
  'restaurant-lecon-1': [
    { word: 'طاجين', translit: 'tajin', fr: 'tajine', tag: 'restaurant' },
    { word: 'أتاي', translit: 'atay', fr: 'thé', tag: 'restaurant' },
    { word: 'الماء', translit: 'l-ma', fr: 'eau', tag: 'restaurant' },
    { word: 'الحساب', translit: 'l-hsab', fr: 'l\'addition', tag: 'restaurant' },
    { word: 'الخبز', translit: 'l-khobz', fr: 'pain', tag: 'restaurant' },
    { word: 'القهوة', translit: 'l-qahwa', fr: 'café', tag: 'restaurant' },
    { word: 'بغيت', translit: 'bghit', fr: 'je veux', tag: 'restaurant' },
    { word: 'بصحتك', translit: 'b-sshtek', fr: 'à ta santé / bon appétit', tag: 'restaurant' },
  ],

  // 36 — Tiznit — Argent
  'argent-lecon-1': [
    { word: 'الفلوس', translit: 'l-flous', fr: 'l\'argent', tag: 'argent' },
    { word: 'درهم', translit: 'dirham', fr: 'dirham', tag: 'argent' },
    { word: 'الثمن', translit: 't-taman', fr: 'le prix', tag: 'argent' },
    { word: 'غالي', translit: 'ghali', fr: 'cher', tag: 'argent' },
    { word: 'رخيص', translit: 'rkhis', fr: 'bon marché', tag: 'argent' },
    { word: 'ناقص', translit: 'naqes', fr: 'moins / baisse', tag: 'argent' },
    { word: 'زيد', translit: 'zid', fr: 'ajoute / plus', tag: 'argent' },
    { word: 'شحال', translit: 'shhal', fr: 'combien', tag: 'argent' },
  ],

  // 37 — Sidi Ifni — Taxi
  'taxi-lecon-1': [
    { word: 'طاكسي', translit: 'taksi', fr: 'taxi', tag: 'transport' },
    { word: 'المحطة', translit: 'l-mhatta', fr: 'la gare', tag: 'transport' },
    { word: 'فين', translit: 'fin', fr: 'où', tag: 'transport' },
    { word: 'نيشان', translit: 'nichan', fr: 'tout droit', tag: 'transport' },
    { word: 'ليمين', translit: 'l-limn', fr: 'à droite', tag: 'transport' },
    { word: 'ليسر', translit: 'l-lisar', fr: 'à gauche', tag: 'transport' },
    { word: 'وقف', translit: 'wqef', fr: 'arrête', tag: 'transport' },
    { word: 'بعيد', translit: 'b3id', fr: 'loin', tag: 'transport' },
  ],

  // 38 — Ouarzazate — Hôtel
  'hotel-lecon-1': [
    { word: 'الأوطيل', translit: 'l-otil', fr: 'l\'hôtel', tag: 'hotel' },
    { word: 'البيت', translit: 'l-bit', fr: 'la chambre', tag: 'hotel' },
    { word: 'المفتاح', translit: 'l-meftah', fr: 'la clé', tag: 'hotel' },
    { word: 'الويفي', translit: 'l-wifi', fr: 'le wifi', tag: 'hotel' },
    { word: 'الفطور', translit: 'l-ftour', fr: 'petit-déjeuner', tag: 'hotel' },
    { word: 'الليلة', translit: 'l-lila', fr: 'la nuit', tag: 'hotel' },
    { word: 'رياض', translit: 'ryad', fr: 'riad', tag: 'hotel' },
    { word: 'مرحبا', translit: 'merhba', fr: 'bienvenue', tag: 'hotel' },
  ],

  // 39 — Aït Benhaddou — Fêtes
  'fetes-lecon-1': [
    { word: 'العيد', translit: 'l-3id', fr: 'la fête', tag: 'fetes' },
    { word: 'رمضان', translit: 'Ramadan', fr: 'Ramadan', tag: 'fetes' },
    { word: 'عاشوراء', translit: '3achoura', fr: 'Achoura', tag: 'fetes' },
    { word: 'الفطور', translit: 'l-ftour', fr: 'iftar (rupture du jeûne)', tag: 'fetes' },
    { word: 'السحور', translit: 's-shour', fr: 'repas avant l\'aube', tag: 'fetes' },
    { word: 'مبروك', translit: 'mebrouk', fr: 'félicitations', tag: 'fetes' },
    { word: 'عيد مبارك', translit: '3id mubarak', fr: 'joyeuse fête', tag: 'fetes' },
    { word: 'الحناء', translit: 'l-henna', fr: 'le henné', tag: 'fetes' },
  ],

  // 40 — Zagora — Désert
  'desert-lecon-1': [
    { word: 'الصحرا', translit: 's-sahra', fr: 'le désert', tag: 'desert' },
    { word: 'الرمل', translit: 'r-rmel', fr: 'le sable', tag: 'desert' },
    { word: 'الجمل', translit: 'j-jmel', fr: 'le chameau', tag: 'desert' },
    { word: 'الواحة', translit: 'l-waha', fr: 'l\'oasis', tag: 'desert' },
    { word: 'الخيمة', translit: 'l-khayma', fr: 'la tente', tag: 'desert' },
    { word: 'الكثبان', translit: 'l-kathban', fr: 'les dunes', tag: 'desert' },
    { word: 'البدوي', translit: 'l-bedwi', fr: 'le bédouin', tag: 'desert' },
    { word: 'البير', translit: 'l-bir', fr: 'le puits', tag: 'desert' },
  ],

  // 41 — M'Hamid — Téléphone
  'telephone-lecon-1': [
    { word: 'التيليفون', translit: 't-tilifon', fr: 'le téléphone', tag: 'communication' },
    { word: 'النومرو', translit: 'n-noumro', fr: 'le numéro', tag: 'communication' },
    { word: 'عيط', translit: '3iyet', fr: 'appelle', tag: 'communication' },
    { word: 'الريزو', translit: 'r-rizo', fr: 'le réseau', tag: 'communication' },
    { word: 'الويفي', translit: 'l-wifi', fr: 'le wifi', tag: 'communication' },
    { word: 'المسج', translit: 'l-mesaj', fr: 'le message', tag: 'communication' },
    { word: 'البطاريا', translit: 'l-batarya', fr: 'la batterie', tag: 'communication' },
    { word: 'خاوية', translit: 'khawya', fr: 'vide', tag: 'communication' },
  ],

  // 42 — Erfoud — Thé
  'the-lecon-1': [
    { word: 'أتاي', translit: 'atay', fr: 'thé', tag: 'the' },
    { word: 'النعناع', translit: 'n-n3na3', fr: 'menthe', tag: 'the' },
    { word: 'السكر', translit: 's-sokkar', fr: 'sucre', tag: 'the' },
    { word: 'البراد', translit: 'l-berrad', fr: 'théière', tag: 'the' },
    { word: 'الكاس', translit: 'l-kas', fr: 'verre', tag: 'the' },
    { word: 'تفضل', translit: 'tfeddel', fr: 'sers-toi / je t\'en prie', tag: 'the' },
    { word: 'مرحبا', translit: 'merhba', fr: 'bienvenue', tag: 'the' },
    { word: 'الضيافة', translit: 'd-diyafa', fr: 'hospitalité', tag: 'the' },
  ],

  // 43 — Merzouga — Hammam
  'hammam-lecon-1': [
    { word: 'الحمام', translit: 'l-hammam', fr: 'hammam (bain)', tag: 'hammam' },
    { word: 'الصابون', translit: 's-sabun', fr: 'savon', tag: 'hammam' },
    { word: 'الكيس', translit: 'l-kis', fr: 'gant de gommage', tag: 'hammam' },
    { word: 'الحنا', translit: 'l-henna', fr: 'henné', tag: 'hammam' },
    { word: 'الماء', translit: 'l-ma', fr: 'eau', tag: 'hammam' },
    { word: 'سخون', translit: 'skhoun', fr: 'chaud', tag: 'hammam' },
    { word: 'بارد', translit: 'bared', fr: 'froid', tag: 'hammam' },
    { word: 'البلدي', translit: 'l-beldi', fr: 'traditionnel', tag: 'hammam' },
  ],

  // 44 — Rissani — Musique
  'musique-lecon-1': [
    { word: 'الموسيقى', translit: 'l-mousiqa', fr: 'la musique', tag: 'musique' },
    { word: 'گناوة', translit: 'Gnawa', fr: 'Gnawa', tag: 'musique' },
    { word: 'الراي', translit: 'r-rai', fr: 'le raï', tag: 'musique' },
    { word: 'الشعبي', translit: 'ch-cha3bi', fr: 'le chaabi', tag: 'musique' },
    { word: 'الملحون', translit: 'l-melhoun', fr: 'le melhoun', tag: 'musique' },
    { word: 'غنية', translit: 'ghniya', fr: 'chanson', tag: 'musique' },
    { word: 'العود', translit: 'l-3oud', fr: 'oud (luth)', tag: 'musique' },
    { word: 'الدربوكة', translit: 'd-derbouka', fr: 'darbouka', tag: 'musique' },
  ],

  // 45 — Guelmim — Sport
  'sport-lecon-1': [
    { word: 'الرياضة', translit: 'r-riyada', fr: 'le sport', tag: 'sport' },
    { word: 'الكرة', translit: 'l-koura', fr: 'le ballon / foot', tag: 'sport' },
    { word: 'المنتخب', translit: 'l-montakhab', fr: 'l\'équipe nationale', tag: 'sport' },
    { word: 'گول', translit: 'goal', fr: 'but', tag: 'sport' },
    { word: 'ربح', translit: 'rbeh', fr: 'gagner', tag: 'sport' },
    { word: 'خسر', translit: 'khser', fr: 'perdre', tag: 'sport' },
    { word: 'المباراة', translit: 'l-mubara', fr: 'le match', tag: 'sport' },
    { word: 'أسود الأطلس', translit: 'usud l-atlas', fr: 'Lions de l\'Atlas', tag: 'sport' },
  ],

  // 46 — Tan-Tan — Mer & pêche
  'mer-peche-lecon-1': [
    { word: 'البحر', translit: 'l-bhar', fr: 'la mer', tag: 'mer' },
    { word: 'الحوت', translit: 'l-hout', fr: 'le poisson', tag: 'mer' },
    { word: 'الصياد', translit: 's-seyyad', fr: 'le pêcheur', tag: 'mer' },
    { word: 'المرسى', translit: 'l-mersa', fr: 'le port', tag: 'mer' },
    { word: 'الفلوكة', translit: 'l-flouka', fr: 'la barque', tag: 'mer' },
    { word: 'البلاج', translit: 'l-blaj', fr: 'la plage', tag: 'mer' },
    { word: 'الموجة', translit: 'l-mouja', fr: 'la vague', tag: 'mer' },
    { word: 'طري', translit: 'tri', fr: 'frais', tag: 'mer' },
  ],

  // 47 — Tarfaya — Souvenirs
  'souvenirs-lecon-1': [
    { word: 'البارح', translit: 'l-bareh', fr: 'hier', tag: 'temps' },
    { word: 'اليوم', translit: 'l-youm', fr: 'aujourd\'hui', tag: 'temps' },
    { word: 'غدا', translit: 'ghedda', fr: 'demain', tag: 'temps' },
    { word: 'كنفتاكر', translit: 'kanftakar', fr: 'je me souviens', tag: 'recit' },
    { word: 'ذكرى', translit: 'dikra', fr: 'souvenir', tag: 'recit' },
    { word: 'ملي', translit: 'mlli', fr: 'quand', tag: 'recit' },
    { word: 'صغير', translit: 'sghir', fr: 'petit', tag: 'recit' },
    { word: 'كبير', translit: 'kbir', fr: 'grand', tag: 'recit' },
  ],

  // Salé — Nombres (fix du module vocab-nombres vide)
  'vocab-nombres-lecon-1': [
    { word: 'واحد', translit: 'wahed', fr: 'un (1)', tag: 'nombre' },
    { word: 'جوج', translit: 'jouj', fr: 'deux (2)', tag: 'nombre' },
    { word: 'تلاتة', translit: 'tlata', fr: 'trois (3)', tag: 'nombre' },
    { word: 'ربعة', translit: 'reb3a', fr: 'quatre (4)', tag: 'nombre' },
    { word: 'خمسة', translit: 'khamsa', fr: 'cinq (5)', tag: 'nombre' },
    { word: 'ستة', translit: 'setta', fr: 'six (6)', tag: 'nombre' },
    { word: 'سبعة', translit: 'seb3a', fr: 'sept (7)', tag: 'nombre' },
    { word: 'تمنية', translit: 'tmnia', fr: 'huit (8)', tag: 'nombre' },
    { word: 'تسعود', translit: 'ts3oud', fr: 'neuf (9)', tag: 'nombre' },
    { word: 'عشرة', translit: '3achra', fr: 'dix (10)', tag: 'nombre' },
  ],
};

async function main() {
  console.log('🔧 Fix extension DARIJA — conversion Exercise → Vocabulary\n');

  const lang = await prisma.language.findUnique({ where: { code: 'ar-MA' } });
  if (!lang) {
    console.error('❌ Langue ar-MA introuvable.');
    process.exit(1);
  }

  let totalVocab = 0;
  let totalAttachments = 0;

  for (const [lessonSlug, vocabs] of Object.entries(VOCAB_BY_LESSON)) {
    const lesson = await prisma.lesson.findUnique({ where: { slug: lessonSlug } });
    if (!lesson) {
      console.warn(`   ⚠️  Leçon ${lessonSlug} introuvable, skip`);
      continue;
    }

    // 1. Purger les Exercise orphelins (sans vocabularyId) de cette leçon
    const deletedOrphans = await prisma.exercise.deleteMany({
      where: { lessonId: lesson.id, vocabularyId: null },
    });

    // 2. Pour chaque vocab : upsert + attachement (re-run safe)
    for (const v of vocabs) {
      // Cherche un vocab existant avec même word + languageId (pour éviter doublons)
      let vocab = await prisma.vocabulary.findFirst({
        where: { word: v.word, languageId: lang.id },
      });
      if (!vocab) {
        vocab = await prisma.vocabulary.create({
          data: {
            word: v.word,
            transliteration: v.translit,
            translation: { fr: v.fr },
            languageId: lang.id,
            tags: [v.tag],
            isPublished: true,
          },
        });
        totalVocab++;
      }

      // Attache via Exercise de jointure (idempotent)
      const existing = await prisma.exercise.findFirst({
        where: { lessonId: lesson.id, vocabularyId: vocab.id },
      });
      if (!existing) {
        await prisma.exercise.create({
          data: { lessonId: lesson.id, vocabularyId: vocab.id, type: ExerciseType.LISTENING, points: 10 },
        });
        totalAttachments++;
      }
    }

    console.log(`   ✓ ${lessonSlug.padEnd(30)} purgé=${deletedOrphans.count}  vocab=${vocabs.length}`);
  }

  console.log(`\n✅ Terminé : ${totalVocab} vocab créés, ${totalAttachments} attachements.\n`);
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error('❌ Erreur :', e);
  prisma.$disconnect();
  process.exit(1);
});
