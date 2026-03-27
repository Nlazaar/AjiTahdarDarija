'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useUserProgress } from '@/contexts/UserProgressContext';
import { getQuestState, claimQuestReward } from '@/lib/api';

/* ─── Colors ──────────────────────────────────────────────────────────────── */
const CARD   = 'var(--c-card)';
const CARD2  = 'var(--c-card2)';
const BORDER = 'var(--c-border)';
const TEXT   = 'var(--c-text)';
const SUB    = 'var(--c-sub)';
const GREEN  = '#58cc02';

/* ── Helpers ──────────────────────────────────────────────────────────────── */
function msUntilMidnight() {
  const now  = new Date();
  const next = new Date(now);
  next.setHours(24, 0, 0, 0);
  return next.getTime() - now.getTime();
}
function formatCountdown(ms: number) {
  const h = Math.floor(ms / 3_600_000);
  const m = Math.floor((ms % 3_600_000) / 60_000);
  return `${h}h ${m.toString().padStart(2, '0')}min`;
}
function daysLeftInMonth() {
  const now  = new Date();
  const last = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  return last.getDate() - now.getDate();
}
function monthLabel(yearMonth: string) {
  const [y, m] = yearMonth.split('-').map(Number);
  return new Date(y, m - 1, 1).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
}
function currentMonthName() {
  return new Date().toLocaleDateString('fr-FR', { month: 'long' }).toUpperCase();
}

