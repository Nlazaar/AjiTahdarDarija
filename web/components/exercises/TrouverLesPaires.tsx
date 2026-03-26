"use client";

import React, { useState, useEffect } from "react";

interface TrouverLesPairesProps {
  pairs: Array<{
    letter: string;
    latin: string;
    fr: string;
  }>;
  onConfirm: () => void;
  onReadyChange?: (ready: boolean) => void;
}

function playLetter(letter: string) {
  if (typeof window === "undefined") return;
  const t = new SpeechSynthesisUtterance(letter);
  t.lang = "ar-MA";
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(t);
}

export default function TrouverLesPaires({ pairs, onConfirm, onReadyChange }: TrouverLesPairesProps) {
  const [selectedLeft,  setSelectedLeft]  = useState<string | null>(null);
  const [selectedRight, setSelectedRight] = useState<string | null>(null);
  const [matchedIds,    setMatchedIds]    = useState<Set<string>>(new Set());
  const [wrongPair,     setWrongPair]     = useState<string[] | null>(null);

  const [shuffledRight] = useState(() => [...pairs].sort(() => Math.random() - 0.5));

  useEffect(() => {
    if (!selectedLeft || !selectedRight) return;
    if (selectedLeft === selectedRight) {
      const matched = pairs.find(p => p.latin === selectedLeft);
      if (matched) playLetter(matched.letter);
      setMatchedIds(prev => new Set(prev).add(selectedLeft));
      setSelectedLeft(null);
      setSelectedRight(null);
    } else {
      setWrongPair([selectedLeft, selectedRight]);
      setTimeout(() => {
        setWrongPair(null);
        setSelectedLeft(null);
        setSelectedRight(null);
      }, 800);
    }
  }, [selectedLeft, selectedRight]);

  const allFound = matchedIds.size === pairs.length;

  useEffect(() => {
    onReadyChange?.(allFound);
  }, [allFound]); // eslint-disable-line react-hooks/exhaustive-deps

  const leftStyle = (latin: string) => {
    const isMatched  = matchedIds.has(latin);
    const isSelected = selectedLeft === latin;
    const isError    = wrongPair?.[0] === latin;
    if (isMatched)  return { bg: "#1a3328", border: "#34d399", shadow: "transparent", text: "#34d399" };
    if (isError)    return { bg: "#3a1e1e", border: "#ff4b4b", shadow: "#ff4b4b",     text: "#ff6b6b" };
    if (isSelected) return { bg: "#1a2e3e", border: "#1cb0f6", shadow: "#1cb0f6",     text: "#1cb0f6" };
    return           { bg: "#263744",  border: "#2a3d47", shadow: "#1a2830",    text: "#ffffff" };
  };

  const rightStyle = (latin: string) => {
    const isMatched  = matchedIds.has(latin);
    const isSelected = selectedRight === latin;
    const isError    = wrongPair?.[1] === latin;
    if (isMatched)  return { bg: "#1a3328", border: "#34d399", shadow: "transparent", text: "#34d399" };
    if (isError)    return { bg: "#3a1e1e", border: "#ff4b4b", shadow: "#ff4b4b",     text: "#ff6b6b" };
    if (isSelected) return { bg: "#1a2e3e", border: "#1cb0f6", shadow: "#1cb0f6",     text: "#1cb0f6" };
    return           { bg: "#263744",  border: "#2a3d47", shadow: "#1a2830",    text: "#ffffff" };
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%", maxWidth: "600px", margin: "0 auto" }}>

      {/* Titre + compteur */}
      <div style={{ marginBottom: "24px", textAlign: "center" }}>
        <h1 style={{ fontSize: "24px", fontWeight: "900", color: "#ffffff", marginBottom: "6px" }}>
          Trouve les paires
        </h1>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: "6px",
          background: matchedIds.size > 0 ? "rgba(52,211,153,0.15)" : "#1e2d35",
          borderRadius: "20px", padding: "4px 14px"
        }}>
          <span style={{ fontSize: "18px", fontWeight: "900", color: matchedIds.size > 0 ? "#34d399" : "#4a5d6a" }}>
            {matchedIds.size}
          </span>
          <span style={{ fontSize: "13px", color: "#6b7f8a", fontWeight: "600" }}>
            / {pairs.length} trouvées
          </span>
        </div>
      </div>

      {/* Grille */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", width: "100%", padding: "0 8px" }}>

        {/* Colonne gauche — boutons audio */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {pairs.map((p) => {
            const s = leftStyle(p.latin);
            const isMatched  = matchedIds.has(p.latin);
            const isSelected = selectedLeft === p.latin;
            return (
              <button
                key={p.latin}
                disabled={isMatched || !!wrongPair}
                onClick={() => {
                  playLetter(p.letter);
                  setSelectedLeft(isSelected ? null : p.latin);
                }}
                className={wrongPair?.[0] === p.latin ? "animate-shake-x" : ""}
                style={{
                  width: "100%", height: "68px",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: "10px",
                  backgroundColor: s.bg, borderColor: s.border,
                  borderStyle: "solid", borderWidth: "2px", borderRadius: "16px",
                  boxShadow: s.shadow === "transparent" ? "none" : `0 4px 0 ${s.shadow}`,
                  color: s.text,
                  cursor: isMatched ? "default" : "pointer",
                  transition: "all 0.1s",
                  transform: isSelected && !isMatched ? "translateY(2px)" : "none",
                }}
              >
                {isMatched ? (
                  <span style={{ fontSize: "20px" }}>✓</span>
                ) : (
                  <span style={{ display: "flex", alignItems: "center", gap: "3px", height: "22px" }}>
                    {[0, 1, 2, 3].map(i => (
                      <span key={i} style={{
                        display: "block", width: "3px", borderRadius: "2px",
                        background: isSelected ? "#1cb0f6" : "#6b7f8a",
                        height: "100%",
                        animation: `waveBar 0.8s ease-in-out ${i * 0.15}s infinite`,
                      }} />
                    ))}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Colonne droite — sens français */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {shuffledRight.map((s_) => {
            const s = rightStyle(s_.latin);
            const isMatched  = matchedIds.has(s_.latin);
            const isSelected = selectedRight === s_.latin;
            return (
              <button
                key={s_.latin}
                disabled={isMatched || !!wrongPair}
                onClick={() => setSelectedRight(isSelected ? null : s_.latin)}
                className={wrongPair?.[1] === s_.latin ? "animate-shake-x" : ""}
                style={{
                  width: "100%", height: "68px",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  padding: "0 12px",
                  backgroundColor: s.bg, borderColor: s.border,
                  borderStyle: "solid", borderWidth: "2px", borderRadius: "16px",
                  boxShadow: s.shadow === "transparent" ? "none" : `0 4px 0 ${s.shadow}`,
                  color: s.text,
                  cursor: isMatched ? "default" : "pointer",
                  transition: "all 0.1s",
                  transform: isSelected && !isMatched ? "translateY(2px)" : "none",
                  textAlign: "center",
                }}
              >
                {isMatched ? (
                  <span style={{ fontSize: "20px" }}>✓</span>
                ) : (
                  <span style={{ fontSize: "13px", fontWeight: "700", lineHeight: "1.3" }}>
                    {s_.fr}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
}
