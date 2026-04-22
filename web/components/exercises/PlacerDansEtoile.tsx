"use client";

import React, { useEffect, useMemo, useState } from "react";
import StarShape, { STAR_POSITION_COORDS, type StarPosition } from "@/components/islam/StarShape";

export type { StarPosition };

export interface StarZone {
  id: string;
  position: StarPosition;
  numero: number;
  answer: string; // texte attendu (arabe avec chakl)
  fr?: string;
}

interface Props {
  zones: StarZone[];
  words: string[]; // banque (sera mélangée)
  onConfirm: () => void;
  onReadyChange?: (ready: boolean) => void;
  prompt?: string;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function PlacerDansEtoile({ zones, words, onConfirm, onReadyChange, prompt }: Props) {
  // Signature stable : ne re-shuffle que si les mots changent vraiment
  const wordsKey = words.join('|');
  const bank = useMemo(() => shuffle(words), [wordsKey]); // eslint-disable-line react-hooks/exhaustive-deps
  const [placements, setPlacements] = useState<Record<string, string>>({}); // zoneId → word
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [errorZoneId, setErrorZoneId] = useState<string | null>(null);

  const total = zones.length;
  const placedCount = Object.values(placements).filter(Boolean).length;
  const allCorrect = total > 0 && zones.every((z) => placements[z.id] === z.answer);

  useEffect(() => {
    onReadyChange?.(allCorrect);
  }, [allCorrect, onReadyChange]);

  const usedWords = new Set(Object.values(placements));

  const placeOnZone = (zoneId: string) => {
    if (!selectedWord) return;
    const zone = zones.find((z) => z.id === zoneId);
    if (!zone) return;
    if (selectedWord !== zone.answer) {
      setErrorZoneId(zoneId);
      setTimeout(() => setErrorZoneId(null), 600);
      setSelectedWord(null);
      return;
    }
    setPlacements((p) => ({ ...p, [zoneId]: selectedWord }));
    setSelectedWord(null);
  };

  return (
    <div
      className="animate-fade-up"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
        maxWidth: 760,
        margin: "0 auto",
      }}
    >
      <div style={{ marginBottom: 18, textAlign: "center" }}>
        <h1
          style={{
            fontSize: 24,
            fontWeight: 900,
            color: "#ffffff",
            marginBottom: 8,
            lineHeight: 1.2,
          }}
        >
          {prompt ?? "Place chaque pilier sur l'étoile"}
        </h1>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            background: placedCount > 0 ? "rgba(52,211,153,0.15)" : "#1e2d35",
            borderRadius: 20,
            padding: "4px 14px",
            marginTop: 6,
          }}
        >
          <span style={{ fontSize: 18, fontWeight: 900, color: placedCount > 0 ? "#34d399" : "#4a5d6a" }}>
            {placedCount}
          </span>
          <span style={{ fontSize: 13, color: "#6b7f8a", fontWeight: 600 }}>/ {total} placés</span>
        </div>
      </div>

      {/* Étoile SVG */}
      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: 460,
          aspectRatio: "1 / 1",
        }}
      >
        <StarShape gradientId="placerStarGrad" />

        {/* Zones de placement (positionnées en absolute en %) */}
        {zones.map((z) => {
          const coord = STAR_POSITION_COORDS[z.position];
          const placed = placements[z.id];
          const isError = errorZoneId === z.id;
          const correct = !!placed;

          let bg = "rgba(38,55,68,0.95)";
          let border = "#2a3d47";
          let text = "#ffffff";
          if (correct) {
            bg = "rgba(26,51,40,0.95)";
            border = "#34d399";
            text = "#34d399";
          } else if (isError) {
            bg = "rgba(58,30,30,0.95)";
            border = "#ff4b4b";
            text = "#ff4b4b";
          }

          return (
            <button
              key={z.id}
              onClick={() => placeOnZone(z.id)}
              disabled={correct}
              className={isError ? "animate-shake-x" : ""}
              style={{
                position: "absolute",
                left: `${coord.x}%`,
                top: `${coord.y}%`,
                transform: "translate(-50%, -50%)",
                minWidth: 96,
                minHeight: 56,
                padding: "8px 12px",
                background: bg,
                border: `2px solid ${border}`,
                borderRadius: 14,
                color: text,
                cursor: correct ? "default" : selectedWord ? "pointer" : "default",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 2,
                transition: "all 0.12s",
                boxShadow: correct ? "0 0 12px rgba(52,211,153,0.4)" : "0 4px 0 #1a2830",
              }}
            >
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 900,
                  color: correct ? "#34d399" : "#7c3aed",
                  letterSpacing: "0.08em",
                }}
              >
                #{z.numero}
              </span>
              <span
                style={{
                  fontFamily: '"Amiri", serif',
                  direction: "rtl",
                  fontSize: 16,
                  lineHeight: 1.15,
                  fontWeight: 700,
                  textAlign: "center",
                }}
              >
                {placed ?? "—"}
              </span>
              {correct && z.fr && (
                <span style={{ fontSize: 10, fontWeight: 700, opacity: 0.8 }}>{z.fr}</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Banque de mots */}
      <div
        style={{
          marginTop: 22,
          display: "flex",
          flexWrap: "wrap",
          gap: 10,
          justifyContent: "center",
          maxWidth: 640,
        }}
      >
        {bank.map((w) => {
          const used = usedWords.has(w);
          const isSelected = selectedWord === w;
          let bg = "#263744";
          let border = "#2a3d47";
          let text = "#ffffff";
          if (used) {
            bg = "#142028";
            border = "#1e2d35";
            text = "#3a4d57";
          } else if (isSelected) {
            bg = "#1a2e3e";
            border = "#1cb0f6";
            text = "#1cb0f6";
          }
          return (
            <button
              key={w}
              disabled={used}
              onClick={() => setSelectedWord(isSelected ? null : w)}
              style={{
                padding: "10px 14px",
                background: bg,
                border: `2px solid ${border}`,
                borderRadius: 12,
                color: text,
                fontFamily: '"Amiri", serif',
                direction: "rtl",
                fontSize: 18,
                fontWeight: 700,
                cursor: used ? "not-allowed" : "pointer",
                opacity: used ? 0.5 : 1,
                transition: "all 0.1s",
                transform: isSelected ? "translateY(2px)" : "none",
                boxShadow: isSelected ? "none" : "0 3px 0 #1a2830",
              }}
            >
              {w}
            </button>
          );
        })}
      </div>
    </div>
  );
}
