'use client';

import React, { useLayoutEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Unite, NodeStatus } from '@/hooks/useParcours';
import UnitBanner from './UnitBanner';
import { ZelligeNode, type NodeShape, type NodeStatus as ZStatus } from './ZelligeNode';

// Compact serpentin: 5 nodes max per visible row, 68px row height
const ROW_H = 68;
const NODE = 52;
const BIG_NODE = 60;

// Zigzag x offsets in % within a max-w-sm column
const ZIGZAG = [50, 62, 70, 62, 50, 38, 30, 38];

function mapStatus(s: NodeStatus): ZStatus {
  if (s === 'completed') return 'done';
  if (s === 'current')   return 'active';
  return 'locked';
}

function NodeStar({ status, icon, shape }: { status: NodeStatus; icon: string; size: number; shape: NodeShape }) {
  const z = mapStatus(status);
  return <ZelligeNode status={z} icon={icon} label="" size="md" shape={shape} interactive={false} />;
}

/**
 * Route de caravane : segments en pointillé épais reliant les nœuds, avec
 * une petite icône d'escale tous les 3 segments pour rythmer le voyage.
 * Icônes reflétant la diversité du Maroc : médina, kasbah, montagne (Atlas),
 * côte (Atlantique/Méditerranée), nature (argan/olivier).
 * Mesures dynamiques des centres de nœuds via refs.
 */
const STOP_ICONS = ['🕌', '🏰', '⛰️', '🌊', '🌳'];

