"use client"
import React, { useState, useEffect } from "react"
import { AudioButton } from "@/components/ui"
import type { DarijaLetter } from "./types"

interface ChoixLettreProps {
  letter:          DarijaLetter
  choices:         DarijaLetter[]
  onSuccess:       () => void
  onFailed:        (correct?: string) => void
  onSpeak:         (l: DarijaLetter) => void
  onReadyChange?:  (ready: boolean) => void
  shouldValidate?: boolean
  mode?:           'lettre' | 'mot'
}

type State = "idle" | "correct" | "incorrect"

export default function ChoixLettre({ letter, choices, onSuccess, onFailed, onSpeak, onReadyChange, shouldValidate, mode = 'lettre' }: ChoixLettreProps) {
  const isVocab = mode === 'mot'
  const [state,    setState]    = useState<State>("idle")
  const [selected, setSelected] = useState<string | null>(null)
  const [answered, setAnswered] = useState(false)

  useEffect(() => {
    setState("idle"); setSelected(null); setAnswered(false)
    onReadyChange?.(false)
  }, [letter.latin]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleChoice = (choice: DarijaLetter) => {
    if (answered) return
    setSelected(choice.latin)
    onReadyChange?.(true)
  }

  useEffect(() => {
    if (!shouldValidate || !selected || answered) return
    setAnswered(true)
    if (selected === letter.latin) {
      setState("correct")
      onSpeak(letter)
      onSuccess()
    } else {
      setState("incorrect")
      onFailed(letter.latin)
    }
  }, [shouldValidate]) // eslint-disable-line react-hooks/exhaustive-deps

  const getClass = (c: DarijaLetter) => {
    if (!answered) {
      if (c.latin === selected) return "border-[#1cb0f6] bg-[#1a2e3e]"
      return "border-[#2a3d47] bg-[#263744] hover:border-[#58cc02] hover:bg-[#1e3a2e]"
    }
    if (c.latin === letter.latin) return "border-[#58cc02] bg-[#1e3a2e]"
    if (c.latin === selected)     return "border-red-500 bg-[#3a1e1e]"
    return "border-[#2a3d47] opacity-40"
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-[#8a9baa] font-medium text-center">
        Comment se prononce cette lettre ?
      </p>

      <div className="flex items-center justify-center gap-6 bg-[#1e3a2e] border-2 border-[#34d399]/30 rounded-2xl px-8 py-5 mx-auto w-fit">
        {isVocab ? (
          <div className="flex flex-col items-center gap-1">
            <span className="text-4xl font-black text-white tracking-wide">{letter.latin}</span>
            <span className="text-base text-[#8a9baa]" style={{ fontFamily: 'Amiri, serif' }}>{letter.letter}</span>
          </div>
        ) : (
          <span className="text-7xl leading-none text-white" style={{ fontFamily: 'Amiri, serif' }}>
            {letter.letter}
          </span>
        )}
        <AudioButton onPlay={() => onSpeak(letter)} size="md" />
      </div>

      <div className="flex flex-col gap-2">
        {choices.map(c => (
          <button
            key={c.latin}
            disabled={answered}
            onClick={() => handleChoice(c)}
            className={`w-full flex items-center gap-4 p-4 border-2 rounded-2xl transition-all duration-150 ${getClass(c)}`}
            style={
              c.latin === letter.latin && answered
                ? { animation: 'matchPop 0.3s ease' }
                : c.latin === selected && state === "incorrect"
                ? { animation: 'shakeX 0.35s ease' }
                : {}
            }
          >
            <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 ${
              !answered                ? (c.latin === selected ? "border-[#1cb0f6] bg-[#1cb0f6]" : "border-[#4a5d6a]") :
              c.latin===letter.latin   ? "border-[#58cc02] bg-[#58cc02]" :
              c.latin===selected       ? "border-red-500 bg-red-500" :
              "border-[#4a5d6a]"
            }`}/>
            {isVocab ? (
              <span className="text-base font-bold text-white">{c.fr}</span>
            ) : (
              <>
                <span className="text-base font-bold text-white">{c.latin}</span>
                <span className="text-xs text-[#6b7f8a] ml-auto">{c.fr}</span>
              </>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}
