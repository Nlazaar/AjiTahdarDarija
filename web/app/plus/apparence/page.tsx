'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ZelligeNode, NODE_SHAPES, type NodeShape } from '@/components/parcours/ZelligeNode';

const SHAPE_STORAGE_KEY = 'parcoursNodeShape';

export default function ApparencePage() {
  const [shape, setShape] = useState<NodeShape>('star');

  useEffect(() => {
    try {
      const saved = localStorage.getItem(SHAPE_STORAGE_KEY);
      if (saved && NODE_SHAPES.some(s => s.key === saved)) {
        setShape(saved as NodeShape);
      }
    } catch {}
  }, []);

  const pick = (s: NodeShape) => {
    setShape(s);
    try {
      localStorage.setItem(SHAPE_STORAGE_KEY, s);
      window.dispatchEvent(new StorageEvent('storage', { key: SHAPE_STORAGE_KEY, newValue: s }));
    } catch {}
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--c-bg)', padding: '24px 16px 100px' }}>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        <div style={{ marginBottom: 16 }}>
          <Link href="/plus" style={{ fontSize: 12, color: 'var(--c-sub)', textDecoration: 'none', fontWeight: 700 }}>
            ← Plus
          </Link>
        </div>

        <div style={{ marginBottom: 20, padding: '0 4px' }}>
          <h1 style={{ fontSize: 22, fontWeight: 900, color: 'var(--c-text)', margin: 0, letterSpacing: '-0.01em' }}>
            Apparence des nœuds
          </h1>
          <p style={{ fontSize: 13, color: 'var(--c-sub)', margin: '4px 0 0', fontWeight: 600 }}>
            Choisis le style des étapes de parcours.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 12 }}>
          {NODE_SHAPES.map(opt => {
            const active = shape === opt.key;
            return (
              <button
                key={opt.key}
                type="button"
                onClick={() => pick(opt.key)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 14,
                  padding: '16px 18px',
                  background: active ? 'rgba(88,204,2,0.08)' : 'var(--c-card)',
                  border: `1.5px solid ${active ? '#58cc02' : 'var(--c-border)'}`,
                  borderRadius: 14, cursor: 'pointer', textAlign: 'left',
                  transition: 'transform 0.1s, border-color 0.15s, background 0.15s',
                  position: 'relative',
                }}
              >
                <div style={{
                  width: 80, height: 100,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <ZelligeNode
                    status="active"
                    icon="📖"
                    label=""
                    size="md"
                    shape={opt.key}
                    interactive={false}
                  />
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontSize: 14, fontWeight: 900, color: 'var(--c-text)',
                    letterSpacing: '0.03em', textTransform: 'uppercase', marginBottom: 2,
                  }}>
                    {opt.label}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--c-sub)', lineHeight: 1.35 }}>
                    {opt.description}
                  </div>
                </div>

                {active && (
                  <span style={{
                    position: 'absolute', top: 10, right: 12,
                    fontSize: 10, fontWeight: 900, color: '#58cc02',
                    background: 'rgba(88,204,2,0.15)', padding: '3px 8px', borderRadius: 999,
                    letterSpacing: '0.05em', textTransform: 'uppercase',
                  }}>
                    Actif
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div style={{ marginTop: 24, padding: '0 4px' }}>
          <Link href="/progress" style={{
            display: 'inline-block', padding: '10px 18px',
            background: '#58cc02', color: '#fff',
            borderRadius: 10, textDecoration: 'none',
            fontSize: 13, fontWeight: 900, letterSpacing: '0.04em', textTransform: 'uppercase',
          }}>
            Voir sur le parcours →
          </Link>
        </div>
      </div>
    </div>
  );
}
