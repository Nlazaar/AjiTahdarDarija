"use client"
import React from "react"
import { AudioButton, ContinueButton } from "@/components/ui"
import type { DarijaLetter } from "./types"

interface FlashCardProps {
  letter:     DarijaLetter & { name?: string }
  onContinue: () => void
  onSpeak:    (l: DarijaLetter) => void
  progress?:  string
  mode?:      'lettre' | 'mot'
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

export default function FlashCard({ letter, onContinue, onSpeak, progress, mode = 'lettre' }: FlashCardProps) {
  const isVocab = mode === 'mot'
  const emoji = isVocab ? getEmoji(letter.fr) : null

  return (
    <div className="flex flex-col items-center gap-5" style={{ animation: 'fadeUp 0.3s ease both' }}>
      {/* Badge */}
      <div className="flex items-center gap-2">
        <span className="bg-amber-500/20 text-amber-400 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
          {isVocab ? 'Nouveau mot' : 'Nouvelle lettre'}
        </span>
        {progress && (
          <span className="text-xs text-[#6b7f8a] font-medium">{progress}</span>
        )}
      </div>

      {isVocab ? (
        /* ── Mode vocabulaire ── */
        <div className="flex flex-col items-center gap-3 my-1">
          {letter.imageUrl ? (
            <div className="w-36 h-36 rounded-2xl overflow-hidden border-2 border-white/10">
              <img src={letter.imageUrl} alt={letter.fr}
                className="w-full h-full object-cover"
                onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} />
            </div>
          ) : emoji ? (
            <div className="w-28 h-28 rounded-2xl flex items-center justify-center"
              style={{ background: '#243b4a', border: '2px solid #2a3d47' }}>
              <span className="text-[56px]">{emoji}</span>
            </div>
          ) : null}
          <div className="text-[44px] leading-none font-black text-white">{letter.latin}</div>
          <div className="text-[24px] leading-none text-[#8a9baa]" style={{ fontFamily: 'Amiri, serif' }}>
            {letter.letter}
          </div>
        </div>
      ) : (
        /* ── Mode lettre arabe ── */
        <div className="flex flex-col items-center gap-2 my-2">
          {/* Big arabic letter with glow effect */}
          <div className="relative">
            <div className="absolute inset-0 rounded-full blur-2xl opacity-20"
              style={{ background: '#1cb0f6', transform: 'scale(1.5)' }} />
            <div className="relative w-40 h-40 rounded-full flex items-center justify-center"
              style={{ background: '#1e2d35', border: '3px solid #2a3d47', boxShadow: '0 6px 0 #1a2830' }}>
              <span className="text-[80px] leading-none text-white" style={{ fontFamily: 'Amiri, serif' }}>
                {letter.letter}
              </span>
            </div>
          </div>
          {/* Letter name */}
          {letter.name && (
            <div className="text-[18px] font-black text-[#1cb0f6] mt-1">
              {letter.name}
            </div>
          )}
        </div>
      )}

      {/* Audio button */}
      <AudioButton onPlay={() => onSpeak(letter)} size="lg" />

      {/* Info panel */}
      <div className="w-full rounded-2xl p-4 space-y-3" style={{ background: '#243b4a', border: '1.5px solid #2a3d47' }}>
        <div className="flex items-center justify-between">
          <span className="text-[12px] font-bold uppercase tracking-wider text-[#6b7f8a]">Romanisation</span>
          <span className="text-[18px] font-black text-white bg-[#1e2d35] px-3 py-1 rounded-lg">
            {letter.latin}
          </span>
        </div>
        <div className="h-px" style={{ background: '#2a3d47' }} />
        <div className="flex items-center justify-between">
          <span className="text-[12px] font-bold uppercase tracking-wider text-[#6b7f8a]">Prononciation</span>
          <span className="text-[14px] font-bold text-[#e8eaed]">
            {letter.fr}
          </span>
        </div>
      </div>

      <ContinueButton onClick={onContinue} label="Continuer" />
    </div>
  )
}
