'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getModules } from '@/lib/api';
import { useUserProgress } from '@/contexts/UserProgressContext';
import { useMascot, type MascotId } from '@/contexts/MascotContext';
import { useUser, type LangTrack } from '@/context/UserContext';

/* ─── Theme ──────────────────────────────────────────────────────────────── */
const BG       = '#131f24';
const CARD     = '#1e2d35';
const CARD2    = '#243b4a';
const BORDER   = '#2a3d47';
const TEXT     = '#e8eaed';
const SUB      = '#6b7f8a';
const BLUE     = '#1cb0f6';
const BLUE_D   = '#1899d6';
const GREEN    = '#58cc02';
const GREEN_D  = '#46a302';
const GOLD     = '#ffc800';

/* ─── Mascot emoji fallback ──────────────────────────────────────────────── */
const MASCOT_EMOJI: Record<MascotId, string> = {
  lion: '🦁', girl: '👧', boy: '👦', bird: '🦉',
};

/* ─── Types ──────────────────────────────────────────────────────────────── */
interface LessonData { id: string; title: string; order?: number; }
interface ModuleData {
  id: string; slug?: string; title: string; subtitle?: string; level?: number;
  colorA?: string; lessons: LessonData[];
  track?: 'DARIJA' | 'MSA' | 'RELIGION';
  canonicalOrder?: number;
}

function filterByTrack(mods: ModuleData[], track: LangTrack): ModuleData[] {
  const filtered =
    track === 'BOTH' ? mods :
    mods.filter(m => m.track === track);
  return sortModules(filtered);
}

// Ordre pédagogique stable — alphabet d'abord, puis bases, vocabulaire, avancé.
const SLUG_PRIORITY: { match: (slug: string) => boolean; order: number }[] = [
  { match: s => s.endsWith('alphabet') || s.includes('-alphabet'),    order: 10 },
  { match: s => s.includes('pdf-niveau-1'),                           order: 15 },
  { match: s => s.includes('salutations'),                            order: 20 },
  { match: s => s.includes('presenter') || s.includes('se-presenter'),order: 25 },
  { match: s => s.includes('chiffres'),                               order: 30 },
  { match: s => s.includes('couleurs'),                               order: 35 },
  { match: s => s.includes('famille'),                                order: 40 },
  { match: s => s.includes('maison') || s.includes('objets'),         order: 45 },
  { match: s => s.includes('nourriture'),                             order: 50 },
  { match: s => s.includes('animaux'),                                order: 55 },
  { match: s => s.includes('corps') || s.includes('sante'),           order: 60 },
  { match: s => s.includes('vetements'),                              order: 65 },
  { match: s => s.includes('marche') || s.includes('achats'),         order: 70 },
  { match: s => s.includes('transports'),                             order: 75 },
  { match: s => s.includes('metiers') || s.includes('travail'),       order: 80 },
  { match: s => s.includes('emotions'),                               order: 85 },
  { match: s => s.includes('jours') || s.includes('temps'),           order: 90 },
  { match: s => s.includes('directions'),                             order: 95 },
  { match: s => s.includes('pdf-niveau-2'),                           order: 110 },
  { match: s => s.includes('pdf-niveau-3'),                           order: 120 },
  { match: s => s.includes('pdf-niveau-4'),                           order: 130 },
  { match: s => s.includes('expressions'),                            order: 200 },
  { match: s => s.includes('avance'),                                 order: 210 },
];

function priorityOf(slug: string): number {
  for (const rule of SLUG_PRIORITY) if (rule.match(slug)) return rule.order;
  return 999;
}

function sortModules(mods: ModuleData[]): ModuleData[] {
  return [...mods].sort((a, b) => {
    // 1. canonicalOrder from server (preferred) — aligns Darija ↔ MSA 1:1
    const ca = a.canonicalOrder ?? 999;
    const cb = b.canonicalOrder ?? 999;
    if (ca !== cb) return ca - cb;
    // 2. legacy fallback
    const la = a.level ?? 1, lb = b.level ?? 1;
    if (la !== lb) return la - lb;
    const pa = priorityOf((a.slug ?? '').toLowerCase());
    const pb = priorityOf((b.slug ?? '').toLowerCase());
    if (pa !== pb) return pa - pb;
    return (a.slug ?? '').localeCompare(b.slug ?? '');
  });
}

