'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useUserProgress } from '@/contexts/UserProgressContext';
import { useAudio } from '@/hooks/useAudio';
import ExerciseSession, { buildExercises } from './ExerciseSession';

/* ─── Dark theme colors ──────────────────────────────────────────────────── */
const BG     = '#131f24';
const CARD   = '#1e2d36';
const CARD2  = '#243b4a';
const BORDER = 'rgba(255,255,255,0.07)';
const TEXT   = '#ffffff';
const SUB    = '#8b9eb0';
const GREEN  = '#58cc02';
const BLUE   = '#1cb0f6';

/* ─────────────────────────────────────────────
   DONNÉES — Alphabet arabe en groupes
───────────────────────────────────────────── */
interface Letter  { arabic: string; latin: string; fr: string; }
interface LetterGroup { title: string; letters: Letter[]; }

const ALPHABET_GROUPS: LetterGroup[] = [
  { title: 'Les premières lettres', letters: [
    { arabic: 'ا', latin: 'Alif',  fr: 'voyelle "a"'     },
    { arabic: 'ب', latin: 'Ba',    fr: 'comme "b"'        },
    { arabic: 'ت', latin: 'Ta',    fr: 'comme "t"'        },
    { arabic: 'ث', latin: 'Tha',   fr: '"th" de think'    },
    { arabic: 'ج', latin: 'Jim',   fr: 'comme "dj"'       },
  ]},
  { title: 'Sons du fond de la gorge', letters: [
    { arabic: 'ح', latin: 'Ha',    fr: 'h expiré profond' },
    { arabic: 'خ', latin: 'Kha',   fr: 'j espagnol'       },
    { arabic: 'د', latin: 'Dal',   fr: 'comme "d"'        },
    { arabic: 'ذ', latin: 'Dhal',  fr: '"th" de the'      },
    { arabic: 'ر', latin: 'Ra',    fr: 'r roulé'          },
    { arabic: 'ز', latin: 'Zay',   fr: 'comme "z"'        },
  ]},
  { title: 'Les sibilantes', letters: [
    { arabic: 'س', latin: 'Sin',   fr: 'comme "s"'        },
    { arabic: 'ش', latin: 'Shin',  fr: 'comme "ch"'       },
    { arabic: 'ص', latin: 'Sad',   fr: 's emphatique'     },
    { arabic: 'ض', latin: 'Dad',   fr: 'd emphatique'     },
    { arabic: 'ط', latin: 'Tah',   fr: 't emphatique'     },
    { arabic: 'ظ', latin: 'Dha',   fr: 'dh emphatique'    },
  ]},
  { title: 'Sons gutturaux', letters: [
    { arabic: 'ع', latin: 'Ain',   fr: 'gorge contractée' },
    { arabic: 'غ', latin: 'Ghain', fr: 'r guttural'       },
    { arabic: 'ف', latin: 'Fa',    fr: 'comme "f"'        },
    { arabic: 'ق', latin: 'Qaf',   fr: 'k profond'        },
  ]},
  { title: 'Les consonnes douces', letters: [
    { arabic: 'ك', latin: 'Kaf',   fr: 'comme "k"'        },
    { arabic: 'ل', latin: 'Lam',   fr: 'comme "l"'        },
    { arabic: 'م', latin: 'Mim',   fr: 'comme "m"'        },
    { arabic: 'ن', latin: 'Nun',   fr: 'comme "n"'        },
  ]},
  { title: 'Les voyelles et semi-voyelles', letters: [
    { arabic: 'ه', latin: 'Ha',    fr: 'h aspiré doux'    },
    { arabic: 'و', latin: 'Waw',   fr: '"w" ou "ou"'      },
    { arabic: 'ي', latin: 'Ya',    fr: '"y" ou "i"'       },
  ]},
];

const ALL_LETTERS = ALPHABET_GROUPS.flatMap(g => g.letters);

