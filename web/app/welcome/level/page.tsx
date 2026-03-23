'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { useUser } from '@/context/UserContext';

export default function LevelSelectionPage() {
  const { t } = useLanguage();
  const { mascot } = useUser();
  const [selectedLevel, setSelectedLevel] = React.useState<number | null>(null);

  const levels = t.welcome.levels || [];

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      minHeight: '100vh', 
      width: '100vw', 
      backgroundColor: '#ffffff', 
      fontFamily: '"Nunito", "Inter", sans-serif'
    }}>
      {/* 1. Progress Bar (Advance to ~40%) */}
      <div style={{ 
        width: '100%', 
        maxWidth: '1000px', 
        padding: '24px 20px', 
        display: 'flex', 
        alignItems: 'center'
      }}>
        <div style={{ 
          flex: 1, 
          height: '16px', 
          backgroundColor: '#e5e5e5', 
          borderRadius: '10px', 
          overflow: 'hidden' 
        }}>
          <div style={{ 
            width: '40%', 
            height: '100%', 
            backgroundColor: '#58cc02', 
            borderRadius: '10px',
            transition: 'width 0.5s ease-out'
          }} />
        </div>
      </div>

      {/* 2. Main Content Area */}
      <div style={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        padding: '20px',
        width: '100%',
        maxWidth: '1000px'
      }}>
        
        {/* Top: Mascot + Bubble Row */}
        <div style={{ 
          display: 'flex', 
          flexDirection: 'row', 
          alignItems: 'center', 
          gap: '20px',
          marginBottom: '40px',
          width: '100%',
          justifyContent: 'center'
        }}>
          {/* Mascot */}
          <div className="animate-mascot" style={{ width: '140px', flexShrink: 0 }}>
            <img 
              src={mascot} 
              alt="Mascot Teacher" 
              style={{ width: '100%', height: 'auto' }}
            />
          </div>

          {/* Elegant Speech Bubble */}
          <div style={{ 
            position: 'relative',
            backgroundColor: 'white',
            border: '2px solid #e5e5e5',
            borderRadius: '20px',
            padding: '20px 24px',
            maxWidth: '380px',
            boxShadow: '0 4px 0 #e5e5e5'
          }}>
            <div style={{
              position: 'absolute',
              left: '-10px',
              top: '50%',
              transform: 'translateY(-50%) rotate(45deg)',
              width: '16px',
              height: '16px',
              backgroundColor: 'white',
              borderLeft: '2px solid #e5e5e5',
              borderBottom: '2px solid #e5e5e5'
            }}></div>

            <div style={{ textAlign: 'left' }}>
               <h1 style={{ fontSize: '20px', fontWeight: '800', color: '#4b4b4b', margin: '0 0 4px 0', lineHeight: '1.3' }}>
                  {t.welcome.levelQuestion}
               </h1>
               <p style={{ fontSize: '15px', fontWeight: '700', color: '#afafaf', margin: '0' }}>
                  Chno howa l‑mustawa dyalek ?
               </p>
            </div>
          </div>
        </div>

        {/* Bottom: Level Selection Cards Column */}
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '12px', 
          width: '100%',
          maxWidth: '500px',
          animation: 'fadeInUp 0.4s ease-out'
        }}>
          {levels.map((text: string, index: number) => (
            <button
              key={index}
              onClick={() => setSelectedLevel(index)}
              style={{
                width: '100%',
                padding: '16px 20px',
                backgroundColor: selectedLevel === index ? '#ddf4ff' : 'white',
                border: `2px solid ${selectedLevel === index ? '#1cb0f6' : '#e5e5e5'}`,
                borderRadius: '16px',
                boxShadow: `0 4px 0 ${selectedLevel === index ? '#1cb0f6' : '#e5e5e5'}`,
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.1s',
                display: 'flex',
                alignItems: 'center',
                gap: '15px'
              }}
            >
              <div style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                border: `2px solid ${selectedLevel === index ? '#1cb0f6' : '#e5e5e5'}`,
                backgroundColor: selectedLevel === index ? '#1cb0f6' : 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '14px',
                fontWeight: '900',
                flexShrink: 0
              }}>
                {selectedLevel === index ? '✓' : ''}
              </div>
              <span style={{ 
                fontSize: '16px', 
                fontWeight: '700', 
                color: selectedLevel === index ? '#1cb0f6' : '#4b4b4b' 
              }}>
                {text}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div style={{ 
        width: '100%', 
        borderTop: '2px solid #e5e5e5', 
        padding: '24px 40px', 
        display: 'flex', 
        justifyContent: 'center',
        backgroundColor: '#fff',
        marginTop: 'auto'
      }}>
        <div style={{
          width: '100%',
          maxWidth: '1000px',
          display: 'flex',
          justifyContent: 'flex-end'
        }}>
          <Link href="/register" style={{ textDecoration: 'none', width: '100%', maxWidth: '280px' }}>
            <button 
              disabled={selectedLevel === null}
              style={{
                backgroundColor: selectedLevel === null ? '#e5e5e5' : '#58cc02',
                color: selectedLevel === null ? '#afafaf' : 'white',
                border: 'none',
                borderRadius: '16px',
                padding: '16px',
                fontSize: '15px',
                fontWeight: '900',
                letterSpacing: '0.08em',
                cursor: selectedLevel === null ? 'default' : 'pointer',
                boxShadow: `0 5px 0 ${selectedLevel === null ? '#afafaf' : '#46a302'}`,
                width: '100%',
                textTransform: 'uppercase',
                transition: 'all 0.1s'
              }}
            >
              {t.common.continue}
            </button>
          </Link>
        </div>
      </div>

      <style jsx global>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-mascot {
          animation: bounce 2.5s infinite ease-in-out;
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
      `}</style>
    </div>
  );
}
