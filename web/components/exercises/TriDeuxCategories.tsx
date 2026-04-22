"use client";

import React, { useEffect, useMemo, useState } from "react";

export type TriItem = {
  emoji?: string;
  label?: string;
  correct: 'A' | 'B';
};

interface Category {
  label: string;
  color?: string;
}

interface Props {
  question?: string;
  questionFr?: string;
  categorieA: Category;
  categorieB: Category;
  items: TriItem[];
  onConfirm: () => void;
  onReadyChange?: (ready: boolean) => void;
  prompt?: string;
}

export default function TriDeuxCategories({
  question, questionFr, categorieA, categorieB, items,
  onConfirm, onReadyChange, prompt,
}: Props) {
  const [placed, setPlaced] = useState<Record<number, 'A' | 'B'>>({});
  const [error, setError]   = useState<number | null>(null);

  const itemsKey = useMemo(
    () => items.map(i => `${i.emoji ?? ''}|${i.label ?? ''}|${i.correct}`).join('§'),
    [items]
  );

  useEffect(() => { setPlaced({}); setError(null); }, [itemsKey]);

  const place = (idx: number, cat: 'A' | 'B') => {
    if (placed[idx]) return;
    if (items[idx].correct === cat) {
      setPlaced(prev => ({ ...prev, [idx]: cat }));
    } else {
      setError(idx);
      setTimeout(() => setError(null), 450);
    }
  };

  const allDone = items.every((_, i) => !!placed[i]);

  useEffect(() => { onReadyChange?.(allDone); }, [allDone, onReadyChange]);

  const headerAr = question?.trim();
  const headerFr = (prompt ?? questionFr)?.trim();

  const colA = categorieA.color ?? '#58cc02';
  const colB = categorieB.color ?? '#ff4b4b';

  const remaining = items.map((it, i) => ({ ...it, _idx: i })).filter(x => !placed[x._idx]);

  return (
    <div className="flex flex-col gap-5">
      {headerAr && (
        <p
          dir="rtl"
          className="text-xl font-black text-center text-white leading-snug"
          style={{ fontFamily: 'var(--font-amiri), serif' }}
        >
          {headerAr}
        </p>
      )}
      {headerFr && (
        <p className="text-sm text-[#8a9baa] font-medium text-center -mt-3">{headerFr}</p>
      )}

      {/* Bank d'items à classer */}
      <div className="bg-[#1c2a33] rounded-2xl p-3 min-h-[120px] flex flex-wrap gap-2 justify-center items-center">
        {remaining.length === 0 ? (
          <span className="text-sm text-[#58cc02] font-bold">✓ Tout est trié !</span>
        ) : remaining.map((it) => (
          <div
            key={it._idx}
            className="flex flex-col items-center gap-1 px-3 py-2 rounded-xl bg-[#263744] border-2 border-[#2a3d47]"
            style={error === it._idx ? { animation: 'shakeX 0.35s ease', borderColor: '#ff4b4b' } : undefined}
          >
            <span className="text-3xl leading-none">{it.emoji ?? '❓'}</span>
            {it.label && <span className="text-xs font-bold text-white">{it.label}</span>}
            <div className="flex gap-1 mt-1">
              <button
                type="button"
                onClick={() => place(it._idx, 'A')}
                className="w-7 h-7 rounded-full text-white font-black text-xs flex items-center justify-center"
                style={{ background: colA }}
                title={categorieA.label}
              >A</button>
              <button
                type="button"
                onClick={() => place(it._idx, 'B')}
                className="w-7 h-7 rounded-full text-white font-black text-xs flex items-center justify-center"
                style={{ background: colB }}
                title={categorieB.label}
              >B</button>
            </div>
          </div>
        ))}
      </div>

      {/* 2 zones cibles */}
      <div className="grid grid-cols-2 gap-3">
        {([
          { key: 'A' as const, cat: categorieA, color: colA },
          { key: 'B' as const, cat: categorieB, color: colB },
        ]).map(({ key, cat, color }) => {
          const inHere = items.map((it, i) => ({ ...it, _idx: i })).filter(x => placed[x._idx] === key);
          return (
            <div
              key={key}
              className="rounded-2xl border-2 p-3 min-h-[140px] flex flex-col gap-2"
              style={{ borderColor: color, background: `${color}14` }}
            >
              <div
                className="text-xs font-black uppercase tracking-widest text-center"
                style={{ color }}
              >
                {cat.label}
              </div>
              <div className="flex flex-wrap gap-2 justify-center">
                {inHere.length === 0 ? (
                  <span className="text-xs text-[#6b7f8a] italic">vide</span>
                ) : inHere.map((it) => (
                  <div
                    key={it._idx}
                    className="flex flex-col items-center px-2 py-1 rounded-lg bg-[#1c2a33]"
                  >
                    <span className="text-2xl">{it.emoji ?? '❓'}</span>
                    {it.label && <span className="text-[10px] text-white">{it.label}</span>}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
