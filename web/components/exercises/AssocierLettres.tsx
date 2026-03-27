"use client";

import React, { useState, useEffect, useMemo } from 'react';

interface AssocierLettresProps {
  pairs: Array<{
    letter: string;
    latin: string;
    fr: string;
  }>;
  onConfirm: () => void;
  onReadyChange?: (ready: boolean) => void;
}

function adaptiveFontSize(pairs: { letter: string }[]): number {
  const max = Math.max(...pairs.map(p => p.letter.length));
  if (max <= 3)  return 44;
  if (max <= 6)  return 32;
  if (max <= 10) return 22;
  return 16;
}

export default function AssocierLettres({ pairs, onConfirm, onReadyChange }: AssocierLettresProps) {
  const arabicFontSize = adaptiveFontSize(pairs);
  const [matchedIds, setMatchedIds] = useState<Set<string>>(new Set());
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [selectedRight, setSelectedRight] = useState<string | null>(null);
  const [errorPair, setErrorPair] = useState<[string, string] | null>(null);

  const shuffledSounds = useMemo(() => {
    return [...pairs].sort(() => Math.random() - 0.5);
  }, [pairs]);

  const handleSelect = (id: string, side: 'left' | 'right') => {
    if (matchedIds.has(id)) return;

    if (side === 'left') {
      // Prononcer la lettre arabe (pas la romanisation)
      const pair = pairs.find(p => p.latin === id);
      if (pair && typeof window !== 'undefined') {
        const t = new SpeechSynthesisUtterance(pair.letter);
        t.lang = 'ar-MA';
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(t);
      }
      setSelectedLeft(id === selectedLeft ? null : id);
    } else {
      setSelectedRight(id === selectedRight ? null : id);
    }
  };

  useEffect(() => {
    if (selectedLeft && selectedRight) {
      if (selectedLeft === selectedRight) {
        setMatchedIds(prev => new Set(prev).add(selectedLeft));
        setSelectedLeft(null);
        setSelectedRight(null);
      } else {
        setErrorPair([selectedLeft, selectedRight]);
        setTimeout(() => {
          setErrorPair(null);
          setSelectedLeft(null);
          setSelectedRight(null);
        }, 800);
      }
    }
  }, [selectedLeft, selectedRight]);

  useEffect(() => {
    if (pairs.length > 0) {
      onReadyChange?.(matchedIds.size === pairs.length);
    }
  }, [matchedIds.size, pairs.length]); // eslint-disable-line react-hooks/exhaustive-deps

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
      <div style={{ marginBottom: '24px', textAlign: 'center' }}>
        <h1 style={{
          fontSize: '24px',
          fontWeight: '900',
          color: '#ffffff',
          marginBottom: '8px',
          lineHeight: '1.2'
        }}>
          Associe chaque lettre
        </h1>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '6px',
          background: matchedIds.size > 0 ? 'rgba(52,211,153,0.15)' : '#1e2d35',
          borderRadius: '20px', padding: '4px 14px', marginTop: '8px'
        }}>
          <span style={{ fontSize: '18px', fontWeight: '900', color: matchedIds.size > 0 ? '#34d399' : '#4a5d6a' }}>
            {matchedIds.size}
          </span>
          <span style={{ fontSize: '13px', color: '#6b7f8a', fontWeight: '600' }}>
            / {pairs.length} associées
          </span>
        </div>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr', 
        gap: '40px', 
        width: '100%', 
        maxWidth: '600px',
        padding: '0 20px'
      }}>
        {/* Colonne Gauche - Lettres Arabe */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {pairs.map((p) => {
            const isMatched = matchedIds.has(p.latin);
            const isSelected = selectedLeft === p.latin;
            const isError = errorPair?.[0] === p.latin;

            let shadowColor = "#1a2830";
            let borderColor = "#2a3d47";
            let bgColor = "#263744";
            let textColor = "#ffffff";

            if (isMatched) {
              bgColor = "#1a3328";
              borderColor = "#34d399";
              textColor = "#34d399";
              shadowColor = "transparent";
            } else if (isError) {
              shadowColor = "#ff4b4b";
              borderColor = "#ff4b4b";
              bgColor = "#3a1e1e";
              textColor = "#ff4b4b";
            } else if (isSelected) {
              shadowColor = "#1cb0f6";
              borderColor = "#1cb0f6";
              bgColor = "#1a2e3e";
              textColor = "#1cb0f6";
            }

            return (
              <button
                key={p.latin}
                onClick={() => handleSelect(p.latin, 'left')}
                disabled={isMatched || (!!selectedLeft && !!selectedRight)}
                className={isError ? "animate-shake-x" : ""}
                style={{
                  width: '100%',
                  height: '72px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: `${arabicFontSize}px`,
                  fontFamily: '"Amiri", serif',
                  whiteSpace: 'nowrap',
                  backgroundColor: bgColor,
                  borderColor: borderColor,
                  borderStyle: 'solid',
                  borderWidth: '2px',
                  borderRadius: '16px',
                  boxShadow: shadowColor === "transparent" ? "none" : `0 4px 0 ${shadowColor}`,
                  color: textColor,
                  opacity: isMatched ? 0.9 : 1,
                  cursor: isMatched ? 'default' : 'pointer',
                  transition: 'all 0.1s',
                  transform: isSelected && !isMatched ? 'translateY(2px)' : 'none'
                }}
              >
                {isMatched ? <span style={{ fontSize: '24px' }}>✓</span> : p.letter}
              </button>
            );
          })}
        </div>

        {/* Colonne Droite - Sons Latin */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {shuffledSounds.map((s) => {
            const isMatched = matchedIds.has(s.latin);
            const isSelected = selectedRight === s.latin;
            const isError = errorPair?.[1] === s.latin;

            let shadowColor = "#1a2830";
            let borderColor = "#2a3d47";
            let bgColor = "#263744";
            let textColor = "#ffffff";

            if (isMatched) {
              bgColor = "#1a3328";
              borderColor = "#34d399";
              textColor = "#34d399";
              shadowColor = "transparent";
            } else if (isError) {
              shadowColor = "#ff4b4b";
              borderColor = "#ff4b4b";
              bgColor = "#3a1e1e";
              textColor = "#ff4b4b";
            } else if (isSelected) {
              shadowColor = "#1cb0f6";
              borderColor = "#1cb0f6";
              bgColor = "#1a2e3e";
              textColor = "#1cb0f6";
            }

            return (
              <button
                key={s.latin}
                onClick={() => handleSelect(s.latin, 'right')}
                disabled={isMatched || (!!selectedLeft && !!selectedRight)}
                className={isError ? "animate-shake-x" : ""}
                style={{
                  width: '100%',
                  height: '72px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: bgColor,
                  borderColor: borderColor,
                  borderStyle: 'solid',
                  borderWidth: '2px',
                  borderRadius: '16px',
                  boxShadow: shadowColor === "transparent" ? "none" : `0 4px 0 ${shadowColor}`,
                  color: textColor,
                  opacity: isMatched ? 0.9 : 1,
                  cursor: isMatched ? 'default' : 'pointer',
                  transition: 'all 0.1s',
                  transform: isSelected && !isMatched ? 'translateY(2px)' : 'none'
                }}
              >
                {isMatched ? (
                  <span style={{ fontSize: '24px' }}>✓</span>
                ) : (
                  <>
                    <span style={{ fontSize: '20px', fontWeight: '900' }}>{s.latin}</span>
                    <span style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', opacity: 0.5 }}>
                      {s.fr}
                    </span>
                  </>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