/* ── Monthly quest card ───────────────────────────────────────────────────── */
function MonthlyCard({ monthly }: { monthly: any }) {
  if (!monthly) return null;
  const done   = monthly.questsDone   ?? 0;
  const target = monthly.questsTarget ?? 30;
  const pct    = Math.min(100, Math.round((done / target) * 100));
  const days   = daysLeftInMonth();

  return (
    <div style={{
      background: 'linear-gradient(135deg, #f59e0b, #f97316)',
      borderRadius: 24, padding: '20px 20px 22px',
      marginBottom: 24, position: 'relative', overflow: 'hidden',
    }}>
      <div style={{
        display: 'inline-block', background: 'rgba(255,255,255,0.25)',
        color: 'white', fontWeight: 900, fontSize: 11,
        padding: '4px 10px', borderRadius: 8,
        letterSpacing: '0.06em', marginBottom: 8,
      }}>
        {currentMonthName()}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
        <div>
          <h2 style={{ color: 'white', fontWeight: 900, fontSize: 20, margin: '0 0 4px' }}>
            Quête de {new Date().toLocaleDateString('fr-FR', { month: 'long' })}
          </h2>
          <div style={{ color: 'rgba(255,255,255,0.85)', fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 5 }}>
            ⏱ {days} jour{days > 1 ? 's' : ''} restant{days > 1 ? 's' : ''}
          </div>
        </div>
        <div style={{ fontSize: 44, lineHeight: 1 }}>🏆</div>
      </div>

      <div style={{ background: 'rgba(0,0,0,0.2)', borderRadius: 16, padding: '14px 16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <span style={{ color: 'white', fontWeight: 800, fontSize: 14 }}>Termine {target} quêtes du jour</span>
          <span style={{ color: 'rgba(255,255,255,0.8)', fontWeight: 900, fontSize: 14 }}>{done}/{target}</span>
        </div>
        <div style={{ height: 10, background: 'rgba(255,255,255,0.2)', borderRadius: 99, overflow: 'hidden' }}>
          <div style={{
            height: '100%', borderRadius: 99, width: `${pct}%`,
            background: 'white', transition: 'width 0.6s cubic-bezier(.4,0,.2,1)',
          }} />
        </div>
        <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.75)', fontWeight: 600 }}>Récompense :</span>
          <span style={{ fontSize: 13, color: 'white', fontWeight: 900 }}>500 💎 + badge mensuel</span>
        </div>
      </div>

      {monthly.completed && !monthly.claimedAt && (
        <div style={{
          marginTop: 12, padding: '10px 16px', borderRadius: 12,
          background: 'rgba(255,255,255,0.25)',
          color: 'white', fontWeight: 800, fontSize: 13, textAlign: 'center',
        }}>
          🎉 Quête mensuelle terminée ! Gemmes créditées automatiquement.
        </div>
      )}
    </div>
  );
}

/* ── Daily quest row ──────────────────────────────────────────────────────── */
function DailyQuestRow({ quest, onClaim, claiming }: {
  quest: any; onClaim: (key: string) => void; claiming: boolean;
}) {
  const pct      = Math.min(100, Math.round((quest.current / quest.target) * 100));
  const isDone   = quest.completed;
  const isClaimed = quest.claimed;

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 14,
      padding: '16px 18px',
      borderBottom: `1px solid ${BORDER}`,
      background: isDone && !isClaimed ? 'rgba(245,158,11,0.08)' : 'transparent',
      transition: 'background 0.2s',
    }}>
      {/* Icon */}
      <div style={{
        width: 48, height: 48, borderRadius: 14, flexShrink: 0,
        background: isClaimed ? 'rgba(88,204,2,0.15)' : isDone ? 'rgba(245,158,11,0.2)' : CARD2,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 22,
        border: `1px solid ${isClaimed ? 'rgba(88,204,2,0.3)' : isDone ? 'rgba(245,158,11,0.3)' : BORDER}`,
      }}>
        {isClaimed ? '✅' : quest.icon}
      </div>

      {/* Label + bar */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 800, color: isClaimed ? SUB : TEXT, marginBottom: 6 }}>
          {quest.label}
        </div>
        <div style={{ height: 8, background: 'var(--c-border)', borderRadius: 99, overflow: 'hidden', marginBottom: 5 }}>
          <div style={{
            height: '100%', borderRadius: 99, width: `${pct}%`,
            background: isClaimed
              ? GREEN
              : isDone
                ? 'linear-gradient(90deg, #f59e0b, #fbbf24)'
                : 'linear-gradient(90deg, #60a5fa, #3b82f6)',
            transition: 'width 0.6s cubic-bezier(.4,0,.2,1)',
          }} />
        </div>
        <div style={{ fontSize: 11, color: SUB, fontWeight: 700 }}>
          {quest.current.toLocaleString()} / {quest.target.toLocaleString()}
        </div>
      </div>

      {/* Reward / claim */}
      <div style={{ flexShrink: 0, textAlign: 'center' }}>
        {isClaimed ? (
          <div style={{
            padding: '7px 12px', borderRadius: 10,
            background: 'rgba(88,204,2,0.15)', color: GREEN,
            fontSize: 11, fontWeight: 900, border: '1px solid rgba(88,204,2,0.25)',
          }}>
            Réclamé ✓
          </div>
        ) : isDone ? (
          <button
            onClick={() => onClaim(quest.key)}
            disabled={claiming}
            style={{
              padding: '8px 14px', borderRadius: 10, border: 'none',
              background: claiming ? CARD2 : 'linear-gradient(135deg, #f59e0b, #f97316)',
              color: claiming ? SUB : 'white',
              fontSize: 12, fontWeight: 900, cursor: claiming ? 'default' : 'pointer',
              boxShadow: claiming ? 'none' : '0 3px 0 rgba(245,158,11,0.4)',
              transition: 'all 0.15s',
            }}
          >
            {claiming ? '…' : `🎁 +${quest.reward} 💎`}
          </button>
        ) : (
          <div style={{
            padding: '7px 12px', borderRadius: 10,
            background: CARD2, border: `1px solid ${BORDER}`,
            fontSize: 11, fontWeight: 800, color: SUB,
          }}>
            🎁 {quest.reward} 💎
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Monthly badge history ────────────────────────────────────────────────── */
function MonthlyBadges({ months }: { months: any[] }) {
  if (!months || months.length === 0) return null;
  return (
    <div style={{
      background: CARD, borderRadius: 20, padding: '18px',
      border: `1px solid ${BORDER}`, marginTop: 20,
    }}>
      <h3 style={{ fontSize: 15, fontWeight: 900, color: TEXT, margin: '0 0 14px' }}>
        Badges mensuels 🏅
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {months.map((m: any) => (
          <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 42, height: 42, borderRadius: 12, flexShrink: 0,
              background: 'linear-gradient(135deg, #f59e0b, #f97316)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20,
            }}>
              🏆
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 800, color: TEXT }}>
                Quête de {monthLabel(m.yearMonth).split(' ')[0]}
              </div>
              <div style={{ fontSize: 11, color: SUB, fontWeight: 600 }}>
                {monthLabel(m.yearMonth)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Page ─────────────────────────────────────────────────────────────────── */
export default function QuestsPage() {
  const { addGemmes, syncFromBackend } = useUserProgress();

  const [state,     setState]    = useState<any>(null);
  const [loading,   setLoading]  = useState(true);
  const [claiming,  setClaiming] = useState<string | null>(null);
  const [toast,     setToast]    = useState<{ msg: string; ok: boolean } | null>(null);
  const [countdown, setCountdown] = useState(msUntilMidnight());

  useEffect(() => {
    const t = setInterval(() => setCountdown(msUntilMidnight()), 60_000);
    return () => clearInterval(t);
  }, []);

  const load = useCallback(() => {
    getQuestState().then(data => { setState(data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const showToast = (msg: string, ok: boolean) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3000);
  };

  const handleClaim = async (key: string) => {
    setClaiming(key);
    try {
      const res = await claimQuestReward(key);
      if (res.success) {
        addGemmes(res.gemmesEarned);
        await syncFromBackend();
        load();
        showToast(`+${res.gemmesEarned} 💎 réclamés !`, true);
      }
    } catch { showToast('Erreur lors de la réclamation.', false); }
    setClaiming(null);
  };

  const daily      = state?.daily      ?? [];
  const monthly    = state?.monthly    ?? null;
  const pastMonths = state?.pastMonths ?? [];
  const allClaimed   = daily.length > 0 && daily.every((q: any) => q.claimed);
  const claimedCount = daily.filter((q: any) => q.claimed).length;

  return (
    <div style={{ maxWidth: 640, margin: '0 auto', padding: '0 16px 80px', color: TEXT }}>

      {/* Header */}
      <div style={{ padding: '32px 0 20px' }}>
        <h1 style={{ fontSize: 28, fontWeight: 900, color: TEXT, marginBottom: 4 }}>Quêtes</h1>
        <p style={{ fontSize: 14, color: SUB, margin: 0 }}>
          Relève des défis quotidiens et remporte des gemmes !
        </p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: SUB }}>Chargement…</div>
      ) : (
        <>
          <MonthlyCard monthly={monthly} />

          {/* Daily quests */}
          <div style={{ marginBottom: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <h2 style={{ fontSize: 17, fontWeight: 900, color: TEXT, margin: 0 }}>
                Quêtes du jour
                <span style={{ fontSize: 13, fontWeight: 700, color: SUB, marginLeft: 8 }}>
                  {claimedCount}/{daily.length}
                </span>
              </h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, fontWeight: 800, color: '#f59e0b' }}>
                ⏱ {formatCountdown(countdown)}
              </div>
            </div>

            <div style={{
              background: CARD, borderRadius: 20, overflow: 'hidden',
              border: `1px solid ${BORDER}`,
            }}>
              {daily.length === 0 ? (
                <div style={{ padding: '40px', textAlign: 'center', color: SUB }}>
                  Aucune quête disponible
                </div>
              ) : (
                daily.map((quest: any, i: number) => (
                  <div key={quest.key} style={{ borderBottom: i === daily.length - 1 ? 'none' : undefined }}>
                    <DailyQuestRow quest={quest} onClaim={handleClaim} claiming={claiming === quest.key} />
                  </div>
                ))
              )}
            </div>

            {allClaimed && (
              <div style={{
                marginTop: 14, padding: '14px 18px', borderRadius: 16,
                background: 'rgba(88,204,2,0.12)', border: '1px solid rgba(88,204,2,0.3)',
                textAlign: 'center',
              }}>
                <div style={{ fontSize: 22, marginBottom: 4 }}>🎉</div>
                <div style={{ fontSize: 14, fontWeight: 900, color: GREEN }}>
                  Toutes les quêtes du jour terminées !
                </div>
                <div style={{ fontSize: 12, color: SUB, marginTop: 2 }}>
                  Reviens demain pour de nouvelles quêtes.
                </div>
              </div>
            )}
          </div>

          <MonthlyBadges months={pastMonths} />

          {/* Info */}
          <div style={{
            marginTop: 20, background: CARD, borderRadius: 18, padding: '14px 18px',
            border: `1px solid ${BORDER}`, display: 'flex', alignItems: 'flex-start', gap: 12,
          }}>
            <span style={{ fontSize: 22, flexShrink: 0 }}>💡</span>
            <div style={{ fontSize: 12, color: SUB, lineHeight: 1.6 }}>
              Les quêtes se réinitialisent chaque jour à minuit. Complète-les toutes pour
              progresser vers la <strong style={{ color: '#f59e0b' }}>quête mensuelle</strong> et gagner 500 gemmes bonus !
            </div>
          </div>
        </>
      )}

      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', bottom: 90, left: '50%', transform: 'translateX(-50%)',
          background: toast.ok ? GREEN : '#ff4b4b',
          color: 'white', padding: '12px 24px', borderRadius: 14,
          fontSize: 13, fontWeight: 800, zIndex: 2000,
          boxShadow: toast.ok ? '0 4px 20px rgba(88,204,2,0.4)' : '0 4px 20px rgba(255,75,75,0.4)',
          whiteSpace: 'nowrap',
        }}>
          {toast.msg}
        </div>
      )}
    </div>
  );
}
