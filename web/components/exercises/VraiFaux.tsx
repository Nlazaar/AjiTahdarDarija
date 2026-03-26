"use client"
import React, { useState, useEffect } from "react"
import { AudioButton, FeedbackBanner } from "@/components/ui"
import type { DarijaLetter } from "./types"

interface VraiFauxProps {
  letter:    DarijaLetter
  proposed:  string
  isTrue:    boolean
  onSuccess: () => void
  onFailed:  () => void
  onSpeak:   (l: DarijaLetter) => void
}

export default function VraiFaux({ letter, proposed, isTrue, onSuccess, onFailed, onSpeak }: VraiFauxProps) {
  const [answered, setAnswered] = useState(false)
  const [correct,  setCorrect]  = useState<boolean | null>(null)

  useEffect(() => {
    setAnswered(false); setCorrect(null)
  }, [letter.latin])

  const answer = (userSaysTrue: boolean) => {
    if (answered) return
    setAnswered(true)
    const ok = userSaysTrue === isTrue
    setCorrect(ok)
    if (ok) onSuccess()
    else    onFailed()
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-gray-500 font-medium text-center">
        Cette association est-elle correcte ?
      </p>

      {/* Carte centrale */}
      <div className={`flex flex-col items-center gap-3 p-8 rounded-2xl border-2 transition-all ${
        !answered          ? "bg-gray-50 border-gray-200" :
        correct            ? "bg-green-50 border-green-400" :
        "bg-red-50 border-red-400"
      }`}>
        <span className="text-8xl leading-none text-[#1b3a6b]" style={{ fontFamily: 'Amiri, serif' }}>
          {letter.letter}
        </span>
        <AudioButton onPlay={() => onSpeak(letter)} size="md" />
        <div className="w-10 h-0.5 bg-gray-200 rounded-full"/>
        <span className="text-2xl font-bold text-gray-700">{proposed}</span>
      </div>

      {/* Boutons VRAI / FAUX */}
      {!answered && (
        <div className="flex gap-3">
          <button
            onClick={() => answer(true)}
            className="flex-1 py-4 rounded-2xl font-bold text-base text-white bg-[#58cc02] hover:bg-[#46a302] active:translate-y-0.5 transition-all"
            style={{ borderBottom: '4px solid #46a302' }}
          >
            VRAI
          </button>
          <button
            onClick={() => answer(false)}
            className="flex-1 py-4 rounded-2xl font-bold text-base text-white bg-[#ff4b4b] hover:bg-[#cc2a2a] active:translate-y-0.5 transition-all"
            style={{ borderBottom: '4px solid #cc2a2a' }}
          >
            FAUX
          </button>
        </div>
      )}

      {answered && (
        <FeedbackBanner
          type={correct ? "correct" : "incorrect"}
          message={correct
            ? "Bonne réponse !"
            : `Faux — ${letter.letter} = ${letter.latin}`
          }
        />
      )}
    </div>
  )
}
