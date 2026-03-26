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
    await prisma.language.upsert({
        where: { code: 'fr' },
        update: {},
        create: { code: 'fr', name: 'Français' },
    });
    console.log('\n  ✓ Langues (ar-MA, fr)');
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
    await seedBadges();
    // Forcer les couleurs et subtitles via SQL (bypasse les problèmes de cache client Prisma)
    await prisma.$executeRawUnsafe(`
    UPDATE "Module" SET
      "colorA"      = CASE slug
        WHEN 'module-alphabet'    THEN '#2a9d8f'
        WHEN 'module-salutations' THEN '#e76f51'
        WHEN 'module-chiffres'    THEN '#457b9d'
        WHEN 'module-couleurs'    THEN '#c9941a'
      END,
      "colorB"      = CASE slug
        WHEN 'module-alphabet'    THEN '#21867a'
        WHEN 'module-salutations' THEN '#d4603e'
        WHEN 'module-chiffres'    THEN '#366585'
        WHEN 'module-couleurs'    THEN '#b07d10'
      END,
      "shadowColor" = CASE slug
        WHEN 'module-alphabet'    THEN '#1a6b62'
        WHEN 'module-salutations' THEN '#b84d2c'
        WHEN 'module-chiffres'    THEN '#264f6e'
        WHEN 'module-couleurs'    THEN '#8a6008'
      END,
      "subtitle"    = CASE slug
        WHEN 'module-alphabet'    THEN 'Maîtrise les 28 lettres'
        WHEN 'module-salutations' THEN 'Bonjour, merci, au revoir'
        WHEN 'module-chiffres'    THEN 'Compter de 1 à 100'
        WHEN 'module-couleurs'    THEN 'Décrire le monde'
      END
    WHERE slug IN ('module-alphabet','module-salutations','module-chiffres','module-couleurs')
  `);
    console.log('\n  ✓ Couleurs et subtitles mis à jour');
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
