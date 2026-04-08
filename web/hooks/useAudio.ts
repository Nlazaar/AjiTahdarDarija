"use client";

import { useCallback, useRef } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

/**
 * Stratégie TTS à 3 niveaux (par ordre de qualité) :
 *
 *  1. Fichier MP3 statique pré-généré  → /audio/vocab/{slug}.mp3
 *     (zéro latence, meilleure qualité Habibi-TTS)
 *
 *  2. API backend  → GET /audio/tts?text=...
 *     (génération à la volée + mise en cache automatique côté serveur)
 *     Activé si HABIBI_TTS_URL ou HUGGINGFACE_API_KEY est configuré.
 *
 *  3. Web Speech API  → window.speechSynthesis (ar-MA)
 *     (fallback dégradé — qualité médiocre mais toujours disponible)
 */

/** Génère le même slug MD5 que AudioService.slug() côté backend */
async function computeSlug(text: string): Promise<string> {
  const encoder  = new TextEncoder();
  const data     = encoder.encode(text.trim().toLowerCase());
  const hashBuf  = await crypto.subtle.digest("SHA-256", data);
  const hashArr  = Array.from(new Uint8Array(hashBuf));
  return hashArr.map(b => b.toString(16).padStart(2, "0")).join("").slice(0, 16);
}

export function useAudio() {
  const audioRef  = useRef<HTMLAudioElement | null>(null);
  const cacheRef  = useRef<Map<string, string>>(new Map()); // text → objectURL

  const stop = useCallback(() => {
    if (typeof window === "undefined") return;
    window.speechSynthesis?.cancel();
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, []);

  /**
   * Joue l'audio pour `text` (Darija arabe ou translittération).
   * Utilise la meilleure source disponible dans l'ordre.
   */
  const speak = useCallback(async (text: string, _lang = "ar-MA") => {
    if (typeof window === "undefined") return;
    stop();

    // ── Niveau 1 : fichier statique pré-généré ──────────────────────
    try {
      const slug    = await computeSlug(text);
      const staticUrl = `/audio/vocab/${slug}.mp3`;
      const head = await fetch(staticUrl, { method: "HEAD" });
      if (head.ok) {
        await playUrl(staticUrl);
        return;
      }
    } catch { /* continue vers niveau 2 */ }

    // ── Niveau 2 : API backend (Habibi-TTS / HuggingFace) ──────────
    try {
      const cached = cacheRef.current.get(text);
      if (cached) {
        await playUrl(cached);
        return;
      }

      const res = await fetch(
        `${API_BASE}/audio/tts?text=${encodeURIComponent(text)}`,
        { signal: AbortSignal.timeout(8000) },
      );
      if (res.ok) {
        const blob      = await res.blob();
        const objectUrl = URL.createObjectURL(blob);
        cacheRef.current.set(text, objectUrl);
        await playUrl(objectUrl);
        return;
      }
    } catch { /* continue vers niveau 3 */ }

    // ── Niveau 3 : Web Speech API (fallback dégradé) ─────────────────
    if (window.speechSynthesis) {
      const utterance  = new SpeechSynthesisUtterance(text);
      utterance.lang   = "ar-MA";
      utterance.rate   = 0.8;
      window.speechSynthesis.speak(utterance);
    }
  }, [stop]);

  /** Joue directement un fichier audio depuis une URL */
  const play = useCallback(async (src: string) => {
    if (typeof window === "undefined") return;
    stop();
    await playUrl(src);
  }, [stop]);

  async function playUrl(src: string) {
    if (!audioRef.current) audioRef.current = new Audio();
    audioRef.current.src = src;
    try {
      await audioRef.current.play();
    } catch (err) {
      console.warn("[useAudio] playback failed:", err);
    }
  }

  return { speak, play, stop };
}
