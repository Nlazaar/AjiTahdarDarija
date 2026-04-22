"use client"
import React, { useState } from "react"
import { ContinueButton } from "@/components/ui"
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

interface FlashCardProps {
  letter:     DarijaLetter & { name?: string }
  onContinue: () => void
  onSpeak:    (l: DarijaLetter) => void
  progress?:  string
  mode?:      'lettre' | 'mot'
  prompt?:    string
}

/* ─── Emoji map for vocab words ─── */
const WORD_EMOJI: Record<string, string> = {
  pain: '🍞', tajine: '🥘', couscous: '🥘', harira: '🍲', viande: '🥩',
  légumes: '🥬', thé: '🍵', café: '☕', eau: "💧", pomme: '🍎',
  citron: '🍋', raisin: '🍇', banane: '🍌', riz: '🍚', lait: '🥛',
  fruit: '🍑', chien: '🐕', chat: '🐱', mouton: '🐑', vache: '🐄',
  poule: '🐔', âne: '🫏', lion: '🦁', éléphant: '🐘', singe: '🐵',
  oiseau: '🐦', poisson: '🐟', serpent: '🐍', cheval: '🐴',
  tête: '😊', œil: '👁️', oreille: '👂', nez: '👃', bouche: '👄',
  cheveux: '💇', main: '✋', jambe: '🦵', dos: '🔙', cœur: '❤️',
  ventre: '🫃', épaule: '💪', chemise: '👔', pantalon: '👖',
  djellaba: '🧥', manteau: '🧥', chaussures: '👟', chaussettes: '🧦',
  bonnet: '🎩', ceinture: '🪢', lunettes: '👓', montre: '⌚',
  écharpe: '🧣', cravate: '👔', médecin: '👨‍⚕️', professeur: '👨‍🏫',
  ingénieur: '👷', cuisinier: '👨‍🍳', policier: '👮', infirmière: '👩‍⚕️',
  épicier: '🏪', coiffeur: '💇‍♂️', chauffeur: '🚕', agriculteur: '👨‍🌾',
  artisan: '🧑‍🎨', commerçant: '🏬', enseignant: '👨‍🏫',
  maison: '🏠', porte: '🚪', fenêtre: '🪟', table: '🪑',
  voiture: '🚗', taxi: '🚕', bus: '🚌', train: '🚂', avion: '✈️',
  vélo: '🚲', livre: '📖', stylo: '✏️', téléphone: '📱',
  rouge: '🔴', bleu: '🔵', vert: '🟢', jaune: '🟡', blanc: '⚪',
  noir: '⚫', orange: '🟠', violet: '🟣', marron: '🟤',
  marché: '🏪', dirham: '💰', prix: '🏷️',
  bonjour: '👋', merci: '🙏', pardon: '🙇',
}

function getEmoji(fr: string): string | null {
  const lower = fr.toLowerCase()
  for (const [key, emoji] of Object.entries(WORD_EMOJI)) {
    if (lower.includes(key)) return emoji
  }
  return null
}

/** Grand bouton audio Bleu Majorelle — carré arrondi, pulse au play.
 *  Mêmes métriques que BigMajorelleAudio de EntendreEtChoisir pour cohérence. */
