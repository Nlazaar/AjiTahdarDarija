'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useApi } from '@/hooks/useApi';
import { getModules } from '@/lib/api';
import Loader from '@/components/Loader';
import Link from 'next/link';
import { Star } from 'lucide-react';
import { useUser } from '@/context/UserContext';

/* ==========================================
   MOROCCAN CUSTOM ICONS (SVG)
   ========================================== */
function TeaGlass() {
  return (
    <svg viewBox="0 0 40 40" width="36" height="36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 8h20l-2.5 22h-15L10 8z" fill="white" fillOpacity=".9"/>
      <ellipse cx="20" cy="8" rx="10" ry="3" fill="white" fillOpacity=".6"/>
      <path d="M30 13h4a3 3 0 1 1 0 6h-4" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
      <path d="M13 18h14" stroke="white" strokeOpacity=".4" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="3 2"/>
      <path d="M14 22h12" stroke="white" strokeOpacity=".3" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="3 2"/>
    </svg>
  );
}

function MedinaGate() {
  return (
    <svg viewBox="0 0 40 40" width="36" height="36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="18" width="32" height="18" rx="2" fill="white" fillOpacity=".85"/>
      <path d="M8 18 A12 12 0 0 1 32 18" fill="white"/>
      {/* Crenellations */}
      <rect x="4" y="13" width="4" height="5" fill="white" fillOpacity=".85" rx="1"/>
      <rect x="10" y="13" width="4" height="5" fill="white" fillOpacity=".85" rx="1"/>
      <rect x="26" y="13" width="4" height="5" fill="white" fillOpacity=".85" rx="1"/>
      <rect x="32" y="13" width="4" height="5" fill="white" fillOpacity=".85" rx="1"/>
      {/* Door */}
      <path d="M17 36v-8 A3 3 0 0 1 23 28v8" fill="white" fillOpacity=".3"/>
    </svg>
  );
}

function Tajine() {
  return (
    <svg viewBox="0 0 40 40" width="36" height="36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="20" cy="30" rx="16" ry="5" fill="white" fillOpacity=".85"/>
      <rect x="4" y="24" width="32" height="6" rx="3" fill="white" fillOpacity=".9"/>
      <path d="M10 24 L20 6 L30 24Z" fill="white" fillOpacity=".8"/>
      <circle cx="20" cy="6" r="2.5" fill="white" fillOpacity=".5"/>
      <path d="M14 20h12" stroke="white" strokeOpacity=".3" strokeWidth="1" strokeLinecap="round"/>
    </svg>
  );
}

function HennaFlower() {
  return (
    <svg viewBox="0 0 40 40" width="36" height="36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="20" cy="20" r="8" fill="white" fillOpacity=".9"/>
      <circle cx="20" cy="20" r="4" fill="white" fillOpacity=".4"/>
      {[0,60,120,180,240,300].map((deg, i) => (
        <ellipse key={i} cx="20" cy="20" rx="3" ry="7"
          fill="white" fillOpacity=".75"
          transform={`rotate(${deg} 20 20) translate(0 -10)`}
        />
      ))}
    </svg>
  );
}

function MoroccanGoldenLock({ size = 32 }: { size?: number }) {
  return (
    <svg viewBox="0 0 40 40" width={size} height={size} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Golden Base */}
      <rect x="8" y="16" width="24" height="20" rx="4" fill="#D1A15E" />
      <rect x="10" y="18" width="20" height="16" rx="2" fill="none" stroke="#E6C88A" strokeWidth="1" />
      {/* Shackle */}
      <path d="M12 16V12A8 8 0 0 1 28 12V16" stroke="#D1A15E" strokeWidth="4" strokeLinecap="round" />
      <path d="M12 16V12A8 8 0 0 1 28 12V16" stroke="#f5e2b8" strokeWidth="1" strokeLinecap="round" />
      {/* Intricate Keyhole (Moroccan Arch) */}
      <path d="M20 22 C18 22 17 24 18 26 L18 29 C18 30 22 30 22 29 L22 26 C23 24 22 22 20 22 Z" fill="#997030" />
      {/* Geometric Accents */}
      <circle cx="14" cy="21" r="1.5" fill="#E6C88A" />
      <circle cx="26" cy="21" r="1.5" fill="#E6C88A" />
      <circle cx="14" cy="29" r="1.5" fill="#E6C88A" />
      <circle cx="26" cy="29" r="1.5" fill="#E6C88A" />
    </svg>
  );
}

