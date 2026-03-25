"use client";

import React, { useState, useEffect } from "react";

interface TrouverLesPairesProps {
  pairs: Array<{
    letter: string;
    latin: string;
    fr: string;
  }>;
  onConfirm: () => void;
}

export default function TrouverLesPaires({ pairs, onConfirm }: TrouverLesPairesProps) {
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [selectedRight, setSelectedRight] = useState<string | null>(null);
  const [matchedIds, setMatchedIds] = useState<Set<string>>(new Set());
  const [wrongPair, setWrongPair] = useState<string[] | null>(null);

  // Mélange de la colonne de droite (une seule fois)
  const [shuffledSounds] = useState(() => [...pairs].sort(() => Math.random() - 0.5));

  useEffect(() => {
    if (selectedLeft && selectedRight) {
      if (selectedLeft === selectedRight) {
        setMatchedIds(prev => new Set(prev).add(selectedLeft));
        setSelectedLeft(null);
        setSelectedRight(null);
        
        // Prononcer la lettre arabe (pas la romanisation)
        const matched = pairs.find(p => p.latin === selectedLeft);
        if (matched && typeof window !== 'undefined') {
          const t = new SpeechSynthesisUtterance(matched.letter);
          t.lang = 'ar-MA';
          window.speechSynthesis.speak(t);
        }
      } else {
        setWrongPair([selectedLeft, selectedRight]);
        setTimeout(() => {
          setSelectedLeft(null);
          setSelectedRight(null);
          setWrongPair(null);
        }, 800);
      }
    }
  }, [selectedLeft, selectedRight]);

  const allFound = matchedIds.size === pairs.length;

  return (
    <div className="animate-fade-up" style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      width: '100%', 
      maxWidth: '800px', 
      margin: '0 auto' 
    }}>
      {/* Question Text */}
      <div style={{ marginBottom: '40px', textAlign: 'center' }}>
        <h1 style={{ 
          fontSize: '28px', 
          fontWeight: '900', 
          color: '#4b4b4b', 
          marginBottom: '8px',
          lineHeight: '1.2'
        }}>
          Trouve les paires
        </h1>
        <p style={{ 
          fontSize: '14px', 
          fontWeight: '700', 
          color: '#afafaf', 
          textTransform: 'uppercase', 
          letterSpacing: '0.1em' 
        }}>
           Mémorisation active
        </p>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr', 
        gap: '20px', 
        width: '100%', 
        maxWidth: '600px',
        padding: '0 20px'
      }}>
        {/* Colonne ARABE */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {pairs.map((p, idx) => {
            const isMatched = matchedIds.has(p.latin);
            const isSelected = selectedLeft === p.latin;
            const isError = wrongPair?.[0] === p.latin;
            
            let shadowColor = "#e5e5e5";
            let borderColor = "#e5e5e5";
            let bgColor = "white";
            let textColor = "#4b4b4b";

            if (isMatched) {
              bgColor = "#f7f7f7";
              borderColor = "#e5e5e5";
              textColor = "#d7d7d7";
              shadowColor = "transparent";
            } else if (isError) {
              shadowColor = "#ff4b4b";
              borderColor = "#ff4b4b";
              bgColor = "#ffdbdb";
            } else if (isSelected) {
              shadowColor = "#1cb0f6";
              borderColor = "#1cb0f6";
              bgColor = "#ddf4ff";
              textColor = "#1cb0f6";
            }

            return (
              <button
                key={p.latin}
                disabled={isMatched || !!wrongPair}
                onClick={() => setSelectedLeft(isSelected ? null : p.latin)}
                className={isError ? "animate-shake-x" : ""}
                style={{
                  width: '100%',
                  height: '72px',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0 16px',
                  gap: '12px',
                  backgroundColor: bgColor,
                  borderColor: borderColor,
                  borderStyle: 'solid',
                  borderWidth: '2px',
                  borderRadius: '16px',
                  boxShadow: shadowColor === "transparent" ? "none" : `0 4px 0 ${shadowColor}`,
                  color: textColor,
                  opacity: isMatched ? 0.3 : 1,
                  cursor: isMatched ? 'default' : 'pointer',
                  transition: 'all 0.1s',
                  transform: isSelected && !isMatched ? 'translateY(2px)' : 'none'
                }}
              >
                <div style={{ 
                  width: '24px', 
                  height: '24px', 
                  borderRadius: '6px', 
                  border: '2px solid',
                  borderColor: isSelected ? '#1cb0f6' : '#e5e5e5',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '10px',
                  fontWeight: '900',
                  color: isSelected ? '#1cb0f6' : '#afafaf'
                }}>
                  {idx + 1}
                </div>
                <div style={{ flex: 1, textAlign: 'center', fontSize: '32px', fontFamily: '"Amiri", serif', marginTop: '4px' }}>
                  {p.letter}
                </div>
              </button>
            );
          })}
        </div>

        {/* Colonne LATIN */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {shuffledSounds.map((s, idx) => {
            const isMatched = matchedIds.has(s.latin);
            const isSelected = selectedRight === s.latin;
            const isError = wrongPair?.[1] === s.latin;

            let shadowColor = "#e5e5e5";
            let borderColor = "#e5e5e5";
            let bgColor = "white";
            let textColor = "#4b4b4b";

            if (isMatched) {
              bgColor = "#f7f7f7";
              borderColor = "#e5e5e5";
              textColor = "#d7d7d7";
              shadowColor = "transparent";
            } else if (isError) {
              shadowColor = "#ff4b4b";
              borderColor = "#ff4b4b";
              bgColor = "#ffdbdb";
            } else if (isSelected) {
              shadowColor = "#1cb0f6";
              borderColor = "#1cb0f6";
              bgColor = "#ddf4ff";
              textColor = "#1cb0f6";
            }

            return (
              <button
                key={s.latin}
                disabled={isMatched || !!wrongPair}
                onClick={() => setSelectedRight(isSelected ? null : s.latin)}
                className={isError ? "animate-shake-x" : ""}
                style={{
                  width: '100%',
                  height: '72px',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0 16px',
                  gap: '12px',
                  backgroundColor: bgColor,
                  borderColor: borderColor,
                  borderStyle: 'solid',
                  borderWidth: '2px',
                  borderRadius: '16px',
                  boxShadow: shadowColor === "transparent" ? "none" : `0 4px 0 ${shadowColor}`,
                  color: textColor,
                  opacity: isMatched ? 0.3 : 1,
                  cursor: isMatched ? 'default' : 'pointer',
                  transition: 'all 0.1s',
                  transform: isSelected && !isMatched ? 'translateY(2px)' : 'none'
                }}
              >
                <div style={{ 
                  width: '24px', 
                  height: '24px', 
                  borderRadius: '6px', 
                  border: '2px solid',
                  borderColor: isSelected ? '#1cb0f6' : '#e5e5e5',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '10px',
                  fontWeight: '900',
                  color: isSelected ? '#1cb0f6' : '#afafaf'
                }}>
                  {idx + 5}
                </div>
                <div style={{ 
                  flex: 1, 
                  textAlign: 'center', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  justifyContent: 'center',
                  gap: '0'
                }}>
                  <span style={{ fontSize: '16px', fontWeight: '900', textTransform: 'uppercase' }}>{s.latin}</span>
                  <span style={{ fontSize: '9px', fontWeight: '700', textTransform: 'uppercase', opacity: 0.5 }}>{s.fr}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Trigger auto-confirm when all matched */}
      {allFound && (
        <div style={{ marginTop: '40px' }}>
          <button 
            onClick={onConfirm}
            className="animate-fade-up"
            style={{
              padding: '12px 32px',
              backgroundColor: '#58cc02',
              color: 'white',
              border: 'none',
              borderRadius: '16px',
              boxShadow: '0 4px 0 #46a302',
              fontWeight: '900',
              fontSize: '14px',
              letterSpacing: '0.1em',
              cursor: 'pointer'
            }}
          >
            VALIDER
          </button>
        </div>
      )}
    </div>
  );
}
