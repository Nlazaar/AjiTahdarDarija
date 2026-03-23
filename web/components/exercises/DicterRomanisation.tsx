"use client";

import React, { useState, useEffect, useRef } from 'react';
import { AudioButton } from '../ui/AudioButton';
import { ContinueButton } from '../ui/ContinueButton';
import { FeedbackBanner } from '../ui/FeedbackBanner';
import { DarijaLetter } from '@/types/alphabet';

interface DicterRomanisationProps {
  letter: DarijaLetter;
  onSuccess: () => void;
  onFailed: () => void;
  onSpeak: (l: DarijaLetter) => void;
}

export default function DicterRomanisation({ letter, onSuccess, onFailed, onSpeak }: DicterRomanisationProps) {
  const [value, setValue] = useState("");
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => onSpeak(letter), 400);
    return () => clearTimeout(timer);
  }, [letter, onSpeak]);

  const normalize = (s: string) => {
    return s.trim().toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // Enlever accents
      .replace(/ḥ/g, '7')
      .replace(/ṣ/g, 'S')
      .replace(/ḍ/g, 'D')
      .replace(/ṭ/g, 'T')
      .replace(/ẓ/g, 'Z')
      .replace(/ʿ/g, '3')
      .replace(/3/g, '3')
      .replace(/7/g, '7');
  };

  const checkAnswer = () => {
    if (isAnswered || !value.trim()) return;
    
    // Tolérance simple : on compare le normalisé
    const inputVal = normalize(value);
    const targetVal = normalize(letter.latin);
    
    const correct = inputVal === targetVal;
    
    setIsCorrect(correct);
    setIsAnswered(true);
    
    if (correct) {
      onSuccess();
    } else {
      onFailed();
    }
  };

  return (
    <div className="max-w-md mx-auto w-full space-y-8 animate-fadeUp px-4">
      <div className="text-center space-y-2">
        <h2 className="text-xl font-bold text-gray-800">Écris ce que tu entends</h2>
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Tape la romanisation</p>
      </div>

      <div className="flex flex-col items-center gap-6">
        <AudioButton onPlay={() => onSpeak(letter)} size="lg" />
        
        <div className="text-9xl font-arabic text-royal leading-none my-6 py-4 drop-shadow-sm animate-pulse-soft">
          {letter.letter}
        </div>

        <div className={`
          w-full max-w-sm relative bg-gray-50 p-1 rounded-3xl border-2 transition-all duration-300
          ${isAnswered 
            ? (isCorrect ? 'border-green-400 bg-green-50/50' : 'border-red-400 bg-red-50/50') 
            : 'border-dashed border-gray-300 focus-within:border-royal focus-within:bg-white focus-within:shadow-lg focus-within:scale-[1.02]'}
        `}>
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && checkAnswer()}
            placeholder="Tape ici..."
            disabled={isAnswered}
            autoFocus
            autoComplete="off"
            className={`
              w-full text-center text-4xl font-bold font-outfit
              bg-transparent outline-none p-6 uppercase tracking-widest
              placeholder:text-gray-300 placeholder:font-normal placeholder:text-xl placeholder:tracking-normal
              ${isAnswered ? (isCorrect ? 'text-green-600' : 'text-red-500') : 'text-royal'}
            `}
          />
        </div>
      </div>

      <div className="pt-4 space-y-4">
        {!isAnswered ? (
          <ContinueButton onClick={value.trim() ? checkAnswer : () => {}} label="VÉRIFIER" />
        ) : (
          <div className="animate-fadeUp space-y-4">
            <FeedbackBanner 
              type={isCorrect ? 'correct' : 'incorrect'} 
              message={isCorrect ? "Excellent ! C'est exactement ça." : `Pas tout à fait. C'était "${letter.latin}".`} 
            />
            <ContinueButton onClick={isCorrect ? onSuccess : onFailed} />
          </div>
        )}
      </div>
    </div>
  );
}
