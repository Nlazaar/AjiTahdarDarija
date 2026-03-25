"use client";

import React from "react";
import { useRouter } from "next/navigation";

interface ProgressHeaderProps {
  percent?: number;
  hearts?: number;
  currentPhase?: number;
  totalPhases?: number;
  showHearts?: boolean;
}

export default function ProgressHeader({ 
  percent = 0, 
  hearts = 5, 
  currentPhase = 0, 
  totalPhases = 7,
  showHearts = true 
}: ProgressHeaderProps) {
  const router = useRouter();

  return (
    <div style={{ 
      width: '100%', 
      maxWidth: '1000px', 
      margin: '0 auto', 
      padding: '0 16px', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'space-between',
      gap: '20px'
    }}>
      {/* Bouton fermer */}
      <button 
        onClick={() => router.back()}
        style={{
          width: '40px',
          height: '40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#afafaf',
          backgroundColor: 'transparent',
          border: 'none',
          cursor: 'pointer',
          fontSize: '32px',
          fontWeight: 'bold',
          transition: 'color 0.1s'
        }}
      >
        ×
      </button>

      {/* Barre de progression 3D Duolingo-Exact */}
      <div style={{ 
        flex: 1, 
        height: '16px', 
        backgroundColor: '#e5e5e5', 
        borderRadius: '10px', 
        overflow: 'hidden',
        position: 'relative'
      }}>
        <div style={{ 
          width: `${percent}%`, 
          height: '100%', 
          backgroundColor: '#58cc02', 
          borderRadius: '10px',
          transition: 'width 0.5s ease-out',
          boxShadow: 'inset 0 -4px 0 rgba(0,0,0,0.15)'
        }} />
        {/* Lueur subtile */}
        <div style={{
          position: 'absolute',
          top: '3px',
          left: '6px',
          height: '4px',
          backgroundColor: 'rgba(255,255,255,0.2)',
          borderRadius: '2px',
          width: `${Math.max(0, percent - 4)}%`,
          transition: 'width 0.5s ease-out'
        }} />
      </div>

      {/* Indicateur Phase & Hearts */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        <div className="hidden md:block" style={{ 
          fontSize: '11px', 
          fontWeight: '900', 
          color: '#afafaf', 
          textTransform: 'uppercase', 
          letterSpacing: '0.1em' 
        }}>
          Phase {currentPhase} / {totalPhases}
        </div>

        {showHearts && (
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '6px',
            backgroundColor: '#fff',
            border: '2px solid #e5e5e5',
            padding: '4px 10px',
            borderRadius: '12px',
            boxShadow: '0 2px 0 #e5e5e5'
          }}>
            <span style={{ fontSize: '18px' }}>❤️</span>
            <span style={{ fontSize: '16px', fontWeight: '900', color: '#ff4b4b' }}>{hearts}</span>
          </div>
        )}
      </div>
    </div>
  );
}
