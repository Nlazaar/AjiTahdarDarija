// ─── REGISTRY CENTRAL DES THÈMES ─────────────────────────────────────────────
//
// Pour AJOUTER un thème :
//   1. Créer web/data/mon-theme.ts qui exporte une constante Theme
//   2. L'importer ici et l'ajouter à THEMES
//   3. Lancer `npm run prisma:seed` dans backend/ pour peupler la DB
//
// Pour SUPPRIMER un thème :
//   1. Retirer l'import et l'entrée dans THEMES
//   2. (optionnel) supprimer le fichier .ts
//
// Le frontend lit TOUJOURS depuis l'API en production.
// Ces fichiers servent de source de vérité pour les seeds et les types.

import type { Theme } from './types';

// ── Niveau 1 — Débutant ───────────────────────────────────────────────────────
import { alphabetTheme }        from './alphabet';
import { salutationsTheme }     from './salutations';
import { sePresentertTheme }    from './se-presenter';
import { chiffresTheme }        from './chiffres';
import { couleursTheme }        from './couleurs';

// ── Niveau 2 — Élémentaire ────────────────────────────────────────────────────
import { familleTheme }         from './famille';
import { nourritureTheme }      from './nourriture';
import { directionsTheme }      from './directions';
import { tempsTheme }           from './temps';

// ── Niveau 3 — Intermédiaire ──────────────────────────────────────────────────
import { achatsTheme }          from './achats';
import { transportsTheme }      from './transports';
import { logementTheme }        from './logement';
import { corpsTheme }           from './corps';
import { travailTheme }         from './travail';

// ── Niveau 4 — Avancé ─────────────────────────────────────────────────────────
import { expressionsTheme }     from './expressions';
import { darijaAvanceTheme }    from './darija-avance';

// ─── LISTE DES THÈMES (ordre = ordre d'affichage sur /progress) ───────────────
export const THEMES: Theme[] = [
  // Niveau 1
  alphabetTheme,
  salutationsTheme,
  sePresentertTheme,
  chiffresTheme,
  couleursTheme,
  // Niveau 2
  familleTheme,
  nourritureTheme,
  directionsTheme,
  tempsTheme,
  // Niveau 3
  achatsTheme,
  transportsTheme,
  logementTheme,
  corpsTheme,
  travailTheme,
  // Niveau 4
  expressionsTheme,
  darijaAvanceTheme,
];

// ─── HELPERS ─────────────────────────────────────────────────────────────────
export const getTheme        = (id: string)   => THEMES.find((t) => t.id === id);
export const getThemeBySlug  = (slug: string) => THEMES.find((t) => t.slug === slug);
export const getAllThemes     = ()             => THEMES;
export const getThemeItems   = (id: string)   => getTheme(id)?.lessons.flatMap((l) => l.items) ?? [];
export const getThemeLesson  = (themeId: string, lessonSlug: string) =>
  getTheme(themeId)?.lessons.find((l) => l.slug === lessonSlug);

export type { Theme, LessonItem, LetterItem, WordItem, PhraseItem, ThemeLesson } from './types';
