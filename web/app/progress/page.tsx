'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getModules, getLessonsByModule } from '@/lib/api';
import { useUserProgress } from '@/contexts/UserProgressContext';
import { useMascot, MASCOT_EMOJI } from '@/contexts/MascotContext';

/* ── Types ──────────────────────────────────────────────── */
interface ModuleData {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  level?: number;
  colorA?: string;
  colorB?: string;
  shadowColor?: string;
  lessons: LessonData[];
}

interface LessonData {
  id: string;
  title: string;
  order?: number;
}

/* ── Design constants ───────────────────────────────────── */
const MODULE_COLORS = [
  { colorA: '#2a9d8f', colorB: '#1e7a6d', shadow: '#155e54' },
  { colorA: '#e76f51', colorB: '#c05540', shadow: '#9a3020' },
  { colorA: '#e9a84c', colorB: '#d4842a', shadow: '#b06818' },
  { colorA: '#c9941a', colorB: '#a07830', shadow: '#7a5818' },
  { colorA: '#6a994e', colorB: '#4a7230', shadow: '#3a5820' },
  { colorA: '#457b9d', colorB: '#2c5f7e', shadow: '#1a4560' },
  { colorA: '#e63946', colorB: '#c01c28', shadow: '#8a0f18' },
  { colorA: '#7b2d8b', colorB: '#5a1e68', shadow: '#3a1045' },
  { colorA: '#264653', colorB: '#1a3040', shadow: '#0d1e28' },
  { colorA: '#f4845f', colorB: '#d4643f', shadow: '#a44020' },
];

// Zigzag X positions as % of container width (S-curve)
const ZIGZAG_X = [50, 68, 78, 68, 50, 32, 22, 32];

const LEVEL_LABELS: Record<number, string> = {
  1: 'Débutant',
  2: 'Élémentaire',
  3: 'Intermédiaire',
  4: 'Avancé',
};

