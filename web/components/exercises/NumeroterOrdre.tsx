"use client";

import React, { useEffect, useMemo, useState } from "react";

export interface NumeroterOrdreItem {
  id: string;
  ar: string;
  latin?: string;
  fr: string;
  correctPos: number; // 1-based
}

interface Props {
  items: NumeroterOrdreItem[];
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

export default function NumeroterOrdre({ items, onConfirm, onReadyChange, prompt }: Props) {
  const shuffled = useMemo(() => shuffle(items), [items]);
  const [picks, setPicks] = useState<string[]>([]);
  const [errorId, setErrorId] = useState<string | null>(null);

  const total = items.length;
  const allPicked = picks.length === total;

  useEffect(() => {
    onReadyChange?.(allPicked);
  }, [allPicked, onReadyChange]);

  const positionOf = (id: string) => picks.indexOf(id) + 1; // 0 if not picked

  const handleClick = (id: string) => {
    if (picks.includes(id)) return;
    const expectedPos = picks.length + 1;
    const item = items.find((i) => i.id === id);
    if (!item) return;
    if (item.correctPos !== expectedPos) {
      setErrorId(id);
      setTimeout(() => setErrorId(null), 600);
      return;
    }
    setPicks((p) => [...p, id]);
  };

  const reset = () => setPicks([]);

  return (
    <div
      className="animate-fade-up"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
        maxWidth: 800,
        margin: "0 auto",
      }}
    >
      <div style={{ marginBottom: 24, textAlign: "center" }}>
        <h1
          style={{
            fontSize: 24,
            fontWeight: 900,
            color: "#ffffff",
            marginBottom: 8,
            lineHeight: 1.2,
          }}
        >
          {prompt ?? "Remets dans le bon ordre"}
        </h1>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            background: picks.length > 0 ? "rgba(52,211,153,0.15)" : "#1e2d35",
            borderRadius: 20,
            padding: "4px 14px",
            marginTop: 8,
          }}
        >
          <span style={{ fontSize: 18, fontWeight: 900, color: picks.length > 0 ? "#34d399" : "#4a5d6a" }}>
            {picks.length}
          </span>
          <span style={{ fontSize: 13, color: "#6b7f8a", fontWeight: 600 }}>/ {total} placés</span>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: 12,
          width: "100%",
          maxWidth: 480,
          padding: "0 16px",
        }}
      >
        {shuffled.map((item) => {
          const pos = positionOf(item.id);
          const isPicked = pos > 0;
          const isError = errorId === item.id;

          let bg = "#263744";
          let border = "#2a3d47";
          let text = "#ffffff";
          let shadow = "#1a2830";
          if (isPicked) {
            bg = "#1a3328";
            border = "#34d399";
            text = "#34d399";
            shadow = "transparent";
          } else if (isError) {
            bg = "#3a1e1e";
            border = "#ff4b4b";
            text = "#ff4b4b";
            shadow = "#ff4b4b";
          }

          return (
            <button
              key={item.id}
              onClick={() => handleClick(item.id)}
              disabled={isPicked}
              className={isError ? "animate-shake-x" : ""}
              style={{
                width: "100%",
                minHeight: 64,
                display: "flex",
                alignItems: "center",
                gap: 14,
                padding: "12px 16px",
                backgroundColor: bg,
                borderColor: border,
                borderStyle: "solid",
                borderWidth: 2,
                borderRadius: 16,
                boxShadow: shadow === "transparent" ? "none" : `0 4px 0 ${shadow}`,
                color: text,
                cursor: isPicked ? "default" : "pointer",
                transition: "all 0.1s",
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  border: `2px solid ${isPicked ? "#34d399" : "#4a5d6a"}`,
                  background: isPicked ? "#34d399" : "transparent",
                  color: isPicked ? "#0a1418" : "#6b7f8a",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 900,
                  fontSize: 16,
                  flexShrink: 0,
                }}
              >
                {isPicked ? pos : "?"}
              </div>
              <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 2 }}>
                <span
                  style={{
                    fontFamily: '"Amiri", serif',
                    fontSize: 22,
                    direction: "rtl",
                    fontWeight: 700,
                    color: text,
                  }}
                >
                  {item.ar}
                </span>
                <span style={{ fontSize: 12, fontWeight: 700, opacity: 0.75 }}>
                  {item.latin ? `${item.latin} — ${item.fr}` : item.fr}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {picks.length > 0 && !allPicked && (
        <button
          onClick={reset}
          style={{
            marginTop: 18,
            background: "transparent",
            border: "none",
            color: "#6b7f8a",
            fontSize: 13,
            fontWeight: 700,
            cursor: "pointer",
            textDecoration: "underline",
          }}
        >
          Recommencer
        </button>
      )}
    </div>
  );
}
