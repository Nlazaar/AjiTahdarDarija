'use client';

import React from 'react';
import type { CityDescription } from '@/types/parcours';

interface Props {
  description: CityDescription;
  color: string;
  title: string;
  titleAr?: string;
}

function Fact({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div
      style={{
        background: 'var(--c-card2)',
        border: '1px solid var(--c-border)',
        borderRadius: 14,
        padding: '12px 12px',
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
        minWidth: 0,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{ fontSize: 16, lineHeight: 1 }}>{icon}</span>
        <span
          style={{
            fontSize: 10,
            fontWeight: 900,
            color: 'var(--c-sub)',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
          }}
        >
          {label}
        </span>
      </div>
      <div style={{ fontSize: 12.5, color: 'var(--c-text)', lineHeight: 1.45, fontWeight: 500 }}>
        {value}
      </div>
    </div>
  );
}

export default function CityCard({ description, color, title, titleAr }: Props) {
  const d = description;

  return (
    <div
      style={{
        margin: '10px 12px 0',
        borderRadius: 18,
        overflow: 'hidden',
        background: 'var(--c-card)',
        border: '1px solid var(--c-border)',
        animation: 'cityCardFadeUp 260ms ease-out',
      }}
    >
      {/* Photo header (URL > gradient + emoji) */}
      <div
        style={{
          position: 'relative',
          height: 110,
          background: d.photoUrl
            ? `${color} center/cover no-repeat url(${d.photoUrl})`
            : `linear-gradient(135deg, ${color} 0%, ${color}cc 60%, ${color}88 100%)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}
      >
        <div
          aria-hidden
          style={{
            position: 'absolute',
            inset: 0,
            background: d.photoUrl
              ? 'linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.35) 100%)'
              : 'radial-gradient(circle at 70% 30%, rgba(255,255,255,0.22), transparent 55%)',
          }}
        />
        {!d.photoUrl && (
          <div style={{ fontSize: 56, lineHeight: 1, filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.35))' }}>
            {d.photoEmoji}
          </div>
        )}
        <div
          style={{
            position: 'absolute',
            left: 12,
            right: 12,
            bottom: 8,
            fontSize: 11,
            fontWeight: 700,
            color: 'rgba(255,255,255,0.92)',
            textAlign: 'center',
            textShadow: '0 1px 2px rgba(0,0,0,0.5)',
            letterSpacing: '0.01em',
          }}
        >
          {d.photoCaption}
        </div>
      </div>

      <div style={{ padding: '16px 16px 18px' }}>
        {/* Title bilingue */}
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12, marginBottom: 10 }}>
          <div style={{ fontSize: 17, fontWeight: 900, color: 'var(--c-text)' }}>{title}</div>
          {titleAr && (
            <div
              style={{
                fontSize: 18,
                fontWeight: 700,
                color,
                fontFamily: 'var(--font-amiri), serif',
                direction: 'rtl',
              }}
            >
              {titleAr}
            </div>
          )}
        </div>

        {/* Histoire */}
        {d.histoire && (
          <div
            style={{
              fontSize: 13,
              color: 'var(--c-text)',
              lineHeight: 1.55,
              marginBottom: 14,
              opacity: 0.92,
            }}
          >
            {d.histoire}
          </div>
        )}

        {/* Mot typique — RTL + Amiri */}
        {(d.motTypique.ar || d.motTypique.latin || d.motTypique.fr) && (
        <div
          style={{
            background: `${color}14`,
            border: `1.5px solid ${color}40`,
            borderRadius: 14,
            padding: '12px 14px',
            marginBottom: 14,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
          }}
        >
          <div style={{ minWidth: 0 }}>
            <div
              style={{
                fontSize: 10,
                fontWeight: 900,
                color,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                marginBottom: 4,
              }}
            >
              Mot typique
            </div>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--c-text)' }}>
              {d.motTypique.latin}
              <span style={{ color: 'var(--c-sub)', fontWeight: 500 }}> — {d.motTypique.fr}</span>
            </div>
          </div>
          <div
            style={{
              fontFamily: 'var(--font-amiri), serif',
              fontSize: 26,
              fontWeight: 700,
              color: 'var(--c-text)',
              direction: 'rtl',
              lineHeight: 1.2,
              flexShrink: 0,
            }}
          >
            {d.motTypique.ar}
          </div>
        </div>
        )}

        {/* Grid 2×2 de faits */}
        {(d.specialite || d.faitCulturel || d.aVoir || d.musique) && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 10,
            }}
          >
            {d.specialite && <Fact icon="🍽️" label="Spécialité" value={d.specialite} />}
            {d.faitCulturel && <Fact icon="✨" label="Fait culturel" value={d.faitCulturel} />}
            {d.aVoir && <Fact icon="📍" label="À voir" value={d.aVoir} />}
            {d.musique && <Fact icon="🎵" label="Musique" value={d.musique} />}
          </div>
        )}
      </div>

      <style>{`
        @keyframes cityCardFadeUp {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
