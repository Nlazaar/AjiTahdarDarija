'use client';

import React, { useState, useEffect } from 'react';
import { useUserProgress } from '@/contexts/UserProgressContext';
import { getMyRank } from '@/lib/api';

/* ─────────────────────────────────────────────────────────────
   LEAGUES
───────────────────────────────────────────────────────────── */
const LEAGUES = [
  { name: 'Bronze',     color: '#cd7f32', bg: '#fdf3e7', xpMin: 0    },
  { name: 'Argent',     color: '#8c9aaa', bg: '#f4f6f8', xpMin: 200  },
  { name: 'Or',         color: '#f59e0b', bg: '#fffbeb', xpMin: 500  },
  { name: 'Rubis',      color: '#e63946', bg: '#fff1f2', xpMin: 1000 },
  { name: 'Saphir',     color: '#3b82f6', bg: '#eff6ff', xpMin: 2000 },
  { name: 'Émeraude',   color: '#10b981', bg: '#ecfdf5', xpMin: 3500 },
  { name: 'Diamant',    color: '#06b6d4', bg: '#ecfeff', xpMin: 5000 },
  { name: 'Obsidienne', color: '#7c3aed', bg: '#f5f3ff', xpMin: 8000 },
];

// Relegation zone = bottom 10 of any league division (league size = 30)
const LEAGUE_SIZE = 30;
const RELEGATION_CUTOFF = 20;

function getLeague(xp: number) {
  return [...LEAGUES].reverse().find(l => xp >= l.xpMin) ?? LEAGUES[0];
}

/* ─────────────────────────────────────────────────────────────
   ICONS
───────────────────────────────────────────────────────────── */
function LeagueBadge({ color, name }: { color: string; name: string }) {
  // Hexagonal badge like Duolingo
  return (
    <svg width="52" height="58" viewBox="0 0 52 58" fill="none">
      {/* Hexagon */}
      <path
        d="M26 3 L48 15 L48 43 L26 55 L4 43 L4 15 Z"
        fill={color}
        opacity="0.15"
        stroke={color}
        strokeWidth="3"
      />
      <path
        d="M26 9 L43 19 L43 39 L26 49 L9 39 L9 19 Z"
        fill={color}
        opacity="0.25"
      />
      {/* Icon inside */}
      <text x="26" y="33" textAnchor="middle" fontSize="20" fill={color}>
        {name === 'Bronze' ? '🥉' :
         name === 'Argent' ? '🥈' :
         name === 'Or' ? '🥇' :
         name === 'Rubis' ? '💎' :
         name === 'Saphir' ? '🔷' :
         name === 'Émeraude' ? '💚' :
         name === 'Diamant' ? '💠' : '🔮'}
      </text>
    </svg>
  );
}

function ChestIcon({ done }: { done: boolean }) {
  const body  = done ? '#c9941a' : '#9ca3af';
  const lid   = done ? '#e9a84c' : '#d1d5db';
  const lock  = done ? '#ffd700' : '#6b7280';
  const shine = done ? '#fff8e1' : '#f9fafb';
  return (
    <svg width="34" height="34" viewBox="0 0 34 34" fill="none" style={{ flexShrink: 0 }}>
      {/* lid */}
      <rect x="3" y="7" width="28" height="10" rx="4" fill={lid}/>
      {/* lid highlight */}
      <rect x="6" y="9" width="18" height="3" rx="1.5" fill={shine} opacity="0.5"/>
      {/* body */}
      <rect x="3" y="15" width="28" height="14" rx="3" fill={body}/>
      {/* hinge line */}
      <rect x="3" y="15" width="28" height="2.5" fill={body} opacity="0.6"/>
      {/* lock */}
      <rect x="14" y="18" width="6" height="6" rx="1.5" fill={lock}/>
      <rect x="15.5" y="16.5" width="3" height="3" rx="1.5" fill="none" stroke={lock} strokeWidth="1.5"/>
    </svg>
  );
}

