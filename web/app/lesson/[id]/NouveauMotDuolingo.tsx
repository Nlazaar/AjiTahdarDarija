"use client";

import React from "react";

type Word = { darija: string; latin?: string; fr?: string };

export default function NouveauMotDuolingo({
  word = { darija: "زوين", latin: "zwine", fr: "beau / joli" },
  progression = 5,
  index = 1,
  total = 4,
  onContinue,
  onSkip,
}: {
  word?: Word;
  progression?: number;
  index?: number;
  total?: number;
  onContinue?: () => void;
  onSkip?: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-gray-50 p-6">
      <div className="w-full max-w-sm">
        <header className="flex items-center justify-between mb-6 px-2">
          <div className="flex items-center gap-3">
            <div className="text-sm text-gray-500">Progression</div>
            <div className="text-lg font-extrabold text-gray-900">{progression}</div>
          </div>
          <div className="text-2xl text-yellow-500">✦</div>
        </header>

        <main className="bg-white rounded-[28px] shadow-[0_14px_40px_rgba(16,24,40,0.12)] p-8 text-center">
          <div className="flex items-center justify-center gap-4 mb-4">
            <h2 className="text-xs font-bold text-[#23A455] uppercase tracking-wider">NOUVEAU MOT</h2>
            <button aria-label="Écouter" onClick={() => { if (typeof window !== 'undefined') { const t = new SpeechSynthesisUtterance(word.latin || word.darija); t.lang = 'ar-SA'; window.speechSynthesis.cancel(); window.speechSynthesis.speak(t); } }} className="w-9 h-9 rounded-lg bg-[#EEF9EE] flex items-center justify-center text-[#2F8F2F] shadow-sm">🔊</button>
          </div>

          <section className="bg-white rounded-2xl p-6 mb-4 border border-gray-50">
            <div className="text-6xl md:text-7xl font-extrabold text-gray-900 mb-2 leading-none" dir="rtl">{word.darija}</div>
            <div className="text-lg text-gray-600 mb-1">{word.latin}</div>
            <div className="text-sm text-gray-400">{word.fr}</div>
          </section>

          <div className="flex items-center justify-center gap-3 mt-2">
            <div className="text-sm text-gray-500">{index} / {total}</div>
            <div className="w-28 bg-[#F0FDF4] rounded-full h-2">
              <div className="h-2 rounded-full bg-[#58CC02]" style={{ width: `${(index/total)*100}%` }} />
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3">
            <button onClick={() => onContinue?.()} className="w-full py-3 rounded-full bg-[#58CC02] text-white font-extrabold text-lg shadow-[0_8px_20px_rgba(88,204,2,0.24)] hover:brightness-105">CONTINUER</button>
            <button onClick={() => onSkip?.()} className="w-full py-2 text-gray-500 hover:underline bg-transparent">PASSER</button>
          </div>
        </main>
      </div>
    </div>
  );
}
