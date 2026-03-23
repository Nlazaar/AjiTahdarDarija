"use client";

import React, { useState, useEffect } from 'react';
import { ExerciseCard } from '../ui/ExerciseCard';
import { AudioButton } from '../ui/AudioButton';
import { ContinueButton } from '../ui/ContinueButton';
import { FeedbackBanner } from '../ui/FeedbackBanner';
import { DarijaLetter } from '@/types/alphabet';

interface EntendreEtChoisirProps {
  letter: DarijaLetter;
  choices: DarijaLetter[];
  onSuccess: () => void;
  onFailed: () => void;
  onSpeak: (l: DarijaLetter) => void;
}

export default function EntendreEtChoisir({ letter, choices, onSuccess, onFailed, onSpeak }: EntendreEtChoisirProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => onSpeak(letter), 400);
    return () => clearTimeout(timer);
  }, [letter, onSpeak]);

  const handleSelect = (choice: DarijaLetter) => {
    if (isAnswered) return;
    setSelected(choice.latin);
    setIsAnswered(true);
    if (choice.latin === letter.latin) {
      onSuccess();
    } else {
      onFailed();
    }
  };

  const isCorrect = selected === letter.latin;

  return (
    <div className="max-w-md mx-auto w-full space-y-8 animate-fadeUp px-4">
      <div className="text-center space-y-2">
        <h2 className="text-xl font-bold text-gray-800">Quelle lettre correspond à ce son ?</h2>
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Écoute attentivement</p>
      </div>

      <div className="flex justify-center py-4">
        <div className="relative group">
          <AudioButton onPlay={() => onSpeak(letter)} size="lg" />
          <div className="absolute -bottom-1 -right-1 bg-blue-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm shadow-lg animate-pulse-soft border-4 border-white">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
              <path d="M10 3.75a2 2 0 100 4 2 2 0 000-4zM6.94 9.563a.75.75 0 01.683.806l-.5 6a.75.75 0 01-1.488-.124l.5-6a.75.75 0 01.805-.682zM13.06 9.563a.75.75 0 01.805.682l.5 6a.75.75 0 11-1.488.124l-.5-6a.75.75 0 01.683-.806z" />
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM6.75 10.75a.75.75 0 000 1.5h6.5a.75.75 0 000-1.5h-6.5z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto mt-8">
        {choices.map((choice) => {
          const isThisSelected = selected === choice.latin;
          const isThisCorrect = choice.latin === letter.latin;
          
          let stateStyles = "border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50 shadow-sm";
          if (isAnswered) {
            if (isThisCorrect) {
              stateStyles = "border-green-400 bg-green-100 text-green-700 animate-matchPop scale-[1.05] z-10 shadow-md";
            } else if (isThisSelected) {
              stateStyles = "border-red-400 bg-red-100 text-red-700 animate-shakeX";
            } else {
              stateStyles = "border-gray-100 bg-gray-50 opacity-40 grayscale-[0.3]";
            }
          }

          return (
            <button
              key={choice.latin}
              onClick={() => handleSelect(choice)}
              disabled={isAnswered}
              className={`
                h-28 flex items-center justify-center
                text-6xl font-arabic border-2 rounded-2xl
                transition-all duration-200
                ${stateStyles}
              `}
            >
              {choice.letter}
            </button>
          );
        })}
      </div>

      {isAnswered && (
        <div className="pt-6 space-y-4 animate-fadeUp">
          <FeedbackBanner 
            type={isCorrect ? 'correct' : 'incorrect'} 
            message={isCorrect ? "Bravo ! C'est la bonne lettre." : `Oups ! C'était celle-ci.`} 
          />
          <ContinueButton onClick={isCorrect ? onSuccess : onFailed} />
        </div>
      )}
    </div>
  );
}
