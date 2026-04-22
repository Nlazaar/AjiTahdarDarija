"use client"
import React, { useState, useEffect } from "react"
import type { DarijaLetter } from "./types"

/**
 * Palette DarijaMaroc — identité marocaine :
 * - Vert drapeau (#006233) : sélection, réponse correcte
 * - Rouge grenat (#c1272d) : erreur, drapeau
 * - Or / ocre zellige (#d4a84b) : accent, badges idle
 * - Bleu Majorelle (#1e4d8c) : audio (Jardin Majorelle)
 */
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

interface ChoixLettreProps {
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

type State = "idle" | "correct" | "incorrect"
type StarState = "idle" | "selected" | "correct" | "wrong" | "muted"

/**
 * Badge étoile à 8 branches (Khatem Sulayman / étoile marocaine).
 * Construite à partir de 2 carrés superposés à 45° — motif islamique/zellige classique.
 */
function StarBadge({ n, state }: { n: number; state: StarState }) {
  // Même motif que le filigrane zellige de la carte : 2 carrés remplis superposés,
  // pas de contour, juste des nuances d'opacité selon l'état.
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
      style={{ width: 34, height: 34 }}
      aria-hidden
    >
      <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full" style={{ transition: "all 0.2s" }}>
        <g fill={c.fill} fillOpacity={c.fillOp}>
          <rect x="10" y="10" width="80" height="80" />
          <rect x="10" y="10" width="80" height="80" transform="rotate(45 50 50)" />
        </g>
      </svg>
      <span
        className="relative text-[12px] font-black leading-none"
        style={{ color: c.text, transition: "color 0.2s" }}
      >
        {n}
      </span>
    </span>
  )
}

/** Bouton audio Bleu Majorelle — notre touche Maroc sur l'audio. */
function MajorelleAudio({ onPlay }: { onPlay: () => void }) {
  return (
    <button
      onClick={onPlay}
      aria-label="Écouter"
      className="w-10 h-10 rounded-full flex items-center justify-center text-white border-none cursor-pointer transition-transform active:scale-95"
      style={{
        background: MC.blue,
        boxShadow: `0 3px 0 #153a6b`,
      }}
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" className="w-4 h-4">
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
        <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
        <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
      </svg>
    </button>
  )
}

export default function ChoixLettre({ letter, choices, onSuccess, onFailed, onSpeak, onReadyChange, shouldValidate, mode = 'lettre', prompt }: ChoixLettreProps) {
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
    if (answered) return
    const onKey = (e: KeyboardEvent) => {
      const n = parseInt(e.key, 10)
      if (!Number.isNaN(n) && n >= 1 && n <= choices.length) {
        e.preventDefault()
        handleChoice(choices[n - 1])
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [choices, answered]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!shouldValidate || !selected || answered) return
    setAnswered(true)
    if (selected === letter.latin) {
      setState("correct")
      onSuccess()
    } else {
      setState("incorrect")
      onFailed(letter.latin)
    }
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
      padding: "14px 18px",
      background: MC.card,
      transition: "all 0.15s",
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
      {/* Bandeau question — Or ocre pour se démarquer */}
      <p
        className="text-[13px] font-extrabold uppercase tracking-[0.12em] text-center"
        style={{ color: MC.gold }}
      >
        {prompt ?? (isVocab ? 'Que signifie ce mot ?' : 'Comment se prononce cette lettre ?')}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-5 md:gap-8 items-center">
        {/* Carte lettre — bordure or, motif zellige subtil en arrière-plan */}
        <div
          className="relative mx-auto md:mx-0 flex items-center justify-center overflow-hidden"
          style={{
            width: 220, height: 220,
            borderRadius: 28,
            border: `2px solid ${MC.gold}55`,
            background: `radial-gradient(circle at 30% 20%, ${MC.gold}08, ${MC.bg} 65%)`,
          }}
        >
          {/* Motif zellige en filigrane (étoile 8 branches géante) */}
          <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full" style={{ opacity: 0.05 }} aria-hidden>
            <g fill={MC.gold}>
              <rect x="10" y="10" width="80" height="80" />
              <rect x="10" y="10" width="80" height="80" transform="rotate(45 50 50)" />
            </g>
          </svg>

          <div className="absolute top-3 right-3 z-10">
            <MajorelleAudio onPlay={() => onSpeak(letter)} />
          </div>

          {isVocab ? (
            <div className="relative z-[5] flex flex-col items-center gap-2 px-4 text-center">
              <span className="text-5xl leading-none text-white" style={{ fontFamily: 'Amiri, serif' }}>{letter.letter}</span>
              <span className="text-base font-bold tracking-wide" style={{ color: MC.sub }}>{letter.latin}</span>
            </div>
          ) : (
            <span className="relative z-[5] text-[96px] leading-none text-white" style={{ fontFamily: 'Amiri, serif' }}>
              {letter.letter}
            </span>
          )}
        </div>

        {/* Liste des choix avec étoile marocaine à la place du badge carré */}
        <div className="flex flex-col gap-3">
          {choices.map((c, i) => (
            <button
              key={c.latin}
              disabled={answered}
              onClick={() => handleChoice(c)}
              className="w-full flex items-center gap-4 cursor-pointer disabled:cursor-default"
              style={{
                ...getChoiceStyle(c),
                ...(c.latin === letter.latin && answered
                  ? { animation: 'matchPop 0.3s ease' }
                  : c.latin === selected && state === "incorrect"
                  ? { animation: 'shakeX 0.35s ease' }
                  : {}),
              }}
              aria-label={`Choix ${i + 1} : ${isVocab ? c.fr : c.latin}`}
            >
              <StarBadge n={i + 1} state={getStarState(c)} />
              <span className="flex-1 text-center text-base font-bold text-white tracking-wide">
                {isVocab ? c.fr : c.latin}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
