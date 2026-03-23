'use client'

import React from 'react'
type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'ghost' }

export function Button({ variant = 'primary', className = '', style, ...props }: Props) {
  const baseCls = `ds-btn ds-surface`;
  const varStyle: React.CSSProperties = variant === 'primary'
    ? { background: 'var(--color-primary)', color: '#fff', border: 'none' }
    : { background: 'transparent', color: 'var(--color-text)', border: '1px solid rgba(15,23,42,0.06)' };

  return <button className={`${baseCls} ${className}`} style={{ ...(varStyle as any), ...(style as any) }} {...props} />
}
