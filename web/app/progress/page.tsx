'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { useParcours } from '@/hooks/useParcours';
import UnitePath from '@/components/parcours/UnitePath';
import { useUser, type LangTrack } from '@/context/UserContext';
import { getTracks, type Track } from '@/lib/api';

type TrackTab = { key: LangTrack; label: string; emoji: string; color: string };

const FALLBACK_TABS: TrackTab[] = [
  { key: 'DARIJA',   label: 'Darija',   emoji: '🇲🇦', color: '#58cc02' },
  { key: 'MSA',      label: 'MSA',      emoji: '📖', color: '#1cb0f6' },
  { key: 'RELIGION', label: 'Religion', emoji: '☪︎', color: '#a855f7' },
];

function TrackSwitcher({ tabs }: { tabs: TrackTab[] }) {
  const { langTrack, setLangTrack } = useUser();
  return (
    <div style={{
      display: 'flex', justifyContent: 'center', gap: 8,
      padding: '14px 12px 4px', flexWrap: 'wrap',
    }}>
      {tabs.map(t => {
        const active = langTrack === t.key;
        return (
          <button
            key={t.key}
            onClick={() => setLangTrack(t.key)}
            style={{
              padding: '8px 16px', borderRadius: 999,
              border: `2px solid ${active ? t.color : 'var(--c-border)'}`,
              background: active ? `${t.color}1a` : 'var(--c-card)',
              color: active ? t.color : 'var(--c-sub)',
              fontSize: 13, fontWeight: 800, cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 6,
              transition: 'all 0.15s',
            }}
          >
            <span style={{ fontSize: 14 }}>{t.emoji}</span>
            {t.label}
          </button>
        );
      })}
    </div>
  );
}

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
  const { unites, loading } = useParcours();
  const { langTrack } = useUser();
  const [tabs, setTabs] = useState<TrackTab[]>(FALLBACK_TABS);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const tracks = (await getTracks()) as Track[];
        if (cancelled || !Array.isArray(tracks) || tracks.length === 0) return;
        const mapped = tracks
          .filter((t) => t.isPublished !== false)
          .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
          .map<TrackTab>((t) => {
            const fallback = FALLBACK_TABS.find((x) => x.key === t.code);
            return {
              key: t.code as LangTrack,
              label: t.name,
              emoji: t.emoji || fallback?.emoji || '📚',
              color: t.color || fallback?.color || '#58cc02',
            };
          });
        if (mapped.length) setTabs(mapped);
      } catch {
        /* fallback reste actif */
      }
    })();
    return () => { cancelled = true; };
  }, []);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--c-bg)' }}>
        <TrackSwitcher tabs={tabs} />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 20px' }}>
          <div style={{ color: '#9ca3af', fontSize: 14, fontWeight: 700 }}>Chargement de la carte…</div>
        </div>
      </div>
    );
  }

  let lastLevel = 0;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--c-bg)', paddingBottom: 100 }}>
      <TrackSwitcher tabs={tabs} />

      {unites.length === 0 ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '80px 20px' }}>
          <div style={{ color: '#9ca3af', fontSize: 14, fontWeight: 700, textAlign: 'center' }}>
            Aucun parcours disponible pour <strong style={{ color: 'var(--c-text)' }}>{tabs.find(t => t.key === langTrack)?.label ?? langTrack}</strong>.
            <div style={{ fontSize: 12, marginTop: 6, color: '#9ca3af' }}>Choisis un autre parcours ci-dessus.</div>
          </div>
        </div>
      ) : unites.map((u) => {
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
