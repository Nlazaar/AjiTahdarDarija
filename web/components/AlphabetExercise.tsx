"use client";
import React, { useState } from "react";
import { useAudio } from "../hooks/useAudio";

type Letter = { letter: string; latin: string; fr: string };

type Props = {
  item: Letter;
  choices: string[]; // latin values
  onResult: (correct: boolean) => void;
  getAudioUrl?: (latin: string) => string | undefined;
};

export default function AlphabetExercise({ item, choices, onResult, getAudioUrl }: Props) {
  const [selected, setSelected] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const audio = useAudio();

  const handleChoose = async (c: string) => {
    if (selected) return;
    setSelected(c);
    const ok = c === item.latin;
    if (ok) {
      setFeedback("Bonne réponse");
      audio.speak(item.letter);
      onResult(true);
    } else {
      setFeedback(`Faux, la bonne réponse est ${item.latin}`);
      onResult(false);
    }
  };

  return (
    <div className="max-w-xl w-full mx-auto bg-white rounded-3xl shadow-lg p-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-extrabold text-gray-800">Alphabet</h2>
        <div className="mt-4 flex items-center justify-center gap-3">
          <div className="text-8xl md:text-9xl font-black leading-none text-[#06b6d4] drop-shadow-lg transform transition-transform duration-300">
            {item.letter}
          </div>
          <button
            aria-label="écouter"
            onClick={() => {
              audio.speak(item.letter);
            }}
            className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white shadow-md border border-gray-100 text-[#06b6d4] hover:scale-105 transition"
          >
            🔊
          </button>
        </div>
        <div className="mt-2 text-gray-500">{item.fr}</div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {choices.map((c) => {
          const correct = c === item.latin;
          const isSelected = selected === c;
          const base = isSelected ? (correct ? 'ring-4 ring-green-200 scale-100' : 'ring-4 ring-red-200 scale-100') : 'hover:-translate-y-1';
          const bg = isSelected ? (correct ? 'bg-green-50' : 'bg-red-50') : 'bg-white';
          return (
            <button
              key={c}
              onClick={() => handleChoose(c)}
              className={`py-4 px-4 rounded-2xl border border-gray-100 shadow-sm ${bg} ${base} transform transition-all duration-250 ease-out`}
              aria-pressed={isSelected}
            >
              <div className="text-lg font-semibold text-center text-gray-800">{c}</div>
            </button>
          );
        })}
      </div>

      {feedback && (
        <div className={`mt-4 p-3 rounded-lg ${feedback.startsWith('Bonne') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'} shadow-sm text-center font-medium`}>
          {feedback}
        </div>
      )}
    </div>
  );
}
