'use client';

import React from 'react';
import Link from 'next/link';
import { useUser, type LangTrack } from '@/context/UserContext';

const TRACKS: { id: LangTrack; emoji: string; title: string; subtitle: string; description: string; color: string; shadow: string }[] = [
  {
    id: 'DARIJA',
    emoji: '🇲🇦',
    title: 'Darija',
    subtitle: 'الدارجة المغربية',
    description: 'Le dialecte marocain — langue du quotidien, des souks et de la famille.',
    color: '#ff4b4b',
    shadow: '#cc0000',
  },
  {
    id: 'MSA',
    emoji: '📖',
    title: 'Arabe Littéraire',
    subtitle: 'الفصحى',
    description: 'L\'arabe standard moderne — compris dans tout le monde arabe, TV, presse, Coran.',
    color: '#1cb0f6',
    shadow: '#0a8fc7',
  },
  {
    id: 'BOTH',
    emoji: '⭐',
    title: 'Les deux parcours',
    subtitle: 'دارجة + فصحى',
    description: 'Commence par Darija et enrichis avec le littéraire. Recommandé pour aller loin.',
    color: '#58cc02',
    shadow: '#46a302',
  },
];

export default function TrackSelectionPage() {
  const { mascot, setLangTrack } = useUser();
  const [selected, setSelected] = React.useState<LangTrack | null>(null);

  const handleContinue = () => {
    if (selected) setLangTrack(selected);
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      minHeight: '100vh',
      width: '100vw',
      backgroundColor: '#ffffff',
      fontFamily: '"Nunito", "Inter", sans-serif',
    }}>
      {/* Progress bar ~70% */}
      <div style={{ width: '100%', maxWidth: '1000px', padding: '24px 20px' }}>
        <div style={{ height: '16px', backgroundColor: '#e5e5e5', borderRadius: '10px', overflow: 'hidden' }}>
          <div style={{ width: '70%', height: '100%', backgroundColor: '#58cc02', borderRadius: '10px', transition: 'width 0.5s ease-out' }} />
        </div>
      </div>

      {/* Content */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '20px',
        width: '100%',
        maxWidth: '1000px',
      }}>
        {/* Mascot + bubble */}
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '20px', marginBottom: '40px', justifyContent: 'center' }}>
          <div className="animate-mascot" style={{ width: '140px', flexShrink: 0 }}>
            <img src={mascot} alt="Mascot" style={{ width: '100%', height: 'auto' }} />
          </div>
          <div style={{
            position: 'relative',
            backgroundColor: 'white',
            border: '2px solid #e5e5e5',
            borderRadius: '20px',
            padding: '20px 24px',
            maxWidth: '400px',
            boxShadow: '0 4px 0 #e5e5e5',
          }}>
            <div style={{
              position: 'absolute', left: '-10px', top: '50%',
              transform: 'translateY(-50%) rotate(45deg)',
              width: '16px', height: '16px',
              backgroundColor: 'white',
              borderLeft: '2px solid #e5e5e5',
              borderBottom: '2px solid #e5e5e5',
            }} />
            <h1 style={{ fontSize: '20px', fontWeight: '800', color: '#4b4b4b', margin: '0 0 4px 0', lineHeight: '1.3' }}>
              Quel parcours tu veux apprendre ?
            </h1>
            <p style={{ fontSize: '15px', fontWeight: '700', color: '#afafaf', margin: '0' }}>
              Chno bghiti titallam?
            </p>
          </div>
        </div>

        {/* Track cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', width: '100%', maxWidth: '520px' }}>
          {TRACKS.map((track) => {
            const isSelected = selected === track.id;
            return (
              <button
                key={track.id}
                onClick={() => setSelected(track.id)}
                style={{
                  width: '100%',
                  padding: '18px 20px',
                  backgroundColor: isSelected ? '#f0fdf4' : 'white',
                  border: `2px solid ${isSelected ? track.color : '#e5e5e5'}`,
                  borderRadius: '16px',
                  boxShadow: `0 4px 0 ${isSelected ? track.shadow : '#e5e5e5'}`,
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                }}
              >
                {/* Emoji */}
                <div style={{
                  width: '52px', height: '52px',
                  borderRadius: '14px',
                  backgroundColor: isSelected ? track.color : '#f7f7f7',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '26px',
                  flexShrink: 0,
                  transition: 'background-color 0.15s',
                }}>
                  {track.emoji}
                </div>
                {/* Text */}
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginBottom: '3px' }}>
                    <span style={{ fontSize: '17px', fontWeight: '900', color: isSelected ? track.color : '#4b4b4b' }}>
                      {track.title}
                    </span>
                    <span style={{ fontSize: '15px', fontWeight: '700', color: '#afafaf', fontFamily: 'serif', direction: 'rtl' }}>
                      {track.subtitle}
                    </span>
                  </div>
                  <span style={{ fontSize: '13px', fontWeight: '600', color: '#777', lineHeight: '1.4' }}>
                    {track.description}
                  </span>
                </div>
                {/* Check */}
                <div style={{
                  width: '24px', height: '24px',
                  borderRadius: '50%',
                  border: `2px solid ${isSelected ? track.color : '#e5e5e5'}`,
                  backgroundColor: isSelected ? track.color : 'transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'white', fontSize: '14px', fontWeight: '900',
                  flexShrink: 0,
                  transition: 'all 0.15s',
                }}>
                  {isSelected ? '✓' : ''}
                </div>
              </button>
            );
          })}
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
        marginTop: 'auto',
      }}>
        <div style={{ width: '100%', maxWidth: '1000px', display: 'flex', justifyContent: 'flex-end' }}>
          <Link href="/register" style={{ textDecoration: 'none', width: '100%', maxWidth: '280px' }}>
            <button
              disabled={!selected}
              onClick={handleContinue}
              style={{
                backgroundColor: !selected ? '#e5e5e5' : '#58cc02',
                color: !selected ? '#afafaf' : 'white',
                border: 'none',
                borderRadius: '16px',
                padding: '16px',
                fontSize: '15px',
                fontWeight: '900',
                letterSpacing: '0.08em',
                cursor: !selected ? 'default' : 'pointer',
                boxShadow: `0 5px 0 ${!selected ? '#afafaf' : '#46a302'}`,
                width: '100%',
                textTransform: 'uppercase',
                transition: 'all 0.1s',
              }}
            >
              Continuer
            </button>
          </Link>
        </div>
      </div>

      <style jsx global>{`
        .animate-mascot { animation: bounce 2.5s infinite ease-in-out; }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
      `}</style>
    </div>
  );
}
