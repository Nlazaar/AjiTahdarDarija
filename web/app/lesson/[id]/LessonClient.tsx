"use client";

import React, { useState } from "react";
import Flashcard from "@/components/Flashcard";
import NouveauMotDuolingo from "./NouveauMotDuolingo";
import MinimalProgress from "./MinimalProgress";
import { useRouter } from "next/navigation";
import { Lesson, Exercise } from "@/lib/api";
import { submitLesson } from "@/lib/api";
import { useApi } from "@/hooks/useApi";
import Bravo from "@/components/Bravo";
import { X, Heart, Volume2 } from "lucide-react";
import { useUser } from "@/context/UserContext";

function enrichOption(optStr: string) {
  const keywordsToIcons: Record<string, string> = {
    tea: "🍵",
    hello: "👋",
    good: "👍",
    water: "💧",
    bread: "🥖",
    marhba: "🏠",
    ahlan: "👋",
    sba7: "🌅",
  };

  const iconFallback = ["🌙", "🐪", "🕌", "🌴", "🍊"];
  const icon =
    Object.entries(keywordsToIcons).find(([k]) => optStr.toLowerCase().includes(k))?.[1] ||
    iconFallback[Math.floor(Math.random() * iconFallback.length)];

  const arabicMatch = optStr.match(/[\u0600-\u06FF\s]+/);
  const arabic = arabicMatch ? arabicMatch[0].trim() : (optStr.includes("(") ? "" : "كلمة");
  let latin = optStr.replace(/[\u0600-\u06FF\s]+/, "").trim() || optStr;
  latin = latin.replace(/^[()]+|[()]+$/g, "").trim();

  return { raw: optStr, arabic, latin, icon };
}

export default function LessonClient({ lesson, exercises, userId }: { lesson: Lesson; exercises: Exercise[]; userId: string }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<any[]>([]);
  const [isFinished, setIsFinished] = useState(false);
  const [result, setResult] = useState<any>(null);

  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [hearts, setHearts] = useState(5);

  const { callApi } = useApi();
  const router = useRouter();
  const { mascot } = useUser();

  const currentExercise = exercises[currentIndex];
  const progress = (currentIndex / exercises.length) * 100;

  const handleCheck = () => {
    if (!selectedOption) return;
    const correct = selectedOption === currentExercise.options?.[0];
    setIsCorrect(correct);
    setShowFeedback(true);
    setAnswers([...answers, { exerciseId: currentExercise.id, answer: selectedOption, correct }]);
    if (!correct && hearts > 0) setHearts((h) => h - 1);
  };

  const finishLesson = async () => {
    try {
      const res = await callApi(submitLesson, lesson.id, { userId, answers });
      setResult(res);
      setIsFinished(true);
    } catch (err) {
      setIsFinished(true);
      setResult({ xpEarned: 15, streak: 1, heartsRemaining: hearts });
    }
  };

  const handleNext = () => {
    setShowFeedback(false);
    setIsCorrect(null);
    setSelectedOption(null);
    if (currentIndex < exercises.length - 1) setCurrentIndex((i) => i + 1);
    else finishLesson();
  };

  if (isFinished) return <Bravo xp={result?.xpEarned || 15} streak={result?.streak || 1} hearts={result?.heartsRemaining || hearts} />;
  if (!currentExercise) return null;

  // Nouveau mot maquette (Duolingo-like)
  if (currentExercise.type === "new-word") {
    const word = (currentExercise as any).word ?? (currentExercise as any).words?.[0] ?? { darija: 'زوين', latin: 'zwine', fr: 'beau / joli' };
    const progressionValue = (currentExercise as any).progression ?? 5;
    const idx = (currentExercise as any).index ?? currentIndex + 1;
    const total = (currentExercise as any).total ?? Math.max(4, exercises.length);

    return (
      <div className="min-h-screen bg-[#fbfdfd] relative">
        <MinimalProgress value={Math.round(progress)} />
        <main className="pt-6">
          <NouveauMotDuolingo
            word={word}
            progression={progressionValue}
            index={idx}
            total={total}
            onContinue={handleNext}
            onSkip={handleNext}
          />
        </main>
      </div>
    );
  }

  // Flashcards
  if (currentExercise.type === "flashcards") {
    const words = (currentExercise as any).words ?? [];
    return (
      <div className="min-h-screen bg-[#fbfdfd] z-[60] flex flex-col font-sans relative overflow-auto">
        <div className="absolute inset-0 z-0 pointer-events-none bg-zellige" style={{ opacity: 0.03 }} />

        <div className="sticky top-0 bg-[#fbfdfd] w-full z-40 border-b border-gray-100">
          <div className="max-w-5xl mx-auto px-6 py-3 flex items-center justify-between">
            <button onClick={() => router.back()} className="text-gray-400 hover:text-gray-600 p-2 rounded-full">
              <X size={28} strokeWidth={2.2} />
            </button>
            <div className="flex-1 mx-6">
              <div className="w-full bg-[#f1f5f1] rounded-full h-3">
                <div style={{ width: `${progress}%` }} className="h-3 rounded-full bg-[#34D399] transition-all duration-300" />
              </div>
            </div>
            <div className="flex items-center gap-2 text-red-500 font-semibold">
              <Heart size={18} fill="currentColor" />
              <div className="text-sm">{hearts}</div>
            </div>
          </div>
        </div>

        <main className="flex-1 flex items-start justify-center w-full max-w-5xl mx-auto px-4 z-10 relative pt-8 pb-36">
          <Flashcard words={words} onFinish={handleNext} lang="fr" />
        </main>

        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t py-3">
          <div className="max-w-5xl mx-auto px-6 flex items-center justify-start gap-4">
            <button onClick={handleNext} className="px-4 py-2 rounded-full border border-gray-200 text-gray-600 bg-white">PASSER</button>
          </div>
        </div>
      </div>
    );
  }

  // Exercises view
  // Render MCQ Duolingo-like layout
  if (currentExercise.type === 'mcq') {
    const options = (currentExercise as any).options?.map((o: string, i: number) => ({ id: `${i}`, label: o, image: undefined })) || []
    return (
      <div className="min-h-screen bg-[#fbfdfd] z-[60] flex flex-col font-sans relative overflow-auto">
        <div className="absolute inset-0 z-0 pointer-events-none bg-zellige" style={{ opacity: 0.03 }} />
        <div className="z-40">
          <ProgressHeader percent={Math.round(progress)} hearts={hearts} />
        </div>

        <main className="flex-1 w-full max-w-6xl mx-auto px-6 pt-8 pb-36">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-3 mb-4">
              <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-violet-100 text-violet-600 font-bold">✦</div>
              <div className="text-xs font-bold text-violet-600 uppercase tracking-wider">NOUVEAU MOT</div>
            </div>

            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-8">{currentExercise.question}</h1>

            <div className="mb-12">
              <OptionGrid options={options} selectedId={selectedOption} onSelect={(id) => setSelectedOption(id)} />
            </div>
          </div>
        </main>

        <BottomActions canValidate={!!selectedOption || showFeedback} onSkip={() => handleNext()} onValidate={() => showFeedback ? handleNext() : handleCheck()} />
      </div>
    )
  }
}
