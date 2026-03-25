"use client"
import React, { useState, useEffect, useRef } from "react"
import { FeedbackBanner } from "@/components/ui"
import type { DarijaLetter } from "./types"

interface DicterRomanisationProps {
  letter:    DarijaLetter
  choices:   string[]        // romanisations proposées (correct + leurres)
  onSuccess: () => void
  onFailed:  () => void
  onSpeak:   (l: DarijaLetter) => void
}

export default function DicterRomanisation({ letter, choices, onSuccess, onFailed, onSpeak }: DicterRomanisationProps) {
  const [selected,    setSelected]    = useState<string | null>(null)
  const [answered,    setAnswered]    = useState(false)
  const [correct,     setCorrect]     = useState<boolean | null>(null)
  const [playing,     setPlaying]     = useState(false)
  const [slowPlay,    setSlowPlay]    = useState(false)
  const [useKeyboard, setUseKeyboard] = useState(false)
  const [inputValue,  setInputValue]  = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  // Reset + auto-play on new letter
  useEffect(() => {
    setSelected(null); setAnswered(false); setCorrect(null)
    setInputValue(""); setUseKeyboard(false)
    const t = setTimeout(() => handlePlay(false), 400)
    return () => clearTimeout(t)
  }, [letter.latin]) // eslint-disable-line react-hooks/exhaustive-deps

  // Focus input when keyboard mode activates
  useEffect(() => {
    if (useKeyboard && inputRef.current) inputRef.current.focus()
  }, [useKeyboard])

  const handlePlay = (slow = false) => {
    if (typeof window === "undefined" || !window.speechSynthesis) return
    window.speechSynthesis.cancel()
    const u = new SpeechSynthesisUtterance(letter.letter)
    u.lang = "ar-MA"
    u.rate = slow ? 0.4 : 0.9
    slow ? setSlowPlay(true) : setPlaying(true)
    u.onend = () => { setPlaying(false); setSlowPlay(false) }
    window.speechSynthesis.speak(u)
  }

  const currentAnswer = useKeyboard ? inputValue.trim() : (selected ?? "")

  const verify = () => {
    if (!currentAnswer || answered) return
    const ok = currentAnswer.toLowerCase() === letter.latin.toLowerCase()
    setAnswered(true)
    setCorrect(ok)
    if (ok) { onSpeak(letter); onSuccess() }
    else    onFailed()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") verify()
  }

  const switchToKeyboard = () => {
    setUseKeyboard(true)
    setSelected(null)
  }

  const switchToTiles = () => {
    setUseKeyboard(false)
    setInputValue("")
  }

  // Tuiles restantes dans la banque
  const bankTiles = choices.filter(c => c !== selected)

  return (
    <div className="flex flex-col gap-5">
      <p className="text-sm font-semibold text-gray-500 text-center">
        Appuie sur ce que tu entends
      </p>

      {/* Boutons audio : normal + lent */}
      <div className="flex items-center justify-center gap-3">
        <button
          onClick={() => handlePlay(false)}
          className={`w-20 h-20 rounded-2xl flex items-center justify-center text-white transition-all ${
            playing ? "bg-[#0a9fe0] scale-95" : "bg-[#1cb0f6] hover:bg-[#0a9fe0]"
          }`}
          style={!playing ? { boxShadow: '0 5px 0 #0a8fc4' } : {}}
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-9 h-9">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>

        <button
          onClick={() => handlePlay(true)}
          className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white transition-all ${
            slowPlay ? "bg-[#0a9fe0] scale-95" : "bg-[#1cb0f6] hover:bg-[#0a9fe0]"
          }`}
          style={!slowPlay ? { boxShadow: '0 4px 0 #0a8fc4' } : {}}
          title="Écouter lentement"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
            <ellipse cx="12" cy="13" rx="6" ry="4" fill="currentColor" opacity="0.9"/>
            <circle cx="12" cy="9" r="3" fill="currentColor"/>
            <path d="M6 13 Q4 15 4 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
            <path d="M18 13 Q20 15 20 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
            <path d="M8 17 Q8 19 9 19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
            <path d="M16 17 Q16 19 15 19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
            <path d="M20 8a3 3 0 0 1 0 4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M22 6a6 6 0 0 1 0 8" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>
      </div>

      {/* ── MODE TUILES ── */}
      {!useKeyboard && (
        <>
          {/* Zone réponse */}
          <div className="min-h-[56px] border-b-2 border-gray-300 flex items-end pb-2 px-2 gap-2 flex-wrap">
            {selected ? (
              <button
                disabled={answered}
                onClick={() => !answered && setSelected(null)}
                className={`px-4 py-2 rounded-xl border-2 font-bold text-base transition-all ${
                  answered
                    ? correct
                      ? "bg-green-100 border-[#58cc02] text-green-800"
                      : "bg-red-100 border-red-400 text-red-800"
                    : "bg-[#ddf4ff] border-[#1cb0f6] text-[#1b3a6b] hover:bg-blue-100"
                }`}
                style={{ boxShadow: answered ? 'none' : '0 3px 0 #0a8fc4' }}
              >
                {selected}
              </button>
            ) : (
              <span className="text-gray-300 text-sm italic">Choisis une réponse…</span>
            )}
          </div>

          {/* Banque de tuiles */}
          <div className="flex flex-wrap gap-2 justify-center min-h-[48px]">
            {bankTiles.map(tile => (
              <button
                key={tile}
                disabled={answered}
                onClick={() => { if (!answered) setSelected(selected === tile ? null : tile) }}
                className="px-4 py-2 bg-white border-2 border-gray-200 rounded-xl font-bold text-base text-gray-800
                  hover:border-[#1cb0f6] hover:bg-[#ddf4ff] transition-all disabled:opacity-50"
                style={{ boxShadow: '0 3px 0 #d1d5db' }}
              >
                {tile}
              </button>
            ))}
          </div>
        </>
      )}

      {/* ── MODE CLAVIER ── */}
      {useKeyboard && (
        <div className="flex flex-col gap-3">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={e => !answered && setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={answered}
            placeholder="Écris ce que tu entends…"
            className={`w-full px-4 py-3 rounded-2xl border-2 font-bold text-base outline-none transition-all ${
              answered
                ? correct
                  ? "border-[#58cc02] bg-green-50 text-green-800"
                  : "border-red-400 bg-red-50 text-red-800"
                : "border-gray-300 focus:border-[#1cb0f6] bg-white text-gray-800"
            }`}
            style={{ boxShadow: answered ? 'none' : '0 3px 0 #d1d5db' }}
          />
        </div>
      )}

      {/* Bouton Vérifier */}
      {!answered && (
        <button
          onClick={verify}
          disabled={!currentAnswer}
          className={`w-full py-4 rounded-2xl font-bold text-base transition-all ${
            currentAnswer
              ? "bg-[#58cc02] hover:bg-[#46a302] text-white"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
          style={currentAnswer ? { boxShadow: '0 4px 0 #46a302' } : {}}
        >
          VÉRIFIER
        </button>
      )}

      {answered && (
        <FeedbackBanner
          type={correct ? "correct" : "incorrect"}
          message={correct ? "Parfait !" : `La bonne réponse était : ${letter.latin}`}
        />
      )}

      {/* ── BARRE BASSE : UTILISER LE CLAVIER / LES TUILES ── */}
      {!answered && (
        <div className="flex items-center justify-center pt-2 border-t border-gray-100">
          {!useKeyboard ? (
            <button
              onClick={switchToKeyboard}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-gray-200 text-gray-500
                font-bold text-sm hover:border-gray-300 hover:text-gray-700 transition-all"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                <rect x="2" y="6" width="20" height="12" rx="2"/>
                <path d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01M8 14h8"/>
              </svg>
              UTILISER LE CLAVIER
            </button>
          ) : (
            <button
              onClick={switchToTiles}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-gray-200 text-gray-500
                font-bold text-sm hover:border-gray-300 hover:text-gray-700 transition-all"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                <rect x="3" y="3" width="7" height="7" rx="1"/>
                <rect x="14" y="3" width="7" height="7" rx="1"/>
                <rect x="3" y="14" width="7" height="7" rx="1"/>
                <rect x="14" y="14" width="7" height="7" rx="1"/>
              </svg>
              UTILISER LES TUILES
            </button>
          )}
        </div>
      )}
    </div>
  )
}
