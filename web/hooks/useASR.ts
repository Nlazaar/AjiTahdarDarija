import { useCallback, useRef, useState } from "react";

export type ASRState = "idle" | "listening" | "error";

interface UseASRReturn {
  state: ASRState;
  start: (onResult: (text: string) => void) => void;
  stop: () => void;
  supported: boolean;
}

export function useASR(): UseASRReturn {
  const [state, setState] = useState<ASRState>("idle");
  const recRef = useRef<any>(null);

  const supported =
    typeof window !== "undefined" &&
    ("SpeechRecognition" in window || "webkitSpeechRecognition" in window);

  const stop = useCallback(() => {
    recRef.current?.stop();
    setState("idle");
  }, []);

  const start = useCallback((onResult: (text: string) => void) => {
    if (typeof window === "undefined") return;
    const SpeechRec = (window as any).SpeechRecognition ?? (window as any).webkitSpeechRecognition;
    if (!SpeechRec) { setState("error"); return; }

    const rec = new SpeechRec();
    rec.lang = "ar-MA";
    rec.continuous = false;
    rec.interimResults = false;
    rec.maxAlternatives = 1;

    rec.onstart = () => setState("listening");
    rec.onend = () => setState("idle");
    rec.onerror = (e: any) => {
      console.warn("[ASR]", e.error);
      setState(e.error === "not-allowed" ? "error" : "idle");
    };
    rec.onresult = (e: any) => {
      const text = e.results?.[0]?.[0]?.transcript ?? "";
      if (text) onResult(text.trim());
    };

    recRef.current = rec;
    setState("listening");
    rec.start();
  }, []);

  return { state, start, stop, supported };
}
