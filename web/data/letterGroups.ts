/**
 * Groupes de lettres par leçon d'alphabet.
 * Chaque lettre inclut son nom, ses harakat (voyelles courtes) et les sons associés.
 * ttsText = phrase naturelle envoyée au TTS pour une prononciation claire.
 */
import type { DarijaLetter, AlphabetLetter } from '@/components/exercises/types';

/**
 * Génère les 3 harakat pour une lettre.
 * Le TTS reçoit une syllabe répétée : "بَ بَ بَ" pour que le son soit clair et audible.
 */
function harakat(base: string, name: string): AlphabetLetter['harakat'] {
  const fatha = base + '\u064E'; // بَ
  const kasra = base + '\u0650'; // بِ
  const damma = base + '\u064F'; // بُ
  return [
    {
      label: 'Fatha', symbol: 'َ', letter: fatha,
      sound: name.toLowerCase() + 'a',
      desc: "son 'a' ouvert",
      ttsText: `${fatha}. ${fatha}. ${fatha}`,
    },
    {
      label: 'Kasra', symbol: 'ِ', letter: kasra,
      sound: name.toLowerCase() + 'i',
      desc: "son 'i' fermé",
      ttsText: `${kasra}. ${kasra}. ${kasra}`,
    },
    {
      label: 'Damma', symbol: 'ُ', letter: damma,
      sound: name.toLowerCase() + 'ou',
      desc: "son 'ou' arrondi",
      ttsText: `${damma}. ${damma}. ${damma}`,
    },
  ];
}

