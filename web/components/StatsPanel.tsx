'use client';

import React from 'react';
import { Flame, Star } from 'lucide-react';

// Moroccan Flag SVG Component
function MoroccanFlag({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size * 0.67} viewBox="0 0 900 600" xmlns="http://www.w3.org/2000/svg">
      <rect width="900" height="600" fill="#C1272D" />
      {/* Green Pentagram Star */}
      <polygon
        points="450,150 480,240 570,240 500,290 525,380 450,330 375,380 400,290 330,240 420,240"
        fill="none"
        stroke="#006233"
        strokeWidth="18"
      />
    </svg>
  );
}

// Moroccan Geometric Gem Diamond
function GemIcon({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M14 2L26 10L14 26L2 10Z" fill="#008080" fillOpacity="0.15" stroke="#008080" strokeWidth="2" />
      <path d="M14 6L22 11L14 22L6 11Z" fill="#008080" />
    </svg>
  );
}

export default function StatsPanel() {
  return (
    <div className="flex flex-col gap-4 w-full">

      {/* Streak Widget */}
      <div className="widget-card">
        <div style={{ width: 48, height: 48, borderRadius: 14, backgroundColor: '#FFF3E0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Flame size={26} style={{ color: '#E2725B', fill: '#E2725B' }} />
        </div>
        <div>
          <div style={{ fontSize: 22, fontWeight: 900, color: '#1f2937', lineHeight: 1.1 }}>45 jours</div>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Série actuelle</div>
        </div>
      </div>

      {/* Gems Widget */}
      <div className="widget-card">
        <div style={{ width: 48, height: 48, borderRadius: 14, backgroundColor: 'var(--teal-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <GemIcon size={28} />
        </div>
        <div>
          <div style={{ fontSize: 22, fontWeight: 900, color: '#1f2937', lineHeight: 1.1 }}>750</div>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Total Gemmes</div>
        </div>
      </div>

      {/* Moroccan Course Widget */}
      <div className="widget-card">
        <div style={{ width: 48, height: 48, borderRadius: 14, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: '2px solid #e5e7eb' }}>
          <MoroccanFlag size={48} />
        </div>
        <div>
          <div style={{ fontSize: 16, fontWeight: 900, color: '#1f2937', lineHeight: 1.1 }}>DARIJA</div>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.08em' }}>الدارجة المغربية</div>
        </div>
      </div>

      {/* Daily Quests */}
      <div style={{ marginTop: 8 }}>
        <h3 style={{ fontSize: 15, fontWeight: 900, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 14, paddingLeft: 2 }}>
          Quêtes du jour
        </h3>
        {[
          { label: 'Finir 3 leçons', sub: '2 / 3', progress: 66, icon: '🕌' },
          { label: 'Gagner 100 XP', sub: '80 / 100', progress: 80, icon: '⭐' },
          { label: 'Prolonger la série', sub: '0 / 1', progress: 0, icon: '🔥' }
        ].map((q, i) => (
          <div key={i} style={{ background: 'white', border: '2px solid #f3f4f6', borderRadius: 18, padding: '12px 16px', marginBottom: 10, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <span style={{ fontSize: 13, fontWeight: 800, color: '#374151' }}>{q.icon} {q.label}</span>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af' }}>{q.sub}</span>
            </div>
            <div className="quest-bar">
              <div className="quest-bar-fill" style={{ width: `${q.progress}%` }} />
            </div>
          </div>
        ))}
      </div>

      {/* XP Counter (Brand Colors) */}
      <div style={{ background: 'linear-gradient(135deg, #008080, #006666)', borderRadius: 20, padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 5px 0 #004d4d, 0 10px 20px rgba(0,128,128,0.2)' }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Total XP</div>
          <div style={{ fontSize: 28, fontWeight: 900, color: 'white' }}>1 240</div>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 12, padding: '8px 12px', display: 'flex', alignItems: 'center', gap: 6 }}>
          <Star size={20} style={{ color: '#C9A84C', fill: '#C9A84C' }} />
          <span style={{ fontSize: 13, fontWeight: 900, color: 'white' }}>Niveau Bronze</span>
        </div>
      </div>
    </div>
  );
}
