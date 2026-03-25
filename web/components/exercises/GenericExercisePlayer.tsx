'use client';

import React, { useState } from 'react';
import { ContinueButton, FeedbackBanner } from '@/components/ui';

// ── Types ─────────────────────────────────────────────────────────────────────

export interface DbExercise {
  id: string;
  type: 'MULTIPLE_CHOICE' | 'FILL_BLANK' | 'TRANSLATION' | 'REORDER' | 'LISTENING';
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
    setTimeout(() => onAnswer(id === correctId, correctText, { id }), 400);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {options.map(opt => {
        const isSelected = selected === opt.id;
        const isCorrect  = opt.id === correctId;
        let bg = 'white', border = '#e5e7eb', color = '#374151';
        if (isSelected && isCorrect)            { bg = '#d1fae5'; border = '#10b981'; color = '#065f46'; }
        if (isSelected && !isCorrect)           { bg = '#fee2e2'; border = '#ef4444'; color = '#991b1b'; }
        if (selected && !isSelected && isCorrect) { bg = '#d1fae5'; border = '#10b981'; color = '#065f46'; }

        return (
          <button key={opt.id} onClick={() => handleSelect(opt.id)} style={{
            padding: '14px 16px', borderRadius: 14,
            border: `2px solid ${border}`, background: bg, color,
            textAlign: 'left', cursor: selected ? 'default' : 'pointer',
            transition: 'all 0.15s', boxShadow: `0 3px 0 ${border}`,
          }}>
            <span style={{ fontSize: 15, fontWeight: 700 }}>{opt.text}</span>
            {opt.transliteration && (
              <span style={{ fontSize: 11, color: '#9ca3af', marginLeft: 8 }}>({opt.transliteration})</span>
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
    setTimeout(() => onAnswer(opt === correctText, correctText, { text: opt }), 400);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{
        background: '#f9fafb', border: '2px solid #e5e7eb', borderRadius: 12,
        padding: '12px 16px', fontSize: 18,
        fontFamily: 'var(--font-arabic, serif)',
        textAlign: 'right', direction: 'rtl',
        color: '#1f2937', lineHeight: 1.8, minHeight: 54,
      }}>
        {selected ? sentence.replace('___', selected) : sentence}
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {options.map(opt => {
          const isSelected = selected === opt;
          const isCorrect  = opt === correctText;
          let bg = 'white', border = '#e5e7eb', color = '#374151';
          if (isSelected && isCorrect)            { bg = '#d1fae5'; border = '#10b981'; color = '#065f46'; }
          if (isSelected && !isCorrect)           { bg = '#fee2e2'; border = '#ef4444'; color = '#991b1b'; }
          if (selected && !isSelected && isCorrect) { bg = '#d1fae5'; border = '#10b981'; color = '#065f46'; }
          return (
            <button key={opt} onClick={() => handleSelect(opt)} style={{
              padding: '10px 18px', borderRadius: 12,
              border: `2px solid ${border}`, background: bg, color,
              fontWeight: 700, fontSize: 14,
              cursor: selected ? 'default' : 'pointer',
              boxShadow: `0 3px 0 ${border}`, transition: 'all 0.15s',
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
    setTimeout(() => onAnswer(ok, correct, { text: input.trim() }), 600);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {exercise.data?.hint && (
        <div style={{ fontSize: 12, color: '#9ca3af', fontStyle: 'italic' }}>💡 {exercise.data.hint}</div>
      )}
      <input
        type="text" value={input}
        onChange={e => !submitted && setInput(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && handleSubmit()}
        placeholder="Ta réponse en translittération..."
        disabled={submitted}
        style={{
          width: '100%', padding: '14px 16px', borderRadius: 12,
          border: `2px solid ${submitted ? (isCorrect ? '#10b981' : '#ef4444') : '#e5e7eb'}`,
          background: submitted ? (isCorrect ? '#d1fae5' : '#fee2e2') : 'white',
          fontSize: 15, color: '#1f2937', outline: 'none', boxSizing: 'border-box',
        }}
      />
      {submitted && (
        <div style={{ fontSize: 13, color: '#6b7280' }}>
          Bonne réponse : <strong style={{ color: '#065f46' }}>{correct}</strong>
        </div>
      )}
      {!submitted && (
        <button onClick={handleSubmit} style={{
          padding: '12px', borderRadius: 14,
          background: input.trim() ? '#2a9d8f' : '#e5e7eb',
          color: input.trim() ? 'white' : '#9ca3af',
          fontWeight: 900, fontSize: 14, border: 'none',
          cursor: input.trim() ? 'pointer' : 'default',
          boxShadow: input.trim() ? '0 4px 0 #1e7a6d' : '0 4px 0 #d1d5db',
        }}>Vérifier</button>
      )}
    </div>
  );
}

function ReorderExercise({ exercise, onAnswer }: { exercise: DbExercise; onAnswer: AnswerCb }) {
  const items: string[]        = exercise.data?.items ?? exercise.data?.letters ?? [];
  const correctOrder: string[] = exercise.answer?.order ?? [];
  const [order,     setOrder]     = useState<string[]>(() => [...items].sort(() => Math.random() - 0.5));
  const [submitted, setSubmitted] = useState(false);

  const moveItem = (from: number, to: number) => {
    if (submitted) return;
    const next = [...order];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    setOrder(next);
  };

  const handleCheck = () => {
    if (submitted) return;
    setSubmitted(true);
    const ok = JSON.stringify(order) === JSON.stringify(correctOrder);
    setTimeout(() => onAnswer(ok, correctOrder.join(' → '), { order }), 600);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {order.map((item, i) => (
          <div key={`${item}-${i}`} style={{
            padding: '10px 14px', borderRadius: 10,
            background: submitted ? '#f3f4f6' : 'white',
            border: '2px solid #e5e7eb',
            fontSize: 16, fontWeight: 700, color: '#374151',
            display: 'flex', gap: 6, alignItems: 'center',
          }}>
            {!submitted && i > 0 && (
              <button onClick={() => moveItem(i, i - 1)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, color: '#9ca3af' }}>←</button>
            )}
            <span>{item}</span>
            {!submitted && i < order.length - 1 && (
              <button onClick={() => moveItem(i, i + 1)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, color: '#9ca3af' }}>→</button>
            )}
          </div>
        ))}
      </div>
      {!submitted && (
        <button onClick={handleCheck} style={{
          padding: '12px', borderRadius: 14, background: '#2a9d8f',
          color: 'white', fontWeight: 900, fontSize: 14, border: 'none',
          cursor: 'pointer', boxShadow: '0 4px 0 #1e7a6d',
        }}>Vérifier l'ordre</button>
      )}
    </div>
  );
}

// ── Confettis ─────────────────────────────────────────────────────────────────

const CONFETTI_COLORS = ['#e9a84c','#2a9d8f','#e76f51','#38bdf8','#a78bfa','#fbbf24'];

function Confetti() {
  const pieces = Array.from({ length: 32 }, (_, i) => i);
  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 10 }}>
      {pieces.map(i => {
        const color = CONFETTI_COLORS[i % CONFETTI_COLORS.length];
        const left  = `${(i * 3.1 + 2) % 100}%`;
        const delay = `${(i * 0.09) % 1.5}s`;
        const size  = 8 + (i % 5) * 2;
        return (
          <div key={i} style={{
            position: 'absolute', top: '-20px', left,
            width: size, height: size,
            background: color, borderRadius: i % 3 === 0 ? '50%' : 2,
            animation: `confettiFall 2.2s ease-in ${delay} both`,
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
    <div style={{
      minHeight: '100vh', background: 'white',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', padding: '32px 20px',
      animation: 'fadeUp 0.4s ease both',
    }}>
      <Confetti />
      <div style={{ width: '100%', maxWidth: 420, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24, position: 'relative', zIndex: 20 }}>

        {/* Trophée */}
        <div style={{
          width: 140, height: 140, borderRadius: '50%',
          background: pct >= 80 ? '#ffc800' : pct >= 50 ? '#e9a84c' : '#9ca3af',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 64,
          boxShadow: `0 8px 0 ${pct >= 80 ? '#e5a000' : pct >= 50 ? '#b06818' : '#6b7280'}`,
          animation: 'bounceIn 0.5s ease both 0.1s',
        }}>
          {pct >= 80 ? '🏆' : pct >= 50 ? '⭐' : '💪'}
        </div>

        {/* Titre */}
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: 28, fontWeight: 900, color: '#1f2937', margin: 0 }}>
            {pct >= 80 ? 'Excellent !' : pct >= 50 ? 'Bien joué !' : 'Continue comme ça !'}
          </h1>
          <p style={{ fontSize: 13, color: '#9ca3af', fontWeight: 700, marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Leçon terminée
          </p>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, width: '100%' }}>
          {[
            { label: 'XP gagné', value: `+${xp}`,  color: '#e9a84c', icon: '⭐' },
            { label: 'Score',    value: `${pct}%`,  color: '#2a9d8f', icon: '🎯' },
            { label: 'Gemmes',   value: `+${gems}`, color: '#38bdf8', icon: '💎' },
          ].map(s => (
            <div key={s.label} style={{
              background: 'white', border: '2px solid #f3f4f6',
              borderRadius: 16, padding: '14px 8px',
              textAlign: 'center', boxShadow: '0 3px 0 #f3f4f6',
            }}>
              <div style={{ fontSize: 22, marginBottom: 4 }}>{s.icon}</div>
              <div style={{ fontSize: 20, fontWeight: 900, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: 10, color: '#9ca3af', fontWeight: 700, textTransform: 'uppercase', marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Barre de réussite */}
        <div style={{ width: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af' }}>Bonnes réponses</span>
            <span style={{ fontSize: 11, fontWeight: 900, color: '#2a9d8f' }}>{correct} / {total}</span>
          </div>
          <div style={{ height: 10, background: '#f3f4f6', borderRadius: 5, overflow: 'hidden' }}>
            <div style={{
              height: '100%', width: `${pct}%`,
              background: 'linear-gradient(90deg, #2a9d8f, #e9a84c)',
              borderRadius: 5, transition: 'width 0.8s ease',
            }} />
          </div>
        </div>

        {/* CTA unique */}
        <div style={{ width: '100%' }}>
          <ContinueButton onClick={onContinue} label="Continuer →" />
        </div>
      </div>
    </div>
  );
}

// ── Player principal ──────────────────────────────────────────────────────────

export default function GenericExercisePlayer({ exercises, onFinish }: Props) {
  const [current,   setCurrent]   = useState(0);
  const [answered,  setAnswered]  = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [feedback,  setFeedback]  = useState('');
  const [xp,        setXp]        = useState(0);
  const [correct,   setCorrect]   = useState(0);
  const [answers,   setAnswers]   = useState<CollectedAnswer[]>([]);
  const [finished,  setFinished]  = useState(false);
  const [key,       setKey]       = useState(0);

  const ex  = exercises[current];
  const pct = Math.round((current / exercises.length) * 100);

  const handleAnswer = (ok: boolean, correctText: string, userAnswer: any) => {
    setAnswered(true);
    setIsCorrect(ok);
    setFeedback(ok ? 'Bonne réponse ! 🎉' : `La bonne réponse : ${correctText}`);
    if (ok) {
      setXp(x => x + (ex?.points ?? 10));
      setCorrect(c => c + 1);
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
        xp={xp}
        correct={correct}
        total={exercises.length}
        onContinue={() => onFinish(xp, answers)}
      />
    );
  }

  if (!ex) return null;

  const renderExercise = () => {
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
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#f8f9fa' }}>

      {/* Header progress */}
      <div style={{ background: 'white', borderBottom: '1px solid #f3f4f6', padding: '12px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
          <div style={{ flex: 1, height: 10, background: '#e5e7eb', borderRadius: 5, overflow: 'hidden' }}>
            <div style={{
              height: '100%', width: `${pct}%`,
              background: 'linear-gradient(90deg, #2a9d8f, #e9a84c)',
              borderRadius: 5, transition: 'width 0.4s ease',
            }} />
          </div>
          <span style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', minWidth: 40 }}>
            {current + 1} / {exercises.length}
          </span>
          <span style={{ fontSize: 11, fontWeight: 800, color: '#e9a84c' }}>⭐ {xp}</span>
        </div>
      </div>

      {/* Contenu */}
      <main style={{ flex: 1, padding: '24px 16px 120px', display: 'flex', flexDirection: 'column', gap: 20 }}>
        {/* Prompt */}
        <div style={{
          background: 'white', borderRadius: 16, padding: '16px 18px',
          border: '2px solid #f3f4f6', boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        }}>
          <div style={{ fontSize: 11, fontWeight: 900, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
            {ex.type === 'MULTIPLE_CHOICE' ? '❓ Choix multiple' :
             ex.type === 'FILL_BLANK'      ? '✏️ Complète' :
             ex.type === 'TRANSLATION'     ? '🌍 Traduction' :
             ex.type === 'REORDER'         ? '🔀 Remets dans l\'ordre' : '❓'}
          </div>
          <p style={{ fontSize: 16, fontWeight: 700, color: '#1f2937', margin: 0, lineHeight: 1.5 }}>
            {ex.prompt}
          </p>
        </div>

        {renderExercise()}
      </main>

      {/* Footer */}
      {answered && (
        <footer style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 50, animation: 'slideUp 0.2s ease both' }}>
          <FeedbackBanner type={isCorrect ? 'correct' : 'incorrect'} message={feedback} />
          <div style={{ background: 'white', borderTop: '1px solid #e5e7eb', padding: '12px 16px' }}>
            <div style={{ maxWidth: 640, margin: '0 auto' }}>
              <ContinueButton
                onClick={handleContinue}
                label={current >= exercises.length - 1 ? 'Voir mes résultats →' : 'Continuer →'}
              />
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}