/* ─────────────────────────────────────────────
   VOYELLES
───────────────────────────────────────────── */
interface VowelKey {
  id: string; mark: string; name: string; arabic: string;
  sound: string; roman: string; color: string; glow: string;
  light: string; border: string;
}

const SHORT_VOWELS: VowelKey[] = [
  { id: 'fatha', mark: '\u064E', name: 'Fatha', arabic: 'الْفَتْحَةُ', sound: 'son "a"',  roman: 'a',  color: '#f97316', glow: 'rgba(249,115,22,0.25)',  light: 'rgba(249,115,22,0.12)',  border: 'rgba(249,115,22,0.35)'  },
  { id: 'damma', mark: '\u064F', name: 'Damma', arabic: 'الضَّمَّةُ',  sound: 'son "ou"', roman: 'ou', color: '#3b82f6', glow: 'rgba(59,130,246,0.25)',  light: 'rgba(59,130,246,0.12)',  border: 'rgba(59,130,246,0.35)'  },
  { id: 'kasra', mark: '\u0650', name: 'Kasra', arabic: 'الْكَسْرَةُ', sound: 'son "i"',  roman: 'i',  color: '#10b981', glow: 'rgba(16,185,129,0.25)',  light: 'rgba(16,185,129,0.12)',  border: 'rgba(16,185,129,0.35)'  },
];

const SUKUN_KEY: VowelKey = {
  id: 'sukun', mark: '\u0652', name: 'Sukun', arabic: 'السُّكُونُ', sound: 'muette',
  roman: '', color: '#8b9eb0', glow: 'rgba(139,158,176,0.2)',
  light: 'rgba(139,158,176,0.10)', border: 'rgba(139,158,176,0.30)',
};

const LONG_VOWELS: VowelKey[] = [
  { id: 'long-aa', mark: '\u064E\u0627', name: 'Alif madda', arabic: 'مَدَّة الألف', sound: 'son "aaa" — voyelle longue', roman: 'aa', color: '#f97316', glow: 'rgba(249,115,22,0.25)', light: 'rgba(249,115,22,0.12)', border: 'rgba(249,115,22,0.35)' },
  { id: 'long-uu', mark: '\u064F\u0648', name: 'Waw madda',  arabic: 'مَدَّة الواو', sound: 'son "uuu" — voyelle longue', roman: 'uu', color: '#3b82f6', glow: 'rgba(59,130,246,0.25)',  light: 'rgba(59,130,246,0.12)',  border: 'rgba(59,130,246,0.35)'  },
  { id: 'long-ii', mark: '\u0650\u064A', name: 'Ya madda',   arabic: 'مَدَّة الياء', sound: 'son "iii" — voyelle longue', roman: 'ii', color: '#10b981', glow: 'rgba(16,185,129,0.25)', light: 'rgba(16,185,129,0.12)', border: 'rgba(16,185,129,0.35)' },
];

const ALL_KEYS: VowelKey[] = [...SHORT_VOWELS, SUKUN_KEY, ...LONG_VOWELS];

