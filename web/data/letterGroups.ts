/**
 * Groupes de lettres de l'alphabet MSA (arabe standard), regroupés par
 * famille phonétique. Chaque leçon couvre un groupe homogène de sons,
 * pour que l'oreille distingue les nuances (sifflantes vs chuintantes,
 * emphatiques vs non-emphatiques, gutturales, etc.).
 *
 * Utilisés uniquement par le track MSA. La Darija n'a pas de module
 * alphabet — l'apprentissage démarre directement par le vocabulaire.
 *
 * ttsText = phrase naturelle envoyée au TTS pour une prononciation claire.
 */
import type { DarijaLetter, AlphabetLetter } from '@/components/exercises/types';

/**
 * Génère les 3 harakat standards (fatha / kasra / damma) pour une lettre.
 * Le TTS reçoit une syllabe répétée ("بَ بَ بَ") pour un son clair et audible.
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

/**
 * Les 6 groupes phonétiques de l'alphabet MSA.
 *
 *   1 — Voyelles & hamza           (ا و ي ء)
 *   2 — Labiales & dentales        (ب م ف · ت ث د ذ)
 *   3 — Sifflantes & chuintantes   (س ش ص ز)
 *   4 — Emphatiques                (ط ظ ض)
 *   5 — Gutturales & vélaires      (ح ع خ غ ك ق ج)
 *   6 — Liquides, nasales & finales (ل ر ن ه · ـة)
 *
 * Total : 28 lettres + hamza ء + ta marbouta ـة = 30 unités.
 */
