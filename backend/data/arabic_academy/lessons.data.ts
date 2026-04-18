/**
 * Données extraites de /Users/lazaar/arabic/prisma/seed.ts (arabic-quran-academy).
 * Utilisées par scripts/importArabicAcademy.ts pour alimenter la piste MSA de DarijaMaroc.
 */

export type SectionInput = { type: string; content: Record<string, any> }

export interface LessonSeed {
  themeSlug: string
  slug: string
  title: string
  description?: string
  icon?: string
  level: 'basic' | 'intermediate' | 'advanced'
  order: number
  isLocked?: boolean
  sections?: SectionInput[]
}

// ── Themes (deviendront des modules msa-academy-*) ────────────────────────
export const themeSeeds = [
  { name: 'arabic', title: 'Arabic', description: 'Letters, words & stories', sortOrder: 1 },
  { name: 'islamic', title: 'Islamic', description: 'Values, stories & duas', sortOrder: 2 },
  { name: 'quran', title: 'Quran', description: 'Memorize with Tajweed', sortOrder: 3 },
  { name: 'others', title: 'Others', description: 'Games, crafts & more', sortOrder: 4 },
] as const

// ── Alphabet ──────────────────────────────────────────────────────────────
interface AlphabetLetter {
  letter: string; name: string; trans: string
  forms: [string, string, string]
  word: string; meaning: string; emoji: string
  tracingPoints: Array<{ x: number; y: number }>
}

const SHAPE = {
  vertical: [{ x: 50, y: 18 }, { x: 50, y: 40 }, { x: 50, y: 62 }, { x: 50, y: 85 }],
  bowl: [{ x: 78, y: 42 }, { x: 62, y: 58 }, { x: 50, y: 62 }, { x: 38, y: 58 }, { x: 22, y: 42 }],
  camShape: [{ x: 72, y: 30 }, { x: 62, y: 45 }, { x: 50, y: 58 }, { x: 35, y: 68 }, { x: 22, y: 55 }],
  dalShape: [{ x: 68, y: 32 }, { x: 68, y: 50 }, { x: 52, y: 60 }, { x: 35, y: 62 }],
  raShape: [{ x: 65, y: 32 }, { x: 58, y: 50 }, { x: 45, y: 65 }, { x: 32, y: 78 }],
  humps: [{ x: 80, y: 48 }, { x: 68, y: 58 }, { x: 58, y: 48 }, { x: 46, y: 58 }, { x: 35, y: 48 }, { x: 22, y: 58 }],
  sadShape: [{ x: 80, y: 40 }, { x: 68, y: 55 }, { x: 52, y: 58 }, { x: 35, y: 52 }, { x: 25, y: 38 }, { x: 32, y: 68 }, { x: 20, y: 78 }],
  taaEmphatic: [{ x: 72, y: 20 }, { x: 72, y: 55 }, { x: 55, y: 65 }, { x: 35, y: 60 }, { x: 25, y: 45 }],
  ainShape: [{ x: 72, y: 28 }, { x: 60, y: 42 }, { x: 52, y: 58 }, { x: 38, y: 68 }, { x: 25, y: 58 }],
  faaShape: [{ x: 68, y: 32 }, { x: 72, y: 48 }, { x: 60, y: 58 }, { x: 45, y: 55 }, { x: 32, y: 68 }],
  kafShape: [{ x: 78, y: 25 }, { x: 60, y: 35 }, { x: 55, y: 55 }, { x: 40, y: 55 }, { x: 28, y: 48 }, { x: 28, y: 68 }],
  lamShape: [{ x: 60, y: 20 }, { x: 58, y: 40 }, { x: 55, y: 58 }, { x: 48, y: 72 }, { x: 35, y: 85 }],
  mimShape: [{ x: 65, y: 35 }, { x: 72, y: 48 }, { x: 62, y: 58 }, { x: 48, y: 55 }, { x: 42, y: 72 }, { x: 48, y: 90 }],
  haaSoftShape: [{ x: 60, y: 38 }, { x: 68, y: 50 }, { x: 58, y: 62 }, { x: 42, y: 58 }, { x: 50, y: 42 }],
  wawShape: [{ x: 58, y: 28 }, { x: 70, y: 42 }, { x: 58, y: 52 }, { x: 42, y: 48 }, { x: 52, y: 65 }, { x: 55, y: 85 }],
} as const

