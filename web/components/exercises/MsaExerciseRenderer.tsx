'use client';

import React, { useState } from 'react';
import SpeakerButton from '@/components/SpeakerButton';
import { useAudioCtx } from '@/contexts/AudioContext';

type AnswerCb = (correct: boolean, correctText: string, userAnswer: any) => void;

interface MsaElement {
  id?: string;
  ar?: string;
  fr?: string;
  emoji?: string;
  [k: string]: unknown;
}

interface MsaExerciseData {
  source?: string;
  mecanique?: string | null;
  titre?: { fr?: string; ar?: string } | null;
  enonce?: { fr?: string; ar?: string } | null;
  elements?: MsaElement[];
  audioAssets?: Array<{ id: string; texte_ar?: string; voix_m?: string; voix_f?: string }>;
  bucketAudio?: string | null;
  [k: string]: unknown;
}

export interface MsaExercise {
  id: string;
  prompt: string | null;
  data: MsaExerciseData;
}

const CARD = '#1e2d35';
const CARD2 = '#243b4a';
const BORDER = '#2a3d47';
const TEXT = '#e8eaed';
const SUB = '#6b7f8a';
const GREEN = '#58cc02';
const GREEN_D = '#46a302';
const RED = '#ff4b4b';
const RED_D = '#cc2a2a';
const BLUE_D = '#1899d6';

// ─────────── Mécanique: relier_mot_image (apparier AR ↔ FR/emoji) ───────────

