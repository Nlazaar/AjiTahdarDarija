'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { useUser } from '@/context/UserContext';
import HomeLogoLink from '@/components/HomeLogoLink';
import LottiePlayer from '@/components/LottiePlayer';
import { TRACK_COLORS, TRACK_GRADIENT, ONBOARDING_BG } from '@/lib/trackColors';

const LEVEL_LOTTIES = ['snail.json', 'DUCK.json', 'butterfly.json', 'owl.json', 'tiger.json'];

export default function LevelSelectionPage() {
  const { t } = useLanguage();
  const { mascot, langTrack } = useUser();
  const [selectedLevel, setSelectedLevel] = React.useState<number | null>(null);

  const levels = t.welcome.levels || [];
  const tc = TRACK_COLORS[langTrack];

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      minHeight: '100vh', 
      width: '100vw', 
      backgroundColor: ONBOARDING_BG,
      fontFamily: '"Nunito", "Inter", sans-serif'
    }}>
      {/* Bande décorative 3-parcours */}
      <div style={{ width: '100%', height: 4, background: TRACK_GRADIENT }} />

      {/* 1. Header : logo home-link + Progress Bar (~40%) */}
      <div style={{
        width: '100%',
        maxWidth: '1000px',
        padding: '16px 20px 20px',
        display: 'flex',
        alignItems: 'center',
        gap: '16px'
      }}>
        <HomeLogoLink />
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
            backgroundColor: tc.color,
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
            border: `2px solid ${tc.color}`,
            borderRadius: '20px',
            padding: '20px 24px',
            maxWidth: '380px',
            boxShadow: `0 4px 0 ${tc.tint}`
          }}>
            <div style={{
              position: 'absolute',
              left: '-10px',
              top: '50%',
              transform: 'translateY(-50%) rotate(45deg)',
              width: '16px',
              height: '16px',
              backgroundColor: 'white',
              borderLeft: `2px solid ${tc.color}`,
              borderBottom: `2px solid ${tc.color}`
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
                padding: '14px 18px',
                backgroundColor: selectedLevel === index ? tc.tint : 'white',
                border: `2px solid ${selectedLevel === index ? tc.color : '#e5e5e5'}`,
                borderRadius: '16px',
                boxShadow: `0 4px 0 ${selectedLevel === index ? tc.shadow : '#e5e5e5'}`,
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.1s',
                display: 'flex',
                alignItems: 'center',
                gap: '14px'
              }}
            >
              <div style={{ width: 56, height: 56, flexShrink: 0 }}>
                <LottiePlayer
                  src={LEVEL_LOTTIES[index] || LEVEL_LOTTIES[LEVEL_LOTTIES.length - 1]}
                  size="100%"
                />
              </div>
              <span style={{
                flex: 1,
                fontSize: '16px',
                fontWeight: '700',
                color: selectedLevel === index ? tc.color : '#4b4b4b'
              }}>
                {text}
              </span>
              <div style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                border: `2px solid ${selectedLevel === index ? tc.color : '#e5e5e5'}`,
                backgroundColor: selectedLevel === index ? tc.color : 'transparent',
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
          <Link href="/welcome/track" style={{ textDecoration: 'none', width: '100%', maxWidth: '280px' }}>
            <button 
              disabled={selectedLevel === null}
              style={{
                backgroundColor: selectedLevel === null ? '#e5e5e5' : tc.color,
                color: selectedLevel === null ? '#afafaf' : 'white',
                border: 'none',
                borderRadius: '16px',
                padding: '16px',
                fontSize: '15px',
                fontWeight: '900',
                letterSpacing: '0.08em',
                cursor: selectedLevel === null ? 'default' : 'pointer',
                boxShadow: `0 5px 0 ${selectedLevel === null ? '#afafaf' : tc.shadow}`,
                width: '100%',
                textTransform: 'uppercase',
                transition: 'all 0.15s'
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
