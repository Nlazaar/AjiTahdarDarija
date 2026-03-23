"use client";

import { useCallback, useRef } from "react";

export function useAudio() {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const stop = useCallback(() => {
    if (typeof window === "undefined") return;

    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, []);

  const speak = useCallback((text: string, lang: string = "ar-MA") => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;

    stop();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 0.8;
    window.speechSynthesis.speak(utterance);
  }, [stop]);

  const play = useCallback((src: string) => {
    if (typeof window === "undefined") return;

    stop();
    if (!audioRef.current) {
      audioRef.current = new Audio();
    }
    audioRef.current.src = src;
    audioRef.current.play().catch(err => console.error("Audio playback failed:", err));
  }, [stop]);

  return { speak, play, stop };
}
