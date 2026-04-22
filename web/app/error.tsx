'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[app/error]', error);
  }, [error]);

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
        gap: 16,
        background: 'var(--c-bg)',
        color: 'var(--c-text)',
      }}
    >
      <div style={{ fontSize: 40 }}>🚧</div>
      <h2 style={{ fontSize: 18, fontWeight: 900, margin: 0 }}>Une erreur s'est produite</h2>
      <p style={{ fontSize: 13, color: 'var(--c-sub)', maxWidth: 420, textAlign: 'center', margin: 0 }}>
        {error.message || "Impossible de charger cette page."}
      </p>
      <button
        onClick={() => reset()}
        style={{
          marginTop: 8,
          padding: '10px 20px',
          borderRadius: 10,
          border: 'none',
          background: '#58cc02',
          color: '#fff',
          fontWeight: 900,
          fontSize: 13,
          cursor: 'pointer',
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
        }}
      >
        Réessayer
      </button>
    </div>
  );
}