export const MSA_ALPHABET_LETTERS: Record<string, AlphabetLetter[]> = {
  // ─── Groupe 1 — Voyelles & hamza ────────────────────────────────────────
  'msa-alphabet-1': [
    {
      letter: 'ا', latin: 'a', fr: "voyelle longue 'ā' — comme dans 'ami'", name: 'Alif',
      harakat: [
        { label: 'Fatha', symbol: 'َ', letter: 'أَ', sound: 'a',  desc: "son 'a' ouvert",    ttsText: 'أَلِف. فَتْحَة. أَ. أَ. أَ' },
        { label: 'Kasra', symbol: 'ِ', letter: 'إِ', sound: 'i',  desc: "son 'i' fermé",     ttsText: 'أَلِف. كَسْرَة. إِ. إِ. إِ' },
        { label: 'Damma', symbol: 'ُ', letter: 'أُ', sound: 'ou', desc: "son 'ou' arrondi",   ttsText: 'أَلِف. ضَمَّة. أُ. أُ. أُ' },
      ],
    },
    {
      letter: 'و', latin: 'w', fr: "w ou voyelle longue 'ū'", name: 'Waw',
      harakat: harakat('و', 'Waw'),
    },
    {
      letter: 'ي', latin: 'y', fr: "y ou voyelle longue 'ī'", name: 'Ya',
      harakat: harakat('ي', 'Ya'),
    },
    {
      letter: 'ء', latin: "'", fr: "hamza — coup de glotte (comme 'uh-oh')", name: 'Hamza',
      harakat: [
        { label: 'Fatha', symbol: 'َ', letter: 'أَ', sound: 'a',  desc: "hamza + 'a'",  ttsText: 'هَمْزَة. فَتْحَة. أَ. أَ. أَ' },
        { label: 'Kasra', symbol: 'ِ', letter: 'إِ', sound: 'i',  desc: "hamza + 'i'",  ttsText: 'هَمْزَة. كَسْرَة. إِ. إِ. إِ' },
        { label: 'Damma', symbol: 'ُ', letter: 'أُ', sound: 'ou', desc: "hamza + 'ou'", ttsText: 'هَمْزَة. ضَمَّة. أُ. أُ. أُ' },
      ],
    },
  ],

  // ─── Groupe 2 — Labiales & dentales ─────────────────────────────────────
  'msa-alphabet-2': [
    { letter: 'ب', latin: 'b',  fr: "b — comme dans 'bateau'",           name: 'Ba',   harakat: harakat('ب', 'Ba') },
    { letter: 'م', latin: 'm',  fr: "m — comme dans 'maison'",           name: 'Mim',  harakat: harakat('م', 'Mim') },
    { letter: 'ف', latin: 'f',  fr: "f — comme dans 'fleur'",            name: 'Fa',   harakat: harakat('ف', 'Fa') },
    { letter: 'ت', latin: 't',  fr: "t — comme dans 'table'",            name: 'Ta',   harakat: harakat('ت', 'Ta') },
    { letter: 'ث', latin: 'th', fr: "th anglais de 'think' — zézayement", name: 'Tha',  harakat: harakat('ث', 'Tha') },
    { letter: 'د', latin: 'd',  fr: "d — comme dans 'dire'",             name: 'Dal',  harakat: harakat('د', 'Dal') },
    { letter: 'ذ', latin: 'dh', fr: "th anglais de 'the' — voisé",       name: 'Dhal', harakat: harakat('ذ', 'Dhal') },
  ],

  // ─── Groupe 3 — Sifflantes & chuintantes ─────────────────────────────────
  'msa-alphabet-3': [
    { letter: 'س', latin: 's',  fr: "s — comme dans 'soleil'",       name: 'Sin',  harakat: harakat('س', 'Sin') },
    { letter: 'ش', latin: 'sh', fr: "sh — comme dans 'chat'",        name: 'Shin', harakat: harakat('ش', 'Shin') },
    { letter: 'ص', latin: 'S',  fr: "s emphatique — s profond",      name: 'Sad',  harakat: harakat('ص', 'Sad') },
    { letter: 'ز', latin: 'z',  fr: "z — comme dans 'zéro'",         name: 'Zay',  harakat: harakat('ز', 'Zay') },
  ],

  // ─── Groupe 4 — Emphatiques ──────────────────────────────────────────────
  'msa-alphabet-4': [
    { letter: 'ط', latin: 'T', fr: "t emphatique — t profond",      name: 'Ta_', harakat: harakat('ط', 'Ta_') },
    { letter: 'ظ', latin: 'Z', fr: "dh emphatique — dh profond",    name: 'Za_', harakat: harakat('ظ', 'Za_') },
    { letter: 'ض', latin: 'D', fr: "d emphatique — d profond",      name: 'Dad', harakat: harakat('ض', 'Dad') },
  ],

  // ─── Groupe 5 — Gutturales & vélaires ────────────────────────────────────
  'msa-alphabet-5': [
    { letter: 'ح', latin: '7',  fr: "h profond — vient de la gorge",     name: 'Ha',    harakat: harakat('ح', 'Ha') },
    { letter: 'ع', latin: '3',  fr: "a guttural — du fond de la gorge",  name: 'Ayn',   harakat: harakat('ع', 'Ayn') },
    { letter: 'خ', latin: 'kh', fr: "kh — comme la 'jota' espagnole",    name: 'Kha',   harakat: harakat('خ', 'Kha') },
    { letter: 'غ', latin: 'gh', fr: "r grasseyé — gargarisme doux",      name: 'Ghayn', harakat: harakat('غ', 'Ghayn') },
    { letter: 'ك', latin: 'k',  fr: "k — comme dans 'café'",             name: 'Kaf',   harakat: harakat('ك', 'Kaf') },
    { letter: 'ق', latin: 'q',  fr: "q — k profond du fond de la gorge", name: 'Qaf',   harakat: harakat('ق', 'Qaf') },
    { letter: 'ج', latin: 'j',  fr: "j — comme dans 'jardin'",           name: 'Jim',   harakat: harakat('ج', 'Jim') },
  ],

  // ─── Groupe 6 — Liquides, nasales & finales ──────────────────────────────
  'msa-alphabet-6': [
    { letter: 'ل', latin: 'l', fr: "l — comme dans 'lune'",   name: 'Lam',  harakat: harakat('ل', 'Lam') },
    { letter: 'ر', latin: 'r', fr: "r roulé — comme en espagnol", name: 'Ra',  harakat: harakat('ر', 'Ra') },
    { letter: 'ن', latin: 'n', fr: "n — comme dans 'nuit'",   name: 'Noun', harakat: harakat('ن', 'Noun') },
    { letter: 'ه', latin: 'h', fr: "h léger aspiré — souffle", name: 'Ha_',  harakat: harakat('ه', 'Ha_') },
    {
      letter: 'ة', latin: 'a/at', fr: "ta marbouta — fin de mot féminin ('a' en pause, 't' en liaison)", name: 'Ta marbouta',
      harakat: [
        { label: 'Finale',  symbol: 'َة', letter: 'ـَة',  sound: 'a',   desc: "fin de mot, se prononce 'a'",        ttsText: 'مَدْرَسَة. مَدْرَسَة. مَدْرَسَة' },
        { label: 'Liaison', symbol: 'َةُ', letter: 'ـَةُ', sound: 'atu', desc: "avec voyelle, se prononce 'at'",     ttsText: 'مَدْرَسَةُ. مَدْرَسَةُ. مَدْرَسَةُ' },
        { label: 'Tanwin',  symbol: 'َةً', letter: 'ـَةً', sound: 'atan', desc: "indéfini accusatif, 'atan'",         ttsText: 'مَدْرَسَةً. مَدْرَسَةً. مَدْرَسَةً' },
      ],
    },
  ],
};

// Backward-compat : LETTER_GROUPS expose les mêmes entrées en DarijaLetter[]
// (sans harakat) — utilisé par les exercices ChoixLettre/TrouverLesPaires/etc.
export const LETTER_GROUPS: Record<string, DarijaLetter[]> = Object.fromEntries(
  Object.entries(MSA_ALPHABET_LETTERS).map(([k, v]) => [k, v as DarijaLetter[]])
);