function SerpentineTrail({
  nodeRefs,
  lecons,
  containerRef,
  trackColor,
}: {
  nodeRefs: React.MutableRefObject<Array<HTMLDivElement | null>>;
  lecons: Unite['lecons'];
  containerRef: React.RefObject<HTMLDivElement | null>;
  trackColor: string;
}) {
  const [centers, setCenters] = useState<{ x: number; y: number }[]>([]);
  const [dims, setDims] = useState<{ w: number; h: number }>({ w: 0, h: 0 });

  useLayoutEffect(() => {
    const measure = () => {
      const container = containerRef.current;
      if (!container) return;
      const cRect = container.getBoundingClientRect();
      const pts: { x: number; y: number }[] = [];
      for (const el of nodeRefs.current) {
        if (!el) { pts.push({ x: 0, y: 0 }); continue; }
        const r = el.getBoundingClientRect();
        pts.push({ x: r.left - cRect.left + r.width / 2, y: r.top - cRect.top + r.height / 2 });
      }
      setCenters(pts);
      setDims({ w: cRect.width, h: cRect.height });
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [lecons.length, containerRef, nodeRefs]);

  if (centers.length < 2 || dims.w === 0) return null;

  // Segments (pointillés) + escales (tous les 3 segments, au milieu)
  const segments: Array<{ i: number; x0: number; y0: number; x1: number; y1: number; status: NodeStatus | undefined }> = [];
  for (let i = 0; i < centers.length - 1; i++) {
    const from = centers[i];
    const to = centers[i + 1];
    if (!from || !to) continue;
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const len = Math.sqrt(dx * dx + dy * dy);
    if (len < 1) continue;
    const ux = dx / len;
    const uy = dy / len;
    const PAD = 28; // distance au centre du nœud
    segments.push({
      i,
      x0: from.x + ux * PAD,
      y0: from.y + uy * PAD,
      x1: to.x - ux * PAD,
      y1: to.y - uy * PAD,
      status: lecons[i]?.status,
    });
  }

  return (
    <svg
      aria-hidden
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0 }}
      viewBox={`0 0 ${dims.w} ${dims.h}`}
      preserveAspectRatio="none"
    >
      {/* Pistes pointillées */}
      {segments.map(seg => {
        const completed = seg.status === 'completed';
        const current   = seg.status === 'current';
        const stroke  = completed ? trackColor : current ? '#d4a84b' : '#4b5563';
        const dash    = completed ? '9 5' : current ? '8 5' : '3 6';
        const width   = completed ? 4 : current ? 4 : 2.6;
        const opacity = completed ? 1 : current ? 0.95 : 0.55;
        return (
          <line
            key={`seg-${seg.i}`}
            x1={seg.x0}
            y1={seg.y0}
            x2={seg.x1}
            y2={seg.y1}
            stroke={stroke}
            strokeWidth={width}
            strokeLinecap="round"
            strokeDasharray={dash}
            opacity={opacity}
            style={{ filter: current ? `drop-shadow(0 0 4px #d4a84baa)` : undefined }}
          />
        );
      })}

      {/* Escales : une tous les 3 segments au milieu, icône sur médaillon */}
      {segments.map(seg => {
        if (seg.i % 3 !== 1) return null;
        const cx = (seg.x0 + seg.x1) / 2;
        const cy = (seg.y0 + seg.y1) / 2;
        const icon = STOP_ICONS[seg.i % STOP_ICONS.length];
        const completed = seg.status === 'completed';
        const current   = seg.status === 'current';
        const ringColor = completed ? trackColor : current ? '#d4a84b' : '#4b5563';
        const ringOpacity = completed ? 0.9 : current ? 1 : 0.55;
        return (
          <g key={`stop-${seg.i}`} transform={`translate(${cx}, ${cy})`} opacity={ringOpacity}>
            <circle r={10} fill="#0f1720" stroke={ringColor} strokeWidth={1.4} />
            <text
              x={0}
              y={0}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize={11}
              style={{ filter: current ? 'drop-shadow(0 0 3px #d4a84baa)' : undefined }}
            >
              {icon}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export default function UnitePath({ unite, shape = 'star' }: { unite: Unite; shape?: NodeShape }) {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<Array<HTMLDivElement | null>>([]);

  const handleLeconClick = (leconId: string, status: NodeStatus) => {
    if (status === 'locked') return;
    router.push(`/lesson/${leconId}`);
  };

  const handleHeaderClick = () => {
    if (!unite.unlocked) return;
    const next = unite.lecons.find((l) => l.status !== 'completed') ?? unite.lecons[0];
    if (next?.id) router.push(`/lesson/${next.id}`);
  };

  const isCurrentUnit = unite.unlocked && !unite.completed;

  return (
    <section style={{ margin: '24px auto 0', maxWidth: 460, width: '100%' }}>
      <UnitBanner
        unite={unite}
        isCurrentUnit={isCurrentUnit}
        onContinue={handleHeaderClick}
      />

      {/* Serpentin */}
      <div ref={containerRef} style={{ position: 'relative', padding: '12px 16px 4px' }}>
        <SerpentineTrail
          nodeRefs={nodeRefs}
          lecons={unite.lecons}
          containerRef={containerRef}
          trackColor={unite.colorA}
        />
        {unite.lecons.map((lecon, idx) => {
          const x = ZIGZAG[idx % ZIGZAG.length];
          return (
            <div key={lecon.id} style={{ position: 'relative', zIndex: 1 }}>
              <div
                ref={(el) => { nodeRefs.current[idx] = el; }}
                style={{
                  marginLeft: `${x}%`,
                  transform: 'translateX(-50%)',
                  minHeight: ROW_H,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 10,
                }}
              >
                <button
                  onClick={() => handleLeconClick(lecon.id, lecon.status)}
                  disabled={lecon.status === 'locked'}
                  style={{
                    border: 'none',
                    background: 'transparent',
                    padding: 0,
                    cursor: lecon.status === 'locked' ? 'default' : 'pointer',
                  }}
                  aria-label={lecon.title}
                >
                  <NodeStar status={lecon.status} icon="📖" size={0} shape={shape} />
                </button>
                {lecon.status === 'current' && (
                  <div
                    style={{
                      fontSize: 10,
                      fontWeight: 900,
                      color: unite.colorA,
                      background: `${unite.colorA}20`,
                      border: `1px solid ${unite.colorA}60`,
                      borderRadius: 8,
                      padding: '2px 8px',
                      whiteSpace: 'nowrap',
                      letterSpacing: '0.03em',
                    }}
                  >
                    {lecon.title}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Chest bonus (milieu) */}
        {unite.lecons.length > 0 && (
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 8 }}>
            <div
              title={unite.chestUnlocked ? 'Récompense débloquée' : 'Récompense verrouillée'}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 2,
                opacity: unite.chestUnlocked ? 1 : 0.5,
                filter: unite.chestUnlocked ? 'none' : 'grayscale(1)',
              }}
            >
              <div style={{ fontSize: 32, lineHeight: 1 }}>🪙</div>
              <div style={{ fontSize: 9, fontWeight: 900, letterSpacing: '0.06em', textTransform: 'uppercase', color: unite.chestUnlocked ? '#f59e0b' : '#4b5563' }}>
                {unite.chestUnlocked ? 'Bonus !' : 'Bonus'}
              </div>
            </div>
          </div>
        )}

        {/* Trophée fin */}
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 12 }}>
          <ZelligeNode
            status={unite.trophyUnlocked ? 'done' : 'locked'}
            icon={unite.trophyUnlocked ? '🏆' : '🔒'}
            label=""
            size="md"
            shape={shape}
            interactive={false}
            forceIcon
          />
        </div>
      </div>
    </section>
  );
}
