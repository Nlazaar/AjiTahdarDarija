'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { getDueVocab, getRetentionStats, markVocabResult, markVocabSeen } from '@/lib/api';
import { useAudio } from '@/hooks/useAudio';
import ChoixLettre from '@/components/exercises/ChoixLettre';
import type { DarijaLetter } from '@/components/exercises/types';

type DueItem = {
  id: string;
  mastery: number;
  vocabulary: {
    id: string;
    word: string;
    transliteration: string | null;
    translation: any;
    imageUrl: string | null;
  };
};

type Stats = { total: number; mastered: number; learning: number; toReview: number; dueNow: number };

function toLetter(v: DueItem['vocabulary']): DarijaLetter {
  return {
    id:       v.id,
    letter:   v.word,
    latin:    v.transliteration ?? '',
    fr:       (v.translation as any)?.fr ?? (v.translation as any)?.default ?? '',
    imageUrl: v.imageUrl ?? undefined,
  };
}

export default function RevisionPage() {
  const { speak } = useAudio();
  const [stats, setStats]       = useState<Stats | null>(null);
  const [loading, setLoading]   = useState(true);
  const [mode, setMode]         = useState<'home' | 'session' | 'done'>('home');
  const [queue, setQueue]       = useState<DueItem[]>([]);
  const [idx, setIdx]           = useState(0);
  const [correctCount, setCorrect] = useState(0);
  const [shouldValidate, setShouldValidate] = useState(false);
  const [isReady, setIsReady]   = useState(false);
  const [answered, setAnswered] = useState(false);

  const loadStats = useCallback(async () => {
    try {
      const s = await getRetentionStats();
      setStats(s);
    } catch {
      setStats({ total: 0, mastered: 0, learning: 0, toReview: 0, dueNow: 0 });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadStats(); }, [loadStats]);

  const startSession = async () => {
    const items = await getDueVocab(10);
    if (!items || items.length === 0) return;
    setQueue(items);
    setIdx(0);
    setCorrect(0);
    setAnswered(false);
    setShouldValidate(false);
    setIsReady(false);
    setMode('session');
  };

  const current = queue[idx];
  const currentLetter = useMemo(() => current ? toLetter(current.vocabulary) : null, [current]);

  // Distracteurs : autres items de la queue
  const choices = useMemo<DarijaLetter[]>(() => {
    if (!current) return [];
    const others = queue
      .filter(q => q.id !== current.id)
      .slice(0, 3)
      .map(q => toLetter(q.vocabulary));
    const pool = [toLetter(current.vocabulary), ...others];
    return [...pool].sort(() => Math.random() - 0.5);
  }, [current, queue]);

  const handleSuccess = () => {
    if (!current) return;
    setAnswered(true);
    setCorrect(c => c + 1);
    markVocabSeen(current.id).catch(() => {});
    markVocabResult(current.id, true).catch(() => {});
  };

  const handleFailed = () => {
    if (!current) return;
    setAnswered(true);
    markVocabSeen(current.id).catch(() => {});
    markVocabResult(current.id, false).catch(() => {});
  };

  const next = () => {
    if (idx < queue.length - 1) {
      setIdx(i => i + 1);
      setAnswered(false);
      setShouldValidate(false);
      setIsReady(false);
    } else {
      setMode('done');
      loadStats();
    }
  };

  const speakLetter = (l: DarijaLetter) => speak(l.letter);

  /* ─── Session ──────────────────────────────────────────────────────────── */
  if (mode === 'session' && currentLetter) {
    return (
      <div style={{ maxWidth: 640, margin: '0 auto', padding: '24px 16px 80px' }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginBottom: 20, fontSize: 13, color: 'var(--c-sub)',
        }}>
          <button
            onClick={() => setMode('home')}
            style={{ background: 'transparent', border: 'none', color: 'var(--c-sub)', cursor: 'pointer', fontSize: 14 }}
          >← Quitter</button>
          <div style={{ fontWeight: 800, color: '#a5b4fc' }}>
            {idx + 1} / {queue.length}
          </div>
        </div>

        <ChoixLettre
          letter={currentLetter}
          choices={choices}
          onSuccess={handleSuccess}
          onFailed={handleFailed}
          onSpeak={speakLetter}
          onReadyChange={setIsReady}
          shouldValidate={shouldValidate}
          mode="mot"
          prompt="Quelle est la traduction ?"
        />

        <div style={{ marginTop: 24, display: 'flex', justifyContent: 'center' }}>
          {!answered ? (
            <button
              onClick={() => setShouldValidate(true)}
              disabled={!isReady}
              style={{
                padding: '14px 40px', borderRadius: 14, border: 'none',
                background: isReady ? '#58cc02' : '#2a3d47',
                color: 'white', fontSize: 14, fontWeight: 900,
                letterSpacing: '0.06em', textTransform: 'uppercase',
                cursor: isReady ? 'pointer' : 'default',
                boxShadow: isReady ? '0 5px 0 #3fa000' : 'none',
              }}
            >Valider</button>
          ) : (
            <button
              onClick={next}
              style={{
                padding: '14px 40px', borderRadius: 14, border: 'none',
                background: '#1cb0f6', color: 'white',
                fontSize: 14, fontWeight: 900,
                letterSpacing: '0.06em', textTransform: 'uppercase',
                cursor: 'pointer', boxShadow: '0 5px 0 #1899d6',
              }}
            >Continuer</button>
          )}
        </div>
      </div>
    );
  }

  /* ─── Écran fin de session ─────────────────────────────────────────────── */
  if (mode === 'done') {
    const pct = queue.length > 0 ? Math.round((correctCount / queue.length) * 100) : 0;
    return (
      <div style={{ maxWidth: 500, margin: '0 auto', padding: '60px 20px', textAlign: 'center' }}>
        <div style={{ fontSize: 64, marginBottom: 20 }}>{pct >= 80 ? '🎉' : pct >= 50 ? '👍' : '💪'}</div>
        <h1 style={{ fontSize: 28, fontWeight: 900, color: 'var(--c-text)', marginBottom: 12 }}>
          Session terminée !
        </h1>
        <p style={{ fontSize: 16, color: 'var(--c-sub)', marginBottom: 28 }}>
          {correctCount} / {queue.length} réponses justes ({pct}%)
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <button
            onClick={() => setMode('home')}
            style={{
              padding: '14px 32px', borderRadius: 14, border: 'none',
              background: '#1cb0f6', color: 'white',
              fontSize: 14, fontWeight: 900, letterSpacing: '0.06em', textTransform: 'uppercase',
              cursor: 'pointer', boxShadow: '0 5px 0 #1899d6',
            }}
          >Retour</button>
          <Link
            href="/cours"
            style={{
              padding: '12px 28px', borderRadius: 12, border: '1px solid var(--c-border)',
              background: 'var(--c-card)', color: 'var(--c-sub)',
              fontSize: 13, fontWeight: 700, textDecoration: 'none',
            }}
          >Reprendre le cours</Link>
        </div>
      </div>
    );
  }

  /* ─── Home ─────────────────────────────────────────────────────────────── */
  if (loading) {
    return <div style={{ textAlign: 'center', padding: 60, color: 'var(--c-sub)' }}>Chargement…</div>;
  }

  const empty = !stats || stats.total === 0;
  const nothingDue = !empty && (stats?.dueNow ?? 0) === 0;

  return (
    <div style={{ maxWidth: 640, margin: '0 auto', padding: '32px 16px 80px', color: 'var(--c-text)' }}>
      <h1 style={{ fontSize: 28, fontWeight: 900, marginBottom: 6 }}>🔁 Révision</h1>
      <p style={{ fontSize: 15, color: 'var(--c-sub)', marginBottom: 24 }}>
        Consolide ce que tu as appris avec une mini-session ciblée.
      </p>

      {/* Stats */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10, marginBottom: 24,
      }}>
        <StatCard label="À réviser maintenant" value={stats?.dueNow ?? 0} color="#ff9600" />
        <StatCard label="Maîtrisés"            value={stats?.mastered ?? 0} color="#58cc02" />
        <StatCard label="En apprentissage"     value={stats?.learning ?? 0} color="#1cb0f6" />
        <StatCard label="Difficiles"           value={stats?.toReview ?? 0} color="#ff4b4b" />
      </div>

      {/* CTA */}
      {empty ? (
        <EmptyState
          emoji="🌱"
          title="Aucun item suivi pour l'instant"
          body="Fais quelques leçons — les mots que tu rencontres seront automatiquement ajoutés ici."
          cta="Aller aux cours"
          href="/cours"
        />
      ) : nothingDue ? (
        <EmptyState
          emoji="✅"
          title="Tout est à jour !"
          body={`Tu as ${stats?.total ?? 0} mots suivis. Reviens plus tard — on te proposera les items à rafraîchir quand il sera temps.`}
          cta="Reprendre le cours"
          href="/cours"
        />
      ) : (
        <button
          onClick={startSession}
          style={{
            width: '100%',
            padding: '18px 32px', borderRadius: 16, border: 'none',
            background: '#58cc02', color: 'white',
            fontSize: 15, fontWeight: 900, letterSpacing: '0.06em', textTransform: 'uppercase',
            cursor: 'pointer', boxShadow: '0 6px 0 #3fa000',
          }}
        >
          Réviser maintenant — {Math.min(10, stats?.dueNow ?? 0)} items ✨
        </button>
      )}
    </div>
  );
}