const ALPHABET_LETTERS: AlphabetLetter[] = [
  { letter: 'ا', name: 'أَلِفٌ', trans: 'alif', forms: ['أَ','إِ','أُ'], word: 'أَسَدٌ', meaning: 'lion', emoji: '🦁', tracingPoints: [...SHAPE.vertical] },
  { letter: 'ب', name: 'بَاءٌ', trans: 'baa', forms: ['بَ','بِ','بُ'], word: 'بَطَّةٌ', meaning: 'duck', emoji: '🦆', tracingPoints: [...SHAPE.bowl] },
  { letter: 'ت', name: 'تَاءٌ', trans: 'taa', forms: ['تَ','تِ','تُ'], word: 'تُفَّاحَةٌ', meaning: 'apple', emoji: '🍎', tracingPoints: [...SHAPE.bowl] },
  { letter: 'ث', name: 'ثَاءٌ', trans: 'thaa', forms: ['ثَ','ثِ','ثُ'], word: 'ثَعْلَبٌ', meaning: 'fox', emoji: '🦊', tracingPoints: [...SHAPE.bowl] },
  { letter: 'ج', name: 'جِيمٌ', trans: 'jim', forms: ['جَ','جِ','جُ'], word: 'جَمَلٌ', meaning: 'camel', emoji: '🐪', tracingPoints: [...SHAPE.camShape] },
  { letter: 'ح', name: 'حَاءٌ', trans: 'haa', forms: ['حَ','حِ','حُ'], word: 'حِصَانٌ', meaning: 'horse', emoji: '🐎', tracingPoints: [...SHAPE.camShape] },
  { letter: 'خ', name: 'خَاءٌ', trans: 'khaa', forms: ['خَ','خِ','خُ'], word: 'خُبْزٌ', meaning: 'bread', emoji: '🍞', tracingPoints: [...SHAPE.camShape] },
  { letter: 'د', name: 'دَالٌ', trans: 'dal', forms: ['دَ','دِ','دُ'], word: 'دُبٌّ', meaning: 'bear', emoji: '🐻', tracingPoints: [...SHAPE.dalShape] },
  { letter: 'ذ', name: 'ذَالٌ', trans: 'dhal', forms: ['ذَ','ذِ','ذُ'], word: 'ذِئْبٌ', meaning: 'wolf', emoji: '🐺', tracingPoints: [...SHAPE.dalShape] },
  { letter: 'ر', name: 'رَاءٌ', trans: 'ra', forms: ['رَ','رِ','رُ'], word: 'رُمَّانٌ', meaning: 'pomegranate', emoji: '🍎', tracingPoints: [...SHAPE.raShape] },
  { letter: 'ز', name: 'زَايٌ', trans: 'zay', forms: ['زَ','زِ','زُ'], word: 'زَرَافَةٌ', meaning: 'giraffe', emoji: '🦒', tracingPoints: [...SHAPE.raShape] },
  { letter: 'س', name: 'سِينٌ', trans: 'sin', forms: ['سَ','سِ','سُ'], word: 'سَمَكَةٌ', meaning: 'fish', emoji: '🐟', tracingPoints: [...SHAPE.humps] },
  { letter: 'ش', name: 'شِينٌ', trans: 'shin', forms: ['شَ','شِ','شُ'], word: 'شَمْسٌ', meaning: 'sun', emoji: '☀️', tracingPoints: [...SHAPE.humps] },
  { letter: 'ص', name: 'صَادٌ', trans: 'sad', forms: ['صَ','صِ','صُ'], word: 'صَقْرٌ', meaning: 'falcon', emoji: '🦅', tracingPoints: [...SHAPE.sadShape] },
  { letter: 'ض', name: 'ضَادٌ', trans: 'dad', forms: ['ضَ','ضِ','ضُ'], word: 'ضِفْدَعٌ', meaning: 'frog', emoji: '🐸', tracingPoints: [...SHAPE.sadShape] },
  { letter: 'ط', name: 'طَاءٌ', trans: 'taa-emphatic', forms: ['طَ','طِ','طُ'], word: 'طَائِرٌ', meaning: 'bird', emoji: '🐦', tracingPoints: [...SHAPE.taaEmphatic] },
  { letter: 'ظ', name: 'ظَاءٌ', trans: 'zaa', forms: ['ظَ','ظِ','ظُ'], word: 'ظَبْيٌ', meaning: 'gazelle', emoji: '🦌', tracingPoints: [...SHAPE.taaEmphatic] },
  { letter: 'ع', name: 'عَيْنٌ', trans: 'ain', forms: ['عَ','عِ','عُ'], word: 'عَيْنٌ', meaning: 'eye', emoji: '👁️', tracingPoints: [...SHAPE.ainShape] },
  { letter: 'غ', name: 'غَيْنٌ', trans: 'ghain', forms: ['غَ','غِ','غُ'], word: 'غُرَابٌ', meaning: 'crow', emoji: '🐦', tracingPoints: [...SHAPE.ainShape] },
  { letter: 'ف', name: 'فَاءٌ', trans: 'faa', forms: ['فَ','فِ','فُ'], word: 'فِيلٌ', meaning: 'elephant', emoji: '🐘', tracingPoints: [...SHAPE.faaShape] },
  { letter: 'ق', name: 'قَافٌ', trans: 'qaf', forms: ['قَ','قِ','قُ'], word: 'قِطَّةٌ', meaning: 'cat', emoji: '🐱', tracingPoints: [...SHAPE.faaShape] },
  { letter: 'ك', name: 'كَافٌ', trans: 'kaf', forms: ['كَ','كِ','كُ'], word: 'كَلْبٌ', meaning: 'dog', emoji: '🐕', tracingPoints: [...SHAPE.kafShape] },
  { letter: 'ل', name: 'لَامٌ', trans: 'lam', forms: ['لَ','لِ','لُ'], word: 'لَيْمُونٌ', meaning: 'lemon', emoji: '🍋', tracingPoints: [...SHAPE.lamShape] },
  { letter: 'م', name: 'مِيمٌ', trans: 'mim', forms: ['مَ','مِ','مُ'], word: 'مَوْزٌ', meaning: 'banana', emoji: '🍌', tracingPoints: [...SHAPE.mimShape] },
  { letter: 'ن', name: 'نُونٌ', trans: 'nun', forms: ['نَ','نِ','نُ'], word: 'نَحْلَةٌ', meaning: 'bee', emoji: '🐝', tracingPoints: [...SHAPE.bowl] },
  { letter: 'ه', name: 'هَاءٌ', trans: 'haa-soft', forms: ['هَ','هِ','هُ'], word: 'هُدْهُدٌ', meaning: 'hoopoe', emoji: '🐦', tracingPoints: [...SHAPE.haaSoftShape] },
  { letter: 'و', name: 'وَاوٌ', trans: 'waw', forms: ['وَ','وِ','وُ'], word: 'وَرْدَةٌ', meaning: 'rose', emoji: '🌹', tracingPoints: [...SHAPE.wawShape] },
  { letter: 'ي', name: 'يَاءٌ', trans: 'yaa', forms: ['يَ','يِ','يُ'], word: 'يَدٌ', meaning: 'hand', emoji: '✋', tracingPoints: [...SHAPE.bowl] },
]

