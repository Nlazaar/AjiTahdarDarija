"use client";

import React, { useEffect } from 'react';

interface BravoProps {
  xp?: number;
  streak?: number;
  hearts?: number;
}

export default function Bravo({ xp = 15, streak = 1, hearts = 5 }: BravoProps) {
  useEffect(() => {
    // Jouer un son de célébration if needed
  }, []);

  return (
    <div className="animate-fade-up" style={{ 
      minHeight: '100vh',
      backgroundColor: 'white',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px'
    }}>
      <div style={{ 
        width: '100%', 
        maxWidth: '450px', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        textAlign: 'center' 
      }}>
        
        {/* Celebration Trophy */}
        <div style={{ marginBottom: '40px', position: 'relative' }}>
          <div style={{ 
            width: '180px', 
            height: '180px', 
            backgroundColor: '#ffc800', 
            borderRadius: '50%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            fontSize: '80px',
            boxShadow: '0 8px 0 #e5a000',
            position: 'relative',
            zIndex: 2
          }}>
            🏆
          </div>
          {/* Decorative Sparkles */}
          <div style={{ position: 'absolute', top: '-10px', left: '-10px', fontSize: '30px' }} className="animate-bounce">✨</div>
          <div style={{ position: 'absolute', bottom: '10px', right: '-10px', fontSize: '30px' }} className="animate-bounce">✨</div>
        </div>

        <div style={{ marginBottom: '40px' }}>
          <h1 style={{ fontSize: '36px', fontWeight: '900', color: '#4b4b4b', marginBottom: '8px' }}>
            Leçon terminée !
          </h1>
          <p style={{ fontSize: '14px', fontWeight: '700', color: '#afafaf', textTransform: 'uppercase', letterSpacing: '0.2em' }}>
            Tu progresses vite !
          </p>
        </div>

        {/* Stats Grid */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr', 
          gap: '20px', 
          width: '100%',
          marginBottom: '60px'
        }}>
          <div style={{ 
            padding: '24px', 
            backgroundColor: 'white', 
            border: '2px solid #e5e5e5', 
            borderRadius: '24px', 
            boxShadow: '0 4px 0 #e5e5e5' 
          }}>
             <div style={{ fontSize: '11px', fontWeight: '900', color: '#ffc800', textTransform: 'uppercase', marginBottom: '8px' }}>Total XP</div>
             <div style={{ fontSize: '32px', fontWeight: '900', color: '#4b4b4b' }}>{xp}</div>
          </div>
          <div style={{ 
            padding: '24px', 
            backgroundColor: 'white', 
            border: '2px solid #e5e5e5', 
            borderRadius: '24px', 
            boxShadow: '0 4px 0 #e5e5e5' 
          }}>
             <div style={{ fontSize: '11px', fontWeight: '900', color: '#1cb0f6', textTransform: 'uppercase', marginBottom: '8px' }}>Série</div>
             <div style={{ fontSize: '32px', fontWeight: '900', color: '#4b4b4b' }}>{streak} jrs</div>
          </div>
        </div>

        {/* Closing Button */}
        <button 
          onClick={() => window.location.href = '/learn'}
          style={{
            width: '100%',
            padding: '20px',
            backgroundColor: '#58cc02',
            color: 'white',
            border: 'none',
            borderRadius: '16px',
            boxShadow: '0 4px 0 #46a302',
            fontSize: '16px',
            fontWeight: '900',
            letterSpacing: '0.1em',
            cursor: 'pointer',
            transition: 'all 0.1s'
          }}
          onMouseDown={(e) => e.currentTarget.style.transform = 'translateY(2px)'}
          onMouseUp={(e) => e.currentTarget.style.transform = 'none'}
        >
          CONTINUER
        </button>
      </div>
    </div>
  );
}