/* ─── Level info ─────────────────────────────────────────────────────────── */
const LEVEL_LABELS: Record<number, { label: string; color: string; icon: string }> = {
  1: { label: 'Débutant',      color: GREEN,    icon: '🌱' },
  2: { label: 'Élémentaire',   color: BLUE,     icon: '📚' },
  3: { label: 'Intermédiaire', color: '#f59e0b', icon: '🔥' },
  4: { label: 'Avancé',        color: '#a78bfa', icon: '🏆' },
};

/* ─── Module icons ───────────────────────────────────────────────────────── */
const MODULE_ICONS: Record<string, string> = {
  'alphabet':    '🔤', 'salutations':  '👋', 'presentation': '🗣️',
  'chiffres':    '🔢', 'couleurs':     '🎨', 'famille':      '👨‍👩‍👧‍👦',
  'nourriture':  '🍽️', 'directions':   '🧭', 'temps':        '🕐',
  'achats':      '🛒', 'transports':   '🚕', 'sante':        '🏥',
  'travail':     '💼', 'expressions':  '💬', 'avance':       '🎓',
  'objets':      '📦', 'animaux':      '🐱', 'metiers':      '👨‍🍳',
};

function getModuleIcon(mod: ModuleData): string {
  const slug = (mod.slug ?? mod.title).toLowerCase();
  for (const [key, icon] of Object.entries(MODULE_ICONS)) {
    if (slug.includes(key)) return icon;
  }
  return '📖';
}

/* ─── Fallback data ──────────────────────────────────────────────────────── */
const MOCK_MODULES: ModuleData[] = [
  { id: 'm1',  title: "L'Alphabet Arabe",   subtitle: 'Les 28 lettres',           level: 1, colorA: '#2a9d8f', lessons: [{id:'l1',title:'Voyelles'},{id:'l2',title:'Consonnes I'},{id:'l3',title:'Consonnes II'},{id:'l4',title:'Lettres spéciales'},{id:'l5',title:'Pratique'}] },
  { id: 'm2',  title: 'Les Salutations',     subtitle: 'Premiers mots',            level: 1, colorA: '#e76f51', lessons: [{id:'l6',title:'Bonjour'},{id:'l7',title:'Au revoir'},{id:'l8',title:'Comment ça va ?'},{id:'l9',title:'Révision'}] },
  { id: 'm3',  title: 'Se Présenter',        subtitle: 'Parler de soi',            level: 1, colorA: '#e9a84c', lessons: [{id:'l10',title:'Mon prénom'},{id:'l11',title:'Mon pays'},{id:'l12',title:'Ma famille'}] },
  { id: 'm4',  title: 'Les Chiffres',        subtitle: 'Compter en Darija',        level: 1, colorA: '#c9941a', lessons: [{id:'l13',title:'1 à 10'},{id:'l14',title:'11 à 100'},{id:'l15',title:'Les grands nombres'}] },
  { id: 'm5',  title: 'Les Couleurs',        subtitle: 'Arc-en-ciel en Darija',    level: 1, colorA: '#6a994e', lessons: [{id:'l16',title:'Couleurs de base'},{id:'l17',title:'Nuances'},{id:'l18',title:'Dans la nature'}] },
  { id: 'm6',  title: 'La Famille',          subtitle: 'Liens et relations',       level: 2, colorA: '#457b9d', lessons: [{id:'l19',title:'Parents'},{id:'l20',title:'Frères et sœurs'},{id:'l21',title:'La maison'}] },
  { id: 'm7',  title: 'La Nourriture',       subtitle: 'Manger et boire',          level: 2, colorA: '#e63946', lessons: [{id:'l22',title:'Les plats'},{id:'l23',title:'Les boissons'},{id:'l24',title:'Au restaurant'}] },
  { id: 'm8',  title: 'Les Directions',      subtitle: 'Se repérer en ville',      level: 2, colorA: '#7b2d8b', lessons: [{id:'l25',title:'Gauche / Droite'},{id:'l26',title:'Loin / Près'},{id:'l27',title:'En ville'}] },
  { id: 'm9',  title: 'Le Temps',            subtitle: 'Heures, jours, mois',      level: 2, colorA: '#264653', lessons: [{id:'l28',title:'Les heures'},{id:'l29',title:'Les jours'},{id:'l30',title:'Les saisons'}] },
  { id: 'm10', title: 'Les Achats',          subtitle: 'Au souk',                  level: 3, colorA: '#f4845f', lessons: [{id:'l31',title:'Les prix'},{id:'l32',title:'Négocier'}] },
  { id: 'm11', title: 'Les Transports',      subtitle: 'Voyager au Maroc',         level: 3, colorA: '#4a6fa5', lessons: [{id:'l33',title:'Taxi et bus'},{id:'l34',title:'Gare et aéroport'}] },
  { id: 'm12', title: 'La Santé',            subtitle: 'Chez le médecin',          level: 3, colorA: '#e07a8e', lessons: [{id:'l35',title:'Le corps'},{id:'l36',title:'Les maladies'}] },
  { id: 'm13', title: 'Le Travail',          subtitle: 'Vie professionnelle',      level: 3, colorA: '#2d6a4f', lessons: [{id:'l37',title:'Les métiers'},{id:'l38',title:'Au bureau'}] },
  { id: 'm14', title: 'Expressions',         subtitle: 'Parler comme un Marocain', level: 4, colorA: '#1b3a6b', lessons: [{id:'l39',title:'Idiomes I'},{id:'l40',title:'Idiomes II'},{id:'l41',title:'Argot'}] },
  { id: 'm15', title: 'Darija Avancé',       subtitle: 'Fluidité et nuances',      level: 4, colorA: '#4a4e69', lessons: [{id:'l42',title:'Dialogue complexe'},{id:'l43',title:'Éloquence'},{id:'l44',title:'Certification'}] },
];

