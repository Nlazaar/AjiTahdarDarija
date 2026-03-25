'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Loader from '@/components/Loader';
import { useMascot, MASCOT_IMAGES, MascotId } from '@/contexts/MascotContext';
import { useUserProgress } from '@/contexts/UserProgressContext';
import { getLessonHref } from '@/lib/lessonLink';

/* ─────────────────────────────────────────────
   SECTION THEMES
───────────────────────────────────────────── */
const SECTION_THEMES = [
  { name: 'Désert',    animal: '🐪', colorA: '#e9a84c', colorB: '#d4842a', shadow: '#b06818' },
  { name: 'Médina',    animal: '🐈', colorA: '#2a9d8f', colorB: '#1e7a6d', shadow: '#155e54' },
  { name: 'Mer',       animal: '🐟', colorA: '#457b9d', colorB: '#2c5f7e', shadow: '#1a4560' },
  { name: 'Montagne',  animal: '🦅', colorA: '#588157', colorB: '#3a5a40', shadow: '#2a4030' },
  { name: 'Forêt',     animal: '🦔', colorA: '#6a994e', colorB: '#4a7230', shadow: '#3a5820' },
  { name: 'Ville',     animal: '🐦', colorA: '#4a4e69', colorB: '#2c2f45', shadow: '#1a1c30' },
  { name: 'Jardin',    animal: '🦋', colorA: '#e76f51', colorB: '#c05540', shadow: '#9a3020' },
  { name: 'Palais',    animal: '🦁', colorA: '#c9941a', colorB: '#a07830', shadow: '#7a5818' },
] as const;
type SectionTheme = typeof SECTION_THEMES[number];

/* ─────────────────────────────────────────────
   MOCK (fallback)
───────────────────────────────────────────── */
const MOCK_MODULES: Record<string, any> = {
  '1': {
    id: '1', title: 'Alphabet Darija', subtitle: 'Les lettres arabes',
    colorA: '#2a9d8f', colorB: '#1e7a6d', shadowColor: '#155e54',
    lessons: [
      { id: 'l1', title: 'Introduction',  label: 'Intro',    current: true },
      { id: 'l2', title: 'ب ت ث',         label: 'ب ت ث',   locked: true  },
      { id: 'l3', title: 'ج ح خ',         label: 'ج ح خ',   locked: true  },
      { id: 'l4', title: 'Révision',      label: 'Révision', locked: true  },
    ],
  },
  '2': {
    id: '2', title: 'Les Salutations', subtitle: 'Premiers mots',
    colorA: '#e76f51', colorB: '#c05540', shadowColor: '#9a3020',
    lessons: [
      { id: 'l5', title: 'Bonjour',   label: 'Bonjour',   current: true },
      { id: 'l6', title: 'Au revoir', label: 'Au revoir', locked: true  },
      { id: 'l7', title: 'Merci',     label: 'Merci',     locked: true  },
    ],
  },
  '3': {
    id: '3', title: 'Les Chiffres', subtitle: 'Compter en Darija',
    colorA: '#e9a84c', colorB: '#d4842a', shadowColor: '#b06818',
    lessons: [
      { id: 'l8',  title: '1 → 5',  label: '1 → 5',  current: true },
      { id: 'l9',  title: '6 → 10', label: '6 → 10', locked: true  },
      { id: 'l10', title: '10+',    label: '10+',     locked: true  },
    ],
  },
  '4': {
    id: '4', title: 'Les Couleurs', subtitle: 'Arc-en-ciel en Darija',
    colorA: '#c9941a', colorB: '#a07830', shadowColor: '#7a5818',
    lessons: [
      { id: 'l11', title: 'Rouge / Bleu', label: 'Rouge/Bleu', current: true },
      { id: 'l12', title: 'Vert / Jaune', label: 'Vert/Jaune', locked: true  },
    ],
  },
};

