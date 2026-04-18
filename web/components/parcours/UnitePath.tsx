'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import type { Unite, NodeStatus } from '@/hooks/useParcours';

// Compact serpentin: 5 nodes max per visible row, 68px row height
const ROW_H = 68;
const NODE = 52;
const BIG_NODE = 60;

// Zigzag x offsets in % within a max-w-sm column
const ZIGZAG = [50, 62, 70, 62, 50, 38, 30, 38];

function NodeStar({ status, icon, size }: { status: NodeStatus; icon: string; size: number }) {
  if (status === 'completed') {
    return (
      <svg width={size} height={size} viewBox="0 0 110 110" style={{ filter: 'drop-shadow(0 4px 0 #2d6e02)' }}>
        <polygon points="55,4 68,22 93,14 87,40 107,50 87,62 93,88 68,80 55,96 42,80 17,88 23,62 3,50 23,40 17,14 42,22" fill="#58cc02" />
        <circle cx="55" cy="51" r="14" fill="#3a8a02" />
        <text x="55" y="51" textAnchor="middle" dominantBaseline="central" fontSize="18" fill="#fff" fontWeight="900" fontFamily="sans-serif">✓</text>
      </svg>
    );
  }
  if (status === 'current') {
    return (
      <svg width={size} height={size} viewBox="0 0 110 110" style={{ animation: 'zelligePulse 2s ease-in-out infinite' }}>
        <polygon points="55,1 68,22 93,14 87,40 112,51 87,62 93,88 68,80 55,101 42,80 17,88 23,62 -2,51 23,40 17,14 42,22" fill="#fff" />
        <polygon points="55,18 65,33 83,28 78,44 93,52 78,60 83,74 65,69 55,84 45,69 27,74 32,60 17,52 32,44 27,28 45,33" fill="#e76f51" />
        <circle cx="55" cy="52" r="13" fill="#c9941a" />
        <text x="55" y="52" textAnchor="middle" dominantBaseline="central" fontSize="14" fontFamily="sans-serif">{icon}</text>
      </svg>
    );
  }
  return (
    <svg width={size} height={size} viewBox="0 0 110 110" style={{ filter: 'drop-shadow(0 4px 0 #111827)', opacity: 0.55 }}>
      <polygon points="55,4 68,22 93,14 87,40 107,50 87,62 93,88 68,80 55,96 42,80 17,88 23,62 3,50 23,40 17,14 42,22" fill="#374151" />
      <circle cx="55" cy="51" r="14" fill="#1f2937" />
      <text x="55" y="51" textAnchor="middle" dominantBaseline="central" fontSize="15" fontFamily="sans-serif">🔒</text>
    </svg>
  );
}

function Connector({ active }: { active: boolean }) {
  return (
    <div
      style={{
        width: 4,
        height: 16,
        margin: '2px auto',
        borderRadius: 2,
        background: active
          ? 'repeating-linear-gradient(to bottom, #58cc02 0 5px, transparent 5px 10px)'
          : 'repeating-linear-gradient(to bottom, #4b5563 0 5px, transparent 5px 10px)',
        opacity: active ? 1 : 0.5,
      }}
    />
  );
}

export default function UnitePath({ unite }: { unite: Unite }) {
  const router = useRouter();
  const headerBg = unite.unlocked ? unite.colorA : '#374151';

  const handleLeconClick = (leconId: string, status: NodeStatus) => {
    if (status === 'locked') return;
    router.push(`/lesson/${leconId}`);
  };

  const handleHeaderClick = () => {
    if (!unite.unlocked) return;
    const next = unite.lecons.find((l) => l.status !== 'completed') ?? unite.lecons[0];
    if (next?.id) router.push(`/lesson/${next.id}`);
  };

  return (
    <section style={{ margin: '24px auto 0', maxWidth: 384, width: '100%' }}>
      {/* Bandeau coloré */}
      <div
        onClick={handleHeaderClick}
        style={{
          margin: '0 12px',
          borderRadius: 16,
          background: headerBg,
          padding: '14px 18px',
          cursor: unite.unlocked ? 'pointer' : 'default',
          opacity: unite.unlocked ? 1 : 0.65,
        }}
      >
        <div style={{ fontSize: 10, fontWeight: 800, color: 'rgba(255,255,255,0.7)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          Unité — Niveau {unite.level}
        </div>
        <div style={{ fontSize: 18, fontWeight: 900, color: '#fff', lineHeight: 1.2, marginTop: 2 }}>
          {unite.title}
        </div>
        {unite.subtitle && (
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.85)', fontWeight: 600, marginTop: 2 }}>
            {unite.subtitle}
          </div>
        )}
      </div>

      {/* Serpentin */}
      <div style={{ padding: '12px 16px 4px' }}>
        {unite.lecons.map((lecon, idx) => {
          const x = ZIGZAG[idx % ZIGZAG.length];
          const size = lecon.status === 'current' ? BIG_NODE : NODE;
          return (
            <div key={lecon.id}>
              <div
                style={{
                  marginLeft: `${x}%`,
                  transform: 'translateX(-50%)',
                  minHeight: ROW_H,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 4,
                }}
              >
                <button
                  onClick={() => handleLeconClick(lecon.id, lecon.status)}
                  disabled={lecon.status === 'locked'}
                  style={{
                    width: size,
                    height: size,
                    border: 'none',
                    background: 'transparent',
                    padding: 0,
                    cursor: lecon.status === 'locked' ? 'default' : 'pointer',
                  }}
                  aria-label={lecon.title}
                >
                  <NodeStar status={lecon.status} icon="📖" size={size} />
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
              {idx < unite.lecons.length - 1 && (
                <div style={{ marginLeft: `${x}%`, transform: 'translateX(-50%)', width: 0 }}>
                  <Connector active={lecon.status === 'completed'} />
                </div>
              )}
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
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              background: unite.trophyUnlocked ? 'linear-gradient(135deg,#f59e0b,#d97706)' : '#374151',
              boxShadow: unite.trophyUnlocked ? '0 4px 0 #b45309' : '0 4px 0 #1f2937',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 24,
            }}
          >
            {unite.trophyUnlocked ? '🏆' : '🔒'}
          </div>
        </div>
      </div>
    </section>
  );
}