function MoroccanFlag() {
  return (
    <svg width="26" height="18" viewBox="0 0 900 600">
      <rect width="900" height="600" fill="#C1272D"/>
      <polygon points="450,150 480,240 570,240 500,290 525,380 450,330 375,380 400,290 330,240 420,240"
        fill="none" stroke="#006233" strokeWidth="18"/>
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────
   QUEST ITEM  (Duolingo style)
───────────────────────────────────────────────────────────── */
function QuestItem({ quest }: { quest: { id: string; icon: string; label: string; current: number; total: number } }) {
  const pct  = Math.min(100, Math.round((quest.current / quest.total) * 100));
  const done = quest.current >= quest.total;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0' }}>
      {/* Emoji icon */}
      <div style={{
        width: 44, height: 44,
        background: done ? 'rgba(245,158,11,0.15)' : 'rgba(255,255,255,0.06)',
        borderRadius: 12,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 22, flexShrink: 0,
      }}>
        {quest.icon}
      </div>

      {/* Label + bar */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: 12, fontWeight: 800,
          color: done ? '#fbbf24' : '#e5e7eb',
          marginBottom: 5, lineHeight: 1.3,
        }}>
          {quest.label}
        </div>

        {/* Progress bar row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{
            flex: 1, height: 10,
            background: 'rgba(255,255,255,0.08)',
            borderRadius: 5, overflow: 'hidden',
            position: 'relative',
          }}>
            <div style={{
              position: 'absolute', inset: 0,
              width: `${pct}%`,
              background: done
                ? 'linear-gradient(90deg, #f59e0b, #fbbf24)'
                : 'linear-gradient(90deg, #f59e0b, #fcd34d)',
              borderRadius: 5,
              transition: 'width 0.6s cubic-bezier(.4,0,.2,1)',
            }}/>
            {/* XP label inside bar when > 40% */}
            {pct > 35 && (
              <span style={{
                position: 'absolute', left: '50%', top: '50%',
                transform: 'translate(-50%,-50%)',
                fontSize: 8, fontWeight: 900, color: '#92400e',
              }}>
                {quest.current} / {quest.total}
              </span>
            )}
          </div>
          {/* Fraction outside bar when ≤ 40% */}
          {pct <= 35 && (
            <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--c-sub)', flexShrink: 0 }}>
              {quest.current}/{quest.total}
            </span>
          )}
          <ChestIcon done={done}/>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────────────────────── */
export default function StatsPanel() {
  const { progress } = useUserProgress();
  const league = getLeague(progress.xp);

  const [realRank, setRealRank] = useState<number | null>(null);

  useEffect(() => {
    getMyRank().then(r => { if (r?.rank != null) setRealRank(r.rank) }).catch(() => {});
  }, []);

  // Position dans la division = ((rank - 1) % LEAGUE_SIZE) + 1
  const divisionRank = realRank != null ? ((realRank - 1) % LEAGUE_SIZE) + 1 : null;
  const displayRank  = divisionRank ?? '…';

  const isRelegation = divisionRank != null && divisionRank > RELEGATION_CUTOFF;
  const statusText   = divisionRank == null
    ? 'Chargement du classement…'
    : isRelegation
      ? `Tu as chuté dans la zone de relégation !`
      : divisionRank <= 5
        ? `Tu es dans le top 5 ! Continue !`
        : `Continue pour grimper dans le classement.`;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%' }}>

      {/* ── Top stats bar (style Duolingo) ────────────── */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: '#1a1f2e',
        border: '1px solid rgba(180,180,180,0.4)',
        borderRadius: 16,
        padding: '10px 14px',
        boxShadow: '0 2px 12px rgba(0,0,0,0.2)',
      }}>
        {/* Flag + streak days */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ borderRadius: 6, overflow: 'hidden', flexShrink: 0 }}>
            <MoroccanFlag/>
          </div>
          <span style={{ fontSize: 15, fontWeight: 900, color: 'white' }}>{progress.streak}</span>
        </div>

        {/* Fire + XP */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <span style={{ fontSize: 20 }}>🔥</span>
          <span style={{ fontSize: 15, fontWeight: 900, color: '#fb923c' }}>{progress.xp}</span>
        </div>

        {/* Gem + gemmes */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <span style={{ fontSize: 20 }}>💎</span>
          <span style={{ fontSize: 15, fontWeight: 900, color: '#38bdf8' }}>{progress.gemmes}</span>
        </div>

        {/* Heart + lives */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <span style={{ fontSize: 20 }}>❤️</span>
          <span style={{ fontSize: 15, fontWeight: 900, color: '#f87171' }}>5</span>
        </div>
      </div>

      {/* ── League card ───────────────────────────────── */}
      <div style={{
        background: '#1a1f2e',
        border: '1px solid rgba(180,180,180,0.4)',
        borderRadius: 18,
        padding: '16px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
      }}>
        {/* Header row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 16, fontWeight: 900, color: 'white', whiteSpace: 'nowrap' }}>
              Division {league.name}
            </span>
            <span style={{
              minWidth: 22, height: 22,
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 10, fontWeight: 900, color: '#fff',
              background: league.color, borderRadius: '50%',
              padding: '0 5px', flexShrink: 0,
            }}>
              {displayRank}
            </span>
          </div>
          <button style={{
            fontSize: 11, fontWeight: 900, color: '#60a5fa',
            background: 'none', border: 'none', cursor: 'pointer',
            textTransform: 'uppercase', letterSpacing: '0.06em',
          }}>
            VOIR LA LIGUE
          </button>
        </div>

        {/* Badge + rank */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <LeagueBadge color={league.color} name={league.name}/>
          <div>
            <div style={{ fontSize: 14, fontWeight: 800, color: '#e5e7eb', lineHeight: 1.3 }}>
              Tu es{' '}
              <span style={{ color: isRelegation ? '#ef4444' : '#fbbf24', fontWeight: 900 }}>
                n° {displayRank}
              </span>
              {' '}du classement
            </div>
            <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 4, lineHeight: 1.4 }}>
              {statusText}
            </div>
          </div>
        </div>

        {/* XP bar */}
        <div style={{ marginTop: 12 }}>
          <div style={{ height: 6, background: 'rgba(255,255,255,0.1)', borderRadius: 3, overflow: 'hidden' }}>
            <div style={{
              height: '100%',
              width: `${Math.min(100, Math.round((progress.xp % 1000) / 10))}%`,
              background: league.color,
              borderRadius: 3,
              transition: 'width 0.6s ease',
            }}/>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
            <span style={{ fontSize: 10, color: '#6b7280' }}>{progress.xp} XP</span>
            <span style={{ fontSize: 10, color: '#6b7280' }}>Prochain niveau</span>
          </div>
        </div>
      </div>

      {/* ── Daily quests card ─────────────────────────── */}
      <div style={{
        background: '#1a1f2e',
        border: '1px solid rgba(180,180,180,0.4)',
        borderRadius: 18,
        padding: '14px 16px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 15, fontWeight: 900, color: 'white' }}>Quêtes du jour</span>
            <span style={{
              minWidth: 22, height: 22,
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 10, fontWeight: 900, color: '#fff',
              background: '#f59e0b', borderRadius: '50%',
              padding: '0 5px', flexShrink: 0,
            }}>
              {progress.quetes.filter(q => q.current < q.total).length}
            </span>
          </div>
          <button style={{
            fontSize: 11, fontWeight: 900, color: '#2a9d8f',
            background: 'none', border: 'none', cursor: 'pointer',
            textTransform: 'uppercase', letterSpacing: '0.06em',
          }}>
            AFFICHER TOUT
          </button>
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: 'rgba(255,255,255,0.07)', margin: '8px 0' }}/>

        {/* Quest list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {progress.quetes.map((q, i) => (
            <React.Fragment key={q.id}>
              <QuestItem quest={q}/>
              {i < progress.quetes.length - 1 && (
                <div style={{ height: 1, background: 'rgba(255,255,255,0.05)' }}/>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* ── Hearts / Vies ─────────────────────────────── */}
      <div style={{
        background: '#1a1f2e',
        border: '1px solid rgba(180,180,180,0.4)',
        borderRadius: 16,
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--c-sub)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Vies restantes
            </div>
            <span style={{
              minWidth: 22, height: 22,
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 10, fontWeight: 900, color: '#fff',
              background: '#f87171', borderRadius: '50%',
              padding: '0 5px', flexShrink: 0,
            }}>
              5
            </span>
          </div>
          <div style={{ display: 'flex', gap: 3, marginTop: 4 }}>
            {Array.from({ length: 5 }).map((_, i) => (
              <span key={i} style={{ fontSize: 20, opacity: i < 5 ? 1 : 0.2 }}>❤️</span>
            ))}
          </div>
        </div>
        <div style={{ fontSize: 11, color: 'var(--c-sub)', fontWeight: 600, textAlign: 'right', lineHeight: 1.4 }}>
          Plein<br/>rechargement
        </div>
      </div>

      {/* ── Tip ───────────────────────────────────────── */}
      <div style={{
        background: 'linear-gradient(135deg, #1b3a6b, #2d5a9e)',
        borderRadius: 16,
        padding: '12px 16px',
        boxShadow: '0 4px 0 #0f2147',
      }}>
        <div style={{ fontSize: 10, fontWeight: 900, color: 'rgba(255,255,255,0.55)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 5 }}>
          💡 Darija du jour
        </div>
        <p style={{ fontSize: 12, color: 'white', margin: 0, lineHeight: 1.5 }}>
          <strong style={{ fontFamily: 'var(--font-amiri)', fontSize: 16 }}>لاباس؟</strong>
          {' '}— <em>Labass ?</em> — "Ça va ?" La réponse : <strong>لاباس، الحمد لله</strong> "Ça va, merci à Dieu"
        </p>
      </div>

    </div>
  );
}
