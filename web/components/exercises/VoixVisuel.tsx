"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useAudio } from "@/hooks/useAudio";

export type VisualAsset =
  | { kind: "color"; value: string }               // hex
  | { kind: "emoji"; value: string }
  | { kind: "number"; value: string }
  | { kind: "image"; url: string; alt?: string }
  | { kind: "text"; value: string; lang?: "ar" | "fr" | "darija" };

export type VoixVisuelItem = {
  id: string;
  audio: { url?: string; fallbackText: string };
  visual: VisualAsset;
  label?: string;
};

export type VoixVisuelConfig = {
  mode: "ligne" | "drag";
  prompt?: string;
  items: VoixVisuelItem[];
};

interface Props {
  config: VoixVisuelConfig;
  onReadyChange?: (ready: boolean) => void;
  onConfirm?: () => void;
}

const COLORS = {
  green: "#58cc02",
  gold: "#d4a84b",
  blue: "#1cb0f6",
  red: "#ff4b4b",
  sub: "#8a9baa",
  border: "#2a3d47",
  card: "#1a242b",
};

// Palette de binômes (alignée sur TrouverLesPaires — identité visuelle Maroc)
const PAIR_COLORS: { border: string; bg: string }[] = [
  { border: "#006233", bg: "#0d2219" }, // vert drapeau
  { border: "#c17450", bg: "#2a1a12" }, // terracotta
  { border: "#1e4d8c", bg: "#0f1c30" }, // bleu Majorelle
  { border: "#b38a3f", bg: "#24200a" }, // or henné
  { border: "#7a4e6f", bg: "#201422" }, // aubergine
  { border: "#2a8274", bg: "#0f2220" }, // sarcelle
  { border: "#8c2a2a", bg: "#2a1010" }, // rouge henné
  { border: "#4a5d23", bg: "#14180a" }, // olive
];

function shuffle<T>(arr: T[], seed: string): T[] {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  const out = arr.slice();
  for (let i = out.length - 1; i > 0; i--) {
    h = (h * 1103515245 + 12345) >>> 0;
    const j = h % (i + 1);
    [out[i], out[j]] = [out[j]!, out[i]!];
  }
  return out;
}

function VisualTile({ asset, size = 72 }: { asset: VisualAsset; size?: number }) {
  const base: React.CSSProperties = {
    width: size,
    height: size,
    borderRadius: 14,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 900,
    fontSize: 26,
    color: "#fff",
    userSelect: "none",
    boxShadow: "inset 0 0 0 2px rgba(255,255,255,0.12)",
  };
  if (asset.kind === "color") return <div style={{ ...base, background: asset.value }} aria-hidden />;
  if (asset.kind === "emoji")
    return (
      <div style={{ ...base, background: COLORS.card, fontSize: size * 0.55 }}>{asset.value}</div>
    );
  if (asset.kind === "number")
    return (
      <div style={{ ...base, background: COLORS.card, fontSize: size * 0.45 }}>{asset.value}</div>
    );
  if (asset.kind === "image")
    return (
      <div style={{ ...base, background: COLORS.card, overflow: "hidden" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={asset.url} alt={asset.alt ?? ""} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>
    );
  // text
  return (
    <div
      style={{
        ...base,
        background: COLORS.card,
        fontSize: size * 0.35,
        direction: asset.lang === "ar" || asset.lang === "darija" ? "rtl" : "ltr",
        fontFamily: asset.lang === "ar" || asset.lang === "darija" ? "var(--font-amiri), serif" : undefined,
        textAlign: "center",
        padding: 4,
      }}
    >
      {asset.value}
    </div>
  );
}

function AudioChip({
  label,
  playing,
  onPlay,
  state = "idle",
  pairColor,
  draggable = false,
  onDragStart,
  onDragEnd,
}: {
  label: string;
  playing: boolean;
  onPlay: () => void;
  state?: "idle" | "selected" | "matched" | "wrong";
  pairColor?: { border: string; bg: string };
  draggable?: boolean;
  onDragStart?: (e: React.DragEvent) => void;
  onDragEnd?: (e: React.DragEvent) => void;
}) {
  const stateStyle: Record<typeof state, React.CSSProperties> = {
    idle: { borderColor: COLORS.border, background: COLORS.card },
    selected: { borderColor: COLORS.gold, background: `${COLORS.gold}22`, transform: "scale(1.02)" },
    matched: pairColor
      ? { borderColor: pairColor.border, background: pairColor.bg, opacity: 0.95 }
      : { borderColor: COLORS.green, background: `${COLORS.green}22`, opacity: 0.65 },
    wrong: { borderColor: COLORS.red, background: `${COLORS.red}22` },
  };
  return (
    <button
      type="button"
      onClick={onPlay}
      draggable={draggable && state !== "matched"}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      disabled={state === "matched"}
      aria-label={`Écouter ${label}`}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "10px 14px",
        borderRadius: 14,
        border: "2px solid",
        color: "#fff",
        fontWeight: 800,
        fontSize: 14,
        cursor: state === "matched" ? "default" : draggable ? "grab" : "pointer",
        transition: "all 0.15s",
        minWidth: 120,
        justifyContent: "flex-start",
        ...stateStyle[state],
      }}
    >
      <span
        aria-hidden
        style={{
          width: 36,
          height: 36,
          borderRadius: 10,
          background: playing ? COLORS.blue : "rgba(28,176,246,0.2)",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 18,
          flexShrink: 0,
          transition: "background 0.15s",
        }}
      >
        🔊
      </span>
      <span style={{ opacity: 0.9 }}>{playing ? "…" : "Écouter"}</span>
    </button>
  );
}

