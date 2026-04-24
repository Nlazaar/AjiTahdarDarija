'use client';

import React, { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Unite, NodeStatus, Lecon, Revision } from '@/hooks/useParcours';
import UnitBanner from './UnitBanner';

type PathNode =
  | { kind: 'lesson'; data: Lecon }
  | { kind: 'revision'; data: Revision }
  | { kind: 'trophy'; unlocked: boolean };

function weaveNodes(lecons: Lecon[], revisions: Revision[]): PathNode[] {
  const mid = revisions.find((r) => r.position === 'MIDDLE');
  const end = revisions.find((r) => r.position === 'END');
  const n = lecons.length;
  const clampAnchor = (a: number | null, fallback: number) => {
    const v = a ?? fallback;
    return Math.max(0, Math.min(n, v));
  };
  const midAnchor = mid ? clampAnchor(mid.anchorAfterOrder, Math.floor(n / 2)) : -1;
  const endAnchor = end ? clampAnchor(end.anchorAfterOrder, n) : -1;

  const out: PathNode[] = [];
  if (mid && midAnchor === 0) out.push({ kind: 'revision', data: mid });
  if (end && endAnchor === 0 && midAnchor !== 0) out.push({ kind: 'revision', data: end });
  lecons.forEach((l, i) => {
    out.push({ kind: 'lesson', data: l });
    const after = i + 1;
    if (mid && midAnchor === after) out.push({ kind: 'revision', data: mid });
    if (end && endAnchor === after) out.push({ kind: 'revision', data: end });
  });
  return out;
}

const SVG_WIDTH = 280;
const PATTERN_HEIGHT = 540;
const LOCKED_TRAIL = '#3a3628';

type Point = { x: number; y: number };

const PATTERN_NODES: readonly Point[] = [
  { x: 70,  y: 30  },
  { x: 215, y: 110 },
  { x: 60,  y: 215 },
  { x: 212, y: 310 },
  { x: 62,  y: 395 },
  { x: 210, y: 488 },
];

const PATTERN_START: Point = { x: 70, y: 30 };
const PATTERN_CURVES: Array<{ cp1: Point; cp2: Point; end: Point }> = [
  { cp1: { x: 85,  y: 60 },  cp2: { x: 205, y: 55 },  end: { x: 215, y: 110 } },
  { cp1: { x: 223, y: 160 }, cp2: { x: 65,  y: 170 }, end: { x: 60,  y: 215 } },
  { cp1: { x: 57,  y: 260 }, cp2: { x: 220, y: 255 }, end: { x: 212, y: 310 } },
  { cp1: { x: 208, y: 355 }, cp2: { x: 70,  y: 350 }, end: { x: 62,  y: 395 } },
  { cp1: { x: 55,  y: 440 }, cp2: { x: 220, y: 438 }, end: { x: 210, y: 488 } },
];


function mx(x: number, mirror: boolean): number {
  return mirror ? SVG_WIDTH - x : x;
}

function buildFullPathD(numSegments: number): string {
  let d = '';
  for (let s = 0; s < numSegments; s++) {
    const mirror = s % 2 === 1;
    const yOff = s * PATTERN_HEIGHT;
    if (s === 0) {
      d += `M ${mx(PATTERN_START.x, mirror)} ${PATTERN_START.y + yOff}`;
    } else {
      // Raccord entre segments : ligne droite du dernier point du segment précédent
      // (x = 210 non-miroité => 70 miroité) vers le nouveau départ.
      d += ` L ${mx(PATTERN_START.x, mirror)} ${PATTERN_START.y + yOff}`;
    }
    for (const c of PATTERN_CURVES) {
      d += ` C ${mx(c.cp1.x, mirror)} ${c.cp1.y + yOff}, ${mx(c.cp2.x, mirror)} ${c.cp2.y + yOff}, ${mx(c.end.x, mirror)} ${c.end.y + yOff}`;
    }
  }
  return d;
}

function getSlotPos(slot: number): Point {
  const segIdx = Math.floor(slot / 6);
  const localIdx = slot % 6;
  const local = PATTERN_NODES[localIdx] ?? PATTERN_NODES[0]!;
  const mirror = segIdx % 2 === 1;
  return {
    x: mirror ? SVG_WIDTH - local.x : local.x,
    y: local.y + segIdx * PATTERN_HEIGHT,
  };
}

