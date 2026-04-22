/**
 * Extension du parcours DARIJA — 13 nouveaux modules (34 → 47) + orphelins 33/35 + fix Salé.
 *
 * Phase 2 (modules neufs) : pour chaque ville du Sud/Atlas/Sahara, crée le Module
 * (metadata + cityKey pour la carte Maroc) et 1 leçon de découverte (6 exercices
 * authentiques en darija : MC, Listening, Fill-blank, Arabic-keyboard, Drawing, MC récap).
 *
 * Phase 1 (orphelins) : crée les 2 modules `se-presenter` (Marrakech@33) et
 * `les-achats` (Taroudant@35). Les contenus viennent ensuite de
 * seedSePresenterRefonte.ts et seedLesAchatsRefonte.ts.
 *
 * Phase 3 (Salé) : ajoute 1 leçon au module `vocab-nombres` (actuellement vide).
 *
 * Usage : npx tsx scripts/seedDarijaExtension.ts
 */
import { PrismaClient, ExerciseType, ModuleTrack } from '@prisma/client';

const prisma = new PrismaClient();

// ── Types ──────────────────────────────────────────────────────────────────
type Exo = {
  type: ExerciseType;
  prompt: string;
  data: any;
  answer: any;
  points: number;
};

type NewModule = {
  canonicalOrder: number;
  slug: string;
  title: string;
  titleAr: string;
  subtitle: string;
  description: string;
  cityName: string;
  cityNameAr: string;
  cityKey: string;
  emoji: string;
  photoCaption: string;
  colorA: string;
  colorB: string;
  shadowColor: string;
  lesson: {
    slug: string;
    title: string;
    subtitle: string;
    exos: Exo[];
  };
};

// ── Modules orphelins à (pré-)créer (contenu rempli par leurs scripts) ─────
const ORPHAN_MODULES = [
  {
    canonicalOrder: 33,
    slug: 'se-presenter',
    title: 'Se présenter',
    titleAr: 'نعرفك على راسي',
    subtitle: 'Moi, toi, origine et âge',
    description: 'Apprends à te présenter, demander à quelqu\'un son nom, son origine et son âge en darija.',
    cityName: 'Marrakech',
    cityNameAr: 'مراكش',
    cityKey: 'marrakech',
    emoji: '🕌',
    photoCaption: 'La ville rouge, cœur de la culture marocaine',
    colorA: '#e11d48',
    colorB: '#be123c',
    shadowColor: '#9f1239',
  },
  {
    canonicalOrder: 35,
    slug: 'les-achats',
    title: 'Les achats & le marchandage',
    titleAr: 'الشراء و السوامة',
    subtitle: 'Marcher au souk comme un local',
    description: 'Prix, marchandage, commerçants : tout le vocabulaire du souk marocain.',
    cityName: 'Taroudant',
    cityNameAr: 'تارودانت',
    cityKey: 'taroudant',
    emoji: '🛍️',
    photoCaption: 'La petite Marrakech et ses souks berbères',
    colorA: '#d97706',
    colorB: '#b45309',
    shadowColor: '#92400e',
  },
];