/* ─────────────────────────────────────────────
   ICONS
───────────────────────────────────────────── */
function LockIcon() {
  return (
    <svg viewBox="0 0 24 24" width="26" height="26" fill="none">
      <rect x="5" y="11" width="14" height="10" rx="2" fill="#9ca3af"/>
      <path d="M8 11V7a4 4 0 1 1 8 0v4" stroke="#9ca3af" strokeWidth="2.5" strokeLinecap="round"/>
      <circle cx="12" cy="16" r="1.5" fill="white"/>
    </svg>
  );
}
function CheckIcon({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 24 24" width="30" height="30" fill="none">
      <path d="M5 13l4 4L19 7" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

/* ─────────────────────────────────────────────
   LESSON POPUP
───────────────────────────────────────────── */
function LessonPopup({
  lesson, href, theme, onClose,
}: {
  lesson: any; href: string; theme: SectionTheme; onClose: () => void;
}) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const isLocked    = !!lesson.locked;
  const isCompleted = !!lesson.completed;

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/50"
        style={{ backdropFilter: 'blur(3px)' }}
        onClick={onClose}/>
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl"
        style={{
          maxWidth: '420px', margin: '0 auto',
          boxShadow: '0 -8px 40px rgba(0,0,0,0.2)',
          animation: 'slideUp 0.28s ease out',
        }}>
        <div className="h-1.5 w-full rounded-t-3xl"
          style={{ background: `linear-gradient(90deg, ${theme.colorA}, ${theme.colorB})` }}/>
        <div className="flex justify-center pt-3">
          <div className="w-9 h-1 rounded-full bg-gray-200"/>
        </div>
        <div className="px-6 pt-4 pb-8">
          {/* Header */}
          <div className="flex items-center gap-3 mb-5">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-[32px] flex-shrink-0"
              style={{ background: `${theme.colorA}22` }}>
              {theme.animal}
            </div>
            <div>
              <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">
                {theme.name}
              </div>
              <div className="text-[19px] font-black text-gray-900 leading-tight">
                {lesson.label ?? lesson.title ?? 'Leçon'}
              </div>
              {isCompleted && (
                <div className="text-[11px] font-bold mt-0.5" style={{ color: theme.colorA }}>
                  ✓ Complétée
                </div>
              )}
            </div>
          </div>
          {/* Stats */}
          <div className="flex gap-2.5 mb-5">
            {[
              { v: `+${lesson.xp ?? 10}`, u: 'XP',        e: '⭐', c: '#fbbf24' },
              { v: lesson._count?.exercises ?? '~5', u: 'Exercices', e: '📝', c: theme.colorA },
              { v: '~3',                 u: 'min',       e: '⏱',  c: '#34d399' },
            ].map(({ v, u, e, c }) => (
              <div key={u} className="flex-1 bg-gray-50 rounded-xl p-2.5 text-center">
                <div className="text-lg mb-0.5">{e}</div>
                <div className="text-[18px] font-black" style={{ color: c }}>{v}</div>
                <div className="text-[9px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">{u}</div>
              </div>
            ))}
          </div>
          {/* CTA */}
          {isLocked ? (
            <div className="w-full text-center text-gray-400 font-black text-[15px] py-4 rounded-2xl bg-gray-100">
              🔒 Terminez la leçon précédente
            </div>
          ) : (
            <Link href={href} onClick={onClose}
              className="block w-full text-center text-white font-black text-[17px] py-4 rounded-2xl active:scale-95 transition-transform"
              style={{
                background: `linear-gradient(135deg, ${theme.colorA}, ${theme.colorB})`,
                boxShadow: `0 5px 0 ${theme.shadow}`,
              }}>
              {isCompleted ? 'Rejouer →' : 'Commencer →'}
            </Link>
          )}
        </div>
      </div>
    </>
  );
}

