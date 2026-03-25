'use client';

import React, { useState, useEffect } from 'react';

/* ─────────────────────────────────────────────
   TYPES
───────────────────────────────────────────── */
export interface Letter { arabic: string; latin: string; fr: string; }
export interface ShortVowel {
  id: string; mark: string; name: string;
  sound: string; roman: string;
  color: string; light: string; border: string;
}

type Exercise =
  | { kind: 'hear';   target: Letter;       options: Letter[]     }
  | { kind: 'see';    target: Letter;       options: string[]     }
  | { kind: 'pair';   a: Letter; b: Letter; same: boolean         }
  | { kind: 'vowel';  letter: Letter;       vowel: ShortVowel; options: ShortVowel[] }
  | { kind: 'latin';  target: Letter;       options: Letter[]     }

/* ─────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────── */
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function pick<T>(arr: T[], n: number, exclude?: T): T[] {
  return shuffle(arr.filter(x => x !== exclude)).slice(0, n);
}

const SIMILAR_PAIRS: [string, string][] = [
  ['س', 'ص'], ['ح', 'خ'], ['ض', 'د'], ['ط', 'ت'],
  ['ظ', 'ذ'], ['ع', 'غ'], ['ه', 'ح'], ['ق', 'ك'],
  ['ر', 'ز'], ['ش', 'س'], ['ب', 'ف'], ['ل', 'ن'],
];

/* ─────────────────────────────────────────────
   BUILD EXERCISES (1 per letter, cycling types)
───────────────────────────────────────────── */
export function buildExercises(letters: Letter[], vowels: ShortVowel[]): Exercise[] {
  const shuffled = shuffle([...letters]);
  const kinds = ['hear', 'see', 'pair', 'vowel', 'latin'] as const;

  return shuffled.map((letter, i) => {
    const kind = kinds[i % 5];
    const dist = pick(letters, 3, letter);

    if (kind === 'hear') {
      return { kind: 'hear', target: letter, options: shuffle([letter, ...dist]) };
    }
    if (kind === 'see') {
      return { kind: 'see', target: letter, options: shuffle([letter.fr, ...dist.map(d => d.fr)]) };
    }
    if (kind === 'latin') {
      return { kind: 'latin', target: letter, options: shuffle([letter, ...dist]) };
    }
    if (kind === 'vowel') {
      const vowel = vowels[Math.floor(Math.random() * vowels.length)];
      return { kind: 'vowel', letter, vowel, options: shuffle([...vowels]) };
    }
    // pair
    const pair = SIMILAR_PAIRS.find(p => p.includes(letter.arabic));
    const same = !pair || Math.random() < 0.4;
    if (!same) {
      const otherAr = pair!.find(a => a !== letter.arabic)!;
      const other   = letters.find(l => l.arabic === otherAr) ?? dist[0];
      return { kind: 'pair', a: letter, b: other, same: false };
    }
    return { kind: 'pair', a: letter, b: letter, same: true };
  });
}

/* ─────────────────────────────────────────────
   SHARED: option button styles
───────────────────────────────────────────── */
function optionState(
  key: string,
  selected: string | null,
  correctKey: string,
): React.CSSProperties {
  if (!selected) return {
    border: '2.5px solid #e5e7eb', background: 'white', color: '#111827',
  };
  if (key === correctKey) return {
    border: '2.5px solid #10b981', background: '#f0fdf4', color: '#059669',
  };
  if (key === selected) return {
    border: '2.5px solid #ef4444', background: '#fef2f2', color: '#dc2626',
  };
  return { border: '2.5px solid #e5e7eb', background: 'white', color: '#9ca3af' };
}

