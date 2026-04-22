'use client';

import React, { useEffect, useMemo, useState } from 'react';
import SpeakerButton from '@/components/SpeakerButton';

type AnswerCb = (correct: boolean, correctText: string, userAnswer: any) => void;

export interface AcademyExercise {
  id: string;
  prompt: string | null;
  data: {
    source?: string;
    mechanic?: string;
    content?: any;
    audioAvailability?: Record<string, boolean>;
    [k: string]: unknown;
  };
}

export function isAcademyExercise(ex: { data?: any }): boolean {
  return ex?.data?.source === 'arabic-academy';
}

// ── Palette Darija dark ──
const CARD = '#1e2d35';
const CARD2 = '#243b4a';
const BORDER = '#2a3d47';
const TEXT = '#e8eaed';
const SUB = '#6b7f8a';
const GREEN = '#58cc02';
const GREEN_D = '#46a302';
const RED = '#ff4b4b';
const BLUE = '#1cb0f6';
const YELLOW = '#ffc800';

const AR_FONT = 'var(--font-arabic, Amiri, "Noto Naskh Arabic", serif)';

// ── Shell commun : titre + consigne + corps + bouton valider ──
function Shell({
  title,
  instructions,
  children,
  validateLabel = 'VALIDER',
  onValidate,
  canValidate = true,
  autoValidated,
}: {
  title?: string;
  instructions?: string;
  children: React.ReactNode;
  validateLabel?: string;
  onValidate?: () => void;
  canValidate?: boolean;
  autoValidated?: boolean;
}) {
  return (
    <div className="flex flex-col gap-4">
      {title && (
        <h3 style={{ color: TEXT, fontFamily: AR_FONT, fontSize: 22, fontWeight: 900, direction: 'rtl', textAlign: 'center' }}>
          {title}
        </h3>
      )}
      {instructions && (
        <p style={{ color: SUB, fontFamily: AR_FONT, fontSize: 15, direction: 'rtl', textAlign: 'center' }}>
          {instructions}
        </p>
      )}
      {children}
      {onValidate && !autoValidated && (
        <button
          onClick={onValidate}
          disabled={!canValidate}
          style={{
            padding: '14px 20px',
            borderRadius: 14,
            background: canValidate ? GREEN : BORDER,
            color: canValidate ? 'white' : SUB,
            fontWeight: 900,
            fontSize: 15,
            cursor: canValidate ? 'pointer' : 'default',
            boxShadow: `0 3px 0 ${GREEN_D}`,
            letterSpacing: 1,
            border: 'none',
          }}
        >
          {validateLabel}
        </button>
      )}
    </div>
  );
}

// ── letter_intro : une grande lettre cliquable qui parle ──
function LetterIntroBlock({ ex, onAnswer }: { ex: AcademyExercise; onAnswer: AnswerCb }) {
  const c = ex.data.content || {};
  return (
    <Shell title={c.title} instructions={c.instructions}>
      <div
        style={{
          background: CARD,
          border: `2px solid ${BORDER}`,
          borderRadius: 20,
          padding: '40px 20px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 16,
        }}
      >
        <div style={{ fontFamily: AR_FONT, fontSize: 120, fontWeight: 900, color: TEXT, lineHeight: 1, direction: 'rtl' }}>
          {c.letter}
        </div>
        {c.name && (
          <div style={{ fontFamily: AR_FONT, fontSize: 28, fontWeight: 900, color: BLUE, direction: 'rtl' }}>
            {c.name}
          </div>
        )}
        {c.transliteration && (
          <div style={{ fontSize: 13, color: SUB, textTransform: 'uppercase', letterSpacing: 2 }}>
            {c.transliteration}
          </div>
        )}
        {c.audioText && <SpeakerButton text={c.audioText} size="lg" />}
      </div>
      <button
        onClick={() => onAnswer(true, '', { reviewed: true })}
        style={{ padding: '14px 20px', borderRadius: 14, background: GREEN, color: 'white', fontWeight: 900, fontSize: 15, cursor: 'pointer', boxShadow: `0 3px 0 ${GREEN_D}`, letterSpacing: 1, border: 'none' }}
      >
        J&apos;AI COMPRIS
      </button>
    </Shell>
  );
}

