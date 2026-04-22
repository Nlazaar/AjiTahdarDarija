"use client"
import React, { useState, useEffect } from "react"
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

interface VraiFauxProps {
  letter:          DarijaLetter
  proposed:        { latin: string; fr?: string } | string
  isTrue:          boolean
  onSuccess:       () => void
  onFailed:        (correct?: string) => void
  onSpeak:         (l: DarijaLetter) => void
  onReadyChange?:  (ready: boolean) => void
  shouldValidate?: boolean
  mode?:           'lettre' | 'mot'
  prompt?:         string
}

/** Bouton audio Bleu Majorelle — version médium pour intégration dans la carte. */
function MajorelleAudio({ onPlay }: { onPlay: () => void }) {
  return (
    <button
      onClick={onPlay}
      aria-label="Écouter"
      className="relative flex items-center justify-center cursor-pointer transition-transform active:scale-95 overflow-hidden"
      style={{
        width: 52, height: 52,
        borderRadius: 16,
        background: MC.blue,
        border: "none",
        boxShadow: `0 4px 0 #153a6b`,
      }}
    >
      {/* Motif zellige en filigrane */}
      <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full" style={{ opacity: 0.1 }} aria-hidden>
        <g fill="#ffffff">
          <rect x="10" y="10" width="80" height="80" />
          <rect x="10" y="10" width="80" height="80" transform="rotate(45 50 50)" />
        </g>
      </svg>
      <svg viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth={2} strokeLinecap="round" className="relative w-5 h-5">
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="#ffffff" />
        <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
        <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
      </svg>
    </button>
  )
}