function RelierMotImage({ exercise, onAnswer }: { exercise: MsaExercise; onAnswer: AnswerCb }) {
  const elements = (exercise.data.elements ?? []).filter((e) => e.ar && (e.fr || e.emoji));
  const { speak } = useAudioCtx();
  const [selectedAr, setSelectedAr] = useState<string | null>(null);
  const [matched, setMatched] = useState<Record<string, string>>({}); // arId -> frId
  const [wrong, setWrong] = useState<{ ar: string; fr: string } | null>(null);

  const shuffledFr = React.useMemo(() => [...elements].sort(() => Math.random() - 0.5), [elements.length]);

  const handleArClick = (el: MsaElement) => {
    if (el.ar) speak(el.ar);
    setSelectedAr(selectedAr === el.id ? null : el.id!);
  };

  const handleFrClick = (el: MsaElement) => {
    if (!selectedAr) return;
    const arEl = elements.find((e) => e.id === selectedAr);
    if (!arEl) return;
    if (arEl.id === el.id) {
      const next = { ...matched, [selectedAr]: el.id! };
      setMatched(next);
      setSelectedAr(null);
      if (Object.keys(next).length === elements.length) {
        setTimeout(() => onAnswer(true, '', { matched: next }), 300);
      }
    } else {
      setWrong({ ar: arEl.id!, fr: el.id! });
      setTimeout(() => setWrong(null), 600);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-2">
          {elements.map((el) => {
            const done = !!matched[el.id!];
            const active = selectedAr === el.id;
            const isWrong = wrong?.ar === el.id;
            return (
              <button
                key={el.id}
                disabled={done}
                onClick={() => handleArClick(el)}
                style={{
                  padding: '14px 12px',
                  borderRadius: 14,
                  border: `2px solid ${done ? GREEN : active ? BLUE_D : isWrong ? RED : BORDER}`,
                  background: done ? '#1a3328' : isWrong ? '#3a1e1e' : CARD,
                  color: done ? GREEN : TEXT,
                  fontFamily: 'var(--font-arabic, Amiri, serif)',
                  fontSize: 22,
                  fontWeight: 700,
                  direction: 'rtl',
                  opacity: done ? 0.6 : 1,
                  cursor: done ? 'default' : 'pointer',
                  boxShadow: `0 3px 0 ${done ? GREEN_D : '#1a2830'}`,
                }}
              >
                {el.ar}
              </button>
            );
          })}
        </div>
        <div className="flex flex-col gap-2">
          {shuffledFr.map((el) => {
            const done = Object.values(matched).includes(el.id!);
            const isWrong = wrong?.fr === el.id;
            return (
              <button
                key={el.id}
                disabled={done}
                onClick={() => handleFrClick(el)}
                style={{
                  padding: '14px 12px',
                  borderRadius: 14,
                  border: `2px solid ${done ? GREEN : isWrong ? RED : BORDER}`,
                  background: done ? '#1a3328' : isWrong ? '#3a1e1e' : CARD,
                  color: done ? GREEN : TEXT,
                  fontSize: 15,
                  fontWeight: 700,
                  opacity: done ? 0.6 : 1,
                  cursor: done ? 'default' : 'pointer',
                  boxShadow: `0 3px 0 ${done ? GREEN_D : '#1a2830'}`,
                }}
              >
                {el.emoji ? <span style={{ fontSize: 22, marginRight: 6 }}>{el.emoji}</span> : null}
                {el.fr}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─────────── Mécanique: coloriage_selectif (toucher les éléments cibles) ───────────

function ColoriageSelectif({ exercise, onAnswer }: { exercise: MsaExercise; onAnswer: AnswerCb }) {
  const elements = exercise.data.elements ?? [];
  const { speak } = useAudioCtx();
  const [tapped, setTapped] = useState<Set<string>>(new Set());

  const toggle = (id: string) => {
    const el = elements.find(e => e.id === id);
    if (el?.ar) speak(el.ar);
    const next = new Set(tapped);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setTapped(next);
  };

  const handleValidate = () => {
    onAnswer(tapped.size > 0, '', { tapped: Array.from(tapped) });
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-3 gap-3">
        {elements.map((el) => {
          const on = tapped.has(el.id!);
          return (
            <button
              key={el.id}
              onClick={() => toggle(el.id!)}
              style={{
                padding: '16px 8px',
                borderRadius: 14,
                border: `2px solid ${on ? GREEN : BORDER}`,
                background: on ? '#1a3328' : CARD,
                color: on ? GREEN : TEXT,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 6,
                cursor: 'pointer',
                boxShadow: `0 3px 0 ${on ? GREEN_D : '#1a2830'}`,
              }}
            >
              {el.emoji && <span style={{ fontSize: 32 }}>{el.emoji}</span>}
              <span
                style={{
                  fontFamily: 'var(--font-arabic, Amiri, serif)',
                  fontSize: 18,
                  fontWeight: 700,
                  direction: 'rtl',
                }}
              >
                {el.ar}
              </span>
              {el.fr && <span style={{ fontSize: 11, color: SUB }}>{el.fr}</span>}
            </button>
          );
        })}
      </div>
      <button
        onClick={handleValidate}
        disabled={tapped.size === 0}
        style={{
          padding: '14px 20px',
          borderRadius: 14,
          background: tapped.size > 0 ? GREEN : BORDER,
          color: tapped.size > 0 ? 'white' : SUB,
          fontWeight: 900,
          fontSize: 15,
          cursor: tapped.size > 0 ? 'pointer' : 'default',
          boxShadow: `0 3px 0 ${GREEN_D}`,
          letterSpacing: 1,
        }}
      >
        VALIDER
      </button>
    </div>
  );
}

// ─────────── Fallback: découverte visuelle (titre + énoncé + cartes) ───────────

function VisualFallback({ exercise, onAnswer }: { exercise: MsaExercise; onAnswer: AnswerCb }) {
  const elements = exercise.data.elements ?? [];
  const [revealed, setRevealed] = useState(false);

  const handleContinue = () => {
    setRevealed(true);
    setTimeout(() => onAnswer(true, '', { reviewed: true }), 250);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-3">
        {elements.map((el) => (
          <div
            key={el.id}
            style={{
              padding: '14px 10px',
              borderRadius: 14,
              border: `2px solid ${BORDER}`,
              background: CARD,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 4,
            }}
          >
            {el.emoji && <span style={{ fontSize: 30 }}>{el.emoji}</span>}
            {el.ar && (
              <span
                style={{
                  fontFamily: 'var(--font-arabic, Amiri, serif)',
                  fontSize: 20,
                  fontWeight: 700,
                  direction: 'rtl',
                  color: TEXT,
                }}
              >
                {el.ar}
              </span>
            )}
            {el.fr && <span style={{ fontSize: 12, color: SUB, textAlign: 'center' }}>{el.fr}</span>}
            {el.ar && <SpeakerButton text={el.ar} size="sm" />}
          </div>
        ))}
      </div>
      <button
        onClick={handleContinue}
        disabled={revealed}
        style={{
          padding: '14px 20px',
          borderRadius: 14,
          background: GREEN,
          color: 'white',
          fontWeight: 900,
          fontSize: 15,
          cursor: revealed ? 'default' : 'pointer',
          boxShadow: `0 3px 0 ${GREEN_D}`,
          letterSpacing: 1,
        }}
      >
        J'AI COMPRIS
      </button>
    </div>
  );
}

// ─────────── Router principal ───────────

export function MsaExerciseRenderer({
  exercise,
  onAnswer,
}: {
  exercise: MsaExercise;
  onAnswer: AnswerCb;
}) {
  const mecanique = (exercise.data.mecanique ?? '').toLowerCase();
  const consigneAr = exercise.data.enonce?.ar || exercise.data.titre?.ar || null;

  let body: React.ReactNode;
  if (mecanique.includes('relier') || mecanique.includes('puzzle_image_mot')) {
    body = <RelierMotImage exercise={exercise} onAnswer={onAnswer} />;
  } else if (mecanique.includes('coloriage_selectif') || mecanique.includes('trouver_intrus')) {
    body = <ColoriageSelectif exercise={exercise} onAnswer={onAnswer} />;
  } else {
    body = <VisualFallback exercise={exercise} onAnswer={onAnswer} />;
  }

  return (
    <div className="flex flex-col gap-4">
      {consigneAr && (
        <div className="flex items-center gap-2" style={{ color: SUB, fontSize: 12 }}>
          <SpeakerButton text={consigneAr} size="md" />
          <span>Écoute la consigne</span>
        </div>
      )}
      {body}
    </div>
  );
}

export function isMsaExercise(ex: { data?: any }): boolean {
  return ex?.data?.source === 'msa-pdf-import';
}
