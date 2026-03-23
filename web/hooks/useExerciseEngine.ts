"use client";

import { useState, useCallback, useMemo, useEffect } from "react";

export function useExerciseEngine<T>(items: T[], getId: (item: T) => string) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [queue, setQueue] = useState<T[]>(items);
  const [passFailures, setPassFailures] = useState<T[]>([]);
  const [results, setResults] = useState<Record<string, "success" | "failed">>({});
  const [isFinished, setIsFinished] = useState(false);
  const [isRetryPass, setIsRetryPass] = useState(false);

  useEffect(() => {
    if (items.length > 0) {
      setQueue(items);
      setCurrentIndex(0);
      setIsFinished(false);
      setIsRetryPass(false);
    }
  }, [items]);

  const currentExercise = useMemo(() => queue[currentIndex] || null, [queue, currentIndex]);
  const totalExercises = items.length;

  const successCount = useMemo(() => {
    return Object.values(results).filter(s => s === "success").length;
  }, [results]);

  const progressPercent = useMemo(() => {
    if (totalExercises === 0) return 0;
    return Math.floor((successCount / totalExercises) * 100);
  }, [successCount, totalExercises]);

  const markSuccess = useCallback(() => {
    if (!currentExercise) return;
    const id = getId(currentExercise);
    setResults(prev => ({ ...prev, [id]: "success" }));
  }, [currentExercise, getId]);

  const markFailed = useCallback(() => {
    if (!currentExercise) return;
    const id = getId(currentExercise);
    setResults(prev => ({ ...prev, [id]: "failed" }));
    setPassFailures(prev => {
      if (prev.find(item => getId(item) === id)) return prev;
      return [...prev, currentExercise];
    });
  }, [currentExercise, getId]);

  const next = useCallback(() => {
    if (currentIndex < queue.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      // End of current queue
      if (passFailures.length === 0) {
        setIsFinished(true);
      } else {
        // Start retry pass
        setQueue(passFailures);
        setPassFailures([]);
        setCurrentIndex(0);
        setIsRetryPass(true);
      }
    }
  }, [currentIndex, queue.length, passFailures]);

  return {
    currentExercise,
    currentIndex,
    totalExercises,
    successCount,
    progressPercent,
    isFinished,
    isRetryPass,
    markSuccess,
    markFailed,
    next,
    statuses: results
  };
}
