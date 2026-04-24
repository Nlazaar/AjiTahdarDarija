"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useAudio } from "@/hooks/useAudio";
import type { VisualAsset } from "./VoixVisuel";

export type TrouverIntrusItem = {
  id: string;
  audio: { url?: string; fallbackText: string };
  visual: VisualAsset;
  label?: string;
};

export type TrouverIntrusConfig = {
  prompt?: string;
  items: TrouverIntrusItem[];
  /** IDs des items dont la voix est jouée (l'intrus = item absent de cette liste). */
  playedIds: string[];
};

interface Props {
  config: TrouverIntrusConfig;
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

function VisualTile({ asset, size = 90 }: { asset: VisualAsset; size?: number }) {
  const base: React.CSSProperties = {
    width: size,
    height: size,
    borderRadius: 14,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 900,
    color: "#fff",
    userSelect: "none",
    boxShadow: "inset 0 0 0 2px rgba(255,255,255,0.12)",
  };
  if (asset.kind === "color") return <div style={{ ...base, background: asset.value }} aria-hidden />;
  if (asset.kind === "emoji")
    return <div style={{ ...base, background: COLORS.card, fontSize: size * 0.55 }}>{asset.value}</div>;
  if (asset.kind === "number")
    return <div style={{ ...base, background: COLORS.card, fontSize: size * 0.45 }}>{asset.value}</div>;
  if (asset.kind === "image")
    return (
      <div style={{ ...base, background: COLORS.card, overflow: "hidden" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={asset.url} alt={asset.alt ?? ""} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>
    );
  return (
    <div
      style={{
        ...base,
        background: COLORS.card,
        fontSize: size * 0.3,
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

export default function TrouverIntrus({ config, onReadyChange, onConfirm }: Props) {
  const { speak, stop } = useAudio();
  const { prompt, items, playedIds } = config;

  const intrusId = useMemo(() => {
    const set = new Set(playedIds);
    return items.find((i) => !set.has(i.id))?.id ?? null;
  }, [items, playedIds]);

  const [playedSet, setPlayedSet] = useState<Set<number>>(new Set());
  const [playingIndex, setPlayingIndex] = useState<number>(-1);
  const [picked, setPicked] = useState<string | null>(null);
  const [correct, setCorrect] = useState<boolean | null>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    setPlayedSet(new Set());
    setPlayingIndex(-1);
    setPicked(null);
    setCorrect(null);
    setDone(false);
  }, [items, playedIds]);

  const playOne = (index: number) => {
    const id = playedIds[index];
    const it = items.find((x) => x.id === id);
    if (!it) return;
    stop();
    setPlayingIndex(index);
    setPlayedSet((prev) => new Set(prev).add(index));
    const finish = () => setPlayingIndex((p) => (p === index ? -1 : p));
    if (it.audio.url) {
      const a = new Audio(it.audio.url);
      a.onended = finish;
      a.onerror = finish;
      a.play().catch(finish);
    } else {
      speak(it.audio.fallbackText, "ar").then(finish).catch(finish);
    }
  };

  const handlePick = (id: string) => {
    if (done) return;
    const isCorrect = id === intrusId;
    setPicked(id);
    setCorrect(isCorrect);
    if (isCorrect) setDone(true);
  };

  useEffect(() => {
    onReadyChange?.(done);
    if (done && onConfirm) onConfirm();
  }, [done, onConfirm, onReadyChange]);

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

      <div style={{ display: "flex", justifyContent: "center", gap: 10, flexWrap: "wrap" }}>
        {playedIds.map((_, i) => {
          const isPlaying = playingIndex === i;
          const wasPlayed = playedSet.has(i);
          return (
            <button
              key={i}
              onClick={() => playOne(i)}
              disabled={playingIndex !== -1 && !isPlaying}
              aria-label={`Jouer la voix ${i + 1}`}
              style={{
                width: 56,
                height: 56,
                borderRadius: 16,
                border: "none",
                background: isPlaying ? COLORS.gold : wasPlayed ? "#153a6b" : COLORS.blue,
                color: "#fff",
                fontSize: 18,
                fontWeight: 900,
                cursor: playingIndex !== -1 && !isPlaying ? "wait" : "pointer",
                boxShadow: isPlaying ? `0 0 0 4px ${COLORS.gold}44` : "0 4px 0 rgba(0,0,0,0.25)",
                transition: "all 0.15s",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 4,
              }}
            >
              <span style={{ fontSize: 14 }}>{isPlaying ? "▶" : wasPlayed ? "↻" : "🔊"}</span>
              <span>{i + 1}</span>
            </button>
          );
        })}
      </div>

      <div style={{ fontSize: 11, color: COLORS.sub, textAlign: "center", fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase" }}>
        {done
          ? "Bien joué !"
          : `Écoute chaque voix, puis clique sur l'intrus (la ${config.items[0]?.visual.kind === "color" ? "couleur" : "vignette"} non dite)`}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${Math.min(items.length, 4)}, 1fr)`,
          gap: 12,
          justifyItems: "center",
        }}
      >
        {items.map((it) => {
          const isPicked = picked === it.id;
          const reveal = done || (picked && !correct && isPicked);
          const borderColor = reveal
            ? it.id === intrusId
              ? COLORS.green
              : isPicked
                ? COLORS.red
                : COLORS.border
            : isPicked
              ? COLORS.gold
              : COLORS.border;
          return (
            <button
              key={it.id}
              type="button"
              onClick={() => handlePick(it.id)}
              disabled={done}
              aria-label={it.label ?? "item"}
              style={{
                padding: 6,
                borderRadius: 18,
                border: `3px solid ${borderColor}`,
                background: "transparent",
                cursor: done ? "default" : "pointer",
                transition: "all 0.15s",
                boxShadow: reveal && it.id === intrusId ? `0 0 0 4px ${COLORS.green}55` : undefined,
              }}
            >
              <VisualTile asset={it.visual} />
            </button>
          );
        })}
      </div>
    </div>
  );
}