/* ─────────────────────────────────────────────
   LETTER CARD
───────────────────────────────────────────── */
function LetterCard({ letter, isKnown, isSelected, onSpeak, onSelect }: {
  letter: Letter; isKnown: boolean; isSelected: boolean; onSpeak: () => void; onSelect: () => void;
}) {
  const [pressed, setPressed] = useState(false);

  const handleClick = () => {
    setPressed(true);
    setTimeout(() => setPressed(false), 200);
    onSpeak();
    onSelect();
  };

  return (
    <div
      onClick={handleClick}
      style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
        padding: '16px 8px 12px', borderRadius: 16,
        border: `2px solid ${isSelected ? '#6366f1' : isKnown ? 'rgba(88,204,2,0.4)' : BORDER}`,
        background: isSelected ? 'rgba(99,102,241,0.15)' : isKnown ? 'rgba(88,204,2,0.08)' : CARD,
        cursor: 'pointer',
        transform: pressed ? 'scale(0.93)' : 'scale(1)',
        transition: 'transform 0.12s, border-color 0.2s, background 0.2s',
        boxShadow: isSelected ? '0 0 0 3px rgba(99,102,241,0.2)' : 'none',
        minWidth: 0,
      }}
    >
      <span style={{
        fontSize: 38,
        fontFamily: 'var(--font-amiri), serif',
        color: isSelected ? '#a5b4fc' : TEXT,
        lineHeight: 1.2, direction: 'rtl',
      }}>
        {letter.arabic}
      </span>
      <span style={{ fontSize: 12, fontWeight: 700, color: SUB, letterSpacing: '0.02em' }}>
        {letter.latin}
      </span>
      <div style={{
        width: 32, height: 4, borderRadius: 2, marginTop: 2,
        background: isSelected ? '#6366f1' : isKnown ? GREEN : 'rgba(255,255,255,0.1)',
        transition: 'background 0.3s',
      }} />
    </div>
  );
}

/* ─────────────────────────────────────────────
   SECTION HEADER (divider)
───────────────────────────────────────────── */
function SectionDivider({ label, sub }: { label: string; sub?: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '16px 0 10px' }}>
      <div style={{ flex: 1, height: 1, background: BORDER }} />
      <span style={{
        fontSize: 11, fontWeight: 800, color: SUB, whiteSpace: 'nowrap',
        textTransform: 'uppercase' as const, letterSpacing: '0.07em',
        display: 'flex', gap: 6, alignItems: 'center',
      }}>
        {label}
        {sub && (
          <span style={{ fontFamily: 'var(--font-amiri), serif', fontSize: 13, fontWeight: 400,
            color: 'rgba(255,255,255,0.25)', textTransform: 'none', letterSpacing: 0 }}>
            {sub}
          </span>
        )}
      </span>
      <div style={{ flex: 1, height: 1, background: BORDER }} />
    </div>
  );
}

/* ─────────────────────────────────────────────
   VOWEL BUTTON
───────────────────────────────────────────── */
function VowelButton({ vowel, letter, isActive, onClick, wide = false }: {
  vowel: VowelKey; letter: Letter; isActive: boolean; onClick: () => void; wide?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex',
        flexDirection: wide ? 'row' : 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: wide ? 14 : 6,
        padding: wide ? '12px 20px' : '12px 8px 10px',
        borderRadius: 18,
        border: `2px solid ${isActive ? vowel.color : `${vowel.color}30`}`,
        background: isActive ? `${vowel.color}20` : CARD2,
        cursor: 'pointer',
        transition: 'all 0.2s',
        transform: isActive ? 'translateY(-3px)' : 'none',
        boxShadow: isActive ? `0 6px 0 ${vowel.color}40, 0 0 0 4px ${vowel.glow}` : `0 4px 0 rgba(0,0,0,0.3)`,
        width: '100%',
      }}
    >
      <span style={{
        fontSize: wide ? 38 : 30,
        fontFamily: 'var(--font-amiri), serif',
        color: vowel.color, direction: 'rtl', lineHeight: 1.4,
      }}>
        {letter.arabic + vowel.mark}
      </span>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: wide ? 'flex-start' : 'center', gap: 3 }}>
        <span style={{ fontSize: 10, fontWeight: 900, color: isActive ? vowel.color : SUB,
          textTransform: 'uppercase' as const, letterSpacing: '0.07em' }}>
          {vowel.name}
        </span>
        <span style={{ fontSize: 11, color: isActive ? vowel.color : 'rgba(255,255,255,0.3)',
          fontFamily: 'var(--font-amiri), serif', direction: 'rtl' }}>
          {vowel.arabic}
        </span>
        <span style={{ fontSize: 10, fontWeight: 700, color: 'white',
          background: vowel.color, borderRadius: 10, padding: '2px 8px' }}>
          {vowel.sound}
        </span>
      </div>
    </button>
  );
}

