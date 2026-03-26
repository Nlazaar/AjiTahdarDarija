'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getModules, getLessonsByModule } from '@/lib/api';
import { useUserProgress } from '@/contexts/UserProgressContext';
import { useMascot, type MascotId } from '@/contexts/MascotContext';

/* ─── Dark theme ──────────────────────────────────────────────────────────── */
const BG     = '#131f24';
const CARD   = '#1e2d36';
const CARD2  = '#243b4a';
const BORDER = 'rgba(255,255,255,0.07)';
const TEXT   = '#ffffff';
const SUB    = '#8b9eb0';
const BLUE   = '#1cb0f6';
const GREEN  = '#58cc02';

/* ─── Mascot emoji fallback (si image absente) ────────────────────────────── */
const MASCOT_EMOJI: Record<MascotId, string> = {
  lion: '🦁', girl: '👧', boy: '👦', bird: '🦉',
};

/* ─── Module types ─────────────────────────────────────────────────────────── */
interface LessonData { id: string; title: string; }
interface ModuleData {
  id: string; title: string; subtitle?: string; level?: number;
  colorA?: string; lessons: LessonData[];
}

/* ─── Fallback data ────────────────────────────────────────────────────────── */
const MOCK_MODULES: ModuleData[] = [
  { id: 'm1',  title: "L'Alphabet Arabe",   subtitle: 'Les 28 lettres',           level: 1, colorA: '#2a9d8f', lessons: [{id:'l1',title:'Voyelles'},{id:'l2',title:'Consonnes I'},{id:'l3',title:'Consonnes II'},{id:'l4',title:'Lettres spéciales'},{id:'l5',title:'Pratique'}] },
  { id: 'm2',  title: 'Les Salutations',     subtitle: 'Premiers mots',            level: 1, colorA: '#e76f51', lessons: [{id:'l6',title:'Bonjour'},{id:'l7',title:'Au revoir'},{id:'l8',title:'Comment ça va ?'},{id:'l9',title:'Révision'}] },
  { id: 'm3',  title: 'Se Présenter',        subtitle: 'Parler de soi',            level: 1, colorA: '#e9a84c', lessons: [{id:'l10',title:'Mon prénom'},{id:'l11',title:'Mon pays'},{id:'l12',title:'Ma famille'}] },
  { id: 'm4',  title: 'Les Chiffres',        subtitle: 'Compter en Darija',        level: 1, colorA: '#c9941a', lessons: [{id:'l13',title:'1 à 10'},{id:'l14',title:'11 à 100'},{id:'l15',title:'Les grands nombres'}] },
  { id: 'm5',  title: 'Les Couleurs',        subtitle: 'Arc-en-ciel en Darija',   level: 1, colorA: '#6a994e', lessons: [{id:'l16',title:'Couleurs de base'},{id:'l17',title:'Nuances'},{id:'l18',title:'Dans la nature'}] },
  { id: 'm6',  title: 'La Famille',          subtitle: 'Liens et relations',       level: 2, colorA: '#457b9d', lessons: [{id:'l19',title:'Parents'},{id:'l20',title:'Frères et sœurs'},{id:'l21',title:'La maison'}] },
  { id: 'm7',  title: 'La Nourriture',       subtitle: 'Manger et boire',          level: 2, colorA: '#e63946', lessons: [{id:'l22',title:'Les plats'},{id:'l23',title:'Les boissons'},{id:'l24',title:'Au restaurant'}] },
  { id: 'm8',  title: 'Les Directions',      subtitle: 'Se repérer en ville',      level: 2, colorA: '#7b2d8b', lessons: [{id:'l25',title:'Gauche / Droite'},{id:'l26',title:'Loin / Près'},{id:'l27',title:'En ville'}] },
  { id: 'm9',  title: 'Le Temps',            subtitle: 'Heures, jours, mois',     level: 2, colorA: '#264653', lessons: [{id:'l28',title:'Les heures'},{id:'l29',title:'Les jours'},{id:'l30',title:'Les saisons'}] },
  { id: 'm10', title: 'Les Achats',          subtitle: 'Au souk',                  level: 3, colorA: '#f4845f', lessons: [{id:'l31',title:'Les prix'},{id:'l32',title:'Négocier'}] },
  { id: 'm11', title: 'Les Transports',      subtitle: 'Voyager au Maroc',         level: 3, colorA: '#4a6fa5', lessons: [{id:'l33',title:'Taxi et bus'},{id:'l34',title:'Gare et aéroport'}] },
  { id: 'm12', title: 'La Santé',            subtitle: 'Chez le médecin',          level: 3, colorA: '#e07a8e', lessons: [{id:'l35',title:'Le corps'},{id:'l36',title:'Les maladies'}] },
  { id: 'm13', title: 'Le Travail',          subtitle: 'Vie professionnelle',      level: 3, colorA: '#2d6a4f', lessons: [{id:'l37',title:'Les métiers'},{id:'l38',title:'Au bureau'}] },
  { id: 'm14', title: 'Expressions',         subtitle: 'Parler comme un Marocain', level: 4, colorA: '#1b3a6b', lessons: [{id:'l39',title:'Idiomes I'},{id:'l40',title:'Idiomes II'},{id:'l41',title:'Argot'}] },
  { id: 'm15', title: 'Darija Avancé',       subtitle: 'Fluidité et nuances',      level: 4, colorA: '#4a4e69', lessons: [{id:'l42',title:'Dialogue complexe'},{id:'l43',title:'Éloquence'},{id:'l44',title:'Certification'}] },
];