// ── 13 nouveaux modules (34 + 36 → 47) ──────────────────────────────────────
const NEW_MODULES: NewModule[] = [
  // ────────────────────────── 34 — Agadir — Restaurant ──────────────────────────
  {
    canonicalOrder: 34,
    slug: 'vocab-restaurant',
    title: 'Au restaurant',
    titleAr: 'فالريسطورون',
    subtitle: 'Commander, manger, remercier',
    description: 'Du tajine au thé à la menthe : commande ton repas avec aisance en darija.',
    cityName: 'Agadir',
    cityNameAr: 'أگادير',
    cityKey: 'agadir',
    emoji: '🍽️',
    photoCaption: 'La perle du Sud et sa longue plage atlantique',
    colorA: '#f97316',
    colorB: '#ea580c',
    shadowColor: '#c2410c',
    lesson: {
      slug: 'restaurant-lecon-1',
      title: 'Commander un repas',
      subtitle: 'Les mots du restaurant',
      exos: [
        {
          type: ExerciseType.MULTIPLE_CHOICE,
          prompt: '« الطاجين » (tajine) signifie :',
          data: { options: [
            { id: 'a', text: 'Plat traditionnel cuit dans un pot en terre' },
            { id: 'b', text: 'Assiette de soupe' },
            { id: 'c', text: 'Dessert au miel' },
            { id: 'd', text: 'Pain marocain' },
          ]},
          answer: { id: 'a' },
          points: 10,
        },
        {
          type: ExerciseType.LISTENING,
          prompt: 'Qu\'est-ce qu\'on commande ?',
          data: {
            text: 'بغيت أتاي',
            lang: 'ar-MA',
            audio: 'بغيت أتاي',
            options: [
              { id: 'a', text: 'بغيت أتاي', transliteration: 'bghit atay (je veux du thé)' },
              { id: 'b', text: 'بغيت الماء', transliteration: 'bghit l-ma (je veux de l\'eau)' },
              { id: 'c', text: 'بغيت القهوة', transliteration: 'bghit l-qahwa (je veux du café)' },
              { id: 'd', text: 'بغيت الخبز', transliteration: 'bghit l-khobz (je veux du pain)' },
            ],
          },
          answer: { id: 'a' },
          points: 10,
        },
        {
          type: ExerciseType.MULTIPLE_CHOICE,
          prompt: 'Comment dit-on « L\'addition, s\'il vous plaît » ?',
          data: { options: [
            { id: 'a', text: 'Shukran bzzaf' },
            { id: 'b', text: 'L-hsab 3afak', transliteration: 'الحساب عافاك' },
            { id: 'c', text: 'Bghit ntmechcha' },
            { id: 'd', text: 'Wach kayn?' },
          ]},
          answer: { id: 'b' },
          points: 15,
        },
        {
          type: ExerciseType.ARABIC_KEYBOARD,
          prompt: 'Écris « de l\'eau » en arabe',
          data: {
            target: 'الماء',
            targetTransliteration: 'l-ma',
            translation: 'de l\'eau',
            hint: 'Boisson essentielle',
            audio: 'الماء',
          },
          answer: { text: 'الماء' },
          points: 15,
        },
        {
          type: ExerciseType.FILL_BLANK,
          prompt: 'Complète : بغيت ___ (Je veux un tajine)',
          data: { sentence: 'بغيت ___', options: ['طاجين', 'كاس', 'كوزينا', 'ماء'] },
          answer: { text: 'طاجين', translation: 'tajine', transliteration: 'tajin' },
          points: 10,
        },
        {
          type: ExerciseType.MULTIPLE_CHOICE,
          prompt: '« بصحتك » (bsshtek) se dit :',
          data: { options: [
            { id: 'a', text: 'Pour dire bonjour' },
            { id: 'b', text: 'Pour souhaiter bon appétit / à ta santé' },
            { id: 'c', text: 'Pour demander le prix' },
            { id: 'd', text: 'Pour dire au revoir' },
          ]},
          answer: { id: 'b' },
          points: 10,
        },
      ],
    },
  },

  // ────────────────────────── 36 — Tiznit — Argent ──────────────────────────
  {
    canonicalOrder: 36,
    slug: 'vocab-argent',
    title: 'L\'argent & la banque',
    titleAr: 'الفلوس و البنك',
    subtitle: 'Payer, changer, compter en dirhams',
    description: 'Dirhams, billets, change : gère ton argent au Maroc sans stress.',
    cityName: 'Tiznit',
    cityNameAr: 'تيزنيت',
    cityKey: 'tiznit',
    emoji: '💰',
    photoCaption: 'La ville des bijoutiers berbères et de l\'argent massif',
    colorA: '#ca8a04',
    colorB: '#a16207',
    shadowColor: '#854d0e',
    lesson: {
      slug: 'argent-lecon-1',
      title: 'Parler d\'argent',
      subtitle: 'Dirhams et paiement',
      exos: [
        {
          type: ExerciseType.MULTIPLE_CHOICE,
          prompt: '« الفلوس » (flous) signifie :',
          data: { options: [
            { id: 'a', text: 'Les fleurs' },
            { id: 'b', text: 'L\'argent' },
            { id: 'c', text: 'Les amis' },
            { id: 'd', text: 'Les courses' },
          ]},
          answer: { id: 'b' },
          points: 10,
        },
        {
          type: ExerciseType.LISTENING,
          prompt: 'Combien ça coûte ?',
          data: {
            text: 'بعشرين درهم',
            lang: 'ar-MA',
            audio: 'بعشرين درهم',
            options: [
              { id: 'a', text: 'بعشرة دراهم', transliteration: 'b-3achra drahem (10 dh)' },
              { id: 'b', text: 'بعشرين درهم', transliteration: 'b-3echrin dirham (20 dh)' },
              { id: 'c', text: 'بخمسين درهم', transliteration: 'b-khamsin dirham (50 dh)' },
              { id: 'd', text: 'بمية درهم', transliteration: 'b-mya dirham (100 dh)' },
            ],
          },
          answer: { id: 'b' },
          points: 10,
        },
        {
          type: ExerciseType.MULTIPLE_CHOICE,
          prompt: 'Comment dit-on « C\'est cher » ?',
          data: { options: [
            { id: 'a', text: 'Ghali', transliteration: 'غالي' },
            { id: 'b', text: 'Rkhis' },
            { id: 'c', text: 'Mezyan' },
            { id: 'd', text: 'Hamdullah' },
          ]},
          answer: { id: 'a' },
          points: 10,
        },
        {
          type: ExerciseType.ARABIC_KEYBOARD,
          prompt: 'Écris « dirham » en arabe',
          data: {
            target: 'درهم',
            targetTransliteration: 'dirham',
            translation: 'dirham',
            hint: 'Monnaie du Maroc',
            audio: 'درهم',
          },
          answer: { text: 'درهم' },
          points: 15,
        },
        {
          type: ExerciseType.FILL_BLANK,
          prompt: 'Complète : شحال ___ ؟ (Combien ça coûte ?)',
          data: { sentence: 'شحال ___ ؟', options: ['الثمن', 'الوقت', 'المعاد', 'الحال'] },
          answer: { text: 'الثمن', translation: 'le prix', transliteration: 't-taman' },
          points: 15,
        },
        {
          type: ExerciseType.MULTIPLE_CHOICE,
          prompt: 'Pour demander un rabais, on dit :',
          data: { options: [
            { id: 'a', text: 'Zid chwiya!' },
            { id: 'b', text: 'Naqes chwiya 3afak', transliteration: 'ناقص شوية عافاك (Baisse un peu stp)' },
            { id: 'c', text: 'Safi safi' },
            { id: 'd', text: 'Chokran bzaf' },
          ]},
          answer: { id: 'b' },
          points: 10,
        },
      ],
    },
  },

  // ────────────────────────── 37 — Sidi Ifni — Taxi ──────────────────────────
  {
    canonicalOrder: 37,
    slug: 'vocab-taxi',
    title: 'Taxi & transport',
    titleAr: 'الطاكسي و الطريق',
    subtitle: 'Se déplacer au Maroc',
    description: 'Grand taxi, petit taxi, CTM : prends la route comme un Marocain.',
    cityName: 'Sidi Ifni',
    cityNameAr: 'سيدي إفني',
    cityKey: 'sidi-ifni',
    emoji: '🚕',
    photoCaption: 'L\'ancienne enclave espagnole face à l\'Atlantique',
    colorA: '#0ea5e9',
    colorB: '#0284c7',
    shadowColor: '#0369a1',
    lesson: {
      slug: 'taxi-lecon-1',
      title: 'Prendre un taxi',
      subtitle: 'Le vocabulaire du voyage',
      exos: [
        {
          type: ExerciseType.MULTIPLE_CHOICE,
          prompt: '« الطاكسي الصغير » est :',
          data: { options: [
            { id: 'a', text: 'Le petit taxi (en ville, compteur)' },
            { id: 'b', text: 'Le grand taxi (entre villes)' },
            { id: 'c', text: 'Le bus' },
            { id: 'd', text: 'Le train' },
          ]},
          answer: { id: 'a' },
          points: 10,
        },
        {
          type: ExerciseType.LISTENING,
          prompt: 'Que dit le passager ?',
          data: {
            text: 'وقف هنا عافاك',
            lang: 'ar-MA',
            audio: 'وقف هنا عافاك',
            options: [
              { id: 'a', text: 'وقف هنا عافاك', transliteration: 'wqef hna 3afak (arrête-toi ici stp)' },
              { id: 'b', text: 'سير نيشان', transliteration: 'sir nichan (va tout droit)' },
              { id: 'c', text: 'دور لليمين', transliteration: 'dour l-limn (tourne à droite)' },
              { id: 'd', text: 'زد شوية', transliteration: 'zid chwiya (un peu plus)' },
            ],
          },
          answer: { id: 'a' },
          points: 10,
        },
        {
          type: ExerciseType.MULTIPLE_CHOICE,
          prompt: 'Comment dit-on « Où vas-tu ? » au chauffeur ?',
          data: { options: [
            { id: 'a', text: 'Fin ghadi?', transliteration: 'فين غادي؟' },
            { id: 'b', text: 'Kifash?' },
            { id: 'c', text: 'Chkoun nta?' },
            { id: 'd', text: 'Ach smiytek?' },
          ]},
          answer: { id: 'a' },
          points: 10,
        },
        {
          type: ExerciseType.ARABIC_KEYBOARD,
          prompt: 'Écris « taxi » en arabe',
          data: {
            target: 'طاكسي',
            targetTransliteration: 'taksi',
            translation: 'taxi',
            hint: 'Moyen de transport',
            audio: 'طاكسي',
          },
          answer: { text: 'طاكسي' },
          points: 15,
        },
        {
          type: ExerciseType.FILL_BLANK,
          prompt: 'Complète : بغيت نمشي ل ___ (Je veux aller à la gare)',
          data: { sentence: 'بغيت نمشي ل ___', options: ['المحطة', 'الدار', 'السوق', 'البلاج'] },
          answer: { text: 'المحطة', translation: 'la gare', transliteration: 'l-mhatta' },
          points: 15,
        },
        {
          type: ExerciseType.MULTIPLE_CHOICE,
          prompt: '« CTM » au Maroc, c\'est :',
          data: { options: [
            { id: 'a', text: 'Une marque de téléphone' },
            { id: 'b', text: 'La compagnie de bus longue distance' },
            { id: 'c', text: 'Un journal' },
            { id: 'd', text: 'Un opérateur internet' },
          ]},
          answer: { id: 'b' },
          points: 10,
        },
      ],
    },
  },

  // ────────────────────────── 38 — Ouarzazate — Hôtel ──────────────────────────
  {
    canonicalOrder: 38,
    slug: 'vocab-hotel',
    title: 'Hôtel & hébergement',
    titleAr: 'الأوطيل و السكن',
    subtitle: 'Réserver, dormir, partir',
    description: 'Riad, hôtel, auberge : vocabulaire du voyageur au Maroc.',
    cityName: 'Ouarzazate',
    cityNameAr: 'ورزازات',
    cityKey: 'ouarzazate',
    emoji: '🏨',
    photoCaption: 'La porte du désert et Hollywood du Maroc',
    colorA: '#d97706',
    colorB: '#92400e',
    shadowColor: '#78350f',
    lesson: {
      slug: 'hotel-lecon-1',
      title: 'À la réception',
      subtitle: 'Réserver une chambre',
      exos: [
        {
          type: ExerciseType.MULTIPLE_CHOICE,
          prompt: '« البيت » dans un hôtel signifie :',
          data: { options: [
            { id: 'a', text: 'La maison' },
            { id: 'b', text: 'La chambre' },
            { id: 'c', text: 'La salle de bain' },
            { id: 'd', text: 'La cuisine' },
          ]},
          answer: { id: 'b' },
          points: 10,
        },
        {
          type: ExerciseType.LISTENING,
          prompt: 'Quelle demande entends-tu ?',
          data: {
            text: 'بغيت بيت ديال جوج',
            lang: 'ar-MA',
            audio: 'بغيت بيت ديال جوج',
            options: [
              { id: 'a', text: 'بغيت بيت ديال واحد', transliteration: 'bghit bit dyal wahed (chambre simple)' },
              { id: 'b', text: 'بغيت بيت ديال جوج', transliteration: 'bghit bit dyal jouj (chambre double)' },
              { id: 'c', text: 'بغيت بيت ديال تلاتة', transliteration: 'bghit bit dyal tlata (chambre triple)' },
              { id: 'd', text: 'بغيت شي طبق', transliteration: 'bghit shi tbaq (je veux un plat)' },
            ],
          },
          answer: { id: 'b' },
          points: 10,
        },
        {
          type: ExerciseType.MULTIPLE_CHOICE,
          prompt: 'Comment dit-on « Y a-t-il le wifi ? » ?',
          data: { options: [
            { id: 'a', text: 'Wach kayn l-wifi?', transliteration: 'واش كاين الويفي؟' },
            { id: 'b', text: 'Fin kayn?' },
            { id: 'c', text: 'Shhal l-wifi?' },
            { id: 'd', text: 'Bghit wifi' },
          ]},
          answer: { id: 'a' },
          points: 15,
        },
        {
          type: ExerciseType.ARABIC_KEYBOARD,
          prompt: 'Écris « clé » en arabe',
          data: {
            target: 'مفتاح',
            targetTransliteration: 'meftah',
            translation: 'clé',
            hint: 'Pour ouvrir la chambre',
            audio: 'مفتاح',
          },
          answer: { text: 'مفتاح' },
          points: 15,
        },
        {
          type: ExerciseType.FILL_BLANK,
          prompt: 'Complète : شحال ___ ف الليلة ؟ (Combien pour la nuit ?)',
          data: { sentence: 'شحال ___ ف الليلة ؟', options: ['الثمن', 'الحال', 'المعاد', 'الوقت'] },
          answer: { text: 'الثمن', translation: 'le prix', transliteration: 't-taman' },
          points: 10,
        },
        {
          type: ExerciseType.MULTIPLE_CHOICE,
          prompt: 'Un « ryad » (رياض) est :',
          data: { options: [
            { id: 'a', text: 'Un grand hôtel moderne' },
            { id: 'b', text: 'Une maison traditionnelle avec patio transformée en hôtel' },
            { id: 'c', text: 'Une auberge de jeunesse' },
            { id: 'd', text: 'Un camping' },
          ]},
          answer: { id: 'b' },
          points: 10,
        },
      ],
    },
  },

  // ────────────────────────── 39 — Aït Benhaddou — Fêtes ──────────────────────────
  {
    canonicalOrder: 39,
    slug: 'vocab-fetes',
    title: 'Fêtes & traditions',
    titleAr: 'الأعياد و التقاليد',
    subtitle: 'Aïd, Ramadan, Achoura',
    description: 'Les grands moments de l\'année au Maroc et leurs traditions.',
    cityName: 'Aït Benhaddou',
    cityNameAr: 'آيت بنحدو',
    cityKey: 'ait-benhaddou',
    emoji: '🎉',
    photoCaption: 'Kasbah UNESCO, décor de mille films',
    colorA: '#c2410c',
    colorB: '#9a3412',
    shadowColor: '#7c2d12',
    lesson: {
      slug: 'fetes-lecon-1',
      title: 'Les grandes fêtes',
      subtitle: 'Vocabulaire des célébrations',
      exos: [
        {
          type: ExerciseType.MULTIPLE_CHOICE,
          prompt: '« العيد » (l-3id) signifie :',
          data: { options: [
            { id: 'a', text: 'La fête religieuse' },
            { id: 'b', text: 'L\'invitation' },
            { id: 'c', text: 'L\'anniversaire' },
            { id: 'd', text: 'Le repas' },
          ]},
          answer: { id: 'a' },
          points: 10,
        },
        {
          type: ExerciseType.LISTENING,
          prompt: 'Quelle fête entends-tu ?',
          data: {
            text: 'رمضان مبارك',
            lang: 'ar-MA',
            audio: 'رمضان مبارك',
            options: [
              { id: 'a', text: 'رمضان مبارك', transliteration: 'Ramadan mubarak (joyeux Ramadan)' },
              { id: 'b', text: 'عيد مبارك', transliteration: '3id mubarak (joyeux Aïd)' },
              { id: 'c', text: 'عاشوراء مبروك', transliteration: '3ashoura mebrouk' },
              { id: 'd', text: 'مبروك العرس', transliteration: 'mebrouk l-3ers (félicitations mariage)' },
            ],
          },
          answer: { id: 'a' },
          points: 10,
        },
        {
          type: ExerciseType.MULTIPLE_CHOICE,
          prompt: 'Pendant le Ramadan, le repas du coucher s\'appelle :',
          data: { options: [
            { id: 'a', text: 'L-ftour', transliteration: 'الفطور' },
            { id: 'b', text: 'L-shour' },
            { id: 'c', text: 'L-gda' },
            { id: 'd', text: 'L-3asha' },
          ]},
          answer: { id: 'a' },
          points: 10,
        },
        {
          type: ExerciseType.ARABIC_KEYBOARD,
          prompt: 'Écris « fête » en arabe',
          data: {
            target: 'عيد',
            targetTransliteration: '3id',
            translation: 'fête',
            hint: 'Célébration religieuse',
            audio: 'عيد',
          },
          answer: { text: 'عيد' },
          points: 15,
        },
        {
          type: ExerciseType.FILL_BLANK,
          prompt: 'Complète : ___ مبارك (Joyeuse fête)',
          data: { sentence: '___ مبارك', options: ['عيد', 'عام', 'يوم', 'ليل'] },
          answer: { text: 'عيد', translation: 'fête', transliteration: '3id' },
          points: 10,
        },
        {
          type: ExerciseType.MULTIPLE_CHOICE,
          prompt: 'Le « Aïd el-Kebir » (العيد الكبير) est :',
          data: { options: [
            { id: 'a', text: 'La fête de fin du Ramadan' },
            { id: 'b', text: 'La fête du sacrifice du mouton' },
            { id: 'c', text: 'Le nouvel an musulman' },
            { id: 'd', text: 'La fête du Trône' },
          ]},
          answer: { id: 'b' },
          points: 15,
        },
      ],
    },
  },

  // ────────────────────────── 40 — Zagora — Désert ──────────────────────────
  {
    canonicalOrder: 40,
    slug: 'vocab-desert',
    title: 'Le désert & le Sahara',
    titleAr: 'الصحراء',
    subtitle: 'Dunes, chameaux, oasis',
    description: 'Le vocabulaire du grand Sud marocain et de ses nomades.',
    cityName: 'Zagora',
    cityNameAr: 'زاگورة',
    cityKey: 'zagora',
    emoji: '🏜️',
    photoCaption: '52 jours à Tombouctou à dos de chameau',
    colorA: '#eab308',
    colorB: '#ca8a04',
    shadowColor: '#a16207',
    lesson: {
      slug: 'desert-lecon-1',
      title: 'Mots du désert',
      subtitle: 'Sahara et nomades',
      exos: [
        {
          type: ExerciseType.MULTIPLE_CHOICE,
          prompt: '« الصحرا » (s-sahra) signifie :',
          data: { options: [
            { id: 'a', text: 'La mer' },
            { id: 'b', text: 'Le désert' },
            { id: 'c', text: 'La montagne' },
            { id: 'd', text: 'La forêt' },
          ]},
          answer: { id: 'b' },
          points: 10,
        },
        {
          type: ExerciseType.LISTENING,
          prompt: 'Quel animal du désert ?',
          data: {
            text: 'الجمل',
            lang: 'ar-MA',
            audio: 'الجمل',
            options: [
              { id: 'a', text: 'الجمل', transliteration: 'j-jmel (le chameau)' },
              { id: 'b', text: 'العود', transliteration: 'l-3oud (le cheval)' },
              { id: 'c', text: 'الحمار', transliteration: 'l-hmar (l\'âne)' },
              { id: 'd', text: 'الكلب', transliteration: 'l-kelb (le chien)' },
            ],
          },
          answer: { id: 'a' },
          points: 10,
        },
        {
          type: ExerciseType.MULTIPLE_CHOICE,
          prompt: 'Une « wahà » (واحة) est :',
          data: { options: [
            { id: 'a', text: 'Une dune' },
            { id: 'b', text: 'Une oasis' },
            { id: 'c', text: 'Une tempête' },
            { id: 'd', text: 'Un puits' },
          ]},
          answer: { id: 'b' },
          points: 10,
        },
        {
          type: ExerciseType.ARABIC_KEYBOARD,
          prompt: 'Écris « sable » en arabe',
          data: {
            target: 'الرمل',
            targetTransliteration: 'r-rmel',
            translation: 'sable',
            hint: 'Couvre le désert',
            audio: 'الرمل',
          },
          answer: { text: 'الرمل' },
          points: 15,
        },
        {
          type: ExerciseType.FILL_BLANK,
          prompt: 'Complète : الشمس ف ___ سخونة بزاف (Le soleil au désert est très chaud)',
          data: { sentence: 'الشمس ف ___ سخونة بزاف', options: ['الصحرا', 'البحر', 'الجبل', 'المدينة'] },
          answer: { text: 'الصحرا', translation: 'le désert', transliteration: 's-sahra' },
          points: 15,
        },
        {
          type: ExerciseType.MULTIPLE_CHOICE,
          prompt: '« الخيمة » (l-khayma) est :',
          data: { options: [
            { id: 'a', text: 'Une maison en pierre' },
            { id: 'b', text: 'Une tente (bédouine)' },
            { id: 'c', text: 'Une voiture' },
            { id: 'd', text: 'Un puits' },
          ]},
          answer: { id: 'b' },
          points: 10,
        },
      ],
    },
  },

  // ────────────────────────── 41 — M'Hamid — Téléphone ──────────────────────────
  {
    canonicalOrder: 41,
    slug: 'vocab-telephone',
    title: 'Téléphone & internet',
    titleAr: 'التيليفون و الأنترنيت',
    subtitle: 'Appeler, envoyer, se connecter',
    description: 'Le vocabulaire moderne pour rester connecté au Maroc.',
    cityName: 'M\'Hamid',
    cityNameAr: 'محاميد',
    cityKey: 'mhamid',
    emoji: '📱',
    photoCaption: 'Dernier village avant les grandes dunes',
    colorA: '#06b6d4',
    colorB: '#0891b2',
    shadowColor: '#0e7490',
    lesson: {
      slug: 'telephone-lecon-1',
      title: 'Appels et messages',
      subtitle: 'Communiquer à distance',
      exos: [
        {
          type: ExerciseType.MULTIPLE_CHOICE,
          prompt: '« التيليفون » signifie :',
          data: { options: [
            { id: 'a', text: 'La télévision' },
            { id: 'b', text: 'Le téléphone' },
            { id: 'c', text: 'L\'ordinateur' },
            { id: 'd', text: 'La radio' },
          ]},
          answer: { id: 'b' },
          points: 10,
        },
        {
          type: ExerciseType.LISTENING,
          prompt: 'Que dit la personne ?',
          data: {
            text: 'عطيني نومرو ديالك',
            lang: 'ar-MA',
            audio: 'عطيني نومرو ديالك',
            options: [
              { id: 'a', text: 'عطيني نومرو ديالك', transliteration: '3tini noumro dyalek (donne-moi ton numéro)' },
              { id: 'b', text: 'سير فحالك', transliteration: 'sir f-halek (va-t-en)' },
              { id: 'c', text: 'بغيت الماء', transliteration: 'bghit l-ma (je veux de l\'eau)' },
              { id: 'd', text: 'شكرا بزاف', transliteration: 'shukran bzzaf (merci beaucoup)' },
            ],
          },
          answer: { id: 'a' },
          points: 10,
        },
        {
          type: ExerciseType.MULTIPLE_CHOICE,
          prompt: 'Comment dit-on « Appelle-moi » ?',
          data: { options: [
            { id: 'a', text: '3iyet 3liya', transliteration: 'عيط عليا' },
            { id: 'b', text: 'Sift liya' },
            { id: 'c', text: 'Ji l-dar' },
            { id: 'd', text: 'Ktab-li' },
          ]},
          answer: { id: 'a' },
          points: 10,
        },
        {
          type: ExerciseType.ARABIC_KEYBOARD,
          prompt: 'Écris « wifi » en arabe',
          data: {
            target: 'الويفي',
            targetTransliteration: 'l-wifi',
            translation: 'le wifi',
            hint: 'Connexion sans fil',
            audio: 'الويفي',
          },
          answer: { text: 'الويفي' },
          points: 15,
        },
        {
          type: ExerciseType.FILL_BLANK,
          prompt: 'Complète : فين ___ ؟ (Où est le réseau ?)',
          data: { sentence: 'فين ___ ؟', options: ['الريزو', 'الدار', 'السوق', 'المدرسة'] },
          answer: { text: 'الريزو', translation: 'le réseau', transliteration: 'r-rizo' },
          points: 15,
        },
        {
          type: ExerciseType.MULTIPLE_CHOICE,
          prompt: '« بطاريا خاوية » signifie :',
          data: { options: [
            { id: 'a', text: 'Batterie pleine' },
            { id: 'b', text: 'Batterie vide' },
            { id: 'c', text: 'Batterie cassée' },
            { id: 'd', text: 'Batterie chaude' },
          ]},
          answer: { id: 'b' },
          points: 10,
        },
      ],
    },
  },

  // ────────────────────────── 42 — Erfoud — Thé & hospitalité ──────────────────────────
  {
    canonicalOrder: 42,
    slug: 'vocab-the',
    title: 'Le thé & l\'hospitalité',
    titleAr: 'أتاي و الضيافة',
    subtitle: 'Rituel du thé à la menthe',
    description: 'Le thé marocain, symbole d\'accueil et de partage.',
    cityName: 'Erfoud',
    cityNameAr: 'أرفود',
    cityKey: 'erfoud',
    emoji: '🍵',
    photoCaption: 'Capitale des dattes et porte du Tafilalet',
    colorA: '#10b981',
    colorB: '#059669',
    shadowColor: '#047857',
    lesson: {
      slug: 'the-lecon-1',
      title: 'Le rituel du thé',
      subtitle: 'Atay et hospitalité',
      exos: [
        {
          type: ExerciseType.MULTIPLE_CHOICE,
          prompt: '« أتاي » (atay) signifie :',
          data: { options: [
            { id: 'a', text: 'Le thé à la menthe' },
            { id: 'b', text: 'Le café' },
            { id: 'c', text: 'L\'eau' },
            { id: 'd', text: 'Le jus' },
          ]},
          answer: { id: 'a' },
          points: 10,
        },
        {
          type: ExerciseType.LISTENING,
          prompt: 'Que propose l\'hôte ?',
          data: {
            text: 'تفضل شرب أتاي',
            lang: 'ar-MA',
            audio: 'تفضل شرب أتاي',
            options: [
              { id: 'a', text: 'تفضل شرب أتاي', transliteration: 'tfeddel chreb atay (bois un thé svp)' },
              { id: 'b', text: 'سير فحالك', transliteration: 'sir f-halek (va-t-en)' },
              { id: 'c', text: 'عندي الجوع', transliteration: '3andi l-jou3 (j\'ai faim)' },
              { id: 'd', text: 'بسلامة', transliteration: 'b-slama (au revoir)' },
            ],
          },
          answer: { id: 'a' },
          points: 10,
        },
        {
          type: ExerciseType.MULTIPLE_CHOICE,
          prompt: '« النعناع » (n-n3na3) est :',
          data: { options: [
            { id: 'a', text: 'Le sucre' },
            { id: 'b', text: 'La menthe' },
            { id: 'c', text: 'Le citron' },
            { id: 'd', text: 'Le safran' },
          ]},
          answer: { id: 'b' },
          points: 10,
        },
        {
          type: ExerciseType.ARABIC_KEYBOARD,
          prompt: 'Écris « le thé » en arabe',
          data: {
            target: 'أتاي',
            targetTransliteration: 'atay',
            translation: 'thé',
            hint: 'Boisson nationale marocaine',
            audio: 'أتاي',
          },
          answer: { text: 'أتاي' },
          points: 15,
        },
        {
          type: ExerciseType.FILL_BLANK,
          prompt: 'Complète : أتاي ب ___ (Thé à la menthe)',
          data: { sentence: 'أتاي ب ___', options: ['النعناع', 'الماء', 'الحليب', 'السكر'] },
          answer: { text: 'النعناع', translation: 'la menthe', transliteration: 'n-n3na3' },
          points: 15,
        },
        {
          type: ExerciseType.MULTIPLE_CHOICE,
          prompt: 'Refuser un thé au Maroc est considéré comme :',
          data: { options: [
            { id: 'a', text: 'Normal, personne ne le remarque' },
            { id: 'b', text: 'Parfois impoli — mieux vaut au moins goûter' },
            { id: 'c', text: 'Interdit par la loi' },
            { id: 'd', text: 'Encouragé' },
          ]},
          answer: { id: 'b' },
          points: 10,
        },
      ],
    },
  },

  // ────────────────────────── 43 — Merzouga — Hammam ──────────────────────────
  {
    canonicalOrder: 43,
    slug: 'vocab-hammam',
    title: 'Le hammam & les soins',
    titleAr: 'الحمام',
    subtitle: 'Rituel de bien-être marocain',
    description: 'Gommage, savon noir, henné : le vocabulaire du hammam.',
    cityName: 'Merzouga',
    cityNameAr: 'مرزوگة',
    cityKey: 'merzouga',
    emoji: '🛁',
    photoCaption: 'Les grandes dunes dorées de l\'Erg Chebbi',
    colorA: '#a855f7',
    colorB: '#9333ea',
    shadowColor: '#7e22ce',
    lesson: {
      slug: 'hammam-lecon-1',
      title: 'Au hammam',
      subtitle: 'Rituel traditionnel',
      exos: [
        {
          type: ExerciseType.MULTIPLE_CHOICE,
          prompt: '« الحمام » signifie :',
          data: { options: [
            { id: 'a', text: 'Le bain traditionnel marocain' },
            { id: 'b', text: 'La piscine' },
            { id: 'c', text: 'La douche' },
            { id: 'd', text: 'La fontaine' },
          ]},
          answer: { id: 'a' },
          points: 10,
        },
        {
          type: ExerciseType.LISTENING,
          prompt: 'Que demande la personne ?',
          data: {
            text: 'بغيت كيس و صابون',
            lang: 'ar-MA',
            audio: 'بغيت كيس و صابون',
            options: [
              { id: 'a', text: 'بغيت كيس و صابون', transliteration: 'bghit kis u sabun (gant et savon)' },
              { id: 'b', text: 'بغيت ماء سخون', transliteration: 'bghit ma skhoun (eau chaude)' },
              { id: 'c', text: 'بغيت نمشي', transliteration: 'bghit nmshi (je veux partir)' },
              { id: 'd', text: 'بغيت الحنا', transliteration: 'bghit l-henna (henné)' },
            ],
          },
          answer: { id: 'a' },
          points: 10,
        },
        {
          type: ExerciseType.MULTIPLE_CHOICE,
          prompt: '« الصابون البلدي » (sabun beldi) est :',
          data: { options: [
            { id: 'a', text: 'Un savon liquide moderne' },
            { id: 'b', text: 'Le savon noir traditionnel à base d\'olive' },
            { id: 'c', text: 'Un parfum' },
            { id: 'd', text: 'Une crème' },
          ]},
          answer: { id: 'b' },
          points: 15,
        },
        {
          type: ExerciseType.ARABIC_KEYBOARD,
          prompt: 'Écris « henné » en arabe',
          data: {
            target: 'الحنا',
            targetTransliteration: 'l-henna',
            translation: 'henné',
            hint: 'Teinture naturelle rouge/brune',
            audio: 'الحنا',
          },
          answer: { text: 'الحنا' },
          points: 15,
        },
        {
          type: ExerciseType.FILL_BLANK,
          prompt: 'Complète : الماء ___ (L\'eau est chaude)',
          data: { sentence: 'الماء ___', options: ['سخون', 'بارد', 'قريب', 'بعيد'] },
          answer: { text: 'سخون', translation: 'chaud', transliteration: 'skhoun' },
          points: 10,
        },
        {
          type: ExerciseType.MULTIPLE_CHOICE,
          prompt: 'Le hammam marocain se visite :',
          data: { options: [
            { id: 'a', text: 'Uniquement entre hommes' },
            { id: 'b', text: 'Hommes et femmes séparément (horaires ou salles différentes)' },
            { id: 'c', text: 'En famille mélangée' },
            { id: 'd', text: 'Toujours en maillot de bain' },
          ]},
          answer: { id: 'b' },
          points: 10,
        },
      ],
    },
  },

  // ────────────────────────── 44 — Rissani — Musique ──────────────────────────
  {
    canonicalOrder: 44,
    slug: 'vocab-musique',
    title: 'La musique marocaine',
    titleAr: 'الموسيقى المغربية',
    subtitle: 'Gnawa, raï, chaabi',
    description: 'Les genres, instruments et ambiances de la musique marocaine.',
    cityName: 'Rissani',
    cityNameAr: 'الريصاني',
    cityKey: 'rissani',
    emoji: '🎵',
    photoCaption: 'Berceau de la dynastie Alaouite',
    colorA: '#8b5cf6',
    colorB: '#7c3aed',
    shadowColor: '#6d28d9',
    lesson: {
      slug: 'musique-lecon-1',
      title: 'Musique et rythmes',
      subtitle: 'Genres traditionnels',
      exos: [
        {
          type: ExerciseType.MULTIPLE_CHOICE,
          prompt: '« الموسيقى » signifie :',
          data: { options: [
            { id: 'a', text: 'La danse' },
            { id: 'b', text: 'La musique' },
            { id: 'c', text: 'Le théâtre' },
            { id: 'd', text: 'Le cinéma' },
          ]},
          answer: { id: 'b' },
          points: 10,
        },
        {
          type: ExerciseType.LISTENING,
          prompt: 'Quel style entends-tu nommer ?',
          data: {
            text: 'گناوة',
            lang: 'ar-MA',
            audio: 'گناوة',
            options: [
              { id: 'a', text: 'گناوة', transliteration: 'Gnawa (musique spirituelle noire)' },
              { id: 'b', text: 'راي', transliteration: 'Raï (populaire algéro-marocain)' },
              { id: 'c', text: 'شعبي', transliteration: 'Chaabi (populaire urbain)' },
              { id: 'd', text: 'ملحون', transliteration: 'Melhoun (poésie chantée)' },
            ],
          },
          answer: { id: 'a' },
          points: 10,
        },
        {
          type: ExerciseType.MULTIPLE_CHOICE,
          prompt: 'La « Gnawa » (گناوة) est :',
          data: { options: [
            { id: 'a', text: 'Une danse urbaine moderne' },
            { id: 'b', text: 'Une musique spirituelle héritée d\'Afrique sub-saharienne' },
            { id: 'c', text: 'Un instrument à corde' },
            { id: 'd', text: 'Un groupe pop contemporain' },
          ]},
          answer: { id: 'b' },
          points: 15,
        },
        {
          type: ExerciseType.ARABIC_KEYBOARD,
          prompt: 'Écris « chanson » en arabe',
          data: {
            target: 'غنية',
            targetTransliteration: 'ghniya',
            translation: 'chanson',
            hint: 'Mélodie chantée',
            audio: 'غنية',
          },
          answer: { text: 'غنية' },
          points: 15,
        },
        {
          type: ExerciseType.FILL_BLANK,
          prompt: 'Complète : كنبغي نسمع ___ (J\'aime écouter la musique)',
          data: { sentence: 'كنبغي نسمع ___', options: ['الموسيقى', 'الكلام', 'الأخبار', 'الدرس'] },
          answer: { text: 'الموسيقى', translation: 'la musique', transliteration: 'l-mousiqa' },
          points: 10,
        },
        {
          type: ExerciseType.MULTIPLE_CHOICE,
          prompt: 'Le festival de Gnawa le plus célèbre a lieu à :',
          data: { options: [
            { id: 'a', text: 'Fès' },
            { id: 'b', text: 'Essaouira' },
            { id: 'c', text: 'Marrakech' },
            { id: 'd', text: 'Rabat' },
          ]},
          answer: { id: 'b' },
          points: 10,
        },
      ],
    },
  },

  // ────────────────────────── 45 — Guelmim — Sport ──────────────────────────
  {
    canonicalOrder: 45,
    slug: 'vocab-sport',
    title: 'Le sport',
    titleAr: 'الرياضة',
    subtitle: 'Football, course, équipes',
    description: 'Le vocabulaire du sport et du football marocain.',
    cityName: 'Guelmim',
    cityNameAr: 'گلميم',
    cityKey: 'guelmim',
    emoji: '⚽',
    photoCaption: 'La porte du désert et le marché aux chameaux',
    colorA: '#16a34a',
    colorB: '#15803d',
    shadowColor: '#166534',
    lesson: {
      slug: 'sport-lecon-1',
      title: 'Parler de sport',
      subtitle: 'Football et équipes',
      exos: [
        {
          type: ExerciseType.MULTIPLE_CHOICE,
          prompt: '« الكرة » (l-koura) signifie :',
          data: { options: [
            { id: 'a', text: 'La course' },
            { id: 'b', text: 'Le ballon / le football' },
            { id: 'c', text: 'La raquette' },
            { id: 'd', text: 'La piscine' },
          ]},
          answer: { id: 'b' },
          points: 10,
        },
        {
          type: ExerciseType.LISTENING,
          prompt: 'Que dit le supporter ?',
          data: {
            text: 'المنتخب ربح',
            lang: 'ar-MA',
            audio: 'المنتخب ربح',
            options: [
              { id: 'a', text: 'المنتخب ربح', transliteration: 'l-montakhab rbeh (l\'équipe a gagné)' },
              { id: 'b', text: 'المنتخب خسر', transliteration: 'l-montakhab khser (l\'équipe a perdu)' },
              { id: 'c', text: 'المباراة بدات', transliteration: 'l-mubara bdat (le match a commencé)' },
              { id: 'd', text: 'المباراة صافية', transliteration: 'l-mubara safya (le match est fini)' },
            ],
          },
          answer: { id: 'a' },
          points: 10,
        },
        {
          type: ExerciseType.MULTIPLE_CHOICE,
          prompt: '« المنتخب » (l-montakhab) signifie :',
          data: { options: [
            { id: 'a', text: 'Le match' },
            { id: 'b', text: 'L\'équipe nationale' },
            { id: 'c', text: 'Le stade' },
            { id: 'd', text: 'L\'entraîneur' },
          ]},
          answer: { id: 'b' },
          points: 10,
        },
        {
          type: ExerciseType.ARABIC_KEYBOARD,
          prompt: 'Écris « but » en arabe (foot)',
          data: {
            target: 'گول',
            targetTransliteration: 'goal',
            translation: 'but',
            hint: 'Quand on marque au foot',
            audio: 'گول',
          },
          answer: { text: 'گول' },
          points: 15,
        },
        {
          type: ExerciseType.FILL_BLANK,
          prompt: 'Complète : كنلعب ___ (Je joue au foot)',
          data: { sentence: 'كنلعب ___', options: ['الكرة', 'الكتاب', 'الشطرنج', 'الورقة'] },
          answer: { text: 'الكرة', translation: 'au ballon', transliteration: 'l-koura' },
          points: 15,
        },
        {
          type: ExerciseType.MULTIPLE_CHOICE,
          prompt: 'Le surnom de l\'équipe nationale marocaine est :',
          data: { options: [
            { id: 'a', text: 'Les Lions (de l\'Atlas)', transliteration: 'أسود الأطلس' },
            { id: 'b', text: 'Les Aigles' },
            { id: 'c', text: 'Les Éléphants' },
            { id: 'd', text: 'Les Pharaons' },
          ]},
          answer: { id: 'a' },
          points: 10,
        },
      ],
    },
  },

  // ────────────────────────── 46 — Tan-Tan — Mer & pêche ──────────────────────────
  {
    canonicalOrder: 46,
    slug: 'vocab-mer-peche',
    title: 'La mer & la pêche',
    titleAr: 'البحر و الصيد',
    subtitle: 'Port, poisson, vagues',
    description: 'La côte atlantique marocaine, ses ports et ses pêcheurs.',
    cityName: 'Tan-Tan',
    cityNameAr: 'طانطان',
    cityKey: 'tan-tan',
    emoji: '🐟',
    photoCaption: 'Porte du Sahara et Moussem classé UNESCO',
    colorA: '#0284c7',
    colorB: '#0369a1',
    shadowColor: '#075985',
    lesson: {
      slug: 'mer-peche-lecon-1',
      title: 'Au port',
      subtitle: 'Pêcheurs et poissons',
      exos: [
        {
          type: ExerciseType.MULTIPLE_CHOICE,
          prompt: '« البحر » (l-bhar) signifie :',
          data: { options: [
            { id: 'a', text: 'Le désert' },
            { id: 'b', text: 'La mer' },
            { id: 'c', text: 'La rivière' },
            { id: 'd', text: 'Le lac' },
          ]},
          answer: { id: 'b' },
          points: 10,
        },
        {
          type: ExerciseType.LISTENING,
          prompt: 'Que vend le pêcheur ?',
          data: {
            text: 'الحوت طري',
            lang: 'ar-MA',
            audio: 'الحوت طري',
            options: [
              { id: 'a', text: 'الحوت طري', transliteration: 'l-hout tri (le poisson est frais)' },
              { id: 'b', text: 'الخضرة رخيصة', transliteration: 'l-khodra rkhisa (les légumes sont bon marché)' },
              { id: 'c', text: 'الخبز سخون', transliteration: 'l-khobz skhoun (le pain est chaud)' },
              { id: 'd', text: 'القهوة مرة', transliteration: 'l-qahwa mrra (le café est amer)' },
            ],
          },
          answer: { id: 'a' },
          points: 10,
        },
        {
          type: ExerciseType.MULTIPLE_CHOICE,
          prompt: '« الصياد » (s-seyyad) est :',
          data: { options: [
            { id: 'a', text: 'Le cuisinier' },
            { id: 'b', text: 'Le pêcheur' },
            { id: 'c', text: 'Le capitaine' },
            { id: 'd', text: 'Le nageur' },
          ]},
          answer: { id: 'b' },
          points: 10,
        },
        {
          type: ExerciseType.ARABIC_KEYBOARD,
          prompt: 'Écris « poisson » en arabe',
          data: {
            target: 'الحوت',
            targetTransliteration: 'l-hout',
            translation: 'poisson',
            hint: 'Vit dans la mer',
            audio: 'الحوت',
          },
          answer: { text: 'الحوت' },
          points: 15,
        },
        {
          type: ExerciseType.FILL_BLANK,
          prompt: 'Complète : المرسى فيه بزاف ___ (Le port a beaucoup de bateaux)',
          data: { sentence: 'المرسى فيه بزاف ___', options: ['الفلايك', 'البيبان', 'الدور', 'الأشجار'] },
          answer: { text: 'الفلايك', translation: 'de bateaux', transliteration: 'flayek' },
          points: 15,
        },
        {
          type: ExerciseType.MULTIPLE_CHOICE,
          prompt: '« الشاطئ » ou « البلاج » signifie :',
          data: { options: [
            { id: 'a', text: 'Le port' },
            { id: 'b', text: 'La plage' },
            { id: 'c', text: 'Le phare' },
            { id: 'd', text: 'La vague' },
          ]},
          answer: { id: 'b' },
          points: 10,
        },
      ],
    },
  },

  // ────────────────────────── 47 — Tarfaya — Souvenirs ──────────────────────────
  {
    canonicalOrder: 47,
    slug: 'vocab-souvenirs',
    title: 'Raconter un souvenir',
    titleAr: 'نحكي ذكرى',
    subtitle: 'Passé, récit, émotions',
    description: 'Parler d\'événements passés et raconter une histoire en darija.',
    cityName: 'Tarfaya',
    cityNameAr: 'طرفاية',
    cityKey: 'tarfaya',
    emoji: '📖',
    photoCaption: 'Étape mythique de Saint-Exupéry et de l\'Aéropostale',
    colorA: '#78716c',
    colorB: '#57534e',
    shadowColor: '#44403c',
    lesson: {
      slug: 'souvenirs-lecon-1',
      title: 'Parler du passé',
      subtitle: 'Récits et souvenirs',
      exos: [
        {
          type: ExerciseType.MULTIPLE_CHOICE,
          prompt: '« البارح » (l-bareh) signifie :',
          data: { options: [
            { id: 'a', text: 'Aujourd\'hui' },
            { id: 'b', text: 'Hier' },
            { id: 'c', text: 'Demain' },
            { id: 'd', text: 'Maintenant' },
          ]},
          answer: { id: 'b' },
          points: 10,
        },
        {
          type: ExerciseType.LISTENING,
          prompt: 'Que raconte la personne ?',
          data: {
            text: 'مشيت للبحر',
            lang: 'ar-MA',
            audio: 'مشيت للبحر',
            options: [
              { id: 'a', text: 'مشيت للبحر', transliteration: 'mchit l-bhar (je suis allé à la mer)' },
              { id: 'b', text: 'غنمشي للبحر', transliteration: 'ghanmchi l-bhar (j\'irai à la mer)' },
              { id: 'c', text: 'كنمشي للبحر', transliteration: 'kanmchi l-bhar (je vais à la mer — habitude)' },
              { id: 'd', text: 'بغيت نمشي للبحر', transliteration: 'bghit nmchi (je veux aller)' },
            ],
          },
          answer: { id: 'a' },
          points: 15,
        },
        {
          type: ExerciseType.MULTIPLE_CHOICE,
          prompt: 'Comment dit-on « Je me souviens » ?',
          data: { options: [
            { id: 'a', text: 'Kanftakar', transliteration: 'كنفتاكر' },
            { id: 'b', text: 'Kan3ref' },
            { id: 'c', text: 'Kanshoufek' },
            { id: 'd', text: 'Kanhder' },
          ]},
          answer: { id: 'a' },
          points: 10,
        },
        {
          type: ExerciseType.ARABIC_KEYBOARD,
          prompt: 'Écris « souvenir » en arabe',
          data: {
            target: 'ذكرى',
            targetTransliteration: 'dikra',
            translation: 'souvenir',
            hint: 'Ce qu\'on se rappelle',
            audio: 'ذكرى',
          },
          answer: { text: 'ذكرى' },
          points: 15,
        },
        {
          type: ExerciseType.FILL_BLANK,
          prompt: 'Complète : ___ كنت صغير (Quand j\'étais petit)',
          data: { sentence: '___ كنت صغير', options: ['ملي', 'باش', 'ولاكن', 'حتى'] },
          answer: { text: 'ملي', translation: 'quand', transliteration: 'mlli' },
          points: 10,
        },
        {
          type: ExerciseType.MULTIPLE_CHOICE,
          prompt: '« نهار من الأيام » introduit :',
          data: { options: [
            { id: 'a', text: 'Une liste de courses' },
            { id: 'b', text: 'Une histoire / un conte (« Il était une fois »)' },
            { id: 'c', text: 'Une question' },
            { id: 'd', text: 'Un ordre' },
          ]},
          answer: { id: 'b' },
          points: 10,
        },
      ],
    },
  },
];