const LETTER_PALETTE = [
  { name: 'أَحْمَرُ', hex: '#ef4444', audioText: 'أَحْمَرُ' },
  { name: 'أَزْرَقُ', hex: '#3b82f6', audioText: 'أَزْرَقُ' },
  { name: 'أَخْضَرُ', hex: '#22c55e', audioText: 'أَخْضَرُ' },
]

function buildLetterLesson(l: AlphabetLetter, order: number): LessonSeed {
  return {
    themeSlug: 'arabic',
    slug: `letter-${l.trans}`,
    title: `الْحَرْفُ: ${l.name}`,
    description: `Meet the letter ${l.letter} (${l.name}).`,
    icon: '🔤',
    level: 'basic',
    order,
    sections: [
      { type: 'letter_intro', content: { title: 'تَعَرَّفْ عَلَى الْحَرْفِ', letter: l.letter, name: l.name, audioText: l.name, transliteration: l.trans } },
      { type: 'letter_vowels', content: { title: 'الْحَرَكَاتُ', instructions: 'اِضْغَطْ عَلَى كُلِّ حَرَكَةٍ لِتَسْمَعَ الصَّوْتَ', letter: l.letter, forms: [
        { form: l.forms[0], vowel: 'fatha', audioText: l.forms[0] },
        { form: l.forms[1], vowel: 'kasra', audioText: l.forms[1] },
        { form: l.forms[2], vowel: 'damma', audioText: l.forms[2] },
      ] } },
      { type: 'letter_coloring', content: { title: 'لَوِّنِ الْحَرْفَ', instructions: 'اِخْتَرْ لَوْنًا ثُمَّ اضْغَطْ عَلَى الْحَرْفِ', letter: l.letter, colors: LETTER_PALETTE } },
      { type: 'letter_tracing', content: { title: 'اُرْسُمِ الْحَرْفَ', instructions: 'اِضْغَطْ عَلَى النِّقَاطِ بِالتَّرْتِيبِ', letter: l.letter, points: l.tracingPoints } },
      { type: 'letter_word_match', content: { title: 'كَلِمَةٌ تَبْدَأُ بِالْحَرْفِ', instructions: 'اِضْغَطْ عَلَى الْكَلِمَةِ لِتَسْمَعَهَا', words: [
        { word: l.word, letter: l.letter, meaning: l.meaning, emoji: l.emoji, audioText: l.word },
      ] } },
    ],
  }
}

