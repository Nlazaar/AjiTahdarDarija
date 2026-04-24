/**
 * Registry des typologies d'exercices.
 *
 * Source de vérité unique :
 *   - LessonClient lit ce registry pour dispatcher chaque étape de la séquence
 *     vers le bon composant React.
 *   - L'admin lit ce registry pour proposer la liste des typologies disponibles
 *     (drop-down "ajouter une étape" + drag-drop de séquence).
 *
 * Ajouter une nouvelle typologie (ex. Coloriage) :
 *   1. Créer le composant dans web/components/exercises/Coloriage.tsx
 *   2. Ajouter une entrée ici → apparaît automatiquement dans l'admin
 *   3. Le composant DOIT respecter le contrat ExerciseComponentProps ci-dessous
 *
 * Le `key` de chaque entrée est ce qui est stocké dans Lesson.content.sequence
 * (ex. "FlashCard", "ChoixLettre", etc.) — c'est aussi le nom du composant.
 */

import type { ComponentType } from 'react';
import type { DarijaLetter } from '@/components/exercises/types';

import FlashCard from '@/components/exercises/FlashCard';
import ChoixLettre from '@/components/exercises/ChoixLettre';
import AssocierLettres from '@/components/exercises/AssocierLettres';
import TrouverLesPaires from '@/components/exercises/TrouverLesPaires';
import EntendreEtChoisir from '@/components/exercises/EntendreEtChoisir';
import VraiFaux from '@/components/exercises/VraiFaux';
import DicterRomanisation from '@/components/exercises/DicterRomanisation';
import NumeroterOrdre from '@/components/exercises/NumeroterOrdre';
import PlacerDansEtoile from '@/components/exercises/PlacerDansEtoile';
import TexteReligieux from '@/components/exercises/TexteReligieux';
import SelectionImages from '@/components/exercises/SelectionImages';
import TriDeuxCategories from '@/components/exercises/TriDeuxCategories';
import RelierParTrait from '@/components/exercises/RelierParTrait';
import VoixVisuel from '@/components/exercises/VoixVisuel';
import TrouverIntrus from '@/components/exercises/TrouverIntrus';

export type ExerciseMode = 'lettre' | 'mot' | 'both';

export interface ExerciseRegistryEntry {
  /** Composant React (lazy non requis : déjà tous bundle dans LessonClient) */
  component: ComponentType<any>;
  /** Libellé FR pour l'admin */
  label: string;
  /** Emoji pour la liste/drag-drop */
  icon: string;
  /** Description courte montrée dans l'admin */
  description: string;
  /** Mode supporté : 'lettre' (alphabet), 'mot' (vocab), 'both' */
  supports: ExerciseMode;
  /** Nombre minimum d'items vocab nécessaires pour cette typologie */
  minItems: number;
}

export const EXERCISE_REGISTRY: Record<string, ExerciseRegistryEntry> = {
  FlashCard: {
    component: FlashCard,
    label: 'Flashcard',
    icon: '📇',
    description: 'Présente le mot avec audio, romanisation et traduction.',
    supports: 'both',
    minItems: 1,
  },
  ChoixLettre: {
    component: ChoixLettre,
    label: 'Choix unique',
    icon: '🎯',
    description: 'Choisir la bonne réponse parmi 3 propositions.',
    supports: 'both',
    minItems: 3,
  },
  AssocierLettres: {
    component: AssocierLettres,
    label: 'Associer',
    icon: '🔗',
    description: 'Relier chaque mot arabe à sa romanisation.',
    supports: 'both',
    minItems: 3,
  },
  TrouverLesPaires: {
    component: TrouverLesPaires,
    label: 'Trouver les paires',
    icon: '🃏',
    description: 'Mémoriser et retrouver les paires (mode jeu).',
    supports: 'both',
    minItems: 4,
  },
  EntendreEtChoisir: {
    component: EntendreEtChoisir,
    label: 'Écouter & choisir',
    icon: '🎧',
    description: "Écouter l'audio et choisir le bon mot parmi 4.",
    supports: 'both',
    minItems: 4,
  },
  VraiFaux: {
    component: VraiFaux,
    label: 'Vrai / Faux',
    icon: '✓✗',
    description: "L'association proposée est-elle correcte ?",
    supports: 'both',
    minItems: 1,
  },
  DicterRomanisation: {
    component: DicterRomanisation,
    label: 'Dicter (romanisation)',
    icon: '⌨️',
    description: 'Écouter et taper / choisir la romanisation.',
    supports: 'both',
    minItems: 4,
  },
  NumeroterOrdre: {
    component: NumeroterOrdre,
    label: 'Remettre dans l\'ordre',
    icon: '🔢',
    description: 'Cliquer les éléments dans le bon ordre chronologique.',
    supports: 'mot',
    minItems: 3,
  },
  PlacerDansEtoile: {
    component: PlacerDansEtoile,
    label: 'Placer dans l\'étoile (5 piliers)',
    icon: '⭐',
    description: 'Placer chaque mot dans la bonne branche d\'une étoile à 5 pointes.',
    supports: 'mot',
    minItems: 5,
  },
  TexteReligieux: {
    component: TexteReligieux,
    label: 'Texte religieux (lecture)',
    icon: '📖',
    description: 'Écran de lecture : bloc arabe (grand) + traduction française (+ source).',
    supports: 'mot',
    minItems: 0,
  },
  SelectionImages: {
    component: SelectionImages,
    label: 'Sélection avec emojis',
    icon: '🖼️',
    description: 'Choix multiple visuel : chaque item est un emoji + libellé, l\'apprenant coche les bonnes réponses.',
    supports: 'mot',
    minItems: 0,
  },
  TriDeuxCategories: {
    component: TriDeuxCategories,
    label: 'Tri en 2 catégories',
    icon: '🗂️',
    description: 'Chaque item doit être placé dans la catégorie A ou B (ex. "ce qu\'Allah aime" / "ce qu\'Allah n\'aime pas").',
    supports: 'mot',
    minItems: 0,
  },
  RelierParTrait: {
    component: RelierParTrait,
    label: 'Relier par un trait',
    icon: '🪢',
    description: 'Relier chaque item de gauche à sa cible de droite (paires arbitraires avec emoji).',
    supports: 'mot',
    minItems: 0,
  },
  VoixVisuel: {
    component: VoixVisuel,
    label: 'Voix ↔ Visuel',
    icon: '🎙️',
    description: "Associer chaque voix à son visuel (texte, emoji ou couleur). Modes ligne ou glisser-déposer.",
    supports: 'mot',
    minItems: 2,
  },
  TrouverIntrus: {
    component: TrouverIntrus,
    label: "Trouver l'intrus",
    icon: '🕵️',
    description: "Écouter une série de voix et repérer le visuel qui n'a pas été prononcé.",
    supports: 'mot',
    minItems: 2,
  },
};

export type ExerciseTypeKey = keyof typeof EXERCISE_REGISTRY;

/** Liste ordonnée des typologies (pour l'admin) */
export const EXERCISE_TYPES: Array<{ key: string } & ExerciseRegistryEntry> = Object.entries(
  EXERCISE_REGISTRY,
).map(([key, entry]) => ({ key, ...entry }));

export function getExerciseType(key: string): ExerciseRegistryEntry | undefined {
  return EXERCISE_REGISTRY[key];
}

/** Type item utilisé par tous les composants (alias DarijaLetter pour clarté) */
export type ExerciseItem = DarijaLetter;
