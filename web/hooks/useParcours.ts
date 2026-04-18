'use client';

import { useEffect, useMemo, useState } from 'react';
import { getModules, getLessonsByModule } from '@/lib/api';
import { useUserProgress } from '@/contexts/UserProgressContext';

export type NodeStatus = 'completed' | 'current' | 'locked';

export interface Lecon {
  id: string;
  title: string;
  status: NodeStatus;
}

export interface Unite {
  id: string;
  title: string;
  subtitle?: string;
  level: number;
  colorA: string;
  colorB: string;
  shadow: string;
  lecons: Lecon[];
  chestUnlocked: boolean;
  trophyUnlocked: boolean;
  unlocked: boolean;
  completed: boolean;
}

const PALETTE = [
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

interface RawModule {
  id: string;
  title: string;
  subtitle?: string;
  level?: number;
  colorA?: string;
  colorB?: string;
  shadowColor?: string;
}

interface RawLesson {
  id: string;
  title: string;
  order?: number;
}

export function useParcours() {
  const { progress } = useUserProgress();
  const [modules, setModules] = useState<Array<RawModule & { lessons: RawLesson[] }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const mods = (await getModules()) as RawModule[];
        if (!Array.isArray(mods)) throw new Error('empty');
        const withLessons = await Promise.all(
          mods.map(async (m) => {
            try {
              const lessons = (await getLessonsByModule(m.id)) as RawLesson[];
              return { ...m, lessons: Array.isArray(lessons) ? lessons : [] };
            } catch {
              return { ...m, lessons: [] };
            }
          })
        );
        if (!cancelled) setModules(withLessons);
      } catch {
        if (!cancelled) setModules([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const completedSet = useMemo(
    () => new Set(progress.completedLessons.map(String)),
    [progress.completedLessons]
  );

  const unites: Unite[] = useMemo(() => {
    const out: Unite[] = [];
    let prevCompleted = true;
    modules.forEach((m, idx) => {
      const palette = PALETTE[idx % PALETTE.length];
      const lessons = m.lessons ?? [];
      const allDone = lessons.length > 0 && lessons.every((l) => completedSet.has(l.id));
      const unlocked = prevCompleted;

      let foundCurrent = false;
      const lecons: Lecon[] = lessons.map((l, lIdx) => {
        const isDone = completedSet.has(l.id);
        const prevAllDone = lessons.slice(0, lIdx).every((p) => completedSet.has(p.id));
        let status: NodeStatus = 'locked';
        if (isDone) status = 'completed';
        else if (unlocked && prevAllDone && !foundCurrent) {
          status = 'current';
          foundCurrent = true;
        }
        return { id: l.id, title: l.title, status };
      });

      out.push({
        id: m.id,
        title: m.title,
        subtitle: m.subtitle,
        level: m.level ?? 1,
        colorA: m.colorA ?? palette.colorA,
        colorB: m.colorB ?? palette.colorB,
        shadow: m.shadowColor ?? palette.shadow,
        lecons,
        chestUnlocked: lessons.length > 0 && lecons.slice(0, Math.max(1, lessons.length - 1)).every((l) => l.status === 'completed'),
        trophyUnlocked: allDone,
        unlocked,
        completed: allDone,
      });

      prevCompleted = allDone;
    });
    return out;
  }, [modules, completedSet]);

  return { unites, loading };
}