/* ─── Lesson Node (circle on the path) ───────────────────────────────────── */

function LessonNode({ lesson, status, offsetX, onClick }: {
  lesson: LessonData;
  status: 'completed' | 'active' | 'locked';
  offsetX: number;
  onClick: () => void;
}) {
  const isCompleted = status === 'completed';
  const isActive    = status === 'active';
  const isLocked    = status === 'locked';

  const size   = isActive ? 64 : 56;
  const bg     = isCompleted ? GREEN : isActive ? BLUE : BORDER;
  const shadow = isCompleted ? GREEN_D : isActive ? BLUE_D : '#1a2830';

  return (
    <div className="flex flex-col items-center" style={{ transform: `translateX(${offsetX}px)` }}>
      <button
        onClick={isLocked ? undefined : onClick}
        className="relative rounded-full flex items-center justify-center transition-all duration-200"
        style={{
          width: size, height: size,
          background: bg,
          boxShadow: `0 ${isActive ? 6 : 4}px 0 ${shadow}`,
          cursor: isLocked ? 'default' : 'pointer',
          opacity: isLocked ? 0.45 : 1,
          border: isActive ? '3px solid rgba(255,255,255,0.25)' : 'none',
        }}
      >
        {isCompleted ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        ) : isLocked ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
        ) : (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
            <path d="M8 5.14v14l11-7-11-7z"/>
          </svg>
        )}

        {/* Active glow ring */}
        {isActive && (
          <div className="absolute inset-[-6px] rounded-full animate-pulse"
            style={{ border: `3px solid ${BLUE}40` }} />
        )}
      </button>

      {/* Lesson title below (only for active) */}
      {isActive && (
        <div className="mt-2 px-3 py-1.5 rounded-xl text-center max-w-[140px]"
          style={{ background: BLUE, boxShadow: `0 3px 0 ${BLUE_D}` }}>
          <span className="text-[11px] font-black text-white uppercase tracking-wider">Commencer</span>
        </div>
      )}
    </div>
  );
}

/* ─── Section Header ─────────────────────────────────────────────────────── */

