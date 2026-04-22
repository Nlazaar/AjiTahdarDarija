"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { useAudioCtx } from '@/contexts/AudioContext';

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

/**
 * Couleurs "terre du Maroc" utilisées pour différencier chaque paire matchée.
 * Teintes naturelles inspirées du zellige, henné, argan, indigo, safran, terracotta.
 * Chaque paire a un bg sombre assorti pour la carte.
 */
const PAIR_COLORS: { border: string; bg: string }[] = [
  { border: "#006233", bg: "#0d2219" }, // vert drapeau
  { border: "#c17450", bg: "#2a1a12" }, // terracotta / argile
  { border: "#1e4d8c", bg: "#0f1c30" }, // bleu Majorelle
  { border: "#b38a3f", bg: "#24200a" }, // or henné
  { border: "#7a4e6f", bg: "#201422" }, // aubergine
  { border: "#2a8274", bg: "#0f2220" }, // sarcelle / thé à la menthe
];

interface AssocierLettresProps {
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

function adaptiveFontSize(pairs: { letter: string }[]): number {
  const max = Math.max(...pairs.map(p => p.letter.length));
  if (max <= 3)  return 36;
  if (max <= 6)  return 26;
  if (max <= 10) return 20;
  return 16;
}

type CardState = 'idle' | 'selected' | 'matched' | 'error';
type StarState = 'idle' | 'selected' | 'correct' | 'wrong' | 'muted';

/** Badge zellige numéroté — même motif que le filigrane carte.
 *  Quand `pairColor` est passé en état "correct", on l'utilise pour remplir
 *  le badge — chaque paire a sa propre teinte. */
function StarBadge({ n, state, size = 28, pairColor }: { n: number; state: StarState; size?: number; pairColor?: string }) {
  const colors: Record<StarState, { fill: string; fillOp: number; text: string }> = {
    idle:     { fill: MC.gold,                 fillOp: 0.22, text: MC.gold   },
    selected: { fill: MC.gold,                 fillOp: 0.85, text: "#ffffff" },
    correct:  { fill: pairColor ?? MC.green,   fillOp: 1,    text: "#ffffff" },
    wrong:    { fill: MC.red,                  fillOp: 1,    text: "#ffffff" },
    muted:    { fill: MC.gold,                 fillOp: 0.08, text: "#4a5d6a" },
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
  return anyMatched ? 'muted' : 'idle';
}

function cardStyle(state: CardState, pairColor?: { border: string; bg: string }): React.CSSProperties {
  const base: React.CSSProperties = {
    width: '100%',
    minHeight: 88,
    display: 'flex',
    alignItems: 'center',
    borderStyle: 'solid',
    borderWidth: 2,
    borderRadius: 20,
    transition: 'all 0.15s',
    background: MC.card,
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
    default:
      // Idle : bordure or en transparence (55 = ~33% alpha) — cohérent
      // avec la carte lettre principale de ChoixLettre/EntendreEtChoisir.
      return {
        ...base,
        borderColor: `${MC.gold}55`,
        boxShadow: `0 4px 0 #1a2830`,
      };
  }
}

/** Petit haut-parleur Majorelle pour les cartes audio à gauche. */
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

export default function AssocierLettres({ pairs, onConfirm, onReadyChange, mode = 'lettre', prompt }: AssocierLettresProps) {
  const isVocab = mode === 'mot';
  const arabicFontSize = adaptiveFontSize(pairs);
  const { speak } = useAudioCtx();
  const [matchedIds, setMatchedIds] = useState<Set<string>>(new Set());
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [selectedRight, setSelectedRight] = useState<string | null>(null);
  const [errorPair, setErrorPair] = useState<[string, string] | null>(null);

  const sigKey = pairs.map(p => p.latin).join('|');

  // Fisher-Yates — uniforme, contrairement à `sort(() => Math.random()-0.5)`
  // qui est biaisé et peut souvent retomber sur l'ordre d'origine pour N petit.
  const shuffleArray = <T,>(arr: T[]): T[] => {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };

  // Colonne GAUCHE aussi mélangée (avant : toujours dans l'ordre de `pairs`).
  const shuffledLeft = useMemo(() => shuffleArray(pairs), [sigKey]); // eslint-disable-line react-hooks/exhaustive-deps

  // Colonne DROITE : on s'assure qu'elle diffère de la gauche, sinon
  // l'exo devient trivial (chaque ligne = une paire alignée).
  const shuffledSounds = useMemo(() => {
    if (pairs.length <= 1) return [...pairs];
    let s = shuffleArray(pairs);
    let tries = 0;
    while (s.every((p, i) => p.latin === shuffledLeft[i].latin) && tries < 5) {
      s = shuffleArray(pairs);
      tries++;
    }
    // Fallback : rotation simple si la chance a été très mauvaise
    if (s.every((p, i) => p.latin === shuffledLeft[i].latin)) {
      s = [...s.slice(1), s[0]];
    }
    return s;
  }, [sigKey, shuffledLeft]); // eslint-disable-line react-hooks/exhaustive-deps

  // Numérotation continue basée sur la POSITION AFFICHÉE (pas l'ordre logique
  // de `pairs`), pour que le user voie vraiment "1 avec 6" etc.
  const leftNumber = (latin: string) => shuffledLeft.findIndex(p => p.latin === latin) + 1;
  const rightNumber = (latin: string) => pairs.length + shuffledSounds.findIndex(p => p.latin === latin) + 1;

  // Couleur de la paire — indexée sur la position dans `pairs` (la source
  // de vérité de l'ordre), pour que gauche et droite de la MÊME paire
  // aient la même teinte quand elles sont matchées.
  const pairColorFor = (latin: string) => {
    const idx = pairs.findIndex(p => p.latin === latin);
    return PAIR_COLORS[idx % PAIR_COLORS.length];
  };

  const handleSelect = (id: string, side: 'left' | 'right') => {
    if (matchedIds.has(id)) return;

    if (side === 'left') {
      const pair = pairs.find(p => p.latin === id);
      if (pair) speak(pair.letter, 'ar-MA');
      setSelectedLeft(id === selectedLeft ? null : id);
    } else {
      setSelectedRight(id === selectedRight ? null : id);
    }
  };

  useEffect(() => {
    if (selectedLeft && selectedRight) {
      if (selectedLeft === selectedRight) {
        setMatchedIds(prev => new Set(prev).add(selectedLeft));
        setSelectedLeft(null);
        setSelectedRight(null);
      } else {
        setErrorPair([selectedLeft, selectedRight]);
        setTimeout(() => {
          setErrorPair(null);
          setSelectedLeft(null);
          setSelectedRight(null);
        }, 800);
      }
    }
  }, [selectedLeft, selectedRight]);

  useEffect(() => {
    if (pairs.length > 0) {
      onReadyChange?.(matchedIds.size === pairs.length);
    }
  }, [matchedIds.size, pairs.length]); // eslint-disable-line react-hooks/exhaustive-deps

  const getLeftState = (p: { latin: string }): CardState => {
    if (matchedIds.has(p.latin)) return 'matched';
    if (errorPair?.[0] === p.latin) return 'error';
    if (selectedLeft === p.latin) return 'selected';
    return 'idle';
  };

  const getRightState = (s: { latin: string }): CardState => {
    if (matchedIds.has(s.latin)) return 'matched';
    if (errorPair?.[1] === s.latin) return 'error';
    if (selectedRight === s.latin) return 'selected';
    return 'idle';
  };

  const allDone = matchedIds.size === pairs.length;

  return (
    <div className="animate-fade-up" style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      width: '100%',
      maxWidth: 800,
      margin: '0 auto',
    }}>
      <div style={{ marginBottom: 20, textAlign: 'center' }}>
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
          {prompt ?? (isVocab ? 'Quelle est la signification de ce mot ?' : 'Associe chaque lettre à son son')}
        </p>

        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            background: allDone ? `${MC.green}22` : `${MC.gold}15`,
            border: `1px solid ${allDone ? MC.green : MC.gold}55`,
            borderRadius: 20,
            padding: '4px 14px',
            marginTop: 10,
            transition: 'all 0.2s',
          }}
        >
          <span style={{ fontSize: 18, fontWeight: 900, color: allDone ? MC.green : MC.gold }}>
            {matchedIds.size}
          </span>
          <span style={{ fontSize: 13, color: MC.sub, fontWeight: 600 }}>
            / {pairs.length} associées
          </span>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 20,
        width: '100%',
        maxWidth: 640,
        padding: '0 20px',
      }}>
        {/* Colonne gauche — audio + texte arabe + latin (comme "signification ?") */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {shuffledLeft.map((p) => {
            const st = getLeftState(p);
            const isMatched = st === 'matched';
            const starState = stateToStar(st, allDone);
            const n = leftNumber(p.latin);
            const pc = isMatched ? pairColorFor(p.latin) : undefined;

            return (
              <button
                key={p.latin}
                onClick={() => handleSelect(p.latin, 'left')}
                disabled={isMatched || (!!selectedLeft && !!selectedRight)}
                className={st === 'error' ? "animate-shake-x" : ""}
                style={{
                  ...cardStyle(st, pc),
                  cursor: isMatched ? 'default' : 'pointer',
                }}
              >
                <StarBadge n={n} state={starState} pairColor={pc?.border} />
                <AudioChip active={st === 'selected'} />
                <span style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 2,
                  lineHeight: 1,
                }}>
                  <span style={{
                    fontFamily: '"Amiri", serif',
                    fontSize: arabicFontSize,
                    color: '#ffffff',
                  }}>
                    {p.letter}
                  </span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: MC.sub, letterSpacing: '0.04em' }}>
                    {p.latin}
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        {/* Colonne droite — traductions françaises */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {shuffledSounds.map((s) => {
            const st = getRightState(s);
            const isMatched = st === 'matched';
            const starState = stateToStar(st, allDone);
            const n = rightNumber(s.latin);
            const pc = isMatched ? pairColorFor(s.latin) : undefined;

            return (
              <button
                key={s.latin}
                onClick={() => handleSelect(s.latin, 'right')}
                disabled={isMatched || (!!selectedLeft && !!selectedRight)}
                className={st === 'error' ? "animate-shake-x" : ""}
                style={{
                  ...cardStyle(st, pc),
                  cursor: isMatched ? 'default' : 'pointer',
                  justifyContent: 'flex-start',
                }}
              >
                <StarBadge n={n} state={starState} pairColor={pc?.border} />
                {isVocab ? (
                  <span style={{
                    flex: 1,
                    textAlign: 'center',
                    fontSize: 15,
                    fontWeight: 800,
                    color: '#ffffff',
                    lineHeight: 1.3,
                    padding: '0 4px',
                  }}>
                    {s.fr}
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
                    <span style={{ fontSize: 20, fontWeight: 900, color: '#ffffff' }}>{s.latin}</span>
                    <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', color: MC.sub, letterSpacing: '0.04em' }}>
                      {s.fr}
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
