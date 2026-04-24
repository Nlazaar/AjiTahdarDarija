'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useCurrentPostcard } from '@/hooks/useCurrentPostcard';
import type { NodeStatus } from '@/hooks/useParcours';
import MapMaroc from '@/components/MapMaroc';

const CELEBRATED_KEY = 'postcardCelebrated';

function wasCelebrated(uniteId: string): boolean {
  try {
    const raw = sessionStorage.getItem(CELEBRATED_KEY);
    if (!raw) return false;
    return (JSON.parse(raw) as string[]).includes(uniteId);
  } catch { return false; }
}

function markCelebrated(uniteId: string) {
  try {
    const raw = sessionStorage.getItem(CELEBRATED_KEY);
    const arr: string[] = raw ? JSON.parse(raw) : [];
    if (!arr.includes(uniteId)) {
      arr.push(uniteId);
      sessionStorage.setItem(CELEBRATED_KEY, JSON.stringify(arr));
    }
  } catch { /* noop */ }
}

// ── Constantes visuelles ────────────────────────────────────────────────────
const PANEL_WIDTH = 400;
const CARD_RADIUS = 14;

// ── États de leçon → style pastille ─────────────────────────────────────────
function lessonDotStyle(status: NodeStatus): React.CSSProperties {
  switch (status) {
    case 'completed':
      return { background: '#58cc02', color: '#ffffff' };
    case 'current':
      return { background: '#f59e0b', color: '#ffffff' };
    default:
      return { background: 'var(--c-border-hard)', color: 'var(--c-sub)' };
  }
}