// ── Leçon Salé (fix vocab-nombres vide) ─────────────────────────────────────
const SALE_LESSON = {
  slug: 'vocab-nombres-lecon-1',
  title: 'Compter de 1 à 10',
  subtitle: 'Les nombres de base',
  exos: [
    {
      type: ExerciseType.MULTIPLE_CHOICE,
      prompt: '« واحد » (wahed) signifie :',
      data: { options: [
        { id: 'a', text: 'Un (1)' },
        { id: 'b', text: 'Deux (2)' },
        { id: 'c', text: 'Trois (3)' },
        { id: 'd', text: 'Dix (10)' },
      ]},
      answer: { id: 'a' },
      points: 10,
    },
    {
      type: ExerciseType.LISTENING,
      prompt: 'Quel nombre entends-tu ?',
      data: {
        text: 'خمسة',
        lang: 'ar-MA',
        audio: 'خمسة',
        options: [
          { id: 'a', text: 'تلاتة', transliteration: 'tlata (3)' },
          { id: 'b', text: 'ربعة', transliteration: 'reb3a (4)' },
          { id: 'c', text: 'خمسة', transliteration: 'khamsa (5)' },
          { id: 'd', text: 'ستة', transliteration: 'setta (6)' },
        ],
      },
      answer: { id: 'c' },
      points: 10,
    },
    {
      type: ExerciseType.MULTIPLE_CHOICE,
      prompt: 'Comment dit-on « 10 » en darija ?',
      data: { options: [
        { id: 'a', text: 'sb3a (7)' },
        { id: 'b', text: 'tmnya (8)' },
        { id: 'c', text: 'ts3oud (9)' },
        { id: 'd', text: '3achra', transliteration: 'عشرة (10)' },
      ]},
      answer: { id: 'd' },
      points: 10,
    },
    {
      type: ExerciseType.ARABIC_KEYBOARD,
      prompt: 'Écris « deux » en arabe',
      data: {
        target: 'جوج',
        targetTransliteration: 'jouj',
        translation: 'deux',
        hint: 'Le chiffre 2 en darija',
        audio: 'جوج',
      },
      answer: { text: 'جوج' },
      points: 15,
    },
    {
      type: ExerciseType.FILL_BLANK,
      prompt: 'Complète : عندي ___ د الولاد (J\'ai trois enfants)',
      data: { sentence: 'عندي ___ د الولاد', options: ['تلاتة', 'خمسة', 'واحد', 'عشرة'] },
      answer: { text: 'تلاتة', translation: 'trois', transliteration: 'tlata' },
      points: 15,
    },
    {
      type: ExerciseType.MULTIPLE_CHOICE,
      prompt: 'Lequel signifie « sept » ?',
      data: { options: [
        { id: 'a', text: 'setta (6)' },
        { id: 'b', text: 'sb3a', transliteration: 'سبعة (7)' },
        { id: 'c', text: 'tmnya (8)' },
        { id: 'd', text: '3achra (10)' },
      ]},
      answer: { id: 'b' },
      points: 10,
    },
  ],
};

