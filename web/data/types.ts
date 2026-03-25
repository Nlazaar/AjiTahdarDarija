// ─── TYPES PARTAGÉS ───────────────────────────────────────────────────────────
// Contrat de données entre web/data/*.ts (seed) et l'API backend
// Ajouter un thème = créer un fichier qui respecte ces interfaces

export type ItemType = 'letter' | 'word' | 'phrase';

export interface LetterItem {
  type: 'letter';
  id: string;       // identifiant unique, ex: "alef"
  arabic: string;   // "ا"
  latin: string;    // "a"
  fr: string;       // "a — comme dans 'ami'"
}

export interface WordItem {
  type: 'word';
  id: string;       // identifiant unique, ex: "marhaba"
  darija: string;   // "مرحبا"
  latin: string;    // "marhaba"
  fr: string;       // "Bonjour"
  audio?: string;   // URL MP3 optionnel (Cloudflare R2 plus tard)
  example?: { darija: string; fr: string };
}

export interface PhraseItem {
  type: 'phrase';
  id: string;
  darija: string;
  latin: string;
  fr: string;
  context?: string; // contexte d'utilisation
  audio?: string;
}

export type LessonItem = LetterItem | WordItem | PhraseItem;

// ─── STRUCTURE D'UN THÈME ─────────────────────────────────────────────────────

export interface ThemeLesson {
  slug: string;     // "alphabet-1" — doit correspondre au slug en DB
  title: string;
  subtitle: string;
  order: number;
  items: LessonItem[];
}

export interface Theme {
  id: string;       // "alphabet", "salutations", "chiffres"
  slug: string;     // slug du module en DB: "module-alphabet"
  title: string;    // "L'Alphabet Arabe"
  description: string;
  level: number;    // 1, 2, 3...
  icon: string;     // emoji ou chemin image
  color: string;    // couleur principale (#hex)
  lessons: ThemeLesson[];
}
