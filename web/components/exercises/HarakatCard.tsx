"use client"
import React, { useState } from "react"
import { ContinueButton } from "@/components/ui"
import type { AlphabetLetter, Haraka } from "./types"

interface HarakatCardProps {
  letter:     AlphabetLetter
  onContinue: () => void
  onSpeak:    (text: string) => void
  progress?:  string
}

const HARAKA_COLORS: Record<string, { bg: string; border: string; text: string; glow: string }> = {
  Fatha: { bg: '#1a3328', border: '#34d399', text: '#6ee7b7', glow: 'rgba(52,211,153,0.15)' },
  Kasra: { bg: '#1a2840', border: '#60a5fa', text: '#93c5fd', glow: 'rgba(96,165,250,0.15)' },
  Damma: { bg: '#2a1a38', border: '#c084fc', text: '#d8b4fe', glow: 'rgba(192,132,252,0.15)' },
}

function HarakaButton({ haraka, baseLetter, onSpeak }: {
  haraka: Haraka; baseLetter: string; onSpeak: (text: string) => void
}) {
  const [playing, setPlaying] = useState(false)
  const colors = HARAKA_COLORS[haraka.label] ?? HARAKA_COLORS.Fatha

  const handlePlay = () => {
    setPlaying(true)
    onSpeak(haraka.ttsText)
    setTimeout(() => setPlaying(false), 2500)
  }

  return (
    <button
      onClick={handlePlay}
      className="w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-200 active:scale-[0.97]"
      style={{
        background: playing ? colors.glow : '#1e2d35',
        border: `2px solid ${playing ? colors.border : '#2a3d47'}`,
        boxShadow: playing ? `0 0 20px ${colors.glow}` : '0 3px 0 #1a2830',
      }}
    >
      {/* Letter with haraka */}
      <div className="w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: colors.bg, border: `1.5px solid ${colors.border}40` }}>
        <span className="text-[36px] leading-none text-white" style={{ fontFamily: 'Amiri, serif' }}>
          {haraka.letter}
        </span>
      </div>

      {/* Info */}
      <div className="flex-1 text-left min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-[15px] font-black" style={{ color: colors.text }}>
            {haraka.label}
          </span>
          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full"
            style={{ background: `${colors.border}20`, color: colors.text }}>
            {haraka.symbol}
          </span>
        </div>
        <div className="text-[13px] font-bold text-white mt-0.5">
          Son : &laquo; {haraka.sound} &raquo;
        </div>
        <div className="text-[11px] font-medium text-[#6b7f8a] mt-0.5">
          {haraka.desc}
        </div>
      </div>

      {/* Play icon */}
      <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all"
        style={{
          background: playing ? colors.border : '#243b4a',
          boxShadow: playing ? `0 3px 0 ${colors.border}80` : '0 3px 0 #1a2830',
        }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
          <path d="M11 5L6 9H2v6h4l5 4V5zM15.54 8.46a5 5 0 010 7.07" stroke="white" fill="none" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </div>
    </button>
  )
}

export default function HarakatCard({ letter, onContinue, onSpeak, progress }: HarakatCardProps) {
  return (
    <div className="flex flex-col items-center gap-4" style={{ animation: 'fadeUp 0.3s ease both' }}>
      {/* Header badge */}
      <div className="flex items-center gap-2">
        <span className="bg-[#1cb0f6]/20 text-[#1cb0f6] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
          Les voyelles
        </span>
        {progress && (
          <span className="text-xs text-[#6b7f8a] font-medium">{progress}</span>
        )}
      </div>

      {/* Main letter */}
      <div className="flex flex-col items-center gap-1">
        <div className="text-[72px] leading-none text-white" style={{ fontFamily: 'Amiri, serif' }}>
          {letter.letter}
        </div>
        <div className="text-[14px] font-black text-[#8a9baa]">
          {letter.name}
        </div>
      </div>

      {/* Explanation */}
      <div className="w-full rounded-xl p-3 text-center" style={{ background: '#243b4a', border: '1px solid #2a3d47' }}>
        <p className="text-[13px] font-medium text-[#8a9baa]">
          En arabe, les <span className="text-[#1cb0f6] font-bold">voyelles courtes</span> changent le son de la lettre.
          Touche chaque voyelle pour écouter.
        </p>
      </div>

      {/* Harakat buttons */}
      <div className="w-full flex flex-col gap-2">
        {letter.harakat.map((h) => (
          <HarakaButton key={h.label} haraka={h} baseLetter={letter.letter} onSpeak={onSpeak} />
        ))}
      </div>

      <ContinueButton onClick={onContinue} label="Continuer" />
    </div>
  )
}