const MODULE_PHRASES = [
  { ar: 'الف با تا…',        fr: 'Alef, ba, ta…' },
  { ar: 'سلام عليكم',        fr: 'Salam ! Bonjour !' },
  { ar: 'اسمي…',             fr: 'Mon prénom est…' },
  { ar: 'واحد جوج تلاتة',    fr: '1, 2, 3…' },
  { ar: 'حمر، خضر، زرق',     fr: 'Rouge, vert, bleu' },
  { ar: 'عائلتي كبيرة',       fr: 'Ma famille est grande' },
  { ar: 'بغيت كوسكوس!',      fr: 'Je veux du couscous !' },
  { ar: 'فين كتمشي؟',         fr: 'Où vas-tu ?' },
  { ar: 'شحال الساعة؟',       fr: 'Quelle heure est-il ?' },
  { ar: 'بشحال هاد؟',         fr: 'Combien ça coûte ?' },
  { ar: 'عطيني تاكسي',        fr: 'Appelle-moi un taxi' },
  { ar: 'راسي كايدير',        fr: "J'ai mal à la tête" },
  { ar: 'أنا كنخدم',          fr: 'Je travaille' },
  { ar: 'ماشي مشكيل!',        fr: 'Pas de problème !' },
  { ar: 'الدارجة سهلة!',      fr: "Le Darija c'est facile !" },
];

const LEVEL_LABELS: Record<number, { label: string; color: string }> = {
  1: { label: 'Débutant',      color: '#58cc02' },
  2: { label: 'Élémentaire',   color: '#1cb0f6' },
  3: { label: 'Intermédiaire', color: '#f59e0b' },
  4: { label: 'Avancé',        color: '#a78bfa' },
};

/* ─── Speech bubble ───────────────────────────────────────────────────────── */
function SpeechBubble({ ar, fr }: { ar: string; fr: string }) {
  return (
    <div style={{ position: 'relative', marginBottom: 10 }}>
      <div style={{
        background: CARD2,
        border: `1.5px solid rgba(255,255,255,0.12)`,
        borderRadius: 14,
        padding: '10px 14px',
        textAlign: 'center',
        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
      }}>
        <div style={{ fontSize: 17, fontWeight: 900, color: TEXT, fontFamily: 'var(--font-amiri), serif', direction: 'rtl', marginBottom: 2 }}>
          {ar}
        </div>
        <div style={{ fontSize: 10, fontWeight: 700, color: SUB }}>{fr}</div>
      </div>
      {/* Tail pointing down */}
      <div style={{
        position: 'absolute', bottom: -7, left: '50%', transform: 'translateX(-50%)',
        width: 0, height: 0,
        borderLeft: '7px solid transparent',
        borderRight: '7px solid transparent',
        borderTop: '7px solid rgba(255,255,255,0.12)',
      }} />
      <div style={{
        position: 'absolute', bottom: -5, left: '50%', transform: 'translateX(-50%)',
        width: 0, height: 0,
        borderLeft: '5px solid transparent',
        borderRight: '5px solid transparent',
        borderTop: '5px solid #243b4a',
        zIndex: 1,
      }} />
    </div>
  );
}

