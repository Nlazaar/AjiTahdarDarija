'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApi } from '@/hooks/useApi';
import { getModules } from '@/lib/api';
import Loader from '@/components/Loader';
import { useUserProgress } from '@/contexts/UserProgressContext';

/* ─────────────────────────────────────────────
   SECTION THEMES
───────────────────────────────────────────── */
const SECTION_THEMES = [
  { name: 'Désert',    animal: '🐪', colorA: '#e9a84c', colorB: '#d4842a', shadow: '#b06818',
    phrase: 'ا ب ت ث ج', phraseFr: 'Les premières lettres' },
  { name: 'Médina',    animal: '🐈', colorA: '#2a9d8f', colorB: '#1e7a6d', shadow: '#155e54',
    phrase: 'سلام، كيداير؟', phraseFr: 'Saluer en darija' },
  { name: 'Mer',       animal: '🐟', colorA: '#457b9d', colorB: '#2c5f7e', shadow: '#1a4560',
    phrase: 'واحد، جوج، تلاتة', phraseFr: 'Compter en darija' },
  { name: 'Montagne',  animal: '🦅', colorA: '#588157', colorB: '#3a5a40', shadow: '#2a4030',
    phrase: 'أحمر، أزرق، أخضر', phraseFr: 'Les couleurs' },
  { name: 'Forêt',     animal: '🦔', colorA: '#6a994e', colorB: '#4a7230', shadow: '#3a5820',
    phrase: 'بابا، ماما، خويا', phraseFr: 'La famille' },
  { name: 'Ville',     animal: '🐦', colorA: '#4a4e69', colorB: '#2c2f45', shadow: '#1a1c30',
    phrase: 'فين كتمشي؟', phraseFr: 'Demander son chemin' },
  { name: 'Jardin',    animal: '🦋', colorA: '#e76f51', colorB: '#c05540', shadow: '#9a3020',
    phrase: 'شنو هدا؟', phraseFr: 'Nommer les objets' },
  { name: 'Palais',    animal: '🦁', colorA: '#c9941a', colorB: '#a07830', shadow: '#7a5818',
    phrase: 'كلشي مزيان!', phraseFr: 'Tout est bien !' },
] as const;

