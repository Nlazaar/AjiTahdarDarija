"use client"
import React, { useState, useEffect } from "react"
import type { DarijaLetter } from "./types"

/** Palette DarijaMaroc — voir project_design_system memory. */
const MC = {
  green:   "#006233",
  red:     "#c1272d",
  gold:    "#d4a84b",
  blue:    "#1e4d8c",
  bg:      "#0f1720",
  card:    "#1a242b",
  border:  "#2a3d47",
  sub:     "#8a9baa",
}

type StarState = "idle" | "selected" | "correct" | "wrong" | "muted"

/** Badge zellige (2 carrés superposés, remplis, sans contour) avec chiffre. */
function StarBadge({ n, state }: { n: number; state: StarState }) {
  const colors: Record<StarState, { fill: string; fillOp: number; text: string }> = {
    idle:     { fill: MC.gold,  fillOp: 0.22, text: MC.gold   },
    selected: { fill: MC.gold,  fillOp: 0.85, text: "#ffffff" },
    correct:  { fill: MC.green, fillOp: 1,    text: "#ffffff" },
    wrong:    { fill: MC.red,   fillOp: 1,    text: "#ffffff" },
    muted:    { fill: MC.gold,  fillOp: 0.08, text: "#4a5d6a" },
  }
  const c = colors[state]
  return (
    <span
      className="relative flex items-center justify-center flex-shrink-0"
      style={{ width: 30, height: 30 }}
      aria-hidden
    >
      <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full" style={{ transition: "all 0.2s" }}>
        <g fill={c.fill} fillOpacity={c.fillOp}>
          <rect x="10" y="10" width="80" height="80" />
          <rect x="10" y="10" width="80" height="80" transform="rotate(45 50 50)" />
        </g>
      </svg>
      <span
        className="relative text-[11px] font-black leading-none"
        style={{ color: c.text, transition: "color 0.2s" }}
      >
        {n}
      </span>
    </span>
  )
}

/** Grand bouton audio Bleu Majorelle — carré arrondi, pulse au play. */
function BigMajorelleAudio({ onPlay, playing }: { onPlay: () => void; playing: boolean }) {
  return (
    <button
      onClick={onPlay}
      aria-label="Écouter"
      className="relative flex items-center justify-center cursor-pointer transition-transform active:scale-95 overflow-hidden"
      style={{
        width: 160, height: 160,
        borderRadius: 32,
        background: MC.blue,
        border: "none",
        boxShadow: playing ? `0 3px 0 #153a6b` : `0 6px 0 #153a6b`,
        transform: playing ? "translateY(3px)" : undefined,
        transition: "all 0.15s",
      }}
    >
      {/* Motif zellige en filigrane */}
      <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full" style={{ opacity: 0.08 }} aria-hidden>
        <g fill="#ffffff">
          <rect x="10" y="10" width="80" height="80" />
          <rect x="10" y="10" width="80" height="80" transform="rotate(45 50 50)" />
        </g>
      </svg>

      {/* Pulse ring quand playing */}
      {playing && (
        <span
          className="absolute inset-0 rounded-[32px] pointer-events-none"
          style={{
            boxShadow: `0 0 0 0 ${MC.blue}aa`,
            animation: "audioPulse 0.8s ease-out",
          }}
        />
      )}

      <svg viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth={2} strokeLinecap="round" className="relative w-16 h-16">
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="#ffffff" />
        <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
        <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
      </svg>

      <style jsx>{`
        @keyframes audioPulse {
          0%   { box-shadow: 0 0 0 0 ${MC.blue}aa; }
          100% { box-shadow: 0 0 0 24px ${MC.blue}00; }
        }
      `}</style>
    </button>
  )
}

interface EntendreEtChoisirProps {
  letter:          DarijaLetter
  choices:         DarijaLetter[]
  onSuccess:       () => void
  onFailed:        (correct?: string) => void
  onSpeak:         (l: DarijaLetter) => void
  onReadyChange?:  (ready: boolean) => void
  shouldValidate?: boolean
  mode?:           'lettre' | 'mot'
  prompt?:         string
}

