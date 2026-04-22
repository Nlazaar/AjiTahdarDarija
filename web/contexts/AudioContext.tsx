'use client';

import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';

interface AudioContextType {
  speak: (text: string, lang?: string) => void;
  stop: () => void;
  isPlaying: boolean;
  setCustomTTS: (fn: ((text: string, lang?: string) => Promise<void>) | null) => void;
}

const AudioCtx = createContext<AudioContextType | null>(null);

function pickArabicVoice(voices: SpeechSynthesisVoice[], lang: string): SpeechSynthesisVoice | null {
  const target = lang.toLowerCase();
  const isMsa  = target.startsWith('ar-sa');
  // Pour le MSA, on évite ar-MA en fallback (accent darija sur un texte arabe standard).
  const avoid  = isMsa ? 'ar-ma' : '';
  return (
    voices.find(v => v.lang.toLowerCase() === target) ||
    voices.find(v => v.lang.toLowerCase().startsWith(target)) ||
    // Fallback 1 : toute voix arabe standard (ar-SA, ar-EG, etc.) pour MSA
    (isMsa
      ? voices.find(v => v.lang.toLowerCase().startsWith('ar-sa') || v.lang.toLowerCase().startsWith('ar-eg'))
      : voices.find(v => v.lang === 'ar-MA') || voices.find(v => v.lang.toLowerCase().startsWith('ar-ma'))) ||
    // Fallback 2 : n'importe quelle voix arabe, sauf celle à éviter
    voices.find(v => v.lang.toLowerCase().startsWith('ar') && !(avoid && v.lang.toLowerCase().startsWith(avoid))) ||
    voices.find(v => v.lang.toLowerCase().startsWith('ar')) ||
    null
  );
}

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const currentUtter = useRef<SpeechSynthesisUtterance | null>(null);
  const customTTSRef = useRef<((text: string, lang?: string) => Promise<void>) | null>(null);

  // Précharger la liste de voix (certains navigateurs renvoient [] au premier appel)
  useEffect(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    const synth = window.speechSynthesis;
    if (synth.getVoices().length === 0) {
      synth.onvoiceschanged = () => { /* force hydrate */ };
    }
  }, []);

  const stop = useCallback(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    currentUtter.current = null;
    setIsPlaying(false);
  }, []);

  const speak = useCallback(async (text: string, lang: string = 'ar-MA') => {
    if (!text?.trim() || typeof window === 'undefined') return;

    // Si le track actif est MSA, force la voix arabe standard (ar-SA) même
    // si les callers historiques passent 'ar-MA' en dur.
    const track = typeof localStorage !== 'undefined'
      ? localStorage.getItem('darija_lang_track')
      : null;
    if (track === 'MSA' && lang.toLowerCase().startsWith('ar-ma')) {
      lang = 'ar-SA';
    }

    // Ne parler QUE l'arabe si la chaîne est mélangée (évite de lire "bonjour en arabe :" à voix haute)
    const arabicOnly = text
      .split('\n')
      .filter(l => /[\u0600-\u06FF]/.test(l))
      .join(' ')
      .trim() || text;

    // 1. TTS custom (Habibi, Azure, etc.) si branché
    if (customTTSRef.current) {
      try {
        setIsPlaying(true);
        await customTTSRef.current(arabicOnly, lang);
        setIsPlaying(false);
        return;
      } catch {
        // fallback navigateur
      }
    }

    // 2. Web Speech API
    const synth = window.speechSynthesis;
    if (!synth) return;
    synth.cancel();

    const trySpeak = () => {
      const u = new SpeechSynthesisUtterance(arabicOnly);
      const best = pickArabicVoice(synth.getVoices(), lang);
      if (best) u.voice = best;
      u.lang = best?.lang ?? lang;
      u.rate = 0.85;
      u.pitch = 1;
      u.onstart = () => setIsPlaying(true);
      u.onend = () => setIsPlaying(false);
      u.onerror = () => setIsPlaying(false);
      currentUtter.current = u;
      synth.speak(u);
    };

    if (synth.getVoices().length > 0) {
      trySpeak();
    } else {
      // Voix pas encore chargées (Chrome au boot)
      const handler = () => { synth.onvoiceschanged = null; trySpeak(); };
      synth.onvoiceschanged = handler;
      // Filet de sécurité — tente quand même après 300ms
      setTimeout(() => { if (currentUtter.current === null) trySpeak(); }, 300);
    }
  }, []);

  const setCustomTTS = useCallback(
    (fn: ((text: string, lang?: string) => Promise<void>) | null) => {
      customTTSRef.current = fn;
    },
    [],
  );

  return (
    <AudioCtx.Provider value={{ speak, stop, isPlaying, setCustomTTS }}>
      {children}
    </AudioCtx.Provider>
  );
}

export function useAudioCtx(): AudioContextType {
  const ctx = useContext(AudioCtx);
  if (!ctx) {
    // Fallback no-op en dev/tests au cas où un composant serait monté hors du Provider
    if (typeof window !== 'undefined') {
      console.warn('useAudioCtx called outside <AudioProvider>. Falling back to no-op.');
    }
    return {
      speak: () => {},
      stop: () => {},
      isPlaying: false,
      setCustomTTS: () => {},
    };
  }
  return ctx;
}
