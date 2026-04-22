import { type LangTrack } from '@/context/UserContext';

/** Palette des 3 parcours — source unique de vérité pour UI. */
export const TRACK_COLORS: Record<LangTrack, { color: string; shadow: string; tint: string }> = {
  DARIJA:   { color: '#58cc02', shadow: '#46a302', tint: 'rgba(88,204,2,0.08)' },
  MSA:      { color: '#1cb0f6', shadow: '#0a8fc7', tint: 'rgba(28,176,246,0.08)' },
  RELIGION: { color: '#a855f7', shadow: '#7e3ed6', tint: 'rgba(168,85,247,0.08)' },
};

/** Bande dégradée 3 couleurs — identité visuelle des parcours en onboarding. */
export const TRACK_GRADIENT = 'linear-gradient(90deg, #58cc02 0%, #1cb0f6 50%, #a855f7 100%)';

/** Beige chaleureux partagé avec la home — remplace le blanc pur. */
export const ONBOARDING_BG = '#f8f5f0';
