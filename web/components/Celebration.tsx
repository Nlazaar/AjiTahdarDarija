import React from 'react'

export default function Celebration() {
  return (
    <div style={{ position: 'relative', width: '100%', height: 0 }}>
      <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', marginTop: -40 }}>
        <div style={{ fontSize: 40, animation: 'confetti 800ms ease-out' }}>🎉🎉🎉</div>
      </div>
      <style>{`
        @keyframes confetti { 0% { transform: translateY(-20px) scale(0.7) } 100% { transform: translateY(0) scale(1) } }
      `}</style>
    </div>
  )
}
