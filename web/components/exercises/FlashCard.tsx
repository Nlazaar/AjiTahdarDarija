"use client";

import React, { useEffect } from 'react';
import { ExerciseCard } from '../ui/ExerciseCard';
import { AudioButton } from '../ui/AudioButton';
import { ContinueButton } from '../ui/ContinueButton';
import { DarijaLetter } from '@/types/alphabet';

interface FlashCardProps {
  letter: DarijaLetter;
  onContinue: () => void;
  onSpeak: (l: DarijaLetter) => void;
}

export default function FlashCard({ letter, onContinue, onSpeak }: FlashCardProps) {
  useEffect(() => {
    const timer = setTimeout(() => onSpeak(letter), 500);
    return () => clearTimeout(timer);
  }, [letter, onSpeak]);

  return (
    <div className="max-w-md mx-auto w-full">
      <ExerciseCard className="flex flex-col items-center gap-8 py-10">
        <div className="bg-amber-100 text-amber-700 px-4 py-1.5 rounded-full text-xs font-bold animate-bounceIn uppercase tracking-widest border border-amber-200">
          🆕 Nouvelle lettre
        </div>

        <div className="text-9xl font-arabic text-royal text-center leading-none mt-4 drop-shadow-sm">
          {letter.letter}
        </div>

        <div className="flex flex-col items-center gap-8 w-full">
          <AudioButton onPlay={() => onSpeak(letter)} size="lg" />

          <div className="bg-gray-50 rounded-2xl p-6 w-full border border-gray-100 shadow-inner space-y-4">
            <div className="flex justify-between items-center border-b border-gray-200/60 pb-3">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Romanisation</span>
              <span className="text-3xl font-bold text-gray-800 font-outfit">{letter.latin}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Prononciation FR</span>
              <span className="text-xl font-semibold text-gray-600 font-outfit">"{letter.fr}"</span>
            </div>
          </div>
        </div>

        <div className="w-full pt-4">
          <ContinueButton onClick={onContinue} />
        </div>
      </ExerciseCard>
    </div>
  );
}
