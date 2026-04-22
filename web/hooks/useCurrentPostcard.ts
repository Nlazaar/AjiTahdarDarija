'use client';

import { useMemo } from 'react';
import { useParcours, type Unite, type Lecon } from './useParcours';
import { useSelectedUnite } from './useSelectedUnite';

export interface PostcardProgress {
  unite: Unite;
  total: number;
  completedCount: number;
  completionPercent: number;
  allCompleted: boolean;
  lecons: Lecon[];
}

/**
 * Retourne la "carte postale" active.
 * Priorité : unité sélectionnée manuellement (clic dans le parcours)
 *          → sinon 1re unité débloquée non terminée
 *          → sinon 1re unité débloquée
 *          → sinon 1re unité.
 */
export function useCurrentPostcard(): PostcardProgress | null {
  const { unites, loading } = useParcours();
  const { selectedId } = useSelectedUnite();

  return useMemo(() => {
    if (loading || unites.length === 0) return null;

    const selected = selectedId ? unites.find((u) => u.id === selectedId && u.unlocked) : null;
    const current =
      selected ??
      unites.find((u) => u.unlocked && !u.completed) ??
      unites.find((u) => u.unlocked) ??
      unites[0];

    if (!current) return null;

    const total = current.lecons.length;
    const completedCount = current.lecons.filter((l) => l.status === 'completed').length;
    const completionPercent = total > 0 ? Math.round((completedCount / total) * 100) : 0;

    return {
      unite: current,
      total,
      completedCount,
      completionPercent,
      allCompleted: total > 0 && completedCount === total,
      lecons: current.lecons,
    };
  }, [unites, loading, selectedId]);
}
