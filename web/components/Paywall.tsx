import React from 'react'

export default function Paywall({ onUpgrade }: { onUpgrade: () => void }) {
  return (
    <div style={{ padding: 12, border: '1px solid #eee', borderRadius: 8, background: 'var(--card-bg,#fff)' }}>
      <h3>Passer Premium</h3>
      <p>Accédez à des fonctionnalités exclusives : leçons bonus, statistiques avancées et plus.</p>
      <button onClick={onUpgrade} style={{ padding: '8px 12px', background: '#F59E0B', color: '#fff', border: 'none', borderRadius: 6 }}>Passer Premium</button>
    </div>
  )
}