const letterLessons: LessonSeed[] = ALPHABET_LETTERS.map((l, i) => buildLetterLesson(l, 4 + i))

// ── Lesson seeds (thème arabic + islamic + quran + others) ────────────────
export const lessonSeeds: LessonSeed[] = [
  {
    themeSlug: 'arabic', slug: 'numbers', title: 'الأعداد',
    description: 'Listen, learn, and play with Arabic numbers from 1 to 10.',
    icon: '🔢', level: 'basic', order: 1,
    sections: [
      { type: 'audio', content: { title: 'تعلم الأعداد', audioUrl: '/audio/numbers/intro.mp3', autoPlay: true } },
      { type: 'numbers', content: { numbers: [
        { number: 1, arabic_simple: '١', arabic_full: 'وَاحِدٌ', latin: '1', transliteration: 'wahidun', audioText: 'وَاحِدٌ' },
        { number: 2, arabic_simple: '٢', arabic_full: 'اِثْنَانِ', latin: '2', transliteration: 'ithnani', audioText: 'اِثْنَانِ' },
        { number: 3, arabic_simple: '٣', arabic_full: 'ثَلَاثَةٌ', latin: '3', transliteration: 'thalathatun', audioText: 'ثَلَاثَةٌ' },
        { number: 4, arabic_simple: '٤', arabic_full: 'أَرْبَعَةٌ', latin: '4', transliteration: 'arbaatun', audioText: 'أَرْبَعَةٌ' },
        { number: 5, arabic_simple: '٥', arabic_full: 'خَمْسَةٌ', latin: '5', transliteration: 'khamsatun', audioText: 'خَمْسَةٌ' },
        { number: 6, arabic_simple: '٦', arabic_full: 'سِتَّةٌ', latin: '6', transliteration: 'sittatun', audioText: 'سِتَّةٌ' },
        { number: 7, arabic_simple: '٧', arabic_full: 'سَبْعَةٌ', latin: '7', transliteration: 'sabatun', audioText: 'سَبْعَةٌ' },
        { number: 8, arabic_simple: '٨', arabic_full: 'ثَمَانِيَةٌ', latin: '8', transliteration: 'thamaniyatun', audioText: 'ثَمَانِيَةٌ' },
        { number: 9, arabic_simple: '٩', arabic_full: 'تِسْعَةٌ', latin: '9', transliteration: 'tisatun', audioText: 'تِسْعَةٌ' },
        { number: 10, arabic_simple: '١٠', arabic_full: 'عَشَرَةٌ', latin: '10', transliteration: 'asharatun', audioText: 'عَشَرَةٌ' },
      ] } },
      { type: 'quiz_match', content: { question: 'اسمع واختر الرقم الصحيح', pairs: [
        { audioText: 'وَاحِدٌ', answer: '1' }, { audioText: 'اِثْنَانِ', answer: '2' }, { audioText: 'ثَلَاثَةٌ', answer: '3' },
      ] } },
      { type: 'game_numbers', content: { instructions: 'اختر الرقم الصحيح', questions: [
        { audioText: 'خَمْسَةٌ', options: ['3','5','7'], answer: '5' },
        { audioText: 'ثَمَانِيَةٌ', options: ['6','8','9'], answer: '8' },
      ] } },
    ],
  },
  {
    themeSlug: 'arabic', slug: 'colors', title: 'الأَلْوَانُ',
    description: 'Play, paint, and learn Arabic colors.',
    icon: '🎨', level: 'basic', order: 2,
    sections: [
      { type: 'interactive_color_world', content: { title: 'عَالَمُ الأَلْوَانِ', instructions: 'مَرِّرْ مُؤَشِّرَكَ أَوِ اضْغَطْ عَلَى كُلِّ لَوْنٍ لِتَسْمَعَ اسْمَهُ!', colors: [
        { name: 'أَحْمَرُ', hex: '#ef4444', audioText: 'أَحْمَرُ', transliteration: 'ahmaru', example: '🍎' },
        { name: 'أَزْرَقُ', hex: '#3b82f6', audioText: 'أَزْرَقُ', transliteration: 'azraqu', example: '🐳' },
        { name: 'أَخْضَرُ', hex: '#22c55e', audioText: 'أَخْضَرُ', transliteration: 'akhdaru', example: '🌳' },
        { name: 'أَصْفَرُ', hex: '#facc15', audioText: 'أَصْفَرُ', transliteration: 'asfaru', example: '🌟' },
        { name: 'أَسْوَدُ', hex: '#111827', audioText: 'أَسْوَدُ', transliteration: 'aswadu', example: '🐈‍⬛' },
        { name: 'أَبْيَضُ', hex: '#f8fafc', audioText: 'أَبْيَضُ', transliteration: 'abyadu', example: '☁️' },
      ] } },
      { type: 'paint_game', content: { title: 'اِلْعَبْ وَتَعَلَّمِ الأَلْوَانَ', instructions: 'اِخْتَرْ لَوْنًا ثُمَّ اضْغَطْ عَلَى الصُّورَةِ الصَّحِيحَةِ', colors: [
        { name: 'أَحْمَرُ', hex: '#ef4444', audioText: 'أَحْمَرُ' },
        { name: 'أَزْرَقُ', hex: '#3b82f6', audioText: 'أَزْرَقُ' },
        { name: 'أَخْضَرُ', hex: '#22c55e', audioText: 'أَخْضَرُ' },
        { name: 'أَصْفَرُ', hex: '#facc15', audioText: 'أَصْفَرُ' },
        { name: 'أَسْوَدُ', hex: '#111827', audioText: 'أَسْوَدُ' },
        { name: 'أَبْيَضُ', hex: '#f8fafc', audioText: 'أَبْيَضُ' },
      ], objects: [
        { name: 'تُفَّاحَةٌ', kind: 'apple', correctColor: 'أَحْمَرُ' },
        { name: 'سَيَّارَةٌ', kind: 'car', correctColor: 'أَزْرَقُ' },
        { name: 'بَيْتٌ', kind: 'house', correctColor: 'أَخْضَرُ' },
        { name: 'شَمْسٌ', kind: 'sun', correctColor: 'أَصْفَرُ' },
        { name: 'سَمَكَةٌ', kind: 'fish', correctColor: 'أَزْرَقُ' },
        { name: 'نَجْمَةٌ', kind: 'star', correctColor: 'أَصْفَرُ' },
      ] } },
    ],
  },
  {
    themeSlug: 'arabic', slug: 'shapes', title: 'الأَشْكَالُ الْهَنْدَسِيَّةُ',
    description: 'Learn geometric shapes in Arabic with sound.',
    icon: '🔺', level: 'basic', order: 3,
    sections: [
      { type: 'interactive_shapes_world', content: { title: 'عَالَمُ الأَشْكَالِ', instructions: 'مَرِّرْ أَوِ اضْغَطْ عَلَى كُلِّ شَكْلٍ لِتَسْمَعَ اسْمَهُ!', shapes: [
        { name: 'دَائِرَةٌ', emoji: '⚪', audioText: 'دَائِرَةٌ', transliteration: 'daairatun' },
        { name: 'مُرَبَّعٌ', emoji: '⬜', audioText: 'مُرَبَّعٌ', transliteration: 'murabbaun' },
        { name: 'مُثَلَّثٌ', emoji: '🔺', audioText: 'مُثَلَّثٌ', transliteration: 'muthallathun' },
        { name: 'مُسْتَطِيلٌ', emoji: '▭', audioText: 'مُسْتَطِيلٌ', transliteration: 'mustatilun' },
      ] } },
      { type: 'draw_shapes', content: { title: 'اِرْسُمْ الأَشْكَالَ', instructions: 'اِضْغَطْ عَلَى النِّقَاطِ بِالتَّرْتِيبِ لِتَرْسُمَ الشَّكْلَ', challenges: [
        { name: 'مُرَبَّعٌ', audioText: 'مُرَبَّعٌ', dots: [{ x:25,y:25 },{ x:75,y:25 },{ x:75,y:75 },{ x:25,y:75 }] },
        { name: 'مُثَلَّثٌ', audioText: 'مُثَلَّثٌ', dots: [{ x:50,y:18 },{ x:85,y:80 },{ x:15,y:80 }] },
        { name: 'مُسْتَطِيلٌ', audioText: 'مُسْتَطِيلٌ', dots: [{ x:15,y:30 },{ x:85,y:30 },{ x:85,y:70 },{ x:15,y:70 }] },
      ] } },
      { type: 'color_shapes', content: { title: 'لَوِّنِ الأَشْكَالَ', instructions: 'اِخْتَرْ لَوْنًا ثُمَّ اضْغَطْ عَلَى الشَّكْلِ الصَّحِيحِ', colors: [
        { name: 'أَحْمَرُ', hex: '#ef4444', audioText: 'أَحْمَرُ' },
        { name: 'أَزْرَقُ', hex: '#3b82f6', audioText: 'أَزْرَقُ' },
        { name: 'أَخْضَرُ', hex: '#22c55e', audioText: 'أَخْضَرُ' },
        { name: 'أَصْفَرُ', hex: '#facc15', audioText: 'أَصْفَرُ' },
      ], objects: [
        { name: 'دَائِرَةٌ', kind: 'circle', correctColor: 'أَحْمَرُ' },
        { name: 'مُرَبَّعٌ', kind: 'square', correctColor: 'أَزْرَقُ' },
        { name: 'مُثَلَّثٌ', kind: 'triangle', correctColor: 'أَخْضَرُ' },
        { name: 'مُسْتَطِيلٌ', kind: 'rectangle', correctColor: 'أَصْفَرُ' },
      ] } },
    ],
  },
  ...letterLessons,
  {
    themeSlug: 'arabic', slug: 'family', title: 'العَائِلَةُ',
    description: 'Learn the names of your family members in Arabic.',
    icon: '👨‍👩‍👧‍👦', level: 'basic', order: 32,
    sections: [
      { type: 'family_intro', content: { title: 'أَفْرَادُ العَائِلَةِ', instructions: 'مَرِّرْ أَوِ اضْغَطْ عَلَى كُلِّ بِطَاقَةٍ لِتَسْمَعَ اسْمَهَا', members: [
        { name: 'الأَبُ', emoji: '👨', audioText: 'الأَبُ', meaning: 'father' },
        { name: 'الأُمُّ', emoji: '👩', audioText: 'الأُمُّ', meaning: 'mother' },
        { name: 'الأَخُ', emoji: '🧑', audioText: 'الأَخُ', meaning: 'brother' },
        { name: 'الأُخْتُ', emoji: '👧', audioText: 'الأُخْتُ', meaning: 'sister' },
        { name: 'الجَدُّ', emoji: '👴', audioText: 'الجَدُّ', meaning: 'grandfather' },
        { name: 'الجَدَّةُ', emoji: '👵', audioText: 'الجَدَّةُ', meaning: 'grandmother' },
      ] } },
      { type: 'family_tree', content: { title: 'شَجَرَةُ العَائِلَةِ', instructions: 'اِضْغَطْ عَلَى كُلِّ فَرْدٍ لِتَسْمَعَ اسْمَهُ', nodes: [
        { id: 'grandfather', name: 'الجَدُّ', emoji: '👴', audioText: 'الجَدُّ', level: 0 },
        { id: 'grandmother', name: 'الجَدَّةُ', emoji: '👵', audioText: 'الجَدَّةُ', level: 0 },
        { id: 'father', name: 'الأَبُ', emoji: '👨', audioText: 'الأَبُ', level: 1, parents: ['grandfather','grandmother'] },
        { id: 'mother', name: 'الأُمُّ', emoji: '👩', audioText: 'الأُمُّ', level: 1 },
        { id: 'brother', name: 'الأَخُ', emoji: '🧑', audioText: 'الأَخُ', level: 2, parents: ['father','mother'] },
        { id: 'sister', name: 'الأُخْتُ', emoji: '👧', audioText: 'الأُخْتُ', level: 2, parents: ['father','mother'] },
      ] } },
      { type: 'family_match', content: { title: 'لُعْبَةُ المُطَابَقَةِ', instructions: 'اِسْمَعْ ثُمَّ اخْتَرِ الصُّورَةَ الصَّحِيحَةَ', rounds: [
        { prompt: 'الأُمُّ', audioText: 'الأُمُّ', answer: 'الأُمُّ', options: [{name:'الأَبُ',emoji:'👨'},{name:'الأُمُّ',emoji:'👩'},{name:'الأُخْتُ',emoji:'👧'}] },
        { prompt: 'الأَبُ', audioText: 'الأَبُ', answer: 'الأَبُ', options: [{name:'الجَدُّ',emoji:'👴'},{name:'الأَخُ',emoji:'🧑'},{name:'الأَبُ',emoji:'👨'}] },
        { prompt: 'الجَدَّةُ', audioText: 'الجَدَّةُ', answer: 'الجَدَّةُ', options: [{name:'الأُمُّ',emoji:'👩'},{name:'الجَدَّةُ',emoji:'👵'},{name:'الأُخْتُ',emoji:'👧'}] },
        { prompt: 'الأَخُ', audioText: 'الأَخُ', answer: 'الأَخُ', options: [{name:'الأَخُ',emoji:'🧑'},{name:'الأَبُ',emoji:'👨'},{name:'الجَدُّ',emoji:'👴'}] },
      ] } },
    ],
  },
  {
    themeSlug: 'arabic', slug: 'animals', title: 'الحيوانات (Animals)',
    description: 'Meet animals in Arabic.', icon: '🐾', level: 'basic', order: 33,
    sections: [
      { type: 'text', content: { title: 'تعلم الحيوانات', body: 'قطة — cat\nكلب — dog\nطائر — bird\nسمكة — fish' } },
      { type: 'quiz', content: { question: "Which word means 'cat'?", options: ['قطة','كلب','سمكة'], answer: 'قطة' } },
    ],
  },
  {
    themeSlug: 'arabic', slug: 'body', title: 'أَعْضَاءُ الْجِسْمِ الْبَشَرِيِّ',
    description: 'Explore the human body by hovering each part.', icon: '👤', level: 'basic', order: 34,
    sections: [
      { type: 'body_map', content: { title: 'اِكْتَشِفْ أَعْضَاءَ الْجِسْمِ', instructions: 'مَرِّرْ أَوِ اضْغَطْ عَلَى كُلِّ جُزْءٍ لِتَسْمَعَ اسْمَهُ', parts: [
        { key: 'head', name: 'الرَّأْسُ', audioText: 'الرَّأْسُ', meaning: 'head' },
        { key: 'eye', name: 'الْعَيْنُ', audioText: 'الْعَيْنُ', meaning: 'eye' },
        { key: 'ear', name: 'الْأُذُنُ', audioText: 'الْأُذُنُ', meaning: 'ear' },
        { key: 'nose', name: 'الْأَنْفُ', audioText: 'الْأَنْفُ', meaning: 'nose' },
        { key: 'mouth', name: 'الْفَمُ', audioText: 'الْفَمُ', meaning: 'mouth' },
        { key: 'hand', name: 'الْيَدُ', audioText: 'الْيَدُ', meaning: 'hand' },
        { key: 'foot', name: 'الرِّجْلُ', audioText: 'الرِّجْلُ', meaning: 'foot' },
      ] } },
    ],
  },
  {
    themeSlug: 'arabic', slug: 'pronouns-first-person', title: 'ضمير المتكلم (First-person pronouns)',
    description: "Say 'I' and 'we' in Arabic.", icon: '🙋', level: 'basic', order: 35,
    sections: [
      { type: 'text', content: { title: 'ضمير المتكلم', body: "أنا — I\nنحن — we\n\nUse أنا for yourself, and نحن when you're with others." } },
      { type: 'quiz', content: { question: "How do you say 'I' in Arabic?", options: ['أنا','نحن','أنت'], answer: 'أنا' } },
    ],
  },
  {
    themeSlug: 'islamic', slug: 'five-pillars', title: 'The Five Pillars', icon: '🕌', level: 'basic', order: 1,
    sections: [{ type: 'text', content: { title: 'The Five Pillars', body: 'Islam stands on five beautiful pillars: Shahada, Salah, Zakat, Sawm, and Hajj.' } }],
  },
  {
    themeSlug: 'quran', slug: 'surah-al-fatiha', title: 'Surah Al-Fatiha', icon: '📖', level: 'basic', order: 1,
    sections: [{ type: 'text', content: { title: 'Al-Fatiha', body: 'Al-Fatiha is the opening of the Quran. We recite it in every prayer.' } }],
  },
  {
    themeSlug: 'others', slug: 'arabic-songs', title: 'Arabic Songs', icon: '🎵', level: 'basic', order: 1,
    sections: [{ type: 'text', content: { title: 'Sing along', body: 'Learning Arabic through songs is fun and easy!' } }],
  },
]