// Mock modules with lessons for fallback
const MOCK_MODULES: ModuleData[] = [
  { id: 'm1', title: "L'Alphabet Arabe",      subtitle: 'Les 28 lettres',          level: 1, colorA: '#2a9d8f', colorB: '#1e7a6d', shadowColor: '#155e54', lessons: [{id:'l1',title:'Voyelles'},{id:'l2',title:'Consonnes I'},{id:'l3',title:'Consonnes II'},{id:'l4',title:'Lettres spéciales'},{id:'l5',title:'Pratique'}] },
  { id: 'm2', title: 'Les Salutations',        subtitle: 'Premiers mots',           level: 1, colorA: '#e76f51', colorB: '#c05540', shadowColor: '#9a3020', lessons: [{id:'l6',title:'Bonjour'},{id:'l7',title:'Au revoir'},{id:'l8',title:'Comment ça va ?'},{id:'l9',title:'Révision'}] },
  { id: 'm3', title: 'Se Présenter',           subtitle: 'Parler de soi',           level: 1, colorA: '#e9a84c', colorB: '#d4842a', shadowColor: '#b06818', lessons: [{id:'l10',title:'Mon prénom'},{id:'l11',title:'Mon pays'},{id:'l12',title:'Ma famille'}] },
  { id: 'm4', title: 'Les Chiffres',           subtitle: 'Compter en Darija',       level: 1, colorA: '#c9941a', colorB: '#a07830', shadowColor: '#7a5818', lessons: [{id:'l13',title:'1 à 10'},{id:'l14',title:'11 à 100'},{id:'l15',title:'Les grands nombres'}] },
  { id: 'm5', title: 'Les Couleurs',           subtitle: 'Arc-en-ciel en Darija',   level: 1, colorA: '#6a994e', colorB: '#4a7230', shadowColor: '#3a5820', lessons: [{id:'l16',title:'Couleurs de base'},{id:'l17',title:'Nuances'},{id:'l18',title:'Dans la nature'}] },
  { id: 'm6', title: 'La Famille',             subtitle: 'Liens et relations',      level: 2, colorA: '#457b9d', colorB: '#2c5f7e', shadowColor: '#1a4560', lessons: [{id:'l19',title:'Parents'},{id:'l20',title:'Frères et sœurs'},{id:'l21',title:'La maison'}] },
  { id: 'm7', title: 'La Nourriture',          subtitle: 'Manger et boire',         level: 2, colorA: '#e63946', colorB: '#c01c28', shadowColor: '#8a0f18', lessons: [{id:'l22',title:'Les plats'},{id:'l23',title:'Les boissons'},{id:'l24',title:'Au restaurant'}] },
  { id: 'm8', title: 'Les Directions',         subtitle: 'Se repérer en ville',     level: 2, colorA: '#7b2d8b', colorB: '#5a1e68', shadowColor: '#3a1045', lessons: [{id:'l25',title:'Gauche / Droite'},{id:'l26',title:'Loin / Près'},{id:'l27',title:'En ville'}] },
  { id: 'm9', title: 'Le Temps',               subtitle: 'Heures, jours, mois',    level: 2, colorA: '#264653', colorB: '#1a3040', shadowColor: '#0d1e28', lessons: [{id:'l28',title:'Les heures'},{id:'l29',title:'Les jours'},{id:'l30',title:'Les saisons'}] },
  { id: 'm10', title: 'Les Achats',            subtitle: 'Au souk',                 level: 3, colorA: '#f4845f', colorB: '#d4643f', shadowColor: '#a44020', lessons: [{id:'l31',title:'Les prix'},{id:'l32',title:'Négocier'}] },
  { id: 'm11', title: 'Les Transports',        subtitle: 'Voyager au Maroc',        level: 3, colorA: '#4a6fa5', colorB: '#2a4f85', shadowColor: '#1a3060', lessons: [{id:'l33',title:'Taxi et bus'},{id:'l34',title:'Gare et aéroport'}] },
  { id: 'm12', title: 'La Santé',              subtitle: 'Chez le médecin',         level: 3, colorA: '#e07a8e', colorB: '#c05a6e', shadowColor: '#9a3a4e', lessons: [{id:'l35',title:'Le corps'},{id:'l36',title:'Les maladies'}] },
  { id: 'm13', title: 'Le Travail',            subtitle: 'Vie professionnelle',     level: 3, colorA: '#2d6a4f', colorB: '#1a4a30', shadowColor: '#0d2e1a', lessons: [{id:'l37',title:'Les métiers'},{id:'l38',title:'Au bureau'}] },
  { id: 'm14', title: 'Expressions',           subtitle: 'Parler comme un Marocain',level: 4, colorA: '#1b3a6b', colorB: '#0f2550', shadowColor: '#071530', lessons: [{id:'l39',title:'Idiomes I'},{id:'l40',title:'Idiomes II'},{id:'l41',title:'Argot'}] },
  { id: 'm15', title: 'Darija Avancé',         subtitle: 'Fluidité et nuances',     level: 4, colorA: '#4a4e69', colorB: '#2c2f45', shadowColor: '#1a1c30', lessons: [{id:'l42',title:'Dialogue complexe'},{id:'l43',title:'Éloquence'},{id:'l44',title:'Certification'}] },
];

/* ── Helper: speech bubble content per module ── */
const MODULE_PHRASES = [
  { ar: 'الف با تا', fr: 'Alef, ba, ta…' },
  { ar: 'سلام عليكم', fr: 'Salam ! Bonjour !' },
  { ar: 'اسمي…', fr: 'Mon prénom est…' },
  { ar: 'واحد جوج تلاتة', fr: '1, 2, 3…' },
  { ar: 'حمر، خضر، زرق', fr: 'Rouge, vert, bleu' },
  { ar: 'عائلتي كبيرة', fr: 'Ma famille est grande' },
  { ar: 'بغيت كوسكوس', fr: 'Je veux du couscous !' },
  { ar: 'فين كتمشي؟', fr: 'Où vas-tu ?' },
  { ar: 'شحال الساعة؟', fr: 'Quelle heure est-il ?' },
  { ar: 'بشحال هاد؟', fr: 'Combien ça coûte ?' },
  { ar: 'عطيني تاكسي', fr: 'Appelle-moi un taxi' },
  { ar: 'راسي كايدير', fr: "J'ai mal à la tête" },
  { ar: 'أنا كنخدم', fr: 'Je travaille' },
  { ar: 'ماشي مشكيل!', fr: 'Pas de problème !' },
  { ar: 'الدارجة سهلة!', fr: "Le Darija c'est facile !" },
];

