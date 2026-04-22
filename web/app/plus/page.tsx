'use client';

import React from 'react';
import Link from 'next/link';

const ITEMS = [
  { href: '/revision',        label: 'Révision',     icon: '🔁', desc: 'Révise les mots vus récemment avec des mini-sessions.' },
  { href: '/duels',           label: 'Duels',        icon: '⚔️', desc: 'Affronte d\'autres apprenants en temps réel.' },
  { href: '/friends',         label: 'Amis',         icon: '👥', desc: 'Invite tes amis et suis leurs progrès.' },
  { href: '/alphabet',        label: 'Alphabet',     icon: 'ا',  desc: 'Redécouvre l\'alphabet arabe lettre par lettre.' },
  { href: '/plus/apparence',  label: 'Apparence',    icon: '🎨', desc: 'Change la forme des nœuds de parcours (étoile, arc, hexagone…).' },
  { href: '/abonnement',      label: 'Abonnement',   icon: '💎', desc: 'Passe à la version premium sans limite.' },
  { href: '/aide',            label: 'Aide',         icon: '❓', desc: 'FAQ, contact et support.' },
  { href: '/settings',        label: 'Réglages',     icon: '⚙️', desc: 'Langue, notifications, compte.' },
];

export default function PlusPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--c-bg)', padding: '24px 16px 100px' }}>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        <div style={{ marginBottom: 24, padding: '0 4px' }}>
          <h1 style={{
            fontSize: 22, fontWeight: 900, color: 'var(--c-text)',
            margin: 0, letterSpacing: '-0.01em',
          }}>Plus</h1>
          <p style={{
            fontSize: 13, color: 'var(--c-sub)',
            margin: '4px 0 0', fontWeight: 600,
          }}>
            Toutes les autres sections de l'app.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: 12,
        }}>
          {ITEMS.map(it => (
            <Link
              key={it.href}
              href={it.href}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                padding: '16px 18px',
                background: 'var(--c-card)',
                border: '1.5px solid var(--c-border)',
                borderRadius: 14,
                textDecoration: 'none',
                transition: 'transform 0.1s, border-color 0.15s, background 0.15s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#58cc02';
                e.currentTarget.style.background = 'var(--c-card2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--c-border)';
                e.currentTarget.style.background = 'var(--c-card)';
              }}
            >
              <span style={{
                width: 46, height: 46, borderRadius: 12,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 22,
                fontFamily: 'var(--font-amiri), serif',
                fontWeight: 900,
                background: 'var(--c-bg)',
                color: 'var(--c-text)',
                border: '1.5px solid var(--c-border)',
                flexShrink: 0,
              }}>
                {it.icon}
              </span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontSize: 14, fontWeight: 900, color: 'var(--c-text)',
                  letterSpacing: '0.03em', textTransform: 'uppercase',
                  marginBottom: 2,
                }}>
                  {it.label}
                </div>
                <div style={{
                  fontSize: 12, color: 'var(--c-sub)',
                  lineHeight: 1.35,
                }}>
                  {it.desc}
                </div>
              </div>
              <span style={{ color: 'var(--c-sub)', fontSize: 18, flexShrink: 0 }}>›</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