/* ─────────────────────────────────────────────
   NAV ARROW
───────────────────────────────────────────── */
function NavArrow({ dir, onClick }: { dir: string; onClick: () => void }) {
  const [hover, setHover] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        width: 40, height: 40, borderRadius: '50%', flexShrink: 0,
        border: `2px solid ${hover ? '#6366f1' : BORDER}`,
        background: CARD2,
        fontSize: 18, cursor: 'pointer',
        color: hover ? '#a5b4fc' : SUB,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'border-color 0.15s, color 0.15s',
      }}
    >
      {dir}
    </button>
  );
}

/* ─────────────────────────────────────────────
   SYLLABE BUILDER
───────────────────────────────────────────── */
function SyllabeBuilder({ letter, onNavigate, letterIdx, total, onSpeak }: {
  letter: Letter; onNavigate: (dir: -1 | 1) => void; letterIdx: number; total: number; onSpeak: (text: string) => void;
}) {
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [burst,     setBurst]     = useState(false);

  const handleKey = useCallback((key: VowelKey) => {
    setActiveKey(key.id);
    setBurst(true);
    setTimeout(() => setBurst(false), 350);
    onSpeak(key.id === 'sukun' ? letter.arabic : letter.arabic + key.mark);
  }, [letter.arabic, onSpeak]);

  const currentKey   = ALL_KEYS.find(k => k.id === activeKey) ?? null;
  const displayChar  = currentKey ? letter.arabic + currentKey.mark : letter.arabic;
  const consonant    = letter.latin.replace(/[aeiou].*/i, '').toLowerCase() || letter.latin[0].toLowerCase();
  const displayRoman = currentKey
    ? (currentKey.roman === '' ? consonant : consonant + currentKey.roman)
    : null;

  return (
    <div style={{ background: CARD, borderRadius: 24, border: `1px solid ${BORDER}`, overflow: 'hidden' }}>

      {/* Header */}
      <div style={{
        padding: '18px 20px 14px', borderBottom: `1px solid ${BORDER}`,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div>
          <div style={{ fontSize: 16, fontWeight: 900, color: TEXT }}>Construis une syllabe</div>
          <div style={{ fontSize: 13, color: SUB, marginTop: 2 }}>
            Choisis une voyelle pour entendre la prononciation
          </div>
        </div>
        <div style={{
          fontSize: 12, fontWeight: 700, color: '#a5b4fc',
          background: 'rgba(99,102,241,0.15)', borderRadius: 20, padding: '4px 10px',
          border: '1px solid rgba(99,102,241,0.25)',
        }}>
          {letterIdx + 1} / {total}
        </div>
      </div>

      <div style={{ padding: '24px 20px 20px' }}>

        {/* Stage: big letter + arrows */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, marginBottom: 24 }}>
          <NavArrow dir="‹" onClick={() => { setActiveKey(null); onNavigate(-1); }} />

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, minWidth: 120 }}>
            <div style={{
              width: 120, height: 120, borderRadius: 24,
              background: currentKey ? `${currentKey.color}15` : CARD2,
              border: `3px solid ${currentKey ? `${currentKey.color}60` : BORDER}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'background 0.3s, border-color 0.3s, box-shadow 0.3s',
              boxShadow: currentKey ? `0 0 0 6px ${currentKey.glow}` : 'none',
              transform: burst ? 'scale(1.08)' : 'scale(1)',
            }}>
              <span style={{
                fontSize: 68, fontFamily: 'var(--font-amiri), serif',
                color: currentKey ? currentKey.color : TEXT,
                direction: 'rtl', lineHeight: 1, transition: 'color 0.25s',
              }}>
                {displayChar}
              </span>
            </div>

            <div style={{ height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {displayRoman !== null ? (
                <div style={{
                  background: currentKey!.color, color: 'white',
                  borderRadius: 20, padding: '3px 16px',
                  fontSize: 16, fontWeight: 900, letterSpacing: '0.04em',
                }}>
                  {displayRoman || <span style={{ fontStyle: 'italic', fontSize: 13 }}>muet</span>}
                </div>
              ) : (
                <div style={{ fontSize: 13, color: SUB, fontStyle: 'italic' }}>
                  {letter.latin} — {letter.fr}
                </div>
              )}
            </div>
          </div>

          <NavArrow dir="›" onClick={() => { setActiveKey(null); onNavigate(1); }} />
        </div>

        {/* Short vowels */}
        <SectionDivider label="Voyelles courtes" sub="الحَرَكَات" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
          {SHORT_VOWELS.map(v => (
            <VowelButton key={v.id} vowel={v} letter={letter} isActive={activeKey === v.id} onClick={() => handleKey(v)} />
          ))}
        </div>

        {/* Sukun */}
        <SectionDivider label="Voyelle muette" sub="السُّكُون" />
        <VowelButton vowel={SUKUN_KEY} letter={letter} isActive={activeKey === 'sukun'} onClick={() => handleKey(SUKUN_KEY)} wide />

        {/* Long vowels */}
        <SectionDivider label="Voyelles longues" sub="المَدَّات" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
          {LONG_VOWELS.map(v => (
            <VowelButton key={v.id} vowel={v} letter={letter} isActive={activeKey === v.id} onClick={() => handleKey(v)} />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   PAGE
───────────────────────────────────────────── */
export default function LettresPage() {
  const { addXP, updateQuete } = useUserProgress();
  const { speak } = useAudio();

  const [mode,         setMode]         = useState<'browse' | 'session'>('browse');
  const [knownLetters, setKnownLetters] = useState<Set<string>>(new Set());
  const [selectedIdx,  setSelectedIdx]  = useState<number>(0);

  const speakAr    = useCallback((text: string) => speak(text, 'ar-MA'), [speak]);
  const speakLetter = (arabic: string) => {
    speakAr(arabic);
    setKnownLetters(prev => new Set(prev).add(arabic));
  };

  const handleNavigate = (dir: -1 | 1) => {
    setSelectedIdx(i => {
      const next = i + dir;
      if (next < 0) return ALL_LETTERS.length - 1;
      if (next >= ALL_LETTERS.length) return 0;
      return next;
    });
  };

  const handleSelectLetter = (idx: number) => {
    setSelectedIdx(idx);
    document.getElementById('syllabe-builder')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const [exercises, setExercises] = useState(() => buildExercises(ALL_LETTERS, SHORT_VOWELS));

  const handleStart = () => {
    setExercises(buildExercises(ALL_LETTERS, SHORT_VOWELS));
    setMode('session');
  };

  const handleSessionFinish = (score: number) => {
    const xp = Math.max(5, score * 2);
    addXP(xp);
    updateQuete('xp', xp);
  };

  const knownCount  = knownLetters.size;
  const totalCount  = ALL_LETTERS.length;
  const progressPct = Math.round((knownCount / totalCount) * 100);

  if (mode === 'session') {
    return (
      <div style={{ maxWidth: 640, margin: '0 auto', padding: '0 16px' }}>
        <ExerciseSession
          exercises={exercises}
          speak={speakAr}
          onFinish={handleSessionFinish}
          onBack={() => setMode('browse')}
        />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 640, margin: '0 auto', padding: '0 16px 80px', color: TEXT }}>

      {/* HERO */}
      <div style={{ textAlign: 'center', padding: '32px 16px 24px' }}>
        <h1 style={{ fontSize: 28, fontWeight: 900, color: TEXT, lineHeight: 1.2, marginBottom: 10 }}>
          Apprends les lettres en Darija !
        </h1>
        <p style={{ fontSize: 15, color: SUB, marginBottom: 24, lineHeight: 1.5 }}>
          Entraîne ton œil et apprends à reconnaître les 28 lettres de l'alphabet arabe utilisées en Darija marocain
        </p>

        {/* Progress bar */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          background: CARD, borderRadius: 12, padding: '10px 16px', marginBottom: 20,
          border: `1px solid ${BORDER}`,
        }}>
          <div style={{ flex: 1, height: 8, background: 'rgba(255,255,255,0.08)', borderRadius: 4, overflow: 'hidden' }}>
            <div style={{
              height: '100%', width: `${progressPct}%`,
              background: `linear-gradient(90deg, ${BLUE}, ${GREEN})`,
              borderRadius: 4, transition: 'width 0.5s ease',
            }} />
          </div>
          <span style={{ fontSize: 13, fontWeight: 800, color: BLUE, flexShrink: 0 }}>
            {knownCount} / {totalCount}
          </span>
        </div>

        <button
          onClick={handleStart}
          style={{
            padding: '14px 40px', borderRadius: 14, border: 'none', cursor: 'pointer',
            background: BLUE, color: 'white',
            fontWeight: 900, fontSize: 15,
            letterSpacing: '0.06em', textTransform: 'uppercase' as const,
            boxShadow: '0 5px 0 #1899d6', transition: 'transform 0.1s',
          }}
          onMouseDown={e => (e.currentTarget.style.transform = 'scale(0.97)')}
          onMouseUp={e => (e.currentTarget.style.transform = 'scale(1)')}
        >
          COMMENCER — GAGNER DES XP ✨
        </button>
      </div>

      {/* LETTER GROUPS */}
      {ALPHABET_GROUPS.map(group => (
        <div key={group.title} style={{ marginBottom: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
            <div style={{ flex: 1, height: 1, background: BORDER }} />
            <span style={{ fontSize: 13, fontWeight: 800, color: SUB, whiteSpace: 'nowrap',
              padding: '0 4px', textTransform: 'uppercase' as const, letterSpacing: '0.06em' }}>
              {group.title}
            </span>
            <div style={{ flex: 1, height: 1, background: BORDER }} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
            {group.letters.map(letter => {
              const idx = ALL_LETTERS.findIndex(l => l.arabic === letter.arabic);
              return (
                <LetterCard
                  key={letter.arabic}
                  letter={letter}
                  isKnown={knownLetters.has(letter.arabic)}
                  isSelected={selectedIdx === idx}
                  onSpeak={() => speakLetter(letter.arabic)}
                  onSelect={() => handleSelectLetter(idx)}
                />
              );
            })}
          </div>
        </div>
      ))}

      {/* Vowel section divider */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '8px 0 12px' }}>
        <div style={{ flex: 1, height: 1, background: BORDER }} />
        <span style={{ fontSize: 13, fontWeight: 800, color: SUB, whiteSpace: 'nowrap', padding: '0 4px',
          textTransform: 'uppercase' as const, letterSpacing: '0.06em' }}>
          Voyelles courtes · حَرَكَات
        </span>
        <div style={{ flex: 1, height: 1, background: BORDER }} />
      </div>

      <p style={{ fontSize: 13, color: SUB, textAlign: 'center', marginBottom: 16, lineHeight: 1.5 }}>
        Clique sur une lettre ci-dessus pour la sélectionner,<br />
        puis tape une voyelle pour entendre la syllabe
      </p>

      {/* SYLLABE BUILDER */}
      <div id="syllabe-builder">
        <SyllabeBuilder
          letter={ALL_LETTERS[selectedIdx]}
          letterIdx={selectedIdx}
          total={ALL_LETTERS.length}
          onNavigate={handleNavigate}
          onSpeak={speakAr}
        />
      </div>

      <style>{`
        @keyframes popIn {
          0%   { transform: scale(0.7); opacity: 0.5; }
          60%  { transform: scale(1.12); }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
