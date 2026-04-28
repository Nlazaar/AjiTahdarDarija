'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useUser, type LangTrack } from '@/context/UserContext';
import { getTracks, type Track } from '@/lib/api';
import HomeLogoLink from '@/components/HomeLogoLink';
import LottiePlayer from '@/components/LottiePlayer';
import { TRACK_COLORS, TRACK_GRADIENT, ONBOARDING_BG } from '@/lib/trackColors';

type TrackCard = {
  id: LangTrack;
  emoji: string;
  title: string;
  subtitle: string;
  description: string;
  color: string;
  shadow: string;
};

const FALLBACK: TrackCard[] = [
  {
    id: 'DARIJA', emoji: '🇲🇦', title: 'Darija', subtitle: 'الدارجة المغربية',
    description: 'Le dialecte marocain — langue du quotidien, des souks et de la famille.',
    color: '#ff4b4b', shadow: '#cc0000',
  },
  {
    id: 'MSA', emoji: '📖', title: 'Arabe Littéraire', subtitle: 'الفصحى',
    description: "L'arabe standard moderne — compris dans tout le monde arabe, TV, presse, Coran.",
    color: '#1cb0f6', shadow: '#0a8fc7',
  },
  {
    id: 'RELIGION', emoji: '☪︎', title: 'Religion', subtitle: 'الدين',
    description: 'Parcours islamique — fondements et pratiques.',
    color: '#a855f7', shadow: '#7c3aed',
  },
];

/** Darken a #rrggbb hex color by pct (0..1). */
function darken(hex: string, pct = 0.2): string {
  const m = /^#?([a-f\d]{6})$/i.exec(hex.trim());
  if (!m) return hex;
  const n = parseInt(m[1], 16);
  const r = Math.max(0, Math.round(((n >> 16) & 0xff) * (1 - pct)));
  const g = Math.max(0, Math.round(((n >> 8) & 0xff) * (1 - pct)));
  const b = Math.max(0, Math.round((n & 0xff) * (1 - pct)));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}

export default function TrackSelectionPage() {
  const { mascot, setLangTrack } = useUser();
  const [selected, setSelected] = useState<LangTrack | null>(null);
  const [dbTracks, setDbTracks] = useState<Track[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const t = (await getTracks()) as Track[];
        if (!cancelled && Array.isArray(t)) setDbTracks(t);
      } catch { /* fallback */ }
    })();
    return () => { cancelled = true; };
  }, []);

  const cards = useMemo<TrackCard[]>(() => {
    if (!dbTracks || dbTracks.length === 0) return FALLBACK;
    const sorted = [...dbTracks]
      .filter((t) => t.isPublished !== false)
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    return sorted.map<TrackCard>((t) => {
      const fallback = FALLBACK.find((f) => f.id === t.code);
      const color = t.color || fallback?.color || '#58cc02';
      return {
        id: t.code as LangTrack,
        emoji: t.emoji || fallback?.emoji || '📚',
        title: t.name || fallback?.title || t.code,
        subtitle: t.nameAr || fallback?.subtitle || '',
        description: t.description || fallback?.description || '',
        color,
        shadow: darken(color, 0.22),
      };
    });
  }, [dbTracks]);

  const handleContinue = () => {
    if (selected) setLangTrack(selected);
  };

  const barColor = selected ? TRACK_COLORS[selected].color : '#afafaf';

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      minHeight: '100vh', width: '100%', overflowX: 'hidden',
      backgroundColor: ONBOARDING_BG,
      fontFamily: '"Nunito", "Inter", sans-serif',
    }}>
      {/* Bande décorative 3-parcours */}
      <div style={{ width: '100%', height: 4, background: TRACK_GRADIENT }} />

      <div style={{ width: '100%', maxWidth: '1000px', padding: '16px 20px 20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <HomeLogoLink />
        <div style={{ flex: 1, height: '16px', backgroundColor: '#e5e5e5', borderRadius: '10px', overflow: 'hidden' }}>
          <div style={{ width: '70%', height: '100%', backgroundColor: barColor, borderRadius: '10px', transition: 'all 0.3s ease-out' }} />
        </div>
      </div>

      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
        padding: '20px', width: '100%', maxWidth: '1000px',
      }}>
        <div
          className="flex flex-col md:flex-row"
          style={{ alignItems: 'center', gap: '20px', marginBottom: '40px', justifyContent: 'center', width: '100%' }}
        >
          <div style={{ width: 'clamp(120px, 28vw, 180px)', flexShrink: 0 }}>
            <LottiePlayer
              src="mascot-with-bird.json"
              size="100%"
              fallback={<img src={mascot} alt="Mascot" style={{ width: '100%', height: 'auto' }} />}
            />
          </div>
          <div style={{
            position: 'relative', backgroundColor: 'white',
            border: '2px solid #e5e5e5', borderRadius: '20px',
            padding: '20px 24px', maxWidth: '400px',
            boxShadow: '0 4px 0 #e5e5e5',
          }}>
            <div
              className="hidden md:block"
              style={{
                position: 'absolute', left: '-10px', top: '50%',
                transform: 'translateY(-50%) rotate(45deg)',
                width: '16px', height: '16px',
                backgroundColor: 'white',
                borderLeft: '2px solid #e5e5e5',
                borderBottom: '2px solid #e5e5e5',
              }} />
            <h1 style={{ fontSize: '20px', fontWeight: 800, color: '#4b4b4b', margin: '0 0 4px 0', lineHeight: '1.3' }}>
              Quel parcours tu veux apprendre ?
            </h1>
            <p style={{ fontSize: '15px', fontWeight: 700, color: '#afafaf', margin: 0 }}>
              Chno bghiti titallam?
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', width: '100%', maxWidth: '520px' }}>
          {cards.map((track) => {
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
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginBottom: '3px' }}>
                    <span style={{ fontSize: '17px', fontWeight: 900, color: isSelected ? track.color : '#4b4b4b' }}>
                      {track.title}
                    </span>
                    {track.subtitle && (
                      <span style={{ fontSize: '15px', fontWeight: 700, color: '#afafaf', fontFamily: 'serif', direction: 'rtl' }}>
                        {track.subtitle}
                      </span>
                    )}
                  </div>
                  {track.description && (
                    <span style={{ fontSize: '13px', fontWeight: 600, color: '#777', lineHeight: '1.4' }}>
                      {track.description}
                    </span>
                  )}
                </div>
                <div style={{
                  width: '24px', height: '24px',
                  borderRadius: '50%',
                  border: `2px solid ${isSelected ? track.color : '#e5e5e5'}`,
                  backgroundColor: isSelected ? track.color : 'transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'white', fontSize: '14px', fontWeight: 900,
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
                backgroundColor: !selected ? '#e5e5e5' : TRACK_COLORS[selected].color,
                color: !selected ? '#afafaf' : 'white',
                border: 'none',
                borderRadius: '16px',
                padding: '16px',
                fontSize: '15px',
                fontWeight: 900,
                letterSpacing: '0.08em',
                cursor: !selected ? 'default' : 'pointer',
                boxShadow: `0 5px 0 ${!selected ? '#afafaf' : TRACK_COLORS[selected].shadow}`,
                width: '100%',
                textTransform: 'uppercase',
                transition: 'all 0.15s',
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
