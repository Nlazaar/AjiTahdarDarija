'use client';

import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[app/global-error]', error);
  }, [error]);

  return (
    <html lang="fr">
      <body
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 24,
          gap: 16,
          background: '#131f24',
          color: '#fff',
          fontFamily: 'system-ui, sans-serif',
          margin: 0,
        }}
      >
        <div style={{ fontSize: 40 }}>💥</div>
        <h2 style={{ fontSize: 18, fontWeight: 900, margin: 0 }}>Erreur critique</h2>
        <p style={{ fontSize: 13, color: '#8b9eb0', maxWidth: 420, textAlign: 'center', margin: 0 }}>
          {error.message || "L'application n'a pas pu démarrer."}
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
          Recharger
        </button>
      </body>
    </html>
  );
}
