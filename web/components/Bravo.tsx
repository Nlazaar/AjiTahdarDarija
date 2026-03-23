import React from 'react'
import Mascotte from './Mascotte'
import Celebration from './Celebration'
import { playSound } from '../lib/sounds'

export default function Bravo({ xp = 0, streak = 0, hearts = 0, badges = [] }: { xp?: number; streak?: number; hearts?: number; badges?: any[] }) {
  React.useEffect(() => { playSound('badge') }, [])
  return (
    <div style={{ padding: 20, textAlign: 'center' }}>
      <Mascotte size={140} />
      <h2>Bravo !</h2>
      <p>XP gagné: <strong>{xp}</strong></p>
      <p>Streak: <strong>{streak}</strong></p>
      <p>Cœurs restants: <strong>{hearts}</strong></p>
      {badges.length > 0 && (
        <div>
          <h4>Badges débloqués</h4>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>{badges.map((b, i) => <div key={i}>{b.title ?? b.key}</div>)}</div>
        </div>
      )}
      <Celebration />
    </div>
  )
}