/* ─────────────────────────────────────────────
   WAVE BARS  (animated equalizer-style icon)
───────────────────────────────────────────── */
function WaveBars({ size, color, animated }: { size: number; color: string; animated: boolean }) {
  const barW  = Math.max(3, Math.round(size * 0.1));
  const maxH  = Math.round(size * 0.52);
  const ratio = [0.38, 0.82, 0.55, 1, 0.68]; // static heights
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: Math.round(barW * 0.75), height: maxH }}>
      {ratio.map((r, i) => (
        <div key={i} style={{
          width: barW,
          height: maxH,
          borderRadius: barW,
          background: color,
          transformOrigin: 'bottom',
          transform: `scaleY(${animated ? 1 : r})`,
          transition: animated ? 'none' : 'transform 0.25s ease',
          animation: animated
            ? `audioWave ${0.45 + i * 0.06}s ease-in-out ${i * 0.07}s infinite alternate`
            : 'none',
        }} />
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────
   SPEAKER BUTTON  (wave bars + ripple)
───────────────────────────────────────────── */
function SpeakerBtn({ onPlay, size = 80 }: { onPlay: () => void; size?: number }) {
  const [playing, setPlaying] = useState(false);

  const handleClick = () => {
    setPlaying(true);
    setTimeout(() => setPlaying(false), 1400);
    onPlay();
  };

  const r = Math.round(size * 0.28);

  return (
    <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
      {/* Ripple rings */}
      {playing && [0, 1].map(i => (
        <div key={i} style={{
          position: 'absolute',
          width: size, height: size,
          borderRadius: r,
          border: '2px solid rgba(56, 189, 248, 0.5)',
          animation: `rippleOut 1.4s ease-out ${i * 0.45}s infinite`,
          pointerEvents: 'none',
        }} />
      ))}

      <button
        onClick={handleClick}
        style={{
          position: 'relative', zIndex: 1,
          width: size, height: size, borderRadius: r,
          background: playing
            ? 'linear-gradient(145deg, #0369a1, #0ea5e9)'
            : 'linear-gradient(145deg, #0ea5e9, #38bdf8)',
          border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: playing ? '0 2px 0 #075985' : '0 6px 0 #075985',
          transform: playing ? 'translateY(4px)' : 'none',
          transition: 'transform 0.12s, box-shadow 0.12s, background 0.2s',
        }}
      >
        <WaveBars size={size} color="white" animated={playing} />
      </button>
    </div>
  );
}

/* ─────────────────────────────────────────────
   PAIR SOUND BUTTON  (for PairExercise)
───────────────────────────────────────────── */
function PairSoundBtn({ label, played, active, onClick }: {
  label: string; played: boolean; active: boolean; onClick: () => void;
}) {
  return (
    <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
      {active && [0, 1].map(i => (
        <div key={i} style={{
          position: 'absolute', top: 0,
          width: 80, height: 80,
          borderRadius: 20,
          border: '2px solid rgba(16,185,129,0.45)',
          animation: `rippleOut 1.2s ease-out ${i * 0.38}s infinite`,
          pointerEvents: 'none',
        }} />
      ))}
      <button onClick={onClick} style={{
        position: 'relative', zIndex: 1,
        width: 80, height: 80, borderRadius: 20,
        background: active
          ? 'linear-gradient(145deg, #059669, #10b981)'
          : played
            ? '#f0fdf4'
            : '#f8fafc',
        border: `3px solid ${active ? '#059669' : played ? '#10b981' : '#e5e7eb'}`,
        cursor: 'pointer',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', gap: 6,
        transition: 'all 0.2s',
        boxShadow: active ? '0 4px 0 #047857' : played ? '0 4px 0 #a7f3d0' : '0 4px 0 #e5e7eb',
        transform: active ? 'translateY(2px)' : 'none',
      }}>
        <WaveBars size={44} color={active ? 'white' : played ? '#10b981' : '#9ca3af'} animated={active} />
      </button>
      <span style={{ fontSize: 11, fontWeight: 700, color: played ? '#10b981' : '#9ca3af' }}>{label}</span>
    </div>
  );
}

/* ─────────────────────────────────────────────
   GLOBAL KEYFRAMES (injected once)
───────────────────────────────────────────── */
const KEYFRAMES = `
  @keyframes audioWave {
    0%   { transform: scaleY(0.2); }
    100% { transform: scaleY(1);   }
  }
  @keyframes rippleOut {
    0%   { transform: scale(1);   opacity: 0.7; }
    100% { transform: scale(1.9); opacity: 0;   }
  }
`;

/* ─────────────────────────────────────────────
   EX 1 — HEAR  "Qu'entends-tu ?"
───────────────────────────────────────────── */
function HearExercise({ ex, speak, onAnswer }: {
  ex: Extract<Exercise, { kind: 'hear' }>;
  speak: (t: string) => void;
  onAnswer: (c: boolean) => void;
}) {
  const [sel, setSel] = useState<string | null>(null);
  useEffect(() => { setTimeout(() => speak(ex.target.arabic), 300); }, [ex.target.arabic]);

  const pick = (l: Letter) => {
    if (sel) return;
    setSel(l.arabic);
    onAnswer(l.arabic === ex.target.arabic);
  };

  return (
    <div>
      <h2 style={S.title}>Qu'entends-tu ?</h2>
      <p style={S.sub}>Appuie sur la lettre que tu as entendue</p>
      <div style={{ display: 'flex', justifyContent: 'center', margin: '28px 0' }}>
        <SpeakerBtn onPlay={() => speak(ex.target.arabic)} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {ex.options.map(opt => (
          <button key={opt.arabic} onClick={() => pick(opt)}
            style={{ ...S.optBtn, ...optionState(opt.arabic, sel, ex.target.arabic), cursor: sel ? 'default' : 'pointer' }}>
            <span style={S.bigArabic}>{opt.arabic}</span>
            <span style={S.latinLabel}>{opt.latin}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   EX 2 — SEE  "Quel son correspond à cette lettre ?"
───────────────────────────────────────────── */
function SeeExercise({ ex, speak, onAnswer }: {
  ex: Extract<Exercise, { kind: 'see' }>;
  speak: (t: string) => void;
  onAnswer: (c: boolean) => void;
}) {
  const [sel, setSel] = useState<string | null>(null);

  const pick = (fr: string) => {
    if (sel) return;
    setSel(fr);
    onAnswer(fr === ex.target.fr);
  };

  return (
    <div>
      <h2 style={S.title}>Quel son correspond à cette lettre ?</h2>
      <p style={S.sub}>Sélectionne la bonne description</p>

      {/* Big letter + speaker */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, margin: '24px 0' }}>
        <div style={{
          width: 100, height: 100, borderRadius: 24,
          background: '#f0f4ff', border: '3px solid #c7d2fe',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <span style={{ fontSize: 60, fontFamily: 'var(--font-amiri), serif', color: '#1b3a6b', direction: 'rtl' }}>
            {ex.target.arabic}
          </span>
        </div>
        <SpeakerBtn onPlay={() => speak(ex.target.arabic)} size={48} />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {ex.options.map((fr, i) => (
          <button key={fr} onClick={() => pick(fr)}
            style={{ ...S.rowBtn, ...optionState(fr, sel, ex.target.fr), cursor: sel ? 'default' : 'pointer' }}>
            <span style={S.rowNum}>{i + 1}</span>
            <span style={{ fontSize: 15, fontWeight: 600 }}>{fr}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   EX 3 — PAIR  "Ces deux sons sont-ils identiques ?"
───────────────────────────────────────────── */
function PairExercise({ ex, speak, onAnswer }: {
  ex: Extract<Exercise, { kind: 'pair' }>;
  speak: (t: string) => void;
  onAnswer: (c: boolean) => void;
}) {
  const [sel, setSel]     = useState<string | null>(null);
  const [playedA,  setPA]  = useState(false);
  const [playedB,  setPB]  = useState(false);
  const [activeA,  setAA]  = useState(false);
  const [activeB,  setAB]  = useState(false);

  const playA = () => {
    setPA(true); setAA(true); setTimeout(() => setAA(false), 1400);
    speak(ex.a.arabic);
  };
  const playB = () => {
    setPB(true); setAB(true); setTimeout(() => setAB(false), 1400);
    speak(ex.b.arabic);
  };

  const canAnswer = playedA && playedB;
  const correct   = ex.same ? 'same' : 'diff';

  const pick = (ans: string) => {
    if (sel || !canAnswer) return;
    setSel(ans);
    onAnswer(ans === correct);
  };

  return (
    <div>
      <h2 style={S.title}>Ces deux sons sont-ils identiques ?</h2>
      <p style={S.sub}>Écoute les deux sons, puis réponds</p>

      <div style={{ display: 'flex', justifyContent: 'center', gap: 20, margin: '28px 0' }}>
        {/* Sound A */}
        <PairSoundBtn label="Son 1" played={playedA} active={activeA} onClick={playA} />

        {/* VS divider */}
        <div style={{ display: 'flex', alignItems: 'center', fontSize: 18, fontWeight: 900, color: '#d1d5db' }}>
          VS
        </div>

        {/* Sound B */}
        <PairSoundBtn label="Son 2" played={playedB} active={activeB} onClick={playB} />
      </div>

      {!canAnswer && (
        <p style={{ textAlign: 'center', fontSize: 13, color: '#9ca3af', marginBottom: 16 }}>
          Écoute les deux sons d'abord
        </p>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {[
          { key: 'same', label: 'Oui, même son', icon: '🟰' },
          { key: 'diff', label: 'Non, sons différents', icon: '≠' },
        ].map((opt, i) => (
          <button key={opt.key}
            onClick={() => pick(opt.key)}
            style={{
              ...S.rowBtn,
              ...optionState(opt.key, sel, correct),
              cursor: (!canAnswer || sel) ? 'default' : 'pointer',
              opacity: (!canAnswer && !sel) ? 0.5 : 1,
            }}>
            <span style={S.rowNum}>{i + 1}</span>
            <span style={{ fontSize: 15, fontWeight: 600 }}>{opt.icon} {opt.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   EX 4 — VOWEL  "Quelle voyelle entends-tu ?"
───────────────────────────────────────────── */
function VowelExercise({ ex, speak, onAnswer }: {
  ex: Extract<Exercise, { kind: 'vowel' }>;
  speak: (t: string) => void;
  onAnswer: (c: boolean) => void;
}) {
  const [sel, setSel] = useState<string | null>(null);
  const syllable = ex.letter.arabic + ex.vowel.mark;

  useEffect(() => { setTimeout(() => speak(syllable), 300); }, [syllable]);

  const pick = (v: ShortVowel) => {
    if (sel) return;
    setSel(v.id);
    onAnswer(v.id === ex.vowel.id);
  };

  return (
    <div>
      <h2 style={S.title}>Quelle voyelle entends-tu ?</h2>
      <p style={S.sub}>Identifie la voyelle dans la syllabe</p>

      {/* Speaker showing the syllable */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, margin: '24px 0' }}>
        <div style={{
          width: 100, height: 100, borderRadius: 24,
          background: sel ? (ex.options.find(v => v.id === sel)?.light ?? '#f8fafc') : '#f0f4ff',
          border: `3px solid ${sel ? (ex.options.find(v => v.id === sel)?.border ?? '#e5e7eb') : '#c7d2fe'}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all 0.3s',
        }}>
          <span style={{
            fontSize: 58, fontFamily: 'var(--font-amiri), serif',
            color: sel ? (ex.options.find(v => v.id === sel)?.color ?? '#1b3a6b') : '#6366f1',
            direction: 'rtl',
          }}>
            {sel ? syllable : ex.letter.arabic}
          </span>
        </div>
        <SpeakerBtn onPlay={() => speak(syllable)} size={48} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
        {ex.options.map(v => {
          const isActive  = sel === v.id;
          const isCorrect = v.id === ex.vowel.id;
          let bg = 'white', border = v.border, color = v.color;
          if (sel) {
            if (isCorrect)             { bg = v.light;    border = v.color;  }
            else if (isActive)         { bg = '#fef2f2';  border = '#ef4444'; color = '#ef4444'; }
            else                       { bg = 'white';    border = '#e5e7eb'; color = '#9ca3af'; }
          }
          return (
            <button key={v.id} onClick={() => pick(v)}
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5,
                padding: '14px 8px 12px', borderRadius: 16,
                border: `2.5px solid ${border}`, background: bg,
                cursor: sel ? 'default' : 'pointer', transition: 'all 0.2s',
                boxShadow: !sel ? `0 3px 0 ${v.border}` : 'none',
              }}>
              <span style={{ fontSize: 30, fontFamily: 'var(--font-amiri), serif', color, direction: 'rtl' }}>
                {'ب' + v.mark}
              </span>
              <span style={{ fontSize: 10, fontWeight: 900, color, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                {v.name}
              </span>
              <span style={{ fontSize: 11, fontWeight: 700, color: 'white', background: color, borderRadius: 10, padding: '2px 8px' }}>
                {v.sound}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   EX 5 — LATIN  "Retrouve la lettre"
───────────────────────────────────────────── */
function LatinExercise({ ex, speak, onAnswer }: {
  ex: Extract<Exercise, { kind: 'latin' }>;
  speak: (t: string) => void;
  onAnswer: (c: boolean) => void;
}) {
  const [sel, setSel] = useState<string | null>(null);

  const pick = (l: Letter) => {
    if (sel) return;
    setSel(l.arabic);
    speak(l.arabic);
    onAnswer(l.arabic === ex.target.arabic);
  };

  return (
    <div>
      <h2 style={S.title}>Retrouve la lettre</h2>
      <p style={S.sub}>Sélectionne la lettre correspondante</p>

      {/* Latin name */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, margin: '28px 0' }}>
        <div style={{
          background: '#f5f3ff', border: '3px solid #ddd6fe',
          borderRadius: 20, padding: '14px 32px',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
        }}>
          <span style={{ fontSize: 28, fontWeight: 900, color: '#4c1d95', letterSpacing: '0.02em' }}>
            {ex.target.latin}
          </span>
          <span style={{ fontSize: 13, color: '#7c3aed' }}>{ex.target.fr}</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {ex.options.map(opt => (
          <button key={opt.arabic} onClick={() => pick(opt)}
            style={{ ...S.optBtn, ...optionState(opt.arabic, sel, ex.target.arabic), cursor: sel ? 'default' : 'pointer' }}>
            <span style={S.bigArabic}>{opt.arabic}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   DONE SCREEN
───────────────────────────────────────────── */
function DoneScreen({ score, total, xp, onRestart, onBack }: {
  score: number; total: number; xp: number; onRestart: () => void; onBack: () => void;
}) {
  const pct   = Math.round((score / total) * 100);
  const stars = pct >= 90 ? 3 : pct >= 60 ? 2 : 1;

  return (
    <div style={{ textAlign: 'center', padding: '40px 16px 60px' }}>
      <div style={{ fontSize: 64, marginBottom: 8 }}>
        {stars === 3 ? '🏆' : stars === 2 ? '🥈' : '🎯'}
      </div>
      <h2 style={{ fontSize: 26, fontWeight: 900, color: '#111827', marginBottom: 6 }}>
        {pct >= 90 ? 'Excellent !' : pct >= 60 ? 'Bien joué !' : 'Continue comme ça !'}
      </h2>
      <p style={{ fontSize: 15, color: '#6b7280', marginBottom: 28 }}>
        {score} / {total} bonnes réponses
      </p>

      {/* Stars */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 28, fontSize: 36 }}>
        {[1, 2, 3].map(s => (
          <span key={s} style={{ opacity: s <= stars ? 1 : 0.2, filter: s <= stars ? 'none' : 'grayscale(1)' }}>⭐</span>
        ))}
      </div>

      {/* XP badge */}
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: 8,
        background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
        color: 'white', borderRadius: 20, padding: '10px 24px',
        fontSize: 18, fontWeight: 900, marginBottom: 36,
        boxShadow: '0 4px 0 #b45309',
      }}>
        ✨ +{xp} XP gagnés !
      </div>

      {/* Score bar */}
      <div style={{
        background: '#f8fafc', borderRadius: 12, padding: '14px 20px', marginBottom: 28,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, fontWeight: 700, color: '#374151', marginBottom: 8 }}>
          <span>Score</span><span>{pct}%</span>
        </div>
        <div style={{ height: 10, background: '#e2e8f0', borderRadius: 5, overflow: 'hidden' }}>
          <div style={{
            height: '100%', width: `${pct}%`,
            background: pct >= 80 ? 'linear-gradient(90deg, #10b981, #34d399)' :
                        pct >= 50 ? 'linear-gradient(90deg, #f59e0b, #fbbf24)' :
                                    'linear-gradient(90deg, #ef4444, #f87171)',
            borderRadius: 5, transition: 'width 1s ease',
          }} />
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <button onClick={onRestart}
          style={{ ...S.ctaBtn, background: 'linear-gradient(135deg, #38bdf8, #0ea5e9)', boxShadow: '0 5px 0 #0369a1' }}>
          Rejouer 🔄
        </button>
        <button onClick={onBack}
          style={{ ...S.ctaBtn, background: 'white', color: '#6b7280', border: '2px solid #e5e7eb', boxShadow: '0 4px 0 #d1d5db' }}>
          Retour aux lettres
        </button>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   FEEDBACK BAR
───────────────────────────────────────────── */
function FeedbackBar({ correct, onNext, isLast }: { correct: boolean; onNext: () => void; isLast: boolean }) {
  return (
    <div style={{
      marginTop: 28, padding: '16px 20px',
      borderRadius: 20, borderTop: `4px solid ${correct ? '#10b981' : '#ef4444'}`,
      background: correct ? '#f0fdf4' : '#fef2f2',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ fontSize: 24 }}>{correct ? '✅' : '❌'}</span>
        <div>
          <div style={{ fontSize: 14, fontWeight: 900, color: correct ? '#059669' : '#dc2626' }}>
            {correct ? 'Correct !' : 'Pas tout à fait…'}
          </div>
        </div>
      </div>
      <button onClick={onNext}
        style={{
          padding: '10px 24px', borderRadius: 12, border: 'none', cursor: 'pointer',
          background: correct ? '#10b981' : '#ef4444',
          color: 'white', fontWeight: 900, fontSize: 14,
          boxShadow: `0 4px 0 ${correct ? '#059669' : '#b91c1c'}`,
        }}>
        {isLast ? 'Terminer' : 'Continuer →'}
      </button>
    </div>
  );
}

/* ─────────────────────────────────────────────
   MAIN: EXERCISE SESSION
───────────────────────────────────────────── */
export default function ExerciseSession({
  exercises,
  speak,
  onFinish,
  onBack,
}: {
  exercises: Exercise[];
  speak: (text: string) => void;
  onFinish: (score: number) => void;
  onBack: () => void;
}) {
  const [idx,       setIdx]       = useState(0);
  const [score,     setScore]     = useState(0);
  const [answered,  setAnswered]  = useState<boolean | null>(null);
  const [done,      setDone]      = useState(false);
  const [finalScore, setFinalScore] = useState(0);

  const total  = exercises.length;
  const ex     = exercises[idx];
  const isLast = idx + 1 >= total;
  const pct    = Math.round((idx / total) * 100);

  const handleAnswer = (correct: boolean) => {
    setAnswered(correct);
    if (correct) setScore(s => s + 1);
  };

  const handleNext = () => {
    const newScore = score + (answered ? 1 : 0);
    if (isLast) {
      setFinalScore(newScore);
      setDone(true);
      onFinish(newScore);
    } else {
      setIdx(i => i + 1);
      setAnswered(null);
    }
  };

  const handleRestart = () => {
    setIdx(0);
    setScore(0);
    setAnswered(null);
    setDone(false);
  };

  const xp = Math.max(5, finalScore * 2);

  if (done) {
    return <DoneScreen score={finalScore} total={total} xp={xp} onRestart={handleRestart} onBack={onBack} />;
  }

  return (
    <div style={{ padding: '0 0 80px' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px 0 20px' }}>
        <button onClick={onBack}
          style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: '#6b7280', padding: 4 }}>
          ✕
        </button>
        <div style={{ flex: 1, height: 10, background: '#e5e7eb', borderRadius: 5, overflow: 'hidden' }}>
          <div style={{
            height: '100%', width: `${pct}%`,
            background: 'linear-gradient(90deg, #4ade80, #22c55e)',
            borderRadius: 5, transition: 'width 0.4s ease',
          }} />
        </div>
        <span style={{ fontSize: 13, fontWeight: 800, color: '#6b7280', flexShrink: 0 }}>
          {idx + 1} / {total}
        </span>
      </div>

      {/* Exercise card */}
      <div style={{
        background: 'white', borderRadius: 24,
        border: '2px solid #f0f0f0',
        padding: '24px 20px 20px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
      }}>
        {ex.kind === 'hear'  && <HearExercise  ex={ex} speak={speak} onAnswer={handleAnswer} />}
        {ex.kind === 'see'   && <SeeExercise   ex={ex} speak={speak} onAnswer={handleAnswer} />}
        {ex.kind === 'pair'  && <PairExercise  ex={ex} speak={speak} onAnswer={handleAnswer} />}
        {ex.kind === 'vowel' && <VowelExercise ex={ex} speak={speak} onAnswer={handleAnswer} />}
        {ex.kind === 'latin' && <LatinExercise ex={ex} speak={speak} onAnswer={handleAnswer} />}

        {answered !== null && (
          <FeedbackBar correct={answered} onNext={handleNext} isLast={isLast} />
        )}
      </div>

      <style>{KEYFRAMES}</style>
    </div>
  );
}

/* ─────────────────────────────────────────────
   SHARED STYLES
───────────────────────────────────────────── */
const S = {
  title: {
    fontSize: 22, fontWeight: 900, color: '#111827', marginBottom: 6,
  } as React.CSSProperties,
  sub: {
    fontSize: 14, color: '#6b7280', marginBottom: 0,
  } as React.CSSProperties,
  optBtn: {
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    padding: '20px 12px', borderRadius: 16,
    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
    transition: 'all 0.2s',
  } as React.CSSProperties,
  bigArabic: {
    fontSize: 44, fontFamily: 'var(--font-amiri), serif',
    direction: 'rtl' as const, lineHeight: 1.2,
  } as React.CSSProperties,
  latinLabel: {
    fontSize: 11, fontWeight: 700, color: '#9ca3af', letterSpacing: '0.04em',
  } as React.CSSProperties,
  rowBtn: {
    display: 'flex', alignItems: 'center', gap: 14,
    padding: '14px 16px', borderRadius: 14,
    width: '100%', textAlign: 'left' as const,
    transition: 'all 0.2s',
  } as React.CSSProperties,
  rowNum: {
    width: 28, height: 28, borderRadius: 8, flexShrink: 0,
    background: '#f3f4f6', display: 'flex', alignItems: 'center',
    justifyContent: 'center', fontSize: 12, fontWeight: 700, color: '#9ca3af',
  } as React.CSSProperties,
  ctaBtn: {
    padding: '14px 20px', borderRadius: 14, border: 'none',
    cursor: 'pointer', fontWeight: 900, fontSize: 15,
    letterSpacing: '0.04em', width: '100%',
  } as React.CSSProperties,
};
