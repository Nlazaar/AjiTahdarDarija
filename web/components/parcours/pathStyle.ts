'use client';

import { useEffect, useState } from 'react';

export type PathStyle = 'serpentin' | 'calligraphie';

export const PATH_STYLE_STORAGE_KEY = 'parcoursPathStyle';

export const PATH_STYLE_OPTIONS: Array<{ key: PathStyle; label: string; description: string }> = [
  {
    key: 'serpentin',
    label: 'Serpentin',
    description: 'Trajet zigzag en pointillés avec halte aux étapes. Style actuel par défaut.',
  },
  {
    key: 'calligraphie',
    label: 'Calligraphie',
    description: 'Trait de calame plein qui se remplit à mesure que tu progresses, avec noeuds pulsants.',
  },
];

const VALID: PathStyle[] = ['serpentin', 'calligraphie'];

export function usePathStyle(): PathStyle {
  const [style, setStyle] = useState<PathStyle>('serpentin');

  useEffect(() => {
    const read = () => {
      try {
        const saved = localStorage.getItem(PATH_STYLE_STORAGE_KEY);
        if (saved && (VALID as string[]).includes(saved)) {
          setStyle(saved as PathStyle);
        }
      } catch {}
    };
    read();
    const onStorage = (e: StorageEvent) => {
      if (e.key === PATH_STYLE_STORAGE_KEY) read();
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  return style;
}