const ICONS = [TeaGlass, MedinaGate, Tajine, HennaFlower];

/* ==========================================
   LESSON NODE
   ========================================== */
function LessonNode({ lesson, iconIdx, mascot, href, onClick }: { lesson: any; iconIdx: number; mascot: string; href?: any; onClick?: () => void }) {
  const Icon = ICONS[iconIdx % ICONS.length];
  const nodeClass = lesson.completed
    ? (iconIdx % 2 === 0 ? 'node-teal' : 'node-terracotta')
    : lesson.current
      ? 'node-terracotta'
      : 'node-locked';

  return (
    <div className="relative flex flex-col items-center" style={{ zIndex: 20 }}>

      {/* Stars arc removed per Step 3 instructions */}

      {/* Circle Node */}
      <Link
        href={onClick ? '#' : (href ?? (lesson.locked ? '#' : `/lesson/${lesson.id}`))}
        onClick={e => {
          if (lesson.locked) e.preventDefault();
          if (onClick) {
            e.preventDefault();
            onClick();
          }
        }}
        className={nodeClass}
        style={{
          width: 90, height: 90,
          borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'transform 0.2s cubic-bezier(0.34,1.56,0.64,1)',
          cursor: lesson.locked ? 'not-allowed' : 'pointer',
        }}
      >
        {lesson.locked ? <MoroccanGoldenLock size={32} /> : <Icon />}
      </Link>

      {/* Label */}
      <div style={{
        marginTop: 10, fontSize: 11, fontWeight: 800,
        color: '#6b7280', letterSpacing: '0.06em',
        textTransform: 'uppercase', textAlign: 'center', maxWidth: 110, lineHeight: 1.4
      }}>
        {lesson.label}
      </div>

      {/* Mascot + Turquoise Speech Bubble (only on current lesson) */}
      {lesson.current && (
        <div
          className="absolute animate-mascot"
          style={{ left: 108, top: '50%', transform: 'translateY(-58%)', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', pointerEvents: 'none', zIndex: 30 }}
        >
          <div className="speech-bubble" style={{ marginBottom: 10, marginLeft: 10, textShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>
            SAYE, BSSAHI! 👍
          </div>
          <img src={mascot} alt="Mascot" style={{ width: 85, height: 85, objectFit: 'contain', marginLeft: 10, filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.15))' }} />
        </div>
      )}
    </div>
  );
}

/* ==========================================
   PAGE
   ========================================== */
const MOCK_MODULES = [
  {
    id: '1', title: 'ESCALE À TANGER', subtitle: 'Les Salutations', colorA: '#009898', colorB: '#008080', shadowColor: '#006060',
    lessons: [
      { id: 'l1', label: 'Bases', stars: 0, current: true },
      { id: 'l2', label: 'Politesse', stars: 0, locked: true },
      { id: 'l3', label: 'Verbes', stars: 0, locked: true },
      { id: 'l4', label: 'Phrases', stars: 0, locked: true },
      { id: 'l5', label: 'Objets', stars: 0, locked: true },
      { id: 'l6', label: 'Révision', stars: 0, locked: true },
    ]
  },
  {
    id: '2', title: 'SOUK DE MARRAKECH', subtitle: 'Les Nombres', colorA: '#f08060', colorB: '#E2725B', shadowColor: '#c05540',
    lessons: [
      { id: 'l4', label: 'Waḥed, Jouj', stars: 0, current: true },
      { id: 'l5', label: 'Tlata, Rbʿa', stars: 0, locked: true },
      { id: 'l6', label: 'Khmsa, Stta', stars: 0, locked: true },
    ]
  },
  {
    id: '3', title: 'RIAD DE FÈS', subtitle: 'La Famille', colorA: '#dbb060', colorB: '#C9A84C', shadowColor: '#a07830',
    lessons: [
      { id: 'l7', label: 'L-ʿaila', stars: 0, locked: true },
      { id: 'l8', label: 'Wa, ukht', stars: 0, locked: true },
    ]
  },
];

const ZIGZAG = [0, 90, 150, 90, 0, -90, -150, -90];

export default function ProgressPage() {
  const router = useRouter();
  const { loading, callApi } = useApi();
  const { mascot } = useUser();
  const [modules, setModules] = useState<any[]>([]);

  useEffect(() => {
    callApi(getModules).then(setModules).catch(() => setModules(MOCK_MODULES));
  }, []);

  const moduleList = Array.isArray(modules)
    ? modules
    : (modules && (modules as any).modules)
      ? (modules as any).modules
      : MOCK_MODULES;

  if (loading && moduleList.length === 0) return <Loader />;

  let globalIconIdx = 0;

  return (
    <div className="flex flex-col items-center w-full min-h-screen pb-32 pt-10 relative bg-zellige" style={{ isolation: 'isolate' }}>

      {moduleList.map((m, mIndex) => {
        const lessons = m.lessons ?? [];
        return (
          <React.Fragment key={m.id}>

            {/* Unit Header Pill */}
            <div
              className="unit-pill"
              style={{
                marginBottom: 24,
                marginTop: mIndex > 0 ? 88 : 0,
                background: `linear-gradient(135deg, ${m.colorA ?? '#009898'}, ${m.colorB ?? '#008080'})`,
                boxShadow: `0 5px 0 ${m.shadowColor ?? '#006060'}, 0 12px 28px ${(m.colorB ?? '#008080')}55`,
              }}
            >
              <span style={{ fontSize: 10, fontWeight: 900, opacity: 0.7, letterSpacing: '0.3em', marginBottom: 4 }}>
                UNITÉ {mIndex + 1}
              </span>
              <h2 style={{ fontSize: 17, fontWeight: 900, letterSpacing: '0.04em', margin: 0, lineHeight: 1.1 }}>
                {m.title}
              </h2>
              <p style={{ fontSize: 13, fontWeight: 700, opacity: 0.82, margin: '4px 0 0', letterSpacing: '0.02em' }}>
                {m.subtitle}
              </p>
            </div>

            {/* Path Container */}
            <div className="relative flex flex-col items-center w-full max-w-[540px] mb-8 px-4">

              {/* Connectors removed per Visual Fix directive */}

              {/* Lesson Nodes */}
              <div className="flex flex-col items-center gap-10 w-full z-10">
                        {lessons.map((lesson: any, i: number) => {
                  const idx = globalIconIdx++;
                  return (
                    <div
                      key={lesson.id}
                      className="relative flex flex-col items-center"
                      style={{ transform: `translateX(${ZIGZAG[i % ZIGZAG.length]}px)` }}
                    >
                               {/* For the 'Bases' node we open the Alphabet lesson, otherwise minimal progress */}
                              <LessonNode 
                                lesson={lesson} 
                                iconIdx={idx} 
                                mascot={mascot} 
                                href={lesson.id === 'l1' ? undefined : (lesson.id === 'l1' ? `/lesson/${lesson.id}/progress` : undefined)} 
                                onClick={lesson.id === 'l1' ? () => router.push('/lecons/alphabet') : undefined}
                              />
                    </div>
                  );
                })}
              </div>
            </div>
          </React.Fragment>
        );
      })}

      {/* Bottom vignette */}
      <div className="fixed bottom-0 left-0 w-full h-20 pointer-events-none z-0"
        style={{ background: 'linear-gradient(to top, rgba(255,255,255,0.95), transparent)' }} />
    </div>
  );
}
