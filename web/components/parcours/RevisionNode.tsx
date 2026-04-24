'use client';

import React from 'react';
import type { NodeStatus, RevisionPosition } from '@/hooks/useParcours';

interface Props {
  status: NodeStatus;
  position: RevisionPosition;
  onClick: () => void;
}

const GOLD = '#d4a84b';
const RED = '#c1272d';

export default function RevisionNode({ status, position, onClick }: Props) {
  const icon = position === 'MIDDLE' ? '💬' : '🎓';
  const label = position === 'MIDDLE' ? 'Révision' : 'Révision finale';
  const locked = status === 'locked';
  const done = status === 'completed';
  const active = status === 'current';
  const size = 72;

  return (
    <button
      onClick={onClick}
      disabled={locked}
      aria-label={label}
      className="revision-node"
      data-active={active}
      data-done={done}
      style={{
        border: 'none',
        background: 'transparent',
        padding: 0,
        cursor: locked ? 'default' : 'pointer',
        width: size,
        height: size,
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        filter: locked ? 'grayscale(1)' : undefined,
        opacity: locked ? 0.55 : 1,
      }}
    >
      {/* Couronne zellige tournante (en arrière) */}
      <svg
        viewBox="0 0 120 120"
        width={size}
        height={size}
        style={{
          position: 'absolute',
          inset: 0,
          animation: active ? 'revisionSpin 14s linear infinite' : 'none',
        }}
        aria-hidden
      >
        <defs>
          <linearGradient id={`rev-crown-${position}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={GOLD} />
            <stop offset="100%" stopColor={RED} />
          </linearGradient>
        </defs>
        {/* Khatem : 2 carrés superposés, rotation */}
        <g transform="translate(60 60)" fill="none" stroke={`url(#rev-crown-${position})`} strokeWidth={2} strokeLinejoin="round">
          <rect x={-48} y={-48} width={96} height={96} rx={6} transform="rotate(0)" opacity={0.85} />
          <rect x={-48} y={-48} width={96} height={96} rx={6} transform="rotate(45)" opacity={0.6} />
        </g>
        {/* Petits points d'étoile */}
        {Array.from({ length: 8 }).map((_, i) => {
          const a = (i * Math.PI) / 4;
          const r = 52;
          const x = 60 + Math.cos(a) * r;
          const y = 60 + Math.sin(a) * r;
          return <circle key={i} cx={x} cy={y} r={1.8} fill={GOLD} opacity={0.9} />;
        })}
      </svg>

      {/* Médaillon central (gradient or → rouge) */}
      <div
        style={{
          position: 'relative',
          width: size - 22,
          height: size - 22,
          borderRadius: '50%',
          background: `radial-gradient(circle at 30% 30%, ${GOLD}, ${RED} 85%)`,
          boxShadow: done
            ? `0 0 0 3px ${GOLD}, 0 6px 14px rgba(193,39,45,0.45)`
            : active
              ? `0 0 0 3px ${GOLD}, 0 0 24px ${GOLD}aa, 0 6px 14px rgba(193,39,45,0.55)`
              : `0 4px 10px rgba(0,0,0,0.35)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 24,
          animation: active ? 'revisionPulse 1.8s ease-in-out infinite' : 'none',
          border: `2px solid ${done ? GOLD : 'rgba(212,168,75,0.7)'}`,
        }}
      >
        <span
          style={{
            filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.4))',
            lineHeight: 1,
          }}
        >
          {done ? '✓' : locked ? '🔒' : icon}
        </span>
      </div>

      <style jsx>{`
        @keyframes revisionSpin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes revisionPulse {
          0%, 100% { transform: scale(1); }
          50%      { transform: scale(1.08); }
        }
      `}</style>
    </button>
  );
}