/* ── Node components ──────────────────────────────────────── */
function SpeechBubble({ phrase }: { phrase: { ar: string; fr: string } }) {
  return (
    <div style={{
      position: 'absolute',
      bottom: '110%',
      left: '50%',
      transform: 'translateX(-50%)',
      background: '#243b4a',
      borderRadius: 14,
      padding: '8px 14px',
      whiteSpace: 'nowrap',
      boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
      border: '1.5px solid rgba(255,255,255,0.12)',
      zIndex: 20,
    }}>
      <div style={{ fontSize: 15, fontWeight: 900, color: '#ffffff', fontFamily: 'var(--font-amiri)', direction: 'rtl' }}>
        {phrase.ar}
      </div>
      <div style={{ fontSize: 10, color: '#8b9eb0', fontWeight: 700, marginTop: 1 }}>{phrase.fr}</div>
      {/* Tail */}
      <div style={{
        position: 'absolute', bottom: -8, left: '50%', transform: 'translateX(-50%)',
        width: 0, height: 0,
        borderLeft: '7px solid transparent',
        borderRight: '7px solid transparent',
        borderTop: '8px solid rgba(255,255,255,0.12)',
      }} />
      <div style={{
        position: 'absolute', bottom: -5, left: '50%', transform: 'translateX(-50%)',
        width: 0, height: 0,
        borderLeft: '5px solid transparent',
        borderRight: '5px solid transparent',
        borderTop: '6px solid #243b4a',
        zIndex: 1,
      }} />
    </div>
  );
}

function LevelBanner({ level }: { level: number }) {
  const COLORS: Record<number, { bg: string; border: string; text: string; stars: string }> = {
    1: { bg: 'rgba(88,204,2,0.08)',   border: 'rgba(88,204,2,0.25)',   text: '#58cc02', stars: '⭐' },
    2: { bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.25)', text: '#f59e0b', stars: '⭐⭐' },
    3: { bg: 'rgba(249,115,22,0.08)', border: 'rgba(249,115,22,0.25)', text: '#fb923c', stars: '⭐⭐⭐' },
    4: { bg: 'rgba(167,139,250,0.08)',border: 'rgba(167,139,250,0.25)',text: '#a78bfa', stars: '⭐⭐⭐⭐' },
  };
  const c = COLORS[level] ?? COLORS[1];
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
      padding: '12px 20px', margin: '8px 16px 0',
      background: c.bg, border: `2px solid ${c.border}`,
      borderRadius: 16,
    }}>
      <span style={{ fontSize: 13, fontWeight: 900, color: c.text, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
        Niveau {level} — {LEVEL_LABELS[level]}
      </span>
    </div>
  );
}

function ChapterHeader({ mod, colorA, shadow, chapterNum, unitNum, onClick }: {
  mod: ModuleData; colorA: string; shadow: string;
  chapterNum: number; unitNum: number; onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      style={{
        margin: '0 12px',
        borderRadius: 20,
        background: colorA,
        boxShadow: `0 6px 0 ${shadow}`,
        padding: '18px 22px 20px',
        cursor: 'pointer',
      }}
    >
      <div style={{
        fontSize: 11, fontWeight: 800,
        color: 'rgba(255,255,255,0.75)',
        letterSpacing: '0.09em', textTransform: 'uppercase',
        marginBottom: 8,
      }}>
        ← Chapitre {chapterNum}, Unité {unitNum}
      </div>
      <div style={{ fontSize: 22, fontWeight: 900, color: 'white', lineHeight: 1.2 }}>
        {mod.title}
      </div>
    </div>
  );
}

