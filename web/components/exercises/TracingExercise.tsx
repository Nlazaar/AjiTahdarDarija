'use client';

import React, { useEffect, useRef, useState } from 'react';

/**
 * Exercise créatif : l'élève trace une lettre / un mot arabe au doigt ou à la souris.
 * - Affiche la lettre-cible en arrière-plan (fantôme).
 * - L'utilisateur dessine par-dessus.
 * - On mesure le "remplissage" : % de pixels ghost recouverts par le trait.
 * - Seuil de réussite : data.threshold (par défaut 0.45).
 */

const BG = '#131f24';
const CARD = '#1e2d35';
const CARD2 = '#243b4a';
const BORDER = '#2a3d47';
const TEXT = '#e8eaed';
const SUB = '#6b7f8a';
const GREEN = '#58cc02';
const GREEN_D = '#46a302';
const RED = '#ff4b4b';
const RED_D = '#cc2a2a';
const BLUE = '#1cb0f6';
const BLUE_D = '#1899d6';

type AnswerCb = (correct: boolean, correctText: string, userAnswer: any) => void;

interface Props {
  exercise: {
    id: string;
    prompt?: string | null;
    data?: {
      target?: string;   // e.g. "ب" or "سلام"
      hint?: string;
      threshold?: number; // 0..1
    };
    points?: number;
  };
  onAnswer: AnswerCb;
}

const CANVAS = 320;

export default function TracingExercise({ exercise, onAnswer }: Props) {
  const target = exercise.data?.target ?? '';
  const hint = exercise.data?.hint ?? '';
  const threshold = Math.max(0.1, Math.min(0.95, exercise.data?.threshold ?? 0.45));

  const ghostRef = useRef<HTMLCanvasElement>(null);
  const userRef = useRef<HTMLCanvasElement>(null);
  const [drawing, setDrawing] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState<number | null>(null);

  // Draw ghost target on mount
  useEffect(() => {
    const c = ghostRef.current;
    if (!c) return;
    const ctx = c.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, CANVAS, CANVAS);
    ctx.fillStyle = `${BLUE}33`;
    ctx.font = '900 220px "Amiri", serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.direction = 'rtl';
    ctx.fillText(target, CANVAS / 2, CANVAS / 2);
  }, [target]);

  const getPoint = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const c = userRef.current!;
    const rect = c.getBoundingClientRect();
    return {
      x: ((e.clientX - rect.left) / rect.width) * CANVAS,
      y: ((e.clientY - rect.top) / rect.height) * CANVAS,
    };
  };

  const start = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (submitted) return;
    setDrawing(true);
    const ctx = userRef.current?.getContext('2d');
    if (!ctx) return;
    const p = getPoint(e);
    ctx.strokeStyle = GREEN;
    ctx.lineWidth = 18;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };
  const move = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawing || submitted) return;
    const ctx = userRef.current?.getContext('2d');
    if (!ctx) return;
    const p = getPoint(e);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
  };
  const end = () => setDrawing(false);

  const clear = () => {
    if (submitted) return;
    const ctx = userRef.current?.getContext('2d');
    ctx?.clearRect(0, 0, CANVAS, CANVAS);
  };

  const check = () => {
    if (submitted) return;
    const ghost = ghostRef.current?.getContext('2d');
    const user = userRef.current?.getContext('2d');
    if (!ghost || !user) return;
    const g = ghost.getImageData(0, 0, CANVAS, CANVAS).data;
    const u = user.getImageData(0, 0, CANVAS, CANVAS).data;

    let ghostPixels = 0;
    let overlap = 0;
    for (let i = 0; i < g.length; i += 4) {
      if (g[i + 3] > 0) {
        ghostPixels++;
        if (u[i + 3] > 0) overlap++;
      }
    }
    const ratio = ghostPixels > 0 ? overlap / ghostPixels : 0;
    setScore(ratio);
    setSubmitted(true);
    const ok = ratio >= threshold;
    setTimeout(() => onAnswer(ok, target, { ratio: Math.round(ratio * 100) / 100 }), 500);
  };

  return (
    <div className="flex flex-col gap-4 items-center">
      {/* Target prompt */}
      <div className="rounded-2xl p-3 w-full text-center" style={{
        background: CARD2, border: `2px solid ${BORDER}`,
      }}>
        <div className="text-[10px] font-black uppercase tracking-widest mb-1" style={{ color: SUB }}>
          🎨 Trace la lettre
        </div>
        <div style={{
          fontFamily: 'var(--font-arabic, Amiri, serif)',
          direction: 'rtl', fontSize: 32, fontWeight: 800, color: TEXT,
        }}>{target}</div>
        {hint && <div className="text-[11px] font-medium mt-1" style={{ color: SUB }}>💡 {hint}</div>}
      </div>

      {/* Canvas area */}
      <div
        className="relative rounded-2xl overflow-hidden"
        style={{
          width: CANVAS, height: CANVAS,
          background: '#0c1418',
          border: `2px solid ${submitted ? (score! >= threshold ? GREEN : RED) : BORDER}`,
          boxShadow: `0 4px 12px rgba(0,0,0,0.3)`,
        }}
      >
        <canvas
          ref={ghostRef}
          width={CANVAS}
          height={CANVAS}
          className="absolute inset-0 pointer-events-none"
          style={{ width: '100%', height: '100%' }}
        />
        <canvas
          ref={userRef}
          width={CANVAS}
          height={CANVAS}
          className="absolute inset-0"
          style={{ width: '100%', height: '100%', touchAction: 'none', cursor: submitted ? 'default' : 'crosshair' }}
          onPointerDown={start}
          onPointerMove={move}
          onPointerUp={end}
          onPointerLeave={end}
          onPointerCancel={end}
        />
      </div>

      {submitted && score !== null && (
        <div className="text-[13px] font-bold text-center" style={{
          color: score >= threshold ? GREEN : RED,
        }}>
          Précision : {Math.round(score * 100)}% {score >= threshold ? '✓' : `(seuil ${Math.round(threshold * 100)}%)`}
        </div>
      )}

      {!submitted && (
        <div className="flex gap-2 w-full">
          <button
            onClick={clear}
            className="flex-1 py-3 rounded-2xl font-black text-[12px] uppercase tracking-widest transition-all active:translate-y-0.5"
            style={{
              background: CARD2, color: SUB,
              border: `2px solid ${BORDER}`, cursor: 'pointer',
            }}
          >
            ⟲ Effacer
          </button>
          <button
            onClick={check}
            className="flex-[2] py-3 rounded-2xl font-black text-[13px] uppercase tracking-widest transition-all active:translate-y-0.5"
            style={{
              background: GREEN, color: 'white',
              border: 'none', cursor: 'pointer',
              boxShadow: `0 4px 0 ${GREEN_D}`,
            }}
          >
            Vérifier
          </button>
        </div>
      )}
    </div>
  );
}

export function isTracingExercise(ex: any): boolean {
  if (!ex) return false;
  if (ex.type === 'DRAWING') return true;
  if (ex.data?.mechanic === 'tracing' || ex.data?.mechanic === 'drawing') return true;
  return false;
}
