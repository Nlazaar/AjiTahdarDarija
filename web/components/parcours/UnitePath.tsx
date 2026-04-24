'use client';

import React, { useRef } from 'react';
import { useRouter } from 'next/navigation';
import type { Unite, NodeStatus, Lecon, Revision } from '@/hooks/useParcours';
import UnitBanner from './UnitBanner';
import { ZelligeNode, type NodeShape, type NodeStatus as ZStatus } from './ZelligeNode';
import RevisionNode from './RevisionNode';

// Compact serpentin: 5 nodes max per visible row, 68px row height
const ROW_H = 68;

// Zigzag x offsets in % within a max-w-sm column
const ZIGZAG = [50, 62, 70, 62, 50, 38, 30, 38];

function mapStatus(s: NodeStatus): ZStatus {
  if (s === 'completed') return 'done';
  if (s === 'current')   return 'active';
  return 'locked';
}

function Connector({ active, color }: { active: boolean; color: string }) {
  return (
    <div
      aria-hidden
      style={{
        width: 4,
        height: 16,
        margin: '2px auto',
        borderRadius: 2,
        background: active
          ? `repeating-linear-gradient(to bottom, ${color} 0 5px, transparent 5px 10px)`
          : 'repeating-linear-gradient(to bottom, #4b5563 0 5px, transparent 5px 10px)',
        opacity: active ? 1 : 0.5,
      }}
    />
  );
}

type PathNode =
  | { kind: 'lesson'; data: Lecon }
  | { kind: 'revision'; data: Revision };

/**
 * Tisse les leçons et les 2 révisions en un seul flux pour le serpentin.
 * `anchorAfterOrder` (0-indexed) indique combien de leçons précèdent la révision ;
 * il est résolu dans `buildRevisions` (fallback MIDDLE = floor(n/2), END = n).
 */
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

export default function UnitePath({ unite, shape = 'star' }: { unite: Unite; shape?: NodeShape }) {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  const nodes = weaveNodes(unite.lecons, unite.revisions);

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

  return (
    <section style={{ margin: '24px auto 0', maxWidth: 460, width: '100%' }}>
      <UnitBanner
        unite={unite}
        isCurrentUnit={isCurrentUnit}
        onContinue={handleHeaderClick}
      />

      <div ref={containerRef} style={{ position: 'relative', padding: '12px 16px 4px' }}>
        {nodes.map((n, idx) => {
          const x = ZIGZAG[idx % ZIGZAG.length];
          const isRevision = n.kind === 'revision';
          return (
            <div key={`${n.kind}-${n.data.id}`} style={{ position: 'relative', zIndex: 1 }}>
              <div
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
                {isRevision ? (
                  <RevisionNode
                    status={n.data.status}
                    position={(n.data as Revision).position}
                    onClick={() => handleRevisionClick(n.data.id, n.data.status)}
                  />
                ) : (
                  <button
                    onClick={() => handleLeconClick(n.data.id, n.data.status)}
                    disabled={n.data.status === 'locked'}
                    style={{
                      border: 'none',
                      background: 'transparent',
                      padding: 0,
                      cursor: n.data.status === 'locked' ? 'default' : 'pointer',
                    }}
                    aria-label={(n.data as Lecon).title}
                  >
                    <ZelligeNode
                      status={mapStatus(n.data.status)}
                      icon="📖"
                      label=""
                      size="md"
                      shape={shape}
                      interactive={false}
                      tint={unite.colorA}
                      tintDark={unite.shadow}
                    />
                  </button>
                )}
                {n.data.status === 'current' && (
                  <div
                    style={{
                      fontSize: 10,
                      fontWeight: 900,
                      color: isRevision ? '#d4a84b' : unite.colorA,
                      background: isRevision ? 'rgba(212,168,75,0.18)' : `${unite.colorA}20`,
                      border: `1px solid ${isRevision ? '#d4a84b60' : unite.colorA + '60'}`,
                      borderRadius: 8,
                      padding: '2px 8px',
                      whiteSpace: 'nowrap',
                      letterSpacing: '0.03em',
                    }}
                  >
                    {isRevision
                      ? ((n.data as Revision).title ?? ((n.data as Revision).position === 'MIDDLE' ? 'Pause — Révision' : 'Révision finale'))
                      : (n.data as Lecon).title}
                  </div>
                )}
              </div>
              {idx < nodes.length - 1 && (
                <div style={{ marginLeft: `${x}%`, transform: 'translateX(-50%)', width: 0 }}>
                  <Connector active={n.data.status === 'completed'} color={unite.colorA} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
