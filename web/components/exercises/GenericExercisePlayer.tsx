'use client';

import React, { useState, useEffect } from 'react';
import { useAudio } from '@/hooks/useAudio';
import SpeakerButton from '@/components/SpeakerButton';
import { MsaExerciseRenderer, isMsaExercise } from './MsaExerciseRenderer';
import { AcademyExerciseRenderer, isAcademyExercise } from './AcademyExerciseRenderer';
import ArabicKeyboardExercise, { isArabicKeyboardExercise } from './ArabicKeyboardExercise';
import TracingExercise, { isTracingExercise } from './TracingExercise';

// Détecte du texte contenant de l'arabe (plage U+0600–U+06FF)
const hasArabic = (s?: string | null) => !!s && /[\u0600-\u06FF]/.test(s);

// ── Types ─────────────────────────────────────────────────────────────────────

export interface DbExercise {
  id: string;
  type: 'MULTIPLE_CHOICE' | 'FILL_BLANK' | 'TRANSLATION' | 'REORDER' | 'LISTENING'
      | 'ARABIC_KEYBOARD' | 'DRAWING' | 'MATCHING' | 'DUEL';
  prompt: string | null;
  data: any;
  answer: any;
  points: number;
}

export interface CollectedAnswer {
  exerciseId: string;
  answer: any;
}

interface Props {
  exercises: DbExercise[];
  onFinish:  (xp: number, answers: CollectedAnswer[]) => void;
}

// ── Theme constants ──────────────────────────────────────────────────────────

const BG       = '#131f24';
const CARD     = '#1e2d35';
const CARD2    = '#243b4a';
const BORDER   = '#2a3d47';
const TEXT     = '#e8eaed';
const SUB      = '#6b7f8a';
const GREEN    = '#58cc02';
const GREEN_D  = '#46a302';
const RED      = '#ff4b4b';
const RED_D    = '#cc2a2a';
const BLUE     = '#1cb0f6';
const BLUE_D   = '#1899d6';
const GOLD     = '#ffc800';
const AMBER    = '#e9a84c';

// ── Success messages ─────────────────────────────────────────────────────────

const SUCCESS = ['Super !', 'Excellent !', 'Parfait !', 'Bravo !', 'Bien joué !', "C'est ça !", 'Tu assures !'];
const randomSuccess = () => SUCCESS[Math.floor(Math.random() * SUCCESS.length)];

// ── Exercise type labels ─────────────────────────────────────────────────────

const TYPE_LABELS: Record<string, { icon: string; label: string }> = {
  MULTIPLE_CHOICE: { icon: '❓', label: 'Choisis la bonne réponse' },
  FILL_BLANK:      { icon: '✏️', label: 'Complète la phrase' },
  TRANSLATION:     { icon: '🌍', label: 'Traduis cette expression' },
  REORDER:         { icon: '🔀', label: "Remets dans l'ordre" },
  LISTENING:       { icon: '🎧', label: 'Écoute et réponds' },
  ARABIC_KEYBOARD: { icon: '⌨️', label: 'Écris en arabe' },
  DRAWING:         { icon: '🎨', label: 'Dessine / Colorie' },
  MATCHING:        { icon: '🔗', label: 'Associe les paires' },
  DUEL:            { icon: '⚔️', label: 'Duel' },
};

// ── Sous-composants ───────────────────────────────────────────────────────────

type AnswerCb = (correct: boolean, correctText: string, userAnswer: any) => void;