// ── Main ────────────────────────────────────────────────────────────────────
async function main() {
  console.log('🚀 Extension DARIJA : 15 modules + fix Salé\n');

  const lang = await prisma.language.findUnique({ where: { code: 'ar-MA' } });
  if (!lang) {
    console.error('❌ Langue ar-MA introuvable.');
    process.exit(1);
  }

  // Phase 1 — Créer/upsert les 2 modules orphelins ──────────────────────────
  console.log('📦 Phase 1 — Création des modules orphelins (contenu via autres scripts)…');
  for (const m of ORPHAN_MODULES) {
    await prisma.module.upsert({
      where: { slug: m.slug },
      update: {
        title: m.title,
        titleAr: m.titleAr,
        subtitle: m.subtitle,
        description: m.description,
        track: ModuleTrack.DARIJA,
        canonicalOrder: m.canonicalOrder,
        level: 1,
        cityName: m.cityName,
        cityNameAr: m.cityNameAr,
        emoji: m.emoji,
        photoCaption: m.photoCaption,
        colorA: m.colorA,
        colorB: m.colorB,
        shadowColor: m.shadowColor,
        cityInfo: { cityKey: m.cityKey, emoji: m.emoji, photoCaption: m.photoCaption },
        isPublished: true,
      },
      create: {
        slug: m.slug,
        title: m.title,
        titleAr: m.titleAr,
        subtitle: m.subtitle,
        description: m.description,
        track: ModuleTrack.DARIJA,
        canonicalOrder: m.canonicalOrder,
        level: 1,
        cityName: m.cityName,
        cityNameAr: m.cityNameAr,
        emoji: m.emoji,
        photoCaption: m.photoCaption,
        colorA: m.colorA,
        colorB: m.colorB,
        shadowColor: m.shadowColor,
        cityInfo: { cityKey: m.cityKey, emoji: m.emoji, photoCaption: m.photoCaption },
        isPublished: true,
      },
    });
    console.log(`   ✓ ${m.slug.padEnd(20)} → ${m.cityName} (#${m.canonicalOrder})`);
  }

  // Phase 2 — 13 nouveaux modules ────────────────────────────────────────────
  console.log('\n📦 Phase 2 — Création des 13 nouveaux modules + leçons…');
  let totalExos = 0;
  for (const m of NEW_MODULES) {
    const mod = await prisma.module.upsert({
      where: { slug: m.slug },
      update: {
        title: m.title,
        titleAr: m.titleAr,
        subtitle: m.subtitle,
        description: m.description,
        track: ModuleTrack.DARIJA,
        canonicalOrder: m.canonicalOrder,
        level: 1,
        cityName: m.cityName,
        cityNameAr: m.cityNameAr,
        emoji: m.emoji,
        photoCaption: m.photoCaption,
        colorA: m.colorA,
        colorB: m.colorB,
        shadowColor: m.shadowColor,
        cityInfo: { cityKey: m.cityKey, emoji: m.emoji, photoCaption: m.photoCaption },
        isPublished: true,
      },
      create: {
        slug: m.slug,
        title: m.title,
        titleAr: m.titleAr,
        subtitle: m.subtitle,
        description: m.description,
        track: ModuleTrack.DARIJA,
        canonicalOrder: m.canonicalOrder,
        level: 1,
        cityName: m.cityName,
        cityNameAr: m.cityNameAr,
        emoji: m.emoji,
        photoCaption: m.photoCaption,
        colorA: m.colorA,
        colorB: m.colorB,
        shadowColor: m.shadowColor,
        cityInfo: { cityKey: m.cityKey, emoji: m.emoji, photoCaption: m.photoCaption },
        isPublished: true,
      },
    });

    // Purge leçons précédentes du module (re-run safe)
    const previous = await prisma.lesson.findMany({ where: { moduleId: mod.id }, select: { id: true } });
    for (const l of previous) {
      await prisma.exercise.deleteMany({ where: { lessonId: l.id } });
    }
    await prisma.lesson.deleteMany({ where: { moduleId: mod.id } });

    const lesson = await prisma.lesson.create({
      data: {
        moduleId: mod.id,
        languageId: lang.id,
        slug: m.lesson.slug,
        title: m.lesson.title,
        subtitle: m.lesson.subtitle,
        order: 1,
        isPublished: true,
      },
    });
    for (const exo of m.lesson.exos) {
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
    console.log(`   ✓ [${m.canonicalOrder}] ${m.cityName.padEnd(16)} ${m.slug.padEnd(22)} ${m.lesson.exos.length} exos`);
  }

  // Phase 3 — Fix Salé (vocab-nombres) ────────────────────────────────────────
  console.log('\n📦 Phase 3 — Fix Salé (vocab-nombres vide)…');
  const sale = await prisma.module.findUnique({ where: { slug: 'vocab-nombres' } });
  if (!sale) {
    console.warn('   ⚠️  Module vocab-nombres introuvable, skip');
  } else {
    const prevSale = await prisma.lesson.findMany({ where: { moduleId: sale.id }, select: { id: true } });
    for (const l of prevSale) {
      await prisma.exercise.deleteMany({ where: { lessonId: l.id } });
    }
    await prisma.lesson.deleteMany({ where: { moduleId: sale.id } });

    const lesson = await prisma.lesson.create({
      data: {
        moduleId: sale.id,
        languageId: lang.id,
        slug: SALE_LESSON.slug,
        title: SALE_LESSON.title,
        subtitle: SALE_LESSON.subtitle,
        order: 1,
        isPublished: true,
      },
    });
    for (const exo of SALE_LESSON.exos) {
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
    console.log(`   ✓ Salé (vocab-nombres) : 1 leçon, ${SALE_LESSON.exos.length} exos`);
  }

  console.log(`\n✅ Terminé : ${NEW_MODULES.length + 2} modules créés/mis à jour, ${totalExos} exercices.\n`);
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error('❌ Erreur :', e);
  prisma.$disconnect();
  process.exit(1);
});
