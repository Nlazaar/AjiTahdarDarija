import React from 'react'

export default function DailyGoals({ xpTarget = 50, lessons = 1, reviews = 5 }: { xpTarget?: number; lessons?: number; reviews?: number }) {
  return (
    <div style={{ padding: 12, borderRadius: 8, background: 'var(--card-bg, #fff)', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
      <h3>Objectifs du jour</h3>
      <ul>
        <li>XP à atteindre: <strong>{xpTarget}</strong></li>
        <li>Leçons à faire: <strong>{lessons}</strong></li>
        <li>Révisions: <strong>{reviews}</strong></li>
      </ul>
    </div>
  )
}
