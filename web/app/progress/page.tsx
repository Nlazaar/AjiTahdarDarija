'use client';

import React, { Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { useParcours } from '@/hooks/useParcours';
import UnitePath from '@/components/parcours/UnitePath';

const LEVEL_LABELS: Record<number, string> = {
  1: 'Débutant',
  2: 'Élémentaire',
  3: 'Intermédiaire',
  4: 'Avancé',
};

function LevelDivider({ level }: { level: number }) {
  const COLORS: Record<number, { bg: string; border: string; text: string }> = {
    1: { bg: 'rgba(88,204,2,0.08)',   border: 'rgba(88,204,2,0.25)',   text: '#58cc02' },
    2: { bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.25)', text: '#f59e0b' },
    3: { bg: 'rgba(249,115,22,0.08)', border: 'rgba(249,115,22,0.25)', text: '#fb923c' },
    4: { bg: 'rgba(167,139,250,0.08)',border: 'rgba(167,139,250,0.25)',text: '#a78bfa' },
  };
  const c = COLORS[level] ?? COLORS[1];
  return (
    <div style={{ maxWidth: 384, margin: '24px auto 0', padding: '0 12px' }}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
        padding: '10px 16px',
        background: c.bg, border: `2px solid ${c.border}`,
        borderRadius: 14,
      }}>
        <span style={{ fontSize: 12, fontWeight: 900, color: c.text, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
          Niveau {level} — {LEVEL_LABELS[level]}
        </span>
      </div>
    </div>
  );
}

function ProgressPageInner() {
  const router = useRouter();
  const { unites, loading } = useParcours();

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--c-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: '#9ca3af', fontSize: 14, fontWeight: 700 }}>Chargement de la carte…</div>
      </div>
    );
  }

  if (unites.length === 0) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--c-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: '#9ca3af', fontSize: 14, fontWeight: 700 }}>Aucun parcours disponible.</div>
      </div>
    );
  }

  let lastLevel = 0;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--c-bg)', paddingBottom: 100 }}>
      <div style={{ maxWidth: 384, margin: '0 auto', padding: '16px 16px 0' }}>
        <button
          onClick={() => router.push('/cours')}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            background: 'none', border: 'none',
            color: '#6b7f8a', fontSize: 13, fontWeight: 800,
            cursor: 'pointer', padding: '4px 0',
            letterSpacing: '0.03em',
          }}
        >
          ← Mes cours
        </button>
      </div>

      {unites.map((u) => {
        const showDivider = u.level !== lastLevel;
        lastLevel = u.level;
        return (
          <React.Fragment key={u.id}>
            {showDivider && <LevelDivider level={u.level} />}
            <UnitePath unite={u} />
          </React.Fragment>
        );
      })}

      <style>{`
        @keyframes zelligePulse {
          0%, 100% { transform: scale(1); }
          50%      { transform: scale(1.06); }
        }
      `}</style>
    </div>
  );
}

export default function ProgressPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', background: 'var(--c-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: '#9ca3af', fontSize: 14, fontWeight: 700 }}>Chargement de la carte…</div>
      </div>
    }>
      <ProgressPageInner />
    </Suspense>
  );
}
