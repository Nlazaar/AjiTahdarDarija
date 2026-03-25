/**
 * Groupes de lettres par leçon d'alphabet.
 * Clé = slug de la leçon en DB (alphabet-darija-lecon-N)
 */
import type { DarijaLetter } from '@/components/exercises/types';

export const LETTER_GROUPS: Record<string, DarijaLetter[]> = {
  'alphabet-darija-lecon-1': [
    { letter: 'ا', latin: 'Alif', fr: 'voyelle longue "a"' },
    { letter: 'ب', latin: 'Ba',   fr: 'comme "b" français' },
    { letter: 'ت', latin: 'Ta',   fr: 'comme "t" français' },
    { letter: 'ث', latin: 'Tha',  fr: '"th" anglais (think)' },
  ],
  'alphabet-darija-lecon-2': [
    { letter: 'ج', latin: 'Jim',  fr: 'comme "dj" dans djinn' },
    { letter: 'ح', latin: 'Ha',   fr: 'h expiré du fond de la gorge' },
    { letter: 'خ', latin: 'Kha',  fr: 'comme "j" espagnol (jota)' },
    { letter: 'د', latin: 'Dal',  fr: 'comme "d" français' },
    { letter: 'ذ', latin: 'Dhal', fr: '"th" dans "the"' },
    { letter: 'ر', latin: 'Ra',   fr: 'r roulé' },
    { letter: 'ز', latin: 'Zay',  fr: 'comme "z" français' },
  ],
  'alphabet-darija-lecon-3': [
    { letter: 'س', latin: 'Sin',  fr: 'comme "s" français' },
    { letter: 'ش', latin: 'Shin', fr: 'comme "ch" français' },
    { letter: 'ص', latin: 'Sad',  fr: 's emphatique' },
    { letter: 'ض', latin: 'Dad',  fr: 'd emphatique' },
    { letter: 'ط', latin: 'Tah',  fr: 't emphatique' },
    { letter: 'ظ', latin: 'Dha',  fr: 'dh emphatique' },
  ],
  'alphabet-darija-lecon-4': [
    { letter: 'ع', latin: 'Ain',   fr: 'contraction de la gorge' },
    { letter: 'غ', latin: 'Ghain', fr: 'r guttural parisien' },
    { letter: 'ف', latin: 'Fa',    fr: 'comme "f" français' },
    { letter: 'ق', latin: 'Qaf',   fr: 'k du fond de la gorge' },
    { letter: 'ك', latin: 'Kaf',   fr: 'comme "k" français' },
    { letter: 'ل', latin: 'Lam',   fr: 'comme "l" français' },
  ],
  'alphabet-darija-lecon-5': [
    { letter: 'م', latin: 'Mim', fr: 'comme "m" français' },
    { letter: 'ن', latin: 'Nun', fr: 'comme "n" français' },
    { letter: 'ه', latin: 'Ha',  fr: 'h aspiré doux' },
    { letter: 'و', latin: 'Waw', fr: '"w" anglais ou "ou"' },
    { letter: 'ي', latin: 'Ya',  fr: '"y" ou "i"' },
  ],
};
