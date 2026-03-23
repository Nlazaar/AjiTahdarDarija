"use client";

import React, { useState, useEffect } from "react";
import { FeedbackBanner } from "../ui/FeedbackBanner";
import { DarijaLetter } from "@/types/alphabet";

interface TrouverLesPairesProps {
  pairs: DarijaLetter[];
  onRoundComplete: () => void;
  onSpeak: (letter: DarijaLetter) => void;
  onHeartLost: () => void;
}

export default function TrouverLesPaires({
  pairs,
  onRoundComplete,
  onSpeak,
  onHeartLost,
}: TrouverLesPairesProps) {
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [selectedRight, setSelectedRight] = useState<string | null>(null);
  const [matchedIds, setMatchedIds] = useState<Set<string>>(new Set());
  const [wrongPair, setWrongPair] = useState<string[] | null>(null);
  const [feedback, setFeedback] = useState<{ text: string; type: "correct" | "error" } | null>(null);

  // Shuffle right column ONLY ONCE at mount
  const [shuffledSounds] = useState(() => [...pairs].sort(() => Math.random() - 0.5));

  // Check match when both are selected
  useEffect(() => {
    if (selectedLeft && selectedRight && !wrongPair && !feedback && !matchedIds.has(selectedLeft)) {
      if (selectedLeft === selectedRight) {
        // ✅ Match!
        const correctId = selectedLeft;
        setMatchedIds(prev => new Set(prev).add(correctId));
        setFeedback({ text: "Bonne paire !", type: "correct" });
        
        const letterObj = pairs.find(p => p.latin === correctId);
        if (letterObj) onSpeak(letterObj);

        const timer = setTimeout(() => {
          setSelectedLeft(null);
          setSelectedRight(null);
          setFeedback(null);
        }, 700);
        return () => clearTimeout(timer);
      } else {
        // ❌ Error
        setWrongPair([selectedLeft, selectedRight]);
        setFeedback({ text: "Pas tout à fait — réessaie !", type: "error" });
        onHeartLost();

        const timer = setTimeout(() => {
          setSelectedLeft(null);
          setSelectedRight(null);
          setWrongPair(null);
          setFeedback(null);
        }, 800);
        return () => clearTimeout(timer);
      }
    }
  }, [selectedLeft, selectedRight, pairs, onSpeak, onHeartLost, wrongPair, feedback, matchedIds]);

  const allFound = matchedIds.size === pairs.length;

  return (
    <div className="max-w-xl mx-auto w-full px-2 animate-fadeUp">
      {/* Points progression */}
      <div className="flex justify-center gap-2 mb-6">
        {pairs.map((p) => (
          <div 
            key={p.latin} 
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${matchedIds.has(p.latin) ? "bg-green-400 scale-110 shadow-sm" : "bg-gray-200"}`} 
          />
        ))}
      </div>

      <div className="min-h-[60px] mb-4">
        {feedback && (
          <FeedbackBanner type={feedback.type === "correct" ? "correct" : "incorrect"} message={feedback.text} />
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 mb-10">
        {/* Left Column - Arabic */}
        <div className="space-y-2">
          {pairs.map((p, idx) => {
            const isMatched = matchedIds.has(p.latin);
            const isSelected = selectedLeft === p.latin;
            const isError = wrongPair?.[0] === p.latin;
            
            return (
              <button
                key={p.latin}
                disabled={isMatched || !!wrongPair}
                onClick={() => setSelectedLeft(isSelected ? null : p.latin)}
                className={`
                  w-full flex items-center gap-3 p-3 min-h-[54px] relative border-[2.5px] rounded-2xl transition-all duration-200
                  ${isMatched 
                    ? "border-green-400 bg-green-100 animate-matchPop grayscale-0" 
                    : isError 
                      ? "border-red-400 bg-red-100 animate-shakeX"
                      : isSelected
                        ? "border-blue-400 bg-blue-50 shadow-md translate-y-[-2px]"
                        : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50 active:translate-y-0 shadow-sm"}
                `}
              >
                <div className={`
                  w-6 h-6 rounded-lg border-2 flex items-center justify-center text-[10px] font-bold
                  ${isSelected ? "border-blue-400 text-blue-500" : "border-gray-200 text-gray-400"}
                `}>
                  {idx + 1}
                </div>
                <div className="text-3xl font-arabic flex-1 text-center bg-transparent mt-1">{p.letter}</div>
                {!isMatched && (
                   <span className="absolute top-1 right-2 text-[10px] opacity-20 group-hover:opacity-60 transition-opacity">🔊</span>
                )}
                {isMatched && <span className="absolute top-1 right-2 text-green-600 text-xs">✓</span>}
              </button>
            );
          })}
        </div>

        {/* Right Column - Latin */}
        <div className="space-y-2">
          {shuffledSounds.map((s, idx) => {
            const isMatched = matchedIds.has(s.latin);
            const isSelected = selectedRight === s.latin;
            const isError = wrongPair?.[1] === s.latin;
            const badgeNum = (idx + 6) % 10;

            return (
              <button
                key={s.latin}
                disabled={isMatched || !!wrongPair}
                onClick={() => setSelectedRight(isSelected ? null : s.latin)}
                className={`
                  w-full flex items-center gap-3 p-3 min-h-[54px] relative border-[2.5px] rounded-2xl transition-all duration-200
                  ${isMatched 
                    ? "border-green-400 bg-green-100 animate-matchPop" 
                    : isError 
                      ? "border-red-400 bg-red-100 animate-shakeX"
                      : isSelected
                        ? "border-blue-400 bg-blue-50 shadow-md translate-y-[-2px]"
                        : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50 active:translate-y-0 shadow-sm"}
                `}
              >
                <div className={`
                  w-6 h-6 rounded-lg border-2 flex items-center justify-center text-[10px] font-bold
                  ${isSelected ? "border-blue-400 text-blue-500" : "border-gray-200 text-gray-400"}
                `}>
                  {badgeNum}
                </div>
                <div className="flex-1 text-center flex flex-col justify-center">
                  <span className="text-sm font-bold text-gray-800 font-outfit uppercase tracking-tighter leading-tight">{s.latin}</span>
                  <span className="text-[9px] text-gray-400 font-bold uppercase leading-tight">{s.fr}</span>
                </div>
                {isMatched && <span className="absolute top-1 right-2 text-green-600 text-xs font-bold transition-all">✓</span>}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex justify-between items-center pt-8 border-t border-gray-100 mt-4 px-2">
        <button 
          onClick={onRoundComplete}
          className="border-2 border-gray-200 text-gray-400 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-500 rounded-2xl px-6 py-3 uppercase font-extrabold text-[10px] tracking-widest transition-all active:scale-95 shadow-sm"
        >
          PASSER
        </button>
        <button 
          disabled={!allFound}
          onClick={onRoundComplete}
          className={`
            px-10 py-3 uppercase font-extrabold text-[10px] tracking-[0.15em] rounded-2xl transition-all duration-150
            ${allFound 
              ? "bg-green-500 text-white shadow-[0_4px_0_#16a34a] hover:bg-green-400 hover:translate-y-[1px] hover:shadow-[0_3px_0_#16a34a] active:translate-y-[4px] active:shadow-none" 
              : "bg-gray-200 text-gray-400 cursor-not-allowed"}
          `}
        >
          VALIDER
        </button>
      </div>
    </div>
  );
}