function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div style={{
      padding: '16px 14px', borderRadius: 14,
      background: 'var(--c-card)', border: '1px solid var(--c-border)',
    }}>
      <div style={{ fontSize: 28, fontWeight: 900, color, lineHeight: 1.1 }}>{value}</div>
      <div style={{ fontSize: 12, color: 'var(--c-sub)', marginTop: 4, fontWeight: 700 }}>{label}</div>
    </div>
  );
}

function EmptyState({ emoji, title, body, cta, href }: {
  emoji: string; title: string; body: string; cta: string; href: string;
}) {
  return (
    <div style={{
      padding: '32px 24px', borderRadius: 16, textAlign: 'center',
      background: 'var(--c-card)', border: '1px dashed var(--c-border)',
    }}>
      <div style={{ fontSize: 48, marginBottom: 12 }}>{emoji}</div>
      <h3 style={{ fontSize: 17, fontWeight: 900, color: 'var(--c-text)', marginBottom: 8 }}>{title}</h3>
      <p style={{ fontSize: 13, color: 'var(--c-sub)', marginBottom: 20, lineHeight: 1.5 }}>{body}</p>
      <Link
        href={href}
        style={{
          display: 'inline-block',
          padding: '12px 28px', borderRadius: 12, border: 'none',
          background: '#1cb0f6', color: 'white',
          fontSize: 13, fontWeight: 900, letterSpacing: '0.06em', textTransform: 'uppercase',
          textDecoration: 'none', boxShadow: '0 4px 0 #1899d6',
        }}
      >{cta}</Link>
    </div>
  );
}