function SectionHeader({ mod, modIdx, isActive, icon, completedCount, totalCount, accent }: {
  mod: ModuleData; modIdx: number; isActive: boolean; icon: string;
  completedCount: number; totalCount: number; accent: string;
}) {
  const pct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const isDone = completedCount === totalCount && totalCount > 0;

  return (
    <div className="w-full rounded-2xl p-4 mb-2" style={{
      background: `linear-gradient(135deg, ${accent}22, ${accent}08)`,
      border: `2px solid ${accent}33`,
    }}>
      <div className="flex items-center gap-3">
        <div className="text-[36px] flex-shrink-0">{icon}</div>
        <div className="flex-1 min-w-0">
          <div className="text-[11px] font-black uppercase tracking-widest" style={{ color: accent }}>
            Section {modIdx + 1}
          </div>
          <div className="text-[16px] font-black truncate" style={{ color: TEXT }}>
            {mod.title}
          </div>
          {mod.subtitle && (
            <div className="text-[12px] font-medium" style={{ color: SUB }}>
              {mod.subtitle}
            </div>
          )}
        </div>
        {/* Mini progress ring */}
        <div className="flex-shrink-0 relative w-12 h-12">
          <svg viewBox="0 0 36 36" className="w-12 h-12 -rotate-90">
            <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none" stroke={BORDER} strokeWidth="3" />
            <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none" stroke={isDone ? GREEN : accent} strokeWidth="3"
              strokeDasharray={`${pct}, 100`} strokeLinecap="round" />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-[11px] font-black" style={{ color: isDone ? GREEN : accent }}>
              {isDone ? '✓' : `${pct}%`}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Zigzag path offsets ────────────────────────────────────────────────── */

function getZigzagOffset(index: number, total: number): number {
  // Creates a sine-wave-like path: lessons zigzag left to right
  const amplitude = 50;
  const t = total > 1 ? index / (total - 1) : 0;
  return Math.sin(t * Math.PI * 2) * amplitude;
}

/* ─── Page ────────────────────────────────────────────────────────────────── */

export default function CoursPage() {
  const router          = useRouter();
  const { progress }    = useUserProgress();
  const { mascot }      = useMascot();
  const { langTrack, setLangTrack } = useUser();
  const [allModules, setAllModules] = useState<ModuleData[]>([]);
  const [loading, setLoading]       = useState(true);

  const modules = filterByTrack(allModules, langTrack);
  const mascotId: MascotId = mascot?.id ?? 'lion';

  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let cancel = false;
    async function load(attempt = 0) {
      try {
        // /modules returns modules with lessons embedded — pas besoin d'un 2e appel par module
        const mods = await getModules() as ModuleData[];
        if (!Array.isArray(mods) || mods.length === 0) throw new Error('empty');
        if (cancel) return;
        setAllModules(mods.map(m => ({ ...m, lessons: Array.isArray(m.lessons) ? m.lessons : [] })));
        setLoadError(null);
      } catch (err) {
        if (cancel) return;
        if (attempt < 1) {
          setTimeout(() => load(attempt + 1), 400);
          return;
        }
        setAllModules(prev => prev.length > 0 ? prev : MOCK_MODULES);
        setLoadError('Impossible de charger les cours depuis le serveur.');
      }
      setLoading(false);
    }
    load();
    return () => { cancel = true; };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const completedSet = new Set(progress.completedLessons.map(String));

  // Flatten all lessons across modules for global lock/unlock logic
  const allLessons: { lesson: LessonData; modIdx: number; mod: ModuleData }[] = [];
  modules.forEach((mod, modIdx) => {
    mod.lessons.forEach(lesson => {
      allLessons.push({ lesson, modIdx, mod });
    });
  });

  // Determine which lessons are completed, active, locked.
  // Unlock: first lesson of every module + any lesson whose previous (same module) is completed.
  const getLessonStatus = (globalIdx: number): 'completed' | 'active' | 'locked' => {
    const entry = allLessons[globalIdx];
    const { lesson, mod } = entry;
    if (completedSet.has(lesson.id)) return 'completed';
    const isFirstOfModule = mod.lessons[0]?.id === lesson.id;
    if (isFirstOfModule) return 'active';
    const prev = allLessons[globalIdx - 1];
    if (prev && prev.mod.id === mod.id && completedSet.has(prev.lesson.id)) return 'active';
    return 'locked';
  };

  const completedInModule = (m: ModuleData) =>
    m.lessons.filter(l => completedSet.has(l.id)).length;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: BG }}>
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full border-4 border-t-transparent animate-spin" style={{ borderColor: `${BLUE} transparent ${BLUE} ${BLUE}` }} />
          <span className="text-[13px] font-bold" style={{ color: SUB }}>Chargement…</span>
        </div>
      </div>
    );
  }

  // Build global lesson index
  let globalLessonIdx = 0;

  return (
    <div className="w-full pb-24" style={{ color: TEXT, background: BG }}>

      {/* ── Header with track selector ── */}
      <div className="sticky top-0 z-40 px-4 py-3 backdrop-blur-md" style={{ background: `${BG}ee` }}>
        <div className="max-w-lg mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-[20px]">{MASCOT_EMOJI[mascotId]}</span>
            <div>
              <div className="text-[16px] font-black" style={{ color: TEXT }}>Mes cours</div>
              <div className="text-[11px] font-bold" style={{ color: SUB }}>
                {modules.length} section{modules.length > 1 ? 's' : ''}
              </div>
            </div>
          </div>

          {/* Track toggle */}
          <div className="flex gap-1 rounded-xl p-1" style={{ background: CARD2 }}>
            {([
              { id: 'DARIJA' as LangTrack,   label: '🇲🇦', title: 'Darija' },
              { id: 'MSA' as LangTrack,      label: '📖', title: 'MSA' },
              { id: 'RELIGION' as LangTrack, label: '🕌', title: 'Religion' },
            ]).map(({ id, label, title }) => (
              <button key={id} onClick={() => setLangTrack(id)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-[11px] font-black transition-all"
                style={{
                  background: langTrack === id ? BLUE : 'transparent',
                  color:      langTrack === id ? 'white' : SUB,
                  boxShadow:  langTrack === id ? `0 2px 0 ${BLUE_D}` : 'none',
                }}
                title={title}>
                <span>{label}</span>
                <span className="hidden sm:inline">{title}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Path ── */}
      <div className="max-w-lg mx-auto px-4 mt-4">
        {modules.map((mod, modIdx) => {
          const accent = mod.colorA ?? '#2a9d8f';
          const icon   = getModuleIcon(mod);
          const startGlobalIdx = globalLessonIdx;

          const lessonNodes = mod.lessons.map((lesson, lessonIdx) => {
            const gIdx   = globalLessonIdx++;
            const status = getLessonStatus(gIdx);
            const offset = getZigzagOffset(lessonIdx, mod.lessons.length);
            return (
              <div key={lesson.id} className="flex flex-col items-center">
                {/* Connector line */}
                {lessonIdx > 0 && (
                  <div className="w-1 h-8 rounded-full mb-1" style={{
                    background: status === 'locked' ? BORDER : `${accent}66`,
                  }} />
                )}
                <LessonNode
                  lesson={lesson}
                  status={status}
                  offsetX={offset}
                  onClick={() => router.push(`/lesson/${lesson.id}`)}
                />
              </div>
            );
          });

          return (
            <div key={mod.id} className="mb-8">
              <SectionHeader
                mod={mod}
                modIdx={modIdx}
                isActive={modIdx === 0 || completedInModule(modules[modIdx - 1]) === modules[modIdx - 1]?.lessons.length}
                icon={icon}
                completedCount={completedInModule(mod)}
                totalCount={mod.lessons.length}
                accent={accent}
              />
              <div className="flex flex-col items-center py-4">
                {lessonNodes}
              </div>
            </div>
          );
        })}

        {/* End of path */}
        <div className="flex flex-col items-center py-8 gap-3">
          <div className="text-[48px]">🏁</div>
          <div className="text-[14px] font-black" style={{ color: SUB }}>Fin du parcours</div>
          <div className="text-[12px] font-medium text-center max-w-[240px]" style={{ color: SUB }}>
            De nouvelles leçons arrivent bientôt !
          </div>
        </div>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
