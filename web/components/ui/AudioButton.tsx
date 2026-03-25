"use client"
import React from "react"

interface AudioButtonProps {
  onPlay:   () => void
  size?:    "sm" | "md" | "lg"
  playing?: boolean
}

const SIZES = { sm: "w-9 h-9",   md: "w-12 h-12", lg: "w-20 h-20" }
const ICONS  = { sm: "w-4 h-4",  md: "w-5 h-5",   lg: "w-8 h-8"  }

export const AudioButton: React.FC<AudioButtonProps> = ({ onPlay, size = "md", playing = false }) => (
  <button
    onClick={onPlay}
    className={`
      ${SIZES[size]} rounded-full flex items-center justify-center flex-shrink-0
      text-white transition-all duration-150 border-none cursor-pointer
      ${playing ? "bg-[#0a9fe0] scale-95" : "bg-[#1cb0f6] hover:bg-[#0a9fe0]"}
    `}
    style={!playing ? { boxShadow: '0 4px 0 #0a8fc4' } : {}}
    aria-label="Écouter"
  >
    <svg
      viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth={2} strokeLinecap="round"
      className={ICONS[size]}
    >
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
    </svg>
  </button>
)

export default AudioButton
