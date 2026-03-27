"use client"
import React from "react"
import { AudioButton, ContinueButton } from "@/components/ui"
import type { DarijaLetter } from "./types"

interface FlashCardProps {
  letter:     DarijaLetter
  onContinue: () => void
  onSpeak:    (l: DarijaLetter) => void
  progress?:  string
}

export default function FlashCard({ letter, onContinue, onSpeak, progress }: FlashCardProps) {

  return (
    <div className="flex flex-col items-center gap-4" style={{ animation: 'fadeUp 0.3s ease both' }}>
      <div className="flex items-center gap-2">
        <span className="bg-amber-500/20 text-amber-400 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
          Nouvelle lettre
        </span>
        {progress && (
          <span className="text-xs text-[#6b7f8a] font-medium">{progress}</span>
        )}
      </div>

      <div
        className="text-[96px] leading-none text-center text-white my-2"
        style={{ fontFamily: 'Amiri, serif' }}
      >
        {letter.letter}
      </div>

      <AudioButton onPlay={() => onSpeak(letter)} size="lg" />

      <div className="w-full bg-[#263744] rounded-xl p-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-[#8a9baa]">Romanisation</span>
          <span className="font-bold text-white">{letter.latin}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-[#8a9baa]">Prononciation FR</span>
          <span className="font-bold text-white">"{letter.fr}"</span>
        </div>
      </div>

      <ContinueButton onClick={onContinue} label="Continuer →" />
    </div>
  )
}
