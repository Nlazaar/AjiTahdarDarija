"use client";

import React, { useState, useEffect, useMemo } from "react";
import { getSettings } from "@/hooks/useSettings";
import { useAudioCtx } from "@/contexts/AudioContext";

/** Palette DarijaMaroc — voir project_design_system memory. */
const MC = {
  green:   "#006233",
  red:     "#c1272d",
  gold:    "#d4a84b",
  blue:    "#1e4d8c",
  bg:      "#0f1720",
  card:    "#1a242b",
  border:  "#2a3d47",
  sub:     "#8a9baa",
};

/** Couleurs "terre du Maroc" — une teinte par paire matchée. */
const PAIR_COLORS: { border: string; bg: string }[] = [
  { border: "#006233", bg: "#0d2219" }, // vert drapeau
  { border: "#c17450", bg: "#2a1a12" }, // terracotta / argile
  { border: "#1e4d8c", bg: "#0f1c30" }, // bleu Majorelle
  { border: "#b38a3f", bg: "#24200a" }, // or henné
  { border: "#7a4e6f", bg: "#201422" }, // aubergine
  { border: "#2a8274", bg: "#0f2220" }, // sarcelle / thé à la menthe
];

interface TrouverLesPairesProps {
  pairs: Array<{
    letter: string;
    latin: string;
    fr: string;
  }>;
  onConfirm: () => void;
  onReadyChange?: (ready: boolean) => void;
  mode?: 'lettre' | 'mot';
  prompt?: string;
}

type CardState = 'idle' | 'selected' | 'matched' | 'error' | 'disabled';
type StarState = 'idle' | 'selected' | 'correct' | 'wrong' | 'muted';

function StarBadge({ n, state, size = 28, pairColor }: { n: number; state: StarState; size?: number; pairColor?: string }) {
  const colors: Record<StarState, { fill: string; fillOp: number; text: string }> = {
    idle:     { fill: MC.gold,               fillOp: 0.22, text: MC.gold   },
    selected: { fill: MC.gold,               fillOp: 0.85, text: "#ffffff" },
    correct:  { fill: pairColor ?? MC.green, fillOp: 1,    text: "#ffffff" },
    wrong:    { fill: MC.red,                fillOp: 1,    text: "#ffffff" },
    muted:    { fill: MC.gold,               fillOp: 0.08, text: "#4a5d6a" },
  };
  const c = colors[state];
  return (
    <span
      style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: size, height: size, flexShrink: 0 }}
      aria-hidden
    >
      <svg viewBox="0 0 100 100" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', transition: 'all 0.2s' }}>
        <g fill={c.fill} fillOpacity={c.fillOp}>
          <rect x="10" y="10" width="80" height="80" />
          <rect x="10" y="10" width="80" height="80" transform="rotate(45 50 50)" />
        </g>
      </svg>
      <span style={{ position: 'relative', color: c.text, fontSize: Math.round(size * 0.4), fontWeight: 900, lineHeight: 1, transition: 'color 0.2s' }}>
        {n}
      </span>
    </span>
  );
}

function stateToStar(cs: CardState, anyMatched: boolean): StarState {
  if (cs === 'matched') return 'correct';
  if (cs === 'error')   return 'wrong';
  if (cs === 'selected') return 'selected';
  if (cs === 'disabled') return anyMatched ? 'muted' : 'idle';
  return anyMatched ? 'muted' : 'idle';
}

function cardStyle(state: CardState, pairColor?: { border: string; bg: string }): React.CSSProperties {
  const base: React.CSSProperties = {
    width: '100%',
    minHeight: 72,
    display: 'flex',
    alignItems: 'center',
    borderStyle: 'solid',
    borderWidth: 2,
    borderRadius: 20,
    transition: 'all 0.15s',
    background: MC.card,
    color: '#ffffff',
    padding: '10px 12px',
    gap: 10,
  };
  switch (state) {
    case 'selected':
      return {
        ...base,
        borderColor: MC.gold,
        background: '#1f2a1e',
        boxShadow: `0 4px 0 ${MC.gold}55, 0 0 0 4px ${MC.gold}22`,
        transform: 'translateY(2px)',
      };
    case 'matched': {
      const c = pairColor ?? { border: MC.green, bg: '#0f2419' };
      return {
        ...base,
        borderColor: c.border,
        background: c.bg,
        boxShadow: `0 0 0 4px ${c.border}33`,
        opacity: 0.95,
      };
    }
    case 'error':
      return {
        ...base,
        borderColor: MC.red,
        background: '#2a1416',
        boxShadow: `0 4px 0 #7a1a1c`,
      };
    case 'disabled':
      return {
        ...base,
        borderColor: `${MC.gold}55`,
        boxShadow: `0 4px 0 #1a2830`,
        opacity: 0.45,
      };
    default:
      return {
        ...base,
        borderColor: `${MC.gold}55`,
        boxShadow: `0 4px 0 #1a2830`,
      };
  }
}

