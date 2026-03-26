'use client';

import React from 'react';

// ============================================================
// LOTTIE INTEGRATION GUIDE (when ready):
//
// 1. npm install @lottiefiles/dotlottie-react
// 2. Import: import { DotLottieReact } from '@lottiefiles/dotlottie-react'
// 3. Place your .lottie files in /public/lottie/
//    - /public/lottie/idle.lottie
//    - /public/lottie/happy.lottie
//    - /public/lottie/excited.lottie
//    - /public/lottie/sad.lottie
//    - /public/lottie/celebrating.lottie
// 4. Replace MascotFallback with:
//    <DotLottieReact src={`/lottie/${variant}.lottie`} loop autoplay
//      style={{ width: size, height: size }} />
// ============================================================

export type MascotVariant = 'idle' | 'happy' | 'excited' | 'sad' | 'celebrating';

interface MascotProps {
  variant?: MascotVariant;
  size?: number;
  className?: string;
  style?: React.CSSProperties;
  animate?: boolean;
}

// SVG fallback mascot — a friendly Moroccan-themed parrot
function MascotSVG({ size, variant }: { size: number; variant: MascotVariant }) {
  const COLORS = {
    idle:        { body: '#58cc02', belly: '#89e219', eye: '#1a1a1a', beak: '#f59e0b' },
    happy:       { body: '#58cc02', belly: '#a8e63a', eye: '#1a1a1a', beak: '#f59e0b' },
    excited:     { body: '#46a302', belly: '#58cc02', eye: '#1a1a1a', beak: '#ef4444' },
    sad:         { body: '#9ca3af', belly: '#d1d5db', eye: '#374151', beak: '#6b7280' },
    celebrating: { body: '#7c3aed', belly: '#a78bfa', eye: '#1a1a1a', beak: '#f59e0b' },
  };
  const c = COLORS[variant];
  const s = size;

  return (
    <svg width={s} height={s} viewBox="0 0 100 100" fill="none">
      {/* Body */}
      <ellipse cx="50" cy="60" rx="28" ry="32" fill={c.body} />
      {/* Belly */}
      <ellipse cx="50" cy="65" rx="16" ry="20" fill={c.belly} opacity="0.7" />
      {/* Head */}
      <circle cx="50" cy="32" r="22" fill={c.body} />
      {/* Left wing */}
      <ellipse cx="25" cy="62" rx="10" ry="18" fill={c.body} opacity="0.85" transform="rotate(-15 25 62)" />
      {/* Right wing */}
      <ellipse cx="75" cy="62" rx="10" ry="18" fill={c.body} opacity="0.85" transform="rotate(15 75 62)" />
      {/* Left eye white */}
      <circle cx="41" cy="28" r="8" fill="white" />
      {/* Right eye white */}
      <circle cx="59" cy="28" r="8" fill="white" />
      {/* Left pupil */}
      <circle cx={variant === 'sad' ? 40 : 42} cy={variant === 'sad' ? 30 : 28} r="4" fill={c.eye} />
      {/* Right pupil */}
      <circle cx={variant === 'sad' ? 58 : 60} cy={variant === 'sad' ? 30 : 28} r="4" fill={c.eye} />
      {/* Eye shine */}
      <circle cx="43" cy="26" r="1.5" fill="white" />
      <circle cx="61" cy="26" r="1.5" fill="white" />
      {/* Beak */}
      <path d="M44 38 Q50 44 56 38 Q50 42 44 38Z" fill={c.beak} />
      {/* Tail feathers */}
      <path d="M38 88 Q45 95 50 90 Q55 95 62 88" stroke={c.body} strokeWidth="5" strokeLinecap="round" fill="none" />
      {/* Happy expression - cheek blush */}
      {(variant === 'happy' || variant === 'celebrating') && (
        <>
          <circle cx="35" cy="34" r="5" fill="#ff9999" opacity="0.4" />
          <circle cx="65" cy="34" r="5" fill="#ff9999" opacity="0.4" />
        </>
      )}
      {/* Excited - sparkles */}
      {variant === 'excited' && (
        <>
          <text x="12" y="20" fontSize="14" textAnchor="middle">✨</text>
          <text x="88" y="20" fontSize="14" textAnchor="middle">✨</text>
        </>
      )}
    </svg>
  );
}

export function Mascot({
  variant = 'idle',
  size = 80,
  className = '',
  style = {},
  animate = true,
}: MascotProps) {
  return (
    <div
      data-lottie-variant={variant}
      data-lottie-ready="true"
      className={`${animate ? 'animate-mascot' : ''} ${className}`}
      style={{
        width: size,
        height: size,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        ...style,
      }}
    >
      {/* LOTTIE PLACEHOLDER — Replace with DotLottieReact when ready */}
      <MascotSVG size={size} variant={variant} />
    </div>
  );
}
