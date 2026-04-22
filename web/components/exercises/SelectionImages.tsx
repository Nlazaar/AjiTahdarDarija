"use client";

import React, { useEffect, useState, useMemo } from "react";

export type SelectionItem = {
  emoji?: string;
  image?: string;
  label?: string;
  isCorrect?: boolean;
};

interface Props {
  question?: string;       // arabe (chakle)
  questionFr?: string;     // français
  items: SelectionItem[];
  /** Nb d'items à sélectionner pour valider. Si absent et freeSelection=true → libre. */
  minSelection?: number;
  /** Mode libre : aucun "correct". L'utilisateur sélectionne ce qui lui plaît. */
  freeSelection?: boolean;
  onConfirm: () => void;
  onReadyChange?: (ready: boolean) => void;
  prompt?: string;
}

export default function SelectionImages({
  question, questionFr, items, minSelection, freeSelection,
  onConfirm, onReadyChange, prompt,
}: Props) {
  const [selected, setSelected] = useState<Set<number>>(new Set());

  // Signature stable pour figer toute opération basée sur l'index
  const itemsKey = useMemo(
    () => items.map(i => `${i.emoji ?? ''}|${i.image ?? ''}|${i.label ?? ''}`).join('§'),
    [items]
  );

  useEffect(() => { setSelected(new Set()); }, [itemsKey]);

  const toggle = (idx: number) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx); else next.add(idx);
      return next;
    });
  };

  const ready = useMemo(() => {
    if (freeSelection) return selected.size > 0;
    if (typeof minSelection === 'number') return selected.size >= minSelection;
    // Sinon : tous les "isCorrect: true" doivent être sélectionnés
    const correctIdx = items.map((it, i) => (it.isCorrect ? i : -1)).filter(i => i >= 0);
    return correctIdx.every(i => selected.has(i)) && selected.size === correctIdx.length;
  }, [selected, items, minSelection, freeSelection]);

  useEffect(() => { onReadyChange?.(ready); }, [ready, onReadyChange]);

  const headerAr = question?.trim();
  const headerFr = (prompt ?? questionFr)?.trim();

  return (
    <div className="flex flex-col gap-5">
      {headerAr && (
        <p
          dir="rtl"
          className="text-2xl font-black text-center text-white leading-snug"
          style={{ fontFamily: 'var(--font-amiri), serif' }}
        >
          {headerAr}
        </p>
      )}
      {headerFr && (
        <p className="text-sm text-[#8a9baa] font-medium text-center -mt-3">{headerFr}</p>
      )}

      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
        {items.map((it, idx) => {
          const isSel = selected.has(idx);
          return (
            <button
              key={`${itemsKey}-${idx}`}
              type="button"
              onClick={() => toggle(idx)}
              className={`flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border-2 transition-all min-h-[110px] ${
                isSel
                  ? 'border-[#58cc02] bg-[#1e3a2e]'
                  : 'border-[#2a3d47] bg-[#263744] hover:border-[#58cc02] hover:bg-[#1e3a2e]'
              }`}
              style={isSel ? { boxShadow: '0 0 0 3px rgba(88,204,2,0.25)' } : undefined}
            >
              <span className="text-4xl leading-none">{it.emoji ?? it.image ?? '❓'}</span>
              {it.label && (
                <span className="text-xs font-bold text-white text-center leading-tight">{it.label}</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
