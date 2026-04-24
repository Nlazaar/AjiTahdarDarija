"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// ─── HELPERS ──────────────────────────────────────────────────────────────────
function shuffle(arr) {
    return [...arr].sort(() => Math.random() - 0.5);
}
function pickDistractors(correct, pool, count) {
    return shuffle(pool.filter((item) => item !== correct)).slice(0, count);
}
// ─── DONNÉES : ALPHABET ───────────────────────────────────────────────────────
const ALPHABET_GROUPS = [
    {
        lessonTitle: 'Les premières lettres',
        lessonSlug: 'alphabet-1',
        lessonSubtitle: 'ا ب ت ث ج',
        order: 1,
        letters: [
            { arabic: 'ا', latin: 'a', fr: "a — comme dans 'ami'" },
            { arabic: 'ب', latin: 'b', fr: "b — comme dans 'bateau'" },
            { arabic: 'ت', latin: 't', fr: "t — comme dans 'table'" },
            { arabic: 'ث', latin: 'th', fr: 'th — entre s et t' },
            { arabic: 'ج', latin: 'j', fr: "j — comme dans 'jardin'" },
        ],
    },
    {
        lessonTitle: 'Sons du fond de la gorge',
        lessonSlug: 'alphabet-2',
        lessonSubtitle: 'ح خ د ذ ر',
        order: 2,
        letters: [
            { arabic: 'ح', latin: '7', fr: 'h profond — vient de la gorge' },
            { arabic: 'خ', latin: 'kh', fr: "kh — comme le 'J' espagnol" },
            { arabic: 'د', latin: 'd', fr: "d — comme dans 'demain'" },
            { arabic: 'ذ', latin: 'dh', fr: 'dh — entre d et z' },
            { arabic: 'ر', latin: 'r', fr: 'r roulé — comme en espagnol' },
        ],
    },
    {
        lessonTitle: 'Les sibilantes',
        lessonSlug: 'alphabet-3',
        lessonSubtitle: 'ز س ش ص ض',
        order: 3,
        letters: [
            { arabic: 'ز', latin: 'z', fr: "z — comme dans 'zèbre'" },
            { arabic: 'س', latin: 's', fr: "s — comme dans 'soleil'" },
            { arabic: 'ش', latin: 'ch', fr: "ch — comme dans 'chat'" },
            { arabic: 'ص', latin: 'S', fr: 's emphatique — s profond' },
            { arabic: 'ض', latin: 'D', fr: 'd emphatique — d profond' },
        ],
    },
    {
        lessonTitle: 'Les emphatiques',
        lessonSlug: 'alphabet-4',
        lessonSubtitle: 'ط ظ ع غ ف',
        order: 4,
        letters: [
            { arabic: 'ط', latin: 'T', fr: 't emphatique — t profond' },
            { arabic: 'ظ', latin: 'Z', fr: 'z emphatique — z profond' },
            { arabic: 'ع', latin: '3', fr: 'a guttural — du fond de la gorge' },
            { arabic: 'غ', latin: 'gh', fr: 'r guttural — comme un gargarisme' },
            { arabic: 'ف', latin: 'f', fr: "f — comme dans 'fleur'" },
        ],
    },
    {
        lessonTitle: "Fin de l'alphabet",
        lessonSlug: 'alphabet-5',
        lessonSubtitle: 'ق ك ل م ن ه و ي',
        order: 5,
        letters: [
            { arabic: 'ق', latin: 'q', fr: 'k profond — du fond de la gorge' },
            { arabic: 'ك', latin: 'k', fr: "k — comme dans 'café'" },
            { arabic: 'ل', latin: 'l', fr: "l — comme dans 'lune'" },
            { arabic: 'م', latin: 'm', fr: "m — comme dans 'maison'" },
            { arabic: 'ن', latin: 'n', fr: "n — comme dans 'nuit'" },
            { arabic: 'ه', latin: 'h', fr: 'h aspiré — souffle léger' },
            { arabic: 'و', latin: 'w', fr: "w/ou — comme 'w' ou 'ou'" },
            { arabic: 'ي', latin: 'y', fr: "y/i — comme 'y' ou 'i'" },
        ],
    },
];
const ALL_LETTERS = ALPHABET_GROUPS.flatMap((g) => g.letters);
// ─── DONNÉES : SALUTATIONS ────────────────────────────────────────────────────
const SALUTATIONS_GROUPS = [
    {
        lessonTitle: 'Dire bonjour',
        lessonSlug: 'salutations-1',
        lessonSubtitle: 'Les premières salutations',
        order: 1,
        words: [
            {
                darija: 'مرحبا',
                latin: 'marhaba',
                fr: 'Bonjour',
                example_d: 'مرحبا، كيداير؟',
                example_f: 'Bonjour, comment vas-tu ?',
            },
            {
                darija: 'السلام عليكم',
                latin: 'salam 3likoum',
                fr: 'Paix sur vous',
                example_d: 'السلام عليكم يا صاحبي!',
                example_f: 'Bonjour mon ami !',
            },
            {
                darija: 'كيداير',
                latin: 'kidayr',
                fr: 'Comment vas-tu ? (m)',
                example_d: 'كيداير، لاباس؟',
                example_f: 'Comment vas-tu, ça va ?',
            },
            {
                darija: 'كيدايرة',
                latin: 'kidayra',
                fr: 'Comment vas-tu ? (f)',
                example_d: 'كيدايرة نتي؟',
                example_f: 'Et toi, comment tu vas ?',
            },
            {
                darija: 'لاباس',
                latin: 'labas',
                fr: 'Ça va / Pas de mal',
                example_d: 'لاباس، شكرا',
                example_f: 'Ça va, merci',
            },
            {
                darija: 'بخير',
                latin: 'bkhir',
                fr: 'Bien / En bonne santé',
                example_d: 'أنا بخير، شكرا',
                example_f: 'Je vais bien, merci',
            },
        ],
    },
    {
        lessonTitle: 'Politesse et au revoir',
        lessonSlug: 'salutations-2',
        lessonSubtitle: 'Remercier et prendre congé',
        order: 2,
        words: [
            {
                darija: 'شكرا',
                latin: 'chokran',
                fr: 'Merci',
                example_d: 'شكرا بزاف!',
                example_f: 'Merci beaucoup !',
            },
            {
                darija: 'عفاك',
                latin: '3afak',
                fr: "S'il te plaît",
                example_d: 'عفاك، واش عندك الوقت؟',
                example_f: "S'il te plaît, as-tu l'heure ?",
            },
            {
                darija: 'سمحلي',
                latin: 'smahli',
                fr: 'Excuse-moi / Pardon',
                example_d: 'سمحلي، مافهمتش',
                example_f: "Excuse-moi, je n'ai pas compris",
            },
            {
                darija: 'بسلامة',
                latin: 'bslama',
                fr: 'Au revoir',
                example_d: 'بسلامة، غدا نشوفك',
                example_f: 'Au revoir, on se voit demain',
            },
            {
                darija: 'إيه',
                latin: 'iyeh',
                fr: 'Oui',
                example_d: 'إيه، فاهم',
                example_f: 'Oui, je comprends',
            },
            {
                darija: 'لا',
                latin: 'la',
                fr: 'Non',
                example_d: 'لا، مافهمتش',
                example_f: "Non, je n'ai pas compris",
            },
        ],
    },
];
// ─── DONNÉES : CHIFFRES ───────────────────────────────────────────────────────
const CHIFFRES_GROUPS = [
    {
        lessonTitle: 'Les chiffres de 1 à 10',
        lessonSlug: 'chiffres-1',
        lessonSubtitle: 'Compter en darija',
        order: 1,
        words: [
            { darija: 'واحد', latin: 'wahed', fr: '1 — Un', example_d: 'عندي واحد ولد', example_f: "J'ai un fils" },
            { darija: 'جوج', latin: 'jouj', fr: '2 — Deux', example_d: 'جوج ديال الكاسات', example_f: 'Deux verres' },
            { darija: 'تلاتة', latin: 'tlata', fr: '3 — Trois', example_d: 'تلاتة أيام', example_f: 'Trois jours' },
            { darija: 'ربعة', latin: 'rb3a', fr: '4 — Quatre', example_d: 'ربعة ديال الخبز', example_f: 'Quatre pains' },
            { darija: 'خمسة', latin: 'khmsa', fr: '5 — Cinq', example_d: 'خمسة دراهم', example_f: 'Cinq dirhams' },
            { darija: 'ستة', latin: 'stta', fr: '6 — Six', example_d: 'ستة ديال الساعات', example_f: 'Six heures' },
            { darija: 'سبعة', latin: 'sb3a', fr: '7 — Sept', example_d: 'سبعة أيام فالسيمانة', example_f: 'Sept jours dans la semaine' },
            { darija: 'تمنية', latin: 'tmnya', fr: '8 — Huit', example_d: 'تمنية ديال العباد', example_f: 'Huit personnes' },
            { darija: 'تسعة', latin: 'ts3a', fr: '9 — Neuf', example_d: 'تسعة ديال الشهور', example_f: 'Neuf mois' },
            { darija: 'عشرة', latin: '3chra', fr: '10 — Dix', example_d: 'عشرة دراهم عفاك', example_f: 'Dix dirhams s\'il te plaît' },
        ],
    },
    {
        lessonTitle: 'Les chiffres de 10 à 100',
        lessonSlug: 'chiffres-2',
        lessonSubtitle: 'Dizaines en darija',
        order: 2,
        words: [
            { darija: 'عشرة', latin: '3chra', fr: '10 — Dix', example_d: 'عشرة دراهم', example_f: 'Dix dirhams' },
            { darija: 'عشرين', latin: '3chrine', fr: '20 — Vingt', example_d: 'عشرين سنة', example_f: 'Vingt ans' },
            { darija: 'تلاتين', latin: 'tlatine', fr: '30 — Trente', example_d: 'تلاتين درهم', example_f: 'Trente dirhams' },
            { darija: 'ربعين', latin: 'rb3ine', fr: '40 — Quarante', example_d: 'ربعين كيلو', example_f: 'Quarante kilos' },
            { darija: 'خمسين', latin: 'khmsine', fr: '50 — Cinquante', example_d: 'خمسين دقيقة', example_f: 'Cinquante minutes' },
            { darija: 'ستين', latin: 'sttine', fr: '60 — Soixante', example_d: 'ستين سنة', example_f: 'Soixante ans' },
            { darija: 'سبعين', latin: 'sb3ine', fr: '70 — Soixante-dix', example_d: 'سبعين درهم', example_f: 'Soixante-dix dirhams' },
            { darija: 'تمانين', latin: 'tmanine', fr: '80 — Quatre-vingts', example_d: 'تمانين كيلو', example_f: 'Quatre-vingts kilos' },
            { darija: 'تسعين', latin: 'ts3ine', fr: '90 — Quatre-vingt-dix', example_d: 'تسعين سنة', example_f: 'Quatre-vingt-dix ans' },
            { darija: 'ميا', latin: 'mya', fr: '100 — Cent', example_d: 'ميا درهم', example_f: 'Cent dirhams' },
        ],
    },
];
// ─── DONNÉES : COULEURS ───────────────────────────────────────────────────────
const COULEURS_GROUPS = [
    {
        lessonTitle: 'Les couleurs de base',
        lessonSlug: 'couleurs-1',
        lessonSubtitle: 'Les couleurs en darija',
        order: 1,
        words: [
            { darija: 'حمر', latin: 'hmar', fr: 'Rouge', example_d: 'الجلابة حمرا', example_f: 'La djellaba est rouge' },
            { darija: 'زرق', latin: 'zraq', fr: 'Bleu', example_d: 'السما زرقة', example_f: 'Le ciel est bleu' },
            { darija: 'خضر', latin: 'khdar', fr: 'Vert', example_d: 'الشجرة خضرة', example_f: "L'arbre est vert" },
            { darija: 'صفر', latin: 'sfar', fr: 'Jaune', example_d: 'الشمس صفرة', example_f: 'Le soleil est jaune' },
            { darija: 'بيض', latin: 'byad', fr: 'Blanc', example_d: 'الثلج بياض', example_f: 'La neige est blanche' },
            { darija: 'كحل', latin: 'khal', fr: 'Noir', example_d: 'الليل كحل', example_f: 'La nuit est noire' },
            { darija: 'برتقالي', latin: 'bortqali', fr: 'Orange', example_d: 'البرتقالة برتقالية', example_f: "L'orange est orange" },
            { darija: 'بنيني', latin: 'bni-ni', fr: 'Marron', example_d: 'التربة بنينية', example_f: 'La terre est marron' },
        ],
    },
];
// ─── DONNÉES : FAMILLE ────────────────────────────────────────────────────────
const FAMILLE_GROUPS = [
    {
        lessonTitle: 'La famille proche',
        lessonSlug: 'famille-1',
        lessonSubtitle: 'Parents, frères et sœurs',
        order: 1,
        words: [
            { darija: 'بابا', latin: 'baba', fr: 'Papa / Père', example_d: 'بابا ديالي كيخدم', example_f: 'Mon père travaille' },
            { darija: 'ماما', latin: 'mama', fr: 'Maman / Mère', example_d: 'ماما طيبات فالكوزينة', example_f: 'Maman cuisine' },
            { darija: 'خويا', latin: 'khoya', fr: 'Mon frère', example_d: 'خويا كبير منّي', example_f: 'Mon frère est plus grand que moi' },
            { darija: 'خيتي', latin: 'khti', fr: 'Ma sœur', example_d: 'خيتي زوينة بزاف', example_f: 'Ma sœur est très belle' },
            { darija: 'ولد', latin: 'weld', fr: 'Fils / Garçon', example_d: 'عندي ولد واحد', example_f: "J'ai un fils" },
            { darija: 'بنت', latin: 'bent', fr: 'Fille', example_d: 'هي بنت زوينة', example_f: "C'est une belle fille" },
        ],
    },
    {
        lessonTitle: 'La famille élargie',
        lessonSlug: 'famille-2',
        lessonSubtitle: 'Grands-parents et cousins',
        order: 2,
        words: [
            { darija: 'جد', latin: 'jedd', fr: 'Grand-père', example_d: 'جدي عمره تمانين سنة', example_f: 'Mon grand-père a 80 ans' },
            { darija: 'جدة', latin: 'jedda', fr: 'Grand-mère', example_d: 'جدتي كتحب الشاي', example_f: 'Ma grand-mère aime le thé' },
            { darija: 'عم', latin: '3am', fr: 'Oncle (paternel)', example_d: 'عمي ساكن فالرباط', example_f: 'Mon oncle habite à Rabat' },
            { darija: 'خال', latin: 'khal', fr: 'Oncle (maternel)', example_d: 'خالي جا من فرنسا', example_f: 'Mon oncle est venu de France' },
            { darija: 'عمة', latin: '3amma', fr: 'Tante (paternelle)', example_d: 'عمتي عندها تلاتة ولاد', example_f: 'Ma tante a trois enfants' },
            { darija: 'خالة', latin: 'khala', fr: 'Tante (maternelle)', example_d: 'خالتي طبيبة', example_f: 'Ma tante est médecin' },
        ],
    },
];
// ─── DONNÉES : LA MAISON ──────────────────────────────────────────────────────
const MAISON_GROUPS = [
    {
        lessonTitle: 'Les pièces de la maison',
        lessonSlug: 'maison-1',
        lessonSubtitle: 'Se repérer chez soi',
        order: 1,
        words: [
            { darija: 'الدار', latin: 'ddar', fr: 'La maison', example_d: 'الدار ديالنا كبيرة', example_f: 'Notre maison est grande' },
            { darija: 'البيت', latin: 'lbit', fr: 'La chambre', example_d: 'البيت ديالي فالطابق', example_f: "Ma chambre est à l'étage" },
            { darija: 'الكوزينة', latin: 'lkouzina', fr: 'La cuisine', example_d: 'ماما فالكوزينة', example_f: 'Maman est dans la cuisine' },
            { darija: 'الصالة', latin: 'ssala', fr: 'Le salon', example_d: 'كنتفرج فالصالة', example_f: 'Je regarde la TV au salon' },
            { darija: 'الحمام', latin: 'lhmmam', fr: 'La salle de bain', example_d: 'الحمام محتل', example_f: 'La salle de bain est occupée' },
            { darija: 'الحوش', latin: 'lhwch', fr: 'La cour / patio', example_d: 'الأولاد كيلعبو فالحوش', example_f: 'Les enfants jouent dans la cour' },
        ],
    },
    {
        lessonTitle: 'Les objets de la maison',
        lessonSlug: 'maison-2',
        lessonSubtitle: 'Meubles et équipements',
        order: 2,
        words: [
            { darija: 'الطبلة', latin: 'TTabla', fr: 'La table', example_d: 'الماكلة فوق الطبلة', example_f: 'La nourriture est sur la table' },
            { darija: 'الكرسي', latin: 'lkorsi', fr: 'La chaise', example_d: 'قعد فالكرسي', example_f: 'Assieds-toi sur la chaise' },
            { darija: 'الباب', latin: 'lbab', fr: 'La porte', example_d: 'سد الباب عفاك', example_f: "Ferme la porte s'il te plaît" },
            { darija: 'الشرجم', latin: 'chorjm', fr: 'La fenêtre', example_d: 'حل الشرجم، سخون هنا', example_f: 'Ouvre la fenêtre, il fait chaud' },
            { darija: 'الفراش', latin: 'lfrach', fr: 'Le lit', example_d: 'الفراش ديالي مريح', example_f: 'Mon lit est confortable' },
            { darija: 'الثلاجة', latin: 'ttlaja', fr: 'Le réfrigérateur', example_d: 'حط الجبن فالثلاجة', example_f: 'Mets le fromage dans le frigo' },
        ],
    },
];
// ─── DONNÉES : LA NOURRITURE ──────────────────────────────────────────────────
const NOURRITURE_GROUPS = [
    {
        lessonTitle: 'Les plats marocains',
        lessonSlug: 'nourriture-1',
        lessonSubtitle: 'La cuisine du Maroc',
        order: 1,
        words: [
            { darija: 'الخبز', latin: 'lkhobz', fr: 'Le pain', example_d: 'الخبز دايما فالمائدة', example_f: 'Le pain est toujours sur la table' },
            { darija: 'الطاجين', latin: 'ttajin', fr: 'Le tajine', example_d: 'الطاجين بالدجاج بنين', example_f: 'Le tajine au poulet est délicieux' },
            { darija: 'الكسكس', latin: 'lksksu', fr: 'Le couscous', example_d: 'كنديرو الكسكس نهار الجمعة', example_f: 'On fait le couscous le vendredi' },
            { darija: 'الحريرة', latin: 'lhrira', fr: 'La harira', example_d: 'الحريرة سخونة ومزيانة', example_f: 'La harira est chaude et bonne' },
            { darija: 'اللحم', latin: 'llham', fr: 'La viande', example_d: 'بغيت اللحم مشوي', example_f: 'Je veux de la viande grillée' },
            { darija: 'الخضرة', latin: 'lkhDra', fr: 'Les légumes', example_d: 'كول الخضرة مزيانة للصحة', example_f: 'Mange des légumes, bon pour la santé' },
        ],
    },
    {
        lessonTitle: 'Boissons et fruits',
        lessonSlug: 'nourriture-2',
        lessonSubtitle: 'Ce qu\'on boit et grignote',
        order: 2,
        words: [
            { darija: 'أتاي', latin: 'atay', fr: 'Le thé à la menthe', example_d: 'بغيت أتاي بالنعناع', example_f: 'Je veux du thé à la menthe' },
            { darija: 'القهوة', latin: 'lqhwa', fr: 'Le café', example_d: 'كنشرب القهوة الصباح', example_f: 'Je bois le café le matin' },
            { darija: 'الماء', latin: 'lma', fr: "L'eau", example_d: 'عطني الماء عفاك', example_f: "Donne-moi de l'eau s'il te plaît" },
            { darija: 'التفاح', latin: 'ttffah', fr: 'La pomme', example_d: 'التفاح حلو هاد النهار', example_f: "Les pommes sont sucrées aujourd'hui" },
            { darija: 'الليمون', latin: 'llimon', fr: 'Le citron', example_d: 'الليمون حامض بزاف', example_f: 'Le citron est très acide' },
            { darija: 'العنب', latin: 'l3enb', fr: 'Le raisin', example_d: 'العنب مزيان فالصيف', example_f: "Le raisin est bon en été" },
        ],
    },
];
// ─── DONNÉES : LES ANIMAUX ────────────────────────────────────────────────────
const ANIMAUX_GROUPS = [
    {
        lessonTitle: 'Les animaux domestiques',
        lessonSlug: 'animaux-1',
        lessonSubtitle: 'À la maison et à la ferme',
        order: 1,
        words: [
            { darija: 'الكلب', latin: 'lkelb', fr: 'Le chien', example_d: 'الكلب ديالنا كيحرس', example_f: 'Notre chien garde la maison' },
            { darija: 'القطة', latin: 'lqeTTa', fr: 'Le chat', example_d: 'القطة كتنعس طول النهار', example_f: 'Le chat dort toute la journée' },
            { darija: 'الخروف', latin: 'lkhruf', fr: 'Le mouton', example_d: 'الخروف ديال العيد', example_f: "Le mouton de l'Aïd" },
            { darija: 'البقرة', latin: 'lbqra', fr: 'La vache', example_d: 'البقرة كتعطي الحليب', example_f: 'La vache donne du lait' },
            { darija: 'الدجاجة', latin: 'ddjaaja', fr: 'La poule', example_d: 'الدجاجة كتبيض كل نهار', example_f: 'La poule pond chaque jour' },
            { darija: 'الحمار', latin: 'lhmar', fr: "L'âne", example_d: 'الحمار كيحمل الأحمال', example_f: "L'âne porte des charges" },
        ],
    },
    {
        lessonTitle: 'Les animaux sauvages',
        lessonSlug: 'animaux-2',
        lessonSubtitle: 'Dans la nature',
        order: 2,
        words: [
            { darija: 'الأسد', latin: 'ssed', fr: 'Le lion', example_d: 'الأسد ملك الغابة', example_f: 'Le lion est le roi de la forêt' },
            { darija: 'الفيل', latin: 'lfil', fr: "L'éléphant", example_d: 'الفيل حيوان كبير بزاف', example_f: "L'éléphant est très grand" },
            { darija: 'القرد', latin: 'lqerd', fr: 'Le singe', example_d: 'القرد ظريف', example_f: 'Le singe est drôle' },
            { darija: 'الطير', latin: 'TTir', fr: "L'oiseau", example_d: 'الطير كيغني الصباح', example_f: "L'oiseau chante le matin" },
            { darija: 'السمكة', latin: 'ssmka', fr: 'Le poisson', example_d: 'السمكة كتعيش فالبحر', example_f: 'Le poisson vit dans la mer' },
            { darija: 'الثعبان', latin: 'tt3ban', fr: 'Le serpent', example_d: 'خايف من الثعبان', example_f: "J'ai peur du serpent" },
        ],
    },
];
// ─── DONNÉES : LE CORPS HUMAIN ────────────────────────────────────────────────
const CORPS_GROUPS = [
    {
        lessonTitle: 'La tête et le visage',
        lessonSlug: 'corps-1',
        lessonSubtitle: 'De la tête aux épaules',
        order: 1,
        words: [
            { darija: 'الرأس', latin: 'rras', fr: 'La tête', example_d: 'راسي كيدوخ', example_f: "J'ai la tête qui tourne" },
            { darija: 'العين', latin: 'l3in', fr: "L'œil", example_d: 'عيناه خضرين', example_f: 'Ses yeux sont verts' },
            { darija: 'الأذن', latin: 'wdna', fr: "L'oreille", example_d: 'أذني كتوجع', example_f: 'Mon oreille fait mal' },
            { darija: 'الأنف', latin: 'nif', fr: 'Le nez', example_d: 'نيفي مسدود', example_f: 'Mon nez est bouché' },
            { darija: 'الفم', latin: 'lfomm', fr: 'La bouche', example_d: 'حل فمك', example_f: 'Ouvre la bouche' },
            { darija: 'الشعر', latin: 'ch3er', fr: 'Les cheveux', example_d: 'شعرها طويل', example_f: 'Ses cheveux sont longs' },
        ],
    },
    {
        lessonTitle: 'Le corps',
        lessonSlug: 'corps-2',
        lessonSubtitle: 'Membres et organes',
        order: 2,
        words: [
            { darija: 'اليد', latin: 'yed', fr: 'La main', example_d: 'سخني يديك', example_f: 'Réchauffe tes mains' },
            { darija: 'الرجل', latin: 'rejl', fr: 'La jambe', example_d: 'رجلي كتوجع', example_f: 'Ma jambe fait mal' },
            { darija: 'الضهر', latin: 'ddher', fr: 'Le dos', example_d: 'ضهري فيه ألم', example_f: "J'ai mal au dos" },
            { darija: 'القلب', latin: 'lqelb', fr: 'Le cœur', example_d: 'قلبه طيب', example_f: 'Il a bon cœur' },
            { darija: 'الكرش', latin: 'lkrch', fr: 'Le ventre', example_d: 'كرشي كتوجع', example_f: "J'ai mal au ventre" },
            { darija: 'الكتف', latin: 'lketf', fr: "L'épaule", example_d: 'كتفي كيوجع', example_f: "Mon épaule fait mal" },
        ],
    },
];
// ─── DONNÉES : LES VÊTEMENTS ──────────────────────────────────────────────────
const VETEMENTS_GROUPS = [
    {
        lessonTitle: 'Les vêtements du quotidien',
        lessonSlug: 'vetements-1',
        lessonSubtitle: "S'habiller en darija",
        order: 1,
        words: [
            { darija: 'الكميجة', latin: 'lqmija', fr: 'La chemise / t-shirt', example_d: 'الكميجة ديالك زوينة', example_f: 'Ta chemise est belle' },
            { darija: 'السروال', latin: 'sserwal', fr: 'Le pantalon', example_d: 'لبست سروال جديد', example_f: "J'ai mis un nouveau pantalon" },
            { darija: 'الجلابة', latin: 'jellaba', fr: 'La djellaba', example_d: 'الجلابة بيضاء فالعيد', example_f: "La djellaba blanche pour l'Aïd" },
            { darija: 'الكبوط', latin: 'lkbbout', fr: 'Le manteau', example_d: 'لبس الكبوط، برد بزاف', example_f: 'Mets le manteau, il fait très froid' },
            { darija: 'الصباط', latin: 'sbbat', fr: 'Les chaussures', example_d: 'الصباط ديالي ضيق', example_f: 'Mes chaussures sont trop petites' },
            { darija: 'الشراب', latin: 'chrab', fr: 'Les chaussettes', example_d: 'نسيت الشراب فالدار', example_f: "J'ai oublié mes chaussettes" },
        ],
    },
    {
        lessonTitle: 'Les accessoires',
        lessonSlug: 'vetements-2',
        lessonSubtitle: 'Compléter la tenue',
        order: 2,
        words: [
            { darija: 'الشاشية', latin: 'chachiya', fr: 'Le bonnet / chapeau', example_d: 'لبس الشاشية، برد', example_f: 'Mets le bonnet, il fait froid' },
            { darija: 'الحزام', latin: 'lhzam', fr: 'La ceinture', example_d: 'الحزام ديالي مقطع', example_f: 'Ma ceinture est cassée' },
            { darija: 'النضارة', latin: 'nnddara', fr: 'Les lunettes', example_d: 'نضارتي فالبيت', example_f: 'Mes lunettes sont à la maison' },
            { darija: 'الساعة', latin: 'ssa3a', fr: 'La montre', example_d: 'الساعة ديالي ذهبية', example_f: 'Ma montre est en or' },
            { darija: 'الشال', latin: 'chall', fr: "L'écharpe", example_d: 'الشال ديالها من الصوف', example_f: 'Son écharpe est en laine' },
            { darija: 'الكرافيطة', latin: 'lkrafita', fr: 'La cravate', example_d: 'الكرافيطة تزين البدلة', example_f: 'La cravate habille le costume' },
        ],
    },
];
// ─── DONNÉES : LES MÉTIERS ────────────────────────────────────────────────────
const METIERS_GROUPS = [
    {
        lessonTitle: 'Les métiers courants',
        lessonSlug: 'metiers-1',
        lessonSubtitle: 'Parler de son travail',
        order: 1,
        words: [
            { darija: 'الطبيب', latin: 'TTbib', fr: 'Le médecin', example_d: 'الطبيب كيعالج المرضى', example_f: 'Le médecin soigne les malades' },
            { darija: 'الأستاذ', latin: 'lustad', fr: 'Le professeur', example_d: 'الأستاذ كيدرس فالمدرسة', example_f: "Le professeur enseigne à l'école" },
            { darija: 'المهندس', latin: 'lmhendss', fr: "L'ingénieur", example_d: 'خويا مهندس فالبناء', example_f: 'Mon frère est ingénieur' },
            { darija: 'الطباخ', latin: 'TTbbakh', fr: 'Le cuisinier', example_d: 'الطباخ كيدير أكلة بنينة', example_f: 'Le cuisinier prépare un bon repas' },
            { darija: 'الشرطي', latin: 'churTi', fr: 'Le policier', example_d: 'الشرطي كيحرس المدينة', example_f: 'Le policier garde la ville' },
            { darija: 'الممرضة', latin: 'lmemrDa', fr: "L'infirmière", example_d: 'الممرضة معاها الدواء', example_f: "L'infirmière a les médicaments" },
        ],
    },
    {
        lessonTitle: 'Les commerces et services',
        lessonSlug: 'metiers-2',
        lessonSubtitle: 'Les gens du quartier',
        order: 2,
        words: [
            { darija: 'البقال', latin: 'lbqqal', fr: "L'épicier", example_d: 'البقال عنده كل شي', example_f: "L'épicier a tout" },
            { darija: 'الحلاق', latin: 'lhllaq', fr: 'Le coiffeur', example_d: 'مشيت عند الحلاق', example_f: 'Je suis allé chez le coiffeur' },
            { darija: 'السائق', latin: 'ssayeq', fr: 'Le chauffeur', example_d: 'السائق كيخدم بالطاكسي', example_f: 'Le chauffeur travaille en taxi' },
            { darija: 'الفلاح', latin: 'lfllah', fr: "L'agriculteur", example_d: 'الفلاح كيزرع القمح', example_f: "L'agriculteur cultive le blé" },
            { darija: 'الصانع', latin: 'SSane3', fr: "L'artisan", example_d: 'الصانع كيدير الزرابي', example_f: "L'artisan fabrique des tapis" },
            { darija: 'التاجر', latin: 'ttajer', fr: 'Le commerçant', example_d: 'التاجر فالسوق', example_f: 'Le commerçant est au marché' },
        ],
    },
];
// ─── DONNÉES : LES JOURS ET MOIS ─────────────────────────────────────────────
const JOURS_MOIS_GROUPS = [
    {
        lessonTitle: 'Les jours de la semaine',
        lessonSlug: 'jours-1',
        lessonSubtitle: 'Organiser sa semaine',
        order: 1,
        words: [
            { darija: 'الاثنين', latin: 'letnin', fr: 'Lundi', example_d: 'الاثنين نبدا الخدمة', example_f: 'Le lundi je commence le travail' },
            { darija: 'الثلاثاء', latin: 'ttlata', fr: 'Mardi', example_d: 'الثلاثاء عندي موعد', example_f: "Mardi j'ai un rendez-vous" },
            { darija: 'الأربعاء', latin: 'larb3a', fr: 'Mercredi', example_d: 'الأربعاء نعطي الدرس', example_f: 'Mercredi je donne le cours' },
            { darija: 'الخميس', latin: 'lkhmiss', fr: 'Jeudi', example_d: 'الخميس نروح للسوق', example_f: 'Le jeudi je vais au marché' },
            { darija: 'الجمعة', latin: 'ljjem3a', fr: 'Vendredi', example_d: 'الجمعة نصلي فالمسجد', example_f: 'Le vendredi je prie à la mosquée' },
            { darija: 'السبت', latin: 'ssebt', fr: 'Samedi', example_d: 'السبت نرتاح', example_f: 'Le samedi je me repose' },
            { darija: 'الأحد', latin: 'lhhed', fr: 'Dimanche', example_d: 'الأحد مع العائلة', example_f: 'Le dimanche avec la famille' },
        ],
    },
    {
        lessonTitle: "Les mois et les saisons",
        lessonSlug: 'jours-2',
        lessonSubtitle: "L'année en darija",
        order: 2,
        words: [
            { darija: 'يناير', latin: 'yanayir', fr: 'Janvier', example_d: 'يناير بارد بزاف فالمغرب', example_f: 'Janvier est très froid au Maroc' },
            { darija: 'أبريل', latin: 'abril', fr: 'Avril', example_d: 'أبريل وقت الربيع', example_f: "Avril c'est le printemps" },
            { darija: 'يوليوز', latin: 'yuliyuz', fr: 'Juillet', example_d: 'يوليوز سخون بزاف', example_f: 'Juillet est très chaud' },
            { darija: 'دجنبر', latin: 'dujanbir', fr: 'Décembre', example_d: 'دجنبر آخر شهر فالسنة', example_f: "Décembre c'est le dernier mois" },
            { darija: 'الصيف', latin: 'ssef', fr: "L'été", example_d: 'الصيف كنمشيو للبحر', example_f: "En été on va à la mer" },
            { darija: 'الشتا', latin: 'chta', fr: "L'hiver", example_d: 'الشتا كيتساقط الثلج', example_f: "En hiver il neige" },
        ],
    },
];
// ─── DONNÉES : LE MARCHÉ ──────────────────────────────────────────────────────
const MARCHE_GROUPS = [
    {
        lessonTitle: 'Au marché',
        lessonSlug: 'marche-1',
        lessonSubtitle: 'Faire ses courses',
        order: 1,
        words: [
            { darija: 'السوق', latin: 'ssuq', fr: 'Le marché', example_d: 'مشيت للسوق الصباح', example_f: 'Je suis allé au marché ce matin' },
            { darija: 'الدرهم', latin: 'ddrhem', fr: 'Le dirham', example_d: 'بيعو بعشرة دراهم', example_f: 'Vendu à dix dirhams' },
            { darija: 'الثمن', latin: 'ttemn', fr: 'Le prix', example_d: 'شحال الثمن ديالو؟', example_f: 'Quel est son prix ?' },
            { darija: 'غالي', latin: 'ghali', fr: 'Cher', example_d: 'هاد الجبة غالية بزاف', example_f: 'Cette robe est trop chère' },
            { darija: 'رخيص', latin: 'rkhis', fr: 'Pas cher', example_d: 'هادشي رخيص', example_f: "C'est pas cher" },
            { darija: 'كيلو', latin: 'kilu', fr: 'Un kilo', example_d: 'عطيني واحد كيلو عفاك', example_f: "Donne-moi un kilo s'il te plaît" },
        ],
    },
    {
        lessonTitle: 'Négocier et payer',
        lessonSlug: 'marche-2',
        lessonSubtitle: 'Marchander en darija',
        order: 2,
        words: [
            { darija: 'قلل', latin: 'qlell', fr: 'Baisser le prix', example_d: 'قلل شوية عفاك', example_f: "Baisse un peu s'il te plaît" },
            { darija: 'الحساب', latin: 'lhssab', fr: "L'addition", example_d: 'عطني الحساب عفاك', example_f: "Donne-moi l'addition" },
            { darija: 'مزيان', latin: 'mzyan', fr: 'Bien / Bon', example_d: 'هادشي مزيان بزاف', example_f: "C'est vraiment bien" },
            { darija: 'أحسن', latin: 'ahsen', fr: 'Meilleur', example_d: 'هادا أحسن من ذاك', example_f: "Celui-là est meilleur" },
            { darija: 'عندك', latin: '3endek', fr: 'Est-ce que tu as', example_d: 'عندك الحجم الكبير؟', example_f: 'Tu as la grande taille ?' },
            { darija: 'خلصت', latin: 'khlesst', fr: "J'ai payé", example_d: 'خلصت بالكاش', example_f: "J'ai payé en espèces" },
        ],
    },
];
// ─── DONNÉES : LES TRANSPORTS ─────────────────────────────────────────────────
const TRANSPORTS_GROUPS = [
    {
        lessonTitle: 'Les moyens de transport',
        lessonSlug: 'transports-1',
        lessonSubtitle: 'Se déplacer au Maroc',
        order: 1,
        words: [
            { darija: 'الطوموبيل', latin: 'TTumubil', fr: 'La voiture', example_d: 'عندي طوموبيل جديدة', example_f: "J'ai une nouvelle voiture" },
            { darija: 'الطاكسي', latin: 'TTaksi', fr: 'Le taxi', example_d: 'خدت طاكسي للمدينة', example_f: "J'ai pris un taxi pour la ville" },
            { darija: 'الطوبيس', latin: 'TTubis', fr: 'Le bus', example_d: 'الطوبيس تأخر', example_f: 'Le bus est en retard' },
            { darija: 'القطر', latin: 'lqTTar', fr: 'Le train', example_d: 'القطر أسرع من الطوبيس', example_f: 'Le train est plus rapide que le bus' },
            { darija: 'الطيارة', latin: 'TTiyara', fr: "L'avion", example_d: 'ركبت الطيارة لأول مرة', example_f: "J'ai pris l'avion pour la première fois" },
            { darija: 'الدراجة', latin: 'draja', fr: 'Le vélo', example_d: 'كنركب الدراجة للخدمة', example_f: 'Je vais au travail à vélo' },
        ],
    },
    {
        lessonTitle: 'Se déplacer en ville',
        lessonSlug: 'transports-2',
        lessonSubtitle: "S'orienter et bouger",
        order: 2,
        words: [
            { darija: 'يمين', latin: 'limin', fr: 'À droite', example_d: 'دوز من اليمين', example_f: 'Passe à droite' },
            { darija: 'يسار', latin: 'lissr', fr: 'À gauche', example_d: 'خد من اليسار', example_f: 'Prends à gauche' },
            { darija: 'نيشان', latin: 'nichane', fr: 'Tout droit', example_d: 'سير نيشان', example_f: 'Vas tout droit' },
            { darija: 'قريب', latin: 'qrib', fr: 'Près / Proche', example_d: 'المحطة قريبة من هنا', example_f: 'La gare est proche' },
            { darija: 'بعيد', latin: 'b3id', fr: 'Loin', example_d: 'المدينة بعيدة', example_f: 'La ville est loin' },
            { darija: 'وقف', latin: 'wqef', fr: "S'arrêter", example_d: 'وقف هنا عفاك', example_f: "Arrête-toi ici s'il te plaît" },
        ],
    },
];
// ─── DONNÉES : LES ÉMOTIONS ───────────────────────────────────────────────────
const EMOTIONS_GROUPS = [
    {
        lessonTitle: 'Les émotions de base',
        lessonSlug: 'emotions-1',
        lessonSubtitle: 'Exprimer ce qu\'on ressent',
        order: 1,
        words: [
            { darija: 'فرحان', latin: 'frhan', fr: 'Content / Heureux', example_d: 'أنا فرحان بزاف اليوم', example_f: "Je suis très content aujourd'hui" },
            { darija: 'حزين', latin: 'hzin', fr: 'Triste', example_d: 'علاش حزين؟', example_f: 'Pourquoi tu es triste ?' },
            { darija: 'معصب', latin: 'm3sseb', fr: 'En colère', example_d: 'ماتكونش معصب', example_f: 'Ne sois pas énervé' },
            { darija: 'خايف', latin: 'khayef', fr: 'Effrayé / Peureux', example_d: 'خايف من الظلام', example_f: "J'ai peur du noir" },
            { darija: 'تعبان', latin: 't3ban', fr: 'Fatigué', example_d: 'تعبان من الخدمة', example_f: 'Fatigué du travail' },
            { darija: 'مبسوط', latin: 'mabsut', fr: 'Satisfait / À l\'aise', example_d: 'مبسوط فالدار', example_f: "Je suis à l'aise à la maison" },
        ],
    },
    {
        lessonTitle: 'Dire ce qu\'on aime',
        lessonSlug: 'emotions-2',
        lessonSubtitle: 'Exprimer ses goûts',
        order: 2,
        words: [
            { darija: 'كنحب', latin: 'knhebb', fr: "J'aime", example_d: 'كنحب الكسكس', example_f: "J'aime le couscous" },
            { darija: 'ما كنحبش', latin: 'ma knhebbch', fr: "Je n'aime pas", example_d: 'ما كنحبش البرد', example_f: "Je n'aime pas le froid" },
            { darija: 'بغيت', latin: 'bghit', fr: 'Je veux', example_d: 'بغيت نمشي للبحر', example_f: 'Je veux aller à la mer' },
            { darija: 'ما بغيتش', latin: 'ma bghitch', fr: 'Je ne veux pas', example_d: 'ما بغيتش نصحى بكري', example_f: 'Je ne veux pas me lever tôt' },
            { darija: 'زعفت', latin: 'z3eft', fr: 'Je me suis énervé', example_d: 'زعفت على خويا', example_f: 'Je me suis énervé contre mon frère' },
            { darija: 'تهنيت', latin: 'thnnit', fr: 'Je me suis reposé', example_d: 'تهنيت فالعطلة', example_f: 'Je me suis reposé en vacances' },
        ],
    },
];
// ─── DONNÉES : LA SANTÉ ───────────────────────────────────────────────────────
const SANTE_GROUPS = [
    {
        lessonTitle: 'Chez le médecin',
        lessonSlug: 'sante-1',
        lessonSubtitle: 'Décrire sa maladie',
        order: 1,
        words: [
            { darija: 'مريض', latin: 'mrid', fr: 'Malade', example_d: 'أنا مريض اليوم', example_f: "Je suis malade aujourd'hui" },
            { darija: 'الحمى', latin: 'lhmma', fr: 'La fièvre', example_d: 'عندي الحمى', example_f: "J'ai de la fièvre" },
            { darija: 'كيوجع', latin: 'kywje3', fr: 'Ça fait mal', example_d: 'راسي كيوجع', example_f: "J'ai mal à la tête" },
            { darija: 'الدواء', latin: 'ddwa', fr: 'Le médicament', example_d: 'شرب الدواء ديالك', example_f: 'Prends ton médicament' },
            { darija: 'الصيدلية', latin: 'ssydliya', fr: 'La pharmacie', example_d: 'روح للصيدلية', example_f: 'Va à la pharmacie' },
            { darija: 'السخانة', latin: 'sskhana', fr: 'La température', example_d: 'السخانة ديالك شحال؟', example_f: "C'est quoi ta température ?" },
        ],
    },
    {
        lessonTitle: 'Le bien-être',
        lessonSlug: 'sante-2',
        lessonSubtitle: 'Prendre soin de soi',
        order: 2,
        words: [
            { darija: 'الرياضة', latin: 'rriyaDa', fr: 'Le sport', example_d: 'كندير الرياضة كل صباح', example_f: 'Je fais du sport chaque matin' },
            { darija: 'النوم', latin: 'nnom', fr: 'Le sommeil', example_d: 'النوم مهم للصحة', example_f: 'Le sommeil est important' },
            { darija: 'الصحة', latin: 'sseHa', fr: 'La santé', example_d: 'الصحة أغلى من الذهب', example_f: "La santé vaut plus que l'or" },
            { darija: 'الراحة', latin: 'rraha', fr: 'Le repos', example_d: 'محتاج للراحة', example_f: "J'ai besoin de repos" },
            { darija: 'بصحتك', latin: 'bssHtek', fr: 'À ta santé', example_d: 'بصحتك يا صاحبي', example_f: 'À ta santé mon ami' },
            { darija: 'الحمية', latin: 'lhmiya', fr: 'Le régime', example_d: 'أنا كنتبع حمية', example_f: 'Je fais un régime' },
        ],
    },
];
// ─── SEED : MODULE ALPHABET ───────────────────────────────────────────────────
async function seedAlphabet(langId) {
    console.log('\n  📚 Module: L\'Alphabet...');
    const module = await prisma.module.upsert({
        where: { slug: 'module-alphabet' },
        update: { subtitle: 'Maîtrise les 28 lettres', colorA: '#2a9d8f', colorB: '#21867a', shadowColor: '#1a6b62', isPublished: true },
        create: {
            title: "L'Alphabet Arabe",
            subtitle: 'Maîtrise les 28 lettres',
            description: "Maîtrise les 28 lettres de l'alphabet arabe utilisées en Darija",
            slug: 'module-alphabet',
            level: 1,
            colorA: '#2a9d8f',
            colorB: '#21867a',
            shadowColor: '#1a6b62',
            isPublished: true,
        },
    });
    for (const group of ALPHABET_GROUPS) {
        const lesson = await prisma.lesson.upsert({
            where: { slug: group.lessonSlug },
            update: { isPublished: true },
            create: {
                title: group.lessonTitle,
                slug: group.lessonSlug,
                subtitle: group.lessonSubtitle,
                description: `Apprends ${group.letters.length} lettres arabes : ${group.letters.map((l) => l.arabic).join(' ')}`,
                order: group.order,
                level: 1,
                duration: 300,
                moduleId: module.id,
                languageId: langId,
                isPublished: true,
            },
        });
        // Idempotent : on supprime et recrée les exercices
        await prisma.exercise.deleteMany({ where: { lessonId: lesson.id } });
        for (const letter of group.letters) {
            // Upsert vocabulaire (lettre arabe)
            let vocab = await prisma.vocabulary.findFirst({
                where: { word: letter.arabic, languageId: langId },
            });
            if (!vocab) {
                vocab = await prisma.vocabulary.create({
                    data: {
                        word: letter.arabic,
                        transliteration: letter.latin,
                        translation: { fr: letter.fr },
                        tags: ['alphabet', 'lettre'],
                        languageId: langId,
                    },
                });
            }
            // Exercice 1 — MULTIPLE_CHOICE : lettre arabe → romanisation
            const mcDistractors = pickDistractors(letter, ALL_LETTERS, 3);
            const mcOptions = shuffle([letter, ...mcDistractors]).map((l) => ({
                value: l.latin,
                label: l.latin,
                hint: l.fr,
            }));
            await prisma.exercise.create({
                data: {
                    type: client_1.ExerciseType.MULTIPLE_CHOICE,
                    prompt: 'Comment se prononce cette lettre ?',
                    data: { arabic: letter.arabic, options: mcOptions },
                    answer: { value: letter.latin },
                    points: 10,
                    lessonId: lesson.id,
                    vocabularyId: vocab.id,
                },
            });
            // Exercice 2 — LISTENING : son → identifier la lettre dans une grille
            const listenDistractors = pickDistractors(letter, group.letters, 3);
            const listenOptions = shuffle([letter, ...listenDistractors]).map((l) => ({
                value: l.arabic,
                label: l.arabic,
                latin: l.latin,
            }));
            await prisma.exercise.create({
                data: {
                    type: client_1.ExerciseType.LISTENING,
                    prompt: 'Quelle lettre correspond à ce son ?',
                    data: { text: letter.arabic, lang: 'ar-MA', options: listenOptions },
                    answer: { value: letter.arabic },
                    points: 10,
                    lessonId: lesson.id,
                    vocabularyId: vocab.id,
                },
            });
            // Exercice 3 — FILL_BLANK : romanisation → lettre arabe
            await prisma.exercise.create({
                data: {
                    type: client_1.ExerciseType.FILL_BLANK,
                    prompt: `Écris la lettre qui se prononce "${letter.latin}"`,
                    data: { latin: letter.latin, hint: letter.fr },
                    answer: { value: letter.arabic, accepted: [letter.arabic] },
                    points: 15,
                    lessonId: lesson.id,
                    vocabularyId: vocab.id,
                },
            });
        }
        const exerciseCount = group.letters.length * 3;
        console.log(`    ✓ "${group.lessonTitle}" — ${group.letters.length} lettres, ${exerciseCount} exercices`);
    }
}
async function seedVocabModule(langId, meta, groups) {
    console.log(`\n  📚 Module: ${meta.title}...`);
    const module = await prisma.module.upsert({
        where: { slug: meta.slug },
        update: { isPublished: true },
        create: {
            title: meta.title,
            subtitle: meta.subtitle,
            description: meta.description,
            slug: meta.slug,
            level: meta.level,
            colorA: meta.colorA,
            colorB: meta.colorB,
            shadowColor: meta.shadowColor,
            isPublished: true,
        },
    });
    const allWords = groups.flatMap((g) => g.words);
    for (const group of groups) {
        const lesson = await prisma.lesson.upsert({
            where: { slug: group.lessonSlug },
            update: { isPublished: true },
            create: {
                title: group.lessonTitle,
                slug: group.lessonSlug,
                subtitle: group.lessonSubtitle,
                description: `${group.words.length} mots essentiels en Darija`,
                order: group.order,
                level: meta.level,
                duration: 360,
                moduleId: module.id,
                languageId: langId,
                isPublished: true,
            },
        });
        await prisma.exercise.deleteMany({ where: { lessonId: lesson.id } });
        for (const word of group.words) {
            let vocab = await prisma.vocabulary.findFirst({
                where: { word: word.darija, languageId: langId },
            });
            if (!vocab) {
                vocab = await prisma.vocabulary.create({
                    data: {
                        word: word.darija,
                        transliteration: word.latin,
                        translation: { fr: word.fr },
                        examples: [{ darija: word.example_d, fr: word.example_f }],
                        tags: [meta.slug],
                        languageId: langId,
                    },
                });
            }
            // Exercice 1 — MULTIPLE_CHOICE : darija → français
            const mcDistractors = pickDistractors(word, allWords, 3);
            const mcOptions = shuffle([word, ...mcDistractors]).map((w) => ({
                value: w.fr,
                label: w.fr,
            }));
            await prisma.exercise.create({
                data: {
                    type: client_1.ExerciseType.MULTIPLE_CHOICE,
                    prompt: `Que signifie "${word.darija}" (${word.latin}) ?`,
                    data: { darija: word.darija, latin: word.latin, options: mcOptions },
                    answer: { value: word.fr },
                    points: 10,
                    lessonId: lesson.id,
                    vocabularyId: vocab.id,
                },
            });
            // Exercice 2 — TRANSLATION : français → romanisation darija
            await prisma.exercise.create({
                data: {
                    type: client_1.ExerciseType.TRANSLATION,
                    prompt: `Comment dit-on "${word.fr}" en darija ?`,
                    data: {
                        fr: word.fr,
                        hint: `Commence par "${word.latin.substring(0, 2)}…"`,
                        example: { darija: word.example_d, fr: word.example_f },
                    },
                    answer: { value: word.latin, accepted: [word.latin.toLowerCase(), word.darija] },
                    points: 15,
                    lessonId: lesson.id,
                    vocabularyId: vocab.id,
                },
            });
            // Exercice 3 — LISTENING : son → identifier le mot (QCM)
            const listenDistractors = pickDistractors(word, group.words, 3);
            const listenOptions = shuffle([word, ...listenDistractors]).map((w) => ({
                value: w.fr,
                label: w.fr,
            }));
            await prisma.exercise.create({
                data: {
                    type: client_1.ExerciseType.LISTENING,
                    prompt: 'Quel mot entends-tu ?',
                    data: { text: word.darija, lang: 'ar-MA', options: listenOptions },
                    answer: { value: word.fr },
                    points: 10,
                    lessonId: lesson.id,
                    vocabularyId: vocab.id,
                },
            });
        }
        const exerciseCount = group.words.length * 3;
        console.log(`    ✓ "${group.lessonTitle}" — ${group.words.length} mots, ${exerciseCount} exercices`);
    }
}
// ─── DONNÉES : ALPHABET MSA ──────────────────────────────────────────────────
const MSA_ALPHABET_GROUPS = [
    {
        lessonTitle: 'Les premières lettres',
        lessonSlug: 'msa-alphabet-1',
        lessonSubtitle: 'ا ب ت ث ج',
        order: 1,
        letters: [
            { arabic: 'ا', latin: 'a', fr: "Alif — voyelle longue 'a'" },
            { arabic: 'ب', latin: 'b', fr: "Ba — comme dans 'bateau'" },
            { arabic: 'ت', latin: 't', fr: "Ta — comme dans 'table'" },
            { arabic: 'ث', latin: 'th', fr: "Tha — son 'th' anglais de 'think'" },
            { arabic: 'ج', latin: 'j', fr: "Jim — comme dans 'jardin'" },
        ],
    },
    {
        lessonTitle: 'Sons gutturaux',
        lessonSlug: 'msa-alphabet-2',
        lessonSubtitle: 'ح خ د ذ ر',
        order: 2,
        letters: [
            { arabic: 'ح', latin: 'h', fr: "Ha — h aspiré profond" },
            { arabic: 'خ', latin: 'kh', fr: "Kha — comme le 'ch' allemand" },
            { arabic: 'د', latin: 'd', fr: "Dal — comme dans 'dire'" },
            { arabic: 'ذ', latin: 'dh', fr: "Dhal — son 'th' anglais de 'the'" },
            { arabic: 'ر', latin: 'r', fr: "Ra — r roulé" },
        ],
    },
    {
        lessonTitle: 'Les sifflantes',
        lessonSlug: 'msa-alphabet-3',
        lessonSubtitle: 'ز س ش ص ض',
        order: 3,
        letters: [
            { arabic: 'ز', latin: 'z', fr: "Zay — comme dans 'zéro'" },
            { arabic: 'س', latin: 's', fr: "Sin — comme dans 'soleil'" },
            { arabic: 'ش', latin: 'sh', fr: "Shin — comme dans 'chat'" },
            { arabic: 'ص', latin: 'S', fr: "Sad — s emphatique, profond" },
            { arabic: 'ض', latin: 'D', fr: "Dad — d emphatique, profond" },
        ],
    },
    {
        lessonTitle: 'Les emphatiques',
        lessonSlug: 'msa-alphabet-4',
        lessonSubtitle: 'ط ظ ع غ ف',
        order: 4,
        letters: [
            { arabic: 'ط', latin: 'T', fr: "Tah — t emphatique" },
            { arabic: 'ظ', latin: 'Z', fr: "Zah — z emphatique" },
            { arabic: 'ع', latin: "'", fr: "Ayn — son guttural profond" },
            { arabic: 'غ', latin: 'gh', fr: "Ghayn — r grasseyé" },
            { arabic: 'ف', latin: 'f', fr: "Fa — comme dans 'fleur'" },
        ],
    },
    {
        lessonTitle: "Fin de l'alphabet",
        lessonSlug: 'msa-alphabet-5',
        lessonSubtitle: 'ق ك ل م ن ه و ي',
        order: 5,
        letters: [
            { arabic: 'ق', latin: 'q', fr: "Qaf — k profond guttural" },
            { arabic: 'ك', latin: 'k', fr: "Kaf — comme dans 'café'" },
            { arabic: 'ل', latin: 'l', fr: "Lam — comme dans 'lune'" },
            { arabic: 'م', latin: 'm', fr: "Mim — comme dans 'maison'" },
            { arabic: 'ن', latin: 'n', fr: "Noun — comme dans 'nuit'" },
            { arabic: 'ه', latin: 'h', fr: "Ha — h léger aspiré" },
            { arabic: 'و', latin: 'w', fr: "Waw — w ou voyelle longue 'ou'" },
            { arabic: 'ي', latin: 'y', fr: "Ya — y ou voyelle longue 'i'" },
        ],
    },
];
const ALL_MSA_LETTERS = MSA_ALPHABET_GROUPS.flatMap((g) => g.letters);
async function seedMSAAlphabet(langId) {
    console.log("\n  📖 Module MSA: L'Alphabet Arabe...");
    const module = await prisma.module.upsert({
        where: { slug: 'msa-module-alphabet' },
        update: { isPublished: true },
        create: {
            title: "MSA — L'Alphabet Arabe",
            subtitle: 'Les 28 lettres arabes',
            description: "Maîtrise les 28 lettres de l'alphabet arabe littéraire",
            slug: 'msa-module-alphabet',
            level: 1,
            colorA: '#2a9d8f',
            colorB: '#21867a',
            shadowColor: '#1a6b62',
            isPublished: true,
        },
    });
    for (const group of MSA_ALPHABET_GROUPS) {
        const lesson = await prisma.lesson.upsert({
            where: { slug: group.lessonSlug },
            update: { isPublished: true },
            create: {
                title: group.lessonTitle,
                slug: group.lessonSlug,
                subtitle: group.lessonSubtitle,
                description: `Apprends ${group.letters.length} lettres : ${group.letters.map(l => l.arabic).join(' ')}`,
                order: group.order,
                level: 1,
                duration: 300,
                moduleId: module.id,
                languageId: langId,
                isPublished: true,
            },
        });
        await prisma.exercise.deleteMany({ where: { lessonId: lesson.id } });
        for (const letter of group.letters) {
            let vocab = await prisma.vocabulary.findFirst({
                where: { word: letter.arabic, languageId: langId },
            });
            if (!vocab) {
                vocab = await prisma.vocabulary.create({
                    data: {
                        word: letter.arabic,
                        transliteration: letter.latin,
                        translation: { fr: letter.fr },
                        tags: ['alphabet', 'lettre'],
                        languageId: langId,
                    },
                });
            }
            // Exercice 1 — QCM : lettre arabe → romanisation
            const mcDistractors = pickDistractors(letter, ALL_MSA_LETTERS, 3);
            const mcOptions = shuffle([letter, ...mcDistractors]).map(l => ({
                value: l.latin, label: l.latin, hint: l.fr,
            }));
            await prisma.exercise.create({
                data: {
                    type: client_1.ExerciseType.MULTIPLE_CHOICE,
                    prompt: 'Comment se prononce cette lettre ?',
                    data: { arabic: letter.arabic, options: mcOptions },
                    answer: { value: letter.latin },
                    points: 10,
                    lessonId: lesson.id,
                    vocabularyId: vocab.id,
                },
            });
            // Exercice 2 — LISTENING : son → lettre
            const listenDistractors = pickDistractors(letter, group.letters, 3);
            const listenOptions = shuffle([letter, ...listenDistractors]).map(l => ({
                value: l.arabic, label: l.arabic, latin: l.latin,
            }));
            await prisma.exercise.create({
                data: {
                    type: client_1.ExerciseType.LISTENING,
                    prompt: 'Quelle lettre correspond à ce son ?',
                    data: { text: letter.arabic, lang: 'ar-SA', options: listenOptions },
                    answer: { value: letter.arabic },
                    points: 10,
                    lessonId: lesson.id,
                    vocabularyId: vocab.id,
                },
            });
            // Exercice 3 — FILL_BLANK : romanisation → lettre
            await prisma.exercise.create({
                data: {
                    type: client_1.ExerciseType.FILL_BLANK,
                    prompt: `Écris la lettre qui se prononce "${letter.latin}"`,
                    data: { latin: letter.latin, hint: letter.fr },
                    answer: { value: letter.arabic, accepted: [letter.arabic] },
                    points: 15,
                    lessonId: lesson.id,
                    vocabularyId: vocab.id,
                },
            });
        }
        const count = group.letters.length * 3;
        console.log(`    ✓ "${group.lessonTitle}" — ${group.letters.length} lettres, ${count} exercices`);
    }
}
// ─── DONNÉES : VOCABULAIRE MSA ────────────────────────────────────────────────
const MSA_SALUTATIONS = [
    {
        lessonTitle: 'Salutations de base',
        lessonSlug: 'msa-salutations-1',
        lessonSubtitle: 'السلام عليكم — أهلاً',
        order: 1,
        words: [
            { darija: 'مَرْحَباً', latin: 'marhaban', fr: 'Bonjour / Bienvenue', example_d: 'مَرْحَباً، كَيْفَ حَالُكَ؟', example_f: 'Bonjour, comment vas-tu ?' },
            { darija: 'السَّلَامُ عَلَيْكُمْ', latin: 'assalamu alaykum', fr: 'Paix sur vous (salut)', example_d: 'السَّلَامُ عَلَيْكُمْ يَا أَصْدِقَاء', example_f: 'Paix sur vous les amis' },
            { darija: 'شُكْراً', latin: 'shukran', fr: 'Merci', example_d: 'شُكْراً جَزِيلاً', example_f: 'Merci beaucoup' },
            { darija: 'مِنْ فَضْلِكَ', latin: 'min fadlika', fr: "S'il te plaît", example_d: 'أَعْطِنِي الكِتَابَ مِنْ فَضْلِكَ', example_f: "Donne-moi le livre s'il te plaît" },
            { darija: 'آسِفٌ', latin: 'asif', fr: 'Désolé / Pardon', example_d: 'آسِفٌ، لَمْ أَفْهَمْ', example_f: "Désolé, je n'ai pas compris" },
        ],
    },
    {
        lessonTitle: 'Se présenter',
        lessonSlug: 'msa-salutations-2',
        lessonSubtitle: 'اسمي... أنا من...',
        order: 2,
        words: [
            { darija: 'اِسْمِي', latin: 'ismi', fr: 'Mon nom est', example_d: 'اِسْمِي أَحْمَد', example_f: 'Mon nom est Ahmed' },
            { darija: 'كَيْفَ حَالُكَ؟', latin: 'kayfa haluk', fr: 'Comment vas-tu ?', example_d: 'كَيْفَ حَالُكَ يَا صَدِيقِي؟', example_f: 'Comment vas-tu mon ami ?' },
            { darija: 'بِخَيْرٍ', latin: 'bikhair', fr: 'Bien / Je vais bien', example_d: 'أَنَا بِخَيْرٍ، شُكْراً', example_f: 'Je vais bien, merci' },
            { darija: 'نَعَمْ', latin: "na'am", fr: 'Oui', example_d: 'نَعَمْ، أَفْهَمُ العَرَبِيَّة', example_f: "Oui, je comprends l'arabe" },
            { darija: 'لَا', latin: 'la', fr: 'Non', example_d: 'لَا، لَا أَعْرِفُ', example_f: 'Non, je ne sais pas' },
        ],
    },
];
const MSA_OBJETS = [
    {
        lessonTitle: 'Objets courants',
        lessonSlug: 'msa-objets-1',
        lessonSubtitle: 'كِتَاب — قَلَم — بَاب',
        order: 1,
        words: [
            { darija: 'كِتَابٌ', latin: 'kitab', fr: 'Un livre', example_d: 'هَذَا كِتَابٌ مُفِيدٌ', example_f: 'Ce livre est utile' },
            { darija: 'قَلَمٌ', latin: 'qalam', fr: 'Un stylo', example_d: 'أَحْتَاجُ إِلَى قَلَمٍ', example_f: "J'ai besoin d'un stylo" },
            { darija: 'بَابٌ', latin: 'bab', fr: 'Une porte', example_d: 'البَابُ مَفْتُوحٌ', example_f: 'La porte est ouverte' },
            { darija: 'نَافِذَةٌ', latin: 'nafidha', fr: 'Une fenêtre', example_d: 'النَّافِذَةُ مَكْسُورَةٌ', example_f: 'La fenêtre est cassée' },
            { darija: 'كُرْسِيٌّ', latin: 'kursi', fr: 'Une chaise', example_d: 'الكُرْسِيُّ مُرِيحٌ', example_f: 'La chaise est confortable' },
        ],
    },
    {
        lessonTitle: 'À la maison',
        lessonSlug: 'msa-objets-2',
        lessonSubtitle: 'بَيْت — طَاوِلَة — هَاتِف',
        order: 2,
        words: [
            { darija: 'طَاوِلَةٌ', latin: 'taawila', fr: 'Une table', example_d: 'الطَّاوِلَةُ كَبِيرَةٌ', example_f: 'La table est grande' },
            { darija: 'هَاتِفٌ', latin: 'hatif', fr: 'Un téléphone', example_d: 'هَاتِفِي جَدِيدٌ', example_f: 'Mon téléphone est neuf' },
            { darija: 'بَيْتٌ', latin: 'bayt', fr: 'Une maison', example_d: 'بَيْتُنَا كَبِيرٌ', example_f: 'Notre maison est grande' },
            { darija: 'سَيَّارَةٌ', latin: 'sayyara', fr: 'Une voiture', example_d: 'السَّيَّارَةُ حَمْرَاءُ', example_f: 'La voiture est rouge' },
            { darija: 'مَاءٌ', latin: "ma'", fr: 'De l\'eau', example_d: 'أُرِيدُ كُوبَ مَاءٍ', example_f: "Je veux un verre d'eau" },
        ],
    },
];
const MSA_NOURRITURE = [
    {
        lessonTitle: 'Aliments de base',
        lessonSlug: 'msa-nourriture-1',
        lessonSubtitle: 'خُبْز — تُفَّاح — حَلِيب',
        order: 1,
        words: [
            { darija: 'خُبْزٌ', latin: 'khubz', fr: 'Du pain', example_d: 'الخُبْزُ طَازَجٌ', example_f: 'Le pain est frais' },
            { darija: 'تُفَّاحَةٌ', latin: 'tuffaha', fr: 'Une pomme', example_d: 'التُّفَّاحَةُ حَمْرَاءُ', example_f: 'La pomme est rouge' },
            { darija: 'مَوْزٌ', latin: 'mawz', fr: 'Une banane', example_d: 'أُحِبُّ المَوْزَ', example_f: "J'aime la banane" },
            { darija: 'حَلِيبٌ', latin: 'halib', fr: 'Du lait', example_d: 'الحَلِيبُ مُفِيدٌ لِلصِّحَّة', example_f: 'Le lait est bon pour la santé' },
            { darija: 'شَايٌ', latin: 'shay', fr: 'Du thé', example_d: 'أَشْرَبُ الشَّايَ صَبَاحاً', example_f: 'Je bois le thé le matin' },
        ],
    },
    {
        lessonTitle: 'Repas et boissons',
        lessonSlug: 'msa-nourriture-2',
        lessonSubtitle: 'قَهْوَة — أُرُزّ — لَحْم',
        order: 2,
        words: [
            { darija: 'قَهْوَةٌ', latin: 'qahwa', fr: 'Un café', example_d: 'أُرِيدُ فِنْجَانَ قَهْوَة', example_f: 'Je veux une tasse de café' },
            { darija: 'أُرُزٌّ', latin: 'aruzz', fr: 'Du riz', example_d: 'الأُرُزُّ طَعَامٌ أَسَاسِيٌّ', example_f: 'Le riz est un aliment de base' },
            { darija: 'لَحْمٌ', latin: 'lahm', fr: 'De la viande', example_d: 'أُحِبُّ اللَّحْمَ المَشْوِيَّ', example_f: "J'aime la viande grillée" },
            { darija: 'فَاكِهَةٌ', latin: 'fakiha', fr: 'Un fruit', example_d: 'الفَاكِهَةُ صِحِّيَّةٌ', example_f: 'Les fruits sont sains' },
            { darija: 'خُضَرٌ', latin: 'khudar', fr: 'Des légumes', example_d: 'الخُضَرُ مُفِيدَةٌ لِلجِسْم', example_f: 'Les légumes sont bons pour le corps' },
        ],
    },
];
const MSA_FAMILLE = [
    {
        lessonTitle: 'La famille proche',
        lessonSlug: 'msa-famille-1',
        lessonSubtitle: 'أَب — أُم — أَخ',
        order: 1,
        words: [
            { darija: 'أَبٌ', latin: 'ab', fr: 'Un père', example_d: 'أَبِي طَيِّبٌ جِدًّا', example_f: 'Mon père est très gentil' },
            { darija: 'أُمٌّ', latin: 'umm', fr: 'Une mère', example_d: 'أُمِّي تُحِبُّنِي كَثِيراً', example_f: 'Ma mère m\'aime beaucoup' },
            { darija: 'أَخٌ', latin: 'akh', fr: 'Un frère', example_d: 'لِي أَخٌ كَبِيرٌ', example_f: "J'ai un grand frère" },
            { darija: 'أُخْتٌ', latin: 'ukht', fr: 'Une sœur', example_d: 'أُخْتِي تَدْرُسُ الطِّبَّ', example_f: 'Ma sœur étudie la médecine' },
            { darija: 'ابْنٌ', latin: 'ibn', fr: 'Un fils', example_d: 'هَذَا اِبْنِي الصَّغِير', example_f: 'Voici mon petit fils' },
        ],
    },
    {
        lessonTitle: 'La famille élargie',
        lessonSlug: 'msa-famille-2',
        lessonSubtitle: 'جَد — عَم — خَال',
        order: 2,
        words: [
            { darija: 'جَدٌّ', latin: 'jadd', fr: 'Un grand-père', example_d: 'جَدِّي عُمْرُهُ ثَمَانُونَ', example_f: 'Mon grand-père a quatre-vingts ans' },
            { darija: 'جَدَّةٌ', latin: 'jadda', fr: 'Une grand-mère', example_d: 'جَدَّتِي تَحْكِي قِصَصاً', example_f: 'Ma grand-mère raconte des histoires' },
            { darija: 'عَمٌّ', latin: 'amm', fr: 'Un oncle (paternel)', example_d: 'عَمِّي يَسْكُنُ فِي القَاهِرَة', example_f: 'Mon oncle habite au Caire' },
            { darija: 'خَالٌ', latin: 'khal', fr: 'Un oncle (maternel)', example_d: 'خَالِي طَبِيبٌ مَاهِر', example_f: 'Mon oncle est un médecin habile' },
            { darija: 'بِنْتٌ', latin: 'bint', fr: 'Une fille', example_d: 'بِنْتُهُ تُحِبُّ الرِّسَامَة', example_f: 'Sa fille aime le dessin' },
        ],
    },
];
const MSA_COULEURS = [
    {
        lessonTitle: 'Les couleurs primaires',
        lessonSlug: 'msa-couleurs-1',
        lessonSubtitle: 'أَحْمَر — أَزْرَق — أَخْضَر',
        order: 1,
        words: [
            { darija: 'أَحْمَرُ', latin: 'ahmar', fr: 'Rouge', example_d: 'الوَرْدَةُ حَمْرَاءُ', example_f: 'La rose est rouge' },
            { darija: 'أَزْرَقُ', latin: 'azraq', fr: 'Bleu', example_d: 'السَّمَاءُ زَرْقَاءُ', example_f: 'Le ciel est bleu' },
            { darija: 'أَخْضَرُ', latin: 'akhDar', fr: 'Vert', example_d: 'العُشْبُ أَخْضَرُ', example_f: "L'herbe est verte" },
            { darija: 'أَصْفَرُ', latin: 'asfar', fr: 'Jaune', example_d: 'الشَّمْسُ صَفْرَاءُ', example_f: 'Le soleil est jaune' },
            { darija: 'أَبْيَضُ', latin: 'abyad', fr: 'Blanc', example_d: 'الثَّلْجُ أَبْيَضُ', example_f: 'La neige est blanche' },
        ],
    },
    {
        lessonTitle: 'Plus de couleurs',
        lessonSlug: 'msa-couleurs-2',
        lessonSubtitle: 'أَسْوَد — بُرْتُقَالِي — بَنَفْسَجِي',
        order: 2,
        words: [
            { darija: 'أَسْوَدُ', latin: 'aswad', fr: 'Noir', example_d: 'اللَّيْلُ أَسْوَدُ', example_f: 'La nuit est noire' },
            { darija: 'بُرْتُقَالِيٌّ', latin: 'burtuqali', fr: 'Orange', example_d: 'البُرْتُقَالَةُ لَوْنُهَا بُرْتُقَالِيٌّ', example_f: "L'orange est de couleur orange" },
            { darija: 'بَنَفْسَجِيٌّ', latin: 'banafsaji', fr: 'Violet', example_d: 'الزَّهْرَةُ بَنَفْسَجِيَّة', example_f: 'La fleur est violette' },
            { darija: 'بُنِّيٌّ', latin: 'bunni', fr: 'Marron', example_d: 'الأَرْضُ لَوْنُهَا بُنِّيٌّ', example_f: 'La terre est marron' },
            { darija: 'رَمَادِيٌّ', latin: 'ramadi', fr: 'Gris', example_d: 'الغُيُومُ رَمَادِيَّة', example_f: 'Les nuages sont gris' },
        ],
    },
];
// ─── DONNÉES MSA : LES CHIFFRES ──────────────────────────────────────────────
const MSA_CHIFFRES = [
    {
        lessonTitle: 'Les nombres de 1 à 10',
        lessonSlug: 'msa-chiffres-1',
        lessonSubtitle: 'وَاحِد — اثْنَان — ثَلَاثَة',
        order: 1,
        words: [
            { darija: 'وَاحِدٌ', latin: 'wahid', fr: 'Un (1)', example_d: 'عِنْدِي كِتَابٌ وَاحِدٌ', example_f: "J'ai un seul livre" },
            { darija: 'اثْنَانِ', latin: 'ithnan', fr: 'Deux (2)', example_d: 'عِنْدِي اثْنَانِ مِنَ الأَقْلَام', example_f: "J'ai deux stylos" },
            { darija: 'ثَلَاثَةٌ', latin: 'thalatha', fr: 'Trois (3)', example_d: 'ثَلَاثَةُ أَيَّامٍ', example_f: 'Trois jours' },
            { darija: 'أَرْبَعَةٌ', latin: "arba'a", fr: 'Quatre (4)', example_d: 'أَرْبَعَةُ أَشْخَاصٍ', example_f: 'Quatre personnes' },
            { darija: 'خَمْسَةٌ', latin: 'khamsa', fr: 'Cinq (5)', example_d: 'خَمْسُ دَقَائِقَ', example_f: 'Cinq minutes' },
        ],
    },
    {
        lessonTitle: 'Les nombres de 6 à 10',
        lessonSlug: 'msa-chiffres-2',
        lessonSubtitle: 'سِتَّة — سَبْعَة — عَشَرَة',
        order: 2,
        words: [
            { darija: 'سِتَّةٌ', latin: 'sitta', fr: 'Six (6)', example_d: 'سِتَّةُ أَشْهُرٍ', example_f: 'Six mois' },
            { darija: 'سَبْعَةٌ', latin: "sab'a", fr: 'Sept (7)', example_d: 'سَبْعَةُ أَيَّامٍ فِي الأُسْبُوع', example_f: 'Sept jours dans la semaine' },
            { darija: 'ثَمَانِيَةٌ', latin: 'thamaniya', fr: 'Huit (8)', example_d: 'الدَّرْسُ فِي السَّاعَة الثَّامِنَة', example_f: 'Le cours est à huit heures' },
            { darija: 'تِسْعَةٌ', latin: "tis'a", fr: 'Neuf (9)', example_d: 'تِسْعُ نِقَاطٍ', example_f: 'Neuf points' },
            { darija: 'عَشَرَةٌ', latin: 'ashara', fr: 'Dix (10)', example_d: 'عَشَرَةُ طُلَّابٍ', example_f: 'Dix élèves' },
        ],
    },
];
// ─── DONNÉES MSA : LES ANIMAUX ───────────────────────────────────────────────
const MSA_ANIMAUX = [
    {
        lessonTitle: 'Les animaux domestiques',
        lessonSlug: 'msa-animaux-1',
        lessonSubtitle: 'قِطَّة — كَلْب — حِصَان',
        order: 1,
        words: [
            { darija: 'قِطَّةٌ', latin: 'qitta', fr: 'Un chat', example_d: 'القِطَّةُ تَنَامُ كَثِيراً', example_f: 'Le chat dort beaucoup' },
            { darija: 'كَلْبٌ', latin: 'kalb', fr: 'Un chien', example_d: 'الكَلْبُ وَفِيٌّ', example_f: 'Le chien est fidèle' },
            { darija: 'حِصَانٌ', latin: 'hisan', fr: 'Un cheval', example_d: 'الحِصَانُ سَرِيعٌ', example_f: 'Le cheval est rapide' },
            { darija: 'بَقَرَةٌ', latin: 'baqara', fr: 'Une vache', example_d: 'البَقَرَةُ تُعْطِي الحَلِيبَ', example_f: 'La vache donne du lait' },
            { darija: 'دَجَاجَةٌ', latin: 'dajaja', fr: 'Une poule', example_d: 'الدَّجَاجَةُ تَبِيضُ كُلَّ يَوْم', example_f: 'La poule pond chaque jour' },
        ],
    },
    {
        lessonTitle: 'Les animaux sauvages',
        lessonSlug: 'msa-animaux-2',
        lessonSubtitle: 'أَسَد — فِيل — طَائِر',
        order: 2,
        words: [
            { darija: 'أَسَدٌ', latin: 'asad', fr: 'Un lion', example_d: 'الأَسَدُ مَلِكُ الغَابَة', example_f: 'Le lion est le roi de la forêt' },
            { darija: 'فِيلٌ', latin: 'fil', fr: 'Un éléphant', example_d: 'الفِيلُ حَيَوَانٌ ضَخْم', example_f: "L'éléphant est un animal énorme" },
            { darija: 'طَائِرٌ', latin: "ta'ir", fr: 'Un oiseau', example_d: 'الطَّائِرُ يُغَنِّي صَبَاحاً', example_f: "L'oiseau chante le matin" },
            { darija: 'سَمَكَةٌ', latin: 'samaka', fr: 'Un poisson', example_d: 'السَّمَكَةُ تَعِيشُ فِي المَاء', example_f: 'Le poisson vit dans l\'eau' },
            { darija: 'قِرْدٌ', latin: 'qird', fr: 'Un singe', example_d: 'القِرْدُ ذَكِيٌّ', example_f: 'Le singe est intelligent' },
        ],
    },
];
// ─── DONNÉES MSA : LE CORPS HUMAIN ───────────────────────────────────────────
const MSA_CORPS = [
    {
        lessonTitle: 'Le visage',
        lessonSlug: 'msa-corps-1',
        lessonSubtitle: 'رَأْس — عَيْن — أَنْف',
        order: 1,
        words: [
            { darija: 'رَأْسٌ', latin: "ra's", fr: 'La tête', example_d: 'رَأْسِي يُؤْلِمُنِي', example_f: "J'ai mal à la tête" },
            { darija: 'عَيْنٌ', latin: 'ayn', fr: "L'œil", example_d: 'عَيْنَاهُ جَمِيلَتَان', example_f: 'Ses yeux sont beaux' },
            { darija: 'أَنْفٌ', latin: 'anf', fr: 'Le nez', example_d: 'أَنْفِي مَسْدُودٌ', example_f: 'Mon nez est bouché' },
            { darija: 'فَمٌ', latin: 'fam', fr: 'La bouche', example_d: 'اِفْتَحْ فَمَكَ', example_f: 'Ouvre ta bouche' },
            { darija: 'أُذُنٌ', latin: 'udhun', fr: "L'oreille", example_d: 'أُذُنِي تُؤْلِمُنِي', example_f: 'Mon oreille me fait mal' },
        ],
    },
    {
        lessonTitle: 'Le corps',
        lessonSlug: 'msa-corps-2',
        lessonSubtitle: 'يَد — رِجْل — قَلْب',
        order: 2,
        words: [
            { darija: 'يَدٌ', latin: 'yad', fr: 'La main', example_d: 'اغْسِلْ يَدَيْكَ', example_f: 'Lave tes mains' },
            { darija: 'رِجْلٌ', latin: 'rijl', fr: 'La jambe', example_d: 'رِجْلِي تُؤْلِمُنِي', example_f: 'Ma jambe me fait mal' },
            { darija: 'قَلْبٌ', latin: 'qalb', fr: 'Le cœur', example_d: 'قَلْبُهُ طَيِّبٌ', example_f: 'Il a bon cœur' },
            { darija: 'ظَهْرٌ', latin: 'dhahr', fr: 'Le dos', example_d: 'ظَهْرِي يُؤْلِمُنِي', example_f: "J'ai mal au dos" },
            { darija: 'كَتِفٌ', latin: 'katif', fr: "L'épaule", example_d: 'كَتِفِي يُؤْلِمُنِي', example_f: "Mon épaule me fait mal" },
        ],
    },
];
// ─── DONNÉES MSA : LES MÉTIERS ───────────────────────────────────────────────
const MSA_METIERS = [
    {
        lessonTitle: 'Les métiers courants',
        lessonSlug: 'msa-metiers-1',
        lessonSubtitle: 'طَبِيب — مُعَلِّم — مُهَنْدِس',
        order: 1,
        words: [
            { darija: 'طَبِيبٌ', latin: 'tabib', fr: 'Un médecin', example_d: 'الطَّبِيبُ يُعَالِجُ المَرْضَى', example_f: 'Le médecin soigne les malades' },
            { darija: 'مُعَلِّمٌ', latin: "mu'allim", fr: 'Un enseignant', example_d: 'المُعَلِّمُ يُحِبُّ عَمَلَه', example_f: "L'enseignant aime son travail" },
            { darija: 'مُهَنْدِسٌ', latin: 'muhandis', fr: 'Un ingénieur', example_d: 'أَخِي مُهَنْدِسٌ', example_f: 'Mon frère est ingénieur' },
            { darija: 'طَبَّاخٌ', latin: 'tabbakh', fr: 'Un cuisinier', example_d: 'الطَّبَّاخُ مَاهِرٌ', example_f: 'Le cuisinier est habile' },
            { darija: 'شُرْطِيٌّ', latin: 'shurti', fr: 'Un policier', example_d: 'الشُّرْطِيُّ يَحْمِي المَدِينَة', example_f: 'Le policier protège la ville' },
        ],
    },
    {
        lessonTitle: 'Plus de métiers',
        lessonSlug: 'msa-metiers-2',
        lessonSubtitle: 'فَلَّاح — تَاجِر — سَائِق',
        order: 2,
        words: [
            { darija: 'فَلَّاحٌ', latin: 'fallah', fr: 'Un agriculteur', example_d: 'الفَلَّاحُ يَزْرَعُ القَمْح', example_f: "L'agriculteur cultive le blé" },
            { darija: 'تَاجِرٌ', latin: 'tajir', fr: 'Un commerçant', example_d: 'التَّاجِرُ فِي السُّوق', example_f: 'Le commerçant est au marché' },
            { darija: 'سَائِقٌ', latin: "sa'iq", fr: 'Un chauffeur', example_d: 'السَّائِقُ مَحْتَرِفٌ', example_f: 'Le chauffeur est professionnel' },
            { darija: 'مُمَرِّضَةٌ', latin: 'mumarriDa', fr: 'Une infirmière', example_d: 'المُمَرِّضَةُ لَطِيفَةٌ', example_f: "L'infirmière est gentille" },
            { darija: 'حَلَّاقٌ', latin: 'hallaq', fr: 'Un coiffeur', example_d: 'ذَهَبْتُ إِلَى الحَلَّاق', example_f: 'Je suis allé chez le coiffeur' },
        ],
    },
];
// ─── DONNÉES MSA : LES TRANSPORTS ────────────────────────────────────────────
const MSA_TRANSPORTS = [
    {
        lessonTitle: 'Les moyens de transport',
        lessonSlug: 'msa-transports-1',
        lessonSubtitle: 'سَيَّارَة — قِطَار — طَائِرَة',
        order: 1,
        words: [
            { darija: 'سَيَّارَةٌ', latin: 'sayyara', fr: 'Une voiture', example_d: 'السَّيَّارَةُ سَرِيعَةٌ', example_f: 'La voiture est rapide' },
            { darija: 'قِطَارٌ', latin: 'qitar', fr: 'Un train', example_d: 'القِطَارُ فِي المَحَطَّة', example_f: 'Le train est à la gare' },
            { darija: 'طَائِرَةٌ', latin: "ta'ira", fr: 'Un avion', example_d: 'الطَّائِرَةُ تُقْلِعُ السَّاعَة العَاشِرَة', example_f: "L'avion décolle à dix heures" },
            { darija: 'حَافِلَةٌ', latin: 'hafila', fr: 'Un bus', example_d: 'الحَافِلَةُ مُمْتَلِئَةٌ', example_f: 'Le bus est plein' },
            { darija: 'دَرَّاجَةٌ', latin: 'darraja', fr: 'Un vélo', example_d: 'أَرْكَبُ الدَّرَّاجَة كُلَّ يَوْم', example_f: 'Je fais du vélo chaque jour' },
        ],
    },
    {
        lessonTitle: 'Se déplacer',
        lessonSlug: 'msa-transports-2',
        lessonSubtitle: 'يَمِين — يَسَار — قَرِيب',
        order: 2,
        words: [
            { darija: 'يَمِينٌ', latin: 'yamin', fr: 'Droite', example_d: 'اُدْخُلْ مِنَ اليَمِين', example_f: 'Entre par la droite' },
            { darija: 'يَسَارٌ', latin: 'yasar', fr: 'Gauche', example_d: 'المَدْرَسَةُ عَلَى اليَسَار', example_f: "L'école est à gauche" },
            { darija: 'قَرِيبٌ', latin: 'qarib', fr: 'Proche', example_d: 'البَيْتُ قَرِيبٌ', example_f: 'La maison est proche' },
            { darija: 'بَعِيدٌ', latin: "ba'id", fr: 'Loin', example_d: 'المَدِينَةُ بَعِيدَة', example_f: 'La ville est loin' },
            { darija: 'مُسْتَقِيمٌ', latin: 'mustaqim', fr: 'Tout droit', example_d: 'اِمْشِ مُسْتَقِيماً', example_f: 'Marche tout droit' },
        ],
    },
];
// ─── SEED : MODULE MSA ────────────────────────────────────────────────────────
async function seedMSAModule(langId, meta, groups) {
    console.log(`\n  📖 Module MSA: ${meta.title}...`);
    const module = await prisma.module.upsert({
        where: { slug: meta.slug },
        update: { isPublished: true },
        create: {
            title: meta.title,
            subtitle: meta.subtitle,
            description: meta.description,
            slug: meta.slug,
            level: meta.level,
            colorA: meta.colorA,
            colorB: meta.colorB,
            shadowColor: meta.shadowColor,
            isPublished: true,
        },
    });
    const allWords = groups.flatMap((g) => g.words);
    for (const group of groups) {
        const lesson = await prisma.lesson.upsert({
            where: { slug: group.lessonSlug },
            update: { isPublished: true },
            create: {
                title: group.lessonTitle,
                slug: group.lessonSlug,
                subtitle: group.lessonSubtitle,
                order: group.order,
                level: meta.level,
                duration: 300,
                moduleId: module.id,
                languageId: langId,
                isPublished: true,
            },
        });
        await prisma.exercise.deleteMany({ where: { lessonId: lesson.id } });
        for (const word of group.words) {
            let vocab = await prisma.vocabulary.findFirst({
                where: { word: word.darija, languageId: langId },
            });
            if (!vocab) {
                vocab = await prisma.vocabulary.create({
                    data: {
                        word: word.darija,
                        transliteration: word.latin,
                        translation: { fr: word.fr },
                        examples: [{ darija: word.example_d, fr: word.example_f }],
                        tags: ['msa', 'fus7a'],
                        languageId: langId,
                    },
                });
            }
            // Exercice 1 — MULTIPLE_CHOICE : arabe → français
            const mcDistractors = pickDistractors(word, allWords, 3);
            const mcOptions = shuffle([word, ...mcDistractors]).map((w) => ({
                value: w.fr,
                label: w.fr,
            }));
            await prisma.exercise.create({
                data: {
                    type: client_1.ExerciseType.MULTIPLE_CHOICE,
                    prompt: word.darija,
                    data: { word: word.darija, transliteration: word.latin, options: mcOptions },
                    answer: { value: word.fr },
                    points: 10,
                    lessonId: lesson.id,
                    vocabularyId: vocab.id,
                },
            });
            // Exercice 2 — TRANSLATION : français → translittération
            await prisma.exercise.create({
                data: {
                    type: client_1.ExerciseType.TRANSLATION,
                    prompt: `Comment dit-on "${word.fr}" en arabe ?`,
                    data: { fr: word.fr, hint: word.example_f, example: { darija: word.example_d, fr: word.example_f } },
                    answer: { value: word.latin, accepted: [word.latin.toLowerCase(), word.darija] },
                    points: 15,
                    lessonId: lesson.id,
                    vocabularyId: vocab.id,
                },
            });
            // Exercice 3 — LISTENING : son → identifier le mot
            const listenDistractors = pickDistractors(word, group.words, 3);
            const listenOptions = shuffle([word, ...listenDistractors]).map((w) => ({
                value: w.fr,
                label: w.fr,
            }));
            await prisma.exercise.create({
                data: {
                    type: client_1.ExerciseType.LISTENING,
                    prompt: 'Quel mot entends-tu ?',
                    data: { text: word.darija, lang: 'ar-SA', options: listenOptions },
                    answer: { value: word.fr },
                    points: 10,
                    lessonId: lesson.id,
                    vocabularyId: vocab.id,
                },
            });
        }
        console.log(`    ✓ "${group.lessonTitle}" — ${group.words.length} mots, ${group.words.length * 3} exercices`);
    }
}
// ─── SEED : BADGES ────────────────────────────────────────────────────────────
async function seedBadges() {
    console.log('\n  🏅 Badges...');
    const badges = [
        { key: 'first_lesson', title: 'Première leçon', description: 'Complète ta première leçon', icon: '🎉', points: 10 },
        { key: 'first_module', title: 'Premier module', description: 'Termine un module complet', icon: '🏆', points: 50 },
        { key: 'streak_3', title: 'Série de 3 jours', description: 'Apprends 3 jours de suite', icon: '🔥', points: 20 },
        { key: 'streak_7', title: 'Série de 7 jours', description: 'Apprends 7 jours de suite', icon: '⚡', points: 50 },
        { key: 'streak_30', title: 'Série de 30 jours', description: 'Apprends 30 jours de suite', icon: '💎', points: 200 },
        { key: 'alphabet_done', title: "Maître de l'alphabet", description: "Termine le module Alphabet", icon: '🔤', points: 100 },
        { key: 'perfect_lesson', title: 'Leçon parfaite', description: 'Termine une leçon sans erreur', icon: '⭐', points: 30 },
        { key: 'xp_100', title: '100 XP', description: "Accumule 100 points d'expérience", icon: '✨', points: 15 },
        { key: 'xp_500', title: '500 XP', description: "Accumule 500 points d'expérience", icon: '💫', points: 30 },
        { key: 'xp_1000', title: '1 000 XP', description: "Accumule 1 000 points d'expérience", icon: '🌟', points: 75 },
        { key: 'social_5', title: '5 amis', description: 'Ajoute 5 amis sur DarijaMaroc', icon: '👥', points: 25 },
    ];
    for (const badge of badges) {
        await prisma.badge.upsert({
            where: { key: badge.key },
            update: {},
            create: badge,
        });
    }
    console.log(`    ✓ ${badges.length} badges créés`);
}
// ─── MAIN ─────────────────────────────────────────────────────────────────────
async function main() {
    console.log('\n🌱 Seed DarijaMaroc — démarrage...');
    // Supprimer l'ancien module de démo (seedModules.js)
    const oldModule = await prisma.module.findUnique({ where: { slug: 'seed-escale-tanger' } });
    if (oldModule) {
        await prisma.exercise.deleteMany({ where: { lesson: { moduleId: oldModule.id } } });
        await prisma.lesson.deleteMany({ where: { moduleId: oldModule.id } });
        await prisma.module.delete({ where: { id: oldModule.id } });
        console.log('\n  🗑️  Ancien module "ESCALE À TANGER (seed)" supprimé');
    }
    // Langues
    const langArMA = await prisma.language.upsert({
        where: { code: 'ar-MA' },
        update: {},
        create: { code: 'ar-MA', name: 'Darija marocaine' },
    });
    const langArSA = await prisma.language.upsert({
        where: { code: 'ar-SA' },
        update: {},
        create: { code: 'ar-SA', name: 'Arabe littéraire (MSA)' },
    });
    await prisma.language.upsert({
        where: { code: 'fr' },
        update: {},
        create: { code: 'fr', name: 'Français' },
    });
    console.log('\n  ✓ Langues (ar-MA, ar-SA, fr)');
    // Modules
    await seedAlphabet(langArMA.id);
    await seedVocabModule(langArMA.id, {
        title: 'Les Salutations',
        subtitle: 'Bonjour, merci, au revoir',
        slug: 'module-salutations',
        description: 'Apprends à saluer et à te présenter en Darija',
        level: 1,
        colorA: '#e76f51',
        colorB: '#d4603e',
        shadowColor: '#b84d2c',
    }, SALUTATIONS_GROUPS);
    await seedVocabModule(langArMA.id, {
        title: 'Les Chiffres',
        subtitle: 'Compter de 1 à 100',
        slug: 'module-chiffres',
        description: 'Compte et utilise les nombres en Darija',
        level: 2,
        colorA: '#457b9d',
        colorB: '#366585',
        shadowColor: '#264f6e',
    }, CHIFFRES_GROUPS);
    await seedVocabModule(langArMA.id, {
        title: 'Les Couleurs',
        subtitle: 'Décrire le monde',
        slug: 'module-couleurs',
        description: 'Décris le monde en couleurs avec le Darija',
        level: 2,
        colorA: '#c9941a',
        colorB: '#b07d10',
        shadowColor: '#8a6008',
    }, COULEURS_GROUPS);
    await seedVocabModule(langArMA.id, {
        title: 'La Famille',
        subtitle: 'Parents, frères et cousins',
        slug: 'module-famille',
        description: 'Apprends à parler de ta famille en Darija',
        level: 1,
        colorA: '#e91e8c',
        colorB: '#c41874',
        shadowColor: '#9c1259',
    }, FAMILLE_GROUPS);
    await seedVocabModule(langArMA.id, {
        title: 'La Maison',
        subtitle: 'Pièces et objets du quotidien',
        slug: 'module-maison',
        description: 'Décris ta maison et tes affaires en Darija',
        level: 2,
        colorA: '#ff5722',
        colorB: '#e64a19',
        shadowColor: '#bf360c',
    }, MAISON_GROUPS);
    await seedVocabModule(langArMA.id, {
        title: 'La Nourriture',
        subtitle: 'Plats, fruits et boissons',
        slug: 'module-nourriture',
        description: 'Parle de cuisine et de nourriture marocaine',
        level: 2,
        colorA: '#43a047',
        colorB: '#388e3c',
        shadowColor: '#2e7d32',
    }, NOURRITURE_GROUPS);
    await seedVocabModule(langArMA.id, {
        title: 'Les Animaux',
        subtitle: 'Domestiques et sauvages',
        slug: 'module-animaux',
        description: 'Découvre le monde animal en Darija',
        level: 2,
        colorA: '#795548',
        colorB: '#6d4c41',
        shadowColor: '#4e342e',
    }, ANIMAUX_GROUPS);
    await seedVocabModule(langArMA.id, {
        title: 'Le Corps Humain',
        subtitle: 'Tête, membres et organes',
        slug: 'module-corps',
        description: 'Apprends à nommer les parties du corps en Darija',
        level: 2,
        colorA: '#e53935',
        colorB: '#c62828',
        shadowColor: '#b71c1c',
    }, CORPS_GROUPS);
    await seedVocabModule(langArMA.id, {
        title: 'Les Vêtements',
        subtitle: "S'habiller en darija",
        slug: 'module-vetements',
        description: 'Parle de mode et de vêtements en Darija',
        level: 2,
        colorA: '#8e24aa',
        colorB: '#7b1fa2',
        shadowColor: '#6a1b9a',
    }, VETEMENTS_GROUPS);
    await seedVocabModule(langArMA.id, {
        title: 'Les Métiers',
        subtitle: 'Professions et commerces',
        slug: 'module-metiers',
        description: 'Parle des métiers et du travail en Darija',
        level: 3,
        colorA: '#1e88e5',
        colorB: '#1565c0',
        shadowColor: '#0d47a1',
    }, METIERS_GROUPS);
    await seedVocabModule(langArMA.id, {
        title: 'Jours et Mois',
        subtitle: 'Semaine, mois et saisons',
        slug: 'module-jours-mois',
        description: 'Organise ton temps en Darija',
        level: 1,
        colorA: '#3949ab',
        colorB: '#283593',
        shadowColor: '#1a237e',
    }, JOURS_MOIS_GROUPS);
    await seedVocabModule(langArMA.id, {
        title: 'Le Marché',
        subtitle: 'Acheter, négocier, payer',
        slug: 'module-marche',
        description: 'Fais tes courses et marchande en Darija',
        level: 2,
        colorA: '#f57f17',
        colorB: '#e65100',
        shadowColor: '#bf360c',
    }, MARCHE_GROUPS);
    await seedVocabModule(langArMA.id, {
        title: 'Les Transports',
        subtitle: 'Se déplacer au Maroc',
        slug: 'module-transports',
        description: 'Voyage et oriente-toi en Darija',
        level: 2,
        colorA: '#00897b',
        colorB: '#00695c',
        shadowColor: '#004d40',
    }, TRANSPORTS_GROUPS);
    await seedVocabModule(langArMA.id, {
        title: 'Les Émotions',
        subtitle: 'Sentiments et ressentis',
        slug: 'module-emotions',
        description: 'Exprime tes émotions en Darija',
        level: 2,
        colorA: '#d81b60',
        colorB: '#ad1457',
        shadowColor: '#880e4f',
    }, EMOTIONS_GROUPS);
    await seedVocabModule(langArMA.id, {
        title: 'La Santé',
        subtitle: 'Corps, maladie et bien-être',
        slug: 'module-sante',
        description: 'Parle de santé et de bien-être en Darija',
        level: 3,
        colorA: '#00acc1',
        colorB: '#00838f',
        shadowColor: '#006064',
    }, SANTE_GROUPS);
    // ── Modules MSA (Arabe Littéraire) ──
    console.log('\n\n📖 Parcours MSA — Arabe Littéraire');
    // Section 1 — L'Alphabet (doit être le PREMIER module MSA)
    await seedMSAAlphabet(langArSA.id);
    await seedMSAModule(langArSA.id, {
        title: 'MSA — Salutations',
        subtitle: 'Bonjour, merci, au revoir',
        slug: 'msa-module-salutations',
        description: "Les bases pour saluer et se présenter en arabe littéraire",
        level: 1,
        colorA: '#1565c0',
        colorB: '#0d47a1',
        shadowColor: '#0a3880',
    }, MSA_SALUTATIONS);
    await seedMSAModule(langArSA.id, {
        title: 'MSA — Objets du quotidien',
        subtitle: 'Livre, porte, maison...',
        slug: 'msa-module-objets',
        description: "Nommer les objets courants en arabe littéraire",
        level: 1,
        colorA: '#00838f',
        colorB: '#006064',
        shadowColor: '#004d40',
    }, MSA_OBJETS);
    await seedMSAModule(langArSA.id, {
        title: 'MSA — La Nourriture',
        subtitle: 'Pain, fruits, boissons',
        slug: 'msa-module-nourriture',
        description: "Vocabulaire alimentaire en arabe littéraire",
        level: 1,
        colorA: '#2e7d32',
        colorB: '#1b5e20',
        shadowColor: '#144d18',
    }, MSA_NOURRITURE);
    await seedMSAModule(langArSA.id, {
        title: 'MSA — La Famille',
        subtitle: 'Père, mère, frères...',
        slug: 'msa-module-famille',
        description: "Parler de sa famille en arabe littéraire",
        level: 1,
        colorA: '#ad1457',
        colorB: '#880e4f',
        shadowColor: '#6d0c3e',
    }, MSA_FAMILLE);
    await seedMSAModule(langArSA.id, {
        title: 'MSA — Les Couleurs',
        subtitle: 'Rouge, bleu, vert...',
        slug: 'msa-module-couleurs',
        description: "Les couleurs en arabe littéraire",
        level: 2,
        colorA: '#e65100',
        colorB: '#bf360c',
        shadowColor: '#992b0a',
    }, MSA_COULEURS);
    await seedMSAModule(langArSA.id, {
        title: 'MSA — Les Chiffres',
        subtitle: 'Compter de 1 à 10',
        slug: 'msa-module-chiffres',
        description: "Les nombres en arabe littéraire",
        level: 1,
        colorA: '#c9941a',
        colorB: '#a67a10',
        shadowColor: '#8a6508',
    }, MSA_CHIFFRES);
    await seedMSAModule(langArSA.id, {
        title: 'MSA — Les Animaux',
        subtitle: 'Chat, lion, oiseau...',
        slug: 'msa-module-animaux',
        description: "Les animaux en arabe littéraire",
        level: 2,
        colorA: '#6a994e',
        colorB: '#4a7a2e',
        shadowColor: '#3a6420',
    }, MSA_ANIMAUX);
    await seedMSAModule(langArSA.id, {
        title: 'MSA — Le Corps Humain',
        subtitle: 'Tête, main, cœur...',
        slug: 'msa-module-corps',
        description: "Le corps humain en arabe littéraire",
        level: 2,
        colorA: '#e07a8e',
        colorB: '#c05a6e',
        shadowColor: '#a04858',
    }, MSA_CORPS);
    await seedMSAModule(langArSA.id, {
        title: 'MSA — Les Métiers',
        subtitle: 'Médecin, enseignant...',
        slug: 'msa-module-metiers',
        description: "Les métiers en arabe littéraire",
        level: 2,
        colorA: '#2d6a4f',
        colorB: '#1b503a',
        shadowColor: '#14402e',
    }, MSA_METIERS);
    await seedMSAModule(langArSA.id, {
        title: 'MSA — Les Transports',
        subtitle: 'Voiture, train, avion...',
        slug: 'msa-module-transports',
        description: "Se déplacer en arabe littéraire",
        level: 3,
        colorA: '#4a6fa5',
        colorB: '#3a5a8a',
        shadowColor: '#2e4a72',
    }, MSA_TRANSPORTS);
    await seedBadges();
    console.log('\n  ✓ Tous les modules seedés avec leurs couleurs');
    // Résumé final
    const [modules, lessons, exercises, vocabulary, badges] = await Promise.all([
        prisma.module.count(),
        prisma.lesson.count(),
        prisma.exercise.count(),
        prisma.vocabulary.count(),
        prisma.badge.count(),
    ]);
    console.log('\n─────────────────────────────────────');
    console.log('📊 Base de données peuplée :');
    console.log(`   • ${modules}   modules`);
    console.log(`   • ${lessons}  leçons`);
    console.log(`   • ${exercises} exercices`);
    console.log(`   • ${vocabulary}  mots de vocabulaire`);
    console.log(`   • ${badges}   badges`);
    console.log('─────────────────────────────────────');
    console.log('\n✅ Seed terminé avec succès !\n');
}
main()
    .catch((e) => {
    console.error('\n❌ Seed échoué :', e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
