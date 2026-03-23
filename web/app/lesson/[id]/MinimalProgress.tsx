import React from 'react'

export default function MinimalProgress({ value = 25 }: { value?: number }) {
  const topWrapper: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    height: 56,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '8px 16px',
    background: 'rgba(255,255,255,0.98)',
    boxShadow: '0 4px 12px rgba(2,6,23,0.06)',
    zIndex: 60,
  }

  const innerStyle: React.CSSProperties = {
    width: '100%',
    maxWidth: 980,
  }

  const trackStyle: React.CSSProperties = {
    width: '100%',
    height: 10,
    borderRadius: 999,
    background: '#f3f4f6',
    overflow: 'hidden',
    border: '1px solid #eef2f3',
  }

  const fillStyle: React.CSSProperties = {
    height: '100%',
    background: '#58CC02',
    width: `${value}%`,
    transition: 'width 300ms ease',
  }

  return (
    <div>
      <div style={topWrapper}>
        <div style={innerStyle}>
          <div style={trackStyle} role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={100}>
            <div style={fillStyle} />
          </div>
        </div>
      </div>
      {/* spacer to avoid content hiding under fixed bar */}
      <div style={{ height: 72 }} />
    </div>
  )
}