/* ─────────────────────────────────────────────
   MOCK DATA
───────────────────────────────────────────── */
const MOCK_MODULES = [
  // ── Niveau 1 — Débutant ──
  { id: '1',  title: "L'Alphabet Arabe",         subtitle: 'Les 28 lettres',            colorA: '#2a9d8f', colorB: '#1e7a6d', shadowColor: '#155e54', level: 1, lessons: [{},{},{},{},{}] },
  { id: '2',  title: 'Les Salutations',           subtitle: 'Premiers mots en darija',   colorA: '#e76f51', colorB: '#c05540', shadowColor: '#9a3020', level: 1, lessons: [{},{},{},{}] },
  { id: '3',  title: 'Se Présenter',              subtitle: 'Parler de soi',             colorA: '#e9a84c', colorB: '#d4842a', shadowColor: '#b06818', level: 1, lessons: [{},{},{},{}] },
  { id: '4',  title: 'Les Chiffres',              subtitle: 'Compter en Darija',         colorA: '#c9941a', colorB: '#a07830', shadowColor: '#7a5818', level: 1, lessons: [{},{},{},{}] },
  { id: '5',  title: 'Les Couleurs',              subtitle: 'Arc-en-ciel en Darija',     colorA: '#6a994e', colorB: '#4a7230', shadowColor: '#3a5820', level: 1, lessons: [{},{},{}] },
  // ── Niveau 2 — Élémentaire ──
  { id: '6',  title: 'La Famille',                subtitle: 'Liens et relations',        colorA: '#457b9d', colorB: '#2c5f7e', shadowColor: '#1a4560', level: 2, lessons: [{},{},{}] },
  { id: '7',  title: 'La Nourriture',             subtitle: 'Manger et boire en darija', colorA: '#e63946', colorB: '#c01c28', shadowColor: '#8a0f18', level: 2, lessons: [{},{},{},{}] },
  { id: '8',  title: 'Les Directions',            subtitle: 'Se repérer en ville',       colorA: '#7b2d8b', colorB: '#5a1e68', shadowColor: '#3a1045', level: 2, lessons: [{},{},{},{}] },
  { id: '9',  title: 'Le Temps et les Jours',     subtitle: 'Heures, jours et mois',     colorA: '#264653', colorB: '#1a3040', shadowColor: '#0d1e28', level: 2, lessons: [{},{},{}] },
  // ── Niveau 3 — Intermédiaire ──
  { id: '10', title: 'Les Achats',                subtitle: 'Au souk et en boutique',    colorA: '#f4845f', colorB: '#d4643f', shadowColor: '#a44020', level: 3, lessons: [{},{}] },
  { id: '11', title: 'Les Transports',            subtitle: 'Voyager au Maroc',          colorA: '#4a6fa5', colorB: '#2a4f85', shadowColor: '#1a3060', level: 3, lessons: [{},{}] },
  { id: '12', title: 'Le Logement',               subtitle: 'La maison en darija',       colorA: '#8b5e3c', colorB: '#6b3e1c', shadowColor: '#4a2010', level: 3, lessons: [{},{}] },
  { id: '13', title: 'Le Corps et la Santé',      subtitle: 'Chez le médecin',           colorA: '#e07a8e', colorB: '#c05a6e', shadowColor: '#9a3a4e', level: 3, lessons: [{},{}] },
  { id: '14', title: 'Le Travail',                subtitle: 'Métiers et vie pro',        colorA: '#2d6a4f', colorB: '#1a4a30', shadowColor: '#0d2e1a', level: 3, lessons: [{},{}] },
  // ── Niveau 4 — Avancé ──
  { id: '15', title: 'Expressions Idiomatiques',  subtitle: 'Parler comme un Marocain',  colorA: '#1b3a6b', colorB: '#0f2550', shadowColor: '#071530', level: 4, lessons: [{},{},{}] },
  { id: '16', title: 'Darija Avancé',             subtitle: 'Fluidité et nuances',       colorA: '#4a4e69', colorB: '#2c2f45', shadowColor: '#1a1c30', level: 4, lessons: [{},{},{}] },
];