function LessonNode({ lesson, status, colorA, colorB, shadow, isCurrentModule, phraseIndex, showMascot, mascotEmoji, onPress }: {
  lesson: LessonData;
  status: 'completed' | 'current' | 'locked';
  colorA: string; colorB: string; shadow: string;
  isCurrentModule: boolean;
  phraseIndex: number;
  showMascot: boolean;
  mascotEmoji: string;
  onPress: () => void;
}) {
  const isCurrent   = status === 'current';
  const isCompleted = status === 'completed';
  const isLocked    = status === 'locked';
  const size        = isCurrent ? 80 : 68;

  return (
    <div style={{ position: 'relative', display: 'inline-flex', flexDirection: 'column', alignItems: 'center' }}>
      {/* Mascot above current node */}
      {showMascot && (
        <div style={{ position: 'absolute', bottom: '100%', left: '50%', transform: 'translateX(-50%)', paddingBottom: 8, zIndex: 30 }}>
          <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <SpeechBubble phrase={MODULE_PHRASES[phraseIndex % MODULE_PHRASES.length]} />
            <div style={{ fontSize: 56, lineHeight: 1, animation: 'mascotFloat 2.5s ease-in-out infinite' }}>
              {mascotEmoji}
            </div>
          </div>
        </div>
      )}

      {/* Node button — Zellige star */}
      <button
        onClick={isLocked ? undefined : onPress}
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

      {/* Label below node for current */}
      {isCurrent && (
        <div style={{
          marginTop: 8,
          background: `${colorA}30`,
          border: `1.5px solid ${colorA}60`,
          borderRadius: 10,
          padding: '4px 12px',
          fontSize: 11, fontWeight: 900,
          color: colorA, whiteSpace: 'nowrap',
          letterSpacing: '0.03em',
        }}>
          {lesson.title}
        </div>
      )}
    </div>
  );
}

function TrophyNode({ unlocked }: { unlocked: boolean }) {
  return (
    <button style={{
      width: 60, height: 60, borderRadius: '50%',
      border: 'none', cursor: unlocked ? 'pointer' : 'default',
      background: unlocked
        ? 'linear-gradient(135deg, #f59e0b, #d97706)'
        : '#374151',
      boxShadow: unlocked
        ? '0 5px 0 #b45309, 0 6px 20px rgba(245,158,11,0.4)'
        : '0 4px 0 #1f2937',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 26, flexShrink: 0,
    }}>
      {unlocked ? '🏆' : '🔒'}
    </button>
  );
}

function ChestNode({ unlocked }: { unlocked: boolean }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
      <div style={{ fontSize: 44, lineHeight: 1, filter: unlocked ? 'drop-shadow(0 4px 8px rgba(245,158,11,0.5))' : 'grayscale(1) brightness(0.5)' }}>
        🪙
      </div>
      <div style={{
        fontSize: 10, fontWeight: 900,
        color: unlocked ? '#f59e0b' : '#4b5563',
        letterSpacing: '0.06em', textTransform: 'uppercase',
      }}>
        {unlocked ? 'Récompense !' : 'Verrouillé'}
      </div>
    </div>
  );
}