// ── letter_vowels : 3 formes harakat ──
function LetterVowelsBlock({ ex, onAnswer }: { ex: AcademyExercise; onAnswer: AnswerCb }) {
  const c = ex.data.content || {};
  const forms: Array<{ form: string; vowel: string; audioText: string }> = c.forms || [];
  const [heard, setHeard] = useState<Set<number>>(new Set());

  return (
    <Shell
      title={c.title}
      instructions={c.instructions}
      validateLabel="VALIDER"
      canValidate={heard.size === forms.length}
      onValidate={() => onAnswer(true, '', { heard: Array.from(heard) })}
    >
      <div className="grid grid-cols-3 gap-3">
        {forms.map((f, i) => {
          const done = heard.has(i);
          return (
            <div
              key={i}
              onClick={() => setHeard(prev => new Set(prev).add(i))}
              style={{
                background: done ? '#1a3328' : CARD,
                border: `2px solid ${done ? GREEN : BORDER}`,
                borderRadius: 14,
                padding: '20px 8px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 10,
                cursor: 'pointer',
                boxShadow: `0 3px 0 ${done ? GREEN_D : '#1a2830'}`,
              }}
            >
              <div style={{ fontFamily: AR_FONT, fontSize: 42, fontWeight: 900, color: done ? GREEN : TEXT, direction: 'rtl' }}>
                {f.form}
              </div>
              <div style={{ fontSize: 11, color: SUB, textTransform: 'uppercase', letterSpacing: 1 }}>{f.vowel}</div>
              <SpeakerButton text={f.audioText} size="sm" />
            </div>
          );
        })}
      </div>
    </Shell>
  );
}

// ── letter_word_match : mots à écouter ──
function LetterWordMatchBlock({ ex, onAnswer }: { ex: AcademyExercise; onAnswer: AnswerCb }) {
  const c = ex.data.content || {};
  const words: Array<{ word: string; meaning?: string; emoji?: string; audioText: string }> = c.words || [];

  return (
    <Shell
      title={c.title}
      instructions={c.instructions}
      onValidate={() => onAnswer(true, '', { reviewed: true })}
      validateLabel="CONTINUER"
    >
      <div className="flex flex-col gap-3">
        {words.map((w, i) => (
          <div
            key={i}
            style={{
              background: CARD,
              border: `2px solid ${BORDER}`,
              borderRadius: 14,
              padding: 16,
              display: 'flex',
              alignItems: 'center',
              gap: 14,
            }}
          >
            {w.emoji && <span style={{ fontSize: 42 }}>{w.emoji}</span>}
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: AR_FONT, fontSize: 26, fontWeight: 900, color: TEXT, direction: 'rtl' }}>{w.word}</div>
              {w.meaning && <div style={{ fontSize: 13, color: SUB }}>{w.meaning}</div>}
            </div>
            <SpeakerButton text={w.audioText} size="md" />
          </div>
        ))}
      </div>
    </Shell>
  );
}

