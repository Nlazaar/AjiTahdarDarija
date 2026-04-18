'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';

type Layout = 'phonetic' | 'standard';

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
const AMBER = '#e9a84c';

type AnswerCb = (correct: boolean, correctText: string, userAnswer: any) => void;

interface Props {
  exercise: {
    id: string;
    prompt?: string | null;
    data?: {
      target?: string;
      targetTransliteration?: string;
      translation?: string;
      hint?: string;
    };
    answer?: { text?: string };
    points?: number;
  };
  onAnswer: AnswerCb;
}

// QWERTY phonetic mapping — intuitive for beginners (Buckwalter-inspired, simplified)
// Each cell: [char, label] — the char is what gets inserted on key tap
const PHONETIC_ROWS: Array<Array<[string, string]>> = [
  [
    ['ض', 'D'], ['ص', 'S'], ['ث', 'th'], ['ق', 'q'], ['ف', 'f'], ['غ', 'gh'],
    ['ع', 'ʿ'], ['ه', 'h'], ['خ', 'kh'], ['ح', 'H'], ['ج', 'j'],
  ],
  [
    ['ش', 'sh'], ['س', 's'], ['ي', 'y'], ['ب', 'b'], ['ل', 'l'], ['ا', 'a'],
    ['ت', 't'], ['ن', 'n'], ['م', 'm'], ['ك', 'k'], ['ط', 'T'],
  ],
  [
    ['ء', 'ʾ'], ['ذ', 'dh'], ['ز', 'z'], ['ر', 'r'], ['و', 'w'], ['ة', 'ŧ'],
    ['ى', 'ā'], ['ظ', 'Z'], ['د', 'd'], ['أ', 'Á'], ['إ', 'Í'],
  ],
];

// Standard AZERTY/Arabic keyboard layout (official Moroccan/ISO 9:1984)
const STANDARD_ROWS: Array<Array<[string, string]>> = [
  [
    ['ض', 'ض'], ['ص', 'ص'], ['ث', 'ث'], ['ق', 'ق'], ['ف', 'ف'], ['غ', 'غ'],
    ['ع', 'ع'], ['ه', 'ه'], ['خ', 'خ'], ['ح', 'ح'], ['ج', 'ج'], ['د', 'د'],
  ],
  [
    ['ش', 'ش'], ['س', 'س'], ['ي', 'ي'], ['ب', 'ب'], ['ل', 'ل'], ['ا', 'ا'],
    ['ت', 'ت'], ['ن', 'ن'], ['م', 'م'], ['ك', 'ك'], ['ط', 'ط'],
  ],
  [
    ['ئ', 'ئ'], ['ء', 'ء'], ['ؤ', 'ؤ'], ['ر', 'ر'], ['ى', 'ى'], ['ة', 'ة'],
    ['و', 'و'], ['ز', 'ز'], ['ظ', 'ظ'], ['أ', 'أ'], ['إ', 'إ'],
  ],
];

// Harakat / diacritics — always available on a top strip
const HARAKAT: Array<[string, string]> = [
  ['\u064E', 'a'], // fatha
  ['\u064F', 'u'], // damma
  ['\u0650', 'i'], // kasra
  ['\u0652', 'sukun'], // sukun
  ['\u0651', 'shadda'], // shadda
  ['\u064B', 'an'], // tanwin fath
  ['\u064C', 'un'], // tanwin damm
  ['\u064D', 'in'], // tanwin kasr
];

// Normalize for tolerant comparison: strip harakat, tatweel, unify alif variants
function normalize(s: string): string {
  return s
    .replace(/[\u064B-\u065F\u0670\u0640]/g, '') // tashkeel + tatweel
    .replace(/[آأإ]/g, 'ا')
    .replace(/ى/g, 'ي')
    .replace(/ة/g, 'ه')
    .trim();
}