/* ─────────────────────────────────────────────
   CHAPTER CARD
───────────────────────────────────────────── */
function ChapterCard({
  m, index, isActive, isLocked, completedLessons,
}: {
  m: any; index: number; isActive: boolean; isLocked: boolean; completedLessons: string[];
}) {
  const router = useRouter();
  const theme  = SECTION_THEMES[index % SECTION_THEMES.length];
  const colorA = m.colorA ?? theme.colorA;
  const colorB = m.colorB ?? theme.colorB;
  const shadow = m.shadowColor ?? theme.shadow;
  const lessons = m.lessons ?? [];
  const count   = lessons.length;

  // Nombre de leçons complétées pour ce chapitre
  const doneCount  = lessons.filter((l: any) => l.id && completedLessons.includes(String(l.id))).length;
  const progressPct = count > 0 ? Math.round((doneCount / count) * 100) : 0;

  return (
    <div
      className="w-full rounded-2xl overflow-hidden relative cursor-pointer select-none"
      style={{
        background: 'linear-gradient(160deg, #1e2235 0%, #252b40 100%)',
        boxShadow: isActive
          ? `0 0 0 3px ${colorA}cc, 0 8px 32px rgba(0,0,0,0.3)`
          : `0 0 0 1px ${colorA}33, 0 4px 20px rgba(0,0,0,0.2)`,
        minHeight: '160px',
        animation: `fadeInUp 0.4s ease both ${index * 0.07}s`,
        transition: 'transform 0.15s, box-shadow 0.15s',
      }}
      onClick={() => !isLocked && router.push(`/progress/${m.id}`)}
    >
      {/* Color stripe — always visible, full opacity if active, subtle if locked */}
      <div className="absolute left-0 top-0 bottom-0 w-1.5 rounded-l-2xl"
        style={{
          background: `linear-gradient(180deg, ${colorA}, ${shadow})`,
          opacity: isLocked ? 0.35 : 1,
        }}/>

      {/* Speech bubble + animal — right side */}
      <div className="absolute right-4 top-3 flex flex-col items-center" style={{ maxWidth: 150 }}>
        {/* Bubble */}
        <div className="bg-white rounded-2xl rounded-tr-sm px-3 py-2 shadow-lg relative">
          <p className="text-[14px] font-bold text-gray-800 leading-snug text-right"
            style={{ fontFamily: 'var(--font-amiri)', direction: 'rtl' }}>
            {theme.phrase}
          </p>
          <p className="text-[10px] text-gray-400 mt-0.5 text-left">{theme.phraseFr}</p>
          {/* Tail */}
          <div className="absolute -bottom-[7px] left-5 w-0 h-0"
            style={{
              borderLeft: '7px solid transparent',
              borderRight: '7px solid transparent',
              borderTop: '8px solid white',
            }}/>
        </div>
        {/* Animal */}
        <div className="text-[52px] leading-none mt-1 select-none"
          style={{ filter: 'drop-shadow(2px 4px 8px rgba(0,0,0,0.35))' }}>
          {theme.animal}
        </div>
      </div>

      {/* Left content */}
      <div className="px-5 pt-4 pb-5 pr-44">
        {/* Badge */}
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[9px] font-black tracking-[0.3em] uppercase px-2.5 py-1 rounded-full"
            style={{
              background: isActive ? `${colorA}40` : 'rgba(255,255,255,0.08)',
              color: isActive ? colorA : 'rgba(255,255,255,0.4)',
            }}>
            CHAPITRE {index + 1}
          </span>
          {isLocked && (
            <span className="text-[9px] font-bold text-gray-500">🔒 {count} UNITÉS</span>
          )}
          {!isLocked && !isActive && (
            <span className="text-[9px] font-bold" style={{ color: colorA }}>{count} UNITÉS</span>
          )}
        </div>

        {/* Title */}
        <h2 className="text-[19px] font-black leading-tight"
          style={{ color: isLocked ? 'rgba(255,255,255,0.45)' : 'white' }}>
          {isLocked && <span style={{ color: `${colorA}88` }}>🔒 </span>}{m.title}
        </h2>
        <p className="text-[12px] font-medium mt-1"
          style={{ color: 'rgba(255,255,255,0.4)' }}>
          {m.subtitle ?? theme.name}
        </p>

        {/* Progress bar — only when not locked */}
        {!isLocked && count > 0 && (
          <div className="mt-3 mb-1">
            <div className="flex items-center gap-2">
              <div style={{
                flex: 1, height: 7, background: 'rgba(255,255,255,0.12)',
                borderRadius: 4, overflow: 'hidden',
              }}>
                <div style={{
                  height: '100%',
                  width: `${progressPct}%`,
                  background: progressPct >= 100
                    ? '#fbbf24'
                    : `linear-gradient(90deg, ${colorA}, ${colorB})`,
                  borderRadius: 4,
                  transition: 'width 0.6s ease',
                }} />
              </div>
              <span style={{
                fontSize: 10, fontWeight: 900, flexShrink: 0,
                color: progressPct >= 100 ? '#fbbf24' : colorA,
              }}>
                {doneCount}/{count}
              </span>
            </div>
          </div>
        )}

        {/* CTA button */}
        <div className="mt-4">
          {isActive ? (
            <button
              className="px-6 py-2.5 rounded-xl text-white font-black text-[13px] tracking-widest uppercase"
              style={{
                background: `linear-gradient(135deg, ${colorA}, ${colorB})`,
                boxShadow: `0 4px 0 ${shadow}`,
              }}>
              CONTINUER
            </button>
          ) : isLocked ? (
            <button
              className="px-5 py-2.5 rounded-xl text-[12px] font-black tracking-wider uppercase"
              style={{
                background: `${colorA}18`,
                border: `2px solid ${colorA}44`,
                color: `${colorA}99`,
                cursor: 'default',
              }}>
              PASSER À LA SECTION {index + 1}
            </button>
          ) : (
            <button
              className="px-5 py-2.5 rounded-xl text-[12px] font-black tracking-wider uppercase"
              style={{
                background: `linear-gradient(135deg, ${colorA}, ${colorB})`,
                boxShadow: `0 4px 0 ${shadow}`,
                color: 'white',
              }}>
              COMMENCER →
            </button>
          )
          }
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   PAGE
───────────────────────────────────────────── */
export default function ChaptersPage() {
  const { loading, callApi } = useApi();
  const { progress }         = useUserProgress();
  const [modules, setModules] = useState<any[]>([]);

  useEffect(() => {
    callApi(getModules).then(setModules).catch(() => setModules(MOCK_MODULES));
  }, []);

  const moduleList: any[] = Array.isArray(modules)
    ? modules
    : (modules as any)?.modules ?? MOCK_MODULES;

  if (loading && moduleList.length === 0) return <Loader />;

  // Un module est complété si toutes ses leçons sont dans completedLessons
  const isModuleCompleted = (m: any) => {
    if (!m) return false
    const lessons = m.lessons ?? []
    return lessons.length > 0 &&
      lessons.every((l: any) => l.id && progress.completedLessons.includes(String(l.id)))
  }

  // Module i est débloqué si i === 0 ou si le module i-1 est complété
  const unlockedSet = new Set<number>([0])
  for (let i = 1; i < moduleList.length; i++) {
    if (isModuleCompleted(moduleList[i - 1])) unlockedSet.add(i)
  }

  // Module actif = premier débloqué et non complété
  let activeIndex = 0
  Array.from(unlockedSet).forEach(i => {
    if (activeIndex === 0 && i < moduleList.length && !isModuleCompleted(moduleList[i])) activeIndex = i
  })

  return (
    <div className="flex flex-col items-center w-full min-h-screen bg-zellige pb-32 pt-6">

      {/* Top bar */}
      <div className="w-full max-w-sm px-4 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[22px] font-black text-gray-900">Mon parcours</h1>
            <p className="text-[12px] text-gray-500 font-semibold mt-0.5">
              {moduleList.length} chapitres · {progress.xp} XP
            </p>
          </div>
          </div>
      </div>

      {/* Chapter cards with level separators */}
      <div className="w-full max-w-sm px-4 flex flex-col gap-4">
        {moduleList.map((m, i) => {
          const prevLevel = i > 0 ? (moduleList[i - 1].level ?? 1) : null;
          const curLevel  = m.level ?? 1;
          const LEVEL_LABELS: Record<number, { label: string; color: string }> = {
            1: { label: '⭐ Niveau 1 — Débutant',       color: '#2a9d8f' },
            2: { label: '⭐⭐ Niveau 2 — Élémentaire',   color: '#e9a84c' },
            3: { label: '⭐⭐⭐ Niveau 3 — Intermédiaire', color: '#e76f51' },
            4: { label: '⭐⭐⭐⭐ Niveau 4 — Avancé',     color: '#7b2d8b' },
          };
          const showBanner = curLevel !== prevLevel;
          const lvl = LEVEL_LABELS[curLevel];
          return (
            <React.Fragment key={m.id}>
              {showBanner && lvl && (
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '6px 12px',
                  borderRadius: 12,
                  background: `${lvl.color}18`,
                  border: `1.5px solid ${lvl.color}44`,
                  marginTop: i === 0 ? 0 : 4,
                }}>
                  <span style={{ fontSize: 11, fontWeight: 900, color: lvl.color, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                    {lvl.label}
                  </span>
                </div>
              )}
              <ChapterCard
                m={m}
                index={i}
                isActive={i === activeIndex}
                isLocked={!unlockedSet.has(i)}
                completedLessons={progress.completedLessons}
              />
            </React.Fragment>
          );
        })}
      </div>

    </div>
  );
}
