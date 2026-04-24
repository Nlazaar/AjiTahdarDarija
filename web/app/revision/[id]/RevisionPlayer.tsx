'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getRevision, type RevisionDetail, type RevisionConversationContent, type RevisionExercisesContent } from '@/lib/api';
import { useAudio } from '@/hooks/useAudio';
import { useUserProgress } from '@/contexts/UserProgressContext';
import VoixVisuel, { type VoixVisuelConfig } from '@/components/exercises/VoixVisuel';
import TrouverIntrus, { type TrouverIntrusConfig } from '@/components/exercises/TrouverIntrus';

const GOLD = '#d4a84b';
const RED = '#c1272d';
const GREEN = '#006233';

type Turn = RevisionConversationContent['turns'][number];

export default function RevisionPlayer({ id }: { id: string }) {
  const router = useRouter();
  const { speak, stop } = useAudio();
  const { completeRevision } = useUserProgress();
  const [data, setData] = useState<RevisionDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(0);
  const [done, setDone] = useState(false);
  const [showTranslit, setShowTranslit] = useState(false);
  const [xpAwarded, setXpAwarded] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const rev = await getRevision(id);
        if (!cancelled) {
          setData(rev);
          setRevealed(0);
        }
      } catch (e: any) {
        if (!cancelled) setError(e?.message ?? 'Révision introuvable');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
      stop();
    };
  }, [id, stop]);

  const playTurn = useCallback(
    async (t: Turn) => {
      if (t.audioUrl) {
        try {
          const audio = new Audio(t.audioUrl);
          audio.play().catch(() => speak(t.darija));
        } catch {
          speak(t.darija);
        }
      } else {
        speak(t.darija);
      }
    },
    [speak],
  );

  const content = data?.content;
  const isExercisesKind = content && (content as any).kind === 'exercises';
  const conversationTurns: Turn[] = !isExercisesKind && content && 'turns' in content ? content.turns : [];
  const turns = conversationTurns;
  const total = turns.length;
  const nextTurn = turns[revealed] ?? null;
  const isMid = data?.position === 'MIDDLE';

  const handleReveal = async () => {
    if (!nextTurn) return;
    setRevealed((r) => Math.min(r + 1, total));
    playTurn(nextTurn);
    if (revealed + 1 >= total && !done) {
      setDone(true);
      setSubmitting(true);
      const res = await completeRevision(id);
      setSubmitting(false);
      setXpAwarded(res?.alreadyCompleted ? 0 : res?.xpAwarded ?? null);
    }
  };

  const handleReplay = (t: Turn) => playTurn(t);

  const handleFinish = () => {
    router.push('/cours');
  };

  if (loading) {
    return (
      <div style={{ maxWidth: 640, margin: '0 auto', padding: '60px 16px', textAlign: 'center', color: 'var(--c-sub)' }}>
        Chargement de la révision…
      </div>
    );
  }

  if (error || !data) {
    return (
      <div style={{ maxWidth: 480, margin: '0 auto', padding: '60px 20px', textAlign: 'center' }}>
        <div style={{ fontSize: 48, marginBottom: 14 }}>😕</div>
        <h1 style={{ fontSize: 20, fontWeight: 900, color: 'var(--c-text)', marginBottom: 8 }}>
          Révision indisponible
        </h1>
        <p style={{ fontSize: 14, color: 'var(--c-sub)', marginBottom: 20 }}>
          {error ?? "Cette révision n'existe pas ou n'est pas encore publiée."}
        </p>
        <Link
          href="/cours"
          style={{
            display: 'inline-block', padding: '12px 26px', borderRadius: 12,
            background: '#1cb0f6', color: 'white', textDecoration: 'none',
            fontWeight: 900, fontSize: 13, letterSpacing: '0.06em', textTransform: 'uppercase',
            boxShadow: '0 4px 0 #1899d6',
          }}
        >
          Retour aux cours
        </Link>
      </div>
    );
  }

  const cityName = data.module?.cityName ?? data.module?.title ?? '';
  const positionLabel = isMid ? '💬 Pause révision' : '🎓 Révision finale';
  const progressPct = total === 0 ? 0 : Math.round((revealed / total) * 100);

  if (isExercisesKind) {
    const exContent = content as RevisionExercisesContent;
    return (
      <ExercisesRevision
        data={data}
        content={exContent}
        cityName={cityName}
        positionLabel={positionLabel}
        onComplete={async () => {
          const res = await completeRevision(id);
          return res;
        }}
        onQuit={() => router.push('/cours')}
      />
    );
  }

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '20px 16px 80px', color: 'var(--c-text)' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <button
          onClick={() => router.push('/cours')}
          style={{ background: 'transparent', border: 'none', color: 'var(--c-sub)', cursor: 'pointer', fontSize: 14 }}
        >
          ← Quitter
        </button>
        <div style={{ fontSize: 11, fontWeight: 900, letterSpacing: '0.08em', textTransform: 'uppercase', color: GOLD }}>
          {positionLabel}
        </div>
        <button
          onClick={() => setShowTranslit((s) => !s)}
          title={showTranslit ? 'Masquer l\'arabe' : 'Afficher l\'arabe'}
          style={{
            background: 'transparent', border: '1px solid var(--c-border)', color: 'var(--c-sub)',
            cursor: 'pointer', fontSize: 11, fontWeight: 800, padding: '5px 10px', borderRadius: 8,
          }}
        >
          {showTranslit ? 'ع on' : 'ع off'}
        </button>
      </div>

      {/* Medallion title */}
      <div style={{ textAlign: 'center', marginBottom: 18 }}>
        <div style={{
          display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 8,
        }}>
          <div style={{
            width: 72, height: 72, borderRadius: '50%',
            background: `radial-gradient(circle at 30% 30%, ${GOLD}, ${RED} 85%)`,
            border: `2px solid ${GOLD}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 30, boxShadow: `0 0 0 3px ${GOLD}22, 0 6px 14px rgba(193,39,45,0.4)`,
          }}>
            {isMid ? '💬' : '🎓'}
          </div>
          <h1 style={{ fontSize: 20, fontWeight: 900, margin: 0, color: 'var(--c-text)' }}>
            {data.title ?? (isMid ? 'Pause — Mini-conversation' : 'Révision finale — Conversation')}
          </h1>
          {cityName && (
            <div style={{ fontSize: 11, color: 'var(--c-sub)', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 800 }}>
              {cityName}
            </div>
          )}
        </div>
      </div>

      {/* Setting + theme */}
      {(data.content?.setting || data.content?.theme) && (
        <div style={{
          marginBottom: 18, padding: '12px 14px', borderRadius: 12,
          background: `linear-gradient(135deg, ${GREEN}10, ${GOLD}14)`,
          border: '1px solid rgba(212,168,75,0.35)',
          fontSize: 13, color: 'var(--c-sub)', lineHeight: 1.5,
          display: 'flex', flexDirection: 'column', gap: 4,
        }}>
          {data.content?.theme && (
            <div style={{ fontSize: 10, fontWeight: 900, letterSpacing: '0.1em', textTransform: 'uppercase', color: GOLD }}>
              {data.content.theme}
            </div>
          )}
          {data.content?.setting && <div>{data.content.setting}</div>}
        </div>
      )}

      {/* Progress */}
      <div style={{ marginBottom: 16 }}>
        <div style={{
          height: 6, borderRadius: 99, background: 'rgba(255,255,255,0.08)', overflow: 'hidden',
        }}>
          <div style={{
            height: '100%', width: `${progressPct}%`,
            background: `linear-gradient(90deg, ${GOLD}, ${RED})`,
            transition: 'width 280ms ease',
          }} />
        </div>
        <div style={{ fontSize: 11, color: 'var(--c-sub)', marginTop: 6, textAlign: 'right', fontWeight: 700 }}>
          {revealed} / {total}
        </div>
      </div>

      {/* Turns */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
        {turns.map((t, i) => {
          const visible = i < revealed;
          if (!visible) return null;
          const isA = t.speaker === 'A';
          return (
            <div
              key={i}
              style={{
                display: 'flex',
                justifyContent: isA ? 'flex-start' : 'flex-end',
                animation: 'revFadeIn 360ms ease',
              }}
            >
              <div
                style={{
                  maxWidth: '80%',
                  padding: '12px 14px',
                  borderRadius: 14,
                  background: isA ? 'rgba(28,176,246,0.1)' : 'rgba(255,150,0,0.1)',
                  border: `1.5px solid ${isA ? 'rgba(28,176,246,0.45)' : 'rgba(255,150,0,0.45)'}`,
                  position: 'relative',
                }}
              >
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10,
                  marginBottom: 6,
                }}>
                  <div style={{
                    fontSize: 10, fontWeight: 900, letterSpacing: '0.08em',
                    color: isA ? '#1cb0f6' : '#ff9600',
                  }}>
                    {isA ? 'VOIX A' : 'VOIX B'}
                  </div>
                  <button
                    onClick={() => handleReplay(t)}
                    title="Rejouer"
                    style={{
                      background: 'transparent', border: 'none', color: 'var(--c-sub)',
                      cursor: 'pointer', fontSize: 14, padding: 2,
                    }}
                  >
                    🔊
                  </button>
                </div>
                <div style={{ fontSize: 17, fontWeight: 800, color: 'var(--c-text)', lineHeight: 1.35 }}>
                  {t.darija}
                </div>
                {showTranslit && t.transliteration && (
                  <div style={{
                    direction: 'rtl', fontFamily: 'var(--font-amiri), serif',
                    fontSize: 18, marginTop: 6, color: 'var(--c-text)',
                    opacity: 0.9,
                  }}>
                    {t.transliteration}
                  </div>
                )}
                <div style={{ fontSize: 13, color: 'var(--c-sub)', marginTop: 6, fontStyle: 'italic' }}>
                  {t.french}
                </div>
              </div>
            </div>
          );
        })}

        {/* Hint placeholder when nothing revealed yet */}
        {revealed === 0 && (
          <div style={{
            padding: '18px 16px', borderRadius: 14,
            background: 'var(--c-card)', border: '1px dashed var(--c-border)',
            textAlign: 'center', fontSize: 13, color: 'var(--c-sub)',
          }}>
            👇 Appuie sur <strong>Révéler</strong> pour dérouler la conversation tour par tour.
          </div>
        )}
      </div>

      {/* Bonus XP banner (affiché à la fin) */}
      {done && xpAwarded !== null && (
        <div style={{
          marginBottom: 16, padding: '14px 16px', borderRadius: 12,
          background: xpAwarded > 0
            ? `linear-gradient(135deg, ${GOLD}30, ${RED}20)`
            : 'rgba(255,255,255,0.04)',
          border: `1.5px solid ${xpAwarded > 0 ? GOLD + '80' : 'var(--c-border)'}`,
          textAlign: 'center',
        }}>
          {xpAwarded > 0 ? (
            <>
              <div style={{ fontSize: 26, fontWeight: 900, color: GOLD, letterSpacing: '0.04em' }}>
                + {xpAwarded} XP
              </div>
              <div style={{ fontSize: 12, color: 'var(--c-sub)', marginTop: 2 }}>
                {isMid ? 'Bonus révision milieu' : 'Bonus révision finale'} — bien joué !
              </div>
            </>
          ) : (
            <div style={{ fontSize: 13, color: 'var(--c-sub)' }}>
              Révision déjà validée — pas de nouveau bonus XP.
            </div>
          )}
        </div>
      )}

      {/* Controls */}
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        {!done ? (
          <button
            onClick={handleReveal}
            style={{
              padding: '14px 40px', borderRadius: 14, border: 'none',
              background: `linear-gradient(135deg, ${GOLD}, ${RED})`,
              color: 'white', fontSize: 14, fontWeight: 900,
              letterSpacing: '0.06em', textTransform: 'uppercase',
              cursor: 'pointer', boxShadow: '0 6px 0 #8a1b21',
            }}
          >
            {revealed === 0 ? 'Commencer' : `Révéler (${revealed}/${total})`}
          </button>
        ) : (
          <button
            onClick={handleFinish}
            disabled={submitting}
            style={{
              padding: '14px 40px', borderRadius: 14, border: 'none',
              background: '#58cc02', color: 'white',
              fontSize: 14, fontWeight: 900, letterSpacing: '0.06em', textTransform: 'uppercase',
              cursor: submitting ? 'wait' : 'pointer', boxShadow: '0 6px 0 #3fa000',
              opacity: submitting ? 0.6 : 1,
            }}
          >
            {submitting ? 'Enregistrement…' : '✓ Terminer la révision'}
          </button>
        )}
      </div>

      <style jsx>{`
        @keyframes revFadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

/* ─── Exercises-mode revision renderer ─────────────────────────────────── */

function ExercisesRevision({
  data,
  content,
  cityName,
  positionLabel,
  onComplete,
  onQuit,
}: {
  data: RevisionDetail;
  content: RevisionExercisesContent;
  cityName: string;
  positionLabel: string;
  onComplete: () => Promise<{ alreadyCompleted: boolean; xpAwarded: number } | undefined | null>;
  onQuit: () => void;
}) {
  const isMid = data.position === 'MIDDLE';
  const exos = content.exercises ?? [];
  const [idx, setIdx] = useState(0);
  const [ready, setReady] = useState(false);
  const [finished, setFinished] = useState(false);
  const [xpAwarded, setXpAwarded] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const current = exos[idx] ?? null;
  const progressPct = exos.length === 0 ? 0 : Math.round(((idx + (ready ? 1 : 0)) / exos.length) * 100);

  useEffect(() => { setReady(false); }, [idx]);

  const handleNext = async () => {
    if (idx < exos.length - 1) {
      setIdx((i) => i + 1);
      return;
    }
    setFinished(true);
    setSubmitting(true);
    const res = await onComplete();
    setSubmitting(false);
    setXpAwarded(res?.alreadyCompleted ? 0 : (res?.xpAwarded ?? null));
  };

  const renderTypology = (typology: string, config: any) => {
    if (typology === 'VoixVisuel') {
      return <VoixVisuel key={idx} config={config as VoixVisuelConfig} onReadyChange={setReady} />;
    }
    if (typology === 'TrouverIntrus') {
      return <TrouverIntrus key={idx} config={config as TrouverIntrusConfig} onReadyChange={setReady} />;
    }
    return (
      <div style={{ color: '#ff4b4b', fontSize: 13 }}>
        Typologie inconnue : <code>{typology}</code>
      </div>
    );
  };

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '20px 16px 80px', color: 'var(--c-text)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <button onClick={onQuit} style={{ background: 'transparent', border: 'none', color: 'var(--c-sub)', cursor: 'pointer', fontSize: 14 }}>
          ← Quitter
        </button>
        <div style={{ fontSize: 11, fontWeight: 900, letterSpacing: '0.08em', textTransform: 'uppercase', color: GOLD }}>
          {positionLabel}
        </div>
        <div style={{ fontSize: 11, color: 'var(--c-sub)', fontWeight: 800 }}>
          {Math.min(idx + 1, exos.length)}/{exos.length}
        </div>
      </div>

      <div style={{ textAlign: 'center', marginBottom: 16 }}>
        <div style={{
          width: 60, height: 60, borderRadius: '50%',
          background: `radial-gradient(circle at 30% 30%, ${GOLD}, ${RED} 85%)`,
          border: `2px solid ${GOLD}`,
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 26, boxShadow: `0 0 0 3px ${GOLD}22, 0 6px 14px rgba(193,39,45,0.4)`,
        }}>
          {isMid ? '💬' : '🎓'}
        </div>
        <h1 style={{ fontSize: 18, fontWeight: 900, margin: '10px 0 0', color: 'var(--c-text)' }}>
          {data.title ?? (isMid ? 'Pause — Révision' : 'Révision finale')}
        </h1>
        {cityName && (
          <div style={{ fontSize: 11, color: 'var(--c-sub)', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 800, marginTop: 2 }}>
            {cityName}
          </div>
        )}
      </div>

      <div style={{ marginBottom: 18 }}>
        <div style={{ height: 6, borderRadius: 99, background: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${progressPct}%`, background: `linear-gradient(90deg, ${GOLD}, ${RED})`, transition: 'width 280ms ease' }} />
        </div>
      </div>

      {!finished && current && (
        <div style={{ padding: '14px 12px', borderRadius: 14, background: 'var(--c-card)', border: '1px solid var(--c-border)' }}>
          {renderTypology(current.typology, current.config)}
        </div>
      )}

      {finished && (
        <div style={{
          marginTop: 18, padding: '16px 18px', borderRadius: 14,
          background: xpAwarded && xpAwarded > 0
            ? `linear-gradient(135deg, ${GOLD}30, ${RED}20)`
            : 'rgba(255,255,255,0.04)',
          border: `1.5px solid ${xpAwarded && xpAwarded > 0 ? GOLD + '80' : 'var(--c-border)'}`,
          textAlign: 'center',
        }}>
          {xpAwarded && xpAwarded > 0 ? (
            <>
              <div style={{ fontSize: 26, fontWeight: 900, color: GOLD }}>+ {xpAwarded} XP</div>
              <div style={{ fontSize: 12, color: 'var(--c-sub)', marginTop: 2 }}>
                {isMid ? 'Bonus révision milieu' : 'Bonus révision finale'} — bien joué !
              </div>
            </>
          ) : (
            <div style={{ fontSize: 13, color: 'var(--c-sub)' }}>
              Révision déjà validée — pas de nouveau bonus XP.
            </div>
          )}
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 20 }}>
        {!finished ? (
          <button
            onClick={handleNext}
            disabled={!ready}
            style={{
              padding: '14px 40px', borderRadius: 14, border: 'none',
              background: ready ? `linear-gradient(135deg, ${GOLD}, ${RED})` : 'rgba(255,255,255,0.1)',
              color: ready ? 'white' : 'var(--c-sub)',
              fontSize: 14, fontWeight: 900, letterSpacing: '0.06em', textTransform: 'uppercase',
              cursor: ready ? 'pointer' : 'not-allowed',
              boxShadow: ready ? '0 6px 0 #8a1b21' : 'none',
              transition: 'all 0.15s',
            }}
          >
            Continuer
          </button>
        ) : (
          <button
            onClick={onQuit}
            disabled={submitting}
            style={{
              padding: '14px 40px', borderRadius: 14, border: 'none',
              background: '#58cc02', color: 'white',
              fontSize: 14, fontWeight: 900, letterSpacing: '0.06em', textTransform: 'uppercase',
              cursor: submitting ? 'wait' : 'pointer', boxShadow: '0 6px 0 #3fa000',
              opacity: submitting ? 0.6 : 1,
            }}
          >
            {submitting ? 'Enregistrement…' : '✓ Retour aux cours'}
          </button>
        )}
      </div>
    </div>
  );
}
