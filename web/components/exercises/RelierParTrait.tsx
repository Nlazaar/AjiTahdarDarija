"use client";

import React, { useEffect, useMemo, useState } from "react";

export type RpTNode = {
  id: string;
  emoji?: string;
  label?: string;
};

interface Props {
  question?: string;
  questionFr?: string;
  pairesGauche: RpTNode[];      // Source (chaque item se relie à une cible)
  pairesDroite: RpTNode[];      // Cibles (peuvent recevoir plusieurs sources)
  /** Map id-gauche → id-droite */
  correct: Record<string, string>;
  onConfirm: () => void;
  onReadyChange?: (ready: boolean) => void;
  prompt?: string;
}

export default function RelierParTrait({
  question, questionFr, pairesGauche, pairesDroite, correct,
  onConfirm, onReadyChange, prompt,
}: Props) {
  // Map id-gauche → id-droite (réponse de l'utilisateur)
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [error, setError] = useState<{ left: string; right: string } | null>(null);

  const sigKey = useMemo(
    () => pairesGauche.map(g => g.id).join(',') + '||' + pairesDroite.map(d => d.id).join(','),
    [pairesGauche, pairesDroite]
  );

  useEffect(() => {
    setAnswers({});
    setSelectedLeft(null);
    setError(null);
  }, [sigKey]);

  const tryConnect = (rightId: string) => {
    if (!selectedLeft) return;
    const expected = correct[selectedLeft];
    if (expected === rightId) {
      setAnswers(prev => ({ ...prev, [selectedLeft]: rightId }));
      setSelectedLeft(null);
    } else {
      setError({ left: selectedLeft, right: rightId });
      setTimeout(() => setError(null), 450);
    }
  };

  const handleLeft = (id: string) => {
    if (answers[id]) return; // déjà reliée
    setSelectedLeft(prev => prev === id ? null : id);
  };

  const allDone = pairesGauche.every(g => !!answers[g.id]);
  useEffect(() => { onReadyChange?.(allDone); }, [allDone, onReadyChange]);

  const headerAr = question?.trim();
  const headerFr = (prompt ?? questionFr)?.trim();

  // Couleur stable par cible (pour visualiser les groupes)
  const targetColor = (idx: number) => {
    const palette = ['#1cb0f6', '#58cc02', '#ce82ff', '#ff9600', '#ff4b4b', '#10b981'];
    return palette[idx % palette.length];
  };

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

      <div className="grid grid-cols-2 gap-4">
        {/* Colonne gauche */}
        <div className="flex flex-col gap-2">
          {pairesGauche.map(g => {
            const linkedRight = answers[g.id];
            const targetIdx = linkedRight ? pairesDroite.findIndex(d => d.id === linkedRight) : -1;
            const color = targetIdx >= 0 ? targetColor(targetIdx) : null;
            const isSel = selectedLeft === g.id;
            const errored = error?.left === g.id;
            return (
              <button
                key={g.id}
                type="button"
                onClick={() => handleLeft(g.id)}
                disabled={!!linkedRight}
                className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all text-left ${
                  linkedRight
                    ? 'opacity-90 cursor-default'
                    : isSel
                      ? 'border-[#1cb0f6] bg-[#1a2e3e]'
                      : 'border-[#2a3d47] bg-[#263744] hover:border-[#1cb0f6] hover:bg-[#1a2e3e]'
                }`}
                style={{
                  ...(color ? { borderColor: color, background: `${color}1f` } : {}),
                  ...(errored ? { animation: 'shakeX 0.35s ease', borderColor: '#ff4b4b' } : {}),
                }}
              >
                <span className="text-2xl">{g.emoji ?? '•'}</span>
                {g.label && <span className="text-sm font-bold text-white">{g.label}</span>}
              </button>
            );
          })}
        </div>

        {/* Colonne droite */}
        <div className="flex flex-col gap-2 justify-around">
          {pairesDroite.map((d, idx) => {
            const color = targetColor(idx);
            const errored = error?.right === d.id;
            const linkedCount = Object.values(answers).filter(v => v === d.id).length;
            return (
              <button
                key={d.id}
                type="button"
                onClick={() => tryConnect(d.id)}
                disabled={!selectedLeft}
                className="flex items-center gap-3 p-4 rounded-2xl border-2 transition-all text-left"
                style={{
                  borderColor: color,
                  background: `${color}1a`,
                  opacity: !selectedLeft ? 0.85 : 1,
                  ...(errored ? { animation: 'shakeX 0.35s ease', borderColor: '#ff4b4b' } : {}),
                }}
              >
                <span className="text-3xl">{d.emoji ?? '•'}</span>
                <div className="flex flex-col">
                  {d.label && <span className="text-sm font-black text-white">{d.label}</span>}
                  {linkedCount > 0 && (
                    <span className="text-[10px] font-bold" style={{ color }}>
                      ● {linkedCount} relié{linkedCount > 1 ? 's' : ''}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
