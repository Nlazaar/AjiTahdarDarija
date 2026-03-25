"use client";

import React, { useState, useEffect, useMemo } from 'react';

interface AssocierLettresProps {
  pairs: Array<{
    letter: string;
    latin: string;
    fr: string;
  }>;
  onConfirm: () => void;
}

export default function AssocierLettres({ pairs, onConfirm }: AssocierLettresProps) {
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
    if (matchedIds.size === pairs.length && pairs.length > 0) {
      const timer = setTimeout(onConfirm, 1000);
      return () => clearTimeout(timer);
    }
  }, [matchedIds.size, pairs.length, onConfirm]);

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
          Associe chaque lettre
        </h1>
        <p style={{ 
          fontSize: '14px', 
          fontWeight: '700', 
          color: '#afafaf', 
          textTransform: 'uppercase', 
          letterSpacing: '0.1em' 
        }}>
           Lqi kol horf m'a l-latin dyalo
        </p>
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
                onClick={() => handleSelect(p.latin, 'left')}
                disabled={isMatched || (!!selectedLeft && !!selectedRight)}
                className={isError ? "animate-shake-x" : ""}
                style={{
                  width: '100%',
                  height: '72px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '44px',
                  fontFamily: '"Amiri", serif',
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
                {p.letter}
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
                  opacity: isMatched ? 0.3 : 1,
                  cursor: isMatched ? 'default' : 'pointer',
                  transition: 'all 0.1s',
                  transform: isSelected && !isMatched ? 'translateY(2px)' : 'none'
                }}
              >
                <span style={{ fontSize: '20px', fontWeight: '900' }}>{s.latin}</span>
                <span style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', opacity: 0.5 }}>
                  {s.fr}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