export default function EntendreEtChoisir({ letter, choices, onSuccess, onFailed, onSpeak, onReadyChange, shouldValidate, mode = 'lettre', prompt }: EntendreEtChoisirProps) {
  const isVocab = mode === 'mot'
  const [playing,  setPlaying]  = useState(false)
  const [answered, setAnswered] = useState(false)
  const [selected, setSelected] = useState<string | null>(null)
  const [state, setState]       = useState<"idle" | "correct" | "incorrect">("idle")

  useEffect(() => {
    setPlaying(false); setAnswered(false); setSelected(null); setState("idle")
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

  // Raccourcis clavier 1..N ; "Space" / "P" pour rejouer l'audio
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!answered) {
        const n = parseInt(e.key, 10)
        if (!Number.isNaN(n) && n >= 1 && n <= choices.length) {
          e.preventDefault()
          handleChoice(choices[n - 1])
          return
        }
      }
      if (e.key === " " || e.key.toLowerCase() === "p") {
        e.preventDefault()
        handlePlay()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [choices, answered]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!shouldValidate || !selected || answered) return
    setAnswered(true)
    if (selected === letter.latin) { setState("correct"); onSuccess() }
    else                           { setState("incorrect"); onFailed(letter.latin) }
  }, [shouldValidate]) // eslint-disable-line react-hooks/exhaustive-deps

  const getStarState = (c: DarijaLetter): StarState => {
    if (!answered) return c.latin === selected ? "selected" : "idle"
    if (c.latin === letter.latin) return "correct"
    if (c.latin === selected)     return "wrong"
    return "muted"
  }

  const getChoiceStyle = (c: DarijaLetter): React.CSSProperties => {
    const base: React.CSSProperties = {
      borderWidth: 2, borderStyle: "solid",
      borderRadius: 20,
      background: MC.card,
      transition: "all 0.15s",
      minHeight: 96,
    }
    if (!answered) {
      if (c.latin === selected) return { ...base, borderColor: MC.gold, background: "#1f2a1e", boxShadow: `0 0 0 4px ${MC.gold}22` }
      return { ...base, borderColor: MC.border }
    }
    if (c.latin === letter.latin) return { ...base, borderColor: MC.green, background: "#0f2419", boxShadow: `0 0 0 4px ${MC.green}33` }
    if (c.latin === selected)     return { ...base, borderColor: MC.red, background: "#2a1416" }
    return { ...base, borderColor: MC.border, opacity: 0.4 }
  }

  return (
    <div className="flex flex-col gap-6 md:gap-8 w-full max-w-3xl mx-auto">
      <p
        className="text-[13px] font-extrabold uppercase tracking-[0.12em] text-center"
        style={{ color: MC.gold }}
      >
        {prompt ?? (isVocab ? 'Quel mot correspond à ce son ?' : 'Quelle lettre correspond à ce son ?')}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-6 md:gap-8 items-center">
        <div className="mx-auto md:mx-0">
          <BigMajorelleAudio onPlay={handlePlay} playing={playing} />
        </div>

        <div className={`flex flex-col gap-3 w-full ${isVocab ? '' : 'md:grid md:grid-cols-2'}`}>
          {choices.map((c, i) => (
            <button
              key={c.latin}
              disabled={answered}
              onClick={() => handleChoice(c)}
              className="relative w-full flex items-center justify-center p-4 cursor-pointer disabled:cursor-default"
              style={{
                ...getChoiceStyle(c),
                ...(c.latin === letter.latin && answered
                  ? { animation: 'matchPop 0.3s ease' }
                  : c.latin === selected && state === "incorrect"
                  ? { animation: 'shakeX 0.35s ease' }
                  : {}),
              }}
              aria-label={`Choix ${i + 1} : ${isVocab ? c.fr : c.letter}`}
            >
              <span className="absolute top-2 left-2">
                <StarBadge n={i + 1} state={getStarState(c)} />
              </span>
              {isVocab ? (
                <div className="flex flex-col items-center gap-1 px-10 text-center" style={{ paddingTop: 4 }}>
                  <span className="text-base font-bold text-white leading-snug break-words">{c.fr}</span>
                </div>
              ) : (
                <span className="text-[48px] leading-none text-white" style={{ fontFamily: 'Amiri, serif' }}>
                  {c.letter}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