function nodeStatus(n: PathNode): NodeStatus {
  if (n.kind === 'lesson') return n.data.status;
  if (n.kind === 'revision') return n.data.status;
  return n.unlocked ? 'completed' : 'locked';
}

export default function CalligraphyPath({ unite }: { unite: Unite }) {
  const router = useRouter();
  const fgPathRef = useRef<SVGPathElement | null>(null);

  const nodes = useMemo<PathNode[]>(() => {
    return weaveNodes(unite.lecons, unite.revisions);
  }, [unite.lecons, unite.revisions]);

  const numSegments = Math.max(1, Math.ceil(nodes.length / 6));
  const fullPathD = useMemo(() => buildFullPathD(numSegments), [numSegments]);
  const svgHeight = numSegments * PATTERN_HEIGHT;

  const [totalLength, setTotalLength] = useState(0);
  const [progressLength, setProgressLength] = useState(0);

  useLayoutEffect(() => {
    const el = fgPathRef.current;
    if (!el) return;
    const total = el.getTotalLength();
    setTotalLength(total);

    let lastActive = -1;
    for (let i = 0; i < nodes.length; i++) {
      const s = nodeStatus(nodes[i]!);
      if (s === 'completed' || s === 'current') lastActive = i;
    }
    if (lastActive < 0) { setProgressLength(0); return; }

    const target = getSlotPos(lastActive);
    let bestDist = Infinity;
    let bestLen = 0;
    const STEP = 4;
    for (let len = 0; len <= total; len += STEP) {
      const pt = el.getPointAtLength(len);
      const d = Math.hypot(pt.x - target.x, pt.y - target.y);
      if (d < bestDist) { bestDist = d; bestLen = len; }
    }
    setProgressLength(bestLen);
  }, [fullPathD, nodes]);

  const handleLeconClick = (leconId: string, status: NodeStatus) => {
    if (status === 'locked') return;
    router.push(`/lesson/${leconId}`);
  };
  const handleRevisionClick = (revId: string, status: NodeStatus) => {
    if (status === 'locked') return;
    router.push(`/revision/${revId}`);
  };
  const handleHeaderClick = () => {
    if (!unite.unlocked) return;
    const next = unite.lecons.find((l) => l.status !== 'completed') ?? unite.lecons[0];
    if (next?.id) router.push(`/lesson/${next.id}`);
  };

  const isCurrentUnit = unite.unlocked && !unite.completed;
  const primary = unite.colorA;
  const deep = unite.shadow;

  return (
    <section style={{ margin: '24px auto 0', maxWidth: 460, width: '100%' }}>
      <UnitBanner unite={unite} isCurrentUnit={isCurrentUnit} onContinue={handleHeaderClick} />

      <div style={{ position: 'relative', padding: '4px 12px 8px' }}>
        <style>{`
          @keyframes calligraphy-halo-pulse {
            0%, 100% { transform: scale(1); opacity: 0.55; }
            50%      { transform: scale(1.35); opacity: 0.08; }
          }
          @media (prefers-reduced-motion: reduce) {
            .calligraphy-halo { animation: none !important; opacity: 0.3 !important; }
            .calligraphy-fg   { transition: none !important; }
          }
        `}</style>

        <svg
          viewBox={`0 0 ${SVG_WIDTH} ${svgHeight}`}
          preserveAspectRatio="xMidYMin meet"
          width="100%"
          height={svgHeight}
          style={{ display: 'block', overflow: 'visible' }}
        >
          {/* 1. Trait de fond (sable verrouillé) */}
          <path
            d={fullPathD}
            stroke={LOCKED_TRAIL}
            strokeWidth={8}
            strokeLinecap="round"
            fill="none"
          />

          {/* 2. Trait calame (couleur de section, longueur dynamique) */}
          <path
            ref={fgPathRef}
            className="calligraphy-fg"
            d={fullPathD}
            stroke={primary}
            strokeWidth={8}
            strokeLinecap="round"
            fill="none"
            strokeDasharray={totalLength || undefined}
            strokeDashoffset={totalLength ? totalLength - progressLength : undefined}
            style={{ transition: 'stroke-dashoffset 800ms cubic-bezier(0.4, 0, 0.2, 1)' }}
          />

          {/* 3. Nœuds + labels */}
          {nodes.map((n, i) => {
            const pos = getSlotPos(i);
            const status = nodeStatus(n);
            const isLeft = pos.x < SVG_WIDTH / 2;
            const labelX = isLeft ? pos.x + 32 : pos.x - 32;
            const anchor = isLeft ? 'start' : 'end';

            if (n.kind === 'trophy') {
              return (
                <g key={`trophy-${i}`} transform={`translate(${pos.x} ${pos.y})`}>
                  <circle r={22} fill={n.unlocked ? primary : '#1c2236'} stroke={n.unlocked ? deep : LOCKED_TRAIL} strokeWidth={3} strokeDasharray={n.unlocked ? undefined : '4 3'} />
                  <text x={0} y={1} textAnchor="middle" dominantBaseline="central" fontSize={18}>
                    {n.unlocked ? '🏆' : '🔒'}
                  </text>
                </g>
              );
            }

            const clickable = status !== 'locked';
            const onClick = () => {
              if (n.kind === 'lesson') handleLeconClick(n.data.id, status);
              else handleRevisionClick(n.data.id, status);
            };

            const title = n.kind === 'lesson'
              ? n.data.title
              : (n.data.title ?? (n.data.position === 'MIDDLE' ? 'Pause — Révision' : 'Révision finale'));
            const orderLabel = n.kind === 'lesson'
              ? `leçon ${String(unite.lecons.findIndex((l) => l.id === n.data.id) + 1).padStart(2, '0')}`
              : (n.data.position === 'MIDDLE' ? 'révision · milieu' : 'révision · fin');

            return (
              <g key={`${n.kind}-${n.data.id}`}>
                <g
                  transform={`translate(${pos.x} ${pos.y})`}
                  onClick={clickable ? onClick : undefined}
                  role={clickable ? 'button' : undefined}
                  aria-label={`${title} — ${status === 'completed' ? 'terminée' : status === 'current' ? 'en cours' : 'verrouillée'}`}
                  aria-disabled={status === 'locked' ? true : undefined}
                  tabIndex={clickable ? 0 : -1}
                  style={{ cursor: clickable ? 'pointer' : 'default', outline: 'none' }}
                >
                  {status === 'current' && (
                    <circle
                      className="calligraphy-halo"
                      r={28}
                      fill={primary}
                      style={{
                        transformOrigin: 'center',
                        animation: 'calligraphy-halo-pulse 2.2s ease-in-out infinite',
                      }}
                      opacity={0.25}
                    />
                  )}

                  {status === 'locked' ? (
                    <>
                      <circle r={18} fill="#1c2236" stroke={LOCKED_TRAIL} strokeWidth={3} strokeDasharray="4 3" />
                      <g stroke="#6b6050" strokeWidth={1.8} strokeLinecap="round" fill="none">
                        <rect x={-5} y={-1} width={10} height={8} rx={1.5} fill="#6b6050" stroke="none" />
                        <path d="M -3 -1 L -3 -4 Q -3 -7 0 -7 Q 3 -7 3 -4 L 3 -1" />
                      </g>
                    </>
                  ) : status === 'current' ? (
                    <>
                      <circle r={24} fill={primary} stroke="#f5e8d0" strokeWidth={3} />
                      {n.kind === 'revision' ? (
                        <text x={0} y={1} textAnchor="middle" dominantBaseline="central" fontSize={16} fill="#f5e8d0">💬</text>
                      ) : (
                        <text x={0} y={1} textAnchor="middle" dominantBaseline="central" fontSize={15} fill="#f5e8d0">📖</text>
                      )}
                    </>
                  ) : (
                    <>
                      <circle r={18} fill={primary} stroke={deep} strokeWidth={3} />
                      <path
                        d="M -8 0 L -2 6 L 8 -6"
                        stroke="#f5e8d0"
                        strokeWidth={2.5}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        fill="none"
                      />
                    </>
                  )}
                </g>

                <text
                  x={labelX}
                  y={pos.y - 4}
                  textAnchor={anchor}
                  fontSize={status === 'current' ? 13 : 12}
                  fontWeight={status === 'current' ? 800 : 700}
                  fill={status === 'locked' ? '#6b6050' : '#f5e8d0'}
                  style={{ pointerEvents: 'none' }}
                >
                  {title}
                </text>
                <text
                  x={labelX}
                  y={pos.y + 12}
                  textAnchor={anchor}
                  fontSize={9}
                  fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
                  fill={status === 'current' ? primary : status === 'locked' ? '#55503f' : '#8b7c6a'}
                  style={{ letterSpacing: '0.1em', textTransform: 'uppercase', pointerEvents: 'none' }}
                >
                  {status === 'current' ? `● en cours · ${orderLabel}` : orderLabel}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </section>
  );
}
