"use client";

import React, { useState } from 'react';
import { ExerciseCard } from '../ui/ExerciseCard';
import { AudioButton } from '../ui/AudioButton';
import { ContinueButton } from '../ui/ContinueButton';
import { FeedbackBanner } from '../ui/FeedbackBanner';
import { DarijaLetter } from '@/types/alphabet';

interface ChoixLettreProps {
  letter: DarijaLetter;
  choices: DarijaLetter[];
  onSpeak: (l: DarijaLetter) => void;
  onSuccess: () => void;
  onFailed: () => void;
}

export default function ChoixLettre({ letter, choices, onSpeak, onSuccess, onFailed }: ChoixLettreProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);

  const handleSelect = (choice: DarijaLetter) => {
    if (isAnswered) return;
    setSelected(choice.latin);
    setIsAnswered(true);
    if (choice.latin === letter.latin) {
      // Logic handled by orchestration in the page
    }
  };

  const isCorrect = selected === letter.latin;

  return (
    <div className="max-w-md mx-auto w-full space-y-6 px-4 animate-fadeUp">
      <div className="text-center space-y-1">
        <h2 className="text-xl font-bold text-gray-800">Comment se prononce cette lettre ?</h2>
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Choisis la bonne réponse</p>
      </div>

      <ExerciseCard className="flex flex-col items-center gap-6 py-8 bg-green-50/20 border-green-100/50 shadow-none">
        <div className="flex items-center justify-center gap-6 bg-white rounded-[2rem] p-8 border-2 border-green-100 shadow-sm w-full max-w-[240px] relative transition-transform hover:scale-[1.02]">
          <span className="text-8xl font-arabic text-gray-900 leading-none drop-shadow-sm select-none">
            {letter.letter}
          </span>
          <div className="absolute -right-4 -top-4">
            <AudioButton onPlay={() => onSpeak(letter)} size="md" />
          </div>
        </div>
      </ExerciseCard>

      <div className="space-y-3">
        {choices.map((choice) => {
          const isThisSelected = selected === choice.latin;
          const isThisCorrect = choice.latin === letter.latin;
          
          let stateStyles = "border-gray-200 bg-white hover:border-green-400 hover:bg-green-50 shadow-sm";
          if (isAnswered) {
            if (isThisCorrect) {
              stateStyles = "border-green-500 bg-green-100 text-green-700 animate-matchPop z-10 scale-[1.02] shadow-md ring-2 ring-green-200 ring-offset-1";
            } else if (isThisSelected) {
              stateStyles = "border-red-400 bg-red-100 text-red-700 animate-shakeX";
            } else {
              stateStyles = "border-gray-100 bg-gray-50 opacity-40 grayscale-[0.2]";
            }
          }

          return (
            <button
              key={choice.latin}
              onClick={() => handleSelect(choice)}
              disabled={isAnswered}
              className={`
                w-full flex items-center justify-between p-4 px-6
                border-2 rounded-2xl transition-all duration-200 
                group relative overflow-hidden active:scale-[0.98]
                ${stateStyles}
              `}
            >
              <div className="flex flex-col items-start">
                <span className="text-2xl font-bold font-outfit tracking-tight">{choice.latin}</span>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
                  Prononciation : {choice.fr}
                </span>
              </div>
              {isAnswered && isThisCorrect && (
                <div className="bg-green-500 text-white w-7 h-7 rounded-lg flex items-center justify-center text-sm shadow-sm animate-bounce">✓</div>
              )}
            </button>
          );
        })}
      </div>

      {isAnswered && (
        <div className="pt-4 space-y-4 animate-fadeUp">
          <FeedbackBanner 
            type={isCorrect ? 'correct' : 'incorrect'} 
            message={isCorrect ? "Excellent ! C'est la bonne réponse." : `Oups ! La réponse était "${letter.latin}".`} 
          />
          <ContinueButton onClick={isCorrect ? onSuccess : onFailed} />
        </div>
      )}
    </div>
  );
}