/* ─── Chapter card ────────────────────────────────────────────────────────── */
function ChapterCard({ mod, modIdx, status, completedCount, totalCount, accent, mascotId, onContinue }: {
  mod: ModuleData;
  modIdx: number;
  status: 'completed' | 'active' | 'locked';
  completedCount: number;
  totalCount: number;
  accent: string;
  mascotId: MascotId;
  onContinue: () => void;
}) {
  const phrase    = MODULE_PHRASES[modIdx % MODULE_PHRASES.length];
  const pct       = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const isLocked  = status === 'locked';
  const isDone    = status === 'completed';
  const levelInfo = LEVEL_LABELS[mod.level ?? 1];

  return (
    <div style={{
      background: CARD,
      border: `1.5px solid ${isLocked ? BORDER : isDone ? 'rgba(88,204,2,0.25)' : `${accent}30`}`,
      borderRadius: 20,
      padding: '16px 16px',
      display: 'flex',
      gap: 12,
      opacity: isLocked ? 0.55 : 1,
      transition: 'opacity 0.2s',
    }}>

      {/* ── Left: info ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 5, minWidth: 0 }}>

        {/* Chapter index only — no level badge */}
        <span style={{ fontSize: 11, fontWeight: 900, color: SUB, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Chapitre {modIdx + 1}
        </span>

        {/* Title */}
        <div style={{ fontSize: 17, fontWeight: 900, color: isLocked ? SUB : TEXT, lineHeight: 1.2 }}>
          {mod.title}
        </div>

        {/* Subtitle */}
        {mod.subtitle && (
          <div style={{ fontSize: 12, fontWeight: 600, color: SUB }}>
            {mod.subtitle}
          </div>
        )}

        {/* Progress bar OR lock indicator */}
        {isLocked ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
            <span style={{ fontSize: 13 }}>🔒</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: SUB }}>
              {totalCount} leçon{totalCount > 1 ? 's' : ''}
            </span>
          </div>
        ) : (
          <div style={{ marginTop: 2 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{ fontSize: 11, fontWeight: 800, color: isDone ? GREEN : BLUE }}>
                {isDone ? '✓ Terminé' : `${pct} %`}
              </span>
              {isDone && <span style={{ fontSize: 13 }}>🏆</span>}
            </div>
            <div style={{ height: 8, background: 'rgba(255,255,255,0.08)', borderRadius: 4, overflow: 'hidden' }}>
              <div style={{
                height: '100%', width: `${pct}%`,
                background: isDone ? `linear-gradient(90deg, ${GREEN}, #46a302)` : `linear-gradient(90deg, ${BLUE}, #1899d6)`,
                borderRadius: 4, transition: 'width 0.5s ease',
              }} />
            </div>
          </div>
        )}

        {/* Action button — full width */}
        <div style={{ marginTop: 10 }}>
          {isLocked ? (
            <div style={{
              display: 'inline-block', padding: '10px 20px', borderRadius: 12,
              background: CARD2, border: `1.5px solid #1cb0f6`,
              color: '#4dd4ff', fontSize: 10, fontWeight: 900,
              textTransform: 'uppercase' as const, letterSpacing: '0.06em',
              textAlign: 'center' as const,
            }}>
              Passer à la section {modIdx + 1}
            </div>
          ) : isDone ? (
            <button onClick={onContinue} style={{
              display: 'inline-block', padding: '10px 20px', borderRadius: 12,
              background: 'transparent', border: `1.5px solid rgba(88,204,2,0.4)`,
              color: GREEN, fontSize: 10, fontWeight: 900,
              textTransform: 'uppercase' as const, letterSpacing: '0.06em',
              cursor: 'pointer',
            }}>
              Recommencer
            </button>
          ) : (
            <button onClick={onContinue} style={{
              display: 'inline-block', padding: '10px 20px', borderRadius: 12,
              background: BLUE, border: 'none',
              color: 'white', fontSize: 10, fontWeight: 900,
              textTransform: 'uppercase' as const, letterSpacing: '0.06em',
              cursor: 'pointer', boxShadow: '0 3px 0 #1899d6',
            }}>
              Continuer
            </button>
          )}
        </div>
      </div>

      {/* ── Right: bubble au-dessus + vraie image mascotte ── */}
      <div style={{
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'flex-end',
        width: 110, flexShrink: 0,
      }}>
        <SpeechBubble ar={phrase.ar} fr={phrase.fr} />
        {/* Vraie image mascotte si dispo, sinon emoji fallback */}
        <div style={{
          fontSize: 72, lineHeight: 1,
          filter: isLocked ? 'grayscale(0.9) brightness(0.5)' : 'none',
          animation: isLocked ? 'none' : 'mascotFloat 2.5s ease-in-out infinite',
        }}>
          {MASCOT_EMOJI[mascotId]}
        </div>
      </div>
    </div>
  );
}

