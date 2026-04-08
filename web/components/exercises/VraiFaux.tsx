"use client"
import React, { useState, useEffect } from "react"
import { AudioButton } from "@/components/ui"
import type { DarijaLetter } from "./types"

interface VraiFauxProps {
  letter:          DarijaLetter
  proposed:        string
  isTrue:          boolean
  onSuccess:       () => void
  onFailed:        (correct?: string) => void
  onSpeak:         (l: DarijaLetter) => void
  onReadyChange?:  (ready: boolean) => void
  shouldValidate?: boolean
  mode?:           'lettre' | 'mot'
}

export default function VraiFaux({ letter, proposed, isTrue, onSuccess, onFailed, onSpeak, onReadyChange, shouldValidate, mode = 'lettre' }: VraiFauxProps) {
  const isVocab = mode === 'mot'
  const [answered,      setAnswered]      = useState(false)
  const [correct,       setCorrect]       = useState<boolean | null>(null)
  const [pendingAnswer, setPendingAnswer] = useState<boolean | null>(null)

  useEffect(() => {
    setAnswered(false); setCorrect(null); setPendingAnswer(null)
    onReadyChange?.(false)
  }, [letter.latin]) // eslint-disable-line react-hooks/exhaustive-deps

  const select = (val: boolean) => {
    if (answered) return
    const next = pendingAnswer === val ? null : val
    setPendingAnswer(next)
    onReadyChange?.(next !== null)
  }

  useEffect(() => {
    if (!shouldValidate || pendingAnswer === null || answered) return
    setAnswered(true)
    const ok = pendingAnswer === isTrue
    setCorrect(ok)
    if (ok) onSuccess()
    else onFailed(isTrue ? "VRAI" : "FAUX")
  }, [shouldValidate]) // eslint-disable-line react-hooks/exhaustive-deps

  const cardBg =
    !answered          ? "bg-[#263744] border-[#2a3d47]" :
    correct            ? "bg-[#1e3a2e] border-[#34d399]" :
    "bg-[#3a1e1e] border-red-500"

  const btnClass = (val: boolean) => {
    const isSelected = pendingAnswer === val
    const isAnswered = answered
    if (!isAnswered) {
      if (isSelected) return val
        ? "bg-[#1e3a2e] border-[#58cc02] text-[#58cc02]"
        : "bg-[#3a1e1e] border-red-500 text-red-400"
      return val
        ? "bg-[#1e3a2e]/40 border-[#2a3d47] text-[#58cc02]/70 hover:border-[#58cc02] hover:bg-[#1e3a2e]"
        : "bg-[#3a1e1e]/40 border-[#2a3d47] text-red-400/70 hover:border-red-500 hover:bg-[#3a1e1e]"
    }
    // answered state
    if (val === isTrue) return "bg-[#1e3a2e] border-[#58cc02] text-[#58cc02]"
    if (isSelected && !correct) return "border-red-500 bg-[#3a1e1e] text-red-400"
    return "border-[#2a3d47] opacity-30 text-[#4a5d6a]"
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-[#8a9baa] font-medium text-center">
        Cette association est-elle correcte ?
      </p>

      <div className={`flex flex-col items-center gap-3 p-8 rounded-2xl border-2 transition-all ${cardBg}`}>
        {isVocab ? (
          <div className="flex flex-col items-center gap-1">
            <span className="text-4xl font-black text-white tracking-wide">{letter.latin}</span>
            <span className="text-lg text-[#8a9baa]" style={{ fontFamily: 'Amiri, serif' }}>{letter.letter}</span>
          </div>
        ) : (
          <span className="text-8xl leading-none text-white" style={{ fontFamily: 'Amiri, serif' }}>
            {letter.letter}
          </span>
        )}
        <AudioButton onPlay={() => onSpeak(letter)} size="md" />
        <div className="w-10 h-0.5 bg-[#2a3d47] rounded-full"/>
        <span className="text-2xl font-bold text-white">{proposed}</span>
      </div>

      <div className="flex gap-3">
        <button
          disabled={answered}
          onClick={() => select(true)}
          className={`flex-1 py-4 rounded-2xl font-bold text-base border-2 transition-all ${btnClass(true)}`}
          style={pendingAnswer === true && !answered ? { borderBottom: '4px solid #46a302' } : {}}
        >
          VRAI
        </button>
        <button
          disabled={answered}
          onClick={() => select(false)}
          className={`flex-1 py-4 rounded-2xl font-bold text-base border-2 transition-all ${btnClass(false)}`}
          style={pendingAnswer === false && !answered ? { borderBottom: '4px solid #cc2a2a' } : {}}
        >
          FAUX
        </button>
      </div>
    </div>
  )
}