// ── numbers : grille de chiffres ──
function NumbersBlock({ ex, onAnswer }: { ex: AcademyExercise; onAnswer: AnswerCb }) {
  const c = ex.data.content || {};
  const numbers: Array<{ number: number; arabic_simple: string; arabic_full: string; latin: string; transliteration?: string; audioText: string }> = c.numbers || [];

  return (
    <Shell
      title={c.title}
      instructions={c.instructions || 'اضغط على كل رقم لتسمعه'}
      onValidate={() => onAnswer(true, '', { reviewed: true })}
      validateLabel="CONTINUER"
    >
      <div className="grid grid-cols-2 gap-3">
        {numbers.map((n, i) => (
          <div
            key={i}
            style={{
              background: CARD,
              border: `2px solid ${BORDER}`,
              borderRadius: 14,
              padding: 14,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <div style={{ fontFamily: AR_FONT, fontSize: 44, fontWeight: 900, color: TEXT }}>{n.arabic_simple}</div>
            <div style={{ fontSize: 15, fontWeight: 900, color: BLUE }}>{n.latin}</div>
            <div style={{ fontFamily: AR_FONT, fontSize: 20, color: TEXT, direction: 'rtl' }}>{n.arabic_full}</div>
            {n.transliteration && <div style={{ fontSize: 11, color: SUB, textTransform: 'uppercase' }}>{n.transliteration}</div>}
            <SpeakerButton text={n.audioText} size="sm" />
          </div>
        ))}
      </div>
    </Shell>
  );
}

// ── game_numbers : quiz audio → bon chiffre ──
function GameNumbersBlock({ ex, onAnswer }: { ex: AcademyExercise; onAnswer: AnswerCb }) {
  const c = ex.data.content || {};
  const questions: Array<{ audioText: string; options: string[]; answer: string }> = c.questions || [];
  const [idx, setIdx] = useState(0);
  const [chosen, setChosen] = useState<string | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const q = questions[idx];

  if (!q) return null;

  const pick = (opt: string) => {
    if (chosen) return;
    setChosen(opt);
    const ok = opt === q.answer;
    if (ok) setCorrectCount(c => c + 1);
    setTimeout(() => {
      if (idx + 1 >= questions.length) {
        onAnswer(correctCount + (ok ? 1 : 0) === questions.length, q.answer, { correct: correctCount + (ok ? 1 : 0), total: questions.length });
      } else {
        setIdx(i => i + 1);
        setChosen(null);
      }
    }, 700);
  };

  return (
    <Shell title={c.title} instructions={c.instructions || 'اختر الرقم الصحيح'}>
      <div style={{ color: SUB, fontSize: 13, textAlign: 'center' }}>
        {idx + 1} / {questions.length}
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', margin: '10px 0 20px' }}>
        <SpeakerButton text={q.audioText} size="lg" />
      </div>
      <div className="grid grid-cols-3 gap-3">
        {q.options.map(opt => {
          const isChosen = chosen === opt;
          const isAnswer = q.answer === opt;
          const show = chosen !== null;
          let bg = CARD, border = BORDER, color = TEXT;
          if (show && isAnswer) { bg = '#1a3328'; border = GREEN; color = GREEN; }
          else if (show && isChosen && !isAnswer) { bg = '#3a1e1e'; border = RED; color = RED; }
          return (
            <button
              key={opt}
              onClick={() => pick(opt)}
              disabled={show}
              style={{
                padding: '22px 8px',
                borderRadius: 14,
                border: `2px solid ${border}`,
                background: bg,
                color,
                fontSize: 28,
                fontWeight: 900,
                cursor: show ? 'default' : 'pointer',
                boxShadow: `0 3px 0 #1a2830`,
              }}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </Shell>
  );
}

// ── quiz : QCM simple ──
function QuizBlock({ ex, onAnswer }: { ex: AcademyExercise; onAnswer: AnswerCb }) {
  const c = ex.data.content || {};
  const options: string[] = c.options || [];
  const answer: string = c.answer;
  const [chosen, setChosen] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);

  return (
    <Shell
      title={c.title}
      instructions={c.question}
      onValidate={() => {
        if (!chosen) return;
        setRevealed(true);
        setTimeout(() => onAnswer(chosen === answer, answer, chosen), 600);
      }}
      canValidate={!!chosen && !revealed}
      validateLabel="VALIDER"
    >
      <div className="flex flex-col gap-3">
        {options.map(opt => {
          const isChosen = chosen === opt;
          const isAnswer = answer === opt;
          let bg = CARD, border = isChosen ? BLUE : BORDER, color = TEXT;
          if (revealed && isAnswer) { bg = '#1a3328'; border = GREEN; color = GREEN; }
          else if (revealed && isChosen && !isAnswer) { bg = '#3a1e1e'; border = RED; color = RED; }
          return (
            <button
              key={opt}
              onClick={() => !revealed && setChosen(opt)}
              disabled={revealed}
              style={{
                padding: '16px 14px',
                borderRadius: 14,
                border: `2px solid ${border}`,
                background: bg,
                color,
                fontFamily: AR_FONT,
                fontSize: 20,
                fontWeight: 700,
                direction: 'rtl',
                cursor: revealed ? 'default' : 'pointer',
                boxShadow: `0 3px 0 #1a2830`,
                textAlign: 'center',
              }}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </Shell>
  );
}

// ── quiz_match : relier audio ↔ réponse ──
function QuizMatchBlock({ ex, onAnswer }: { ex: AcademyExercise; onAnswer: AnswerCb }) {
  const c = ex.data.content || {};
  const pairs: Array<{ audioText: string; answer: string }> = c.pairs || [];
  const [matched, setMatched] = useState<Record<number, string>>({});
  const [selectedAudio, setSelectedAudio] = useState<number | null>(null);
  const [wrong, setWrong] = useState<{ audio: number; ans: string } | null>(null);
  // Signature stable : ne re-shuffle que si les paires changent vraiment
  const answersKey = pairs.map(p => p.answer).join('|');
  const shuffledAnswers = useMemo(() => [...pairs.map(p => p.answer)].sort(() => Math.random() - 0.5), [answersKey]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleAnswerClick = (ans: string) => {
    if (selectedAudio === null) return;
    const expected = pairs[selectedAudio].answer;
    if (expected === ans) {
      const next = { ...matched, [selectedAudio]: ans };
      setMatched(next);
      setSelectedAudio(null);
      if (Object.keys(next).length === pairs.length) {
        setTimeout(() => onAnswer(true, '', { matched: next }), 300);
      }
    } else {
      setWrong({ audio: selectedAudio, ans });
      setTimeout(() => setWrong(null), 600);
    }
  };

  return (
    <Shell title={c.title} instructions={c.question}>
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-2">
          {pairs.map((p, i) => {
            const done = matched[i] !== undefined;
            const active = selectedAudio === i;
            return (
              <button
                key={i}
                onClick={() => !done && setSelectedAudio(active ? null : i)}
                disabled={done}
                style={{
                  padding: 12,
                  borderRadius: 14,
                  border: `2px solid ${done ? GREEN : active ? BLUE : BORDER}`,
                  background: done ? '#1a3328' : CARD,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  cursor: done ? 'default' : 'pointer',
                  boxShadow: `0 3px 0 #1a2830`,
                }}
              >
                <SpeakerButton text={p.audioText} size="sm" />
              </button>
            );
          })}
        </div>
        <div className="flex flex-col gap-2">
          {shuffledAnswers.map((a, i) => {
            const done = Object.values(matched).includes(a);
            const isWrong = wrong?.ans === a;
            return (
              <button
                key={`${a}-${i}`}
                onClick={() => handleAnswerClick(a)}
                disabled={done}
                style={{
                  padding: '14px 12px',
                  borderRadius: 14,
                  border: `2px solid ${done ? GREEN : isWrong ? RED : BORDER}`,
                  background: done ? '#1a3328' : isWrong ? '#3a1e1e' : CARD,
                  color: done ? GREEN : TEXT,
                  fontFamily: AR_FONT,
                  fontSize: 22,
                  fontWeight: 900,
                  direction: 'rtl',
                  cursor: done ? 'default' : 'pointer',
                  boxShadow: `0 3px 0 #1a2830`,
                }}
              >
                {a}
              </button>
            );
          })}
        </div>
      </div>
    </Shell>
  );
}

// ── text : bloc de texte explicatif ──
function TextBlock({ ex, onAnswer }: { ex: AcademyExercise; onAnswer: AnswerCb }) {
  const c = ex.data.content || {};
  return (
    <Shell
      title={c.title}
      onValidate={() => onAnswer(true, '', { reviewed: true })}
      validateLabel="CONTINUER"
    >
      <div style={{ background: CARD, border: `2px solid ${BORDER}`, borderRadius: 16, padding: 20 }}>
        {c.text && (
          <p style={{ color: TEXT, fontFamily: AR_FONT, fontSize: 18, direction: 'rtl', lineHeight: 1.8, textAlign: 'right' }}>
            {c.text}
          </p>
        )}
        {c.audioText && (
          <div style={{ marginTop: 14, display: 'flex', justifyContent: 'center' }}>
            <SpeakerButton text={c.audioText} size="md" />
          </div>
        )}
      </div>
    </Shell>
  );
}

// ── audio : auto-play + bouton ──
function AudioBlock({ ex, onAnswer }: { ex: AcademyExercise; onAnswer: AnswerCb }) {
  const c = ex.data.content || {};
  return (
    <Shell title={c.title} onValidate={() => onAnswer(true, '', { reviewed: true })} validateLabel="CONTINUER">
      <div style={{ background: CARD, border: `2px solid ${BORDER}`, borderRadius: 16, padding: 30, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
        {c.label && <div style={{ color: TEXT, fontFamily: AR_FONT, fontSize: 18, direction: 'rtl' }}>{c.label}</div>}
        {c.audioText ? <SpeakerButton text={c.audioText} size="lg" /> : <div style={{ color: SUB, fontSize: 13 }}>Audio à venir</div>}
      </div>
    </Shell>
  );
}

// ── image : affiche emoji/image + audio ──
function ImageBlockEx({ ex, onAnswer }: { ex: AcademyExercise; onAnswer: AnswerCb }) {
  const c = ex.data.content || {};
  return (
    <Shell title={c.title} onValidate={() => onAnswer(true, '', { reviewed: true })} validateLabel="CONTINUER">
      <div style={{ background: CARD, border: `2px solid ${BORDER}`, borderRadius: 16, padding: 30, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
        {c.emoji && <span style={{ fontSize: 90 }}>{c.emoji}</span>}
        {c.caption && <div style={{ color: TEXT, fontFamily: AR_FONT, fontSize: 22, fontWeight: 900, direction: 'rtl' }}>{c.caption}</div>}
        {c.audioText && <SpeakerButton text={c.audioText} size="md" />}
      </div>
    </Shell>
  );
}

// ── color world : grille couleur + audio ──
function ColorWorldBlock({ ex, onAnswer }: { ex: AcademyExercise; onAnswer: AnswerCb }) {
  const c = ex.data.content || {};
  const colors: Array<{ name: string; hex: string; audioText: string; transliteration?: string; example?: string }> = c.colors || [];

  return (
    <Shell title={c.title} instructions={c.instructions} onValidate={() => onAnswer(true, '', { reviewed: true })} validateLabel="CONTINUER">
      <div className="grid grid-cols-2 gap-3">
        {colors.map((col, i) => (
          <div
            key={i}
            style={{
              background: CARD,
              border: `3px solid ${col.hex}`,
              borderRadius: 14,
              padding: 14,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <div style={{ width: 54, height: 54, borderRadius: '50%', background: col.hex, boxShadow: `0 0 20px ${col.hex}66` }} />
            {col.example && <span style={{ fontSize: 30 }}>{col.example}</span>}
            <div style={{ fontFamily: AR_FONT, fontSize: 22, fontWeight: 900, color: TEXT, direction: 'rtl' }}>{col.name}</div>
            {col.transliteration && <div style={{ fontSize: 10, color: SUB, textTransform: 'uppercase' }}>{col.transliteration}</div>}
            <SpeakerButton text={col.audioText} size="sm" color={col.hex} />
          </div>
        ))}
      </div>
    </Shell>
  );
}

// ── family_intro / family_tree / family_match (unifié : carte de personnes) ──
function PeopleGridBlock({ ex, onAnswer }: { ex: AcademyExercise; onAnswer: AnswerCb }) {
  const c = ex.data.content || {};
  const members: Array<{ role?: string; name?: string; emoji?: string; audioText?: string; label?: string }> =
    c.members || c.people || c.family || c.items || [];
  const list = members.length
    ? members
    : Object.entries(c).filter(([, v]) => v && typeof v === 'object' && ('audioText' in (v as any) || 'emoji' in (v as any))).map(([k, v]: any) => ({ role: k, ...v }));

  return (
    <Shell title={c.title} instructions={c.instructions} onValidate={() => onAnswer(true, '', { reviewed: true })} validateLabel="CONTINUER">
      <div className="grid grid-cols-2 gap-3">
        {list.map((m, i) => (
          <div
            key={i}
            style={{ background: CARD, border: `2px solid ${BORDER}`, borderRadius: 14, padding: 16, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}
          >
            {m.emoji && <span style={{ fontSize: 48 }}>{m.emoji}</span>}
            {(m.label || m.role || m.name) && (
              <div style={{ fontFamily: AR_FONT, fontSize: 20, fontWeight: 900, color: TEXT, direction: 'rtl' }}>
                {m.label || m.role || m.name}
              </div>
            )}
            {m.audioText && <SpeakerButton text={m.audioText} size="sm" />}
          </div>
        ))}
      </div>
    </Shell>
  );
}

// ── body_map : zones du corps ──
function BodyMapBlock({ ex, onAnswer }: { ex: AcademyExercise; onAnswer: AnswerCb }) {
  const c = ex.data.content || {};
  const parts: Array<{ name: string; emoji?: string; audioText: string; transliteration?: string }> = c.parts || c.bodyParts || [];

  return (
    <Shell title={c.title} instructions={c.instructions} onValidate={() => onAnswer(true, '', { reviewed: true })} validateLabel="CONTINUER">
      <div className="grid grid-cols-2 gap-3">
        {parts.map((p, i) => (
          <div key={i} style={{ background: CARD, border: `2px solid ${BORDER}`, borderRadius: 14, padding: 14, display: 'flex', alignItems: 'center', gap: 10 }}>
            {p.emoji && <span style={{ fontSize: 36 }}>{p.emoji}</span>}
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: AR_FONT, fontSize: 20, fontWeight: 900, color: TEXT, direction: 'rtl' }}>{p.name}</div>
              {p.transliteration && <div style={{ fontSize: 11, color: SUB }}>{p.transliteration}</div>}
            </div>
            <SpeakerButton text={p.audioText} size="sm" />
          </div>
        ))}
      </div>
    </Shell>
  );
}

// ── Fallback générique : walk recursif, rend tous les blocs (texte AR + audio) ──
function walkForDisplay(content: any, acc: Array<{ label?: string; text?: string; audioText?: string; emoji?: string; hex?: string }> = []) {
  if (!content || typeof content !== 'object') return acc;
  if (Array.isArray(content)) { content.forEach(item => walkForDisplay(item, acc)); return acc; }
  const keys = Object.keys(content);
  const hasLeaf = keys.some(k => ['audioText', 'emoji', 'word', 'name', 'text', 'letter'].includes(k));
  if (hasLeaf) {
    acc.push({
      label: content.name || content.word || content.role || content.letter,
      text: content.text || content.meaning,
      audioText: content.audioText,
      emoji: content.emoji,
      hex: content.hex,
    });
  }
  for (const [, v] of Object.entries(content)) {
    if (v && typeof v === 'object') walkForDisplay(v, acc);
  }
  return acc;
}

function VisualFallback({ ex, onAnswer }: { ex: AcademyExercise; onAnswer: AnswerCb }) {
  const c = ex.data.content || {};
  const items = walkForDisplay(c).filter(x => x.label || x.emoji || x.audioText || x.text);

  return (
    <Shell title={c.title} instructions={c.instructions} onValidate={() => onAnswer(true, '', { reviewed: true })} validateLabel="CONTINUER">
      {items.length === 0 ? (
        <div style={{ background: CARD, border: `2px solid ${BORDER}`, borderRadius: 14, padding: 20, color: SUB, textAlign: 'center' }}>
          Contenu en cours de préparation…
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {items.slice(0, 12).map((it, i) => (
            <div
              key={i}
              style={{
                background: CARD,
                border: `2px solid ${it.hex || BORDER}`,
                borderRadius: 14,
                padding: 14,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 6,
              }}
            >
              {it.emoji && <span style={{ fontSize: 36 }}>{it.emoji}</span>}
              {it.hex && !it.emoji && <div style={{ width: 40, height: 40, borderRadius: '50%', background: it.hex }} />}
              {it.label && (
                <div style={{ fontFamily: AR_FONT, fontSize: 20, fontWeight: 900, color: TEXT, direction: 'rtl', textAlign: 'center' }}>
                  {it.label}
                </div>
              )}
              {it.text && <div style={{ fontSize: 12, color: SUB, textAlign: 'center' }}>{it.text}</div>}
              {it.audioText && <SpeakerButton text={it.audioText} size="sm" />}
            </div>
          ))}
        </div>
      )}
    </Shell>
  );
}

// ── Router ──
export function AcademyExerciseRenderer({ exercise, onAnswer }: { exercise: AcademyExercise; onAnswer: AnswerCb }) {
  const mech = (exercise.data?.mechanic ?? '').toLowerCase();

  switch (mech) {
    case 'letter_intro':        return <LetterIntroBlock ex={exercise} onAnswer={onAnswer} />;
    case 'letter_vowels':       return <LetterVowelsBlock ex={exercise} onAnswer={onAnswer} />;
    case 'letter_word_match':   return <LetterWordMatchBlock ex={exercise} onAnswer={onAnswer} />;
    case 'numbers':             return <NumbersBlock ex={exercise} onAnswer={onAnswer} />;
    case 'game_numbers':        return <GameNumbersBlock ex={exercise} onAnswer={onAnswer} />;
    case 'quiz':                return <QuizBlock ex={exercise} onAnswer={onAnswer} />;
    case 'quiz_match':          return <QuizMatchBlock ex={exercise} onAnswer={onAnswer} />;
    case 'text':                return <TextBlock ex={exercise} onAnswer={onAnswer} />;
    case 'audio':               return <AudioBlock ex={exercise} onAnswer={onAnswer} />;
    case 'image':               return <ImageBlockEx ex={exercise} onAnswer={onAnswer} />;
    case 'interactive_color_world':
    case 'colors':
    case 'color_shapes':
    case 'paint_game':          return <ColorWorldBlock ex={exercise} onAnswer={onAnswer} />;
    case 'family_intro':
    case 'family_tree':
    case 'family_match':
    case 'family':
    case 'animals':
    case 'pronouns':            return <PeopleGridBlock ex={exercise} onAnswer={onAnswer} />;
    case 'body_map':
    case 'body':                return <BodyMapBlock ex={exercise} onAnswer={onAnswer} />;
    default:                    return <VisualFallback ex={exercise} onAnswer={onAnswer} />;
  }
}
