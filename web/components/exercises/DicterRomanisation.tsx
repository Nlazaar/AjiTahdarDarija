"use client"
import React, { useState, useEffect, useRef } from "react"
import { useAudioCtx } from "@/contexts/AudioContext"
import type { DarijaLetter } from "./types"

/** Palette DarijaMaroc — voir project_design_system memory. */
const MC = {
  green:  "#006233",
  red:    "#c1272d",
  gold:   "#d4a84b",
  blue:   "#1e4d8c",
  bg:     "#0f1720",
  card:   "#1a242b",
  border: "#2a3d47",
  sub:    "#8a9baa",
}

interface DicterRomanisationProps {
  letter:          DarijaLetter
  choices:         string[]
  onSuccess:       () => void
  onFailed:        () => void
  onSpeak:         (l: DarijaLetter) => void
  onReadyChange?:  (ready: boolean) => void
  shouldValidate?: boolean
  prompt?:         string
}

/** Bouton audio carré Majorelle, avec motif zellige en filigrane et pulse au play. */
function MajorelleAudio({
  onPlay, playing, size = 80, slow = false,
}: { onPlay: () => void; playing: boolean; size?: number; slow?: boolean }) {
  const icon = size >= 70 ? 36 : 24
  return (
    <button
      onClick={onPlay}
      aria-label={slow ? "Écouter lentement" : "Écouter"}
      className="relative flex items-center justify-center cursor-pointer transition-transform active:scale-95 overflow-hidden"
      style={{
        width: size, height: size,
        borderRadius: size >= 70 ? 24 : 18,
        background: MC.blue,
        border: "none",
        boxShadow: playing ? `0 3px 0 #153a6b` : `0 ${size >= 70 ? 6 : 4}px 0 #153a6b`,
        transform: playing ? "translateY(2px)" : undefined,
        transition: "all 0.15s",
      }}
    >
      <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full" style={{ opacity: 0.08 }} aria-hidden>
        <g fill="#ffffff">
          <rect x="10" y="10" width="80" height="80" />
          <rect x="10" y="10" width="80" height="80" transform="rotate(45 50 50)" />
        </g>
      </svg>

      {slow ? (
        /* Icône "tortue" pour la lecture lente */
        <svg viewBox="0 0 24 24" fill="#ffffff" stroke="#ffffff" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" style={{ width: icon, height: icon }}>
          <ellipse cx="12" cy="13" rx="6" ry="4" />
          <circle cx="12" cy="9" r="3" />
          <path d="M6 13 Q4 15 4 17" fill="none" />
          <path d="M18 13 Q20 15 20 17" fill="none" />
          <path d="M8 17 Q8 19 9 19" fill="none" />
          <path d="M16 17 Q16 19 15 19" fill="none" />
          <path d="M20 8a3 3 0 0 1 0 4" fill="none" />
          <path d="M22 6a6 6 0 0 1 0 8" fill="none" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth={2} strokeLinecap="round" style={{ width: icon, height: icon }}>
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="#ffffff" />
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
        </svg>
      )}
    </button>
  )
}