export const ALPHABET_LETTERS: Record<string, AlphabetLetter[]> = {
  'alphabet-1': [
    {
      letter: 'ا', latin: 'a', fr: "a — comme dans 'ami'", name: 'Alif',
      harakat: [
        { label: 'Fatha',  symbol: 'َ', letter: 'أَ', sound: 'a',  desc: "son 'a' ouvert",   ttsText: 'أَلِفْ. فَتْحَة. أَ. أَ. أَ' },
        { label: 'Kasra',  symbol: 'ِ', letter: 'إِ', sound: 'i',  desc: "son 'i' fermé",    ttsText: 'أَلِفْ. كَسْرَة. إِ. إِ. إِ' },
        { label: 'Damma',  symbol: 'ُ', letter: 'أُ', sound: 'ou', desc: "son 'ou' arrondi",  ttsText: 'أَلِفْ. ضَمَّة. أُ. أُ. أُ' },
      ],
    },
    {
      letter: 'ب', latin: 'b', fr: "b — comme dans 'bateau'", name: 'Ba',
      harakat: [
        { label: 'Fatha', symbol: 'َ', letter: 'بَ', sound: 'ba', desc: "son 'a' ouvert",  ttsText: 'بَاء. فَتْحَة. بَ. بَ. بَ' },
        { label: 'Kasra', symbol: 'ِ', letter: 'بِ', sound: 'bi', desc: "son 'i' fermé",   ttsText: 'بَاء. كَسْرَة. بِ. بِ. بِ' },
        { label: 'Damma', symbol: 'ُ', letter: 'بُ', sound: 'bou', desc: "son 'ou' arrondi", ttsText: 'بَاء. ضَمَّة. بُ. بُ. بُ' },
      ],
    },
    {
      letter: 'ت', latin: 't', fr: "t — comme dans 'table'", name: 'Ta',
      harakat: [
        { label: 'Fatha', symbol: 'َ', letter: 'تَ', sound: 'ta', desc: "son 'a' ouvert",  ttsText: 'تَاء. فَتْحَة. تَ. تَ. تَ' },
        { label: 'Kasra', symbol: 'ِ', letter: 'تِ', sound: 'ti', desc: "son 'i' fermé",   ttsText: 'تَاء. كَسْرَة. تِ. تِ. تِ' },
        { label: 'Damma', symbol: 'ُ', letter: 'تُ', sound: 'tou', desc: "son 'ou' arrondi", ttsText: 'تَاء. ضَمَّة. تُ. تُ. تُ' },
      ],
    },
    {
      letter: 'ث', latin: 'th', fr: 'th — entre s et t', name: 'Tha',
      harakat: [
        { label: 'Fatha', symbol: 'َ', letter: 'ثَ', sound: 'tha', desc: "son 'a' ouvert",  ttsText: 'ثَاء. فَتْحَة. ثَ. ثَ. ثَ' },
        { label: 'Kasra', symbol: 'ِ', letter: 'ثِ', sound: 'thi', desc: "son 'i' fermé",   ttsText: 'ثَاء. كَسْرَة. ثِ. ثِ. ثِ' },
        { label: 'Damma', symbol: 'ُ', letter: 'ثُ', sound: 'thou', desc: "son 'ou' arrondi", ttsText: 'ثَاء. ضَمَّة. ثُ. ثُ. ثُ' },
      ],
    },
    {
      letter: 'ج', latin: 'j', fr: "j — comme dans 'jardin'", name: 'Jim',
      harakat: [
        { label: 'Fatha', symbol: 'َ', letter: 'جَ', sound: 'ja', desc: "son 'a' ouvert",  ttsText: 'جِيم. فَتْحَة. جَ. جَ. جَ' },
        { label: 'Kasra', symbol: 'ِ', letter: 'جِ', sound: 'ji', desc: "son 'i' fermé",   ttsText: 'جِيم. كَسْرَة. جِ. جِ. جِ' },
        { label: 'Damma', symbol: 'ُ', letter: 'جُ', sound: 'jou', desc: "son 'ou' arrondi", ttsText: 'جِيم. ضَمَّة. جُ. جُ. جُ' },
      ],
    },
  ],
  'alphabet-2': [
    { letter: 'ح', latin: '7', fr: 'h profond — vient de la gorge', name: 'Ha',   harakat: harakat('ح', 'Ha') },
    { letter: 'خ', latin: 'kh', fr: "kh — comme le 'J' espagnol",   name: 'Kha',  harakat: harakat('خ', 'Kha') },
    { letter: 'د', latin: 'd', fr: "d — comme dans 'demain'",       name: 'Dal',  harakat: harakat('د', 'Dal') },
    { letter: 'ذ', latin: 'dh', fr: 'dh — entre d et z',            name: 'Dhal', harakat: harakat('ذ', 'Dhal') },
    { letter: 'ر', latin: 'r', fr: 'r roulé — comme en espagnol',   name: 'Ra',   harakat: harakat('ر', 'Ra') },
  ],
  'alphabet-3': [
    { letter: 'ز', latin: 'z', fr: "z — comme dans 'zèbre'",       name: 'Zay',  harakat: harakat('ز', 'Zay') },
    { letter: 'س', latin: 's', fr: "s — comme dans 'soleil'",       name: 'Sin',  harakat: harakat('س', 'Sin') },
    { letter: 'ش', latin: 'ch', fr: "ch — comme dans 'chat'",       name: 'Chin', harakat: harakat('ش', 'Shin') },
    { letter: 'ص', latin: 'S', fr: 's emphatique — s profond',      name: 'Sad',  harakat: harakat('ص', 'Sad') },
    { letter: 'ض', latin: 'D', fr: 'd emphatique — d profond',      name: 'Dad',  harakat: harakat('ض', 'Dad') },
  ],
  'alphabet-4': [
    { letter: 'ط', latin: 'T', fr: 't emphatique — t profond',          name: 'Tah',   harakat: harakat('ط', 'Tah') },
    { letter: 'ظ', latin: 'Z', fr: 'z emphatique — z profond',          name: 'Zah',   harakat: harakat('ظ', 'Zah') },
    { letter: 'ع', latin: '3', fr: 'a guttural — du fond de la gorge',  name: 'Ayn',   harakat: harakat('ع', 'Ayn') },
    { letter: 'غ', latin: 'gh', fr: 'r guttural — comme un gargarisme', name: 'Ghayn', harakat: harakat('غ', 'Ghayn') },
    { letter: 'ف', latin: 'f', fr: "f — comme dans 'fleur'",            name: 'Fa',    harakat: harakat('ف', 'Fa') },
  ],
  'alphabet-5': [
    { letter: 'ق', latin: 'q', fr: 'k profond — du fond de la gorge', name: 'Qaf',  harakat: harakat('ق', 'Qaf') },
    { letter: 'ك', latin: 'k', fr: "k — comme dans 'café'",           name: 'Kaf',  harakat: harakat('ك', 'Kaf') },
    { letter: 'ل', latin: 'l', fr: "l — comme dans 'lune'",           name: 'Lam',  harakat: harakat('ل', 'Lam') },
    { letter: 'م', latin: 'm', fr: "m — comme dans 'maison'",         name: 'Mim',  harakat: harakat('م', 'Mim') },
    { letter: 'ن', latin: 'n', fr: "n — comme dans 'nuit'",           name: 'Noun', harakat: harakat('ن', 'Noun') },
    { letter: 'ه', latin: 'h', fr: 'h aspiré — souffle léger',        name: 'Ha',   harakat: harakat('ه', 'Ha') },
    { letter: 'و', latin: 'w', fr: "w/ou — comme 'w' ou 'ou'",        name: 'Waw',  harakat: harakat('و', 'Waw') },
    { letter: 'ي', latin: 'y', fr: "y/i — comme 'y' ou 'i'",          name: 'Ya',   harakat: harakat('ي', 'Ya') },
  ],
};

// ── MSA Alphabet (same letters, MSA voice) ─────────────────────────────────

export const MSA_ALPHABET_LETTERS: Record<string, AlphabetLetter[]> = {
  'msa-alphabet-1': ALPHABET_LETTERS['alphabet-1']!,
  'msa-alphabet-2': ALPHABET_LETTERS['alphabet-2']!,
  'msa-alphabet-3': ALPHABET_LETTERS['alphabet-3']!,
  'msa-alphabet-4': ALPHABET_LETTERS['alphabet-4']!,
  'msa-alphabet-5': ALPHABET_LETTERS['alphabet-5']!,
};

// Merge all alphabet entries
const ALL_ALPHABET = { ...ALPHABET_LETTERS, ...MSA_ALPHABET_LETTERS };

// Backward compat: LETTER_GROUPS returns DarijaLetter[] (sans harakat)
export const LETTER_GROUPS: Record<string, DarijaLetter[]> = Object.fromEntries(
  Object.entries(ALL_ALPHABET).map(([k, v]) => [k, v as DarijaLetter[]])
);
