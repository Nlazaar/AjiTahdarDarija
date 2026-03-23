"use client"
import React from "react"

interface AudioButtonProps {
  onPlay: () => void
  size?: "sm" | "md" | "lg"
  playing?: boolean
}

const SIZES = {
  sm: "w-9 h-9 text-sm",
  md: "w-12 h-12 text-base",
  lg: "w-20 h-20 text-3xl",
}

export const AudioButton: React.FC<AudioButtonProps> = ({
  onPlay, size = "md", playing = false
}) => (
  <button
    onClick={onPlay}
    className={`
      ${SIZES[size]}
      rounded-full flex items-center justify-center flex-shrink-0
      border-none cursor-pointer transition-all duration-150
      ${playing
        ? "bg-green-700 scale-95"
        : "bg-green-500 hover:bg-green-600 shadow-[0_3px_0_#16a34a]"
      }
      text-white
    `}
    aria-label="Écouter"
  >
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth={2} strokeLinecap="round"
      className="w-1/2 h-1/2">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
    </svg>
  </button>
)
