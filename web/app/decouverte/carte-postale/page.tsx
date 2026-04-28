'use client';

import React from 'react';
import Link from 'next/link';
import CartePostalePanel from '@/components/carte-postale/CartePostalePanel';

export default function CartePostaleDecouvertePage() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--c-bg)', padding: '20px 0 100px' }}>
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '0 16px 16px' }}>
        <Link href="/plus" style={{
          fontSize: 12, color: 'var(--c-sub)', textDecoration: 'none', fontWeight: 700,
        }}>
          ← Plus
        </Link>
        <h1 style={{
          fontSize: 22, fontWeight: 900, color: 'var(--c-text)',
          margin: '12px 0 4px', letterSpacing: '-0.01em',
        }}>
          Carte postale
        </h1>
        <p style={{
          fontSize: 13, color: 'var(--c-sub)', margin: 0, fontWeight: 600,
        }}>
          La ville liée à ton unité en cours, dévoilée au fur et à mesure.
        </p>
      </div>

      <CartePostalePanel inline />
    </div>
  );
}
