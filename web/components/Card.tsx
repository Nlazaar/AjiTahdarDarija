'use client'

import React from 'react'
export function Card({ children, className = '', style }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  return (
    <div className={`ds-card ${className}`} style={style}>
      {children}
    </div>
  )
}