/* ─────────────────────────────────────────────
   PROGRESS CARD
───────────────────────────────────────────── */
function ProgressCard({
  chapterNum, progressPct, completedCount, totalCount,
  colorA, colorB, shadow, mascotSrc, onContinue,
}: {
  chapterNum: number; progressPct: number;
  completedCount: number; totalCount: number;
  colorA: string; colorB: string; shadow: string;
  mascotSrc: string; onContinue: () => void;
}) {
  const isDone = progressPct >= 100;

  return (
    <div style={{
      width: '100%',
      background: 'linear-gradient(135deg, #dbeafe 0%, #eff6ff 100%)',
      borderRadius: 20,
      padding: '18px 16px',
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
      border: '1.5px solid rgba(147,197,253,0.4)',
    }}>
      {/* Left: title + bar + button */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: 11, fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.12em', margin: '0 0 4px' }}>
          Chapitre {chapterNum}
        </p>

        {/* Progress bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <div style={{
            flex: 1, height: 22, background: '#e2e8f0', borderRadius: 11,
            overflow: 'hidden', position: 'relative',
          }}>
            <div style={{
              height: '100%',
              width: `${progressPct}%`,
              background: `linear-gradient(90deg, ${colorA}, ${colorB})`,
              borderRadius: 11,
              transition: 'width 0.8s ease',
              display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
              paddingRight: 8,
              minWidth: progressPct > 5 ? 48 : 0,
            }}>
              {progressPct > 10 && (
                <span style={{ fontSize: 11, fontWeight: 900, color: 'white' }}>
                  {progressPct} %
                </span>
              )}
            </div>
            {progressPct <= 10 && (
              <span style={{
                position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)',
                fontSize: 11, fontWeight: 900, color: '#94a3b8',
              }}>
                {progressPct} %
              </span>
            )}
          </div>
          {/* Trophy at the end */}
          <div style={{
            width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
            background: isDone ? `linear-gradient(135deg, ${colorA}, ${colorB})` : '#e2e8f0',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 16,
            boxShadow: isDone ? `0 3px 0 ${shadow}` : 'none',
            transition: 'background 0.4s',
          }}>
            {isDone ? '🏆' : '🥇'}
          </div>
        </div>

        {/* Continue button */}
        <button
          onClick={onContinue}
          style={{
            width: '100%', padding: '11px 0',
            borderRadius: 12, border: 'none', cursor: 'pointer',
            background: `linear-gradient(135deg, ${colorA}, ${colorB})`,
            color: 'white', fontWeight: 900, fontSize: 13,
            letterSpacing: '0.08em', textTransform: 'uppercase',
            boxShadow: `0 4px 0 ${shadow}`,
          }}>
          {isDone ? 'Terminé ✓' : completedCount === 0 ? 'Commencer →' : 'Continuer →'}
        </button>
      </div>

      {/* Right: mascot + speech bubble */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0, gap: 4 }}>
        {/* Bubble */}
        <div style={{
          background: 'white', borderRadius: '12px 12px 12px 4px',
          padding: '6px 10px', fontSize: 12, fontWeight: 700, color: '#374151',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          whiteSpace: 'nowrap',
        }}>
          {isDone ? 'Bravo ! 🎉' : completedCount === 0 ? 'Yallah !' : 'Continue !'}
        </div>
        <img src={mascotSrc} alt="mascot" style={{ width: 72, height: 72, objectFit: 'contain' }} />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   SERPENTINE CONNECTOR
───────────────────────────────────────────── */
function SerpentineConnector({ fromX, toX }: { fromX: number; toX: number }) {
  const dx = toX - fromX;
  return (
    <svg viewBox="0 0 160 28" width="160" height="28" className="my-[-3px]" style={{ overflow: 'visible' }}>
      <path
        d={`M 80 0 C ${80+dx*0.4} 9, ${80+dx*0.6} 19, ${80+dx} 28`}
        fill="none" stroke="rgba(0,0,0,0.15)" strokeWidth="3"
        strokeDasharray="5 4" strokeLinecap="round"
      />
    </svg>
  );
}

/* ─────────────────────────────────────────────
   LESSON NODE
───────────────────────────────────────────── */
function LessonNode({
  lesson, theme, mascotId, href, animDelay, onTap,
}: {
  lesson: any; theme: SectionTheme; mascotId: MascotId;
  href: string; animDelay: number;
  onTap: (lesson: any, href: string) => void;
}) {
  const [shake, setShake] = useState(false);
  const isCompleted = !!lesson.completed;
  const isActive    = !!lesson.current && !isCompleted;
  const isLocked    = !!lesson.locked;

  let nodeBg     = '#e5e7eb';
  let nodeShadow = '0 5px 0 #9ca3af, 0 8px 16px rgba(0,0,0,0.07)';
  let nodeBorder = '#d1d5db';

  if (isCompleted) {
    nodeBg     = `linear-gradient(135deg, ${theme.colorA}, ${theme.colorB})`;
    nodeShadow = `0 5px 0 ${theme.shadow}, 0 8px 20px rgba(0,0,0,0.18)`;
    nodeBorder = `${theme.colorA}bb`;
  } else if (isActive) {
    nodeBg     = `linear-gradient(135deg, ${theme.colorA}, ${theme.colorB})`;
    nodeShadow = `0 5px 0 ${theme.shadow}, 0 8px 20px rgba(0,0,0,0.25)`;
    nodeBorder = theme.colorA;
  }

  const mascotSrc = MASCOT_IMAGES[mascotId];

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isLocked) { setShake(true); setTimeout(() => setShake(false), 400); return; }
    onTap(lesson, href);
  };

  return (
    <div className="node-container" style={{ animation: `fadeInUp 0.45s ease both ${animDelay}s` }}>
      {/* Mascot bubble — active */}
      {isActive && (
        <div className="absolute left-[88px] top-[-8px] flex flex-col items-start pointer-events-none z-30">
          <div className="speech-bubble mb-2 ml-3 whitespace-nowrap">Yallah !</div>
          <img src={mascotSrc} alt="mascot"
            className="w-28 h-28 object-contain ml-3 drop-shadow-xl animate-mascot"/>
        </div>
      )}

      <button
        onClick={handleClick}
        className={`node-btn ${shake ? 'animate-shake-x' : ''}`}
        style={{
          background:  isLocked ? '#e5e7eb' : nodeBg,
          border:      `3px solid ${isLocked ? '#d1d5db' : nodeBorder}`,
          boxShadow:   nodeShadow,
          cursor:      isLocked ? 'not-allowed' : 'pointer',
          animation:   isActive ? 'pulse 2s ease-in-out infinite' : undefined,
        }}
      >
        {isLocked    ? <LockIcon /> :
         isCompleted ? <CheckIcon color={theme.colorA} /> :
         <img src={mascotSrc} alt="" className="w-10 h-10 object-contain"
           style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.25))' }}/>}
      </button>

      <div className="mt-2.5 text-[10px] font-black text-gray-600 uppercase tracking-widest text-center max-w-[90px] leading-tight">
        {lesson.label ?? lesson.title}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   UNIT COMPLETE MODAL
───────────────────────────────────────────── */
function UnitCompleteModal({
  module, completedCount, xpTotal, colorA, colorB, shadow, onClose,
}: {
  module: any; completedCount: number; xpTotal: number;
  colorA: string; colorB: string; shadow: string; onClose: () => void;
}) {
  const router = useRouter();
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Small delay so the progress page renders first
    const t = setTimeout(() => setShow(true), 300);
    return () => clearTimeout(t);
  }, []);

  if (!show) return null;

  return (
    <>
      {/* Backdrop */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 100,
        background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)',
        animation: 'fadeIn 0.25s ease both',
      }} />

      {/* Confettis */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 101, pointerEvents: 'none', overflow: 'hidden' }}>
        {Array.from({ length: 40 }, (_, i) => (
          <div key={i} style={{
            position: 'absolute', top: '-20px',
            left: `${(i * 2.5 + 1) % 100}%`,
            width: 8 + (i % 5) * 2, height: 8 + (i % 5) * 2,
            background: ['#e9a84c','#2a9d8f','#e76f51','#fbbf24','#a78bfa','#38bdf8'][i % 6],
            borderRadius: i % 3 === 0 ? '50%' : 2,
            animation: `confettiFall ${1.8 + (i % 4) * 0.3}s ease-in ${(i * 0.07) % 1.4}s both`,
          }} />
        ))}
        <style>{`@keyframes confettiFall { 0%{transform:translateY(0) rotate(0deg);opacity:1} 100%{transform:translateY(110vh) rotate(900deg);opacity:0} }`}</style>
      </div>

      {/* Card */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 102,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '24px 16px',
      }}>
        <div style={{
          background: 'white', borderRadius: 28, padding: '36px 28px',
          width: '100%', maxWidth: 380, textAlign: 'center',
          boxShadow: '0 24px 80px rgba(0,0,0,0.35)',
          animation: 'bounceIn 0.45s cubic-bezier(0.34,1.56,0.64,1) both 0.1s',
        }}>

          {/* Trophy */}
          <div style={{
            width: 100, height: 100, borderRadius: '50%', margin: '0 auto 20px',
            background: `linear-gradient(135deg, ${colorA}, ${colorB})`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 52, boxShadow: `0 6px 0 ${shadow}`,
          }}>🏆</div>

          {/* Title */}
          <p style={{ fontSize: 11, fontWeight: 900, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.2em', margin: '0 0 8px' }}>
            Unité terminée !
          </p>
          <h2 style={{ fontSize: 24, fontWeight: 900, color: '#1f2937', margin: '0 0 4px', lineHeight: 1.2 }}>
            {module?.title}
          </h2>
          <p style={{ fontSize: 13, color: '#6b7280', margin: '0 0 24px' }}>{module?.subtitle}</p>

          {/* Stats row */}
          <div style={{ display: 'flex', gap: 10, marginBottom: 24 }}>
            {[
              { icon: '📖', val: `${completedCount}`, label: 'Leçons' },
              { icon: '⭐', val: `+${xpTotal}`,        label: 'XP total' },
              { icon: '✅', val: '100%',                label: 'Complet' },
            ].map(s => (
              <div key={s.label} style={{
                flex: 1, background: '#f9fafb', borderRadius: 14, padding: '12px 6px',
                border: '2px solid #f3f4f6',
              }}>
                <div style={{ fontSize: 20 }}>{s.icon}</div>
                <div style={{ fontSize: 18, fontWeight: 900, color: colorA }}>{s.val}</div>
                <div style={{ fontSize: 10, color: '#9ca3af', fontWeight: 700, textTransform: 'uppercase' }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Progress bar full */}
          <div style={{ height: 10, background: '#f3f4f6', borderRadius: 5, overflow: 'hidden', marginBottom: 24 }}>
            <div style={{
              height: '100%', width: '100%',
              background: `linear-gradient(90deg, ${colorA}, ${colorB})`,
              borderRadius: 5, animation: 'growWidth 1s ease both 0.3s',
            }} />
          </div>
          <style>{`@keyframes growWidth { from { width: 0% } to { width: 100% } }`}</style>

          {/* Buttons */}
          <button
            onClick={() => router.push('/progress')}
            style={{
              width: '100%', padding: '15px', borderRadius: 16, marginBottom: 10,
              background: `linear-gradient(135deg, ${colorA}, ${colorB})`,
              color: 'white', fontWeight: 900, fontSize: 16,
              border: 'none', cursor: 'pointer',
              boxShadow: `0 5px 0 ${shadow}`,
            }}>
            Unité suivante →
          </button>
          <button
            onClick={onClose}
            style={{
              width: '100%', padding: '12px', borderRadius: 16,
              background: 'transparent', color: '#6b7280',
              fontWeight: 700, fontSize: 14,
              border: '2px solid #e5e7eb', cursor: 'pointer',
            }}>
            Rester dans l'unité
          </button>
        </div>
      </div>
    </>
  );
}

/* ─────────────────────────────────────────────
   PAGE — Unit path for one chapter
───────────────────────────────────────────── */
const ZIGZAG = [0, 80, 120, 80, 0, -80, -120, -80];

export default function UnitPathPage() {
  const params        = useParams();
  const router        = useRouter();
  const searchParams  = useSearchParams();
  const { mascot }    = useMascot();
  const { progress }  = useUserProgress();

  const id = params?.id as string;
  const mascotId: MascotId = (mascot?.id ?? 'lion') as MascotId;

  const [module,  setModule]  = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [popup,   setPopup]   = useState<{ lesson: any; href: string; theme: SectionTheme } | null>(null);
  const [showUnitModal, setShowUnitModal] = useState(false);

  // Déclenche le modal si ?unitComplete=true est dans l'URL
  useEffect(() => {
    if (searchParams?.get('unitComplete') === 'true') {
      setShowUnitModal(true);
      // Nettoie l'URL sans recharger la page
      router.replace(`/progress/${id}`, { scroll: false });
    }
  }, [searchParams, id, router]);

  useEffect(() => {
    const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';
    fetch(`${BASE}/modules`)
      .then(r => r.ok ? r.json() : [])
      .then((mods: any[]) => {
        const found = mods.find((m: any) => m.id === id);
        if (found) setModule({ ...found, lessons: found.lessons ?? [] });
        else setModule(MOCK_MODULES[id] ?? MOCK_MODULES['1']);
      })
      .catch(() => setModule(MOCK_MODULES[id] ?? MOCK_MODULES['1']))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Loader />;
  if (!module)  return <div className="p-8 text-center text-gray-500">Chapitre introuvable</div>;

  // Pick a theme based on module level or a stable hash of the id
  const themeIndex = module.level != null
    ? (module.level - 1)
    : Math.abs(id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)) % SECTION_THEMES.length;
  const theme = SECTION_THEMES[themeIndex % SECTION_THEMES.length];
  const colorA = module.colorA ?? theme.colorA;
  const colorB = module.colorB ?? theme.colorB;
  const shadow = module.shadowColor ?? theme.shadow;
  const lessons = module.lessons ?? [];

  // Déverrouillage séquentiel : leçon N accessible si leçon N-1 est complétée
  // On fusionne les completedLessons du contexte avec ceux remontés par l'API
  const lessonsWithState = lessons.map((l: any, i: number) => {
    const doneInCtx = progress.completedLessons.includes(l.id);
    const doneInApi = !!l.completed;
    const completed = doneInCtx || doneInApi;

    // La première est toujours déverrouillée ; les suivantes si la précédente est terminée
    const prevDone = i === 0
      ? true
      : (progress.completedLessons.includes(lessons[i - 1]?.id) || !!lessons[i - 1]?.completed);

    return { ...l, completed, locked: !completed && !prevDone };
  });

  const completedCount = lessonsWithState.filter((l: any) => l.completed).length;
  const progressPct    = lessons.length > 0
    ? Math.round((completedCount / lessons.length) * 100)
    : 0;

  return (
    <div className="flex flex-col items-center w-full min-h-screen pb-40 relative bg-zellige">

      {/* ── STICKY HEADER ── */}
      <div className="sticky top-0 z-50 w-full"
        style={{ backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)',
                 backgroundColor: 'rgba(255,255,255,0.9)', borderBottom: '1px solid rgba(0,0,0,0.07)' }}>
        <div className="max-w-sm mx-auto px-4 py-3">
          {/* Row 1: back + title + XP */}
          <div className="flex items-center gap-3 mb-2">
            <button onClick={() => router.push('/progress')}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
              title="Retour aux chapitres">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
                <path d="M15 19l-7-7 7-7" stroke="#374151" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <div className="flex-1 min-w-0">
              <div className="text-[13px] font-black text-gray-900 truncate">{module.title}</div>
              <div className="text-[10px] text-gray-400 font-semibold">{module.subtitle}</div>
            </div>
          </div>

          {/* Row 2: chapter progress bar */}
          <div className="flex items-center gap-2">
            <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${progressPct}%`,
                  background: `linear-gradient(90deg, ${colorA}, ${colorB})`,
                }}/>
            </div>
            <span className="text-[10px] font-black flex-shrink-0"
              style={{ color: colorA }}>
              {completedCount}/{lessons.length}
            </span>
          </div>
        </div>
      </div>

      {/* ── MODULE BANNER ── */}
      <div className="w-full max-w-sm px-4 pt-4 pb-2">
        <div className="w-full rounded-2xl px-5 py-4 flex items-center gap-4"
          style={{
            background: `linear-gradient(135deg, ${colorA}, ${colorB})`,
            boxShadow: `0 5px 0 ${shadow}, 0 10px 24px rgba(0,0,0,0.12)`,
          }}>
          <div className="text-[44px] leading-none select-none"
            style={{ filter: 'drop-shadow(2px 4px 6px rgba(0,0,0,0.2))' }}>
            {theme.animal}
          </div>
          <div className="text-white">
            <div className="text-[10px] font-black opacity-65 tracking-[0.3em] uppercase">
              {theme.name} · {lessons.length} UNITÉS
            </div>
            <div className="text-[18px] font-black leading-tight mt-0.5">{module.title}</div>
            <div className="text-[12px] font-semibold opacity-75 mt-0.5">{module.subtitle}</div>
          </div>
        </div>
        {/* Arrow */}
        <div className="mx-auto mt-1 w-0 h-0"
          style={{
            borderLeft: '14px solid transparent',
            borderRight: '14px solid transparent',
            borderTop: `9px solid ${shadow}`,
          }}/>
      </div>

      {/* ── PROGRESS CARD ── */}
      <div className="w-full max-w-sm px-4 pt-3 pb-1">
        <ProgressCard
          chapterNum={module.order ?? (module.level ?? 1)}
          progressPct={progressPct}
          completedCount={completedCount}
          totalCount={lessons.length}
          colorA={colorA}
          colorB={colorB}
          shadow={shadow}
          mascotSrc={MASCOT_IMAGES[mascotId]}
          onContinue={() => {
            // Scroll jusqu'à la première leçon non complétée ou commencer
            const firstUnlocked = lessonsWithState.find((l: any) => !l.completed && !l.locked);
            if (firstUnlocked) {
              const el = document.getElementById(`lesson-node-${firstUnlocked.id}`);
              el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
          }}
        />
      </div>

      {/* ── ZIGZAG NODES ── */}
      <div className="w-full max-w-sm flex flex-col items-center px-4 pt-4">
        {lessonsWithState.map((lesson: any, i: number) => {
          const xOffset = ZIGZAG[i % ZIGZAG.length];
          const nextOff = ZIGZAG[(i + 1) % ZIGZAG.length];
          const isLast  = i === lessons.length - 1;

          return (
            <React.Fragment key={lesson.id ?? i}>
              <div id={`lesson-node-${lesson.id}`} className="relative" style={{ transform: `translateX(${xOffset}px)` }}>
                <LessonNode
                  lesson={lesson}
                  theme={theme}
                  mascotId={mascotId}
                  href={getLessonHref(lesson)}
                  animDelay={i * 0.06}
                  onTap={(l, href) => setPopup({ lesson: l, href, theme })}
                />
              </div>
              {!isLast && (
                <div style={{ transform: `translateX(${xOffset}px)` }}>
                  <SerpentineConnector fromX={0} toX={nextOff - xOffset}/>
                </div>
              )}
            </React.Fragment>
          );
        })}

        {/* End of chapter card */}
        {lessons.length > 0 && (
          <div className="mt-8 w-full rounded-2xl p-5 text-center"
            style={{ background: 'linear-gradient(160deg, #1e2235, #2a2f45)', boxShadow: '0 4px 20px rgba(0,0,0,0.2)' }}>
            <div className="text-3xl mb-2">🎉</div>
            <div className="text-[15px] font-black text-white">Fin du chapitre</div>
            <div className="text-[12px] text-gray-400 mt-1">Terminez toutes les unités pour débloquer le suivant</div>
            <button onClick={() => router.push('/progress')}
              className="mt-4 px-5 py-2.5 rounded-xl text-[12px] font-black tracking-wider uppercase"
              style={{
                background: 'rgba(255,255,255,0.1)',
                border: '2px solid rgba(255,255,255,0.15)',
                color: 'white',
              }}>
              ← Retour aux chapitres
            </button>
          </div>
        )}
      </div>

      {/* Popup leçon */}
      {popup && (
        <LessonPopup
          lesson={popup.lesson}
          href={popup.href}
          theme={popup.theme}
          onClose={() => setPopup(null)}
        />
      )}

      {/* Modal unité terminée */}
      {showUnitModal && (
        <UnitCompleteModal
          module={module}
          completedCount={completedCount}
          xpTotal={completedCount * 40}
          colorA={colorA}
          colorB={colorB}
          shadow={shadow}
          onClose={() => setShowUnitModal(false)}
        />
      )}

      <div className="fixed bottom-0 left-0 w-full h-28 pointer-events-none z-40 bg-gradient-to-t from-white/80 to-transparent"/>
    </div>
  );
}
