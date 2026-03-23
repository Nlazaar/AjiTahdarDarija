'use client'

import React from 'react'
import { IconRounded } from './IconRounded'

export default function BadgeCard({ badge }: { badge: any }) {
  return (
    <div className={`p-2 bg-white rounded shadow w-32 flex flex-col items-center ${badge.unlocked ? '' : 'opacity-60'}`}>
      <IconRounded size={48} style={{ backgroundColor: '#f3f4f6' }}>
        {badge.icon ? <img src={badge.icon} alt={badge.name} className="w-full h-full object-cover" /> : <div />}
      </IconRounded>
      <div className="mt-2 text-sm font-medium text-center">{badge.name}</div>
      <div className="text-xs text-slate-500">{badge.unlocked ? 'Débloqué' : 'Bloqué'}</div>
    </div>
  )
}
