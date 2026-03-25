import type { Theme } from './types';

export const alphabetTheme: Theme = {
  id: 'alphabet',
  slug: 'module-alphabet',
  title: "L'Alphabet Arabe",
  description: "Maîtrise les 28 lettres de l'alphabet arabe utilisées en Darija",
  level: 1,
  icon: '🔤',
  color: '#2a9d8f',
  lessons: [
    {
      slug: 'alphabet-1',
      title: 'Les premières lettres',
      subtitle: 'ا ب ت ث ج',
      order: 1,
      items: [
        { type: 'letter', id: 'alef',  arabic: 'ا', latin: 'a',  fr: "a — comme dans 'ami'" },
        { type: 'letter', id: 'ba',    arabic: 'ب', latin: 'b',  fr: "b — comme dans 'bateau'" },
        { type: 'letter', id: 'ta',    arabic: 'ت', latin: 't',  fr: "t — comme dans 'table'" },
        { type: 'letter', id: 'tha',   arabic: 'ث', latin: 'th', fr: 'th — entre s et t' },
        { type: 'letter', id: 'jeem',  arabic: 'ج', latin: 'j',  fr: "j — comme dans 'jardin'" },
      ],
    },
    {
      slug: 'alphabet-2',
      title: 'Sons du fond de la gorge',
      subtitle: 'ح خ د ذ ر',
      order: 2,
      items: [
        { type: 'letter', id: 'ha',    arabic: 'ح', latin: '7',  fr: 'h profond — vient de la gorge' },
        { type: 'letter', id: 'kha',   arabic: 'خ', latin: 'kh', fr: "kh — comme le 'J' espagnol" },
        { type: 'letter', id: 'dal',   arabic: 'د', latin: 'd',  fr: "d — comme dans 'demain'" },
        { type: 'letter', id: 'dhal',  arabic: 'ذ', latin: 'dh', fr: 'dh — entre d et z' },
        { type: 'letter', id: 'ra',    arabic: 'ر', latin: 'r',  fr: 'r roulé — comme en espagnol' },
      ],
    },
    {
      slug: 'alphabet-3',
      title: 'Les sibilantes',
      subtitle: 'ز س ش ص ض',
      order: 3,
      items: [
        { type: 'letter', id: 'zay',   arabic: 'ز', latin: 'z',  fr: "z — comme dans 'zèbre'" },
        { type: 'letter', id: 'seen',  arabic: 'س', latin: 's',  fr: "s — comme dans 'soleil'" },
        { type: 'letter', id: 'sheen', arabic: 'ش', latin: 'ch', fr: "ch — comme dans 'chat'" },
        { type: 'letter', id: 'sad',   arabic: 'ص', latin: 'S',  fr: 's emphatique — s profond' },
        { type: 'letter', id: 'dad',   arabic: 'ض', latin: 'D',  fr: 'd emphatique — d profond' },
      ],
    },
    {
      slug: 'alphabet-4',
      title: 'Les emphatiques',
      subtitle: 'ط ظ ع غ ف',
      order: 4,
      items: [
        { type: 'letter', id: 'tah',   arabic: 'ط', latin: 'T',  fr: 't emphatique — t profond' },
        { type: 'letter', id: 'zah',   arabic: 'ظ', latin: 'Z',  fr: 'z emphatique — z profond' },
        { type: 'letter', id: '3ayn',  arabic: 'ع', latin: '3',  fr: 'a guttural — du fond de la gorge' },
        { type: 'letter', id: 'ghayn', arabic: 'غ', latin: 'gh', fr: 'r guttural — comme un gargarisme' },
        { type: 'letter', id: 'fa',    arabic: 'ف', latin: 'f',  fr: "f — comme dans 'fleur'" },
      ],
    },
    {
      slug: 'alphabet-5',
      title: "Fin de l'alphabet",
      subtitle: 'ق ك ل م ن ه و ي',
      order: 5,
      items: [
        { type: 'letter', id: 'qaf',   arabic: 'ق', latin: 'q',  fr: 'k profond — du fond de la gorge' },
        { type: 'letter', id: 'kaf',   arabic: 'ك', latin: 'k',  fr: "k — comme dans 'café'" },
        { type: 'letter', id: 'lam',   arabic: 'ل', latin: 'l',  fr: "l — comme dans 'lune'" },
        { type: 'letter', id: 'meem',  arabic: 'م', latin: 'm',  fr: "m — comme dans 'maison'" },
        { type: 'letter', id: 'noon',  arabic: 'ن', latin: 'n',  fr: "n — comme dans 'nuit'" },
        { type: 'letter', id: 'ha2',   arabic: 'ه', latin: 'h',  fr: 'h aspiré — souffle léger' },
        { type: 'letter', id: 'waw',   arabic: 'و', latin: 'w',  fr: "w/ou — comme 'w' ou 'ou'" },
        { type: 'letter', id: 'ya',    arabic: 'ي', latin: 'y',  fr: "y/i — comme 'y' ou 'i'" },
      ],
    },
  ],
};

// Compatibilité avec l'ancien import darijaAlphabet
export const darijaAlphabet = alphabetTheme.lessons
  .flatMap((l) => l.items)
  .map((item) => {
    if (item.type !== 'letter') return null;
    return { letter: item.arabic, latin: item.latin, fr: item.fr };
  })
  .filter(Boolean);
