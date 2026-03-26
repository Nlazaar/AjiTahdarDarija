"use client"
import React, { useState, useEffect } from "react"
import { AudioButton, FeedbackBanner } from "@/components/ui"
import type { DarijaLetter } from "./types"

interface EntendreEtChoisirProps {
  letter:    DarijaLetter
  choices:   DarijaLetter[]
  onSuccess: () => void
  onFailed:  () => void
  onSpeak:   (l: DarijaLetter) => void
}

export default function EntendreEtChoisir({ letter, choices, onSuccess, onFailed, onSpeak }: EntendreEtChoisirProps) {
  const [playing,  setPlaying]  = useState(false)
  const [answered, setAnswered] = useState(false)
  const [selected, setSelected] = useState<string | null>(null)

  useEffect(() => {
    setPlaying(false); setAnswered(false); setSelected(null)
    const t = setTimeout(() => {
      onSpeak(letter)
      setPlaying(true)
      setTimeout(() => setPlaying(false), 800)
    }, 400)
    return () => clearTimeout(t)
  }, [letter.latin]) // eslint-disable-line react-hooks/exhaustive-deps

  const handlePlay = () => {
    setPlaying(true)
    onSpeak(letter)
    setTimeout(() => setPlaying(false), 800)
  }

  const handleChoice = (c: DarijaLetter) => {
    if (answered) return
    setSelected(c.latin)
    setAnswered(true)
    if (c.latin === letter.latin) onSuccess()
    else onFailed()
  }

  const getClass = (c: DarijaLetter) => {
    if (!answered) return "border-gray-200 bg-white hover:border-[#1cb0f6] hover:bg-blue-50"
    if (c.latin === letter.latin) return "border-[#58cc02] bg-green-100"
    if (c.latin === selected)     return "border-red-400 bg-red-100"
    return "border-gray-100 opacity-40"
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <p className="text-sm text-gray-500 font-medium text-center">
        Quelle lettre correspond à ce son ?
      </p>

      <AudioButton onPlay={handlePlay} size="lg" playing={playing} />

      <div className="grid grid-cols-2 gap-3 w-full max-w-xs mt-2">
        {choices.map(c => (
          <button
            key={c.latin}
            disabled={answered}
            onClick={() => handleChoice(c)}
            className={`h-20 flex items-center justify-center text-5xl text-[#1b3a6b] border-2 rounded-2xl transition-all duration-150 ${getClass(c)}`}
            style={{ fontFamily: 'Amiri, serif' }}
          >
            {c.letter}
          </button>
        ))}
      </div>

      {answered && (
        <FeedbackBanner
          type={selected === letter.latin ? "correct" : "incorrect"}
          message={selected === letter.latin
            ? "Bonne réponse !"
            : `C'était ${letter.letter} (${letter.latin})`
          }
        />
      )}
    </div>
  )
}