export default function CartePostalePanel() {
  const postcard = useCurrentPostcard();
  const [celebrating, setCelebrating] = useState(false);
  const prevAllCompletedRef = useRef<{ id: string; allCompleted: boolean } | null>(null);

  useEffect(() => {
    if (!postcard) { prevAllCompletedRef.current = null; return; }
    const prev = prevAllCompletedRef.current;
    const current = { id: postcard.unite.id, allCompleted: postcard.allCompleted };
    // Transition false → true sur la même unité et pas encore célébrée cette session.
    if (
      prev &&
      prev.id === current.id &&
      !prev.allCompleted &&
      current.allCompleted &&
      !wasCelebrated(current.id)
    ) {
      markCelebrated(current.id);
      setCelebrating(true);
      const t = window.setTimeout(() => setCelebrating(false), 3200);
      prevAllCompletedRef.current = current;
      return () => window.clearTimeout(t);
    }
    prevAllCompletedRef.current = current;
  }, [postcard]);

  if (!postcard) return null;

  const { unite, total, completedCount, completionPercent, allCompleted, lecons } = postcard;

  // Puzzle zellige : grille de pièces qui se dévoilent au fur et à mesure des
  // leçons complétées. 1 pièce = 1 leçon (plus un peu de remplissage pour
  // rester rectangulaire). Les pièces en trop se révèlent à 100 %.
  const puzzleAspect = 16 / 9;
  const puzzleCols = Math.max(2, Math.round(Math.sqrt(Math.max(total, 1) * puzzleAspect)));
  const puzzleRows = Math.max(2, Math.ceil(Math.max(total, 1) / puzzleCols));
  const puzzleTotal = puzzleCols * puzzleRows;

  // Emoji principal de la carte (dérivé de la description ou fallback).
  const emoji = unite.description?.photoEmoji || unite.hadith?.emoji || '🏛️';
  // Priorité : postcardUrl (dédiée carte postale) → photoUrl (bandeau section, fallback)
  const photoUrl = unite.description?.postcardUrl || unite.description?.photoUrl;

  // Hint dynamique.
  let hintMessage = '';
  let hintColor = 'var(--c-sub)';
  let hintBg = 'var(--c-card2)';
  if (allCompleted) {
    hintMessage = '✓ Carte postale débloquée !';
    hintColor = '#58cc02';
    hintBg = 'rgba(88, 204, 2, 0.1)';
  } else if (completedCount === 0) {
    hintMessage = `Termine tes leçons pour révéler ${unite.title}.`;
    hintColor = unite.colorA;
    hintBg = `${unite.colorA}1a`;
  }

  return (
    <aside
      className="hidden xl:flex"
      style={{
        position: 'fixed',
        top: 0,
        left: 260,
        width: PANEL_WIDTH,
        height: '100vh',
        padding: '80px 1rem 1.5rem',
        flexDirection: 'column',
        gap: 14,
        backgroundColor: 'var(--c-bg)',
        overflowY: 'auto',
        zIndex: 90,
      }}
    >
      {/* ── Header ── */}
      <div
        style={{
          background: 'var(--c-card)',
          border: '1.5px solid var(--c-border)',
          borderRadius: 18,
          padding: '10px 14px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        }}
      >
        <span
          style={{
            fontSize: 13,
            fontWeight: 900,
            color: 'var(--c-text)',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <span style={{ fontSize: 22, lineHeight: 1 }}>📮</span>
          Ma carte postale
        </span>
      </div>

      {/* ── Titre ville ── */}
      <div style={{ display: 'flex', alignItems: 'baseline', flexWrap: 'wrap', gap: 8 }}>
        <h3
          style={{
            fontSize: 15,
            fontWeight: 900,
            color: 'var(--c-text)',
            margin: 0,
            lineHeight: 1.2,
          }}
        >
          {unite.title}
        </h3>
        {unite.titleAr && (
          <span
            style={{
              fontSize: 15,
              fontWeight: 900,
              color: unite.colorA,
              fontFamily: 'var(--font-amiri), serif',
              direction: 'rtl',
              lineHeight: 1.2,
            }}
          >
            {unite.titleAr}
          </span>
        )}
      </div>

      {/* ── Image de la carte ── */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '16 / 9',
          flexShrink: 0,
          borderRadius: CARD_RADIUS,
          overflow: 'hidden',
          border: `2px solid ${allCompleted ? '#58cc02' : 'rgba(255,255,255,0.15)'}`,
          boxShadow: allCompleted
            ? '0 0 24px rgba(88, 204, 2, 0.35)'
            : '0 4px 14px rgba(0,0,0,0.25)',
          background: `linear-gradient(135deg, ${unite.colorA} 0%, ${unite.colorB} 100%)`,
          transition: 'all 0.4s ease',
        }}
        aria-label={`Carte postale de ${unite.title}`}
      >
        {/* Contenu de la carte (sous le voile) */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            padding: 12,
          }}
        >
          {photoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={photoUrl}
              alt={unite.title}
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          ) : (
            <div style={{ fontSize: 64, lineHeight: 1, filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.3))' }}>
              {emoji}
            </div>
          )}
          {!photoUrl && unite.titleAr && (
            <div
              style={{
                fontSize: 20,
                fontWeight: 900,
                color: '#fff',
                fontFamily: 'var(--font-amiri), serif',
                direction: 'rtl',
                textShadow: '0 2px 6px rgba(0,0,0,0.4)',
              }}
            >
              {unite.titleAr}
            </div>
          )}
        </div>

        {/* Timbre "POSTE MAROC" */}
        <div
          style={{
            position: 'absolute',
            top: 8,
            right: 8,
            background: '#fff',
            color: '#c1272d',
            fontSize: 7,
            fontWeight: 900,
            lineHeight: 1.1,
            padding: '3px 5px',
            borderRadius: 3,
            border: '1px dashed #c1272d',
            transform: 'rotate(6deg)',
            letterSpacing: '0.05em',
            textAlign: 'center',
          }}
        >
          POSTE
          <br />
          MAROC
        </div>

        {/* Célébration : shine + étincelles quand 100 % atteint pour la première fois */}
        {celebrating && (
          <div
            aria-hidden
            style={{
              position: 'absolute',
              inset: 0,
              pointerEvents: 'none',
              overflow: 'hidden',
              borderRadius: CARD_RADIUS,
            }}
          >
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(115deg, transparent 30%, rgba(255,255,255,0.85) 50%, transparent 70%)',
                transform: 'translateX(-120%)',
                animation: 'postcardShine 1.6s ease-out 1 forwards',
              }}
            />
            <div style={{ position: 'absolute', inset: 0 }}>
              {['20%', '70%', '45%', '85%', '15%'].map((left, i) => (
                <span
                  key={i}
                  style={{
                    position: 'absolute',
                    left,
                    top: `${20 + i * 14}%`,
                    fontSize: 18 + (i % 2) * 6,
                    animation: `postcardSparkle 1.4s ease-out ${i * 0.15}s 1 forwards`,
                    opacity: 0,
                  }}
                >
                  ✨
                </span>
              ))}
            </div>
            <div
              style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
                background: '#58cc02',
                color: '#fff',
                fontSize: 11,
                fontWeight: 900,
                letterSpacing: '0.06em',
                padding: '6px 12px',
                borderRadius: 999,
                border: '2px solid #fff',
                boxShadow: '0 4px 14px rgba(0,0,0,0.3)',
                animation: 'postcardPop 2.8s ease-out 0.3s 1 forwards',
                opacity: 0,
              }}
            >
              🎉 CARTE POSTALE DÉBLOQUÉE
            </div>
          </div>
        )}

        {/* LE VOILE — grille puzzle zellige, chaque leçon dévoile une tuile */}
        {completionPercent < 100 && (
          <div
            aria-hidden
            style={{
              position: 'absolute',
              inset: 0,
              display: 'grid',
              gridTemplateColumns: `repeat(${puzzleCols}, 1fr)`,
              gridTemplateRows: `repeat(${puzzleRows}, 1fr)`,
              pointerEvents: 'none',
            }}
          >
            {Array.from({ length: puzzleTotal }, (_, idx) => {
              const revealed = allCompleted || idx < completedCount;
              return (
                <div
                  key={idx}
                  style={{
                    position: 'relative',
                    background: revealed ? 'transparent' : 'rgba(19,31,36,0.92)',
                    backdropFilter: revealed ? 'none' : 'blur(6px)',
                    WebkitBackdropFilter: revealed ? 'none' : 'blur(6px)',
                    borderTop: revealed ? 'none' : '1px solid rgba(212,168,75,0.28)',
                    borderLeft: revealed ? 'none' : '1px solid rgba(212,168,75,0.28)',
                    opacity: revealed ? 0 : 1,
                    transition: 'opacity 500ms ease, backdrop-filter 500ms ease',
                  }}
                >
                  {!revealed && (
                    <span
                      style={{
                        position: 'absolute',
                        inset: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        opacity: 0.35,
                      }}
                    >
                      <svg width="14" height="14" viewBox="-5 -5 10 10">
                        <rect x={-3} y={-3} width={6} height={6} fill="none" stroke="#d4a84b" strokeWidth={0.5}/>
                        <rect x={-3} y={-3} width={6} height={6} fill="none" stroke="#d4a84b" strokeWidth={0.5} transform="rotate(45)"/>
                      </svg>
                    </span>
                  )}
                </div>
              );
            })}

            {/* Label centré quand aucune leçon complétée */}
            {completedCount === 0 && (
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                  pointerEvents: 'none',
                }}
              >
                <span style={{ fontSize: 28 }}>✉️</span>
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    color: 'var(--c-sub)',
                    textAlign: 'center',
                    padding: '0 16px',
                    lineHeight: 1.3,
                  }}
                >
                  Une carte postale de {unite.title} t'attend
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Bloc progression + leçons + hint ── */}
      <div
        style={{
          background: 'var(--c-card)',
          border: '1.5px solid var(--c-border)',
          borderRadius: 18,
          padding: '12px 14px',
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        }}
      >
        {/* Barre de progression */}
        <div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: 9,
              fontWeight: 900,
              color: 'var(--c-sub)',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              marginBottom: 4,
            }}
          >
            <span>Révélée</span>
            <span style={{ color: unite.colorA }}>{completionPercent}%</span>
          </div>
          <div
            style={{
              height: 6,
              background: 'var(--c-border-hard)',
              borderRadius: 999,
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: `${completionPercent}%`,
                height: '100%',
                background: `linear-gradient(90deg, ${unite.colorA}, ${unite.colorB})`,
                transition: 'width 0.6s ease',
              }}
            />
          </div>
        </div>

        {/* Ligne "métro" des leçons — stations reliées par un rail */}
        <div>
          <div
            style={{
              fontSize: 9,
              fontWeight: 900,
              color: 'var(--c-sub)',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              marginBottom: 8,
            }}
          >
            Leçons · {completedCount}/{total}
          </div>
          <div
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '4px 2px',
            }}
          >
            {/* Rail de fond (gris) */}
            <div
              aria-hidden
              style={{
                position: 'absolute',
                left: 6, right: 6,
                top: '50%',
                height: 2,
                background: 'var(--c-border-hard)',
                borderRadius: 999,
                transform: 'translateY(-50%)',
              }}
            />
            {/* Rail progression (vert) — largeur proportionnelle */}
            {total > 1 && (
              <div
                aria-hidden
                style={{
                  position: 'absolute',
                  left: 6,
                  width: `calc((100% - 12px) * ${Math.max(0, completedCount - 1) / (total - 1)})`,
                  top: '50%',
                  height: 2,
                  background: '#58cc02',
                  borderRadius: 999,
                  transform: 'translateY(-50%)',
                  transition: 'width 0.5s ease',
                }}
              />
            )}
            {/* Stations */}
            {lecons.map((l) => {
              const isCurrent = l.status === 'current';
              const isCompleted = l.status === 'completed';
              const size = isCurrent ? 12 : 9;
              const bg = isCompleted ? '#58cc02' : isCurrent ? '#f59e0b' : 'var(--c-card2)';
              const border = isCompleted ? '#58cc02' : isCurrent ? '#f59e0b' : 'var(--c-border-hard)';
              return (
                <div
                  key={l.id}
                  title={l.title}
                  style={{
                    position: 'relative',
                    zIndex: 1,
                    width: size,
                    height: size,
                    borderRadius: '50%',
                    background: bg,
                    border: `2px solid ${border}`,
                    boxShadow: isCurrent ? '0 0 0 3px rgba(245,158,11,0.25)' : undefined,
                    animation: isCurrent ? 'postcardDotPulse 1.4s ease-in-out infinite' : undefined,
                    flexShrink: 0,
                  }}
                />
              );
            })}
          </div>
        </div>

        {/* Hint dynamique — masqué pendant la progression */}
        {hintMessage && (
          <div
            style={{
              background: hintBg,
              borderLeft: `3px solid ${hintColor}`,
              borderRadius: 6,
              padding: '8px 10px',
              fontSize: 10,
              fontWeight: 700,
              lineHeight: 1.4,
              color: hintColor,
            }}
          >
            {hintMessage}
          </div>
        )}
      </div>

      {/* ── Carte du Maroc — parcours visité ── */}
      <div
        style={{
          marginTop: 4,
          padding: '10px 4px 4px',
          background: 'var(--c-card)',
          border: '1px solid var(--c-border)',
          borderRadius: CARD_RADIUS,
        }}
      >
        <MapMaroc />
      </div>

    </aside>
  );
}
