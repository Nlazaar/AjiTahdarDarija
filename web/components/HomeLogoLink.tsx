'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

/**
 * Petit logo cliquable qui renvoie vers la home.
 * Utilisé dans l'en-tête des pages onboarding / auth pour offrir
 * une porte de sortie discrète sans interrompre le flux.
 */
export default function HomeLogoLink({ compact = false }: { compact?: boolean }) {
  const size = compact ? 32 : 36;
  return (
    <Link
      href="/"
      aria-label="Retour à l'accueil"
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 10,
        textDecoration: 'none', padding: 6, borderRadius: 10,
        transition: 'background-color 0.15s',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#f3f4f6'; }}
      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
    >
      <div style={{ width: size, height: size, position: 'relative', flexShrink: 0 }}>
        <Image src="/images/maroccan-lion.png" alt="" fill style={{ objectFit: 'contain' }} />
      </div>
      {!compact && (
        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
          <span style={{ fontSize: 14, fontWeight: 900, color: '#111827' }}>Aji Tahdar</span>
          <span style={{ fontSize: 10, fontWeight: 700, color: '#6b7280', letterSpacing: '0.04em' }}>
            Darija · MSA · Religion
          </span>
        </div>
      )}
    </Link>
  );
}