/** Haut-parleur Majorelle — s'allume (or) quand la carte est sélectionnée. */
function AudioChip({ active }: { active: boolean }) {
  return (
    <span
      style={{
        width: 32, height: 32, borderRadius: 10,
        background: active ? MC.gold : MC.blue,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        color: '#ffffff', flexShrink: 0,
        transition: 'background 0.2s',
        boxShadow: `0 2px 0 ${active ? '#8a6a1c' : '#153a6b'}`,
      }}
      aria-hidden
    >
      <svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" width={14} height={14}>
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
        <path d="M15.54 8.46a5 5 0 0 1 0 7.07" fill="none" />
        <path d="M19.07 4.93a10 10 0 0 1 0 14.14" fill="none" />
      </svg>
    </span>
  );
}

export default function TrouverLesPaires({ pairs, onConfirm, onReadyChange, mode = 'lettre', prompt }: TrouverLesPairesProps) {
  const { speak } = useAudioCtx();

  const playLetter = (letter: string) => {
    if (!getSettings().soundEffects) return;
    speak(letter, "ar-MA");
  };

  const [selectedLeft,  setSelectedLeft]  = useState<string | null>(null);
  const [selectedRight, setSelectedRight] = useState<string | null>(null);
  const [matchedIds,    setMatchedIds]    = useState<Set<string>>(new Set());
  const [wrongPair,     setWrongPair]     = useState<string[] | null>(null);

  const sigKey = pairs.map(p => p.latin).join('|');

  const shuffleArray = <T,>(arr: T[]): T[] => {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };

  const shuffledLeft = useMemo(() => shuffleArray(pairs), [sigKey]); // eslint-disable-line react-hooks/exhaustive-deps

  const shuffledRight = useMemo(() => {
    if (pairs.length <= 1) return [...pairs];
    let s = shuffleArray(pairs);
    let tries = 0;
    while (s.every((p, i) => p.latin === shuffledLeft[i].latin) && tries < 5) {
      s = shuffleArray(pairs);
      tries++;
    }
    if (s.every((p, i) => p.latin === shuffledLeft[i].latin)) {
      s = [...s.slice(1), s[0]];
    }
    return s;
  }, [sigKey, shuffledLeft]); // eslint-disable-line react-hooks/exhaustive-deps

  const leftNumber  = (latin: string) => shuffledLeft.findIndex(p => p.latin === latin) + 1;
  const rightNumber = (latin: string) => pairs.length + shuffledRight.findIndex(p => p.latin === latin) + 1;

  const pairColorFor = (latin: string) => {
    const idx = pairs.findIndex(p => p.latin === latin);
    return PAIR_COLORS[idx % PAIR_COLORS.length];
  };

  useEffect(() => {
    if (!selectedLeft || !selectedRight) return;
    if (selectedLeft === selectedRight) {
      setMatchedIds(prev => new Set(prev).add(selectedLeft));
      setSelectedLeft(null);
      setSelectedRight(null);
    } else {
      setWrongPair([selectedLeft, selectedRight]);
      setTimeout(() => {
        setWrongPair(null);
        setSelectedLeft(null);
        setSelectedRight(null);
      }, 800);
    }
  }, [selectedLeft, selectedRight]); // eslint-disable-line react-hooks/exhaustive-deps

  const allFound = matchedIds.size === pairs.length;

  useEffect(() => {
    if (pairs.length > 0) {
      onReadyChange?.(allFound);
    }
  }, [allFound, pairs.length]); // eslint-disable-line react-hooks/exhaustive-deps

  const getLeftState = (latin: string): CardState => {
    if (matchedIds.has(latin)) return 'matched';
    if (wrongPair?.[0] === latin) return 'error';
    if (selectedLeft === latin) return 'selected';
    return 'idle';
  };

  const getRightState = (latin: string): CardState => {
    if (matchedIds.has(latin)) return 'matched';
    if (wrongPair?.[1] === latin) return 'error';
    if (selectedRight === latin) return 'selected';
    if (!selectedLeft) return 'disabled';
    return 'idle';
  };

  return (
    <div className="animate-fade-up" style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      width: "100%",
      maxWidth: 800,
      margin: "0 auto",
    }}>
      <div style={{ marginBottom: 20, textAlign: "center" }}>
        <p
          style={{
            fontSize: 13,
            fontWeight: 800,
            color: MC.gold,
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
            margin: 0,
          }}
        >
          {prompt ?? 'Trouve les paires'}
        </p>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            background: allFound ? `${MC.green}22` : `${MC.gold}15`,
            border: `1px solid ${allFound ? MC.green : MC.gold}55`,
            borderRadius: 20,
            padding: "4px 14px",
            marginTop: 10,
            transition: 'all 0.2s',
          }}
        >
          <span style={{ fontSize: 18, fontWeight: 900, color: allFound ? MC.green : MC.gold }}>
            {matchedIds.size}
          </span>
          <span style={{ fontSize: 13, color: MC.sub, fontWeight: 600 }}>
            / {pairs.length} trouvées
          </span>
        </div>
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 20,
        width: "100%",
        maxWidth: 640,
        padding: "0 20px",
      }}>
        {/* Gauche — voix seule (on entend, on associe, le texte reste caché) */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {shuffledLeft.map((p) => {
            const st = getLeftState(p.latin);
            const isMatched = st === 'matched';
            const isSelected = st === 'selected';
            const starState = stateToStar(st, allFound);
            const n = leftNumber(p.latin);
            const pc = isMatched ? pairColorFor(p.latin) : undefined;

            return (
              <button
                key={p.latin}
                disabled={isMatched || !!wrongPair}
                onClick={() => {
                  playLetter(p.letter);
                  setSelectedLeft(isSelected ? null : p.latin);
                }}
                className={st === 'error' ? "animate-shake-x" : ""}
                style={{
                  ...cardStyle(st, pc),
                  cursor: isMatched ? "default" : "pointer",
                }}
              >
                <StarBadge n={n} state={starState} pairColor={pc?.border} />
                <AudioChip active={isSelected} />
                {isMatched ? (
                  /* Révélation pédagogique : une fois la paire trouvée, on
                     montre enfin le texte arabe + latin de ce qu'on a entendu. */
                  <span style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 2,
                    lineHeight: 1,
                  }}>
                    <span style={{ fontFamily: '"Amiri", serif', fontSize: 22, color: '#ffffff' }}>
                      {p.letter}
                    </span>
                    <span style={{ fontSize: 11, fontWeight: 700, color: MC.sub, letterSpacing: '0.04em' }}>
                      {p.latin}
                    </span>
                  </span>
                ) : (
                  <span style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: 'center', gap: 3, height: 22 }}>
                    {[0, 1, 2, 3].map(i => (
                      <span key={i} style={{
                        display: "block",
                        width: 3,
                        borderRadius: 2,
                        background: isSelected ? MC.gold : MC.blue,
                        height: "100%",
                        animation: `waveBar 0.8s ease-in-out ${i * 0.15}s infinite`,
                      }} />
                    ))}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Droite — texte (français en mode mot, latin+fr en mode lettre) */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {shuffledRight.map((s_) => {
            const st = getRightState(s_.latin);
            const isMatched = st === 'matched';
            const locked = st === 'disabled';
            const starState = stateToStar(st, allFound);
            const n = rightNumber(s_.latin);
            const pc = isMatched ? pairColorFor(s_.latin) : undefined;

            return (
              <button
                key={s_.latin}
                disabled={isMatched || !!wrongPair || !selectedLeft}
                onClick={() => setSelectedRight(st === 'selected' ? null : s_.latin)}
                className={st === 'error' ? "animate-shake-x" : ""}
                style={{
                  ...cardStyle(st, pc),
                  cursor: (isMatched || locked) ? "default" : "pointer",
                }}
              >
                <StarBadge n={n} state={starState} pairColor={pc?.border} />
                {mode === 'mot' ? (
                  <span style={{
                    flex: 1,
                    textAlign: 'center',
                    fontSize: 15,
                    fontWeight: 800,
                    color: '#ffffff',
                    lineHeight: 1.3,
                    padding: '0 4px',
                  }}>
                    {s_.fr}
                  </span>
                ) : (
                  <span style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 2,
                    lineHeight: 1,
                  }}>
                    <span style={{ fontSize: 20, fontWeight: 900, color: '#ffffff' }}>{s_.latin}</span>
                    <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', color: MC.sub, letterSpacing: '0.04em' }}>
                      {s_.fr}
                    </span>
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
