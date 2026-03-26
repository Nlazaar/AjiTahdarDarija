/**
 * Groupes de lettres par leçon d'alphabet.
 * Clé = slug de la leçon en DB (alphabet-darija-lecon-N)
 */
import type { DarijaLetter } from '@/components/exercises/types';

export const LETTER_GROUPS: Record<string, DarijaLetter[]> = {
  'alphabet-1': [
    { letter: 'ا', latin: 'a',  fr: "a — comme dans 'ami'" },
    { letter: 'ب', latin: 'b',  fr: "b — comme dans 'bateau'" },
    { letter: 'ت', latin: 't',  fr: "t — comme dans 'table'" },
    { letter: 'ث', latin: 'th', fr: 'th — entre s et t' },
    { letter: 'ج', latin: 'j',  fr: "j — comme dans 'jardin'" },
  ],
  'alphabet-2': [
    { letter: 'ح', latin: '7',  fr: 'h profond — vient de la gorge' },
    { letter: 'خ', latin: 'kh', fr: "kh — comme le 'J' espagnol" },
    { letter: 'د', latin: 'd',  fr: "d — comme dans 'demain'" },
    { letter: 'ذ', latin: 'dh', fr: 'dh — entre d et z' },
    { letter: 'ر', latin: 'r',  fr: 'r roulé — comme en espagnol' },
  ],
  'alphabet-3': [
    { letter: 'ز', latin: 'z',  fr: "z — comme dans 'zèbre'" },
    { letter: 'س', latin: 's',  fr: "s — comme dans 'soleil'" },
    { letter: 'ش', latin: 'ch', fr: "ch — comme dans 'chat'" },
    { letter: 'ص', latin: 'S',  fr: 's emphatique — s profond' },
    { letter: 'ض', latin: 'D',  fr: 'd emphatique — d profond' },
  ],
  'alphabet-4': [
    { letter: 'ط', latin: 'T',  fr: 't emphatique — t profond' },
    { letter: 'ظ', latin: 'Z',  fr: 'z emphatique — z profond' },
    { letter: 'ع', latin: '3',  fr: 'a guttural — du fond de la gorge' },
    { letter: 'غ', latin: 'gh', fr: 'r guttural — comme un gargarisme' },
    { letter: 'ف', latin: 'f',  fr: "f — comme dans 'fleur'" },
  ],
  'alphabet-5': [
    { letter: 'ق', latin: 'q', fr: 'k profond — du fond de la gorge' },
    { letter: 'ك', latin: 'k', fr: "k — comme dans 'café'" },
    { letter: 'ل', latin: 'l', fr: "l — comme dans 'lune'" },
    { letter: 'م', latin: 'm', fr: "m — comme dans 'maison'" },
    { letter: 'ن', latin: 'n', fr: "n — comme dans 'nuit'" },
    { letter: 'ه', latin: 'h', fr: 'h aspiré — souffle léger' },
    { letter: 'و', latin: 'w', fr: "w/ou — comme 'w' ou 'ou'" },
    { letter: 'ي', latin: 'y', fr: "y/i — comme 'y' ou 'i'" },
  ],
};
