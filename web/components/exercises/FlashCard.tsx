"use client"
import React, { useEffect } from "react"
import { AudioButton, ContinueButton } from "@/components/ui"
import type { DarijaLetter } from "./types"

interface FlashCardProps {
  letter:     DarijaLetter
  onContinue: () => void
  onSpeak:    (l: DarijaLetter) => void
  progress?:  string  // ex. "2 / 4"
}

export default function FlashCard({ letter, onContinue, onSpeak, progress }: FlashCardProps) {
  useEffect(() => {
    const t = setTimeout(() => onSpeak(letter), 500)
    return () => clearTimeout(t)
  }, [letter.latin]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="flex flex-col items-center gap-4" style={{ animation: 'fadeUp 0.3s ease both' }}>
      {/* Badge + progression */}
      <div className="flex items-center gap-2">
        <span className="bg-amber-100 text-amber-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
          Nouvelle lettre
        </span>
        {progress && (
          <span className="text-xs text-gray-400 font-medium">{progress}</span>
        )}
      </div>

      {/* Lettre arabe */}
      <div
        className="text-[96px] leading-none text-center text-[#1b3a6b] my-2"
        style={{ fontFamily: 'Amiri, serif' }}
      >
        {letter.letter}
      </div>

      {/* Bouton son */}
      <AudioButton onPlay={() => onSpeak(letter)} size="lg" />

      {/* Infos */}
      <div className="w-full bg-gray-50 rounded-xl p-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Romanisation</span>
          <span className="font-bold text-gray-800">{letter.latin}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Prononciation FR</span>
          <span className="font-bold text-gray-800">"{letter.fr}"</span>
        </div>
      </div>

      <ContinueButton onClick={onContinue} label="Continuer →" />
    </div>
  )
}
