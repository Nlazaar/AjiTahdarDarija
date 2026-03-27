"use client"
import React, { useState, useEffect } from "react"
import { AudioButton } from "@/components/ui"
import type { DarijaLetter } from "./types"

interface EntendreEtChoisirProps {
  letter:          DarijaLetter
  choices:         DarijaLetter[]
  onSuccess:       () => void
  onFailed:        (correct?: string) => void
  onSpeak:         (l: DarijaLetter) => void
  onReadyChange?:  (ready: boolean) => void
  shouldValidate?: boolean
}

export default function EntendreEtChoisir({ letter, choices, onSuccess, onFailed, onSpeak, onReadyChange, shouldValidate }: EntendreEtChoisirProps) {
  const [playing,  setPlaying]  = useState(false)
  const [answered, setAnswered] = useState(false)
  const [selected, setSelected] = useState<string | null>(null)

  useEffect(() => {
    setPlaying(false); setAnswered(false); setSelected(null)
    onReadyChange?.(false)
  }, [letter.latin]) // eslint-disable-line react-hooks/exhaustive-deps

  const handlePlay = () => {
    setPlaying(true)
    onSpeak(letter)
    setTimeout(() => setPlaying(false), 800)
  }

  const handleChoice = (c: DarijaLetter) => {
    if (answered) return
    setSelected(c.latin)
    onReadyChange?.(true)
  }

  useEffect(() => {
    if (!shouldValidate || !selected || answered) return
    setAnswered(true)
    if (selected === letter.latin) onSuccess()
    else onFailed(letter.latin)
  }, [shouldValidate]) // eslint-disable-line react-hooks/exhaustive-deps

  const getClass = (c: DarijaLetter) => {
    if (!answered) {
      if (c.latin === selected) return "border-[#1cb0f6] bg-[#1a2e3e]"
      return "border-[#2a3d47] bg-[#263744] hover:border-[#1cb0f6] hover:bg-[#1a2e3e]"
    }
    if (c.latin === letter.latin) return "border-[#58cc02] bg-[#1e3a2e]"
    if (c.latin === selected)     return "border-red-500 bg-[#3a1e1e]"
    return "border-[#2a3d47] opacity-40"
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <p className="text-sm text-[#8a9baa] font-medium text-center whitespace-nowrap">
        Quelle lettre correspond à ce son ?
      </p>

      <AudioButton onPlay={handlePlay} size="lg" playing={playing} />

      <div className="grid grid-cols-2 gap-3 w-full max-w-xs mt-2">
        {choices.map(c => (
          <button
            key={c.latin}
            disabled={answered}
            onClick={() => handleChoice(c)}
            className={`h-20 flex items-center justify-center text-5xl text-white border-2 rounded-2xl transition-all duration-150 ${getClass(c)}`}
            style={{ fontFamily: 'Amiri, serif' }}
          >
            {c.letter}
          </button>
        ))}
      </div>
    </div>
  )
}
