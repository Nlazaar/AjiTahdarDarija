'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Loader from '@/components/Loader';
import { useMascot, MASCOT_EMOJI } from '@/contexts/MascotContext';
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

const MODULE_PHRASES = [
  { ar: 'الف با تا',       fr: 'Alef, ba, ta…' },
  { ar: 'سلام عليكم',      fr: 'Salam ! Bonjour !' },
  { ar: 'واحد جوج تلاتة', fr: '1, 2, 3…' },
  { ar: 'حمر، خضر، زرق',  fr: 'Rouge, vert, bleu' },
  { ar: 'اسمي…',           fr: 'Mon prénom est…' },
  { ar: 'بغيت كوسكوس',    fr: 'Je veux du couscous !' },
  { ar: 'ماشي مشكيل!',    fr: 'Pas de problème !' },
  { ar: 'الدارجة سهلة!',   fr: "Le Darija c'est facile !" },
];

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
   SPEECH BUBBLE
───────────────────────────────────────────── */
function SpeechBubble({ phrase }: { phrase: { ar: string; fr: string } }) {
  return (
    <div style={{
      position: 'absolute', bottom: '110%', left: '50%', transform: 'translateX(-50%)',
      background: '#243b4a', borderRadius: 14, padding: '8px 14px',
      whiteSpace: 'nowrap', boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
      border: '1.5px solid rgba(255,255,255,0.12)', zIndex: 20,
    }}>
      <div style={{ fontSize: 15, fontWeight: 900, color: '#ffffff', direction: 'rtl' }}>{phrase.ar}</div>
      <div style={{ fontSize: 10, color: '#8b9eb0', fontWeight: 700, marginTop: 1 }}>{phrase.fr}</div>
      <div style={{
        position: 'absolute', bottom: -8, left: '50%', transform: 'translateX(-50%)',
        width: 0, height: 0,
        borderLeft: '7px solid transparent', borderRight: '7px solid transparent',
        borderTop: '8px solid rgba(255,255,255,0.12)',
      }} />
      <div style={{
        position: 'absolute', bottom: -5, left: '50%', transform: 'translateX(-50%)',
        width: 0, height: 0,
        borderLeft: '5px solid transparent', borderRight: '5px solid transparent',
        borderTop: '6px solid #243b4a', zIndex: 1,
      }} />
    </div>
  );
}

/* ─────────────────────────────────────────────
   LESSON POPUP (dark bottom sheet)
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
      <div className="fixed inset-0 z-50 bg-black/60"
        style={{ backdropFilter: 'blur(4px)' }}
        onClick={onClose}/>
      <div className="fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl"
        style={{
          maxWidth: '420px', margin: '0 auto',
          background: '#1e2d35',
          boxShadow: '0 -8px 40px rgba(0,0,0,0.5)',
          border: '1px solid rgba(255,255,255,0.08)',
          animation: 'slideUp 0.28s ease out',
        }}>
        <div className="h-1.5 w-full rounded-t-3xl"
          style={{ background: `linear-gradient(90deg, ${theme.colorA}, ${theme.colorB})` }}/>
        <div className="flex justify-center pt-3">
          <div className="w-9 h-1 rounded-full" style={{ background: 'rgba(255,255,255,0.2)' }}/>
        </div>
        <div className="px-6 pt-4 pb-8">
          {/* Header */}
          <div className="flex items-center gap-3 mb-5">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-[32px] flex-shrink-0"
              style={{ background: `${theme.colorA}22` }}>
              {theme.animal}
            </div>
            <div>
              <div className="text-[10px] font-black uppercase tracking-widest mb-0.5"
                style={{ color: 'rgba(255,255,255,0.4)' }}>
                {theme.name}
              </div>
              <div className="text-[19px] font-black leading-tight text-white">
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
              <div key={u} className="flex-1 rounded-xl p-2.5 text-center"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div className="text-lg mb-0.5">{e}</div>
                <div className="text-[18px] font-black" style={{ color: c }}>{v}</div>
                <div className="text-[9px] font-bold uppercase tracking-wider mt-0.5"
                  style={{ color: 'rgba(255,255,255,0.4)' }}>{u}</div>
              </div>
            ))}
          </div>
          {/* CTA */}
          {isLocked ? (
            <div className="w-full text-center font-black text-[15px] py-4 rounded-2xl"
              style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.3)' }}>
              🔒 Terminez la leçon précédente
            </div>
          ) : (
            <a href={href} onClick={onClose}
              className="block w-full text-center text-white font-black text-[17px] py-4 rounded-2xl active:scale-95 transition-transform"
              style={{
                background: `linear-gradient(135deg, ${theme.colorA}, ${theme.colorB})`,
                boxShadow: `0 5px 0 ${theme.shadow}`,
              }}>
              {isCompleted ? 'Rejouer →' : 'Commencer →'}
            </a>
          )}
        </div>
      </div>
    </>
  );
}