/* ── Main page ───────────────────────────────────────────── */
export default function ProgressPage() {
  const router = useRouter();
  const { progress } = useUserProgress();
  const { mascot } = useMascot();
  const mascotEmoji = mascot ? (MASCOT_EMOJI[mascot.id] ?? '🦉') : '🦉';
  const [modules, setModules] = useState<ModuleData[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeModuleIdx, setActiveModuleIdx] = useState(0);

  useEffect(() => {
    async function load() {
      try {
        const mods = await getModules() as ModuleData[];
        if (!Array.isArray(mods) || mods.length === 0) throw new Error('empty');

        const withLessons = await Promise.all(
          mods.map(async (m: ModuleData) => {
            try {
              const lessons = await getLessonsByModule(m.id) as LessonData[];
              return { ...m, lessons: Array.isArray(lessons) ? lessons : [] };
            } catch {
              return { ...m, lessons: [] as LessonData[] };
            }
          })
        );
        setModules(withLessons);

        // Positionner sur le module courant (premier avec une leçon non complétée)
        const completedSet = new Set(progress.completedLessons.map(String));
        const isComplete = (mod: ModuleData) =>
          mod.lessons.length > 0 && mod.lessons.every(l => completedSet.has(l.id));
        const currentIdx = withLessons.findIndex((m, i) =>
          (i === 0 || isComplete(withLessons[i - 1])) && !isComplete(m)
        );
        setActiveModuleIdx(currentIdx >= 0 ? currentIdx : withLessons.length - 1);
      } catch {
        setModules(MOCK_MODULES);
      }
      setLoading(false);
    }
    load();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const completedLessons = new Set(progress.completedLessons.map(String));

  const isModuleComplete = (mod: ModuleData) =>
    mod.lessons.length > 0 && mod.lessons.every(l => completedLessons.has(l.id));

  const isModuleUnlocked = (idx: number) =>
    idx === 0 || isModuleComplete(modules[idx - 1]);

  // Leçon courante globale
  let currentLessonId: string | null = null;
  for (const mod of modules) {
    if (!isModuleUnlocked(modules.indexOf(mod))) continue;
    for (const lesson of mod.lessons) {
      if (!completedLessons.has(lesson.id)) { currentLessonId = lesson.id; break; }
    }
    if (currentLessonId) break;
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#131f24', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: '#9ca3af', fontSize: 14, fontWeight: 700 }}>Chargement de la carte…</div>
      </div>
    );
  }

  const mod = modules[activeModuleIdx];
  if (!mod) return null;

  const colors  = MODULE_COLORS[activeModuleIdx % MODULE_COLORS.length];
  const colorA  = mod.colorA ?? colors.colorA;
  const colorB  = mod.colorB ?? colors.colorB;
  const shadow  = mod.shadowColor ?? colors.shadow;
  const unlocked   = isModuleUnlocked(activeModuleIdx);
  const completed  = isModuleComplete(mod);
  const isActiveModule = !completed && unlocked;
  const unitNum = mod.lessons.findIndex(l => !completedLessons.has(l.id)) + 1 || mod.lessons.length;

  return (
    <div style={{ minHeight: '100vh', background: '#131f24', paddingBottom: 100 }}>

      {/* ── Navigation chapitres ── */}
      <div style={{
        maxWidth: 440, margin: '0 auto',
        padding: '16px 16px 0',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
      }}>
        <button
          onClick={() => setActiveModuleIdx(i => Math.max(0, i - 1))}
          disabled={activeModuleIdx === 0}
          style={{
            width: 40, height: 40, borderRadius: '50%', border: 'none',
            background: activeModuleIdx === 0 ? '#1e2d35' : '#2a3d47',
            color: activeModuleIdx === 0 ? '#4a5d6a' : '#ffffff',
            fontSize: 18, cursor: activeModuleIdx === 0 ? 'default' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}
        >‹</button>

        <div style={{ flex: 1, textAlign: 'center' }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: '#6b7f8a', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Chapitre {activeModuleIdx + 1} / {modules.length}
          </div>
          {/* Indicateur de progression */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 4, marginTop: 6 }}>
            {modules.map((m, i) => {
              const done = isModuleComplete(m);
              const active = i === activeModuleIdx;
              return (
                <button
                  key={m.id}
                  onClick={() => setActiveModuleIdx(i)}
                  style={{
                    width: active ? 20 : 6, height: 6,
                    borderRadius: 3, border: 'none',
                    background: done ? '#58cc02' : active ? colorA : '#2a3d47',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    padding: 0,
                  }}
                />
              );
            })}
          </div>
        </div>

        <button
          onClick={() => setActiveModuleIdx(i => Math.min(modules.length - 1, i + 1))}
          disabled={activeModuleIdx === modules.length - 1}
          style={{
            width: 40, height: 40, borderRadius: '50%', border: 'none',
            background: activeModuleIdx === modules.length - 1 ? '#1e2d35' : '#2a3d47',
            color: activeModuleIdx === modules.length - 1 ? '#4a5d6a' : '#ffffff',
            fontSize: 18, cursor: activeModuleIdx === modules.length - 1 ? 'default' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}
        >›</button>
      </div>

      {/* ── Carte du chapitre actif ── */}
      <div style={{ maxWidth: 440, margin: '0 auto', position: 'relative' }}>
        <ChapterHeader
          mod={mod}
          colorA={unlocked ? colorA : '#374151'}
          shadow={unlocked ? shadow : '#111827'}
          chapterNum={activeModuleIdx + 1}
          unitNum={unitNum}
          onClick={() => {
            const firstUnfinished = mod.lessons.find(l => !completedLessons.has(l.id));
            const target = firstUnfinished ?? mod.lessons[0];
            if (unlocked && target?.id) router.push(`/lesson/${target.id}`);
          }}
        />

        <div style={{ padding: '20px 16px 8px', position: 'relative' }}>
          {mod.lessons.map((lesson, lIdx) => {
            const isCompleted = completedLessons.has(lesson.id);
            const isCurrent   = lesson.id === currentLessonId;
            const isLocked    = !unlocked || (!isCompleted && !isCurrent &&
              !mod.lessons.slice(0, lIdx).every(l => completedLessons.has(l.id)));

            const status: 'completed' | 'current' | 'locked' = isCompleted ? 'completed' : isCurrent ? 'current' : 'locked';
            const xPct      = ZIGZAG_X[lIdx % ZIGZAG_X.length];
            const showMascot = isCurrent;

            return (
              <div key={lesson.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <div style={{
                  marginLeft: `${xPct}%`,
                  transform: 'translateX(-50%)',
                  paddingTop: showMascot ? 100 : 0,
                }}>
                  <LessonNode
                    lesson={lesson}
                    status={status}
                    colorA={colorA} colorB={colorB} shadow={shadow}
                    isCurrentModule={isActiveModule}
                    phraseIndex={activeModuleIdx}
                    showMascot={showMascot}
                    mascotEmoji={mascotEmoji}
                    onPress={() => router.push(`/lesson/${lesson.id}`)}
                  />
                </div>
                {lIdx < mod.lessons.length - 1 && (
                  <div style={{
                    marginLeft: `${xPct}%`,
                    transform: 'translateX(-50%)',
                    width: 4, height: 32,
                    background: isCompleted
                      ? `repeating-linear-gradient(to bottom, ${colorA} 0px, ${colorA} 6px, transparent 6px, transparent 12px)`
                      : 'repeating-linear-gradient(to bottom, #4b5563 0px, #4b5563 6px, transparent 6px, transparent 12px)',
                    borderRadius: 2,
                    opacity: isLocked ? 0.4 : 1,
                    marginTop: 4,
                  }} />
                )}
              </div>
            );
          })}

          {/* Trophée en fin de module */}
          {mod.lessons.length > 0 && (() => {
            const lastXPct = ZIGZAG_X[(mod.lessons.length - 1) % ZIGZAG_X.length];
            const trophyXPct = ZIGZAG_X[mod.lessons.length % ZIGZAG_X.length];
            return (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginTop: 4 }}>
                <div style={{
                  marginLeft: `${lastXPct}%`, transform: 'translateX(-50%)',
                  width: 4, height: 28,
                  background: completed
                    ? `repeating-linear-gradient(to bottom, ${colorA} 0px, ${colorA} 6px, transparent 6px, transparent 12px)`
                    : 'repeating-linear-gradient(to bottom, #4b5563 0px, #4b5563 6px, transparent 6px, transparent 12px)',
                  borderRadius: 2,
                }} />
                <div style={{ marginLeft: `${trophyXPct}%`, transform: 'translateX(-50%)', marginTop: 4 }}>
                  <TrophyNode unlocked={completed} />
                </div>
              </div>
            );
          })()}
        </div>

        {/* Message si module complété */}
        {completed && (
          <div style={{ textAlign: 'center', padding: '16px 20px 8px' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'rgba(88,204,2,0.1)', border: '1.5px solid rgba(88,204,2,0.3)',
              borderRadius: 16, padding: '10px 20px',
            }}>
              <span style={{ fontSize: 18 }}>🏆</span>
              <span style={{ fontSize: 13, fontWeight: 800, color: '#58cc02' }}>Chapitre terminé !</span>
            </div>
            {activeModuleIdx < modules.length - 1 && (
              <button
                onClick={() => setActiveModuleIdx(activeModuleIdx + 1)}
                style={{
                  display: 'block', width: '100%', marginTop: 12,
                  padding: '14px', borderRadius: 16, border: 'none',
                  background: '#58cc02', color: 'white',
                  fontSize: 14, fontWeight: 900, cursor: 'pointer',
                  boxShadow: '0 4px 0 #46a302',
                }}
              >
                Chapitre suivant →
              </button>
            )}
          </div>
        )}

        {/* Message si module verrouillé */}
        {!unlocked && (
          <div style={{ textAlign: 'center', padding: '16px 20px 8px' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'rgba(75,85,99,0.2)', border: '1.5px solid #374151',
              borderRadius: 16, padding: '10px 20px',
            }}>
              <span style={{ fontSize: 18 }}>🔒</span>
              <span style={{ fontSize: 13, fontWeight: 800, color: '#6b7280' }}>
                Termine le chapitre précédent pour débloquer
              </span>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes mascotFloat {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-10px); }
        }
      `}</style>
    </div>
  );
}