export default function ArabicKeyboardExercise({ exercise, onAnswer }: Props) {
  const target = exercise.data?.target ?? exercise.answer?.text ?? '';
  const translit = exercise.data?.targetTransliteration ?? '';
  const translation = exercise.data?.translation ?? '';
  const hint = exercise.data?.hint ?? '';

  const [input, setInput] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [layout, setLayout] = useState<Layout>('phonetic');
  const [strict, setStrict] = useState(false); // strict = require exact match incl. harakat
  const inputRef = useRef<HTMLInputElement>(null);

  // Persist layout choice
  useEffect(() => {
    const saved = localStorage.getItem('darija_ar_kbd_layout') as Layout | null;
    if (saved === 'phonetic' || saved === 'standard') setLayout(saved);
  }, []);

  useEffect(() => {
    localStorage.setItem('darija_ar_kbd_layout', layout);
  }, [layout]);

  const rows = layout === 'phonetic' ? PHONETIC_ROWS : STANDARD_ROWS;

  const isExact = useMemo(() => input === target, [input, target]);
  const isLenient = useMemo(() => normalize(input) === normalize(target), [input, target]);

  const insert = (ch: string) => {
    if (submitted) return;
    setInput(prev => prev + ch);
    inputRef.current?.focus();
  };
  const backspace = () => {
    if (submitted) return;
    setInput(prev => prev.slice(0, -1));
    inputRef.current?.focus();
  };
  const space = () => insert(' ');

  const handleSubmit = () => {
    if (submitted || !input.trim()) return;
    setSubmitted(true);
    const ok = strict ? isExact : isLenient;
    setTimeout(() => onAnswer(ok, target, { text: input.trim() }), 450);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Target card */}
      <div className="rounded-2xl p-4 flex flex-col gap-2" style={{
        background: CARD2, border: `2px solid ${BORDER}`,
      }}>
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: SUB }}>
            ⌨️ Écris en arabe
          </span>
          {translation && (
            <span className="text-[12px] font-bold" style={{ color: AMBER }}>« {translation} »</span>
          )}
        </div>
        <div className="text-center" style={{
          fontFamily: 'var(--font-arabic, Amiri, serif)',
          direction: 'rtl',
          fontSize: 30,
          fontWeight: 800,
          color: TEXT,
          lineHeight: 1.7,
          letterSpacing: 1,
        }}>
          {target}
        </div>
        {translit && (
          <div className="text-[12px] text-center font-bold" style={{ color: SUB }}>
            {translit}
          </div>
        )}
        {hint && !submitted && (
          <div className="text-[11px] text-center font-medium" style={{ color: SUB }}>
            💡 {hint}
          </div>
        )}
      </div>

      {/* User input */}
      <div
        className="w-full min-h-[56px] rounded-2xl flex items-center justify-end px-4 py-3"
        style={{
          background: submitted ? (isLenient ? '#1a3328' : '#3a1e1e') : CARD2,
          border: `2px solid ${submitted ? (isLenient ? GREEN : RED) : input ? BLUE : BORDER}`,
          direction: 'rtl',
          fontFamily: 'var(--font-arabic, Amiri, serif)',
          fontSize: 26,
          color: TEXT,
          minHeight: 64,
        }}
        onClick={() => inputRef.current?.focus()}
      >
        <input
          ref={inputRef}
          type="text"
          value={input}
          readOnly
          className="sr-only"
          aria-label="Réponse arabe"
        />
        <span style={{ fontWeight: 800, letterSpacing: 1 }}>
          {input || <span style={{ color: SUB, fontSize: 14 }}>Tape tes lettres ci-dessous…</span>}
        </span>
      </div>

      {submitted && !isLenient && (
        <div className="text-[13px] font-bold text-center" style={{ color: SUB }}>
          Bonne réponse :{' '}
          <span style={{
            color: GREEN,
            fontFamily: 'var(--font-arabic, Amiri, serif)',
            fontSize: 18,
          }}>{target}</span>
        </div>
      )}
      {submitted && isLenient && !isExact && !strict && (
        <div className="text-[11px] font-medium text-center" style={{ color: AMBER }}>
          ✨ Presque parfait — les harakat varient légèrement
        </div>
      )}

      {/* Layout toggle + strict mode */}
      {!submitted && (
        <div className="flex items-center justify-between gap-2">
          <div className="flex gap-1 rounded-xl p-1" style={{ background: CARD2 }}>
            {([
              { id: 'phonetic' as Layout, label: '🔤 Phonétique' },
              { id: 'standard' as Layout, label: '⌨️ Standard' },
            ]).map(({ id, label }) => (
              <button
                key={id}
                onClick={() => setLayout(id)}
                className="px-3 py-1.5 rounded-lg text-[11px] font-black transition-all"
                style={{
                  background: layout === id ? BLUE : 'transparent',
                  color: layout === id ? 'white' : SUB,
                  boxShadow: layout === id ? `0 2px 0 ${BLUE_D}` : 'none',
                }}
              >
                {label}
              </button>
            ))}
          </div>
          <label className="flex items-center gap-2 text-[11px] font-bold cursor-pointer" style={{ color: SUB }}>
            <input
              type="checkbox"
              checked={strict}
              onChange={e => setStrict(e.target.checked)}
              className="accent-blue-400"
            />
            Strict (harakat)
          </label>
        </div>
      )}

      {/* Keyboard */}
      {!submitted && (
        <div className="rounded-2xl p-2.5 flex flex-col gap-1.5" style={{
          background: CARD, border: `2px solid ${BORDER}`,
        }}>
          {/* Harakat strip */}
          <div className="flex flex-wrap gap-1 justify-center pb-1 border-b" style={{ borderColor: BORDER }}>
            {HARAKAT.map(([ch, label]) => (
              <button
                key={label}
                onClick={() => insert(ch)}
                className="transition-all active:translate-y-0.5"
                style={{
                  minWidth: 40,
                  padding: '6px 8px',
                  borderRadius: 8,
                  background: CARD2,
                  border: `1px solid ${BORDER}`,
                  color: AMBER,
                  fontFamily: 'var(--font-arabic, Amiri, serif)',
                  fontSize: 18,
                  fontWeight: 800,
                  cursor: 'pointer',
                }}
                title={label}
              >
                {'\u25CC' + ch}
              </button>
            ))}
          </div>

          {/* Letter rows */}
          {rows.map((row, ri) => (
            <div key={ri} className="flex gap-1 justify-center flex-wrap">
              {row.map(([ch, label]) => (
                <button
                  key={ch + ri}
                  onClick={() => insert(ch)}
                  className="transition-all active:translate-y-0.5"
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 10,
                    background: CARD2,
                    border: `2px solid ${BORDER}`,
                    color: TEXT,
                    fontFamily: 'var(--font-arabic, Amiri, serif)',
                    fontSize: 22,
                    fontWeight: 800,
                    cursor: 'pointer',
                    boxShadow: `0 2px 0 #1a2830`,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    lineHeight: 1,
                  }}
                >
                  <span>{ch}</span>
                  {layout === 'phonetic' && (
                    <span style={{ fontSize: 9, color: SUB, marginTop: 2, fontFamily: 'inherit' }}>
                      {label}
                    </span>
                  )}
                </button>
              ))}
            </div>
          ))}

          {/* Controls row */}
          <div className="flex gap-1 justify-center mt-1">
            <button
              onClick={space}
              className="transition-all active:translate-y-0.5"
              style={{
                flex: 1, maxWidth: 220, height: 44, borderRadius: 10,
                background: CARD2, border: `2px solid ${BORDER}`, color: SUB,
                fontSize: 11, fontWeight: 800, cursor: 'pointer',
                boxShadow: `0 2px 0 #1a2830`,
              }}
            >ESPACE</button>
            <button
              onClick={backspace}
              className="transition-all active:translate-y-0.5"
              style={{
                width: 80, height: 44, borderRadius: 10,
                background: CARD2, border: `2px solid ${BORDER}`, color: RED,
                fontSize: 14, fontWeight: 800, cursor: 'pointer',
                boxShadow: `0 2px 0 #1a2830`,
              }}
            >⌫</button>
          </div>
        </div>
      )}

      {/* Submit */}
      {!submitted && (
        <button
          onClick={handleSubmit}
          disabled={!input.trim()}
          className="w-full py-4 rounded-2xl font-black text-[14px] uppercase tracking-widest transition-all active:translate-y-0.5"
          style={{
            background: input.trim() ? GREEN : CARD2,
            color: input.trim() ? 'white' : SUB,
            border: 'none',
            cursor: input.trim() ? 'pointer' : 'default',
            boxShadow: input.trim() ? `0 4px 0 ${GREEN_D}` : 'none',
          }}
        >
          Vérifier
        </button>
      )}
    </div>
  );
}

export function isArabicKeyboardExercise(ex: any): boolean {
  if (!ex) return false;
  if (ex.type === 'ARABIC_KEYBOARD') return true;
  if (ex.data?.mechanic === 'arabic_keyboard') return true;
  return false;
}
