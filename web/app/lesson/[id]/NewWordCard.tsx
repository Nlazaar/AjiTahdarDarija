"use client";

import React from 'react'
import { useLanguage } from '@/context/LanguageContext'
import { useAudioCtx } from '@/contexts/AudioContext'

type Word = { darija: string; latin?: string; fr?: string }

export default function NewWordCard({ word = { darija: 'ا', latin: 'a', fr: 'a' } }: { word?: Word }) {
  const { selectedLang } = useLanguage()
  const { speak: speakCtx } = useAudioCtx()

  const speak = () => {
    const lang = selectedLang === 'fr' ? 'ar-MA' : selectedLang || 'ar-MA'
    speakCtx(word.darija, lang)
  }

  const meaning = selectedLang === 'fr' ? (word.fr || word.latin) : (word.latin || word.fr)

  return (
    <div className="min-h-[calc(100vh-72px)] flex items-center justify-center px-6">
      <div className="w-full max-w-2xl">
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="text-sm font-extrabold text-[#58CC02] uppercase tracking-wider">NOUVEAU MOT</div>
          <button aria-label="Écouter" onClick={speak} className="inline-flex items-center justify-center p-2 rounded-md bg-[#E9F8E6] text-[#2F8F2F] shadow-sm">🔊</button>
        </div>

        <div className="bg-white rounded-3xl p-10 shadow-[0_18px_40px_rgba(16,24,40,0.08)] text-center">
          <div className="text-[6.5rem] md:text-[8rem] font-extrabold text-[#0f172a] leading-none" dir="rtl">{word.darija}</div>
          <div className="text-2xl text-[#374151] mt-4 font-semibold">{word.latin}</div>
          <div className="text-base text-[#6b7280] mt-2">{meaning}</div>
        </div>
      </div>
    </div>
  )
}
