/**
 * seedCurriculum.js
 * Curriculum complet DarijaMaroc — 15 chapitres, ~60 leçons, ~300 exercices
 * Usage : node backend/scripts/seedCurriculum.js
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// ─────────────────────────────────────────────
//  CURRICULUM
// ─────────────────────────────────────────────
const CURRICULUM = [

  // ═══════════════════════════════════════════
  //  NIVEAU 1 — DÉBUTANT
  // ═══════════════════════════════════════════

  {
    slug: 'alphabet-darija',
    title: "L'Alphabet Arabe",
    subtitle: 'Les 28 lettres',
    description: 'Apprends à reconnaître et à lire les lettres arabes utilisées en darija marocain.',
    level: 1,
    colorA: '#2a9d8f', colorB: '#1e7a6d', shadowColor: '#155e54',
    lessons: [
      {
        order: 1,
        title: 'Les premières lettres',
        subtitle: 'ا ب ت ث',
        description: 'Découvre les 4 premières lettres de l\'alphabet arabe.',
        duration: 300,
        exercises: [
          {
            type: 'MULTIPLE_CHOICE',
            prompt: 'Quelle lettre est-ce ? →  ا',
            data: { options: [
              { id: 'a', text: 'Alif (ا)' },
              { id: 'b', text: 'Ba (ب)' },
              { id: 'c', text: 'Ta (ت)' },
              { id: 'd', text: 'Tha (ث)' },
            ]},
            answer: { id: 'a' }, points: 10,
          },
          {
            type: 'MULTIPLE_CHOICE',
            prompt: 'Quelle lettre est-ce ? →  ب',
            data: { options: [
              { id: 'a', text: 'Alif (ا)' },
              { id: 'b', text: 'Ba (ب)' },
              { id: 'c', text: 'Ta (ت)' },
              { id: 'd', text: 'Tha (ث)' },
            ]},
            answer: { id: 'b' }, points: 10,
          },
          {
            type: 'MULTIPLE_CHOICE',
            prompt: 'Comment s\'écrit la lettre "Ta" ?',
            data: { options: [
              { id: 'a', text: 'ا' },
              { id: 'b', text: 'ب' },
              { id: 'c', text: 'ت' },
              { id: 'd', text: 'ث' },
            ]},
            answer: { id: 'c' }, points: 10,
          },
          {
            type: 'MULTIPLE_CHOICE',
            prompt: 'Quelle lettre est-ce ? →  ث',
            data: { options: [
              { id: 'a', text: 'Ta (ت)' },
              { id: 'b', text: 'Ba (ب)' },
              { id: 'c', text: 'Tha (ث)', transliteration: '3 points au-dessus' },
              { id: 'd', text: 'Alif (ا)' },
            ]},
            answer: { id: 'c' }, points: 15,
          },
        ],
      },
      {
        order: 2,
        title: 'Les lettres du milieu',
        subtitle: 'ج ح خ د ذ ر ز',
        description: 'Poursuis avec les lettres suivantes de l\'alphabet.',
        duration: 360,
        exercises: [
          {
            type: 'MULTIPLE_CHOICE',
            prompt: 'Quelle lettre produit le son "kh" comme dans "khobz" (pain) ?',
            data: { options: [
              { id: 'a', text: 'ج (Jeem)' },
              { id: 'b', text: 'ح (Ha)' },
              { id: 'c', text: 'خ (Kha)' },
              { id: 'd', text: 'ذ (Dhal)' },
            ]},
            answer: { id: 'c' }, points: 10,
          },
          {
            type: 'MULTIPLE_CHOICE',
            prompt: 'La lettre ر se prononce comme :',
            data: { options: [
              { id: 'a', text: 'Z (comme zèbre)' },
              { id: 'b', text: 'R roulé' },
              { id: 'c', text: 'D (comme dans)' },
              { id: 'd', text: 'Gh' },
            ]},
            answer: { id: 'b' }, points: 10,
          },
          {
            type: 'MULTIPLE_CHOICE',
            prompt: 'Quel mot commence par la lettre ج ?',
            data: { options: [
              { id: 'a', text: 'زيت (huile)' },
              { id: 'b', text: 'دار (maison)' },
              { id: 'c', text: 'جمل (chameau)' },
              { id: 'd', text: 'حوت (poisson)' },
            ]},
            answer: { id: 'c' }, points: 10,
          },
          {
            type: 'REORDER',
            prompt: 'Remets ces lettres dans l\'ordre alphabétique',
            data: { letters: ['ذ', 'ج', 'ر', 'ح', 'خ', 'د', 'ز'] },
            answer: { order: ['ج', 'ح', 'خ', 'د', 'ذ', 'ر', 'ز'] }, points: 20,
          },
        ],
      },
      {
        order: 3,
        title: 'Le milieu de l\'alphabet',
        subtitle: 'س ش ص ض ط ظ ع غ',
        description: 'Les lettres emphatiques et les sons spécifiques à l\'arabe.',
        duration: 360,
        exercises: [
          {
            type: 'MULTIPLE_CHOICE',
            prompt: 'Quelle est la différence entre س et ش ?',
            data: { options: [
              { id: 'a', text: 'س = "S" simple, ش = "SH" (comme chat)' },
              { id: 'b', text: 'س = "SH", ش = "S" simple' },
              { id: 'c', text: 'Elles sont identiques' },
              { id: 'd', text: 'س = "Z", ش = "S"' },
            ]},
            answer: { id: 'a' }, points: 10,
          },
          {
            type: 'MULTIPLE_CHOICE',
            prompt: 'La lettre ع est un son :',
            data: { options: [
              { id: 'a', text: 'Guttural venant de la gorge (ain)' },
              { id: 'b', text: 'Comme le "E" français' },
              { id: 'c', text: 'Comme le "A" français' },
              { id: 'd', text: 'Comme le "O" français' },
            ]},
            answer: { id: 'a' }, points: 10,
          },
          {
            type: 'MULTIPLE_CHOICE',
            prompt: 'غ se prononce comme :',
            data: { options: [
              { id: 'a', text: 'G dur (comme gare)' },
              { id: 'b', text: 'R grasseyé (comme le R parisien)' },
              { id: 'c', text: 'KH emphatique' },
              { id: 'd', text: 'W (comme oui)' },
            ]},
            answer: { id: 'b' }, points: 10,
          },
        ],
      },
      {
        order: 4,
        title: 'La fin de l\'alphabet',
        subtitle: 'ف ق ك ل م ن ه و ي',
        description: 'Les dernières lettres et les semi-voyelles و et ي.',
        duration: 300,
        exercises: [
          {
            type: 'MULTIPLE_CHOICE',
            prompt: 'و peut être consonne (W) ou voyelle (ou). Dans "وليد", c\'est :',
            data: { options: [
              { id: 'a', text: 'Consonne W' },
              { id: 'b', text: 'Voyelle "ou"' },
              { id: 'c', text: 'Muet' },
              { id: 'd', text: 'Toujours une voyelle' },
            ]},
            answer: { id: 'a' }, points: 10,
          },
          {
            type: 'MULTIPLE_CHOICE',
            prompt: 'Quel mot utilise la lettre ق (Qaf) ?',
            data: { options: [
              { id: 'a', text: 'كلب (chien)' },
              { id: 'b', text: 'قلب (cœur)' },
              { id: 'c', text: 'كبير (grand)' },
              { id: 'd', text: 'نور (lumière)' },
            ]},
            answer: { id: 'b' }, points: 10,
          },
          {
            type: 'REORDER',
            prompt: 'Remets ces lettres dans l\'ordre',
            data: { letters: ['ي', 'ن', 'م', 'ك', 'ق', 'ف', 'و', 'ه', 'ل'] },
            answer: { order: ['ف', 'ق', 'ك', 'ل', 'م', 'ن', 'ه', 'و', 'ي'] }, points: 20,
          },
        ],
      },
      {
        order: 5,
        title: 'Les voyelles et la lecture',
        subtitle: 'Harakat et lecture courante',
        description: 'Les signes de vocalisation et comment lire le darija courant.',
        duration: 420,
        exercises: [
          {
            type: 'MULTIPLE_CHOICE',
            prompt: 'En darija, on écrit souvent sans les voyelles courtes. "كتب" peut se lire :',
            data: { options: [
              { id: 'a', text: 'Uniquement "kataba"' },
              { id: 'b', text: '"kteb" (il a écrit) ou "ktoub" (livres) selon contexte' },
              { id: 'c', text: 'Uniquement "kitab"' },
              { id: 'd', text: 'Le mot n\'existe pas' },
            ]},
            answer: { id: 'b' }, points: 15,
          },
          {
            type: 'MULTIPLE_CHOICE',
            prompt: 'Que signifie سلام ?',
            data: { options: [
              { id: 'a', text: 'Au revoir' },
              { id: 'b', text: 'Bonjour / Salut', transliteration: 'Salam' },
              { id: 'c', text: 'Merci' },
              { id: 'd', text: 'S\'il vous plaît' },
            ]},
            answer: { id: 'b' }, points: 15,
          },
        ],
      },
    ],
  },

  {
    slug: 'salutations-darija',
    title: 'Les Salutations',
    subtitle: 'Premiers mots en darija',
    description: 'Apprends à saluer, te présenter et engager une conversation basique en darija.',
    level: 1,
    colorA: '#e76f51', colorB: '#c05540', shadowColor: '#9a3020',
    lessons: [
      {
        order: 1,
        title: 'Bonjour et au revoir',
        subtitle: 'سلام / بسلامة',
        description: 'Les formules de salutation essentielles.',
        duration: 240,
        exercises: [
          {
            type: 'MULTIPLE_CHOICE',
            prompt: 'Comment dit-on "Bonjour" en darija ?',
            data: { options: [
              { id: 'a', text: 'بسلامة (bslama)' },
              { id: 'b', text: 'سلام (salam)' },
              { id: 'c', text: 'شكرا (choukran)' },
              { id: 'd', text: 'عفاك (afak)' },
            ]},
            answer: { id: 'b' }, points: 10,
          },
          {
            type: 'MULTIPLE_CHOICE',
            prompt: '"صباح الخير" signifie :',
            data: { options: [
              { id: 'a', text: 'Bonne nuit' },
              { id: 'b', text: 'Bonsoir' },
              { id: 'c', text: 'Bonjour (le matin)' },
              { id: 'd', text: 'Au revoir' },
            ]},
            answer: { id: 'c' }, points: 10,
          },
          {
            type: 'MULTIPLE_CHOICE',
            prompt: 'Pour dire "Au revoir", on dit :',
            data: { options: [
              { id: 'a', text: 'سلام (salam)' },
              { id: 'b', text: 'بسلامة (bslama)' },
              { id: 'c', text: 'مرحبا (marhba)' },
              { id: 'd', text: 'آه (ah)' },
            ]},
            answer: { id: 'b' }, points: 10,
          },
          {
            type: 'MULTIPLE_CHOICE',
            prompt: 'Comment dit-on "Bonsoir" en darija ?',
            data: { options: [
              { id: 'a', text: 'Sbah l-khir', transliteration: 'صباح الخير' },
              { id: 'b', text: 'Msa l-khir', transliteration: 'مسا الخير' },
              { id: 'c', text: 'Salam' },
              { id: 'd', text: 'Bslama' },
            ]},
            answer: { id: 'b' }, points: 15,
          },
          {
            type: 'MULTIPLE_CHOICE',
            prompt: '"مرحبا" (marhba) est utilisé pour :',
            data: { options: [
              { id: 'a', text: 'Remercier' },
              { id: 'b', text: 'S\'excuser' },
              { id: 'c', text: 'Souhaiter la bienvenue' },
              { id: 'd', text: 'Demander de l\'aide' },
            ]},
            answer: { id: 'c' }, points: 10,
          },
        ],
      },
      {
        order: 2,
        title: 'Comment ça va ?',
        subtitle: 'كيداير؟ / لاباس؟',
        description: 'Demander et répondre sur l\'état de santé.',
        duration: 300,
        exercises: [
          {
            type: 'MULTIPLE_CHOICE',
            prompt: '"كيداير؟" (kidarc?) signifie :',
            data: { options: [
              { id: 'a', text: 'D\'où viens-tu ?' },
              { id: 'b', text: 'Comment tu t\'appelles ?' },
              { id: 'c', text: 'Comment ça va ? (à un homme)' },
              { id: 'd', text: 'Quel âge as-tu ?' },
            ]},
            answer: { id: 'c' }, points: 10,
          },
          {
            type: 'MULTIPLE_CHOICE',
            prompt: 'Pour demander "Comment ça va ?" à une femme, on dit :',
            data: { options: [
              { id: 'a', text: 'كيداير؟ (kidarc?)' },
              { id: 'b', text: 'كيدايرة؟ (kidaira?)' },
              { id: 'c', text: 'كيدايرو؟ (kidairu?)' },
              { id: 'd', text: 'Les deux formes sont identiques' },
            ]},
            answer: { id: 'b' }, points: 10,
          },
          {
            type: 'MULTIPLE_CHOICE',
            prompt: 'La réponse standard à "لاباس؟" est :',
            data: { options: [
              { id: 'a', text: 'لا، مزيانش (non, pas bien)' },
              { id: 'b', text: 'لاباس، الحمد لله (ça va, merci à Dieu)' },
              { id: 'c', text: 'واش؟ (quoi ?)' },
              { id: 'd', text: 'مشيت (je suis parti)' },
            ]},
            answer: { id: 'b' }, points: 10,
          },
          {
            type: 'MULTIPLE_CHOICE',
            prompt: 'Comment dit-on "Tout va bien, merci à Dieu" en darija ?',
            data: { options: [
              { id: 'a', text: 'Labas, alhamdulillah' },
              { id: 'b', text: 'Koulchi mzian, alhamdulillah', transliteration: 'كلشي مزيان، الحمد لله' },
              { id: 'c', text: 'Mezyan, shukran' },
              { id: 'd', text: 'Wakha, lhamdulillah' },
            ]},
            answer: { id: 'b' }, points: 15,
          },
          {
            type: 'MULTIPLE_CHOICE',
            prompt: '"مزيان بزاف" signifie :',
            data: { options: [
              { id: 'a', text: 'Pas très bien' },
              { id: 'b', text: 'Très bien' },
              { id: 'c', text: 'Comme ci comme ça' },
              { id: 'd', text: 'Assez bien' },
            ]},
            answer: { id: 'b' }, points: 10,
          },
        ],
      },
      {
        order: 3,
        title: 'Merci et politesse',
        subtitle: 'شكرا / عفاك / سمح ليا',
        description: 'Les formules de politesse indispensables.',
        duration: 240,
        exercises: [
          {
            type: 'MULTIPLE_CHOICE',
            prompt: '"شكرا بزاف" signifie :',
            data: { options: [
              { id: 'a', text: 'Merci beaucoup' },
              { id: 'b', text: 'Non merci' },
              { id: 'c', text: 'S\'il vous plaît' },
              { id: 'd', text: 'De rien' },
            ]},
            answer: { id: 'a' }, points: 10,
          },
          {
            type: 'MULTIPLE_CHOICE',
            prompt: 'Pour dire "S\'il vous plaît", on utilise :',
            data: { options: [
              { id: 'a', text: 'شكرا (choukran)' },
              { id: 'b', text: 'عفاك (afak)' },
              { id: 'c', text: 'مرحبا (marhba)' },
              { id: 'd', text: 'بسلامة (bslama)' },
            ]},
            answer: { id: 'b' }, points: 10,
          },
          {
            type: 'MULTIPLE_CHOICE',
            prompt: '"سمح ليا" signifie :',
            data: { options: [
              { id: 'a', text: 'S\'il te plaît' },
              { id: 'b', text: 'Merci' },
              { id: 'c', text: 'Excuse-moi / Pardon' },
              { id: 'd', text: 'Bienvenue' },
            ]},
            answer: { id: 'c' }, points: 10,
          },
          {
            type: 'MULTIPLE_CHOICE',
            prompt: 'Comment dit-on "De rien !" en darija ?',
            data: { options: [
              { id: 'a', text: 'Shukran bzzaf' },
              { id: 'b', text: 'Afak' },
              { id: 'c', text: 'La choukra ala wajib', transliteration: 'لا شكرا على واجب' },
              { id: 'd', text: 'Makaynch mochkil' },
            ]},
            answer: { id: 'c' }, points: 15,
          },
        ],
      },
      {
        order: 4,
        title: 'Formules religieuses',
        subtitle: 'إنشالله / الحمد لله / بسم الله',
        description: 'Les expressions religieuses omniprésentes dans la vie marocaine.',
        duration: 300,
        exercises: [
          {
            type: 'MULTIPLE_CHOICE',
            prompt: '"إنشالله" (inchallah) signifie :',
            data: { options: [
              { id: 'a', text: 'Jamais' },
              { id: 'b', text: 'Si Dieu le veut (exprime l\'espoir ou l\'incertitude)' },
              { id: 'c', text: 'Certainement' },
              { id: 'd', text: 'Merci à Dieu' },
            ]},
            answer: { id: 'b' }, points: 10,
          },
          {
            type: 'MULTIPLE_CHOICE',
            prompt: 'On dit "بسم الله" (bismillah) :',
            data: { options: [
              { id: 'a', text: 'En terminant un repas' },
              { id: 'b', text: 'Avant de commencer quelque chose (repas, voyage...)' },
              { id: 'c', text: 'Pour saluer quelqu\'un' },
              { id: 'd', text: 'Pour remercier' },
            ]},
            answer: { id: 'b' }, points: 10,
          },
          {
            type: 'MULTIPLE_CHOICE',
            prompt: '"ماشي مشكيل" signifie :',
            data: { options: [
              { id: 'a', text: 'C\'est un problème' },
              { id: 'b', text: 'Pas de problème' },
              { id: 'c', text: 'Peut-être' },
              { id: 'd', text: 'Je ne sais pas' },
            ]},
            answer: { id: 'b' }, points: 10,
          },
          {
            type: 'MULTIPLE_CHOICE',
            prompt: '"الله يحفظك" est une formule pour :',
            data: { options: [
              { id: 'a', text: 'Féliciter quelqu\'un' },
              { id: 'b', text: 'Bénir quelqu\'un / Dieu te protège' },
              { id: 'c', text: 'Souhaiter bonne nuit' },
              { id: 'd', text: 'Remercier' },
            ]},
            answer: { id: 'b' }, points: 10,
          },
        ],
      },
    ],
  },

  {
    slug: 'se-presenter',
    title: 'Se Présenter',
    subtitle: 'Parler de soi',
    description: 'Apprends à te présenter : ton prénom, ta nationalité, ton âge et ton métier.',
    level: 1,
    colorA: '#e9a84c', colorB: '#d4842a', shadowColor: '#b06818',
    lessons: [
      {
        order: 1,
        title: 'Mon prénom',
        subtitle: 'شنو سميتك؟',
        description: 'Comment demander et dire son prénom.',
        duration: 240,
        exercises: [
          {
            type: 'MULTIPLE_CHOICE',
            prompt: '"شنو سميتك؟" signifie :',
            data: { options: [
              { id: 'a', text: 'Quel âge as-tu ?' },
              { id: 'b', text: 'Comment tu t\'appelles ?' },
              { id: 'c', text: 'D\'où viens-tu ?' },
              { id: 'd', text: 'Où habites-tu ?' },
            ]},
            answer: { id: 'b' }, points: 10,
          },
          {
            type: 'MULTIPLE_CHOICE',
            prompt: 'Comment dit-on "Je m\'appelle Youssef" en darija ?',
            data: { options: [
              { id: 'a', text: 'Ismi Youssef' },
              { id: 'b', text: 'Ana smiti Youssef', transliteration: 'أنا سميتي يوسف' },
              { id: 'c', text: 'Youssef huwa ana' },
              { id: 'd', text: 'Andi Youssef' },
            ]},
            answer: { id: 'b' }, points: 15,
          },
          {
            type: 'MULTIPLE_CHOICE',
            prompt: 'Pour dire "enchanté(e)", on dit :',
            data: { options: [
              { id: 'a', text: 'مرحبا (marhba)' },
              { id: 'b', text: 'متشرفين (motcharfin)' },
              { id: 'c', text: 'شكرا (choukran)' },
              { id: 'd', text: 'عفاك (afak)' },
            ]},
            answer: { id: 'b' }, points: 10,
          },
        ],
      },
      {
        order: 2,
        title: 'Ma nationalité',
        subtitle: 'منين نتا؟',
        description: 'Dire d\'où l\'on vient et sa nationalité.',
        duration: 300,
        exercises: [
          {
            type: 'MULTIPLE_CHOICE',
            prompt: '"منين نتا؟" signifie :',
            data: { options: [
              { id: 'a', text: 'Qui es-tu ?' },
              { id: 'b', text: 'D\'où es-tu ?' },
              { id: 'c', text: 'Comment vas-tu ?' },
              { id: 'd', text: 'Où vas-tu ?' },
            ]},
            answer: { id: 'b' }, points: 10,
          },
          {
            type: 'MULTIPLE_CHOICE',
            prompt: 'Comment dit-on "Je suis marocain" en darija ?',
            data: { options: [
              { id: 'a', text: 'Ana min Maghrib' },
              { id: 'b', text: 'Ana maghribi', transliteration: 'أنا مغربي' },
              { id: 'c', text: 'Ana morocco' },
              { id: 'd', text: 'Maghribi ana' },
            ]},
            answer: { id: 'b' }, points: 15,
          },
          {
            type: 'MULTIPLE_CHOICE',
            prompt: 'Comment dit-on "France" en darija ?',
            data: { options: [
              { id: 'a', text: 'فرانسا (Fransa)' },
              { id: 'b', text: 'فرنسيس (Frensis)' },
              { id: 'c', text: 'فرنسا (Farnsa)' },
              { id: 'd', text: 'باريس (Paris)' },
            ]},
            answer: { id: 'a' }, points: 10,
          },
          {
            type: 'FILL_BLANK',
            prompt: 'Complète : أنا ___ من المغرب (Je suis du Maroc)',
            data: {
              sentence: 'أنا ___ من المغرب',
              options: ['جاي', 'مشيت', 'كاين', 'راجع'],
            },
            answer: { text: 'جاي', transliteration: 'jay', translation: 'venant' }, points: 15,
          },
        ],
      },
      {
        order: 3,
        title: 'Mon âge',
        subtitle: 'شحال عندك؟',
        description: 'Comment demander et dire son âge.',
        duration: 240,
        exercises: [
          {
            type: 'MULTIPLE_CHOICE',
            prompt: '"شحال عندك من العام؟" signifie :',
            data: { options: [
              { id: 'a', text: 'En quelle année es-tu né ?' },
              { id: 'b', text: 'Quel âge as-tu ?' },
              { id: 'c', text: 'Depuis combien de temps es-tu là ?' },
              { id: 'd', text: 'Quelle heure est-il ?' },
            ]},
            answer: { id: 'b' }, points: 10,
          },
          {
            type: 'MULTIPLE_CHOICE',
            prompt: 'Comment dit-on "J\'ai 25 ans" en darija ?',
            data: { options: [
              { id: 'a', text: 'Ana achrine am' },
              { id: 'b', text: 'Andi khamsin am' },
              { id: 'c', text: 'Andi khamsa w-achrine am', transliteration: 'عندي خمسة وعشرين عام' },
              { id: 'd', text: 'Khamsa w-achrine andi' },
            ]},
            answer: { id: 'c' }, points: 15,
          },
          {
            type: 'MULTIPLE_CHOICE',
            prompt: 'عام (am) signifie :',
            data: { options: [
              { id: 'a', text: 'Mois' },
              { id: 'b', text: 'Semaine' },
              { id: 'c', text: 'An / Année' },
              { id: 'd', text: 'Jour' },
            ]},
            answer: { id: 'c' }, points: 10,
          },
        ],
      },
      {
        order: 4,
        title: 'Mon métier',
        subtitle: 'أشنو كتخدم؟',
        description: 'Parler de son travail et son secteur.',
        duration: 300,
        exercises: [
          {
            type: 'MULTIPLE_CHOICE',
            prompt: '"أشنو كتخدم؟" signifie :',
            data: { options: [
              { id: 'a', text: 'Où travailles-tu ?' },
              { id: 'b', text: 'Qu\'est-ce que tu fais comme travail ?' },
              { id: 'c', text: 'Tu travailles combien d\'heures ?' },
              { id: 'd', text: 'Tu aimes ton travail ?' },
            ]},
            answer: { id: 'b' }, points: 10,
          },
          {
            type: 'MULTIPLE_CHOICE',
            prompt: '"أنا طبيب" signifie :',
            data: { options: [
              { id: 'a', text: 'Je suis professeur' },
              { id: 'b', text: 'Je suis ingénieur' },
              { id: 'c', text: 'Je suis médecin' },
              { id: 'd', text: 'Je suis étudiant' },
            ]},
            answer: { id: 'c' }, points: 10,
          },
          {
            type: 'MULTIPLE_CHOICE',
            prompt: 'Comment dit-on "Je suis étudiant" en darija ?',
            data: { options: [
              { id: 'a', text: 'Ana mudarris' },
              { id: 'b', text: 'Ana talib', transliteration: 'أنا طالب' },
              { id: 'c', text: 'Ana khaddam' },
              { id: 'd', text: 'Ana tabib' },
            ]},
            answer: { id: 'b' }, points: 15,
          },
          {
            type: 'MULTIPLE_CHOICE',
            prompt: '"كنخدم فـ..." signifie :',
            data: { options: [
              { id: 'a', text: 'Je cherche un travail à...' },
              { id: 'b', text: 'Je travaille à / dans...' },
              { id: 'c', text: 'J\'ai arrêté de travailler à...' },
              { id: 'd', text: 'Je veux travailler à...' },
            ]},
            answer: { id: 'b' }, points: 10,
          },
        ],
      },
    ],
  },

  {
    slug: 'les-chiffres',
    title: 'Les Chiffres',
    subtitle: 'Compter en Darija',
    description: 'De 1 à 1000 : les nombres en darija marocain et leurs utilisations pratiques.',
    level: 1,
    colorA: '#c9941a', colorB: '#a07830', shadowColor: '#7a5818',
    lessons: [
      {
        order: 1,
        title: '1 à 10',
        subtitle: 'واحد إلى عشرة',
        description: 'Les dix premiers chiffres en darija.',
        duration: 300,
        exercises: [
          {
            type: 'MULTIPLE_CHOICE',
            prompt: 'Comment dit-on "5" en darija ?',
            data: { options: [
              { id: 'a', text: 'ربعة (rbaa)' },
              { id: 'b', text: 'خمسة (khamsa)' },
              { id: 'c', text: 'ستة (stta)' },
              { id: 'd', text: 'سبعة (sebaa)' },
            ]},
            answer: { id: 'b' }, points: 10,
          },
          {
            type: 'MULTIPLE_CHOICE',
            prompt: '"تلاتة" correspond à :',
            data: { options: [
              { id: 'a', text: '2' },
              { id: 'b', text: '3' },
              { id: 'c', text: '4' },
              { id: 'd', text: '6' },
            ]},
            answer: { id: 'b' }, points: 10,
          },
          {
            type: 'REORDER',
            prompt: 'Mets ces chiffres dans l\'ordre croissant',
            data: { items: [
              { text: 'خمسة', value: 5 },
              { text: 'واحد', value: 1 },
              { text: 'تمنية', value: 8 },
              { text: 'تلاتة', value: 3 },
              { text: 'عشرة', value: 10 },
            ]},
            answer: { order: [1, 3, 5, 8, 10] }, points: 20,
          },
          {
            type: 'MULTIPLE_CHOICE',
            prompt: 'Comment dit-on "7" en darija ?',
            data: { options: [
              { id: 'a', text: 'Sitta' },
              { id: 'b', text: 'Tmanya' },
              { id: 'c', text: 'Sebaa', transliteration: 'سبعة' },
              { id: 'd', text: 'Tisaa' },
            ]},
            answer: { id: 'c' }, points: 10,
          },
        ],
      },
      {
        order: 2,
        title: '11 à 20',
        subtitle: 'حداش إلى عشرين',
        description: 'Les nombres de 11 à 20 ont leurs propres formes en darija.',
        duration: 300,
        exercises: [
          {
            type: 'MULTIPLE_CHOICE',
            prompt: '"حداش" correspond à :',
            data: { options: [
              { id: 'a', text: '10' },
              { id: 'b', text: '11' },
              { id: 'c', text: '12' },
              { id: 'd', text: '21' },
            ]},
            answer: { id: 'b' }, points: 10,
          },
          {
            type: 'MULTIPLE_CHOICE',
            prompt: 'Comment dit-on "15" en darija ?',
            data: { options: [
              { id: 'a', text: 'خمسطاش (khomstaach)' },
              { id: 'b', text: 'خمسة وعشرين' },
              { id: 'c', text: 'عشرة وخمسة' },
              { id: 'd', text: 'ربعطاش' },
            ]},
            answer: { id: 'a' }, points: 10,
          },
          {
            type: 'MULTIPLE_CHOICE',
            prompt: '"عشرين" correspond à :',
            data: { options: [
              { id: 'a', text: '12' },
              { id: 'b', text: '18' },
              { id: 'c', text: '20' },
              { id: 'd', text: '22' },
            ]},
            answer: { id: 'c' }, points: 10,
          },
        ],
      },
      {
        order: 3,
        title: 'Les dizaines',
        subtitle: 'عشرين، تلاتين... مية',
        description: 'Les dizaines et la formation des nombres complexes.',
        duration: 360,
        exercises: [
          {
            type: 'MULTIPLE_CHOICE',
            prompt: '"خمسين" correspond à :',
            data: { options: [
              { id: 'a', text: '15' },
              { id: 'b', text: '40' },
              { id: 'c', text: '50' },
              { id: 'd', text: '55' },
            ]},
            answer: { id: 'c' }, points: 10,
          },
          {
            type: 'MULTIPLE_CHOICE',
            prompt: 'Comment dit-on "37" en darija ?',
            data: { options: [
              { id: 'a', text: 'Sebaa w-arbaine' },
              { id: 'b', text: 'Sebaa w-tlatine', transliteration: 'سبعة وتلاتين' },
              { id: 'c', text: 'Tlatine w-sebaa' },
              { id: 'd', text: 'Sitta w-tlatine' },
            ]},
            answer: { id: 'b' }, points: 15,
          },
          {
            type: 'MULTIPLE_CHOICE',
            prompt: '"مية" correspond à :',
            data: { options: [
              { id: 'a', text: '10' },
              { id: 'b', text: '100' },
              { id: 'c', text: '1000' },
              { id: 'd', text: '90' },
            ]},
            answer: { id: 'b' }, points: 10,
          },
        ],
      },
      {
        order: 4,
        title: 'Les prix au marché',
        subtitle: 'بشحال هدا؟',
        description: 'Utilise les chiffres pour négocier au souk !',
        duration: 420,
        exercises: [
          {
            type: 'MULTIPLE_CHOICE',
            prompt: '"بشحال هدا؟" signifie :',
            data: { options: [
              { id: 'a', text: 'C\'est quoi ça ?' },
              { id: 'b', text: 'Combien ça coûte ?' },
              { id: 'c', text: 'Tu veux ça ?' },
              { id: 'd', text: 'C\'est bon ?' },
            ]},
            answer: { id: 'b' }, points: 10,
          },
          {
            type: 'MULTIPLE_CHOICE',
            prompt: '"غالي بزاف" signifie :',
            data: { options: [
              { id: 'a', text: 'Très bon marché' },
              { id: 'b', text: 'Trop cher' },
              { id: 'c', text: 'Prix correct' },
              { id: 'd', text: 'Gratuit' },
            ]},
            answer: { id: 'b' }, points: 10,
          },
          {
            type: 'MULTIPLE_CHOICE',
            prompt: 'Comment dit-on "C\'est 50 dirhams" en darija ?',
            data: { options: [
              { id: 'a', text: 'Hada khamsine dirham' },
              { id: 'b', text: 'Hada b-khamsine dirham', transliteration: 'هدا بخمسين درهم' },
              { id: 'c', text: 'Khamsine dyal dirham' },
              { id: 'd', text: 'Hada arbaine dirham' },
            ]},
            answer: { id: 'b' }, points: 15,
          },
          {
            type: 'MULTIPLE_CHOICE',
            prompt: '"نقص شوية" signifie :',
            data: { options: [
              { id: 'a', text: 'Ajoute un peu' },
              { id: 'b', text: 'C\'est exact' },
              { id: 'c', text: 'Baisse un peu le prix' },
              { id: 'd', text: 'Non merci' },
            ]},
            answer: { id: 'c' }, points: 10,
          },
        ],
      },
    ],
  },

  {
    slug: 'les-couleurs',
    title: 'Les Couleurs',
    subtitle: 'Arc-en-ciel en Darija',
    description: 'Apprends les couleurs et comment décrire les objets qui t\'entourent.',
    level: 1,
    colorA: '#6a994e', colorB: '#4a7230', shadowColor: '#3a5820',
    lessons: [
      {
        order: 1,
        title: 'Les couleurs principales',
        subtitle: 'حمر، زرق، خضر',
        description: 'Rouge, bleu, vert et les couleurs de base.',
        duration: 300,
        exercises: [
          {
            type: 'MULTIPLE_CHOICE',
            prompt: '"حمر" signifie :',
            data: { options: [
              { id: 'a', text: 'Bleu' },
              { id: 'b', text: 'Rouge' },
              { id: 'c', text: 'Vert' },
              { id: 'd', text: 'Jaune' },
            ]},
            answer: { id: 'b' }, points: 10,
          },
          {
            type: 'MULTIPLE_CHOICE',
            prompt: '"خضر" signifie :',
            data: { options: [
              { id: 'a', text: 'Bleu' },
              { id: 'b', text: 'Rouge' },
              { id: 'c', text: 'Vert' },
              { id: 'd', text: 'Blanc' },
            ]},
            answer: { id: 'c' }, points: 10,
          },
          {
            type: 'MULTIPLE_CHOICE',
            prompt: 'La couleur du drapeau marocain en darija :',
            data: { options: [
              { id: 'a', text: 'زرق و أبيض (bleu et blanc)' },
              { id: 'b', text: 'حمر و خضر (rouge et vert)' },
              { id: 'c', text: 'صفر و حمر (jaune et rouge)' },
              { id: 'd', text: 'كحل و أبيض (noir et blanc)' },
            ]},
            answer: { id: 'b' }, points: 10,
          },
          {
            type: 'MULTIPLE_CHOICE',
            prompt: 'Comment dit-on "Le ciel est bleu" en darija ?',
            data: { options: [
              { id: 'a', text: 'Sma khdar' },
              { id: 'b', text: 'Sma hamra' },
              { id: 'c', text: 'Sma zarqa', transliteration: 'السما زرقة' },
              { id: 'd', text: 'Sma bida' },
            ]},
            answer: { id: 'c' }, points: 15,
          },
        ],
      },
      {
        order: 2,
        title: 'Blanc, noir, jaune',
        subtitle: 'بيض، كحل، صفر',
        description: 'Les autres couleurs essentielles.',
        duration: 240,
        exercises: [
          {
            type: 'MULTIPLE_CHOICE',
            prompt: '"كحل" signifie :',
            data: { options: [
              { id: 'a', text: 'Blanc' },
              { id: 'b', text: 'Gris' },
              { id: 'c', text: 'Noir' },
              { id: 'd', text: 'Marron' },
            ]},
            answer: { id: 'c' }, points: 10,
          },
          {
            type: 'MULTIPLE_CHOICE',
            prompt: 'Comment dit-on "orange" en darija ?',
            data: { options: [
              { id: 'a', text: 'صفر (sfar)' },
              { id: 'b', text: 'ليموني (limuni)' },
              { id: 'c', text: 'برتقالي (bortqali)' },
              { id: 'd', text: 'وردي (wardi)' },
            ]},
            answer: { id: 'c' }, points: 10,
          },
        ],
      },
      {
        order: 3,
        title: 'Décrire les objets',
        subtitle: 'هاد الشي...',
        description: 'Utiliser les couleurs pour décrire ce qui t\'entoure.',
        duration: 300,
        exercises: [
            {
            type: 'MULTIPLE_CHOICE',
            prompt: '"الكتاب الأحمر" signifie :',
            data: { options: [
              { id: 'a', text: 'Le grand livre' },
              { id: 'b', text: 'Le livre rouge' },
              { id: 'c', text: 'Le vieux livre' },
              { id: 'd', text: 'Le beau livre' },
            ]},
            answer: { id: 'b' }, points: 10,
          },
          {
            type: 'MULTIPLE_CHOICE',
            prompt: 'Comment dit-on "Je veux le sac noir" en darija ?',
            data: { options: [
              { id: 'a', text: 'Bghit chkara l-hamra' },
              { id: 'b', text: 'Bghit chkara l-bida' },
              { id: 'c', text: 'Bghit chkara l-kahla', transliteration: 'بغيت الشكارة الكحلة' },
              { id: 'd', text: 'Bghit chkara l-khdar' },
            ]},
            answer: { id: 'c' }, points: 15,
          },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════
  //  NIVEAU 2 — ÉLÉMENTAIRE
  // ═══════════════════════════════════════════

  {
    slug: 'la-famille',
    title: 'La Famille',
    subtitle: 'Liens et relations',
    description: 'Parler de ta famille, les relations proches et élargies en darija.',
    level: 2,
    colorA: '#457b9d', colorB: '#2c5f7e', shadowColor: '#1a4560',
    lessons: [
      {
        order: 1,
        title: 'La famille proche',
        subtitle: 'بابا، ماما، خويا',
        description: 'Père, mère, frère, sœur et les membres directs.',
        duration: 300,
        exercises: [
          {
            type: 'MULTIPLE_CHOICE',
            prompt: '"بابا" signifie :',
            data: { options: [
              { id: 'a', text: 'Mère' },
              { id: 'b', text: 'Père' },
              { id: 'c', text: 'Grand-père' },
              { id: 'd', text: 'Oncle' },
            ]},
            answer: { id: 'b' }, points: 10,
          },
          {
            type: 'MULTIPLE_CHOICE',
            prompt: '"أختي" signifie :',
            data: { options: [
              { id: 'a', text: 'Mon frère' },
              { id: 'b', text: 'Ma cousine' },
              { id: 'c', text: 'Ma sœur' },
              { id: 'd', text: 'Ma mère' },
            ]},
            answer: { id: 'c' }, points: 10,
          },
          {
            type: 'MULTIPLE_CHOICE',
            prompt: 'Comment dit-on "J\'ai deux frères et une sœur" en darija ?',
            data: { options: [
              { id: 'a', text: 'Andi wahd khawa w-juj akhwat' },
              { id: 'b', text: 'Andi juj khawa w-ukht wahda', transliteration: 'عندي جوج خاوة وأخت واحدة' },
              { id: 'c', text: 'Andi tlata khawa' },
              { id: 'd', text: 'Juj khawa w-wahda' },
            ]},
            answer: { id: 'b' }, points: 15,
          },
          {
            type: 'MULTIPLE_CHOICE',
            prompt: '"جدتي" signifie :',
            data: { options: [
              { id: 'a', text: 'Ma grand-mère' },
              { id: 'b', text: 'Ma tante' },
              { id: 'c', text: 'Ma cousine' },
              { id: 'd', text: 'Ma belle-mère' },
            ]},
            answer: { id: 'a' }, points: 10,
          },
        ],
      },
      {
        order: 2,
        title: 'La famille élargie',
        subtitle: 'العم، الخال، العمة',
        description: 'Oncles, tantes, cousins et la belle-famille.',
        duration: 360,
        exercises: [
          {
            type: 'MULTIPLE_CHOICE',
            prompt: '"عمي" (ammi) signifie :',
            data: { options: [
              { id: 'a', text: 'Mon grand-père paternel' },
              { id: 'b', text: 'Mon oncle paternel (frère du père)' },
              { id: 'c', text: 'Mon oncle maternel (frère de la mère)' },
              { id: 'd', text: 'Mon beau-père' },
            ]},
            answer: { id: 'b' }, points: 10,
          },
          {
            type: 'MULTIPLE_CHOICE',
            prompt: '"خالي" (khali) signifie :',
            data: { options: [
              { id: 'a', text: 'Mon oncle paternel' },
              { id: 'b', text: 'Mon oncle maternel (frère de la mère)' },
              { id: 'c', text: 'Mon cousin' },
              { id: 'd', text: 'Mon beau-frère' },
            ]},
            answer: { id: 'b' }, points: 10,
          },
          {
            type: 'MULTIPLE_CHOICE',
            prompt: 'Comment dit-on "Mon cousin s\'appelle Karim" en darija ?',
            data: { options: [
              { id: 'a', text: 'Smit weld ammi Karim' },
              { id: 'b', text: 'Weld ammi smitu Karim', transliteration: 'ولد عمي سميتو كريم' },
              { id: 'c', text: 'Karim weld ammi' },
              { id: 'd', text: 'Ammi smitu Karim' },
            ]},
            answer: { id: 'b' }, points: 15,
          },
        ],
      },
      {
        order: 3,
        title: 'Parler de sa famille',
        subtitle: 'عائلتي كبيرة',
        description: 'Décrire sa famille et en parler à quelqu\'un.',
        duration: 360,
        exercises: [
          {
            type: 'MULTIPLE_CHOICE',
            prompt: '"عائلتي كبيرة" signifie :',
            data: { options: [
              { id: 'a', text: 'Ma famille est petite' },
              { id: 'b', text: 'Ma famille est grande (nombreuse)' },
              { id: 'c', text: 'Ma famille est riche' },
              { id: 'd', text: 'Ma famille est proche' },
            ]},
            answer: { id: 'b' }, points: 10,
          },
          {
            type: 'MULTIPLE_CHOICE',
            prompt: '"واش عندك أولاد؟" signifie :',
            data: { options: [
              { id: 'a', text: 'Tu as des parents ?' },
              { id: 'b', text: 'Tu as des enfants ?' },
              { id: 'c', text: 'Tu es marié(e) ?' },
              { id: 'd', text: 'Tu vis avec ta famille ?' },
            ]},
            answer: { id: 'b' }, points: 10,
          },
          {
            type: 'MULTIPLE_CHOICE',
            prompt: 'Comment dit-on "Je suis marié et j\'ai trois enfants" en darija ?',
            data: { options: [
              { id: 'a', text: 'Ana mtzawwaj w-andi juj dyal l-wlad' },
              { id: 'b', text: 'Ana mtzawwaj w-andi tlata dyal l-wlad', transliteration: 'أنا متزوج وعندي تلاتة ديال الأولاد' },
              { id: 'c', text: 'Andi tlata wlad' },
              { id: 'd', text: 'Ana mzawwaj w-andi arbaa wlad' },
            ]},
            answer: { id: 'b' }, points: 15,
          },
        ],
      },
    ],
  },

  {
    slug: 'la-nourriture',
    title: 'La Nourriture',
    subtitle: 'Manger et boire en darija',
    description: 'Les aliments, les plats marocains typiques et comment commander au café ou restaurant.',
    level: 2,
    colorA: '#e63946', colorB: '#c01c28', shadowColor: '#8a0f18',
    lessons: [
      {
        order: 1,
        title: 'Les fruits et légumes',
        subtitle: 'الفواكه والخضرة',
        description: 'Les fruits et légumes courants au marché marocain.',
        duration: 300,
        exercises: [
          {
            type: 'MULTIPLE_CHOICE',
            prompt: '"التفاح" signifie :',
            data: { options: [
              { id: 'a', text: 'La banane' },
              { id: 'b', text: 'La pomme' },
              { id: 'c', text: 'L\'orange' },
              { id: 'd', text: 'La poire' },
            ]},
            answer: { id: 'b' }, points: 10,
          },
          {
            type: 'MULTIPLE_CHOICE',
            prompt: '"الطماطم" (tomatim) signifie :',
            data: { options: [
              { id: 'a', text: 'Les carottes' },
              { id: 'b', text: 'Les oignons' },
              { id: 'c', text: 'Les tomates' },
              { id: 'd', text: 'Les pommes de terre' },
            ]},
            answer: { id: 'c' }, points: 10,
          },
          {
            type: 'MULTIPLE_CHOICE',
            prompt: 'Comment dit-on "Un kilo de bananes, s\'il vous plaît" en darija ?',
            data: { options: [
              { id: 'a', text: 'Wahed kilo dyal l-tefah, afak' },
              { id: 'b', text: 'Juj kilo dyal l-muz' },
              { id: 'c', text: 'Wahed kilo dyal l-muz, afak', transliteration: 'واحد كيلو ديال الموز، عفاك' },
              { id: 'd', text: 'L-muz, wahed kilo' },
            ]},
            answer: { id: 'c' }, points: 15,
          },
        ],
      },
      {
        order: 2,
        title: 'Les plats marocains',
        subtitle: 'الطاجين، الكسكس...',
        description: 'Les plats traditionnels marocains et comment les commander.',
        duration: 360,
        exercises: [
          {
            type: 'MULTIPLE_CHOICE',
            prompt: '"الطاجين" (tajine) est :',
            data: { options: [
              { id: 'a', text: 'Un dessert marocain' },
              { id: 'b', text: 'Un plat mijoté dans un récipient conique' },
              { id: 'c', text: 'Un type de pain' },
              { id: 'd', text: 'Une boisson' },
            ]},
            answer: { id: 'b' }, points: 10,
          },
          {
            type: 'MULTIPLE_CHOICE',
            prompt: '"الكسكس" (couscous) est traditionnellement mangé :',
            data: { options: [
              { id: 'a', text: 'Le lundi' },
              { id: 'b', text: 'Le vendredi (jour sacré)' },
              { id: 'c', text: 'Le dimanche' },
              { id: 'd', text: 'Chaque jour' },
            ]},
            answer: { id: 'b' }, points: 10,
          },
          {
            type: 'MULTIPLE_CHOICE',
            prompt: '"البسطيلة" (pastilla) est :',
            data: { options: [
              { id: 'a', text: 'Un plat sucré-salé (feuilleté au pigeon/poulet et amandes)' },
              { id: 'b', text: 'Un plat de légumes' },
              { id: 'c', text: 'Un dessert glacé' },
              { id: 'd', text: 'Un type de pain' },
            ]},
            answer: { id: 'a' }, points: 10,
          },
          {
            type: 'MULTIPLE_CHOICE',
            prompt: 'Comment dit-on "Je veux un tajine de poulet" en darija ?',
            data: { options: [
              { id: 'a', text: 'Bghit kuskus dyal djaj' },
              { id: 'b', text: 'Bghit tajine dyal l-hhut' },
              { id: 'c', text: 'Bghit tajine dyal djaj', transliteration: 'بغيت طاجين الدجاج' },
              { id: 'd', text: 'Andi tajine dyal djaj' },
            ]},
            answer: { id: 'c' }, points: 15,
          },
        ],
      },
      {
        order: 3,
        title: 'Au café / restaurant',
        subtitle: 'عندك أتاي؟',
        description: 'Commander et payer au café ou restaurant marocain.',
        duration: 420,
        exercises: [
          {
            type: 'MULTIPLE_CHOICE',
            prompt: '"أتاي" (atay) est :',
            data: { options: [
              { id: 'a', text: 'Le café marocain' },
              { id: 'b', text: 'Le thé à la menthe marocain' },
              { id: 'c', text: 'Le jus d\'orange' },
              { id: 'd', text: 'L\'eau minérale' },
            ]},
            answer: { id: 'b' }, points: 10,
          },
          {
            type: 'MULTIPLE_CHOICE',
            prompt: '"الحساب عفاك" signifie :',
            data: { options: [
              { id: 'a', text: 'Le menu s\'il vous plaît' },
              { id: 'b', text: 'C\'est bon ?' },
              { id: 'c', text: 'L\'addition s\'il vous plaît' },
              { id: 'd', text: 'À quelle heure ouvrez-vous ?' },
            ]},
            answer: { id: 'c' }, points: 10,
          },
          {
            type: 'MULTIPLE_CHOICE',
            prompt: 'Comment dit-on "Un café au lait et un croissant" en darija ?',
            data: { options: [
              { id: 'a', text: 'Qahwa w-kurwasan' },
              { id: 'b', text: 'Qahwa b-lhalibe w-kurwasan', transliteration: 'قهوة بالحليب وكروسان' },
              { id: 'c', text: 'Atay w-kurwasan' },
              { id: 'd', text: 'Qahwa kahla w-khobz' },
            ]},
            answer: { id: 'b' }, points: 15,
          },
          {
            type: 'MULTIPLE_CHOICE',
            prompt: '"واش كلشي مزيان؟" demande le serveur. Cette phrase signifie :',
            data: { options: [
              { id: 'a', text: 'Vous voulez payer ?' },
              { id: 'b', text: 'Tout va bien ? / Vous avez apprécié ?' },
              { id: 'c', text: 'C\'est trop cher ?' },
              { id: 'd', text: 'Vous voulez autre chose ?' },
            ]},
            answer: { id: 'b' }, points: 10,
          },
        ],
      },
      {
        order: 4,
        title: 'Les recettes marocaines',
        subtitle: 'كيف دير الحريرة؟',
        description: 'Vocabulaire pour parler de cuisine et de recettes.',
        duration: 360,
        exercises: [
          {
            type: 'MULTIPLE_CHOICE',
            prompt: '"الحريرة" (harira) est :',
            data: { options: [
              { id: 'a', text: 'Un dessert marocain à la semoule' },
              { id: 'b', text: 'Une soupe marocaine (tomate, lentilles, pois chiches)' },
              { id: 'c', text: 'Un plat de riz' },
              { id: 'd', text: 'Un type de pain plat' },
            ]},
            answer: { id: 'b' }, points: 10,
          },
          {
            type: 'MULTIPLE_CHOICE',
            prompt: '"المسمن" (msemmen) est :',
            data: { options: [
              { id: 'a', text: 'Un pain feuilleté carré marocain' },
              { id: 'b', text: 'Un tagine de viande' },
              { id: 'c', text: 'Une pâtisserie au miel' },
              { id: 'd', text: 'Un plat de lentilles' },
            ]},
            answer: { id: 'a' }, points: 10,
          },
        ],
      },
    ],
  },

  {
    slug: 'les-directions',
    title: 'Les Directions',
    subtitle: 'Se repérer en ville',
    description: 'Demander et donner des directions en darija. Utile au souk ou dans la médina !',
    level: 2,
    colorA: '#7b2d8b', colorB: '#5a1e68', shadowColor: '#3a1045',
    lessons: [
      {
        order: 1,
        title: 'Gauche, droite, tout droit',
        subtitle: 'ليسار، ليمين، نيشان',
        description: 'Les directions de base pour te repérer.',
        duration: 300,
        exercises: [
          {
            type: 'MULTIPLE_CHOICE',
            prompt: '"على ليمين" signifie :',
            data: { options: [
              { id: 'a', text: 'À gauche' },
              { id: 'b', text: 'Tout droit' },
              { id: 'c', text: 'À droite' },
              { id: 'd', text: 'En arrière' },
            ]},
            answer: { id: 'c' }, points: 10,
          },
          {
            type: 'MULTIPLE_CHOICE',
            prompt: '"نيشان" ou "على طول" signifie :',
            data: { options: [
              { id: 'a', text: 'Tourne à gauche' },
              { id: 'b', text: 'Tout droit' },
              { id: 'c', text: 'Recule' },
              { id: 'd', text: 'Traverse' },
            ]},
            answer: { id: 'b' }, points: 10,
          },
          {
            type: 'MULTIPLE_CHOICE',
            prompt: 'Comment dit-on "Tourne à gauche au feu rouge" en darija ?',
            data: { options: [
              { id: 'a', text: 'Dur ala limin and dw l-ahmar' },
              { id: 'b', text: 'Dur ala lisar and dw l-ahmar', transliteration: 'دور على ليسار عند الضو الحمر' },
              { id: 'c', text: 'Sir nishan and dw l-ahmar' },
              { id: 'd', text: 'Dur ala lisar and dw l-akhdar' },
            ]},
            answer: { id: 'b' }, points: 15,
          },
        ],
      },
      {
        order: 2,
        title: 'Où est... ?',
        subtitle: 'فين كاين...؟',
        description: 'Demander où se trouve un lieu.',
        duration: 360,
        exercises: [
          {
            type: 'MULTIPLE_CHOICE',
            prompt: '"فين كاين الفندق؟" signifie :',
            data: { options: [
              { id: 'a', text: 'Le restaurant est bon ?' },
              { id: 'b', text: 'Où est l\'hôtel ?' },
              { id: 'c', text: 'Combien coûte l\'hôtel ?' },
              { id: 'd', text: 'L\'hôtel est loin ?' },
            ]},
            answer: { id: 'b' }, points: 10,
          },
          {
            type: 'MULTIPLE_CHOICE',
            prompt: '"قريب من هنا" signifie :',
            data: { options: [
              { id: 'a', text: 'Loin d\'ici' },
              { id: 'b', text: 'Proche d\'ici' },
              { id: 'c', text: 'Par ici' },
              { id: 'd', text: 'Là-bas' },
            ]},
            answer: { id: 'b' }, points: 10,
          },
          {
            type: 'MULTIPLE_CHOICE',
            prompt: 'Comment dit-on "Pardon, où est la mosquée Hassan II ?" en darija ?',
            data: { options: [
              { id: 'a', text: 'Afak, fin kayna jamia l-Hassan?' },
              { id: 'b', text: 'Smah liya, fin kayn masjid l-Hassan thani?', transliteration: 'سمح ليا، فين كاين مسجد الحسن الثاني؟' },
              { id: 'c', text: 'Fin l-masjid?' },
              { id: 'd', text: 'Smah liya, masjid fin?' },
            ]},
            answer: { id: 'b' }, points: 15,
          },
        ],
      },
      {
        order: 3,
        title: 'Les lieux de la ville',
        subtitle: 'المدينة القديمة',
        description: 'Les noms des lieux importants : souk, médina, derb...',
        duration: 300,
        exercises: [
          {
            type: 'MULTIPLE_CHOICE',
            prompt: '"المدينة القديمة" (medina l-qdima) désigne :',
            data: { options: [
              { id: 'a', text: 'La nouvelle ville' },
              { id: 'b', text: 'La vieille ville / la médina historique' },
              { id: 'c', text: 'Le quartier des affaires' },
              { id: 'd', text: 'La banlieue' },
            ]},
            answer: { id: 'b' }, points: 10,
          },
          {
            type: 'MULTIPLE_CHOICE',
            prompt: '"الدرب" (derb) signifie :',
            data: { options: [
              { id: 'a', text: 'La place principale' },
              { id: 'b', text: 'La ruelle / l\'impasse dans la médina' },
              { id: 'c', text: 'Le marché couvert' },
              { id: 'd', text: 'L\'avenue principale' },
            ]},
            answer: { id: 'b' }, points: 10,
          },
        ],
      },
      {
        order: 4,
        title: 'Prendre un taxi',
        subtitle: 'فين غادي؟',
        description: 'Négocier avec le chauffeur de taxi et indiquer sa destination.',
        duration: 420,
        exercises: [
          {
            type: 'MULTIPLE_CHOICE',
            prompt: '"فين غادي؟" (fin ghadi?) demande le taxi. Cela signifie :',
            data: { options: [
              { id: 'a', text: 'Combien ça coûte ?' },
              { id: 'b', text: 'Où tu vas ?' },
              { id: 'c', text: 'À quelle heure tu arrives ?' },
              { id: 'd', text: 'Tu viens d\'où ?' },
            ]},
            answer: { id: 'b' }, points: 10,
          },
          {
            type: 'MULTIPLE_CHOICE',
            prompt: 'Comment dit-on "À la gare ferroviaire, s\'il vous plaît" en darija ?',
            data: { options: [
              { id: 'a', text: 'L-matar, afak' },
              { id: 'b', text: 'L-mahatta dyal l-qtar, afak', transliteration: 'لـ محطة القطر، عفاك' },
              { id: 'c', text: 'L-mahatta dyal taksiye' },
              { id: 'd', text: 'L-qtar, afak' },
            ]},
            answer: { id: 'b' }, points: 15,
          },
          {
            type: 'MULTIPLE_CHOICE',
            prompt: '"شحال الكراء؟" (chhal l-kraa?) signifie :',
            data: { options: [
              { id: 'a', text: 'C\'est loin ?' },
              { id: 'b', text: 'Combien coûte la course ?' },
              { id: 'c', text: 'Il y a de l\'embouteillage ?' },
              { id: 'd', text: 'Tu connais le chemin ?' },
            ]},
            answer: { id: 'b' }, points: 10,
          },
        ],
      },
    ],
  },

  {
    slug: 'le-temps-les-jours',
    title: 'Le Temps et les Jours',
    subtitle: 'Heures, jours et mois',
    description: 'Dis l\'heure, les jours de la semaine et les mois de l\'année en darija.',
    level: 2,
    colorA: '#264653', colorB: '#1a3040', shadowColor: '#0d1e28',
    lessons: [
      {
        order: 1,
        title: 'Les jours de la semaine',
        subtitle: 'الاثنين، التلاتة...',
        description: 'Les 7 jours de la semaine en darija.',
        duration: 300,
        exercises: [
          {
            type: 'MULTIPLE_CHOICE',
            prompt: 'Le premier jour de la semaine en arabe/darija est :',
            data: { options: [
              { id: 'a', text: 'الاثنين (lundi)' },
              { id: 'b', text: 'الأحد (dimanche)' },
              { id: 'c', text: 'السبت (samedi)' },
              { id: 'd', text: 'الجمعة (vendredi)' },
            ]},
            answer: { id: 'b' }, points: 10,
          },
          {
            type: 'MULTIPLE_CHOICE',
            prompt: '"الجمعة" (jemaa) est le jour :',
            data: { options: [
              { id: 'a', text: 'Du marché hebdomadaire seulement' },
              { id: 'b', text: 'Sacré de la prière du vendredi' },
              { id: 'c', text: 'De repos officiel' },
              { id: 'd', text: 'Des fêtes nationales' },
            ]},
            answer: { id: 'b' }, points: 10,
          },
          {
            type: 'REORDER',
            prompt: 'Mets les jours dans l\'ordre (du dimanche au samedi)',
            data: { items: ['الجمعة', 'الثلاثاء', 'الأربعاء', 'الأحد', 'الخميس', 'الاثنين', 'السبت'] },
            answer: { order: ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'] }, points: 20,
          },
        ],
      },
      {
        order: 2,
        title: 'Quelle heure est-il ?',
        subtitle: 'شحال من الساعة؟',
        description: 'Dire et demander l\'heure.',
        duration: 360,
        exercises: [
          {
            type: 'MULTIPLE_CHOICE',
            prompt: '"شحال من الساعة؟" signifie :',
            data: { options: [
              { id: 'a', text: 'Depuis combien d\'heures ?' },
              { id: 'b', text: 'Quelle heure est-il ?' },
              { id: 'c', text: 'À quelle heure on part ?' },
              { id: 'd', text: 'Tu as une montre ?' },
            ]},
            answer: { id: 'b' }, points: 10,
          },
          {
            type: 'MULTIPLE_CHOICE',
            prompt: 'Comment dit-on "Il est trois heures et demie" en darija ?',
            data: { options: [
              { id: 'a', text: 'Ssaa tlata' },
              { id: 'b', text: 'Ssaa tlata w-noss', transliteration: 'الساعة تلاتة ونص' },
              { id: 'c', text: 'Ssaa arbaa w-noss' },
              { id: 'd', text: 'Noss ssaa tlata' },
            ]},
            answer: { id: 'b' }, points: 15,
          },
          {
            type: 'MULTIPLE_CHOICE',
            prompt: '"الساعة خمسة وربع" signifie :',
            data: { options: [
              { id: 'a', text: '5h15' },
              { id: 'b', text: '5h30' },
              { id: 'c', text: '5h45' },
              { id: 'd', text: '4h45' },
            ]},
            answer: { id: 'a' }, points: 10,
          },
        ],
      },
      {
        order: 3,
        title: 'Les mois de l\'année',
        subtitle: 'يناير، فبراير...',
        description: 'Les mois en darija (version francisée et arabe).',
        duration: 300,
        exercises: [
          {
            type: 'MULTIPLE_CHOICE',
            prompt: 'En darija marocain, on utilise souvent les noms de mois :',
            data: { options: [
              { id: 'a', text: 'Uniquement en arabe classique' },
              { id: 'b', text: 'La version francisée (yanayir, febrayer...) ET les noms berbères' },
              { id: 'c', text: 'Uniquement en français' },
              { id: 'd', text: 'Uniquement en berbère' },
            ]},
            answer: { id: 'b' }, points: 10,
          },
          {
            type: 'MULTIPLE_CHOICE',
            prompt: '"رمضان" est :',
            data: { options: [
              { id: 'a', text: 'Un mois du calendrier solaire' },
              { id: 'b', text: 'Le mois du jeûne dans le calendrier hégirien (lunaire)' },
              { id: 'c', text: 'Le premier mois de l\'année' },
              { id: 'd', text: 'Un jour férié' },
            ]},
            answer: { id: 'b' }, points: 10,
          },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════
  //  NIVEAU 3 — INTERMÉDIAIRE
  // ═══════════════════════════════════════════

  {
    slug: 'les-achats',
    title: 'Les Achats',
    subtitle: 'Au souk et en boutique',
    description: 'Faire du shopping, négocier les prix et parler de vêtements en darija.',
    level: 3,
    colorA: '#f4845f', colorB: '#d4643f', shadowColor: '#a44020',
    lessons: [
      {
        order: 1,
        title: 'Les vêtements',
        subtitle: 'الكسوة والملابس',
        description: 'Les vêtements courants et les achats de mode.',
        duration: 300,
        exercises: [
          {
            type: 'MULTIPLE_CHOICE',
            prompt: '"الجلابة" (djellaba) est :',
            data: { options: [
              { id: 'a', text: 'Un pantalon traditionnel' },
              { id: 'b', text: 'Une robe-manteau traditionnelle à capuche' },
              { id: 'c', text: 'Un type de chaussures' },
              { id: 'd', text: 'Un foulard traditionnel' },
            ]},
            answer: { id: 'b' }, points: 10,
          },
          {
            type: 'MULTIPLE_CHOICE',
            prompt: '"البلغة" (belgha) désigne :',
            data: { options: [
              { id: 'a', text: 'Un chapeau traditionnel' },
              { id: 'b', text: 'Des babouches (pantoufles marocaines)' },
              { id: 'c', text: 'Une ceinture brodée' },
              { id: 'd', text: 'Un sac en cuir' },
            ]},
            answer: { id: 'b' }, points: 10,
          },
          {
            type: 'MULTIPLE_CHOICE',
            prompt: 'Comment dit-on "Je cherche une djellaba en taille M" en darija ?',
            data: { options: [
              { id: 'a', text: 'Bghit djellaba nummra M' },
              { id: 'b', text: 'Knqalb ela djellaba nummra M', transliteration: 'كنقلب على جلابة نمرة M' },
              { id: 'c', text: 'Fin djellaba nummra M?' },
              { id: 'd', text: 'Andi djellaba nummra M' },
            ]},
            answer: { id: 'b' }, points: 15,
          },
        ],
      },
      {
        order: 2,
        title: 'Négocier au souk',
        subtitle: 'هاد الثمن غالي',
        description: 'L\'art de la négociation marocaine.',
        duration: 420,
        exercises: [
          {
            type: 'MULTIPLE_CHOICE',
            prompt: '"هاد الثمن غالي بزاف" signifie :',
            data: { options: [
              { id: 'a', text: 'Ce prix est très bon marché' },
              { id: 'b', text: 'Ce prix est trop cher' },
              { id: 'c', text: 'Quel est le prix ?' },
              { id: 'd', text: 'Je prends ça' },
            ]},
            answer: { id: 'b' }, points: 10,
          },
          {
            type: 'MULTIPLE_CHOICE',
            prompt: '"أعطيني بـ مية درهم" signifie :',
            data: { options: [
              { id: 'a', text: 'Montre-moi pour 100 dirhams' },
              { id: 'b', text: 'Donne-moi ça pour 100 dirhams' },
              { id: 'c', text: 'J\'ai 100 dirhams seulement' },
              { id: 'd', text: 'Le prix c\'est 100 dirhams ?' },
            ]},
            answer: { id: 'b' }, points: 10,
          },
          {
            type: 'MULTIPLE_CHOICE',
            prompt: '"آخر ثمن؟" (akher thaman?) signifie :',
            data: { options: [
              { id: 'a', text: 'C\'est quel prix ?' },
              { id: 'b', text: 'C\'est ton dernier prix ?' },
              { id: 'c', text: 'Tu baisses le prix ?' },
              { id: 'd', text: 'Le prix d\'avant ?' },
            ]},
            answer: { id: 'b' }, points: 10,
          },
          {
            type: 'MULTIPLE_CHOICE',
            prompt: 'Comment dit-on "Je t\'en donne 80, c\'est mon dernier prix" en darija ?',
            data: { options: [
              { id: 'a', text: 'Natik b-sebaine, hada akher thaman' },
              { id: 'b', text: 'Natik b-tmanin, hada akher thaman andi', transliteration: 'نعطيك بتمانين، هدا آخر ثمن عندي' },
              { id: 'c', text: 'Tmanin, wakha?' },
              { id: 'd', text: 'Hada akher thaman, tmanin' },
            ]},
            answer: { id: 'b' }, points: 15,
          },
        ],
      },
    ],
  },

  {
    slug: 'les-transports',
    title: 'Les Transports',
    subtitle: 'Voyager au Maroc',
    description: 'Train, bus, grand taxi : comment voyager partout au Maroc en darija.',
    level: 3,
    colorA: '#4a6fa5', colorB: '#2a4f85', shadowColor: '#1a3060',
    lessons: [
      {
        order: 1,
        title: 'Les moyens de transport',
        subtitle: 'القطر، الطوبيس...',
        description: 'Les transports en commun et privés au Maroc.',
        duration: 300,
        exercises: [
          {
            type: 'MULTIPLE_CHOICE',
            prompt: '"الطوبيس" (toubis) est :',
            data: { options: [
              { id: 'a', text: 'Le taxi' },
              { id: 'b', text: 'Le bus' },
              { id: 'c', text: 'Le train' },
              { id: 'd', text: 'Le tramway' },
            ]},
            answer: { id: 'b' }, points: 10,
          },
          {
            type: 'MULTIPLE_CHOICE',
            prompt: '"الطاكسي الكبير" (grand taxi) est différent du "بيتي طاكسي" car :',
            data: { options: [
              { id: 'a', text: 'Il est plus cher' },
              { id: 'b', text: 'Il fait des trajets interurbains avec des passagers partagés' },
              { id: 'c', text: 'Il est réservé aux touristes' },
              { id: 'd', text: 'Il a la clim obligatoire' },
            ]},
            answer: { id: 'b' }, points: 10,
          },
          {
            type: 'MULTIPLE_CHOICE',
            prompt: 'Comment dit-on "À quelle heure part le prochain train pour Marrakech ?" en darija ?',
            data: { options: [
              { id: 'a', text: 'Fuqach kimchi l-taksiye l-Marrakech?' },
              { id: 'b', text: 'Fuqach kimchi l-qtar l-jay l-Marrakech?', transliteration: 'فوقاش كيمشي القطر الجاي لمراكش؟' },
              { id: 'c', text: 'L-qtar l-Marrakech fuqach kimchi?' },
              { id: 'd', text: 'Ssaa kam kimchi l-qtar?' },
            ]},
            answer: { id: 'b' }, points: 20,
          },
        ],
      },
      {
        order: 2,
        title: 'À la gare routière',
        subtitle: 'بغيت تيكي لـ...',
        description: 'Acheter un billet et organiser un trajet.',
        duration: 360,
        exercises: [
          {
            type: 'MULTIPLE_CHOICE',
            prompt: '"بغيت تيكي واحد لـ أكادير" signifie :',
            data: { options: [
              { id: 'a', text: 'Le prochain bus pour Agadir est à quelle heure ?' },
              { id: 'b', text: 'Je veux un billet pour Agadir' },
              { id: 'c', text: 'Il y a des places pour Agadir ?' },
              { id: 'd', text: 'Agadir c\'est loin ?' },
            ]},
            answer: { id: 'b' }, points: 10,
          },
          {
            type: 'MULTIPLE_CHOICE',
            prompt: '"ذهاب وإياب" signifie :',
            data: { options: [
              { id: 'a', text: 'Aller simple' },
              { id: 'b', text: 'Aller-retour' },
              { id: 'c', text: 'Première classe' },
              { id: 'd', text: 'Place réservée' },
            ]},
            answer: { id: 'b' }, points: 10,
          },
        ],
      },
    ],
  },

  {
    slug: 'le-logement',
    title: 'Le Logement',
    subtitle: 'La maison en darija',
    description: 'Les pièces de la maison, les meubles et comment chercher un logement au Maroc.',
    level: 3,
    colorA: '#8b5e3c', colorB: '#6b3e1c', shadowColor: '#4a2010',
    lessons: [
      {
        order: 1,
        title: 'Les pièces de la maison',
        subtitle: 'البيت والغرف',
        description: 'Salon, chambre, cuisine : les pièces en darija.',
        duration: 300,
        exercises: [
          {
            type: 'MULTIPLE_CHOICE',
            prompt: '"البيت المغربي" (dar maghribiya) est traditionellement organisé autour :',
            data: { options: [
              { id: 'a', text: 'D\'un salon occidental' },
              { id: 'b', text: 'D\'un patio central (الوسطدار / wost-dar)' },
              { id: 'c', text: 'D\'un jardin extérieur' },
              { id: 'd', text: 'D\'une terrasse sur le toit seulement' },
            ]},
            answer: { id: 'b' }, points: 10,
          },
          {
            type: 'MULTIPLE_CHOICE',
            prompt: '"القطيبة" (qtiiba) désigne :',
            data: { options: [
              { id: 'a', text: 'La cuisine' },
              { id: 'b', text: 'Le salon marocain traditionnel' },
              { id: 'c', text: 'La salle de bain' },
              { id: 'd', text: 'La chambre d\'enfants' },
            ]},
            answer: { id: 'b' }, points: 10,
          },
          {
            type: 'MULTIPLE_CHOICE',
            prompt: 'Comment dit-on "La cuisine est à droite" en darija ?',
            data: { options: [
              { id: 'a', text: 'Kwizina ala lisar' },
              { id: 'b', text: 'Kwizina ala limine', transliteration: 'الكوزينة على ليمين' },
              { id: 'c', text: 'Kwizina fug' },
              { id: 'd', text: 'Ala limine l-bit' },
            ]},
            answer: { id: 'b' }, points: 15,
          },
        ],
      },
      {
        order: 2,
        title: 'Chercher un appartement',
        subtitle: 'كنقلب على شقة',
        description: 'Vocabulaire pour louer ou acheter un logement.',
        duration: 360,
        exercises: [
          {
            type: 'MULTIPLE_CHOICE',
            prompt: '"شقة فالكراء" signifie :',
            data: { options: [
              { id: 'a', text: 'Appartement à vendre' },
              { id: 'b', text: 'Appartement à louer' },
              { id: 'c', text: 'Appartement de luxe' },
              { id: 'd', text: 'Appartement meublé' },
            ]},
            answer: { id: 'b' }, points: 10,
          },
          {
            type: 'MULTIPLE_CHOICE',
            prompt: 'Comment dit-on "Combien coûte le loyer par mois ?" en darija ?',
            data: { options: [
              { id: 'a', text: 'Chhal hiya l-kraa?' },
              { id: 'b', text: 'Chhal kiyekun l-kraa f-chhar?', transliteration: 'شحال كيكون الكراء فالشهر؟' },
              { id: 'c', text: 'L-kraa chhal f-chhar?' },
              { id: 'd', text: 'Chhal l-kraa?' },
            ]},
            answer: { id: 'b' }, points: 15,
          },
        ],
      },
    ],
  },

  {
    slug: 'le-corps-la-sante',
    title: 'Le Corps et la Santé',
    subtitle: 'Chez le médecin',
    description: 'Parler de son corps, exprimer une douleur et consulter un médecin en darija.',
    level: 3,
    colorA: '#e07a8e', colorB: '#c05a6e', shadowColor: '#9a3a4e',
    lessons: [
      {
        order: 1,
        title: 'Les parties du corps',
        subtitle: 'الراس، اليد، الرجل',
        description: 'Tête, bras, jambes : le corps humain en darija.',
        duration: 300,
        exercises: [
          {
            type: 'MULTIPLE_CHOICE',
            prompt: '"الراس" (ras) signifie :',
            data: { options: [
              { id: 'a', text: 'Le bras' },
              { id: 'b', text: 'La tête' },
              { id: 'c', text: 'Le cœur' },
              { id: 'd', text: 'L\'estomac' },
            ]},
            answer: { id: 'b' }, points: 10,
          },
          {
            type: 'MULTIPLE_CHOICE',
            prompt: '"كرشي كيدير بيا" signifie :',
            data: { options: [
              { id: 'a', text: 'J\'ai mal à la tête' },
              { id: 'b', text: 'J\'ai mal au ventre' },
              { id: 'c', text: 'J\'ai mal au dos' },
              { id: 'd', text: 'J\'ai mal à la gorge' },
            ]},
            answer: { id: 'b' }, points: 10,
          },
          {
            type: 'MULTIPLE_CHOICE',
            prompt: 'Comment dit-on "J\'ai mal à la tête" en darija ?',
            data: { options: [
              { id: 'a', text: 'Batnti kiddir biya' },
              { id: 'b', text: 'Rasi kiddir biya', transliteration: 'راسي كيدير بيا' },
              { id: 'c', text: 'Rejli kiddir biya' },
              { id: 'd', text: 'Kiddir biya rasi?' },
            ]},
            answer: { id: 'b' }, points: 15,
          },
        ],
      },
      {
        order: 2,
        title: 'Chez le médecin',
        subtitle: 'عند الطبيب',
        description: 'Décrire ses symptômes et comprendre le médecin.',
        duration: 360,
        exercises: [
          {
            type: 'MULTIPLE_CHOICE',
            prompt: '"عندي سخانة" signifie :',
            data: { options: [
              { id: 'a', text: 'J\'ai froid' },
              { id: 'b', text: 'J\'ai de la fièvre' },
              { id: 'c', text: 'J\'ai une allergie' },
              { id: 'd', text: 'Je suis fatigué' },
            ]},
            answer: { id: 'b' }, points: 10,
          },
          {
            type: 'MULTIPLE_CHOICE',
            prompt: '"منداك أشحال؟" demande le médecin. Cela signifie :',
            data: { options: [
              { id: 'a', text: 'Tu as quel âge ?' },
              { id: 'b', text: 'Depuis combien de temps ?' },
              { id: 'c', text: 'Tu as déjà eu ça ?' },
              { id: 'd', text: 'Tu prends des médicaments ?' },
            ]},
            answer: { id: 'b' }, points: 10,
          },
          {
            type: 'MULTIPLE_CHOICE',
            prompt: 'Comment dit-on "Je tousse depuis deux jours" en darija ?',
            data: { options: [
              { id: 'a', text: 'Ana knkah men yum' },
              { id: 'b', text: 'Ana knkah men yumein', transliteration: 'أنا كنكح من يومين' },
              { id: 'c', text: 'Andi shta men yumein' },
              { id: 'd', text: 'Ana mrid men yumein' },
            ]},
            answer: { id: 'b' }, points: 15,
          },
        ],
      },
    ],
  },

  {
    slug: 'les-metiers-et-travail',
    title: 'Le Travail',
    subtitle: 'Métiers et vie professionnelle',
    description: 'Parler de son travail, ses études et la vie professionnelle au Maroc.',
    level: 3,
    colorA: '#2d6a4f', colorB: '#1a4a30', shadowColor: '#0d2e1a',
    lessons: [
      {
        order: 1,
        title: 'Les métiers courants',
        subtitle: 'الخدمة والمهن',
        description: 'Nommer les professions en darija.',
        duration: 300,
        exercises: [
          {
            type: 'MULTIPLE_CHOICE',
            prompt: '"المعلم" (l-maallem) désigne :',
            data: { options: [
              { id: 'a', text: 'Le médecin' },
              { id: 'b', text: 'L\'artisan maître (charpentier, maçon...)' },
              { id: 'c', text: 'Le directeur' },
              { id: 'd', text: 'Le commerçant' },
            ]},
            answer: { id: 'b' }, points: 10,
          },
          {
            type: 'MULTIPLE_CHOICE',
            prompt: '"الخياط" (l-khayyat) est :',
            data: { options: [
              { id: 'a', text: 'Le cordonnier' },
              { id: 'b', text: 'Le tailleur / couturier' },
              { id: 'c', text: 'Le forgeron' },
              { id: 'd', text: 'Le potier' },
            ]},
            answer: { id: 'b' }, points: 10,
          },
          {
            type: 'MULTIPLE_CHOICE',
            prompt: 'Comment dit-on "Mon père est ingénieur" en darija ?',
            data: { options: [
              { id: 'a', text: 'Baba huwa tabib' },
              { id: 'b', text: 'Baba huwa muhandis', transliteration: 'بابا هو مهندس' },
              { id: 'c', text: 'Baba mudarris' },
              { id: 'd', text: 'Baba huwa khaddam' },
            ]},
            answer: { id: 'b' }, points: 15,
          },
        ],
      },
      {
        order: 2,
        title: 'Au bureau',
        subtitle: 'فالبيرو',
        description: 'Vocabulaire du monde professionnel.',
        duration: 300,
        exercises: [
          {
            type: 'MULTIPLE_CHOICE',
            prompt: '"الاجتماع" (l-ijtima) désigne :',
            data: { options: [
              { id: 'a', text: 'La pause café' },
              { id: 'b', text: 'La réunion' },
              { id: 'c', text: 'Le bureau' },
              { id: 'd', text: 'Le contrat' },
            ]},
            answer: { id: 'b' }, points: 10,
          },
          {
            type: 'MULTIPLE_CHOICE',
            prompt: 'Comment dit-on "J\'ai une réunion à 10h" en darija ?',
            data: { options: [
              { id: 'a', text: 'Andi ijtima ssaa achara', transliteration: 'عندي اجتماع الساعة عشرة' },
              { id: 'b', text: 'Andi ijtima ssaa tisa' },
              { id: 'c', text: 'Andi chi haja ssaa achara' },
              { id: 'd', text: 'Ssaa achara andi ijtima' },
            ]},
            answer: { id: 'a' }, points: 15,
          },
        ],
      },
    ],
  },

  {
    slug: 'expressions-idiomatiques',
    title: 'Expressions Idiomatiques',
    subtitle: 'Parler comme un Marocain',
    description: 'Les expressions figées, proverbes et formules qui donnent du piquant à ton darija.',
    level: 4,
    colorA: '#1b3a6b', colorB: '#0f2550', shadowColor: '#071530',
    lessons: [
      {
        order: 1,
        title: 'Inchallah et ses variantes',
        subtitle: 'إنشالله وما يشبهها',
        description: 'Les expressions de la vie quotidienne marocaine.',
        duration: 360,
        exercises: [
          {
            type: 'MULTIPLE_CHOICE',
            prompt: '"مكتوب" (mektoub) signifie :',
            data: { options: [
              { id: 'a', text: 'C\'est écrit / c\'est le destin' },
              { id: 'b', text: 'C\'est fini' },
              { id: 'c', text: 'C\'est vrai' },
              { id: 'd', text: 'C\'est bon' },
            ]},
            answer: { id: 'a' }, points: 10,
          },
          {
            type: 'MULTIPLE_CHOICE',
            prompt: '"الله يرحمو" (Allah yrahmu) se dit :',
            data: { options: [
              { id: 'a', text: 'Lors d\'une naissance' },
              { id: 'b', text: 'Lors d\'un mariage' },
              { id: 'c', text: 'En évoquant quelqu\'un de décédé' },
              { id: 'd', text: 'Lors d\'un voyage' },
            ]},
            answer: { id: 'c' }, points: 10,
          },
          {
            type: 'MULTIPLE_CHOICE',
            prompt: '"عين الحسود فيها عود" est un proverbe qui signifie :',
            data: { options: [
              { id: 'a', text: 'Les yeux sont le miroir de l\'âme' },
              { id: 'b', text: 'La jalousie nuit à celui qui est jaloux' },
              { id: 'c', text: 'Prends soin de tes yeux' },
              { id: 'd', text: 'Le regard porte malheur' },
            ]},
            answer: { id: 'b' }, points: 10,
          },
        ],
      },
      {
        order: 2,
        title: 'La vie sociale marocaine',
        subtitle: 'الحمام، الدعوة، الزواج',
        description: 'Expressions liées au hammam, aux invitations et aux fêtes.',
        duration: 420,
        exercises: [
          {
            type: 'MULTIPLE_CHOICE',
            prompt: '"تفضل" (tafaddal) signifie :',
            data: { options: [
              { id: 'a', text: 'Non merci' },
              { id: 'b', text: 'Je vous en prie / entrez / servez-vous' },
              { id: 'c', text: 'Attends' },
              { id: 'd', text: 'Dépêche-toi' },
            ]},
            answer: { id: 'b' }, points: 10,
          },
          {
            type: 'MULTIPLE_CHOICE',
            prompt: '"الله يخليك" (Allah ikhlik) est une expression pour :',
            data: { options: [
              { id: 'a', text: 'Maudire quelqu\'un' },
              { id: 'b', text: 'Bénir quelqu\'un qu\'on aime (que Dieu te garde)' },
              { id: 'c', text: 'Dire au revoir' },
              { id: 'd', text: 'Remercier formellement' },
            ]},
            answer: { id: 'b' }, points: 10,
          },
          {
            type: 'MULTIPLE_CHOICE',
            prompt: '"مبروك" (mabrouk) est utilisé pour :',
            data: { options: [
              { id: 'a', text: 'Les condoléances' },
              { id: 'b', text: 'Les félicitations (mariage, naissance, promotion...)' },
              { id: 'c', text: 'Les salutations du matin' },
              { id: 'd', text: 'Les remerciements' },
            ]},
            answer: { id: 'b' }, points: 10,
          },
        ],
      },
      {
        order: 3,
        title: 'Les proverbes marocains',
        subtitle: 'الأمثال الشعبية',
        description: 'La sagesse populaire marocaine en darija.',
        duration: 420,
        exercises: [
          {
            type: 'MULTIPLE_CHOICE',
            prompt: '"اللي فات مات" (lli fat mat) signifie :',
            data: { options: [
              { id: 'a', text: 'La mort est inévitable' },
              { id: 'b', text: 'Ce qui est passé est passé (tourne la page)' },
              { id: 'c', text: 'Les anciens ont toujours raison' },
              { id: 'd', text: 'Vis dans le présent' },
            ]},
            answer: { id: 'b' }, points: 10,
          },
          {
            type: 'MULTIPLE_CHOICE',
            prompt: '"الصبر مفتاح الفرج" signifie :',
            data: { options: [
              { id: 'a', text: 'La chance sourit aux audacieux' },
              { id: 'b', text: 'La patience est la clé du bonheur / de la délivrance' },
              { id: 'c', text: 'Le temps c\'est de l\'argent' },
              { id: 'd', text: 'L\'attente est douloureuse' },
            ]},
            answer: { id: 'b' }, points: 10,
          },
          {
            type: 'MULTIPLE_CHOICE',
            prompt: '"خو خو يا قردة" est une expression utilisée pour :',
            data: { options: [
              { id: 'a', text: 'Appeler quelqu\'un d\'affectueusement' },
              { id: 'b', text: 'Se moquer de quelqu\'un qui imite les autres sans réfléchir' },
              { id: 'c', text: 'Appeler les enfants à venir manger' },
              { id: 'd', text: 'Gronder quelqu\'un qui a fait une bêtise' },
            ]},
            answer: { id: 'b' }, points: 10,
          },
        ],
      },
    ],
  },

  {
    slug: 'darija-avance',
    title: 'Darija Avancé',
    subtitle: 'Fluidité et nuances',
    description: 'Maîtrise les temps verbaux, les nuances et les registres de langue pour parler comme un natif.',
    level: 4,
    colorA: '#4a4e69', colorB: '#2c2f45', shadowColor: '#1a1c30',
    lessons: [
      {
        order: 1,
        title: 'Les verbes au présent',
        subtitle: 'كـ + الفعل',
        description: 'La conjugaison des verbes courants au présent en darija.',
        duration: 420,
        exercises: [
          {
            type: 'MULTIPLE_CHOICE',
            prompt: 'En darija, le présent continu se forme avec :',
            data: { options: [
              { id: 'a', text: 'Le verbe seul' },
              { id: 'b', text: 'كـ (ka-) + le verbe' },
              { id: 'c', text: 'Le verbe + نا' },
              { id: 'd', text: 'غادي + le verbe' },
            ]},
            answer: { id: 'b' }, points: 10,
          },
          {
            type: 'MULTIPLE_CHOICE',
            prompt: '"كنمشي للمدرسة" signifie :',
            data: { options: [
              { id: 'a', text: 'J\'irai à l\'école' },
              { id: 'b', text: 'Je vais (en ce moment) à l\'école / j\'y vais habituellement' },
              { id: 'c', text: 'Je suis allé à l\'école' },
              { id: 'd', text: 'J\'habitais près de l\'école' },
            ]},
            answer: { id: 'b' }, points: 10,
          },
          {
            type: 'MULTIPLE_CHOICE',
            prompt: 'Comment dit-on "Il mange en ce moment" en darija ?',
            data: { options: [
              { id: 'a', text: 'Huwa kichrab daba' },
              { id: 'b', text: 'Huwa kiakol daba', transliteration: 'هو كياكل دابا' },
              { id: 'c', text: 'Huwa mcha yakol' },
              { id: 'd', text: 'Daba huwa yakol' },
            ]},
            answer: { id: 'b' }, points: 15,
          },
        ],
      },
      {
        order: 2,
        title: 'Le passé en darija',
        subtitle: 'مشيت، كليت، شريت',
        description: 'Le passé simple : comment conjuguer et l\'utiliser.',
        duration: 420,
        exercises: [
          {
            type: 'MULTIPLE_CHOICE',
            prompt: '"مشيت" (mchit) signifie :',
            data: { options: [
              { id: 'a', text: 'Je vais' },
              { id: 'b', text: 'Je suis parti / J\'y suis allé' },
              { id: 'c', text: 'Je vais partir' },
              { id: 'd', text: 'Je pars maintenant' },
            ]},
            answer: { id: 'b' }, points: 10,
          },
          {
            type: 'MULTIPLE_CHOICE',
            prompt: '"ما كليتش" signifie :',
            data: { options: [
              { id: 'a', text: 'J\'ai mangé' },
              { id: 'b', text: 'Je mange' },
              { id: 'c', text: 'Je n\'ai pas mangé' },
              { id: 'd', text: 'Je ne mange pas' },
            ]},
            answer: { id: 'c' }, points: 10,
          },
          {
            type: 'MULTIPLE_CHOICE',
            prompt: 'Comment dit-on "Hier, nous sommes allés au souk" en darija ?',
            data: { options: [
              { id: 'a', text: 'L-bareh mchina l-bhar' },
              { id: 'b', text: 'L-bareh mchina l-suq', transliteration: 'البارح مشينا للسوق' },
              { id: 'c', text: 'Daba mchina l-suq' },
              { id: 'd', text: 'Mchina l-suq ghda' },
            ]},
            answer: { id: 'b' }, points: 15,
          },
        ],
      },
      {
        order: 3,
        title: 'Le futur en darija',
        subtitle: 'غادي + الفعل',
        description: 'Parler du futur avec "ghadi" et les expressions temporelles.',
        duration: 360,
        exercises: [
          {
            type: 'MULTIPLE_CHOICE',
            prompt: '"غادي نمشي غدا" signifie :',
            data: { options: [
              { id: 'a', text: 'Je suis parti hier' },
              { id: 'b', text: 'Je pars maintenant' },
              { id: 'c', text: 'Je vais partir demain' },
              { id: 'd', text: 'J\'irais si je pouvais' },
            ]},
            answer: { id: 'c' }, points: 10,
          },
          {
            type: 'MULTIPLE_CHOICE',
            prompt: 'Comment dit-on "Elle va étudier à l\'université l\'année prochaine" en darija ?',
            data: { options: [
              { id: 'a', text: 'Hiya ghadia tqra f-jamia daba' },
              { id: 'b', text: 'Hiya ghadia tqra f-jamia l-am l-jay', transliteration: 'هي غادية تقرا فالجامعة العام الجاي' },
              { id: 'c', text: 'Hiya kanet tqra f-jamia' },
              { id: 'd', text: 'Hiya ghadia l-jamia l-am l-jay' },
            ]},
            answer: { id: 'b' }, points: 20,
          },
        ],
      },
    ],
  },

];

// ─────────────────────────────────────────────
//  SEED FUNCTION
// ─────────────────────────────────────────────
async function main() {
  console.log('🌱 Démarrage du seed curriculum DarijaMaroc...\n');

  // Langue
  const language = await prisma.language.upsert({
    where: { code: 'ar-MA' },
    update: {},
    create: { code: 'ar-MA', name: 'Darija (Marocain)' },
  });
  console.log(`✅ Langue : ${language.name}`);

  let moduleCount = 0;
  let lessonCount = 0;
  let exerciseCount = 0;

  for (const mod of CURRICULUM) {
    // Upsert module
    const module = await prisma.module.upsert({
      where: { slug: mod.slug },
      update: {
        title: mod.title,
        subtitle: mod.subtitle,
        description: mod.description,
        level: mod.level,
        colorA: mod.colorA,
        colorB: mod.colorB,
        shadowColor: mod.shadowColor,
        isPublished: true,
      },
      create: {
        title: mod.title,
        subtitle: mod.subtitle,
        description: mod.description,
        level: mod.level,
        slug: mod.slug,
        colorA: mod.colorA,
        colorB: mod.colorB,
        shadowColor: mod.shadowColor,
        isPublished: true,
      },
    });

    console.log(`\n📚 Module [${mod.level}] : ${module.title}`);
    moduleCount++;

    for (const les of mod.lessons) {
      const slug = `${mod.slug}-lecon-${les.order}`;

      // Upsert lesson
      const lesson = await prisma.lesson.upsert({
        where: { slug },
        update: {
          title: les.title,
          subtitle: les.subtitle,
          description: les.description,
          order: les.order,
          duration: les.duration,
          level: mod.level,
          isPublished: true,
        },
        create: {
          title: les.title,
          subtitle: les.subtitle,
          description: les.description,
          slug,
          order: les.order,
          duration: les.duration,
          level: mod.level,
          moduleId: module.id,
          languageId: language.id,
          isPublished: true,
        },
      });

      console.log(`   📖 Leçon ${les.order} : ${lesson.title}`);
      lessonCount++;

      // Delete old exercises for this lesson then recreate (idempotent)
      await prisma.exercise.deleteMany({ where: { lessonId: lesson.id } });

      for (const ex of les.exercises) {
        await prisma.exercise.create({
          data: {
            type: ex.type,
            prompt: ex.prompt,
            data: ex.data,
            answer: ex.answer,
            points: ex.points,
            lessonId: lesson.id,
          },
        });
        exerciseCount++;
      }

      console.log(`      ✏️  ${les.exercises.length} exercice(s) créé(s)`);
    }
  }

  console.log(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎉 Seed terminé !
   📚 Modules   : ${moduleCount}
   📖 Leçons    : ${lessonCount}
   ✏️  Exercices : ${exerciseCount}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  `);
}

main()
  .catch((e) => {
    console.error('❌ Seed échoué :', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
