"use client"

import React from 'react'

export function ProgressBar(props: { value?: number; total?: number; succeeded?: number }) {
  const { value, total, succeeded } = props as any;
  const pct = typeof value === 'number'
    ? Math.max(0, Math.min(100, value))
    : (typeof total === 'number' && typeof succeeded === 'number')
      ? Math.round((succeeded / Math.max(1, total)) * 100)
      : 0;
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm font-semibold text-gray-700">Progression</div>
        <div className="text-sm font-medium text-gray-600">{pct}%</div>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden shadow-inner" style={{ background: 'rgba(15,23,42,0.06)' }}>
        <div
          className="h-3 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${pct}%`, background: 'linear-gradient(90deg,#06b6d4,#0891b2)' }}
        />
      </div>
    </div>
  )
}

export default ProgressBar