function BigMajorelleAudio({ onPlay, playing }: { onPlay: () => void; playing: boolean }) {
  return (
    <button
      onClick={onPlay}
      aria-label="Écouter"
      className="relative flex items-center justify-center cursor-pointer transition-transform active:scale-95 overflow-hidden"
      style={{
        width: 96, height: 96,
        borderRadius: 24,
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

      {playing && (
        <span
          className="absolute inset-0 pointer-events-none"
          style={{
            borderRadius: 24,
            boxShadow: `0 0 0 0 ${MC.blue}aa`,
            animation: "audioPulseFC 0.8s ease-out",
          }}
        />
      )}

      <svg viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth={2} strokeLinecap="round" className="relative w-10 h-10">
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="#ffffff" />
        <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
        <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
      </svg>

      <style jsx>{`
        @keyframes audioPulseFC {
          0%   { box-shadow: 0 0 0 0 ${MC.blue}aa; }
          100% { box-shadow: 0 0 0 20px ${MC.blue}00; }
        }
      `}</style>
    </button>
  )
}

export default function FlashCard({ letter, onContinue, onSpeak, progress, mode = 'lettre', prompt }: FlashCardProps) {
  const isVocab = mode === 'mot'
  const emoji = isVocab ? getEmoji(letter.fr) : null
  const [playing, setPlaying] = useState(false)

  const handlePlay = () => {
    setPlaying(true)
    onSpeak(letter)
    setTimeout(() => setPlaying(false), 800)
  }

  return (
    <div className="flex flex-col items-center gap-5 w-full max-w-xl mx-auto" style={{ animation: 'fadeUp 0.3s ease both' }}>
      {/* Bandeau question — or uppercase, cohérent avec les autres exos */}
      <div className="flex items-center gap-3">
        <span
          className="text-[13px] font-extrabold uppercase"
          style={{ color: MC.gold, letterSpacing: '0.12em' }}
        >
          {prompt ?? (isVocab ? 'Nouveau mot' : 'Nouvelle lettre')}
        </span>
        {progress && (
          <span className="text-xs font-semibold" style={{ color: MC.sub }}>{progress}</span>
        )}
      </div>

      {/* Carte principale — motif zellige en filigrane, bordure or */}
      <div
        className="relative flex flex-col items-center justify-center overflow-hidden"
        style={{
          width: '100%',
          maxWidth: 340,
          padding: '28px 20px',
          borderRadius: 28,
          border: `2px solid ${MC.gold}55`,
          background: `radial-gradient(circle at 30% 20%, ${MC.gold}08, ${MC.bg} 65%)`,
        }}
      >
        {/* Zellige filigrane */}
        <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full" style={{ opacity: 0.05 }} aria-hidden>
          <g fill={MC.gold}>
            <rect x="10" y="10" width="80" height="80" />
            <rect x="10" y="10" width="80" height="80" transform="rotate(45 50 50)" />
          </g>
        </svg>

        {isVocab ? (
          <div className="relative z-[5] flex flex-col items-center gap-3">
            {letter.imageUrl ? (
              <div className="w-32 h-32 rounded-2xl overflow-hidden" style={{ border: `2px solid ${MC.gold}55` }}>
                <img src={letter.imageUrl} alt={letter.fr}
                  className="w-full h-full object-cover"
                  onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} />
              </div>
            ) : emoji ? (
              <div
                className="w-24 h-24 rounded-2xl flex items-center justify-center"
                style={{ background: MC.card, border: `2px solid ${MC.gold}55` }}
              >
                <span className="text-[52px]">{emoji}</span>
              </div>
            ) : null}
            <div className="text-[36px] leading-none text-white" style={{ fontFamily: 'Amiri, serif' }}>
              {letter.letter}
            </div>
            <div className="text-[18px] leading-none font-black" style={{ color: MC.gold }}>
              {letter.latin}
            </div>
          </div>
        ) : (
          <div className="relative z-[5] flex flex-col items-center gap-3">
            <span className="text-[96px] leading-none text-white" style={{ fontFamily: 'Amiri, serif' }}>
              {letter.letter}
            </span>
            {letter.name && (
              <div className="text-[16px] font-black" style={{ color: MC.gold }}>
                {letter.name}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bouton audio Majorelle */}
      <BigMajorelleAudio onPlay={handlePlay} playing={playing} />

      {/* Panneau info — fond carte, bordure or transparente */}
      <div
        className="w-full rounded-2xl p-4 space-y-3"
        style={{ background: MC.card, border: `1.5px solid ${MC.gold}33` }}
      >
        <div className="flex items-center justify-between gap-3">
          <span className="text-[12px] font-bold uppercase" style={{ color: MC.sub, letterSpacing: '0.1em' }}>
            Romanisation
          </span>
          <span
            className="text-[18px] font-black px-3 py-1 rounded-lg"
            style={{ color: '#ffffff', background: MC.bg, border: `1px solid ${MC.gold}55` }}
          >
            {letter.latin}
          </span>
        </div>
        <div className="h-px" style={{ background: MC.border }} />
        <div className="flex items-center justify-between gap-3">
          <span className="text-[12px] font-bold uppercase" style={{ color: MC.sub, letterSpacing: '0.1em' }}>
            Prononciation
          </span>
          <span className="text-[14px] font-bold text-right" style={{ color: '#e8eaed' }}>
            {letter.fr}
          </span>
        </div>
      </div>

      <ContinueButton onClick={onContinue} label="Continuer" />
    </div>
  )
}
