'use client';

import React from 'react';
import { useAudioCtx } from '@/contexts/AudioContext';

type Size = 'sm' | 'md' | 'lg';

const SIZE: Record<Size, { btn: number; icon: number }> = {
  sm: { btn: 36, icon: 18 },
  md: { btn: 48, icon: 22 },
  lg: { btn: 64, icon: 28 },
};

export default function SpeakerButton({
  text,
  lang = 'ar-MA',
  size = 'md',
  color = '#1cb0f6',
  className,
}: {
  text: string;
  lang?: string;
  size?: Size;
  color?: string;
  className?: string;
  /** @deprecated conservé pour rétro-compat, ne sert plus (fallback navigateur garanti) */
  onMissing?: () => void;
}) {
  const { speak, stop, isPlaying } = useAudioCtx();
  const { btn, icon } = SIZE[size];

  if (!text?.trim()) return null;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isPlaying) {
      stop();
    } else {
      speak(text, lang);
    }
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick(e as unknown as React.MouseEvent);
    }
  };

  // Rendu en <span role="button"> pour permettre l'imbrication dans un autre <button>
  // (les options MCQ contiennent un SpeakerButton → HTML invalide si <button> imbriqué).
  return (
    <span
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={handleKey}
      aria-label="Écouter"
      title="Écouter"
      className={`relative rounded-full inline-flex items-center justify-center transition-all select-none ${className ?? ''}`}
      style={{
        width: btn,
        height: btn,
        background: color,
        opacity: 1,
        cursor: 'pointer',
        boxShadow: `0 4px 0 ${color}99`,
        transform: isPlaying ? 'scale(0.95)' : undefined,
      }}
    >
      {isPlaying ? (
        <svg width={icon} height={icon} viewBox="0 0 24 24" fill="white">
          <rect x="6" y="6" width="12" height="12" rx="2" />
        </svg>
      ) : (
        <svg width={icon} height={icon} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
        </svg>
      )}
    </span>
  );
}
