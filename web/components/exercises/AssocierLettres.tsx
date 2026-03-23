"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { DarijaLetter } from '@/types/alphabet';

interface AssocierLettresProps {
  pairs: DarijaLetter[];
  onRoundComplete: () => void;
  onSpeak: (letter: DarijaLetter) => void;
}

export default function AssocierLettres({ pairs, onRoundComplete, onSpeak }: AssocierLettresProps) {
  const [matchedIds, setMatchedIds] = useState<Set<string>>(new Set());
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [selectedRight, setSelectedRight] = useState<string | null>(null);
  const [errorPair, setErrorPair] = useState<[string, string] | null>(null);

  const shuffledSounds = useMemo(() => {
    return [...pairs].sort(() => Math.random() - 0.5);
  }, [pairs]);

  const handleSelect = (id: string, side: 'left' | 'right') => {
    if (matchedIds.has(id)) return;

    if (side === 'left') {
      const letter = pairs.find(p => p.latin === id);
      if (letter) onSpeak(letter);
      setSelectedLeft(id === selectedLeft ? null : id);
    } else {
      setSelectedRight(id === selectedRight ? null : id);
    }
  };

  useEffect(() => {
    if (selectedLeft && selectedRight) {
      if (selectedLeft === selectedRight) {
        setMatchedIds(prev => new Set(prev).add(selectedLeft));
        setSelectedLeft(null);
        setSelectedRight(null);
      } else {
        setErrorPair([selectedLeft, selectedRight]);
        setTimeout(() => {
          setErrorPair(null);
          setSelectedLeft(null);
          setSelectedRight(null);
        }, 800);
      }
    }
  }, [selectedLeft, selectedRight]);

  useEffect(() => {
    if (matchedIds.size === pairs.length && pairs.length > 0) {
      const timer = setTimeout(onRoundComplete, 1200);
      return () => clearTimeout(timer);
    }
  }, [matchedIds.size, pairs.length, onRoundComplete]);

  return (
    <div className="max-w-2xl mx-auto w-full px-4 space-y-8 animate-fadeUp">
      <div className="text-center">
        <h2 className="text-xl font-bold text-gray-800 tracking-tight">Associe chaque lettre à sa prononciation</h2>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mt-1">Étape d'apprentissage</p>
      </div>

      <div className="grid grid-cols-2 gap-x-8 md:gap-x-12">
        {/* Left Column - Letters */}
        <div className="space-y-4">
          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2 mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
            Lettres
          </div>
          {pairs.map((p) => {
            const isMatched = matchedIds.has(p.latin);
            const isSelected = selectedLeft === p.latin;
            const isError = errorPair?.[0] === p.latin;

            return (
              <button
                key={p.latin}
                onClick={() => handleSelect(p.latin, 'left')}
                disabled={isMatched || (!!selectedLeft && !!selectedRight)}
                className={`
                  w-full h-16 flex items-center justify-center text-4xl font-arabic
                  rounded-2xl border-2 transition-all duration-200 select-none
                  ${isMatched 
                    ? 'bg-green-100 border-green-400 text-green-700 shadow-none' 
                    : isError 
                      ? 'bg-red-50 border-red-500 text-red-700 animate-shakeX'
                      : isSelected
                        ? 'bg-green-50 border-green-400 ring-2 ring-green-100 scale-[1.03] shadow-md z-10'
                        : 'bg-white border-gray-100 text-gray-800 hover:border-green-300 shadow-sm'}
                `}
              >
                {p.letter}
                {isMatched && <span className="absolute right-3 text-xs text-green-600 font-bold opacity-50">✓</span>}
              </button>
            );
          })}
        </div>

        {/* Right Column - Sounds */}
        <div className="space-y-4">
          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2 mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />
            Sons
          </div>
          {shuffledSounds.map((s) => {
            const isMatched = matchedIds.has(s.latin);
            const isSelected = selectedRight === s.latin;
            const isError = errorPair?.[1] === s.latin;

            return (
              <button
                key={s.latin}
                onClick={() => handleSelect(s.latin, 'right')}
                disabled={isMatched || (!!selectedLeft && !!selectedRight)}
                className={`
                  w-full h-16 flex flex-col items-center justify-center gap-0.5
                  rounded-2xl border-2 transition-all duration-200
                  ${isMatched 
                    ? 'bg-green-100 border-green-400 text-green-700' 
                    : isError 
                      ? 'bg-red-50 border-red-500 text-red-700 animate-shakeX'
                      : isSelected
                        ? 'bg-violet-50 border-violet-400 ring-2 ring-violet-100 scale-[1.03] shadow-md z-10 text-violet-900'
                        : 'bg-white border-gray-100 text-gray-500 hover:border-violet-300 shadow-sm'}
                `}
              >
                <span className={`text-lg font-bold font-outfit leading-none ${isSelected || isMatched ? 'text-inherit' : 'text-gray-800'}`}>{s.latin}</span>
                <span className="text-[9px] font-bold opacity-40 uppercase tracking-tighter">{s.fr}</span>
                {isMatched && <span className="absolute right-3 text-xs text-green-600 font-bold opacity-50">✓</span>}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