/* ─────────────────────────────────────────────
   ZELLIGE STAR NODE
───────────────────────────────────────────── */
function ZelligeNode({
  lesson, colorA, status, phraseIndex, mascotEmoji, animDelay, onTap, href,
}: {
  lesson: any; colorA: string;
  status: 'completed' | 'current' | 'locked';
  phraseIndex: number; mascotEmoji: string;
  animDelay: number;
  onTap: (lesson: any, href: string) => void;
  href: string;
}) {
  const [shake, setShake] = useState(false);
  const isCurrent   = status === 'current';
  const isCompleted = status === 'completed';
  const isLocked    = status === 'locked';
  const size        = isCurrent ? 80 : 68;

  const handleClick = () => {
    if (isLocked) { setShake(true); setTimeout(() => setShake(false), 400); return; }
    onTap(lesson, href);
  };

  return (
    <div style={{
      position: 'relative', display: 'inline-flex', flexDirection: 'column', alignItems: 'center',
      animation: `fadeInUp 0.45s ease both ${animDelay}s`,
    }}>
      {/* Mascot + bubble above current node */}
      {isCurrent && (
        <div style={{
          position: 'absolute', bottom: '100%', left: '50%',
          transform: 'translateX(-50%)', paddingBottom: 8, zIndex: 30,
        }}>
          <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <SpeechBubble phrase={MODULE_PHRASES[phraseIndex % MODULE_PHRASES.length]} />
            <div style={{ fontSize: 52, lineHeight: 1, animation: 'mascotFloat 2.5s ease-in-out infinite' }}>
              {mascotEmoji}
            </div>
          </div>
        </div>
      )}

      {/* Zellige star button */}
      <button
        onClick={handleClick}
        className={shake ? 'animate-shake-x' : ''}
        style={{
          width: size, height: size,
          border: 'none', background: 'transparent', padding: 0,
          cursor: isLocked ? 'default' : 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <svg width={size} height={size} viewBox="0 0 110 110" style={
          isCompleted ? { filter: 'drop-shadow(0 5px 0 #2d6e02)' } :
          isCurrent   ? { animation: 'zelligePulse 2s ease-in-out infinite' } :
          { filter: 'drop-shadow(0 5px 0 #111827)', opacity: 0.55 }
        }>
          {isCompleted ? (
            <>
              <polygon points="55,4 68,22 93,14 87,40 107,50 87,62 93,88 68,80 55,96 42,80 17,88 23,62 3,50 23,40 17,14 42,22" fill="#58cc02"/>
              <polygon points="55,18 65,33 83,28 78,44 93,52 78,60 83,74 65,69 55,84 45,69 27,74 32,60 17,52 32,44 27,28 45,33" fill="#46a302"/>
              <circle cx="55" cy="51" r="14" fill="#3a8a02"/>
              <text x="55" y="51" textAnchor="middle" dominantBaseline="central" fontSize="17" fill="#ffffff" fontWeight="900" fontFamily="sans-serif">✓</text>
            </>
          ) : isCurrent ? (
            <>
              <polygon points="55,1 68,22 93,14 87,40 112,51 87,62 93,88 68,80 55,101 42,80 17,88 23,62 -2,51 23,40 17,14 42,22" fill="#ffffff"/>
              <polygon points="55,6 67,25 90,18 84,42 107,52 84,62 90,86 67,79 55,98 43,79 20,86 26,62 3,52 26,42 20,18 43,25" fill="#1b3a6b"/>
              <polygon points="55,18 65,33 83,28 78,44 93,52 78,60 83,74 65,69 55,84 45,69 27,74 32,60 17,52 32,44 27,28 45,33" fill="#e76f51"/>
              <polygon points="55,29 63,40 75,36 71,48 82,52 71,56 75,68 63,64 55,75 47,64 35,68 39,56 28,52 39,48 35,36 47,40" fill="#2a9d8f"/>
              <circle cx="55" cy="52" r="13" fill="#c9941a"/>
              <text x="55" y="52" textAnchor="middle" dominantBaseline="central" fontSize="14" fontFamily="sans-serif">📖</text>
            </>
          ) : (
            <>
              <polygon points="55,4 68,22 93,14 87,40 107,50 87,62 93,88 68,80 55,96 42,80 17,88 23,62 3,50 23,40 17,14 42,22" fill="#374151"/>
              <polygon points="55,18 65,33 83,28 78,44 93,52 78,60 83,74 65,69 55,84 45,69 27,74 32,60 17,52 32,44 27,28 45,33" fill="#4b5563"/>
              <circle cx="55" cy="51" r="14" fill="#1f2937"/>
              <text x="55" y="51" textAnchor="middle" dominantBaseline="central" fontSize="15" fontFamily="sans-serif">🔒</text>
            </>
          )}
        </svg>
      </button>

      {/* Label below current node */}
      {isCurrent && (
        <div style={{
          marginTop: 8,
          background: `${colorA}30`, border: `1.5px solid ${colorA}60`,
          borderRadius: 10, padding: '4px 12px',
          fontSize: 11, fontWeight: 900, color: colorA,
          whiteSpace: 'nowrap', letterSpacing: '0.03em',
        }}>
          {lesson.label ?? lesson.title}
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────
   SERPENTINE CONNECTOR (dark teal dashes)
───────────────────────────────────────────── */
function SerpentineConnector({ fromX, toX }: { fromX: number; toX: number }) {
  const dx = toX - fromX;
  return (
    <svg viewBox="0 0 160 28" width="160" height="28" className="my-[-3px]" style={{ overflow: 'visible' }}>
      <path
        d={`M 80 0 C ${80+dx*0.4} 9, ${80+dx*0.6} 19, ${80+dx} 28`}
        fill="none" stroke="#2a9d8f" strokeWidth="2.5"
        strokeDasharray="4 5" strokeLinecap="round" opacity="0.5"
      />
    </svg>
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
    const t = setTimeout(() => setShow(true), 300);
    return () => clearTimeout(t);
  }, []);

  if (!show) return null;

  return (
    <>
      <div style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)', animation: 'fadeIn 0.25s ease both' }} />
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
      <div style={{ position: 'fixed', inset: 0, zIndex: 102, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px 16px' }}>
        <div style={{
          background: '#1e2d35', borderRadius: 28, padding: '36px 28px',
          width: '100%', maxWidth: 380, textAlign: 'center',
          boxShadow: '0 24px 80px rgba(0,0,0,0.5)',
          border: '1px solid rgba(255,255,255,0.1)',
          animation: 'bounceIn 0.45s cubic-bezier(0.34,1.56,0.64,1) both 0.1s',
        }}>
          <div style={{ width: 100, height: 100, borderRadius: '50%', margin: '0 auto 20px', background: `linear-gradient(135deg, ${colorA}, ${colorB})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 52, boxShadow: `0 6px 0 ${shadow}` }}>🏆</div>
          <p style={{ fontSize: 11, fontWeight: 900, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.2em', margin: '0 0 8px' }}>Unité terminée !</p>
          <h2 style={{ fontSize: 24, fontWeight: 900, color: '#ffffff', margin: '0 0 4px', lineHeight: 1.2 }}>{module?.title}</h2>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', margin: '0 0 24px' }}>{module?.subtitle}</p>
          <div style={{ display: 'flex', gap: 10, marginBottom: 24 }}>
            {[
              { icon: '📖', val: `${completedCount}`, label: 'Leçons' },
              { icon: '⭐', val: `+${xpTotal}`,        label: 'XP total' },
              { icon: '✅', val: '100%',                label: 'Complet' },
            ].map(s => (
              <div key={s.label} style={{ flex: 1, background: 'rgba(255,255,255,0.05)', borderRadius: 14, padding: '12px 6px', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div style={{ fontSize: 20 }}>{s.icon}</div>
                <div style={{ fontSize: 18, fontWeight: 900, color: colorA }}>{s.val}</div>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', fontWeight: 700, textTransform: 'uppercase' }}>{s.label}</div>
              </div>
            ))}
          </div>
          <div style={{ height: 10, background: 'rgba(255,255,255,0.08)', borderRadius: 5, overflow: 'hidden', marginBottom: 24 }}>
            <div style={{ height: '100%', width: '100%', background: `linear-gradient(90deg, ${colorA}, ${colorB})`, borderRadius: 5, animation: 'growWidth 1s ease both 0.3s' }} />
          </div>
          <style>{`@keyframes growWidth { from { width: 0% } to { width: 100% } }`}</style>
          <button onClick={() => router.push('/progress')} style={{ width: '100%', padding: '15px', borderRadius: 16, marginBottom: 10, background: `linear-gradient(135deg, ${colorA}, ${colorB})`, color: 'white', fontWeight: 900, fontSize: 16, border: 'none', cursor: 'pointer', boxShadow: `0 5px 0 ${shadow}` }}>
            Unité suivante →
          </button>
          <button onClick={onClose} style={{ width: '100%', padding: '12px', borderRadius: 16, background: 'transparent', color: 'rgba(255,255,255,0.5)', fontWeight: 700, fontSize: 14, border: '2px solid rgba(255,255,255,0.12)', cursor: 'pointer' }}>
            Rester dans l'unité
          </button>
        </div>
      </div>
    </>
  );
}

/* ─────────────────────────────────────────────
   ZIGZAG
───────────────────────────────────────────── */
const ZIGZAG = [0, 80, 120, 80, 0, -80, -120, -80];

/* ─────────────────────────────────────────────
   PAGE
───────────────────────────────────────────── */
export default function UnitPathPage() {
  const params        = useParams();
  const router        = useRouter();
  const searchParams  = useSearchParams();
  const { mascot }    = useMascot();
  const { progress }  = useUserProgress();
  const mascotEmoji   = mascot ? (MASCOT_EMOJI[mascot.id as keyof typeof MASCOT_EMOJI] ?? '🦉') : '🦉';

  const id = params?.id as string;

  const [module,        setModule]        = useState<any>(null);
  const [loading,       setLoading]       = useState(true);
  const [popup,         setPopup]         = useState<{ lesson: any; href: string; theme: SectionTheme } | null>(null);
  const [showUnitModal, setShowUnitModal] = useState(false);

  useEffect(() => {
    if (searchParams?.get('unitComplete') === 'true') {
      setShowUnitModal(true);
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
  if (!module)  return <div style={{ padding: 32, textAlign: 'center', color: '#8a9baa' }}>Chapitre introuvable</div>;

  const themeIndex = module.level != null
    ? (module.level - 1)
    : Math.abs(id.split('').reduce((acc: number, c: string) => acc + c.charCodeAt(0), 0)) % SECTION_THEMES.length;
  const theme  = SECTION_THEMES[themeIndex % SECTION_THEMES.length];
  const colorA = module.colorA ?? theme.colorA;
  const colorB = module.colorB ?? theme.colorB;
  const shadow = module.shadowColor ?? theme.shadow;
  const lessons = module.lessons ?? [];

  // Compute lesson states — mark first unlocked non-completed as current
  const rawMapped = lessons.map((l: any, i: number) => {
    const doneInCtx = progress.completedLessons.includes(l.id);
    const doneInApi = !!l.completed;
    const completed = doneInCtx || doneInApi;
    const prevDone  = i === 0
      ? true
      : (progress.completedLessons.includes(lessons[i - 1]?.id) || !!lessons[i - 1]?.completed);
    return { ...l, completed, locked: !completed && !prevDone };
  });
  const firstActiveIdx = rawMapped.findIndex((l: any) => !l.completed && !l.locked);
  const lessonsWithState = rawMapped.map((l: any, i: number) =>
    i === firstActiveIdx ? { ...l, current: true } : l
  );

  const completedCount = lessonsWithState.filter((l: any) => l.completed).length;
  const progressPct    = lessons.length > 0
    ? Math.round((completedCount / lessons.length) * 100)
    : 0;

  return (
    <div style={{ background: '#131f24', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingBottom: 120 }}>

      {/* ── STICKY HEADER ── */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 50, width: '100%',
        backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)',
        backgroundColor: 'rgba(19,31,36,0.92)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        <div style={{ maxWidth: 420, margin: '0 auto', padding: '12px 16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
            <button
              onClick={() => router.push('/progress')}
              style={{
                width: 32, height: 32, borderRadius: '50%', border: 'none',
                background: 'rgba(255,255,255,0.08)', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
                <path d="M15 19l-7-7 7-7" stroke="rgba(255,255,255,0.7)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 900, color: '#ffffff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{module.title}</div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>{module.subtitle}</div>
            </div>
          </div>
          {/* Progress bar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ flex: 1, height: 8, background: 'rgba(255,255,255,0.08)', borderRadius: 4, overflow: 'hidden' }}>
              <div style={{
                height: '100%', borderRadius: 4, transition: 'width 0.7s ease',
                width: `${progressPct}%`,
                background: `linear-gradient(90deg, ${colorA}, ${colorB})`,
              }}/>
            </div>
            <span style={{ fontSize: 10, fontWeight: 900, flexShrink: 0, color: colorA }}>
              {completedCount}/{lessons.length}
            </span>
          </div>
        </div>
      </div>

      {/* ── MODULE BANNER ── */}
      <div style={{ width: '100%', maxWidth: 420, padding: '16px 16px 0' }}>
        <div style={{
          width: '100%', borderRadius: 20,
          background: `linear-gradient(135deg, ${colorA}, ${colorB})`,
          boxShadow: `0 5px 0 ${shadow}, 0 10px 24px ${colorA}40`,
          padding: '14px 18px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ fontSize: 44, lineHeight: 1, filter: 'drop-shadow(2px 4px 6px rgba(0,0,0,0.2))' }}>
              {theme.animal}
            </div>
            <div>
              <div style={{ fontSize: 10, fontWeight: 900, color: 'rgba(255,255,255,0.65)', letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: 3 }}>
                {theme.name} · {lessons.length} UNITÉS
              </div>
              <div style={{ fontSize: 18, fontWeight: 900, color: 'white', lineHeight: 1.2 }}>{module.title}</div>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.7)', marginTop: 2 }}>{module.subtitle}</div>
            </div>
          </div>
          <button style={{
            background: 'rgba(255,255,255,0.2)', border: '2px solid rgba(255,255,255,0.35)',
            borderRadius: 12, padding: '8px 14px',
            color: 'white', fontSize: 11, fontWeight: 900, letterSpacing: '0.08em',
            textTransform: 'uppercase', cursor: 'pointer', backdropFilter: 'blur(4px)',
          }}>
            GUIDE
          </button>
        </div>
        {/* Arrow tip */}
        <div style={{
          margin: '0 auto', width: 0, height: 0,
          borderLeft: '14px solid transparent', borderRight: '14px solid transparent',
          borderTop: `9px solid ${shadow}`,
        }}/>
      </div>

      {/* ── PROGRESS SUMMARY PILL ── */}
      <div style={{ width: '100%', maxWidth: 420, padding: '8px 16px 0', display: 'flex', justifyContent: 'center' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 10,
          background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 20, padding: '8px 20px',
        }}>
          <div style={{ width: 100, height: 6, background: 'rgba(255,255,255,0.08)', borderRadius: 3, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${progressPct}%`, background: `linear-gradient(90deg, ${colorA}, ${colorB})`, borderRadius: 3, transition: 'width 0.7s' }}/>
          </div>
          <span style={{ fontSize: 12, fontWeight: 900, color: progressPct > 0 ? colorA : 'rgba(255,255,255,0.3)' }}>
            {completedCount}/{lessons.length} leçons
          </span>
          {progressPct === 100 && <span style={{ fontSize: 16 }}>🏆</span>}
        </div>
      </div>

      {/* ── ZIGZAG NODES ── */}
      <div style={{ width: '100%', maxWidth: 420, display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 60 }}>
        {lessonsWithState.map((lesson: any, i: number) => {
          const xOffset = ZIGZAG[i % ZIGZAG.length];
          const nextOff = ZIGZAG[(i + 1) % ZIGZAG.length];
          const isLast  = i === lessons.length - 1;
          const status: 'completed' | 'current' | 'locked' =
            lesson.completed ? 'completed' :
            lesson.current   ? 'current' :
            'locked';

          return (
            <React.Fragment key={lesson.id ?? i}>
              <div id={`lesson-node-${lesson.id}`} style={{ transform: `translateX(${xOffset}px)` }}>
                <ZelligeNode
                  lesson={lesson}
                  colorA={colorA}
                  status={status}
                  phraseIndex={i}
                  mascotEmoji={mascotEmoji}
                  animDelay={i * 0.07}
                  href={getLessonHref(lesson)}
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
          <div style={{
            marginTop: 40, width: 'calc(100% - 32px)', borderRadius: 20,
            padding: 20, textAlign: 'center',
            background: 'linear-gradient(160deg, #1e2d35, #263744)',
            border: '1px solid rgba(255,255,255,0.06)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
          }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>🎉</div>
            <div style={{ fontSize: 15, fontWeight: 900, color: '#ffffff' }}>Fin du chapitre</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>
              Terminez toutes les unités pour débloquer le suivant
            </div>
            <button onClick={() => router.push('/progress')} style={{
              marginTop: 16, padding: '10px 20px', borderRadius: 12,
              background: 'rgba(255,255,255,0.08)', border: '2px solid rgba(255,255,255,0.12)',
              color: 'rgba(255,255,255,0.7)', fontSize: 12, fontWeight: 900,
              letterSpacing: '0.06em', textTransform: 'uppercase', cursor: 'pointer',
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

      {/* Bottom fade */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, width: '100%', height: 100,
        pointerEvents: 'none', zIndex: 40,
        background: 'linear-gradient(to top, #131f24 0%, transparent 100%)',
      }}/>
    </div>
  );
}