export default function VoixVisuel({ config, onReadyChange, onConfirm }: Props) {
  const { speak, stop } = useAudio();
  const { mode, prompt, items } = config;

  // Ordre mélangé (stable par signature d'items)
  const sig = useMemo(() => items.map((i) => i.id).join("|"), [items]);
  const audios = useMemo(() => shuffle(items, `a:${sig}`), [items, sig]);
  const visuals = useMemo(() => shuffle(items, `v:${sig}`), [items, sig]);

  // État: matches audioItemId → visualItemId (si === audioItemId alors correct)
  const [matches, setMatches] = useState<Record<string, string>>({});
  // Ordre de découverte des paires (id → index dans la palette)
  const [matchOrder, setMatchOrder] = useState<string[]>([]);
  const [selectedAudio, setSelectedAudio] = useState<string | null>(null);
  const [wrong, setWrong] = useState<{ a: string; v: string } | null>(null);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);

  useEffect(() => {
    setMatches({});
    setMatchOrder([]);
    setSelectedAudio(null);
    setWrong(null);
  }, [sig]);

  const pairColorFor = (id: string): { border: string; bg: string } | undefined => {
    const idx = matchOrder.indexOf(id);
    if (idx < 0) return undefined;
    return PAIR_COLORS[idx % PAIR_COLORS.length];
  };

  const allMatched = items.length > 0 && items.every((it) => matches[it.id] === it.id);
  useEffect(() => {
    onReadyChange?.(allMatched);
    if (allMatched && onConfirm) onConfirm();
  }, [allMatched, onConfirm, onReadyChange]);

  const playItem = async (it: VoixVisuelItem) => {
    stop();
    setPlayingId(it.id);
    try {
      if (it.audio.url) {
        await new Promise<void>((resolve) => {
          const a = new Audio(it.audio.url);
          a.onended = () => resolve();
          a.onerror = () => resolve();
          a.play().catch(() => resolve());
        });
      } else {
        await speak(it.audio.fallbackText, "ar");
      }
    } finally {
      setPlayingId(null);
    }
  };

  const attemptMatch = (audioId: string, visualId: string) => {
    if (audioId === visualId) {
      setMatches((m) => ({ ...m, [audioId]: visualId }));
      setMatchOrder((o) => (o.includes(audioId) ? o : [...o, audioId]));
      setSelectedAudio(null);
    } else {
      setWrong({ a: audioId, v: visualId });
      setTimeout(() => setWrong(null), 450);
    }
  };

  const handleAudioClick = (it: VoixVisuelItem) => {
    playItem(it);
    // En mode drag, le clic reste un fallback tactile (sélectionne la voix
    // pour un placement au clic). En mode ligne, c'est le mécanisme principal.
    if (!matches[it.id]) {
      setSelectedAudio((prev) => (prev === it.id ? null : it.id));
    }
  };

  const handleVisualClick = (visualItemId: string) => {
    if (!selectedAudio) return;
    attemptMatch(selectedAudio, visualItemId);
  };

  const handleDragStart = (audioId: string) => (e: React.DragEvent) => {
    if (matches[audioId]) return;
    setDraggingId(audioId);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", audioId);
  };

  const handleDragEnd = () => setDraggingId(null);

  const handleDrop = (visualItemId: string) => (e: React.DragEvent) => {
    e.preventDefault();
    const audioId = e.dataTransfer.getData("text/plain") || draggingId;
    if (!audioId) return;
    attemptMatch(audioId, visualItemId);
    setDraggingId(null);
  };

  const allowDrop = (e: React.DragEvent) => {
    if (mode === "drag") e.preventDefault();
  };

  const audioState = (id: string): "idle" | "selected" | "matched" | "wrong" => {
    if (matches[id]) return "matched";
    if (wrong?.a === id) return "wrong";
    if (selectedAudio === id) return "selected";
    return "idle";
  };

  const visualStateStyle = (visualId: string): React.CSSProperties => {
    const matchedByAny = Object.entries(matches).some(([a, v]) => v === visualId && a === v);
    const isWrong = wrong?.v === visualId;
    if (matchedByAny) {
      const pc = pairColorFor(visualId);
      return pc
        ? { borderColor: pc.border, boxShadow: `0 0 0 3px ${pc.border}66`, background: pc.bg }
        : { borderColor: COLORS.green, boxShadow: `0 0 0 3px ${COLORS.green}55`, opacity: 0.85 };
    }
    if (isWrong) return { borderColor: COLORS.red, boxShadow: `0 0 0 3px ${COLORS.red}55` };
    if (draggingId && mode === "drag")
      return { borderColor: COLORS.gold, boxShadow: `0 0 0 2px ${COLORS.gold}44` };
    return { borderColor: COLORS.border };
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {prompt && (
        <p
          style={{
            fontSize: 14,
            color: COLORS.sub,
            textAlign: "center",
            margin: 0,
            fontWeight: 600,
            lineHeight: 1.4,
          }}
        >
          {prompt}
        </p>
      )}

      <div style={{ fontSize: 11, color: COLORS.sub, textAlign: "center", fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase" }}>
        {mode === "ligne"
          ? "Clique une voix, puis son visuel"
          : "Glisse ou clique une voix, puis son visuel"}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {/* Colonne voix */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {audios.map((it) => (
            <AudioChip
              key={`a-${it.id}`}
              label={it.label ?? it.audio.fallbackText}
              playing={playingId === it.id}
              onPlay={() => handleAudioClick(it)}
              state={audioState(it.id)}
              pairColor={matches[it.id] ? pairColorFor(it.id) : undefined}
              draggable={mode === "drag"}
              onDragStart={handleDragStart(it.id)}
              onDragEnd={handleDragEnd}
            />
          ))}
        </div>

        {/* Colonne visuels */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: items.length <= 4 ? "1fr" : "repeat(2, 1fr)",
            gap: 10,
            justifyItems: "center",
          }}
        >
          {visuals.map((it) => {
            const tileWrap: React.CSSProperties = {
              padding: 6,
              borderRadius: 18,
              border: "2px dashed",
              transition: "all 0.15s",
              cursor: selectedAudio && !matches[selectedAudio] ? "pointer" : "default",
              ...visualStateStyle(it.id),
            };
            return (
              <div
                key={`v-${it.id}`}
                onClick={() => handleVisualClick(it.id)}
                onDragOver={allowDrop}
                onDrop={handleDrop(it.id)}
                role="button"
                aria-label={it.label ?? "visuel"}
                style={tileWrap}
              >
                <VisualTile asset={it.visual} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