export default function DicterRomanisation({ letter, choices, onSuccess, onFailed, onSpeak, onReadyChange, shouldValidate, prompt }: DicterRomanisationProps) {
  const { speak, stop, isPlaying } = useAudioCtx()
  const [selected,    setSelected]    = useState<string | null>(null)
  const [answered,    setAnswered]    = useState(false)
  const [correct,     setCorrect]     = useState<boolean | null>(null)
  const [slowPlay,    setSlowPlay]    = useState(false)
  const [useKeyboard, setUseKeyboard] = useState(false)
  const [inputValue,  setInputValue]  = useState("")
  const inputRef = useRef<HTMLInputElement>(null)
  const playingNormal = isPlaying && !slowPlay
  const playingSlow   = isPlaying && slowPlay

  useEffect(() => {
    setSelected(null); setAnswered(false); setCorrect(null)
    setInputValue(""); setUseKeyboard(false)
    onReadyChange?.(false)
    const t = setTimeout(() => handlePlay(false), 400)
    return () => clearTimeout(t)
  }, [letter.latin]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (useKeyboard && inputRef.current) inputRef.current.focus()
  }, [useKeyboard])

  useEffect(() => {
    onReadyChange?.(!!currentAnswer)
  }, [selected, inputValue]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!shouldValidate || !currentAnswer || answered) return
    verify()
  }, [shouldValidate]) // eslint-disable-line react-hooks/exhaustive-deps

  const handlePlay = (slow = false) => {
    stop()
    setSlowPlay(slow)
    speak(letter.letter, "ar-MA")
    if (slow) setTimeout(() => setSlowPlay(false), 1800)
  }

  const currentAnswer = useKeyboard ? inputValue.trim() : (selected ?? "")

  const verify = () => {
    if (!currentAnswer || answered) return
    const ok = currentAnswer.toLowerCase() === letter.latin.toLowerCase()
    setAnswered(true)
    setCorrect(ok)
    if (ok) onSuccess()
    else    onFailed()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") verify()
  }

  const switchToKeyboard = () => { setUseKeyboard(true);  setSelected(null) }
  const switchToTiles    = () => { setUseKeyboard(false); setInputValue("") }

  const bankTiles = choices.filter(c => c !== selected)

  // Style de la tuile sélectionnée (dans la zone de réponse)
  const selectedTileStyle: React.CSSProperties = (() => {
    const base: React.CSSProperties = {
      padding: '10px 16px',
      borderRadius: 14,
      borderWidth: 2,
      borderStyle: 'solid',
      fontWeight: 900,
      fontSize: 16,
      transition: 'all 0.15s',
      cursor: answered ? 'default' : 'pointer',
    }
    if (!answered) {
      return { ...base, background: '#1f2a1e', borderColor: MC.gold, color: '#ffffff', boxShadow: `0 3px 0 ${MC.gold}55` }
    }
    if (correct) return { ...base, background: '#0f2419', borderColor: MC.green, color: '#ffffff', boxShadow: `0 0 0 4px ${MC.green}33` }
    return           { ...base, background: '#2a1416', borderColor: MC.red,   color: '#ffffff', boxShadow: `0 4px 0 #7a1a1c` }
  })()

  const inputStyle: React.CSSProperties = (() => {
    const base: React.CSSProperties = {
      width: '100%',
      padding: '14px 18px',
      borderRadius: 18,
      borderWidth: 2,
      borderStyle: 'solid',
      fontWeight: 700,
      fontSize: 16,
      outline: 'none',
      transition: 'all 0.15s',
      background: MC.card,
      color: '#ffffff',
    }
    if (!answered) return { ...base, borderColor: `${MC.gold}55`, boxShadow: `0 3px 0 #1a2830` }
    if (correct)   return { ...base, borderColor: MC.green, background: '#0f2419', boxShadow: `0 0 0 4px ${MC.green}33` }
    return               { ...base, borderColor: MC.red,   background: '#2a1416', boxShadow: `0 4px 0 #7a1a1c` }
  })()

  const bankTileStyle: React.CSSProperties = {
    padding: '10px 16px',
    borderRadius: 14,
    borderWidth: 2,
    borderStyle: 'solid',
    borderColor: `${MC.gold}55`,
    background: MC.card,
    color: '#ffffff',
    fontWeight: 800,
    fontSize: 16,
    cursor: 'pointer',
    transition: 'all 0.15s',
    boxShadow: `0 3px 0 #1a2830`,
  }

  const toggleBtnStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '8px 14px',
    borderRadius: 14,
    borderWidth: 2,
    borderStyle: 'solid',
    borderColor: `${MC.gold}55`,
    background: 'transparent',
    color: MC.sub,
    fontWeight: 800,
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    cursor: 'pointer',
    transition: 'all 0.15s',
  }

  return (
    <div className="flex flex-col gap-5 w-full max-w-xl mx-auto">
      <p
        className="text-[13px] font-extrabold uppercase text-center"
        style={{ color: MC.gold, letterSpacing: '0.12em' }}
      >
        {prompt ?? 'Appuie sur ce que tu entends'}
      </p>

      {/* Boutons audio Majorelle : normal + lent */}
      <div className="flex items-center justify-center gap-3">
        <MajorelleAudio onPlay={() => handlePlay(false)} playing={playingNormal} size={80} />
        <MajorelleAudio onPlay={() => handlePlay(true)}  playing={playingSlow}   size={56} slow />
      </div>

      {/* ── MODE TUILES ── */}
      {!useKeyboard && (
        <>
          {/* Zone réponse — ligne pointillée or, puise dans la banque */}
          <div
            className="min-h-[64px] flex items-center px-3 gap-2 flex-wrap"
            style={{
              borderBottom: `2px dashed ${MC.gold}55`,
              paddingBottom: 10,
            }}
          >
            {selected ? (
              <button
                disabled={answered}
                onClick={() => !answered && setSelected(null)}
                style={selectedTileStyle}
                className={answered && !correct ? "animate-shake-x" : ""}
              >
                {selected}
              </button>
            ) : (
              <span className="text-sm italic" style={{ color: MC.sub }}>
                Choisis une réponse…
              </span>
            )}
          </div>

          {/* Banque de tuiles */}
          <div className="flex flex-wrap gap-2 justify-center min-h-[48px]">
            {bankTiles.map(tile => (
              <button
                key={tile}
                disabled={answered}
                onClick={() => { if (!answered) setSelected(selected === tile ? null : tile) }}
                style={bankTileStyle}
                onMouseEnter={(e) => { if (!answered) e.currentTarget.style.borderColor = MC.gold }}
                onMouseLeave={(e) => { if (!answered) e.currentTarget.style.borderColor = `${MC.gold}55` }}
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
            style={inputStyle}
          />
        </div>
      )}

      {/* ── BARRE BASSE : TUILES ⇄ CLAVIER ── */}
      {!answered && (
        <div className="flex items-center justify-center pt-2" style={{ borderTop: `1px solid ${MC.border}` }}>
          {!useKeyboard ? (
            <button onClick={switchToKeyboard} style={toggleBtnStyle}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                <rect x="2" y="6" width="20" height="12" rx="2"/>
                <path d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01M8 14h8"/>
              </svg>
              Utiliser le clavier
            </button>
          ) : (
            <button onClick={switchToTiles} style={toggleBtnStyle}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                <rect x="3" y="3" width="7" height="7" rx="1"/>
                <rect x="14" y="3" width="7" height="7" rx="1"/>
                <rect x="3" y="14" width="7" height="7" rx="1"/>
                <rect x="14" y="14" width="7" height="7" rx="1"/>
              </svg>
              Utiliser les tuiles
            </button>
          )}
        </div>
      )}
    </div>
  )
}