export default function VraiFaux({ letter, proposed, isTrue, onSuccess, onFailed, onSpeak, onReadyChange, shouldValidate, mode = 'lettre', prompt }: VraiFauxProps) {
  const proposedObj   = typeof proposed === 'string' ? { latin: proposed } : proposed
  const proposedLatin = proposedObj.latin ?? ''
  const proposedFr    = proposedObj.fr
  const isVocab       = mode === 'mot'
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

  // Raccourcis clavier : V/1 = vrai, F/2 = faux
  useEffect(() => {
    if (answered) return
    const onKey = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase()
      if (k === 'v' || k === '1') { e.preventDefault(); select(true)  }
      if (k === 'f' || k === '2') { e.preventDefault(); select(false) }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [answered, pendingAnswer]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!shouldValidate || pendingAnswer === null || answered) return
    setAnswered(true)
    const ok = pendingAnswer === isTrue
    setCorrect(ok)
    if (ok) onSuccess()
    else {
      const verdict = isTrue ? "VRAI" : "FAUX"
      const ctx = letter.fr ? ` — ${letter.latin} = ${letter.fr}` : (letter.latin ? ` — ${letter.latin}` : '')
      onFailed(`C'était ${verdict}${ctx}`)
    }
  }, [shouldValidate]) // eslint-disable-line react-hooks/exhaustive-deps

  // Style de la grande carte centrale (contenu à juger)
  const cardStyle: React.CSSProperties = (() => {
    const base: React.CSSProperties = {
      width: '100%',
      maxWidth: 340,
      padding: '24px 20px',
      borderRadius: 28,
      border: `2px solid ${MC.gold}55`,
      background: `radial-gradient(circle at 30% 20%, ${MC.gold}08, ${MC.bg} 65%)`,
      transition: 'all 0.2s',
    }
    if (!answered) return base
    if (correct)  return { ...base, border: `2px solid ${MC.green}`, background: '#0f2419', boxShadow: `0 0 0 4px ${MC.green}33` }
    return { ...base, border: `2px solid ${MC.red}`, background: '#2a1416', boxShadow: `0 0 0 4px ${MC.red}33` }
  })()

  const btnStyle = (val: boolean): React.CSSProperties => {
    const positive = val
    const accent   = positive ? MC.green : MC.red
    const dark     = positive ? '#0f2419' : '#2a1416'
    const shadow   = positive ? '#003e1f' : '#7a1a1c'
    const base: React.CSSProperties = {
      flex: 1,
      padding: '16px 12px',
      borderRadius: 20,
      borderWidth: 2,
      borderStyle: 'solid',
      fontWeight: 900,
      fontSize: 16,
      letterSpacing: '0.08em',
      transition: 'all 0.15s',
      cursor: 'pointer',
    }

    if (!answered) {
      const isSelected = pendingAnswer === val
      if (isSelected) {
        return {
          ...base,
          borderColor: accent,
          background: dark,
          color: '#ffffff',
          boxShadow: `0 0 0 4px ${accent}22, 0 4px 0 ${shadow}`,
          transform: 'translateY(2px)',
        }
      }
      return {
        ...base,
        borderColor: `${MC.gold}55`,
        background: MC.card,
        color: accent,
        boxShadow: `0 4px 0 #1a2830`,
      }
    }

    // answered
    if (val === isTrue) {
      return { ...base, borderColor: MC.green, background: '#0f2419', color: '#ffffff', boxShadow: `0 0 0 4px ${MC.green}33` }
    }
    if (pendingAnswer === val && !correct) {
      return { ...base, borderColor: MC.red, background: '#2a1416', color: '#ffffff', boxShadow: `0 4px 0 #7a1a1c` }
    }
    return { ...base, borderColor: MC.border, background: MC.card, color: MC.sub, opacity: 0.35 }
  }

  return (
    <div className="flex flex-col items-center gap-5 w-full max-w-xl mx-auto">
      <p
        className="text-[13px] font-extrabold uppercase text-center"
        style={{ color: MC.gold, letterSpacing: '0.12em' }}
      >
        {prompt ?? 'Cette association est-elle correcte ?'}
      </p>

      {/* Carte centrale : mot/lettre d'origine — flèche — proposition à juger */}
      <div className="relative flex flex-col items-center gap-3 overflow-hidden" style={cardStyle}>
        {/* Zellige filigrane */}
        <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full" style={{ opacity: 0.05 }} aria-hidden>
          <g fill={MC.gold}>
            <rect x="10" y="10" width="80" height="80" />
            <rect x="10" y="10" width="80" height="80" transform="rotate(45 50 50)" />
          </g>
        </svg>

        <div className="relative z-[5] flex flex-col items-center gap-2">
          {isVocab ? (
            <>
              <span className="text-[40px] leading-none text-white" style={{ fontFamily: 'Amiri, serif' }}>{letter.letter}</span>
              <span className="text-[18px] font-black" style={{ color: MC.gold }}>{letter.latin}</span>
            </>
          ) : (
            <span className="text-[88px] leading-none text-white" style={{ fontFamily: 'Amiri, serif' }}>
              {letter.letter}
            </span>
          )}
        </div>

        <div className="relative z-[5]">
          <MajorelleAudio onPlay={() => onSpeak(letter)} />
        </div>

        {/* Séparateur — flèche bas pour "= ?" */}
        <div className="relative z-[5] flex flex-col items-center gap-1">
          <span style={{ color: `${MC.gold}88`, fontSize: 20, lineHeight: 1 }}>↓</span>
          <span style={{ color: MC.sub, fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            signifie-t-il
          </span>
        </div>

        <div className="relative z-[5] flex flex-col items-center gap-0.5">
          <span className="text-[22px] font-black text-white">{proposedLatin}</span>
          {proposedFr && (
            <span className="text-[13px] italic" style={{ color: MC.sub }}>
              ({proposedFr})
            </span>
          )}
        </div>
      </div>

      {/* Boutons VRAI / FAUX */}
      <div className="flex gap-3 w-full" style={{ maxWidth: 340 }}>
        <button
          disabled={answered}
          onClick={() => select(true)}
          style={btnStyle(true)}
          className={answered && pendingAnswer === true && !correct ? "animate-shake-x" : ""}
          aria-label="Répondre vrai (touche V)"
        >
          ✓ VRAI
        </button>
        <button
          disabled={answered}
          onClick={() => select(false)}
          style={btnStyle(false)}
          className={answered && pendingAnswer === false && !correct ? "animate-shake-x" : ""}
          aria-label="Répondre faux (touche F)"
        >
          ✕ FAUX
        </button>
      </div>
    </div>
  )
}
