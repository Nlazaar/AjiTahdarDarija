'use client'

import React from 'react'

export function IconRounded({ children, size = 40, style }: { children: React.ReactNode; size?: number; style?: React.CSSProperties }) {
  return (
    <div className="icon-rounded" style={{ width: size, height: size, borderRadius: '12px', ...style }}>
      {children}
    </div>
  )
}
