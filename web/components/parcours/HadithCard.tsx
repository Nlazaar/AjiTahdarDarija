'use client';

import React from 'react';
import type { HadithDescription } from '@/types/parcours';

interface Props {
  description: HadithDescription;
  color: string;
  title: string;
  titleAr?: string;
}

export default function HadithCard({ description, color, title, titleAr }: Props) {
  const d = description;

  return (
    <div
      style={{
        margin: '10px 12px 0',
        borderRadius: 18,
        overflow: 'hidden',
        background: 'var(--c-card)',
        border: '1px solid var(--c-border)',
        animation: 'hadithCardFadeUp 260ms ease-out',
      }}
    >
      {/* Header avec emoji centré */}
      <div
        style={{
          position: 'relative',
          height: 110,
          background: `linear-gradient(135deg, ${color} 0%, ${color}cc 60%, ${color}88 100%)`,
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
            background: 'radial-gradient(circle at 70% 30%, rgba(255,255,255,0.22), transparent 55%)',
          }}
        />
        <div style={{ fontSize: 56, lineHeight: 1, filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.35))' }}>
          {d.emoji ?? '☪️'}
        </div>
        {d.subtitle && (
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
            }}
          >
            {d.subtitle}
          </div>
        )}
      </div>

      <div style={{ padding: '16px 16px 18px' }}>
        {/* Titre bilingue */}
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12, marginBottom: 12 }}>
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

        {/* Hadith — texte arabe en grand + traduction + source */}
        {d.hadith && (
          <div
            style={{
              background: `${color}10`,
              border: `1.5px solid ${color}40`,
              borderRadius: 14,
              padding: '14px 16px',
              marginBottom: 12,
            }}
          >
            <div
              style={{
                fontSize: 10,
                fontWeight: 900,
                color,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                marginBottom: 8,
              }}
            >
              ✦ Hadith
            </div>
            <div
              style={{
                fontFamily: 'var(--font-amiri), serif',
                direction: 'rtl',
                fontSize: 19,
                lineHeight: 1.7,
                color: 'var(--c-text)',
                fontWeight: 700,
                marginBottom: 10,
              }}
            >
              {d.hadith.ar}
            </div>
            <div
              style={{
                fontSize: 13,
                color: 'var(--c-text)',
                lineHeight: 1.5,
                fontStyle: 'italic',
                opacity: 0.9,
              }}
            >
              « {d.hadith.fr} »
            </div>
            {d.hadith.source && (
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: 'var(--c-sub)',
                  marginTop: 8,
                  textAlign: 'right',
                }}
              >
                — {d.hadith.source}
              </div>
            )}
          </div>
        )}

        {/* Description courte (optionnelle) */}
        {d.description && (
          <div
            style={{
              fontSize: 13,
              color: 'var(--c-text)',
              lineHeight: 1.55,
              opacity: 0.92,
            }}
          >
            {d.description}
          </div>
        )}
      </div>

      <style>{`
        @keyframes hadithCardFadeUp {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
