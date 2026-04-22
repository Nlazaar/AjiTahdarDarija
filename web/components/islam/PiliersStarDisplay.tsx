"use client";

import React from "react";
import StarShape, { STAR_POSITION_COORDS, type StarPosition } from "./StarShape";

export interface Pilier {
  numero: number;
  emoji: string;
  ar: string;
  latin: string;
  fr: string;
  color: string;
  position: StarPosition;
}

const DEFAULT_PILIERS: Pilier[] = [
  { numero: 1, emoji: "☝️", ar: "الشَّهَادَتَانِ", latin: "Ash-shahadatayn", fr: "L'attestation de foi", color: "#7c3aed", position: "top" },
  { numero: 2, emoji: "🕌", ar: "الصَّلَاةُ",      latin: "As-salah",        fr: "La prière",            color: "#0369a1", position: "right-top" },
  { numero: 3, emoji: "💰", ar: "الزَّكَاةُ",      latin: "Az-zakah",        fr: "L'aumône légale",      color: "#059669", position: "right-bot" },
  { numero: 4, emoji: "🌙", ar: "صَوْمُ رَمَضَانَ", latin: "Sawm Ramadan",   fr: "Le jeûne du Ramadan",  color: "#c2410c", position: "left-bot" },
  { numero: 5, emoji: "🕋", ar: "الْحَجُّ",        latin: "Al-hajj",         fr: "Le pèlerinage",        color: "#92400e", position: "left-top" },
];

interface Props {
  piliers?: Pilier[];
  title?: string;
  subtitleAr?: string;
}

export default function PiliersStarDisplay({
  piliers = DEFAULT_PILIERS,
  title = "Les 5 Piliers de l'Islam",
  subtitleAr = "قَوَاعِدُ الْإِسْلَام",
}: Props) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 16,
        padding: "20px 12px",
        background: "linear-gradient(135deg, rgba(124,58,237,0.08), rgba(5,150,105,0.08))",
        border: "1px solid rgba(124,58,237,0.25)",
        borderRadius: 18,
        margin: "12px",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 18, fontWeight: 900, color: "var(--c-text)", lineHeight: 1.2 }}>{title}</div>
        <div
          style={{
            fontFamily: 'var(--font-amiri), serif',
            direction: "rtl",
            fontSize: 22,
            fontWeight: 700,
            color: "#7c3aed",
            marginTop: 4,
          }}
        >
          {subtitleAr}
        </div>
      </div>

      <div style={{ position: "relative", width: "100%", maxWidth: 420, aspectRatio: "1 / 1" }}>
        <StarShape gradientId="piliersStarGrad" fillFrom="#7c3aed" fillTo="#059669" stroke="#7c3aed" />

        {piliers.map((p) => {
          const coord = STAR_POSITION_COORDS[p.position];
          return (
            <div
              key={p.numero}
              style={{
                position: "absolute",
                left: `${coord.x}%`,
                top: `${coord.y}%`,
                transform: "translate(-50%, -50%)",
                minWidth: 92,
                padding: "8px 10px",
                background: "var(--c-card)",
                border: `2px solid ${p.color}`,
                borderRadius: 12,
                boxShadow: `0 4px 0 ${p.color}40`,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 2,
                transition: "transform 0.15s",
              }}
              className="pilier-card"
            >
              <div style={{ fontSize: 22, lineHeight: 1 }}>{p.emoji}</div>
              <div
                style={{
                  fontFamily: 'var(--font-amiri), serif',
                  direction: "rtl",
                  fontSize: 14,
                  fontWeight: 700,
                  color: p.color,
                  lineHeight: 1.2,
                  textAlign: "center",
                }}
              >
                {p.ar}
              </div>
              <div style={{ fontSize: 10, fontWeight: 700, color: "var(--c-sub)", textAlign: "center" }}>{p.fr}</div>
            </div>
          );
        })}
      </div>

      <style>{`
        .pilier-card:hover {
          transform: translate(-50%, -52%) scale(1.05);
        }
      `}</style>
    </div>
  );
}