function MultipleChoice({ exercise, onAnswer }: { exercise: DbExercise; onAnswer: AnswerCb }) {
  const [selected, setSelected] = useState<string | null>(null);
  const options: { id: string; text: string; transliteration?: string }[] = exercise.data?.options ?? [];
  const correctId: string = exercise.answer?.id ?? '';

  const handleSelect = (id: string) => {
    if (selected) return;
    setSelected(id);
    const correctText = options.find(o => o.id === correctId)?.text ?? '';
    setTimeout(() => onAnswer(id === correctId, correctText, { id }), 350);
  };

  return (
    <div className="flex flex-col gap-3">
      {options.map(opt => {
        const isSelected = selected === opt.id;
        const isCorrect  = opt.id === correctId;
        let bg = CARD, border = BORDER, color = TEXT;
        if (isSelected && isCorrect)              { bg = '#1a3328'; border = GREEN; color = GREEN; }
        if (isSelected && !isCorrect)             { bg = '#3a1e1e'; border = RED; color = RED; }
        if (selected && !isSelected && isCorrect) { bg = '#1a3328'; border = GREEN; color = GREEN; }

        return (
          <button key={opt.id} onClick={() => handleSelect(opt.id)}
            className="w-full text-left transition-all duration-150 active:translate-y-0.5"
            style={{
              padding: '16px 18px', borderRadius: 16,
              border: `2px solid ${border}`, background: bg, color,
              cursor: selected ? 'default' : 'pointer',
              boxShadow: `0 4px 0 ${isSelected ? (isCorrect ? GREEN_D : RED_D) : '#1a2830'}`,
              display: 'flex', alignItems: 'center', gap: 12,
            }}>
            <div style={{ flex: 1 }}>
              <span className="text-[15px] font-bold">{opt.text}</span>
              {opt.transliteration && (
                <span className="text-[11px] ml-2" style={{ color: SUB }}>({opt.transliteration})</span>
              )}
            </div>
            {hasArabic(opt.text) && (
              <span onClick={(e) => e.stopPropagation()}>
                <SpeakerButton text={opt.text} size="sm" />
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

function FillBlank({ exercise, onAnswer }: { exercise: DbExercise; onAnswer: AnswerCb }) {
  const [selected, setSelected] = useState<string | null>(null);
  const options: string[]  = exercise.data?.options ?? [];
  const sentence: string   = exercise.data?.sentence ?? '';
  const correctText: string = exercise.answer?.text ?? '';

  const handleSelect = (opt: string) => {
    if (selected) return;
    setSelected(opt);
    setTimeout(() => onAnswer(opt === correctText, correctText, { text: opt }), 350);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Sentence with blank */}
      <div className="rounded-2xl p-4" style={{
        background: CARD2, border: `2px solid ${BORDER}`,
        fontFamily: 'var(--font-arabic, Amiri, serif)',
        direction: 'rtl', textAlign: 'right',
        fontSize: 20, fontWeight: 700, color: TEXT,
        lineHeight: 1.8, minHeight: 60,
      }}>
        {selected ? sentence.replace('___', selected) : sentence}
      </div>
      {/* Options */}
      <div className="flex flex-wrap gap-2">
        {options.map(opt => {
          const isSelected = selected === opt;
          const isCorrect  = opt === correctText;
          let bg = CARD, border = BORDER, color = TEXT;
          if (isSelected && isCorrect)              { bg = '#1a3328'; border = GREEN; color = GREEN; }
          if (isSelected && !isCorrect)             { bg = '#3a1e1e'; border = RED; color = RED; }
          if (selected && !isSelected && isCorrect) { bg = '#1a3328'; border = GREEN; color = GREEN; }
          return (
            <button key={opt} onClick={() => handleSelect(opt)}
              className="transition-all duration-150 active:translate-y-0.5"
              style={{
                padding: '12px 20px', borderRadius: 14,
                border: `2px solid ${border}`, background: bg, color,
                fontWeight: 800, fontSize: 14,
                cursor: selected ? 'default' : 'pointer',
                boxShadow: `0 3px 0 ${isSelected ? (isCorrect ? GREEN_D : RED_D) : '#1a2830'}`,
              }}>{opt}</button>
          );
        })}
      </div>
    </div>
  );
}

function TranslationInput({ exercise, onAnswer }: { exercise: DbExercise; onAnswer: AnswerCb }) {
  const [input,     setInput]     = useState('');
  const [submitted, setSubmitted] = useState(false);
  const correct: string = exercise.answer?.transliteration ?? exercise.answer?.text ?? '';
  const isCorrect = submitted && input.trim().toLowerCase() === correct.toLowerCase();

  const handleSubmit = () => {
    if (!input.trim() || submitted) return;
    setSubmitted(true);
    const ok = input.trim().toLowerCase() === correct.toLowerCase();
    setTimeout(() => onAnswer(ok, correct, { text: input.trim() }), 500);
  };

  return (
    <div className="flex flex-col gap-3">
      {exercise.data?.hint && (
        <div className="text-[12px] font-medium" style={{ color: SUB }}>💡 {exercise.data.hint}</div>
      )}
      <input
        type="text" value={input}
        onChange={e => !submitted && setInput(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && handleSubmit()}
        placeholder="Écris ta réponse…"
        disabled={submitted}
        className="w-full outline-none transition-all"
        style={{
          padding: '16px 18px', borderRadius: 16,
          border: `2px solid ${submitted ? (isCorrect ? GREEN : RED) : input ? BLUE : BORDER}`,
          background: submitted ? (isCorrect ? '#1a3328' : '#3a1e1e') : CARD2,
          fontSize: 16, fontWeight: 700, color: TEXT,
          boxSizing: 'border-box',
        }}
      />
      {submitted && (
        <div className="text-[13px] font-bold" style={{ color: SUB }}>
          Bonne réponse : <span style={{ color: GREEN }}>{correct}</span>
        </div>
      )}
      {!submitted && (
        <button onClick={handleSubmit}
          className="w-full py-4 rounded-2xl font-black text-[14px] uppercase tracking-widest transition-all active:translate-y-0.5"
          style={{
            background: input.trim() ? GREEN : CARD2,
            color: input.trim() ? 'white' : SUB,
            border: 'none', cursor: input.trim() ? 'pointer' : 'default',
            boxShadow: input.trim() ? `0 4px 0 ${GREEN_D}` : 'none',
          }}>Vérifier</button>
      )}
    </div>
  );
}

function ReorderExercise({ exercise, onAnswer }: { exercise: DbExercise; onAnswer: AnswerCb }) {
  const items: string[]        = exercise.data?.items ?? exercise.data?.letters ?? [];
  const correctOrder: string[] = exercise.answer?.order ?? [];
  const [bank,      setBank]      = useState<string[]>(() => [...items].sort(() => Math.random() - 0.5));
  const [placed,    setPlaced]    = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const addToPlaced = (item: string, idx: number) => {
    if (submitted) return;
    setPlaced(prev => [...prev, item]);
    setBank(prev => prev.filter((_, i) => i !== idx));
  };

  const removeFromPlaced = (idx: number) => {
    if (submitted) return;
    const item = placed[idx];
    setPlaced(prev => prev.filter((_, i) => i !== idx));
    setBank(prev => [...prev, item]);
  };

  const handleCheck = () => {
    if (submitted || placed.length === 0) return;
    setSubmitted(true);
    const ok = JSON.stringify(placed) === JSON.stringify(correctOrder);
    setTimeout(() => onAnswer(ok, correctOrder.join(' '), { order: placed }), 500);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Placed area */}
      <div className="min-h-[60px] rounded-2xl p-3 flex flex-wrap gap-2"
        style={{ background: CARD2, border: `2px dashed ${placed.length > 0 ? BLUE : BORDER}` }}>
        {placed.length === 0 && (
          <span className="text-[13px] font-bold m-auto" style={{ color: SUB }}>
            Touche les mots dans le bon ordre
          </span>
        )}
        {placed.map((item, i) => (
          <button key={`p-${i}`} onClick={() => removeFromPlaced(i)}
            className="transition-all active:scale-95"
            style={{
              padding: '10px 16px', borderRadius: 12,
              background: submitted ? (JSON.stringify(placed) === JSON.stringify(correctOrder) ? '#1a3328' : '#3a1e1e') : CARD,
              border: `2px solid ${submitted ? (JSON.stringify(placed) === JSON.stringify(correctOrder) ? GREEN : RED) : BLUE}`,
              color: TEXT, fontWeight: 800, fontSize: 15,
              cursor: submitted ? 'default' : 'pointer',
            }}>{item}</button>
        ))}
      </div>
      {/* Bank */}
      <div className="flex flex-wrap gap-2">
        {bank.map((item, i) => (
          <button key={`b-${i}`} onClick={() => addToPlaced(item, i)}
            className="transition-all active:scale-95 active:translate-y-0.5"
            style={{
              padding: '10px 16px', borderRadius: 12,
              background: CARD, border: `2px solid ${BORDER}`,
              color: TEXT, fontWeight: 800, fontSize: 15,
              cursor: 'pointer', boxShadow: `0 3px 0 #1a2830`,
            }}>{item}</button>
        ))}
      </div>
      {/* Check button */}
      {!submitted && (
        <button onClick={handleCheck}
          className="w-full py-4 rounded-2xl font-black text-[14px] uppercase tracking-widest transition-all active:translate-y-0.5"
          style={{
            background: placed.length > 0 ? GREEN : CARD2,
            color: placed.length > 0 ? 'white' : SUB,
            border: 'none', cursor: placed.length > 0 ? 'pointer' : 'default',
            boxShadow: placed.length > 0 ? `0 4px 0 ${GREEN_D}` : 'none',
          }}>Vérifier</button>
      )}
    </div>
  );
}

// ── Confettis ─────────────────────────────────────────────────────────────────

const CONFETTI_COLORS = [GOLD, '#2a9d8f', '#e76f51', '#38bdf8', '#a78bfa', '#fbbf24'];

function Confetti() {
  const pieces = Array.from({ length: 40 }, (_, i) => i);
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-10">
      {pieces.map(i => {
        const color = CONFETTI_COLORS[i % CONFETTI_COLORS.length];
        const left  = `${(i * 2.5 + 1) % 100}%`;
        const delay = `${(i * 0.07) % 1.5}s`;
        const size  = 7 + (i % 5) * 2;
        return (
          <div key={i} style={{
            position: 'absolute', top: '-20px', left,
            width: size, height: size,
            background: color, borderRadius: i % 3 === 0 ? '50%' : 2,
            animation: `confettiFall 2.5s ease-in ${delay} both`,
          }} />
        );
      })}
      <style>{`
        @keyframes confettiFall {
          0%   { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(105vh) rotate(720deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

// ── Écran Bravo ───────────────────────────────────────────────────────────────

function BravoScreen({ xp, correct, total, onContinue }: {
  xp: number; correct: number; total: number; onContinue: () => void;
}) {
  const pct  = total > 0 ? Math.round((correct / total) * 100) : 0;
  const gems = Math.floor(xp / 5);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-5 py-8"
      style={{ background: BG, animation: 'fadeUp 0.4s ease both' }}>
      <Confetti />
      <div className="w-full max-w-[420px] flex flex-col items-center gap-6 relative z-20">

        {/* Trophy */}
        <div className="flex items-center justify-center rounded-full"
          style={{
            width: 130, height: 130,
            background: pct >= 80 ? GOLD : pct >= 50 ? AMBER : '#4a5d6a',
            fontSize: 60,
            boxShadow: `0 8px 0 ${pct >= 80 ? '#e5a000' : pct >= 50 ? '#b06818' : '#374151'}`,
            animation: 'bounceIn 0.5s ease both 0.1s',
          }}>
          {pct >= 80 ? '🏆' : pct >= 50 ? '⭐' : '💪'}
        </div>

        {/* Title */}
        <div className="text-center">
          <h1 className="text-[28px] font-black" style={{ color: TEXT }}>
            {pct >= 80 ? 'Excellent !' : pct >= 50 ? 'Bien joué !' : 'Continue comme ça !'}
          </h1>
          <p className="text-[12px] font-bold uppercase tracking-widest mt-1" style={{ color: SUB }}>
            Leçon terminée
          </p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-3 gap-3 w-full">
          {[
            { label: 'XP gagné', value: `+${xp}`,  color: AMBER, icon: '⭐' },
            { label: 'Score',    value: `${pct}%`,  color: '#2a9d8f', icon: '🎯' },
            { label: 'Gemmes',   value: `+${gems}`, color: BLUE,  icon: '💎' },
          ].map(s => (
            <div key={s.label} className="rounded-2xl p-3 text-center"
              style={{
                background: CARD, border: `2px solid ${BORDER}`,
                boxShadow: `0 3px 0 #1a2830`,
              }}>
              <div className="text-[22px] mb-1">{s.icon}</div>
              <div className="text-[20px] font-black" style={{ color: s.color }}>{s.value}</div>
              <div className="text-[10px] font-bold uppercase mt-1" style={{ color: SUB }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Progress bar */}
        <div className="w-full">
          <div className="flex justify-between mb-1.5">
            <span className="text-[11px] font-bold" style={{ color: SUB }}>Bonnes réponses</span>
            <span className="text-[11px] font-black" style={{ color: GREEN }}>{correct} / {total}</span>
          </div>
          <div className="h-3 rounded-full overflow-hidden" style={{ background: BORDER }}>
            <div className="h-full rounded-full transition-all duration-1000"
              style={{
                width: `${pct}%`,
                background: `linear-gradient(90deg, ${GREEN}, ${AMBER})`,
              }} />
          </div>
        </div>

        {/* CTA */}
        <button onClick={onContinue}
          className="w-full py-4 rounded-2xl font-black text-[15px] uppercase tracking-widest text-white transition-all active:translate-y-0.5"
          style={{ background: GREEN, boxShadow: `0 5px 0 ${GREEN_D}` }}>
          Continuer
        </button>
      </div>
    </div>
  );
}

// ── Player principal ──────────────────────────────────────────────────────────

export default function GenericExercisePlayer({ exercises, onFinish }: Props) {
  const { speak } = useAudio();
  const [current,   setCurrent]   = useState(0);
  const [answered,  setAnswered]  = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [feedback,  setFeedback]  = useState('');
  const [xp,        setXp]        = useState(0);
  const [correct,   setCorrect]   = useState(0);
  const [answers,   setAnswers]   = useState<CollectedAnswer[]>([]);
  const [finished,  setFinished]  = useState(false);
  const [key,       setKey]       = useState(0);
  const [hearts,    setHearts]    = useState(5);

  const ex  = exercises[current];
  const pct = Math.round(((current + (answered ? 1 : 0)) / exercises.length) * 100);
  const typeInfo = TYPE_LABELS[ex?.type] ?? { icon: '❓', label: '' };

  // Auto-speak Arabic prompt for listening exercises
  // Priorité: data.audio (explicite) → prompt AR → pas d'audio
  useEffect(() => {
    if (ex?.type !== 'LISTENING') return;
    const target = ex?.data?.audio || (hasArabic(ex?.prompt) ? ex.prompt : '');
    if (target) speak(target);
  }, [current]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleAnswer = (ok: boolean, correctText: string, userAnswer: any) => {
    setAnswered(true);
    setIsCorrect(ok);
    if (ok) {
      setFeedback(randomSuccess());
      setXp(x => x + (ex?.points ?? 10));
      setCorrect(c => c + 1);
    } else {
      setFeedback(correctText);
      setHearts(h => Math.max(0, h - 1));
    }
    setAnswers(prev => [...prev, { exerciseId: ex.id, answer: userAnswer }]);
  };

  const handleContinue = () => {
    if (current >= exercises.length - 1) {
      setFinished(true);
    } else {
      setCurrent(c => c + 1);
      setAnswered(false);
      setIsCorrect(null);
      setFeedback('');
      setKey(k => k + 1);
    }
  };

  // Écran Bravo
  if (finished) {
    return (
      <BravoScreen
        xp={xp} correct={correct} total={exercises.length}
        onContinue={() => onFinish(xp, answers)}
      />
    );
  }

  if (!ex) return null;

  const renderExercise = () => {
    // Exercices importés depuis les PDF MSA: routés sur MsaExerciseRenderer
    if (isMsaExercise(ex)) {
      return <MsaExerciseRenderer key={key} exercise={ex as any} onAnswer={handleAnswer} />;
    }
    // Exercices importés depuis arabic-quran-academy : routés sur AcademyExerciseRenderer
    if (isAcademyExercise(ex)) {
      return <AcademyExerciseRenderer key={key} exercise={ex as any} onAnswer={handleAnswer} />;
    }
    // Nouvelle mécanique : clavier arabe (phonétique QWERTY ou standard)
    if (isArabicKeyboardExercise(ex)) {
      return <ArabicKeyboardExercise key={key} exercise={ex as any} onAnswer={handleAnswer} />;
    }
    // Mécanique créative : tracer une lettre / mot arabe au doigt
    if (isTracingExercise(ex)) {
      return <TracingExercise key={key} exercise={ex as any} onAnswer={handleAnswer} />;
    }
    switch (ex.type) {
      case 'MULTIPLE_CHOICE': return <MultipleChoice key={key} exercise={ex} onAnswer={handleAnswer} />;
      case 'FILL_BLANK':      return <FillBlank      key={key} exercise={ex} onAnswer={handleAnswer} />;
      case 'TRANSLATION':     return <TranslationInput key={key} exercise={ex} onAnswer={handleAnswer} />;
      case 'REORDER':         return <ReorderExercise  key={key} exercise={ex} onAnswer={handleAnswer} />;
      default:
        if (ex.data?.options) return <MultipleChoice key={key} exercise={ex} onAnswer={handleAnswer} />;
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: BG }}>

      {/* ── HEADER ── */}
      <header className="sticky top-0 z-50 px-4 py-3" style={{ background: BG }}>
        <div className="flex items-center gap-3 max-w-lg mx-auto">
          {/* Close */}
          <button onClick={() => window.history.back()}
            className="w-8 h-8 flex items-center justify-center flex-shrink-0 transition-colors text-lg font-bold"
            style={{ color: SUB }}>
            ✕
          </button>

          {/* Progress bar */}
          <div className="flex-1 h-4 rounded-full overflow-hidden" style={{ background: BORDER }}>
            <div className="h-full rounded-full transition-all duration-500"
              style={{ width: `${pct}%`, background: GREEN }} />
          </div>

          {/* Percentage */}
          <span className="text-[13px] font-black min-w-[36px] text-right" style={{ color: GREEN }}>
            {pct}%
          </span>

          {/* Hearts */}
          <div className="flex items-center gap-0.5 flex-shrink-0">
            {Array.from({ length: 5 }).map((_, i) => (
              <span key={i} className="text-sm" style={{ color: i < hearts ? '#ff4b4b' : '#374151' }}>♥</span>
            ))}
          </div>
        </div>

        {/* Step dots */}
        <div className="flex items-center justify-center gap-1.5 mt-2 max-w-lg mx-auto">
          {exercises.map((_, i) => {
            const isDone   = i < current || (i === current && answered);
            const isActive = i === current && !answered;
            return (
              <div key={i} className="rounded-full flex items-center justify-center text-[9px] font-black transition-all"
                style={{
                  width: isActive ? 28 : 24, height: isActive ? 28 : 24,
                  background: isDone ? GREEN : isActive ? BLUE : BORDER,
                  color: isDone || isActive ? 'white' : SUB,
                }}>
                {isDone ? '✓' : i + 1}
              </div>
            );
          })}
        </div>
      </header>

      {/* ── CONTENT ── */}
      <main className="flex-1 flex flex-col px-4 py-6 pb-44">
        <div className="max-w-lg mx-auto w-full flex flex-col gap-5">

          {/* Prompt card */}
          <div className="rounded-2xl p-5" style={{
            background: CARD, border: `2px solid ${BORDER}`,
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            animation: 'fadeUp 0.25s ease both',
          }}>
            <div className="text-[11px] font-black uppercase tracking-widest mb-3" style={{ color: SUB }}>
              {typeInfo.icon} {typeInfo.label}
            </div>
            <div className="flex items-start gap-3">
              <p className="text-[17px] font-bold leading-relaxed flex-1" style={{ color: TEXT }}>
                {ex.prompt}
              </p>
              {hasArabic(ex.prompt) && <SpeakerButton text={ex.prompt ?? ''} size="md" />}
            </div>
          </div>

          {/* Exercise */}
          <div style={{ animation: 'fadeUp 0.3s ease both 0.05s' }}>
            {renderExercise()}
          </div>
        </div>
      </main>

      {/* ── FOOTER ── */}
      {answered && (
        <footer className="fixed bottom-0 left-0 right-0 z-50" style={{ animation: 'fadeUp 0.2s ease both' }}>
          {/* Feedback row */}
          <div className="px-5 py-4 border-t" style={{
            background: isCorrect ? '#1a3328' : '#3a1e1e',
            borderColor: isCorrect ? 'rgba(52,211,153,0.2)' : 'rgba(255,75,75,0.2)',
          }}>
            <div className="max-w-lg mx-auto flex items-center gap-4">
              <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-white text-lg font-black"
                style={{ background: isCorrect ? GREEN : RED }}>
                {isCorrect ? '✓' : '✗'}
              </div>
              <div>
                <div className="font-black text-[14px]" style={{ color: isCorrect ? GREEN : RED }}>
                  {isCorrect ? feedback : 'Bonne réponse :'}
                </div>
                {!isCorrect && (
                  <div className="text-[14px] font-bold mt-0.5" style={{ color: TEXT }}>{feedback}</div>
                )}
              </div>
            </div>
          </div>
          {/* Continue button */}
          <div className="px-4 py-4" style={{ background: isCorrect ? '#1a3328' : '#3a1e1e' }}>
            <div className="max-w-lg mx-auto">
              <button onClick={handleContinue}
                className="w-full py-4 rounded-2xl font-black text-[15px] uppercase tracking-widest text-white active:translate-y-0.5 transition-all"
                style={{
                  background: isCorrect ? GREEN : RED,
                  boxShadow: `0 4px 0 ${isCorrect ? GREEN_D : RED_D}`,
                }}>
                {current >= exercises.length - 1 ? 'Voir mes résultats' : 'Continuer'}
              </button>
            </div>
          </div>
        </footer>
      )}

      {/* Global animations */}
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes bounceIn {
          0%   { opacity: 0; transform: scale(0.3); }
          50%  { transform: scale(1.05); }
          70%  { transform: scale(0.95); }
          100% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
