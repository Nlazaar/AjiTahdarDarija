import React, { useState } from 'react';

type Word = { darija: string; latin?: string; fr?: string; en?: string };

export default function Flashcard({
  words,
  onFinish,
  lang = 'fr'
}: {
  words: Word[];
  onFinish?: () => void;
  lang?: string;
}) {
  const [index, setIndex] = useState(0);

  const current = words[index];

  function speak(text: string) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'ar';
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(u);
  }

  function handleContinue() {
    if (index < words.length - 1) setIndex(i => i + 1);
    else if (onFinish) onFinish();
  }

  return (
    <div className="flex flex-col items-center justify-center gap-6 w-full" role="group" aria-label="Flashcards">
      <div className="w-full max-w-3xl px-4">
        <div className="mb-4 flex items-center gap-3">
          <div className="w-8 h-8 bg-[#f3e8ff] text-[#6b21a8] rounded-full flex items-center justify-center font-bold">✦</div>
          <div className="text-sm font-extrabold text-[#6b21a8] tracking-wide">NOUVEAU MOT</div>
        </div>
        <div className="relative bg-white rounded-2xl p-10 shadow-sm text-center border border-gray-100" style={{overflow: 'hidden'}}>
          <button onClick={() => speak(current.darija)} aria-label="Écouter la prononciation en darija" className="absolute top-4 right-4 w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#34D399]">🔊</button>
          <div className="flex flex-col items-center">
            <div className="text-6xl md:text-[72px] leading-none mb-4" dir="rtl" style={{lineHeight: 1}} aria-hidden>{current.darija}</div>
            <div className="text-xl md:text-2xl font-semibold text-gray-800 mb-1">{current.latin}</div>
            <div className="text-sm md:text-base text-gray-600 mb-6">{(current as any)[lang] ?? current.fr}</div>

            <div className="w-full max-w-sm">
              <button onClick={handleContinue} aria-label="Continuer" className="w-full px-6 py-3 bg-[#34D399] text-white rounded-full font-extrabold shadow-sm focus:outline-none focus:ring-3 focus:ring-offset-2 focus:ring-[#34D399]">CONTINUER</button>
            </div>
          </div>
        </div>
      </div>
      <div className="text-sm text-gray-500" aria-live="polite">{index + 1} / {words.length}</div>
    </div>
  );
}
