'use client';

import { useEffect, useMemo, useState } from 'react';
import { getModules } from '@/lib/api';
import { useUserProgress } from '@/contexts/UserProgressContext';
import { useUser } from '@/context/UserContext';
import type { CityDescription, HadithDescription } from '@/types/parcours';

export type NodeStatus = 'completed' | 'current' | 'locked';
export type RevisionPosition = 'MIDDLE' | 'END';

export interface Lecon {
  id: string;
  title: string;
  status: NodeStatus;
}

export interface Revision {
  id: string;
  position: RevisionPosition;
  title: string | null;
  status: NodeStatus;
  anchorAfterOrder: number | null;
}

export interface Unite {
  id: string;
  title: string;
  titleAr?: string;
  subtitle?: string;
  level: number;
  colorA: string;
  colorB: string;
  shadow: string;
  lecons: Lecon[];
  revisions: Revision[];
  trophyUnlocked: boolean;
  unlocked: boolean;
  completed: boolean;
  description?: CityDescription;
  hadith?: HadithDescription;
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

interface RawCityInfo {
  emoji?: string;
  photoUrl?: string;
  postcardUrl?: string;
  history?: string;
  typicalWord?: { ar?: string; latin?: string; fr?: string };
  food?: string;
  culturalFact?: string;
  toSee?: string;
  music?: string;
  // Variantes Religion (réutilisation du bucket cityInfo)
  hadith?: { ar?: string; fr?: string; source?: string };
  description?: string;
  subtitle?: string;
}

interface RawLesson {
  id: string;
  title: string;
  order?: number;
}

interface RawRevision {
  id: string;
  position: RevisionPosition;
  title?: string | null;
  anchorAfterOrder?: number | null;
}

type RawTrack = 'DARIJA' | 'MSA' | 'RELIGION';

interface RawModule {
  id: string;
  slug?: string;
  title: string;
  titleAr?: string | null;
  subtitle?: string | null;
  level?: number;
  colorA?: string | null;
  colorB?: string | null;
  shadowColor?: string | null;
  track?: RawTrack;
  canonicalOrder?: number;
  cityName?: string | null;
  cityNameAr?: string | null;
  emoji?: string | null;
  photoCaption?: string | null;
  cityInfo?: RawCityInfo | null;
  lessons?: RawLesson[];
  revisions?: RawRevision[];
}

function buildDescription(m: RawModule): CityDescription | undefined {
  const ci = m.cityInfo ?? null;
  const tw = ci?.typicalWord ?? {};
  const photoEmoji = m.emoji || ci?.emoji || '🏙️';
  const hasAny =
    m.photoCaption || ci?.history || ci?.food || ci?.culturalFact || ci?.toSee || ci?.music ||
    tw.ar || tw.latin || tw.fr || ci?.photoUrl || ci?.postcardUrl;
  if (!hasAny) return undefined;
  return {
    photoEmoji,
    photoCaption: m.photoCaption ?? '',
    photoUrl: ci?.photoUrl || undefined,
    postcardUrl: ci?.postcardUrl || undefined,
    histoire: ci?.history || '',
    motTypique: { ar: tw.ar || '', latin: tw.latin || '', fr: tw.fr || '' },
    specialite: ci?.food || '',
    faitCulturel: ci?.culturalFact || '',
    aVoir: ci?.toSee || '',
    musique: ci?.music || '',
  } as CityDescription;
}

function buildHadith(m: RawModule): HadithDescription | undefined {
  const ci = m.cityInfo ?? null;
  const h = ci?.hadith ?? null;
  if (!h?.ar && !ci?.description) return undefined;
  return {
    emoji: m.emoji || ci?.emoji || '☪️',
    subtitle: ci?.subtitle || m.photoCaption || undefined,
    description: ci?.description || undefined,
    hadith: h?.ar
      ? { ar: h.ar, fr: h.fr || '', source: h.source || undefined }
      : undefined,
  };
}

function buildLecons(lessons: RawLesson[], unlocked: boolean, completedSet: Set<string>): Lecon[] {
  let foundCurrent = false;
  return lessons.map((l, lIdx) => {
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
}

function buildRevisions(
  raw: RawRevision[],
  lecons: Lecon[],
  completedRevisionIds: Set<string>,
): Revision[] {
  const rawByPos = new Map<RevisionPosition, RawRevision>();
  for (const r of raw) rawByPos.set(r.position, r);
  const out: Revision[] = [];
  const n = lecons.length;

  const mid = rawByPos.get('MIDDLE');
  if (mid) {
    const rawAnchor = mid.anchorAfterOrder ?? Math.floor(n / 2);
    const midAnchor = Math.max(0, Math.min(n, rawAnchor));
    const midLessonsDone = lecons.slice(0, midAnchor).every((l) => l.status === 'completed');
    const status: NodeStatus = completedRevisionIds.has(mid.id)
      ? 'completed'
      : midLessonsDone
        ? 'current'
        : 'locked';
    out.push({
      id: mid.id,
      position: 'MIDDLE',
      title: mid.title ?? null,
      status,
      anchorAfterOrder: midAnchor,
    });
  }

  const end = rawByPos.get('END');
  if (end) {
    const rawAnchor = end.anchorAfterOrder ?? n;
    const endAnchor = Math.max(0, Math.min(n, rawAnchor));
    const allLessonsDone = n > 0 && lecons.slice(0, endAnchor).every((l) => l.status === 'completed');
    const midOk = !mid || completedRevisionIds.has(mid.id);
    const status: NodeStatus = completedRevisionIds.has(end.id)
      ? 'completed'
      : allLessonsDone && midOk
        ? 'current'
        : 'locked';
    out.push({
      id: end.id,
      position: 'END',
      title: end.title ?? null,
      status,
      anchorAfterOrder: endAnchor,
    });
  }

  return out;
}

function moduleToUnite(
  m: RawModule,
  idx: number,
  unlocked: boolean,
  completedSet: Set<string>,
  completedRevisionIds: Set<string>,
): Unite {
  const palette = PALETTE[idx % PALETTE.length];
  const lessons = m.lessons ?? [];
  const lecons = buildLecons(lessons, unlocked, completedSet);
  const revisions = buildRevisions(m.revisions ?? [], lecons, completedRevisionIds);
  const allLessonsDone = lessons.length > 0 && lessons.every((l) => completedSet.has(l.id));
  const endRev = revisions.find((r) => r.position === 'END');
  const allDone = allLessonsDone && (!endRev || endRev.status === 'completed');
  const title = m.cityName?.trim() || m.title;
  const titleAr = m.cityNameAr?.trim() || m.titleAr?.trim() || undefined;
  return {
    id: m.id,
    title,
    titleAr,
    subtitle: m.subtitle ?? undefined,
    level: m.level ?? 1,
    colorA: m.colorA ?? palette.colorA,
    colorB: m.colorB ?? palette.colorB,
    shadow: m.shadowColor ?? palette.shadow,
    lecons,
    revisions,
    trophyUnlocked: allDone,
    unlocked,
    completed: allDone,
    description: m.track === 'RELIGION' ? undefined : buildDescription(m),
    hadith: m.track === 'RELIGION' ? buildHadith(m) : undefined,
  };
}

export function useParcours() {
  const { progress } = useUserProgress();
  const { langTrack } = useUser();
  const [modules, setModules] = useState<RawModule[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    (async () => {
      try {
        const mods = (await getModules(langTrack)) as RawModule[];
        if (!cancelled) setModules(Array.isArray(mods) ? mods : []);
      } catch {
        if (!cancelled) setModules([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [langTrack]);

  const completedSet = useMemo(
    () => new Set(progress.completedLessons.map(String)),
    [progress.completedLessons]
  );

  const completedRevisionIds = useMemo<Set<string>>(
    () => new Set<string>((progress.completedRevisions ?? []).map(String)),
    [progress.completedRevisions]
  );

  const unites: Unite[] = useMemo(() => {
    const out: Unite[] = [];
    let prevCompleted = true;
    modules.forEach((m, idx) => {
      const unlocked = prevCompleted;
      const unite = moduleToUnite(m, idx, unlocked, completedSet, completedRevisionIds);
      out.push(unite);
      prevCompleted = unite.completed;
    });
    return out;
  }, [modules, completedSet, completedRevisionIds]);

  return { unites, loading };
}