/* ─── Page ─────────────────────────────────────────────────────────────────── */
export default function CoursPage() {
  const router    = useRouter();
  const { progress } = useUserProgress();
  const { mascot }   = useMascot();
  const [modules, setModules] = useState<ModuleData[]>([]);
  const [loading, setLoading] = useState(true);

  const mascotId: MascotId = mascot?.id ?? 'lion';

  useEffect(() => {
    async function load() {
      try {
        const mods = await getModules() as ModuleData[];
        if (!Array.isArray(mods) || mods.length === 0) throw new Error('empty');
        const withLessons = await Promise.all(
          mods.map(async (m) => {
            try {
              const lessons = await getLessonsByModule(m.id) as LessonData[];
              return { ...m, lessons: Array.isArray(lessons) ? lessons : [] };
            } catch {
              return { ...m, lessons: [] as LessonData[] };
            }
          })
        );
        setModules(withLessons);
      } catch {
        setModules(MOCK_MODULES);
      }
      setLoading(false);
    }
    load();
  }, []);

  const completedSet = new Set(progress.completedLessons.map(String));

  const isModuleComplete  = (m: ModuleData) =>
    m.lessons.length > 0 && m.lessons.every(l => completedSet.has(l.id));

  const isModuleUnlocked  = (idx: number) =>
    idx === 0 || isModuleComplete(modules[idx - 1]);

  const completedInModule = (m: ModuleData) =>
    m.lessons.filter(l => completedSet.has(l.id)).length;

  const completedModules  = modules.filter(isModuleComplete).length;

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: BG, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: SUB, fontSize: 14, fontWeight: 700 }}>Chargement…</div>
      </div>
    );
  }

  return (
    <div style={{ width: '100%', padding: '0 0 80px', color: TEXT, backgroundColor: '#131f24' }}>

      {/* ── Header ── */}
      <div style={{ padding: '24px 0 20px', position: 'sticky', top: 0, zIndex: 999, backgroundColor: '#131f24', boxShadow: '0 -40px 0 0 #131f24' }}>
        <button
          onClick={() => router.push('/progress')}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: 'none', border: 'none', cursor: 'pointer',
            fontSize: 15, fontWeight: 700, color: SUB, padding: 0,
            marginBottom: 16,
          }}
        >
          ← Retour
        </button>
        <div style={{ height: 1, background: BORDER, marginBottom: 20 }} />
      </div>

      {/* ── Chapter cards ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {modules.map((mod, idx) => {
          const unlocked = isModuleUnlocked(idx);
          const done     = isModuleComplete(mod);
          const status: 'completed' | 'active' | 'locked' =
            done ? 'completed' : unlocked ? 'active' : 'locked';

          return (
            <ChapterCard
              key={mod.id}
              mod={mod}
              modIdx={idx}
              status={status}
              completedCount={completedInModule(mod)}
              totalCount={mod.lessons.length}
              accent={mod.colorA ?? '#2a9d8f'}
              mascotId={mascotId}
              onContinue={() => router.push('/progress')}
            />
          );
        })}
      </div>
    </div>
  );
}
