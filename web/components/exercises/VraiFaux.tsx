"use client";

import React, { useState } from 'react';
import { AudioButton } from '../ui/AudioButton';
import { ContinueButton } from '../ui/ContinueButton';
import { FeedbackBanner } from '../ui/FeedbackBanner';
import { DarijaLetter } from '@/types/alphabet';

interface VraiFauxProps {
  letter: DarijaLetter;
  proposed: string;
  isTrue: boolean;
  onSuccess: () => void;
  onFailed: () => void;
  onSpeak: (l: DarijaLetter) => void;
}

export default function VraiFaux({ letter, proposed, isTrue, onSuccess, onFailed, onSpeak }: VraiFauxProps) {
  const [answer, setAnswer] = useState<boolean | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);

  const handleAnswer = (choice: boolean) => {
    if (isAnswered) return;
    setAnswer(choice);
    setIsAnswered(true);
    if (choice === isTrue) {
      onSuccess();
    } else {
      onFailed();
    }
  };

  const isCorrect = answer === isTrue;

  return (
    <div className="max-w-md mx-auto w-full space-y-8 animate-fadeUp px-4">
      <div className="text-center space-y-2">
        <h2 className="text-xl font-bold text-gray-800">Cette association est-elle correcte ?</h2>
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Réponds vite !</p>
      </div>

      <div className={`
        bg-gray-50 border-2 rounded-3xl p-10 flex flex-col items-center gap-6 transition-all duration-300 shadow-sm
        ${isAnswered ? (isCorrect ? 'bg-green-50 border-green-400 ring-4 ring-green-100' : 'bg-red-50 border-red-400 ring-4 ring-red-100') : 'border-gray-200'}
      `}>
        <div className="text-9xl font-arabic text-royal leading-none drop-shadow-sm">
          {letter.letter}
        </div>
        
        <AudioButton onPlay={() => onSpeak(letter)} size="md" />
        
        <div className="w-16 h-1 bg-gray-200 rounded-full opacity-50" />
        
        <div className="text-5xl font-bold text-gray-800 font-outfit uppercase tracking-wider drop-shadow-sm">
          {proposed}
        </div>
      </div>

      <div className="flex gap-4">
        <button
          onClick={() => handleAnswer(true)}
          disabled={isAnswered}
          className={`
            flex-1 py-5 bg-green-500 hover:bg-green-600 active:bg-green-700 text-white
            font-bold rounded-2xl border-b-4 border-green-700 active:border-b-0 active:translate-y-[4px]
            text-lg tracking-wide transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed
            ${isAnswered && isTrue ? 'ring-4 ring-green-300 ring-offset-2' : ''}
          `}
        >
          VRAI
        </button>
        <button
          onClick={() => handleAnswer(false)}
          disabled={isAnswered}
          className={`
            flex-1 py-5 bg-red-400 hover:bg-red-500 active:bg-red-600 text-white
            font-bold rounded-2xl border-b-4 border-red-600 active:border-b-0 active:translate-y-[4px]
            text-lg tracking-wide transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed
            ${isAnswered && !isTrue ? 'ring-4 ring-red-300 ring-offset-2' : ''}
          `}
        >
          FAUX
        </button>
      </div>

      {isAnswered && (
        <div className="pt-4 space-y-4 animate-fadeUp">
          <FeedbackBanner 
            type={isCorrect ? 'correct' : 'incorrect'} 
            message={isCorrect ? "Exact ! Bien joué." : "Et non, c'était un piège !"} 
          />
          <ContinueButton onClick={isCorrect ? onSuccess : onFailed} />
        </div>
      )}
    </div>
  );
}
