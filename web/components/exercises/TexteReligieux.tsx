"use client";

import React, { useEffect } from "react";

interface Props {
  arabe: string;
  fr: string;
  source?: string;
  titre?: string;
  color?: string;
  onConfirm: () => void;
  onReadyChange?: (ready: boolean) => void;
  prompt?: string;
}

export default function TexteReligieux({ arabe, fr, source, titre, color = "#7c3aed", onConfirm, onReadyChange, prompt }: Props) {
  useEffect(() => {
    onReadyChange?.(true);
  }, [onReadyChange]);

  return (
    <div
      className="animate-fade-up"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
        maxWidth: 720,
        margin: "0 auto",
        padding: "0 16px",
      }}
    >
      <h1
        style={{
          fontSize: 22,
          fontWeight: 900,
          color: "#ffffff",
          marginBottom: 18,
          textAlign: "center",
          lineHeight: 1.2,
        }}
      >
        {prompt ?? titre ?? "Lecture"}
      </h1>

      <div
        style={{
          width: "100%",
          background: "#1a2830",
          border: `2px solid ${color}40`,
          borderRadius: 18,
          padding: "22px 22px 18px",
          boxShadow: `0 4px 0 ${color}20`,
        }}
      >
        <div
          style={{
            fontFamily: '"Amiri", serif',
            direction: "rtl",
            fontSize: 22,
            lineHeight: 1.9,
            color: "#ffffff",
            fontWeight: 700,
            textAlign: "right",
            marginBottom: 18,
            whiteSpace: "pre-wrap",
          }}
        >
          {arabe}
        </div>

        <div
          style={{
            height: 1,
            background: `linear-gradient(to right, transparent, ${color}60, transparent)`,
            margin: "14px 0",
          }}
        />

        <div
          style={{
            fontSize: 14,
            lineHeight: 1.65,
            color: "#e4eef3",
            fontStyle: "italic",
            whiteSpace: "pre-wrap",
          }}
        >
          « {fr} »
        </div>

        {source && (
          <div
            style={{
              marginTop: 14,
              fontSize: 11,
              fontWeight: 700,
              color: "#6b7f8a",
              textAlign: "right",
            }}
          >
            — {source}
          </div>
        )}
      </div>

      <button
        onClick={onConfirm}
        style={{
          marginTop: 24,
          padding: "14px 40px",
          background: "#58cc02",
          color: "white",
          border: "none",
          borderRadius: 14,
          fontWeight: 900,
          fontSize: 14,
          letterSpacing: "0.05em",
          textTransform: "uppercase",
          cursor: "pointer",
          boxShadow: "0 4px 0 #46a302",
        }}
      >
        Continuer
      </button>
    </div>
  );
}
