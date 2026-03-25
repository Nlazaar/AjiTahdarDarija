'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useUserProgress } from '@/contexts/UserProgressContext';
import { getQuestState, claimQuestReward } from '@/lib/api';

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

/* ── Progress bar ─────────────────────────────────────────────────────────── */
function QuestBar({
  current, target, color = '#f59e0b',
}: { current: number; target: number; color?: string }) {
  const pct = Math.min(100, Math.round((current / target) * 100));
  return (
    <div style={{ height: 10, background: 'rgba(255,255,255,0.2)', borderRadius: 99, overflow: 'hidden' }}>
      <div style={{
        height: '100%', borderRadius: 99,
        width: `${pct}%`,
        background: color,
        transition: 'width 0.6s cubic-bezier(.4,0,.2,1)',
      }} />
    </div>
  );
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
      {/* Month badge */}
      <div style={{
        display: 'inline-block',
        background: 'rgba(255,255,255,0.25)',
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

      {/* Progress block */}
      <div style={{
        background: 'rgba(0,0,0,0.2)', borderRadius: 16, padding: '14px 16px',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <span style={{ color: 'white', fontWeight: 800, fontSize: 14 }}>
            Termine {target} quêtes du jour
          </span>
          <span style={{ color: 'rgba(255,255,255,0.8)', fontWeight: 900, fontSize: 14 }}>
            {done}/{target}
          </span>
        </div>
        <QuestBar current={done} target={target} color="white" />

        {/* Reward hint */}
        <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.75)', fontWeight: 600 }}>
            Récompense :
          </span>
          <span style={{ fontSize: 13, color: 'white', fontWeight: 900 }}>500 💎 + badge mensuel</span>
        </div>
      </div>

      {/* Completion banner */}
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
function DailyQuestRow({
  quest, onClaim, claiming,
}: {
  quest: any;
  onClaim: (key: string) => void;
  claiming: boolean;
}) {
  const pct       = Math.min(100, Math.round((quest.current / quest.target) * 100));
  const isDone    = quest.completed;
  const isClaimed = quest.claimed;

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 14,
      padding: '16px 18px',
      borderBottom: '1.5px solid #f3f4f6',
      background: isDone && !isClaimed ? '#fffbeb' : 'white',
      transition: 'background 0.2s',
    }}>
      {/* Icon */}
      <div style={{
        width: 48, height: 48, borderRadius: 14, flexShrink: 0,
        background: isClaimed ? '#d1fae5' : isDone ? '#fef3c7' : '#f3f4f6',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 22,
        boxShadow: isDone && !isClaimed ? '0 2px 8px rgba(245,158,11,0.25)' : 'none',
      }}>
        {isClaimed ? '✅' : quest.icon}
      </div>

      {/* Label + bar */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 800, color: isClaimed ? '#9ca3af' : '#111827', marginBottom: 6 }}>
          {quest.label}
        </div>
        <div style={{ height: 8, background: '#f3f4f6', borderRadius: 99, overflow: 'hidden', marginBottom: 5 }}>
          <div style={{
            height: '100%', borderRadius: 99,
            width: `${pct}%`,
            background: isClaimed
              ? '#10b981'
              : isDone
                ? 'linear-gradient(90deg, #f59e0b, #fbbf24)'
                : 'linear-gradient(90deg, #60a5fa, #3b82f6)',
            transition: 'width 0.6s cubic-bezier(.4,0,.2,1)',
          }} />
        </div>
        <div style={{ fontSize: 11, color: '#9ca3af', fontWeight: 700 }}>
          {quest.current.toLocaleString()} / {quest.target.toLocaleString()}
        </div>
      </div>

      {/* Reward / claim button */}
      <div style={{ flexShrink: 0, textAlign: 'center' }}>
        {isClaimed ? (
          <div style={{
            padding: '7px 12px', borderRadius: 10,
            background: '#d1fae5', color: '#059669',
            fontSize: 11, fontWeight: 900,
          }}>
            Réclamé ✓
          </div>
        ) : isDone ? (
          <button
            onClick={() => onClaim(quest.key)}
            disabled={claiming}
            style={{
              padding: '8px 14px', borderRadius: 10, border: 'none',
              background: claiming ? '#f3f4f6' : 'linear-gradient(135deg, #f59e0b, #f97316)',
              color: claiming ? '#9ca3af' : 'white',
              fontSize: 12, fontWeight: 900, cursor: claiming ? 'default' : 'pointer',
              boxShadow: '0 2px 8px rgba(245,158,11,0.3)',
              transition: 'all 0.15s',
            }}
          >
            {claiming ? '…' : `🎁 +${quest.reward} 💎`}
          </button>
        ) : (
          <div style={{
            padding: '7px 12px', borderRadius: 10,
            background: '#f3f4f6',
            fontSize: 11, fontWeight: 800, color: '#9ca3af',
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
      background: 'white', borderRadius: 20, padding: '18px 18px',
      border: '2px solid #f0f0f0', boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
      marginTop: 20,
    }}>
      <h3 style={{ fontSize: 15, fontWeight: 900, color: '#111827', margin: '0 0 14px' }}>
        Badges mensuels 🏅
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {months.map((m: any) => (
          <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 42, height: 42, borderRadius: 12, flexShrink: 0,
              background: 'linear-gradient(135deg, #f59e0b, #f97316)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 20,
            }}>
              🏆
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 800, color: '#111827' }}>
                Quête de {monthLabel(m.yearMonth).split(' ')[0]}
              </div>
              <div style={{ fontSize: 11, color: '#9ca3af', fontWeight: 600 }}>
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

  const [state,    setState]   = useState<any>(null);
  const [loading,  setLoading] = useState(true);
  const [claiming, setClaiming] = useState<string | null>(null);
  const [toast,    setToast]   = useState<{ msg: string; ok: boolean } | null>(null);
  const [countdown, setCountdown] = useState(msUntilMidnight());

  // Countdown ticker
  useEffect(() => {
    const t = setInterval(() => setCountdown(msUntilMidnight()), 60_000);
    return () => clearInterval(t);
  }, []);

  const load = useCallback(() => {
    getQuestState().then(data => {
      setState(data);
      setLoading(false);
    }).catch(() => setLoading(false));
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
    } catch {
      showToast('Erreur lors de la réclamation.', false);
    }
    setClaiming(null);
  };

  const daily      = state?.daily      ?? [];
  const monthly    = state?.monthly    ?? null;
  const pastMonths = state?.pastMonths ?? [];

  const allClaimed    = daily.length > 0 && daily.every((q: any) => q.claimed);
  const claimedCount  = daily.filter((q: any) => q.claimed).length;

  return (
    <div style={{ maxWidth: 640, margin: '0 auto', padding: '0 16px 80px' }}>

      {/* Header */}
      <div style={{ padding: '32px 0 20px' }}>
        <h1 style={{ fontSize: 28, fontWeight: 900, color: '#111827', marginBottom: 4 }}>Quêtes</h1>
        <p style={{ fontSize: 14, color: '#6b7280', margin: 0 }}>
          Relève des défis quotidiens et remporte des gemmes !
        </p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#9ca3af' }}>Chargement…</div>
      ) : (
        <>
          {/* Monthly quest */}
          <MonthlyCard monthly={monthly} />

          {/* Daily quests */}
          <div style={{ marginBottom: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <h2 style={{ fontSize: 17, fontWeight: 900, color: '#111827', margin: 0 }}>
                Quêtes du jour
                <span style={{ fontSize: 13, fontWeight: 700, color: '#9ca3af', marginLeft: 8 }}>
                  {claimedCount}/{daily.length}
                </span>
              </h2>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 5,
                fontSize: 12, fontWeight: 800, color: '#f59e0b',
              }}>
                ⏱ {formatCountdown(countdown)}
              </div>
            </div>

            <div style={{
              background: 'white', borderRadius: 20, overflow: 'hidden',
              border: '2px solid #f0f0f0', boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            }}>
              {daily.length === 0 ? (
                <div style={{ padding: '40px', textAlign: 'center', color: '#9ca3af' }}>
                  Aucune quête disponible
                </div>
              ) : (
                daily.map((quest: any, i: number) => (
                  <div key={quest.key} style={{ borderBottom: i === daily.length - 1 ? 'none' : undefined }}>
                    <DailyQuestRow
                      quest={quest}
                      onClaim={handleClaim}
                      claiming={claiming === quest.key}
                    />
                  </div>
                ))
              )}
            </div>

            {allClaimed && (
              <div style={{
                marginTop: 14, padding: '14px 18px', borderRadius: 16,
                background: 'linear-gradient(135deg, #d1fae5, #a7f3d0)',
                border: '2px solid #6ee7b7', textAlign: 'center',
              }}>
                <div style={{ fontSize: 22, marginBottom: 4 }}>🎉</div>
                <div style={{ fontSize: 14, fontWeight: 900, color: '#059669' }}>
                  Toutes les quêtes du jour terminées !
                </div>
                <div style={{ fontSize: 12, color: '#6b7280', marginTop: 2 }}>
                  Reviens demain pour de nouvelles quêtes.
                </div>
              </div>
            )}
          </div>

          {/* Monthly badge history */}
          <MonthlyBadges months={pastMonths} />

          {/* Info */}
          <div style={{
            marginTop: 20, background: 'white', borderRadius: 18, padding: '14px 18px',
            border: '2px solid #f0f0f0', display: 'flex', alignItems: 'flex-start', gap: 12,
          }}>
            <span style={{ fontSize: 22, flexShrink: 0 }}>💡</span>
            <div style={{ fontSize: 12, color: '#6b7280', lineHeight: 1.6 }}>
              Les quêtes se réinitialisent chaque jour à minuit. Complète-les toutes pour
              progresser vers la <strong>quête mensuelle</strong> et gagner 500 gemmes bonus !
            </div>
          </div>
        </>
      )}

      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', bottom: 90, left: '50%', transform: 'translateX(-50%)',
          background: toast.ok ? '#111827' : '#dc2626',
          color: 'white', padding: '12px 24px', borderRadius: 14,
          fontSize: 13, fontWeight: 800, zIndex: 2000,
          boxShadow: '0 4px 20px rgba(0,0,0,0.2)', whiteSpace: 'nowrap',
        }}>
          {toast.msg}
        </div>
      )}
    </div>
  );
}
