export interface CityDescription {
  photoEmoji: string;
  photoCaption: string;
  /** Image du bandeau de section (CityCard). Toujours visible. */
  photoUrl?: string;
  /** Image révélée dans la carte postale (CartePostalePanel). Fallback → photoUrl si vide. */
  postcardUrl?: string;
  histoire: string;
  motTypique: { ar: string; latin: string; fr: string };
  specialite: string;
  faitCulturel: string;
  aVoir: string;
  musique: string;
}

export interface HadithDescription {
  emoji?: string;
  subtitle?: string;
  description?: string;
  hadith?: { ar: string; fr: string; source?: string };
}
