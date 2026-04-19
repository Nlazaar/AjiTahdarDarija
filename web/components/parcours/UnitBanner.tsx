'use client';

import React, { useState } from 'react';
import type { Unite } from '@/hooks/useParcours';
import CityCard from './CityCard';

interface Props {
  unite: Unite;
  isCurrentUnit?: boolean;
  onContinue?: () => void;
}

export default function UnitBanner({ unite, isCurrentUnit = false, onContinue }: Props) {
  const [open, setOpen] = useState(false);
  const headerBg = unite.unlocked ? unite.colorA : '#374151';
  const hasDescription = !!unite.description;

  return (
    <div>
      <div
        onClick={() => hasDescription && setOpen((v) => !v)}
        role={hasDescription ? 'button' : undefined}
        aria-expanded={hasDescription ? open : undefined}
        style={{
          margin: '0 12px',
          borderRadius: 16,
          background: headerBg,
          padding: '14px 18px',
          cursor: hasDescription ? 'pointer' : 'default',
          opacity: unite.unlocked ? 1 : 0.65,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          transition: 'transform 0.12s',
        }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontSize: 10,
              fontWeight: 800,
              color: 'rgba(255,255,255,0.7)',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
            }}
          >
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

        {isCurrentUnit && onContinue && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onContinue();
            }}
            style={{
              flexShrink: 0,
              border: 'none',
              background: 'rgba(255,255,255,0.95)',
              color: headerBg,
              fontWeight: 900,
              fontSize: 11,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              padding: '8px 12px',
              borderRadius: 10,
              cursor: 'pointer',
              boxShadow: '0 2px 0 rgba(0,0,0,0.15)',
            }}
          >
            Continuer →
          </button>
        )}

        {hasDescription && (
          <div
            aria-hidden
            style={{
              flexShrink: 0,
              width: 28,
              height: 28,
              borderRadius: 10,
              background: 'rgba(255,255,255,0.18)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontSize: 14,
              fontWeight: 900,
              transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.2s',
            }}
          >
            ▾
          </div>
        )}
      </div>

      {open && unite.description && (
        <CityCard
          description={unite.description}
          color={unite.colorA}
          title={unite.title}
          titleAr={unite.titleAr}
        />
      )}
    </div>
  );
}
