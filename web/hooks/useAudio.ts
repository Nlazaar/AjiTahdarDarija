'use client';

/**
 * Compatibilité ascendante : `useAudio()` expose l'API historique
 * (speak / stop + flag isPlaying) mais délègue tout au `AudioContext` global.
 *
 * Les nouveaux composants devraient importer `useAudioCtx` directement.
 */
import { useAudioCtx } from '@/contexts/AudioContext';

export interface UseAudioReturn {
  speak: (text: string, lang?: string) => Promise<boolean>;
  stop: () => void;
  isPlaying: boolean;
}

export function useAudio(): UseAudioReturn {
  const { speak, stop, isPlaying } = useAudioCtx();
  return {
    speak: async (text: string, lang?: string) => {
      if (!text?.trim()) return false;
      speak(text, lang);
      return true;
    },
    stop,
    isPlaying,
  };
}

export default useAudio;
