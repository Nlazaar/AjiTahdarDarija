'use client';

import { useEffect, useState, useCallback } from 'react';

const STORAGE_KEY = 'selectedUniteId';
const EVENT_NAME = 'selected-unite-change';

/**
 * Sélection active d'une unité pour le panneau "carte postale".
 * Persiste dans sessionStorage (reset à la fermeture de l'onglet).
 * Synchro cross-composant via CustomEvent (les StorageEvent ne se propagent
 * pas dans l'onglet qui écrit).
 */
export function useSelectedUnite() {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) setSelectedId(saved);
    } catch { /* noop */ }

    const onChange = (e: Event) => {
      const detail = (e as CustomEvent<string | null>).detail;
      setSelectedId(detail ?? null);
    };
    window.addEventListener(EVENT_NAME, onChange as EventListener);
    return () => window.removeEventListener(EVENT_NAME, onChange as EventListener);
  }, []);

  const select = useCallback((id: string | null) => {
    try {
      if (id) sessionStorage.setItem(STORAGE_KEY, id);
      else sessionStorage.removeItem(STORAGE_KEY);
    } catch { /* noop */ }
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: id }));
  }, []);

  return { selectedId, select };
}
